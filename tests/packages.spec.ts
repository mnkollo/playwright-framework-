const { test, expect } = require('@playwright/test');
import { PageManager } from '../Page/pageManager'
import { faker } from '@faker-js/faker'

let accountName = '';

test.describe('Accounts', () => {
  test.beforeEach('login', async ({ page }) => {
    const pm = new PageManager(page)
    const url = process.env.URL || ''; // Provide a default value if process.env.URL is undefined
    const username = process.env.USERNAME || ''; 
    const password = process.env.PASSWORD || ''; 
    const user = process.env.USER1 || ''; 

    await pm.onLoginPage().login(url,username,password,user)
    .catch(error => {
      console.error('Login failed:', error);
      throw error; // Rethrow to ensure the test fails
  });
    await pm.onHomePage().navigateToAccountsPage()
  })
  test('Verify user can Create Business Account with all fields', async ({ page }) => {
    const pm = new PageManager(page)
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const randomEmail = `${firstName}${lastName}${faker.random.numeric(5)}@test.com`
    const address = '4700 Argonne Dr'
    const city = 'SAN ANTONIO'
    const state = 'TX'
    const zip = '78205'
    accountName = faker.company.name();

    await pm.onAccountsPage().createAccount(accountName, randomEmail, firstName, lastName, address, city, state, zip)
  });
})