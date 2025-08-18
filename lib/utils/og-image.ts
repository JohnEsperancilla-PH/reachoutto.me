export function generateProfileOGImage(username: string, avatarUrl?: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    // Fallback to default OG image if Cloudinary is not configured
    return '/og-image.png';
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  // Create text overlays
  const usernameOverlay = encodeURIComponent(`text:Inter_72_bold:${username}`);
  const urlOverlay = encodeURIComponent(`text:Inter_32:reachoutto.me/${username}`);
  
  // If avatar exists, use it as a circular overlay
  const avatarTransform = avatarUrl 
    ? `/l_fetch:${encodeURIComponent(avatarUrl)},w_200,h_200,c_fill,r_max` 
    : '';

  // Build the transformation URL
  return `${baseUrl}/w_1200,h_630,c_fill,q_auto/profile-og-template` + // Base template
    `${avatarTransform}` + // Avatar if available
    `/l_${usernameOverlay},co_white,c_fit,w_800,g_center,y_0` + // Username
    `/l_${urlOverlay},co_rgb:94A3B8,c_fit,w_600,g_south_center,y_100`; // URL
}
