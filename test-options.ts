import { test as base } from '@playwright/test'
import { PageManager } from './Page/pageManager'

export type TestOptions = {
  auctionSite: string;
  login: string;
  loginAPI: string;
  accountID?: number;  // Add accountID to the TestOptions type
  contactID?: number;  // Add contactID to the TestOptions type
  setContactID?: (id: number) => void;  // Add setContactID to the TestOptions type
  setAccountID?: (id: number) => void;  // Add setAccountID to the TestOptions type
}

let accountID = 0;
let contactID = 0;
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

  loginAPI: async ({ request }, use) => {
    const response = await request.post('https://innova-app-api-regression.azurewebsites.net/api/Token/v2', {
      data: {
        "grant_Type": "password",
        "user_Name": process.env.USERNAME,
        "password": process.env.PASSWORD,
        "impersonate_ID": "5F026EFC-C31F-4AA6-8EA2-A3A902AC4B33",
        "route_ID": 1
      }
    });
    const responseBody = await response.json()
    const accessToken = responseBody.token

    await use(accessToken); // Pass accessToken to test context
  },
  accountID: async ({}, use) => {
    await use(accountID);
  },
  setAccountID: async ({}, use) => {   // This fixture sets the accountID
    await use((id) => {
      accountID = id;
    });
  },


  contactID: async ({}, use) => {
    await use(contactID);
  },
  setContactID: async ({}, use) => {   // This fixture sets the accountID
    await use((id) => {
      contactID = id;
    });
  },
});

