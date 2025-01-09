interface IAppProps{
  amount: number,
  currency: "USD" | "EUR" | "PHP"
}

export const formatCurrency = ({amount, currency}: IAppProps) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currency,
  }).format(amount);
};
