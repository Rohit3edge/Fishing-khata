import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Getunits } from "../../store/slices/settings";
import { updateSettingsField } from "../../store/slices/settings";

const SettingsItem = ({data}) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.settings.updatesettings);

  const [units, setUnits] = useState();
  
  React.useEffect(() => {
    dispatch(Getunits())
      .unwrap()
      .then((data) => {
        setUnits(data.data);
      })
      .catch(({ message }) => {
        alert(message);
      });
  }, [dispatch]);



  return (
    <div className="row">
      <div className="col-sm-6">
        <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
          <div className="dis_in title_2 ">
            What do you sell?
            <div
              className=""
              title="Select the type of item you sell (product / service or both)"
            >
              <i className="glyphicon glyphicon-info-sign"></i>
            </div>
          </div>
          <div className="">
            <select
              name="sell_type"
              id="sell_type"
              value={data.item_default_type}
              // onChange={handleSellTypeChange}
              className="dis_in form-control pad_2"
              style={{ fontSize: "12px", height: "25px", width: "110px" }}
            >
              <option value="Product/Service">Product/Service</option>
              <option value="Product">Product</option>
              <option value="Service">Service</option>
            </select>
          </div>
        </div>

        <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
          <div className="dis_in title_2">
            Set default item unit
            <div
              className="dis_in"
              title="Define a default unit for your most use product."
            >
              <i className="glyphicon glyphicon-info-sign"></i>
            </div>
          </div>
          <div className="">
            <select
              name="sell_type"
              id="sell_type"
              value={setting?.item_unit_default_value ?? data?.item_unit_default_value}
              onChange={(e)=>{dispatch(updateSettingsField({ item_unit_default_value: e.target.value}))}}
              className="dis_in form-control pad_2"
              style={{ fontSize: "12px", height: "25px", width: "110px" }}
            >
              <option value="">Select Item Unit</option>
              {units?.map((option, index) => (
                <option key={index} value={option?.unit_name}>
                  {option?.unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
          <div className="dis_in title_2">
            Set default GST rate
            <div
              className="dis_in"
              title="Define a default GST tax rate that is applicable for your product or service like GST 5%, IGST 18% etc."
            >
              <i className="glyphicon glyphicon-info-sign"></i>
            </div>
          </div>
          <div className="dis_in flot_right">
            <select
              name="gst_rate"
              id="gst_rate"
              value={setting.item_tax_default_type ?? data?.item_tax_default_type}
              onChange={(e)=>{dispatch(updateSettingsField({ item_tax_default_type: e.target.value}))}}
              className="dis_in form-control pad_2"
              style={{ fontSize: "12px", height: "25px", width: "110px" }}
            >
              <option value="NONE">NONE</option>
              <option value="GST@0%">GST@0%</option>
              <option value="GST@0.25%">GST@0.25%</option>
              <option value="GST@3%">GST@3%</option>
              <option value="GST@5%">GST@5%</option>
              <option value="GST@12%">GST@12%</option>
              <option value="GST@18%">GST@18%</option>
              <option value="GST@28%">GST@28%</option>
              <option value="Exempted">Exempted</option>
            </select>
          </div>
        </div>

        <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
          <div className="dis_in title_2">
            Set default item category
            <div
              className="dis_in"
              title="Define a default category for most using items."
            >
              <i className="glyphicon glyphicon-info-sign"></i>
            </div>
          </div>
          <div className="dis_in flot_right">
            <select
              name="category_list"
              id="category_list"
              value={setting.item_category_default ?? data.item_category_default}
              onChange={(e)=>{dispatch(updateSettingsField({ item_category_default: e.target.value}))}}
              className="dis_in form-control pad_2"
              style={{ fontSize: "12px", height: "25px", width: "110px" }}
            >
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
          <div className="dis_in title_2">
            Set low stock value
            <div className="dis_in" title="Add low stock value to get alert.">
              <i className="glyphicon glyphicon-info-sign"></i>
            </div>
          </div>
          <div className="dis_in flot_right" style={{ width: "108px" }}>
            <div className="input-group mb-0">
              <input
                name="low_stock_txt"
                type="number"
                value={setting.item_low_stock_value ?? data.item_low_stock_value}
                onChange={(e)=>{dispatch(updateSettingsField({ item_low_stock_value: e.target.value}))}}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="col-sm-12 mt_20 d-flex justify-content-between align-items-center mt-2 mb-2">
          <div className="dis_in title_2">
            Show low stock notification
            <div
              className="dis_in"
              title="Allow low stock notification to get low stock alert."
            >
              <i className="glyphicon glyphicon-info-sign"></i>
            </div>
          </div>
          <div className="flot_right form-check form-switch">
            <input
              type="checkbox"
              id="chk_low_stock"
              checked={setting.item_low_stock_alert ?? data?.item_low_stock_alert}
              onChange={(e) =>{dispatch(updateSettingsField({ item_low_stock_alert: e.target.checked}))}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsItem;
