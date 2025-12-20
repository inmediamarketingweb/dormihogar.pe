import { useState } from 'react';
import './Descripcion.css';

function Descripcion({
    descripcionColchon = null,
    descripcionTipoDormitorio = null,
    descripcionCabecera = null,
    cargandoColchon = false,
    cargandoTipoDormitorio = false,
    cargandoCabecera = false 
}) {
    const [expandedSections, setExpandedSections] = useState({
        tipoDormitorio: false,
        colchon: false,
        cabecera: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getButtonClasses = (section) => {
        return expandedSections[section] 
            ? 'description-top-button-container active'
            : 'description-top-button-container';
    };

    const getContentClasses = (section) => {
        return expandedSections[section]
            ? 'description-content active'
            : 'description-content';
    };

    const renderSeccionTipoDormitorio = () => {
        if (!descripcionTipoDormitorio && !cargandoTipoDormitorio) return null;
        
        return (
            <div className="descripcion-seccion">
                {cargandoTipoDormitorio ? (
                    <div className="cargando-tipo-dormitorio">
                        <p>Cargando especificaciones del dormitorio...</p>
                    </div>
                ) : (
                    <>
                        {descripcionTipoDormitorio?.ficha && Array.isArray(descripcionTipoDormitorio.ficha) && (
                            <div className="d-flex-column gap-5">
                                <p className="sub-title color-color-1 uppercase">Box tarima</p>

                                <button className={getButtonClasses('tipoDormitorio')} onClick={() => toggleSection('tipoDormitorio')}>
                                    <p className="sub-title color-color-1 uppercase">Box tarima</p>
                                    <span className="material-symbols-outlined">
                                        {expandedSections.tipoDormitorio ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                    </span>
                                </button>

                                <div className={getContentClasses('tipoDormitorio')}>
                                    <ul className="product-details">
                                        {descripcionTipoDormitorio.ficha.map((item, index) => {
                                            if (typeof item === 'object' && item !== null) {
                                                return Object.entries(item).map(([key, value], subIndex) => (
                                                    <li key={`${index}-${subIndex}`}>
                                                        <div>
                                                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                                        </div>
                                                        <span className="valor-ficha">{value}</span>
                                                    </li>
                                                ));
                                            }
                                            return null;
                                        })}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    const renderSeccionCabecera = () => {
        if (!descripcionCabecera && !cargandoCabecera) return null;

        return (
            <div className="descripcion-seccion">
                {cargandoCabecera ? (
                    <div className="cargando-cabecera">
                        <p>Cargando especificaciones de la cabecera...</p>
                    </div>
                ) : (
                    <>
                        {descripcionCabecera?.ficha && Array.isArray(descripcionCabecera.ficha) && (
                            <div className="d-flex-column gap-5">
                                <p className="sub-title color-color-1 uppercase">Cabecera</p>

                                <button className={getButtonClasses('cabecera')} onClick={() => toggleSection('cabecera')}>
                                    <p className="sub-title color-color-1 uppercase">Cabecera</p>
                                    <span className="material-symbols-outlined">
                                        {expandedSections.cabecera ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                    </span>
                                </button>

                                <div className={getContentClasses('cabecera')}>
                                    <div className="product-details">
                                        {descripcionCabecera.ficha.map((item, index) => {
                                            if (typeof item === 'object' && item !== null) {
                                                return Object.entries(item).map(([key, value], subIndex) => (
                                                    <ul key={`${index}-${subIndex}`}>
                                                        <li>
                                                            <div>
                                                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                                                            </div>
                                                            <div>
                                                                <p>{value}</p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                ));
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    const renderSeccionColchon = () => {
        if (!descripcionColchon && !cargandoColchon) return null;
        
        return(
            <div className="descripcion-seccion">
                {cargandoColchon ? (
                    <div className="cargando-colchon">
                        <p>Cargando detalles del colchón...</p>
                    </div>
                ) : (
                    <>
                        {descripcionColchon?.ficha?.length > 0 && (
                            <div className="d-flex-column gap-5">
                                <p className='sub-title uppercase color-color-1'>Colchón</p>

                                <button className={getButtonClasses('colchon')} onClick={() => toggleSection('colchon')}>
                                    <p className="sub-title color-color-1 uppercase">Colchón</p>
                                    <span className="material-symbols-outlined">
                                        {expandedSections.colchon ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                    </span>
                                </button>

                                <div className={getContentClasses('colchon')}>
                                    <div className="product-details">
                                        {descripcionColchon.ficha.map((item, index) => (
                                            <ul key={index}>
                                                {Object.entries(item).map(([key, value]) => (
                                                    <li key={key}>
                                                        <div>
                                                            <strong>{key.replace(/-/g, ' ')}:</strong>
                                                        </div>
                                                        <div>
                                                            <p>{value}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    const renderMensajesColchon = () => {
        if (!descripcionColchon?.mensajes || !Array.isArray(descripcionColchon.mensajes) || descripcionColchon.mensajes.length === 0) {
            return null;
        }

        return (
            <div className="mensajes-colchon-container d-flex-column gap-10">
                <div className="contenido-mensajes">
                    {descripcionColchon.mensajes.map((mensaje, index) => (
                        <div key={index} className="mensaje-colchon">
                            <p>{mensaje}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const tieneDescripcion = descripcionTipoDormitorio || descripcionCabecera || descripcionColchon;

    if (!tieneDescripcion) return null;

    return(
        <div className="product-page-description w-100 d-flex-column gap-20-to-10">
            <div className="d-flex-column gap-10">
                <p className="block-title uppercase color-color-1 margin-right">Descripción del producto</p>

                {renderMensajesColchon()}
            </div>

            <div className='d-flex-column gap-20-to-10'>
                {renderSeccionTipoDormitorio()}
                {renderSeccionColchon()}
                {renderSeccionCabecera()}
            </div>
        </div>
    );
}

export default Descripcion;
