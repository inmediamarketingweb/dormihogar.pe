// // // // import { useEffect, useState } from 'react';
// // // // import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';
// // // // import SpinnerLoading from '../../../../Componentes/SpinnerLoading/SpinnerLoading';
// // // // import './DormParaiso.css';

// // // // const truncate = (str, maxLength) => {
// // // //     if (!str) return '';
// // // //     return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
// // // // };

// // // // function DormParaiso() {
// // // //     const [productos, setProductos] = useState([]);
// // // //     const [cargando, setCargando] = useState(true);
// // // //     const [favorites, setFavorites] = useState({});
// // // //     const [currentPage, setCurrentPage] = useState(0);

// // // //     const skusParaRenderizar = [
// // // //         'D32243266N24',
// // // //         'D32243266N21',
// // // //         'D32222266N11',
// // // //         'D322152266N14',
// // // //         'D32243266N27',
// // // //         'D32243266N26',
// // // //         'D32243266N35',
// // // //         'D32242196N36',
// // // //         'D32242283N15',
// // // //         'D32242283N23'
// // // //     ];
    
// // // //     const cargarProductosPorSKUs = async (skus) => {
// // // //         if (!skus || skus.length === 0) return [];
        
// // // //         try {
// // // //             const responseManifest = await fetch('/assets/json/manifest.json');
// // // //             const manifest = await responseManifest.json();
            
// // // //             const todosLosProductos = await Promise.all(
// // // //                 manifest.files.map(async (fileUrl) => {
// // // //                     try {
// // // //                         const response = await fetch(fileUrl);
// // // //                         const data = await response.json();
// // // //                         return data.productos || (Array.isArray(data) ? data : []);
// // // //                     } catch (error) {
// // // //                         return [];
// // // //                     }
// // // //                 })
// // // //             );
            
// // // //             const todosLosProductosFlat = todosLosProductos.flat();
            
// // // //             const productosEncontrados = skus.map(sku => 
// // // //                 todosLosProductosFlat.find(p => p.sku === sku)
// // // //             ).filter(Boolean);
            
// // // //             return productosEncontrados;
// // // //         } catch (error) {
// // // //             console.error("Error cargando productos:", error);
// // // //             return [];
// // // //         }
// // // //     };

// // // //     useEffect(() => {
// // // //         const favStorage = JSON.parse(localStorage.getItem("favoritos")) || {};
// // // //         setFavorites(favStorage);
// // // //     }, []);

// // // //     const handleToggleFavorite = (producto) => {
// // // //         setFavorites(prev => {
// // // //             const newFavorites = {
// // // //                 ...prev,
// // // //                 [producto.sku]: !prev[producto.sku]
// // // //             };
// // // //             localStorage.setItem("favoritos", JSON.stringify(newFavorites));
// // // //             return newFavorites;
// // // //         });
// // // //     };

// // // //     useEffect(() => {
// // // //         const cargarProductos = async () => {
// // // //             setCargando(true);
            
// // // //             try {
// // // //                 const productosCargados = await cargarProductosPorSKUs(skusParaRenderizar);
// // // //                 setProductos(productosCargados);
// // // //             } catch (error) {
// // // //                 console.error("Error cargando productos Paraiso:", error);
// // // //                 setProductos([]);
// // // //             } finally {
// // // //                 setCargando(false);
// // // //             }
// // // //         };
        
// // // //         cargarProductos();
// // // //     }, []);

// // // //     const handleDotClick = (index) => {
// // // //         setCurrentPage(index);
// // // //     };

// // // //     const productsPerPage = 5;
// // // //     const totalPages = Math.ceil(productos.length / productsPerPage);
// // // //     const startIndex = currentPage * productsPerPage;
// // // //     const endIndex = Math.min(startIndex + productsPerPage, productos.length);
// // // //     const productosPagina = productos.slice(startIndex, endIndex);

// // // //     useEffect(() => {
// // // //         if (productosPagina.length === 0 && currentPage > 0) {
// // // //             setCurrentPage(0);
// // // //         }
// // // //     }, [productos, currentPage, productosPagina.length]);

