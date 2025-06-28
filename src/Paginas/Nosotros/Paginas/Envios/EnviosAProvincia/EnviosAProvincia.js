import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import Footer from '../../../../../Componentes/Footer/Footer';
import Header from '../../../../../Componentes/Header/Header';

import '../EnviosALimaYCallao/EnviosALimaYCallao.css';

function EnviosAProvincia(){
    const [destinos, setDestinos] = useState([]);

    useEffect(() => {
        fetch('/assets/json/paginas/envios/envios-a-lima-y-callao.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error al obtener la información');
            }
            return response.json();
        })
        .then((data) => setDestinos(data))
        .catch((error) => console.error('Error fetching destinos JSON:', error));
    }, []);

    useEffect(() => {
        let script;
        if (!document.getElementById('tiktok-embed-script')){
            script = document.createElement('script');
            script.id = 'tiktok-embed-script';
            script.src = 'https://www.tiktok.com/embed.js';
            script.async = true;
            document.body.appendChild(script);
        }
        return () => {
            if (script && document.getElementById('tiktok-embed-script')) {
            document.body.removeChild(script);
        }
        };
    }, []);

    return(
        <>
            <Helmet>
                <title>Envíos a provincia | Kamas</title>
            </Helmet>

            <Header/>

            <main>
                <div className="block-container">
                    <section className="block-content d-flex-column gap-20">
                        <img className="page-banner-img" src="/assets/imagenes/paginas/envios/envios-a-provincia.jpg" alt="Envíos para Lima y Callao | Kamas"/>

                        <div className="envios-page">
                            <div className="d-flex-column gap-10">
                                <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@dormihogar.pe/video/7328456127606164741" data-video-id="7328456127606164741">
                                    <section>
                                        <a target="_blank" title="@dormihogar.pe" href="https://www.tiktok.com/@dormihogar.pe?refer=embed">@dormihogar.pe</a>
                                        ¡Sólo en
                                        <a title="dormihogar" target="_blank" href="https://www.tiktok.com/tag/dormihogar?refer=embed">#DORMIHOGAR</a>
                                        !
                                        <a title="dormitorio" target="_blank" href="https://www.tiktok.com/tag/dormitorio?refer=embed">#Dormitorio</a>
                                        <a title="kamas" target="_blank" href="https://www.tiktok.com/tag/kamas?refer=embed">#KAMAS</a>
                                        <a title="king" target="_blank" href="https://www.tiktok.com/tag/king?refer=embed">#king</a>
                                        <a title="3plazas" target="_blank" href="https://www.tiktok.com/tag/3plazas?refer=embed">#3plazas</a>
                                        s&#47;1499 soles
                                        <a title="ofertas" target="_blank" href="https://www.tiktok.com/tag/ofertas?refer=embed">#OFERTAS</a>
                                        <a title="peru" target="_blank" href="https://www.tiktok.com/tag/peru?refer=embed">#peru</a>
                                        <a title="diseñodormitorios" target="_blank" href="https://www.tiktok.com/tag/dise%C3%B1odormitorios?refer=embed">#diseñodormitorios</a>
                                        <a target="_blank" title="♬ sonido original - Dormihogar" href="https://www.tiktok.com/music/sonido-original-7328456142660291333?refer=embed">♬ sonido original - Dormihogar</a>
                                    </section>
                                </blockquote>
                            </div>

                            <div className="envios-page-destinos">
                                {destinos.map((destino, idx) => (
                                    <div key={idx} className="d-flex-column d-flex-center-center gap-10">
                                        <div>
                                            <img src={destino.imgOne} alt={`Imagen de ${destino.provincia} - 1`}/>
                                            <img src={destino.imgTwo} alt={`Imagen de ${destino.provincia} - 2`}/>
                                        </div>
                                        <p className="text">{destino.provincia}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default EnviosAProvincia;
