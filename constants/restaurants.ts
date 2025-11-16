export type Restaurant = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: string;
  city: string;
  rating: number;
  price: '£' | '££' | '£££';
  distanceMinutes: number;
};

export const HALAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'halal-1',
    name: 'Green Garden Grill',
    description: 'Modern Middle Eastern plates with locally sourced produce.',
    tags: ['No alcohol', 'Family friendly', 'Reservation'],
    coordinates: {
      latitude: 51.5152,
      longitude: -0.0983,
    },
    address: '11 Old Broad St',
    city: 'London',
    rating: 4.8,
    price: '££',
    distanceMinutes: 6,
  },
  {
    id: 'halal-2',
    name: 'Spice Souk Kitchen',
    description: 'Slow-cooked curries and charcoal grills inspired by Lahore.',
    tags: ['Late night', 'Takeaway'],
    coordinates: {
      latitude: 51.5105,
      longitude: -0.1349,
    },
    address: '28 Wardour St',
    city: 'London',
    rating: 4.6,
    price: '££',
    distanceMinutes: 12,
  },
  {
    id: 'halal-3',
    name: 'Cedar & Stone',
    description: 'Levantine brunches, speciality coffee, and fresh flatbreads.',
    tags: ['Brunch', 'Vegan options'],
    coordinates: {
      latitude: 52.4857,
      longitude: -1.8896,
    },
    address: '42 Waterloo St',
    city: 'Birmingham',
    rating: 4.7,
    price: '££',
    distanceMinutes: 20,
  },
  {
    id: 'halal-4',
    name: 'Northern Naan House',
    description: 'Tandoor-fired naans piled with seasonal produce and chutneys.',
    tags: ['Street food', 'Delivery'],
    coordinates: {
      latitude: 53.4808,
      longitude: -2.2426,
    },
    address: '9 St. Peter’s Square',
    city: 'Manchester',
    rating: 4.5,
    price: '£',
    distanceMinutes: 38,
  },
  {
    id: 'halal-5',
    name: 'Harbour Halal Kitchen',
    description: 'Dockside seafood given a halal twist with house spice blends.',
    tags: ['Seafood', 'Scenic'],
    coordinates: {
      latitude: 55.9533,
      longitude: -3.1883,
    },
    address: '2 Commercial Quay',
    city: 'Edinburgh',
    rating: 4.9,
    price: '£££',
    distanceMinutes: 55,
  },
];
