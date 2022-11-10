"use strict";

const Oneblink = require("@oneblink/sdk");

const houses = [
  {
    houseNumber: "1",
    permitType: "water",
  },
  {
    houseNumber: "1",
    permitType: "gas",
  },
  {
    houseNumber: "2",
    permitType: "internet",
  },
  { houseNumber: "2", permitType: "gas" },
  { houseNumber: "3", permitType: "energy" },
  { houseNumber: "1", permitType: "energy" },
];

module.exports.post = function (req, res) {
  console.log(req);
  if (!req.body || !req.body.submission || !req.body.submission.houseNumber) {
    console.log("oh no! An error is going to be thrown!");
    return res.setStatusCode(400).setPayload({
      message:
        "Oh no! You forgot to set a house number or there is no submission or body! This means it is a failed lookup!",
    });
  }

  const houseNumber = req.body.submission.houseNumber;
  //Filter array to get the list of ones that match the houseNumber, as there might be more than one
  const filteredHouses = houses.filter(
    (house) => house.houseNumber === houseNumber
  );
  console.log(filteredHouses);
  if (!filteredHouses) {
    return res.setStatusCode(400).setPayload({
      message: "Could not find house required.",
    });
  }
  const permitTypes = [];
  filteredHouses.forEach((house) => {
    if (!permitTypes.includes(house.permitType)) {
      permitTypes.push(house.permitType);
    }
  });

  console.log(permitTypes);

  //generate the formElements here then we can test c:
  const elements = [];
  elements.push(
    Oneblink.Forms.generateFormElement({
      name: "permitTypes",
      label: "Please select your permit type",
      type: "select",
      required: "false",
      options: permitTypes.map((permitType) => {
        return { value: permitType, label: permitType };
      }),
      conditionallyShow: true,
      conditionallyShowPredicates: [
        {
          elementId: "123-123-123-123", //Your element ID here
          hasValue: true,
          type: "VALUE",
        },
      ],
      isDataLookup: true,
      dataLookupId: 123, // Your lookup Id here
    })
  );

  return res.setStatusCode(200).setPayload(elements);
};
