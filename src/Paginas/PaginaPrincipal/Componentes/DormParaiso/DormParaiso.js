import { useEffect, useState } from 'react';
import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';
import SpinnerLoading from '../../../../Componentes/SpinnerLoading/SpinnerLoading';
import './DormParaiso.css';

const truncate = (str, maxLength) => {
    if (!str) return '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

function DormParaiso() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [favorites, setFavorites] = useState({});
    const [currentPage, setCurrentPage] = useState(0);

    const skusParaRenderizar = [
        'D32243266N24',
        'D32243266N21',
        'D32222266N11',
        'D322152266N14',
        'D32243266N27',
        'D32243266N26',
        'D32243266N35',
        'D32242196N36',
        'D32242283N15',
        'D32242283N23'
    ];
    
    const cargarProductosPorSKUs = async (skus) => {
        if (!skus || skus.length === 0) return [];
        
        try {
            const responseManifest = await fetch('/assets/json/manifest.json');
            const manifest = await responseManifest.json();
            
            const todosLosProductos = await Promise.all(
                manifest.files.map(async (fileUrl) => {
                    try {
                        const response = await fetch(fileUrl);
                        const data = await response.json();
                        return data.productos || (Array.isArray(data) ? data : []);
                    } catch (error) {
                        return [];
                    }
                })
            );
            
            const todosLosProductosFlat = todosLosProductos.flat();
            
            const productosEncontrados = skus.map(sku => 
                todosLosProductosFlat.find(p => p.sku === sku)
            ).filter(Boolean);
            
            return productosEncontrados;
        } catch (error) {
            console.error("Error cargando productos:", error);
            return [];
        }
    };

    useEffect(() => {
        const favStorage = JSON.parse(localStorage.getItem("favoritos")) || {};
        setFavorites(favStorage);
    }, []);

    const handleToggleFavorite = (producto) => {
        setFavorites(prev => {
            const newFavorites = {
                ...prev,
                [producto.sku]: !prev[producto.sku]
            };
            localStorage.setItem("favoritos", JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    useEffect(() => {
        const cargarProductos = async () => {
            setCargando(true);
            
            try {
                const productosCargados = await cargarProductosPorSKUs(skusParaRenderizar);
                setProductos(productosCargados);
            } catch (error) {
                console.error("Error cargando productos Paraiso:", error);
                setProductos([]);
            } finally {
                setCargando(false);
            }
        };
        
        cargarProductos();
    }, []);

    const handleDotClick = (index) => {
        setCurrentPage(index);
    };

    const productsPerPage = 5;
    const totalPages = Math.ceil(productos.length / productsPerPage);
    const startIndex = currentPage * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, productos.length);
    const productosPagina = productos.slice(startIndex, endIndex);

    useEffect(() => {
        if (productosPagina.length === 0 && currentPage > 0) {
            setCurrentPage(0);
        }
    }, [productos, currentPage, productosPagina.length]);

    return (
        <div className='block-container'>
            <section className='block-content'>
                <div className='block-title-container paraiso'>
                    <img src='https://paraisoperu.vtexassets.com/arquivos/Symbols.png' width={180} alt=''/>
                    <span className='block-title-span'>
                        Todos los productos de la marca <a className='font-bold color-color-1' href='/' title='Paraiso'>PARAISO</a> a los mejores precios
                    </span>
                </div>

                <div className='hp-paraiso-products-container'>
                    <div className='hp-paraiso-products-content'>
                        {cargando ? (
                            <SpinnerLoading />
                        ) : productos.length === 0 ? (
                            <div className="no-products">No hay productos disponibles</div>
                        ) : (
                            <ul>
                                {productosPagina.map((producto, index) => (
                                    <Producto 
                                        key={producto.sku || index}
                                        producto={producto}
                                        truncate={truncate}
                                        onToggleFavorite={handleToggleFavorite}
                                        isFavorite={!!favorites[producto.sku]}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className='hp-paraiso-productos-dots'>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <span 
                                    key={index}
                                    className={currentPage === index ? 'active' : ''}
                                    onClick={() => handleDotClick(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default DormParaiso;
