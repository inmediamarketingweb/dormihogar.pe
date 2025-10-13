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

// const filtroKeyMap = {
//     "tamaño": "tamaño",
//     "marca": "marca", 
//     "tipo-de-cabecera": "tipo-de-cabecera",
//     "diseño-de-cabecera": "diseño-de-cabecera",
//     "brazos-de-cabecera": "brazos-de-cabecera"
// };

// function Cabeceras() {
//     const { sub1, sub2, sub3, sub4 } = useParams()
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [productos, setProductos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filtros, setFiltros] = useState([]);
//     const [orden, setOrden] = useState("ultimo");

//     useEffect(() => {
//         if (sub4) {
//             const rutaProducto = `/productos/cabeceras/${sub1}/${sub2}/${sub3}/${sub4}`;
//             navigate(rutaProducto, { replace: true });
//         }
//     }, [sub4, sub1, sub2, sub3, navigate]);

//     useEffect(() => {
//         if (sub4) return;

//         const cargarProductosCabeceras = async () => {
//             try {
//                 setLoading(true);
//                 const manifestResponse = await fetch('/assets/json/manifest.json');
//                 const manifestData = await manifestResponse.json();
//                 const archivos = manifestData.files || [];

//                 let archivosProductos = archivos.filter(url =>
//                     url.startsWith('/assets/json/categorias/cabeceras/')
//                 );

//                 if (sub1) {
//                     archivosProductos = archivosProductos.filter(
//                         url => url.includes(`/cabeceras/${sub1}/`)
//                     );
//                 }

//                 if (sub2) {
//                     archivosProductos = archivosProductos.filter(
//                         url => url.includes(`/cabeceras/${sub1}/${sub2}/`)
//                     );
//                 }

//                 if (sub3) {
//                     archivosProductos = archivosProductos.filter(
//                         url => url.includes(`/cabeceras/${sub1}/${sub2}/${sub3}.json`)
//                     );
//                 }

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
//                 console.error("Error cargando productos de cabeceras:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         cargarProductosCabeceras();
//     }, [sub1, sub2, sub3, sub4]);

//     useEffect(() => {
//         if (sub4) return;

//         const cargarFiltros = async () => {
//             try {
//                 const response = await fetch('/assets/json/categorias/cabeceras/filtros.json');
//                 const data = await response.json();
//                 setFiltros(data.filtros || []);
//             } catch (error) {
//                 console.error("Error cargando filtros:", error);
//             }
//         };

//         cargarFiltros();
//     }, [sub4]);

//     if (sub4) {
//         return null;
//     }

//     const queryParams = new URLSearchParams(location.search);

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

//     const productosOrdenados = [...productosFiltrados].sort((a, b) => {
//         const precioA = a.precioVenta || 0;
//         const precioB = b.precioVenta || 0;

//         if (orden === "menor-mayor") return precioA - precioB;
//         if (orden === "mayor-menor") return precioB - precioA;
//         return 0;
//     });

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

//     const isFiltroActivo = (nombreFiltro, valor) => {
//         const normalizadoValor = normalizarTexto(valor);
//         return queryParams.get(nombreFiltro) === normalizadoValor;
//     };

//     const limpiarFiltros = () => {
//         navigate(location.pathname, { replace: true });
//     };

//     return(
//         <>
//             <Helmet>
//                 <title>Cabeceras | Homesleep</title>
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

//                                         if (nombreFiltro === "tamaño") {
//                                             return(
//                                                 <div className='products-page-filter' key={index}>
//                                                     <p className='filter-title uppercase'>Tamaño</p>
//                                                     <ul className='products-page-filter-list'>
//                                                         {valoresFiltro.map((item, i) => (
//                                                             <li key={i}>
//                                                                 <Link 
//                                                                     to={item.ruta} 
//                                                                     className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}
//                                                                 >
//                                                                     <p>{item.tamaño}</p>
//                                                                 </Link>
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 </div>
//                                             );
//                                         }

//                                         if (nombreFiltro === "diseños" || nombreFiltro === "estilos" || nombreFiltro === "modelos") {
//                                             return(
//                                                 <div className='products-page-filter' key={index}>
//                                                     <p className='filter-title uppercase'>{nombreFiltro}</p>
//                                                     <div className='filter-subgroups'>
//                                                         {valoresFiltro.map((grupo, idx) => {
//                                                             const nombreGrupo = Object.keys(grupo)[0];
//                                                             const opciones = grupo[nombreGrupo];

