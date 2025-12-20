import './WhatsApp.css';

function WhatsApp({ producto, quantity = 1 }) {

    const obtenerNumeroSegunHorario = () => {
        const ahora = new Date();
        const hora = ahora.getHours();
        const minutos = ahora.getMinutes();
        const horaActual = hora + minutos / 60;
        const diaSemana = ahora.getDay();
        const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

        const numero1 = "+51933197648";
        const numero2 = "+51933197648";

        if (esFinDeSemana) {
            return numero2;
        }

        if (horaActual >= 7.0 && horaActual < 13.5) {
            return numero1;
        }

        return numero2;
    };

    const getWhatsAppLink = () => {
        const numeroWhatsApp = obtenerNumeroSegunHorario();

        const mensaje =
            `*${producto.nombre}*\n\n` +
            `_*S/.${producto.precioVenta}*_\n\n` +
            `Cantidad: ${quantity}\n\n` +
            `SKU: ${producto.sku}\n` +
            `https://homesleep.pe${producto.ruta}`;

        return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    };

    return (
        <a href={getWhatsAppLink()} className="product-page-whatsapp active" target="_blank" rel="noopener noreferrer">
            <img src="/assets/imagenes/iconos/whatsapp-blanco.svg" alt="WhatsApp | Homesleep" />
            <p>Continuar</p>
        </a>
    );
}

export default WhatsApp;
