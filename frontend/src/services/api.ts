import axios from 'axios';
import type {
  Pessoa,
  CriarPessoaPayload,
  Transacao,
  CriarTransacaoPayload,
  Dashboard,
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// pessoas

export const listarPessoas = async (): Promise<Pessoa[]> => {
  const response = await api.get<Pessoa[]>('/pessoas');
  return response.data;
};

export const criarPessoa = async (payload: CriarPessoaPayload): Promise<Pessoa> => {
  const response = await api.post<Pessoa>('/pessoas', payload);
  return response.data;
};

export const deletarPessoa = async (id: string): Promise<void> => {
  await api.delete(`/pessoas/${id}`);
};

// transações

export const listarTransacoes = async (): Promise<Transacao[]> => {
  const response = await api.get<Transacao[]>('/transacoes');
  return response.data;
};

export const criarTransacao = async (payload: CriarTransacaoPayload): Promise<Transacao> => {
  const response = await api.post<Transacao>('/transacoes', payload);
  return response.data;
};

// dashboard

export const obterDashboard = async (): Promise<Dashboard> => {
  const response = await api.get<Dashboard>('/dashboard');
  return response.data;
};

export default api;
