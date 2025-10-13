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
    "nivel-de-confort": "nivel-de-confort",
    "modelo": "modelo-de-colchón",
    "línea": "línea-de-colchón",
    "resortes": "tipo-de-resorte"
};

function Colchones() {
    const { sub1, sub2, sub3 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState([]);
    const [orden, setOrden] = useState("ultimo");
    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const queryParams = new URLSearchParams(location.search);
    const marcaSeleccionada = queryParams.get('marca');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);

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
        const cargarProductosColchones = async () => {
            try {
                setLoading(true);

                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosColchones = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/colchones/')
                );

                if (sub1) {
                    archivosColchones = archivosColchones.filter(
                        url => url.includes(`/colchones/${sub1}/`)
                    );
                }

                if (sub2) {
                    archivosColchones = archivosColchones.filter(
                        url => url.includes(`/colchones/${sub1}/${sub2}/`)
                    );
                }

                if (sub3) {
                    archivosColchones = archivosColchones.filter(
                        url => url.includes(`/colchones/${sub1}/${sub2}/${sub3}.json`)
                    );
                }

                const productosPromesas = archivosColchones.map(async (url) => {
                    const response = await fetch(url);
                    const data = await response.json();
                    return data.productos || [];
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                setProductos(todosProductos);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de colchones:", error);
                setLoading(false);
            }
        };

        cargarProductosColchones();
    }, [sub1, sub2, sub3]);

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/colchones/filtros.json');
                const data = await response.json();
                setFiltros(data.filtros || []);
            } catch (error) {
                console.error("Error cargando filtros:", error);
            }
        };

        cargarFiltros();
    }, []);

    const filtrosFiltrados = useMemo(() => {
        if (!filtros.length) return filtros;

        return filtros.map(filtro => {
            const nombreFiltro = Object.keys(filtro)[0];
            const valoresFiltro = filtro[nombreFiltro];

            if (nombreFiltro === "modelos" && marcaSeleccionada) {
                const modelosFiltrados = valoresFiltro.filter(grupo => {
                    const nombreGrupo = Object.keys(grupo)[0];
                    const grupoNormalizado = normalizarTexto(nombreGrupo);
                    const marcaNormalizada = normalizarTexto(marcaSeleccionada);
                    
                    return grupoNormalizado === marcaNormalizada;
                });

                return { [nombreFiltro]: modelosFiltrados };
            }

            return filtro;
        });
    }, [filtros, marcaSeleccionada]);

    const productosFiltrados = productos.filter(producto => {
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

    const productosOrdenados = [...productosFiltrados].sort((a, b) => {
        if (orden === "menor-mayor") {
            return a.precioVenta - b.precioVenta;
        } else if (orden === "mayor-menor") {
            return b.precioVenta - a.precioVenta;
        }
        return 0;
    });

    const toggleFiltro = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor);
        const paramUrl = nombreFiltro === "modelos" ? "modelo" : nombreFiltro;
        const newParams = new URLSearchParams(location.search);
        const valorActual = newParams.get(paramUrl);

        if (valorActual === normalizadoValor) {
            newParams.delete(paramUrl);
        } else {
            newParams.set(paramUrl, normalizadoValor);
        }

        navigate(`${location.pathname}?${newParams.toString()}`);
    };

    const isFiltroActivo = (nombreFiltro, valor) => {
        const normalizadoValor = normalizarTexto(valor);
        const paramUrl = nombreFiltro === "modelos" ? "modelo" : nombreFiltro;
        return queryParams.get(paramUrl) === normalizadoValor;
    };

    return(
        <>
            <Helmet>
                <title>Colchones | Homesleep</title>
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
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
                                    {filtrosFiltrados.map((filtro, index) => {
                                        const nombreFiltro = Object.keys(filtro)[0];
                                        const valoresFiltro = filtro[nombreFiltro];

                                        if (nombreFiltro === "modelos" && valoresFiltro.length === 0){
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
                                                    <p className='filter-title uppercase'>Modelos de colchón</p>
                                                    <div className='filter-subgroups d-flex-column gap-20'>
                                                        {valoresFiltro.map((grupo, idx) => {
                                                            const nombreGrupo = Object.keys(grupo)[0];
                                                            const modelos = grupo[nombreGrupo];

                                                            return(
                                                                <div key={idx} className='filter-subgroup d-flex-column gap-10'>
                                                                    <p className='sub-title uppercase'>{[nombreGrupo]}</p>

                                                                    <ul className='products-page-filter-list'>
                                                                        {modelos.map((modelo, mIdx) => (
                                                                            <li key={mIdx}>
                                                                                <button type='button' className={isFiltroActivo("modelos", modelo) ? "active" : ""} onClick={() => toggleFiltro("modelos", modelo)}>
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
                            </div>
                        </div>
                    </div>

                    <div className='products-page-right'>
                        <FiltrosTop setOrden={setOrden} orden={orden} toggleFiltro={toggleFiltro} isFiltroActivo={isFiltroActivo} setIsFiltersOpen={setIsFiltersOpen} isFiltersOpen={isFiltersOpen}/>

                        <div className='products-page-products-container'>
                            {loading ? (
                                <div className="loading-products d-flex-center-center d-flex-column gap-10">
                                    <div className="spinner"></div>
                                    <p>Cargando productos...</p>
                                </div>
                            ) : (
                                <ul className="products-page-products">
                                    {productosOrdenados.length === 0 ? (
                                        <p>No se encontraron productos con los filtros seleccionados.</p>
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

export default Colchones;
