"use strict";

const companies = [
  {
    permitType: "gas",
    permitCost: 5.5,
  },
  {
    permitType: "water",
    permitCost: 6.5,
  },
  {
    permitType: "internet",
    permitCost: 7.5,
  },
];

module.exports.post = function (req, res) {
  // If the request does not contain the essential data to process,
  // finish early with a custom error message for the user to see.
  if (!req.body || !req.body.submission || !req.body.submission.permitTypes) {
    // A user friendly error message can be shown to the user in One Blink Forms
    // by returning a 400 Status code and a JSON payload with a `message` property.
    // There is no character limit, however it is suggested to keep the message
    // short and clear.
    return res.setStatusCode(400).setPayload({
      message:
        "This is my custom friendly error message that will be shown to the user on a failed lookup",
    });
  }

  // access the submission data from the request body
  const permitType = req.body.submission.permitTypes;
  const details = companies.find(
    (company) => company.permitType === permitType
  );
  if (details) {
    // set the response code and set body as form pre-fill data using 'element name': 'value'
    return res.setStatusCode(200).setPayload({
      permitCost: details.permitCost,
    });
  }

  return res.setStatusCode(400).setPayload({
    message: "Could not find the company you were looking for.",
  });
};
