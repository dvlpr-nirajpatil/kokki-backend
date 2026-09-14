/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {

  const makes = [
    // Existing passenger makes with additional categories
    {
      name: "BMW",
      slug: "bmw",
      country: "Germany",
      categories: ["PASSENGER_CAR", "TWO_WHEELER"]
    },
    {
      name: "Honda",
      slug: "honda",
      country: "Japan",
      categories: ["PASSENGER_CAR", "TWO_WHEELER"]
    },
    {
      name: "Mahindra",
      slug: "mahindra",
      country: "India",
      categories: ["PASSENGER_CAR", "COMMERCIAL"]
    },
    {
      name: "Tata Motors",
      slug: "tata-motors",
      country: "India",
      categories: ["PASSENGER_CAR", "COMMERCIAL"]
    },
    {
      name: "Toyota",
      slug: "toyota",
      country: "Japan",
      categories: ["PASSENGER_CAR", "COMMERCIAL"]
    },

    // Two Wheeler
    {
      name: "Hero MotoCorp",
      slug: "hero-motocorp",
      country: "India",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Bajaj Auto",
      slug: "bajaj-auto",
      country: "India",
      categories: ["TWO_WHEELER", "COMMERCIAL"]
    },
    {
      name: "TVS Motor",
      slug: "tvs-motor",
      country: "India",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Royal Enfield",
      slug: "royal-enfield",
      country: "India",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Yamaha",
      slug: "yamaha",
      country: "Japan",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Suzuki Motorcycle",
      slug: "suzuki-motorcycle",
      country: "Japan",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "KTM",
      slug: "ktm",
      country: "Austria",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Jawa",
      slug: "jawa",
      country: "Czech Republic",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Yezdi",
      slug: "yezdi",
      country: "India",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Ather Energy",
      slug: "ather-energy",
      country: "India",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Ola Electric",
      slug: "ola-electric",
      country: "India",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Triumph",
      slug: "triumph",
      country: "United Kingdom",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Kawasaki",
      slug: "kawasaki",
      country: "Japan",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Aprilia",
      slug: "aprilia",
      country: "Italy",
      categories: ["TWO_WHEELER"]
    },
    {
      name: "Vespa",
      slug: "vespa",
      country: "Italy",
      categories: ["TWO_WHEELER"]
    },

    // Commercial
    {
      name: "Ashok Leyland",
      slug: "ashok-leyland",
      country: "India",
      categories: ["COMMERCIAL"]
    },
    {
      name: "BharatBenz",
      slug: "bharatbenz",
      country: "India",
      categories: ["COMMERCIAL"]
    },
    {
      name: "Eicher",
      slug: "eicher",
      country: "India",
      categories: ["COMMERCIAL"]
    },
    {
      name: "Force Motors",
      slug: "force-motors",
      country: "India",
      categories: ["COMMERCIAL"]
    },
    {
      name: "SML Isuzu",
      slug: "sml-isuzu",
      country: "India",
      categories: ["COMMERCIAL"]
    },
    {
      name: "Isuzu",
      slug: "isuzu",
      country: "Japan",
      categories: ["COMMERCIAL"]
    }
  ];

  for (const makeData of makes) {

    // Find existing make
    let make = await knex("vehicle_makes")
      .where("name", makeData.name)
      .first();

    // Create only if it doesn't exist
    if (!make) {
      [make] = await knex("vehicle_makes")
        .insert({
          name: makeData.name,
          slug: makeData.slug,
          country: makeData.country,
          is_active: true
        })
        .returning("*");
    }

    // Find category IDs from category codes
    const categories = await knex("vehicle_categories")
      .whereIn("code", makeData.categories)
      .select("id");

    // Add mappings without duplicates
    for (const category of categories) {
      await knex("vehicle_make_categories")
        .insert({
          vehicle_make_id: make.id,
          vehicle_category_id: category.id
        })
        .onConflict([
          "vehicle_make_id",
          "vehicle_category_id"
        ])
        .ignore();
    }
  }
};