const url='https://www.tpex.org.tw/openapi/v1/tpex_mainboard_quotes';
(async () => {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    console.log('status', res.status, res.headers.get('content-type'));
    const text = await res.text();
    console.log('body prefix', text.slice(0, 400));
    try {
      const data = JSON.parse(text);
      console.log('data type', Array.isArray(data) ? 'array' : typeof data);
      if (Array.isArray(data)) {
        console.log('length', data.length);
        console.log('sample', data.slice(0,5));
      }
    } catch (e) {
      console.error('parse error', e.message);
    }
  } catch (err) {
    console.error('fetch error', err.message);
  }
})();
