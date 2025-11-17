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
    redMeatHalal: false,
    porkServed: false,
    notes: 'Halal options available; verification recommended for specific meats.',
  },
  alcoholInfo: {
    servesAlcohol: true                
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
  reviews: {
    averageRating: null,
    reviewCount: null,
    source: 'TripAdvisor',
  },
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
    lat: null,                       
    lng: null,
  },
  cuisine: 'Pakistani',
  priceRange: '££',
  halalInfo: {
     overallStatus: 'all-halal',    
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'Website confirms halal status of all meats.',
  },
  alcoholInfo: {
    servesAlcohol: false              // not verified
  },
  openingHours: {},                  // not publicly listed clearly
  reviews: {
    averageRating: null,
    reviewCount: null,
    source: 'TripAdvisor',
  },
  amenities: {
    buffet: false,
    vegetarianOptions: true,
    veganOptions: true,
    wifi: null,
  },
  tags: ['city-centre', 'pakistani-cuisine'],
  serviceOptions: ['All you can eat', 'Wi-Fi', "Kids' menu"],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},

{
  id: 'dundee_03',
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
    lng: -2.95790,
  },
  cuisine: 'American / Fried Chicken',
  priceRange: '£',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'Fully halal fried chicken shop.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {
    monday: [{ open: '15:00', close: '23:00' }],
    tuesday: [{ open: '15:00', close: '23:00' }],
    wednesday: [{ open: '15:00', close: '23:00' }],
    thursday: [{ open: '15:00', close: '23:00' }],
    friday: [{ open: '15:00', close: '23:00' }],
    saturday: [{ open: '15:00', close: '23:00' }],
    sunday: [{ open: '15:00', close: '23:00' }],
  },
  reviews: {
    averageRating: null,
    reviewCount: null,
    source: 'Google',
  },
  amenities: {
    buffet: false,
    vegetarianOptions: true,
    veganOptions: false,
    wifi: false,
  },
  tags: ['fried-chicken', 'takeaway', 'budget-friendly'],
  serviceOptions: ['Takeaway', 'Delivery'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},


{
  id: 'dundee_04',
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
    lng: -2.97810,
  },
  cuisine: 'Burgers / American Grill',
  priceRange: '££',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'Restaurant states all meats are halal.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {
    monday: [{ open: '12:00', close: '22:00' }],
    tuesday: [{ open: '12:00', close: '22:00' }],
    wednesday: [{ open: '12:00', close: '22:00' }],
    thursday: [{ open: '12:00', close: '22:00' }],
    friday: [{ open: '12:00', close: '23:00' }],
    saturday: [{ open: '12:00', close: '23:00' }],
    sunday: [{ open: '12:00', close: '22:00' }],
  },
  reviews: {
    averageRating: null,
    reviewCount: null,
    source: 'Google',
  },
  amenities: {
    buffet: false,
    vegetarianOptions: true,
    veganOptions: false,
    wifi: false,
  },
  tags: ['burgers', 'grill', 'city-centre', 'halal-burgers'],
  serviceOptions: ['Dine-in', 'Takeaway'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},

{
  id: 'dundee_05',
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
    lng: -2.9700,
  },
  cuisine: 'American / Grill',
  priceRange: '££',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'Locally known to be fully halal.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {},
  reviews: {},
  amenities: {},
  tags: ['burgers', 'grill', 'halal'],
  serviceOptions: ['Dine-in', 'Takeaway'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},

{
  id: 'dundee_06',
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
  cuisine: 'Mediterranean / Turkish',
  priceRange: '££',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'Widely known locally as fully halal.',
  },
  alcoholInfo: {
    servesAlcohol: true,
  },
  openingHours: {},
  reviews: {},
  amenities: {},
  tags: ['turkish', 'grill', 'halal'],
  serviceOptions: ['Dine-in', 'Takeaway'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},


{
  id: 'dundee_07',
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
    lng: -2.9740,
  },
  cuisine: 'Pakistani / Indian',
  priceRange: '£',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'Community confirmed halal.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {},
  reviews: {},
  amenities: {},
  tags: ['pakistani', 'curries', 'halal'],
  serviceOptions: ['Takeaway'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},


