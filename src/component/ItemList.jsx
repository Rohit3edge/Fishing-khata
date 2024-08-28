import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { Listitems } from '../store/slices/items';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';

const Item = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Product Type', field: 'type' },
    { header: 'Category', field: 'category_name' },
    { header: 'Item Name', field: 'name' },
    { header: 'Price', field: 'sale_price' },
    { header: 'HSN/SAC Code', field: 'hsn' },
    { header: 'Action', field: 'actions', isAction: true }
  ]);
 

  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (item) => {
    console.log('Editing item:', item);
    // Implement your edit logic here
  };

  const handleDelete = (item) => {
    console.log('Deleting item:', item);
    // Implement your delete logic here
  };



  React.useEffect(() => {
    setIsLoading(true);
    dispatch(Listitems({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setItemList(data?.data);
        console.log(data.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  return (
    <div>
      <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
        <Navbarside />
        {isLoading && <Loader />}
        <div className="col-md-10">
          <div className="row top-header">
            <div className="col-md-7">
              <div className="company-name">{Name}</div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-default" onClick={() => navigate('/ledger')}>
                  Ledger
                </button>
                <button type="submit" className="btn btn-default">
                  Sale
                </button>
                <button type="submit" className="btn btn-default">
                  Purchase
                </button>
              </div>
            </div>
          </div>
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Items</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Items</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Items List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/add-item')}>
                    Add Item
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  {/* <div className="card custom-card mb-4">
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label>
                            <select name="pageSize" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="form-select">
                              <option value="25">25</option>
                              <option value="50">50</option>
                              <option value="100">100</option>
                            </select>
                            &nbsp;items/page
                          </label>
                        </div>
                        <div className="col-md-6">
                          <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            style={{ float: 'right', width: 'auto' }}
                            // onChange={onSearchChange}
                          />
                        </div>
                      </div>
                      <table className="table table-bordered border-bottom">
                        <thead>
                          <tr>
                            <th>Product Type</th>
                            <th>Category</th>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>HSN/SAC Code</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems?.map((itemlist, index) => (
                            <tr key={index}>
                              <td>{itemlist?.type}</td>
                              <td>{itemlist?.category_name}</td>
                              <td>{itemlist?.name}</td>
                              <td>{itemlist?.sale_price}</td>
                              <td>{itemlist?.hsn}</td>
                              <td>
                                <button className="btn-sm btn-default">Edit</button>
                                <button className="btn-sm btn-cancel">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="PaginationContainer">
                        <span className="total-elements">
                          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, itemList?.length)} of {itemList?.length} entries
                        </span>
                        <Pagination currentPage={currentPage} totalCount={itemList?.length} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />
                      </div>
                    </div>
                  </div> */}
                 <Table
                    columns={columns}
                    data={itemList}
                    isFooter={false}
                    tableRef={tableRef}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    currentPage={currentPage}
                    totalCount={itemList?.length}
                    onPageChange={handlePageChange}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Item;