import {Page, expect} from '@playwright/test'
import { TIMEOUT } from 'dns'

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
    async addBankAccount(bankName: string,address: string,city: string,accountHolderName: string){
        await this.page.locator('[class="fas fa-arrows-alt-h fa-lg"]').click()
        const gearIcon = await this.page.waitForSelector('[class="fa fa-cogs"]')
        await this.page.waitForTimeout(5000)
        await gearIcon.click()
        await this.page.waitForTimeout(5000)
        await this.page.locator('a',{hasText:' Add Bank Account'}).click()
        await this.page.locator('#bankAddress').fill(address)
        await this.page.locator('#bankName').fill(bankName)
        await this.page.locator('#bankCity').fill(city)
        await this.page.locator('[class$="ValueContainer"]').first().click()
        await this.page.getByText('Texas').click()
        await this.page.locator('#bankZipCode').fill('76125')
        await this.page.locator('#bankAccountHolderName').fill(accountHolderName)
        await this.page.locator('#routingNumber').fill('54321')
        await this.page.locator('#accountNumber').fill('t123445')
        await this.page.locator('[class$="ValueContainer"]').last().click()
        await this.page.locator('#react-select-5-option-1',{hasText: 'Saving'}).click()
        await this.page.locator('button',{hasText:'Save'}).click()
        await this.page.locator('#bankInformation').click()

        // get the table
        const bankTable = this.page.locator('tbody tr',{hasText: accountHolderName});

        // Validate the number of rows and columns
        const cellValues = await bankTable.locator('td').allTextContents();
        expect(cellValues[7]).toBe(accountHolderName)
    }
    async addNoteToAccount(){
        await this.page.locator('[class="fas fa-arrows-alt-h fa-lg"]').click()
        const gearIcon = await this.page.waitForSelector('[class="fa fa-cogs"]')
        await this.page.waitForTimeout(5000)
        await gearIcon.click()
        await this.page.waitForTimeout(5000)
        await this.page.locator('a',{hasText:' Add Internal Note'}).click()

        const addAccountNoteModal = this.page.locator('.modal-content',{hasText: 'Add Account Note'})
        await addAccountNoteModal.locator('[name="text"]').fill('Apples!')
        await this.page.locator('button',{hasText:'Save'}).click()

        const note = await this.page.locator('span p',{hasText:'Apples!'}).textContent()
        expect(note).toContain('Apples!')
    }
    async searchAccount(accountName: string){
        await this.page.locator('#simple-search-field').fill(accountName)
        await this.page.waitForTimeout(5000)
        await this.page.locator('button',{hasText: 'Search'}).click()
        await this.page.waitForTimeout(5000)
        await this.page.locator('[class="a-table"]',{hasText: accountName}).first().click()
    }
}
 