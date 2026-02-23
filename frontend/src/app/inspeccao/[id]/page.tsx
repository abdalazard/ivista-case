'use client';
import { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function DetalheInspecao({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [inspecao, setInspecao] = useState<any>(null);
  const [desc, setDesc] = useState('');
  const [gravidade, setGravidade] = useState('Média');
  const [interditar, setInterditar] = useState(false);

  const carregar = async () => {
    const { data } = await api.get(`/inspecoes/`); // Simplificado: busca todos e filtra
    const atual = data.find((i: any) => i.id === parseInt(id));
    setInspecao(atual);
  };

  useEffect(() => { carregar(); }, []);

  const addIrregularidade = async () => {
    try {
      await api.post(`/inspecoes/${id}/irregularidades/`, {
        descricao: desc,
        gravidade,
        exige_interdicao_imediata: interditar
      });
      setDesc('');
      carregar();
    } catch (err) { alert("Não é possível alterar uma inspeção finalizada."); }
  };

  const finalizar = async (status: string) => {
    if (!confirm(`Confirmar resultado: ${status}?`)) return;
    await api.put(`/inspecoes/${id}/finalizar/`, { novo_status: status });
    carregar();
  };

  if (!inspecao) return <p className="p-8">Carregando...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="text-blue-600">← Voltar</button>
      
      <div className="bg-white p-6 rounded-lg shadow border">
        <h1 className="text-2xl font-bold">{inspecao.estabelecimento}</h1>
        <p className="text-gray-600">Status: <span className="font-bold text-blue-600">{inspecao.status_atual}</span></p>
      </div>

      {!inspecao.finalizada && (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 space-y-4">
          <h2 className="font-bold text-red-800">Registrar Irregularidade</h2>
          <input className="w-full p-3 border rounded" placeholder="Descrição da irregularidade" value={desc} onChange={e => setDesc(e.target.value)} />
          <div className="flex gap-4 items-center">
            <select className="p-3 border rounded" value={gravidade} onChange={e => setGravidade(e.target.value)}>
              <option>Baixa</option><option>Média</option><option>Alta</option>
            </select>
            <label className="flex items-center gap-2 font-bold text-red-600">
              <input type="checkbox" checked={interditar} onChange={e => setInterditar(e.target.checked)} />
              INTERDIÇÃO IMEDIATA?
            </label>
            <button onClick={addIrregularidade} className="bg-red-600 text-white px-6 py-3 rounded font-bold ml-auto">ADICIONAR</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="font-bold">Irregularidades Encontradas:</h2>
        {inspecao.irregularidades.map((irr: any, idx: number) => (
          <div key={idx} className="p-3 bg-white border-l-4 border-red-500 shadow-sm">
            <p><strong>{irr.descricao}</strong> ({irr.gravidade})</p>
            {irr.exige_interdicao_imediata && <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">INTERDIÇÃO</span>}
          </div>
        ))}
      </div>

      {!inspecao.finalizada ? (
        <div className="pt-6 border-t space-y-4">
          <h2 className="font-bold text-center">DEFINIR RESULTADO FINAL</h2>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => finalizar('Em conformidade')} className="bg-green-600 text-white p-4 rounded font-bold">EM CONFORMIDADE</button>
            <button onClick={() => finalizar('Pendências')} className="bg-yellow-500 text-white p-4 rounded font-bold">PENDÊNCIAS</button>
            <button onClick={() => finalizar('Auto de Infração com interdição parcial')} className="bg-orange-600 text-white p-4 rounded font-bold">INTERDIÇÃO PARCIAL</button>
            <button onClick={() => finalizar('Interdição total')} className="bg-red-700 text-white p-4 rounded font-bold">INTERDIÇÃO TOTAL</button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 text-white p-6 rounded-lg text-center font-bold text-xl">
          INSPEÇÃO FINALIZADA - DADOS IMUTÁVEIS
        </div>
      )}
    </div>
  );
}