# Postman Collection

This directory contains the Postman collection for the Amplia Village Backend API.

## How to use

1.  **Import**: Import the `amplia-village-postman-collection.json` file into your Postman app.
2.  **Environment Variables**: The collection uses the following collection variables:
    *   `{{base_url}}`: The base URL of your backend (default: `http://localhost:5000`).
    *   `{{token}}`: Your JWT authentication token (obtained from Signin).
    *   `{{user_id}}`: The ID of the current user.
    *   `{{booking_id}}`: The ID of a specific booking.
3.  **Authentication**: Most protected routes use the `{{token}}` variable in the Authorization header (Bearer token).

## Key Enpoints

*   **Auth**: Signup, Signin, OTP verification.
*   **Booking**: Create and fetch tax bookings.
*   **File**: Upload documents and link files from the vault by year.
*   **Admin**: Dashboard stats and user management.
