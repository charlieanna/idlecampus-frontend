import React, { useState } from 'react';

interface Table {
  name: string;
  columns: Column[];
}

interface Column {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string; // table.column
  isIndexed?: boolean;
  isUnique?: boolean;
  isNullable?: boolean;
}

interface DatabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (schema: { tables: Table[], dataModel: string }) => void;
  initialSchema?: { tables: Table[] };
  dataModel: string;
}

const COLUMN_TYPES = [
  'INT',
  'BIGINT',
  'VARCHAR',
  'TEXT',
  'TIMESTAMP',
  'DATE',
  'BOOLEAN',
  'JSON',
  'UUID',
  'FLOAT',
  'DECIMAL',
];

export function DatabaseSchemaModal({
  isOpen,
  onClose,
  onConfirm,
  initialSchema,
  dataModel
}: DatabaseSchemaModalProps) {
  const [tables, setTables] = useState<Table[]>(initialSchema?.tables || []);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [newTableName, setNewTableName] = useState('');
  const [showAddTable, setShowAddTable] = useState(false);

  // For adding new column
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumn, setNewColumn] = useState<Column>({
    name: '',
    type: 'VARCHAR',
    isNullable: true,
  });

  if (!isOpen) return null;

  const handleAddTable = () => {
    if (newTableName.trim()) {
      setTables([...tables, {
        name: newTableName.trim(),
        columns: [
          { name: 'id', type: 'INT', isPrimary: true, isIndexed: true }
        ]
      }]);
      setNewTableName('');
      setShowAddTable(false);
      setSelectedTable(tables.length);
    }
  };

  const handleAddColumn = () => {
    if (selectedTable !== null && newColumn.name.trim()) {
      const updatedTables = [...tables];
      updatedTables[selectedTable].columns.push({ ...newColumn });
      setTables(updatedTables);
      setNewColumn({ name: '', type: 'VARCHAR', isNullable: true });
      setShowAddColumn(false);
    }
  };

  const handleDeleteColumn = (tableIndex: number, columnIndex: number) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].columns.splice(columnIndex, 1);
    setTables(updatedTables);
  };

  const handleDeleteTable = (index: number) => {
    const updatedTables = tables.filter((_, i) => i !== index);
    setTables(updatedTables);
    if (selectedTable === index) {
      setSelectedTable(null);
    } else if (selectedTable !== null && selectedTable > index) {
      setSelectedTable(selectedTable - 1);
    }
  };

  const handleConfirm = () => {
    onConfirm({ tables, dataModel });
    onClose();
  };

  const getExampleSchema = () => {
    // Provide example schemas based on the problem type
    return {
      social: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'INT', isPrimary: true, isIndexed: true },
            { name: 'username', type: 'VARCHAR', isUnique: true, isIndexed: true },
            { name: 'email', type: 'VARCHAR', isUnique: true },
            { name: 'created_at', type: 'TIMESTAMP' },
          ]
        },
        {
          name: 'posts',
          columns: [
            { name: 'id', type: 'INT', isPrimary: true, isIndexed: true },
            { name: 'user_id', type: 'INT', isForeign: true, references: 'users.id', isIndexed: true },
            { name: 'content', type: 'TEXT' },
            { name: 'created_at', type: 'TIMESTAMP', isIndexed: true },
          ]
        },
      ],
      ecommerce: [
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'INT', isPrimary: true, isIndexed: true },
            { name: 'email', type: 'VARCHAR', isUnique: true, isIndexed: true },
            { name: 'created_at', type: 'TIMESTAMP' },
          ]
        },
        {
          name: 'products',
          columns: [
            { name: 'id', type: 'INT', isPrimary: true, isIndexed: true },
            { name: 'name', type: 'VARCHAR', isIndexed: true },
            { name: 'price', type: 'DECIMAL' },
            { name: 'inventory', type: 'INT' },
          ]
        },
        {
          name: 'orders',
          columns: [
            { name: 'id', type: 'INT', isPrimary: true, isIndexed: true },
            { name: 'user_id', type: 'INT', isForeign: true, references: 'users.id', isIndexed: true },
            { name: 'total', type: 'DECIMAL' },
            { name: 'status', type: 'VARCHAR', isIndexed: true },
            { name: 'created_at', type: 'TIMESTAMP', isIndexed: true },
          ]
        },
      ],
      url_shortener: [
        {
          name: 'urls',
          columns: [
            { name: 'id', type: 'BIGINT', isPrimary: true, isIndexed: true },
            { name: 'short_code', type: 'VARCHAR', isUnique: true, isIndexed: true },
            { name: 'long_url', type: 'TEXT' },
            { name: 'created_at', type: 'TIMESTAMP', isIndexed: true },
            { name: 'expires_at', type: 'TIMESTAMP', isIndexed: true, isNullable: true },
          ]
        },
        {
          name: 'analytics',
          columns: [
            { name: 'id', type: 'BIGINT', isPrimary: true, isIndexed: true },
            { name: 'url_id', type: 'BIGINT', isForeign: true, references: 'urls.id', isIndexed: true },
            { name: 'ip_address', type: 'VARCHAR' },
            { name: 'user_agent', type: 'TEXT' },
            { name: 'clicked_at', type: 'TIMESTAMP', isIndexed: true },
          ]
        },
      ],
    };
  };

  const loadExampleSchema = (type: keyof ReturnType<typeof getExampleSchema>) => {
    const examples = getExampleSchema();
    setTables(examples[type]);
    setSelectedTable(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Define Your Database Schema</h2>
          <p className="text-indigo-100">
            Design your tables, columns, and relationships. This helps validate your system design.
          </p>
        </div>

        {/* Quick Examples */}
        <div className="bg-indigo-50 px-6 py-3 border-b flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Quick Examples:</span>
          <button
            onClick={() => loadExampleSchema('social')}
            className="px-3 py-1 text-xs bg-white border border-indigo-300 text-indigo-700 rounded hover:bg-indigo-50"
          >
            Social Media
          </button>
          <button
            onClick={() => loadExampleSchema('ecommerce')}
            className="px-3 py-1 text-xs bg-white border border-indigo-300 text-indigo-700 rounded hover:bg-indigo-50"
          >
            E-commerce
          </button>
          <button
            onClick={() => loadExampleSchema('url_shortener')}
            className="px-3 py-1 text-xs bg-white border border-indigo-300 text-indigo-700 rounded hover:bg-indigo-50"
          >
            URL Shortener
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[500px]">
          {/* Left Panel - Tables List */}
          <div className="w-1/3 border-r bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Tables</h3>
              <button
                onClick={() => setShowAddTable(true)}
                className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                + Add Table
              </button>
            </div>

            {showAddTable && (
              <div className="mb-3 p-2 bg-white border rounded">
                <input
                  type="text"
                  placeholder="Table name..."
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTable()}
                  className="w-full px-2 py-1 text-sm border rounded mb-2"
                  autoFocus
                />
                <div className="flex gap-1">
                  <button
                    onClick={handleAddTable}
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddTable(false);
                      setNewTableName('');
                    }}
                    className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {tables.map((table, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedTable(index)}
                  className={`p-2 rounded cursor-pointer flex items-center justify-between group ${
                    selectedTable === index
                      ? 'bg-indigo-100 border border-indigo-300'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium">{table.name}</div>
                    <div className="text-xs text-gray-500">{table.columns.length} columns</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTable(index);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {tables.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No tables yet. Click "Add Table" to start.
              </div>
            )}
          </div>

          {/* Right Panel - Columns */}
          <div className="flex-1 p-4">
            {selectedTable !== null ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {tables[selectedTable].name} Columns
                  </h3>
                  <button
                    onClick={() => setShowAddColumn(true)}
                    className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    + Add Column
                  </button>
                </div>

                {showAddColumn && (
                  <div className="mb-4 p-3 bg-gray-50 border rounded">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Column name..."
                        value={newColumn.name}
                        onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                        className="px-2 py-1 text-sm border rounded"
                        autoFocus
                      />
                      <select
                        value={newColumn.type}
                        onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value })}
                        className="px-2 py-1 text-sm border rounded"
                      >
                        {COLUMN_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-3 mb-2 text-xs">
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={newColumn.isIndexed}
                          onChange={(e) => setNewColumn({ ...newColumn, isIndexed: e.target.checked })}
                        />
                        Indexed
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={newColumn.isUnique}
                          onChange={(e) => setNewColumn({ ...newColumn, isUnique: e.target.checked })}
                        />
                        Unique
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={newColumn.isNullable}
                          onChange={(e) => setNewColumn({ ...newColumn, isNullable: e.target.checked })}
                        />
                        Nullable
                      </label>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={handleAddColumn}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Add Column
                      </button>
                      <button
                        onClick={() => {
                          setShowAddColumn(false);
                          setNewColumn({ name: '', type: 'VARCHAR', isNullable: true });
                        }}
                        className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {tables[selectedTable].columns.map((column, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border rounded hover:shadow-sm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{column.name}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">{column.type}</span>
                          {column.isPrimary && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">PK</span>
                          )}
                          {column.isForeign && (
                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                              FK → {column.references}
                            </span>
                          )}
                          {column.isIndexed && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Indexed</span>
                          )}
                          {column.isUnique && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">Unique</span>
                          )}
                        </div>
                      </div>
                      {!column.isPrimary && (
                        <button
                          onClick={() => handleDeleteColumn(selectedTable, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Select a table to view and edit columns</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schema Summary */}
        {tables.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t">
            <div className="text-xs text-gray-600">
              <span className="font-medium">Schema Summary:</span> {tables.length} tables, {' '}
              {tables.reduce((sum, table) => sum + table.columns.length, 0)} total columns
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-600">
            {tables.length === 0 ? 'Add at least one table to continue' : `${tables.length} table(s) defined`}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={tables.length === 0}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                tables.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Confirm Schema & Add Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}