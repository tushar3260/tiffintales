// Routes (adminRoutes.js)
router.get("/admin/users", getAllUsers);
router.get("/admin/chefs", getAllChefs);
router.get("/admin/orders", getAllOrders);

// Controllers
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const getAllChefs = async (req, res) => {
  const chefs = await Chef.find().select("-password");
  res.json(chefs);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};
