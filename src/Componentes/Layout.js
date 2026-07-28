import { Outlet } from 'react-router-dom';

import Layer from './Layer/Layer';
import Header from './Header/Header';
import WspBtn from './WspBtn/WspBtn';
import Footer from './Footer/Footer';

function Layout(){
    return(
        <>
            <Layer/>

            <Header/>

            <Outlet/>

            <WspBtn/>

            <Footer/>
        </>
    )
}

export default Layout;

// Esta es la plantilla general del proyecto, cada una de las páginas del proyecto consume esta plantilla
