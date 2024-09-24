import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import { Getinvoicesnextnumber, AddInvoices } from '../store/slices/sale';
import InvoiceSecond from './InvoiceSecond';
import Select from 'react-select';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';

const DebantureTransfer  = () => {
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
  const [selectedPartyDetails, setSelectedPartyDetails] = useState({
    address: '',
    gstin: '',
    phone: '',
    state: '',
    ledger_id:""
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



  // Fetch the next invoice number
  useEffect(() => {
    setIsLoading(true);
    dispatch(Getinvoicesnextnumber())
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setGetInvoicesNumber(data?.next_invoice_number);
        setFormData((prevData) => ({
          ...prevData,
          invoice_number: data?.next_invoice_number, 
        }));
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  // Fetch the list of parties
  useEffect(() => {
    setIsLoading(true);
    dispatch(ListParties({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setListParties(data?.data);
        console.log("party",listParties)

      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  }, [dispatch]);

  // Party selection logic
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
        ledger_id:party.ledger_id
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

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const billingData = {
      profile_id:Number(id),
      party_id: Number(listParties.find((party) => party.address === selectedPartyDetails.address)?.id),
      ledger_id:Number(selectedPartyDetails.ledger_id),  // Assuming this is hardcoded for now
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
      ...invoiceSecond
    };
    console.log('Data to be sent:', mergedData);

    // Call API to submit invoice (replace comment with actual API call)
    setIsLoading(true);
    dispatch(AddInvoices(mergedData))
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
                  <h2 className="main-content-title tx-24 mg-b-5">Register of Share / Debanture Transfer</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Registers</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Share / Debanture Transfer
                    </li>
                  </ol>
                </div>

                <div class="d-flex justify-content-end">
                  <a class="btn ripple btn-default" >
                    Save
                  </a>

                  <a class="btn btn-cancel" >
                  Discard
                  </a>
                </div>
                
              </div>
              <div className="row">
                <div className="col-md-12">
                <div className="card custom-card">
                    <div className="card-body">
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-12">
                              <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>No. Of Transfer<span className="required">*</span> </label>
                                  <input name="No.Of.Transfer" type="number" className="form-control"  />
                                </div>

                                <div className="col-md-3">
                                  <label>Transferror Name</label>
                                  <input name="Transferror.Name" type="text" className="form-control"  />
                                </div>

                                <div className="col-md-3">
                                  <label>Transferror Folio No. <span className='required'>*</span> </label>
                                  <input name="Transferror.Folio.No" type="number" className="form-control"  />
                                </div>

                                <div className="col-md-3">
                                  <label>Date Of Registration </label>
                                  <input name="Date.Of.Registration" type="date" className="form-control"  />
                                </div>
                              </div>

                              <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>Date of Board Meeting </label>
                                  <input name="Board.Meeting" type="date" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                  <label>Share Debanture </label>
                                  <input name="Share.Debanture" type="number" className="form-control" />
                                </div>

                                <div className="col-md-3">
                                  <label>Distinctive No. From </label>
                                  <input name="Distinctive.From" type="number" className="form-control"  />
                                </div>

                                <div className="col-md-3">
                                  <label>Distinctive No. To </label>
                                  <input name="distinctive.to" type="number" className="form-control" />
                                </div>
                                </div>

                                <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>No. of Old Certificate </label>
                                  <input name="old.certificate" type="number" className="form-control" />
                                </div>

                                <div className="col-md-3">
                                  <label>Amount </label>
                                  <input name="amount" type="number" className="form-control"  />
                                </div>

                                <div className="col-md-3">
                                  <label>Transferre Name </label>
                                  <input name="transferre.Name" type="text" className="form-control" />
                                </div>

                                <div className="col-md-3">
                                  <label>Transferre Folio No. </label>
                                  <input name="Transferre.Folio" type="number" className="form-control" />
                                </div>
                                </div>

                                <div className="row mt-2">
                                <div className="col-md-3">
                                  <label>New Certification No </label>
                                  <input name="New.Certification.No" type="number" className="form-control"  />
                                </div>

                                <div className="col-md-3">
                                  <label>Class </label>
                                  <input name="Class" type="text" className="form-control" />
                                </div>

                                <div className="col-md-3">
                                  <label>Consideration Involved </label>
                                  <input name="Consideration.Involved" type="number" className="form-control" />
                                </div>

                                <div className="col-md-3">
                                  <label>CS Offices</label>
                                  <input name="CS.Offices" type="text" className="form-control"  />
                                </div>
                                </div>

                                <div className="row mt-2">
                                <div className="col-md-8">
                                  <label>Remarks</label>
                                  <input name="Remarks" type="text" className="form-control" />
                                </div>
                                </div> 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

export default DebantureTransfer ;
