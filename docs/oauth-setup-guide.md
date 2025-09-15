# OAuth Setup Guide for Aegrid

## Google OAuth Configuration

The Google sign-in button is not working because the OAuth configuration needs to be properly set up in Google Cloud Console.

### Required Steps:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project or create a new one

2. **Enable Required APIs (Optional)**
   - Go to "APIs & Services" > "Library"
   - For basic OAuth sign-in, you typically don't need to enable additional APIs
   - If you need extended user profile data, you can enable:
     - "People API" (for detailed user profile information)
   - Note: Google OAuth2 is built-in and doesn't need to be enabled separately
   - Most OAuth sign-in flows work with just the basic OAuth2 scopes

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Aegrid"
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if needed

4. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Aegrid Web Client"
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     https://yourdomain.com/api/auth/callback/google
     ```

5. **Update Environment Variables**
   - Copy the Client ID and Client Secret
   - Update your `.env` file:
     ```
     GOOGLE_CLIENT_ID="your-client-id-here"
     GOOGLE_CLIENT_SECRET="your-client-secret-here"
     ```

### Common Issues:

1. **Redirect URI Mismatch**
   - Ensure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
   - No trailing slashes or extra characters

2. **OAuth Consent Screen Not Configured**
   - Make sure the OAuth consent screen is properly configured
   - Add your email as a test user if using "External" user type

3. **Missing Scopes**
   - Ensure these scopes are added: `email`, `profile`, `openid`

4. **API Not Enabled**
   - For basic OAuth sign-in, no additional APIs need to be enabled
   - Google OAuth2 is built-in and works automatically
   - Only enable People API if you need extended user profile data

## Microsoft Azure AD Configuration

For Microsoft sign-in, you need to configure Azure AD:

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com/
   - Navigate to "Azure Active Directory"

2. **Register Application**
   - Go to "App registrations" > "New registration"
   - Name: "Aegrid"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`

3. **Configure Authentication**
   - Go to "Authentication" in your app registration
   - Add platform: "Web"
   - Redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/azure-ad
     https://yourdomain.com/api/auth/callback/azure-ad
     ```

4. **Update Environment Variables**
   ```
   MICROSOFT_CLIENT_ID="your-client-id-here"
   MICROSOFT_CLIENT_SECRET="your-client-secret-here"
   AZURE_AD_TENANT_ID="common"
   ```

## Testing OAuth

After configuration:

1. Restart your development server
2. Visit `/auth/sign-in`
3. Click the Google/Microsoft button
4. You should be redirected to the OAuth provider
5. After authentication, you'll be redirected back to `/dashboard`

## Troubleshooting

- Check browser console for errors
- Verify environment variables are loaded
- Ensure redirect URIs match exactly
- Check OAuth consent screen configuration
- Verify APIs are enabled in Google Cloud Console

## Security Notes

- Never commit OAuth credentials to version control
- Use environment variables for all sensitive configuration
- Regularly rotate OAuth secrets
- Monitor OAuth usage in provider dashboards
