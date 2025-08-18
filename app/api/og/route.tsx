import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    const bio = searchParams.get('bio')
    const avatar = searchParams.get('avatar')

    if (!username) {
      return new Response('Missing username parameter', { status: 400 })
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Solid background layer to avoid transparent/white output in some viewers */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000',
            }}
          />
          {/* Optional subtle gradient on top of solid black */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, #000 50%)',
              opacity: 0.9,
            }}
          />
          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '10%',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #06b6d4, #3b82f6)',
              opacity: 0.1,
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '32px',
              position: 'relative',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: avatar
                  ? `url(${avatar})`
                  : 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '4px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: '600',
                color: '#ffffff',
              }}
            >
              {!avatar && (username?.charAt(0).toUpperCase() || 'U')}
            </div>

            {/* Username */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: '600',
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              @{username}
            </div>

            {/* Bio */}
            {bio && (
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '400',
                  color: '#d4d4d8',
                  lineHeight: 1.4,
                  maxWidth: '600px',
                  textAlign: 'center',
                }}
              >
                {bio.length > 120 ? bio.substring(0, 120) + '...' : bio}
              </div>
            )}

            {/* Footer */}
            <div
              style={{
                marginTop: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '20px',
                color: '#71717a',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  background: '#6366f1',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🔗
              </div>
              reachoutto.me
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
