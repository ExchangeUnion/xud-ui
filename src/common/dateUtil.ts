export const formatDateTimeForFilename = (date: Date): string => {
  const dateParts = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  const timeParts = [date.getHours(), date.getMinutes(), date.getSeconds()];
  return `${dateParts.join("-")}_${timeParts.join("-")}`;
};
