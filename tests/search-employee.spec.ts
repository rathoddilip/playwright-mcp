import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { uniqueEmployeeId, uniqueSuffix } from './test-data';

test.describe('OrangeHRM - PIM: Search Employee', () => {
  // The shared demo data changes constantly, so each run creates the employee it searches for.
  let employee: { firstName: string; lastName: string; employeeId: string };

  test.beforeEach(async ({ page }) => {
    employee = {
      firstName: `Search${uniqueSuffix()}`,
      lastName: 'Employee',
      employeeId: uniqueEmployeeId(),
    };

    await new LoginPage(page).loginAsAdmin();
    await page.goto('/web/index.php/pim/addEmployee', { waitUntil: 'domcontentloaded' });
    await new AddEmployeePage(page).addEmployee(employee);
    await page.goto('/web/index.php/dashboard/index', { waitUntil: 'domcontentloaded' });
  });

  test('should find an employee by name from the PIM module', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const employeeList = new EmployeeListPage(page);

    await dashboard.navigateTo('PIM');
    await expect(page).toHaveURL(/\/pim\/viewEmployeeList$/);
    await expect(employeeList.employeeInformationHeading).toBeVisible();

    await employeeList.searchByEmployeeName(employee.firstName);

    await expect(employeeList.recordsFoundText).toHaveText('(1) Record Found');
    const row = employeeList.resultRow(employee.employeeId);
    await expect(row).toBeVisible();
    await expect(row.getByRole('cell', { name: employee.firstName })).toBeVisible();
    await expect(row.getByRole('cell', { name: employee.lastName })).toBeVisible();
  });
});
