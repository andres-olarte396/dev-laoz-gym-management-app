import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ClientList } from '../clients/ClientList';
import { UserList } from '../users/UserList';
import { ValoracionesList } from '../valoraciones/ValoracionesList';
import { EntrenamientosManager } from '../entrenamientos/EntrenamientosManager';
import { LayoutDashboard, Users, UserCog, LogOut, Activity, Dumbbell } from 'lucide-react';

type Tab = 'overview' | 'clients' | 'users' | 'valoraciones' | 'entrenamientos';

export function Dashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const menuItems = [
    { id: 'overview' as Tab, label: 'Resumen', icon: LayoutDashboard },
    { id: 'clients' as Tab, label: 'Clientes', icon: Users },
    { id: 'users' as Tab, label: 'Usuarios', icon: UserCog },
    { id: 'valoraciones' as Tab, label: 'Valoraciones', icon: Activity },
    { id: 'entrenamientos' as Tab, label: 'Entrenamientos', icon: Dumbbell },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'clients':
        return <ClientList />;
      case 'users':
        return <UserList />;
      case 'valoraciones':
        return <ValoracionesList />;
      case 'entrenamientos':
        return <EntrenamientosManager />;
      case 'overview':
      default:
        return (
          <div style={{ padding: '2rem' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              marginBottom: '1.5rem',
              color: 'var(--gym-gray-900)'
            }}>
              Bienvenido al Sistema de Gestión
            </h1>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem'
            }}>
              {/* Tarjeta 1 */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                transition: 'all var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div className="gym-flex-between">
                  <div>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--gym-gray-500)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem'
                    }}>
                      Total Clientes
                    </p>
                    <p style={{ 
                      fontSize: '2rem', 
                      fontWeight: '700',
                      color: 'var(--gym-gray-900)'
                    }}>
                      -
                    </p>
                  </div>
                  <Users style={{ color: 'var(--gym-primary)', width: '40px', height: '40px' }} />
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                transition: 'all var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div className="gym-flex-between">
                  <div>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--gym-gray-500)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem'
                    }}>
                      Usuarios Activos
                    </p>
                    <p style={{ 
                      fontSize: '2rem', 
                      fontWeight: '700',
                      color: 'var(--gym-gray-900)'
                    }}>
                      -
                    </p>
                  </div>
                  <UserCog style={{ color: 'var(--gym-secondary)', width: '40px', height: '40px' }} />
                </div>
              </div>

              {/* Tarjeta 3 */}
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                transition: 'all var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div className="gym-flex-between">
                  <div>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--gym-gray-500)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem'
                    }}>
                      Sesiones Hoy
                    </p>
                    <p style={{ 
                      fontSize: '2rem', 
                      fontWeight: '700',
                      color: 'var(--gym-gray-900)'
                    }}>
                      -
                    </p>
                  </div>
                  <LayoutDashboard style={{ color: 'var(--gym-accent)', width: '40px', height: '40px' }} />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gym-gray-100)' }}>
      {/* Sidebar */}
      <div className="gym-sidebar" style={{ width: '16rem' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gym-gray-700)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>GymApp</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--gym-gray-500)', marginTop: '0.25rem' }}>
            {user?.email || user?.sub || 'Usuario'}
          </p>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`gym-nav-button ${activeTab === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--gym-gray-700)' }}>
          <button
            onClick={logout}
            className="gym-nav-button"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  );
}
