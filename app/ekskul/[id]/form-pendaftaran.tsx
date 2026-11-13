"use client";

import { useActionState } from "react";
import { daftarEkskul } from "./actions";

export default function FormPendaftaran({
  ekskulId,
  defaultNama,
  defaultKelas,
}: {
  ekskulId: number;
  defaultNama: string;
  defaultKelas: string;
}) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData): Promise<any> => {
      return await daftarEkskul(prevState, formData);
    },
    {}
  );

  return (
    <form action={formAction} className="bg-white shadow rounded-lg p-6 mt-6 border space-y-4">
      <h2 className="text-xl font-semibold mb-2">Formulir Pendaftaran Ekskul</h2>

      <input type="hidden" name="ekskulId" value={ekskulId} />

      {state?.errors?.umum && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm font-medium">
          {state.errors.umum}
        </div>
      )}

      {state?.success && (
        <div className="bg-green-50 text-green-600 p-3 rounded text-sm font-medium">
          {state.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
        <input
          type="text"
          name="nama"
          defaultValue={state?.values?.nama ?? defaultNama}
          className="mt-1 block w-full border rounded-md p-2"
        />
        {state?.errors?.nama && (
          <p className="text-red-500 text-xs mt-1">{state.errors.nama}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Kelas</label>
        <input
          type="text"
          name="kelas"
          defaultValue={state?.values?.kelas ?? defaultKelas}
          className="mt-1 block w-full border rounded-md p-2"
        />
        {state?.errors?.kelas && (
          <p className="text-red-500 text-xs mt-1">{state.errors.kelas}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-400"
      >
        {isPending ? "Memproses..." : "Daftar Sekarang"}
      </button>
    </form>
  );
}