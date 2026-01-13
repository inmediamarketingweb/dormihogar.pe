import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

import './Regalos.css';

function Regalos({ producto, descripcionColchon = null }) {
    const [regalosConFotos, setRegalosConFotos] = useState([]);

    useEffect(() => {
        const extractColorFromName = () => {
            const nombre = producto.nombre || '';
            const partes = nombre.split('-');

            if (partes.length > 1) {
                let color = partes[partes.length - 1].trim();
                const palabras = color.split(' ');
                if (palabras.length > 0) {
                    color = palabras[palabras.length - 1].toLowerCase();
                }

                return color.toLowerCase();
            }
            return null;
        };

        const normalizarNombreRegaloLiteral = (texto) => {
            return texto
                .toLowerCase()
                .replace(/[^\w\s-áéíóúñ0-9]/g, '')
                .replace(/\s+/g, '-')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ñ/g, 'n')
                .replace(/--+/g, '-')
                .replace(/^-+|-+$/g, '');
        };

        const extraerCategoria = (texto) => {
            const textoLower = texto.toLowerCase();
            if (textoLower.includes('cojín') || textoLower.includes('cojines')) return 'cojines';
            if (textoLower.includes('puff')) return 'puff';
            return '';
        };

        const buscarImagenRegalo = async (textoRegalo) => {
            const color = extractColorFromName();
            const categoria = extraerCategoria(textoRegalo);
            let basePath;
            let nombreArchivo;

            if (categoria === 'cojines' || categoria === 'puff') {
                basePath = `/assets/imagenes/productos/regalos/${categoria}/`;
                nombreArchivo = color || 'default';
            } else {
                basePath = `/assets/imagenes/productos/regalos/`;
                nombreArchivo = normalizarNombreRegaloLiteral(textoRegalo);
            }

            const extensions = ['webp', 'jpg', 'jpeg', 'png'];

            for (const ext of extensions) {
                const imageUrl = `${basePath}${nombreArchivo}.${ext}`;
                try {
                    const response = await fetch(imageUrl, { method: 'HEAD' });
                    if (response.ok) {
                        return imageUrl;
                    }
                } catch (error) {
                    continue;
                }
            }

            if (categoria === '') {
                const nombreSinNumerosInicio = nombreArchivo.replace(/^\d+\-/, '');
                if (nombreSinNumerosInicio !== nombreArchivo) {
                    for (const ext of extensions) {
                        const imageUrl = `${basePath}${nombreSinNumerosInicio}.${ext}`;
                        try {
                            const response = await fetch(imageUrl, { method: 'HEAD' });
                            if (response.ok) {
                                return imageUrl;
                            }
                        } catch (error) {
                            continue;
                        }
                    }
                }

                const palabras = textoRegalo.toLowerCase().split(' ');
                if (palabras.length > 1) {
                    const ultimaPalabra = palabras[palabras.length - 1];
                    const nombreUltimaPalabra = normalizarNombreRegaloLiteral(ultimaPalabra);

                    for (const ext of extensions) {
                        const imageUrl = `${basePath}${nombreUltimaPalabra}.${ext}`;
                        try {
                            const response = await fetch(imageUrl, { method: 'HEAD' });
                            if (response.ok) {
                                return imageUrl;
                            }
                        } catch (error) {
                            continue;
                        }
                    }
                }
            }

            if ((categoria === 'cojines' || categoria === 'puff') && color) {
                for (const ext of extensions) {
                    const imageUrl = `${basePath}default.${ext}`;
                    try {
                        const response = await fetch(imageUrl, { method: 'HEAD' });
                        if (response.ok) {
                            return imageUrl;
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }

            return null;
        };

        const cargarImagenesRegalos = async () => {
            const regalosProductoPrincipal = Array.isArray(producto.regalos) ? producto.regalos : [];
            const regalosDelColchon = Array.isArray(descripcionColchon?.regalos) ? descripcionColchon.regalos : [];
            const todosLosRegalos = [...regalosProductoPrincipal, ...regalosDelColchon];

            if (todosLosRegalos.length === 0) {
                setRegalosConFotos([]);
                return;
            }

            const regalosProcesados = await Promise.all(
                todosLosRegalos.map(async (item) => {
                    try {
                        const texto = typeof item === 'string' ? item.trim() : (item?.texto ?? "").toString().trim();
                        const foto = await buscarImagenRegalo(texto);
                        const claseRegalo = normalizarNombreRegaloLiteral(texto);

                        return {
                            texto,
                            foto,
                            claseRegalo,
                            esDelColchon: regalosDelColchon.includes(item)
                        };
                    } catch (error) {
                        const texto = typeof item === "string" ? item : JSON.stringify(item);
                        return {
                            texto,
                            foto: null,
                            claseRegalo: normalizarNombreRegaloLiteral(texto),
                            esDelColchon: regalosDelColchon.includes(item)
                        };
                    }
                })
            );

            setRegalosConFotos(regalosProcesados);
        };

        cargarImagenesRegalos();
    }, [producto, descripcionColchon]);

    if (!Array.isArray(regalosConFotos) || regalosConFotos.length === 0) {
        return null;
    }

    return (
        <div className="product-page-gifts w-100 d-flex-column gap-10">
            <div className="d-flex gap-5">
                <p className="title uppercase color-color-1">Regalos</p>
            </div>

            <ul>
                {regalosConFotos.map((item) => (
                    <li key={uuidv4()} className={`d-flex gap-5 align-items-center regalo-item ${item.claseRegalo}`}>
                        {item.foto ? (
                            <img loading="lazy" src={item.foto} alt={item.texto} className="gift-image" 
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const placeholder = e.target.parentElement.querySelector('.gift-placeholder');
                                    if (placeholder) placeholder.style.display = 'flex';
                                }}
                            />
                        ) : (
                            <div className="gift-placeholder">
                                <span className="material-symbols-outlined">card_giftcard</span>
                            </div>
                        )}
                        <p className="text">{item.texto}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Regalos;
