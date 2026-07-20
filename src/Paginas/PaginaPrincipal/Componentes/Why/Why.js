import './Why.css';

function Why(){
    return(
        <>
            <div className='block-container d-flex-column gap-20 why-block-container'>
                <section className='block-content why-block-content'>
                    <div className='block-title-container'>
                        <h2 className='block-title'>¿ Por qué comprar en <b>Dormi</b>hogar ?</h2>
                        <p className='block-title-span'>Más de 15 años brindando descanso, calidad y confianza a miles de familias peruanas</p>
                    </div>

                    <ul className='why-list'>
                        <li>
                            <span class="material-symbols-outlined">rewarded_ads</span>
                            <p className='title'>14 años de experiencia</p>
                            <p className='text'>Miles de hogares confían en Dormihogar</p>
                        </li>
                        <li>
                            <span class="material-symbols-outlined">local_shipping</span>
                            <p className='title'>Envíos a todo el Perú</p>
                            <p className='text'>Entregamos rápido y seguro en Lima, Callao y provincia</p>
                        </li>
                        <li>
                            <span class="material-symbols-outlined">verified</span>
                            <div className='d-flex-center-center'>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </div>
                            <p className='title'>Marcas oficiales</p>
                            <p className='text'>Trabajamos con las mejores marcas de descanso del país</p>
                        </li>
                        <li>
                            <span class="material-symbols-outlined">headset_mic</span>
                            <p className='title'>Asesoría personalizada</p>
                            <p className='text'>Te ayudamos a elegir el dormitorio ideal para ti</p>
                        </li>
                        <li>
                            <span class="material-symbols-outlined">security</span>
                            <p className='title'>Compra 100% segura</p>
                            <p className='text'>Protegemos tu información y tus compras</p>
                        </li>
                        <li>
                            <span class="material-symbols-outlined">favorite</span>
                            <p className='title'>Clientes felices</p>
                            <p className='text'>Miles de clientes satisfechos nos respaldan</p>
                        </li>
                    </ul>
                </section>
            </div>
        </>
    )
}

export default Why;
