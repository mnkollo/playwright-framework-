// @ts-check
import { PageManager } from '../../Page/pageManager'
import { faker } from '@faker-js/faker'
import { test } from '../../test-options'

let accountName = '';

test.describe('Accounts', () => {
  test.beforeEach('login', async ({ page,login }) => {
    const pm = new PageManager(page)
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
    //testInfo.annotations.push({ type: 'accountName', description: accountName });

    await pm.onAccountsPage().createAccount(accountName, randomEmail, firstName, lastName, address, city, state, zip)
  });
  test('Add Bank Account', async ({ page }) => {
    const pm = new PageManager(page)
    const accountHolderName = faker.name.jobDescriptor()
    
    await pm.onAccountsPage().searchAccount(accountName)
    await pm.onAccountsPage().addBankAccount('Chase', '55500 Ocean Dr', 'fort worth', accountHolderName)
  })
  test('TC-3430 Verify user can Add Note on account page', async ({ page }) => {
    const pm = new PageManager(page)

    await pm.onAccountsPage().searchAccount(accountName)
    await pm.onAccountsPage().addNoteToAccount('Apples!')
  })
  test('TC-3476 Verify Able to Add Collections Note on account page', async ({ page }) => {
    const pm = new PageManager(page) // Create an instance of PageManager

    await pm.onAccountsPage().searchAccount(accountName)
    await pm.onAccountsPage().addCollectionsNoteToAccount('This is just a test')
  })
  test('TC-1058 Verify user can Add Additional Contact', async ({ page }) => {
    const pm = new PageManager(page)
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const title = faker.name.jobTitle()
    const department = faker.name.jobArea()
    const defaultContact = 'Yes'
    const contactType = 'Decision Maker'
    const email = `${firstName}.${lastName}${faker.random.numeric(5)}@mailinator.com`

    await pm.onAccountsPage().searchAccount(accountName)
    await pm.onAccountsPage().addAdditionalContact(email, firstName, lastName, title, department, defaultContact, contactType)
  })
  test('TC-12077  Back Office - Verify user is able to make a contact inactive', async ({ page }) => {
    const pm = new PageManager(page)

    await pm.onAccountsPage().searchAccount(accountName)
    await pm.onAccountsPage().makeContactInactive('No')
  })
  test('TC-9254 Verify Contact Card on Accounts page shows Buying Enabled when set up in the Back Office', async ({page}) => {
    const pm = new PageManager(page)

    await pm.onAccountsPage().searchAccount(accountName)
    await pm.onAccountsPage().verifyBuyingEnabled('Yes')
  })
  test('TC-1060 Verify user can add Location to account', async ({ page }) =>{
    const pm = new PageManager(page)
    const locationType = 'Temporary'
    const locationName = faker.company.name() + ' Location';
    const address = faker.address.streetAddress()
    const city = faker.address.city()
    const state = faker.address.stateAbbr()
    const zip = faker.address.zipCode()
    const phone = faker.phone.number()

    await pm.onAccountsPage().searchAccount(accountName)
    await pm.onAccountsPage().verifyAbleToCreateLocation(locationType,locationName,address,city, state, zip, phone)
  })
})
