import { test as base } from '@playwright/test'
import { PageManager } from './Page/pageManager'

export type TestOptions = {
  auctionSite: string;
  login: string;
  accountID?: number;  // Add accountID to the TestOptions type
  setAccountID?: (id: number) => void;  // Add setAccountID to the TestOptions type
}

let accountID = 0;

export const test = base.extend<TestOptions>({
  auctionSite: ['', { option: true }],  // Define the option

  login: async ({ page }, use) => {
    const pm = new PageManager(page)
    const url = process.env.URL || ''; // Provide a default value if process.env.URL is undefined
    const username = process.env.USERNAME || '';
    const password = process.env.PASSWORD || '';
    const user = process.env.USER1 || '';

    await pm.onLoginPage().login(url, username, password, user)
    await use('')
  },

  accountID: async ({ }, use) => {
    await use(accountID);
  },
  setAccountID: async ({ }, use) => {   // This fixture sets the accountID
    await use((id) => {
      accountID = id;
    });
  },
});

