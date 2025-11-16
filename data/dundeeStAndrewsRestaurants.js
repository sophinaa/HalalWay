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



];

export default dundeeStAndrewsRestaurants;
