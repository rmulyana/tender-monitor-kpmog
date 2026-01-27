const USD_BASE_URL = "https://open.er-api.com/v6/latest/USD";

const getUsdToIdrRate = async (req, res) => {
  try {
    const response = await fetch(USD_BASE_URL);
    if (!response.ok) {
      return res
        .status(502)
        .json({ message: "Failed to fetch exchange rate" });
    }
    const data = await response.json();
    const rate = Number(data?.rates?.IDR);
    if (!Number.isFinite(rate) || rate <= 0) {
      return res.status(502).json({ message: "Invalid exchange rate data" });
    }
    return res.status(200).json({
      base: "USD",
      quote: "IDR",
      rate,
      provider: "open.er-api.com",
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching exchange rate", error: error.message });
  }
};

module.exports = {
  getUsdToIdrRate,
};

