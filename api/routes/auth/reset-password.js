import { sendEmail } from "#postmark";
import { prisma } from "#prisma";
import { LogType } from "@prisma/client";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import { z } from "zod";
import bcrypt from "bcrypt";
import { forceTestError } from "#forceError";

const template = Handlebars.compile(
  readFileSync("../react-email/complete/forgot-password.hbs", "utf8")
);

export const get = async (req, res) => {
  try {
    forceTestError(req);
    const { email } = req.query;

    const schema = z.object({
      email: z
        .string({ required_error: "Email is a required field" })
        .email("Invalid email format"),
    });

    const result = schema.safeParse({ email });

    if (!result.success) {
      return res.status(400).json({ message: result.error.issues });
    }

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

    await sendEmail({
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
      },
    });

    return res.status(200).json({ message: "Password reset request sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const post = async (req, res) => {
  try {
    forceTestError(req);
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
      password: z
        .string({
          required_error: "Password is a required field",
        })
        .min(8, { message: "Password must be at least 8 characters" }),
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
