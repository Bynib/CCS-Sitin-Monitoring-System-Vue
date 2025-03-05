import axios from 'axios'

export const getSitin = async ()=>{
    const response = await axios.get("http://localhost:3000/sitin/");
    return response.data;
}

export const findSitin = async(id: string)=>{
    const response = await axios.get(`http://localhost:3000/sitin/find/${id}`);
    console.log(response.data)
    return response.data;
}

export const addSitin = async (sitin: {idno: number, purpose: string, laboratory: number}) => {
    const response = await axios.post("http://localhost:3000/sitin/", sitin)
    return response.data;
}
export const updateSitinTime = async (sitin_id: number) => {
    const response = await axios.put(`http://localhost:3000/sitin/update/time/${sitin_id}`, sitin_id)
    return response.data;
}

export const updateSitinFeedback = async(sitin_id: number, feedback: string) => {
    const response = await axios.put(`http://localhost:3000/sitin/update/feedback/${sitin_id}`, {feedback});
    return response.data;
}
export const removeSitin = async (id: number) => {
    const response = await axios.delete(`http://localhost:3000/sitin/delete/${id}`)
    return response.data;
}