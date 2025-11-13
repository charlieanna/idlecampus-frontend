import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Airbnb - Vacation Rental Platform
 * Comprehensive FR and NFR scenarios
 */
export const airbnbProblemDefinition: ProblemDefinition = {
  id: 'airbnb',
  title: 'Airbnb - Vacation Rentals',
  description: `Design a vacation rental platform like Airbnb that:
- Hosts can list properties with photos and details
- Guests can search and book properties
- Platform handles payments and bookings
- Users can leave reviews`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can leave reviews'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process bookings and searches',
      },
      {
        type: 'storage',
        reason: 'Need to store listings, bookings, users, reviews',
      },
      {
        type: 'object_storage',
        reason: 'Need to store property photos',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests to app server',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write booking data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve photos',
      },
    ],
    dataModel: {
      entities: ['user', 'listing', 'booking', 'review', 'payment'],
      fields: {
        user: ['id', 'name', 'email', 'phone', 'is_host', 'created_at'],
        listing: ['id', 'host_id', 'title', 'description', 'price_per_night', 'lat', 'lng', 'created_at'],
        booking: ['id', 'listing_id', 'guest_id', 'check_in', 'check_out', 'total_price', 'status', 'created_at'],
        review: ['id', 'booking_id', 'reviewer_id', 'rating', 'comment', 'created_at'],
        payment: ['id', 'booking_id', 'amount', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'geospatial_query', frequency: 'very_high' }, // Search by location
        { type: 'write', frequency: 'high' },        // Creating bookings
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing listings
      ],
    },
  },

  scenarios: generateScenarios('airbnb', problemConfigs.airbnb),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
listings = {}
bookings = {}
reviews = {}
payments = {}

def create_listing(listing_id: str, host_id: str, title: str, price_per_night: float, lat: float, lng: float) -> Dict:
    """
    FR-1: Hosts can list properties with photos and details
    Naive implementation - stores listing in memory
    """
    listings[listing_id] = {
        'id': listing_id,
        'host_id': host_id,
        'title': title,
        'description': "",
        'price_per_night': price_per_night,
        'lat': lat,
        'lng': lng,
        'photos': [],
        'created_at': datetime.now()
    }
    return listings[listing_id]

def search_listings(lat: float, lng: float, check_in: str, check_out: str, max_distance: float = 10.0) -> List[Dict]:
    """
    FR-2: Guests can search properties
    Naive implementation - returns all listings (no geospatial filtering)
    Real system would use geospatial database
    """
    # In real system, would filter by location, availability, dates
    return list(listings.values())

def book_property(booking_id: str, listing_id: str, guest_id: str, check_in: str, check_out: str) -> Dict:
    """
    FR-2: Guests can book properties
    Naive implementation - creates booking without conflict checking
    """
    if listing_id not in listings:
        return None

    listing = listings[listing_id]
    # Calculate nights and total (simplified)
    nights = 1  # Would calculate from dates in real system
    total_price = listing['price_per_night'] * nights

    bookings[booking_id] = {
        'id': booking_id,
        'listing_id': listing_id,
        'guest_id': guest_id,
        'check_in': check_in,
        'check_out': check_out,
        'total_price': total_price,
        'status': 'confirmed',
        'created_at': datetime.now()
    }
    return bookings[booking_id]

def process_payment(payment_id: str, booking_id: str, amount: float) -> Dict:
    """
    FR-3: Platform handles payments
    Naive implementation - stores payment record
    No actual payment processing
    """
    payments[payment_id] = {
        'id': payment_id,
        'booking_id': booking_id,
        'amount': amount,
        'status': 'completed',
        'created_at': datetime.now()
    }
    return payments[payment_id]

def leave_review(review_id: str, booking_id: str, reviewer_id: str, rating: int, comment: str) -> Dict:
    """
    FR-4: Users can leave reviews
    Naive implementation - stores review in memory
    """
    reviews[review_id] = {
        'id': review_id,
        'booking_id': booking_id,
        'reviewer_id': reviewer_id,
        'rating': rating,  # 1-5 stars
        'comment': comment,
        'created_at': datetime.now()
    }
    return reviews[review_id]

def get_listing_reviews(listing_id: str) -> List[Dict]:
    """
    Helper: Get all reviews for a listing
    Naive implementation - finds all bookings for listing and their reviews
    """
    listing_reviews = []
    # Find all bookings for this listing
    listing_booking_ids = [b['id'] for b in bookings.values() if b['listing_id'] == listing_id]

    # Find reviews for those bookings
    for review in reviews.values():
        if review['booking_id'] in listing_booking_ids:
            listing_reviews.append(review)

    return listing_reviews
`,
};
