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
    
    const [internalViewMode, setInternalViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewMode');
        return savedMode || 'grid';
    });

    const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
    const currentViewMode = viewMode !== undefined ? viewMode : internalViewMode;
    
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

    const handleOrdenChange = (nuevoOrden) => {
        if (setOrden) {
            setOrden(nuevoOrden);
            updateURL(nuevoOrden);
            setIsOrderDropdownOpen(false);
        }
    };

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
                <button type="button" className='filters-button' onClick={() => setIsFiltersOpen(true)}>
                    <span class="material-symbols-outlined">filter_alt</span>
                    <p className='text'>Filtros</p>
                </button>

                <button type='button' className={`toggle-btn toggle-btn-left ${currentViewMode === 'grid' ? 'active' : ''}`}  onClick={() => handleViewChange('grid')} aria-label="Vista en cuadrícula">
                    <span className="material-symbols-outlined">grid_view</span>
                </button>

                <button type='button' className={`toggle-btn toggle-btn-right ${currentViewMode === 'list' ? 'active' : ''}`} onClick={() => handleViewChange('list')} aria-label="Vista en lista">
                    <span className="material-symbols-outlined">list</span>
                </button>
            </div>

            <div className="order-filter-container">
                <button type='button' className={`order-filter-button ${orden && orden !== 'ultimo' ? 'has-selection' : ''}`} onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}>
                    <div className='d-flex-center-center gap-5'>
                        <span className="material-symbols-outlined">sync_alt</span>
                        <p className='text'>{getOrdenTexto()}</p>
                    </div>

                    <span className={`material-symbols-outlined ${isOrderDropdownOpen ? 'rotated' : ''}`}>keyboard_arrow_down</span>
                </button>

                {isOrderDropdownOpen && (
                    <ul className='order-filter-options'>
                        <li>
                            <button className={`order-filter-option-button ${orden === 'ultimo' || !orden ? 'active' : ''}`} onClick={() => handleOrdenChange('ultimo')}>
                                <span class="material-symbols-outlined">history_2</span>
                                <p className='text'>Más recientes</p>
                            </button>
                        </li>
                        <li>
                            <button className={`order-filter-option-button ${orden === 'menor-mayor' ? 'active' : ''}`} onClick={() => handleOrdenChange('menor-mayor')}>
                                <span class="material-symbols-outlined">trending_up</span>
                                <p className='text'>Menor a mayor precio</p>
                            </button>
                        </li>
                        <li>
                            <button className={`order-filter-option-button ${orden === 'mayor-menor' ? 'active' : ''}`} onClick={() => handleOrdenChange('mayor-menor')}>
                                <span class="material-symbols-outlined">trending_down</span>
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
