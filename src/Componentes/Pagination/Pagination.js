import React from 'react';

import './Pagination.css';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onPreviousPage,
    onNextPage,
    getVisiblePages,
    showPreviousNext = true,
    showFirstLast = false,
    className = ''
}) => {
    if (totalPages <= 1) return null;

    const visiblePages = getVisiblePages ? getVisiblePages() : [];

    return (
        <div className={`pagination-container ${className}`}>
            {/* Botón Anterior */}
            {showPreviousNext && (
                <button 
                    type='button' 
                    className='pagination-arrow'
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                    <p>Anterior</p>
                </button>
            )}

            {/* Primera página (si showFirstLast es true) */}
            {showFirstLast && currentPage > 3 && (
                <>
                    <button 
                        type='button'
                        className='pagination-page'
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </button>
                    {currentPage > 4 && <span className="pagination-ellipsis">…</span>}
                </>
            )}

            {/* Números de página */}
            <ul className="pagination-list">
                {visiblePages.map((page, index) => 
                    typeof page === 'number' ? (
                        <li key={index}>
                            <button 
                                type='button'
                                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                onClick={() => onPageChange(page)}
                                aria-label={`Ir a página ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        </li>
                    ) : (
                        <li key={index}>
                            <span className="pagination-ellipsis">…</span>
                        </li>
                    )
                )}
            </ul>

            {/* Última página (si showFirstLast es true) */}
            {showFirstLast && currentPage < totalPages - 2 && (
                <>
                    {currentPage < totalPages - 3 && <span className="pagination-ellipsis">…</span>}
                    <button 
                        type='button'
                        className='pagination-page'
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {showPreviousNext && (
                <button 
                    type='button' 
                    className='pagination-arrow'
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                >
                    <p>Siguiente</p>
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            )}
        </div>
    );
};

export default Pagination;
