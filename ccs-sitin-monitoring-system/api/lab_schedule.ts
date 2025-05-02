import axios from 'axios';

export const getLabSchedule = async (lab: string) => {
    const response = await axios.get(`http://localhost:3000/schedule/${lab}`);
    return response.data;
}


