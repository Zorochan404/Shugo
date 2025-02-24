import mongoose from 'mongoose';


const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
  },
  exp: {
    type: Date,
  },
  entry: {
    type: Date,
  },
  category: {
    type: String,
    required: [true, 'category is required'],
    trim: true,
  },
  imgurl: {
    type: String,
    trim: true,
  },
  disposal: {
    type: String,
    trim: true,
  },

  
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', medicineSchema);


export default Medicine;