import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cooking Kebabs in sun light!',
  description: 'Kebabs kebabs kebabs!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='w-full h-full' lang="en">
      <body className={`${inter.className} h-full w-full bg-white bg-no-repeat`}>{children}</body>
    </html>
  )
}
