import { Page, expect } from '@playwright/test'
import { HelperBase } from './helperBase'

export class PackagesPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async createPackage(){

    }
}