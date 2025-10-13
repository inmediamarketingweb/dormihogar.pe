// import { useEffect, useState } from 'react';
// import { Helmet } from 'react-helmet';
// import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

// import '../Productos.css';
// import './Layout.css';

// import Categorias from '../Componentes/Categorias/Categorias';
// import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
// import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';

// const normalizarTexto = (texto) => {
//     return texto.toLowerCase().normalize("NFD").replace(/\s+/g, "-");
// };

// // Mapa de filtros para sofás
// const filtroKeyMap = {
//     "tipo": "tipo",
//     "marca": "marca", 
//     "línea": "línea",
//     "configuración": "configuración",
//     "posición": "posición",
//     "tamaño": "tamaño"
// };

// function Sofas() {
//     const { sub1, sub2, sub3, sub4, sub5, marca, configuracion, cuerpos, orientacion, tamaño, id } = useParams();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [productos, setProductos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filtros, setFiltros] = useState([]);
//     const [orden, setOrden] = useState("ultimo");

//     // Determinar el tipo de sofá y niveles basado en la ruta actual
//     const determinarEstructura = () => {
//         const path = location.pathname;
        
//         if (path.includes('/butacas/')) {
//             return { tipo: 'butacas', niveles: 2 };
//         } else if (path.includes('/juegos-de-sala/')) {
//             return { tipo: 'juegos-de-sala', niveles: 3 };
//         } else if (path.includes('/mecedoras/')) {
//             return { tipo: 'mecedoras', niveles: 2 };
//         } else if (path.includes('/reclinables/')) {
//             return { tipo: 'reclinables', niveles: 3 };
//         } else if (path.includes('/seccionales/')) {
//             return { tipo: 'seccionales', niveles: 3 };
//         } else if (path.includes('/sofa-cama/')) {
//             return { tipo: 'sofa-cama', niveles: 3 };
//         }
        
//         return { tipo: 'general', niveles: 0 };
//     };

//     // Redirigir a PaginaProducto si estamos en el último nivel
//     useEffect(() => {
//         const estructura = determinarEstructura();
//         const path = location.pathname;
        
//         // Si estamos en una ruta de producto (tiene ID), redirigir
//         if (id || (sub5 && !isNaN(sub5))) {
//             navigate(path, { replace: true });
//         }
//     }, [sub1, sub2, sub3, sub4, sub5, marca, id, navigate, location.pathname]);

//     // Cargar productos
//     useEffect(() => {
//         const estructura = determinarEstructura();
//         const path = location.pathname;
        
//         // No cargar si estamos en la página de producto
//         if (id || (sub5 && !isNaN(sub5))) {
//             return;
//         }

//         const cargarProductosSofas = async () => {
//             try {
//                 setLoading(true);
//                 const manifestResponse = await fetch('/assets/json/manifest.json');
//                 const manifestData = await manifestResponse.json();
//                 const archivos = manifestData.files || [];

//                 let archivosProductos = archivos.filter(url =>
//                     url.startsWith('/assets/json/categorias/sofas/')
//                 );

//                 // Construir la ruta específica basada en los parámetros
//                 let rutaBuscada = '';
                
//                 if (estructura.tipo !== 'general') {
//                     // Para rutas específicas de tipos de sofá
//                     switch(estructura.tipo) {
//                         case 'butacas':
//                             rutaBuscada = `/sofas/butacas/${marca || ''}`;
//                             break;
//                         case 'juegos-de-sala':
//                             rutaBuscada = `/sofas/juegos-de-sala/${configuracion || ''}/${marca || ''}`;
//                             break;
//                         case 'mecedoras':
//                             rutaBuscada = `/sofas/mecedoras/${marca || ''}`;
//                             break;
//                         case 'reclinables':
//                             rutaBuscada = `/sofas/reclinables/${cuerpos || ''}/${marca || ''}`;
//                             break;
//                         case 'seccionales':
//                             rutaBuscada = `/sofas/seccionales/${orientacion || ''}/${marca || ''}`;
//                             break;
//                         case 'sofa-cama':
//                             rutaBuscada = `/sofas/sofa-cama/${tamaño || ''}/${marca || ''}`;
//                             break;
//                         default:
//                             break;
//                     }
//                 } else {
//                     // Para rutas genéricas
//                     const params = [sub1, sub2, sub3, sub4].filter(Boolean);
//                     rutaBuscada = `/sofas/${params.join('/')}`;
//                 }

