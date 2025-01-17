import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import {GetState } from '../store/slices/ledger';
import { GetQuotationSingleDetails,QuotationUpdate } from '../store/slices/sale';
import UpdateQuotationSecond from './UpdateQuotationSecond';
import Select from 'react-select';
import Loader from '../common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';

const UpdateAddInvoice = () => {
  const { id } = useParams();
  const invoiceId = id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.data?.id; // profile_id
  const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [listParties, setListParties] = useState([]);
  const [state, setState] = useState([]);
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);
  const [invoiceSecond, setInvoiceSecond] = useState([]);
  const [invoicedetails, setInvoicedetails] = useState({});
  const [selectedPartyDetails, setSelectedPartyDetails] = useState({
    address: '',
    gstin: '',
    phone: '',
    state: '',
    ledger_id: '',
    party_id: '',
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    gstin: '',
    phone: '',
    state: '',
  });

  // New state for additional fields
  const [formData, setFormData] = useState({
    invoice_date: currentDate,
    eway_number: '',
    vehicle_number: '',
    message: '',
    invoice_number: '',
    po_number: '',
    invoice_prefix:""
  });
  const [errors, setErrors] = useState({});
  // Fetch invoice details if editing
  useEffect(() => {
    // console.log(selectedPartyDetails)
    if (invoiceId && userId) {
      setIsLoading(true);
      dispatch(GetQuotationSingleDetails({ profile_id: userId, invoice_id: invoiceId }))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const invoice = data?.data?.invoice;
          setInvoicedetails(data?.data || {});
          setFormData({
            invoice_date: invoice?.quotation_date || currentDate,
            message: invoice?.notes || '',
            invoice_number: invoice?.quotation_number || '',
            invoice_prefix:invoice?.quotation_prefix
          });
          setSelectedPartyDetails({
            address: invoice?.billing_address || '',
            gstin: invoice?.party_gstn || '',
            phone: invoice?.billing_phone || '',
            state: invoice?.billing_state || '',
            ledger_id: invoice?.ledger_id || '',
          });
          setShippingAddress({
            address: invoice?.shipping_address || '',
            gstin: invoice?.party_gstn || '',
            phone: invoice?.shipping_phone || '',
            state: invoice?.shipping_state || '',
          });
          setInvoiceSecond(invoice?.items || []); // Assuming the invoice items are in `items`
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [dispatch, invoiceId, userId]);

  // Fetch the list of parties
  useEffect(() => {
    
    setIsLoading(true);
    dispatch(ListParties({ profile_id: userId }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListParties(data?.data || []);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch, userId]);

  const fetchState = async () => {
    try {
      const data = await dispatch(GetState()).unwrap();
      setState(data?.data);;
    } catch (error) {
      console.log('Error fetching State:', error.message);
    }
  };

  useEffect(() => {
    fetchState()
  }, []);

  // Party selection logic
  const partyOptions = listParties.map((party) => ({
    value: party.id,
    label: party.ledger,
  }));

  const handlePartyChange = (selectedOption) => {
    const party = listParties.find((p) => p.id === selectedOption.value);
    if (party) {
      setSelectedPartyDetails({
        address: party.address,
        gstin: party.gstin,
        phone: party.phone,
        state: party.state,
        ledger_id: party.id,
      });

      if (isSameAsBilling) {
        setShippingAddress({
          address: party.address,
          gstin: party.gstin,
          phone: party.phone,
          state: party.state,
        });
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle input changes for selectedPartyDetails (Billing Address)
  const handleBillingInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPartyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  
  
    // Shipping address changes
    const handleShippingInputChange = (e) => {
      const { name, value } = e.target;
      setShippingAddress((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };

  // Checkbox for "Same as Billing Address"
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsSameAsBilling(checked);

    if (checked) {
      setShippingAddress({
        address: selectedPartyDetails.address,
        gstin: selectedPartyDetails.gstin,
        phone: selectedPartyDetails.phone,
        state: selectedPartyDetails.state,
      });
    }
  };


  const validateForm = () => {
    let newErrors = {};
    if (!selectedPartyDetails.ledger_id) {
      newErrors.customer = 'Customer is required.';
    }
    if (!selectedPartyDetails.state) {
      newErrors.selectedPartyState = 'Billing state is required.';
    }
    if (!formData.invoice_number) {
      newErrors.invoice_number = 'Quotation Number is required.';
    }
    if (!formData.invoice_date) {
      newErrors.invoice_date = 'Expiry Date is required.';
    }
    if (!shippingAddress.state) {
      newErrors.shippingState = 'Shipping state is required.';
    }
    if (!invoiceSecond.invoice_items) {
      // newErrors.invoice_items = 'Invoice items is required.';
      alert('Invoice items is required.');
    }

    setErrors(newErrors);
    // If there are no errors, return true. Otherwise, return false.
    return Object.keys(newErrors).length === 0;
  };

// console.log(invoicedetails?.invoice?.id)
  // Form submission logic
  const handleSubmit = (e) => {
    e.preventDefault();

    const billingData = {
      invoice_prefix:formData.invoice_prefix,
      invoice_id: Number(invoicedetails?.invoice?.id),
      profile_id: Number(userId),
      ledger_id: Number(selectedPartyDetails.ledger_id),
      invoice_number: formData.invoice_number,
      invoice_date: formData.invoice_date,
      fin_year: '2024-2025',
      billing_address: selectedPartyDetails.address || null,
      billing_state: selectedPartyDetails.state,
      billing_phone: selectedPartyDetails.phone || null,
      party_gstn: selectedPartyDetails.gstin || null,
      shipping_address: shippingAddress.address || null,
      shipping_state: shippingAddress.state,
      shipping_phone: shippingAddress.phone || null,
      notes: formData.message,
    };
 
    const mergedData = {
      ...billingData,
      ...invoiceSecond,
    };
    // console.log(mergedData)
    if(validateForm()){

    setIsLoading(true);
    dispatch(QuotationUpdate(mergedData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        navigate('/quotation/list');
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
            
    }
  };


  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Quotation Edit</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Quotation List </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                       Quotation Edit
                    </li>
                  </ol>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="card custom-card">
                    <div className="card-body">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="row">
                              <div className="col-md-12">
                                <label>
                                  Customer <span className="required">*</span>
                                </label>
                                <Select
                                  options={partyOptions}
                                  placeholder="--Select Customer--"
                                  onChange={handlePartyChange}
                                  value={partyOptions.find((option) => option.value === selectedPartyDetails.ledger_id) || null}
                                />
                              </div>
                            </div>
                            <fieldset className="form-group border p-2 mt-3">
                              <legend className="px-2">Billing Address</legend>
                              <div className="row mt-2">
                                <div className="col-md-6">
                                  <label>Address </label>
                                  <input name="address" type="text" className="form-control" value={selectedPartyDetails?.address || ''} onChange={handleBillingInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>State </label>
                                  {/* <input name="state" type="text" className="form-control" value={selectedPartyDetails?.state || ''} onChange={handleBillingInputChange} /> */}
                                  <select className="form-control" name="state" value={selectedPartyDetails?.state || ''} onChange={handleBillingInputChange}>
                                <option value="">--Select State--</option>
                                {(state || []).map((option, index) => (
                                  <option key={index} value={option?.state_name}>
                                    {option?.state_name}
                                  </option>
                                ))}
                              </select>
                                </div>
                              </div>

                              <div className="row mt-2">
                                <div className="col-md-6">
                                  <label>GSTN </label>
                                  <input name="gstin" type="text" className="form-control" value={selectedPartyDetails?.gstin || ''} onChange={handleBillingInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>Phone </label>
                                  <input name="phone" type="text" className="form-control" value={selectedPartyDetails?.phone || ''} onChange={handleBillingInputChange} />
                                </div>
                              </div>
                            </fieldset>
                          </div>

                          <div className="col-md-6">
                            <div className="row">
                              <div className="col-md-12 mt-4">
                                <label className="ckbox pt-3">
                                  <input type="checkbox" className="mx-2" checked={isSameAsBilling} onChange={handleCheckboxChange} />
                                  <span>Same as Billing Address</span>
                                </label>
                              </div>
                            </div>

                            <fieldset className="form-group border p-2 mt-3">
                              <legend className="px-2">Shipping Address</legend>
                              <div className="row mt-2">
                                <div className="col-md-6">
                                  <label>Address </label>
                                  <input name="address" type="text" className="form-control" value={shippingAddress.address || ''} onChange={handleShippingInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>State </label>
                                  {/* <input name="state" type="text" className="form-control" value={shippingAddress.state || ''} onChange={handleShippingInputChange} /> */}
                                  <select className="form-control" name="state" value={shippingAddress.state || ''} onChange={handleShippingInputChange}>
                                <option value="">--Select State--</option>
                                {(state || []).map((option, index) => (
                                  <option key={index} value={option?.state_name}>
                                    {option?.state_name}
                                  </option>
                                ))}
                              </select>
                                </div>
                              </div>

                              <div className="row mt-2">
                                <div className="col-md-6">
                                  <label>GSTN </label>
                                  <input name="gstin" type="text" className="form-control" value={shippingAddress.gstin || ''} onChange={handleShippingInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>Phone </label>
                                  <input name="phone" type="text" className="form-control" value={shippingAddress.phone || ''} onChange={handleShippingInputChange} />
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-md-6">
                            <div className="row">
                              {/* <div className="col-md-6">
                                <label>Invoice Number </label>
                                <input name="invoice_number" type="text" className="form-control" value={formData.invoice_number || ''} onChange={handleInputChange} readOnly/>
                              </div> */}
                              <div className="col-md-6">
  <label>
    Quotation Number <span className="required">*</span>
    </label>
  <div className="d-flex align-items-center">
    <span className="me-2 " style={{ paddingRight:"1rem" }}>{formData.invoice_prefix }</span>
    <input
      name="invoice_number"
      type="text"
      className="form-control"
      value={formData.invoice_number}
      onChange={handleInputChange}
      style={{ width: '90%' }} // This ensures the input takes the remaining space
    />
  </div>
  {errors.invoice_date && <p className="text-danger">{errors.invoice_date}</p>}
</div>

                              <div className="col-md-6">
                                <label>
                                  Expiry Date <span className="required">*</span>
                                   </label>
                                <input
                                  name="invoice_date"
                                  type="date"
                                  className="form-control"
                                  value={!formData?.invoice_date ? currentDate : formData?.invoice_date}
                                  max={currentDate}
                                  onChange={handleInputChange}
                                />
                                {errors.invoice_date && <p className="text-danger">{errors.invoice_date}</p>}
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label>Notes </label>
                            <textarea name="message" className="form-control" rows="6" cols="70" value={formData.message || ''} onChange={handleInputChange}></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <UpdateQuotationSecond onChildDataChange={setInvoiceSecond} onSubmit={handleSubmit} data={invoicedetails} />
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
  );
};

export default UpdateAddInvoice;
