'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const username = pathname.split('/').pop() || ''

  useEffect(() => {
    // Update document title dynamically
    if (username) {
      document.title = `${username} | reachoutto.me`
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', `Check out ${username}'s links on reachoutto.me`)
      }
      
      // Update OG title
      const ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', `${username} | reachoutto.me`)
      }
      
      // Update OG description
      const ogDescription = document.querySelector('meta[property="og:description"]')
      if (ogDescription) {
        ogDescription.setAttribute('content', `Check out ${username}'s links on reachoutto.me`)
      }
      
      // Update Twitter title
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) {
        twitterTitle.setAttribute('content', `${username} | reachoutto.me`)
      }
      
      // Update Twitter description
      const twitterDescription = document.querySelector('meta[name="twitter:description"]')
      if (twitterDescription) {
        twitterDescription.setAttribute('content', `Check out ${username}'s links on reachoutto.me`)
      }
    }
  }, [username])

  return <>{children}</>
}