//                                                             return(
//                                                                 <div key={idx} className='filter-subgroup'>
//                                                                     <p className='filter-subgroup-title'>{nombreGrupo}</p>
//                                                                     <ul className='products-page-filter-list'>
//                                                                         {opciones.map((opcion, mIdx) => (
//                                                                             <li key={mIdx}>
//                                                                                 <button 
//                                                                                     type='button' 
//                                                                                     className={isFiltroActivo(nombreFiltro, opcion) ? "active" : ""} 
//                                                                                     onClick={() => toggleFiltro(nombreFiltro, opcion)}
//                                                                                 >
//                                                                                     <p>{opcion}</p>
//                                                                                 </button>
//                                                                             </li>
//                                                                         ))}
//                                                                     </ul>
//                                                                 </div>
//                                                             );
//                                                         })}
//                                                     </div>
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
//                                             <div className='d-grid-1-1'>
//                                                 <div className="d-flex-column gap-10">
//                                                     <p className='text'>No se encontraron productos con los filtros seleccionados.</p>

//                                                     {queryParams.toString() && (
//                                                         <button type="button" className="margin-right button-link button-link-2" onClick={limpiarFiltros}>
//                                                             <span class="material-icons">delete</span>
//                                                             <p className='button-link-text'>Limpiar filtros</p>
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         productosOrdenados.map(producto => (
//                                             <Producto key={producto.sku} producto={producto} />
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

// export default Cabeceras;

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
    "tamaño": "tamaño",
    "marca": "marca", 
    "tipo-de-cabecera": "tipo-de-cabecera",
    "diseño-de-cabecera": "diseño-de-cabecera",
    "brazos-de-cabecera": "brazos-de-cabecera"
};

function Cabeceras() {
    const { sub1, sub2, sub3, sub4 } = useParams()
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

    useEffect(() => {
        if (sub4) {
            const rutaProducto = `/productos/cabeceras/${sub1}/${sub2}/${sub3}/${sub4}`;
            navigate(rutaProducto, { replace: true });
        }
    }, [sub4, sub1, sub2, sub3, navigate]);

    useEffect(() => {
        if (sub4) return;

        const cargarProductosCabeceras = async () => {
            try {
                setLoading(true);
                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/cabeceras/')
                );

                if (sub1) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/cabeceras/${sub1}/`)
                    );
                }

                if (sub2) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/cabeceras/${sub1}/${sub2}/`)
                    );
                }

                if (sub3) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/cabeceras/${sub1}/${sub2}/${sub3}.json`)
                    );
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
            } catch (error) {
                console.error("Error cargando productos de cabeceras:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarProductosCabeceras();
    }, [sub1, sub2, sub3, sub4]);

    useEffect(() => {
        if (sub4) return;

        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/cabeceras/filtros.json');
                const data = await response.json();
                setFiltros(data.filtros || []);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, [sub4]);

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

    const isFiltroActivo = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor);
        return queryParams.get(nombreFiltro) === normalizadoValor;
    };

    const limpiarFiltros = () => {
        navigate(location.pathname, { replace: true });
    };

    if (sub4) {
        return null;
    }

    return(
        <>
            <Helmet>
                <title>Cabeceras | Homesleep</title>
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

                                        if (nombreFiltro === "tamaño") {
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title uppercase'>Tamaño</p>
                                                    <ul className='products-page-filter-list'>
                                                        {valoresFiltro.map((item, i) => (
                                                            <li key={i}>
                                                                <Link 
                                                                    to={item.ruta} 
                                                                    className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}
                                                                >
                                                                    <p>{item.tamaño}</p>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        }

                                        if (nombreFiltro === "diseños" || nombreFiltro === "estilos" || nombreFiltro === "modelos") {
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title uppercase'>{nombreFiltro}</p>
                                                    <div className='filter-subgroups'>
                                                        {valoresFiltro.map((grupo, idx) => {
                                                            const nombreGrupo = Object.keys(grupo)[0];
                                                            const opciones = grupo[nombreGrupo];

                                                            return(
                                                                <div key={idx} className='filter-subgroup'>
                                                                    <p className='filter-subgroup-title'>{nombreGrupo}</p>
                                                                    <ul className='products-page-filter-list'>
                                                                        {opciones.map((opcion, mIdx) => (
                                                                            <li key={mIdx}>
                                                                                <button 
                                                                                    type='button' 
                                                                                    className={isFiltroActivo(nombreFiltro, opcion) ? "active" : ""} 
                                                                                    onClick={() => toggleFiltro(nombreFiltro, opcion)}
                                                                                >
                                                                                    <p>{opcion}</p>
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
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
                                            <Producto key={producto.sku} producto={producto} />
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

export default Cabeceras;
