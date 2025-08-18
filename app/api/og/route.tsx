import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const username = searchParams.get('username')
    const avatarUrl = searchParams.get('avatar')

    // Default font
    const interBold = await fetch(
      new URL('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap')
    ).then((res) => res.arrayBuffer())

    // Base styles
    const styles = {
      container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F172A',
        position: 'relative',
      },
      logo: {
        position: 'absolute',
        top: 40,
        left: 40,
        fontSize: 24,
        color: '#FFFFFF',
      },
    }

    // Handle different page types
    switch (type) {
      case 'profile':
        if (!username) {
          throw new Error('Username is required for profile OG image')
        }

        return new ImageResponse(
          (
            <div style={styles.container as any}>
              <div style={styles.logo as any}>reachoutto.me</div>
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt={username}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    marginBottom: 40,
                  }}
                />
              )}
              <h1 style={{ color: '#FFFFFF', fontSize: 72, margin: 0 }}>
                {username}
              </h1>
              <p style={{ color: '#94A3B8', fontSize: 32, margin: 0 }}>
                reachoutto.me/{username}
              </p>
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
          }
        )

      default:
        // Default home page OG image
        return new ImageResponse(
          (
            <div style={styles.container as any}>
              <div style={styles.logo as any}>reachoutto.me</div>
              <h1 style={{ color: '#FFFFFF', fontSize: 64, margin: 0, textAlign: 'center', maxWidth: '80%' }}>
                Your Digital Identity in One Link
              </h1>
              <p style={{ color: '#94A3B8', fontSize: 32, margin: '24px 0 0 0', textAlign: 'center', maxWidth: '80%' }}>
                Showcase all your important links in one beautiful page
              </p>
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
          }
        )
    }
  } catch (e) {
    console.error(e)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}
