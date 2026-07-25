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

function CamasFuncionales() {
    const { sub1, sub2, sub3, sub4, sub5 } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtrosData, setFiltrosData] = useState(null);
    const [orden, setOrden] = useState("ultimo");
    const [viewMode, setViewMode] = useState(() => {
        // Recuperar de localStorage al iniciar
        const savedMode = localStorage.getItem('viewModeCamasFuncionales');
        return savedMode || 'grid';
    });
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filtersPanelRef = useRef(null);
    const itemsPerPage = 20;

    const [activeFilters, setActiveFilters] = useState({
        tipo: null,
        tamaño: null,
        marca: null,
        línea: null,
        modelo: null,
        'apertura-box': null,
        'tipo-de-baúl': null,
        'incluye-colchón': null,
        'tipo-de-cabecera': null
    });

    const [envioGratisActivo, setEnvioGratisActivo] = useState(false);
    const [filtroSkus, setFiltroSkus] = useState(null);
    const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const closeFilters = () => {
        setIsFiltersOpen(false);
    };

    const filterParamMap = {
        'tipo': 'tipo',
        'tamaño': 'tamaño',
        'marca': 'marca',
        'línea': 'línea',
        'modelo': 'modelo',
        'apertura-box': 'apertura-box',
        'tipo-de-baúl': 'tipo-de-baúl',
        'incluye-colchón': 'incluye-colchón',
        'tipo-de-cabecera': 'tipo-de-cabecera'
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

    // Sincronizar sub1 con activeFilters.tipo
    useEffect(() => {
        if (sub1) {
            const categoriaNormalizada = normalizarTexto(sub1);
            if (activeFilters.tipo !== categoriaNormalizada) {
                setActiveFilters(prev => ({
                    ...prev,
                    tipo: categoriaNormalizada
                }));
            }
        } else {
            // Si no hay sub1, limpiar el filtro de tipo
            if (activeFilters.tipo !== null) {
                setActiveFilters(prev => ({
                    ...prev,
                    tipo: null
                }));
            }
        }
    }, [sub1]);

    // Guardar viewMode en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('viewModeCamasFuncionales', viewMode);
    }, [viewMode]);

    useEffect(() => {
        if (sub1 && filtrosData?.filtros) {
            const categorias = filtrosData.filtros.find(f => f.categorías);
            if (categorias && activeFilters.tipo) {
                const categoriasDisponibles = categorias.categorías.map(c => normalizarTexto(c.categoría));
                if (!categoriasDisponibles.includes(normalizarTexto(activeFilters.tipo))) {
                    handleFilterChange('tipo', null);
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
        const cargarProductosCamasFuncionales = async () => {
            try {
                setLoading(true);

                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/camas-funcionales/')
                );

                if (sub1) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/camas-funcionales/${sub1}/`)
                    );
                }

                if (sub2) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/camas-funcionales/${sub1}/${sub2}/`)
                    );
                }

                if (sub3) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/camas-funcionales/${sub1}/${sub2}/${sub3}/`)
                    );
                }

                if (sub4) {
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/camas-funcionales/${sub1}/${sub2}/${sub3}/${sub4}.json`)
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
                console.error("Error cargando productos de camas funcionales:", error);
                setLoading(false);
            }
        };

        cargarProductosCamasFuncionales();
    }, [sub1, sub2, sub3, sub4]);

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/camas-funcionales/filtros.json');
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
            'tipo': ['tipo', 'tipos', 'categoría', 'categorías', 'categoria', 'categorias', 'subcategoría', 'subcategorías', 'subcategoria', 'subcategorias'],
            'tamaño': ['tamaño', 'tamaños', 'medida', 'medidas', 'tamano', 'tamanos'],
            'marca': ['marca', 'marcas'],
            'línea': ['línea', 'líneas', 'linea', 'lineas'],
            'modelo': ['modelo', 'modelos'],
            'apertura-box': ['apertura-box', 'apertura', 'tipo-de-apertura', 'apertura'],
            'tipo-de-baúl': ['tipo-de-baúl', 'tipo-baúl', 'baúl', 'tipo-de-baul', 'tipo-baul', 'baul'],
            'incluye-colchón': ['incluye-colchón', 'incluye-colchon', 'incluye'],
            'tipo-de-cabecera': ['tipo-de-cabecera', 'tipo-cabecera', 'cabecera']
        };

        let keysToSearch = new Set();

        if (fieldMappings[fieldName]) {
            fieldMappings[fieldName].forEach(key => keysToSearch.add(key));
        } else {
            newVariants.forEach(v => keysToSearch.add(v));
        }

        // Buscar primero en el producto directamente
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

        // Buscar en ficha
        if (product.ficha && product.ficha.length > 0) {
            const ficha = product.ficha[0];
            for (const key of keysToSearch) {
                if (ficha[key] !== undefined && ficha[key] !== null && ficha[key] !== '') {
                    const value = ficha[key];
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        // Búsqueda flexible en todas las propiedades
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
            tipo: 'tipo',
            tamaño: 'tamaño',
            marca: 'marca',
            línea: 'línea',
            modelo: 'modelo',
            'apertura-box': 'apertura-box',
            'tipo-de-baúl': 'tipo-de-baúl',
            'incluye-colchón': 'incluye-colchón',
            'tipo-de-cabecera': 'tipo-de-cabecera'
        };

        const paramName = paramMap[filterType] || filterType;

        if (value === null || value === undefined) {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        if (filterType === 'tipo') {
            params.delete('tamaño');
            params.delete('marca');
            params.delete('línea');
            params.delete('modelo');
            params.delete('apertura-box');
            params.delete('tipo-de-baúl');
            params.delete('incluye-colchón');
            params.delete('tipo-de-cabecera');
        }
        if (filterType === 'tamaño') {
            params.delete('marca');
            params.delete('línea');
            params.delete('modelo');
        }
        if (filterType === 'marca') {
            params.delete('línea');
            params.delete('modelo');
        }
        if (filterType === 'línea') {
            params.delete('modelo');
        }
        if (filterType === 'apertura-box') {
            params.delete('tipo-de-baúl');
            params.delete('incluye-colchón');
            params.delete('tipo-de-cabecera');
        }
        if (filterType === 'tipo-de-baúl') {
            params.delete('incluye-colchón');
            params.delete('tipo-de-cabecera');
        }
        if (filterType === 'incluye-colchón') {
            params.delete('tipo-de-cabecera');
        }

        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
        
        scrollToTop();
    };

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            if (filterType === 'tipo') {
                newFilters.tipo = value;
                newFilters.tamaño = null;
                newFilters.marca = null;
                newFilters.línea = null;
                newFilters.modelo = null;
                newFilters['apertura-box'] = null;
                newFilters['tipo-de-baúl'] = null;
                newFilters['incluye-colchón'] = null;
                newFilters['tipo-de-cabecera'] = null;

                const params = new URLSearchParams(location.search);
                params.delete('tamaño');
                params.delete('marca');
                params.delete('línea');
                params.delete('modelo');
                params.delete('apertura-box');
                params.delete('tipo-de-baúl');
                params.delete('incluye-colchón');
                params.delete('tipo-de-cabecera');

                if (value === null) {
                    params.delete('tipo');
                } else {
                    params.set('tipo', value);
                }

                const newSearch = params.toString();
                const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
                navigate(newPath, { replace: true });
                
                scrollToTop();
                
                return newFilters;
            }

            if (filterType === 'tamaño') {
                if (value === null) {
                    newFilters.tamaño = null;
                    newFilters.marca = null;
                    newFilters.línea = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.tamaño = value;
                    newFilters.marca = null;
                    newFilters.línea = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'marca') {
                if (value === null) {
                    newFilters.marca = null;
                    newFilters.línea = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.marca = value;
                    newFilters.línea = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'línea') {
                if (value === null) {
                    newFilters.línea = null;
                    newFilters.modelo = null;
                } else {
                    newFilters.línea = value;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'apertura-box') {
                if (value === null) {
                    newFilters['apertura-box'] = null;
                    newFilters['tipo-de-baúl'] = null;
                    newFilters['incluye-colchón'] = null;
                    newFilters['tipo-de-cabecera'] = null;
                } else {
                    newFilters['apertura-box'] = value;
                    newFilters['tipo-de-baúl'] = null;
                    newFilters['incluye-colchón'] = null;
                    newFilters['tipo-de-cabecera'] = null;
                }
            } else if (filterType === 'tipo-de-baúl') {
                if (value === null) {
                    newFilters['tipo-de-baúl'] = null;
                    newFilters['incluye-colchón'] = null;
                    newFilters['tipo-de-cabecera'] = null;
                } else {
                    newFilters['tipo-de-baúl'] = value;
                    newFilters['incluye-colchón'] = null;
                    newFilters['tipo-de-cabecera'] = null;
                }
            } else if (filterType === 'incluye-colchón') {
                if (value === null) {
                    newFilters['incluye-colchón'] = null;
                    newFilters['tipo-de-cabecera'] = null;
                } else {
                    newFilters['incluye-colchón'] = value;
                    newFilters['tipo-de-cabecera'] = null;
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
        scrollToTop();
    };

    const handleEnvioGratis = (activo) => {
        setEnvioGratisActivo(activo);
        scrollToTop();
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

    const obtenerValoresUnicos = (productosList, campo) => {
        const valores = new Set();
        productosList.forEach(producto => {
            const valor = getProductValue(producto, campo);
            if (valor && typeof valor === 'string') {
                valores.add(valor);
            }
        });
        return Array.from(valores).sort();
    };

    // Productos filtrados por categoría (tipo)
    const productosFiltradosBase = useMemo(() => {
        if (productos.length === 0) return [];

        // Usar sub1 o activeFilters.tipo
        const categoriaActual = sub1 || activeFilters.tipo;

        // Si no hay categoría seleccionada, mostrar todos los productos
        if (!categoriaActual) {
            return productos;
        }

        const filtrados = productos.filter(producto => {
            let cumpleTodosLosFiltros = true;

            if (categoriaActual) {
                // Buscar en subcategoría primero, luego en categoría
                const subcategoriaProducto = producto.subcategoría || 
                                            getProductValue(producto, 'subcategoría') || 
                                            getProductValue(producto, 'subcategoria');
                const categoriaProducto = producto.categoria || 
                                         getProductValue(producto, 'categoria') ||
                                         getProductValue(producto, 'categoría');
                
                const subcategoriaNormalizada = normalizarTexto(subcategoriaProducto);
                const categoriaNormalizada = normalizarTexto(categoriaProducto);
                const categoriaActualNormalizada = normalizarTexto(categoriaActual);
                
                // El producto coincide si su subcategoría o categoría coincide con la categoría actual
                if (subcategoriaNormalizada !== categoriaActualNormalizada && 
                    categoriaNormalizada !== categoriaActualNormalizada) {
                    cumpleTodosLosFiltros = false;
                }
            }

            return cumpleTodosLosFiltros;
        });

        return filtrados;
    }, [productos, sub1, activeFilters.tipo]);

    const valoresDisponibles = useMemo(() => {
        // Obtener valores de los productos
        const valores = {
            marcas: obtenerValoresUnicos(productosFiltradosBase, 'marca'),
            líneas: obtenerValoresUnicos(productosFiltradosBase, 'línea'),
            tamaños: obtenerValoresUnicos(productosFiltradosBase, 'tamaño'),
            'apertura-box': obtenerValoresUnicos(productosFiltradosBase, 'apertura-box'),
            'tipo-de-baúl': obtenerValoresUnicos(productosFiltradosBase, 'tipo-de-baúl'),
            'incluye-colchón': obtenerValoresUnicos(productosFiltradosBase, 'incluye-colchón'),
            'tipo-de-cabecera': obtenerValoresUnicos(productosFiltradosBase, 'tipo-de-cabecera')
        };

        // Para apertura-box, si no hay valores de productos pero estamos en box espacio, usar los del JSON
        const categoriaActual = sub1 || activeFilters.tipo || '';
        if (categoriaActual && normalizarTexto(categoriaActual) === normalizarTexto('box espacio')) {
            if (!valores['apertura-box'] || valores['apertura-box'].length === 0) {
                if (filtrosData?.filtros) {
                    const aperturasFilter = filtrosData.filtros.find(f => f['aperturas-box']);
                    if (aperturasFilter && aperturasFilter['aperturas-box']) {
                        const valoresJSON = aperturasFilter['aperturas-box'].map(item => item['apertura-box']);
                        if (valoresJSON && valoresJSON.length > 0) {
                            valores['apertura-box'] = valoresJSON;
                        }
                    }
                }
            }
        }

        return valores;
    }, [productosFiltradosBase, sub1, activeFilters.tipo, filtrosData]);

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

            // Filtro de categoría
            if (cumpleTodosLosFiltros) {
                const categoriaActual = sub1 || activeFilters.tipo;
                if (categoriaActual) {
                    const subcategoriaProducto = producto.subcategoría || 
                                                getProductValue(producto, 'subcategoría') || 
                                                getProductValue(producto, 'subcategoria');
                    const categoriaProducto = producto.categoria || 
                                             getProductValue(producto, 'categoria') ||
                                             getProductValue(producto, 'categoría');
                    
                    const subcategoriaNormalizada = normalizarTexto(subcategoriaProducto);
                    const categoriaNormalizada = normalizarTexto(categoriaProducto);
                    const categoriaActualNormalizada = normalizarTexto(categoriaActual);
                    
                    if (subcategoriaNormalizada !== categoriaActualNormalizada && 
                        categoriaNormalizada !== categoriaActualNormalizada) {
                        cumpleTodosLosFiltros = false;
                    }
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.tamaño) {
                const tamañoProducto = getProductValue(producto, 'tamaño');
                if (!tamañoProducto || normalizarTexto(tamañoProducto) !== normalizarTexto(activeFilters.tamaño)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.marca) {
                const marcaProducto = getProductValue(producto, 'marca');
                if (!marcaProducto || normalizarTexto(marcaProducto) !== normalizarTexto(activeFilters.marca)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.línea) {
                const lineaProducto = getProductValue(producto, 'línea');
                if (!lineaProducto || normalizarTexto(lineaProducto) !== normalizarTexto(activeFilters.línea)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters.modelo) {
                const modeloProducto = getProductValue(producto, 'modelo');
                if (!modeloProducto || normalizarTexto(modeloProducto) !== normalizarTexto(activeFilters.modelo)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['apertura-box']) {
                const valorProducto = getProductValue(producto, 'apertura-box');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['apertura-box'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['tipo-de-baúl']) {
                const valorProducto = getProductValue(producto, 'tipo-de-baúl');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['tipo-de-baúl'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['incluye-colchón']) {
                const valorProducto = getProductValue(producto, 'incluye-colchón');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['incluye-colchón'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            if (cumpleTodosLosFiltros && activeFilters['tipo-de-cabecera']) {
                const valorProducto = getProductValue(producto, 'tipo-de-cabecera');
                if (!valorProducto || normalizarTexto(valorProducto) !== normalizarTexto(activeFilters['tipo-de-cabecera'])) {
                    cumpleTodosLosFiltros = false;
                }
            }

            return cumpleTodosLosFiltros;
        });

        return filtrados;
    }, [productos, activeFilters, envioGratisActivo, filtroSkus, sub1]);

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
        scrollToTop();
    }, [activeFilters, envioGratisActivo, filtroSkus, orden, sub1]);

    const productosPagina = productosOrdenados.slice(startIndex, endIndex);

    const limpiarFiltros = () => {
        setActiveFilters({
            tipo: null,
            tamaño: null,
            marca: null,
            línea: null,
            modelo: null,
            'apertura-box': null,
            'tipo-de-baúl': null,
            'incluye-colchón': null,
            'tipo-de-cabecera': null
        });
        
        setFiltroSkus(null);
        setEnvioGratisActivo(false);
        resetPage();
        navigate(location.pathname);
        setResetFiltersTrigger(true);
        
        scrollToTop();
        
        setTimeout(() => {
            setResetFiltersTrigger(false);
        }, 100);
    };

    const renderCategoriaFilters = () => {
        if (!filtrosData?.filtros) return null;
        const categorias = filtrosData.filtros.find(f => f.categorías);
        if (!categorias) return null;

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
                    <p className='prds-filter-title'>Categorías</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {categorias.categorías.map((item, index) => {
                            const finalUrl = item.ruta;
                            const currentPathNormalized = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
                            const linkPathNormalized = finalUrl.endsWith('/') ? finalUrl.slice(0, -1) : finalUrl;
                            const isActive = currentPathNormalized === linkPathNormalized;
                            
                            return (
                                <li key={index}>
                                    <Link 
                                        to={finalUrl}
                                        className={isActive ? 'active' : ''}
                                        title={`Ver productos de ${item.categoría}`}
                                        onClick={scrollToTop}
                                    >
                                        <span></span>
                                        <p>{item.categoría}</p>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    const renderFiltroDinamico = (nombreFiltro, valores, label, soloCategoria = false) => {
        // Si soloCategoria es true, solo mostrar si hay una categoría seleccionada
        if (soloCategoria && !activeFilters.tipo && !sub1) {
            return null;
        }

        // Si es apertura-box, solo mostrar si la categoría es "box espacio"
        if (nombreFiltro === 'apertura-box') {
            const categoriaSeleccionada = sub1 || activeFilters.tipo || '';
            const esBoxEspacio = normalizarTexto(categoriaSeleccionada) === normalizarTexto('box espacio');
            if (!esBoxEspacio) {
                return null;
            }
            
            // Si no hay valores de productos, usar los valores del JSON de filtros
            if (!valores || valores.length === 0) {
                if (filtrosData?.filtros) {
                    const aperturasFilter = filtrosData.filtros.find(f => f['aperturas-box']);
                    if (aperturasFilter && aperturasFilter['aperturas-box']) {
                        const valoresJSON = aperturasFilter['aperturas-box'].map(item => item['apertura-box']);
                        if (valoresJSON && valoresJSON.length > 0) {
                            valores = valoresJSON;
                        }
                    }
                }
            }
        }

        if (!valores || valores.length === 0) {
            return null;
        }

        const stateKey = filterParamMap[nombreFiltro] || nombreFiltro;
        const isActive = activeFilters[stateKey] !== null;

        return (
            <div className={`prds-filter-tag ${isActive ? 'active' : ''}`}>
                <div 
                    className='prds-filter-title-container'
                    onClick={(e) => {
                        const parent = e.currentTarget.closest('.prds-filter-tag');
                        parent?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>{label}</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {valores.map((valor, index) => {
                            const isActiveVal = activeFilters[stateKey] === valor;
                            return (
                                <li key={index}>
                                    <button 
                                        type='button'
                                        className={isActiveVal ? 'active' : ''}
                                        onClick={() => toggleFiltro(nombreFiltro, isActiveVal ? null : valor)}
                                    >
                                        <span></span>
                                        <p>{valor}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    };

    const renderFiltrosEspecificos = () => {
        if (!filtrosData?.filtros) return null;

        const filtrosEspecificos = filtrosData.filtros.filter(f => 
            f.modelos || f.tipos
        );

        if (filtrosEspecificos.length === 0) return null;

        return filtrosEspecificos.map((filtro, index) => {
            const nombreFiltro = Object.keys(filtro)[0];
            const valores = filtro[nombreFiltro];

            if (!Array.isArray(valores)) return null;

            return (
                <div key={index} className='prds-filter-tag'>
                    <div 
                        className='prds-filter-title-container'
                        onClick={(e) => {
                            const parent = e.currentTarget.closest('.prds-filter-tag');
                            parent?.classList.toggle('active');
                        }}
                    >
                        <p className='prds-filter-title'>{nombreFiltro.replace(/-/g, ' ')}</p>
                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>

                    <div className='prds-filter-tag-results-container'>
                        {valores.map((grupo, idx) => {
                            const grupoKeys = Object.keys(grupo);
                            const nombreGrupo = grupoKeys[0];
                            let opciones = grupo[nombreGrupo];

                            if (!Array.isArray(opciones)) {
                                opciones = opciones ? [opciones] : [];
                            }

                            const opcionesDisponibles = opciones.filter(opcion => {
                                let valorOpcion = opcion;
                                if (typeof opcion === 'object' && opcion !== null) {
                                    const opcionKeys = Object.keys(opcion);
                                    if (opcionKeys.length > 0) {
                                        valorOpcion = opcion[opcionKeys[0]];
                                    }
                                }
                                
                                const stateKey = nombreFiltro === 'modelos' ? 'modelo' : 
                                               nombreFiltro === 'tipos' ? 'tipo' : nombreFiltro;
                                const valoresDisponibles = obtenerValoresUnicos(productosFiltradosBase, stateKey);
                                return valoresDisponibles.includes(valorOpcion);
                            });

                            if (opcionesDisponibles.length === 0) return null;

                            return (
                                <div key={idx} className='filter-subgroup'>
                                    <p className='filter-subgroup-title'>{nombreGrupo}</p>
                                    <ul>
                                        {opcionesDisponibles.map((opcion, mIdx) => {
                                            let valorOpcion = opcion;
                                            if (typeof opcion === 'object' && opcion !== null) {
                                                const opcionKeys = Object.keys(opcion);
                                                if (opcionKeys.length > 0) {
                                                    valorOpcion = opcion[opcionKeys[0]];
                                                }
                                            }
                                            
                                            const stateKey = nombreFiltro === 'modelos' ? 'modelo' : 
                                                           nombreFiltro === 'tipos' ? 'tipo' : nombreFiltro;
                                            const isActive = activeFilters[stateKey] === valorOpcion;
                                            
                                            return (
                                                <li key={mIdx}>
                                                    <button 
                                                        type='button'
                                                        className={isActive ? 'active' : ''}
                                                        onClick={() => {
                                                            toggleFiltro(stateKey, isActive ? null : valorOpcion);
                                                        }}
                                                    >
                                                        <span></span>
                                                        <p>{valorOpcion}</p>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });
    };

    const hayFiltrosActivos = () => {
        const { tipo, ...otrosFiltros } = activeFilters;
        return Object.values(otrosFiltros).some(v => v !== null) || filtroSkus || envioGratisActivo;
    };

    return(
        <>
            <Helmet>
                <title>Camas Funcionales | Dormihogar</title>
                <meta name='description' content='En dormihogar contamos con una gran variedad en camas funcionales. Contamos con box espacio, cama divan, camarotes, cunas y camas infantiles.' />
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <div className='products-page-blocks'>
                    <img src='/assets/imagenes/productos/camas-funcionales/cat-banner.png' className='h-cat-banner' alt=''/>

                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20-to-10'>
                                <div className='hp-cat-title'>
                                    <h1>Camas Funcionales</h1>
                                    <p className='text'>Encuentra la cama funcional ideal para tu espacio, en las mejores marcas del mercado</p>
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
                                        {hayFiltrosActivos() && (
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
                                        {renderCategoriaFilters()}
                                        {renderFiltroDinamico('marca', valoresDisponibles.marcas, 'Marcas')}
                                        {renderFiltroDinamico('tamaño', valoresDisponibles.tamaños, 'Tamaños')}
                                        {renderFiltroDinamico('línea', valoresDisponibles.líneas, 'Líneas')}
                                        {renderFiltroDinamico('apertura-box', valoresDisponibles['apertura-box'], 'Apertura de Box', true)}
                                        {renderFiltroDinamico('tipo-de-baúl', valoresDisponibles['tipo-de-baúl'], 'Tipo de Baúl')}
                                        {renderFiltroDinamico('incluye-colchón', valoresDisponibles['incluye-colchón'], 'Incluye Colchón')}
                                        {renderFiltroDinamico('tipo-de-cabecera', valoresDisponibles['tipo-de-cabecera'], 'Tipo de Cabecera')}
                                        {renderFiltrosEspecificos()}
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

                                                    {hayFiltrosActivos() && (
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

export default CamasFuncionales;
