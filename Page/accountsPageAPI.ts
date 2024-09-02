import { APIRequestContext, expect } from '@playwright/test'
import { HelperBase } from "./helperBase";
import { faker } from '@faker-js/faker'



export class AccountsPageAPI extends HelperBase {

    async createAccount(request: APIRequestContext, accessToken: string, setAccountID?: (id: number) => void) {
        const payload = {
            "hasBeenVerified": true,
            "type": "Prospect",
            "contactFirstName": faker.name.firstName(),
            "contactLastName": faker.name.lastName(),
            "contactEmail": `${faker.name.jobDescriptor()}${faker.random.numeric(4)}@mailinator.com`,
            "contactType_ID": 0,
            "contactMobilPhone": "",
            "contactMobilePhoneCountry_ID": 0,
            "contactWorkPhone": "",
            "contactWorkPhoneCountry_ID": 0,
            "contactHomePhone": "",
            "contactHomePhoneCountry_ID": 0,
            "accountName": `${faker.company.name()} api account`,
            "owner_ID": "5F026EFC-C31F-4AA6-8EA2-A3A902AC4B33",
            "email": "",
            "accountDBA": "",
            "phone": "",
            "phoneCountry_ID": 0,
            "fax": "",
            "faxCountry_ID": 0,
            "country_ID": 0,
            "physicalPostalCode": "78239",
            "physicalLine1": "3 Adkins Rdg",
            "physicalLine2": "",
            "physicalCity": "San Antonio",
            "physicalState": "TX",
            "billingLine2": "",
            "isTaxExempt": false,
            "taxExemptExpireDate": new Date().toISOString(),
            "isLienholder": false,
            "isNationalAccount": false,
            "hasAnnualContract": false,
            "billingSameAsPhysical": true
        };

        try {
            const response = await request.post('https://innova-app-api-regression.azurewebsites.net/api/v1/Account/Create', {
                data: payload,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            expect(response.status()).toEqual(200);

            const responseBody = await response.json();
            const accountID = responseBody.account_ID;
            console.log(`Account ID: ${accountID}`);

            if (setAccountID) { setAccountID(accountID); }              // Store the accountID in the shared context
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }
    async addBankAccount(request: APIRequestContext, accessToken: string, accountID: number) {
        const payload = {
            "id": 0,
            "name": "Chase",
            "address": "2334 test dr",
            "city": "Plano",
            "state": "TX",
            "zip": "75024",
            "country_ID": 0,
            "account_ID": accountID,
            "holderName": faker.name.firstName(),
            "bankAccountType_ID": 1,
            "routingNumber": faker.random.numeric(9),
            "accountNumber": faker.random.numeric(10),
            "specialInstructions": "",
            "startDate": new Date().toISOString().split('T')[0], // Dynamic start date,
            "stopDate": new Date().toISOString().split('T')[0]   // Dynamic stop date
        };
        try {
            const response = await request.post('https://innova-app-api-regression.azurewebsites.net/api/v1/account/CreateBankAccount', {
                data: payload,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            expect(response.status()).toEqual(200);

            const responseBody = await response.json();
            expect(Array.isArray(responseBody)).toBe(true);             // Check that the response body is an array and contains the expected object
            expect(responseBody[0]).toHaveProperty('zip', '75024');
            expect(responseBody[0]).toHaveProperty('city', 'Plano');
            expect(responseBody[0]).toHaveProperty('name', 'Chase');
            expect(responseBody[0]).toHaveProperty('routingNumber', payload.routingNumber);
            expect(responseBody[0]).toHaveProperty('accountNumber', payload.accountNumber);
        }
        catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }
    async addNoteToAccount(request: APIRequestContext, accessToken: string, accountID: number) {
        const payload = {
            "module_ID": 2,
            "entity_ID": accountID.toString(),
            "text": `${faker.random.words(5)} testing note`
        };
        try {
            const response = await request.post('https://innova-app-api-regression.azurewebsites.net/api/v1/system/createnote', {
                data: payload,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            expect(response.status()).toEqual(200);
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('text', payload.text);
        }
        catch (error) {
                console.error('Error creating note:', error);
                throw error;
            }
        }
        async addCollectionsNoteToAccount(request: APIRequestContext, accessToken: string, accountID: number, userName: string) {
            const payload = {
                "module_ID":5,
                "account_ID":accountID,
                "invoice_ID":0,
                "text":"testing add collections notes test"
            };
            try {
                const response = await request.post(`https://innova-app-api-regression.azurewebsites.net/api/v1/System/CreateGeneralNote`, {
                    data: payload,
                    headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                    }
                });
                expect(response.status()).toEqual(200);
                const responseBody = await response.json();
                expect(responseBody).toHaveProperty('text', payload.text);
                expect(responseBody).toHaveProperty('userName', userName);  
                const createdDateTime = responseBody.createdDateTime;
                const datePart = createdDateTime.split('T')[0];
                expect(datePart).toEqual(new Date().toISOString().split('T')[0]);
            }
            catch (error) {
                console.error('Error creating note:', error);
                throw error;
            }
        }
    }
