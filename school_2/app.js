import express from 'express';
import connectToDatabase from './database/mongodb.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import MedicineRouter from './routes/medicine.js';



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/medicine', MedicineRouter);





  

app.listen(process.env.PORT, async()=> {
    console.log(`server running on ${process.env.PORT}⚙️`)
    await connectToDatabase();
});



export default app;


