import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const authRoutes = Router();

authRoutes.post('/login', AuthController.login);

export default authRoutes;
