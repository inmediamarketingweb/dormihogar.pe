import { useState, useEffect } from 'react';

import './Bottom.css';
import '../Center/Center.css';

function Bottom({ isMenuOpen, favoritesCount, onOpenLocationModal }) {
    const [menuData, setMenuData] = useState(null);
    const [networks, setNetworks] = useState(null);
    const [error, setError] = useState(null);

    const [selectedLocation, setSelectedLocation] = useState(() => {
        const departamento = localStorage.getItem('departamento') || '';
        const provincia = localStorage.getItem('provincia') || '';
        const distrito = localStorage.getItem('distrito') || '';
        return { departamento, provincia, distrito };
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setSelectedLocation({
                departamento: localStorage.getItem('departamento') || '',
                provincia: localStorage.getItem('provincia') || '',
                distrito: localStorage.getItem('distrito') || ''
            });
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const menuResponse = await fetch('/assets/json/componentes/header.json');
                if (!menuResponse.ok) {
                    throw new Error('Error al cargar los datos del menú');
                }
                const menuData = await menuResponse.json();
                setMenuData(menuData);

                const networksResponse = await fetch('/assets/json/networks.json');
                if (!networksResponse.ok) {
                    throw new Error('Error al cargar las redes sociales');
                }
                const networksData = await networksResponse.json();
                setNetworks(networksData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="error-message">Error al cargar el menú: {error}</div>;
    }

    if (!menuData || !networks) {
        return <div className="loading">Cargando...</div>;
    }

    const socialIcons = {
        'Facebook': 'fa-brands fa-facebook',
        'Instagram': 'fa-brands fa-instagram',
        'Tik Tok': 'fa-brands fa-tiktok'
    };

    const getLocationButtonText = () => {
        if (selectedLocation.distrito) {
            const isLimaOrCallao = selectedLocation.provincia === 'Lima metropolitana' || 
                selectedLocation.provincia === 'Provincia constitucional del Callao';

            if (isLimaOrCallao) {
                return `Entrega en ${selectedLocation.distrito}`;
            } else {
                return `Envío a ${selectedLocation.distrito}`;
            }
        }
        return 'Ingresa tu ubicación';
    };

    const getSubcategoryTitle = (key) => {
        return key
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className={`header-bottom-container ${isMenuOpen ? 'active' : ''}`}>
            <section className='header-bottom'>
                <nav className='header-bottom-categories'>
                    <ul className='header-bottom-categories-list'>
                        {menuData.productos.map((producto, index) => {
                            return (
                                <li key={producto.id || index}>
                                    <a href={producto.link || '/'} title={`${producto['categoría']} | Dormihogar`}>
                                        <p className='text'>{producto['categoría']}</p>
                                    </a>

                                    <div className='submenu-container'>
                                        <div className='submenu'>
                                            <div className='submenu-tag submenu-tag-1'>
                                                <img src={producto.img || '/assets/imagenes/productos/colchones/cat-banner.png'} alt={producto['img-alt'] || ''}/>
                                            </div>

                                            <div className='submenu-tag submenu-tag-2'>
                                                <p className='title text uppercase'>{producto['categoría']}</p>

                                                <div className='submenu-targets'>
                                                    {producto['sub-categorías'] && producto['sub-categorías'].map((subcategoria, subIndex) => {
                                                        const keys = Object.keys(subcategoria);
                                                        const key = keys[0];
                                                        const items = subcategoria[key];

                                                        return (
                                                            <div key={subIndex} className='submenu-list-container'>
                                                                <p className='text uppercase'>{getSubcategoryTitle(key)}</p>
                                                                <ul>
                                                                    {items.map((item, idx) => (
                                                                        <li key={idx}>
                                                                            <a href={item.link || '/'} title={item['link-title'] || ''}>
                                                                                <p>{item.marca || item.medida || 'Item'}</p>
                                                                            </a>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <ul className='header-social-networks'>
                    {networks.networks.map((network) => (
                        <li key={network.id}>
                            <a href={network.link || '/'} title={`${network.name} | Dormihogar`}>
                                <i className={socialIcons[network.name] || 'fa-brands fa-link'}></i>
                                <p>{network.name}</p>
                            </a>
                        </li>
                    ))}
                </ul>

                <div className='header-bottom-tags'>
                    <button type='button' className='location-button' onClick={onOpenLocationModal}>
                        <span className="material-symbols-outlined">location_on</span>
                        <p className='text'>{getLocationButtonText()}</p>
                    </button>

                    <a href='/mis-favoritos/' className='header-fav-button'>
                        <b className='color-white'>{favoritesCount}</b>
                        <span className="material-symbols-outlined">favorite</span>
                        <p className='text'>Mis favoritos</p>
                    </a>
                </div>
            </section>
        </div>
    );
}

export default Bottom;
