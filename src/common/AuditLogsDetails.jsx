import React from 'react';
import { Modal, Button } from 'react-bootstrap';


const AuditLogDetails = ({ show, handleClose, oldValues, newValues }) => {
  // Parse old and new values
  const oldData = oldValues && oldValues !== "[]" ? JSON.parse(oldValues) : {};
  const newData = newValues && newValues !== "[]" ? JSON.parse(newValues) : {};

  // Helper function to render key-value pairs
  const renderData = (data) => {
    return Object.keys(data)?.map((key) => (
      // <li className="list-group-item" key={key}>
      //   <strong>{key}:</strong> {JSON.stringify(data[key])}
      // </li>

<div key={key}>
<strong>{key}:</strong> 
<span>{JSON.stringify(data[key])}</span> <br />
</div>
    ));
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header >
        <Modal.Title>Audit Log Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {/* Old Data Section */}
          <div className="col-md-6">
            <h5 className='font-weight-bold'>Old Data</h5>
            <ul className="list-group">
              {Object.keys(oldData)?.length > 0 ? (
                renderData(oldData)
              ) : (
                <li >No old data available</li>
              )}
            </ul>
          </div>
          {/* New Data Section */}
          <div className="col-md-6">
            <h5 className='font-weight-bold'>New Data</h5>
            <ul className="list-group">
              {Object.keys(newData)?.length > 0 ? (
                renderData(newData)
              ) : (
                <li >No new data available</li>
              )}
            </ul>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="btn btn-danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AuditLogDetails;