// // // //     return (
// // // //         <div className='block-container'>
// // // //             <section className='block-content'>
// // // //                 <div className='block-title-container paraiso'>
// // // //                     <img src='https://paraisoperu.vtexassets.com/arquivos/Symbols.png' width={180} alt=''/>
// // // //                     <span className='block-title-span'>
// // // //                         Todos los productos de la marca <a className='font-bold color-color-1' href='/' title='Paraiso'>PARAISO</a> a los mejores precios
// // // //                     </span>
// // // //                 </div>

// // // //                 <div className='hp-paraiso-products-container'>
// // // //                     <div className='hp-paraiso-products-content'>
// // // //                         {cargando ? (
// // // //                             <SpinnerLoading />
// // // //                         ) : productos.length === 0 ? (
// // // //                             <div className="no-products">No hay productos disponibles</div>
// // // //                         ) : (
// // // //                             <ul>
// // // //                                 {productosPagina.map((producto, index) => (
// // // //                                     <Producto 
// // // //                                         key={producto.sku || index}
// // // //                                         producto={producto}
// // // //                                         truncate={truncate}
// // // //                                         onToggleFavorite={handleToggleFavorite}
// // // //                                         isFavorite={!!favorites[producto.sku]}
// // // //                                     />
// // // //                                 ))}
// // // //                             </ul>
// // // //                         )}
// // // //                     </div>

// // // //                     {totalPages > 1 && (
// // // //                         <div className='hp-paraiso-productos-dots'>
// // // //                             {Array.from({ length: totalPages }).map((_, index) => (
// // // //                                 <span 
// // // //                                     key={index}
// // // //                                     className={currentPage === index ? 'active' : ''}
// // // //                                     onClick={() => handleDotClick(index)}
// // // //                                 />
// // // //                             ))}
// // // //                         </div>
// // // //                     )}
// // // //                 </div>
// // // //             </section>
// // // //         </div>
// // // //     );
// // // // }

// // // // export default DormParaiso;

// // // import { useEffect, useState } from 'react';
// // // import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';

// // // import './DormParaiso.css';

// // // const truncate = (str, maxLength) => {
// // //     if (!str) return '';
// // //     return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
// // // };

// // // function DormParaiso() {
// // //     const [productos, setProductos] = useState([]);
// // //     const [cargando, setCargando] = useState(true);
// // //     const [favorites, setFavorites] = useState({});
// // //     const [currentPage, setCurrentPage] = useState(0);

// // //     const skusParaRenderizar = [
// // //         'D32243266N24',
// // //         'D32243266N21',
// // //         'D32222266N11',
// // //         'D322152266N14',
// // //         'D32243266N27',
// // //         'D32243266N26',
// // //         'D32243266N35',
// // //         'D32242196N36',
// // //         'D32242283N15',
// // //         'D32242283N23'
// // //     ];
    
// // //     const cargarProductosPorSKUs = async (skus) => {
// // //         if (!skus || skus.length === 0) return [];
        
// // //         try {
// // //             const responseManifest = await fetch('/assets/json/manifest.json');
// // //             const manifest = await responseManifest.json();
            
// // //             const todosLosProductos = await Promise.all(
// // //                 manifest.files.map(async (fileUrl) => {
// // //                     try {
// // //                         const response = await fetch(fileUrl);
// // //                         const data = await response.json();
// // //                         return data.productos || (Array.isArray(data) ? data : []);
// // //                     } catch (error) {
// // //                         return [];
// // //                     }
// // //                 })
// // //             );
            
// // //             const todosLosProductosFlat = todosLosProductos.flat();
            
// // //             const productosEncontrados = skus.map(sku => 
// // //                 todosLosProductosFlat.find(p => p.sku === sku)
// // //             ).filter(Boolean);
            
// // //             return productosEncontrados;
// // //         } catch (error) {
// // //             console.error("Error cargando productos:", error);
// // //             return [];
// // //         }
// // //     };

