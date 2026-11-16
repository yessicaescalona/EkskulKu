
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { pendaftar, ekskul, JAM_SESI } from "@/data/ekskul";
import { batalkanPendaftaran } from "./actions";

export const metadata = {
  title: "Ekskul Saya",
};

async function DaftarEkskulSaya() {
  const cookieStore = await cookies();
  const namaCookie = cookieStore.get("nama")?.value;
  const kelasCookie = cookieStore.get("kelas")?.value;

  // Kondisi 1: Tanpa cookie
  if (!namaCookie || !kelasCookie) {
    return (
      <main className="p-6 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Ekskul Saya</h1>
        <p className="text-gray-600 mb-4">
          Kamu belum mendaftar apa pun.
        </p>
        <Link
          href="/ekskul"
          className="text-blue-600 underline font-medium"
        >
          Lihat Daftar Ekskul
        </Link>
      </main>
    );
  }

  // Cari ekskul yang diikuti oleh murid di cookie
  const ekskulDiikuti = pendaftar.filter(
    (p) =>
      p.nama.toLowerCase() === namaCookie.toLowerCase() &&
      p.kelas.toLowerCase() === kelasCookie.toLowerCase()
  );

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Ekskul Saya</h1>

      <div className="bg-white shadow rounded-lg p-6 border mb-6">
        <p className="text-lg font-semibold text-gray-800">
          {namaCookie} · {kelasCookie} · {ekskulDiikuti.length} ekskul diikuti
        </p>
      </div>

      {ekskulDiikuti.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 border text-center">
          <p className="text-gray-600 mb-2">
            Belum ada ekskul yang diikuti.
          </p>
          <Link
            href="/ekskul"
            className="text-blue-600 underline font-medium"
          >
            Cari Ekskul Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ekskulDiikuti.map((item) => {
            const detailEkskul = ekskul.find(
              (e) => e.id === item.ekskulId
            );

            if (!detailEkskul) return null;

            return (
              <div
                key={item.nomor}
                className="bg-white shadow rounded-lg p-5 border flex justify-between items-center"
              >
                <div>
                  <Link
                    href={`/ekskul/${detailEkskul.id}`}
                    className="text-xl font-bold text-blue-600 hover:underline"
                  >
                    {detailEkskul.nama}
                  </Link>

                  <p className="text-sm text-gray-600 mt-1">
                    Jadwal: {detailEkskul.hari}, Sesi{" "}
                    {detailEkskul.sesi} ({JAM_SESI[detailEkskul.sesi]})
                  </p>

                  <p className="text-sm text-gray-500">
                    Pembina: {detailEkskul.pembina}
                  </p>
                </div>

                <form action={batalkanPendaftaran}>
                  <input
                    type="hidden"
                    name="nomor"
                    value={item.nomor}
                  />
                  <button
                    type="submit"
                    className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium py-1.5 px-4 rounded-lg transition text-sm"
                  >
                    Batalkan
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/ekskul"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Kembali ke Daftar Ekskul
        </Link>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="text-gray-500 p-6 text-center">
          Memuat data ekskul...
        </p>
      }
    >
      <DaftarEkskulSaya />
    </Suspense>
  );
}
