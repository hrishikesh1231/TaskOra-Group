import React from "react";
import axios from "axios";
import "./BuyTokens.css";

const BuyTokens = () => {

  const handleBuy = async (packageId) => {
    try {
      // 1️⃣ Create order
      const { data } = await axios.post(
        "/api/tokens/create-order",
        { packageId },
        { withCredentials: true }
      );

      const options = {
        key: data.key,
        amount: data.amount,        // paisa
        currency: "INR",
        order_id: data.orderId,

        handler: async function (response) {
          try {
            // 2️⃣ Verify payment
            await axios.post(
              "/api/tokens/verify",
              {
                ...response,
                amount: data.amount,  // 🔥 IMPORTANT FIX
              },
              { withCredentials: true }
            );

            alert("✅ Tokens Added Successfully!");
            window.location.reload(); // refresh balance

          } catch (err) {
            console.error("Verification Failed:", err);
            alert("Payment verification failed");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="buy-container">
      <h2 className="buy-title">Buy Tokens</h2>

      <div className="token-grid">

        <div className="token-card">
          <h3>100 Tokens</h3>
          <p className="price">₹200</p>
          <button onClick={() => handleBuy("pack100")}>
            Buy Now
          </button>
        </div>

        <div className="token-card">
          <h3>200 Tokens</h3>
          <p className="price">₹300</p>
          <button onClick={() => handleBuy("pack200")}>
            Buy Now
          </button>
        </div>

        <div className="token-card popular">
          <span className="badge">Best Value</span>
          <h3>500 Tokens</h3>
          <p className="price">₹450</p>
          <button onClick={() => handleBuy("pack500")}>
            Buy Now
          </button>
        </div>

        <div className="token-card">
          <h3>1000 Tokens</h3>
          <p className="price">₹750</p>
          <button onClick={() => handleBuy("pack1000")}>
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default BuyTokens;