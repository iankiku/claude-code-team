---
name: deploy-ops
description: "Deployment patterns for Vercel, Railway, and Convex. Environment config, preview deploys, CI/CD."
---

# Deploy Ops

Deployment patterns and operational best practices for Vercel, Railway, and Convex.

## Vercel

### Next.js Configuration
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
  // Standalone output for Docker
  output: process.env.DOCKER ? 'standalone' : undefined,
};
```

### Environment Variables
```bash
vercel env add STRIPE_SECRET_KEY production
vercel env add DATABASE_URL production preview
vercel env pull .env.local
vercel link
```

### Preview Deployments
- Every PR gets a unique URL: `project-git-branch-team.vercel.app`
- Use `VERCEL_ENV` to detect environment: `production`, `preview`, `development`
- Set preview-specific env vars for staging databases

### Edge Config
```typescript
import { get } from '@vercel/edge-config';
const featureFlag = await get('enable-new-checkout');
```

### Deployment Commands
```bash
vercel                    # Deploy to preview
vercel --prod             # Deploy to production
vercel logs <url>         # View deployment logs
vercel inspect <url>      # Inspect deployment details
vercel rollback           # Rollback to previous deployment
```

## Railway

### Config & Health Checks
```toml
# railway.toml
[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 5

[build]
dockerfilePath = "Dockerfile"
```

### Private Networking
```bash
# Services communicate via internal DNS
DATABASE_URL=postgresql://user:pass@postgres.railway.internal:5432/db
REDIS_URL=redis://redis.railway.internal:6379
```

### Railway CLI
```bash
railway login
railway init                    # Link to project
railway up                      # Deploy
railway logs                    # View logs
railway run <cmd>               # Run command in Railway env
railway variables set KEY=VALUE # Set env var
```

## Convex

Convex is a reactive backend with schema, queries, mutations, cron jobs, and file storage.

### CLI
```bash
npx convex dev              # Start dev server (syncs functions)
npx convex deploy           # Deploy to production
npx convex env set KEY=VAL  # Set env var
npx convex data             # View data in terminal
npx convex logs             # View function logs
```

## CI/CD Patterns

### GitHub Actions for Vercel
```yaml
name: Deploy
on: push
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

### Pre-deploy Checklist
1. **Env vars set** for target environment
2. **Database migrations** applied (if applicable)
3. **Health check** endpoint responding
4. **Build succeeds** locally before pushing
5. **Preview deploy** tested before promoting to production

## Key Rules

1. **Never commit secrets** — use platform env vars or secret managers
2. **Always have a health check** — Railway/Vercel need it for zero-downtime deploys
3. **Use preview environments** — test before production, always
4. **Pin dependency versions** — lockfile must be committed
5. **Standalone builds for Docker** — `output: 'standalone'` in Next.js reduces image size 10x
