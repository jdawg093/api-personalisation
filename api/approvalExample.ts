import { z } from "zod";
import {
  OneBlinkAPIHostingResponse,
  OneBlinkAPIHostingRequest,
} from "@oneblink/cli";
import { FORMS_ACCESS_KEY, FORMS_SECRET_KEY, FORM_ID } from "./config";
import { Approvals, Forms } from "@oneblink/sdk/tenants/oneblink";

interface PersonalisationPayload {
  formsAppId: number;
  formId: number;
  externalIdUrlSearchParam: string | null;
  draftId: string | null;
  preFillFormDataId: string | null;
  jobId: string | null;
  previousFormSubmissionApprovalId: string | null;
}

const FormService = new Forms({
  accessKey: FORMS_ACCESS_KEY,
  secretKey: FORMS_SECRET_KEY,
});

const approvalsService = new Approvals({
  accessKey: FORMS_ACCESS_KEY,
  secretKey: FORMS_SECRET_KEY,
});
//Example of an attachmentschema, if there were to be included attachments.
// const attachmentSchema = z.object({
//   s3: z.object({
//     bucket: z.string(),
//     key: z.string(),
//     region: z.string(),
//   }),
//   url: z.string(),
//   contentType: z.string(),
//   fileName: z.string(),
//   id: z.string(),
//   isPrivate: z.boolean(),
// });

const submissionSchema = z.object({
  email: z.string(),
  number: z.string(),
});

const schema = z.object({
  submission: submissionSchema,
});

export async function post(
  req: OneBlinkAPIHostingRequest<PersonalisationPayload>,
  res: OneBlinkAPIHostingResponse<{ submission: Record<string, unknown> }>
) {
  console.log(FORM_ID);
  // const submissionIds = await FormService.searchSubmissions({
  //   formId: parseInt(FORM_ID as string),
  // });
  console.log(JSON.stringify(req.body));
  // console.log(submissionIds);

  if (req.body.previousFormSubmissionApprovalId) {
    const approval = await approvalsService.getFormSubmissionApproval(
      req.body.previousFormSubmissionApprovalId
    );
    //kinda pointless step since we should already have the previous id...
    // const formSubmissionMeta = submissionIds.formSubmissionMeta.find(
    //   (formSubmissionMeta) =>
    //     formSubmissionMeta.submissionId ===
    //     req.body.previousFormSubmissionApprovalId
    // );
    //"123";
    console.log(
      "Here is the submission meta:",
      JSON.stringify(approval, null, 2)
    );

    // const formSubmissionMeta = approval.history.find((formSubmissionHistoryData) => formSubmissionHistoryData.formSubmissionApprovals.find((formSubmissionData) => formSubmissionData.approvalFormId === FORM_ID)))
    // )
    const formSubmissionData = await FormService.getSubmissionData(
      parseInt(FORM_ID as string),
      approval.formSubmissionMeta.submissionId,
      false
    );
    console.log("here is the formSubmissiomData", formSubmissionData);
    const {
      submission: { email, number },
    } = validateSubmission(formSubmissionData);
    console.log(email, number);
    return {
      submission: {
        email2: email,
        number2: number,
      },
    };
  }
}

function validateSubmission(data: unknown) {
  const result = validate({ schema, data, subject: "Form Submission" });
  return result;
}

function validate<T extends z.ZodSchema<R>, R>({
  data,
  schema,
  subject,
}: {
  data: unknown;
  schema: T;
  subject: string;
}): z.infer<T> {
  console.log(`Validating ${subject}`);
  try {
    return schema.parse(data);
  } catch (err) {
    console.warn(`Failed to validate ${subject}`, err as z.ZodError);
    throw new Error("help");
  }
}
