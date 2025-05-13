import axios from 'axios';

export const getReservations = async () => {
    const response = await axios.get('http://localhost:3000/reservation')
    return response.data;
}

export const createReservation = async (idno:number, date: Date, startTime:string, pcno: number, purpose: string, labno: number) => {
    const response = await axios.post('http://localhost:3000/reservation', {idno, date, startTime, pcno, purpose, labno});
    return response.data;
}

export const getAvailablePCs = async(labno: number) => {
    const response = await axios.get(`http://localhost:3000/pc/available/${labno}`, );
    console.log(response.data)
    return response.data;
}

export const approveReservation = async (id: string) => {
    const response = await axios.put(`http://localhost:3000/reservation/approve/${id}`, {});
    return response.data;
}

export const declineReservation = async (id: string) => {
    const response = await axios.put(`http://localhost:3000/reservation/decline/${id}`, {});
    return response.data;
}

