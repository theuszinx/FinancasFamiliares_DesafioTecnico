import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserCheck,
  AlertTriangle,
  Plus,
  Trash2,
  UserX,
  Info,
} from 'lucide-react';
import type { Pessoa, CriarPessoaPayload } from '../types';
import { listarPessoas, criarPessoa, deletarPessoa } from '../services/api';
import axios from 'axios';

const iniciais = (nome: string): string =>
  nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CriarPessoaPayload>({ nome: '', idade: 0 });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPessoas = useCallback(async () => {
    try {
      setLoading(true);
      setPessoas(await listarPessoas());
    } catch {
      console.error('Erro ao carregar pessoas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPessoas(); }, [fetchPessoas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.nome.trim()) return setFormError('O nome é obrigatório.');
    if (formData.idade <= 0) return setFormError('A idade deve ser maior que zero.');
    try {
      setSubmitting(true);
      await criarPessoa(formData);
      setShowModal(false);
      setFormData({ nome: '', idade: 0 });
      await fetchPessoas();
    } catch (err) {
      if (axios.isAxiosError(err)) setFormError(err.response?.data || 'Erro ao criar pessoa.');
      else setFormError('Erro inesperado.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData(p => ({ ...p, fotoBase64: undefined }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData(p => ({ ...p, fotoBase64: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (!confirm(`Excluir "${nome}"?\n\nTodas as transações desta pessoa também serão excluídas.`)) return;
    try {
      setDeletingId(id);
      await deletarPessoa(id);
      setPessoas(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Erro ao excluir. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setFormError('');
    setFormData({ nome: '', idade: 0, fotoBase64: undefined });
  };

  return (
    <div>
      {/* stat cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card filled">
          <div className="stat-card-icon white">
            <Users size={18} color="white" strokeWidth={2} />
          </div>
          <div className="stat-label">Total de Membros</div>
          <div className="stat-value">{loading ? '—' : pessoas.length}</div>
          <div className="stat-meta">cadastrados no sistema</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon receita">
            <UserCheck size={18} color="var(--color-receita)" strokeWidth={2} />
          </div>
          <div className="stat-label">Adultos</div>
          <div className="stat-value" style={{ color: 'var(--color-receita)' }}>
            {loading ? '—' : pessoas.filter(p => p.idade >= 18).length}
          </div>
          <div className="stat-meta">18 anos ou mais</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon total">
            <AlertTriangle size={18} color="var(--color-warning)" strokeWidth={2} />
          </div>
          <div className="stat-label">Menores de Idade</div>
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {loading ? '—' : pessoas.filter(p => p.idade < 18).length}
          </div>
          <div className="stat-meta">só podem ter Despesas</div>
        </div>
      </div>

      {/* tabela */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Users size={16} strokeWidth={2} /> Lista de Pessoas
            </h3>
            <p className="card-subtitle">Membros cadastrados na residência</p>
          </div>
          <button id="btn-nova-pessoa" className="btn btn-primary" onClick={openModal}>
            <Plus size={15} strokeWidth={2.5} /> Nova Pessoa
          </button>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" />
              <span style={{ fontSize: '0.85rem' }}>Carregando...</span>
            </div>
          ) : pessoas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <UserX size={40} strokeWidth={1.5} color="var(--text-muted)" />
              </div>
              <p className="empty-state-title">Nenhuma pessoa cadastrada</p>
              <p className="empty-state-text">Clique em "Nova Pessoa" para começar.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.map((pessoa, idx) => (
                  <tr key={pessoa.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {pessoa.fotoBase64 ? (
                          <img src={pessoa.fotoBase64} alt={pessoa.nome} className="pessoa-avatar" style={{ objectFit: 'cover' }} />
                        ) : (
                          <div className="pessoa-avatar">{iniciais(pessoa.nome)}</div>
                        )}
                        <span style={{ fontWeight: 600 }}>{pessoa.nome}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{pessoa.idade} anos</td>
                    <td>
                      {pessoa.idade < 18 ? (
                        <span className="badge badge-warning">
                          <AlertTriangle size={10} strokeWidth={2.5} /> Menor de idade
                        </span>
                      ) : (
                        <span className="badge badge-receita">
                          <UserCheck size={10} strokeWidth={2.5} /> Adulto
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        id={`btn-deletar-${pessoa.id}`}
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeletar(pessoa.id, pessoa.nome)}
                        disabled={deletingId === pessoa.id}
                      >
                        <Trash2 size={13} strokeWidth={2} />
                        {deletingId === pessoa.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Nova Pessoa</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="alert alert-error">
                    <AlertTriangle size={14} /> {formError}
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label" htmlFor="input-nome">Nome completo</label>
                  <input
                    id="input-nome" type="text" className="form-input"
                    placeholder="Ex.: João Silva"
                    value={formData.nome}
                    onChange={e => setFormData(p => ({ ...p, nome: e.target.value }))}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-idade">Idade</label>
                  <input
                    id="input-idade" type="number" className="form-input"
                    placeholder="Ex.: 25" min={1} max={120}
                    value={formData.idade || ''}
                    onChange={e => setFormData(p => ({ ...p, idade: Number(e.target.value) }))}
                  />
                  <span className="form-hint">
                    <Info size={11} strokeWidth={2} />
                    Menores de 18 anos só podem registrar Despesas.
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="input-foto">Foto de Perfil (Opcional)</label>
                  <input
                    id="input-foto" type="file" accept="image/*" className="form-input"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button id="btn-salvar-pessoa" type="submit" className="btn btn-primary" disabled={submitting}>
                  <Plus size={15} strokeWidth={2.5} />
                  {submitting ? 'Salvando...' : 'Salvar Pessoa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
