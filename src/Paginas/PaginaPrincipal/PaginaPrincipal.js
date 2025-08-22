import { Helmet } from 'react-helmet';

import Slider from './Componentes/Slider/Slider';
import Categorias from './Componentes/Categorias/Categorias';
import SoloPorHoras from './Componentes/SoloPorHoras/SoloPorHoras';
import UltimasNovedades from './Componentes/UltimasNovedades/UltimasNovedades';
import Ofertas from './Componentes/Ofertas/Ofertas';
import SobreNosotros from './Componentes/SobreNosotros/SobreNosotros';
import Distribuidores from '../../Componentes/Distribuidores/Distribuidores';

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

                <SoloPorHoras/>

                <UltimasNovedades/>
                
                <Ofertas/>

                <SobreNosotros/>

                <Distribuidores/>
            </main>
        </>
    );
}

export default PaginaPrincipal;
