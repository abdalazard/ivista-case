'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const [inspecoes, setInspecoes] = useState([]);
  const [estabelecimento, setEstabelecimento] = useState('');

  const carregar = async () => {
    const { data } = await api.get('/inspecoes/');
    setInspecoes(data);
  };

  const novaInspecao = async () => {
    if (!estabelecimento) return;
    await api.post('/inspecoes/', { estabelecimento });
    setEstabelecimento('');
    carregar();
  };

  useEffect(() => { carregar(); }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inspeções Sanitárias</h1>
        <button onClick={() => {localStorage.clear(); window.location.href='/'}} className="text-red-500">Sair</button>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mb-8 flex gap-4">
        <input className="flex-1 p-3 border rounded" placeholder="Nome do Estabelecimento" value={estabelecimento} onChange={e => setEstabelecimento(e.target.value)} />
        <button onClick={novaInspecao} className="bg-green-600 text-white px-6 py-3 rounded font-bold">INICIAR INSPEÇÃO</button>
      </div>

      <div className="grid gap-4">
        {inspecoes.map((ins: any) => (
          <div key={ins.id} className="border p-4 rounded shadow-sm flex justify-between items-center bg-white">
            <div>
              <p className="font-bold text-lg">{ins.estabelecimento}</p>
              <p className="text-sm text-gray-500">{new Date(ins.data_hora).toLocaleString()}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded ${ins.finalizada ? 'bg-gray-200' : 'bg-yellow-100 text-yellow-700'}`}>
                {ins.status_atual}
              </span>
            </div>
            <Link href={`/inspeccao/${ins.id}`} className="bg-blue-100 text-blue-700 px-4 py-2 rounded font-bold">
              {ins.finalizada ? "Ver Detalhes" : "Realizar Inspeção"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}