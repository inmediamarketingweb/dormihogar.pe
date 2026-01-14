import './Resumen.css';

function Resumen({ producto, ficha = [] }){
    const propiedadesProducto = [
        { clave: "marca", etiqueta: "Marca" },
        { clave: "tamaño", etiqueta: "Tamaño" },
        { clave: "modelo-de-colchón", etiqueta: "Modelo de colchón" },
        { clave: "línea", etiqueta: "Línea" }
    ];

    const propiedadesFichaImportantes = [
        "garantía",
        "resortes",
        "línea-de-colchón",
        "nivel-de-confort",
        "sensación"
    ];

    const obtenerPropiedades = () => {
        const propiedades = [];

        propiedadesProducto.forEach(prop => {
            if (producto[prop.clave]) {
                propiedades.push({
                    etiqueta: prop.etiqueta,
                    valor: producto[prop.clave]
                });
            }
        });

        if (ficha.length > 0) {
            ficha.forEach(seccion => {
                Object.entries(seccion).forEach(([clave, valor]) => {
                    if (propiedadesFichaImportantes.includes(clave) && valor) {
                        propiedades.push({
                            etiqueta: clave.replace(/-/g, ' ')
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' '),
                            valor: valor
                        });
                    }
                });
            });
        }

        return propiedades.slice(0, 5);
    };

    const propiedades = obtenerPropiedades();

    if (propiedades.length === 0) {
        return null;
    }

    return(
        <ul className='product-page-resume'>
            {propiedades.map((prop, index) => (
                <li key={index}>
                    <span className="material-icons">check</span>
                    <div>
                        <b className='first-uppercase'>{prop.etiqueta}:</b>
                        <p className='text first-uppercase'>{prop.valor}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default Resumen;