{
  id: 'dundee_09',
  name: "Pepe's Piri Piri",
  city: 'Dundee',
  area: 'City Centre',
  address: {
    line1: 'Unit 2, 40 Whitehall Street',
    postcode: 'DD1 4AF',
  },
  contact: {
    phone: '01382 202020',
    website: 'https://www.pepes.co.uk',
  },
  location: {
    lat: 56.4592,
    lng: -2.9720,
  },
  cuisine: 'Peri Peri / Grilled Chicken',
  priceRange: '£',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: false,
    porkServed: false,
    notes: 'Franchise — all chicken halal nationwide.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {},
  reviews: {},
  amenities: {},
  tags: ['peri-peri', 'chicken', 'halal'],
  serviceOptions: ['Takeaway', 'Delivery'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},


{
  id: 'dundee_09',
  name: "Pepe's Piri Piri",
  city: 'Dundee',
  area: 'City Centre',
  address: {
    line1: 'Unit 2, 40 Whitehall Street',
    postcode: 'DD1 4AF',
  },
  contact: {
    phone: '01382 202020',
    website: 'https://www.pepes.co.uk',
  },
  location: {
    lat: 56.4592,
    lng: -2.9720,
  },
  cuisine: 'Peri Peri / Grilled Chicken',
  priceRange: '£',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: false,
    porkServed: false,
    notes: 'Franchise — all chicken halal nationwide.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {},
  reviews: {},
  amenities: {},
  tags: ['peri-peri', 'chicken', 'halal'],
  serviceOptions: ['Takeaway', 'Delivery'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},

{
  id: 'dundee_10',
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
    lat: 56.4710,
    lng: -2.9726,
  },
  cuisine: 'Desserts',
  priceRange: '£',
  halalInfo: {
    overallStatus: 'halal-friendly',
    chickenHalal: false,
    redMeatHalal: false,
    porkServed: false,
    notes: 'Dessert shop — no meat served.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {},
  reviews: {},
  amenities: {},
  tags: ['desserts', 'waffles'],
  serviceOptions: ['Takeaway', 'Delivery'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},


{
  id: 'dundee_11',
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
    lat: 56.4610,
    lng: -2.9690,
  },
  cuisine: 'Doner / Fast Food',
  priceRange: '££',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'UK GDK branches use halal meat.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {},
  reviews: {},
  amenities: {},
  tags: ['doner', 'fast-food', 'halal'],
  serviceOptions: ['Dine-in', 'Takeaway'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},


{
  id: 'dundee_12',
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
    lng: -3.0120,
  },
  cuisine: 'Peri Peri / Grilled Chicken',
  priceRange: '£',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'Franchise — menu is halal certified.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {},
  reviews: {},
  amenities: {},
  tags: ['peri-peri', 'chicken', 'halal'],
  serviceOptions: ['Takeaway', 'Delivery'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},



{
  id: 'standrews_01',
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
    notes: 'Halal confirmed on TripAdvisor under Special Diets.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {
    monday: [{ open: '12:00', close: '23:00' }],
    tuesday: [{ open: '12:00', close: '23:00' }],
    wednesday: [{ open: '12:00', close: '23:00' }],
    thursday: [{ open: '12:00', close: '23:00' }],
    friday: [{ open: '12:00', close: '23:30' }],
    saturday: [{ open: '12:00', close: '23:30' }],
    sunday: [{ open: '12:00', close: '23:00' }],
  },
  reviews: {
    averageRating: null,
    reviewCount: null,
    source: 'TripAdvisor',
  },
  amenities: {
    buffet: false,
    vegetarianOptions: true,
    veganOptions: false,
    wifi: false,
  },
  tags: ['shawarma', 'middle-eastern', 'quick-bites'],
  serviceOptions: ['Takeaway', 'Delivery'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},

{
  id: 'standrews_02',
  name: 'Jahangir Balti & Tandoori Restaurant',
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
  cuisine: 'Indian / Pakistani',
  priceRange: '££',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'Halal Assured sign displayed at restaurant.',
  },
  alcoholInfo: {
    servesAlcohol: true, // They serve wine & beer
  },
  openingHours: {
    monday: [{ open: '17:00', close: '23:00' }],
    tuesday: [{ open: '17:00', close: '23:00' }],
    wednesday: [{ open: '17:00', close: '23:00' }],
    thursday: [{ open: '17:00', close: '23:00' }],
    friday: [{ open: '17:00', close: '23:00' }],
    saturday: [{ open: '17:00', close: '23:00' }],
    sunday: [{ open: '17:00', close: '23:00' }],
  },
  reviews: {
    averageRating: null,
    reviewCount: null,
    source: 'Google',
  },
  amenities: {
    buffet: false,
    vegetarianOptions: true,
    veganOptions: true,
    wifi: false,
  },
  tags: ['indian', 'pakistani', 'family-friendly'],
  serviceOptions: ['Dine-in', 'Takeaway'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},

{
  id: 'standrews_03',
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
  cuisine: 'Grill / Burgers / Peri-Peri',
  priceRange: '££',
  halalInfo: {
    overallStatus: 'all-halal',
    chickenHalal: true,
    redMeatHalal: true,
    porkServed: false,
    notes: 'User-confirmed halal; no pork on menu.',
  },
  alcoholInfo: {
    servesAlcohol: false,
  },
  openingHours: {
    monday: [{ open: '16:00', close: '23:00' }],
    tuesday: [{ open: '16:00', close: '23:00' }],
    wednesday: [{ open: '16:00', close: '23:00' }],
    thursday: [{ open: '16:00', close: '23:00' }],
    friday: [{ open: '16:00', close: '23:00' }],
    saturday: [{ open: '16:00', close: '23:00' }],
    sunday: [{ open: '16:00', close: '23:00' }],
  },
  reviews: {
    averageRating: null,
    reviewCount: null,
    source: 'Google',
  },
  amenities: {
    buffet: false,
    vegetarianOptions: true,
    veganOptions: false,
    wifi: false,
  },
  tags: ['burgers', 'peri-peri', 'halal-grill'],
  serviceOptions: ['Dine-in', 'Takeaway', 'Delivery'],
  lastVerified: '2025-01-20',
  verifiedBy: 'HalalWay Research',
},

];



export default dundeeStAndrewsRestaurants;
