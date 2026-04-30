import { supabase } from '../src/lib/supabaseClient';

const SUPABASE_CONFIGURED = !!(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Compress an image File to a JPEG data URL, max dimension px, quality 0–1
export async function compressImageFile(
  file: File,
  maxDim = 1280,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Upload an image to Supabase Storage (if configured) or return compressed base64
export async function uploadProjectImage(
  file: File,
  projectId: string,
  bucket = 'project-photos'
): Promise<string> {
  const compressed = await compressImageFile(file);

  if (!SUPABASE_CONFIGURED) return compressed;

  try {
    const ext = 'jpg';
    const path = `${projectId}/${Date.now()}.${ext}`;
    const blob = await (await fetch(compressed)).blob();
    const { data, error } = await supabase.storage.from(bucket).upload(path, blob, {
      contentType: 'image/jpeg',
      upsert: false,
    });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (e) {
    console.warn('Supabase Storage unavailable, using compressed base64:', e);
    return compressed;
  }
}

// Upload a document file, returns a URL or base64
export async function uploadDocument(
  file: File,
  projectId: string,
  bucket = 'project-docs'
): Promise<string> {
  if (!SUPABASE_CONFIGURED) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  try {
    const ext = file.name.split('.').pop() || 'bin';
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${projectId}/${Date.now()}_${safeName}`;
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (e) {
    console.warn('Supabase Storage unavailable for document, falling back to base64:', e);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
