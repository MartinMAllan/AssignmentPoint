## Core Purpose

A multi-role platform that connects **customers** who need writing services with **writers** who complete orders, managed by **administrators**, **editors**, **managers**, and **sales agents**.

## Key Features

### User Roles & Dashboards

- **Customers**: Post orders, deposit funds to wallet, track order progress, request revisions
- **Writers**: Browse available orders, place bids, accept assignments, submit completed work, earn money
- **Sales Agents**: Manage customer relationships, track their referred customers' orders
- **Editors**: Review and manage order quality
- **Managers**: Oversee operations and team performance
- **Admins**: Full system control including user management, analytics, revenue tracking, dispute resolution

### Order Management

- Customers create orders with title, description, academic level, deadline, pages, price
- Orders go through statuses: AVAILABLE, BIDDING, IN_PROGRESS, SUBMITTED, REVISION, COMPLETED, CANCELLED, DISPUTED
- Writers bid on available orders; customers or admins can accept bids
- File upload/download for order materials and submissions

### Payment System

- Wallet-based system with Stripe integration for deposits
- Writers have earnings balance and pending balance
- Transaction tracking for all financial movements
- Refund request handling

### Messaging

- In-app messaging between users related to orders
- Conversation threads per order

### Admin Features

- Analytics dashboard with revenue charts, order distribution, user growth
- User management (CRUD operations, role changes)
- Revenue management and reporting
- Dispute resolution system
- System settings configuration

## Tech Stack

- **Frontend**: Next.js 16 with React, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Spring Boot (Java) with JPA/Hibernate, JWT authentication
- **Database**: PostgreSQL with comprehensive schema for users, orders, bids, transactions, messages
