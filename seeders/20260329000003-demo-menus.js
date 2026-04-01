'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Menus", [
      {
        menu: "Nasi Goreng Spesial",
        price: 25000,
        description: "Nasi goreng dengan telur, ayam, dan kerupuk",
        imageUrl: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480_1_5x/img/recipe/ras/Assets/ae6d7be8ee924ba32b6175d12b7cfdac/Derivates/0f2747c199915780ff5efcc9fc98ffbc129d8ca4.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        menu: "Mie Ayam Bakso",
        price: 22000,
        description: "Mie ayam dengan topping bakso dan pangsit",
        imageUrl: "https://www.rumahmesin.com/wp-content/uploads/2019/10/mie-ayam-bakso.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        menu: "Sate Ayam Madura",
        price: 30000,
        description: "Daging ayam bakar dengan saus kacang",
        imageUrl: "https://img.youtube.com/vi/R0mDzP0A_DQ/hqdefault.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        menu: "Lemon Tea",
        price: 11000,
        description: "Minuman tea dengan lemon",
        imageUrl: "https://asset.kompas.com/crops/vX_ULbw0h4h-CclfUmCXhfjxwTU=/0x0:880x587/750x500/data/photo/2023/08/16/64dc53ca9f3db.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        menu: "Es Cendol",
        price: 18000,
        description: "Minuman segar cendol dengan santan dan gula merah",
        imageUrl: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2023/07/21041727/3-Resep-Es-Cendol-Kekinian-yang-Mudah-Dibuat-Enak-dan-Segar.jpg.webp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        menu: "Martabak Telur Ayam Biasa",
        price: 25000,
        description: "Martabak telur gurih dengan isian telur dan daging",
        imageUrl: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2023/08/10045023/Martabak-Telur-Teflon-Tanpa-Daging-Camilan-Malam-Lezat-untuk-Keluarga.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Menus", null, {});
  },
};
