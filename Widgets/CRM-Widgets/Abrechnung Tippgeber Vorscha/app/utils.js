// Format Date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

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

// get data from Storno effektiv
const getStornoEffektiv = (Storno_effektiv) => {
  const month = [
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
  ][new Date().getMonth()];
  const year = new Date().getFullYear().toString();
  const list = Storno_effektiv || [];

  const match = list.find((e) => e.Monat === month && e.Jahr === year);
  let StornoEffektiv = match ? parseFloat(match.Sornowert || 0) : 0.0;
  return StornoEffektiv;
};

// Calculate Percentage
const CalculatePercentage = (baseAmount, percentageRate) => {
  const amount = parseFloat(baseAmount);
  const rate = parseFloat(percentageRate);

  if (isNaN(amount) || isNaN(rate)) return 0.0;

  return parseFloat((amount * rate) / 100);
};

export {
  formatDate,
  getFullDateTime,
  getMothYear,
  getStornoEffektiv,
  CalculatePercentage,
};
