import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListParties } from '../store/slices/parties';
import { GetSingleDetailsPurchaseorders,CreatePurchaseVoucher } from '../store/slices/purchase';
import { GetPurchaseOrderlist } from '../store/slices/purchase';
import AddPurchaseBillSec from './AddPurchaseBillSec';
import moment from 'moment';
import Select from 'react-select';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';

const AddPurchaseBill = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id; // profile_id
  const Name = user?.data?.company_name;
  // const currentDate = new Date().toISOString().split('T')[0];

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [poBillData, setPoBillData] = useState({});
  const [listParties, setListParties] = useState([]);
  const [purchaseOrderlist, setPurchaseOrderlist] = useState([]);
  const [selectedPartyDetails, setSelectedPartyDetails] = useState({
    address: '',
    gstin: '',
    phone: '',
    state: '',
    ledger_id: '',
    party_id: '',
  });
  // State for form data
  const [formData, setFormData] = useState({
    profile_id: id,
    po_prefix: null,
    party_id: '',
    ledger_id: '',
    fin_year: '2024-2025',
    roundoff: '',
    tcs_amount: '',
    party_gstn: '',
    po_number: '',
    po_date: '',
    quotation_number: '',
    quotation_date: '',
    notes: '',
    billing_name: '',
    billing_address: '',
    billing_state: '',
    billing_gstn: '',
    billing_phone: '',
    shipping_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_phone: '',
    bill_no: '',
    bill_date: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch list of parties
  const fetchParties = async () => {
    try {
      const data = await dispatch(ListParties({ profile_id: id })).unwrap();
      setListParties(data?.data);
      return data?.data;
    } catch (error) {
      console.log('Error fetching parties:', error.message);
    }
  };

  const fetchPurchaseOrderlist = async () => {
    setIsLoading(true);
    dispatch(GetPurchaseOrderlist({ profile_id: id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setPurchaseOrderlist(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchParties(), fetchPurchaseOrderlist()]);
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, id]);

  // Party selection logic
  const partyOptions = listParties.map((party) => ({
    value: party.id,
    label: party.name,
  }));

  const handlePartyChange = (selectedOption, ndata, isData) => {
    const FinalselectedOption = isData ? selectedOption : selectedOption?.value; // Check if selectedOption exists
    if (!FinalselectedOption) {
      console.error('FinalselectedOption is undefined or invalid');
      return;
    }
    const ListParties = isData ? ndata : listParties;
    const party = ListParties?.find((p) => p?.id == FinalselectedOption);
    if (party) {
      setSelectedPartyDetails({
        address: party?.address,
        gstin: party?.gstin,
        phone: party?.phone,
        state: party?.state,
        ledger_id: party?.ledger_id,
        party_id: party?.id,
      });
      setFormData((prevData) => ({
        ...prevData,
        party_id: party?.id,
        ledger_id: party?.ledger_id,
        party_gstn: party?.gstin,
      }));
    } else {
      console.error('Party not found');
    }
  };

  const fetchPurchaseOrderDetails = async (po_id) => {
    setIsLoading(true);
    dispatch(GetSingleDetailsPurchaseorders({ profile_id: id, po_id: po_id }))
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        console.log('data data', data?.data);
        const purchaseorder = data?.data?.purchase_order;
        setSelectedPartyDetails({
          party_gstn: purchaseorder?.party_gstn || '',
          ledger_id: purchaseorder?.ledger_id || '',
          party_id: purchaseorder?.party_id || '',
        });
        if (purchaseorder?.party_id) {
          fetchParties().then((ndata) => {
            handlePartyChange(purchaseorder?.party_id, ndata, true);
          });
        }
        setFormData((prevData) => ({
          ...prevData,
          party_id: purchaseorder?.party_id || '',
          ledger_id: purchaseorder?.ledger_id || '',
          party_gstn: purchaseorder?.party_gstn || '',
          po_number: purchaseorder?.po_number || '',
          po_date: purchaseorder?.po_date || '',
          quotation_number: purchaseorder?.quotation_number || '',
          quotation_date: purchaseorder?.quotation_date || '',
          notes: purchaseorder?.notes || '',
          billing_name: purchaseorder?.billing_name || '',
          billing_address: purchaseorder?.billing_address || '',
          billing_state: purchaseorder?.billing_state || '',
          billing_gstn: purchaseorder?.billing_gstn || '',
          billing_phone: purchaseorder?.billing_phone || '',
          shipping_name: purchaseorder?.shipping_name || '',
          shipping_address: purchaseorder?.shipping_address || '',
          shipping_city: purchaseorder?.shipping_city || '',
          shipping_state: purchaseorder?.shipping_state || '',
          shipping_phone: purchaseorder?.shipping_phone || '',
        }));

        setPoBillData(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
  };
  const handlePOChange = (e) => {
    const selectedPO = e.target.value;
    if (selectedPO) {
      fetchPurchaseOrderDetails(selectedPO);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form
    const validateForm = () => {
      let newErrors = {};
      if (!selectedPartyDetails.party_id) {
        newErrors.customer = 'Customer is required.';
      }
      if (!selectedPartyDetails.state) {
        newErrors.selectedPartyState = 'Billing state is required.';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

  // Submit and show the form data
    const handleSubmit = (e) => {
      e.preventDefault();

      const dataNew={
        profile_id: formData?.profile_id,
        bill_no: formData?.bill_no,
        bill_date: formData?.bill_date,
        party_id:formData?.party_id,
        ledger_id:formData?.ledger_id,
        party_gstn:formData?.party_gstn,
        po_no:formData?.po_number,
        roundoff: 0.00,
        bank_name: "",

      }
      const mergedData = {
        ...dataNew,
        ...data
      };
        console.log('Form Data:', mergedData);
      if (validateForm()) {

        dispatch(CreatePurchaseVoucher(mergedData))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          navigate('/purchase/purchasevoucherlist');
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
      }
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
                  <h2 className="main-content-title tx-24 mg-b-5">Purchase Voucher</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Purchase</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Add Purchase Voucher
                    </li>
                  </ol>
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn ripple btn-default" onClick={handleSubmit}>
                    Save
                  </button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="card custom-card">
                    <div class="card-body">
                      <div class="form-group">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="row">
                              <div class="col-md-6">
                                <label>PO Number</label>
                                <select name="party" class="form-control" onChange={handlePOChange}>
                                  <option value="">--Select PO--</option>
                                  {purchaseOrderlist?.map((option, index) => (
                                    <option key={index} value={option?.id}>
                                      {option?.po_number}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div class="col-md-6">
                                <label>
                                  Supplier/Vendor <span class="required">*</span>
                                </label>
                                <Select
                                  options={partyOptions}
                                  placeholder="--Select Customer--"
                                  onChange={handlePartyChange}
                                  value={partyOptions?.find((option) => option?.value === selectedPartyDetails?.party_id) || null}
                                />
                              </div>
                            </div>

                            <div class="row mt-3">
                              <div class="col-md-6">
                                <label>Party Invoice No </label>
                                <input name="bill_no" type="text" class="form-control" onChange={handleInputChange} />
                              </div>
                              <div class="col-md-6">
                                <label>Party Invoice Date </label>
                                <input name="bill_date" type="date" class="form-control" onChange={handleInputChange} />
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-md-12">
                                <br />
                                <p>
                                  <strong>Supplier/Vendor Billing Address</strong>
                                </p>
                                {selectedPartyDetails && (
                                  <>
                                    {selectedPartyDetails?.address}
                                    <br />
                                    {selectedPartyDetails?.state}
                                    <br />
                                    GSTN: {selectedPartyDetails?.gstin}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                           {formData?.po_number&&(<div class="col-md-6">
                            <div class="row mt-4">
                              <div class="col-md-6">
                                <strong>PO Number:</strong>&nbsp;{formData?.po_number}
                              </div>
                              <div class="col-md-6">
                                <strong>Quotation Number:</strong>&nbsp;{formData?.quotation_number}
                              </div>
                            </div>

                            <div class="row">
                              <div class="col-md-6">
                                <strong>PO Date:</strong>&nbsp;{moment(formData?.po_date).format('DD-MM-YYYY')}
                              </div>
                              <div class="col-md-6">
                                <strong>Quotation Date:</strong>&nbsp;{moment(formData?.quotation_date).format('DD-MM-YYYY')}
                              </div>
                            </div>

                            <div class="row mt-3">
                              <div class="col-md-6">
                                <strong>Billing Address:</strong>
                                <br />
                                {formData?.billing_address} ,{formData?.billing_state},<br />
                                Phone: {formData?.billing_phone}
                                <br />
                                GSTN: {formData?.billing_gstn}
                              </div>
                              <div class="col-md-6">
                                <strong>Delivery Address:</strong>
                                <br />
                                {formData?.shipping_address} ,{formData?.shipping_state},<br />
                                Phone: {formData?.shipping_phone}
                                <br />
                              </div>
                            </div>

                            <div class="row mt-2">
                              <div class="col-md-12">
                                <strong>Notes</strong>
                                <br />
                                {formData?.notes}
                              </div>
                            </div>
                          </div>)}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <AddPurchaseBillSec onChildDataChange={setData}  data={poBillData} />
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

export default AddPurchaseBill;
