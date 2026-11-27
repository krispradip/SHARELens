import {apiRequest} from "../services/apiAuthClient.js";

let ambassadors=[];
let loading=false;
let errorMessage="";
const safe=value=>String(value??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
export function renderAmbassadorManagementPage(){
  return `<section class="page-heading"><span class="section-label">PROGRAMME OPERATIONS</span>
    <h1>Ambassador Management</h1>
    <p>Add, activate and deactivate SHARE Ambassadors. Existing history is retained.</p></section>
    <section class="dashboard-card" style="margin-bottom:18px">
      <h3>Add Ambassador</h3>
      <p>Each Ambassador requires an individual SHARE Ambassador ID, regardless of employer.</p>
      <form id="s360-add-ambassador" onsubmit="createAmbassadorFromForm(event)">
      <div class="s360-profile-grid">
      ${[["display_name","Full name"],["share_ambassador_id","SHARE Ambassador ID"],["login","Login username"],["employer","Employer"],["country","Country"],["business_unit","Business Unit"],["brand","Brand"],["store","Store"],["external_staff_id","Employer Staff ID (optional)"],["manager_name","Manager (optional)"],["password","Initial password (12+ characters)"]].map(([key,title])=>`
        <label class="s360-form-field">${title}<input name="${key}" ${key==="password"?'type="password" autocomplete="new-password" minlength="12"':'type="text"'} ${["external_staff_id","manager_name"].includes(key)?"":"required"} maxlength="120" /></label>`).join("")}
      </div><button class="primary-button" type="submit">Add Ambassador</button>
      </form>
    </section>
    <section class="dashboard-card">
      <h3>Ambassadors</h3>
      <p id="s360-ambassador-message" role="status">${safe(errorMessage || (loading?"Loading...":ambassadors.length+" record(s) within your access scope"))}</p>
      <div style="overflow-x:auto"><table class="s360-management-table"><thead><tr><th>Name</th><th>SHARE ID</th><th>Employer</th><th>Store</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${ambassadors.map(a=>`<tr><td>${safe(a.display_name)}</td><td>${safe(a.share_ambassador_id)}</td><td>${safe(a.employer)}</td><td>${safe(a.store)}</td><td>${safe(a.status)}</td>
      <td><button type="button" onclick="changeAmbassadorStatus('${safe(a.id)}','${a.status==="active"?"deactivate":"activate"}')">${a.status==="active"?"Deactivate":"Activate"}</button></td></tr>`).join("")}</tbody></table></div>
    </section>`;
}
export async function loadAmbassadorManagement(){
  loading=true;errorMessage="";
  try{const r=await apiRequest("/api/ambassadors");ambassadors=r.items||[];}
  catch(err){errorMessage=err.message;}finally{loading=false;}
  window.refreshAmbassadorManagementPage?.();
}
export async function createAmbassadorFromForm(event){
  event.preventDefault();
  const form=event.currentTarget;
  const body=Object.fromEntries(new FormData(form).entries());
  const status=document.getElementById("s360-ambassador-message");
  if(status)status.textContent="Saving Ambassador...";
  try{
    await apiRequest("/api/ambassadors",{method:"POST",body});
    form.reset();
    await loadAmbassadorManagement();
  }catch(err){if(status)status.textContent=err.message;}
}
export async function changeAmbassadorStatus(id,action){
  if(!["activate","deactivate"].includes(action))return;
  if(!confirm("Are you sure you want to "+action+" this Ambassador?"))return;
  try{await apiRequest("/api/ambassadors/"+encodeURIComponent(id)+"/"+action,{method:"POST"});await loadAmbassadorManagement();}
  catch(err){const status=document.getElementById("s360-ambassador-message");if(status)status.textContent=err.message;}
}
export function resetAmbassadorManagement(){ambassadors=[];loading=false;errorMessage="";}
