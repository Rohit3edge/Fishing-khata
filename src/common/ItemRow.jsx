import React from 'react';
const ItemRow = ({ addedItems, handleRemoveItem, handleInputChange, grandTotal, state }) => (
    <table className="table">
      {/* <thead>
        <tr>
          <th>Item</th>
          <th>HSN</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
          <th>GST</th>
          <th>Discount</th>
          <th>Total Amount</th>
          <th>Actions</th>
        </tr>
      </thead> */}
      <tbody>
        {addedItems?.map((item, index) => (
          <tr key={index}>
            <td>{item?.name}</td>
            <td>{item?.hsn}</td>
            <td>
              <input
                className="form-control"
                type="text"
                value={item.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value, index)}
              />
            </td>
            <td>{item.price}</td>
            <td>₹{(item.price * item.quantity).toFixed(2)}</td>
            <td>{item.tax}%</td>
            <td>{item.discount}</td>
            <td>₹{item.total_amount.toFixed(2)}</td>
            <td>
              <button className="btn-sm btn-danger" onClick={() => handleRemoveItem(index)}>
                Remove
              </button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan="15" className="text-right">
            <strong>Shipping Cost:</strong>
          </td>
          <td colSpan="15">
            <input
              type="text"
              className="form-control"
              value={state?.shippingCost}
              onChange={(e) => handleInputChange('shippingCost', e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td colSpan="7" className="text-right">
            <strong>Grand Total:</strong>
          </td>
          <td>₹{grandTotal}</td>
        </tr>
      </tbody>
    </table>
  );

  export default ItemRow;