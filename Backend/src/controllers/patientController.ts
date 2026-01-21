import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../utils/prisma';
import { z } from 'zod';

export const getPatientProfile = async (req: AuthRequest, res: Response) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: req.user?.id },
            select: { id: true, name: true, age: true, email: true, phone: true, profilePic: true, historyOfSurgery: true, historyOfIllness: true },
        });
        res.json(patient);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await prisma.doctor.findMany({
            select: { id: true, name: true, specialty: true, profilePic: true, yearsOfExperience: true },
        });
        res.json(doctors);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const consultationSchema = z.object({
    doctorId: z.string(),
    currentIllnessHistory: z.string(),
    recentSurgery: z.string().optional(),
    isDiabetic: z.boolean(),
    allergies: z.string().optional(),
    others: z.string().optional(),
    transactionId: z.string(),
});

export const createConsultation = async (req: AuthRequest, res: Response) => {
    try {
        const data = consultationSchema.parse(req.body);
        const consultation = await prisma.consultation.create({
            data: {
                ...data,
                patientId: req.user?.id!,
            },
        });
        res.status(201).json(consultation);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getPatientConsultations = async (req: AuthRequest, res: Response) => {
    try {
        const consultations = await prisma.consultation.findMany({
            where: { patientId: req.user?.id },
            include: {
                doctor: {
                    select: { name: true, specialty: true },
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
