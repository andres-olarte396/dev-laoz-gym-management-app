import { Plus } from 'lucide-react';

export function RutinasList({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="gym-fade-in">
      <div className="gym-flex-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            Rutinas Activas
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Gestiona los planes de entrenamiento de tus clientes
          </p>
        </div>
        <button onClick={onCreateNew} className="gym-button gym-button-primary">
          <Plus size={20} />
          Nueva Rutina
        </button>
      </div>

      <div style={{ 
        background: 'var(--color-surface)',
        padding: '3rem',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--color-border)',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          Aún no has implementado la lista de rutinas.
        </p>
        <button onClick={onCreateNew} className="gym-button gym-button-secondary">
          Crear Primera Rutina
        </button>
      </div>
    </div>
  );
}
