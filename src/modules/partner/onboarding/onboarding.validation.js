const z = require("zod");

const requiredString = (fieldName) =>
    z.string({
        error: (issue) =>
            issue.input === undefined
                ? `${fieldName} is required`
                : `${fieldName} must be a string`,
    });

const createApplication = z.object({
    body: z.object({

        name: requiredString("name").trim(),

        phone: requiredString("phone")
            .trim()
            .regex(
                /^[6-9]\d{9}$/,
                "Phone number must be a valid 10-digit Indian mobile number"
            ),

        whatsapp: requiredString("whatsapp")
            .trim()
            .regex(
                /^[6-9]\d{9}$/,
                "WhatsApp number must be a valid 10-digit Indian mobile number"
            ),

        email: requiredString("email")
            .trim()
            .toLowerCase()
            .email("Please enter a valid email address"),

        vendor_type: z.enum(
            ["SPARE_PARTS", "SERVICE_GARAGE"],
            {
                message: "Vendor type must be SPARE_PARTS or SERVICE_GARAGE"
            }
        )

    })
});



const requestIdParams = z.object({

    id: z.uuid({

        message: "Invalid application ID"

    })

});

const saveBusinessDetails = z.object({
    params: requestIdParams,

    body: z.object({

        gstin: requiredString("gstin")
            .trim()
            .length(15, "GSTIN must be 15 characters"),

        legal_name: requiredString("legal_name")
            .trim(),

        trade_name: requiredString("trade_name")
            .trim(),

        business_type: requiredString("business_type")
            .trim(),

        gst_status: requiredString("gst_status")
            .trim(),

        address: requiredString("address")
            .trim(),

        state: requiredString("state")
            .trim(),

        city: requiredString("city")
            .trim(),

        pincode: requiredString("pincode")
            .trim()
            .regex(
                /^\d{6}$/,
                "Pincode must be a valid 6-digit Indian PIN code"
            ),

        latitude: z.coerce
            .number()
            .min(-90, "Invalid latitude")
            .max(90, "Invalid latitude"),

        longitude: z.coerce
            .number()
            .min(-180, "Invalid longitude")
            .max(180, "Invalid longitude")
    })
});


const saveSparePartsProfile = z.object({
    params: requestIdParams,

    body: z.object({
        partTypes: z.array(
            z.uuid("Invalid part type ID")
        ).min(1, "Select at least one part type"),

        vehicleCategories: z.array(
            z.uuid("Invalid vehicle category ID")
        ).min(1, "Select at least one vehicle category"),

        vehicleBrands: z.array(
            z.uuid("Invalid vehicle brand ID")
        ).min(1, "Select at least one vehicle brand"),

        partsCategories: z.array(
            z.uuid("Invalid parts category ID")
        ).min(1, "Select at least one parts category"),
    })
});

const saveBusinessHours = z.object({
    params: requestIdParams,

    body: z.object({
        business_days: requiredString("business_days").trim(),

        opening_time: requiredString("opening_time")
            .trim()
            .regex(
                /^([01]\d|2[0-3]):[0-5]\d$/,
                "Opening time must be in HH:mm format"
            ),

        closing_time: requiredString("closing_time")
            .trim()
            .regex(
                /^([01]\d|2[0-3]):[0-5]\d$/,
                "Closing time must be in HH:mm format"
            ),
    })
});

const submitApplication = z.object(
    {
        params: requestIdParams
    }
);


