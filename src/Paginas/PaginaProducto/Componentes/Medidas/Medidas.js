import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

import './Medidas.css';

const skuCache = new Map();

function Medidas({ producto }) {
    const medidas = producto["tamaños-disponibles"];
    const navigate = useNavigate();
    const [productosEncontrados, setProductosEncontrados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const cacheRef = useRef(skuCache);

    useEffect(() => {
        if (!Array.isArray(medidas) || medidas.length === 0) return;

        const buscarProductosPorSkus = async () => {
            setCargando(true);
            const resultados = [];

            for (const medida of medidas) {
                if (medida.sku) {
                    try {
                        const skuKey = medida.sku.trim();
                        let productoEncontrado = cacheRef.current.get(skuKey);
                        
                        if (!productoEncontrado) {
                            productoEncontrado = await buscarProductoPorSku(medida.sku);
                            if (productoEncontrado) {
                                cacheRef.current.set(skuKey, productoEncontrado);
                            }
                        }

                        resultados.push({
                            ...medida,
                            productoEncontrado: productoEncontrado || null,
                            encontrado: !!productoEncontrado
                        });
                    } catch (error) {
                        resultados.push({
                            ...medida,
                            productoEncontrado: null,
                            encontrado: false
                        });
                    }
                }
            }

            setProductosEncontrados(resultados);
            setCargando(false);
        };

        buscarProductosPorSkus();
    }, [medidas]);

    const buscarProductoPorSku = async (sku) => {
        try {
            const manifestRes = await fetch('/assets/json/manifest.json');
            if (!manifestRes.ok) return null;
            const manifestJson = await manifestRes.json();
            const filesList = Array.isArray(manifestJson) ? manifestJson : Array.isArray(manifestJson.files) ? manifestJson.files : [];

            for (const filePath of filesList) {
                try {
                    const r = await fetch(filePath);
                    if (!r.ok) continue;

                    const json = await r.json();
                    const productos = json.productos || [];

                    const productoEncontrado = productos.find(p => {
                        const skuProducto = (p.sku || "").toString().trim();
                        const skuBuscado = sku.toString().trim();
                        return skuProducto === skuBuscado;
                    });
                    
                    if (productoEncontrado) {
                        return productoEncontrado;
                    }
                } catch (e) {
                    continue;
                }
            }

            return null;
        } catch (error) {
            console.error('Error en búsqueda por SKU:', error);
            return null;
        }
    };

    const handleClickMedida = (medida) => {
        if (medida.productoEncontrado && medida.productoEncontrado.ruta) {
            navigate(medida.productoEncontrado.ruta);
        } else if (medida.sku) {
            navigate(`/busqueda?query=${encodeURIComponent(medida.sku)}`);
        }
    };

    if (!Array.isArray(medidas) || medidas.length === 0) {
        return null;
    }

    return (
        <div className="d-flex-column gap-5">
            <h2 className="title text uppercase color-color-1">Otras medidas</h2>

            {cargando ? (
                <div className="cargando-medidas">
                    <p>Cargando opciones...</p>
                </div>
            ) : (
                <>
                    <ul className="product-page-sizes d-flex-wrap gap-5">
                        {productosEncontrados.map((medida) => (
                            <li key={uuidv4()}>
                                <a className={`boton-medida ${medida.productoEncontrado ? 'disponible' : 'no-disponible'}`} onClick={() => handleClickMedida(medida)}
                                    title={medida.nombre}
                                >
                                    <p>{medida.nombre}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                    
                    {productosEncontrados.some(m => !m.encontrado) && (
                        <p className="nota-medidas">
                            * Algunas medidas pueden no estar disponibles actualmente
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default Medidas;
