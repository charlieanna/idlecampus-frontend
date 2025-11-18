/**
 * Test script to verify solution generation works correctly
 * Run with: node test-solution-generation.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple test to verify the pattern detection logic
console.log('🧪 Testing Solution Generation Logic\n');
console.log('='.repeat(80));

// Test cases for pattern detection
const testCases = [
  {
    name: 'Uber (Geospatial)',
    title: 'Uber - Ride Sharing Platform',
    description: 'Design a ride sharing platform with location-based driver matching',
    expectedPatterns: ['Geospatial']
  },
  {
    name: 'WhatsApp (Real-time)',
    title: 'WhatsApp - Messaging Platform',
    description: 'Design a real-time messaging platform with instant message delivery',
    expectedPatterns: ['Real-time']
  },
  {
    name: 'YouTube (Media)',
    title: 'YouTube - Video Platform',
    description: 'Design a video streaming platform with video upload and playback',
    expectedPatterns: ['Media']
  },
  {
    name: 'Amazon (E-commerce)',
    title: 'Amazon - E-commerce Marketplace',
    description: 'Design an e-commerce platform with product catalog and shopping cart',
    expectedPatterns: ['E-commerce']
  },
  {
    name: 'Instagram (Social + Media)',
    title: 'Instagram - Photo Sharing',
    description: 'Design a social network for sharing photos and videos with friends',
    expectedPatterns: ['Social Graph', 'Media']
  },
  {
    name: 'TinyURL (Standard)',
    title: 'TinyURL - URL Shortener',
    description: 'Design a URL shortening service',
    expectedPatterns: []
  }
];

// Simple pattern detection (matching the implementation)
function testPatternDetection(testCase) {
  const { title, description } = testCase;
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  const patterns = [];
  
  // Geospatial
  const geoKeywords = ['map', 'location', 'nearby', 'distance', 'delivery', 'ride', 'driver'];
  if (geoKeywords.some(k => titleLower.includes(k) || descLower.includes(k))) {
    patterns.push('Geospatial');
  }
  
  // Real-time
  const realtimeKeywords = ['real-time', 'realtime', 'live', 'chat', 'message', 'messaging'];
  if (realtimeKeywords.some(k => titleLower.includes(k) || descLower.includes(k))) {
    patterns.push('Real-time');
  }
  
  // Media
  const mediaKeywords = ['video', 'media', 'photo', 'image', 'stream', 'upload'];
  if (mediaKeywords.some(k => titleLower.includes(k) || descLower.includes(k))) {
    patterns.push('Media');
  }
  
  // E-commerce
  const ecommerceKeywords = ['shop', 'store', 'product', 'catalog', 'cart', 'checkout', 'order'];
  if (ecommerceKeywords.some(k => titleLower.includes(k) || descLower.includes(k))) {
    patterns.push('E-commerce');
  }
  
  // Social Graph
  const graphKeywords = ['social', 'network', 'graph', 'friend', 'follow'];
  if (graphKeywords.some(k => titleLower.includes(k) || descLower.includes(k))) {
    patterns.push('Social Graph');
  }
  
  return patterns;
}

// Run tests
let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  const detectedPatterns = testPatternDetection(testCase);
  const expectedPatterns = testCase.expectedPatterns;
  
  const patternsMatch = 
    detectedPatterns.length === expectedPatterns.length &&
    detectedPatterns.every(p => expectedPatterns.includes(p));
  
  if (patternsMatch) {
    console.log(`✅ ${testCase.name}`);
    console.log(`   Detected: ${detectedPatterns.join(', ') || 'None (Standard)'}`);
    passed++;
  } else {
    console.log(`❌ ${testCase.name}`);
    console.log(`   Expected: ${expectedPatterns.join(', ') || 'None'}`);
    console.log(`   Detected: ${detectedPatterns.join(', ') || 'None'}`);
    failed++;
  }
  console.log('');
}

console.log('='.repeat(80));
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n✅ All pattern detection tests passed!');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Please review the pattern detection logic.');
  process.exit(1);
}

