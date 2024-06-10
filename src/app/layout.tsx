import './globals.css'
import Head from 'next/head'

export const metadata = {
  title: 'Next.js + Three.js',
  description: 'A minimal starter for Nextjs + React-three-fiber and Threejs.',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}

      <head />
      <Head>
        <title>XREN Robotics</title>
        <meta
          httpEquiv='Content-Security-Policy'
          content="default-src 'self'; img-src 'self' https://example.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        />
      </Head>
      <body>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
        {children}
      </body>
    </html>
  )
}
