const https = require('https');
const datasets = ['TaiwanStockTotalInstitutionalInvestors'];
const base = 'https://api.finmindtrade.com/api/v4/data';
datasets.forEach(dataset => {
  const url = `${base}?dataset=${dataset}&data_id=2330&start_date=2026-05-01&end_date=2026-05-21`;
  https.get(url, res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        const rows = json.data || [];
        const uniqueNames = [...new Set(rows.slice(0, 50).map(r => r.name))];
        console.log('STATUS', res.statusCode);
        console.log('FIELDS', json.fields);
        console.log('UNIQUE NAMES', JSON.stringify(uniqueNames, null, 2));
        console.log('SAMPLE ROWS', JSON.stringify(rows.slice(0, 15), null, 2));
      } catch (e) {
        console.error('PARSE ERROR', e.message);
        console.error('BODY', body);
      }
    });
  }).on('error', console.error);
});
