import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_supabaseUrl
const supabaseAnonKey = process.env.REACT_APP_supabaseAnonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey)