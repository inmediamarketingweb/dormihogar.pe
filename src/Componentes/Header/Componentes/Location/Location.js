// // // import React, { useState, useEffect, useRef } from 'react';

// // // import './Location.css';

// // // function Location({ onOpenModal, isModalOpen, onCloseModal }) { // Recibir props
// // //     const [isLoading, setIsLoading] = useState(true);
// // //     const [error, setError] = useState(null);
// // //     const [departamentos, setDepartamentos] = useState([]);
// // //     const [departmentInput, setDepartmentInput] = useState('');
// // //     const [provinceInput, setProvinceInput] = useState('');
// // //     const [districtInput, setDistrictInput] = useState('');
// // //     const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
// // //     const [filteredProvincias, setFilteredProvincias] = useState([]);
// // //     const [filteredDistritos, setFilteredDistritos] = useState([]);
// // //     const [showDepartmentResults, setShowDepartmentResults] = useState(false);
// // //     const [showProvinceResults, setShowProvinceResults] = useState(false);
// // //     const [showDistrictResults, setShowDistrictResults] = useState(false);
// // //     const [selectedDepartment, setSelectedDepartment] = useState(() => {
// // //         return localStorage.getItem('departamento') || '';
// // //     });
// // //     const [selectedProvince, setSelectedProvince] = useState(() => {
// // //         return localStorage.getItem('provincia') || '';
// // //     });
// // //     const [selectedDistrict, setSelectedDistrict] = useState(() => {
// // //         return localStorage.getItem('distrito') || '';
// // //     });

// // //     const departmentInputRef = useRef(null);
// // //     const provinceInputRef = useRef(null);
// // //     const districtInputRef = useRef(null);
// // //     const departmentResultsRef = useRef(null);
// // //     const provinceResultsRef = useRef(null);
// // //     const districtResultsRef = useRef(null);
// // //     const [departamentosData, setDepartamentosData] = useState([]);
// // //     const [provinciasData, setProvinciasData] = useState([]);
// // //     const [distritosData, setDistritosData] = useState([]);
// // //     const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);

// // //     useEffect(() => {
// // //         const fetchData = async () => {
// // //             try {
// // //                 setIsLoading(true);
// // //                 setError(null);

// // //                 const response = await fetch('/assets/json/costos-de-envio.json');

// // //                 if (!response.ok) {
// // //                     throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
// // //                 }

// // //                 const data = await response.json();

// // //                 if (data && data.departamentos) {
// // //                     setDepartamentos(data.departamentos);
// // //                     const depts = data.departamentos.map(d => d.departamento);
// // //                     setDepartamentosData(depts);
// // //                     setFilteredDepartamentos(depts);
// // //                 } else {
// // //                     throw new Error('La estructura del JSON no es la esperada');
// // //                 }

// // //                 setIsLoading(false);
// // //             } catch (err) {
// // //                 console.error('Error al cargar los datos de ubicación:', err);
// // //                 setError('No se pudieron cargar las ubicaciones. Por favor, intenta de nuevo.');
// // //                 setIsLoading(false);
// // //             }
// // //         };

// // //         fetchData();
// // //     }, []);

// // //     useEffect(() => {
// // //         if (selectedDepartment && departamentos.length > 0) {
// // //             const dept = departamentos.find(d => d.departamento === selectedDepartment);
// // //             if (dept) {
// // //                 const provs = dept.provincias.map(p => p.provincia);
// // //                 setProvinciasData(provs);
// // //                 setFilteredProvincias(provs);
// // //                 setDepartmentInput(selectedDepartment);
// // //             }
// // //         }

// // //         if (selectedProvince && selectedDepartment && departamentos.length > 0) {
// // //             const dept = departamentos.find(d => d.departamento === selectedDepartment);
// // //             if (dept) {
// // //                 const prov = dept.provincias.find(p => p.provincia === selectedProvince);
// // //                 if (prov) {
// // //                     const dists = prov.distritos.map(d => d.distrito);
// // //                     setDistritosData(dists);
// // //                     setFilteredDistritos(dists);
// // //                     setProvinceInput(selectedProvince);
// // //                 }
// // //             }
// // //         }

// // //         if (selectedDistrict) {
// // //             setDistrictInput(selectedDistrict);
// // //         }
// // //     }, [departamentos, selectedDepartment, selectedProvince, selectedDistrict]);

// // //     useEffect(() => {
// // //         if (departmentInput.trim() === '') {
// // //             setFilteredDepartamentos(departamentosData);
// // //         } else {
// // //             const filtered = departamentosData.filter(dept => 
// // //                 dept.toLowerCase().includes(departmentInput.toLowerCase())
// // //             );
// // //             setFilteredDepartamentos(filtered);
// // //         }
// // //     }, [departmentInput, departamentosData]);

// // //     useEffect(() => {
// // //         if (provinceInput.trim() === '' || !selectedDepartment) {
// // //             setFilteredProvincias(provinciasData);
// // //         } else {
// // //             const filtered = provinciasData.filter(prov => prov.toLowerCase().includes(provinceInput.toLowerCase()));
// // //             setFilteredProvincias(filtered);
// // //         }
// // //     }, [provinceInput, provinciasData, selectedDepartment]);

// // //     useEffect(() => {
// // //         if (districtInput.trim() === '' || !selectedProvince) {
// // //             setFilteredDistritos(distritosData);
// // //         } else {
// // //             const filtered = distritosData.filter(dist => 
// // //                 dist.toLowerCase().includes(districtInput.toLowerCase())
// // //             );
// // //             setFilteredDistritos(filtered);
// // //         }
// // //     }, [districtInput, distritosData, selectedProvince]);

// // //     useEffect(() => {
// // //         setIsConfirmButtonEnabled(!!selectedDistrict);
// // //     }, [selectedDistrict]);

// // //     useEffect(() => {
// // //         if (departmentResultsRef.current) {
// // //             const items = departmentResultsRef.current.querySelectorAll('li');
// // //             const totalHeight = items.length * 44;
// // //             const maxHeight = Math.min(totalHeight, 140);
// // //             departmentResultsRef.current.style.height = showDepartmentResults && items.length > 0 ? `${maxHeight}px` : '0px';
// // //         }
// // //     }, [filteredDepartamentos, showDepartmentResults]);

// // //     useEffect(() => {
// // //         if (provinceResultsRef.current) {
// // //             const items = provinceResultsRef.current.querySelectorAll('li');
// // //             const totalHeight = items.length * 44;
// // //             const maxHeight = Math.min(totalHeight, 140);
// // //             provinceResultsRef.current.style.height = showProvinceResults && items.length > 0 ? `${maxHeight}px` : '0px';
// // //         }
// // //     }, [filteredProvincias, showProvinceResults]);

// // //     useEffect(() => {
// // //         if (districtResultsRef.current) {
// // //             const items = districtResultsRef.current.querySelectorAll('li');
// // //             const totalHeight = items.length * 44;
// // //             const maxHeight = Math.min(totalHeight, 140);
// // //             districtResultsRef.current.style.height = showDistrictResults && items.length > 0 ? `${maxHeight}px` : '0px';
// // //         }
// // //     }, [filteredDistritos, showDistrictResults]);

