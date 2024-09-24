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

const Loanandguarantee = () => {
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
                  <h2 className="main-content-title tx-24 mg-b-5">Loan & Guarantee Security </h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Registers</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                    Loan & Guarantee Security
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
                            <fieldset className="form-group border p-4 mt-3">
                              <legend className="px-2">Loan Application</legend>
                              <div className="row mt-2">


                              <div className="col-md-3">
                                  <label>Nature Of Transaction </label>
                                  <input name="Nature.Of.Transaction" type="text" className="form-control"  />
                                </div>
                              <div class="form-group col-md-3">
                                <label class="">Loan Date    <span className="required">*</span></label>
                                <input class="form-control" required="" type="date" />
                              </div>
                                

                                <div className="col-md-3">
                                  <label>Name <span className="required">*</span> </label>
                                  <input name="name" type="text" className="form-control"  />
                                </div>

                                <div className="col-md-3">
                                  <label>Loan Amount </label>
                                  <input name="Loan.Amount" type="number" className="form-control"  />
                                </div>


                                
                              </div>

                              <div className="row mt-4">
                                <div className="col-md-4">
                                  <label>Address </label>
                                  <input name="Address" type="text" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                  <label>Time Preiod</label>
                                  <input name="Time.Preiod" type="number" className="form-control" />
                                </div>

                                <div className="col-md-3">
                                  <label>Perpose</label>
                                  <input name="Perpose" type="text" className="form-control" />
                                </div>
                                <div className="col-md-2">
                                  <label>% Of Loan <span className="required">*</span></label>
                                  <input name="Of.Loan" type="number" className="form-control" />
                                </div>

                              </div>

                              <div className="row mt-5">
                             
                                <div className="col-md-3">
                                  <label>Date Of Passing (Borad Resolution)</label>
                                  <input class="form-control" required="" type="date" />
                                </div>
                                <div className="col-md-3">
                                  <label>Date Of Passing (Spacial Resolution)</label>
                                  <input class="form-control" required="" type="date" />
                                </div>

                                <div className="col-md-3">
                                  <label>Loan Rate Of Interest</label>
                                  <input name="Loan.Rate.Of.Interest" type="number" className="form-control" />
                                </div>
                                <div className="col-md-3">
                                  <label>Date Of Passing (Borad Resolution)</label>
                                  <input class="form-control" required="" type="date" />
                                </div>
                                  
                              </div>

                            </fieldset>
                          </div>

                          
                        

{/* second form details members */}

                                 <div className="col-md-12">
                            <fieldset className="form-group border p-4 mt-3">
                              <legend className="px-2">For Acauisition</legend>
                              <div className="row mt-2">
                                <div className="col-md-4">
                                  <label>No Of Securities </label>
                                  <input name="No.Of.Securities " type="number" className="form-control"  />
                                </div>

                                <div className="col-md-4">
                                  <label>No & Paid Up Value </label>
                                  <input name="No.&.Paid.Up.Value" type="number" className="form-control"  />
                                </div>
                              

                                <div className="col-md-4">
                                  <label>Cost OD Acquisition</label>
                                  <input name="Cost.Od.Acquisition" type="munber" className="form-control"  />
                                </div>
                                
                              </div>

                              <div className="row mt-4">

                              <div class="form-group col-md-3">
                                <label class="">Selling Date</label>
                                <input class="form-control" required="" type="date" />
                              </div>
                              <div className="col-md-3">
                                  <label>Selling Price </label>
                                  <input name="Selling.Price" type="number" className="form-control" />
                                </div>
                              
                                <div className="col-md-6">
                                  <label>Remark </label>
                                  <input name="Remark" type="text" className="form-control" />
                                </div>
                              </div>


                            </fieldset>
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
      <br />
      <Footer />
    </div>
   
  );
};

export default Loanandguarantee;
