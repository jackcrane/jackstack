import { sendEmail } from "#postmark";
import Handlebars from "handlebars";
import { readFileSync, writeFileSync } from "fs";

const welcomeEmail = readFileSync("../react-email/out/welcome.hbs", "utf8");
const template = Handlebars.compile(welcomeEmail);

const email = {
  From: "Snowcap Support <snowcap@jackcrane.rocks>",
  To: "jack@jackcrane.rocks",
  Subject: "Welcome to Snowcap",
  HtmlBody: template({ name: "Jack Crane" }),
};

const res = await sendEmail(email);
console.log(res);
