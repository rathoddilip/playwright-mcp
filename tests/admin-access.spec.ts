import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminPage } from '../pages/AdminPage';

test.describe('OrangeHRM - Admin Module Access', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).loginAsAdmin();
  });

  test('should open System Users from the Admin tab', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const admin = new AdminPage(page);

    await dashboard.navigateTo('Admin');

    await expect(page).toHaveURL(/\/admin\/viewSystemUsers$/);
    await expect(admin.title).toBeVisible();
    await expect(admin.systemUsersHeading).toBeVisible();
    await expect(admin.addButton).toBeVisible();
  });
});
