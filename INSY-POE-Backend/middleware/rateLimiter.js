const { default: rateLimit, ipKeyGenerator } = require("express-rate-limit");

//Site: https://www.npmjs.com/package/express-rate-limit

const limiter = rateLimit({
    windowsMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {message: "Too many attempts from this IP."},
    skipSuccessfulRequests: true,
    keyGenerator: (req) => ipKeyGenerator(req.ip),
});

const emailLimiter = rateLimit({
  windowsMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "You have tried to login from this email too many times." },
  skipSuccessfulRequests: true,
  keyGenerator: (req) => ipKeyGenerator(req.body.email),
  handler: async (req, res) => {
    bannedEmails[req.body.email] = Date.now() + 15 * 60 * 1000;

    try {
      await FailedLogin.create({
        email: req.body.email.toLowerCase(),
        ip: req.ip,
        reason: "Blocked by rate limiter"
      });
      console.warn(`[RateLimiter] Blocked Email: ${req.body.email} at ${new Date().toISOString()}`);
    } catch (err) {
      console.error('Failed to log rate limited login attempt:', err);
    }

    res.status(429).json({
      error: "Too many attempts have been made using this email"
    });
  }
});

const loginLimiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  message: { message: "Too many login attempts. Try again after 15 mins." },
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req, res) => ipKeyGenerator(req.ip),
  handler: async (req, res) => {
    bannedIPs[req.ip] = Date.now() + 15 * 60 * 1000;

    // Log failed login due to rate limit block once
    try {
      await FailedLogin.create({
        email: req.body.email ? req.body.email.toLowerCase() : 'unknown',
        ip: req.ip,
        reason: "Blocked by rate limiter"
      });
      console.warn(`[RateLimiter] Blocked IP: ${req.ip}, Email: ${req.body.email} at ${new Date().toISOString()}`);
    } catch (err) {
      console.error('Failed to log rate limited login attempt:', err);
    }

    res.status(429).json({
      error: "Too many login attempts"
    });
  }
});

const registerLimiter = rateLimit({
    windowsMs: 10* 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    message: {message: "Too many registrations."},
    keyGenerator: (req, _res) => ipKeyGenerator(req.ip),
    // ipv6Subnet: 56
    
});

//Site: https://stackoverflow.com/questions/61563026/how-to-increase-the-blocking-time-period-after-being-rate-limited-using-express

const bannedIPs = {};
const bannedEmails = {};

const banner = function(req, res, next) {
  // If the current Date is still before than the unblocking date, 
  // send a 429 message indicating too many requests
  if (bannedIPs[req.ip] >= +new Date()) {
    res.status(429).send("Sorry, too many requests: " + new Date(bannedIPs[req.ip]));
  } else {
    next();
  }
}

const bannerEmail = function(req,res,next){
    if(bannedEmails[req.body.email] >= +new Date()){
        res.status(429).send("Too many attempts with this email have been made.")
    }else{
        next();
    }
}


module.exports = {banner, bannerEmail,loginLimiter, registerLimiter, limiter, emailLimiter};