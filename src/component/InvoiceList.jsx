import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { GetByInvoiceslist } from '../store/slices/sale';
import Loader from '../common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';
import {API_BASE_URL} from "../utils/constants/api.constants";
import { FaFilePdf } from "react-icons/fa6";

const InvoiceList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [invoicelist, setInvoicelist] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Invoice Number',field: 'invoice_combined'},
    {header: 'Date', field: 'invoice_date' },
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
        { 
          className: 'btn-danger' ,
          icon: <FaFilePdf style={{ fontSize: "15px",}} />,
         }, 
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
    navigate(`/Updateaddinvoice/${item.id ? item.id : null}`)
  };
  
  const handlePDF = (item) => {
      const baseURL = API_BASE_URL; 
      const invoiceId = item?.id || 'null'; 
      window.open(`${baseURL}/pdf/invoices/${invoiceId}`, '_blank'); 
  };




  React.useEffect(() => {
    setIsLoading(true);
    dispatch(GetByInvoiceslist({ profile_id: id }))
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
                  <h2 className="main-content-title tx-24 mg-b-5">Invoices</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Sale</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Invoice List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/invoice')}>
                  Add New Invoice
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
                    handlePDF={handlePDF}
                    handleSearchChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
  );
};

export default InvoiceList;
