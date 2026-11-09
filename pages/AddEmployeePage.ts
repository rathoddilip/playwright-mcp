import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface NewEmployee {
  firstName: string;
  lastName: string;
  /** Optional; the form pre-fills the next free Id when omitted. */
  employeeId?: string;
}

/** PIM > Add Employee (/pim/addEmployee). */
export class AddEmployeePage extends BasePage {
  readonly heading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Add Employee' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdInput = this.inputByLabel('Employee Id');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async fillEmployee({ firstName, lastName, employeeId }: NewEmployee): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    if (employeeId) {
      await this.employeeIdInput.fill(employeeId);
    }
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  /** Fills the form, saves, and waits for the new employee's profile page. */
  async addEmployee(employee: NewEmployee): Promise<void> {
    await this.fillEmployee(employee);
    await this.save();
    await this.page.waitForURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+$/);
  }
}
