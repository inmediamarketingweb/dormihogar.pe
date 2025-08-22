import './NoProducto.css';

function NoProducto(){
    return(
        <>
            <main>
                <div className='block-container margin-auto'>
                    <section className='block-content d-flex-center-center d-flex-column'>
                        <p className='block-title'>Producto no encontrado, verifica la dirección URL</p>
                        <img src="/assets/imagenes/componentes/404/404.svg" alt="Producto no encontrado | Dormihogar" className='no-product-image' width={320} height={320} />
                    </section>
                </div>
            </main>
        </>
    )
}

export default NoProducto;
