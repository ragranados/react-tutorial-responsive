import './style.css'
import {InputText} from "primereact/inputtext";
import React, {useState, useEffect, useRef} from 'react';
import {FileUpload} from 'primereact/fileupload';
import {Button} from "primereact/button";
import DocumentoService from '../../servicios/documento'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from "primereact/toast";

const Index = () => {
    const toast = useRef(null);
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [edad, setEdad] = useState(0);
    const [foto, setFoto] = useState("");
    const [documentos, setDocumentos] = useState([]);
    const [actualizando, setActualizando] = useState(false);

    useEffect(async () => {
        const docs = await DocumentoService.documentos();

        setDocumentos(docs);
    }, [])

    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const clear = () => {
        setId(0);
        setNombre("");
        setApellido("");
        setEmail("");
        setFoto("");
        setEdad(0);
    }

    const update = async () => {

        const timer = setTimeout(async () => {
            const docs = await DocumentoService.documentos();

            setDocumentos(docs);

        }, 700);

        return () => clearTimeout(timer);
    }

    const actualizarDocumento = () => {

        goToTop();
    }

    const imageBodyTemplate = (rowData) => {
        return (
            <div className={"imgTable"}>
                <img
                    width={100}
                    height={100}
                    src={`https://xavierferras.com/wp-content/uploads/2019/02/266-Persona.jpg`}
                    onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                    alt={rowData.image} className="product-image"/>
            </div>
        );
    }

    const ActionsTemplate = (rowData) => {
        return (
            <div>
                <Button className={"buttonAccion"} label={"Borrar"}/>

                <Button onClick={() => {
                    console.log(rowData);
                    setActualizando(true);

                    goToTop();
                }} label={"Actualizar"}/>
            </div>
        );
    }

    const header = (
        <div className="table-header">
            Documentos
        </div>
    );

    const guardar = async () => {
        const documento = {
            nombre,
            apellido,
            email,
            edad,
            foto
        };

        const nuevo = await DocumentoService.guardar(documento);

        update();

        toast.current.show({
            severity: 'success',
            summary: 'nuevo.data.message',
            detail: `${nombre} insertado con exito`,
            life: 3000
        });

        clear();

    }

    const onBasicUpload = () => {

    }

    return (
        <div className={"container"}>
            <Toast ref={toast}/>
            <div className={"topContainer"}>
                <h4>Nombre</h4>
                <InputText value={nombre} onChange={(e) => setNombre(e.target.value)}/>

                <h4>Apellido</h4>
                <InputText value={apellido} onChange={(e) => setApellido(e.target.value)}/>

                <h4>Email</h4>
                <InputText value={email} onChange={(e) => setEmail(e.target.value)}/>

                <h4>Edad</h4>
                <InputText value={edad} onChange={(e) => setEdad(e.target.value)}/>

                <div className={"Button-submit"}>
                    <FileUpload mode="basic" name="demo[]" url={foto} accept="image/*" maxFileSize={1000000}
                                onUpload={onBasicUpload}/>
                </div>

                {!actualizando ?
                    <Button label="Submit" onClick={() => {
                        guardar()
                    }}/>
                    :
                    <div className={"divBotones"} >
                        <Button label="Actualizar" onClick={() => {

                        }}/>
                        <Button className={"butonesAct"} label="Cancelar" onClick={() => {
                            setActualizando(false);

                            clear();
                        }}/>
                    </div>
                }
            </div>

            <div className="implementation datatable-templating-demo table">
                <div className="card">
                    <DataTable value={documentos} header={header} responsiveLayout="scroll">
                        <Column field="id" header="Id"></Column>
                        <Column header="Foto" body={imageBodyTemplate}></Column>
                        <Column field="nombre" header="Nombre"></Column>
                        <Column field="edad" header="Edad"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column header="Actiones" body={ActionsTemplate}></Column>
                    </DataTable>
                </div>
            </div>

        </div>


    );

}

export default Index;
