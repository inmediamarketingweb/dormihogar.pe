import { useState, useEffect, useRef } from 'react';

import './Agencias.css';

import Header from '../../../Componentes/Header/Header';
import Footer from '../../../Componentes/Footer/Footer';

function Agencias(){
    const [datos, setDatos] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedDistrito, setSelectedDistrito] = useState(null);
    const [selectedAgencia, setSelectedAgencia] = useState(null);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchRef = useRef(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try{
                setLoading(true);
                const proxyUrl = 'https://corsproxy.io/?';
                const targetUrl = 'https://inmedia.pe/Proyectos/JSON/agencias.json';
                const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));

                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo JSON');
                }
                const data = await response.json();
                setDatos(data);
                setError(null);
            } catch (err) {
                console.error('Error al cargar los datos:', err);
                setError('Error al cargar los datos. Intente recargar la página.');
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    const buscarDistritos = (term) => {
        if (!datos) return;

        const termLower = term.toLowerCase();
        const resultados = [];

        datos.departamentos.forEach(depto => {
            depto.provincias.forEach(prov => {
                prov.distritos.forEach(dist => {
                    if (dist.distrito.toLowerCase().includes(termLower)) {
                        resultados.push({
                            ...dist,
                            departamento: depto.departamento,
                            provincia: prov.provincia
                        });
                    }
                });
            });
        });
        setSearchResults(resultados);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length >= 2) {
            buscarDistritos(value);
            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
            setSearchResults([]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (searchResults.length === 1) {
                seleccionarDistrito(searchResults[0]);
                setShowSearchResults(false);
            }
        }
    };

    const seleccionarDistrito = (dist) => {
        setSelectedDistrito(dist);
        setSelectedAgencia(null);
        setSearchTerm(dist.distrito);
        setShowSearchResults(false);
    };

    const seleccionarAgencia = (agencia, sede) => {
        setSelectedAgencia({ agencia, sede });
    };

    const isLimaOrCallao = (distrito) => {
        const provinciasLimaCallao = [
            "Lima metropolitana", 
            "Provincia constitucional del Callao"
        ];
        return provinciasLimaCallao.includes(distrito.provincia);
    };

    const hasEnvioDirecto = (distrito) => {
        return distrito['envio-directo'] && parseFloat(distrito['envio-directo']) > 0;
    };

    const getEnvioDirectoPrice = (distrito) => {
        if (!distrito['envio-directo']) return null;
        return `S/.${distrito['envio-directo']}`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return(
            <div className="error-container">
                <div className="message message-error">
                    <span className="material-icons">error</span>
                    <p>{error}</p>
                    <div className="error-details">
                        <p>Posibles causas:</p>
                        <ul>
                            <li>Problemas de conexión a internet</li>
                            <li>El recurso solicitado no está disponible</li>
                            <li>Restricciones de seguridad del navegador</li>
                        </ul>
                    </div>
                    <button className="reload-button" onClick={() => window.location.reload()}>
                        <span className="material-icons">refresh</span>
                        Recargar página
                    </button>
                </div>
            </div>
        );
    }

    return(
        <>
            <Header/>

            <main>
                <section className='block-container'>
                    <div className='block-content'>
                        <div className='block-title-container'>
                            <h1 className='block-title'>Agencias recomendadas</h1>
                        </div>

                        <div className='d-grid-2-1fr gap-20'>
                            <div className='d-flex-column gap-10'>
                                <div className='position-relative' ref={searchRef}>
                                    <div className='agencias-search-bar-container'>
                                        <input type='text' placeholder='Busca tu distrito'value={searchTerm} onChange={handleSearchChange} onKeyDown={handleKeyDown}/>
                                        <button type='button'>
                                            <span className="material-icons">search</span>
                                        </button>
                                    </div>

                                    {showSearchResults && (
                                        <div className='agencias-resultados'>
                                            <ul>
                                                {searchResults.length > 0 ? (
                                                    searchResults.map((dist, index) => (
                                                        <li key={index}>
                                                            <button type='button' onClick={() => seleccionarDistrito(dist)}>
                                                                <p>{dist.distrito}</p>
                                                                <span className="material-icons">arrow_forward</span>
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                <li>
                                                    <button type='button'>
                                                        <p>No se encontraron resultados</p>
                                                    </button>
                                                </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className='agencias-resultados-2 d-flex-column gap-10'>
                                    <p className='Text'>✔ Selecciona una agencia</p>
                                        <ul className='d-flex-column gap-10'>
                                            {selectedDistrito && selectedDistrito.agencias ? (
                                                selectedDistrito.agencias.map((agencia, index) => (
                                                    agencia.sedes.map((sede, sedeIndex) => (
                                                        <li key={`${index}-${sedeIndex}`}>
                                                            <button type='button' onClick={() => seleccionarAgencia(agencia, sede)}>
                                                                <span className="material-icons">location_on</span>
                                                                <div className='d-flex-column'>
                                                                    <p className='title'>{agencia.agencia}</p>
                                                                    <p className='text'>{sede.sede}</p>
                                                                </div>
                                                            </button>
                                                        </li>
                                                    ))
                                                ))
                                            ) : selectedDistrito ? (
                                                isLimaOrCallao(selectedDistrito) ? (
                                                    <li>
                                                        <div className="message message-success">
                                                            <span className="material-icons">check_circle</span>
                                                            <p>Envío gratis para Lima y Callao</p>
                                                        </div>
                                                    </li>
                                                ) : (
                                                    <li>
                                                        <div className="message message-error">
                                                            <span className="material-icons">error</span>
                                                            <p>Lo sentimos, no tenemos información sobre agencias en este distrito</p>
                                                        </div>
                                                    </li>
                                                )
                                            ) : (
                                                <li>
                                                    <p className='text'>Busca y selecciona un distrito para ver las agencias disponibles</p>
                                                </li>
                                            )}
                                        </ul>
                                </div>
                            </div>

                            <div className='d-flex-column gap-20'>
                                <img src="/assets/imagenes/paginas/envios/envios-a-provincia.jpg" alt="Envíos a provincia" className='page-banner-img' />

                                {selectedAgencia ? (
                                    <div className='agencia-details'>
                                        <div className='d-flex-column gap-20'>
                                            <div className='d-flex-column'>
                                                <p className='block-title d-flex'>{selectedAgencia.agencia.agencia}</p>

                                                <div className='d-flex-center-between'>
                                                    <div className='d-flex-column'>
                                                        <div className='d-flex-center-left gap-5'>
                                                            <p className='text'>✔ Sede:</p>
                                                            <p className='text'>{selectedAgencia.sede.sede}</p>
                                                        </div>

                                                        <div className='d-flex-center-left gap-5'>
                                                            <p className='text'>✔ Dirección:</p>
                                                            <p className='text'>{selectedAgencia.sede.direccion || 'No disponible'}</p>
                                                        </div> 
                                                    </div>

                                                    <a href={selectedAgencia.sede.link || '#'} title='Ir' target='_blank' rel="noopener noreferrer" className='direction-link'>
                                                        <span className="material-icons">directions</span>
                                                        <p>Ir</p>
                                                    </a>
                                                </div>
                                            </div>

                                            <div className='d-grid-2-1fr gap-10'>
                                                <div className='d-flex-column gap-10'>
                                                    <div className='d-flex-center-left gap-10'>
                                                        <p className='title'>✔ Costo flete:</p>
                                                        <p className='title color-color-1'>S/.{selectedAgencia.sede['envio-por-agencia'] || '00.00'}</p>
                                                    </div>

                                                    <div className="message message-warning margin-right">
                                                        <span className="material-icons">warning</span>
                                                        <p>El precio mostrado es un aproximado por el envío de un dormitorio completo tamaño king. El precio será confirmado por la agencia.</p>
                                                    </div>
                                                </div>

                                                {hasEnvioDirecto(selectedDistrito) && (
                                                    <div className='d-flex-column gap-10'>
                                                        <div className='tipo-de-envio envío-directo'>
                                                            <div className='d-flex-column'>
                                                                <span className="material-icons">local_shipping</span>
                                                                <p className='tipo-envio-title'>Envío directo</p>
                                                            </div>
                                                            <p className='tipo-de-envio-price'>
                                                                {isLimaOrCallao(selectedDistrito) ? (
                                                                    <span className="free-shipping">Envío gratis para Lima y Callao</span>
                                                                ) : (
                                                                    `S/.${selectedDistrito['envio-directo']}`
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : selectedDistrito ? (
                                    <div className='distrito-details'>
                                        <div className='d-flex-column gap-20'>
                                            <div className='d-flex-column gap-10'>
                                                <p className='block-title d-flex'>{selectedDistrito.distrito}</p>
                                                
                                                {!isLimaOrCallao(selectedDistrito) && hasEnvioDirecto(selectedDistrito) && (
                                                    <div className='d-flex-column'>
                                                        <p className='text'>Contamos con envío directo para {selectedDistrito.distrito}. Llevamos tus productos a tu domicilio el día y a la hora que lo necesites.</p>
                                                    </div>
                                                )}

                                                {hasEnvioDirecto(selectedDistrito) && (
                                                    <div className='tipo-de-envio envío-directo'>
                                                        <div className='d-flex-column'>
                                                            <span className="material-icons">local_shipping</span>
                                                            <p className='tipo-envio-title'>Envío directo</p>
                                                        </div>
                                                        <p className='tipo-de-envio-price'>
                                                            {isLimaOrCallao(selectedDistrito) ? (
                                                                <span className="free-shipping">Envío gratis para Lima y Callao</span>
                                                            ) : (
                                                                `S/.${selectedDistrito['envio-directo']}`
                                                            )}
                                                        </p>
                                                    </div>
                                                )}

                                                {isLimaOrCallao(selectedDistrito) ? (
                                                    <div className="message message-success">
                                                        <span className="material-icons">check_circle</span>
                                                        <p>Envío gratis para Lima y Callao</p>
                                                    </div>
                                                ) : !selectedDistrito.agencias && !hasEnvioDirecto(selectedDistrito) ? (
                                                    <div className="message message-error">
                                                        <span className="material-icons">error</span>
                                                        <p>Lo sentimos, no contamos con servicio de entrega para este distrito</p>
                                                    </div>
                                                ) : !selectedDistrito.agencias ? (
                                                    <div className="message message-note">
                                                        <span className="material-icons">local_shipping</span>
                                                        <p>Contamos con envío directo a este distrito</p>
                                                    </div>
                                                ) : (
                                                    <div className="message message-note">
                                                        <span className="material-icons">sentiment_satisfied</span>
                                                        <p>El envío de dormitorios es gratis para Lima y Callao o al distrito de la agencia.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='empty-state'>
                                        <span className="material-icons">info</span>
                                        <p>Busca y selecciona un distrito para ver los detalles</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>
        </>
    );
}

export default Agencias;
