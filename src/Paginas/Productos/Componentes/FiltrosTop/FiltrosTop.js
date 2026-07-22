import './FiltrosTop.css';

function FiltrosTop(){
    return(
        <div className='filtros-top-container'>
            <div className='filtros-top-helpers'>
                <button type='button' className='filter-grid'>
                    <span class="material-symbols-outlined">grid_view</span>
                </button>

                <button type='button' className='filter-list'>
                    <span class="material-symbols-outlined">splitscreen</span>
                </button>
            </div>

            <select>
                <option>Ordenar por</option>
                <option>Recomendados</option>
                <option>Mayor a menor precio</option>
                <option>Menor a mayor precio</option>
            </select>
        </div>
    )
}

export default FiltrosTop;
