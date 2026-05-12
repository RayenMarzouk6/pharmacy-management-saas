# Pharmacy Management SaaS (PharmaSaaS)

A comprehensive role-based Pharmacy Management System built with Spring Boot.

## Overview
This application provides backend services for managing a pharmacy chain or SaaS platform. It includes role-based access control (SUPER_ADMIN, ADMIN, PHARMACIEN) to handle pharmacies, users, medicines, suppliers, and sales.

## Authentication
Most API endpoints require a JWT token for authorization. 
Include the JWT token in the request header:
`Authorization: Bearer <your_jwt_token>`

The login response also includes `role` and `dashboardPath` so the frontend can redirect the user to the correct dashboard after authentication.

---

## API Endpoints Documentation

### 1. Authentication
*Base Path:* `/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/auth/login` | Authenticate user and receive a JWT token. |

### 2. Super Admin
*Base Path:* `/superadmin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/superadmin/init` | Initialize the system (e.g., initial setup or first SuperAdmin creation). |

### 3. Pharmacies
*Base Path:* `/api/pharmacies`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/pharmacies` | Create a new pharmacy. |
| **GET** | `/api/pharmacies` | Retrieve a list of all pharmacies. |
| **GET** | `/api/pharmacies/{id}` | Retrieve details of a specific pharmacy by ID. |
| **PUT** | `/api/pharmacies/{id}` | Update an existing pharmacy by ID. |
| **DELETE** | `/api/pharmacies/{id}` | Delete a pharmacy by ID. |

### 4. Pharmacists (Utilisateurs)
*Base Path:* `/api/pharmaciens`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/pharmaciens` | Create a new pharmacist. |
| **GET** | `/api/pharmaciens` | Retrieve a list of all pharmacists. |
| **GET** | `/api/pharmaciens/{id}` | Retrieve details of a specific pharmacist by ID. |
| **PUT** | `/api/pharmaciens/{id}` | Update an existing pharmacist by ID. |
| **DELETE** | `/api/pharmaciens/{id}` | Delete a pharmacist by ID. |

### 5. Medicines (Médicaments)
*Base Path:* `/api/medicaments`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/medicaments` | Add a new medicine to the inventory. |
| **GET** | `/api/medicaments` | Retrieve a list of all medicines. |
| **GET** | `/api/medicaments/{id}` | Retrieve details of a specific medicine by ID. |
| **PUT** | `/api/medicaments/{id}` | Update an existing medicine by ID. |
| **DELETE** | `/api/medicaments/{id}` | Delete a medicine by ID. |
| **GET** | `/api/medicaments/stock-faible` | Retrieve medicines with low stock. |
| **GET** | `/api/medicaments/expires` | Retrieve expired or soon-to-expire medicines. |

### 6. Suppliers (Fournisseurs)
*Base Path:* `/api/fournisseurs`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/fournisseurs` | Create a new supplier. |
| **GET** | `/api/fournisseurs` | Retrieve a list of all suppliers. |
| **GET** | `/api/fournisseurs/{id}` | Retrieve details of a specific supplier by ID. |
| **PUT** | `/api/fournisseurs/{id}` | Update an existing supplier by ID. |
| **DELETE** | `/api/fournisseurs/{id}` | Delete a supplier by ID. |

### 7. Sales & Invoices (Ventes & Factures)
*Base Path:* `/api/ventes`

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/ventes` | Record a new sale. |
| **GET** | `/api/ventes` | Retrieve a list of all sales (supports pagination). |
| **GET** | `/api/ventes/{id}` | Retrieve details of a specific sale by ID. |
| **GET** | `/api/ventes/{id}/facture`| Generate and retrieve the PDF invoice for a specific sale. |

### 8. Dashboards

| Role | Base Path | Description |
|------|-----------|-------------|
| **ADMIN** | `/api/admin/dashboard` | Platform-level SaaS dashboard for global users, pharmacies, subscriptions, and sales overview. |
| **PHARMACIEN** | `/api/pharmacien/dashboard` | Pharmacy operational dashboard for sales, stock, and daily metrics. |
| **SUPER_ADMIN** | `/api/superadmin/dashboard` | Global control dashboard for system initialization and SaaS configuration. |

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/admin/dashboard` | Retrieve platform-wide SaaS dashboard statistics. |
| **GET** | `/api/pharmacien/dashboard` | Retrieve pharmacy operational dashboard statistics. |
| **GET** | `/api/superadmin/dashboard` | Retrieve system-level dashboard statistics. |

---

## Postman Collection
A Postman collection is available in the root of the project: `PharmaSaaS.postman_collection.json`. It includes sample requests and environment variables (`base_url`, `jwt_token`, `vente_id`) for testing the API.
