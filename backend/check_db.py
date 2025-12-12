import sqlite3

conn = sqlite3.connect('gym.db')
cursor = conn.cursor()

# Check usuario table
cursor.execute('SELECT email, full_name, role, is_active FROM usuario')
users = cursor.fetchall()
print("Users in 'usuario' table:")
for user in users:
    print(f"  Email: {user[0]}, Name: {user[1]}, Role: {user[2]}, Active: {user[3]}")

conn.close()
