import axios from 'axios'

export const getSitin = async ()=>{
    const response = await axios.get("http://localhost:3000/sitin/");
    return response.data;
}

export const addSitin = async (sitin: {idno: number, purpose: string, laboratory: number}) => {
    const response = await axios.post("http://localhost:3000/sitin/", sitin)
    return response.data;
}

export const removeSitin = async (id: number) => {
    const response = await axios.delete(`http://localhost:3000/sitin/delete/${id}`)
    return response.data;
}