import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import prisma from "../utils/prisma";
import { z } from "zod";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import supabase from "../utils/supabase";

const prescriptionSchema = z.object({
    consultationId: z.string(),
    careToBeTaken: z.string(),
    medicines: z.string(),
});

export const createOrUpdatePrescription = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const { consultationId, careToBeTaken, medicines } =
            prescriptionSchema.parse(req.body);

        const consultation = await prisma.consultation.findUnique({
            where: { id: consultationId },
            include: { doctor: true, patient: true },
        });

        if (!consultation || consultation.doctorId !== req.user?.id) {
            return res
                .status(403)
                .json({ message: "Unauthorized or consultation not found" });
        }

        const prescription = await prisma.prescription.upsert({
            where: { consultationId },
            update: { careToBeTaken, medicines },
            create: { consultationId, careToBeTaken, medicines },
        });

        /* ---------- PDF GENERATION (IN MEMORY) ---------- */
        const pdfStream = new PassThrough();
        const doc = new PDFDocument({ size: "A4", margin: 50 });

        doc.pipe(pdfStream);

        doc.fontSize(24).text("MediConnect", { align: "center" });
        doc.fontSize(12).text("Official Digital Prescription", {
            align: "center",
        });

        doc.moveDown();
        doc.text(`Doctor: Dr. ${consultation.doctor.name}`);
        doc.text(`Specialty: ${consultation.doctor.specialty}`);
        doc.moveDown();
        doc.text(`Patient: ${consultation.patient.name}`);
        doc.text(`Age: ${consultation.patient.age} Years`);
        doc.moveDown();
        doc.text("Care to be taken:");
        doc.text(careToBeTaken, { indent: 20 });
        doc.moveDown();
        doc.text("Medicines:");
        doc.text(medicines, { indent: 20 });
        doc.moveDown();
        doc.fontSize(10).text(
            "Digitally generated prescription. No signature required.",
            { align: "center" }
        );

        doc.end();

        /* ---------- STREAM → BUFFER ---------- */
        const chunks: Buffer[] = [];
        pdfStream.on("data", (chunk) => chunks.push(chunk));

        await new Promise((resolve) => pdfStream.on("end", resolve));
        const pdfBuffer = Buffer.concat(chunks);

        /* ---------- UPLOAD TO SUPABASE ---------- */
        const filePath = `prescription_${prescription.id}.pdf`;

        const { error: uploadError } = await supabase.storage
            .from("prescriptions")
            .upload(filePath, pdfBuffer, {
                contentType: "application/pdf",
                upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from("prescriptions")
            .getPublicUrl(filePath);

        const updatedPrescription = await prisma.prescription.update({
            where: { id: prescription.id },
            data: { pdfUrl: data.publicUrl },
        });

        res.json(updatedPrescription);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};