// // //     const getButtonText = () => {
// // //         if (isLoading) return 'Cargando...';
// // //         if (error) return 'Error de ubicación';
// // //         if (selectedDistrict) {
// // //             const isLimaOrCallao = selectedProvince === 'Lima metropolitana' || 
// // //                 selectedProvince === 'Provincia constitucional del Callao';

// // //             if (isLimaOrCallao) {
// // //                 return `Entrega en ${selectedDistrict}`;
// // //             } else {
// // //                 return `Envío a ${selectedDistrict}`;
// // //             }
// // //         }
// // //         return 'Ingresa tu ubicación';
// // //     };

// // //     const handleSelectDepartment = (deptName) => {
// // //         setSelectedDepartment(deptName);
// // //         setDepartmentInput(deptName);
// // //         setShowDepartmentResults(false);
// // //         localStorage.setItem('departamento', deptName);

// // //         setSelectedProvince('');
// // //         setProvinceInput('');
// // //         setSelectedDistrict('');
// // //         setDistrictInput('');
// // //         localStorage.removeItem('provincia');
// // //         localStorage.removeItem('distrito');

// // //         const dept = departamentos.find(d => d.departamento === deptName);
// // //         if (dept) {
// // //             const provs = dept.provincias.map(p => p.provincia);
// // //             setProvinciasData(provs);
// // //             setFilteredProvincias(provs);
// // //         }

// // //         setTimeout(() => {
// // //             if (provinceInputRef.current) {
// // //                 provinceInputRef.current.focus();
// // //                 setShowProvinceResults(true);
// // //             }
// // //         }, 100);
// // //     };

// // //     const handleSelectProvince = (provName) => {
// // //         setSelectedProvince(provName);
// // //         setProvinceInput(provName);
// // //         setShowProvinceResults(false);
// // //         localStorage.setItem('provincia', provName);

// // //         setSelectedDistrict('');
// // //         setDistrictInput('');
// // //         localStorage.removeItem('distrito');

// // //         const dept = departamentos.find(d => d.departamento === selectedDepartment);
// // //         if (dept) {
// // //             const prov = dept.provincias.find(p => p.provincia === provName);
// // //             if (prov) {
// // //                 const dists = prov.distritos.map(d => d.distrito);
// // //                 setDistritosData(dists);
// // //                 setFilteredDistritos(dists);
// // //             }
// // //         }

// // //         setTimeout(() => {
// // //             if (districtInputRef.current) {
// // //                 districtInputRef.current.focus();
// // //                 setShowDistrictResults(true);
// // //             }
// // //         }, 100);
// // //     };

// // //     const handleSelectDistrict = (distName) => {
// // //         setSelectedDistrict(distName);
// // //         setDistrictInput(distName);
// // //         setShowDistrictResults(false);
// // //         localStorage.setItem('distrito', distName);
// // //     };

// // //     const handleDepartmentInputChange = (e) => {
// // //         setDepartmentInput(e.target.value);
// // //         setShowDepartmentResults(true);
// // //         if (e.target.value === '') {
// // //             setSelectedDepartment('');
// // //             setProvinciasData([]);
// // //             setFilteredProvincias([]);
// // //             setSelectedProvince('');
// // //             setProvinceInput('');
// // //             setSelectedDistrict('');
// // //             setDistrictInput('');
// // //             localStorage.removeItem('departamento');
// // //             localStorage.removeItem('provincia');
// // //             localStorage.removeItem('distrito');
// // //         }
// // //     };

// // //     const handleProvinceInputChange = (e) => {
// // //         setProvinceInput(e.target.value);
// // //         setShowProvinceResults(true);
// // //         if (e.target.value === '') {
// // //             setSelectedProvince('');
// // //             setDistritosData([]);
// // //             setFilteredDistritos([]);
// // //             setSelectedDistrict('');
// // //             setDistrictInput('');
// // //             localStorage.removeItem('provincia');
// // //             localStorage.removeItem('distrito');
// // //         }
// // //     };

// // //     const handleDistrictInputChange = (e) => {
// // //         setDistrictInput(e.target.value);
// // //         setShowDistrictResults(true);
// // //         if (e.target.value === '') {
// // //             setSelectedDistrict('');
// // //             localStorage.removeItem('distrito');
// // //         }
// // //     };

// // //     const openModal = () => {
// // //         if (!isLoading && !error) {
// // //             if (onOpenModal) {
// // //                 onOpenModal();
// // //             }
// // //             setShowDepartmentResults(false);
// // //             setShowProvinceResults(false);
// // //             setShowDistrictResults(false);
// // //         }
// // //     };

// // //     const closeModal = () => {
// // //         if (onCloseModal) {
// // //             onCloseModal();
// // //         }
// // //         setShowDepartmentResults(false);
// // //         setShowProvinceResults(false);
// // //         setShowDistrictResults(false);
// // //     };

// // //     const handleConfirmLocation = () => {
// // //         const locationData = {
// // //             departamento: selectedDepartment,
// // //             provincia: selectedProvince,
// // //             distrito: selectedDistrict,
// // //         };
// // //         console.log('Ubicación confirmada:', locationData);
// // //         closeModal();
// // //     };

// // //     useEffect(() => {
// // //         if (isModalOpen) {
// // //             if (selectedDepartment) {
// // //                 setDepartmentInput(selectedDepartment);
// // //                 const dept = departamentos.find(d => d.departamento === selectedDepartment);
// // //                 if (dept) {
// // //                     const provs = dept.provincias.map(p => p.provincia);
// // //                     setProvinciasData(provs);
// // //                     setFilteredProvincias(provs);
// // //                 }
// // //                 if (selectedProvince) {
// // //                     setProvinceInput(selectedProvince);
// // //                     const dept2 = departamentos.find(d => d.departamento === selectedDepartment);
// // //                     if (dept2) {
// // //                         const prov = dept2.provincias.find(p => p.provincia === selectedProvince);
// // //                         if (prov) {
// // //                             const dists = prov.distritos.map(d => d.distrito);
// // //                             setDistritosData(dists);
// // //                             setFilteredDistritos(dists);
// // //                         }
// // //                     }
// // //                     if (selectedDistrict) {
// // //                         setDistrictInput(selectedDistrict);
// // //                     }
// // //                 }
// // //                 setShowDepartmentResults(false);
// // //                 setShowProvinceResults(false);
// // //                 setShowDistrictResults(false);

