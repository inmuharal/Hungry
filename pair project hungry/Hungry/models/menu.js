'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {

    // =============================================
    // ASSOCIATIONS
    // =============================================
    static associate(models) {
      Menu.belongsToMany(models.Order, {
        through: models.OrderMenu,
        foreignKey: 'MenuId',
      });
    }

    // =============================================
    // STATIC METHODS — dipanggil di level class
    // =============================================

    // Search menu by name (case-insensitive)
    static searchByName(keyword) {
      const { Op } = require('sequelize');
      return Menu.findAll({
        where: {
          menu: { [Op.iLike]: `%${keyword}%` }
        }
      });
    }

    // Sort menu by field & direction
    static sortBy(field = 'createdAt', direction = 'ASC') {
      const allowedFields = ['menu', 'price', 'createdAt'];
      const allowedDirs = ['ASC', 'DESC'];
      const safeField = allowedFields.includes(field) ? field : 'createdAt';
      const safeDir = allowedDirs.includes(direction.toUpperCase()) ? direction.toUpperCase() : 'ASC';
      return Menu.findAll({ order: [[safeField, safeDir]] });
    }

    // Search + Sort combined (dipakai di controller via promise chaining)
    static searchAndSort(keyword, sortField, sortDir) {
      const { Op } = require('sequelize');
      const allowedFields = ['menu', 'price', 'createdAt'];
      const allowedDirs = ['ASC', 'DESC'];
      const safeField = allowedFields.includes(sortField) ? sortField : 'createdAt';
      const safeDir = allowedDirs.includes((sortDir || '').toUpperCase()) ? sortDir.toUpperCase() : 'ASC';

      const where = keyword
        ? { menu: { [Op.iLike]: `%${keyword}%` } }
        : {};

      return Menu.findAll({ where, order: [[safeField, safeDir]] });
    }

    // =============================================
    // INSTANCE METHODS — dipanggil dari object
    // =============================================

    // Format harga ke Rupiah
    formatPrice() {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(this.price);
    }

    // Summary singkat untuk notifikasi
    summary() {
      return `[${this.id}] ${this.menu} — ${this.formatPrice()}`;
    }
  }

  // =============================================
  // INIT — kolom + validasi
  // =============================================
  Menu.init(
    {
      menu: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nama menu tidak boleh kosong' },
          notNull: { msg: 'Nama menu wajib diisi' },
          len: {
            args: [2, 100],
            msg: 'Nama menu harus antara 2-100 karakter'
          }
        }
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'Harga wajib diisi' },
          isInt: { msg: 'Harga harus berupa angka' },
          min: {
            args: [1000],
            msg: 'Harga minimal Rp1.000'
          }
        }
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [0, 500],
            msg: 'Deskripsi maksimal 500 karakter'
          }
        }
      },
      imageUrl: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: 'imageUrl harus berupa URL yang valid' }
        }
      }
    },
    {
      sequelize,
      modelName: 'Menu',
      hooks: {
        // =============================================
        // HOOKS
        // =============================================

        // Sebelum simpan: capitalize nama menu
        beforeCreate(menu) {
          if (menu.menu) {
            menu.menu = menu.menu
              .split(' ')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ');
          }
        },

        // Sebelum update: capitalize juga
        beforeUpdate(menu) {
          if (menu.menu) {
            menu.menu = menu.menu
              .split(' ')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ');
          }
        },

        // Setelah create: log notifikasi ke console
        afterCreate(menu) {
          console.log(`✅ [HOOK afterCreate] Menu baru ditambahkan: ${menu.summary()}`);
        },

        // Setelah destroy: log notifikasi ke console
        afterDestroy(menu) {
          console.log(`🗑️  [HOOK afterDestroy] Menu dihapus: ${menu.summary()}`);
        }
      }
    }
  );

  return Menu;
};