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
            <section className='block-content'>
                <div className='block-title-container'>
                    <h2 className='block-title'>Dormihogar</h2>
                </div>

                <div className='d-grid-2-1fr gap-10'>
                    <img src="/assets/imagenes/paginas/nosotros/banner-principal.jpg" className='page-banner-img' alt="Sobre nosotros | Dormihogar"/>

                    <div className='d-flex-column gap-20'>
                        <div className='d-flex-column gap-5'>
                            <p className='title'>Somos Dormihogar</p>
                            <p className='title'>¡ Cuidamos tu descanso desde hace 14 años !</p>
                            <p className='text'>En Dormihogar, llevamos más de 14 años siendo parte de los hogares peruanos, ofreciendo las mejores marcas de descanso del país, como Paraíso, Cinse, Kamas, entre otras reconocidas por su calidad y confort.</p>
                            <p className='text'>Nos apasiona brindarte no solo productos, sino también una experiencia de compra única y confiable.</p>
                            <p className='text'>Ofrecemos una amplia variedad de colchones, camas, box tarimas, sofás, cabeceras y muebles de dormitorio, con opciones para todos los estilos y necesidades.</p>
                            <p className='text'>Desde el primer contacto, te acompañamos con el mejor servicio de atención personalizada y asesoría experta, para que elijas lo ideal para tu hogar.</p>
                            <p className='text'>Gracias a nuestra logística eficiente, realizamos envíos a nivel nacional, asegurando que tu producto llegue en perfectas condiciones y en el menor tiempo posible.</p>
                            <p className='text'>Miles de familias ya confían en Dormihogar para renovar sus espacios con productos de primera calidad, respaldo garantizado y precios competitivos.</p>
                            <p className='text'>✨ Con Dormihogar, descansar bien es fácil, rápido y seguro.</p>
                        </div>

                        <a href='/nosotros/' className='button-link button-link-1 margin-left'>
                            <p className='button-link-text'>Más sobre nosotros</p>
                            <span className="material-icons">arrow_forward</span>
                        </a>
                    </div>
                </div>

                <div className='homepage-about-us-images-container w-100'>
                    <ul className='homepage-about-us-images'>
                        <li>
                            <img width={isSmallScreen ? 219 : 392} height={isSmallScreen ? 100 : 200} loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}1.webp`} alt=''/>
                        </li>
                        <li>
                            <img width={isSmallScreen ? 219 : 392} height={isSmallScreen ? 100 : 200} loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}2.webp`} alt=''/>
                        </li>
                        <li>
                            <img width={isSmallScreen ? 219 : 392} height={isSmallScreen ? 100 : 200} loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}3.webp`} alt=''/>
                        </li>
                        <li>
                            <img width={isSmallScreen ? 219 : 392} height={isSmallScreen ? 100 : 200} loading="lazy" src={`/assets/imagenes/paginas/nosotros/${isSmallScreen ? 'thumb/' : ''}4.webp`} alt=''/>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default SobreNosotros;
