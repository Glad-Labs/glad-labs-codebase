// Placeholder for a real Pub/Sub client library
const pubsub = {
  topic: (name) => ({
    publishMessage: async ({ json }) => {
      console.log(`Publishing to Pub/Sub topic: ${name}`, json);
      alert('Intervention signal sent to the Content Agent network.');
      return 'message-id-123';
    },
  }),
};

export const sendIntervention = async () => {
  try {
    const topic = pubsub.topic('agent-interventions');
    await topic.publishMessage({
      json: {
        timestamp: new Date().toISOString(),
        source: 'OversightHub',
        action: 'PAUSE_ALL_AGENTS',
        reason: 'Manual intervention triggered by operator.',
      },
    });
  } catch (error) {
    console.error('Failed to send intervention signal:', error);
    alert('Error: Could not send intervention signal.');
  }
};
