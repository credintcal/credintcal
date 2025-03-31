# Setting Up Google Analytics (GA4) for Credbill

This document provides instructions on how to set up Google Analytics 4 (GA4) for the Credbill application.

## Prerequisites

1. A Google account
2. Access to the Credbill codebase

## Steps to Set Up Google Analytics

### 1. Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/) and sign in with your Google account.
2. Click on "Admin" in the bottom left corner.
3. In the Account column, select "Create Account" if you don't have one, or select an existing account.
4. Enter an account name (e.g., "Credbill").
5. Configure data sharing settings as needed and click "Next".
6. In the Property column, click "Create Property".
7. Select "Web" as the platform.
8. Enter your website name (e.g., "Credbill - Credit Card Calculator").
9. Enter your website URL (e.g., "https://credintcal.vercel.app").
10. Select your industry category and reporting time zone.
11. Click "Create".

### 2. Get Your Measurement ID

1. After creating the property, you'll be prompted to create a data stream. If not, go to "Data Streams" under the property column.
2. Click "Add Stream" and select "Web".
3. Enter your website URL and name, then click "Create Stream".
4. You'll see a Measurement ID (starts with "G-"). This is what you need for the app.

### 3. Configure Your Application

1. Open the `.env.local` file in the root of your project.
2. Update the `NEXT_PUBLIC_GA_MEASUREMENT_ID` variable with your Measurement ID:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX  # Replace with your actual Measurement ID
   ```
3. Save the file.
4. If you're using a deployment platform like Vercel, make sure to add this environment variable in your project settings.

### 4. Verify the Installation

1. Deploy your application with the updated environment variable.
2. Visit your website and perform some actions.
3. Go to your Google Analytics account and navigate to "Realtime" reports.
4. You should see your activity appearing in the reports within a few minutes.

## Tracking Custom Events

The application is set up to track page views automatically. If you want to track custom events (like button clicks or form submissions), you can use the `event` function from the GoogleAnalytics component:

```typescript
import { event } from '../components/GoogleAnalytics';

// Inside your component
const handleButtonClick = () => {
  event({
    action: 'click',
    category: 'button',
    label: 'calculate_button',
    value: 1
  });
  
  // Rest of your handler
};
```

## Privacy Considerations

1. Make sure your website has a privacy policy that discloses the use of Google Analytics.
2. Consider implementing a cookie consent banner if your website serves users from regions with strict privacy laws (like the EU with GDPR).

## Further Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [Next.js Script Component Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/scripts) 