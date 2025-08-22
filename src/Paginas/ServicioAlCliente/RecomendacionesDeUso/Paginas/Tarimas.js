import { Helmet } from "react-helmet";

function RecomendacionesTarimas(){
    return(
        <>
            <Helmet>
                <title>Recomendaciones de uso - Box tarimas | Dormihogar</title>
            </Helmet>

            <main>
                <div className='block-container'>
                    <section className='block-content d-flex-center-center'>
                        <img src="/assets/imagenes/paginas/servicio-al-cliente/recomendaciones-de-uso/box-tarimas.png" alt=""/>
                    </section>
                </div>
            </main>
        </>
    )
}

export default RecomendacionesTarimas;
