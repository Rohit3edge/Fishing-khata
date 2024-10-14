import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalVoucherList } from '../store/slices/journal';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';

const JournalList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [VoucherList, setVoucherList] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Voucher Name', field: 'voucher_name' },
    { header: 'Voucher Date', field: 'voucher_date' },
    { header: 'Debit Amount', field: 'debit_amount' },
    { header: 'Credit Amount', field: 'credit_amount' },
    { 
      header: 'Actions', 
      field: 'actions', 
      isAction: true, 
      actionButtons: [
        { name: 'Edit', className: 'btn-default' }, 
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
     navigate(`/editjournalvoucher/edit/${item.id ? item.id : null}`)
  };


  React.useEffect(() => {
    setIsLoading(true);
    dispatch(JournalVoucherList({profile_id:id}))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setVoucherList(data?.data);
        console.log(data.data)
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const search = searchQuery?.toLowerCase() || '';
  // Filter data based on search query
  const filteredParties = VoucherList?.filter(party => 
    party?.voucher_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.voucher_date?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    String(party?.debit_amount || '').toLowerCase().includes(search)||
    party?.credit_amount?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Journal Voucher</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Journal Voucher</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Journal Voucher List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/addjournal')}>
                  Add Journal Voucher
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
                    totalCount={filteredParties.length} 
                    onPageChange={handlePageChange}
                    handleEdit={handleEdit}
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
