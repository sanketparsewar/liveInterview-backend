const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "liveinterview_jwt_secret_key_2025";

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    // Auto-create/seed admin if logging in with default admin credentials and user doesn't exist yet
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@liveinterview.app").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!user && normalizedEmail === adminEmail && password === adminPassword) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      user = await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        organization: "LiveInterview",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password (support both bcrypt hash and plain-text fallback)
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password === user.password) {
      isMatch = true;
      // Upgrade plain password to bcrypt hash
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    // Special check if credentials match default admin
    if (!isMatch && normalizedEmail === adminEmail && password === adminPassword) {
      isMatch = true;
      user.password = await bcrypt.hash(adminPassword, 10);
      await user.save();
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const activeOrg = user._activeOrg || user.organization || "LiveInterview";

    const tokenPayload = {
      id: user._id,
      _id: user._id,
      email: user.email,
      name: user.name || "Admin",
      role: user.role || "admin",
      organization: activeOrg,
      _activeOrg: activeOrg,
      activeOrg: activeOrg,
      interviewer: user.name || "Admin",
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: "7d",
    });

    const userResponse = {
      _id: user._id,
      id: user._id,
      email: user.email,
      name: user.name || "Admin",
      role: user.role || "admin",
      organization: activeOrg,
      _activeOrg: activeOrg,
      activeOrg: activeOrg,
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: error.message,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password, name, role, organization } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const orgName = organization || "LiveInterview";
    const newUser = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: name || "Interviewer",
      role: role || "interviewer",
      organization: orgName,
      _activeOrg: orgName,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        organization: newUser.organization,
        _activeOrg: newUser._activeOrg,
        activeOrg: newUser._activeOrg,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration",
      error: error.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};
