/** @jsxRuntime automatic */
/** @jsxImportSource react */

import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
      return new Response('Missing username', { 
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      })
    }

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
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            {username}
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#666666',
              textAlign: 'center',
            }}
          >
            reachoutto.me/{username}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      }
    )
  } catch (e) {
    console.error('OG Image Error:', e)
    return new Response(
      JSON.stringify({ error: 'Failed to generate image' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
