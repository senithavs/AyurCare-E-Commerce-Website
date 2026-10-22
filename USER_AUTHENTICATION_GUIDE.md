# User Authentication & Database Storage Guide

Complete documentation for user authentication and database storage in AyurCare.

---

## Overview

The authentication system now uses MongoDB to store all user data securely:

- ✅ User registration with validation
- ✅ Secure login with email/password
- ✅ User profile management
- ✅ Password change functionality
- ✅ Email/username availability checking
- ✅ Password reset (forgot password)

---

## Architecture

### Data Flow

```
User Input
    ↓
Authentication UI Component
    ↓
API Endpoint
    ↓
MongoDB Database
    ↓
User Data Stored
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/signin` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| PATCH | `/api/auth/profile` | Update user profile |
| PUT | `/api/auth/profile` | Change password |
| POST | `/api/auth/check-email` | Check email availability |
| POST | `/api/auth/check-username` | Check username availability |
| POST | `/api/auth/reset-password` | Reset forgot password |

---

## User Model

```javascript
{
  _id: ObjectId,
  username: String (unique, lowercase),
  email: String (unique, lowercase),
  password: String,
  name: String,
  phone: String (optional),
  address: String (optional),
  role: String (enum: ['customer', 'admin']),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Documentation

### POST /api/auth/signup

**Register a new user**

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

**Errors:**
- 400: Missing required fields
- 400: Invalid email format
- 409: Email or username already registered

---

### POST /api/auth/signin

**Login user**

**Request:**
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+94 70 123 4567",
    "address": "123 Main Street",
    "role": "customer",
    "isActive": true
  }
}
```

**Errors:**
- 400: Missing email or password
- 401: Invalid email or password
- 403: User account is inactive

---

### GET /api/auth/profile

**Get current user profile**

**Headers:**
```
x-user-id: 507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "+94 70 123 4567",
    "address": "123 Main Street",
    "role": "customer",
    "isActive": true,
    "createdAt": "2026-10-05T15:30:00Z",
    "updatedAt": "2026-10-05T15:30:00Z"
  }
}
```

---

### PATCH /api/auth/profile

**Update user profile**

**Headers:**
```
x-user-id: 507f1f77bcf86cd799439011
```

**Request:**
```json
{
  "name": "John Doe Updated",
  "phone": "+94 70 999 9999",
  "address": "456 New Street"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    "phone": "+94 70 999 9999",
    "address": "456 New Street"
  }
}
```

**Note:** Cannot update email or username through this endpoint

---

### PUT /api/auth/profile

**Change password**

**Headers:**
```
x-user-id: 507f1f77bcf86cd799439011
```

**Request:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_secure_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors:**
- 401: Current password is incorrect

---

### POST /api/auth/check-email

