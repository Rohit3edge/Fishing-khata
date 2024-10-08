import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { updateSettingsField } from "../../store/slices/settings";
import { FaTimes } from 'react-icons/fa';
import axios from "axios";

const TaxesGst = ({ data }) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state?.settings?.updatesettings);

  const [show, setShow] = useState(false);
  const [taxData, setTaxData] = useState([]);
  const [formData, setFormData] = useState({
    taxType: '',
    taxName: '',
    taxPercentage: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchTaxData();
  }, []);

  // Fetch tax data from API
  const fetchTaxData = async () => {
    try {
      const response = await axios.get('/api/taxes'); // Replace with your GET API endpoint
      setTaxData(response.data);
    } catch (error) {
      console.error("Error fetching tax data", error);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
    setFormData({ taxType: '', taxName: '', taxPercentage: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Save or Update
  const handleSave = async () => {
    try {
      if (isEditing) {
        // Update existing tax data
        await axios.put(`/api/taxes/${taxData[editIndex].id}`, formData); // Replace with your PUT API endpoint
      } else {
        // Save new tax data
        await axios.post('/api/taxes', formData); // Replace with your POST API endpoint
      }
      // Refresh tax data
      fetchTaxData();
      handleClose();
    } catch (error) {
      console.error("Error saving tax data", error);
    }
  };

  // Handle Edit
  const handleEdit = (index) => {
    const tax = taxData[index];
    setFormData({ taxType: tax.taxType, taxName: tax.taxName, taxPercentage: tax.taxPercentage });
    setIsEditing(true);
    setEditIndex(index);
  };

  // Save Inline Edit
  const handleInlineSave = async (index) => {
    try {
      await axios.put(`/api/taxes/${taxData[index].id}`, taxData[index]); // PUT API call to update tax data
      setIsEditing(false);
      setEditIndex(null);
      fetchTaxData(); // Refresh tax data after editing
    } catch (error) {
      console.error("Error updating tax data", error);
    }
  };

  const handleInlineChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTaxData = [...taxData];
    updatedTaxData[index] = { ...updatedTaxData[index], [name]: value };
    setTaxData(updatedTaxData);
  };



  return (
    <>
      <div id="taxes" role="tabpanel" aria-labelledby="taxes-tab">
        <div className="container">
          <div className="row pt-4">
            <div className="col-12 pt-1">
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group row mb-3">
                    <button className="btn ripple btn-default" onClick={handleShow}>
                      {isEditing ? "Edit Tax" : "Add Tax"}
                    </button>
                  </div>

                  {/* Additional settings */}
                  <div className="form-group row mb-0">
                    <label className="col-sm-8 col-form-label d-flex align-items-center">
                      Additional Tax On Item
                    </label>
                    <div className="col-sm-4">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={setting?.item_tax_default_value ?? data?.item_tax_default_value}
                          onChange={(e) => {
                            dispatch(updateSettingsField({ item_tax_default_value: e.target.checked }));
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group row pt-2 pb-2">
                    <label className="col-sm-8 col-form-label d-flex align-items-center">
                      Composite Scheme
                    </label>
                    <div className="col-sm-4">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={setting?.is_composite ?? data?.is_composite}
                          onChange={(e) => {
                            dispatch(updateSettingsField({ is_composite: e.target.checked }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adding or Editing Tax */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header >
          <Modal.Title>{isEditing ? "Edit Tax" : "Add Tax"}</Modal.Title>
          <Button variant="link" onClick={handleClose} className="ml-auto" style={{ color: 'black', fontSize: '1.5rem' }}>
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <div className="row">
              <div className="col-md-3">
                <label>Tax Type</label>
                <input
                  name="taxType"
                  className="form-control"
                  type="text"
                  value={formData.taxType}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <label>Tax Name</label>
                <input
                  name="taxName"
                  className="form-control"
                  type="text"
                  value={formData.taxName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3">
                <label>Tax (%)</label>
                <input
                  name="taxPercentage"
                  className="form-control"
                  type="text"
                  value={formData.taxPercentage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-2">
                <label>Action</label>
                <Button className="btn ripple btn-default" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
          <hr />
        {/* Responsive Table Section */}
        <div className="table-responsive mt-4">
          {taxData.length > 0 ? (
            <table className="table item-table">
              <thead>
                <tr>
                  <th className="text-center">Tax Type</th>
                  <th className="text-center">Tax Name</th>
                  <th className="text-center">Tax Percentage (%)</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {taxData.map((tax, index) => (
                  <tr key={index}>
                    <td className="text-center">
                      {editIndex === index ? (
                        <input
                          name="taxType"
                          className="form-control"
                          type="text"
                          value={tax.taxType}
                          onChange={(e) => handleInlineChange(e, index)}
                        />
                      ) : (
                        tax.taxType
                      )}
                    </td>
                    <td className="text-center">
                      {editIndex === index ? (
                        <input
                          name="taxName"
                          className="form-control"
                          type="text"
                          value={tax.taxName}
                          onChange={(e) => handleInlineChange(e, index)}
                        />
                      ) : (
                        tax.taxName
                      )}
                    </td>
                    <td className="text-center">
                      {editIndex === index ? (
                        <input
                          name="taxPercentage"
                          className="form-control"
                          type="text"
                          value={tax.taxPercentage}
                          onChange={(e) => handleInlineChange(e, index)}
                        />
                      ) : (
                        tax.taxPercentage
                      )}
                    </td>
                    <td className="text-center">
                      {editIndex === index ? (
                        <Button className="btn btn-sm btn-success" onClick={() => handleInlineSave(index)}>
                          Save
                        </Button>
                      ) : (
                        <>
                          <Button className="btn btn-sm btn-primary" onClick={() => handleEdit(index)}>
                            Edit
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="alert alert-info text-center">No tax data available</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default TaxesGst;
