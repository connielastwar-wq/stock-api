async function searchStock() {

  const stockNo = document.getElementById("stockNo").value;

  if (!stockNo) {
    alert("請輸入股票代號");
    return;
  }

  try {

    const response = await fetch(`/api/stock/${stockNo}`);

    const data = await response.json();

    console.log(data);

    document.getElementById("name").innerText =
      data.companyName || "--";

    document.getElementById("code").innerText =
      stockNo;

    document.getElementById("price").innerText =
      data.close || "--";

    document.getElementById("time").innerText =
      data.updateTime || "--";

    document.getElementById("change").innerText =
      data.changePrice || "--";

    document.getElementById("percent").innerText =
      data.changePercent || "--";

    document.getElementById("volume").innerText =
      data.tradeVolume || "--";

    document.getElementById("high").innerText =
      data.highPrice || "--";

    document.getElementById("low").innerText =
      data.lowPrice || "--";

    document.getElementById("open").innerText =
      data.openPrice || "--";

    document.getElementById("foreign").innerText =
      data.foreign || "--";

    document.getElementById("investment").innerText =
      data.investment || "--";

    document.getElementById("dealer").innerText =
      data.dealer || "--";

    document.getElementById("total").innerText =
      data.total || "--";

    document.getElementById("margin").innerText =
      data.margin || "--";

    document.getElementById("short").innerText =
      data.short || "--";

  } catch (err) {

    console.log(err);

    alert("查詢失敗");

  }

}