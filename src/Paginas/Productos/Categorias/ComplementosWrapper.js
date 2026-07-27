import { useLocation } from 'react-router-dom';
import Complementos from './Complementos';
import PaginaProducto from '../../PaginaProducto/PaginaProducto';

/**
 * Componente wrapper que decide si renderizar la lista de complementos
 * o una página de producto individual basado en la profundidad de la URL
 */
function ComplementosWrapper() {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Eliminar 'productos' y 'complementos' de los segmentos
    // para obtener solo los parámetros de la categoría/producto
    let params = [];
    let startIndex = 0;
    
    for (let i = 0; i < pathSegments.length; i++) {
        if (pathSegments[i] === 'productos') {
            startIndex = i + 1;
            break;
        }
    }
    
    // Encontrar 'complementos' en los segmentos
    let complementosIndex = -1;
    for (let i = startIndex; i < pathSegments.length; i++) {
        if (pathSegments[i] === 'complementos') {
            complementosIndex = i;
            break;
        }
    }
    
    if (complementosIndex !== -1) {
        params = pathSegments.slice(complementosIndex + 1);
    }
    
    // Determinar si es una página de producto o listado
    // Si tiene 4 o más parámetros después de 'complementos', consideramos que es un producto
    // Ejemplo: /productos/complementos/baules/clasicas/2/ -> params = ['baules', 'clasicas', '2'] (3 params - podría ser producto)
    // Pero también podría ser: /productos/complementos/baules/clasicas/ (2 params - listado)
    
    // Verificar si el último parámetro parece ser un ID (número o string con formato de ID)
    const lastParam = params[params.length - 1];
    const isProductDetail = params.length >= 3 && (
        // Si el último parámetro es un número, probablemente es un ID
        /^\d+$/.test(lastParam) ||
        // O si tiene un formato de ID (como 'kamas-baul-123')
        /^[a-z0-9-]+-\d+$/.test(lastParam)
    );
    
    // También verificar si hay más de 3 parámetros, probablemente es un producto
    const isDeepPath = params.length >= 4;
    
    // Si es una página de producto, renderizar PaginaProducto
    if (isProductDetail || isDeepPath) {
        return <PaginaProducto />;
    }
    
    // Si no, renderizar la lista de complementos
    return <Complementos />;
}

export default ComplementosWrapper;
