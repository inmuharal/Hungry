/**
 * helpers/currencyHelper.js
 * Utility functions untuk formatting data
 */

// Format angka ke format Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Capitalize setiap kata
function capitalize(str) {
    if (!str) return '';
    return str
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

// Format tanggal ke format Indonesia
function formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Buat pesan notifikasi berdasarkan action
function buildNotification(action, itemName) {
    const messages = {
        create: `✅ Menu "${itemName}" berhasil ditambahkan!`,
        update: `✏️  Menu "${itemName}" berhasil diperbarui!`,
        delete: `🗑️  Menu "${itemName}" berhasil dihapus!`,
        error: `❌ Terjadi kesalahan: ${itemName}`
    };
    return messages[action] || itemName;
}

module.exports = { formatRupiah, capitalize, formatDate, buildNotification };
