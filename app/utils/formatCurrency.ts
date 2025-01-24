interface IAppProps {
  amount: number,
  currency: "USD" | "EUR" | "PHP"
}

export const formatCurrency = ({ amount, currency }: IAppProps) => {
  const formatted = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
  }).format(amount);

  if (currency === "PHP") {
    return formatted.replace("₱", "PHP ");
  }

  return formatted;
};
