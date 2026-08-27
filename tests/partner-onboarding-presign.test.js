jest.mock("../src/integrations/s3/s3.service", () => ({
  createPresignedUploadUrl: jest.fn(),
}));

const s3Service = require("../src/integrations/s3/s3.service");
const onboardingService = require("../src/modules/partner/onboarding/onboarding.service");

const APPLICATION_ID = "7e88b5b1-a9db-406b-bdc0-536faecde82e";

describe("partner onboarding presigned uploads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    s3Service.createPresignedUploadUrl.mockResolvedValue(
      "https://s3.example.test/presigned-upload",
    );
  });

  test("creates a five-minute location-image upload URL", async () => {
    const result = await onboardingService.createLocationImagePresign(
      APPLICATION_ID,
      "image/jpeg",
    );

    expect(s3Service.createPresignedUploadUrl).toHaveBeenCalledWith({
      key: expect.stringMatching(
        new RegExp(
          `^vendor-application/${APPLICATION_ID}/location/[0-9a-f-]+\\.jpg$`,
          "i",
        ),
      ),
      contentType: "image/jpeg",
      expiresIn: 300,
    });
    expect(result).toEqual({
      uploadUrl: "https://s3.example.test/presigned-upload",
      objectKey: expect.stringMatching(
        new RegExp(
          `^vendor-application/${APPLICATION_ID}/location/[0-9a-f-]+\\.jpg$`,
          "i",
        ),
      ),
    });
  });
});
