import { useEffect } from "react";

const Receipt = ({ payment, close }) => {
    useEffect(() => {
      window.print();  // Trigger print when the component is rendered
      close();  // Close/remove the component after printing
    }, [close]);
  
    return (
      <div id="receipt" style={{ width: '3.14in', padding: '10px', fontSize: '24px', fontFamily: 'Arial' }}>
        <div id="receipt-header" style={{ textAlign: 'center', marginBottom: '10px' }}>
          <strong>{payment.ordersList[0].vendor.shopName || 'Shop Name'}</strong>
        </div>
  
        <div id="receipt-body">
          {payment.ordersList.map((order, index) => (
            <div
              key={index}
              className="receipt-item"
              style={{ marginBottom: '8px', borderBottom: '1px dashed #000', paddingBottom: '5px' }}
            >
              <p id={`product-name-${index}`}><strong> <span style={{fontSize:'28px'}}>{order.product.name}</span></strong></p>
              <p id={`quantity-${index}`}><strong>Quantity:</strong> {order.unit}</p>
            </div>
          ))}
        </div>
  
        <div id="receipt-footer" style={{ textAlign: 'center', marginTop: '10px' }}>
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    );
  };

  export default Receipt;
  