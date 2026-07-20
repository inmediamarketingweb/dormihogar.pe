import './Center.css';

import SearchBar from '../SearchBar/SearchBar';
import Location from '../Location/Location';

import { useState, useEffect } from 'react';

function Center({ 
    onMenuClick, 
    isMenuOpen, 
    favoritesCount, 
    updateFavoritesCount,
    onOpenLocationModal,
    isLocationModalOpen,
    onCloseLocationModal
}) {
    const [isMenuOpenLocal, setIsMenuOpenLocal] = useState(false);

    const openMenu = () => {
        setIsMenuOpenLocal(true);
    };

    const closeMenu = () => {
        setIsMenuOpenLocal(false);
    };

    useEffect(() => {
        const menuLayer = document.querySelector('.menu-layer');
        const menuContainer = document.querySelector('.menu-container');
        const menuButton = document.querySelector('.menu-button');
        const menuButtonClose = document.querySelector('.menu-close-button');

        if (isMenuOpenLocal) {
            menuLayer?.classList.add('active');
            menuContainer?.classList.add('active');
            menuButton?.classList.add('active');
            menuButtonClose?.classList.add('active');
        } else {
            menuLayer?.classList.remove('active');
            menuContainer?.classList.remove('active');
            menuButton?.classList.remove('active');
            menuButtonClose?.classList.remove('active');
        }
    }, [isMenuOpenLocal]);

    return(
        <>
            <div className='menu-layer' onClick={closeMenu}></div>

            <div className='header-center-container'>
                <div className='header-center'>
                    <a href="/" className='header-logo' title=''>
                        <img src='https://www.dormihogar.pe/assets/imagenes/SEO/logo-principal.jpg' alt='' />
                    </a>

                    <button type='button' className='menu-button' onClick={openMenu}>
                        <span className="material-symbols-outlined">menu</span>
                        <p>Menú</p>
                    </button>

                    <SearchBar/>

                    <Location onOpenModal={onOpenLocationModal} isModalOpen={isLocationModalOpen} onCloseModal={onCloseLocationModal}/>

                    <a href='/mis-favoritos/' className='header-fav-button'>
                        <b className='color-white'>{favoritesCount}</b>
                        <span className="material-symbols-outlined">favorite</span>
                        <p className='text'>Mis favoritos</p>
                    </a>

                    <a href='tel:+51933197648' title='' className='button-link button-link-2 header-call-link'>
                        <span className="material-symbols-outlined">phone_in_talk</span>
                        <p className='button-link-text'>933 197 648</p>
                    </a>
                </div>
            </div>

            <div className='menu-container'>
                <section className='menu'>
                    <a href='/' className='d-flex'>
                        <img src="https://www.dormihogar.pe/assets/imagenes/SEO/logo-principal.jpg" alt=""/>
                    </a>

                    <ul className='menu-our-links'>
                        <li>
                            <a href='/nosotros/' title='Nosotros | Dormihogar' className='menu-our-link'>
                                <span className="material-symbols-outlined">person</span>
                                <p className='text'>Nosotros</p>
                            </a>
                        </li>
                        <li>
                            <a href='/productos/' title='Productos | Dormihogar' className='menu-our-link'>
                                <span className="material-symbols-outlined">storefront</span>
                                <p className='text'>Nuestros productos</p>
                            </a>
                        </li>
                        <li>
                            <a href='/nosotros/razones-para-comprar/' title='Razones para comprar | Dormihogar' className='menu-our-link'>
                                <span className="material-symbols-outlined">local_mall</span>
                                <p className='text'>Razones para comprar</p>
                            </a>
                        </li>
                        <li>
                            <a href='/envios/envios-a-provincia/' title='Envíos a provincia | Dormihogar' className='menu-our-link'>
                                <span className="material-symbols-outlined">delivery_truck_speed</span>
                                <p className='text'>Envíos a provincia</p>
                            </a>
                        </li>
                        <li>
                            <a href='/servicio-al-cliente/garantia-de-productos/' title='Garantía de productos | Dormihogar' className='menu-our-link'>
                                <span className="material-symbols-outlined">verified_user</span>
                                <p className='text'>Garantía de productos</p>
                            </a>
                        </li>
                    </ul>

                    <nav className='menu-categories'>
                        <p className='title'>Categorías</p>

                        <ul>
                            <li>
                                <a href='/' title='' className='menu-cat-link'>
                                    <div className='d-flex-center-center gap-5'>
                                        <p className='text'>Colchones</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </a>
                            </li>
                            <li>
                                <a href='/' title='' className='menu-cat-link'>
                                    <div className='d-flex-center-center gap-5'>
                                        <p className='text'>Camas box tarimas</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </a>
                            </li>
                            <li>
                                <a href='/' title='' className='menu-cat-link'>
                                    <div className='d-flex-center-center gap-5'>
                                        <p className='text'>Dormitorios</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </a>
                            </li>
                            <li>
                                <a href='/' title='' className='menu-cat-link'>
                                    <div className='d-flex-center-center gap-5'>
                                        <p className='text'>Camas funcionales</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </a>
                            </li>
                            <li>
                                <a href='/' title='' className='menu-cat-link'>
                                    <div className='d-flex-center-center gap-5'>
                                        <p className='text'>Cabeceras</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </a>
                            </li>
                            <li>
                                <a href='/' title='' className='menu-cat-link'>
                                    <div className='d-flex-center-center gap-5'>
                                        <p className='text'>Sofás</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </a>
                            </li>
                            <li>
                                <a href='/' title='' className='menu-cat-link'>
                                    <div className='d-flex-center-center gap-5'>
                                        <p className='text'>Complementos</p>
                                    </div>

                                    <span className="material-symbols-outlined">chevron_right</span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <nav className='menu-networks'>
                        <p className='title'>Nuestras redes</p>

                        <ul>
                            <li>
                                <a href='https://www.facebook.com/Dormihogar.pe/' title='Facebook | Dormihogar' className='menu-network'>
                                    <i className="fa-brands fa-facebook"></i>
                                    <p>Facebook</p>
                                </a>
                            </li>
                            <li>
                                <a href='https://www.instagram.com/dormihogar.pe/' title='Instagram | Dormihogar' className='menu-network'>
                                    <i className="fa-brands fa-instagram"></i>
                                    <p>Instagram</p>
                                </a>
                            </li>
                            <li>
                                <a href='https://www.tiktok.com/@dormihogar.pe' title='TikTok | Dormihogar' className='menu-network'>
                                    <i className="fa-brands fa-tiktok"></i>
                                    <p>TikTok</p>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </section>
            </div>

            <button className='menu-close-button' onClick={closeMenu}>
                <span className="material-symbols-outlined">close</span>
            </button>
        </>
    );
}

export default Center;
