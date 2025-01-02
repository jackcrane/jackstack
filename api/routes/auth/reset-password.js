import { sendEmail } from "#postmark";
import { prisma } from "#prisma";
import { LogType } from "@prisma/client";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import { z } from "zod";
import bcrypt from "bcrypt";

const template = Handlebars.compile(
  readFileSync("./react-email/complete/forgot-password.hbs", "utf8")
);

export const get = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const passwordResetToken = await prisma.forgotPasswordToken.create({
    data: {
      userId: user.id,
    },
  });

  const { emailRecord } = await sendEmail({
    From: "Snowcap Support <snowcap@jackcrane.rocks>",
    To: email,
    Subject: "Password Reset",
    HtmlBody: template({ name: user.name, token: passwordResetToken.id }),
    userId: user.id,
  });

  await prisma.logs.create({
    data: {
      type: LogType.USER_PASSWORD_RESET_REQUEST,
      userId: user.id,
      ip: req.ip,
      emailId: emailRecord.id,
    },
  });

  return res.status(200).json({ message: "Password reset request sent" });
};

export const post = async (req, res) => {
  const { token, password } = req.body;

  const passwordResetToken = await prisma.forgotPasswordToken.findFirst({
    where: {
      id: token,
      active: true,
    },
  });

  if (!passwordResetToken) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const schema = z.object({
    password: z.string().min(8),
    token: z.string(),
  });

  const result = schema.safeParse({ password, token });

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues });
  }

  await prisma.forgotPasswordToken.update({
    where: {
      id: token,
    },
    data: {
      active: false,
    },
  });

  const hashedPassword = bcrypt.hashSync(password, 10);

  await prisma.user.update({
    where: {
      id: passwordResetToken.userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.logs.create({
    data: {
      type: LogType.USER_PASSWORD_RESET,
      userId: passwordResetToken.userId,
      ip: req.ip,
    },
  });

  return res.status(200).json({ message: "Password reset successfully" });
};
