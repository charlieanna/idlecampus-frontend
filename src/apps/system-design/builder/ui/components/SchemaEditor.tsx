import { useState } from 'react';
import { Plus, Trash2, Settings, ChevronDown, ChevronRight, Table as TableIcon, Database } from 'lucide-react';

interface Column {
  name: string;
  type: string;
  constraints: string[];
  enumValues?: string;
}

interface TableSchema {
  name: string;
  columns: Column[];
  indexes: string[];
  accessPattern: 'read_heavy' | 'write_heavy' | 'balanced' | 'high_contention';
  estimatedRows: number;
  avgRowSize: number;
  expanded: boolean;
}

interface SchemaEditorProps {
  database: string;
  dbType: string;
  onSchemaChange: (schema: TableSchema[]) => void;
  initialSchema?: TableSchema[];
}

const SQL_TYPES = [
  'INT',
  'BIGINT',
  'VARCHAR(255)',
  'TEXT',
  'TIMESTAMP',
  'DATETIME',
  'DATE',
  'BOOLEAN',
  'JSON',
  'ENUM',
  'DECIMAL',
  'FLOAT',
  'DOUBLE',
];

const TEMPLATES = [
  {
    id: 'ecommerce',
    name: 'E-commerce (Users, Products, Orders)',
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'INT', constraints: ['PK', 'AUTO_INCREMENT'] },
          { name: 'email', type: 'VARCHAR(255)', constraints: ['NOT NULL', 'UNIQUE'] },
          { name: 'name', type: 'VARCHAR(255)', constraints: ['NOT NULL'] },
          { name: 'created_at', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
        ],
        indexes: ['PRIMARY (id)', 'UNIQUE idx_email (email)'],
        accessPattern: 'balanced' as const,
        estimatedRows: 100000,
        avgRowSize: 256,
        expanded: false,
      },
      {
        name: 'products',
        columns: [
          { name: 'id', type: 'INT', constraints: ['PK', 'AUTO_INCREMENT'] },
          { name: 'name', type: 'VARCHAR(255)', constraints: ['NOT NULL'] },
          { name: 'price', type: 'DECIMAL', constraints: ['NOT NULL'] },
          { name: 'stock', type: 'INT', constraints: ['NOT NULL'] },
        ],
        indexes: ['PRIMARY (id)', 'INDEX idx_name (name)'],
        accessPattern: 'read_heavy' as const,
        estimatedRows: 10000,
        avgRowSize: 128,
        expanded: false,
      },
      {
        name: 'orders',
        columns: [
          { name: 'id', type: 'INT', constraints: ['PK', 'AUTO_INCREMENT'] },
          { name: 'user_id', type: 'INT', constraints: ['FK → users.id'] },
          { name: 'product_id', type: 'INT', constraints: ['FK → products.id'] },
          { name: 'quantity', type: 'INT', constraints: ['NOT NULL'] },
          { name: 'created_at', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
        ],
        indexes: ['PRIMARY (id)', 'INDEX idx_user (user_id)', 'INDEX idx_created (created_at)'],
        accessPattern: 'write_heavy' as const,
        estimatedRows: 500000,
        avgRowSize: 256,
        expanded: false,
      },
    ],
  },
  {
    id: 'social',
    name: 'Social Media (Users, Posts, Comments, Likes)',
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'INT', constraints: ['PK', 'AUTO_INCREMENT'] },
          { name: 'username', type: 'VARCHAR(255)', constraints: ['NOT NULL', 'UNIQUE'] },
          { name: 'bio', type: 'TEXT', constraints: [] },
          { name: 'created_at', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
        ],
        indexes: ['PRIMARY (id)', 'UNIQUE idx_username (username)'],
        accessPattern: 'read_heavy' as const,
        estimatedRows: 1000000,
        avgRowSize: 512,
        expanded: false,
      },
      {
        name: 'posts',
        columns: [
          { name: 'id', type: 'INT', constraints: ['PK', 'AUTO_INCREMENT'] },
          { name: 'user_id', type: 'INT', constraints: ['FK → users.id'] },
          { name: 'content', type: 'TEXT', constraints: ['NOT NULL'] },
          { name: 'created_at', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
        ],
        indexes: ['PRIMARY (id)', 'INDEX idx_user (user_id)', 'INDEX idx_created (created_at)'],
        accessPattern: 'read_heavy' as const,
        estimatedRows: 5000000,
        avgRowSize: 1024,
        expanded: false,
      },
    ],
  },
  {
    id: 'tinyurl',
    name: 'TinyURL (URL Shortener)',
    tables: [
      {
        name: 'url_mapping',
        columns: [
          { name: 'short_code', type: 'VARCHAR(255)', constraints: ['PK'] },
          { name: 'long_url', type: 'TEXT', constraints: ['NOT NULL'] },
          { name: 'created_at', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
          { name: 'user_id', type: 'INT', constraints: [] },
          { name: 'clicks', type: 'INT', constraints: ['DEFAULT 0'] },
        ],
        indexes: ['PRIMARY (short_code)', 'INDEX idx_user (user_id)', 'INDEX idx_created (created_at)'],
        accessPattern: 'read_heavy' as const,
        estimatedRows: 1000000,
        avgRowSize: 256,
        expanded: true,
      },
    ],
  },
];

