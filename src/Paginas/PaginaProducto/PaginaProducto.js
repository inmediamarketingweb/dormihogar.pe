// import { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet';
// import { useLocation } from 'react-router-dom';

// import Header from '../../Componentes/Header/Header';

// import Jerarquia from './Componentes/Jerarquia/Jerarquia';
// import Sku from './Componentes/Sku/Sku';
// import Imagenes from './Componentes/Imagenes/Imagenes';
// import Regalos from './Componentes/Regalos/Regalos';
// import Resumen from './Componentes/Resumen/Resumen';
// import Medidas from './Componentes/Medidas/Medidas';
// import Beneficios from './Componentes/Beneficios/Beneficios';
// import Envios from './Componentes/Envios/Envios';
// import TiposDeEnvio from './Componentes/TiposDeEnvio/TiposDeEnvio';
// import WhatsApp from './Componentes/WhatsApp/WhatsApp';
// import Descripcion from './Componentes/Descripcion/Descripcion';

// import MasProductos from './Componentes/MasProductos/MasProductos';

// import Footer from '../../Componentes/Footer/Footer';

// import './PaginaProducto.css';

// function PaginaProducto(){
//     const [shippingInfo, setShippingInfo] = useState(null);
//     const [shippingOptions, setShippingOptions] = useState([]);
//     const [selectedShipping, setSelectedShipping] = useState({ tipo: null, precio: null });
//     const location = useLocation();
//     const [producto, setProducto] = useState(null);
//     const [error, setError] = useState(false);
//     const [imagenes, setImagenes] = useState([]);
//     const [selectedColor, setSelectedColor] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [loading, setLoading] = useState(true);

//     const [userName, setUserName] = useState(
//         typeof window !== 'undefined' ? localStorage.getItem('nombre') || '' : ''
//     );

//     useEffect(() => {
//         const fetchProducto = async () => {
//             try {
//                 const path = location.pathname;
//                 const pathParts = path.split('/').filter(p => p);
                
//                 const searchPaths = [];
//                 for (let i = 3; i <= Math.min(7, pathParts.length); i++) {
//                     searchPaths.push(`/${pathParts.slice(0, i).join('/')}/`);
//                 }

//                 let productoEncontrado = null;

//                 for (const basePath of searchPaths) {
//                     productoEncontrado = await buscarProductoEnCategorias(basePath);
//                     if (productoEncontrado) {
//                         break;
//                     }
//                 }

//                 if (productoEncontrado) {
//                     setProducto(productoEncontrado);
//                     const imagenesCargadas = await cargarImagenes(productoEncontrado.fotos);
//                     setImagenes(imagenesCargadas);
//                 } else {
//                     setError(true);
//                 }
//             } catch (error) {
//                 console.error("Error al buscar el producto:", error);
//                 setError(true);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const buscarProductoEnCategorias = async (rutaBuscada) => {
//             const categorias = ["colchones", "camas-box-tarimas", "dormitorios", "camas-funcionales", "cabeceras", "sofas", "complementos"];
            
//             for (const categoria of categorias) {
//                 try {
//                     const subcategorias = await fetch(`/assets/json/categorias/${categoria}/sub-categorias/sub-categorias.json`)
//                         .then(response => response.json())
//                         .catch(() => ({ subcategorias: [] }));

//                     for (const subcat of subcategorias.subcategorias || []) {
//                         const subcatNombre = subcat.subcategoria.toLowerCase().replace(/\s+/g, "-");
//                         const jsonPath = `/assets/json/categorias/${categoria}/sub-categorias/${subcatNombre}.json`;
                        
//                         const data = await fetch(jsonPath)
//                             .then(response => response.json())
//                             .catch(() => null);

//                         if (data && data.productos) {
//                             const producto = data.productos.find(p => p.ruta === rutaBuscada);
//                             if (producto) return producto;
//                         }
//                     }

//                     for (const subcat of subcategorias.subcategorias || []) {
//                         const subcatNombre = subcat.subcategoria.toLowerCase().replace(/\s+/g, "-");
//                         const subSubCatPath = `/assets/json/categorias/${categoria}/sub-categorias/${subcatNombre}/sub-categorias.json`;
                        
