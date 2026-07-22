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
    
    console.log(`🔍 Comparando marca - Producto: "${marcaProducto}" (normalizado: "${marcaProductoNormalizado}") | Filtro: "${marcaFiltro}" (normalizado: "${marcaFiltroNormalizado}")`);
    
    // Caso especial: KAMAS - SOLO EXACTO
    if (marcaFiltroNormalizado === 'kamas') {
        // Solo coincide si es exactamente "kamas"
        return marcaProductoNormalizado === 'kamas';
    }
    
    // Caso: KOMFORT - contiene "komfort"
    if (marcaFiltroNormalizado === 'komfort') {
        return marcaProductoNormalizado.includes('komfort');
    }
    
    // Caso: PARAISO - contiene "paraiso"
    if (marcaFiltroNormalizado === 'paraiso') {
        return marcaProductoNormalizado.includes('paraiso');
    }
    
    // Caso: EL-CISNE - contiene "el-cisne"
    if (marcaFiltroNormalizado === 'el-cisne') {
        return marcaProductoNormalizado.includes('el-cisne');
    }
    
    // Para cualquier otra marca, comparación exacta
    return marcaProductoNormalizado === marcaFiltroNormalizado;
};

// Función para obtener líneas de dormitorio según la marca
const getLineasDormitorioByMarca = (marca) => {
    const marcaNormalizada = normalizarTexto(marca);
    
    // Definir las excepciones por marca
    const excepciones = {
        'kamas': {
            lineasPermitidas: ['americanos', 'europeos', 'circulares', 'nube', 'clásicos']
        },
        'paraiso': {
            lineasPermitidas: ['americanos', 'europeos']
        },
        'el-cisne': {
            lineasPermitidas: ['americanos', 'europeos']
        },
        'komfort': {
            lineasPermitidas: ['americanos']
        }
    };
    
    // Si la marca tiene excepciones definidas, usarlas
    if (excepciones[marcaNormalizada]) {
        return excepciones[marcaNormalizada].lineasPermitidas;
    }
    
    // Si no tiene excepciones, devolver null (significa "todas")
    return null;
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
    const itemsPerPage = 28;

    const [activeFilters, setActiveFilters] = useState({
        tamaño: null,
        marca: null,
        lineaDormitorio: null,
        resorte: null,
        lineaColchon: null,
        modelo: null,
        tipoCabecera: null,
        diseñoCabecera: null,
        cajon: null,
        cantidadCajones: null,
        baul: null,
        piecera: null
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
        'linea-dormitorio': 'lineaDormitorio',
        'resorte': 'resorte',
        'linea-colchon': 'lineaColchon',
        'modelo': 'modelo',
        'tipo-cabecera': 'tipoCabecera',
        'diseño-cabecera': 'diseñoCabecera',
        'cajon': 'cajon',
        'cantidad-cajones': 'cantidadCajones',
        'baul': 'baul',
        'piecera': 'piecera'
    };

    const paramMap = {
        tamaño: 'tamaño',
        marca: 'marca',
        lineaDormitorio: 'linea-dormitorio',
        resorte: 'resorte',
        lineaColchon: 'linea-colchon',
        modelo: 'modelo',
        tipoCabecera: 'tipo-cabecera',
        diseñoCabecera: 'diseño-cabecera',
        cajon: 'cajon',
        cantidadCajones: 'cantidad-cajones',
        baul: 'baul',
        piecera: 'piecera'
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

    // Forzar la aplicación de filtros desde URL al cargar
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const marcaFromUrl = params.get('marca');
        
        if (marcaFromUrl) {
            setActiveFilters(prev => ({
                ...prev,
                marca: marcaFromUrl
            }));
        }
    }, []);

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

                const pathParts = location.pathname.split('/');
                const tamanioIndex = pathParts.indexOf('dormitorios') + 1;
                const tamanio = pathParts[tamanioIndex];
                
                console.log('🔍 Tamaño detectado desde URL:', tamanio);

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/dormitorios/')
                );

                if (tamanio) {
                    const tamanioNormalizado = normalizarTexto(tamanio);
                    archivosProductos = archivosProductos.filter(url => {
                        const urlParts = url.split('/');
                        const tamanioIndexInUrl = urlParts.indexOf('dormitorios') + 1;
                        const tamanioFromUrl = urlParts[tamanioIndexInUrl];
                        const tamanioNormalizadoFromUrl = normalizarTexto(tamanioFromUrl);
                        return tamanioNormalizadoFromUrl === tamanioNormalizado;
                    });
                }

                if (archivosProductos.length === 0) {
                    archivosProductos = archivos.filter(url =>
                        url.startsWith('/assets/json/categorias/dormitorios/')
                    );
                }

                if (sub2 && archivosProductos.length > 0) {
                    const marcaNormalizada = normalizarTexto(sub2);
                    archivosProductos = archivosProductos.filter(url => {
                        const urlParts = url.split('/');
                        const marcaIndex = urlParts.indexOf('dormitorios') + 2;
                        const marcaFromUrl = urlParts[marcaIndex];
                        return marcaFromUrl && normalizarTexto(marcaFromUrl) === marcaNormalizada;
                    });
                }

                if (sub3 && archivosProductos.length > 0) {
                    const modeloNormalizado = normalizarTexto(sub3);
                    archivosProductos = archivosProductos.filter(url => {
                        const urlParts = url.split('/');
                        const modeloIndex = urlParts.indexOf('dormitorios') + 3;
                        const modeloFromUrl = urlParts[modeloIndex];
                        return modeloFromUrl && normalizarTexto(modeloFromUrl) === modeloNormalizado;
                    });
                }

                if (sub4 && archivosProductos.length > 0) {
                    const tipoNormalizado = normalizarTexto(sub4);
                    archivosProductos = archivosProductos.filter(url => {
                        const urlParts = url.split('/');
                        const tipoIndex = urlParts.indexOf('dormitorios') + 4;
                        const tipoFromUrl = urlParts[tipoIndex];
                        return tipoFromUrl && normalizarTexto(tipoFromUrl) === tipoNormalizado;
                    });
                }

                const productosPromesas = archivosProductos.map(async (url) => {
                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        const productosConFicha = data.productos?.map(producto => {
                            if (!producto.tamaño) {
                                const urlParts = url.split('/');
                                const tamanioIndex = urlParts.indexOf('dormitorios') + 1;
                                const tamanioFromUrl = urlParts[tamanioIndex];
                                if (tamanioFromUrl) {
                                    producto.tamaño = tamanioFromUrl;
                                }
                            }
                            return {
                                ...producto,
                                fichaTecnica: data.ficha?.[0] || {}
                            };
                        }) || [];
                        
                        return productosConFicha;
                    } catch (error) {
                        console.error(`Error cargando archivo ${url}:`, error);
                        return [];
                    }
                });

                const productosPorArchivo = await Promise.all(productosPromesas);
                const todosProductos = productosPorArchivo.flat();

                console.log('✅ Total de productos cargados:', todosProductos.length);

                setProductos(todosProductos);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de dormitorios:", error);
                setLoading(false);
            }
        };

        cargarProductosDormitorios();
    }, [sub1, sub2, sub3, sub4, location.pathname]);

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

        if (fieldName === 'cajon') {
            console.log('🔍 Buscando cajón en producto:', product.sku);
            console.log('  - product.cajon:', product.cajon);
            console.log('  - product["cajon"]:', product["cajon"]);
            console.log('  - product["cajón"]:', product["cajón"]);
            console.log('  - detalles:', product['detalles-del-producto']?.[0]);
        }

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

        // Mapeo de campos mejorado para cajones
        const fieldMappings = {
            'lineaDormitorio': ['línea-de-dormitorio', 'linea-de-dormitorio', 'linea-dormitorio', 'línea-dormitorio'],
            'lineaColchon': [
                'línea-de-colchón', 
                'linea-colchon', 
                'linea-colchón', 
                'línea-de-colchones', 
                'linea-colchones'
            ],
            'resorte': ['resorte', 'resortes', 'tipo-de-resorte', 'tipo-resorte'],
            'modelo': ['modelo', 'modelos', 'modelo-de-colchón', 'modelo-de-colchones'],
            'tipoCabecera': ['tipo-de-cabecera', 'tipo-cabecera', 'tipo-de-cabeceras'],
            'diseñoCabecera': ['diseño-de-cabecera', 'diseño-cabecera', 'diseños-de-cabecera'],
            // MEJORADO: Busca todas las variantes de cajón
            'cajon': ['cajón', 'cajon', 'cajones', 'tiene-cajon', 'tiene-cajón'],
            'cantidadCajones': ['cantidad-de-cajones', 'cantidad-cajones', 'cantidad-de-cajon', 'cantidad de cajones'],
            'baul': ['baúl', 'baul'],
            'piecera': ['piecera']
        };

        let keysToSearch = new Set();

        if (fieldMappings[fieldName]) {
            fieldMappings[fieldName].forEach(key => keysToSearch.add(key));
        } else {
            newVariants.forEach(v => keysToSearch.add(v));
        }

        // Buscar en el producto principal
        for (const key of keysToSearch) {
            if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
                const value = product[key];
                if (fieldName === 'cajon') {
                    console.log('✅ Encontrado en product.' + key + ':', value);
                }
                return typeof value === 'string' ? value : String(value);
            }
        }

        // Buscar en detalles-del-producto
        if (product['detalles-del-producto'] && product['detalles-del-producto'].length > 0) {
            const detalles = product['detalles-del-producto'][0];
            for (const key of keysToSearch) {
                if (detalles[key] !== undefined && detalles[key] !== null && detalles[key] !== '') {
                    const value = detalles[key];
                    if (fieldName === 'cajon') {
                        console.log('✅ Encontrado en detalles.' + key + ':', value);
                    }
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        // Buscar en ficha técnica
        if (product.fichaTecnica) {
            for (const key of keysToSearch) {
                if (product.fichaTecnica[key] !== undefined && product.fichaTecnica[key] !== null && product.fichaTecnica[key] !== '') {
                    const value = product.fichaTecnica[key];
                    if (fieldName === 'cajon') {
                        console.log('✅ Encontrado en fichaTecnica.' + key + ':', value);
                    }
                    return typeof value === 'string' ? value : String(value);
                }
            }
        }

        // Búsqueda flexible en todo el objeto
        for (const key of Object.keys(product)) {
            const keyLower = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            for (const searchKey of keysToSearch) {
                const searchLower = searchKey.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (keyLower === searchLower || keyLower.includes(searchLower) || searchLower.includes(keyLower)) {
                    if (product[key] !== undefined && product[key] !== null && product[key] !== '') {
                        const value = product[key];
                        if (fieldName === 'cajon') {
                            console.log('✅ Encontrado en búsqueda flexible.' + key + ':', value);
                        }
                        return typeof value === 'string' ? value : String(value);
                    }
                }
            }
        }

        if (fieldName === 'cajon') {
            console.log('❌ No se encontró cajón en el producto');
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

        // Jerarquía de dependencias
        const hierarchy = {
            'marca': ['lineaDormitorio', 'resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'lineaDormitorio': ['resorte', 'lineaColchon', 'modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'resorte': ['lineaColchon', 'modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'lineaColchon': ['modelo', 'tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'modelo': ['tipoCabecera', 'diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'tipoCabecera': ['diseñoCabecera', 'cajon', 'cantidadCajones', 'baul', 'piecera'],
            'diseñoCabecera': ['cajon', 'cantidadCajones', 'baul', 'piecera'],
            'cajon': ['cantidadCajones']
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
            
            // Limpiar filtros dependientes según jerarquía
            if (filterType === 'marca') {
                newFilters.marca = value;
                newFilters.lineaDormitorio = null;
                newFilters.resorte = null;
                newFilters.lineaColchon = null;
                newFilters.modelo = null;
                newFilters.tipoCabecera = null;
                newFilters.diseñoCabecera = null;
                newFilters.cajon = null;
                newFilters.cantidadCajones = null;
                newFilters.baul = null;
                newFilters.piecera = null;
            } else if (filterType === 'lineaDormitorio') {
                newFilters.lineaDormitorio = value;
                if (value === null) {
                    newFilters.resorte = null;
                    newFilters.lineaColchon = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'resorte') {
                newFilters.resorte = value;
                if (value === null) {
                    newFilters.lineaColchon = null;
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'lineaColchon') {
                newFilters.lineaColchon = value;
                if (value === null) {
                    newFilters.modelo = null;
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'modelo') {
                newFilters.modelo = value;
                if (value === null) {
                    newFilters.tipoCabecera = null;
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'tipoCabecera') {
                newFilters.tipoCabecera = value;
                if (value === null) {
                    newFilters.diseñoCabecera = null;
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'diseñoCabecera') {
                newFilters.diseñoCabecera = value;
                if (value === null) {
                    newFilters.cajon = null;
                    newFilters.cantidadCajones = null;
                    newFilters.baul = null;
                    newFilters.piecera = null;
                }
            } else if (filterType === 'cajon') {
                newFilters.cajon = value;
                if (value === null) {
                    newFilters.cantidadCajones = null;
                }
            } else {
                newFilters[filterType] = value;
            }
            
            updateURL(filterType, value);
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

    // Función para verificar si un modelo existe
    const verificarModeloExiste = (filtrosData, activeFilters, sub1) => {
        if (!filtrosData || !filtrosData.filtros || !filtrosData.filtros[0]) return false;
        
        const tamaños = filtrosData.filtros[0].tamaño;
        const tamañoActual = sub1 || activeFilters.tamaño || null;
        
        if (!tamañoActual) return false;
        
        const tamañoData = tamaños.find(t => 
            normalizarTexto(t.tamaño) === normalizarTexto(tamañoActual)
        );
        
        if (!tamañoData) return false;
        
        const marcas = tamañoData.marcas || [];
        
        for (const marca of marcas) {
            if (normalizarTexto(marca.marca) !== normalizarTexto(activeFilters.marca)) continue;
            
            const colchones = marca.colchón || [];
            for (const colchon of colchones) {
                const resortes = colchon.resortes || [];
                for (const resorte of resortes) {
                    if (normalizarTexto(resorte.resorte) !== normalizarTexto(activeFilters.resorte)) continue;
                    
                    const lineasColchon = resorte['líneas-de-colchones'] || resorte['líneas-de-colchón'] || [];
                    for (const lc of lineasColchon) {
                        const nombreLineaColchon = lc['línea-de-colchón'] || lc['línea-de-colchon'];
                        if (normalizarTexto(nombreLineaColchon) !== normalizarTexto(activeFilters.lineaColchon)) continue;
                        
                        const modelos = lc['modelos-de-colchones'] || [];
                        const existe = modelos.some(m => {
                            const nombreModelo = m['modelo-de-colchón'] || m.modelo;
                            return normalizarTexto(nombreModelo) === normalizarTexto(activeFilters.modelo);
                        });
                        if (existe) return true;
                    }
                }
            }
        }
        return false;
    };

    // ============================================
    // FILTRO DE PRODUCTOS MEJORADO
    // ============================================
    const productosFiltrados = useMemo(() => {
        if (productos.length === 0) return [];

        console.log('🔍 Iniciando filtrado...');
        console.log('🔍 Filtros activos:', activeFilters);

        const filtrados = productos.filter(producto => {
            let cumpleTodosLosFiltros = true;

            // Filtro de envío gratis
            if (envioGratisActivo) {
                if (producto["tipo-de-envio"] !== "Gratis") {
                    cumpleTodosLosFiltros = false;
                }
            }

            // Filtro de SKUs
            if (cumpleTodosLosFiltros && filtroSkus && Array.isArray(filtroSkus) && filtroSkus.length > 0) {
                if (!filtroSkus.includes(producto.sku)) {
                    cumpleTodosLosFiltros = false;
                }
            }

            // Filtros individuales
            const checks = [
                { filter: 'tamaño', field: 'tamaño' },
                { filter: 'marca', field: 'marca', special: 'compararMarcas' },
                { filter: 'lineaDormitorio', field: 'lineaDormitorio' },
                { filter: 'resorte', field: 'resorte' },
                { filter: 'lineaColchon', field: 'lineaColchon' },
                { filter: 'modelo', field: 'modelo' },
                { filter: 'tipoCabecera', field: 'tipoCabecera' },
                { filter: 'diseñoCabecera', field: 'diseñoCabecera' },
                { filter: 'cajon', field: 'cajon' },
                { filter: 'cantidadCajones', field: 'cantidadCajones' },
                { filter: 'baul', field: 'baul' },
                { filter: 'piecera', field: 'piecera' }
            ];

            for (const check of checks) {
                if (cumpleTodosLosFiltros && activeFilters[check.filter]) {
                    const valorProducto = getProductValue(producto, check.field);
                    
                    // Para depuración del filtro de cajones
                    if (check.filter === 'cajon') {
                        console.log(`🔍 Comparando cajón - Producto: ${producto.sku}, Valor: "${valorProducto}", Filtro: "${activeFilters.cajon}"`);
                    }
                    
                    if (!valorProducto) {
                        cumpleTodosLosFiltros = false;
                        if (check.filter === 'cajon') {
                            console.log(`❌ Producto ${producto.sku} no tiene valor para cajón`);
                        }
                        break;
                    }
                    
                    // Usar comparación especial para marca
                    if (check.special === 'compararMarcas') {
                        if (!compararMarcas(valorProducto, activeFilters.marca)) {
                            cumpleTodosLosFiltros = false;
                            break;
                        }
                    } else {
                        const valorNormalizado = normalizarTexto(valorProducto);
                        const filtroNormalizado = normalizarTexto(activeFilters[check.filter]);
                        
                        if (valorNormalizado !== filtroNormalizado) {
                            cumpleTodosLosFiltros = false;
                            if (check.filter === 'cajon') {
                                console.log(`❌ Producto ${producto.sku} no coincide: ${valorNormalizado} !== ${filtroNormalizado}`);
                            }
                            break;
                        }
                    }
                }
            }

            return cumpleTodosLosFiltros;
        });

        console.log(`✅ Productos filtrados: ${filtrados.length} de ${productos.length}`);
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
            lineaDormitorio: null,
            resorte: null,
            lineaColchon: null,
            modelo: null,
            tipoCabecera: null,
            diseñoCabecera: null,
            cajon: null,
            cantidadCajones: null,
            baul: null,
            piecera: null
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
        
        if (!activeFilters.marca) return null;
        
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

        // 1. Líneas de dormitorio (Filtradas según la marca desde código)
        if (filtrosData.filtros[1] && filtrosData.filtros[1]['líneas-de-dormitorios']) {
            const todasLasLineas = filtrosData.filtros[1]['líneas-de-dormitorios'];
            let lineasFiltradas = todasLasLineas;
            
            // Si hay una marca seleccionada, aplicar filtros específicos
            if (activeFilters.marca) {
                const lineasPermitidas = getLineasDormitorioByMarca(activeFilters.marca);
                
                if (lineasPermitidas) {
                    lineasFiltradas = todasLasLineas.filter(item => {
                        const nombreLinea = item['línea-de-dormitorio'];
                        return lineasPermitidas.some(permitida => 
                            normalizarTexto(permitida) === normalizarTexto(nombreLinea)
                        );
                    });
                }
            }
            
            if (lineasFiltradas.length > 0) {
                elementos.push(
                    <div className={`prds-filter-tag ${activeFilters.lineaDormitorio ? 'active' : ''}`} key="lineaDormitorio">
                        <div 
                            className='prds-filter-title-container'
                            onClick={(e) => {
                                const parent = e.currentTarget.closest('.prds-filter-tag');
                                parent?.classList.toggle('active');
                            }}
                        >
                            <p className='prds-filter-title'>Línea de dormitorio</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </div>

                        <div className='prds-filter-tag-results-container'>
                            <ul>
                                {lineasFiltradas.map((item, index) => {
                                    const nombreLinea = item['línea-de-dormitorio'];
                                    const isActive = activeFilters.lineaDormitorio === nombreLinea;
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button'
                                                className={isActive ? 'active' : ''}
                                                onClick={() => toggleFiltro('linea-dormitorio', isActive ? null : nombreLinea)}
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

        // 2. Resortes (desde la marca)
        if (activeFilters.lineaDormitorio && marcaData.colchón) {
            const colchones = marcaData.colchón || [];
            
            // Obtener todos los resortes únicos
            const resortesSet = new Set();
            colchones.forEach(colchon => {
                if (colchon.resortes && Array.isArray(colchon.resortes)) {
                    colchon.resortes.forEach(resorte => {
                        resortesSet.add(resorte.resorte);
                    });
                }
            });
            
            const resortesUnicos = Array.from(resortesSet);
            
            if (resortesUnicos.length > 0) {
                elementos.push(
                    <div className={`prds-filter-tag ${activeFilters.resorte ? 'active' : ''}`} key="resorte">
                        <div 
                            className='prds-filter-title-container'
                            onClick={(e) => {
                                const parent = e.currentTarget.closest('.prds-filter-tag');
                                parent?.classList.toggle('active');
                            }}
                        >
                            <p className='prds-filter-title'>Resorte</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </div>

                        <div className='prds-filter-tag-results-container'>
                            <ul>
                                {resortesUnicos.map((resorte, index) => {
                                    const isActive = activeFilters.resorte === resorte;
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button'
                                                className={isActive ? 'active' : ''}
                                                onClick={() => toggleFiltro('resorte', isActive ? null : resorte)}
                                            >
                                                <span></span>
                                                <p>{resorte}</p>
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

        // 3. Líneas de colchón (desde el resorte seleccionado)
        if (activeFilters.resorte && marcaData.colchón) {
            const colchones = marcaData.colchón || [];
            const lineasColchonSet = new Set();
            
            colchones.forEach(colchon => {
                if (colchon.resortes && Array.isArray(colchon.resortes)) {
                    colchon.resortes.forEach(resorte => {
                        if (normalizarTexto(resorte.resorte) === normalizarTexto(activeFilters.resorte)) {
                            const lineas = resorte['líneas-de-colchones'] || resorte['líneas-de-colchón'] || [];
                            lineas.forEach(lc => {
                                const nombre = lc['línea-de-colchón'] || lc['línea-de-colchon'];
                                if (nombre) lineasColchonSet.add(nombre);
                            });
                        }
                    });
                }
            });
            
            const lineasColchonUnicas = Array.from(lineasColchonSet);
            
            if (lineasColchonUnicas.length > 0) {
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
                                {lineasColchonUnicas.map((linea, index) => {
                                    const isActive = activeFilters.lineaColchon === linea;
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button'
                                                className={isActive ? 'active' : ''}
                                                onClick={() => toggleFiltro('linea-colchon', isActive ? null : linea)}
                                            >
                                                <span></span>
                                                <p>{linea}</p>
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

        // 4. Modelos (desde la línea de colchón seleccionada)
        if (activeFilters.lineaColchon && activeFilters.resorte && marcaData.colchón) {
            const colchones = marcaData.colchón || [];
            const modelosSet = new Set();
            
            colchones.forEach(colchon => {
                if (colchon.resortes && Array.isArray(colchon.resortes)) {
                    colchon.resortes.forEach(resorte => {
                        if (normalizarTexto(resorte.resorte) === normalizarTexto(activeFilters.resorte)) {
                            const lineas = resorte['líneas-de-colchones'] || resorte['líneas-de-colchón'] || [];
                            lineas.forEach(lc => {
                                const nombreLinea = lc['línea-de-colchón'] || lc['línea-de-colchon'];
                                if (normalizarTexto(nombreLinea) === normalizarTexto(activeFilters.lineaColchon)) {
                                    const modelos = lc['modelos-de-colchones'] || [];
                                    modelos.forEach(m => {
                                        const nombre = m['modelo-de-colchón'] || m.modelo;
                                        if (nombre) modelosSet.add(nombre);
                                    });
                                }
                            });
                        }
                    });
                }
            });
            
            const modelosUnicos = Array.from(modelosSet);
            
            if (modelosUnicos.length > 0) {
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
                                {modelosUnicos.map((modelo, index) => {
                                    const isActive = activeFilters.modelo === modelo;
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button'
                                                className={isActive ? 'active' : ''}
                                                onClick={() => toggleFiltro('modelo', isActive ? null : modelo)}
                                            >
                                                <span></span>
                                                <p>{modelo}</p>
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

        // 5. Tipos de cabecera (GLOBAL - Solo si hay modelo seleccionado)
        if (activeFilters.modelo && filtrosData.filtros[2] && filtrosData.filtros[2]['tipos-de-cabecera']) {
            const modeloExiste = verificarModeloExiste(filtrosData, activeFilters, sub1);
            
            if (modeloExiste) {
                const tiposCabecera = filtrosData.filtros[2]['tipos-de-cabecera'];
                
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

        // 6. Diseños de cabecera (GLOBAL - Solo si hay tipo de cabecera seleccionado)
        if (activeFilters.tipoCabecera && activeFilters.modelo && filtrosData.filtros[3] && filtrosData.filtros[3]['diseños-de-cabecera']) {
            const modeloExiste = verificarModeloExiste(filtrosData, activeFilters, sub1);
            
            if (modeloExiste) {
                const diseñosCabecera = filtrosData.filtros[3]['diseños-de-cabecera'];
                
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

        // 7. Cajones (GLOBAL - Solo si hay modelo seleccionado)
        if (activeFilters.modelo && filtrosData.filtros[4] && filtrosData.filtros[4]['cajones']) {
            const modeloExiste = verificarModeloExiste(filtrosData, activeFilters, sub1);
            
            if (modeloExiste) {
                const cajones = filtrosData.filtros[4]['cajones'];
                
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
                                {cajones.map((item, index) => {
                                    // Soporte para cajón con y sin acento
                                    const valorCajon = item.cajón || item.cajon;
                                    const isActive = activeFilters.cajon === valorCajon;
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button'
                                                className={isActive ? 'active' : ''}
                                                onClick={() => toggleFiltro('cajon', isActive ? null : valorCajon)}
                                            >
                                                <span></span>
                                                <p>{valorCajon}</p>
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

        // 8. Cantidad de cajones (Solo si se seleccionó "si" en cajones)
        if (activeFilters.cajon === 'si' && activeFilters.modelo && filtrosData.filtros[4] && filtrosData.filtros[4]['cajones']) {
            const modeloExiste = verificarModeloExiste(filtrosData, activeFilters, sub1);
            
            if (modeloExiste) {
                const cajonesData = filtrosData.filtros[4]['cajones'];
                const cajonData = cajonesData.find(c => {
                    const valor = c.cajón || c.cajon;
                    return valor === 'si';
                });
                
                if (cajonData && cajonData['cantidad-de-cajones'] && cajonData['cantidad-de-cajones'].length > 0) {
                    const cantidades = cajonData['cantidad-de-cajones'];
                    
                    elementos.push(
                        <div className={`prds-filter-tag ${activeFilters.cantidadCajones ? 'active' : ''}`} key="cantidadCajones">
                            <div 
                                className='prds-filter-title-container'
                                onClick={(e) => {
                                    const parent = e.currentTarget.closest('.prds-filter-tag');
                                    parent?.classList.toggle('active');
                                }}
                            >
                                <p className='prds-filter-title'>Cantidad de cajones</p>
                                <span className="material-symbols-outlined">keyboard_arrow_down</span>
                            </div>

                            <div className='prds-filter-tag-results-container'>
                                <ul>
                                    {cantidades.map((cantidad, index) => {
                                        const isActive = activeFilters.cantidadCajones === cantidad;
                                        return (
                                            <li key={index}>
                                                <button 
                                                    type='button'
                                                    className={isActive ? 'active' : ''}
                                                    onClick={() => toggleFiltro('cantidad-cajones', isActive ? null : cantidad)}
                                                >
                                                    <span></span>
                                                    <p>{cantidad}</p>
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

        // 9. Baúles (GLOBAL - Solo si hay modelo seleccionado)
        if (activeFilters.modelo && filtrosData.filtros[5] && filtrosData.filtros[5]['baúles']) {
            const modeloExiste = verificarModeloExiste(filtrosData, activeFilters, sub1);
            
            if (modeloExiste) {
                const baules = filtrosData.filtros[5]['baúles'];
                
                elementos.push(
                    <div className={`prds-filter-tag ${activeFilters.baul ? 'active' : ''}`} key="baul">
                        <div 
                            className='prds-filter-title-container'
                            onClick={(e) => {
                                const parent = e.currentTarget.closest('.prds-filter-tag');
                                parent?.classList.toggle('active');
                            }}
                        >
                            <p className='prds-filter-title'>Baúl</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </div>

                        <div className='prds-filter-tag-results-container'>
                            <ul>
                                {baules.map((item, index) => {
                                    const valorBaul = item.baúl || item.baul;
                                    const isActive = activeFilters.baul === valorBaul;
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button'
                                                className={isActive ? 'active' : ''}
                                                onClick={() => toggleFiltro('baul', isActive ? null : valorBaul)}
                                            >
                                                <span></span>
                                                <p>{valorBaul}</p>
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

        // 10. Pieceras (GLOBAL - Solo si hay modelo seleccionado)
        if (activeFilters.modelo && filtrosData.filtros[6] && filtrosData.filtros[6]['pieceras']) {
            const modeloExiste = verificarModeloExiste(filtrosData, activeFilters, sub1);
            
            if (modeloExiste) {
                const pieceras = filtrosData.filtros[6]['pieceras'];
                
                elementos.push(
                    <div className={`prds-filter-tag ${activeFilters.piecera ? 'active' : ''}`} key="piecera">
                        <div 
                            className='prds-filter-title-container'
                            onClick={(e) => {
                                const parent = e.currentTarget.closest('.prds-filter-tag');
                                parent?.classList.toggle('active');
                            }}
                        >
                            <p className='prds-filter-title'>Piecera</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </div>

                        <div className='prds-filter-tag-results-container'>
                            <ul>
                                {pieceras.map((item, index) => {
                                    const isActive = activeFilters.piecera === item.piecera;
                                    return (
                                        <li key={index}>
                                            <button 
                                                type='button'
                                                className={isActive ? 'active' : ''}
                                                onClick={() => toggleFiltro('piecera', isActive ? null : item.piecera)}
                                            >
                                                <span></span>
                                                <p>{item.piecera}</p>
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
                                        {(activeFilters.tamaño || activeFilters.marca || activeFilters.lineaDormitorio || 
                                          activeFilters.resorte || activeFilters.lineaColchon || activeFilters.modelo || 
                                          activeFilters.tipoCabecera || activeFilters.diseñoCabecera || 
                                          activeFilters.cajon || activeFilters.cantidadCajones || 
                                          activeFilters.baul || activeFilters.piecera || 
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
