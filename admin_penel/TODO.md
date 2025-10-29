# TODO: Implement Admin Panel Protection

- [x] Create ProtectedRoute.jsx component in admin_penel/src/components/
- [x] Update main.jsx to wrap App with BrowserRouter
- [x] Restructure App.jsx to use createBrowserRouter with routes for /login and protected /
- [x] Update AdminLogin.jsx to navigate to '/' after login
- [x] Add logout functionality to Content.jsx Log Out button
- [x] Add admin authentication middleware to order routes in backend
- [x] Update Recent Sales section to display real order data from database
- [x] Add dispatch functionality for pending orders with invoice and tracking link modal
- [x] Add PDF invoice generation and download feature for dispatched orders
- [x] Move dispatched orders to CompletedOrder collection and remove from Order collection
- [x] Add support for uploading invoice files during dispatch
- [x] Add download functionality for uploaded invoice files in Completed Sales
- [x] Test the implementation by running the app (running on http://localhost:5174/)
