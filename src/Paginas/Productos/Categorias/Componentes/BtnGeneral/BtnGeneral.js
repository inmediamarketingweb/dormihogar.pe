import { useState, useEffect } from 'react';

import './BtnGeneral.css';

function BtnGeneral({ 
    onEnvioGratisChange, 
    onFiltroSkusChange, 
    envioGratisActivo, 
    currentPage, 
    setCurrentPage,
    resetFilters
}) {
    const [entregaHoyActivo, setEntregaHoyActivo] = useState(false);
    const [entregaMananaActivo, setEntregaMananaActivo] = useState(false);
    const [mostrarEntregaHoy, setMostrarEntregaHoy] = useState(true);
    const [skusEntrega, setSkusEntrega] = useState([]);

    useEffect(() => {
        if (resetFilters) {
            setEntregaHoyActivo(false);
            setEntregaMananaActivo(false);
        }
    }, [resetFilters]);

    useEffect(() => {
        const cargarSkusEntrega = async () => {
            try {
                const response = await fetch('/assets/json/entrega-hoy.json');
                const data = await response.json();
                const skus = data.slice(1);
                setSkusEntrega(skus);
            } catch (error) {
                console.error("Error cargando SKUs de entrega:", error);
            }
        };

        cargarSkusEntrega();
    }, []);

    useEffect(() => {
        const verificarHora = () => {
            const ahora = new Date();
            const horas = ahora.getHours();
            const minutos = ahora.getMinutes();
            const horaActual = horas + (minutos / 60);

            // Entre 00:00 (0) y 12:00 (12) mostrar "Entrega hoy"
            // Después de las 12:00 mostrar "Entrega mañana"
            setMostrarEntregaHoy(horaActual >= 0 && horaActual < 15);
        };

        verificarHora();
        
        // Actualizar cada minuto
        const intervalo = setInterval(verificarHora, 60000);
        
        return () => clearInterval(intervalo);
    }, []);

    const toggleEnvioGratis = () => {
        const nuevoEstado = !envioGratisActivo;
        onEnvioGratisChange(nuevoEstado);
        
        if (setCurrentPage) {
            setCurrentPage(1);
        }
    };

    const toggleEntregaHoy = () => {
        const nuevoEstado = !entregaHoyActivo;
        setEntregaHoyActivo(nuevoEstado);
        
        if (nuevoEstado) {
            // Si se activa "Entrega hoy", desactivamos "Entrega mañana" (si existe)
            if (mostrarEntregaHoy) {
                setEntregaMananaActivo(false);
            }
            onFiltroSkusChange(skusEntrega);
        } else {
            // Si se desactiva "Entrega hoy", limpiamos el filtro SOLO si "Entrega mañana" también está inactivo
            if (!entregaMananaActivo) {
                onFiltroSkusChange(null);
            } else {
                // Si "Entrega mañana" sigue activo, mantenemos el filtro
                onFiltroSkusChange(skusEntrega);
            }
        }
        
        if (setCurrentPage) {
            setCurrentPage(1);
        }
    };

    const toggleEntregaManana = () => {
        const nuevoEstado = !entregaMananaActivo;
        setEntregaMananaActivo(nuevoEstado);
        
        if (nuevoEstado) {
            // Si se activa "Entrega mañana", desactivamos "Entrega hoy" (si existe)
            if (!mostrarEntregaHoy) {
                setEntregaHoyActivo(false);
            }
            onFiltroSkusChange(skusEntrega);
        } else {
            // Si se desactiva "Entrega mañana", limpiamos el filtro SOLO si "Entrega hoy" también está inactivo
            if (!entregaHoyActivo) {
                onFiltroSkusChange(null);
            } else {
                // Si "Entrega hoy" sigue activo, mantenemos el filtro
                onFiltroSkusChange(skusEntrega);
            }
        }
        
        if (setCurrentPage) {
            setCurrentPage(1);
        }
    };

    return(
        <div className='d-flex-column gap-5'>
            <button 
                type='button' 
                className={`button-w-span delivery-free ${envioGratisActivo ? 'active' : ''}`}
                onClick={toggleEnvioGratis}
            >
                <span className="material-symbols-outlined">delivery_truck_speed</span>
                <p className=''>Envío gratis</p>
            </button>

            {mostrarEntregaHoy ? (
                <button 
                    type='button' 
                    className={`button-w-span delivery-today ${entregaHoyActivo ? 'active' : ''}`}
                    onClick={toggleEntregaHoy}
                >
                    <span className="material-symbols-outlined">timer</span>
                    <p className=''>Entrega hoy</p>
                </button>
            ) : (
                <button 
                    type='button' 
                    className={`button-w-span delivery-tomorrow ${entregaMananaActivo ? 'active' : ''}`}
                    onClick={toggleEntregaManana}
                >
                    <span className="material-symbols-outlined">24fps_select</span>
                    <p className=''>Recíbelo mañana</p>
                </button>
            )}
        </div>
    )
}

export default BtnGeneral;
