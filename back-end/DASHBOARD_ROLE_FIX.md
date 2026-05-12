# Dashboard Role-Based Redirect Fix

## Problem Fixed
When using the `/superadmin/init` endpoint to create a SuperAdmin user, the system was incorrectly assigning role `ADMIN` instead of `SUPER_ADMIN` to the user in the `utilisateurs` table. This caused the login response to redirect users to `/admin/dashboard` instead of `/superadmin/dashboard`.

## Solution Implemented

### 1. Backend Fix
**File:** `src/main/java/com/example/mangment_pfarmacy_v2/common/service/DataInitializer.java`

Changed role assignment from `ADMIN` to `SUPER_ADMIN`:
```java
// Before:
adminPharmacie.setRole(Role.ADMIN);

// After:
adminPharmacie.setRole(Role.SUPER_ADMIN);
```

### 2. Role-to-Dashboard Mapping
The `AuthService` now correctly maps roles to dashboard paths:
- `SUPER_ADMIN` → `/superadmin/dashboard`
- `ADMIN` → `/admin/dashboard`
- `PHARMACIEN` → `/pharmacien/dashboard`

### 3. API Endpoints Created
Three new secured dashboard endpoints:
- `GET /api/admin/dashboard` — Requires `ADMIN` role
- `GET /api/pharmacien/dashboard` — Requires `PHARMACIEN` role
- `GET /api/superadmin/dashboard` — Requires `SUPER_ADMIN` role

### 4. Login Response Enhancement
The `/auth/login` endpoint now returns `dashboardPath` in the response:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "expirationMs": 86400000,
  "userId": "uuid",
  "pharmacieId": "uuid",
  "email": "admin@admin.com",
  "role": "SUPER_ADMIN",
  "dashboardPath": "/superadmin/dashboard"
}
```

## How to Test

### 1. Using Postman
1. Open `PharmaSaaS.postman_collection.json`
2. Call **SuperAdmin → Initialize SuperAdmin** with:
   ```json
   {
     "firstName": "Admin",
     "lastName": "Admin",
     "email": "admin@admin.com",
     "password": "azertyui",
     "pharmacyName": "Pharmacie Centrale",
     "pharmacyAddress": "Centre Ville Sayada",
     "phoneNumber": "97905025",
     "initSecret": "SuperAdminSecureInitKey2024"
   }
   ```
3. Call **Auth → Login** with:
   ```json
   {
     "email": "admin@admin.com",
     "password": "azertyui"
   }
   ```
4. Response will contain `dashboardPath: "/superadmin/dashboard"`
5. Postman test script automatically captures:
   - `jwt_token`
   - `pharmacie_id`
   - `pharmacien_id`
   - `dashboard_path` ← **New!**
   - `redirectUrl` ← **New!**

### 2. Using Frontend
1. Navigate to `http://localhost:3000/login`
2. Enter SuperAdmin credentials created via `/superadmin/init`
3. After login, the frontend receives `dashboardPath` and automatically redirects to the correct dashboard

### 3. Database Verification
After calling `/superadmin/init`, verify in PostgreSQL pgAdmin:

**Table: `utilisateurs`**
```sql
SELECT email, role FROM utilisateurs WHERE email = 'admin@admin.com';
-- Result: admin@admin.com | SUPER_ADMIN
```

**Table: `super_admins`**
```sql
SELECT email FROM super_admins WHERE email = 'admin@admin.com';
-- Result: admin@admin.com
```

## Updated Files
- `src/main/java/com/example/mangment_pfarmacy_v2/common/service/DataInitializer.java` — Fixed role assignment
- `src/main/java/com/example/mangment_pfarmacy_v2/utilisateur/service/AuthService.java` — Added `dashboardPath` to response
- `src/main/java/com/example/mangment_pfarmacy_v2/utilisateur/dto/JwtResponseDTO.java` — Added `dashboardPath` field
- `PharmaSaaS.postman_collection.json` — Enhanced test scripts, new variables
- New Dashboard Controllers:
  - `src/main/java/com/example/mangment_pfarmacy_v2/dashboard/controller/AdminDashboardController.java`
  - `src/main/java/com/example/mangment_pfarmacy_v2/dashboard/controller/PharmacienDashboardController.java`
  - `src/main/java/com/example/mangment_pfarmacy_v2/dashboard/controller/SuperAdminDashboardController.java`

## Frontend Implementation Note
The frontend should:
1. Store the `dashboardPath` from login response
2. Redirect to `http://localhost:3000{dashboardPath}` after login
3. Example (React):
   ```javascript
   const response = await fetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
   const data = await response.json();
   window.location.href = `http://localhost:3000${data.dashboardPath}`;
   ```

## Postman Collection Variables
New variables added for tracking redirect paths:
- `dashboard_path` — The path returned from login response (e.g., `/superadmin/dashboard`)
- `redirectUrl` — Full redirect URL (e.g., `http://localhost:3000/superadmin/dashboard`)

These are automatically populated by the Login/Register test scripts.
