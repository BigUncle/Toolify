# Deploy Toolify to Vercel (Hybrid Python + Node)

## 1) Prepare config
1. Copy `config.example.yaml` to `config.yaml` and edit it.
2. Base64 encode it:
   ```bash
   base64 -w0 config.yaml
   ```
3. In Vercel Project Settings → Environment Variables, set:
   - `TOOLIFY_CONFIG_B64` = the Base64 string

## 2) Runtime structure
- Python entry: `api/index.py` (imports `app` from `main.py`)
- Streaming proxy: `node-api/stream.js`
- Routing config: `vercel.json`

## 3) Build command
In Vercel build settings use:
```bash
bash vercel-build.sh
```

## 4) Verify endpoints after deploy
- `POST /v1/chat/completions` (non-stream)
- `POST /v1/chat/completions` with `stream=true` (SSE)

## 5) Notes
- Keep `config.yaml` local only (ignored by git).
- Use environment variable config in production.
