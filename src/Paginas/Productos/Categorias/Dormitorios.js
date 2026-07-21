import { useEffect, useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';

import '../Productos.css';
import './Layout.css';

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

const compararMarcas = (marcaProducto, marcaFiltro) => {
    if (!marcaProducto || !marcaFiltro) return false;
    
    const marcaProductoNormalizado = normalizarTexto(marcaProducto);
    const marcaFiltroNormalizado = normalizarTexto(marcaFiltro);
    
    if (marcaFiltroNormalizado === 'kamas') {
        return marcaProductoNormalizado === 'kamas';
    }
    
    if (marcaFiltroNormalizado === 'paraiso') {
        return marcaProductoNormalizado === 'paraiso' || 
               (marcaProductoNormalizado.includes('paraiso') && marcaProductoNormalizado.includes('kamas'));
    }
    
    if (marcaFiltroNormalizado === 'el-cisne') {
        return marcaProductoNormalizado === 'el-cisne' || 
               (marcaProductoNormalizado.includes('el-cisne') && marcaProductoNormalizado.includes('kamas'));
    }
    
    if (marcaFiltroNormalizado === 'komfort') {
        return marcaProductoNormalizado === 'komfort' || 
               (marcaProductoNormalizado.includes('komfort') && marcaProductoNormalizado.includes('kamas'));
    }
    
    return marcaProductoNormalizado === marcaFiltroNormalizado;
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
        modelo: null,
        tipoCabecera: null,
        diseñoCabecera: null
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
        'modelo': 'modelo',
        'tipo-cabecera': 'tipoCabecera',
        'diseño-cabecera': 'diseñoCabecera'
    };

    const paramMap = {
        tamaño: 'tamaño',
        marca: 'marca',
        linea: 'linea',
        cajon: 'cajon',
        resorte: 'resorte',
        lineaColchon: 'linea-colchon',
        nivelConfort: 'nivel-confort',
        modelo: 'modelo',
        tipoCabecera: 'tipo-cabecera',
        diseñoCabecera: 'diseño-cabecera'
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
            'lineaColchon': [
                'línea-de-colchón', 
                'linea-colchon', 
                'linea-colchón', 
                'línea-de-colchones', 
                'linea-colchones', 
                'línea-de-colchon',
                'linea-de-colchon',
                'linea-de-colchón',
                'linea-de-colchones'
            ],
            'nivelConfort': ['nivel-de-confort', 'nivel-confort', 'nivel-de-confortes', 'nivel-confortes', 'nivel'],
            'modelo': ['modelo', 'modelos', 'modelo-de-colchón', 'modelo-de-colchones'],
            'tipoCabecera': ['tipo-de-cabecera', 'tipo-cabecera', 'tipo-de-cabeceras', 'tipo-cabeceras'],
            'diseñoCabecera': ['diseño-de-cabecera', 'diseño-cabecera', 'diseños-de-cabecera', 'diseños-cabecera']
        };

        let keysToSearch = new Set();

        if (fieldMappings[fieldName]) {
            fieldMappings[fieldName].forEach(key => keysToSearch.add(key));
        } else {
            newVariants.forEach(v => keysToSearch.add(v));
        }

        // Buscar en el producto directamente
        for (const key of keysToSearch) {
            if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
                const value = product[key];
                return typeof value === 'string' ? value : String(value);
            }
        }

        // Buscar en detalles-del-producto
        if (product['detalles-del-producto'] && product['detalles-del-producto'].length > 0) {
            const detalles = product['detalles-del-producto'][0];
            for (const key of keysToSearch) {
                if (detalles[key] !== undefined && detalles[key] !== null && detalles[key] !== '') {
                    const value = detalles[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        // Buscar en fichaTecnica
        if (product.fichaTecnica) {
            for (const key of keysToSearch) {
                if (product.fichaTecnica[key] !== undefined && product.fichaTecnica[key] !== null && product.fichaTecnica[key] !== '') {
                    const value = product.fichaTecnica[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        // Búsqueda flexible en el producto
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
            'marca': ['linea', 'cajon', 'resorte', 'lineaColchon', 'nivelConfort', 'modelo', 'tipoCabecera', 'diseñoCabecera'],
            'linea': ['cajon', 'resorte', 'lineaColchon', 'nivelConfort', 'modelo', 'tipoCabecera', 'diseñoCabecera'],
            'cajon': ['resorte', 'lineaColchon', 'nivelConfort', 'modelo', 'tipoCabecera', 'diseñoCabecera'],
            'resorte': ['lineaColchon', 'nivelConfort', 'modelo', 'tipoCabecera', 'diseñoCabecera'],
            'lineaColchon': ['nivelConfort', 'modelo', 'tipoCabecera', 'diseñoCabecera'],
            'nivelConfort': ['modelo', 'tipoCabecera', 'diseñoCabecera'],
            'tipoCabecera': ['diseñoCabecera']
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
                newFilters.tipoCabecera = null;
                newFilters.diseñoCabecera = null;
                
                const params = new URLSearchParams(location.search);
                ['linea', 'cajon', 'resorte', 'linea-colchon', 'nivel-confort', 'modelo', 'tipo-cabecera', 'diseño-cabecera'].forEach(key => {
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
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                } else {
                    newFilters.linea = value;
                    newFilters.cajon = null;
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                }
            } else if (filterType === 'cajon') {
                if (value === null) {
                    newFilters.cajon = null;
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                } else {
                    newFilters.cajon = value;
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                }
            } else if (filterType === 'resorte') {
                if (value === null) {
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                } else {
                    newFilters.resorte = value;
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                }
            } else if (filterType === 'lineaColchon') {
                if (value === null) {
                    newFilters.lineaColchon = null;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                } else {
                    newFilters.lineaColchon = value;
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                }
            } else if (filterType === 'nivelConfort') {
                if (value === null) {
                    newFilters.nivelConfort = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                } else {
                    newFilters.nivelConfort = value;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                }
            } else if (filterType === 'tipoCabecera') {
                if (value === null) {
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                } else {
                    newFilters.tipoCabecera = value;
                    newFilters.diseñoCabecera = null;
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
                if (!marcaProducto || !compararMarcas(marcaProducto, activeFilters.marca)) {
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

            if (cumpleTodosLosFiltros && activeFilters.tipoCabecera) {
                const tipoCabeceraProducto = getProductValue(producto, 'tipoCabecera');
                if (!tipoCabeceraProducto || normalizarTexto(tipoCabeceraProducto) !== normalizarTexto(activeFilters.tipoCabecera)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.diseñoCabecera) {
                const diseñoCabeceraProducto = getProductValue(producto, 'diseñoCabecera');
                if (!diseñoCabeceraProducto || normalizarTexto(diseñoCabeceraProducto) !== normalizarTexto(activeFilters.diseñoCabecera)) {
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
            modelo: null,
            tipoCabecera: null,
            diseñoCabecera: null
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
                            <p className='prds-filter-title'>Cajones</p>
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

        // 4. Líneas de colchón (soporta ambas estructuras)
        if (activeFilters.linea && activeFilters.cajon && activeFilters.resorte && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones) {
                const cajonData = lineaData.cajones.find(c => c.cajón === activeFilters.cajon);
                
                if (cajonData && cajonData.resortes) {
                    const resorteData = cajonData.resortes.find(r => r.resorte === activeFilters.resorte);
                    
                    if (resorteData) {
                        // Buscar tanto 'líneas-de-colchones' como 'líneas-de-colchón'
                        const lineasColchon = resorteData['líneas-de-colchones'] || resorteData['líneas-de-colchón'];
                        
                        if (lineasColchon && lineasColchon.length > 0) {
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
                                            {lineasColchon.map((item, index) => {
                                                const nombreLinea = item['línea-de-colchón'] || item['línea-de-colchon'];
                                                const isActive = activeFilters.lineaColchon === nombreLinea;
                                                return (
                                                    <li key={index}>
                                                        <button 
                                                            type='button'
                                                            className={isActive ? 'active' : ''}
                                                            onClick={() => toggleFiltro('linea-colchon', isActive ? null : nombreLinea)}
                                                        >
                                                            <span></span>
                                                            <p>{nombreLinea}</p>
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

        // 5. Niveles de confort (solo si hay línea de colchón seleccionada)
        if (activeFilters.linea && activeFilters.cajon && activeFilters.resorte && activeFilters.lineaColchon && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones) {
                const cajonData = lineaData.cajones.find(c => c.cajón === activeFilters.cajon);
                
                if (cajonData && cajonData.resortes) {
                    const resorteData = cajonData.resortes.find(r => r.resorte === activeFilters.resorte);
                    
                    if (resorteData) {
                        const lineasColchon = resorteData['líneas-de-colchones'] || resorteData['líneas-de-colchón'];
                        
                        if (lineasColchon) {
                            const lineaColchonData = lineasColchon.find(lc => 
                                (lc['línea-de-colchón'] || lc['línea-de-colchon']) === activeFilters.lineaColchon
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
        }

        // 6. Modelos (solo si hay nivel de confort seleccionado)
        if (activeFilters.linea && activeFilters.cajon && activeFilters.resorte && 
            activeFilters.lineaColchon && activeFilters.nivelConfort && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones) {
                const cajonData = lineaData.cajones.find(c => c.cajón === activeFilters.cajon);
                
                if (cajonData && cajonData.resortes) {
                    const resorteData = cajonData.resortes.find(r => r.resorte === activeFilters.resorte);
                    
                    if (resorteData) {
                        const lineasColchon = resorteData['líneas-de-colchones'] || resorteData['líneas-de-colchón'];
                        
                        if (lineasColchon) {
                            const lineaColchonData = lineasColchon.find(lc => 
                                (lc['línea-de-colchón'] || lc['línea-de-colchon']) === activeFilters.lineaColchon
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
        }

        // 7. Tipos de cabecera (muestra todos, no filtra)
        if (activeFilters.linea && activeFilters.cajon && activeFilters.resorte && 
            activeFilters.lineaColchon && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones) {
                const cajonData = lineaData.cajones.find(c => c.cajón === activeFilters.cajon);
                
                if (cajonData && cajonData.resortes) {
                    const resorteData = cajonData.resortes.find(r => r.resorte === activeFilters.resorte);
                    
                    if (resorteData) {
                        const lineasColchon = resorteData['líneas-de-colchones'] || resorteData['líneas-de-colchón'];
                        
                        if (lineasColchon && lineasColchon.length > 0) {
                            const lineaColchonData = lineasColchon.find(lc => 
                                (lc['línea-de-colchón'] || lc['línea-de-colchon']) === activeFilters.lineaColchon
                            );
                            
                            if (lineaColchonData && lineaColchonData['tipos-de-cabecera'] && lineaColchonData['tipos-de-cabecera'].length > 0) {
                                // Mostrar TODOS los tipos de cabecera
                                const tiposCabecera = lineaColchonData['tipos-de-cabecera'];
                                
                                elementos.push(
                                    <div className={`prds-filter-tag ${activeFilters.tipoCabecera ? 'active' : ''}`} key="tipoCabecera">
                                        <div 
                                            className='prds-filter-title-container'
                                            onClick={(e) => {
                                                const parent = e.currentTarget.closest('.prds-filter-tag');
                                                parent?.classList.toggle('active');
                                            }}
                                        >
                                            <p className='prds-filter-title'>Tipo de cabecera</p>
                                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                                        </div>

                                        <div className='prds-filter-tag-results-container'>
                                            <ul>
                                                {tiposCabecera.map((item, index) => {
                                                    const isActive = activeFilters.tipoCabecera === item['tipo-de-cabecera'];
                                                    return (
                                                        <li key={index}>
                                                            <button 
                                                                type='button'
                                                                className={isActive ? 'active' : ''}
                                                                onClick={() => toggleFiltro('tipo-cabecera', isActive ? null : item['tipo-de-cabecera'])}
                                                            >
                                                                <span></span>
                                                                <p>{item['tipo-de-cabecera']}</p>
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

        // 8. Diseños de cabecera (muestra todos, no filtra)
        if (activeFilters.linea && activeFilters.cajon && activeFilters.resorte && 
            activeFilters.lineaColchon && activeFilters.tipoCabecera && marcaData.líneas) {
            const lineaData = marcaData.líneas.find(l => l.línea === activeFilters.linea);
            
            if (lineaData && lineaData.cajones) {
                const cajonData = lineaData.cajones.find(c => c.cajón === activeFilters.cajon);
                
                if (cajonData && cajonData.resortes) {
                    const resorteData = cajonData.resortes.find(r => r.resorte === activeFilters.resorte);
                    
                    if (resorteData) {
                        const lineasColchon = resorteData['líneas-de-colchones'] || resorteData['líneas-de-colchón'];
                        
                        if (lineasColchon && lineasColchon.length > 0) {
                            const lineaColchonData = lineasColchon.find(lc => 
                                (lc['línea-de-colchón'] || lc['línea-de-colchon']) === activeFilters.lineaColchon
                            );
                            
                            if (lineaColchonData && lineaColchonData['tipos-de-cabecera']) {
                                const tipoCabeceraData = lineaColchonData['tipos-de-cabecera'].find(
                                    t => normalizarTexto(t['tipo-de-cabecera']) === normalizarTexto(activeFilters.tipoCabecera)
                                );
                                
                                if (tipoCabeceraData && tipoCabeceraData['diseños-de-cabecera'] && tipoCabeceraData['diseños-de-cabecera'].length > 0) {
                                    // Mostrar TODOS los diseños de cabecera
                                    const diseñosCabecera = tipoCabeceraData['diseños-de-cabecera'];
                                    
                                    elementos.push(
                                        <div className={`prds-filter-tag ${activeFilters.diseñoCabecera ? 'active' : ''}`} key="diseñoCabecera">
                                            <div 
                                                className='prds-filter-title-container'
                                                onClick={(e) => {
                                                    const parent = e.currentTarget.closest('.prds-filter-tag');
                                                    parent?.classList.toggle('active');
                                                }}
                                            >
                                                <p className='prds-filter-title'>Diseño de cabecera</p>
                                                <span className="material-symbols-outlined">keyboard_arrow_down</span>
                                            </div>

                                            <div className='prds-filter-tag-results-container'>
                                                <ul>
                                                    {diseñosCabecera.map((item, index) => {
                                                        const isActive = activeFilters.diseñoCabecera === item['diseño-de-cabecera'];
                                                        return (
                                                            <li key={index}>
                                                                <button 
                                                                    type='button'
                                                                    className={isActive ? 'active' : ''}
                                                                    onClick={() => toggleFiltro('diseño-cabecera', isActive ? null : item['diseño-de-cabecera'])}
                                                                >
                                                                    <span></span>
                                                                    <p>{item['diseño-de-cabecera']}</p>
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
                <div className='products-page-blocks'>
                    <img src='/assets/imagenes/productos/dormitorios/cat-banner.png' className='h-cat-banner' alt=''/>

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
                                          activeFilters.nivelConfort || activeFilters.modelo || activeFilters.tipoCabecera ||
                                          activeFilters.diseñoCabecera || filtroSkus || envioGratisActivo) && (
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
