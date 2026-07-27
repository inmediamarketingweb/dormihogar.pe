// import { useState } from 'react';

// import './FiltrosTop.css';

// function FiltrosTop({ 
//     setOrden, 
//     orden, 
//     toggleFiltro, 
//     isFiltroActivo, 
//     setIsFiltersOpen, 
//     isFiltersOpen, 
//     productosCount, 
//     totalProductos, 
//     currentPage, 
//     totalPages, 
//     onPageChange, 
//     onPreviousPage, 
//     onNextPage, 
//     getVisiblePages,
//     viewMode,
//     setViewMode
// }) {
//     // Estado interno para viewMode si no viene de props
//     const [internalViewMode, setInternalViewMode] = useState(() => {
//         const savedMode = localStorage.getItem('viewMode');
//         return savedMode || 'grid';
//     });

//     // Estado para controlar el dropdown de ordenamiento
//     const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

//     // Usar props si existen, si no usar estado interno
//     const currentViewMode = viewMode !== undefined ? viewMode : internalViewMode;
    
//     const handleViewChange = (mode) => {
//         const setMode = setViewMode || setInternalViewMode;
//         setMode(mode);
//         localStorage.setItem('viewMode', mode);
//     };

//     // Manejador para el cambio de orden
//     const handleOrdenChange = (nuevoOrden) => {
//         if (setOrden) {
//             setOrden(nuevoOrden);
//             setIsOrderDropdownOpen(false);
//         }
//     };

//     // Obtener el texto del orden actual
//     const getOrdenTexto = () => {
//         switch(orden) {
//             case 'menor-mayor':
//                 return 'Menor a mayor precio';
//             case 'mayor-menor':
//                 return 'Mayor a menor precio';
//             default:
//                 return 'Últimos';
//         }
//     };

//     return(
//         <div className='filtros-top-container'>
//             <div className='filtros-top-helpers'>
//                 <button 
//                     type='button' 
//                     className={`toggle-btn toggle-btn-left ${currentViewMode === 'grid' ? 'active' : ''}`} 
//                     onClick={() => handleViewChange('grid')}
//                     aria-label="Vista en cuadrícula"
//                 >
//                     <span className="material-symbols-outlined">grid_view</span>
//                 </button>

//                 <button 
//                     type='button' 
//                     className={`toggle-btn toggle-btn-right ${currentViewMode === 'list' ? 'active' : ''}`} 
//                     onClick={() => handleViewChange('list')} 
//                     aria-label="Vista en lista"
//                 >
//                     <span className="material-symbols-outlined">list</span>
//                 </button>
//             </div>

//             <div className="order-filter-container">
//                 <button 
//                     type='button' 
//                     className='order-filter-button'
//                     onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}
//                 >
//                     <div className='d-flex-center-center'>
//                         <span className="material-symbols-outlined">sync_alt</span>
//                         <p className='text'>Ordenar por</p>
//                     </div>

//                     <span className="material-symbols-outlined">keyboard_arrow_down</span>
//                 </button>

//                 {isOrderDropdownOpen && (
//                     <ul className='order-filter-options'>
//                         <li>
//                             <button 
//                                 className={`order-filter-option-button ${orden === 'ultimo' ? 'active' : ''}`}
//                                 onClick={() => handleOrdenChange('ultimo')}
//                             >
//                                 <p className='text'>Últimos</p>
//                             </button>
//                         </li>
//                         <li>
//                             <button 
//                                 className={`order-filter-option-button ${orden === 'menor-mayor' ? 'active' : ''}`}
//                                 onClick={() => handleOrdenChange('menor-mayor')}
//                             >
//                                 <p className='text'>Menor a mayor precio</p>
//                             </button>
//                         </li>
//                         <li>
//                             <button 
//                                 className={`order-filter-option-button ${orden === 'mayor-menor' ? 'active' : ''}`}
//                                 onClick={() => handleOrdenChange('mayor-menor')}
//                             >
//                                 <p className='text'>Mayor a menor precio</p>
//                             </button>
//                         </li>
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default FiltrosTop;

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './FiltrosTop.css';

