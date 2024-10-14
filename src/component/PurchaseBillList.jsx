import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { CreatePurchaseVoucherList } from '../store/slices/purchase';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';

const PurchaseBillList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [purchaseVoucherlist, setPurchaseVoucherlist] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Bill NO', field: 'bill_no' },
    {header: 'Date', field: 'date_added' },
    { header: 'Party', field: 'party_name' },  
    { header: 'Party Gstn', field: 'party_gstn' },
    { header: 'Amount', field: 'total_amount' },
   
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
      navigate(`/purchase/editpurchasevoucher/${item.id}`);
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
    dispatch(CreatePurchaseVoucherList({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        console.log("the data",data?.data)
        setPurchaseVoucherlist(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const filtereditemList = purchaseVoucherlist?.filter(party => 
    party?.bill_no?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.date_added?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.party_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.billing_state?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.total_amount?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );


  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Purchase Voucher</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Purchase</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Purchase Voucher List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/purchase/addpurchasevoucher')}>
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
        </AdminLayout>
  );
};

export default PurchaseBillList;
