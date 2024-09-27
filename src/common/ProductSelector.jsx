import React from 'react';
const ProductSelector = ({ itemList, selectedProduct, handleProductChange, singleDetail, state, handleInputChange, calculateTotal, handleAddItem, isPurchase }) => (
  <>
    <thead>
      <tr>
        <th>Item</th>
        <th>HSN/SAC</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Cost</th>
        <th>GST</th>
        <th>Discount</th>
        {isPurchase && ( <th>Add. Tax</th>)}
        <th>Total Amount</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="align-middle">
          <select className="form-control" value={state.selectedProduct || ''} onChange={(e) => handleProductChange(e.target.value)}>
            <option value="">--Select Product--</option>
            {state.itemList?.map((option, index) => (
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
              style={isPurchase ? { width: '40px', padding: '0.4rem' } : {}}
            />
            <select className="form-control" value={state?.unit_id} onChange={(e) => handleInputChange('unit_id', e.target.value)}>
              <option value="">--Select Unit--</option>
              {state?.units?.map((unit, index) => (
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
            value={state?.price !== 0 ? parseFloat(state?.price).toFixed(2) : singleDetail?.sale_price ? parseFloat(singleDetail?.sale_price).toFixed(2) : 0}
            onChange={(e) => handleInputChange('price', e.target.value)}
            style={isPurchase ? { width: '70px', padding: '0.4rem' } : {}}
          />
        </td>
        <td className="align-middle">₹{(Number(singleDetail?.sale_price || 0) * Number(state?.quantity || 0)).toFixed(2)}</td>
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
            <select className="form-control" value={state?.price_tax_type} onChange={(e) => handleInputChange('price_tax_type', e.target.value)}>
              <option value="Including Tax">Including Tax</option>
              <option value="Excluding Tax">Excluding Tax</option>
            </select>
          </div>
        </td>
        <td className="align-middle">
          <div className="input-group">
            <input type="text" className="form-control" value={state?.discount} onChange={(e) => handleInputChange('discount', e.target.value)} />
            <select
              className="form-control"
              value={state?.discount_type}
              onChange={(e) => handleInputChange('discount_type', e.target.value)}
              style={isPurchase ? { width: '40px', padding: '0.4rem' } : {}}
            >
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </select>
          </div>
        </td>
        {isPurchase && (
          <td class="align-middle">
            <div class="input-group">
              <select class="form-control" name="add_tax" value={state?.add_tax} onChange={(e) => handleInputChange('add_tax', e.target.value)} >
                <option value="0">None</option>
                {state?.additionaltax?.map((tax, index) => (
                <option key={index} value={ `${Number(tax?.tax_perc)?.toFixed(0)}@${tax?.tax_type}`}>
                  { `${Number(tax?.tax_perc)?.toFixed(0)}@${tax?.tax_type}`}
                </option>
              ))}
              </select>
            </div>
          </td>
        )}
        <td className="align-middle">₹{calculateTotal?.finalTotal.toFixed(2)}</td>
        <td>
          <button className="btn-sm btn-success" onClick={() => handleAddItem()}>
            Add
          </button>
        </td>
      </tr>
    </tbody>
  </>
);
export default ProductSelector;
