
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const dayOfWeek = d.getDay(); // 0 (Sun) to 6 (Sat)
  
  // Days to subtract to get to the previous Saturday
  const daysToSubtract = (dayOfWeek + 1) % 7;
  
  const startDate = new Date(d);
  startDate.setDate(d.getDate() - daysToSubtract);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return { start: startDate, end: endDate };
};
