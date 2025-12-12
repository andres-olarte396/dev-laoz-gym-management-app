import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ArrowLeft, Search, User } from 'lucide-react';

// Interfaces simplificadas para este componente
interface Cliente {
  id: number;
  nombre: string;
  email: string;
}

interface Ejercicio {
  id: number;
  nombre: string;
  grupo_muscular: string;
}

interface DetalleEjercicioInput {
  ejercicio_id: number;
  nombre_ejercicio: string; // Para display visual
  series: number;
  repeticiones: string;
  peso_sugerido: string;
  descanso_segundos: number;
  notas: string;
}

interface DiaRutinaInput {
  nombre: string; // "Día A - Pecho"
  orden: number;
  ejercicios: DetalleEjercicioInput[];
}

interface RutinaCreateProps {
  onCancel: () => void;
  onSaved: () => void;
}

export function RutinaCreate({ onCancel, onSaved }: RutinaCreateProps) {
  // Estados de datos maestros
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [catalogoEjercicios, setCatalogoEjercicios] = useState<Ejercicio[]>([]);
  
  // Estado del formulario
  const [rutinaInfo, setRutinaInfo] = useState({
    nombre: '',
    descripcion: '',
    objetivo: '',
    nivel: 'Intermedio',
    duracion_semanas: 4,
    cliente_id: 0
  });
  
  const [dias, setDias] = useState<DiaRutinaInput[]>([]);
  
  // Estado UI
  const [loading, setLoading] = useState(false);
  const [showEjercicioModal, setShowEjercicioModal] = useState(false);
  const [currentDiaIndex, setCurrentDiaIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    fetchMaestros();
  }, []);

  const fetchMaestros = async () => {
    const token = localStorage.getItem('token');
    try {
      const [resClientes, resEjercicios] = await Promise.all([
        fetch('/api/clients/', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/entrenamientos/ejercicios/', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (resClientes.ok) setClientes(await resClientes.json());
      if (resEjercicios.ok) setCatalogoEjercicios(await resEjercicios.json());
    } catch (error) {
      console.error("Error cargando datos", error);
    }
  };

  const handleAddDia = () => {
    setDias([...dias, {
      nombre: `Día ${dias.length + 1}`,
      orden: dias.length + 1,
      ejercicios: []
    }]);
  };

  const handleRemoveDia = (index: number) => {
    const newDias = dias.filter((_, i) => i !== index);
    setDias(newDias.map((d, i) => ({ ...d, orden: i + 1 }))); // Reordenar
  };

  const handleOpenEjercicioSelector = (diaIndex: number) => {
    setCurrentDiaIndex(diaIndex);
    setShowEjercicioModal(true);
    setSearchTerm('');
  };

  const handleSelectEjercicio = (ejercicio: Ejercicio) => {
    if (currentDiaIndex === null) return;
    
    const newDias = [...dias];
    newDias[currentDiaIndex].ejercicios.push({
      ejercicio_id: ejercicio.id,
      nombre_ejercicio: ejercicio.nombre,
      series: 3,
      repeticiones: '10-12',
      peso_sugerido: '',
      descanso_segundos: 60,
      notas: ''
    });
    
    setDias(newDias);
    setShowEjercicioModal(false);
  };

  const handleUpdateEjercicio = (diaIndex: number, ejerIndex: number, field: keyof DetalleEjercicioInput, value: any) => {
    const newDias = [...dias];
    newDias[diaIndex].ejercicios[ejerIndex] = {
      ...newDias[diaIndex].ejercicios[ejerIndex],
      [field]: value
    };
    setDias(newDias);
  };

  const handleRemoveEjercicio = (diaIndex: number, ejerIndex: number) => {
    const newDias = [...dias];
    newDias[diaIndex].ejercicios = newDias[diaIndex].ejercicios.filter((_, i) => i !== ejerIndex);
    setDias(newDias);
  };

  const handleSubmit = async () => {
    if (!rutinaInfo.cliente_id || !rutinaInfo.nombre) {
      alert('Por favor completa la información básica');
      return;
    }
    if (dias.length === 0) {
      alert('Debes agregar al menos un día de entrenamiento');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...rutinaInfo,
        dias: dias
      };

      const res = await fetch('/api/entrenamientos/rutinas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onSaved();
      } else {
        alert('Error al guardar la rutina');
      }
    } catch (error) {
      console.error('Error saving routine:', error);
      alert('Error al guardar la rutina');
    } finally {
      setLoading(false);
    }
  };

  // Filtrado de ejercicios para el modal
  const filteredEjercicios = catalogoEjercicios.filter(e => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="gym-fade-in">
      {/* Header */}
      <div className="gym-flex-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onCancel} className="gym-button gym-button-secondary">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Nueva Rutina</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Diseña un plan de entrenamiento personalizado</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="gym-button gym-button-primary"
        >
          <Save size={20} />
          {loading ? 'Guardando...' : 'Guardar Rutina'}
        </button>
      </div>

      <div className="gym-grid-2" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
        
        {/* Columna Izquierda: Info Básica */}
        <div style={{ 
          background: 'var(--color-surface)', 
          padding: 'var(--spacing-lg)', 
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--color-border)',
          position: 'sticky',
          top: '1rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} />
            Datos Generales
          </h3>

          <div className="gym-form-group">
            <label className="gym-form-label">Cliente</label>
            <select 
              className="gym-form-select"
              value={rutinaInfo.cliente_id}
              onChange={(e) => setRutinaInfo({...rutinaInfo, cliente_id: Number(e.target.value)})}
            >
              <option value={0}>Seleccionar Cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="gym-form-group">
            <label className="gym-form-label">Nombre de la Rutina</label>
            <input 
              type="text" 
              className="gym-form-input" 
              placeholder="Ej: Hipertrofia Fase 1"
              value={rutinaInfo.nombre}
              onChange={(e) => setRutinaInfo({...rutinaInfo, nombre: e.target.value})}
            />
          </div>

          <div className="gym-grid-2">
            <div className="gym-form-group">
              <label className="gym-form-label">Nivel</label>
              <select 
                className="gym-form-select"
                value={rutinaInfo.nivel}
                onChange={(e) => setRutinaInfo({...rutinaInfo, nivel: e.target.value})}
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            <div className="gym-form-group">
              <label className="gym-form-label">Semanas</label>
              <input 
                type="number" 
                className="gym-form-input"
                value={rutinaInfo.duracion_semanas}
                onChange={(e) => setRutinaInfo({...rutinaInfo, duracion_semanas: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="gym-form-group">
            <label className="gym-form-label">Objetivo</label>
            <textarea 
              className="gym-form-input" 
              rows={3}
              placeholder="Ej: Aumentar fuerza en básicos"
              value={rutinaInfo.objetivo}
              onChange={(e) => setRutinaInfo({...rutinaInfo, objetivo: e.target.value})}
            />
          </div>
        </div>

        {/* Columna Derecha: Constructor de Días */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {dias.map((dia, diaIndex) => (
            <div key={diaIndex} style={{ 
              background: 'var(--color-surface)', 
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden'
            }}>
              {/* Dia Header */}
              <div style={{ 
                padding: '1rem', 
                background: 'var(--color-background)', 
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div style={{ 
                    width: '32px', height: '32px', 
                    borderRadius: '50%', background: 'var(--color-primary)', 
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
                  }}>
                    {dia.orden}
                  </div>
                  <input 
                    type="text"
                    value={dia.nombre}
                    onChange={(e) => {
                      const newDias = [...dias];
                      newDias[diaIndex].nombre = e.target.value;
                      setDias(newDias);
                    }}
                    className="gym-form-input"
                    style={{ fontWeight: 'bold', width: 'auto', minWidth: '200px' }}
                  />
                </div>
                <button 
                  onClick={() => handleRemoveDia(diaIndex)}
                  className="gym-button-icon" 
                  style={{ color: 'var(--color-error)' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Ejercicios List */}
              <div style={{ padding: '1rem' }}>
                {dia.ejercicios.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)', border: '2px dashed var(--color-border)', borderRadius: 'var(--border-radius)' }}>
                    <p>No hay ejercicios en este día</p>
                    <button 
                      onClick={() => handleOpenEjercicioSelector(diaIndex)}
                      className="gym-button gym-button-primary"
                      style={{ marginTop: '1rem' }}
                    >
                      <Plus size={16} /> Agregar Ejercicio
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {dia.ejercicios.map((ejercicio, ejerIndex) => (
                      <div key={ejerIndex} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'minmax(200px, 1fr) 100px 100px 100px auto', 
                        gap: '1rem', 
                        alignItems: 'end',
                        padding: '1rem',
                        background: 'var(--color-background)',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--color-border)'
                      }}>
                        <div>
                          <label className="gym-form-label" style={{fontSize: '0.75rem'}}>Ejercicio</label>
                          <div style={{ fontWeight: '600', padding: '0.5rem 0' }}>{ejercicio.nombre_ejercicio}</div>
                        </div>
                        <div>
                          <label className="gym-form-label" style={{fontSize: '0.75rem'}}>Series</label>
                          <input 
                            type="number" 
                            className="gym-form-input" 
                            style={{ padding: '0.25rem 0.5rem' }}
                            value={ejercicio.series}
                            onChange={(e) => handleUpdateEjercicio(diaIndex, ejerIndex, 'series', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="gym-form-label" style={{fontSize: '0.75rem'}}>Reps</label>
                          <input 
                            type="text" 
                            className="gym-form-input"
                            style={{ padding: '0.25rem 0.5rem' }}
                            value={ejercicio.repeticiones}
                            onChange={(e) => handleUpdateEjercicio(diaIndex, ejerIndex, 'repeticiones', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="gym-form-label" style={{fontSize: '0.75rem'}}>RPE/Peso</label>
                          <input 
                            type="text" 
                            className="gym-form-input"
                            style={{ padding: '0.25rem 0.5rem' }}
                            value={ejercicio.peso_sugerido}
                            onChange={(e) => handleUpdateEjercicio(diaIndex, ejerIndex, 'peso_sugerido', e.target.value)}
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveEjercicio(diaIndex, ejerIndex)}
                          className="gym-button-icon"
                          style={{ marginBottom: '4px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => handleOpenEjercicioSelector(diaIndex)}
                      className="gym-button gym-button-secondary"
                      style={{ alignSelf: 'start', marginTop: '0.5rem' }}
                    >
                      <Plus size={16} /> Agregar Otro Ejercicio
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button 
            onClick={handleAddDia}
            className="gym-button gym-button-secondary"
            style={{ padding: '1rem', borderStyle: 'dashed' }}
          >
            <Plus size={20} />
            Agregar Día de Entrenamiento
          </button>

        </div>
      </div>

      {/* Modal Selector de Ejercicios */}
      {showEjercicioModal && (
        <div className="gym-modal-overlay" onClick={() => setShowEjercicioModal(false)}>
          <div className="gym-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gym-modal-header">
              <h2 className="gym-modal-title">Seleccionar Ejercicio</h2>
              <button onClick={() => setShowEjercicioModal(false)} className="gym-modal-close">X</button>
            </div>
            
            <input 
              type="text" 
              className="gym-form-input" 
              placeholder="Buscar ejercicio..." 
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />

            <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filteredEjercicios.map(ejercicio => (
                <button 
                  key={ejercicio.id}
                  onClick={() => handleSelectEjercicio(ejercicio)}
                  className="gym-button-secondary"
                  style={{ 
                    textAlign: 'left', 
                    padding: '1rem', 
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: '600' }}>{ejercicio.nombre}</span>
                  <span className="gym-badge gym-badge-purple">{ejercicio.grupo_muscular}</span>
                </button>
              ))}
              {filteredEjercicios.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '1rem' }}>
                  No se encontraron ejercicios
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
