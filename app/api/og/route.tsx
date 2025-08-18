import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const username = (searchParams.get('username') || '').trim()
    if (!username) {
      return new Response('Missing username parameter', { status: 400 })
    }

    // Fetch SVG template from public assets
    const svgUrl = `${origin}/og-image-usernames.svg`
    const svgText = await fetch(svgUrl).then((r) => r.text())

    // Load Google Fonts (woff2) and embed via @font-face in the SVG
    async function fontFace(weight: 500 | 800) {
      const cssUrl = `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@${weight}&display=swap`
      const css = await fetch(cssUrl).then((r) => r.text())
      const match = css.match(/url\((https:[^\)]+\.woff2)\)/)
      if (!match) return ''
      const woff2Url = match[1]
      return `@font-face{font-family:'Bricolage Grotesque';src:url(${woff2Url}) format('woff2');font-weight:${weight};font-style:normal;}`
    }

    const [ff500, ff800] = await Promise.all([fontFace(500), fontFace(800)])

    // Inject @font-face rules and replace placeholders
    let svg = svgText
      .replace(/\[username\]/g, username)
      .replace(
        /<style>/,
        `<style>${ff500}${ff800}`
      )
      // Force visible colors for text (avoid /s flag; use [\s\S]*)
      .replace(/\.cls-1,\s*\.cls-2\s*{[\s\S]*?}/, (block) => {
        // switch default fill to white; we'll override cls-2 below
        return block.replace(/fill:\s*#[0-9a-fA-F]{3,6}/, 'fill: #ffffff')
      })
      .replace(/<\/style>/, `.cls-2{fill:#9ca3af;}<\/style>`)
      // Additionally add inline fill attributes for robustness
      .replace(/<text([^>]*class=\"cls-1\"[^>]*)>/, '<text$1 fill="#ffffff">')
      .replace(/<text([^>]*class=\"cls-2\"[^>]*)>/, '<text$1 fill="#9ca3af">')

    // Rasterize the SVG by embedding it as an <img> for ImageResponse
    const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`

    return new ImageResponse(
      (
        <div style={{ width: 1200, height: 630, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* background gradient layer */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, #000 55%)' }} />
          <img src={dataUri} width={1200} height={630} style={{ position: 'relative', display: 'block' }} />
        </div>
      ),
      { 
        width: 1200, 
        height: 630,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0, stale-while-revalidate=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, { status: 500 })
  }
}
