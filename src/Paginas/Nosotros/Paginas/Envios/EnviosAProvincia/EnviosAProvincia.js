import { Helmet } from "react-helmet-async";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import './EnviosAProvincia.css';

function EnviosAProvincia(){
    const [envios, setEnvios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEnvio, setSelectedEnvio] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedYear, setSelectedYear] = useState('todos');
    const [availableYears, setAvailableYears] = useState([]);
    const [imageOrder, setImageOrder] = useState([0, 1]);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const normalizeText = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    useEffect(() => {
        const loadEnvios = async () => {
            try {
                const response = await fetch('/assets/json/paginas/envios/envios-a-provincia.json');

                if (!response.ok) {
                    throw new Error('Error al cargar los datos');
                }

                const data = await response.json();
                const enviosPlano = [];
                const years = [];

                data.forEach(anioData => {
                    const anio = Object.keys(anioData)[0];
                    const enviosDelAnio = anioData[anio];

                    if (!years.includes(anio)) {
                        years.push(anio);
                    }

                    enviosDelAnio.forEach(envio => {
                        enviosPlano.push({
                            ...envio,
                            año: parseInt(anio)
                        });
                    });
                });

                const sortedData = enviosPlano.sort((a, b) => {
                    if (b.año !== a.año) {
                        return b.año - a.año;
                    }
                    return b.id - a.id;
                });

                setEnvios(sortedData);
                const sortedYears = years.sort((a, b) => parseInt(b) - parseInt(a));
                setAvailableYears(sortedYears);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error cargando los envíos:', err);
            }
        };

        loadEnvios();
    }, []);

    useEffect(() => {
        if (!loading) {
            const yearParam = searchParams.get('año');
            const searchParam = searchParams.get('destino') || searchParams.get('busqueda');

            if (yearParam) { setSelectedYear(yearParam); }
            if (searchParam) { setSearchTerm(searchParam); }
        }
    }, [loading, searchParams]);

    const updateUrlParams = (year, search) => {
        const params = new URLSearchParams();

        if (year && year !== 'todos') {
            params.set('año', year);
        }

        if (search) {
            params.set('destino', search);
        }

        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    const handleSearchChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        updateUrlParams(selectedYear, newSearchTerm);
    };

    const handleYearFilter = (year) => {
        const newYear = year === selectedYear ? 'todos' : year;
        setSelectedYear(newYear);
        updateUrlParams(newYear, searchTerm);
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedYear('todos');
        navigate(location.pathname, { replace: true });
    };

    const hasActiveFilters = searchTerm || selectedYear !== 'todos';

    const openPopup = (envio) => {
        setSelectedEnvio(envio);
        setShowPopup(true);
        setImageOrder([0, 1]);
        document.body.style.overflow = 'hidden';
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedEnvio(null);
        setImageOrder([0, 1]);
        document.body.style.overflow = 'auto';
    };

    const getPhotoUrls = (fotosPath) => {
        return {
            imgOne: `${fotosPath}1.jpg`,
            imgTwo: `${fotosPath}2.jpg`
        };
    };

    const getAllPhotos = (fotosPath) => {
        return [
            `${fotosPath}1.jpg`,
            `${fotosPath}2.jpg`
        ];
    };

    const nextImage = () => { setImageOrder((prevOrder) => [prevOrder[1], prevOrder[0]]); };
    const prevImage = () => { setImageOrder((prevOrder) => [prevOrder[1], prevOrder[0]]); };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showPopup) {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    setImageOrder((prevOrder) => [prevOrder[1], prevOrder[0]]);
                } else if (e.key === 'Escape') {
                    closePopup();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showPopup]);

    const filteredEnvios = envios.filter(envio => {
        const normalizedDestino = normalizeText(envio.destino);
        const normalizedSearchTerm = normalizeText(searchTerm);
        const matchesSearch = normalizedDestino.startsWith(normalizedSearchTerm);
        const matchesYear = selectedYear === 'todos' || envio.año.toString() === selectedYear;
        return matchesSearch && matchesYear;
    });

    if (loading) {
        return (
            <main className='padding-20-to-0'>
                <div className='block-container'>
                    <div className='block-content d-flex-column gap-20'>
                        <div className='loading-message'>
                            <p className='text'>Cargando información de envíos...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className='padding-20-to-0'>
                <div className='block-container'>
                    <div className='block-content d-flex-column gap-20'>
                        <div className='error-message'>
                            <p className='text'>Error: {error}</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return(
        <>
            <Helmet>
                <title>Envíos a provincia | Homesleep</title>
            </Helmet>

            <main className='padding-20-to-0'>
                <div className='block-container'>
                    <div className='block-content d-flex-column gap-20'>
                        <div className='province-top-container'>
                            <div className='search-container'>
                                <input placeholder='Busca tu provincia o distrito' value={searchTerm} onChange={handleSearchChange} className='province-search-input'/>
                            </div>

                            <div className='d-flex-center-center gap-10'>
                                <div className='year-filters'>
                                    {availableYears.map(year => (
                                        <button key={year} type='button' className={`year-filter-btn ${selectedYear === year.toString() ? 'active' : ''}`} onClick={() => handleYearFilter(year.toString())}>
                                            <p>{year}</p>
                                        </button>
                                    ))}
                                </div>

                                {hasActiveFilters && (
                                    <button className='clear-filters-btn' onClick={clearAllFilters} title="Limpiar todos los filtros">
                                        <span className="material-symbols-outlined">delete</span>
                                        <p className='text'>Limpiar filtros</p>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className='province-content'>
                            {filteredEnvios.length === 0 ? (
                                <div className='no-results'>
                                    <p className='text'>
                                        {
                                            searchTerm ? selectedYear === 'todos' ? `No hay envíos para "${searchTerm}"` : `No hay envíos para "${searchTerm}" en el año ${selectedYear}` : selectedYear === 'todos' ? 'No hay envíos disponibles' : `No hay envíos en el año ${selectedYear}`
                                        }
                                    </p>
                                    <div className='no-results-actions'>
                                        <button className='clear-filters-btn-secondary' onClick={clearAllFilters}>
                                            <span className="material-symbols-outlined">refresh</span>
                                            <p className='text'>Limpiar filtros y ver todos</p>
                                        </button>
                                    </div>
                                    <img src="/assets/imagenes/otros/ser-el-primero.jpg" alt="Sé el primero de tu zona en tener un dormitorio King" />
                                </div>
                            ) : (
                                filteredEnvios.map((envio, index) => {
                                    const photos = getPhotoUrls(envio.fotos);
                                    return (
                                        <div key={`${envio.año}-${envio.id}-${index}`} className={`province-tag province-tag-${(index % 3) + 1}`}>
                                            <div className='province-tag-info' onClick={() => openPopup(envio)} style={{ cursor: 'pointer' }}>
                                                <div>
                                                    <span className="material-symbols-outlined">location_on</span>
                                                    <div className='text'>{envio.destino}</div>
                                                </div>
                                                <div className='text'>{envio.año}</div>
                                            </div>

                                            <img src={photos.imgOne} alt={`Envío a ${envio.destino} - Imagen 1`} className='image-1' onClick={() => openPopup(envio)} style={{ cursor: 'pointer' }}/>
                                            <img src={photos.imgTwo} alt={`Envío a ${envio.destino} - Imagen 2`} className='image-2' onClick={() => openPopup(envio)} style={{ cursor: 'pointer' }}/>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <div className={`envios-layer ${showPopup ? 'active' : ''}`}
                onClick={(e) => {
                    if (e.target.classList.contains('envios-layer')) {
                        closePopup();
                    }
                }}
            ></div>

            <div className={`envios-pop-up ${showPopup ? 'active' : ''}`}>
                {selectedEnvio && (() => {
                    const allPhotos = getAllPhotos(selectedEnvio.fotos);
                    const firstImage = allPhotos[imageOrder[0]];
                    const secondImage = allPhotos[imageOrder[1]];
                    const currentImageIsFirst = imageOrder[0] === 0;

                    return (
                        <>
                            <button type="button" className='d-flex margin-left envios-pop-up-close' onClick={closePopup}>
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className='envios-pop-up-content'>
                                <div className='d-flex-column gap-10'>
                                    <div className='envios-pop-up-imagenes'>
                                        <ul>
                                            <li className={imageOrder[0] === 0 ? 'img-1' : 'img-2'}>
                                                <a href={firstImage} title={`${selectedEnvio.destino}`} target='_blank'>
                                                    <img src={firstImage} alt={`Envío a ${selectedEnvio.destino} - ${imageOrder[0] === 0 ? 'Imagen 1' : 'Imagen 2'}`}  className={imageOrder[0] === 0 ? 'image-1' : 'image-2'}/>
                                                </a>
                                            </li>
                                            <li className={imageOrder[1] === 1 ? 'img-2' : 'img-1'}>
                                                <a href={secondImage} title={`${selectedEnvio.destino}`} target='_blank'>
                                                    <img src={secondImage} alt={`Envío a ${selectedEnvio.destino} - ${imageOrder[1] === 1 ? 'Imagen 2' : 'Imagen 1'}`} className={imageOrder[1] === 1 ? 'image-2' : 'image-1'}/>
                                                </a>
                                            </li>
                                        </ul>

                                        <button type='button' className='envios-pop-up-button envios-pop-up-button-1' onClick={prevImage}>
                                            <span className="material-symbols-outlined">chevron_left</span>
                                        </button>

                                        <button type='button' className='envios-pop-up-button envios-pop-up-button-2' onClick={nextImage}>
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </div>
                                </div>

                                <div className='envios-pop-up-info'>
                                    <div className='info-item'>
                                        <span className="material-symbols-outlined rotate-270deg">line_end_circle</span>
                                        <div>
                                            <p className='info-label'>Destino</p>
                                            <p className='info-value'>{selectedEnvio.destino}</p>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <span className="material-symbols-outlined">local_shipping</span>
                                        <div>
                                            <p className='info-label'>Agencia</p>
                                            <p className='info-value'>{selectedEnvio.agencia}</p>
                                        </div>
                                    </div>
                                    <div className='info-item'>
                                        <span className="material-symbols-outlined">calendar_month</span>
                                        <div>
                                            <p className='info-label'>Año</p>
                                            <p className='info-value'>{selectedEnvio.año}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })()}
            </div>
        </>
    );
}

export default EnviosAProvincia;
