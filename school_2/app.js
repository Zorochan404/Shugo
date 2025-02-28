import express from 'express';
import connectToDatabase from './database/mongodb.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import MedicineRouter from './routes/medicine.js';
import Tesseract from 'tesseract.js';
import PrescriptionRouter from './routes/prescription.js';
import notificationRoutes from './routes/notification.js';



const app = express();
const host = '0.0.0.0';


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/medicine', MedicineRouter);
app.use('/api/v1/prescription', PrescriptionRouter);
app.use('/api/v1/notifications', notificationRoutes);



  app.get('/', async (req, res) => {
    const imageUrl = "https://www.worksheetsplanet.com/wp-content/uploads/2023/04/What-is-a-text.jpg";

    try {
        Tesseract.recognize(imageUrl, 'eng', {
            logger: (m) => console.log(m) // Optional: shows progress
        }).then(({ data: { text } }) => {
            console.log('OCR Result:', text);
            res.send(text);
        }).catch((error) => {
            console.error('OCR Error:', error.message);
            res.status(500).send('Error processing the image.');
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred while processing the image.');
    }
});


app.listen(process.env.PORT, async()=> {
    console.log(`server running on ${process.env.PORT}⚙️`)
    await connectToDatabase();
});



export default app;


