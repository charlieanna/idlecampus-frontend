/**
 * Journey Map Components
 *
 * Visual journey navigation for the DSA Mastery course.
 */

export { JourneyMapSidebar } from './JourneyMapSidebar';
export type { JourneyMapSidebarProps } from './JourneyMapSidebar';

export { JourneyMapDropdown } from './JourneyMapDropdown';
export type { JourneyMapDropdownProps } from './JourneyMapDropdown';

export { ModuleDashboard } from './ModuleDashboard';
export type { ModuleDashboardProps } from './ModuleDashboard';

export { JourneyNode } from './JourneyNode';
export type { JourneyNodeProps } from './JourneyNode';

export {
  JOURNEY_NODES,
  DIFFICULTY_PHASES,
  getNextNode,
  getPreviousNode,
  getNodeByModuleId,
} from './journeyMapConfig';
export type { JourneyNodeConfig } from './journeyMapConfig';
