const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function fetchJSON(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API錯誤 ${res.status}`);
  }

  return await res.json();
}

app.get("/api/stock/:id", async (req, res) => {

  try {

    const stockId = req.params.id;

    const today = new Date();

    const yyyy = today.getFullYear();

    const mm =
      String(today.getMonth() + 1).padStart(2, "0");

    const dd =
      String(today.getDate()).padStart(2, "0");

    const date = `${yyyy}${mm}${dd}`;

    // 上市
    const twseURL =
      `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&stockNo=${stockId}&date=${date}`;

    let stockName = stockId;
    let latestPrice = "--";

    try {

      const twseData = await fetchJSON(twseURL);

      if (twseData?.title) {

        stockName =
          twseData.title.split(" ")[2] || stockId;

      }

      if (twseData?.data?.length) {

        const latest =
          twseData.data[twseData.data.length - 1];

        latestPrice = latest[6];

      }

    } catch (e) {
      console.log("TWSE失敗");
    }

    // 三大法人
    const institutionURL =
      "https://openapi.twse.com.tw/v1/fund/T86";

    let foreign = "--";
    let investment = "--";
    let dealer = "--";
    let total = "--";

    try {

      const institutionData =
        await fetchJSON(institutionURL);

      const target =
        institutionData.find(
          x => x.Code === stockId
        );

      if (target) {

        foreign = target.Foreign_Investor || "--";
        investment = target.Investment_Trust || "--";
        dealer = target.Dealer_total || "--";
        total = target.Total || "--";

      }

    } catch (e) {
      console.log("法人失敗");
    }

    res.json({
      name: stockName,
      price: latestPrice,
      change: 0,
      open: "--",
      high: "--",
      low: "--",
      volume: "--",

      foreign,
      investment,
      dealer,
      total,

      margin: "--",
      short: "--"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`API啟動成功 ${PORT}`);

});