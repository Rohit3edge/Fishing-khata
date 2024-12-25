import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {Closingstocklist,Deleteclosingstock} from '../store/slices/bankbook';
import Loader from '../common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';

const JournalList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;


  const [isLoading, setIsLoading] = useState(false);
  const [VoucherList, setVoucherList] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Closing Date', field: 'closing_date' },
    { header: 'Closing Value', field: 'closing_value' },
    { header: 'Transactions Type', field: 'dr_cr' },
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
     navigate(`/editclosingstock/edit/${item.id ? item.id : null}`)
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Journal Voucher?");
    if (confirmDelete) {
          setIsLoading(true);
           dispatch(Deleteclosingstock({ id: item.id, profile_id: id }))
          .unwrap()
          .then((data) => {
              setIsLoading(false);
              fetchClosingStockList();
          })
          .catch(({ message }) => {
            setIsLoading(false);
            console.log(message);
          });
    } else {
      console.log("Deletion canceled");
    }
  };



  React.useEffect(() => {
    fetchClosingStockList()
  }, [dispatch]);

  const fetchClosingStockList = async () => {
    setIsLoading(true);
    try {
      const data = await dispatch(Closingstocklist({ profile_id: id })).unwrap();
      console.log(data);
      setVoucherList(data?.data || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter data based on search query
  const filteredParties = VoucherList?.filter(party => 
    party?.closing_date?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.closing_value?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.dr_cr?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );
  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Closing Stock</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Closing Stock</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Closing Stock List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/addclosingstock')}>
                  Add Closing Stock
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12"> 
                 <Table
                    columns={columns}
                    data={filteredParties} 
                    tableRef={tableRef}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    currentPage={currentPage}
                    totalCount={filteredParties?.length} 
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

export default JournalList;
