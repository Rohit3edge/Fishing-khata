import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { ListDirectors } from '../store/slices/directors.js';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../common/Table';

const DirectorsMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);
  const [listDirectors, setListDirectors] = useState([]);
  const [columns, setcolumns] = useState([
    { header: 'Name', field: 'name' },
    { header: 'Type', field: 'type' },
    { header: 'Email', field: 'email' },
    { header: 'Phone', field: 'phone' },
    { header: 'Date', field: 'date_added' },
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
      navigate(`/director/edit/${item.id ? item.id : null}`)
  };

//   const handleDelete = (item) => {
//     console.log('Deleting item:', item);
//     // Implement your delete logic here
//   };



  React.useEffect(() => {
    setIsLoading(true);
    dispatch(ListDirectors({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListDirectors(data?.data);
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
  const filteredParties = listDirectors?.filter(party => 
    party?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.type?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.phone?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.date_added?.toLowerCase()?.includes(searchQuery?.toLowerCase())
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
                  <h2 className="main-content-title tx-24 mg-b-5">Directors Master</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Directors Master</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Directors List
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/director/create')}>
                    Add Director
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DirectorsMaster;
