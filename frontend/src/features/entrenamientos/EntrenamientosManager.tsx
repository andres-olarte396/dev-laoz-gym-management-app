import { useState } from 'react';
import { RutinasList } from './RutinasList';
import { EjerciciosList } from './EjerciciosList';
import { RutinaCreate } from './RutinaCreate';
import { List, Dumbbell } from 'lucide-react';

type TrainingView = 'rutinas' | 'ejercicios' | 'create_rutina';

export function EntrenamientosManager() {
  const [currentView, setCurrentView] = useState<TrainingView>('rutinas');

  // Si estamos en modo creación, mostramos el componente full screen (dentro del dashboard content)
  if (currentView === 'create_rutina') {
    return (
      <RutinaCreate 
        onCancel={() => setCurrentView('rutinas')}
        onSaved={() => {
          setCurrentView('rutinas');
          // Aquí podríamos disparar un refresh toast
        }}
      />
    );
  }

  return (
    <div className="gym-fade-in">
      {/* Sub-navegación local */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '0.5rem'
      }}>
        <button 
          onClick={() => setCurrentView('rutinas')}
          className={`gym-nav-button ${currentView === 'rutinas' ? 'active' : ''}`}
          style={{ width: 'auto', borderRadius: 'var(--border-radius-lg)', padding: '0.5rem 1rem' }}
        >
          <List size={18} />
          Rutinas
        </button>
        <button 
          onClick={() => setCurrentView('ejercicios')}
          className={`gym-nav-button ${currentView === 'ejercicios' ? 'active' : ''}`}
          style={{ width: 'auto', borderRadius: 'var(--border-radius-lg)', padding: '0.5rem 1rem' }}
        >
          <Dumbbell size={18} />
          Catálogo de Ejercicios
        </button>
      </div>

      {/* Contenido Dinámico */}
      {currentView === 'rutinas' && (
        <RutinasList onCreateNew={() => setCurrentView('create_rutina')} />
      )}

      {currentView === 'ejercicios' && (
        <EjerciciosList />
      )}
    </div>
  );
}
