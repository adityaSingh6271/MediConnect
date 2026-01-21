import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/prisma';
import { z } from 'zod';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const prescriptionSchema = z.object({
    consultationId: z.string(),
    careToBeTaken: z.string(),
    medicines: z.string(),
});

export const createOrUpdatePrescription = async (req: AuthRequest, res: Response) => {
    try {
        const { consultationId, careToBeTaken, medicines } = prescriptionSchema.parse(req.body);

        const consultation = await prisma.consultation.findUnique({
            where: { id: consultationId },
            include: { doctor: true, patient: true },
        });

        if (!consultation || consultation.doctorId !== req.user?.id) {
            return res.status(403).json({ message: 'Unauthorized or consultation not found' });
        }

        const prescription = await prisma.prescription.upsert({
            where: { consultationId },
            update: { careToBeTaken, medicines },
            create: { consultationId, careToBeTaken, medicines },
        });

        // Generate PDF
        const pdfFileName = `prescription_${prescription.id}.pdf`;
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const pdfPath = path.join(uploadsDir, pdfFileName);
        const doc = new (PDFDocument as any)();
        const stream = fs.createWriteStream(pdfPath);

        doc.pipe(stream);
        doc.fontSize(25).fillColor('#2563eb').text('MediConnect', { align: 'center' });
        doc.fontSize(12).fillColor('#4b5563').text('Official Digital Prescription', { align: 'center' });
        doc.moveDown();
        doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        doc.fontSize(14).fillColor('#1f2937').text(`Doctor Information:`, { underline: true });
        doc.fontSize(12).fillColor('#4b5563').text(`Name: Dr. ${consultation.doctor.name}`);
        doc.text(`Specialty: ${consultation.doctor.specialty}`);
        doc.moveDown();

        doc.fontSize(14).fillColor('#1f2937').text(`Patient Information:`, { underline: true });
        doc.fontSize(12).fillColor('#4b5563').text(`Name: ${consultation.patient.name}`);
        doc.text(`Age: ${consultation.patient.age} Years`);
        doc.moveDown();

        doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        doc.fontSize(14).fillColor('#1f2937').text('Treatment Plan:', { underline: true });
        doc.fontSize(12).fillColor('#4b5563').text('Care to be taken:', { bold: true });
        doc.text(careToBeTaken, { indent: 20 });
        doc.moveDown(0.5);
        doc.fontSize(12).text('Medicines:', { bold: true });
        doc.text(medicines, { indent: 20 });

        doc.moveDown(2);
        doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();
        doc.fontSize(10).fillColor('#9ca3af').text(`This is a digitally generated prescription valid without physical signature.`, { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.end();

        stream.on('finish', async () => {
            const updatedPrescription = await prisma.prescription.update({
                where: { id: prescription.id },
                data: { pdfUrl: `/uploads/${pdfFileName}` },
            });
            res.json(updatedPrescription);
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
