// Environment Configuration for Pilgrimage Booking System
// This file contains default values and can be overridden by environment variables

const config = {
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://rathancoorg11_db_user:i6KensWvAw7mYJHA@pilgrimage-backend-clus.5qvnno4.mongodb.net/pilgrimage_bookings?retryWrites=true&w=majority',
    
    // API Configuration
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    
    // Security Configuration
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
    
    // Admin Configuration
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'Admin@booking.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
    
    // Email Configuration (for future use)
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
    SMTP_USER: process.env.SMTP_USER || 'your_email@gmail.com',
    SMTP_PASS: process.env.SMTP_PASS || 'your_app_password',
    
    // Notification Configuration
    NOTIFICATION_ADMIN_EMAIL: process.env.NOTIFICATION_ADMIN_EMAIL || 'admin@pilgrimage.com',
    
    // CORS Configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,http://127.0.0.1:3000',
    
    // Helper function to get CORS origins as array
    getCorsOrigins: function() {
        return this.CORS_ORIGIN.split(',').map(origin => origin.trim());
    },
    
    // Helper function to check if running in production
    isProduction: function() {
        return this.NODE_ENV === 'production';
    },
    
    // Helper function to check if running in development
    isDevelopment: function() {
        return this.NODE_ENV === 'development';
    }
};

module.exports = config;
