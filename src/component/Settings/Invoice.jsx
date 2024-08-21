import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSettingsField } from "../../store/slices/settings";
const Invoice = ({ data }) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state?.settings?.updatesettings);
  // const { data, loading, error } = useSelector((state) => state.settings);

  return (
    <div class="">
      <div class="container">
        <div class="row pt-4">
          <div class="col-12 pt-1">
            <div class="row">
              <div class="col-md-8">
                <div class="form-group row my-2">
                  <label class="col-sm-6 col-form-label">
                    Set Invoice Account Type
                  </label>
                  <div class="col-sm-6">
                    <select
                      name="invoice_account_type"
                      class="form-control form-control-sm"
                      value={
                        setting?.invoice_account_type ??
                        data?.invoice_account_type
                      }
                      onChange={(e) => {
                        dispatch(
                          updateSettingsField({
                            invoice_account_type: e.target.value,
                          })
                        );
                      }}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Credit">Credit</option>
                    </select>
                  </div>
                </div>

                <div class="form-group row my-2">
                  <label class="col-sm-6 col-form-label">
                    Set Default Payment Mode
                  </label>
                  <div class="col-sm-6">
                    <select
                      name="payment_mode"
                      class="form-control form-control-sm"
                      value={
                        setting?.invoice_payment_mode ??
                        data?.invoice_payment_mode
                      }
                      onChange={(e) => {
                        dispatch(
                          updateSettingsField({
                            invoice_payment_mode: e.target.value,
                          })
                        );
                      }}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Debit/Credit Card">
                        Debit/Credit Card
                      </option>
                      <option value="Cheque">Cheque</option>
                      <option value="Mobile Wallet">Mobile Wallet</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Demand Draft">Demand Draft</option>
                    </select>
                  </div>
                </div>

                <div class="form-group row my-2">
                  <label class="col-sm-6 col-form-label">
                    Set Fixed Discount on Items
                  </label>
                  <div class="col-sm-6">
                    <input
                      name="item_discount"
                      type="number"
                      class="form-control form-control-sm"
                      value={
                        setting?.invoice_item_discount ??
                        data?.invoice_item_discount
                      }
                      onChange={(e) => {
                        dispatch(
                          updateSettingsField({
                            invoice_item_discount: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>

                <div class="form-group row my-2">
                  <label class="col-sm-6 col-form-label">
                    Enable E-Way Bill Number
                  </label>
                  <div class="col-sm-6">
                    <div class="form-check form-switch">
                      <input
                        type="checkbox"
                        name="chk_ewaybill"
                        class="form-check-input"
                        checked={
                          setting?.invoice_ewaybill ?? data?.invoice_ewaybill
                        }
                        onChange={(e) => {
                          dispatch(
                            updateSettingsField({
                              invoice_ewaybill: e.target.checked,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group row my-2">
                  <label class="col-sm-6 col-form-label">
                    Invoice Shipping Address
                  </label>
                  <div class="col-sm-6">
                    <div class="form-check form-switch">
                      <input
                        type="checkbox"
                        name="chk_invo_shiping_address"
                        class="form-check-input"
                        checked={
                          setting?.invoice_shipping_address ??
                          data?.invoice_shipping_address
                        }
                        onChange={(e) => {
                          dispatch(
                            updateSettingsField({
                              invoice_shipping_address: e.target.checked,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group row my-2">
                  <label class="col-sm-6 col-form-label">
                    Set Default Terms and Conditions
                  </label>
                  <div class="col-sm-6">
                    <textarea
                      name="Terms and Conditions"
                      class="form-control"
                      rows="3"
                      onChange={(e) => {
                        dispatch(
                          updateSettingsField({ invoice_terms: e.target.value })
                        );
                      }}
                      value={setting?.invoice_terms ?? data?.invoice_terms}
                    ></textarea>
                  </div>
                </div>

                <div class="form-group row my-2">
                  <label class="col-sm-6 col-form-label">
                    Upload Signature
                  </label>
                  <div class="col-sm-6">
                    <div class="input-group">
                      <input
                        type="file"
                        name="img_profile"
                        class="form-control"
                        accept=".png,.jpg,.jpeg"
                      />
                      <div class="input-group-append">
                        <input
                          type="submit"
                          name="upload_signature"
                          class="btn btn-primary"
                          value="Upload"
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
    </div>
  );
};

export default Invoice;
