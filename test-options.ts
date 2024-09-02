import { test as base} from '@playwright/test'
import { PageManager } from './Page/pageManager'

export type TestOptions = {
    auctionSite: string;
    login: string;
    accountID?: string;  // Add accountID to the TestOptions type
}

export const test = base.extend<TestOptions> ({
    auctionSite: ['', {option: true}],  // Define the option
    
    login: async({page}, use) => {
    const pm = new PageManager(page)
    const url = process.env.URL || ''; // Provide a default value if process.env.URL is undefined
    const username = process.env.USERNAME || ''; 
    const password = process.env.PASSWORD || ''; 
    const user = process.env.USER1 || ''; 

    await pm.onLoginPage().login(url,username,password,user)
    await use('')
    },

    accountID: async ({}, use, testInfo) => {
        // Retrieve accountID from the test annotations
        const accountIDAnnotation = testInfo.annotations.find(a => a.type === 'accountID');
        const accountID = accountIDAnnotation ? accountIDAnnotation.description : null;

        if (accountID) {
            console.log(`Retrieved accountID from spec: ${accountID}`);
            await use(accountID);
        } else {
            // If no accountID is found, handle the scenario
            await use('');
        }
    }
});

