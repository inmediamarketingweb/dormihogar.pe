import './WhatsApp.css';

function WhatsApp({ producto, quantity = 1, shippingInfo }) {
    const obtenerNumeroSegunHorario = () => {
        const ahora = new Date();
        const hora = ahora.getHours();
        const minutos = ahora.getMinutes();
        const horaActual = hora + minutos / 60;
        const diaSemana = ahora.getDay();
        const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
        const numero1 = "+51901451579";
        const numero2 = "+51974317647";

        if (esFinDeSemana) {
            return numero2;
        }

        if (horaActual >= 7.0 && horaActual < 13.5) {
            return numero1;
        }

        return numero2;
    };

    const formatShippingOptions = () => {
        if (!shippingInfo) return "";
        let shippingText = "";

        if (shippingInfo.productShippingOption) {
            const mainShipping = shippingInfo.productShippingOption;
            shippingText += `* ${mainShipping.tipo}: S/.${mainShipping.precio}\n`;
        }

        if (shippingInfo.selectedExpress && shippingInfo.expressOption) {
            const expressShipping = shippingInfo.expressOption;
            shippingText += `* ${expressShipping.tipo}: S/.${expressShipping.precio}\n`;
        }

        if (shippingInfo.selectedDirecto && shippingInfo.directoOption) {
            const directoShipping = shippingInfo.directoOption;
            shippingText += `* ${directoShipping.tipo}: S/.${directoShipping.precio}\n`;
        }

        let totalEnvio = 0;

        if (shippingInfo.productShippingOption) {
            totalEnvio += parseFloat(shippingInfo.productShippingOption.precio) || 0;
        }
        if (shippingInfo.selectedExpress && shippingInfo.expressOption) {
            totalEnvio += parseFloat(shippingInfo.expressOption.precio) || 0;
        }
        if (shippingInfo.selectedDirecto && shippingInfo.directoOption) {
            totalEnvio += parseFloat(shippingInfo.directoOption.precio) || 0;
        }

        return shippingText;
    };

    const formatDestinationInfo = () => {
        if (!shippingInfo || !shippingInfo.locationData) return "";
        let destinationText = "\n";

        if (shippingInfo.locationData.nombres) {
            destinationText += `* *Nombres:* ${shippingInfo.locationData.nombres}\n`;
        }

        destinationText += `* *Destino:* ${shippingInfo.locationData.departamento} > ${shippingInfo.locationData.provincia} > ${shippingInfo.locationData.distrito}\n`;

        if (shippingInfo.selectedAgency) {
            destinationText += `* *Agencia:* ${shippingInfo.selectedAgency}\n`;
        }

        if (shippingInfo.selectedSede) {
            destinationText += `* *Sede:* ${shippingInfo.selectedSede}\n\n`;
        }

        return destinationText;
    };

    const getWhatsAppLink = () => {
        const numeroWhatsApp = obtenerNumeroSegunHorario();
        const precioTotalProducto = producto.precioVenta * quantity;

        let mensaje =
            `*${producto.nombre}*\n\n` +
            `* Precio: S/.${producto.precioVenta}\n` +
            `* Cantidad: ${quantity}\n` +
            `* Subtotal: S/.${precioTotalProducto}\n`;
        
        if (shippingInfo) {
            const shippingOptionsText = formatShippingOptions();
            if (shippingOptionsText) {
                mensaje += shippingOptionsText;
            }

            const destinationText = formatDestinationInfo();
            if (destinationText) {
                mensaje += destinationText;
            }
        }
        
        mensaje += `https://dormihogar.pe${producto.ruta}`;

        return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    };

    return (
        <a href={getWhatsAppLink()} className="w-100 product-page-whatsapp active" target="_blank" rel="noopener noreferrer">
            <img src="/assets/imagenes/iconos/whatsapp-blanco.svg" alt="WhatsApp | Homesleep" />
            <p>Continuar</p>
        </a>
    );
}

export default WhatsApp;
