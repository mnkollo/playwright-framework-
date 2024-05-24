// @ts-check
const { test, expect } = require('@playwright/test');
import { LoginPage } from '../Page/loginPage'
import { AccountsPage } from '../Page/accountsPage';
import {faker} from '@faker-js/faker'

const accountName = faker.company.name();

test.beforeEach('login',async ({ page}) => {
  const homePage = new LoginPage(page);
  await homePage.login('Michael.su','Taylor!24680','Automation Account [IMPERSONATE]')
  await homePage.navigateToAccountsPage()
})
test('Create Account', async ({ page }) => {
  const accountsPage = new AccountsPage(page);
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
test('Add Bank Account', async ({ page }) => {
  const accountsPage = new AccountsPage(page)
  const accountHolderName = faker.name.jobDescriptor()

  await accountsPage.searchAccount('ABBOTT - HERMISTON')
  await accountsPage.addBankAccount('Chase','55500 Ocean Dr','fort worth',accountHolderName)
})
test('Add Account Note', async ({ page }) => {
  const accountsPage = new AccountsPage(page)

  await accountsPage.searchAccount('ABBOTT - HERMISTON')
  await accountsPage.addNoteToAccount()
})

