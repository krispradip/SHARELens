import {readFile} from "node:fs/promises";
import {resolve, extname} from "node:path";
import {fileURLToPath} from "node:url";
import http from "node:http";
import {randomBytes, createHash, timingSafeEqual} from "node:crypto";
import argon2 from "argon2";
import pg from "pg";
import {canManageAmbassadors,mayReadAmbassador,mayManageAmbassador,matchesScope} from "./access.js";

const pool = new pg.Pool({connectionString:process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX || 5),
  connectionTimeoutMillis:5000,
  ssl: process.env.PG_SSL === "require" ? {rejectUnauthorized:true} : undefined});
const port = Number(process.env.PORT || 8080);
const secureCookie = process.env.COOKIE_SECURE !== "false";
const sessionHours = 8;
const webRoot = resolve(fileURLToPath(new URL("../", import.meta.url)));
const allowedTopLevel = new Set(["index.html","app.js","style.css","showcase.html"]);
const allowedFolders = new Set(["pages","data","styles","services"]);
const mime = {".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml"};
async function serveFrontend(url,res){
  let pathname;
  try { pathname=decodeURIComponent(url.pathname); }
  catch { return json(res,400,{error:"Invalid path"}); }
  if(pathname==="/" || pathname==="/share-service360" || pathname==="/share-service360/") pathname="/index.html";
  if(pathname.startsWith("/share-service360/"))pathname=pathname.slice("/share-service360".length);
  const parts=pathname.slice(1).split("/");
  const allowed = parts.length===1 ? allowedTopLevel.has(parts[0]) :
    parts.length===2 && allowedFolders.has(parts[0]) && /^[a-zA-Z0-9._-]+$/.test(parts[1]);
  if(!allowed || parts.some(x=>x===".." || x.startsWith("."))) return json(res,404,{error:"Not found"});
  const file=resolve(webRoot,"."+pathname);
  if(!file.startsWith(webRoot+"/"))return json(res,404,{error:"Not found"});
  const type=mime[extname(file)];
  if(!type)return json(res,404,{error:"Not found"});
  try{
    let data=await readFile(file);
    if(parts[0]==="index.html"){
      let html=data.toString("utf8");
      if(process.env.S360_API_MODE==="enabled"){
        html=html.replace('name="share-service360-api-mode" content="disabled"','name="share-service360-api-mode" content="enabled"');
        html=html.replace(/<div class="test-accounts">[\s\S]*?<\/div>\s*<\/section>/,
          '<\/section>'); // Later replace the entire demo login markup in the dedicated UAT frontend.
      }
      data=Buffer.from(html);
    }
    res.writeHead(200,{"content-type":type,"cache-control":"no-store","x-content-type-options":"nosniff","x-frame-options":"DENY","referrer-policy":"no-referrer"});
    res.end(data);
  }catch(e){return json(res,404,{error:"Not found"});}
}

