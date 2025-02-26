import express from 'express';
import cors from 'cors';
import studentRoute from './routes/student.route.js';
import announcementRoute from './routes/announcement.route.js';
import sitinRoute from './routes/sitin.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/student', studentRoute);
app.use('/announcement', announcementRoute);
app.use('/sitin', sitinRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});