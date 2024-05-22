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
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const randomEmail = `${firstName}${lastName}${faker.random.numeric(5)}@test.com`
  // const address = faker.address.streetAddress()
  const address = '4700 Argonne Dr'
  const city = 'SAN ANTONIO'
  const state = 'TX'
  const zip = '78205'

  await accountsPage.createAccount(accountName,randomEmail,firstName,lastName,address,city,state,zip)
});

