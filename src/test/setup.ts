// Test setup file
// Load environment variables from .env file
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file from project root
config({ path: resolve(process.cwd(), '.env') });

// Add jest-dom back when we need DOM testing
