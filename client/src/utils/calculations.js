export const calculateLineAmounts = (quantity, price, taxRate) => {
  const qty = Number(quantity) || 0;
  const prc = Number(price) || 0;
  const tax = Number(taxRate) || 0;

  const exclAmount = qty * prc;
  const taxAmount = exclAmount * tax / 100;
  const inclAmount = exclAmount + taxAmount;

  return {
    exclAmount: Number(exclAmount.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    inclAmount: Number(inclAmount.toFixed(2)),
  };
};

export const calculateTotals = (lines) => {
  const totals = lines.reduce(
    (acc, line) => {
      const { exclAmount, taxAmount, inclAmount } = calculateLineAmounts(
        line.quantity,
        line.price,
        line.taxRate
      );
      return {
        totalExcl: acc.totalExcl + exclAmount,
        totalTax: acc.totalTax + taxAmount,
        totalIncl: acc.totalIncl + inclAmount,
      };
    },
    { totalExcl: 0, totalTax: 0, totalIncl: 0 }
  );

  return {
    totalExcl: Number(totals.totalExcl.toFixed(2)),
    totalTax: Number(totals.totalTax.toFixed(2)),
    totalIncl: Number(totals.totalIncl.toFixed(2)),
  };
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(value || 0);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-AU');
};

export const createEmptyLine = () => ({
  itemId: 0,
  itemCode: '',
  description: '',
  note: '',
  quantity: 1,
  price: 0,
  taxRate: 10,
});

export const createEmptyOrder = () => ({
  clientId: 0,
  customerName: '',
  address1: '',
  address2: '',
  address3: '',
  suburb: '',
  state: '',
  postCode: '',
  invoiceNo: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  referenceNo: '',
  note: '',
  lines: [createEmptyLine(), createEmptyLine(), createEmptyLine()],
});
