import { useState, useEffect } from 'react';
import './Imagenes.css';
import LazyImage from '../../../../Componentes/Plantillas/LazyImage';
import Compartir from '../Compartir/Compartir';

function Imagenes({ imagenes, producto }){
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [zoomActive, setZoomActive] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
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

    if (!producto) {
        return <div>Error: Producto no disponible</div>;
    }

    const tipoEnvio = producto["tipo-de-envio"] || "Envío estándar";
    const tipoEnvioLower = tipoEnvio ? tipoEnvio.toLowerCase() : "envío estándar";
    const textoEnvio = tipoEnvioLower === 'gratis' ? 'Envío gratis' : tipoEnvio;
    const claseEnvio = tipoEnvioLower === 'gratis' ? 'gratis' : '';
    const navigateTo = (idx) => { if (idx >= 0 && idx < imagenes.length) setCurrentIndex(idx); };
    const handlePrev = () => navigateTo((currentIndex - 1 + imagenes.length) % imagenes.length);
    const handleNext = () => navigateTo((currentIndex + 1) % imagenes.length);
    const handleMouseDown = (e) => { setDragStartX(e.clientX); setIsDragging(true); };

    const handleMouseUp = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        setIsDragging(false);
        Math.abs(deltaX) > 50 && (deltaX > 0 ? handlePrev() : handleNext());
    };

    const handleMouseEnter = () => setZoomActive(true);
    const handleMouseLeave = () => setZoomActive(false);
    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    const precioNormal = producto.precioNormal || 0;
    const precioVenta = producto.precioVenta || 0;
    const descuento = precioNormal > 0 ? Math.round(((precioNormal - precioVenta) * 100) / precioNormal) : 0;
    const nombreProducto = producto.nombre || "Producto";

    return(
        <div className="position-relative">
            {descuento > 0 && <span className='image-discount'>-{descuento}%</span>}

            <div className='product-page-image-component'>
                <div className="product-page-images-miniatures-container">
                    <ul className="product-page-images-miniatures">
                        {imagenes.map((img, i) => (
                            <li key={i} className={i === currentIndex ? 'active' : ''} onClick={() => navigateTo(i)}>
                                <LazyImage width={isSmallScreen ? 74 : 80} height={isSmallScreen ? 74 : 80} src={img} alt={nombreProducto}/>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="product-page-images-container">
                    {tipoEnvioLower === 'gratis' && (
                        <div className={`tipo-de-envio ${claseEnvio} d-flex-center-center gap-5`}>
                            <span className="material-symbols-outlined">delivery_truck_speed</span>
                            <p>{textoEnvio}</p>
                        </div>
                    )}

                    <div className="product-page-images-content" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={(e) => { handleMouseUp(e) }}>
                        <ul className="product-page-images" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                            {imagenes.map((src, i) => (
                                <li key={i}>
                                    <div className="zoom-wrapper" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                                        <img width={isSmallScreen ? 385 : 680} height={isSmallScreen ? 385 : 680} src={src} alt={nombreProducto}/>
                                        {zoomActive && i === currentIndex && (
                                            <div className="zoom-lens" style={{ backgroundImage: `url(${src})`, backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`}}/>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="product-page-images-button product-page-images-button-1" onClick={handlePrev}>
                        <span className="material-icons">chevron_left</span>
                    </button>

                    <button className="product-page-images-button product-page-images-button-2" onClick={handleNext}>
                        <span className="material-icons">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className='visible-on-mobile-no-desktop product-images-share-button'>
                <Compartir/>
            </div>
        </div>
    );
}

export default Imagenes;
