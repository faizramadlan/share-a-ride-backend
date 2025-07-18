const dateFormatter = (date) => {
  const datePart = date.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return datePart + " | " + timePart;
};

const priceFormatter = (price) => {
  return price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};

module.exports = { dateFormatter, priceFormatter };
