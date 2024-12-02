import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { GetByQuotationlist ,quotationDelete } from '../store/slices/sale';
import Loader from '../common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';

const QuotationList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [invoicelist, setInvoicelist] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Quotation Number',field: 'quotation_combined'},
    {header: 'Date', field: 'quotation_date' },
    { header: 'Party', field: 'party_name' },
    { header: 'State', field: 'billing_state' },
    { header: 'Amount', field: 'grand_total' },
    { header: 'Payment Status', field: '' },
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
    navigate(`/quotation/edit/${item.id ? item.id : null}`)
  };


  const handleDelete = (item) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Quotation?");
    if (confirmDelete) {
          setIsLoading(true);
           dispatch(quotationDelete({ id: item.id }))
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
    dispatch(GetByQuotationlist({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setInvoicelist(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };


  React.useEffect(() => {
    setIsLoading(true);
    dispatch(GetByQuotationlist({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setInvoicelist(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = invoicelist?.filter(party => 
    party?.invoice_number?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.invoice_date?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.billing_state?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.party_name?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.grand_total?.toLowerCase()?.includes(searchQuery?.toLowerCase())

  );


  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Quotations</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Sale</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Quotation List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/quotation/create')}>
                       Add New Quotation
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

export default QuotationList;
