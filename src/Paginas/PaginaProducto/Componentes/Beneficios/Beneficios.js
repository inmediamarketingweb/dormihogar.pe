import './Beneficios.css';

function Beneficios(){
    return(
        <ul className='benefist-container'>
            <li>
                <span className="material-symbols-outlined fill-1">shield</span>
                <p className='text'>Compra segura</p>
            </li>
            <li>
                <span className="material-symbols-outlined fill-1">delivery_truck_speed</span>
                <p className='text'>Envíos inmediatos</p>
            </li>
            <li>
                <span className="material-symbols-outlined fill-1">package_2</span>
                <p className='text'>Entrega segura</p>
            </li>
            <li>
                <span className="material-symbols-outlined fill-1">verified</span>
                <p className='text'>Incluye garantía</p>
            </li>
        </ul>
    )
}

export default Beneficios;
