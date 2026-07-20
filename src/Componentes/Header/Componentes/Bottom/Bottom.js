// // import { useState, useEffect } from 'react';

// // import './Bottom.css';
// // import '../Center/Center.css';

// // function Bottom({ isMenuOpen }) {
// //     const [categories, setCategories] = useState(null);
// //     const [networks, setNetworks] = useState(null);
// //     const [error, setError] = useState(null);

// //     useEffect(() => {
// //         const fetchData = async () => {
// //             try {
// //                 const categoriesResponse = await fetch('/assets/json/categorias/categorias.json');
// //                 if (!categoriesResponse.ok) {
// //                     throw new Error('Error al cargar las categorías');
// //                 }
// //                 const categoriesData = await categoriesResponse.json();
// //                 setCategories(categoriesData);
// //                 const networksResponse = await fetch('/assets/json/networks.json');
// //                 if (!networksResponse.ok) {
// //                     throw new Error('Error al cargar las redes sociales');
// //                 }
// //                 const networksData = await networksResponse.json();
// //                 setNetworks(networksData);
// //             } catch (err) {
// //                 setError(err.message);
// //                 console.error('Error fetching data:', err);
// //             }
// //         };

// //         fetchData();
// //     }, []);

// //     if (error) {
// //         return <div className="error-message">Error al cargar el menú: {error}</div>;
// //     }

// //     if (!categories || !networks) {
// //         return <div className="loading">Cargando...</div>;
// //     }

// //     const socialIcons = {
// //         'Facebook': 'fa-brands fa-facebook',
// //         'Instagram': 'fa-brands fa-instagram',
// //         'Tik Tok': 'fa-brands fa-tiktok'
// //     };

// //     return (
// //         <div className={`header-bottom-container ${isMenuOpen ? 'active' : ''}`}>
// //             <section className='header-bottom'>
// //                 <nav className='header-bottom-categories'>
// //                     <ul className='header-bottom-categories-list'>
// //                         {categories.categorias.map((categoria) => (
// //                             <li>
// //                                 <a href={categoria.ruta || '/'} title={categoria.categoria}>
// //                                     <p className='text'>{categoria.categoria}</p>
// //                                 </a>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>

// //                 <ul className='header-social-networks'>
// //                     {networks.networks.map((network) => (
// //                         <li key={network.id}>
// //                             <a href={network.link || '/'} title={`${network.name} | Dormihogar`}>
// //                                 <i className={socialIcons[network.name] || 'fa-brands fa-link'}></i>
// //                                 <p>{network.name}</p>
// //                             </a>
// //                         </li>
// //                     ))}
// //                 </ul>

// //                 <div className='header-bottom-tags'>
// //                     <button type='button' className='location-button'>
// //                         <span className="material-symbols-outlined">location_on</span>
// //                         <p className='text'>Ingresa tu ubicación</p>
// //                     </button>

// //                     <a href='/mis-favoritos/' className='header-fav-button'>
// //                         <b className='color-white'>10</b>
// //                         <span className="material-symbols-outlined">favorite</span>
// //                         <p className='text'>Mis favoritos</p>
// //                     </a>
// //                 </div>
// //             </section>
// //         </div>
// //     );
// // }

// // export default Bottom;

// import { useState, useEffect } from 'react';

// import './Bottom.css';
// import '../Center/Center.css';

// function Bottom({ isMenuOpen, favoritesCount }) { // Añadir favoritesCount como prop
//     const [categories, setCategories] = useState(null);
//     const [networks, setNetworks] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const categoriesResponse = await fetch('/assets/json/categorias/categorias.json');
//                 if (!categoriesResponse.ok) {
//                     throw new Error('Error al cargar las categorías');
//                 }
//                 const categoriesData = await categoriesResponse.json();
//                 setCategories(categoriesData);
//                 const networksResponse = await fetch('/assets/json/networks.json');
//                 if (!networksResponse.ok) {
//                     throw new Error('Error al cargar las redes sociales');
//                 }
//                 const networksData = await networksResponse.json();
//                 setNetworks(networksData);
//             } catch (err) {
//                 setError(err.message);
//                 console.error('Error fetching data:', err);
//             }
//         };

