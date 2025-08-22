import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import './EnviosALimaYCallao.css'

function EnviosALimaYCallao(){
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
                <title>Envíos para Lima y Callao | Dormihogar</title>
            </Helmet>

            <main>
                <div className="block-container">
                    <section className="block-content d-flex-column gap-20">
                        <img className="page-banner-img" src="/assets/imagenes/paginas/envios/envios-lima-y-callao.jpg" alt="Envíos para Lima y Callao | Kamas"/>

                        <div className="envios-page">
                            <div className="d-flex-column gap-10">
                                <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@dormihogar.pe/video/7323624286416047365" data-video-id="7323624286416047365">
                                    <section>
                                        <a target="_blank" title="@dormihogar.pe" href="https://www.tiktok.com/@dormihogar.pe?refer=embed">@dormihogar.pe</a>
                                        <a title="dormitorio" target="_blank" href="https://www.tiktok.com/tag/dormitorio?refer=embed">#DORMITORIO</a>
                                        KING &#47; 3 PLAZAS <a title="paraiso" target="_blank" href="https://www.tiktok.com/tag/paraiso?refer=embed">#PARAISO</a>
                                        <a title="kamas" target="_blank" href="https://www.tiktok.com/tag/kamas?refer=embed">#KAMAS</a>
                                        CON COLCHON POCKET s&#47; 1699 soles
                                        <a title="dormihogar" target="_blank" href="https://www.tiktok.com/tag/dormihogar?refer=embed">#Dormihogar</a>
                                        <a target="_blank" title="♬ sonido original - Dormihogar" href="https://www.tiktok.com/music/sonido-original-7323624300786158342?refer=embed">♬ sonido original - Dormihogar</a>
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
        </>
    );
}

export default EnviosALimaYCallao;
