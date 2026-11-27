/**
 * SHARE Service360 - frontend route policy.
 *
 * Defense in depth for the existing demo shell only.
 * IMPORTANT: This is NOT authentication, API authorization or database RBAC.
 * The production API must independently verify authenticated identities,
 * per-resource permissions and organisation/store scope on EVERY request.
 */
export const ROLE_ROUTES = Object.freeze({
  ambassador: Object.freeze(["home","performance","service-pulse","communications","feedback","suggestions","manual-transaction","share-wall","training","training-online","training-physical","knowledge","reports","knowledge-check","status"]),
  manager: Object.freeze(["home","team-performance","team-attention","team-service-pulse","training-overview","knowledge-gaps","manager-knowledge","ambassadors","manager-onboarding","manager-acquisition","manager-communications","manager-hub"]),
  service: Object.freeze(["home","group-performance","group-attention","service-pulse","audit","group-training","group-gaps","group-knowledge","group-ambassadors","ambassador-management","group-onboarding","group-acquisition","group-communications","group-hub","group-recognition","group-actions"]),
  admin: Object.freeze(["home","integrations","knowledge-sources","users-access","ambassador-management","roles","identity","frameworks","notifications","engagement-leaderboard","audit-log"])
});
export function canAccessRoute(role, page) {
  return typeof page === "string" &&
    Object.hasOwn(ROLE_ROUTES, role) &&
    ROLE_ROUTES[role].includes(page);
}
