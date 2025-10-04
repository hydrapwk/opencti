import { RouteTestConfig } from '../model/RouteValidator.pageModel';

/**
 * Comprehensive Route Configurations for OpenCTI
 *
 * This file contains all route configurations organized by functional areas.
 * Each route includes expected elements, timeout settings, and validation criteria.
 */

// Dashboard and Main Routes
export const DASHBOARD_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard',
    name: 'Main Dashboard',
    expectedElements: ['[data-testid="dashboard-page"]'],
    timeout: 15000,
  },
  {
    path: '/dashboard/workspaces/dashboards',
    name: 'Custom Dashboards',
    expectedElements: ['[data-testid="dashboards-page"], .MuiContainer-root'],
  },
];

// Search Routes
export const SEARCH_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/search',
    name: 'Search Root',
  },
  {
    path: '/dashboard/search/knowledge',
    name: 'Knowledge Search',
    expectedElements: ['input[type="search"], [data-testid*="search"]'],
  },
  {
    path: '/dashboard/search/files',
    name: 'File Search',
    expectedElements: ['input[type="search"], [data-testid*="search"]'],
  },
];

// Analysis Routes
export const ANALYSIS_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/analyses',
    name: 'Analyses Root',
    expectedElements: ['[data-testid*="analyses"], main'],
  },
  {
    path: '/dashboard/analyses/reports',
    name: 'Reports',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/analyses/groupings',
    name: 'Groupings',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/analyses/malware_analyses',
    name: 'Malware Analyses',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/analyses/notes',
    name: 'Notes',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/analyses/external_references',
    name: 'External References',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
];

// Case Management Routes
export const CASE_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/cases',
    name: 'Cases Root',
    expectedElements: ['[data-testid*="cases"], main'],
  },
  {
    path: '/dashboard/cases/incidents',
    name: 'Incident Response',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/cases/rfis',
    name: 'Requests for Information',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/cases/rfts',
    name: 'Requests for Takedown',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/cases/tasks',
    name: 'Tasks',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/cases/feedbacks',
    name: 'Feedbacks',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
];

// Event Routes
export const EVENT_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/events',
    name: 'Events Root',
    expectedElements: ['[data-testid*="events"], main'],
  },
  {
    path: '/dashboard/events/incidents',
    name: 'Security Incidents',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/events/sightings',
    name: 'Sightings',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
];

// Threat Intelligence Routes
export const THREAT_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/threats',
    name: 'Threats Root',
    expectedElements: ['[data-testid*="threats"], main'],
  },
  {
    path: '/dashboard/threats/threat_actors_group',
    name: 'Threat Actor Groups',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/threats/threat_actors_individual',
    name: 'Threat Actor Individuals',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/threats/intrusion_sets',
    name: 'Intrusion Sets',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/threats/campaigns',
    name: 'Campaigns',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
];

// Arsenal Routes
export const ARSENAL_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/arsenal',
    name: 'Arsenal Root',
    expectedElements: ['[data-testid*="arsenal"], main'],
  },
  {
    path: '/dashboard/arsenal/malwares',
    name: 'Malwares',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/arsenal/channels',
    name: 'Channels',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/arsenal/tools',
    name: 'Tools',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/arsenal/vulnerabilities',
    name: 'Vulnerabilities',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
];

// Techniques Routes
export const TECHNIQUE_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/techniques',
    name: 'Techniques Root',
    expectedElements: ['[data-testid*="techniques"], main'],
  },
  {
    path: '/dashboard/techniques/attack_patterns',
    name: 'Attack Patterns',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/techniques/narratives',
    name: 'Narratives',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/techniques/courses_of_action',
    name: 'Courses of Action',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/techniques/data_components',
    name: 'Data Components',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/techniques/data_sources',
    name: 'Data Sources',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
];

// Observation Routes
export const OBSERVATION_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/observations',
    name: 'Observations Root',
    expectedElements: ['[data-testid*="observations"], main'],
  },
  {
    path: '/dashboard/observations/observables',
    name: 'Observables',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/observations/artifacts',
    name: 'Artifacts',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/observations/indicators',
    name: 'Indicators',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/observations/infrastructures',
    name: 'Infrastructures',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
];

