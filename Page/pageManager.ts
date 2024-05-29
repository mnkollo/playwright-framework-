import {Page, expect} from '@playwright/test'
import { AccountsPage } from './accountsPage'
import { TIMEOUT } from 'dns'

export class PageManager{

    private readonly page: Page
    private readonly accountsPage: AccountsPage
    constructor(page: Page) {
        this.page = page
        this.accountsPage = new AccountsPage(this.page)
    }
    navigateTo(){
        return this.accountsPage
    }
    onAccountsPage(){
        return this.accountsPage
    }
}