// // //     useEffect(() => {
// // //         const favStorage = JSON.parse(localStorage.getItem("favoritos")) || {};
// // //         setFavorites(favStorage);
// // //     }, []);

// // //     const handleToggleFavorite = (producto) => {
// // //         setFavorites(prev => {
// // //             const newFavorites = {
// // //                 ...prev,
// // //                 [producto.sku]: !prev[producto.sku]
// // //             };
// // //             localStorage.setItem("favoritos", JSON.stringify(newFavorites));
// // //             return newFavorites;
// // //         });
// // //     };

// // //     useEffect(() => {
// // //         const cargarProductos = async () => {
// // //             setCargando(true);
            
// // //             try {
// // //                 const productosCargados = await cargarProductosPorSKUs(skusParaRenderizar);
// // //                 setProductos(productosCargados);
// // //             } catch (error) {
// // //                 console.error("Error cargando productos Paraiso:", error);
// // //                 setProductos([]);
// // //             } finally {
// // //                 setCargando(false);
// // //             }
// // //         };
        
// // //         cargarProductos();
// // //     }, []);

// // //     const handleDotClick = (index) => {
// // //         setCurrentPage(index);
// // //     };

// // //     const productsPerPage = 5;
// // //     const totalPages = Math.ceil(productos.length / productsPerPage);
// // //     const startIndex = currentPage * productsPerPage;
// // //     const endIndex = Math.min(startIndex + productsPerPage, productos.length);
// // //     const productosPagina = productos.slice(startIndex, endIndex);

// // //     useEffect(() => {
// // //         if (productosPagina.length === 0 && currentPage > 0) {
// // //             setCurrentPage(0);
// // //         }
// // //     }, [productos, currentPage, productosPagina.length]);

// // //     return (
// // //         <div className='block-container'>
// // //             <section className='block-content'>
// // //                 <div className='block-title-container paraiso'>
// // //                     <img src='https://paraisoperu.vtexassets.com/arquivos/Symbols.png' width={180} alt=''/>
// // //                     <span className='block-title-span'>
// // //                         Todos los productos de la marca <a className='font-bold color-color-1' href='/' title='Paraiso'>PARAISO</a> a los mejores precios
// // //                     </span>
// // //                 </div>

// // //                 <div className='hp-paraiso-products-container'>
// // //                     <div className='hp-paraiso-products-content'>
// // //                         {productos.length === 0 ? (
// // //                             <div className="d-flex-center-center w-100">No hay productos disponibles</div>
// // //                         ) : (
// // //                             <ul>
// // //                                 {productosPagina.map((producto, index) => (
// // //                                     <Producto 
// // //                                         key={producto.sku || index}
// // //                                         producto={producto}
// // //                                         truncate={truncate}
// // //                                         onToggleFavorite={handleToggleFavorite}
// // //                                         isFavorite={!!favorites[producto.sku]}
// // //                                     />
// // //                                 ))}
// // //                             </ul>
// // //                         )}
// // //                     </div>

// // //                     {totalPages > 1 && (
// // //                         <div className='hp-paraiso-productos-dots'>
// // //                             {Array.from({ length: totalPages }).map((_, index) => (
// // //                                 <span 
// // //                                     key={index}
// // //                                     className={currentPage === index ? 'active' : ''}
// // //                                     onClick={() => handleDotClick(index)}
// // //                                 />
// // //                             ))}
// // //                         </div>
// // //                     )}

// // //                     <button type='button' className='dorm-paraiso-button dorm-paraiso-button-left'>
// // //                         <span class="material-symbols-outlined">chevron_left</span>
// // //                     </button>

// // //                     <button type='button' className='dorm-paraiso-button dorm-paraiso-button-right'>
// // //                         <span class="material-symbols-outlined">chevron_right</span>
// // //                     </button>
// // //                 </div>
// // //             </section>
// // //         </div>
// // //     );
// // // }

// // // export default DormParaiso;

// // import { useEffect, useState } from 'react';
// // import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';
// // import './DormParaiso.css';

// // const truncate = (str, maxLength) => {
// //     if (!str) return '';
// //     return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
// // };

