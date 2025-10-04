import { expect, test } from '../fixtures/baseFixtures';
import RouteValidatorPageModel from '../model/RouteValidator.pageModel';
import { getAllRoutes, getCriticalRoutes, getRoutesByCategory } from './routeConfigs';

/**
 * Strict Route Validation Tests for OpenCTI
 *
 * This test suite validates ALL routes in OpenCTI with ZERO TOLERANCE for failures.
 * If ANY route fails to load properly, the entire test suite fails.
 */

test.describe('Strict Route Validation', () => {
  test('All Routes Must Load Successfully - Zero Tolerance', async ({ page }) => {
    const validator = new RouteValidatorPageModel(page);
    const routes = getAllRoutes();

    const routesToTest = routes.filter((route) => !route.skipReason);

    for (const route of routesToTest) {
      const result = await validator.validateRoute(route);

      if (!result.success) {
        // Log error details for debugging
        if (result.networkErrors.length > 0) {
          result.networkErrors.forEach((err, i) => {
            console.error(`Network Error ${i + 1}: ${err.status} ${err.method} ${err.url}`);
          });
        }

        if (result.jsErrors.length > 0) {
          result.jsErrors.forEach((err, i) => {
            console.error(`JS Error ${i + 1}: ${err.message}`);
          });
        }

        // Fail immediately - zero tolerance
        expect(result.success).toBeTruthy();
      }

      // Brief pause between requests
      await page.waitForTimeout(300);
    }

    // Ensure we tested some routes
    expect(routesToTest.length).toBeGreaterThan(0);
  });

  test('Critical Routes Validation - Fail Fast', async ({ page }) => {
    const validator = new RouteValidatorPageModel(page);
    const routes = getCriticalRoutes();

    const routesToTest = routes.filter((route) => !route.skipReason);

    for (const route of routesToTest) {
      const result = await validator.validateRoute(route);

      if (!result.success) {
        // Log detailed error information for critical routes
        if (result.networkErrors.length > 0) {
          console.error(`Critical route network errors: ${JSON.stringify(result.networkErrors)}`);
        }
        if (result.jsErrors.length > 0) {
          console.error(`Critical route JS errors: ${JSON.stringify(result.jsErrors)}`);
        }

        expect(result.success).toBeTruthy();
      }
    }

    expect(routesToTest.length).toBeGreaterThan(0);
  });

  test('Category Validation - All Categories Must Pass', async ({ page }) => {
    const validator = new RouteValidatorPageModel(page);

    const categories = [
      'dashboard',
      'search',
      'analysis',
      'cases',
      'events',
      'threats',
      'arsenal',
      'techniques',
      'observations',
      'entities',
      'locations',
      'data',
      'workspaces',
      'profile',
    ];

    for (const category of categories) {
      const routes = getRoutesByCategory(category);
      const routesToTest = routes.filter((route) => !route.skipReason);

      if (routesToTest.length === 0) {
        continue;
      }

      for (const route of routesToTest) {
        const result = await validator.validateRoute(route);

        if (!result.success) {
          expect(result.success).toBeTruthy();
        }

        // Brief pause between routes
        await page.waitForTimeout(200);
      }
    }
  });

  test('Dashboard Deep Validation - Must Be Perfect', async ({ page }) => {
    const validator = new RouteValidatorPageModel(page);

    const result = await validator.validateRoute({
      path: '/dashboard',
      name: 'Main Dashboard',
      expectedElements: ['[data-testid="dashboard-page"]'],
      customValidation: async (validationPage) => {
        const hasDashboardContent = await validationPage.locator('[data-testid="dashboard-page"]').isVisible();
        if (!hasDashboardContent) {
          return false;
        }

        const hasNavigation = await validationPage.locator('[data-testid="left-bar"], .MuiDrawer-root').isVisible();
        if (!hasNavigation) {
          return false;
        }

        const hasTopBar = await validationPage.locator('[data-testid="top-bar"], .MuiAppBar-root').isVisible();
        if (!hasTopBar) {
          return false;
        }

        return true;
      },
    });

    if (!result.success && result.jsErrors.length > 0) {
      result.jsErrors.forEach((err) => {
        console.error(`Dashboard JS Error: ${err.message}`);
      });
    }

    expect(result.success).toBeTruthy();
    expect(result.jsErrors).toHaveLength(0);

    // Verify data loading
    const hasData = await validator.hasDataLoaded();
    console.log(`Dashboard data loaded: ${hasData ? 'Yes' : 'No'}`);
  });

  test('Navigation Must Be Fully Accessible', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Check main navigation elements
    const leftBar = page.locator('[data-testid="left-bar"], .MuiDrawer-root').first();
    await expect(leftBar).toBeVisible();

    const topBar = page.locator('[data-testid="top-bar"], .MuiAppBar-root').first();
    await expect(topBar).toBeVisible();

    // Check required navigation items
    const requiredMenuItems = [
      'Dashboard',
      'Analyses',
      'Cases',
      'Events',
      'Threats',
      'Arsenal',
      'Techniques',
      'Observations',
      'Entities',
      'Locations',
      'Data',
      'Workspaces',
    ];

    for (const item of requiredMenuItems) {
      const menuItem = page.getByRole('button', { name: new RegExp(item, 'i') })
        .or(page.getByText(item, { exact: false }).first());

      const isVisible = await menuItem.isVisible().catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });

  test('Search Functionality Must Work', async ({ page }) => {
    // Test knowledge search
    await page.goto('/dashboard/search/knowledge');
    await page.waitForLoadState('networkidle');

    const knowledgeSearchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid*="search"]').first();
    await expect(knowledgeSearchInput).toBeVisible();

    // Test file search
    await page.goto('/dashboard/search/files');
    await page.waitForLoadState('networkidle');

    const fileSearchInput = page.locator('input[type="search"], input[placeholder*="search" i], [data-testid*="search"]').first();
    await expect(fileSearchInput).toBeVisible();
  });

  test('Profile Routes Must Always Work', async ({ page }) => {
    const profileRoutes = getRoutesByCategory('profile');
    const validator = new RouteValidatorPageModel(page);

    const routesToTest = profileRoutes.filter((route) => !route.skipReason);

    for (const route of routesToTest) {
      const result = await validator.validateRoute(route);

      if (!result.success) {
        console.error(`Profile route failed: ${route.path}`);
        console.error(`Error: ${result.error}`);
      }

      expect(result.success).toBeTruthy();
    }
  });

  test('Error Handling Must Be Robust', async ({ page }) => {
    // Test invalid route handling
    await page.goto('/dashboard/invalid-route-12345');
    await page.waitForLoadState('domcontentloaded');

    // Should handle invalid routes gracefully
    const hasErrorHandling = await page.locator('text=/404|Not Found|Error/i').isVisible().catch(() => false);
    expect(hasErrorHandling).toBeTruthy();

    // Must be able to recover to valid route
    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 15000 });
  });
});

