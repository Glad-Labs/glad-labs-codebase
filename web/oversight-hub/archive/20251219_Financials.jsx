import React, { useState, useEffect } from 'react';
import { apiConfig, getToken } from '../firebaseConfig';
import { formatTimestamp } from '../utils/helpers';
import './Financials.css';

/**
 * Updated October 26, 2025 (Phase 5)
 * MIGRATED: From Firestore real-time subscriptions to PostgreSQL REST API with polling
 *
 * Changes:
 * - Replaced onSnapshot with fetch polling (every 10 seconds)
 * - Fetch from /api/financials endpoint (returns sorted by date desc)
 * - Client-side calculations remain the same
 * - Added proper cleanup for polling intervals
 */

const Financials = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `${apiConfig.baseURL}/financials?sort=date&order=desc`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch financial data (${response.status})`
          );
        }

        const data = await response.json();
        setEntries(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(`Failed to fetch financial data: ${err.message}`);
        setLoading(false);
        console.error('Financials fetch error:', err);
      }
    };

    fetchFinancials();
    const interval = setInterval(fetchFinancials, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // --- Calculations ---
  const totalSpend = entries.reduce(
    (acc, entry) => acc + (entry.amount || 0),
    0
  );
  const costPerArticle =
    entries.length > 0 ? (totalSpend / entries.length).toFixed(2) : 0;

  // Calculate weekly burn rate
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklySpend = entries
    .filter((entry) => {
      if (!entry.date) return false;
      const entryDate = new Date(entry.date);
      return entryDate > oneWeekAgo;
    })
    .reduce((acc, entry) => acc + (entry.amount || 0), 0);

  if (loading) return <p>Loading financial data...</p>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="financials-dashboard">
      <h2>Financials</h2>
      <div className="metrics-summary">
        <div className="metric-card">
          <h3>Total Spend</h3>
          <p>${totalSpend.toFixed(2)}</p>
        </div>
        <div className="metric-card">
          <h3>Cost Per Article</h3>
          <p>${costPerArticle}</p>
        </div>
        <div className="metric-card">
          <h3>Weekly Burn Rate</h3>
          <p>${weeklySpend.toFixed(2)}</p>
          <small>(Last 7 days)</small>
        </div>
      </div>
      <h3>Recent Transactions</h3>
      <div className="transactions-list">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td>{formatTimestamp(entry.date)}</td>
                <td>{entry.description}</td>
                <td>{entry.category}</td>
                <td>${(entry.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Financials;
