export const sendIntervention = async () => {
  // eslint-disable-next-line no-console
  console.log('Intervention button clicked...');
  try {
    // Use the backend API base URL from environment or config
    const API_BASE_URL =
      process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const response = await fetch(
      `${API_BASE_URL}/api/orchestrator/intervention`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // No body is needed as the backend is pre-configured to send the PAUSE signal.
      }
    );

    if (response.ok) {
      const result = await response.json();
      alert(`Intervention signal sent successfully: ${result.message}`);
    } else {
      // Attempt to get a more descriptive error from the response body.
      const errorText = await response.text();
      alert(
        `Error: Could not send intervention signal. Server responded with: ${response.status} ${response.statusText}. Details: ${errorText}`
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to send intervention signal:', error);
    alert(`Failed to send intervention signal: ${error.message}`);
  }
};;
