import './globals.css'

export const metadata = {
  title: 'Brandeis Swimming Lessons',
  description: 'Learn to swim with Brandeis University',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}