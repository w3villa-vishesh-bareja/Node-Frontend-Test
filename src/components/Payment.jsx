import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePurchase = async (tier) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/payments/create-order", {
        tier,
        userId: user.id,
      });

      const order = res.data;

      const options = {
        key: "rzp_test_DWYqJIt4IyNzn8", 
        amount: order.amount,
        currency: order.currency,
        name: "Taskify",
        description: `Purchase ${tier} Plan`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post("http://localhost:5000/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId:order.notes.userId,
              tier: order.notes.tierPlan,
            });

            if (verifyRes.data.success) {
              setSuccess(`Successfully purchased ${tier} plan!`);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (verificationError) {
            setError("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#6366F1", 
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Buy Plans</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handlePurchase("tier_2")}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded shadow disabled:opacity-50"
        >
          Buy Tier 2 Plan
        </button>

        <button
          onClick={() => handlePurchase("tier_3")}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded shadow disabled:opacity-50"
        >
          Buy Tier 3 Plan
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-600">Processing your request...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {success && <p className="mt-4 text-green-600 font-semibold">{success}</p>}
    </div>
  );
};

export default Payment;
