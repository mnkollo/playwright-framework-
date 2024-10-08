import {Page,expect} from '@playwright/test'

export class HelperBase {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }
    async clickToggleButton() {
        const toggleButton = await this.page.waitForSelector('[class="fas fa-arrows-alt-h fa-lg"]', { timeout: 5000 });
        if (!(await toggleButton.isVisible())) {
            throw new Error('Toggle button is not visible or not found.');
        }
        await toggleButton.click();
    }
    async saveButton(){
        const saveButton = this.page.locator('button', { hasText: 'Save' });
        await saveButton.click();
    }
    async yesButton(){
        const yesButton = this.page.locator('button', { hasText: 'Yes' });
        await yesButton.click();
    }
    async verifyBreadcrumbs(expectedBreadcrumb: string) {
        const breadcrumbText = await this.page.locator('.breadcrumb').textContent();
        expect(breadcrumbText?.trim()).toBe(expectedBreadcrumb);
    }
    async verifySuccessMessage(message: string = 'Success!') {
        const successMessage = await this.page.getByText(message).textContent({ timeout: 5000 });
        expect(successMessage).toBeTruthy();
    }
    async clickGearIcon(){
        // Wait for the gear icon and click it
        const gearIcon = await this.page.waitForSelector('[class="fa fa-cogs"]', { timeout: 5000 });
        await gearIcon.click();
    }
}