export function SchemaEditor({ database, dbType, onSchemaChange, initialSchema }: SchemaEditorProps) {
  const [tables, setTables] = useState<TableSchema[]>(initialSchema || []);
  const [showAddColumn, setShowAddColumn] = useState<{ tableIndex: number } | null>(null);
  const [newColumn, setNewColumn] = useState<Column>({
    name: '',
    type: 'VARCHAR(255)',
    constraints: [],
  });

  const handleUseTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setTables(template.tables);
      onSchemaChange(template.tables);
    }
  };

  const handleAddTable = () => {
    const newTable: TableSchema = {
      name: `table_${tables.length + 1}`,
      columns: [],
      indexes: [],
      accessPattern: 'balanced',
      estimatedRows: 100000,
      avgRowSize: 256,
      expanded: true,
    };
    const newTables = [...tables, newTable];
    setTables(newTables);
    onSchemaChange(newTables);
  };

  const handleDeleteTable = (index: number) => {
    const newTables = tables.filter((_, i) => i !== index);
    setTables(newTables);
    onSchemaChange(newTables);
  };

  const handleToggleTable = (index: number) => {
    const newTables = [...tables];
    newTables[index].expanded = !newTables[index].expanded;
    setTables(newTables);
  };

  const handleTableNameChange = (index: number, name: string) => {
    const newTables = [...tables];
    newTables[index].name = name;
    setTables(newTables);
    onSchemaChange(newTables);
  };

  const handleAddColumnClick = (tableIndex: number) => {
    setShowAddColumn({ tableIndex });
    setNewColumn({
      name: '',
      type: 'VARCHAR(255)',
      constraints: [],
    });
  };

  const handleSaveColumn = () => {
    if (showAddColumn && newColumn.name) {
      const newTables = [...tables];
      newTables[showAddColumn.tableIndex].columns.push(newColumn);

      // Auto-add to indexes if PRIMARY KEY
      if (newColumn.constraints.includes('PK')) {
        const pkIndex = `PRIMARY (${newColumn.name})`;
        if (!newTables[showAddColumn.tableIndex].indexes.includes(pkIndex)) {
          newTables[showAddColumn.tableIndex].indexes.push(pkIndex);
        }
      }

      setTables(newTables);
      onSchemaChange(newTables);
      setShowAddColumn(null);
    }
  };

  const handleDeleteColumn = (tableIndex: number, columnIndex: number) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.splice(columnIndex, 1);
    setTables(newTables);
    onSchemaChange(newTables);
  };

  const handleAccessPatternChange = (tableIndex: number, pattern: string) => {
    const newTables = [...tables];
    newTables[tableIndex].accessPattern = pattern as any;
    setTables(newTables);
    onSchemaChange(newTables);
  };

  const toggleConstraint = (constraint: string) => {
    setNewColumn(prev => ({
      ...prev,
      constraints: prev.constraints.includes(constraint)
        ? prev.constraints.filter(c => c !== constraint)
        : [...prev.constraints, constraint],
    }));
  };

  const detectRelationships = () => {
    const relationships: string[] = [];
    tables.forEach(table => {
      table.columns.forEach(col => {
        const fkConstraint = col.constraints.find(c => c.startsWith('FK'));
        if (fkConstraint) {
          const match = fkConstraint.match(/FK → (.+)/);
          if (match) {
            relationships.push(`${table.name}.${col.name} → ${match[1]} (N:1)`);
          }
        }
      });
    });
    return relationships;
  };

  // Empty state
  if (tables.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Data Model Editor</h3>
        </div>

        <p className="text-sm text-gray-600 mb-1">Database: {database} ({dbType})</p>
        <p className="text-sm text-gray-600 mb-6">Model Type: Relational</p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-2">No schema defined yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Define your data model to improve simulation accuracy
          </p>

          <div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={handleAddTable}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Table
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              📤 Import JSON
            </button>
          </div>

          <div className="text-left max-w-md mx-auto">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</p>
            <div className="space-y-1">
              {TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleUseTemplate(template.id)}
                  className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  • {template.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const relationships = detectRelationships();

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Data Model Editor</h3>
          </div>
          <p className="text-sm text-gray-600">
            Database: {database} ({dbType}) - Relational
          </p>
        </div>
        <button
          onClick={handleAddTable}
          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Table
        </button>
      </div>

      <div className="space-y-3">
        {tables.map((table, tableIndex) => (
          <div key={tableIndex} className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => handleToggleTable(tableIndex)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {table.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <TableIcon className="w-4 h-4 text-blue-600" />
                <input
                  type="text"
                  value={table.name}
                  onChange={(e) => handleTableNameChange(tableIndex, e.target.value)}
                  className="font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 text-gray-600 hover:text-gray-900">
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTable(tableIndex)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table Content (when expanded) */}
            {table.expanded && (
              <div className="p-4 space-y-4">
                {/* Columns */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Columns:</label>
                    <button
                      onClick={() => handleAddColumnClick(tableIndex)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Column
                    </button>
                  </div>

                  {table.columns.length > 0 ? (
                    <div className="border border-gray-200 rounded">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Type</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Constraints</th>
                            <th className="px-3 py-2 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {table.columns.map((col, colIndex) => (
                            <tr key={colIndex} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-mono text-xs text-gray-900">{col.name}</td>
                              <td className="px-3 py-2 font-mono text-xs text-gray-700">{col.type}</td>
                              <td className="px-3 py-2 text-xs text-gray-600">
                                {col.constraints.join(', ')}
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  onClick={() => handleDeleteColumn(tableIndex, colIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded p-4 text-center text-sm text-gray-500">
                      No columns defined. Click "Add Column" to start.
                    </div>
                  )}
                </div>

                {/* Indexes */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Indexes:</label>
                  <div className="space-y-1">
                    {table.indexes.map((index, i) => (
                      <div key={i} className="text-xs text-gray-700 font-mono">• {index}</div>
                    ))}
                  </div>
                </div>

                {/* Access Pattern */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Access Pattern:</label>
                  <select
                    value={table.accessPattern}
                    onChange={(e) => handleAccessPatternChange(tableIndex, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="read_heavy">Read-Heavy (10:1 read/write)</option>
                    <option value="write_heavy">Write-Heavy (1:10 read/write)</option>
                    <option value="balanced">Balanced (1:1)</option>
                    <option value="high_contention">High-Contention (locks/races)</option>
                  </select>
                </div>

                {/* Estimated Row Count */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Estimated Row Count: {table.estimatedRows.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="10000000"
                    step="1000"
                    value={table.estimatedRows}
                    onChange={(e) => {
                      const newTables = [...tables];
                      newTables[tableIndex].estimatedRows = parseInt(e.target.value);
                      setTables(newTables);
                      onSchemaChange(newTables);
                    }}
                    className="w-full"
                  />
                </div>

                {/* Avg Row Size */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Avg Row Size (bytes):</label>
                  <input
                    type="number"
                    value={table.avgRowSize}
                    onChange={(e) => {
                      const newTables = [...tables];
                      newTables[tableIndex].avgRowSize = parseInt(e.target.value);
                      setTables(newTables);
                      onSchemaChange(newTables);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Relationships */}
      {relationships.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Relationships</h4>
          <p className="text-xs text-blue-700 mb-2">Auto-detected from foreign keys:</p>
          <div className="space-y-1">
            {relationships.map((rel, i) => (
              <div key={i} className="text-xs text-blue-800">• {rel}</div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">
          Visualize ER Diagram
        </button>
        <button className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">
          Export DDL
        </button>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
          Save Schema
        </button>
      </div>

      {/* Add Column Modal */}
      {showAddColumn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Column</h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Column Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Column Name:</label>
                <input
                  type="text"
                  value={newColumn.name}
                  onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                  placeholder="e.g., user_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              {/* Data Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Type:</label>
                <select
                  value={newColumn.type}
                  onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SQL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* ENUM Values (if ENUM selected) */}
              {newColumn.type === 'ENUM' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ENUM Values (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={newColumn.enumValues || ''}
                    onChange={(e) => setNewColumn({ ...newColumn, enumValues: e.target.value })}
                    placeholder="available,locked,sold"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Constraints */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Constraints:</label>
                <div className="space-y-2">
                  {['NOT NULL', 'UNIQUE', 'PK', 'AUTO_INCREMENT'].map(constraint => (
                    <label key={constraint} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newColumn.constraints.includes(constraint)}
                        onChange={() => toggleConstraint(constraint)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{constraint}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Foreign Key */}
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={newColumn.constraints.some(c => c.startsWith('FK'))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewColumn({
                          ...newColumn,
                          constraints: [...newColumn.constraints.filter(c => !c.startsWith('FK')), 'FK → '],
                        });
                      } else {
                        setNewColumn({
                          ...newColumn,
                          constraints: newColumn.constraints.filter(c => !c.startsWith('FK')),
                        });
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">FOREIGN KEY</span>
                </label>
                {newColumn.constraints.some(c => c.startsWith('FK')) && (
                  <input
                    type="text"
                    placeholder="table.column (e.g., users.id)"
                    value={newColumn.constraints.find(c => c.startsWith('FK'))?.replace('FK → ', '') || ''}
                    onChange={(e) => {
                      setNewColumn({
                        ...newColumn,
                        constraints: [
                          ...newColumn.constraints.filter(c => !c.startsWith('FK')),
                          `FK → ${e.target.value}`,
                        ],
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-2 justify-end">
              <button
                onClick={() => setShowAddColumn(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveColumn}
                disabled={!newColumn.name}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
