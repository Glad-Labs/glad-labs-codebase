export const sendIntervention = async () => {
  console.log('Intervention button clicked...');
  try {
    // Re-implementing the fetch call to the Strapi backend.
    const response = await fetch('http://localhost:1337/api/intervention', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // No body is needed as the backend is pre-configured to send the PAUSE signal.
    });

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
    console.error('Failed to send intervention signal:', error);
    alert(`Failed to send intervention signal: ${error.message}`);
  }
};
