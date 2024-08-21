import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbarside from "./Navbarside";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { AddBankBook} from "../store/slices/bankbook";
import Loader from "../common/Loader"

const AddBankDetails = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.data?.id; 
  const Name = user?.data?.company_name;

  const [formData, setFormData] = useState({
    profile_id: id,
    date: "",
    display_name: "",
    account_no: "",
    account_holder: "",
    bank_name: "",
    ifsc: "",
    opening_balance: Number(""),
    date_as_of:"",
    type: "",
  });



  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCurrentDate(formattedDate);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0'); 
    const hours = String(today.getHours()).padStart(2, '0'); 
    const minutes = String(today.getMinutes()).padStart(2, '0'); 
    const seconds = String(today.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
 
    setFormData((prevData) => ({
      ...prevData,
      date: formattedDateTime,
      date_as_of: formattedDate,
    }));
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


    // Discard handler
    const handleDiscard = () => {
      setFormData({
        profile_id: id,
        date: "",
        display_name: "",
        account_no: "",
        account_holder: "",
        bank_name: "",
        ifsc: "",
        opening_balance: "",
        date_as_of: currentDate,
        type: "",
      });
    };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    const {
      display_name,
      account_no,
      ifsc,
      type,account_holder
    } = formData;
  
    if (!display_name || !account_no || !ifsc || !type ||!account_holder) {
      alert("Please fill all the mandatory fields: Display Name, Account No, IFSC, and Account Type.");
      return; // Stop form submission if validation fails
    }
    setIsLoading(true)
    dispatch(AddBankBook(formData))
      .unwrap()
      .then((data) => {
        setIsLoading(false)
        setFormData({profile_id: "",
          date: "",
          display_name: "",
          account_no: "",
          account_holder: "",
          bank_name: "",
          ifsc: "",
          opening_balance: Number(""),
          date_as_of:"",
          type: "",})
        console.log("Form submitted successfully", data);
        navigate("/")
      })
      .catch(({ message }) => {
        setIsLoading(false)
        alert(message);
      });
  };

  
  return (
    <div >
      <div class="row" style={{ marginLeft: "0", marginRight: "0" }}>
        <Navbarside />
        {isLoading && <Loader />}
        <div className="col-md-10">
          <div className="row top-header">
            <div className="col-md-7">
              <div className="company-name">
                {Name}
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-default" onClick={()=>navigate("/ledger")}>
                  Ledger
                </button>
                <button type="submit" className="btn btn-default">
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
                  <h2 class="main-content-title tx-24 mg-b-5">Bank Book</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                    <a href="#">Bank Book</a>
                  </li>
                  <li class="breadcrumb-item active" aria-current="page">
                  Add Bank
                  </li>
                  </ol>
                </div>
              </div>
              <div class="row">
                        <div class="col-md-8">
                            <div class="card custom-card">
                                <div class="card-body">
                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-2">
                                                <label class="rdiobox">
                                                    <input name="type" type="radio" value="Regular" checked={formData.type === "Regular"} onChange={handleInputChange}/> <span>Regular</span>
                                                </label>
                                            </div>
                                            <div class="col-md-2">
                                                <label class="rdiobox">
                                                    <input  name="type" type="radio" value="OD/OCC" checked={formData.type === "OD/OCC"} onChange={handleInputChange}/> <span>OD/OCC</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-12">
                                                <label>Display Name <span class="required">*</span></label>
                                                <input name="display_name" type="text" class="form-control" onChange={handleInputChange}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Account No <span class="required">*</span></label>
                                                <input name="account_no" type="text" class="form-control" onChange={handleInputChange}/>
                                            </div>
                                            <div class="col-md-6">
                                                <label>Bank Name</label>
                                                <input name="bank_name" type="text" class="form-control" onChange={handleInputChange}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Account Holder Name</label>
                                                <input name="account_holder" type="text" class="form-control" onChange={handleInputChange}/>
                                            </div>
                                            <div class="col-md-6">
                                                <label>IFSC <span class="required">*</span></label>
                                                <input name="ifsc" type="text" class="form-control" onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Opening Balance</label>
                                                
                                                <div class="input-group">
                                                    <span class="input-group-text" id="basic-addon1">₹</span>
                                                    <input name="opening_balance" aria-describedby="basic-addon1" aria-label="Username" class="form-control" type="text" onChange={handleInputChange}/>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label>As of Date <span class="required">*</span></label>
                                                <input name="as_of_date" type="date" class="form-control" value={currentDate}  onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <button type="button" class="btn btn-default" onClick={handleSubmit}>Submit</button>&nbsp;
                                                <button type="button" class="btn btn-cancel" onClick={handleDiscard} >Cancel</button>&nbsp;
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

export default AddBankDetails;
