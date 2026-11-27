/** Production API role checks. Never trust a role supplied by the browser. */
export function canManageAmbassadors(role) {
  return role === "admin" || role === "service";
}
export function canResetPassword(role) {
  return role === "admin";
}
export function matchesScope(scopes, ambassador) {
  if (!Array.isArray(scopes) || !scopes.length) return false;
  return scopes.some(scope =>
    ["country","business_unit","brand","store"].every(field =>
      scope[field] === "*" || scope[field] === ambassador[field]
    )
  );
}
export function mayReadAmbassador(actor, scopes, ambassador) {
  if (actor.role === "admin") return true;
  if (actor.role === "ambassador") return actor.id === ambassador.user_id;
  if (actor.role === "service" || actor.role === "manager") return matchesScope(scopes, ambassador);
  return false;
}
export function mayManageAmbassador(actor, scopes, ambassador) {
  return actor.role === "admin" ||
    (actor.role === "service" && matchesScope(scopes, ambassador));
}