//                         try {
//                             const subSubCatResponse = await fetch(subSubCatPath);
//                             if (!subSubCatResponse.ok) continue;
                            
//                             const subSubCatData = await subSubCatResponse.json();
                            
//                             for (const marca of subSubCatData.subcategorias || []) {
//                                 const marcaNombre = marca.subcategoria.toLowerCase().replace(/\s+/g, "-");
//                                 const marcaPath = `/assets/json/categorias/${categoria}/sub-categorias/${subcatNombre}/${marcaNombre}.json`;
                                
//                                 const marcaData = await fetch(marcaPath)
//                                     .then(response => response.json())
//                                     .catch(() => null);

//                                 if (marcaData && marcaData.productos) {
//                                     const producto = marcaData.productos.find(p => p.ruta === rutaBuscada);
//                                     if (producto) return producto;
//                                 }
//                             }
//                         } catch (e) {
//                             continue;
//                         }
//                     }
//                 } catch (error) {
//                     console.error(`Error en categoría ${categoria}:`, error);
//                 }
//             }
            
//             return null;
//         };

//         const cargarImagenes = async (carpetaFotos) => {
//             const formatos = ['jpg', 'webp', 'png'];
//             const maxFotos = 10;
//             const imagenesCargadas = [];

//             const cargarImagen = async (index, formato) => {
//                 const url = `${carpetaFotos}${index}.${formato}`;
//                 return new Promise((resolve) => {
//                     const img = new Image();
//                     img.onload = () => resolve(url);
//                     img.onerror = () => resolve(null);
//                     img.src = url;
//                 });
//             };

//             const promesas = [];
//             for (let index = 1; index <= maxFotos; index++) {
//                 for (const formato of formatos) {
//                     promesas.push(cargarImagen(index, formato));
//                 }
//             }

//             const resultados = await Promise.all(promesas);

//             resultados.forEach(url => {
//                 if (url) {
//                     imagenesCargadas.push(url);
//                 }
//             });

//             return imagenesCargadas;
//         };

//         setLoading(true);
//         setError(false);
//         fetchProducto();

//     }, [location.pathname]);

//     useEffect(() => {
//         if (producto){
//             document.title = producto.nombre;
//         }
//     }, [producto]);

//     useEffect(() => {
//         const handleStorageChange = () => {
//             setUserName(localStorage.getItem('nombre') || '');
//         };

//         window.addEventListener('storage', handleStorageChange);
//         return () => window.removeEventListener('storage', handleStorageChange);
//     }, []);

//     if (error) {
//         return(
//             <div className="error-container">
//                 <h2>Producto no encontrado</h2>
//                 <p>Lo sentimos, no pudimos cargar la información del producto.</p>
//                 <a href="/productos/">Ver todos los productos</a>
//             </div>
//         );
//     }

//     if (loading || !producto) {
//         return (
//             <div className="loading-container">
//                 <div className="loading-spinner"></div>
//                 <p>Cargando información del producto...</p>
//             </div>
//         );
//     }

//     const handleContinuarClick = (e) => {
//         if(!selectedShipping.tipo){
//             e.preventDefault();
//         }
//     };

//     const handleRemove = () => {
//         if (quantity > 0) {
//             setQuantity(quantity - 1);
//         }
//     };

//     const handleAdd = () => {
//         if (quantity < 10) {
//             setQuantity(quantity + 1);
//         }
//     };

//     const productSchema = {
//         "@context": "https://schema.org/",
//         "@type": "Product",
//         "name": producto.nombre,
//         "image": [
//             `https://dormihogar.pe${producto.fotos}1.jpg`
//         ],
//         "description": producto["resumen-del-producto"].map(d => Object.values(d)[0]).join(' – '),
//         "sku": producto.sku,
//         "brand": {
//             "@type": "Brand",
//             "name": "Dormihogar"
//         },
//         "offers": {
//             "@type": "Offer",
//             "url": `https://dormihogar.pe${producto.ruta}`,
//             "priceCurrency": "PEN",
//             "price": producto.precioVenta,
//             "priceValidUntil": "2025-12-31",
//             "itemCondition": "https://schema.org/NewCondition",
//             "availability": producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
//         }
//     };

