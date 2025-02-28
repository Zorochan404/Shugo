import mongoose from 'mongoose';


const prescriptionSchema = new mongoose.Schema({
  medicines: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
    }],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  dose: [{
    medicine: String,
    dosage: String,
    instructions: String,
    times: [Date],
    duration: String 
  }]
  

  
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);


export default Prescription;