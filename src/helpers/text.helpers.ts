export const formatToMoney = (num: number) =>
  "$" +
  num.toLocaleString("es-CO", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
