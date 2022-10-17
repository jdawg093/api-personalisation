module.exports.get = function () {
  const supervisor = "supervisor";
  const position = "position";
  const optionSet = [
    {
      value: "ASmith",
      label: "Alex Smith",
      attributes: [
        {
          label: supervisor,
          value: "Lisa Daniels",
        },
        {
          label: position,
          value: "Marketing",
        },
      ],
    },
    {
      value: "JCauthen",
      label: "Mary Johnson",
      attributes: [
        {
          label: supervisor,
          value: "Lisa Daniels",
        },
        {
          label: position,
          value: "Operations",
        },
      ],
    },
    {
      value: "AWilliams",
      label: "Alice Williams",
      attributes: [
        {
          label: supervisor,
          value: "Liam Jackson",
        },
        {
          label: position,
          value: "Sales",
        },
      ],
    },
    {
      value: "JDavis",
      label: "Jacob Davis",
      attributes: [
        {
          label: supervisor,
          value: "Liam Jackson",
        },
        {
          label: position,
          value: "Marketing",
        },
      ],
    },
  ];
  return optionSet;
};
