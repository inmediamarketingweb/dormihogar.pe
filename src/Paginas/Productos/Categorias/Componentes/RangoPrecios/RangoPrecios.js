import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './RangoPrecios.css';

function RangoPrecios({ productos = [], loading = false }) {
    const location = useLocation();
    const navigate = useNavigate();

    const presets = [
        { id: 'menos-500', label: 'Menos de s/500', min: 0, max: 499 },
        { id: '500-1000', label: 's/500 a s/1000', min: 500, max: 1000 },
        { id: '1000-2000', label: 's/1000 a s/2000', min: 1000, max: 2000 },
        { id: '2000-2499', label: 's/2000 a s/2499', min: 2000, max: 2499 }
    ];

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);

    const findPreset = (min, max) => {
        return presets.find(p => p.min === min && p.max === max) || null;
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const minParam = params.get('min');
        const maxParam = params.get('max');

        if (minParam && maxParam) {
            const min = parseInt(minParam);
            const max = parseInt(maxParam);
            
            if (!isNaN(min) && !isNaN(max)) {
                setMinPrice(min);
                setMaxPrice(max);
                const matchedPreset = findPreset(min, max);
                setSelectedPreset(matchedPreset ? matchedPreset.id : null);
                return;
            }
        }

        setMinPrice('');
        setMaxPrice('');
        setSelectedPreset(null);
    }, [location.search]);

    const updateURL = (min, max) => {
        const params = new URLSearchParams(location.search);
        
        if (min !== '' && max !== '' && !isNaN(min) && !isNaN(max)) {
            params.set('min', min);
            params.set('max', max);
        } else {
            params.delete('min');
            params.delete('max');
        }

        const newSearch = params.toString();
        const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
        navigate(newPath, { replace: true });
    };

    const handlePresetChange = (preset) => {
        const min = preset.min;
        const max = preset.max;

        setMinPrice(min);
        setMaxPrice(max);
        setSelectedPreset(preset.id);
        updateURL(min, max);
    };

    const handleMinChange = (e) => {
        const value = e.target.value;
        setMinPrice(value);
        setSelectedPreset(null);

        if (value !== '' && maxPrice !== '') {
            const min = parseInt(value);
            const max = parseInt(maxPrice);
            if (!isNaN(min) && !isNaN(max) && min <= max) {
                updateURL(min, max);
            }
        }
    };

    const handleMaxChange = (e) => {
        const value = e.target.value;
        setMaxPrice(value);
        setSelectedPreset(null);

        if (minPrice !== '' && value !== '') {
            const min = parseInt(minPrice);
            const max = parseInt(value);
            if (!isNaN(min) && !isNaN(max) && min <= max) {
                updateURL(min, max);
            }
        }
    };

    const handleRangeChange = (e) => {
        const value = parseInt(e.target.value);
        const currentMin = minPrice !== '' ? parseInt(minPrice) : 0;
        const currentMax = maxPrice !== '' ? parseInt(maxPrice) : 2499;
        const minDiff = Math.abs(value - currentMin);
        const maxDiff = Math.abs(value - currentMax);
        
        if (minDiff <= maxDiff) {
            setMinPrice(value);
            if (value <= currentMax) {
                updateURL(value, currentMax);
            }
        } else {
            setMaxPrice(value);
            if (value >= currentMin) {
                updateURL(currentMin, value);
            }
        }
        
        setSelectedPreset(null);
    };

    const effectiveMin = minPrice !== '' ? parseInt(minPrice) : 0;
    const effectiveMax = maxPrice !== '' ? parseInt(maxPrice) : 2499;

    return (
        <div className='pryce-range-container'>
            <div className='pryce-range-title'>
                <p className='text'>Rango de precios</p>
            </div>

            <div className='pryce-range'>
                <div className='price-inputs'>
                    <div className='price-input-group'>
                        <label>Min</label>
                        <input type='number' placeholder='Min' value={minPrice} onChange={handleMinChange} min={0} max={2499}/>
                    </div>
                    <div className='price-input-group'>
                        <label>Max</label>
                        <input type='number' placeholder='Max' value={maxPrice} onChange={handleMaxChange} min={0} max={2499}/>
                    </div>
                </div>

                <div className='range-slider-container'>
                    <input type='range' min={0} max={2499} value={effectiveMin} onChange={handleRangeChange} className='range-slider'/>
                    <div className='range-track'>
                        <div className='range-fill' style={{
                                left: `${(effectiveMin / 2499) * 100}%`,
                                right: `${100 - (effectiveMax / 2499) * 100}%`
                            }}
                        />
                    </div>

                    <div className='range-handle range-handle-min' style={{ left: `${(effectiveMin / 2499) * 100}%` }}/>
                    <div className='range-handle range-handle-max' style={{ left: `${(effectiveMax / 2499) * 100}%` }}/>
                </div>

                <ul className='pryce-range-list'>
                    {presets.map((preset) => {
                        const isActive = selectedPreset === preset.id;
                        return (
                            <li key={preset.id} className={`preset-item ${isActive ? 'active' : ''}`} onClick={() => handlePresetChange(preset)}>
                                <input type='radio' name='price-preset' checked={isActive} onChange={() => {}}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePresetChange(preset);
                                    }}
                                />
                                <p className='text'>{preset.label}</p>
                            </li>
                        );
                    })}
                </ul>

                <button type="button" className='button-link button-link-2' onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                        setSelectedPreset(null);
                        updateURL('', '');
                    }}
                >
                    <span className="material-symbols-outlined">delete</span>
                    <p className='button-link-text'>Limpiar rangos</p>
                </button>
            </div>
        </div>
    );
}

export default RangoPrecios;
