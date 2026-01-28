import './Footer.css';

function Footer(){
    return(
        <>
            <a href='https://wa.link/6yvsrx' target='_blank' rel="noopener noreferrer" className='whatsapp-button'>
                <img src="/assets/imagenes/iconos/whatsapp-blanco.svg" alt="icono de whatsapp"/>
            </a>

            <footer className='w-100 d-flex-column gap-20'>
                <div className='footer-block-container'>
                    <section className='footer-block-content'>
                        <div className='block-title-container'>
                            <p className='block-title'>Dormihogar</p>
                        </div>

                        <nav className='footer-targets'>
                            <div className='footer-target footer-target-1'>
                                <p className='title'>Acerca de nosotros</p>

                                <ul className='footer-list'>
                                    <li>
                                        <a href='/nosotros/' title='Nosotros | Dormihogar'>
                                            <p>Nosotros</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/paleta-de-colores/' title='Paleta de colores | Dormihogar'>
                                            <p>Paleta de colores</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/nosotros/razones-para-comprar/' title='Razones para comprar | Dormihogar'>
                                            <p>Razones para comprar</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/nosotros/propiedad-intelectual/' title='Propiedad intelectual | Dormihogar'>
                                            <p>Propiedad intelectual</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/agencias-recomendadas/' title='Agencias recomendadas | Dormihogar'>
                                            <p>Agencias recomendadas</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/envios/envios-a-lima-y-callao/' title='Envios a Lima y Callao | Dormihogar'>
                                            <p>Envios a Lima y Callao</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/envios/envios-a-provincia/' title='Envios a provincia | Dormihogar'>
                                            <p>Envios a provincia</p>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className='footer-target footer-target-2'>
                                <p className='title'>Servicio al cliente</p>
                                <ul className='footer-list'>
                                    <li>
                                        <a href='/servicio-al-cliente/costos-de-envio-por-zona/' title='Costos de envio por zona | Dormihogar'>
                                            <p>Costos de envío por zona</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/servicio-al-cliente/medios-de-pago/' title='Medios de pago | Dormihogar'>
                                            <p>Medios de pago</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/servicio-al-cliente/garantia-de-productos/' title='Garantía de producto | Dormihogar'>
                                            <p>Garantía de productos</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/servicio-al-cliente/recomendaciones-de-uso/' title='Recomendaciones de uso | Dormihogar'>
                                            <p>Recomendaciones de uso</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/servicio-al-cliente/politica-de-cambios-y-devoluciones/' title='Política de cambios y devoluciones | Dormihogar'>
                                            <p>Política de cambios y devoluciones</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/servicio-al-cliente/privacidad-y-seguridad/' title='Privacidad y seguridad | Dormihogar'>
                                            <p>Privacidad y seguridad</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/servicio-al-cliente/terminos-y-condiciones/' title='Términos y condiciones | Dormihogar'>
                                            <p>Términos y condiciones</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/servicio-al-cliente/horarios-de-entrega-y-envios/' title='Horarios de entrega y envíos | Dormihogar'>
                                            <p>Horarios de entrega y envíos</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/servicio-al-cliente/manual-de-instalacion/' title='Manual de instalación | Dormihogar'>
                                            <p>Manual de instalación</p>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className='footer-target footer-target-3'>
                                <div className='d-flex-column gap-10'>
                                    <p className='title'>Novedades</p>
                                    <ul className='footer-list'>
                                        <li>
                                            <a href='/novedades/programa-de-influencers/' title='Programa de influencers | Dormihogar'>
                                                <p>Programa influencers</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='/novedades/programa-de-referencias/' title='Progama de referencias | Dormihogar'>
                                                <p>Programa de referencias</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='https://blog.dormihogar.pe' title='Blog | Dormihogar'>
                                                <p>Blog</p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className='d-flex-column gap-10'>
                                    <p className='title'>Siguenos:</p>
                                    
                                    <ul className='d-flex-center-left gap-5 social-networks'>
                                        <li>
                                            <a href='https://www.facebook.com/Dormihogar.pe' target='_blank' rel="noopener noreferrer" title='Facebook | Dormihogar'>
                                                <img src="/assets/imagenes/iconos/facebook-blanco.svg" width={20} height={20} alt="Visita nuestro perfil en Facebook"/>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='https://www.tiktok.com/@dormihogar.pe' target='_blank' rel="noopener noreferrer" title='Tik Tok | Dormihogar'>
                                                <img src="/assets/imagenes/iconos/tiktok-blanco.svg" width={20} height={20} alt="Visita nuestro perfil en TikTok"/>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className='footer-target footer-target-4'>
                                <div className='d-flex-column gap-10'>
                                    <p className='title'>Contáctanos</p>
                                    <ul className='footer-list'>
                                        <li>
                                            <p className='text'>Carabayllo - Lima - Perú</p>
                                        </li>
                                        <li>
                                            <a href='tel: +51933197648' title='Llamar ahora'>
                                                <p>933197648</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='mailto: informes@dormihogar.pe' title='Correo'>
                                                <p>informes@dormihogar.pe</p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </section>
                </div>

                <div className='footer-bottom-container'>
                    <section className='footer-bottom'>
                        <ul className='d-flex-center-center gap-10'>
                            <li>
                                <img src="/assets/imagenes/componentes/footer/visa.svg" width={20} height={20} alt="Visa | Dormihogar" />
                            </li>
                            <li>
                                <img src="/assets/imagenes/componentes/footer/mastercard.svg" width={20} height={20} alt="Mastercard | Dormihogar" />
                            </li>
                            <li>
                                <img src="/assets/imagenes/componentes/footer/bcp.svg" width={58} height={20} alt="BCP | Dormihogar" />
                            </li>
                            <li>
                                <img src="/assets/imagenes/componentes/footer/interbank.svg" width={110} height={20} alt="Interbank | Dormihogar" />
                            </li>
                            <li>
                                <img src="/assets/imagenes/componentes/footer/bbva.svg" width={66} height={20} alt="BBVA | Dormihogar" />
                            </li>
                            <li>
                                <img src="/assets/imagenes/componentes/footer/scotiabank.svg" width={80} height={20} alt="Scotiabank | Dormihogar" />
                            </li>
                            <li>
                                <img src="/assets/imagenes/componentes/footer/banco-de-la-nacion.svg" width={97} height={20} alt="Banco de la nación | Dormihogar" />
                            </li>
                        </ul>

                        <p className='text color-white'>&copy; Todos los derechos reservados para <a href='https://dormihogar.pe/' title='Dormihogar | Fabricantes de colchones, camas y dormitorios' className='color-white'>dormihogar.pe</a></p>
                    </section>
                </div>
            </footer>
        </>
    );
}

export default Footer;
