import axios from 'axios';

export const getStudents = async () => {
    const response = await axios.get('http://localhost:3000/student/');
    return response.data;
}

export const getStudent = async (id: number) => {
    const response = await axios.get(`http://localhost:3000/student/${id}`);
    return response.data;
}

export const addStudent = async(student:{idno:Number, firstname:String, middlename:String, lastname:String, email:String, course:String, yearlevel:String, username:String, password:String}) => {
    const response = await axios.post('http://localhost:3000/student/', student);
    return response.data;
}
export const findStudent = async(student: {username:String, password:String}) => {
    const response = await axios.post(`http://localhost:3000/student/login`, student);
    return response.data;
}

export const findUser = async(student: {username:String}) => {
    const response = await axios.post(`http://localhost:3000/student/username`, student);
    return response.data;
}

export const updateStudent = async(student: {firstname:String, middlename:String, lastname:String, email:String, course:String, yearlevel:String, username:String, password:String, sessions: Number}) => {
    const response = await axios.post(`http://localhost:3000/student/update`, student);
    return response.data;  
}

export const updateSession = async(id: Number) => {
    const response = await axios.post(`http://localhost:3000/student/session/${id}`);
    return response.data;
}