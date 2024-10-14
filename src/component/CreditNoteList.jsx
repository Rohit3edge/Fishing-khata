import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { GetCreditNotelist } from '../store/slices/sale';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';

const CreditNoteList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [creditNotelist, setCreditNotelist] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Credit Note Number', field: 'credit_note_number' },
    { header: 'Invoice Number', field: 'invoice_id' },
    { header: 'Customer', field: 'party_name' },
    {header: 'Credit Note Date', field: 'credit_note_date' },
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
      navigate(`/creditnote/edit/${item.id}`);
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
    dispatch(GetCreditNotelist({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setCreditNotelist(data?.data);
        console.log(data?.data)
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = creditNotelist?.filter(party => 
    party?.credit_note_number?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.invoice_id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.party_name?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.grand_total?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.credit_note_date?.toLowerCase()?.includes(searchQuery?.toLowerCase())

  );


  return (
    <AdminLayout>
        {isLoading && <Loader />}
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
                    Credit Note/Return List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/addcreditnote')}>
                    Add Credit Note/Return
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

export default CreditNoteList;
