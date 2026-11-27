/**
 * SHARE Service360 API session client.
 * Personal GitHub Pages is intentionally a demo; corporate EKS uses the real API.
 * Token is memory-only, cleared on refresh; never written to browser storage.
 */
export const isCorporateApiMode = location.hostname !== "github.io" && !location.hostname.endsWith(".github.io") && document.querySelector('meta[name="share-service360-api-mode"]')?.content === "enabled";
let bearerToken = null;
export async function apiRequest(path,{method="GET",body}={}) {
  const res=await fetch(path,{
    method,
    credentials:"same-origin",
    cache:"no-store",
    headers:{"accept":"application/json",...(body?{"content-type":"application/json"}:{}),...(bearerToken?{"authorization":"Bearer "+bearerToken}:{})},
    ...(body?{body:JSON.stringify(body)}:{})
  });
  let payload;
  try{payload=await res.json();}catch{payload={};}
  if(!res.ok)throw new Error(payload.error || "Request failed ("+res.status+")");
  return payload;
}
export async function apiLogin(login,password){
  const data=await apiRequest("/api/auth/login",{method:"POST",body:{login,password}});
  if(!data?.token||!data?.user?.role)throw new Error("Invalid authentication response");
  bearerToken=data.token;
  return data.user;
}
export async function apiLogout(){
  try{if(bearerToken)await apiRequest("/api/auth/logout",{method:"POST"});}
  finally{bearerToken=null;}
}
export function clearApiSession(){bearerToken=null;}
