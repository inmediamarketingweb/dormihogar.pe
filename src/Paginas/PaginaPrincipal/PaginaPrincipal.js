import { Helmet } from 'react-helmet';

import Slider from './Componentes/Slider/Slider';
import DormParaiso from './Componentes/DormParaiso/DormParaiso';
import Categorias from './Componentes/Categorias/Categorias';
// import UltimasNovedades from './Componentes/UltimasNovedades/UltimasNovedades';
// import Ofertas from './Componentes/Ofertas/Ofertas';
import SobreNosotros from './Componentes/SobreNosotros/SobreNosotros';
import Distribuidores from '../../Componentes/Distribuidores/Distribuidores';
import Baules from './Componentes/Baules/Baules';
import Why from './Componentes/Why/Why';

import './PaginaPrincipal.css';

function PaginaPrincipal(){
    return(
        <>
            <Helmet>
                <title>Dormitorios paraiso, kamas y el cisne | Dormihogar</title>
                <meta name="description" content="Fabricantes de colchones, camas, box tarimas y juegos de dormitorios con más de 15 años en el mercado peruano ofreciendo calidad y confort para tu descanso." />

                <meta property="og:title" content="Dormihogar"/>
                <meta property="og:description" content="Meta descripción"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://www.dormihogar.pe/"/>
                <meta property="og:image" content="/assets/imagenes/paginas/pagina-principal/homepage-video.jpg"/>
                <meta property="og:site_name" content="Dormihogar"/>

                <link rel="preload" as="image" href="/assets/imagenes/paginas/pagina-principal/slider/slider-1.webp" />
                <link rel="preload" as="image" href="/assets/imagenes/paginas/pagina-principal/slider/thumb/slider-1.webp" />
            </Helmet>

            <main>
                <Slider/>

                <Categorias/>

                <div className='block-container'>
                    <section className='block-content'>
                        <div className='w-100 d-grid-2-1fr gap-10'>
                            <a className='d-flex w-100 border-r-10 overflow-hidden' href='/' title=''>
                                <img className='w-100 d-flex' src="https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/slider/slider-1.webp" alt=''/>
                            </a>

                            <a className='d-flex w-100 border-r-10 overflow-hidden' href='/' title=''>
                                <img className='w-100 d-flex' src="https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/slider/slider-2.webp" alt=''/>
                            </a>
                        </div>
                    </section>
                </div>

                <DormParaiso/>

                {/* <UltimasNovedades/> */}

                {/* <Ofertas/> */}


                <Distribuidores/>

                <Baules/>

                <SobreNosotros/>

                <Why/>
            </main>
        </>
    );
}

export default PaginaPrincipal;
