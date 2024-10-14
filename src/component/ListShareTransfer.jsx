import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { ListShareTransfer } from '../store/slices/share-transfer.js';
import Navbarside from './Navbarside.jsx';
import Loader from '../common/Loader.jsx';
import Footer from './Footer.jsx';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table.jsx';
import AdminLayout from './AdminLayout';

const MembersMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [listsharetransfer, setListShareTransfer] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Date', field: 'date_added'},
    { header: 'Transferror Name', field: 'transferror_name'},
    { header: 'Transferee Name', field: 'transferee_name'},
    { header: 'Date Registration', field: 'date_registration'},
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
      navigate(`/share-transfer/edit/${item.id ? item.id : null}`)
  };

//   const handleDelete = (item) => {
//     console.log('Deleting item:', item);
//     // Implement your delete logic here
//   };


 
  React.useEffect(() => {
    setIsLoading(true);
    dispatch(ListShareTransfer({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListShareTransfer(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter data based on search query
  const filteredParties = listsharetransfer?.filter(party => 
    party?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.address?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.phone?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.date_added?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Share/Debenture Transfer Master</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Registers</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                       Share/Debenture Transfer List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/registers/debanturetransfer')}>
                      Add Share/Debenture Transfer
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

export default MembersMaster;
