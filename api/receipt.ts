import { z } from "zod";
import {
  OneBlinkAPIHostingResponse,
  OneBlinkAPIHostingRequest,
} from "@oneblink/cli";
import { FORMS_ACCESS_KEY, FORMS_SECRET_KEY, FORM_ID } from "./config";
import { Forms } from "@oneblink/sdk/tenants/oneblink";

const FormService = new Forms({
  accessKey: FORMS_ACCESS_KEY,
  secretKey: FORMS_SECRET_KEY,
});
const attachmentSchema = z.object({
  s3: z.object({
    bucket: z.string(),
    key: z.string(),
    region: z.string(),
  }),
  url: z.string(),
  contentType: z.string(),
  fileName: z.string(),
  id: z.string(),
  isPrivate: z.boolean(),
});

const submissionSchema = z.object({
  User_Email: z.string(),
  Contact_Number: z.string(),
  Photos_Of_Books: z.array(attachmentSchema),
});

const schema = z.object({
  submission: submissionSchema,
});

export async function post(
  req: OneBlinkAPIHostingRequest<{ body: unknown }>,
  res: OneBlinkAPIHostingResponse<{ submission: Record<string, unknown> }>
) {
  const submissionId = "123";
  console.log("Here is the submission id:", submissionId);
  const formSubmissionData = await FormService.getSubmissionData(
    parseInt(FORM_ID as string),
    submissionId as string,
    false
  );
  console.log("here is the formSubmissiomData", formSubmissionData);
  const {
    submission: { User_Email, Contact_Number, Photos_Of_Books },
  } = validateSubmission(formSubmissionData);
  console.log(Photos_Of_Books);
  return {
    submission: {
      Email: User_Email,
      Number: Contact_Number,
      Picture: Photos_Of_Books[0].url,
    },
  };
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
