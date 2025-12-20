// import { useState } from 'react';

// import './Cantidad.css';

// function Cantidad({ onChange }) {

//     const MIN = 1;
//     const MAX = 10;

//     const [cantidad, setCantidad] = useState(1);

//     const aumentar = () => {
//         setCantidad(prev => {
//             const nueva = Math.min(prev + 1, MAX);
//             if(onChange) onChange(nueva);
//             return nueva;
//         });
//     };

//     const disminuir = () => {
//         setCantidad(prev => {
//             const nueva = Math.max(prev - 1, MIN);
//             if(onChange) onChange(nueva);
//             return nueva;
//         });
//     };

//     return(
//         <div className='product-page-quantity'>
//             <span>{cantidad}</span>
//             <div className='d-flex-column'>
//                 <button type='button' onClick={aumentar} disabled={cantidad === MAX}>+</button>
//                 <button type='button' onClick={disminuir} disabled={cantidad === MIN}>-</button>
//             </div>
//         </div>
//     );
// }

// export default Cantidad;

import { useState } from 'react';
import './Cantidad.css';

function Cantidad({ onChange }) {
    const MIN = 1;
    const MAX = 10;
    const [cantidad, setCantidad] = useState(1);

    const aumentar = () => {
        setCantidad(prev => {
            const nueva = Math.min(prev + 1, MAX);
            if(onChange) onChange(nueva);
            return nueva;
        });
    };

    const disminuir = () => {
        setCantidad(prev => {
            const nueva = Math.max(prev - 1, MIN);
            if(onChange) onChange(nueva);
            return nueva;
        });
    };

    return(
        <div className='product-page-quantity'>
            <span>{cantidad}</span>
            <div className='d-flex-column'>
                <button type='button' onClick={aumentar} disabled={cantidad === MAX}>+</button>
                <button type='button' onClick={disminuir} disabled={cantidad === MIN}>-</button>
            </div>
        </div>
    );
}

export default Cantidad;
