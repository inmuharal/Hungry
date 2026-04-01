const { User } = require("../models/index");
const bcrypt = require("bcryptjs");

class AuthController {
    // GET /login
    static loginPage(req, res) {
        const error = req.session.error || null;
        req.session.error = null;
        res.render("login", { error });
    }

    // POST /login
    static async loginProcess(req, res) {
        try {
            const { email, password } = req.body;

            // Cari user berdasarkan email
            const user = await User.findOne({ where: { email } });

            if (!user) {
                req.session.error = "Email atau password salah";
                return res.redirect("/login");
            }

            // Bandingkan password dengan hash
            const isMatch = bcrypt.compareSync(password, user.password);

            if (!isMatch) {
                req.session.error = "Email atau password salah";
                return res.redirect("/login");
            }

            // Simpan data ke session
            req.session.userId = user.id;
            req.session.userName = user.name;
            req.session.userRole = user.role;

            res.redirect("/gobite");
        } catch (error) {
            console.error(error);
            req.session.error = "Terjadi kesalahan, coba lagi";
            res.redirect("/login");
        }
    }

    // GET /register
    static registerPage(req, res) {
        const error = req.session.error || null;
        req.session.error = null;
        res.render("register", { error });
    }

    // POST /register
    static async registerProcess(req, res) {
        try {
            const { name, email, password, role } = req.body;

            // Hash password sebelum disimpan
            const hashedPassword = bcrypt.hashSync(password, 10);

            await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || "user",
            });

            res.redirect("/login");
        } catch (error) {
            console.error(error);
            req.session.error = "Registrasi gagal: Email sudah digunakan atau data tidak valid";
            res.redirect("/register");
        }
    }

    // GET /logout
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) console.error(err);
            res.redirect("/login");
        });
    }
}

module.exports = AuthController;
