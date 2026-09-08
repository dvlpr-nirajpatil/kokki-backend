const AppError = require("../../utils/app_error");
const { response } = require("../../core");
const emailService = require("./email.service");
const {
    vendorApplicationSubmittedTemplate,
} = require("./templates/vendor-application-submitted.template");


module.exports.sendTestEmail = async (req, res) => {

    try {

        const email = vendorApplicationSubmittedTemplate({
            email: "dev.nirajpatil@gmail.com",
            vendorName: "Neeraj",
            businessName: "Neeraj Spare Parts",
            applicationNumber: "KVA-000001",
            vendorType: "Spare Parts Vendor",
            submittedAt: "7 September 2026, 11:30 AM",
            supportEmail: "support@kokki.com",
        });

        await emailService.sendEmail(email);

        return response.success(res, 200, "Email successfully sent!");

    } catch (e) {
        throw new AppError(e);
    }
}
