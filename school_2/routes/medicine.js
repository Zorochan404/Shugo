import {Router} from 'express';
import {  createMedicine, deleteMedicineById, getMedicine, getMedicinebyUser, updateMedicineById } from '../controllers/medicine.controller.js';

const MedicineRouter = Router();

MedicineRouter.post('/addMedicine', createMedicine)

MedicineRouter.get('/getMedicine', getMedicine)

MedicineRouter.put('/updateMedicine/:id', updateMedicineById)

MedicineRouter.put('/getmedicinebyuser', getMedicinebyUser)

MedicineRouter.delete('/deleteMedicine/:id', deleteMedicineById)


export default MedicineRouter;


