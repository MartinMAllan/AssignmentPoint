-- Updated database name from writers_admin to assignment_point
-- Assignment Point Database Schema
-- Created: 2024
-- Description: Complete database schema for Assignment Point academic writing service management system

-- Create database
CREATE DATABASE IF NOT EXISTS assignment_point;
USE assignment_point;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_revenues;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS order_files;
DROP TABLE IF EXISTS order_bids;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS editors;
DROP TABLE IF EXISTS writer_managers;
DROP TABLE IF EXISTS sales_agents;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS writers;
DROP TABLE IF EXISTS revenue_rules;
DROP TABLE IF EXISTS users;
