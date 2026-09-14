/**
 * Azure Functions V4 Entry Point
 * This file imports all function definitions to register them with the runtime
 */

// Import all functions to register them
import './functions/config';
import './functions/sendOtp';
import './functions/verifyOtp';
import './functions/signup';
import './functions/getHighlights';
import './functions/getNewsList';
import './functions/retrieveNews';
import './functions/interactNews';
import './functions/seedNews';
import './functions/getDonors';
import './functions/updateDonor';
import './functions/sendConvocation';
<<<<<<< HEAD
import './functions/getSurveys';
import './functions/getSurveyById';
import './functions/saveSurvey';
import './functions/deleteSurvey';
import './functions/submitSurveyResponse';
import './functions/getSurveyResponses';
import './functions/exportSurveyResponses';
import './functions/markDonorExternal';
=======
import './functions/logAction';
import './functions/createNews';
import './functions/updateNews';
import './functions/deleteNews';
import './functions/uploadFile';
>>>>>>> deab6b41dbb7aa611a1c78627b830a48089b9d30

// All functions are registered via app.http() calls in their respective files
export { };
