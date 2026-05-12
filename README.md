# 💊 Pharmacy Management SaaS System

A comprehensive role-based **Pharmacy Management SaaS System** built with **Spring Boot**, **PostgreSQL**, **JWT Authentication**, and **RESTful APIs**.

The platform helps pharmacies manage:
- Medicines
- Inventory
- Suppliers
- Users & Roles
- Sales & Reports
- Secure Authentication

<img width="1536" height="1024" alt="ChatGPT Image May 12, 2026, 03_08_49 PM" src="https://github.com/user-attachments/assets/fd3a712a-5455-4d4c-ace7-0ba415bbee56" />

---

# 🚀 Features

## 🔐 Authentication & Security
- JWT Authentication
- Role-Based Access Control (RBAC)
- Secure Password Encryption with BCrypt
- Protected REST APIs

---

## 👥 User Roles

### **SUPER_ADMIN**
- Manage all pharmacies
- Manage system settings
- Manage all users

### **ADMIN**
- Manage pharmacy users
- Manage inventory
- Manage suppliers and sales

### **PHARMACIEN**
- Manage medicines
- Manage stock
- Create sales and invoices
- View reports

---

# 📦 Main Modules

## 💊 Medicine Management
- Add medicines
- Update medicines
- Delete medicines
- Track expiration dates
- Manage stock quantity

---

## 🏥 Pharmacy Management
- Register pharmacies
- Manage pharmacy information
- Multi-tenant SaaS architecture

---

## 🚚 Supplier Management
- Add suppliers
- Update supplier information
- Manage supplier relationships

---

## 📊 Inventory Management
- Stock tracking
- Inventory updates
- Expiration monitoring

---

## 🧾 Sales & Invoice Management
- Create sales
- Generate invoices
- Track pharmacy revenue

---

# 🛠️ Technologies Used

- **Java 17**
- **Spring Boot**
- **Spring Security**
- **JWT Authentication**
- **Hibernate / JPA**
- **PostgreSQL**
- **Maven**
- **RESTful APIs**

---

# 🏗️ System Architecture

```bash
Client (Frontend)
       ↓
REST API (Spring Boot)
       ↓
Service Layer
       ↓
Repository Layer (JPA/Hibernate)
       ↓
PostgreSQL Database
