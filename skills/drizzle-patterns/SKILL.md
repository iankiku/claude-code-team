---
name: drizzle-patterns
description: "Drizzle ORM patterns: schema design, migrations, relations, query builder, decimal handling for Postgres."
---

# Drizzle ORM Patterns

## Schema Design

```typescript
import { pgTable, text, timestamp, decimal, boolean, uuid, integer } from 'drizzle-orm/pg-core';

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  total: decimal('total', { precision: 20, scale: 2 }).notNull().default('0.00'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

## Decimal Handling (CRITICAL)

Drizzle stores `decimal` as **strings**. Always convert with `Number()`:

```typescript
// CORRECT
const total = Number(order.total);

// WRONG — parseFloat can lose precision on large numbers
const total = parseFloat(order.total);

// WRONG — direct arithmetic on strings
const sum = order.total + item.price; // string concatenation!
```

## Relations

```typescript
import { relations } from 'drizzle-orm';

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));
```

## Query Patterns

```typescript
import { eq, and, desc, sql } from 'drizzle-orm';

// Basic find
const order = await db.query.orders.findFirst({
  where: eq(orders.userId, userId),
});

// With relations
const orderWithItems = await db.query.orders.findFirst({
  where: eq(orders.id, orderId),
  with: { items: { orderBy: [desc(orderItems.createdAt)], limit: 50 } },
});

// Insert returning
const [newOrder] = await db.insert(orders).values({ userId, total: '0.00' }).returning();

// Update with SQL arithmetic
await db.update(orders)
  .set({ total: sql`${orders.total} + ${amount}`, updatedAt: new Date() })
  .where(eq(orders.id, orderId));

// Transaction
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - ${amount}` }).where(eq(accounts.id, fromId));
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + ${amount}` }).where(eq(accounts.id, toId));
  await tx.insert(ledgerEntries).values([
    { accountId: fromId, amount: `-${amount}`, type: 'transfer' },
    { accountId: toId, amount: `${amount}`, type: 'transfer' },
  ]);
});
```

## Migrations

```bash
bunx drizzle-kit generate   # Generate migration from schema changes
bunx drizzle-kit migrate    # Apply migrations
bunx drizzle-kit push       # Push schema directly (dev only)
bunx drizzle-kit studio     # Open Drizzle Studio
```

## Config

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

## Key Rules

1. Decimals are strings — always use `Number()` to convert
2. Use `sql` template for arithmetic in UPDATE queries
3. Wrap multi-table mutations in `db.transaction()`
4. Use `returning()` after INSERT to get the created row
5. Relations go in separate `*Relations` exports
