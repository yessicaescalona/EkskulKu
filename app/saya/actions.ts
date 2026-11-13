"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { pendaftar } from "@/data/ekskul";

export async function batalkanPendaftaran(formData: FormData) {
  const nomorStr = formData.get("nomor") as string;
  const nomorPendaftaran = Number(nomorStr);

  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value;
  const kelasCookie = cookieStore.get("kelas")?.value;

  if (!namaCookie || !kelasCookie) {
    return;
  }

  // Cari data pendaftaran berdasarkan nomor
  const index = pendaftar.findIndex((p) => p.nomor === nomorPendaftaran);
  if (index !== -1) {
    const p = pendaftar[index];
    // Pastikan yang menghapus adalah pemilik data yang sesuai dengan cookie
    if (
      p.nama.toLowerCase() === namaCookie.toLowerCase() &&
      p.kelas.toLowerCase() === kelasCookie.toLowerCase()
    ) {
      pendaftar.splice(index, 1);
      revalidatePath("/saya");
      revalidatePath(`/ekskul/${p.ekskulId}`);
      revalidatePath("/ekskul");
    }
  }
}