import"./modulepreload-polyfill-B5Qt9EMX.js";var s,A=0,k,m,E,y,C,p=0,D="p1",O="p2",R="p3",F="p4",G="p5",g;function Q(){var c,n,e,l,a,i,d,t,r,o;p=0,m=0,E=null,s=[{id:D,name:"버그 없애는 키보드",val:1e4,originalVal:1e4,q:50,onSale:!1,suggestSale:!1},{id:O,name:"생산성 폭발 마우스",val:2e4,originalVal:2e4,q:30,onSale:!1,suggestSale:!1},{id:R,name:"거북목 탈출 모니터암",val:3e4,originalVal:3e4,q:20,onSale:!1,suggestSale:!1},{id:F,name:"에러 방지 노트북 파우치",val:15e3,originalVal:15e3,q:0,onSale:!1,suggestSale:!1},{id:G,name:"코딩할 때 듣는 Lo-Fi 스피커",val:25e3,originalVal:25e3,q:10,onSale:!1,suggestSale:!1}];var c=document.getElementById("app");n=document.createElement("div"),n.className="mb-8",n.innerHTML=`
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `,y=document.createElement("select"),y.id="product-select",e=document.createElement("div"),l=document.createElement("div"),l.className="bg-white border border-gray-200 p-8 overflow-y-auto",a=document.createElement("div"),a.className="mb-6 pb-6 border-b border-gray-200",y.className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3",e.className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden",C=document.createElement("button"),k=document.createElement("div"),C.id="add-to-cart",k.id="stock-status",k.className="text-xs text-red-500 mt-3 whitespace-pre-line",C.innerHTML="Add to Cart",C.className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all",a.appendChild(y),a.appendChild(C),a.appendChild(k),l.appendChild(a),g=document.createElement("div"),l.appendChild(g),g.id="cart-items",i=document.createElement("div"),i.className="bg-black text-white p-8 flex flex-col",i.innerHTML=`
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `,K=i.querySelector("#cart-total"),d=document.createElement("button"),d.onclick=function(){t.classList.toggle("hidden"),r.classList.toggle("translate-x-full")},d.className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50",d.innerHTML=`
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `,t=document.createElement("div"),t.className="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300",t.onclick=function(u){u.target===t&&(t.classList.add("hidden"),r.classList.add("translate-x-full"))},r=document.createElement("div"),r.className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300",r.innerHTML=`
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
   
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br>
            • 마우스 10개↑: 15%<br>
            • 모니터암 10개↑: 20%<br>
            • 스피커 10개↑: 25%
          </p>
        </div>
       
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
        </div>
       
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +10%<br>
            • ⚡번개세일: 20%<br>
            • 💝추천할인: 5%
          </p>
        </div>
      </div>
    </div>
   
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
       
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
   
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `,e.appendChild(l),e.appendChild(i),t.appendChild(r),c.appendChild(n),c.appendChild(e),c.appendChild(d),c.appendChild(t);for(var x=0,h=0;h<s.length;h++)x+=s[h].q;H(),I(),o=Math.random()*1e4,setTimeout(()=>{setInterval(function(){var u=Math.floor(Math.random()*s.length),v=s[u];v.q>0&&!v.onSale&&(v.val=Math.round(v.originalVal*80/100),v.onSale=!0,alert("⚡번개세일! "+v.name+"이(가) 20% 할인 중입니다!"),H(),z())},3e4)},o),setTimeout(function(){setInterval(function(){if(g.children.length,E){for(var u=null,v=0;v<s.length;v++)if(s[v].id!==E&&s[v].q>0&&!s[v].suggestSale){u=s[v];break}u&&(alert("💝 "+u.name+"은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!"),u.val=Math.round(u.val*95/100),u.suggestSale=!0,H(),z())}},6e4)},Math.random()*2e4)}var K;function H(){var n,e,l;y.innerHTML="",n=0;for(var a=0;a<s.length;a++){var i=s[a];n=n+i.q}for(var d=0;d<s.length;d++)(function(){var t=s[d];e=document.createElement("option"),e.value=t.id,l="",t.onSale&&(l+=" ⚡SALE"),t.suggestSale&&(l+=" 💝추천"),t.q===0?(e.textContent=t.name+" - "+t.val+"원 (품절)"+l,e.disabled=!0,e.className="text-gray-400"):t.onSale&&t.suggestSale?(e.textContent="⚡💝"+t.name+" - "+t.originalVal+"원 → "+t.val+"원 (25% SUPER SALE!)",e.className="text-purple-600 font-bold"):t.onSale?(e.textContent="⚡"+t.name+" - "+t.originalVal+"원 → "+t.val+"원 (20% SALE!)",e.className="text-red-500 font-bold"):t.suggestSale?(e.textContent="💝"+t.name+" - "+t.originalVal+"원 → "+t.val+"원 (5% 추천할인!)",e.className="text-blue-500 font-bold"):e.textContent=t.name+" - "+t.val+"원"+l,y.appendChild(e)})();n<50?y.style.borderColor="orange":y.style.borderColor=""}function I(){var n,e,l,a,i,N,d,t,r,o,c,x,h,u,v;for(p=0,m=0,n=g.children,e=0,l=[],a=[],i=0;i<s.length;i++)s[i].q<5&&s[i].q>0&&a.push(s[i].name);for(let f=0;f<n.length;f++)(function(){for(var S,T=0;T<s.length;T++)if(s[T].id===n[f].id){S=s[T];break}var J=n[f].querySelector(".quantity-number"),q,P,b;q=parseInt(J.textContent),P=S.val*q,b=0,m+=q,e+=P;var Y=n[f],Z=Y.querySelectorAll(".text-lg, .text-xs");Z.forEach(function(j){j.classList.contains("text-lg")&&(j.style.fontWeight=q>=10?"bold":"normal")}),q>=10&&(S.id===D?b=10/100:S.id===O?b=15/100:S.id===R?b=20/100:S.id===F?b=5/100:S.id===G&&(b=25/100),b>0&&l.push({name:S.name,discount:b*100})),p+=P*(1-b)})();let w=0;var N=e;m>=30?(p=e*75/100,w=25/100):w=(e-p)/e;var U=new Date().getDay()===2,B=document.getElementById("tuesday-special");if(U&&p>0?(p=p*90/100,w=1-p/N,B.classList.remove("hidden")):B.classList.add("hidden"),document.getElementById("item-count").textContent="🛍️ "+m+" items in cart",t=document.getElementById("summary-details"),t.innerHTML="",e>0){for(let f=0;f<n.length;f++){for(var $,M=0;M<s.length;M++)if(s[M].id===n[f].id){$=s[M];break}var W=n[f].querySelector(".quantity-number"),_=parseInt(W.textContent),X=$.val*_;t.innerHTML+=`
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${$.name} x ${_}</span>
          <span>₩${X.toLocaleString()}</span>
        </div>
      `}t.innerHTML+=`
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${e.toLocaleString()}</span>
      </div>
    `,m>=30?t.innerHTML+=`
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `:l.length>0&&l.forEach(function(f){t.innerHTML+=`
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${f.name} (10개↑)</span>
            <span class="text-xs">-${f.discount}%</span>
          </div>
        `}),U&&p>0&&(t.innerHTML+=`
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `),t.innerHTML+=`
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `}r=K.querySelector(".text-2xl"),r&&(r.textContent="₩"+Math.round(p).toLocaleString()),o=document.getElementById("loyalty-points"),o&&(c=Math.floor(p/1e3),c>0?(o.textContent="적립 포인트: "+c+"p",o.style.display="block"):(o.textContent="적립 포인트: 0p",o.style.display="block")),x=document.getElementById("discount-info"),x.innerHTML="",w>0&&p>0&&(d=N-p,x.innerHTML=`
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(w*100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(d).toLocaleString()} 할인되었습니다</div>
      </div>
    `),h=document.getElementById("item-count"),h&&(u=parseInt(h.textContent.match(/\d+/)||0),h.textContent="🛍️ "+m+" items in cart",u!==m&&h.setAttribute("data-changed","true")),v="";for(var V=0;V<s.length;V++){var L=s[V];L.q<5&&(L.q>0?v=v+L.name+": 재고 부족 ("+L.q+`개 남음)
