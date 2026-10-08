const sequelize = require('./config/database');
const Truck = require('./models/Truck');
const Load = require('./models/Load');
const Trip = require('./models/Trip');

async function seed() {
  await sequelize.sync({ alter: true });

  console.log('Seeding Trucks...');
  await Truck.destroy({ where: {} });
  const trucks = [];
  for (let i = 1; i <= 25; i++) {
    trucks.push({
      vehicle_number: `KA25AB${1000 + i}`,
      capacity_kg: 10000 + (Math.random() * 5000),
      status: i <= 18 ? 'available' : 'on_trip'
    });
  }
  await Truck.bulkCreate(trucks);

  console.log('Seeding Loads...');
  await Load.destroy({ where: {} });
  const loads = [];
  for (let i = 1; i <= 32; i++) {
    loads.push({
      load_number: `LD${10000 + i}`,
      commodity: 'Mixed Goods',
      origin: 'Hubli',
      destination: 'Dharwad',
      weight_kg: 5000,
      pickup_from: new Date(),
      status: 'posted'
    });
  }
  await Load.bulkCreate(loads);

  console.log('Seeding Trips...');
  await Trip.destroy({ where: {} });
  const trips = [];
  for (let i = 1; i <= 14; i++) {
    let distance = 0;
    if (i <= 8) {
      // make the first 8 trips add up to 1240
      distance = i === 8 ? 1240 - (150 * 7) : 150; // 7 * 150 = 1050. 8th = 190. Total = 1240.
    }
    trips.push({
      trip_number: `TRP${10000 + i}`,
      start_date: new Date(),
      start_location: 'Hubli',
      end_location: 'Dharwad',
      distance_km: distance,
      status: i <= 8 ? 'completed' : 'planned'
    });
  }
  await Trip.bulkCreate(trips);

  console.log('Seed completed successfully.');
  process.exit(0);
}

seed().catch(console.error);
