import React, { useMemo } from 'react';
import { useFinancials } from '../../features/financials/useFinancials';
import { formatTimestamp } from '../../lib/date';
import '../Financials.css';

const Financials = () => {
  const { entries, loading, error } = useFinancials();

  // --- Calculations ---
  const { totalSpend, costPerArticle, weeklySpend } = useMemo(() => {
    const totalSpend = entries.reduce(
      (acc, entry) => acc + (entry.amount || 0),
      0
    );

    // Count unique articles by deduplicate article_id to handle duplicate entries
    const uniqueArticleIds = new Set();
    entries.forEach((entry) => {
      if (entry.article_id) {
        uniqueArticleIds.add(entry.article_id);
      }
    });
    const articleCount =
      uniqueArticleIds.size > 0 ? uniqueArticleIds.size : entries.length;
    const costPerArticle =
      articleCount > 0 ? (totalSpend / articleCount).toFixed(2) : '0.00';

    // Calculate weekly burn rate
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklySpend = entries
      .filter(
        (entry) => entry.timestamp && entry.timestamp.toDate() > oneWeekAgo
      )
      .reduce((acc, entry) => acc + (entry.amount || 0), 0);

    return { totalSpend, costPerArticle, weeklySpend };
  }, [entries]);

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
