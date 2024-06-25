import express from 'express';
import * as authControllers from '../controllers/authControllers.js';

const router = express.Router();

router.post('/register', authControllers.register);

export default router;
