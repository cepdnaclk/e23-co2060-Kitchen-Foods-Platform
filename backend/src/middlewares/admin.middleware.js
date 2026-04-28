const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access Denied: Admin privileges required." });
  }
};

export default adminOnly;
