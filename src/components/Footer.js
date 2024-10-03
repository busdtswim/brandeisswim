export default function Footer() {
    return (
      <footer className="bg-blue-600 text-white p-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} BRANDEIS swimming lessons. All rights reserved.</p>
        </div>
      </footer>
    )
  }