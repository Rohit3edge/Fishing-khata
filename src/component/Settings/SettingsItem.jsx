import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Getunits } from "../../store/slices/settings";
import { updateSettingsField } from "../../store/slices/settings";

const SettingsItem = ({ data }) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state?.settings?.updatesettings);

  const [units, setUnits] = useState();

  React.useEffect(() => {
    dispatch(Getunits())
      .unwrap()
      .then((data) => {
        setUnits(data.data);
      })
      .catch(({ message }) => {
        console.log(message);
      });
  }, [dispatch]);

  return (
    <div
      class=""
      id="items"
      role="tabpanel"
      aria-labelledby="items-tab"
    >
      <div class="container">
        <div class="row pt-4">
          <div class="col-sm-6">


          <div class="form-group row my-2">
              <label for="stock_value_method" class="col-sm-6 col-form-label">
              Stock Calculation Method
              </label>
              <div class="col-sm-6">
                <select
                  name="stock_value_method"
                  id="sell_type"
                  class="form-control form-control-sm"
                  value={
                    setting?.stock_calculation_method ??
                    data?.stock_calculation_method
                  }
                  onChange={(e) => {
                    dispatch(
                      updateSettingsField({
                        stock_calculation_method: e.target.value,
                      })
                    );
                  }}
                >
                  <option value="Non-Integrated">Non-Integrated</option>
                  <option value="Integrated ">Integrated </option>
                </select>
              </div>
            </div>
          <div class="form-group row my-2">
              <label for="stock_value_method" class="col-sm-6 col-form-label">
              Stock Valuation Method
              </label>
              <div class="col-sm-6">
                <select
                  name="stock_value_method"
                  id="sell_type"
                  class="form-control form-control-sm"
                  value={
                    setting?.stock_value_method ??
                    data?.stock_value_method
                  }
                  onChange={(e) => {
                    dispatch(
                      updateSettingsField({
                        stock_value_method: e.target.value,
                      })
                    );
                  }}
                >
                  <option value="Average Purchase Price">Average Purchase Price</option>
                  <option value="FIFO">FIFO</option>
                  <option value="LIFO">LIFO</option>
                </select>
              </div>
            </div>


            <div class="form-group row my-2">
              <label for="sell_type" class="col-sm-6 col-form-label">
                What do you sell?
              </label>
              <div class="col-sm-6">
                <select
                  name="sell_type"
                  id="sell_type"
                  class="form-control form-control-sm"
                  value={
                    setting?.item_default_type ??
                    data?.item_default_type
                  }
                  onChange={(e) => {
                    dispatch(
                      updateSettingsField({
                        item_default_type: e.target.value,
                      })
                    );
                  }}
                >
                  <option value="Product/Service">Product/Service</option>
                  <option value="Product">Product</option>
                  <option value="Service">Service</option>
                </select>
              </div>
            </div>

            <div class="form-group row my-2">
              <label for="item_unit" class="col-sm-6 col-form-label">
                Set default item unit
              </label>
              <div class="col-sm-6">
                <select
                  name="item_unit"
                  id="item_unit"
                  class="form-control form-control-sm"
                  value={
                    setting?.item_unit_default_value ??
                    data?.item_unit_default_value
                  }
                  onChange={(e) => {
                    dispatch(
                      updateSettingsField({
                        item_unit_default_value: e.target.value,
                      })
                    );
                  }}
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

            <div class="form-group row my-2">
              <label for="gst_rate" class="col-sm-6 col-form-label">
                Set default GST rate
              </label>
              <div class="col-sm-6">
                <select
                  name="gst_rate"
                  id="gst_rate"
                  class="form-control form-control-sm"
                  value={
                    setting?.item_tax_default_type ??
                    data?.item_tax_default_type
                  }
                  onChange={(e) => {
                    dispatch(
                      updateSettingsField({
                        item_tax_default_type: e.target.value,
                      })
                    );
                  }}
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

            <div class="form-group row my-2">
              <label for="category_list" class="col-sm-6 col-form-label">
                Set default item category
              </label>
              <div class="col-sm-6">
                <select
                  name="category_list"
                  id="category_list"
                  class="form-control form-control-sm"
                  value={
                    setting?.item_category_default ??
                    data?.item_category_default
                  }
                  onChange={(e) => {
                    dispatch(
                      updateSettingsField({
                        item_category_default: e.target.value,
                      })
                    );
                  }}
                >
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div class="form-group row my-2">
              <label for="low_stock_txt" class="col-sm-6 col-form-label">
                Set low stock value
              </label>
              <div class="col-sm-6">
                <input
                  name="low_stock_txt"
                  type="number"
                  class="form-control form-control-sm"
                  value={
                    setting?.item_low_stock_value ?? data?.item_low_stock_value
                  }
                  onChange={(e) => {
                    dispatch(
                      updateSettingsField({
                        item_low_stock_value: e.target.value,
                      })
                    );
                  }}
                />
              </div>
            </div>

            <div class="form-group row my-2">
              <label class="col-sm-6 col-form-label">
                Show low stock notification
              </label>
              <div class="col-sm-6">
                <div class="form-check form-switch">
                  <input
                    type="checkbox"
                    id="chk_low_stock"
                    class="form-check-input"
                    checked={
                      setting?.item_low_stock_alert ??
                      data?.item_low_stock_alert
                    }
                    onChange={(e) => {
                      dispatch(
                        updateSettingsField({
                          item_low_stock_alert: e.target.checked,
                        })
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsItem;
