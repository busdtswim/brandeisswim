// src/utils/placeholderUtils.js

// This file contains utility functions for placeholder images that you can use until you add your own images

// Function to generate image placeholder URL with a specified size and category
export const getPlaceholderImageUrl = (width, height, category = 'fitness') => {
    // You can use these categories: people, fitness, water, sports, nature
    return `https://source.unsplash.com/random/${width}x${height}/?swimming,${category}`;
  };
  
  // Common placeholder sizes used across the site
  export const PLACEHOLDERS = {
    hero: getPlaceholderImageUrl(1920, 1080, 'swimming,water'),
    program: getPlaceholderImageUrl(600, 400, 'swimming'),
    beginnerSwimmer: getPlaceholderImageUrl(600, 400, 'swimming,child'),
    intermediateSwimmer: getPlaceholderImageUrl(600, 400, 'swimming,teen'),
    advancedSwimmer: getPlaceholderImageUrl(600, 400, 'swimming,athlete'),
    testimonial: getPlaceholderImageUrl(400, 600, 'people'),
    cta: getPlaceholderImageUrl(800, 600, 'swimming,pool'),
    instructor: getPlaceholderImageUrl(400, 400, 'coach')
  };
  
  // You can use these in your components by importing them like:
  // import { PLACEHOLDERS } from '@/utils/placeholderUtils';
  // ...
  // <Image src={PLACEHOLDERS.hero} alt="Hero image" ... />