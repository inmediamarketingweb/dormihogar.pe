import './Top.css';

function Top(){
    return(
        <div className='header-top-container'>
            <section className='header-top d-flex-center-between'>
                <ul className='header-top-left d-flex-center-left gap-10'>
                    <li>
                        <p>Atención de lunes a sábados de 08:00 am a 08:00 pm</p>
                    </li>
                    <li>
                        <p>|</p>
                    </li>
                    <li className='d-flex-center-center gap-5'>
                        <p>Atención al cliente</p>

                        <ul className='d-flex-center-left gap-5'>
                            <li>
                                <a href='tel: +51933197648' title="Llamar" className='d-flex-center-center gap-5'>
                                    <img src="/assets/imagenes/iconos/telefono-gris.svg" alt="Teléfono | Dormihogar" />
                                    <h2>933197648</h2>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p>|</p>
                    </li>
                    <li>
                        <a href='https://wa.link/abc0r5' target='_blank' rel="noopener noreferrer" title="WhatsApp | Dormihogar" className='d-flex-center-center gap-5'>
                            <img src="/assets/imagenes/iconos/whatsapp-gris.svg" alt="WhatsApp | Dormihogar" />
                            <h2>WhatsApp</h2>
                        </a>
                    </li>
                </ul>

                <div className='margin-left location d-flex-center-center gap-10'>
                    <p>Lima, Lima - Perú</p>
                    <span></span>
                </div>
            </section>
        </div>
    )
}

export default Top;
