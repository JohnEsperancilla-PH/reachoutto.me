import { ImageResponse } from 'next/og'
import { createPublicClient } from '@/lib/supabase/public'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return new Response('Username is required', { status: 400 })
    }

    // Fetch user data
    const supabase = createPublicClient()
    const { data: user } = await supabase
      .from('users')
      .select('username, bio, avatar_url')
      .eq('username', username)
      .single()

    if (!user) {
      return new Response('User not found', { status: 404 })
    }

    // Load the font
    const bricolageData = await fetch(
      new URL('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600&display=swap')
    ).then((res) => res.arrayBuffer())

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
            backgroundColor: '#1a1a1a',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '40px 60px',
              borderRadius: '20px',
              border: '1px solid #333',
              boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            }}
          >
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.username}
                width={120}
                height={120}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '60px',
                  marginBottom: '20px',
                  border: '3px solid #ffffff',
                }}
              />
            )}
            <div
              style={{
                fontSize: '48px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '10px',
                fontFamily: 'Bricolage Grotesque',
              }}
            >
              {user.username}
            </div>
            {user.bio && (
              <div
                style={{
                  fontSize: '24px',
                  color: '#cccccc',
                  textAlign: 'center',
                  maxWidth: '600px',
                  fontFamily: 'Bricolage Grotesque',
                }}
              >
                {user.bio}
              </div>
            )}
            <div
              style={{
                fontSize: '20px',
                color: '#666666',
                marginTop: '20px',
                fontFamily: 'Bricolage Grotesque',
              }}
            >
              reachoutto.me/{user.username}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Bricolage Grotesque',
            data: bricolageData,
            style: 'normal',
          },
        ],
      }
    )
  } catch (e) {
    console.error(e)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
