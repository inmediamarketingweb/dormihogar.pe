// // import { useState, useEffect } from 'react';
// // import { v4 as uuidv4 } from "uuid";

// // import './Bottom.css';

// // function Bottom({ isMenuOpen }){
// //     const [activeCategory, setActiveCategory] = useState(null);
// //     const [categories, setCategories] = useState(null);
// //     const [error, setError] = useState(null);

// //     useEffect(() => {
// //         const fetchCategories = async () => {
// //             try {
// //                 const response = await fetch('/assets/json/categorias/categorias.json');
// //                 if (!response.ok) {
// //                     throw new Error('Error al cargar los archivos');
// //                 }
// //                 const data = await response.json();
// //                 setCategories(data);
// //             } catch (err) {
// //                 setError(err.message);
// //                 console.error('Error fetching categories:', err);
// //             }
// //         };

// //         fetchCategories();
// //     }, []);

// //     if (error) {
// //         return <div className="error-message">Error al cargar el menú: {error}</div>;
// //     }

// //     if (!categories) {
// //         return <div className="loading">Cargando...</div>;
// //     }

// //     const handleCategoryClick = (categoryId) => {
// //         setActiveCategory(prev => prev === categoryId ? null : categoryId);
// //     };

// //     return(
// //         <div className={`header-bottom-container ${isMenuOpen ? 'active' : ''}`}>
// //             <section className='header-bottom'>
// //                 <nav className='menu-container'>
// //                     <ul className='menu'>
// //                         {categories.categorias.map((categoria) => (
// //                             <li key={uuidv4()} className={`menu-li ${activeCategory === categoria.id ? 'active' : ''}`} onClick={() => categoria.subCategorias && handleCategoryClick(categoria.id)}>
// //                                 <div className='menu-li-div'>
// //                                     <a href={categoria.ruta} title={categoria.categoria} className='menu-link'>
// //                                         <h2>{categoria.categoria}</h2>
// //                                     </a>

// //                                     {categoria.subCategorias && (
// //                                         <button type='button' className='menu-link-button'>
// //                                             <span className="material-icons">keyboard_arrow_down</span>
// //                                         </button>
// //                                     )}
// //                                 </div>

// //                                 {categoria.subCategorias && (
// //                                     <div className={`submenu-container ${activeCategory === categoria.id ? 'active' : ''}`}>
// //                                         <nav className='submenu'>
// //                                             {categoria.menuMensaje && (
// //                                                 <div className='submenu-target submenu-target-1'>
// //                                                     <h3 className='submenu-target-title'>{categoria.categoria}</h3>
// //                                                     <p className='text'>{categoria.menuMensaje[0]?.text}</p>
// //                                                 </div>
// //                                             )}

// //                                         {categoria.subCategorias && (
// //                                             <div className='submenu-target submenu-target-2'>
// //                                                 <h3 className='submenu-target-title'>{categoria.subCategoriasTitulo?.[0]?.text || 'Subcategorías'}:</h3>
// //                                                 <ul>
// //                                                     {categoria.subCategorias.map((sub) => (
// //                                                         <li key={uuidv4()}>
// //                                                             <a href={sub.ruta} title={sub.subcategoria}>
// //                                                                 <h4>{sub.subcategoria}</h4>
// //                                                             </a>
// //                                                         </li>
// //                                                     ))}
// //                                                 </ul>
// //                                             </div>
// //                                         )}

// //                                         {categoria.medidas && (
// //                                             <div className='submenu-target submenu-target-3'>
// //                                                 <h3 className='submenu-target-title'>Medidas:</h3>
// //                                                 <ul>
// //                                                     {categoria.medidas.map((medida) => (
// //                                                         <li key={uuidv4()}>
// //                                                             <a href={medida.ruta} title={medida.medida}>
// //                                                                 <h4>{medida.medida}</h4>
// //                                                             </a>
// //                                                         </li>
// //                                                     ))}
// //                                                 </ul>
// //                                             </div>
// //                                         )}

// //                                         {categoria.modelos && (
// //                                             <div className='submenu-target submenu-target-3'>
// //                                                 <h3 className='submenu-target-title'>Modelos:</h3>
// //                                                 <ul>
// //                                                     {categoria.modelos.map((modelo) => (
// //                                                         <li key={uuidv4()}>
// //                                                             <a href={modelo.ruta} title={modelo.modelo}>
// //                                                                 <h4>{modelo.modelo}</h4>
// //                                                             </a>
// //                                                         </li>
// //                                                     ))}
// //                                                 </ul>
// //                                             </div>
// //                                         )}

