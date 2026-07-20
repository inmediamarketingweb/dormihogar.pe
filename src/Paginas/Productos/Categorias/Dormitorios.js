// // import { useEffect, useState, useMemo, useRef } from 'react';
// // import { Helmet } from 'react-helmet';
// // import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

// // import '../Productos.css';
// // import './Layout.css';

// // import Categorias from '../Componentes/Categorias/Categorias';
// // import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
// // import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';

// // const normalizarTexto = (texto) => {
// //     return texto.toLowerCase().normalize("NFD").replace(/\s+/g, "-");
// // };

// // const filtroKeyMap = {
// //     "tamaño": "tamaño",
// //     "marca": "marca",
// //     "línea": "línea",
// //     "base-encajonada": "base-encajonada",
// //     "cajones": "cajones",
// //     "modelo": "modelo-de-colchón",
// //     "con-baúl": "con-baul",
// //     "con-piecera": "con-piecera",
// //     "tipo-de-cabecera": "tipo-de-cabecera",
// //     "diseño-de-cabecera": "diseño-de-cabecera",
// //     "brazos-de-cabecera": "brazos-de-cabecera"
// // };

// // const mapaMarcasModelos = {
// //     "el-cisne": "el-cisne",
// //     "kamas---el-cisne": "el-cisne",

// //     "kamas": "kamas",

// //     "paraiso": "paraiso",
// //     "kamas---paraiso": "paraiso",

// //     "komfort": "komfort",
// //     "kamas---komfort": "komfort",
// //     "komfort---kamas": "komfort"
// // };

// // const mapaEquivalenciasMarcas = {
// //     "el-cisne": ["el-cisne", "kamas---el-cisne"],
// //     "kamas---el-cisne": ["el-cisne", "kamas---el-cisne"],

// //     "kamas": ["kamas"],

// //     "paraiso": ["paraiso", "kamas---paraiso"],
// //     "kamas---paraiso": ["paraiso", "kamas---paraiso"],

// //     "komfort": ["komfort", "kamas---komfort", "komfort---kamas"],
// //     "kamas---komfort": ["komfort", "kamas---komfort", "komfort---kamas"],
// //     "komfort---kamas": ["komfort", "kamas---komfort", "komfort---kamas"]
// // };

// // const sonMarcasEquivalentes = (marca1, marca2) => {
// //     const normalizada1 = normalizarTexto(marca1);
// //     const normalizada2 = normalizarTexto(marca2);
// //     if (normalizada1 === normalizada2) return true;
// //     const equivalencias1 = mapaEquivalenciasMarcas[normalizada1];
// //     return equivalencias1 && equivalencias1.includes(normalizada2);
// // };

// // function Dormitorios() {
// //     const { sub1, sub2, sub3, sub4, sub5 } = useParams();
// //     const location = useLocation();
// //     const navigate = useNavigate();
// //     const [productos, setProductos] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [filtros, setFiltros] = useState([]);
// //     const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
// //     const [isFiltersOpen, setIsFiltersOpen] = useState(false);
// //     const filtersPanelRef = useRef(null);
// //     const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
// //     const [currentPage, setCurrentPage] = useState(1);
// //     const itemsPerPage = 48;

// //     const shuffleArray = (array) => {
// //         const shuffled = [...array];
// //         for (let i = shuffled.length - 1; i > 0; i--) {
// //             const j = Math.floor(Math.random() * (i + 1));
// //             [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
// //         }
// //         return shuffled;
// //     };

// //     const closeFilters = () => {
// //         setIsFiltersOpen(false);
// //     };

// //     const toggleEnvioGratis = () => {
// //         setEnvioGratisActivo(!envioGratisActivo);
// //         setCurrentPage(1);
// //     };

// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (filtersPanelRef.current && 
// //                 !filtersPanelRef.current.contains(event.target) &&
// //                 !event.target.closest('.filters-button-open')) {
// //                 setIsFiltersOpen(false);
// //             }
// //         };

// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);

// //     useEffect(() => {
// //         if (sub5) {
// //             const rutaProducto = `/productos/dormitorios/${sub1}/${sub2}/${sub3}/${sub4}/${sub5}`;
// //             navigate(rutaProducto, { replace: true });
// //         }
// //     }, [sub5, sub1, sub2, sub3, sub4, navigate]);

// //     useEffect(() => {
// //         if (sub5) return;

// //         const cargarProductosDormitorios = async () => {
// //             try {
// //                 setLoading(true);
// //                 const manifestResponse = await fetch('/assets/json/manifest.json');
// //                 const manifestData = await manifestResponse.json();
// //                 const archivos = manifestData.files || [];

// //                 let archivosProductos = archivos.filter(url =>
// //                     url.startsWith('/assets/json/categorias/dormitorios/')
// //                 );

// //                 if (sub1) {
// //                     archivosProductos = archivosProductos.filter(
// //                         url => url.includes(`/dormitorios/${sub1}/`)
// //                     );
// //                 }

// //                 if (sub2) {
// //                     archivosProductos = archivosProductos.filter(
// //                         url => url.includes(`/dormitorios/${sub1}/${sub2}/`)
// //                     );
// //                 }

// //                 if (sub3) {
// //                     archivosProductos = archivosProductos.filter(
// //                         url => url.includes(`/dormitorios/${sub1}/${sub2}/${sub3}/`)
// //                     );
// //                 }

// //                 if (sub4) {
// //                     archivosProductos = archivosProductos.filter(
// //                         url => url.includes(`/dormitorios/${sub1}/${sub2}/${sub3}/${sub4}.json`)
// //                     );
// //                 }

// //                 const productosPromesas = archivosProductos.map(async (url) => {
// //                     try {
// //                         const response = await fetch(url);
// //                         const data = await response.json();
// //                         return data.productos || [];
// //                     } catch (error) {
// //                         return [];
// //                     }
// //                 });

// //                 const productosPorArchivo = await Promise.all(productosPromesas);
// //                 const todosProductos = productosPorArchivo.flat();

// //                 setProductos(todosProductos);
// //                 setCurrentPage(1); // Resetear a primera página al cargar nuevos productos
// //             } catch (error) {
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         cargarProductosDormitorios();
// //     }, [sub1, sub2, sub3, sub4, sub5]);

// //     useEffect(() => {
// //         if (sub5) return;

// //         const cargarFiltros = async () => {
// //             try {
// //                 const response = await fetch('/assets/json/categorias/dormitorios/filtros.json');
// //                 const data = await response.json();
// //                 setFiltros(data.filtros || []);
// //             } catch (error) {
// //             }
// //         };

// //         cargarFiltros();
// //     }, [sub5]);

// //     const marcaSeleccionada = queryParams.get('marca');

// //     const filtrosFiltrados = useMemo(() => {
// //         return filtros.map(filtro => {
// //             const nombreFiltro = Object.keys(filtro)[0];
// //             const valoresFiltro = filtro[nombreFiltro];

// //             if (nombreFiltro === "modelos" && marcaSeleccionada) {
// //                 const marcaNormalizada = normalizarTexto(marcaSeleccionada);
// //                 const grupoModelos = mapaMarcasModelos[marcaNormalizada];

// //                 if (grupoModelos) {
// //                     const modelosFiltrados = valoresFiltro.filter(grupo => {
// //                         const nombreGrupo = Object.keys(grupo)[0];
// //                         const grupoNormalizado = normalizarTexto(nombreGrupo);
// //                         return grupoNormalizado === grupoModelos;
// //                     });

// //                     if (modelosFiltrados.length > 0) {
// //                         return { [nombreFiltro]: modelosFiltrados };
// //                     }
// //                 }

// //                 return filtro;
// //             }

// //             return filtro;
// //         });
// //     }, [filtros, marcaSeleccionada]);

// //     const productosFiltrados = useMemo(() => {
// //         if (productos.length === 0) return [];

// //         let productosFiltradosTemp = productos;

// //         if (queryParams.entries().length === 0 && !envioGratisActivo) {
// //             productosFiltradosTemp = productos;
// //         } else {
// //             productosFiltradosTemp = productos.filter(producto => {
// //                 if (envioGratisActivo) {
// //                     if (producto["tipo-de-envio"] !== "Gratis") {
// //                         return false;
// //                     }
// //                 }

// //                 if (queryParams.entries().length === 0) return true;

// //                 for (let [paramUrl, valorFiltro] of queryParams.entries()) {
// //                     const claveJson = filtroKeyMap[paramUrl];
// //                     if (!claveJson) continue;

// //                     const normalizadoFiltro = normalizarTexto(valorFiltro);
// //                     const detalles = producto["detalles-del-producto"] || [];
                    
// //                     const cumpleFiltro = detalles.some(detalle => {
// //                         const valorProducto = detalle[claveJson];
// //                         if (!valorProducto) {
// //                             if (paramUrl === "modelo" && producto.modelo) {
// //                                 const valorSuperior = producto.modelo;
// //                                 const normalizadoSuperior = normalizarTexto(valorSuperior.toString());
// //                                 return normalizadoSuperior === normalizadoFiltro;
// //                             }
// //                             return false;
// //                         }

// //                         const normalizadoProducto = normalizarTexto(valorProducto.toString());

// //                         if (paramUrl === "marca" && mapaEquivalenciasMarcas[normalizadoFiltro]) {
// //                             return mapaEquivalenciasMarcas[normalizadoFiltro].includes(normalizadoProducto);
// //                         }
                        
// //                         return normalizadoProducto === normalizadoFiltro;
// //                     });

// //                     if (!cumpleFiltro) {
// //                         return false;
// //                     }
// //                 }
// //                 return true;
// //             });
// //         }

// //         return shuffleArray(productosFiltradosTemp);
// //     }, [productos, queryParams, envioGratisActivo]);

// //     const totalItems = productosFiltrados.length;
// //     const totalPages = Math.ceil(totalItems / itemsPerPage);
// //     const startIndex = (currentPage - 1) * itemsPerPage;
// //     const endIndex = startIndex + itemsPerPage;
// //     const productosPagina = productosFiltrados.slice(startIndex, endIndex);

// //     const getVisiblePages = () => {
// //         const visiblePages = [];
// //         if (totalPages <= 5) {
// //             for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
// //         } else {
// //             if (currentPage <= 3) { 
// //                 visiblePages.push(1, 2, 3, 4, '...', totalPages); 
// //             } else if (currentPage >= totalPages - 2) {
// //                 visiblePages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
// //             } else {
// //                 visiblePages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
// //             }
// //         }
// //         return visiblePages;
// //     };

// //     const handlePageChange = (newPage) => {
// //         setCurrentPage(Math.max(1, Math.min(totalPages, newPage)));
// //         window.scrollTo({ top: 0, behavior: 'smooth' });
// //     };

// //     const handlePreviousPage = () => handlePageChange(currentPage - 1);
// //     const handleNextPage = () => handlePageChange(currentPage + 1);

// //     const toggleFiltro = (nombreFiltro, valor) => {
// //         const normalizadoValor = normalizarTexto(valor);
// //         const newParams = new URLSearchParams(location.search);
// //         const valorActual = newParams.get(nombreFiltro);

// //         if (nombreFiltro === "marca") {
// //             const marcaActual = newParams.get('marca');
// //             if (marcaActual && marcaActual !== normalizadoValor && !sonMarcasEquivalentes(marcaActual, normalizadoValor)) {
// //                 newParams.delete('modelo');
// //             }
// //         }

// //         if (valorActual === normalizadoValor) {
// //             newParams.delete(nombreFiltro);
// //         } else {
// //             newParams.set(nombreFiltro, normalizadoValor);
// //         }

// //         setCurrentPage(1);
// //         navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
// //     };

// //     const isFiltroActivo = (nombreFiltro, valor) => {
// //         const normalizadoValor = normalizarTexto(valor);
// //         return queryParams.get(nombreFiltro) === normalizadoValor;
// //     };

