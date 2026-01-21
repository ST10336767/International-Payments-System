//validates ID number  - > Hammy Code
function isValidLuhn(number) {
  if (typeof number !== "string" || !/^\d+$/.test(number)) return false;

  let sum = 0;
  let alternate = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let n = number.charCodeAt(i) - 48;
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return (sum % 10) === 0;
}

module.exports = { isValidLuhn };
