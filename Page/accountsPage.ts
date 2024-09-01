import { Page, expect } from '@playwright/test'
import { HelperBase } from './helperBase'

export class AccountsPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async createAccount(name: string, email: string, firstName: string, lastName: string, address: string, city: string, state: string, zip: string) {
        await this.page.click('[class="fa fa-plus fa-lg"]')
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
        await this.page.locator('[type="submit"]', { hasText: 'Save' }).click()
        await this.page.waitForTimeout(1000)

        //Check breadcrumb
        expect(await this.page.locator('.breadcrumb').textContent()).toBe('AccountsAccount')

        //Verify Account Created
        const accountName = await this.page.locator('.d-flex', { hasText: name }).textContent();
        expect(accountName).toContain(name.toUpperCase());
    }
    async addBankAccount(bankName: string, address: string, city: string, accountHolderName: string) {
        await this.clickToggleButton()
        const gearIcon = await this.page.waitForSelector('[class="fa fa-cogs"]', { timeout: 5000 })
        await gearIcon.click()
        await this.page.locator('a', { hasText: ' Add Bank Account' }).click()
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
        await this.page.getByText('Saving').click()
        await this.page.locator('button', { hasText: 'Save' }).click()
        await this.page.locator('#bankInformation').click()

        // get the table
        const bankTable = this.page.locator('tbody tr', { hasText: accountHolderName });

        // Validate the number of rows and columns
        const cellValues = await bankTable.locator('td').allTextContents();
        expect(cellValues[7]).toBe(accountHolderName)
    }
    async addNoteToAccount(message: string) {
        await this.clickToggleButton()
        const gearIcon = await this.page.waitForSelector('[class="fa fa-cogs"]')
        await gearIcon.click()
        await this.page.locator('a', { hasText: ' Add Internal Note' }).click()

        const addAccountNoteModal = this.page.locator('.modal-content', { hasText: 'Add Account Note' })
        await addAccountNoteModal.locator('[name="text"]').fill(message)
        await this.page.locator('button', { hasText: 'Save' }).click()

        const note = await this.page.locator('span p', { hasText: message }).textContent()
        expect(note).toContain(message)
    }
    async searchAccount(accountName: string) {
        await this.page.locator('#simple-search-field').fill(accountName, { timeout: 5000 })
        await this.page.locator('button', { hasText: 'Search' }).click()
        await this.page.locator('[class="a-table"]', { hasText: accountName }).first().click()
    }
    async addCollectionsNoteToAccount(message: string) {
        const gearIcon = await this.page.waitForSelector('[class="fa fa-cogs"]')
        await gearIcon.click()

        // Wait for the 'Add Collections Note' link to be visible and click it
        const addCollectionsNoteLink = this.page.locator('a', { hasText: 'Add Collections Note' });
        await addCollectionsNoteLink.waitFor({ state: 'visible' });
        await addCollectionsNoteLink.click();

        // Add the Collections note
        const addCollectionsModal = this.page.locator('[name="generalNote"]');
        await addCollectionsModal.waitFor({ state: 'visible' });
        await addCollectionsModal.fill(message);
        await this.page.getByRole('button', { name: 'Save' }).click();

        // Verify Collections Note
        const accountInfoDropdown = this.page.locator('[aria-haspopup="true"]').first();
        await accountInfoDropdown.click();
        const collectionNotesButton = this.page.locator('button', { hasText: 'Collection Notes' }).first();
        await collectionNotesButton.waitFor({ state: 'visible' });
        await collectionNotesButton.click();

        const noteElement = this.page.locator('[class="mb-2"]').first();
        await noteElement.waitFor({ state: 'visible' });
        const noteText = await noteElement.textContent();
        expect(noteText?.trim()).toContain(message); // Using trim to avoid issues with unexpected whitespace
    }
    async addAdditionalContact(email: string, firstName: string, lastName: string, title: string, department: string, defaultContact: string, contactType: string) {
        await this.page.locator('[class="fa fa-cogs"]').click();
        const createContactTab = this.page.locator('a', { hasText: ' Create Contact' });
        await createContactTab.waitFor({ state: 'visible' });
        await createContactTab.click();

        // Add Contact: Fill email and verify error messages
        await this.page.locator('#email').fill(email)
        await this.page.locator('button', { hasText: 'Verify' }).click()

        // Assert required error messages
        await expect(this.page.locator('.error-text').first()).toHaveText('is required', { timeout: 5000 });
        await expect(this.page.locator('.error-text').nth(1)).toHaveText('is required', { timeout: 5000 });

        // Fill the Create Contact Form
        const createContactForm = this.page.locator('form', { hasText: 'Create Contact' })
        await createContactForm.locator('#firstName').fill(firstName)
        await createContactForm.locator('#lastName').fill(lastName)
        await createContactForm.locator('#title').fill(title)
        await createContactForm.locator('#department').fill(department)
        await createContactForm.locator('[name="isDefault"]').selectOption(defaultContact)
        await createContactForm.locator('[name="contactType_ID"]').selectOption(contactType)
        await createContactForm.locator('[name="phone1Type_ID"]').last().selectOption('Business')

        // Save the contact and navigate
        await createContactForm.getByRole('button', { name: 'Save' }).click()
        await this.clickToggleButton()

        //Verify Contact Created
        await this.page.locator('#contact').click()
        const contactName = await this.page.locator('[class="no-border card-title"]').first().textContent()
        expect(contactName).toContain(`${firstName} ${lastName}`)
    }
    async makeContactInactive(status: string) {
        await this.clickToggleButton()
        await this.page.locator('#contact').click()
        const contactName = this.page.locator('[class="no-border card-title"]').first()
        await contactName.locator('[data-tip="Edit"]').click()
        //Change Contact Status
        const contactStatus = await this.page.locator('[name="isActive"]').inputValue()
        if (contactStatus === 'true') {
            await this.page.locator('[name="isActive"]').selectOption(status)
        }
        await this.page.locator('button', { hasText: 'Save' }).click()
    }
    async verifyBuyingEnabled(status: string) {
        await this.clickToggleButton()
        await this.page.locator('#contact').click()

        // Wait for contact card and click edit
        const contactCard = this.page.locator('[class="no-border card-title"]').first()
        await contactCard.waitFor({ state: 'visible' });
        await contactCard.locator('[data-tip="Edit"]').click()

        //Verify Buying Enabled
        const buyingEnabledDropdown = this.page.locator('[name="isBuyer"]')
        await buyingEnabledDropdown.waitFor({ state: 'visible' });
        const currentStatus = await buyingEnabledDropdown.inputValue();

        if (currentStatus === 'false') {
            await buyingEnabledDropdown.selectOption({ label: status });
        }

        // Save the changes if the save button is enabled
        const saveButton = this.page.locator('button', { hasText: 'Save' })
        if (await saveButton.isEnabled()) {
            await saveButton.click()
            const successMessage = await this.page.getByText('Success!').textContent()
            expect(successMessage).toBeTruthy()
        } else {
            // If save button is not enabled, handle the scenario by cancelling
            await this.page.locator('button', { hasText: 'Cancel' }).click()
        }

        //Verify Buying Enabled
        const firstContactCard = this.page.locator('.contact-card').first()
        const buyingEnabled = await firstContactCard.locator('.col-md-12').nth(4).textContent()
        expect(buyingEnabled).toContain(status)
    }
    async verifyAbleToCreateLocation(type: string, name: string, address: string, city: string, state: string, zip: string, phone: string) {
        // Click on toggle button
        await this.clickToggleButton()

        // Wait for the gear icon and click it
        const gearIcon = await this.page.waitForSelector('[class="fa fa-cogs"]', { timeout: 5000 });
        await gearIcon.click();

        //Navigate To Location Modal
        await this.page.locator('a', { hasText: ' Add Location' }).click()

        // Fill out the form using helper functions to make the code more readable
        const formFields = [
            { label: 'Location Name:', value: name },
            { label: 'Address:', value: address },
            { label: 'City:', value: city },
            { label: 'State:', value: state },
            { label: 'Zip:', value: zip },
            { label: 'Phone:', value: phone }
        ];
        for (const field of formFields) {
            await this.fillFormField(field.label, field.value);
        }
        // Check if the save button is enabled before clicking
        const saveButton = this.page.locator('[class="fa fa-save fa-lg"]');
        await expect(saveButton).toBeEnabled({ timeout: 5000 });
        await saveButton.click();

        // Post-save action to refresh the location list
        await this.clickToggleButton()
        await this.page.locator('#locations').click()

        // Verify that the location was created by checking its presence
        const locationCard = this.page.locator('.card-title', { hasText: name });
        await expect(locationCard).toHaveText(name, { timeout: 5000 });
    }

    // Helper function to fill form fields
    private async fillFormField(labelText: string, value: string) {
        const fieldLocator = this.page.locator('.position-relative', { hasText: labelText })
        const isDropdown = await fieldLocator.evaluate((el) => el.tagName.toLowerCase() === 'select'); // Check if the field is a dropdown
        if(isDropdown){
            await fieldLocator.locator('.input-xs').selectOption(value);
        } else {
        await fieldLocator.locator('.input-xs').fill(value);
        }
    }
    
} 