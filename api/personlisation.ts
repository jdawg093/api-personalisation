import { z } from "zod";
import {
  OneBlinkAPIHostingResponse,
  OneBlinkAPIHostingRequest,
} from "@oneblink/cli";
import { FORMS_ACCESS_KEY, FORMS_SECRET_KEY, FORM_ID } from "./config";
import { Forms, FormsApps } from "@oneblink/sdk/tenants/oneblink";
import Boom from "@hapi/boom";
import { userService } from "@oneblink/sdk-core";

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
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== "string") {
    throw Boom.badRequest("User must be logged in.");
  }

  // Get the user, must be logged in to ensure that this will work
  const token = authHeader.split(" ")[1];
  const jwtPayload = await FormsApps.verifyJWT(token);
  const userProfile = userService.parseUserProfile(jwtPayload);
  if (!userProfile) {
    throw Boom.badRequest("Invalid User profile.");
  }
  const { username } = userProfile;

  // Getting the date time for the range.
  const now = new Date();
  const startDateTimestamp = now.setDate(now.getDate() - 366);
  const submissionDateFrom = new Date(startDateTimestamp).toISOString();
  const { formSubmissionMeta } = await FormService.searchSubmissions({
    formId: parseInt(FORM_ID as string),
    submissionDateFrom,
  });
  const lastFormSubmissionMeta = formSubmissionMeta.filter(
    (submission) => submission.user?.username === username
  );
  if (!lastFormSubmissionMeta) {
    return;
  }

  //grab the submission ID, by getting the length of the array then subtracting 1 for latest submission
  const submissionId =
    lastFormSubmissionMeta[lastFormSubmissionMeta.length - 1].submissionId;
  console.log("Here is the submission id:", submissionId);

  //Grab the submission data here
  const formSubmissionData = await FormService.getSubmissionData(
    parseInt(FORM_ID as string),
    submissionId as string,
    false
  );
  console.log("here is the formSubmissiomData", formSubmissionData);

  //Validate the submission so we can be sure we have the right data
  const {
    submission: { User_Email, Contact_Number, Photos_Of_Books },
  } = validateSubmission(formSubmissionData);
  console.log(Photos_Of_Books);
  //Return the submission with the values that are required
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
