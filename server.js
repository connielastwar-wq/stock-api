const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const TWSE_COMPANY_LIST_URL = "https://openapi.twse.com.tw/v1/opendata/t187ap03_L?_=1";
const TPEX_COMPANY_LIST_URL = "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_quotes";
const COMPANY_LIST_CACHE_MS = 1000 * 60 * 60 * 6; // 6 hours

let twseCompanyMap = null;
let tpexCompanyMap = null;
let twseCompanyMapLoadedAt = 0;
let tpexCompanyMapLoadedAt = 0;

function normalizeStockCode(symbol) {
  return String(symbol || "")
    .trim()
    .replace(/\.TW$/i, "")
    .replace(/^tpe:/i, "")
    .replace(/^twse:/i, "")
    .toUpperCase();
}

async function loadTWSECompanyMap() {
  try {
    const response = await fetch(TWSE_COMPANY_LIST_URL);
    if (!response.ok) return;
    const json = await response.json();
    if (!Array.isArray(json)) return;
    twseCompanyMap = json.reduce((map, item) => {
      const code = String(item["公司代號"] || item["股份代號"] || "").trim();
      const name = String(item["公司名稱"] || item["公司簡稱"] || "").trim();
      if (code && name) map[code] = name;
      return map;
    }, {});
    twseCompanyMapLoadedAt = Date.now();
  } catch (err) {
    // ignore load errors and keep existing cache
  }
}

async function loadTPEXCompanyMap() {
  try {
    const response = await fetch(TPEX_COMPANY_LIST_URL, { redirect: "follow" });
    if (!response.ok) return;
    const json = await response.json();
    if (!Array.isArray(json)) return;
    tpexCompanyMap = json.reduce((map, item) => {
      const code = String(item.SecuritiesCompanyCode || item.Code || "").trim().toUpperCase();
      const name = String(item.CompanyName || item.Name || "").trim();
      if (code && name) map[code] = name;
      return map;
    }, {});
    tpexCompanyMapLoadedAt = Date.now();
  } catch (err) {
    // ignore load errors and keep existing cache
  }
}

async function lookupChineseStockName(symbol) {
  const code = normalizeStockCode(symbol);
  if (!code) return null;

  const now = Date.now();
  if (!twseCompanyMap || now - twseCompanyMapLoadedAt > COMPANY_LIST_CACHE_MS) {
    await loadTWSECompanyMap();
  }
  if (twseCompanyMap?.[code]) {
    return twseCompanyMap[code];
  }

  if (!tpexCompanyMap || now - tpexCompanyMapLoadedAt > COMPANY_LIST_CACHE_MS) {
    await loadTPEXCompanyMap();
  }
  return tpexCompanyMap?.[code] || null;
}

const FINMIND_BASE = "https://api.finmindtrade.com/api/v4/data";
const FINMIND_DATASETS = {
  institutional: "TaiwanStockTotalInstitutionalInvestors",
  margin: "TaiwanStockMarginPurchaseShortSale",
  shareholding: "TaiwanStockShareholding"
};

function parseFinMindNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const cleaned = String(value).replace(/,/g, "").trim();
  if (cleaned === "") return null;
  const num = Number(cleaned);
  return Number.isNaN(num) ? null : num;
}

function formatFinMindAmount(value, unit = "張") {
  if (value === null || value === undefined) return null;
  const number = Number(value);
  if (Number.isNaN(number)) return null;
  return `${number.toLocaleString("en-US")} ${unit}`;
}

