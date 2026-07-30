import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import './index.css';
import PessoasPage from './pages/PessoasPage';
import TransacoesPage from './pages/TransacoesPage';
import DashboardPage from './pages/DashboardPage';

type Page = 'dashboard' | 'pessoas' | 'transacoes';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard',  label: 'Dashboard',  icon: <LayoutDashboard size={17} />, description: 'Resumo financeiro' },
  { id: 'pessoas',    label: 'Pessoas',     icon: <Users size={17} />,           description: 'Membros da residência' },
  { id: 'transacoes', label: 'Transações',  icon: <CreditCard size={17} />,      description: 'Receitas e despesas' },
];

const pageTitles: Record<Page, { title: string; subtitle: string }> = {
  dashboard:  { title: 'Dashboard',  subtitle: 'Resumo financeiro da residência' },
  pessoas:    { title: 'Pessoas',    subtitle: 'Gerencie os membros da casa' },
  transacoes: { title: 'Transações', subtitle: 'Histórico de receitas e despesas' },
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { title, subtitle } = pageTitles[currentPage];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':  return <DashboardPage />;
      case 'pessoas':    return <PessoasPage />;
      case 'transacoes': return <TransacoesPage />;
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar" role="navigation" aria-label="Menu principal">

        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <DollarSign size={18} color="white" strokeWidth={2.5} />
          </div>
          <div className="sidebar-logo-text">
            <h1>Finanças Familiares</h1>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Menu</span>
          {navItems.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
              aria-current={currentPage === item.id ? 'page' : undefined}
              title={item.description}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Desafio Técnico TI · v1.0</p>
        </div>
      </aside>

      <div className="right-wrapper">

        <header className="topbar">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span className="topbar-title">{title}</span>
              <span className="topbar-subtitle">{subtitle}</span>
            </div>
          </div>

        </header>

        <main className="main-content" id="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
