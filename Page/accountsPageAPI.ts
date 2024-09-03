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
            "module_ID": 5,
            "account_ID": accountID,
            "invoice_ID": 0,
            "text": "testing add collections notes test"
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
    async addAdditionalContact(request: APIRequestContext, accessToken: string, accountID: number, setContactID?: (id: number) => void) {
        const payload = {
            "account_ID": accountID.toString(),
            "contactType_ID": 0,
            "isDefault": false,
            "noCall": false,
            "noEmail": false, "noMail": false,
            "noMarketing": false,
            "phone1Type_ID": 2,
            "phone2Type_ID": 1,
            "phone3Type_ID": 4,
            "driverLicenseCountry_ID": 0,
            "email": `${faker.name.jobDescriptor()}${faker.random.numeric(2)}@mailinator.com`,
            "firstName": `${faker.name.firstName()}`,
            "lastName": `${faker.name.lastName()}`,
            "driverLicenseNumber": `${faker.random.alphaNumeric(10)}`,
            "driverLicenseExpireDate": `${new Date().toISOString().split('T')[0]}`,
            "driverLicenseState": "TX",
            "driversLicenseCountry_ID": 0
        };
        try {
            const response = await request.post(`https://innova-app-api-regression.azurewebsites.net/api/v1/account/addcontact`, {
                data: payload,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            expect(response.status()).toEqual(200);
            const responseBody = await response.json();

            // Find the correct contact in the response array
            const contact = responseBody.find((item: any) =>
                item.firstName === payload.firstName &&
                item.lastName === payload.lastName &&
                item.email === payload.email
            );
            if (contact) {
                expect(contact).toHaveProperty('firstName', payload.firstName);
                expect(contact).toHaveProperty('lastName', payload.lastName);
                expect(contact).toHaveProperty('account_ID', accountID);
                expect(contact).toHaveProperty('email', payload.email);

                console.log(`Contact ID: ${contact.id}`);

                if (setContactID) {
                    setContactID(contact.id);
                }             // Store the contactID in the shared context
            } else {
                throw new Error('Contact not found in response');
            }

        } catch (error) {
            console.error('Error creating contact:', error);
            throw error;
        }
    }
    async makeContactInactive(request: APIRequestContext, accessToken: string, accountID: number, contactID: number, isActive: boolean) {
        const payload = {
            "id": contactID,
            "account_ID": accountID,
            "accountName": null,
            "accountWebsite": null,
            "firstName": `${faker.name.firstName()}`,
            "lastName": `${faker.name.lastName()}`,
            "name": `${faker.name.firstName()} ${faker.name.lastName()}`,
            "title": "",
            "department": "",
            "contactType_ID": 9,
            "contactType": "Decision Maker",
            "phone1": "",
            "phone1Type": "",
            "phone1Country_ID": 0,
            "phone1Type_ID": 0,
            "phone2": "",
            "phone2Type": "",
            "phone2Country_ID": 0,
            "phone2Type_ID": 0,
            "phone3": "",
            "phone3Type": "",
            "phone3Type_ID": 0,
            "phone3Country_ID": 0,
            "email": `${faker.name.jobDescriptor()}${faker.random.numeric(2)}@mailinator.com`,
            "isDefault": false,
            "noMarketing": false,
            "noCall": false,
            "noMail": false,
            "noEmail": false,
            "createdDateTime": null,
            "modifiedDateTime": null,
            "isActive": isActive,
            "isExternal": false,
            "isBuyer": false,
            "isBuyerBypassed": false,
            "isBidder": false,
            "buyingPower": "DISABLED",
            "buyingLimit": "DISABLED",
            "isCreditCardVerified": false,
            "isPhoneVerified": false,
            "verifiedPhone": "",
            "permanentBidderNumber": null,
            "driverLicenseNumber": "",
            "driverLicenseState": "",
            "driverLicenseExpireDate": null,
            "driverLicenseCountry_ID": 0,
            "verifiedAddress": null,
            "eventRegistrations": [],
            "hasUserRecord": false,
            "isVIP": false,
            "inviteSent": false,
            "inviteDateTime": "",
            "inviteComplete": false,
            "inviteCompleteDateTime": "",
            "isHouseBuyer": false,
            "status_ID": 1,
            "driversLicenseCountry_ID": 0,
            "contact_ID": contactID
        };
        try {
            const response = await request.put(`https://innova-app-api-regression.azurewebsites.net/api/v1/account/UpdateContact`, {
                data: payload,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            expect(response.status()).toEqual(200);
            const responseBody = await response.json();
            // Find the correct contact in the response array
            const contact = responseBody.find((item: any) =>
                item.firstName === payload.firstName &&
                item.lastName === payload.lastName &&
                item.email === payload.email
            );
            if (contact) {
                expect(contact).toHaveProperty('firstName', payload.firstName);
                expect(contact).toHaveProperty('lastName', payload.lastName);
                expect(contact).toHaveProperty('account_ID', accountID);
                expect(contact).toHaveProperty('email', payload.email);
                expect(contact).toHaveProperty('isActive', isActive);
            }
        }
        catch (error) {
            console.error('Error making contact inactive:', error);
            throw error;
        }
    }
    async enableBuContactCard(request: APIRequestContext, accessToken: string, accountID: number, contactID: number, isActive: boolean,isBuyer: boolean) {
        const payload = {
            "id": contactID,
            "account_ID": accountID,
            "accountName": null,
            "accountWebsite": null,
            "firstName": `${faker.name.firstName()}`,
            "lastName": `${faker.name.lastName()}`,
            "name": `${faker.name.firstName()} ${faker.name.lastName()}`,
            "title": "",
            "department": "",
            "contactType_ID": 9,
            "contactType": "Decision Maker",
            "phone1": "",
            "phone1Type": "",
            "phone1Country_ID": 0,
            "phone1Type_ID": 0,
            "phone2": "",
            "phone2Type": "",
            "phone2Country_ID": 0,
            "phone2Type_ID": 0,
            "phone3": "",
            "phone3Type": "",
            "phone3Type_ID": 0,
            "phone3Country_ID": 0,
            "email": `${faker.name.jobDescriptor()}${faker.random.numeric(2)}@mailinator.com`,
            "isDefault": false,
            "noMarketing": false,
            "noCall": false,
            "noMail": false,
            "noEmail": false,
            "createdDateTime": null,
            "modifiedDateTime": null,
            "isActive": isActive,
            "isExternal": false,
            "isBuyer": isBuyer,
            "isBuyerBypassed": false,
            "isBidder": false,
            "buyingPower": "DISABLED",
            "buyingLimit": "DISABLED",
            "isCreditCardVerified": false,
            "isPhoneVerified": false,
            "verifiedPhone": "",
            "permanentBidderNumber": null,
            "driverLicenseNumber": "",
            "driverLicenseState": "",
            "driverLicenseExpireDate": null,
            "driverLicenseCountry_ID": 0,
            "verifiedAddress": null,
            "eventRegistrations": [],
            "hasUserRecord": false,
            "isVIP": false,
            "inviteSent": false,
            "inviteDateTime": "",
            "inviteComplete": false,
            "inviteCompleteDateTime": "",
            "isHouseBuyer": false,
            "status_ID": 1,
            "driversLicenseCountry_ID": 0,
            "contact_ID": contactID
        };
        try{
            const response = await request.put(`https://innova-app-api-regression.azurewebsites.net/api/v1/account/UpdateContact`, {
                data: payload,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            expect(response.status()).toEqual(200);
            const responseBody = await response.json();
            // Find the correct contact in the response array
            const contact = responseBody.find((item: any) =>
                item.firstName === payload.firstName &&
                item.lastName === payload.lastName &&
                item.email === payload.email
            );
            if (contact) {
                expect(contact).toHaveProperty('firstName', payload.firstName);
                expect(contact).toHaveProperty('lastName', payload.lastName);
                expect(contact).toHaveProperty('account_ID', accountID);
                expect(contact).toHaveProperty('email', payload.email);
                expect(contact).toHaveProperty('isBuyer', isBuyer);
            }
        }
        catch (error) {
            console.error('Error making contact inactive:', error);
            throw error;
        }
    }
    async addLocationToAccount(request: APIRequestContext, accessToken: string, accountID: number, contactID: number, setLocationID?: (id: number) => void) {
        const payload = {
            isJumpStartAvailable: false,
            isLoadingDockAvailable: false,
            isForkLiftAvailable: false,
            isNoticeRequiredToView: false,
            isLoadOutAssistanceAvailable: false,
            hasSiteRestrictions: false,
            hasSpecialInstructions: false,
            type_ID: 0,
            isActive: true,
            country: "",
            addressLine1: `${faker.address.streetAddress()}`,
            city: "San Antonio",
            countyName: "Bexar",
            state: "TX",
            postalCode: "78245",
            phone: `${faker.phone.number()}`,
            locationName: `${faker.company.name()} location`,
            notes: `${faker.random.words(5)} testing notes`,
            contact_ID: contactID.toString(),
            country_ID: 0,
            account_ID: accountID.toString(),
            hoursOfOperation: [
                {
                    dayOfWeek_ID: 0,
                    hourType_ID: 1,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 1,
                    hourType_ID: 1,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 2,
                    hourType_ID: 1,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 3,
                    hourType_ID: 1,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 4,
                    hourType_ID: 1,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 5,
                    hourType_ID: 1,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 6,
                    hourType_ID: 1,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                }
            ],
            previewStarts: null,
            previewHours: [
                {
                    dayOfWeek_ID: 0,
                    hourType_ID: 2,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 1,
                    hourType_ID: 2,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 2,
                    hourType_ID: 2,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 3,
                    hourType_ID: 2,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 4,
                    hourType_ID: 2,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 5,
                    hourType_ID: 2,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                },
                {
                    dayOfWeek_ID: 6,
                    hourType_ID: 2,
                    fromHour: "9",
                    fromMinute: "0",
                    fromMeridiem: "0",
                    hasHours: false,
                    toHour: "3",
                    toMinute: "0",
                    toMeridiem: "1",
                    hourAvailabilityType_ID: 0
                }
            ]
        };
        try {
            const response = await request.post(`https://innova-app-api-regression.azurewebsites.net/api/v1/account/createLocation`, {
                data: payload,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            expect(response.status()).toEqual(200);
            const responseBody = await response.json();
            expect(responseBody).toHaveProperty('location_ID');
            expect(responseBody).toHaveProperty('locationName', payload.locationName);
            expect(responseBody).toHaveProperty('addressLine1', payload.addressLine1);
            expect(responseBody).toHaveProperty('addressLine3', 'United States');


            console.log(`Location ID: ${responseBody.location_ID}`);

                if (setLocationID) {
                    setLocationID(responseBody.location_ID);
                }             // Store the contactID in the shared context
        }
        catch (error) {
            console.error('Error creating location:', error);
            throw error;
        }
    }
}
