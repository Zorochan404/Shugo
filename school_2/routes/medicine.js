import {Router} from 'express';
import { createMedicine, deleteMedicineById, getMedicine, updateMedicineById } from '../controllers/medicine.controller.js';

const MedicineRouter = Router();

MedicineRouter.post('/addMedicine', createMedicine)

MedicineRouter.get('/getMedicine', getMedicine)

MedicineRouter.put('/updateMedicine/:id', updateMedicineById)


MedicineRouter.delete('/deleteMedicine/:id', deleteMedicineById)


export default MedicineRouter;


