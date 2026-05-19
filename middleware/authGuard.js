// middleware/authGuard.js
import { SUBSCRIPTION_CONFIG } from '../config/billing';

/**
 * Checks user trial/subscription validity.
 * Redirects unauthorized clicks or page changes to the subscription interface.
 */
export function handleFeatureAccess(user, routerHistory) {
  // If the 7-day trial is active globally and user hasn't converted yet
  const globalTrialActive = SUBSCRIPTION_CONFIG.features.enableSevenDayTrial;

  if (!user || user.isGuest || !user.hasActiveSubscription) {
    if (globalTrialActive && !user.hasActivatedTrial) {
      // Alert user or route cleanly to subscription to pick a path to trigger their trial
      console.log("Redirecting user to claim their 7-Day Free Trial...");
      routerHistory.push('/settings?action=select_plan&trial=true');
      return false; // Block execution of the clicked button action
    }
    
    // Fallback if trial is expired or not checked
    routerHistory.push('/settings?action=select_plan');
    return false;
  }
  
  return true; // Allow button operation to execute normally
}
