import { PageManager } from '../../Page/pageManager'
import { test } from '../../test-options'


test.describe('Actions With Account', () => {
  test.beforeEach('login', async ({loginAPI}) => {
    
    console.log(`Using access token: ${loginAPI}`);
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
})