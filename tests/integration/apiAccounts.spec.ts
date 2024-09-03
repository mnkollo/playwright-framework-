import { PageManager } from '../../Page/pageManager'
import { test } from '../../test-options'


test.describe('Actions With Account', () => {
  test.beforeEach('login', async ({loginAPI}) => {
  })
  test('Verify able to create Business Account with all fields', async ({ page, request,loginAPI, setAccountID }) => {
    const pm = new PageManager(page)
    await pm.onAccountsPageAPI().createAccount(request, loginAPI, setAccountID)
  })
  test('Add Bank Account', async ({ page, request,loginAPI, accountID }) => {
    const pm = new PageManager(page)

    if (!accountID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    await pm.onAccountsPageAPI().addBankAccount(request, loginAPI, accountID)
  })
  test('TC-3430 Verify user can Add Note on account page', async ({ page, request,loginAPI, accountID}) => {
    const pm = new PageManager(page)
    
    if (!accountID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    await pm.onAccountsPageAPI().addNoteToAccount(request, loginAPI, accountID)
  })
  test('TC-3476 Verify Able to Add Collections Note on account page', async ({ page, request,loginAPI, accountID})=> {
    const pm = new PageManager(page) // Create an instance of PageManager
    
    if (!accountID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    await pm.onAccountsPageAPI().addCollectionsNoteToAccount(request, loginAPI, accountID, 'Automation Account')
  })
  test('TC-1058 Verify user can Add Additional Contact', async ({ page,request,loginAPI,accountID,setContactID}) => {
    const pm = new PageManager(page)

    if (!accountID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    await pm.onAccountsPageAPI().addAdditionalContact(request, loginAPI, accountID, setContactID)
  })
  test('TC-12077  Back Office - Verify user is able to make a contact inactive', async ({ page,request,loginAPI,accountID,contactID }) => {
    const pm = new PageManager(page)
    const isActive = false;
    if (!accountID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    if (!contactID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    await pm.onAccountsPageAPI().makeContactInactive(request,loginAPI,accountID,contactID,isActive)
  })
  test('TC-9254 Verify Contact Card on Accounts page shows Buying Enabled when set up in the Back Office', async ({ page,request,loginAPI,accountID,contactID}) => {
    const pm = new PageManager(page)
    const isBuyer = true;
    if (!accountID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    if (!contactID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    await pm.onAccountsPageAPI().enableBuContactCard(request,loginAPI,accountID,contactID, true, isBuyer)
  })
})