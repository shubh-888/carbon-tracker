// src/lib/globalAPI.js

export async function getGlobalCO2Data() {
  try {
    // 🌍 Real dataset fallback (since free APIs are limited)
    // Source: Our World in Data (approx values)

    return {
      india: 1900,   // kg/year per capita
      global: 4700,  // kg/year per capita
    };

  } catch (err) {
    console.error("Global API error:", err);

    return {
      india: 1900,
      global: 4700,
    };
  }
}