const axios = require("axios").default;
const service = {}

service.guardar = async (documento) => {
    try{
        const newDocumento = await axios.post(`${process.env.REACT_APP_URL}/documento/guardar`, {
            nombre: documento.nombre,
            apellido: documento.apellido,
            edad: documento.edad,
            email: documento.email,
            foto: documento.foto
        });

        return newDocumento;
    }catch (e){
        console.log(e);
    }
}

service.documentos = async () => {
    try{
        const documentos = await axios.get(`${process.env.REACT_APP_URL}/documento/todos`);

        console.log(documentos.data.data);

        return documentos.data.data;
    }catch (e) {
        console.log(e);
    }
}


export default service;
