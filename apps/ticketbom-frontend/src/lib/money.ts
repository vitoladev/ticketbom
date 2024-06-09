export const formatMoney = (amount: number) => {
  const formattedAmount = amount / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(formattedAmount);
};
