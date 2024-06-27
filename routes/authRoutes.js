import express from 'express';
import * as authControllers from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.post('/forget-password', authControllers.forgetPassword);
router.patch('/reset-password/:token', authControllers.resetPassword);

export default router;
