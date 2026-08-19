import { useState, useEffect } from 'react';

import Top from './Componentes/Top/Top';
import Center from './Componentes/Center/Center';
import Bottom from './Componentes/Bottom/Bottom';

import './Header.css';

function Header(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const openLocationModal = () => {
        setIsLocationModalOpen(true);
    };

    const closeLocationModal = () => {
        setIsLocationModalOpen(false);
    };

    const updateFavoritesCount = () => {
        const favStorage = JSON.parse(localStorage.getItem("favoritos")) || [];
        setFavoritesCount(favStorage.length);
    };

    useEffect(() => {
        updateFavoritesCount();
        
        const handleStorageChange = (e) => {
            if (e.key === 'favoritos') {
                updateFavoritesCount();
            }
        };
        
        const handleFavoritesUpdate = () => {
            updateFavoritesCount();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
        };
    }, []);

    return(
        <header>
            <Top/>
            <Center 
                onMenuClick={toggleMenu} 
                isMenuOpen={isMenuOpen}
                favoritesCount={favoritesCount}
                updateFavoritesCount={updateFavoritesCount}
                onOpenLocationModal={openLocationModal}
                isLocationModalOpen={isLocationModalOpen}
                onCloseLocationModal={closeLocationModal}
            />
            <Bottom 
                isMenuOpen={isMenuOpen}
                favoritesCount={favoritesCount}
                onOpenLocationModal={openLocationModal}
            />
        </header>
    );
}

export default Header;
