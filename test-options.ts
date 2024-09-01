import { test as base} from '@playwright/test'
import { PageManager } from './Page/pageManager'

export type TestOptions = {
    auctionSite: string;
    login: string;
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
    }
});