// Debug helper for investigating specific route failures
test('Debug Single Route', async ({ page }) => {
  const validator = new RouteValidatorPageModel(page);

  // Change this to debug any specific route
  const debugRoute = {
    path: '/dashboard',
    name: 'Debug Target',
    expectedElements: ['[data-testid="dashboard-page"]'],
  };

  const result = await validator.validateRoute(debugRoute);

  if (result.error) {
    console.log(`Debug Error: ${result.error}`);
  }

  if (result.networkErrors.length > 0) {
    result.networkErrors.forEach((err, i) => {
      console.log(`Network Error ${i + 1}: ${err.status} ${err.method} ${err.url}`);
    });
  }

  if (result.jsErrors.length > 0) {
    result.jsErrors.forEach((err, i) => {
      console.log(`JS Error ${i + 1}: ${err.message} (${err.source})`);
      if (err.stack) {
        console.log(`Stack: ${err.stack.substring(0, 300)}...`);
      }
    });
  }

  const hasData = await validator.hasDataLoaded();
  console.log(`Has Data Loaded: ${hasData}`);

  const currentErrors = validator.getCurrentErrors();
  console.log(`Current Network Errors: ${currentErrors.networkErrors.length}`);
  console.log(`Current JS Errors: ${currentErrors.jsErrors.length}`);
});
