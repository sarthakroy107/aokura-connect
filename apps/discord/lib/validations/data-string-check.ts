export const toISOString = (data: string | Date) => {
  const date = new Date(data);
  console.log({date});
  if(isNaN(date.getTime())) {
    return {
      succes: false,
      message: "Invalid date"
    }
  }

  return {
    success: true,
    date: date.toISOString()
  };
}