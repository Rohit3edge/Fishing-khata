import React from "react";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { updateSettingsField } from "../../store/slices/settings";
const TaxesGst = ({ data }) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state?.settings?.updatesettings);

  return (
    <div
      class=""
      id="taxes"
      role="tabpanel"
      aria-labelledby="taxes-tab"
    >
      <div class="container">
        <div class="row pt-4">
          <div class="col-12 pt-1">
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group row mb-0">
                  <label class="col-sm-8 col-form-label d-flex align-items-center">
                    Additional Tax On Item
                  </label>
                  <div class="col-sm-4">
                    <div class="form-check form-switch">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        checked={
                          setting?.item_tax_default_value ??
                          data?.item_tax_default_value
                        }
                        onChange={(e) => {
                          dispatch(
                            updateSettingsField({
                              item_tax_default_value: e.target.checked,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group row pt-2 pb-2">
                  <label class="col-sm-8 col-form-label d-flex align-items-center">
                    Composite Scheme
                  </label>
                  <div class="col-sm-4">
                    <div class="form-check form-switch">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        checked={setting?.is_composite ?? data?.is_composite}
                        onChange={(e) => {
                          dispatch(
                            updateSettingsField({
                              is_composite: e.target.checked,
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
      </div>
    </div>
  );
};

export default TaxesGst;
