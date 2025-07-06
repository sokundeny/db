# 📦 Database Backup and Recovery Plan

## 📝 Objective
To ensure that the database can be restored in case of system failure, accidental data loss, or corruption by maintaining daily backups and having a clear recovery procedure.

---

## 📅 Backup Plan

### 🔁 Frequency
- **Daily Backup**: A full backup of the entire database will be performed **every day** at **12:00 AM** by using task scheduler.

### 💾 Backup Method
- Use database-specific tools (e.g., `mysqldump` for MySQL ).

### 📍 Storage Location
- Backups will be stored in:  
  - Local directory: `/backups/`

### 🛡️ Retention Policy
- Older backups will be automatically deleted to save space.

---

## 🔄 Recovery Plan

### 🆘 When to Recover
- System crash
- Database corruption
- Accidental deletion or data loss

### 🔧 Recovery Steps
1. Stop the database service.
2. Restore the latest `.sql` backup file. by Running the **recover.py** script.
