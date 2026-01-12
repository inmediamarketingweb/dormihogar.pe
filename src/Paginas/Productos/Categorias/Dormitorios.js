import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

import Categorias from '../Componentes/Categorias/Categorias';
import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';

const baseURL = process.env.PUBLIC_URL || '';

const normalizarTexto = (texto) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w-]/g, '');
};

const filtroKeyMap = {
    "tamaño": "tamaño",
    "marca": "marca",
    "línea": "línea",
    "base-encajonada": "base-encajonada",
    "modelo": "modelo-de-colchón",
    "tipo-de-cabecera": "tipo-de-cabecera",
    "diseño-de-cabecera": "diseño-de-cabecera",
    "brazos-de-cabecera": "brazos-de-cabecera"
};

const fetchWithTimeout = (url, timeout = 8000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    return fetch(url, { signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
};

const normalizarRutaArchivo = (ruta) => {
    return ruta.replace(/\s+/g, '-').replace(/--+/g, '-').trim();
};

function Dormitorios() {
    const { sub1, sub2, sub3, sub4, sub5 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState([]);
    const [orden, setOrden] = useState("ultimo");
    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [errorCarga, setErrorCarga] = useState(null);
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

    const mapaMarcasModelos = {
        "el-cisne": "el-cisne",
        "kamas---el-cisne": "el-cisne",
        "kamas": "kamas",
        "paraiso": "paraiso",
        "kamas---paraiso": "paraiso",
        "komfort": "komfort",
        "kamas---komfort": "komfort",
        "komfort---kamas": "komfort"
    };

    const mapaEquivalenciasMarcas = {
        "el-cisne": ["el-cisne", "kamas---el-cisne"],
        "kamas---el-cisne": ["el-cisne", "kamas---el-cisne"],
        "kamas": ["kamas"],
        "paraiso": ["paraiso", "kamas---paraiso"],
        "kamas---paraiso": ["paraiso", "kamas---paraiso"],
        "komfort": ["komfort", "kamas---komfort", "komfort---kamas"],
        "kamas---komfort": ["komfort", "kamas---komfort", "komfort---kamas"],
        "komfort---kamas": ["komfort", "kamas---komfort", "komfort---kamas"]
    };

    useEffect(() => {
        if (sub5) {
            const rutaProducto = `/productos/dormitorios/${sub1}/${sub2}/${sub3}/${sub4}/${sub5}`;
            navigate(rutaProducto, { replace: true });
        }
    }, [sub5, sub1, sub2, sub3, sub4, navigate]);

    useEffect(() => {
        if (sub5) return;

        const cargarProductosDormitorios = async () => {
            try {
                setLoading(true);
                setErrorCarga(null);

                const manifestUrl = `${baseURL}/assets/json/manifest.json`;                
                const manifestResponse = await fetchWithTimeout(manifestUrl);

                if (!manifestResponse.ok) {
                    throw new Error(`Error HTTP ${manifestResponse.status} al cargar manifest.json`);
                }

                const manifestData = await manifestResponse.json();
                
                if (!manifestData.files || !Array.isArray(manifestData.files)) {
                    throw new Error("Estructura de manifest.json inválida");
                }
                
                let archivosProductos = manifestData.files.filter(url => url.startsWith('/assets/json/categorias/dormitorios/'));
                
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

                const archivosVerificados = [];

                for (const url of archivosProductos) {
                    const normalizadaUrl = normalizarRutaArchivo(url);
                    const fullUrl = `${baseURL}${normalizadaUrl}`;

                    try {
                        const headResponse = await fetch(fullUrl, { method: 'HEAD' });
                        if (headResponse.ok) {
                            archivosVerificados.push(normalizadaUrl);
                        } else {
                            console.warn(`Archivo no encontrado: ${fullUrl} (${headResponse.status})`);
                        }
                    } catch (error) {
                        console.warn(`Error verificando archivo ${fullUrl}:`, error.message);
                    }
                }

                const productosPromesas = archivosVerificados.map(async (url, index) => {
                    await new Promise(resolve => setTimeout(resolve, index * 50));

                    try {
                        const fullUrl = `${baseURL}${url}`;
                        const response = await fetchWithTimeout(fullUrl);

                        if (!response.ok) {
                            console.warn(`Error ${response.status} al cargar ${url}`);
                            return [];
                        }

                        const data = await response.json();
                        return data.productos || [];
                    } catch (error) {
                        if (error.name === 'AbortError') {
                            console.warn(`Timeout al cargar ${url}`);
                        } else {
                            console.error(`Error cargando ${url}:`, error.message);
                        }
                        return [];
                    }
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
            } catch (error) {
                console.error("Error crítico cargando productos:", error);
                setErrorCarga(error.message);
            } finally {
                setLoading(false);
            }
        };

        cargarProductosDormitorios();
    }, [sub1, sub2, sub3, sub4, sub5]);

    useEffect(() => {
        if (sub5) return;

        const cargarFiltros = async () => {
            try {
                const url = `${baseURL}/assets/json/categorias/dormitorios/filtros.json`;
                const response = await fetchWithTimeout(url);

                if (!response.ok) {
                    throw new Error(`Error HTTP ${response.status} al cargar filtros.json`);
                }

                const data = await response.json();
                setFiltros(data.filtros || []);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, [sub5]);

    const marcaSeleccionada = queryParams.get('marca');

    const filtrosFiltrados = useMemo(() => {
        return filtros.map(filtro => {
            const nombreFiltro = Object.keys(filtro)[0];
            const valoresFiltro = filtro[nombreFiltro];

            if (nombreFiltro === "modelos" && marcaSeleccionada) {
                const marcaNormalizada = normalizarTexto(marcaSeleccionada);
                const grupoModelos = mapaMarcasModelos[marcaNormalizada];

                if (grupoModelos) {
                    const modelosFiltrados = valoresFiltro.filter(grupo => {
                        const nombreGrupo = Object.keys(grupo)[0];
                        const grupoNormalizado = normalizarTexto(nombreGrupo);
                        return grupoNormalizado === grupoModelos;
                    });
                    
                    if (modelosFiltrados.length > 0) {
                        return { [nombreFiltro]: modelosFiltrados };
                    }
                }

                return filtro;
            }

            return filtro;
        });
    }, [filtros, marcaSeleccionada]);

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

                    if (paramUrl === "marca" && mapaEquivalenciasMarcas[normalizadoFiltro]) {
                        return mapaEquivalenciasMarcas[normalizadoFiltro].includes(normalizadoProducto);
                    }
                    
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

    const reintentarCarga = () => {
        window.location.reload();
    };

    if (sub5) {
        return null;
    }

    return(
        <>
            <Helmet>
                <title>Dormitorios | Dormihogar</title>
            </Helmet>

            <main className='products-page-main d-flex-column gap-20'>
                <Categorias/>

                <div className='products-page-blocks'>
                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20'>
                                <div className='d-flex-column padding-bottom-20 border-bottom-2-solid-component'>
                                    <p className='block-title color-color-1 uppercase w-100 d-flex'>Dormihogar</p>
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
                                    {filtrosFiltrados.map((filtro, index) => {
                                        const nombreFiltro = Object.keys(filtro)[0];
                                        const valoresFiltro = filtro[nombreFiltro];

                                        if (nombreFiltro === "modelos" && valoresFiltro.length === 0) {
                                            return null;
                                        }

                                        if (nombreFiltro === "tamaño") {
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title uppercase'>Tamaño</p>
                                                    <ul className='products-page-filter-list'>
                                                        {valoresFiltro.map((item, i) => (
                                                            <li key={i}>
                                                                <Link to={item.ruta} className={location.pathname === item.ruta ? "products-page-filter-list-link active" : "products-page-filter-list-link"}>
                                                                    <p>{item.tamaño}</p>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        }

                                        if (nombreFiltro === "modelos") {
                                            return(
                                                <div className='products-page-filter' key={index}>
                                                    <p className='filter-title uppercase'>Modelos</p>
                                                    <div className='filter-subgroups'>
                                                        {valoresFiltro.map((grupo, idx) => {
                                                            const nombreGrupo = Object.keys(grupo)[0];
                                                            const modelos = grupo[nombreGrupo];

                                                            return(
                                                                <div key={idx} className='filter-subgroup'>
                                                                    {(!marcaSeleccionada || valoresFiltro.length > 1) && (
                                                                        <p className='filter-subgroup-title'>{nombreGrupo}</p>
                                                                    )}
                                                                    <ul className='products-page-filter-list'>
                                                                        {modelos.map((modelo, mIdx) => (
                                                                            <li key={mIdx}>
                                                                                <button type='button' className={isFiltroActivo("modelo", modelo) ? "active" : ""} onClick={() => toggleFiltro("modelo", modelo)}>
                                                                                    <p>{modelo}</p>
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
                                                            <button type='button' className={isFiltroActivo(nombreFiltro, valor) ? "active" : ""} onClick={() => toggleFiltro(nombreFiltro, valor)}>
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
                        <FiltrosTop setOrden={setOrden} orden={orden} toggleFiltro={toggleFiltro} isFiltroActivo={isFiltroActivo}
                            setIsFiltersOpen={setIsFiltersOpen} isFiltersOpen={isFiltersOpen} productosCount={productosOrdenados.length}
                            totalProductos={productos.length}
                        />

                        <div className='products-page-products-container'>
                            {errorCarga ? (
                                <div className="error-carga d-flex-center-center d-flex-column gap-20">
                                    <div className="error-icon">
                                        <span className="material-icons" style={{ fontSize: '48px', color: '#ff6b6b' }}>error</span>
                                    </div>
                                    <div className="d-flex-column gap-10 align-center">
                                        <p className='text-bold color-color-1'>Error cargando productos</p>
                                        <p className='text'>{errorCarga}</p>
                                    </div>
                                    <button type="button" className="button-primary" onClick={reintentarCarga}>
                                        <span className="material-icons">refresh</span>
                                        <p>Reintentar</p>
                                    </button>
                                </div>
                            ) : loading ? (
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

export default Dormitorios;
