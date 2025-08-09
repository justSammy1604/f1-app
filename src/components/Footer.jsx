function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} F1 Viewer. All rights reserved.</p>
        <p className="text-xs text-gray-500 mt-1">This is a fan-made project and not affiliated with Formula 1.</p>
      </div>
    </footer>
  )
}

export default Footer