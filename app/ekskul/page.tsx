
import { Suspense } from "react";
import Link from "next/link";
import { ambilSemuaEkskul } from "@/data/ambil";
import {
  pendaftar,
  DAFTAR_KATEGORI,
  DAFTAR_HARI,
  JAM_SESI,
} from "@/data/ekskul";

export const metadata = {
  title: "Daftar Ekskul",
};

type SearchParams = Promise<{
  kategori?: string;
  hari?: string;
}>;

async function DaftarList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const selectedKategori = resolvedParams.kategori || "";
  const selectedHari = resolvedParams.hari || "";

  const semuaEkskul = await ambilSemuaEkskul();

  const filteredEkskul = semuaEkskul.filter((e) => {
    const matchKategori = selectedKategori
      ? e.kategori === selectedKategori
      : true;

    const matchHari = selectedHari
      ? e.hari === selectedHari
      : true;

    return matchKategori && matchHari;
  });

  return (
    <>
      <p className="mb-4 text-gray-600">
        {filteredEkskul.length} ekskul ditemukan.
      </p>

      {filteredEkskul.length === 0 ? (
        <p className="text-red-500 font-semibold">
          Tidak ada ekskul yang cocok.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEkskul.map((ekskul) => {
            const jumlahPendaftar = pendaftar.filter(
              (p) => p.ekskulId === ekskul.id
            ).length;

            const sisaTempat = ekskul.kuota - jumlahPendaftar;
            const isPenuh = sisaTempat <= 0;

            return (
              <div
                key={ekskul.id}
                className="border p-5 rounded-xl shadow-sm bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded">
                      {ekskul.kategori}
                    </span>

                    {isPenuh ? (
                      <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded">
                        Penuh
                      </span>
                    ) : (
                      <span className="bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded">
                        Sisa {sisaTempat} dari {ekskul.kuota} tempat
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold mb-2">
                    {ekskul.nama}
                  </h2>

                  <p className="text-sm text-gray-600 mb-1">
                    Jadwal: {ekskul.hari}, Sesi {ekskul.sesi} (
                    {JAM_SESI[ekskul.sesi]})
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    Pembina: {ekskul.pembina}
                  </p>
                </div>

                <Link
                  href={`/ekskul/${ekskul.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 px-4 rounded-lg transition"
                >
                  Lihat Detail & Daftar
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Daftar Ekstrakurikuler
      </h1>

      <Suspense
        fallback={
          <p className="text-gray-500">
            Memuat daftar ekskul...
          </p>
        }
      >
        <FilterEkskul searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function FilterEkskul({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const selectedKategori = resolvedParams.kategori || "";
  const selectedHari = resolvedParams.hari || "";

  return (
    <>
      <form method="GET" className="flex gap-4 mb-6">
        <select
          name="kategori"
          defaultValue={selectedKategori}
          className="border p-2 rounded"
        >
          <option value="">Semua Kategori</option>
          {DAFTAR_KATEGORI.map((kat) => (
            <option key={kat} value={kat}>
              {kat}
            </option>
          ))}
        </select>

        <select
          name="hari"
          defaultValue={selectedHari}
          className="border p-2 rounded"
        >
          <option value="">Semua Hari</option>
          {DAFTAR_HARI.map((hari) => (
            <option key={hari} value={hari}>
              {hari}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Saring
        </button>
      </form>

      <Suspense
        fallback={
          <p className="text-gray-500">
            Memuat daftar ekskul...
          </p>
        }
      >
        <DaftarList searchParams={searchParams} />
      </Suspense>
    </>
  );
}
