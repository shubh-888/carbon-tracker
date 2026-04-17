export async function fetchGlobalEmissions() {
  try {
    const res = await fetch(
      "https://api.worldbank.org/v2/country/all/indicator/EN.ATM.CO2E.KT?format=json&per_page=20"
    );

    const data = await res.json();

    if (!data || !data[1]) return [];

    return data[1];

  } catch (err) {
    console.error("Emission API error:", err);
    return [];
  }
}