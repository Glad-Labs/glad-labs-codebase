import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useFinancials = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchFinancials = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/financials`, {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (isMounted) {
          const entriesData = Array.isArray(response.data)
            ? response.data
            : response.data.results || response.data.data || [];

          setEntries(entriesData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          if (retryCount < maxRetries && err.code !== 'ECONNABORTED') {
            retryCount++;
            console.warn(
              `Failed to fetch financials (attempt ${retryCount}/${maxRetries}):`,
              err.message
            );
            setTimeout(fetchFinancials, 2000 * retryCount);
          } else {
            setError(
              `Failed to fetch financial data: ${err.message}. Please ensure the backend is running.`
            );
            console.error('Error fetching financials:', err);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFinancials();

    return () => {
      isMounted = false;
    };
  }, []);

  return { entries, loading, error };
};
