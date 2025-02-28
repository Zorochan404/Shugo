import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    type: String,
    trim: true,
    minLength: 2, 
    maxLength: 100,
  },
  age: {
    type: Number
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone Number is required'],
    trim: true,
    minLength: 10, 
    maxLength: 13,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minLength: 2, 
    maxLength: 200,
  },
  breakfast: {
    type: String,
  },
  lunch: {
    type: String,
  },
  dinner: {
    type: String,
  },
  doseTaken: {
    type: Boolean,
    default: true
  }, 
  playerId:{
    type: String,
  },
  medicines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
  }],
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription',
  }],



  
}, { timestamps: true });

const User = mongoose.model('User', userSchema);


export default User;