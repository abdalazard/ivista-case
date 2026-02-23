'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', user);
      params.append('password', pass);
      const { data } = await api.post('/token', params);
      localStorage.setItem('token', data.access_token);
      router.push('/dashboard');
    } catch (err) { alert('Erro no login! Use fiscal / ivisa123'); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">iVisa Digital</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full p-3 border rounded" placeholder="Usuário" onChange={e => setUser(e.target.value)} />
          <input className="w-full p-3 border rounded" type="password" placeholder="Senha" onChange={e => setPass(e.target.value)} />
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition">ENTRAR</button>
        </form>
      </div>
    </div>
  );
}