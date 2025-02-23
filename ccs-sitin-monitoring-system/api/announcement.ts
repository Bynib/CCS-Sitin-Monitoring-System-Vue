import axios from 'axios';

export const getAnnouncements = async () => {
    const response = await axios.get('http://localhost:3000/announcement/');
    return response.data;
}

export const addAnnouncement = async (announcement: { title: string, content: string }) => {
    const response = await axios.post('http://localhost:3000/announcement/', announcement);
    return response.data;
}