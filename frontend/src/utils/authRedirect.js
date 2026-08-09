export function getDashboardRoute(role) {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/admin/dashboard";

    case "vendor":
      return "/vendor/dashboard";

    case "buyer":
      return "/buyer/dashboard";

    default:
      return "/login";
  }
}