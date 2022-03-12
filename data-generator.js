const fs = require('fs');
const faker = require('faker');

const generateEntry = (id) => {
  const DDD = {
    AC: ['68'],
    AL: ['82'],
    AM: ['92', '97'],
    AP: ['96'],
    BA: ['71', '73', '74', '75', '77'],
    CE: ['85', '88'],
    DF: ['61'],
    ES: ['27', '28'],
    GO: ['62', '64'],
    MA: ['98', '99'],
    MG: ['31', '32', '33', '34', '35', '37', '38'],
    MS: ['67'],
    MT: ['65', '66'],
    PA: ['91', '93', '94'],
    PB: ['83'],
    PE: ['81', '87'],
    PI: ['86', '89'],
    PR: ['41', '42', '43', '44', '45', '46'],
    RJ: ['21', '22', '24'],
    RN: ['84'],
    RO: ['69'],
    RR: ['95'],
    RS: ['51', '53', '54', '55'],
    SC: ['47', '48', '49'],
    SE: ['79'],
    SP: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
    TO: ['63'],
  };

  const getPhone = (state) => {
    const ddd = faker.random.arrayElement(DDD[state]);
    const phone = faker.phone.phoneNumber('####-####');
    return `(0${ddd}) 9 ${phone}`;
  };

  const state = faker.random.arrayElement(Object.keys(DDD));

  const day = faker.datatype.number({ min: 1, max: 28 });
  const month = faker.datatype.number({ min: 1, max: 12 });
  const year = faker.datatype.number({ min: 1921, max: new Date().getFullYear() - 18 });

  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const domainName = faker.internet.email().split('@')[1];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName}.${lastName}@${domainName}`.toLowerCase();
  const phone = getPhone(state);
  const dob = new Date(year, month - 1, day, 0, 0, 0, 0);
  const avatar = faker.image.avatar();
  const addressLineOne = `Rua ${faker.name.firstName()} ${faker.name.lastName()}, ${faker.datatype.number({
    min: 1,
    max: 8000,
  })}`;
  const addressLineTwo = faker.address.city();
  const addressCity = faker.address.city();
  const addressState = state;
  const addressZipCode = faker.phone.phoneNumber('#####-###');
  const addressGeoLat = faker.address.latitude();
  const addressGeoLng = faker.address.longitude();

  return {
    id,
    name,
    email,
    phone,
    dob,
    avatar,
    address: {
      lineOne: addressLineOne,
      lineTwo: addressLineTwo,
      city: addressCity,
      state: addressState,
      zipcode: addressZipCode,
      geo: {
        lat: addressGeoLat,
        lng: addressGeoLng,
      },
    },
  };
};

const result = new Array(100);
for (let i = 0; i < result.length; i++) {
  result[i] = generateEntry(i + 1);
}

fs.writeFileSync('src/data/users.json', JSON.stringify(result, null, 2), 'utf-8');