//                 // Limpiar la ruta
//                 rutaBuscada = rutaBuscada.replace(/\/+$/, '');

//                 // Filtrar archivos que coincidan con la ruta
//                 if (rutaBuscada && rutaBuscada !== '/sofas') {
//                     archivosProductos = archivosProductos.filter(url => {
//                         const urlSinExtension = url.replace('.json', '');
//                         return urlSinExtension.includes(rutaBuscada);
//                     });
//                 }

//                 console.log('Ruta buscada:', rutaBuscada);
//                 console.log('Archivos a cargar:', archivosProductos);

//                 const productosPromesas = archivosProductos.map(async (url) => {
//                     try {
//                         const response = await fetch(url);
//                         const data = await response.json();
//                         return data.productos || [];
//                     } catch (error) {
//                         console.error(`Error cargando ${url}:`, error);
//                         return [];
//                     }
//                 });

//                 const productosPorArchivo = await Promise.all(productosPromesas);
//                 const todosProductos = productosPorArchivo.flat();

//                 setProductos(todosProductos);
//             } catch (error) {
//                 console.error("Error cargando productos de sofás:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         cargarProductosSofas();
//     }, [sub1, sub2, sub3, sub4, sub5, marca, configuracion, cuerpos, orientacion, tamaño, id, location.pathname]);

//     // Cargar filtros
//     useEffect(() => {
//         const estructura = determinarEstructura();
//         const path = location.pathname;
        
//         // No cargar filtros si estamos en la página de producto
//         if (id || (sub5 && !isNaN(sub5))) {
//             return;
//         }

//         const cargarFiltros = async () => {
//             try {
//                 const response = await fetch('/assets/json/categorias/sofas/filtros.json');
//                 const data = await response.json();
//                 setFiltros(data.filtros || []);
//             } catch (error) {
//                 console.error("Error cargando filtros:", error);
//             }
//         };

//         cargarFiltros();
//     }, [sub1, sub2, sub3, sub4, sub5, marca, id, location.pathname]);

//     // Si estamos en página de producto, no renderizar
//     const estructura = determinarEstructura();
//     const path = location.pathname;
//     if (id || (sub5 && !isNaN(sub5))) {
//         return null;
//     }

//     // Crear queryParams directamente
//     const queryParams = new URLSearchParams(location.search);

//     // Filtrar productos
//     const productosFiltrados = productos.filter(producto => {
//         if (queryParams.entries().length === 0) return true;

//         for (let [paramUrl, valorFiltro] of queryParams.entries()) {
//             const claveJson = filtroKeyMap[paramUrl];
//             if (!claveJson) continue;

//             const normalizadoFiltro = normalizarTexto(valorFiltro);
//             const detalles = producto["detalles-del-producto"] || [];
            
//             const cumpleFiltro = detalles.some(detalle => {
//                 const valorProducto = detalle[claveJson];
//                 if (!valorProducto) return false;

//                 const normalizadoProducto = normalizarTexto(valorProducto.toString());
//                 return normalizadoProducto === normalizadoFiltro;
//             });

//             if (!cumpleFiltro) return false;
//         }
//         return true;
//     });

//     // Ordenar productos
//     const productosOrdenados = [...productosFiltrados].sort((a, b) => {
//         const precioA = a.precioVenta || 0;
//         const precioB = b.precioVenta || 0;

//         if (orden === "menor-mayor") return precioA - precioB;
//         if (orden === "mayor-menor") return precioB - precioA;
//         return 0;
//     });

//     // Función para toggle de filtros
//     const toggleFiltro = (nombreFiltro, valor) => {
//         const normalizadoValor = normalizarTexto(valor);
//         const newParams = new URLSearchParams(location.search);
        
//         const valorActual = newParams.get(nombreFiltro);

