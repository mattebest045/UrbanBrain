/**
 * Capitalizza ogni parola della stringa: "mario rossi" → "Mario Rossi"
 * @param {string} str - La stringa da formattare
 * @returns {string} - La stringa formattata
 */
const capitalizeWords = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

module.exports = {
    capitalizeWords
};
