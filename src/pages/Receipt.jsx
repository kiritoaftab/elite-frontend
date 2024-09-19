import { useEffect } from "react";
import logo from "../assets/elite-logo.jpg";
import github from "../assets/github.png";

const Receipt = ({ payment, close }) => {
  useEffect(() => {
    window.print(); // Trigger print when the component is rendered
    close(); // Close/remove the component after printing
  }, [close]);

  return (
    <div
      id="receipt"
      style={{
        width: "3.14in",
        // padding: "10px",
        fontSize: "24px",
        fontFamily: "Arial",
      }}
    >
      <div
        id="receipt-header-1"
        style={{ textAlign: "center", marginBottom: "10px" }}
      >
        <strong style={{ fontSize: "32px", fontStyle: "italic" }}>
          Elite Experience
        </strong>
      </div>
      <div
        id="receipt-header"
        style={{
          textAlign: "left",
          marginBottom: "10px",
          borderBottom: "3px solid #000",
          paddingBottom: "1px",
        }}
      >
        <strong
          style={{ fontSize: "28px", textDecoration: "underline !important" }}
        >
          {payment.ordersList[0].vendor.shopName || "Shop Name"}
        </strong>
      </div>

      <div id="receipt-body">
        {payment.ordersList.map((order, index) => (
          <div
            key={index}
            className="receipt-item"
            style={{
              marginBottom: "8px",
              borderBottom: "1px dashed #000",
              paddingBottom: "5px",
            }}
          >
            <p id={`product-name-${index}`}>
              <strong>
                {" "}
                <span>{order.product.name}</span>
              </strong>
            </p>
            <p id={`quantity-${index}`}>
              <strong>Quantity:</strong> {order.unit}
            </p>
          </div>
        ))}
      </div>

      <div
        id="receipt-footer"
        style={{ textAlign: "center", marginTop: "10px" }}
      >
        <p style={{ fontSize: "20px", fontWeight: 600 }}>
          Thank you for your purchase!
        </p>
        <p style={{ fontSize: "20px", fontWeight: 600 }}>
          Developed by
          <svg
            height="22"
            aria-hidden="true"
            viewBox="0 0 16 16"
            version="1.1"
            width="22"
            data-view-component="true"
            style={{
              verticalAlign: "middle",
              marginLeft: "5px",
              marginRight: "5px",
            }}
          >
            <path
              fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.63 7.63 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
          kiritoaftab
        </p>
      </div>
    </div>
  );
};

export default Receipt;
