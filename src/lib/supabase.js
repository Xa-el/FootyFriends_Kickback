// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xekarnoathlsnlwvakbj.supabase.co/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhla2Fybm9hdGhsc25sd3Zha2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMjE4NjUsImV4cCI6MjAyNzY5Nzg2NX0.0QFwLOLFJD42kCsr7GJG9QRZpYt3qAT6a_-Fegb4roc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
