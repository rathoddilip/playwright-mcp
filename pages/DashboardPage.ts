import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly title: Locator;
  readonly timeAtWorkWidget: Locator;
  readonly quickLaunchWidget: Locator;

  constructor(page: Page) {
    super(page);
    this.title = this.headerTitle('Dashboard');
    this.timeAtWorkWidget = page.getByText('Time at Work');
    this.quickLaunchWidget = page.getByText('Quick Launch');
  }
}
