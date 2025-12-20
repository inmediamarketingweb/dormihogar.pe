import { useState } from 'react';

import './Compartir.css';

function Compartir(){
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const message = "¡Mira esto!";

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(currentUrl);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = currentUrl;
                textArea.style.position = 'fixed';
                textArea.style.opacity = 0;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            console.log('URL copiada!');
        } catch (err) {
            console.error("Error al copiar: ", err);
            alert(`No se pudo copiar la URL. Por favor, copia manualmente: ${currentUrl}`);
        }
    };

    const shareOnWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(message + ' ' + currentUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
    };

    return (
        <div className="share-widget">
            <button type='button' className='share-button' onClick={toggleMenu}>
                <span className="material-symbols-outlined">share</span>
                <p className='text'>Compartir</p>
            </button>

            {isOpen && (
                <div className="share-menu">
                    <button onClick={shareOnWhatsApp} className="share-option whatsapp">
                        <span className="icon">WhatsApp</span>
                    </button>
                    <button onClick={handleCopy} className="share-option copy">
                        <span className="material-icons">content_copy</span>
                        <p className='text'>Copiar enlace</p>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Compartir;
