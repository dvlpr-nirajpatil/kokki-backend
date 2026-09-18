exports.seed = async function (knex) {

  const permissions = [


    {
      name: "View Vendor Applications",
      code: "VENDOR_APPLICATION.VIEW",
      resource: "VENDOR_APPLICATION",
      action: "VIEW"
    },
    {
      name: "Approve Vendor Application",
      code: "VENDOR_APPLICATION.APPROVE",
      resource: "VENDOR_APPLICATION",
      action: "APPROVE"
    },
    {
      name: "Reject Vendor Application",
      code: "VENDOR_APPLICATION.REJECT",
      resource: "VENDOR_APPLICATION",
      action: "REJECT"
    },


    {
      name: "View Vendors",
      code: "VENDOR.VIEW",
      resource: "VENDOR",
      action: "VIEW"
    },
    {
      name: "Update Vendor",
      code: "VENDOR.UPDATE",
      resource: "VENDOR",
      action: "UPDATE"
    },
    {
      name: "Suspend Vendor",
      code: "VENDOR.SUSPEND",
      resource: "VENDOR",
      action: "SUSPEND"
    },


    {
      name: "View Estimate Requests",
      code: "ESTIMATE_REQUEST.VIEW",
      resource: "ESTIMATE_REQUEST",
      action: "VIEW"
    },
    {
      name: "Update Estimate Request",
      code: "ESTIMATE_REQUEST.UPDATE",
      resource: "ESTIMATE_REQUEST",
      action: "UPDATE"
    },


    {
      name: "View Team",
      code: "TEAM.VIEW",
      resource: "TEAM",
      action: "VIEW"
    },
    {
      name: "Create Team Member",
      code: "TEAM.CREATE",
      resource: "TEAM",
      action: "CREATE"
    },
    {
      name: "Update Team Member",
      code: "TEAM.UPDATE",
      resource: "TEAM",
      action: "UPDATE"
    },
    {
      name: "Delete Team Member",
      code: "TEAM.DELETE",
      resource: "TEAM",
      action: "DELETE"
    },


    {
      name: "View Roles",
      code: "ROLE.VIEW",
      resource: "ROLE",
      action: "VIEW"
    },
    {
      name: "Manage Roles",
      code: "ROLE.MANAGE",
      resource: "ROLE",
      action: "MANAGE"
    }
  ];

  for (const permission of permissions) {

    await knex("permissions")
      .insert(permission)
      .onConflict("code")
      .merge({
        name: permission.name,
        resource: permission.resource,
        action: permission.action
      });
  }
};