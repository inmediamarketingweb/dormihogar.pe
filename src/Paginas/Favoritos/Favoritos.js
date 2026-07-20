import { useState, useEffect } from "react";

import { Producto } from "../../Componentes/Plantillas/Producto/Producto";

import "./Favoritos.css";

function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);

    useEffect(() => {
        const favStorage = JSON.parse(localStorage.getItem("favoritos")) || [];
        setFavoritos(favStorage);
    }, []);

    const handleFavoritesUpdate = () => {
        const favStorage = JSON.parse(localStorage.getItem("favoritos")) || [];
        setFavoritos(favStorage);
    };

    useEffect(() => {
        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
        };
    }, []);

    return (
        <>
            <title>Mis favoritos | Dormihogar</title>

            <main>
                <div className="block-container margin-top-10">
                    <section className="block-content">
                        <div className="block-title-container">
                            <h2 className="block-title">Mis favoritos</h2>
                        </div>

                        <div className="favorites-container d-flex-column gap-20">
                            {favoritos.length > 0 ? (
                                <ul className="favorites-products">
                                    {favoritos.map((producto) => (
                                        <Producto key={producto.sku} producto={producto} />
                                    ))}
                                </ul>
                            ) : (
                                <p>No tienes productos en favoritos.</p>
                            )}
                            <a href="/" className="button-link button-link-2 margin-left">
                                <span className="material-icons">arrow_back</span>
                                <p className="button-link-text">Volver a la página principal</p>
                            </a>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

export default Favoritos;