// // //                 setTimeout(() => {
// // //                     if (!selectedProvince && provinceInputRef.current) {
// // //                         provinceInputRef.current.focus();
// // //                         setShowProvinceResults(true);
// // //                     } else if (!selectedDistrict && districtInputRef.current) {
// // //                         districtInputRef.current.focus();
// // //                         setShowDistrictResults(true);
// // //                     }
// // //                 }, 100);
// // //             } else {
// // //                 setShowDepartmentResults(true);
// // //                 setTimeout(() => {
// // //                     if (departmentInputRef.current) {
// // //                         departmentInputRef.current.focus();
// // //                     }
// // //                 }, 100);
// // //             }
// // //         }
// // //     }, [isModalOpen, selectedDepartment, selectedProvince, selectedDistrict, departamentos]);

// // //     return (
// // //         <>
// // //             <button type='button' className='location-button' onClick={openModal} disabled={isLoading || error}>
// // //                 <span className="material-symbols-outlined">location_on</span>
// // //                 <p className='text'>{getButtonText()}</p>
// // //             </button>

// // //             {isModalOpen && <div className='location-layer' onClick={closeModal}></div>}

// // //             {isModalOpen && (
// // //                 <div className='modal-location-container'>
// // //                     <div className='modal-location-title d-flex-center-between gap-5'>
// // //                         <div className='d-flex-column gap-10 w-100'>
// // //                             <div className='d-flex-center-center gap-5 margin-right'>
// // //                                 <span className="material-symbols-outlined">location_on</span>
// // //                                 <p className='title'>¿Para donde es tu producto?</p>
// // //                             </div>
// // //                             <p className='text'>Brindanos tu ubicación para ayudarte con la disponibilidad y proceso de compra</p>
// // //                         </div>

// // //                         <span className="material-symbols-outlined modal-location-button-close color-color-1 margin-bottom" onClick={closeModal}>close</span>
// // //                     </div>

// // //                     {error && (
// // //                         <div className="error-message">
// // //                             {error}
// // //                         </div>
// // //                     )}

// // //                     <div className='modal-location-selects'>
// // //                         <div className='modal-location-tag'>
// // //                             <label htmlFor="departamento">Departamento</label>
// // //                             <input
// // //                                 ref={departmentInputRef}
// // //                                 type='text'
// // //                                 placeholder='Busca un departamento...'
// // //                                 id="departamento"
// // //                                 value={departmentInput}
// // //                                 onChange={handleDepartmentInputChange}
// // //                                 onFocus={() => setShowDepartmentResults(true)}
// // //                                 disabled={isLoading || error}
// // //                             />
// // //                             <span className="material-symbols-outlined">search</span>

// // //                             {filteredDepartamentos.length > 0 && (
// // //                                 <div 
// // //                                     ref={departmentResultsRef}
// // //                                     className={`modal-location-tag-results ${showDepartmentResults ? 'active' : ''}`}
// // //                                     onClick={(e) => e.stopPropagation()}
// // //                                 >
// // //                                     <ul>
// // //                                         {filteredDepartamentos.map((dept) => (
// // //                                             <li key={dept}>
// // //                                                 <button 
// // //                                                     type='button'
// // //                                                     className={selectedDepartment === dept ? 'active' : ''}
// // //                                                     onClick={() => handleSelectDepartment(dept)}
// // //                                                 >
// // //                                                     {dept}
// // //                                                 </button>
// // //                                             </li>
// // //                                         ))}
// // //                                     </ul>
// // //                                 </div>
// // //                             )}
// // //                         </div>

// // //                         <div className='modal-location-tag'>
// // //                             <label htmlFor="provincia">Provincia</label>
// // //                             <input
// // //                                 ref={provinceInputRef}
// // //                                 type='text'
// // //                                 placeholder='Busca una provincia...'
// // //                                 id="provincia"
// // //                                 value={provinceInput}
// // //                                 onChange={handleProvinceInputChange}
// // //                                 onFocus={() => {
// // //                                     if (selectedDepartment) {
// // //                                         setShowProvinceResults(true);
// // //                                     }
// // //                                 }}
// // //                                 disabled={!selectedDepartment || isLoading || error}
// // //                             />
// // //                             <span className="material-symbols-outlined">search</span>

// // //                             {filteredProvincias.length > 0 && (
// // //                                 <div 
// // //                                     ref={provinceResultsRef}
// // //                                     className={`modal-location-tag-results ${showProvinceResults ? 'active' : ''}`}
// // //                                     onClick={(e) => e.stopPropagation()}
// // //                                 >
// // //                                     <ul>
// // //                                         {filteredProvincias.map((prov) => (
// // //                                             <li key={prov}>
// // //                                                 <button 
// // //                                                     type='button'
// // //                                                     className={selectedProvince === prov ? 'active' : ''}
// // //                                                     onClick={() => handleSelectProvince(prov)}
// // //                                                 >
// // //                                                     {prov}
// // //                                                 </button>
// // //                                             </li>
// // //                                         ))}
// // //                                     </ul>
// // //                                 </div>
// // //                             )}
// // //                         </div>

// // //                         {/* Input de Distrito */}
// // //                         <div className='modal-location-tag'>
// // //                             <label htmlFor="distrito">Distrito</label>
// // //                             <input
// // //                                 ref={districtInputRef}
// // //                                 type='text'
// // //                                 placeholder='Busca un distrito...'
// // //                                 id="distrito"
// // //                                 value={districtInput}
// // //                                 onChange={handleDistrictInputChange}
// // //                                 onFocus={() => {
// // //                                     if (selectedProvince) {
// // //                                         setShowDistrictResults(true);
// // //                                     }
// // //                                 }}
// // //                                 disabled={!selectedProvince || isLoading || error}
// // //                             />
// // //                             <span className="material-symbols-outlined">search</span>

// // //                             {filteredDistritos.length > 0 && (
// // //                                 <div 
// // //                                     ref={districtResultsRef}
// // //                                     className={`modal-location-tag-results ${showDistrictResults ? 'active' : ''}`}
// // //                                     onClick={(e) => e.stopPropagation()}
// // //                                 >
// // //                                     <ul>
// // //                                         {filteredDistritos.map((dist) => (
// // //                                             <li key={dist}>
// // //                                                 <button 
// // //                                                     type='button'
// // //                                                     className={selectedDistrict === dist ? 'active' : ''}
// // //                                                     onClick={() => handleSelectDistrict(dist)}
// // //                                                 >
// // //                                                     {dist}
// // //                                                 </button>
// // //                                             </li>
// // //                                         ))}
// // //                                     </ul>
// // //                                 </div>
// // //                             )}
// // //                         </div>
// // //                     </div>

// // //                     <button 
// // //                         type='button' 
// // //                         className={`button-link button-link-2 margin-left ${isConfirmButtonEnabled ? 'active' : ''}`} 
// // //                         onClick={handleConfirmLocation}
// // //                         disabled={!isConfirmButtonEnabled}
// // //                     >
// // //                         <span className="material-symbols-outlined">check</span>
// // //                         <p className='button-link-text'>Confirmar</p>
// // //                     </button>
// // //                 </div>
// // //             )}
// // //         </>
// // //     );
// // // }

// // // export default Location;

// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation } from '../../../../Hooks/useLocation';
// import './Location.css';

