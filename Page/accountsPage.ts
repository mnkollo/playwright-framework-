import { Page, expect } from '@playwright/test'
import { HelperBase } from './helperBase'
import { faker } from '@faker-js/faker'
import * as path from 'path'; // Import the path module

const fsPromises = require('fs').promises;



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
        await this.verifyBreadcrumbs('AccountsCreate Account')

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
        await this.verifyBreadcrumbs('AccountsAccount')

        //Verify Account Created
        const accountName = await this.page.locator('.d-flex', { hasText: name }).textContent();
        expect(accountName).toContain(name.toUpperCase());

        // Save the contact info to a file
        const contactInfo = { firstName, lastName };
        await fsPromises.writeFile('contactData.json', JSON.stringify(contactInfo));
    }
    async addBankAccount(bankName: string, address: string, city: string, accountHolderName: string) {
        await this.openAccountActionsAndSelectOption(' Add Bank Account')
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
        await this.saveButton()
        await this.page.locator('#bankInformation').click()

        // get the table
        const bankTable = this.page.locator('tbody tr', { hasText: accountHolderName });

        // Validate the number of rows and columns
        const cellValues = await bankTable.locator('td').allTextContents();
        expect(cellValues[7]).toBe(accountHolderName)
    }
    async addNoteToAccount(message: string) {
        await this.openAccountActionsAndSelectOption(' Add Internal Note')

        const addAccountNoteModal = this.page.locator('.modal-content', { hasText: 'Add Account Note' })
        await addAccountNoteModal.locator('[name="text"]').fill(message)
        await this.saveButton()

        const note = await this.page.locator('span p', { hasText: message }).textContent()
        expect(note).toContain(message)
    }
    async searchAccount(accountName: string) {
        await this.page.locator('#simple-search-field').fill(accountName, { timeout: 5000 })
        await this.page.locator('button', { hasText: 'Search' }).click()
        await this.page.locator('[class="a-table"]', { hasText: accountName }).first().click()
    }
    async addCollectionsNoteToAccount(message: string) {
        await this.clickGearIcon()
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
        await this.saveButton()
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
            await this.verifySuccessMessage();
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
        await this.clickGearIcon()

        //Navigate To Location Modal
        try {
            await this.page.locator('a', { hasText: ' Add Location' }).click()
        } catch (error) {
            console.error('Failed to click on upload document link:', error);
            throw error;
        }

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
        const saveIcon = this.page.locator('[class="fa fa-save fa-lg"]');
        await expect(saveIcon).toBeEnabled({ timeout: 5000 });
        await saveIcon.click();

        // Post-save action to refresh the location list
        await this.clickToggleButton()
        await this.page.locator('#locations').click()

        // Verify that the location was created by checking its presence
        const locationCard = this.page.locator('.card-title', { hasText: name });
        await expect(locationCard).toHaveText(name, { timeout: 5000 });
    }
    async uploadDocument() {
        await this.clickToggleButton();
        const uploadDocuments = [path.resolve(__dirname, '../testData/uploadFiles/beigeCouch.png'), path.resolve(__dirname, '../testData/uploadFiles/livingRoomIdeas.png')];
        const types = ['Copy Of Title', 'Contract'];
        const description = [faker.random.words(2), faker.random.words(3)];

        if (uploadDocuments.length !== types.length || types.length !== description.length) {
            throw new Error('Mismatch in the number of upload documents, types, and descriptions');
        }

        for (let i = 0; i < uploadDocuments.length; i++) {
            // Open the gear icon menu on Accounts page
            const gearIcon = await this.page.waitForSelector('[class="fa fa-cogs"]', { timeout: 5000, state: 'visible' });
            await gearIcon.click();

            // Click the upload document tab
            await this.page.locator('a', { hasText: ' Upload Document' }).click();

            // Fill in the document description > Select the document type > Upload the document > Save the document
            await this.page.locator('#description').fill(description[i]);
            await this.page.locator('[name="documentType_ID"]').selectOption(types[i]);
            const browseLink = await this.page.waitForSelector('[class="filepond--label-action"]', { timeout: 10000 });
            await browseLink.setInputFiles(uploadDocuments[i]);
            await this.saveButton();

            // Verify the document was uploaded
            await this.verifyDocumentUpload(types[i], description[i]);
        }
    }
    async deleteDocument(deletedDocs: number) {
        await this.clickToggleButton();

        // Wait for the document accordion and ensure it is visible
        const documentAccordion = await this.page.waitForSelector('#documents', { state: 'visible' });
        await documentAccordion.click();

        // Get all document rows with 'Download' tooltip
        const documentRows = this.page.locator('[data-tip="Download"]');

        // Check if there are at least two items to delete
        const documentCount = await documentRows.count();
        if (documentCount < deletedDocs) {
            throw new Error("Not enough documents to delete.");
        }
        for (let i = 0; i < deletedDocs; i++) {
            const documentRow = documentRows.nth(documentCount - i - 1);  // Get the last or second-to-last row
            await documentRow.waitFor({ state: 'attached' });  // Ensure the row is attached to the DOM
            await documentRow.locator('td').nth(4).click();  // Click the delete button in the correct column

            // Confirm the deletion by clicking the yes button
            await this.yesButton();

            // Verify the success message appears after each deletion
            await this.verifySuccessMessage();
        }
    }
    async createSalesAgreement(storedContact: string, address: string, taxIDType: string, bankAccount: string, companyName: string, dbaNames: string, payableToName: string, taxIDNumber: string) {
        await this.openAccountActionsAndSelectOption(' Create Sales Agreement')

        // Fill the sales agreement form
        await this.fillSalesAgreementForm(storedContact, address, taxIDType, bankAccount, companyName, dbaNames, payableToName, taxIDNumber)

        // Save the form
        const saveIcon = this.page.locator('[class="fa fa-save fa-lg"]');
        try {
            await expect(saveIcon).toBeEnabled({ timeout: 5000 });
            await saveIcon.click();
        } catch (error) {
            console.error("Error clicking Save icon: ", error);
            await this.page.screenshot({ path: 'error_saving_agreement.png' });
        }

        // Verify the success message
        await this.verifySuccessMessage();

        this.clickToggleButton()
        await this.page.locator('ol [class="breadcrumb-item"]').last().click();
        const salesAgreementCreated = await this.page.locator('[class="card-title no-border"]', { hasText: 'Sales Agreement Term' }).textContent();
        expect(salesAgreementCreated?.trim()).toContain('Sales Agreement Term');

        const salesAgreementEditIcon = this.page.locator('[data-tip="View / Create New"]');
        await salesAgreementEditIcon.waitFor({ state: 'visible' });
        await salesAgreementEditIcon.click();

        await this.verifySalesAgreementForm(companyName, dbaNames, payableToName, taxIDNumber)
    }
    async uploadTaxExemptDocument(exemptionType: string, uploadDocuments: string) {
        await this.openAccountActionsAndSelectOption(' Upload Tax Exemption')

        await this.page.locator('[name="type_ID"]').selectOption(exemptionType)

        const browseLink = await this.page.waitForSelector('[class="filepond--label-action"]', { timeout: 10000 });
        try {
            await browseLink.setInputFiles(uploadDocuments);
        } catch (error) {
            console.error("Error uploading document: ", error);
            await this.page.screenshot({ path: 'error_uploading_document.png' });
        }

        await this.saveButton();
        await this.verifySuccessMessage();

        await this.clickToggleButton();
        await this.page.locator('#accountAudits').click();
        try {
            const documentRow = this.page.locator('tbody', { hasText: 'Automation Account' }).first();
            await documentRow.waitFor({ state: 'attached', timeout: 5000 });

            const documentActivity = await documentRow.locator('td').nth(2).textContent();
            expect(documentActivity).toContain('Document Uploaded');
        } catch (error) {
            console.error("Error verifying document activity in the audit trail: ", error);
            await this.page.screenshot({ path: 'error_verifying_audit.png' });
        }

    }
    async acceptDeposit(amount: string, method: string) {
        await this.clickGearIcon();
        
        // Wait for and click on 'Accept Deposit' tab
        const acceptDepositTab = this.page.locator('a', { hasText: 'Accept Deposit' });
        await acceptDepositTab.waitFor({ state: 'visible' });
        await acceptDepositTab.click();
      
        // Enter amount and select deposit method
        await this.page.locator('#amount').fill(amount);
        await this.page.locator('[name="method_ID"]').selectOption(method);
        await this.saveButton();
      
        // Wait for the deposit card to appear
        const depositCard = this.page.locator('.card-body-account', { hasText: 'Deposit Balance' });
        await depositCard.waitFor({ state: 'visible' });
      
        // Get the text content of the deposit balance
        const balanceText = await depositCard.locator('h5.card-name-account').textContent();
      
        // Log the extracted balance
        console.log(balanceText); // This should now print something like "$50.00"
      }
    private async verifyDocumentUpload(type: unknown, description: unknown) {
        const documentAccordion = await this.page.waitForSelector('#documents', { timeout: 10000 });
        await documentAccordion.click();

        const documentRow = this.page.locator('[data-tip="Download"]').last();
        await documentRow.waitFor({ state: 'attached' });

        const documentType = await documentRow.locator('td').nth(0).textContent();
        expect(documentType).toContain(type);

        const documentDescription = await documentRow.locator('td').nth(1).textContent();
        expect(documentDescription).toContain(description);

    }
    private async fillSalesAgreementForm(storedContact: string, address: string, taxIDType: string, bankAccount: string, companyName: string, dbaNames: string, payableToName: string, taxIDNumber: string) {
        await this.page.locator('#sellerContactID').selectOption(storedContact)
        await this.page.locator('#paymentAddressID').selectOption(address)
        await this.page.locator('#taxIDTypeID').selectOption(taxIDType)
        await this.page.locator('#bankAccount_ID').selectOption(bankAccount)
        await this.page.locator('#sellerLegalName').fill(companyName)
        await this.page.locator('#dbaNames').fill(dbaNames)
        await this.page.locator('#payableToName').fill(payableToName)
        await this.page.locator('#taxIDNumber').fill(taxIDNumber)
    }
    // Helper function to fill form fields
    private async fillFormField(labelText: string, value: string) {
        const fieldLocator = this.page.locator('.position-relative', { hasText: labelText })
        const isDropdown = await fieldLocator.evaluate((el) => el.tagName.toLowerCase() === 'select'); // Check if the field is a dropdown
        if (isDropdown) {
            await fieldLocator.locator('.input-xs').selectOption(value);
        } else {
            await fieldLocator.locator('.input-xs').fill(value);
        }
    }
    private async openAccountActionsMenuFromAccountView() {
        // Click on toggle button
        await this.clickToggleButton()
        await this.clickGearIcon()
    }
    private async verifySalesAgreementForm(companyName: string, dbaNames: string, payableToName: string, taxIDNumber: string) {
        // Verify filled values for textboxes
        const filledCompanyName = await this.page.locator('#sellerLegalName').inputValue();
        expect(filledCompanyName).toBe(companyName);
        console.log(filledCompanyName);
        const filledDBANames = await this.page.locator('#dbaNames').inputValue();
        expect(filledDBANames).toBe(dbaNames);

        const filledPayableToName = await this.page.locator('#payableToName').inputValue();
        expect(filledPayableToName).toBe(payableToName);

        const filledTaxIDNumber = await this.page.locator('#taxIDNumber').inputValue();
        expect(filledTaxIDNumber).toBe(taxIDNumber);
    }
    private async openAccountActionsAndSelectOption(optionText: string) {
        await this.openAccountActionsMenuFromAccountView();
        await this.page.locator('a', { hasText: optionText }).waitFor({ state: 'visible' });
        await this.page.locator('a', { hasText: optionText }).click();
    }
} 