import { generateUserMetadata } from './metadata'

export const generateMetadata = async ({
  params: { username },
}: {
  params: { username: string }
}) => {
  return generateUserMetadata(username)
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
