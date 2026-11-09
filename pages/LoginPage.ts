import { type Locator, type Page } from '@playwright/test';

export const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
export const ADMIN_USER = { username: 'Admin', password: 'admin123' } as const;

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Login' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto(): Promise<void> {
    await this.page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Opens the login page and signs in as the demo Admin, waiting for the dashboard. */
  async loginAsAdmin(): Promise<void> {
    await this.goto();
    await this.login(ADMIN_USER.username, ADMIN_USER.password);
    await this.page.waitForURL(/\/dashboard\/index$/);
  }
}
