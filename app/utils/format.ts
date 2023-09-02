export const formatAddress = (address: string) =>
  `${address.toLowerCase().slice(0, 6)}...${address
    .toLowerCase()
    .slice(address.length - 4, address.length)}`;

export const capitalizeFirstLetter = (word: string) => {
  // Check if the input word is not empty
  if (word.length === 0) {
    return word; // Return the input as is if it's empty
  }

  // Capitalize the first letter and concatenate it with the rest of the word
  const firstLetter = word.charAt(0).toUpperCase();
  const restOfWord = word.slice(1);

  return firstLetter + restOfWord;
};
