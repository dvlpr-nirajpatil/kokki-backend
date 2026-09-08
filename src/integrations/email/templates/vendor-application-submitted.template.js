const env = require("../../../config/env");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

function vendorApplicationSubmittedTemplate({
  email,
  vendorName,
  businessName,
  applicationNumber,
  vendorType,
  submittedAt,
  statusUrl,
  supportEmail,
  currentYear = new Date().getFullYear(),
}) {
  const displayVendorName = vendorName || "Partner";
  const subject = "We received your Kokki partner application";
  const logoUrl = escapeHtml(env.assets.logo);

  const text = `
Hi ${displayVendorName},

We have received the partner application for ${businessName}.

Reference ID: ${applicationNumber}
Partner type: ${vendorType}
Submitted on: ${submittedAt}

Our onboarding team will review the submitted business details, location, images, and documents. We may contact you or schedule a business visit during verification.

View your application status: ${statusUrl}

If you have questions, contact ${supportEmail}.

Regards,
Kokki
`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta
      name="format-detection"
      content="telephone=no,address=no,email=no,date=no,url=no"
    />
    <title>Your Kokki partner application has been received</title>
    <!--
      Suggested subject: We received your Kokki partner application
      Placeholders: vendorName, businessName, applicationNumber, vendorType,
      submittedAt, statusUrl, supportEmail, currentYear
    -->
    <style>
      @media only screen and (max-width: 620px) {
        .email-shell {
          width: 100% !important;
        }

        .email-padding {
          padding-right: 24px !important;
          padding-left: 24px !important;
        }

        .detail-label,
        .detail-value {
          display: block !important;
          width: 100% !important;
          text-align: left !important;
        }

        .detail-value {
          padding-top: 5px !important;
        }

        .mobile-button {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f1f2ec;
      color: #151714;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div
      style="
        display: none;
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        color: transparent;
      "
    >
      Your Kokki partner application is safely received and ready for review.
    </div>

    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="width: 100%; background-color: #f1f2ec"
    >
      <tr>
        <td align="center" style="padding: 32px 14px">
          <table
            role="presentation"
            class="email-shell"
            width="600"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width: 600px;
              max-width: 600px;
              background-color: #ffffff;
              border: 1px solid #dcdfd4;
              border-radius: 22px;
              overflow: hidden;
            "
          >
            <tr>
              <td
                class="email-padding"
                style="padding: 26px 40px; background-color: #151714"
              >
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td valign="middle">
                      <table
                        role="presentation"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                          <td valign="middle">
                            <img
                              src="${logoUrl}"
                              width="112"
                              alt="Kokki"
                              style="
                                display: block;
                                width: 112px;
                                max-width: 112px;
                                height: auto;
                                border: 0;
                              "
                            />
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      align="right"
                      valign="middle"
                      style="
                        color: #b9beb3;
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 0.8px;
                        text-transform: uppercase;
                      "
                    >
                      Partner Network
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="email-padding" style="padding: 44px 40px 20px">
                <div
                  style="
                    display: inline-block;
                    padding: 7px 12px;
                    border-radius: 999px;
                    background-color: #efffd0;
                    color: #496713;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.7px;
                    text-transform: uppercase;
                  "
                >
                  Application received
                </div>
                <h1
                  style="
                    margin: 20px 0 14px;
                    color: #151714;
                    font-size: 32px;
                    line-height: 1.16;
                    letter-spacing: -1.1px;
                  "
                >
                  Thanks for applying, ${escapeHtml(displayVendorName)}.
                </h1>
                <p
                  style="
                    margin: 0;
                    color: #62675f;
                    font-size: 16px;
                    line-height: 1.7;
                  "
                >
                  We have received the partner application for
                  <strong style="color: #151714">${escapeHtml(businessName)}</strong>. Our
                  onboarding team will review the submitted business details,
                  location, images, and documents.
                </p>
              </td>
            </tr>

            <tr>
              <td class="email-padding" style="padding: 16px 40px 24px">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width: 100%;
                    border: 1px solid #dcdfd4;
                    border-radius: 16px;
                    background-color: #f8f9f5;
                  "
                >
                  <tr>
                    <td style="padding: 22px 22px 10px">
                      <p
                        style="
                          margin: 0;
                          color: #767c72;
                          font-size: 11px;
                          font-weight: 700;
                          letter-spacing: 0.7px;
                          text-transform: uppercase;
                        "
                      >
                        Application summary
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 22px 22px">
                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                          <td
                            class="detail-label"
                            style="
                              padding: 12px 0;
                              border-bottom: 1px solid #dcdfd4;
                              color: #767c72;
                              font-size: 13px;
                            "
                          >
                            Reference ID
                          </td>
                          <td
                            class="detail-value"
                            align="right"
                            style="
                              padding: 12px 0;
                              border-bottom: 1px solid #dcdfd4;
                              color: #151714;
                              font-size: 13px;
                              font-weight: 700;
                            "
                          >
                            ${escapeHtml(applicationNumber)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="detail-label"
                            style="
                              padding: 12px 0;
                              border-bottom: 1px solid #dcdfd4;
                              color: #767c72;
                              font-size: 13px;
                            "
                          >
                            Partner type
                          </td>
                          <td
                            class="detail-value"
                            align="right"
                            style="
                              padding: 12px 0;
                              border-bottom: 1px solid #dcdfd4;
                              color: #151714;
                              font-size: 13px;
                              font-weight: 700;
                            "
                          >
                            ${escapeHtml(vendorType)}
                          </td>
                        </tr>
                        <tr>
                          <td
                            class="detail-label"
                            style="
                              padding: 12px 0 0;
                              color: #767c72;
                              font-size: 13px;
                            "
                          >
                            Submitted on
                          </td>
                          <td
                            class="detail-value"
                            align="right"
                            style="
                              padding: 12px 0 0;
                              color: #151714;
                              font-size: 13px;
                              font-weight: 700;
                            "
                          >
                            ${escapeHtml(submittedAt)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="email-padding" style="padding: 4px 40px 28px">
                <h2
                  style="
                    margin: 0 0 16px;
                    color: #151714;
                    font-size: 19px;
                    line-height: 1.35;
                  "
                >
                  What happens next?
                </h2>
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td width="34" valign="top" style="padding-bottom: 16px">
                      <div
                        style="
                          width: 26px;
                          height: 26px;
                          border-radius: 50%;
                          background-color: #c8ff4d;
                          color: #151714;
                          font-size: 12px;
                          font-weight: 800;
                          line-height: 26px;
                          text-align: center;
                        "
                      >
                        1
                      </div>
                    </td>
                    <td
                      valign="top"
                      style="
                        padding: 2px 0 16px;
                        color: #62675f;
                        font-size: 14px;
                        line-height: 1.55;
                      "
                    >
                      <strong style="display: block; color: #151714"
                        >Application review</strong
                      >
                      We check your business information and uploaded files.
                    </td>
                  </tr>
                  <tr>
                    <td width="34" valign="top" style="padding-bottom: 16px">
                      <div
                        style="
                          width: 26px;
                          height: 26px;
                          border-radius: 50%;
                          background-color: #e8eadf;
                          color: #151714;
                          font-size: 12px;
                          font-weight: 800;
                          line-height: 26px;
                          text-align: center;
                        "
                      >
                        2
                      </div>
                    </td>
                    <td
                      valign="top"
                      style="
                        padding: 2px 0 16px;
                        color: #62675f;
                        font-size: 14px;
                        line-height: 1.55;
                      "
                    >
                      <strong style="display: block; color: #151714"
                        >Verification</strong
                      >
                      Our team may contact you or schedule a business visit.
                    </td>
                  </tr>
                  <tr>
                    <td width="34" valign="top">
                      <div
                        style="
                          width: 26px;
                          height: 26px;
                          border-radius: 50%;
                          background-color: #e8eadf;
                          color: #151714;
                          font-size: 12px;
                          font-weight: 800;
                          line-height: 26px;
                          text-align: center;
                        "
                      >
                        3
                      </div>
                    </td>
                    <td
                      valign="top"
                      style="
                        padding-top: 2px;
                        color: #62675f;
                        font-size: 14px;
                        line-height: 1.55;
                      "
                    >
                      <strong style="display: block; color: #151714"
                        >Approval and activation</strong
                      >
                      Approved businesses receive their Kokki partner access.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="email-padding" style="padding: 0 40px 40px">
                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      style="border-radius: 999px; background-color: #151714"
                    >
                      <a
                        class="mobile-button"
                        href="${escapeHtml(statusUrl)}"
                        target="_blank"
                        style="
                          display: inline-block;
                          padding: 15px 24px;
                          border-radius: 999px;
                          color: #ffffff;
                          font-size: 14px;
                          font-weight: 700;
                          text-decoration: none;
                        "
                      >
                        View application status&nbsp;&nbsp;&rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                <p
                  style="
                    margin: 22px 0 0;
                    color: #767c72;
                    font-size: 13px;
                    line-height: 1.65;
                  "
                >
                  Please keep your reference ID safe. If you have questions,
                  reply to this email or contact
                  <a
                    href="mailto:${escapeHtml(supportEmail)}"
                    style="
                      color: #496713;
                      font-weight: 700;
                      text-decoration: none;
                    "
                    >${escapeHtml(supportEmail)}</a
                  >.
                </p>
              </td>
            </tr>

            <tr>
              <td
                class="email-padding"
                style="
                  padding: 24px 40px;
                  border-top: 1px solid #dcdfd4;
                  background-color: #f8f9f5;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #767c72;
                    font-size: 11px;
                    line-height: 1.65;
                  "
                >
                  This email was sent because a Kokki partner application was
                  submitted using this email address.
                </p>
                <p
                  style="
                    margin: 8px 0 0;
                    color: #9a9f96;
                    font-size: 11px;
                    line-height: 1.65;
                  "
                >
                  &copy; ${escapeHtml(currentYear)} Kokki. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject,
    text,
    html,
    to: email,
  };
}

module.exports = {
  vendorApplicationSubmittedTemplate,
};
