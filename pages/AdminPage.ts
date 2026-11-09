import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Admin > User Management > System Users (/admin/viewSystemUsers). */
export class AdminPage extends BasePage {
  readonly title: Locator;
  readonly systemUsersHeading: Locator;
  readonly addButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = this.headerTitle('Admin');
    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
    this.addButton = page.getByRole('button', { name: 'Add' });
  }
}
