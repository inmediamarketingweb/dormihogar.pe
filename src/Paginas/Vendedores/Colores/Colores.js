// import { useState, useEffect, useCallback, useRef } from 'react';
// import { Helmet } from 'react-helmet';
// import { useLocation, useNavigate } from 'react-router-dom';
// import SpinnerLoading from '../../../Componentes/SpinnerLoading/SpinnerLoading';
// import './Colores.css';

// const DEFAULT_BANNER = 'https://concepto.de/wp-content/uploads/2018/09/Historia-Pintura-Van-Gogh-691x451.jpg';

// function Colores() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [fabricData, setFabricData] = useState(null);
//     const [manifestData, setManifestData] = useState(null);
//     const [allProducts, setAllProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedFabric, setSelectedFabric] = useState(null);
//     const [selectedColor, setSelectedColor] = useState(null);
//     const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
//     const [relatedProducts, setRelatedProducts] = useState([]);
//     const [availableProducts, setAvailableProducts] = useState([]);
//     const [selectedColorInfo, setSelectedColorInfo] = useState(null);
//     const MAX_PRODUCTS_TO_SHOW = 3;
//     const scrollContainerRef = useRef(null);

//     useEffect(() => {
//         if (window.innerWidth < 600 && selectedColor) {
//             window.scrollTo({
//                 top: 272,
//                 behavior: 'smooth'
//             });
//         }
//     }, [selectedColor]);

//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const fabric = params.get('tela');
//         const color = params.get('color');

//         if (fabric) setSelectedFabric(fabric);
//         if (color) setSelectedColor({ color });
//     }, [location.search]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const colorsResponse = await fetch('/assets/json/colores.json');
//                 if (!colorsResponse.ok) throw new Error('Error al cargar colores');
//                 const colorsData = await colorsResponse.json();
//                 setFabricData(colorsData);
//                 const manifestResponse = await fetch('/assets/json/manifest.json');
//                 if (!manifestResponse.ok) throw new Error('Error al cargar manifest');
//                 const manifestData = await manifestResponse.json();
//                 setManifestData(manifestData);
//                 const products = await loadAllProducts(manifestData.files);
//                 setAllProducts(products);

//             } catch (error) {
//                 console.error('Error cargando datos:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const loadAllProducts = async (files) => {
//         const allProducts = [];
        
//         for (const filePath of files) {
//             try {
//                 const response = await fetch(filePath);
//                 if (!response.ok) continue;
                
//                 const data = await response.json();
                
//                 if (data.productos && Array.isArray(data.productos)) {
//                     allProducts.push(...data.productos);
//                 }
//             } catch (error) {
//                 console.error(`Error cargando ${filePath}:`, error);
//             }
//         }
        
//         return allProducts;
//     };

//     const findColorOrigin = useCallback((colorName) => {
//         if (!fabricData) return { fabric: null, categoria: null };

//         for (const obj of fabricData.telas) {
//             for (const category in obj) {
//                 const categoryData = obj[category];
//                 for (const fabric of categoryData.telas) {
//                     const foundColor = fabric.colores.find(c => c.color === colorName);
//                     if (foundColor) {
//                         return { 
//                             fabric: fabric.tela,
//                             categoria: category
//                         };
//                     }
//                 }
//             }
//         }
//         return { fabric: null, categoria: null };
//     }, [fabricData]);

//     const getAllFabrics = useCallback(() => {
//         if (!fabricData) return [];
        
//         const fabricsSet = new Set();
//         for (const obj of fabricData.telas) {
//             for (const category in obj) {
//                 const categoryData = obj[category];
//                 for (const fabric of categoryData.telas) {
//                     fabricsSet.add(fabric.tela);
//                 }
//             }
//         }
//         return Array.from(fabricsSet);
//     }, [fabricData]);

//     const getColorsForFabric = useCallback((fabricName) => {
//         if (!fabricData || !fabricName) return [];

