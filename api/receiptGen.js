"use strict";

const { customAlphabet } = require("nanoid");

// This function can be used to generate unique(ish) string
// the likely hood of the string being a duplicate can be
// dramatically reduced by incrementing the number of characters
// This function also adds to current year to start of the string
// just to show a example of a prefix.
// The resulting string will look something like these examples:
//
// 2022-2BHZVKVH
// 2022-4RZGFFMV
// 2022-HBYBZBHF
// 2022-H9TVC7PN

const length = 8;
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, length);

module.exports = function () {
  const currentYear = new Date().getFullYear();
  const receiptNumber = nanoid();
  return {
    externalId: `${currentYear}-${receiptNumber}`,
  };
};