`:v=v+L.name+`: 품절
`)}k.textContent=v,ae(),ee()}var ee=function(){var n,e,l,a,i,d,t;if(g.children.length===0){document.getElementById("loyalty-points").style.display="none";return}n=Math.floor(p/1e3),e=0,l=[],n>0&&(e=n,l.push("기본: "+n+"p")),new Date().getDay()===2&&n>0&&(e=n*2,l.push("화요일 2배")),a=!1,i=!1,d=!1,t=g.children;for(const x of t){for(var r=null,o=0;o<s.length;o++)if(s[o].id===x.id){r=s[o];break}r&&(r.id===D?a=!0:r.id===O?i=!0:r.id===R&&(d=!0))}a&&i&&(e=e+50,l.push("키보드+마우스 세트 +50p")),a&&i&&d&&(e=e+100,l.push("풀세트 구매 +100p")),m>=30?(e=e+100,l.push("대량구매(30개+) +100p")):m>=20?(e=e+50,l.push("대량구매(20개+) +50p")):m>=10&&(e=e+20,l.push("대량구매(10개+) +20p")),A=e;var c=document.getElementById("loyalty-points");c&&(A>0?(c.innerHTML='<div>적립 포인트: <span class="font-bold">'+A+'p</span></div><div class="text-2xs opacity-70 mt-1">'+l.join(", ")+"</div>",c.style.display="block"):(c.textContent="적립 포인트: 0p",c.style.display="block"))};function te(){var n,e,l;for(n=0,e=0;e<s.length;e++)l=s[e],n+=l.q;return n}var ae=function(){var n;n="",te(),s.forEach(function(e){e.q<5&&(e.q>0?n=n+e.name+": 재고 부족 ("+e.q+`개 남음)
`:n=n+e.name+`: 품절
`)}),k.textContent=n};function z(){for(var n=0,e=0,l;g.children[e];){var a=g.children[e].querySelector(".quantity-number");n+=a?parseInt(a.textContent):0,e++}for(n=0,e=0;e<g.children.length;e++)n+=parseInt(g.children[e].querySelector(".quantity-number").textContent);l=g.children;for(var i=0;i<l.length;i++){for(var d=l[i].id,t=null,r=0;r<s.length;r++)if(s[r].id===d){t=s[r];break}if(t){var o=l[i].querySelector(".text-lg"),c=l[i].querySelector("h3");t.onSale&&t.suggestSale?(o.innerHTML='<span class="line-through text-gray-400">₩'+t.originalVal.toLocaleString()+'</span> <span class="text-purple-600">₩'+t.val.toLocaleString()+"</span>",c.textContent="⚡💝"+t.name):t.onSale?(o.innerHTML='<span class="line-through text-gray-400">₩'+t.originalVal.toLocaleString()+'</span> <span class="text-red-500">₩'+t.val.toLocaleString()+"</span>",c.textContent="⚡"+t.name):t.suggestSale?(o.innerHTML='<span class="line-through text-gray-400">₩'+t.originalVal.toLocaleString()+'</span> <span class="text-blue-500">₩'+t.val.toLocaleString()+"</span>",c.textContent="💝"+t.name):(o.textContent="₩"+t.val.toLocaleString(),c.textContent=t.name)}}I()}Q();C.addEventListener("click",function(){for(var n=y.value,e=!1,l=0;l<s.length;l++)if(s[l].id===n){e=!0;break}if(!(!n||!e)){for(var a=null,i=0;i<s.length;i++)if(s[i].id===n){a=s[i];break}if(a&&a.q>0){var d=document.getElementById(a.id);if(d){var t=d.querySelector(".quantity-number"),r=parseInt(t.textContent)+1;r<=a.q+parseInt(t.textContent)?(t.textContent=r,a.q--):alert("재고가 부족합니다.")}else{var o=document.createElement("div");o.id=a.id,o.className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0",o.innerHTML=`
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">${a.onSale&&a.suggestSale?"⚡💝":a.onSale?"⚡":a.suggestSale?"💝":""}${a.name}</h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">${a.onSale||a.suggestSale?'<span class="line-through text-gray-400">₩'+a.originalVal.toLocaleString()+'</span> <span class="'+(a.onSale&&a.suggestSale?"text-purple-600":a.onSale?"text-red-500":"text-blue-500")+'">₩'+a.val.toLocaleString()+"</span>":"₩"+a.val.toLocaleString()}</p>
          <div class="flex items-center gap-4">
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${a.id}" data-change="-1">−</button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${a.id}" data-change="1">+</button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">${a.onSale||a.suggestSale?'<span class="line-through text-gray-400">₩'+a.originalVal.toLocaleString()+'</span> <span class="'+(a.onSale&&a.suggestSale?"text-purple-600":a.onSale?"text-red-500":"text-blue-500")+'">₩'+a.val.toLocaleString()+"</span>":"₩"+a.val.toLocaleString()}</div>
          <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${a.id}">Remove</a>
        </div>
      `,g.appendChild(o),a.q--}I(),E=n}}});g.addEventListener("click",function(n){var e=n.target;if(e.classList.contains("quantity-change")||e.classList.contains("remove-item")){for(var l=e.dataset.productId,a=document.getElementById(l),i=null,d=0;d<s.length;d++)if(s[d].id===l){i=s[d];break}if(e.classList.contains("quantity-change")){var t=parseInt(e.dataset.change),r=a.querySelector(".quantity-number"),o=parseInt(r.textContent),c=o+t;c>0&&c<=i.q+o?(r.textContent=c,i.q-=t):c<=0?(i.q+=o,a.remove()):alert("재고가 부족합니다.")}else if(e.classList.contains("remove-item")){var r=a.querySelector(".quantity-number"),x=parseInt(r.textContent);i.q+=x,a.remove()}i&&i.q<5,I(),H()}});
