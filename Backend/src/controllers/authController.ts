import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { z } from 'zod';

const doctorSignupSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    specialty: z.string().min(2, 'Specialty is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    yearsOfExperience: z.coerce.number().min(0, 'Experience must be a positive number'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    profilePic: z.string().optional(),
});

const patientSignupSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    age: z.coerce.number().min(0, 'Age must be a positive number'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    profilePic: z.string().optional(),
    historyOfSurgery: z.string().optional(),
    historyOfIllness: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const doctorSignup = async (req: Request, res: Response) => {
    try {
        const data = doctorSignupSchema.parse(req.body);
        const existingDoctor = await prisma.doctor.findFirst({
            where: { OR: [{ email: data.email }, { phone: data.phone }] },
        });

        if (existingDoctor) {
            return res.status(400).json({ message: 'Email or phone already exists' });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

        const doctor = await prisma.doctor.create({
            data: {
                ...data,
                password: hashedPassword,
                profilePic: profilePic || data.profilePic
            },
        });

        const token = jwt.sign({ id: doctor.id, role: 'DOCTOR' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: doctor.id, name: doctor.name, role: 'DOCTOR' } });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const doctorLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const doctor = await prisma.doctor.findUnique({ where: { email } });

        if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: doctor.id, role: 'DOCTOR' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        res.json({ token, user: { id: doctor.id, name: doctor.name, role: 'DOCTOR' } });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const patientSignup = async (req: Request, res: Response) => {
    try {
        const data = patientSignupSchema.parse(req.body);
        const existingPatient = await prisma.patient.findFirst({
            where: { OR: [{ email: data.email }, { phone: data.phone }] },
        });

        if (existingPatient) {
            return res.status(400).json({ message: 'Email or phone already exists' });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

        const patient = await prisma.patient.create({
            data: {
                ...data,
                password: hashedPassword,
                profilePic: profilePic || data.profilePic
            },
        });

        const token = jwt.sign({ id: patient.id, role: 'PATIENT' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: patient.id, name: patient.name, role: 'PATIENT' } });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const patientLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const patient = await prisma.patient.findUnique({ where: { email } });

        if (!patient || !(await bcrypt.compare(password, patient.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: patient.id, role: 'PATIENT' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        res.json({ token, user: { id: patient.id, name: patient.name, role: 'PATIENT' } });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
