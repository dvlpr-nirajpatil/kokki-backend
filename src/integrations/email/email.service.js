const { SendEmailCommand } = require("@aws-sdk/client-ses");
const env = require("../../config/env");
const repository = require("./email.repository");

const sesClient = require("./ses.client");
const { logger } = require("../../core");

async function sendEmail({ to, subject, html, text }) {
  const command = new SendEmailCommand({
    Source: env.emailFrom,

    Destination: {
      ToAddresses: [to],
    },

    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },

      Body: {
        Html: {
          Data: html,
          Charset: "UTF-8",
        },

        Text: {
          Data: text,
          Charset: "UTF-8",
        },
      },
    },
  });

  return sesClient.send(command);
}

async function sendEmailToAdmins({ subject, html, text }) {
  try {
    const adminEmails = await repository.getAdminEmails();

    if (adminEmails.length === 0) {
      logger.warn("No admin email recipients were found");
      return null;
    }

    const command = new SendEmailCommand({
      Source: env.emailFrom,

      Destination: {
        ToAddresses: adminEmails,
      },

      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },

        Body: {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },

          Text: {
            Data: text,
            Charset: "UTF-8",
          },
        },
      },
    });

    return sesClient.send(command);
  } catch (e) {
    logger.error(e);
  }
}

module.exports = {
  sendEmail,
  sendEmailToAdmins,
};
