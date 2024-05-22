import {Page, expect} from '@playwright/test'

export class AccountsPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async createAccount(name: string,email: string,firstName: string,lastName: string,address: string,city: string,state: string,zip: string){
        await this.page.locator('[class="fa fa-plus fa-lg"]').click()
        await this.page.locator('#search_string').fill(name)
        await this.page.locator('.float-right').click()
        await this.page.getByText('Create New Account').click()

        //Check breadcrumb
        expect(await this.page.locator('.breadcrumb').textContent()).toBe('AccountsCreate Account')

        //Enter Data In Create Account Form
        await this.page.locator('#contactEmail').fill(email)
        await this.page.locator('[class="btn-sm btn btn-danger"]').click()
        await this.page.locator('#contactFirstName').fill(firstName)
        await this.page.locator('#contactLastName').fill(lastName)
        await this.page.locator('#physicalLine1').fill(address)
        await this.page.getByText('4700 Argonne Dr, San Antonio, TX 78220').click()
        await this.page.locator('[type="submit"]',{hasText: 'Save'}).click()
        await this.page.waitForTimeout(10000)


        //Check breadcrumb
        expect(await this.page.locator('.breadcrumb').textContent()).toBe('AccountsAccount')  

        //Verify Account Created
        const accountName = await this.page.locator('.d-flex', { hasText: name }).textContent();
        expect(accountName).toContain(name.toUpperCase());
    }
    async addBankAccount(){
        await this.page.locator('[class="a-table"]').first().click()
        await this.page.locator('[class="fas fa-arrows-alt-h fa-lg"]').click()
        await this.page.locator('[class="fa fa-cogs"]').click()
    }
    async searchAccount(accountName: string){
        await this.page.locator('#simple-search-field').fill(accountName)
        await this.page.locator('[class="btn-xs btn btn-primary"]').click()
    }
}
 