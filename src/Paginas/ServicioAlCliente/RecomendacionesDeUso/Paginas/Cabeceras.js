import { Helmet } from "react-helmet";

function RecomendacionesCabeceras(){
    return(
        <>
            <Helmet>
                <title>Recomendaciones de uso - Cabeceras | Dormihogar</title>
            </Helmet>

            <main>
                <div className='block-container'>
                    <section className='block-content d-flex-center-center'>
                        <img src="/assets/imagenes/paginas/servicio-al-cliente/recomendaciones-de-uso/cabeceras.png" alt=""/>
                    </section>
                </div>
            </main>
        </>
    )
}

export default RecomendacionesCabeceras;
