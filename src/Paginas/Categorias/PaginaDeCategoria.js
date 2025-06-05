import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Header from "../../Componentes/Header/Header";
import Filtros from "./Componentes/Filtros/Filtros";
import LazyImage from '../../Componentes/Plantillas/LazyImage.js';
import Footer from "../../Componentes/Footer/Footer";

import "./PaginaDeCategoria.css";

function PaginaDeCategoria() {
    const params = useParams();
    const { categoria, subcategoria, marca } = params;
    const [metadatos, setMetadatos] = useState({ title: "", description: "" });
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [filtersActive, setFiltersActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const favStorage = JSON.parse(localStorage.getItem("favoritos")) || [];
        setFavorites(favStorage);
    }, []);

    useEffect(() => {
        fetch(`/assets/json/categorias/${categoria}/metadatos.json`)
            .then((response) => {
                if (!response.ok) throw new Error("Metadatos no encontrados");
                return response.json();
            })
            .then((data) => setMetadatos(data || { title: "", description: "" }))
            .catch((error) => {
                console.error("Error cargando metadatos:", error);
                setMetadatos({ title: "", description: "" });
            });

        const loadProducts = async () => {
            try {
                let products = [];
                const basePath = `/assets/json/categorias/${categoria}`;

                if (marca) {
                    const marcaPath = `${basePath}/sub-categorias/${subcategoria}/${marca}.json`;
                    
                    try {
                        const response = await fetch(marcaPath);
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        
                        const data = await response.json();
                        if (!data.productos) throw new Error("Formato inválido: falta propiedad 'productos'");
                        
                        products = data.productos;
                    } catch (error) {
                        console.error(`Error cargando ${marcaPath}:`, error);
                        throw error;
                    }
                } else if (subcategoria) {
                    try {
                        const subSubCatPath = `${basePath}/sub-categorias/${subcategoria}/sub-categorias.json`;
                        
                        const subSubCatResponse = await fetch(subSubCatPath);
                        if (!subSubCatResponse.ok) {
                            throw new Error("No hay sub-subcategorías");
                        }
                        
                        const subSubCatData = await subSubCatResponse.json();
                        if (!subSubCatData.subcategorias) {
                            throw new Error("Formato inválido: falta propiedad 'subcategorias'");
                        }

                        const productPromises = subSubCatData.subcategorias.map(async marcaItem => {
                            const marcaFileName = marcaItem.subcategoria.toLowerCase().replace(/\s+/g, "-");
                            const marcaPath = `${basePath}/sub-categorias/${subcategoria}/${marcaFileName}.json`;
                            
                            try {
                                const response = await fetch(marcaPath);
                                if (!response.ok) {
                                    console.warn(`No se pudo cargar ${marcaPath}`);
                                    return [];
                                }
                                const data = await response.json();
                                return data.productos || [];
                            } catch (e) {
                                return [];
                            }
                        });

                        const productsArrays = await Promise.all(productPromises);
                        products = productsArrays.flat();
                    } catch (e) {
                        const subCatPath = `${basePath}/sub-categorias/${subcategoria}.json`;
                        
                        try {
                            const response = await fetch(subCatPath);
                            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                            
                            const data = await response.json();
                            products = data.productos || [];
                        } catch (error) {
                            console.error(`Error cargando ${subCatPath}:`, error);
                            throw error;
                        }
                    }
                } else {
                    const subCatPath = `${basePath}/sub-categorias/sub-categorias.json`;
                    
                    try {
                        const subCatResponse = await fetch(subCatPath);
                        if (!subCatResponse.ok) throw new Error(`HTTP error! status: ${subCatResponse.status}`);
                        
                        const subCatData = await subCatResponse.json();
                        if (!subCatData.subcategorias) {
                            throw new Error("Formato inválido: falta propiedad 'subcategorias'");
                        }

                        const allProductPromises = subCatData.subcategorias.map(async (subcat) => {
                            const subcatFileName = subcat.subcategoria.toLowerCase().replace(/\s+/g, "-");
                            
                            try {
                                const subSubCatPath = `${basePath}/sub-categorias/${subcatFileName}/sub-categorias.json`;
                                const subSubCatResponse = await fetch(subSubCatPath);
                                
                                if (subSubCatResponse.ok) {
                                    const subSubCatData = await subSubCatResponse.json();
                                    if (subSubCatData?.subcategorias?.length > 0) {
                                        console.log(`Cargando ${subSubCatData.subcategorias.length} marcas para ${subcatFileName}`);
                                        const marcaPromises = subSubCatData.subcategorias.map(async marcaItem => {
                                            const marcaFileName = marcaItem.subcategoria.toLowerCase().replace(/\s+/g, "-");
                                            const marcaPath = `${basePath}/sub-categorias/${subcatFileName}/${marcaFileName}.json`;
                                            
                                            try {
                                                const response = await fetch(marcaPath);
                                                if (!response.ok) return [];
                                                const data = await response.json();
                                                return data.productos || [];
                                            } catch (e) {
                                                console.warn(`Error cargando ${marcaPath}:`, e);
                                                return [];
                                            }
                                        });

                                        const marcaProducts = await Promise.all(marcaPromises);
                                        return marcaProducts.flat();
                                    }
                                }
                            } catch (e) {
                                console.warn(`No hay sub-subcategorías para ${subcatFileName}:`, e.message);
                            }
                            
                            const subCatPath = `${basePath}/sub-categorias/${subcatFileName}.json`;
                            try {
                                const response = await fetch(subCatPath);
                                if (!response.ok) return [];
                                const data = await response.json();
                                return data.productos || [];
                            } catch (e) {
                                console.warn(`Error cargando ${subCatPath}:`, e);
                                return [];
                            }
                        });

                        const allProductsArrays = await Promise.all(allProductPromises);
                        products = allProductsArrays.flat();
                        console.log(`Total productos cargados: ${products.length}`);
                    } catch (error) {
                        console.error(`Error cargando ${subCatPath}:`, error);
                        throw error;
                    }
                }

                setProductos(products);
                setProductosFiltrados(products);
            } catch (error) {
                console.error("Error crítico al cargar productos:", {
                    error: error.message,
                    ruta: window.location.pathname,
                    params: { categoria, subcategoria, marca }
                });
                setProductos([]);
                setProductosFiltrados([]);
            }
        };

        loadProducts();
    }, [categoria, subcategoria, marca]);

    useEffect(() => { 
        setCurrentPage(1); 
    }, [productosFiltrados]);

    const totalItems = productosFiltrados.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const getVisiblePages = () => {
        const visiblePages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
        } else {
            if (currentPage <= 3) { 
                visiblePages.push(1, 2, 3, 4, '...', totalPages); 
            } else if (currentPage >= totalPages - 2) {
                visiblePages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                visiblePages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return visiblePages;
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(Math.max(1, Math.min(totalPages, newPage)));
    };

    const handlePreviousPage = () => handlePageChange(currentPage - 1);
    const handleNextPage = () => handlePageChange(currentPage + 1);

    const startIndex = Math.max(0, totalItems - (currentPage * itemsPerPage));
    const endIndex = totalItems - ((currentPage - 1) * itemsPerPage);
    const currentProducts = productosFiltrados.slice(startIndex, endIndex);

    const handleToggleFilters = () => setFiltersActive((prev) => !prev);
    const handleCloseFilters = () => setFiltersActive(false);

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleFavorite = (producto) => {
        const exists = favorites.some((fav) => fav.ruta === producto.ruta);
        const updatedFavorites = exists ? favorites.filter((fav) => fav.ruta !== producto.ruta) : [...favorites, producto];
        setFavorites(updatedFavorites);
        localStorage.setItem("favoritos", JSON.stringify(updatedFavorites));
    };

    const truncate = (str, maxLength) => str.length <= maxLength ? str : str.slice(0, maxLength) + "...";

    return (
        <>
            <Helmet>
                <title>{metadatos.title}</title>
            </Helmet>

            <Header/>

            <main className="main-category">
                <div className="block-container">
                    <section className="block-content">
                        <div className="category-page-container">
                            <div className="category-page-left">
                                <Filtros productos={productos} setProductosFiltrados={setProductosFiltrados} filtersActive={filtersActive} onClose={handleCloseFilters} />
                            </div>

                            <div className="category-page-right">
                                <div className="category-page-right-top">
                                    <button type="button" className="d-flex-center-center gap-5 open-filters" onClick={handleToggleFilters} >
                                        <p className="text">Filtrar</p>
                                        <span className="material-icons text">tune</span>
                                    </button>
                                </div>

                                {productosFiltrados.length > 0 ? (
                                    <>
                                        <ul className="category-page-products">
                                            {currentProducts
                                                .filter((producto) => producto.oferta !== "si")
                                                .sort((a, b) => b.id - a.id)
                                                .map((producto) => {
                                                    const descuento = Math.round(
                                                        ((producto.precioNormal - producto.precioVenta) * 100) /
                                                        producto.precioNormal
                                                    );

                                                    const tipoEnvioClase = producto["tipo-de-envio"] === "Gratis" ? "envio-gratis"
                                                        : producto["tipo-de-envio"] === "Envío preferente" ? "envio-preferente"
                                                        : producto["tipo-de-envio"] === "Envío aplicado" ? "envio-aplicado"
                                                        : "";

                                                    const isFavorite = favorites.some((fav) => fav.ruta === producto.ruta);

                                                    return (
                                                        <li key={producto.sku}>
                                                            <div className={`product-card ${producto.stock === 0 ? "agotado" : ""}`} title={producto.nombre}>
                                                                <div className="product-card-images">
                                                                    {descuento > 0 && (
                                                                        <span className="product-card-discount">-{descuento}%</span>
                                                                    )}

                                                                    <a href={producto.ruta}>
                                                                        <LazyImage 
                                                                            width={isSmallScreen ? 140 : 200} 
                                                                            height={isSmallScreen ? 140 : 200} 
                                                                            src={`${producto.fotos}1`} 
                                                                            alt={producto.nombre}
                                                                        />
                                                                    </a>

                                                                    <button 
                                                                        type="button" 
                                                                        className={`product-card-favorite ${isFavorite ? "active" : ""}`} 
                                                                        onClick={() => toggleFavorite(producto)} 
                                                                        title="Agregar a favoritos"
                                                                    >
                                                                        <span className="material-icons">favorite</span>
                                                                    </button>
                                                                </div>

                                                                <a href={producto.ruta} className="product-card-content">
                                                                    {producto.stock === 0 ? (
                                                                        <div className="product-card-agotado product-card-target">
                                                                            <span>Sin stock 😥</span>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            {producto.novedades === "si" && (
                                                                                <div className="product-card-target">
                                                                                    <span>¡Lo más nuevo!</span>
                                                                                </div>
                                                                            )}

                                                                            {producto["solo-por-horas"] === "si" && (
                                                                                <div className="product-card-stock">
                                                                                    <span>¡ Solo por horas ⌛ !</span>
                                                                                </div>
                                                                            )}

                                                                            {producto.oferta === "si" && (
                                                                                <div className="product-card-ofert">
                                                                                    <span>En oferta</span>
                                                                                </div>
                                                                            )}

                                                                            {producto.novedades !== "si" &&
                                                                                producto["solo-por-horas"] !== "si" &&
                                                                                producto.oferta !== "si" && (
                                                                                    <div className={`product-card-tipo-de-envio ${tipoEnvioClase}`}>
                                                                                        <span>
                                                                                            {producto["tipo-de-envio"] === "Gratis"
                                                                                                ? "¡ Envío gratis 🚚 !"
                                                                                                : producto["tipo-de-envio"] || "No especificado"}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                        </>
                                                                    )}

                                                                    <span className="product-card-brand">{producto.marca}</span>
                                                                    <h4 className="product-card-name">{truncate(producto.nombre, 72)}</h4>
                                                                    <div className="product-card-prices">
                                                                        <span className="product-card-normal-price">S/.{producto.precioNormal}</span>
                                                                        <span className="product-card-sale-price">S/.{producto.precioVenta}</span>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                        </ul>

                                        <div className="pagination-controls">
                                            <button 
                                                className="pagination-arrow" 
                                                onClick={handlePreviousPage} 
                                                disabled={currentPage === 1}
                                            >
                                                <span className="material-icons">chevron_left</span>
                                            </button>

                                            <div className="d-flex-center-center gap-10">
                                                {getVisiblePages().map((page, index) => 
                                                    typeof page === 'number' ? (
                                                        <button 
                                                            key={index} 
                                                            className={`pagination-page ${currentPage === page ? 'active' : ''}`} 
                                                            onClick={() => handlePageChange(page)}
                                                        >
                                                            {page}
                                                        </button>
                                                    ) : (
                                                        <span key={index} className="pagination-ellipsis">...</span>
                                                    )
                                                )}
                                            </div>

                                            <button 
                                                className="pagination-arrow" 
                                                onClick={handleNextPage} 
                                                disabled={currentPage === totalPages}
                                            >
                                                <span className="material-icons">chevron_right</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p>No se encontraron productos.</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default PaginaDeCategoria;
