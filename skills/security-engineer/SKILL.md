---
name: security-engineer
description: |
  Application security specialist focused on secure design, vulnerability prevention, and threat modeling. Masters OWASP Top 10, authentication patterns, and building security into the development lifecycle for AI and financial applications.

  Use when: (1) Reviewing code for security vulnerabilities, (2) Designing authentication and authorization, (3) Implementing secure API patterns, (4) Handling sensitive data and secrets, (5) Threat modeling new features, (6) Responding to security incidents, (7) Setting up security scanning and monitoring.
---

# Security Engineer

Assume breach. Design for compromise. Trust nothing by default.

## Core Principles

**Defense in Depth**: Multiple layers. No single point of failure.

**Least Privilege**: Only the access needed, nothing more.

**Fail Secure**: When things break, default to deny.

**Zero Trust**: Verify everything, trust nothing, log always.

---

## OWASP Top 10 Prevention Checklist

1. **Injection**: Use parameterized queries / ORM (never string interpolation)
2. **Broken Auth**: httpOnly + secure + sameSite cookies; short-lived tokens
3. **XSS**: Never use `dangerouslySetInnerHTML` with user input; set `X-Content-Type-Options: nosniff`
4. **Broken Access Control**: Always verify ownership on every resource fetch
5. **Security Misconfiguration**: Set HSTS, X-Frame-Options DENY, CSP `default-src 'self'`, Referrer-Policy
6. **Vulnerable Components**: Audit dependencies regularly (`npm audit`)
7. **Identification Failures**: Enforce MFA on admin, rate-limit auth endpoints
8. **Data Integrity Failures**: Verify signatures on updates, use SRI for CDN scripts
9. **Logging Failures**: Log auth events, access decisions, config changes — never log secrets
10. **SSRF**: Whitelist allowed URLs, block internal IPs, validate redirect targets

---

## Authentication Patterns

### API Key Security
```typescript
import { randomBytes, createHash } from 'crypto';

function generateApiKey(): { key: string; hash: string; prefix: string } {
  const key = `app_live_${randomBytes(24).toString('base64url')}`;
  const hash = createHash('sha256').update(key).digest('hex');
  const prefix = key.substring(0, 12);
  return { key, hash, prefix }; // Store hash, return key once
}

async function validateApiKey(key: string): Promise<User | null> {
  const hash = createHash('sha256').update(key).digest('hex');
  const apiKey = await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.keyHash, hash), eq(apiKeys.isActive, true))
  });
  if (!apiKey) return null;
  await db.update(apiKeys).set({ lastUsed: new Date() }).where(eq(apiKeys.id, apiKey.id));
  return apiKey.user;
}
```

### JWT Best Practices
```typescript
const jwtConfig = {
  algorithm: 'RS256',        // Asymmetric for APIs
  expiresIn: '15m',          // Short-lived access tokens
  issuer: 'your-app',
  audience: 'api'
};

// Always verify all claims
const payload = jwt.verify(token, publicKey, {
  algorithms: ['RS256'],     // Prevent algorithm confusion
  issuer: 'your-app',
  audience: 'api'
});
```

---

## Input Validation

```typescript
import { z } from 'zod';

const createResourceSchema = z.object({
  agentId: z.string().cuid2(),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  dailyLimit: z.number().positive().max(10000).optional()
}).strict(); // Reject unknown fields

export async function POST(req: Request) {
  const body = await req.json();
  const validated = createResourceSchema.parse(body);
  // Use validated data only
}
```

### Sanitization Rules
| Input Type | Validation |
|------------|------------|
| **IDs** | Exact format (CUID2, UUID) |
| **Email** | RFC 5322 regex + domain check |
| **URLs** | Protocol whitelist (https only) |
| **Numbers** | Range limits, integer vs float |
| **Strings** | Max length, character whitelist |
| **Files** | Type, size, content inspection |

---

## Secrets Management

| Secret Type | Storage |
|-------------|---------|
| **API keys** | Hash before storing |
| **Passwords** | bcrypt/argon2 (never plain) |
| **Tokens** | Short-lived, in memory |
| **Encryption keys** | KMS or Vault |
| **Config secrets** | Environment variables |

Never log secrets. Truncate to prefix: `key.substring(0, 8) + '...'`

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| **Auth** | 5 | 15 min |
| **API** | 100 | 1 min |
| **Webhooks** | 1000 | 1 min |
| **Public** | 20 | 1 min |

---

## Audit Logging

```typescript
interface AuditEvent {
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  outcome: 'success' | 'failure';
  reason?: string;
  ip: string;
  userAgent: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
}
```

Log: auth attempts, authorization decisions, sensitive data access, config changes, financial transactions, admin actions.

---

## Threat Modeling (STRIDE)

| Threat | Example | Mitigation |
|--------|---------|------------|
| **Spoofing** | Fake identity | Strong auth |
| **Tampering** | Modified data | Integrity checks |
| **Repudiation** | Deny action | Audit logs |
| **Info Disclosure** | Data leak | Encryption |
| **Denial of Service** | Overload | Rate limiting |
| **Elevation** | Gain privilege | Access control |

### AI-Specific Threats
- **Prompt injection**: Validate/sanitize AI inputs, use structured output schemas
- **Model extraction**: Rate limit inference endpoints, detect scraping patterns
- **Data poisoning**: Validate training data provenance, monitor drift
- **Output manipulation**: Validate AI responses against schemas, apply content filters
