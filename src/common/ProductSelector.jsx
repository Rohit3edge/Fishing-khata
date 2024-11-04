import React from 'react';
const ProductSelector = ({ handleProductChange, singleDetail, state, handleInputChange, calculateTotal, handleAddItem, isPurchase, isDiscount }) => (
  <>
    <thead>
      <tr>
        <th>Item</th>
        <th>HSN/SAC</th>
        <th>Quantity</th>
        <th>Unit</th>
        <th>Price</th>
        <th>Cost</th>
        <th>GST</th>
        {isDiscount && <th>Discount</th>}
        {isPurchase && <th>Add. Tax</th>}
        <th>Total Amount</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="align-middle">
          <select className="form-control" value={state?.selectedProduct || ''} onChange={(e) => handleProductChange(e.target.value)}>
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
          <input
            className="form-control"
            type="text"
            value={state?.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            style={isPurchase ? { width: '40px', padding: '0.4rem' } : { width: '60px', padding: '0.4rem' }}
          />
        </td>
        <td className="align-middle">{state?.units?.find((unit) => unit.id == state?.unit_id)?.unit || 'N/A'}</td>
        <td className="align-middle">
          <input
            type="text"
            className="form-control"
            value={state?.price !== undefined ? state.price : ''} // Allow empty value
            onChange={(e) => {
              let inputValue = e.target.value;

              // Regex allows 0 or other numbers, and up to 2 decimal places
              const validInput = /^(0|[1-9]\d*)(\.\d{0,2})?$/.test(inputValue);

              // If input is valid or empty, update the state
              if (validInput || inputValue === '') {
                handleInputChange('price', inputValue);
              }
            }}
            onBlur={() => {
              // On blur, if input is empty, set it back to 0.00
              if (state.price === '' || state.price === undefined) {
                handleInputChange('price', '0.00');
              }
            }}
            style={isPurchase ? { width: '70px', padding: '0.4rem' } : {}}
          />
        </td>
        <td className="align-middle">₹{(Number(state?.price) * Number(state?.quantity)).toFixed(2)}</td>
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
        {isDiscount && (
          <td className="align-middle">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={state?.discount !== undefined ? state.discount : ''} // Allow empty input
                onChange={(e) => {
                  let inputValue = e.target.value;
    
                  // Check for valid input: allow numbers with up to 2 decimal places, or allow an empty value
                  const validInput = /^(0|[1-9]\d*)(\.\d{0,2})?$/.test(inputValue);
    
                  // If input is valid or empty, update the state
                  if (validInput || inputValue === '') {
                    handleInputChange('discount', inputValue);
                  }
                }}
                onBlur={() => {
                  // On blur, if input is empty, reset it to 0.00
                  if (state.discount === '' || state.discount === undefined) {
                    handleInputChange('discount', '0.00');
                  }
                }}
              />
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
        )}

        {isPurchase && (
          <td class="align-middle">
            <div class="input-group">
              <select class="form-control" name="add_tax" value={state?.add_tax} onChange={(e) => handleInputChange('add_tax', e.target.value)}>
                <option value="0">None</option>
                {state?.additionaltax?.map((tax, index) => (
                  <option key={index} value={`${Number(tax?.tax_perc)?.toFixed(0)}@${tax?.tax_type}`}>
                    {`${Number(tax?.tax_perc)?.toFixed(0)}@${tax?.tax_type}`}
                  </option>
                ))}
              </select>
            </div>
          </td>
        )}
        <td className="align-middle">₹{calculateTotal?.finalTotal.toFixed(2)}</td>
        <td>
          <button className="btn-sm btn-success" onClick={() => handleAddItem()} disabled={!state?.selectedProduct}>
            Add
          </button>
        </td>
      </tr>
    </tbody>
  </>
);
export default ProductSelector;
