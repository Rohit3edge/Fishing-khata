import React,{useState,useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSettingsField } from "../../store/slices/settings";
const Invoice = ({data}) => {

  const dispatch = useDispatch();
  const setting = useSelector((state) => state.settings.updatesettings);
  // const { data, loading, error } = useSelector((state) => state.settings);



  const [ewaybillValue, setEwaybillValue] = useState(data?.invoice_ewaybill == 0);
  const [invoiceShipping, setInvoiceShipping] = useState(data?.invoice_shipping_address == 0);


  useEffect(() => {
    if (data?.invoice_ewaybill !== undefined) {
      setEwaybillValue(data.invoice_ewaybill == 0);   
    }
    if(data?.invoice_shipping_address !== undefined){
      setInvoiceShipping(data.invoice_shipping_address == 0)
    }
  }, [data]);

  
  return (
    <div>
      <div className="row">
        <div className="col-md-12 col-sm-12 pt-1">
          <div className="col-sm-6">
            {/* Invoice Account Type */}
            <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
              <div className="dis_in title_2">
                Set Invoice Account Type
                <div
                  className="dis_in"
                  title="Set default type of invoice in terms of Accounting like Cash, Credit."
                >
                  <i className="glyphicon glyphicon-info-sign"></i>
                </div>
              </div>
              <div className="dis_in flot_right">
                <select
                  name="invoice_account_type"
                  className="dis_in form-control pad_2"
                  style={{ fontSize: "12px", height: "30px", width: "85px" }}
                  value={setting.invoice_account_type ?? data.invoice_account_type}
                  onChange={(e)=>{dispatch(updateSettingsField({ invoice_account_type: e.target.value}))}}
                >
                  <option selected="selected" value="Cash">
                    Cash
                  </option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
            </div>

            {/* Default Payment Mode */}
            <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
              <div className="dis_in title_2">
                Set default Payment Mode
                <div
                  className="dis_in"
                  title="Set default payment mode of invoice like Cash, Debit/Credit Card etc."
                >
                  <i className="glyphicon glyphicon-info-sign"></i>
                </div>
              </div>
              <div className="dis_in flot_right">
                <select
                  name="payment_mode"
                  className="dis_in form-control pad_2"
                  style={{ fontSize: "12px", height: "30px", width: "85px" }}
                  value={setting.invoice_payment_mode ?? data.invoice_payment_mode}
                  onChange={(e)=>{dispatch(updateSettingsField({ invoice_payment_mode: e.target.value}))}}
                >
                  <option selected="selected" value="Cash">
                    Cash
                  </option>
                  <option value="Debit/Credit Card">Debit/Credit Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Mobile Wallet">Mobile Wallet</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Demand Draft">Demand Draft</option>
                </select>
              </div>
            </div>

             {/* Fix Discount on Items */}
      <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
        <div className="dis_in title_2">
          Set fix Discount on Items
          <div className="dis_in" title="Set default discount for items like 5%, 10%.">
            <i className="glyphicon glyphicon-info-sign"></i>
          </div>
        </div>
        <div className="dis_in flot_right" style={{ width: '84px' }}>
          <div className="input-group">
            <input
              name="item_discount"
              type="number"
              value={setting.invoice_item_discount ?? data.invoice_item_discount}
              onChange={(e)=>{dispatch(updateSettingsField({ invoice_item_discount: e.target.value}))}}
              className="form-control"
            />
          </div>
        </div>
      </div>


            {/* Enable E-Way Bill Number */}
            <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
              <div className="dis_in title_2">
                Enable E-Way Bill Number
                <div
                  className="dis_in"
                  title="Enable you to add E-Way bill no in your invoice."
                >
                  <i className="glyphicon glyphicon-info-sign"></i>
                </div>
              </div>
              <div className="flot_right form-check form-switch">
                <input  type="checkbox" name="chk_ewaybill"  checked={ewaybillValue} onChange={(e) =>{ setEwaybillValue(e.target.checked); dispatch(updateSettingsField({ invoice_ewaybill: e.target.checked}))}}/>
              </div>
            </div>

            {/* Invoice Shipping Address */}
            <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
              <div className="dis_in title_2">
                Invoice Shipping Address
                <div
                  className="dis_in"
                  title="Enable you to add Invoice Shipping Address in your invoice."
                >
                  <i className="glyphicon glyphicon-info-sign"></i>
                </div>
              </div>
              <div className="flot_right form-check form-switch">
                <input type="checkbox" name="chk_invo_shiping_address" checked={invoiceShipping} onChange={(e) =>{ setInvoiceShipping(e.target.checked); dispatch(updateSettingsField({ invoice_shipping_address: e.target.checked}))}} />
              </div>
            </div>

            {/* Default Terms and Conditions */}
            <div className="col-sm-12 mt_20  mt-2 mb-2">
              <div className="dis_in title_2">
                Set Default Terms and Conditions
                <div
                  className="dis_in"
                  title="Set default Terms and Conditions."
                >
                  <i className="glyphicon glyphicon-info-sign"></i>
                </div>
              </div>
              <div className="dis_in flot_right">
                <div className="input-group">
                  <textarea
                    name="Terms and Conditions"
                    value={setting.invoice_terms ?? data.invoice_terms}
                    className="form-control mt-2 mb-2"
                    rows="3"
                    onChange={(e)=>{dispatch(updateSettingsField({ invoice_terms: e.target.value}))}}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Upload Signature */}
            <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
              <div className="dis_in title_2">
                Upload Signature
                <div
                  className="dis_in"
                  title="Set default signature to invoice."
                ></div>
              </div>
              <div className="dis_in flot_right" style={{ width: "196px" }}>
                <div className="input-group d-flex justify-content-between align-items-center">
                  <input
                    type="file"
                    name="img_profile"
                    className="form-control"
                    accept=".png,.jpg,.jpeg"
                    style={{ width: "110px" }}
                  />
                  {/* <img
                    id="MainContent_MainContent2_ctl02_Avatar_profile"
                    className="dis_none"
                    style={{ height: "100px", width: "100px" }}
                  /> */}
                  {/* <span
                    id="MainContent_MainContent2_ctl02_lbl_image_name_profile"
                    style={{ color: "White", fontSize: "2px" }}
                  ></span> */}
                  <span className="input-group-btn">
                    <input
                      type="submit"
                      name="MainContent2$ctl02$Button5"
                      value="Upload"
                      className="btn btn-primary"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
