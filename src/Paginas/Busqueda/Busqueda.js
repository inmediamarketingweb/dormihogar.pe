import { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Helmet from 'react-helmet';

import { Producto } from '../../Componentes/Plantillas/Producto/Producto';

import './Busqueda.css';

function PaginaBusqueda() {
    const [productos, setProductos] = useState([]);
    const [filters, setFilters] = useState({ 
        tamanos: [], lineas: []
    });
    const [selectedFilters, setSelectedFilters] = useState({
        tamanos: [], lineas: []
    });
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 40;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';

    const normalizeStr = (str = '') => {
        if (!str) return '';
        return str.normalize('NFD')
                 .replace(/[\u0300-\u036f]/g, '')
                 .toLowerCase()
                 .trim();
    };

    useEffect(() => {
        const fetchProductos = async () => {
            setIsLoading(true);
            try{
                const manifestResponse = await fetch('/assets/json/manifest.json');
                if (!manifestResponse.ok) {
                    throw new Error(`HTTP error! status: ${manifestResponse.status}`);
                }
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                const productosArrays = await Promise.all(
                    archivos.map(async (archivo) => {
                        try {
                            const response = await fetch(archivo);
                            if (!response.ok) return [];
                            const data = await response.json();
                            return data.productos || [];
                        } catch (err) {
                            console.error(`Error loading ${archivo}:`, err);
                            return [];
                        }
                    })
                );

                const productosUnificados = productosArrays.flat();
                console.log('Total productos cargados:', productosUnificados.length);
                setProductos(productosUnificados);
            } catch (error){
                console.error('Error al cargar los productos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductos();
    }, []);

    // Cargar filtros
    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const response = await fetch('/assets/json/categorias/busqueda/filtros.json');
                if (response.ok) {
                    const data = await response.json();
                    setFilters({ tamanos: data.tamaños || [], lineas: data.lineas || [] });
                }
            } catch (error) {
                console.error('Error loading filter data:', error);
            }
        };

        fetchFilterData();
    }, []);

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value) 
                ? prev[filterType].filter(item => item !== value) 
                : [...prev[filterType], value]
        }));
        setCurrentPage(1);
    };

    // Filtrar productos usando useMemo para mejor rendimiento
    const filteredProductos = useMemo(() => {
        console.log('Filtrando productos con query:', query);
        console.log('Productos disponibles:', productos.length);

        // Si no hay query y no hay filtros, retornar array vacío
        if (!query.trim() && selectedFilters.tamanos.length === 0 && selectedFilters.lineas.length === 0) {
            return [];
        }

        const tokens = normalizeStr(query).split(' ').filter(Boolean);
        console.log('Tokens de búsqueda:', tokens);

        const filtered = productos.filter(producto => {
            const detalles = producto['detalles-del-producto']?.[0] || {};
            
            // Búsqueda por texto
            let searchMatch = true;
            if (tokens.length > 0) {
                const normalizedNombre = normalizeStr(String(producto.nombre ?? ''));
                const normalizedSKU = normalizeStr(String(producto.sku ?? ''));
                const normalizedCategoria = normalizeStr(String(producto.categoria ?? ''));
                const normalizedSubCategoria = normalizeStr(String(producto.subCategoria ?? ''));
                const normalizedDescripcion = normalizeStr(String(producto.descripcion ?? ''));

                searchMatch = tokens.every(token => {
                    return normalizedNombre.includes(token) || 
                           normalizedSKU.includes(token) || 
                           normalizedCategoria.includes(token) || 
                           normalizedSubCategoria.includes(token) ||
                           normalizedDescripcion.includes(token);
                });
            }

            // Filtros por tamaño y línea
            const sizeMatch = selectedFilters.tamanos.length === 0 || 
                            (detalles.tamaño && selectedFilters.tamanos.includes(detalles.tamaño));
            const lineMatch = selectedFilters.lineas.length === 0 || 
                            (detalles['línea-de-colchón'] && selectedFilters.lineas.includes(detalles['línea-de-colchón']));

            return searchMatch && sizeMatch && lineMatch;
        });

        console.log('Resultados encontrados:', filtered.length);
        return filtered;
    }, [query, productos, selectedFilters.tamanos, selectedFilters.lineas, normalizeStr]);

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [query, selectedFilters]);

    // Paginación
    const totalItems = filteredProductos.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    
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
    };

    const handlePreviousPage = () => handlePageChange(currentPage - 1);
    const handleNextPage = () => handlePageChange(currentPage + 1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentProducts = filteredProductos.slice(startIndex, endIndex);

    const truncate = (str, maxLength) => {
        if (!str) return '';
        if (str.length <= maxLength) return str;
        return str.slice(0, maxLength) + "...";
    };

    // Mostrar mensaje de carga
    if (isLoading) {
        return (
            <main>
                <div className='block-container'>
                    <div className='block-content'>
                        <div className='search-products-content'>
                            <p>Cargando productos...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return(
        <>
            <Helmet>
                <title>{query ? `${query} | Dormihogar` : 'Búsqueda | Dormihogar'}</title>
                <meta name='description' content="Resultados de búsqueda" />
            </Helmet>

            <main className='main results-main'>
                <div className='block-container'>
                    <section className='block-content d-flex-column gap-20'>
                        <div className='d-flex-column'>
                            <h1 className='text title'>{query ? `Resultados para: ${query}` : 'Todos los productos'}</h1>
                            {filteredProductos.length > 0 && (
                                <p className="text">{totalItems} {totalItems === 1 ? 'producto encontrado' : 'productos encontrados'}</p>
                            )}
                        </div>

                        <div className='search-products-content d-flex-column gap-20'>
                            {filteredProductos.length > 0 ? (
                                <>
                                    <ul className='search-products'>
                                        {currentProducts.map(producto => (
                                            <Producto 
                                                key={producto.sku || producto.id} 
                                                producto={producto} 
                                                truncate={truncate}
                                            />
                                        ))}
                                    </ul>

                                    {totalPages > 1 && (
                                        <div className="pagination-controls">
                                            <button 
                                                className="pagination-arrow" 
                                                onClick={handlePreviousPage} 
                                                disabled={currentPage === 1}
                                                aria-label="Página anterior"
                                            >
                                                <span className="material-icons">chevron_left</span>
                                                <p className='text'>Anterior</p>
                                            </button>

                                            <div className="d-flex-center-center gap-5">
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

                                            <button 
                                                className="pagination-arrow" 
                                                onClick={handleNextPage} 
                                                disabled={currentPage === totalPages}
                                                aria-label="Página siguiente"
                                            >
                                                <p className='text'>Siguiente</p>
                                                <span className="material-icons">chevron_right</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="no-results">
                                    <p>No se encontraron productos para "{query}"</p>
                                    <p className="suggestion">Intenta con otras palabras clave o revisa los filtros</p>
                                    <button 
                                        className="button-link button-link-1"
                                        onClick={() => {
                                            if (selectedFilters.tamanos.length > 0 || selectedFilters.lineas.length > 0) {
                                                setSelectedFilters({ tamanos: [], lineas: [] });
                                            }
                                        }}
                                    >
                                        Ver todos los productos
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default PaginaBusqueda;
