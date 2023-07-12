'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Borders', [
    {
      territory1_name: 'NorthAmerica',
      neighboring2_name: 'CentralAmerica',
    },
    {
      territory1_name: 'NorthAmerica',
      neighboring2_name: 'Europe',
    },
    {
      territory1_name: 'CentralAmerica',
      neighboring2_name: 'SouthAmerica',
    },
    {
      territory1_name: 'Africa',
      neighboring2_name: 'SouthAmerica',
    },
    {
      territory1_name: 'Africa',
      neighboring2_name: 'Europe',
    },
    {
      territory1_name: 'Europe',
      neighboring2_name: 'Russia',
    },
    {
      territory1_name: 'Russia',
      neighboring2_name: 'Asia',
    },
    {
      territory1_name: 'Asia',
      neighboring2_name: 'Australia',
    },
    {
      territory1_name: 'Asia',
      neighboring2_name: 'Africa',
    },
  ]),

  down: (queryInterface) => queryInterface.bulkInsert('Borders', null, {}),
};