// // function DormParaiso() {
// //     const [productos, setProductos] = useState([]);
// //     const [cargando, setCargando] = useState(true);
// //     const [favorites, setFavorites] = useState({});
// //     const [currentPage, setCurrentPage] = useState(0);

// //     const skusParaRenderizar = [
// //         'D32243266N24',
// //         'D32243266N21',
// //         'D32222266N11',
// //         'D322152266N14',
// //         'D32243266N27',
// //         'D32243266N26',
// //         'D32243266N35',
// //         'D32242196N36',
// //         'D32242283N15',
// //         'D32242283N23'
// //     ];
    
// //     const cargarProductosPorSKUs = async (skus) => {
// //         if (!skus || skus.length === 0) return [];
        
// //         try {
// //             const responseManifest = await fetch('/assets/json/manifest.json');
// //             const manifest = await responseManifest.json();
            
// //             const todosLosProductos = await Promise.all(
// //                 manifest.files.map(async (fileUrl) => {
// //                     try {
// //                         const response = await fetch(fileUrl);
// //                         const data = await response.json();
// //                         return data.productos || (Array.isArray(data) ? data : []);
// //                     } catch (error) {
// //                         return [];
// //                     }
// //                 })
// //             );
            
// //             const todosLosProductosFlat = todosLosProductos.flat();
            
// //             const productosEncontrados = skus.map(sku => 
// //                 todosLosProductosFlat.find(p => p.sku === sku)
// //             ).filter(Boolean);
            
// //             return productosEncontrados;
// //         } catch (error) {
// //             console.error("Error cargando productos:", error);
// //             return [];
// //         }
// //     };

// //     useEffect(() => {
// //         const favStorage = JSON.parse(localStorage.getItem("favoritos")) || {};
// //         setFavorites(favStorage);
// //     }, []);

// //     const handleToggleFavorite = (producto) => {
// //         setFavorites(prev => {
// //             const newFavorites = {
// //                 ...prev,
// //                 [producto.sku]: !prev[producto.sku]
// //             };
// //             localStorage.setItem("favoritos", JSON.stringify(newFavorites));
// //             return newFavorites;
// //         });
// //     };

// //     useEffect(() => {
// //         const cargarProductos = async () => {
// //             setCargando(true);
            
// //             try {
// //                 const productosCargados = await cargarProductosPorSKUs(skusParaRenderizar);
// //                 setProductos(productosCargados);
// //             } catch (error) {
// //                 console.error("Error cargando productos Paraiso:", error);
// //                 setProductos([]);
// //             } finally {
// //                 setCargando(false);
// //             }
// //         };
        
// //         cargarProductos();
// //     }, []);

// //     const handleDotClick = (index) => {
// //         setCurrentPage(index);
// //     };

// //     // Función para el botón izquierdo (anterior)
// //     const handleLeftClick = () => {
// //         setCurrentPage(prev => {
// //             const newPage = prev - 1;
// //             return newPage < 0 ? totalPages - 1 : newPage; // Si está en la primera página, va a la última
// //         });
// //     };

// //     // Función para el botón derecho (siguiente)
// //     const handleRightClick = () => {
// //         setCurrentPage(prev => {
// //             const newPage = prev + 1;
// //             return newPage >= totalPages ? 0 : newPage; // Si está en la última página, va a la primera
// //         });
// //     };

// //     const productsPerPage = 5;
// //     const totalPages = Math.ceil(productos.length / productsPerPage);
// //     const startIndex = currentPage * productsPerPage;
// //     const endIndex = Math.min(startIndex + productsPerPage, productos.length);
// //     const productosPagina = productos.slice(startIndex, endIndex);

// //     useEffect(() => {
// //         if (productosPagina.length === 0 && currentPage > 0) {
// //             setCurrentPage(0);
// //         }
// //     }, [productos, currentPage, productosPagina.length]);

