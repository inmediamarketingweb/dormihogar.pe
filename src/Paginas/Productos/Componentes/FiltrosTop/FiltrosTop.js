import { useLocation, useNavigate } from 'react-router-dom';

import './FiltrosTop.css';

const normalizarTexto = (texto) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
};

function FiltrosTop({ setIsFiltersOpen, isFiltersOpen }){
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

    return(
        <div className='filtros-top-container'>
            <div className='d-flex-column gap-5'>
                <p className='title'>Marcas:</p>

                <div className='filtros-top-brands d-flex-wrap'>
                    {marcas.map((marca, index) => {
                        const queryParams = new URLSearchParams(location.search);
                        const activo = queryParams.get("marca") === normalizarTexto(marca);

                        return(
                            <button key={index} type='button' className={activo ? 'active' : ''} onClick={() => manejarFiltroMarca(marca)}>
                                <p>{marca}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <button type='button' className='filters-button-open' onClick={toggleFilters}>
                <span className="material-icons">tune</span>
            </button>
        </div>
    );
}

export default FiltrosTop;
