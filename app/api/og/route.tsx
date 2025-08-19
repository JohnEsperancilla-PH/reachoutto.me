import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createEdgeClient } from '@/lib/supabase/edge'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username') || 'test'

  try {
    // Load the Bricolage Grotesque font
    const fontData = await fetch(
      new URL('../../../public/fonts/BricolageGrotesque_24pt-Bold.ttf', import.meta.url)
    ).then((res) => res.arrayBuffer()).catch(() => null)

    // Fetch user data including avatar_url
    const supabase = createEdgeClient()
    const { data: user } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('username', username)
      .single()

    let profileImageData = null
    if (user?.avatar_url) {
      try {
        // If avatar_url is a full URL, use it directly
        if (user.avatar_url.startsWith('http')) {
          profileImageData = await fetch(user.avatar_url).then(res => res.arrayBuffer())
        } else {
          // If avatar_url is just a file path, get the public URL from storage
          const { data: { publicUrl } } = supabase.storage
            .from('profiles')
            .getPublicUrl(user.avatar_url)
          
          if (publicUrl) {
            profileImageData = await fetch(publicUrl).then(res => res.arrayBuffer())
          }
        }
      } catch (e) {
        console.warn('Failed to fetch profile image:', e)
      }
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
            backgroundColor: 'white',
            fontFamily: fontData ? 'Bricolage Grotesque' : 'system-ui, sans-serif',
            padding: '60px',
          }}
        >
          {/* Profile Image */}
          {profileImageData ? (
            <img
              src={`data:image/jpeg;base64,${Buffer.from(profileImageData).toString('base64')}`}
              style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                objectFit: 'cover',
                marginBottom: 20,
                border: '4px solid #d1d5db',
              }}
            />
          ) : (
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                border: '4px solid #d1d5db',
              }}
            >
              <div style={{ fontSize: 65, color: '#6b7280' }}>
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* @username */}
          <h1 
            style={{ 
              fontSize: 80, 
              color: 'black', 
              margin: 0,
              marginBottom: 10,
              fontWeight: 800,
              fontFamily: fontData ? 'Bricolage Grotesque' : 'system-ui, sans-serif',
            }}
          >
            @{username}
          </h1>

          {/* reachoutto.me/username */}
          <p 
            style={{ 
              fontSize: 40, 
              color: '#6b7280', 
              margin: 0,
              fontWeight: 500,
              fontFamily: fontData ? 'Bricolage Grotesque' : 'system-ui, sans-serif',
            }}
          >
            reachoutto.me/{username}
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontData ? [
          {
            name: 'Bricolage Grotesque',
            data: fontData,
            style: 'normal',
            weight: 700,
          },
        ] : [],
      }
    )
  } catch (e) {
    console.error('OG Image generation error:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
