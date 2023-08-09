function formatDate(inputDate) {
  const dateObj = new Date(inputDate);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const year = dateObj.getFullYear();

  // Function to get the ordinal suffix for the day
  const getOrdinalSuffix = (num) => {
    const j = num % 10,
      k = num % 100;
    if (j === 1 && k !== 11) {
      return num + "st";
    }
    if (j === 2 && k !== 12) {
      return num + "nd";
    }
    if (j === 3 && k !== 13) {
      return num + "rd";
    }
    return num + "th";
  };

  const dayWithOrdinal = getOrdinalSuffix(day);

  // Format the date string in the desired format
  const formattedDate = `${dayWithOrdinal} ${month} ${year}`;

  return formattedDate;
}

module.exports = formatDate