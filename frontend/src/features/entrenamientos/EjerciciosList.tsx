import { useState, useEffect } from 'react';
import { Plus, Search, Dumbbell } from 'lucide-react';

interface Ejercicio {
  id: number;
  nombre: string;
  grupo_muscular: string;
  equipo_necesario: string;
  descripcion?: string;
}

const GRUPOS_MUSCULARES = ["Pecho", "Espalda", "Pierna", "Hombro", "Brazo", "Core", "Cardio"];

export function EjerciciosList() {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrupo, setFilterGrupo] = useState('');

  useEffect(() => {
    fetchEjercicios();
  }, [filterGrupo]); // Recargar si cambia filtro grupo

  const fetchEjercicios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = '/api/entrenamientos/ejercicios/';
      const params = new URLSearchParams();
      if (filterGrupo) params.append('grupo_muscular', filterGrupo);
      // Search lo manejamos en cliente o server? Server soporta search, usémoslo
      // if (searchTerm) params.append('search', searchTerm); 
      
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setEjercicios(data);
      }
    } catch (error) {
      console.error('Error fetching ejercicios:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado local para search instantáneo
  const filteredEjercicios = ejercicios.filter(e => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="gym-fade-in">
      <div className="gym-flex-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            Catálogo de Ejercicios
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Administra la base de datos de ejercicios para las rutinas
          </p>
        </div>
        <button className="gym-button gym-button-primary">
          <Plus size={20} />
          Nuevo Ejercicio
        </button>
      </div>

      {/* Filtros */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        background: 'var(--color-surface)',
        padding: '1rem',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Buscar ejercicio..."
            className="gym-form-input"
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="gym-form-select" 
          value={filterGrupo}
          onChange={(e) => setFilterGrupo(e.target.value)}
          style={{ minWidth: '200px' }}
        >
          <option value="">Todos los Grupos</option>
          {GRUPOS_MUSCULARES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="gym-table">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Grupo Muscular</th>
              <th>Equipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Cargando ejercicios...</td>
              </tr>
            ) : filteredEjercicios.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                  No se encontraron ejercicios
                </td>
              </tr>
            ) : (
              filteredEjercicios.map(ejercicio => (
                <tr key={ejercicio.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        padding: '0.5rem', 
                        background: 'var(--color-background)', 
                        borderRadius: 'var(--border-radius)',
                        color: 'var(--color-primary)'
                      }}>
                        <Dumbbell size={20} />
                      </div>
                      <span style={{ fontWeight: '600' }}>{ejercicio.nombre}</span>
                    </div>
                  </td>
                  <td>
                    <span className="gym-badge gym-badge-purple">
                      {ejercicio.grupo_muscular}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                      {ejercicio.equipo_necesario}
                    </span>
                  </td>
                  <td>
                    <button className="gym-button gym-button-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