//         for (const obj of fabricData.telas) {
//             for (const category in obj) {
//                 const categoryData = obj[category];
//                 const fabric = categoryData.telas.find(f => f.tela === fabricName);
//                 if (fabric) {
//                     return fabric.colores || [];
//                 }
//             }
//         }
//         return [];
//     }, [fabricData]);

//     const isColchon = useCallback((product) => {
//         const categoria = (product.categoria || '').toLowerCase();
//         const nombre = (product.nombre || '').toLowerCase();
        
//         return categoria.includes('colchon') || 
//                categoria.includes('colchones') ||
//                nombre.includes('colchón') ||
//                nombre.includes('colchon');
//     }, []);

//     const filterProductsByColor = useCallback((colorName) => {
//         if (!allProducts.length || !colorName) return [];
        
//         const searchColor = colorName.toLowerCase().trim();
        
//         return allProducts.filter(product => {
//             if (isColchon(product)) return false;
            
//             const productName = (product.nombre || '').toLowerCase();
//             const categoria = (product.categoria || '').toLowerCase();
            
//             const nameHasColor = productName.includes(searchColor);
//             const categoryHasColor = categoria.includes(searchColor);
            
//             const lastHyphenIndex = productName.lastIndexOf(' - ');
//             let colorAfterHyphen = '';
//             if (lastHyphenIndex !== -1) {
//                 colorAfterHyphen = productName.substring(lastHyphenIndex + 3).toLowerCase().trim();
//             }
            
//             const hyphenMatches = colorAfterHyphen === searchColor;
            
//             return nameHasColor || categoryHasColor || hyphenMatches;
//         });
//     }, [allProducts, isColchon]);

//     const getRandomProducts = useCallback((products, count) => {
//         if (!products.length) return [];
        
//         const shuffled = [...products];
//         for (let i = shuffled.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//         }
        
//         return shuffled.slice(0, count);
//     }, []);

//     const loadProductsForColor = useCallback((colorName) => {
//         if (!colorName) {
//             setRelatedProducts([]);
//             setAvailableProducts([]);
//             return;
//         }
        
//         const filtered = filterProductsByColor(colorName);
//         setAvailableProducts(filtered);
        
//         const randomProducts = getRandomProducts(filtered, MAX_PRODUCTS_TO_SHOW);
//         setRelatedProducts(randomProducts);
//     }, [filterProductsByColor, getRandomProducts]);

//     const refreshProducts = useCallback(() => {
//         if (!selectedColor) return;
        
//         // Si ya tenemos productos disponibles, seleccionamos aleatoriamente de ahí
//         if (availableProducts.length > 0) {
//             const randomProducts = getRandomProducts(availableProducts, MAX_PRODUCTS_TO_SHOW);
//             setRelatedProducts(randomProducts);
//         } else {
//             // Si no hay productos disponibles, filtramos de nuevo
//             const filtered = filterProductsByColor(selectedColor.color);
//             setAvailableProducts(filtered);
//             const randomProducts = getRandomProducts(filtered, MAX_PRODUCTS_TO_SHOW);
//             setRelatedProducts(randomProducts);
//         }
//     }, [selectedColor, availableProducts, filterProductsByColor, getRandomProducts]);

//     useEffect(() => {
//         if (!fabricData) return;

//         const params = new URLSearchParams();
//         if (selectedFabric) params.set('tela', selectedFabric);
//         if (selectedColor?.color) params.set('color', selectedColor.color);

//         navigate(`?${params.toString()}`, { replace: true });

//         if (selectedColor?.color && !selectedFabric) {
//             const origin = findColorOrigin(selectedColor.color);
//             if (origin.fabric) {
//                 setSelectedFabric(origin.fabric);
//                 setSelectedColorInfo({
//                     color: selectedColor.color,
//                     categoria: origin.categoria,
//                     tela: origin.fabric
//                 });
//             }
//         }

//         if (selectedColor?.color && selectedFabric) {
//             const colors = getColorsForFabric(selectedFabric);
//             const colorObj = colors.find(c => c.color === selectedColor.color);
//             if (colorObj) {
//                 setSelectedColor(colorObj);
//                 setBannerImage(colorObj.original || colorObj.img);
                
