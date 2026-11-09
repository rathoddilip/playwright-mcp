import { test, expect } from '@playwright/test';

const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
const VALID_USER = { username: 'Admin', password: 'admin123' };

test.describe('OrangeHRM - Login Functionality', () => {
  // Public demo site can be slow to respond; allow extra time for navigation.
  test.describe.configure({ timeout: 60_000 });

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('should log in with valid credentials and display the dashboard', async ({ page }) => {
    const usernameInput = page.getByRole('textbox', { name: 'Username' });
    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    const loginButton = page.getByRole('button', { name: 'Login' });

    await usernameInput.fill(VALID_USER.username);
    await passwordInput.fill(VALID_USER.password);
    await expect(loginButton).toBeEnabled();
    await loginButton.click();

    // Navigation to the dashboard
    await page.waitForURL(/\/dashboard\/index$/);
    await expect(page).toHaveURL(/\/dashboard\/index$/);

    // Dashboard UI is rendered
    await expect(page.getByRole('banner').getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Sidepanel' })).toBeVisible();
    await expect(page.getByText('Time at Work')).toBeVisible();
    await expect(page.getByText('Quick Launch')).toBeVisible();
  });
});
