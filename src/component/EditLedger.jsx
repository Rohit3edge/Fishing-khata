import React, { useState, useEffect } from 'react';
import Navbarside from './Navbarside';
import Moment from 'moment';
import { useDispatch } from 'react-redux';
import { Getledgerdetail, Getledgergroups, GetState ,UpdateLedger} from '../store/slices/ledger'; // Assuming these actions exist
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../common/Loader';
import Footer from './Footer';

const EditLedger = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ledgerId } = useParams(); // Get the ledgerId from the URL params for editing

  const [ledgerGroups, setLedgerGroups] = useState([]);
  const [ledgerName, setLedgerName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [state, setState] = useState([]);
  const [openingDate, setOpeningDate] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('cr');
  const [isdefault, setIsdefault] = useState();
  const [isLoading, setIsLoading] = useState(false);
 

  const user = JSON.parse(localStorage.getItem('user'));
  const Name = user?.data?.company_name;
  const id = user?.data?.id;

  const [accountDetails, setAccountDetails] = useState({
    id:"",
    profile_id:id,
    ledger:"",
    group_id:'',
    is_default:"",
    opening_balance:"",
    dr_cr:"",
    type: 'Regular',
    account_no: '',
    bank_name: '',
    account_holder: '',
    ifsc: '',
    date: '',
    date_as_of: '',
    state: '',
    gstn: '',
    address: '',
    phone_number: '',
    opening_date:'',
    group_name:''
  });


  const parsedObject = groupName ? JSON.parse(groupName) : {};
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setIsLoading(true);
    dispatch(Getledgergroups())
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setLedgerGroups(data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        alert(message);
      });
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(GetState())
      .unwrap()
      .then((data) => {
        setIsLoading(false);
        setState(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false);
        alert(message);
      });
  }, [dispatch]);

  useEffect(() => {
    if (ledgerId) {
      setIsLoading(true);
      dispatch(Getledgerdetail({profile_id:id,ledger_id:ledgerId}))
        .unwrap()
        .then((data) => {
          setIsLoading(false);
          populateLedgerData(data?.ledger);
          console.log(data?.ledger)
        })
        .catch(({ message }) => {
          setIsLoading(false);
          console.log(message)
        });
    }
  }, [dispatch, ledgerId]);

  const populateLedgerData = (data) => {
    setAccountDetails({
      ledger: data.ledger,
      group_name:data.group_name,
      group_id: data.group_id,
      opening_date:  data.added_on ? Moment(data.added_on).format('YYYY-MM-DD') : '',
      dr_cr: data.dr_cr,
      is_default: data.is_default,
      account_no: data.account_no || '',
      bank_name: data.bank_name || '',
      account_holder: data.account_holder || '',
      ifsc: data.ifsc || '',
      state: data.state || '',
      gstn: data.gstn || '',
      address: data.address || '',
      phone_number: data.phone_number || '',
      opening_balance: parseFloat(data.opening_balance),
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'group_name') {
      const groupId = value; // This is the selected group ID from the dropdown
      const groupName = findGroupNameById(ledgerGroups, groupId); // Find the group name by ID
  
      setAccountDetails((prevState) => ({
        ...prevState,
        group_id: groupId,
        [name]: groupName, // Save the group_name as well
      }));
    } else {
      setAccountDetails((prevState) => ({ ...prevState, [name]: value }));
    }
  
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };
  
  const findGroupNameById = (groups, groupId) => {
    for (let group of groups) {
      // Ensure both group.id and groupId are compared as strings
      if (group.id === groupId) {
        return group.group_name;
      }
  
      // Recursively search in child groups if available
      if (group.children && group.children.length > 0) {
        const foundGroupName = findGroupNameById(group.children, groupId);
        if (foundGroupName) {
          return foundGroupName;
        }
      }
    }
  
    return null;
  };
  

    

  const validateAmount = (value) => {
    const regex = /^-?\d*(\.\d{0,2})?$/;
    if (value === '-' || regex.test(value)) {
      return value;
    } else {
      return value.slice(0, -1);
    }
  };
console.log(accountDetails)
  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};
    console.log("form data" ,accountDetails)
    if (!accountDetails.ledger) formErrors.ledger = 'Ledger name is required';
    if (!accountDetails.group_id) formErrors.group_id = 'Group name is required';
    // if (!accountDetails.dr_cr) formErrors.transactionType = 'Transaction type is required';
    // if (Object.keys(formErrors).length > 0) {
    //   setErrors(formErrors);
    //   return;
    // }

    console.log("form data 2" ,accountDetails)
    const ledgerData = {
        id: ledgerId,
        profile_id:id,
        group_id:accountDetails?.group_id,
        is_default:accountDetails?.is_default,
        ledger: accountDetails?.ledger,
        address:accountDetails?.address,
        phone_number: accountDetails?.phone_number,
        state:accountDetails?.state,
        gst_type: "Regular",
        gstn: accountDetails?.gstn,
        opening_balance:accountDetails?.opening_balance,
        dr_cr:accountDetails?.dr_cr,
        opening_date: accountDetails?.opening_date,

      ...accountDetails,
    };
  console.log("ledgerData" ,ledgerData)
    setIsLoading(true);
    if (ledgerId) {
      // If ledgerId exists, update the existing ledger
      dispatch(UpdateLedger({ id: ledgerId, ...ledgerData }))
        .unwrap()
        .then((response) => {
          setIsLoading(false);
          alert('Ledger updated successfully!');
          navigate('/ledgerlist');
        })
        .catch((error) => {
          setIsLoading(false);
          alert('Failed to update ledger: ' + error.message);
        });
    } 
  };

  const renderOptions = (groups, level = 0) => {
    return groups.map((group) => (
      <React.Fragment key={group.id}>
        <option value={group.id}>
          {'\u00A0'.repeat(level * 4)} {group.group_name}
        </option>
        {group.children && group.children.length > 0 && renderOptions(group.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <>
      <div className="">
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
                    <h2 className="main-content-title tx-24 mg-b-5">Ledger</h2>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#">Ledger</a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Edit Ledger
                      </li>
                    </ol>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button className="btn ripple btn-default" onClick={handleSubmit}>
                      Save
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="card custom-card">
                      <div className="card-body">
                        <div className="form-group">
                          <div className="row">
                            <div className="col-md-3">
                              <label>
                                Name <span className="required">*</span>
                              </label>
                              <input name="ledger" type="text" placeholder="Enter the name" className="form-control" value={accountDetails?.ledger} onChange={handleInputChange} />
                              <p className="alert-message">{errors.ledger}</p>
                            </div>
                            <div className="col-md-3">
                              <label>
                                Group Name <span className="required">*</span>
                              </label>
                              <select name="group_name" className="form-control" value={accountDetails?.group_id} onChange={handleInputChange}>
                                <option value="">Select</option>
                                {renderOptions(ledgerGroups)}
                              </select>
                              <p className="alert-message">{errors?.group_name}</p>
                            </div>
                            <div className="col-md-3">
                              <label>Opening Date</label>
                              <input name="opening_date" type="date" className="form-control" value={accountDetails?.opening_date} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <label className="col-black mb-0">Amount</label>
                                <div className="ml-2">
                                  <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="dr_cr" id="credit" value="CR" checked={accountDetails?.dr_cr == 'CR'} onChange={handleInputChange} />
                                    <label className="form-check-label" htmlFor="credit">
                                      Cr
                                    </label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="dr_cr" id="debit" value="DR" checked={accountDetails?.dr_cr == 'DR'} onChange={handleInputChange} />
                                    <label className="form-check-label" htmlFor="debit">
                                      Dr
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <input name="opening_balance" type="text" className="form-control" placeholder="Enter the amount" value={accountDetails?.opening_balance} onChange={handleInputChange} />
                              <p className="alert-message">{errors.opening_balance}</p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-3">
                              <label>Address</label>
                              <input name="address" type="text" className="form-control" value={accountDetails?.address} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-3">
                              <label>Phone Number</label>
                              <input name="phone_number" type="text" className="form-control" value={accountDetails?.phone_number} onChange={handleInputChange} />
                            </div>
                            <div className="col-md-3">
                              <label>State</label>
                              <select className="form-control" name="state" value={accountDetails?.state || ''} onChange={handleInputChange}>
                                <option value="">--Select State--</option>
                                {(state || []).map((option, index) => (
                                  <option key={index} value={option?.state_name}>
                                    {option?.state_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-3">
                              <label>Gst Number</label>
                              <input name="gstn" type="text" placeholder="Enter the gstn" className="form-control" value={accountDetails?.gstn} onChange={handleInputChange} />
                            </div>
                          </div>

                          {/* Conditionally render additional fields */}
                          {/* parsedObject.group_name === 'Bank Accounts' && */}
                          {parsedObject?.group_name === 'Bank Accounts' && (
                            <div class="ledger_info row">
                              <div class="col-md-12">
                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-2">
                                      <label class="rdiobox">
                                        <input name="type" type="radio" value="Regular" checked={accountDetails.type === 'Regular'} onChange={handleInputChange} /> <span>Regular</span>
                                      </label>
                                    </div>
                                    <div class="col-md-2">
                                      <label class="rdiobox">
                                        <input name="type" type="radio" value="OD/OCC" checked={accountDetails.type === 'OD/OCC'} onChange={handleInputChange} /> <span>OD/OCC</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div class="form-group">
                                  <div class="row">
                                    <div className="col-md-6">
                                      <label>
                                        Account No <span className="required">*</span>
                                      </label>
                                      <input name="account_no" type="text" className="form-control" placeholder="Enter account no" value={accountDetails.account_no} onChange={handleInputChange} />
                                      <p className="alert-message">{errors.account_no}</p>
                                    </div>
                                    <div className="col-md-6">
                                      <label>Bank Name</label>
                                      <input name="bank_name" type="text" className="form-control" placeholder="Enter bank name" value={accountDetails.bank_name} onChange={handleInputChange} />
                                    </div>
                                  </div>
                                </div>

                                <div class="form-group">
                                  <div class="row">
                                    <div className="col-md-6">
                                      <label>Account Holder Name</label>
                                      <input
                                        name="account_holder"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter account holder name"
                                        value={accountDetails?.account_holder}
                                        onChange={handleInputChange}
                                      />
                                    </div>
                                    <div className="col-md-6">
                                      <label>
                                        IFSC <span className="required">*</span>
                                      </label>
                                      <input name="ifsc" type="text" className="form-control" placeholder="Enter IFSC" value={accountDetails?.ifsc} onChange={handleInputChange} />
                                      <p className="alert-message">{errors.ifsc}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
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
    </>
  );
};

export default EditLedger;
