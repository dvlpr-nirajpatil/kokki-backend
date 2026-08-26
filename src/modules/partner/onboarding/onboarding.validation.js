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
module.exports = {
    submitApplication,
    createApplication,
    saveBusinessDetails,
    saveSparePartsProfile,
    saveBusinessHours,
    saveGarageCapabilities
}