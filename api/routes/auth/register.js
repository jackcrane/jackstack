import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "#prisma";
import { LogType } from "@prisma/client";
import { sendEmail } from "#postmark";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import { forceTestError } from "#forceError";

const welcomeEmail = readFileSync("./react-email/complete/welcome.hbs", "utf8");
const template = Handlebars.compile(welcomeEmail);

export const post = async (req, res) => {
  try {
    forceTestError(req);
    const { email, password, name } = req.body;

    // validate email and password
    const schema = z.object({
      email: z.string().email(),
      name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
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
        emailPreferences: {
          create: {},
        },
      },
    });

    const emailVerificaton = await prisma.emailVerification.create({
      data: {
        userId: user.id,
      },
    });

    await sendEmail({
      From: "Snowcap Support <snowcap@jackcrane.rocks>",
      To: email,
      Subject: "Welcome to Snowcap",
      HtmlBody: template({ name: user.name, token: emailVerificaton.id }),
      userId: user.id,
    });

    await prisma.logs.create({
      data: {
        type: LogType.USER_CREATED,
        userId: user.id,
        ip: req.ip,
      },
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
