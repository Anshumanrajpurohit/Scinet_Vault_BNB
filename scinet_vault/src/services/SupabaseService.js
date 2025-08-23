import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || 'pdfs'
const SUPABASE_TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'research_files'

let supabase = null
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export const SupabaseService = {
  isConfigured() {
    return !!supabase
  },

  async uploadPdfAndMetadata({ file, form, pathPrefix }) {
    if (!supabase) throw new Error('Supabase not configured')
    if (!file) throw new Error('File is required')
    const filename = `${Date.now()}-${file.name}`
    const path = pathPrefix ? `${String(pathPrefix).replace(/\/$/, '')}/${filename}` : `${filename}`

    // Upload PDF to storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from(SUPABASE_BUCKET)
  .upload(path, file, { contentType: file.type || 'application/pdf', upsert: false })
    if (storageError) throw storageError

    const publicUrl = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path).data.publicUrl

    // Insert metadata row
    const payload = {
      title: form.title,
      description: form.description || null,
      authors: form.authors || [],
      category: form.category || null,
      type: form.type || 'paper',
      tags: form.tags || [],
      file_name: file.name,
      file_size: file.size,
      storage_bucket: SUPABASE_BUCKET,
      storage_path: path,
      public_url: publicUrl,
    }

    const { data: row, error: dbError } = await supabase
      .from(SUPABASE_TABLE)
      .insert(payload)
      .select()
      .single()
    if (dbError) throw dbError
    return { row, publicUrl }
  },

  // List research items from the table (latest first)
  async listResearch({ limit = 100 } = {}) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data: rows, error } = await supabase
      .from(SUPABASE_TABLE)
      .select('*')
      .order('id', { ascending: false })
      .limit(limit)
    if (error) throw error
    return rows || []
  },

  // Fetch a single research item by id
  async getResearchById(id) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data: row, error } = await supabase
      .from(SUPABASE_TABLE)
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return row
  },
}
