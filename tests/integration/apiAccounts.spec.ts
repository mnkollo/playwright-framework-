import { PageManager } from '../../Page/pageManager'
import { faker } from '@faker-js/faker'
import { test } from '../../test-options'

test.describe('Accounts', () => {
  test.beforeEach('login', async ({ page,login }) => {
    const pm = new PageManager(page)
    await pm.onLoginPage().navigateToAccountsPage()
  })
  test('Verify able to create Business Account with all fields', async ({ page}) => {

  })
})