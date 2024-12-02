import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { ListAsset } from '../store/slices/assets';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';
import AdminLayout from './AdminLayout';

const LedgerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [listAsset, setListAsset] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Voucher', field: 'voucher' },
    { header: 'Invoice Value', field: 'invoice_value' },
    { header: 'Particulars', field: 'particulars' },
    { header: 'Classification', field: 'classification' },
    { header: 'Date Added', field: 'date_added' },
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
     navigate(`/assets/edit/${item?.id ? item?.id : null}`)
  };
 


  const handleDelete = (item) => {    
    console.log('Deleting item:', item);
    // Implement your delete logic here
  };



  React.useEffect(() => {
    setIsLoading(true);
    dispatch(ListAsset({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListAsset(data?.data); 
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
  const filteredParties = listAsset?.filter(party => 
    party?.particulars?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.classification?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Assets</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Assets List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/assets/create')}>
                       Add Assets
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

export default LedgerList;