import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Marcas.css';
import customersData from './Marcas.json';

const Marcas = () => {
    const [isHovering, setIsHovering] = useState(false);
    const trackRef = useRef(null);
    const animationRef = useRef(null);

    const calculateDuration = useCallback((width) => {
        const baseSpeed = 800;
        return (width / baseSpeed) * 10000;
    }, []);

    const startScrollAnimation = useCallback(() => {
        if (!trackRef.current) return;

        if (animationRef.current) {
            animationRef.current.cancel();
        }

        const trackWidth = trackRef.current.scrollWidth / 2;
        const containerWidth = trackRef.current.parentElement?.clientWidth || 0;

        if (trackWidth > containerWidth) {
            animationRef.current = trackRef.current.animate(
                [
                    { transform: 'translateX(0)' },
                    { transform: `translateX(-${trackWidth}px)` }
                ],
                {
                    duration: calculateDuration(trackWidth),
                    iterations: Infinity,
                    easing: 'linear',
                }
            );
        }
    }, [calculateDuration]);

    const pauseAnimation = useCallback(() => {
        if (animationRef.current) {
            animationRef.current.pause();
        }
    }, []);

    const resumeAnimation = useCallback(() => {
        if (animationRef.current) {
            animationRef.current.play();
        }
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
        pauseAnimation();
    }, [pauseAnimation]);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
        resumeAnimation();
    }, [resumeAnimation]);

    useEffect(() => {
        startScrollAnimation();

        const handleResize = () => {
            startScrollAnimation();
        };

    window.addEventListener('resize', handleResize);

        return () => {
            if (animationRef.current) {
                animationRef.current.cancel();
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [startScrollAnimation]);

    return(
        <div className="block-container">
            <section className="block-content">
                <div className="block-title-container">
                    <h2 className='block-title'>Marcas</h2>
                </div>

                <div className="customers-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <ul ref={trackRef} className={`customers-track ${isHovering ? 'paused' : ''}`}>
                        {customersData.customers.map((customer) => (
                            <li key={`first-${customer.id}`}>
                                <a href={customer.customerLink} target="_blank" title={customer.customerName}>
                                    <img src={customer.customerImage} alt={customer.customerName} />
                                </a>
                            </li>
                        ))}

                        {customersData.customers.map((customer) => (
                            <li key={`second-${customer.id}`}>
                                <a href={customer.customerLink} target="_blank">
                                    <img src={customer.customerImage} alt={customer.customerName} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default Marcas;
