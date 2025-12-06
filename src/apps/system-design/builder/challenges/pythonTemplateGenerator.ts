/**
 * Python Template Generator for All Challenges
 *
 * Generates Python starter code for all 659+ challenges using pattern matching
 */

import { Challenge } from '../types/testCase';

/**
 * Generate Python template based on challenge characteristics
 */
export function generatePythonTemplate(challenge: Challenge): string {
  const challengeId = challenge.id.toLowerCase();
  const title = challenge.title.toLowerCase();
  const description = challenge.description.toLowerCase();

  // Pattern matching to determine challenge type
  if (isURLShortener(challengeId, title)) {
    return generateURLShortenerTemplate(challenge);
  }

  if (isSocialMedia(challengeId, title)) {
    return generateSocialMediaTemplate(challenge);
  }

  if (isEcommerce(challengeId, title, description)) {
    return generateEcommerceTemplate(challenge);
  }

  if (isRideSharing(challengeId, title, description)) {
    return generateRideSharingTemplate(challenge);
  }

  if (isMessaging(challengeId, title, description)) {
    return generateMessagingTemplate(challenge);
  }

  if (isSearch(challengeId, title, description)) {
    return generateSearchTemplate(challenge);
  }

  if (isContentDelivery(challengeId, title, description)) {
    return generateContentDeliveryTemplate(challenge);
  }

  // Default generic template
  return generateGenericTemplate(challenge);
}

// Pattern detection helpers
function isURLShortener(id: string, title: string): boolean {
  return id.includes('url') || id.includes('tiny') || id.includes('bitly') ||
         title.includes('url short') || title.includes('link short');
}

function isSocialMedia(id: string, title: string): boolean {
  return id.includes('instagram') || id.includes('twitter') || id.includes('facebook') ||
         id.includes('reddit') || id.includes('linkedin') || id.includes('tiktok') ||
         title.includes('social') || title.includes('feed') || title.includes('post');
}

function isEcommerce(id: string, title: string, desc: string): boolean {
  return id.includes('amazon') || id.includes('shopify') || id.includes('ecommerce') ||
         id.includes('cart') || title.includes('e-commerce') || desc.includes('product');
}

function isRideSharing(id: string, title: string, desc: string): boolean {
  return id.includes('uber') || id.includes('lyft') || id.includes('ride') ||
         title.includes('ride') || desc.includes('driver') || desc.includes('passenger');
}

function isMessaging(id: string, title: string, desc: string): boolean {
  return id.includes('whatsapp') || id.includes('slack') || id.includes('messenger') ||
         id.includes('telegram') || id.includes('chat') || title.includes('messag');
}

function isSearch(id: string, title: string, desc: string): boolean {
  return id.includes('search') || id.includes('elastic') || id.includes('google') ||
         title.includes('search') || desc.includes('index');
}

function isContentDelivery(id: string, title: string, desc: string): boolean {
  return id.includes('netflix') || id.includes('youtube') || id.includes('spotify') ||
         id.includes('cdn') || id.includes('stream') || title.includes('video') ||
         title.includes('content delivery');
}

// Template generators
function generateURLShortenerTemplate(challenge: Challenge): string {
  return `# ${challenge.title}
# ${challenge.description.split('\n')[0]}

def shorten(url: str, context) -> str:
    """
    Create a short code for the given URL.

    Args:
        url: The long URL to shorten
        context: Execution context with db, cache, queue APIs

    Returns:
        A short code string (e.g., "abc123")

    Available APIs:
        - context.db.get(key)
        - context.db.set(key, value)
        - context.cache.get(key)
        - context.cache.set(key, value, ttl_seconds)
    """
    # TODO: Generate a short code (hint: use hashlib or base62 encoding)
    # TODO: Store mapping in database or cache
    # TODO: Handle collisions
    pass

def expand(code: str, context) -> str:
    """
    Retrieve the original URL from a short code.

    Args:
        code: The short code to expand
        context: Execution context

    Returns:
        The original URL, or None if not found
    """
    # TODO: Look up the code in database or cache
    # TODO: Return the original URL
    pass

# Example usage:
# short_code = shorten("https://example.com/very/long/url", context)
# original_url = expand(short_code, context)
`;
}