// Entity Routes
export const ENTITY_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/entities',
    name: 'Entities Root',
    expectedElements: ['[data-testid*="entities"], main'],
  },
  {
    path: '/dashboard/entities/sectors',
    name: 'Sectors',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/entities/events',
    name: 'Events',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/entities/organizations',
    name: 'Organizations',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/entities/systems',
    name: 'Systems',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/entities/individuals',
    name: 'Individuals',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
];

// Location Routes
export const LOCATION_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/locations',
    name: 'Locations Root',
    expectedElements: ['[data-testid*="locations"], main'],
  },
  {
    path: '/dashboard/locations/regions',
    name: 'Regions',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/locations/countries',
    name: 'Countries',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/locations/administrative_areas',
    name: 'Administrative Areas',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/locations/cities',
    name: 'Cities',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/locations/positions',
    name: 'Positions',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
  },
];

// Data Management Routes
export const DATA_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/data',
    name: 'Data Root',
    expectedElements: ['[data-testid*="data"], main'],
  },
  {
    path: '/dashboard/data/entities',
    name: 'Data Entities',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
    timeout: 20000, // Data pages might be slower
  },
  {
    path: '/dashboard/data/relationships',
    name: 'Data Relationships',
    expectedElements: ['[data-testid*="table"], [data-testid*="list"]'],
    timeout: 20000,
  },
  {
    path: '/dashboard/data/import',
    name: 'Data Import',
    expectedElements: ['[data-testid*="import"], main'],
  },
  {
    path: '/dashboard/data/import/connectors',
    name: 'Import Connectors',
    expectedElements: ['[data-testid*="connector"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/data/processing',
    name: 'Data Processing',
    expectedElements: ['[data-testid*="processing"], [data-testid*="task"]'],
  },
  {
    path: '/dashboard/data/sharing',
    name: 'Data Sharing',
    expectedElements: ['[data-testid*="sharing"], main'],
  },
  {
    path: '/dashboard/data/ingestion',
    name: 'Data Ingestion',
    expectedElements: ['[data-testid*="ingestion"], main'],
  },
];

// Workspace Routes
export const WORKSPACE_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/workspaces',
    name: 'Workspaces Root',
    expectedElements: ['[data-testid*="workspace"], main'],
  },
  {
    path: '/dashboard/workspaces/dashboards',
    name: 'Custom Dashboards',
    expectedElements: ['[data-testid*="dashboard"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/workspaces/investigations',
    name: 'Investigations',
    expectedElements: ['[data-testid*="investigation"], [data-testid*="list"]'],
  },
];

// Settings Routes (Admin)
export const SETTINGS_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/settings',
    name: 'Settings Root',
    expectedElements: ['[data-testid*="settings"], main'],
    timeout: 20000,
  },
  {
    path: '/dashboard/settings/accesses',
    name: 'Access Management',
    expectedElements: ['[data-testid*="access"], main'],
  },
  {
    path: '/dashboard/settings/accesses/roles',
    name: 'Roles',
    expectedElements: ['[data-testid*="role"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/settings/accesses/groups',
    name: 'Groups',
    expectedElements: ['[data-testid*="group"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/settings/accesses/users',
    name: 'Users',
    expectedElements: ['[data-testid*="user"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/settings/accesses/sessions',
    name: 'Sessions',
    expectedElements: ['[data-testid*="session"], [data-testid*="list"]'],
  },
  {
    path: '/dashboard/settings/vocabularies',
    name: 'Vocabularies',
    expectedElements: ['[data-testid*="vocabulary"], main'],
  },
  {
    path: '/dashboard/settings/entities',
    name: 'Entity Types',
    expectedElements: ['[data-testid*="entity"], main'],
  },
  {
    path: '/dashboard/settings/customization',
    name: 'Customization',
    expectedElements: ['[data-testid*="customization"], main'],
  },
  {
    path: '/dashboard/settings/parameters',
    name: 'Parameters',
    expectedElements: ['[data-testid*="parameter"], main'],
  },
];

// Profile Routes
export const PROFILE_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/profile',
    name: 'Profile Root',
    expectedElements: ['[data-testid*="profile"], main'],
  },
  {
    path: '/dashboard/profile/me',
    name: 'My Profile',
    expectedElements: ['[data-testid*="profile"], form, input'],
  },
];

