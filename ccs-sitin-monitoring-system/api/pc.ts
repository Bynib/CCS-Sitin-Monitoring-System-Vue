import axios from 'axios';

export const getPC = async () => {
    const response = await axios.get('http://localhost:3000/pc');
    return response.data;
}

export const updatePCAvailability = async (pcno: number,labno:number, status: string) => {
    try {
        const response = await axios.put('http://localhost:3000/pc/update', {
            pcno,
            labno,
            status
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update PC availability:', error);
        throw error;
    }
};