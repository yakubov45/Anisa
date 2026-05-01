import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-800">404 - Not Found</h2>
            <p className="text-gray-500 mb-4">Could not find requested resource</p>
            <Link href="/" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow">
                Return Home
            </Link>
        </div>
    )
}