//     return(
//         <>
//             <Helmet>
//                 <title>{producto.nombre}</title>
//                 <meta name="description" content={producto.nombre}/>

//                 <link rel="preload" as="image" href={`https://dormihogar.pe${producto.fotos}1.jpg`} />

//                 <meta property="og:image" content={`https://dormihogar.pe${producto.fotos}1.jpg`}/>
//                 <meta property="og:title" content={producto.nombre}/>
//                 <meta property="og:site_name" content={producto.nombre}/>
//                 <meta property="og:description" content={producto.nombre}/>
//                 <meta property="og:type" content="website"/>
//                 <meta property="og:url" content={`https://dormihogar.pe${producto.ruta}`}/>

//                 <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
//             </Helmet>

//             <Header/>

//             <main>
//                 <div className='block-container product-page-block-container'>
//                     <section className='block-content product-page-block-content'>
//                         <Jerarquia producto={producto} />

//                         <div className='product-page-container'>
//                             <div className='product-page-target product-page-target-1'>
//                                 <Imagenes imagenes={imagenes} producto={producto} onSelectColor={setSelectedColor} />
//                             </div>

//                             <div className='product-page-target product-page-target-2 d-flex-column gap-20'>
//                                 <div className='product-page-top-info'>
//                                     <p className='product-page-category'>{producto.categoria}</p>
//                                     <h1 className='product-page-name'>{producto.nombre}</h1>
//                                     <Sku producto={producto} />
//                                 </div>

//                                 <div className='d-grid-2-1fr gap-20'>
//                                     <div className='d-flex-column gap-20'>
//                                         <div className='page-product-prices'>
//                                             <p className='page-product-normal-price'>Antes: S/.{producto.precioNormal}</p>
//                                             <p className='page-product-sale-price'>Ahora: S/.{producto.precioVenta}</p>
//                                         </div>

//                                         <Regalos producto={producto} />

//                                         <div className='d-flex gap-20'>
//                                             <Resumen producto={producto} />
//                                             <Medidas producto={producto} />
//                                         </div>

//                                         <div className='d-flex-column'>
//                                             <div className='d-flex-start gap-5'>
//                                                 <span className='color-red'>*</span>
//                                                 <p className='text font-14'>Realizamos envios inmediatos a provincia</p>
//                                             </div>
//                                             <div className='d-flex-start gap-5'>
//                                                 <span className='color-red'>*</span>
//                                                 <p className='text font-14'>Entregas el mismo día para Lima y Callao</p>
//                                             </div>
//                                         </div>

//                                         <Beneficios/>
//                                     </div>

//                                     <div className='d-flex-column gap-20'>
//                                         <Envios producto={producto} onConfirm={(data) => {
//                                             setShippingInfo(data); 
//                                             setShippingOptions(data.shippingOptions);

//                                             if (data.shippingOptions.length === 1) {
//                                                 setSelectedShipping({
//                                                     tipo: data.shippingOptions[0].tipo,
//                                                     precio: data.shippingOptions[0].precio
//                                                 });
//                                             }
//                                         }}/>

//                                         <TiposDeEnvio 
//                                             shippingOptions={shippingOptions} 
//                                             provincia={shippingInfo?.locationData?.provincia || ''} 
//                                             distrito={shippingInfo?.locationData?.distrito || ''} 
//                                             hasAgency={shippingInfo?.hasAgency} 
//                                             selectedTipo={selectedShipping.tipo} 
//                                             onSelect={(tipo, precio) => setSelectedShipping({ tipo, precio })} 
//                                         />

//                                         <div className='product-page-user-name-container d-flex-column gap-5'>
//                                             <p className='text'><b className='color-red'>*</b> Nombres</p>
//                                             <input 
//                                                 type='text' 
//                                                 placeholder='Nombres' 
//                                                 className='product-page-user-name' 
//                                                 value={userName}
//                                                 onChange={(e) => {
//                                                     setUserName(e.target.value);
//                                                     localStorage.setItem('nombre', e.target.value);
//                                                 }} 
//                                             />
//                                         </div>

