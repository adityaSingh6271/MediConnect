import { Router } from 'express';
import { getDoctorProfile, getDoctorConsultations } from '../controllers/doctorController';
import { createOrUpdatePrescription } from '../controllers/prescriptionController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['DOCTOR']));

router.get('/profile', getDoctorProfile);
router.get('/consultations', getDoctorConsultations);
router.post('/prescription', createOrUpdatePrescription);

export default router;
