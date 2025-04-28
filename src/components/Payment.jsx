import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FiCheck } from 'react-icons/fi';

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
  const tiers = [
    {
      name: "Tier 2",
      price: 1000,
      key: "tier_2",
      color: "indigo",
      benefits: [
        "Access to Group Projects",
        "Multiple task assignments",
        "Advanced project tracking",
        "Priority support"
      ]
    },
    {
      name: "Tier 3",
      price: 2000,
      key: "tier_3",
      color: "indigo",
      benefits: [
        "All Tier 2 features",
        "Access to Collaborative Projects",
        "Real-time collaboration",
        "Advanced analytics",
        "24/7 premium support"
      ]
    }
  ];

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
            Upgrade Your Plan
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan to enhance your project management experience
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.key}
              className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50
                       overflow-hidden transition-all duration-300 hover:scale-105 hover:border-gray-600/50"
            >
              <div className="p-8">
                <h3 className={`text-2xl font-semibold text-${tier.color}-400`}>
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-extrabold text-white">
                    ₹{tier.price}
                  </span>
                  <span className="ml-2 text-gray-400">/lifetime</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center text-gray-300">
                      <FiCheck className={`w-5 h-5 text-${tier.color}-400 mr-2`} />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(tier.key)}
                  disabled={loading}
                  className={`mt-8 w-full bg-${tier.color}-500 hover:bg-${tier.color}-600 
                           text-white font-semibold py-3 px-6 rounded-lg shadow-lg 
                           hover:shadow-${tier.color}-500/25 transition-all duration-300 
                           disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? 'Processing...' : `Upgrade to ${tier.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-8 text-center">
            <p className="text-red-400 bg-red-500/10 border border-red-500/20 
                         rounded-lg px-4 py-2 inline-block">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mt-8 text-center">
            <p className="text-green-400 bg-green-500/10 border border-green-500/20 
                         rounded-lg px-4 py-2 inline-block">
              {success}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
