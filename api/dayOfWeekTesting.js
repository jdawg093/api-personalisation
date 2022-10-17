"use strict";

const moment = require("moment-timezone");

module.exports = function (req, res) {
  const lookupPayload = req.body.submission;
  console.log(lookupPayload);
  const dayOfWeek = moment(lookupPayload.only_one).year();
  console.log(dayOfWeek);
  if (dayOfWeek < 2000) {
    return res.setStatusCode(200).setPayload({ message: "Before 2000" });
  } else {
    return res.setStatusCode(200).setPayload({ message: "On or After 2000" });
  }
};
