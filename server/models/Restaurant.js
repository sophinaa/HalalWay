import mongoose from 'mongoose';

const { Schema } = mongoose;

const OpeningPeriodSchema = new Schema(
  {
    open: { type: String, required: true },
    close: { type: String, required: true },
  },
  { _id: false }
);

const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String },
    address: {
      line1: { type: String, required: true },
      postcode: { type: String, required: true },
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    cuisine: { type: String, required: true },
    priceRange: {
      type: String,
      enum: ['£', '££', '£££'],
      default: '££',
    },
    contact: {
      phone: { type: String, default: null },
      email: { type: String, default: null },
      website: { type: String, default: null },
    },
    halalInfo: {
      overallStatus: {
        type: String,
        enum: ['all-halal', 'mixed', 'unknown'],
        default: 'unknown',
      },
      chickenHalal: { type: Boolean, default: null },
      redMeatHalal: { type: Boolean, default: null },
      porkServed: { type: Boolean, default: false },
      notes: { type: String, default: '' },
    },
    alcoholInfo: {
      servesAlcohol: { type: Boolean, default: false },
      separateFamilyArea: { type: Boolean, default: null },
    },
    openingHours: {
      monday: { type: [OpeningPeriodSchema], default: [] },
      tuesday: { type: [OpeningPeriodSchema], default: [] },
      wednesday: { type: [OpeningPeriodSchema], default: [] },
      thursday: { type: [OpeningPeriodSchema], default: [] },
      friday: { type: [OpeningPeriodSchema], default: [] },
      saturday: { type: [OpeningPeriodSchema], default: [] },
      sunday: { type: [OpeningPeriodSchema], default: [] },
    },
    reviews: {
      averageRating: { type: Number, default: null },
      reviewCount: { type: Number, default: 0 },
      source: { type: String, default: null },
    },
    amenities: {
      prayerSpace: { type: Boolean, default: null },
      wheelchairAccessible: { type: Boolean, default: null },
      kidFriendly: { type: Boolean, default: null },
      wifi: { type: Boolean, default: null },
      parking: {
        type: String,
        enum: ['none', 'street', 'car-park', null],
        default: null,
      },
    },
    tags: { type: [String], default: [] },
    serviceOptions: { type: [String], default: [] },
    lastVerified: { type: Date, default: null },
    verifiedBy: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Restaurant', RestaurantSchema);