function generateSocialMediaTemplate(challenge: Challenge): string {
  const name = challenge.title.split(' ')[0]; // e.g., "Instagram" from "Instagram Design"

  return `# ${challenge.title}
# ${challenge.description.split('\n')[0]}
# Simplified version for learning - No ML ranking, no CDN

def post_content(user_id: str, content: str, context) -> str:
    """
    Post new content (photo/text/video).

    Args:
        user_id: ID of the user posting
        content: Content URL or text
        context: Execution context

    Returns:
        post_id: Unique ID for the post

    Available APIs:
        - context.db.set(key, value) - Store data
        - context.db.get(key) - Retrieve data
        - context.queue.publish(topic, message) - Async processing
        - context.cache.set(key, value, ttl) - Cache data
    """
    # TODO: Generate unique post_id
    # TODO: Store post in database
    # TODO: Publish to queue for async processing (notifications, etc.)
    # TODO: Update user's post list
    pass

def get_feed(user_id: str, limit: int, context) -> list:
    """
    Get chronological feed for user (simplified - no ML ranking).

    Args:
        user_id: ID of the user
        limit: Number of posts to return
        context: Execution context

    Returns:
        List of posts from friends, sorted by time
    """
    # TODO: Get list of friends from database
    # TODO: Get recent posts from friends
    # TODO: Sort by timestamp (chronological)
    # TODO: Return most recent 'limit' posts
    # HINT: Use context.cache for frequently accessed data
    pass

def follow_user(user_id: str, target_id: str, context) -> bool:
    """
    Follow another user.

    Args:
        user_id: ID of the user doing the following
        target_id: ID of the user being followed
        context: Execution context

    Returns:
        True if successful
    """
    # TODO: Add to follows table in database
    # TODO: Invalidate relevant caches
    pass

# Example usage:
# post_id = post_content("user123", "photo_url", context)
# feed = get_feed("user123", 50, context)
# follow_user("user123", "user456", context)
`;
}

function generateEcommerceTemplate(challenge: Challenge): string {
  return `# ${challenge.title}
# ${challenge.description.split('\n')[0]}

def add_to_cart(user_id: str, product_id: str, quantity: int, context) -> bool:
    """
    Add item to shopping cart.

    Args:
        user_id: ID of the user
        product_id: ID of the product
        quantity: Number of items
        context: Execution context

    Returns:
        True if successful

    Available APIs:
        - context.db.get(key)
        - context.db.set(key, value)
        - context.cache.get(key)
        - context.cache.set(key, value, ttl)
    """
    # TODO: Check product availability in database
    # TODO: Update cart in database or cache
    # TODO: Handle quantity updates if product already in cart
    pass

def checkout(user_id: str, context) -> dict:
    """
    Process checkout and create order.

    Args:
        user_id: ID of the user
        context: Execution context

    Returns:
        Order details (order_id, total, items)
    """
    # TODO: Get cart from database/cache
    # TODO: Calculate total price
    # TODO: Create order in database
    # TODO: Clear cart
    # TODO: Publish order event to queue for async processing
    pass

def get_product_details(product_id: str, context) -> dict:
    """
    Get product information.

    Args:
        product_id: ID of the product
        context: Execution context

    Returns:
        Product details (name, price, inventory, etc.)
    """
    # TODO: Check cache first
    # TODO: If not in cache, get from database
    # TODO: Store in cache for future requests
    pass

# Example usage:
# add_to_cart("user123", "product456", 2, context)
# order = checkout("user123", context)
# product = get_product_details("product456", context)
`;
}