//                 const origin = findColorOrigin(selectedColor.color);
//                 setSelectedColorInfo({
//                     color: selectedColor.color,
//                     categoria: origin.categoria,
//                     tela: selectedFabric
//                 });
                
//                 // Cargar productos para el color seleccionado
//                 loadProductsForColor(selectedColor.color);
//             }
//         } else {
//             // Limpiar todo cuando no hay selección
//             setRelatedProducts([]);
//             setAvailableProducts([]);
//             setSelectedColorInfo(null);
//         }
//     }, [selectedFabric, selectedColor, fabricData, findColorOrigin, getColorsForFabric, navigate, loadProductsForColor]);

//     useEffect(() => {
//         if (selectedColor && fabricData && (selectedColor.original || selectedColor.img)) {
//             setBannerImage(selectedColor.original || selectedColor.img);
//         } else {
//             setBannerImage(DEFAULT_BANNER);
//         }
//     }, [selectedColor, fabricData]);

//     const handleFabricSelect = (fabric) => {
//         if (selectedFabric === fabric) {
//             setSelectedFabric(null);
//             setSelectedColor(null);
//             setRelatedProducts([]);
//             setAvailableProducts([]);
//             setSelectedColorInfo(null);
//         } else {
//             setSelectedFabric(fabric);
//             setSelectedColor(null);
//             setRelatedProducts([]);
//             setAvailableProducts([]);
//             setSelectedColorInfo(null);
//         }
//     };

//     const handleColorSelect = (color, fabric = null) => {
//         // Limpiar productos anteriores antes de seleccionar nuevo color
//         setRelatedProducts([]);
//         setAvailableProducts([]);
        
//         if (fabric) {
//             setSelectedFabric(fabric);
//             setSelectedColor(color);
//         } else {
//             setSelectedColor(color);
//         }
//     };

//     const handleResetFilters = () => {
//         setSelectedFabric(null);
//         setSelectedColor(null);
//         setRelatedProducts([]);
//         setAvailableProducts([]);
//         setSelectedColorInfo(null);
//     };

//     const handleScrollLeft = () => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const scrollAmount = container.clientWidth * 0.8;
//             container.scrollBy({
//                 left: -scrollAmount,
//                 behavior: 'smooth'
//             });
//         }
//     };

//     const handleScrollRight = () => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const scrollAmount = container.clientWidth * 0.8;
//             container.scrollBy({
//                 left: scrollAmount,
//                 behavior: 'smooth'
//             });
//         }
//     };

//     const getFilteredColors = () => {
//         if (!fabricData) return [];

//         let colors = [];
        
//         if (selectedFabric) {
//             const fabricColors = getColorsForFabric(selectedFabric);
//             colors = fabricColors.map(color => ({
//                 ...color,
//                 fabric: selectedFabric
//             }));
//         } else {
//             const allFabrics = getAllFabrics();
//             allFabrics.forEach(fabricName => {
//                 const fabricColors = getColorsForFabric(fabricName);
//                 colors = [...colors, ...fabricColors.map(color => ({
//                     ...color,
//                     fabric: fabricName
//                 }))];
//             });
//         }

//         return colors;
//     };

//     const truncateText = (text, maxLength) => {
//         if (!text) return '';
//         if (text.length <= maxLength) return text;
//         return text.substring(0, maxLength) + '...';
//     };

//     if (loading) return <SpinnerLoading />;
//     if (!fabricData) return null;

//     const allFabrics = getAllFabrics();
//     const allColors = getFilteredColors();

//     return (
//         <>
//             <Helmet>
//                 <title>Paleta de colores | Dormihogar</title>
//                 <meta name="description" content="Explora nuestra variedad de colores y telas" />
//             </Helmet>

