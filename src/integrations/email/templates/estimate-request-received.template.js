function estimateRequestReceivedTemplate({
    customerName,
    requestNo,
    vehicleNo,
}) {
    const subject = `Estimate request received - ${requestNo}`;

    const text = `
Hi ${customerName || "Customer"},

We have received your vehicle repair estimate request.

Request ID: ${requestNo}
Vehicle: ${vehicleNo}

Our team will review your damage photos and documents and get back to you shortly.

Regards,
Kokki
`;

    const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
            <h2>We received your estimate request</h2>

            <p>Hi ${customerName || "Customer"},</p>

            <p>
                Your vehicle repair estimate request has been successfully submitted.
            </p>

            <p>
                <strong>Request ID:</strong> ${requestNo}<br>
                <strong>Vehicle:</strong> ${vehicleNo}
            </p>

            <p>
                Our team will review the submitted damage photos and documents
                and get back to you shortly.
            </p>

            <p>
                Regards,<br>
                <strong>Kokki</strong>
            </p>
        </div>
    `;

    return {
        subject,
        text,
        html,
    };
}

module.exports = {
    estimateRequestReceivedTemplate,
};