# KCS – School Management System (Backend)

KCS is a **multi-tenant School Management System (SMS)** backend built using Django.  
It is designed as a **SaaS-ready platform**, where multiple schools operate on a single deployment while keeping data logically isolated.

This project focuses on **strong foundations first** — authentication, tenancy, and domain separation — before feature expansion.

---

## 🎯 Project Goals

- Build a scalable backend for managing schools
- Support multiple schools (tenants) in one system
- Keep authentication and authorization simple but extensible
- Avoid early technical debt by making correct architectural decisions

---

## 🏗 Architecture Overview

### Multi-Tenancy Model
- **Single database**
- Each school is a tenant
- All non-platform users belong to exactly one school
- Platform-level users (`SUPER_ADMIN`) are not tied to any school

Data isolation is enforced at the application level using `school_id`.

---

### Authentication & Users
- Custom Django User model
- Email-based login
- One primary role per user:
  - `SUPER_ADMIN` – platform owner
  - `SCHOOL_ADMIN` – manages a school
  - `TEACHER`
  - `STUDENT`
  - `PARENT`

Roles are intentionally simple to avoid permission complexity in early stages.

---

## 📁 Project Structure

