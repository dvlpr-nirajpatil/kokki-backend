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

function vendorApplicationAdminNotificationTemplate({
  vendorName,
  businessName,
  applicationNumber,
  vendorType,
  email,
  phone,
  city,
  state,
  submittedAt,
  currentYear = new Date().getFullYear(),
}) {
  const displayVendorName = vendorName || "Not provided";
  const displayBusinessName = businessName || "Not provided";
  const displayEmail = email || "Not provided";
  const displayPhone = phone || "Not provided";
  const location = [city, state].filter(Boolean).join(", ") || "Not provided";
  const subject = `New vendor application received - ${applicationNumber}`;
  const logoUrl = escapeHtml(env.assets.logo);

  const text = `
New vendor application received

A new vendor application is ready for review.

Reference ID: ${applicationNumber}
Business: ${displayBusinessName}
Applicant: ${displayVendorName}
Partner type: ${vendorType}
Email: ${displayEmail}
Phone: ${displayPhone}
Location: ${location}
Submitted on: ${submittedAt}

Please review the application, uploaded documents, and business information in the Kokki admin portal.

Kokki Partner Operations
`;

  const detailRow = (label, value, showBorder = true) => `
    <tr>
      <td
        class="detail-label"
        style="
          padding: 12px 0;
          ${showBorder ? "border-bottom: 1px solid #dcdfd4;" : ""}
          color: #767c72;
          font-size: 13px;
        "
      >
        ${escapeHtml(label)}
      </td>
      <td
        class="detail-value"
        align="right"
        style="
          padding: 12px 0;
          ${showBorder ? "border-bottom: 1px solid #dcdfd4;" : ""}
          color: #151714;
          font-size: 13px;
          font-weight: 700;
        "
      >
        ${escapeHtml(value)}
      </td>
    </tr>`;

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
    <title>New Kokki vendor application</title>
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
      A new Kokki vendor application is ready for review.
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
                              width="24"
                              height="24"
                              alt=""
                              style="display: block; width: 24px; height: 24px; border: 0"
                            />
                          </td>
                          <td
                            valign="middle"
                            style="
                              padding-left: 8px;
                              color: #ffffff;
                              font-size: 22px;
                              font-weight: 700;
                              letter-spacing: -0.5px;
                            "
                          >
                            kokki
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
                      Partner Operations
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
                  Review required
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
                  New vendor application received.
                </h1>
                <p
                  style="
                    margin: 0;
                    color: #62675f;
                    font-size: 16px;
                    line-height: 1.7;
                  "
                >
                  <strong style="color: #151714">${escapeHtml(displayBusinessName)}</strong>
                  submitted a ${escapeHtml(vendorType)} application. The application
                  is ready for the onboarding team to review.
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
                        ${detailRow("Reference ID", applicationNumber)}
                        ${detailRow("Business", displayBusinessName)}
                        ${detailRow("Applicant", displayVendorName)}
                        ${detailRow("Partner type", vendorType)}
                        ${detailRow("Email", displayEmail)}
                        ${detailRow("Phone", displayPhone)}
                        ${detailRow("Location", location)}
                        ${detailRow("Submitted on", submittedAt, false)}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="email-padding" style="padding: 4px 40px 40px">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width: 100%;
                    border-radius: 14px;
                    background-color: #151714;
                  "
                >
                  <tr>
                    <td style="padding: 20px 22px">
                      <p
                        style="
                          margin: 0 0 6px;
                          color: #ffffff;
                          font-size: 15px;
                          font-weight: 700;
                        "
                      >
                        Next action
                      </p>
                      <p
                        style="
                          margin: 0;
                          color: #b9beb3;
                          font-size: 13px;
                          line-height: 1.65;
                        "
                      >
                        Review the business information, uploaded images, and
                        documents in the Kokki admin portal. Contact the applicant
                        if any verification details are incomplete.
                      </p>
                    </td>
                  </tr>
                </table>
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
                  This operational notification was sent to Kokki administrators
                  because a vendor application was submitted.
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

  return { subject, text, html };
}

module.exports = {
  vendorApplicationAdminNotificationTemplate,
};
