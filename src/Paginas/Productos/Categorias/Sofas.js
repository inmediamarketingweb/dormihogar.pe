import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

import Categorias from '../Componentes/Categorias/Categorias';
import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';

const normalizarTexto = (texto) => {
    return texto.toLowerCase().normalize("NFD").replace(/\s+/g, "-");
};

const filtroKeyMap = {
    "tipo": "tipo",
    "marca": "marca", 
    "línea": "línea",
    "configuración": "configuración",
    "posición": "posición",
    "tamaño": "tamaño"
};

function Sofas() {
    const { sub1, sub2, sub3, sub4, sub5, marca, configuracion, cuerpos, orientacion, tamaño, id } = useParams();
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
    
    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Número de productos por página

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    const toggleEnvioGratis = () => {
        setEnvioGratisActivo(!envioGratisActivo);
        setCurrentPage(1); // Resetear a la primera página al cambiar filtro
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

    const determinarEstructura = () => {
        const path = location.pathname;
        
        if (path.includes('/butacas/')) {
            return { tipo: 'butacas', niveles: 2 };
        } else if (path.includes('/juegos-de-sala/')) {
            return { tipo: 'juegos-de-sala', niveles: 3 };
        } else if (path.includes('/mecedoras/')) {
            return { tipo: 'mecedoras', niveles: 2 };
        } else if (path.includes('/reclinables/')) {
            return { tipo: 'reclinables', niveles: 3 };
        } else if (path.includes('/seccionales/')) {
            return { tipo: 'seccionales', niveles: 3 };
        } else if (path.includes('/sofa-cama/')) {
            return { tipo: 'sofa-cama', niveles: 3 };
        }
        
        return { tipo: 'general', niveles: 0 };
    };

    useEffect(() => {
        const estructura = determinarEstructura();
        const path = location.pathname;
        
        if (id || (sub5 && !isNaN(sub5))) {
            navigate(path, { replace: true });
        }
    }, [sub1, sub2, sub3, sub4, sub5, marca, id, navigate, location.pathname]);

    useEffect(() => {
        const estructura = determinarEstructura();
        const path = location.pathname;
        
        if (id || (sub5 && !isNaN(sub5))) {
            return;
        }

        const cargarProductosSofas = async () => {
            try {
                setLoading(true);
                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/sofas/')
                );

                let rutaBuscada = '';
                
                if (estructura.tipo !== 'general') {
                    switch(estructura.tipo) {
                        case 'butacas':
                            rutaBuscada = `/sofas/butacas/${marca || ''}`;
                            break;
                        case 'juegos-de-sala':
                            rutaBuscada = `/sofas/juegos-de-sala/${configuracion || ''}/${marca || ''}`;
                            break;
                        case 'mecedoras':
                            rutaBuscada = `/sofas/mecedoras/${marca || ''}`;
                            break;
                        case 'reclinables':
                            rutaBuscada = `/sofas/reclinables/${cuerpos || ''}/${marca || ''}`;
                            break;
                        case 'seccionales':
                            rutaBuscada = `/sofas/seccionales/${orientacion || ''}/${marca || ''}`;
                            break;
                        case 'sofa-cama':
                            rutaBuscada = `/sofas/sofa-cama/${tamaño || ''}/${marca || ''}`;
                            break;
                        default:
                            break;
                    }
                } else {
                    const params = [sub1, sub2, sub3, sub4].filter(Boolean);
                    rutaBuscada = `/sofas/${params.join('/')}`;
                }

                rutaBuscada = rutaBuscada.replace(/\/+$/, '');

                if (rutaBuscada && rutaBuscada !== '/sofas') {
                    archivosProductos = archivosProductos.filter(url => {
                        const urlSinExtension = url.replace('.json', '');
                        return urlSinExtension.includes(rutaBuscada);
                    });
                }

                const productosPromesas = archivosProductos.map(async (url) => {
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        return data.productos || [];
                    } catch (error) {
                        console.error(`Error cargando ${url}:`, error);
                        return [];
                    }
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setCurrentPage(1); // Resetear a primera página al cargar nuevos productos
            } catch (error) {
                console.error("Error cargando productos de sofás:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarProductosSofas();
    }, [sub1, sub2, sub3, sub4, sub5, marca, configuracion, cuerpos, orientacion, tamaño, id, location.pathname]);

    useEffect(() => {
        const estructura = determinarEstructura();
        const path = location.pathname;
        
        if (id || (sub5 && !isNaN(sub5))) {
            return;
        }

        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/sofas/filtros.json');
                const data = await response.json();
                setFiltros(data.filtros || []);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, [sub1, sub2, sub3, sub4, sub5, marca, id, location.pathname]);

    const productosFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        if (queryParams.entries().length === 0 && !envioGratisActivo) return productos;

        return productos.filter(producto => {
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
                    if (!valorProducto) return false;

                    const normalizadoProducto = normalizarTexto(valorProducto.toString());
                    return normalizadoProducto === normalizadoFiltro;
                });

                if (!cumpleFiltro) return false;
            }
            return true;
        });
    }, [productos, queryParams, envioGratisActivo]);

    const productosOrdenados = useMemo(() => {
        return [...productosFiltrados].sort((a, b) => {
            const precioA = a.precioVenta || 0;
            const precioB = b.precioVenta || 0;

            if (orden === "menor-mayor") return precioA - precioB;
            if (orden === "mayor-menor") return precioB - precioA;
            return 0;
        });
    }, [productosFiltrados, orden]);

    // Lógica de paginación
    const totalItems = productosOrdenados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    // Función para obtener las páginas visibles
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
        // Desplazar hacia arriba cuando se cambia de página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePreviousPage = () => handlePageChange(currentPage - 1);
    const handleNextPage = () => handlePageChange(currentPage + 1);

    const toggleFiltro = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor);
        const newParams = new URLSearchParams(location.search);
        
        const valorActual = newParams.get(nombreFiltro);

        if (valorActual === normalizadoValor) {
            newParams.delete(nombreFiltro);
        } else {
            newParams.set(nombreFiltro, normalizadoValor);
        }

        setCurrentPage(1); // Resetear a la primera página al cambiar filtros
        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    };

    const isFiltroActivo = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor);
        return queryParams.get(nombreFiltro) === normalizadoValor;
    };

    const limpiarFiltros = () => {
        setCurrentPage(1); // Resetear a la primera página al limpiar filtros
        navigate(location.pathname, { replace: true });
    };

    const estructura = determinarEstructura();
    const path = location.pathname;
    if (id || (sub5 && !isNaN(sub5))) {
        return null;
    }

    return(
        <>
            <Helmet>
                <title>Sofás | Dormihogar</title>
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
                                    {filtros.map((filtro, index) => {
                                        const nombreFiltro = Object.keys(filtro)[0];
                                        const valoresFiltro = filtro[nombreFiltro];

                                        if (nombreFiltro === "sofas"){
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title uppercase'>Sofás</p>
                                                    <ul className='products-page-filter-list'>
                                                        {valoresFiltro.map((item, i) => (
                                                            <li key={i}>
                                                                <Link to={item.ruta} className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}>
                                                                    <p>{item.sofas}</p>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        }

                                        return(
                                            <div className='products-page-filter' key={index}>
                                                <p className='filter-title uppercase'>{nombreFiltro}</p>
                                                <ul className='products-page-filter-list'>
                                                    {valoresFiltro.map((valor, i) => (
                                                        <li key={i}>
                                                            <button 
                                                                type='button' 
                                                                className={isFiltroActivo(nombreFiltro, valor) ? "active" : ""} 
                                                                onClick={() => toggleFiltro(nombreFiltro, valor)}
                                                            >
                                                                <p>{valor}</p>
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>

                                {queryParams.toString() && (
                                    <button type="button" className="button-link button-link-2" onClick={limpiarFiltros}>
                                        <span className="material-icons">delete</span>
                                        <p className="button-link-text">Limpiar filtros</p>
                                    </button>
                                )}
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
                                    <p>Cargando productos...</p>
                                </div>
                            ) : (
                                <>
                                    <ul className="products-page-products">
                                        {productosPagina.length === 0 ? (
                                            <div className='d-grid-1-1'>
                                                <div className="d-flex-column gap-10">
                                                    <p className='text'>No se encontraron productos con los filtros seleccionados.</p>

                                                    {queryParams.toString() && (
                                                        <button type="button" className="margin-right button-link button-link-2" onClick={limpiarFiltros}>
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
                                    
                                    {/* Controles de paginación */}
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

export default Sofas;
