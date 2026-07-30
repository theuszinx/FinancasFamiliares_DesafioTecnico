
// pessoa

/* * pessoa cadastrada no sistema */
export interface Pessoa {
  id: string;      
  nome: string;
  idade: number;
  fotoBase64?: string;
}

/* * criação de uma nova pessoa */
export interface CriarPessoaPayload {
  nome: string;
  idade: number;
  fotoBase64?: string;
}

// transação

export type TipoTransacao = 'Receita' | 'Despesa';

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
  pessoaNome: string;  
}

export interface CriarTransacaoPayload {
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  pessoaId: string;
}

// dashboard

export interface ResumoPessoa {
  pessoaId: string;
  nome: string;
  idade: number;
  fotoBase64?: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;  
}

export interface Dashboard {
  resumoPorPessoa: ResumoPessoa[];
  totalGeralReceitas: number;
  totalGeralDespesas: number;
  saldoLiquido: number; 
}
