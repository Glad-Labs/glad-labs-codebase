/**
 * Unified Services Panel
 *
 * Modern React dashboard showcasing all Phase 4 unified services
 * Displays service metadata, capabilities, phases, and enables live action execution
 *
 * Services:
 * - Content Service: Content generation, critique, refinement
 * - Financial Service: Cost tracking, budget optimization, analysis
 * - Market Service: Trend analysis, opportunity identification, competitive analysis
 * - Compliance Service: Legal review, auditing, risk assessment
 *
 * @component
 */

import React, { useState, useEffect } from 'react';
import phase4Client from '../../services/phase4Client';
import '../../styles/UnifiedServicesPanel.css';

/**
 * Service Card Component
 * Displays metadata and actions for a single service
 */
const ServiceCard = ({ service, onExecuteAction }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      content: '#4CAF50',
      financial: '#2196F3',
      market: '#FF9800',
      compliance: '#E91E63',
    };
    return colors[category] || '#757575';
  };

  const handleExecuteAction = async () => {
    try {
      setLoading(true);
      setError(null);
      await onExecuteAction(service.name);
    } catch (err) {
      setError(err.message || 'Failed to execute action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="service-card"
      style={{ borderLeftColor: getCategoryBadgeColor(service.category) }}
    >
      <div className="service-header" onClick={handleExpandToggle}>
        <div className="service-header-content">
          <div className="service-title-section">
            <h3 className="service-name">{service.name}</h3>
            <span
              className="service-category-badge"
              style={{
                backgroundColor: getCategoryBadgeColor(service.category),
              }}
            >
              {service.category}
            </span>
          </div>
          <p className="service-description">{service.description}</p>
        </div>
        <div className="service-expand-icon">{expanded ? '▼' : '▶'}</div>
      </div>

      {expanded && (
        <div className="service-details">
          {/* Phases Section */}
          <div className="details-section">
            <h4>Phases</h4>
            <div className="phases-grid">
              {service.phases && service.phases.length > 0 ? (
                service.phases.map((phase) => (
                  <span key={phase} className="phase-badge">
                    {phase}
                  </span>
                ))
              ) : (
                <p className="no-data">No phases defined</p>
              )}
            </div>
          </div>

          {/* Capabilities Section */}
          <div className="details-section">
            <h4>Capabilities</h4>
            <div className="capabilities-list">
              {service.capabilities && service.capabilities.length > 0 ? (
                <ul>
                  {service.capabilities.map((capability) => (
                    <li key={capability} className="capability-item">
                      {capability}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No capabilities defined</p>
              )}
            </div>
          </div>

          {/* Metadata Section */}
          <div className="details-section">
            <h4>Details</h4>
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="label">Version:</span>
                <span className="value">{service.version || 'N/A'}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Status:</span>
                <span className="value status-active">Active</span>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="service-actions">
            <button
              className="btn btn-primary"
              onClick={handleExecuteAction}
              disabled={loading}
            >
              {loading ? 'Executing...' : 'Execute Action'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Capability Filter Component
 * Allows filtering services by capability
 */
const CapabilityFilter = ({
  allCapabilities,
  selectedCapabilities,
  onFilterChange,
}) => {
  return (
    <div className="filter-section">
      <h4>Filter by Capability</h4>
      <div className="filter-tags">
        {allCapabilities.map((capability) => (
          <button
            key={capability}
            className={`filter-tag ${selectedCapabilities.includes(capability) ? 'active' : ''}`}
            onClick={() => {
              const updated = selectedCapabilities.includes(capability)
                ? selectedCapabilities.filter((c) => c !== capability)
                : [...selectedCapabilities, capability];
              onFilterChange(updated);
            }}
          >
            {capability}
          </button>
        ))}
        {selectedCapabilities.length > 0 && (
          <button
            className="filter-tag clear"
            onClick={() => onFilterChange([])}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Phase Filter Component
 */
const PhaseFilter = ({ allPhases, selectedPhases, onFilterChange }) => {
  return (
    <div className="filter-section">
      <h4>Filter by Phase</h4>
      <div className="filter-tags">
        {allPhases.map((phase) => (
          <button
            key={phase}
            className={`filter-tag phase ${selectedPhases.includes(phase) ? 'active' : ''}`}
            onClick={() => {
              const updated = selectedPhases.includes(phase)
                ? selectedPhases.filter((p) => p !== phase)
                : [...selectedPhases, phase];
              onFilterChange(updated);
            }}
          >
            {phase}
          </button>
        ))}
        {selectedPhases.length > 0 && (
          <button
            className="filter-tag clear"
            onClick={() => onFilterChange([])}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Main Unified Services Panel Component
 */
const UnifiedServicesPanel = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [healthStatus, setHealthStatus] = useState(null);

  // Fetch services on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get health check
        const health = await phase4Client.healthCheck();
        setHealthStatus(health);

        // Get service registry (using agents registry since services are indexed as agents)
        const response =
          await phase4Client.serviceRegistryClient.listServices();

        // Extract agents from response - { agents: [...], categories: {...}, phases: {...} }
        const agentsList = response.agents || [];

        // Transform agent data to service format
        const transformedServices = agentsList.map((agent) => ({
          id: agent.name,
          name: agent.name,
          category: agent.category || 'general',
          description: agent.description || 'No description',
          phases: agent.phases || [],
          capabilities: agent.capabilities || [],
          version: agent.version || '1.0.0',
          actions: agent.actions || [],
        }));

        setServices(transformedServices);
      } catch (err) {
        const errorMessage = err.message || 'Failed to load services';
        setError(`Error loading services: ${errorMessage}`);
        console.error('UnifiedServicesPanel error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get all unique capabilities and phases for filtering
  const allCapabilities = Array.from(
    new Set(services.flatMap((s) => s.capabilities))
  ).sort();

  const allPhases = Array.from(
    new Set(services.flatMap((s) => s.phases))
  ).sort();

  // Filter services based on selected filters and search
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === '' ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCapabilities =
      selectedCapabilities.length === 0 ||
      selectedCapabilities.some((cap) => service.capabilities.includes(cap));

    const matchesPhases =
      selectedPhases.length === 0 ||
      selectedPhases.some((phase) => service.phases.includes(phase));

    return matchesSearch && matchesCapabilities && matchesPhases;
  });

  // Handle action execution
  const handleExecuteAction = async (serviceName) => {
    console.log(`Execute action for service: ${serviceName}`);
    // This would open a modal or panel for selecting and executing specific actions
    // For now, just log it
  };

  if (loading) {
    return (
      <div className="unified-services-panel">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading unified services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-services-panel">
      {/* Header */}
      <div className="panel-header">
        <h1>Unified Services</h1>
        <p className="panel-subtitle">
          Phase 4 Architecture - Integrated service discovery and execution
        </p>

        {healthStatus && (
          <div
            className={`health-status ${healthStatus.healthy ? 'healthy' : 'unhealthy'}`}
          >
            <span className="health-indicator"></span>
            <span>
              {healthStatus.healthy
                ? 'All systems operational'
                : 'Service issues detected'}
            </span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Controls Section */}
      <div className="controls-section">
        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search services by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Filters */}
        <div className="filters-container">
          <CapabilityFilter
            allCapabilities={allCapabilities}
            selectedCapabilities={selectedCapabilities}
            onFilterChange={setSelectedCapabilities}
          />
          <PhaseFilter
            allPhases={allPhases}
            selectedPhases={selectedPhases}
            onFilterChange={setSelectedPhases}
          />
        </div>
      </div>

      {/* Services Display */}
      <div className="services-section">
        {filteredServices.length > 0 ? (
          <>
            <div className="services-count">
              Showing {filteredServices.length} of {services.length} services
            </div>
            <div className="services-grid">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onExecuteAction={handleExecuteAction}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <span className="no-results-icon">🔭</span>
            <h3>No services found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="panel-footer">
        <div className="footer-info">
          <div className="info-item">
            <strong>{services.length}</strong> Total Services
          </div>
          <div className="info-item">
            <strong>{allCapabilities.length}</strong> Capabilities
          </div>
          <div className="info-item">
            <strong>{allPhases.length}</strong> Processing Phases
          </div>
        </div>
        <p className="footer-text">
          Phase 4 unified architecture | Real-time service discovery | Dynamic
          capability matching
        </p>
      </div>
    </div>
  );
};

export default UnifiedServicesPanel;
