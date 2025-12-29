/**
 * CostBreakdownCards.jsx
 *
 * Cost Breakdown Visualization Component
 * Displays cost distribution by pipeline phase and AI model
 *
 * Integrates with Phase 1 cost calculator data:
 * - cost_by_phase: research, draft, assess, refine, finalize
 * - cost_by_model: ollama, gpt-3.5, gpt-4, claude
 *
 * Used in: ExecutiveDashboard, CostMetricsDashboard
 * Data source: analytics/kpis endpoint or dedicated cost endpoints
 */

import React from 'react';
import './CostBreakdownCards.css';

const CostBreakdownCards = ({ costByPhase = {}, costByModel = {} }) => {
  // Calculate totals and percentages for phases
  const totalPhase = Object.values(costByPhase).reduce((sum, val) => sum + (val || 0), 0);
  const phaseItems = Object.entries(costByPhase)
    .map(([phase, cost]) => ({
      phase: phase.charAt(0).toUpperCase() + phase.slice(1),
      cost,
      percentage: totalPhase > 0 ? ((cost / totalPhase) * 100).toFixed(1) : 0,
    }))
    .filter(item => item.cost > 0)
    .sort((a, b) => b.cost - a.cost);

  // Calculate totals and percentages for models
  const totalModel = Object.values(costByModel).reduce((sum, val) => sum + (val || 0), 0);
  const modelItems = Object.entries(costByModel)
    .map(([model, cost]) => ({
      model: model.charAt(0).toUpperCase() + model.slice(1),
      cost,
      percentage: totalModel > 0 ? ((cost / totalModel) * 100).toFixed(1) : 0,
    }))
    .filter(item => item.cost > 0)
    .sort((a, b) => b.cost - a.cost);

  // Color mapping for phases
  const phaseColors = {
    research: '#3498db',
    draft: '#e74c3c',
    assess: '#f39c12',
    refine: '#27ae60',
    finalize: '#9b59b6',
    other: '#95a5a6',
  };

  // Color mapping for models
  const modelColors = {
    ollama: '#27ae60',
    'gpt-3.5': '#3498db',
    'gpt-4': '#e74c3c',
    claude: '#f39c12',
  };

  const getPhaseColor = (phase) => phaseColors[phase.toLowerCase()] || '#95a5a6';
  const getModelColor = (model) => modelColors[model.toLowerCase()] || '#95a5a6';

  if (Object.keys(costByPhase).length === 0 && Object.keys(costByModel).length === 0) {
    return (
      <div className="cost-breakdown-empty">
        <p>No cost data available</p>
      </div>
    );
  }

  return (
    <div className="cost-breakdown-section">
      <h2>Cost Breakdown Analysis</h2>

      <div className="breakdown-grid">
        {/* Cost by Phase */}
        {phaseItems.length > 0 && (
          <div className="breakdown-card phase-card">
            <div className="card-header">
              <h3>💰 By Pipeline Phase</h3>
              <div className="card-total">${totalPhase.toFixed(6)}</div>
            </div>

            <div className="breakdown-list">
              {phaseItems.map((item) => (
                <div key={item.phase} className="breakdown-item">
                  <div className="item-header">
                    <div className="item-label">
                      <div
                        className="color-indicator"
                        style={{ backgroundColor: getPhaseColor(item.phase) }}
                      />
                      <span className="label-text">{item.phase}</span>
                    </div>
                    <div className="item-value">
                      <span className="percentage">{item.percentage}%</span>
                      <span className="cost">${item.cost.toFixed(6)}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: getPhaseColor(item.phase),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="breakdown-note">
              Cost calculation based on phase token estimates and model pricing
            </div>
          </div>
        )}

        {/* Cost by Model */}
        {modelItems.length > 0 && (
          <div className="breakdown-card model-card">
            <div className="card-header">
              <h3>🤖 By AI Model</h3>
              <div className="card-total">${totalModel.toFixed(6)}</div>
            </div>

            <div className="breakdown-list">
              {modelItems.map((item) => (
                <div key={item.model} className="breakdown-item">
                  <div className="item-header">
                    <div className="item-label">
                      <div
                        className="color-indicator"
                        style={{ backgroundColor: getModelColor(item.model) }}
                      />
                      <span className="label-text">{item.model}</span>
                    </div>
                    <div className="item-value">
                      <span className="percentage">{item.percentage}%</span>
                      <span className="cost">${item.cost.toFixed(6)}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: getModelColor(item.model),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="breakdown-note">
              Pricing: Ollama free | GPT-3.5 $0.00175/1K | GPT-4 $0.045/1K | Claude $0.015-$0.045/1K
            </div>
          </div>
        )}
      </div>

      {/* Cost Summary Stats */}
      <div className="cost-summary">
        <div className="summary-stat">
          <span className="stat-label">Total Phase Cost:</span>
          <span className="stat-value">${totalPhase.toFixed(6)}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Total Model Cost:</span>
          <span className="stat-value">${totalModel.toFixed(6)}</span>
        </div>
        <div className="summary-stat">
          <span className="stat-label">Combined Cost:</span>
          <span className="stat-value">${(totalPhase + totalModel).toFixed(6)}</span>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdownCards;