//             <main className='main'>
//                 <section className='page-colors'>
//                     <div className='colors-cat'>
//                         <ul>
//                             {allFabrics.map((fabric, index) => (
//                                 <li key={index}>
//                                     <button 
//                                         type='button' 
//                                         className={selectedFabric === fabric ? 'active' : ''}
//                                         onClick={() => handleFabricSelect(fabric)}
//                                     >
//                                         <p>{fabric}</p>
//                                         <span className="material-symbols-outlined">keyboard_arrow_right</span>
//                                     </button>
//                                 </li>
//                             ))}
//                             <li>
//                                 <button type='button' onClick={handleResetFilters}>
//                                     <p>Ver todos</p>
//                                     <span className="material-symbols-outlined">refresh</span>
//                                 </button>
//                             </li>
//                         </ul>
//                     </div>

//                     <div className='colors-image'>
//                         <img src={bannerImage} alt='Banner de colores' />
//                         {selectedColorInfo && (
//                             <div className='colors-image-info'>
//                                 <p className='colors-image-category'>Tela {selectedColorInfo.tela}</p>
//                                 <p className='text'>/</p>
//                                 <p className='colors-image-color'>{selectedColorInfo.color}</p>
//                             </div>
//                         )}
//                     </div>

//                     {selectedColor && (
//                         <div className='colors-products-container d-flex-column gap-10'>
//                             <div className='products-header'>
//                                 <p className='text font-bold'>Productos relacionados</p>
//                                 {relatedProducts.length > 0 && (
//                                     <button 
//                                         type='button' 
//                                         className='refresh-products-btn'
//                                         onClick={refreshProducts}
//                                         title='Ver otros productos'
//                                     >
//                                         <span className="material-symbols-outlined">refresh</span>
//                                     </button>
//                                 )}
//                             </div>

//                             <div className='colors-products'>
//                                 {relatedProducts.length > 0 ? (
//                                     <ul className='products-list'>
//                                         {relatedProducts.map((product) => (
//                                             <li key={product.id}>
//                                                 <a href={product.ruta} title={product.nombre}>
//                                                     <img 
//                                                         src={`${product.fotos}1.jpg`} 
//                                                         alt={product.nombre} 
//                                                     />
//                                                     <p className='product-name'>{truncateText(product.nombre, 25)}</p>
//                                                 </a>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 ) : (
//                                     <p className='no-products'>No se encontraron productos en este color</p>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     <div className='colors-items'>
//                         <button 
//                             type='button' 
//                             className='colors-items-button colors-items-button-1'
//                             onClick={handleScrollLeft}
//                         >
//                             <span className="material-symbols-outlined">chevron_left</span>
//                         </button>

//                         <div className='color-items-results-container'>
//                             <ul className='color-items-results' ref={scrollContainerRef}>
//                                 {allColors.map((color, index) => (
//                                     <li key={index}>
//                                         <button 
//                                             className={selectedColor?.color === color.color ? 'active' : ''}
//                                             onClick={() => handleColorSelect(color, color.fabric)}
//                                         >
//                                             <img src={color.img || color.original} alt={`Color ${color.color}`} />
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         <button 
//                             type='button' 
//                             className='colors-items-button colors-items-button-2'
//                             onClick={handleScrollRight}
//                         >
//                             <span className="material-symbols-outlined">chevron_right</span>
//                         </button>
//                     </div>
//                 </section>
//             </main>
//         </>
//     );
// }

// export default Colores;

import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import SpinnerLoading from '../../../Componentes/SpinnerLoading/SpinnerLoading';
import './Colores.css';

const DEFAULT_BANNER = 'https://concepto.de/wp-content/uploads/2018/09/Historia-Pintura-Van-Gogh-691x451.jpg';

