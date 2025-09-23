/**
 * Avatar utility functions for handling OAuth provider images
 * Ensures consistent avatar handling across all components
 */

/**
 * Gets user initials from a name string
 * @param name - The user's full name
 * @returns Initials string (max 2 characters)
 */
export function getUserInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Validates and returns avatar image URL for OAuth providers
 * Handles Google, Microsoft, and other OAuth provider images
 * @param userImage - The user's image URL from session
 * @returns Valid image URL or undefined
 */
export function getAvatarImage(userImage?: string | null): string | undefined {
  // Return the image URL if it exists and is valid
  if (userImage && userImage.trim() !== '') {
    return userImage;
  }

  return undefined;
}

/**
 * Handles avatar image load errors
 * Logs warnings for debugging OAuth provider image issues
 * @param imageUrl - The failed image URL
 */
export function handleAvatarError(imageUrl?: string | null): void {
  console.warn('Avatar image failed to load:', imageUrl);
}

/**
 * Checks if an image URL is from a known OAuth provider
 * @param imageUrl - The image URL to check
 * @returns Object with provider info
 */
export function getOAuthProviderInfo(imageUrl?: string | null): {
  provider: 'google' | 'microsoft' | 'other' | 'unknown';
  isOAuth: boolean;
} {
  if (!imageUrl) {
    return { provider: 'unknown', isOAuth: false };
  }

  const url = imageUrl.toLowerCase();

  if (url.includes('googleusercontent.com') || url.includes('google.com')) {
    return { provider: 'google', isOAuth: true };
  }

  if (url.includes('graph.microsoft.com') || url.includes('microsoft.com')) {
    return { provider: 'microsoft', isOAuth: true };
  }

  // Check for other common OAuth providers
  if (url.includes('github.com') || url.includes('facebook.com') || url.includes('linkedin.com')) {
    return { provider: 'other', isOAuth: true };
  }

  return { provider: 'unknown', isOAuth: false };
}

/**
 * Gets a fallback avatar URL for OAuth providers
 * @param provider - The OAuth provider
 * @param userEmail - User's email address
 * @returns Fallback avatar URL or undefined
 */
export function getFallbackAvatarUrl(
  provider: 'google' | 'microsoft' | 'other' | 'unknown',
  userEmail?: string | null
): string | undefined {
  if (!userEmail) return undefined;

  switch (provider) {
    case 'google':
      // Google's Gravatar-like service
      return `https://www.gravatar.com/avatar/${encodeURIComponent(userEmail)}?d=identicon&s=40`;
    case 'microsoft':
      // Microsoft Graph API fallback
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail)}&size=40&background=random`;
    default:
      return undefined;
  }
}