const saveGarageCapabilities = z.object({
    params: requestIdParams,

    body: z.object({

        service_pickup_radius_km: z.number({
            error: "service_pickup_radius_km is required"
        })
            .int()
            .nonnegative(),

        provides_pickup_drop: z.boolean({
            error: "provides_pickup_drop is required"
        }),

        repair_capabilities: z.array(
            z.string().uuid("Invalid repair capability ID")
        )
            .min(1, "Select at least one repair capability"),

        no_of_service_bays: z.number({
            error: "no_of_service_bays is required"
        })
            .int()
            .nonnegative(),

        no_of_technicians: z.number({
            error: "no_of_technicians is required"
        })
            .int()
            .nonnegative(),

        no_of_denting_technicians: z.number({
            error: "no_of_denting_technicians is required"
        })
            .int()
            .nonnegative(),

        no_of_painters: z.number({
            error: "no_of_painters is required"
        })
            .int()
            .nonnegative(),

        paint_booth_available: z.boolean({
            error: "paint_booth_available is required"
        }),

        vehicle_lift_available: z.boolean({
            error: "vehicle_lift_available is required"
        }),

        diagnostic_scanner_available: z.boolean({
            error: "diagnostic_scanner_available is required"
        }),

        wheel_alignment_machine_available: z.boolean({
            error: "wheel_alignment_machine_available is required"
        }),

        dedicated_accident_repair_area_available: z.boolean({
            error: "dedicated_accident_repair_area_available is required"
        })
    })
});



const saveVehiclesAndInsuranceDetails = z.object({
    params: requestIdParams,

    body: z.object({
        vehicle_types: z.array(z.uuid()).min(1),
        brands_serviced: z.array(z.uuid()).min(1),

        currently_handles_insurance_repairs: z.boolean(),

        no_of_insurance_repair_experience: z.number().optional(),
        insurance_vehicles_per_month: z.number().optional(),
        has_dedicated_insurance_coordinator: z.boolean().optional(),
        has_surveyor_inspection_facility: z.boolean().optional(),
        has_previous_cashless_repair_experience: z.boolean().optional(),

    }).superRefine((data, ctx) => {
        if (!data.currently_handles_insurance_repairs) return;

        const requiredFields = [
            "no_of_insurance_repair_experience",
            "insurance_vehicles_per_month",
            "has_dedicated_insurance_coordinator",
            "has_surveyor_inspection_facility",
            "has_previous_cashless_repair_experience",
        ];

        requiredFields.forEach((field) => {
            if (data[field] === undefined) {
                ctx.addIssue({
                    code: "custom",
                    path: [field],
                    message: `${field} is required`,
                });
            }
        });
    }),
});



const presignAssets = z.object({
    params: requestIdParams,
    body: z
        .object({
            contentType: z.string().trim().min(1).max(100),
        })
        .strict(),
});

const saveShopOrGarageImages = z.object({
    params: requestIdParams,
    body: z.array(
        z.object({
            photo_type: z.enum([
                "GARAGE_FRONT",
                "GARAGE_INTERIOR",
                "SERVICE_BAY",
                "PAINT_BOOTH",
                "VEHICLE_LIFT",
                "DENTING_AREA",
                "ACCIDENT_REPAIR_AREA",
                "EQUIPMENT",
                "OTHER"
            ]),

            object_key: z.string()
                .trim()
                .min(1, "object_key is required"),

            sort_order: z.number()
                .int()
                .nonnegative()
                .nullable()
                .optional()
        })
    )
        .min(1, "At least one image is required")
});



const saveApplicationDocuments = z.object({
    params: requestIdParams,

    body: z.array(
        z.object({
            document_type: z.enum([
                "GST_CERTIFICATE",
                "PAN",
                "SHOP_ACT",
                "UDYAM",
                "CANCELLED_CHEQUE",
                "OWNER_ID",
                "OTHER"
            ]),

            file_type: z.enum(
                ["IMAGE", "PDF"],
                {
                    message: "file_type must be IMAGE or PDF"
                }
            ),

            object_key: requiredString("object_key")
                .trim(),

            sort_order: z.number()
                .int()
                .nonnegative()
                .nullable()
                .optional()
        })
    )
        .min(1, "At least one document is required")
});

module.exports = {
    saveApplicationDocuments,
    saveShopOrGarageImages,
    presignAssets,
    saveVehiclesAndInsuranceDetails,
    submitApplication,
    createApplication,
    saveBusinessDetails,
    saveSparePartsProfile,
    saveBusinessHours,
    saveGarageCapabilities
}