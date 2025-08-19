import { Metadata } from 'next'
import { generateUserMetadata } from './metadata'

type MetadataProps = {
  params: { username: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

type LayoutProps = {
  children: React.ReactNode
  params: { username: string }
}

export async function generateMetadata(
  { params }: MetadataProps
): Promise<Metadata> {
  return generateUserMetadata(params.username)
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <section>
      {children}
    </section>
  )
}
