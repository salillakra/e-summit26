import { createClient } from './supabase/client';

/**
 * Uploads a file to Supabase Storage registrations bucket
 * @param file The file to upload
 * @param path The path within the bucket (usually team_id/filename)
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const supabase = createClient();
  
  // Clean up path and add timestamp to avoid collisions
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const fullPath = `${path}/${fileName}`;

  const { error } = await supabase.storage
    .from('registrations')
    .upload(fullPath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('registrations')
    .getPublicUrl(fullPath);

  return publicUrl;
}
