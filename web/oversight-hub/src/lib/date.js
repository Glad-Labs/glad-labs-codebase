export const formatTimestamp = (timestamp) => {
  if (!timestamp) {return 'N/A';}
  return new Date(timestamp.seconds * 1000).toLocaleString();
};
