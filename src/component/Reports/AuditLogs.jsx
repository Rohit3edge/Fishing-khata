import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAuditlogList,GetAuditlogDetail } from '../../store/slices/reports';
import Loader from '../../common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../common/Table';
import AdminLayout from '../AdminLayout';
import AuditLogDetails from '../../common/AuditLogsDetails'; 


const AuditLogs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableRef=useRef(null)

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
 
  const [isLoading, setIsLoading] = useState(false);
  const [auditlogList, setAuditlogList] = useState([]);
  const [showModal, setShowModal] = useState(false);  // Modal visibility state
  const [selectedLog, setSelectedLog] = useState(null);  // Selected audit log data
  const [columns, setcolumns] = useState([
    { header: 'Date', field: 'created_at' },
    { header: 'Module', field: 'module_name' },
    { header: 'Action', field: 'action_type' },
    { header: 'Action By', field: 'action_by' },


    { 
      header: 'Actions', 
      field: 'actions', 
      isAction: true, 
      actionButtons: [
        { name: 'View Logs Details', className: 'btn-default' }, 
      ]
    }
  ]);
 

  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleView = async (item) => {
    // setSelectedLog(item);
    console.log(item.id)
    setShowModal(true);
    setIsLoading(true);
   await dispatch(GetAuditlogDetail({ profile_id: id ,id:item.id}))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setSelectedLog(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  React.useEffect(() => {
    setIsLoading(true);
    dispatch(GetAuditlogList({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        console.log(data?.data)
        setAuditlogList(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filtereditemList = auditlogList?.filter(party => 
    party?.created_at?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    party?.action_by?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.module_name?.toLowerCase()?.includes(searchQuery?.toLowerCase())||
    party?.action_type?.toLowerCase()?.includes(searchQuery?.toLowerCase())

  );


  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Audit Logs</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Reports</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Audit Logs List
                    </li>
                  </ol>
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
                    handleView={handleView}
                    handleSearchChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {selectedLog && (
        <AuditLogDetails 
          show={showModal}
          handleClose={handleCloseModal}
          oldValues={selectedLog.old_values}
          newValues={selectedLog.new_values}
        />
      )}
        </AdminLayout>
  );
};

export default AuditLogs;
