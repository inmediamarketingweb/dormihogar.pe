import SearchBar from '../SearchBar/SearchBar';

import './Center.css';

function Center(){
    return(
        <div className='header-center-container d-flex w-100'>
            <section className='header-center'>
                <div className='d-flex-center-left gap-20'>
                    <a href='/' title='Dormihogar | Fabricantes de camas' className='header-logo'>
                        <img src="/assets/imagenes/SEO/logo-principal.jpg" width={120} height={50} alt="Dormihogar"/>
                    </a>

                    <button type='button' className='menu-button'>
                        <p>Menu</p>
                        <div>
                            <span className="material-icons">menu</span>
                            <span className="material-icons">close</span>
                        </div>
                    </button>
                </div>

                <SearchBar/>

                <div>Dormihogar</div>
            </section>
        </div>
    )
}

export default Center;
