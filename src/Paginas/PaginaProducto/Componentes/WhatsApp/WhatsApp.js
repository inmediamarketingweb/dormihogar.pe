import './WhatsApp.css';

function WhatsApp({producto, selectedShipping, shippingInfo, selectedColor, quantity, handleContinuarClick}) {
    if (!producto) return null;

    const getWhatsAppLink = () => {
        if (!selectedShipping.tipo) return "#";

        const numeroWhatsApp = "+51933197648";
        const userName = localStorage.getItem('nombre') || '';

        const mensaje = `Hola Dormihogar 🛌, estoy interesad@ en adquirir este/os producto/s:\n`
            + `*${producto.nombre}*\n`
            + `https://dormihogar.pe${producto.ruta}\n`
            + `Tela: ${selectedColor ? selectedColor.tela : 'Sin variación'}\n`
            + `Color: ${selectedColor ? selectedColor.color : 'Sin variación'}\n`
            + `Precio: S/.${producto.precioVenta}\n\n`
            + `Cantidad: ${quantity}\n\n`
            + `Cliente: ${userName}\n`
            + `Departamento: ${shippingInfo?.locationData?.departamento || ''}\n`
            + `Provincia: ${shippingInfo?.locationData?.provincia || ''}\n`
            + `Distrito: ${shippingInfo?.locationData?.distrito || ''}\n\n`
            + (shippingInfo?.selectedAgency ? `Agencia seleccionada: ${shippingInfo.selectedAgency}\n` : "")
            + (shippingInfo?.selectedSede ? `Sede de agencia: ${shippingInfo.selectedSede}\n` : "")
            + `Tipo de envío seleccionado: ${selectedShipping.tipo}\n`
            + `Costo de envío: S/.${selectedShipping.precio || 0}`;
    
        return `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    };

    const userName = localStorage.getItem('nombre') || '';
    const district = shippingInfo?.locationData?.distrito || '';
    const headquarters = shippingInfo?.selectedAgency || shippingInfo?.selectedSede || '';
    
    const hasRequiredFields = Boolean(
        userName.trim() && 
        (district.trim() || headquarters.trim())
    );

    const buttonClasses = [
        'product-page-whatsapp',
        hasRequiredFields && 'active',
        producto.stock === 0 && 'sin-stock'
    ].filter(Boolean).join(' ');

    return(
        <a href={getWhatsAppLink()} className={buttonClasses} target="_blank" rel="noopener noreferrer" onClick={handleContinuarClick}>
            <img src="/assets/imagenes/iconos/whatsapp-blanco.svg" alt="WhatsApp | dormihogar"/>
            <p>Continuar</p>
        </a>
    )
}

export default WhatsApp;