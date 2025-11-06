/**
 * Plugin Loader
 *
 * Dynamically loads and renders plugins based on course configuration.
 * Matches backend plugin system.
 *
 * Supported Plugins:
 * - progressive_learning: Step-by-step command practice with hints
 * - command_reference: Searchable command documentation sidebar
 * - formula_sheet: Mathematical/chemical formula reference
 *
 * Usage:
 *   <PluginLoader
 *     plugins={['progressive_learning', 'command_reference']}
 *     pluginOptions={{
 *       progressive_learning: { enabled: true, hints: true },
 *       command_reference: { command_type: 'docker' }
 *     }}
 *   />
 */

import { lazy, Suspense } from 'react';

// ============================================
// TYPES
// ============================================

export interface PluginConfig {
  name: string;
  options: Record<string, any>;
}

export interface PluginLoaderProps {
  plugins: string[];
  pluginOptions?: Record<string, Record<string, any>>;
  courseSlug?: string;
}

// ============================================
// LAZY LOAD PLUGINS
// ============================================

// Lazy load plugin components to reduce initial bundle size
const ProgressiveLearningPlugin = lazy(
  () => import('./ProgressiveLearningPlugin')
);

const CommandReferencePlugin = lazy(
  () => import('./CommandReferencePlugin')
);

const FormulaSheetPlugin = lazy(
  () => import('./FormulaSheetPlugin')
);

// ============================================
// PLUGIN REGISTRY
// ============================================

const PLUGIN_COMPONENTS: Record<string, React.ComponentType<any>> = {
  progressive_learning: ProgressiveLearningPlugin,
  command_reference: CommandReferencePlugin,
  formula_sheet: FormulaSheetPlugin
};

// ============================================
// LOADING FALLBACK
// ============================================

function PluginLoadingFallback({ pluginName }: { pluginName: string }) {
  return (
    <div className="p-4 bg-slate-100 rounded-lg animate-pulse">
      <div className="text-sm text-slate-600">
        Loading {pluginName} plugin...
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PluginLoader({
  plugins,
  pluginOptions = {},
  courseSlug
}: PluginLoaderProps) {
  if (!plugins || plugins.length === 0) {
    return null;
  }

  return (
    <div className="plugin-container">
      {plugins.map((pluginName) => {
        const PluginComponent = PLUGIN_COMPONENTS[pluginName];

        if (!PluginComponent) {
          console.warn(`Plugin "${pluginName}" not found`);
          return null;
        }

        const options = pluginOptions[pluginName] || {};

        return (
          <Suspense
            key={pluginName}
            fallback={<PluginLoadingFallback pluginName={pluginName} />}
          >
            <PluginComponent
              courseSlug={courseSlug}
              {...options}
            />
          </Suspense>
        );
      })}
    </div>
  );
}

// ============================================
// HOOK FOR USING PLUGINS
// ============================================

/**
 * Hook to check if a specific plugin is enabled
 */
export function usePlugin(pluginName: string, plugins: string[]): boolean {
  return plugins.includes(pluginName);
}

/**
 * Hook to get plugin options
 */
export function usePluginOptions(
  pluginName: string,
  pluginOptions: Record<string, Record<string, any>>
): Record<string, any> {
  return pluginOptions[pluginName] || {};
}
