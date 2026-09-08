import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const demoMode = firebaseConfig.apiKey === "PASTE_API_KEY";
let db = null;
if (!demoMode) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

const $ = id => document.getElementById(id);
$("recordDate").valueAsDate = new Date();

let students = demoMode ? [
  {id:"student1", name:"Student 1", password:"12345"},
  {id:"student2", name:"Student 2", password:"12345"}
] : [];
let records = demoMode ? [] : [];

function showDashboard(){
  $("loginView").classList.add("hidden");
  $("dashboardView").classList.remove("hidden");
  $("welcome").textContent = " | Admin";
  render();
}
$("loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  const id=$("loginId").value.trim(), pw=$("loginPassword").value;
  if((id==="admin" && pw==="admin123") || students.some(s=>s.id===id && s.password===pw)){
    showDashboard();
  } else $("loginMsg").textContent="Login ID یا Password غلط ہے۔";
});
$("logoutBtn").onclick=()=>location.reload();

async function loadData(){
  if(demoMode) return;
  students=[];
  records=[];
  const ss=await getDocs(collection(db,"students"));
  ss.forEach(x=>students.push({key:x.id,...x.data()}));
  const rr=await getDocs(query(collection(db,"records"),orderBy("date","desc")));
  rr.forEach(x=>records.push({key:x.id,...x.data()}));
}
async function saveStudent(s){
  if(demoMode){students.push(s);return}
  await addDoc(collection(db,"students"),s); await loadData();
}
async function saveRecord(r){
  if(demoMode){records.unshift(r);return}
  await addDoc(collection(db,"records"),r); await loadData();
}
$("studentForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const s={id:$("newStudentId").value.trim(),name:$("newStudentName").value.trim(),password:$("newStudentPassword").value};
  if(students.some(x=>x.id===s.id)){alert("یہ Student ID پہلے سے موجود ہے۔");return}
  await saveStudent(s); e.target.reset(); render();
});
$("recordForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const r={studentId:$("studentId").value,studentName:$("studentName").value,date:$("recordDate").value,attendance:$("attendance").value,teacher:$("teacher").value,sabaq:$("sabaq").value,sabqi:$("sabqi").value,manzil:$("manzil").value,mistakes:Number($("mistakes").value||0),attention:$("attention").value,quality:$("quality").value,remarks:$("remarks").value};
  await saveRecord(r); alert("Record محفوظ ہوگیا۔"); render();
});
async function removeStudent(i){
  if(!confirm("Student حذف کریں؟")) return;
  const s=students[i];
  if(!demoMode && s.key) await deleteDoc(doc(db,"students",s.key));
  students.splice(i,1); render();
}
function render(){
  $("studentCount").textContent=students.length;
  $("recordCount").textContent=records.length;
  const today=new Date().toISOString().slice(0,10);
  $("errorCount").textContent=records.filter(r=>r.date===today && Number(r.mistakes)>0).length;
  $("goodCount").textContent=records.filter(r=>r.quality==="Very Good").length;
  $("studentsTable").innerHTML=students.map((s,i)=>`<tr><td>${esc(s.id)}</td><td>${esc(s.name)}</td><td>${esc(s.password)}</td><td><button onclick="removeStudent(${i})">حذف</button></td></tr>`).join("");
  $("recordsTable").innerHTML=records.slice(0,50).map(r=>`<tr><td>${esc(r.date)}</td><td>${esc(r.studentName)}</td><td>${esc(r.attendance)}</td><td>${esc(r.sabaq)}</td><td>${r.mistakes}</td><td>${esc(r.quality)}</td></tr>`).join("");
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
window.removeStudent=removeStudent;
if(!demoMode) loadData().then(render);
else render();
