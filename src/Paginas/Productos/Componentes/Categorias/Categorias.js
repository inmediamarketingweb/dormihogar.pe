import { Link } from 'react-router-dom';

import './Categorias.css';

function Categorias(){
    return(
        <section className='product-page-categories-container'>
            <nav className='product-page-categories'>
                <ul>
                    <li>
                        <Link className="product-page-categories-link" to='/productos/colchones/' title='Colchones | Homesleep'>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/colchones.webp' alt='Colchones | Homesleep'/>
                            <p>Colchones</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="product-page-categories-link" to='/productos/camas-box-tarimas/' title='Camas box tarimas | Homesleep'>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-box-tarimas.webp' alt='Camas box tarimas | Homesleep'/>
                            <p>Camas box tarimas</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="product-page-categories-link" to='/productos/dormitorios/' title='Dormitorios | Homesleep'>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/dormitorios.webp' alt='Dormitorios | Homesleep'/>
                            <p>Dormitorios</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="product-page-categories-link" to='/productos/camas-funcionales/' title='Camas funcionales | Homesleep'>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-funcionales.webp' alt='Camas funcionales | Homesleep'/>
                            <p>Camas funcionales</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="product-page-categories-link" to='/productos/cabeceras/' title='Cabeceras | Homesleep'>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/cabeceras.webp' alt='Cabeceras | Homesleep'/>
                            <p>Cabeceras</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="product-page-categories-link" to='/productos/sofas/' title='Sofas | Homesleep'>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/sofas.webp' alt='Sofas | Homesleep'/>
                            <p>Sofas</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="product-page-categories-link" to='/productos/complementos/' title='Complementos | Homesleep'>
                            <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/complementos.webp' alt='Complementos | Homesleep'/>
                            <p>Complementos</p>
                        </Link>
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export default Categorias;
