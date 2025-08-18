import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    const name = searchParams.get('name') || username
    const bio = searchParams.get('bio')
    const avatar = searchParams.get('avatar')

    if (!username) {
      return new Response('Missing username parameter', { status: 400 })
    }

    // We'll use system fonts for better reliability

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
            backgroundColor: '#000000',
            backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, #000000 50%)',
            position: 'relative',
          }}
        >
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
              gap: '24px',
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

            {/* Name */}
            {name && name !== username && (
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: '600',
                  color: '#ffffff',
                  lineHeight: 1.2,
                  maxWidth: '600px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {name}
              </div>
            )}

            {/* Username */}
            <div
              style={{
                fontSize: name && name !== username ? '32px' : '48px',
                fontWeight: name && name !== username ? '400' : '600',
                color: name && name !== username ? '#a1a1aa' : '#ffffff',
                lineHeight: 1.2,
                fontFamily: 'system-ui, -apple-system, sans-serif',
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
                  fontFamily: 'system-ui, -apple-system, sans-serif',
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
                fontFamily: 'system-ui, -apple-system, sans-serif',
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
