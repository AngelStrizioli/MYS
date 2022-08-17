import React from "react";
import Modal from 'react-modal';

export default function FunctionsModal({setIsOpen, modalIsOpen}) {

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            width: 300,
            height: 500,
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#8ED1FC'
        },
    };

    function closeModal() {
        setIsOpen(false);
    }

    const funciones = [{ label: 'Raíz cuadrada', function: 'sqrt(x)' }, { label: 'Raíz cúbica', function: 'cbrt(x)' }, { label: 'Función exponencial', function: 'e^x' }, { label: 'Seno', function: 'sin(x)' }, { label: 'Coseno', function: 'cos(x)' }, { label: 'Arco seno', function: 'asin(x)' }, { label: 'Arco coseno', function: 'acos(x)' }, { label: 'Tangente', function: 'tan(x)' }, { label: 'Arco tangente', function: 'atan(x)' }, { label: 'Cotangente', function: 'cot(x)' }, { label: 'Arco cotangente', function: 'acot(x)' }, { label: 'Secante', function: 'sec(x)' }, { label: 'Arco secante', function: 'asec(x)' }, { label: 'Cosecante', function: 'csc(x)' }, { label: 'Arco cosecante', function: 'acsc(x)' },]
    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div style={{
                        fontSize: 25,
                        backgroundColor: "#8ED1FC",
                        padding: 20,
                        color: '#fff',
                        fontFamily: 'Montserrat',
                        fontWeight: 'bold'}}>
                    <button onClick={closeModal} style={{ color: '#fff',backgroundColor: 'transparent', borderColor: 'transparent', fontSize: 16, fontFamily: 'Montserrat', fontWeight: 'bold' }}>X</button>
                   <span style={{fontSize:18}}> Funciones </span>
                </div>

                <div class="grid-container" style={{backgroundColor: "#8ED1FC"}}>
                    {funciones.map((fun) => {
                        return <>
                            <div class="grid-item" style={{color: '#fff', fontFamily: 'Montserrat', fontWeight: 'bold', fontSize: 14}}>{fun.label}</div>
                            <div class="grid-item" style={{color: '#fff', fontFamily: 'Montserrat', fontWeight: 'bold', fontSize: 14}}>{fun.function}</div>
                        </>
                    })}
                </div>
            </Modal>
        </div>
    )
}

