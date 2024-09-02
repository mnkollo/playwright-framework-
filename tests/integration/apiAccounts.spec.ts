import { PageManager } from '../../Page/pageManager'
import { test } from '../../test-options'

let accessToken = '';

test.describe('Actions With Account', () => {
  test.beforeEach('login', async ({ page, request }) => {
    const response = await request.post('https://innova-app-api-regression.azurewebsites.net/api/Token/v2', {
      data: { "grant_Type": "password", "user_Name": "michael.su", "password": "Taylor!24680", "impersonate_ID": "5F026EFC-C31F-4AA6-8EA2-A3A902AC4B33", "route_ID": 1 }

    })
    const responseBody = await response.json()
    accessToken = responseBody.token
  })
  test('Verify able to create Business Account with all fields', async ({ page, request, setAccountID }) => {
    const pm = new PageManager(page)

    await pm.onAccountsPageAPI().createAccount(request, accessToken, setAccountID)
  })

  test('Add Bank Account', async ({ page, request, accountID }) => {
    const pm = new PageManager(page)

    if (!accountID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    await pm.onAccountsPageAPI().addBankAccount(request, accessToken, accountID)
  })
  test('TC-3430 Verify user can Add Note on account page', async ({ page, request, accountID}) => {
    const pm = new PageManager(page)
    
    if (!accountID) {
      throw new Error("accountID is undefined. Please ensure the account is created first.");
    }
    await pm.onAccountsPageAPI().addNoteToAccount(request, accessToken, accountID)
  })
})