const {
    SendEmailCommand,
} = require("@aws-sdk/client-ses");
const env = require("../../config/env");

const sesClient = require("./ses.client");

async function sendEmail({
    to,
    subject,
    html,
    text,
}) {
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

module.exports = {
    sendEmail,
};