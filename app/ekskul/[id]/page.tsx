
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ambilEkskul, ambilAnggota } from "@/data/ambil";
import { cookies } from "next/headers";
import FormPendaftaran from "./form-pendaftaran";

async function DetailEkskul({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ekskul = await ambilEkskul(Number(id));

  if (!ekskul) {
    notFound();
  }

  const cookieStore = await cookies();
  const defaultNama = cookieStore.get("nama")?.value || "";
  const defaultKelas = cookieStore.get("kelas")?.value || "";

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        {ekskul.nama}
      </h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-2 border">
        <p>
          <strong>Kategori:</strong> {ekskul.kategori}
        </p>
        <p>
          <strong>Hari:</strong> {ekskul.hari} (Sesi {ekskul.sesi})
        </p>
        <p>
          <strong>Pembina:</strong> {ekskul.pembina}
        </p>
        <p>
          <strong>Kuota:</strong> {ekskul.kuota}
        </p>
      </div>

      <FormPendaftaran
        ekskulId={ekskul.id}
        defaultNama={defaultNama}
        defaultKelas={defaultKelas}
      />

      <Suspense
        fallback={
          <p className="text-gray-500 mt-4">
            Memuat anggota...
          </p>
        }
      >
        <DaftarAnggota ekskulId={ekskul.id} />
      </Suspense>
    </main>
  );
}

async function DaftarAnggota({
  ekskulId,
}: {
  ekskulId: number;
}) {
  const anggota = await ambilAnggota(ekskulId);

  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value;

  if (anggota.length === 0) {
    return (
      <p className="text-gray-500 mt-4">
        Belum ada anggota.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">
        Anggota Terdaftar ({anggota.length} tempat terisi)
      </h2>

      <ul className="list-disc pl-5 space-y-1">
        {anggota.map((item) => {
          const isKamu = item.nama === namaCookie;

          return (
            <li key={item.nomor}>
              {item.nama} - Kelas {item.kelas}{" "}
              {isKamu && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  Kamu
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <p className="text-gray-500 p-6">
          Memuat detail ekstrakurikuler...
        </p>
      }
    >
      <DetailEkskul params={params} />
    </Suspense>
  );
}
