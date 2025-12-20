import './Resumen.css';

function Resumen({ producto }){
    const propiedadesRequeridas = [
        "marca",
        "tamaño",
        "modelo-de-colchón", 
        "resortes",
        "modelo-de-cabecera"
    ];

    return(
        <ul className='product-page-resume'>
            {producto["detalles-del-producto"] && producto["detalles-del-producto"].map((detalle, index) => (
                Object.entries(detalle).filter(
                    ([key, value]) => propiedadesRequeridas.includes(key) && value
                )
                .map(([key, value]) => (
                    <li key={key + index}>
                        <span className="material-icons">check</span>
                        <div>
                            <b className='first-uppercase'>
                                {
                                    key.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                                }:
                            </b>
                            <p className='text first-uppercase'>{value}</p>
                        </div>
                    </li>
                ))
            ))}
        </ul>
    );
}

export default Resumen;