//         if (valorActual === normalizadoValor) {
//             newParams.delete(nombreFiltro);
//         } else {
//             newParams.set(nombreFiltro, normalizadoValor);
//         }

//         navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
//     };

//     // Verificar si un filtro está activo
//     const isFiltroActivo = (nombreFiltro, valor) => {
//         const normalizadoValor = normalizarTexto(valor);
//         return queryParams.get(nombreFiltro) === normalizadoValor;
//     };

//     // Limpiar todos los filtros
//     const limpiarFiltros = () => {
//         navigate(location.pathname, { replace: true });
//     };

//     return(
//         <>
//             <Helmet>
//                 <title>Sofás | Homesleep</title>
//             </Helmet>

//             <main className='products-page-main d-flex-column gap-20'>
//                 <Categorias/>

//                 <div className='products-page-blocks'>
//                     <div className='products-page-left'>
//                         <div className='products-page-filters-container-global'>
//                             <div className='d-flex-column gap-20'>
//                                 <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
//                                     <p className='block-title color-color-1 uppercase w-100 d-flex'>Homesleep</p>
//                                     <p className='uppercase w-100 d-flex'>Las mejores marcas en productos para el descanso</p>
//                                 </div>

//                                 <div className='products-page-filters-container d-flex-column gap-20'>
//                                     {filtros.map((filtro, index) => {
//                                         const nombreFiltro = Object.keys(filtro)[0];
//                                         const valoresFiltro = filtro[nombreFiltro];

//                                         if (nombreFiltro === "sofas"){
//                                             return(
//                                                 <div className='products-page-filter' key={index}>
//                                                     <p className='filter-title uppercase'>Sofás</p>
//                                                     <ul className='products-page-filter-list'>
//                                                         {valoresFiltro.map((item, i) => (
//                                                             <li key={i}>
//                                                                 <Link to={item.ruta} className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}>
//                                                                     <p>{item.sofas}</p>
//                                                                 </Link>
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             );
//                                         }

//                                         return(
//                                             <div className='products-page-filter' key={index}>
//                                                 <p className='filter-title uppercase'>{nombreFiltro}</p>
//                                                 <ul className='products-page-filter-list'>
//                                                     {valoresFiltro.map((valor, i) => (
//                                                         <li key={i}>
//                                                             <button 
//                                                                 type='button' 
//                                                                 className={isFiltroActivo(nombreFiltro, valor) ? "active" : ""} 
//                                                                 onClick={() => toggleFiltro(nombreFiltro, valor)}
//                                                             >
//                                                                 <p>{valor}</p>
//                                                             </button>
//                                                         </li>
//                                                     ))}
//                                                 </ul>
//                                             </div>
//                                         );
//                                     })}

//                                     {queryParams.toString() && (
//                                         <button 
//                                             type="button" 
//                                             className="button-link button-link-2" 
//                                             onClick={limpiarFiltros}
//                                         >
//                                             <span className="material-icons">delete</span>
//                                             <p className="button-link-text">Limpiar filtros</p>
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='products-page-right'>
//                         <FiltrosTop 
//                             setOrden={setOrden} 
//                             orden={orden} 
//                             productosCount={productosOrdenados.length}
//                             totalProductos={productos.length}
//                         />

//                         <div className='products-page-products-container'>
//                             {loading ? (
//                                 <div className="loading-products d-flex-center-center d-flex-column gap-10">
//                                     <div className="spinner"></div>
//                                     <p>Cargando productos...</p>
//                                 </div>
//                             ) : (
//                                 <ul className="products-page-products">
//                                     {productosOrdenados.length === 0 ? (
//                                         <div className="no-products">
//                                             <p>No se encontraron productos con los filtros seleccionados.</p>
//                                             {queryParams.toString() && (
//                                                 <button 
//                                                     type="button" 
//                                                     className="button-link" 
//                                                     onClick={limpiarFiltros}
//                                                 >
//                                                     Limpiar filtros
//                                                 </button>
//                                             )}
//                                         </div>
//                                     ) : (
//                                         productosOrdenados.map(producto => (
//                                             <Producto 
//                                                 key={producto.sku} 
//                                                 producto={producto} 
//                                                 truncate={(str, maxLength) => str?.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str}
//                                             />
//                                         ))
//                                     )}
//                                 </ul>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default Sofas;

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