// //     const limpiarFiltros = () => {
// //         setCurrentPage(1);
// //         navigate(location.pathname, { replace: true });
// //     };

// //     if (sub5) {
// //         return null;
// //     }

// //     return(
// //         <>
// //             <Helmet>
// //                 <title>Dormitorios | Dormihogar</title>
// //             </Helmet>

// //             <main className='products-page-main d-flex-column gap-20'>
// //                 <Categorias/>

// //                 <div className='products-page-blocks'>
// //                     <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
// //                         <div className='products-page-filters-container-global'>
// //                             <div className='d-flex-column gap-20'>
// //                                 <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
// //                                     <p className='block-title color-color-1 uppercase w-100 d-flex'>Dormihogar</p>
// //                                     <button type='button' className='filters-button-close margin-left' onClick={closeFilters}>
// //                                         <span className="material-icons color-color-1">close</span>
// //                                     </button>
// //                                     <p className='uppercase w-100 d-flex'>Las mejores marcas en productos para el descanso</p>
// //                                 </div>

// //                                 <div className='envio-gratis-button-container'>
// //                                     <div className='d-flex-center-center'>
// //                                         <p className='weight-bold uppercase color-color-1 font-bold'>Envío gratis</p>
// //                                     </div>
// //                                     <div type='button' className={`envio-gratis-button ${envioGratisActivo ? 'active' : ''}`} onClick={toggleEnvioGratis}>
// //                                         <span></span>
// //                                     </div>
// //                                 </div>

// //                                 <div className='products-page-filters-container d-flex-column gap-20'>
// //                                     {filtrosFiltrados.map((filtro, index) => {
// //                                         const nombreFiltro = Object.keys(filtro)[0];
// //                                         const valoresFiltro = filtro[nombreFiltro];

// //                                         if (nombreFiltro === "modelos" && valoresFiltro.length === 0) {
// //                                             return null;
// //                                         }

// //                                         if (nombreFiltro === "tamaño") {
// //                                             return(
// //                                                 <div className='products-page-filter active' key={index}>
// //                                                     <p className='filter-title uppercase'>Tamaño</p>
// //                                                     <ul className='products-page-filter-list'>
// //                                                         {valoresFiltro.map((item, i) => (
// //                                                             <li key={i}>
// //                                                                 <Link to={item.ruta} className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}>
// //                                                                     <p>{item.tamaño}</p>
// //                                                                 </Link>
// //                                                             </li>
// //                                                         ))}
// //                                                     </ul>
// //                                                 </div>
// //                                             );
// //                                         }

// //                                         if (nombreFiltro === "modelos") {
// //                                             return(
// //                                                 <div className='products-page-filter' key={index}>
// //                                                     <p className='filter-title'>Modelos</p>
// //                                                     <div className='filter-subgroups'>
// //                                                         {valoresFiltro.map((grupo, idx) => {
// //                                                             const nombreGrupo = Object.keys(grupo)[0];
// //                                                             const modelos = grupo[nombreGrupo];

// //                                                             return(
// //                                                                 <div key={idx} className='filter-subgroup d-flex-column gap-5'>
// //                                                                     {(!marcaSeleccionada || valoresFiltro.length > 1) && (
// //                                                                         <p className='filter-subgroup-title color-color-1 uppercase font-bold'>{nombreGrupo.replace(/-/g, ' ')}</p>
// //                                                                     )}
// //                                                                     <ul className='products-page-filter-list'>
// //                                                                         {modelos.map((modelo, mIdx) => (
// //                                                                             <li key={mIdx}>
// //                                                                                 <button type='button' className={isFiltroActivo("modelo", modelo) ? "active" : ""} onClick={() => toggleFiltro("modelo", modelo)}>
// //                                                                                     <p>{modelo}</p>
// //                                                                                 </button>
// //                                                                             </li>
// //                                                                         ))}
// //                                                                     </ul>
// //                                                                 </div>
// //                                                             );
// //                                                         })}
// //                                                     </div>
// //                                                 </div>
// //                                             );
// //                                         }

// //                                         return(
// //                                             <div className='products-page-filter' key={index}>
// //                                                 <p className='filter-title uppercase'>{nombreFiltro.replace(/-/g, ' ')}</p>
// //                                                 <ul className='products-page-filter-list'>
// //                                                     {valoresFiltro.map((valor, i) => (
// //                                                         <li key={i}>
// //                                                             <button type='button' className={isFiltroActivo(nombreFiltro, valor) ? "active" : ""} onClick={() => toggleFiltro(nombreFiltro, valor)}>
// //                                                                 <p>{valor}</p>
// //                                                             </button>
// //                                                         </li>
// //                                                     ))}
// //                                                 </ul>
// //                                             </div>
// //                                         );
// //                                     })}
// //                                 </div>

// //                                 {queryParams.toString() && (
// //                                     <button type="button" className="button-link button-link-2" onClick={limpiarFiltros}>
// //                                         <span className="material-icons">delete</span>
// //                                         <p className="button-link-text">Limpiar filtros</p>
// //                                     </button>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     </div>

// //                     <div className='products-page-right'>
// //                         <FiltrosTop 
// //                             toggleFiltro={toggleFiltro} 
// //                             isFiltroActivo={isFiltroActivo}
// //                             setIsFiltersOpen={setIsFiltersOpen} 
// //                             isFiltersOpen={isFiltersOpen}
// //                             totalProductos={productosFiltrados.length}
// //                             currentPage={currentPage}
// //                             itemsPerPage={itemsPerPage}
// //                             startIndex={startIndex}
// //                             endIndex={Math.min(endIndex, totalItems)}
// //                         />

// //                         <div className='products-page-products-container'>
// //                             {loading ? (
// //                                 <div className="loading-products d-flex-center-center d-flex-column gap-10">
// //                                     <div className="spinner"></div>
// //                                     <p>Cargando productos...</p>
// //                                 </div>
// //                             ) : (
// //                                 <>
// //                                     <ul className="products-page-products">
// //                                         {
// //                                             productosPagina.length === 0 ? (
// //                                                 <div className='d-grid-1-1'>
// //                                                     <div className="d-flex-column gap-10">
// //                                                         <p className='text'>No se encontraron productos con los filtros seleccionados.</p>

// //                                                         {queryParams.toString() && (
// //                                                             <button type="button" className="margin-right button-link button-link-2" onClick={limpiarFiltros}>
// //                                                                 <span className="material-icons">delete</span>
// //                                                                 <p className='button-link-text'>Limpiar filtros</p>
// //                                                             </button>
// //                                                         )}
// //                                                     </div>
// //                                                 </div>
// //                                             ) : (
// //                                                 productosPagina.map(
// //                                                     producto => (
// //                                                         <Producto key={producto.sku} producto={producto} />
// //                                                     )
// //                                                 )
// //                                             )
// //                                         }
// //                                     </ul>

// //                                     {productosPagina.length > 0 && totalPages > 1 && (
// //                                         <div className="pagination-controls">
// //                                             <button className="pagination-arrow" onClick={handlePreviousPage} disabled={currentPage === 1}>
// //                                                 <span className="material-icons">chevron_left</span>
// //                                             </button>

// //                                             <div className="d-flex-center-center gap-10">
// //                                                 {getVisiblePages().map((page, index) => 
// //                                                     typeof page === 'number' ? (
// //                                                         <button key={index} className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>
// //                                                             {page}
// //                                                         </button>
// //                                                     ) : (
// //                                                         <span key={index} className="pagination-ellipsis">...</span>
// //                                                     )
// //                                                 )}
// //                                             </div>

// //                                             <button className="pagination-arrow" onClick={handleNextPage} disabled={currentPage === totalPages}>
// //                                                 <span className="material-icons">chevron_right</span>
// //                                             </button>
// //                                         </div>
// //                                     )}
// //                                 </>
// //                             )}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </main>

// //             <div className={`filters-layout ${isFiltersOpen ? 'active' : ''}`} onClick={closeFilters}></div>
// //         </>
// //     );
// // }

// // export default Dormitorios;

// import { useEffect, useState, useMemo, useRef } from 'react';
// import { Helmet } from 'react-helmet';
// import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

// import '../Productos.css';
// import './Layout.css';

// import Categorias from '../Componentes/Categorias/Categorias';
// import BtnGeneral from './Componentes/BtnGeneral/BtnGeneral';
// import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
// import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';
// import { usePagination } from '../../../Hooks/usePagination';

// const normalizarTexto = (texto) => {
//     // Verificar si texto es válido antes de procesar
//     if (!texto || typeof texto !== 'string') {
//         return '';
//     }
//     return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
// };

// function Dormitorios() {
//     const { sub1, sub2, sub3, sub4 } = useParams();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [productos, setProductos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filtrosData, setFiltrosData] = useState(null);
//     const [orden, setOrden] = useState("ultimo");
//     const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
//     const [isFiltersOpen, setIsFiltersOpen] = useState(false);
//     const filtersPanelRef = useRef(null);
//     const itemsPerPage = 20;

//     const [activeFilters, setActiveFilters] = useState({
//         tamaño: null,
//         marca: null,
//         tipoCabecera: null,
//         diseñoCabecera: null,
//         brazosCabecera: null,
//         modelo: null,
//         baseEncajonada: null,
//         cajones: null,
//         conBaul: null,
//         conPiecera: null,
//         linea: null
//     });

//     const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
//     const [filtroSkus, setFiltroSkus] = useState(null);
//     const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);

//     const closeFilters = () => {
//         setIsFiltersOpen(false);
//     };

//     // Mapeo de parámetros de URL a estados
//     const filterParamMap = {
//         'tamaño': 'tamaño',
//         'marca': 'marca',
//         'tipo-cabecera': 'tipoCabecera',
//         'diseño-cabecera': 'diseñoCabecera',
//         'brazos-cabecera': 'brazosCabecera',
//         'modelo': 'modelo',
//         'base-encajonada': 'baseEncajonada',
//         'cajones': 'cajones',
//         'con-baul': 'conBaul',
//         'con-piecera': 'conPiecera',
//         'linea': 'linea'
//     };

//     // Mapeo inverso para actualizar URL
//     const paramMap = {
//         tamaño: 'tamaño',
//         marca: 'marca',
//         tipoCabecera: 'tipo-cabecera',
//         diseñoCabecera: 'diseño-cabecera',
//         brazosCabecera: 'brazos-cabecera',
//         modelo: 'modelo',
//         baseEncajonada: 'base-encajonada',
//         cajones: 'cajones',
//         conBaul: 'con-baul',
//         conPiecera: 'con-piecera',
//         linea: 'linea'
//     };

//     // Sincronizar filtros activos con la URL
//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const newActiveFilters = { ...activeFilters };
//         let hasChanges = false;

//         Object.entries(filterParamMap).forEach(([paramKey, stateKey]) => {
//             const value = params.get(paramKey);
//             if (value !== null) {
//                 newActiveFilters[stateKey] = value;
//                 hasChanges = true;
//             } else if (newActiveFilters[stateKey] !== null) {
//                 newActiveFilters[stateKey] = null;
//                 hasChanges = true;
//             }
//         });

//         if (hasChanges) {
//             setActiveFilters(newActiveFilters);
//         }
//     }, [location.search]);

