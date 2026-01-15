# Response Advantage

Dialectic reduction engine - removes obfuscation through pattern matching.

## Architecture

Same DOJO manifestation as berjak-fre-dojo, different application.

```
┌─────────────────────┐
│  Vercel Frontend    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ Cloudflare Tunnel   │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ Mac Studio: 7411    │  ← Runs alongside Berjak: 7410
│  ┌──────────────┐   │
│  │ DOJO Engine  │   │
│  └──────┬───────┘   │
│         │           │
│  ┌──────▼───────┐   │
│  │  MCP Notion  │   │  ← Shared with Berjak
│  └──────────────┘   │
└─────────────────────┘
```

## Deployment

- **Frontend**: Vercel → `/frontend`
- **Backend**: Mac Studio: 7411 + Cloudflare Tunnel
- **MCP**: Shared Notion server

## Branding

● ▼ ▲ ■

Pure function. Nothing else.
