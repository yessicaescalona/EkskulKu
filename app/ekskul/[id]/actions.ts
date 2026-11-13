"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ekskul, pendaftar } from "@/data/ekskul";
import { ambilEkskul } from "@/data/ambil";

export async function daftarEkskul(prevState: any, formData: FormData) {
  const ekskulIdStr = formData.get("ekskulId") as string;
  const ekskulId = Number(ekskulIdStr);

  const nama = (formData.get("nama") as string)?.trim() || "";
  const kelas = (formData.get("kelas") as string)?.trim() || "";

  let errors: { nama?: string; kelas?: string; umum?: string } = {};

  if (nama.length < 3) {
    errors.nama = "Nama minimal 3 huruf.";
  }
  if (kelas.length < 3) {
    errors.kelas = "Kelas minimal 3 karakter.";
  }

  if (errors.nama || errors.kelas) {
    return { success: false, errors, values: { nama, kelas } };
  }

  const targetEkskul = await ambilEkskul(ekskulId);
  if (!targetEkskul) {
    return { success: false, errors: { umum: "Id ekskul tidak ditemukan." }, values: { nama, kelas } };
  }

  // Cek sudah terdaftar (case-insensitive)
  const sudahTerdaftar = pendaftar.some(
    (p) =>
      p.ekskulId === ekskulId &&
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase()
  );

  if (sudahTerdaftar) {
    return {
      success: false,
      errors: { umum: `${nama} (${kelas}) sudah terdaftar di ${targetEkskul.nama}.` },
      values: { nama, kelas },
    };
  }

  // Cek kuota penuh (Sesuai gambar soal)
  const jumlahPendaftar = pendaftar.filter((p) => p.ekskulId === ekskulId).length;
  if (jumlahPendaftar >= targetEkskul.kuota) {
    return {
      success: false,
      errors: { umum: `Kuota ${targetEkskul.nama} sudah penuh (${targetEkskul.kuota} orang).` },
      values: { nama, kelas },
    };
  }

  // Cek jadwal bentrok
  const ekskulDiikutiMurid = pendaftar.filter(
    (p) => p.nama.toLowerCase() === nama.toLowerCase() && p.kelas.toLowerCase() === kelas.toLowerCase()
  );

  for (const p of ekskulDiikutiMurid) {
    const eLain = ekskul.find((e) => e.id === p.ekskulId);
    if (eLain && eLain.hari === targetEkskul.hari && eLain.sesi === targetEkskul.sesi) {
      return {
        success: false,
        errors: { umum: `Jadwal bentrok dengan ${eLain.nama} (${eLain.hari}, sesi ${eLain.sesi}).` },
        values: { nama, kelas },
      };
    }
  }

  const nomorBaru = pendaftar.length > 0 ? Math.max(...pendaftar.map((p) => p.nomor)) + 1 : 1;
  pendaftar.push({
    nomor: nomorBaru,
    ekskulId,
    nama,
    kelas,
  });

  // Simpan ke cookie
  const cookieStore = await cookies();
  cookieStore.set("nama", nama, { path: "/" });
  cookieStore.set("kelas", kelas, { path: "/" });

  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/ekskul");

  return {
    success: true,
    message: `Pendaftaran #${nomorBaru} berhasil: ${targetEkskul.nama}, ${targetEkskul.hari}, sesi ${targetEkskul.sesi}.`,
    values: { nama: "", kelas: "" },
  };
}