const axios = require("axios").default;
const service = {}

service.guardar = async (documento) => {
    try {
        const newDocumento = await axios.post(`${process.env.REACT_APP_URL}/documento/guardar`, {
            ...documento
        });

        return newDocumento;
    } catch (e) {
        console.log(e);
    }
}

service.actualizar = async (documento) => {
    try{
        const actualizado = await axios.put(`${process.env.REACT_APP_URL}/documento/actualizar`,{
            ...documento
        });

        return actualizado;
    }catch (e) {
        console.log(e);
    }
}

service.documentos = async () => {
    try {
        const documentos = await axios.get(`${process.env.REACT_APP_URL}/documento/todos`);

        console.log(documentos.data.data);

        return documentos.data.data;
    } catch (e) {
        console.log(e);
    }
}

service.borrar = async (id) => {
    try {
        const documentos = await axios.delete(`${process.env.REACT_APP_URL}/documento/borrar/${id}`);

        return documentos.data;
    } catch (e) {
        console.log(e);
    }
}


export default service;
