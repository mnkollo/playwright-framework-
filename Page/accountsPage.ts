import {Page, expect} from '@playwright/test'

export class AccountsPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async createAccount(name: string){
        await this.page.locator('[href="/crm/accounts"]').click()
        await this.page.locator('[class="fa fa-plus fa-lg"]').click()
        await this.page.locator('#search_string').fill(name)
        await this.page.locator('.float-right').click()
        await this.page.getByText('Create New Account').click()

        //Check breadcrumb
        expect(await this.page.locator('.breadcrumb').textContent()).toBe('AccountsCreate Account')
        
    }
}
 