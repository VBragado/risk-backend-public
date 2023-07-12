'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Regions', [
    {
      name: 'NorthAmerica',
      resource: 'oil',
      resourceamount: 8,
    },
    {
      name: 'CentralAmerica',
      resource: 'wheat',
      resourceamount: 6,
    },
    {
      name: 'SouthAmerica',
      resource: 'iron',
      resourceamount: 8,
    },
    {
      name: 'Russia',
      resource: 'oil',
      resourceamount: 7,
    },
    {
      name: 'Africa',
      resource: 'iron',
      resourceamount: 7,
    },
    {
      name: 'Europe',
      resource: 'wheat',
      resourceamount: 8,
    },
    {
      name: 'Asia',
      resource: 'iron',
      resourceamount: 7,
    },
    {
      name: 'Australia',
      resource: 'iron',
      resourceamount: 9,
    },
  ]),

  down: (queryInterface) => queryInterface.bulkInsert('Regions', null, {}),
};