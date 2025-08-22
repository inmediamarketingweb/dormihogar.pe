import { useState, useEffect } from 'react';
import './MasProductos.css';
import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';

export default function MasProductos({ categoriaActual }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function fetchRandomProducts() {
            try {
                setLoading(true);
                setError(null);

                if (!categoriaActual || typeof categoriaActual !== 'string') {
                    throw new Error('Categoría inválida');
                }

                const basePath = window.location.origin;
                const manifestUrl = `${basePath}/assets/json/manifest.json`;
                
                const manifestRes = await fetch(manifestUrl, { signal });
                
                if (!manifestRes.ok) {
                    throw new Error(`Error ${manifestRes.status} al cargar manifest`);
                }
                
                const manifestText = await manifestRes.text();
                
                if (manifestText.startsWith('<!DOCTYPE') || manifestText.startsWith('<html')) {
                    throw new Error('El servidor devolvió HTML en lugar de manifest JSON');
                }
                
                const manifest = JSON.parse(manifestText);

                const allData = await Promise.all(
                    manifest.files.map(async (filePath) => {
                        try {
                            const fullUrl = filePath.startsWith('http') 
                                ? filePath 
                                : `${basePath}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
                            
                            const res = await fetch(fullUrl, { signal });
                            
                            if (!res.ok) {
                                console.error(`Error ${res.status} en: ${fullUrl}`);
                                return { productos: [] };
                            }
                            
                            const textData = await res.text();
                            
                            if (textData.startsWith('<!DOCTYPE') || textData.startsWith('<html')) {
                                console.error(`Archivo devuelve HTML: ${fullUrl}`);
                                return { productos: [] };
                            }
                            
                            return JSON.parse(textData);
                        } catch (fileError) {
                            console.error(`Error procesando archivo ${filePath}:`, fileError);
                            return { productos: [] };
                        }
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

                setProducts(shuffled.slice(0, 10));
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error al cargar productos:', err);
                    setError(`Error cargando productos: ${err.message}`);
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        }

        if (categoriaActual) {
            fetchRandomProducts();
        } else {
            setLoading(false);
        }

        return () => controller.abort();
    }, [categoriaActual, refreshTrigger]);

    const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

    const truncate = (str, maxLength) => 
        str?.length <= maxLength ? str : str?.slice(0, maxLength) + '...';

    if(loading){
        return(
            <div className='d-flex'>
                <p className='text'>Cargando más productos...</p>
            </div>
        );
    }

    if (error) {
        return(
            <div className='d-flex-column align-items-center gap-10'>
                <p className='text-error'>{error}</p>
                <button onClick={handleRefresh} className='button-link button-link-2'>
                    <p className='button-link-text'>Reintentar</p>
                    <span className="material-icons">cached</span>
                </button>
            </div>
        );
    }

    if (products.length === 0) {
        return(
            <div className='d-flex-column align-items-center gap-10'>
                <p className='text'>No se encontraron productos en esta categoría</p>
                <button onClick={handleRefresh} className='button-link button-link-2'>
                    <p className='button-link-text'>Reintentar</p>
                    <span className="material-icons">cached</span>
                </button>
            </div>
        );
    }

    return(
        <div className='block-container'>
            <div className='block-content'>
                <div className='block-title-container'>
                    <h4 className='block-title'>Más productos</h4>
                </div>

                <div className='d-flex-column gap-20'>
                    <div className="product-page-more-products-container">
                        <nav className="product-page-more-products-content">
                            <ul className='d-grid-5-3-2fr gap-10'>
                                {products.map((producto) => (
                                    <Producto producto={producto} truncate={truncate} />
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <button onClick={handleRefresh} className='button-link button-link-2 margin-left'>
                        <p className='button-link-text'>Ver más</p>
                        <span className="material-icons">cached</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
