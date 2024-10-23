import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-hot-toast';
import {GetState } from '../store/slices/ledger';
import { ListParties } from '../store/slices/parties';
import {GetSingleDetailsPurchaseorders,UpdatePurchaseOrder} from '../store/slices/purchase'
import EditPurchaseOrderSec from './EditPurchaseOrderSec';
import Select from 'react-select';
import Navbarside from './Navbarside';
import Loader from '../common/Loader';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from './AdminLayout';

const EditPurchaseOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const po_id=id
  const user = JSON.parse(localStorage.getItem('user'));
  const Id = user?.data?.id; // profile_id

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [listParties, setListParties] = useState([]);
  const [state, setState] = useState([]);
  const [singleDetailsPo, setsingleDetailsPo] = useState([]);
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
    purchase_order_id:po_id,
    profile_id:Id ,
    po_prefix:"",
    party_id: '',
    party_ledger_id:'',
    party_gstn: ''||null,
    po_number: '',
    po_date: "",
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

  });

  const [errors, setErrors] = useState({});

  // Fetch list of parties
  const fetchParties = async () => {
    try {
      const data = await dispatch(ListParties({ profile_id:Id })).unwrap();
      setListParties(data?.data);
      return data?.data
    } catch (error) {
      console.log('Error fetching parties:', error.message);
    }
  };
  const fetchState = async () => {
    try {
      const data = await dispatch(GetState()).unwrap();
      setState(data?.data);;
    } catch (error) {
      console.log('Error fetching State:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchParties(),fetchState()]);
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, Id]);


  useEffect(() => {
    if ( po_id && Id) {
      setIsLoading(true);
      dispatch(GetSingleDetailsPurchaseorders({ profile_id:Id,po_id:po_id}))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          const purchaseorder=data?.data?.purchase_order
          setSelectedPartyDetails({
            party_gstn: purchaseorder?.party_gstn || '',
            party_ledger_id: purchaseorder?.ledger_id || '',
          });
          
          if (purchaseorder?.party_id){
             fetchParties().then((ndata)=>{
              handlePartyChange( purchaseorder?.ledger_id,ndata, true);
            })
            
          }

          setFormData((prevData) => ({
              ...prevData,
              party_ledger_id:purchaseorder?.ledger_id || '',
              party_gstn: purchaseorder?.party_gstn || '',
              po_number: purchaseorder?.po_number || '' ,
              po_date: purchaseorder?.po_date || '',
              quotation_number: purchaseorder?.quotation_number || '',
              quotation_date: purchaseorder?.quotation_date || '',
              notes:purchaseorder?.notes || '',
              billing_name:purchaseorder?.billing_name || '',
              billing_address:purchaseorder?.billing_address || '',
              billing_state:purchaseorder?.billing_state || '',
              billing_gstn:purchaseorder?.billing_gstn || '',
              billing_phone:purchaseorder?.billing_phone || '',
              shipping_name:purchaseorder?.shipping_name || '',
              shipping_address:purchaseorder?.shipping_address || '',
              shipping_city:purchaseorder?.shipping_city || '',
              shipping_state:purchaseorder?.shipping_state || '',
              shipping_phone: purchaseorder?.shipping_phone || '',
          }));
          setsingleDetailsPo(data?.data || [])

        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message);
        });
    }
  }, [po_id,Id]);

  // Party selection logic
  const partyOptions = listParties.map((party) => ({
    value: party?.id,
    label: party?.ledger,
  }));

  const handlePartyChange = (selectedOption, ndata, isData) => {

    const FinalselectedOption = isData ? selectedOption : selectedOption?.value; // Check if selectedOption exists
    if (!FinalselectedOption) {
      console.error('FinalselectedOption is undefined or invalid');
      return;
    }
    const ListParties=isData?ndata:listParties
    const party = ListParties?.find((p) => p?.id == FinalselectedOption);
    // console.log("party",party)
    if (party) {
      setSelectedPartyDetails({
        address: party?.address,
        gstin: party?.gstn,
        phone: party?.phone,
        state: party?.state,
        party_ledger_id: party?.id,
      });
      setFormData((prevData) => ({
        ...prevData,
        party_ledger_id: party?.id,
        party_gstn: party?.gstn,
      }));
    } else {
      console.error('Party not found');
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


 
  // Submit and show the form data
  const handleSubmit = (e) => {
    e.preventDefault();

    const mergedData = {
      ...formData,
      ...data
    };
      // console.log('Form Data:', mergedData);
      dispatch(UpdatePurchaseOrder(mergedData)).unwrap()
      .then((data) => {
        toast.success('Update Purchase Order Successfully')
        setIsLoading(false);
        navigate('/purchase/purchaseorderlist');
      })
      .catch(({ message }) => {
        setIsLoading(false);
        console.log(message);
      });
    
  };

  return (
    <AdminLayout>
        {isLoading && <Loader />}
          <div className="row content-body">
            <div className="container">
              <div className="page-header">
                <div>
                  <h2 className="main-content-title tx-24 mg-b-5">Purchase Order</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Purchase</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Edit Purchase Order
                    </li>
                  </ol>
                </div>
                <div class="d-flex justify-content-end">
                <button class="btn ripple btn-default" onClick={handleSubmit}>Save</button>
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
                              <div class="col-md-12">
                                <label>
                                  Supplier/Vendor <span class="required">*</span>
                                </label>
                                <Select options={partyOptions} placeholder="--Select Customer--" onChange={handlePartyChange} value={partyOptions?.find((option) => option?.value === selectedPartyDetails?.party_ledger_id) || null}/>
                                {errors?.customer && <p className="text-danger">{errors?.customer}</p>}
                              </div>
                            </div>

                            <div class="row">
                              <div className="col-md-12">
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

                          <div class="col-md-6">
                            <div class="row">
                              <div class="col-md-6">
                                <label>PO Number </label>
                                <input name="po_number" type="text" class="form-control" value={formData?.po_number} onChange={handleInputChange} />
                              </div>

                              <div class="col-md-6">
                                <label>PO Date </label>
                                <input name="po_date" type="date" class="form-control" value={formData?.po_date} onChange={handleInputChange} />
                              </div>
                            </div>

                            <div class="row mt-2">
                              <div class="col-md-6">
                                <label>Quotation Number </label>
                                <input name="quotation_number" type="text" class="form-control" value={formData?.quotation_number} onChange={handleInputChange} />
                              </div>

                              <div class="col-md-6">
                                <label>Quotation Date </label>
                                <input name="quotation_date" type="date" class="form-control" value={formData?.quotation_date} onChange={handleInputChange} />
                              </div>
                            </div>

                            <div class="row mt-2">
                              <div class="col-md-12">
                                <label>Notes</label>
                                <textarea name="notes" class="form-control" rows="4" cols="70" onChange={handleInputChange} value={formData?.notes}></textarea>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr />

                        <div class="row">
                          <div class="col-md-6">
                            <fieldset class="form-group border p-2 mt-3">
                              <legend class="px-2">Billing Address</legend>
                              <div class="row mt-2">
                                <div class="col-md-12">
                                  <label>Billing Name </label>
                                  <input name="billing_name" type="text" class="form-control" onChange={handleInputChange} value={formData?.billing_name} />
                                </div>
                              </div>

                              <div class="row mt-2">
                                <div class="col-md-6">
                                  <label>Address </label>
                                  <input name="billing_address" type="text" class="form-control" onChange={handleInputChange} value={formData?.billing_address} />
                                </div>
                                <div class="col-md-6">
                                  <label>State </label>
                                  {/* <input name="billing_state" type="text" class="form-control" onChange={handleInputChange} value={formData?.billing_state} /> */}
                                  <select  className="form-control" name="billing_state" value={formData.billing_state || ''} onChange={handleInputChange}>
                                <option value="">--Select State--</option>
                                {(state || []).map((option, index) => (
                                  <option key={index} value={option?.state_name}>
                                    {option?.state_name}
                                  </option>
                                ))}
                              </select>
                                </div>
                              </div>

                              <div class="row mt-2">
                                <div class="col-md-6">
                                  <label>GSTN </label>
                                  <input name="billing_gstn" type="text" class="form-control" onChange={handleInputChange} value={formData?.billing_gstn} />
                                </div>
                                <div class="col-md-6">
                                  <label>Phone </label>
                                  <input name="billing_phone" type="text" class="form-control" onChange={handleInputChange} value={formData?.billing_phone} />
                                </div>
                              </div>
                            </fieldset>
                          </div>

                          <div class="col-md-6">
                            <fieldset class="form-group border p-2 mt-3">
                              <legend class="px-2">Delivery Address</legend>
                              <div class="row mt-2">
                                <div class="col-md-12">
                                  <label>Delivery Name </label>
                                  <input name="shipping_name" type="text" class="form-control" onChange={handleInputChange} value={formData?.shipping_name} />
                                </div>
                              </div>

                              <div class="row mt-2">
                                <div class="col-md-6">
                                  <label>Address </label>
                                  <input name="shipping_address" type="text" class="form-control" onChange={handleInputChange} value={formData?.shipping_address} />
                                </div>
                                <div class="col-md-6">
                                  <label>City </label>
                                  <input name="shipping_city" type="text" class="form-control" onChange={handleInputChange} value={formData?.shipping_city} />
                                </div>
                              </div>

                              <div class="row mt-2">
                                <div class="col-md-6">
                                  <label>State </label>
                                  {/* <input name="shipping_state" type="text" class="form-control" onChange={handleInputChange} value={formData?.shipping_state} /> */}
                                  <select  className="form-control" name="shipping_state" value={formData.shipping_state || ''} onChange={handleInputChange}>
                                <option value="">--Select State--</option>
                                {(state || []).map((option, index) => (
                                  <option key={index} value={option?.state_name}>
                                    {option?.state_name}
                                  </option>
                                ))}
                              </select>
                                </div>
                                <div class="col-md-6">
                                  <label>Phone </label>
                                  <input name="shipping_phone" type="text" class="form-control" onChange={handleInputChange} value={formData?.shipping_phone} />
                                </div>
                              </div>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <EditPurchaseOrderSec onChildDataChange={setData}  data={singleDetailsPo}/>
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
  );
};

export default EditPurchaseOrder;
