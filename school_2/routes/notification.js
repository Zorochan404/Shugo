import {Router} from 'express';
import { sendNotification } from '../controllers/notificationcontroller.js';

const notificationRoutes = Router();

notificationRoutes.post('/send', sendNotification);

export default notificationRoutes;