**Check if email is available**

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "exists": false
}
```

---

### POST /api/auth/check-username

**Check if username is available**

**Request:**
```json
{
  "username": "john_doe"
}
```

**Response (200 OK):**
```json
{
  "exists": false
}
```

---

### POST /api/auth/reset-password

**Reset password (forgot password)**

**Request:**
```json
{
  "email": "john@example.com",
  "newPassword": "new_secure_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Errors:**
- 404: No account found with this email

---

## AuthContext Functions

The updated AuthContext provides these functions:

### signUp(userData)
```javascript
const { success, user, error } = await signUp({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'secure_password',
  name: 'John Doe'
});
```

### signIn(email, password, rememberMe)
```javascript
const { success, user, error } = await signIn(
  'john@example.com',
  'secure_password',
  true
);
```

### updateProfile(updates)
```javascript
const { success, user, error } = await updateProfile({
  name: 'John Updated',
  phone: '+94 70 999 9999',
  address: '456 New Street'
});
```

### changePassword(currentPassword, newPassword)
```javascript
const { success, error } = await changePassword(
  'old_password',
  'new_password'
);
```

### resetPassword(email, newPassword)
```javascript
const { success, error } = await resetPassword(
  'john@example.com',
  'new_password'
);
```

### getUserById(userId)
```javascript
const user = await getUserById('507f1f77bcf86cd799439011');
```

### emailExists(email)
```javascript
const exists = await emailExists('john@example.com');
```

### usernameExists(username)
```javascript
const exists = await usernameExists('john_doe');
```

---

## User Flow Examples

### Example 1: User Registration

```javascript
import { useAuth } from '@/lib/AuthContext';

export default function SignUpPage() {
  const { signUp, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signUp(formData);
    
    if (result.success) {
      console.log('User registered:', result.user);
      // Redirect to home or dashboard
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={(e) => setFormData({...formData, username: e.target.value})} />
      <input name="email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <input name="password" type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
      <input name="name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <button type="submit" disabled={isLoading}>{isLoading ? 'Registering...' : 'Sign Up'}</button>
    </form>
  );
}
```

### Example 2: User Login

```javascript
import { useAuth } from '@/lib/AuthContext';

export default function SignInPage() {
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(email, password, rememberMe);
    
    if (result.success) {
      console.log('Logged in:', result.user);
      // Redirect to dashboard
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <label>
        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
        Remember me
      </label>
      <button type="submit" disabled={isLoading}>{isLoading ? 'Signing in...' : 'Sign In'}</button>
    </form>
  );
}
```

### Example 3: Update Profile

```javascript
import { useAuth } from '@/lib/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    
    if (result.success) {
      console.log('Profile updated:', result.user);
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
      <input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
      <button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Profile'}</button>
    </form>
  );
}
```

---

## Database Storage

### What's Stored in MongoDB

All user data is stored in the MongoDB `users` collection:

```javascript
db.users.find()
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "username": "admin",
  "email": "admin@ayurcare.com",
  "password": "admin123",
  "name": "Admin User",
  "phone": "+94 70 000 0000",
  "address": "Colombo, Sri Lanka",
  "role": "admin",
  "isActive": true,
  "createdAt": ISODate("2026-10-05T21:56:05.000Z"),
  "updatedAt": ISODate("2026-10-05T21:56:05.000Z"),
  "__v": 0
}
```

### Why MongoDB Over localStorage

| Feature | localStorage | MongoDB |
|---------|-------------|---------|
| Persistence | Browser only | Server + Database |
| Capacity | 5-10MB | Unlimited |
| Security | No encryption | Encrypted in transit |
| Sharing | Single device | Multiple devices |
| Backup | No | Yes |
| Scalability | Limited | Unlimited |
| Concurrent Users | 1 | Many |
| Reliability | Session-based | Permanent |

---

## Security Best Practices

### ✅ Implemented

1. **Password Validation**: All passwords are validated before storage
2. **Input Validation**: Email, username, and other fields are validated
3. **Database Queries**: Using MongoDB safe queries (no SQL injection)
4. **No Sensitive Data in Response**: Passwords never sent to client
5. **Lowercase Normalization**: Email/username stored in lowercase

### ⚠️ To Implement (Production)

1. **Password Hashing**: Use `bcryptjs` to hash passwords
   ```javascript
   import bcrypt from 'bcryptjs';
   
   const hashedPassword = await bcrypt.hash(password, 10);
   user.password = hashedPassword;
   ```

2. **JWT Tokens**: Replace localStorage with JWT authentication
   ```javascript
   import jwt from 'jsonwebtoken';
   
   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
   ```

3. **Rate Limiting**: Prevent brute force attacks
4. **HTTPS Only**: Ensure all connections are encrypted
5. **CORS Security**: Restrict API access to authorized domains
6. **Session Timeout**: Expire sessions after inactivity

---

## Next Steps

### Short Term
- ✅ Store users in MongoDB (DONE)
- ⬜ Add password hashing with bcryptjs
- ⬜ Implement JWT token authentication

### Medium Term
- ⬜ Add email verification on signup
- ⬜ Implement 2FA (Two-Factor Authentication)
- ⬜ Add session management

### Long Term
- ⬜ OAuth integration (Google, Facebook)
- ⬜ API key management for admin
- ⬜ Audit logs for user actions

---

## Testing

### Test Admin Login
```
Username: admin
Password: admin123
Email: admin@ayurcare.com
```

### Test Customer Registration
1. Go to signup page
2. Enter unique username and email
3. Create account
4. Login with new credentials

### Test Profile Update
1. Login as user
2. Go to profile page
3. Update name, phone, address
4. Verify changes saved in database

---

## Support

For authentication-related issues:
- Check MongoDB connection in server logs
- Verify API endpoints are responding
- Ensure user data is valid before submission
- Check browser console for errors

---

**Last Updated:** October 5, 2026  
**Status:** Complete & Ready for Testing
