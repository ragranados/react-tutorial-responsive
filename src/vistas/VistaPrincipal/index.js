import './style.css'
import {InputText} from "primereact/inputtext";
import React, {useState, useEffect, useRef} from 'react';
import {FileUpload} from 'primereact/fileupload';
import {Button} from "primereact/button";
import DocumentoService from '../../servicios/documento'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from "primereact/toast";
import {InputNumber} from "primereact/inputnumber";

const Index = () => {
    const toast = useRef(null);
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [edad, setEdad] = useState(1);
    const [foto, setFoto] = useState(null);
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
            summary: `${nuevo.data.message}`,
            detail: `${nombre} insertado con exito`,
            life: 3000
        });

        clear();

    }

    const actualizarDocumento = async () => {
        const actualizado = await DocumentoService.actualizar({
            id,
            nombre,
            apellido,
            email,
            edad,
        });

        update();
    }

    const subirFoto = (a) => {
        let name = a.xhr.response.slice(1);
        name = name.slice(0, -1);
        setFoto(name);
    }

    const borrar = async (id) => {
        const borrado = await DocumentoService.borrar(id);

        if (borrado.ok) {
            toast.current.show({
                severity: 'success',
                summary: "Ok",
                detail: `Borrado con exito`,
                life: 3000
            });
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Fail',
                detail: `No se pudo borrar`,
                life: 3000
            });
        }

        update();
    }

    const update = async () => {

        const timer = setTimeout(async () => {
            const docs = await DocumentoService.documentos();

            setDocumentos(docs);

        }, 700);

        return () => clearTimeout(timer);
    }

    const clear = () => {
        setId(0);
        setNombre("");
        setApellido("");
        setEmail("");
        setFoto("");
        setEdad(0);
    }

    const imageBodyTemplate = (rowData) => {
        return (
            <div className={"imgTable"}>
                <img
                    width={100}
                    height={100}
                    src={`${process.env.REACT_APP_URL}/documento/archivo/${rowData.foto}`}
                    onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                    alt={rowData.image} className="product-image"/>
            </div>
        );
    }

    const ActionsTemplate = (rowData) => {
        return (
            <div>
                <Button className={"buttonAccion"} label={"Borrar"} onClick={() => {
                    console.log(rowData);
                    borrar(rowData.id);
                }}/>

                <Button onClick={() => {
                    setActualizando(true);

                    setId(rowData.id);
                    setNombre(rowData.nombre);
                    setApellido(rowData.apellido);
                    setEmail(rowData.email);
                    setEdad(rowData.edad);

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
                <InputNumber mode={"decimal"} value={edad} onChange={(e) => setEdad(e.value)} showButtons min={0}
                             max={110}/>

                <div className={"Button-submit"}>
                    {foto ? <h5>{`Se ha seleccionado el archivo: ${foto}`}</h5> :
                        <FileUpload mode="basic" name="file" url={`${process.env.REACT_APP_URL}/documento/imagen`}
                                    accept="image/*" auto maxFileSize={1000000} onUpload={subirFoto}/>}
                </div>

                {!actualizando ?
                    <Button label="Submit" onClick={() => {
                        if (!foto) {
                            toast.current.show({
                                severity: 'error',
                                summary: 'Error',
                                detail: `Primero debe seleccionar una foto`,
                                life: 3000
                            });
                        } else {
                            guardar()
                        }
                    }}/>
                    :
                    <div className={"divBotones"}>
                        <Button label="Actualizar" onClick={() => {
                            actualizarDocumento();
                            setActualizando(false);
                            clear();
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
                        <Column field="apellido" header="Apellido"></Column>
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
