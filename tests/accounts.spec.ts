// @ts-check
const { test, expect } = require('@playwright/test');
import { LoginPage } from '../Page/loginPage'
import { AccountsPage } from '../Page/accountsPage';
import {faker} from '@faker-js/faker'

test.beforeEach('login',async ({ page}) => {
  const homePage = new LoginPage(page);
  await homePage.login('Michael.su','Taylor!24680','Automation Account [IMPERSONATE]')
})

test('Create Account', async ({ page }) => {
  const accountsPage = new AccountsPage(page);
  const accountName = faker.company.name();

  await accountsPage.createAccount(accountName)
});

