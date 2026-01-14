import { useState } from 'react';

import './Descripcion.css';

function Descripcion({
    producto,
    mensajes = [],
    ficha = [],
    descripcionColchon = null,
    descripcionTipoDormitorio = null,
    descripcionCabecera = null,
    cargandoColchon = false,
    cargandoTipoDormitorio = false,
    cargandoCabecera = false 
}) {
    const [expandedSections, setExpandedSections] = useState({
        mensajes: false,
        ficha: false,
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

    const getTipoDormitorioTitle = () => {
        if (!descripcionTipoDormitorio) return "Box tarima";

        const nombreProducto = producto?.nombre?.toLowerCase() || '';

        if (nombreProducto.includes('americano') && nombreProducto.includes('cajones')) {
            return "Box tarima americano con cajones";
        } else if (nombreProducto.includes('americano')) {
            return "Box tarima americano";
        } else if (nombreProducto.includes('europeo') && nombreProducto.includes('cajones')) {
            return "Box tarima europeo con cajones";
        } else if (nombreProducto.includes('europeo')) {
            return "Box tarima europeo";
        }
        
        if (descripcionTipoDormitorio.tipo) {
            const tipo = descripcionTipoDormitorio.tipo;
            if (tipo === 'americano-con-cajones') return "Box tarima americano con cajones";
            if (tipo === 'americano') return "Box tarima americano";
            if (tipo === 'europeo-con-cajones') return "Box tarima europeo con cajones";
            if (tipo === 'europeo') return "Box tarima europeo";
        }
        
        return "Box tarima";
    };

    const getCabeceraTitle = () => {
        const nombreProducto = producto?.nombre?.toLowerCase() || '';
        
        if (nombreProducto.includes('tapizada')) {
            return "Cabecera tapizada";
        } else if (nombreProducto.includes('madera')) {
            return "Cabecera de madera";
        } else if (nombreProducto.includes('metal')) {
            return "Cabecera de metal";
        }
        return "Cabecera";
    };

    const renderMensajesProducto = () => {
        if (!mensajes || !Array.isArray(mensajes) || mensajes.length === 0) {
            return null;
        }

        return(
            <div className="mensajes-producto-container d-flex-column gap-10">
                <button className={getButtonClasses('mensajes')} onClick={() => toggleSection('mensajes')}>
                    <p className="sub-title color-color-1 uppercase">Descripción</p>
                    <span className="material-symbols-outlined">
                        {expandedSections.mensajes ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </span>
                </button>

                <div className={getContentClasses('mensajes')}>
                    <div className="contenido-mensajes">
                        {mensajes.map((mensaje, index) => (
                            <div key={index} className="mensaje-producto">
                                <p>{mensaje}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderFichaProducto = () => {
        if (!ficha || !Array.isArray(ficha) || ficha.length === 0) {
            return null;
        }

        if (descripcionColchon) {
            return null;
        }

        const esColchonIndividual = producto?.categoria?.toLowerCase() === 'colchones' && !descripcionColchon;
        const titulo = esColchonIndividual ? "Ficha técnica" : "Ficha técnica";

        return(
            <div className="ficha-producto-container d-flex-column gap-10">
                <div className="visible-on-desktop-no-mobile">
                    <p className='title color-color-1 uppercase'>{titulo}</p>
                </div>

                <button className={getButtonClasses('ficha')} onClick={() => toggleSection('ficha')}>
                    <p className="sub-title color-color-1 uppercase">{titulo}</p>
                    <span className="material-symbols-outlined">
                        {expandedSections.ficha ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                    </span>
                </button>

                <div className={getContentClasses('ficha')}>
                    <div className="product-details">
                        {ficha.map((item, index) => {
                            if (typeof item === 'object' && item !== null) {
                                return Object.entries(item).map(([key, value], subIndex) => (
                                    <ul key={`${index}-${subIndex}`}>
                                        <li>
                                            <div>
                                                <strong>{key.replace(/-/g, ' ').charAt(0).toUpperCase() + key.replace(/-/g, ' ').slice(1)}:</strong>
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
        );
    };

    const renderSeccionTipoDormitorio = () => {
        if (!descripcionTipoDormitorio && !cargandoTipoDormitorio) return null;

        const tituloDormitorio = getTipoDormitorioTitle();

        return(
            <div className="descripcion-seccion">
                {cargandoTipoDormitorio ? (
                    <div className="cargando-tipo-dormitorio">
                        <p>Cargando especificaciones del dormitorio...</p>
                    </div>
                ) : (
                    <>
                        {descripcionTipoDormitorio?.ficha && Array.isArray(descripcionTipoDormitorio.ficha) && (
                            <div className="d-flex-column gap-5">
                                <div className='visible-on-desktop-no-mobile'>
                                    <p className='title color-color-1 uppercase'>{tituloDormitorio}</p>
                                </div>

                                <button className={getButtonClasses('tipoDormitorio')} onClick={() => toggleSection('tipoDormitorio')}>
                                    <p className="sub-title color-color-1 uppercase">{tituloDormitorio}</p>
                                    <span className="material-symbols-outlined">
                                        {expandedSections.tipoDormitorio ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                    </span>
                                </button>

                                <div className={getContentClasses('tipoDormitorio')}>
                                    <div className="product-details">
                                        {descripcionTipoDormitorio.ficha.map((item, index) => {
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

    const renderSeccionCabecera = () => {
        if (!descripcionCabecera && !cargandoCabecera) return null;
        const tituloCabecera = getCabeceraTitle();

        return(
            <div className="descripcion-seccion">
                {cargandoCabecera ? (
                    <div className="cargando-cabecera">
                        <p>Cargando especificaciones de la cabecera...</p>
                    </div>
                ) : (
                    <>
                        {descripcionCabecera?.ficha && Array.isArray(descripcionCabecera.ficha) && (
                            <div className="d-flex-column gap-5">
                                <div className='visible-on-desktop-no-mobile'>
                                    <p className='title color-color-1 uppercase'>{tituloCabecera}</p>
                                </div>

                                <button className={getButtonClasses('cabecera')} onClick={() => toggleSection('cabecera')}>
                                    <p className="sub-title color-color-1 uppercase">{tituloCabecera}</p>
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
        
        const getColchonTitle = () => {
            const nombreProducto = producto?.nombre?.toLowerCase() || '';
            let titulo = "Ficha técnica";

            if (descripcionColchon?.producto?.marca) {
                const marca = descripcionColchon.producto.marca;
                titulo = `Colchón ${marca.charAt(0).toUpperCase() + marca.slice(1)}`;

                if (descripcionColchon.producto.modelo) {
                    titulo += ` ${descripcionColchon.producto.modelo}`;
                }
            } else if (nombreProducto.includes('colchón')) {
                const match = nombreProducto.match(/colchón\s+([^+]+)/i);
                if (match && match[1]) {
                    const modelo = match[1].trim();
                    titulo = `Colchón ${modelo.charAt(0).toUpperCase() + modelo.slice(1)}`;
                }
            }
            
            return titulo;
        };
        
        const tituloColchon = getColchonTitle();
        
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
                                <div className='visible-on-desktop-no-mobile'>
                                    <p className='title color-color-1 uppercase'>{tituloColchon}</p>
                                </div>

                                <button className={getButtonClasses('colchon')} onClick={() => toggleSection('colchon')}>
                                    <p className="sub-title color-color-1 uppercase">{tituloColchon}</p>
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
                                                            <strong>{key.replace(/-/g, ' ').charAt(0).toUpperCase() + key.replace(/-/g, ' ').slice(1)}:</strong>
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

        return(
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

    const tieneDescripcion = mensajes.length > 0 || ficha.length > 0 || descripcionTipoDormitorio || descripcionCabecera || descripcionColchon;
    if (!tieneDescripcion) return null;

    return(
        <div className="product-page-description w-100 d-flex-column gap-20-to-10">
            <div className="d-flex-column gap-10">
                <p className="block-title uppercase color-color-1 margin-right">Descripción del producto</p>
                {renderMensajesProducto()}
                {renderMensajesColchon()}
            </div>

            <div className='d-flex-column gap-20-to-10'>
                {renderFichaProducto()}
                {renderSeccionTipoDormitorio()}
                {renderSeccionColchon()}
                {renderSeccionCabecera()}
            </div>
        </div>
    );
}

export default Descripcion;
