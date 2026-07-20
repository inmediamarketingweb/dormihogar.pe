import { Link } from 'react-router-dom';

import './Categorias.css';

function Categorias(){
    return(
        <div className='d-flex-column gap-10'>
            <div className='block-container'>
                <section className='block-content'>
                    <a className='d-flex w-100 border-r-6 overflow-hidden' href='/' title=''>
                        <img src='https://mercury.vtexassets.com/assets/vtex.file-manager-graphql/images/8aef7f68-a5ed-44c2-b0fd-eeca7fcb2069___6de3ea8c0f67c6224172bd6b32180676.webp' alt='' className='d-flex w-100'/>
                    </a>
                </section>
            </div>

            <section className='product-page-categories-container'>
                <nav className='product-page-categories'>
                    <ul>
                        <li>
                            <Link className="product-page-categories-link" to='/productos/colchones/' title='Colchones | Dormihogar'>
                                <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/colchones.webp' alt='Colchones | Dormihogar'/>
                                <p>Colchones</p>
                            </Link>
                        </li>
                        <li>
                            <Link className="product-page-categories-link" to='/productos/camas-box-tarimas/' title='Camas box tarimas | Dormihogar'>
                                <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-box-tarimas.webp' alt='Camas box tarimas | Dormihogar'/>
                                <p>Camas box tarimas</p>
                            </Link>
                        </li>
                        <li>
                            <Link className="product-page-categories-link" to='/productos/dormitorios/' title='Dormitorios | Dormihogar'>
                                <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT00YYlrsgEqbBHeYYarx9Wkl0qEd0_TDA-EuVsEJRlYA&s' alt='Dormitorios | Dormihogar'/>
                                <p>Dormitorios</p>
                            </Link>
                        </li>
                        <li>
                            <Link className="product-page-categories-link" to='/productos/camas-funcionales/' title='Camas funcionales | Dormihogar'>
                                <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/camas-funcionales.webp' alt='Camas funcionales | Dormihogar'/>
                                <p>Camas funcionales</p>
                            </Link>
                        </li>
                        <li>
                            <Link className="product-page-categories-link" to='/productos/cabeceras/' title='Cabeceras | Dormihogar'>
                                <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/cabeceras.webp' alt='Cabeceras | Dormihogar'/>
                                <p>Cabeceras</p>
                            </Link>
                        </li>
                        <li>
                            <Link className="product-page-categories-link" to='/productos/sofas/' title='Sofas | Dormihogar'>
                                <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/sofas.webp' alt='Sofas | Dormihogar'/>
                                <p>Sofas</p>
                            </Link>
                        </li>
                        <li>
                            <Link className="product-page-categories-link" to='/productos/complementos/' title='Complementos | Dormihogar'>
                                <img src='https://www.kamas.pe/assets/imagenes/paginas/pagina-principal/categorias/complementos.webp' alt='Complementos | Dormihogar'/>
                                <p>Complementos</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </section>
        </div>
    )
}

export default Categorias;