//     // Click outside handler
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (filtersPanelRef.current && 
//                 !filtersPanelRef.current.contains(event.target) &&
//                 !event.target.closest('.filters-button-open')) {
//                 setIsFiltersOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     // Cargar productos
//     useEffect(() => {
//         const cargarProductosDormitorios = async () => {
//             try {
//                 setLoading(true);

//                 const manifestResponse = await fetch('/assets/json/manifest.json');
//                 const manifestData = await manifestResponse.json();
//                 const archivos = manifestData.files || [];

//                 let archivosProductos = archivos.filter(url =>
//                     url.startsWith('/assets/json/categorias/dormitorios/')
//                 );

//                 if (sub1) {
//                     archivosProductos = archivosProductos.filter(
//                         url => url.includes(`/dormitorios/${sub1}/`)
//                     );
//                 }

//                 if (sub2) {
//                     archivosProductos = archivosProductos.filter(
//                         url => url.includes(`/dormitorios/${sub1}/${sub2}/`)
//                     );
//                 }

//                 if (sub3) {
//                     archivosProductos = archivosProductos.filter(
//                         url => url.includes(`/dormitorios/${sub1}/${sub2}/${sub3}/`)
//                     );
//                 }

//                 if (sub4) {
//                     archivosProductos = archivosProductos.filter(
//                         url => url.includes(`/dormitorios/${sub1}/${sub2}/${sub3}/${sub4}.json`)
//                     );
//                 }

//                 const productosPromesas = archivosProductos.map(async (url) => {
//                     const response = await fetch(url);
//                     const data = await response.json();

//                     const productosConFicha = data.productos?.map(producto => ({
//                         ...producto,
//                         fichaTecnica: data.ficha?.[0] || {}
//                     })) || [];
                    
//                     return productosConFicha;
//                 });

//                 const productosPorArchivo = await Promise.all(productosPromesas);
//                 const todosProductos = productosPorArchivo.flat();

//                 setProductos(todosProductos);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error cargando productos de dormitorios:", error);
//                 setLoading(false);
//             }
//         };

//         cargarProductosDormitorios();
//     }, [sub1, sub2, sub3, sub4]);

//     // Cargar filtros
//     useEffect(() => {
//         const cargarFiltros = async () => {
//             try {
//                 const response = await fetch('/assets/json/categorias/dormitorios/filtros.json');
//                 const data = await response.json();
//                 setFiltrosData(data);
//             } catch (error) {
//                 console.error("Error cargando filtros:", error);
//             }
//         };

//         cargarFiltros();
//     }, []);

//     // Función para obtener valor de producto con búsqueda flexible
//     const getProductValue = (product, fieldName) => {
//         if (!product) return null;

//         const variants = new Set();

//         variants.add(fieldName);
//         variants.add(fieldName.toLowerCase());
//         variants.add(fieldName.toUpperCase());
//         variants.add(fieldName.replace(/-/g, ' '));
//         variants.add(fieldName.replace(/ /g, '-'));
//         variants.add(fieldName.replace(/ /g, '_'));

//         if (fieldName.endsWith('ón')) {
//             variants.add(fieldName.slice(0, -1) + 'es');
//         } else if (fieldName.endsWith('or')) {
//             variants.add(fieldName + 's');
//             variants.add(fieldName.toLowerCase() + 's');
//         } else if (fieldName.endsWith('e')) {
//             variants.add(fieldName.slice(0, -1) + 'as');
//             variants.add(fieldName.toLowerCase().slice(0, -1) + 'as');
//         } else if (fieldName.endsWith('a') || fieldName.endsWith('o')) {
//             variants.add(fieldName + 's');
//             variants.add(fieldName.toLowerCase() + 's');
//         } else if (fieldName.endsWith('l')) {
//             variants.add(fieldName + 'es');
//             variants.add(fieldName.toLowerCase() + 'es');
//         } else {
//             variants.add(fieldName + 's');
//             variants.add(fieldName.toLowerCase() + 's');
//         }

//         const newVariants = new Set(variants);
//         variants.forEach(v => {
//             newVariants.add(v.replace(/ /g, '-'));
//             newVariants.add(v.replace(/-/g, ' '));
//         });

//         const fieldMappings = {
//             'tipoCabecera': ['tipo-de-cabecera', 'tipo-cabecera', 'tipo-de-cabeceras', 'tipo-cabeceras', 'tipo'],
//             'diseñoCabecera': ['diseño-de-cabecera', 'diseño-cabecera', 'diseño-de-cabeceras', 'diseño-cabeceras', 'diseño'],
//             'brazosCabecera': ['brazos-de-cabecera', 'brazos-cabecera', 'brazos-de-cabeceras', 'brazos-cabeceras', 'brazos'],
//             'baseEncajonada': ['base-encajonada', 'base-encajonadas', 'base', 'base-encajonada-de-colchón'],
//             'cajones': ['cajones', 'cajon', 'cajones-de-colchón', 'cajon-de-colchón'],
//             'conBaul': ['con-baul', 'con-baúl', 'baul', 'baúl', 'con-baul-de-colchón'],
//             'conPiecera': ['con-piecera', 'piecera', 'con-piecera-de-colchón'],
//             'linea': ['línea-de-colchón', 'linea-colchon', 'linea-colchón', 'línea-de-colchones', 'linea-colchones', 'línea', 'linea'],
//             'modelo': ['modelo', 'modelos', 'modelo-de-colchón', 'modelo-de-colchones']
//         };

//         let keysToSearch = new Set();

//         if (fieldMappings[fieldName]) {
//             fieldMappings[fieldName].forEach(key => keysToSearch.add(key));
//         } else {
//             newVariants.forEach(v => keysToSearch.add(v));
//         }

//         for (const key of keysToSearch) {
//             if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
//                 const value = product[key];
//                 return typeof value === 'string' ? value : String(value);
//             }
//         }

//         if (product['detalles-del-producto'] && product['detalles-del-producto'].length > 0) {
//             const detalles = product['detalles-del-producto'][0];
//             for (const key of keysToSearch) {
//                 if (detalles[key] !== undefined && detalles[key] !== null && detalles[key] !== '') {
//                     const value = detalles[key];
//                     return typeof value === 'string' ? value : String(value);
//                 }
//             }
//         }

//         if (product.fichaTecnica) {
//             for (const key of keysToSearch) {
//                 if (product.fichaTecnica[key] !== undefined && product.fichaTecnica[key] !== null && product.fichaTecnica[key] !== '') {
//                     const value = product.fichaTecnica[key];
//                     return typeof value === 'string' ? value : String(value);
//                 }
//             }
//         }

//         for (const key of Object.keys(product)) {
//             const keyLower = key.toLowerCase().replace(/[^a-z0-9]/g, '');
//             for (const searchKey of keysToSearch) {
//                 const searchLower = searchKey.toLowerCase().replace(/[^a-z0-9]/g, '');
//                 if (keyLower === searchLower || keyLower.includes(searchLower) || searchLower.includes(keyLower)) {
//                     if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
//                         const value = product[key];
//                         return typeof value === 'string' ? value : String(value);
//                     }
//                 }
//             }
//         }

//         return null;
//     };

//     // Actualizar URL
//     const updateURL = (filterType, value) => {
//         const params = new URLSearchParams(location.search);

//         const paramName = paramMap[filterType] || filterType;

//         if (value === null || value === undefined) {
//             params.delete(paramName);
//         } else {
//             params.set(paramName, value);
//         }

//         // Limpiar filtros dependientes jerárquicamente
//         const hierarchy = {
//             'marca': ['tipoCabecera', 'diseñoCabecera', 'brazosCabecera', 'modelo', 'baseEncajonada', 'cajones', 'conBaul', 'conPiecera', 'linea'],
//             'tipoCabecera': ['diseñoCabecera', 'brazosCabecera', 'modelo'],
//             'diseñoCabecera': ['brazosCabecera', 'modelo'],
//             'brazosCabecera': ['modelo']
//         };

//         if (hierarchy[filterType]) {
//             hierarchy[filterType].forEach(dependent => {
//                 params.delete(paramMap[dependent] || dependent);
//             });
//         }

//         const newSearch = params.toString();
//         const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
//         navigate(newPath, { replace: true });
//     };

//     // Manejar cambio de filtro
//     const handleFilterChange = (filterType, value) => {
//         setActiveFilters(prev => {
//             const newFilters = { ...prev };
            
//             // Si es marca, limpiar todos los filtros jerárquicos
//             if (filterType === 'marca') {
//                 newFilters.marca = value;
//                 newFilters.tipoCabecera = null;
//                 newFilters.diseñoCabecera = null;
//                 newFilters.brazosCabecera = null;
//                 newFilters.modelo = null;
//                 newFilters.baseEncajonada = null;
//                 newFilters.cajones = null;
//                 newFilters.conBaul = null;
//                 newFilters.conPiecera = null;
//                 newFilters.linea = null;
                
//                 const params = new URLSearchParams(location.search);
//                 ['tipo-cabecera', 'diseño-cabecera', 'brazos-cabecera', 'modelo', 
//                  'base-encajonada', 'cajones', 'con-baul', 'con-piecera', 'linea'].forEach(key => {
//                     params.delete(key);
//                 });

//                 if (value === null) {
//                     params.delete('marca');
//                 } else {
//                     params.set('marca', value);
//                 }
                
//                 const newSearch = params.toString();
//                 const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
//                 navigate(newPath, { replace: true });
                
//                 return newFilters;
//             }

//             // Para otros filtros, mantener la lógica jerárquica
//             if (filterType === 'tipoCabecera') {
//                 if (value === null) {
//                     newFilters.tipoCabecera = null;
//                     newFilters.diseñoCabecera = null;
//                     newFilters.brazosCabecera = null;
//                     newFilters.modelo = null;
//                 } else {
//                     newFilters.tipoCabecera = value;
//                     newFilters.diseñoCabecera = null;
//                     newFilters.brazosCabecera = null;
//                     newFilters.modelo = null;
//                 }
//             } else if (filterType === 'diseñoCabecera') {
//                 if (value === null) {
//                     newFilters.diseñoCabecera = null;
//                     newFilters.brazosCabecera = null;
//                     newFilters.modelo = null;
//                 } else {
//                     newFilters.diseñoCabecera = value;
//                     newFilters.brazosCabecera = null;
//                     newFilters.modelo = null;
//                 }
//             } else if (filterType === 'brazosCabecera') {
//                 if (value === null) {
//                     newFilters.brazosCabecera = null;
//                     newFilters.modelo = null;
//                 } else {
//                     newFilters.brazosCabecera = value;
//                     newFilters.modelo = null;
//                 }
//             } else {
//                 if (value === null) {
//                     newFilters[filterType] = null;
//                 } else {
//                     newFilters[filterType] = value;
//                 }
//             }
            
//             const filterToUpdate = value === null ? filterType : filterType;
//             updateURL(filterToUpdate, value);
            
//             return newFilters;
//         });
//     };

//     // Handlers para BtnGeneral
//     const handleFiltroSkus = (skus) => {
//         setFiltroSkus(skus);
//     };

//     const handleEnvioGratis = (activo) => {
//         setEnvioGratisActivo(activo);
//     };

//     const isFiltroActivo = (nombreFiltro, valor) => {
//         const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
//         return activeFilters[stateKey] === valor;
//     };

//     // Alternar filtro
//     const toggleFiltro = (nombreFiltro, valor) => {
//         const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
//         const isActive = activeFilters[stateKey] === valor;
//         handleFilterChange(stateKey, isActive ? null : valor);
//     };

//     // Aplicar filtros a los productos
//     const productosFiltrados = useMemo(() => {
//         if (productos.length === 0) return [];

//         const filtrados = productos.filter(producto => {
//             let cumpleTodosLosFiltros = true;

//             // 1. Filtro por envío gratis
//             if (envioGratisActivo) {
//                 if (producto["tipo-de-envio"] !== "Gratis") {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // 2. Filtro por SKUs (entrega hoy/mañana)
//             if (cumpleTodosLosFiltros && filtroSkus && Array.isArray(filtroSkus) && filtroSkus.length > 0) {
//                 if (!filtroSkus.includes(producto.sku)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // 3. Filtros
//             if (cumpleTodosLosFiltros) {
//                 // Tamaño
//                 if (activeFilters.tamaño) {
//                     const tamañoProducto = getProductValue(producto, 'tamaño');
//                     const tamañoNormalizado = normalizarTexto(tamañoProducto);
//                     if (tamañoNormalizado !== normalizarTexto(activeFilters.tamaño)) {
//                         cumpleTodosLosFiltros = false;
//                     }
//                 }
//             }

//             // Marca
//             if (cumpleTodosLosFiltros && activeFilters.marca) {
//                 const marcaProducto = getProductValue(producto, 'marca');
//                 if (!marcaProducto || normalizarTexto(marcaProducto) !== normalizarTexto(activeFilters.marca)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Tipo de cabecera
//             if (cumpleTodosLosFiltros && activeFilters.tipoCabecera) {
//                 const tipoProducto = getProductValue(producto, 'tipoCabecera');
//                 if (!tipoProducto || normalizarTexto(tipoProducto) !== normalizarTexto(activeFilters.tipoCabecera)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Diseño de cabecera
//             if (cumpleTodosLosFiltros && activeFilters.diseñoCabecera) {
//                 const diseñoProducto = getProductValue(producto, 'diseñoCabecera');
//                 if (!diseñoProducto || normalizarTexto(diseñoProducto) !== normalizarTexto(activeFilters.diseñoCabecera)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Brazos de cabecera
//             if (cumpleTodosLosFiltros && activeFilters.brazosCabecera) {
//                 const brazosProducto = getProductValue(producto, 'brazosCabecera');
//                 if (!brazosProducto || normalizarTexto(brazosProducto) !== normalizarTexto(activeFilters.brazosCabecera)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Modelo
//             if (cumpleTodosLosFiltros && activeFilters.modelo) {
//                 const modeloProducto = getProductValue(producto, 'modelo');
//                 if (!modeloProducto || normalizarTexto(modeloProducto) !== normalizarTexto(activeFilters.modelo)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Base encajonada
//             if (cumpleTodosLosFiltros && activeFilters.baseEncajonada) {
//                 const baseProducto = getProductValue(producto, 'baseEncajonada');
//                 if (!baseProducto || normalizarTexto(baseProducto) !== normalizarTexto(activeFilters.baseEncajonada)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Cajones
//             if (cumpleTodosLosFiltros && activeFilters.cajones) {
//                 const cajonesProducto = getProductValue(producto, 'cajones');
//                 if (!cajonesProducto || normalizarTexto(cajonesProducto) !== normalizarTexto(activeFilters.cajones)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Con Baúl
//             if (cumpleTodosLosFiltros && activeFilters.conBaul) {
//                 const baulProducto = getProductValue(producto, 'conBaul');
//                 if (!baulProducto || normalizarTexto(baulProducto) !== normalizarTexto(activeFilters.conBaul)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Con Piecera
//             if (cumpleTodosLosFiltros && activeFilters.conPiecera) {
//                 const pieceraProducto = getProductValue(producto, 'conPiecera');
//                 if (!pieceraProducto || normalizarTexto(pieceraProducto) !== normalizarTexto(activeFilters.conPiecera)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             // Línea
//             if (cumpleTodosLosFiltros && activeFilters.linea) {
//                 const lineaProducto = getProductValue(producto, 'linea');
//                 if (!lineaProducto || normalizarTexto(lineaProducto) !== normalizarTexto(activeFilters.linea)) {
//                     cumpleTodosLosFiltros = false;
//                 }
//             }

//             return cumpleTodosLosFiltros;
//         });

//         return filtrados;
//     }, [productos, activeFilters, envioGratisActivo, filtroSkus]);

//     // Ordenar productos
//     const productosOrdenados = useMemo(() => {
//         return [...productosFiltrados].sort((a, b) => {
//             if (orden === "menor-mayor") {
//                 return a.precioVenta - b.precioVenta;
//             } else if (orden === "mayor-menor") {
//                 return b.precioVenta - a.precioVenta;
//             }
//             return 0;
//         });
//     }, [productosFiltrados, orden]);

//     // Hook de paginación
//     const {
//         currentPage,
//         setCurrentPage,
//         totalPages,
//         startIndex,
//         endIndex,
//         getVisiblePages,
//         handlePageChange,
//         handlePreviousPage,
//         handleNextPage,
//         resetPage
//     } = usePagination(productosOrdenados.length, itemsPerPage);

//     // Resetear página cuando cambian los filtros
//     useEffect(() => {
//         resetPage();
//     }, [activeFilters, envioGratisActivo, filtroSkus, orden]);

//     const productosPagina = productosOrdenados.slice(startIndex, endIndex);

//     // Limpiar filtros
//     const limpiarFiltros = () => {
//         setActiveFilters({
//             tamaño: null,
//             marca: null,
//             tipoCabecera: null,
//             diseñoCabecera: null,
//             brazosCabecera: null,
//             modelo: null,
//             baseEncajonada: null,
//             cajones: null,
//             conBaul: null,
//             conPiecera: null,
//             linea: null
//         });
        
//         setFiltroSkus(null);
//         setEnvioGratisActivo(false);
//         resetPage();
        
//         navigate(location.pathname);
        
//         setResetFiltersTrigger(true);
//         setTimeout(() => {
//             setResetFiltersTrigger(false);
//         }, 100);
//     };

//     // Renderizar filtros de tamaño
//     const renderTamañosFilters = () => {
//         if (!filtrosData?.filtros?.[0]?.tamaño) return null;
//         const tamaños = filtrosData.filtros[0].tamaño;

//         const currentPath = location.pathname;

//         return (
//             <div className='prds-filter-tag'>
//                 <div 
//                     className='prds-filter-title-container'
//                     onClick={() => {
//                         const tag = document.querySelector('.prds-filter-tag:first-child');
//                         tag?.classList.toggle('active');
//                     }}
//                 >
//                     <p className='prds-filter-title'>Tamaños</p>
//                     <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                 </div>

//                 <div className='prds-filter-tag-results-container'>
//                     <ul>
//                         {tamaños.map((item, index) => {
//                             const finalUrl = item.ruta;
//                             const currentPathNormalized = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
//                             const linkPathNormalized = finalUrl.endsWith('/') ? finalUrl.slice(0, -1) : finalUrl;
//                             const isActive = currentPathNormalized === linkPathNormalized;
                            
//                             return (
//                                 <li key={index}>
//                                     <Link 
//                                         to={finalUrl}
//                                         className={isActive ? 'active' : ''}
//                                         title={`Ver productos tamaño ${item.tamaño}`}
//                                     >
//                                         <span></span>
//                                         <p>{item.tamaño}</p>
//                                     </Link>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>
//             </div>
//         );
//     };

//     // Renderizar filtro de marca
//     const renderMarcaFilters = () => {
//         if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        
//         const tamañoActual = sub1 || activeFilters.tamaño || null;
        
//         if (!tamañoActual) {
//             const todasLasMarcas = new Set();
//             const tamaños = filtrosData.filtros[0].tamaño;
            
//             tamaños.forEach(tamaño => {
//                 if (tamaño.marcas && Array.isArray(tamaño.marcas)) {
//                     tamaño.marcas.forEach(marcaItem => {
//                         if (marcaItem.marca) {
//                             todasLasMarcas.add(marcaItem.marca);
//                         }
//                     });
//                 }
//             });
            
//             const marcasUnicas = Array.from(todasLasMarcas);
//             if (marcasUnicas.length === 0) return null;

//             return (
//                 <div className={`prds-filter-tag ${activeFilters.marca ? 'active' : ''}`}>
//                     <div 
//                         className='prds-filter-title-container'
//                         onClick={() => {
//                             const tag = document.querySelectorAll('.prds-filter-tag')[1];
//                             tag?.classList.toggle('active');
//                         }}
//                     >
//                         <p className='prds-filter-title'>Marca</p>
//                         <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                     </div>

//                     <div className='prds-filter-tag-results-container'>
//                         <ul>
//                             {marcasUnicas.map((marca, index) => {
//                                 const isActive = activeFilters.marca === marca;
//                                 return (
//                                     <li key={index}>
//                                         <button 
//                                             type='button'
//                                             className={isActive ? 'active' : ''}
//                                             onClick={() => toggleFiltro('marca', isActive ? null : marca)}
//                                         >
//                                             <span></span>
//                                             <p>{marca}</p>
//                                         </button>
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     </div>
//                 </div>
//             );
//         }
        
//         const tamañoData = filtrosData.filtros[0].tamaño.find(
//             t => normalizarTexto(t.tamaño) === normalizarTexto(tamañoActual)
//         );
        
//         if (!tamañoData || !tamañoData.marcas || tamañoData.marcas.length === 0) {
//             return null;
//         }
        
//         const marcasDisponibles = tamañoData.marcas.map(m => m.marca);
        
//         return (
//             <div className={`prds-filter-tag ${activeFilters.marca ? 'active' : ''}`}>
//                 <div 
//                     className='prds-filter-title-container'
//                     onClick={() => {
//                         const tag = document.querySelectorAll('.prds-filter-tag')[1];
//                         tag?.classList.toggle('active');
//                     }}
//                 >
//                     <p className='prds-filter-title'>Marca</p>
//                     <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                 </div>

//                 <div className='prds-filter-tag-results-container'>
//                     <ul>
//                         {marcasDisponibles.map((marca, index) => {
//                             const isActive = activeFilters.marca === marca;
//                             return (
//                                 <li key={index}>
//                                     <button 
//                                         type='button'
//                                         className={isActive ? 'active' : ''}
//                                         onClick={() => toggleFiltro('marca', isActive ? null : marca)}
//                                     >
//                                         <span></span>
//                                         <p>{marca}</p>
//                                     </button>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>
//             </div>
//         );
//     };

//     // Renderizar filtros jerárquicos para dormitorios
//     const renderFiltrosJerarquicos = () => {
//         if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        
//         // Si no hay marca seleccionada, NO mostrar nada
//         if (!activeFilters.marca) return null;
        
//         // Buscar la marca en TODOS los tamaños
//         const tamaños = filtrosData.filtros[0].tamaño;
//         let marcaData = null;
        
//         // Recorrer todos los tamaños para encontrar la marca
//         for (const tamaño of tamaños) {
//             if (tamaño.marcas && Array.isArray(tamaño.marcas)) {
//                 const encontrado = tamaño.marcas.find(m => m.marca === activeFilters.marca);
//                 if (encontrado) {
//                     marcaData = encontrado;
//                     break;
//                 }
//             }
//         }
        
//         if (!marcaData) return null;

//         const elementos = [];

//         // 1. Tipo de cabecera
//         if (marcaData['tipo-de-cabecera'] && marcaData['tipo-de-cabecera'].length > 0) {
//             elementos.push(
//                 <div className={`prds-filter-tag ${activeFilters.tipoCabecera ? 'active' : ''}`} key="tipoCabecera">
//                     <div 
//                         className='prds-filter-title-container'
//                         onClick={(e) => {
//                             const parent = e.currentTarget.closest('.prds-filter-tag');
//                             parent?.classList.toggle('active');
//                         }}
//                     >
//                         <p className='prds-filter-title'>Tipo de cabecera</p>
//                         <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                     </div>

//                     <div className='prds-filter-tag-results-container'>
//                         <ul>
//                             {marcaData['tipo-de-cabecera'].map((item, index) => {
//                                 const isActive = activeFilters.tipoCabecera === item['tipo-de-cabecera'];
//                                 return (
//                                     <li key={index}>
//                                         <button 
//                                             type='button'
//                                             className={isActive ? 'active' : ''}
//                                             onClick={() => toggleFiltro('tipo-cabecera', isActive ? null : item['tipo-de-cabecera'])}
//                                         >
//                                             <span></span>
//                                             <p>{item['tipo-de-cabecera']}</p>
//                                         </button>
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     </div>
//                 </div>
//             );
//         }

//         // 2. Diseño de cabecera (solo si hay tipo de cabecera seleccionado)
//         if (activeFilters.tipoCabecera && marcaData['tipo-de-cabecera']) {
//             const tipoData = marcaData['tipo-de-cabecera'].find(
//                 t => t['tipo-de-cabecera'] === activeFilters.tipoCabecera
//             );
            
//             if (tipoData && tipoData['diseños-de-cabecera'] && tipoData['diseños-de-cabecera'].length > 0) {
//                 elementos.push(
//                     <div className={`prds-filter-tag ${activeFilters.diseñoCabecera ? 'active' : ''}`} key="diseñoCabecera">
//                         <div 
//                             className='prds-filter-title-container'
//                             onClick={(e) => {
//                                 const parent = e.currentTarget.closest('.prds-filter-tag');
//                                 parent?.classList.toggle('active');
//                             }}
//                         >
//                             <p className='prds-filter-title'>Diseño de cabecera</p>
//                             <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                         </div>

//                         <div className='prds-filter-tag-results-container'>
//                             <ul>
//                                 {tipoData['diseños-de-cabecera'].map((item, index) => {
//                                     const isActive = activeFilters.diseñoCabecera === item['diseño-de-cabecera'];
//                                     return (
//                                         <li key={index}>
//                                             <button 
//                                                 type='button'
//                                                 className={isActive ? 'active' : ''}
//                                                 onClick={() => toggleFiltro('diseño-cabecera', isActive ? null : item['diseño-de-cabecera'])}
//                                             >
//                                                 <span></span>
//                                                 <p>{item['diseño-de-cabecera']}</p>
//                                             </button>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
//                         </div>
//                     </div>
//                 );
//             }
//         }

//         // 3. Brazos de cabecera (solo si hay diseño seleccionado)
//         if (activeFilters.tipoCabecera && activeFilters.diseñoCabecera && marcaData['tipo-de-cabecera']) {
//             const tipoData = marcaData['tipo-de-cabecera'].find(
//                 t => t['tipo-de-cabecera'] === activeFilters.tipoCabecera
//             );
            
//             if (tipoData && tipoData['diseños-de-cabecera']) {
//                 const diseñoData = tipoData['diseños-de-cabecera'].find(
//                     d => d['diseño-de-cabecera'] === activeFilters.diseñoCabecera
//                 );
                
//                 if (diseñoData && diseñoData['brazos-de-cabecera'] && diseñoData['brazos-de-cabecera'].length > 0) {
//                     elementos.push(
//                         <div className={`prds-filter-tag ${activeFilters.brazosCabecera ? 'active' : ''}`} key="brazosCabecera">
//                             <div 
//                                 className='prds-filter-title-container'
//                                 onClick={(e) => {
//                                     const parent = e.currentTarget.closest('.prds-filter-tag');
//                                     parent?.classList.toggle('active');
//                                 }}
//                             >
//                                 <p className='prds-filter-title'>Brazos de cabecera</p>
//                                 <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                             </div>

//                             <div className='prds-filter-tag-results-container'>
//                                 <ul>
//                                     {diseñoData['brazos-de-cabecera'].map((item, index) => {
//                                         const isActive = activeFilters.brazosCabecera === item['brazos-de-cabecera'];
//                                         return (
//                                             <li key={index}>
//                                                 <button 
//                                                     type='button'
//                                                     className={isActive ? 'active' : ''}
//                                                     onClick={() => toggleFiltro('brazos-cabecera', isActive ? null : item['brazos-de-cabecera'])}
//                                                 >
//                                                     <span></span>
//                                                     <p>{item['brazos-de-cabecera']}</p>
//                                                 </button>
//                                             </li>
//                                         );
//                                     })}
//                                 </ul>
//                             </div>
//                         </div>
//                     );
//                 }
//             }
//         }

//         // 4. Modelos (solo si hay brazos seleccionado O si no hay jerarquía de cabecera)
//         // Si hay brazos seleccionado, mostrar modelos de ese nivel
//         if (activeFilters.tipoCabecera && activeFilters.diseñoCabecera && activeFilters.brazosCabecera) {
//             const tipoData = marcaData['tipo-de-cabecera']?.find(
//                 t => t['tipo-de-cabecera'] === activeFilters.tipoCabecera
//             );
//             if (tipoData) {
//                 const diseñoData = tipoData['diseños-de-cabecera']?.find(
//                     d => d['diseño-de-cabecera'] === activeFilters.diseñoCabecera
//                 );
//                 if (diseñoData) {
//                     const brazosData = diseñoData['brazos-de-cabecera']?.find(
//                         b => b['brazos-de-cabecera'] === activeFilters.brazosCabecera
//                     );
//                     if (brazosData && brazosData['modelos-de-colchones'] && brazosData['modelos-de-colchones'].length > 0) {
//                         elementos.push(
//                             <div className={`prds-filter-tag ${activeFilters.modelo ? 'active' : ''}`} key="modelo">
//                                 <div 
//                                     className='prds-filter-title-container'
//                                     onClick={(e) => {
//                                         const parent = e.currentTarget.closest('.prds-filter-tag');
//                                         parent?.classList.toggle('active');
//                                     }}
//                                 >
//                                     <p className='prds-filter-title'>Modelo</p>
//                                     <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                                 </div>

//                                 <div className='prds-filter-tag-results-container'>
//                                     <ul>
//                                         {brazosData['modelos-de-colchones'].map((item, index) => {
//                                             const isActive = activeFilters.modelo === item['modelo-de-colchón'];
//                                             return (
//                                                 <li key={index}>
//                                                     <button 
//                                                         type='button'
//                                                         className={isActive ? 'active' : ''}
//                                                         onClick={() => toggleFiltro('modelo', isActive ? null : item['modelo-de-colchón'])}
//                                                     >
//                                                         <span></span>
//                                                         <p>{item['modelo-de-colchón']}</p>
//                                                     </button>
//                                                 </li>
//                                             );
//                                         })}
//                                     </ul>
//                                 </div>
//                             </div>
//                         );
//                     }
//                 }
//             }
//         } 
//         // Si NO hay jerarquía de cabecera, mostrar modelos directamente desde marca
//         else if (!activeFilters.tipoCabecera && marcaData['modelos-de-colchones'] && marcaData['modelos-de-colchones'].length > 0) {
//             elementos.push(
//                 <div className={`prds-filter-tag ${activeFilters.modelo ? 'active' : ''}`} key="modelo">
//                     <div 
//                         className='prds-filter-title-container'
//                         onClick={(e) => {
//                             const parent = e.currentTarget.closest('.prds-filter-tag');
//                             parent?.classList.toggle('active');
//                         }}
//                     >
//                         <p className='prds-filter-title'>Modelo</p>
//                         <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                     </div>

//                     <div className='prds-filter-tag-results-container'>
//                         <ul>
//                             {marcaData['modelos-de-colchones'].map((item, index) => {
//                                 const isActive = activeFilters.modelo === item['modelo-de-colchón'];
//                                 return (
//                                     <li key={index}>
//                                         <button 
//                                             type='button'
//                                             className={isActive ? 'active' : ''}
//                                             onClick={() => toggleFiltro('modelo', isActive ? null : item['modelo-de-colchón'])}
//                                         >
//                                             <span></span>
//                                             <p>{item['modelo-de-colchón']}</p>
//                                         </button>
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     </div>
//                 </div>
//             );
//         }

//         // 5. Base encajonada (siempre visible después de marca)
//         if (marcaData['base-encajonada'] && marcaData['base-encajonada'].length > 0) {
//             elementos.push(
//                 <div className={`prds-filter-tag ${activeFilters.baseEncajonada ? 'active' : ''}`} key="baseEncajonada">
//                     <div 
//                         className='prds-filter-title-container'
//                         onClick={(e) => {
//                             const parent = e.currentTarget.closest('.prds-filter-tag');
//                             parent?.classList.toggle('active');
//                         }}
//                     >
//                         <p className='prds-filter-title'>Base encajonada</p>
//                         <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                     </div>

//                     <div className='prds-filter-tag-results-container'>
//                         <ul>
//                             {marcaData['base-encajonada'].map((item, index) => {
//                                 const isActive = activeFilters.baseEncajonada === item['base-encajonada'];
//                                 return (
//                                     <li key={index}>
//                                         <button 
//                                             type='button'
//                                             className={isActive ? 'active' : ''}
//                                             onClick={() => toggleFiltro('base-encajonada', isActive ? null : item['base-encajonada'])}
//                                         >
//                                             <span></span>
//                                             <p>{item['base-encajonada']}</p>
//                                         </button>
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     </div>
//                 </div>
//             );
//         }

//         // 6. Cajones (solo si hay base encajonada seleccionada)
//         if (activeFilters.baseEncajonada && marcaData['base-encajonada']) {
//             const baseData = marcaData['base-encajonada'].find(
//                 b => b['base-encajonada'] === activeFilters.baseEncajonada
//             );
            
//             if (baseData && baseData['cajones'] && baseData['cajones'].length > 0) {
//                 elementos.push(
//                     <div className={`prds-filter-tag ${activeFilters.cajones ? 'active' : ''}`} key="cajones">
//                         <div 
//                             className='prds-filter-title-container'
//                             onClick={(e) => {
//                                 const parent = e.currentTarget.closest('.prds-filter-tag');
//                                 parent?.classList.toggle('active');
//                             }}
//                         >
//                             <p className='prds-filter-title'>Cajones</p>
//                             <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                         </div>

//                         <div className='prds-filter-tag-results-container'>
//                             <ul>
//                                 {baseData['cajones'].map((item, index) => {
//                                     const isActive = activeFilters.cajones === item['cajones'];
//                                     return (
//                                         <li key={index}>
//                                             <button 
//                                                 type='button'
//                                                 className={isActive ? 'active' : ''}
//                                                 onClick={() => toggleFiltro('cajones', isActive ? null : item['cajones'])}
//                                             >
//                                                 <span></span>
//                                                 <p>{item['cajones']}</p>
//                                             </button>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
//                         </div>
//                     </div>
//                 );
//             }
//         }

//         // 7. Con Baúl (solo si hay cajones seleccionado)
//         if (activeFilters.baseEncajonada && activeFilters.cajones && marcaData['base-encajonada']) {
//             const baseData = marcaData['base-encajonada'].find(
//                 b => b['base-encajonada'] === activeFilters.baseEncajonada
//             );
            
//             if (baseData && baseData['cajones']) {
//                 const cajonesData = baseData['cajones'].find(
//                     c => c['cajones'] === activeFilters.cajones
//                 );
                
//                 if (cajonesData && cajonesData['con-baul'] && cajonesData['con-baul'].length > 0) {
//                     elementos.push(
//                         <div className={`prds-filter-tag ${activeFilters.conBaul ? 'active' : ''}`} key="conBaul">
//                             <div 
//                                 className='prds-filter-title-container'
//                                 onClick={(e) => {
//                                     const parent = e.currentTarget.closest('.prds-filter-tag');
//                                     parent?.classList.toggle('active');
//                                 }}
//                             >
//                                 <p className='prds-filter-title'>Con baúl</p>
//                                 <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                             </div>

//                             <div className='prds-filter-tag-results-container'>
//                                 <ul>
//                                     {cajonesData['con-baul'].map((item, index) => {
//                                         const isActive = activeFilters.conBaul === item['con-baul'];
//                                         return (
//                                             <li key={index}>
//                                                 <button 
//                                                     type='button'
//                                                     className={isActive ? 'active' : ''}
//                                                     onClick={() => toggleFiltro('con-baul', isActive ? null : item['con-baul'])}
//                                                 >
//                                                     <span></span>
//                                                     <p>{item['con-baul']}</p>
//                                                 </button>
//                                             </li>
//                                         );
//                                     })}
//                                 </ul>
//                             </div>
//                         </div>
//                     );
//                 }
//             }
//         }

//         // 8. Con Piecera (solo si hay base encajonada seleccionada)
//         if (activeFilters.baseEncajonada && marcaData['base-encajonada']) {
//             const baseData = marcaData['base-encajonada'].find(
//                 b => b['base-encajonada'] === activeFilters.baseEncajonada
//             );
            
//             if (baseData && baseData['con-piecera'] && baseData['con-piecera'].length > 0) {
//                 elementos.push(
//                     <div className={`prds-filter-tag ${activeFilters.conPiecera ? 'active' : ''}`} key="conPiecera">
//                         <div 
//                             className='prds-filter-title-container'
//                             onClick={(e) => {
//                                 const parent = e.currentTarget.closest('.prds-filter-tag');
//                                 parent?.classList.toggle('active');
//                             }}
//                         >
//                             <p className='prds-filter-title'>Con piecera</p>
//                             <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                         </div>

//                         <div className='prds-filter-tag-results-container'>
//                             <ul>
//                                 {baseData['con-piecera'].map((item, index) => {
//                                     const isActive = activeFilters.conPiecera === item['con-piecera'];
//                                     return (
//                                         <li key={index}>
//                                             <button 
//                                                 type='button'
//                                                 className={isActive ? 'active' : ''}
//                                                 onClick={() => toggleFiltro('con-piecera', isActive ? null : item['con-piecera'])}
//                                             >
//                                                 <span></span>
//                                                 <p>{item['con-piecera']}</p>
//                                             </button>
//                                         </li>
//                                     );
//                                 })}
//                             </ul>
//                         </div>
//                     </div>
//                 );
//             }
//         }

//         // 9. Línea (siempre visible después de marca)
//         if (marcaData['línea'] && marcaData['línea'].length > 0) {
//             elementos.push(
//                 <div className={`prds-filter-tag ${activeFilters.linea ? 'active' : ''}`} key="linea">
//                     <div 
//                         className='prds-filter-title-container'
//                         onClick={(e) => {
//                             const parent = e.currentTarget.closest('.prds-filter-tag');
//                             parent?.classList.toggle('active');
//                         }}
//                     >
//                         <p className='prds-filter-title'>Línea</p>
//                         <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                     </div>

//                     <div className='prds-filter-tag-results-container'>
//                         <ul>
//                             {marcaData['línea'].map((item, index) => {
//                                 const isActive = activeFilters.linea === item['línea'];
//                                 return (
//                                     <li key={index}>
//                                         <button 
//                                             type='button'
//                                             className={isActive ? 'active' : ''}
//                                             onClick={() => toggleFiltro('linea', isActive ? null : item['línea'])}
//                                         >
//                                             <span></span>
//                                             <p>{item['línea']}</p>
//                                         </button>
//                                     </li>
//                                 );
//                             })}
//                         </ul>
//                     </div>
//                 </div>
//             );
//         }

//         return elementos.length > 0 ? elementos : null;
//     };

//     return(
//         <>
//             <Helmet>
//                 <title>Dormitorios | Dormihogar</title>
//                 <meta name='description' content='En dormihogar contamos con una gran variedad en dormitorios. Contamos con las mejores marcas del mercado.' />
//             </Helmet>

//             <main className='products-page-main d-flex-column gap-10'>
//                 <div className='products-page-blocks'>
//                     <img src='/assets/imagenes/productos/dormitorios/cat-banner.png' className='h-cat-banner' alt=''/>

//                     <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
//                         <div className='products-page-filters-container-global'>
//                             <div className='d-flex-column gap-20-to-10'>
//                                 <div className='hp-cat-title'>
//                                     <h1>Dormitorios</h1>
//                                     <p className='text'>Encuentra el dormitorio ideal para tu descanso, en las mejores marcas del mercado</p>
//                                 </div>

//                                 <BtnGeneral 
//                                     onEnvioGratisChange={handleEnvioGratis}
//                                     onFiltroSkusChange={handleFiltroSkus}
//                                     envioGratisActivo={envioGratisActivo}
//                                     currentPage={currentPage}
//                                     setCurrentPage={setCurrentPage}
//                                     resetFilters={resetFiltersTrigger}
//                                 />

//                                 <div className='d-flex-column gap-20'>
//                                     <div className='d-flex-center-left gap-5'>
//                                         <span className="material-symbols-outlined">filter_alt</span>
//                                         <p className='text title'>Filtros</p>
//                                         {(activeFilters.tamaño || activeFilters.marca || activeFilters.tipoCabecera || 
//                                           activeFilters.diseñoCabecera || activeFilters.brazosCabecera || activeFilters.modelo ||
//                                           activeFilters.baseEncajonada || activeFilters.cajones || activeFilters.conBaul ||
//                                           activeFilters.conPiecera || activeFilters.linea ||
//                                           filtroSkus || envioGratisActivo) && (
//                                             <button 
//                                                 type="button" 
//                                                 className="limpiar-filtros-btn" 
//                                                 onClick={limpiarFiltros}
//                                                 style={{ marginLeft: '10px', fontSize: '12px', color: 'var(--color-1)' }}
//                                             >
//                                                 Limpiar filtros
//                                             </button>
//                                         )}
//                                     </div>

//                                     <div className='prds-filters-container'>
//                                         {renderTamañosFilters()}
//                                         {renderMarcaFilters()}
//                                         {renderFiltrosJerarquicos()}
//                                     </div>
//                                 </div>

//                                 <a href='/' title='Promo del mes | Dormihogar' className='d-flex w-100 border-r-6 overflow-hidden'>
//                                     <img className='d-flex w-100' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__S5c-OF91SI1JrkskfFo5_DXbueZkXzbz4OTtzUN_nMO5DCp2F-11GMj&s=10' alt=''/>
//                                 </a>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='products-page-right'>
//                         <FiltrosTop 
//                             setOrden={setOrden} 
//                             orden={orden} 
//                             toggleFiltro={toggleFiltro} 
//                             isFiltroActivo={isFiltroActivo} 
//                             setIsFiltersOpen={setIsFiltersOpen} 
//                             isFiltersOpen={isFiltersOpen} 
//                             productosCount={productosOrdenados.length}
//                             totalProductos={productos.length} 
//                             currentPage={currentPage}
//                             totalPages={totalPages}
//                             onPageChange={handlePageChange}
//                             onPreviousPage={handlePreviousPage}
//                             onNextPage={handleNextPage}
//                             getVisiblePages={getVisiblePages}
//                         />

//                         <div className='products-page-products-container'>
//                             {loading ? (
//                                 <div className="loading-products d-flex-center-center d-flex-column gap-10">
//                                     <div className="spinner"></div>
//                                     <p>Cargando productos...</p>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <ul className="products-page-products">
//                                         {productosPagina.length === 0 ? (
//                                             <div className='d-grid-1-1'>
//                                                 <div className="d-flex-column gap-10">
//                                                     <p className='text'>No se encontraron productos con los filtros seleccionados.</p>

//                                                     {(Object.values(activeFilters).some(v => v !== null) || filtroSkus || envioGratisActivo) && (
//                                                         <button type="button" className="margin-right button-link button-link-2" onClick={limpiarFiltros}>
//                                                             <span className="material-icons">delete</span>
//                                                             <p className='button-link-text'>Limpiar filtros</p>
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             productosPagina.map(producto => (
//                                                 <Producto key={producto.sku} producto={producto} />
//                                             ))
//                                         )}
//                                     </ul>

//                                     {productosPagina.length > 0 && totalPages > 1 && (
//                                         <div className='pagination-container'>
//                                             <button type='button' className='pagination-arrow' onClick={handlePreviousPage} disabled={currentPage === 1}>
//                                                 <span className="material-symbols-outlined">chevron_left</span>
//                                                 <p>Anterior</p>
//                                             </button>

//                                             <ul className='pagination-list'>
//                                                 {getVisiblePages().map((page, index) => 
//                                                     typeof page === 'number' ? (
//                                                         <li key={index}>
//                                                             <button 
//                                                                 type='button'
//                                                                 className={`pagination-page ${currentPage === page ? 'active' : ''}`}
//                                                                 onClick={() => handlePageChange(page)}
//                                                             >
//                                                                 <p>{page}</p>
//                                                             </button>
//                                                         </li>
//                                                     ) : (
//                                                         <li key={index}>
//                                                             <div className='dots'>
//                                                                 <span>...</span>
//                                                             </div>
//                                                         </li>
//                                                     )
//                                                 )}
//                                             </ul>

//                                             <button type='button' className='pagination-arrow' onClick={handleNextPage} disabled={currentPage === totalPages}>
//                                                 <p>Siguiente</p>
//                                                 <span className="material-symbols-outlined">chevron_right</span>
//                                             </button>
//                                         </div>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </main>

//             <div className={`filters-layout ${isFiltersOpen ? 'active' : ''}`} onClick={closeFilters}></div>
//         </>
//     );
// }

// export default Dormitorios;

import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

import Categorias from '../Componentes/Categorias/Categorias';
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

function Dormitorios() {
    const { sub1, sub2, sub3, sub4 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [orden, setOrden] = useState("ultimo");
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const itemsPerPage = 20;

    const [activeFilters, setActiveFilters] = useState({
        tamaño: null,
        marca: null,
        linea: null,
        cajon: null,
        resorte: null,
        lineaColchon: null,
        nivelConfort: null,
        modelo: null
    });

    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [filtroSkus, setFiltroSkus] = useState(null);
    const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    const filterParamMap = {
        'tamaño': 'tamaño',
        'marca': 'marca',
        'linea': 'linea',
        'cajon': 'cajon',
        'resorte': 'resorte',
        'linea-colchon': 'lineaColchon',
        'nivel-confort': 'nivelConfort',
        'modelo': 'modelo'
    };

    const paramMap = {
        tamaño: 'tamaño',
        marca: 'marca',
        linea: 'linea',
        cajon: 'cajon',
        resorte: 'resorte',
        lineaColchon: 'linea-colchon',
        nivelConfort: 'nivel-confort',
        modelo: 'modelo'
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const newActiveFilters = { ...activeFilters };
        let hasChanges = false;

        Object.entries(filterParamMap).forEach(([paramKey, stateKey]) => {
            const value = params.get(paramKey);
            if (value !== null) {
                newActiveFilters[stateKey] = value;
                hasChanges = true;
            } else if (newActiveFilters[stateKey] !== null) {
                newActiveFilters[stateKey] = null;
                hasChanges = true;
            }
        });

        if (hasChanges) {
            setActiveFilters(newActiveFilters);
        }
    }, [location.search]);

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
        const cargarProductosDormitorios = async () => {
            try {
                setLoading(true);

                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/dormitorios/')
                );

                if (sub1) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/dormitorios/${sub1}/`)
                    );
                }

                if (sub2) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/dormitorios/${sub1}/${sub2}/`)
                    );
                }

                if (sub3) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/dormitorios/${sub1}/${sub2}/${sub3}/`)
                    );
                }

                if (sub4) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/dormitorios/${sub1}/${sub2}/${sub3}/${sub4}.json`)
                    );
                }

                const productosPromesas = archivosProductos.map(async (url) => {
                    const response = await fetch(url);
                    const data = await response.json();

                    const productosConFicha = data.productos?.map(producto => ({
                        ...producto,
                        fichaTecnica: data.ficha?.[0] || {}
                    })) || [];
                    
                    return productosConFicha;
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de dormitorios:", error);
                setLoading(false);
            }
        };

        cargarProductosDormitorios();
    }, [sub1, sub2, sub3, sub4]);

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/dormitorios/filtros.json');
                const data = await response.json();
                setFiltrosData(data);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, []);

    const getProductValue = (product, fieldName) => {
        if (!product) return null;

        const variants = new Set();

        variants.add(fieldName);
        variants.add(fieldName.toLowerCase());
        variants.add(fieldName.toUpperCase());
        variants.add(fieldName.replace(/-/g, ' '));
        variants.add(fieldName.replace(/ /g, '-'));
        variants.add(fieldName.replace(/ /g, '_'));

        if (fieldName.endsWith('ón')) {
            variants.add(fieldName.slice(0, -1) + 'es');
        } else if (fieldName.endsWith('or')) {
            variants.add(fieldName + 's');
            variants.add(fieldName.toLowerCase() + 's');
        } else if (fieldName.endsWith('e')) {
            variants.add(fieldName.slice(0, -1) + 'as');
            variants.add(fieldName.toLowerCase().slice(0, -1) + 'as');
        } else if (fieldName.endsWith('a') || fieldName.endsWith('o')) {
            variants.add(fieldName + 's');
            variants.add(fieldName.toLowerCase() + 's');
        } else if (fieldName.endsWith('l')) {
            variants.add(fieldName + 'es');
            variants.add(fieldName.toLowerCase() + 'es');
        } else {
            variants.add(fieldName + 's');
            variants.add(fieldName.toLowerCase() + 's');
        }

        const newVariants = new Set(variants);
        variants.forEach(v => {
            newVariants.add(v.replace(/ /g, '-'));
            newVariants.add(v.replace(/-/g, ' '));
        });

        const fieldMappings = {
            'linea': ['línea', 'linea'],
            'cajon': ['cajón', 'cajon', 'cajones', 'cajones-de-colchón', 'cajon-de-colchón'],
            'resorte': ['resorte', 'resortes', 'tipo-de-resorte', 'tipo-resorte', 'tipo-de-resortes', 'tipo-resortes'],
            'lineaColchon': ['línea-de-colchón', 'linea-colchon', 'linea-colchón', 'línea-de-colchones', 'linea-colchones', 'línea', 'linea'],
            'nivelConfort': ['nivel-de-confort', 'nivel-confort', 'nivel-de-confortes', 'nivel-confortes', 'nivel'],
            'modelo': ['modelo', 'modelos', 'modelo-de-colchón', 'modelo-de-colchones']
        };

        let keysToSearch = new Set();

        if (fieldMappings[fieldName]) {
            fieldMappings[fieldName].forEach(key => keysToSearch.add(key));
        } else {
            newVariants.forEach(v => keysToSearch.add(v));
        }

        for (const key of keysToSearch) {
            if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
                const value = product[key];
                return typeof value === 'string' ? value : String(value);
            }
        }

        if (product['detalles-del-producto'] && product['detalles-del-producto'].length > 0) {
            const detalles = product['detalles-del-producto'][0];
            for (const key of keysToSearch) {
                if (detalles[key] !== undefined && detalles[key] !== null && detalles[key] !== '') {
                    const value = detalles[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        if (product.fichaTecnica) {
            for (const key of keysToSearch) {
                if (product.fichaTecnica[key] !== undefined && product.fichaTecnica[key] !== null && product.fichaTecnica[key] !== '') {
                    const value = product.fichaTecnica[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        for (const key of Object.keys(product)) {
            const keyLower = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            for (const searchKey of keysToSearch) {
                const searchLower = searchKey.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (keyLower === searchLower || keyLower.includes(searchLower) || searchLower.includes(keyLower)) {
                    if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
                        const value = product[key];
                        return typeof value === 'string' ? value : String(value);
                    }
                }
            }
        }

        return null;
    };

    const updateURL = (filterType, value) => {
        const params = new URLSearchParams(location.search);

        const paramName = paramMap[filterType] || filterType;

        if (value === null || value === undefined) {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        // Limpiar filtros dependientes jerárquicamente
        const hierarchy = {
            'marca': ['linea', 'cajon', 'resorte', 'lineaColchon', 'nivelConfort', 'modelo'],
            'linea': ['cajon', 'resorte', 'lineaColchon', 'nivelConfort', 'modelo'],
            'cajon': ['resorte', 'lineaColchon', 'nivelConfort', 'modelo'],
            'resorte': ['lineaColchon', 'nivelConfort', 'modelo'],
            'lineaColchon': ['nivelConfort', 'modelo'],
            'nivelConfort': ['modelo']
        };

        if (hierarchy[filterType]) {
            hierarchy[filterType].forEach(dependent => {
                params.delete(paramMap[dependent] || dependent);
            });
        }

        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
    };

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            // Si es marca, limpiar todos los filtros jerárquicos
            if (filterType === 'marca') {
                newFilters.marca = value;
                newFilters.linea = null;
                newFilters.cajon = null;
                newFilters.resorte = null;
                newFilters.lineaColchon = null;
                newFilters.nivelConfort = null;
                newFilters.modelo = null;
                
                const params = new URLSearchParams(location.search);
                ['linea', 'cajon', 'resorte', 'linea-colchon', 'nivel-confort', 'modelo'].forEach(key => {
                    params.delete(key);
                });

                if (value === null) {
                    params.delete('marca');
                } else {
                    params.set('marca', value);
                }
                
                const newSearch = params.toString();
                const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
                navigate(newPath, { replace: true });
                
                return newFilters;
            }

            // Para otros filtros, mantener la lógica jerárquica
            if (filterType === 'linea') {
                if (value === null) {
                    newFilters.linea = null;
                    newFilters.cajon = null;
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.linea = value;
                    newFilters.cajon = null;
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'cajon') {
                if (value === null) {
                    newFilters.cajon = null;
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.cajon = value;
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'resorte') {
                if (value === null) {
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.resorte = value;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'lineaColchon') {
                if (value === null) {
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.lineaColchon = value;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'nivelConfort') {
                if (value === null) {
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.nivelConfort = value;
                    newFilters.modelo = null;
                }
            } else {
                if (value === null) {
                    newFilters[filterType] = null;
                } else {
                    newFilters[filterType] = value;
                }
            }
            
            const filterToUpdate = value === null ? filterType : filterType;
            updateURL(filterToUpdate, value);
            
            return newFilters;
        });
    };

    const handleFiltroSkus = (skus) => {
        setFiltroSkus(skus);
    };

    const handleEnvioGratis = (activo) => {
        setEnvioGratisActivo(activo);
    };

    const isFiltroActivo = (nombreFiltro, valor) => {
        const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
        return activeFilters[stateKey] === valor;
    };

    const toggleFiltro = (nombreFiltro, valor) => {
        const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
        const isActive = activeFilters[stateKey] === valor;
        handleFilterChange(stateKey, isActive ? null : valor);
    };

    const productosFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        const filtrados = productos.filter(producto => {
            let cumpleTodosLosFiltros = true;

            if (envioGratisActivo) {
                if (producto["tipo-de-envio"] !== "Gratis") {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && filtroSkus && Array.isArray(filtroSkus) && filtroSkus.length > 0) {
                if (!filtroSkus.includes(producto.sku)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros) {
                if (activeFilters.tamaño) {
                    const tamañoProducto = getProductValue(producto, 'tamaño');
                    const tamañoNormalizado = normalizarTexto(tamañoProducto);
                    if (tamañoNormalizado !== normalizarTexto(activeFilters.tamaño)) {
                        cumpleTodosLosFiltros = false;
                    }
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.marca) {
                const marcaProducto = getProductValue(producto, 'marca');
                if (!marcaProducto || normalizarTexto(marcaProducto) !== normalizarTexto(activeFilters.marca)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.linea) {
                const lineaProducto = getProductValue(producto, 'linea');
                if (!lineaProducto || normalizarTexto(lineaProducto) !== normalizarTexto(activeFilters.linea)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.cajon) {
                const cajonProducto = getProductValue(producto, 'cajon');
                if (!cajonProducto || normalizarTexto(cajonProducto) !== normalizarTexto(activeFilters.cajon)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.resorte) {
                const resorteProducto = getProductValue(producto, 'resorte');
                if (!resorteProducto || normalizarTexto(resorteProducto) !== normalizarTexto(activeFilters.resorte)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.lineaColchon) {
                const lineaColchonProducto = getProductValue(producto, 'lineaColchon');
                if (!lineaColchonProducto || normalizarTexto(lineaColchonProducto) !== normalizarTexto(activeFilters.lineaColchon)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.nivelConfort) {
                const nivelProducto = getProductValue(producto, 'nivelConfort');
                if (!nivelProducto || normalizarTexto(nivelProducto) !== normalizarTexto(activeFilters.nivelConfort)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.modelo) {
                const modeloProducto = getProductValue(producto, 'modelo');
                if (!modeloProducto || normalizarTexto(modeloProducto) !== normalizarTexto(activeFilters.modelo)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            return cumpleTodosLosFiltros;
        });

        return filtrados;
    }, [productos, activeFilters, envioGratisActivo, filtroSkus]);

    const productosOrdenados = useMemo(() => {
        return [...productosFiltrados].sort((a, b) => {
            if (orden === "menor-mayor") {
                return a.precioVenta - b.precioVenta;
            } else if (orden === "mayor-menor") {
                return b.precioVenta - a.precioVenta;
            }
            return 0;
        });
    }, [productosFiltrados, orden]);

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
    }, [activeFilters, envioGratisActivo, filtroSkus, orden]);

    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    const limpiarFiltros = () => {
        setActiveFilters({
            tamaño: null,
            marca: null,
            linea: null,
            cajon: null,
            resorte: null,
            lineaColchon: null,
            nivelConfort: null,
            modelo: null
        });
        
        setFiltroSkus(null);
        setEnvioGratisActivo(false);
        resetPage();
        
        navigate(location.pathname);
        
        setResetFiltersTrigger(true);
        setTimeout(() => {
            setResetFiltersTrigger(false);
        }, 100);
    };

    const renderTamañosFilters = () => {
        if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        const tamaños = filtrosData.filtros[0].tamaño;

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
                    <p className='prds-filter-title'>Tamaños</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {tamaños.map((item, index) => {
                            const finalUrl = item.ruta;
                            const currentPathNormalized = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
                            const linkPathNormalized = finalUrl.endsWith('/') ? finalUrl.slice(0, -1) : finalUrl;
                            const isActive = currentPathNormalized === linkPathNormalized;
                            
                            return (
                                <li key={index}>
                                    <Link 
                                        to={finalUrl}
                                        className={isActive ? 'active' : ''}
                                        title={`Ver productos tamaño ${item.tamaño}`}
                                    >
                                        <span></span>
                                        <p>{item.tamaño}</p>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    const renderMarcaFilters = () => {
        if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        
        const tamañoActual = sub1 || activeFilters.tamaño || null;
        
        if (!tamañoActual) {
            const todasLasMarcas = new Set();
            const tamaños = filtrosData.filtros[0].tamaño;
            
            tamaños.forEach(tamaño => {
                if (tamaño.marcas && Array.isArray(tamaño.marcas)) {
                    tamaño.marcas.forEach(marcaItem => {
                        if (marcaItem.marca) {
                            todasLasMarcas.add(marcaItem.marca);
                        }
                    });
                }
            });
            
            const marcasUnicas = Array.from(todasLasMarcas);
            if (marcasUnicas.length === 0) return null;

            return (
                <div className={`prds-filter-tag ${activeFilters.marca ? 'active' : ''}`}>
                    <div 
                        className='prds-filter-title-container'
                        onClick={() => {
                            const tag = document.querySelectorAll('.prds-filter-tag')[1];
                            tag?.classList.toggle('active');
                        }}
                    >
                        <p className='prds-filter-title'>Marca</p>
                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>

                    <div className='prds-filter-tag-results-container'>
                        <ul>
                            {marcasUnicas.map((marca, index) => {
                                const isActive = activeFilters.marca === marca;
                                return (
                                    <li key={index}>
                                        <button 
                                            type='button'
                                            className={isActive ? 'active' : ''}
                                            onClick={() => toggleFiltro('marca', isActive ? null : marca)}
                                        >
                                            <span></span>
                                            <p>{marca}</p>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            );
        }
        
        const tamañoData = filtrosData.filtros[0].tamaño.find(
            t => normalizarTexto(t.tamaño) === normalizarTexto(tamañoActual)
        );
        
        if (!tamañoData || !tamañoData.marcas || tamañoData.marcas.length === 0) {
            return null;
        }
        
        const marcasDisponibles = tamañoData.marcas.map(m => m.marca);
        
        return (
            <div className={`prds-filter-tag ${activeFilters.marca ? 'active' : ''}`}>
                <div 
                    className='prds-filter-title-container'
                    onClick={() => {
                        const tag = document.querySelectorAll('.prds-filter-tag')[1];
                        tag?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>Marca</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {marcasDisponibles.map((marca, index) => {
                            const isActive = activeFilters.marca === marca;
                            return (
                                <li key={index}>
                                    <button 
                                        type='button'
                                        className={isActive ? 'active' : ''}
                                        onClick={() => toggleFiltro('marca', isActive ? null : marca)}
                                    >
                                        <span></span>
                                        <p>{marca}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    const renderFiltrosJerarquicos = () => {
        if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        
        // Si no hay marca seleccionada, NO mostrar nada
        if (!activeFilters.marca) return null;
        
        // Buscar la marca en TODOS los tamaños
        const tamaños = filtrosData.filtros[0].tamaño;
        let marcaData = null;
        
        for (const tamaño of tamaños) {
            if (tamaño.marcas && Array.isArray(tamaño.marcas)) {
                const encontrado = tamaño.marcas.find(m => m.marca === activeFilters.marca);
                if (encontrado) {
                    marcaData = encontrado;
                    break;
                }
            }
        }
        
        if (!marcaData) return null;

        const elementos = [];

        // 1. Línea
        if (marcaData.líneas && marcaData.líneas.length > 0) {
            elementos.push(
                <div className={`prds-filter-tag ${activeFilters.linea ? 'active' : ''}`} key="linea">
                    <div 
                        className='prds-filter-title-container'
                        onClick={(e) => {
                            const parent = e.currentTarget.closest('.prds-filter-tag');
                            parent?.classList.toggle('active');
                        }}
                    >
                        <p className='prds-filter-title'>Línea</p>
                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>

                    <div className='prds-filter-tag-results-container'>
                        <ul>
                            {marcaData.líneas.map((item, index) => {
                                const isActive = activeFilters.linea === item.línea;
                                return (
                                    <li key={index}>
                                        <button 
                                            type='button'
                                            className={isActive ? 'active' : ''}
                                            onClick={() => toggleFiltro('linea', isActive ? null : item.línea)}
                                        >
                                            <span></span>
                                            <p>{item.línea}</p>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            );
        }

        // 2. Cajón (solo si hay línea seleccionada)
        if (activeFilters.linea && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones && lineaData.cajones.length > 0) {
                elementos.push(
                    <div className={`prds-filter-tag ${activeFilters.cajon ? 'active' : ''}`} key="cajon">
                        <div 
                            className='prds-filter-title-container'
                            onClick={(e) => {
                                const parent = e.currentTarget.closest('.prds-filter-tag');
                                parent?.classList.toggle('active');
                            }}
                        >
                            <p className='prds-filter-title'>Cajón</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </div>

                        <div className='prds-filter-tag-results-container'>
                            <ul>
                                {lineaData.cajones.map((item, index) => {
                                    const isActive = activeFilters.cajon === item.cajón;
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button'
                                                className={isActive ? 'active' : ''}
                                                onClick={() => toggleFiltro('cajon', isActive ? null : item.cajón)}
                                            >
                                                <span></span>
                                                <p>{item.cajón}</p>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                );
            }
        }

        // 3. Resortes (solo si hay cajón seleccionado)
        if (activeFilters.linea && activeFilters.cajon && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones) {
                const cajonData = lineaData.cajones.find(c => c.cajón === activeFilters.cajon);
                
                if (cajonData && cajonData.resortes && cajonData.resortes.length > 0) {
                    elementos.push(
                        <div className={`prds-filter-tag ${activeFilters.resorte ? 'active' : ''}`} key="resorte">
                            <div 
                                className='prds-filter-title-container'
                                onClick={(e) => {
                                    const parent = e.currentTarget.closest('.prds-filter-tag');
                                    parent?.classList.toggle('active');
                                }}
                            >
                                <p className='prds-filter-title'>Tipo de resorte</p>
                                <span className="material-symbols-outlined">keyboard_arrow_down</span>
                            </div>

                            <div className='prds-filter-tag-results-container'>
                                <ul>
                                    {cajonData.resortes.map((item, index) => {
                                        const isActive = activeFilters.resorte === item.resorte;
                                        return (
                                            <li key={index}>
                                                <button 
                                                    type='button'
                                                    className={isActive ? 'active' : ''}
                                                    onClick={() => toggleFiltro('resorte', isActive ? null : item.resorte)}
                                                >
                                                    <span></span>
                                                    <p>{item.resorte}</p>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    );
                }
            }
        }

        // 4. Líneas de colchón (solo si hay resorte seleccionado)
        if (activeFilters.linea && activeFilters.cajon && activeFilters.resorte && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones) {
                const cajonData = lineaData.cajones.find(c => c.cajón === activeFilters.cajon);
                
                if (cajonData && cajonData.resortes) {
                    const resorteData = cajonData.resortes.find(r => r.resorte === activeFilters.resorte);
                    
                    if (resorteData && resorteData['líneas-de-colchones'] && resorteData['líneas-de-colchones'].length > 0) {
                        elementos.push(
                            <div className={`prds-filter-tag ${activeFilters.lineaColchon ? 'active' : ''}`} key="lineaColchon">
                                <div 
                                    className='prds-filter-title-container'
                                    onClick={(e) => {
                                        const parent = e.currentTarget.closest('.prds-filter-tag');
                                        parent?.classList.toggle('active');
                                    }}
                                >
                                    <p className='prds-filter-title'>Línea de colchón</p>
                                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                                </div>

                                <div className='prds-filter-tag-results-container'>
                                    <ul>
                                        {resorteData['líneas-de-colchones'].map((item, index) => {
                                            const isActive = activeFilters.lineaColchon === item['línea-de-colchón'];
                                            return (
                                                <li key={index}>
                                                    <button 
                                                        type='button'
                                                        className={isActive ? 'active' : ''}
                                                        onClick={() => toggleFiltro('linea-colchon', isActive ? null : item['línea-de-colchón'])}
                                                    >
                                                        <span></span>
                                                        <p>{item['línea-de-colchón']}</p>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        );
                    }
                }
            }
        }

        // 5. Niveles de confort (solo si hay línea de colchón seleccionada)
        if (activeFilters.linea && activeFilters.cajon && activeFilters.resorte && activeFilters.lineaColchon && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones) {
                const cajonData = lineaData.cajones.find(c => c.cajón === activeFilters.cajon);
                
                if (cajonData && cajonData.resortes) {
                    const resorteData = cajonData.resortes.find(r => r.resorte === activeFilters.resorte);
                    
                    if (resorteData && resorteData['líneas-de-colchones']) {
                        const lineaColchonData = resorteData['líneas-de-colchones'].find(
                            lc => lc['línea-de-colchón'] === activeFilters.lineaColchon
                        );
                        
                        if (lineaColchonData && lineaColchonData['niveles-de-confort'] && lineaColchonData['niveles-de-confort'].length > 0) {
                            elementos.push(
                                <div className={`prds-filter-tag ${activeFilters.nivelConfort ? 'active' : ''}`} key="nivelConfort">
                                    <div 
                                        className='prds-filter-title-container'
                                        onClick={(e) => {
                                            const parent = e.currentTarget.closest('.prds-filter-tag');
                                            parent?.classList.toggle('active');
                                        }}
                                    >
                                        <p className='prds-filter-title'>Nivel de confort</p>
                                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                                    </div>

                                    <div className='prds-filter-tag-results-container'>
                                        <ul>
                                            {lineaColchonData['niveles-de-confort'].map((item, index) => {
                                                const isActive = activeFilters.nivelConfort === item['nivel-de-confort'];
                                                return (
                                                    <li key={index}>
                                                        <button 
                                                            type='button'
                                                            className={isActive ? 'active' : ''}
                                                            onClick={() => toggleFiltro('nivel-confort', isActive ? null : item['nivel-de-confort'])}
                                                        >
                                                            <span></span>
                                                            <p>{item['nivel-de-confort']}</p>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            );
                        }
                    }
                }
            }
        }

        // 6. Modelos (solo si hay nivel de confort seleccionado)
        if (activeFilters.linea && activeFilters.cajon && activeFilters.resorte && 
            activeFilters.lineaColchon && activeFilters.nivelConfort && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones) {
                const cajonData = lineaData.cajones.find(c => c.cajón === activeFilters.cajon);
                
                if (cajonData && cajonData.resortes) {
                    const resorteData = cajonData.resortes.find(r => r.resorte === activeFilters.resorte);
                    
                    if (resorteData && resorteData['líneas-de-colchones']) {
                        const lineaColchonData = resorteData['líneas-de-colchones'].find(
                            lc => lc['línea-de-colchón'] === activeFilters.lineaColchon
                        );
                        
                        if (lineaColchonData && lineaColchonData['niveles-de-confort']) {
                            const nivelData = lineaColchonData['niveles-de-confort'].find(
                                n => n['nivel-de-confort'] === activeFilters.nivelConfort
                            );
                            
                            if (nivelData && nivelData['modelos-de-colchones'] && nivelData['modelos-de-colchones'].length > 0) {
                                elementos.push(
                                    <div className={`prds-filter-tag ${activeFilters.modelo ? 'active' : ''}`} key="modelo">
                                        <div 
                                            className='prds-filter-title-container'
                                            onClick={(e) => {
                                                const parent = e.currentTarget.closest('.prds-filter-tag');
                                                parent?.classList.toggle('active');
                                            }}
                                        >
                                            <p className='prds-filter-title'>Modelo</p>
                                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                                        </div>

                                        <div className='prds-filter-tag-results-container'>
                                            <ul>
                                                {nivelData['modelos-de-colchones'].map((item, index) => {
                                                    const isActive = activeFilters.modelo === item['modelo-de-colchón'];
                                                    return (
                                                        <li key={index}>
                                                            <button 
                                                                type='button'
                                                                className={isActive ? 'active' : ''}
                                                                onClick={() => toggleFiltro('modelo', isActive ? null : item['modelo-de-colchón'])}
                                                            >
                                                                <span></span>
                                                                <p>{item['modelo-de-colchón']}</p>
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            }
                        }
                    }
                }
            }
        }

        return elementos.length > 0 ? elementos : null;
    };

    return(
        <>
            <Helmet>
                <title>Dormitorios | Dormihogar</title>
                <meta name='description' content='En dormihogar contamos con una gran variedad en dormitorios. Contamos con las mejores marcas del mercado.' />
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20-to-10'>
                                <div className='hp-cat-title'>
                                    <h1>Dormitorios</h1>
                                    <p className='text'>Encuentra el dormitorio ideal para tu descanso, en las mejores marcas del mercado</p>
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
                                        {(activeFilters.tamaño || activeFilters.marca || activeFilters.linea || 
                                          activeFilters.cajon || activeFilters.resorte || activeFilters.lineaColchon || 
                                          activeFilters.nivelConfort || activeFilters.modelo ||
                                          filtroSkus || envioGratisActivo) && (
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
                                        {renderTamañosFilters()}
                                        {renderMarcaFilters()}
                                        {renderFiltrosJerarquicos()}
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
                                                    <p className='text'>No se encontraron productos con los filtros seleccionados.</p>

                                                    {(Object.values(activeFilters).some(v => v !== null) || filtroSkus || envioGratisActivo) && (
                                                        <button type="button" className="margin-right button-link button-link-2" onClick={limpiarFiltros}>
                                                            <span className="material-icons">delete</span>
                                                            <p className='button-link-text'>Limpiar filtros</p>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            productosPagina.map(producto => (
                                                <Producto key={producto.sku} producto={producto} />
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

export default Dormitorios;
