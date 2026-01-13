import { useState, useEffect, useRef } from 'react';

import './Envios.css';

const initialSelection = {
    nombres: localStorage.getItem('nombres') || '',
    departamento: localStorage.getItem('departamento') || '',
    provincia: localStorage.getItem('provincia') || '',
    distrito: localStorage.getItem('distrito') || '',
    agencia: localStorage.getItem('agencia') || '',
    sede: localStorage.getItem('sede') || ''
};

const initialCheckboxValues = {
    express: localStorage.getItem('express-selected') === 'true',
    directo: localStorage.getItem('directo-selected') === 'true'
};

function Envios({ producto, onConfirm }){
    const productoConEnvio = producto ? {
        ...producto,
        'tipo-de-envio': producto['tipo-de-envio'] || 'Gratis'
    } : { 'tipo-de-envio': 'Gratis' };

    const [costosEnvioData, setCostosEnvioData] = useState(null);
    const [selected, setSelected] = useState(initialSelection);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedExpress, setSelectedExpress] = useState(initialCheckboxValues.express);
    const [selectedDirecto, setSelectedDirecto] = useState(initialCheckboxValues.directo);
    const searchInputRef = useRef(null);
    const searchResultsRef = useRef(null);
    const departamentoData = costosEnvioData?.departamentos.find(d => d.departamento === selected.departamento);
    const provinciaData = departamentoData?.provincias.find(p => p.provincia === selected.provincia);
    const distritoData = provinciaData?.distritos.find(d => d.distrito === selected.distrito);
    const agencies = distritoData?.['agencias-recomendadas'] || [];
    const selectedAgency = agencies.find(a => a.agencia === selected.agencia);
    const provinciaSinAgencia = ['Lima metropolitana', 'Provincia constitucional del Callao'].includes(selected.provincia);
    const noAgencias = agencies.length === 0;
    const isComplete = selected.departamento && selected.provincia && selected.distrito && (provinciaSinAgencia || noAgencias || (selected.agencia && selected.sede));

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch('/assets/json/costos-de-envio.json');
                setCostosEnvioData(await response.json());
            } catch (error) {
                console.error('Error al cargar JSON de costos de envío:', error);
            }
        };
        fetchData();
    }, []);

    // useEffect(() => {
    //     if (isComplete) {
    //         const shippingOptions = calculateShippingOptions();
    //         const hasExpress = shippingOptions.some(option => option.tipo === "Envío express");
    //         const hasDirecto = shippingOptions.some(option => option.tipo === "Envío directo");

    //         onConfirm?.({
    //             distritoData,
    //             hasAgency: !!selected.agencia,
    //             shippingOptions,
    //             selectedAgency: selected.agencia,
    //             selectedSede: selected.sede,
    //             selectedExpress: hasExpress ? selectedExpress : false,
    //             selectedDirecto: hasDirecto ? selectedDirecto : false,
    //             locationData: {
    //                 nombres: selected.nombres,
    //                 departamento: selected.departamento,
    //                 provincia: selected.provincia,
    //                 distrito: selected.distrito
    //             }    
    //         });
    //     }
    // }, [selected, isComplete, selectedExpress, selectedDirecto]);

    // En el useEffect que llama onConfirm en Envios.js, agreguemos más información:

    useEffect(() => {
        if (isComplete) {
            const shippingOptions = calculateShippingOptions();
            const hasExpress = shippingOptions.some(option => option.tipo === "Envío express");
            const hasDirecto = shippingOptions.some(option => option.tipo === "Envío directo");
            const tipoEnvioProducto = productoConEnvio['tipo-de-envio'];
            const productShippingOption = shippingOptions.find(option => option.tipo === tipoEnvioProducto);

            onConfirm?.({
                distritoData,
                hasAgency: !!selected.agencia,
                shippingOptions,
                selectedAgency: selected.agencia,
                selectedSede: selected.sede,
                selectedExpress: hasExpress ? selectedExpress : false,
                selectedDirecto: hasDirecto ? selectedDirecto : false,
                productShippingOption: productShippingOption || null, // Agregar esta línea
                expressOption: shippingOptions.find(option => option.tipo === "Envío express") || null, // Agregar esta línea
                directoOption: shippingOptions.find(option => option.tipo === "Envío directo") || null, // Agregar esta línea
                locationData: {
                    nombres: selected.nombres,
                    departamento: selected.departamento,
                    provincia: selected.provincia,
                    distrito: selected.distrito,
                    agencia: selected.agencia,
                    sede: selected.sede
                }    
            });
        }
    }, [selected, isComplete, selectedExpress, selectedDirecto]);

    useEffect(() => {
        localStorage.setItem('express-selected', selectedExpress);
        localStorage.setItem('directo-selected', selectedDirecto);
    }, [selectedExpress, selectedDirecto]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchInputRef.current && 
                !searchInputRef.current.contains(event.target) &&
                searchResultsRef.current && 
                !searchResultsRef.current.contains(event.target)
            ) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (key, value) => {
        setSelected(prev => {
            const newSelection = { ...prev, [key]: value };
            localStorage.setItem(key, value);
            return newSelection;
        });

        if (key === 'departamento') {
            setSelected(prev => ({
                ...prev,
                provincia: '',
                distrito: '',
                agencia: '',
                sede: ''
            }));
            localStorage.removeItem('provincia');
            localStorage.removeItem('distrito');
            localStorage.removeItem('agencia');
            localStorage.removeItem('sede');
            setSearchTerm(value);
        }

        if (key === 'provincia') {
            setSelected(prev => ({
                ...prev,
                distrito: '',
                agencia: '',
                sede: ''
            }));
            localStorage.removeItem('distrito');
            localStorage.removeItem('agencia');
            localStorage.removeItem('sede');
        }

        if (key === 'distrito') {
            setSelected(prev => ({
                ...prev,
                agencia: '',
                sede: ''
            }));
            localStorage.removeItem('agencia');
            localStorage.removeItem('sede');
        }

        if (key === 'agencia') {
            setSelected(prev => ({
                ...prev,
                sede: ''
            }));
            localStorage.removeItem('sede');
        }

        setShowSearchResults(false);
    };

    const filteredDepartamentos = costosEnvioData?.departamentos?.filter(departamento => departamento.departamento.toLowerCase().includes(searchTerm.toLowerCase())) || [];
    const provinciasOptions = departamentoData?.provincias?.map(p => p.provincia) || [];
    const distritosOptions = provinciaData?.distritos?.map(d => d.distrito) || [];
    const agenciasOptions = agencies.map(a => a.agencia);
    const sedesOptions = selectedAgency?.sedes?.map(s => s.sede) || [];

    const calculateShippingOptions = () => {
        const tipoEnvioProducto = productoConEnvio['tipo-de-envio'];
        if (!tipoEnvioProducto) {
            console.warn('Tipo de envío no definido en el producto');
            return [];
        }

        let productShippingCost = null;
        const tieneAgencias = agencies.length > 0;

        if (distritoData) {
            if (tieneAgencias && selected.agencia && selected.sede) {
                const agenciaSeleccionada = agencies.find(a => a.agencia === selected.agencia);
                const sedeSeleccionada = agenciaSeleccionada?.sedes.find(s => s.sede === selected.sede);
                const matchTipoEnvio = sedeSeleccionada?.['tipos-de-envio']?.find(t => t['tipo-de-envio'] === tipoEnvioProducto);
                productShippingCost = matchTipoEnvio ? (matchTipoEnvio.precio || matchTipoEnvio.costos || 0) : 0;
            } else if (!tieneAgencias) {
                const tipoCorrespondiente = distritoData['tipos-de-envio']?.find(t => t['tipo-de-envio'] === tipoEnvioProducto);
                productShippingCost = tipoCorrespondiente 
                    ? (tipoCorrespondiente.precio || tipoCorrespondiente.costos || 0)
                    : tipoEnvioProducto === "Envío preferente" ? 35 
                    : tipoEnvioProducto === "Envío aplicado" ? 70 
                    : 0;
            }
        }

        const envioDirectoObj = distritoData?.['tipos-de-envio']?.find(t => t['tipo-de-envio'] === "Envío directo");
        const envioExpressObj = distritoData?.['tipos-de-envio']?.find(t => t['tipo-de-envio'] === "Envío express");
        const shippingOptions = [];

        if (productShippingCost !== null) {
            shippingOptions.push({ 
                tipo: tipoEnvioProducto, 
                precio: productShippingCost 
            });
        }

        if (envioDirectoObj) {
            shippingOptions.push({ 
                tipo: envioDirectoObj['tipo-de-envio'], 
                precio: envioDirectoObj.precio || envioDirectoObj.costos || 0 
            });
        }

        if (envioExpressObj && tipoEnvioProducto !== "Envío express") {
            shippingOptions.push({ 
                tipo: envioExpressObj['tipo-de-envio'], 
                precio: envioExpressObj.precio || envioExpressObj.costos || 0 
            });
        }

        return shippingOptions;
    };

    // const renderShippingOption = (option, isExpress = false) => {
    //     const isProductShipping = option.tipo === productoConEnvio['tipo-de-envio'];
    //     const isSelected = isExpress ? selectedExpress : selectedDirecto;
    //     const tipoEnvioClassName = option.tipo.toLowerCase().replace(/\s+/g, '-');
    //     const baseClassName = `${tipoEnvioClassName}`;

    //     if (isProductShipping) {
    //         return (
    //             <div className={`shipping-option ${baseClassName} ${isExpress ? 'express' : ''} product-main-shipping`}>
    //                 <div className='info'>
    //                     <p className='tipo-de-envio-name'>{option.tipo}</p>
    //                     <span>{isExpress ? 'Recíbelo hoy' : option.tipo === "Envío directo" ? 'Entrega directa en tu domicilio' : 'A domicilio o agencia'}</span>
    //                 </div>
    //                 <div className='price'>
    //                     <span>S/.</span>
    //                     <p>{option.precio}</p>
    //                 </div>
    //             </div>
    //         );
    //     }

    //     const additionalClassName = isExpress ? 'express' : 'directo';
    //     const inputId = `${isExpress ? 'express' : 'directo'}-shipping`;

    //     return (
    //         <label className={`envios-list-checkbox ${baseClassName} ${additionalClassName}`} htmlFor={inputId}>
    //             <input type="checkbox" 
    //                 id={inputId} 
    //                 checked={isSelected} 
    //                 onChange={(e) => isExpress ? setSelectedExpress(e.target.checked) : setSelectedDirecto(e.target.checked)}
    //             />
    //             <div className='info'>
    //                 <p className='tipo-de-envio-name'>{option.tipo}</p>
    //                 <span>
    //                     {isExpress ? 'Recíbelo hoy' : 'Entrega directa en tu domicilio'}
    //                 </span>
    //             </div>
    //             <div className='price'>
    //                 <span>S/.</span>
    //                 <p>{option.precio}</p>
    //             </div>
    //         </label>
    //     );
    // };

    const renderShippingOption = (option, isExpress = false) => {
        const isProductShipping = option.tipo === productoConEnvio['tipo-de-envio'];
        const isSelected = isExpress ? selectedExpress : selectedDirecto;
        const tipoEnvioClassName = option.tipo.toLowerCase().replace(/\s+/g, '-');
        const baseClassName = `${tipoEnvioClassName}`;
        const activeClass = isSelected ? 'active' : '';

        if (isProductShipping) {
            return (
                <div className={`shipping-option ${baseClassName} ${isExpress ? 'express' : ''} product-main-shipping ${activeClass}`}>
                    <div className='info'>
                        <p className='tipo-de-envio-name'>{option.tipo}</p>
                        <span>{isExpress ? 'Recíbelo hoy' : option.tipo === "Envío directo" ? 'Entrega directa en tu domicilio' : 'A domicilio o agencia'}</span>
                    </div>
                    <div className='price'>
                        <span>S/.</span>
                        <p>{option.precio}</p>
                    </div>
                </div>
            );
        }

        const additionalClassName = isExpress ? 'express' : 'directo';
        const inputId = `${isExpress ? 'express' : 'directo'}-shipping`;

        return (
            <label className={`envios-list-checkbox ${baseClassName} ${additionalClassName} ${activeClass}`} htmlFor={inputId}>
                <input type="checkbox" 
                    id={inputId} 
                    checked={isSelected} 
                    onChange={(e) => isExpress ? setSelectedExpress(e.target.checked) : setSelectedDirecto(e.target.checked)}
                />
                <div className='info'>
                    <p className='tipo-de-envio-name'>{option.tipo}</p>
                    <span>
                        {isExpress ? 'Recíbelo hoy' : 'Entrega directa en tu domicilio'}
                    </span>
                </div>
                <div className='price'>
                    <span>S/.</span>
                    <p>{option.precio}</p>
                </div>
            </label>
        );
    };

    const getShippingMessage = () => {
        const tipoEnvioProducto = productoConEnvio['tipo-de-envio'];
        const isGratis = tipoEnvioProducto === "Gratis";
        const isPreferente = tipoEnvioProducto === "Envío preferente";
        const isAplicado = tipoEnvioProducto === "Envío aplicado";
        const tieneAgencias = agencies.length > 0;
        const isLimaMetropolitana = selected.departamento === "Lima" && selected.provincia === "Lima metropolitana";
        const isCallao = selected.departamento === "Callao" && selected.provincia === "Provincia constitucional del Callao";
        const isSantaRosaDeQuives = selected.distrito?.toLowerCase() === "santa rosa de quives";
        const isDespachoGratisADomicilio = isLimaMetropolitana || isCallao || isSantaRosaDeQuives;

        const shippingOptions = calculateShippingOptions();

        if (shippingOptions.length === 0) {
            return null;
        }

        const productShippingOption = shippingOptions.find(option => option.tipo === tipoEnvioProducto);
        const expressOption = shippingOptions.find(option => option.tipo === "Envío express");
        const directoOption = shippingOptions.find(option => option.tipo === "Envío directo");

        if (isGratis) {
            if (isDespachoGratisADomicilio) {
                return (
                    <>
                        <p className='product-page-envio-gratis'>🎉 Despacho gratis a domicilio</p>
                        <div className="additional-shipping-options">
                            {expressOption && renderShippingOption(expressOption, true)}
                            {directoOption && renderShippingOption(directoOption)}
                        </div>
                    </>
                );
            } else {
                return(
                    <>
                        <p className='product-page-envio-gratis'>Embalaje y traslado a la agencia gratis</p>
                        <div className="additional-shipping-options">
                            {expressOption && renderShippingOption(expressOption, true)}
                            {directoOption && renderShippingOption(directoOption)}
                        </div>
                    </>
                );
            }
        } else if (isPreferente || isAplicado) {
            return(
                <>
                    <div className="product-main-shipping-container">
                        {productShippingOption && renderShippingOption(productShippingOption)}
                    </div>
                    <div className="additional-shipping-options">
                        {expressOption && renderShippingOption(expressOption, true)}
                        {directoOption && renderShippingOption(directoOption)}
                    </div>
                </>
            );
        }
        return null;
    };

    const handleEditLocation = () => {
        setSelected(prev => ({
            ...prev,
            departamento: '',
            provincia: '',
            distrito: '',
            agencia: '',
            sede: ''
        }));
        setSearchTerm('');
        localStorage.removeItem('departamento');
        localStorage.removeItem('provincia');
        localStorage.removeItem('distrito');
        localStorage.removeItem('agencia');
        localStorage.removeItem('sede');
    };

    const shippingOptions = calculateShippingOptions();
    const hasExpress = shippingOptions.some(option => option.tipo === "Envío express");
    const hasDirecto = shippingOptions.some(option => option.tipo === "Envío directo");

    if (isComplete && shippingOptions.length === 0) {
        return null;
    }

    return(
        <div className="product-page-envios">
            <p className='title uppercase color-color-1 margin-bottom-5 d-flex-center-left'>Datos de envío</p>

            <div className='product-page-envios-name'>
                <span className="material-icons">person</span>
                <p>Nombres</p>
                <input type="text" placeholder="Ingresa tus nombres" value={selected.nombres} onChange={(e) => handleInputChange('nombres', e.target.value)}/>
            </div>

            {(selected.departamento || selected.provincia || selected.distrito) && (
                <ul className="location-summary">
                    {selected.departamento && (
                        <li>
                            <span className="material-symbols-outlined">check_small</span>
                            <div>
                                <p className='text'>Departamento:</p>
                                <b>{selected.departamento}</b>
                            </div>
                        </li>
                    )}
                    {selected.provincia && (
                        <li>
                            <span className="material-symbols-outlined">check_small</span>
                            <div>
                                <p className='text'>Provincia:</p>
                                <b>{selected.provincia}</b>
                            </div>
                        </li>
                    )}
                    {selected.distrito && (
                        <li>
                            <span className="material-symbols-outlined">check_small</span>
                            <div>
                                <p className='text'>Distrito:</p>
                                <b>{selected.distrito}</b>
                            </div>
                        </li>
                    )}
                    {selected.agencia && (
                        <li>
                            <span className="material-symbols-outlined">check_small</span>
                            <div>
                                <p className='text'>Agencia:</p>
                                <b>{selected.agencia}</b>
                            </div>
                        </li>
                    )}
                    {selected.sede && (
                        <li>
                            <span className="material-symbols-outlined">check_small</span>
                            <div>
                                <p className='text'>Sede:</p>
                                <b>{selected.sede}</b>
                            </div>
                        </li>
                    )}
                </ul>
            )}

            {!selected.departamento && (
                <div className="search-departamento">
                    <span className="material-icons">location_on</span>
                    <p>Departamento</p>
                    <div className="search-input-container" ref={searchInputRef}>
                        <input type="text" placeholder="Buscar departamento" value={searchTerm}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchTerm(value);
                                setShowSearchResults(true);
                            }}
                            onFocus={() => setShowSearchResults(true)}
                        />
                        
                        {showSearchResults && filteredDepartamentos.length > 0 && (
                            <div className="search-results" ref={searchResultsRef}>
                                {filteredDepartamentos.map((departamento, idx) => (
                                    <div key={idx} className="search-result-item"
                                        onClick={() => {
                                            handleInputChange('departamento', departamento.departamento);
                                            setShowSearchResults(false);
                                        }}
                                    >
                                        {departamento.departamento}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selected.departamento && !selected.provincia && (
                <div className="select-group">
                    <label>Provincia</label>
                    <select value={selected.provincia} onChange={(e) => handleInputChange('provincia', e.target.value)}>
                        <option value="">-- Selecciona provincia --</option>
                        {provinciasOptions.map((provincia, idx) => (
                            <option key={idx} value={provincia}>{provincia}</option>
                        ))}
                    </select>
                </div>
            )}

            {selected.provincia && !selected.distrito && (
                <div className="select-group">
                    <label>Distrito</label>
                    <select value={selected.distrito} onChange={(e) => handleInputChange('distrito', e.target.value)}>
                        <option value="">-- Selecciona distrito --</option>
                        {distritosOptions.map((distrito, idx) => (
                            <option key={idx} value={distrito}>{distrito}</option>
                        ))}
                    </select>
                </div>
            )}

            {selected.distrito && !selected.agencia && !provinciaSinAgencia && !noAgencias && (
                <div className="select-group">
                    <label>Agencia</label>
                    <select value={selected.agencia} onChange={(e) => handleInputChange('agencia', e.target.value)}>
                        <option value="">-- Selecciona agencia --</option>
                        {agenciasOptions.map((agencia, idx) => (
                            <option key={idx} value={agencia}>{agencia}</option>
                        ))}
                    </select>
                </div>
            )}

            {selected.agencia && !selected.sede && (
                <div className="select-group">
                    <label>Sede</label>
                    <select value={selected.sede} onChange={(e) => handleInputChange('sede', e.target.value)}>
                        <option value="">-- Selecciona sede --</option>
                        {sedesOptions.map((sede, idx) => (
                            <option key={idx} value={sede}>{sede}</option>
                        ))}
                    </select>
                </div>
            )}

            {selected.distrito && noAgencias && !provinciaSinAgencia && (
                <div className="message message-warning">
                    <span className="material-icons">warning</span>
                    <p>No contamos con agencias recomendadas para el distrito seleccionado.</p>
                    <p>El precio mostrado es referencial.</p>
                </div>
            )}

            <div className="shipping-message-container">{getShippingMessage()}</div>

            {(selected.departamento || selected.provincia || selected.distrito) && (
                <button type="button" className="product-page-change-location" onClick={handleEditLocation}>
                    <span className="material-icons">edit_location_alt</span>
                    <p className='text'>Cambiar ubicación</p>
                </button>
            )}
        </div>
    );
}

export default Envios;
