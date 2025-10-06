import React from 'react';

const FinancialsList = ({ financials, loading }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
    <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Financials</h2>
    {loading ? (
      <p>Loading financials...</p>
    ) : (
      <ul>
        {financials.length > 0 ? (
          financials.map((fin) => (
            <li key={fin.id} className="p-2 border-b border-gray-700">
              {fin.metric}: <span className="text-green-400">{fin.value}</span>
            </li>
          ))
        ) : (
          <p>No financial data available.</p>
        )}
      </ul>
    )}
  </div>
);

export default FinancialsList;
