import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { GetPurchaseOrderlist } from '../store/slices/purchase';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [purchaseOrderlist, setPurchaseOrderlist] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'PO Number', field: 'po_number' },
    {header: 'Date', field: 'added_on' },
    { header: 'Party', field: 'billing_name' },  
    { header: 'Date', field: 'billing_state' },
    { header: 'Amount', field: 'grand_total' },
   
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
    if (item && item.id) {
      navigate(`/purchase/editpurchaseorder/${item.id}`);
    } else {
      console.log("Item or item.id is undefined");
    }
  };

  const handleDelete = (item) => {
    console.log('Deleting item:', item);
    // Implement your delete logic here
  };



  React.useEffect(() => {
    setIsLoading(true);
    dispatch(GetPurchaseOrderlist({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        console.log(data?.data)
        setPurchaseOrderlist(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = purchaseOrderlist?.filter(party => 
    party?.po_number?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.added_on?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.billing_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.billing_state?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.grand_total?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );


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
                <button type="submit" className="btn btn-default" onClick={() => navigate('/invoice')}>
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
                  <h2 className="main-content-title tx-24 mg-b-5">Payments</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Sale</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Payment List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/purchase/addpurchaseorder')}>
                    Add Purchase Order
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PurchaseOrderList;