import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

import BtnGeneral from './Componentes/BtnGeneral/BtnGeneral';
import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';
import { usePagination } from '../../../Hooks/usePagination';

const normalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') {
        return '';
    }
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

function Complementos() {
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [orden, setOrden] = useState("ultimo");
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const itemsPerPage = 28;

    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewModeComplementos');
        return savedMode || 'grid';
    });

    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [filtroSkus, setFiltroSkus] = useState(null);
    const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);

    // Obtener la subcategoría desde la URL
    const getSubcategoriaFromURL = () => {
        const pathname = location.pathname;
        // Extraer la parte después de /productos/complementos/
        const match = pathname.match(/\/productos\/complementos\/([^\/]+)/);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    };

    const sub1 = getSubcategoriaFromURL();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    useEffect(() => {
        localStorage.setItem('viewModeComplementos', viewMode);
    }, [viewMode]);

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

    // Cargar filtros.json
    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/complementos/filtros.json');
                const data = await response.json();
                setFiltrosData(data);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, []);

    // Cargar productos
    useEffect(() => {
        const cargarProductosComplementos = async () => {
            try {
                setLoading(true);

                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                // Filtrar archivos de complementos
                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/complementos/') && 
                    url.endsWith('.json') &&
                    !url.includes('/filtros.json')
                );

                // Cargar todos los productos
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
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de complementos:", error);
                setProductos([]);
                setLoading(false);
            }
        };

        cargarProductosComplementos();
    }, []);

    const handleFiltroSkus = (skus) => {
        setFiltroSkus(skus);
        scrollToTop();
    };

    const handleEnvioGratis = (activo) => {
        setEnvioGratisActivo(activo);
        scrollToTop();
    };

    // Renderizar categorías desde filtros.json
    const renderCategoriasFilters = () => {
        if (!filtrosData?.filtros?.[0]?.subcategorías) return null;

        const subcategorias = filtrosData.filtros[0].subcategorías;
        const currentPath = location.pathname;

        return (
            <div className='prds-filter-tag'>
                <div 
                    className='prds-filter-title-container'
                    onClick={() => {
                        const tag = document.querySelector('.prds-filter-tag:first-child');
                        tag?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>Categoría</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {subcategorias.map((item, index) => {
                            const finalUrl = item.ruta;
                            const currentPathNormalized = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
                            const linkPathNormalized = finalUrl.endsWith('/') ? finalUrl.slice(0, -1) : finalUrl;
                            const isActive = currentPathNormalized === linkPathNormalized;
                            
                            return (
                                <li key={index}>
                                    <Link 
                                        to={finalUrl}
                                        className={isActive ? 'active' : ''}
                                        title={`Ver productos de ${item.subcategoría}`}
                                        onClick={scrollToTop}
                                    >
                                        <span></span>
                                        <p>{item.subcategoría}</p>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    // Filtrar productos por subcategoría (desde la URL)
    const productosFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        // Si no hay sub1, mostrar todos
        if (!sub1) {
            return productos;
        }

        // Buscar la subcategoría en filtrosData
        let subcategoriaBuscada = null;
        if (filtrosData?.filtros?.[0]?.subcategorías) {
            const subcategorias = filtrosData.filtros[0].subcategorías;
            
            // Buscar por ruta o por nombre
            const encontrada = subcategorias.find(item => {
                // Extraer el nombre de la subcategoría de la ruta
                const pathParts = item.ruta.split('/').filter(p => p);
                const lastPart = pathParts[pathParts.length - 1];
                
                return normalizarTexto(lastPart) === normalizarTexto(sub1) || 
                       normalizarTexto(item.subcategoría) === normalizarTexto(sub1);
            });
            
            if (encontrada) {
                subcategoriaBuscada = encontrada.subcategoría;
            } else {
                // Si no se encuentra en filtrosData, usar sub1 directamente
                subcategoriaBuscada = sub1;
            }
        } else {
            // Si no hay filtrosData, usar sub1 directamente
            subcategoriaBuscada = sub1;
        }

        // Filtrar productos
        const filtrados = productos.filter(producto => {
            const subcategoriaProducto = producto.subcategoría || '';
            const subcategoriaNormalizada = normalizarTexto(subcategoriaProducto);
            const subcategoriaBuscadaNormalizada = normalizarTexto(subcategoriaBuscada);
            
            return subcategoriaNormalizada === subcategoriaBuscadaNormalizada;
        });

        return filtrados;
    }, [productos, sub1, filtrosData]);

    // Aplicar filtros adicionales
    const productosConFiltrosAdicionales = useMemo(() => {
        let resultados = productosFiltrados;

        // Filtro envío gratis
        if (envioGratisActivo) {
            resultados = resultados.filter(producto => producto["tipo-de-envio"] === "Gratis");
        }

        // Filtro SKUs
        if (filtroSkus && Array.isArray(filtroSkus) && filtroSkus.length > 0) {
            resultados = resultados.filter(producto => filtroSkus.includes(producto.sku));
        }

        return resultados;
    }, [productosFiltrados, envioGratisActivo, filtroSkus]);

    const productosOrdenados = useMemo(() => {
        return [...productosConFiltrosAdicionales].sort((a, b) => {
            if (orden === "menor-mayor") {
                return a.precioVenta - b.precioVenta;
            } else if (orden === "mayor-menor") {
                return b.precioVenta - a.precioVenta;
            }
            return 0;
        });
    }, [productosConFiltrosAdicionales, orden]);

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        startIndex,
        endIndex,
        getVisiblePages,
        handlePageChange,
        handlePreviousPage,
        handleNextPage,
        resetPage
    } = usePagination(productosOrdenados.length, itemsPerPage);

    useEffect(() => {
        resetPage();
        scrollToTop();
    }, [sub1, envioGratisActivo, filtroSkus, orden]);

    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    const limpiarFiltros = () => {
        setFiltroSkus(null);
        setEnvioGratisActivo(false);
        resetPage();
        navigate(location.pathname);
        setResetFiltersTrigger(true);
        
        scrollToTop();
        
        setTimeout(() => {
            setResetFiltersTrigger(false);
        }, 100);
    };

    const hayFiltrosActivos = () => {
        return filtroSkus || envioGratisActivo;
    };

    const toggleFiltro = () => {};
    const isFiltroActivo = () => false;

    return(
        <>
            <Helmet>
                <title>Complementos | Dormihogar</title>
                <meta name='description' content='En dormihogar contamos con una gran variedad en complementos para tu hogar.' />
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <div className='products-page-blocks'>
                    <img src='/assets/imagenes/productos/complementos/cat-banner.png' className='h-cat-banner' alt=''/>

                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20-to-10'>
                                <div className='hp-cat-title'>
                                    <h1>Complementos</h1>
                                    <p className='text'>Encuentra los complementos ideales para tu hogar, en las mejores marcas del mercado</p>
                                </div>

                                <BtnGeneral 
                                    onEnvioGratisChange={handleEnvioGratis}
                                    onFiltroSkusChange={handleFiltroSkus}
                                    envioGratisActivo={envioGratisActivo}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    resetFilters={resetFiltersTrigger}
                                />

                                <div className='d-flex-column gap-20'>
                                    <div className='d-flex-center-left gap-5'>
                                        <span className="material-symbols-outlined">filter_alt</span>
                                        <p className='text title'>Filtros</p>
                                        {hayFiltrosActivos() && (
                                            <button 
                                                type="button" 
                                                className="limpiar-filtros-btn" 
                                                onClick={limpiarFiltros}
                                                style={{ marginLeft: '10px', fontSize: '12px', color: 'var(--color-1)' }}
                                            >
                                                Limpiar filtros
                                            </button>
                                        )}
                                    </div>

                                    <div className='prds-filters-container'>
                                        {renderCategoriasFilters()}
                                    </div>
                                </div>

                                <a href='/' title='Promo del mes | Dormihogar' className='d-flex w-100 border-r-6 overflow-hidden'>
                                    <img className='d-flex w-100' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__S5c-OF91SI1JrkskfFo5_DXbueZkXzbz4OTtzUN_nMO5DCp2F-11GMj&s=10' alt=''/>
                                </a>
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
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onPreviousPage={handlePreviousPage}
                            onNextPage={handleNextPage}
                            getVisiblePages={getVisiblePages}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                        />

                        <div className='products-page-products-container'>
                            {loading ? (
                                <div className="loading-products d-flex-center-center d-flex-column gap-10">
                                    <div className="spinner"></div>
                                    <p>Cargando complementos...</p>
                                </div>
                            ) : (
                                <>
                                    <ul className={`products-page-products ${viewMode}`}>
                                        {productosPagina.length === 0 ? (
                                            <div className='d-grid-1-1'>
                                                <div className="d-flex-column gap-10">
                                                    <p className='text'>
                                                        {sub1 ? 
                                                            `No se encontraron productos en "${sub1}"` :
                                                            'No se encontraron productos con los filtros seleccionados.'
                                                        }
                                                    </p>

                                                    {hayFiltrosActivos() && (
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
                                                />
                                            ))
                                        )}
                                    </ul>

                                    {productosPagina.length > 0 && totalPages > 1 && (
                                        <div className='pagination-container'>
                                            <button type='button' className='pagination-arrow' onClick={handlePreviousPage} disabled={currentPage === 1}>
                                                <span className="material-symbols-outlined">chevron_left</span>
                                                <p>Anterior</p>
                                            </button>

                                            <ul className='pagination-list'>
                                                {getVisiblePages().map((page, index) => 
                                                    typeof page === 'number' ? (
                                                        <li key={index}>
                                                            <button 
                                                                type='button'
                                                                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                                                onClick={() => handlePageChange(page)}
                                                            >
                                                                <p>{page}</p>
                                                            </button>
                                                        </li>
                                                    ) : (
                                                        <li key={index}>
                                                            <div className='dots'>
                                                                <span>...</span>
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>

                                            <button type='button' className='pagination-arrow' onClick={handleNextPage} disabled={currentPage === totalPages}>
                                                <p>Siguiente</p>
                                                <span className="material-symbols-outlined">chevron_right</span>
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
