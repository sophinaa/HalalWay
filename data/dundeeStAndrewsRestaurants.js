const dundeeStAndrewsRestaurants = [
  {
    id: 'dundee_01',
    name: 'Taza Indian Buffet',
    city: 'Dundee',
    area: 'City Centre',
    address: {
      line1: '1 Camperdown St Unit 1A',
      postcode: 'DD1 3JA',
    },
    contact: {
      phone: '01382 227722',
      website: 'https://www.taza.co.uk',
    },
    location: {
      lat: 56.46,
      lng: -2.96,
    },
    cuisine: 'Indian',
    priceRange: '££',
    halalInfo: {
      overallStatus: 'partial-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes:
        'Halal options available; verification recommended for specific meats.',
    },
    alcoholInfo: {
      servesAlcohol: true,
      separateFamilyArea: null,
    },
    openingHours: {
      monday: [{ open: '12:00', close: '21:15' }],
      tuesday: [{ open: '12:00', close: '21:15' }],
      wednesday: [{ open: '12:00', close: '21:15' }],
      thursday: [{ open: '12:00', close: '21:15' }],
      friday: [{ open: '12:00', close: '21:30' }],
      saturday: [{ open: '12:00', close: '21:30' }],
      sunday: [{ open: '12:00', close: '20:30' }],
    },
    reviews: [
      {
        id: 'taza_r1',
        user: 'demo@halalway.com',
        text: 'Amazing buffet variety and fresh naan.',
      },
      {
        id: 'taza_r2',
        user: 'test@test.com',
        text: 'Great value for money, gets busy on weekends.',
      },
    ],
    amenities: {
      buffet: true,
      vegetarianOptions: true,
      veganOptions: true,
      wifi: true,
    },
    tags: ['buffet', 'city-centre', 'indian-cuisine', 'all-you-can-eat'],
    serviceOptions: ['All you can eat', 'Vegan options', 'Wi-Fi'],
    lastVerified: '2025-01-20',
    verifiedBy: 'HalalWay Research',
  },

  {
    id: 'dundee_02',
    name: 'Krepes N Shakes',
    city: 'Dundee',
    area: 'West End',
    address: {
      line1: '145 Perth Rd',
      postcode: 'DD1 4HY',
    },
    contact: {
      phone: null,
      website: null,
    },
    location: {
      lat: 56.4575,
      lng: -2.9892,
    },
    cuisine: 'Dessert Bar',
    priceRange: '£',
    halalInfo: {
      overallStatus: 'halal-friendly',
      chickenHalal: null,
      redMeatHalal: null,
      porkServed: false,
      notes: 'Desserts and milkshakes only; no meat on menu.',
    },
    alcoholInfo: {
      servesAlcohol: false,
      separateFamilyArea: null,
    },
    openingHours: {
      monday: [{ open: '13:00', close: '22:00' }],
      tuesday: [{ open: '13:00', close: '22:00' }],
      wednesday: [{ open: '13:00', close: '22:00' }],
      thursday: [{ open: '13:00', close: '22:00' }],
      friday: [{ open: '13:00', close: '23:30' }],
      saturday: [{ open: '13:00', close: '23:30' }],
      sunday: [{ open: '13:00', close: '22:00' }],
    },
    reviews: [
      {
        id: 'krepes_r1',
        user: 'sweettooth@example.com',
        text: 'Loved the lotus biscoff crepe!',
      },
      {
        id: 'krepes_r2',
        user: 'student@uni.ac.uk',
        text: 'Perfect late-night dessert spot.',
      },
    ],
    amenities: {
      prayerSpace: null,
      wheelchairAccessible: true,
      kidFriendly: true,
      wifi: true,
      parking: 'street',
    },
    tags: ['dessert', 'late-night', 'student-friendly'],
    serviceOptions: [],
    lastVerified: '2024-11-16',
    verifiedBy: 'HalalWay Research',
  },

  {
    id: 'standrews_01',
    name: 'Jahangir Tandoori',
    city: 'St Andrews',
    area: 'Town Centre',
    address: {
      line1: '116 South St',
      postcode: 'KY16 9QD',
    },
    contact: {
      phone: null,
      website: null,
    },
    location: {
      lat: 56.3396,
      lng: -2.7986,
    },
    cuisine: 'Indian',
    priceRange: '££',
    halalInfo: {
      overallStatus: 'mixed',
      chickenHalal: true,
      redMeatHalal: null,
      porkServed: true,
      notes: 'Please request halal chicken dishes when ordering.',
    },
    alcoholInfo: {
      servesAlcohol: true,
      separateFamilyArea: false,
    },
    openingHours: {
      monday: [{ open: '12:00', close: '22:00' }],
      tuesday: [{ open: '12:00', close: '22:00' }],
      wednesday: [{ open: '12:00', close: '22:00' }],
      thursday: [{ open: '12:00', close: '22:30' }],
      friday: [{ open: '12:00', close: '23:00' }],
      saturday: [{ open: '12:00', close: '23:00' }],
      sunday: [{ open: '13:00', close: '22:00' }],
    },
    reviews: [
      {
        id: 'jahangir_r1',
        user: 'spicefan@halalway.com',
        text: 'Chicken karahi was spot on.',
      },
      {
        id: 'jahangir_r2',
        user: 'visitor@email.com',
        text: 'Friendly service, reserve ahead on weekends.',
      },
    ],
    amenities: {
      prayerSpace: null,
      wheelchairAccessible: false,
      kidFriendly: true,
      wifi: true,
      parking: 'street',
    },
    tags: ['sit-down', 'takeaway', 'spicy'],
    serviceOptions: [],
    lastVerified: '2024-11-16',
    verifiedBy: 'HalalWay Research',
  },

  {
    id: 'dundee_10',
    name: 'Mirch Masala Restaurant',
    city: 'Dundee',
    area: 'City Centre',
    address: {
      line1: '5 Hawkhill',
      postcode: 'DD1 5GP',
    },
    contact: {
      phone: '+44 1382 480 480',
      website: 'https://mirchmasaladundee.com',
    },
    location: {
      lat: 56.4579,
      lng: -2.9812,
    },
    cuisine: 'Pakistani',
    priceRange: '££',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'Website confirms halal meats.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['pakistani', 'all-halal', 'family-friendly'],
    serviceOptions: [],
  },

  {
    id: 'dundee_11',
    name: "Cravin' Crispy",
    city: 'Dundee',
    area: 'Stobswell',
    address: {
      line1: '187 Albert Street',
      postcode: 'DD4 6PX',
    },
    contact: {
      phone: '01382 698379',
      website: null,
    },
    location: {
      lat: 56.46955,
      lng: -2.9579,
    },
    cuisine: 'Fried Chicken',
    priceRange: '£',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'Local halal fried chicken shop.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['fried chicken', 'late-night', 'student-friendly'],
    serviceOptions: [],
  },

  {
    id: 'dundee_12',
    name: 'Side Street Grill',
    city: 'Dundee',
    area: 'City Centre',
    address: {
      line1: '142 Nethergate',
      postcode: 'DD1 4EA',
    },
    contact: {
      phone: '01382 690685',
      website: null,
    },
    location: {
      lat: 56.45832,
      lng: -2.9781,
    },
    cuisine: 'Burgers / Grill',
    priceRange: '££',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'All meats halal.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['burgers', 'grill', 'halal'],
    serviceOptions: [],
  },

  {
    id: 'dundee_13',
    name: 'Shax',
    city: 'Dundee',
    area: 'City Centre',
    address: {
      line1: '44 Whitehall Crescent',
      postcode: 'DD1 4AY',
    },
    contact: {
      phone: '01382 699999',
      website: null,
    },
    location: {
      lat: 56.4589,
      lng: -2.97,
    },
    cuisine: 'American / Grill',
    priceRange: '££',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'Local halal grill.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['american', 'grill', 'halal'],
    serviceOptions: [],
  },

  {
    id: 'dundee_14',
    name: 'Milas',
    city: 'Dundee',
    area: 'City Centre',
    address: {
      line1: '15 Panmure Street',
      postcode: 'DD1 2BG',
    },
    contact: {
      phone: '01382 221111',
      website: null,
    },
    location: {
      lat: 56.4623,
      lng: -2.9697,
    },
    cuisine: 'Turkish / Mediterranean',
    priceRange: '££',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'Known locally as fully halal.',
    },
    alcoholInfo: {
      servesAlcohol: true,
    },
    tags: ['turkish', 'mediterranean', 'all-halal'],
    serviceOptions: [],
  },

  {
    id: 'dundee_15',
    name: 'Medina',
    city: 'Dundee',
    area: 'Hilltown',
    address: {
      line1: '23 Strathmartine Road',
      postcode: 'DD3 7RL',
    },
    contact: {
      phone: null,
      website: null,
    },
    location: {
      lat: 56.4711,
      lng: -2.974,
    },
    cuisine: 'Pakistani',
    priceRange: '£',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'Community halal takeaway.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['pakistani', 'takeaway'],
    serviceOptions: [],
  },

  {
    id: 'dundee_16',
    name: "Pepe's Piri Piri",
    city: 'Dundee',
    area: 'City Centre',
    address: {
      line1: '40 Whitehall Street',
      postcode: 'DD1 4AF',
    },
    contact: {
      phone: '01382 202020',
      website: 'https://www.pepes.co.uk',
    },
    location: {
      lat: 56.4592,
      lng: -2.972,
    },
    cuisine: 'Peri Peri',
    priceRange: '£',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: false,
      porkServed: false,
      notes: 'Franchise using halal chicken.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['peri-peri', 'chicken', 'fast casual'],
    serviceOptions: [],
  },

  {
    id: 'dundee_17',
    name: 'German Doner Kebab',
    city: 'Dundee',
    area: 'City Centre',
    address: {
      line1: 'High Street',
      postcode: 'DD1',
    },
    contact: {
      phone: null,
      website: 'https://www.germandonerkebab.com',
    },
    location: {
      lat: 56.461,
      lng: -2.969,
    },
    cuisine: 'Doner / Fast Food',
    priceRange: '££',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'UK branches use halal meat.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['doner', 'fast food', 'late-night'],
    serviceOptions: [],
  },

  {
    id: 'dundee_18',
    name: 'Black Rooster Peri Peri',
    city: 'Dundee',
    area: 'Lochee',
    address: {
      line1: '145 High Street',
      postcode: 'DD2 3BZ',
    },
    contact: {
      phone: null,
      website: null,
    },
    location: {
      lat: 56.4725,
      lng: -3.012,
    },
    cuisine: 'Peri Peri',
    priceRange: '£',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'Franchise advertised as halal.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['peri-peri', 'takeaway'],
    serviceOptions: [],
  },

  // Extra Dundee dessert spot (local-only info, you can refine later)
  {
    id: 'dundee_19',
    name: 'Storm Desserts',
    city: 'Dundee',
    area: 'Hilltown',
    address: {
      line1: '105A Hilltown',
      postcode: 'DD3 7AN',
    },
    contact: {
      phone: null,
      website: null,
    },
    location: {
      lat: 56.471,
      lng: -2.9726,
    },
    cuisine: 'Desserts',
    priceRange: '£',
    halalInfo: {
      overallStatus: 'halal-friendly',
      chickenHalal: false,
      redMeatHalal: false,
      porkServed: false,
      notes: 'Dessert shop, no meat items.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['dessert', 'late-night', 'student-friendly'],
    serviceOptions: [],
  },

  {
    id: 'standrews_10',
    name: 'Shawarma House',
    city: 'St Andrews',
    area: 'City Centre',
    address: {
      line1: '94 Market Street',
      postcode: 'KY16 9PA',
    },
    contact: {
      phone: '01334 208208',
      website: null,
    },
    location: {
      lat: 56.33979,
      lng: -2.79948,
    },
    cuisine: 'Middle Eastern',
    priceRange: '£',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'Halal listed on restaurant info.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['shawarma', 'middle eastern', 'takeaway'],
    serviceOptions: [],
  },

  {
    id: 'standrews_11',
    name: 'Jahangir Balti & Tandoori',
    city: 'St Andrews',
    area: 'City Centre',
    address: {
      line1: '116 South Street',
      postcode: 'KY16 9QD',
    },
    contact: {
      phone: '01334 470300',
      website: 'https://www.jahangirstandrews.co.uk',
    },
    location: {
      lat: 56.33941,
      lng: -2.79588,
    },
    cuisine: 'Indian',
    priceRange: '££',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'Displays halal sign.',
    },
    alcoholInfo: {
      servesAlcohol: true,
    },
    tags: ['indian', 'balti', 'dine-in'],
    serviceOptions: [],
  },

  {
    id: 'standrews_12',
    name: 'Empire Grill House',
    city: 'St Andrews',
    area: 'City Centre',
    address: {
      line1: '157 South Street',
      postcode: 'KY16 9UP',
    },
    contact: {
      phone: '01334 209000',
      website: null,
    },
    location: {
      lat: 56.33902,
      lng: -2.79672,
    },
    cuisine: 'Grill / Burgers',
    priceRange: '££',
    halalInfo: {
      overallStatus: 'all-halal',
      chickenHalal: true,
      redMeatHalal: true,
      porkServed: false,
      notes: 'You confirmed fully halal, no pork.',
    },
    alcoholInfo: {
      servesAlcohol: false,
    },
    tags: ['grill', 'burgers', 'family-friendly'],
    serviceOptions: [],
  },
];

export default dundeeStAndrewsRestaurants;
