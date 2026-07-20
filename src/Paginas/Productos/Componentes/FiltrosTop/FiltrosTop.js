import { useLocation, useNavigate } from 'react-router-dom';

import './FiltrosTop.css';

const normalizarTexto = (texto) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
};

function FiltrosTop({ 
    setIsFiltersOpen, 
    isFiltersOpen,
    // Props de paginación
    currentPage,
    totalPages,
    onPageChange,
    onPreviousPage,
    onNextPage,
    getVisiblePages,
    // Otras props
    setOrden,
    orden,
    productosCount
}){
    const location = useLocation();
    const navigate = useNavigate();
    const marcas = ["El cisne", "Kamas", "Paraiso", "Komfort"];

    const toggleFilters = () => {
        setIsFiltersOpen(!isFiltersOpen);
    };

    const manejarFiltroMarca = (marca) => {
        const params = new URLSearchParams(location.search);
        const valorNormalizado = normalizarTexto(marca);

        if (params.get("marca") === valorNormalizado) {
            params.delete("marca");
        } else {
            params.set("marca", valorNormalizado);
        }

        navigate(`${location.pathname}?${params.toString()}`);
    };

    const manejarOrden = (nuevoOrden) => {
        setOrden(nuevoOrden);
    };

    return(
        <div className='filtros-top-container'>
            <div className='fitros-top-brands-container'>
                <div className='filtros-top-brands'>
                    {marcas.map((marca, index) => {
                        const queryParams = new URLSearchParams(location.search);
                        const activo = queryParams.get("marca") === normalizarTexto(marca);

                        return(
                            <button 
                                key={index} 
                                type='button' 
                                className={activo ? 'active' : ''} 
                                onClick={() => manejarFiltroMarca(marca)}
                            >
                                <p>{marca}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className='pagination-container'>
                <button 
                    type='button' 
                    className='pagination-arrow'
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                    <p>Anterior</p>
                </button>

                <ul className="pagination-list">
                    {getVisiblePages && getVisiblePages().map((page, index) => 
                        typeof page === 'number' ? (
                            <li key={index}>
                                <button 
                                    type='button'
                                    className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ) : (
                            <li key={index}>
                                <span className="pagination-ellipsis">…</span>
                            </li>
                        )
                    )}
                </ul>

                <button 
                    type='button' 
                    className='pagination-arrow'
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                >
                    <p>Siguiente</p>
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            <button type='button' className='filters-button-open' onClick={toggleFilters}>
                <span className="material-icons">tune</span>
                <p className='text'>Filtros</p>
            </button>
        </div>
    );
}

export default FiltrosTop;
