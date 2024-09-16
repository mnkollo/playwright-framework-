import { faker } from '@faker-js/faker';

// A reusable function that generates test data for accounts
export const generateAccountData = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `${faker.name.firstName()}${faker.name.lastName()}${faker.random.numeric(5)}@test.com`,
    address: '4700 Argonne Dr',
    city: 'SAN ANTONIO',
    state: 'TX',
    zip: '78205',
    accountName: `${faker.company.name()} Test Account`
  };
};
export const generateContactData = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    title: faker.name.jobTitle(),
    email: `${faker.name.jobDescriptor()}${faker.random.numeric(5)}@mailinator.com`,
    department: faker.name.jobArea(),
    defaultContact: 'Yes',
    contactType: 'Decision Maker',
    address: '4700 Argonne Dr',
    city: 'SAN ANTONIO',
    state: 'TX',
    zip: '78205',
  };
};
export const generateLocationData = () => {
  return {
    locationType : 'Temporary',
    locationName: faker.company.name() + ' Location',
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    zip: faker.address.zipCode(),
    phone: faker.phone.number()
  };
};
export const generateSalesAgreementData = () => {
  return {
    address : 'Physical - 4700 Argonne Dr',
    taxIDType: 'Dealer',
    bankAccount: 'Pay By Check',
    companyName: `${faker.random.words()} Test Company`,
    dbaNames: 'Test Company',
    payableToName: `${faker.name.fullName()}`,
    taxIDNumber: `${faker.random.numeric(9)}`
  };
};
export const generateBankAccountData = () => {
  return {
    bankName: 'Chase',
    address: '55500 Ocean Dr',
    city: 'Fort Worth',
    accountHolderName: faker.name.firstName(),
    accountNumber: faker.random.numeric(10),
    routingNumber: faker.random.numeric(9),
  };
};