//         fetchData();
//     }, []);

//     if (error) {
//         return <div className="error-message">Error al cargar el menú: {error}</div>;
//     }

//     if (!categories || !networks) {
//         return <div className="loading">Cargando...</div>;
//     }

//     const socialIcons = {
//         'Facebook': 'fa-brands fa-facebook',
//         'Instagram': 'fa-brands fa-instagram',
//         'Tik Tok': 'fa-brands fa-tiktok'
//     };

//     return (
//         <div className={`header-bottom-container ${isMenuOpen ? 'active' : ''}`}>
//             <section className='header-bottom'>
//                 <nav className='header-bottom-categories'>
//                     <ul className='header-bottom-categories-list'>
//                         {categories.categorias.map((categoria, index) => (
//                             <li key={index}>
//                                 <a href={categoria.ruta || '/'} title={categoria.categoria}>
//                                     <p className='text'>{categoria.categoria}</p>
//                                 </a>
//                             </li>
//                         ))}
//                     </ul>
//                 </nav>

//                 <ul className='header-social-networks'>
//                     {networks.networks.map((network) => (
//                         <li key={network.id}>
//                             <a href={network.link || '/'} title={`${network.name} | Dormihogar`}>
//                                 <i className={socialIcons[network.name] || 'fa-brands fa-link'}></i>
//                                 <p>{network.name}</p>
//                             </a>
//                         </li>
//                     ))}
//                 </ul>

//                 <div className='header-bottom-tags'>
//                     <button type='button' className='location-button'>
//                         <span className="material-symbols-outlined">location_on</span>
//                         <p className='text'>Ingresa tu ubicación</p>
//                     </button>

//                     <a href='/mis-favoritos/' className='header-fav-button'>
//                         <b className='color-white'>{favoritesCount}</b> {/* Usar el prop en lugar del número fijo 10 */}
//                         <span className="material-symbols-outlined">favorite</span>
//                         <p className='text'>Mis favoritos</p>
//                     </a>
//                 </div>
//             </section>
//         </div>
//     );
// }

// export default Bottom;

import { useState, useEffect } from 'react';

import './Bottom.css';
import '../Center/Center.css';

function Bottom({ isMenuOpen, favoritesCount, onOpenLocationModal }) { // Añadir onOpenLocationModal
    const [categories, setCategories] = useState(null);
    const [networks, setNetworks] = useState(null);
    const [error, setError] = useState(null);

    // Obtener la ubicación guardada para mostrar en el botón
    const [selectedLocation, setSelectedLocation] = useState(() => {
        const departamento = localStorage.getItem('departamento') || '';
        const provincia = localStorage.getItem('provincia') || '';
        const distrito = localStorage.getItem('distrito') || '';
        return { departamento, provincia, distrito };
    });

    // Escuchar cambios en localStorage para actualizar la ubicación
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
                const categoriesResponse = await fetch('/assets/json/categorias/categorias.json');
                if (!categoriesResponse.ok) {
                    throw new Error('Error al cargar las categorías');
                }
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);
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

    if (!categories || !networks) {
        return <div className="loading">Cargando...</div>;
    }

    const socialIcons = {
        'Facebook': 'fa-brands fa-facebook',
        'Instagram': 'fa-brands fa-instagram',
        'Tik Tok': 'fa-brands fa-tiktok'
    };

    // Función para obtener el texto del botón de ubicación
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

    return (
        <div className={`header-bottom-container ${isMenuOpen ? 'active' : ''}`}>
            <section className='header-bottom'>
                <nav className='header-bottom-categories'>
                    <ul className='header-bottom-categories-list'>
                        {categories.categorias.map((categoria, index) => (
                            <li key={index}>
                                <a href={categoria.ruta || '/'} title={categoria.categoria}>
                                    <p className='text'>{categoria.categoria}</p>
                                </a>
                            </li>
                        ))}
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
                    <button 
                        type='button' 
                        className='location-button'
                        onClick={onOpenLocationModal} // Usar la función del prop
                    >
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
