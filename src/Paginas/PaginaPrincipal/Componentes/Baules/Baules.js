import { useEffect, useState } from 'react';
import { Producto } from '../../../../Componentes/Plantillas/Producto/Producto';
import './Baules.css';

function Baules(){
    const [productos, setProductos] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [skusOfertas, setSkusOfertas] = useState([]);
    const isOfferActive = skusOfertas.length > 0;

    const skusDeseados = [
        "D323236N1000",
        "D324234N1000",
        "D324236N1006",
        "D324236N1010",
        "D324236N1024"
    ];

    useEffect(() => {
        const favStorage = JSON.parse(localStorage.getItem("favoritos")) || {};
        setFavorites(favStorage);
    }, []);

    const handleToggleFavorite = (producto) => {
        setFavorites(prev => {
            const newFavorites = { ...prev };

            if (newFavorites[producto.sku]) {
                delete newFavorites[producto.sku];
            } else {
                newFavorites[producto.sku] = producto;
            }

            localStorage.setItem("favoritos", JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    useEffect(() => {
        const cargarOfertas = async () => {
            try {
                const response = await fetch('/assets/json/ofertas.json');
                const data = await response.json();
                setSkusOfertas(data);
            } catch (error) {
                console.error("Error cargando ofertas:", error);
                setSkusOfertas([]);
            }
        };

        cargarOfertas();
    }, []);

    useEffect(() => {
        fetch('/assets/json/manifest.json')
            .then(res => res.json())
            .then(manifest => {
                const promesas = manifest.files.map(fileUrl => 
                    fetch(fileUrl)
                        .then(res => res.json())
                        .then(jsonData => {
                            const match = fileUrl.match(/\/assets\/json\/categorias\/([^/]+)\/sub-categorias\//);
                            const categoria = match ? match[1] : null;

                            if (Array.isArray(jsonData.productos) && categoria) {
                                jsonData.productos = jsonData.productos.map(producto => ({
                                    ...producto,
                                    categoria,
                                }));
                            }

                            return jsonData.productos || [];
                        })
                        .catch(err => {
                            console.error(`Error cargando ${fileUrl}:`, err);
                            return [];
                        })
                );

                return Promise.all(promesas);
            })
            .then(listaDeProductos => {
                const todosLosProductos = listaDeProductos.flat();

                const productosFiltrados = skusDeseados
                    .map(sku => todosLosProductos.find(p => p.sku === sku))
                    .filter(Boolean);

                setProductos(productosFiltrados);
            })
            .catch(error => console.error('Error al cargar el manifest o los JSON:', error));
    }, []);

    const truncate = (str, maxLength) => {
        if (!str) return '';
        return str.length <= maxLength ? str : str.slice(0, maxLength) + '...';
    };

    const isProductFavorite = (sku) => {
        return favorites[sku] !== undefined;
    };

    return(
        <div className='block-container'>
            <section className='block-content'>
                <div className='block-title-container'>
                    <h2 className='block-title'><b>Promo</b> del mes</h2>
                    <p className='block-title-span'>Baúl 2 palzas a solo s/200 por la compra de cualquier combo king</p>
                </div>

                <div className='baules-container d-flex-column gap-10'>
                    {/* <img 
                        src='https://mercury.vtexassets.com/assets/vtex.file-manager-graphql/images/5085d321-a6d4-429f-aab7-3749380b54cd___401a3a94d2817adcca9bc44b0fa62227.webp' 
                        alt='Promo del mes'
                    /> */}

                    <ul className='baules-content'>
                        {productos.map(producto => (
                            <Producto 
                                key={producto.sku} 
                                producto={producto} 
                                truncate={truncate} 
                                onToggleFavorite={handleToggleFavorite} 
                                isFavorite={isProductFavorite(producto.sku)}
                                skusOfertas={skusOfertas} 
                                isOfferActive={isOfferActive}
                            />
                        ))}
                    </ul>

                    <a href='https://dormihogar.pe/productos/dormitorios/king/?marca=Kamas&linea-dormitorio=americanos&resorte=bonell&linea-colchon=ortop%C3%A9dicos&modelo=sarki&baul=si' title='Promoción baúles | Dormihogar' className='button-link button-link-1 margin-left'>
                        <p className='button-link-text'>Ver promoción</p>
                        <span class="material-symbols-outlined">arrow_outward</span>
                    </a>
                </div>
            </section>
        </div>
    );
}

export default Baules;
