import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentOutlist ,purchasePyamentDelete } from '../store/slices/purchase';
import Loader from '../common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';

const PaymentOutList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [paymentOutlist, setPaymentOutlist] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Bill Number', field: 'bill_no' },
    { header: 'Payment Mode', field: 'pay_mode' },
    { header: 'Transaction ID', field: 'transaction_id' },
    { header: 'Customer', field: 'party_name' },
    { header: 'Amount', field: 'amount' },
    {header: 'Payment Date', field: 'payment_date' },
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
      navigate(`/purchase/editpaymentout/${item.id}`);
    } else {
      console.log("Item or item.id is undefined");
    }
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Payment Out?");
    if (confirmDelete) {
          setIsLoading(true);
           dispatch(purchasePyamentDelete({ id: item.id }))
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
    dispatch(PaymentOutlist({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setPaymentOutlist(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };



  React.useEffect(() => {
    setIsLoading(true);
    dispatch(PaymentOutlist({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setPaymentOutlist(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = paymentOutlist?.filter(party => 
    party?.bill_no?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.pay_mode?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.transaction_id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.party_name?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.amount?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.payment_date?.toLowerCase()?.includes(searchQuery?.toLowerCase())

  );


  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Payment Out</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Purchase</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                     Payment Out List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/purchase/addpaymentout')}>
                    Add New Payment Out
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

export default PaymentOutList;
