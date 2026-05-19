// config/billing.js
export const SUBSCRIPTION_CONFIG = {
  features: {
    enableSevenDayTrial: true, // Activated for all users
  },
  plans: {
    monthly: {
      id: "plan_monthly_999",
      name: "Monthly Plan",
      price: 9.99,
      displayPrice: "$9.99/mo",
      trialPeriodDays: 7
    },
    yearly: {
      id: "plan_yearly_9999",
      name: "Yearly Plan",
      price: 99.99,
      displayPrice: "$99.99/yr",
      trialPeriodDays: 7
    }
  }
};
