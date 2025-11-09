import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CheckoutPage({ user, setUser }) {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const [paymentMode, setPaymentMode] = useState("cod");
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: "", cvv: "" });

  const handleCheckout = async () => {
    if (!cart.length) return alert("Your cart is empty!");
    try {
      const res = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cart, paymentMode, paymentDetails }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("cart");
        alert("✅ Checkout successful! Order ID: " + data.order_id);
        navigate("/");
      } else {
        alert("Checkout failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error during checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} setUser={setUser} />
      <div className="max-w-4xl mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h2>

        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b py-3">
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}

        <h3 className="text-xl font-semibold mt-6">
          Total: ₹{cart.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0)}
        </h3>

        <div className="mt-6">
          <label className="block mb-2 font-semibold text-gray-700">Payment Method</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit/Debit Card</option>
          </select>

          {paymentMode === "card" && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Card Number"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                className="border p-2 w-full mb-3 rounded"
              />
              <input
                type="text"
                placeholder="CVV"
                value={paymentDetails.cvv}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                className="border p-2 w-full rounded"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleCheckout}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Proceed to Checkout
        </button>

        <button
          onClick={() => navigate("/cart")}
          className="mt-3 w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          ← Back to Cart
        </button>
      </div>
    </div>
  );
}
