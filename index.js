const fs = require('fs');

const co = JSON.parse(fs.readFileSync('./co.json'));
const bgt = JSON.parse(fs.readFileSync('./Bogota.json'));

// Create localidades Bogotá object
let localidadesBogota = bgt.map(localidad => {
  const str = localidad.fields.localidad.toLowerCase();
  return {
    id: str.charAt(0).toUpperCase() + str.slice(1),
    name: str.charAt(0).toUpperCase() + str.slice(1),
    code: "BOG",
    centerLocation: {
      lat: localidad.fields.latitud,
      lng: localidad.fields.longitud,
    },
    department: "Bogotá",
    country: {
      id: 'Colombia',
      name: 'Colombia',
      code: 'COL',
    },
    isPrincipal: false,
    ranking: 0,
  }
})

// Create cities objects
let cities = co.map(city => ({
  id: city.city,
  name: city.city,
  code: city.admin_name.substring(0, 3).toUpperCase(),
  centerLocation: {
    lat: +city.lat,
    lng: +city.lng,
  },
  department: city.admin_name,
  country: {
    id: 'Colombia',
    name: 'Colombia',
    code: 'COL',
  },
  isPrincipal: (city.city === 'Medellín' || city.city === 'Cali' || city.city === 'Bucaramanga' || city.city === 'Villavicencio' || city.city === 'Manizales' || (city.city === 'Armenia' && city.admin_name === 'Quindío') || city.city === 'Pasto' || city.city === 'Pereira') ? true : false,
}))

// Departments distinct
let departments = [];
let map = new Map();
for (const city of cities) {
    if(!map.has(city.department) && city.department !== "San Andrés y Providencia"){
        map.set(city.department, true);
        departments.push({
            id: city.department,
            name: city.department,
            code: city.code,
        });
    }
}

// Set ranking
cities = cities.map(city => {
  let rank = 0;
  if (city.name === "Medellín") rank = 3;
  if (city.name === "Cali") rank = 3;
  if (city.name === "Barranquilla") rank = 3;
  if (city.name === "Cartagena") rank = 3;
  if (city.name === "Pasto") rank = 3;
  if (city.name === "Santa Marta") rank = 3;
  if (city.name === "Villavicencio") rank = 3;
  if (city.name === "Bucaramanga") rank = 3;
  if (city.name === "Manizales") rank = 3;
  if (city.name === "Armenia" && city.department === "Quindío") rank = 3;
  if (city.name === "Pereira") rank = 3;

  return {
    ...city,
    ranking: rank,
  }
})

// Sort Cities
cities.sort((a, b) => b.ranking - a.ranking);

// Set cities to departments
departments = departments.map((department) => ({
  ...department,
  isPrincipal: (department.name === "Bogotá" || department.name === "Antioquia" || department.name === "Valle del cauca" || department.name === "Cundinamarca" || department.name === "Nariño" || department.name === "Atlántico") ? true : false,
  ranking: 0,
  cities: cities.filter(city => city.department === department.name && city.department !== "Bogotá"),
}))

departments = departments.map(department => {
  let rank = 0;
  if (department.name === "Bogotá") rank = 4;
  if (department.name === "Antioquia") rank = 3;
  if (department.name === "Valle del Cauca") rank = 2;
  if (department.name === "Cundinamarca") rank = 1;

  return {
    ...department,
    ranking: rank,
  }
})

// Sort Departments
departments.sort((a, b) => b.ranking - a.ranking);

departments[0].cities = localidadesBogota

fs.writeFileSync('./data.json', JSON.stringify(departments, null, 2));
// CIUDADES REPETIDAS
// - San José, Nariño
// - Yarumal, Antioquia