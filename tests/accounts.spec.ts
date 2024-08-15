// @ts-check
const { test, expect } = require('@playwright/test');
import { PageManager } from '../Page/pageManager'
import { LoginPage } from '../Page/loginPage'
import { AccountsPage } from '../Page/accountsPage';
import {faker} from '@faker-js/faker'

let accountName = faker.company.companyName();
let accountName1 = accountName;

test.beforeEach('login',async ({ page}) => {

  const homePage = new LoginPage(page);
  await homePage.login('Michael.su','Taylor!24680','Automation Account [IMPERSONATE]')
  await homePage.navigateToAccountsPage()
})
test('Create Account', async ({ page }) => {
  const pm = new PageManager(page)
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const randomEmail = `${firstName}${lastName}${faker.random.numeric(5)}@test.com`
  // const address = faker.address.streetAddress()
  const address = '4700 Argonne Dr'
  const city = 'SAN ANTONIO'
  const state = 'TX'
  const zip = '78205'
  await pm.navigateTo().createAccount(accountName1,randomEmail,firstName,lastName,address,city,state,zip)
});
test('Add Bank Account', async ({ page }) => {
  const pm = new PageManager(page)

  const accountHolderName = faker.name.jobDescriptor()

  await pm.navigateTo().searchAccount(accountName1)
  await pm.navigateTo().addBankAccount('Chase','55500 Ocean Dr','fort worth',accountHolderName)
})
test('Add Account Note', async ({ page }) => {
  const accountsPage = new AccountsPage(page)
  const pm = new PageManager(page)
  await pm.navigateTo().searchAccount(accountName1)
  await pm.navigateTo().addNoteToAccount()
})

