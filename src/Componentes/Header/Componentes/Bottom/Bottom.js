import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";

import './Bottom.css';

function Bottom({ isMenuOpen }){
    const [activeCategory, setActiveCategory] = useState(null);
    const [categories, setCategories] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/assets/json/categorias/categorias.json');
                if (!response.ok) {
                    throw new Error('Error al cargar los archivos');
                }
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    if (error) {
        return <div className="error-message">Error al cargar el menú: {error}</div>;
    }

    if (!categories) {
        return <div className="loading">Cargando...</div>;
    }

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(prev => prev === categoryId ? null : categoryId);
    };

    return(
        <div className={`header-bottom-container ${isMenuOpen ? 'active' : ''}`}>
            <section className='header-bottom'>
                <nav className='menu-container'>
                    <ul className='menu'>
                        {categories.categorias.map((categoria) => (
                            <li key={uuidv4()} className={`menu-li ${activeCategory === categoria.id ? 'active' : ''}`} onClick={() => categoria.subCategorias && handleCategoryClick(categoria.id)}>
                                <div className='menu-li-div'>
                                    <a href={categoria.ruta} title={categoria.categoria} className='menu-link'>
                                        <h2>{categoria.categoria}</h2>
                                    </a>

                                    {categoria.subCategorias && (
                                        <button type='button' className='menu-link-button'>
                                            <span className="material-icons">keyboard_arrow_down</span>
                                        </button>
                                    )}
                                </div>

                                {categoria.subCategorias && (
                                    <div className={`submenu-container ${activeCategory === categoria.id ? 'active' : ''}`}>
                                        <nav className='submenu'>
                                            {categoria.menuMensaje && (
                                                <div className='submenu-target submenu-target-1'>
                                                    <h3 className='submenu-target-title'>{categoria.categoria}</h3>
                                                    <p className='text'>{categoria.menuMensaje[0]?.text}</p>
                                                </div>
                                            )}

                                        {categoria.subCategorias && (
                                            <div className='submenu-target submenu-target-2'>
                                                <h3 className='submenu-target-title'>{categoria.subCategoriasTitulo?.[0]?.text || 'Subcategorías'}:</h3>
                                                <ul>
                                                    {categoria.subCategorias.map((sub) => (
                                                        <li key={uuidv4()}>
                                                            <a href={sub.ruta} title={sub.subcategoria}>
                                                                <h4>{sub.subcategoria}</h4>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {categoria.medidas && (
                                            <div className='submenu-target submenu-target-3'>
                                                <h3 className='submenu-target-title'>Medidas:</h3>
                                                <ul>
                                                    {categoria.medidas.map((medida) => (
                                                        <li key={uuidv4()}>
                                                            <a href={medida.ruta} title={medida.medida}>
                                                                <h4>{medida.medida}</h4>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {categoria.modelos && (
                                            <div className='submenu-target submenu-target-3'>
                                                <h3 className='submenu-target-title'>Modelos:</h3>
                                                <ul>
                                                    {categoria.modelos.map((modelo) => (
                                                        <li key={uuidv4()}>
                                                            <a href={modelo.ruta} title={modelo.modelo}>
                                                                <h4>{modelo.modelo}</h4>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {categoria.menuImg && (
                                            <div className='submenu-target submenu-target-4'>
                                                <img width={280} height={280} loading='lazy' src={categoria.menuImg[0]?.imgSrc} alt={categoria.menuImg[0]?.imgAlt || categoria.categoria}/>
                                            </div>
                                        )}
                                        </nav>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>
        </div>
    );
}

export default Bottom;
