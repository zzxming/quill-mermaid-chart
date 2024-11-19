!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("quill")):"function"==typeof define&&define.amd?define(["exports","quill"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).bundle={},t.Quill)}(this,(function(t,e){"use strict";const i="mermaid-mode-change",s=Symbol("mermaid-data");function r(t,e){t.addEventListener("scroll",e),this.scrollHandler.push([t,e])}function o(){for(let t=0;t<this.scrollHandler.length;t++){const[e,i]=this.scrollHandler[t];e.removeEventListener("scroll",i)}this.scrollHandler=[]}const l=e.import("delta"),a=e.import("formats/code-block");class n extends a{static blotName="mermaid-code-block";cacheDelta=new l;delta(){return this.cacheDelta}}const d=e.import("blots/container");class c extends d{static tagName="div";static blotName="mermaid-editor";static className="ql-mermaid-editor";static register(){e.register({[`formats/${n.blotName}`]:n},!0)}static create(t){const e=super.create(),i=t.split("\n"),s=document.createElement("div");s.classList.add("code-block-container");for(const t of i){const e=document.createElement("p");e.textContent=t,s.appendChild(e)}return e.appendChild(s),e}constructor(t,i){super(t,i);new MutationObserver((()=>{try{t.emitter.emit(e.events.SCROLL_UPDATE)}catch{}t.emitter.emit("mermaid-edit-change")})).observe(i,{attributes:!0,characterData:!0,characterDataOldValue:!0,childList:!0,subtree:!0})}}window.mermaid.initialize({startOnLoad:!1});const h=e.import("blots/container");class m extends h{static blotName="mermaid-contianer";static tagName="div";static className="ql-mermaid-container";static register(){e.register({[`formats/${c.blotName}`]:c},!0)}mode="chart";getChart(){return this.children.tail}getEditor(){return this.children.length<=1?null:this.children.head}createEditor(){const t=this.getChart();if(!t)return;const e=this.scroll.create(c.blotName,t.domNode[s]),r=this.scroll.create("code-block-container"),o=t.domNode[s].split("\n");for(const t of o){const e=this.scroll.create(n.blotName,"plain");e.appendChild(this.scroll.create("text",t)),r.appendChild(e)}e.appendChild(r),this.scroll.emitter.on(i,this.updateChart),this.insertBefore(e,this.children.head)}updateChart=()=>{const t=this.getChart(),e=this.getEditor();if(!e||!t)return;const i=e.descendants(n).map((t=>t.children.head.value())).join("\n");t.updateChart(i)};removeEditor(){const t=this.getEditor(),e=this.getChart();t&&e&&(t.remove(),this.scroll.emitter.off(i))}async switchMode(){"chart"===this.mode?(this.createEditor(),this.mode="edit"):(this.removeEditor(),this.mode="chart"),this.scroll.emitter.emit(i,this.mode)}}window.mermaid.initialize({startOnLoad:!1});const u=e.import("blots/block/embed");async function p(t,e,i){let s=null;try{if(await window.mermaid.parse(e)&&(s=await window.mermaid.render(`chart-${t}`,e,i)),s){const t=(t=>{const e=(new DOMParser).parseFromString(t,"text/html");return(new XMLSerializer).serializeToString(e.querySelector("svg"))})(s.svg),e=new Image;e.src=`data:image/svg+xml;base64,${window.btoa(t)}`,i.innerHTML="",i.appendChild(e)}}catch(t){console.error(t),i.innerHTML=t.message}return s}class f extends u{static tagName="div";static blotName="mermaid-chart";static className="ql-mermaid-chart";static register(){e.register({[`formats/${m.blotName}`]:m},!0)}static create(t){const e=super.create();e.setAttribute("contenteditable","false"),e[s]=t;const i=Math.random().toString(36).slice(2);e.dataset.id=i;const r=document.createElement("div");r.classList.add("chart"),e.appendChild(r);const{close:o}=(t=>{const e=document.createElement("div");e.classList.add("ql-mermaid-loading-mask");const i=document.createElement("div");return i.classList.add("ql-mermaid-loading-icon"),e.appendChild(i),t.appendChild(e),{close:()=>{e.remove()}}})(e);return new Promise((async e=>{await p(i,t,r),o(),e()})),e}static value(t){return t[s]||""}get id(){return this.domNode.dataset.id}length(){return this.domNode[s].length}getChart(){return this.domNode.querySelector(".chart")}async updateChart(t){this.domNode[s]=t,await p(this.id,t,this.getChart())}}class g{quill;mermaidBlot;options;scrollHandler=[];toolbox;selector;#t=!1;resizeOb;constructor(t,e,i){this.quill=t,this.mermaidBlot=e,this.options=this.resolveOptions(i),this.toolbox=this.quill.addContainer("ql-toolbox"),this.createSelector()}resolveOptions(t){return Object.assign({onDestroy:()=>{}},t)}addContainer(t){if(!this.toolbox)return;const e=document.createElement("div");for(const i of t.split(" "))e.classList.add(i);return this.toolbox.appendChild(e),e}updateSelector(){if(!this.selector)return;const t=this.mermaidBlot.domNode.getBoundingClientRect(),{x:e,y:i}=function(t,e){const i=e.getBoundingClientRect();return{x:t.x-i.x-e.scrollLeft,y:t.y-i.y-e.scrollTop,x1:t.x-i.x-e.scrollLeft+t.width,y1:t.y-i.y-e.scrollTop+t.height,width:t.width,height:t.height}}(t,this.quill.root),{scrollTop:s,scrollLeft:l}=this.quill.root;Object.assign(this.selector.style,{left:`${e+l}px`,top:`${i+s}px`,width:`${t.width}px`,height:`${t.height}px`}),o.call(this),r.call(this,this.quill.root,(()=>{Object.assign(this.selector.style,{left:e+2*l-this.quill.root.scrollLeft+"px",top:i+2*s-this.quill.root.scrollTop+"px"})}))}createSelector(){if(this.selector=this.addContainer("ql-mermaid-select"),!this.selector)return;this.updateSelector(),this.resizeOb=new ResizeObserver((()=>{this.updateSelector()})),this.resizeOb.observe(this.mermaidBlot.domNode);const t=b({iconStr:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/></svg>',classList:["ql-mermaid-select-edit"],click:()=>{this.mermaidBlot.switchMode(),this.#t=!0,this.destroy()}}),e=b({iconStr:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>',classList:["ql-mermaid-select-close"],click:()=>{this.mermaidBlot.remove(),this.#t=!0,this.destroy()}});this.quill.on(i,(t=>{this.selector&&this.selector.classList.add(t)})),this.selector?.classList.add(this.mermaidBlot.mode),this.selector.appendChild(e),this.selector.appendChild(t)}destroy(){this.quill.off(i),o.call(this),this.resizeOb&&this.resizeOb.disconnect(),this.toolbox&&(this.toolbox.remove(),this.toolbox=void 0),this.#t&&(this.#t=!1,this.options.onDestroy())}}function b(t){const{iconStr:e,classList:i,click:s}=t,r=document.createElement("span");r.classList.add("ql-mermaid-select-btn",...i);const o=document.createElement("i");return o.classList.add("ql-mermaid-icon"),o.innerHTML=e,r.appendChild(o),r.addEventListener("click",s),r}const v=e.import("formats/code-block-container");f.requiredContainer=m,m.allowedChildren=[f,c],c.allowedChildren=[v],c.defaultChild=v;const w=e.import("delta");class q{quill;static keyboradHandler={"code not exit":{bindInHead:!0,key:"Enter",collapsed:!0,format:["mermaid-code-block"],prefix:/^$/,suffix:/^\s*$/,handler(t,i){if(i.line.parent.parent instanceof c){const[i,s]=this.quill.getLine(t.index),r=(new w).retain(t.index+i.length()-s-2).insert("\n",{"mermaid-code-block":"plain"});return this.quill.updateContents(r,e.sources.USER),this.quill.setSelection(t.index+1,e.sources.SILENT),!1}return!0}}};static register(){e.import("ui/icons")[f.blotName]='<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.16 490.16"><defs><mask id="Mask"><rect x="0" y="0" width="490.16" height="490.16" fill="white"></rect><path fill="black" d="M407.48,111.18A165.2,165.2,0,0,0,245.08,220,165.2,165.2,0,0,0,82.68,111.18a165.5,165.5,0,0,0,72.06,143.64,88.81,88.81,0,0,1,38.53,73.45v50.86H296.9V328.27a88.8,88.8,0,0,1,38.52-73.45,165.41,165.41,0,0,0,72.06-143.64Z"></path><path fill="black" d="M160.63,328.27a56.09,56.09,0,0,0-24.27-46.49,198.74,198.74,0,0,1-28.54-23.66A196.87,196.87,0,0,1,82.53,227V379.13h78.1Z"></path><path fill="black" d="M329.53,328.27a56.09,56.09,0,0,1,24.27-46.49,198.74,198.74,0,0,0,28.54-23.66A196.87,196.87,0,0,0,407.63,227V379.13h-78.1Z"></path></mask><style>.cls-1{fill:#76767B;}.cls-1:hover{fill:#FF3570}</style></defs><rect class="cls-1" width="490.16" height="490.16" rx="84.61" mask="url(#Mask)"></rect></svg>',e.register({[`formats/${f.blotName}`]:f},!0)}mermaidBlot;mermaidSelector;constructor(t){this.quill=t;const i=this.quill.getModule("toolbar");i&&i.addHandler(f.blotName,(()=>{const t=this.quill.getSelection(!0);this.quill.insertEmbed(t.index,f.blotName,"")}));const s=this.quill.getModule("keyboard");for(const t of Object.values(q.keyboradHandler))t.bindInHead?s.bindings[t.key].unshift(t):s.addBinding(t.key,t);this.quill.root.addEventListener("click",(t=>{if(!this.quill.scroll.isEnabled())return;const i=t.composedPath();if(!i||i.length<=0)return;const s=i.find((t=>e.find(t)instanceof m));if(s){const t=e.find(s);if(this.mermaidBlot===t)return;this.updateMermaidSelector(t)}else this.destroyMermaidSelector()}),!1)}updateMermaidSelector(t){this.mermaidSelector&&this.destroyMermaidSelector(),t&&(this.mermaidBlot=t,this.mermaidSelector=new g(this.quill,this.mermaidBlot,{onDestroy:()=>this.destroyMermaidSelector()}))}destroyMermaidSelector(){this.mermaidSelector&&(this.mermaidSelector.destroy(),this.mermaidBlot=void 0,this.mermaidSelector=void 0)}}t.QuillMermaid=q}));
//# sourceMappingURL=dev.js.map
