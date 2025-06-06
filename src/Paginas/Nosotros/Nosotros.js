import { Helmet } from "react-helmet-async";

import Header from "../../Componentes/Header/Header";
import Footer from "../../Componentes/Footer/Footer";

function Nosotros(){
    return(
        <>
            <Helmet>
                <title>Nosotros | Kamas</title>
                <meta name="description" content="Sobre nosotros"/>

                <meta property="og:title" content="Nosotros | Kamas"/>
                <meta property="og:site_name" content="Nosotros"/>
                <meta property="og:description" content="Sobre nosotros"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://www.kamas.pe/nosotros/"/>
                <meta property="og:image" content="https://kamas.pe/assets/imagenes/paginas/pagina-principal/homepage-video.jpg"/>
            </Helmet>

            <Header/>

            <main>
                <div className="block-container">
                    <section className="block-content">
                        <div className="d-flex-column gap-20">
                            <img src="/assets/imagenes/paginas/nosotros/banner.jpg" alt="" className="page-banner-img"/>

                            <h1 className="block-title d-flex margin-right">Nosotros</h1>

                            <div className="d-flex-column gap-10">
                                <p className="title">Nuestra empresa</p>
                                <p className="text">Ofrecemos el más amplio catálogo de productos de dormitorio del mercado, nuestras alianzas estratégicas con las mejores marcas nacionales del descanso, nos permite ofrecer los mejores productos al mejor precio, sumados de un excelente servicio de venta y post venta.</p>
                                <p className="text">Con nosotros no debes preocuparte, contamos con asesores del descanso 100% calificados, que te brindaran una atención personalizada, para poder ayudarte con la elección del producto que se acomode mejor a tus necesidades.</p>
                                <p className="text">En Dormihogar tenemos excelentes convenios para ventas al por mayor y menor, asimismo que gozamos de un abastecimiento inmediato en productos y/o colores que no disponemos en stock, pudiendo así ofrecer a nuestros clientes un catálogo 100% surtido y un sistema de venta con entregas realmente inmediatas en menos de 24 horas</p>
                            </div>

                            <div className="d-grid-2-1fr gap-20">
                                <div className="d-flex-column gap-10">
                                    <p className="title">Nuestra visión</p>
                                    <p className="text">Satisfacer y superar las expectativas de nuestros clientes en lo que refiere al mercado del descanso, a través de la mejor experiencia de compra, combinando de manera óptima nuestros productos y servicios.</p>
                                </div>
                                <div className="d-flex-column gap-10">
                                    <p className="title">Nuestra misión</p>
                                    <p className="text">Nuestra visión es ser la empresa líder en Latinoamérica en el comercio de productos de dormitorio, poder consolidarnos y seguir expandiendo nuestra gama de productos con las mejores marcas en cada país.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Nosotros;