function formatFinMindPercent(value) {
  if (value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : `${number.toFixed(2)}%`;
}

async function fetchFinMindDataset(dataset, symbol, startDate, endDate) {
  try {
    const url = `${FINMIND_BASE}?dataset=${dataset}&data_id=${encodeURIComponent(symbol)}&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const json = await response.json();
    if (!json || !Array.isArray(json.data)) return null;
    return json.data;
  } catch (e) {
    return null;
  }
}

async function fetchFinMindData(symbol) {
  try {
    const code = symbol.replace(/\.TW$/i, "");
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 30);
    const formattedStart = startDate.toISOString().slice(0, 10);
    const formattedEnd = endDate.toISOString().slice(0, 10);

    const [institutionalRows, marginRows, shareholdingRows] = await Promise.all([
      fetchFinMindDataset(FINMIND_DATASETS.institutional, code, formattedStart, formattedEnd),
      fetchFinMindDataset(FINMIND_DATASETS.margin, code, formattedStart, formattedEnd),
      fetchFinMindDataset(FINMIND_DATASETS.shareholding, code, formattedStart, formattedEnd)
    ]);

    const result = {
      latestDate: null,
      institutional: null,
      margin: null,
      foreignShare: null
    };

    if (Array.isArray(institutionalRows) && institutionalRows.length > 0) {
      const dates = Array.from(new Set(institutionalRows.map(row => row.date))).sort();
      const latestDate = dates.length ? dates[dates.length - 1] : null;
      if (latestDate) {
        const rows = institutionalRows.filter(row => row.date === latestDate);
        const getNet = name => {
          const row = rows.find(item => String(item.name).trim() === name);
          if (!row) return null;
          const buy = parseFinMindNumber(row.buy);
          const sell = parseFinMindNumber(row.sell);
          if (buy === null || sell === null) return null;
          const net = buy - sell;
          return {
            value: net,
            text: `${net >= 0 ? "+" : ""}${formatFinMindAmount(net)}`
          };
        };

        result.institutional = {
          date: latestDate,
          foreign: getNet("Foreign_Investor"),
          investmentTrust: getNet("Investment_Trust"),
          dealer: getNet("Dealer_self"),
          total: getNet("total")
        };
        result.latestDate = latestDate;
      }
    }

    if (Array.isArray(marginRows) && marginRows.length > 0) {
      const dates = Array.from(new Set(marginRows.map(row => row.date))).sort();
      const latestDate = dates.length ? dates[dates.length - 1] : null;
      if (latestDate) {
        const row = marginRows.find(item => item.date === latestDate);
        if (row) {
          result.margin = {
            date: latestDate,
            marginPurchaseTodayBalance: parseFinMindNumber(row.MarginPurchaseTodayBalance) === null ? null : { value: parseFinMindNumber(row.MarginPurchaseTodayBalance), text: formatFinMindAmount(parseFinMindNumber(row.MarginPurchaseTodayBalance)) },
            shortSaleTodayBalance: parseFinMindNumber(row.ShortSaleTodayBalance) === null ? null : { value: parseFinMindNumber(row.ShortSaleTodayBalance), text: formatFinMindAmount(parseFinMindNumber(row.ShortSaleTodayBalance)) },
            marginPurchaseBuy: parseFinMindNumber(row.MarginPurchaseBuy) === null ? null : { value: parseFinMindNumber(row.MarginPurchaseBuy), text: formatFinMindAmount(parseFinMindNumber(row.MarginPurchaseBuy)) },
            marginPurchaseSell: parseFinMindNumber(row.MarginPurchaseSell) === null ? null : { value: parseFinMindNumber(row.MarginPurchaseSell), text: formatFinMindAmount(parseFinMindNumber(row.MarginPurchaseSell)) },
            shortSaleBuy: parseFinMindNumber(row.ShortSaleBuy) === null ? null : { value: parseFinMindNumber(row.ShortSaleBuy), text: formatFinMindAmount(parseFinMindNumber(row.ShortSaleBuy)) },
            shortSaleSell: parseFinMindNumber(row.ShortSaleSell) === null ? null : { value: parseFinMindNumber(row.ShortSaleSell), text: formatFinMindAmount(parseFinMindNumber(row.ShortSaleSell)) }
          };
          result.latestDate = result.latestDate || latestDate;
        }
      }
    }

    if (Array.isArray(shareholdingRows) && shareholdingRows.length > 0) {
      const dates = Array.from(new Set(shareholdingRows.map(row => row.date))).sort();
      const latestDate = dates.length ? dates[dates.length - 1] : null;
      if (latestDate) {
        const row = shareholdingRows.find(item => item.date === latestDate);
        if (row) {
          result.foreignShare = {
            date: latestDate,
            foreignShares: parseFinMindNumber(row.ForeignInvestmentShares) === null ? null : { value: parseFinMindNumber(row.ForeignInvestmentShares), text: `${parseFinMindNumber(row.ForeignInvestmentShares).toLocaleString("en-US")} 股` },
            foreignRatio: parseFinMindNumber(row.ForeignInvestmentSharesRatio) === null ? null : { value: parseFinMindNumber(row.ForeignInvestmentSharesRatio), text: formatFinMindPercent(row.ForeignInvestmentSharesRatio) },
            foreignRemainingShares: parseFinMindNumber(row.ForeignInvestmentRemainingShares) === null ? null : { value: parseFinMindNumber(row.ForeignInvestmentRemainingShares), text: `${parseFinMindNumber(row.ForeignInvestmentRemainingShares).toLocaleString("en-US")} 股` },
            foreignRemainingRatio: parseFinMindNumber(row.ForeignInvestmentRemainRatio) === null ? null : { value: parseFinMindNumber(row.ForeignInvestmentRemainRatio), text: formatFinMindPercent(row.ForeignInvestmentRemainRatio) }
          };
          result.latestDate = result.latestDate || latestDate;
        }
      }
    }

    return result;
  } catch (e) {
    return null;
  }
}

async function fetchYahoo(symbol) {
  if (!symbol.includes(".")) {
    symbol = symbol + ".TW";
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.chart || data.chart.error) {
    throw new Error(
      data.chart?.error?.description || "Yahoo 查無資料"
    );
  }

  const result = data.chart.result[0];
  const meta = result.meta;
  const stockName = await lookupChineseStockName(meta.symbol);

  return {
    success: true,
    data: {
      symbol: meta.symbol,
      name: stockName || meta.shortName || meta.symbol,
      price: meta.regularMarketPrice,
      previousClose: meta.previousClose,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent:
        ((meta.regularMarketPrice - meta.previousClose) /
          meta.previousClose) * 100,
      open: meta.regularMarketOpen,
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      volume: meta.regularMarketVolume,
      currency: meta.currency,
      exchange: meta.exchangeName,
      updateTime: new Date().toLocaleString("zh-TW")
    }
  };
}

app.get("/api/stock/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const stockData = await fetchYahoo(symbol);
    stockData.data.finmind = await fetchFinMindData(symbol);
    stockData.data.institutional = stockData.data.finmind?.institutional || null;
    res.json(stockData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

const PORT = 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log("API伺服器啟動");
  console.log(`http://192.168.0.199:${PORT}`);
});