// Audit Routes
export const AUDIT_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/audits',
    name: 'Audits',
    expectedElements: ['[data-testid*="audit"], [data-testid*="list"]'],
    timeout: 20000,
  },
  {
    path: '/dashboard/audits/activities',
    name: 'Activities',
    expectedElements: ['[data-testid*="activity"], [data-testid*="list"]'],
    timeout: 20000,
  },
];

// PIR Routes
export const PIR_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/pirs',
    name: 'Priority Intelligence Requirements',
    expectedElements: ['[data-testid*="pir"], [data-testid*="list"]'],
  },
];

// Public Routes (No Auth Required)
export const PUBLIC_ROUTES: RouteTestConfig[] = [
  {
    path: '/public/',
    name: 'Public Data Sharing',
    requiresAuth: false,
    expectedElements: ['main, .MuiContainer-root'],
  },
];

// Routes that might be disabled or require special permissions
export const CONDITIONAL_ROUTES: RouteTestConfig[] = [
  {
    path: '/dashboard/trash',
    name: 'Trash',
    expectedElements: ['[data-testid*="trash"], [data-testid*="list"]'],
    skipReason: 'Feature may not be enabled in all environments',
  },
  {
    path: '/dashboard/xtm-hub',
    name: 'XTM Hub',
    expectedElements: ['[data-testid*="xtm"], main'],
    skipReason: 'External integration may not be available',
  },
];

// Utility functions to get route collections
export const getAllRoutes = (): RouteTestConfig[] => [
  ...DASHBOARD_ROUTES,
  ...SEARCH_ROUTES,
  ...ANALYSIS_ROUTES,
  ...CASE_ROUTES,
  ...EVENT_ROUTES,
  ...THREAT_ROUTES,
  ...ARSENAL_ROUTES,
  ...TECHNIQUE_ROUTES,
  ...OBSERVATION_ROUTES,
  ...ENTITY_ROUTES,
  ...LOCATION_ROUTES,
  ...DATA_ROUTES,
  ...WORKSPACE_ROUTES,
  ...PROFILE_ROUTES,
  ...PIR_ROUTES,
  // Note: Settings and Audit routes excluded from getAllRoutes as they require admin permissions
  // Add them back when user has appropriate permissions
];

export const getCriticalRoutes = (): RouteTestConfig[] => [
  ...DASHBOARD_ROUTES,
  ...SEARCH_ROUTES.slice(0, 2), // Just main search routes
  ...ANALYSIS_ROUTES.slice(0, 1), // Just root
  ...CASE_ROUTES.slice(0, 1), // Just root
  ...THREAT_ROUTES.slice(0, 1), // Just root
  ...PROFILE_ROUTES,
  // These are absolutely essential routes that must always work
];

export const getRoutesByCategory = (category: string): RouteTestConfig[] => {
  const categoryMap: Record<string, RouteTestConfig[]> = {
    dashboard: DASHBOARD_ROUTES,
    search: SEARCH_ROUTES,
    analysis: ANALYSIS_ROUTES,
    cases: CASE_ROUTES,
    events: EVENT_ROUTES,
    threats: THREAT_ROUTES,
    arsenal: ARSENAL_ROUTES,
    techniques: TECHNIQUE_ROUTES,
    observations: OBSERVATION_ROUTES,
    entities: ENTITY_ROUTES,
    locations: LOCATION_ROUTES,
    data: DATA_ROUTES,
    workspaces: WORKSPACE_ROUTES,
    profile: PROFILE_ROUTES,
    pirs: PIR_ROUTES,
    // Note: settings, audits, and public routes are excluded from regular testing
    // They can be added back with proper permission handling
  };

  return categoryMap[category] || [];
};

// Route groups for different test scenarios
export const SMOKE_TEST_ROUTES = getCriticalRoutes();

export const FULL_TEST_ROUTES = getAllRoutes();

// Optional route collections for specialized testing
export const ADMIN_ONLY_ROUTES = [
  ...SETTINGS_ROUTES,
  ...AUDIT_ROUTES,
  ...DATA_ROUTES.filter((r) => r.path.includes('import') || r.path.includes('processing')),
];

export const PUBLIC_ACCESS_ROUTES = PUBLIC_ROUTES;

export const CONDITIONAL_ACCESS_ROUTES = CONDITIONAL_ROUTES;
