import { useEffect, useState } from 'react';

import './SobreNosotros.css';

function SobreNosotros(){
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return(
        <div className='block-container block-container-homepage-about-us'>
            <section className='block-content block-content-homepage-about-us'>
                <div className='block-title-container'>
                    <h2 className='block-title'><b>Dormihogar</b></h2>
                    <p className='block-title-span'>Las mejores marcas, al mejor precio</p>
                </div>

                <div className='d-grid-2-1fr gap-10'>
                    <div className='d-flex w-100 border-r-6 overflow-hidden'>
                        <img src="/assets/imagenes/paginas/nosotros/banner-principal.jpg" className='w-100 h-100 object-fit-cover' alt="Sobre nosotros | Dormihogar"/>
                    </div>

                    <div className='d-flex-column gap-20'>
                        <div className='d-flex-column gap-10'>
                            <p className='block-title text-left'>Más de 15 años creando mejores noches de descanso</p>

                            <p className='text'>En Dormihogar ofrecemos las mejores marcas de descanso, como Paraíso, El Cisne y Kamas, brindando productos de alta calidad para el hogar: colchones, camas, box tarimas, sofás, cabeceras y muebles de dormitorio.</p>
                            <p className='text'>Nos enfocamos en ofrecer una atención personalizada, asesoría experta y envíos a nivel nacional, garantizando una experiencia de compra segura, rápida y confiable.</p>
                            <p className='text'>Miles de familias peruanas confían en Dormihogar por nuestra calidad, respaldo y precios competitivos.</p>
                        </div>

                        <ul className='homepage-about-us-list'>
                            <li>
                                <span class="material-symbols-outlined">social_leaderboard</span>
                                <p className='text'>Marcas líderes: Paraíso, El Cisne y Kamas</p>
                            </li>
                            <li>
                                <span class="material-symbols-outlined">draw_abstract</span>
                                <p className='text'>Más de 80 modelos disponibles</p>
                            </li>
                            <li>
                                <span class="material-symbols-outlined">palette</span>
                                <p className='text'>Más de 100 colores para personalizar tu dormitorio</p>
                            </li>
                            <li>
                                <span class="material-symbols-outlined">local_shipping</span>
                                <p className='text'>Envíos a todo el Perú</p>
                            </li>
                            <li>
                                <span class="material-symbols-outlined">support_agent</span>
                                <p className='text'>Atención personalizada</p>
                            </li>
                            <li>
                                <span class="material-symbols-outlined">favorite</span>
                                <p className='text'>Miles de familias felices</p>
                            </li>
                        </ul>

                        <p className='text'>✨ Dormihogar, el descanso que tu hogar merece.</p>

                        <a href='/nosotros/' className='button-link button-link-2 margin-right'>
                            <p className='button-link-text'>Conoce más sobre nosotros</p>
                            <span className="material-icons">arrow_forward</span>
                        </a>
                    </div>
                </div>

                <div className='homepage-about-us-images-container w-100'>
                    <ul className='homepage-about-us-images'>
                        <li>
                            <img loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}1.webp`} alt=''/>
                        </li>
                        <li>
                            <img loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}2.webp`} alt=''/>
                        </li>
                        <li>
                            <img loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}3.webp`} alt=''/>
                        </li>
                        <li>
                            <img loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}4.webp`} alt=''/>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default SobreNosotros;
