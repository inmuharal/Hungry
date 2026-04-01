const { Driver, Menu, Order, OrderMenu, User, UserProfile } = require('../models/index');
const { buildNotification, formatDate } = require('../helpers/currencyHelper');

class Controller {

    // ============================================================
    // LANDING PAGE — publik, tampilkan menu terbaru (limit 6)
    // ============================================================
    static async landingPage(req, res) {
        try {
            const data = await Menu.findAll({
                limit: 6,
                order: [['createdAt', 'DESC']]
            });
            res.render('landingPage', { data });
        } catch (error) {
            console.error(error);
            res.send('Error: ' + error.message);
        }
    }

    // ============================================================
    // DASHBOARD — eager loading: Orders + Menu + Driver + User
    // Menampilkan data dari 2+ tabel dalam 1 halaman
    // ============================================================
    static async dashboard(req, res) {
        // Ambil flash notification dari session
        const notification = req.session.notification || null;
        req.session.notification = null;

        // PROMISE CHAINING — ambil Orders & Menu secara berurutan
        Order.findAll({
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: Driver, attributes: ['name', 'phoneNumber'] },
                {
                    model: Menu,
                    through: { attributes: [] }, // sembunyikan kolom junction
                    attributes: ['id', 'menu', 'price', 'imageUrl']
                }
            ],
            order: [['createdAt', 'DESC']]
        })
            .then(orders => {
                return Menu.findAll({ order: [['menu', 'ASC']] })
                    .then(menus => ({ orders, menus }));
            })
            .then(({ orders, menus }) => {
                // Gunakan instance method pada setiap menu
                const menusWithFormat = menus.map(m => ({
                    ...m.toJSON(),
                    formattedPrice: m.formatPrice()
                }));
                const userName = req.session.userName || 'User';
                res.render('dashboard', { orders, menus: menusWithFormat, notification, formatDate, userName });
            })
            .catch(error => {
                console.error(error);
                res.send('Error: ' + error.message);
            });
    }

    // ============================================================
    // MENU LIST — search + sort, dengan CRUD actions
    // ============================================================
    static async menuList(req, res) {
        try {
            const { search = '', sortBy = 'createdAt', sortDir = 'DESC' } = req.query;
            const notification = req.session.notification || null;
            req.session.notification = null;

            // Gunakan static method dari model (search + sort sekaligus)
            const menus = await Menu.searchAndSort(search, sortBy, sortDir);

            // Gunakan instance method pada setiap result
            const menuData = menus.map(m => ({
                ...m.toJSON(),
                formattedPrice: m.formatPrice(),
                shortSummary: m.summary()
            }));

            res.render('menuList', {
                menus: menuData,
                search,
                sortBy,
                sortDir,
                notification
            });
        } catch (error) {
            console.error(error);
            res.send('Error: ' + error.message);
        }
    }

    // ============================================================
    // ADD MENU — GET form
    // ============================================================
    static addMenuPage(req, res) {
        const error = req.session.formError || null;
        req.session.formError = null;
        res.render('menuForm', { menu: null, error, action: 'add' });
    }

    // ============================================================
    // ADD MENU — POST (CRUD: Create) + promise chaining
    // ============================================================
    static async addMenuProcess(req, res) {
        const { menu, price, description, imageUrl } = req.body;

        Menu.create({ menu, price: parseInt(price), description, imageUrl })
            .then(newMenu => {
                // Promise chaining: simpan notifikasi lalu redirect
                req.session.notification = buildNotification('create', newMenu.menu);
                return Promise.resolve();
            })
            .then(() => {
                res.redirect('/menu');
            })
            .catch(error => {
                // Kumpulkan semua pesan validasi
                const messages = error.errors
                    ? error.errors.map(e => e.message).join(', ')
                    : error.message;
                req.session.formError = messages;
                res.redirect('/menu/add');
            });
    }

    // ============================================================
    // EDIT MENU — GET form (CRUD: Read for edit)
    // ============================================================
    static async editMenuPage(req, res) {
        try {
            const menu = await Menu.findByPk(req.params.id);
            if (!menu) return res.redirect('/menu');
            const error = req.session.formError || null;
            req.session.formError = null;
            res.render('menuForm', { menu, error, action: 'edit' });
        } catch (error) {
            console.error(error);
            res.redirect('/menu');
        }
    }

    // ============================================================
    // EDIT MENU — POST (CRUD: Update) + promise chaining
    // ============================================================
    static async editMenuProcess(req, res) {
        const { menu, price, description, imageUrl } = req.body;
        const { id } = req.params;

        Menu.findByPk(id)
            .then(existing => {
                if (!existing) throw new Error('Menu tidak ditemukan');
                return existing.update({ menu, price: parseInt(price), description, imageUrl });
            })
            .then(updated => {
                req.session.notification = buildNotification('update', updated.menu);
                return Promise.resolve();
            })
            .then(() => {
                res.redirect('/menu');
            })
            .catch(error => {
                const messages = error.errors
                    ? error.errors.map(e => e.message).join(', ')
                    : error.message;
                req.session.formError = messages;
                res.redirect(`/menu/edit/${id}`);
            });
    }

    // ============================================================
    // DELETE MENU — POST (CRUD: Delete) + promise chaining
    // ============================================================
    static async deleteMenu(req, res) {
        const { id } = req.params;

        Menu.findByPk(id)
            .then(menu => {
                if (!menu) throw new Error('Menu tidak ditemukan');
                const namaMenu = menu.menu; // simpan sebelum destroy
                return menu.destroy().then(() => namaMenu);
            })
            .then(namaMenu => {
                req.session.notification = buildNotification('delete', namaMenu);
                return Promise.resolve();
            })
            .then(() => {
                res.redirect('/menu');
            })
            .catch(error => {
                req.session.notification = buildNotification('error', error.message);
                res.redirect('/menu');
            });
    }
}

module.exports = Controller;