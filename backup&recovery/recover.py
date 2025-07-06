import subprocess

def restore_database(host, user, password, db_name, backup_file):
    # Step 1: Recreate the empty database using mysql.exe with -e to execute SQL command
    create_db_cmd = [
        r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        f"--host={host}",
        f"--user={user}",
        f"--password={password}",
        "-e", f"CREATE DATABASE IF NOT EXISTS {db_name};"
    ]
    subprocess.run(create_db_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Step 2: Restore the database using the .sql backup
    restore_cmd = [
        r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        f"--host={host}",
        f"--user={user}",
        f"--password={password}",
        db_name
    ]

    with open(backup_file, "r", encoding="utf-8") as infile:
        result = subprocess.run(restore_cmd, stdin=infile, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if result.returncode == 0:
        print(f"Restored database '{db_name}' from {backup_file}")
    else:
        print(f"Failed to restore '{db_name}':", result.stderr.decode())

# Correct database names and matching backup files
restore_database("localhost", "root", "", "sms", "backups/sms_backup_.sql")
