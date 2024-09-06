import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import InvoiceSecond from './InvoiceSecond';
import Select from 'react-select';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';

const AddInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;
  const Name = user?.data?.company_name;

  const [isLoading, setIsLoading] = useState(false);

  const [listParties, setListParties] = useState([]);
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);
  const [selectedPartyDetails, setSelectedPartyDetails] = useState({
    address: '',
    gstin: '',
    phone: '',
    state: '',
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    gstin: '',
    phone: '',
    state: '',
  });


  useEffect(() => {
    setIsLoading(true);
    dispatch(ListParties({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListParties(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  const partyOptions = listParties.map((party) => ({
    value: party.id,
    label: party.name,
  }));

  const handlePartyChange = (selectedOption) => {
    const party = listParties.find((p) => p.id === selectedOption.value);
    if (party) {
      setSelectedPartyDetails({
        address: party.address,
        gstin: party.gstin,
        phone: party.phone,
        state: party.state,
      });

      if (isSameAsBilling) {
        setShippingAddress({
          address: party.address,
          gstin: party.gstin,
          phone: party.phone,
          state: party.state,
        });
      }
    } else {
      setSelectedPartyDetails({
        address: '',
        gstin: '',
        phone: '',
        state: '',
      });

      if (isSameAsBilling) {
        setShippingAddress({
          address: '',
          gstin: '',
          phone: '',
          state: '',
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPartyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

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
    } else {
      setShippingAddress({
        address: '',
        gstin: '',
        phone: '',
        state: '',
      });
    }
  };

  const handleSubmit = () => {
    const billingData = {
      billing_address: selectedPartyDetails.address,
      billing_gstin: selectedPartyDetails.gstin,
      billing_phone: selectedPartyDetails.phone,
      billing_state: selectedPartyDetails.state,
      shipping_address: shippingAddress.address,
      shipping_gstin: shippingAddress.gstin,
      shipping_phone: shippingAddress.phone,
      shipping_state: shippingAddress.state,
    };

    console.log('Data to be sent:', billingData);

    // Send this data to your API
    // Example: dispatch(submitInvoice(billingData));
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
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={() => navigate('/addparty')}>
                    Add Invoice
                  </button>
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
                                  <label>State </label>
                                  <input name="state" type="text" className="form-control" value={selectedPartyDetails?.state} onChange={handleInputChange} />
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
                                  <input
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    value={shippingAddress.address}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    readOnly={isSameAsBilling}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label>State </label>
                                  <input
                                    name="state"
                                    type="text"
                                    className="form-control"
                                    value={shippingAddress.state}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                    readOnly={isSameAsBilling}
                                  />
                                </div>
                              </div>

                              <div className="row mt-2">
                                <div className="col-md-6">
                                  <label>GSTN </label>
                                  <input
                                    name="gstin"
                                    type="text"
                                    className="form-control"
                                    value={shippingAddress.gstin}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, gstin: e.target.value })}
                                    readOnly={isSameAsBilling}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label>Phone </label>
                                  <input
                                    name="phone"
                                    type="text"
                                    className="form-control"
                                    value={shippingAddress.phone}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                    readOnly={isSameAsBilling}
                                  />
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
                                <label>Invoice Number </label>
                                <input name="invoice_number" type="text" className="form-control" />
                              </div>

                              <div className="col-md-6">
                                <label>Invoice Date </label>
                                <input name="invoice_date" type="date" className="form-control" />
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-md-6">
                                <label>E-Way Bill Number </label>
                                <input name="eway_number" type="text" className="form-control" />
                              </div>

                              <div className="col-md-6">
                                <label>Vehicle Number </label>
                                <input name="vehicle_number" type="text" className="form-control" />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label>Notes </label>
                            <textarea className="form-control" rows="6" cols="70"></textarea>
                          </div>
                        </div>
                      </div>
                      {/* <button className="btn btn-primary" onClick={handleSubmit}>Submit</button> */}
                    </div>
                  </div>
                  {/* here */} <InvoiceSecond />
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

export default AddInvoice;
