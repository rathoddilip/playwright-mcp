import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('OrangeHRM - Logout Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).loginAsAdmin();
  });

  test('should log out from the user menu and return to the login page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    await expect(dashboard.title).toBeVisible();

    await dashboard.openUserMenu();
    await expect(dashboard.logoutMenuItem).toBeVisible();
    await dashboard.logoutMenuItem.click();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
