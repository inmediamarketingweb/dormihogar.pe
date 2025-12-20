import { useState, useEffect } from 'react';

import './Colores.css';

function Colores({ colorName = "Seleccionar color" }){
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        if (!colorName || colorName === "Seleccionar color") {
            setImageSrc(null);
            return;
        }

        const normalizedColorName = colorName.toLowerCase().replace(/\s+/g, '-');
        const extensions = ['webp', 'png', 'jpg'];
        let currentIndex = 0;

        const tryNextExtension = () => {
            if (currentIndex >= extensions.length) {
                setImageSrc(null);
                return;
            }

            const extension = extensions[currentIndex];
            const imageUrl = `/assets/imagenes/colores/${normalizedColorName}.${extension}`;
            const img = new Image();
            img.onload = () => {
                setImageSrc(imageUrl);
            };
            img.onerror = () => {
                currentIndex++;
                tryNextExtension();
            };
            img.src = imageUrl;
        };

        tryNextExtension();

    }, [colorName]);

    return(
        <div className='product-page-color-select d-flex gap-10 margin-right'>
            <div className='d-flex-center-left gap-5'>
                <p className='color-color-1 title uppercase'>Color:</p>
                <p className='text lowercase first-uppercase margin-right'>{colorName}</p>
            </div>

            {imageSrc && (
                <a href={imageSrc} title="Ver detalles" target='_blank' rel='noopener noreferrer'>
                    <img src={imageSrc} alt={`Imagen del color ${colorName}`}/>
                </a>
            )}
        </div>
    )
}

export default Colores;
