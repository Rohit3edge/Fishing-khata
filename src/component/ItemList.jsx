import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { Listitems , Deleteitems} from '../store/slices/items';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';

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
    { header: 'Sale Price', field: 'sale_price' },
    { header: 'Purchase Price', field: 'purchase_price' },
    { 
      header: 'Actions', 
      field: 'actions', 
      isAction: true, 
      actionButtons: [
        { name: 'Edit', className: 'btn-default' }, 
        { name: 'Delete', className: 'btn-cancel' }
      ]
    }
  ]);
 

  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (item) => {
      navigate(`/edit-item/${item.id ? item.id : null}`)
      // Implement your edit logic here
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Items?");
      if (confirmDelete) {
            setIsLoading(true);
            dispatch(Deleteitems({ id: item.id }))
            .unwrap()
            .then((data) => {
                setIsLoading(false);
                hindleReturn();
            })
            .catch(({ message }) => {
              setIsLoading(false);
              console.log(message);
            });
      } else {
        console.log("Deletion canceled");
      }
  };

  const hindleReturn = () => {
    setIsLoading(true);
    dispatch(Listitems({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setItemList(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };



  React.useEffect(() => {
    setIsLoading(true);
    dispatch(Listitems({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setItemList(data?.data);

      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = itemList?.filter(party => 
    party?.type?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.category_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.sale_price?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.purchase_price?.toLowerCase()?.includes(searchQuery?.toLowerCase())

  );


  return (
    <AdminLayout>
        {isLoading && <Loader />}
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
                    data={filtereditemList}
                    tableRef={tableRef}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    currentPage={currentPage}
                    totalCount={filtereditemList?.length}
                    onPageChange={handlePageChange}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleSearchChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
  );
};

export default Item;
