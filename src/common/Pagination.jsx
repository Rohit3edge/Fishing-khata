import React from 'react';

const Pagination = ({ currentPage, totalCount, itemsPerPage, onPageChange }) => {
    const totalPage = Math.ceil(totalCount / itemsPerPage);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPageLinks = 5;

        if (totalPage <= maxPageLinks) {
            for (let i = 1; i <= totalPage; i++) {
                pageNumbers.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
            const end = Math.min(totalPage, start + maxPageLinks - 1);

            if (start > 1) {
                pageNumbers.push(1);
                if (start > 2) {
                    pageNumbers.push('...');
                }
            }

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            if (end < totalPage) {
                if (end < totalPage - 1) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPage);
            }
        }

        return pageNumbers;
    };

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={() => onPageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                </li>
                {getPageNumbers().map((number, index) => (
                    <li 
                        key={index} 
                        className={`page-item ${currentPage === number ? 'active' : ''}`}
                    >
                        <button 
                            className="page-link" 
                            onClick={() => number !== '...' && onPageChange(number)}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPage ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={() => onPageChange(currentPage + 1)} 
                        disabled={currentPage === totalPage}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
