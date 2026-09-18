const z = require("zod");

const getEstimateRequestDetails = z.object({
  params: z.object({
    id: z.uuid("A valid estimate request ID is required"),
  }),
});

module.exports = {
  getEstimateRequestDetails,
};
