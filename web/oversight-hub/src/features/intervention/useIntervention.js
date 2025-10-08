import { useState } from 'react';
import api from '../../lib/api';

export const useIntervention = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIntervene = async (command) => {
    setIsSubmitting(true);
    try {
      await api.post('/intervene', {
        command,
        reason: `Manual intervention: ${command}`,
      });
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
