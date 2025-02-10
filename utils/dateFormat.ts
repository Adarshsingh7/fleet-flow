function convertStringToTime(dateString: string): string {
  // Create a new Date object from the input string
  const date = new Date(dateString);

  // Get the hours and minutes from the Date object
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM or PM suffix based on the hour
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12;

  // If the hour is '0', set it to '12'
  hours = hours ? hours : 12;

  // Ensure minutes are always two digits
  const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();

  // Return the formatted time string
  return `${hours}:${minutesStr} ${ampm}`;
}

export default convertStringToTime;
