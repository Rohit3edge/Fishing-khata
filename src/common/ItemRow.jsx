import React from 'react';
const ItemRow = ({ addedItems, handleRemoveItem, handleInputChange, grandTotal, state, handleItemChange, isPurchase, isDiscount }) => (
  <>
    {addedItems?.map((item, index) => (
      <tr key={index}>
        <td className="align-middle" style={{ fontWeight: '300', fontSize: '14px', textAlign: 'center' }}>
          {state?.itemList?.find((unit) => unit.id == item?.item_id)?.name || 'N/A'}
        </td>
        <td className="align-middle">{item?.hsn}</td>
        <td className="align-middle">
          <input className="form-control" type="text" value={item?.quantity} onChange={(e) => handleItemChange('quantity', e.target.value, index)} style={{ width: '60px', padding: '0.4rem' }} />
        </td>
        <td className="align-middle">{state?.units?.find((unit) => unit.id == item?.unit_id)?.unit || 'N/A'}</td>
        <td className="align-middle">
          <input
            type="text"
            className="form-control"
            name="price"
            value={item?.price}
            onChange={(e) => {
              let inputValue = e.target.value;
              inputValue = inputValue.replace(/^0+/, '');
              const validInput = /^\d+(\.\d{0,2})?$/.test(inputValue);
              if (validInput || inputValue === '') {
                handleItemChange('price', inputValue, index);
              }
            }}
          />
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
              <input
                type="text"
                className="form-control"
                name="discount"
                value={item?.discount}
                onChange={(e) => {
                  let inputValue = e.target.value;
                  inputValue = inputValue.replace(/^0+/, '');
                  const validInput = /^\d+(\.\d{0,2})?$/.test(inputValue);
                  if (validInput || inputValue === '') {
                    handleItemChange('discount', inputValue, index);
                  }
                }}
              />
              <select className="form-control" name="discount_type" value={item?.discount_type} onChange={(e) => handleItemChange('discount_type', e.target.value, index)}>
                <option value="Fixed">Fixed</option>
                <option value="Percentage">Percentage</option>
              </select>
            </div>
          </td>
        )}
        {isPurchase && (
          <td class="align-middle">
            <div class="input-group">
              <select class="form-control" name="add_tax" value={item?.add_tax} onChange={(e) => handleItemChange('add_tax', e.target.value || '', index)}>
                <option value="0">None</option>
                {state?.additionaltax &&
                  state?.additionaltax?.map((tax, index) => (
                    <option key={index} value={`${Number(tax?.tax_perc)?.toFixed(0)}@${tax?.tax_type}`}>
                      {`${Number(tax?.tax_perc)?.toFixed(0)}@${tax?.tax_type}`}
                    </option>
                  ))}
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
      <td colSpan="8" className="text-right align-middle">
        <strong>Shipment Amount:</strong>
        <span className="fw-normal text-muted">(12% GST applicable)</span>
      </td>
      <td colSpan="3">
        <input type="text" className="form-control" value={state?.shippingCost} onChange={(e) => handleInputChange('shippingCost', e.target.value)} />
      </td>
    </tr>
    <tr>
      <td colSpan="8" className="text-right align-middle">
        <strong>Grand Total:</strong>
      </td>
      <td colspan="3" className="align-middle">
        ₹{grandTotal}
      </td>
    </tr>
    {Object.entries(state?.taxAmounts).map(([taxRate, amount], index) => {
      if (amount > 0) {
        // Only show taxes with a non-zero amount
        return (
          <tr key={index}>
            <td colSpan="8" className="text-right align-middle">
              <strong>GST {Number(taxRate)?.toFixed(1)}%:</strong>
            </td>
            <td colSpan="3" className="align-middle">
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
