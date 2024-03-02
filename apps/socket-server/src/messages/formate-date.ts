export const formatDate = (inputDate: string) => {
  const currentDate = new Date();
  const inputDateTime = new Date(inputDate);

  const timeDifference = currentDate.getTime() - inputDateTime.getTime();
  const oneMinute = 60 * 1000;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;
  const oneWeek = 7 * oneDay;

  if (timeDifference < oneMinute) {
    // Less than a minute
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} seconds ago`;
  } else if (timeDifference < oneHour) {
    // Less than an hour
    const minutes = Math.floor(timeDifference / oneMinute);
    return `${minutes} minutes ago`;
  } else if (timeDifference < oneDay) {
    // Less than a day
    const hours = Math.floor(timeDifference / oneHour);
    return `${hours} hours ago`;
  } else if (timeDifference < oneWeek) {
    // Less than a week
    const dayOfWeek = inputDateTime.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedTime = inputDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dayOfWeek} ${formattedTime}`;
  } else {
    // More than a week
    const formattedDate = inputDateTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const formattedTime = inputDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
  }
}