// //                                         {categoria.menuImg && (
// //                                             <div className='submenu-target submenu-target-4'>
// //                                                 <img width={280} height={280} loading='lazy' src={categoria.menuImg[0]?.imgSrc} alt={categoria.menuImg[0]?.imgAlt || categoria.categoria}/>
// //                                             </div>
// //                                         )}
// //                                         </nav>
// //                                     </div>
// //                                 )}
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </section>
// //         </div>
// //     );
// // }

// // export default Bottom;

// import './Bottom.css';
// import '../Center/Center.css';

// function Bottom(){
//     return(
//         <div className='header-bottom-container'>
//             <section className='header-bottom'>
//                 <nav className='header-bottom-categories'>
//                     <ul className='header-bottom-categories-list'>
//                         <li>
//                             <a href='/' title=''>
//                                 <p className='text'>Colchones</p>
//                             </a>
//                         </li>
//                         <li>
//                             <a href='/' title=''>
//                                 <p className='text'>Camas box tarimas</p>
//                             </a>
//                         </li>
//                         <li>
//                             <a href='/' title=''>
//                                 <p className='text'>Dormitorios</p>
//                             </a>
//                         </li>
//                         <li>
//                             <a href='/' title=''>
//                                 <p className='text'>Camas funcionales</p>
//                             </a>
//                         </li>
//                         <li>
//                             <a href='/' title=''>
//                                 <p className='text'>Cabeceras</p>
//                             </a>
//                         </li>
//                         <li>
//                             <a href='/' title=''>
//                                 <p className='text'>Sofás</p>
//                             </a>
//                         </li>
//                         <li>
//                             <a href='/' title=''>
//                                 <p className='text'>Complementos</p>
//                             </a>
//                         </li>
//                     </ul>
//                 </nav>

//                 <ul className='header-social-networks'>
//                     <li>
//                         <a href='/' title=''>
//                         <i class="fa-brands fa-facebook"></i>
//                             <p>Facebook</p>
//                         </a>
//                     </li>
//                     <li>
//                         <a href='/' title=''>
//                         <i class="fa-brands fa-instagram"></i>
//                             <p>Instagram</p>
//                         </a>
//                     </li>
//                     <li>
//                         <a href='/' title=''>
//                             <i class="fa-brands fa-tiktok"></i>
//                             <p>Tik Tok</p>
//                         </a>
//                     </li>
//                 </ul>

//                 <div className='header-bottom-tags'>
//                     <button type='button' className='location-button'>
//                         <span class="material-symbols-outlined">location_on</span>
//                         <p className='text'>Ingresa tu ubicación</p>
//                     </button>

//                     <a href='/mis-favoritos/' className='header-fav-button'>
//                         <b className='color-white'>10</b>
//                         <span class="material-symbols-outlined">favorite</span>
//                         <p className='text'>Mis favoritos</p>
//                     </a>

//                     {/* <a href='/' title='' className='button-link button-link-2 header-call-link'>
//                         <span class="material-symbols-outlined">phone_in_talk</span>
//                         <p className='button-link-text'>933 197 648</p>
//                     </a> */}
//                 </div>
//             </section>
//         </div>
//     )
// }

// export default Bottom;

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";

import './Bottom.css';
import '../Center/Center.css';

function Bottom({ isMenuOpen }) {
    const [categories, setCategories] = useState(null);
    const [networks, setNetworks] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categorías
                const categoriesResponse = await fetch('/assets/json/categorias/categorias.json');
                if (!categoriesResponse.ok) {
                    throw new Error('Error al cargar las categorías');
                }
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

                // Fetch redes sociales
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

    // Mapeo de nombres de redes sociales a clases de iconos
    const socialIcons = {
        'Facebook': 'fa-brands fa-facebook',
        'Instagram': 'fa-brands fa-instagram',
        'Tik Tok': 'fa-brands fa-tiktok'
    };

    return (
        <div className={`header-bottom-container ${isMenuOpen ? 'active' : ''}`}>
            <section className='header-bottom'>
                <nav className='header-bottom-categories'>
                    <ul className='header-bottom-categories-list'>
                        {categories.categorias.map((categoria) => (
                            <li key={uuidv4()}>
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
                            <a href={network.link || '/'} title={network.name}>
                                <i className={socialIcons[network.name] || 'fa-brands fa-link'}></i>
                                <p>{network.name}</p>
                            </a>
                        </li>
                    ))}
                </ul>

                <div className='header-bottom-tags'>
                    <button type='button' className='location-button'>
                        <span className="material-symbols-outlined">location_on</span>
                        <p className='text'>Ingresa tu ubicación</p>
                    </button>

                    <a href='/mis-favoritos/' className='header-fav-button'>
                        <b className='color-white'>10</b>
                        <span className="material-symbols-outlined">favorite</span>
                        <p className='text'>Mis favoritos</p>
                    </a>
                </div>
            </section>
        </div>
    );
}

export default Bottom;
