import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Auth} from "@supabase/ui"
import supabase from '../utils/supabase'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </Auth.UserContextProvider>
    
    )
}

export default MyApp
