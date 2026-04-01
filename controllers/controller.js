const { Driver, Menu, Order, OrderMenu, User, UserProfile, sequelize } = require("../models");
const { formatRupiah } = require("../helpers/format");
const { normalizeRole } = require("../helpers/role");

class Controller {
  static async landingPage(req, res) {
    try {
      const data = await Menu.findAll({
        limit: 6,
        order: [["createdAt", "DESC"]],
      });
      res.render("landingPage", { data });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async showRegister(req, res) {
    try {
      const errors = req.query.errors ? req.query.errors.split(",") : [];
      res.render("register", { errors });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const user = await User.create({ name, email, password, role });
      await UserProfile.create({
        name,
        email,
        password,
        phoneNumber: "08xxxxxxxxxx",
        userId: user.id,
      });

      res.redirect("/login?success=Register success, please login");
    } catch (error) {
      if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        const errors = error.errors.map((el) => el.message).join(",");
        return res.redirect(`/register?errors=${errors}`);
      }
      res.send(error.message);
    }
  }

  static async showLogin(req, res) {
    try {
      const error = req.query.error || null;
      const success = req.query.success || null;
      res.render("login", { error, success });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);

      if (!user || !user.checkPassword(password)) {
        return res.redirect("/login?error=Invalid email or password");
      }

      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.role = normalizeRole(user.role);

      res.redirect("/menus");
    } catch (error) {
      res.send(error.message);
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy(() => {
        res.redirect("/login?success=You have logged out");
      });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async menus(req, res) {
    try {
      const { search, sort } = req.query;
      const [data, drivers] = await Promise.all([
        Menu.findAllWithFilter({ search, sort }),
        Driver.findAll({ order: [["name", "ASC"]] }),
      ]);
      res.render("menus", { data, drivers, formatRupiah, search, sort, error: req.query.error || null });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async showAddMenu(req, res) {
    try {
      const errors = req.query.errors ? req.query.errors.split(",") : [];
      res.render("menuForm", { menu: null, errors, action: "/menus/add", title: "Add Menu" });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async addMenu(req, res) {
    try {
      const { menu, price, description, imageUrl } = req.body;
      await Menu.create({ menu, price, description, imageUrl });
      res.redirect("/menus");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message).join(",");
        return res.redirect(`/menus/add?errors=${errors}`);
      }
      res.send(error.message);
    }
  }

  static async showEditMenu(req, res) {
    try {
      const { id } = req.params;
      const menu = await Menu.findByPk(id);
      if (!menu) return res.send("Menu not found");
      const errors = req.query.errors ? req.query.errors.split(",") : [];
      res.render("menuForm", { menu, errors, action: `/menus/${id}/edit`, title: "Edit Menu" });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async editMenu(req, res) {
    try {
      const { id } = req.params;
      const { menu, price, description, imageUrl } = req.body;
      const data = await Menu.findByPk(id);
      if (!data) return res.send("Menu not found");
      await data.update({ menu, price, description, imageUrl });
      res.redirect("/menus");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message).join(",");
        return res.redirect(`/menus/${req.params.id}/edit?errors=${errors}`);
      }
      res.send(error.message);
    }
  }

  static async deleteMenu(req, res) {
    try {
      const { id } = req.params;
      await Menu.destroy({ where: { id } });
      res.redirect("/menus");
    } catch (error) {
      res.send(error.message);
    }
  }

  static async orders(req, res) {
    try {
      const where = {};
      if (normalizeRole(req.session.role) === "pembeli") {
        where.UserId = req.session.userId;
      }

      const { driverId, menuId } = req.query;
      if (driverId) where.DriverId = driverId;

      const menuInclude = {
        model: Menu,
        required: true,
      };
      if (menuId) {
        menuInclude.where = { id: menuId };
      }

      const [data, drivers, menus] = await Promise.all([
        Order.findAll({
          where,
          include: [User, Driver, menuInclude],
          order: [["createdAt", "DESC"]],
        }),
        Driver.findAll({ order: [["name", "ASC"]] }),
        Menu.findAll({ order: [["menu", "ASC"]] }),
      ]);

      const rawMessage = req.query.message || null;
      const message = rawMessage === "Order" ? "Pesanan berhasil dihapus" : rawMessage;

      res.render("orders", {
        data,
        message,
        error: req.query.error || null,
        formatRupiah,
        drivers,
        menus,
        filterDriverId: driverId || "",
        filterMenuId: menuId || "",
      });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async showAddOrder(req, res) {
    try {
      if (normalizeRole(req.session.role) === "penjual") {
        return res.redirect("/menus?error=Penjual tidak bisa membuat order");
      }

      const { menuId } = req.query;
      const preselectedMenuIds = Array.isArray(menuId)
        ? menuId.map(String)
        : menuId
          ? [String(menuId)]
          : [];
      const [drivers, menus] = await Promise.all([
        Driver.findAll({ order: [["name", "ASC"]] }),
        Menu.findAll({ order: [["menu", "ASC"]] }),
      ]);
      const errors = req.query.errors ? req.query.errors.split(",") : [];
      const oldInput = {
        name: req.query.name || "",
        address: req.query.address || "",
        DriverId: req.query.DriverId || "",
        price: req.query.price || "",
      };
      res.render("orderForm", { drivers, menus, errors, preselectedMenuIds, oldInput });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async addOrder(req, res) {
    let transaction;
    try {
      if (normalizeRole(req.session.role) === "penjual") {
        return res.redirect("/menus?error=Penjual tidak bisa membuat order");
      }

      const { name, address, DriverId, menuIds, price } = req.body;
      const UserId = req.session.userId;

      const selectedMenuIds = Array.isArray(menuIds) ? menuIds : menuIds ? [menuIds] : [];
      const normalizedMenuIds = [...new Set(selectedMenuIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0))];
      const errors = [];
      if (!name || !name.trim()) errors.push("Order name is required");
      if (!address || !address.trim()) errors.push("Address is required");
      const addressLength = (address || "").trim().length;
      if (address && (addressLength < 15 || addressLength > 255)) {
        errors.push("Address must be between 15 and 255 characters");
      }
      if (!DriverId) errors.push("Driver is required");
      if (!normalizedMenuIds.length) errors.push("Choose at least one valid menu");
      const parsedPrice = price ? Number(price) : null;
      if (price && (!Number.isInteger(parsedPrice) || parsedPrice < 1000)) {
        errors.push("Price minimum is 1000");
      }

      if (errors.length) {
        const q = new URLSearchParams({
          errors: errors.join(","),
          name: name || "",
          address: address || "",
          DriverId: DriverId || "",
          price: price || "",
        });
        selectedMenuIds.forEach((id) => q.append("menuId", String(id)));
        return res.redirect(`/orders/add?${q.toString()}`);
      }

      transaction = await sequelize.transaction();

      const existingMenus = await Menu.count({
        where: { id: normalizedMenuIds },
        transaction,
      });
      if (existingMenus !== normalizedMenuIds.length) {
        throw new Error("One or more selected menus are invalid");
      }

      const createdOrder = await Order.create(
        { name, address, UserId, DriverId, price: parsedPrice },
        { transaction }
      );
      const payload = normalizedMenuIds.map((menuId) => ({
        OrderId: createdOrder.id,
        MenuId: menuId,
      }));
      const createdOrderMenus = await OrderMenu.bulkCreate(payload, { transaction });
      if (!createdOrderMenus.length) {
        throw new Error("Choose at least one valid menu");
      }
      await transaction.commit();

      res.redirect("/orders");
    } catch (error) {
      if (transaction) await transaction.rollback();

      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((el) => el.message).join(",");
        return res.redirect(`/orders/add?errors=${errors}`);
      }
      return res.redirect(`/orders/add?errors=${encodeURIComponent(error.message)}`);
    }
  }

  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) throw new Error("Order not found");
      await order.destroy();
      res.redirect(`/orders?message=${encodeURIComponent("Pesanan berhasil dihapus")}`);
    } catch (error) {
      res.send(error.message);
    }
  }

  static async drivers(req, res) {
    try {
      const data = await Driver.findAll({
        include: [
          {
            model: Order,
            include: [
              { model: Menu },
              { model: User },
            ],
          },
        ],
        order: [["name", "ASC"]],
      });
      res.render("drivers", { data, formatRupiah });
    } catch (error) {
      res.send(error.message);
    }
  }


  static async generateInvoice(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [
          { model: User },
          { model: Driver },
          { model: Menu },
        ],
      });

      if (!order) return res.status(404).send("Order not found");

      const lineItems = (order.Menus || []).map((menu) => ({
        name: menu.menu,
        quantity: 1,
        price: Number(menu.price) || 0,
      }));

      const subtotal = order.price
        ? Number(order.price)
        : lineItems.reduce((sum, item) => sum + item.price, 0);

      res.render("invoice", {
        invoiceNumber: `INV-${String(order.id).padStart(5, "0")}`,
        invoiceDate: new Date(order.createdAt).toLocaleDateString("id-ID"),
        order,
        lineItems,
        subtotal,
        formatRupiah,
        seller: {
          name: "Food App",
          address: "Jl. Kuliner No.1, Jakarta",
          phone: "+62 800-FOOD",
          email: "hello@foodapp.id",
        },
      });
    } catch (error) {
      console.error("Invoice generation error:", error);
      res.status(500).send("Failed to load invoice: " + error.message);
    }
  }

}

module.exports = Controller;
