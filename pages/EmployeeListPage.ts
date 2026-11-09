import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** PIM > Employee List (/pim/viewEmployeeList). */
export class EmployeeListPage extends BasePage {
  readonly title: Locator;
  readonly employeeInformationHeading: Locator;
  readonly addEmployeeTab: Locator;
  readonly employeeNameInput: Locator;
  readonly searchButton: Locator;
  readonly recordsFoundText: Locator;
  readonly resultsTable: Locator;

  constructor(page: Page) {
    super(page);
    
    this.title = this.headerTitle('PIM');
    this.employeeInformationHeading = page.getByRole('heading', { name: 'Employee Information' });
    this.addEmployeeTab = page
      .getByRole('navigation', { name: 'Topbar Menu' })
      .getByRole('link', { name: 'Add Employee' });
    this.employeeNameInput = this.inputByLabel('Employee Name');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.recordsFoundText = page.getByText(/\(\d+\) Records? Found/);
    this.resultsTable = page.getByRole('table');
  }

  async goToAddEmployee(): Promise<void> {
    await this.addEmployeeTab.click();
  }

  async searchByEmployeeName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    await this.searchButton.click();
  }

  /** Data row in the results table containing the given text. */
  resultRow(text: string): Locator {
    return this.resultsTable.getByRole('row').filter({ hasText: text });
  }
}
