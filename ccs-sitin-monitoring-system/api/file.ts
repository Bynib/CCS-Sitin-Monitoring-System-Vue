import axios from "axios";

export const getFiles = async () => {
    const response = await axios.get('http://localhost:3000/file/')
    return response.data;
}

export const findFile = async (id: string) => {
    const response = await axios.get(`http://localhost:3000/file/find/${id}`);
    return response.data;
}

export const addFile = async(fileData: {filename: string, filedata: string})=>{
    const response = await axios.post('http://localhost:3000/file/', fileData);
    return response.data;
}

export const removeFile = async (id: number) => {
    const response = await axios.delete(`http://localhost:3000/file/delete/${id}`);
    return response.data;
}