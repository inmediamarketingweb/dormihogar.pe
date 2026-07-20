import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import './SearchBar.css';

import LazyImage from '../../../Plantillas/LazyImage';
import { Producto } from '../../../Plantillas/Producto/Producto';

function SearchBar() {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchKey, setSearchKey] = useState(Date.now());
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const searchTimeout = useRef(null);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const mobileInputRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const small = window.innerWidth < 600;
            setIsSmallScreen(small);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchProductos = async () => {
            setIsLoading(true);
            try {
                const manifestResponse = await fetch('/assets/json/manifest.json');
                if (!manifestResponse.ok) {
                    console.error(manifestResponse.status);
                    return;
                }
                const manifestData = await manifestResponse.json();
                const archivos = manifestData.files || [];
                const productosArrays = await Promise.all(
                    archivos.map(async (archivo) => {
                        try {
                            const res = await fetch(archivo);
                            if (!res.ok) {
                                console.warn(`No OK (${res.status}) al cargar ${archivo}`);
                                return [];
                            }
                            const text = await res.text();
                            if (!text) {
                                console.warn(`Respuesta vacía para ${archivo}`);
                                return [];
                            }
                            const data = JSON.parse(text);
                            return data.productos || [];
                        } catch (err) {
                            console.error(`Error procesando ${archivo}:`, err);
                            return [];
                        }
                    })
                );

                setProductos(productosArrays.flat());
            } catch (error) {
                console.error('Error al cargar los productos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (searchTerm.trim().length >= 2 && productos.length === 0 && !isLoading) {
            clearTimeout(searchTimeout.current);
            searchTimeout.current = setTimeout(fetchProductos, 300);
        }

        return () => {
            clearTimeout(searchTimeout.current);
        };
    }, [searchTerm, productos.length, isLoading]);

    const normalizeStr = useCallback((str = '') => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }, []);

    const getRandomProductsFromCategory = useCallback((categoria, cantidad = 8) => {
        const productosFiltrados = productos.filter(p => 
            normalizeStr(p.categoria) === normalizeStr(categoria)
        );
        
        const shuffled = [...productosFiltrados];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled.slice(0, cantidad);
    }, [productos, normalizeStr]);

    const filteredProductos = useMemo(() => {
        if (categoriaSeleccionada) {
            const randomProducts = getRandomProductsFromCategory(categoriaSeleccionada);
            setSearchKey(Date.now());
            return randomProducts;
        }

        if (searchTerm.trim() === '') return [];

        const normalizedSearchTerm = normalizeStr(searchTerm);
        const searchTermWithoutSpaces = normalizedSearchTerm.replace(/\s/g, '');

        const exactSkuMatch = productos.find(p => 
            normalizeStr(p.sku).replace(/\s/g, '') === searchTermWithoutSpaces
        );

        let results = [];
        if (exactSkuMatch) {
            results = [exactSkuMatch];
        } else {
            const tokens = normalizedSearchTerm.split(' ').filter(Boolean);
            results = productos.filter(producto => {
                const fields = [
                    producto.nombre,
                    producto.sku,
                    producto.categoria,
                    producto.subcategoria
                ].map(String).map(normalizeStr);

                return tokens.every(token => 
                    fields.some(field => field.includes(token))
                );
            });
        }

        setSearchKey(Date.now());
        return results;
    }, [searchTerm, productos, normalizeStr, categoriaSeleccionada, getRandomProductsFromCategory]);

    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsSearchActive(value.trim() !== '');
        if (value.trim() !== '') {
            setCategoriaSeleccionada(null);
        }
        if (value.trim() === '') {
            setSearchKey(Date.now());
        }
    }, []);

    const handleInputClick = useCallback(() => {
        if (isSmallScreen) {
            if (isSearchActive) {
                setIsSearchActive(false);
                setSearchTerm('');
                setCategoriaSeleccionada(null);
                if (mobileInputRef.current) {
                    mobileInputRef.current.blur();
                }
                if (inputRef.current) {
                    inputRef.current.blur();
                }
            } else {
                setIsSearchActive(true);
                setTimeout(() => {
                    if (mobileInputRef.current) {
                        mobileInputRef.current.focus();
                    }
                }, 100);
            }
        } else {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [isSmallScreen, isSearchActive]);

    const handleInputFocus = useCallback(() => {
        setIsSearchActive(searchTerm.trim() !== '');
        if (isSmallScreen && searchTerm.trim() !== '') {
            setTimeout(() => {
                if (mobileInputRef.current) {
                    mobileInputRef.current.focus();
                }
            }, 100);
        }
    }, [searchTerm, isSmallScreen]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!searchTerm.trim()) return;
            if (filteredProductos.length === 1) {
                window.location.href = filteredProductos[0].ruta;
            } else if (filteredProductos.length > 1) {
                window.location.href = `/busqueda?query=${encodeURIComponent(searchTerm)}`;
            }
        } else if (e.key === 'Escape') {
            setSearchTerm('');
            setIsSearchActive(false);
            setCategoriaSeleccionada(null);
            setSearchKey(Date.now());
            if (inputRef.current) {
                inputRef.current.blur();
            }
            if (mobileInputRef.current) {
                mobileInputRef.current.blur();
            }
        }
    }, [searchTerm, filteredProductos]);

    const handleClear = useCallback(() => {
        setSearchTerm('');
        setIsSearchActive(false);
        setCategoriaSeleccionada(null);
        setSearchKey(Date.now());
        if (inputRef.current) {
            inputRef.current.focus();
        }
        if (mobileInputRef.current) {
            mobileInputRef.current.value = '';
        }
    }, []);

    const handleOverlayClick = useCallback(() => {
        setSearchTerm('');
        setIsSearchActive(false);
        setCategoriaSeleccionada(null);
        setSearchKey(Date.now());
        if (inputRef.current) {
            inputRef.current.blur();
        }
        if (mobileInputRef.current) {
            mobileInputRef.current.blur();
        }
    }, []);

    const handleCategoriaClick = useCallback((categoria) => {
        setCategoriaSeleccionada(categoria);
        setSearchTerm('');
        setIsSearchActive(true);
        setSearchKey(Date.now());
        if (isSmallScreen) {
            setTimeout(() => {
                if (mobileInputRef.current) {
                    mobileInputRef.current.focus();
                }
            }, 100);
        }
    }, [isSmallScreen]);

    const categorias = [
        { nombre: 'Colchones' },
        { nombre: 'Camas box tarimas' },
        { nombre: 'Dormitorios' },
        { nombre: 'Camas funcionales' },
        { nombre: 'Cabeceras' },
        { nombre: 'Sofás' },
        { nombre: 'Complementos' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target) && 
                inputRef.current && !inputRef.current.contains(event.target)) {
                setIsSearchActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        return () => {
            setSearchKey(Date.now());
        };
    }, []);

    return (
        <>
            <div 
                className={`search-layer ${isSearchActive ? 'active' : ''}`} 
                onClick={handleOverlayClick}
            ></div>

            <div className={`search-bar-container ${isSearchActive ? 'active' : ''}`}>
                <div className="search-bar-input" ref={inputRef} onClick={handleInputClick}>
                    <input 
                        type="text" 
                        placeholder="Buscar en dormihogar.pe"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
                        ref={inputRef}
                        autoComplete="off"
                    />
                    <span className="material-symbols-outlined">
                        {isSmallScreen && isSearchActive ? 'close' : 'search'}
                    </span>
                    {searchTerm && !isSmallScreen && (
                        <span 
                            className="material-symbols-outlined close-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                        >
                            close
                        </span>
                    )}
                </div>

                <div 
                    className={`search-bar-results-container ${isSearchActive ? 'active' : ''}`}
                    ref={resultsRef}
                >
                    <div className='search-bar-results-input'>
                        <input 
                            type="text" 
                            placeholder="Buscar en dormihogar.pe"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                            ref={mobileInputRef}
                        />
                        <span className="material-symbols-outlined">search</span>
                    </div>

                    <div className='search-bar-categorias'>
                        <p className='title'>Categorías</p>

                        <ul className='search-bar-categorias-list'>
                            {categorias.map((cat, index) => (
                                <li key={index}>
                                    <button 
                                        className={`categoria-btn ${categoriaSeleccionada === cat.nombre ? 'active' : ''}`}
                                        onClick={() => handleCategoriaClick(cat.nombre)}
                                        title={`Ver productos de ${cat.nombre}`}
                                    >
                                        <p>{cat.nombre}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <a className='d-flex w-100' href='/' title=''>
                            <img 
                                src="http://localhost:3000/assets/imagenes/paginas/nosotros/banner-principal.jpg" 
                                alt='Banner promocional'
                                loading="lazy"
                            />
                        </a>
                    </div>

                    <div className='search-bar-results-content'>
                        <p className='title'>
                            {categoriaSeleccionada ? `Productos de ${categoriaSeleccionada}` : 'Resultados'}
                        </p>

                        <div className='search-bar-results-products'>
                            <div className='search-bar-results'>
                                {isLoading && productos.length === 0 ? (
                                    <div className="search-loading">
                                        <span>Cargando productos...</span>
                                    </div>
                                ) : filteredProductos.length > 0 ? (
                                    isSmallScreen ? (
                                        <ul className='d-flex-column' key={`mobile-${searchKey}`}>
                                            {filteredProductos.map((producto) => (
                                                <li key={`${producto.sku}-${searchKey}`}>
                                                    <a href={producto.ruta} title={producto.nombre}>
                                                        <LazyImage 
                                                            key={`img-${producto.sku}-${searchKey}`}
                                                            width={80} 
                                                            height={80} 
                                                            src={`${producto.fotos}/1`} 
                                                            alt={producto.nombre}
                                                        />
                                                        <div>
                                                            <p>{producto.categoria?.toUpperCase() || 'PRODUCTO'}</p>
                                                            <p>{producto.nombre}</p>
                                                            <p><b>SKU:</b> {producto.sku}</p>
                                                        </div>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <ul className='productos-grid' key={`desktop-${searchKey}`}>
                                            {filteredProductos.map((producto) => (
                                                <Producto 
                                                    key={`${producto.sku}-${searchKey}`} 
                                                    producto={producto} 
                                                />
                                            ))}
                                        </ul>
                                    )
                                ) : categoriaSeleccionada ? (
                                    <p className='no-results'>No hay productos disponibles en esta categoría.</p>
                                ) : searchTerm.trim().length >= 2 ? (
                                    <p className='no-results'>No se encontraron productos.</p>
                                ) : (
                                    <p className='no-results'>Encuentra el dormitorio de tus sueños en <b className='color-color-1'>dormihogar.pe</b></p>
                                )}
                            </div>
                        </div>

                        {filteredProductos.length > 0 && !categoriaSeleccionada && (
                            <a 
                                href={`/busqueda?query=${encodeURIComponent(searchTerm)}`} 
                                className='show-all-results button-link button-link-1'
                            >
                                <p className='button-link-text'>
                                    Ver los {filteredProductos.length} {filteredProductos.length === 1 ? 'resultado' : 'resultados'}
                                </p>
                                <span className="material-symbols-outlined">arrow_right_alt</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchBar;
