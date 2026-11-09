import { test, expect } from '@playwright/test';
import { LoginPage, ADMIN_USER } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('OrangeHRM - Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.heading).toBeVisible();
  });

  test('should log in with valid credentials and display the dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await expect(loginPage.loginButton).toBeEnabled();
    await loginPage.login(ADMIN_USER.username, ADMIN_USER.password);

    await page.waitForURL(/\/dashboard\/index$/);
    await expect(page).toHaveURL(/\/dashboard\/index$/);
    await expect(dashboard.title).toBeVisible();
    await expect(dashboard.sidePanel).toBeVisible();
    await expect(dashboard.timeAtWorkWidget).toBeVisible();
    await expect(dashboard.quickLaunchWidget).toBeVisible();
  });
});
