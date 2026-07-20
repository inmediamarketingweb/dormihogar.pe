import './WhatsApp.css';

function WhatsApp({ producto, quantity = 1, shippingInfo }) {
    const numeroWhatsApp = "+51933197648";

    const formatShippingOptions = () => {
        if (!shippingInfo) return "";
        
        const selectedShippingType = shippingInfo.selectedShippingType;
        const shippingOptions = shippingInfo.shippingOptions || [];
        
        // Buscar la opción seleccionada
        const selectedOption = shippingOptions.find(opt => opt.tipo === selectedShippingType);

        if (!selectedOption) return "";

        // Formatear el nombre del tipo de envío seleccionado
        let nombreMostrado = '';
        let precio = 0;
        
        switch(selectedOption.tipo) {
            case "Gratis":
                nombreMostrado = 'Gratis';
                precio = selectedOption.precio || 0;
                break;
            case "Envío preferente":
                nombreMostrado = 'Preferente';
                precio = selectedOption.precio || 0;
                break;
            case "Envío aplicado":
                nombreMostrado = 'Aplicado';
                precio = selectedOption.precio || 0;
                break;
            case "Envío express":
                nombreMostrado = 'Express';
                precio = selectedOption.precio || 0;
                break;
            case "Envío directo":
                nombreMostrado = 'Directo';
                precio = selectedOption.precio || 0;
                break;
            default:
                nombreMostrado = selectedOption.tipo;
                precio = selectedOption.precio || 0;
        }

        let shippingText = `* ${nombreMostrado}`;
        
        if (precio > 0) {
            shippingText += `: S/.${precio}`;
        } else {
            shippingText += `: Gratis`;
        }
        shippingText += '\n';

        return shippingText;
    };

    const formatDestinationInfo = () => {
        if (!shippingInfo || !shippingInfo.locationData) return "";
        
        let destinationText = "\n📍 *Datos de entrega:*\n";

        if (shippingInfo.locationData.nombres) {
            destinationText += `* *Nombres:* ${shippingInfo.locationData.nombres}\n`;
        }

        destinationText += `* *Departamento:* ${shippingInfo.locationData.departamento}\n`;
        destinationText += `* *Provincia:* ${shippingInfo.locationData.provincia}\n`;
        destinationText += `* *Distrito:* ${shippingInfo.locationData.distrito}\n`;

        if (shippingInfo.selectedAgency) {
            destinationText += `* *Agencia:* ${shippingInfo.selectedAgency}\n`;
        }

        if (shippingInfo.selectedSede) {
            destinationText += `* *Sede:* ${shippingInfo.selectedSede}\n`;
        }

        // Mostrar el tipo de envío seleccionado con su precio
        if (shippingInfo.selectedShippingType) {
            const shippingOptions = shippingInfo.shippingOptions || [];
            
            // Buscar la opción seleccionada por tipo
            const selectedOption = shippingOptions.find(opt => opt.tipo === shippingInfo.selectedShippingType);
            const precio = selectedOption?.precio || 0;
            
            let tipoMostrado = '';
            
            // Determinar el nombre a mostrar según el tipo
            if (shippingInfo.selectedShippingType === "Gratis") {
                tipoMostrado = 'Gratis';
            } else if (shippingInfo.selectedShippingType === "Envío preferente") {
                tipoMostrado = 'Preferente';
            } else if (shippingInfo.selectedShippingType === "Envío aplicado") {
                tipoMostrado = 'Aplicado';
            } else if (shippingInfo.selectedShippingType === "Envío express") {
                tipoMostrado = 'Express';
            } else if (shippingInfo.selectedShippingType === "Envío directo") {
                tipoMostrado = 'Directo';
            } else {
                tipoMostrado = shippingInfo.selectedShippingType;
            }
            
            destinationText += `* *Tipo de envío:* ${tipoMostrado}`;
            if (precio > 0) {
                destinationText += ` (S/.${precio})`;
            } else {
                destinationText += ` (Gratis)`;
            }
            destinationText += `\n`;
        }

        return destinationText + "\n";
    };

    const getWhatsAppLink = () => {
        const precioTotalProducto = producto.precioVenta * quantity;
        
        // Calcular el precio del envío seleccionado
        let precioEnvio = 0;
        if (shippingInfo) {
            const selectedOption = shippingInfo.shippingOptions?.find(opt => opt.tipo === shippingInfo.selectedShippingType);
            precioEnvio = selectedOption?.precio || 0;
        }
        
        const totalConEnvio = precioTotalProducto + precioEnvio;

        let mensaje =
            `🛏️ *${producto.nombre}*\n\n` +
            `💰 *Precio:* S/.${producto.precioVenta}\n` +
            `📦 *Cantidad:* ${quantity}\n` +
            `💵 *Subtotal:* S/.${precioTotalProducto}\n`;
        
        if (shippingInfo) {
            const shippingOptionsText = formatShippingOptions();
            if (shippingOptionsText) {
                mensaje += `\n🚚 *Envío seleccionado:*\n${shippingOptionsText}`;
            }

            const destinationText = formatDestinationInfo();
            if (destinationText) {
                mensaje += destinationText;
            }
            
            // Agregar total final
            if (precioEnvio > 0) {
                mensaje += `💰 *Total a pagar:* S/.${totalConEnvio}\n\n`;
            } else {
                mensaje += `💰 *Total a pagar:* S/.${totalConEnvio} (Envío gratis)\n\n`;
            }
        }
        
        mensaje += `🔗 ${producto.ruta}`;

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
