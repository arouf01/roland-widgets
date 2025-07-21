// Current Date
const getFullDateTime = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
};

// Date For Top Right
const getMothYear = () => {
  const getCurrntMonth = new Date().getMonth();
  const getCurrntYear = new Date().getFullYear();
  const monthList = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  return monthList[getCurrntMonth] + " " + getCurrntYear;
};

// Calculate Percentage
const CalculatePercentage = (baseAmount, percentageRate) => {
  const amount = parseFloat(baseAmount);
  const rate = parseFloat(percentageRate);

  if (isNaN(amount) || isNaN(rate)) return 0.0;

  return parseFloat((amount * rate) / 100);
};

export { getFullDateTime, getMothYear, CalculatePercentage };
