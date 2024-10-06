// @ts-check
import { PageManager } from '../../Page/pageManager'
import { faker } from '@faker-js/faker'
import { test } from '../../test-options'
import * as testData from '../../testData/helperFile';
import * as path from 'path'; // Import the path module

const fs = require('fs');

let accountData = testData.generateAccountData()

test.describe('Actions with Accounts', () => {
  test.beforeAll('login', async ({ page, login }) => {
    const pm = new PageManager(page)

    await pm.onHomePage().navigateToAccountsPage()
    await pm.onAccountsPage().createAccount(accountData.accountName, accountData.email, accountData.firstName, accountData.lastName, accountData.address, accountData.city, accountData.state, accountData.zip)
  })
  test.beforeEach('Navigate To Accounts Page', async ({ page,login }) => {
    const pm = new PageManager(page);
    await pm.onHomePage().searchForAccountFromHomePage(accountData.accountName);
  });
  
  test('Add Bank Account', async ({ page }) => {
    const pm = new PageManager(page)
    const accountHolderName = faker.name.jobDescriptor()

    await pm.onAccountsPage().addBankAccount('Chase', '55500 Ocean Dr', 'fort worth', accountHolderName)
  })
  test('TC-3430 Verify user can Add Note on account page', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onAccountsPage().addNoteToAccount('Apples!')
  })
  test('TC-3476 Verify Able to Add Collections Note on account page', async ({ page }) => {
    const pm = new PageManager(page) // Create an instance of PageManager

    await pm.onAccountsPage().addCollectionsNoteToAccount('This is just a test')
  })
  test('TC-1058 Verify user can Add Additional Contact', async ({ page }) => {
    const pm = new PageManager(page)
    let contactData = testData.generateContactData()

    await pm.onAccountsPage().addAdditionalContact(contactData.email, contactData.firstName, contactData.lastName, contactData.title, contactData.department, contactData.defaultContact, contactData.contactType)
  })
  test('TC-12077  Back Office - Verify user is able to make a contact inactive', async ({ page }) => {
    const pm = new PageManager(page)

    await pm.onAccountsPage().makeContactInactive('No')
  })
  test('TC-9254 Verify Contact Card on Accounts page shows Buying Enabled when set up in the Back Office', async ({ page }) => {
    const pm = new PageManager(page)

    await pm.onAccountsPage().verifyBuyingEnabled('Yes')
  })
  test('TC-1060 Verify user can add Location to account', async ({ page }) => {
    const pm = new PageManager(page)
    let locationData = testData.generateLocationData()

    await pm.onAccountsPage().verifyAbleToCreateLocation(locationData.locationType, locationData.locationName, locationData.address, locationData.city, locationData.state, locationData.zip, locationData.phone)
  })
  test('TC-3486 Verify user can upload document on Account page', async ({ page }) => {
    const pm = new PageManager(page)

    await pm.onAccountsPage().uploadDocument()
  })
  test('TC-7460 Verify user can delete document from an account', async ({ page }) => {
    const pm = new PageManager(page)
    const deletedDocs = 2
    
    await pm.onAccountsPage().deleteDocument(deletedDocs)
  })
  test('TC-1054 Verify user can Create Sales Agreement on New Account', async ({ page }) => {
    const pm = new PageManager(page)
    const contactInfo = JSON.parse(fs.readFileSync('contactData.json', 'utf-8'));
    const storedContact = `${contactInfo.firstName} ${contactInfo.lastName}`;
    let salesAgreementData = testData.generateSalesAgreementData()

    await pm.onAccountsPage().createSalesAgreement(storedContact, salesAgreementData.address, salesAgreementData.taxIDType, salesAgreementData.bankAccount, salesAgreementData.companyName, salesAgreementData.dbaNames, salesAgreementData.payableToName, salesAgreementData.taxIDNumber)
  })
  test('TC-111 Verify user can upload tax exepmt document', async ({ page }) => {
    const pm = new PageManager(page)
    const exemptType = 'Dealer'
    const filePath = path.resolve(__dirname, '../../testData/uploadFiles/livingRoomIdeas.png');
    
    await pm.onAccountsPage().uploadTaxExemptDocument(exemptType, filePath)
  })
  test('TC-2759 Verify user can apply Deposit by Wire Transfer to account', async ({page}) => {
    const pm = new PageManager(page)
    let money = testData.generatAccountData()

    await pm.onAccountsPage().acceptDeposit(money.price,'Wire Transfer')
    await pm.onAccountsPage().depositCreated('$50.00 DEPOSIT APPLIED')
  })
})
