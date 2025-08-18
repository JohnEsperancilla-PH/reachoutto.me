import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // Correctly get the username from search params
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
      return new Response('Missing username', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      })
    }

    // Very simple image generation to test
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'white',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {username}
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#666',
              marginTop: '20px',
            }}
          >
            reachoutto.me/{username}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error('OG Image Error:', e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
