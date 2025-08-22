import { Helmet } from "react-helmet";

function RecomendacionesColchones(){
    return(
        <>
            <Helmet>
                <title>Recomendaciones de uso - Colchones | Dormihogar</title>
            </Helmet>

            <main>
                <div className='block-container'>
                    <section className='block-content d-flex-center-center'>
                        <img src="/assets/imagenes/paginas/servicio-al-cliente/recomendaciones-de-uso/colchones.png" alt=""/>
                    </section>
                </div>
            </main>
        </>
    )
}

export default RecomendacionesColchones;
