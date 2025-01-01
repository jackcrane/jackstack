import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "#prisma";
import { LogType } from "@prisma/client";
import { sendEmail } from "#postmark";
import Handlebars from "handlebars";
import { readFileSync } from "fs";

const welcomeEmail = readFileSync("./react-email/out/welcome.hbs", "utf8");
const template = Handlebars.compile(welcomeEmail);

export const post = async (req, res) => {
  const { email, password, name } = req.body;

  // validate email and password
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(8),
  });

  const result = schema.safeParse({ email, password, name });

  if (!result.success) {
    return res.status(400).json({ message: result.error.issues });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  await prisma.logs.create({
    data: {
      type: LogType.USER_CREATED,
      userId: user.id,
    },
  });

  const emailVerificaton = await prisma.emailVerification.create({
    data: {
      userId: user.id,
    },
  });

  const { emailRecord } = await sendEmail({
    From: "Snowcap Support <snowcap@jackcrane.rocks>",
    To: email,
    Subject: "Welcome to Snowcap",
    HtmlBody: template({ name: user.name, token: emailVerificaton.id }),
    userId: user.id,
  });

  if (!emailRecord) {
    return res.status(500).json({ message: "Failed to send email" });
  }

  return res.status(201).json({ message: "User created successfully" });
};