// Mapa de filtros para sofás
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

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    const toggleEnvioGratis = () => {
        setEnvioGratisActivo(!envioGratisActivo);
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

    // Determinar el tipo de sofá y niveles basado en la ruta actual
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

    // Redirigir a PaginaProducto si estamos en el último nivel
    useEffect(() => {
        const estructura = determinarEstructura();
        const path = location.pathname;
        
        // Si estamos en una ruta de producto (tiene ID), redirigir
        if (id || (sub5 && !isNaN(sub5))) {
            navigate(path, { replace: true });
        }
    }, [sub1, sub2, sub3, sub4, sub5, marca, id, navigate, location.pathname]);

    // Cargar productos
    useEffect(() => {
        const estructura = determinarEstructura();
        const path = location.pathname;
        
        // No cargar si estamos en la página de producto
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

                // Construir la ruta específica basada en los parámetros
                let rutaBuscada = '';
                
                if (estructura.tipo !== 'general') {
                    // Para rutas específicas de tipos de sofá
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
                    // Para rutas genéricas
                    const params = [sub1, sub2, sub3, sub4].filter(Boolean);
                    rutaBuscada = `/sofas/${params.join('/')}`;
                }

                // Limpiar la ruta
                rutaBuscada = rutaBuscada.replace(/\/+$/, '');

                // Filtrar archivos que coincidan con la ruta
                if (rutaBuscada && rutaBuscada !== '/sofas') {
                    archivosProductos = archivosProductos.filter(url => {
                        const urlSinExtension = url.replace('.json', '');
                        return urlSinExtension.includes(rutaBuscada);
                    });
                }

                console.log('Ruta buscada:', rutaBuscada);
                console.log('Archivos a cargar:', archivosProductos);

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
            } catch (error) {
                console.error("Error cargando productos de sofás:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarProductosSofas();
    }, [sub1, sub2, sub3, sub4, sub5, marca, configuracion, cuerpos, orientacion, tamaño, id, location.pathname]);

    // Cargar filtros
    useEffect(() => {
        const estructura = determinarEstructura();
        const path = location.pathname;
        
        // No cargar filtros si estamos en la página de producto
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

    // Función para toggle de filtros
    const toggleFiltro = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor);
        const newParams = new URLSearchParams(location.search);
        
        const valorActual = newParams.get(nombreFiltro);

        if (valorActual === normalizadoValor) {
            newParams.delete(nombreFiltro);
        } else {
            newParams.set(nombreFiltro, normalizadoValor);
        }

        navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
    };

    // Verificar si un filtro está activo
    const isFiltroActivo = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor);
        return queryParams.get(nombreFiltro) === normalizadoValor;
    };

    // Limpiar todos los filtros
    const limpiarFiltros = () => {
        navigate(location.pathname, { replace: true });
    };

    // Si estamos en página de producto, no renderizar
    const estructura = determinarEstructura();
    const path = location.pathname;
    if (id || (sub5 && !isNaN(sub5))) {
        return null;
    }

    return(
        <>
            <Helmet>
                <title>Sofás | Homesleep</title>
            </Helmet>

            <main className='products-page-main d-flex-column gap-20'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20'>
                                <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
                                    <p className='block-title color-color-1 uppercase w-100 d-flex'>Homesleep</p>
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
                        />

                        <div className='products-page-products-container'>
                            {loading ? (
                                <div className="loading-products d-flex-center-center d-flex-column gap-10">
                                    <div className="spinner"></div>
                                    <p>Cargando productos...</p>
                                </div>
                            ) : (
                                <ul className="products-page-products">
                                    {productosOrdenados.length === 0 ? (
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
                                        productosOrdenados.map(producto => (
                                            <Producto 
                                                key={producto.sku} 
                                                producto={producto} 
                                                truncate={(str, maxLength) => str?.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str}
                                            />
                                        ))
                                    )}
                                </ul>
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
