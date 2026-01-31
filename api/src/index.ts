/**
 * Azure Functions V4 Entry Point
 * This file imports all function definitions to register them with the runtime
 */

// Import all functions to register them
import './functions/config';
import './functions/sendOtp';
import './functions/verifyOtp';
import './functions/signup';

// All functions are registered via app.http() calls in their respective files
export { };