//                                         <div className='d-flex-column gap-5'>
//                                             <p className='title text'>Detalles:</p>

//                                             {!selectedColor ? (
//                                                 <p className='d-flex gap-5'><b className='color-red'>*</b>Sin variación de color</p>
//                                             ) : (
//                                                 <div className='d-flex gap-5'>
//                                                     <p className='bold color-black d-flex gap-5'><b className='color-red'>*</b>Color seleccionado:</p>
//                                                     <span>{selectedColor.color}</span>
//                                                     <img src={selectedColor.img} alt={selectedColor.color} />
//                                                 </div>
//                                             )}
//                                         </div>

//                                         <div className='d-flex-center-center gap-10'>
//                                             <div className='d-flex-column gap-10'>
//                                                 <div className='quantity'>
//                                                     <button 
//                                                         type="button" 
//                                                         onClick={handleRemove} 
//                                                         disabled={quantity <= 1}
//                                                     >
//                                                         <span className="material-icons">remove</span>
//                                                     </button>
//                                                     <div className="quantity-input">{quantity}</div>
//                                                     <button 
//                                                         type="button" 
//                                                         onClick={handleAdd} 
//                                                         disabled={quantity >= 10}
//                                                     >
//                                                         <span className="material-icons">add</span>
//                                                     </button>
//                                                 </div>
//                                             </div>

//                                             <WhatsApp 
//                                                 producto={producto} 
//                                                 selectedShipping={selectedShipping} 
//                                                 shippingInfo={shippingInfo} 
//                                                 selectedColor={selectedColor} 
//                                                 quantity={quantity} 
//                                                 handleContinuarClick={handleContinuarClick}
//                                             />
//                                         </div>

//                                         <div className='whatsapp-message d-flex d-flex-column gap-5'>
//                                             <span className="material-icons">info</span>
//                                             <p>La información solicitada se utilizará para agilizar el proceso de compra.</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <Descripcion producto={producto}/>
//                     </section>
//                 </div>

//                 <MasProductos categoriaActual={producto.categoria}/>
//             </main>

//             <Footer/>
//         </>
//     );
// }

// export default PaginaProducto;

import { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import Header from '../../Componentes/Header/Header';

import Jerarquia from './Componentes/Jerarquia/Jerarquia';
import Sku from './Componentes/Sku/Sku';
import Imagenes from './Componentes/Imagenes/Imagenes';
import Regalos from './Componentes/Regalos/Regalos';
import Resumen from './Componentes/Resumen/Resumen';
import Medidas from './Componentes/Medidas/Medidas';
import Beneficios from './Componentes/Beneficios/Beneficios';
import Envios from './Componentes/Envios/Envios';
import TiposDeEnvio from './Componentes/TiposDeEnvio/TiposDeEnvio';
import WhatsApp from './Componentes/WhatsApp/WhatsApp';
import Descripcion from './Componentes/Descripcion/Descripcion';

import Footer from '../../Componentes/Footer/Footer';

import './PaginaProducto.css';

// Lazy loading para componentes pesados
const MasProductos = lazy(() => import('./Componentes/MasProductos/MasProductos'));

function PaginaProducto(){
    const [shippingInfo, setShippingInfo] = useState(null);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState({ tipo: null, precio: null });
    const location = useLocation();
    const [productoData, setProductoData] = useState({
        producto: null,
        imagenes: [],
        error: false,
        loading: true
    });
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [userName, setUserName] = useState(
        typeof window !== 'undefined' ? localStorage.getItem('nombre') || '' : ''
    );

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const path = location.pathname;
                
                try {
                    const indexResponse = await fetch('/assets/json/manifest.json');
                    const productIndex = await indexResponse.json();
                    const productPath = productIndex[path];
                    
                    if (productPath) {
                        const response = await fetch(productPath);
                        const productoData = await response.json();
                        
                        setProductoData(prev => ({
                            ...prev,
                            producto: productoData,
                            loading: false
                        }));
                        
                        cargarImagenesOptimizadas(productoData.fotos);
                        return;
                    }
                } catch (indexError) {
                    console.warn("No se encontró índice de productos, usando búsqueda alternativa");
                }

                const pathParts = path.split('/').filter(p => p);
                const searchPaths = [];
                for (let i = 3; i <= Math.min(7, pathParts.length); i++) {
                    searchPaths.push(`/${pathParts.slice(0, i).join('/')}/`);
                }

                let productoEncontrado = null;

                for (const basePath of searchPaths) {
                    productoEncontrado = await buscarProductoEnCategorias(basePath);
                    if (productoEncontrado) break;
                }

                if (productoEncontrado) {
                    setProductoData(prev => ({
                        ...prev,
                        producto: productoEncontrado,
                        loading: false
                    }));
                    cargarImagenesOptimizadas(productoEncontrado.fotos);
                } else {
                    setProductoData(prev => ({
                        ...prev,
                        error: true,
                        loading: false
                    }));
                }
            } catch (error) {
                console.error("Error al buscar el producto:", error);
                setProductoData(prev => ({
                    ...prev,
                    error: true,
                    loading: false
                }));
            }
        };

        const buscarProductoEnCategorias = async (rutaBuscada) => {
            const categorias = ["colchones", "camas-box-tarimas", "dormitorios", "camas-funcionales", "cabeceras", "sofas", "complementos"];
            
            const categoriaPromises = categorias.map(async (categoria) => {
                try {
                    const subcategorias = await fetch(`/assets/json/categorias/${categoria}/sub-categorias/sub-categorias.json`)
                        .then(response => response.json())
                        .catch(() => ({ subcategorias: [] }));

                    // Buscar en subcategorías directas
                    for (const subcat of subcategorias.subcategorias || []) {
                        const subcatNombre = subcat.subcategoria.toLowerCase().replace(/\s+/g, "-");
                        const jsonPath = `/assets/json/categorias/${categoria}/sub-categorias/${subcatNombre}.json`;
                        
                        const data = await fetch(jsonPath)
                            .then(response => response.json())
                            .catch(() => null);

                        if (data?.productos) {
                            const producto = data.productos.find(p => p.ruta === rutaBuscada);
                            if (producto) return producto;
                        }
                    }

                    // Buscar en sub-subcategorías
                    const subSubCatPromises = (subcategorias.subcategorias || []).map(async (subcat) => {
                        const subcatNombre = subcat.subcategoria.toLowerCase().replace(/\s+/g, "-");
                        const subSubCatPath = `/assets/json/categorias/${categoria}/sub-categorias/${subcatNombre}/sub-categorias.json`;
                        
                        try {
                            const subSubCatResponse = await fetch(subSubCatPath);
                            if (!subSubCatResponse.ok) return null;
                            
                            const subSubCatData = await subSubCatResponse.json();
                            
                            for (const marca of subSubCatData.subcategorias || []) {
                                const marcaNombre = marca.subcategoria.toLowerCase().replace(/\s+/g, "-");
                                const marcaPath = `/assets/json/categorias/${categoria}/sub-categorias/${subcatNombre}/${marcaNombre}.json`;
                                
                                const marcaData = await fetch(marcaPath)
                                    .then(response => response.json())
                                    .catch(() => null);

                                if (marcaData?.productos) {
                                    const producto = marcaData.productos.find(p => p.ruta === rutaBuscada);
                                    if (producto) return producto;
                                }
                            }
                        } catch (e) {
                            return null;
                        }
                        return null;
                    });

                    const subSubResults = await Promise.all(subSubCatPromises);
                    return subSubResults.find(result => result !== null) || null;
                    
                } catch (error) {
                    console.error(`Error en categoría ${categoria}:`, error);
                    return null;
                }
            });

            const results = await Promise.all(categoriaPromises);
            return results.find(result => result !== null) || null;
        };

        const cargarImagenesOptimizadas = (carpetaFotos) => {
            const cargarImagen = async (index, formato) => {
                const url = `${carpetaFotos}${index}.${formato}`;
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(url);
                    img.onerror = () => resolve(null);
                    img.src = url;
                });
            };

            // Cargar primera imagen inmediatamente (prioridad alta)
            (async () => {
                const primeraImagen = 
                    await cargarImagen(1, 'webp') || 
                    await cargarImagen(1, 'jpg') || 
                    await cargarImagen(1, 'png');
                
                if (primeraImagen) {
                    setProductoData(prev => ({
                        ...prev,
                        imagenes: [primeraImagen]
                    }));
                }
            })();

            // Cargar el resto de imágenes en segundo plano (prioridad baja)
            setTimeout(async () => {
                const promesas = [];
                const formatos = ['webp', 'jpg']; // Priorizar formatos modernos
                
                // Cargar hasta 5 imágenes adicionales
                for (let index = 2; index <= 5; index++) {
                    for (const formato of formatos) {
                        promesas.push(cargarImagen(index, formato));
                    }
                }

                const resultados = await Promise.all(promesas);
                const nuevasImagenes = resultados.filter(url => url !== null);
                
                setProductoData(prev => ({
                    ...prev,
                    imagenes: [...prev.imagenes, ...nuevasImagenes]
                }));
            }, 100);
        };

        setProductoData(prev => ({ ...prev, loading: true, error: false }));
        fetchProducto();

    }, [location.pathname]);

    useEffect(() => {
        if (productoData.producto){
            document.title = productoData.producto.nombre;
        }
    }, [productoData.producto]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const handleStorageChange = () => {
            const storedName = localStorage.getItem('nombre') || '';
            if (storedName !== userName) {
                setUserName(storedName);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [userName]);

    if (productoData.error) {
        return(
            <div className="error-container">
                <h2>Producto no encontrado</h2>
                <p>Lo sentimos, no pudimos cargar la información del producto.</p>
                <a href="/productos/">Ver todos los productos</a>
            </div>
        );
    }

    if (productoData.loading || !productoData.producto) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando información del producto...</p>
            </div>
        );
    }

    const { producto, imagenes } = productoData;

    const handleContinuarClick = (e) => {
        if(!selectedShipping.tipo){
            e.preventDefault();
        }
    };

    const handleRemove = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    };

    const handleAdd = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1);
        }
    };

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": producto.nombre,
        "image": [
            `https://dormihogar.pe${producto.fotos}1.jpg`
        ],
        "description": producto["resumen-del-producto"].map(d => Object.values(d)[0]).join(' – '),
        "sku": producto.sku,
        "brand": {
            "@type": "Brand",
            "name": "Dormihogar"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://dormihogar.pe${producto.ruta}`,
            "priceCurrency": "PEN",
            "price": producto.precioVenta,
            "priceValidUntil": "2025-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
    };

    return(
        <>
            <Helmet>
                <title>{producto.nombre}</title>
                <meta name="description" content={producto.nombre}/>

                <link rel="preload" as="image" href={`https://dormihogar.pe${producto.fotos}1.jpg`} />

                <meta property="og:image" content={`https://dormihogar.pe${producto.fotos}1.jpg`}/>
                <meta property="og:title" content={producto.nombre}/>
                <meta property="og:site_name" content={producto.nombre}/>
                <meta property="og:description" content={producto.nombre}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={`https://dormihogar.pe${producto.ruta}`}/>

                <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
            </Helmet>

            <Header/>

            <main>
                <div className='block-container product-page-block-container'>
                    <section className='block-content product-page-block-content'>
                        <Jerarquia producto={producto} />

                        <div className='product-page-container'>
                            <div className='product-page-target product-page-target-1'>
                                <Imagenes 
                                    imagenes={imagenes} 
                                    producto={producto} 
                                    onSelectColor={setSelectedColor} 
                                />
                            </div>

                            <div className='product-page-target product-page-target-2 d-flex-column gap-20'>
                                <div className='product-page-top-info'>
                                    <p className='product-page-category'>{producto.categoria}</p>
                                    <h1 className='product-page-name'>{producto.nombre}</h1>
                                    <Sku producto={producto} />
                                </div>

                                <div className='d-grid-2-1fr gap-20'>
                                    <div className='d-flex-column gap-20'>
                                        <div className='page-product-prices'>
                                            <p className='page-product-normal-price'>Antes: S/.{producto.precioNormal}</p>
                                            <p className='page-product-sale-price'>Ahora: S/.{producto.precioVenta}</p>
                                        </div>

                                        <Regalos producto={producto} />

                                        <div className='d-flex gap-20'>
                                            <Resumen producto={producto} />
                                            <Medidas producto={producto} />
                                        </div>

                                        <div className='d-flex-column'>
                                            <div className='d-flex-start gap-5'>
                                                <span className='color-red'>*</span>
                                                <p className='text font-14'>Realizamos envios inmediatos a provincia</p>
                                            </div>
                                            <div className='d-flex-start gap-5'>
                                                <span className='color-red'>*</span>
                                                <p className='text font-14'>Entregas el mismo día para Lima y Callao</p>
                                            </div>
                                        </div>

                                        <Beneficios/>
                                    </div>

                                    <div className='d-flex-column gap-20'>
                                        <Envios producto={producto} onConfirm={(data) => {
                                            setShippingInfo(data); 
                                            setShippingOptions(data.shippingOptions);

                                            if (data.shippingOptions.length === 1) {
                                                setSelectedShipping({
                                                    tipo: data.shippingOptions[0].tipo,
                                                    precio: data.shippingOptions[0].precio
                                                });
                                            }
                                        }}/>

                                        <TiposDeEnvio 
                                            shippingOptions={shippingOptions} 
                                            provincia={shippingInfo?.locationData?.provincia || ''} 
                                            distrito={shippingInfo?.locationData?.distrito || ''} 
                                            hasAgency={shippingInfo?.hasAgency} 
                                            selectedTipo={selectedShipping.tipo} 
                                            onSelect={(tipo, precio) => setSelectedShipping({ tipo, precio })} 
                                        />

                                        <div className='product-page-user-name-container d-flex-column gap-5'>
                                            <p className='text'><b className='color-red'>*</b> Nombres</p>
                                            <input 
                                                type='text' 
                                                placeholder='Nombres' 
                                                className='product-page-user-name' 
                                                value={userName}
                                                onChange={(e) => {
                                                    setUserName(e.target.value);
                                                    localStorage.setItem('nombre', e.target.value);
                                                }} 
                                            />
                                        </div>

                                        <div className='d-flex-column gap-5'>
                                            <p className='title text'>Detalles:</p>

                                            {!selectedColor ? (
                                                <p className='d-flex gap-5'><b className='color-red'>*</b>Sin variación de color</p>
                                            ) : (
                                                <div className='d-flex gap-5'>
                                                    <p className='bold color-black d-flex gap-5'><b className='color-red'>*</b>Color seleccionado:</p>
                                                    <span>{selectedColor.color}</span>
                                                    <img 
                                                        src={selectedColor.img} 
                                                        alt={selectedColor.color} 
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className='d-flex-center-center gap-10'>
                                            <div className='d-flex-column gap-10'>
                                                <div className='quantity'>
                                                    <button 
                                                        type="button" 
                                                        onClick={handleRemove} 
                                                        disabled={quantity <= 1}
                                                    >
                                                        <span className="material-icons">remove</span>
                                                    </button>
                                                    <div className="quantity-input">{quantity}</div>
                                                    <button 
                                                        type="button" 
                                                        onClick={handleAdd} 
                                                        disabled={quantity >= 10}
                                                    >
                                                        <span className="material-icons">add</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <WhatsApp 
                                                producto={producto} 
                                                selectedShipping={selectedShipping} 
                                                shippingInfo={shippingInfo} 
                                                selectedColor={selectedColor} 
                                                quantity={quantity} 
                                                handleContinuarClick={handleContinuarClick}
                                            />
                                        </div>

                                        <div className='whatsapp-message d-flex d-flex-column gap-5'>
                                            <span className="material-icons">info</span>
                                            <p>La información solicitada se utilizará para agilizar el proceso de compra.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Descripcion producto={producto}/>
                    </section>
                </div>

                <Suspense fallback={<div className="loading-mas-productos">Cargando productos relacionados...</div>}>
                    <MasProductos categoriaActual={producto.categoria}/>
                </Suspense>
            </main>

            <Footer/>
        </>
    );
}

export default PaginaProducto;