import axios from 'axios';

export const getNotifications = async () => {
    const response = await axios.get('http://localhost:3000/notification/')
    return response.data;
}

export const findNotification = async (id: number) => {
    const response = await axios.get(`http://localhost:3000/notification/find/${id}`)
    return response.data;
}
export const addNotification = async (title: string, content: string, reciever: string) => {
    const response = await axios.post('http://localhost:3000/notification/', {title, content, reciever});
    return response.data;
}

export const updateNotificationStatus = async(id:number, status:string) => {
    const response = await axios.put(`http://localhost:3000/notification/update/${id}`, {status});
    return response.data;
}

export const updateAllNotificationStatus = async(idno: number) => {
    const response = await axios.put(`http://localhost:3000/notification/updateall/${idno}`, {});
    return response.data;
}

export const removeNotification = async (notif_id: number) => {
    const response = await axios.delete(`http://localhost:3000/notification/delete/${notif_id}`)
    return response.data;
}