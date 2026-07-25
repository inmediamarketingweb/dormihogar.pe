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

function Sofas() {
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

    // Estado para el modo de vista (grid o list)
    const [viewMode, setViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewModeSofas');
        return savedMode || 'grid';
    });

    const [activeFilters, setActiveFilters] = useState({
        subcategoria: null,
        marca: null,
        tipo: null,
        configuracion: null,
        posicion: null,
        tamaño: null,
        modelo: null
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
        'subcategoria': 'subcategoria',
        'marca': 'marca',
        'tipo': 'tipo',
        'configuracion': 'configuracion',
        'posicion': 'posicion',
        'tamaño': 'tamaño',
        'modelo': 'modelo'
    };

    const paramMap = {
        subcategoria: 'subcategoria',
        marca: 'marca',
        tipo: 'tipo',
        configuracion: 'configuracion',
        posicion: 'posicion',
        tamaño: 'tamaño',
        modelo: 'modelo'
    };

    // Orden jerárquico de los filtros
    const ordenFiltros = [
        'subcategoria',
        'marca',
        'tipo',
        'configuracion',
        'posicion',
        'tamaño',
        'modelo'
    ];

    // Guardar viewMode en localStorage
    useEffect(() => {
        localStorage.setItem('viewModeSofas', viewMode);
    }, [viewMode]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const newActiveFilters = { ...activeFilters };
        let hasChanges = false;

        // Si no hay sub1 en la URL (Ver todos), limpiar la subcategoría
        if (!sub1) {
            if (newActiveFilters.subcategoria !== null) {
                newActiveFilters.subcategoria = null;
                hasChanges = true;
            }
        } else if (sub1 && filtrosData?.filtros) {
            // Si hay sub1, buscar la subcategoría correspondiente
            const subcategoriasFilter = filtrosData.filtros.find(f => f.subcategorías);
            if (subcategoriasFilter) {
                const subcategoriaEncontrada = subcategoriasFilter.subcategorías.find(item => 
                    item.ruta.includes(sub1)
                );
                if (subcategoriaEncontrada) {
                    newActiveFilters.subcategoria = subcategoriaEncontrada.subcategoría;
                    hasChanges = true;
                }
            }
        }

        Object.entries(filterParamMap).forEach(([paramKey, stateKey]) => {
            const value = params.get(paramKey);
            if (value !== null) {
                newActiveFilters[stateKey] = value;
                hasChanges = true;
            } else if (newActiveFilters[stateKey] !== null && stateKey !== 'subcategoria') {
                newActiveFilters[stateKey] = null;
                hasChanges = true;
            }
        });

        if (hasChanges) {
            setActiveFilters(newActiveFilters);
        }
    }, [location.search, sub1, filtrosData]);

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
        const cargarProductosSofas = async () => {
            try {
                setLoading(true);

                const manifestResponse = await fetch('/assets/json/manifest.json');
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];

                let archivosProductos = archivos.filter(url =>
                    url.startsWith('/assets/json/categorias/sofas/')
                );

                // Si NO hay sub1 (Ver todos), cargar TODOS los productos de sofás
                if (!sub1) {
                    // No filtramos por subcategoría, cargamos todos
                } else {
                    // Si hay sub1, filtrar por esa subcategoría
                    archivosProductos = archivosProductos.filter(
                        url => url.includes(`/sofas/${sub1}/`)
                    );

                    if (sub2) {
                        archivosProductos = archivosProductos.filter(
                            url => url.includes(`/sofas/${sub1}/${sub2}/`)
                        );
                    }

                    // Si hay sub3, filtrar por ese nivel
                    if (sub3) {
                        archivosProductos = archivosProductos.filter(
                            url => url.includes(`/sofas/${sub1}/${sub2}/${sub3}/`)
                        );
                    }

                    // Si hay sub4, no filtramos por archivo, solo lo usamos para filtrar productos después
                    // (sub4 generalmente es el ID del producto)
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
                let todosProductos = productosPorArchivo.flat();

                // Si hay sub4, filtrar por el ID del producto
                if (sub4) {
                    const productId = parseInt(sub4);
                    if (!isNaN(productId)) {
                        todosProductos = todosProductos.filter(producto => 
                            producto.id === productId
                        );
                    }
                }

                setProductos(todosProductos);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos de sofás:", error);
                setLoading(false);
            }
        };

        cargarProductosSofas();
    }, [sub1, sub2, sub3, sub4]);

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                const response = await fetch('/assets/json/categorias/sofas/filtros.json');
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
            'subcategoria': ['subcategoria', 'subcategoría', 'subcategorias', 'subcategorías', 'categoria', 'categoría'],
            'marca': ['marca', 'marcas'],
            'tipo': ['tipo', 'tipos', 'tipo-de-sofa', 'tipo-de-sofas'],
            'configuracion': ['configuración', 'configuracion', 'configuraciones', 'configuración-de-sofa'],
            'posicion': ['posición', 'posicion', 'posiciones', 'orientacion', 'orientación'],
            'tamaño': ['tamaño', 'tamaños', 'medida', 'medidas', 'tamano', 'tamanos'],
            'modelo': ['modelo', 'modelos']
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
        const paramName = paramMap[filterType] || filterType;

        if (value === null || value === undefined) {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        // Limpiar filtros dependientes jerárquicos
        const hierarchy = {
            'subcategoria': ['marca', 'tipo', 'configuracion', 'posicion', 'tamaño', 'modelo'],
            'marca': ['tipo', 'configuracion', 'posicion', 'tamaño', 'modelo'],
            'tipo': ['configuracion', 'posicion', 'tamaño', 'modelo'],
            'configuracion': ['posicion', 'tamaño', 'modelo'],
            'posicion': ['tamaño', 'modelo'],
            'tamaño': ['modelo']
        };

        if (hierarchy[filterType]) {
            hierarchy[filterType].forEach(dependent => {
                params.delete(paramMap[dependent] || dependent);
            });
        }

        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
        
        scrollToTop();
    };

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => {
            const newFilters = { ...prev };
            
            if (filterType === 'subcategoria') {
                newFilters.subcategoria = value;
                newFilters.marca = null;
                newFilters.tipo = null;
                newFilters.configuracion = null;
                newFilters.posicion = null;
                newFilters.tamaño = null;
                newFilters.modelo = null;
            } else if (filterType === 'marca') {
                newFilters.marca = value;
                newFilters.tipo = null;
                newFilters.configuracion = null;
                newFilters.posicion = null;
                newFilters.tamaño = null;
                newFilters.modelo = null;
            } else if (filterType === 'tipo') {
                newFilters.tipo = value;
                if (value === null) {
                    newFilters.configuracion = null;
                    newFilters.posicion = null;
                    newFilters.tamaño = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'configuracion') {
                newFilters.configuracion = value;
                if (value === null) {
                    newFilters.posicion = null;
                    newFilters.tamaño = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'posicion') {
                newFilters.posicion = value;
                if (value === null) {
                    newFilters.tamaño = null;
                    newFilters.modelo = null;
                }
            } else if (filterType === 'tamaño') {
                newFilters.tamaño = value;
                if (value === null) {
                    newFilters.modelo = null;
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

    // Función para obtener valores únicos de un campo de los productos
    const obtenerValoresUnicosDeProductos = (productosList, campo) => {
        const valores = new Set();
        productosList.forEach(producto => {
            const valor = getProductValue(producto, campo);
            if (valor && typeof valor === 'string' && valor.trim() !== '') {
                valores.add(valor.trim());
            }
        });
        return Array.from(valores).sort();
    };

    // Función para obtener productos filtrados por un conjunto específico de filtros
    const filtrarProductosPorFiltros = (productosList, filtrosAplicar) => {
        if (!productosList || productosList.length === 0) return [];
        if (!filtrosAplicar || Object.keys(filtrosAplicar).length === 0) return productosList;

        return productosList.filter(producto => {
            let cumpleTodos = true;

            for (const filterKey of ordenFiltros) {
                if (cumpleTodos && filtrosAplicar[filterKey]) {
                    const valorProducto = getProductValue(producto, filterKey);
                    
                    if (!valorProducto) {
                        cumpleTodos = false;
                        break;
                    }
                    
                    const valorNormalizado = normalizarTexto(valorProducto);
                    const filtroNormalizado = normalizarTexto(filtrosAplicar[filterKey]);
                    
                    if (valorNormalizado !== filtroNormalizado) {
                        cumpleTodos = false;
                        break;
                    }
                }
            }

            return cumpleTodos;
        });
    };

    // Productos filtrados base (solo con filtros superiores + envioGratis + filtroSkus)
    const productosBaseFiltrados = useMemo(() => {
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

            // Aplicar filtros de subcategoría y marca (superiores)
            const filtrosSuperiores = ['subcategoria', 'marca'];
            
            for (const filterKey of filtrosSuperiores) {
                if (cumpleTodosLosFiltros && activeFilters[filterKey]) {
                    const valorProducto = getProductValue(producto, filterKey);
                    
                    if (!valorProducto) {
                        cumpleTodosLosFiltros = false;
                        break;
                    }
                    
                    const valorNormalizado = normalizarTexto(valorProducto);
                    const filtroNormalizado = normalizarTexto(activeFilters[filterKey]);
                    
                    if (valorNormalizado !== filtroNormalizado) {
                        cumpleTodosLosFiltros = false;
                        break;
                    }
                }
            }

            return cumpleTodosLosFiltros;
        });
    }, [productos, activeFilters.subcategoria, activeFilters.marca, envioGratisActivo, filtroSkus]);

    // Productos filtrados completos (con todos los filtros)
    const productosFiltrados = useMemo(() => {
        return filtrarProductosPorFiltros(productosBaseFiltrados, activeFilters);
    }, [productosBaseFiltrados, activeFilters]);

    // Función para obtener productos filtrados hasta un filtro específico (excluyendo ese filtro y los siguientes)
    const obtenerProductosHastaFiltro = (filtroActual) => {
        const filtrosHasta = { ...activeFilters };
        // Eliminar el filtro actual y todos los siguientes
        const indexActual = ordenFiltros.indexOf(filtroActual);
        if (indexActual !== -1) {
            for (let i = indexActual; i < ordenFiltros.length; i++) {
                delete filtrosHasta[ordenFiltros[i]];
            }
        }
        return filtrarProductosPorFiltros(productosBaseFiltrados, filtrosHasta);
    };

    // Función para determinar si un filtro debe mostrarse
    const debeMostrarFiltro = (campo) => {
        // Verificar dependencias jerárquicas
        const dependencias = {
            'tipo': 'marca',
            'configuracion': 'tipo',
            'posicion': 'configuracion',
            'tamaño': 'posicion',
            'modelo': 'tamaño'
        };

        // Si el filtro tiene una dependencia, verificar que esté seleccionada
        if (dependencias[campo]) {
            const dependencia = dependencias[campo];
            return !!activeFilters[dependencia];
        }

        return true;
    };

    // Función para renderizar filtros dinámicos
    const renderFiltroDinamico = (campo, titulo, paramName) => {
        // Verificar si el filtro debe mostrarse según la jerarquía
        if (!debeMostrarFiltro(campo)) return null;
        
        // Obtener productos filtrados hasta el filtro anterior (excluyendo este)
        const productosFiltradosHasta = obtenerProductosHastaFiltro(campo);
        
        // Obtener valores únicos del campo de estos productos
        const valores = obtenerValoresUnicosDeProductos(productosFiltradosHasta, campo);
        
        // Si no hay valores, no mostrar el filtro
        if (valores.length === 0) return null;

        // Verificar si el filtro actual tiene al menos un producto disponible
        let productosConFiltro = [];
        if (activeFilters[campo]) {
            productosConFiltro = productosFiltradosHasta.filter(producto => {
                const valor = getProductValue(producto, campo);
                if (!valor) return false;
                return normalizarTexto(valor) === normalizarTexto(activeFilters[campo]);
            });
        }

        if (activeFilters[campo] && productosConFiltro.length === 0) {
            return null;
        }

        return (
            <div className={`prds-filter-tag ${activeFilters[campo] ? 'active' : ''}`}>
                <div 
                    className='prds-filter-title-container'
                    onClick={(e) => {
                        const parent = e.currentTarget.closest('.prds-filter-tag');
                        parent?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>{titulo}</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {valores.map((valor, index) => {
                            const isActive = activeFilters[campo] === valor;
                            return (
                                <li key={index}>
                                    <button 
                                        type='button'
                                        className={isActive ? 'active' : ''}
                                        onClick={() => toggleFiltro(paramName, isActive ? null : valor)}
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

    const renderSubcategoriasFilters = () => {
        if (!filtrosData?.filtros) return null;
        const subcategoriasFilter = filtrosData.filtros.find(f => f.subcategorías);
        if (!subcategoriasFilter) return null;

        const subcategorias = subcategoriasFilter.subcategorías;
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
                    <p className='prds-filter-title'>Subcategorías</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {subcategorias.map((item, index) => {
                            const finalUrl = item.ruta;
                            const currentPathNormalized = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
                            const linkPathNormalized = finalUrl.endsWith('/') ? finalUrl.slice(0, -1) : finalUrl;
                            const isActive = currentPathNormalized === linkPathNormalized;
                            
                            return (
                                <li key={index}>
                                    <Link 
                                        to={finalUrl}
                                        className={isActive ? 'active' : ''}
                                        title={`Ver productos de ${item.subcategoría}`}
                                        onClick={() => {
                                            setActiveFilters(prev => ({
                                                ...prev,
                                                subcategoria: item.subcategoría,
                                                marca: null,
                                                tipo: null,
                                                configuracion: null,
                                                posicion: null,
                                                tamaño: null,
                                                modelo: null
                                            }));
                                            scrollToTop();
                                        }}
                                    >
                                        <span></span>
                                        <p>{item.subcategoría}</p>
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
        if (!filtrosData?.filtros) return null;
        // Buscar marcas en el filtro de subcategorías
        const subcategoriasFilter = filtrosData.filtros.find(f => f.subcategorías);
        if (!subcategoriasFilter) return null;

        // Extraer todas las marcas de todas las subcategorías
        const todasLasMarcas = new Set();
        subcategoriasFilter.subcategorías.forEach(subcategoria => {
            if (subcategoria.marcas && Array.isArray(subcategoria.marcas)) {
                subcategoria.marcas.forEach(marcaItem => {
                    if (marcaItem.marca) {
                        todasLasMarcas.add(marcaItem.marca);
                    }
                });
            }
        });

        const marcas = Array.from(todasLasMarcas);

        // Verificar si hay productos con estas marcas
        const marcasConProductos = marcas.filter(marca => {
            const productosConMarca = productosBaseFiltrados.filter(producto => {
                const valor = getProductValue(producto, 'marca');
                return valor && normalizarTexto(valor) === normalizarTexto(marca);
            });
            return productosConMarca.length > 0;
        });

        if (marcasConProductos.length === 0) return null;

        return (
            <div className={`prds-filter-tag ${activeFilters.marca ? 'active' : ''}`}>
                <div 
                    className='prds-filter-title-container'
                    onClick={() => {
                        const tag = document.querySelectorAll('.prds-filter-tag')[1];
                        tag?.classList.toggle('active');
                    }}
                >
                    <p className='prds-filter-title'>Marcas</p>
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </div>

                <div className='prds-filter-tag-results-container'>
                    <ul>
                        {marcasConProductos.map((marca, index) => {
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
        if (!filtrosData?.filtros) return null;
        
        const elementos = [];

        // SIEMPRE mostrar marcas primero (si hay productos con marcas)
        const marcasFilter = renderMarcaFilters();
        if (marcasFilter) elementos.push(marcasFilter);

        // Obtener la subcategoría actual de la URL o de los filtros activos
        const subcategoriaActual = sub1 || activeFilters.subcategoria || null;
        
        // Si no hay subcategoría seleccionada (Ver todos), mostrar solo marcas
        if (!subcategoriaActual) {
            return elementos.length > 0 ? elementos : null;
        }

        // Si hay subcategoría pero no hay marca seleccionada, solo mostrar marcas
        if (!activeFilters.marca) {
            return elementos.length > 0 ? elementos : null;
        }

        // Tipo - visible si hay marca seleccionada
        if (activeFilters.marca) {
            const filtroTipo = renderFiltroDinamico('tipo', 'Tipo', 'tipo');
            if (filtroTipo) elementos.push(filtroTipo);
        }

        // Configuración - visible si hay tipo seleccionado
        if (activeFilters.tipo) {
            const filtroConfiguracion = renderFiltroDinamico('configuracion', 'Configuración', 'configuracion');
            if (filtroConfiguracion) elementos.push(filtroConfiguracion);
        }

        // Posición - visible si hay configuración seleccionada
        if (activeFilters.configuracion) {
            const filtroPosicion = renderFiltroDinamico('posicion', 'Posición', 'posicion');
            if (filtroPosicion) elementos.push(filtroPosicion);
        }

        // Tamaño - visible si hay posición seleccionada
        if (activeFilters.posicion) {
            const filtroTamaño = renderFiltroDinamico('tamaño', 'Tamaño', 'tamaño');
            if (filtroTamaño) elementos.push(filtroTamaño);
        }

        // Modelo - visible si hay tamaño seleccionado
        if (activeFilters.tamaño) {
            const filtroModelo = renderFiltroDinamico('modelo', 'Modelo', 'modelo');
            if (filtroModelo) elementos.push(filtroModelo);
        }

        return elementos.length > 0 ? elementos : null;
    };

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
            subcategoria: null,
            marca: null,
            tipo: null,
            configuracion: null,
            posicion: null,
            tamaño: null,
            modelo: null
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

    const hayFiltrosActivos = () => {
        const { ...otrosFiltros } = activeFilters;
        return Object.values(otrosFiltros).some(v => v !== null) || filtroSkus || envioGratisActivo;
    };

    return(
        <>
            <Helmet>
                <title>Sofás | Dormihogar</title>
                <meta name='description' content='En dormihogar contamos con una gran variedad en sofás. Contamos con las mejores marcas del mercado.' />
            </Helmet>

            <main className='products-page-main d-flex-column gap-10'>
                <div className='products-page-blocks'>
                    <img src='/assets/imagenes/productos/sofas/cat-banner.png' className='h-cat-banner' alt=''/>

                    <div className={`products-page-left ${isFiltersOpen ? 'active' : ''}`} ref={filtersPanelRef}>
                        <div className='products-page-filters-container-global'>
                            <div className='d-flex-column gap-20-to-10'>
                                <div className='hp-cat-title'>
                                    <h1>Sofás</h1>
                                    <p className='text'>Encuentra el sofá ideal para tu hogar, en las mejores marcas del mercado</p>
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
                                        {renderSubcategoriasFilters()}
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

export default Sofas;
