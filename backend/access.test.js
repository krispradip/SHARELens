import test from "node:test";
import assert from "node:assert/strict";
import { canManageAmbassadors,canResetPassword,matchesScope,mayReadAmbassador,mayManageAmbassador } from "./access.js";
const a={user_id:"amb-1",country:"UAE",business_unit:"Entertainment",brand:"VOX",store:"MOE"};
const scope=[{country:"UAE",business_unit:"Entertainment",brand:"*",store:"*"}];
test("only administrators and programme leads can manage Ambassadors",()=>{
  assert.equal(canManageAmbassadors("admin"),true);
  assert.equal(canManageAmbassadors("service"),true);
  assert.equal(canManageAmbassadors("manager"),false);
  assert.equal(canManageAmbassadors("ambassador"),false);
});
test("only administrators reset passwords",()=>{assert.equal(canResetPassword("admin"),true);assert.equal(canResetPassword("service"),false)});
test("no assigned scope denies access",()=>assert.equal(matchesScope([],a),false));
test("scope matches by all hierarchy dimensions",()=>{
  assert.equal(matchesScope(scope,a),true);
  assert.equal(matchesScope([{...scope[0],country:"KSA"}],a),false);
});
test("Ambassadors only read their own records",()=>{
  assert.equal(mayReadAmbassador({id:"amb-1",role:"ambassador"},[],a),true);
  assert.equal(mayReadAmbassador({id:"amb-2",role:"ambassador"},[],a),false);
});
test("programme leads require a matching scope to manage",()=>{
  assert.equal(mayManageAmbassador({role:"service"},scope,a),true);
  assert.equal(mayManageAmbassador({role:"service"},[],a),false);
  assert.equal(mayManageAmbassador({role:"manager"},scope,a),false);
});
