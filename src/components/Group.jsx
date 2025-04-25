import React from 'react';

function Group({ user }) {
  return (
    <>
      {user.tier !== "TIER_2" && user.tier !== "TIER_3" && (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upgrade to Tier 2 or Tier 3</h2>
            <p className="mb-4">To access the Group feature, please upgrade your plan.</p>
            <button
              onClick={() => (window.location.href = "/upgrade")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Group;