import { useState } from 'react';

export const useIntervention = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIntervene = async (command) => {
    const functionUrl = process.env.REACT_APP_INTERVENE_FUNCTION_URL;
    if (!functionUrl) {
      alert('Intervention Function URL is not configured.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          reason: `Manual intervention: ${command}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send ${command} signal.`);
      }

      alert(`${command} signal sent successfully.`);
    } catch (err) {
      console.error(`${command} failed:`, err);
      alert(`Failed to send ${command} signal.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleIntervene, isSubmitting };
};
