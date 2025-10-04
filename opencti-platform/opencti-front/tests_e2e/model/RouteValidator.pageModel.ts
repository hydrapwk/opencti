import { Page } from '@playwright/test';

/**
 * RouteValidator Page Model
 *
 * A comprehensive page model for systematic route validation in OpenCTI.
 * Provides utilities for testing routes, detecting errors, and validating page states.
 */

export interface RouteTestConfig {
  path: string;
  name: string;
  requiresAuth?: boolean;
  expectedElements?: string[];
  skipReason?: string;
  timeout?: number;
  waitForElements?: boolean;
  customValidation?: (page: Page) => Promise<boolean>;
}

export interface RouteValidationResult {
  success: boolean;
  route: RouteTestConfig;
  error?: string;
  networkErrors: NetworkError[];
  jsErrors: JavaScriptError[];
  loadTime: number;
  screenshot?: string;
}

export interface NetworkError {
  url: string;
  status: number;
  method: string;
  timestamp: number;
}

export interface JavaScriptError {
  message: string;
  stack?: string;
  timestamp: number;
  source: 'page' | 'console';
}

export default class RouteValidatorPageModel {
  private page: Page;
  private networkErrors: NetworkError[] = [];
  private jsErrors: JavaScriptError[] = [];
  private currentRoute?: RouteTestConfig;

  // Common selectors for OpenCTI pages
  private readonly selectors = {
    // Error states
    errorPage: '[data-testid="error-page"], .error-page',
    notFound: 'text=/404|Not Found/i',
    serverError: 'text=/500|Server Error/i',
    accessDenied: 'text=/Access Denied|Unauthorized/i',

    // Loading states
    loader: '[data-testid="loader"], .MuiCircularProgress-root, [role="progressbar"]',
    skeleton: '.MuiSkeleton-root',

    // Page structure
    mainContent: 'main, [role="main"], [data-testid*="page"]',
    navigation: '[data-testid="left-bar"], .MuiDrawer-root',
    topBar: '[data-testid="top-bar"], .MuiAppBar-root',

    // Data tables and lists
    dataTable: '[data-testid*="table"], .MuiDataGrid-root, [role="grid"]',
    listItems: '[data-testid*="item"], .MuiList-root li, [role="listitem"]',

    // Search inputs
    searchInput: 'input[type="search"], input[placeholder*="search" i], [data-testid*="search"]',
    formFields: 'input, select, textarea, [role="textbox"], [role="combobox"]',

    // Buttons and actions
    actionButtons: '[data-testid*="button"], button, [role="button"]',

    // OpenCTI specific
    entityList: '[data-testid*="entity"], [data-testid*="list"]',
    dashboardWidgets: '[data-testid*="widget"], [data-testid*="chart"]',
  };

  constructor(page: Page) {
    this.page = page;
    this.setupErrorHandlers();
  }