// function Location({ onOpenModal, isModalOpen, onCloseModal }) {
//     const { location, updateLocation } = useLocation();
    
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [departamentos, setDepartamentos] = useState([]);
//     const [departmentInput, setDepartmentInput] = useState('');
//     const [provinceInput, setProvinceInput] = useState('');
//     const [districtInput, setDistrictInput] = useState('');
//     const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
//     const [filteredProvincias, setFilteredProvincias] = useState([]);
//     const [filteredDistritos, setFilteredDistritos] = useState([]);
//     const [showDepartmentResults, setShowDepartmentResults] = useState(false);
//     const [showProvinceResults, setShowProvinceResults] = useState(false);
//     const [showDistrictResults, setShowDistrictResults] = useState(false);
//     const [selectedDepartment, setSelectedDepartment] = useState(location.departamento || '');
//     const [selectedProvince, setSelectedProvince] = useState(location.provincia || '');
//     const [selectedDistrict, setSelectedDistrict] = useState(location.distrito || '');
//     const [departamentosData, setDepartamentosData] = useState([]);
//     const [provinciasData, setProvinciasData] = useState([]);
//     const [distritosData, setDistritosData] = useState([]);
//     const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);

//     const departmentInputRef = useRef(null);
//     const provinceInputRef = useRef(null);
//     const districtInputRef = useRef(null);
//     const departmentResultsRef = useRef(null);
//     const provinceResultsRef = useRef(null);
//     const districtResultsRef = useRef(null);

//     // Cargar datos del JSON
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setIsLoading(true);
//                 setError(null);

//                 const response = await fetch('/assets/json/costos-de-envio.json');

//                 if (!response.ok) {
//                     throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
//                 }

//                 const data = await response.json();

//                 if (data && data.departamentos) {
//                     setDepartamentos(data.departamentos);
//                     const depts = data.departamentos.map(d => d.departamento);
//                     setDepartamentosData(depts);
//                     setFilteredDepartamentos(depts);
//                 } else {
//                     throw new Error('La estructura del JSON no es la esperada');
//                 }

//                 setIsLoading(false);
//             } catch (err) {
//                 console.error('Error al cargar los datos de ubicación:', err);
//                 setError('No se pudieron cargar las ubicaciones. Por favor, intenta de nuevo.');
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     // Sincronizar con el hook cuando cambia la ubicación desde otro componente
//     useEffect(() => {
//         if (location.departamento !== selectedDepartment) {
//             setSelectedDepartment(location.departamento || '');
//             setDepartmentInput(location.departamento || '');
//         }
//         if (location.provincia !== selectedProvince) {
//             setSelectedProvince(location.provincia || '');
//             setProvinceInput(location.provincia || '');
//         }
//         if (location.distrito !== selectedDistrict) {
//             setSelectedDistrict(location.distrito || '');
//             setDistrictInput(location.distrito || '');
//         }
//     }, [location.departamento, location.provincia, location.distrito]);

//     // Actualizar provincias cuando cambia el departamento seleccionado
//     useEffect(() => {
//         if (selectedDepartment && departamentos.length > 0) {
//             const dept = departamentos.find(d => d.departamento === selectedDepartment);
//             if (dept) {
//                 const provs = dept.provincias.map(p => p.provincia);
//                 setProvinciasData(provs);
//                 setFilteredProvincias(provs);
//             }
//         } else {
//             setProvinciasData([]);
//             setFilteredProvincias([]);
//         }
//     }, [selectedDepartment, departamentos]);

//     // Actualizar distritos cuando cambia la provincia seleccionada
//     useEffect(() => {
//         if (selectedProvince && selectedDepartment && departamentos.length > 0) {
//             const dept = departamentos.find(d => d.departamento === selectedDepartment);
//             if (dept) {
//                 const prov = dept.provincias.find(p => p.provincia === selectedProvince);
//                 if (prov) {
//                     const dists = prov.distritos.map(d => d.distrito);
//                     setDistritosData(dists);
//                     setFilteredDistritos(dists);
//                 }
//             }
//         } else {
//             setDistritosData([]);
//             setFilteredDistritos([]);
//         }
//     }, [selectedProvince, selectedDepartment, departamentos]);

//     // ===== FILTROS EN TIEMPO REAL =====
//     // Filtro para departamentos
//     useEffect(() => {
//         if (departmentInput.trim() === '') {
//             setFilteredDepartamentos(departamentosData);
//         } else {
//             const filtered = departamentosData.filter(dept => 
//                 dept.toLowerCase().includes(departmentInput.toLowerCase())
//             );
//             setFilteredDepartamentos(filtered);
//         }
//     }, [departmentInput, departamentosData]);

//     // Filtro para provincias
//     useEffect(() => {
//         if (provinceInput.trim() === '' || !selectedDepartment) {
//             setFilteredProvincias(provinciasData);
//         } else {
//             const filtered = provinciasData.filter(prov => 
//                 prov.toLowerCase().includes(provinceInput.toLowerCase())
//             );
//             setFilteredProvincias(filtered);
//         }
//     }, [provinceInput, provinciasData, selectedDepartment]);

//     // Filtro para distritos
//     useEffect(() => {
//         if (districtInput.trim() === '' || !selectedProvince) {
//             setFilteredDistritos(distritosData);
//         } else {
//             const filtered = distritosData.filter(dist => 
//                 dist.toLowerCase().includes(districtInput.toLowerCase())
//             );
//             setFilteredDistritos(filtered);
//         }
//     }, [districtInput, distritosData, selectedProvince]);

//     // Habilitar botón de confirmar
//     useEffect(() => {
//         setIsConfirmButtonEnabled(!!selectedDistrict);
//     }, [selectedDistrict]);

//     // Efecto para manejar la altura de los resultados
//     useEffect(() => {
//         if (departmentResultsRef.current) {
//             const items = departmentResultsRef.current.querySelectorAll('li');
//             const totalHeight = items.length * 44;
//             const maxHeight = Math.min(totalHeight, 200);
//             departmentResultsRef.current.style.maxHeight = showDepartmentResults && items.length > 0 ? `${maxHeight}px` : '0px';
//         }
//     }, [filteredDepartamentos, showDepartmentResults]);

//     useEffect(() => {
//         if (provinceResultsRef.current) {
//             const items = provinceResultsRef.current.querySelectorAll('li');
//             const totalHeight = items.length * 44;
//             const maxHeight = Math.min(totalHeight, 200);
//             provinceResultsRef.current.style.maxHeight = showProvinceResults && items.length > 0 ? `${maxHeight}px` : '0px';
//         }
//     }, [filteredProvincias, showProvinceResults]);

//     useEffect(() => {
//         if (districtResultsRef.current) {
//             const items = districtResultsRef.current.querySelectorAll('li');
//             const totalHeight = items.length * 44;
//             const maxHeight = Math.min(totalHeight, 200);
//             districtResultsRef.current.style.maxHeight = showDistrictResults && items.length > 0 ? `${maxHeight}px` : '0px';
//         }
//     }, [filteredDistritos, showDistrictResults]);

