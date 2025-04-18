import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Voice Assistant Dashboard</h1>
          <p className="mt-2 text-gray-600">Create a new account to get started</p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