const sha = value => createHash("sha256").update(value).digest("hex");
const json = (res,status,obj,headers={}) => {
  res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...headers});
  res.end(JSON.stringify(obj));
};
const fail=(status,message)=>Object.assign(new Error(message),{status});
async function body(req){
  let chunks=[],len=0;
  for await(const part of req){len+=part.length;if(len>32768)throw fail(413,"Request too large");chunks.push(part);}
  try{return JSON.parse(Buffer.concat(chunks).toString("utf8"));}catch{throw fail(400,"Invalid JSON");}
}
const clean=(s,max=120)=>typeof s==="string" ? s.trim().slice(0,max) : "";
const assertValue=(v,name)=>{const x=clean(v);if(!x)throw fail(400,name+" is required");return x;};
const scopeColumns=["country","business_unit","brand","store"];
const normalizeProfile=input=>({
  employer:assertValue(input.employer,"employer"),
  business_unit:assertValue(input.business_unit,"business_unit"),
  brand:assertValue(input.brand,"brand"),
  store:assertValue(input.store,"store"),
  country:assertValue(input.country,"country"),
  external_staff_id:clean(input.external_staff_id)||null,
  manager_name:clean(input.manager_name)||null
});
async function getScopes(client,user){
  if(user.role==="admin")return [];
  const q=await client.query("SELECT country,business_unit,brand,store FROM s360_user_scopes WHERE user_id=$1",[user.id]);
  return q.rows;
}
async function actorFrom(req){
  const match=/^Bearer ([A-Za-z0-9_-]{32,})$/.exec(req.headers.authorization||"");
  if(!match)throw fail(401,"Authentication required");
  const result=await pool.query(`SELECT u.id,u.login,u.role,u.status,u.display_name FROM s360_sessions s
     JOIN s360_users u ON u.id=s.user_id
     WHERE s.token_hash=$1 AND s.expires_at>now() AND u.status='active'`,[sha(match[1])]);
  if(!result.rowCount)throw fail(401,"Session expired or invalid");
  return result.rows[0];
}
async function audit(client,actor,action,subject,details={}){
  await client.query("INSERT INTO s360_audit(actor_user_id,action,subject_user_id,details) VALUES ($1,$2,$3,$4)",[actor?.id||null,action,subject||null,JSON.stringify(details)]);
}
async function bootstrap(){
  const login=process.env.BOOTSTRAP_ADMIN_LOGIN;
  const password=process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if(!login||!password)return;
  if(password.length<16)throw Error("Bootstrap password must have at least 16 characters");
  const client=await pool.connect();
  try{
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(360001)");
    const count=await client.query("SELECT 1 FROM s360_users WHERE role='admin' LIMIT 1");
    if(!count.rowCount){
      const hashed=await argon2.hash(password,{type:argon2.argon2id});
      const row=await client.query("INSERT INTO s360_users(login,password_hash,role,display_name) VALUES ($1,$2,'admin','Platform Administrator') RETURNING id",[login.toLowerCase(),hashed]);
      await audit(client,null,"admin.bootstrap",row.rows[0].id);
      console.log("Initial admin created");
    }
    await client.query("COMMIT");
  }catch(err){await client.query("ROLLBACK");throw err;}finally{client.release();}
}
async function transaction(run){
  const client=await pool.connect();
  try{await client.query("BEGIN");const result=await run(client);await client.query("COMMIT");return result;}
  catch(err){await client.query("ROLLBACK");throw err;}finally{client.release();}
}
async function handler(req,res){
  const url=new URL(req.url,"http://localhost");
  const path=url.pathname;
  if(path==="/health/live"&&req.method==="GET")return json(res,200,{ok:true});
  if(path==="/health/ready"&&req.method==="GET"){
    await pool.query("SELECT 1");return json(res,200,{ok:true,database:"connected"});
  }
  if(!path.startsWith("/api/"))return req.method==="GET" ? serveFrontend(url,res) : json(res,405,{error:"Method not allowed"});
  if(req.method==="POST"&&path==="/api/auth/login"){
    const data=await body(req),login=clean(data.login).toLowerCase(),password=data.password;
    if(!login||typeof password!=="string")throw fail(400,"Login and password are required");
    const q=await pool.query("SELECT id,login,role,status,display_name,password_hash,identity_provider FROM s360_users WHERE login=$1",[login]);
    const user=q.rows[0];
    // Uniform invalid-login response; no account enumeration.
    if(!user||user.status!=="active"||user.identity_provider!=="local"||!user.password_hash||
       !(await argon2.verify(user.password_hash,password)))throw fail(401,"Invalid credentials");
    const token=randomBytes(32).toString("base64url");
    await pool.query("INSERT INTO s360_sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '8 hours')",[sha(token),user.id]);
    return json(res,200,{token,expiresInSeconds:sessionHours*3600,user:{id:user.id,login:user.login,display_name:user.display_name,role:user.role}});
  }
  const actor=await actorFrom(req);
  if(path==="/api/auth/me"&&req.method==="GET")return json(res,200,{user:actor});
  if(path==="/api/auth/logout"&&req.method==="POST"){
    const token=req.headers.authorization.slice(7);
    await pool.query("DELETE FROM s360_sessions WHERE token_hash=$1",[sha(token)]);
    return json(res,200,{ok:true});
  }
  if(path==="/api/users"&&req.method==="GET"){
    if(actor.role!=="admin")throw fail(403,"Permission denied");
    const q=await pool.query("SELECT id,login,role,status,display_name,identity_provider FROM s360_users ORDER BY created_at DESC LIMIT 500");
    return json(res,200,{items:q.rows});
  }
  if(path==="/api/users"&&req.method==="POST"){
    if(actor.role!=="admin")throw fail(403,"Permission denied");
    const data=await body(req),login=assertValue(data.login,"login").toLowerCase();
    const name=assertValue(data.display_name,"display_name"),role=data.role;
    if(!["service","manager"].includes(role))throw fail(400,"Only Programme Leads and BU Leads may be created here");
    if(typeof data.password!=="string"||data.password.length<12)throw fail(400,"Password must have at least 12 characters");
    const scopes=Array.isArray(data.scopes)?data.scopes:[];
    if(!scopes.length||scopes.length>20)throw fail(400,"One or more organization scopes are required");
    for(const scope of scopes){
      if(!scopeColumns.every(k=>typeof scope[k]==="string"&&scope[k].trim()&&scope[k].length<=120))throw fail(400,"Each scope requires country, business_unit, brand and store");
    }
    return json(res,201,await transaction(async client=>{
      const hash=await argon2.hash(data.password,{type:argon2.argon2id});
      const u=await client.query("INSERT INTO s360_users(login,password_hash,role,display_name) VALUES($1,$2,$3,$4) RETURNING id",[login,hash,role,name]);
      const uid=u.rows[0].id;
      for(const scope of scopes)await client.query(
        "INSERT INTO s360_user_scopes(user_id,country,business_unit,brand,store) VALUES($1,$2,$3,$4,$5)",
        [uid,...scopeColumns.map(k=>scope[k].trim())]
      );
      await audit(client,actor,"user.create",uid,{role,scopes});
      return {id:uid,login,role};
    }));
  }
  if(path==="/api/users/reset-password"&&req.method==="POST"){
    if(actor.role!=="admin")throw fail(403,"Permission denied");
    const data=await body(req);
    if(typeof data.password!=="string"||data.password.length<12)throw fail(400,"Password must have at least 12 characters");
    const row=await pool.query("SELECT id FROM s360_users WHERE id=$1",[data.user_id]);
    if(!row.rowCount)throw fail(404,"User not found");
    await transaction(async client=>{
      const hashed=await argon2.hash(data.password,{type:argon2.argon2id});
      await client.query("UPDATE s360_users SET password_hash=$1,updated_at=now() WHERE id=$2",[hashed,data.user_id]);
      await client.query("DELETE FROM s360_sessions WHERE user_id=$1",[data.user_id]);
      await audit(client,actor,"user.password-reset",data.user_id);
    });
    return json(res,200,{ok:true});
  }
  if(path==="/api/ambassadors"&&req.method==="GET"){
    const scopes=await getScopes(pool,actor);
    const q=await pool.query(`SELECT a.*,u.display_name,u.login,u.status FROM s360_ambassadors a
      JOIN s360_users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT 500`);
    return json(res,200,{items:q.rows.filter(a=>mayReadAmbassador(actor,scopes,a))});
  }
  if(path==="/api/ambassadors"&&req.method==="POST"){
    if(!canManageAmbassadors(actor.role))throw fail(403,"Permission denied");
    const data=await body(req),profile=normalizeProfile(data);
    const login=assertValue(data.login,"login").toLowerCase();
    const name=assertValue(data.display_name,"display_name");
    const ambassadorId=assertValue(data.share_ambassador_id,"share_ambassador_id");
    const password=data.password;
    if(typeof password!=="string"||password.length<12)throw fail(400,"Password must have at least 12 characters");
    return json(res,201,await transaction(async client=>{
      const scopes=await getScopes(client,actor);
      if(actor.role!=="admin"&&!matchesScope(scopes,profile))throw fail(403,"Outside permitted organisation scope");
      const hash=await argon2.hash(password,{type:argon2.argon2id});
      const u=await client.query(`INSERT INTO s360_users(login,password_hash,role,display_name)
        VALUES($1,$2,'ambassador',$3) RETURNING id`,[login,hash,name]);
      const id=u.rows[0].id;
      const a=await client.query(`INSERT INTO s360_ambassadors
        (user_id,share_ambassador_id,employer,business_unit,brand,store,country,external_staff_id,manager_name)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING id,share_ambassador_id`,[id,ambassadorId,profile.employer,profile.business_unit,profile.brand,profile.store,profile.country,profile.external_staff_id,profile.manager_name]);
      await audit(client,actor,"ambassador.create",id,{ambassadorId});
      return {ambassador:a.rows[0],user_id:id};
    }));
  }
  const match=/^\/api\/ambassadors\/([a-f0-9-]{36})(?:\/(deactivate|activate))?$/.exec(path);
  if(match){
    const id=match[1],action=match[2];
    const q=await pool.query("SELECT a.*,u.status,u.display_name,u.login FROM s360_ambassadors a JOIN s360_users u ON u.id=a.user_id WHERE a.id=$1",[id]);
    if(!q.rowCount)throw fail(404,"Ambassador not found");
    const ambassador=q.rows[0],scopes=await getScopes(pool,actor);
    if(req.method==="GET"&&!action){
      if(!mayReadAmbassador(actor,scopes,ambassador))throw fail(403,"Permission denied");
      return json(res,200,{ambassador});
    }
    if(req.method==="POST"&&action){
      if(!mayManageAmbassador(actor,scopes,ambassador))throw fail(403,"Permission denied");
      await transaction(async client=>{
        await client.query("UPDATE s360_users SET status=$1,updated_at=now() WHERE id=$2",[action==="activate"?"active":"inactive",ambassador.user_id]);
        await client.query("DELETE FROM s360_sessions WHERE user_id=$1",[ambassador.user_id]);
        await audit(client,actor,"ambassador."+action,ambassador.user_id);
      });
      return json(res,200,{ok:true,status:action==="activate"?"active":"inactive"});
    }
  }
  return json(res,404,{error:"Not found"});
}
const server=http.createServer(async(req,res)=>{
  try{await handler(req,res);}
  catch(e){
    if(e.code==="23505")return json(res,409,{error:"Login or SHARE Ambassador ID already exists"});
    if(e.code==="23503")return json(res,400,{error:"Invalid reference"});
    if(!e.status)console.error("API error",e);
    return json(res,e.status||500,{error:e.status?e.message:"Internal server error"});
  }
});
await bootstrap();
server.listen(port,"0.0.0.0",()=>console.log(`SHARE Service360 API listening on ${port}`));
process.on("SIGTERM",()=>server.close(()=>pool.end()));