function generateRideSharingTemplate(challenge: Challenge): string {
  return `# ${challenge.title}
# ${challenge.description.split('\n')[0]}
# Simplified version - No surge pricing, no ML matching

def request_ride(user_id: str, pickup_location: dict, context) -> str:
    """
    Request a ride (simplified matching).

    Args:
        user_id: ID of the user
        pickup_location: {'lat': float, 'lon': float}
        context: Execution context

    Returns:
        ride_id: Unique ID for the ride request

    Available APIs:
        - context.db.get(key)
        - context.db.set(key, value)
        - context.queue.publish(topic, message)
    """
    # TODO: Create ride request in database
    # TODO: Find nearest available driver (simple distance calculation)
    # TODO: Publish match event to queue
    # TODO: Return ride_id
    pass

def accept_ride(driver_id: str, ride_id: str, context) -> bool:
    """
    Driver accepts a ride.

    Args:
        driver_id: ID of the driver
        ride_id: ID of the ride
        context: Execution context

    Returns:
        True if successful
    """
    # TODO: Update ride status in database
    # TODO: Notify user via queue
    pass

def complete_ride(ride_id: str, dropoff_location: dict, context) -> dict:
    """
    Complete ride and calculate fare (simplified pricing).

    Args:
        ride_id: ID of the ride
        dropoff_location: {'lat': float, 'lon': float}
        context: Execution context

    Returns:
        Ride details with fare
    """
    # TODO: Get ride from database
    # TODO: Calculate distance
    # TODO: Calculate fare (distance * base_rate)
    # TODO: Update ride status
    # TODO: Return fare details
    pass

# Example usage:
# ride_id = request_ride("user123", {'lat': 37.7, 'lon': -122.4}, context)
# accept_ride("driver456", ride_id, context)
# result = complete_ride(ride_id, {'lat': 37.8, 'lon': -122.5}, context)
`;
}

function generateMessagingTemplate(challenge: Challenge): string {
  return `# ${challenge.title}
# ${challenge.description.split('\n')[0]}

def send_message(sender_id: str, recipient_id: str, message: str, context) -> str:
    """
    Send a message to another user.

    Args:
        sender_id: ID of the sender
        recipient_id: ID of the recipient
        message: Message content
        context: Execution context

    Returns:
        message_id: Unique ID for the message

    Available APIs:
        - context.db.set(key, value)
        - context.queue.publish(topic, message)
        - context.cache.set(key, value, ttl)
    """
    # TODO: Generate message_id
    # TODO: Store message in database
    # TODO: Publish to queue for real-time delivery
    # TODO: Update conversation thread
    pass

def get_messages(user_id: str, conversation_id: str, limit: int, context) -> list:
    """
    Get messages from a conversation.

    Args:
        user_id: ID of the user
        conversation_id: ID of the conversation
        limit: Number of messages to return
        context: Execution context

    Returns:
        List of messages, sorted by time
    """
    # TODO: Get messages from database
    # TODO: Sort by timestamp (descending)
    # TODO: Return recent 'limit' messages
    # TODO: Consider using cache for recent messages
    pass

def mark_as_read(user_id: str, message_id: str, context) -> bool:
    """
    Mark message as read.

    Args:
        user_id: ID of the user
        message_id: ID of the message
        context: Execution context

    Returns:
        True if successful
    """
    # TODO: Update message status in database
    # TODO: Invalidate unread count cache
    pass

# Example usage:
# msg_id = send_message("user123", "user456", "Hello!", context)
# messages = get_messages("user123", "conv789", 50, context)
# mark_as_read("user456", msg_id, context)
`;
}

function generateSearchTemplate(challenge: Challenge): string {
  return `# ${challenge.title}
# ${challenge.description.split('\n')[0]}

def index_document(doc_id: str, content: str, context) -> bool:
    """
    Index a document for search.

    Args:
        doc_id: Unique document ID
        content: Document content to index
        context: Execution context

    Returns:
        True if successful

    Available APIs:
        - context.db.set(key, value)
        - context.search.index(doc_id, content)
        - context.queue.publish(topic, message)
    """
    # TODO: Store document in database
    # TODO: Extract keywords/tokens from content
    # TODO: Update search index
    # TODO: Publish to queue for async indexing
    pass

def search(query: str, limit: int, context) -> list:
    """
    Search for documents matching query.

    Args:
        query: Search query string
        limit: Maximum number of results
        context: Execution context

    Returns:
        List of matching document IDs, ranked by relevance
    """
    # TODO: Parse query into keywords
    # TODO: Look up keywords in search index
    # TODO: Rank results (simple: by keyword match count)
    # TODO: Return top 'limit' results
    # HINT: Use context.cache for popular queries
    pass

def update_document(doc_id: str, new_content: str, context) -> bool:
    """
    Update existing document.

    Args:
        doc_id: Document ID to update
        new_content: New content
        context: Execution context

    Returns:
        True if successful
    """
    # TODO: Update document in database
    # TODO: Re-index document
    # TODO: Invalidate relevant caches
    pass

# Example usage:
# index_document("doc123", "Python programming tutorial", context)
# results = search("python tutorial", 10, context)
# update_document("doc123", "Advanced Python programming", context)
`;
}

