import {Router} from 'express';
import {createPrescriptionFromImage, deletePrescriptionById, getPrecriptionbyUser, getPrescription, updatePrescriptionById } from '../controllers/prescription.controller.js';

const PrescriptionRouter = Router();

PrescriptionRouter.post('/addPrescription', createPrescriptionFromImage)

PrescriptionRouter.get('/getPrescription', getPrescription)

PrescriptionRouter.put('/updatePrescription/:id', updatePrescriptionById)

PrescriptionRouter.put('/getPrescriptionById', getPrecriptionbyUser)


PrescriptionRouter.delete('/deletePrescription/:id', deletePrescriptionById)


export default PrescriptionRouter;


