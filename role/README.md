# 🛡️ Database Roles – Direct Database Access Only

This document defines internal roles that access the **MySQL database directly** using tools like MySQL Workbench, DBeaver, or the command line. These roles **do not interact with the system through a web interface**.

---

## 🔐 Role Definitions

### 1. 🟥 `db_admin` – Database Administrator

- **Purpose**: Full control over the database system for maintenance, updates, and security.
- **Who Uses It**: Senior backend developers or DBAs.
- **Access**:
  - ALL privileges on all tables, views, users, and structures.
  - Can manage user roles and perform backups or restores.

---

### 2. 🟦 `data_viewer` – Read-Only Analyst

- **Purpose**: Safely access database content for analysis and reporting without modifying data.
- **Who Uses It**: Developers, analysts, QA engineers.
- **Access**:
  - `SELECT` on all tables.
  - Cannot modify or delete any data.
  - Cannot export data to files.

---

### 3. 🟪 `auditor` – Auditor / Reporting Agent

- **Purpose**: Inspect database records and export them for compliance or external reporting.
- **Who Uses It**: Financial auditors, compliance officers, or inspection teams.
- **Access**:
  - `SELECT` on all tables.
  - `FILE` privilege for exporting data using `INTO OUTFILE`.
  - Cannot write, update, or delete data.

