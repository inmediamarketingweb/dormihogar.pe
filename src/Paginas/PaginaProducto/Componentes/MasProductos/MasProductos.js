// import { useState, useEffect } from 'react';

// import './MasProductos.css';

// import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';

// export default function MasProductos({ categoriaActual }) {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [refreshTrigger, setRefreshTrigger] = useState(0);

//     useEffect(() => {
//         const controller = new AbortController();
//         const { signal } = controller;

//         async function fetchRandomProducts() {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 if (!categoriaActual || typeof categoriaActual !== 'string') {
//                     throw new Error('Categoría inválida');
//                 }

//                 const basePath = window.location.origin;
//                 const manifestUrl = `${basePath}/assets/json/manifest.json`;
//                 const manifestRes = await fetch(manifestUrl, { signal });
//                 const contentType = manifestRes.headers.get('content-type') || '';

//                 if (!contentType.includes('application/json')) {
//                     const textResponse = await manifestRes.text();
//                     if (textResponse.startsWith('<!DOCTYPE')) {
//                         throw new Error('El servidor devolvió una página HTML en lugar de JSON. Verifique la ruta del manifest.');
//                     }
//                     throw new Error(`Tipo de contenido inválido: ${contentType}`);
//                 }

//                 const manifest = await manifestRes.json();
                
//                 const allData = await Promise.all(
//                     manifest.files.map(async (filePath) => {
//                         const fullUrl = filePath.startsWith('http') 
//                             ? filePath 
//                             : `${basePath}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
                            
//                         const res = await fetch(fullUrl, { signal });
                        
//                         const resContentType = res.headers.get('content-type') || '';
//                         if (!resContentType.includes('application/json')) {
//                             const text = await res.text();
//                             if (text.startsWith('<!DOCTYPE')) {
//                                 console.error(`Archivo devuelve HTML: ${fullUrl}`);
//                                 return { productos: [] };
//                             }
//                             throw new Error(`Tipo de contenido inválido para ${fullUrl}: ${resContentType}`);
//                         }

//                         return res.json();
//                     })
//                 );

//                 const normalizedCategory = categoriaActual.trim().toLowerCase();
//                 const categoryProducts = allData.reduce((acc, data) => {
//                     if (Array.isArray(data?.productos)) {
//                         const matches = data.productos.filter(p => 
//                             p.categoria?.trim().toLowerCase() === normalizedCategory
//                         );
//                         return [...acc, ...matches];
//                     }
//                     return acc;
//                 }, []);

//                 const shuffled = [...categoryProducts];
//                 for (let i = shuffled.length - 1; i > 0; i--) {
//                     const j = Math.floor(Math.random() * (i + 1));
//                     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//                 }

//                 setProducts(shuffled.slice(0, 15));
//             } catch (err) {
//                 if (err.name !== 'AbortError') {
//                     console.error('Error al cargar productos:', err);
//                     setError(`Error cargando productos: ${err.message}`);
//                 }
//             } finally {
//                 if (!signal.aborted) {
//                     setLoading(false);
//                 }
//             }
//         }

//         if (categoriaActual) {
//             fetchRandomProducts();
//         } else {
//             setLoading(false);
//         }

//         return () => controller.abort();
//     }, [categoriaActual, refreshTrigger]);

//     const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

//     const truncate = (str, maxLength) => 
//         str?.length <= maxLength ? str : str?.slice(0, maxLength) + '...';

//     if (loading) {
//         return (
//             <div className='d-flex'>
//                 <p className='text'>Cargando más productos...</p>
//             </div>
//         );
//     }

//     if(error){
//         return(
//             <div className='d-flex-column align-items-center gap-10'>
//                 <p className='text-error'>{error}</p>
//                 <button onClick={handleRefresh} className='button-link button-link-2'>
//                     <p className='button-link-text'>Reintentar</p>
//                     <span className="material-icons">cached</span>
//                 </button>
//             </div>
//         );
//     }

//     if (products.length === 0) {
//         return (
//             <div className='d-flex-column align-items-center gap-10'>
//                 <p className='text'>No se encontraron productos en esta categoría</p>
//                 <button onClick={handleRefresh} className='button-link button-link-2'>
//                     <p className='button-link-text'>Reintentar</p>
//                     <span className="material-icons">cached</span>
//                 </button>
//             </div>
//         );
//     }

//     return(
//         <div className='block-container'>
//             <div className='block-content'>
//                 <div className='d-flex-column d-flex-center-center gap-20'>
//                     <div className="product-page-more-products-container">
//                         <nav className="product-page-more-products-content">
//                             <ul className='d-grid-5-3-2fr gap-10'>
//                                 {products.map((producto) => (
//                                     // <li key={producto.sku} className='d-flex-column'>
//                                     //     <Producto producto={producto} truncate={truncate} />
//                                     // </li>
//                                     <Producto producto={producto} truncate={truncate} />
//                                 ))}
//                             </ul>
//                         </nav>
//                     </div>

//                     <button onClick={handleRefresh} className='button-link button-link-1'>
//                         <p className='button-link-text'>Ver más</p>
//                         <span className="material-icons">keyboard_arrow_down</span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useState, useEffect, useRef } from 'react';
import './MasProductos.css';
import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';

