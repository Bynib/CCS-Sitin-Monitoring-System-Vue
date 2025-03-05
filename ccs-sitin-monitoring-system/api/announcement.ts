import axios from 'axios';

export const getAnnouncements = async () => {
    const response = await axios.get('http://localhost:3000/announcement/');
    return response.data;
}

export const addAnnouncement = async (announcement: { title: string, content: string }) => {
    const response = await axios.post('http://localhost:3000/announcement/', announcement);
    return response.data;
}

export const updateAnnouncement = async (announcement_id: number, announcement: { title: string, content: string }) => {
    const response = await axios.put(`http://localhost:3000/announcement/update/${announcement_id}`, announcement);
    return response.data;
}

export const removeAnnouncement = async (id: number) => {
    const response = await axios.delete(`http://localhost:3000/announcement/delete/${id}`);
    return response.data;
}