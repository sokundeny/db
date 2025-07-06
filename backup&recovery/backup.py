import subprocess
import os

def backup_database(host, user, password, db_name, output_dir):
    filename = f"{db_name}_backup_.sql"
    output_file = os.path.join(output_dir, filename)

    command = [
        r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
        f"--host={host}",
        f"--user={user}",
        f"--password={password}",
        db_name,
        f"--result-file={output_file}"
    ]

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    if result.returncode == 0:
        print(f"Backup successful: {output_file}")
    else:
        print(f"Error backing up {db_name}: {result.stderr.decode('utf-8')}")


def main():
    host = "localhost"
    user = "root"
    password = ""
    databases = "sms"

    output_dir = "backups"
    os.makedirs(output_dir, exist_ok=True)

    backup_database(host, user, password, databases, output_dir)

if __name__=="__main__":
    main()