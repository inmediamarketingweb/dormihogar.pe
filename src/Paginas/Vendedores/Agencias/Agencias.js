import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useSearchParams } from 'react-router-dom';

import './Agencias.css';

import SpinnerLoading from '../../../Componentes/SpinnerLoading/SpinnerLoading';

const useMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    return isMobile;
};

function Agencias() {
    const [datos, setDatos] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedDistrito, setSelectedDistrito] = useState(null);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchRef = useRef(null);
    const isMobile = useMobile();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const normalizeText = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    };

    const getDistritoByNombre = (nombre) => {
        if (!datos || !nombre) return null;
        
        const nombreNormalizado = normalizeText(nombre);
        
        for (const depto of datos.departamentos) {
            for (const prov of depto.provincias) {
                for (const dist of prov.distritos) {
                    const distritoNormalizado = normalizeText(dist.distrito);
                    if (distritoNormalizado === nombreNormalizado) {
                        return {
                            ...dist,
                            departamento: depto.departamento,
                            provincia: prov.provincia
                        };
                    }
                }
            }
        }
        return null;
    };

    const buscarDistritos = (term) => {
        if (!datos || !term || term.length < 1) return [];
        
        const termNormalizado = normalizeText(term);
        const resultados = [];
        const seen = new Set();
        
        datos.departamentos.forEach(depto => {
            depto.provincias.forEach(prov => {
                prov.distritos.forEach(dist => {
                    const distritoNormalizado = normalizeText(dist.distrito);
                    const provinciaNormalizado = normalizeText(prov.provincia);
                    const departamentoNormalizado = normalizeText(depto.departamento);
                    
                    // Buscar en distrito, provincia o departamento
                    if (distritoNormalizado.includes(termNormalizado) || 
                        provinciaNormalizado.includes(termNormalizado) ||
                        departamentoNormalizado.includes(termNormalizado)) {
                        
                        const key = `${dist.distrito}-${prov.provincia}-${depto.departamento}`;
                        if (!seen.has(key)) {
                            seen.add(key);
                            
                            // Calcular prioridad para ordenar resultados
                            let priority = 0;
                            if (distritoNormalizado === termNormalizado) {
                                priority = 3; // Coincidencia exacta en distrito
                            } else if (distritoNormalizado.startsWith(termNormalizado)) {
                                priority = 2; // Coincidencia al inicio en distrito
                            } else if (provinciaNormalizado === termNormalizado) {
                                priority = 1; // Coincidencia exacta en provincia
                            } else if (departamentoNormalizado === termNormalizado) {
                                priority = 1; // Coincidencia exacta en departamento
                            }
                            
                            resultados.push({
                                ...dist,
                                departamento: depto.departamento,
                                provincia: prov.provincia,
                                priority: priority,
                                distritoNormalizado: distritoNormalizado
                            });
                        }
                    }
                });
            });
        });
        
        resultados.sort((a, b) => b.priority - a.priority);
        return resultados.slice(0, 10);
    };

    const hasAgencias = (distrito) => {
        return distrito['agencias-recomendadas'] && 
               distrito['agencias-recomendadas'].length > 0 && 
               distrito['agencias-recomendadas'].some(agencia => agencia.sedes && agencia.sedes.length > 0);
    };

    const isLimaOrCallao = (distrito) => {
        if (!distrito) return false;
        const provinciasLimaCallao = [
            "Lima metropolitana", 
            "Provincia constitucional del Callao"
        ];
        return provinciasLimaCallao.includes(distrito.provincia);
    };

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const response = await fetch('/assets/json/costos-de-envio.json');
                
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

    useEffect(() => {
        if (datos) {
            const queryDistrito = searchParams.get('distrito');
            if (queryDistrito) {
                const distritoEncontrado = getDistritoByNombre(queryDistrito);
                if (distritoEncontrado) {
                    setSelectedDistrito(distritoEncontrado);
                    setSearchTerm(distritoEncontrado.distrito);
                }
            }
        }
    }, [datos, searchParams]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value !== selectedDistrito?.distrito) {
            setSelectedDistrito(null);
        }
        
        if (value.length >= 1) {
            const resultados = buscarDistritos(value);
            setSearchResults(resultados);
            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
            setSearchResults([]);
            setSelectedDistrito(null);
            setSearchParams({});
        }
    };

    const handleSearchClick = () => {
        if (searchTerm.length >= 1) {
            const resultados = buscarDistritos(searchTerm);
            setSearchResults(resultados);
            setShowSearchResults(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (searchResults.length === 1) {
                seleccionarDistrito(searchResults[0]);
                setShowSearchResults(false);
            } else if (searchResults.length > 1) {
                setShowSearchResults(true);
            }
        }
    };

    const seleccionarDistrito = (dist) => {
        setSelectedDistrito(dist);
        setSearchTerm(dist.distrito);
        setShowSearchResults(false);
        setSearchParams({ distrito: dist.distrito });
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

    const highlightText = (text, highlight) => {
        if (!highlight || highlight.length < 1 || !text) return text;
        const highlightLower = highlight.toLowerCase();
        const textLower = text.toLowerCase();
        const highlightIndex = textLower.indexOf(highlightLower);
        
        if (highlightIndex === -1) return text;
        
        return (
            <>
                {text.substring(0, highlightIndex)}
                <span className='highlight'>{text.substring(highlightIndex, highlightIndex + highlight.length)}</span>
                {text.substring(highlightIndex + highlight.length)}
            </>
        );
    };

    if (loading) {
        return <SpinnerLoading />;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="message message-error">
                    <span className="material-symbols-outlined">error</span>
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
                        <span className="material-symbols-outlined">refresh</span>
                        Recargar página
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Agencias recomendadas | Dormihogar</title>
                <meta name="description" content="Te ayudamos a encontrar la mejor alternativa para llevar tu dormitorio a tu distrito." />
                <link rel="preload" as="image" href="https://inmedia.pe/Proyectos/JSON/agencias.json" />
                <meta property="og:title" content="Agencias recomendadas | Dormihogar" />
                <meta property="og:site_name" content="Agencias recomendadas | Dormihogar" />
                <meta property="og:description" content="Te ayudamos a encontrar la mejor alternativa para llevar tu dormitorio a tu distrito." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://dormihogar.pe/agencias-recomendadas/" />
                <link rel="canonical" href="https://dormihogar.pe/agencias-recomendadas/" />
            </Helmet>

            <main className='page-agencias main'>
                <section className='block-container'>
                    <div className='block-content'>
                        <div className='block-title-container'>
                            <h1 className='block-title'>Agencias <b>recomendadas</b></h1>
                            <p className='block-title-span'>¡ Hacemos envíos a nivel nacional !</p>
                        </div>

                        <div className='agencias-search-container' ref={searchRef}>
                            <div className='agencias-search-content'>
                                <span className="material-symbols-outlined">search</span>
                                <input 
                                    type='text' 
                                    placeholder='Busca tu distrito'
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                />
                                <button type='button' onClick={handleSearchClick}>
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>

                            {showSearchResults && searchResults.length > 0 && (
                                <div className='agencias-results'>
                                    <ul>
                                        {searchResults.map((dist, index) => (
                                            <li key={index} onClick={() => seleccionarDistrito(dist)}>
                                                <div className='d-flex-column'>
                                                    <div className='d-flex gap-5'>
                                                        <p className='text-muted'>{dist.departamento},</p>
                                                        <p className='text-muted'>{dist.provincia}</p>
                                                    </div>
                                                    <p className='distrito-name'>
                                                        {highlightText(dist.distrito, searchTerm)}
                                                    </p>
                                                </div>
                                                <span className="material-symbols-outlined">chevron_right</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {showSearchResults && searchResults.length === 0 && searchTerm.length >= 1 && (
                                <div className='agencias-results'>
                                    <ul>
                                        <li className='no-results'>
                                            <span className="material-symbols-outlined">search_off</span>
                                            <p>No se encontraron resultados para "{searchTerm}"</p>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className='d-flex-column gap-10'>
                            {selectedDistrito && (
                                <div className='agencias-selected-container d-flex-column gap-20'>
                                    <div className='d-flex-column gap-5'>
                                        <div className='d-flex-center-left gap-5'>
                                            <p className='selected-distrito-location'>{selectedDistrito.departamento},</p>
                                            <p className='selected-distrito-location'>{selectedDistrito.provincia}</p>
                                        </div>
                                        <div className='d-flex-center-left'>
                                            <span className="material-symbols-outlined">location_on</span>
                                            <p className='selected-distrito-title'>{selectedDistrito.distrito}</p>
                                        </div>
                                    </div>

                                    {isLimaOrCallao(selectedDistrito) ? (
                                        <div className="message message-success">
                                            <span className="material-symbols-outlined">local_shipping</span>
                                            <p><strong>Envío directo y gratis a la puerta de tu domicilio</strong>, en compras mayores a los S/. 1,000 soles.</p>
                                        </div>
                                    ) : hasAgencias(selectedDistrito) ? (
                                        <div className='agencias-list'>
                                            <p className='agencias-list-title'>✔ Agencias recomendadas</p>
                                            {selectedDistrito['agencias-recomendadas'].map((agencia, index) => (
                                                agencia.sedes && agencia.sedes.map((sede, sedeIndex) => {
                                                    const agenciaKey = `${index}-${sedeIndex}`;
                                                    
                                                    return (
                                                        <div key={agenciaKey} className='agencia-card'>
                                                            <div className='agencia-card-header'>
                                                                <div className='agencia-info'>
                                                                    <span className="material-symbols-outlined">business</span>
                                                                    <div>
                                                                        <p className='agencia-name'>{agencia.agencia}</p>
                                                                        <p className='agencia-sede'>{sede.sede}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="message message-warning">
                                            <span className="material-symbols-outlined">error</span>
                                            <p>Lo sentimos, no conocemos agencias recomendadas para este distrito, sin embargo podemos ayudarte a encontrar la mejor.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Agencias;
