import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Getunits,Updatesettings,Getsettings } from '../../store/slices/settings';
import { useDispatch, useSelector } from 'react-redux';
import {toast } from 'react-hot-toast';
import Loader from '../../common/Loader';

const UpdateSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const UserID = user?.data?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profile_id: UserID || '',
    invoice_prefix: '',
    item_default_type: 'Product/Service',
    stock_value_method: 'Average Purchase Price',
    stock_calculation_method:'Non-Integrated'
  });



  React.useEffect(() => {
    setIsLoading(true)
    dispatch(Getsettings())
      .unwrap()
      .then((data) => {
        setIsLoading(false)
        // console.log(data?.data)
        if(data){
            setFormData((prevData) => ({
                ...prevData,
                invoice_prefix: data?.data?.invoice_prefix,
                item_default_type:data?.data?.item_default_type || "Product/Service" ,
                stock_value_method: data?.data?.stock_value_method ||"Average Purchase Price" ,
              }));
        }
      
      })
      .catch(({ message }) => {
        setIsLoading(false)
       console.log(message)
      });
  }, [dispatch]);


  const validate = () => {
    let newErrors = {};
  
    if (!formData.invoice_prefix) newErrors.invoice_prefix = 'Invoice prefix is required.';
    if (!formData.stock_value_method) newErrors.stock_value_method = 'Stock Valuation method is required.';   
    if (!formData.stock_calculation_method) newErrors.stock_calculation_method = 'Stock calculation method is required.';
    setErrors(newErrors);
  
    // Show an alert if any errors exist
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join('\n'); // Combine error messages into a single string
      toast.error(`Please fill in all mandatory fields:\n${errorMessages}`);
    }
  
    return Object.keys(newErrors).length === 0;
  };
  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  console.log(formData)

  async function handleUpdatesettings() {
    if(validate()){
    try {
      setIsLoading(true)
      const data = await dispatch(Updatesettings(formData)).unwrap();
      setIsLoading(false)
      navigate("/")
    } catch (error) {
      setIsLoading(false)
      console.error(error.message);
    }
  }
  }

  const signOut = () => {
    // Clear localStorage and cookies
    localStorage.clear();
    Cookies.remove("user");
    navigate("/home");
  };

  return (
    <>
      <a 
        className="footer_url position-absolute" 
         onClick={signOut}
        style={{ top: '20px', right: '30px',fontSize:"20px",fontWeight:"600",cursor:"pointer" }}
      >
       Logout
      </a>
     {isLoading && <Loader isLogin={true} />}
      <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
        <div className="card custom-card w-50" style={{ border: 'none' }}>
          <div class="card-body">
            <h3 className="font-weight-bold mb-4" style={{ borderBottom: '1px solid'}}>
              Add Settings
            </h3>
            <div class="form-group row my-2">
              <label class="col-sm-6 col-form-label">Set Invoice Prefix <span class="required">*</span></label>
              <div class="col-sm-6">
                <input name="invoice_prefix" type="text" class="form-control form-control-sm" value={formData?.invoice_prefix} onChange={handleInputChange} />
              </div>
              {/* INV- */}
            </div>
            <div class="form-group row my-2">
              <label for="item_default_type" class="col-sm-6 col-form-label">
                What do you sell?
              </label>
              <div class="col-sm-6">
                <select name="item_default_type"  class="form-control form-control-sm" value={formData?.item_default_type} onChange={handleInputChange}>
                  <option value="Product/Service">Product/Service</option>
                  <option value="Product">Product</option>
                  <option value="Service">Service</option>
                </select>
              </div>
            </div>
            <div class="form-group row my-2">
              <label for="stock_calculation_method" class="col-sm-6 col-form-label">
              Stock Calculation Method <span class="required">*</span>
              </label>
              <div class="col-sm-6">
                <select name="stock_calculation_method" id="sell_type" class="form-control form-control-sm" value={formData?.stock_calculation_method} onChange={handleInputChange}>
                <option value="Non-Integrated">Non-Integrated</option>
                <option value="Integrated ">Integrated </option>
                </select>
              </div>
            </div>
            <div class="form-group row my-2">
              <label for="stock_value_method" class="col-sm-6 col-form-label">
                Stock Valuation Method <span class="required">*</span>
              </label>
              <div class="col-sm-6">
                <select name="stock_value_method" id="sell_type" class="form-control form-control-sm" value={formData?.stock_value_method} onChange={handleInputChange}>
                  <option value="Average Purchase Price">Average Purchase Price</option>
                  <option value="FIFO">FIFO</option>
                  <option value="LIFO">LIFO</option>
                </select>
              </div>
            </div>
            <div className="form-group mt-4">
                  <div className="row">
                    <div className="col-md-12 ">
                      <span className='' style={{float:"right"}}>
                      <button className="btn btn-cancel" onClick={() => navigate('/companydocuments')}>
                     Previous
                    </button>
                      {/* <button className="btn btn-cancel" onClick={() => navigate('/')}>Skip</button> */}
                      <button type="submit" className="btn btn-default" onClick={handleUpdatesettings}  >
                        Next
                      </button>
                      &nbsp;
                      </span>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateSettings;
