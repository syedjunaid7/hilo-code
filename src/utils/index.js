export const generateRandomNumber = (
  minimum = 0,
  maximum = 1,
  onlyInteger = true
) => {
  const result = Math.random() * (maximum - minimum + 1);
  return (onlyInteger ? Math.floor(result) : result) + minimum
};

export const getCardBaseValue = (value) => {
  let result = value;
  switch (value) {
    case 'A':
      value = 1
      break;
    case 'J':
      value = 11
      break;
    case 'Q':
      value = 12
      break;
    case 'K':
      value = 13
      break;
    default:
      value = result
  }
  return value;
};