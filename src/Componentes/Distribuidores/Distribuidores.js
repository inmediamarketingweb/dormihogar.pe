import './Distribuidores.css';

function Distribuidores(){
    return(
        <div className='block-container'>
            <div className='block-content'>
                <div className='block-title-container'>
                    <h2 className='block-title'>Las <b>mejores</b> marcas</h2>
                    <p className='block-title-span'>Del mercado</p>
                </div>

                <ul className='distribuidores-container'>
                    <li>
                        <a href='/busqueda?query=paraiso' title='Productos Paraiso | Dormihogar'>
                            <img src='/assets/imagenes/paginas/marcas/paraiso.png' alt=''/>
                        </a>
                    </li>
                    <li>
                        <a href='/busqueda?query=kamas' title='Productos Kamas | Dormihogar'>
                            <img src='/assets/imagenes/paginas/marcas/kamas.png' alt=''/>
                        </a>
                    </li>
                    <li>
                        <a href='/busqueda?query=el%20cisne' title='Productos El Cisne | Dormihogar'>
                            <img src='/assets/imagenes/paginas/marcas/el-cisne.png' alt=''/>
                        </a>
                    </li>
                    <li>
                        <a href='/busqueda?query=komfort' title='Productos Komfort | Dormihogar'>
                            <img src='/assets/imagenes/paginas/marcas/komfort.png' alt=''/>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Distribuidores;
