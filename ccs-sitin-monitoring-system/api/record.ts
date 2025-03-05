import axios from 'axios';

export const getRecords = async () => {
    const response = await axios.get('http://localhost:3000/record/')
    return response.data;
}

export const addRecord = async (sitin_id: number) => {
    const response = await axios.post('http://localhost:3000/record/', {sitin_id});
    return response.data;
}