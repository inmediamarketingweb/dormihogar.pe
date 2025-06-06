import './Distribuidores.css';

function Distribuidores(){
    return(
        <div className='block-container'>
            <div className='block-content'>
                <div className='block-title-container'>
                    <h2 className='block-title'>Las mejores marcas</h2>
                </div>

                <div className='distribuidores-container'>
                    <div className='distribuidores-content'>
                        <ul className='distribuidores'>
                            <li>
                                <a href='https://kamas.pe' title="Kamas | Dormihogar">
                                    <img width={150} height={150} src="/assets/imagenes/componentes/distribuidores/kamas.png" alt="Kamas"/>
                                </a>
                            </li>
                            <li>
                                <a href='https://www.paraiso-peru.com/' title="Paraiso | Dormihogar">
                                    <img width={150} height={150} src="/assets/imagenes/componentes/distribuidores/paraiso.png" alt="Paraiso"/>
                                </a>
                            </li>
                            <li>
                                <a href='/' title="Bett | Dormihogar">
                                    <img width={150} height={150} src="/assets/imagenes/componentes/distribuidores/bett.png" alt="Bett"/>
                                </a>
                            </li>
                            <li>
                                <a href='https://cisne.pe/' title="El Cisne | Dormihogar">
                                    <img width={150} height={150} src="/assets/imagenes/componentes/distribuidores/el-cisne.png" alt="El Cisne"/>
                                </a>
                            </li>
                            <li>
                                <a href='/' title="Zebra | Dormihogar">
                                    <img width={150} height={150} src="/assets/imagenes/componentes/distribuidores/zebra.png" alt="Zebra"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Distribuidores;
