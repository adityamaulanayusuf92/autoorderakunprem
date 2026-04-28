export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-900 text-yellow-200',
    paid: 'bg-blue-900 text-blue-200',
    delivered: 'bg-green-900 text-green-200',
    available: 'bg-green-900 text-green-200',
    out_of_stock: 'bg-red-900 text-red-200',
  };
  return colors[status] || 'bg-gray-900 text-gray-200';
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

export const generateTempMailLink = () => {
  // Placeholder for temp mail generation
  return 'https://temp-mail.org/';
};