export default function MasProductos({ categoriaActual }) {
    const [products, setProducts] = useState([]);
    const [allAvailableProducts, setAllAvailableProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMoreProducts, setHasMoreProducts] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const initialLoadDone = useRef(false);
    const PRODUCTS_PER_PAGE = 15;
    const PRODUCTS_INCREMENT = 5;

    // Función para cargar productos de la API
    const loadProductsFromAPI = async (signal, isInitialLoad = true) => {
        try {
            if (isInitialLoad) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            if (!categoriaActual || typeof categoriaActual !== 'string') {
                throw new Error('Categoría inválida');
            }

            const basePath = window.location.origin;
            const manifestUrl = `${basePath}/assets/json/manifest.json`;
            const manifestRes = await fetch(manifestUrl, { signal });
            const contentType = manifestRes.headers.get('content-type') || '';

            if (!contentType.includes('application/json')) {
                const textResponse = await manifestRes.text();
                if (textResponse.startsWith('<!DOCTYPE')) {
                    throw new Error('El servidor devolvió una página HTML en lugar de JSON. Verifique la ruta del manifest.');
                }
                throw new Error(`Tipo de contenido inválido: ${contentType}`);
            }

            const manifest = await manifestRes.json();
            
            const allData = await Promise.all(
                manifest.files.map(async (filePath) => {
                    const fullUrl = filePath.startsWith('http') 
                        ? filePath 
                        : `${basePath}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
                        
                    const res = await fetch(fullUrl, { signal });
                    
                    const resContentType = res.headers.get('content-type') || '';
                    if (!resContentType.includes('application/json')) {
                        const text = await res.text();
                        if (text.startsWith('<!DOCTYPE')) {
                            console.error(`Archivo devuelve HTML: ${fullUrl}`);
                            return { productos: [] };
                        }
                        throw new Error(`Tipo de contenido inválido para ${fullUrl}: ${resContentType}`);
                    }

                    return res.json();
                })
            );

            const normalizedCategory = categoriaActual.trim().toLowerCase();
            const categoryProducts = allData.reduce((acc, data) => {
                if (Array.isArray(data?.productos)) {
                    const matches = data.productos.filter(p => 
                        p.categoria?.trim().toLowerCase() === normalizedCategory
                    );
                    return [...acc, ...matches];
                }
                return acc;
            }, []);

            const shuffled = [...categoryProducts];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            return shuffled;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error al cargar productos:', err);
                setError(`Error cargando productos: ${err.message}`);
            }
            return null;
        } finally {
            if (!signal.aborted) {
                if (isInitialLoad) {
                    setLoading(false);
                } else {
                    setLoadingMore(false);
                }
            }
        }
    };

    // Cargar productos iniciales
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function fetchInitialProducts() {
            if (!categoriaActual) {
                setLoading(false);
                return;
            }

            const allProducts = await loadProductsFromAPI(signal, true);
            
            if (allProducts && !signal.aborted) {
                setAllAvailableProducts(allProducts);
                const initialProducts = allProducts.slice(0, PRODUCTS_PER_PAGE);
                setProducts(initialProducts);
                setHasMoreProducts(allProducts.length > PRODUCTS_PER_PAGE);
                setCurrentPage(1);
                initialLoadDone.current = true;
            }
        }

        // Resetear estado cuando cambia la categoría
        setProducts([]);
        setAllAvailableProducts([]);
        setHasMoreProducts(true);
        setCurrentPage(1);
        initialLoadDone.current = false;
        
        fetchInitialProducts();

        return () => controller.abort();
    }, [categoriaActual]);

    // Función para cargar más productos
    const loadMoreProducts = () => {
        if (loadingMore || !hasMoreProducts) return;

        const nextPage = currentPage + 1;
        const startIndex = currentPage * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_INCREMENT;
        const newProducts = allAvailableProducts.slice(startIndex, endIndex);

        if (newProducts.length > 0) {
            setProducts(prevProducts => [...prevProducts, ...newProducts]);
            setCurrentPage(nextPage);
            setHasMoreProducts(endIndex < allAvailableProducts.length);
        } else {
            setHasMoreProducts(false);
        }
    };

    const truncate = (str, maxLength) => 
        str?.length <= maxLength ? str : str?.slice(0, maxLength) + '...';

    if (loading) {
        return (
            <div className='d-flex'>
                <p className='text'>Cargando más productos...</p>
            </div>
        );
    }

    if(error){
        return(
            <div className='d-flex-column align-items-center gap-10'>
                <p className='text-error'>{error}</p>
                <button onClick={() => window.location.reload()} className='button-link button-link-2'>
                    <p className='button-link-text'>Reintentar</p>
                    <span className="material-icons">cached</span>
                </button>
            </div>
        );
    }

    if (products.length === 0 && !loading) {
        return (
            <div className='d-flex-column align-items-center gap-10'>
                <p className='text'>No se encontraron productos en esta categoría</p>
                <button onClick={() => window.location.reload()} className='button-link button-link-2'>
                    <p className='button-link-text'>Reintentar</p>
                    <span className="material-icons">cached</span>
                </button>
            </div>
        );
    }

    return(
        <div className='block-container'>
            <div className='block-content'>
                <div className='d-flex-column d-flex-center-center gap-20'>
                    <div className="product-page-more-products-container">
                        <nav className="product-page-more-products-content">
                            <ul className='d-grid-5-3-2fr gap-10'>
                                {products.map((producto, index) => (
                                    <Producto producto={producto} truncate={truncate} />
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {hasMoreProducts && (
                        <button 
                            onClick={loadMoreProducts} 
                            className='button-link button-link-1'
                            disabled={loadingMore}
                        >
                            <p className='button-link-text'>
                                {loadingMore ? 'Cargando...' : 'Ver más'}
                            </p>
                            {!loadingMore && (
                                <span className="material-icons">keyboard_arrow_down</span>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
