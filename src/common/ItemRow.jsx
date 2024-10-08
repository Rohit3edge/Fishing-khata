import React from 'react';
const ItemRow = ({ addedItems, handleRemoveItem, handleInputChange, grandTotal, state, handleItemChange,isPurchase,isDiscount }) => (
  <>
    {addedItems?.map((item, index) => (
      <tr key={index}>
        <td className="align-middle">
          <select className="form-control" value={item?.item_id} onChange={(e) => handleItemChange('item_id', e.target.value, index)}>
            <option value="">--Select Product--</option>
            {state?.itemList?.map((option, idx) => (
              <option key={idx} value={option?.id}>
                {option?.name}
              </option>
            ))}
          </select>
        </td>
        <td className="align-middle">{item?.hsn}</td>
        <td className="align-middle">
          <div className="input-group">
            <input className="form-control" type="text" value={item?.quantity} onChange={(e) => handleItemChange('quantity', e.target.value, index)} />
            <select className="form-control" value={item?.unit_id} onChange={(e) => handleItemChange('unit_id', e.target.value, index)}>
              <option value="">--Select Unit--</option>
              {state?.units?.map((option, idx) => (
                <option key={idx} value={option?.id}>
                  {option?.unit}
                </option>
              ))}
            </select>
          </div>
        </td>
        <td className="align-middle">
          <input type="text" className="form-control" name="price" value={Number(item?.price).toFixed(2)} onChange={(e) => handleItemChange('price', e.target.value, index)} />
        </td>
        <td className="align-middle">₹{((item?.price || 0) * (item?.quantity || 0)).toFixed(2).toString().replace(/^-/, '₹')}</td>
        <td className="align-middle">
          <div className="input-group">
            <select className="form-control" name="tax" value={parseFloat(item?.tax)} onChange={(e) => handleItemChange('tax', e.target.value, index)}>
              <option value="0">Exempted</option>
              <option value="2.5">2.5%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
            <select className="form-control" name="price_tax_type" value={item?.price_tax_type} onChange={(e) => handleItemChange('price_tax_type', e.target.value, index)}>
              <option value="Including Tax">Including Tax</option>
              <option value="Excluding Tax">Excluding Tax</option>
            </select>
          </div>
        </td>
        {isDiscount && (
        <td className="align-middle">
          <div className="input-group">
            <input type="text" className="form-control" name="discount" value={item?.discount} onChange={(e) => handleItemChange('discount', e.target.value, index)} />
            <select className="form-control" name="discount_type" value={item?.discount_type} onChange={(e) => handleItemChange('discount_type', e.target.value, index)}>
              <option value="Fixed">Fixed</option>
              <option value="Percentage">Percentage</option>
            </select>
          </div>
        </td>)}
        {isPurchase && (
          <td class="align-middle">
            <div class="input-group">
              <select class="form-control" name="add_tax" value={item?.add_tax} onChange={(e) => handleItemChange('add_tax', e.target.value,index)} >
                <option value="0">None</option>
                <option value="2@Cess">2@Cess</option>
              </select>
            </div>
          </td>
        )}
        <td>₹{Number(item.total_amount || 0).toFixed(2)}</td>
        <td>
          <button className="btn-sm btn-danger" onClick={() => handleRemoveItem(index)}>
            Remove
          </button>
        </td>
      </tr>
    ))}
    <tr>
      <td colSpan="7" className="text-right align-middle">
        <strong>Shipment Amount:</strong>
        <span className="fw-normal text-muted">(12% GST applicable)</span>
      </td>
      <td colSpan="2">
        <input type="text" className="form-control" value={state?.shippingCost} onChange={(e) => handleInputChange('shippingCost', e.target.value)} />
      </td>
    </tr>
    <tr>
      <td colSpan="7" className="text-right align-middle">
        <strong>Grand Total:</strong>
      </td>
      <td colspan="2" className="align-middle">
        ₹{grandTotal}
      </td>
    </tr>
    {Object.entries(state?.taxAmounts).map(([taxRate, amount], index) => {
      if (amount > 0) {
        // Only show taxes with a non-zero amount
        return (
          <tr key={index}>
            <td colSpan="7" className="text-right align-middle">
              <strong>GST {Number(taxRate)?.toFixed(1)}%:</strong>
            </td>
            <td colSpan="2" className="align-middle">
              ₹{amount.toFixed(2)}
            </td>
          </tr>
        );
      }
      return null; // Do not render rows with zero tax amounts
    })}
  </>
);

export default ItemRow;
