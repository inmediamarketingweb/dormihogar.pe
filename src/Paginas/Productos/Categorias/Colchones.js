import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

import BtnGeneral from './Componentes/BtnGeneral/BtnGeneral';
import FiltrosTop from '../Componentes/FiltrosTop/FiltrosTop';
import { Producto } from '../../../Componentes/Plantillas/Producto/Producto';
import { usePagination } from '../../../Hooks/usePagination';
import RangoPrecios from './Componentes/RangoPrecios/RangoPrecios';

const normalizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') {
        return '';
    }
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

function Colchones() {
    const { sub1, sub2, sub3 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [orden, setOrden] = useState("ultimo");
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const itemsPerPage = 28;

    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewMode');
        return savedMode || 'grid';
    });

    const [activeFilters, setActiveFilters] = useState({
        tamaño: null,
        marca: null,
        resorte: null,
        lineaColchon: null,
        nivelConfort: null,
        modelo: null
    });

    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [filtroSkus, setFiltroSkus] = useState(null);
    const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);

    // scrollToTop eliminado - ya no se usa

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    const filterParamMap = {
        'tamaño': 'tamaño',
        'marca': 'marca',
        'resorte': 'resorte',
        'linea-colchon': 'lineaColchon',
        'nivel-confort': 'nivelConfort',
        'modelo': 'modelo'
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
            // scrollToTop() eliminado
        }
    }, [location.search]);

    useEffect(() => {
        if (sub1 && filtrosData?.filtros?.[0]?.tamaño) {
            if (activeFilters.marca) {
                const tamañoData = filtrosData.filtros[0].tamaño.find(
                    t => normalizarTexto(t.tamaño) === normalizarTexto(sub1)
                );

                if (tamañoData && tamañoData.marcas) {
                    const marcasDisponibles = tamañoData.marcas.map(m => m.marca);
                    if (!marcasDisponibles.includes(activeFilters.marca)) {
                        handleFilterChange('marca', null);
                    }
                }
            }
        }
    }, [sub1, filtrosData]);

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
            'línea-de-colchón': ['línea-de-colchón', 'linea-colchon', 'linea-colchón', 'línea-de-colchones', 'linea-colchones', 'línea', 'linea'],
            'lineaColchon': ['línea-de-colchón', 'linea-colchon', 'linea-colchón', 'línea-de-colchones', 'linea-colchones', 'línea', 'linea'],
            'nivel-de-confort': ['nivel-de-confort', 'nivel-confort', 'nivel-de-confortes', 'nivel-confortes', 'nivel'],
            'nivelConfort': ['nivel-de-confort', 'nivel-confort', 'nivel-de-confortes', 'nivel-confortes', 'nivel'],
            'tipo-de-resorte': ['tipo-de-resorte', 'tipo-resorte', 'tipo-de-resortes', 'tipo-resortes', 'resorte', 'resortes'],
            'resorte': ['resorte', 'resortes', 'tipo-de-resorte', 'tipo-resorte', 'tipo-de-resortes', 'tipo-resortes'],
            'tamaño': ['tamaño', 'tamaños', 'medida', 'medidas', 'tamano', 'tamanos'],
            'marca': ['marca', 'marcas'],
            'modelo': ['modelo', 'modelos', 'modelo-de-colchón', 'modelo-de-colchones'],
            'modelo-de-colchón': ['modelo-de-colchón', 'modelo-de-colchones', 'modelo', 'modelos']
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

        if (product.ficha && product.ficha.length > 0) {
            const ficha = product.ficha[0];
            for (const key of keysToSearch) {
                if (ficha[key] !== undefined && ficha[key] !== null && ficha[key] !== '') {
                    const value = ficha[key];
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

        const paramMap = {
            tamaño: 'tamaño',
            marca: 'marca',
            resorte: 'resorte',
            lineaColchon: 'linea-colchon',
            nivelConfort: 'nivel-confort',
            modelo: 'modelo'
        };

        const paramName = paramMap[filterType] || filterType;

        if (value === null || value === undefined) {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        if (filterType === 'resorte') {
            params.delete('linea-colchon');
            params.delete('nivel-confort');
            params.delete('modelo');
        }
        if (filterType === 'lineaColchon') {
            params.delete('nivel-confort');
            params.delete('modelo');
        }
        if (filterType === 'nivelConfort') {
            params.delete('modelo');
        }

        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
        
        // scrollToTop() eliminado
    };

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            if (filterType === 'marca') {
                newFilters.marca = value;
                newFilters.resorte = null;
                newFilters.lineaColchon = null;
                newFilters.nivelConfort = null;
                newFilters.modelo = null;

                const params = new URLSearchParams(location.search);
                params.delete('resorte');
                params.delete('linea-colchon');
                params.delete('nivel-confort');
                params.delete('modelo');

                if (value === null) {
                    params.delete('marca');
                } else {
                    params.set('marca', value);
                }

                const newSearch = params.toString();
                const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
                navigate(newPath, { replace: true });
                
                // scrollToTop() eliminado
                
                return newFilters;
            }

            if (filterType === 'resorte') {
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
        // scrollToTop() eliminado
    };

    const handleFiltroSkus = (skus) => {
        setFiltroSkus(skus);
        // scrollToTop() eliminado
    };

    const handleEnvioGratis = (activo) => {
        setEnvioGratisActivo(activo);
        // scrollToTop() eliminado
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

    // Primero aplicar todos los filtros excepto precio
    const productosFiltradosBase = useMemo(() => {
        if (productos.length === 0) return [];

        return productos.filter(producto => {
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

            if (cumpleTodosLosFiltros && activeFilters.resorte) {
                const resorteProducto = getProductValue(producto, 'resorte');
                if (!resorteProducto || normalizarTexto(resorteProducto) !== normalizarTexto(activeFilters.resorte)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.lineaColchon) {
                const lineaProducto = getProductValue(producto, 'lineaColchon');
                if (!lineaProducto || normalizarTexto(lineaProducto) !== normalizarTexto(activeFilters.lineaColchon)) {
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
    }, [productos, activeFilters, envioGratisActivo, filtroSkus]);

    // Luego aplicar el filtro de precio
    const productosFiltrados = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const precioMin = params.get('min'); // Cambiado de 'precio-min' a 'min'
        const precioMax = params.get('max'); // Cambiado de 'precio-max' a 'max'
        
        if (precioMin === null || precioMax === null) {
            return productosFiltradosBase;
        }

        const min = parseInt(precioMin);
        const max = parseInt(precioMax);

        if (isNaN(min) || isNaN(max)) {
            return productosFiltradosBase;
        }

        return productosFiltradosBase.filter(producto => {
            const precio = producto.precioVenta;
            return precio >= min && precio <= max;
        });
    }, [productosFiltradosBase, location.search]);

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
        // scrollToTop() eliminado
    }, [activeFilters, envioGratisActivo, filtroSkus, orden, location.search]);

    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    const limpiarFiltros = () => {
        setActiveFilters({
            tamaño: null,
            marca: null,
            resorte: null,
            lineaColchon: null,
            nivelConfort: null,
            modelo: null
        });
        
        setFiltroSkus(null);
        setEnvioGratisActivo(false);
        resetPage();
        
        // Limpiar también los filtros de precio de la URL
        const params = new URLSearchParams(location.search);
        params.delete('min'); // Cambiado de 'precio-min' a 'min'
        params.delete('max'); // Cambiado de 'precio-max' a 'max'
        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
        
        setResetFiltersTrigger(true);
        
        setTimeout(() => {
            setResetFiltersTrigger(false);
        }, 100);
    };

    const renderMarcaList = (marcas) => {
        if (marcas.length === 0) return null;

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
                        {marcas.map((marca, index) => {
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

            return renderMarcaList(marcasUnicas);
        }

        const tamañoData = filtrosData.filtros[0].tamaño.find(
            t => normalizarTexto(t.tamaño) === normalizarTexto(tamañoActual)
        );
        
        if (!tamañoData || !tamañoData.marcas || tamañoData.marcas.length === 0) {
            return null;
        }

        const marcasDisponibles = tamañoData.marcas.map(m => m.marca);

        return renderMarcaList(marcasDisponibles);
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
                                        // onClick={scrollToTop} eliminado
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

    const renderFiltrosJerarquicos = () => {
        if (!filtrosData?.filtros?.[0]?.tamaño) return null;
        if (!activeFilters.marca) return null;

        const tamañoActual = sub1 || activeFilters.tamaño || null;

        if (!tamañoActual) return null;

        const tamaños = filtrosData.filtros[0].tamaño;
        const tamañoData = tamaños.find(t => 
            normalizarTexto(t.tamaño) === normalizarTexto(tamañoActual)
        );

        if (!tamañoData || !tamañoData.marcas) return null;

        const marcaData = tamañoData.marcas.find(m => 
            normalizarTexto(m.marca) === normalizarTexto(activeFilters.marca)
        );

        if (!marcaData) return null;

        const resortes = marcaData.resortes || [];

        return (
            <>
                <div className={`prds-filter-tag ${activeFilters.resorte ? 'active' : ''}`}>
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
                            {resortes.map((resorte, index) => {
                                const isActive = activeFilters.resorte && 
                                    normalizarTexto(activeFilters.resorte) === normalizarTexto(resorte.resorte);
                                return (
                                    <li key={index}>
                                        <button 
                                            type='button'
                                            className={isActive ? 'active' : ''}
                                            onClick={() => toggleFiltro('resorte', isActive ? null : resorte.resorte)}
                                        >
                                            <span></span>
                                            <p>{resorte.resorte}</p>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {activeFilters.resorte && (() => {
                    const resorteData = resortes.find(r => 
                        normalizarTexto(r.resorte) === normalizarTexto(activeFilters.resorte)
                    );
                    if (!resorteData || !resorteData['líneas-de-colchones']) return null;

                    const lineas = resorteData['líneas-de-colchones'];
                    return (
                        <div className={`prds-filter-tag ${activeFilters.lineaColchon ? 'active' : ''}`}>
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
                                    {lineas.map((linea, index) => {
                                        const isActive = activeFilters.lineaColchon && 
                                            normalizarTexto(activeFilters.lineaColchon) === normalizarTexto(linea['línea-de-colchón']);
                                        return (
                                            <li key={index}>
                                                <button 
                                                    type='button'
                                                    className={isActive ? 'active' : ''}
                                                    onClick={() => toggleFiltro('lineaColchon', isActive ? null : linea['línea-de-colchón'])}
                                                >
                                                    <span></span>
                                                    <p>{linea['línea-de-colchón']}</p>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    );
                })()}

                {activeFilters.resorte && activeFilters.lineaColchon && (() => {
                    const resorteData = resortes.find(r => 
                        normalizarTexto(r.resorte) === normalizarTexto(activeFilters.resorte)
                    );
                    if (!resorteData) return null;
                    
                    const lineaData = resorteData['líneas-de-colchones']?.find(
                        l => normalizarTexto(l['línea-de-colchón']) === normalizarTexto(activeFilters.lineaColchon)
                    );
                    if (!lineaData || !lineaData['niveles-de-confort']) return null;

                    const niveles = lineaData['niveles-de-confort'];
                    return (
                        <div className={`prds-filter-tag ${activeFilters.nivelConfort ? 'active' : ''}`}>
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
                                    {niveles.map((nivel, index) => {
                                        const isActive = activeFilters.nivelConfort && 
                                            normalizarTexto(activeFilters.nivelConfort) === normalizarTexto(nivel['nivel-de-confort']);
                                        return (
                                            <li key={index}>
                                                <button 
                                                    type='button'
                                                    className={isActive ? 'active' : ''}
                                                    onClick={() => toggleFiltro('nivelConfort', isActive ? null : nivel['nivel-de-confort'])}
                                                >
                                                    <span></span>
                                                    <p>{nivel['nivel-de-confort']}</p>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    );
                })()}

                {activeFilters.resorte && activeFilters.lineaColchon && activeFilters.nivelConfort && (() => {
                    const resorteData = resortes.find(r => 
                        normalizarTexto(r.resorte) === normalizarTexto(activeFilters.resorte)
                    );
                    if (!resorteData) return null;
                    
                    const lineaData = resorteData['líneas-de-colchones']?.find(
                        l => normalizarTexto(l['línea-de-colchón']) === normalizarTexto(activeFilters.lineaColchon)
                    );
                    if (!lineaData) return null;
                    
                    const nivelData = lineaData['niveles-de-confort']?.find(
                        n => normalizarTexto(n['nivel-de-confort']) === normalizarTexto(activeFilters.nivelConfort)
                    );
                    if (!nivelData || !nivelData['modelos-de-colchones']) return null;

                    const modelos = nivelData['modelos-de-colchones'];
                    return (
                        <div className={`prds-filter-tag ${activeFilters.modelo ? 'active' : ''}`}>
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
                                    {modelos.map((modelo, index) => {
                                        const isActive = activeFilters.modelo && 
                                            normalizarTexto(activeFilters.modelo) === normalizarTexto(modelo['modelo-de-colchón']);
                                        return (
                                            <li key={index}>
                                                <button 
                                                    type='button'
                                                    className={isActive ? 'active' : ''}
                                                    onClick={() => toggleFiltro('modelo', isActive ? null : modelo['modelo-de-colchón'])}
                                                >
                                                    <span></span>
                                                    <p>{modelo['modelo-de-colchón']}</p>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    );
                })()}
            </>
        );
    };

    return(
        <>
            <Helmet>
                <title>Colchones | Dormihogar</title>
                <meta name='description' content='En dormihogar contamos con una gran variedad en colchones. Contamos con las mejores marcas del mercado: Paraiso, Kamas, El Cisne y Komfort.' />
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <div className='products-page-blocks'>
                    <img src='/assets/imagenes/productos/colchones/cat-banner.png' className='h-cat-banner' alt=''/>

                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20-to-10'>
                                <div className='hp-cat-title'>
                                    <h1>Colchones</h1>
                                    <p className='text'>Encuentra el colchón ideal para tu descanso, en las mejores marcas del mercado</p>
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

                                        {(activeFilters.tamaño || activeFilters.marca || activeFilters.resorte || 
                                          activeFilters.lineaColchon || activeFilters.nivelConfort || activeFilters.modelo ||
                                          filtroSkus || envioGratisActivo) && (
                                            <button type="button" className="limpiar-filtros-btn" onClick={limpiarFiltros} style={{ marginLeft: '10px', fontSize: '12px', color: 'var(--color-1)' }}>Limpiar filtros</button>
                                        )}
                                    </div>

                                    <RangoPrecios productos={productosFiltrados} loading={loading}/>

                                    <div className='prds-filters-container'>
                                        {renderTamañosFilters()}
                                        {renderMarcaFilters()}
                                        {renderFiltrosJerarquicos()}
                                    </div>
                                </div>

                                {/* <button type='button' className='button-link button-link-2'>
                                    <span class="material-symbols-outlined">delete</span>
                                    <p className='button-link-text'>Limpiar filtros</p>
                                </button> */}

                                {/* <a href='/' title='Promo del mes | Dormihogar' className='d-flex w-100 border-r-6 overflow-hidden'>
                                    <img className='d-flex w-100' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS__S5c-OF91SI1JrkskfFo5_DXbueZkXzbz4OTtzUN_nMO5DCp2F-11GMj&s=10' alt=''/>
                                </a> */}
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
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                        />

                        <div className='products-page-products-container'>
                            {loading ? (
                                <div className="loading-products d-flex-center-center d-flex-column gap-10">
                                    <div className="spinner"></div>
                                    <p>Cargando productos...</p>
                                </div>
                            ) : (
                                <>
                                    <ul className={`products-page-products ${viewMode}`}>
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
                                                            <button type='button' className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => handlePageChange(page)}>
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

export default Colchones;
