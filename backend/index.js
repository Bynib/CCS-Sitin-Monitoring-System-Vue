import express from 'express';
import cors from 'cors';
import studentRoute from './routes/student.route.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use('/student', studentRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});