
// Simple client-side cart using localStorage
const PRODUCTS = [{"id": "p1", "name": "Burger Patties", "price": 150, "category": "Beef", "limit": 5}, {"id": "p2", "name": "Longganisa Garlic", "price": 140, "category": "Pork", "limit": 8}, {"id": "p3", "name": "Longganisa Hamonado", "price": 140, "category": "Pork", "limit": 8}];

function fmt(n){return '₱' + n.toFixed(2);}
function loadCart(){return JSON.parse(localStorage.getItem('cart')||'[]');}
function saveCart(c){localStorage.setItem('cart',JSON.stringify(c));}

function addToCart(id,qty=1){
  const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) return alert('Product not found');
  const maxQ = prod.limit || 99;
  const cart = loadCart();
  const line = cart.find(i=>i.id===id);
  const newQty = Math.min((line? line.qty:0) + qty, maxQ);
  if(line) line.qty = newQty; else cart.push({id,qty:newQty});
  saveCart(cart);
  alert(`${prod.name} added. Qty now: ${newQty} (limit ${maxQ})`);
  renderCartCount && renderCartCount();
}

function removeFromCart(id){
  let c = loadCart().filter(i=>i.id!==id);
  saveCart(c);
  renderCart && renderCart();
  renderCartCount && renderCartCount();
}

function setQty(id,qty){
  const prod = PRODUCTS.find(p=>p.id===id);
  const maxQ = prod.limit || 99;
  const cart = loadCart();
  const line = cart.find(i=>i.id===id);
  if(!line) return;
  line.qty = Math.min(Math.max(1, qty), maxQ);
  saveCart(cart);
  renderCart && renderCart();
}

function cartTotals(){
  const cart = loadCart();
  let subtotal = 0;
  cart.forEach(i=>{
    const p = PRODUCTS.find(p=>p.id===i.id);
    if(p) subtotal += p.price * i.qty;
  });
  return {subtotal, shipping:0, total: subtotal};
}

function renderCartCount(){
  const el = document.querySelector('#cartCount');
  if(!el) return;
  const c = loadCart();
  const n = c.reduce((s,i)=>s+i.qty,0);
  el.textContent = n;
}

// Business rule: orders only Mon–Sat 09:00–17:00 Asia/Manila
function isWithinOrderingWindow(d=new Date()){
  // Convert to Asia/Manila by assuming user's device local is already correct for prototype.
  const day = d.getDay(); // 0 Sun ... 6 Sat
  const hour = d.getHours(); // 0-23
  const isOpenDay = (day>=1 && day<=6); // Mon-Sat
  const isOpenHour = (hour>=9 && hour<17); // 09:00-16:59
  return isOpenDay && isOpenHour;
}

function guardOrderingUI(){
  const banner = document.querySelector('#orderWindowBanner');
  if(!banner) return;
  if(isWithinOrderingWindow()){ 
    banner.innerHTML = '✅ We are accepting orders now (Mon–Sat, 9:00–5:00).';
  } else {
    banner.innerHTML = '⛔ Orders are closed right now. You can still browse & add to cart. Checkout is available Mon–Sat, 9:00–5:00.';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  renderCartCount();
  guardOrderingUI();
});
