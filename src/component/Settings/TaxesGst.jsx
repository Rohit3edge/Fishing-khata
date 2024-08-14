import React from 'react'
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { updateSettingsField } from "../../store/slices/settings";
const TaxesGst = ({data}) => {

  const dispatch = useDispatch();
  const setting = useSelector((state) => state.settings.updatesettings);



  return (
    <div>
        <div className="row">
  <div className="col-md-12 col-sm-12 pt-1">
    <div className="row">
      <div className="col-sm-6">
        {/* <div className="col-sm-12 mt_20">
          <input
            type="submit"
            name="ctl00$ctl00$MainContent$MainContent2$ctl04$btn_edit_category"
            value="Edit Tax"
            id="MainContent_MainContent2_ctl04_btn_edit_category"
            className="btn btn-primary"
          />
        </div> */}

        <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center pt-2 pb-2">
          <div className="dis_in title_2 d-flex ">
            Additional Tax On Item
            <div className="dis_in ml-2 " title="Enables you to add additional Tax on item Like Cess etc.">
            <BsFillInfoCircleFill/>
            </div>
          </div>
            <div className="">
              <input
                type="checkbox"
                checked={setting?.item_tax_default_value ?? data?.item_tax_default_value}
                onChange={(e) =>{ dispatch(updateSettingsField({ item_tax_default_value: e.target.checked}))}}
              />
            </div>
        </div>

        <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center pt-2 pb-2">
          <div className="dis_in title_2 d-flex ">
            Composite Scheme
            <div className="dis_in ml-2 " title="If your company is registered under composite scheme. Then you can turn this on.">
            <BsFillInfoCircleFill/>
            </div>
          </div>
       
            <span className="">
              <input
                type="checkbox"
                checked={setting.is_composite ?? data?.is_composite}
              
                onChange={(e) =>{ dispatch(updateSettingsField({ is_composite: e.target.checked}))}}
              />
            </span>
         
        </div>
      </div>
    </div>
  </div>
</div>


    </div>
  )
}

export default TaxesGst