  private setupErrorHandlers(): void {
    // Track network errors
    this.page.on('response', (response) => {
      if (response.status() >= 400) {
        this.networkErrors.push({
          url: response.url(),
          status: response.status(),
          method: response.request().method(),
          timestamp: Date.now(),
        });
      }
    });

    // Track page JavaScript errors
    this.page.on('pageerror', (error) => {
      this.jsErrors.push({
        message: error.message,
        stack: error.stack,
        timestamp: Date.now(),
        source: 'page',
      });
    });

    // Track console errors (filtered)
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!this.isIgnorableConsoleError(text)) {
          this.jsErrors.push({
            message: `Console Error: ${text}`,
            timestamp: Date.now(),
            source: 'console',
          });
        }
      }
    });
  }

  private isIgnorableConsoleError(message: string): boolean {
    const ignorablePatterns = [
      'WebSocket connection',
      'Failed to load resource',
      'favicon.ico',
      'sw.js', // Service worker
      'Extension',
      'chrome-extension',
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'ChunkLoadError',
      'Loading chunk',
      'AbortError',
      'NetworkError when attempting to fetch resource',
    ];

    return ignorablePatterns.some((pattern) => message.toLowerCase().includes(pattern.toLowerCase()));
  }

  private isIgnorableJSError(message: string): boolean {
    // More specific JS error filtering for strict mode
    const ignorableJsPatterns = [
      'Script error',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Loading CSS chunk',
      'Loading chunk',
      'Network request failed',
      'AbortError',
    ];

    return ignorableJsPatterns.some((pattern) => message.toLowerCase().includes(pattern.toLowerCase()));
  }

  /**
   * Validate a single route
   */
  async validateRoute(config: RouteTestConfig): Promise<RouteValidationResult> {
    const startTime = Date.now();
    this.currentRoute = config;
    this.clearErrors();

    try {
      // Navigate to route with better error handling
      const response = await this.page.goto(config.path, {
        waitUntil: 'networkidle',
        timeout: config.timeout || 30000,
      });

      // Check navigation response - strict validation
      if (!response) {
        throw new Error('Navigation failed - no response received');
      }

      if (response.status() >= 400) {
        throw new Error(`HTTP ${response.status()} - ${response.statusText()}`);
      }

      // Wait for page to be ready
      await this.waitForPageReady(config);

      // Perform strict validation checks
      await this.performValidationChecks(config);

      // Custom validation if provided
      if (config.customValidation) {
        const customResult = await config.customValidation(this.page);
        if (!customResult) {
          throw new Error('Custom validation requirements not met');
        }
      }

      // Check for any errors that occurred during navigation
      if (this.jsErrors.length > 0) {
        const criticalJsErrors = this.jsErrors.filter((err) => !this.isIgnorableJSError(err.message));
        if (criticalJsErrors.length > 0) {
          throw new Error(`JavaScript errors detected: ${criticalJsErrors[0].message}`);
        }
      }

      // Check for critical network errors
      const criticalNetworkErrors = this.networkErrors.filter((err) => err.status >= 500);
      if (criticalNetworkErrors.length > 0) {
        throw new Error(`Server errors detected: ${criticalNetworkErrors[0].status} ${criticalNetworkErrors[0].url}`);
      }

      const loadTime = Date.now() - startTime;

      return {
        success: true,
        route: config,
        networkErrors: [...this.networkErrors],
        jsErrors: [...this.jsErrors],
        loadTime,
      };
    } catch (error) {
      const loadTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Enhanced error reporting for strict mode
      let detailedError = errorMessage;
      if (this.networkErrors.length > 0) {
        const errorDetails = this.networkErrors.map((e) => `${e.status} ${e.url}`).join(', ');
        detailedError += ` | Network errors: ${errorDetails}`;
      }
      if (this.jsErrors.length > 0) {
        const errorDetails = this.jsErrors.slice(0, 2).map((e) => e.message).join(', ');
        detailedError += ` | JS errors: ${errorDetails}`;
      }

      // Take screenshot on failure with better error handling
      let screenshot: string | undefined;
      try {
        const timestamp = Date.now();
        const safeName = config.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const screenshotPath = `test-results/screenshots/failure-${safeName}-${timestamp}.png`;
        await this.page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });
        screenshot = screenshotPath;
      } catch {
        // Screenshot failed, continue without it
      }

      return {
        success: false,
        route: config,
        error: detailedError,
        networkErrors: [...this.networkErrors],
        jsErrors: [...this.jsErrors],
        loadTime,
        screenshot,
      };
    }
  }

  private async waitForPageReady(config: RouteTestConfig): Promise<void> {
    // Wait for DOM to be ready
    await this.page.waitForLoadState('domcontentloaded');

    // Wait for any loading indicators to disappear
    try {
      await this.page.waitForSelector(this.selectors.loader, {
        state: 'hidden',
        timeout: 10000,
      });
    } catch {
      // Loading indicator might not be present, that's okay
    }

    // Wait for expected elements if specified
    if (config.expectedElements && config.waitForElements !== false) {
      for (const selector of config.expectedElements) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
        } catch {
          // Expected element not found - continue anyway
        }
      }
    }
  }

  private async performValidationChecks(config: RouteTestConfig): Promise<void> {
    // Check for error states
    await this.checkForErrorStates();

    // Check for basic page structure
    await this.checkBasicStructure();

    // Check authentication if required
    if (config.requiresAuth !== false) {
      await this.checkAuthentication();
    }

    // Check for data loading (if applicable)
    await this.checkDataLoading();
  }

  private async checkForErrorStates(): Promise<void> {
    const errorChecks = [
      { selector: this.selectors.notFound, message: 'Page shows 404 Not Found' },
      { selector: this.selectors.serverError, message: 'Page shows 500 Server Error' },
      { selector: this.selectors.accessDenied, message: 'Page shows Access Denied' },
    ];

    for (const check of errorChecks) {
      const hasError = await this.page.locator(check.selector).isVisible().catch(() => false);
      if (hasError) {
        throw new Error(check.message);
      }
    }
  }

  private async checkBasicStructure(): Promise<void> {
    // Check for main content area - be more flexible but still strict
    const hasMainContent = await Promise.race([
      this.page.locator(this.selectors.mainContent).first().isVisible(),
      this.page.locator('body > div').first().isVisible(),
      this.page.locator('[role="main"]').first().isVisible(),
    ]).catch(() => false);

    if (!hasMainContent) {
      throw new Error('Page missing basic content structure');
    }

    // Check page title - strict validation
    const title = await this.page.title();
    if (!title) {
      throw new Error('Page has no title set');
    }

    if (title.toLowerCase().includes('error')) {
      throw new Error(`Page title indicates error: "${title}"`);
    }

    // Check for React/MUI components (OpenCTI specific)
    const hasReactComponents = await this.page.locator('.MuiContainer-root, .MuiBox-root, [data-testid]')
      .first()
      .isVisible()
      .catch(() => false);

    if (!hasReactComponents) {
      throw new Error('Page missing expected React/MUI components');
    }
  }

  private async checkAuthentication(): Promise<void> {
    // Check if we're redirected to login
    const currentUrl = this.page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
      throw new Error('Redirected to login page - authentication required');
    }

    // Check for presence of navigation (indicates authenticated state)
    const hasNavigation = await this.page.locator(this.selectors.navigation)
      .isVisible()
      .catch(() => false);

    if (!hasNavigation) {
      throw new Error('Navigation not found - authentication may have failed');
    }
  }

  private async checkDataLoading(): Promise<void> {
    // Wait for any initial data loading to complete
    await this.page.waitForTimeout(2000);

    // Check if there are any persistent skeleton loaders (strict check)
    const hasSkeletons = await this.page.locator(this.selectors.skeleton)
      .first()
      .isVisible()
      .catch(() => false);

    if (hasSkeletons) {
      // Wait a bit more and check again
      await this.page.waitForTimeout(3000);
      const stillHasSkeletons = await this.page.locator(this.selectors.skeleton)
        .first()
        .isVisible()
        .catch(() => false);

      if (stillHasSkeletons) {
        throw new Error('Page has persistent loading skeletons - data may not be loading properly');
      }
    }

    // Check for error states in data loading
    const hasLoadingError = await this.page.locator('text=/failed to load|loading error|network error/i')
      .first()
      .isVisible()
      .catch(() => false);

    if (hasLoadingError) {
      throw new Error('Data loading error detected on page');
    }
  }

  private clearErrors(): void {
    this.networkErrors = [];
    this.jsErrors = [];
  }

  /**
   * Check if a specific route is accessible
   */
  async isRouteAccessible(path: string): Promise<boolean> {
    try {
      const response = await this.page.goto(path, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });
      return response !== null && response.status() < 400;
    } catch {
      return false;
    }
  }

  /**
   * Get current validation state
   */
  getCurrentErrors() {
    return {
      networkErrors: [...this.networkErrors],
      jsErrors: [...this.jsErrors],
    };
  }

  /**
   * Wait for specific page elements to be ready
   */
  async waitForPageElements(selectors: string[], timeout = 10000): Promise<boolean> {
    try {
      await Promise.all(
        selectors.map((selector) => this.page.waitForSelector(selector, { timeout })),
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if page has loaded data (not empty state)
   */
  async hasDataLoaded(): Promise<boolean> {
    const dataIndicators = [
      this.selectors.dataTable,
      this.selectors.listItems,
      this.selectors.entityList,
      this.selectors.dashboardWidgets,
    ];

    for (const indicator of dataIndicators) {
      const hasData = await this.page.locator(indicator).first().isVisible().catch(() => false);
      if (hasData) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validate multiple routes in sequence
   */
  async validateRoutes(configs: RouteTestConfig[]): Promise<RouteValidationResult[]> {
    const results: RouteValidationResult[] = [];

    for (const config of configs) {
      if (config.skipReason) {
        continue;
      }

      const result = await this.validateRoute(config);
      results.push(result);

      // Small delay between requests
      await this.page.waitForTimeout(500);
    }

    return results;
  }

  /**
   * Generate a summary report of validation results
   */
  generateReport(results: RouteValidationResult[]) {
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);
    const totalNetworkErrors = results.reduce((sum, r) => sum + r.networkErrors.length, 0);
    const totalJsErrors = results.reduce((sum, r) => sum + r.jsErrors.length, 0);
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;

    return {
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        successRate: successful.length / results.length,
        totalNetworkErrors,
        totalJsErrors,
        averageLoadTime: Math.round(avgLoadTime),
      },
      failedRoutes: failed.map((r) => ({
        path: r.route.path,
        name: r.route.name,
        error: r.error,
      })),
      networkErrors: results.flatMap((r) => r.networkErrors),
      jsErrors: results.flatMap((r) => r.jsErrors),
    };
  }
}
