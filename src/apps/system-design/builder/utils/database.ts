import { ComponentNode, DatabaseCategory } from '../types/component';

export const LEGACY_DATABASE_COMPONENT_TYPES = [
  'postgresql',
  'mysql',
  'mongodb',
  'couchdb',
  'cassandra',
  'hbase',
  'elasticsearch',
  'solr',
  'dynamodb',
  'keydb',
];

export function isDatabaseComponentType(type: string): boolean {
  return type === 'database' || LEGACY_DATABASE_COMPONENT_TYPES.includes(type);
}

const TYPE_TO_CATEGORY: Record<string, DatabaseCategory> = {
  postgresql: 'sql',
  mysql: 'sql',
  mongodb: 'nosql_document',
  couchdb: 'nosql_document',
  cassandra: 'nosql_columnar',
  hbase: 'nosql_columnar',
  elasticsearch: 'nosql_search',
  solr: 'nosql_search',
  dynamodb: 'nosql_keyvalue',
  keydb: 'nosql_keyvalue',
};

export function inferDatabaseType(component: Pick<ComponentNode, 'type' | 'config'>): string {
  if (component.config?.databaseType) return component.config.databaseType;
  if (component.type === 'database') return 'postgresql';
  if (isDatabaseComponentType(component.type)) return component.type;
  return 'postgresql';
}

export function inferDatabaseCategory(component: Pick<ComponentNode, 'type' | 'config'>): DatabaseCategory {
  if (component.config?.dbCategory) return component.config.dbCategory;
  const inferredType = inferDatabaseType(component);
  return TYPE_TO_CATEGORY[inferredType] || 'sql';
}