//     const getButtonText = () => {
//         if (isLoading) return 'Cargando...';
//         if (error) return 'Error de ubicación';
//         if (selectedDistrict) {
//             const isLimaOrCallao = selectedProvince === 'Lima metropolitana' || 
//                 selectedProvince === 'Provincia constitucional del Callao';

//             if (isLimaOrCallao) {
//                 return `Entrega en ${selectedDistrict}`;
//             } else {
//                 return `Envío a ${selectedDistrict}`;
//             }
//         }
//         return 'Ingresa tu ubicación';
//     };

//     const handleSelectDepartment = (deptName) => {
//         setSelectedDepartment(deptName);
//         setDepartmentInput(deptName);
//         setShowDepartmentResults(false);
        
//         // Actualizar el hook
//         updateLocation('departamento', deptName);

//         // Resetear provincia y distrito
//         setSelectedProvince('');
//         setProvinceInput('');
//         setSelectedDistrict('');
//         setDistrictInput('');
//         updateLocation('provincia', '');
//         updateLocation('distrito', '');

//         setTimeout(() => {
//             if (provinceInputRef.current) {
//                 provinceInputRef.current.focus();
//                 setShowProvinceResults(true);
//             }
//         }, 100);
//     };

//     const handleSelectProvince = (provName) => {
//         setSelectedProvince(provName);
//         setProvinceInput(provName);
//         setShowProvinceResults(false);
        
//         updateLocation('provincia', provName);

//         setSelectedDistrict('');
//         setDistrictInput('');
//         updateLocation('distrito', '');

//         setTimeout(() => {
//             if (districtInputRef.current) {
//                 districtInputRef.current.focus();
//                 setShowDistrictResults(true);
//             }
//         }, 100);
//     };

//     const handleSelectDistrict = (distName) => {
//         setSelectedDistrict(distName);
//         setDistrictInput(distName);
//         setShowDistrictResults(false);
//         updateLocation('distrito', distName);
//     };

//     const handleDepartmentInputChange = (e) => {
//         const value = e.target.value;
//         setDepartmentInput(value);
//         setShowDepartmentResults(true);
        
//         if (value === '') {
//             setSelectedDepartment('');
//             setSelectedProvince('');
//             setProvinceInput('');
//             setSelectedDistrict('');
//             setDistrictInput('');
//             updateLocation('departamento', '');
//             updateLocation('provincia', '');
//             updateLocation('distrito', '');
//         }
//     };

//     const handleProvinceInputChange = (e) => {
//         const value = e.target.value;
//         setProvinceInput(value);
//         setShowProvinceResults(true);
        
//         if (value === '') {
//             setSelectedProvince('');
//             setSelectedDistrict('');
//             setDistrictInput('');
//             updateLocation('provincia', '');
//             updateLocation('distrito', '');
//         }
//     };

//     const handleDistrictInputChange = (e) => {
//         const value = e.target.value;
//         setDistrictInput(value);
//         setShowDistrictResults(true);
        
//         if (value === '') {
//             setSelectedDistrict('');
//             updateLocation('distrito', '');
//         }
//     };

//     const openModal = () => {
//         if (!isLoading && !error) {
//             if (onOpenModal) {
//                 onOpenModal();
//             }
//             setShowDepartmentResults(false);
//             setShowProvinceResults(false);
//             setShowDistrictResults(false);
            
//             // Sincronizar inputs con el estado actual
//             setDepartmentInput(selectedDepartment || '');
//             setProvinceInput(selectedProvince || '');
//             setDistrictInput(selectedDistrict || '');
//         }
//     };

//     const closeModal = () => {
//         if (onCloseModal) {
//             onCloseModal();
//         }
//         setShowDepartmentResults(false);
//         setShowProvinceResults(false);
//         setShowDistrictResults(false);
//     };

//     const handleConfirmLocation = () => {
//         const locationData = {
//             departamento: selectedDepartment,
//             provincia: selectedProvince,
//             distrito: selectedDistrict,
//         };
//         console.log('Ubicación confirmada:', locationData);
//         closeModal();
//     };

