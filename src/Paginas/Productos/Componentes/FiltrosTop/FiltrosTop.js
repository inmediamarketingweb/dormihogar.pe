import { useState } from 'react';
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
    // Estado interno para viewMode si no viene de props
    const [internalViewMode, setInternalViewMode] = useState(() => {
        const savedMode = localStorage.getItem('viewMode');
        return savedMode || 'grid';
    });

    // Usar props si existen, si no usar estado interno
    const currentViewMode = viewMode !== undefined ? viewMode : internalViewMode;
    
    const handleViewChange = (mode) => {
        const setMode = setViewMode || setInternalViewMode;
        setMode(mode);
        localStorage.setItem('viewMode', mode);
    };

    // Manejador para el cambio de orden
    const handleOrdenChange = (e) => {
        if (setOrden) {
            setOrden(e.target.value);
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

            <select value={orden || 'ultimo'} onChange={handleOrdenChange}>
                <option value="ultimo">Últimos</option>
                <option value="menor-mayor">Menor a mayor precio</option>
                <option value="mayor-menor">Mayor a menor precio</option>
            </select>
        </div>
    );
}

export default FiltrosTop;