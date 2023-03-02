const { FORMS_ACCESS_KEY, FORMS_SECRET_KEY, FORM_ID } = require("./config");
const Oneblink = require("@oneblink/sdk");

const approvalsService = new Oneblink.Approvals({
  accessKey: FORMS_ACCESS_KEY,
  secretKey: FORMS_SECRET_KEY,
});

const formsService = new Oneblink.Forms({
  accessKey: FORMS_ACCESS_KEY,
  secretKey: FORMS_SECRET_KEY,
});

module.exports.post = async function (req, res) {
  if (!req.body || !req.body.previousFormSubmissionApprovalId) {
    return { submission: { paymentRequired: true } };
  } else {
    const formSubmissionApproval =
      await approvalsService.getFormSubmissionApproval(
        req.body.previousFormSubmissionApprovalId
      );
    const { formSubmissionMeta } = formSubmissionApproval;
    console.log("formSubmissionApproval", formSubmissionApproval);
    console.log("submission meta", formSubmissionMeta);

    const formSubmissionData = await formsService.getSubmissionData(
      10865,
      formSubmissionMeta.submissionId,
      false
    );
    const { submission } = formSubmissionData;
    console.log(submission, formSubmissionData);
    return { submission: { ...submission, paymentRequired: false } };
  }
};