// //     return (
// //         <div className='block-container'>
// //             <section className='block-content'>
// //                 <div className='block-title-container paraiso'>
// //                     <img src='https://paraisoperu.vtexassets.com/arquivos/Symbols.png' width={180} alt=''/>
// //                     <span className='block-title-span'>
// //                         Todos los productos de la marca <a className='font-bold color-color-1' href='/' title='Paraiso'>PARAISO</a> a los mejores precios
// //                     </span>
// //                 </div>

// //                 <div className='hp-paraiso-products-container'>
// //                     <div className='hp-paraiso-products-content'>
// //                         {productos.length === 0 ? (
// //                             <div className="d-flex-center-center w-100">No hay productos disponibles</div>
// //                         ) : (
// //                             <ul>
// //                                 {productosPagina.map((producto, index) => (
// //                                     <Producto 
// //                                         key={producto.sku || index}
// //                                         producto={producto}
// //                                         truncate={truncate}
// //                                         onToggleFavorite={handleToggleFavorite}
// //                                         isFavorite={!!favorites[producto.sku]}
// //                                     />
// //                                 ))}
// //                             </ul>
// //                         )}
// //                     </div>

// //                     {totalPages > 1 && (
// //                         <div className='hp-paraiso-productos-dots'>
// //                             {Array.from({ length: totalPages }).map((_, index) => (
// //                                 <span 
// //                                     key={index}
// //                                     className={currentPage === index ? 'active' : ''}
// //                                     onClick={() => handleDotClick(index)}
// //                                 />
// //                             ))}
// //                         </div>
// //                     )}

// //                     <button 
// //                         type='button' 
// //                         className='dorm-paraiso-button dorm-paraiso-button-left'
// //                         onClick={handleLeftClick}
// //                         disabled={totalPages <= 1}
// //                     >
// //                         <span className="material-symbols-outlined">chevron_left</span>
// //                     </button>

// //                     <button 
// //                         type='button' 
// //                         className='dorm-paraiso-button dorm-paraiso-button-right'
// //                         onClick={handleRightClick}
// //                         disabled={totalPages <= 1}
// //                     >
// //                         <span className="material-symbols-outlined">chevron_right</span>
// //                     </button>
// //                 </div>
// //             </section>
// //         </div>
// //     );
// // }

// // export default DormParaiso;

// import { useEffect, useState, useRef } from 'react';
// import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';
// import './DormParaiso.css';

// const truncate = (str, maxLength) => {
//     if (!str) return '';
//     return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
// };

// function DormParaiso() {
//     const [productos, setProductos] = useState([]);
//     const [cargando, setCargando] = useState(true);
//     const [favorites, setFavorites] = useState({});
//     const [currentPage, setCurrentPage] = useState(0);
//     const contentRef = useRef(null);

//     const skusParaRenderizar = [
//         'D32243266N24',
//         'D32243266N21',
//         'D32222266N11',
//         'D322152266N14',
//         'D32243266N27',
//         'D32243266N26',
//         'D32243266N35',
//         'D32242196N36',
//         'D32242283N15',
//         'D32242283N23'
//     ];
    
//     const cargarProductosPorSKUs = async (skus) => {
//         if (!skus || skus.length === 0) return [];
        
//         try {
//             const responseManifest = await fetch('/assets/json/manifest.json');
//             const manifest = await responseManifest.json();
            
//             const todosLosProductos = await Promise.all(
//                 manifest.files.map(async (fileUrl) => {
//                     try {
//                         const response = await fetch(fileUrl);
//                         const data = await response.json();
//                         return data.productos || (Array.isArray(data) ? data : []);
//                     } catch (error) {
//                         return [];
//                     }
//                 })
//             );
            
//             const todosLosProductosFlat = todosLosProductos.flat();
            
//             const productosEncontrados = skus.map(sku => 
//                 todosLosProductosFlat.find(p => p.sku === sku)
//             ).filter(Boolean);
            
//             return productosEncontrados;
//         } catch (error) {
//             console.error("Error cargando productos:", error);
//             return [];
//         }
//     };

//     useEffect(() => {
//         const favStorage = JSON.parse(localStorage.getItem("favoritos")) || {};
//         setFavorites(favStorage);
//     }, []);

