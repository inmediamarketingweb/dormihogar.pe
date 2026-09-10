import Helmet from 'react-helmet';

import './Manual.css';

function Manual(){
    return(
        <>
            <Helmet>
                <title>Manual de instalación | Dormihogar</title>
            </Helmet>

            <main>
                <div className='block-container'>
                    <section className='block-content'>
                        <iframe src="https://kamas.pe/assets/manual-de-instalacion.pdf"
                        width="100%" height="1000px" title="Manual de instalación"/>
                    </section>
                </div>
            </main>
        </>
    )
}

export default Manual;
