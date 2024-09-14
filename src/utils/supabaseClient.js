import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fsmvxzodebgbehyvyvqa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbXZ4em9kZWJnYmVoeXZ5dnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYzNDYwMzQsImV4cCI6MjA0MTkyMjAzNH0._GdnNf3AFnDOPT3xacHMmenjD1weM4DNSt4d3D7lc6I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)