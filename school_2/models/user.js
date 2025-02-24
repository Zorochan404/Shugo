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
  medicines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
  }],


  
}, { timestamps: true });

const User = mongoose.model('User', userSchema);


export default User;