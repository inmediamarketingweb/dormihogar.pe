import './Jerarquia.css';

function Jerarquia({ producto }){
    const breadcrumbKeys = ['categoria', 'tamaño', 'marca', 'modelo', 'línea'];
    const crumbs = [];
    let cumulativePath = '';

    breadcrumbKeys.forEach(key => {
        if (producto[key]) {
            cumulativePath += `/${producto[key]}`;
            crumbs.push({ key, label: producto[key], path: cumulativePath });
        }
    });

    if(producto.sku && producto.ruta){
        crumbs.push({ key: 'sku', label: producto.sku, path: `/productos/${producto.ruta}`});
    }

    return(
        <div className="product-page-direction">
            <ul className='d-flex-center-left gap-5 d-flex-wrap'>
                <li>
                    <a href={`/productos/${producto.categoria}/`} className='d-flex'>
                        <span className="material-icons">home</span>
                    </a>
                </li>

                {crumbs.map(({ key, label }) => (
                    <li key={key}>
                        <p>{label}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Jerarquia;
