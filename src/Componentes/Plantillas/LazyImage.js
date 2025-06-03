import { useEffect, useRef, useState } from "react";

function LazyImage({ src, alt, width, height }){
    const imgRef = useRef();
    const [isVisible, setIsVisible] = useState(false);
    const [currentSrc, setCurrentSrc] = useState('');
    const [attemptedExtensions, setAttemptedExtensions] = useState([]);

    const getBasePath = (path) => {
        return path.replace(/\.(jpg|webp|png)$/i, '');
    };

    useEffect(() => {
        const basePath = getBasePath(src);
        const extensions = ['.jpg', '.webp', '.png'];
        let active = true;

        const tryNextExtension = (index = 0) => {
            if (index >= extensions.length || !active) {
                if (active) setCurrentSrc(src);
                return;
            }

            const testSrc = `${basePath}${extensions[index]}`;
            const testImage = new Image();

            testImage.onload = () => {
                if (active && !attemptedExtensions.includes(extensions[index])){
                    setCurrentSrc(testSrc);
                    setAttemptedExtensions(prev => [...prev, extensions[index]]);
                }
            };

            testImage.onerror = () => {
                if (active) tryNextExtension(index + 1);
            };

            testImage.src = testSrc;
        };

        if (isVisible && !currentSrc) {
            tryNextExtension();
        }

        return () => {
            active = false;
        };
    }, [isVisible, src, attemptedExtensions, currentSrc]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.1 }
        );

        if (imgRef.current) observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, []);

    return(
        <img ref={imgRef} src={isVisible ? currentSrc || src : undefined} alt={alt} width={width} height={height} 
            loading="lazy" 
            style={{ backgroundColor: "#FFFFFF" }}
            onError={(e) => {
                if (!attemptedExtensions.includes('.jpg') && currentSrc !== `${getBasePath(src)}.jpg`) {
                    setCurrentSrc(`${getBasePath(src)}.jpg`);
                } else if (!attemptedExtensions.includes('.webp') && currentSrc !== `${getBasePath(src)}.webp`) {
                    setCurrentSrc(`${getBasePath(src)}.webp`);
                } else if (!attemptedExtensions.includes('.png') && currentSrc !== `${getBasePath(src)}.png`) {
                    setCurrentSrc(`${getBasePath(src)}.png`);
                }
            }}
        />
    );
}

export default LazyImage;
