// utils/uploadToSupabase.ts
import supabase from "./supabase";

export async function uploadProfileImage(
  file: Express.Multer.File,
  folder: "doctors" | "patients",
) {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${folder}/${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("profile-pics")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("profile-pics").getPublicUrl(fileName);

  return data.publicUrl;
}
