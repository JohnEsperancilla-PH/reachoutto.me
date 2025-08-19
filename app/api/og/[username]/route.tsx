import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'

export const runtime = 'edge'

// Cache the response for 1 week
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username

    if (!username) {
      return new Response('Username is required', { status: 400 })
    }

    // Revalidate the path after 1 week
    revalidatePath(`/api/og/${username}`)

    // Load the Inter font
    const interBold = await fetch(
      new URL('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap')
    ).then((res) => res.arrayBuffer())

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            position: 'relative',
          }}
        >
          {/* Logo */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              fontSize: 24,
              color: '#FFFFFF',
              opacity: 0.8,
            }}
          >
            reachoutto.me
          </div>

          {/* Decorative Elements */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 300,
              height: 300,
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '0 0 0 100%',
            }}
          />

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 20,
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {username}
            </h1>
            <p
              style={{
                fontSize: 32,
                color: '#94A3B8',
                margin: 0,
                opacity: 0.9,
              }}
            >
              reachoutto.me/{username}
            </p>
          </div>

          {/* Bottom Decorative Element */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 400,
              height: 150,
              background: 'radial-gradient(circle at bottom left, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '0 100% 0 0',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interBold,
            weight: 700,
          },
        ],
        // Add cache headers
        headers: {
          'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
          'Vercel-CDN-Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
