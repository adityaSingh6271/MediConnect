import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/prisma';

export const getDoctorProfile = async (req: AuthRequest, res: Response) => {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id: req.user?.id },
            select: { id: true, name: true, email: true, phone: true, specialty: true, yearsOfExperience: true, profilePic: true },
        });
        res.json(doctor);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctorConsultations = async (req: AuthRequest, res: Response) => {
    try {
        const consultations = await prisma.consultation.findMany({
            where: { doctorId: req.user?.id },
            include: {
                patient: {
                    select: { name: true, age: true, email: true, phone: true, historyOfSurgery: true, historyOfIllness: true },
                },
                prescription: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(consultations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