//     const handleToggleFavorite = (producto) => {
//         setFavorites(prev => {
//             const newFavorites = {
//                 ...prev,
//                 [producto.sku]: !prev[producto.sku]
//             };
//             localStorage.setItem("favoritos", JSON.stringify(newFavorites));
//             return newFavorites;
//         });
//     };

//     useEffect(() => {
//         const cargarProductos = async () => {
//             setCargando(true);
            
//             try {
//                 const productosCargados = await cargarProductosPorSKUs(skusParaRenderizar);
//                 setProductos(productosCargados);
//             } catch (error) {
//                 console.error("Error cargando productos Paraiso:", error);
//                 setProductos([]);
//             } finally {
//                 setCargando(false);
//             }
//         };
        
//         cargarProductos();
//     }, []);

//     const handleDotClick = (index) => {
//         setCurrentPage(index);
//         scrollToPage(index);
//     };

//     const handleLeftClick = () => {
//         const newPage = currentPage - 1;
//         if (newPage >= 0) {
//             setCurrentPage(newPage);
//             scrollToPage(newPage);
//         }
//     };

//     const handleRightClick = () => {
//         const newPage = currentPage + 1;
//         if (newPage < totalPages) {
//             setCurrentPage(newPage);
//             scrollToPage(newPage);
//         }
//     };

//     const scrollToPage = (pageIndex) => {
//         if (contentRef.current) {
//             const container = contentRef.current;
//             const itemWidth = container.querySelector('ul li')?.offsetWidth || 0;
//             const gap = 10; // El gap del grid
//             const scrollAmount = (itemWidth + gap) * productsPerPage * pageIndex;
            
//             container.scrollTo({
//                 left: scrollAmount,
//                 behavior: 'smooth'
//             });
//         }
//     };

//     const productsPerPage = 5;
//     const totalPages = Math.ceil(productos.length / productsPerPage);
//     const startIndex = currentPage * productsPerPage;
//     const endIndex = Math.min(startIndex + productsPerPage, productos.length);
//     const productosPagina = productos.slice(startIndex, endIndex);

//     useEffect(() => {
//         if (productosPagina.length === 0 && currentPage > 0) {
//             setCurrentPage(0);
//         }
//     }, [productos, currentPage, productosPagina.length]);

//     // Detectar scroll manual para actualizar dots
//     useEffect(() => {
//         const container = contentRef.current;
//         if (!container) return;

//         const handleScroll = () => {
//             const scrollLeft = container.scrollLeft;
//             const itemWidth = container.querySelector('ul li')?.offsetWidth || 0;
//             const gap = 10;
//             const pageWidth = (itemWidth + gap) * productsPerPage;
//             const currentScrollPage = Math.round(scrollLeft / pageWidth);
            
//             if (currentScrollPage !== currentPage && currentScrollPage < totalPages) {
//                 setCurrentPage(currentScrollPage);
//             }
//         };

//         container.addEventListener('scroll', handleScroll);
//         return () => container.removeEventListener('scroll', handleScroll);
//     }, [currentPage, totalPages]);

//     return (
//         <div className='block-container'>
//             <section className='block-content'>
//                 <div className='block-title-container paraiso'>
//                     <img src='https://paraisoperu.vtexassets.com/arquivos/Symbols.png' width={180} alt=''/>
//                     <span className='block-title-span'>
//                         Todos los productos de la marca <a className='font-bold color-color-1' href='/' title='Paraiso'>PARAISO</a> a los mejores precios
//                     </span>
//                 </div>

//                 <div className='hp-paraiso-products-container'>
//                     <div 
//                         className='hp-paraiso-products-content' 
//                         ref={contentRef}
//                     >
//                         {productos.length === 0 ? (
//                             <div className="d-flex-center-center w-100">No hay productos disponibles</div>
//                         ) : (
//                             <ul>
//                                 {productos.map((producto, index) => (
//                                     <Producto 
//                                         key={producto.sku || index}
//                                         producto={producto}
//                                         truncate={truncate}
//                                         onToggleFavorite={handleToggleFavorite}
//                                         isFavorite={!!favorites[producto.sku]}
//                                     />
//                                 ))}
//                             </ul>
//                         )}
//                     </div>