function Colores() {
    const location = useLocation();
    const navigate = useNavigate();
    const [fabricData, setFabricData] = useState(null);
    const [manifestData, setManifestData] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFabric, setSelectedFabric] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedColorInfo, setSelectedColorInfo] = useState(null);
    const MAX_PRODUCTS_TO_SHOW = 3;
    const scrollContainerRef = useRef(null);
    
    // Estados para drag slide
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        if (window.innerWidth < 600 && selectedColor) {
            window.scrollTo({
                top: 272,
                behavior: 'smooth'
            });
        }
    }, [selectedColor]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const fabric = params.get('tela');
        const color = params.get('color');

        if (fabric) setSelectedFabric(fabric);
        if (color) setSelectedColor({ color });
    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const colorsResponse = await fetch('/assets/json/colores.json');
                if (!colorsResponse.ok) throw new Error('Error al cargar colores');
                const colorsData = await colorsResponse.json();
                setFabricData(colorsData);
                const manifestResponse = await fetch('/assets/json/manifest.json');
                if (!manifestResponse.ok) throw new Error('Error al cargar manifest');
                const manifestData = await manifestResponse.json();
                setManifestData(manifestData);
                const products = await loadAllProducts(manifestData.files);
                setAllProducts(products);

            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const loadAllProducts = async (files) => {
        const allProducts = [];
        
        for (const filePath of files) {
            try {
                const response = await fetch(filePath);
                if (!response.ok) continue;
                
                const data = await response.json();
                
                if (data.productos && Array.isArray(data.productos)) {
                    allProducts.push(...data.productos);
                }
            } catch (error) {
                console.error(`Error cargando ${filePath}:`, error);
            }
        }
        
        return allProducts;
    };

    const findColorOrigin = useCallback((colorName) => {
        if (!fabricData) return { fabric: null, categoria: null };

        for (const obj of fabricData.telas) {
            for (const category in obj) {
                const categoryData = obj[category];
                for (const fabric of categoryData.telas) {
                    const foundColor = fabric.colores.find(c => c.color === colorName);
                    if (foundColor) {
                        return { 
                            fabric: fabric.tela,
                            categoria: category
                        };
                    }
                }
            }
        }
        return { fabric: null, categoria: null };
    }, [fabricData]);

    const getAllFabrics = useCallback(() => {
        if (!fabricData) return [];
        
        const fabricsSet = new Set();
        for (const obj of fabricData.telas) {
            for (const category in obj) {
                const categoryData = obj[category];
                for (const fabric of categoryData.telas) {
                    fabricsSet.add(fabric.tela);
                }
            }
        }
        return Array.from(fabricsSet);
    }, [fabricData]);

    const getColorsForFabric = useCallback((fabricName) => {
        if (!fabricData || !fabricName) return [];

        for (const obj of fabricData.telas) {
            for (const category in obj) {
                const categoryData = obj[category];
                const fabric = categoryData.telas.find(f => f.tela === fabricName);
                if (fabric) {
                    return fabric.colores || [];
                }
            }
        }
        return [];
    }, [fabricData]);

    const isColchon = useCallback((product) => {
        const categoria = (product.categoria || '').toLowerCase();
        const nombre = (product.nombre || '').toLowerCase();
        
        return categoria.includes('colchon') || 
               categoria.includes('colchones') ||
               nombre.includes('colchón') ||
               nombre.includes('colchon');
    }, []);

    const filterProductsByColor = useCallback((colorName) => {
        if (!allProducts.length || !colorName) return [];
        
        const searchColor = colorName.toLowerCase().trim();
        
        return allProducts.filter(product => {
            if (isColchon(product)) return false;
            
            const productName = (product.nombre || '').toLowerCase();
            const categoria = (product.categoria || '').toLowerCase();
            
            const nameHasColor = productName.includes(searchColor);
            const categoryHasColor = categoria.includes(searchColor);
            
            const lastHyphenIndex = productName.lastIndexOf(' - ');
            let colorAfterHyphen = '';
            if (lastHyphenIndex !== -1) {
                colorAfterHyphen = productName.substring(lastHyphenIndex + 3).toLowerCase().trim();
            }
            
            const hyphenMatches = colorAfterHyphen === searchColor;
            
            return nameHasColor || categoryHasColor || hyphenMatches;
        });
    }, [allProducts, isColchon]);

    const getRandomProducts = useCallback((products, count) => {
        if (!products.length) return [];
        
        const shuffled = [...products];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled.slice(0, count);
    }, []);

    const loadProductsForColor = useCallback((colorName) => {
        if (!colorName) {
            setRelatedProducts([]);
            setAvailableProducts([]);
            return;
        }
        
        const filtered = filterProductsByColor(colorName);
        setAvailableProducts(filtered);
        
        const randomProducts = getRandomProducts(filtered, MAX_PRODUCTS_TO_SHOW);
        setRelatedProducts(randomProducts);
    }, [filterProductsByColor, getRandomProducts]);

    const refreshProducts = useCallback(() => {
        if (!selectedColor) return;
        
        if (availableProducts.length > 0) {
            const randomProducts = getRandomProducts(availableProducts, MAX_PRODUCTS_TO_SHOW);
            setRelatedProducts(randomProducts);
        } else {
            const filtered = filterProductsByColor(selectedColor.color);
            setAvailableProducts(filtered);
            const randomProducts = getRandomProducts(filtered, MAX_PRODUCTS_TO_SHOW);
            setRelatedProducts(randomProducts);
        }
    }, [selectedColor, availableProducts, filterProductsByColor, getRandomProducts]);

    useEffect(() => {
        if (!fabricData) return;

        const params = new URLSearchParams();
        if (selectedFabric) params.set('tela', selectedFabric);
        if (selectedColor?.color) params.set('color', selectedColor.color);

        navigate(`?${params.toString()}`, { replace: true });

        if (selectedColor?.color && !selectedFabric) {
            const origin = findColorOrigin(selectedColor.color);
            if (origin.fabric) {
                setSelectedFabric(origin.fabric);
                setSelectedColorInfo({
                    color: selectedColor.color,
                    categoria: origin.categoria,
                    tela: origin.fabric
                });
            }
        }

        if (selectedColor?.color && selectedFabric) {
            const colors = getColorsForFabric(selectedFabric);
            const colorObj = colors.find(c => c.color === selectedColor.color);
            if (colorObj) {
                setSelectedColor(colorObj);
                setBannerImage(colorObj.original || colorObj.img);
                
                const origin = findColorOrigin(selectedColor.color);
                setSelectedColorInfo({
                    color: selectedColor.color,
                    categoria: origin.categoria,
                    tela: selectedFabric
                });
                
                loadProductsForColor(selectedColor.color);
            }
        } else {
            setRelatedProducts([]);
            setAvailableProducts([]);
            setSelectedColorInfo(null);
        }
    }, [selectedFabric, selectedColor, fabricData, findColorOrigin, getColorsForFabric, navigate, loadProductsForColor]);

    useEffect(() => {
        if (selectedColor && fabricData && (selectedColor.original || selectedColor.img)) {
            setBannerImage(selectedColor.original || selectedColor.img);
        } else {
            setBannerImage(DEFAULT_BANNER);
        }
    }, [selectedColor, fabricData]);

    // Handlers para drag slide
    const handleMouseDown = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
        scrollContainerRef.current.style.userSelect = 'none';
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
            scrollContainerRef.current.style.userSelect = 'auto';
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Handlers para touch
    const handleTouchStart = (e) => {
        if (!scrollContainerRef.current) return;
        const touch = e.touches[0];
        setIsDragging(true);
        setStartX(touch.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        const touch = e.touches[0];
        const x = touch.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleFabricSelect = (fabric) => {
        if (selectedFabric === fabric) {
            setSelectedFabric(null);
            setSelectedColor(null);
            setRelatedProducts([]);
            setAvailableProducts([]);
            setSelectedColorInfo(null);
        } else {
            setSelectedFabric(fabric);
            setSelectedColor(null);
            setRelatedProducts([]);
            setAvailableProducts([]);
            setSelectedColorInfo(null);
        }
    };

    const handleColorSelect = (color, fabric = null) => {
        setRelatedProducts([]);
        setAvailableProducts([]);
        
        if (fabric) {
            setSelectedFabric(fabric);
            setSelectedColor(color);
        } else {
            setSelectedColor(color);
        }
    };

    const handleResetFilters = () => {
        setSelectedFabric(null);
        setSelectedColor(null);
        setRelatedProducts([]);
        setAvailableProducts([]);
        setSelectedColorInfo(null);
    };

    const handleScrollLeft = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleScrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const getFilteredColors = () => {
        if (!fabricData) return [];

        let colors = [];
        
        if (selectedFabric) {
            const fabricColors = getColorsForFabric(selectedFabric);
            colors = fabricColors.map(color => ({
                ...color,
                fabric: selectedFabric
            }));
        } else {
            const allFabrics = getAllFabrics();
            allFabrics.forEach(fabricName => {
                const fabricColors = getColorsForFabric(fabricName);
                colors = [...colors, ...fabricColors.map(color => ({
                    ...color,
                    fabric: fabricName
                }))];
            });
        }

        return colors;
    };

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (loading) return <SpinnerLoading />;
    if (!fabricData) return null;

    const allFabrics = getAllFabrics();
    const allColors = getFilteredColors();

    return (
        <>
            <Helmet>
                <title>Paleta de colores | Dormihogar</title>
                <meta name="description" content="Explora nuestra variedad de colores y telas" />
            </Helmet>

            <main className='main'>
                <section className='page-colors'>
                    <div className='colors-cat'>
                        <ul>
                            {allFabrics.map((fabric, index) => (
                                <li key={index}>
                                    <button 
                                        type='button' 
                                        className={selectedFabric === fabric ? 'active' : ''}
                                        onClick={() => handleFabricSelect(fabric)}
                                    >
                                        <p>{fabric}</p>
                                        <span className="material-symbols-outlined">keyboard_arrow_right</span>
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button type='button' onClick={handleResetFilters}>
                                    <p>Ver todos</p>
                                    <span className="material-symbols-outlined">refresh</span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className='colors-image'>
                        <img src={bannerImage} alt='Banner de colores' />
                        {selectedColorInfo && (
                            <div className='colors-image-info'>
                                <p className='colors-image-category'>Tela {selectedColorInfo.tela}</p>
                                <p className='text'>/</p>
                                <p className='colors-image-color'>{selectedColorInfo.color}</p>
                            </div>
                        )}
                    </div>

                    {selectedColor && (
                        <div className='colors-products-container d-flex-column gap-10'>
                            <div className='products-header'>
                                <p className='text font-bold'>Productos relacionados</p>
                                {relatedProducts.length > 0 && (
                                    <button 
                                        type='button' 
                                        className='refresh-products-btn'
                                        onClick={refreshProducts}
                                        title='Ver otros productos'
                                    >
                                        <span className="material-symbols-outlined">refresh</span>
                                    </button>
                                )}
                            </div>

                            <div className='colors-products'>
                                {relatedProducts.length > 0 ? (
                                    <ul className='products-list'>
                                        {relatedProducts.map((product) => (
                                            <li key={product.id}>
                                                <a href={product.ruta} title={product.nombre}>
                                                    <img 
                                                        src={`${product.fotos}1.jpg`} 
                                                        alt={product.nombre} 
                                                    />
                                                    <p className='product-name'>{truncateText(product.nombre, 25)}</p>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className='no-products'>No se encontraron productos en este color</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className='colors-items'>
                        <button 
                            type='button' 
                            className='colors-items-button colors-items-button-1'
                            onClick={handleScrollLeft}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>

                        <div className='color-items-results-container'>
                            <ul 
                                className='color-items-results' 
                                ref={scrollContainerRef}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onMouseMove={handleMouseMove}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                style={{ cursor: 'grab' }}
                            >
                                {allColors.map((color, index) => (
                                    <li key={index}>
                                        <button 
                                            className={selectedColor?.color === color.color ? 'active' : ''}
                                            onClick={() => handleColorSelect(color, color.fabric)}
                                        >
                                            <img src={color.img || color.original} alt={`Color ${color.color}`} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button 
                            type='button' 
                            className='colors-items-button colors-items-button-2'
                            onClick={handleScrollRight}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Colores;
