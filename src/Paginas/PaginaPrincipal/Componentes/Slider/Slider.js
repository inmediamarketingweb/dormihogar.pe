import { useState, useRef, useEffect } from 'react';

import './Slider.css';

function Slider() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await fetch('/assets/json/componentes/slider.json');
                if (!response.ok) {
                    throw new Error('Error al cargar los slides');
                }
                const data = await response.json();
                setSlides(data.slider || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching slides:', err);
            }
        };

        fetchSlides();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [slides]);

    const goToNextSlide = () => {
        if (slides.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const goToPrevSlide = () => {
        if (slides.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <div className="slider-general-container d-flex-column">
                <div className="hero-container">
                    <div className="loading-spinner">Cargando slider...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="slider-general-container d-flex-column">
                <div className="hero-container">
                    <div className="error-message">Error al cargar el slider: {error}</div>
                </div>
            </div>
        );
    }

    if (slides.length === 0) {
        return (
            <div className="slider-general-container d-flex-column">
                <div className="hero-container">
                    <div className="no-slides-message">No hay slides disponibles</div>
                </div>
            </div>
        );
    }

    return (
        <div className="slider-general-container d-flex-column">
            <div className="hero-container">
                <section className="hero">
                    <div className="slider-container">
                        <ul className="slider" ref={sliderRef} style={{ marginLeft: `-${currentIndex * 100}%` }}>
                            {slides.map((slide, index) => (
                                <li key={slide.id || index}>
                                    <a href={slide.href} title={slide.title}>
                                        <img src={slide.src} alt={slide.alt} 
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <button type="button" className="hero-slider-button hero-slider-button-1" onClick={goToPrevSlide}>
                    <span className="material-icons">chevron_left</span>
                </button>

                <button type="button" className="hero-slider-button hero-slider-button-2" onClick={goToNextSlide}>
                    <span className="material-icons">chevron_right</span>
                </button>

                <div className='slider-general-dots'>
                    {slides.map((_, index) => (
                        <span 
                            key={index}
                            className={currentIndex === index ? 'active' : ''}
                            onClick={() => goToSlide(index)}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Slider;
