// Environment Configuration for Pilgrimage Booking System
// ⚠️ SECURITY: All sensitive values MUST be set via environment variables
// If not set, the server will fail to start, forcing proper configuration

const config = {
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Database Configuration (REQUIRED - No defaults for security)
    MONGODB_URI: process.env.MONGODB_URI,
    
    // API Configuration
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    
    // Security Configuration
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    JWT_SECRET: process.env.JWT_SECRET, // REQUIRED - No default for security
    
    // Admin Configuration (REQUIRED - No defaults for security)
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    
    // Email Configuration (for future use)
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    
    // Notification Configuration
    NOTIFICATION_ADMIN_EMAIL: process.env.NOTIFICATION_ADMIN_EMAIL || 'admin@pilgrimage.com',
    
    // CORS Configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,http://127.0.0.1:3000',
    
    // Helper function to get CORS origins as array
    getCorsOrigins: function() {
        // If CORS_ORIGIN contains * or is just *, allow all origins
        if (this.CORS_ORIGIN.includes('*')) {
            return '*';
        }
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

// ✅ Validate required environment variables
function validateConfig() {
    const required = [
        { key: 'MONGODB_URI', value: config.MONGODB_URI },
        { key: 'JWT_SECRET', value: config.JWT_SECRET },
        { key: 'ADMIN_USERNAME', value: config.ADMIN_USERNAME },
        { key: 'ADMIN_PASSWORD', value: config.ADMIN_PASSWORD }
    ];

    const missing = required.filter(item => !item.value);

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(item => console.error(`   - ${item.key}`));
        console.error('\n⚠️  Please set these variables in your .env file or Vercel environment variables.');
        console.error('🚀 Server cannot start without these required credentials.\n');
        process.exit(1);
    }

    console.log('✅ All required environment variables are set.');
}

// Only validate in production or when explicitly enabled
if (config.NODE_ENV === 'production' || process.env.VALIDATE_ENV === 'true') {
    validateConfig();
}

module.exports = config;
