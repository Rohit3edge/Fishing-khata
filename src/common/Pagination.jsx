// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalCount, itemsPerPage, onPageChange })=>{

    const totalPage =Math.ceil(totalCount / itemsPerPage)
    console.log("totalPage",totalPage)
    console.log("currentPage",currentPage)

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPageLinks = 5; // Maximum number of page links to show (excluding ellipsis)
        
        if (totalPage <= maxPageLinks) {
          // If the total pages are less than or equal to the maximum number of page links,
          // show all page numbers without ellipsis
          for (let i = 1; i <= totalPage; i++) {
            pageNumbers.push(i);
          }
        } else {
          // If total pages exceed the maximum number of page links, add ellipsis
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
        <>
        <ul className="pagination">
        <li className={currentPage === 1 ? 'disabled' : ''}>
          <button onClick={() => onPageChange(currentPage - 1)} disabled ={currentPage === 1}>Previous</button>
        </li>
        {getPageNumbers().map((number,index) => (
          <li key={index} className={currentPage === number ? 'active' : ''}>
            <button onClick={() => onPageChange(number)}>{number}</button>
          </li>
        ))}
        <li className={currentPage === totalPage ? 'disabled' : ''} >
          <button onClick={() => onPageChange(currentPage + 1)} disabled ={currentPage === totalPage}>Next</button>
        </li>
      </ul>
      </>

    );
    
}

export default Pagination

