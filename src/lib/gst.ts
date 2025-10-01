export function calculateGst(amount: number, rate = 0.18) {
  const tax = Math.round(amount * rate * 100) / 100;
  const totalWithTax = Math.round((amount + tax) * 100) / 100;
  return { subtotal: amount, tax, totalWithTax, rate };
}


