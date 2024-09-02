import { PageManager } from '../../Page/pageManager'
import { faker } from '@faker-js/faker'
import { test } from '../../test-options'
import { expect } from 'playwright/test'

let accessToken = '';
test.describe('login', () => {
  test.beforeEach('login', async ({ page, request }) => {
    const response = await request.post('https://innova-app-api-regression.azurewebsites.net/api/Token/v2', {
      data: { "grant_Type": "password", "user_Name": "michael.su", "password": "Taylor!24680", "impersonate_ID": "5F026EFC-C31F-4AA6-8EA2-A3A902AC4B33", "route_ID": 1 }

    })
    const responseBody = await response.json()
    accessToken = responseBody.token
  })
  test('Verify able to create Business Account with all fields', async ({ page, request }) => {

     const response = await request.post('https://innova-app-api-regression.azurewebsites.net/api/v1/Account/Create', {
      data: {
        "hasBeenVerified": true,
        "type": "Prospect",
        "contactFirstName": `${faker.name.firstName()}`,
        "contactLastName": `${faker.name.lastName()}`,
        "contactEmail": `${faker.name.jobDescriptor}${faker.random.numeric(4)}@mailinator.com`,
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
        "taxExemptExpireDate": "2024-09-02T01:52:08.151Z",
        "isLienholder": false,
        "isNationalAccount": false,
        "hasAnnualContract": false,
        "billingSameAsPhysical": true
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
     })
     expect(response.status()).toEqual(200)

     const responseBody = await response.json()
     const accountID = responseBody.account_ID
     console.log(`Account ID: ${accountID}`)
      // Store the accountID in the shared context
     test.info().annotations.push({ type: 'accountID', description: accountID });
  })
})
