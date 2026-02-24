# SECURE ADMIN PASSWORD SETUP

## Step 1: Create admin_users table in Neon

Run this SQL in your Neon console (https://console.neon.tech):

```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Step 2: Generate Password Hash

Run this command in your terminal to generate a hash for your password:

### Option A: Using bcryptjs (Recommended)
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log('Password Hash:', h))"
```

### Option B: Custom Password
Replace 'admin123' with your own password:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD_HERE', 10).then(h => console.log('Password Hash:', h))"
```

Copy the output hash (it will look like: $2a$10$abcdefghijklmnopqrstuvwxyz...)

---

## Step 3: Insert Admin User into Neon

In your Neon SQL Console, run:

```sql
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', 'PASTE_THE_HASH_YOU_COPIED_HERE');
```

Example:
```sql
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeomQQqNVHApSvYvgQFh6E6a5BrjfSfm2');
```

---

## Step 4: Verify Setup

Login to http://localhost:5000/login with:
- Username: `admin`
- Password: `admin123` (or your custom password)

---

## Security Features Implemented

✅ Password is hashed using bcryptjs (salted with 10 rounds)
✅ Password never stored in plain text
✅ Login authenticated via API endpoint
✅ Session tokens stored in httpOnly cookies
✅ Removed hardcoded credentials from code
✅ All changes pushed to GitHub securely
