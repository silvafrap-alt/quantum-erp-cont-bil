// This file mocks a service layer that would make API calls to your backend.

import { SubscriptionPlan, PlanDetails } from "../types";

// This simulates the backend API calls for Stripe Checkout
export const api = {
  /**
   * Calls the backend to create a Stripe Checkout session.
   * In a real app, this would use fetch to make a request to a serverless function.
   * The function would then call Stripe's API and return the session URL.
   */
  async createCheckoutSession(plan: PlanDetails, userId: string) {
    console.log('API CALL: POST /create-checkout-session', { 
        priceId: plan.priceId,
        userId
    });

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 750)); 

    // The backend returns a URL from the Stripe Checkout Session.
    // We simulate this URL here. The success/cancel URLs point back to our app's hash routes.
    // We pass the selected plan in the success URL to simulate refetching the correct data
    // after the backend webhook has updated the user's subscription.
    const successUrl = `${window.location.origin}${window.location.pathname}#/payment/success?plan=${plan.name}`;
    const cancelUrl = `${window.location.origin}${window.location.pathname}#/payment/cancel`;
    
    console.log('Backend response (mocked):', { successUrl, cancelUrl });

    // This would be the actual Stripe URL. For this exercise, we'll just redirect to our success page
    // to demonstrate the frontend flow after payment.
    return { url: successUrl };
  }
};