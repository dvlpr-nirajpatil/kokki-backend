/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {

  await knex("insurance_companies").insert([
    {
      name: "Acko General Insurance Limited",
      code: "ACKO",
      is_active: true
    },
    {
      name: "Bajaj Allianz General Insurance Company Limited",
      code: "BAJAJ_ALLIANZ",
      is_active: true
    },
    {
      name: "Cholamandalam MS General Insurance Company Limited",
      code: "CHOLA_MS",
      is_active: true
    },
    {
      name: "Future Generali India Insurance Company Limited",
      code: "FUTURE_GENERALI",
      is_active: true
    },
    {
      name: "Go Digit General Insurance Limited",
      code: "GO_DIGIT",
      is_active: true
    },
    {
      name: "HDFC ERGO General Insurance Company Limited",
      code: "HDFC_ERGO",
      is_active: true
    },
    {
      name: "ICICI Lombard General Insurance Company Limited",
      code: "ICICI_LOMBARD",
      is_active: true
    },
    {
      name: "IFFCO TOKIO General Insurance Company Limited",
      code: "IFFCO_TOKIO",
      is_active: true
    },
    {
      name: "Zurich Kotak General Insurance Company (India) Limited",
      code: "ZURICH_KOTAK",
      is_active: true
    },
    {
      name: "Liberty General Insurance Limited",
      code: "LIBERTY",
      is_active: true
    },
    {
      name: "Magma General Insurance Limited",
      code: "MAGMA",
      is_active: true
    },
    {
      name: "National Insurance Company Limited",
      code: "NATIONAL_INSURANCE",
      is_active: true
    },
    {
      name: "Navi General Insurance Limited",
      code: "NAVI",
      is_active: true
    },
    {
      name: "Raheja QBE General Insurance Company Limited",
      code: "RAHEJA_QBE",
      is_active: true
    },
    {
      name: "Reliance General Insurance Company Limited",
      code: "RELIANCE_GENERAL",
      is_active: true
    },
    {
      name: "Royal Sundaram General Insurance Company Limited",
      code: "ROYAL_SUNDARAM",
      is_active: true
    },
    {
      name: "SBI General Insurance Company Limited",
      code: "SBI_GENERAL",
      is_active: true
    },
    {
      name: "Shriram General Insurance Company Limited",
      code: "SHRIRAM_GENERAL",
      is_active: true
    },
    {
      name: "Tata AIG General Insurance Company Limited",
      code: "TATA_AIG",
      is_active: true
    },
    {
      name: "The New India Assurance Company Limited",
      code: "NEW_INDIA_ASSURANCE",
      is_active: true
    },
    {
      name: "The Oriental Insurance Company Limited",
      code: "ORIENTAL_INSURANCE",
      is_active: true
    },
    {
      name: "United India Insurance Company Limited",
      code: "UNITED_INDIA",
      is_active: true
    },
    {
      name: "Universal Sompo General Insurance Company Limited",
      code: "UNIVERSAL_SOMPO",
      is_active: true
    },
    {
      name: "Zuno General Insurance Limited",
      code: "ZUNO",
      is_active: true
    }
  ]);
};