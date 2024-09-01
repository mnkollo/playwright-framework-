import {Page, expect} from '@playwright/test'
import { AccountsPage } from './accountsPage'
import { LoginPage } from '../Page/loginPage'
import { PackagesPage } from './packagesPage'

export class PageManager{

    private readonly page: Page
    private readonly accountsPage: AccountsPage
    private readonly loginPage: LoginPage
    private readonly packagePage: PackagesPage


    constructor(page: Page) {
        this.page = page
        this.accountsPage = new AccountsPage(this.page)
        this.loginPage = new LoginPage(this.page)
        this.packagePage = new PackagesPage(this.page)
    }
    onAccountsPage(){
        return this.accountsPage
    }
    onHomePage(){
        return this.loginPage
    }
    onLoginPage(){
        return this.loginPage
    }
    onPackagePage(){
        return this.packagePage
    }
}