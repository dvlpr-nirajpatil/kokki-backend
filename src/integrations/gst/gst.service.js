const axios = require("axios");
const env = require("@config/env");
const AppError = require("@utils/app_error");
const { logger } = require("@core/index");
const { error } = require("@core/response");

async function verifyGST(gstin) {

    try {


        const response = await axios.get(

            `https://apisetu.gov.in/gstn/v2/taxpayers/${gstin}`,

            {

                headers: {

                    "X-APISETU-CLIENTID": env.apiSetu.clientId,

                    "X-APISETU-APIKEY": env.apiSetu.gst_api_key,

                    "Content-Type": "application/json",

                },
                timeout: 15000,

            }

        );

        if (response.data.gstIdentificationNumber != gstin) {
            throw new AppError("Invalid GST No", 404)
        }

        return response.data;

    } catch (error) {


        if (error === AppError) {
            throw error;
        }

        throw new AppError("Invalid GST No", 404)
    }



}

module.exports = {
    verifyGST

}