// ✅ Load environment variables
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const config = require("./config"); // ✅ Import configuration
const {
    mongoose,
    Booking,
    User,
    Notification
} = require("./database"); // All models from database.js

// ✅ Input sanitization function
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, ''); // Remove potential HTML tags
}

const app = express();
const PORT = config.PORT;

// ✅ Configure CORS with environment variables
app.use(cors({
    origin: config.getCorsOrigins(),
    credentials: true
}));
app.use(express.json());

/* ✅ VERIFY TICKET (For QR Code Scanner) */
app.get("/verify-ticket", async (req, res) => {
    const { ticketId } = req.query;
    if (!ticketId) {
        // If no ticketId provided, serve the verification page
        return res.send(`
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Ticket - Pilgrimage Booking</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                </head>
                <body>
                    <div class="container mt-5">
                        <h2>Ticket Verification</h2>
                        <p>Please scan a valid QR code to verify a ticket.</p>
                    </div>
                </body>
            </html>
        `);
    }

    try {
        const booking = await Booking.findOne({ ticketId: ticketId.trim() });
        if (!booking) {
            return res.send(`
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Ticket Not Found - Pilgrimage Booking</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    </head>
                    <body style="background: #f5f5f5;">
                        <div class="container mt-5">
                            <div class="card shadow">
                                <div class="card-body text-center p-5">
                                    <i class="fas fa-times-circle text-danger" style="font-size: 4rem;"></i>
                                    <h2 class="mt-4">Ticket Not Found</h2>
                                    <p class="text-muted">The ticket ID "${ticketId}" does not exist in our system.</p>
                                    <a href="/verify-ticket" class="btn btn-primary">Try Another Ticket</a>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>
            `);
        }

        // Ticket is valid - display details
        const statusColor = booking.status === 'Approved' ? 'success' : booking.status === 'Pending' ? 'warning' : 'danger';
        const statusIcon = booking.status === 'Approved' ? 'fa-check-circle' : booking.status === 'Pending' ? 'fa-clock' : 'fa-times-circle';

        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ticket Verified - ${ticketId}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                    .verification-card { background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
                    .status-badge { font-size: 1.1rem; padding: 10px 20px; border-radius: 50px; }
                    .info-row { padding: 15px 0; border-bottom: 1px solid #e9ecef; }
                    .info-row:last-child { border-bottom: none; }
                </style>
            </head>
            <body>
                <div class="container py-5">
                    <div class="verification-card mx-auto" style="max-width: 700px;">
                        <div class="card-header bg-${statusColor} text-white text-center py-4">
                            <i class="fas ${statusIcon} fa-3x mb-3"></i>
                            <h2 class="mb-0">Ticket Verified</h2>
                        </div>
                        <div class="card-body p-4">
                            <div class="info-row">
                                <strong><i class="fas fa-ticket-alt text-primary"></i> Ticket ID:</strong>
                                <span class="float-end font-monospace">${booking.ticketId}</span>
                            </div>
                            <div class="info-row">
                                <strong><i class="fas fa-user text-primary"></i> Name:</strong>
                                <span class="float-end">${booking.name}</span>
                            </div>
                            <div class="info-row">
                                <strong><i class="fas fa-mobile-alt text-primary"></i> Mobile:</strong>
                                <span class="float-end">${booking.mobile}</span>
                            </div>
                            <div class="info-row">
                                <strong><i class="fas fa-envelope text-primary"></i> Email:</strong>
                                <span class="float-end">${booking.email}</span>
                            </div>
                            <div class="info-row">
                                <strong><i class="fas fa-id-card text-primary"></i> Aadhaar:</strong>
                                <span class="float-end">XXXX XXXX ${booking.aadhaar.slice(-4)}</span>
                            </div>
                            <div class="info-row">
                                <strong><i class="fas fa-torii-gate text-primary"></i> Temple:</strong>
                                <span class="float-end">${booking.temple}</span>
                            </div>
                            <div class="info-row">
                                <strong><i class="fas fa-calendar text-primary"></i> Date:</strong>
                                <span class="float-end">${booking.date}</span>
                            </div>
                            <div class="info-row">
                                <strong><i class="fas fa-clock text-primary"></i> Time:</strong>
                                <span class="float-end">${booking.time}</span>
                            </div>
                            <div class="text-center mt-4">
                                <span class="badge bg-${statusColor} status-badge">
                                    <i class="fas ${statusIcon}"></i> Status: ${booking.status}
                                </span>
                            </div>
                        </div>
                        <div class="card-footer text-center bg-light">
                            <small class="text-muted">
                                <i class="fas fa-shield-alt text-success"></i> Verified by Pilgrimage Booking System
                            </small>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("❌ Error verifying ticket:", error);
        return res.send(`
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Verification Error</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container mt-5">
                        <div class="alert alert-danger">
                            <h4>Verification Error</h4>
                            <p>An error occurred while verifying the ticket. Please try again.</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
    }
});

/* ✅ FETCH A BOOKING BY TICKET ID */
app.get("/api/getBooking", async (req, res) => {
    const { ticketId } = req.query;
    if (!ticketId) return res.status(400).json({ success: false, message: "Ticket ID is required" });

    try {
        const booking = await Booking.findOne({ ticketId: ticketId.trim() });
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });

        res.json({ success: true, booking });
    } catch (error) {
        console.error("❌ Error fetching booking:", error);
        res.status(500).json({ success: false, message: "Error retrieving booking" });
    }
});

/* ✅ CREATE A NEW BOOKING */
app.post("/book", async (req, res) => {
    console.log("📩 Received Booking Data:", req.body);

    const { temple, date, time, name, mobile, email, aadhaar } = req.body;
    
    // ✅ Sanitize inputs
    const sanitizedData = {
        temple: sanitizeInput(temple),
        date: sanitizeInput(date),
        time: sanitizeInput(time),
        name: sanitizeInput(name),
        mobile: sanitizeInput(mobile),
        email: sanitizeInput(email),
        aadhaar: sanitizeInput(aadhaar)
    };
    
    if (!sanitizedData.temple || !sanitizedData.date || !sanitizedData.time || !sanitizedData.name || !sanitizedData.mobile || !sanitizedData.email || !sanitizedData.aadhaar) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        let ticketId, isUnique = false;

        while (!isUnique) {
            ticketId = "TICKET-" + Math.random().toString(36).substring(2, 11).toUpperCase();
            const existingBooking = await Booking.findOne({ ticketId });
            if (!existingBooking) isUnique = true;
        }

        const transactionId = "TXN-" + ticketId.slice(-6);

        const newBooking = new Booking({
            temple: sanitizedData.temple,
            date: sanitizedData.date,
            time: sanitizedData.time,
            name: sanitizedData.name,
            mobile: sanitizedData.mobile,
            email: sanitizedData.email,
            aadhaar: sanitizedData.aadhaar,
            ticketId,
            transactionId,
            status: "Pending"
        });        

        const savedBooking = await newBooking.save();
        console.log("✅ Booking Saved:", savedBooking);
        
        // ✅ Create notification INSIDE try block
        await Notification.create({
            userEmail: sanitizedData.email,
            message: `Booking created successfully for ${sanitizedData.temple} on ${sanitizedData.date} at ${sanitizedData.time}.`,
            type: "success"
        });
        
        res.json({ success: true, booking: savedBooking });
    } catch (err) {
        console.error("❌ Error saving booking:", err);
        res.status(500).json({ success: false, message: "Booking failed" });
    }
});

/* ✅ FETCH DASHBOARD STATISTICS */
app.get("/admin/stats", async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: "Pending" });
        const cancelledBookings = await Booking.countDocuments({ status: "Cancelled" });
        const today = new Date().toISOString().split("T")[0];
        const todaysBookings = await Booking.countDocuments({ date: today });

        res.json({ success: true, totalBookings, pendingBookings, cancelledBookings, todaysBookings });
    } catch (error) {
        console.error("❌ Error fetching stats:", error);
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
});

/* ✅ FETCH ALL BOOKINGS FOR ADMIN */
app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find({});
        res.json({ success: true, bookings });
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve bookings" });
    }
});

// Update Fubction
app.put("/api/updateBooking", async (req, res) => {
    const { ticketId, status } = req.body;

    console.log("🔄 Received Update Request:", req.body);

    if (!ticketId || !status) {
        console.error("⚠️ Error: Missing ticketId or status in request.");
        return res.status(400).json({ success: false, message: "Ticket ID and status are required" });
    }

    try {
        const updatedBooking = await Booking.findOneAndUpdate(
            { ticketId: ticketId.trim() },
            { $set: { status: status } },
            { new: true }
        );

        if (!updatedBooking) {
            console.error("⚠️ Error: Booking not found for Ticket ID:", ticketId);
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        console.log("✅ Booking updated successfully:", updatedBooking);

        // ✅ Create a dynamic notification
        await Notification.create({
            userEmail: updatedBooking.email,
            message: `Your booking ${updatedBooking.ticketId} has been marked as "${updatedBooking.status}".`,
            type: updatedBooking.status === "Approved" ? "success" :
                  updatedBooking.status === "Cancelled" ? "warning" : "info"
        });

        res.json({ success: true, message: "Booking status updated", booking: updatedBooking });

    } catch (error) {
        console.error("❌ Error updating booking:", error);
        res.status(500).json({ success: false, message: "Failed to update booking" });
    }
});


/* ✅ DELETE A BOOKING */
app.delete("/api/deleteBooking", async (req, res) => {
    const { ticketId } = req.query;
    if (!ticketId) return res.status(400).json({ success: false, message: "Ticket ID is required" });

    try {
        const deletedBooking = await Booking.findOneAndDelete({ ticketId });
        if (!deletedBooking) return res.status(404).json({ success: false, message: "Booking not found" });

        res.json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting booking:", error);
        res.status(500).json({ success: false, message: "Failed to delete booking" });
    }
});

app.delete("/api/clearBookings", async (req, res) => {
    try {
        await Booking.deleteMany({}); // Remove all documents in the collection
        res.json({ success: true, message: "All bookings have been deleted" });
    } catch (error) {
        console.error("❌ Error deleting all bookings:", error);
        res.status(500).json({ success: false, message: "Failed to delete bookings" });
    }
});

app.get("/api/bookings", async (req, res) => {
    try {
        const { search, status, startDate, endDate } = req.query;
        let filter = {};

        if (search) {
            const searchRegex = new RegExp(search, "i");
            filter.$or = [
                { ticketId: searchRegex },
                { name: searchRegex },
                { mobile: searchRegex }
            ];
        }

        if (status) filter.status = status;
        if (startDate && endDate) {
            filter.date = { $gte: startDate, $lte: endDate };
        }

        const bookings = await Booking.find(filter);
        res.json({ success: true, bookings });
    } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve bookings" });
    }
});


// app.get("/api/bookings", async (req, res) => {
//     try {
//         let query = {};
        
//         if (req.query.status) query.status = req.query.status;
//         if (req.query.startDate && req.query.endDate) {
//             query.date = { $gte: req.query.startDate, $lte: req.query.endDate };
//         }

//         const bookings = await Booking.find(query);
//         res.json({ success: true, bookings });
//     } catch (error) {
//         console.error("❌ Error fetching bookings:", error);
//         res.status(500).json({ success: false, message: "Failed to retrieve bookings" });
//     }
// });



/* ✅ USER REGISTRATION */
app.post("/api/register", async (req, res) => {
    console.log("📩 Received registration:", req.body);
    const { username, email, mobile, password } = req.body;
  
    if (!username || !email || !mobile || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(409).json({ success: false, message: "Username or Email already exists" });
      }
  
      // ✅ Hash password before saving
      const saltRounds = config.BCRYPT_SALT_ROUNDS;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const newUser = new User({ username, email, mobile, password: hashedPassword });
      await newUser.save();
  
      res.json({ success: true, message: "User registered successfully" });
    } catch (err) {
      console.error("❌ Registration error:", err);
      res.status(500).json({ success: false, message: "Registration failed" });
    }
  });  

/* ✅ USER LOGIN (Email or Username) */
app.post("/api/login", async (req, res) => {
    const { identifier, password } = req.body; // identifier = email or username

    if (!identifier || !password) {
        return res.status(400).json({ success: false, message: "Username/Email and password are required" });
    }

    try {
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // ✅ Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                username: user.username,
                email: user.email,
                mobile: user.mobile || ""
            }
        });

    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ success: false, message: "Login failed" });
    }
});

// ✅ Get bookings for a specific user
app.get("/api/user-bookings", async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const userBookings = await Booking.find({ email });
        res.json({ success: true, bookings: userBookings });
    } catch (error) {
        console.error("❌ Error fetching user bookings:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve bookings" });
    }
});

// GET /api/bookings/user/:email
app.get('/api/bookings/user/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const bookings = await Booking.find({ email });
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ CANCEL BOOKING AND SEND NOTIFICATION
// app.put('/api/:id/cancel', async (req, res) => {
//   const bookingId = req.params.id;
//   const deleted = await Booking.findByIdAndDelete(bookingId);
//   if (!deleted) {
//     return res.status(404).json({ success: false, message: "Booking not found" });
//   }

//   // Send user and admin notifications
//   await Notification.create({
//     userEmail: updatedBooking.email,
//     message: `Your booking ${updatedBooking.ticketId} has been cancelled.`,
//     type: "warning"
//   });

//   await Notification.create({
//     userEmail: "admin@pilgrimage.com",
//     message: `User ${updatedBooking.email} cancelled booking ${updatedBooking.ticketId}.`,
//     type: "info"
//   });

//   res.json({ success: true, message: "Booking deleted" });
// });

app.put('/api/:id/cancel', async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Step 1: Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Step 2: Send notifications (user + admin)
    await Notification.create({
      userEmail: booking.email,
      message: `Your booking ${booking.ticketId} has been cancelled.`,
      type: "warning"
    });

    await Notification.create({
      userEmail: config.NOTIFICATION_ADMIN_EMAIL,
      message: `User ${booking.email} cancelled booking ${booking.ticketId}.`,
      type: "info"
    });

    // Step 3: Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    res.json({ success: true, message: "Booking cancelled and deleted successfully." });

  } catch (error) {
    console.error("❌ Error cancelling booking:", error);
    res.status(500).json({ success: false, message: "Failed to cancel booking" });
  }
});


// Get notifications for a user
app.get("/api/notifications", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
  
    try {
      const notifications = await Notification.find({ userEmail: email }).sort({ createdAt: -1 });
      res.json({ success: true, notifications });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
  });
  
  // Optional: Mark notification as read
  app.put("/api/notifications/read/:id", async (req, res) => {
    try {
      const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
      res.json({ success: true, notification: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: "Failed to update notification" });
    }
  });

  app.post("/api/notifications/broadcast", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message required" });
  
    try {
      const users = await User.find({});
      const notifications = users.map(u => ({
        userEmail: u.email,
        message,
        type: "info"
      }));
      await Notification.insertMany(notifications);
      res.json({ success: true, message: "Broadcast sent" });
    } catch (err) {
      console.error("❌ Broadcast error:", err);
      res.status(500).json({ success: false, message: "Broadcast failed" });
    }
  });
  

// Admin Login
  app.post("/api/admin-login", (req, res) => {
    const { username, password } = req.body;

    if (username === config.ADMIN_USERNAME && password === config.ADMIN_PASSWORD) {
        res.json({ success: true, message: "Admin login successful" });
    } else {
        res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }
});

// Send Notification
app.post("/api/notifications/send", async (req, res) => {
    const { userEmail, message, type, broadcast } = req.body;
  
    if (!message || !type) {
      return res.status(400).json({ success: false, message: "Missing message or type" });
    }
  
    try {
      if (broadcast) {
        const users = await User.find({}, "email"); // fetch all user emails
        const notifications = users.map(u => ({
          userEmail: u.email,
          message,
          type,
          createdAt: new Date()
        }));
        await Notification.insertMany(notifications);
        return res.json({ success: true, message: "Broadcast sent to all users" });
      } else {
        if (!userEmail) return res.status(400).json({ success: false, message: "User email required" });
  
        await Notification.create({ userEmail, message, type });
        return res.json({ success: true, message: "Notification sent to user" });
      }
    } catch (error) {
      console.error("❌ Notification send failed:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });

// PUT /notifications/read/:id
app.put('/notifications/read/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Notification.findByIdAndUpdate(id, { read: true });
      res.status(200).json({ message: "Notification marked as read." });
    } catch (err) {
      res.status(500).json({ error: "Error updating notification." });
    }
  });

  // Clear Notification
  app.delete("/api/notifications/clear-all", async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
  
    try {
      await Notification.deleteMany({ userEmail: email });
      res.json({ success: true, message: "All notifications cleared" });
    } catch (err) {
      console.error("❌ Failed to clear all notifications:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  
/* ✅ START SERVER */
// ✅ Check if running on Vercel or locally
if (require.main === module) {
  // Running locally
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
} else {
  // Running on Vercel - export the app
  module.exports = app;
}
