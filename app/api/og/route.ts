import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username') ?? 'Unknown'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            color: 'black',
          }}
        >
          {username}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
