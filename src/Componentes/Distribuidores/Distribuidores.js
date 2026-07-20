import './Distribuidores.css';

function Distribuidores(){
    return(
        <div className='block-container'>
            <div className='block-content'>
                <div className='block-title-container'>
                    <h2 className='block-title'>Las <b>mejores</b> marcas</h2>
                    <p className='block-title-span'>Del mercado</p>
                </div>

                <ul className='distribuidores-container'>
                    <li>
                        <a href='/busqueda?query=paraiso' title='Productos Paraiso | Dormihogar'>
                            <img src='https://macrumo.com.pe/wp-content/uploads/2024/05/Paraiso-pocket-italiano.jpg' alt=''/>
                        </a>
                    </li>
                    <li>
                        <a href='/busqueda?query=kamas' title='Productos Kamas | Dormihogar'>
                            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsvCkwZhDRy4WnlQJDIH42otRmy9GbhNy8ax_ir0Nm77szLOfxC2WOkIg&s=10' alt=''/>
                        </a>
                    </li>
                    <li>
                        <a href='/busqueda?query=el%20cisne' title='Productos El Cisne | Dormihogar'>
                            <img src='https://colchonescisne.vtexassets.com/assets/vtex.file-manager-graphql/images/8c6f7e30-b4b9-4136-9853-9e3b1d0f87f5___34e8d2a4083a09e38914fd3dfe08fe62.jpg' alt=''/>
                        </a>
                    </li>
                    <li>
                        <a href='/busqueda?query=komfort' title='Productos Komfort | Dormihogar'>
                            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk5b7kuh2e3gMo_7YhtCQ4FOP2ZJqkiN3hiPvsSWYbpJoQjRpNeNCzHZNr&s=10' alt=''/>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Distribuidores;
