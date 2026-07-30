import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  RefreshCw,
  Folder,
  AlertTriangle,
} from 'lucide-react';
import type { Dashboard } from '../types';
import { obterDashboard } from '../services/api';

const formatarMoeda = (valor: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

const iniciais = (nome: string): string =>
  nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setErro('');
      setDashboard(await obterDashboard());
    } catch {
      setErro('Não foi possível carregar o dashboard. Verifique se a API está rodando em localhost:5000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  return (
    <div>
      {erro && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          <AlertTriangle size={15} /> {erro}
        </div>
      )}

      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" />
          <span style={{ fontSize: '0.85rem' }}>Calculando totais...</span>
        </div>
      ) : dashboard ? (
        <>
          {/* stat cards */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>

            <div className="stat-card filled">
              <div className="stat-card-icon white">
                <TrendingUp size={18} color="white" strokeWidth={2} />
              </div>
              <div className="stat-label">Total Receitas da Casa</div>
              <div className="stat-value">{formatarMoeda(dashboard.totalGeralReceitas)}</div>
              <div className="stat-meta">Soma de todos os membros</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon despesa">
                <TrendingDown size={18} color="var(--color-despesa)" strokeWidth={2} />
              </div>
              <div className="stat-label">Total Despesas da Casa</div>
              <div className="stat-value despesa">{formatarMoeda(dashboard.totalGeralDespesas)}</div>
              <div className="stat-meta">Soma de todos os membros</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon saldo">
                <Wallet size={18} color="var(--indigo-500)" strokeWidth={2} />
              </div>
              <div className="stat-label">Saldo Líquido Final</div>
              <div className={`stat-value ${dashboard.saldoLiquido >= 0 ? 'saldo-pos' : 'saldo-neg'}`}>
                {formatarMoeda(dashboard.saldoLiquido)}
              </div>
              <div className="stat-meta">
                {dashboard.saldoLiquido >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon total">
                <Users size={18} color="#f59e0b" strokeWidth={2} />
              </div>
              <div className="stat-label">Membros Cadastrados</div>
              <div className="stat-value" style={{ color: 'var(--indigo-600)' }}>
                {dashboard.resumoPorPessoa.length}
              </div>
              <div className="stat-meta">pessoas na residência</div>
            </div>
          </div>

          /* tabela por pessoa */
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Users size={16} strokeWidth={2} /> Resumo por Pessoa
                </h3>
                <p className="card-subtitle">Detalhamento individual de receitas, despesas e saldo</p>
              </div>
              <button
                id="btn-atualizar-dashboard"
                className="btn btn-ghost btn-sm"
                onClick={fetchDashboard}
                disabled={loading}
              >
                <RefreshCw size={13} strokeWidth={2} /> Atualizar
              </button>
            </div>

            <div className="table-wrapper">
              {dashboard.resumoPorPessoa.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Folder size={40} strokeWidth={1.5} color="var(--text-muted)" />
                  </div>
                  <p className="empty-state-title">Nenhum dado ainda</p>
                  <p className="empty-state-text">
                    Cadastre pessoas e transações para ver o resumo aqui.
                  </p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Membro</th>
                      <th>Idade</th>
                      <th style={{ textAlign: 'right' }}>Receitas</th>
                      <th style={{ textAlign: 'right' }}>Despesas</th>
                      <th style={{ textAlign: 'right' }}>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.resumoPorPessoa.map(pessoa => (
                      <tr key={pessoa.pessoaId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {pessoa.fotoBase64 ? (
                              <img src={pessoa.fotoBase64} alt={pessoa.nome} className="pessoa-avatar" style={{ width: 32, height: 32, objectFit: 'cover' }} />
                            ) : (
                              <div className="pessoa-avatar" style={{ width: 32, height: 32, fontSize: '0.72rem' }}>
                                {iniciais(pessoa.nome)}
                              </div>
                            )}
                            <span style={{ fontWeight: 600 }}>{pessoa.nome}</span>
                          </div>
                        </td>
                        <td>
                          {pessoa.idade < 18 ? (
                            <span className="badge badge-warning">
                              <AlertTriangle size={10} strokeWidth={2.5} /> {pessoa.idade} anos
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>
                              {pessoa.idade} anos
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="valor-receita">{formatarMoeda(pessoa.totalReceitas)}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="valor-despesa">{formatarMoeda(pessoa.totalDespesas)}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={pessoa.saldo >= 0 ? 'valor-saldo-pos' : 'valor-saldo-neg'}>
                            {formatarMoeda(pessoa.saldo)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <td colSpan={2}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Wallet size={14} color="var(--indigo-600)" strokeWidth={2} />
                          <span style={{ color: 'var(--indigo-600)', fontWeight: 700 }}>
                            Total Geral da Residência
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="valor-receita">{formatarMoeda(dashboard.totalGeralReceitas)}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="valor-despesa">{formatarMoeda(dashboard.totalGeralDespesas)}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span
                          className={dashboard.saldoLiquido >= 0 ? 'valor-saldo-pos' : 'valor-saldo-neg'}
                          style={{ fontSize: '1rem' }}
                        >
                          {formatarMoeda(dashboard.saldoLiquido)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
