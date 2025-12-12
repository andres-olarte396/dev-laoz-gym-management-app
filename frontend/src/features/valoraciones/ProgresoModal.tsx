import { useState, useEffect, useRef } from 'react';
import { X, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Valoracion {
  id: number;
  fecha: string;
  peso: number;
  imc: number | null;
  porcentaje_grasa: number | null;
  masa_muscular: number | null;
  perimetro_cintura: number | null;
}

interface ProgresoModalProps {
  clienteId: number;
  clienteNombre: string;
  onClose: () => void;
}

export function ProgresoModal({ clienteId, clienteNombre, onClose }: ProgresoModalProps) {
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
  const [progreso, setProgreso] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProgreso();
  }, [clienteId]);

  // ... (fetch logic remains same)
  const fetchProgreso = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const resValoraciones = await fetch(`/api/valoraciones/?cliente_id=${clienteId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (resValoraciones.ok) {
        const dataValoraciones = await resValoraciones.json();
        setValoraciones(dataValoraciones);
      }

      const resProgreso = await fetch(`/api/valoraciones/cliente/${clienteId}/progreso`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (resProgreso.ok) {
        const dataProgreso = await resProgreso.json();
        setProgreso(dataProgreso);
      }
    } catch (error) {
      console.error('Error fetching progreso:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);

    try {
      // Capture the report content
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add title and info if needed (though it's in the image)
      // pdf.setFontSize(18);
      // pdf.text(`Reporte de Progreso - ${clienteNombre}`, 10, 10);

      // Add image to PDF. If it's taller than a page, we might need multi-page logic, 
      // but for this dashboard a single page usually fits or scales down.
      // Let's scale to fit if too tall
      let finalHeight = imgHeight;
      let finalWidth = imgWidth;
      
      if (imgHeight > pdfHeight) {
         // Scale based on height instead
         const ratio = pdfHeight / imgHeight;
         finalHeight = pdfHeight;
         finalWidth = imgWidth * ratio;
      }

      pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight);
      
      // Save
      const filename = `progreso_${clienteNombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  const prepareChartData = () => {
    return valoraciones
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .map(v => ({
        fecha: formatDate(v.fecha),
        peso: v.peso,
        imc: v.imc,
        grasa: v.porcentaje_grasa,
        musculo: v.masa_muscular,
        cintura: v.perimetro_cintura
      }));
  };

  const renderTrend = (value: number | null) => {
    if (value === null || value === 0) {
      return <Minus size={20} style={{ color: 'var(--color-text-secondary)' }} />;
    }
    if (value > 0) {
      return <TrendingUp size={20} style={{ color: 'var(--color-error)' }} />;
    }
    return <TrendingDown size={20} style={{ color: 'var(--color-success)' }} />;
  };

  const renderChangeValue = (value: number | null, unit: string = '') => {
    if (value === null) return '-';
    const sign = value > 0 ? '+' : '';
    const color = value > 0 ? 'var(--color-error)' : value < 0 ? 'var(--color-success)' : 'var(--color-text-secondary)';
    
    // Invert logic for muscle mass (positive is good)
    // Pero como esta funcion es generica, mejor la ajusto en el renderizado especifico o creo un prop
    return (
      <span style={{ color, fontWeight: '600' }}>
        {sign}{value.toFixed(1)}{unit}
      </span>
    );
  };
  
  // Custom render for muscle which is good when positive
  const renderMuscleChange = (value: number | null) => {
      if (value === null) return '-';
      const sign = value > 0 ? '+' : '';
      const color = value > 0 ? 'var(--color-success)' : value < 0 ? 'var(--color-error)' : 'var(--color-text-secondary)';
      return (
        <span style={{ color, fontWeight: '600' }}>
          {sign}{value.toFixed(1)}{' kg'}
        </span>
      );
  }

  if (loading) {
    return (
      <div className="gym-modal-overlay" onClick={onClose}>
        <div className="gym-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            Cargando progreso...
          </div>
        </div>
      </div>
    );
  }

  if (!progreso || progreso.mensaje) {
    return (
      <div className="gym-modal-overlay" onClick={onClose}>
        <div className="gym-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
          <div className="gym-modal-header">
            <h2 className="gym-modal-title">Progreso de {clienteNombre}</h2>
            <button onClick={onClose} className="gym-modal-close">
              <X size={24} />
            </button>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            {progreso?.mensaje || 'No hay datos de progreso disponibles'}
          </div>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="gym-modal-overlay" onClick={onClose}>
      <div className="gym-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1200px', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="gym-modal-header">
          <h2 className="gym-modal-title">
            <TrendingUp size={24} style={{ marginRight: '0.5rem', color: 'var(--color-primary)' }} />
            Progreso de {clienteNombre}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={generatePDF} 
              disabled={exporting}
              className="gym-button gym-button-secondary"
              style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
            >
              <Download size={16} />
              {exporting ? 'Generando...' : 'PDF'}
            </button>
            <button onClick={onClose} className="gym-modal-close">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content to be captured */}
        <div ref={reportRef} style={{ padding: '1.5rem', background: 'var(--color-surface)' }}>
          {/* Header Info for PDF */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center', display: exporting ? 'block' : 'none' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Reporte de Progreso</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Cliente: {clienteNombre} | Fecha: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Resumen de Cambios */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {/* Peso */}
            <div className="gym-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="gym-stat-card-label">Peso</span>
                {renderTrend(progreso.cambios.peso)}
              </div>
              <div className="gym-stat-card-value">
                {renderChangeValue(progreso.cambios.peso, ' kg')}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                {progreso.primera_valoracion.peso} → {progreso.ultima_valoracion.peso} kg
              </div>
            </div>

            {/* IMC */}
            <div className="gym-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="gym-stat-card-label">IMC</span>
                {renderTrend(progreso.cambios.imc)}
              </div>
              <div className="gym-stat-card-value">
                {renderChangeValue(progreso.cambios.imc)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                {progreso.primera_valoracion.imc?.toFixed(1)} → {progreso.ultima_valoracion.imc?.toFixed(1)}
              </div>
            </div>

            {/* % Grasa */}
            {progreso.cambios.porcentaje_grasa !== null && (
              <div className="gym-stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="gym-stat-card-label">% Grasa</span>
                  {renderTrend(progreso.cambios.porcentaje_grasa)}
                </div>
                <div className="gym-stat-card-value">
                  {renderChangeValue(progreso.cambios.porcentaje_grasa, '%')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  {progreso.primera_valoracion.porcentaje_grasa}% → {progreso.ultima_valoracion.porcentaje_grasa}%
                </div>
              </div>
            )}

            {/* Masa Muscular */}
            {progreso.cambios.masa_muscular !== null && (
              <div className="gym-stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="gym-stat-card-label">Masa Muscular</span>
                  {/* Logic for trend: if gain (positive) -> up arrow (green/good for muscle) */}
                   {progreso.cambios.masa_muscular > 0 
                     ? <TrendingUp size={20} style={{ color: 'var(--color-success)' }} />
                     : <TrendingDown size={20} style={{ color: 'var(--color-error)' }} />
                   }
                </div>
                <div className="gym-stat-card-value">
                  {renderMuscleChange(progreso.cambios.masa_muscular)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                  {progreso.primera_valoracion.masa_muscular} → {progreso.ultima_valoracion.masa_muscular} kg
                </div>
              </div>
            )}

            {/* Período */}
            <div style={{
              background: 'var(--color-primary)',
              color: 'white',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: 'var(--box-shadow)'
            }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                Período de Seguimiento
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                {progreso.dias_transcurridos} días
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '0.25rem' }}>
                {progreso.total_valoraciones} valoraciones
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {chartData.length > 1 && (
              <>
                {/* Gráfico de Peso */}
                <div style={{ 
                  background: 'var(--color-surface)',
                  padding: '1.5rem',
                  borderRadius: 'var(--border-radius-lg)',
                  border: '1px solid var(--color-border)'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                    Evolución del Peso
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="fecha" stroke="var(--color-text-secondary)" />
                      <YAxis stroke="var(--color-text-secondary)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--color-surface)', 
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-primary)'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="peso" 
                        stroke="var(--color-primary)" 
                        strokeWidth={2}
                        name="Peso (kg)"
                        dot={{ fill: 'var(--color-primary)', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Composición Corporal */}
                {chartData.some(d => d.grasa || d.musculo) && (
                  <div style={{ 
                    background: 'var(--color-surface)',
                    padding: '1.5rem',
                    borderRadius: 'var(--border-radius-lg)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                      Composición Corporal
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis dataKey="fecha" stroke="var(--color-text-secondary)" />
                        <YAxis stroke="var(--color-text-secondary)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-surface)', 
                            borderColor: 'var(--color-border)',
                            color: 'var(--color-text-primary)'
                          }} 
                        />
                        <Legend />
                        {chartData.some(d => d.grasa) && (
                          <Line 
                            type="monotone" 
                            dataKey="grasa" 
                            stroke="var(--color-error)" 
                            strokeWidth={2}
                            name="% Grasa"
                            dot={{ fill: 'var(--color-error)', r: 4 }}
                          />
                        )}
                        {chartData.some(d => d.musculo) && (
                          <Line 
                            type="monotone" 
                            dataKey="musculo" 
                            stroke="var(--color-success)" 
                            strokeWidth={2}
                            name="Masa Muscular (kg)"
                            dot={{ fill: 'var(--color-success)', r: 4 }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
