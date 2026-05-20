# ai-image-generator

Node.js Express app for Taiwan stock lookup with:
- Yahoo Finance live quote
- TWSE / TPEx 中文名稱對照
- FinMind institutional / margin / shareholding data
- mobile-friendly `index.html` UI

## 本地開發

1. 安裝依賴：

```bash
npm install
```

2. 啟動伺服器：

```bash
npm start
```

3. 開啟瀏覽器：

```text
http://localhost:3000
```

## Render 部署

已新增 `render.yaml`，Render 會使用：
- `npm install` 進行安裝
- `npm start` 啟動服務
- `process.env.PORT` 作為主機埠設定

部署步驟：

1. 將專案推到 GitHub 或其他 Git 倉庫。
2. 在 Render 建立新的 Web Service，選擇此 repo。
3. 確認 `render.yaml` 已包含於 repo 根目錄。
4. Render 會自動部署並啟用應用程式。

部署後，首頁路徑 `/` 會回傳 `index.html`，可直接存取手機版介面。
