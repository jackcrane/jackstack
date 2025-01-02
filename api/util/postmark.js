import postmark from "postmark";
import dotenv from "dotenv";
dotenv.config();
import { prisma } from "#prisma";

let rawEmailClient = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

const sendEmail = async (options) => {
  const res = await rawEmailClient.sendEmail(options);

  const emailRecord = await prisma.email.create({
    data: {
      messageId: res.MessageID,
      from: options.From,
      to: options.To,
      subject: options.Subject,
      userId: options.userId,
    },
  });

  await prisma.logs.create({
    data: {
      type: "EMAIL_SENT",
      userId: options.userId,
      emailId: emailRecord.id,
    },
  });

  return { postmarkResponse: res, emailRecord };
};

export { rawEmailClient, sendEmail };
