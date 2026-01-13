import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';

import './Productos.css';

import Categorias from './Componentes/Categorias/Categorias';
import FiltrosTop from './Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../Componentes/Plantillas/Producto/Producto';

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

function Productos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orden, setOrden] = useState("aleatorio");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setLoading(true);
                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                const productosPromesas = archivos.map(async (url) => {
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
                setCurrentPage(1);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos:", error);
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    const productosOrdenados = useMemo(() => {
        if (orden === "aleatorio") {
            return shuffleArray(productos);
        } else if (orden === "menor-mayor") {
            return [...productos].sort((a, b) => (a.precioVenta || 0) - (b.precioVenta || 0));
        } else if (orden === "mayor-menor") {
            return [...productos].sort((a, b) => (b.precioVenta || 0) - (a.precioVenta || 0));
        }
        return productos;
    }, [productos, orden]);

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

    const handlePreviousPage = () => handlePageChange(currentPage - 1);
    const handleNextPage = () => handlePageChange(currentPage + 1);

    const handleOrdenChange = (nuevoOrden) => {
        setOrden(nuevoOrden);
        setCurrentPage(1);
    };

    return(
        <>
            <Helmet>
                <title>Productos | Dormihogar</title>
            </Helmet>

            <main className='products-page-main d-flex-column gap-20'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className='products-page-left'>
                        <div className='products-page-filters-container'>
                            <div className='products-page-filters d-flex-column gap-20'>
                                <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
                                    <p className='block-title color-color-1 uppercase w-100 d-flex'>Dormihogar</p>
                                    <p className='uppercase w-100 d-flex'>Las mejores marcas en productos para el descanso</p>
                                </div>

                                <div className='products-page-categories-container'>
                                    <ul className='products-page-categories-list'>
                                        <li>
                                            <a href='/colchones/' title='Colchones | Dormihogar' className=''>
                                                <p>Colchones</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/productos/camas-box-tarimas/' title='Camas box tarimas | Dormihogar' className=''>
                                                <p>Camas box tarimas</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/productos/dormitorios/' title='Dormitorios | Dormihogar' className=''>
                                                <p>Dormitorios</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/productos/camas-funcionales/' title='Camas funcionales | Dormihogar' className=''>
                                                <p>Camas funcionales</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/productos/cabeceras/' title='Cabeceras | Dormihogar' className=''>
                                                <p>Cabeceras</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/productos/sofas/' title='Sofás | Dormihogar' className=''>
                                                <p>Sofás</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/productos/complementos/' title='Complementos | Dormihogar' className=''>
                                                <p>Complementos</p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='products-page-right'>
                        <FiltrosTop setOrden={handleOrdenChange} 
                            orden={orden} productosCount={productosOrdenados.length}
                            totalProductos={productos.length} currentPage={currentPage}
                            itemsPerPage={itemsPerPage} startIndex={startIndex}
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
                                                    <p className='text'>No se encontraron productos</p>
                                                </div>
                                            </div>
                                        ) : (
                                            productosPagina.map(producto => (
                                                <Producto key={producto.sku} producto={producto}/>
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
                                                        <button key={index} className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>{page}</button>
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
        </>
    );
}

export default Productos;
