import { Metadata } from 'next'
import { generateUserMetadata } from './metadata'

type Props = {
  children: React.ReactNode
  params: {
    username: string
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateUserMetadata(props.params.username)
}

export default async function Layout(props: Props) {
  return <>{props.children}</>
}
