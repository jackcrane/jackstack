import { prisma } from "#prisma";
import { LogType } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { sendEmail } from "#postmark";
import Handlebars from "handlebars";
import { readFileSync } from "fs";
import { getGeolocation } from "../../util/geolocation.js";

const welcomeEmail = readFileSync("./react-email/complete/login.hbs", "utf8");
const template = Handlebars.compile(welcomeEmail);

dotenv.config();

export const post = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      emailPreferences: true,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  await prisma.logs.create({
    data: {
      type: LogType.USER_LOGIN,
      userId: user.id,
      ip: req.ip,
    },
  });

  if (user.emailPreferences?.login) {
    const { city, regionName } = await getGeolocation(req.ip);
    const ip = req.ip;

    await sendEmail({
      From: "Snowcap Support <snowcap@jackcrane.rocks>",
      To: email,
      Subject: "New login to Snowcap",
      HtmlBody: template({ name: user.name, city, regionName, ip }),
      userId: user.id,
    });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  return res.status(200).json({ token });
};
