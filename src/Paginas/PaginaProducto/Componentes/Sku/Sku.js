import './Sku.css';

function Sku({ producto }){
    const handleCopy = () => {
        const skuElement = document.querySelector('.sku');
        if (!skuElement) return;
        const skuText = skuElement.textContent.trim();

        const showCopiedMessage = () => {
            const copiedElement = document.querySelector('.copied');
            if (copiedElement) {
                copiedElement.classList.add('active');
                setTimeout(() => {
                    copiedElement.classList.remove('active');
                }, 3000);
            }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(skuText)
                .then(showCopiedMessage)
                .catch(err => {
                    console.error("Error al copiar el SKU con clipboard API: ", err);
                    fallbackCopyTextToClipboard(skuText, showCopiedMessage);
                });
        } else {
            fallbackCopyTextToClipboard(skuText, showCopiedMessage);
        }
    };

    const fallbackCopyTextToClipboard = (text, onSuccess) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = 0;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                onSuccess();
            } else {
                console.error('Fallback: No se pudo copiar el texto');
            }
        } catch (err) {
            console.error('Fallback: Error al copiar el texto', err);
        } finally {
            document.body.removeChild(textArea);
        }
    };

    return (
        <button type='button' className='product-page-sku' onClick={handleCopy}>
            <p className='text font-bold'>SKU</p>
            <p className='sku'>{producto.sku}</p>
            <span className="material-icons">content_copy</span>
            <span className='copied'>Copiado</span>
        </button>
    );
}

export default Sku;
