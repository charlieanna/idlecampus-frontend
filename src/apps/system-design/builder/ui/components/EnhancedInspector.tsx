import React, { useState } from 'react';
import { Node } from 'reactflow';
import { SystemGraph } from '../../types/graph';
import { DatabaseCategory } from '../../types/component';
import { isDatabaseComponentType, inferDatabaseCategory, inferDatabaseType } from '../../utils/database';

interface InspectorProps {
  node?: Node | null;
  selectedNode?: Node | null;
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
  onBack?: () => void;
  isModal?: boolean;
  availableAPIs?: string[]; // List of available APIs for assignment
}

interface ConfigPreset {
  name: string;
  description: string;
  config: Record<string, any>;
  icon: string;
}

export function EnhancedInspector({
  node,
  selectedNode,
  systemGraph,
  onUpdateConfig,
  onBack,
  isModal = false,
  availableAPIs = [],
}: InspectorProps) {
  // Support both 'node' and 'selectedNode' props for backward compatibility
  const activeNode = node || selectedNode;
  const [expandedSection, setExpandedSection] = useState<string>('basic');

  if (!activeNode) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Inspector</h2>
        <p className="text-sm text-gray-500">
          Select a component to configure its properties
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Click any component on the canvas to configure
            its capacity, cost, and performance settings.
          </p>
        </div>
      </div>
    );
  }

  const component = systemGraph.components.find((c) => c.id === activeNode.id);
  if (!component) return null;

  const databaseComponent = isDatabaseComponentType(component.type);
  const defaultDatabaseType = databaseComponent ? inferDatabaseType(component) : undefined;
  const defaultDbCategory = databaseComponent
    ? inferDatabaseCategory(component)
    : undefined;

  const handleChange = (key: string, value: any) => {
    onUpdateConfig(activeNode.id, { ...component.config, [key]: value });
  };

  const applyPreset = (preset: Record<string, any>) => {
    onUpdateConfig(activeNode.id, { ...component.config, ...preset });
  };

  // Calculate estimated cost for current config
  const calculateCost = (): number => {
    if (databaseComponent) {
      // Commodity database: $146/mo base
      const baseCost = 146;
      const replication = component.config.replication;
      const sharding = component.config.sharding;
      
      // Calculate replicas
      let replicas = 0;
      if (replication) {
        if (typeof replication === 'boolean') {
          replicas = replication ? 1 : 0;
        } else if (replication.enabled) {
          replicas = replication.replicas || 1;
        }
      }
      
      // Calculate shards
      const shards = sharding?.enabled ? (sharding.shards || 1) : 1;
      
      // Total cost = base × (1 + replicas) × shards
      const storageCost = (component.config.storageSizeGB || 100) * 0.1;
      return baseCost * (1 + replicas) * shards + storageCost;
    }

    switch (component.type) {
      case 'app_server':
        return (component.config.instances || 1) * 110; // Commodity app server cost
      case 'redis':
        return (component.config.memorySizeGB || 4) * 50;
      case 'message_queue':
        return (component.config.numBrokers || 3) * 100;
      case 'load_balancer':
        return 50;
      case 'cdn':
        return 0; // Pay per use
      case 's3':
        return (component.config.storageSizeGB || 100) * 0.023;
      default:
        return 0;
    }
  };

  const estimatedCost = calculateCost();

  return (
    <div className="h-full flex flex-col">
      {/* Header - Only show if not in modal (modal has its own header) */}
      {!isModal && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {activeNode.data.label}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {getComponentTypeLabel(component.type)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-green-600">
                ${estimatedCost.toFixed(0)}/mo
              </div>
              <div className="text-xs text-gray-500">Estimated cost</div>
            </div>
          </div>

        </div>
      )}

      {/* Configuration Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* App Server Config */}
        {component.type === 'app_server' && (
          <AppServerConfig
            config={component.config}
            onChange={handleChange}
            onApplyPreset={applyPreset}
            availableAPIs={availableAPIs}
          />
        )}

        {/* Database Config */}
        {databaseComponent && (
          <DatabaseConfig
            config={component.config}
            onChange={handleChange}
            onApplyPreset={applyPreset}
            defaultDatabaseType={defaultDatabaseType || 'postgresql'}
            defaultDbCategory={defaultDbCategory || 'sql'}
          />
        )}

        {/* Cache Config */}
        {component.type === 'cache' && (
          <CacheConfig
            config={component.config}
            onChange={handleChange}
            onApplyPreset={applyPreset}
          />
        )}

        {/* Message Queue Config */}
        {component.type === 'message_queue' && (
          <MessageQueueConfig
            config={component.config}
            onChange={handleChange}
            onApplyPreset={applyPreset}
          />
        )}

        {/* CDN Config */}
        {component.type === 'cdn' && (
          <CDNConfig
            config={component.config}
            onChange={handleChange}
          />
        )}

        {/* S3 Config */}
        {component.type === 's3' && (
          <S3Config
            config={component.config}
            onChange={handleChange}
          />
        )}

        {/* Load Balancer Config */}
        {component.type === 'load_balancer' && (
          <LoadBalancerConfig config={component.config} />
        )}
      </div>

      {/* Footer - Component Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <details className="text-xs">
          <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
            Component Details
          </summary>
          <div className="mt-2 space-y-1 text-gray-600">
            <p><strong>ID:</strong> <span className="font-mono">{component.id}</span></p>
            <p><strong>Type:</strong> {component.type}</p>
            <p><strong>Config Keys:</strong> {Object.keys(component.config).length}</p>
          </div>
        </details>
      </div>
    </div>
  );
}

// ============================================================================
// App Server Configuration
// ============================================================================

interface ConfigProps {
  config: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onApplyPreset?: (preset: Record<string, any>) => void;
  availableAPIs?: string[];
}

interface DatabaseConfigProps extends ConfigProps {
  defaultDatabaseType: string;
  defaultDbCategory: DatabaseCategory;
}

function AppServerConfig({ config, onChange, onApplyPreset, availableAPIs = [] }: ConfigProps) {
  const instances = config.instances || 1;
  const capacity = instances * 1000; // Fixed: 1000 RPS per commodity instance
  const cost = instances * 110; // Fixed: $110/mo per commodity instance
  const handledAPIs = config.handledAPIs || [];
  const lbStrategy = config.lbStrategy || 'round-robin';

  const handleAPIToggle = (api: string) => {
    const currentAPIs = config.handledAPIs || [];
    const newAPIs = currentAPIs.includes(api)
      ? currentAPIs.filter((a: string) => a !== api)
      : [...currentAPIs, api];
    onChange('handledAPIs', newAPIs);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Configuration</h3>

      {/* Instances Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Instances
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={instances}
          onChange={(e) => onChange('instances', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-blue-600">{instances}</span>
          <div className="text-right">
            <div className="text-xs text-gray-500">Capacity</div>
            <div className="text-sm font-semibold text-gray-900">
              {capacity.toLocaleString()} RPS
            </div>
          </div>
        </div>
      </div>

      {/* Load Balancing Strategy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Load Balancing Strategy
        </label>
        <select
          value={lbStrategy}
          onChange={(e) => onChange('lbStrategy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="round-robin">Round Robin - Even distribution</option>
          <option value="least-connections">Least Connections - Balance active connections</option>
          <option value="ip-hash">IP Hash - Sticky sessions per client</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {lbStrategy === 'round-robin' && 'Distributes requests evenly across all instances'}
          {lbStrategy === 'least-connections' && 'Routes to instance with fewest active connections'}
          {lbStrategy === 'ip-hash' && 'Same client always goes to same instance (session affinity)'}
        </p>
      </div>

      {/* Commodity Server Specs */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">🖥️ Commodity Server Specs (Fixed)</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>vCPU:</span>
            <span className="font-semibold">8 cores</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="font-semibold">64 GB RAM</span>
          </div>
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="font-semibold">2 TB SSD</span>
          </div>
          <div className="flex justify-between">
            <span>Capacity:</span>
            <span className="font-semibold">1,000 RPS</span>
          </div>
          <div className="flex justify-between">
            <span>Cost:</span>
            <span className="font-semibold">$110/mo</span>
          </div>
        </div>
      </div>

      {/* Impact Card */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">💡 Total Capacity</div>
        <div className="space-y-1 text-xs text-blue-800">
          <div className="flex justify-between">
            <span>Total RPS:</span>
            <span className="font-semibold">{capacity.toLocaleString()} RPS</span>
          </div>
          <div className="flex justify-between">
            <span>Instances:</span>
            <span className="font-semibold">{instances} × 1,000 RPS</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Cost:</span>
            <span className="font-semibold">${cost}/month</span>
          </div>
          <div className="flex justify-between">
            <span>Base Latency:</span>
            <span className="font-semibold">10ms</span>
          </div>
        </div>
      </div>

      {/* Warning if instances = 1 */}
      {instances === 1 && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-xs font-medium text-yellow-900 mb-1">
            ⚠️ Single Point of Failure
          </div>
          <p className="text-xs text-yellow-800">
            With only 1 instance, your system has no redundancy. Consider using
            at least 2 instances for production.
          </p>
        </div>
      )}

      {/* API Assignment Section */}
      {availableAPIs.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Assignment
          </label>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-600 mb-2">
              Select which APIs this server should handle:
            </div>
            <div className="space-y-2">
              {availableAPIs.map((api) => (
                <label key={api} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={handledAPIs.includes(api)}
                    onChange={() => handleAPIToggle(api)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-mono text-gray-700">{api}</span>
                </label>
              ))}
            </div>
            {handledAPIs.length === 0 && (
              <div className="mt-2 text-xs text-gray-500 italic">
                No APIs assigned - this server will handle all requests
              </div>
            )}
            {handledAPIs.length > 0 && (
              <div className="mt-2 text-xs text-green-700">
                ✓ Handling {handledAPIs.length} API{handledAPIs.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Generic Database Configuration with Type Selector
// ============================================================================

function DatabaseConfig({
  config,
  onChange,
  onApplyPreset,
  defaultDatabaseType,
  defaultDbCategory,
}: DatabaseConfigProps) {
  const dataModel = config.dataModel || 'relational';
  const [activeSection, setActiveSection] = React.useState<'schema' | 'model' | 'replication'>('schema');

  // Schema state
  const [tables, setTables] = React.useState<any[]>(config.schema || []);
  const [foreignKeys, setForeignKeys] = React.useState<any[]>(config.foreignKeys || []);

  // Auto-configuration for each data model
  const autoConfigurations: Record<string, any> = {
    relational: {
      replication: 'single-leader',
      replicas: 2,
      isolation: 'read-committed',
      sharding: false,
      consistency: 'strong',
      indexType: 'b-tree',
    },
    document: {
      sharding: true,
      shards: 3,
      replicationFactor: 3,
      consistency: 'eventual',
      indexes: 'auto',
      writeQuorum: 'majority',
    },
    'wide-column': {
      nodes: 3,
      replicationFactor: 3,
      consistency: 'eventual',
      compaction: 'size-tiered',
      writeConsistency: 'quorum',
    },
    graph: {
      sharding: 'by-vertex',
      replicas: 2,
      traversalDepth: 3,
      indexStrategy: 'node-properties',
      consistency: 'eventual',
    },
    'key-value': {
      memorySizeGB: 8,
      replicationFactor: 3,
      consistency: 'eventual',
      evictionPolicy: 'lru',
      persistence: true,
    },
  };

  const updateConfig = (key: string, value: any) => {
    onChange(key, value);
  };

  const handleDataModelChange = (model: string) => {
    onChange('dataModel', model);
    // Apply auto-configuration for the selected model
    const autoConfig = autoConfigurations[model];
    Object.entries(autoConfig).forEach(([key, value]) => {
      onChange(key, value);
    });
  };

  // Schema management functions
  const handleAddTable = () => {
    const newTable = {
      name: `table_${tables.length + 1}`,
      columns: [
        { name: 'id', type: 'integer', primaryKey: true, nullable: false }
      ]
    };
    const updatedTables = [...tables, newTable];
    setTables(updatedTables);
    updateConfig('schema', updatedTables);
  };

  const handleRemoveTable = (index: number) => {
    const updatedTables = tables.filter((_, i) => i !== index);
    setTables(updatedTables);
    updateConfig('schema', updatedTables);
    // Also remove any foreign keys referencing this table
    const tableName = tables[index].name;
    const updatedFks = foreignKeys.filter(
      fk => fk.fromTable !== tableName && fk.toTable !== tableName
    );
    setForeignKeys(updatedFks);
    updateConfig('foreignKeys', updatedFks);
  };

  const handleAddColumn = (tableIndex: number) => {
    const newColumn = {
      name: `column_${tables[tableIndex].columns.length + 1}`,
      type: 'string',
      nullable: true
    };
    const updatedTables = [...tables];
    updatedTables[tableIndex].columns.push(newColumn);
    setTables(updatedTables);
    updateConfig('schema', updatedTables);
  };

  const handleRemoveColumn = (tableIndex: number, columnIndex: number) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].columns.splice(columnIndex, 1);
    setTables(updatedTables);
    updateConfig('schema', updatedTables);
  };

  const handleAddForeignKey = () => {
    const newFk = { fromTable: '', toTable: '' };
    const updatedFks = [...foreignKeys, newFk];
    setForeignKeys(updatedFks);
    updateConfig('foreignKeys', updatedFks);
  };

  const handleRemoveForeignKey = (index: number) => {
    const updatedFks = foreignKeys.filter((_, i) => i !== index);
    setForeignKeys(updatedFks);
    updateConfig('foreignKeys', updatedFks);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 p-2">
          <button
            onClick={() => setActiveSection('schema')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'schema'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            📊 Schema
          </button>
          <button
            onClick={() => setActiveSection('model')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'model'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            💾 Data Model
          </button>
          <button
            onClick={() => setActiveSection('replication')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'replication'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            🔄 Replication & Scaling
          </button>
        </div>
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'schema' && (
          <div className="space-y-4">
            {/* Schema Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Database Schema</h3>
              <button
                onClick={handleAddTable}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add Table
              </button>
            </div>

            {/* Tables List */}
            {tables.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-2">No tables defined yet</p>
                <p className="text-sm text-gray-400">Click "Add Table" to create your first table</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tables.map((table, tableIndex) => (
                  <div key={tableIndex} className="border border-gray-200 rounded-lg">
                    {/* Table Header */}
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <input
                        type="text"
                        value={table.name}
                        onChange={(e) => {
                          const newTables = [...tables];
                          newTables[tableIndex].name = e.target.value;
                          setTables(newTables);
                          updateConfig('schema', newTables);
                        }}
                        className="text-sm font-medium bg-transparent border-b border-transparent hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                        placeholder="Table name"
                      />
                      <button
                        onClick={() => handleRemoveTable(tableIndex)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Table Columns */}
                    <div className="p-4">
                      <div className="space-y-2">
                        {table.columns.map((column: any, columnIndex: number) => (
                          <div key={columnIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <input
                              type="text"
                              value={column.name}
                              onChange={(e) => {
                                const newTables = [...tables];
                                newTables[tableIndex].columns[columnIndex].name = e.target.value;
                                setTables(newTables);
                                updateConfig('schema', newTables);
                              }}
                              className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded"
                              placeholder="Column name"
                            />
                            <select
                              value={column.type}
                              onChange={(e) => {
                                const newTables = [...tables];
                                newTables[tableIndex].columns[columnIndex].type = e.target.value;
                                setTables(newTables);
                                updateConfig('schema', newTables);
                              }}
                              className="text-sm px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="string">String</option>
                              <option value="integer">Integer</option>
                              <option value="bigint">BigInt</option>
                              <option value="decimal">Decimal</option>
                              <option value="boolean">Boolean</option>
                              <option value="timestamp">Timestamp</option>
                              <option value="json">JSON</option>
                              <option value="text">Text</option>
                            </select>
                            <label className="flex items-center gap-1 text-xs">
                              <input
                                type="checkbox"
                                checked={column.primaryKey || false}
                                onChange={(e) => {
                                  const newTables = [...tables];
                                  newTables[tableIndex].columns[columnIndex].primaryKey = e.target.checked;
                                  setTables(newTables);
                                  updateConfig('schema', newTables);
                                }}
                              />
                              PK
                            </label>
                            <label className="flex items-center gap-1 text-xs">
                              <input
                                type="checkbox"
                                checked={column.nullable !== false}
                                onChange={(e) => {
                                  const newTables = [...tables];
                                  newTables[tableIndex].columns[columnIndex].nullable = e.target.checked;
                                  setTables(newTables);
                                  updateConfig('schema', newTables);
                                }}
                              />
                              Nullable
                            </label>
                            <button
                              onClick={() => handleRemoveColumn(tableIndex, columnIndex)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => handleAddColumn(tableIndex)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        + Add Column
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Foreign Keys Section */}
            {tables.length > 1 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Foreign Keys</h4>
                <div className="space-y-2">
                  {foreignKeys.map((fk, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <select
                        value={fk.fromTable}
                        onChange={(e) => {
                          const newFks = [...foreignKeys];
                          newFks[index].fromTable = e.target.value;
                          setForeignKeys(newFks);
                          updateConfig('foreignKeys', newFks);
                        }}
                        className="text-sm px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="">From Table</option>
                        {tables.map((t: any) => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                      <span className="text-xs text-gray-500">→</span>
                      <select
                        value={fk.toTable}
                        onChange={(e) => {
                          const newFks = [...foreignKeys];
                          newFks[index].toTable = e.target.value;
                          setForeignKeys(newFks);
                          updateConfig('foreignKeys', newFks);
                        }}
                        className="text-sm px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="">To Table</option>
                        {tables.map((t: any) => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRemoveForeignKey(index)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddForeignKey}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Add Foreign Key
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'model' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Model Selection</h3>
            <div className="space-y-3">
              {[
                { value: 'relational', label: 'Relational', icon: '💾', desc: 'ACID, JOINs, complex queries' },
                { value: 'document', label: 'Document', icon: '📄', desc: 'Flexible schema, JSON-like' },
                { value: 'wide-column', label: 'Wide-Column', icon: '📊', desc: 'Column families, write-heavy' },
                { value: 'graph', label: 'Graph', icon: '🔗', desc: 'Nodes & edges, traversals' },
                { value: 'key-value', label: 'Key-Value', icon: '🔑', desc: 'Simple lookups, caching' }
              ].map((model) => (
                <label
                  key={model.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    dataModel === model.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="dataModel"
                    value={model.value}
                    checked={dataModel === model.value}
                    onChange={(e) => handleDataModelChange(e.target.value)}
                    className="mt-1"
                  />
                  <span className="text-2xl">{model.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{model.label}</div>
                    <div className="text-sm text-gray-600">{model.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'replication' && (
          <div className="space-y-6">
            {/* Replication Strategy Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Replication Strategy</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How should data be replicated?
                  </label>
                  <select
                    value={config.replication || 'single-leader'}
                    onChange={(e) => updateConfig('replication', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="single-leader">Single Leader (Master-Slave)</option>
                    <option value="multi-leader">Multi Leader (Master-Master)</option>
                    <option value="leaderless">Leaderless (Dynamo-style)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {config.replication === 'single-leader' && 'One node handles writes, replicas handle reads'}
                    {config.replication === 'multi-leader' && 'Multiple nodes can accept writes, complex conflict resolution'}
                    {config.replication === 'leaderless' && 'No designated leader, quorum-based reads/writes'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Replicas
                  </label>
                  <input
                    type="number"
                    value={config.replicas || 2}
                    onChange={(e) => updateConfig('replicas', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min="0"
                    max="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    More replicas = better availability, higher cost
                  </p>
                </div>
              </div>
            </div>

            {/* Partitioning Strategy Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partitioning Strategy</h3>

              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={config.sharding || false}
                      onChange={(e) => updateConfig('sharding', e.target.checked)}
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Partitioning/Sharding</span>
                  </label>
                </div>

                {config.sharding && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        How should data be partitioned?
                      </label>
                      <select
                        value={config.partitionStrategy || 'hash'}
                        onChange={(e) => updateConfig('partitionStrategy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="range">By Key Range</option>
                        <option value="hash">By Hash of Key</option>
                        <option value="list">By List/Directory</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {config.partitionStrategy === 'range' && 'Good for range queries, risk of hotspots'}
                        {config.partitionStrategy === 'hash' && 'Even distribution, no range queries'}
                        {config.partitionStrategy === 'list' && 'Explicit control over data placement'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Partitions
                      </label>
                      <input
                        type="number"
                        value={config.shards || 3}
                        onChange={(e) => updateConfig('shards', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        min="1"
                        max="100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        More partitions = better parallelism, more complexity
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Transaction Strategy Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Strategy</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Isolation Level
                  </label>
                  <select
                    value={config.isolation || 'read-committed'}
                    onChange={(e) => updateConfig('isolation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="read-uncommitted">Read Uncommitted</option>
                    <option value="read-committed">Read Committed</option>
                    <option value="repeatable-read">Repeatable Read</option>
                    <option value="serializable">Serializable</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {config.isolation === 'read-uncommitted' && 'Fastest, allows dirty reads'}
                    {config.isolation === 'read-committed' && 'Prevents dirty reads, good default'}
                    {config.isolation === 'repeatable-read' && 'Prevents non-repeatable reads'}
                    {config.isolation === 'serializable' && 'Strongest guarantees, slowest performance'}
                  </p>
                </div>

                {config.sharding && (
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.distributedTransactions || false}
                        onChange={(e) => updateConfig('distributedTransactions', e.target.checked)}
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Distributed Transactions (2PC)</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Required for ACID across partitions, significant performance impact
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Consistency Strategy Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consistency Strategy</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consistency Model
                  </label>
                  <select
                    value={config.consistency || 'strong'}
                    onChange={(e) => updateConfig('consistency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="strong">Strong Consistency</option>
                    <option value="eventual">Eventual Consistency</option>
                    <option value="causal">Causal Consistency</option>
                    <option value="bounded-staleness">Bounded Staleness</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {config.consistency === 'strong' && 'All nodes see same data immediately'}
                    {config.consistency === 'eventual' && 'Nodes converge over time'}
                    {config.consistency === 'causal' && 'Preserves cause-and-effect relationships'}
                    {config.consistency === 'bounded-staleness' && 'Maximum lag between nodes'}
                  </p>
                </div>

                {(config.replication === 'leaderless' || config.consistency === 'eventual') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Read/Write Quorum
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={config.readQuorum || 'majority'}
                        onChange={(e) => updateConfig('readQuorum', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Read quorum"
                      />
                      <input
                        type="text"
                        value={config.writeQuorum || 'majority'}
                        onChange={(e) => updateConfig('writeQuorum', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Write quorum"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Cache Configuration with Type Selector
// ============================================================================

function CacheConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const ttl = config.ttl || 3600;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Cache Configuration</h3>

      <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
        💡 <strong>Tip:</strong> Need more capacity? Add more cache instances instead of configuring size.
      </div>

      {/* TTL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default TTL (Time To Live)
        </label>
        <select
          value={ttl}
          onChange={(e) => onChange('ttl', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        >
          <option value={60}>1 minute</option>
          <option value={300}>5 minutes</option>
          <option value={900}>15 minutes</option>
          <option value={1800}>30 minutes</option>
          <option value={3600}>1 hour</option>
          <option value={7200}>2 hours</option>
          <option value={21600}>6 hours</option>
          <option value={86400}>24 hours</option>
        </select>
      </div>

      {/* Caching Strategy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caching Strategy
        </label>
        <div className="space-y-2">
          {[
            {
              value: 'cache_aside',
              label: 'Cache-Aside (Lazy Loading)',
              icon: '📥',
              desc: 'Load data into cache only when requested'
            },
            {
              value: 'write_through',
              label: 'Write-Through',
              icon: '✍️',
              desc: 'Write to cache and database simultaneously'
            },
            {
              value: 'write_behind',
              label: 'Write-Behind (Async)',
              icon: '⏱️',
              desc: 'Write to cache first, then database asynchronously'
            },
          ].map((strategy) => (
            <label
              key={strategy.value}
              className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                config.strategy === strategy.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="strategy"
                value={strategy.value}
                checked={config.strategy === strategy.value}
                onChange={(e) => onChange('strategy', e.target.value)}
                className="mr-3 mt-1"
              />
              <span className="text-lg mr-2">{strategy.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{strategy.label}</div>
                <div className="text-xs text-gray-500 mt-1">{strategy.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-1">
          💡 Cache Tips
        </div>
        <p className="text-xs text-blue-800">
          Caches reduce database load and improve response times. Redis supports complex data structures,
          while Memcached is simpler but faster for basic key-value operations.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PostgreSQL Configuration
// ============================================================================

function PostgreSQLConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  // Always use commodity-db spec
  const instanceType = 'commodity-db';
  const isolationLevel = config.isolationLevel || 'read-committed';
  const replicationMode = config.replicationMode || 'single-leader';
  const replication = config.replication || { enabled: false, replicas: 1, mode: 'async' };
  const sharding = config.sharding || { enabled: false, shards: 1, shardKey: '' };
  const storageType = config.storageType || 'gp3';
  const storageSizeGB = config.storageSizeGB || 100;
  const primaryKey = config.primaryKey || '';
  const indexes = config.indexes || '';

  // Calculate cost based on commodity spec + replication + sharding
  const baseCost = 146; // Commodity database: $146/mo
  const replicas = replication.enabled ? (replication.replicas || 1) : 0;
  const shards = sharding.enabled ? (sharding.shards || 1) : 1;
  const totalCost = baseCost * (1 + replicas) * shards;
  
  // Calculate capacity based on replication mode and sharding
  const baseCapacity = 1000; // 1000 RPS base
  let readCapacity = baseCapacity;
  let writeCapacity = baseCapacity / 10; // Writes are 10x slower
  
  if (replicationMode === 'single-leader') {
    // Read replicas scale read capacity
    readCapacity = baseCapacity * (1 + replicas);
    writeCapacity = baseCapacity / 10; // Writes only to leader
  } else if (replicationMode === 'multi-leader') {
    // Multiple leaders scale both reads and writes, but add latency
    readCapacity = baseCapacity * (1 + replicas);
    writeCapacity = (baseCapacity / 10) * (1 + replicas);
  } else if (replicationMode === 'leaderless') {
    // Quorum-based: capacity depends on quorum size
    readCapacity = baseCapacity * (1 + replicas) * 0.7; // Reduced due to quorum overhead
    writeCapacity = (baseCapacity / 10) * (1 + replicas) * 0.7;
  }
  
  // Sharding scales capacity linearly
  readCapacity *= shards;
  writeCapacity *= shards;

  const presets: ConfigPreset[] = [
    {
      name: 'Single Node',
      description: 'No replication, no sharding',
      config: {
        instanceType: 'commodity-db',
        isolationLevel: 'read-committed',
        replicationMode: 'single-leader',
        replication: { enabled: false, replicas: 0, mode: 'async' },
        sharding: { enabled: false, shards: 1, shardKey: '' },
        storageType: 'gp3',
        storageSizeGB: 100,
      },
      icon: '💰',
    },
    {
      name: 'Single-Leader',
      description: 'Read replicas for scale',
      config: {
        instanceType: 'commodity-db',
        isolationLevel: 'read-committed',
        replicationMode: 'single-leader',
        replication: { enabled: true, replicas: 2, mode: 'async' },
        sharding: { enabled: false, shards: 1, shardKey: '' },
        storageType: 'gp3',
        storageSizeGB: 100,
      },
      icon: '🔒',
    },
    {
      name: 'Multi-Leader',
      description: 'Scale writes + reads',
      config: {
        instanceType: 'commodity-db',
        isolationLevel: 'read-committed',
        replicationMode: 'multi-leader',
        replication: { enabled: true, replicas: 2, mode: 'async' },
        sharding: { enabled: false, shards: 1, shardKey: '' },
        storageType: 'gp3',
        storageSizeGB: 100,
      },
      icon: '⚡',
    },
    {
      name: 'Sharded',
      description: 'Horizontal partitioning',
      config: {
        instanceType: 'commodity-db',
        isolationLevel: 'read-committed',
        replicationMode: 'single-leader',
        replication: { enabled: true, replicas: 1, mode: 'async' },
        sharding: { enabled: true, shards: 4, shardKey: 'user_id' },
        storageType: 'gp3',
        storageSizeGB: 500,
      },
      icon: '🚀',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">PostgreSQL Configuration</h3>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset?.(preset.config)}
              className="p-2 text-left border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-lg">{preset.icon}</div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                {preset.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Model Section */}
      <div className="p-3 border-2 border-purple-200 rounded-lg bg-purple-50">
        <h4 className="text-xs font-semibold text-purple-900 mb-2">📊 Data Model</h4>

        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-purple-800 mb-1">
              Primary Key / Partition Key
            </label>
            <input
              type="text"
              value={primaryKey}
              onChange={(e) => onChange('primaryKey', e.target.value)}
              placeholder="e.g., short_code, user_id"
              className="w-full px-2 py-1 text-xs border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-purple-700 mt-1">
              How will you lookup data? This determines query performance.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-800 mb-1">
              Indexes (comma-separated)
            </label>
            <input
              type="text"
              value={indexes}
              onChange={(e) => onChange('indexes', e.target.value)}
              placeholder="e.g., created_at, user_id"
              className="w-full px-2 py-1 text-xs border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-purple-700 mt-1">
              Indexes speed up queries but slow down writes.
            </p>
          </div>
        </div>
      </div>

      {/* Commodity Database Specs */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-2">🖥️ Commodity Database Server (Fixed)</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>vCPU:</span>
            <span className="font-semibold">8 cores</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="font-semibold">64 GB RAM</span>
          </div>
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="font-semibold">2 TB SSD</span>
          </div>
          <div className="flex justify-between">
            <span>Base Capacity:</span>
            <span className="font-semibold">1,000 read RPS, 100 write RPS</span>
          </div>
          <div className="flex justify-between">
            <span>Cost:</span>
            <span className="font-semibold">$146/mo</span>
          </div>
        </div>
      </div>

      {/* Replication Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Replication Mode
        </label>
        <select
          value={replicationMode}
          onChange={(e) => onChange('replicationMode', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="single-leader">Single-Leader (Read Replicas)</option>
          <option value="multi-leader">Multi-Leader (Write Scaling)</option>
          <option value="leaderless">Leaderless (Quorum)</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {replicationMode === 'single-leader' && 'Scales reads via replicas; writes to leader only; eventual consistency for reads'}
          {replicationMode === 'multi-leader' && 'Scales reads and writes; adds 20-50ms latency for conflict resolution; weaker consistency'}
          {replicationMode === 'leaderless' && 'Quorum-based (R+W>N); tunable consistency; handles partitions well; 30% overhead'}
        </p>
      </div>

      {/* Isolation Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Isolation Level
        </label>
        <select
          value={isolationLevel}
          onChange={(e) => onChange('isolationLevel', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="read-uncommitted">Read Uncommitted - Fastest, dirty reads</option>
          <option value="read-committed">Read Committed - Default, good balance</option>
          <option value="repeatable-read">Repeatable Read - Slower, no phantom reads</option>
          <option value="serializable">Serializable - Slowest, strongest consistency</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Trade-off: Consistency vs Performance
        </p>
      </div>

      {/* Replication */}
      <div className="p-3 border border-gray-200 rounded-lg">
        <label className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            checked={replication.enabled}
            onChange={(e) => onChange('replication', {
              ...replication,
              enabled: e.target.checked,
            })}
            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">
              Enable Replication
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Adds read replicas for high availability. Survives database failures
              with automatic failover (&lt; 10s downtime).
            </p>
          </div>
        </label>

        {replication.enabled && (
          <div className="ml-6 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Number of Replicas
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={replication.replicas}
                onChange={(e) => onChange('replication', {
                  ...replication,
                  replicas: parseInt(e.target.value),
                })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cost multiplier: {1 + replication.replicas}x
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Replication Mode
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-xs">
                  <input
                    type="radio"
                    name="replicationMode"
                    value="async"
                    checked={replication.mode === 'async'}
                    onChange={(e) => onChange('replication', {
                      ...replication,
                      mode: e.target.value,
                    })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Async</span> - Fast writes,
                    eventual consistency. May lose recent data on failover.
                  </div>
                </label>
                <label className="flex items-start gap-2 text-xs">
                  <input
                    type="radio"
                    name="replicationMode"
                    value="sync"
                    checked={replication.mode === 'sync'}
                    onChange={(e) => onChange('replication', {
                      ...replication,
                      mode: e.target.value,
                    })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Sync</span> - 10x slower writes!
                    Strong consistency, no data loss.
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sharding */}
      <div className="p-3 border border-gray-200 rounded-lg">
        <label className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            checked={sharding.enabled}
            onChange={(e) => onChange('sharding', {
              ...sharding,
              enabled: e.target.checked,
            })}
            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">
              Enable Sharding
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Horizontal partitioning for massive scale. Split data across multiple databases.
            </p>
          </div>
        </label>

        {sharding.enabled && (
          <div className="ml-6 space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Number of Shards
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={sharding.shards}
                onChange={(e) => onChange('sharding', {
                  ...sharding,
                  shards: parseInt(e.target.value),
                })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Shard Key
              </label>
              <input
                type="text"
                value={sharding.shardKey}
                onChange={(e) => onChange('sharding', {
                  ...sharding,
                  shardKey: e.target.value,
                })}
                placeholder="e.g., user_id, region"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                How to distribute data across shards (e.g., hash(user_id))
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Calculated Capacity */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">💡 Total Capacity</div>
        <div className="space-y-1 text-xs text-blue-800">
          <div className="flex justify-between">
            <span>Read Capacity:</span>
            <span className="font-semibold">{Math.round(readCapacity).toLocaleString()} RPS</span>
          </div>
          <div className="flex justify-between">
            <span>Write Capacity:</span>
            <span className="font-semibold">{Math.round(writeCapacity).toLocaleString()} RPS</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Cost:</span>
            <span className="font-semibold">${totalCost}/month</span>
          </div>
          <div className="flex justify-between">
            <span>Configuration:</span>
            <span className="font-semibold">
              {replication.enabled ? `${1 + replicas} nodes` : '1 node'}
              {sharding.enabled ? ` × ${shards} shards` : ''}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {replicationMode === 'single-leader' && 'Reads scale with replicas; writes to leader only'}
          {replicationMode === 'multi-leader' && 'Both reads and writes scale; +20-50ms latency'}
          {replicationMode === 'leaderless' && 'Quorum-based; 30% overhead for coordination'}
        </p>
      </div>

      {/* Storage Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Storage Type
        </label>
        <select
          value={storageType}
          onChange={(e) => onChange('storageType', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="gp3">gp3 - General Purpose SSD (Recommended)</option>
          <option value="gp2">gp2 - General Purpose SSD (Legacy)</option>
          <option value="io1">io1 - Provisioned IOPS SSD (High performance)</option>
          <option value="io2">io2 - Provisioned IOPS SSD (Highest durability)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Storage Size: {storageSizeGB} GB
        </label>
        <input
          type="range"
          min="20"
          max="2000"
          step="10"
          value={storageSizeGB}
          onChange={(e) => onChange('storageSizeGB', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>20 GB</span>
          <span>2000 GB (2 TB)</span>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-2">💰 Cost Breakdown</div>
        <div className="space-y-1 text-xs text-green-800">
          <div className="flex justify-between">
            <span>Instance ({instanceType}):</span>
            <span className="font-semibold">${baseCost}/mo</span>
          </div>
          {replication.enabled && (
            <div className="flex justify-between">
              <span>Replication ({replication.replicas} replicas):</span>
              <span className="font-semibold">+${replicationCost}/mo</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Storage ({storageSizeGB} GB {storageType}):</span>
            <span className="font-semibold">${(storageSizeGB * 0.115).toFixed(0)}/mo</span>
          </div>
          <div className="pt-2 border-t border-green-300 flex justify-between font-semibold">
            <span>Total:</span>
            <span className="text-green-900">${(totalCost + storageSizeGB * 0.115).toFixed(0)}/mo</span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {!replication.enabled && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-xs font-medium text-yellow-900 mb-1">
            ⚠️ No Replication
          </div>
          <p className="text-xs text-yellow-800">
            Database failures will cause 60s+ downtime. Enable replication for
            99.9%+ availability.
          </p>
        </div>
      )}

      {!primaryKey && (
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-xs font-medium text-orange-900 mb-1">
            ⚠️ No Primary Key Defined
          </div>
          <p className="text-xs text-orange-800">
            Define your primary key to optimize query performance and data access patterns.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Redis Configuration
// ============================================================================

function RedisConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const memorySizeGB = config.memorySizeGB || 4;
  const ttl = config.ttl || 3600;
  const hitRatio = config.hitRatio || 0.9;
  const cost = memorySizeGB * 50;

  const presets: ConfigPreset[] = [
    {
      name: 'Small',
      description: '2GB, 80% hit ratio',
      config: { memorySizeGB: 2, ttl: 1800, hitRatio: 0.8 },
      icon: '💰',
    },
    {
      name: 'Medium',
      description: '4GB, 90% hit ratio',
      config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9 },
      icon: '⚡',
    },
    {
      name: 'Large',
      description: '8GB, 95% hit ratio',
      config: { memorySizeGB: 8, ttl: 7200, hitRatio: 0.95 },
      icon: '🚀',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Cache Configuration</h3>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset?.(preset.config)}
              className="p-2 text-left border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-lg">{preset.icon}</div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                {preset.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Memory Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Memory Size (GB)
        </label>
        <input
          type="range"
          min="1"
          max="32"
          value={memorySizeGB}
          onChange={(e) => onChange('memorySizeGB', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">1 GB</span>
          <span className="text-sm font-semibold text-blue-600">
            {memorySizeGB} GB
          </span>
          <span className="text-xs text-gray-500">32 GB</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Larger cache = more keys stored = higher hit ratio
        </p>
      </div>

      {/* TTL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time to Live (TTL)
        </label>
        <input
          type="range"
          min="60"
          max="7200"
          step="60"
          value={ttl}
          onChange={(e) => onChange('ttl', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">1 min</span>
          <span className="text-sm font-semibold text-blue-600">
            {ttl >= 3600 ? `${(ttl / 3600).toFixed(1)} hours` : `${ttl / 60} minutes`}
          </span>
          <span className="text-xs text-gray-500">2 hours</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          How long cached data stays fresh before expiring
        </p>
      </div>

      {/* Hit Ratio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expected Hit Ratio
        </label>
        <input
          type="range"
          min="0.5"
          max="0.99"
          step="0.01"
          value={hitRatio}
          onChange={(e) => onChange('hitRatio', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">50%</span>
          <span className="text-sm font-semibold text-blue-600">
            {(hitRatio * 100).toFixed(0)}%
          </span>
          <span className="text-xs text-gray-500">99%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          % of requests served from cache (vs. hitting database)
        </p>
      </div>

      {/* Impact Card */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-2">💚 Cache Impact</div>
        <div className="space-y-1 text-xs text-green-800">
          <div className="flex justify-between">
            <span>Hit Ratio:</span>
            <span className="font-semibold">{(hitRatio * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span>DB Load Reduction:</span>
            <span className="font-semibold">{(hitRatio * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Cache Latency:</span>
            <span className="font-semibold">1ms</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Cost:</span>
            <span className="font-semibold">${cost}/month</span>
          </div>
        </div>
      </div>

      {/* Example Calculation */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">
          📊 Example: 1,000 RPS reads
        </div>
        <div className="space-y-1 text-xs text-blue-800">
          <div className="flex justify-between">
            <span>Cache Hits:</span>
            <span className="font-semibold">
              {((hitRatio * 1000).toFixed(0))} RPS
            </span>
          </div>
          <div className="flex justify-between">
            <span>Cache Misses (→ DB):</span>
            <span className="font-semibold">
              {(((1 - hitRatio) * 1000).toFixed(0))} RPS
            </span>
          </div>
          <div className="pt-2 border-t border-blue-200 flex justify-between">
            <span className="font-medium">DB Load Reduction:</span>
            <span className="font-semibold text-green-600">
              {((hitRatio * 100).toFixed(0))}% less!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CDN Configuration
// ============================================================================

function CDNConfig({ config, onChange }: Omit<ConfigProps, 'onApplyPreset'>) {
  const enabled = config.enabled !== false;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">CDN Configuration</h3>

      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange('enabled', e.target.checked)}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
          />
          <div>
            <span className="text-sm font-semibold text-gray-900">
              Enable CDN
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Distributes static content to edge locations worldwide for ultra-fast
              delivery (5ms latency vs 100ms from origin).
            </p>
          </div>
        </label>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">📊 CDN Stats</div>
        <div className="space-y-1 text-xs text-blue-800">
          <div className="flex justify-between">
            <span>Hit Ratio:</span>
            <span className="font-semibold">95%</span>
          </div>
          <div className="flex justify-between">
            <span>Edge Latency:</span>
            <span className="font-semibold">5ms</span>
          </div>
          <div className="flex justify-between">
            <span>Origin Latency:</span>
            <span className="font-semibold">100ms</span>
          </div>
          <div className="flex justify-between">
            <span>Pricing:</span>
            <span className="font-semibold">$0.01/GB</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-1">
          ✨ Best For
        </div>
        <ul className="text-xs text-green-800 space-y-1 ml-4 list-disc">
          <li>Images, videos, static files</li>
          <li>High-bandwidth applications</li>
          <li>Global user base</li>
          <li>Cost optimization for large files</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// S3 Configuration
// ============================================================================

function S3Config({ config, onChange }: Omit<ConfigProps, 'onApplyPreset'>) {
  const storageSizeGB = config.storageSizeGB || 100;
  const cost = storageSizeGB * 0.023;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Object Storage (S3)</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Storage Size (GB)
        </label>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={storageSizeGB}
          onChange={(e) => onChange('storageSizeGB', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">10 GB</span>
          <span className="text-sm font-semibold text-blue-600">
            {storageSizeGB} GB
          </span>
          <span className="text-xs text-gray-500">1,000 GB</span>
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">💰 Cost Breakdown</div>
        <div className="space-y-1 text-xs text-blue-800">
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="font-semibold">${cost.toFixed(2)}/month</span>
          </div>
          <div className="flex justify-between">
            <span>PUT requests:</span>
            <span className="font-semibold">$0.005 per 1,000</span>
          </div>
          <div className="flex justify-between">
            <span>GET requests:</span>
            <span className="font-semibold">$0.0004 per 1,000</span>
          </div>
          <div className="flex justify-between">
            <span>Data transfer:</span>
            <span className="font-semibold">$0.09/GB out</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="text-xs font-medium text-purple-900 mb-1">
          💡 Pro Tip
        </div>
        <p className="text-xs text-purple-800">
          Pair S3 with CDN to dramatically reduce data transfer costs and improve
          latency. CDN serves 95% of requests from edge, only 5% from S3.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MongoDB Configuration
// ============================================================================

function MongoDBConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const numShards = config.numShards || 3;
  const replicationFactor = config.replicationFactor || 3;
  const consistencyLevel = config.consistencyLevel || 'eventual';
  const cost = numShards * 100;

  const presets: ConfigPreset[] = [
    {
      name: 'Single Node',
      description: 'Dev/test only',
      config: { numShards: 1, replicationFactor: 1, consistencyLevel: 'eventual' },
      icon: '💰',
    },
    {
      name: 'Standard',
      description: 'Replica set',
      config: { numShards: 3, replicationFactor: 3, consistencyLevel: 'eventual' },
      icon: '⚖️',
    },
    {
      name: 'Sharded',
      description: 'High scale',
      config: { numShards: 5, replicationFactor: 3, consistencyLevel: 'eventual' },
      icon: '🚀',
    },
  ];

  const consistencyOptions = [
    { value: 'strong', label: 'Strong (majority read/write)', icon: '🔒' },
    { value: 'eventual', label: 'Eventual (fast, default)', icon: '⚡' },
    { value: 'causal', label: 'Causal (ordered)', icon: '📊' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">MongoDB Configuration</h3>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset?.(preset.config)}
              className="p-2 text-left border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-lg">{preset.icon}</div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Shards */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Shards
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={numShards}
          onChange={(e) => onChange('numShards', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-blue-600">{numShards}</span>
          <div className="text-right">
            <div className="text-xs text-gray-500">Monthly Cost</div>
            <div className="text-sm font-semibold text-green-600">${cost}/mo</div>
          </div>
        </div>
      </div>

      {/* Replication Factor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Replication Factor
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={replicationFactor}
          onChange={(e) => onChange('replicationFactor', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-purple-600">{replicationFactor}</span>
          <span className="text-xs text-gray-500">
            Can tolerate {replicationFactor - 1} node failure{replicationFactor > 2 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Consistency Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Consistency Level
        </label>
        <div className="space-y-2">
          {consistencyOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                consistencyLevel === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="consistencyLevel"
                value={option.value}
                checked={consistencyLevel === option.value}
                onChange={(e) => onChange('consistencyLevel', e.target.value)}
                className="mr-3"
              />
              <span className="text-lg mr-2">{option.icon}</span>
              <span className="text-sm text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-1">
          📚 MongoDB Use Cases
        </div>
        <p className="text-xs text-green-800">
          Perfect for: User profiles, product catalogs, content management.
          Flexible schema allows rapid iteration. Not ideal for complex joins or transactions.
        </p>
      </div>

      {/* Consistency Explanation */}
      {consistencyLevel === 'strong' && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-xs font-medium text-yellow-900 mb-1">
            ⚠️ Strong Consistency
          </div>
          <p className="text-xs text-yellow-800">
            Reads/writes wait for majority quorum. Slower but guarantees latest data.
            Use for: Financial data, inventory counts.
          </p>
        </div>
      )}

      {consistencyLevel === 'eventual' && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-900 mb-1">
            ⚡ Eventual Consistency
          </div>
          <p className="text-xs text-blue-800">
            Fast reads/writes, may return slightly stale data.
            Use for: Social feeds, dashboards, analytics.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Cassandra Configuration
// ============================================================================

function CassandraConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const numNodes = config.numNodes || 3;
  const replicationFactor = config.replicationFactor || 3;
  const readQuorum = config.readQuorum || 2;
  const writeQuorum = config.writeQuorum || 2;
  const cost = 200 + (numNodes - 1) * 150;

  // Check consistency
  const isStronglyConsistent = readQuorum + writeQuorum > replicationFactor;

  const presets: ConfigPreset[] = [
    {
      name: 'ONE (Fast)',
      description: 'Eventual consistency',
      config: { numNodes: 3, replicationFactor: 3, readQuorum: 1, writeQuorum: 1 },
      icon: '⚡',
    },
    {
      name: 'QUORUM',
      description: 'Balanced (common)',
      config: { numNodes: 3, replicationFactor: 3, readQuorum: 2, writeQuorum: 2 },
      icon: '⚖️',
    },
    {
      name: 'ALL (Safe)',
      description: 'Strong consistency',
      config: { numNodes: 3, replicationFactor: 3, readQuorum: 3, writeQuorum: 3 },
      icon: '🔒',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Cassandra Configuration</h3>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset?.(preset.config)}
              className="p-2 text-left border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-lg">{preset.icon}</div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                {preset.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Consistency Formula Explanation */}
      <div className={`p-4 rounded-lg border-2 ${
        isStronglyConsistent
          ? 'bg-green-50 border-green-500'
          : 'bg-yellow-50 border-yellow-500'
      }`}>
        <div className="text-sm font-semibold mb-2">
          {isStronglyConsistent ? '✅ Strong Consistency' : '⚠️ Eventual Consistency'}
        </div>
        <div className="text-xs space-y-1">
          <div className="font-mono">
            R={readQuorum} + W={writeQuorum} {isStronglyConsistent ? '>' : '≤'} N={replicationFactor}
          </div>
          <div className="text-gray-700">
            {isStronglyConsistent
              ? 'All reads see latest write (slower, consistent)'
              : 'Reads may be stale (faster, eventually consistent)'
            }
          </div>
        </div>
      </div>

      {/* Number of Nodes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Nodes
        </label>
        <input
          type="range"
          min="3"
          max="10"
          value={numNodes}
          onChange={(e) => onChange('numNodes', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-blue-600">{numNodes}</span>
          <div className="text-right">
            <div className="text-xs text-gray-500">Monthly Cost</div>
            <div className="text-sm font-semibold text-green-600">${cost}/mo</div>
          </div>
        </div>
      </div>

      {/* Replication Factor (N) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Replication Factor (N)
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={replicationFactor}
          onChange={(e) => onChange('replicationFactor', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-purple-600">{replicationFactor}</span>
          <span className="text-xs text-gray-500">Total copies of each row</span>
        </div>
      </div>

      {/* Read Quorum (R) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Read Quorum (R)
        </label>
        <input
          type="range"
          min="1"
          max={replicationFactor}
          value={Math.min(readQuorum, replicationFactor)}
          onChange={(e) => onChange('readQuorum', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-indigo-600">{readQuorum}</span>
          <span className="text-xs text-gray-500">Replicas must respond for read</span>
        </div>
      </div>

      {/* Write Quorum (W) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Write Quorum (W)
        </label>
        <input
          type="range"
          min="1"
          max={replicationFactor}
          value={Math.min(writeQuorum, replicationFactor)}
          onChange={(e) => onChange('writeQuorum', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-pink-600">{writeQuorum}</span>
          <span className="text-xs text-gray-500">Replicas must ack write</span>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-1">
          💡 Interview Tip
        </div>
        <p className="text-xs text-blue-800">
          <strong>R + W &gt; N = Strong Consistency</strong><br />
          For N=3, use R=2, W=2 (QUORUM) for balanced consistency and availability.
          Can tolerate {replicationFactor - Math.max(readQuorum, writeQuorum)} node failure(s).
        </p>
      </div>

      {/* Use Cases */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-1">
          📚 Cassandra Use Cases
        </div>
        <p className="text-xs text-green-800">
          Perfect for: IoT time-series, logging, high write throughput.
          Leaderless architecture = high availability. Not ideal for complex queries or transactions.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Message Queue Configuration
// ============================================================================

function MessageQueueConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const numBrokers = config.numBrokers || 3;
  const numPartitions = config.numPartitions || 10;
  const replicationFactor = config.replicationFactor || 3;
  const semantics = config.semantics || 'at_least_once';
  const orderingGuarantee = config.orderingGuarantee || 'partition';
  const cost = numBrokers * 100;

  const presets: ConfigPreset[] = [
    {
      name: 'Minimal',
      description: 'Single broker',
      config: { numBrokers: 1, numPartitions: 3, replicationFactor: 1 },
      icon: '💰',
    },
    {
      name: 'Standard',
      description: 'HA cluster',
      config: { numBrokers: 3, numPartitions: 10, replicationFactor: 3 },
      icon: '⚖️',
    },
    {
      name: 'High Throughput',
      description: 'Scaled for load',
      config: { numBrokers: 5, numPartitions: 20, replicationFactor: 3 },
      icon: '🚀',
    },
  ];

  const semanticsOptions = [
    { value: 'at_most_once', label: 'At-Most-Once (may lose)', icon: '⚡' },
    { value: 'at_least_once', label: 'At-Least-Once (may dup)', icon: '⚖️' },
    { value: 'exactly_once', label: 'Exactly-Once (slow)', icon: '🔒' },
  ];

  const orderingOptions = [
    { value: 'none', label: 'No Ordering (fastest)', icon: '⚡' },
    { value: 'partition', label: 'Per-Partition (common)', icon: '⚖️' },
    { value: 'global', label: 'Global Order (slow)', icon: '🔒' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Message Queue Configuration</h3>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset?.(preset.config)}
              className="p-2 text-left border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-lg">{preset.icon}</div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                {preset.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Number of Brokers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Brokers
        </label>
        <input
          type="range"
          min="1"
          max="7"
          value={numBrokers}
          onChange={(e) => onChange('numBrokers', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-blue-600">{numBrokers}</span>
          <div className="text-right">
            <div className="text-xs text-gray-500">Monthly Cost</div>
            <div className="text-sm font-semibold text-green-600">${cost}/mo</div>
          </div>
        </div>
      </div>

      {/* Number of Partitions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Partitions
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={numPartitions}
          onChange={(e) => onChange('numPartitions', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-purple-600">{numPartitions}</span>
          <span className="text-xs text-gray-500">
            Throughput: ~{(numPartitions * 10000).toLocaleString()} msg/sec
          </span>
        </div>
      </div>

      {/* Replication Factor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Replication Factor
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={replicationFactor}
          onChange={(e) => onChange('replicationFactor', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-indigo-600">{replicationFactor}</span>
          <span className="text-xs text-gray-500">
            Can tolerate {replicationFactor - 1} broker failure{replicationFactor > 2 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Delivery Semantics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Semantics
        </label>
        <div className="space-y-2">
          {semanticsOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                semantics === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="semantics"
                value={option.value}
                checked={semantics === option.value}
                onChange={(e) => onChange('semantics', e.target.value)}
                className="mr-3"
              />
              <span className="text-lg mr-2">{option.icon}</span>
              <span className="text-sm text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ordering Guarantee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ordering Guarantee
        </label>
        <div className="space-y-2">
          {orderingOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                orderingGuarantee === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="orderingGuarantee"
                value={option.value}
                checked={orderingGuarantee === option.value}
                onChange={(e) => onChange('orderingGuarantee', e.target.value)}
                className="mr-3"
              />
              <span className="text-lg mr-2">{option.icon}</span>
              <span className="text-sm text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Semantics Explanation */}
      {semantics === 'exactly_once' && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-xs font-medium text-yellow-900 mb-1">
            ⚠️ Exactly-Once Semantics
          </div>
          <p className="text-xs text-yellow-800">
            Slowest but guarantees no duplicates. Use for: payments, inventory updates.
            Requires idempotent consumers.
          </p>
        </div>
      )}

      {semantics === 'at_least_once' && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-900 mb-1">
            ℹ️ At-Least-Once Semantics
          </div>
          <p className="text-xs text-blue-800">
            Most common. May deliver duplicates on retry.
            Use for: emails, notifications (duplicates annoying but not critical).
          </p>
        </div>
      )}

      {/* Use Cases */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-1">
          📚 Message Queue Use Cases
        </div>
        <p className="text-xs text-green-800">
          Perfect for: Async processing, decoupling services, buffering spikes, event streaming.
          Kafka = high throughput. RabbitMQ = complex routing.
        </p>
      </div>

      {/* Interview Tip */}
      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="text-xs font-medium text-purple-900 mb-1">
          💡 Interview Tip
        </div>
        <p className="text-xs text-purple-800">
          "I'd use Kafka with at-least-once semantics and partition-level ordering.
          For payments, I'd upgrade to exactly-once to prevent double-charging."
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Load Balancer Configuration (Read-only)
// ============================================================================

function LoadBalancerConfig({ config }: { config: Record<string, any> }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Load Balancer</h3>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 mb-3">
          Load balancer has fixed configuration in MVP.
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Capacity:</span>
            <span className="font-semibold text-gray-900">100,000 RPS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Latency:</span>
            <span className="font-semibold text-gray-900">1ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Algorithm:</span>
            <span className="font-semibold text-gray-900">Round Robin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Health Checks:</span>
            <span className="font-semibold text-gray-900">Enabled</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2">
            <span className="text-gray-600">Monthly Cost:</span>
            <span className="font-semibold text-green-600">$50</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-1">
          ℹ️ About Load Balancers
        </div>
        <p className="text-xs text-blue-800">
          Distributes incoming traffic across multiple servers to ensure no single
          server gets overwhelmed. Essential for high availability and scalability.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getComponentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    client: 'Traffic Source',
    load_balancer: 'Load Balancer / Traffic Distribution',
    app_server: 'Application Server / Compute',
    postgresql: 'Relational Database (ACID)',
    mongodb: 'Document Database (NoSQL)',
    cassandra: 'Wide-Column Store (AP System)',
    redis: 'In-Memory Cache',
    message_queue: 'Message Queue',
    cdn: 'Content Delivery Network',
    s3: 'Object Storage',
  };
  return labels[type] || type;
}
