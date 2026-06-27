// import SearchBar from '../SearchBar/SearchBar';

// import './Center.css';

// function Center({ onMenuClick, isMenuOpen }) {
//     return(
//         <div className='header-center-container d-flex w-100'>
//             <section className='header-center'>
//                 <div className='d-flex-center-left gap-20'>
//                     <a href='/' title='Dormihogar | Fabricantes de camas' className='header-logo'>
//                         <img src="/assets/imagenes/SEO/logo-principal.jpg" width={125} height={50} alt="Dormihogar"/>
//                     </a>

//                     <button type='button' className={`menu-button ${isMenuOpen ? 'active' : ''}`} onClick={onMenuClick} >
//                         <span className="material-icons">menu</span>
//                         <span className="material-icons">close</span>
//                     </button>
//                 </div>

//                 <SearchBar/>

//                 {/* <a href='/mis-favoritos/' title='Mis favoritos' className='margin-left favorites-button'>
//                     <span className="material-icons">favorite</span> 
//                 </a> */}

//                 <a href='tel: +51933197648' className='margin-left header-center-call-button' title='Llamar ahora'>
//                     <span className="material-icons">phone_in_talk</span>

//                     <div className='d-flex-column'>
//                         <p>933197648</p>
//                     </div>
//                 </a>
//             </section>
//         </div>
//     )
// }

// export default Center;

import './Center.css';

import SearchBar from '../SearchBar/SearchBar';

function Center(){
    return(
        <div className='header-center-container'>
            <div className='header-center'>
                <a href="/" className='header-logo' title=''>
                    <img src='https://www.dormihogar.pe/assets/imagenes/SEO/logo-principal.jpg' alt='' />
                </a>

                <button type='button' className='menu-button'>
                    <span class="material-symbols-outlined">menu</span>
                    <p>Menú</p>
                </button>

                <SearchBar/>

                <button type='button' className='location-button'>
                    <span class="material-symbols-outlined">location_on</span>
                    <p className='text'>Ingresa tu ubicación</p>
                </button>

                <a href='/mis-favoritos/' className='header-fav-button'>
                    <b className='color-white'>10</b>
                    <span class="material-symbols-outlined">favorite</span>
                    <p className='text'>Mis favoritos</p>
                </a>

                {/* <a href='/mi-cuenta/' title='' className='account-link'>
                    <span class="material-symbols-outlined">person</span>
                    <p className='text'>Mi cuenta</p>
                </a> */}

                <a href='tel:+51933197648' title='' className='button-link button-link-2 header-call-link'>
                    <span class="material-symbols-outlined">phone_in_talk</span>
                    <p className='button-link-text'>933 197 648</p>
                </a>
            </div>
        </div>
    )
}

export default Center;
