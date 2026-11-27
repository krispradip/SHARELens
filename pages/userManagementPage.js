import {apiRequest} from "../services/apiAuthClient.js";
let users=[],message="Open this page to manage accounts.";
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
export function renderUserManagementPage(){
  return `<section class="page-heading"><span class="section-label">IDENTITY & ACCESS</span><h1>Users & Access</h1>
  <p>Create Programme Lead and BU Lead logins, and reset credentials. Ambassador accounts are managed separately.</p></section>
  <section class="dashboard-card"><h3>Create Lead Account</h3>
    <form id="s360-create-user-form" onsubmit="createLeadAccount(event)">
      <div class="s360-profile-grid">
      ${[["display_name","Full name"],["login","Login username"],["password","Initial password (12+ characters)"],["country","Country"],["business_unit","Business Unit"],["brand","Brand"],["store","Store"]].map(([key,label])=>`
      <label class="s360-form-field">${label}<input name="${key}" ${key==="password"?'type="password" minlength="12" autocomplete="new-password"':'type="text"'} required maxlength="120"></label>`).join("")}
      <label class="s360-form-field">Role<select name="role" required><option value="service">Programme Lead</option><option value="manager">BU Lead</option></select></label>
      </div>
      <p>Use * for a scope field that covers all values. A Programme Lead may cover the whole programme.</p>
      <button type="submit" class="primary-button">Create User</button>
    </form></section>
  <section class="dashboard-card" style="margin-top:18px"><h3>Existing Users</h3><p id="s360-users-message" role="status">${esc(message)}</p>
   <div style="overflow-x:auto"><table class="s360-management-table"><thead><tr><th>Name</th><th>Login</th><th>Role</th><th>Status</th><th>Reset</th></tr></thead><tbody>
   ${users.map(u=>`<tr><td>${esc(u.display_name)}</td><td>${esc(u.login)}</td><td>${esc(u.role)}</td><td>${esc(u.status)}</td><td><button onclick="resetLeadPassword('${esc(u.id)}')">Reset password</button></td></tr>`).join("")}</tbody></table></div>
  </section>`;
}
export async function loadUserManagement(){
 try{let result=await apiRequest("/api/users");users=result.items||[];message=users.length+" account(s)";}catch(e){message=e.message;}
 window.refreshUserManagementPage?.();
}
export async function createLeadAccount(event){
 event.preventDefault();const form=event.currentTarget;const d=Object.fromEntries(new FormData(form).entries());
 const scope={country:d.country,business_unit:d.business_unit,brand:d.brand,store:d.store};
 const body={login:d.login,display_name:d.display_name,password:d.password,role:d.role,scopes:[scope]};
 try{await apiRequest("/api/users",{method:"POST",body});form.reset();await loadUserManagement();}
 catch(e){const node=document.getElementById("s360-users-message");if(node)node.textContent=e.message;}
}
export async function resetLeadPassword(id){
 const password=prompt("Enter a new temporary password (at least 12 characters):");
 if(password===null)return;
 if(password.length<12){alert("Password must have at least 12 characters.");return;}
 try{await apiRequest("/api/users/reset-password",{method:"POST",body:{user_id:id,password}});
   alert("Password updated. Existing sessions have been revoked.");}
 catch(e){alert(e.message);}
}
export function clearUserManagement(){users=[];message="";}
