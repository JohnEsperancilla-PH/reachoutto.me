# OG Image Generator Guide

The reachoutto.me application now includes dynamic OG (Open Graph) image generation for public profile pages.

## How It Works

When someone shares a public profile link (e.g., `https://your-domain.com/johndoe`), social media platforms will automatically display a custom-generated image showing:

- **User's Avatar** (or initial if no avatar)
- **Username** (@johndoe)
- **Bio** (if available, truncated to 120 characters)
- **Branded Footer** with reachoutto.me logo
- **Modern Design** with gradient background and decorative elements

## API Endpoint

The OG images are generated at: `/api/og`

### Parameters:
- `username` (required): The user's username
- `bio` (optional): User's bio text
- `avatar` (optional): URL to user's avatar image

### Example URLs:
```
/api/og?username=johndoe
/api/og?username=johndoe&bio=Full-stack developer and designer
/api/og?username=johndoe&bio=Developer&avatar=https://example.com/avatar.jpg
```

## Automatic Integration

The OG images are automatically generated and included in the metadata for all public profile pages. No manual setup required!

### Social Media Platforms Supported:
- **Twitter/X**: Large image cards
- **Facebook**: Link previews
- **LinkedIn**: Rich previews
- **Discord**: Embedded previews
- **Slack**: Link unfurling
- **WhatsApp**: Link previews

## Design Specifications

- **Dimensions**: 1200x630px (optimal for all platforms)
- **Format**: PNG
- **Background**: Black gradient with decorative elements
- **Text**: White text with proper contrast
- **Avatar**: 120px circle with border
- **Runtime**: Edge runtime for fast generation

## Environment Variables

The OG image generator automatically detects the correct base URL:

1. **NEXT_PUBLIC_SITE_URL** (if set)
2. **VERCEL_URL** (auto-detected on Vercel)
3. **localhost:3000** (development fallback)

## Testing

To test the OG image generation:

1. **Direct API call**: Visit `/api/og?username=testuser` in your browser
2. **Social media**: Share a profile link on Twitter/Facebook to see the preview
3. **Debug tools**: Use social media debug tools:
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

## Performance

- **Edge Runtime**: Fast generation using Vercel's edge functions
- **Caching**: Images are cached by social media platforms
- **Lightweight**: Minimal dependencies and optimized rendering
- **Fallback**: Graceful degradation if image generation fails

## Customization

The OG image design can be customized by modifying `/app/api/og/route.tsx`:

- Colors and gradients
- Typography and sizing
- Layout and positioning
- Decorative elements
- Branding elements

## Troubleshooting

### Image Not Showing:
1. Check that the profile exists and is public
2. Verify environment variables are set correctly
3. Test the API endpoint directly
4. Clear social media cache using debug tools

### Build Errors:
1. Ensure `@vercel/og` package is installed
2. Check that Edge Runtime is properly configured
3. Verify all required parameters are provided
