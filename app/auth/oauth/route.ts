import { NextResponse, type NextRequest } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectParam = searchParams.get('redirect')
  
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()
        
        // If profile doesn't exist or onboarding not completed, redirect to onboarding
        if (!profile || !profile.onboarding_completed) {
          const onboardingUrl = redirectParam 
            ? `/auth/onboarding?redirect=${encodeURIComponent(redirectParam)}`
            : '/auth/onboarding'
          return NextResponse.redirect(`${origin}${onboardingUrl}`)
        }
        
        // User has completed onboarding, redirect to intended destination or default
        const destination = redirectParam || '/protected'
        return NextResponse.redirect(`${origin}${destination}`)
      }
      
      return NextResponse.redirect(`${origin}/protected`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
