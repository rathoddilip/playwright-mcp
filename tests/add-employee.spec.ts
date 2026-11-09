import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { EmployeeProfilePage } from '../pages/EmployeeProfilePage';
import { uniqueEmployeeId } from './test-data';

test.describe('OrangeHRM - PIM: Add Employee', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).loginAsAdmin();
  });

  test('should add a new employee and open their profile', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const employeeList = new EmployeeListPage(page);
    const addEmployee = new AddEmployeePage(page);
    const profile = new EmployeeProfilePage(page);
    const employee = { firstName: 'John123', lastName: 'Doe456', employeeId: uniqueEmployeeId() };

    await dashboard.navigateTo('PIM');
    await expect(employeeList.title).toBeVisible();

    await employeeList.goToAddEmployee();
    await expect(addEmployee.heading).toBeVisible();

    await addEmployee.fillEmployee(employee);
    await addEmployee.save();

    await expect(page).toHaveURL(EmployeeProfilePage.URL_PATTERN);
    await expect(profile.personalDetailsTab).toBeVisible();
    await expect(profile.employeeNameHeading('John123 Doe456')).toBeVisible();
  });
});
