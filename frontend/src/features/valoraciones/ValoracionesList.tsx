import { useState, useEffect } from 'react';
import { Activity, Plus, Edit, Trash2, X, TrendingUp } from 'lucide-react';
import { ProgresoModal } from './ProgresoModal';

interface Valoracion {
  id: number;
  cliente_id: number;
  fecha: string;
  tipo: 'INICIAL' | 'SEGUIMIENTO' | 'FINAL';
  peso: number;
  altura: number;
  imc: number | null;
  perimetro_cintura: number | null;
  perimetro_cadera: number | null;
  porcentaje_grasa: number | null;
  masa_muscular: number | null;
  notas: string | null;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
}

export function ValoracionesList() {
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showProgresoModal, setShowProgresoModal] = useState(false);
  const [progresoClienteId, setProgresoClienteId] = useState<number | null>(null);
  const [progresoClienteNombre, setProgresoClienteNombre] = useState<string>('');
  const [editingValoracion, setEditingValoracion] = useState<Valoracion | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cliente_id: 0,
    tipo: 'SEGUIMIENTO' as 'INICIAL' | 'SEGUIMIENTO' | 'FINAL',
    peso: '',
    altura: '',
    perimetro_cuello: '',
    perimetro_hombros: '',
    perimetro_pecho: '',
    perimetro_cintura: '',
    perimetro_cadera: '',
    perimetro_brazo_derecho: '',
    perimetro_brazo_izquierdo: '',
    porcentaje_grasa: '',
    masa_muscular: '',
    masa_osea: '',
    agua_corporal: '',
    flexiones_1min: '',
    abdominales_1min: '',
    sentadillas_1min: '',
    plancha_segundos: '',
    frecuencia_cardiaca_reposo: '',
    presion_arterial_sistolica: '',
    presion_arterial_diastolica: '',
    notas: '',
    objetivos: ''
  });

  useEffect(() => {
    fetchClientes();
    fetchValoraciones();
  }, [selectedCliente]);

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/clients/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClientes(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchValoraciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedCliente 
        ? `/api/valoraciones/?cliente_id=${selectedCliente}`
        : '/api/valoraciones/';
      
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setValoraciones(data);
      }
    } catch (error) {
      console.error('Error fetching valoraciones:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingValoracion 
        ? `/api/valoraciones/${editingValoracion.id}`
        : '/api/valoraciones/';
      
      const method = editingValoracion ? 'PATCH' : 'POST';

      // Preparar datos - convertir strings vacíos a null
      const payload: any = {
        cliente_id: parseInt(formData.cliente_id.toString()),
        tipo: formData.tipo,
        peso: parseFloat(formData.peso),
        altura: parseFloat(formData.altura),
      };

      // Agregar campos opcionales solo si tienen valor
      const optionalFields = [
        'perimetro_cuello', 'perimetro_hombros', 'perimetro_pecho',
        'perimetro_cintura', 'perimetro_cadera', 'perimetro_brazo_derecho',
        'perimetro_brazo_izquierdo', 'porcentaje_grasa', 'masa_muscular',
        'masa_osea', 'agua_corporal', 'flexiones_1min', 'abdominales_1min',
        'sentadillas_1min', 'plancha_segundos', 'frecuencia_cardiaca_reposo',
        'presion_arterial_sistolica', 'presion_arterial_diastolica'
      ];

      optionalFields.forEach(field => {
        const value = formData[field as keyof typeof formData];
        if (value && value !== '') {
          payload[field] = parseFloat(value as string);
        }
      });

      if (formData.notas) payload.notas = formData.notas;
      if (formData.objetivos) payload.objetivos = formData.objetivos;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchValoraciones();
      } else {
        const error = await res.json();
        alert(`Error: ${error.detail || 'No se pudo guardar la valoración'}`);
      }
    } catch (error) {
      console.error('Error saving valoracion:', error);
      alert('Error al guardar la valoración');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta valoración?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/valoraciones/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchValoraciones();
      }
    } catch (error) {
      console.error('Error deleting valoracion:', error);
    }
  };

  const handleEdit = (valoracion: Valoracion) => {
    setEditingValoracion(valoracion);
    setFormData({
      cliente_id: valoracion.cliente_id,
      tipo: valoracion.tipo,
      peso: valoracion.peso.toString(),
      altura: valoracion.altura.toString(),
      perimetro_cuello: '',
      perimetro_hombros: '',
      perimetro_pecho: '',
      perimetro_cintura: valoracion.perimetro_cintura?.toString() || '',
      perimetro_cadera: valoracion.perimetro_cadera?.toString() || '',
      perimetro_brazo_derecho: '',
      perimetro_brazo_izquierdo: '',
      porcentaje_grasa: valoracion.porcentaje_grasa?.toString() || '',
      masa_muscular: valoracion.masa_muscular?.toString() || '',
      masa_osea: '',
      agua_corporal: '',
      flexiones_1min: '',
      abdominales_1min: '',
      sentadillas_1min: '',
      plancha_segundos: '',
      frecuencia_cardiaca_reposo: '',
      presion_arterial_sistolica: '',
      presion_arterial_diastolica: '',
      notas: valoracion.notas || '',
      objetivos: ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingValoracion(null);
    setFormData({
      cliente_id: 0,
      tipo: 'SEGUIMIENTO',
      peso: '',
      altura: '',
      perimetro_cuello: '',
      perimetro_hombros: '',
      perimetro_pecho: '',
      perimetro_cintura: '',
      perimetro_cadera: '',
      perimetro_brazo_derecho: '',
      perimetro_brazo_izquierdo: '',
      porcentaje_grasa: '',
      masa_muscular: '',
      masa_osea: '',
      agua_corporal: '',
      flexiones_1min: '',
      abdominales_1min: '',
      sentadillas_1min: '',
      plancha_segundos: '',
      frecuencia_cardiaca_reposo: '',
      presion_arterial_sistolica: '',
      presion_arterial_diastolica: '',
      notas: '',
      objetivos: ''
    });
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'INICIAL': return 'gym-badge-primary';
      case 'SEGUIMIENTO': return 'gym-badge-success';
      case 'FINAL': return 'gym-badge-purple';
      default: return 'gym-badge-gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getClienteName = (clienteId: number) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div className="gym-flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--gym-gray-900)', marginBottom: '0.5rem' }}>
            Valoraciones Físicas
          </h1>
          <p style={{ color: 'var(--gym-gray-500)' }}>
            Gestiona las evaluaciones físicas de tus clientes
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="gym-button gym-button-primary"
        >
          <Plus size={20} />
          Nueva Valoración
        </button>
      </div>

      {/* Filtro por Cliente */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, maxWidth: '300px' }}>
          <label className="gym-form-label">Filtrar por Cliente</label>
          <select
            className="gym-form-select"
            value={selectedCliente || ''}
            onChange={(e) => setSelectedCliente(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Todos los clientes</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
        </div>
        
        {selectedCliente && (
          <button
            onClick={() => {
              const cliente = clientes.find(c => c.id === selectedCliente);
              if (cliente) {
                setProgresoClienteId(selectedCliente);
                setProgresoClienteNombre(`${cliente.nombre} ${cliente.apellido}`);
                setShowProgresoModal(true);
              }
            }}
            className="gym-button gym-button-secondary"
          >
            <TrendingUp size={20} />
            Ver Progreso
          </button>
        )}
      </div>

      {/* Tabla de Valoraciones */}
      <div className="gym-table">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Peso (kg)</th>
              <th>Altura (cm)</th>
              <th>IMC</th>
              <th>% Grasa</th>
              <th>Masa Muscular</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {valoraciones.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gym-gray-500)' }}>
                  No hay valoraciones registradas
                </td>
              </tr>
            ) : (
              valoraciones.map(valoracion => (
                <tr key={valoracion.id}>
                  <td>{formatDate(valoracion.fecha)}</td>
                  <td>{getClienteName(valoracion.cliente_id)}</td>
                  <td>
                    <span className={`gym-badge ${getTipoBadgeColor(valoracion.tipo)}`}>
                      {valoracion.tipo}
                    </span>
                  </td>
                  <td>{valoracion.peso}</td>
                  <td>{valoracion.altura}</td>
                  <td>{valoracion.imc?.toFixed(1) || '-'}</td>
                  <td>{valoracion.porcentaje_grasa ? `${valoracion.porcentaje_grasa}%` : '-'}</td>
                  <td>{valoracion.masa_muscular ? `${valoracion.masa_muscular} kg` : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(valoracion)}
                        className="gym-button-icon"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(valoracion.id)}
                        className="gym-button-icon"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Crear/Editar - Continuará en el siguiente archivo */}
      {showModal && (
        <div className="gym-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="gym-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="gym-modal-header">
              <h2 className="gym-modal-title">
                <Activity size={24} style={{ marginRight: '0.5rem' }} />
                {editingValoracion ? 'Editar Valoración' : 'Nueva Valoración'}
              </h2>
              <button onClick={() => setShowModal(false)} className="gym-modal-close">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Información Básica */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gym-gray-900)' }}>
                  Información Básica
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="gym-form-group">
                    <label className="gym-form-label">Cliente *</label>
                    <select
                      className="gym-form-select"
                      value={formData.cliente_id}
                      onChange={(e) => setFormData({ ...formData, cliente_id: parseInt(e.target.value) })}
                      required
                    >
                      <option value={0}>Seleccionar cliente</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.apellido}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="gym-form-group">
                    <label className="gym-form-label">Tipo de Valoración *</label>
                    <select
                      className="gym-form-select"
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                      required
                    >
                      <option value="INICIAL">Inicial</option>
                      <option value="SEGUIMIENTO">Seguimiento</option>
                      <option value="FINAL">Final</option>
                    </select>
                  </div>

                  <div className="gym-form-group">
                    <label className="gym-form-label">Peso (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="gym-form-input"
                      value={formData.peso}
                      onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                      required
                    />
                  </div>

                  <div className="gym-form-group">
                    <label className="gym-form-label">Altura (cm) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="gym-form-input"
                      value={formData.altura}
                      onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Perímetros */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gym-gray-900)' }}>
                  Perímetros (cm)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="gym-form-group">
                    <label className="gym-form-label">Cintura</label>
                    <input
                      type="number"
                      step="0.1"
                      className="gym-form-input"
                      value={formData.perimetro_cintura}
                      onChange={(e) => setFormData({ ...formData, perimetro_cintura: e.target.value })}
                    />
                  </div>

                  <div className="gym-form-group">
                    <label className="gym-form-label">Cadera</label>
                    <input
                      type="number"
                      step="0.1"
                      className="gym-form-input"
                      value={formData.perimetro_cadera}
                      onChange={(e) => setFormData({ ...formData, perimetro_cadera: e.target.value })}
                    />
                  </div>

                  <div className="gym-form-group">
                    <label className="gym-form-label">Pecho</label>
                    <input
                      type="number"
                      step="0.1"
                      className="gym-form-input"
                      value={formData.perimetro_pecho}
                      onChange={(e) => setFormData({ ...formData, perimetro_pecho: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Composición Corporal */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gym-gray-900)' }}>
                  Composición Corporal
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="gym-form-group">
                    <label className="gym-form-label">% Grasa Corporal</label>
                    <input
                      type="number"
                      step="0.1"
                      className="gym-form-input"
                      value={formData.porcentaje_grasa}
                      onChange={(e) => setFormData({ ...formData, porcentaje_grasa: e.target.value })}
                    />
                  </div>

                  <div className="gym-form-group">
                    <label className="gym-form-label">Masa Muscular (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="gym-form-input"
                      value={formData.masa_muscular}
                      onChange={(e) => setFormData({ ...formData, masa_muscular: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Pruebas de Rendimiento */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gym-gray-900)' }}>
                  Pruebas de Rendimiento
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div className="gym-form-group">
                    <label className="gym-form-label">Flexiones (1 min)</label>
                    <input
                      type="number"
                      className="gym-form-input"
                      value={formData.flexiones_1min}
                      onChange={(e) => setFormData({ ...formData, flexiones_1min: e.target.value })}
                    />
                  </div>

                  <div className="gym-form-group">
                    <label className="gym-form-label">Abdominales (1 min)</label>
                    <input
                      type="number"
                      className="gym-form-input"
                      value={formData.abdominales_1min}
                      onChange={(e) => setFormData({ ...formData, abdominales_1min: e.target.value })}
                    />
                  </div>

                  <div className="gym-form-group">
                    <label className="gym-form-label">Sentadillas (1 min)</label>
                    <input
                      type="number"
                      className="gym-form-input"
                      value={formData.sentadillas_1min}
                      onChange={(e) => setFormData({ ...formData, sentadillas_1min: e.target.value })}
                    />
                  </div>

                  <div className="gym-form-group">
                    <label className="gym-form-label">Plancha (segundos)</label>
                    <input
                      type="number"
                      className="gym-form-input"
                      value={formData.plancha_segundos}
                      onChange={(e) => setFormData({ ...formData, plancha_segundos: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div className="gym-form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="gym-form-label">Notas y Observaciones</label>
                <textarea
                  className="gym-form-input"
                  rows={3}
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Observaciones generales, recomendaciones, etc."
                />
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="gym-button gym-button-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="gym-button gym-button-primary"
                >
                  {loading ? 'Guardando...' : (editingValoracion ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Progreso */}
      {showProgresoModal && progresoClienteId && (
        <ProgresoModal
          clienteId={progresoClienteId}
          clienteNombre={progresoClienteNombre}
          onClose={() => setShowProgresoModal(false)}
        />
      )}
    </div>
  );
}
