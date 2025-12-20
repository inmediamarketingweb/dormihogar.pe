import { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import NoProducto from '../../Paginas/NoProducto/NoProducto';
import SpinnerLoading from '../../Componentes/SpinnerLoading/SpinnerLoading';
import Jerarquia from './Componentes/Jerarquia/Jerarquia';
import Sku from './Componentes/Sku/Sku';
import Imagenes from './Componentes/Imagenes/Imagenes';
import Regalos from './Componentes/Regalos/Regalos';
import Resumen from './Componentes/Resumen/Resumen';
import Medidas from './Componentes/Medidas/Medidas';
import Beneficios from './Componentes/Beneficios/Beneficios';
import Envios from './Componentes/Envios/Envios';
import TiposDeEnvio from './Componentes/TiposDeEnvio/TiposDeEnvio';
import WhatsApp from './Componentes/WhatsApp/WhatsApp';
import Descripcion from './Componentes/Descripcion/Descripcion';

import './PaginaProducto.css';

const MasProductos = lazy(() => import('./Componentes/MasProductos/MasProductos'));

function normalizePathWithTrailingSlash(p = "") {
    if (!p) return "/";
    return p.endsWith("/") ? p : p + "/";
}

function PaginaProducto(){
    const [shippingInfo, setShippingInfo] = useState(null);
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedShipping, setSelectedShipping] = useState({ tipo: null, precio: null });
    const location = useLocation();
    const [productoData, setProductoData] = useState({ producto: null, imagenes: [], error: false, loading: true});
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [userName, setUserName] = useState(typeof window !== 'undefined' ? localStorage.getItem('nombre') || '' : '');
    const [isCategoryFallback, setIsCategoryFallback] = useState(false);
    const [categoryProducts, setCategoryProducts] = useState([]);

    useEffect(() => {
        let cancelled = false;

        const fetchProducto = async () => {
            setProductoData(prev => ({ ...prev, loading: true, error: false }));
            setIsCategoryFallback(false);
            setCategoryProducts([]);

            const path = normalizePathWithTrailingSlash(location.pathname);

            try{
                let filesList = [];
                try{
                    const manifestRes = await fetch('/assets/json/manifest.json');
                    if (manifestRes.ok) {
                        const manifestJson = await manifestRes.json();
                        if (Array.isArray(manifestJson)) filesList = manifestJson;
                        else if (Array.isArray(manifestJson.files)) filesList = manifestJson.files;
                        else if (typeof manifestJson === 'object' && manifestJson !== null && manifestJson[path]) {
                            const productFilePath = manifestJson[path];
                            const resp = await fetch(productFilePath);
                            if (resp.ok) {
                                const pd = await resp.json();
                                if (!cancelled) {
                                    setProductoData({ producto: pd, imagenes: [], error: false, loading: false });
                                    cargarImagenesOptimizadas(pd.fotos);
                                    return;
                                }
                            }
                        }
                    }
                } catch (errIndex) { }

            if (filesList.length === 0) {
                try{
                    const manifestRes2 = await fetch('/assets/json/manifest.json');
                    if (manifestRes2.ok) {
                        const manifestJson2 = await manifestRes2.json();
                        if (Array.isArray(manifestJson2)) filesList = manifestJson2;
                        else if (Array.isArray(manifestJson2.files)) filesList = manifestJson2.files;
                    }
                } catch (e) { }
            }

                const parts = path.split('/').filter(Boolean);
                const category = parts[1] || parts[0] || '';
                let candidates = filesList.filter(f => f.includes(`/categorias/${category}/`));
                if (candidates.length === 0) candidates = filesList;

                let productoEncontrado = null;
                for (const filePath of candidates) {
                    try {
                        const r = await fetch(filePath);
                        if (!r.ok) continue;
                        const json = await r.json();
                        const arr = json.productos || [];
                        const found = arr.find(p => {
                            const pr = String(p.ruta || "").trim();
                            return normalizePathWithTrailingSlash(pr) === path;
                        });
                        if (found) {
                            productoEncontrado = found;
                            break;
                        }
                    } catch (e) { continue; }
                }

                if (productoEncontrado) {
                    if (!cancelled) {
                        setProductoData(prev => ({ ...prev, producto: productoEncontrado, loading: false, error: false }));
                        cargarImagenesOptimizadas(productoEncontrado.fotos);
                    }
                    return;
                }

                const idMatch = path.match(/\/(\d+)\/$/);

                if (idMatch) {
                    const idStr = idMatch[1];
                    for (const filePath of candidates) {
                        try{
                            const r = await fetch(filePath);
                            if (!r.ok) continue;
                            const json = await r.json();
                            const arr = json.productos || [];
                            const foundById = arr.find(p => {
                                const pr = normalizePathWithTrailingSlash(String(p.ruta || ""));
                                return pr.endsWith(`/${idStr}/`);
                            });
                            if (foundById) {
                                productoEncontrado = foundById;
                                break;
                            }
                        } catch (e) { continue; }
                    }
                }

                if (productoEncontrado) {
                    if (!cancelled) {
                        setProductoData(prev => ({ ...prev, producto: productoEncontrado, loading: false, error: false }));
                        cargarImagenesOptimizadas(productoEncontrado.fotos);
                    }
                    return;
                }

                const rel = path.replace(/^\/productos\//, '').replace(/\/$/, '');
                const categoryJsonPath = `/assets/json/categorias/${rel}.json`;

                if (filesList.includes(categoryJsonPath)) {
                    try {
                        const catRes = await fetch(categoryJsonPath);
                        if (catRes.ok) {
                            const catJson = await catRes.json();
                            if (Array.isArray(catJson.productos) && catJson.productos.length > 0) {
                                if (!cancelled) {
                                    setIsCategoryFallback(true);
                                    setCategoryProducts(catJson.productos);
                                    setProductoData(prev => ({ ...prev, loading: false, producto: null, error: false }));
                                }
                                return;
                            }
                        }
                    } catch (e) {
                    }
                }

                if (!cancelled) {
                    setProductoData(prev => ({ ...prev, error: true, loading: false }));
                }
            } catch (error) {
                console.error("Error al buscar el producto:", error);
                if (!cancelled) setProductoData(prev => ({ ...prev, error: true, loading: false }));
            }
        };

        const cargarImagenesOptimizadas = (carpetaFotos) => {
            const cargarImagen = async (index, formato) => {
                const url = `${carpetaFotos}${index}.${formato}`;
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(url);
                    img.onerror = () => resolve(null);
                    img.src = url;
                });
            };

            (async () => {
                const primeraImagen = await cargarImagen(1, 'webp') || await cargarImagen(1, 'jpg') || await cargarImagen(1, 'png');

                if (primeraImagen) {
                    setProductoData(prev => ({
                        ...prev,
                        imagenes: [primeraImagen]
                    }));
                }
            })();

            setTimeout(async () => {
                const promesas = [];
                const formatos = ['webp', 'jpg'];

                for (let index = 2; index <= 5; index++) {
                    for (const formato of formatos) {
                        promesas.push(cargarImagen(index, formato));
                    }
                }

                const resultados = await Promise.all(promesas);
                const nuevasImagenes = resultados.filter(url => url !== null);

                setProductoData(prev => ({
                    ...prev,
                    imagenes: [...prev.imagenes, ...nuevasImagenes]
                }));
            }, 100);
        };

        fetchProducto();

        return () => {
            cancelled = true;
        };
    }, [location.pathname]);

    useEffect(() => {
        if (productoData.producto){
            document.title = productoData.producto.nombre;
        }
    }, [productoData.producto]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleStorageChange = () => {
            const storedName = localStorage.getItem('nombre') || '';
            setUserName(storedName);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (isCategoryFallback){
        return (
            <>
                <Helmet>
                    <title>404 | Domrihogar</title>
                </Helmet>

                <main className="main-category">
                    <div className="block-container">
                        <section className="block-content">
                            <div className="">
                                <div className="category-page-left">
                                    <ul className="category-page-products d-flex-column">
                                        {categoryProducts.map((producto, idx) => (
                                            <a href={producto.ruta} key={producto.sku || idx}>
                                                <p>{producto.nombre}</p>
                                            </a>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </>
        );
    }

    if (productoData.error) {
        return(
            <NoProducto/>
        );
    }

    if (productoData.loading || !productoData.producto) {
        return(
            <SpinnerLoading/>
        );
    }

    const { producto, imagenes } = productoData;

    const handleContinuarClick = (e) => {
        if(!selectedShipping.tipo){
            e.preventDefault();
        }
    };

    const handleRemove = () => { if (quantity > 0) setQuantity(quantity - 1); };
    const handleAdd = () => { if (quantity < 10) setQuantity(quantity + 1); };

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": producto.nombre,
        "image": [
            `https://dormihogar.pe${producto.fotos}1.jpg`
        ],
        "description": producto["resumen-del-producto"]?.map(d => Object.values(d)[0]).join(' – '),
        "sku": producto.sku,
        "brand": {
            "@type": "Brand",
            "name": "dormihogar"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://dormihogar.pe${producto.ruta}`,
            "priceCurrency": "PEN",
            "price": producto.precioVenta,
            "priceValidUntil": "2035-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": producto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
    };

    return(
        <>
            <Helmet>
                <title>{producto.nombre}</title>
                <meta name="description" content={producto.nombre}/>
                <link rel="preload" as="image" href={`https://dormihogar.pe${producto.fotos}1.jpg`} />
                <meta property="og:image" content={`https://dormihogar.pe${producto.fotos}1.jpg`}/>
                <meta property="og:title" content={producto.nombre}/>
                <meta property="og:site_name" content={producto.nombre}/>
                <meta property="og:description" content={producto.nombre}/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={`https://dormihogar.pe${producto.ruta}`}/>
                <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
            </Helmet>

            <main>
                <div className='block-container product-page-block-container'>
                    <section className='block-content product-page-block-content'>
                        <Jerarquia producto={producto} />

                        <div className='product-page-container'>
                            <div className='product-page-target product-page-target-1'>
                                <Imagenes imagenes={imagenes} producto={producto} onSelectColor={setSelectedColor} />
                            </div>

                            <div className='product-page-target product-page-target-2 d-flex-column gap-20'>
                                <div className='product-page-top-info'>
                                    <p className='product-page-category'>{producto.categoria}</p>
                                    <h1 className='product-page-name'>{producto.nombre}</h1>
                                    <Sku producto={producto} />
                                </div>

                                <div className='d-grid-2-1fr gap-20'>
                                    <div className='d-flex-column gap-20'>
                                        <div className='page-product-prices'>
                                            <p className='page-product-normal-price'>Antes: S/.{producto.precioNormal}</p>
                                            <p className='page-product-sale-price'>Ahora: S/.{producto.precioVenta}</p>
                                        </div>

                                        <Regalos producto={producto} />

                                        <div className='d-flex gap-20'>
                                            <Resumen producto={producto} />
                                            <Medidas producto={producto} />
                                        </div>

                                        <div className='d-flex-column'>
                                            <div className='d-flex-start gap-5'>
                                                <span className='color-red'>*</span>
                                                <p className='text font-14'>Realizamos envios inmediatos a provincia</p>
                                            </div>
                                            <div className='d-flex-start gap-5'>
                                                <span className='color-red'>*</span>
                                                <p className='text font-14'>Entregas el mismo día para Lima y Callao</p>
                                            </div>
                                        </div>

                                        <Beneficios/>
                                    </div>

                                    <div className='d-flex-column gap-20'>
                                        <Envios producto={producto} onConfirm={(data) => {
                                            setShippingInfo(data); 
                                            setShippingOptions(data.shippingOptions);

                                            if (data.shippingOptions.length === 1) {
                                                setSelectedShipping({
                                                    tipo: data.shippingOptions[0].tipo,
                                                    precio: data.shippingOptions[0].precio
                                                });
                                            }
                                        }}/>

                                        <TiposDeEnvio shippingOptions={shippingOptions} 
                                            provincia={shippingInfo?.locationData?.provincia || ''} 
                                            distrito={shippingInfo?.locationData?.distrito || ''} 
                                            hasAgency={shippingInfo?.hasAgency} 
                                            selectedTipo={selectedShipping.tipo} 
                                            onSelect={(tipo, precio) => setSelectedShipping({ tipo, precio })} 
                                        />

                                        <div className='product-page-user-name-container d-flex-column gap-5'>
                                            <p className='text'><b className='color-red'>*</b> Nombres</p>
                                            <input type='text' placeholder='Nombres' className='product-page-user-name' value={userName}
                                                onChange={(e) => {
                                                    setUserName(e.target.value);
                                                    localStorage.setItem('nombre', e.target.value);
                                                }} 
                                            />
                                        </div>

                                        <div className='d-flex-column gap-5'>
                                            <p className='title text'>Detalles:</p>

                                            {!selectedColor ? (
                                                <p className='d-flex gap-5'><b className='color-red'>*</b>Sin variación de color</p>
                                            ) : (
                                                <div className='d-flex-column gap-5'>
                                                    <p className='bold color-black d-flex gap-5'><b className='color-red'>*</b>Color seleccionado:</p>
                                                    <div className='d-flex-center-left gap-5'>
                                                        <span className='first-uppercase'>{selectedColor.color}</span>
                                                        <img width={26} height={18} src={selectedColor.img} alt={selectedColor.color} loading="lazy" style={{ borderRadius: '10%' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className='d-flex-center-center gap-10'>
                                            <div className='d-flex-column gap-10'>
                                                <div className='quantity'>
                                                    <button type="button" onClick={handleRemove} disabled={quantity <= 1} >
                                                        <span className="material-icons">remove</span>
                                                    </button>
                                                    <div className="quantity-input">{quantity}</div>
                                                    <button type="button" onClick={handleAdd} disabled={quantity >= 10}>
                                                        <span className="material-icons">add</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <WhatsApp producto={producto} selectedShipping={selectedShipping} shippingInfo={shippingInfo} selectedColor={selectedColor} quantity={quantity} handleContinuarClick={handleContinuarClick}/>
                                        </div>

                                        <div className='whatsapp-message d-flex d-flex-column gap-5'>
                                            <span className="material-icons">info</span>
                                            <p>La información solicitada se utilizará para agilizar el proceso de compra.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Descripcion producto={producto}/>
                    </section>
                </div>

                <Suspense fallback={<div className="loading-mas-productos">Cargando productos relacionados...</div>}>
                    <MasProductos categoriaActual={producto.categoria}/>
                </Suspense>
            </main>
        </>
    );
}

export default PaginaProducto;

