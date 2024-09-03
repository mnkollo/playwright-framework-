import {Page} from '@playwright/test'

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
        await this.page.locator('button', { hasText: 'Save' }).click()
    }
}