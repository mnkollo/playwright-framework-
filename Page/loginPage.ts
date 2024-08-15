import {Page, expect} from '@playwright/test'

export class LoginPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async login(username: string,password: string, profileName: string){
        await this.page.goto('https://backoffice-reg.innovallc.com/login')
        await this.page.getByRole('textbox', {name: 'Username'}).fill(username)
        await this.page.getByRole('textbox', {name: 'Password'}).fill(password)
        await this.page.getByRole('button', {name: 'Login'}).click()
        await this.page.locator('.react-select__value-container').click()
        await this.page.getByText('Automation Account').click()  
        await this.page.getByRole('button', {name: 'Login'}).click()

        // Check if login successful
        expect(await this.page.locator('#header-username').textContent()).toBe(profileName)

        //Check breadcrumb
        const header = await this.page.locator('.breadcrumb').textContent()
        expect(header).toBe('DashboardDashboard Not Configured')
    }   
    async navigateToAccountsPage(){
        await this.page.locator('[href="/crm/accounts"]').click()

    }
    async navigateToPacakagePage(){



        
    }
}
 