import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import { Getinvoicesnextnumber, AddInvoices } from '../store/slices/sale';
import { Getsettings} from "../store/slices/settings";
import {toast } from 'react-hot-toast';
import InvoiceSecond from './InvoiceSecond';
import Select from 'react-select';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';

const AddInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;  // profile_id
  const Name = user?.data?.company_name;
  const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [listParties, setListParties] = useState([]);
  const [getInvoicesNumber, setGetInvoicesNumber] = useState();
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);
  const [invoiceSecond, setInvoiceSecond] = useState({});
  const [invoicePrefix, setInvoicePrefix] = useState();
  const [selectedPartyDetails, setSelectedPartyDetails] = useState({
    address: '',
    gstin: '',
    phone: '',
    state: '',
    ledger_id:"",
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
  });

  const [errors, setErrors] = useState({});


  const fetchInvoiceNumber = async () => {
    try {
      const data = await dispatch(Getinvoicesnextnumber()).unwrap();
      setGetInvoicesNumber(data?.next_invoice_number);
      setFormData((prevData) => ({
        ...prevData,
        invoice_number: data?.next_invoice_number,
      }));
    } catch (error) {
      console.log('Error fetching invoice number:', error.message);
    }
  };

  // Function to get list of parties
  const fetchParties = async () => {
    try {
      const data = await dispatch(ListParties({ profile_id: id })).unwrap();
      setListParties(data?.data);
      console.log(data.data)
    } catch (error) {
      console.log('Error fetching parties:', error.message);
    }
  };

  // Function to get settings
  const fetchSettings = async () => {
    try {
      const data = await dispatch(Getsettings()).unwrap();
      setInvoicePrefix(data?.data?.invoice_prefix);
    } catch (error) {
      console.log('Error fetching settings:', error.message);
    }
  };

  // useEffect to call all the three functions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchInvoiceNumber(), fetchParties(), fetchSettings()]);
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, id]);

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
        gstin: party.gstn,
        phone: party.phone,
        state: party.state,
        ledger_id:party.id,
      });

      if (isSameAsBilling) {
        setShippingAddress({
          address: party.address,
          gstin: party.gstn,
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
  if (!shippingAddress.state) {
    newErrors.shippingState = 'Shipping state is required.';
  }
  if ((invoiceSecond.invoice_items)?.length==0) {
    toast.error("Invoice items is required.")
    return
  }

  setErrors(newErrors);
  // If there are no errors, return true. Otherwise, return false.
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const billingData = {
    profile_id: Number(id),
    invoice_prefix: invoicePrefix,
    ledger_id: Number(selectedPartyDetails?.ledger_id), // Assuming this is hardcoded for now
    invoice_number: formData?.invoice_number,
    invoice_date: formData?.invoice_date,
    fin_year: '2024-2025',
    po_number: formData?.po_number,
    billing_address: selectedPartyDetails?.address,
    billing_state: selectedPartyDetails?.state,
    billing_phone: selectedPartyDetails?.phone || null,
    party_gstn: selectedPartyDetails?.gstin || null ,
    shipping_address: shippingAddress?.address,
    shipping_state: shippingAddress?.state,
    shipping_phone: shippingAddress?.phone || null,
    eway_bill: formData?.eway_number,
    vehicle_number: formData?.vehicle_number,
    notes: formData?.message,
  };

  const mergedData = {
    ...billingData,
    ...invoiceSecond,
  };

  console.log('Data to be sent:', mergedData);


  setIsLoading(true);

  try {
    // Use await to wait for the dispatch to finish
    await dispatch(AddInvoices(mergedData)).unwrap();
    toast.success('Add Invoice Successfully')
    setIsLoading(false);
    navigate('/invoicelist');
  } catch (error) {
    setIsLoading(false);
    console.log(error.message);
  }
};

  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Invoice</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Sales</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add Invoice
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
                                <Select options={partyOptions} placeholder="--Select Customer--" onChange={handlePartyChange} />
                                {errors.customer && <p className="text-danger">{errors.customer}</p>}
                              </div>
                            </div>
                            <fieldset className="form-group border p-2 mt-3">
                              <legend className="px-2">Billing Address</legend>
                              <div className="row mt-2">
                                <div className="col-md-6">
                                  <label>Address </label>
                                  <input name="address" type="text" className="form-control" value={selectedPartyDetails?.address} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>
                                    State <span className="required">*</span>
                                    </label>
                                  <input name="state" type="text" className="form-control" value={selectedPartyDetails?.state} onChange={handleInputChange} />
                                  {errors.selectedPartyState && <p className="text-danger">{errors.selectedPartyState}</p>}
                                </div>
                              </div>

                              <div className="row mt-2">
                                <div className="col-md-6">
                                  <label>GSTN </label>
                                  <input name="gstin" type="text" className="form-control" value={selectedPartyDetails?.gstin} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>Phone </label>
                                  <input name="phone" type="text" className="form-control" value={selectedPartyDetails?.phone} onChange={handleInputChange} />
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
                                  <input name="address" type="text" className="form-control" value={shippingAddress.address} onChange={handleShippingInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>
                                    State <span className="required">*</span>
                                     </label>
                                  <input name="state" type="text" className="form-control" value={shippingAddress.state} onChange={handleShippingInputChange} required />
                                  {errors.shippingState && <p className="text-danger">{errors.shippingState}</p>}
                                </div>
                              </div>

                              <div className="row mt-2">
                                <div className="col-md-6">
                                  <label>GSTN </label>
                                  <input name="gstin" type="text" className="form-control" value={shippingAddress.gstin} onChange={handleShippingInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>Phone </label>
                                  <input name="phone" type="text" className="form-control" value={shippingAddress.phone} onChange={handleShippingInputChange} />
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-md-6">
                            <div className="row">
                            <div className="col-md-6">
  <label>Invoice Number</label>
  <div className="d-flex align-items-center">
    <span className="me-2 " style={{ paddingRight:"1rem" }}>{invoicePrefix}</span>
    <input
      name="invoice_number"
      type="text"
      className="form-control"
      value={formData.invoice_number}
      onChange={handleInputChange}
      style={{ width: '90%' }} // This ensures the input takes the remaining space
    />
  </div>
</div>

                              <div className="col-md-6">
                                <label>Invoice Date </label>
                                <input
                                  name="invoice_date"
                                  type="date"
                                  className="form-control"
                                  value={!formData?.invoice_date ? currentDate : formData?.invoice_date}
                                  max={currentDate}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>E-Way Bill Number </label>
                                <input name="eway_number" type="text" className="form-control" value={formData.eway_number} onChange={handleInputChange} />
                              </div>

                              <div className="col-md-6">
                                <label>Vehicle Number </label>
                                <input name="vehicle_number" type="text" className="form-control" value={formData.vehicle_number} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>PO Number </label>
                                <input name="po_number" type="text" className="form-control" value={formData.po_number} onChange={handleInputChange} />
                              </div>

                              <div className="col-md-6">
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label>Notes </label>
                            <textarea name="message" className="form-control" rows="6" cols="70" value={formData.message} onChange={handleInputChange}></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <InvoiceSecond onChildDataChange={setInvoiceSecond} onSubmit={handleSubmit}/>
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
  );
};

export default AddInvoice;