function FiltrosTop({ 
    setOrden, 
    orden, 
    toggleFiltro, 
    isFiltroActivo, 
    setIsFiltersOpen, 
    isFiltersOpen, 
    productosCount, 
    totalProductos, 
    currentPage, 
    totalPages, 
    onPageChange, 
    onPreviousPage, 
    onNextPage, 
    getVisiblePages,
    viewMode,
    setViewMode
}) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Estado interno para viewMode si no viene de props
    const [internalViewMode, setInternalViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewMode');
        return savedMode || 'grid';
    });

    // Estado para controlar el dropdown de ordenamiento
    const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

    // Usar props si existen, si no usar estado interno
    const currentViewMode = viewMode !== undefined ? viewMode : internalViewMode;
    
    // Obtener el orden de la URL al cargar
    useEffect(() => {
        const ordenParam = searchParams.get('orden');
        if (ordenParam && setOrden) {
            setOrden(ordenParam);
        }
    }, [searchParams, setOrden]);

    const handleViewChange = (mode) => {
        const setMode = setViewMode || setInternalViewMode;
        setMode(mode);
        localStorage.setItem('viewMode', mode);
    };

    // Función para actualizar la URL
    const updateURL = (nuevoOrden) => {
        const params = new URLSearchParams(searchParams);
        
        if (nuevoOrden && nuevoOrden !== 'ultimo') {
            params.set('orden', nuevoOrden);
        } else {
            params.delete('orden');
        }
        
        const newURL = `${window.location.pathname}?${params.toString()}`;
        navigate(newURL, { replace: true });
    };

    // Manejador para el cambio de orden
    const handleOrdenChange = (nuevoOrden) => {
        if (setOrden) {
            setOrden(nuevoOrden);
            updateURL(nuevoOrden);
            setIsOrderDropdownOpen(false);
        }
    };

    // Obtener el texto del orden actual
    const getOrdenTexto = () => {
        switch(orden) {
            case 'menor-mayor':
                return 'Menor a mayor precio';
            case 'mayor-menor':
                return 'Mayor a menor precio';
            default:
                return 'Más recientes';
        }
    };

    return(
        <div className='filtros-top-container'>
            <div className='filtros-top-helpers'>
                <button 
                    type='button' 
                    className={`toggle-btn toggle-btn-left ${currentViewMode === 'grid' ? 'active' : ''}`} 
                    onClick={() => handleViewChange('grid')}
                    aria-label="Vista en cuadrícula"
                >
                    <span className="material-symbols-outlined">grid_view</span>
                </button>

                <button 
                    type='button' 
                    className={`toggle-btn toggle-btn-right ${currentViewMode === 'list' ? 'active' : ''}`} 
                    onClick={() => handleViewChange('list')} 
                    aria-label="Vista en lista"
                >
                    <span className="material-symbols-outlined">list</span>
                </button>
            </div>

            <div className="order-filter-container">
                <button 
                    type='button' 
                    className={`order-filter-button ${orden && orden !== 'ultimo' ? 'has-selection' : ''}`}
                    onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}
                >
                    <div className='d-flex-center-center gap-5'>
                        <span className="material-symbols-outlined">sync_alt</span>
                        <p className='text'>{getOrdenTexto()}</p>
                    </div>

                    <span className={`material-symbols-outlined ${isOrderDropdownOpen ? 'rotated' : ''}`}>
                        keyboard_arrow_down
                    </span>
                </button>

                {isOrderDropdownOpen && (
                    <ul className='order-filter-options'>
                        <li>
                            <button 
                                className={`order-filter-option-button ${orden === 'ultimo' || !orden ? 'active' : ''}`}
                                onClick={() => handleOrdenChange('ultimo')}
                            >
                                <p className='text'>Más recientes</p>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`order-filter-option-button ${orden === 'menor-mayor' ? 'active' : ''}`}
                                onClick={() => handleOrdenChange('menor-mayor')}
                            >
                                <p className='text'>Menor a mayor precio</p>
                            </button>
                        </li>
                        <li>
                            <button 
                                className={`order-filter-option-button ${orden === 'mayor-menor' ? 'active' : ''}`}
                                onClick={() => handleOrdenChange('mayor-menor')}
                            >
                                <p className='text'>Mayor a menor precio</p>
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
}

export default FiltrosTop;
