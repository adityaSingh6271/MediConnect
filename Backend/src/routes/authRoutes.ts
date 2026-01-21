import { Router } from 'express';
import { doctorSignup, doctorLogin, patientSignup, patientLogin } from '../controllers/authController';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/doctor/signup', upload.single('profilePic'), doctorSignup);
router.post('/doctor/login', doctorLogin);
router.post('/patient/signup', upload.single('profilePic'), patientSignup);
router.post('/patient/login', patientLogin);

export default router;
