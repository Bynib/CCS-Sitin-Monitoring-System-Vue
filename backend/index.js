import express from 'express';
import cors from 'cors';
import studentRoute from './routes/student.route.js';
import announcementRoute from './routes/announcement.route.js';
import sitinRoute from './routes/sitin.route.js';
import recordRoute from './routes/record.route.js';
import fileRoute from './routes/file.route.js';
import scheduleRoute from './routes/lab_sched.route.js';
import pcRoute from './routes/pc.route.js';
import reservationRoute from './routes/reservation.route.js';  
import notificationRoute from './routes/notification.route.js'; 
import bodyParser from 'body-parser';


const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({ limit: '65mb' })) // increase limit for JSON body
app.use(express.urlencoded({ extended: true, limit: '65mb' }))
app.use(cors());
app.use(express.json());
app.use('/student', studentRoute);
app.use('/announcement', announcementRoute);
app.use('/sitin', sitinRoute);
app.use('/record', recordRoute);
app.use('/file', fileRoute);
app.use('/schedule', scheduleRoute);
app.use('/pc', pcRoute);
app.use('/reservation', reservationRoute);
app.use('/notification', notificationRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});