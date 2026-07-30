import { useState, useEffect, useCallback } from 'react';
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  Plus,
  AlertTriangle,
  Banknote,
  Info,
} from 'lucide-react';
import type { Transacao, CriarTransacaoPayload, Pessoa, TipoTransacao } from '../types';
import { listarTransacoes, criarTransacao, listarPessoas } from '../services/api';
import axios from 'axios';

const formatarMoeda = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export default function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<CriarTransacaoPayload>({
    descricao: '', valor: 0, tipo: 'Despesa', pessoaId: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [t, p] = await Promise.all([listarTransacoes(), listarPessoas()]);
      setTransacoes(t);
      setPessoas(p);
    } catch {
      console.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const pessoaSelecionada = pessoas.find(p => p.id === formData.pessoaId);
  const isMenorDeIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  const totalReceitas = transacoes.filter(t => t.tipo === 'Receita').reduce((s, t) => s + t.valor, 0);
  const totalDespesas = transacoes.filter(t => t.tipo === 'Despesa').reduce((s, t) => s + t.valor, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.descricao.trim()) return setFormError('A descrição é obrigatória.');
    if (formData.valor <= 0) return setFormError('O valor deve ser maior que zero.');
    if (!formData.pessoaId) return setFormError('Selecione uma pessoa.');
    try {
      setSubmitting(true);
      await criarTransacao(formData);
      setShowModal(false);
      setFormData({ descricao: '', valor: 0, tipo: 'Despesa', pessoaId: '' });
      await fetchData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data;
        setFormError(typeof msg === 'string' ? msg : 'Erro ao criar transação.');
      } else {
        setFormError('Erro inesperado.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setFormError('');
    setFormData({ descricao: '', valor: 0, tipo: 'Despesa', pessoaId: '' });
  };

  return (
    <div>
      {/* stat cards */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card filled">
          <div className="stat-card-icon white">
            <Receipt size={18} color="white" strokeWidth={2} />
          </div>
          <div className="stat-label">Total de Transações</div>
          <div className="stat-value">{loading ? '—' : transacoes.length}</div>
          <div className="stat-meta">registros no sistema</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon receita">
            <TrendingUp size={18} color="var(--color-receita)" strokeWidth={2} />
          </div>
          <div className="stat-label">Total Receitas</div>
          <div className="stat-value receita">{loading ? '—' : formatarMoeda(totalReceitas)}</div>
          <div className="stat-meta">{transacoes.filter(t => t.tipo === 'Receita').length} transações</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon despesa">
            <TrendingDown size={18} color="var(--color-despesa)" strokeWidth={2} />
          </div>
          <div className="stat-label">Total Despesas</div>
          <div className="stat-value despesa">{loading ? '—' : formatarMoeda(totalDespesas)}</div>
          <div className="stat-meta">{transacoes.filter(t => t.tipo === 'Despesa').length} transações</div>
        </div>
      </div>

      {/* tabela */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Receipt size={16} strokeWidth={2} /> Histórico de Transações
            </h3>
            <p className="card-subtitle">Todas as receitas e despesas registradas</p>
          </div>
          <button id="btn-nova-transacao" className="btn btn-primary" onClick={openModal}>
            <Plus size={15} strokeWidth={2.5} /> Nova Transação
          </button>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" />
              <span style={{ fontSize: '0.85rem' }}>Carregando...</span>
            </div>
          ) : transacoes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Banknote size={40} strokeWidth={1.5} color="var(--text-muted)" />
              </div>
              <p className="empty-state-title">Nenhuma transação registrada</p>
              <p className="empty-state-text">Clique em "Nova Transação" para adicionar a primeira.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Pessoa</th>
                  <th>Tipo</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.descricao}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {t.pessoaNome}
                    </td>
                    <td>
                      <span className={`badge badge-${t.tipo.toLowerCase()}`}>
                        {t.tipo === 'Receita'
                          ? <TrendingUp size={10} strokeWidth={2.5} />
                          : <TrendingDown size={10} strokeWidth={2.5} />
                        }
                        {t.tipo}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      <span className={t.tipo === 'Receita' ? 'valor-receita' : 'valor-despesa'}>
                        {t.tipo === 'Receita' ? '+' : '−'} {formatarMoeda(t.valor)}
                      </span>
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
              <h3 className="modal-title">Nova Transação</h3>
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
                  <label className="form-label" htmlFor="input-pessoa">Pessoa</label>
                  <select
                    id="input-pessoa" className="form-select"
                    value={formData.pessoaId}
                    onChange={e => setFormData(p => ({ ...p, pessoaId: e.target.value }))}
                  >
                    <option value="">Selecione uma pessoa...</option>
                    {pessoas.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} ({p.idade} anos)
                      </option>
                    ))}
                  </select>
                </div>

                {isMenorDeIdade && (
                  <div className="alert alert-warning">
                    <AlertTriangle size={14} />
                    <span>
                      <strong>{pessoaSelecionada?.nome}</strong> tem {pessoaSelecionada?.idade} anos.
                      Apenas <strong>Despesas</strong> são permitidas para menores de 18 anos.
                    </span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="input-tipo">Tipo</label>
                  <select
                    id="input-tipo" className="form-select"
                    value={formData.tipo}
                    onChange={e => setFormData(p => ({ ...p, tipo: e.target.value as TipoTransacao }))}
                  >
                    {!isMenorDeIdade && <option value="Receita">↑ Receita</option>}
                    <option value="Despesa">↓ Despesa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-descricao">Descrição</label>
                  <input
                    id="input-descricao" type="text" className="form-input"
                    placeholder="Ex.: Salário de julho"
                    value={formData.descricao}
                    onChange={e => setFormData(p => ({ ...p, descricao: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="input-valor">Valor (R$)</label>
                  <input
                    id="input-valor" type="number" className="form-input"
                    placeholder="0,00" min={0.01} step={0.01}
                    value={formData.valor || ''}
                    onChange={e => setFormData(p => ({ ...p, valor: Number(e.target.value) }))}
                  />
                  <span className="form-hint">
                    <Info size={11} strokeWidth={2} /> Digite o valor em reais.
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button id="btn-salvar-transacao" type="submit" className="btn btn-primary" disabled={submitting}>
                  <Plus size={15} strokeWidth={2.5} />
                  {submitting ? 'Salvando...' : 'Salvar Transação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
