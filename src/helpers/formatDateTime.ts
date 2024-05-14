export default function formatDateTime(timestamp: any) {
  const date = new Date(timestamp);

  // Get day, month, year, hours, and minutes
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Combine into the desired format
  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}`;

  return formattedDateTime;
}