function generateContentDeliveryTemplate(challenge: Challenge): string {
  return `# ${challenge.title}
# ${challenge.description.split('\n')[0]}

def upload_content(user_id: str, content_url: str, metadata: dict, context) -> str:
    """
    Upload content (video/music/file).

    Args:
        user_id: ID of the user
        content_url: URL of the content
        metadata: {'title': str, 'description': str, etc.}
        context: Execution context

    Returns:
        content_id: Unique ID for the content

    Available APIs:
        - context.db.set(key, value)
        - context.cdn.put_asset(url, data)
        - context.queue.publish(topic, message)
        - context.cache.set(key, value, ttl)
    """
    # TODO: Generate content_id
    # TODO: Store metadata in database
    # TODO: Upload to CDN via context.cdn
    # TODO: Publish to queue for processing (transcoding, etc.)
    pass

def get_content(content_id: str, user_id: str, context) -> dict:
    """
    Get content for streaming/download.

    Args:
        content_id: ID of the content
        user_id: ID of the requesting user
        context: Execution context

    Returns:
        Content details (url, metadata, etc.)
    """
    # TODO: Get metadata from database or cache
    # TODO: Get CDN URL via context.cdn
    # TODO: Track view/play event (analytics)
    # TODO: Return content details
    pass

def recommend_content(user_id: str, limit: int, context) -> list:
    """
    Get content recommendations (simplified - no ML).

    Args:
        user_id: ID of the user
        limit: Number of recommendations
        context: Execution context

    Returns:
        List of recommended content IDs
    """
    # TODO: Get user's watch history from database
    # TODO: Get popular content (simple: most viewed)
    # TODO: Filter out already watched
    # TODO: Return top 'limit' recommendations
    pass

# Example usage:
# content_id = upload_content("user123", "video.mp4", {'title': 'My Video'}, context)
# content = get_content(content_id, "user456", context)
# recommendations = recommend_content("user456", 10, context)
`;
}

function generateGenericTemplate(challenge: Challenge): string {
  return `# ${challenge.title}
# ${challenge.description.split('\n')[0]}

def process_request(request_data: dict, context) -> dict:
    """
    Process incoming request.

    Args:
        request_data: Request payload
        context: Execution context with db, cache, queue, cdn APIs

    Returns:
        Response data

    Available Context APIs:
        - context.db.get(key) - Get from database
        - context.db.set(key, value) - Store in database
        - context.cache.get(key) - Get from cache
        - context.cache.set(key, value, ttl) - Store in cache
        - context.queue.publish(topic, message) - Publish to queue
        - context.cdn.get_asset(url) - Get from CDN
        - context.cdn.put_asset(url, data) - Store in CDN
    """
    # TODO: Implement your solution here
    # TODO: Use appropriate context APIs based on requirements
    pass

# Example usage:
# result = process_request({'action': 'create', 'data': {...}}, context)
`;
}

/**
 * Detect which context APIs are needed for a challenge
 */
export function detectRequiredAPIs(challenge: Challenge): string[] {
  const apis: string[] = [];
  const text = `${challenge.id} ${challenge.title} ${challenge.description}`.toLowerCase();

  // Always needs database
  apis.push('db');

  if (text.includes('cache') || text.includes('redis') || text.includes('fast')) {
    apis.push('cache');
  }

  if (text.includes('queue') || text.includes('async') || text.includes('notification')) {
    apis.push('queue');
  }

  if (text.includes('cdn') || text.includes('content') || text.includes('video') ||
      text.includes('image') || text.includes('stream')) {
    apis.push('cdn');
  }

  if (text.includes('search') || text.includes('elastic')) {
    apis.push('search');
  }

  return apis;
}
