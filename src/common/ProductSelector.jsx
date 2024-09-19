import React from 'react';
const ProductSelector = ({ itemList, selectedProduct, handleProductChange, singleDetail, state, handleInputChange,calculateTotal }) => (
    <table className="table item-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>HSN/SAC</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Cost</th>
          <th>GST</th>
          <th>Discount</th>
          <th>Total Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="align-middle">
            <select className="form-control" value={selectedProduct} onChange={(e) => handleProductChange(e.target.value)}>
              <option value="">--Select Product--</option>
              {itemList?.map((option, index) => (
                <option key={index} value={option?.id}>
                  {option?.name}
                </option>
              ))}
            </select>
          </td>
          <td className="align-middle">{singleDetail?.hsn}</td>
          <td className="align-middle">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                value={state?.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
              />
              <select className="form-control" value={state?.selectedUnit} onChange={(e) => handleInputChange('selectedUnit', e.target.value)}>
                <option value="">--Select Unit--</option>
                {state.units?.map((unit, index) => (
                  <option key={index} value={unit?.id}>
                    {unit?.unit}
                  </option>
                ))}
              </select>
            </div>
          </td>
          <td className="align-middle">
            <input
              type="text"
              className="form-control"
              value={singleDetail?.sale_price ? parseFloat(singleDetail?.sale_price).toFixed(2) : '0.00'}
              readOnly
            />
          </td>
          <td className="align-middle">
  ₹{(Number(singleDetail?.sale_price || 0) * Number(state?.quantity || 0)).toFixed(2)}
</td>
          <td className="align-middle">
            <div className="input-group">
              <select className="form-control" value={parseFloat(state?.tax)} onChange={(e) => handleInputChange('tax', e.target.value)}>
                <option value="0">Exempted</option>
                <option value="2.5">2.5%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
              <select className="form-control" value={state?.taxType} onChange={(e) => handleInputChange('taxType', e.target.value)}>
                <option value="Including Tax">Including Tax</option>
                <option value="Excluding Tax">Excluding Tax</option>
              </select>
            </div>
          </td>
          <td className="align-middle">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={state?.discount}
                onChange={(e) => handleInputChange('discount', e.target.value)}
              />
              <select className="form-control" value={state?.discountType} onChange={(e) => handleInputChange('discountType', e.target.value)}>
                <option value="Fixed">Fixed</option>
                <option value="Percentage">Percentage</option>
              </select>
            </div>
          </td>
          <td className="align-middle">₹{calculateTotal?.finalTotal.toFixed(2)}</td>
          <td>
            <button className="btn-sm btn-success" onClick={() => handleInputChange('addItem', true)}>
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
export default ProductSelector;