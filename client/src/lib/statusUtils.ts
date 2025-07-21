export const getStatusLabel = (status: number): string => {
  const statusLabels: Record<number, string> = {
    0: 'Inactive',
    1: 'Active',
    2: 'Warning',
    3: 'Banned',
  };
  return statusLabels[status] || 'Unknown';
};
