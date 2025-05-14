import axios from 'axios';

export const getNotifications = async () => {
    const response = await axios.get('http://localhost:3000/notification/')
    return response.data;
}

export const addNotification = async (title: string, content: string, reciever: string) => {
    const response = await axios.post('http://localhost:3000/notification/', {title, content, reciever});
    return response.data;
}