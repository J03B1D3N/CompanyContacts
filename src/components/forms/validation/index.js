const phoneRegex = (value) => /^[0-9+]{1}[0-9]{7,16}$/.test(value);
const emailRegex = (value) =>
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
const textRegex = (value) =>
  /^[a-zA-ZĄąČčĘęĖėĮįŠšŲųŪūŽž]+(?:\s[a-zA-ZĄąČčĘęĖėĮįŠšŲųŪūŽž]+)*$/u.test(
    value
  );
const positionRegex = (value) =>
  /^[\p{L}\p{M}\p{S}\sĄąČčĘęĖėĮįŠšŲųŪūŽž.]+$/u.test(value);
const streetNumberRegex = (value) =>
  /^\d+[A-Za-z]?(-\d+[A-Za-z]?)?$/.test(value);
const streetRegex = (value) =>
  /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ.]+(?:\s[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ.]+)*$/u.test(
    value
  );
const cityRegex = (value) => /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ]+(\s\d)?$/.test(value);
const companyRegex = (value) => /^\w[\w.\-#&\s]*$/.test(value);

export {
  phoneRegex,
  emailRegex,
  textRegex,
  positionRegex,
  streetNumberRegex,
  streetRegex,
  cityRegex,
  companyRegex,
};