//     // Cerrar resultados al hacer clic fuera
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (departmentResultsRef.current && !departmentResultsRef.current.contains(event.target) &&
//                 departmentInputRef.current && !departmentInputRef.current.contains(event.target)) {
//                 setShowDepartmentResults(false);
//             }
//             if (provinceResultsRef.current && !provinceResultsRef.current.contains(event.target) &&
//                 provinceInputRef.current && !provinceInputRef.current.contains(event.target)) {
//                 setShowProvinceResults(false);
//             }
//             if (districtResultsRef.current && !districtResultsRef.current.contains(event.target) &&
//                 districtInputRef.current && !districtInputRef.current.contains(event.target)) {
//                 setShowDistrictResults(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     // Enfocar el input correspondiente al abrir el modal
//     useEffect(() => {
//         if (isModalOpen) {
//             setTimeout(() => {
//                 if (!selectedDepartment && departmentInputRef.current) {
//                     departmentInputRef.current.focus();
//                     setShowDepartmentResults(true);
//                 } else if (!selectedProvince && provinceInputRef.current) {
//                     provinceInputRef.current.focus();
//                     setShowProvinceResults(true);
//                 } else if (!selectedDistrict && districtInputRef.current) {
//                     districtInputRef.current.focus();
//                     setShowDistrictResults(true);
//                 }
//             }, 100);
//         }
//     }, [isModalOpen]);

//     return (
//         <>
//             <button type='button' className='location-button' onClick={openModal} disabled={isLoading || error}>
//                 <span className="material-symbols-outlined">location_on</span>
//                 <p className='text'>{getButtonText()}</p>
//             </button>

//             {isModalOpen && <div className='location-layer' onClick={closeModal}></div>}

//             {isModalOpen && (
//                 <div className='modal-location-container'>
//                     <div className='modal-location-title d-flex-center-between gap-5'>
//                         <div className='d-flex-column gap-10 w-100'>
//                             <div className='d-flex-center-center gap-5 margin-right'>
//                                 <span className="material-symbols-outlined">location_on</span>
//                                 <p className='title'>¿Para donde es tu producto?</p>
//                             </div>
//                             <p className='text'>Brindanos tu ubicación para ayudarte con la disponibilidad y proceso de compra</p>
//                         </div>

//                         <span className="material-symbols-outlined modal-location-button-close color-color-1 margin-bottom" onClick={closeModal}>close</span>
//                     </div>

//                     {error && (
//                         <div className="error-message">
//                             {error}
//                         </div>
//                     )}

//                     <div className='modal-location-selects'>
//                         <div className='modal-location-tag'>
//                             <label htmlFor="departamento">Departamento</label>
//                             <input
//                                 ref={departmentInputRef}
//                                 type='text'
//                                 placeholder='Busca un departamento...'
//                                 id="departamento"
//                                 value={departmentInput}
//                                 onChange={handleDepartmentInputChange}
//                                 onFocus={() => setShowDepartmentResults(true)}
//                                 disabled={isLoading || error}
//                             />
//                             <span className="material-symbols-outlined">search</span>

//                             <div 
//                                 ref={departmentResultsRef}
//                                 className={`modal-location-tag-results ${showDepartmentResults && filteredDepartamentos.length > 0 ? 'active' : ''}`}
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 <ul>
//                                     {filteredDepartamentos.map((dept) => (
//                                         <li key={dept}>
//                                             <button 
//                                                 type='button'
//                                                 className={selectedDepartment === dept ? 'active' : ''}
//                                                 onClick={() => handleSelectDepartment(dept)}
//                                             >
//                                                 {dept}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className='modal-location-tag'>
//                             <label htmlFor="provincia">Provincia</label>
//                             <input
//                                 ref={provinceInputRef}
//                                 type='text'
//                                 placeholder='Busca una provincia...'
//                                 id="provincia"
//                                 value={provinceInput}
//                                 onChange={handleProvinceInputChange}
//                                 onFocus={() => {
//                                     if (selectedDepartment) {
//                                         setShowProvinceResults(true);
//                                     }
//                                 }}
//                                 disabled={!selectedDepartment || isLoading || error}
//                             />
//                             <span className="material-symbols-outlined">search</span>

//                             <div 
//                                 ref={provinceResultsRef}
//                                 className={`modal-location-tag-results ${showProvinceResults && filteredProvincias.length > 0 ? 'active' : ''}`}
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 <ul>
//                                     {filteredProvincias.map((prov) => (
//                                         <li key={prov}>
//                                             <button 
//                                                 type='button'
//                                                 className={selectedProvince === prov ? 'active' : ''}
//                                                 onClick={() => handleSelectProvince(prov)}
//                                             >
//                                                 {prov}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className='modal-location-tag'>
//                             <label htmlFor="distrito">Distrito</label>
//                             <input
//                                 ref={districtInputRef}
//                                 type='text'
//                                 placeholder='Busca un distrito...'
//                                 id="distrito"
//                                 value={districtInput}
//                                 onChange={handleDistrictInputChange}
//                                 onFocus={() => {
//                                     if (selectedProvince) {
//                                         setShowDistrictResults(true);
//                                     }
//                                 }}
//                                 disabled={!selectedProvince || isLoading || error}
//                             />
//                             <span className="material-symbols-outlined">search</span>

//                             <div 
//                                 ref={districtResultsRef}
//                                 className={`modal-location-tag-results ${showDistrictResults && filteredDistritos.length > 0 ? 'active' : ''}`}
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 <ul>
//                                     {filteredDistritos.map((dist) => (
//                                         <li key={dist}>
//                                             <button 
//                                                 type='button'
//                                                 className={selectedDistrict === dist ? 'active' : ''}
//                                                 onClick={() => handleSelectDistrict(dist)}
//                                             >
//                                                 {dist}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>

//                     <button 
//                         type='button' 
//                         className={`button-link button-link-2 margin-left ${isConfirmButtonEnabled ? 'active' : ''}`} 
//                         onClick={handleConfirmLocation}
//                         disabled={!isConfirmButtonEnabled}
//                     >
//                         <span className="material-symbols-outlined">check</span>
//                         <p className='button-link-text'>Confirmar</p>
//                     </button>
//                 </div>
//             )}
//         </>
//     );
// }

// export default Location;

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../../../../Hooks/useLocation';
import './Location.css';

function Location({ onOpenModal, isModalOpen, onCloseModal }) {
    const { location, updateLocation } = useLocation();
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [departamentos, setDepartamentos] = useState([]);
    const [departmentInput, setDepartmentInput] = useState('');
    const [provinceInput, setProvinceInput] = useState('');
    const [districtInput, setDistrictInput] = useState('');
    const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
    const [filteredProvincias, setFilteredProvincias] = useState([]);
    const [filteredDistritos, setFilteredDistritos] = useState([]);
    const [showDepartmentResults, setShowDepartmentResults] = useState(false);
    const [showProvinceResults, setShowProvinceResults] = useState(false);
    const [showDistrictResults, setShowDistrictResults] = useState(false);
    // Inicializar desde localStorage directamente para que funcione igual que antes
    const [selectedDepartment, setSelectedDepartment] = useState(() => {
        return localStorage.getItem('departamento') || '';
    });
    const [selectedProvince, setSelectedProvince] = useState(() => {
        return localStorage.getItem('provincia') || '';
    });
    const [selectedDistrict, setSelectedDistrict] = useState(() => {
        return localStorage.getItem('distrito') || '';
    });
    const [departamentosData, setDepartamentosData] = useState([]);
    const [provinciasData, setProvinciasData] = useState([]);
    const [distritosData, setDistritosData] = useState([]);
    const [isConfirmButtonEnabled, setIsConfirmButtonEnabled] = useState(false);

    const departmentInputRef = useRef(null);
    const provinceInputRef = useRef(null);
    const districtInputRef = useRef(null);
    const departmentResultsRef = useRef(null);
    const provinceResultsRef = useRef(null);
    const districtResultsRef = useRef(null);

    // Cargar datos del JSON
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch('/assets/json/costos-de-envio.json');

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();

                if (data && data.departamentos) {
                    setDepartamentos(data.departamentos);
                    const depts = data.departamentos.map(d => d.departamento);
                    setDepartamentosData(depts);
                    setFilteredDepartamentos(depts);
                } else {
                    throw new Error('La estructura del JSON no es la esperada');
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Error al cargar los datos de ubicación:', err);
                setError('No se pudieron cargar las ubicaciones. Por favor, intenta de nuevo.');
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Sincronizar con el hook cuando cambia la ubicación desde otro componente
    useEffect(() => {
        if (location.departamento && location.departamento !== selectedDepartment) {
            setSelectedDepartment(location.departamento);
            setDepartmentInput(location.departamento);
        }
        if (location.provincia && location.provincia !== selectedProvince) {
            setSelectedProvince(location.provincia);
            setProvinceInput(location.provincia);
        }
        if (location.distrito && location.distrito !== selectedDistrict) {
            setSelectedDistrict(location.distrito);
            setDistrictInput(location.distrito);
        }
    }, [location.departamento, location.provincia, location.distrito]);

    // Actualizar provincias cuando cambia el departamento seleccionado
    useEffect(() => {
        if (selectedDepartment && departamentos.length > 0) {
            const dept = departamentos.find(d => d.departamento === selectedDepartment);
            if (dept) {
                const provs = dept.provincias.map(p => p.provincia);
                setProvinciasData(provs);
                setFilteredProvincias(provs);
                setDepartmentInput(selectedDepartment);
            }
        }
    }, [selectedDepartment, departamentos]);

    // Actualizar distritos cuando cambia la provincia seleccionada
    useEffect(() => {
        if (selectedProvince && selectedDepartment && departamentos.length > 0) {
            const dept = departamentos.find(d => d.departamento === selectedDepartment);
            if (dept) {
                const prov = dept.provincias.find(p => p.provincia === selectedProvince);
                if (prov) {
                    const dists = prov.distritos.map(d => d.distrito);
                    setDistritosData(dists);
                    setFilteredDistritos(dists);
                    setProvinceInput(selectedProvince);
                }
            }
        }
    }, [selectedProvince, selectedDepartment, departamentos]);

    // ===== FILTROS EN TIEMPO REAL (IGUAL QUE EL CÓDIGO ORIGINAL) =====
    useEffect(() => {
        if (departmentInput.trim() === '') {
            setFilteredDepartamentos(departamentosData);
        } else {
            const filtered = departamentosData.filter(dept => 
                dept.toLowerCase().includes(departmentInput.toLowerCase())
            );
            setFilteredDepartamentos(filtered);
        }
    }, [departmentInput, departamentosData]);

    useEffect(() => {
        if (provinceInput.trim() === '' || !selectedDepartment) {
            setFilteredProvincias(provinciasData);
        } else {
            const filtered = provinciasData.filter(prov => 
                prov.toLowerCase().includes(provinceInput.toLowerCase())
            );
            setFilteredProvincias(filtered);
        }
    }, [provinceInput, provinciasData, selectedDepartment]);

    useEffect(() => {
        if (districtInput.trim() === '' || !selectedProvince) {
            setFilteredDistritos(distritosData);
        } else {
            const filtered = distritosData.filter(dist => 
                dist.toLowerCase().includes(districtInput.toLowerCase())
            );
            setFilteredDistritos(filtered);
        }
    }, [districtInput, distritosData, selectedProvince]);

    useEffect(() => {
        setIsConfirmButtonEnabled(!!selectedDistrict);
    }, [selectedDistrict]);

    // Efectos para la altura de los resultados (igual que el código original)
    useEffect(() => {
        if (departmentResultsRef.current) {
            const items = departmentResultsRef.current.querySelectorAll('li');
            const totalHeight = items.length * 44;
            const maxHeight = Math.min(totalHeight, 140);
            departmentResultsRef.current.style.height = showDepartmentResults && items.length > 0 ? `${maxHeight}px` : '0px';
        }
    }, [filteredDepartamentos, showDepartmentResults]);

    useEffect(() => {
        if (provinceResultsRef.current) {
            const items = provinceResultsRef.current.querySelectorAll('li');
            const totalHeight = items.length * 44;
            const maxHeight = Math.min(totalHeight, 140);
            provinceResultsRef.current.style.height = showProvinceResults && items.length > 0 ? `${maxHeight}px` : '0px';
        }
    }, [filteredProvincias, showProvinceResults]);

    useEffect(() => {
        if (districtResultsRef.current) {
            const items = districtResultsRef.current.querySelectorAll('li');
            const totalHeight = items.length * 44;
            const maxHeight = Math.min(totalHeight, 140);
            districtResultsRef.current.style.height = showDistrictResults && items.length > 0 ? `${maxHeight}px` : '0px';
        }
    }, [filteredDistritos, showDistrictResults]);

    const getButtonText = () => {
        if (isLoading) return 'Cargando...';
        if (error) return 'Error de ubicación';
        if (selectedDistrict) {
            const isLimaOrCallao = selectedProvince === 'Lima metropolitana' || 
                selectedProvince === 'Provincia constitucional del Callao';

            if (isLimaOrCallao) {
                return `Entrega en ${selectedDistrict}`;
            } else {
                return `Envío a ${selectedDistrict}`;
            }
        }
        return 'Ingresa tu ubicación';
    };

    const handleSelectDepartment = (deptName) => {
        setSelectedDepartment(deptName);
        setDepartmentInput(deptName);
        setShowDepartmentResults(false);
        localStorage.setItem('departamento', deptName);
        // Actualizar el hook
        updateLocation('departamento', deptName);

        setSelectedProvince('');
        setProvinceInput('');
        setSelectedDistrict('');
        setDistrictInput('');
        localStorage.removeItem('provincia');
        localStorage.removeItem('distrito');
        updateLocation('provincia', '');
        updateLocation('distrito', '');

        const dept = departamentos.find(d => d.departamento === deptName);
        if (dept) {
            const provs = dept.provincias.map(p => p.provincia);
            setProvinciasData(provs);
            setFilteredProvincias(provs);
        }

        setTimeout(() => {
            if (provinceInputRef.current) {
                provinceInputRef.current.focus();
                setShowProvinceResults(true);
            }
        }, 100);
    };

    const handleSelectProvince = (provName) => {
        setSelectedProvince(provName);
        setProvinceInput(provName);
        setShowProvinceResults(false);
        localStorage.setItem('provincia', provName);
        updateLocation('provincia', provName);

        setSelectedDistrict('');
        setDistrictInput('');
        localStorage.removeItem('distrito');
        updateLocation('distrito', '');

        const dept = departamentos.find(d => d.departamento === selectedDepartment);
        if (dept) {
            const prov = dept.provincias.find(p => p.provincia === provName);
            if (prov) {
                const dists = prov.distritos.map(d => d.distrito);
                setDistritosData(dists);
                setFilteredDistritos(dists);
            }
        }

        setTimeout(() => {
            if (districtInputRef.current) {
                districtInputRef.current.focus();
                setShowDistrictResults(true);
            }
        }, 100);
    };

    const handleSelectDistrict = (distName) => {
        setSelectedDistrict(distName);
        setDistrictInput(distName);
        setShowDistrictResults(false);
        localStorage.setItem('distrito', distName);
        updateLocation('distrito', distName);
    };

    const handleDepartmentInputChange = (e) => {
        setDepartmentInput(e.target.value);
        setShowDepartmentResults(true);
        if (e.target.value === '') {
            setSelectedDepartment('');
            setProvinciasData([]);
            setFilteredProvincias([]);
            setSelectedProvince('');
            setProvinceInput('');
            setSelectedDistrict('');
            setDistrictInput('');
            localStorage.removeItem('departamento');
            localStorage.removeItem('provincia');
            localStorage.removeItem('distrito');
            updateLocation('departamento', '');
            updateLocation('provincia', '');
            updateLocation('distrito', '');
        }
    };

    const handleProvinceInputChange = (e) => {
        setProvinceInput(e.target.value);
        setShowProvinceResults(true);
        if (e.target.value === '') {
            setSelectedProvince('');
            setDistritosData([]);
            setFilteredDistritos([]);
            setSelectedDistrict('');
            setDistrictInput('');
            localStorage.removeItem('provincia');
            localStorage.removeItem('distrito');
            updateLocation('provincia', '');
            updateLocation('distrito', '');
        }
    };

    const handleDistrictInputChange = (e) => {
        setDistrictInput(e.target.value);
        setShowDistrictResults(true);
        if (e.target.value === '') {
            setSelectedDistrict('');
            localStorage.removeItem('distrito');
            updateLocation('distrito', '');
        }
    };

    const openModal = () => {
        if (!isLoading && !error) {
            if (onOpenModal) {
                onOpenModal();
            }
            setShowDepartmentResults(false);
            setShowProvinceResults(false);
            setShowDistrictResults(false);
            
            // Sincronizar inputs con el estado actual
            setDepartmentInput(selectedDepartment || '');
            setProvinceInput(selectedProvince || '');
            setDistrictInput(selectedDistrict || '');
        }
    };

    const closeModal = () => {
        if (onCloseModal) {
            onCloseModal();
        }
        setShowDepartmentResults(false);
        setShowProvinceResults(false);
        setShowDistrictResults(false);
    };

    const handleConfirmLocation = () => {
        const locationData = {
            departamento: selectedDepartment,
            provincia: selectedProvince,
            distrito: selectedDistrict,
        };
        console.log('Ubicación confirmada:', locationData);
        closeModal();
    };

    // Efecto para el modal (igual que el código original)
    useEffect(() => {
        if (isModalOpen) {
            if (selectedDepartment) {
                setDepartmentInput(selectedDepartment);
                const dept = departamentos.find(d => d.departamento === selectedDepartment);
                if (dept) {
                    const provs = dept.provincias.map(p => p.provincia);
                    setProvinciasData(provs);
                    setFilteredProvincias(provs);
                }
                if (selectedProvince) {
                    setProvinceInput(selectedProvince);
                    const dept2 = departamentos.find(d => d.departamento === selectedDepartment);
                    if (dept2) {
                        const prov = dept2.provincias.find(p => p.provincia === selectedProvince);
                        if (prov) {
                            const dists = prov.distritos.map(d => d.distrito);
                            setDistritosData(dists);
                            setFilteredDistritos(dists);
                        }
                    }
                    if (selectedDistrict) {
                        setDistrictInput(selectedDistrict);
                    }
                }
                setShowDepartmentResults(false);
                setShowProvinceResults(false);
                setShowDistrictResults(false);

                setTimeout(() => {
                    if (!selectedProvince && provinceInputRef.current) {
                        provinceInputRef.current.focus();
                        setShowProvinceResults(true);
                    } else if (!selectedDistrict && districtInputRef.current) {
                        districtInputRef.current.focus();
                        setShowDistrictResults(true);
                    }
                }, 100);
            } else {
                setShowDepartmentResults(true);
                setTimeout(() => {
                    if (departmentInputRef.current) {
                        departmentInputRef.current.focus();
                    }
                }, 100);
            }
        }
    }, [isModalOpen, selectedDepartment, selectedProvince, selectedDistrict, departamentos]);

    return (
        <>
            <button type='button' className='location-button' onClick={openModal} disabled={isLoading || error}>
                <span className="material-symbols-outlined">location_on</span>
                <p className='text'>{getButtonText()}</p>
            </button>

            {isModalOpen && <div className='location-layer' onClick={closeModal}></div>}

            {isModalOpen && (
                <div className='modal-location-container'>
                    <div className='modal-location-title d-flex-center-between gap-5'>
                        <div className='d-flex-column gap-10 w-100'>
                            <div className='d-flex-center-center gap-5 margin-right'>
                                <span className="material-symbols-outlined">location_on</span>
                                <p className='title'>¿Para donde es tu producto?</p>
                            </div>
                            <p className='text'>Brindanos tu ubicación para ayudarte con la disponibilidad y proceso de compra</p>
                        </div>

                        <span className="material-symbols-outlined modal-location-button-close color-color-1 margin-bottom" onClick={closeModal}>close</span>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className='modal-location-selects'>
                        <div className='modal-location-tag'>
                            <label htmlFor="departamento">Departamento</label>
                            <input
                                ref={departmentInputRef}
                                type='text'
                                placeholder='Busca un departamento...'
                                id="departamento"
                                value={departmentInput}
                                onChange={handleDepartmentInputChange}
                                onFocus={() => setShowDepartmentResults(true)}
                                disabled={isLoading || error}
                            />
                            <span className="material-symbols-outlined">search</span>

                            {filteredDepartamentos.length > 0 && (
                                <div 
                                    ref={departmentResultsRef}
                                    className={`modal-location-tag-results ${showDepartmentResults ? 'active' : ''}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ul>
                                        {filteredDepartamentos.map((dept) => (
                                            <li key={dept}>
                                                <button 
                                                    type='button'
                                                    className={selectedDepartment === dept ? 'active' : ''}
                                                    onClick={() => handleSelectDepartment(dept)}
                                                >
                                                    {dept}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className='modal-location-tag'>
                            <label htmlFor="provincia">Provincia</label>
                            <input
                                ref={provinceInputRef}
                                type='text'
                                placeholder='Busca una provincia...'
                                id="provincia"
                                value={provinceInput}
                                onChange={handleProvinceInputChange}
                                onFocus={() => {
                                    if (selectedDepartment) {
                                        setShowProvinceResults(true);
                                    }
                                }}
                                disabled={!selectedDepartment || isLoading || error}
                            />
                            <span className="material-symbols-outlined">search</span>

                            {filteredProvincias.length > 0 && (
                                <div 
                                    ref={provinceResultsRef}
                                    className={`modal-location-tag-results ${showProvinceResults ? 'active' : ''}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ul>
                                        {filteredProvincias.map((prov) => (
                                            <li key={prov}>
                                                <button 
                                                    type='button'
                                                    className={selectedProvince === prov ? 'active' : ''}
                                                    onClick={() => handleSelectProvince(prov)}
                                                >
                                                    {prov}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className='modal-location-tag'>
                            <label htmlFor="distrito">Distrito</label>
                            <input
                                ref={districtInputRef}
                                type='text'
                                placeholder='Busca un distrito...'
                                id="distrito"
                                value={districtInput}
                                onChange={handleDistrictInputChange}
                                onFocus={() => {
                                    if (selectedProvince) {
                                        setShowDistrictResults(true);
                                    }
                                }}
                                disabled={!selectedProvince || isLoading || error}
                            />
                            <span className="material-symbols-outlined">search</span>

                            {filteredDistritos.length > 0 && (
                                <div 
                                    ref={districtResultsRef}
                                    className={`modal-location-tag-results ${showDistrictResults ? 'active' : ''}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ul>
                                        {filteredDistritos.map((dist) => (
                                            <li key={dist}>
                                                <button 
                                                    type='button'
                                                    className={selectedDistrict === dist ? 'active' : ''}
                                                    onClick={() => handleSelectDistrict(dist)}
                                                >
                                                    {dist}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        type='button' 
                        className={`button-link button-link-2 margin-left ${isConfirmButtonEnabled ? 'active' : ''}`} 
                        onClick={handleConfirmLocation}
                        disabled={!isConfirmButtonEnabled}
                    >
                        <span className="material-symbols-outlined">check</span>
                        <p className='button-link-text'>Confirmar</p>
                    </button>
                </div>
            )}
        </>
    );
}

export default Location;
