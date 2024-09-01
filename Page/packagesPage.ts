import { Page, expect } from '@playwright/test'

export class PackagesPage {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async createPackage(){

    }
}