import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** PIM > employee profile (/pim/viewPersonalDetails/empNumber/{id}). */
export class EmployeeProfilePage extends BasePage {
  static readonly URL_PATTERN = /\/pim\/viewPersonalDetails\/empNumber\/\d+$/;

  readonly personalDetailsTab: Locator;

  constructor(page: Page) {
    super(page);
    // Tabs have no accessible name of their own; the name lives on the link inside each tab.
    this.personalDetailsTab = page.getByRole('tablist').getByRole('link', { name: 'Personal Details' });
  }

  /** Heading with the employee's full name, e.g. "John123 Doe456". */
  employeeNameHeading(fullName: string): Locator {
    return this.page.getByRole('heading', { name: fullName, exact: true });
  }
}
