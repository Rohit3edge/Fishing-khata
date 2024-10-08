import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import { GetInvoicesSingleDetails,InvoiceUpdate } from '../store/slices/sale';
import UpdateInvoiceSecond from './UpdateInvoiceSecond';
import Select from 'react-select';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';

const UpdateAddInvoice = () => {
  const { id } = useParams();
  const invoiceId = id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.data?.id; // profile_id
  const Name = user?.data?.company_name;
  const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [listParties, setListParties] = useState([]);
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

  // Fetch invoice details if editing
  useEffect(() => {
    console.log(selectedPartyDetails)
    if (invoiceId && userId) {
      setIsLoading(true);
      dispatch(GetInvoicesSingleDetails({ profile_id: userId, invoice_id: invoiceId }))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const invoice = data?.data?.invoice;
          setInvoicedetails(data?.data || {});
          setFormData({
            invoice_date: invoice?.invoice_date || currentDate,
            eway_number: invoice?.eway_bill || '',
            vehicle_number: invoice?.vehicle_number || '',
            message: invoice?.notes || '',
            invoice_number: invoice?.invoice_number || '',
            po_number: invoice?.po_number || '',
            invoice_prefix:invoice?.invoice_prefix
          });
          setSelectedPartyDetails({
            address: invoice?.billing_address || '',
            gstin: invoice?.party_gstn || '',
            phone: invoice?.billing_phone || '',
            state: invoice?.billing_state || '',
            ledger_id: invoice?.ledger_id || '',
            party_id: invoice?.party_id || '',
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
        ledger_id: party.id,
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
      po_number: formData.po_number,
      billing_address: selectedPartyDetails.address,
      billing_state: selectedPartyDetails.state,
      billing_phone: selectedPartyDetails.phone,
      party_gstn: selectedPartyDetails.gstin,
      shipping_address: shippingAddress.address,
      shipping_state: shippingAddress.state,
      shipping_phone: shippingAddress.phone,
      eway_bill: formData.eway_number,
      vehicle_number: formData.vehicle_number,
      notes: formData.message,
    };
 
    const mergedData = {
      ...billingData,
      ...invoiceSecond,
    };
    console.log(mergedData)
    setIsLoading(true);
    dispatch(InvoiceUpdate(mergedData))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        navigate('/invoicelist');
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });

  };


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
                <button type="button" className="btn btn-default" onClick={() => navigate('/ledger')}>
                  Ledger
                </button>
                <button type="button" className="btn btn-default" onClick={() => navigate('/invoice')}>
                  Sale
                </button>
                <button type="button" className="btn btn-default">
                  Purchase
                </button>
              </div>
            </div>
          </div>
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
                                  <input name="address" type="text" className="form-control" value={selectedPartyDetails?.address || ''} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>State </label>
                                  <input name="state" type="text" className="form-control" value={selectedPartyDetails?.state || ''} onChange={handleInputChange} />
                                </div>
                              </div>

                              <div className="row mt-2">
                                <div className="col-md-6">
                                  <label>GSTN </label>
                                  <input name="gstin" type="text" className="form-control" value={selectedPartyDetails?.gstin || ''} onChange={handleInputChange} />
                                </div>
                                <div className="col-md-6">
                                  <label>Phone </label>
                                  <input name="phone" type="text" className="form-control" value={selectedPartyDetails?.phone || ''} onChange={handleInputChange} />
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
                                  <input name="state" type="text" className="form-control" value={shippingAddress.state || ''} onChange={handleShippingInputChange} />
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
  <label>Invoice Number</label>
  <div className="d-flex align-items-center">
    <span className="me-2 " style={{ paddingRight:"1rem" }}>{formData.invoice_prefix }</span>
    <input
      name="invoice_number"
      type="text"
      className="form-control"
      value={formData.invoice_number}
      readOnly
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
                                <input name="eway_number" type="text" className="form-control" value={formData.eway_number || ''} onChange={handleInputChange} />
                              </div>

                              <div className="col-md-6">
                                <label>Vehicle Number </label>
                                <input name="vehicle_number" type="text" className="form-control" value={formData.vehicle_number || ''} onChange={handleInputChange} />
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
                  <UpdateInvoiceSecond onChildDataChange={setInvoiceSecond} onSubmit={handleSubmit} data={invoicedetails} />
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

export default UpdateAddInvoice;
