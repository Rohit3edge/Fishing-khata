import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { DebitNotelist ,debitNoteDelete } from '../store/slices/purchase';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';

const DebitNoteList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [debitNotelist, setDebitNotelist] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Debit Note Number', field: 'debit_note_number' },
    { header: 'Purchase Voucher', field: 'purchase_voucher_id' },
    { header: 'Customer', field: 'party_name' },
    {header: 'Debit Note Date', field: 'debit_note_date' },
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
      navigate(`/purchase/editdebitnote/${item.id}`);
    } else {
      console.log("Item or item.id is undefined");
    }
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Debit Note?");
    if (confirmDelete) {
          setIsLoading(true);
           dispatch(debitNoteDelete({ id: item.id }))
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
    dispatch(DebitNotelist({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
         setDebitNotelist(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };



  React.useEffect(() => {
    setIsLoading(true);
    dispatch(DebitNotelist({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setDebitNotelist(data?.data);

      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = debitNotelist?.filter(party => 
    party?.debit_note_number?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.purchase_voucher_id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.party_name?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.grand_total?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.debit_note_date?.toLowerCase()?.includes(searchQuery?.toLowerCase())

  );


  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Debit Note</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Purchase</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                     Debit Note/Return List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/purchase/adddebitnote')}>
                    Add Debit Note/Return
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

export default DebitNoteList;
