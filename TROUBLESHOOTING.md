# Troubleshooting Guide

## Issue: PRs and Activities Not Showing

### Root Causes Found:

1. **Default Filter Set to "In Progress"**: The app was filtering to show only "in-progress" PRs by default, hiding completed PRs
2. **Category Mismatch**: Some PRs had categories not in the dropdown (now fixed)
3. **No Error Messages**: Silent failures made it hard to diagnose issues

### ✅ Fixes Applied:

1. **Changed Default Filter**: Now defaults to "All PRs" instead of "In Progress"
2. **Added Debug Logging**: Console logs now show:
   - API connection attempts
   - Response data
   - Number of PRs/activities loaded
   - Error details
3. **Better Error Handling**: Shows toast notifications for connection issues
4. **Fallback Data**: Loads sample PRs if backend connection fails

### How to Debug:

1. **Open Browser Console** (F12 or Cmd+Option+I)
2. **Look for these logs**:
   ```
   ✅ PRs loaded successfully: X PRs found
   ✅ Activities loaded successfully: X activities found
   ```
3. **Check for errors**:
   ```
   ❌ Error loading PRs: [error message]
   ❌ Backend connection failed
   ```

### Common Issues:

#### Backend Not Running:
- **Symptom**: "Backend connection failed" toast
- **Solution**: Start backend with `npm run dev` in backend folder
- **Check**: Visit http://localhost:5001/api/prs in browser

#### MongoDB Not Connected:
- **Symptom**: Backend shows "Server will run without database connection"
- **Solution**: 
  - Check MongoDB is running
  - Verify MONGODB_URI in backend/.env
  - Test connection: `mongosh` in terminal

#### PRs Not Showing:
- **Symptom**: Empty PR list despite backend working
- **Solution**:
  - Check filter is set to "All PRs"
  - Check department filter is set to "All Departments"
  - Look at browser console for loaded data
  - Verify PR categories match dropdown options

#### CORS Errors:
- **Symptom**: "CORS policy" errors in console
- **Solution**: Backend already configured for localhost:3000
- **Check**: Verify frontend is running on port 3000

### Testing Checklist:

- [ ] Backend running on port 5001
- [ ] MongoDB connected successfully
- [ ] Frontend running on port 3000
- [ ] Browser console shows "✅ PRs loaded successfully"
- [ ] Browser console shows "✅ Activities loaded successfully"
- [ ] Filter set to "All PRs"
- [ ] Department filter set to "All Departments"

### Quick Test Commands:

```bash
# Test backend PRs endpoint
curl http://localhost:5001/api/prs

# Test backend activities endpoint
curl http://localhost:5001/api/activities

# Check MongoDB connection
mongosh --eval "db.adminCommand('ping')"
```

### Expected Console Output:

```
Attempting to load PRs from API...
API URL: http://localhost:5001/api
API Response: {success: true, count: 1, data: Array(1)}
✅ PRs loaded successfully: 1 PRs found
PR Data: [{id: "003", title: "hello waleed cutoo u so smart", ...}]

Attempting to load activities from API...
Activities API Response: {success: true, count: 13, data: Array(13)}
✅ Activities loaded successfully: 13 activities found
```