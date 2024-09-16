import {Page, expect} from '@playwright/test'
import { HelperBase } from './helperBase'

export class LoginPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async login(url: string, username: string, password: string, test: string) {
        await this.page.goto(url)
        await this.page.getByRole('textbox', {name: 'Username'}).fill(username)
        await this.page.getByRole('textbox', {name: 'Password'}).fill(password)
        await this.page.getByRole('button', {name: 'Login'}).click()
        await this.page.locator('.react-select__value-container').click()
        await this.page.getByText('Automation Account').click()  
        await this.page.getByRole('button', {name: 'Login'}).click()

        // Check if login successful
        expect(await this.page.locator('#header-username').textContent()).toContain(test)

        //Check breadcrumb
        const header = await this.page.locator('.breadcrumb').textContent()
        expect(header).toBe('DashboardDashboard Not Configured')
    }   
    async navigateToPacakagePage(){
 
    }
    async loginGetToken(){
        
    }
}
 