import { type Locator, type Page } from '@playwright/test';

/** Sidebar modules verified on the OrangeHRM demo (navigation "Sidepanel"). */
export type ModuleName =
  | 'Admin'
  | 'PIM'
  | 'Leave'
  | 'Time'
  | 'Recruitment'
  | 'My Info'
  | 'Performance'
  | 'Dashboard'
  | 'Directory'
  | 'Maintenance'
  | 'Claim'
  | 'Buzz';

/**
 * Shared layout of every page after login: left side panel, top header and user menu.
 */
export class BasePage {
  readonly page: Page;
  readonly sidePanel: Locator;
  readonly header: Locator;
  readonly userMenuTrigger: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidePanel = page.getByRole('navigation', { name: 'Sidepanel' });
    this.header = page.getByRole('banner');
    this.userMenuTrigger = this.header.getByRole('img', { name: 'profile picture' });
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
  }

  /** Module title shown in the top header, e.g. "Dashboard", "PIM", "Admin". */
  headerTitle(title: string): Locator {
    return this.header.getByRole('heading', { name: title, exact: true });
  }

  async navigateTo(module: ModuleName): Promise<void> {
    await this.sidePanel.getByRole('link', { name: module, exact: true }).click();
  }

  async openUserMenu(): Promise<void> {
    await this.userMenuTrigger.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutMenuItem.click();
  }

  /**
   * OrangeHRM form inputs are not linked to their labels, and several share the
   * same placeholder. Find the input inside the form group with the given label text.
   */
  protected inputByLabel(label: string): Locator {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .getByRole('textbox');
  }
}
