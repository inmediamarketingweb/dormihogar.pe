import { useState, useEffect, useRef } from 'react';
import { useLocation } from '../../../../Hooks/useLocation';
import './Envios.css';

const initialCheckboxValues = {
    express: localStorage.getItem('express-selected') === 'true',
    directo: localStorage.getItem('directo-selected') === 'true'
};

function Envios({ producto, onConfirm }) {
    const { location, updateLocation } = useLocation();
    
    const productoConEnvio = producto ? {
        ...producto,
        'tipo-de-envio': producto['tipo-de-envio'] || 'Gratis'
    } : { 'tipo-de-envio': 'Gratis' };

    const [costosEnvioData, setCostosEnvioData] = useState(null);
    const [selected, setSelected] = useState({
        nombres: location.nombres || localStorage.getItem('nombres') || '',
        departamento: location.departamento || '',
        provincia: location.provincia || '',
        distrito: location.distrito || '',
        agencia: location.agencia || localStorage.getItem('agencia') || '',
        sede: location.sede || localStorage.getItem('sede') || ''
    });
    const [showDepartamentoResults, setShowDepartamentoResults] = useState(false);
    const [showProvinciaResults, setShowProvinciaResults] = useState(false);
    const [showDistritoResults, setShowDistritoResults] = useState(false);
    const [showAgenciaResults, setShowAgenciaResults] = useState(false);
    const [showSedeResults, setShowSedeResults] = useState(false);
    const [selectedExpress, setSelectedExpress] = useState(initialCheckboxValues.express);
    const [selectedDirecto, setSelectedDirecto] = useState(initialCheckboxValues.directo);
    const [selectedShippingType, setSelectedShippingType] = useState(null);
    const searchResultsRef = useRef(null);
    
    // Sincronizar con el hook cuando cambia la ubicación
    useEffect(() => {
        setSelected(prev => ({
            ...prev,
            departamento: location.departamento || '',
            provincia: location.provincia || '',
            distrito: location.distrito || '',
            nombres: location.nombres || prev.nombres
        }));
    }, [location.departamento, location.provincia, location.distrito, location.nombres]);

    const departamentoData = costosEnvioData?.departamentos.find(d => d.departamento === selected.departamento);
    const provinciaData = departamentoData?.provincias.find(p => p.provincia === selected.provincia);
    const distritoData = provinciaData?.distritos.find(d => d.distrito === selected.distrito);
    const agencies = distritoData?.['agencias-recomendadas'] || [];
    const selectedAgency = agencies.find(a => a.agencia === selected.agencia);
    const provinciaSinAgencia = ['Lima metropolitana', 'Provincia constitucional del Callao'].includes(selected.provincia);
    const noAgencias = agencies.length === 0;
    
    // Verificar si el distrito no tiene agencias y limpiar localStorage si es necesario
    useEffect(() => {
        if (selected.distrito && noAgencias && !provinciaSinAgencia) {
            if (selected.agencia || selected.sede) {
                setSelected(prev => ({
                    ...prev,
                    agencia: '',
                    sede: ''
                }));
                localStorage.removeItem('agencia');
                localStorage.removeItem('sede');
            }
        }
    }, [selected.distrito, noAgencias, provinciaSinAgencia]);

    const isComplete = selected.departamento && selected.provincia && selected.distrito && (provinciaSinAgencia || noAgencias || (selected.agencia && selected.sede));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/assets/json/costos-de-envio.json');
                setCostosEnvioData(await response.json());
            } catch (error) {
                console.error('Error al cargar JSON de costos de envío:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (isComplete) {
            const shippingOptions = calculateShippingOptions();
            const hasExpress = shippingOptions.some(option => option.tipo === "Envío express");
            const hasDirecto = shippingOptions.some(option => option.tipo === "Envío directo");
            const tipoEnvioProducto = productoConEnvio['tipo-de-envio'];
            const productShippingOption = shippingOptions.find(option => option.tipo === tipoEnvioProducto);

            // Si solo hay una opción de envío, seleccionarla automáticamente
            if (shippingOptions.length === 1 && !selectedShippingType) {
                setSelectedShippingType(shippingOptions[0].tipo);
            }

            onConfirm?.({
                distritoData,
                hasAgency: !!selected.agencia,
                shippingOptions,
                selectedAgency: selected.agencia,
                selectedSede: selected.sede,
                selectedExpress: hasExpress ? selectedExpress : false,
                selectedDirecto: hasDirecto ? selectedDirecto : false,
                productShippingOption: productShippingOption || null,
                expressOption: shippingOptions.find(option => option.tipo === "Envío express") || null,
                directoOption: shippingOptions.find(option => option.tipo === "Envío directo") || null,
                selectedShippingType: selectedShippingType,
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
    }, [selected, isComplete, selectedExpress, selectedDirecto, selectedShippingType]);

    useEffect(() => {
        localStorage.setItem('express-selected', selectedExpress);
        localStorage.setItem('directo-selected', selectedDirecto);
    }, [selectedExpress, selectedDirecto]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchResultsRef.current &&
                !searchResultsRef.current.contains(event.target)
            ) {
                setShowDepartamentoResults(false);
                setShowProvinciaResults(false);
                setShowDistritoResults(false);
                setShowAgenciaResults(false);
                setShowSedeResults(false);
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
            // Usar updateLocation para departamento, provincia y distrito
            if (['departamento', 'provincia', 'distrito'].includes(key)) {
                updateLocation(key, value);
            } else {
                localStorage.setItem(key, value);
            }
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
            setShowDepartamentoResults(false);
            setSelectedShippingType(null);
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
            setShowProvinciaResults(false);
            setSelectedShippingType(null);
        }

        if (key === 'distrito') {
            setSelected(prev => {
                const nuevoDistritoData = provinciaData?.distritos.find(d => d.distrito === value);
                const nuevasAgencias = nuevoDistritoData?.['agencias-recomendadas'] || [];
                const noAgenciasNuevoDistrito = nuevasAgencias.length === 0;
                const provinciaSinAgenciaNuevo = ['Lima metropolitana', 'Provincia constitucional del Callao'].includes(selected.provincia);
                
                if (noAgenciasNuevoDistrito && !provinciaSinAgenciaNuevo) {
                    localStorage.removeItem('agencia');
                    localStorage.removeItem('sede');
                    return {
                        ...prev,
                        distrito: value,
                        agencia: '',
                        sede: ''
                    };
                }
                
                return {
                    ...prev,
                    distrito: value,
                    agencia: '',
                    sede: ''
                };
            });
            localStorage.setItem('distrito', value);
            localStorage.removeItem('agencia');
            localStorage.removeItem('sede');
            setShowDistritoResults(false);
            setSelectedShippingType(null);
        }

        if (key === 'agencia') {
            setSelected(prev => ({
                ...prev,
                sede: ''
            }));
            localStorage.removeItem('sede');
            setShowAgenciaResults(false);
            setSelectedShippingType(null);
        }

        if (key === 'sede') {
            setShowSedeResults(false);
            setSelectedShippingType(null);
        }
    };

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

    const renderShippingOptionButton = (option, isSingleOption) => {
        const tipoEnvio = option.tipo;
        const isExpress = tipoEnvio === "Envío express";
        const isDirecto = tipoEnvio === "Envío directo";
        const isGratis = tipoEnvio === "Gratis";
        const isPreferente = tipoEnvio === "Envío preferente";
        const isAplicado = tipoEnvio === "Envío aplicado";

        let className = 'p-pg-envios-button';
        let icon = 'house';
        let title = 'Entrega a domicilio';
        let subtitle = 'A la puerta de tu casa';

        if (isGratis) {
            className += ' gratis';
            icon = 'house';
            title = 'Entrega a domicilio';
            subtitle = 'A la puerta de tu casa';
        } else if (isPreferente) {
            className += ' envio-preferente';
            icon = 'house';
            title = 'Entrega a domicilio';
            subtitle = 'A la puerta de tu casa';
        } else if (isAplicado) {
            className += ' envio-aplicado';
            icon = 'house';
            title = 'Entrega a domicilio';
            subtitle = 'A la puerta de tu casa';
        } else if (isExpress) {
            className += ' envio-express';
            icon = 'delivery_truck_speed';
            title = 'Entrega express';
            subtitle = 'Elige el día y la hora';
        } else if (isDirecto) {
            className += ' envio-directo';
            icon = 'pin_road';
            title = 'Despacho directo';
            subtitle = 'A provincia sin agencias';
        }

        // Si es una sola opción, debe estar seleccionada siempre
        const isSelected = isSingleOption ? true : selectedShippingType === tipoEnvio;

        return (
            <button
                key={tipoEnvio}
                type="button"
                className={`${className} ${isSelected ? 'active' : ''}`}
                onClick={() => {
                    if (!isSingleOption) {
                        setSelectedShippingType(tipoEnvio);
                        if (isExpress) {
                            setSelectedExpress(!selectedExpress);
                        } else if (isDirecto) {
                            setSelectedDirecto(!selectedDirecto);
                        }
                    }
                }}
            >
                <input
                    type="radio"
                    checked={isSelected}
                    readOnly
                />

                <span className="material-symbols-outlined">{icon}</span>

                {!isGratis && !isPreferente && !isAplicado && (
                    <b className="tag">{tipoEnvio.replace('Envío ', '')}</b>
                )}

                {isGratis && (
                    <b className="tag">Gratis</b>
                )}

                {isPreferente && (
                    <b className="tag">Preferente</b>
                )}

                {isAplicado && (
                    <b className="tag">Aplicado</b>
                )}

                <div className="p-pg-envios-data">
                    <div>
                        <p className="title text">{title}</p>
                        <p className="text">{subtitle}</p>
                    </div>

                    {option.precio > 0 && (
                        <p className="pryce">S/.{option.precio}</p>
                    )}
                </div>
            </button>
        );
    };

    const getShippingMessage = () => {
        const tipoEnvioProducto = productoConEnvio['tipo-de-envio'];
        const shippingOptions = calculateShippingOptions();
        const productShippingOption = shippingOptions.find(option => option.tipo === tipoEnvioProducto);
        
        if (shippingOptions.length === 0) return null;

        // Verificar si el distrito tiene agencias Y despacho directo
        const tieneAgencias = agencies.length > 0;
        const tieneDespachoDirecto = distritoData?.['tipos-de-envio']?.some(t => t['tipo-de-envio'] === "Envío directo");
        const tieneAmbasOpciones = tieneAgencias && tieneDespachoDirecto;

        // ===== CASO ESPECIAL: DISTRITO CON AMBAS OPCIONES (AGENCIA + DIRECTO) =====
        if (tieneAmbasOpciones && selected.agencia && selected.sede) {
            // Buscar el envío preferente/aplicado de la agencia seleccionada
            const agenciaSeleccionada = agencies.find(a => a.agencia === selected.agencia);
            const sedeSeleccionada = agenciaSeleccionada?.sedes.find(s => s.sede === selected.sede);
            const envioPorAgencia = sedeSeleccionada?.['tipos-de-envio']?.find(t => t['tipo-de-envio'] === tipoEnvioProducto);
            
            // Buscar el envío directo del distrito
            const envioDirecto = distritoData['tipos-de-envio']?.find(t => t['tipo-de-envio'] === "Envío directo");

            // Crear las opciones para mostrarlas juntas
            const opciones = [
                {
                    tipo: tipoEnvioProducto,
                    className: tipoEnvioProducto === "Gratis" ? 'gratis' :
                               tipoEnvioProducto === "Envío preferente" ? 'envio-preferente' :
                               tipoEnvioProducto === "Envío aplicado" ? 'envio-aplicado' :
                               tipoEnvioProducto === "Envío express" ? 'envio-express' : 'envio-directo',
                    nombre: tipoEnvioProducto === "Gratis" ? 'Gratis hasta la agencia' :
                            tipoEnvioProducto === "Envío preferente" ? 'Preferente hasta la agencia' :
                            tipoEnvioProducto === "Envío aplicado" ? 'Aplicado hasta la agencia' :
                            tipoEnvioProducto === "Envío express" ? 'Express' : tipoEnvioProducto,
                    icon: tipoEnvioProducto === "Envío express" ? 'delivery_truck_speed' : 'local_shipping',
                    precio: envioPorAgencia?.precio || 0,
                    title: 'Envío por agencia',
                    subtitle: 'Embalaje y traslado',
                    tipoReal: tipoEnvioProducto
                },
                {
                    tipo: "Envío directo",
                    className: 'envio-directo',
                    nombre: 'Directo',
                    icon: 'pin_road',
                    precio: envioDirecto?.precio || 0,
                    title: 'Despacho directo',
                    subtitle: 'A provincia sin agencias',
                    tipoReal: 'Envío directo'
                }
            ];

            // Si solo hay una opción válida
            const opcionesValidas = opciones.filter(opt => opt.precio !== undefined);
            const isSingleOption = opcionesValidas.length === 1;

            return (
                <div className="p-pg-envios-message">
                    {opciones.map((opcion, index) => {
                        const isSelected = isSingleOption ? true : selectedShippingType === opcion.tipoReal;
                        
                        return (
                            <button 
                                key={index}
                                type='button' 
                                className={`p-pg-envios-button ${opcion.className} ${isSelected ? 'active' : ''}`}
                                onClick={() => {
                                    if (!isSingleOption) {
                                        setSelectedShippingType(opcion.tipoReal);
                                    }
                                }}
                            >
                                <input type='radio' checked={isSelected} readOnly />
                                <span className="material-symbols-outlined">{opcion.icon}</span>
                                <b className='tag'>{opcion.nombre}</b>
                                <div className='p-pg-envios-data'>
                                    <div>
                                        <p className='title text'>{opcion.title}</p>
                                        <p className='text'>{opcion.subtitle}</p>
                                    </div>
                                    {opcion.precio > 0 && (
                                        <p className='pryce'>S/.{opcion.precio}</p>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            );
        }

        // ===== PARA DISTRITOS CON DESPACHO DIRECTO (SIN AGENCIAS) =====
        const noAgencias = agencies.length === 0;
        const isDespachoDirecto = noAgencias && !provinciaSinAgencia;

        if (isDespachoDirecto && productShippingOption) {
            let tipoMostrado = '';
            let claseCSS = '';
            
            if (tipoEnvioProducto === "Gratis") {
                tipoMostrado = 'Gratis hasta la agencia';
                claseCSS = 'gratis';
            } else if (tipoEnvioProducto === "Envío preferente") {
                tipoMostrado = 'Preferente hasta la agencia';
                claseCSS = 'envio-preferente';
            } else if (tipoEnvioProducto === "Envío aplicado") {
                tipoMostrado = 'Aplicado hasta la agencia';
                claseCSS = 'envio-aplicado';
            } else {
                tipoMostrado = tipoEnvioProducto.replace('Envío ', '');
                claseCSS = tipoEnvioProducto === "Envío express" ? 'envio-express' : 'envio-directo';
            }

            // Solo una opción, debe estar seleccionada
            if (!selectedShippingType) {
                setSelectedShippingType(tipoEnvioProducto);
            }

            return (
                <button type='button' className={`p-pg-envios-button ${claseCSS} active`}>
                    <input type='radio' checked readOnly />
                    <span className="material-symbols-outlined">
                        {tipoEnvioProducto === "Envío express" ? 'delivery_truck_speed' : 'local_shipping'}
                    </span>
                    <b className='tag'>{tipoMostrado}</b>
                    <div className='p-pg-envios-data'>
                        <div>
                            <p className='title text'>Envío por agencia</p>
                            <p className='text'>Embalaje gratis {tipoEnvioProducto === "Gratis" ? 'gratis' : ''}</p>
                        </div>
                        {productShippingOption.precio > 0 && (
                            <p className='pryce'>S/.{productShippingOption.precio}</p>
                        )}
                    </div>
                </button>
            );
        }

        // ===== PARA DISTRITOS CON AGENCIAS (SIN DESPACHO DIRECTO) =====
        // Verificar cuántas opciones de envío hay disponibles
        const opcionesDisponibles = shippingOptions.filter(opt => opt.precio !== undefined);
        const isSingleOption = opcionesDisponibles.length === 1;

        if (tipoEnvioProducto === "Gratis" && productShippingOption) {
            const isLimaMetropolitana = selected.departamento === "Lima" && selected.provincia === "Lima metropolitana";
            const isCallao = selected.departamento === "Callao" && selected.provincia === "Provincia constitucional del Callao";
            const isSantaRosaDeQuives = selected.distrito?.toLowerCase() === "santa rosa de quives";
            const isDespachoGratisADomicilio = isLimaMetropolitana || isCallao || isSantaRosaDeQuives;

            if (isDespachoGratisADomicilio) {
                if (!selectedShippingType) {
                    setSelectedShippingType(tipoEnvioProducto);
                }
                // Solo una opción, seleccionada por defecto
                return (
                    <button type='button' className='p-pg-envios-button gratis active'>
                        <input type='radio' checked readOnly />
                        <span className="material-symbols-outlined">house</span>
                        <b className='tag'>Gratis</b>
                        <div className='p-pg-envios-data'>
                            <div>
                                <p className='title text'>Entrega a domicilio</p>
                                <p className='text'>A la puerta de tu casa</p>
                            </div>
                        </div>
                    </button>
                );
            } else if (selected.agencia && selected.sede) {
                if (!selectedShippingType) {
                    setSelectedShippingType(tipoEnvioProducto);
                }
                // Solo una opción, seleccionada por defecto
                return (
                    <button type='button' className='p-pg-envios-button gratis active'>
                        <input type='radio' checked readOnly />
                        <span className="material-symbols-outlined">local_shipping</span>
                        <b className='tag'>Gratis hasta la agencia</b>
                        <div className='p-pg-envios-data'>
                            <div>
                                <p className='title text'>Envío por agencia</p>
                                <p className='text'>Embalaje y traslado gratis</p>
                            </div>
                        </div>
                    </button>
                );
            }
        }

        // ===== PARA PREFERENTE Y APLICADO CON AGENCIAS (SIN DIRECTO) =====
        if ((tipoEnvioProducto === "Envío preferente" || tipoEnvioProducto === "Envío aplicado") && productShippingOption) {
            const esPreferente = tipoEnvioProducto === "Envío preferente";
            const claseCSS = esPreferente ? 'envio-preferente' : 'envio-aplicado';
            const tagTexto = esPreferente ? 'Preferente' : 'Aplicado';
            let textoAdicional = 'A la puerta de tu casa';
            let icono = 'house';

            if (selected.agencia && selected.sede) {
                textoAdicional = 'Embalaje y traslado';
                icono = 'local_shipping';
            }

            if (!selectedShippingType) {
                setSelectedShippingType(tipoEnvioProducto);
            }

            // Solo una opción, seleccionada por defecto
            return (
                <button type='button' className={`p-pg-envios-button ${claseCSS} active`}>
                    <input type='radio' checked readOnly />
                    <span className="material-symbols-outlined">{icono}</span>
                    <b className='tag'>{tagTexto}</b>
                    <div className='p-pg-envios-data'>
                        <div>
                            <p className='title text'>Entrega a domicilio</p>
                            <p className='text'>{textoAdicional}</p>
                        </div>
                        <p className='pryce'>S/.{productShippingOption.precio}</p>
                    </div>
                </button>
            );
        }

        // ===== PARA EXPRESS Y DIRECTO =====
        if (productShippingOption) {
            const isExpress = tipoEnvioProducto === "Envío express";
            const isDirecto = tipoEnvioProducto === "Envío directo";
            const claseCSS = isExpress ? 'envio-express' : 'envio-directo';
            const icono = isExpress ? 'delivery_truck_speed' : 'pin_road';
            const titulo = isExpress ? 'Entrega express' : 'Despacho directo';
            const subtitulo = isExpress ? 'Elige el día y la hora' : 'A provincia sin agencias';

            if (!selectedShippingType) {
                setSelectedShippingType(tipoEnvioProducto);
            }

            // Solo una opción, seleccionada por defecto
            return (
                <button type='button' className={`p-pg-envios-button ${claseCSS} active`}>
                    <input type='radio' checked readOnly />
                    <span className="material-symbols-outlined">{icono}</span>
                    <b className='tag'>{isExpress ? 'Express' : 'Directo'}</b>
                    <div className='p-pg-envios-data'>
                        <div>
                            <p className='title text'>{titulo}</p>
                            <p className='text'>{subtitulo}</p>
                        </div>
                        {productShippingOption.precio > 0 && (
                            <p className='pryce'>S/.{productShippingOption.precio}</p>
                        )}
                    </div>
                </button>
            );
        }

        // Fallback: mostrar todas las opciones disponibles con la lógica de selección
        const opciones = shippingOptions.filter(opt => opt.precio !== undefined);
        const esUnaSolaOpcion = opciones.length === 1;

        return (
            <div className="p-pg-envios-message">
                {opciones.map(option => renderShippingOptionButton(option, esUnaSolaOpcion))}
            </div>
        );
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
        localStorage.removeItem('departamento');
        localStorage.removeItem('provincia');
        localStorage.removeItem('distrito');
        localStorage.removeItem('agencia');
        localStorage.removeItem('sede');
        setSelectedShippingType(null);
        // Limpiar también en el hook
        updateLocation('departamento', '');
        updateLocation('provincia', '');
        updateLocation('distrito', '');
    };

    const shippingOptions = calculateShippingOptions();
    const hasExpress = shippingOptions.some(option => option.tipo === "Envío express");
    const hasDirecto = shippingOptions.some(option => option.tipo === "Envío directo");

    if (isComplete && shippingOptions.length === 0) {
        return null;
    }

    return (
        <div className="p-pg-envios">
            <div className="d-flex-center-left gap-3">
                <span className="material-symbols-outlined">location_on</span>
                <p className="tag-title tag-title-1">Opciones de entrega</p>
            </div>

            <div className="product-page-envios-name">
                <span className="material-icons">person</span>
                <p>Nombres</p>
                <input
                    type="text"
                    placeholder="Ingresa tus nombres"
                    value={selected.nombres}
                    onChange={(e) => handleInputChange('nombres', e.target.value)}
                />
            </div>

            {!selected.departamento && (
                <div className="search-tag search-departamento">
                    <p className='tag-title'>Departamento</p>

                    <div className="search-input-container">
                        <button 
                            type='button' 
                            className='p-pg-btn-select'
                            onClick={() => setShowDepartamentoResults(!showDepartamentoResults)}
                        >
                            <p className='text'>Seleccionar departamento</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </button>

                        {showDepartamentoResults && costosEnvioData?.departamentos && (
                            <div className="search-results" ref={searchResultsRef}>
                                {costosEnvioData.departamentos.map((departamento, idx) => (
                                    <ul key={idx}>
                                        <li
                                            className="search-result-item"
                                            onClick={() => {
                                                handleInputChange('departamento', departamento.departamento);
                                                setShowDepartamentoResults(false);
                                            }}
                                        >
                                            <button type='button'>
                                                <p className='text'>{departamento.departamento}</p>
                                            </button>
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selected.departamento && !selected.provincia && (
                <div className="select-group">
                    <label>Provincia</label>
                    <div className="search-input-container">
                        <button 
                            type='button' 
                            className='p-pg-btn-select'
                            onClick={() => setShowProvinciaResults(!showProvinciaResults)}
                        >
                            <p className='text'>Seleccionar provincia</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </button>
                        
                        {showProvinciaResults && provinciasOptions.length > 0 && (
                            <div className="search-results" ref={searchResultsRef}>
                                {provinciasOptions.map((provincia, idx) => (
                                    <ul key={idx}>
                                        <li
                                            className="search-result-item"
                                            onClick={() => {
                                                handleInputChange('provincia', provincia);
                                                setShowProvinciaResults(false);
                                            }}
                                        >
                                            <button type='button'>
                                                <p className='text'>{provincia}</p>
                                            </button>
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selected.provincia && !selected.distrito && (
                <div className="select-group">
                    <label>Distrito</label>
                    <div className="search-input-container">
                        <button 
                            type='button' 
                            className='p-pg-btn-select'
                            onClick={() => setShowDistritoResults(!showDistritoResults)}
                        >
                            <p className='text'>Seleccionar distrito</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </button>
                        
                        {showDistritoResults && distritosOptions.length > 0 && (
                            <div className="search-results" ref={searchResultsRef}>
                                {distritosOptions.map((distrito, idx) => (
                                    <ul key={idx}>
                                        <li
                                            className="search-result-item"
                                            onClick={() => {
                                                handleInputChange('distrito', distrito);
                                                setShowDistritoResults(false);
                                            }}
                                        >
                                            <button type='button'>
                                                <p className='text'>{distrito}</p>
                                            </button>
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selected.distrito && !selected.agencia && !provinciaSinAgencia && !noAgencias && (
                <div className="select-group">
                    <label>Agencia</label>
                    <div className="search-input-container">
                        <button 
                            type='button' 
                            className='p-pg-btn-select'
                            onClick={() => setShowAgenciaResults(!showAgenciaResults)}
                        >
                            <p className='text'>Seleccionar agencia</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </button>
                        
                        {showAgenciaResults && agenciasOptions.length > 0 && (
                            <div className="search-results" ref={searchResultsRef}>
                                {agenciasOptions.map((agencia, idx) => (
                                    <ul key={idx}>
                                        <li
                                            className="search-result-item"
                                            onClick={() => {
                                                handleInputChange('agencia', agencia);
                                                setShowAgenciaResults(false);
                                            }}
                                        >
                                            <button type='button'>
                                                <p className='text'>{agencia}</p>
                                            </button>
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selected.agencia && !selected.sede && (
                <div className="select-group">
                    <label>Sede</label>
                    <div className="search-input-container">
                        <button 
                            type='button' 
                            className='p-pg-btn-select'
                            onClick={() => setShowSedeResults(!showSedeResults)}
                        >
                            <p className='text'>Seleccionar sede</p>
                            <span className="material-symbols-outlined">keyboard_arrow_down</span>
                        </button>
                        
                        {showSedeResults && sedesOptions.length > 0 && (
                            <div className="search-results" ref={searchResultsRef}>
                                {sedesOptions.map((sede, idx) => (
                                    <ul key={idx}>
                                        <li
                                            className="search-result-item"
                                            onClick={() => {
                                                handleInputChange('sede', sede);
                                                setShowSedeResults(false);
                                            }}
                                        >
                                            <button type='button'>
                                                <p className='text'>{sede}</p>
                                            </button>
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(selected.departamento || selected.provincia || selected.distrito) && (
                <>
                    <ul className="p-pg-envios-results-local-storage">
                        {selected.departamento && (
                            <li>
                                <span className="material-symbols-outlined">check_small</span>
                                <b className="text font-bold">Departamento:</b>
                                <p className="text">{selected.departamento}</p>
                            </li>
                        )}
                        {selected.provincia && (
                            <li>
                                <span className="material-symbols-outlined">check_small</span>
                                <b className="text font-bold">Provincia:</b>
                                <p className="text">{selected.provincia}</p>
                            </li>
                        )}
                        {selected.distrito && (
                            <li>
                                <span className="material-symbols-outlined">check_small</span>
                                <b className="text font-bold">Distrito:</b>
                                <p className="text">{selected.distrito}</p>
                            </li>
                        )}
                        {selected.agencia && (
                            <li>
                                <span className="material-symbols-outlined">check_small</span>
                                <b className="text font-bold">Agencia:</b>
                                <p className="text">{selected.agencia}</p>
                            </li>
                        )}
                        {selected.sede && (
                            <li>
                                <span className="material-symbols-outlined">check_small</span>
                                <b className="text font-bold">Sede:</b>
                                <p className="text">{selected.sede}</p>
                            </li>
                        )}
                    </ul>

                    <button
                        type="button"
                        className="button-link button-link-3 margin-right change-location"
                        onClick={handleEditLocation}
                    >
                        <span className="material-symbols-outlined">edit</span>
                        <p className="button-link-text">Cambiar ubicación</p>
                    </button>

                    <div className="shipping-message-container">{getShippingMessage()}</div>
                </>
            )}

            {selected.distrito && noAgencias && !provinciaSinAgencia && (
                <div className="message message-warning">
                    <span className="material-icons">warning</span>
                    <p>No contamos con agencias recomendadas para el distrito seleccionado.</p>
                    <p>El precio mostrado es referencial.</p>
                </div>
            )}
        </div>
    );
}

export default Envios;
