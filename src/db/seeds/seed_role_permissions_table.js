exports.seed = async function (knex) {

  const adminRole = await knex("roles")
    .where({ code: "ADMIN" })
    .first();

  if (!adminRole) {
    throw new Error("ADMIN role not found");
  }

  const permissions = await knex("permissions")
    .select("id");

  const mappings = permissions.map((permission) => ({
    role_id: adminRole.id,
    permission_id: permission.id
  }));

  if (mappings.length) {
    await knex("role_permissions")
      .insert(mappings)
      .onConflict(["role_id", "permission_id"])
      .ignore();
  }
};