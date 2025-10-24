# 🔍 Debug Image Loading Issues

## What to Check Now

### 1. Test the Flow & Check Console

1. Go to `http://localhost:3000/` (admin page)
2. Upload an image
3. **Check console logs** - you should see:
   ```
   Uploaded file path: photos/xxxxx-timestamp.jpg
   Generated public URL: https://fiznydjywflsffleeoop.supabase.co/storage/v1/object/public/overlays/photos/xxxxx.jpg
   Shareable link: http://localhost:3000/celebrate?photo=...
   ```

4. Copy the **public URL** (not the shareable link) and open it directly in your browser
   - If it loads ✅ - Image exists and is accessible
   - If it fails ❌ - Bucket configuration issue

### 2. Common Causes of "Bad Request"

#### A. Bucket Not Truly Public
Even if you set it to public, the RLS policies might be blocking.

**Fix: Check in Supabase Dashboard**
1. Go to Storage → overlays
2. Ensure "Public bucket" toggle is **ON**
3. Go to Policies tab
4. You should see TWO enabled policies:
   - Allow public uploads (INSERT)
   - Allow public downloads (SELECT)

#### B. Wrong URL Format
The public URL should look like:
```
https://[PROJECT].supabase.co/storage/v1/object/public/overlays/photos/[filename]
```

**Check for:**
- No double slashes (`//`)
- Correct bucket name (`overlays`)
- File actually exists in that path

#### C. CORS Issues
If the preview image loads but the overlay doesn't, it might be CORS.

**Fix: Add CORS policy in Supabase**
1. Go to Storage → overlays → Configuration
2. Add CORS rule:
   ```json
   {
     "allowedOrigins": ["*"],
     "allowedMethods": ["GET"]
   }
   ```

### 3. Test Image URL Directly

After uploading, you'll see console logs. Copy the "Generated public URL" and:

```bash
# Test with curl
curl -I "https://your-url-here"
```

Should return `200 OK`. If not:
- `403 Forbidden` = Policies are wrong
- `404 Not Found` = File doesn't exist or wrong path
- `400 Bad Request` = URL is malformed

### 4. Check Browser Network Tab

1. Open DevTools → Network tab
2. Trigger the photo overlay
3. Look for the image request
4. Check the:
   - Request URL (is it correct?)
   - Status Code (what error?)
   - Response (any error message?)

### 5. Try Simplified Test

Let's bypass the URL parameter system temporarily:

**In BirthdayPage.js**, add a hardcoded test URL:

```javascript
// Add this at the top after imports
const TEST_IMAGE = 'https://your-actual-supabase-url-here.jpg';

// Then in the component, temporarily use:
const photoUrl = TEST_IMAGE; // Comment out: searchParams.get('photo');
```

If the hardcoded URL works, the issue is with encoding/decoding.  
If it still fails, the issue is with Supabase access.

## 🎯 Most Likely Issues

### Issue 1: Bucket Policies Not Working

**Symptom:** Preview image loads in admin, but not in overlay

**Solution:**
```sql
-- Run this in Supabase SQL Editor

-- Delete existing policies
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;

-- Create fresh policies
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'overlays');
```

This single policy allows all operations for the `overlays` bucket.

### Issue 2: File Path Issues

**Check the file exists:**
1. Go to Supabase Dashboard
2. Storage → overlays
3. Look inside `photos/` folder
4. Verify your file is there

### Issue 3: URL Encoding Problem

The URL gets encoded when creating the link:
```javascript
encodeURIComponent('https://example.com/file.jpg')
// becomes: https%3A%2F%2Fexample.com%2Ffile.jpg
```

Then decoded when displaying:
```javascript
decodeURIComponent('https%3A%2F%2Fexample.com%2Ffile.jpg')
// back to: https://example.com/file.jpg
```

**To debug:** Check console logs for both the encoded and decoded versions.

## 🧪 Quick Test Commands

### Test 1: Check if image is publicly accessible
```bash
# Replace with your actual URL
curl "https://fiznydjywflsffleeoop.supabase.co/storage/v1/object/public/overlays/photos/your-file.jpg"
```

Should download the image data. If it returns an error, the issue is on Supabase side.

### Test 2: Verify bucket is public
In Supabase Dashboard:
- Storage → overlays
- Should show **"Public"** badge
- If it shows **"Private"**, click settings and toggle to public

### Test 3: Check browser console
After triggering the overlay, console should show:
```
Photo URL from params: https%3A%2F%2F...
Decoded URL: https://fiznydjywflsffleeoop.supabase.co/...
PhotoOverlay received URL: https://fiznydjywflsffleeoop.supabase.co/...
Image loaded successfully  ← This means it worked!
```

If you see:
```
Image failed to load: https://...
```

Then check the Network tab for the actual error.

## 🔧 Emergency Fix

If nothing works, try this simplified policy in SQL Editor:

```sql
-- Nuclear option: Allow everything for overlays bucket
CREATE POLICY "allow_all_overlays"
ON storage.objects
FOR ALL
USING (bucket_id = 'overlays')
WITH CHECK (bucket_id = 'overlays');
```

## 📝 Checklist

- [ ] Uploaded image shows in admin preview
- [ ] Console shows "Generated public URL"
- [ ] Public URL works when opened directly in browser
- [ ] Bucket is marked as "Public" in dashboard
- [ ] Both INSERT and SELECT policies exist
- [ ] Console logs show photo URL in celebrate page
- [ ] Network tab shows image request
- [ ] Check Network tab status code
- [ ] Image loads in PhotoOverlay component

## 🆘 Still Not Working?

Share these details:
1. The console log output (especially URLs)
2. The Network tab screenshot showing the failed request
3. The Supabase bucket configuration screenshot
4. Whether the image URL works when opened directly

This will help identify the exact issue!

