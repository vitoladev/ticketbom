export const convertFullAmountToCents = (price: number) =>
  Math.round(price * 100);

export const convertCentsToFullAmount = (price: number) => price / 100;
