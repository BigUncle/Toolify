const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/v1/chat/completions', async (req, res) => {
  const isStream = req.body?.stream === true;

  try {
    if (!isStream) {
      const response = await axios.post(
        'http://127.0.0.1:8000/v1/chat/completions',
        req.body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers['authorization'] || ''
          },
          timeout: 30000
        }
      );
      return res.status(response.status).json(response.data);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const upstream = await axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/v1/chat/completions',
      data: req.body,
      responseType: 'stream',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers['authorization'] || ''
      }
    });

    upstream.data.on('data', (chunk) => res.write(chunk));
    upstream.data.on('end', () => res.end());
    upstream.data.on('error', (err) => {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const payload = err?.response?.data || { error: err.message || 'proxy error' };

    if (isStream) {
      res.write(`data: ${JSON.stringify(payload)}\n\n`);
      return res.end();
    }

    return res.status(status).json(payload);
  }
});

module.exports = app;
