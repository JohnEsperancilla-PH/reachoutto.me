import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest
) {
  const { username } = request.nextUrl.searchParams;
  if (!params.username) {
    return new Response('Missing username parameter', { 
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  try {
    // Make sure we have a valid username
    const username = decodeURIComponent(params.username)

    // Simple template that's fast to render
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            padding: '40px 50px',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '20px',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              <span style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#000',
              }}>
                reachoutto.me
              </span>
              <span style={{
                fontSize: '16px',
                color: '#6b7280',
              }}>
                Your Digital Identity
              </span>
            </div>
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '16px',
              fontSize: '14px',
              color: '#374151',
            }}>
              PROFILE
            </div>
          </div>

          {/* Main Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            gap: '16px',
          }}>
            <div style={{
              fontSize: '60px',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '8px',
            }}>
              {username}
            </div>
            <div style={{
              fontSize: '24px',
              color: '#6b7280',
            }}>
              reachoutto.me/{username}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // No custom font loading for faster generation
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        },
      },
    )
  } catch (error: any) {
    console.error('OG Image Error:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