//                     {totalPages > 1 && (
//                         <div className='hp-paraiso-productos-dots'>
//                             {Array.from({ length: totalPages }).map((_, index) => (
//                                 <span 
//                                     key={index}
//                                     className={currentPage === index ? 'active' : ''}
//                                     onClick={() => handleDotClick(index)}
//                                 />
//                             ))}
//                         </div>
//                     )}

//                     <button 
//                         type='button' 
//                         className='dorm-paraiso-button dorm-paraiso-button-left'
//                         onClick={handleLeftClick}
//                         disabled={currentPage === 0}
//                     >
//                         <span className="material-symbols-outlined">chevron_left</span>
//                     </button>

//                     <button 
//                         type='button' 
//                         className='dorm-paraiso-button dorm-paraiso-button-right'
//                         onClick={handleRightClick}
//                         disabled={currentPage === totalPages - 1}
//                     >
//                         <span className="material-symbols-outlined">chevron_right</span>
//                     </button>
//                 </div>
//             </section>
//         </div>
//     );
// }

// export default DormParaiso;

import { useEffect, useState, useRef } from 'react';
import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';
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
    const contentRef = useRef(null);
    const [itemsPerPage, setItemsPerPage] = useState(5);

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

    // Detectar cuántos items caben por página según el ancho
    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width < 480) {
                setItemsPerPage(1);
            } else if (width < 768) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(5);
            }
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const totalPages = Math.ceil(productos.length / itemsPerPage);

    const handleDotClick = (index) => {
        setCurrentPage(index);
        scrollToPage(index);
    };

    const handleLeftClick = () => {
        if (currentPage > 0) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            scrollToPage(newPage);
        }
    };

    const handleRightClick = () => {
        if (currentPage < totalPages - 1) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            scrollToPage(newPage);
        }
    };

    const scrollToPage = (pageIndex) => {
        if (contentRef.current) {
            const container = contentRef.current;
            const ul = container.querySelector('ul');
            if (ul) {
                const li = ul.querySelector('li');
                if (li) {
                    const itemWidth = li.offsetWidth;
                    const gap = 10;
                    const scrollAmount = (itemWidth + gap) * itemsPerPage * pageIndex;
                    
                    container.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            }
        }
    };

    // Detectar scroll manual para actualizar dots
    useEffect(() => {
        const container = contentRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const ul = container.querySelector('ul');
            if (!ul) return;
            
            const li = ul.querySelector('li');
            if (!li) return;
            
            const itemWidth = li.offsetWidth;
            const gap = 10;
            const pageWidth = (itemWidth + gap) * itemsPerPage;
            const currentScrollPage = Math.round(scrollLeft / pageWidth);
            
            if (currentScrollPage !== currentPage && currentScrollPage < totalPages) {
                setCurrentPage(currentScrollPage);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [currentPage, totalPages, itemsPerPage]);

    // Resetear página si es necesario
    useEffect(() => {
        if (currentPage >= totalPages) {
            setCurrentPage(0);
        }
    }, [totalPages, currentPage]);

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
                    <div 
                        className='hp-paraiso-products-content' 
                        ref={contentRef}
                    >
                        {productos.length === 0 ? (
                            <div className="d-flex-center-center w-100">No hay productos disponibles</div>
                        ) : (
                            <ul>
                                {productos.map((producto, index) => (
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

                    <button 
                        type='button' 
                        className='dorm-paraiso-button dorm-paraiso-button-left'
                        onClick={handleLeftClick}
                        disabled={currentPage === 0 || totalPages <= 1}
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    <button 
                        type='button' 
                        className='dorm-paraiso-button dorm-paraiso-button-right'
                        onClick={handleRightClick}
                        disabled={currentPage === totalPages - 1 || totalPages <= 1}
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </section>
        </div>
    );
}

export default DormParaiso;
