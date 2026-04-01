function normalizeRole(role) {
  if (role === "customer") return "pembeli";
  if (role === "admin") return "penjual";
  return role;
}

module.exports = { normalizeRole };
