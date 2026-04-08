---
title: "API Documentation"
description: "Connect SmartSpanner to Power BI, Excel, or any reporting tool using the REST API."
permalink: /api/
section: "API"
---

# API Documentation

Use the SmartSpanner API to extract your data into Power BI, Excel, or any reporting tool. All data is scoped to your account — you can only access data within your own organisation.

## Base URL

```
https://app.smartspanner.com/api
```

## Authentication

All API requests require an authentication token. Your token gives access only to your own organisation's data.

### Step 1: Get your token

Send a POST request with your login credentials:

```
POST https://app.smartspanner.com/api/mobile/auth/

{
  "username": "your@email.com",
  "password": "your-password"
}
```

The response includes your token:

```json
{
  "token": "abc123def456...",
  "user": { "id": 1, "first_name": "John", ... }
}
```

### Step 2: Use the token

Include the token in the `Authorization` header of every request:

```
Authorization: Token abc123def456...
```

Your token does not expire. You can verify it at any time:

```
GET https://app.smartspanner.com/api/mobile/verify-token/
Authorization: Token abc123def456...
```

---

## Connecting to Power BI

1. Open **Power BI Desktop**
2. Click **Get Data** > **Web**
3. Select **Advanced**
4. Enter the endpoint URL, e.g. `https://app.smartspanner.com/api/tasks`
5. Add an HTTP request header:
   - **Name:** `Authorization`
   - **Value:** `Token abc123def456...`
6. Click **OK** — your data loads as a table

Repeat for each endpoint you want to import (assets, spares, etc.). Set the data source to refresh on a schedule for live dashboards.

---

## Endpoints

### Sites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sites` | List all sites |
| GET | `/sites/{id}` | Site detail |

**Fields:** id, name, site_tz, address1, address2, address3, province, post_code, country, telephone, contact_name, contact_email, assets_count

---

### Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/asset` | List all assets |
| GET | `/asset/{id}` | Asset detail |

**List fields:** id, name, assetid, model, serial_number, location, manufacturer, is_active, label_code

**Detail fields (additional):** cost, mtbb, group, category, parameters, expiry_date, installation_date, hours_per_day, hours_per_week, location_specific

---

### Work Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all work orders |
| GET | `/tasks/{id}` | Work order detail |
| GET | `/tasks/types` | List work order types |

**List fields:** id, title, status, priority, date, deadline, asset, creator, type

**Detail fields (additional):** description, endDate, assignee, procedures, failure_codes, estimated_time, total_downtime

**Status values:** Reported, Planned, Active, Completed, Cancelled, Metered

---

### Spare Parts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/spare` | List all spares |
| GET | `/spare/{id}` | Spare detail |
| GET | `/spare/{spare_id}/stock` | Stock levels by location |

**Fields:** id, name, part_number, stocks (array with location, quantity, reorder level)

---

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List active users |
| GET | `/users/{id}` | User detail |

**Fields:** id, first_name, last_name, email, role, phone, profile, hourly_rate, is_active

---

### Lockouts (LOTO)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lockouts` | List lockouts |
| GET | `/lockouts/{id}` | Lockout detail |

---

### Subcontractors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subcontractors` | List subcontractors |

---

### Procedures

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/procedures` | List procedures |
| GET | `/procedures/{id}` | Procedure detail |

**Fields:** id, title, description

---

### Manufacturers & Suppliers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/manufacturer` | List manufacturers |
| GET | `/supplier` | List suppliers |

**Supplier fields:** id, name, phone, email, website, currency, address1, city, country

---

## Data Formats

| Format | Example |
|--------|---------|
| Dates | ISO 8601 — `2026-04-07T10:30:00Z` |
| Durations | `1D2H30M15S` = 1 day, 2 hours, 30 minutes, 15 seconds |
| Nested objects | Related records (e.g. asset location, task assignee) are returned as nested JSON objects |

---

## Security

- All data is filtered to your organisation only — you cannot access other tenants' data
- HTTPS is required for all requests
- Your token grants the same access level as your user account
- Keep your token secure — treat it like a password
