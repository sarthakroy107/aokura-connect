export function formatDate(inputDate: string) {
  const currentDate = new Date();
  const inputDateTime = new Date(inputDate);

  const timeDifference = currentDate.getTime() - inputDateTime.getTime();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  if (timeDifference < oneDay) {
    // Less than 24 hours
    const formattedTime = inputDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `Today at ${formattedTime}`;
  } else if (timeDifference < 2 * oneDay) {
    // Between 24 and 48 hours
    const yesterdayTime = inputDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `Yesterday at ${yesterdayTime}`;
  } else {
    // More than 48 hours
    const dayOfWeek = inputDateTime.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDateTime = inputDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dayOfWeek} at ${formattedDateTime}`;
  }
}
