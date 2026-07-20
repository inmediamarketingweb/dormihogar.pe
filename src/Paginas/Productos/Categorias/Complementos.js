import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

import Categorias from '../Componentes/Categorias/Categorias';
import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';

const normalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') {
        return '';
    }
    return texto.toLowerCase().normalize("NFD").replace(/\s+/g, "-");
};

const filtroKeyMap = {
    "tipo": "tipo",
    "marca": "marca", 
    "tamaño": "tamaño",
    "estilo": "estilo",
    "categoría": "categoría",
    "modelo": "modelo"
};

const mapaMarcasModelos = {
    "kamas": "kamas",
    "el-cisne": "el-cisne",
    "paraiso": "paraiso",
    "komfort": "komfort"
};

function Complementos(){
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState([]);
    const [orden, setOrden] = useState("ultimo");
    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const closeFilters = () => { setIsFiltersOpen(false); };

    const toggleEnvioGratis = () => { 
        setEnvioGratisActivo(!envioGratisActivo); 
        setCurrentPage(1); 
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filtersPanelRef.current && 
                !filtersPanelRef.current.contains(event.target) &&
                !event.target.closest('.filters-button-open')) {
                setIsFiltersOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const obtenerRutaExacta = useCallback(() => {
        const path = location.pathname;
        const partes = path.split('/').filter(Boolean);
        const partesRelevantes = partes.slice(1);
        return partesRelevantes.join('/');
    }, [location.pathname]);

    useEffect(() => {
        const cargarProductosComplementos = async () => {
            try {
                setLoading(true);
                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/complementos/')
                );

                const rutaActual = obtenerRutaExacta();

                if (rutaActual) {
                    const partesRuta = rutaActual.split('/');
                    archivosProductos = archivosProductos.filter(url => {
                        return partesRuta.every(parte => url.includes(parte));
                    });
                }

                const productosPromesas = archivosProductos.map(async (url) => {
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        const productosArchivo = data.productos || [];
                        return productosArchivo;
                    } catch (error) {
                        console.error(`Error cargando ${url}:`, error);
                        return [];
                    }
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setCurrentPage(1);
            } catch (error) {
                console.error("Error cargando productos de complementos:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarProductosComplementos();
    }, [location.pathname, obtenerRutaExacta]);

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/complementos/filtros.json');
                const data = await response.json();
                setFiltros(data.filtros || []);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, [location.pathname]);

    const marcaSeleccionada = useMemo(() => {
        return queryParams.get('marca') || '';
    }, [queryParams]);

    const filtrosFiltrados = useMemo(() => {
        return filtros.map(filtro => {
            const nombreFiltro = Object.keys(filtro)[0];
            const valoresFiltro = filtro[nombreFiltro];

            if (nombreFiltro === "modelos" && marcaSeleccionada) {
                const marcaNormalizada = normalizarTexto(marcaSeleccionada);
                const grupoModelos = mapaMarcasModelos[marcaNormalizada];

                if (grupoModelos) {
                    const modelosFiltrados = valoresFiltro.filter(grupo => {
                        const nombreGrupo = Object.keys(grupo)[0];
                        const grupoNormalizado = normalizarTexto(nombreGrupo);
                        return grupoNormalizado === grupoModelos;
                    });

                    if (modelosFiltrados.length > 0) {
                        return { [nombreFiltro]: modelosFiltrados };
                    }
                }

                return filtro;
            }

            return filtro;
        });
    }, [filtros, marcaSeleccionada]);

    const productosFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        let productosFiltradosTemp = productos;

        if (queryParams.entries().length === 0 && !envioGratisActivo) {
            productosFiltradosTemp = productos;
        } else {
            productosFiltradosTemp = productos.filter(producto => {
                if (envioGratisActivo) {
                    if (producto["tipo-de-envio"] !== "Gratis") {
                        return false;
                    }
                }

                if (queryParams.entries().length === 0) return true;

                for (let [paramUrl, valorFiltro] of queryParams.entries()) {
                    const claveJson = filtroKeyMap[paramUrl];
                    if (!claveJson) continue;

                    const normalizadoFiltro = normalizarTexto(valorFiltro);
                    const detalles = producto["detalles-del-producto"] || [];
                    
                    const cumpleFiltro = detalles.some(detalle => {
                        const valorProducto = detalle[claveJson];
                        if (!valorProducto) {
                            if (paramUrl === "modelo" && producto.modelo) {
                                const valorSuperior = producto.modelo;
                                const normalizadoSuperior = normalizarTexto(valorSuperior ? valorSuperior.toString() : '');
                                return normalizadoSuperior === normalizadoFiltro;
                            }
                            return false;
                        }

                        const normalizadoProducto = normalizarTexto(valorProducto.toString ? valorProducto.toString() : String(valorProducto));
                        return normalizadoProducto === normalizadoFiltro;
                    });

                    if (!cumpleFiltro) {
                        return false;
                    }
                }
                return true;
            });
        }

        return shuffleArray(productosFiltradosTemp);
    }, [productos, queryParams, envioGratisActivo]);

    const productosOrdenados = useMemo(() => {
        const ordenados = [...productosFiltrados].sort((a, b) => {
            const precioA = a.precioVenta || 0;
            const precioB = b.precioVenta || 0;

            if (orden === "menor-mayor") return precioA - precioB;
            if (orden === "mayor-menor") return precioB - precioA;
            return 0;
        });

        return ordenados;
    }, [productosFiltrados, orden]);

    const totalItems = productosOrdenados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    const getVisiblePages = () => {
        const visiblePages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
        } else {
            if (currentPage <= 3) { 
                visiblePages.push(1, 2, 3, 4, '...', totalPages); 
            } else if (currentPage >= totalPages - 2) {
                visiblePages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                visiblePages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return visiblePages;
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(Math.max(1, Math.min(totalPages, newPage)));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePreviousPage = () => {
        handlePageChange(currentPage - 1);
    };
    
    const handleNextPage = () => {
        handlePageChange(currentPage + 1);
    };

    const toggleFiltro = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor ? String(valor) : '');
        const newParams = new URLSearchParams(location.search);
        const valorActual = newParams.get(nombreFiltro);

        if (nombreFiltro === "marca") {
            newParams.delete('modelo');
        }

        if (valorActual === normalizadoValor) {
            newParams.delete(nombreFiltro);
        } else {
            newParams.set(nombreFiltro, normalizadoValor);
        }

        setCurrentPage(1);
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    };

    const isFiltroActivo = (nombreFiltro, valor) => {
        if (!valor) return false;
        const normalizadoValor = normalizarTexto(String(valor));
        const valorParam = queryParams.get(nombreFiltro);
        return valorParam === normalizadoValor;
    };

    const limpiarFiltros = () => {
        setCurrentPage(1);
        setEnvioGratisActivo(false);
        navigate(location.pathname, { replace: true });
    };

    const hayFiltrosActivos = queryParams.toString() || envioGratisActivo;

    return(
        <>
            <Helmet>
                <title>Complementos | Dormihogar</title>
            </Helmet>

            <main className='products-page-main d-flex-column gap-20'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20'>
                                <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
                                    <p className='block-title color-color-1 uppercase w-100 d-flex'>Dormihogar</p>
                                    <button type='button' className='filters-button-close margin-left' onClick={closeFilters}>
                                        <span className="material-icons color-color-1">close</span>
                                    </button>
                                    <p className='uppercase w-100 d-flex'>Las mejores marcas en productos para el descanso</p>
                                </div>

                                <div className='envio-gratis-button-container'>
                                    <div className='d-flex-center-center'>
                                        <p className='weight-bold uppercase color-color-1 font-bold'>Envío gratis</p>
                                    </div>
                                    <div type='button' className={`envio-gratis-button ${envioGratisActivo ? 'active' : ''}`} onClick={toggleEnvioGratis}>
                                        <span></span>
                                    </div>
                                </div>

                                <div className='products-page-filters-container d-flex-column gap-20'>
                                    {filtrosFiltrados.map((filtro, index) => {
                                        const nombreFiltro = Object.keys(filtro)[0];
                                        const valoresFiltro = filtro[nombreFiltro];

                                        if (nombreFiltro === "complementos") {
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title uppercase'>Complementos</p>
                                                    <ul className='products-page-filter-list'>
                                                        {valoresFiltro.map((item, i) => (
                                                            <li key={i}>
                                                                <Link 
                                                                    to={item.ruta} 
                                                                    className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}
                                                                >
                                                                    <p>{item.complementos}</p>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        }

                                        if (nombreFiltro === "modelos" && valoresFiltro.length === 0) {
                                            return null;
                                        }

                                        if (nombreFiltro === "tamaño") {
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title uppercase'>Tamaño</p>
                                                    <ul className='products-page-filter-list'>
                                                        {valoresFiltro.map((item, i) => {
                                                            if (typeof item === 'object' && item.tamaño && item.ruta) {
                                                                return (
                                                                    <li key={i}>
                                                                        <Link to={item.ruta} className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}>
                                                                            <p>{item.tamaño}</p>
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            }
                                                            return (
                                                                <li key={i}>
                                                                    <button type='button' className={isFiltroActivo(nombreFiltro, item) ? "active" : ""} onClick={() => toggleFiltro(nombreFiltro, item)}>
                                                                        <p>{item}</p>
                                                                    </button>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            );
                                        }

                                        if (nombreFiltro === "modelos") {
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title'>Modelos</p>
                                                    <div className='filter-subgroups'>
                                                        {valoresFiltro.map((grupo, idx) => {
                                                            const nombreGrupo = Object.keys(grupo)[0];
                                                            const modelos = grupo[nombreGrupo];

                                                            return(
                                                                <div key={idx} className='filter-subgroup d-flex-column gap-5'>
                                                                    {(!marcaSeleccionada || valoresFiltro.length > 1) && (
                                                                        <p className='filter-subgroup-title color-color-1 uppercase font-bold'>
                                                                            {typeof nombreGrupo === 'string' ? nombreGrupo.replace(/-/g, ' ') : nombreGrupo}
                                                                        </p>
                                                                    )}
                                                                    <ul className='products-page-filter-list'>
                                                                        {modelos.map((modelo, mIdx) => (
                                                                            <li key={mIdx}>
                                                                                <button type='button' className={isFiltroActivo("modelo", modelo) ? "active" : ""} onClick={() => toggleFiltro("modelo", modelo)}>
                                                                                    <p>{typeof modelo === 'string' ? modelo : modelo.modelo || JSON.stringify(modelo)}</p>
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return(
                                            <div className='products-page-filter' key={index}>
                                                <p className='filter-title uppercase'>{nombreFiltro.replace(/-/g, ' ')}</p>
                                                <ul className='products-page-filter-list'>
                                                    {valoresFiltro.map((valor, i) => {
                                                        let displayValue = valor;
                                                        if (typeof valor === 'object') {
                                                            if (valor[nombreFiltro]) {
                                                                displayValue = valor[nombreFiltro];
                                                            } else {
                                                                displayValue = Object.values(valor)[0] || JSON.stringify(valor);
                                                            }
                                                        }
                                                        return (
                                                            <li key={i}>
                                                                <button type='button' className={isFiltroActivo(nombreFiltro, displayValue) ? "active" : ""} onClick={() => toggleFiltro(nombreFiltro, displayValue)}>
                                                                    <p>{displayValue}</p>
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>

                                {hayFiltrosActivos && (
                                    <button type="button" className="button-link button-link-2" onClick={limpiarFiltros}>
                                        <span className="material-icons">delete</span>
                                        <p className="button-link-text">Limpiar filtros</p>
                                    </button>
                                )}

                                {/* <a href='https://homesleep.pe/productos/dormitorios/king/paraiso/abrazzo/americanos/20/' className='d-flex' title='PROMOCIÓN POR EL DIA DE MAMÁ - DORMITORIO KAMAS ROYAL ABRAZZO'>
                                    <img src="/assets/imagenes/productos/oferta-left.jpg" className='w-100 d-flex border-radius-10' alt="En Homesleep encontrarás las mejores ofertas en productos de dormitorios"/>
                                </a> */}
                            </div>
                        </div>
                    </div>

                    <div className='products-page-right'>
                        <FiltrosTop 
                            setOrden={setOrden} 
                            orden={orden} 
                            toggleFiltro={toggleFiltro} 
                            isFiltroActivo={isFiltroActivo}
                            setIsFiltersOpen={setIsFiltersOpen} 
                            isFiltersOpen={isFiltersOpen}
                            productosCount={productosOrdenados.length}
                            totalProductos={productos.length} 
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage} 
                            startIndex={startIndex} 
                            endIndex={endIndex}
                        />

                        <div className='products-page-products-container'>
                            {loading ? (
                                <div className="loading-products d-flex-center-center d-flex-column gap-10">
                                    <div className="spinner"></div>
                                    <p>Cargando complementos...</p>
                                </div>
                            ) : (
                                <>
                                    <ul className="products-page-products">
                                        {productosPagina.length === 0 ? (
                                            <div className='d-grid-1-1'>
                                                <div className="w-100 d-flex-column d-flex-center-center text-center gap-10">
                                                    <img src="/assets/imagenes/paginas/not-found.svg" alt="" width={320} />
                                                    <p className='text'>No se encontraron productos con los filtros seleccionados.</p>

                                                    {hayFiltrosActivos && (
                                                        <button type="button" className="button-link button-link-2" onClick={limpiarFiltros}>
                                                            <span className="material-icons">delete</span>
                                                            <p className='button-link-text'>Limpiar filtros</p>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            productosPagina.map(producto => (
                                                <Producto 
                                                    key={producto.sku} 
                                                    producto={producto} 
                                                    truncate={(str, maxLength) => str?.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str}
                                                />
                                            ))
                                        )}
                                    </ul>
                                    
                                    {productosPagina.length > 0 && totalPages > 1 && (
                                        <div className="pagination-controls d-grid-column-2-3 margin-top-20">
                                            <button className="pagination-arrow" onClick={handlePreviousPage} disabled={currentPage === 1}>
                                                <span className="material-icons">chevron_left</span>
                                            </button>

                                            <div className="d-flex-center-center gap-10">
                                                {getVisiblePages().map((page, index) => 
                                                    typeof page === 'number' ? (
                                                        <button 
                                                            key={index} 
                                                            className={`pagination-page ${currentPage === page ? 'active' : ''}`} 
                                                            onClick={() => handlePageChange(page)}
                                                        >
                                                            {page}
                                                        </button>
                                                    ) : (
                                                        <span key={index} className="pagination-ellipsis">...</span>
                                                    )
                                                )}
                                            </div>

                                            <button className="pagination-arrow" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                                <span className="material-icons">chevron_right</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <div className={`filters-layout ${isFiltersOpen ? 'active' : ''}`} onClick={closeFilters}></div>
        </>
    );
}

export default Complementos;
