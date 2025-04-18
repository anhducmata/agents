import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Voice Assistant Dashboard</h1>
          <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}
