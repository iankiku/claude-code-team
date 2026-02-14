---
name: supabase-patterns
description: "Supabase patterns: Auth, RLS policies, Edge Functions, Realtime, Storage, database functions."
---

# Supabase Patterns

Best practices for building with Supabase across Auth, Row Level Security, Edge Functions, Realtime, Storage, and database functions.

## Authentication

### Service Role vs Anon Key
```typescript
// Anon key — client-side, respects RLS policies
const supabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Service role — server-side ONLY, bypasses RLS
const supabaseAdmin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
// NEVER expose service role key to client
```

### Auth Middleware (Next.js)
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const response = NextResponse.next();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return response;
}
```

## Row Level Security (RLS)

### Performance Tips
- Index columns used in RLS policies (especially `user_id`, `team_id`)
- Avoid expensive subqueries in policies — use JOINs or materialized views
- Test with `SET LOCAL role = 'authenticated'; SET LOCAL request.jwt.claim.sub = 'user-uuid';`

### Common Patterns
```sql
-- Enable RLS on table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can CRUD their own data
CREATE POLICY "Users read own" ON posts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Team-based access
CREATE POLICY "Team members read" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = documents.team_id
      AND team_members.user_id = auth.uid()
    )
  );
```

## Realtime

```typescript
// Listen for INSERT on messages table
const channel = supabase
  .channel('messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => console.log('New message:', payload.new))
  .subscribe();

// Cleanup
supabase.removeChannel(channel);
```

## Storage

### Signed URL Pattern
```typescript
// Upload
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, { upsert: true });

// Signed URL (private bucket, expires)
const { data: { signedUrl } } = await supabase.storage
  .from('documents')
  .createSignedUrl(`${userId}/report.pdf`, 3600);
```

## Database Functions (RPC)
```sql
CREATE OR REPLACE FUNCTION get_user_stats(target_user_id UUID)
RETURNS JSON AS $$
  SELECT json_build_object(
    'posts', (SELECT COUNT(*) FROM posts WHERE user_id = target_user_id),
    'comments', (SELECT COUNT(*) FROM comments WHERE user_id = target_user_id)
  );
$$ LANGUAGE sql SECURITY DEFINER;
```
```typescript
const { data, error } = await supabase.rpc('get_user_stats', { target_user_id: userId });
```

## Key Rules

1. **Never expose service role key** to client — use anon key + RLS
2. **Always enable RLS** on new tables — default-deny is safer than default-allow
3. **Index RLS columns** — `user_id`, `team_id`, any column in policy WHERE clauses
4. **Use `auth.uid()`** not `current_user` in RLS policies
5. **Realtime requires RLS** — subscription filters are enforced server-side via policies
