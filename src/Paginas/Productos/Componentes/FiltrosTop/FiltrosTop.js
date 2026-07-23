// import './FiltrosTop.css';

// function FiltrosTop(){
//     return(
//         <div className='filtros-top-container'>
//             <div className='filtros-top-helpers'>
//                 <button type='button' className='filter-grid'>
//                     <span class="material-symbols-outlined">grid_view</span>
//                 </button>

//                 <button type='button' className='filter-list'>
//                     <span class="material-symbols-outlined">list</span>
//                 </button>
//             </div>

//             <select>
//                 <option>Ordenar por</option>
//                 <option>Recomendados</option>
//                 <option>Mayor a menor precio</option>
//                 <option>Menor a mayor precio</option>
//             </select>
//         </div>
//     )
// }

// export default FiltrosTop;

// FiltrosTop.js

import './FiltrosTop.css';

function FiltrosTop({ viewMode, setViewMode }) {
    const handleViewChange = (mode) => {
        setViewMode(mode);
        // Guardar en localStorage
        localStorage.setItem('viewMode', mode);
    };

    return(
        <div className='filtros-top-container'>
            <div className='filtros-top-helpers'>
                <button 
                    type='button' 
                    className={`filter-grid ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => handleViewChange('grid')}
                >
                    <span className="material-symbols-outlined">grid_view</span>
                </button>

                <button 
                    type='button' 
                    className={`filter-list ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => handleViewChange('list')}
                >
                    <span className="material-symbols-outlined">list</span>
                </button>
            </div>

            <select>
                <option>Ordenar por</option>
                <option>Recomendados</option>
                <option>Mayor a menor precio</option>
                <option>Menor a mayor precio</option>
            </select>
        </div>
    );
}

export default FiltrosTop;
