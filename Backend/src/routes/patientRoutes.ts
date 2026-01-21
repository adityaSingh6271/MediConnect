import { Router } from 'express';
import { getPatientProfile, getAllDoctors, createConsultation, getPatientConsultations } from '../controllers/patientController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/profile', authorize(['PATIENT']), getPatientProfile);
router.get('/doctors', getAllDoctors); // Both can see doctors? Typically patient.
router.post('/consultation', authorize(['PATIENT']), createConsultation);
router.get('/consultations', authorize(['PATIENT']), getPatientConsultations);

export default router;
