"use strict";var pl=Object.create;var Zr=Object.defineProperty;var fl=Object.getOwnPropertyDescriptor;var hl=Object.getOwnPropertyNames;var ml=Object.getPrototypeOf,gl=Object.prototype.hasOwnProperty;var w=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),vl=(t,e)=>{for(var r in e)Zr(t,r,{get:e[r],enumerable:!0})},Za=(t,e,r,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of hl(e))!gl.call(t,i)&&i!==r&&Zr(t,i,{get:()=>e[i],enumerable:!(n=fl(e,i))||n.enumerable});return t};var F=(t,e,r)=>(r=t!=null?pl(ml(t)):{},Za(e||!t||!t.__esModule?Zr(r,"default",{value:t,enumerable:!0}):r,t)),yl=t=>Za(Zr({},"__esModule",{value:!0}),t);var Pr=w(T=>{"use strict";Object.defineProperty(T,"__esModule",{value:!0});T.regexpCode=T.getEsmExportName=T.getProperty=T.safeStringify=T.stringify=T.strConcat=T.addCodeArg=T.str=T._=T.nil=T._Code=T.Name=T.IDENTIFIER=T._CodeOrName=void 0;var xr=class{};T._CodeOrName=xr;T.IDENTIFIER=/^[a-z$_][a-z$_0-9]*$/i;var vt=class extends xr{constructor(e){if(super(),!T.IDENTIFIER.test(e))throw new Error("CodeGen: name must be a valid identifier");this.str=e}toString(){return this.str}emptyStr(){return!1}get names(){return{[this.str]:1}}};T.Name=vt;var je=class extends xr{constructor(e){super(),this._items=typeof e=="string"?[e]:e}toString(){return this.str}emptyStr(){if(this._items.length>1)return!1;let e=this._items[0];return e===""||e==='""'}get str(){var e;return(e=this._str)!==null&&e!==void 0?e:this._str=this._items.reduce((r,n)=>`${r}${n}`,"")}get names(){var e;return(e=this._names)!==null&&e!==void 0?e:this._names=this._items.reduce((r,n)=>(n instanceof vt&&(r[n.str]=(r[n.str]||0)+1),r),{})}};T._Code=je;T.nil=new je("");function Qs(t,...e){let r=[t[0]],n=0;for(;n<e.length;)Zi(r,e[n]),r.push(t[++n]);return new je(r)}T._=Qs;var Qi=new je("+");function Zs(t,...e){let r=[br(t[0])],n=0;for(;n<e.length;)r.push(Qi),Zi(r,e[n]),r.push(Qi,br(t[++n]));return _h(r),new je(r)}T.str=Zs;function Zi(t,e){e instanceof je?t.push(...e._items):e instanceof vt?t.push(e):t.push(Rh(e))}T.addCodeArg=Zi;function _h(t){let e=1;for(;e<t.length-1;){if(t[e]===Qi){let r=$h(t[e-1],t[e+1]);if(r!==void 0){t.splice(e-1,3,r);continue}t[e++]="+"}e++}}function $h(t,e){if(e==='""')return t;if(t==='""')return e;if(typeof t=="string")return e instanceof vt||t[t.length-1]!=='"'?void 0:typeof e!="string"?`${t.slice(0,-1)}${e}"`:e[0]==='"'?t.slice(0,-1)+e.slice(1):void 0;if(typeof e=="string"&&e[0]==='"'&&!(t instanceof vt))return`"${t}${e.slice(1)}`}function Mh(t,e){return e.emptyStr()?t:t.emptyStr()?e:Zs`${t}${e}`}T.strConcat=Mh;function Rh(t){return typeof t=="number"||typeof t=="boolean"||t===null?t:br(Array.isArray(t)?t.join(","):t)}function kh(t){return new je(br(t))}T.stringify=kh;function br(t){return JSON.stringify(t).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}T.safeStringify=br;function Ch(t){return typeof t=="string"&&T.IDENTIFIER.test(t)?new je(`.${t}`):Qs`[${t}]`}T.getProperty=Ch;function Ah(t){if(typeof t=="string"&&T.IDENTIFIER.test(t))return new je(`${t}`);throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`)}T.getEsmExportName=Ah;function Th(t){return new je(t.toString())}T.regexpCode=Th});var ro=w(we=>{"use strict";Object.defineProperty(we,"__esModule",{value:!0});we.ValueScope=we.ValueScopeName=we.Scope=we.varKinds=we.UsedValueState=void 0;var ye=Pr(),eo=class extends Error{constructor(e){super(`CodeGen: "code" for ${e} not defined`),this.value=e.value}},Nn;(function(t){t[t.Started=0]="Started",t[t.Completed=1]="Completed"})(Nn||(we.UsedValueState=Nn={}));we.varKinds={const:new ye.Name("const"),let:new ye.Name("let"),var:new ye.Name("var")};var qn=class{constructor({prefixes:e,parent:r}={}){this._names={},this._prefixes=e,this._parent=r}toName(e){return e instanceof ye.Name?e:this.name(e)}name(e){return new ye.Name(this._newName(e))}_newName(e){let r=this._names[e]||this._nameGroup(e);return`${e}${r.index++}`}_nameGroup(e){var r,n;if(!((n=(r=this._parent)===null||r===void 0?void 0:r._prefixes)===null||n===void 0)&&n.has(e)||this._prefixes&&!this._prefixes.has(e))throw new Error(`CodeGen: prefix "${e}" is not allowed in this scope`);return this._names[e]={prefix:e,index:0}}};we.Scope=qn;var Vn=class extends ye.Name{constructor(e,r){super(r),this.prefix=e}setValue(e,{property:r,itemIndex:n}){this.value=e,this.scopePath=(0,ye._)`.${new ye.Name(r)}[${n}]`}};we.ValueScopeName=Vn;var Oh=(0,ye._)`\n`,to=class extends qn{constructor(e){super(e),this._values={},this._scope=e.scope,this.opts={...e,_n:e.lines?Oh:ye.nil}}get(){return this._scope}name(e){return new Vn(e,this._newName(e))}value(e,r){var n;if(r.ref===void 0)throw new Error("CodeGen: ref must be passed in value");let i=this.toName(e),{prefix:o}=i,a=(n=r.key)!==null&&n!==void 0?n:r.ref,s=this._values[o];if(s){let u=s.get(a);if(u)return u}else s=this._values[o]=new Map;s.set(a,i);let c=this._scope[o]||(this._scope[o]=[]),d=c.length;return c[d]=r.ref,i.setValue(r,{property:o,itemIndex:d}),i}getValue(e,r){let n=this._values[e];if(n)return n.get(r)}scopeRefs(e,r=this._values){return this._reduceValues(r,n=>{if(n.scopePath===void 0)throw new Error(`CodeGen: name "${n}" has no value`);return(0,ye._)`${e}${n.scopePath}`})}scopeCode(e=this._values,r,n){return this._reduceValues(e,i=>{if(i.value===void 0)throw new Error(`CodeGen: name "${i}" has no value`);return i.value.code},r,n)}_reduceValues(e,r,n={},i){let o=ye.nil;for(let a in e){let s=e[a];if(!s)continue;let c=n[a]=n[a]||new Map;s.forEach(d=>{if(c.has(d))return;c.set(d,Nn.Started);let u=r(d);if(u){let l=this.opts.es5?we.varKinds.var:we.varKinds.const;o=(0,ye._)`${o}${l} ${d} = ${u};${this.opts._n}`}else if(u=i?.(d))o=(0,ye._)`${o}${u}${this.opts._n}`;else throw new eo(d);c.set(d,Nn.Completed)})}return o}};we.ValueScope=to});var _=w($=>{"use strict";Object.defineProperty($,"__esModule",{value:!0});$.or=$.and=$.not=$.CodeGen=$.operators=$.varKinds=$.ValueScopeName=$.ValueScope=$.Scope=$.Name=$.regexpCode=$.stringify=$.getProperty=$.nil=$.strConcat=$.str=$._=void 0;var k=Pr(),Ce=ro(),ot=Pr();Object.defineProperty($,"_",{enumerable:!0,get:function(){return ot._}});Object.defineProperty($,"str",{enumerable:!0,get:function(){return ot.str}});Object.defineProperty($,"strConcat",{enumerable:!0,get:function(){return ot.strConcat}});Object.defineProperty($,"nil",{enumerable:!0,get:function(){return ot.nil}});Object.defineProperty($,"getProperty",{enumerable:!0,get:function(){return ot.getProperty}});Object.defineProperty($,"stringify",{enumerable:!0,get:function(){return ot.stringify}});Object.defineProperty($,"regexpCode",{enumerable:!0,get:function(){return ot.regexpCode}});Object.defineProperty($,"Name",{enumerable:!0,get:function(){return ot.Name}});var Bn=ro();Object.defineProperty($,"Scope",{enumerable:!0,get:function(){return Bn.Scope}});Object.defineProperty($,"ValueScope",{enumerable:!0,get:function(){return Bn.ValueScope}});Object.defineProperty($,"ValueScopeName",{enumerable:!0,get:function(){return Bn.ValueScopeName}});Object.defineProperty($,"varKinds",{enumerable:!0,get:function(){return Bn.varKinds}});$.operators={GT:new k._Code(">"),GTE:new k._Code(">="),LT:new k._Code("<"),LTE:new k._Code("<="),EQ:new k._Code("==="),NEQ:new k._Code("!=="),NOT:new k._Code("!"),OR:new k._Code("||"),AND:new k._Code("&&"),ADD:new k._Code("+")};var Ke=class{optimizeNodes(){return this}optimizeNames(e,r){return this}},no=class extends Ke{constructor(e,r,n){super(),this.varKind=e,this.name=r,this.rhs=n}render({es5:e,_n:r}){let n=e?Ce.varKinds.var:this.varKind,i=this.rhs===void 0?"":` = ${this.rhs}`;return`${n} ${this.name}${i};`+r}optimizeNames(e,r){if(e[this.name.str])return this.rhs&&(this.rhs=Bt(this.rhs,e,r)),this}get names(){return this.rhs instanceof k._CodeOrName?this.rhs.names:{}}},Hn=class extends Ke{constructor(e,r,n){super(),this.lhs=e,this.rhs=r,this.sideEffects=n}render({_n:e}){return`${this.lhs} = ${this.rhs};`+e}optimizeNames(e,r){if(!(this.lhs instanceof k.Name&&!e[this.lhs.str]&&!this.sideEffects))return this.rhs=Bt(this.rhs,e,r),this}get names(){let e=this.lhs instanceof k.Name?{}:{...this.lhs.names};return zn(e,this.rhs)}},io=class extends Hn{constructor(e,r,n,i){super(e,n,i),this.op=r}render({_n:e}){return`${this.lhs} ${this.op}= ${this.rhs};`+e}},oo=class extends Ke{constructor(e){super(),this.label=e,this.names={}}render({_n:e}){return`${this.label}:`+e}},ao=class extends Ke{constructor(e){super(),this.label=e,this.names={}}render({_n:e}){return`break${this.label?` ${this.label}`:""};`+e}},so=class extends Ke{constructor(e){super(),this.error=e}render({_n:e}){return`throw ${this.error};`+e}get names(){return this.error.names}},co=class extends Ke{constructor(e){super(),this.code=e}render({_n:e}){return`${this.code};`+e}optimizeNodes(){return`${this.code}`?this:void 0}optimizeNames(e,r){return this.code=Bt(this.code,e,r),this}get names(){return this.code instanceof k._CodeOrName?this.code.names:{}}},Ir=class extends Ke{constructor(e=[]){super(),this.nodes=e}render(e){return this.nodes.reduce((r,n)=>r+n.render(e),"")}optimizeNodes(){let{nodes:e}=this,r=e.length;for(;r--;){let n=e[r].optimizeNodes();Array.isArray(n)?e.splice(r,1,...n):n?e[r]=n:e.splice(r,1)}return e.length>0?this:void 0}optimizeNames(e,r){let{nodes:n}=this,i=n.length;for(;i--;){let o=n[i];o.optimizeNames(e,r)||(Nh(e,o.names),n.splice(i,1))}return n.length>0?this:void 0}get names(){return this.nodes.reduce((e,r)=>xt(e,r.names),{})}},Xe=class extends Ir{render(e){return"{"+e._n+super.render(e)+"}"+e._n}},uo=class extends Ir{},zt=class extends Xe{};zt.kind="else";var yt=class t extends Xe{constructor(e,r){super(r),this.condition=e}render(e){let r=`if(${this.condition})`+super.render(e);return this.else&&(r+="else "+this.else.render(e)),r}optimizeNodes(){super.optimizeNodes();let e=this.condition;if(e===!0)return this.nodes;let r=this.else;if(r){let n=r.optimizeNodes();r=this.else=Array.isArray(n)?new zt(n):n}if(r)return e===!1?r instanceof t?r:r.nodes:this.nodes.length?this:new t(ec(e),r instanceof t?[r]:r.nodes);if(!(e===!1||!this.nodes.length))return this}optimizeNames(e,r){var n;if(this.else=(n=this.else)===null||n===void 0?void 0:n.optimizeNames(e,r),!!(super.optimizeNames(e,r)||this.else))return this.condition=Bt(this.condition,e,r),this}get names(){let e=super.names;return zn(e,this.condition),this.else&&xt(e,this.else.names),e}};yt.kind="if";var wt=class extends Xe{};wt.kind="for";var lo=class extends wt{constructor(e){super(),this.iteration=e}render(e){return`for(${this.iteration})`+super.render(e)}optimizeNames(e,r){if(super.optimizeNames(e,r))return this.iteration=Bt(this.iteration,e,r),this}get names(){return xt(super.names,this.iteration.names)}},po=class extends wt{constructor(e,r,n,i){super(),this.varKind=e,this.name=r,this.from=n,this.to=i}render(e){let r=e.es5?Ce.varKinds.var:this.varKind,{name:n,from:i,to:o}=this;return`for(${r} ${n}=${i}; ${n}<${o}; ${n}++)`+super.render(e)}get names(){let e=zn(super.names,this.from);return zn(e,this.to)}},Fn=class extends wt{constructor(e,r,n,i){super(),this.loop=e,this.varKind=r,this.name=n,this.iterable=i}render(e){return`for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})`+super.render(e)}optimizeNames(e,r){if(super.optimizeNames(e,r))return this.iterable=Bt(this.iterable,e,r),this}get names(){return xt(super.names,this.iterable.names)}},Er=class extends Xe{constructor(e,r,n){super(),this.name=e,this.args=r,this.async=n}render(e){return`${this.async?"async ":""}function ${this.name}(${this.args})`+super.render(e)}};Er.kind="func";var Sr=class extends Ir{render(e){return"return "+super.render(e)}};Sr.kind="return";var fo=class extends Xe{render(e){let r="try"+super.render(e);return this.catch&&(r+=this.catch.render(e)),this.finally&&(r+=this.finally.render(e)),r}optimizeNodes(){var e,r;return super.optimizeNodes(),(e=this.catch)===null||e===void 0||e.optimizeNodes(),(r=this.finally)===null||r===void 0||r.optimizeNodes(),this}optimizeNames(e,r){var n,i;return super.optimizeNames(e,r),(n=this.catch)===null||n===void 0||n.optimizeNames(e,r),(i=this.finally)===null||i===void 0||i.optimizeNames(e,r),this}get names(){let e=super.names;return this.catch&&xt(e,this.catch.names),this.finally&&xt(e,this.finally.names),e}},jr=class extends Xe{constructor(e){super(),this.error=e}render(e){return`catch(${this.error})`+super.render(e)}};jr.kind="catch";var Dr=class extends Xe{render(e){return"finally"+super.render(e)}};Dr.kind="finally";var ho=class{constructor(e,r={}){this._values={},this._blockStarts=[],this._constants={},this.opts={...r,_n:r.lines?`
`:""},this._extScope=e,this._scope=new Ce.Scope({parent:e}),this._nodes=[new uo]}toString(){return this._root.render(this.opts)}name(e){return this._scope.name(e)}scopeName(e){return this._extScope.name(e)}scopeValue(e,r){let n=this._extScope.value(e,r);return(this._values[n.prefix]||(this._values[n.prefix]=new Set)).add(n),n}getScopeValue(e,r){return this._extScope.getValue(e,r)}scopeRefs(e){return this._extScope.scopeRefs(e,this._values)}scopeCode(){return this._extScope.scopeCode(this._values)}_def(e,r,n,i){let o=this._scope.toName(r);return n!==void 0&&i&&(this._constants[o.str]=n),this._leafNode(new no(e,o,n)),o}const(e,r,n){return this._def(Ce.varKinds.const,e,r,n)}let(e,r,n){return this._def(Ce.varKinds.let,e,r,n)}var(e,r,n){return this._def(Ce.varKinds.var,e,r,n)}assign(e,r,n){return this._leafNode(new Hn(e,r,n))}add(e,r){return this._leafNode(new io(e,$.operators.ADD,r))}code(e){return typeof e=="function"?e():e!==k.nil&&this._leafNode(new co(e)),this}object(...e){let r=["{"];for(let[n,i]of e)r.length>1&&r.push(","),r.push(n),(n!==i||this.opts.es5)&&(r.push(":"),(0,k.addCodeArg)(r,i));return r.push("}"),new k._Code(r)}if(e,r,n){if(this._blockNode(new yt(e)),r&&n)this.code(r).else().code(n).endIf();else if(r)this.code(r).endIf();else if(n)throw new Error('CodeGen: "else" body without "then" body');return this}elseIf(e){return this._elseNode(new yt(e))}else(){return this._elseNode(new zt)}endIf(){return this._endBlockNode(yt,zt)}_for(e,r){return this._blockNode(e),r&&this.code(r).endFor(),this}for(e,r){return this._for(new lo(e),r)}forRange(e,r,n,i,o=this.opts.es5?Ce.varKinds.var:Ce.varKinds.let){let a=this._scope.toName(e);return this._for(new po(o,a,r,n),()=>i(a))}forOf(e,r,n,i=Ce.varKinds.const){let o=this._scope.toName(e);if(this.opts.es5){let a=r instanceof k.Name?r:this.var("_arr",r);return this.forRange("_i",0,(0,k._)`${a}.length`,s=>{this.var(o,(0,k._)`${a}[${s}]`),n(o)})}return this._for(new Fn("of",i,o,r),()=>n(o))}forIn(e,r,n,i=this.opts.es5?Ce.varKinds.var:Ce.varKinds.const){if(this.opts.ownProperties)return this.forOf(e,(0,k._)`Object.keys(${r})`,n);let o=this._scope.toName(e);return this._for(new Fn("in",i,o,r),()=>n(o))}endFor(){return this._endBlockNode(wt)}label(e){return this._leafNode(new oo(e))}break(e){return this._leafNode(new ao(e))}return(e){let r=new Sr;if(this._blockNode(r),this.code(e),r.nodes.length!==1)throw new Error('CodeGen: "return" should have one node');return this._endBlockNode(Sr)}try(e,r,n){if(!r&&!n)throw new Error('CodeGen: "try" without "catch" and "finally"');let i=new fo;if(this._blockNode(i),this.code(e),r){let o=this.name("e");this._currNode=i.catch=new jr(o),r(o)}return n&&(this._currNode=i.finally=new Dr,this.code(n)),this._endBlockNode(jr,Dr)}throw(e){return this._leafNode(new so(e))}block(e,r){return this._blockStarts.push(this._nodes.length),e&&this.code(e).endBlock(r),this}endBlock(e){let r=this._blockStarts.pop();if(r===void 0)throw new Error("CodeGen: not in self-balancing block");let n=this._nodes.length-r;if(n<0||e!==void 0&&n!==e)throw new Error(`CodeGen: wrong number of nodes: ${n} vs ${e} expected`);return this._nodes.length=r,this}func(e,r=k.nil,n,i){return this._blockNode(new Er(e,r,n)),i&&this.code(i).endFunc(),this}endFunc(){return this._endBlockNode(Er)}optimize(e=1){for(;e-- >0;)this._root.optimizeNodes(),this._root.optimizeNames(this._root.names,this._constants)}_leafNode(e){return this._currNode.nodes.push(e),this}_blockNode(e){this._currNode.nodes.push(e),this._nodes.push(e)}_endBlockNode(e,r){let n=this._currNode;if(n instanceof e||r&&n instanceof r)return this._nodes.pop(),this;throw new Error(`CodeGen: not in block "${r?`${e.kind}/${r.kind}`:e.kind}"`)}_elseNode(e){let r=this._currNode;if(!(r instanceof yt))throw new Error('CodeGen: "else" without "if"');return this._currNode=r.else=e,this}get _root(){return this._nodes[0]}get _currNode(){let e=this._nodes;return e[e.length-1]}set _currNode(e){let r=this._nodes;r[r.length-1]=e}};$.CodeGen=ho;function xt(t,e){for(let r in e)t[r]=(t[r]||0)+(e[r]||0);return t}function zn(t,e){return e instanceof k._CodeOrName?xt(t,e.names):t}function Bt(t,e,r){if(t instanceof k.Name)return n(t);if(!i(t))return t;return new k._Code(t._items.reduce((o,a)=>(a instanceof k.Name&&(a=n(a)),a instanceof k._Code?o.push(...a._items):o.push(a),o),[]));function n(o){let a=r[o.str];return a===void 0||e[o.str]!==1?o:(delete e[o.str],a)}function i(o){return o instanceof k._Code&&o._items.some(a=>a instanceof k.Name&&e[a.str]===1&&r[a.str]!==void 0)}}function Nh(t,e){for(let r in e)t[r]=(t[r]||0)-(e[r]||0)}function ec(t){return typeof t=="boolean"||typeof t=="number"||t===null?!t:(0,k._)`!${mo(t)}`}$.not=ec;var qh=tc($.operators.AND);function Vh(...t){return t.reduce(qh)}$.and=Vh;var Hh=tc($.operators.OR);function Fh(...t){return t.reduce(Hh)}$.or=Fh;function tc(t){return(e,r)=>e===k.nil?r:r===k.nil?e:(0,k._)`${mo(e)} ${t} ${mo(r)}`}function mo(t){return t instanceof k.Name?t:(0,k._)`(${t})`}});var C=w(M=>{"use strict";Object.defineProperty(M,"__esModule",{value:!0});M.checkStrictMode=M.getErrorPath=M.Type=M.useFunc=M.setEvaluated=M.evaluatedPropsToName=M.mergeEvaluated=M.eachItem=M.unescapeJsonPointer=M.escapeJsonPointer=M.escapeFragment=M.unescapeFragment=M.schemaRefOrVal=M.schemaHasRulesButRef=M.schemaHasRules=M.checkUnknownRules=M.alwaysValidSchema=M.toHash=void 0;var q=_(),zh=Pr();function Bh(t){let e={};for(let r of t)e[r]=!0;return e}M.toHash=Bh;function Lh(t,e){return typeof e=="boolean"?e:Object.keys(e).length===0?!0:(ic(t,e),!oc(e,t.self.RULES.all))}M.alwaysValidSchema=Lh;function ic(t,e=t.schema){let{opts:r,self:n}=t;if(!r.strictSchema||typeof e=="boolean")return;let i=n.RULES.keywords;for(let o in e)i[o]||cc(t,`unknown keyword: "${o}"`)}M.checkUnknownRules=ic;function oc(t,e){if(typeof t=="boolean")return!t;for(let r in t)if(e[r])return!0;return!1}M.schemaHasRules=oc;function Uh(t,e){if(typeof t=="boolean")return!t;for(let r in t)if(r!=="$ref"&&e.all[r])return!0;return!1}M.schemaHasRulesButRef=Uh;function Gh({topSchemaRef:t,schemaPath:e},r,n,i){if(!i){if(typeof r=="number"||typeof r=="boolean")return r;if(typeof r=="string")return(0,q._)`${r}`}return(0,q._)`${t}${e}${(0,q.getProperty)(n)}`}M.schemaRefOrVal=Gh;function Wh(t){return ac(decodeURIComponent(t))}M.unescapeFragment=Wh;function Yh(t){return encodeURIComponent(vo(t))}M.escapeFragment=Yh;function vo(t){return typeof t=="number"?`${t}`:t.replace(/~/g,"~0").replace(/\//g,"~1")}M.escapeJsonPointer=vo;function ac(t){return t.replace(/~1/g,"/").replace(/~0/g,"~")}M.unescapeJsonPointer=ac;function Kh(t,e){if(Array.isArray(t))for(let r of t)e(r);else e(t)}M.eachItem=Kh;function rc({mergeNames:t,mergeToName:e,mergeValues:r,resultToName:n}){return(i,o,a,s)=>{let c=a===void 0?o:a instanceof q.Name?(o instanceof q.Name?t(i,o,a):e(i,o,a),a):o instanceof q.Name?(e(i,a,o),o):r(o,a);return s===q.Name&&!(c instanceof q.Name)?n(i,c):c}}M.mergeEvaluated={props:rc({mergeNames:(t,e,r)=>t.if((0,q._)`${r} !== true && ${e} !== undefined`,()=>{t.if((0,q._)`${e} === true`,()=>t.assign(r,!0),()=>t.assign(r,(0,q._)`${r} || {}`).code((0,q._)`Object.assign(${r}, ${e})`))}),mergeToName:(t,e,r)=>t.if((0,q._)`${r} !== true`,()=>{e===!0?t.assign(r,!0):(t.assign(r,(0,q._)`${r} || {}`),yo(t,r,e))}),mergeValues:(t,e)=>t===!0?!0:{...t,...e},resultToName:sc}),items:rc({mergeNames:(t,e,r)=>t.if((0,q._)`${r} !== true && ${e} !== undefined`,()=>t.assign(r,(0,q._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),mergeToName:(t,e,r)=>t.if((0,q._)`${r} !== true`,()=>t.assign(r,e===!0?!0:(0,q._)`${r} > ${e} ? ${r} : ${e}`)),mergeValues:(t,e)=>t===!0?!0:Math.max(t,e),resultToName:(t,e)=>t.var("items",e)})};function sc(t,e){if(e===!0)return t.var("props",!0);let r=t.var("props",(0,q._)`{}`);return e!==void 0&&yo(t,r,e),r}M.evaluatedPropsToName=sc;function yo(t,e,r){Object.keys(r).forEach(n=>t.assign((0,q._)`${e}${(0,q.getProperty)(n)}`,!0))}M.setEvaluated=yo;var nc={};function Xh(t,e){return t.scopeValue("func",{ref:e,code:nc[e.code]||(nc[e.code]=new zh._Code(e.code))})}M.useFunc=Xh;var go;(function(t){t[t.Num=0]="Num",t[t.Str=1]="Str"})(go||(M.Type=go={}));function Jh(t,e,r){if(t instanceof q.Name){let n=e===go.Num;return r?n?(0,q._)`"[" + ${t} + "]"`:(0,q._)`"['" + ${t} + "']"`:n?(0,q._)`"/" + ${t}`:(0,q._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`}return r?(0,q.getProperty)(t).toString():"/"+vo(t)}M.getErrorPath=Jh;function cc(t,e,r=t.opts.strictSchema){if(r){if(e=`strict mode: ${e}`,r===!0)throw new Error(e);t.self.logger.warn(e)}}M.checkStrictMode=cc});var Je=w(wo=>{"use strict";Object.defineProperty(wo,"__esModule",{value:!0});var ne=_(),Qh={data:new ne.Name("data"),valCxt:new ne.Name("valCxt"),instancePath:new ne.Name("instancePath"),parentData:new ne.Name("parentData"),parentDataProperty:new ne.Name("parentDataProperty"),rootData:new ne.Name("rootData"),dynamicAnchors:new ne.Name("dynamicAnchors"),vErrors:new ne.Name("vErrors"),errors:new ne.Name("errors"),this:new ne.Name("this"),self:new ne.Name("self"),scope:new ne.Name("scope"),json:new ne.Name("json"),jsonPos:new ne.Name("jsonPos"),jsonLen:new ne.Name("jsonLen"),jsonPart:new ne.Name("jsonPart")};wo.default=Qh});var _r=w(ie=>{"use strict";Object.defineProperty(ie,"__esModule",{value:!0});ie.extendErrors=ie.resetErrorsCount=ie.reportExtraError=ie.reportError=ie.keyword$DataError=ie.keywordError=void 0;var A=_(),Ln=C(),ue=Je();ie.keywordError={message:({keyword:t})=>(0,A.str)`must pass "${t}" keyword validation`};ie.keyword$DataError={message:({keyword:t,schemaType:e})=>e?(0,A.str)`"${t}" keyword must be ${e} ($data)`:(0,A.str)`"${t}" keyword is invalid ($data)`};function Zh(t,e=ie.keywordError,r,n){let{it:i}=t,{gen:o,compositeRule:a,allErrors:s}=i,c=lc(t,e,r);n??(a||s)?dc(o,c):uc(i,(0,A._)`[${c}]`)}ie.reportError=Zh;function em(t,e=ie.keywordError,r){let{it:n}=t,{gen:i,compositeRule:o,allErrors:a}=n,s=lc(t,e,r);dc(i,s),o||a||uc(n,ue.default.vErrors)}ie.reportExtraError=em;function tm(t,e){t.assign(ue.default.errors,e),t.if((0,A._)`${ue.default.vErrors} !== null`,()=>t.if(e,()=>t.assign((0,A._)`${ue.default.vErrors}.length`,e),()=>t.assign(ue.default.vErrors,null)))}ie.resetErrorsCount=tm;function rm({gen:t,keyword:e,schemaValue:r,data:n,errsCount:i,it:o}){if(i===void 0)throw new Error("ajv implementation error");let a=t.name("err");t.forRange("i",i,ue.default.errors,s=>{t.const(a,(0,A._)`${ue.default.vErrors}[${s}]`),t.if((0,A._)`${a}.instancePath === undefined`,()=>t.assign((0,A._)`${a}.instancePath`,(0,A.strConcat)(ue.default.instancePath,o.errorPath))),t.assign((0,A._)`${a}.schemaPath`,(0,A.str)`${o.errSchemaPath}/${e}`),o.opts.verbose&&(t.assign((0,A._)`${a}.schema`,r),t.assign((0,A._)`${a}.data`,n))})}ie.extendErrors=rm;function dc(t,e){let r=t.const("err",e);t.if((0,A._)`${ue.default.vErrors} === null`,()=>t.assign(ue.default.vErrors,(0,A._)`[${r}]`),(0,A._)`${ue.default.vErrors}.push(${r})`),t.code((0,A._)`${ue.default.errors}++`)}function uc(t,e){let{gen:r,validateName:n,schemaEnv:i}=t;i.$async?r.throw((0,A._)`new ${t.ValidationError}(${e})`):(r.assign((0,A._)`${n}.errors`,e),r.return(!1))}var bt={keyword:new A.Name("keyword"),schemaPath:new A.Name("schemaPath"),params:new A.Name("params"),propertyName:new A.Name("propertyName"),message:new A.Name("message"),schema:new A.Name("schema"),parentSchema:new A.Name("parentSchema")};function lc(t,e,r){let{createErrors:n}=t.it;return n===!1?(0,A._)`{}`:nm(t,e,r)}function nm(t,e,r={}){let{gen:n,it:i}=t,o=[im(i,r),om(t,r)];return am(t,e,o),n.object(...o)}function im({errorPath:t},{instancePath:e}){let r=e?(0,A.str)`${t}${(0,Ln.getErrorPath)(e,Ln.Type.Str)}`:t;return[ue.default.instancePath,(0,A.strConcat)(ue.default.instancePath,r)]}function om({keyword:t,it:{errSchemaPath:e}},{schemaPath:r,parentSchema:n}){let i=n?e:(0,A.str)`${e}/${t}`;return r&&(i=(0,A.str)`${i}${(0,Ln.getErrorPath)(r,Ln.Type.Str)}`),[bt.schemaPath,i]}function am(t,{params:e,message:r},n){let{keyword:i,data:o,schemaValue:a,it:s}=t,{opts:c,propertyName:d,topSchemaRef:u,schemaPath:l}=s;n.push([bt.keyword,i],[bt.params,typeof e=="function"?e(t):e||(0,A._)`{}`]),c.messages&&n.push([bt.message,typeof r=="function"?r(t):r]),c.verbose&&n.push([bt.schema,a],[bt.parentSchema,(0,A._)`${u}${l}`],[ue.default.data,o]),d&&n.push([bt.propertyName,d])}});var fc=w(Lt=>{"use strict";Object.defineProperty(Lt,"__esModule",{value:!0});Lt.boolOrEmptySchema=Lt.topBoolOrEmptySchema=void 0;var sm=_r(),cm=_(),dm=Je(),um={message:"boolean schema is false"};function lm(t){let{gen:e,schema:r,validateName:n}=t;r===!1?pc(t,!1):typeof r=="object"&&r.$async===!0?e.return(dm.default.data):(e.assign((0,cm._)`${n}.errors`,null),e.return(!0))}Lt.topBoolOrEmptySchema=lm;function pm(t,e){let{gen:r,schema:n}=t;n===!1?(r.var(e,!1),pc(t)):r.var(e,!0)}Lt.boolOrEmptySchema=pm;function pc(t,e){let{gen:r,data:n}=t,i={gen:r,keyword:"false schema",data:n,schema:!1,schemaCode:!1,schemaValue:!1,params:{},it:t};(0,sm.reportError)(i,um,void 0,e)}});var xo=w(Ut=>{"use strict";Object.defineProperty(Ut,"__esModule",{value:!0});Ut.getRules=Ut.isJSONType=void 0;var fm=["string","number","integer","boolean","null","object","array"],hm=new Set(fm);function mm(t){return typeof t=="string"&&hm.has(t)}Ut.isJSONType=mm;function gm(){let t={number:{type:"number",rules:[]},string:{type:"string",rules:[]},array:{type:"array",rules:[]},object:{type:"object",rules:[]}};return{types:{...t,integer:!0,boolean:!0,null:!0},rules:[{rules:[]},t.number,t.string,t.array,t.object],post:{rules:[]},all:{},keywords:{}}}Ut.getRules=gm});var bo=w(at=>{"use strict";Object.defineProperty(at,"__esModule",{value:!0});at.shouldUseRule=at.shouldUseGroup=at.schemaHasRulesForType=void 0;function vm({schema:t,self:e},r){let n=e.RULES.types[r];return n&&n!==!0&&hc(t,n)}at.schemaHasRulesForType=vm;function hc(t,e){return e.rules.some(r=>mc(t,r))}at.shouldUseGroup=hc;function mc(t,e){var r;return t[e.keyword]!==void 0||((r=e.definition.implements)===null||r===void 0?void 0:r.some(n=>t[n]!==void 0))}at.shouldUseRule=mc});var $r=w(oe=>{"use strict";Object.defineProperty(oe,"__esModule",{value:!0});oe.reportTypeError=oe.checkDataTypes=oe.checkDataType=oe.coerceAndCheckDataType=oe.getJSONTypes=oe.getSchemaTypes=oe.DataType=void 0;var ym=xo(),wm=bo(),xm=_r(),D=_(),gc=C(),Gt;(function(t){t[t.Correct=0]="Correct",t[t.Wrong=1]="Wrong"})(Gt||(oe.DataType=Gt={}));function bm(t){let e=vc(t.type);if(e.includes("null")){if(t.nullable===!1)throw new Error("type: null contradicts nullable: false")}else{if(!e.length&&t.nullable!==void 0)throw new Error('"nullable" cannot be used without "type"');t.nullable===!0&&e.push("null")}return e}oe.getSchemaTypes=bm;function vc(t){let e=Array.isArray(t)?t:t?[t]:[];if(e.every(ym.isJSONType))return e;throw new Error("type must be JSONType or JSONType[]: "+e.join(","))}oe.getJSONTypes=vc;function Pm(t,e){let{gen:r,data:n,opts:i}=t,o=Im(e,i.coerceTypes),a=e.length>0&&!(o.length===0&&e.length===1&&(0,wm.schemaHasRulesForType)(t,e[0]));if(a){let s=Io(e,n,i.strictNumbers,Gt.Wrong);r.if(s,()=>{o.length?Em(t,e,o):Eo(t)})}return a}oe.coerceAndCheckDataType=Pm;var yc=new Set(["string","number","integer","boolean","null"]);function Im(t,e){return e?t.filter(r=>yc.has(r)||e==="array"&&r==="array"):[]}function Em(t,e,r){let{gen:n,data:i,opts:o}=t,a=n.let("dataType",(0,D._)`typeof ${i}`),s=n.let("coerced",(0,D._)`undefined`);o.coerceTypes==="array"&&n.if((0,D._)`${a} == 'object' && Array.isArray(${i}) && ${i}.length == 1`,()=>n.assign(i,(0,D._)`${i}[0]`).assign(a,(0,D._)`typeof ${i}`).if(Io(e,i,o.strictNumbers),()=>n.assign(s,i))),n.if((0,D._)`${s} !== undefined`);for(let d of r)(yc.has(d)||d==="array"&&o.coerceTypes==="array")&&c(d);n.else(),Eo(t),n.endIf(),n.if((0,D._)`${s} !== undefined`,()=>{n.assign(i,s),Sm(t,s)});function c(d){switch(d){case"string":n.elseIf((0,D._)`${a} == "number" || ${a} == "boolean"`).assign(s,(0,D._)`"" + ${i}`).elseIf((0,D._)`${i} === null`).assign(s,(0,D._)`""`);return;case"number":n.elseIf((0,D._)`${a} == "boolean" || ${i} === null
              || (${a} == "string" && ${i} && ${i} == +${i})`).assign(s,(0,D._)`+${i}`);return;case"integer":n.elseIf((0,D._)`${a} === "boolean" || ${i} === null
              || (${a} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(s,(0,D._)`+${i}`);return;case"boolean":n.elseIf((0,D._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(s,!1).elseIf((0,D._)`${i} === "true" || ${i} === 1`).assign(s,!0);return;case"null":n.elseIf((0,D._)`${i} === "" || ${i} === 0 || ${i} === false`),n.assign(s,null);return;case"array":n.elseIf((0,D._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${i} === null`).assign(s,(0,D._)`[${i}]`)}}}function Sm({gen:t,parentData:e,parentDataProperty:r},n){t.if((0,D._)`${e} !== undefined`,()=>t.assign((0,D._)`${e}[${r}]`,n))}function Po(t,e,r,n=Gt.Correct){let i=n===Gt.Correct?D.operators.EQ:D.operators.NEQ,o;switch(t){case"null":return(0,D._)`${e} ${i} null`;case"array":o=(0,D._)`Array.isArray(${e})`;break;case"object":o=(0,D._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;break;case"integer":o=a((0,D._)`!(${e} % 1) && !isNaN(${e})`);break;case"number":o=a();break;default:return(0,D._)`typeof ${e} ${i} ${t}`}return n===Gt.Correct?o:(0,D.not)(o);function a(s=D.nil){return(0,D.and)((0,D._)`typeof ${e} == "number"`,s,r?(0,D._)`isFinite(${e})`:D.nil)}}oe.checkDataType=Po;function Io(t,e,r,n){if(t.length===1)return Po(t[0],e,r,n);let i,o=(0,gc.toHash)(t);if(o.array&&o.object){let a=(0,D._)`typeof ${e} != "object"`;i=o.null?a:(0,D._)`!${e} || ${a}`,delete o.null,delete o.array,delete o.object}else i=D.nil;o.number&&delete o.integer;for(let a in o)i=(0,D.and)(i,Po(a,e,r,n));return i}oe.checkDataTypes=Io;var jm={message:({schema:t})=>`must be ${t}`,params:({schema:t,schemaValue:e})=>typeof t=="string"?(0,D._)`{type: ${t}}`:(0,D._)`{type: ${e}}`};function Eo(t){let e=Dm(t);(0,xm.reportError)(e,jm)}oe.reportTypeError=Eo;function Dm(t){let{gen:e,data:r,schema:n}=t,i=(0,gc.schemaRefOrVal)(t,n,"type");return{gen:e,keyword:"type",data:r,schema:n.type,schemaCode:i,schemaValue:i,parentSchema:n,params:{},it:t}}});var xc=w(Un=>{"use strict";Object.defineProperty(Un,"__esModule",{value:!0});Un.assignDefaults=void 0;var Wt=_(),_m=C();function $m(t,e){let{properties:r,items:n}=t.schema;if(e==="object"&&r)for(let i in r)wc(t,i,r[i].default);else e==="array"&&Array.isArray(n)&&n.forEach((i,o)=>wc(t,o,i.default))}Un.assignDefaults=$m;function wc(t,e,r){let{gen:n,compositeRule:i,data:o,opts:a}=t;if(r===void 0)return;let s=(0,Wt._)`${o}${(0,Wt.getProperty)(e)}`;if(i){(0,_m.checkStrictMode)(t,`default is ignored for: ${s}`);return}let c=(0,Wt._)`${s} === undefined`;a.useDefaults==="empty"&&(c=(0,Wt._)`${c} || ${s} === null || ${s} === ""`),n.if(c,(0,Wt._)`${s} = ${(0,Wt.stringify)(r)}`)}});var De=w(N=>{"use strict";Object.defineProperty(N,"__esModule",{value:!0});N.validateUnion=N.validateArray=N.usePattern=N.callValidateCode=N.schemaProperties=N.allSchemaProperties=N.noPropertyInData=N.propertyInData=N.isOwnProperty=N.hasPropFunc=N.reportMissingProp=N.checkMissingProp=N.checkReportMissingProp=void 0;var V=_(),So=C(),st=Je(),Mm=C();function Rm(t,e){let{gen:r,data:n,it:i}=t;r.if(Do(r,n,e,i.opts.ownProperties),()=>{t.setParams({missingProperty:(0,V._)`${e}`},!0),t.error()})}N.checkReportMissingProp=Rm;function km({gen:t,data:e,it:{opts:r}},n,i){return(0,V.or)(...n.map(o=>(0,V.and)(Do(t,e,o,r.ownProperties),(0,V._)`${i} = ${o}`)))}N.checkMissingProp=km;function Cm(t,e){t.setParams({missingProperty:e},!0),t.error()}N.reportMissingProp=Cm;function bc(t){return t.scopeValue("func",{ref:Object.prototype.hasOwnProperty,code:(0,V._)`Object.prototype.hasOwnProperty`})}N.hasPropFunc=bc;function jo(t,e,r){return(0,V._)`${bc(t)}.call(${e}, ${r})`}N.isOwnProperty=jo;function Am(t,e,r,n){let i=(0,V._)`${e}${(0,V.getProperty)(r)} !== undefined`;return n?(0,V._)`${i} && ${jo(t,e,r)}`:i}N.propertyInData=Am;function Do(t,e,r,n){let i=(0,V._)`${e}${(0,V.getProperty)(r)} === undefined`;return n?(0,V.or)(i,(0,V.not)(jo(t,e,r))):i}N.noPropertyInData=Do;function Pc(t){return t?Object.keys(t).filter(e=>e!=="__proto__"):[]}N.allSchemaProperties=Pc;function Tm(t,e){return Pc(e).filter(r=>!(0,So.alwaysValidSchema)(t,e[r]))}N.schemaProperties=Tm;function Om({schemaCode:t,data:e,it:{gen:r,topSchemaRef:n,schemaPath:i,errorPath:o},it:a},s,c,d){let u=d?(0,V._)`${t}, ${e}, ${n}${i}`:e,l=[[st.default.instancePath,(0,V.strConcat)(st.default.instancePath,o)],[st.default.parentData,a.parentData],[st.default.parentDataProperty,a.parentDataProperty],[st.default.rootData,st.default.rootData]];a.opts.dynamicRef&&l.push([st.default.dynamicAnchors,st.default.dynamicAnchors]);let p=(0,V._)`${u}, ${r.object(...l)}`;return c!==V.nil?(0,V._)`${s}.call(${c}, ${p})`:(0,V._)`${s}(${p})`}N.callValidateCode=Om;var Nm=(0,V._)`new RegExp`;function qm({gen:t,it:{opts:e}},r){let n=e.unicodeRegExp?"u":"",{regExp:i}=e.code,o=i(r,n);return t.scopeValue("pattern",{key:o.toString(),ref:o,code:(0,V._)`${i.code==="new RegExp"?Nm:(0,Mm.useFunc)(t,i)}(${r}, ${n})`})}N.usePattern=qm;function Vm(t){let{gen:e,data:r,keyword:n,it:i}=t,o=e.name("valid");if(i.allErrors){let s=e.let("valid",!0);return a(()=>e.assign(s,!1)),s}return e.var(o,!0),a(()=>e.break()),o;function a(s){let c=e.const("len",(0,V._)`${r}.length`);e.forRange("i",0,c,d=>{t.subschema({keyword:n,dataProp:d,dataPropType:So.Type.Num},o),e.if((0,V.not)(o),s)})}}N.validateArray=Vm;function Hm(t){let{gen:e,schema:r,keyword:n,it:i}=t;if(!Array.isArray(r))throw new Error("ajv implementation error");if(r.some(c=>(0,So.alwaysValidSchema)(i,c))&&!i.opts.unevaluated)return;let a=e.let("valid",!1),s=e.name("_valid");e.block(()=>r.forEach((c,d)=>{let u=t.subschema({keyword:n,schemaProp:d,compositeRule:!0},s);e.assign(a,(0,V._)`${a} || ${s}`),t.mergeValidEvaluated(u,s)||e.if((0,V.not)(a))})),t.result(a,()=>t.reset(),()=>t.error(!0))}N.validateUnion=Hm});var Sc=w(Fe=>{"use strict";Object.defineProperty(Fe,"__esModule",{value:!0});Fe.validateKeywordUsage=Fe.validSchemaType=Fe.funcKeywordCode=Fe.macroKeywordCode=void 0;var le=_(),Pt=Je(),Fm=De(),zm=_r();function Bm(t,e){let{gen:r,keyword:n,schema:i,parentSchema:o,it:a}=t,s=e.macro.call(a.self,i,o,a),c=Ec(r,n,s);a.opts.validateSchema!==!1&&a.self.validateSchema(s,!0);let d=r.name("valid");t.subschema({schema:s,schemaPath:le.nil,errSchemaPath:`${a.errSchemaPath}/${n}`,topSchemaRef:c,compositeRule:!0},d),t.pass(d,()=>t.error(!0))}Fe.macroKeywordCode=Bm;function Lm(t,e){var r;let{gen:n,keyword:i,schema:o,parentSchema:a,$data:s,it:c}=t;Gm(c,e);let d=!s&&e.compile?e.compile.call(c.self,o,a,c):e.validate,u=Ec(n,i,d),l=n.let("valid");t.block$data(l,p),t.ok((r=e.valid)!==null&&r!==void 0?r:l);function p(){if(e.errors===!1)f(),e.modifying&&Ic(t),g(()=>t.error());else{let v=e.async?h():m();e.modifying&&Ic(t),g(()=>Um(t,v))}}function h(){let v=n.let("ruleErrs",null);return n.try(()=>f((0,le._)`await `),I=>n.assign(l,!1).if((0,le._)`${I} instanceof ${c.ValidationError}`,()=>n.assign(v,(0,le._)`${I}.errors`),()=>n.throw(I))),v}function m(){let v=(0,le._)`${u}.errors`;return n.assign(v,null),f(le.nil),v}function f(v=e.async?(0,le._)`await `:le.nil){let I=c.opts.passContext?Pt.default.this:Pt.default.self,b=!("compile"in e&&!s||e.schema===!1);n.assign(l,(0,le._)`${v}${(0,Fm.callValidateCode)(t,u,I,b)}`,e.modifying)}function g(v){var I;n.if((0,le.not)((I=e.valid)!==null&&I!==void 0?I:l),v)}}Fe.funcKeywordCode=Lm;function Ic(t){let{gen:e,data:r,it:n}=t;e.if(n.parentData,()=>e.assign(r,(0,le._)`${n.parentData}[${n.parentDataProperty}]`))}function Um(t,e){let{gen:r}=t;r.if((0,le._)`Array.isArray(${e})`,()=>{r.assign(Pt.default.vErrors,(0,le._)`${Pt.default.vErrors} === null ? ${e} : ${Pt.default.vErrors}.concat(${e})`).assign(Pt.default.errors,(0,le._)`${Pt.default.vErrors}.length`),(0,zm.extendErrors)(t)},()=>t.error())}function Gm({schemaEnv:t},e){if(e.async&&!t.$async)throw new Error("async keyword in sync schema")}function Ec(t,e,r){if(r===void 0)throw new Error(`keyword "${e}" failed to compile`);return t.scopeValue("keyword",typeof r=="function"?{ref:r}:{ref:r,code:(0,le.stringify)(r)})}function Wm(t,e,r=!1){return!e.length||e.some(n=>n==="array"?Array.isArray(t):n==="object"?t&&typeof t=="object"&&!Array.isArray(t):typeof t==n||r&&typeof t>"u")}Fe.validSchemaType=Wm;function Ym({schema:t,opts:e,self:r,errSchemaPath:n},i,o){if(Array.isArray(i.keyword)?!i.keyword.includes(o):i.keyword!==o)throw new Error("ajv implementation error");let a=i.dependencies;if(a?.some(s=>!Object.prototype.hasOwnProperty.call(t,s)))throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);if(i.validateSchema&&!i.validateSchema(t[o])){let c=`keyword "${o}" value is invalid at path "${n}": `+r.errorsText(i.validateSchema.errors);if(e.validateSchema==="log")r.logger.error(c);else throw new Error(c)}}Fe.validateKeywordUsage=Ym});var Dc=w(ct=>{"use strict";Object.defineProperty(ct,"__esModule",{value:!0});ct.extendSubschemaMode=ct.extendSubschemaData=ct.getSubschema=void 0;var ze=_(),jc=C();function Km(t,{keyword:e,schemaProp:r,schema:n,schemaPath:i,errSchemaPath:o,topSchemaRef:a}){if(e!==void 0&&n!==void 0)throw new Error('both "keyword" and "schema" passed, only one allowed');if(e!==void 0){let s=t.schema[e];return r===void 0?{schema:s,schemaPath:(0,ze._)`${t.schemaPath}${(0,ze.getProperty)(e)}`,errSchemaPath:`${t.errSchemaPath}/${e}`}:{schema:s[r],schemaPath:(0,ze._)`${t.schemaPath}${(0,ze.getProperty)(e)}${(0,ze.getProperty)(r)}`,errSchemaPath:`${t.errSchemaPath}/${e}/${(0,jc.escapeFragment)(r)}`}}if(n!==void 0){if(i===void 0||o===void 0||a===void 0)throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');return{schema:n,schemaPath:i,topSchemaRef:a,errSchemaPath:o}}throw new Error('either "keyword" or "schema" must be passed')}ct.getSubschema=Km;function Xm(t,e,{dataProp:r,dataPropType:n,data:i,dataTypes:o,propertyName:a}){if(i!==void 0&&r!==void 0)throw new Error('both "data" and "dataProp" passed, only one allowed');let{gen:s}=e;if(r!==void 0){let{errorPath:d,dataPathArr:u,opts:l}=e,p=s.let("data",(0,ze._)`${e.data}${(0,ze.getProperty)(r)}`,!0);c(p),t.errorPath=(0,ze.str)`${d}${(0,jc.getErrorPath)(r,n,l.jsPropertySyntax)}`,t.parentDataProperty=(0,ze._)`${r}`,t.dataPathArr=[...u,t.parentDataProperty]}if(i!==void 0){let d=i instanceof ze.Name?i:s.let("data",i,!0);c(d),a!==void 0&&(t.propertyName=a)}o&&(t.dataTypes=o);function c(d){t.data=d,t.dataLevel=e.dataLevel+1,t.dataTypes=[],e.definedProperties=new Set,t.parentData=e.data,t.dataNames=[...e.dataNames,d]}}ct.extendSubschemaData=Xm;function Jm(t,{jtdDiscriminator:e,jtdMetadata:r,compositeRule:n,createErrors:i,allErrors:o}){n!==void 0&&(t.compositeRule=n),i!==void 0&&(t.createErrors=i),o!==void 0&&(t.allErrors=o),t.jtdDiscriminator=e,t.jtdMetadata=r}ct.extendSubschemaMode=Jm});var _o=w((SI,_c)=>{"use strict";_c.exports=function t(e,r){if(e===r)return!0;if(e&&r&&typeof e=="object"&&typeof r=="object"){if(e.constructor!==r.constructor)return!1;var n,i,o;if(Array.isArray(e)){if(n=e.length,n!=r.length)return!1;for(i=n;i--!==0;)if(!t(e[i],r[i]))return!1;return!0}if(e.constructor===RegExp)return e.source===r.source&&e.flags===r.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===r.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===r.toString();if(o=Object.keys(e),n=o.length,n!==Object.keys(r).length)return!1;for(i=n;i--!==0;)if(!Object.prototype.hasOwnProperty.call(r,o[i]))return!1;for(i=n;i--!==0;){var a=o[i];if(!t(e[a],r[a]))return!1}return!0}return e!==e&&r!==r}});var Mc=w((jI,$c)=>{"use strict";var dt=$c.exports=function(t,e,r){typeof e=="function"&&(r=e,e={}),r=e.cb||r;var n=typeof r=="function"?r:r.pre||function(){},i=r.post||function(){};Gn(e,n,i,t,"",t)};dt.keywords={additionalItems:!0,items:!0,contains:!0,additionalProperties:!0,propertyNames:!0,not:!0,if:!0,then:!0,else:!0};dt.arrayKeywords={items:!0,allOf:!0,anyOf:!0,oneOf:!0};dt.propsKeywords={$defs:!0,definitions:!0,properties:!0,patternProperties:!0,dependencies:!0};dt.skipKeywords={default:!0,enum:!0,const:!0,required:!0,maximum:!0,minimum:!0,exclusiveMaximum:!0,exclusiveMinimum:!0,multipleOf:!0,maxLength:!0,minLength:!0,pattern:!0,format:!0,maxItems:!0,minItems:!0,uniqueItems:!0,maxProperties:!0,minProperties:!0};function Gn(t,e,r,n,i,o,a,s,c,d){if(n&&typeof n=="object"&&!Array.isArray(n)){e(n,i,o,a,s,c,d);for(var u in n){var l=n[u];if(Array.isArray(l)){if(u in dt.arrayKeywords)for(var p=0;p<l.length;p++)Gn(t,e,r,l[p],i+"/"+u+"/"+p,o,i,u,n,p)}else if(u in dt.propsKeywords){if(l&&typeof l=="object")for(var h in l)Gn(t,e,r,l[h],i+"/"+u+"/"+Qm(h),o,i,u,n,h)}else(u in dt.keywords||t.allKeys&&!(u in dt.skipKeywords))&&Gn(t,e,r,l,i+"/"+u,o,i,u,n)}r(n,i,o,a,s,c,d)}}function Qm(t){return t.replace(/~/g,"~0").replace(/\//g,"~1")}});var Mr=w(xe=>{"use strict";Object.defineProperty(xe,"__esModule",{value:!0});xe.getSchemaRefs=xe.resolveUrl=xe.normalizeId=xe._getFullPath=xe.getFullPath=xe.inlineRef=void 0;var Zm=C(),eg=_o(),tg=Mc(),rg=new Set(["type","format","pattern","maxLength","minLength","maxProperties","minProperties","maxItems","minItems","maximum","minimum","uniqueItems","multipleOf","required","enum","const"]);function ng(t,e=!0){return typeof t=="boolean"?!0:e===!0?!$o(t):e?Rc(t)<=e:!1}xe.inlineRef=ng;var ig=new Set(["$ref","$recursiveRef","$recursiveAnchor","$dynamicRef","$dynamicAnchor"]);function $o(t){for(let e in t){if(ig.has(e))return!0;let r=t[e];if(Array.isArray(r)&&r.some($o)||typeof r=="object"&&$o(r))return!0}return!1}function Rc(t){let e=0;for(let r in t){if(r==="$ref")return 1/0;if(e++,!rg.has(r)&&(typeof t[r]=="object"&&(0,Zm.eachItem)(t[r],n=>e+=Rc(n)),e===1/0))return 1/0}return e}function kc(t,e="",r){r!==!1&&(e=Yt(e));let n=t.parse(e);return Cc(t,n)}xe.getFullPath=kc;function Cc(t,e){return t.serialize(e).split("#")[0]+"#"}xe._getFullPath=Cc;var og=/#\/?$/;function Yt(t){return t?t.replace(og,""):""}xe.normalizeId=Yt;function ag(t,e,r){return r=Yt(r),t.resolve(e,r)}xe.resolveUrl=ag;var sg=/^[a-z_][-a-z0-9._]*$/i;function cg(t,e){if(typeof t=="boolean")return{};let{schemaId:r,uriResolver:n}=this.opts,i=Yt(t[r]||e),o={"":i},a=kc(n,i,!1),s={},c=new Set;return tg(t,{allKeys:!0},(l,p,h,m)=>{if(m===void 0)return;let f=a+p,g=o[m];typeof l[r]=="string"&&(g=v.call(this,l[r])),I.call(this,l.$anchor),I.call(this,l.$dynamicAnchor),o[p]=g;function v(b){let S=this.opts.uriResolver.resolve;if(b=Yt(g?S(g,b):b),c.has(b))throw u(b);c.add(b);let P=this.refs[b];return typeof P=="string"&&(P=this.refs[P]),typeof P=="object"?d(l,P.schema,b):b!==Yt(f)&&(b[0]==="#"?(d(l,s[b],b),s[b]=l):this.refs[b]=f),b}function I(b){if(typeof b=="string"){if(!sg.test(b))throw new Error(`invalid anchor "${b}"`);v.call(this,`#${b}`)}}}),s;function d(l,p,h){if(p!==void 0&&!eg(l,p))throw u(h)}function u(l){return new Error(`reference "${l}" resolves to more than one schema`)}}xe.getSchemaRefs=cg});var Cr=w(ut=>{"use strict";Object.defineProperty(ut,"__esModule",{value:!0});ut.getData=ut.KeywordCxt=ut.validateFunctionCode=void 0;var qc=fc(),Ac=$r(),Ro=bo(),Wn=$r(),dg=xc(),kr=Sc(),Mo=Dc(),x=_(),E=Je(),ug=Mr(),Qe=C(),Rr=_r();function lg(t){if(Fc(t)&&(zc(t),Hc(t))){hg(t);return}Vc(t,()=>(0,qc.topBoolOrEmptySchema)(t))}ut.validateFunctionCode=lg;function Vc({gen:t,validateName:e,schema:r,schemaEnv:n,opts:i},o){i.code.es5?t.func(e,(0,x._)`${E.default.data}, ${E.default.valCxt}`,n.$async,()=>{t.code((0,x._)`"use strict"; ${Tc(r,i)}`),fg(t,i),t.code(o)}):t.func(e,(0,x._)`${E.default.data}, ${pg(i)}`,n.$async,()=>t.code(Tc(r,i)).code(o))}function pg(t){return(0,x._)`{${E.default.instancePath}="", ${E.default.parentData}, ${E.default.parentDataProperty}, ${E.default.rootData}=${E.default.data}${t.dynamicRef?(0,x._)`, ${E.default.dynamicAnchors}={}`:x.nil}}={}`}function fg(t,e){t.if(E.default.valCxt,()=>{t.var(E.default.instancePath,(0,x._)`${E.default.valCxt}.${E.default.instancePath}`),t.var(E.default.parentData,(0,x._)`${E.default.valCxt}.${E.default.parentData}`),t.var(E.default.parentDataProperty,(0,x._)`${E.default.valCxt}.${E.default.parentDataProperty}`),t.var(E.default.rootData,(0,x._)`${E.default.valCxt}.${E.default.rootData}`),e.dynamicRef&&t.var(E.default.dynamicAnchors,(0,x._)`${E.default.valCxt}.${E.default.dynamicAnchors}`)},()=>{t.var(E.default.instancePath,(0,x._)`""`),t.var(E.default.parentData,(0,x._)`undefined`),t.var(E.default.parentDataProperty,(0,x._)`undefined`),t.var(E.default.rootData,E.default.data),e.dynamicRef&&t.var(E.default.dynamicAnchors,(0,x._)`{}`)})}function hg(t){let{schema:e,opts:r,gen:n}=t;Vc(t,()=>{r.$comment&&e.$comment&&Lc(t),wg(t),n.let(E.default.vErrors,null),n.let(E.default.errors,0),r.unevaluated&&mg(t),Bc(t),Pg(t)})}function mg(t){let{gen:e,validateName:r}=t;t.evaluated=e.const("evaluated",(0,x._)`${r}.evaluated`),e.if((0,x._)`${t.evaluated}.dynamicProps`,()=>e.assign((0,x._)`${t.evaluated}.props`,(0,x._)`undefined`)),e.if((0,x._)`${t.evaluated}.dynamicItems`,()=>e.assign((0,x._)`${t.evaluated}.items`,(0,x._)`undefined`))}function Tc(t,e){let r=typeof t=="object"&&t[e.schemaId];return r&&(e.code.source||e.code.process)?(0,x._)`/*# sourceURL=${r} */`:x.nil}function gg(t,e){if(Fc(t)&&(zc(t),Hc(t))){vg(t,e);return}(0,qc.boolOrEmptySchema)(t,e)}function Hc({schema:t,self:e}){if(typeof t=="boolean")return!t;for(let r in t)if(e.RULES.all[r])return!0;return!1}function Fc(t){return typeof t.schema!="boolean"}function vg(t,e){let{schema:r,gen:n,opts:i}=t;i.$comment&&r.$comment&&Lc(t),xg(t),bg(t);let o=n.const("_errs",E.default.errors);Bc(t,o),n.var(e,(0,x._)`${o} === ${E.default.errors}`)}function zc(t){(0,Qe.checkUnknownRules)(t),yg(t)}function Bc(t,e){if(t.opts.jtd)return Oc(t,[],!1,e);let r=(0,Ac.getSchemaTypes)(t.schema),n=(0,Ac.coerceAndCheckDataType)(t,r);Oc(t,r,!n,e)}function yg(t){let{schema:e,errSchemaPath:r,opts:n,self:i}=t;e.$ref&&n.ignoreKeywordsWithRef&&(0,Qe.schemaHasRulesButRef)(e,i.RULES)&&i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`)}function wg(t){let{schema:e,opts:r}=t;e.default!==void 0&&r.useDefaults&&r.strictSchema&&(0,Qe.checkStrictMode)(t,"default is ignored in the schema root")}function xg(t){let e=t.schema[t.opts.schemaId];e&&(t.baseId=(0,ug.resolveUrl)(t.opts.uriResolver,t.baseId,e))}function bg(t){if(t.schema.$async&&!t.schemaEnv.$async)throw new Error("async schema in sync schema")}function Lc({gen:t,schemaEnv:e,schema:r,errSchemaPath:n,opts:i}){let o=r.$comment;if(i.$comment===!0)t.code((0,x._)`${E.default.self}.logger.log(${o})`);else if(typeof i.$comment=="function"){let a=(0,x.str)`${n}/$comment`,s=t.scopeValue("root",{ref:e.root});t.code((0,x._)`${E.default.self}.opts.$comment(${o}, ${a}, ${s}.schema)`)}}function Pg(t){let{gen:e,schemaEnv:r,validateName:n,ValidationError:i,opts:o}=t;r.$async?e.if((0,x._)`${E.default.errors} === 0`,()=>e.return(E.default.data),()=>e.throw((0,x._)`new ${i}(${E.default.vErrors})`)):(e.assign((0,x._)`${n}.errors`,E.default.vErrors),o.unevaluated&&Ig(t),e.return((0,x._)`${E.default.errors} === 0`))}function Ig({gen:t,evaluated:e,props:r,items:n}){r instanceof x.Name&&t.assign((0,x._)`${e}.props`,r),n instanceof x.Name&&t.assign((0,x._)`${e}.items`,n)}function Oc(t,e,r,n){let{gen:i,schema:o,data:a,allErrors:s,opts:c,self:d}=t,{RULES:u}=d;if(o.$ref&&(c.ignoreKeywordsWithRef||!(0,Qe.schemaHasRulesButRef)(o,u))){i.block(()=>Gc(t,"$ref",u.all.$ref.definition));return}c.jtd||Eg(t,e),i.block(()=>{for(let p of u.rules)l(p);l(u.post)});function l(p){(0,Ro.shouldUseGroup)(o,p)&&(p.type?(i.if((0,Wn.checkDataType)(p.type,a,c.strictNumbers)),Nc(t,p),e.length===1&&e[0]===p.type&&r&&(i.else(),(0,Wn.reportTypeError)(t)),i.endIf()):Nc(t,p),s||i.if((0,x._)`${E.default.errors} === ${n||0}`))}}function Nc(t,e){let{gen:r,schema:n,opts:{useDefaults:i}}=t;i&&(0,dg.assignDefaults)(t,e.type),r.block(()=>{for(let o of e.rules)(0,Ro.shouldUseRule)(n,o)&&Gc(t,o.keyword,o.definition,e.type)})}function Eg(t,e){t.schemaEnv.meta||!t.opts.strictTypes||(Sg(t,e),t.opts.allowUnionTypes||jg(t,e),Dg(t,t.dataTypes))}function Sg(t,e){if(e.length){if(!t.dataTypes.length){t.dataTypes=e;return}e.forEach(r=>{Uc(t.dataTypes,r)||ko(t,`type "${r}" not allowed by context "${t.dataTypes.join(",")}"`)}),$g(t,e)}}function jg(t,e){e.length>1&&!(e.length===2&&e.includes("null"))&&ko(t,"use allowUnionTypes to allow union type keyword")}function Dg(t,e){let r=t.self.RULES.all;for(let n in r){let i=r[n];if(typeof i=="object"&&(0,Ro.shouldUseRule)(t.schema,i)){let{type:o}=i.definition;o.length&&!o.some(a=>_g(e,a))&&ko(t,`missing type "${o.join(",")}" for keyword "${n}"`)}}}function _g(t,e){return t.includes(e)||e==="number"&&t.includes("integer")}function Uc(t,e){return t.includes(e)||e==="integer"&&t.includes("number")}function $g(t,e){let r=[];for(let n of t.dataTypes)Uc(e,n)?r.push(n):e.includes("integer")&&n==="number"&&r.push("integer");t.dataTypes=r}function ko(t,e){let r=t.schemaEnv.baseId+t.errSchemaPath;e+=` at "${r}" (strictTypes)`,(0,Qe.checkStrictMode)(t,e,t.opts.strictTypes)}var Yn=class{constructor(e,r,n){if((0,kr.validateKeywordUsage)(e,r,n),this.gen=e.gen,this.allErrors=e.allErrors,this.keyword=n,this.data=e.data,this.schema=e.schema[n],this.$data=r.$data&&e.opts.$data&&this.schema&&this.schema.$data,this.schemaValue=(0,Qe.schemaRefOrVal)(e,this.schema,n,this.$data),this.schemaType=r.schemaType,this.parentSchema=e.schema,this.params={},this.it=e,this.def=r,this.$data)this.schemaCode=e.gen.const("vSchema",Wc(this.$data,e));else if(this.schemaCode=this.schemaValue,!(0,kr.validSchemaType)(this.schema,r.schemaType,r.allowUndefined))throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);("code"in r?r.trackErrors:r.errors!==!1)&&(this.errsCount=e.gen.const("_errs",E.default.errors))}result(e,r,n){this.failResult((0,x.not)(e),r,n)}failResult(e,r,n){this.gen.if(e),n?n():this.error(),r?(this.gen.else(),r(),this.allErrors&&this.gen.endIf()):this.allErrors?this.gen.endIf():this.gen.else()}pass(e,r){this.failResult((0,x.not)(e),void 0,r)}fail(e){if(e===void 0){this.error(),this.allErrors||this.gen.if(!1);return}this.gen.if(e),this.error(),this.allErrors?this.gen.endIf():this.gen.else()}fail$data(e){if(!this.$data)return this.fail(e);let{schemaCode:r}=this;this.fail((0,x._)`${r} !== undefined && (${(0,x.or)(this.invalid$data(),e)})`)}error(e,r,n){if(r){this.setParams(r),this._error(e,n),this.setParams({});return}this._error(e,n)}_error(e,r){(e?Rr.reportExtraError:Rr.reportError)(this,this.def.error,r)}$dataError(){(0,Rr.reportError)(this,this.def.$dataError||Rr.keyword$DataError)}reset(){if(this.errsCount===void 0)throw new Error('add "trackErrors" to keyword definition');(0,Rr.resetErrorsCount)(this.gen,this.errsCount)}ok(e){this.allErrors||this.gen.if(e)}setParams(e,r){r?Object.assign(this.params,e):this.params=e}block$data(e,r,n=x.nil){this.gen.block(()=>{this.check$data(e,n),r()})}check$data(e=x.nil,r=x.nil){if(!this.$data)return;let{gen:n,schemaCode:i,schemaType:o,def:a}=this;n.if((0,x.or)((0,x._)`${i} === undefined`,r)),e!==x.nil&&n.assign(e,!0),(o.length||a.validateSchema)&&(n.elseIf(this.invalid$data()),this.$dataError(),e!==x.nil&&n.assign(e,!1)),n.else()}invalid$data(){let{gen:e,schemaCode:r,schemaType:n,def:i,it:o}=this;return(0,x.or)(a(),s());function a(){if(n.length){if(!(r instanceof x.Name))throw new Error("ajv implementation error");let c=Array.isArray(n)?n:[n];return(0,x._)`${(0,Wn.checkDataTypes)(c,r,o.opts.strictNumbers,Wn.DataType.Wrong)}`}return x.nil}function s(){if(i.validateSchema){let c=e.scopeValue("validate$data",{ref:i.validateSchema});return(0,x._)`!${c}(${r})`}return x.nil}}subschema(e,r){let n=(0,Mo.getSubschema)(this.it,e);(0,Mo.extendSubschemaData)(n,this.it,e),(0,Mo.extendSubschemaMode)(n,e);let i={...this.it,...n,items:void 0,props:void 0};return gg(i,r),i}mergeEvaluated(e,r){let{it:n,gen:i}=this;n.opts.unevaluated&&(n.props!==!0&&e.props!==void 0&&(n.props=Qe.mergeEvaluated.props(i,e.props,n.props,r)),n.items!==!0&&e.items!==void 0&&(n.items=Qe.mergeEvaluated.items(i,e.items,n.items,r)))}mergeValidEvaluated(e,r){let{it:n,gen:i}=this;if(n.opts.unevaluated&&(n.props!==!0||n.items!==!0))return i.if(r,()=>this.mergeEvaluated(e,x.Name)),!0}};ut.KeywordCxt=Yn;function Gc(t,e,r,n){let i=new Yn(t,r,e);"code"in r?r.code(i,n):i.$data&&r.validate?(0,kr.funcKeywordCode)(i,r):"macro"in r?(0,kr.macroKeywordCode)(i,r):(r.compile||r.validate)&&(0,kr.funcKeywordCode)(i,r)}var Mg=/^\/(?:[^~]|~0|~1)*$/,Rg=/^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;function Wc(t,{dataLevel:e,dataNames:r,dataPathArr:n}){let i,o;if(t==="")return E.default.rootData;if(t[0]==="/"){if(!Mg.test(t))throw new Error(`Invalid JSON-pointer: ${t}`);i=t,o=E.default.rootData}else{let d=Rg.exec(t);if(!d)throw new Error(`Invalid JSON-pointer: ${t}`);let u=+d[1];if(i=d[2],i==="#"){if(u>=e)throw new Error(c("property/index",u));return n[e-u]}if(u>e)throw new Error(c("data",u));if(o=r[e-u],!i)return o}let a=o,s=i.split("/");for(let d of s)d&&(o=(0,x._)`${o}${(0,x.getProperty)((0,Qe.unescapeJsonPointer)(d))}`,a=(0,x._)`${a} && ${o}`);return a;function c(d,u){return`Cannot access ${d} ${u} levels up, current level is ${e}`}}ut.getData=Wc});var Kn=w(Ao=>{"use strict";Object.defineProperty(Ao,"__esModule",{value:!0});var Co=class extends Error{constructor(e){super("validation failed"),this.errors=e,this.ajv=this.validation=!0}};Ao.default=Co});var Ar=w(No=>{"use strict";Object.defineProperty(No,"__esModule",{value:!0});var To=Mr(),Oo=class extends Error{constructor(e,r,n,i){super(i||`can't resolve reference ${n} from id ${r}`),this.missingRef=(0,To.resolveUrl)(e,r,n),this.missingSchema=(0,To.normalizeId)((0,To.getFullPath)(e,this.missingRef))}};No.default=Oo});var Jn=w(_e=>{"use strict";Object.defineProperty(_e,"__esModule",{value:!0});_e.resolveSchema=_e.getCompilingSchema=_e.resolveRef=_e.compileSchema=_e.SchemaEnv=void 0;var Ae=_(),kg=Kn(),It=Je(),Te=Mr(),Yc=C(),Cg=Cr(),Kt=class{constructor(e){var r;this.refs={},this.dynamicAnchors={};let n;typeof e.schema=="object"&&(n=e.schema),this.schema=e.schema,this.schemaId=e.schemaId,this.root=e.root||this,this.baseId=(r=e.baseId)!==null&&r!==void 0?r:(0,Te.normalizeId)(n?.[e.schemaId||"$id"]),this.schemaPath=e.schemaPath,this.localRefs=e.localRefs,this.meta=e.meta,this.$async=n?.$async,this.refs={}}};_e.SchemaEnv=Kt;function Vo(t){let e=Kc.call(this,t);if(e)return e;let r=(0,Te.getFullPath)(this.opts.uriResolver,t.root.baseId),{es5:n,lines:i}=this.opts.code,{ownProperties:o}=this.opts,a=new Ae.CodeGen(this.scope,{es5:n,lines:i,ownProperties:o}),s;t.$async&&(s=a.scopeValue("Error",{ref:kg.default,code:(0,Ae._)`require("ajv/dist/runtime/validation_error").default`}));let c=a.scopeName("validate");t.validateName=c;let d={gen:a,allErrors:this.opts.allErrors,data:It.default.data,parentData:It.default.parentData,parentDataProperty:It.default.parentDataProperty,dataNames:[It.default.data],dataPathArr:[Ae.nil],dataLevel:0,dataTypes:[],definedProperties:new Set,topSchemaRef:a.scopeValue("schema",this.opts.code.source===!0?{ref:t.schema,code:(0,Ae.stringify)(t.schema)}:{ref:t.schema}),validateName:c,ValidationError:s,schema:t.schema,schemaEnv:t,rootId:r,baseId:t.baseId||r,schemaPath:Ae.nil,errSchemaPath:t.schemaPath||(this.opts.jtd?"":"#"),errorPath:(0,Ae._)`""`,opts:this.opts,self:this},u;try{this._compilations.add(t),(0,Cg.validateFunctionCode)(d),a.optimize(this.opts.code.optimize);let l=a.toString();u=`${a.scopeRefs(It.default.scope)}return ${l}`,this.opts.code.process&&(u=this.opts.code.process(u,t));let h=new Function(`${It.default.self}`,`${It.default.scope}`,u)(this,this.scope.get());if(this.scope.value(c,{ref:h}),h.errors=null,h.schema=t.schema,h.schemaEnv=t,t.$async&&(h.$async=!0),this.opts.code.source===!0&&(h.source={validateName:c,validateCode:l,scopeValues:a._values}),this.opts.unevaluated){let{props:m,items:f}=d;h.evaluated={props:m instanceof Ae.Name?void 0:m,items:f instanceof Ae.Name?void 0:f,dynamicProps:m instanceof Ae.Name,dynamicItems:f instanceof Ae.Name},h.source&&(h.source.evaluated=(0,Ae.stringify)(h.evaluated))}return t.validate=h,t}catch(l){throw delete t.validate,delete t.validateName,u&&this.logger.error("Error compiling schema, function code:",u),l}finally{this._compilations.delete(t)}}_e.compileSchema=Vo;function Ag(t,e,r){var n;r=(0,Te.resolveUrl)(this.opts.uriResolver,e,r);let i=t.refs[r];if(i)return i;let o=Ng.call(this,t,r);if(o===void 0){let a=(n=t.localRefs)===null||n===void 0?void 0:n[r],{schemaId:s}=this.opts;a&&(o=new Kt({schema:a,schemaId:s,root:t,baseId:e}))}if(o!==void 0)return t.refs[r]=Tg.call(this,o)}_e.resolveRef=Ag;function Tg(t){return(0,Te.inlineRef)(t.schema,this.opts.inlineRefs)?t.schema:t.validate?t:Vo.call(this,t)}function Kc(t){for(let e of this._compilations)if(Og(e,t))return e}_e.getCompilingSchema=Kc;function Og(t,e){return t.schema===e.schema&&t.root===e.root&&t.baseId===e.baseId}function Ng(t,e){let r;for(;typeof(r=this.refs[e])=="string";)e=r;return r||this.schemas[e]||Xn.call(this,t,e)}function Xn(t,e){let r=this.opts.uriResolver.parse(e),n=(0,Te._getFullPath)(this.opts.uriResolver,r),i=(0,Te.getFullPath)(this.opts.uriResolver,t.baseId,void 0);if(Object.keys(t.schema).length>0&&n===i)return qo.call(this,r,t);let o=(0,Te.normalizeId)(n),a=this.refs[o]||this.schemas[o];if(typeof a=="string"){let s=Xn.call(this,t,a);return typeof s?.schema!="object"?void 0:qo.call(this,r,s)}if(typeof a?.schema=="object"){if(a.validate||Vo.call(this,a),o===(0,Te.normalizeId)(e)){let{schema:s}=a,{schemaId:c}=this.opts,d=s[c];return d&&(i=(0,Te.resolveUrl)(this.opts.uriResolver,i,d)),new Kt({schema:s,schemaId:c,root:t,baseId:i})}return qo.call(this,r,a)}}_e.resolveSchema=Xn;var qg=new Set(["properties","patternProperties","enum","dependencies","definitions"]);function qo(t,{baseId:e,schema:r,root:n}){var i;if(((i=t.fragment)===null||i===void 0?void 0:i[0])!=="/")return;for(let s of t.fragment.slice(1).split("/")){if(typeof r=="boolean")return;let c=r[(0,Yc.unescapeFragment)(s)];if(c===void 0)return;r=c;let d=typeof r=="object"&&r[this.opts.schemaId];!qg.has(s)&&d&&(e=(0,Te.resolveUrl)(this.opts.uriResolver,e,d))}let o;if(typeof r!="boolean"&&r.$ref&&!(0,Yc.schemaHasRulesButRef)(r,this.RULES)){let s=(0,Te.resolveUrl)(this.opts.uriResolver,e,r.$ref);o=Xn.call(this,n,s)}let{schemaId:a}=this.opts;if(o=o||new Kt({schema:r,schemaId:a,root:n,baseId:e}),o.schema!==o.root.schema)return o}});var Xc=w((kI,Vg)=>{Vg.exports={$id:"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",description:"Meta-schema for $data reference (JSON AnySchema extension proposal)",type:"object",required:["$data"],properties:{$data:{type:"string",anyOf:[{format:"relative-json-pointer"},{format:"json-pointer"}]}},additionalProperties:!1}});var zo=w((CI,rd)=>{"use strict";var Hg=RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu),Qc=RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u),Ho=RegExp.prototype.test.bind(/^[\da-f]{2}$/iu),Zc=RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu),Fg=RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);function Fo(t){let e="",r=0,n=0;for(n=0;n<t.length;n++)if(r=t[n].charCodeAt(0),r!==48){if(!(r>=48&&r<=57||r>=65&&r<=70||r>=97&&r<=102))return"";e+=t[n];break}for(n+=1;n<t.length;n++){if(r=t[n].charCodeAt(0),!(r>=48&&r<=57||r>=65&&r<=70||r>=97&&r<=102))return"";e+=t[n]}return e}var zg=RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);function Jc(t){return t.length=0,!0}function Bg(t,e,r){if(t.length){let n=Fo(t);if(n!=="")e.push(n);else return r.error=!0,!1;t.length=0}return!0}function Lg(t){let e=0,r={error:!1,address:"",zone:""},n=[],i=[],o=!1,a=!1,s=Bg;for(let c=0;c<t.length;c++){let d=t[c];if(!(d==="["||d==="]"))if(d===":"){if(o===!0&&(a=!0),!s(i,n,r))break;if(++e>7){r.error=!0;break}c>0&&t[c-1]===":"&&(o=!0),n.push(":");continue}else if(d==="%"){if(!s(i,n,r))break;s=Jc}else{i.push(d);continue}}return i.length&&(s===Jc?r.zone=i.join(""):a?n.push(i.join("")):n.push(Fo(i))),r.address=n.join(""),r}function ed(t){if(Ug(t,":")<2)return{host:t,isIPV6:!1};let e=Lg(t);if(e.error)return{host:t,isIPV6:!1};{let r=e.address,n=e.address;return e.zone&&(r+="%"+e.zone,n+="%25"+e.zone),{host:r,isIPV6:!0,escapedHost:n}}}function Ug(t,e){let r=0;for(let n=0;n<t.length;n++)t[n]===e&&r++;return r}function Gg(t){let e=t,r=[],n=-1,i=0;for(;i=e.length;){if(i===1){if(e===".")break;if(e==="/"){r.push("/");break}else{r.push(e);break}}else if(i===2){if(e[0]==="."){if(e[1]===".")break;if(e[1]==="/"){e=e.slice(2);continue}}else if(e[0]==="/"&&(e[1]==="."||e[1]==="/")){r.push("/");break}}else if(i===3&&e==="/.."){r.length!==0&&r.pop(),r.push("/");break}if(e[0]==="."){if(e[1]==="."){if(e[2]==="/"){e=e.slice(3);continue}}else if(e[1]==="/"){e=e.slice(2);continue}}else if(e[0]==="/"&&e[1]==="."){if(e[2]==="/"){e=e.slice(2);continue}else if(e[2]==="."&&e[3]==="/"){e=e.slice(3),r.length!==0&&r.pop();continue}}if((n=e.indexOf("/",1))===-1){r.push(e);break}else r.push(e.slice(0,n)),e=e.slice(n)}return r.join("")}var Wg={"@":"%40","/":"%2F","?":"%3F","#":"%23",":":"%3A"},Yg=/[@/?#:]/g,Kg=/[@/?#]/g;function td(t,e){let r=e?Kg:Yg;return r.lastIndex=0,t.replace(r,n=>Wg[n])}function Xg(t,e=!1){if(t.indexOf("%")===-1)return t;let r="";for(let n=0;n<t.length;n++){if(t[n]==="%"&&n+2<t.length){let i=t.slice(n+1,n+3);if(Ho(i)){let o=i.toUpperCase(),a=String.fromCharCode(parseInt(o,16));e&&Zc(a)?r+=a:r+="%"+o,n+=2;continue}}r+=t[n]}return r}function Jg(t){let e="";for(let r=0;r<t.length;r++){if(t[r]==="%"&&r+2<t.length){let n=t.slice(r+1,r+3);if(Ho(n)){let i=n.toUpperCase(),o=String.fromCharCode(parseInt(i,16));o!=="."&&Zc(o)?e+=o:e+="%"+i,r+=2;continue}}Fg(t[r])?e+=t[r]:e+=escape(t[r])}return e}function Qg(t){let e="";for(let r=0;r<t.length;r++){if(t[r]==="%"&&r+2<t.length){let n=t.slice(r+1,r+3);if(Ho(n)){e+="%"+n.toUpperCase(),r+=2;continue}}e+=escape(t[r])}return e}function Zg(t){let e=[];if(t.userinfo!==void 0&&(e.push(t.userinfo),e.push("@")),t.host!==void 0){let r=unescape(t.host);if(!Qc(r)){let n=ed(r);n.isIPV6===!0?r=`[${n.escapedHost}]`:r=td(r,!1)}e.push(r)}return(typeof t.port=="number"||typeof t.port=="string")&&(e.push(":"),e.push(String(t.port))),e.length?e.join(""):void 0}rd.exports={nonSimpleDomain:zg,recomposeAuthority:Zg,reescapeHostDelimiters:td,normalizePercentEncoding:Xg,normalizePathEncoding:Jg,escapePreservingEscapes:Qg,removeDotSegments:Gg,isIPv4:Qc,isUUID:Hg,normalizeIPv6:ed,stringArrayToHexStripped:Fo}});var sd=w((AI,ad)=>{"use strict";var{isUUID:ev}=zo(),tv=/([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu,rv=["http","https","ws","wss","urn","urn:uuid"];function nv(t){return rv.indexOf(t)!==-1}function Bo(t){return t.secure===!0?!0:t.secure===!1?!1:t.scheme?t.scheme.length===3&&(t.scheme[0]==="w"||t.scheme[0]==="W")&&(t.scheme[1]==="s"||t.scheme[1]==="S")&&(t.scheme[2]==="s"||t.scheme[2]==="S"):!1}function nd(t){return t.host||(t.error=t.error||"HTTP URIs must have a host."),t}function id(t){let e=String(t.scheme).toLowerCase()==="https";return(t.port===(e?443:80)||t.port==="")&&(t.port=void 0),t.path||(t.path="/"),t}function iv(t){return t.secure=Bo(t),t.resourceName=(t.path||"/")+(t.query?"?"+t.query:""),t.path=void 0,t.query=void 0,t}function ov(t){if((t.port===(Bo(t)?443:80)||t.port==="")&&(t.port=void 0),typeof t.secure=="boolean"&&(t.scheme=t.secure?"wss":"ws",t.secure=void 0),t.resourceName){let[e,r]=t.resourceName.split("?");t.path=e&&e!=="/"?e:void 0,t.query=r,t.resourceName=void 0}return t.fragment=void 0,t}function av(t,e){if(!t.path)return t.error="URN can not be parsed",t;let r=t.path.match(tv);if(r){let n=e.scheme||t.scheme||"urn";t.nid=r[1].toLowerCase(),t.nss=r[2];let i=`${n}:${e.nid||t.nid}`,o=Lo(i);t.path=void 0,o&&(t=o.parse(t,e))}else t.error=t.error||"URN can not be parsed.";return t}function sv(t,e){if(t.nid===void 0)throw new Error("URN without nid cannot be serialized");let r=e.scheme||t.scheme||"urn",n=t.nid.toLowerCase(),i=`${r}:${e.nid||n}`,o=Lo(i);o&&(t=o.serialize(t,e));let a=t,s=t.nss;return a.path=`${n||e.nid}:${s}`,e.skipEscape=!0,a}function cv(t,e){let r=t;return r.uuid=r.nss,r.nss=void 0,!e.tolerant&&(!r.uuid||!ev(r.uuid))&&(r.error=r.error||"UUID is not valid."),r}function dv(t){let e=t;return e.nss=(t.uuid||"").toLowerCase(),e}var od={scheme:"http",domainHost:!0,parse:nd,serialize:id},uv={scheme:"https",domainHost:od.domainHost,parse:nd,serialize:id},Qn={scheme:"ws",domainHost:!0,parse:iv,serialize:ov},lv={scheme:"wss",domainHost:Qn.domainHost,parse:Qn.parse,serialize:Qn.serialize},pv={scheme:"urn",parse:av,serialize:sv,skipNormalize:!0},fv={scheme:"urn:uuid",parse:cv,serialize:dv,skipNormalize:!0},Zn={http:od,https:uv,ws:Qn,wss:lv,urn:pv,"urn:uuid":fv};Object.setPrototypeOf(Zn,null);function Lo(t){return t&&(Zn[t]||Zn[t.toLowerCase()])||void 0}ad.exports={wsIsSecure:Bo,SCHEMES:Zn,isValidSchemeName:nv,getSchemeHandler:Lo}});var fd=w((TI,ei)=>{"use strict";var{normalizeIPv6:hv,removeDotSegments:Tr,recomposeAuthority:mv,normalizePercentEncoding:gv,normalizePathEncoding:vv,escapePreservingEscapes:yv,reescapeHostDelimiters:wv,isIPv4:xv,nonSimpleDomain:bv}=zo(),{SCHEMES:Pv,getSchemeHandler:dd}=sd();function Iv(t,e){return typeof t=="string"?t=$v(t,e):typeof t=="object"&&(t=Xt(Et(t,e),e)),t}function Ev(t,e,r){let n=r?Object.assign({scheme:"null"},r):{scheme:"null"},i=ud(Xt(t,n),Xt(e,n),n,!0);return n.skipEscape=!0,Et(i,n)}function ud(t,e,r,n){let i={};return n||(t=Xt(Et(t,r),r),e=Xt(Et(e,r),r)),r=r||{},!r.tolerant&&e.scheme?(i.scheme=e.scheme,i.userinfo=e.userinfo,i.host=e.host,i.port=e.port,i.path=Tr(e.path||""),i.query=e.query):(e.userinfo!==void 0||e.host!==void 0||e.port!==void 0?(i.userinfo=e.userinfo,i.host=e.host,i.port=e.port,i.path=Tr(e.path||""),i.query=e.query):(e.path?(e.path[0]==="/"?i.path=Tr(e.path):((t.userinfo!==void 0||t.host!==void 0||t.port!==void 0)&&!t.path?i.path="/"+e.path:t.path?i.path=t.path.slice(0,t.path.lastIndexOf("/")+1)+e.path:i.path=e.path,i.path=Tr(i.path)),i.query=e.query):(i.path=t.path,e.query!==void 0?i.query=e.query:i.query=t.query),i.userinfo=t.userinfo,i.host=t.host,i.port=t.port),i.scheme=t.scheme),i.fragment=e.fragment,i}function Sv(t,e,r){let n=cd(t,r),i=cd(e,r);return n!==void 0&&i!==void 0&&n.toLowerCase()===i.toLowerCase()}function Et(t,e){let r={host:t.host,scheme:t.scheme,userinfo:t.userinfo,port:t.port,path:t.path,query:t.query,nid:t.nid,nss:t.nss,uuid:t.uuid,fragment:t.fragment,reference:t.reference,resourceName:t.resourceName,secure:t.secure,error:""},n=Object.assign({},e),i=[],o=dd(n.scheme||r.scheme);o&&o.serialize&&o.serialize(r,n),r.path!==void 0&&(n.skipEscape?r.path=gv(r.path):(r.path=yv(r.path),r.scheme!==void 0&&(r.path=r.path.split("%3A").join(":")))),n.reference!=="suffix"&&r.scheme&&i.push(r.scheme,":");let a=mv(r);if(a!==void 0&&(n.reference!=="suffix"&&i.push("//"),i.push(a),r.path&&r.path[0]!=="/"&&i.push("/")),r.path!==void 0){let s=r.path;!n.absolutePath&&(!o||!o.absolutePath)&&(s=Tr(s)),a===void 0&&s[0]==="/"&&s[1]==="/"&&(s="/%2F"+s.slice(2)),i.push(s)}return r.query!==void 0&&i.push("?",r.query),r.fragment!==void 0&&i.push("#",r.fragment),i.join("")}var jv=/^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u,Dv=/^(?:[^#/:?]+:)?\/\/([^/?#]*)/;function _v(t,e){if(e[2]!==void 0&&t.path&&t.path[0]!=="/")return'URI path must start with "/" when authority is present.';if(typeof t.port=="number"&&(t.port<0||t.port>65535))return"URI port is malformed."}function ld(t,e){let r=Object.assign({},e),n={scheme:void 0,userinfo:void 0,host:"",port:void 0,path:"",query:void 0,fragment:void 0},i=!1,o=!1;r.reference==="suffix"&&(r.scheme?t=r.scheme+":"+t:t="//"+t);let a=t.match(Dv);a!==null&&a[1].indexOf("\\")!==-1&&(n.error="URI authority must not contain a literal backslash.",i=!0);let s=t.match(jv);if(s){n.scheme=s[1],n.userinfo=s[3],n.host=s[4],n.port=parseInt(s[5],10),n.path=s[6]||"",n.query=s[7],n.fragment=s[8],isNaN(n.port)&&(n.port=s[5]);let c=_v(n,s);if(c!==void 0&&(n.error=n.error||c,i=!0),n.host)if(xv(n.host)===!1){let l=hv(n.host);n.host=l.host.toLowerCase(),o=l.isIPV6}else o=!0;n.scheme===void 0&&n.userinfo===void 0&&n.host===void 0&&n.port===void 0&&n.query===void 0&&!n.path?n.reference="same-document":n.scheme===void 0?n.reference="relative":n.fragment===void 0?n.reference="absolute":n.reference="uri",r.reference&&r.reference!=="suffix"&&r.reference!==n.reference&&(n.error=n.error||"URI is not a "+r.reference+" reference.");let d=dd(r.scheme||n.scheme);if(!r.unicodeSupport&&(!d||!d.unicodeSupport)&&n.host&&(r.domainHost||d&&d.domainHost)&&o===!1&&bv(n.host))try{n.host=new URL("http://"+n.host).hostname}catch(u){n.error=n.error||"Host's domain name can not be converted to ASCII: "+u}if((!d||d&&!d.skipNormalize)&&(t.indexOf("%")!==-1&&(n.scheme!==void 0&&(n.scheme=unescape(n.scheme)),n.host!==void 0&&(n.host=wv(unescape(n.host),o))),n.path&&(n.path=vv(n.path)),n.fragment))try{n.fragment=encodeURI(decodeURIComponent(n.fragment))}catch{n.error=n.error||"URI malformed"}d&&d.parse&&d.parse(n,r)}else n.error=n.error||"URI can not be parsed.";return{parsed:n,malformedAuthorityOrPort:i}}function Xt(t,e){return ld(t,e).parsed}function $v(t,e){return pd(t,e).normalized}function pd(t,e){let{parsed:r,malformedAuthorityOrPort:n}=ld(t,e);return{normalized:n?t:Et(r,e),malformedAuthorityOrPort:n}}function cd(t,e){if(typeof t=="string"){let{normalized:r,malformedAuthorityOrPort:n}=pd(t,e);return n?void 0:r}if(typeof t=="object")return Et(t,e)}var Uo={SCHEMES:Pv,normalize:Iv,resolve:Ev,resolveComponent:ud,equal:Sv,serialize:Et,parse:Xt};ei.exports=Uo;ei.exports.default=Uo;ei.exports.fastUri=Uo});var md=w(Go=>{"use strict";Object.defineProperty(Go,"__esModule",{value:!0});var hd=fd();hd.code='require("ajv/dist/runtime/uri").default';Go.default=hd});var Id=w(Q=>{"use strict";Object.defineProperty(Q,"__esModule",{value:!0});Q.CodeGen=Q.Name=Q.nil=Q.stringify=Q.str=Q._=Q.KeywordCxt=void 0;var Mv=Cr();Object.defineProperty(Q,"KeywordCxt",{enumerable:!0,get:function(){return Mv.KeywordCxt}});var Jt=_();Object.defineProperty(Q,"_",{enumerable:!0,get:function(){return Jt._}});Object.defineProperty(Q,"str",{enumerable:!0,get:function(){return Jt.str}});Object.defineProperty(Q,"stringify",{enumerable:!0,get:function(){return Jt.stringify}});Object.defineProperty(Q,"nil",{enumerable:!0,get:function(){return Jt.nil}});Object.defineProperty(Q,"Name",{enumerable:!0,get:function(){return Jt.Name}});Object.defineProperty(Q,"CodeGen",{enumerable:!0,get:function(){return Jt.CodeGen}});var Rv=Kn(),xd=Ar(),kv=xo(),Or=Jn(),Cv=_(),Nr=Mr(),ti=$r(),Yo=C(),gd=Xc(),Av=md(),bd=(t,e)=>new RegExp(t,e);bd.code="new RegExp";var Tv=["removeAdditional","useDefaults","coerceTypes"],Ov=new Set(["validate","serialize","parse","wrapper","root","schema","keyword","pattern","formats","validate$data","func","obj","Error"]),Nv={errorDataPath:"",format:"`validateFormats: false` can be used instead.",nullable:'"nullable" keyword is supported by default.',jsonPointers:"Deprecated jsPropertySyntax can be used instead.",extendRefs:"Deprecated ignoreKeywordsWithRef can be used instead.",missingRefs:"Pass empty schema with $id that should be ignored to ajv.addSchema.",processCode:"Use option `code: {process: (code, schemaEnv: object) => string}`",sourceCode:"Use option `code: {source: true}`",strictDefaults:"It is default now, see option `strict`.",strictKeywords:"It is default now, see option `strict`.",uniqueItems:'"uniqueItems" keyword is always validated.',unknownFormats:"Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",cache:"Map is used as cache, schema object as key.",serialize:"Map is used as cache, schema object as key.",ajvErrors:"It is default now."},qv={ignoreKeywordsWithRef:"",jsPropertySyntax:"",unicode:'"minLength"/"maxLength" account for unicode characters by default.'},vd=200;function Vv(t){var e,r,n,i,o,a,s,c,d,u,l,p,h,m,f,g,v,I,b,S,P,pe,O,fe,Qr;let dr=t.strict,ji=(e=t.code)===null||e===void 0?void 0:e.optimize,Ja=ji===!0||ji===void 0?1:ji||0,Qa=(n=(r=t.code)===null||r===void 0?void 0:r.regExp)!==null&&n!==void 0?n:bd,ll=(i=t.uriResolver)!==null&&i!==void 0?i:Av.default;return{strictSchema:(a=(o=t.strictSchema)!==null&&o!==void 0?o:dr)!==null&&a!==void 0?a:!0,strictNumbers:(c=(s=t.strictNumbers)!==null&&s!==void 0?s:dr)!==null&&c!==void 0?c:!0,strictTypes:(u=(d=t.strictTypes)!==null&&d!==void 0?d:dr)!==null&&u!==void 0?u:"log",strictTuples:(p=(l=t.strictTuples)!==null&&l!==void 0?l:dr)!==null&&p!==void 0?p:"log",strictRequired:(m=(h=t.strictRequired)!==null&&h!==void 0?h:dr)!==null&&m!==void 0?m:!1,code:t.code?{...t.code,optimize:Ja,regExp:Qa}:{optimize:Ja,regExp:Qa},loopRequired:(f=t.loopRequired)!==null&&f!==void 0?f:vd,loopEnum:(g=t.loopEnum)!==null&&g!==void 0?g:vd,meta:(v=t.meta)!==null&&v!==void 0?v:!0,messages:(I=t.messages)!==null&&I!==void 0?I:!0,inlineRefs:(b=t.inlineRefs)!==null&&b!==void 0?b:!0,schemaId:(S=t.schemaId)!==null&&S!==void 0?S:"$id",addUsedSchema:(P=t.addUsedSchema)!==null&&P!==void 0?P:!0,validateSchema:(pe=t.validateSchema)!==null&&pe!==void 0?pe:!0,validateFormats:(O=t.validateFormats)!==null&&O!==void 0?O:!0,unicodeRegExp:(fe=t.unicodeRegExp)!==null&&fe!==void 0?fe:!0,int32range:(Qr=t.int32range)!==null&&Qr!==void 0?Qr:!0,uriResolver:ll}}var qr=class{constructor(e={}){this.schemas={},this.refs={},this.formats=Object.create(null),this._compilations=new Set,this._loading={},this._cache=new Map,e=this.opts={...e,...Vv(e)};let{es5:r,lines:n}=this.opts.code;this.scope=new Cv.ValueScope({scope:{},prefixes:Ov,es5:r,lines:n}),this.logger=Uv(e.logger);let i=e.validateFormats;e.validateFormats=!1,this.RULES=(0,kv.getRules)(),yd.call(this,Nv,e,"NOT SUPPORTED"),yd.call(this,qv,e,"DEPRECATED","warn"),this._metaOpts=Bv.call(this),e.formats&&Fv.call(this),this._addVocabularies(),this._addDefaultMetaSchema(),e.keywords&&zv.call(this,e.keywords),typeof e.meta=="object"&&this.addMetaSchema(e.meta),Hv.call(this),e.validateFormats=i}_addVocabularies(){this.addKeyword("$async")}_addDefaultMetaSchema(){let{$data:e,meta:r,schemaId:n}=this.opts,i=gd;n==="id"&&(i={...gd},i.id=i.$id,delete i.$id),r&&e&&this.addMetaSchema(i,i[n],!1)}defaultMeta(){let{meta:e,schemaId:r}=this.opts;return this.opts.defaultMeta=typeof e=="object"?e[r]||e:void 0}validate(e,r){let n;if(typeof e=="string"){if(n=this.getSchema(e),!n)throw new Error(`no schema with key or ref "${e}"`)}else n=this.compile(e);let i=n(r);return"$async"in n||(this.errors=n.errors),i}compile(e,r){let n=this._addSchema(e,r);return n.validate||this._compileSchemaEnv(n)}compileAsync(e,r){if(typeof this.opts.loadSchema!="function")throw new Error("options.loadSchema should be a function");let{loadSchema:n}=this.opts;return i.call(this,e,r);async function i(u,l){await o.call(this,u.$schema);let p=this._addSchema(u,l);return p.validate||a.call(this,p)}async function o(u){u&&!this.getSchema(u)&&await i.call(this,{$ref:u},!0)}async function a(u){try{return this._compileSchemaEnv(u)}catch(l){if(!(l instanceof xd.default))throw l;return s.call(this,l),await c.call(this,l.missingSchema),a.call(this,u)}}function s({missingSchema:u,missingRef:l}){if(this.refs[u])throw new Error(`AnySchema ${u} is loaded but ${l} cannot be resolved`)}async function c(u){let l=await d.call(this,u);this.refs[u]||await o.call(this,l.$schema),this.refs[u]||this.addSchema(l,u,r)}async function d(u){let l=this._loading[u];if(l)return l;try{return await(this._loading[u]=n(u))}finally{delete this._loading[u]}}}addSchema(e,r,n,i=this.opts.validateSchema){if(Array.isArray(e)){for(let a of e)this.addSchema(a,void 0,n,i);return this}let o;if(typeof e=="object"){let{schemaId:a}=this.opts;if(o=e[a],o!==void 0&&typeof o!="string")throw new Error(`schema ${a} must be string`)}return r=(0,Nr.normalizeId)(r||o),this._checkUnique(r),this.schemas[r]=this._addSchema(e,n,r,i,!0),this}addMetaSchema(e,r,n=this.opts.validateSchema){return this.addSchema(e,r,!0,n),this}validateSchema(e,r){if(typeof e=="boolean")return!0;let n;if(n=e.$schema,n!==void 0&&typeof n!="string")throw new Error("$schema must be a string");if(n=n||this.opts.defaultMeta||this.defaultMeta(),!n)return this.logger.warn("meta-schema not available"),this.errors=null,!0;let i=this.validate(n,e);if(!i&&r){let o="schema is invalid: "+this.errorsText();if(this.opts.validateSchema==="log")this.logger.error(o);else throw new Error(o)}return i}getSchema(e){let r;for(;typeof(r=wd.call(this,e))=="string";)e=r;if(r===void 0){let{schemaId:n}=this.opts,i=new Or.SchemaEnv({schema:{},schemaId:n});if(r=Or.resolveSchema.call(this,i,e),!r)return;this.refs[e]=r}return r.validate||this._compileSchemaEnv(r)}removeSchema(e){if(e instanceof RegExp)return this._removeAllSchemas(this.schemas,e),this._removeAllSchemas(this.refs,e),this;switch(typeof e){case"undefined":return this._removeAllSchemas(this.schemas),this._removeAllSchemas(this.refs),this._cache.clear(),this;case"string":{let r=wd.call(this,e);return typeof r=="object"&&this._cache.delete(r.schema),delete this.schemas[e],delete this.refs[e],this}case"object":{let r=e;this._cache.delete(r);let n=e[this.opts.schemaId];return n&&(n=(0,Nr.normalizeId)(n),delete this.schemas[n],delete this.refs[n]),this}default:throw new Error("ajv.removeSchema: invalid parameter")}}addVocabulary(e){for(let r of e)this.addKeyword(r);return this}addKeyword(e,r){let n;if(typeof e=="string")n=e,typeof r=="object"&&(this.logger.warn("these parameters are deprecated, see docs for addKeyword"),r.keyword=n);else if(typeof e=="object"&&r===void 0){if(r=e,n=r.keyword,Array.isArray(n)&&!n.length)throw new Error("addKeywords: keyword must be string or non-empty array")}else throw new Error("invalid addKeywords parameters");if(Wv.call(this,n,r),!r)return(0,Yo.eachItem)(n,o=>Wo.call(this,o)),this;Kv.call(this,r);let i={...r,type:(0,ti.getJSONTypes)(r.type),schemaType:(0,ti.getJSONTypes)(r.schemaType)};return(0,Yo.eachItem)(n,i.type.length===0?o=>Wo.call(this,o,i):o=>i.type.forEach(a=>Wo.call(this,o,i,a))),this}getKeyword(e){let r=this.RULES.all[e];return typeof r=="object"?r.definition:!!r}removeKeyword(e){let{RULES:r}=this;delete r.keywords[e],delete r.all[e];for(let n of r.rules){let i=n.rules.findIndex(o=>o.keyword===e);i>=0&&n.rules.splice(i,1)}return this}addFormat(e,r){return typeof r=="string"&&(r=new RegExp(r)),this.formats[e]=r,this}errorsText(e=this.errors,{separator:r=", ",dataVar:n="data"}={}){return!e||e.length===0?"No errors":e.map(i=>`${n}${i.instancePath} ${i.message}`).reduce((i,o)=>i+r+o)}$dataMetaSchema(e,r){let n=this.RULES.all;e=JSON.parse(JSON.stringify(e));for(let i of r){let o=i.split("/").slice(1),a=e;for(let s of o)a=a[s];for(let s in n){let c=n[s];if(typeof c!="object")continue;let{$data:d}=c.definition,u=a[s];d&&u&&(a[s]=Pd(u))}}return e}_removeAllSchemas(e,r){for(let n in e){let i=e[n];(!r||r.test(n))&&(typeof i=="string"?delete e[n]:i&&!i.meta&&(this._cache.delete(i.schema),delete e[n]))}}_addSchema(e,r,n,i=this.opts.validateSchema,o=this.opts.addUsedSchema){let a,{schemaId:s}=this.opts;if(typeof e=="object")a=e[s];else{if(this.opts.jtd)throw new Error("schema must be object");if(typeof e!="boolean")throw new Error("schema must be object or boolean")}let c=this._cache.get(e);if(c!==void 0)return c;n=(0,Nr.normalizeId)(a||n);let d=Nr.getSchemaRefs.call(this,e,n);return c=new Or.SchemaEnv({schema:e,schemaId:s,meta:r,baseId:n,localRefs:d}),this._cache.set(c.schema,c),o&&!n.startsWith("#")&&(n&&this._checkUnique(n),this.refs[n]=c),i&&this.validateSchema(e,!0),c}_checkUnique(e){if(this.schemas[e]||this.refs[e])throw new Error(`schema with key or id "${e}" already exists`)}_compileSchemaEnv(e){if(e.meta?this._compileMetaSchema(e):Or.compileSchema.call(this,e),!e.validate)throw new Error("ajv implementation error");return e.validate}_compileMetaSchema(e){let r=this.opts;this.opts=this._metaOpts;try{Or.compileSchema.call(this,e)}finally{this.opts=r}}};qr.ValidationError=Rv.default;qr.MissingRefError=xd.default;Q.default=qr;function yd(t,e,r,n="error"){for(let i in t){let o=i;o in e&&this.logger[n](`${r}: option ${i}. ${t[o]}`)}}function wd(t){return t=(0,Nr.normalizeId)(t),this.schemas[t]||this.refs[t]}function Hv(){let t=this.opts.schemas;if(t)if(Array.isArray(t))this.addSchema(t);else for(let e in t)this.addSchema(t[e],e)}function Fv(){for(let t in this.opts.formats){let e=this.opts.formats[t];e&&this.addFormat(t,e)}}function zv(t){if(Array.isArray(t)){this.addVocabulary(t);return}this.logger.warn("keywords option as map is deprecated, pass array");for(let e in t){let r=t[e];r.keyword||(r.keyword=e),this.addKeyword(r)}}function Bv(){let t={...this.opts};for(let e of Tv)delete t[e];return t}var Lv={log(){},warn(){},error(){}};function Uv(t){if(t===!1)return Lv;if(t===void 0)return console;if(t.log&&t.warn&&t.error)return t;throw new Error("logger must implement log, warn and error methods")}var Gv=/^[a-z_$][a-z0-9_$:-]*$/i;function Wv(t,e){let{RULES:r}=this;if((0,Yo.eachItem)(t,n=>{if(r.keywords[n])throw new Error(`Keyword ${n} is already defined`);if(!Gv.test(n))throw new Error(`Keyword ${n} has invalid name`)}),!!e&&e.$data&&!("code"in e||"validate"in e))throw new Error('$data keyword must have "code" or "validate" function')}function Wo(t,e,r){var n;let i=e?.post;if(r&&i)throw new Error('keyword with "post" flag cannot have "type"');let{RULES:o}=this,a=i?o.post:o.rules.find(({type:c})=>c===r);if(a||(a={type:r,rules:[]},o.rules.push(a)),o.keywords[t]=!0,!e)return;let s={keyword:t,definition:{...e,type:(0,ti.getJSONTypes)(e.type),schemaType:(0,ti.getJSONTypes)(e.schemaType)}};e.before?Yv.call(this,a,s,e.before):a.rules.push(s),o.all[t]=s,(n=e.implements)===null||n===void 0||n.forEach(c=>this.addKeyword(c))}function Yv(t,e,r){let n=t.rules.findIndex(i=>i.keyword===r);n>=0?t.rules.splice(n,0,e):(t.rules.push(e),this.logger.warn(`rule ${r} is not defined`))}function Kv(t){let{metaSchema:e}=t;e!==void 0&&(t.$data&&this.opts.$data&&(e=Pd(e)),t.validateSchema=this.compile(e,!0))}var Xv={$ref:"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"};function Pd(t){return{anyOf:[t,Xv]}}});var Ed=w(Ko=>{"use strict";Object.defineProperty(Ko,"__esModule",{value:!0});var Jv={keyword:"id",code(){throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')}};Ko.default=Jv});var _d=w(St=>{"use strict";Object.defineProperty(St,"__esModule",{value:!0});St.callRef=St.getValidate=void 0;var Qv=Ar(),Sd=De(),be=_(),Qt=Je(),jd=Jn(),ri=C(),Zv={keyword:"$ref",schemaType:"string",code(t){let{gen:e,schema:r,it:n}=t,{baseId:i,schemaEnv:o,validateName:a,opts:s,self:c}=n,{root:d}=o;if((r==="#"||r==="#/")&&i===d.baseId)return l();let u=jd.resolveRef.call(c,d,i,r);if(u===void 0)throw new Qv.default(n.opts.uriResolver,i,r);if(u instanceof jd.SchemaEnv)return p(u);return h(u);function l(){if(o===d)return ni(t,a,o,o.$async);let m=e.scopeValue("root",{ref:d});return ni(t,(0,be._)`${m}.validate`,d,d.$async)}function p(m){let f=Dd(t,m);ni(t,f,m,m.$async)}function h(m){let f=e.scopeValue("schema",s.code.source===!0?{ref:m,code:(0,be.stringify)(m)}:{ref:m}),g=e.name("valid"),v=t.subschema({schema:m,dataTypes:[],schemaPath:be.nil,topSchemaRef:f,errSchemaPath:r},g);t.mergeEvaluated(v),t.ok(g)}}};function Dd(t,e){let{gen:r}=t;return e.validate?r.scopeValue("validate",{ref:e.validate}):(0,be._)`${r.scopeValue("wrapper",{ref:e})}.validate`}St.getValidate=Dd;function ni(t,e,r,n){let{gen:i,it:o}=t,{allErrors:a,schemaEnv:s,opts:c}=o,d=c.passContext?Qt.default.this:be.nil;n?u():l();function u(){if(!s.$async)throw new Error("async schema referenced by sync schema");let m=i.let("valid");i.try(()=>{i.code((0,be._)`await ${(0,Sd.callValidateCode)(t,e,d)}`),h(e),a||i.assign(m,!0)},f=>{i.if((0,be._)`!(${f} instanceof ${o.ValidationError})`,()=>i.throw(f)),p(f),a||i.assign(m,!1)}),t.ok(m)}function l(){t.result((0,Sd.callValidateCode)(t,e,d),()=>h(e),()=>p(e))}function p(m){let f=(0,be._)`${m}.errors`;i.assign(Qt.default.vErrors,(0,be._)`${Qt.default.vErrors} === null ? ${f} : ${Qt.default.vErrors}.concat(${f})`),i.assign(Qt.default.errors,(0,be._)`${Qt.default.vErrors}.length`)}function h(m){var f;if(!o.opts.unevaluated)return;let g=(f=r?.validate)===null||f===void 0?void 0:f.evaluated;if(o.props!==!0)if(g&&!g.dynamicProps)g.props!==void 0&&(o.props=ri.mergeEvaluated.props(i,g.props,o.props));else{let v=i.var("props",(0,be._)`${m}.evaluated.props`);o.props=ri.mergeEvaluated.props(i,v,o.props,be.Name)}if(o.items!==!0)if(g&&!g.dynamicItems)g.items!==void 0&&(o.items=ri.mergeEvaluated.items(i,g.items,o.items));else{let v=i.var("items",(0,be._)`${m}.evaluated.items`);o.items=ri.mergeEvaluated.items(i,v,o.items,be.Name)}}}St.callRef=ni;St.default=Zv});var $d=w(Xo=>{"use strict";Object.defineProperty(Xo,"__esModule",{value:!0});var ey=Ed(),ty=_d(),ry=["$schema","$id","$defs","$vocabulary",{keyword:"$comment"},"definitions",ey.default,ty.default];Xo.default=ry});var Md=w(Jo=>{"use strict";Object.defineProperty(Jo,"__esModule",{value:!0});var ii=_(),lt=ii.operators,oi={maximum:{okStr:"<=",ok:lt.LTE,fail:lt.GT},minimum:{okStr:">=",ok:lt.GTE,fail:lt.LT},exclusiveMaximum:{okStr:"<",ok:lt.LT,fail:lt.GTE},exclusiveMinimum:{okStr:">",ok:lt.GT,fail:lt.LTE}},ny={message:({keyword:t,schemaCode:e})=>(0,ii.str)`must be ${oi[t].okStr} ${e}`,params:({keyword:t,schemaCode:e})=>(0,ii._)`{comparison: ${oi[t].okStr}, limit: ${e}}`},iy={keyword:Object.keys(oi),type:"number",schemaType:"number",$data:!0,error:ny,code(t){let{keyword:e,data:r,schemaCode:n}=t;t.fail$data((0,ii._)`${r} ${oi[e].fail} ${n} || isNaN(${r})`)}};Jo.default=iy});var Rd=w(Qo=>{"use strict";Object.defineProperty(Qo,"__esModule",{value:!0});var Vr=_(),oy={message:({schemaCode:t})=>(0,Vr.str)`must be multiple of ${t}`,params:({schemaCode:t})=>(0,Vr._)`{multipleOf: ${t}}`},ay={keyword:"multipleOf",type:"number",schemaType:"number",$data:!0,error:oy,code(t){let{gen:e,data:r,schemaCode:n,it:i}=t,o=i.opts.multipleOfPrecision,a=e.let("res"),s=o?(0,Vr._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}`:(0,Vr._)`${a} !== parseInt(${a})`;t.fail$data((0,Vr._)`(${n} === 0 || (${a} = ${r}/${n}, ${s}))`)}};Qo.default=ay});var Cd=w(Zo=>{"use strict";Object.defineProperty(Zo,"__esModule",{value:!0});function kd(t){let e=t.length,r=0,n=0,i;for(;n<e;)r++,i=t.charCodeAt(n++),i>=55296&&i<=56319&&n<e&&(i=t.charCodeAt(n),(i&64512)===56320&&n++);return r}Zo.default=kd;kd.code='require("ajv/dist/runtime/ucs2length").default'});var Ad=w(ea=>{"use strict";Object.defineProperty(ea,"__esModule",{value:!0});var jt=_(),sy=C(),cy=Cd(),dy={message({keyword:t,schemaCode:e}){let r=t==="maxLength"?"more":"fewer";return(0,jt.str)`must NOT have ${r} than ${e} characters`},params:({schemaCode:t})=>(0,jt._)`{limit: ${t}}`},uy={keyword:["maxLength","minLength"],type:"string",schemaType:"number",$data:!0,error:dy,code(t){let{keyword:e,data:r,schemaCode:n,it:i}=t,o=e==="maxLength"?jt.operators.GT:jt.operators.LT,a=i.opts.unicode===!1?(0,jt._)`${r}.length`:(0,jt._)`${(0,sy.useFunc)(t.gen,cy.default)}(${r})`;t.fail$data((0,jt._)`${a} ${o} ${n}`)}};ea.default=uy});var Td=w(ta=>{"use strict";Object.defineProperty(ta,"__esModule",{value:!0});var ly=De(),py=C(),Zt=_(),fy={message:({schemaCode:t})=>(0,Zt.str)`must match pattern "${t}"`,params:({schemaCode:t})=>(0,Zt._)`{pattern: ${t}}`},hy={keyword:"pattern",type:"string",schemaType:"string",$data:!0,error:fy,code(t){let{gen:e,data:r,$data:n,schema:i,schemaCode:o,it:a}=t,s=a.opts.unicodeRegExp?"u":"";if(n){let{regExp:c}=a.opts.code,d=c.code==="new RegExp"?(0,Zt._)`new RegExp`:(0,py.useFunc)(e,c),u=e.let("valid");e.try(()=>e.assign(u,(0,Zt._)`${d}(${o}, ${s}).test(${r})`),()=>e.assign(u,!1)),t.fail$data((0,Zt._)`!${u}`)}else{let c=(0,ly.usePattern)(t,i);t.fail$data((0,Zt._)`!${c}.test(${r})`)}}};ta.default=hy});var Od=w(ra=>{"use strict";Object.defineProperty(ra,"__esModule",{value:!0});var Hr=_(),my={message({keyword:t,schemaCode:e}){let r=t==="maxProperties"?"more":"fewer";return(0,Hr.str)`must NOT have ${r} than ${e} properties`},params:({schemaCode:t})=>(0,Hr._)`{limit: ${t}}`},gy={keyword:["maxProperties","minProperties"],type:"object",schemaType:"number",$data:!0,error:my,code(t){let{keyword:e,data:r,schemaCode:n}=t,i=e==="maxProperties"?Hr.operators.GT:Hr.operators.LT;t.fail$data((0,Hr._)`Object.keys(${r}).length ${i} ${n}`)}};ra.default=gy});var Nd=w(na=>{"use strict";Object.defineProperty(na,"__esModule",{value:!0});var Fr=De(),zr=_(),vy=C(),yy={message:({params:{missingProperty:t}})=>(0,zr.str)`must have required property '${t}'`,params:({params:{missingProperty:t}})=>(0,zr._)`{missingProperty: ${t}}`},wy={keyword:"required",type:"object",schemaType:"array",$data:!0,error:yy,code(t){let{gen:e,schema:r,schemaCode:n,data:i,$data:o,it:a}=t,{opts:s}=a;if(!o&&r.length===0)return;let c=r.length>=s.loopRequired;if(a.allErrors?d():u(),s.strictRequired){let h=t.parentSchema.properties,{definedProperties:m}=t.it;for(let f of r)if(h?.[f]===void 0&&!m.has(f)){let g=a.schemaEnv.baseId+a.errSchemaPath,v=`required property "${f}" is not defined at "${g}" (strictRequired)`;(0,vy.checkStrictMode)(a,v,a.opts.strictRequired)}}function d(){if(c||o)t.block$data(zr.nil,l);else for(let h of r)(0,Fr.checkReportMissingProp)(t,h)}function u(){let h=e.let("missing");if(c||o){let m=e.let("valid",!0);t.block$data(m,()=>p(h,m)),t.ok(m)}else e.if((0,Fr.checkMissingProp)(t,r,h)),(0,Fr.reportMissingProp)(t,h),e.else()}function l(){e.forOf("prop",n,h=>{t.setParams({missingProperty:h}),e.if((0,Fr.noPropertyInData)(e,i,h,s.ownProperties),()=>t.error())})}function p(h,m){t.setParams({missingProperty:h}),e.forOf(h,n,()=>{e.assign(m,(0,Fr.propertyInData)(e,i,h,s.ownProperties)),e.if((0,zr.not)(m),()=>{t.error(),e.break()})},zr.nil)}}};na.default=wy});var qd=w(ia=>{"use strict";Object.defineProperty(ia,"__esModule",{value:!0});var Br=_(),xy={message({keyword:t,schemaCode:e}){let r=t==="maxItems"?"more":"fewer";return(0,Br.str)`must NOT have ${r} than ${e} items`},params:({schemaCode:t})=>(0,Br._)`{limit: ${t}}`},by={keyword:["maxItems","minItems"],type:"array",schemaType:"number",$data:!0,error:xy,code(t){let{keyword:e,data:r,schemaCode:n}=t,i=e==="maxItems"?Br.operators.GT:Br.operators.LT;t.fail$data((0,Br._)`${r}.length ${i} ${n}`)}};ia.default=by});var ai=w(oa=>{"use strict";Object.defineProperty(oa,"__esModule",{value:!0});var Vd=_o();Vd.code='require("ajv/dist/runtime/equal").default';oa.default=Vd});var Hd=w(sa=>{"use strict";Object.defineProperty(sa,"__esModule",{value:!0});var aa=$r(),Z=_(),Py=C(),Iy=ai(),Ey={message:({params:{i:t,j:e}})=>(0,Z.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,params:({params:{i:t,j:e}})=>(0,Z._)`{i: ${t}, j: ${e}}`},Sy={keyword:"uniqueItems",type:"array",schemaType:"boolean",$data:!0,error:Ey,code(t){let{gen:e,data:r,$data:n,schema:i,parentSchema:o,schemaCode:a,it:s}=t;if(!n&&!i)return;let c=e.let("valid"),d=o.items?(0,aa.getSchemaTypes)(o.items):[];t.block$data(c,u,(0,Z._)`${a} === false`),t.ok(c);function u(){let m=e.let("i",(0,Z._)`${r}.length`),f=e.let("j");t.setParams({i:m,j:f}),e.assign(c,!0),e.if((0,Z._)`${m} > 1`,()=>(l()?p:h)(m,f))}function l(){return d.length>0&&!d.some(m=>m==="object"||m==="array")}function p(m,f){let g=e.name("item"),v=(0,aa.checkDataTypes)(d,g,s.opts.strictNumbers,aa.DataType.Wrong),I=e.const("indices",(0,Z._)`{}`);e.for((0,Z._)`;${m}--;`,()=>{e.let(g,(0,Z._)`${r}[${m}]`),e.if(v,(0,Z._)`continue`),d.length>1&&e.if((0,Z._)`typeof ${g} == "string"`,(0,Z._)`${g} += "_"`),e.if((0,Z._)`typeof ${I}[${g}] == "number"`,()=>{e.assign(f,(0,Z._)`${I}[${g}]`),t.error(),e.assign(c,!1).break()}).code((0,Z._)`${I}[${g}] = ${m}`)})}function h(m,f){let g=(0,Py.useFunc)(e,Iy.default),v=e.name("outer");e.label(v).for((0,Z._)`;${m}--;`,()=>e.for((0,Z._)`${f} = ${m}; ${f}--;`,()=>e.if((0,Z._)`${g}(${r}[${m}], ${r}[${f}])`,()=>{t.error(),e.assign(c,!1).break(v)})))}}};sa.default=Sy});var Fd=w(da=>{"use strict";Object.defineProperty(da,"__esModule",{value:!0});var ca=_(),jy=C(),Dy=ai(),_y={message:"must be equal to constant",params:({schemaCode:t})=>(0,ca._)`{allowedValue: ${t}}`},$y={keyword:"const",$data:!0,error:_y,code(t){let{gen:e,data:r,$data:n,schemaCode:i,schema:o}=t;n||o&&typeof o=="object"?t.fail$data((0,ca._)`!${(0,jy.useFunc)(e,Dy.default)}(${r}, ${i})`):t.fail((0,ca._)`${o} !== ${r}`)}};da.default=$y});var zd=w(ua=>{"use strict";Object.defineProperty(ua,"__esModule",{value:!0});var Lr=_(),My=C(),Ry=ai(),ky={message:"must be equal to one of the allowed values",params:({schemaCode:t})=>(0,Lr._)`{allowedValues: ${t}}`},Cy={keyword:"enum",schemaType:"array",$data:!0,error:ky,code(t){let{gen:e,data:r,$data:n,schema:i,schemaCode:o,it:a}=t;if(!n&&i.length===0)throw new Error("enum must have non-empty array");let s=i.length>=a.opts.loopEnum,c,d=()=>c??(c=(0,My.useFunc)(e,Ry.default)),u;if(s||n)u=e.let("valid"),t.block$data(u,l);else{if(!Array.isArray(i))throw new Error("ajv implementation error");let h=e.const("vSchema",o);u=(0,Lr.or)(...i.map((m,f)=>p(h,f)))}t.pass(u);function l(){e.assign(u,!1),e.forOf("v",o,h=>e.if((0,Lr._)`${d()}(${r}, ${h})`,()=>e.assign(u,!0).break()))}function p(h,m){let f=i[m];return typeof f=="object"&&f!==null?(0,Lr._)`${d()}(${r}, ${h}[${m}])`:(0,Lr._)`${r} === ${f}`}}};ua.default=Cy});var Bd=w(la=>{"use strict";Object.defineProperty(la,"__esModule",{value:!0});var Ay=Md(),Ty=Rd(),Oy=Ad(),Ny=Td(),qy=Od(),Vy=Nd(),Hy=qd(),Fy=Hd(),zy=Fd(),By=zd(),Ly=[Ay.default,Ty.default,Oy.default,Ny.default,qy.default,Vy.default,Hy.default,Fy.default,{keyword:"type",schemaType:["string","array"]},{keyword:"nullable",schemaType:"boolean"},zy.default,By.default];la.default=Ly});var fa=w(Ur=>{"use strict";Object.defineProperty(Ur,"__esModule",{value:!0});Ur.validateAdditionalItems=void 0;var Dt=_(),pa=C(),Uy={message:({params:{len:t}})=>(0,Dt.str)`must NOT have more than ${t} items`,params:({params:{len:t}})=>(0,Dt._)`{limit: ${t}}`},Gy={keyword:"additionalItems",type:"array",schemaType:["boolean","object"],before:"uniqueItems",error:Uy,code(t){let{parentSchema:e,it:r}=t,{items:n}=e;if(!Array.isArray(n)){(0,pa.checkStrictMode)(r,'"additionalItems" is ignored when "items" is not an array of schemas');return}Ld(t,n)}};function Ld(t,e){let{gen:r,schema:n,data:i,keyword:o,it:a}=t;a.items=!0;let s=r.const("len",(0,Dt._)`${i}.length`);if(n===!1)t.setParams({len:e.length}),t.pass((0,Dt._)`${s} <= ${e.length}`);else if(typeof n=="object"&&!(0,pa.alwaysValidSchema)(a,n)){let d=r.var("valid",(0,Dt._)`${s} <= ${e.length}`);r.if((0,Dt.not)(d),()=>c(d)),t.ok(d)}function c(d){r.forRange("i",e.length,s,u=>{t.subschema({keyword:o,dataProp:u,dataPropType:pa.Type.Num},d),a.allErrors||r.if((0,Dt.not)(d),()=>r.break())})}}Ur.validateAdditionalItems=Ld;Ur.default=Gy});var ha=w(Gr=>{"use strict";Object.defineProperty(Gr,"__esModule",{value:!0});Gr.validateTuple=void 0;var Ud=_(),si=C(),Wy=De(),Yy={keyword:"items",type:"array",schemaType:["object","array","boolean"],before:"uniqueItems",code(t){let{schema:e,it:r}=t;if(Array.isArray(e))return Gd(t,"additionalItems",e);r.items=!0,!(0,si.alwaysValidSchema)(r,e)&&t.ok((0,Wy.validateArray)(t))}};function Gd(t,e,r=t.schema){let{gen:n,parentSchema:i,data:o,keyword:a,it:s}=t;u(i),s.opts.unevaluated&&r.length&&s.items!==!0&&(s.items=si.mergeEvaluated.items(n,r.length,s.items));let c=n.name("valid"),d=n.const("len",(0,Ud._)`${o}.length`);r.forEach((l,p)=>{(0,si.alwaysValidSchema)(s,l)||(n.if((0,Ud._)`${d} > ${p}`,()=>t.subschema({keyword:a,schemaProp:p,dataProp:p},c)),t.ok(c))});function u(l){let{opts:p,errSchemaPath:h}=s,m=r.length,f=m===l.minItems&&(m===l.maxItems||l[e]===!1);if(p.strictTuples&&!f){let g=`"${a}" is ${m}-tuple, but minItems or maxItems/${e} are not specified or different at path "${h}"`;(0,si.checkStrictMode)(s,g,p.strictTuples)}}}Gr.validateTuple=Gd;Gr.default=Yy});var Wd=w(ma=>{"use strict";Object.defineProperty(ma,"__esModule",{value:!0});var Ky=ha(),Xy={keyword:"prefixItems",type:"array",schemaType:["array"],before:"uniqueItems",code:t=>(0,Ky.validateTuple)(t,"items")};ma.default=Xy});var Kd=w(ga=>{"use strict";Object.defineProperty(ga,"__esModule",{value:!0});var Yd=_(),Jy=C(),Qy=De(),Zy=fa(),ew={message:({params:{len:t}})=>(0,Yd.str)`must NOT have more than ${t} items`,params:({params:{len:t}})=>(0,Yd._)`{limit: ${t}}`},tw={keyword:"items",type:"array",schemaType:["object","boolean"],before:"uniqueItems",error:ew,code(t){let{schema:e,parentSchema:r,it:n}=t,{prefixItems:i}=r;n.items=!0,!(0,Jy.alwaysValidSchema)(n,e)&&(i?(0,Zy.validateAdditionalItems)(t,i):t.ok((0,Qy.validateArray)(t)))}};ga.default=tw});var Xd=w(va=>{"use strict";Object.defineProperty(va,"__esModule",{value:!0});var $e=_(),ci=C(),rw={message:({params:{min:t,max:e}})=>e===void 0?(0,$e.str)`must contain at least ${t} valid item(s)`:(0,$e.str)`must contain at least ${t} and no more than ${e} valid item(s)`,params:({params:{min:t,max:e}})=>e===void 0?(0,$e._)`{minContains: ${t}}`:(0,$e._)`{minContains: ${t}, maxContains: ${e}}`},nw={keyword:"contains",type:"array",schemaType:["object","boolean"],before:"uniqueItems",trackErrors:!0,error:rw,code(t){let{gen:e,schema:r,parentSchema:n,data:i,it:o}=t,a,s,{minContains:c,maxContains:d}=n;o.opts.next?(a=c===void 0?1:c,s=d):a=1;let u=e.const("len",(0,$e._)`${i}.length`);if(t.setParams({min:a,max:s}),s===void 0&&a===0){(0,ci.checkStrictMode)(o,'"minContains" == 0 without "maxContains": "contains" keyword ignored');return}if(s!==void 0&&a>s){(0,ci.checkStrictMode)(o,'"minContains" > "maxContains" is always invalid'),t.fail();return}if((0,ci.alwaysValidSchema)(o,r)){let f=(0,$e._)`${u} >= ${a}`;s!==void 0&&(f=(0,$e._)`${f} && ${u} <= ${s}`),t.pass(f);return}o.items=!0;let l=e.name("valid");s===void 0&&a===1?h(l,()=>e.if(l,()=>e.break())):a===0?(e.let(l,!0),s!==void 0&&e.if((0,$e._)`${i}.length > 0`,p)):(e.let(l,!1),p()),t.result(l,()=>t.reset());function p(){let f=e.name("_valid"),g=e.let("count",0);h(f,()=>e.if(f,()=>m(g)))}function h(f,g){e.forRange("i",0,u,v=>{t.subschema({keyword:"contains",dataProp:v,dataPropType:ci.Type.Num,compositeRule:!0},f),g()})}function m(f){e.code((0,$e._)`${f}++`),s===void 0?e.if((0,$e._)`${f} >= ${a}`,()=>e.assign(l,!0).break()):(e.if((0,$e._)`${f} > ${s}`,()=>e.assign(l,!1).break()),a===1?e.assign(l,!0):e.if((0,$e._)`${f} >= ${a}`,()=>e.assign(l,!0)))}}};va.default=nw});var Zd=w(Be=>{"use strict";Object.defineProperty(Be,"__esModule",{value:!0});Be.validateSchemaDeps=Be.validatePropertyDeps=Be.error=void 0;var ya=_(),iw=C(),Wr=De();Be.error={message:({params:{property:t,depsCount:e,deps:r}})=>{let n=e===1?"property":"properties";return(0,ya.str)`must have ${n} ${r} when property ${t} is present`},params:({params:{property:t,depsCount:e,deps:r,missingProperty:n}})=>(0,ya._)`{property: ${t},
    missingProperty: ${n},
    depsCount: ${e},
    deps: ${r}}`};var ow={keyword:"dependencies",type:"object",schemaType:"object",error:Be.error,code(t){let[e,r]=aw(t);Jd(t,e),Qd(t,r)}};function aw({schema:t}){let e={},r={};for(let n in t){if(n==="__proto__")continue;let i=Array.isArray(t[n])?e:r;i[n]=t[n]}return[e,r]}function Jd(t,e=t.schema){let{gen:r,data:n,it:i}=t;if(Object.keys(e).length===0)return;let o=r.let("missing");for(let a in e){let s=e[a];if(s.length===0)continue;let c=(0,Wr.propertyInData)(r,n,a,i.opts.ownProperties);t.setParams({property:a,depsCount:s.length,deps:s.join(", ")}),i.allErrors?r.if(c,()=>{for(let d of s)(0,Wr.checkReportMissingProp)(t,d)}):(r.if((0,ya._)`${c} && (${(0,Wr.checkMissingProp)(t,s,o)})`),(0,Wr.reportMissingProp)(t,o),r.else())}}Be.validatePropertyDeps=Jd;function Qd(t,e=t.schema){let{gen:r,data:n,keyword:i,it:o}=t,a=r.name("valid");for(let s in e)(0,iw.alwaysValidSchema)(o,e[s])||(r.if((0,Wr.propertyInData)(r,n,s,o.opts.ownProperties),()=>{let c=t.subschema({keyword:i,schemaProp:s},a);t.mergeValidEvaluated(c,a)},()=>r.var(a,!0)),t.ok(a))}Be.validateSchemaDeps=Qd;Be.default=ow});var tu=w(wa=>{"use strict";Object.defineProperty(wa,"__esModule",{value:!0});var eu=_(),sw=C(),cw={message:"property name must be valid",params:({params:t})=>(0,eu._)`{propertyName: ${t.propertyName}}`},dw={keyword:"propertyNames",type:"object",schemaType:["object","boolean"],error:cw,code(t){let{gen:e,schema:r,data:n,it:i}=t;if((0,sw.alwaysValidSchema)(i,r))return;let o=e.name("valid");e.forIn("key",n,a=>{t.setParams({propertyName:a}),t.subschema({keyword:"propertyNames",data:a,dataTypes:["string"],propertyName:a,compositeRule:!0},o),e.if((0,eu.not)(o),()=>{t.error(!0),i.allErrors||e.break()})}),t.ok(o)}};wa.default=dw});var ba=w(xa=>{"use strict";Object.defineProperty(xa,"__esModule",{value:!0});var di=De(),Oe=_(),uw=Je(),ui=C(),lw={message:"must NOT have additional properties",params:({params:t})=>(0,Oe._)`{additionalProperty: ${t.additionalProperty}}`},pw={keyword:"additionalProperties",type:["object"],schemaType:["boolean","object"],allowUndefined:!0,trackErrors:!0,error:lw,code(t){let{gen:e,schema:r,parentSchema:n,data:i,errsCount:o,it:a}=t;if(!o)throw new Error("ajv implementation error");let{allErrors:s,opts:c}=a;if(a.props=!0,c.removeAdditional!=="all"&&(0,ui.alwaysValidSchema)(a,r))return;let d=(0,di.allSchemaProperties)(n.properties),u=(0,di.allSchemaProperties)(n.patternProperties);l(),t.ok((0,Oe._)`${o} === ${uw.default.errors}`);function l(){e.forIn("key",i,g=>{!d.length&&!u.length?m(g):e.if(p(g),()=>m(g))})}function p(g){let v;if(d.length>8){let I=(0,ui.schemaRefOrVal)(a,n.properties,"properties");v=(0,di.isOwnProperty)(e,I,g)}else d.length?v=(0,Oe.or)(...d.map(I=>(0,Oe._)`${g} === ${I}`)):v=Oe.nil;return u.length&&(v=(0,Oe.or)(v,...u.map(I=>(0,Oe._)`${(0,di.usePattern)(t,I)}.test(${g})`))),(0,Oe.not)(v)}function h(g){e.code((0,Oe._)`delete ${i}[${g}]`)}function m(g){if(c.removeAdditional==="all"||c.removeAdditional&&r===!1){h(g);return}if(r===!1){t.setParams({additionalProperty:g}),t.error(),s||e.break();return}if(typeof r=="object"&&!(0,ui.alwaysValidSchema)(a,r)){let v=e.name("valid");c.removeAdditional==="failing"?(f(g,v,!1),e.if((0,Oe.not)(v),()=>{t.reset(),h(g)})):(f(g,v),s||e.if((0,Oe.not)(v),()=>e.break()))}}function f(g,v,I){let b={keyword:"additionalProperties",dataProp:g,dataPropType:ui.Type.Str};I===!1&&Object.assign(b,{compositeRule:!0,createErrors:!1,allErrors:!1}),t.subschema(b,v)}}};xa.default=pw});var iu=w(Ia=>{"use strict";Object.defineProperty(Ia,"__esModule",{value:!0});var fw=Cr(),ru=De(),Pa=C(),nu=ba(),hw={keyword:"properties",type:"object",schemaType:"object",code(t){let{gen:e,schema:r,parentSchema:n,data:i,it:o}=t;o.opts.removeAdditional==="all"&&n.additionalProperties===void 0&&nu.default.code(new fw.KeywordCxt(o,nu.default,"additionalProperties"));let a=(0,ru.allSchemaProperties)(r);for(let l of a)o.definedProperties.add(l);o.opts.unevaluated&&a.length&&o.props!==!0&&(o.props=Pa.mergeEvaluated.props(e,(0,Pa.toHash)(a),o.props));let s=a.filter(l=>!(0,Pa.alwaysValidSchema)(o,r[l]));if(s.length===0)return;let c=e.name("valid");for(let l of s)d(l)?u(l):(e.if((0,ru.propertyInData)(e,i,l,o.opts.ownProperties)),u(l),o.allErrors||e.else().var(c,!0),e.endIf()),t.it.definedProperties.add(l),t.ok(c);function d(l){return o.opts.useDefaults&&!o.compositeRule&&r[l].default!==void 0}function u(l){t.subschema({keyword:"properties",schemaProp:l,dataProp:l},c)}}};Ia.default=hw});var cu=w(Ea=>{"use strict";Object.defineProperty(Ea,"__esModule",{value:!0});var ou=De(),li=_(),au=C(),su=C(),mw={keyword:"patternProperties",type:"object",schemaType:"object",code(t){let{gen:e,schema:r,data:n,parentSchema:i,it:o}=t,{opts:a}=o,s=(0,ou.allSchemaProperties)(r),c=s.filter(f=>(0,au.alwaysValidSchema)(o,r[f]));if(s.length===0||c.length===s.length&&(!o.opts.unevaluated||o.props===!0))return;let d=a.strictSchema&&!a.allowMatchingProperties&&i.properties,u=e.name("valid");o.props!==!0&&!(o.props instanceof li.Name)&&(o.props=(0,su.evaluatedPropsToName)(e,o.props));let{props:l}=o;p();function p(){for(let f of s)d&&h(f),o.allErrors?m(f):(e.var(u,!0),m(f),e.if(u))}function h(f){for(let g in d)new RegExp(f).test(g)&&(0,au.checkStrictMode)(o,`property ${g} matches pattern ${f} (use allowMatchingProperties)`)}function m(f){e.forIn("key",n,g=>{e.if((0,li._)`${(0,ou.usePattern)(t,f)}.test(${g})`,()=>{let v=c.includes(f);v||t.subschema({keyword:"patternProperties",schemaProp:f,dataProp:g,dataPropType:su.Type.Str},u),o.opts.unevaluated&&l!==!0?e.assign((0,li._)`${l}[${g}]`,!0):!v&&!o.allErrors&&e.if((0,li.not)(u),()=>e.break())})})}}};Ea.default=mw});var du=w(Sa=>{"use strict";Object.defineProperty(Sa,"__esModule",{value:!0});var gw=C(),vw={keyword:"not",schemaType:["object","boolean"],trackErrors:!0,code(t){let{gen:e,schema:r,it:n}=t;if((0,gw.alwaysValidSchema)(n,r)){t.fail();return}let i=e.name("valid");t.subschema({keyword:"not",compositeRule:!0,createErrors:!1,allErrors:!1},i),t.failResult(i,()=>t.reset(),()=>t.error())},error:{message:"must NOT be valid"}};Sa.default=vw});var uu=w(ja=>{"use strict";Object.defineProperty(ja,"__esModule",{value:!0});var yw=De(),ww={keyword:"anyOf",schemaType:"array",trackErrors:!0,code:yw.validateUnion,error:{message:"must match a schema in anyOf"}};ja.default=ww});var lu=w(Da=>{"use strict";Object.defineProperty(Da,"__esModule",{value:!0});var pi=_(),xw=C(),bw={message:"must match exactly one schema in oneOf",params:({params:t})=>(0,pi._)`{passingSchemas: ${t.passing}}`},Pw={keyword:"oneOf",schemaType:"array",trackErrors:!0,error:bw,code(t){let{gen:e,schema:r,parentSchema:n,it:i}=t;if(!Array.isArray(r))throw new Error("ajv implementation error");if(i.opts.discriminator&&n.discriminator)return;let o=r,a=e.let("valid",!1),s=e.let("passing",null),c=e.name("_valid");t.setParams({passing:s}),e.block(d),t.result(a,()=>t.reset(),()=>t.error(!0));function d(){o.forEach((u,l)=>{let p;(0,xw.alwaysValidSchema)(i,u)?e.var(c,!0):p=t.subschema({keyword:"oneOf",schemaProp:l,compositeRule:!0},c),l>0&&e.if((0,pi._)`${c} && ${a}`).assign(a,!1).assign(s,(0,pi._)`[${s}, ${l}]`).else(),e.if(c,()=>{e.assign(a,!0),e.assign(s,l),p&&t.mergeEvaluated(p,pi.Name)})})}}};Da.default=Pw});var pu=w(_a=>{"use strict";Object.defineProperty(_a,"__esModule",{value:!0});var Iw=C(),Ew={keyword:"allOf",schemaType:"array",code(t){let{gen:e,schema:r,it:n}=t;if(!Array.isArray(r))throw new Error("ajv implementation error");let i=e.name("valid");r.forEach((o,a)=>{if((0,Iw.alwaysValidSchema)(n,o))return;let s=t.subschema({keyword:"allOf",schemaProp:a},i);t.ok(i),t.mergeEvaluated(s)})}};_a.default=Ew});var mu=w($a=>{"use strict";Object.defineProperty($a,"__esModule",{value:!0});var fi=_(),hu=C(),Sw={message:({params:t})=>(0,fi.str)`must match "${t.ifClause}" schema`,params:({params:t})=>(0,fi._)`{failingKeyword: ${t.ifClause}}`},jw={keyword:"if",schemaType:["object","boolean"],trackErrors:!0,error:Sw,code(t){let{gen:e,parentSchema:r,it:n}=t;r.then===void 0&&r.else===void 0&&(0,hu.checkStrictMode)(n,'"if" without "then" and "else" is ignored');let i=fu(n,"then"),o=fu(n,"else");if(!i&&!o)return;let a=e.let("valid",!0),s=e.name("_valid");if(c(),t.reset(),i&&o){let u=e.let("ifClause");t.setParams({ifClause:u}),e.if(s,d("then",u),d("else",u))}else i?e.if(s,d("then")):e.if((0,fi.not)(s),d("else"));t.pass(a,()=>t.error(!0));function c(){let u=t.subschema({keyword:"if",compositeRule:!0,createErrors:!1,allErrors:!1},s);t.mergeEvaluated(u)}function d(u,l){return()=>{let p=t.subschema({keyword:u},s);e.assign(a,s),t.mergeValidEvaluated(p,a),l?e.assign(l,(0,fi._)`${u}`):t.setParams({ifClause:u})}}}};function fu(t,e){let r=t.schema[e];return r!==void 0&&!(0,hu.alwaysValidSchema)(t,r)}$a.default=jw});var gu=w(Ma=>{"use strict";Object.defineProperty(Ma,"__esModule",{value:!0});var Dw=C(),_w={keyword:["then","else"],schemaType:["object","boolean"],code({keyword:t,parentSchema:e,it:r}){e.if===void 0&&(0,Dw.checkStrictMode)(r,`"${t}" without "if" is ignored`)}};Ma.default=_w});var vu=w(Ra=>{"use strict";Object.defineProperty(Ra,"__esModule",{value:!0});var $w=fa(),Mw=Wd(),Rw=ha(),kw=Kd(),Cw=Xd(),Aw=Zd(),Tw=tu(),Ow=ba(),Nw=iu(),qw=cu(),Vw=du(),Hw=uu(),Fw=lu(),zw=pu(),Bw=mu(),Lw=gu();function Uw(t=!1){let e=[Vw.default,Hw.default,Fw.default,zw.default,Bw.default,Lw.default,Tw.default,Ow.default,Aw.default,Nw.default,qw.default];return t?e.push(Mw.default,kw.default):e.push($w.default,Rw.default),e.push(Cw.default),e}Ra.default=Uw});var yu=w(ka=>{"use strict";Object.defineProperty(ka,"__esModule",{value:!0});var U=_(),Gw={message:({schemaCode:t})=>(0,U.str)`must match format "${t}"`,params:({schemaCode:t})=>(0,U._)`{format: ${t}}`},Ww={keyword:"format",type:["number","string"],schemaType:"string",$data:!0,error:Gw,code(t,e){let{gen:r,data:n,$data:i,schema:o,schemaCode:a,it:s}=t,{opts:c,errSchemaPath:d,schemaEnv:u,self:l}=s;if(!c.validateFormats)return;i?p():h();function p(){let m=r.scopeValue("formats",{ref:l.formats,code:c.code.formats}),f=r.const("fDef",(0,U._)`${m}[${a}]`),g=r.let("fType"),v=r.let("format");r.if((0,U._)`typeof ${f} == "object" && !(${f} instanceof RegExp)`,()=>r.assign(g,(0,U._)`${f}.type || "string"`).assign(v,(0,U._)`${f}.validate`),()=>r.assign(g,(0,U._)`"string"`).assign(v,f)),t.fail$data((0,U.or)(I(),b()));function I(){return c.strictSchema===!1?U.nil:(0,U._)`${a} && !${v}`}function b(){let S=u.$async?(0,U._)`(${f}.async ? await ${v}(${n}) : ${v}(${n}))`:(0,U._)`${v}(${n})`,P=(0,U._)`(typeof ${v} == "function" ? ${S} : ${v}.test(${n}))`;return(0,U._)`${v} && ${v} !== true && ${g} === ${e} && !${P}`}}function h(){let m=l.formats[o];if(!m){I();return}if(m===!0)return;let[f,g,v]=b(m);f===e&&t.pass(S());function I(){if(c.strictSchema===!1){l.logger.warn(P());return}throw new Error(P());function P(){return`unknown format "${o}" ignored in schema at path "${d}"`}}function b(P){let pe=P instanceof RegExp?(0,U.regexpCode)(P):c.code.formats?(0,U._)`${c.code.formats}${(0,U.getProperty)(o)}`:void 0,O=r.scopeValue("formats",{key:o,ref:P,code:pe});return typeof P=="object"&&!(P instanceof RegExp)?[P.type||"string",P.validate,(0,U._)`${O}.validate`]:["string",P,O]}function S(){if(typeof m=="object"&&!(m instanceof RegExp)&&m.async){if(!u.$async)throw new Error("async format in sync schema");return(0,U._)`await ${v}(${n})`}return typeof g=="function"?(0,U._)`${v}(${n})`:(0,U._)`${v}.test(${n})`}}}};ka.default=Ww});var wu=w(Ca=>{"use strict";Object.defineProperty(Ca,"__esModule",{value:!0});var Yw=yu(),Kw=[Yw.default];Ca.default=Kw});var xu=w(er=>{"use strict";Object.defineProperty(er,"__esModule",{value:!0});er.contentVocabulary=er.metadataVocabulary=void 0;er.metadataVocabulary=["title","description","default","deprecated","readOnly","writeOnly","examples"];er.contentVocabulary=["contentMediaType","contentEncoding","contentSchema"]});var Pu=w(Aa=>{"use strict";Object.defineProperty(Aa,"__esModule",{value:!0});var Xw=$d(),Jw=Bd(),Qw=vu(),Zw=wu(),bu=xu(),ex=[Xw.default,Jw.default,(0,Qw.default)(),Zw.default,bu.metadataVocabulary,bu.contentVocabulary];Aa.default=ex});var Eu=w(hi=>{"use strict";Object.defineProperty(hi,"__esModule",{value:!0});hi.DiscrError=void 0;var Iu;(function(t){t.Tag="tag",t.Mapping="mapping"})(Iu||(hi.DiscrError=Iu={}))});var ju=w(Oa=>{"use strict";Object.defineProperty(Oa,"__esModule",{value:!0});var tr=_(),Ta=Eu(),Su=Jn(),tx=Ar(),rx=C(),nx={message:({params:{discrError:t,tagName:e}})=>t===Ta.DiscrError.Tag?`tag "${e}" must be string`:`value of tag "${e}" must be in oneOf`,params:({params:{discrError:t,tag:e,tagName:r}})=>(0,tr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`},ix={keyword:"discriminator",type:"object",schemaType:"object",error:nx,code(t){let{gen:e,data:r,schema:n,parentSchema:i,it:o}=t,{oneOf:a}=i;if(!o.opts.discriminator)throw new Error("discriminator: requires discriminator option");let s=n.propertyName;if(typeof s!="string")throw new Error("discriminator: requires propertyName");if(n.mapping)throw new Error("discriminator: mapping is not supported");if(!a)throw new Error("discriminator: requires oneOf keyword");let c=e.let("valid",!1),d=e.const("tag",(0,tr._)`${r}${(0,tr.getProperty)(s)}`);e.if((0,tr._)`typeof ${d} == "string"`,()=>u(),()=>t.error(!1,{discrError:Ta.DiscrError.Tag,tag:d,tagName:s})),t.ok(c);function u(){let h=p();e.if(!1);for(let m in h)e.elseIf((0,tr._)`${d} === ${m}`),e.assign(c,l(h[m]));e.else(),t.error(!1,{discrError:Ta.DiscrError.Mapping,tag:d,tagName:s}),e.endIf()}function l(h){let m=e.name("valid"),f=t.subschema({keyword:"oneOf",schemaProp:h},m);return t.mergeEvaluated(f,tr.Name),m}function p(){var h;let m={},f=v(i),g=!0;for(let S=0;S<a.length;S++){let P=a[S];if(P?.$ref&&!(0,rx.schemaHasRulesButRef)(P,o.self.RULES)){let O=P.$ref;if(P=Su.resolveRef.call(o.self,o.schemaEnv.root,o.baseId,O),P instanceof Su.SchemaEnv&&(P=P.schema),P===void 0)throw new tx.default(o.opts.uriResolver,o.baseId,O)}let pe=(h=P?.properties)===null||h===void 0?void 0:h[s];if(typeof pe!="object")throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${s}"`);g=g&&(f||v(P)),I(pe,S)}if(!g)throw new Error(`discriminator: "${s}" must be required`);return m;function v({required:S}){return Array.isArray(S)&&S.includes(s)}function I(S,P){if(S.const)b(S.const,P);else if(S.enum)for(let pe of S.enum)b(pe,P);else throw new Error(`discriminator: "properties/${s}" must have "const" or "enum"`)}function b(S,P){if(typeof S!="string"||S in m)throw new Error(`discriminator: "${s}" values must be unique strings`);m[S]=P}}}};Oa.default=ix});var Du=w((IE,ox)=>{ox.exports={$schema:"http://json-schema.org/draft-07/schema#",$id:"http://json-schema.org/draft-07/schema#",title:"Core schema meta-schema",definitions:{schemaArray:{type:"array",minItems:1,items:{$ref:"#"}},nonNegativeInteger:{type:"integer",minimum:0},nonNegativeIntegerDefault0:{allOf:[{$ref:"#/definitions/nonNegativeInteger"},{default:0}]},simpleTypes:{enum:["array","boolean","integer","null","number","object","string"]},stringArray:{type:"array",items:{type:"string"},uniqueItems:!0,default:[]}},type:["object","boolean"],properties:{$id:{type:"string",format:"uri-reference"},$schema:{type:"string",format:"uri"},$ref:{type:"string",format:"uri-reference"},$comment:{type:"string"},title:{type:"string"},description:{type:"string"},default:!0,readOnly:{type:"boolean",default:!1},examples:{type:"array",items:!0},multipleOf:{type:"number",exclusiveMinimum:0},maximum:{type:"number"},exclusiveMaximum:{type:"number"},minimum:{type:"number"},exclusiveMinimum:{type:"number"},maxLength:{$ref:"#/definitions/nonNegativeInteger"},minLength:{$ref:"#/definitions/nonNegativeIntegerDefault0"},pattern:{type:"string",format:"regex"},additionalItems:{$ref:"#"},items:{anyOf:[{$ref:"#"},{$ref:"#/definitions/schemaArray"}],default:!0},maxItems:{$ref:"#/definitions/nonNegativeInteger"},minItems:{$ref:"#/definitions/nonNegativeIntegerDefault0"},uniqueItems:{type:"boolean",default:!1},contains:{$ref:"#"},maxProperties:{$ref:"#/definitions/nonNegativeInteger"},minProperties:{$ref:"#/definitions/nonNegativeIntegerDefault0"},required:{$ref:"#/definitions/stringArray"},additionalProperties:{$ref:"#"},definitions:{type:"object",additionalProperties:{$ref:"#"},default:{}},properties:{type:"object",additionalProperties:{$ref:"#"},default:{}},patternProperties:{type:"object",additionalProperties:{$ref:"#"},propertyNames:{format:"regex"},default:{}},dependencies:{type:"object",additionalProperties:{anyOf:[{$ref:"#"},{$ref:"#/definitions/stringArray"}]}},propertyNames:{$ref:"#"},const:!0,enum:{type:"array",items:!0,minItems:1,uniqueItems:!0},type:{anyOf:[{$ref:"#/definitions/simpleTypes"},{type:"array",items:{$ref:"#/definitions/simpleTypes"},minItems:1,uniqueItems:!0}]},format:{type:"string"},contentMediaType:{type:"string"},contentEncoding:{type:"string"},if:{$ref:"#"},then:{$ref:"#"},else:{$ref:"#"},allOf:{$ref:"#/definitions/schemaArray"},anyOf:{$ref:"#/definitions/schemaArray"},oneOf:{$ref:"#/definitions/schemaArray"},not:{$ref:"#"}},default:!0}});var qa=w((H,Na)=>{"use strict";Object.defineProperty(H,"__esModule",{value:!0});H.MissingRefError=H.ValidationError=H.CodeGen=H.Name=H.nil=H.stringify=H.str=H._=H.KeywordCxt=H.Ajv=void 0;var ax=Id(),sx=Pu(),cx=ju(),_u=Du(),dx=["/properties"],mi="http://json-schema.org/draft-07/schema",rr=class extends ax.default{_addVocabularies(){super._addVocabularies(),sx.default.forEach(e=>this.addVocabulary(e)),this.opts.discriminator&&this.addKeyword(cx.default)}_addDefaultMetaSchema(){if(super._addDefaultMetaSchema(),!this.opts.meta)return;let e=this.opts.$data?this.$dataMetaSchema(_u,dx):_u;this.addMetaSchema(e,mi,!1),this.refs["http://json-schema.org/schema"]=mi}defaultMeta(){return this.opts.defaultMeta=super.defaultMeta()||(this.getSchema(mi)?mi:void 0)}};H.Ajv=rr;Na.exports=H=rr;Na.exports.Ajv=rr;Object.defineProperty(H,"__esModule",{value:!0});H.default=rr;var ux=Cr();Object.defineProperty(H,"KeywordCxt",{enumerable:!0,get:function(){return ux.KeywordCxt}});var nr=_();Object.defineProperty(H,"_",{enumerable:!0,get:function(){return nr._}});Object.defineProperty(H,"str",{enumerable:!0,get:function(){return nr.str}});Object.defineProperty(H,"stringify",{enumerable:!0,get:function(){return nr.stringify}});Object.defineProperty(H,"nil",{enumerable:!0,get:function(){return nr.nil}});Object.defineProperty(H,"Name",{enumerable:!0,get:function(){return nr.Name}});Object.defineProperty(H,"CodeGen",{enumerable:!0,get:function(){return nr.CodeGen}});var lx=Kn();Object.defineProperty(H,"ValidationError",{enumerable:!0,get:function(){return lx.default}});var px=Ar();Object.defineProperty(H,"MissingRefError",{enumerable:!0,get:function(){return px.default}})});var Ou=w(Ue=>{"use strict";Object.defineProperty(Ue,"__esModule",{value:!0});Ue.formatNames=Ue.fastFormats=Ue.fullFormats=void 0;function Le(t,e){return{validate:t,compare:e}}Ue.fullFormats={date:Le(ku,za),time:Le(Ha(!0),Ba),"date-time":Le($u(!0),Au),"iso-time":Le(Ha(),Cu),"iso-date-time":Le($u(),Tu),duration:/^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,uri:yx,"uri-reference":/^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,"uri-template":/^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,url:/^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,email:/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,hostname:/^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,ipv4:/^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,ipv6:/^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,regex:Sx,uuid:/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,"json-pointer":/^(?:\/(?:[^~/]|~0|~1)*)*$/,"json-pointer-uri-fragment":/^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,"relative-json-pointer":/^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,byte:wx,int32:{type:"number",validate:Px},int64:{type:"number",validate:Ix},float:{type:"number",validate:Ru},double:{type:"number",validate:Ru},password:!0,binary:!0};Ue.fastFormats={...Ue.fullFormats,date:Le(/^\d\d\d\d-[0-1]\d-[0-3]\d$/,za),time:Le(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,Ba),"date-time":Le(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,Au),"iso-time":Le(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,Cu),"iso-date-time":Le(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,Tu),uri:/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,"uri-reference":/^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,email:/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i};Ue.formatNames=Object.keys(Ue.fullFormats);function fx(t){return t%4===0&&(t%100!==0||t%400===0)}var hx=/^(\d\d\d\d)-(\d\d)-(\d\d)$/,mx=[0,31,28,31,30,31,30,31,31,30,31,30,31];function ku(t){let e=hx.exec(t);if(!e)return!1;let r=+e[1],n=+e[2],i=+e[3];return n>=1&&n<=12&&i>=1&&i<=(n===2&&fx(r)?29:mx[n])}function za(t,e){if(t&&e)return t>e?1:t<e?-1:0}var Va=/^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;function Ha(t){return function(r){let n=Va.exec(r);if(!n)return!1;let i=+n[1],o=+n[2],a=+n[3],s=n[4],c=n[5]==="-"?-1:1,d=+(n[6]||0),u=+(n[7]||0);if(d>23||u>59||t&&!s)return!1;if(i<=23&&o<=59&&a<60)return!0;let l=o-u*c,p=i-d*c-(l<0?1:0);return(p===23||p===-1)&&(l===59||l===-1)&&a<61}}function Ba(t,e){if(!(t&&e))return;let r=new Date("2020-01-01T"+t).valueOf(),n=new Date("2020-01-01T"+e).valueOf();if(r&&n)return r-n}function Cu(t,e){if(!(t&&e))return;let r=Va.exec(t),n=Va.exec(e);if(r&&n)return t=r[1]+r[2]+r[3],e=n[1]+n[2]+n[3],t>e?1:t<e?-1:0}var Fa=/t|\s/i;function $u(t){let e=Ha(t);return function(n){let i=n.split(Fa);return i.length===2&&ku(i[0])&&e(i[1])}}function Au(t,e){if(!(t&&e))return;let r=new Date(t).valueOf(),n=new Date(e).valueOf();if(r&&n)return r-n}function Tu(t,e){if(!(t&&e))return;let[r,n]=t.split(Fa),[i,o]=e.split(Fa),a=za(r,i);if(a!==void 0)return a||Ba(n,o)}var gx=/\/|:/,vx=/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;function yx(t){return gx.test(t)&&vx.test(t)}var Mu=/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;function wx(t){return Mu.lastIndex=0,Mu.test(t)}var xx=-(2**31),bx=2**31-1;function Px(t){return Number.isInteger(t)&&t<=bx&&t>=xx}function Ix(t){return Number.isInteger(t)}function Ru(){return!0}var Ex=/[^\\]\\Z/;function Sx(t){if(Ex.test(t))return!1;try{return new RegExp(t),!0}catch{return!1}}});var Nu=w(ir=>{"use strict";Object.defineProperty(ir,"__esModule",{value:!0});ir.formatLimitDefinition=void 0;var jx=qa(),Ne=_(),pt=Ne.operators,gi={formatMaximum:{okStr:"<=",ok:pt.LTE,fail:pt.GT},formatMinimum:{okStr:">=",ok:pt.GTE,fail:pt.LT},formatExclusiveMaximum:{okStr:"<",ok:pt.LT,fail:pt.GTE},formatExclusiveMinimum:{okStr:">",ok:pt.GT,fail:pt.LTE}},Dx={message:({keyword:t,schemaCode:e})=>(0,Ne.str)`should be ${gi[t].okStr} ${e}`,params:({keyword:t,schemaCode:e})=>(0,Ne._)`{comparison: ${gi[t].okStr}, limit: ${e}}`};ir.formatLimitDefinition={keyword:Object.keys(gi),type:"string",schemaType:"string",$data:!0,error:Dx,code(t){let{gen:e,data:r,schemaCode:n,keyword:i,it:o}=t,{opts:a,self:s}=o;if(!a.validateFormats)return;let c=new jx.KeywordCxt(o,s.RULES.all.format.definition,"format");c.$data?d():u();function d(){let p=e.scopeValue("formats",{ref:s.formats,code:a.code.formats}),h=e.const("fmt",(0,Ne._)`${p}[${c.schemaCode}]`);t.fail$data((0,Ne.or)((0,Ne._)`typeof ${h} != "object"`,(0,Ne._)`${h} instanceof RegExp`,(0,Ne._)`typeof ${h}.compare != "function"`,l(h)))}function u(){let p=c.schema,h=s.formats[p];if(!h||h===!0)return;if(typeof h!="object"||h instanceof RegExp||typeof h.compare!="function")throw new Error(`"${i}": format "${p}" does not define "compare" function`);let m=e.scopeValue("formats",{key:p,ref:h,code:a.code.formats?(0,Ne._)`${a.code.formats}${(0,Ne.getProperty)(p)}`:void 0});t.fail$data(l(m))}function l(p){return(0,Ne._)`${p}.compare(${r}, ${n}) ${gi[i].fail} 0`}},dependencies:["format"]};var _x=t=>(t.addKeyword(ir.formatLimitDefinition),t);ir.default=_x});var Fu=w((Yr,Hu)=>{"use strict";Object.defineProperty(Yr,"__esModule",{value:!0});var or=Ou(),$x=Nu(),La=_(),qu=new La.Name("fullFormats"),Mx=new La.Name("fastFormats"),Ua=(t,e={keywords:!0})=>{if(Array.isArray(e))return Vu(t,e,or.fullFormats,qu),t;let[r,n]=e.mode==="fast"?[or.fastFormats,Mx]:[or.fullFormats,qu],i=e.formats||or.formatNames;return Vu(t,i,r,n),e.keywords&&(0,$x.default)(t),t};Ua.get=(t,e="full")=>{let n=(e==="fast"?or.fastFormats:or.fullFormats)[t];if(!n)throw new Error(`Unknown format "${t}"`);return n};function Vu(t,e,r,n){var i,o;(i=(o=t.opts.code).formats)!==null&&i!==void 0||(o.formats=(0,La._)`require("ajv-formats/dist/formats").${n}`);for(let a of e)t.addFormat(a,r[a])}Hu.exports=Yr=Ua;Object.defineProperty(Yr,"__esModule",{value:!0});Yr.default=Ua});var Nb={};vl(Nb,{activate:()=>Tb,deactivate:()=>Ob});module.exports=yl(Nb);var B=F(require("vscode"));var j=F(require("vscode")),ur=F(require("path"));var He=F(require("vscode"));function Di(t){let e=He.Uri.joinPath(t,".."),r=t.path.split("/").pop()?.replace(/\.nodegraph\.json$/,"")??"graph";return He.Uri.joinPath(e,`.${r}-imgs`)}function wl(t,e,r){let n=He.Uri.joinPath(Di(e),r);return t.asWebviewUri(n).toString()}var es=/\[\[IMG:([^:\]]+)(?::[^\]]+)?\]\]/g;function _i(t,e,r){let n={},i=o=>{o&&!n[o]&&(n[o]=wl(t,e,o))};for(let o of r.nodes){es.lastIndex=0;let a;for(;(a=es.exec(o.content??""))!==null;)i(a[1])}for(let o of r.canvasImages??[])i(o.filename);return n}async function ts(t,e,r,n="png"){let i=Di(e);try{await He.workspace.fs.createDirectory(i)}catch{}let o=`img_${Date.now()}.${n}`,a=He.Uri.joinPath(i,o);return await He.workspace.fs.writeFile(a,Buffer.from(r,"base64")),{filename:o,webviewUri:t.asWebviewUri(a).toString()}}async function rs(t,e){let r=He.Uri.joinPath(Di(t),e);try{await He.workspace.fs.delete(r)}catch{}}function se(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function xl(t){let e=t.trim().replace("#",""),r=e.length===3?e.split("").map(n=>n+n).join(""):e;return/^[0-9a-fA-F]{6}$/.test(r)?{r:255-parseInt(r.slice(0,2),16),g:255-parseInt(r.slice(2,4),16),b:255-parseInt(r.slice(4,6),16)}:null}var bl=t=>t.replace(/[^a-zA-Z0-9_-]/g,"_");function en(t){return/^\s*\|/.test(t)&&t.indexOf("|",1)!==-1}function Mi(t){return/^\s*\|[\s\-:|]+\|\s*$/.test(t)&&!/[a-zA-Z0-9]/.test(t)}function ns(t){return t.replace(/^\s*\|/,"").replace(/\|\s*$/,"").split("|").map(e=>e.trim())}function Pl(t){if(!t)return[{type:"text",text:"",startChar:0,endChar:0}];let e=t.split(`
`),r=[],n=0,i=0,o=a=>e[a].length+(a<e.length-1?1:0);for(;n<e.length;)if(en(e[n])&&n+1<e.length&&Mi(e[n+1])){let s=i,c=[];for(;n<e.length&&en(e[n]);)c.push(e[n]),i+=o(n),n++;c.length>=3?r.push({type:"table",headers:ns(c[0]),rows:c.slice(2).map(ns),startChar:s,endChar:i}):r.push({type:"text",text:c.join(`
`),startChar:s,endChar:i})}else{let s=i,c=[];for(;n<e.length&&!(en(e[n])&&n+1<e.length&&Mi(e[n+1]));)c.push(e[n]),i+=o(n),n++;r.push({type:"text",text:c.join(`
`),startChar:s,endChar:i})}return r}function $i(t){let e=t.split(`
`);for(let r=0;r+1<e.length;r++)if(en(e[r])&&Mi(e[r+1]))return!0;return!1}function Il(t){return se(t).replace(/\\\$/g,()=>'<span class="ng-cur">$</span>')}function tn(t){return Il(t).replace(/\*\*(.+?)\*\*/g,'<strong style="font-size:1.1em">$1</strong>')}function rn(t,e){let r=/\[\[IMG:([^:\]]+)(?::(\d+)x(\d+))?\]\]/g,n="",i=0,o;for(;(o=r.exec(t))!==null;){o.index>i&&(n+=tn(t.slice(i,o.index)));let a=o[1],s=o[2],c=o[3],d=s&&c?` width="${s}" height="${c}"`:"",u=e[a];n+=u?`<img class="ng-img${d?" ng-img-sized":""}" src="${u}"${d} alt="${se(a)}" onclick="showLightbox(this.src)" title="Click to enlarge">`:`<span class="ng-img-missing">${se(a)}</span>`,i=o.index+o[0].length}return i<t.length&&(n+=tn(t.slice(i))),n}function El(t,e){let r=t.headers.map(i=>`<th>${rn(i,e)}</th>`).join(""),n=t.rows.map(i=>`<tr>${i.map(o=>`<td>${rn(o,e)}</td>`).join("")}</tr>`).join("");return`<div class="ng-table-wrap"><table class="ng-table"><thead><tr>${r}</tr></thead><tbody>${n}</tbody></table></div>`}function Sl(t,e,r,n,i){let o=e?.color??"#888",a=e?.shape==="rounded"?"22px":"2px",s=se(e?.label??t.template),c=Math.round(t.position.x+r),d=Math.round(t.position.y+n),u="",l=t.content??"";if($i(l)){let O=Pl(l);u+='<div class="ng-content">';for(let fe of O)fe.type==="table"?u+=El(fe,i):fe.text&&(u+=`<div class="ng-seg">${rn(fe.text,i).replace(/\n/g,"<br>")}</div>`);u+="</div>"}else l&&(u+=`<div class="ng-content">${rn(l,i).replace(/\n/g,"<br>")}</div>`);if(t.original){let O=se(t.original.title??"Original"),fe=t.originalExpanded?" open":"";u+=`<details class="ng-original"${fe}><summary>${O}${t.original.location?` <span class="ng-loc">${se(t.original.location)}</span>`:""}</summary>
<div class="ng-orig-text">${tn(t.original.text).replace(/\n/g,"<br>")}</div></details>`}for(let O of t.toggleItems??[])u+=`<details class="ng-toggle" data-toggle-id="${se(O.id)}"${O.expanded?" open":""}><summary>${se(O.title||"(untitled)")}</summary>
<div class="ng-toggle-body">${tn(O.content).replace(/\n/g,"<br>")}</div></details>`;t.links.length&&(u+=`<div class="ng-links">${t.links.map(O=>{let fe=O.type==="url"?"\u{1F517}":O.type==="pdf"?"\u{1F4C4}":O.type==="obsidian"?"\u{1F7E3}":"\u2B21";return`<a class="ng-link"${O.type==="url"||O.type==="pdf"?` href="${se(O.target)}" target="_blank"`:""}>${fe} ${se(O.label||O.target)}</a>`}).join("")}</div>`);let p=!!u,h=t.contentExpanded?"":' style="display:none"',m=t.children.length?` data-children="${t.children.join(",")}"`:"",f=$i(l)?" ng-has-table":"",g=/\[\[IMG:[^:\]]+:(\d+)x\d+\]\]/g,v=0,I;for(;(I=g.exec(l))!==null;)v=Math.max(v,Number(I[1]));let b=v>0?$i(l)?v+280:v+32:0,S=Math.max(t.nodeWidth??0,432,b),P=[S>432?`min-width:${S}px`:"",t.nodeHeight&&t.contentExpanded?`min-height:${t.nodeHeight}px`:""].filter(Boolean).join(";"),pe=t.nodeHeight?` data-min-h="${t.nodeHeight}"`:"";return`<div class="ng-node${f}" id="node-${se(t.id)}"${m}${pe} style="--color:${o};border-radius:${a};left:${c}px;top:${d}px${P?";"+P:""}">
  <div class="ng-header" onclick="onHeaderClick(this)" title="Click to select node">
    <span class="ng-tag" onmousedown="onNodeTagMousedown(event,this.closest('.ng-node'))" style="background:color-mix(in srgb,${o} 20%,transparent);color:${o}">${s}</span>
    ${p?`<span class="ng-title" onclick="onTitleClick(event,this)" title="Click to fold/unfold">${se(t.title)}</span>`:`<span class="ng-title">${se(t.title)}</span>`}
  </div>
  ${p?`<div class="ng-body"${h}${t.fontSize?` style="font-size:${t.fontSize}px"`:""}>${u}</div>`:""}
</div>`}function is(t,e={}){let r=1/0,n=1/0;for(let l of t.nodes)r=Math.min(r,l.position.x),n=Math.min(n,l.position.y);isFinite(r)||(r=0,n=0);let i=-r+100,o=-n+100,a=t.nodes.map(l=>Sl(l,t.nodeTemplates[l.template],i,o,e)).join(`
`),s=JSON.stringify(t.nodes.map(l=>({id:l.id,lx:Math.round(l.position.x+i),ly:Math.round(l.position.y+o),children:l.children??[],template:l.template,contentExpanded:l.contentExpanded,isMain:l.template==="main_topic",nodeHeight:l.nodeHeight??null,naturalY:Math.round((l.nodeNaturalY??l.position.y)+o),title:l.title,content:l.content??"",originalTitle:l.original?.title??"",originalText:l.original?.text??"",toggles:(l.toggleItems??[]).map(p=>({id:p.id,title:p.title,content:p.content}))}))),c=JSON.stringify(t.edges.map(l=>({source:l.source,target:l.target,type:l.type,label:l.label||""}))),d=JSON.stringify(Object.fromEntries(Object.entries(t.nodeTemplates).map(([l,p])=>[l,p.label]))),u=Object.entries(t.nodeTemplates).map(([l,p])=>{let h=xl(p.color),m=h?`rgb(${h.r},${h.g},${h.b})`:"#ff3b30",f=h?`rgba(${h.r},${h.g},${h.b},0.18)`:"rgba(255,59,48,0.18)";return`::highlight(ng-hit-${bl(l)}){color:${m};background-color:${f};text-decoration:underline}`}).join(`
`);return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${se(t.title)}</title>
<!-- KaTeX for LaTeX rendering -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16/dist/contrib/auto-render.min.js"
  onload="initKatex()"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f4f4f5;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden;height:100vh}
#toolbar{position:fixed;top:0;left:0;right:0;background:#ffffff;border-bottom:1px solid #d4d4d4;z-index:200;font-size:12px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
#tb-row1{display:flex;align-items:baseline;gap:10px;padding:6px 12px 4px;border-bottom:1px solid #ececec;min-height:0}
#tb-row2{display:flex;align-items:center;gap:6px;padding:3px 12px 4px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;touch-action:pan-x}
#tb-row2::-webkit-scrollbar{display:none}
#tb-row2>*{flex-shrink:0}
#tb-title{font-weight:700;color:#1a1a1a;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60vw}
#tb-sel{opacity:.7;font-size:11px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#0066cc}
button{background:#fff;color:#374151;border:1px solid #d1d5db;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:500;cursor:pointer;flex-shrink:0;box-shadow:0 1px 2px rgba(15,23,42,.06);transition:background .1s,color .1s,border-color .1s}
button:hover{background:#2563eb;color:#fff;border-color:#1d4ed8}
button:active{background:#1d4ed8;border-color:#1e40af}
select{background:#fff;color:#374151;border:1px solid #d1d5db;border-radius:6px;padding:4px 6px;font-size:11px;font-weight:500;cursor:pointer;box-shadow:0 1px 2px rgba(15,23,42,.06)}
select:hover{border-color:#93c5fd}
.tb-sep{width:1px;height:14px;background:#d4d4d4;flex-shrink:0}
#viewport{position:fixed;top:0;left:0;right:0;bottom:0;overflow:hidden;cursor:grab;}
#viewport.pan-drag{cursor:grabbing}
#canvas{position:absolute;transform-origin:0 0}
#wire-svg{position:absolute;top:0;left:0;width:10000px;height:10000px;pointer-events:none;overflow:visible}
#grid-svg{position:absolute;top:0;left:0;width:10000px;height:10000px;pointer-events:none;overflow:visible}
.ng-node{position:absolute;min-width:432px;background:color-mix(in srgb,var(--color) 15%,#ffffff);border:1px solid color-mix(in srgb,var(--color) 40%,#e0e0e0);font-size:13px;transition:box-shadow .1s,top .35s ease,left .35s ease;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.ng-node.ng-selected{box-shadow:0 0 0 2px color-mix(in srgb,var(--color) 80%,transparent),0 2px 8px rgba(0,0,0,.12)}
.ng-node.ng-dragging{opacity:.88;transition:box-shadow .1s;box-shadow:0 8px 24px rgba(0,0,0,.18);z-index:100}
.ng-header{display:flex;align-items:center;gap:6px;padding:6px 8px;cursor:default;user-select:none}
.ng-header:hover{background:rgba(0,0,0,.04)}
.ng-tag{font-size:10px;font-weight:600;padding:1px 6px;border-radius:3px;flex-shrink:0;white-space:nowrap;cursor:move;user-select:none}
.ng-title{flex:1;font-size:12px;font-weight:500;color:#1a1a1a;white-space:nowrap;cursor:pointer;user-select:none}
.ng-body{padding:8px 10px;font-size:14px}
.ng-content{line-height:1.6;color:#333;white-space:pre-wrap;word-break:break-word;margin-bottom:6px}
.ng-more-btn{display:block;width:100%;margin-top:4px;padding:3px 0;background:transparent;border:none;color:inherit;opacity:.55;font-size:10px;cursor:pointer;text-align:center;user-select:none}
.ng-seg{white-space:pre-wrap;word-break:break-word;line-height:1.6;color:#333}
.ng-img-wrap{margin:4px 0}
.ng-table-wrap{overflow-x:auto;margin:6px 0}
.ng-table{border-collapse:collapse;background:#fff;font-size:inherit;white-space:normal}
.ng-table th{padding:5px 10px;border:1px solid #ddd;background:#f8f9fa;font-weight:600;text-align:left;vertical-align:top;white-space:pre-wrap;word-break:break-word;overflow-wrap:break-word}
.ng-table td{padding:5px 10px;border:1px solid #ddd;vertical-align:top;white-space:pre-wrap;word-break:break-word;overflow-wrap:break-word}
.ng-images{margin-top:6px;display:flex;flex-direction:column;gap:6px}
.ng-img{max-width:100%;border-radius:3px;border:1px solid rgba(0,0,0,.1);display:block;cursor:zoom-in}
.ng-img-sized{max-width:none}
.ng-img-missing{font-size:10px;opacity:.4;padding:3px 6px;background:rgba(0,0,0,.05);border-radius:3px}
details.ng-original{margin-top:6px}
details.ng-original summary{cursor:pointer;opacity:.6;list-style:none;padding:2px 0;user-select:none;color:#555}
details.ng-original summary::-webkit-details-marker{display:none}
.ng-loc{opacity:.55;font-size:10px;margin-left:4px}
.ng-orig-text{margin-top:4px;padding:5px 7px;background:rgba(0,0,0,.04);border-radius:3px;font-style:italic;line-height:1.5;color:#555;white-space:pre-wrap;word-break:break-word;font-size:11px}
details.ng-toggle{margin-top:3px}
details.ng-toggle summary{cursor:pointer;list-style:none;padding:2px 0;user-select:none;color:#444}
details.ng-toggle summary::-webkit-details-marker{display:none}
.ng-toggle-body{padding-left:12px;padding-top:3px;line-height:1.6;color:#333;white-space:pre-wrap;word-break:break-word}
.ng-links{margin-top:6px;display:flex;flex-direction:column;gap:2px}
.ng-link{color:#0066cc;text-decoration:none;font-size:11px;opacity:.85}
.ng-link:hover{opacity:1;text-decoration:underline}
/* KaTeX */
.katex{color:inherit}.katex-display{overflow-x:auto;overflow-y:hidden}.katex-html{white-space:nowrap}
/* Lightbox */
#lightbox{display:none;position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.75);align-items:center;justify-content:center;cursor:zoom-out}
#lightbox.active{display:flex}
#lightbox img{max-width:90vw;max-height:90vh;object-fit:contain;border-radius:4px;box-shadow:0 4px 32px rgba(0,0,0,.4);cursor:default}
#lightbox-close{position:absolute;top:16px;right:20px;color:#fff;font-size:22px;opacity:.8;cursor:pointer;user-select:none}
/* Search */
#search-wrap{position:absolute;top:10px;right:14px;z-index:500;display:none}
#search-wrap.open{display:block}
#search-row{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:4px 6px;box-shadow:0 4px 16px rgba(0,0,0,0.15)}
#search-row.dropdown-open{border-radius:6px 6px 0 0}
#search-input{border:none;outline:none;font-size:13px;width:200px;background:transparent;color:#111}
#search-count{font-size:11px;color:#6b7280;white-space:nowrap;min-width:60px;text-align:right}
#search-drop{position:absolute;top:100%;right:0;min-width:100%;max-height:280px;overflow-y:auto;background:#fff;border:1px solid #d1d5db;border-top:none;border-radius:0 0 6px 6px;box-shadow:0 8px 16px rgba(0,0,0,0.15);z-index:501;display:none}
#search-drop.open{display:block}
.ng-drop-item{padding:6px 12px;font-size:12px;color:#1a1a1a;cursor:pointer;border-bottom:1px solid #f3f4f6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px}
.ng-drop-item:last-child{border-bottom:none}
.ng-drop-item:hover{background:#f3f4f6}
.ng-node.ng-search-match{border:2px solid #fcd34d !important}
.ng-node.ng-search-active{border:2px solid #f59e0b !important;box-shadow:0 0 0 3px rgba(245,158,11,0.35),0 2px 8px rgba(0,0,0,.18) !important}
${u}
/* \uC120\uD0DD \uB178\uB4DC\uC758 \uD55C \uC138\uB300(\uBD80\uBAA8+\uC790\uC2DD) \uD558\uC774\uB77C\uC774\uD2B8 \u2014 Esc\uB85C\uB9CC \uD574\uC81C */
.ng-node.ng-gen{border:2px solid #f87171 !important;box-shadow:0 0 0 3px rgba(248,113,113,.3),0 1px 4px rgba(0,0,0,.08) !important}
</style>
</head>
<body>
<div id="toolbar">
  <div id="tb-row1">
    <span id="tb-title">${se(t.title)}</span>
  </div>
  <div id="tb-row2">
    <select id="tb-filter" title="Filter Collapse/Expand to one node type"></select>
    <button onclick="doCollapse()" title="Collapse selected node + children (all if none selected; all if a type filter is set) \u2014 collapsing everything also fits the view">\u{1F4C1} Collapse</button>
    <button onclick="doExpand()" title="Expand selected node + children (all if none selected; only the filtered type if a type filter is set)">\u{1F4C2} Expand</button>
    <button onclick="fitView()">Fit View</button>
    <button id="tb-grid-btn" onclick="toggleGrid()" style="display:inline-flex;align-items:center;gap:4px" title="Toggle debug grid \u2014 vertical lines mark hop-level boundaries, horizontal lines mark main-topic cluster boundaries">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2.2"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2.2"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2.2"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2.2"/>
      </svg>
      Grid
    </button>
    <div class="tb-sep"></div>
    <span id="tb-sel" style="opacity:.35">Click a node to select</span>
  </div>
</div>
<div id="viewport">
  <div id="search-wrap">
    <div id="search-row">
      <input id="search-input" placeholder="Search nodes\u2026 (Ctrl+F)" oninput="doSearch(this.value)" onkeydown="onSearchKey(event)" onclick="onSearchInputClick()">
      <span id="search-count"></span>
      <div style="width:1px;height:16px;background:#e5e7eb;margin:0 2px;flex-shrink:0"></div>
      <button onclick="closeSearch()" title="Close (Escape)" style="background:none;border:none;cursor:pointer;padding:2px 6px;font-size:13px;color:#6b7280;border-radius:3px;line-height:1">\u2715</button>
    </div>
    <div id="search-drop"></div>
  </div>
  <div id="canvas">
    <svg id="grid-svg" style="display:none"></svg>
    <svg id="wire-svg">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0,10 3.5,0 7" fill="#666"/>
        </marker>
        <marker id="arrow-hl" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0,10 3.5,0 7" fill="#ef4444"/>
        </marker>
      </defs>
    </svg>
    ${a}
  </div>
</div>
<div id="lightbox" onclick="closeLightbox()">
  <img id="lightbox-img" onclick="event.stopPropagation()" src="" alt="">
  <span id="lightbox-close" onclick="closeLightbox()">\u2715</span>
</div>
<script>
var NODES_DATA = ${s};
var EDGES = ${c};
var NODE_TEMPLATES = ${d};
var HEADER_H = 36;

// Collapse/Expand \uB77C\uBCA8 \uD544\uD130 \uB4DC\uB86D\uB2E4\uC6B4 \uCC44\uC6B0\uAE30 (\uC5D0\uB514\uD130\uC758 \uB77C\uBCA8 \uD544\uD130\uC640 \uB3D9\uC77C\uD55C \uC635\uC158/\uB3D9\uC791)
(function populateFilterSelect() {
  var sel = document.getElementById('tb-filter');
  var noneOpt = document.createElement('option');
  noneOpt.value = ''; noneOpt.textContent = 'None';
  sel.appendChild(noneOpt);
  Object.keys(NODE_TEMPLATES).forEach(function(key) {
    var opt = document.createElement('option');
    opt.value = key; opt.textContent = NODE_TEMPLATES[key];
    sel.appendChild(opt);
  });
})();

var vp = document.getElementById('viewport');
var canvas = document.getElementById('canvas');

// Set viewport top to match actual toolbar height
function syncViewportTop() {
  var tb = document.getElementById('toolbar');
  vp.style.top = tb.offsetHeight + 'px';
}
syncViewportTop();
var tx = 0, ty = 0, scale = 1;

function applyTransform() {
  canvas.style.transform = 'translate('+tx+'px,'+ty+'px) scale('+scale+')';
}

// \uCC3D \uD06C\uAE30 \uBCC0\uACBD: \uD654\uBA74 \uC911\uC559\uC5D0 \uBCF4\uC774\uB358 \uC9C0\uC810\uC744 \uC911\uC559\uC5D0 \uC720\uC9C0\uD558\uBA74\uC11C,
// \uCC3D \uB108\uBE44 \uBE44\uC728\uB9CC\uD07C \uC2A4\uCF00\uC77C\uB3C4 \uD568\uAED8 \uC870\uC815 (\uC904\uC774\uBA74 \uCD95\uC18C, \uB2E4\uC2DC \uD0A4\uC6B0\uBA74 \uD655\uB300 \u2014 \uB300\uCE6D \uB3D9\uC791)
var lastVW = 0, lastVH = 0;
(function() {
  var r = vp.getBoundingClientRect();
  lastVW = r.width; lastVH = r.height;
})();
window.addEventListener('resize', function() {
  syncViewportTop();
  var r = vp.getBoundingClientRect();
  if (lastVW > 0 && r.width > 0) {
    var cxw = (lastVW / 2 - tx) / scale;   // \uAE30\uC874 \uC911\uC559\uC758 \uC6D4\uB4DC \uC88C\uD45C
    var cyw = (lastVH / 2 - ty) / scale;
    scale = Math.max(0.1, Math.min(4, scale * (r.width / lastVW)));
    tx = r.width / 2 - cxw * scale;
    ty = r.height / 2 - cyw * scale;
    applyTransform();
    updateZoomLineWeights();
  }
  lastVW = r.width; lastVH = r.height;
});

// Zoom
vp.addEventListener('wheel', function(e) {
  e.preventDefault();
  var rect = vp.getBoundingClientRect();
  var mx = e.clientX - rect.left, my = e.clientY - rect.top;
  var factor = e.deltaY < 0 ? 1.1 : 0.91;
  var ns = Math.max(0.1, Math.min(4, scale * factor));
  tx = mx - (mx - tx) * (ns / scale);
  ty = my - (my - ty) * (ns / scale);
  scale = ns;
  applyTransform();
  updateZoomLineWeights();
}, { passive: false });

// Canvas pan
var panState = null;
vp.addEventListener('mousedown', function(e) {
  if (e.target.closest('.ng-node')) return;
  selectNode(null);
  panState = { sx: e.clientX - tx, sy: e.clientY - ty };
  vp.classList.add('pan-drag');
});
window.addEventListener('mousemove', function(e) {
  if (!panState) return;
  tx = e.clientX - panState.sx; ty = e.clientY - panState.sy;
  applyTransform();
});
window.addEventListener('mouseup', function() {
  panState = null; vp.classList.remove('pan-drag');
});

// Node selection
var selectedNodeId = null;
// \uC138\uB300 \uD558\uC774\uB77C\uC774\uD2B8\uC758 \uB8E8\uD2B8(pin): \uBC30\uACBD \uD074\uB9AD\uC73C\uB85C \uC120\uD0DD\uC774 \uD480\uB824\uB3C4 \uC720\uC9C0, Esc\uB85C\uB9CC \uD574\uC81C
var genRootId = null;
function selectNode(nodeId) {
  if (selectedNodeId) {
    var prev = document.getElementById('node-' + selectedNodeId);
    if (prev) prev.classList.remove('ng-selected');
  }
  selectedNodeId = nodeId;
  var label = document.getElementById('tb-sel');
  if (nodeId) {
    var el = document.getElementById('node-' + nodeId);
    if (el) el.classList.add('ng-selected');
    var titleEl = el ? el.querySelector('.ng-title') : null;
    if (label) { label.textContent = 'Selected: ' + (titleEl ? titleEl.textContent : nodeId); label.style.opacity = '0.9'; }
  } else {
    if (label) { label.textContent = 'Click a node to select'; label.style.opacity = '0.35'; }
  }
  // \uD558\uC774\uB77C\uC774\uD2B8 \uB8E8\uD2B8\uB294 tag \uD074\uB9AD(onNodeTagMousedown)\uC5D0\uC11C\uB9CC \uAC31\uC2E0 \u2014 \uC77C\uBC18 \uD074\uB9AD/fold\uB294
  // \uD558\uC774\uB77C\uC774\uD2B8\uB97C \uBC14\uAFB8\uC9C0 \uC54A\uC74C. \uC120\uD0DD \uC2A4\uD0C0\uC77C \uC6B0\uC120 \uADDC\uCE59\uB9CC \uC7AC\uC801\uC6A9 (wire \uC0C9\uC740 \uBD88\uBCC0)
  updateGenHighlight();
}

// \uC120\uD0DD \uB178\uB4DC\uC758 \uD55C \uC138\uB300(\uBD80\uBAA8+\uC790\uC2DD) \uC774\uC6C3 ID \uC218\uC9D1 \u2014 edges \uC591\uBC29\uD5A5 + children \uBC30\uC5F4
function getGenNeighbors(nodeId) {
  var ids = [];
  EDGES.forEach(function(e) {
    if (e.source === nodeId && ids.indexOf(e.target) === -1) ids.push(e.target);
    if (e.target === nodeId && ids.indexOf(e.source) === -1) ids.push(e.source);
  });
  NODES_DATA.forEach(function(n) {
    if (n.id === nodeId) {
      (n.children || []).forEach(function(c) { if (ids.indexOf(c) === -1) ids.push(c); });
    } else if ((n.children || []).indexOf(nodeId) !== -1 && ids.indexOf(n.id) === -1) {
      ids.push(n.id);
    }
  });
  var self = ids.indexOf(nodeId);
  if (self !== -1) ids.splice(self, 1);
  return ids;
}

// \uACE0\uC815\uB41C \uB8E8\uD2B8\uC640 \uADF8 \uC774\uC6C3 \uB178\uB4DC\uB4E4\uC5D0 \uBE68\uAC04 \uD14C\uB450\uB9AC \uC801\uC6A9 (wire \uC0C9\uC740 drawEdges\uC5D0\uC11C \uCC98\uB9AC)
// \uB8E8\uD2B8 \uC790\uC2E0\uB3C4 \uBE68\uAC04\uC0C9 \u2014 \uC120\uD0DD \uC0C1\uD0DC\uC5EC\uB3C4 \uD558\uC774\uB77C\uC774\uD2B8\uAC00 \uC6B0\uC120 (\uC5D0\uB514\uD130\uC640 \uB3D9\uC77C)
function updateGenHighlight() {
  document.querySelectorAll('.ng-gen').forEach(function(el) { el.classList.remove('ng-gen'); });
  if (!genRootId) return;
  var ids = getGenNeighbors(genRootId);
  ids.push(genRootId);
  ids.forEach(function(id) {
    var el = document.getElementById('node-' + id);
    if (el) el.classList.add('ng-gen');
  });
}

// Header click = select node
var lastWasDrag = false;
function onHeaderClick(hdr) {
  if (lastWasDrag) { lastWasDrag = false; return; }
  var nodeEl = hdr.parentNode;
  var nodeId = nodeEl.id.replace('node-', '');
  selectNode(selectedNodeId === nodeId ? null : nodeId);
}

// Title click = fold/unfold this node
function onTitleClick(e, titleEl) {
  e.stopPropagation();
  var nodeEl = titleEl.closest('.ng-node');
  var body = nodeEl.querySelector('.ng-body');
  if (!body) return;
  var expanding = body.style.display === 'none';
  body.style.display = expanding ? '' : 'none';
  syncMinHeight(nodeEl, expanding);
  var nodeId = nodeEl.id.replace('node-', '');
  for (var i = 0; i < NODES_DATA.length; i++) {
    if (NODES_DATA[i].id === nodeId) { NODES_DATA[i].contentExpanded = expanding; break; }
  }
  // \uC811\uD600 \uC788\uB294 \uB3D9\uC548\uC5D4 .ng-content\uAC00 display:none\uC774\uB77C \uCE21\uC815\uC774 \uC804\uBD80 0\uC73C\uB85C \uB098\uC640 More
  // \uBC84\uD2BC\uC774 \uD544\uC694\uC5C6\uB2E4\uACE0 \uC798\uBABB \uD310\uB2E8\uB418\uBBC0\uB85C, \uB2E4\uC2DC \uBCF4\uC774\uAC8C \uB420 \uB54C \uC774 \uB178\uB4DC\uB9CC \uC7AC\uCE21\uC815
  if (expanding) applyContentCaps(nodeEl);
  setTimeout(recomputePositions, 0);
  // \uAC80\uC0C9 \uB4DC\uB86D\uB2E4\uC6B4\uC774 \uC5F4\uB824\uC788\uC73C\uBA74 search input \uD3EC\uCEE4\uC2A4 \uBCF5\uC6D0 (\uD654\uC0B4\uD45C \uD0A4 \uC720\uC9C0)
  if (document.getElementById('search-wrap').classList.contains('open') && searchSelectedId === null) {
    setTimeout(function() { document.getElementById('search-input').focus(); }, 0);
  }
}

// Get node datum by id
function getNodeDatum(nodeId) {
  for (var i = 0; i < NODES_DATA.length; i++) {
    if (NODES_DATA[i].id === nodeId) return NODES_DATA[i];
  }
  return null;
}

// Collect all descendants recursively (for collapse \u2014 no depth limit)
function getAllDescendants(nodeId, visited) {
  visited = visited || [];
  if (visited.indexOf(nodeId) !== -1) return [];
  visited.push(nodeId);
  var result = [];
  var datum = getNodeDatum(nodeId);
  if (!datum) return result;
  // Include both children array and edge targets
  var childIds = (datum.children || []).slice();
  EDGES.forEach(function(e) { if (e.source === nodeId && childIds.indexOf(e.target) === -1) childIds.push(e.target); });
  childIds.forEach(function(childId) {
    result.push(childId);
    getAllDescendants(childId, visited).forEach(function(d) { result.push(d); });
  });
  return result;
}

// Collect descendants for expand \u2014 skip main_topic children (and their subtrees)
// Includes both outgoing and incoming (non-main) edges to support multi-parent sub-nodes
function getExpandDescendants(nodeId, isRoot, visited) {
  visited = visited || [];
  if (visited.indexOf(nodeId) !== -1) return [];
  visited.push(nodeId);
  var datum = getNodeDatum(nodeId);
  if (!datum) return [];
  // Do not recurse into other main (sharp) nodes
  if (!isRoot && datum.isMain) return [];
  var result = [nodeId];
  var childIds = (datum.children || []).slice();
  EDGES.forEach(function(e) {
    // Outgoing edges from this node
    if (e.source === nodeId && childIds.indexOf(e.target) === -1) childIds.push(e.target);
    // Incoming from non-main: support sub-nodes with multiple parents
    if (e.target === nodeId && childIds.indexOf(e.source) === -1) {
      var srcDatum = getNodeDatum(e.source);
      if (srcDatum && !srcDatum.isMain) childIds.push(e.source);
    }
  });
  childIds.forEach(function(childId) {
    getExpandDescendants(childId, false, visited).forEach(function(d) { result.push(d); });
  });
  return result;
}

// Apply expand/collapse to a list of node IDs
// \uC811\uD798/\uD3BC\uCE68 \uC2DC min-height \uB3D9\uAE30\uD654 \u2014 \uC811\uD78C \uB178\uB4DC\uAC00 \uC218\uB3D9 \uB9AC\uC0AC\uC774\uC988 \uB192\uC774\uB85C \uB0A8\uB294 \uBC84\uADF8 \uBC29\uC9C0
function syncMinHeight(el, expand) {
  var minH = el.getAttribute('data-min-h');
  el.style.minHeight = (expand && minH) ? minH + 'px' : '';
}

function applyFold(nodeIds, expand, after) {
  nodeIds.forEach(function(id) {
    var el = document.getElementById('node-' + id);
    if (!el) return;
    var body = el.querySelector('.ng-body');
    var chevron = el.querySelector('.ng-chevron');
    if (body) body.style.display = expand ? '' : 'none';
    if (chevron) chevron.textContent = expand ? '\u25B2' : '\u25BC';
    syncMinHeight(el, expand);
    for (var i = 0; i < NODES_DATA.length; i++) {
      if (NODES_DATA[i].id === id) { NODES_DATA[i].contentExpanded = expand; break; }
    }
  });
  setTimeout(function() { recomputePositions(); if (after) after(); }, 0);
}

// Recompute positions when <details> toggles change node height.
// 'toggle' does not bubble so we use capture phase.
canvas.addEventListener('toggle', function() {
  setTimeout(recomputePositions, 0);
}, true);

// Toolbar: context-aware expand/collapse
// \uB77C\uBCA8 \uD544\uD130: None\uC774\uBA74 \uAE30\uC874 \uB3D9\uC791 \uADF8\uB300\uB85C. \uD2B9\uC815 \uD0C0\uC785\uC774\uBA74 Collapse\uB294 \uD56D\uC0C1 \uC804\uCCB4 \uC811\uC74C,
// Expand\uB294 \uADF8 \uD0C0\uC785 \uB178\uB4DC\uB9CC \uD3BC\uCE58\uACE0 \uB098\uBA38\uC9C0\uB294 \uAC15\uC81C\uB85C \uC811\uC74C (\uBD80\uBAA8/\uC790\uC2DD \uAD00\uACC4 \uBB34\uC2DC, \uC5D0\uB514\uD130\uC640 \uB3D9\uC77C \uADDC\uCE59)
function doExpand() {
  var filter = document.getElementById('tb-filter').value;
  if (filter) {
    var matching = [], rest = [];
    NODES_DATA.forEach(function(n) { (n.template === filter ? matching : rest).push(n.id); });
    applyFold(rest, false);
    applyFold(matching, true);
    return;
  }
  if (selectedNodeId) {
    applyFold(getExpandDescendants(selectedNodeId, true), true);
  } else {
    // Expand all \u2014 include main_topic roots but skip nested main_topic subtrees
    var toExpand = [];
    NODES_DATA.forEach(function(n) {
      if (toExpand.indexOf(n.id) !== -1) return;
      getExpandDescendants(n.id, true).forEach(function(d) { if (toExpand.indexOf(d) === -1) toExpand.push(d); });
    });
    applyFold(toExpand, true);
  }
}
// \uC804\uCCB4 collapse(\uC120\uD0DD \uC5C6\uC774, \uB610\uB294 \uD544\uD130\uAC00 \uAC78\uB824 \uC788\uC5B4\uB3C4 \uACB0\uAD6D \uC804\uCCB4)\uC77C \uB54C\uB9CC \uC790\uB3D9\uC73C\uB85C
// Fit View \u2014 \uC120\uD0DD \uC11C\uBE0C\uD2B8\uB9AC\uB9CC \uC811\uC744 \uB550 \uC0AC\uC6A9\uC790\uAC00 \uBCF4\uB358 \uC601\uC5ED\uC744 \uC720\uC9C0\uD574\uC57C \uD558\uBBC0\uB85C \uB300\uC0C1\uC5D0\uC11C
// \uC81C\uC678 (\uC5D0\uB514\uD130\uC640 \uB3D9\uC77C \uADDC\uCE59).
function doCollapse() {
  var filter = document.getElementById('tb-filter').value;
  if (filter) {
    applyFold(NODES_DATA.map(function(n){return n.id;}), false, fitView);
    return;
  }
  if (selectedNodeId) {
    applyFold([selectedNodeId].concat(getAllDescendants(selectedNodeId)), false);
  } else {
    applyFold(NODES_DATA.map(function(n){return n.id;}), false, fitView);
  }
}

// \uB4DC\uB86D\uB41C \uB178\uB4DC\uC758 raw \uC704\uCE58(lx/ly)\uB97C \uD615\uC81C\uB4E4 \uC0AC\uC774\uC5D0\uC11C \uC2E4\uC81C\uB85C \uC5B4\uB514 \uB5A8\uC5B4\uC84C\uB294\uC9C0\uC5D0 \uB9DE\uCDB0 \uB2E4\uC2DC
// \uACC4\uC0B0\uD55C\uB2E4. onUp\uC774 \uADF8\uB0E5 "\uB4DC\uB86D\uB41C \uB80C\uB354 \uC88C\uD45C\uB97C \uADF8\uB300\uB85C \uC800\uC7A5"\uD558\uBA74, \uADF8 \uB80C\uB354 \uC88C\uD45C\uB294 raw \uC88C\uD45C\uC640
// \uC804\uD600 \uB2E4\uB978 \uC88C\uD45C\uACC4(\uB808\uC774\uC544\uC6C3 \uC54C\uACE0\uB9AC\uC998\uC774 raw\uB97C \uB300\uD3ED \uC7AC\uBC30\uCE58\uD558\uB294 \uAC8C \uC774 \uC54C\uACE0\uB9AC\uC998\uC758 \uC874\uC7AC
// \uC774\uC720)\uB77C \uD615\uC81C\uB4E4\uC758 raw ly \uBC94\uC704\uB97C \uC644\uC804\uD788 \uBC97\uC5B4\uB098\uB294 \uACBD\uC6B0\uAC00 \uD754\uD558\uACE0, \uADF8 \uACB0\uACFC \uB2E4\uC74C \uC7AC\uBC30\uCE58 \uB54C
// \uD56D\uC0C1 \uB9E8 \uC704/\uB9E8 \uC544\uB798\uB85C \uD295\uAE30\uB294 \uAC83\uCC98\uB7FC \uBCF4\uC778\uB2E4(\uC5D0\uB514\uD130\uC5D0\uC11C\uB3C4 \uAC19\uC740 \uBC84\uADF8\uAC00 \uC788\uC5C8\uC74C). \uB4DC\uB86D \uC2DC\uC810\uC758
// DOM \uC704\uCE58(\uD615\uC81C\uB4E4\uC740 \uC774 \uB4DC\uB798\uADF8 \uB3D9\uC548 \uD55C \uBC88\uB3C4 \uC548 \uC6C0\uC9C1\uC600\uC73C\uBBC0\uB85C \uC5EC\uC804\uD788 \uC815\uD655\uD55C \uBC30\uCE58 \uC0C1\uD0DC\uB97C
// \uBC18\uC601\uD568)\uB97C \uAE30\uC900\uC73C\uB85C \uC5B4\uB290 \uB450 \uD615\uC81C \uC0AC\uC774\uC5D0 \uB193\uC600\uB294\uC9C0 \uCC3E\uC544 \uADF8 \uC0AC\uC774 \uAC12\uC73C\uB85C raw ly\uB97C \uB9DE\uCD98\uB2E4.
function reconcileDroppedPosition(nodeId, nodeDatum) {
  var nodeMap = {};
  NODES_DATA.forEach(function(n) { nodeMap[n.id] = n; });
  var tree = buildHopTreeJs();
  var parentId = tree.parentOf[nodeId];
  if (!parentId) return;

  function findRootId(fromId) {
    var cur = fromId, visited = {};
    while (!visited[cur]) {
      visited[cur] = true;
      var n = nodeMap[cur];
      if (!n) return cur;
      if (n.isMain) return cur;
      var p = tree.parentOf[cur];
      if (!p) return cur;
      cur = p;
    }
    return cur;
  }
  var root = nodeMap[findRootId(nodeId)];
  function sideOfNode(n) { return (root && n.lx >= root.lx) ? 1 : -1; }
  var draggedSide = sideOfNode(nodeDatum);

  var sameSideSiblings = [];
  NODES_DATA.forEach(function(n) {
    if (n.id === nodeId) return;
    if (tree.parentOf[n.id] === parentId && sideOfNode(n) === draggedSide) sameSideSiblings.push(n.id);
  });
  if (sameSideSiblings.length === 0) return;

  var draggedRenderY = nodeDatum.ly;
  var ordered = sameSideSiblings.map(function(sid) {
    var el = document.getElementById('node-' + sid);
    var ry = el ? (parseFloat(el.style.top) || 0) : nodeMap[sid].ly;
    return { id: sid, renderY: ry };
  }).sort(function(a, b) { return a.renderY - b.renderY; });

  var belowIdx = -1;
  for (var i = 0; i < ordered.length; i++) {
    if (ordered[i].renderY > draggedRenderY) { belowIdx = i; break; }
  }
  var newY;
  if (belowIdx === -1) newY = nodeMap[ordered[ordered.length - 1].id].ly + 1;
  else if (belowIdx === 0) newY = nodeMap[ordered[0].id].ly - 1;
  else newY = (nodeMap[ordered[belowIdx - 1].id].ly + nodeMap[ordered[belowIdx].id].ly) / 2;

  // lx\uB3C4 \uB4DC\uB798\uADF8 \uC911 \uB80C\uB354 \uC88C\uD45C\uAC00 raw\uC5D0 \uC11E\uC5EC \uB4E4\uC5B4\uAC00 \uC624\uC5FC\uB410\uC744 \uC218 \uC788\uC73C\uBBC0\uB85C, \uAC19\uC740 side \uD615\uC81C\uC758
  // raw lx\uB97C \uBE4C\uB824 \uBC14\uB85C\uC7A1\uB294\uB2E4(side \uC804\uD658\uCC98\uB7FC \uD615\uC81C\uAC00 \uC5C6\uB294 \uACBD\uC6B0\uB294 \uAC74\uB4DC\uB9AC\uC9C0 \uC54A\uC74C).
  nodeDatum.lx = nodeMap[sameSideSiblings[0]].lx;
  nodeDatum.ly = newY;
  nodeDatum.naturalY = newY;
}

// Tag drag handle
function onNodeTagMousedown(e, nodeEl) {
  e.stopPropagation();
  lastWasDrag = false;
  var x0 = e.clientX, y0 = e.clientY;
  var left0 = parseFloat(nodeEl.style.left) || 0;
  var top0  = parseFloat(nodeEl.style.top)  || 0;
  var moved = false, finalDX = 0, finalDY = 0;
  var nodeId = nodeEl.id.replace('node-', '');
  var nodeDatum = null;
  for (var i = 0; i < NODES_DATA.length; i++) {
    if (NODES_DATA[i].id === nodeId) { nodeDatum = NODES_DATA[i]; break; }
  }
  // tag \uD074\uB9AD = \uC138\uB300 \uD558\uC774\uB77C\uC774\uD2B8 pin (\uBC30\uCE58 \uBD88\uBCC0 \u2192 A* \uCE90\uC2DC \uC7AC\uC0AC\uC6A9, \uC0C9\uB9CC \uC989\uC2DC \uAC31\uC2E0)
  genRootId = nodeId;
  updateGenHighlight();
  drawEdges();
  function onMove(ev) {
    var rawDx = ev.clientX - x0, rawDy = ev.clientY - y0;
    if (!moved && (Math.abs(rawDx) > 5 || Math.abs(rawDy) > 5)) { moved = true; nodeEl.classList.add('ng-dragging'); }
    if (moved) {
      var dx = rawDx / scale, dy = rawDy / scale;
      nodeEl.style.left=(left0+dx)+'px'; nodeEl.style.top=(top0+dy)+'px'; finalDX=dx; finalDY=dy; drawEdges(true);
    }
  }
  function onUp() {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
    nodeEl.classList.remove('ng-dragging');
    // \uB4DC\uB86D\uB41C \uB80C\uB354 \uC88C\uD45C\uB97C \uC77C\uB2E8 \uADF8\uB300\uB85C \uC800\uC7A5\uD55C \uB4A4, \uD615\uC81C\uB4E4 \uC0AC\uC774 \uC2E4\uC81C \uC704\uCE58\uC5D0 \uB9DE\uCDB0 raw\uB85C
    // \uC7AC\uD574\uC11D\uD55C\uB2E4(reconcileDroppedPosition \u2014 \uC704 \uCC38\uACE0, \uB80C\uB354 \uC88C\uD45C\uB97C raw\uC5D0 \uADF8\uB300\uB85C \uC4F0\uBA74 \uC548
    // \uB418\uB294 \uC774\uC720).
    if (moved) {
      lastWasDrag = true;
      if (nodeDatum) {
        nodeDatum.lx = left0 + finalDX; nodeDatum.ly = top0 + finalDY; nodeDatum.naturalY = nodeDatum.ly;
        reconcileDroppedPosition(nodeId, nodeDatum);
      }
      setTimeout(recomputePositions, 0);
    }
  }
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

// Canvas.tsx\uC758 computeRenderPositions\uC640 \uC644\uC804\uD788 \uB3D9\uC77C\uD55C hop-tree bottom-up/top-down
// \uC54C\uACE0\uB9AC\uC998\uC758 vanilla JS \uC774\uC2DD \u2014 \uC608\uC804\uC5D4 X \uACB9\uCE68 \uAE30\uC900 union-find \uCEEC\uB7FC + \uADF8\uB9AC\uB514 Y-\uD328\uD0B9\uC774\uB77C\uB294
// \uC644\uC804\uD788 \uB2E4\uB978(\uB354 \uC624\uB798\uB41C) \uC54C\uACE0\uB9AC\uC998\uC744 \uC37C\uB294\uB370, \uADF8 \uBC29\uC2DD\uC740 hop depth \uAC1C\uB150\uC774 \uC5C6\uC5B4\uC11C \uBE0C\uB79C\uCE58\uB9C8\uB2E4
// hop-1/hop-2\uAC00 \uC11C\uB85C \uB2E4\uB978 X\uC5D0\uC11C \uC2DC\uC791\uD558\uB294 \uBB38\uC81C\uAC00 \uC788\uC5C8\uC74C(\uC0AC\uC6A9\uC790\uAC00 Grid \uC624\uBC84\uB808\uC774\uB85C \uC9C1\uC811
// \uD655\uC778\uD574\uC11C \uBC1C\uACAC \u2014 "hop1\uACFC hop2 \uAC00\uB85C \uC2DC\uC791 \uC704\uCE58\uAC00 \uB3D9\uC77C\uD558\uC9C0 \uC54A\uC544\uC11C"). \uC5D0\uB514\uD130\uC640 \uC815\uD655\uD788 \uAC19\uC740
// \uACB0\uACFC\uAC00 \uB098\uC624\uB3C4\uB85D \uC54C\uACE0\uB9AC\uC998 \uC790\uCCB4\uB97C \uAD50\uCCB4.
function recomputePositions() {
  var nodeMap = {};
  NODES_DATA.forEach(function(n) { nodeMap[n.id] = n; });

  function getH(n) {
    var el = document.getElementById('node-' + n.id);
    if (el) return el.offsetHeight;
    return n.contentExpanded ? (n.nodeHeight || HEADER_H) : HEADER_H;
  }
  function getW(n) {
    var el = document.getElementById('node-' + n.id);
    return el ? el.offsetWidth : (n.nodeWidth || 432);
  }

  var tree = buildHopTreeJs();

  // main topic(\uBC31\uBCF8) \uAE30\uC900 \uC88C/\uC6B0 \u2014 \uC138\uB85C \uBC30\uCE58(\uC544\uB798)\uC640 \uAC00\uB85C \uC815\uB82C(Pass 4) \uC591\uCABD\uC5D0\uC11C \uC67C\uCABD/\uC624\uB978\uCABD
  // \uC790\uC2DD\uC744 \uB3C5\uB9BD\uC801\uC73C\uB85C \uB2E4\uB8E8\uAE30 \uC704\uD574 \uBA3C\uC800 \uACC4\uC0B0\uD574\uB454\uB2E4.
  var sideOf = {};
  NODES_DATA.forEach(function(n) {
    if (tree.depthOf[n.id] === 0) { sideOf[n.id] = 0; return; }
    var root = nodeMap[tree.rootOf[n.id]];
    sideOf[n.id] = n.lx >= root.lx ? 1 : -1;
  });

  // \uAC01 \uBD80\uBAA8\uC758 \uC790\uC2DD\uB4E4\uC744 \uC800\uC7A5\uB41C \uC0C1\uB300 Y(\uB514\uC790\uC778 \uC758\uB3C4\uC0C1 \uC21C\uC11C) \uAE30\uC900\uC73C\uB85C \uC815\uB82C
  var childrenOf = {};
  NODES_DATA.forEach(function(n) {
    var p = tree.parentOf[n.id];
    if (!p) return;
    (childrenOf[p] = childrenOf[p] || []).push(n.id);
  });
  Object.keys(childrenOf).forEach(function(pid) {
    var parent = nodeMap[pid];
    childrenOf[pid].sort(function(a, b) {
      return (nodeMap[a].ly - parent.ly) - (nodeMap[b].ly - parent.ly);
    });
  });

  // \uD615\uC81C \uADF8\uB8F9\uC744 \uBD80\uBAA8\uC758 \uC6D0\uB798 Y \uAE30\uC900 \uC704/\uC544\uB798\uB85C, \uADF8\uB9AC\uACE0 \uC88C/\uC6B0(side)\uB85C \uBD84\uB9AC\uD55C\uB2E4. \uC67C\uCABD/\uC624\uB978\uCABD
  // \uC790\uC2DD\uC740 \uC11C\uB85C \uB2E4\uB978 X\uC5D0 \uADF8\uB824\uC838 \uC138\uB85C \uACF5\uAC04\uC744 \uC808\uB300 \uACF5\uC720\uD558\uC9C0 \uC54A\uC73C\uBBC0\uB85C \uB3C5\uB9BD\uC801\uC73C\uB85C \uACC4\uC0B0\uD574\uC57C
  // \uD55C\uCABD\uC774 \uCEE4\uC9C8 \uB54C \uBC18\uB300\uCABD \uBD84\uAE30\uC810\uAE4C\uC9C0 \uAC19\uC774 \uBC00\uB9AC\uB294 \uAC78 \uB9C9\uB294\uB2E4. above \uBC30\uC5F4\uC740 reverse\uD574\uC11C
  // "\uBD80\uBAA8\uC640 \uAC00\uC7A5 \uAC00\uAE4C\uC6B4 \uAC83\uBD80\uD130" \uC21C\uC11C\uB85C \uB9DE\uCD98\uB2E4 \u2014 kids\uB294 \uC0C1\uB300 Y \uC624\uB984\uCC28\uC21C \uC815\uB82C\uC774\uB77C below
  // \uADF8\uB8F9(\uBD80\uBAA8\uC5D0\uC11C \uBA40\uC5B4\uC9C0\uB294 \uBC29\uD5A5\uC73C\uB85C \uC21C\uC11C\uB300\uB85C \uC9C4\uD589)\uC5D4 \uADF8\uB300\uB85C \uB9DE\uC9C0\uB9CC, above \uADF8\uB8F9\uC740 \uAC19\uC740
  // \uC9C4\uD589 \uBC29\uD5A5(\uC704\uB85C \uBA40\uC5B4\uC9D0)\uC778\uB370 \uC624\uB984\uCC28\uC21C\uC774\uBA74 \uAC00\uC7A5 \uBA3C \uC790\uC2DD\uC774 \uBC30\uC5F4 \uB9E8 \uC55E\uC774\uB77C \uC624\uD788\uB824 \uBD80\uBAA8\uC640
  // \uAC00\uC7A5 \uAC00\uAE5D\uAC8C \uBC30\uCE58\uB418\uACE0 \uADF8\uB2E4\uC74C\uC774 \uB354 \uBA40\uB9AC \uBC00\uB9AC\uB294 \uC2DD\uC73C\uB85C \uC2DC\uAC01\uC801 \uC21C\uC11C\uAC00 \uB4A4\uC9D1\uD78C\uB2E4.
  function splitByOriginalSide(parentId, side) {
    var parent = nodeMap[parentId];
    var kids = (childrenOf[parentId] || []).filter(function(k) { return sideOf[k] === side; });
    var above = kids.filter(function(k) { return nodeMap[k].ly < parent.ly; }).reverse();
    return {
      below: kids.filter(function(k) { return nodeMap[k].ly >= parent.ly; }),
      above: above,
    };
  }

  // main topic\uB07C\uB9AC(\uBC31\uBCF8)\uB9CC 20px \uAE30\uC900, \uADF8 \uC678(hop \uC790\uC2DD)\uB294 \uD56D\uC0C1 30px \uAE30\uC900
  function gapFor(a, b) {
    var base = (a.isMain && b.isMain) ? 20 : 30;
    return (getH(a) > HEADER_H || getH(b) > HEADER_H) ? 48 : base;
  }

  // \u2500\u2500 bottom-up: \uAC01 \uC11C\uBE0C\uD2B8\uB9AC\uAC00 \uC790\uAE30 \uC911\uC2EC \uAE30\uC900 \uC704/\uC544\uB798\uB85C \uD544\uC694\uD55C \uACF5\uAC04 \u2500\u2500
  var infoCache = {};
  function stackSize(group, parentNode) {
    if (!group.length) return 0;
    var total = 0;
    for (var i = 0; i < group.length; i++) {
      var kid = nodeMap[group[i]];
      var prev = i === 0 ? parentNode : nodeMap[group[i - 1]];
      total += gapFor(prev, kid);
      var kInfo = layoutInfo(group[i]);
      total += kInfo.above + kInfo.below;
    }
    return total;
  }

  // above+below \uBE14\uB85D\uC744 \uBD80\uBAA8 \uC911\uC2EC\uC5D0 \uB9DE\uCD94\uAE30 \uC704\uD55C \uBD84\uAE30\uC810 \uC774\uB3D9\uB7C9(shift). \uC774\uC0C1\uC801\uC73C\uB85C\uB294
  // (belowSize-aboveSize)/2\uB9CC\uD07C \uC62E\uAE30\uBA74 \uBE14\uB85D \uC804\uCCB4\uAC00 \uC815\uD655\uD788 \uBD80\uBAA8 \uC911\uC2EC\uC5D0 \uC624\uC9C0\uB9CC, \uC591\uCABD\uC5D0 \uB2E4
  // \uD615\uC81C\uAC00 \uC788\uB294 \uC0C1\uD0DC\uC5D0\uC11C \uB450 \uADF8\uB8F9 \uD06C\uAE30 \uCC28\uC774\uAC00 \uD06C\uBA74(\uC608: 3:1 \uC774\uC0C1) \uADF8 \uC774\uB3D9\uB7C9\uC774 \uD070 \uCABD \uADF8\uB8F9\uC758
  // "\uBD80\uBAA8\uC640 \uAC00\uC7A5 \uAC00\uAE4C\uC6B4 \uC790\uC2DD"\uC744 \uBD80\uBAA8 \uC911\uC2EC \uBC18\uB300\uD3B8\uC73C\uB85C \uBC00\uC5B4\uBC84\uB9B0\uB2E4(below\uC758 \uCCAB \uC790\uC2DD\uC774 \uBD80\uBAA8
  // \uBCF4\uB2E4 \uC704\uC5D0 \uB80C\uB354\uB418\uB294 \uB4F1, \uC790\uC2DD\uC774 \uBD80\uBAA8\uB97C \uC2DC\uAC01\uC801\uC73C\uB85C \uB6F0\uC5B4\uB118\uB294 \uBC84\uADF8). \uB450 \uADF8\uB8F9\uC774 \uB2E4 \uC788\uC744
  // \uB54C\uB9CC, "\uB354 \uD070 \uCABD\uC758 \uCCAB \uC790\uC2DD\uC774 \uBD80\uBAA8 \uC911\uC2EC\uC744 \uB118\uC9C0 \uC54A\uB294 \uD55C\uB3C4"\uB85C \uC774\uB3D9\uB7C9\uC744 clamp\uD55C\uB2E4.
  function splitShift(id, side) {
    var node = nodeMap[id];
    var split = splitByOriginalSide(id, side);
    var above = split.above, below = split.below;
    var belowSize = stackSize(below, node);
    var aboveSize = stackSize(above, node);
    var shift = (belowSize - aboveSize) / 2;
    if (above.length > 0 && below.length > 0) {
      if (shift > 0) {
        var firstBelow = nodeMap[below[0]];
        var firstBelowInfo = layoutInfo(below[0]);
        shift = Math.min(shift, gapFor(node, firstBelow) + firstBelowInfo.above);
      } else if (shift < 0) {
        var firstAbove = nodeMap[above[0]];
        var firstAboveInfo = layoutInfo(above[0]);
        shift = Math.max(shift, -(gapFor(node, firstAbove) + firstAboveInfo.below));
      }
    }
    return { above: above, below: below, belowSize: belowSize, aboveSize: aboveSize, shift: shift };
  }

  function layoutInfo(id) {
    if (infoCache[id]) return infoCache[id];
    var node = nodeMap[id];
    var ownHalf = getH(node) / 2;
    // side\uBCC4\uB85C \uB3C5\uB9BD\uC801\uC73C\uB85C above+below \uBE14\uB85D\uC744 \uC7AC\uC13C\uD130\uB9C1\uD558\uBBC0\uB85C, \uC774 \uB178\uB4DC\uAC00 \uC790\uAE30 \uBD80\uBAA8\uC5D0\uAC8C
    // \uBCF4\uACE0\uD558\uB294 "\uD544\uC694 \uACF5\uAC04"\uB3C4 side\uBCC4\uB85C \uB530\uB85C \uAD6C\uD574\uC11C(\uC67C\uCABD\xB7\uC624\uB978\uCABD\uC740 \uC138\uB85C \uACF5\uAC04\uC744 \uC548 \uACB9\uCE58\uBBC0\uB85C
    // \uB354\uD558\uC9C0 \uC54A\uACE0 \uB354 \uB9CE\uC774 \uD544\uC694\uD55C \uCABD \uAE30\uC900) splitShift\uAC00 clamp\uD55C \uC2E4\uC81C shift\uB97C \uBC18\uC601\uD55C\uB2E4 \u2014
    // \uC548 \uADF8\uB7EC\uBA74 assign()\uC774 \uC2E4\uC81C\uB85C \uB9CC\uB4DC\uB294 \uC704\uCE58\uC640 \uC5B4\uAE0B\uB098 \uB2E4\uB978 \uD074\uB7EC\uC2A4\uD130\uC640 \uACB9\uCE60 \uC218 \uC788\uB2E4.
    var aboveReach = 0, belowReach = 0;
    [1, -1].forEach(function(side) {
      var s = splitShift(id, side);
      aboveReach = Math.max(aboveReach, s.aboveSize + s.shift);
      belowReach = Math.max(belowReach, s.belowSize - s.shift);
    });
    var info = { above: Math.max(ownHalf, aboveReach), below: Math.max(ownHalf, belowReach) };
    infoCache[id] = info;
    return info;
  }

  // \u2500\u2500 top-down: center Y \uD655\uC815 \u2500\u2500
  var centerY = {};
  function assign(id, cy) {
    var node = nodeMap[id];
    centerY[id] = cy;
    // \uC67C\uCABD/\uC624\uB978\uCABD\uC744 \uC644\uC804\uD788 \uB3C5\uB9BD\uC801\uC73C\uB85C \uBC30\uCE58\uD55C\uB2E4 \u2014 stackSize\uAC00 \uAC19\uC740 side\uC758 \uD615\uC81C\uB07C\uB9AC\uB9CC
    // \uB354\uD574\uC9C0\uBBC0\uB85C \uD55C\uCABD \uD06C\uAE30\uAC00 \uBC18\uB300\uCABD \uBD84\uAE30\uC810\uC5D0 \uC601\uD5A5\uC744 \uC8FC\uC9C0 \uC54A\uB294\uB2E4.
    [1, -1].forEach(function(side) {
      var s = splitShift(id, side);
      var below = s.below, above = s.above;
      var split = cy - s.shift;

      var cursor = split;
      for (var i = 0; i < below.length; i++) {
        var kid = nodeMap[below[i]];
        var kInfo = layoutInfo(below[i]);
        var prev = i === 0 ? node : nodeMap[below[i - 1]];
        cursor += gapFor(prev, kid) + kInfo.above;
        assign(below[i], cursor);
        cursor += kInfo.below;
      }
      cursor = split;
      for (var j = 0; j < above.length; j++) {
        var kid2 = nodeMap[above[j]];
        var kInfo2 = layoutInfo(above[j]);
        var prev2 = j === 0 ? node : nodeMap[above[j - 1]];
        cursor -= gapFor(prev2, kid2) + kInfo2.below;
        assign(above[j], cursor);
        cursor -= kInfo2.above;
      }
    });
  }

  // \u2500\u2500 \uB8E8\uD2B8 \uC2DC\uD000\uC2F1: X \uBC94\uC704\uAC00 \uACB9\uCE58\uB294 \uB8E8\uD2B8\uB07C\uB9AC\uB9CC \uADF8\uB8F9\uC73C\uB85C \uBB36\uC5B4 \uC6D0\uB798 \uC21C\uC11C(Y)\uB300\uB85C \uBC30\uCE58 \u2500\u2500
  var roots = NODES_DATA.filter(function(n) { return tree.isRoot[n.id]; });
  var rootPar = {};
  roots.forEach(function(r) { rootPar[r.id] = r.id; });
  function rootFind(id) {
    var p = rootPar[id];
    if (p === id) return id;
    var r = rootFind(p); rootPar[id] = r; return r;
  }
  for (var ri = 0; ri < roots.length; ri++) {
    for (var rj = ri + 1; rj < roots.length; rj++) {
      var a = roots[ri], b = roots[rj];
      if (a.lx < b.lx + getW(b) && b.lx < a.lx + getW(a)) {
        var fa = rootFind(a.id), fb = rootFind(b.id);
        if (fa !== fb) rootPar[fa] = fb;
      }
    }
  }
  var rootGroups = {};
  roots.forEach(function(r) {
    var g = rootFind(r.id);
    (rootGroups[g] = rootGroups[g] || []).push(r);
  });
  Object.keys(rootGroups).forEach(function(gk) {
    var group = rootGroups[gk];
    group.sort(function(a, b) { return (a.ly - b.ly) || (a.lx - b.lx); });
    var cursorBottom = -Infinity;
    for (var i = 0; i < group.length; i++) {
      var root = group[i];
      var info = layoutInfo(root.id);
      var naturalCenter = root.ly + getH(root) / 2;
      var gap = i === 0 ? 0 : gapFor(group[i - 1], root);
      var cy = i === 0 ? naturalCenter : Math.max(naturalCenter, cursorBottom + gap + info.above);
      assign(root.id, cy);
      cursorBottom = (centerY[root.id] !== undefined ? centerY[root.id] : cy) + info.below;
    }
  });

  var renderY = {};
  NODES_DATA.forEach(function(n) {
    var cy = centerY[n.id] !== undefined ? centerY[n.id] : (n.ly + getH(n) / 2);
    renderY[n.id] = cy - getH(n) / 2;
  });

  // \u2500\u2500 hop tier(\uAE4A\uC774)\uBCC4 X \uC815\uB82C \u2014 \uAC19\uC740 depth\uC758 \uBAA8\uB4E0 \uB178\uB4DC\uAC00 \uD56D\uC0C1 \uAC19\uC740 X\uC5D0\uC11C \uC2DC\uC791 \u2500\u2500
  var MIN_HOP_GAP = 750, COL_PAD = 60;
  // main topic(\uBC31\uBCF8)\uB3C4 hop1/hop2\uCC98\uB7FC \uD558\uB098\uC758 \uC138\uB85C\uC904\uB85C \uC790\uB3D9 \uC815\uB82C \u2014 depth 0 \uB178\uB4DC\uB294 raw
  // \uC88C\uD45C\uB97C \uADF8\uB300\uB85C \uC4F0\uC9C0 \uC54A\uACE0, main topic\uB4E4 \uC911 \uAC00\uC7A5 \uC67C\uCABD(raw x \uCD5C\uC18C\uAC12)\uC73C\uB85C \uC804\uBD80 \uD1B5\uC77C\uD55C\uB2E4.
  // depth 0\uC5D0\uB294 main topic \uC678\uC5D0 \uC5F0\uACB0 \uB04A\uAE34 \uACE0\uC544 \uB178\uB4DC\uB3C4 \uC11E\uC774\uBBC0\uB85C n.isMain\uC73C\uB85C \uD544\uD130\uB9C1
  // (\uACE0\uC544 \uB178\uB4DC\uB294 \uC6D0\uB798 \uC790\uC720 \uC88C\uD45C \uC720\uC9C0).
  var mainTopicAnchorX = 0;
  var mainTopicXs = NODES_DATA.filter(function(n) { return n.isMain; }).map(function(n) { return n.lx; });
  if (mainTopicXs.length > 0) mainTopicAnchorX = Math.min.apply(null, mainTopicXs);

  var maxDepth = 0;
  NODES_DATA.forEach(function(n) { maxDepth = Math.max(maxDepth, tree.depthOf[n.id] || 0); });
  // \uC804\uC5ED\uC5D0\uC11C \uAC00\uC7A5 \uB113\uC740 main topic \uD3ED \u2014 \uC5B4\uB290 main topic \uD558\uB098\uAC00 \uD45C \uB4F1\uC73C\uB85C \uB113\uC5B4\uC9C0\uBA74, \uADF8
  // main topic \uC790\uC2E0\uC758 \uC67C\uCABD\xB7\uC624\uB978\uCABD hop1 \uAC04\uACA9\uC774 \uB611\uAC19\uC774 \uC720\uC9C0\uB418\uB294 \uAC83\uC740 \uBB3C\uB860(\uC624\uB978\uCABD \uBCC0\uB9CC
  // \uB113\uC5B4\uC9C0\uBBC0\uB85C \uC624\uB978\uCABD \uACC4\uC0B0\uC5D0\uB9CC \uD544\uC694), \uB2E4\uB978(\uC548 \uB113\uC5B4\uC9C4) main topic\uB4E4\uC758 hop1\uB3C4 \uC804\uBD80 \uAC19\uC740
  // \uB9CC\uD07C \uAC19\uC774 \uBC00\uB824\uC11C hop1 \uC5F4\uC774 \uBB38\uC11C \uC804\uCCB4\uC5D0\uC11C \uACC4\uC18D \uB098\uB780\uD788 \uC815\uB82C\uB3FC\uC57C \uD55C\uB2E4. "\uC774 \uBE0C\uB79C\uCE58 \uC790\uC2E0\uC758
  // \uD3ED"\uC774 \uC544\uB2C8\uB77C "\uC804\uC5ED\uC5D0\uC11C \uC81C\uC77C \uB113\uC740 main topic\uC758 \uD3ED"\uC744 \uBAA8\uB4E0 \uBE0C\uB79C\uCE58\uC758 \uC624\uB978\uCABD \uC624\uD504\uC14B\uC5D0
  // \uB611\uAC19\uC774 \uB354\uD55C\uB2E4 \u2014 \uD45C\uAC00 \uC5C6\uB294 \uBCF4\uD1B5 \uC0C1\uD669(\uBAA8\uB4E0 main topic \uD3ED\uC774 \uAC19\uC74C)\uC5D0\uC11C\uB294 \uC774 \uAC12\uC774 \uACE7 \uC790\uAE30
  // \uD3ED\uACFC \uAC19\uC544\uC11C \uC88C\uC6B0 \uAC04\uACA9\uC774 \uC815\uD655\uD788 MIN_HOP_GAP\uC73C\uB85C \uB300\uCE6D\uC774\uB2E4. \uC67C\uCABD\uC740 main topic\uC774 \uC544\uBB34\uB9AC
  // \uB113\uC5B4\uC838\uB3C4 \uC67C\uCABD \uBCC0 \uC790\uCCB4\uB294 \uC6C0\uC9C1\uC774\uC9C0 \uC54A\uC73C\uBBC0\uB85C \uD56D\uC0C1 \uACE0\uC815 MIN_HOP_GAP.
  var globalWidestMainTopic = 0;
  NODES_DATA.forEach(function(n) {
    if (tree.depthOf[n.id] === 0) globalWidestMainTopic = Math.max(globalWidestMainTopic, getW(n));
  });
  var colOffset = {};
  [1, -1].forEach(function(side) {
    var offset = side === 1 ? globalWidestMainTopic + MIN_HOP_GAP : MIN_HOP_GAP;
    var prevMaxWidth = 0;
    for (var d = 1; d <= maxDepth; d++) {
      if (d > 1) offset += Math.max(MIN_HOP_GAP, prevMaxWidth + COL_PAD);
      colOffset[d + ':' + side] = offset;
      var widest = 0;
      NODES_DATA.forEach(function(n) {
        if (tree.depthOf[n.id] === d && sideOf[n.id] === side) widest = Math.max(widest, getW(n));
      });
      prevMaxWidth = widest;
    }
  });
  var renderX = {};
  NODES_DATA.forEach(function(n) {
    var depth = tree.depthOf[n.id] || 0;
    if (depth === 0) { renderX[n.id] = n.isMain ? mainTopicAnchorX : n.lx; return; }
    var side = sideOf[n.id] || 1;
    var root = nodeMap[tree.rootOf[n.id]];
    // root\uAC00 main topic\uC774\uBA74(\uD56D\uC0C1 \uADF8\uB807\uC9C4 \uC54A\uC74C \u2014 \uC5F0\uACB0 \uB04A\uAE34 \uACE0\uC544 \uB178\uB4DC\uB3C4 \uC790\uAE30 \uC790\uC190\uC758 root\uAC00
    // \uB420 \uC218 \uC788\uC74C) raw \uC88C\uD45C\uAC00 \uC544\uB2C8\uB77C \uC704\uC5D0\uC11C \uD1B5\uC77C\uD55C mainTopicAnchorX\uB97C \uAE30\uC900 \uC0BC\uC544\uC57C, main
    // topic \uC790\uC2E0\uC758 \uB80C\uB354 \uC704\uCE58\uC640 \uADF8 hop \uC790\uC2DD\uB4E4\uC758 \uB80C\uB354 \uC704\uCE58\uAC00 \uC11C\uB85C \uC5B4\uAE0B\uB098\uC9C0 \uC54A\uB294\uB2E4.
    var rootX = root.isMain ? mainTopicAnchorX : root.lx;
    var offset = colOffset[depth + ':' + side];
    if (offset === undefined) offset = depth * MIN_HOP_GAP;
    // offset\uC740 "root\uC640 \uAC00\uC7A5 \uAC00\uAE4C\uC6B4 \uCABD \uBAA8\uC11C\uB9AC"\uAE4C\uC9C0\uC758 \uAC70\uB9AC\uB2E4. side=1(\uC624\uB978\uCABD)\uC740 \uADF8 \uBAA8\uC11C\uB9AC\uAC00
    // \uACE7 CSS left(\uCE74\uB4DC\uC758 \uC67C\uCABD \uBCC0)\uB77C \uADF8\uB300\uB85C \uC4F0\uBA74 \uB418\uC9C0\uB9CC, side=-1(\uC67C\uCABD)\uC740 root\uC640 \uAC00\uC7A5 \uAC00\uAE4C\uC6B4
    // \uBAA8\uC11C\uB9AC\uAC00 \uCE74\uB4DC\uC758 \uC624\uB978\uCABD \uBCC0\uC774\uBBC0\uB85C, CSS left\uB97C \uAD6C\uD558\uB824\uBA74 \uAC70\uAE30\uC11C \uCE74\uB4DC \uB108\uBE44\uB9CC\uD07C \uB354 \uBE7C\uC57C
    // \uD55C\uB2E4(\uC67C\uCABD \uD615\uC81C\uB4E4\uC758 "\uC67C\uCABD \uBCC0"\uB9CC \uC815\uB82C\uB418\uACE0 main topic\uACFC \uAC00\uAE4C\uC6B4 "\uC624\uB978\uCABD \uBCC0"\uC740 \uCE74\uB4DC
    // \uB108\uBE44\uC5D0 \uB530\uB77C \uB4E4\uCB49\uB0A0\uCB49\uD574\uC9C0\uB294 \uAC78 \uB9C9\uAE30 \uC704\uD568).
    var nearRootEdge = rootX + side * offset;
    renderX[n.id] = side === 1 ? nearRootEdge : nearRootEdge - getW(n);
  });

  NODES_DATA.forEach(function(n) {
    var el = document.getElementById('node-' + n.id);
    if (!el) return;
    el.style.left = (renderX[n.id] !== undefined ? renderX[n.id] : n.lx) + 'px';
    el.style.top = (renderY[n.id] !== undefined ? renderY[n.id] : n.ly) + 'px';
  });
  // \uBC30\uCE58\uAC00 \uBC14\uB00C\uC5C8\uC73C\uBBC0\uB85C A* \uCE90\uC2DC \uBB34\uD6A8\uD654 \u2014 \uC989\uC2DC \uACBD\uB7C9\uC73C\uB85C \uADF8\uB9AC\uACE0 \uC7A0\uC7A0\uD574\uC9C0\uBA74 \uC815\uBC00\uD654
  routesDirty=true;
  drawEdges(true);
  scheduleEdgeRefine();
  drawGrid();
}

// \u2500\u2500 main topic(\uBC31\uBCF8) \uAE30\uC900 hop \uD2B8\uB9AC \u2014 Canvas.tsx\uC758 buildHopTree\uC640 \uB3D9\uC77C\uD55C \uADDC\uCE59
// (main_topic\uC740 \uD56D\uC0C1 \uB8E8\uD2B8, \uADF8 \uC678\uB294 children[]/edge\uB85C \uCC3E\uC740 \uBD80\uBAA8\uC5D0 \uADC0\uC18D, \uBD80\uBAA8\uB97C \uBABB
// \uCC3E\uC73C\uBA74 \uB3C5\uB9BD \uB8E8\uD2B8). \uB514\uBC84\uADF8 \uACA9\uC790\uC640 Ctrl+F \uAC80\uC0C9\uC758 BFS \uC815\uB82C \uB458 \uB2E4 \uC774 \uD2B8\uB9AC\uB97C \uACF5\uC720\uD55C\uB2E4
// (\uB808\uC774\uC544\uC6C3 \uC7AC\uAD6C\uD604\uB9C8\uB2E4 \uB450 \uACF3\uC774 \uC11C\uB85C \uB2E4\uB978 \uB85C\uC9C1\uC73C\uB85C \uC5B4\uAE0B\uB098\uB294 \uAC83\uC744 \uD53C\uD558\uAE30 \uC704\uD568 \u2014 \uC5D0\uB514\uD130
// \uCABD\uC5D0\uC11C layoutInfo/assign\uC774 \uB530\uB85C \uB180\uC544\uC11C \uACB9\uCE68 \uBC84\uADF8\uAC00 \uB0AC\uB358 \uAC83\uACFC \uAC19\uC740 \uC885\uB958\uC758 \uC2E4\uC218\uB97C
// \uC5EC\uAE30\uC11C\uB3C4 \uBC18\uBCF5\uD558\uC9C0 \uC54A\uAE30 \uC704\uD568).
function buildHopTreeJs() {
  var nodeById = {};
  NODES_DATA.forEach(function(n) { nodeById[n.id] = n; });
  function parentIdOf(nodeId) {
    var byChildren = null;
    NODES_DATA.forEach(function(n) {
      if (!byChildren && (n.children || []).indexOf(nodeId) !== -1) byChildren = n.id;
    });
    if (byChildren) return byChildren;
    var byEdge = null;
    EDGES.forEach(function(e) { if (!byEdge && e.target === nodeId) byEdge = e.source; });
    if (byEdge) return byEdge;
    // \uD3EC\uD2B8\uB97C \uBC18\uB300 \uBC29\uD5A5(\uC0C8 \uB178\uB4DC \u2192 \uAE30\uC874 \uB178\uB4DC)\uC73C\uB85C \uB04C\uC5B4 \uB9CC\uB4E0 \uC5E3\uC9C0\uB294 source/target\uC774 \uB4A4\uBC14\uB010
    // \uCC44\uB85C \uC800\uC7A5\uB3FC \uC788\uC744 \uC218 \uC788\uB2E4(source=\uC774 \uB178\uB4DC, target=main topic) \u2014 Canvas.tsx\uC758
    // buildHopTree\uC640 \uB3D9\uC77C\uD558\uAC8C, \uC774\uB7F0 \uAE30\uC874 \uB370\uC774\uD130\uB3C4 \uC5EC\uAE30\uC11C \uC778\uC2DD\uD574\uC918\uC57C \uC5D0\uB514\uD130\uC640 \uAC19\uC740
    // \uD2B8\uB9AC \uAD6C\uC870\uAC00 \uB098\uC628\uB2E4(\uC548 \uADF8\uB7EC\uBA74 \uC774 \uB178\uB4DC\uAC00 \uC798\uBABB \uB3C5\uB9BD \uB8E8\uD2B8\uB85C \uCDE8\uAE09\uB428).
    var reversedToMain = null;
    EDGES.forEach(function(e) {
      if (!reversedToMain && e.source === nodeId && nodeById[e.target] && nodeById[e.target].isMain) reversedToMain = e.target;
    });
    return reversedToMain;
  }
  var isRoot = {}, parentOf = {};
  NODES_DATA.forEach(function(n) {
    if (n.isMain) { isRoot[n.id] = true; return; }
    var p = parentIdOf(n.id);
    if (p && nodeById[p]) parentOf[n.id] = p; else isRoot[n.id] = true;
  });
  var depthOf = {}, rootOf = {};
  function computeDepth(id) {
    if (depthOf[id] !== undefined) return;
    if (isRoot[id]) { depthOf[id] = 0; rootOf[id] = id; return; }
    computeDepth(parentOf[id]);
    depthOf[id] = depthOf[parentOf[id]] + 1;
    rootOf[id] = rootOf[parentOf[id]];
  }
  NODES_DATA.forEach(function(n) { computeDepth(n.id); });
  return { isRoot: isRoot, parentOf: parentOf, depthOf: depthOf, rootOf: rootOf };
}

// \u2500\u2500 \uB514\uBC84\uADF8 \uACA9\uC790 \u2014 Canvas.tsx\uC758 computeGridLines\uC640 \uB3D9\uC77C\uD55C \uADDC\uCE59(\uAC00\uB85C\uC120: main topic
// \uD074\uB7EC\uC2A4\uD130 \uACBD\uACC4, \uC138\uB85C\uC120: hop depth\uBCC4 X \uACBD\uACC4). recomputePositions()\uAC00 \uC774\uC81C \uC5D0\uB514\uD130\uC640
// \uB3D9\uC77C\uD55C hop-tree \uB808\uC774\uC544\uC6C3 \uC54C\uACE0\uB9AC\uC998\uC744 \uC4F0\uC9C0\uB9CC, \uACA9\uC790 \uC790\uCCB4\uB294 \uADF8 \uACC4\uC0B0 \uACB0\uACFC\uC5D0 \uC758\uC874\uD558\uC9C0
// \uC54A\uACE0 \uD604\uC7AC DOM\uC5D0 \uC2E4\uC81C\uB85C \uADF8\uB824\uC9C4 \uC704\uCE58(el.style.left/top + offsetWidth/offsetHeight)\uB97C
// \uADF8\uB300\uB85C \uC77D\uC5B4\uC11C \uACC4\uC0B0\uD558\uBBC0\uB85C \uC5B4\uB5A4 \uBC30\uCE58 \uC54C\uACE0\uB9AC\uC998\uC744 \uC4F0\uB4E0 \uD56D\uC0C1 \uC2E4\uC81C \uB80C\uB354 \uACB0\uACFC\uC640 \uC77C\uCE58\uD55C\uB2E4.
var showGrid = false;
function computeGridLinesJs() {
  var tree = buildHopTreeJs();
  var nodeById = {};
  NODES_DATA.forEach(function(n) { nodeById[n.id] = n; });
  var rectById = {};
  NODES_DATA.forEach(function(n) {
    var el = document.getElementById('node-' + n.id);
    if (el) rectById[n.id] = { x: parseFloat(el.style.left) || 0, y: parseFloat(el.style.top) || 0, w: el.offsetWidth, h: el.offsetHeight };
  });
  function rootIsMain(id) {
    var r = nodeById[tree.rootOf[id]];
    return !!(r && r.isMain);
  }

  // \uAC00\uB85C\uC120: main topic \uD074\uB7EC\uC2A4\uD130(\uC790\uC2E0+hop \uC790\uC190 \uC804\uCCB4)\uC758 Y \uBC94\uC704 \uACBD\uACC4
  var clusterYRange = {};
  NODES_DATA.forEach(function(n) {
    if (!rootIsMain(n.id)) return;
    var rect = rectById[n.id];
    if (!rect) return;
    var root = tree.rootOf[n.id];
    var top = rect.y, bottom = rect.y + rect.h;
    if (!clusterYRange[root]) clusterYRange[root] = { min: top, max: bottom };
    else { clusterYRange[root].min = Math.min(clusterYRange[root].min, top); clusterYRange[root].max = Math.max(clusterYRange[root].max, bottom); }
  });
  var roots = NODES_DATA.filter(function(n) { return tree.depthOf[n.id] === 0 && clusterYRange[n.id]; });
  var rootPar = {};
  roots.forEach(function(r) { rootPar[r.id] = r.id; });
  function rfind(id) {
    var p = rootPar[id];
    if (p === id) return id;
    var r = rfind(p); rootPar[id] = r; return r;
  }
  for (var i = 0; i < roots.length; i++) {
    for (var j = i + 1; j < roots.length; j++) {
      var a = roots[i], b = roots[j];
      var ra = rectById[a.id], rb = rectById[b.id];
      if (!ra || !rb) continue;
      if (ra.x < rb.x + rb.w && rb.x < ra.x + ra.w) {
        var fa = rfind(a.id), fb = rfind(b.id);
        if (fa !== fb) rootPar[fa] = fb;
      }
    }
  }
  var groups = {};
  roots.forEach(function(r) {
    var g = rfind(r.id);
    (groups[g] = groups[g] || []).push(r);
  });
  var hLines = [];
  Object.keys(groups).forEach(function(gk) {
    var group = groups[gk];
    group.sort(function(a, b) { return (rectById[a.id] ? rectById[a.id].y : 0) - (rectById[b.id] ? rectById[b.id].y : 0); });
    for (var k = 1; k < group.length; k++) {
      var prevR = clusterYRange[group[k - 1].id], curR = clusterYRange[group[k].id];
      hLines.push((prevR.max + curR.min) / 2);
    }
  });

  // \uC138\uB85C\uC120: hop depth\uBCC4 X \uBC94\uC704 \uACBD\uACC4 (main topic \uAE30\uC900 \uC88C/\uC6B0 \uBC29\uD5A5 \uBD84\uB9AC)
  var depthSideXRange = {};
  NODES_DATA.forEach(function(n) {
    if (!rootIsMain(n.id)) return;
    var rect = rectById[n.id];
    if (!rect) return;
    var d = tree.depthOf[n.id];
    var rootRect = rectById[tree.rootOf[n.id]];
    var side = d === 0 ? 0 : (rootRect && rect.x >= rootRect.x ? 1 : -1);
    var key = d + ':' + side;
    var left = rect.x, right = rect.x + rect.w;
    if (!depthSideXRange[key]) depthSideXRange[key] = { min: left, max: right };
    else { depthSideXRange[key].min = Math.min(depthSideXRange[key].min, left); depthSideXRange[key].max = Math.max(depthSideXRange[key].max, right); }
  });
  var vLines = [];
  var mainRange = depthSideXRange['0:0'];
  if (mainRange) {
    [1, -1].forEach(function(side) {
      var prev = mainRange, d = 1;
      while (depthSideXRange[d + ':' + side]) {
        var cur = depthSideXRange[d + ':' + side];
        if (side === 1 && cur.min > prev.max) vLines.push((prev.max + cur.min) / 2);
        else if (side === -1 && prev.min > cur.max) vLines.push((cur.max + prev.min) / 2);
        prev = cur; d++;
      }
    });
  }
  return { hLines: hLines, vLines: vLines };
}
// data-base-sw/-dash: \uD655\uB300/\uCD95\uC18C\uD574\uB3C4 \uD654\uBA74\uC0C1 \uB450\uAED8\uAC00 \uC720\uC9C0\uB418\uB3C4\uB85D(\uC5D0\uB514\uD130\uC758 WireLayer
// zoom \uBCF4\uC815\uACFC \uB3D9\uC77C \uADDC\uCE59) zoom=1 \uAE30\uC900 \uAC12\uC744 \uAE30\uB85D\uD574\uB450\uACE0, updateZoomLineWeights()\uAC00
// \uD604\uC7AC scale\uC5D0 \uB9DE\uCDB0 \uC2E4\uC81C stroke-width/dasharray\uB97C \uB9E4\uBC88 \uB2E4\uC2DC \uACC4\uC0B0\uD55C\uB2E4.
function svgGridLine(x1, y1, x2, y2, stroke) {
  var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
  l.setAttribute('stroke', stroke);
  l.setAttribute('data-base-sw', '1.5');
  l.setAttribute('data-base-dash', '6 4');
  l.setAttribute('opacity', '0.55');
  return l;
}
function drawGrid() {
  var svg = document.getElementById('grid-svg');
  svg.innerHTML = '';
  if (!showGrid) { svg.style.display = 'none'; return; }
  svg.style.display = '';
  var lines = computeGridLinesJs();
  lines.vLines.forEach(function(x) { svg.appendChild(svgGridLine(x, 0, x, 10000, '#22c55e')); });
  lines.hLines.forEach(function(y) { svg.appendChild(svgGridLine(0, y, 10000, y, '#f97316')); });
  updateZoomLineWeights();
}
function toggleGrid() {
  showGrid = !showGrid;
  var btn = document.getElementById('tb-grid-btn');
  if (showGrid) { btn.style.background = '#2563eb'; btn.style.color = '#fff'; btn.style.borderColor = '#1d4ed8'; }
  else { btn.style.background = ''; btn.style.color = ''; btn.style.borderColor = ''; }
  drawGrid();
}

// Edge drawing
// A* \uB77C\uC6B0\uD305 \uCE90\uC2DC: \uB178\uB4DC \uBC30\uCE58\uAC00 \uBC14\uB014 \uB54C\uB9CC(routesDirty) \uC7AC\uACC4\uC0B0 \u2014 \uC0C9\uC0C1 \uBCC0\uACBD \uB4F1\uC740 \uC7AC\uC0AC\uC6A9
var cachedRoutes=null, routesDirty=true;
var edgeRefineTimer=null;
// fold/\uB4DC\uB86D \uC9C1\uD6C4: \uACBD\uB7C9 \uD734\uB9AC\uC2A4\uD2F1\uC73C\uB85C \uC989\uC2DC \uADF8\uB9B0 \uB4A4 150ms \uD6C4 A* \uC815\uBC00 \uACBD\uB85C\uB85C \uAD50\uCCB4
function scheduleEdgeRefine(){
  if(edgeRefineTimer) clearTimeout(edgeRefineTimer);
  edgeRefineTimer=setTimeout(function(){edgeRefineTimer=null;drawEdges();},150);
}
function getNodeRect(el) {
  var x = parseFloat(el.style.left)||0, y = parseFloat(el.style.top)||0;
  return { x:x, y:y, w:el.offsetWidth, h:el.offsetHeight, cx:x+el.offsetWidth*.5, cy:y+el.offsetHeight*.5 };
}
function getBestPorts(sr, tr) {
  var sp=[{name:'right',p:[sr.x+sr.w,sr.cy]},{name:'left',p:[sr.x,sr.cy]},{name:'bottom',p:[sr.cx,sr.y+sr.h]},{name:'top',p:[sr.cx,sr.y]}];
  var tp=[{name:'left',p:[tr.x,tr.cy]},{name:'right',p:[tr.x+tr.w,tr.cy]},{name:'top',p:[tr.cx,tr.y]},{name:'bottom',p:[tr.cx,tr.y+tr.h]}];
  var best=null,bestD=Infinity;
  sp.forEach(function(s){tp.forEach(function(t){var dx=s.p[0]-t.p[0],dy=s.p[1]-t.p[1],d=dx*dx+dy*dy;if(d<bestD){bestD=d;best={sp:s,tp:t};}});});
  return best;
}
var DIR={right:[1,0],left:[-1,0],bottom:[0,1],top:[0,-1]};

// \u2500\u2500 \uC7A5\uC560\uBB3C \uD68C\uD53C \uB77C\uC6B0\uD305 (\uC5D0\uB514\uD130 wireGeometry.getRoutedPath\uC640 \uB3D9\uC77C \uC54C\uACE0\uB9AC\uC998) \u2500\u2500
// \uC120\uBD84\uC774 (pad\uB9CC\uD07C \uBD80\uD480\uB9B0) \uC0AC\uAC01\uD615\uACFC \uAD50\uCC28\uD558\uBA74 \uC9C4\uC785 t(0~1), \uC544\uB2C8\uBA74 null (Liang-Barsky)
function segRectT(x1,y1,x2,y2,r,pad){
  var rx=r.x-pad,ry=r.y-pad,rw=r.w+pad*2,rh=r.h+pad*2;
  var dx=x2-x1,dy=y2-y1,t0=0,t1=1;
  var p=[-dx,dx,-dy,dy],q=[x1-rx,rx+rw-x1,y1-ry,ry+rh-y1];
  for(var i=0;i<4;i++){
    if(p[i]===0){if(q[i]<0)return null;}
    else{var t=q[i]/p[i];
      if(p[i]<0){if(t>t1)return null;if(t>t0)t0=t;}
      else{if(t<t0)return null;if(t<t1)t1=t;}}
  }
  return t0;
}
function dlen(a,b){return Math.hypot(b.x-a.x,b.y-a.y);}
// src\u2192tgt \uC9C1\uC120\uC774 \uB178\uB4DC\uB97C \uAD00\uD1B5\uD558\uBA74 \uC704/\uC544\uB798(\uB610\uB294 \uC88C/\uC6B0) \uC9E7\uC740 \uCABD\uC73C\uB85C \uC6B0\uD68C \uACBD\uC720\uC810 \uC0BD\uC785
function routeAround(src,tgt,obstacles){
  var PAD=10,CLEAR=34;
  var pts=[src,tgt],guard=0,i=0;
  while(i<pts.length-1&&guard<16&&pts.length<8){
    guard++;
    var a=pts[i],b=pts[i+1],hit=null,hitT=Infinity;
    for(var oi=0;oi<obstacles.length;oi++){
      var t=segRectT(a.x,a.y,b.x,b.y,obstacles[oi],PAD);
      if(t!==null&&t<hitT){hitT=t;hit=obstacles[oi];}
    }
    if(!hit){i++;continue;}
    var horiz=Math.abs(b.x-a.x)>=Math.abs(b.y-a.y),w;
    if(horiz){
      var top={x:hit.x+hit.w/2,y:hit.y-CLEAR},bot={x:hit.x+hit.w/2,y:hit.y+hit.h+CLEAR};
      w=dlen(a,top)+dlen(top,b)<=dlen(a,bot)+dlen(bot,b)?top:bot;
    }else{
      var lft={x:hit.x-CLEAR,y:hit.y+hit.h/2},rgt={x:hit.x+hit.w+CLEAR,y:hit.y+hit.h/2};
      w=dlen(a,lft)+dlen(lft,b)<=dlen(a,rgt)+dlen(rgt,b)?lft:rgt;
    }
    var dup=pts.some(function(p){return Math.abs(p.x-w.x)<1&&Math.abs(p.y-w.y)<1;});
    if(dup){i++;continue;}
    pts.splice(i+1,0,w);
    // i \uC720\uC9C0 \u2192 a\u2192w \uC138\uADF8\uBA3C\uD2B8 \uC7AC\uAC80\uC0AC
  }
  return pts;
}
// \uACBD\uC720\uC810 \uD3F4\uB9AC\uB77C\uC778 \u2192 \uBD80\uB4DC\uB7EC\uC6B4 path (\uACBD\uC720\uC810 = Q \uC81C\uC5B4\uC810, \uB2E4\uC74C \uACBD\uC720\uC810\uACFC\uC758 \uC911\uC810 \uC5F0\uACB0)
function ptsToPath(P){
  if(P.length<2) return '';
  if(P.length===2) return 'M'+P[0].x+','+P[0].y+' L'+P[1].x+','+P[1].y;
  var d='M'+P[0].x+','+P[0].y;
  for(var k=1;k<P.length-1;k++){
    var ex,ey;
    if(k<P.length-2){ex=(P[k].x+P[k+1].x)/2;ey=(P[k].y+P[k+1].y)/2;}
    else{ex=P[P.length-1].x;ey=P[P.length-1].y;}
    d+=' Q'+P[k].x+','+P[k].y+' '+ex+','+ey;
  }
  return d;
}
// \uD3F4\uB9AC\uB77C\uC778 \uC911\uAC04 \uACBD\uC720\uC810\uB4E4\uC744 \uBC95\uC120 \uBC29\uD5A5\uC73C\uB85C spread\uB9CC\uD07C \uC774\uB3D9 (\uD3C9\uD589 \uC5E3\uC9C0 \uBD84\uC0B0)
function spreadPts(pts,spread){
  if(!spread||pts.length<3) return pts;
  var s=pts[0],t=pts[pts.length-1];
  var dl=dlen(s,t)||1;
  var nx=-(t.y-s.y)/dl,ny=(t.x-s.x)/dl;
  var mid=pts.slice(1,-1).map(function(p){return{x:p.x+nx*spread,y:p.y+ny*spread};});
  return [s].concat(mid,[t]);
}
// \u2500\u2500 \uADF8\uB9AC\uB4DC A* \uC804\uC5ED \uB77C\uC6B0\uD305 (\uC5D0\uB514\uD130 wireGeometry.routeEdgesOnGrid\uC640 \uB3D9\uC77C \uC54C\uACE0\uB9AC\uC998) \u2500\u2500
// \uC140 \uBE44\uC6A9: \uB178\uB4DC \uB0B4\uBD80 200(\uBD88\uAC00\uD53C\uD558\uBA74 \uD1B5\uACFC \uAC00\uB2A5), \uB178\uB4DC \uC8FC\uBCC0 \uBC34\uB4DC 3(\uAC70\uB9AC \uC720\uC9C0),
// \uC774\uBBF8 \uD655\uC815\uB41C \uC120\uC774 \uC9C0\uB098\uAC04 \uC140 +4(\uC120\uB07C\uB9AC \uBD84\uC0B0 \u2014 \uBE48 \uACF5\uAC04\uC774 \uC788\uC73C\uBA74 \uADF8\uCABD\uC73C\uB85C \uC6B0\uD68C)
function routeEdgesGrid(reqs,rects){
  var out={};
  if(!reqs.length) return out;
  var NEAR=3,INSIDE=200,USE=4,TURN=0.2;
  var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  rects.forEach(function(o){var r=o.rect;
    minX=Math.min(minX,r.x);minY=Math.min(minY,r.y);
    maxX=Math.max(maxX,r.x+r.w);maxY=Math.max(maxY,r.y+r.h);});
  reqs.forEach(function(r){
    minX=Math.min(minX,r.src.x,r.tgt.x);minY=Math.min(minY,r.src.y,r.tgt.y);
    maxX=Math.max(maxX,r.src.x,r.tgt.x);maxY=Math.max(maxY,r.src.y,r.tgt.y);});
  minX-=80;minY-=80;maxX+=80;maxY+=80;
  var cell=24;
  while(((maxX-minX)/cell)*((maxY-minY)/cell)>150000) cell*=2;
  var gw=Math.max(2,Math.ceil((maxX-minX)/cell));
  var gh=Math.max(2,Math.ceil((maxY-minY)/cell));
  var N=gw*gh;
  function cellX(x){return Math.min(gw-1,Math.max(0,Math.floor((x-minX)/cell)));}
  function cellY(y){return Math.min(gh-1,Math.max(0,Math.floor((y-minY)/cell)));}
  var baseCost=new Float64Array(N);
  rects.forEach(function(o){var r=o.rect;
    var ox0=cellX(r.x-cell),ox1=cellX(r.x+r.w+cell);
    var oy0=cellY(r.y-cell),oy1=cellY(r.y+r.h+cell);
    var ix0=cellX(r.x),ix1=cellX(r.x+r.w),iy0=cellY(r.y),iy1=cellY(r.y+r.h);
    for(var gy=oy0;gy<=oy1;gy++)for(var gx=ox0;gx<=ox1;gx++){
      var inside=gx>=ix0&&gx<=ix1&&gy>=iy0&&gy<=iy1;
      baseCost[gy*gw+gx]+=inside?INSIDE:NEAR;
    }});
  var useCost=new Float64Array(N),gScore=new Float64Array(N);
  var stampArr=new Int32Array(N),fromArr=new Int32Array(N),dirArr=new Int8Array(N);
  var stamp=0;
  var DIRS8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  var STEP8=[1,1,1,1,Math.SQRT2,Math.SQRT2,Math.SQRT2,Math.SQRT2];
  // \uC9E7\uC740 \uC5E3\uC9C0\uBD80\uD130 (\uB3D9\uB960\uC774\uBA74 srcId/tgtId \uC0AC\uC804\uC21C \u2014 \uC5D0\uB514\uD130\uC640 \uACB0\uACFC \uC77C\uCE58 \uBCF4\uC7A5)
  var order=reqs.slice().sort(function(a,b){
    return (dlen(a.src,a.tgt)-dlen(b.src,b.tgt))||
      (a.srcId<b.srcId?-1:a.srcId>b.srcId?1:0)||
      (a.tgtId<b.tgtId?-1:a.tgtId>b.tgtId?1:0);});
  order.forEach(function(req){
    var sIdx=cellY(req.src.y)*gw+cellX(req.src.x);
    var tIdx=cellY(req.tgt.y)*gw+cellX(req.tgt.x);
    if(sIdx===tIdx){out[req.key]=[req.src,req.tgt];return;}
    stamp++;
    var heapF=[],heapI=[];
    function hpush(f,idx){
      var i=heapF.length;heapF.push(f);heapI.push(idx);
      while(i>0){var p=(i-1)>>1;
        if(heapF[p]<=heapF[i])break;
        var tf=heapF[p];heapF[p]=heapF[i];heapF[i]=tf;
        var ti=heapI[p];heapI[p]=heapI[i];heapI[i]=ti;i=p;}
    }
    function hpop(){
      var top=heapI[0];var lf=heapF.pop(),li=heapI.pop();
      if(heapF.length){heapF[0]=lf;heapI[0]=li;var i=0;
        for(;;){var l=i*2+1,r=l+1,m=i;
          if(l<heapF.length&&heapF[l]<heapF[m])m=l;
          if(r<heapF.length&&heapF[r]<heapF[m])m=r;
          if(m===i)break;
          var tf=heapF[m];heapF[m]=heapF[i];heapF[i]=tf;
          var ti=heapI[m];heapI[m]=heapI[i];heapI[i]=ti;i=m;}}
      return top;
    }
    var tgx=tIdx%gw,tgy=(tIdx/gw)|0;
    function hDist(idx){return Math.hypot((idx%gw)-tgx,((idx/gw)|0)-tgy);}
    gScore[sIdx]=0;stampArr[sIdx]=stamp;fromArr[sIdx]=-1;dirArr[sIdx]=-1;
    hpush(hDist(sIdx),sIdx);
    var found=false,iter=0;
    while(heapF.length&&iter<60000){
      iter++;
      var cur=hpop();
      if(cur===tIdx){found=true;break;}
      var cgx=cur%gw,cgy=(cur/gw)|0,cg=gScore[cur],cd=dirArr[cur];
      for(var di=0;di<8;di++){
        var ngx=cgx+DIRS8[di][0],ngy=cgy+DIRS8[di][1];
        if(ngx<0||ngy<0||ngx>=gw||ngy>=gh)continue;
        var nIdx=ngy*gw+ngx;
        var ng=cg+STEP8[di]+baseCost[nIdx]+useCost[nIdx]+(cd!==-1&&cd!==di?TURN:0);
        if(stampArr[nIdx]===stamp&&gScore[nIdx]<=ng)continue;
        stampArr[nIdx]=stamp;gScore[nIdx]=ng;fromArr[nIdx]=cur;dirArr[nIdx]=di;
        hpush(ng+hDist(nIdx),nIdx);
      }
    }
    if(!found){out[req.key]=null;return;}
    // \uACBD\uB85C \uBCF5\uC6D0 (\uC140 \uC911\uC2EC) \u2014 \uC591 \uB05D\uC740 \uC2E4\uC81C \uD3EC\uD2B8 \uC88C\uD45C\uB85C \uB300\uCCB4
    var cellsRev=[];
    for(var c=tIdx;c!==-1;c=fromArr[c])cellsRev.push(c);
    cellsRev.reverse();
    var raw=cellsRev.map(function(c2){return{x:minX+(c2%gw)*cell+cell/2,y:minY+((c2/gw)|0)*cell+cell/2};});
    raw[0]={x:req.src.x,y:req.src.y};
    raw[raw.length-1]={x:req.tgt.x,y:req.tgt.y};
    // string pulling: \uC790\uAE30 \uC591\uB05D \uB178\uB4DC\uB97C \uC81C\uC678\uD55C \uB178\uB4DC \uB0B4\uBD80\uB97C \uC9C0\uB098\uC9C0 \uC54A\uB294 \uD55C \uC9C1\uC120\uD654
    var blockers=[];
    rects.forEach(function(o){if(o.id!==req.srcId&&o.id!==req.tgtId)blockers.push(o.rect);});
    function clearSeg(a,b){
      for(var bi=0;bi<blockers.length;bi++)
        if(segRectT(a.x,a.y,b.x,b.y,blockers[bi],12)!==null)return false;
      return true;
    }
    var pts=[raw[0]];
    var i2=0;
    while(i2<raw.length-1){
      var j=raw.length-1;
      while(j>i2+1&&!clearSeg(raw[i2],raw[j]))j--;
      pts.push(raw[j]);i2=j;
    }
    out[req.key]=pts;
    // \uC774\uD6C4 \uC5E3\uC9C0\uC758 congestion \uBE44\uC6A9: \uD655\uC815 \uACBD\uB85C\uAC00 \uC9C0\uB098\uB294 \uC140\uC5D0 \uAC00\uC0B0
    for(var k=0;k<pts.length-1;k++){
      var a2=pts[k],b2=pts[k+1];
      var steps=Math.max(1,Math.ceil(dlen(a2,b2)/cell));
      for(var s2=0;s2<=steps;s2++){
        var px=a2.x+(b2.x-a2.x)*(s2/steps);
        var py=a2.y+(b2.y-a2.y)*(s2/steps);
        useCost[cellY(py)*gw+cellX(px)]+=USE;
      }
    }
  });
  return out;
}
// \uD655\uB300(zoom>=100%)\uBA74 \uAE30\uBCF8 \uB450\uAED8, \uCD95\uC18C(zoom<100%)\uBA74 \uD654\uBA74\uC0C1 \uB450\uAED8\uAC00 \uC720\uC9C0\uB418\uB3C4\uB85D \uBC18\uBE44\uB840\uB85C
// \uD0A4\uC6C0(\uC5D0\uB514\uD130\uC758 WireLayer.tsx\uC758 zc = zoom<1 ? 1/zoom : 1 \uACFC \uB3D9\uC77C \uADDC\uCE59). \uB808\uC774\uC544\uC6C3\uC774
// \uC548 \uBC14\uB00C\uB294 \uC21C\uC218 \uC90C \uC870\uC791(wheel)\uC5D0\uC11C\uB294 \uACBD\uB85C\uB97C \uB2E4\uC2DC \uADF8\uB9AC\uC9C0 \uC54A\uACE0 \uC774\uBBF8 \uADF8\uB824\uC9C4 \uC694\uC18C\uB4E4\uC758
// stroke-width/dasharray\uB9CC \uAC31\uC2E0 \u2014 \uAC00\uBCCD\uACE0, wheel\uB9C8\uB2E4 A* \uC7AC\uACC4\uC0B0\uD560 \uD544\uC694\uAC00 \uC5C6\uC74C.
function updateZoomLineWeights() {
  var zc = scale < 1 ? 1 / scale : 1;
  document.querySelectorAll('[data-base-sw]').forEach(function(el) {
    var base = parseFloat(el.getAttribute('data-base-sw'));
    el.setAttribute('stroke-width', String(base * zc));
  });
  document.querySelectorAll('[data-base-dash]').forEach(function(el) {
    var parts = el.getAttribute('data-base-dash').split(' ').map(Number);
    el.setAttribute('stroke-dasharray', parts.map(function(p) { return p * zc; }).join(' '));
  });
}
function drawEdges(fast) {
  var svg=document.getElementById('wire-svg');
  svg.querySelectorAll('.ng-eg').forEach(function(el){el.remove();});

  // \uB178\uB4DC rect \uCE90\uC2DC (\uC5E3\uC9C0 \uB77C\uC6B0\uD305 \uC7A5\uC560\uBB3C \uAC80\uC0AC\uC6A9 \u2014 drawEdges 1\uD68C\uB2F9 1\uD68C\uB9CC DOM \uC870\uD68C)
  var rectById={};
  NODES_DATA.forEach(function(n){
    var el=document.getElementById('node-'+n.id);
    if(el) rectById[n.id]=getNodeRect(el);
  });

  // hop \uC790\uC2DD(line) \uC5E3\uC9C0: \uBC84\uC2A4 \uB77C\uC6B0\uD305\uB3C4, A*/\uCEE4\uBE0C \uB77C\uC6B0\uD305\uB3C4 \uC5C6\uC774 \uADF8\uB0E5 \uD3C9\uBC94\uD55C \uC9C1\uC120
  // (\uC5D0\uB514\uD130 WireLayer.tsx\uC640 \uB3D9\uC77C \u2014 \uC608\uC804\uC5D4 "\uAC19\uC740 source\uC5D0\uC11C \uB098\uAC00\uB294 line \uC5E3\uC9C0 \uC5EC\uB7FF\uC744
  // \uC138\uB85C \uD2B8\uB801\uD06C\uB85C \uBB36\uB294 \uBC84\uC2A4 \uB77C\uC6B0\uD305"\uC774 \uC788\uC5C8\uB294\uB370, \uC5D0\uB514\uD130\uAC00 \uC774\uBBF8 \uADF8\uAC78 \uBC84\uB9AC\uACE0 \uC21C\uC218 \uC9C1\uC120\uC73C\uB85C
  // \uBC14\uAFBC \uC9C0 \uC624\uB798\uB77C \uC5EC\uAE30\uB9CC \uC548 \uB530\uB77C\uC640 \uC788\uC5C8\uC74C). \uD3EC\uD2B8\uB294 \uD56D\uC0C1 \uC88C/\uC6B0\uB9CC \uAC15\uC81C \u2014 getBestPorts\uCC98\uB7FC
  // top/bottom\uAE4C\uC9C0 \uC720\uD074\uB9AC\uB4DC \uCD5C\uC19F\uAC12\uC73C\uB85C \uACE0\uB974\uBA74, \uD0C0\uAC9F\uC774 \uBD80\uBAA8 \uC911\uC2EC\uC5D0\uC11C \uC218\uC9C1\uC73C\uB85C \uB9CE\uC774
  // \uB5A8\uC5B4\uC9C4 \uD615\uC81C \uD558\uB098\uB9CC \uD3EC\uD2B8\uAC00 top/bottom\uC73C\uB85C \uB4A4\uC9D1\uD600 \uB2E4\uB978 \uD615\uC81C \uC120\uC744 \uAC00\uB85C\uC9C8\uB7EC \uC9C0\uB098\uAC00
  // \uBC84\uB9AC\uB294 \uBB38\uC81C\uAC00 \uC788\uC5C8\uB2E4(\uC0AC\uC6A9\uC790\uAC00 export html \uC2A4\uD06C\uB9B0\uC0F7\uC73C\uB85C \uC7AC\uC9C0\uC801: "\uC120\uC774 \uC65C \uAE54\uB054\uD558\uAC8C
  // \uC815\uB9AC\uB418\uC9C0 \uC54A\uC740 \uAC70\uC9C0" \u2014 \uCCAB main topic\uB9CC \uAE54\uB054\uD558\uACE0 \uB098\uBA38\uC9C0\uB294 \uC120\uC774 \uAD50\uCC28\uD574 \uBCF4\uC784).
  function horizontalPorts(sr,tr){
    var scx=sr.x+sr.w/2, tcx=tr.x+tr.w/2;
    return tcx>=scx ? {sp:'right',tp:'left'} : {sp:'left',tp:'right'};
  }
  function portXY(r,name){
    if(name==='right') return [r.x+r.w,r.cy];
    if(name==='left') return [r.x,r.cy];
    if(name==='bottom') return [r.cx,r.y+r.h];
    return [r.cx,r.y];
  }

  // \uAC19\uC740 source\uC5D0\uC11C \uB098\uAC00\uAC70\uB098 \uAC19\uC740 target\uC73C\uB85C \uBAA8\uC774\uB294 \uBC31\uBCF8(arrow) \uC5E3\uC9C0 \uBD84\uC0B0 \uC624\uD504\uC14B(\uD569\uC0B0).
  // hop \uC790\uC2DD(line)\uC740 \uC774\uC81C \uB77C\uC6B0\uD305 \uC5C6\uB294 \uACE0\uC815 \uC9C1\uC120\uC774\uB77C \uBD84\uC0B0\uC774 \uD544\uC694 \uC5C6\uC74C(\uC5D0\uB514\uD130\uC640 \uB3D9\uC77C \uC774\uC720).
  var spreadByIdx={};
  (function(){
    var bySrc={},byTgt={};
    EDGES.forEach(function(e,idx){
      if(e.type!=='arrow') return;
      if(!rectById[e.source]||!rectById[e.target]) return;
      (bySrc[e.source]=bySrc[e.source]||[]).push(idx);
      (byTgt[e.target]=byTgt[e.target]||[]).push(idx);
    });
    function add(groups,cyOf){
      Object.keys(groups).forEach(function(gk){
        var idxs=groups[gk];
        if(idxs.length<2) return;
        idxs.sort(function(ia,ib){return cyOf(ia)-cyOf(ib);});
        idxs.forEach(function(ei,k){spreadByIdx[ei]=(spreadByIdx[ei]||0)+(k-(idxs.length-1)/2)*16;});
      });
    }
    add(bySrc,function(i){return rectById[EDGES[i].target].cy;});
    add(byTgt,function(i){return rectById[EDGES[i].source].cy;});
  })();

  // \uADF8\uB9AC\uB4DC A* \uC804\uC5ED \uB77C\uC6B0\uD305 \u2014 main topic \uBC31\uBCF8(arrow) \uC5E3\uC9C0\uB9CC \uB300\uC0C1(hop \uC790\uC2DD\uC740 \uACE0\uC815 \uC9C1\uC120\uC774\uB77C
  // \uB77C\uC6B0\uD305 \uB300\uC0C1 \uC544\uB2D8, \uC5D0\uB514\uD130\uC640 \uB3D9\uC77C). \uB4DC\uB798\uADF8 \uC911(fast)\uC5D0\uB294 \uC2A4\uD0B5\uD558\uACE0 \uACBD\uB7C9 \uD734\uB9AC\uC2A4\uD2F1 \uC0AC\uC6A9.
  // \uB808\uC774\uC544\uC6C3\uC774 \uBC14\uB00C\uC9C0 \uC54A\uC740 \uC7AC\uD638\uCD9C(\uD558\uC774\uB77C\uC774\uD2B8 \uC0C9\uB9CC \uBCC0\uACBD \uB4F1)\uC740 \uCE90\uC2DC\uB97C \uC7AC\uC0AC\uC6A9\uD574 \uC989\uC2DC \uCC98\uB9AC
  var gridRoutes=null;
  if(!fast){
    if(routesDirty||!cachedRoutes){
      var reqs=[];
      EDGES.forEach(function(e,idx){
        if(e.type!=='arrow') return;
        var sr3=rectById[e.source],tr3=rectById[e.target];
        if(!sr3||!tr3) return;
        var ports3=getBestPorts(sr3,tr3);
        if(!ports3) return;
        reqs.push({key:String(idx),
          src:{x:ports3.sp.p[0],y:ports3.sp.p[1]},
          tgt:{x:ports3.tp.p[0],y:ports3.tp.p[1]},
          srcId:e.source,tgtId:e.target});
      });
      var rectList=Object.keys(rectById).map(function(nid){return{id:nid,rect:rectById[nid]};});
      cachedRoutes=routeEdgesGrid(reqs,rectList);
      routesDirty=false;
    }
    gridRoutes=cachedRoutes;
  }

  EDGES.forEach(function(edge,edgeIdx){
    var sr2=rectById[edge.source], tr2=rectById[edge.target];
    if(!sr2||!tr2) return;

    var d, sp, tp, strokeColor;
    var hl=genRootId&&(edge.source===genRootId||edge.target===genRootId);
    strokeColor=hl?'#ef4444':'#666';

    if(edge.type!=='arrow'){
      // hop \uC790\uC2DD: \uB77C\uC6B0\uD305/\uCEE4\uBE0C \uC5C6\uC774 \uC88C/\uC6B0 \uD3EC\uD2B8 \uC0AC\uC774 \uC9C1\uC120 \uADF8\uB300\uB85C
      var hp=horizontalPorts(sr2,tr2);
      sp=portXY(sr2,hp.sp); tp=portXY(tr2,hp.tp);
      d='M'+sp[0]+','+sp[1]+' L'+tp[0]+','+tp[1];
    } else {
      var ports=getBestPorts(sr2,tr2);
      if(!ports) return;
      sp=ports.sp.p; var spD=DIR[ports.sp.name]; tp=ports.tp.p; var tpD=DIR[ports.tp.name];
      var srcP={x:sp[0],y:sp[1]},tgtP={x:tp[0],y:tp[1]};
      var ddl=dlen(srcP,tgtP)||1;
      var nx=-(tgtP.y-srcP.y)/ddl, nyv=(tgtP.x-srcP.x)/ddl;
      var spread=spreadByIdx[edgeIdx]||0;
      var gridPts=gridRoutes?gridRoutes[String(edgeIdx)]:null;
      if(gridPts&&gridPts.length>2){
        // \uADF8\uB9AC\uB4DC A* \uACBD\uB85C (\uB178\uB4DC \uD68C\uD53C + congestion \uBD84\uC0B0) + \uAC19\uC740 \uC18C\uC2A4/\uD0C0\uAC9F \uBB36\uC74C \uBD84\uC0B0
        d=ptsToPath(spreadPts(gridPts,spread));
      } else if(gridPts){
        // \uC9C1\uC120 \uACBD\uB85C: \uAE30\uC874 bezier \uBAA8\uC591 \uC720\uC9C0 (spread\uB9CC\uD07C \uC81C\uC5B4\uC810\uC744 \uBC95\uC120 \uBC29\uD5A5 \uC774\uB3D9)
        var bend=Math.min(ddl*.45,150);
        var cx1=sp[0]+spD[0]*bend+nx*spread,cy1=sp[1]+spD[1]*bend+nyv*spread;
        var cx2=tp[0]+tpD[0]*bend+nx*spread,cy2=tp[1]+tpD[1]*bend+nyv*spread;
        d='M'+sp[0]+','+sp[1]+' C'+cx1+','+cy1+' '+cx2+','+cy2+' '+tp[0]+','+tp[1];
      } else {
        // \uB4DC\uB798\uADF8 \uC911(fast) \uB610\uB294 A* \uC2E4\uD328: \uACBD\uB7C9 \uC6B0\uD68C \uD734\uB9AC\uC2A4\uD2F1
        var obstacles=[];
        Object.keys(rectById).forEach(function(nid){
          if(nid!==edge.source&&nid!==edge.target) obstacles.push(rectById[nid]);
        });
        var pts=routeAround(srcP,tgtP,obstacles);
        if(pts.length===2){
          var bend2=Math.min(ddl*.45,150);
          var bx1=sp[0]+spD[0]*bend2+nx*spread,by1=sp[1]+spD[1]*bend2+nyv*spread;
          var bx2=tp[0]+tpD[0]*bend2+nx*spread,by2=tp[1]+tpD[1]*bend2+nyv*spread;
          d='M'+sp[0]+','+sp[1]+' C'+bx1+','+by1+' '+bx2+','+by2+' '+tp[0]+','+tp[1];
        } else {
          d=ptsToPath(spreadPts(pts,spread));
        }
      }
    }

    var g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','ng-eg');
    var path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',d);path.setAttribute('fill','none');path.setAttribute('stroke',strokeColor);path.setAttribute('data-base-sw',hl?'2.5':'1.5');
    if(edge.type==='arrow') path.setAttribute('marker-end',hl?'url(#arrow-hl)':'url(#arrow)');
    g.appendChild(path);
    if(edge.type==='line'){[sp,tp].forEach(function(pt){var c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',pt[0]);c.setAttribute('cy',pt[1]);c.setAttribute('r','4');c.setAttribute('fill',strokeColor);g.appendChild(c);});}
    svg.appendChild(g);
  });
  updateZoomLineWeights();
}

// Fit view
function fitView() {
  var nodes=document.querySelectorAll('.ng-node');
  if(!nodes.length) return;
  var minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  nodes.forEach(function(n){var x=parseFloat(n.style.left)||0,y=parseFloat(n.style.top)||0;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x+n.offsetWidth);maxY=Math.max(maxY,y+n.offsetHeight);});
  var rect=vp.getBoundingClientRect(),W=rect.width,H=rect.height;
  var cw=maxX-minX+80,ch=maxY-minY+80;
  scale=Math.min(W/cw,H/ch,1.5);
  tx=(W-cw*scale)/2-(minX-40)*scale;
  ty=(H-ch*scale)/2-(minY-40)*scale;
  applyTransform();
  updateZoomLineWeights();
}

// Lightbox
function showLightbox(src){document.getElementById('lightbox-img').src=src;document.getElementById('lightbox').classList.add('active');}
function closeLightbox(){document.getElementById('lightbox').classList.remove('active');document.getElementById('lightbox-img').src='';}
document.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&e.key==='f'){e.preventDefault();openSearch();return;}
  if(e.key==='Escape'){
    if(document.getElementById('search-wrap').classList.contains('open')){closeSearch();return;}
    closeLightbox();
    // Esc = \uC138\uB300 \uD558\uC774\uB77C\uC774\uD2B8 \uD574\uC81C (\uBC30\uACBD \uD074\uB9AD\uC73C\uB85C\uB294 \uD574\uC81C\uB418\uC9C0 \uC54A\uC74C)
    if(genRootId){genRootId=null;updateGenHighlight();drawEdges();}
  }
});
// Middle click: prevent X11 primary selection paste
vp.addEventListener('mousedown',function(e){if(e.button===1) e.preventDefault();});
// \uC881\uC740 \uD654\uBA74: \uD234\uBC14 \uBC84\uD2BC \uD589 \uAC00\uB85C \uC2AC\uB77C\uC774\uB4DC (Shift+\uD720 / \uAC00\uB85C\uD720 / \uD130\uCE58 \uC2A4\uC640\uC774\uD504\uB294 native)
var tbRow2=document.getElementById('tb-row2');
tbRow2.addEventListener('wheel',function(e){
  if(tbRow2.scrollWidth<=tbRow2.clientWidth) return;
  var d=e.shiftKey?(e.deltaY||e.deltaX):e.deltaX;
  if(d){e.preventDefault();tbRow2.scrollLeft+=d;}
},{passive:false});
// Background click: close search if open
vp.addEventListener('mouseup',function(e){
  if(e.button!==0) return;
  if(!e.target.closest('.ng-node')&&!e.target.closest('#search-wrap')){
    if(document.getElementById('search-wrap').classList.contains('open')) closeSearch();
  }
});

// Search
var searchSelectedId=null;
var searchMatchNodes=[];
var kbIdx=-1;

function openSearch(){
  document.getElementById('search-wrap').classList.add('open');
  var inp=document.getElementById('search-input');
  inp.focus();inp.select();
  kbIdx=-1;
  if(inp.value) doSearch(inp.value);
}
function closeSearch(){
  clearSearchHighlights();
  clearTextHits();
  searchSelectedId=null;searchMatchNodes=[];kbIdx=-1;
  document.getElementById('search-wrap').classList.remove('open');
  document.getElementById('search-input').value='';
  document.getElementById('search-count').textContent='';
  closeDropdown();
}
function clearSearchHighlights(){
  document.querySelectorAll('.ng-search-match,.ng-search-active').forEach(function(el){el.classList.remove('ng-search-match','ng-search-active');});
}
// \uAC80\uC0C9\uC5B4 \uC778\uB77C\uC778 \uD558\uC774\uB77C\uC774\uD2B8 (CSS Custom Highlight API \u2014 \uBBF8\uC9C0\uC6D0 \uBE0C\uB77C\uC6B0\uC800\uB294 \uC870\uC6A9\uD788 \uBB34\uC2DC)
// \uB9E4\uCE58 \uB178\uB4DC\uC758 \uD14D\uC2A4\uD2B8\uC5D0\uC11C \uAC80\uC0C9\uC5B4 \uBD80\uBD84\uB9CC Range\uB85C \uC218\uC9D1, \uD15C\uD50C\uB9BF\uBCC4 \uBC18\uC804\uC0C9 \uC2A4\uD0C0\uC77C \uC801\uC6A9
function hitKey(t){return 'ng-hit-'+String(t).replace(/[^a-zA-Z0-9_-]/g,'_');}
var HIT_KEYS=[];
function clearTextHits(){
  if(!window.CSS||!CSS.highlights) return;
  HIT_KEYS.forEach(function(k){CSS.highlights.delete(k);});
  HIT_KEYS=[];
}
function updateTextHits(){
  if(!window.CSS||!CSS.highlights||typeof Highlight==='undefined') return;
  clearTextHits();
  var q=document.getElementById('search-input').value.trim().toLowerCase();
  if(!q||!document.getElementById('search-wrap').classList.contains('open')) return;
  var byTmpl={};
  searchMatchNodes.forEach(function(n){
    var el=document.getElementById('node-'+n.id);
    if(!el) return;
    var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    var tn;
    while((tn=walker.nextNode())){
      var par=tn.parentElement;
      if(!par||par.closest('.katex')) continue;
      var lower=(tn.textContent||'').toLowerCase();
      var idx=lower.indexOf(q);
      while(idx!==-1){
        var r=new Range();
        r.setStart(tn,idx);r.setEnd(tn,idx+q.length);
        var k=hitKey(n.template);
        if(!byTmpl[k]) byTmpl[k]=new Highlight();
        byTmpl[k].add(r);
        idx=lower.indexOf(q,idx+q.length);
      }
    }
  });
  Object.keys(byTmpl).forEach(function(k){CSS.highlights.set(k,byTmpl[k]);HIT_KEYS.push(k);});
}
function closeDropdown(){
  document.getElementById('search-drop').classList.remove('open');
  document.getElementById('search-row').classList.remove('dropdown-open');
  kbIdx=-1;
}
// \uB9E4\uCE58 \uB178\uB4DC\uAC00 toggle \uC81C\uBAA9/\uB0B4\uC6A9 \uC548\uC5D0 \uC788\uC744 \uC218\uB3C4 \uC788\uC73C\uBBC0\uB85C \uB2E8\uC21C concat \uBB38\uC790\uC5F4\uC774 \uC544\uB2C8\uB77C
// title/content/original(\uC81C\uBAA9+\uD14D\uC2A4\uD2B8)/toggle(\uC81C\uBAA9+\uB0B4\uC6A9) \uAC01\uAC01\uC744 \uAC1C\uBCC4\uB85C \uD655\uC778 (\uC5D0\uB514\uD130\uC758
// searchMatchNodes \uD544\uD130\uC640 \uB3D9\uC77C\uD55C \uADDC\uCE59 \u2014 \uC774\uB798\uC57C selectSearchNode\uC5D0\uC11C \uC5B4\uB290 \uC139\uC158\uC744
// \uD3BC\uCCD0\uC57C \uD558\uB294\uC9C0\uB3C4 \uC54C \uC218 \uC788\uC74C).
function nodeMatchesQuery(n, q){
  if((n.title||'').toLowerCase().indexOf(q)!==-1) return true;
  if((n.content||'').toLowerCase().indexOf(q)!==-1) return true;
  if((n.originalText||'').toLowerCase().indexOf(q)!==-1) return true;
  if((n.originalTitle||'').toLowerCase().indexOf(q)!==-1) return true;
  return (n.toggles||[]).some(function(t){
    return (t.title||'').toLowerCase().indexOf(q)!==-1 || (t.content||'').toLowerCase().indexOf(q)!==-1;
  });
}
function doSearch(q){
  clearSearchHighlights();
  searchSelectedId=null;kbIdx=-1;
  var query=q.trim().toLowerCase();
  if(!query){document.getElementById('search-count').textContent='';closeDropdown();searchMatchNodes=[];return;}
  searchMatchNodes=NODES_DATA.filter(function(n){return nodeMatchesQuery(n,query);});
  // main topic BFS \uC21C\uC11C\uB85C \uC815\uB82C: \uD55C main topic\uC758 \uBAA8\uB4E0 hop1, \uBAA8\uB4E0 hop2, ... \uB97C \uB2E4 \uD6D1\uC740
  // \uB4A4\uC5D0\uC57C \uB2E4\uC74C main topic\uC73C\uB85C (\uC5D0\uB514\uD130\uC758 searchMatchNodes \uC815\uB82C\uACFC \uB3D9\uC77C \uADDC\uCE59)
  var tree=buildHopTreeJs();
  var roots=NODES_DATA.filter(function(n){return tree.depthOf[n.id]===0;})
    .sort(function(a,b){return (a.ly-b.ly)||(a.lx-b.lx);});
  var rootIndex={};
  roots.forEach(function(r,i){rootIndex[r.id]=i;});
  searchMatchNodes.sort(function(a,b){
    var ra=rootIndex[tree.rootOf[a.id]]||0, rb=rootIndex[tree.rootOf[b.id]]||0;
    if(ra!==rb) return ra-rb;
    var da=tree.depthOf[a.id]||0, db=tree.depthOf[b.id]||0;
    if(da!==db) return da-db;
    return (a.ly-b.ly)||(a.lx-b.lx);
  });
  searchMatchNodes.forEach(function(n){var el=document.getElementById('node-'+n.id);if(el) el.classList.add('ng-search-match');});
  updateSearchCount();
  renderDropdown();
  updateTextHits();
}
function renderDropdown(){
  var drop=document.getElementById('search-drop');
  var row=document.getElementById('search-row');
  drop.innerHTML='';
  if(!searchMatchNodes.length){closeDropdown();return;}
  searchMatchNodes.forEach(function(n,i){
    var div=document.createElement('div');
    div.className='ng-drop-item';
    div.setAttribute('data-kb-idx',i);
    var nodeEl=document.getElementById('node-'+n.id);
    var titleEl=nodeEl?nodeEl.querySelector('.ng-title'):null;
    div.textContent=titleEl?titleEl.textContent:n.id;
    div.addEventListener('mousedown',function(e){e.preventDefault();selectSearchNode(n.id);});
    div.addEventListener('mouseenter',function(){setKbActive(i);});
    drop.appendChild(div);
  });
  if(kbIdx>=0&&kbIdx<searchMatchNodes.length) applyKbHighlight();
  drop.classList.add('open');
  row.classList.add('dropdown-open');
}
function setKbActive(idx){
  kbIdx=idx;
  applyKbHighlight();
  var drop=document.getElementById('search-drop');
  var el=drop.querySelector('[data-kb-idx="'+idx+'"]');
  if(el) el.scrollIntoView({block:'nearest'});
}
function applyKbHighlight(){
  var drop=document.getElementById('search-drop');
  drop.querySelectorAll('.ng-drop-item').forEach(function(el){
    var active=el.getAttribute('data-kb-idx')===String(kbIdx);
    el.style.background=active?'#e8f0fe':'transparent';
    el.style.fontWeight=active?'500':'400';
  });
}
function selectSearchNode(id){
  clearSearchHighlights();
  searchSelectedId=id;
  var el=document.getElementById('node-'+id);
  if(el) el.classList.add('ng-search-active');
  var q=document.getElementById('search-input').value.trim().toLowerCase();
  // Enter \uD655\uC815: \uC120\uD0DD\uB41C \uB178\uB4DC\uB9CC expand, \uB098\uBA38\uC9C0 \uB9E4\uCE58 \uB178\uB4DC collapse
  searchMatchNodes.forEach(function(n){
    var nodeEl=document.getElementById('node-'+n.id);
    if(!nodeEl) return;
    var body=nodeEl.querySelector('.ng-body');
    if(!body) return;
    var datum=null;
    for(var i=0;i<NODES_DATA.length;i++){if(NODES_DATA[i].id===n.id){datum=NODES_DATA[i];break;}}
    if(!datum) return;
    if(n.id===id){
      if(!datum.contentExpanded){body.style.display='';datum.contentExpanded=true;applyContentCaps(nodeEl);}
      // \uB9E4\uCE58\uAC00 toggle \uC81C\uBAA9/\uB0B4\uC6A9 \uB610\uB294 original \uC81C\uBAA9/\uD14D\uC2A4\uD2B8 \uC548\uC5D0 \uC788\uC744 \uC218 \uC788\uC73C\uBBC0\uB85C,
      // \uC811\uD600 \uC788\uC73C\uBA74 \uD3BC\uCCD0\uC11C \uC2E4\uC81C\uB85C \uBCF4\uC774\uAC8C \uD568 (\uC5D0\uB514\uD130\uC758 handleSelectSearchNode\uC640 \uB3D9\uC77C)
      (n.toggles||[]).forEach(function(t){
        if(q&&((t.title||'').toLowerCase().indexOf(q)!==-1||(t.content||'').toLowerCase().indexOf(q)!==-1)){
          var togEl=nodeEl.querySelector('details.ng-toggle[data-toggle-id="'+t.id+'"]');
          if(togEl&&!togEl.open) togEl.open=true;
        }
      });
      if(q&&((n.originalTitle||'').toLowerCase().indexOf(q)!==-1||(n.originalText||'').toLowerCase().indexOf(q)!==-1)){
        var origEl=nodeEl.querySelector('details.ng-original');
        if(origEl&&!origEl.open) origEl.open=true;
      }
    } else {
      if(datum.contentExpanded){body.style.display='none';datum.contentExpanded=false;}
    }
  });
  setTimeout(function(){recomputePositions();flyToNode(id);},0);
  closeDropdown();
  updateSearchCount();
  updateTextHits();
}
function onSearchInputClick(){
  if(searchSelectedId!==null){
    // \uC774\uC804 \uC120\uD0DD \uB178\uB4DC\uC758 \uC778\uB371\uC2A4\uB97C \uCC3E\uC544 kbIdx \uBCF5\uC6D0
    var idx=-1;
    for(var i=0;i<searchMatchNodes.length;i++){if(searchMatchNodes[i].id===searchSelectedId){idx=i;break;}}
    clearSearchHighlights();
    searchSelectedId=null;
    searchMatchNodes.forEach(function(n){var el=document.getElementById('node-'+n.id);if(el) el.classList.add('ng-search-match');});
    updateSearchCount();
    renderDropdown();
    if(idx>=0){kbIdx=idx;applyKbHighlight();}
  }
}
function updateSearchCount(){
  var el=document.getElementById('search-count');
  if(!el) return;
  var q=document.getElementById('search-input').value.trim();
  if(!q){el.textContent='';return;}
  if(searchSelectedId){el.style.color='#6b7280';el.textContent='1 selected';return;}
  if(!searchMatchNodes.length){el.style.color='#ef4444';el.textContent='0 results';return;}
  el.style.color='#6b7280';el.textContent=searchMatchNodes.length+' results';
}
function flyToNode(nodeId){
  var el=document.getElementById('node-'+nodeId);
  if(!el) return;
  var rect=vp.getBoundingClientRect();
  var W=rect.width,H=rect.height;
  var nodeX=parseFloat(el.style.left)||0;
  var nodeY=parseFloat(el.style.top)||0;
  tx=W/2-(nodeX+el.offsetWidth/2)*scale;
  ty=H/2-(nodeY+el.offsetHeight/2)*scale;
  applyTransform();
}
function onSearchKey(e){
  var n=searchMatchNodes.length;
  if(e.key==='ArrowDown'){
    e.preventDefault();
    if(n>0){var newIdx=kbIdx<0?0:(kbIdx+1)%n;setKbActive(newIdx);flyToNode(searchMatchNodes[newIdx].id);}
  } else if(e.key==='ArrowUp'){
    e.preventDefault();
    if(n>0){var newIdx=kbIdx<0?n-1:(kbIdx-1+n)%n;setKbActive(newIdx);flyToNode(searchMatchNodes[newIdx].id);}
  } else if(e.key==='Enter'){
    e.preventDefault();
    if(n>0) selectSearchNode(searchMatchNodes[kbIdx>=0?kbIdx:0].id);
  } else if(e.key==='Escape'){
    closeSearch();e.preventDefault();
  }
  e.stopPropagation();
}

// KaTeX rendering
function initKatex() {
  if(typeof renderMathInElement === 'undefined') return;
  renderMathInElement(document.getElementById('canvas'), {
    delimiters: [
      {left:'$$', right:'$$', display:true},
      {left:'$',  right:'$',  display:false}
    ],
    throwOnError: false,
    output: 'html'
  });
}

// \uBCF8\uBB38 \uB192\uC774 \uC0C1\uD55C(More/Less) \u2014 NodeCard.tsx\uC758 DEFAULT_CONTENT_MAX \uB85C\uC9C1\uC744 \uADF8\uB300\uB85C \uC774\uC2DD.
// .ng-content\uB294 node.content \uC804\uC6A9 \uD074\uB798\uC2A4\uB77C\uC11C(toggle/original\uC740 \uAC01\uAC01
// .ng-toggle-body / .ng-orig-text \uB97C \uC500) \uC774 \uC140\uB809\uD130\uB9CC\uC73C\uB85C \uC774\uBBF8 "content\uB9CC" \uBC94\uC704\uAC00
// \uC7A1\uD78C\uB2E4 \u2014 \uC5D0\uB514\uD130\uC640 \uB3D9\uC77C\uD558\uAC8C toggle/original\uC5D0\uB294 \uCEA1\uC744 \uC801\uC6A9\uD558\uC9C0 \uC54A\uC74C.
// scope\uB97C \uC8FC\uBA74 \uADF8 \uC548\uC758 .ng-content\uB9CC \uC7AC\uCE21\uC815(fold/unfold\uB098 \uAC80\uC0C9\uC73C\uB85C \uCC98\uC74C \uBCF4\uC774\uAC8C
// \uB420 \uB54C \u2014 display:none \uC0C1\uD0DC\uC5D0\uC11C \uCE21\uC815\uD558\uBA74 \uC804\uBD80 0\uC73C\uB85C \uB098\uC640\uC11C \uBC84\uD2BC\uC774 \uD544\uC694 \uC5C6\uB2E4\uACE0
// \uC798\uBABB \uD310\uB2E8\uD558\uAE30 \uB54C\uBB38\uC5D0 \uB2E4\uC2DC \uBCF4\uC774\uAC8C \uB41C \uC2DC\uC810\uC5D0 \uC7AC\uCE21\uC815\uC774 \uD544\uC694\uD568).
var DEFAULT_CONTENT_MAX = 500;
function applyContentCaps(scope) {
  (scope || document).querySelectorAll('.ng-content').forEach(function(el) {
    var measure = function() {
      if (el.getAttribute('data-more-expanded') === '1') return;
      var elTop = el.getBoundingClientRect().top;
      var requiredBottom = 0;
      el.querySelectorAll('table, img').forEach(function(media) {
        var bottom = media.getBoundingClientRect().bottom - elTop;
        if (bottom > requiredBottom) requiredBottom = bottom;
      });
      var max = Math.max(DEFAULT_CONTENT_MAX, Math.ceil(requiredBottom) + 8);
      el.setAttribute('data-cap', String(max));
      var needsBtn = el.scrollHeight > max + 1;
      el.style.maxHeight = max + 'px';
      el.style.overflowY = 'auto';
      el.style.overflowX = 'hidden';
      var next = el.nextElementSibling;
      var btn = (next && next.classList.contains('ng-more-btn')) ? next : null;
      if (needsBtn) {
        if (!btn) {
          btn = document.createElement('button');
          btn.className = 'ng-more-btn';
          btn.textContent = '\u25BC More';
          btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var expanded = el.getAttribute('data-more-expanded') === '1';
            if (expanded) {
              el.removeAttribute('data-more-expanded');
              el.style.maxHeight = el.getAttribute('data-cap') + 'px';
              el.style.overflowY = 'auto';
              el.style.overflowX = 'hidden';
              btn.textContent = '\u25BC More';
            } else {
              el.setAttribute('data-more-expanded', '1');
              el.style.maxHeight = '';
              el.style.overflowY = '';
              el.style.overflowX = '';
              btn.textContent = '\u25B2 Less';
            }
            setTimeout(function() { recomputePositions(); drawEdges(); }, 0);
          });
          el.parentNode.insertBefore(btn, el.nextSibling);
        }
      } else if (btn) {
        btn.remove();
      }
    };
    measure();
    var imgs = Array.from(el.querySelectorAll('img'));
    var pending = imgs.filter(function(img) { return !img.complete; });
    pending.forEach(function(img) { img.addEventListener('load', measure); });
  });
}

window.addEventListener('load', function() {
  // Render KaTeX first so node heights are accurate
  initKatex();
  // scale\uB294 \uC544\uC9C1 \uCD08\uAE30\uAC12 1\uC774\uB77C(fitView\uAC00 \uC544\uC9C1 \uC548 \uB3CC\uC544\uC11C) getBoundingClientRect()
  // \uCE21\uC815\uAC12\uC774 \uCE94\uBC84\uC2A4 local \uC88C\uD45C\uC640 \uC77C\uCE58\uD568 \u2014 fitView \uC774\uD6C4\uB85C \uBBF8\uB8E8\uBA74 \uCD95\uC18C\uB41C \uD654\uBA74 \uD53D\uC140\uC744
  // local px\uB85C \uCC29\uAC01\uD574\uC11C \uCEA1 \uB192\uC774\uAC00 \uC798\uBABB \uACC4\uC0B0\uB428.
  applyContentCaps();
  recomputePositions();
  drawEdges();
  fitView();
  // Recompute after images load (base64 images also finalize height asynchronously)
  var imgs = Array.from(document.querySelectorAll('.ng-node img'));
  var pending = imgs.filter(function(img) { return !img.complete; }).length;
  if (pending === 0) return;
  function onImgSettle() {
    pending--;
    if (pending <= 0) { applyContentCaps(); recomputePositions(); drawEdges(); }
  }
  imgs.forEach(function(img) {
    if (!img.complete) {
      img.addEventListener('load', onImgSettle);
      img.addEventListener('error', onImgSettle);
    }
  });
});
</script>
</body>
</html>`}var jl={main_topic:{label:"Main topic",color:"#4B8BBE",icon:"file-text",shape:"sharp"},method:{label:"Method",color:"#5C9E6E",icon:"cpu",shape:"sharp"},result:{label:"Result",color:"#9B59B6",icon:"bar-chart-2",shape:"sharp"},claim:{label:"Claim",color:"#E74C3C",icon:"alert-circle",shape:"sharp"},question:{label:"Question",color:"#E5A835",icon:"help-circle",shape:"rounded"},gap:{label:"Gap / Idea",color:"#1ABC9C",icon:"lightbulb",shape:"rounded"},reference:{label:"Reference",color:"#95A5A6",icon:"book-open",shape:"rounded"},memo:{label:"Memo",color:"#BDC3C7",icon:"edit-3",shape:"rounded"}};function nn(t="New Graph"){let e=new Date().toISOString();return{version:"1.0.0",title:t,created:e,modified:e,nodeTemplates:jl,nodes:[],edges:[],viewport:{x:0,y:0,zoom:1}}}function Mt(){let t="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let r=0;r<32;r++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}var he=F(require("vscode"));var Ze=class t{static{this.panels=new Map}static async openAndSearch(e,r,n,i){let o=r.toString(),a=t.panels.get(o);if(a){a.panel.reveal(he.ViewColumn.Beside,!0),a.ready?a.panel.webview.postMessage({type:"search",query:n,pageHint:i}):a.pending={query:n,pageHint:i};return}let s;try{s=await he.workspace.fs.readFile(r)}catch{he.window.showErrorMessage(`PDF\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4: ${r.fsPath}`);return}let c=he.window.createWebviewPanel("nodegraph.pdfViewer",r.path.split("/").pop()??"PDF",{viewColumn:he.ViewColumn.Beside,preserveFocus:!1},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[he.Uri.joinPath(e.extensionUri,"dist")]}),d={panel:c,ready:!1,pending:{query:n,pageHint:i}};t.panels.set(o,d),c.iconPath=he.Uri.joinPath(e.extensionUri,"resources","icon-hires.png"),c.webview.html=t._getHtml(e,c.webview);let u=Buffer.from(s).toString("base64");c.webview.onDidReceiveMessage(l=>{l.type==="ready"&&(d.ready=!0,c.webview.postMessage({type:"load",pdfData:u,query:d.pending?.query,pageHint:d.pending?.pageHint}),d.pending=null)}),c.onDidDispose(()=>{t.panels.delete(o)})}static _getHtml(e,r){let n=r.asWebviewUri(he.Uri.joinPath(e.extensionUri,"dist","pdfviewer.js")),i=r.asWebviewUri(he.Uri.joinPath(e.extensionUri,"dist","pdfviewer.css")),o=r.asWebviewUri(he.Uri.joinPath(e.extensionUri,"dist","pdf.worker.min.mjs")),a=Mt();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${r.cspSource} data: blob:; script-src 'nonce-${a}' ${r.cspSource}; style-src 'unsafe-inline' ${r.cspSource}; worker-src ${r.cspSource} blob:; connect-src ${r.cspSource} blob:;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${i}">
  <title>PDF</title>
</head>
<body>
  <div id="root">
    <div id="toolbar">
      <button id="zoomOutBtn" title="Zoom out">\u2212</button>
      <span id="zoomLabel"></span>
      <button id="zoomInBtn" title="Zoom in">+</button>
      <span id="loadingLabel"></span>
      <div id="toolbarSpacer"></div>
      <button id="findToggleBtn" title="Find in PDF (Ctrl+F)">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.4"/>
          <line x1="10.1" y1="10.1" x2="14" y2="14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </button>
      <div id="findBar">
        <input id="findInput" type="text" placeholder="Find in PDF" autocomplete="off">
        <span id="findCount"></span>
        <button id="findPrevBtn" title="Previous match">\u2191</button>
        <button id="findNextBtn" title="Next match">\u2193</button>
        <button id="findCloseBtn" title="Close">\u2715</button>
      </div>
    </div>
    <div id="pagesScroll">
      <div id="status"></div>
      <div id="pages"></div>
    </div>
  </div>
  <script nonce="${a}">window.__PDF_WORKER_URI__ = "${o}";</script>
  <script nonce="${a}" type="module" src="${n}"></script>
</body>
</html>`}};var ke=class t{constructor(e){this.context=e;this._pendingSaves=new Set}static{this.panels=new Map}static{this.selectionEmitter=new j.EventEmitter}static{this.onDidSelectNode=t.selectionEmitter.event}static register(e){let r=new t(e);return j.window.registerCustomEditorProvider("nodegraph.editor",r,{webviewOptions:{retainContextWhenHidden:!0}})}static{this._activeWebview=null}static postToActive(e){t._activeWebview?.postMessage(e)}static focusNode(e,r){let n=t.panels.get(ur.resolve(e));return n?(n.reveal(n.viewColumn,!1),n.webview.postMessage({type:"focusNode",nodeId:r}),!0):!1}async resolveCustomTextEditor(e,r,n){r.iconPath=j.Uri.joinPath(this.context.extensionUri,"resources","icon-hires.png");let i=j.Uri.joinPath(e.uri,"..");r.webview.options={enableScripts:!0,localResourceRoots:[this.context.extensionUri,i]},r.webview.html=this._getHtmlForWebview(r.webview);let o=ur.resolve(e.uri.fsPath);t.panels.set(o,r);let a=d=>{let u=e.getText();try{let l=u.trim()===""?nn():JSON.parse(u),p=_i(r.webview,e.uri,l);r.webview.postMessage({type:d,data:l,imageUris:p})}catch{}},s=r.webview.onDidReceiveMessage(async d=>{if(d.type==="ready")a("load");else if(d.type==="save"){let u=e.uri.toString();this._pendingSaves.add(u);try{let l=new j.WorkspaceEdit,p=new j.Range(e.positionAt(0),e.positionAt(e.getText().length));l.replace(e.uri,p,JSON.stringify(d.data,null,2)),await j.workspace.applyEdit(l),await e.save()}finally{this._pendingSaves.delete(u)}}else if(d.type==="openLink"){let u=d.link;if(u.type==="url")j.env.openExternal(j.Uri.parse(u.target));else if(u.type==="pdf"){let l=j.Uri.joinPath(j.Uri.joinPath(e.uri,".."),u.target);j.env.openExternal(l)}else u.type==="obsidian"&&j.env.openExternal(j.Uri.parse(u.target))}else if(d.type==="searchInPdf"){let u=j.Uri.joinPath(j.Uri.joinPath(e.uri,".."),d.pdfTarget);Ze.openAndSearch(this.context,u,d.query,d.pageHint)}else if(d.type==="exportHtml")try{let u=d.data,l=j.Uri.joinPath(e.uri,".."),p=ur.basename(e.uri.fsPath,".nodegraph.json"),h=j.Uri.joinPath(l,`.${p}-imgs`),m={},f=/\[\[IMG:([^:\]]+)(?::[^\]]+)?\]\]/g,g=async S=>{if(!(!S||m[S]))try{let P=j.Uri.joinPath(h,S),pe=await j.workspace.fs.readFile(P),O=S.split(".").pop()?.toLowerCase()??"png",fe=O==="jpg"||O==="jpeg"?"image/jpeg":O==="gif"?"image/gif":O==="webp"?"image/webp":"image/png";m[S]=`data:${fe};base64,${Buffer.from(pe).toString("base64")}`}catch{}};for(let S of u.nodes){f.lastIndex=0;let P;for(;(P=f.exec(S.content??""))!==null;)await g(P[1])}let v=is(u,m),I=j.Uri.joinPath(l,`${p}.html`);await j.workspace.fs.writeFile(I,Buffer.from(v,"utf-8"));let b=await j.window.showInformationMessage(`HTML exported: ${p}.html`,"Open in Browser","Show in Explorer");b==="Open in Browser"?j.env.openExternal(I):b==="Show in Explorer"&&j.commands.executeCommand("revealFileInOS",I)}catch(u){j.window.showErrorMessage(`HTML export failed: ${u}`)}else if(d.type==="saveImage")try{let{filename:u,webviewUri:l}=await ts(r.webview,e.uri,d.data,d.ext??"png");r.webview.postMessage({type:"imageSaved",nodeId:d.nodeId,filename:u,webviewUri:l})}catch(u){j.window.showErrorMessage(`Failed to save image: ${u}`)}else if(d.type==="deleteImageFile")await rs(e.uri,d.filename);else if(d.type==="reload")try{let u=await j.workspace.fs.readFile(e.uri),l=Buffer.from(u).toString("utf-8"),p=JSON.parse(l),h=_i(r.webview,e.uri,p);r.webview.postMessage({type:"load",data:p,imageUris:h})}catch{a("load")}else if(d.type==="openHelp"){let u=j.Uri.joinPath(this.context.extensionUri,"README.md");j.commands.executeCommand("markdown.showPreviewToSide",u.with({fragment:"features"}))}else d.type==="nodeSelected"&&typeof d.nodeId=="string"&&t.selectionEmitter.fire({paperPath:e.uri.fsPath,nodeId:d.nodeId})}),c=j.workspace.onDidChangeTextDocument(d=>{d.document.uri.toString()===e.uri.toString()&&(this._pendingSaves.has(e.uri.toString())||a("externalChange"))});t._activeWebview=r.webview,r.onDidChangeViewState(d=>{d.webviewPanel.active&&(t._activeWebview=r.webview,r.webview.postMessage({type:"focusCanvas"}))}),r.onDidDispose(()=>{s.dispose(),c.dispose(),t.panels.get(o)===r&&t.panels.delete(o),t._activeWebview===r.webview&&(t._activeWebview=null)})}_getHtmlForWebview(e){let r=e.asWebviewUri(j.Uri.joinPath(this.context.extensionUri,"dist","webview.js")),n=e.asWebviewUri(j.Uri.joinPath(this.context.extensionUri,"dist","katex","katex.min.css")),i=Mt();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${e.cspSource} blob: data:; script-src 'nonce-${i}'; style-src 'unsafe-inline' ${e.cspSource}; font-src ${e.cspSource};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NodeGraph</title>
  <link rel="stylesheet" href="${n}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; overflow: hidden; }
    body {
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
    }
    .katex-display { margin: 0.5em 0; }
    .katex-html { white-space: nowrap; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script nonce="${i}" src="${r}"></script>
</body>
</html>`}};var W=F(require("vscode")),os=F(require("child_process"));function lr(t){try{return os.execSync(t,{timeout:5e3,stdio:["pipe","pipe","pipe"]}).toString().trim()}catch{return""}}function Ie(t){return lr(t)!==""}function Dl(){let t=[],e=new Date().toISOString(),r=process.platform,n=r==="win32"?"Windows":r==="darwin"?"macOS":"Linux",i=process.arch,o=lr("python3 --version 2>&1")||lr("python --version 2>&1"),a=Ie("python3 --version 2>&1")?"python3":Ie("python --version 2>&1")?"python":"",s=a!=="",c=s&&Ie(`${a} -c "import fitz" 2>&1 && echo ok`),d=c?lr(`${a} -c "import fitz; print(fitz.__version__)"`):"",u=s&&Ie(`${a} -c "import pdfplumber" 2>&1 && echo ok`),l=s&&Ie(`${a} -c "import pdfminer" 2>&1 && echo ok`),p=s&&Ie(`${a} -c "from PIL import Image" 2>&1 && echo ok`),h=p?lr(`${a} -c "from PIL import __version__; print(__version__)"`):"",m=s&&Ie(`${a} -c "import cv2" 2>&1 && echo ok`),f=Ie("pdftotext -v 2>&1 && echo ok")||Ie("pdftotext --help 2>&1 && echo ok"),g=Ie("convert --version 2>&1 && echo ok"),v=Ie("magick --version 2>&1 && echo ok"),I=Ie("gs --version 2>&1 && echo ok")||Ie("gswin64c --version 2>&1 && echo ok"),b=S=>S?"\u2705":"\u274C";return t.push("# NodeGraph \u2014 Agent Environment Report"),t.push(""),t.push("> Auto-generated by the NodeGraph extension at activation."),t.push("> **AI agents: read this file to understand what tools are available on this machine.**"),t.push("> Re-generated each time a `.nodegraph.json` file is opened."),t.push(""),t.push(`Generated: \`${e}\``),t.push(""),t.push("---"),t.push(""),t.push("## System"),t.push(""),t.push("| | |"),t.push("|---|---|"),t.push(`| OS | ${n} (\`${r}\`) |`),t.push(`| Architecture | \`${i}\` |`),t.push(`| Python | ${s?`${b(!0)} \`${o}\``:`${b(!1)} not found`} |`),t.push(`| Python command | ${s?`\`${a}\``:"N/A"} |`),t.push(""),t.push("---"),t.push(""),t.push("## PDF Reading Capabilities"),t.push(""),t.push("| Tool | Available | Notes |"),t.push("|------|:---------:|-------|"),t.push(`| PyMuPDF (\`fitz\`) | ${b(c)} | ${c?`v${d} \u2014 recommended`:"Install: `pip install pymupdf`"} |`),t.push(`| pdfplumber | ${b(u)} | ${u?"available":"Install: `pip install pdfplumber`"} |`),t.push(`| pdfminer | ${b(l)} | ${l?"available":"Install: `pip install pdfminer.six`"} |`),t.push(`| poppler (\`pdftotext\`) | ${b(f)} | ${f?"CLI tool available":r==="win32"?"Install: download poppler for Windows":r==="darwin"?"Install: `brew install poppler`":"Install: `apt install poppler-utils`"} |`),t.push(`| Ghostscript (\`gs\`) | ${b(I)} | ${I?"available":"optional"} |`),t.push(""),t.push("---"),t.push(""),t.push("## Image Processing Capabilities"),t.push(""),t.push("| Tool | Available | Notes |"),t.push("|------|:---------:|-------|"),t.push(`| Pillow (\`PIL\`) | ${b(p)} | ${p?`v${h} \u2014 recommended`:"Install: `pip install Pillow`"} |`),t.push(`| OpenCV (\`cv2\`) | ${b(m)} | ${m?"available":"Install: `pip install opencv-python`"} |`),t.push(`| ImageMagick (\`convert\`) | ${b(g||v)} | ${g||v?"CLI tool available":r==="win32"?"Install: imagemagick.org":r==="darwin"?"Install: `brew install imagemagick`":"Install: `apt install imagemagick`"} |`),t.push(""),t.push("---"),t.push(""),t.push("## Agent Recommendations"),t.push(""),s||(t.push("> \u26A0\uFE0F **Python not found.** PDF reading and image processing via Python are not available."),t.push("> Install Python from https://python.org, then reopen a `.nodegraph.json` file to re-run this check."),t.push("")),t.push("### Reading a PDF"),c?(t.push("Use PyMuPDF (recommended \u2014 fastest and most accurate):"),t.push("```python"),t.push("import fitz"),t.push('doc = fitz.open("paper.pdf")'),t.push('text = "\\n".join(page.get_text() for page in doc)'),t.push("```")):u?(t.push("Use pdfplumber:"),t.push("```python"),t.push("import pdfplumber"),t.push('with pdfplumber.open("paper.pdf") as pdf:'),t.push('    text = "\\n".join(p.extract_text() or "" for p in pdf.pages)'),t.push("```")):f?(t.push("Use poppler CLI:"),t.push("```bash"),t.push("pdftotext paper.pdf -"),t.push("```")):t.push("\u274C No PDF reading tool available. Ask the user to install PyMuPDF: `pip install pymupdf`"),t.push(""),t.push("### Extracting images from a PDF"),c?(t.push("```python"),t.push("import fitz"),t.push('doc = fitz.open("paper.pdf")'),t.push("for i, page in enumerate(doc):"),t.push("    for img in page.get_images():"),t.push("        xref = img[0]"),t.push("        pix = fitz.Pixmap(doc, xref)"),t.push('        pix.save(f"fig_{i}_{xref}.png")'),t.push("```")):p?t.push("Pillow is available but cannot extract from PDF directly. Use PyMuPDF for extraction."):t.push("\u274C No image extraction tool available."),t.push(""),t.push("---"),t.push(""),t.push("*To refresh this report, reopen any `.nodegraph.json` file.*"),t.join(`
`)}async function Ri(t){let e=W.Uri.joinPath(t,".agent"),r=W.Uri.joinPath(e,"ENVIRONMENT.md");try{return await W.workspace.fs.createDirectory(e),await W.workspace.fs.writeFile(r,Buffer.from(Dl(),"utf-8")),!0}catch{return!1}}async function as(t){if(!(!t||t.length===0))for(let e of t)await Ri(e.uri)}async function ss(t,e){let r=W.Uri.joinPath(t,".agent","NODEGRAPH_SPEC.md"),n;try{n=await W.workspace.fs.readFile(r)}catch{return!1}let i=W.Uri.joinPath(e,".agent"),o=W.Uri.joinPath(i,"NODEGRAPH_SPEC.md");try{return await W.workspace.fs.createDirectory(i),await W.workspace.fs.writeFile(o,n),!0}catch{return!1}}async function cs(t,e){let r=W.Uri.joinPath(t,".prompt"),n=W.Uri.joinPath(e,".prompt");try{await W.workspace.fs.createDirectory(n);for(let i of["korean.md","english.md"]){let o=await W.workspace.fs.readFile(W.Uri.joinPath(r,i));await W.workspace.fs.writeFile(W.Uri.joinPath(n,i),o)}return!0}catch{return!1}}var Wa=F(require("path"));var ge=require("fs/promises"),me=F(require("path")),Ci=require("crypto"),on=class{constructor(e={}){this.hooks=e}async write(e,r,n){let i=`${JSON.stringify(r,null,2)}
`;await this.writeText(e,i,n)}async writeText(e,r,n){let i=ds(e);await(0,ge.mkdir)(me.dirname(e),{recursive:!0});try{await us(i,r),await this.hooks.beforeReplace?.(e,i),await n?.(),await(0,ge.rename)(i,e),await ki(me.dirname(e))}catch(o){try{await pr(i)}catch(a){throw new an(o,a)}throw o}}async remove(e){try{await(0,ge.unlink)(e),await ki(me.dirname(e))}catch(r){if(!Ai(r))throw r}}async writeBatch(e){let r=e.map(_l);try{await Ml(r),await this.verifyBatch(r),await Rl(r)}catch(n){throw await Cl(r,n),n}await Tl(r)}async verifyBatch(e){for(let r of e)await this.hooks.beforeReplace?.(r.target,r.temporary)}};function ds(t){let e=`.${me.basename(t)}.${(0,Ci.randomUUID)()}.tmp`;return me.join(me.dirname(t),e)}function _l(t){return{target:t.target,temporary:ds(t.target),backup:$l(t.target),content:`${JSON.stringify(t.value,null,2)}
`,backedUp:!1,replaced:!1}}function $l(t){let e=`.${me.basename(t)}.${(0,Ci.randomUUID)()}.backup`;return me.join(me.dirname(t),e)}async function Ml(t){for(let e of t)await(0,ge.mkdir)(me.dirname(e.target),{recursive:!0}),await us(e.temporary,e.content)}async function Rl(t){for(let e of t)e.backedUp=await kl(e.target,e.backup),await(0,ge.rename)(e.temporary,e.target),e.replaced=!0}async function kl(t,e){try{return await(0,ge.rename)(t,e),!0}catch(r){if(Ai(r))return!1;throw r}}async function Cl(t,e){try{for(let r of[...t].reverse())await Al(r)}catch(r){throw new an(e,r)}}async function Al(t){t.replaced&&await pr(t.target),t.backedUp&&await(0,ge.rename)(t.backup,t.target),await pr(t.temporary)}async function Tl(t){for(let e of t)await pr(e.temporary),await pr(e.backup),await ki(me.dirname(e.target))}var an=class extends Error{constructor(r,n){super("atomic-write-cleanup-failed");this.cause=r;this.cleanupCause=n}};async function us(t,e){let r=await(0,ge.open)(t,"wx");try{await r.writeFile(e,"utf8"),await r.sync()}finally{await r.close()}}async function ki(t){try{let e=await(0,ge.open)(t,"r");try{await e.sync()}finally{await e.close()}}catch{}}async function pr(t){try{await(0,ge.unlink)(t)}catch(e){if(!Ai(e))throw e}}function Ai(t){return typeof t=="object"&&t!==null&&"code"in t&&t.code==="ENOENT"}var kt=require("fs/promises"),hs=F(require("path")),ms=require("crypto");function y(t){return{layer:t.layer,severity:t.severity??"error",code:t.code,file:t.file,rule:t.rule,action:t.action,...t.objectId?{objectId:t.objectId}:{},...t.jsonPath?{jsonPath:t.jsonPath}:{}}}function R(t){return t.some(e=>e.severity==="error")}var ft="0.0.0",ht="1.0.0",ce="1.1.0",et="1.0.0",Rt="1.1.0",ls="1.0.0",ps="1.0.0",Ti=ft,ve={now:()=>new Date().toISOString()};var sn=class{constructor(e,r,n=ve){this.paths=e;this.schemas=r;this.clock=n}async append(e,r,n,i=!1){let o=await this.paths.resolve(e,r),a=Ol(n,this.clock.now()),s=this.schemas.validate("audit-event.schema.json",a,r);if(R(s))throw new tt("invalid-audit-event",s);return await fs(o,r,i),await Nl(o,`${JSON.stringify(a)}
`),a}async assertAppendable(e,r,n=!1){let i=await this.paths.resolve(e,r);await fs(i,r,n)}async inspect(e,r){let n=await this.paths.resolve(e,r),i=await gs(n);return i.missing?{events:[],diagnostics:[ys(r)]}:ql(i.text,r,this.schemas)}},tt=class extends Error{constructor(r,n=[]){super(r);this.code=r;this.diagnostics=n}};function Ol(t,e){return{eventId:`evt_${(0,ms.randomUUID)().replace(/-/g,"")}`,timestamp:e,actor:t.actor,action:t.action,objectId:t.objectId,...t.beforeHash?{beforeHash:t.beforeHash}:{},...t.afterHash?{afterHash:t.afterHash}:{},...t.baseRevision?{baseRevision:t.baseRevision}:{},...t.resultingRevision?{resultingRevision:t.resultingRevision}:{},...t.metadata?{metadata:t.metadata}:{}}}async function fs(t,e,r){let n=await gs(t);if(n.missing&&!r)throw new tt("missing-audit-log",[ys(e)]);if(n.text&&!n.text.endsWith(`
`))throw new tt("truncated-audit-final-line",[vs(e)])}async function Nl(t,e){await(0,kt.mkdir)(hs.dirname(t),{recursive:!0});let r=await(0,kt.open)(t,"a");try{await r.writeFile(e,"utf8"),await r.sync()}finally{await r.close()}}async function gs(t){try{return{text:await(0,kt.readFile)(t,"utf8"),missing:!1}}catch(e){if(Hl(e))return{text:"",missing:!0};throw e}}function ql(t,e,r){let n=[],i=[],o=t.split(`
`);for(let a=0;a<o.length;a++)o[a]&&Vl(o[a],a,o.length,t,e,r,n,i);return{events:n,diagnostics:i}}function Vl(t,e,r,n,i,o,a,s){let c=o.parseJson(t,i);if(!c.value){s.push(e===r-1&&!n.endsWith(`
`)?vs(i):c.diagnostics[0]);return}let d=o.validate("audit-event.schema.json",c.value,i);s.push(...d),R(d)||a.push(c.value)}function vs(t){return y({layer:"syntactic",code:"truncated-audit-final-line",file:t,severity:"warning",rule:"The audit log ends with an incomplete JSON line.",action:"Preserve the line for inspection and repair it before appending new events."})}function ys(t){return y({layer:"integrity",code:"missing-audit-log",file:t,rule:"The project audit log is missing.",action:"Restore the audit log before applying more project writes."})}function Hl(t){return typeof t=="object"&&t!==null&&"code"in t&&t.code==="ENOENT"}function fr(t){return t.normalize("NFC").trim()}function hr(t){let e=new Map;for(let r of t){let n=fr(r),i=ee(n);n&&!e.has(i)&&e.set(i,n)}return[...e.values()]}function ee(t){return fr(t).toLowerCase()}var cn=class{resolve(e,r,n){let i=e.constructs.find(o=>o.constructId===r);return i?i.status==="approved"?{constructId:r,diagnostics:[]}:i.status!=="deprecated"?{diagnostics:[Ct("construct-not-approved",r,n)]}:this.resolveDeprecated(e,i,n):{diagnostics:[Ct("construct-not-found",r,n)]}}resolveTerm(e,r,n){let i=ee(r),o=e.constructs.filter(s=>s.status==="approved"&&[s.canonicalName,...s.aliases].some(c=>ee(c)===i));if(o.length===1)return{constructId:o[0].constructId,diagnostics:[]};let a=o.length?"ambiguous-construct-alias":"construct-alias-not-found";return{diagnostics:[Ct(a,r,n)]}}resolveDeprecated(e,r,n){let i=r.primaryConstructId;if(!i)return{diagnostics:[Ct("missing-primary-construct",r.constructId,n)]};if(i===r.constructId)return{diagnostics:[Ct("self-referential-primary",r.constructId,n)]};let o=e.constructs.find(a=>a.constructId===i);return!o||o.status!=="approved"?{diagnostics:[Ct("primary-construct-not-active",r.constructId,n)]}:{constructId:o.constructId,diagnostics:[]}}};function Ct(t,e,r){return y({layer:"structural",code:t,file:r,objectId:e,rule:`${e} does not resolve directly to an approved construct.`,action:"Map the identifier to one distinct approved primary construct."})}var dn=class{constructor(e){this.constructs=e}validate(e,r){let n=Gl(e,r);return[...Wl(r,e),...Yl(r,n,e),...Kl(r,n,e,this.constructs),...Xl(r,n,e),...Jl(r,n,e),...Ql(r,n,e)]}validateExtraction(e,r,n,i,o){let a=e.papers.find(s=>s.paperId===r.paperId);return a?[...Fl(r,a.extractionPath),...zl(r,n,a.extractionPath),...Ll(r,i,a.extractionPath,this.constructs),...Ul(r,o,a.extractionPath)]:[Y("missing-paper-reference",r.paperId,r.extractionId)]}validateMethodologies(e,r){return We(e.paradigms.map(n=>n.paradigmId),r)}};function Fl(t,e){let r=[...Ge(t.fields.researchQuestionsOrHypotheses),...Ge(t.fields.theoreticalFramework),...Ge(t.fields.dataCollection),...Ge(t.fields.analysisMethod),...Ge(t.fields.mechanisms),...Ge(t.fields.moderators),...Ge(t.fields.limitations),...Ge(t.fields.boundaryConditions),...Ge(t.fields.recommendations),...(t.fields.findings.items??[]).map(n=>n.findingId)];return[...We(t.constructMappings.map(n=>n.mappingId),e),...We(r,e)]}function Ge(t){return(t.items??[]).map(e=>e.extractionItemId)}function zl(t,e,r){let n=new Map(e.evidence.map(i=>[i.evidenceId,i]));return Bl(t).flatMap(i=>{let o=n.get(i);return o?o.paperId!==t.paperId?[Y("evidence-paper-mismatch",r,i)]:[]:[Y("missing-evidence-reference",r,i)]})}function Bl(t){let e=Object.values(t.fields).flatMap(r=>{let n="evidenceIds"in r&&Array.isArray(r.evidenceIds)?r.evidenceIds:[],i="items"in r&&Array.isArray(r.items)?r.items.flatMap(o=>o.evidenceIds):[];return[...n,...i]});return[...new Set([...e,...t.constructMappings.flatMap(r=>r.evidenceIds)])]}function Ll(t,e,r,n){let i=new Map(t.constructMappings.map(a=>[a.mappingId,a])),o=[...(t.fields.keyConstructs.mappingIds??[]).filter(a=>!i.has(a)).map(a=>Y("missing-mapping-reference",r,a)),...(t.fields.findings.items??[]).flatMap(a=>a.constructMappingIds).filter(a=>!i.has(a)).map(a=>Y("missing-mapping-reference",r,a))];for(let a of t.constructMappings){if(!a.constructId)continue;if(!e.constructs.find(d=>d.constructId===a.constructId)){o.push(Y("missing-construct-reference",r,a.constructId));continue}let c=n.resolve(e,a.constructId,r);a.mappingStatus==="approved"&&o.push(...c.diagnostics),a.mappingStatus==="approved"&&a.reviewState.approval.researcher!=="approved"&&o.push(Y("mapping-approval-required",r,a.mappingId))}return o}function Ul(t,e,r){let n=t.methodology.methodologicalParadigm;if(!n.paradigmId)return[];let i=e.paradigms.find(o=>o.paradigmId===n.paradigmId);return n.mappingStatus!=="approved"?[]:i?.status==="approved"?[]:[Y("paradigm-not-approved",r,n.paradigmId)]}function Gl(t,e){return{papers:new Set(t.papers.map(r=>r.paperId)),sources:new Map(t.papers.map(r=>[r.source.sourceId,r])),evidence:new Set(e.evidence.evidence.map(r=>r.evidenceId)),claims:new Set(e.claims.claims.map(r=>r.claimId)),gaps:new Set(e.gaps.gaps.map(r=>r.gapId))}}function Wl(t,e){return[...We(t.evidence.evidence.map(r=>r.evidenceId),e.documents.evidence),...We(t.claims.claims.map(r=>r.claimId),e.documents.claims),...We(t.conflicts.conflicts.map(r=>r.conflictId),e.documents.conflicts),...We(t.gaps.gaps.map(r=>r.gapId),e.documents.gaps),...We(t.researchQuestions.researchQuestions.map(r=>r.researchQuestionId),e.documents.researchQuestions),...We(t.constructs.constructs.map(r=>r.constructId),e.documents.constructs)]}function We(t,e){let r=new Set,n=[];for(let i of t)r.has(i)&&n.push(Y("duplicate-identifier",e,i)),r.add(i);return n}function Yl(t,e,r){return t.evidence.evidence.flatMap(n=>{let i=[];e.papers.has(n.paperId)||i.push(Y("missing-paper-reference",r.documents.evidence,n.evidenceId));let o=e.sources.get(n.source.sourceId);return(o?.paperId!==n.paperId||o.source.relativePath!==n.source.relativePath||o.source.sourceDocumentHash!==n.source.sourceDocumentHash)&&i.push(Y("source-registration-mismatch",r.documents.evidence,n.evidenceId)),i})}function Kl(t,e,r,n){return t.claims.claims.flatMap(i=>[...i.findingRefs.filter(o=>!e.papers.has(o.paperId)).map(()=>Y("missing-paper-reference",r.documents.claims,i.claimId)),...i.evidenceRefs.filter(o=>!e.evidence.has(o)).map(()=>Y("missing-evidence-reference",r.documents.claims,i.claimId)),...(i.constructRefs??[]).flatMap(o=>n.resolve(t.constructs,o,r.documents.claims).diagnostics)])}function Xl(t,e,r){return t.conflicts.conflicts.flatMap(n=>[...e.claims.has(n.claimId)?[]:[Y("missing-claim-reference",r.documents.conflicts,n.conflictId)],...n.findingRefs.filter(i=>!e.papers.has(i.paperId)).map(()=>Y("missing-paper-reference",r.documents.conflicts,n.conflictId))])}function Jl(t,e,r){return t.gaps.gaps.flatMap(n=>[...n.evidenceRefs.filter(i=>!e.evidence.has(i)).map(()=>Y("missing-evidence-reference",r.documents.gaps,n.gapId)),...n.adversarialPasses.filter(i=>i.gapId!==n.gapId).map(()=>Y("adversarial-gap-mismatch",r.documents.gaps,n.gapId))])}function Ql(t,e,r){return t.researchQuestions.researchQuestions.flatMap(n=>[...n.gapRefs.filter(i=>!e.gaps.has(i)).map(()=>Y("missing-gap-reference",r.documents.researchQuestions,n.researchQuestionId)),...n.claimRefs.filter(i=>!e.claims.has(i)).map(()=>Y("missing-claim-reference",r.documents.researchQuestions,n.researchQuestionId))])}function Y(t,e,r){return y({layer:"structural",code:t,file:e,objectId:r,rule:`${r} contains an unresolved or duplicated project reference.`,action:"Restore the referenced authoritative object or correct the reference."})}var bs=require("crypto");var un=class{constructor(e,r){this.schemas=e;this.synthesis=r}read(e,r,n){let i=r.papers.find(o=>o.paperId===n);return i?this.synthesis.readExtraction(e,i):Promise.resolve({diagnostics:[ws(n)]})}async importProposal(e,r,n,i,o){let a=r.papers.find(c=>c.paperId===n.paperId);if(!a?.extractionPath)return xs(n,i,[ws(n.paperId)]);let s=[...this.schemas.validate("extraction.schema.json",n,a.extractionPath),...Zl(n,o,a.extractionPath)];return R(s)?xs(n,i,s):this.synthesis.applyMutation(e,r,{mutationId:`mutation_${(0,bs.randomUUID)().replace(/-/g,"")}`,targetDocument:a.extractionPath,baseRevision:i,operations:[{op:"replace",path:"",value:n}],requestedAt:n.modified,actor:o},{action:"extraction.proposal-imported",objectId:n.extractionId})}};function Zl(t,e,r){return e.type!=="agent"?[]:t.reviewState.origin==="ai"&&t.extractionStatus==="proposed"&&ep(t).every(n=>n.origin==="ai")?[]:[y({layer:"structural",code:"agent-proposal-origin-required",file:r,objectId:t.extractionId,rule:"Agent-created extraction must remain an AI proposal.",action:"Set origin to ai and extractionStatus to proposed."})]}function ep(t){return[t.reviewState,t.methodology.methodologicalParadigm.reviewState,t.methodology.researchApproach.reviewState,t.methodology.analyticalTechnique.reviewState,t.methodology.sampleCharacteristics.reviewState,...t.constructMappings.map(e=>e.reviewState),...Object.values(t.fields).flatMap(e=>"items"in e&&Array.isArray(e.items)?e.items.map(r=>r.reviewState):[])]}function ws(t){return y({layer:"structural",code:"paper-not-registered",file:"project.nodegraph.json",objectId:t,rule:"The extraction paper is not registered in this project.",action:"Choose a registered paper before importing the extraction."})}function xs(t,e,r){return{accepted:!1,code:"invalid-extraction-proposal",targetDocument:`extraction:${t.paperId}`,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:r}}var Oi=require("crypto");function ln(t){return t.normalize("NFC").replace(/\r\n?/g,`
`).trim().replace(/\s+/gu," ")}function mr(t){return JSON.stringify(Ni(t))}function G(t){return qi(mr(t))}function pn(t){return qi(ln(t))}function Ps(t){return qi(mr(tp(t)))}function gr(t){return`sha256:${(0,Oi.createHash)("sha256").update(t).digest("hex")}`}function tp(t){return{evidenceId:t.evidenceId,paperId:t.paperId,source:rp(t),quote:np(t),locator:ip(t)}}function rp(t){return{sourceId:t.source.sourceId,sourceDocumentHash:t.source.sourceDocumentHash}}function np(t){let e=ln(t.quote.text);return{text:e,quoteContentHash:pn(e)}}function ip(t){let e={page:t.locator.page,exact:ln(t.locator.exact)};return op(e,t,["prefix","suffix","section"]),e}function op(t,e,r){for(let n of r){let i=e.locator[n];i!==void 0&&(t[n]=ln(i))}}function Ni(t){return Array.isArray(t)?t.map(Ni):sp(t)?ap(t):t}function ap(t){let e={};for(let r of Object.keys(t).sort())e[r]=Ni(t[r]);return e}function sp(t){return t!==null&&typeof t=="object"}function qi(t){return`sha256:${(0,Oi.createHash)("sha256").update(t,"utf8").digest("hex")}`}var Ss=require("fs/promises");function Is(t,e){return t===ce?{mode:"read-write",diagnostics:[]}:t===ht?{mode:"read-only",diagnostics:[up(e)]}:{mode:"read-only",diagnostics:[dp(t,e)]}}function fn(t,e,r){let n=cp(t),i=pp(r);return n&&n!==i?[lp(n,i,e)]:[]}function rt(t){return t===ce?"project-v1.1.schema.json":"project.schema.json"}function hn(t){return t===ce?"paper-index-v1.1.schema.json":"paper-index.schema.json"}function cp(t){if(!t||typeof t!="object"||!("schema"in t))return;let e=t.schema;if(!(!e||typeof e!="object"||!("version"in e)))return typeof e.version=="string"?e.version:void 0}function dp(t,e){let r=Es(t,ce)>0;return y({layer:"syntactic",severity:"warning",code:r?"unsupported-newer-version":"unsupported-older-version",file:e,rule:`Persisted schema ${t} is not supported by this application.`,action:r?"Open the project with a newer application version.":"Keep the project read-only until an explicit migration is available."})}function up(t){return y({layer:"syntactic",severity:"warning",code:"migration-required",file:t,rule:`Project schema ${ht} is preserved read-only.`,action:`Run the Phase 2 project migration to schema ${ce}.`})}function lp(t,e,r){let n=Es(t,e)>0;return y({layer:"syntactic",severity:"warning",code:n?"unsupported-newer-version":"unsupported-older-version",file:r,rule:`Persisted schema ${t} is not supported for this document.`,action:n?"Open the document with a newer application version.":"Keep the document read-only until an explicit migration is available."})}function pp(t){return t==="project-v1.1.schema.json"?ce:t==="project.schema.json"?ht:t==="paper-index-v1.1.schema.json"?Rt:et}function Es(t,e){let r=t.split(".").map(Number),n=e.split(".").map(Number);for(let i=0;i<3;i++)if(r[i]!==n[i])return r[i]-n[i];return 0}async function mt(t,e,r,n){let i;try{i=await(0,Ss.readFile)(t,"utf8")}catch(s){return{diagnostics:[fp(e,s)]}}let o=n.parseJson(i,e);if(!o.value)return{diagnostics:o.diagnostics};let a=[...n.validate(r,o.value,e),...fn(o.value,e,r)];return R(a)?{diagnostics:a}:{value:o.value,diagnostics:a}}function fp(t,e){let r=de(e,"ENOENT");return{layer:"syntactic",severity:"error",code:r?"missing-file":"inaccessible-file",file:t,rule:r?"The registered file does not exist.":"The registered file cannot be read.",action:r?"Restore the file or remove its registration.":"Check file permissions and retry."}}function de(t,e){return typeof t=="object"&&t!==null&&"code"in t&&t.code===e}var gt=require("fs/promises"),K=F(require("path")),te=class extends Error{constructor(r,n){super(`${r}: ${n}`);this.code=r}},mn=class{async canonicalRoot(e){return(0,gt.realpath)(e)}async resolve(e,r,n=!1){Vi(r);let i=await this.canonicalRoot(e),o=hp(i,r),a=await vp(o);return js(i,a,r),n&&await(0,gt.access)(a),a}async resolveFromFile(e,r,n,i=!1){Vi(r),Vi(n);let o=mp(r,n),a=await this.resolve(e,o,i);return{relativePath:o,target:a}}};function Vi(t){if(!t)throw new te("invalid-project-path",t);if(K.posix.isAbsolute(t)||K.win32.isAbsolute(t))throw new te("absolute-path",t);if(t.includes("\\")||t.includes("\0"))throw new te("invalid-project-path",t);if(t.split("/").some(gp))throw new te("path-traversal",t)}function hp(t,e){let r=K.resolve(t,...e.split("/"));return js(t,r,e),r}function mp(t,e){let r=K.posix.dirname(t);return r==="."?e:K.posix.join(r,e)}function gp(t){return t===""||t==="."||t===".."}async function vp(t){let e=await yp(t),r=await(0,gt.realpath)(e);return K.resolve(r,K.relative(e,t))}async function yp(t){let e=t;for(;!await wp(e);)e=K.dirname(e);return e}async function wp(t){try{return await(0,gt.lstat)(t),!0}catch{return!1}}function js(t,e,r){let n=K.relative(t,e);if(n===".."||n.startsWith(`..${K.sep}`)||K.isAbsolute(n))throw new te("path-outside-project",r)}var gn=class{constructor(e,r,n,i,o,a,s,c=ve){this.paths=e;this.schemas=r;this.writer=n;this.audit=i;this.papers=o;this.synthesis=a;this.integrity=s;this.clock=c}async rebuild(e,r,n=!1){let i=this.clock.now(),o=await this.loadInputs(e,r),a=[...o.diagnostics],s=await this.buildPaperEntries(e,r,o.paperIndex,o.evidence,o.taxonomy,o.methodologies,i,n,a),c=Cp(s,o.evidence,i);return a.push(...this.validateIndexes(r,c.paper,c.evidence)),await this.persistValidBuild(e,r,c,s,n,a),Ap(c,s,a)}async loadInputs(e,r){let n=await this.synthesis.readDocument(e,r.documents.paperIndex,"paper-index-v1.1.schema.json"),i=await this.synthesis.readEvidence(e,r),o=await this.synthesis.readTaxonomy(e,r),a=await this.synthesis.readMethodologies(e,r);return{...n.value?{paperIndex:n.value}:{},evidence:i.value?.evidence??[],...o.value?{taxonomy:o.value}:{},...a.value?{methodologies:a.value}:{},diagnostics:[...n.diagnostics.filter(s=>s.code!=="missing-file").map(Rp),...i.diagnostics,...o.diagnostics,...a.diagnostics]}}async buildPaperEntries(e,r,n,i,o,a,s,c,d){let u=new Map((n?.entries??[]).map(h=>[h.paperId,h])),l=xp(u,r),p={evidence:i,taxonomy:o,methodologies:a,now:s,full:c,build:l,diagnostics:d,auditPath:r.documents.auditLog,manifest:r};for(let h of r.papers)await this.addPaperEntry(e,h,u.get(h.paperId),p);return l}async addPaperEntry(e,r,n,i){if(!i.taxonomy||!i.methodologies)return;let o=await this.synthesis.readExtraction(e,r);if(i.diagnostics.push(...o.diagnostics),!o.value)return;let a=await this.synthesis.validateExtraction(e,i.manifest,r,o.value);if(i.diagnostics.push(...a),R(a))return;let s=G(o.value),c=await this.calculateGraphHash(e,r);if(i.diagnostics.push(...c.diagnostics),!c.value)return;let d=await this.inspectSourceIdentity(e,r,i);if(!i.full&&n&&bp(n,r,c.value,d.currentHash,s,o.value,i.taxonomy.taxonomyVersion)){Pp(i.build,n);return}await this.rebuildPaperEntry(e,r,c.value,d.currentHash,d.diagnostics,o.value,s,i)}async inspectSourceIdentity(e,r,n){let i=await this.integrity.inspectSource(e,r);return n.diagnostics.push(...i.diagnostics),await this.recordSourceChange(e,r,i.currentHash,n.auditPath),i}async rebuildPaperEntry(e,r,n,i,o,a,s,c){let d=c.evidence.filter(p=>p.paperId===r.paperId),u=await this.integrity.inspectPaper(e,r,d,{graphHash:n,...i?{currentSourceHash:i}:{}});if(c.diagnostics.push(...u.diagnostics),!u.graph||R(u.diagnostics))return;let l=this.papers.buildIndexMetadata(r,u.graph,n,c.taxonomy.taxonomyVersion,c.now,a.extractorVersion);c.build.entries.push(Ip(l,r.extractionPath,a,s,c.taxonomy,c.methodologies,d,[...o,...u.diagnostics])),c.build.processed.push(r.paperId)}async persistValidBuild(e,r,n,i,o,a){R(a)||(await this.audit.assertAppendable(e,r.documents.auditLog),await this.writeIndexes(e,r,n.paper,n.evidence),await this.appendAudit(e,r,i,o))}async calculateGraphHash(e,r){try{return{value:await this.papers.calculateGraphHash(e,r.path),diagnostics:[]}}catch(n){return{diagnostics:[Mp(r,n)]}}}async recordSourceChange(e,r,n,i){!n||n===r.source.sourceDocumentHash||await this.audit.append(e,i,{actor:{type:"service",id:"IntegrityService",version:Ti},action:"source.hash-changed",objectId:r.source.sourceId,beforeHash:r.source.sourceDocumentHash,afterHash:n,metadata:{paperId:r.paperId,sourcePath:r.source.relativePath}})}validateIndexes(e,r,n){return[...this.schemas.validate("paper-index-v1.1.schema.json",r,e.documents.paperIndex),...this.schemas.validate("evidence-index.schema.json",n,e.documents.evidenceIndex)]}async writeIndexes(e,r,n,i){let o=await this.paths.resolve(e,r.documents.paperIndex),a=await this.paths.resolve(e,r.documents.evidenceIndex);await this.writer.writeBatch([{target:o,value:n},{target:a,value:i}])}async appendAudit(e,r,n,i){await this.audit.append(e,r.documents.auditLog,{actor:{type:"service",id:"IndexBuilder",version:Ti},action:"index.rebuilt",objectId:r.projectId,metadata:{full:i,processedPaperIds:n.processed,reusedPaperIds:n.reused,removedPaperIds:n.removed}})}};function xp(t,e){let r=new Set(e.papers.map(n=>n.paperId));return{entries:[],processed:[],reused:[],removed:[...t.keys()].filter(n=>!r.has(n))}}function bp(t,e,r,n,i,o,a){return t.paperGraphHash===r&&t.paperPath===e.path&&n===e.source.sourceDocumentHash&&t.sourceDocumentHash===e.source.sourceDocumentHash&&t.extractionPath===e.extractionPath&&t.extractionRevision===i&&t.taxonomyVersion===a&&t.extractorVersion===o.extractorVersion}function Pp(t,e){t.entries.push(e),t.reused.push(e.paperId)}function Ip(t,e,r,n,i,o,a,s){let c=Ep(r);return{...t,extractionId:r.extractionId,extractionPath:e,extractionRevision:n,constructMappings:Sp(r,i,c),findings:c,methodology:Dp(r,o),verificationSummary:$p(r,a),staleness:{paperGraph:!1,extraction:!1,evidence:s.some(d=>d.code.startsWith("stale-")||d.code==="source-document-hash-mismatch")}}}function Ep(t){return(t.fields.findings.items??[]).map(e=>({findingId:e.findingId,...e.nodeId?{nodeId:e.nodeId}:{},sourceText:e.sourceText,constructMappingIds:[...e.constructMappingIds],evidenceIds:[...e.evidenceIds],reviewState:e.reviewState}))}function Sp(t,e,r){return t.constructMappings.map(n=>{let i=n.constructId?jp(e,n.constructId):void 0;return{mappingId:n.mappingId,sourceTerm:n.sourceTerm,...n.constructId?{constructId:n.constructId}:{},...n.mappingStatus==="approved"&&i?{constructId:i.constructId,constructName:i.canonicalName}:{},mappingStatus:n.mappingStatus,findingIds:r.filter(o=>o.constructMappingIds.includes(n.mappingId)).map(o=>o.findingId),evidenceIds:[...n.evidenceIds],reviewState:n.reviewState}})}function jp(t,e){let r=t.constructs.find(i=>i.constructId===e);if(r?.status==="approved")return r;if(r?.status!=="deprecated"||!r.primaryConstructId)return;let n=t.constructs.find(i=>i.constructId===r.primaryConstructId);return n?.status==="approved"?n:void 0}function Dp(t,e){let r=t.methodology.methodologicalParadigm,n=r.mappingStatus==="approved"?e.paradigms.find(o=>o.paradigmId===r.paradigmId&&o.status==="approved"):void 0,i=t.methodology.sampleCharacteristics;return{...n?{paradigmId:n.paradigmId,paradigmLabel:n.label}:{},...r.sourceTerm?{paradigmSourceTerm:r.sourceTerm}:{},paradigmMappingStatus:r.mappingStatus,...Ds("researchApproach",t.methodology.researchApproach),...Ds("analyticalTechnique",t.methodology.analyticalTechnique),..._p("population",t.fields.population),...i.unitOfAnalysis?{unitOfAnalysis:i.unitOfAnalysis}:{},...i.n!==void 0?{sampleSize:i.n}:{}}}function Ds(t,e){let r=e.normalizedValue??e.sourceTerm;return r?{[t]:r}:{}}function _p(t,e){let r=e.normalizedValue??e.sourceText;return r?{[t]:r}:{}}function $p(t,e){let r=[...(t.fields.findings.items??[]).map(i=>i.reviewState),...t.constructMappings.map(i=>i.reviewState)],n=new Set([...t.fields.exactEvidenceQuotations.evidenceIds,...(t.fields.findings.items??[]).flatMap(i=>i.evidenceIds),...t.constructMappings.flatMap(i=>i.evidenceIds)]);return{pendingSource:e.filter(i=>n.has(i.evidenceId)&&i.reviewState.verification.source==="pending").length,pendingInterpretation:r.filter(i=>i.verification.interpretation==="pending").length,pendingClassification:r.filter(i=>i.verification.classification==="pending").length,disputedClassification:r.filter(i=>i.verification.classification==="disputed").length}}function Mp(t,e){let r=e instanceof te?e.code:void 0,n=de(e,"ENOENT");return y({layer:r?"structural":"integrity",code:r??(n?"missing-paper-file":"inaccessible-paper-file"),file:t.path,objectId:t.paperId,rule:r?"The paper path escapes the project root.":"The paper graph cannot be read.",action:r?"Use a contained project-relative path.":"Restore the paper graph before rebuilding indexes."})}function Rp(t){return{...t,layer:"integrity",severity:"warning",code:"invalid-derived-index",action:"Rebuild the derived index from authoritative project data."}}function kp(t,e){return{schema:{name:"nodegraph-paper-index",version:Rt},generatedAt:e,entries:[...t].sort((r,n)=>r.paperId.localeCompare(n.paperId))}}function Cp(t,e,r){return{paper:kp(t.entries,r),evidence:Tp(e,r)}}function Ap(t,e,r){return{paperIndex:t.paper,evidenceIndex:t.evidence,processedPaperIds:e.processed,reusedPaperIds:e.reused,removedPaperIds:e.removed,diagnostics:r}}function Tp(t,e){return{schema:{name:"nodegraph-evidence-index",version:et},generatedAt:e,entries:t.map(r=>Op(r,e)).sort((r,n)=>r.evidenceId.localeCompare(n.evidenceId))}}function Op(t,e){return{evidenceId:t.evidenceId,paperId:t.paperId,...t.nodeId?{nodeId:t.nodeId}:{},evidenceObjectHash:t.evidenceObjectHash,quoteContentHash:t.quote.quoteContentHash,sourceDocumentHash:t.source.sourceDocumentHash,indexedAt:e}}var vn=require("fs/promises");var yn=class{constructor(e,r,n,i){this.paths=e;this.papers=r;this.synthesis=n;this.audit=i}async validate(e,r){let n=await this.synthesis.readBundle(e,r),i=await this.audit.inspect(e,r.documents.auditLog),o=[...n.diagnostics,...i.diagnostics];return n.bundle&&(o.push(...await this.validatePapers(e,r,n.bundle)),o.push(...await this.validateIndexes(e,r,n.bundle))),$s(o)}async inspectPaper(e,r,n=[],i={}){let o=[],a=i.graphHash??await this.readGraphHash(e,r,o),s=i.currentSourceHash??await this.readSourceHash(e,r,o),c=await this.readGraph(e,r,o);return c&&o.push(...qp(n,c,r)),{...c?{graph:c}:{},...a?{graphHash:a}:{},...s?{currentSourceHash:s}:{},diagnostics:o}}async inspectSource(e,r){let n=[],i=await this.readSourceHash(e,r,n);return{...i?{currentHash:i}:{},diagnostics:n}}async identifyProjectSource(e,r){let n=await this.paths.resolve(e,r,!0);return _s(r,await(0,vn.readFile)(n))}async identifyPaperSource(e,r,n){let i=await this.paths.resolveFromFile(e,r,n,!0);return _s(i.relativePath,await(0,vn.readFile)(i.target))}async validatePapers(e,r,n){let i=[],o=Np(n.evidence.evidence);for(let a of r.papers){let s=await this.synthesis.readExtraction(e,a);i.push(...s.diagnostics),s.value&&i.push(...await this.synthesis.validateExtraction(e,r,a,s.value));let c=await this.inspectPaper(e,a,o.get(a.paperId)??[]);i.push(...c.diagnostics),c.graph&&i.push(...zp(c.graph,a,n))}return i}async validateIndexes(e,r,n){let i=await this.synthesis.readDocument(e,r.documents.paperIndex,hn(r.schema.version)),o=await this.synthesis.readDocument(e,r.documents.evidenceIndex,"evidence-index.schema.json");return[...i.diagnostics.map(Ms),...o.diagnostics.map(Ms),...i.value?await Bp(e,r,i.value,this.papers,this.synthesis):[],...o.value?Up(n.evidence.evidence,o.value,r):[]]}async readGraph(e,r,n){try{let i=await this.papers.read(e,r);return n.push(...i.diagnostics),i.graph}catch(i){n.push(Hi(i,r.path,r.paperId,"paper"));return}}async readGraphHash(e,r,n){try{return await this.papers.calculateGraphHash(e,r.path)}catch(i){n.push(Hi(i,r.path,r.paperId,"paper"));return}}async readSourceHash(e,r,n){try{let i=await this.paths.resolve(e,r.source.relativePath,!0),o=gr(await(0,vn.readFile)(i));return o!==r.source.sourceDocumentHash&&n.push(Wp(r,o)),o}catch(i){n.push(Hi(i,r.source.relativePath,r.source.sourceId,"source"));return}}};function _s(t,e){return{relativePath:t,sourceDocumentHash:gr(e)}}function $s(t){return{valid:!R(t),diagnostics:t}}function Np(t){let e=new Map;for(let r of t){let n=e.get(r.paperId)??[];n.push(r),e.set(r.paperId,n)}return e}function qp(t,e,r){return t.flatMap(n=>[...Vp(n,r),...Hp(n,r),...Fp(n,e,r)])}function Vp(t,e){let r=[];return pn(t.quote.text)!==t.quote.quoteContentHash&&r.push(At("stale-quotation-hash",t,e)),Ps(t)!==t.evidenceObjectHash&&r.push(At("stale-evidence-object-hash",t,e)),r}function Hp(t,e){let r=e.source;return t.source.sourceId===r.sourceId&&t.source.sourceDocumentHash===r.sourceDocumentHash&&t.source.relativePath===r.relativePath?[]:[At("evidence-source-mismatch",t,e)]}function Fp(t,e,r){if(!t.nodeId)return[];let n=e.nodes.find(i=>i.id===t.nodeId);return n?n.original?.text?pn(n.original.text)===t.quote.quoteContentHash?[]:[At("stale-quotation-evidence",t,r)]:[At("missing-node-evidence",t,r)]:[At("broken-evidence-link",t,r)]}function zp(t,e,r){let n=[...r.claims.claims.flatMap(o=>o.findingRefs),...r.conflicts.conflicts.flatMap(o=>o.findingRefs)].filter(o=>o.paperId===e.paperId),i=new Set(t.nodes.map(o=>o.id));return n.filter(o=>!i.has(o.findingId)).map(o=>y({layer:"integrity",code:"orphaned-finding-reference",file:e.path,objectId:o.findingId,rule:"A synthesis object references a finding node that does not exist.",action:"Restore the node or update the synthesis reference through review."}))}async function Bp(t,e,r,n,i){let o=[],a=await i.readTaxonomy(t,e);o.push(...a.diagnostics);let s=new Map(e.papers.map(c=>[c.paperId,c]));for(let c of e.papers){let d=r.entries.find(u=>u.paperId===c.paperId);d?o.push(...await Lp(t,c,d,n,i,e,a.value?.taxonomyVersion)):o.push(Tt(e.documents.paperIndex,c.paperId))}for(let c of r.entries)s.has(c.paperId)||o.push(Tt(e.documents.paperIndex,c.paperId));return o}async function Lp(t,e,r,n,i,o,a){try{let s=await n.calculateGraphHash(t,e.path),c=await i.readExtraction(t,e),d=c.value?G(c.value):void 0;return r.paperGraphHash!==s||r.paperPath!==e.path||r.sourceDocumentHash!==e.source.sourceDocumentHash||r.extractionPath!==e.extractionPath||r.extractionRevision!==d||r.taxonomyVersion!==a?[Tt(o.documents.paperIndex,e.paperId)]:[]}catch{return[Tt(o.documents.paperIndex,e.paperId)]}}function Up(t,e,r){let n=new Map(t.map(o=>[o.evidenceId,o])),i=[];for(let o of t){let a=e.entries.find(s=>s.evidenceId===o.evidenceId);(!a||!Gp(o,a))&&i.push(Tt(r.documents.evidenceIndex,o.evidenceId))}for(let o of e.entries)n.has(o.evidenceId)||i.push(Tt(r.documents.evidenceIndex,o.evidenceId));return i}function Gp(t,e){return e.paperId===t.paperId&&e.nodeId===t.nodeId&&e.evidenceObjectHash===t.evidenceObjectHash&&e.quoteContentHash===t.quote.quoteContentHash&&e.sourceDocumentHash===t.source.sourceDocumentHash}function Wp(t,e){return y({layer:"integrity",severity:"warning",code:"source-document-hash-mismatch",file:t.source.relativePath,objectId:t.source.sourceId,rule:`The current PDF hash ${e} does not match the registered source identity.`,action:"Restore the registered PDF or review and explicitly register the new source version."})}function At(t,e,r){return y({layer:"integrity",severity:t.startsWith("stale-")?"warning":"error",code:t,file:r.path,objectId:e.evidenceId,rule:`${e.evidenceId} no longer matches its authoritative source or paper node.`,action:"Preserve the record and review the source, quotation, and link before updating it."})}function Hi(t,e,r,n){let i=t instanceof te?t.code:void 0,o=de(t,"ENOENT");return y({layer:i?"structural":"integrity",code:i??(o?`missing-${n}-file`:`inaccessible-${n}-file`),file:e,objectId:r,rule:i?"The path escapes the project root.":`The registered ${n} file cannot be read.`,action:i?"Use a contained project-relative path.":`Restore the ${n} file or remove its registration.`})}function Tt(t,e){return y({layer:"integrity",severity:"warning",code:"stale-derived-index",file:t,objectId:e,rule:"The derived index entry does not match authoritative project data.",action:"Rebuild the index from the manifest, paper graphs, and evidence records."})}function Ms(t){return{...t,layer:"integrity",severity:"warning",code:t.code==="missing-file"?"missing-derived-index":"invalid-derived-index",action:"Rebuild the derived index from authoritative project data."}}var As=require("fs/promises");var re=class extends Error{constructor(r,n){super(`${r}: ${n}`);this.code=r;this.pointer=n}};function Rs(t,e){let r=Ot(t);for(let n of e)r=Yp(r,n);return r}function Yp(t,e){if(e.path==="")return Kp(t,e);let r=Xp(e.path),n=Zp(t,r,e.path),i=r[r.length-1];return e.op==="add"?ef(t,n,i,e):e.op==="remove"?tf(t,n,i,e.path):e.op==="replace"?rf(t,n,i,e):(nf(n,i,e),t)}function Kp(t,e){if(e.op==="remove")throw new re("root-remove-forbidden",e.path);if(e.op==="test"){if(!Cs(t,e.value))throw new re("test-failed",e.path);return t}return Ot(e.value)}function Xp(t){if(!t.startsWith("/"))throw new re("invalid-json-pointer",t);return t.slice(1).split("/").map(e=>Qp(Jp(e),t))}function Jp(t){return t.replace(/~1/g,"/").replace(/~0/g,"~")}function Qp(t,e){if(["__proto__","prototype","constructor"].includes(t))throw new re("unsafe-json-pointer",e);return t}function Zp(t,e,r){let n=t;for(let i of e.slice(0,-1))n=ks(n,i,r);return n}function ks(t,e,r){if(Array.isArray(t))return t[wn(e,t.length,r)];if(vr(t)&&Fi(t,e))return t[e];throw new re("path-not-found",r)}function ef(t,e,r,n){if(Array.isArray(e))e.splice(af(r,e.length,n.path),0,Ot(n.value));else if(vr(e))e[r]=Ot(n.value);else throw new re("invalid-patch-parent",n.path);return t}function tf(t,e,r,n){if(Array.isArray(e))e.splice(wn(r,e.length,n),1);else if(vr(e)&&Fi(e,r))delete e[r];else throw new re("path-not-found",n);return t}function rf(t,e,r,n){return of(e,r,n.path),Array.isArray(e)?e[wn(r,e.length,n.path)]=Ot(n.value):vr(e)&&(e[r]=Ot(n.value)),t}function nf(t,e,r){let n=ks(t,e,r.path);if(!Cs(n,r.value))throw new re("test-failed",r.path)}function of(t,e,r){if(Array.isArray(t)){wn(e,t.length,r);return}if(!vr(t)||!Fi(t,e))throw new re("path-not-found",r)}function af(t,e,r){if(t==="-")return e;let n=Number(t);if(!Number.isInteger(n)||n<0||n>e)throw new re("invalid-array-index",r);return n}function wn(t,e,r){let n=Number(t);if(!Number.isInteger(n)||n<0||n>=e)throw new re("invalid-array-index",r);return n}function Ot(t){return t===void 0?void 0:JSON.parse(JSON.stringify(t))}function Cs(t,e){return mr(t)===mr(e)}function vr(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)}function Fi(t,e){return Object.prototype.hasOwnProperty.call(t,e)}var Se=class extends Error{constructor(r,n,i){super(`The authoritative write committed, but its audit event could not be appended: ${r}`);this.targetDocument=r;this.resultingRevision=n;this.cause=i;this.code="audit-append-failed"}},xn=class{constructor(e,r,n,i,o){this.paths=e;this.schemas=r;this.writer=n;this.audit=i;this.reviews=o;this.recoveryRequired=new Set}async apply(e,r,n){let i=await this.paths.canonicalRoot(e);if(this.recoveryRequired.has(i))return pf(r);let o=this.schemas.validate("mutation-envelope.schema.json",r,"mutation-envelope");return R(o)?Nt(r,o):this.applyValidated(e,i,r,n)}async requiresRecovery(e){let r=await this.paths.canonicalRoot(e);return this.recoveryRequired.has(r)}async applyValidated(e,r,n,i){let o=await this.paths.resolve(e,n.targetDocument),a=await Ts(o,n.targetDocument,this.schemas,i.currentSchemaName??i.schemaName);if(a.diagnostics.length)return Nt(n,a.diagnostics);let s=a.value===void 0?"absent":G(a.value);return s==="absent"&&n.baseRevision==="absent"&&!i.allowCreate?lf(n):n.baseRevision!==s?this.rejectStale(e,n,i.auditPath,s):this.commitCandidate(e,o,a.value,s,r,n,i)}async commitCandidate(e,r,n,i,o,a,s){let c=cf(n,a);if(c instanceof re)return uf(a,c);let d=await this.validateCandidate(n,c,a,s);if(R(d))return Nt(a,d);await this.audit.assertAppendable(e,s.auditPath,s.allowCreate??!1);let u=await this.writeCandidate(e,r,c,i,a,s);if(u)return u;let l=G(c);return await this.appendCommitAudit(e,o,a,s,l),{accepted:!0,targetDocument:a.targetDocument,resultingRevision:l}}async writeCandidate(e,r,n,i,o,a){try{await this.writer.write(r,n,async()=>{let s=await sf(r,o.targetDocument,this.schemas,a.currentSchemaName??a.schemaName);if(s!==i)throw new bn(s)});return}catch(s){if(s instanceof Pn)return Nt(o,s.diagnostics);if(!(s instanceof bn))throw s;return this.rejectStale(e,o,a.auditPath,s.currentRevision)}}async validateCandidate(e,r,n,i){let o=this.schemas.validate(i.schemaName,r,n.targetDocument);if(R(o))return o;if(e===void 0&&i.allowCreate)return await i.validateCandidate?.(r)??o;let a=this.reviews.validateApprovalAuthority(e,r,n.actor,n.targetDocument);if(R(a))return a;let s=await i.validateCandidate?.(r)??[];return[...o,...a,...s]}async rejectStale(e,r,n,i){return await this.audit.append(e,n,{actor:{type:"service",id:"SynthesisRepository",version:ft},action:"mutation.rejected-stale",objectId:r.mutationId,baseRevision:r.baseRevision,metadata:{targetDocument:r.targetDocument,currentRevision:i}}),df(r,i)}async appendCommitAudit(e,r,n,i,o){try{await this.audit.append(e,i.auditPath,{actor:n.actor,action:i.auditAction,objectId:i.auditObjectId,baseRevision:n.baseRevision,resultingRevision:o,metadata:{...i.auditMetadata,mutationId:n.mutationId,targetDocument:n.targetDocument}},i.allowCreate??!1)}catch(a){throw this.recoveryRequired.add(r),new Se(n.targetDocument,o,a)}}},bn=class extends Error{constructor(r){super("revision-changed-before-replace");this.currentRevision=r}};async function Ts(t,e,r,n){let i;try{i=await(0,As.readFile)(t,"utf8")}catch(a){return de(a,"ENOENT")?{diagnostics:[]}:{diagnostics:[ff(e)]}}let o=r.parseJson(i,e);return o.value?{value:o.value,diagnostics:[...r.validate(n,o.value,e),...fn(o.value,e,n)]}:{diagnostics:o.diagnostics}}async function sf(t,e,r,n){let i=await Ts(t,e,r,n);if(i.diagnostics.length)throw new Pn(i.diagnostics);return i.value===void 0?"absent":G(i.value)}var Pn=class extends Error{constructor(r){super("current-document-invalid-before-replace");this.diagnostics=r}};function cf(t,e){try{return Rs(t,e.operations)}catch(r){if(r instanceof re)return r;throw r}}function Nt(t,e){return{accepted:!1,code:"invalid-mutation",targetDocument:t.targetDocument,currentRevision:t.baseRevision,receivedBaseRevision:t.baseRevision,retryable:!1,rejectedOperations:t.operations,diagnostics:e}}function df(t,e){return{accepted:!1,code:"stale-revision",targetDocument:t.targetDocument,currentRevision:e,receivedBaseRevision:t.baseRevision,retryable:!0,rejectedOperations:t.operations}}function uf(t,e){return Nt(t,[y({layer:"structural",code:e.code,file:t.targetDocument,jsonPath:e.pointer,rule:"The mutation operation cannot be applied to the current document.",action:"Refresh the document and correct the rejected operation."})])}function lf(t){return Nt(t,[y({layer:"structural",code:"authoritative-creation-not-allowed",file:t.targetDocument,rule:"Only project initialization may create an authoritative document from an absent revision.",action:"Create the project through ProjectRegistry before applying document mutations."})])}function pf(t){return{accepted:!1,code:"audit-recovery-required",targetDocument:t.targetDocument,currentRevision:t.baseRevision,receivedBaseRevision:t.baseRevision,retryable:!1,rejectedOperations:t.operations}}function ff(t){return y({layer:"syntactic",code:"inaccessible-file",file:t,rule:"The current authoritative document cannot be read.",action:"Restore read access before retrying the mutation."})}var Ns=["paperId","paperTitle","publicationYear","constructId","constructName","cellState","extractionId","extractionRevision","mappingIds","sourceTerms","findingIds","nodeIds","evidenceIds","methodologicalParadigm","researchApproach","analyticalTechnique","population","unitOfAnalysis","sourceVerification","interpretationVerification","classificationVerification","stale"],In=class{export(e,r){let n=new Map(e.entries.map(o=>[o.paperId,o])),i=r.cells.map(o=>hf(o,n.get(o.paperId),r));return[Os(Object.fromEntries(Ns.map(o=>[o,o]))),...i.map(Os)].join(`\r
`)+`\r
`}};function hf(t,e,r){let n=r.papers.find(a=>a.paperId===t.paperId),i=r.constructs.find(a=>a.constructId===t.constructId),o=e?.findings?.filter(a=>t.findingIds.includes(a.findingId))??[];return{paperId:t.paperId,paperTitle:n?.title??e?.title??"",publicationYear:String(n?.publicationYear??""),constructId:t.constructId,constructName:i?.canonicalName??"",cellState:t.state,extractionId:e?.extractionId??"",extractionRevision:e?.extractionRevision??"",mappingIds:t.mappingIds.join(" | "),sourceTerms:t.sourceTerms.join(" | "),findingIds:t.findingIds.join(" | "),nodeIds:o.flatMap(a=>a.nodeId??[]).join(" | "),evidenceIds:t.evidenceIds.join(" | "),methodologicalParadigm:n?.methodology.paradigmLabel??n?.methodology.paradigmSourceTerm??"",researchApproach:n?.methodology.researchApproach??"",analyticalTechnique:n?.methodology.analyticalTechnique??"",population:n?.methodology.population??"",unitOfAnalysis:n?.methodology.unitOfAnalysis??"",sourceVerification:zi(t.verification.source).join(" | "),interpretationVerification:zi(t.verification.interpretation).join(" | "),classificationVerification:zi(t.verification.classification).join(" | "),stale:String(!!(n?.staleness&&Object.values(n.staleness).some(Boolean)))}}function Os(t){return Ns.map(e=>mf(t[e])).join(",")}function mf(t){return`"${gf(t).replace(/"/g,'""')}"`}function gf(t){return/^[=+\-@]/.test(t)?`'${t}`:t}function zi(t){return[...new Set(t)]}var Li=require("fs/promises");var En=class{constructor(e,r){this.paths=e;this.schemas=r;this.hydratedPaperIds=[]}async read(e,r){let n=await this.paths.resolve(e,r.path,!0);this.hydratedPaperIds.push(r.paperId);let i=await(0,Li.readFile)(n,"utf8"),o=this.schemas.parseJson(i,r.path);if(!o.value)return{diagnostics:o.diagnostics};let a=this.validateGraph(o.value,r);return R(a)?{diagnostics:a}:{graph:o.value,diagnostics:a}}async calculateGraphHash(e,r){let n=await this.paths.resolve(e,r,!0);return gr(await(0,Li.readFile)(n))}resolveNode(e,r){return e.nodes.find(n=>n.id===r)}buildIndexMetadata(e,r,n,i,o,a){return{paperId:e.paperId,paperPath:e.path,paperGraphHash:n,sourceDocumentHash:e.source.sourceDocumentHash,title:fr(r.title),authors:bf(r),...Pf(r),tags:Ef(r),taxonomyVersion:i,extractorVersion:a,indexedAt:o}}instrumentation(){return{count:this.hydratedPaperIds.length,paperIds:[...this.hydratedPaperIds]}}resetInstrumentation(){this.hydratedPaperIds=[]}validateGraph(e,r){let n=this.schemas.validate("nodegraph.schema.json",e,r.path);return R(n)?n:vf(e,r)}};function vf(t,e){let r=[],n=yf(t.nodes.map(i=>i.id),e,r);return wf(t,e,r),xf(t,n,e,r),r}function yf(t,e,r){let n=new Set;for(let i of t)n.has(i)&&r.push(Sf(e,i)),n.add(i);return n}function wf(t,e,r){let n=new Set;for(let i of t.edges)n.has(i.id)&&r.push(jf(e,i.id)),n.add(i.id)}function xf(t,e,r,n){for(let i of t.nodes)for(let o of i.children)e.has(o)||n.push(Bi(r,o));for(let i of t.edges)e.has(i.source)||n.push(Bi(r,i.source)),e.has(i.target)||n.push(Bi(r,i.target))}function bf(t){return t.source?.authors?hr([t.source.authors]):[]}function Pf(t){let e=If(t.source?.venue),r=t.source?.doi?fr(t.source.doi):void 0;return{...e?{publicationYear:e}:{},...r?{doi:r}:{}}}function If(t){let e=t?.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);return e?Number(e[1]):void 0}function Ef(t){return Array.isArray(t.tags)?hr(t.tags.filter(e=>typeof e=="string")):[]}function Sf(t,e){return Ui(t,"duplicate-node-id",e,"Make every node ID unique.")}function jf(t,e){return Ui(t,"duplicate-edge-id",e,"Make every edge ID unique.")}function Bi(t,e){return Ui(t,"missing-node-reference",e,"Restore the node or remove the broken reference.")}function Ui(t,e,r,n){return y({layer:"structural",code:e,file:t.path,objectId:r,rule:`${r} violates paper graph reference rules.`,action:n})}var it=require("fs/promises"),wr=F(require("path")),Rn=require("crypto");function jn(t,e){let r="not-extracted";return{schema:{name:"nodegraph-extraction",version:ls},extractionId:`extraction_${t.slice(6)}`,paperId:t,extractorVersion:ft,extractionStatus:"not-started",fields:{researchProblem:{reportingStatus:r},purpose:{reportingStatus:r},researchQuestionsOrHypotheses:{reportingStatus:r},theoreticalFramework:{reportingStatus:r},keyConstructs:{reportingStatus:r},population:{reportingStatus:r},setting:{reportingStatus:r},sampleSize:{reportingStatus:r},methodology:{reportingStatus:r},dataCollection:{reportingStatus:r},analysisMethod:{reportingStatus:r},findings:{reportingStatus:r},mechanisms:{reportingStatus:r},moderators:{reportingStatus:r},limitations:{reportingStatus:r},boundaryConditions:{reportingStatus:r},recommendations:{reportingStatus:r},exactEvidenceQuotations:{reportingStatus:r,evidenceIds:[]}},methodology:{methodologicalParadigm:{reportingStatus:r,mappingStatus:"unmapped",reviewState:Ye("imported")},researchApproach:{reportingStatus:r,reviewState:Ye("imported")},analyticalTechnique:{reportingStatus:r,reviewState:Ye("imported")},sampleCharacteristics:{reportingStatus:r,reviewState:Ye("imported")}},constructMappings:[],reviewState:Ye("imported"),created:e,modified:e}}function Dn(t){return{schema:{name:"nodegraph-methodology-registry",version:ps},registryVersion:1,paradigms:[Sn("positivist","Positivist"),Sn("interpretive","Interpretive"),Sn("critical","Critical"),Sn("pragmatist","Pragmatist")],modified:t}}function Ye(t="human"){return{verification:{source:"pending",interpretation:"pending",classification:"pending"},approval:{researcher:"not-reviewed",advisor:"not-reviewed"},origin:t}}function Sn(t,e){return{paradigmId:t,label:e,aliases:[],status:"approved",reviewState:{verification:{source:"not-applicable",interpretation:"not-applicable",classification:"verified"},approval:{researcher:"approved",advisor:"not-reviewed"},origin:"imported"}}}var J="project.nodegraph.json",Df="papers",Mn=class{constructor(e,r,n,i,o=ve){this.paths=e;this.schemas=r;this.writer=n;this.mutations=i;this.clock=o}async create(e,r,n){await(0,it.mkdir)(e,{recursive:!0});let i=wr.join(e,J);await Lf(i);let o=_f(r,n,this.clock.now()),a=this.schemas.validate(rt(o.schema.version),o,J);return R(a)?{mode:"read-only",diagnostics:a,hydrationCount:0}:(await this.writeInitialProject(e,o),this.open(i))}async open(e){let r=wr.dirname(e),n=await Uf(e),i=await mt(e,J,n,this.schemas);if(!i.value)return{mode:"read-only",diagnostics:i.diagnostics,hydrationCount:0};let o=i.value,a=Is(o.schema.version,J),s=[...i.diagnostics,...Fs(o),...await this.inspectRegistrations(r,o)],c=await this.loadIndexes(r,o);return s.push(...c.diagnostics),{mode:a.mode==="read-only"||R(s)?"read-only":"read-write",manifest:o,manifestRevision:G(o),...c.paperIndex?{paperIndex:c.paperIndex}:{},...c.evidenceIndex?{evidenceIndex:c.evidenceIndex}:{},diagnostics:s,hydrationCount:0}}async registerPaper(e,r,n,i,o){let a=await this.validateNewRegistration(e,r,n);if(R(a))return zf(n,i,a);let s=Hf(r,n,i,o,this.clock.now()),c=!1;try{c=await this.createRegistrationExtraction(e,r,n);let d=await this.mutations.apply(e,s,{schemaName:rt(r.schema.version),auditPath:r.documents.auditLog,auditAction:"paper.registered",auditObjectId:n.paperId});return!d.accepted&&c&&await this.removeRegistrationExtraction(e,n),d}catch(d){throw c&&!(d instanceof Se)&&await this.removeRegistrationExtraction(e,n),d}}async unregisterPaper(e,r,n,i,o){let a=r.papers.findIndex(c=>c.paperId===n);if(a<0)return Bf(n,i);let s=Ff(r,a,n,i,o,this.clock.now());return this.mutations.apply(e,s,{schemaName:rt(r.schema.version),auditPath:r.documents.auditLog,auditAction:"paper.unregistered",auditObjectId:n})}async resolveDocument(e,r,n=!1){return this.paths.resolve(e,r,n)}async writeInitialProject(e,r){let n=Rf(r,this.clock.now()),i=$f(r,n);await this.assertTargetsAbsent(e,i);let o=new Set;try{await(0,it.mkdir)(wr.join(e,Df),{recursive:!0});for(let a of n)a.authoritative&&o.add(r.documents.auditLog),await this.writeTrackedInitialDocument(e,r,a,o);o.add(r.documents.auditLog),await this.writeTrackedAuthoritativeDocument(e,r,Mf(r),"project.created",r.projectId,o)}catch(a){throw await this.removeInitialFiles(e,[...o]),a}}async writeTrackedInitialDocument(e,r,n,i){try{await this.writeInitialDocument(e,r,n),i.add(n.path)}catch(o){throw o instanceof Se&&i.add(n.path),o}}async writeTrackedAuthoritativeDocument(e,r,n,i,o,a){try{await this.writeAuthoritativeDocument(e,r,n,i,o),a.add(n.path)}catch(s){throw s instanceof Se&&a.add(n.path),s}}async writeInitialDocument(e,r,n){let i=this.schemas.validate(n.schema,n.value,n.path);if(R(i))throw new Error(`Invalid initial document: ${n.path}`);if(n.authoritative){await this.writeAuthoritativeDocument(e,r,n,"project.document-created",n.path);return}await this.writer.write(await this.paths.resolve(e,n.path),n.value)}async writeAuthoritativeDocument(e,r,n,i,o){let a=await this.mutations.apply(e,kf(n,this.clock.now()),{schemaName:n.schema,auditPath:r.documents.auditLog,auditAction:i,auditObjectId:o,allowCreate:!0});if(!a.accepted)throw new Error(`Failed to create ${n.path}: ${a.code}`)}async assertTargetsAbsent(e,r){for(let n of r){let i=await this.paths.resolve(e,n);await Wi(i)}}async removeInitialFiles(e,r){for(let n of[...r].reverse()){let i=await this.paths.resolve(e,n);await this.writer.remove(i)}}async inspectRegistrations(e,r){let n=[...Hs(r),...zs(r)];for(let i of r.papers)n.push(...await this.inspectRegistrationFiles(e,i));return n}async inspectRegistrationFiles(e,r,n=!0){return[...await Gi(this.paths,e,r.path,r.paperId,"paper"),...await Gi(this.paths,e,r.source.relativePath,r.source.sourceId,"source"),...n&&r.extractionPath?await Gi(this.paths,e,r.extractionPath,r.paperId,"extraction"):[]]}async loadIndexes(e,r){let n=await this.loadOptionalIndex(e,r.documents.paperIndex,hn(r.schema.version)),i=await this.loadOptionalIndex(e,r.documents.evidenceIndex,"evidence-index.schema.json");return{...n.value?{paperIndex:n.value}:{},...i.value?{evidenceIndex:i.value}:{},diagnostics:[...n.diagnostics,...i.diagnostics]}}async loadOptionalIndex(e,r,n){let i=await this.paths.resolve(e,r),o=await mt(i,r,n,this.schemas);return o.value?o:o.diagnostics.some(a=>a.code==="missing-file")?{diagnostics:[qf(r)]}:{diagnostics:o.diagnostics.map(Vf)}}async validateNewRegistration(e,r,n){let i={...r,papers:[...r.papers,n]},o=this.schemas.validate(rt(r.schema.version),i,J);return o.push(...Fs(i)),o.push(...Hs(i)),o.push(...zs(i)),o.push(...await this.inspectRegistrationFiles(e,n,!1)),o}async createRegistrationExtraction(e,r,n){if(!n.extractionPath)return!1;let i=await this.paths.resolve(e,n.extractionPath);await Wi(i);let o=jn(n.paperId,this.clock.now());return await this.writeAuthoritativeDocument(e,r,nt(n.extractionPath,"extraction.schema.json",o),"extraction.initialized",o.extractionId),!0}async removeRegistrationExtraction(e,r){await this.writer.remove(await this.paths.resolve(e,r.extractionPath))}};function _f(t,e,r){return{schema:{name:"nodegraph-project",version:ce},projectId:t,title:e,created:r,modified:r,papers:[],documents:{claims:"synthesis/claims.json",conflicts:"synthesis/conflicts.json",gaps:"synthesis/gaps.json",researchQuestions:"synthesis/research-questions.json",constructs:"taxonomy/constructs.json",methodologies:"taxonomy/methodologies.json",evidence:"evidence/records.json",paperIndex:"indexes/papers.index.json",evidenceIndex:"indexes/evidence.index.json",auditLog:"audit/events.jsonl"}}}function $f(t,e){return[...e.map(r=>r.path),t.documents.auditLog,J]}function Mf(t){return{path:J,schema:rt(t.schema.version),value:t,authoritative:!0}}function Rf(t,e){return[nt(t.documents.claims,"synthesis-claims.schema.json",yr("nodegraph-synthesis-claims","claims",e)),nt(t.documents.conflicts,"conflicts.schema.json",yr("nodegraph-conflicts","conflicts",e)),nt(t.documents.gaps,"gaps.schema.json",yr("nodegraph-gaps","gaps",e)),nt(t.documents.researchQuestions,"research-questions.schema.json",yr("nodegraph-research-questions","researchQuestions",e)),nt(t.documents.constructs,"construct-taxonomy.schema.json",Cf(e)),nt(t.documents.methodologies,"methodology-registry.schema.json",Dn(e)),nt(t.documents.evidence,"evidence-records.schema.json",yr("nodegraph-evidence-records","evidence",e)),qs(t.documents.paperIndex,"paper-index-v1.1.schema.json",Vs("nodegraph-paper-index",Rt,e)),qs(t.documents.evidenceIndex,"evidence-index.schema.json",Vs("nodegraph-evidence-index",et,e))]}function nt(t,e,r){return{path:t,schema:e,value:r,authoritative:!0}}function qs(t,e,r){return{path:t,schema:e,value:r,authoritative:!1}}function kf(t,e){return{mutationId:`mutation_${(0,Rn.randomUUID)().replace(/-/g,"")}`,targetDocument:t.path,baseRevision:"absent",operations:[{op:"add",path:"",value:t.value}],requestedAt:e,actor:{type:"service",id:"ProjectRegistry",version:ft}}}function yr(t,e,r){return{schema:{name:t,version:et},[e]:[],modified:r}}function Cf(t){return{schema:{name:"nodegraph-construct-taxonomy",version:et},taxonomyVersion:1,constructs:[],modified:t}}function Vs(t,e,r){return{schema:{name:t,version:e},generatedAt:r,entries:[]}}function Hs(t){return[...qt(t.papers.map(e=>e.paperId)).map(e=>_n("duplicate-paper-id",e)),...qt(t.papers.map(e=>e.path)).map(e=>_n("duplicate-paper-path",e)),...qt(t.papers.map(e=>e.source.sourceId)).map(e=>_n("duplicate-source-id",e)),...qt(t.papers.flatMap(e=>e.extractionPath??[])).map(e=>_n("duplicate-extraction-path",e))]}function Fs(t){let e=Object.values(t.documents).filter(r=>typeof r=="string");return[...qt(e).map(Tf),...e.filter(r=>r===J).map(Of)]}function zs(t){let e=new Set([J,...Object.values(t.documents).filter(r=>typeof r=="string")]);return[...Af(t),...t.papers.flatMap(r=>[...e.has(r.path)?[$n(r.path,r.paperId)]:[],...e.has(r.source.relativePath)?[$n(r.source.relativePath,r.source.sourceId)]:[],...r.extractionPath&&e.has(r.extractionPath)?[$n(r.extractionPath,r.paperId)]:[]])]}function Af(t){let e=t.papers.flatMap(r=>[r.path,r.source.relativePath,...r.extractionPath?[r.extractionPath]:[]]);return qt(e).map(r=>$n(r,r))}function qt(t){let e=new Set,r=new Set;for(let n of t)e.has(n)&&r.add(n),e.add(n);return[...r]}function Tf(t){return Bs("duplicate-project-document-path",t,"Give every manifest-owned document a distinct path.")}function Of(t){return Bs("reserved-project-document-path",t,"Use a subordinate path that is different from project.nodegraph.json.")}function $n(t,e){return y({layer:"structural",code:"registration-path-collision",file:J,objectId:e,rule:`${t} is already owned by the project manifest.`,action:"Choose a distinct contained path for the paper graph, source PDF, or extraction."})}function Bs(t,e,r){return y({layer:"structural",code:t,file:J,objectId:e,rule:`${e} cannot safely identify the requested project document.`,action:r})}function _n(t,e){return y({layer:"structural",code:t,file:J,objectId:e,rule:`${e} is registered more than once.`,action:"Keep one registration with a unique identifier and path."})}async function Gi(t,e,r,n,i){try{let o=await t.resolve(e,r,!0);return await(0,it.access)(o),[]}catch(o){return[Nf(r,n,i,o)]}}function Nf(t,e,r,n){let i=n instanceof te?n.code:void 0,o=de(n,"ENOENT");return y({layer:i?"structural":"integrity",code:i??(o?`missing-${r}-file`:`inaccessible-${r}-file`),file:t,objectId:e,rule:i?"The registered path escapes the project root.":`The registered ${r} file cannot be read.`,action:i?"Use a contained project-relative path.":`Restore the ${r} file or remove its registration.`})}function qf(t){return y({layer:"integrity",severity:"warning",code:"missing-derived-index",file:t,rule:"The derived index is missing.",action:"Rebuild project indexes; authoritative data is unaffected."})}function Vf(t){return{...t,layer:"integrity",severity:"warning",code:"invalid-derived-index",action:"Rebuild the derived index from authoritative project data."}}function Hf(t,e,r,n,i){return{mutationId:`mutation_${(0,Rn.randomUUID)().replace(/-/g,"")}`,targetDocument:J,baseRevision:r,operations:[{op:"add",path:"/papers/-",value:e},{op:"replace",path:"/modified",value:i}],requestedAt:i,actor:n}}function Ff(t,e,r,n,i,o){return{mutationId:`mutation_${(0,Rn.randomUUID)().replace(/-/g,"")}`,targetDocument:J,baseRevision:n,operations:[{op:"test",path:`/papers/${e}/paperId`,value:r},{op:"remove",path:`/papers/${e}`},{op:"replace",path:"/modified",value:o}],requestedAt:o,actor:i}}function zf(t,e,r){return{accepted:!1,code:"invalid-registration",targetDocument:J,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[{op:"add",path:"/papers/-",value:t}],diagnostics:r}}function Bf(t,e){return{accepted:!1,code:"paper-not-registered",targetDocument:J,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:[y({layer:"structural",code:"paper-not-registered",file:J,objectId:t,rule:"The requested paper is not registered.",action:"Refresh the manifest and choose a registered paper."})]}}async function Lf(t){return Wi(t)}async function Uf(t){try{let e=JSON.parse(await(0,it.readFile)(t,"utf8")),r=typeof e.schema?.version=="string"?e.schema.version:ce;return e.documents?.methodologies!==void 0||e.papers?.some(i=>i.extractionPath!==void 0)?"project-v1.1.schema.json":rt(r)}catch{return rt(ce)}}async function Wi(t){try{throw await(0,it.access)(t),new Error(`Project file already exists: ${t}`)}catch(e){if(!de(e,"ENOENT"))throw e}}var Cn=class{constructor(e,r,n){this.papers=e;this.synthesis=r;this.constructs=n}search(e,r){return e.entries.filter(n=>Gf(n,r)).map(n=>({paperId:n.paperId,paperPath:n.paperPath,title:n.title,authors:n.authors,...n.publicationYear?{publicationYear:n.publicationYear}:{},...n.doi?{doi:n.doi}:{},tags:n.tags}))}async hydratePaper(e,r,n){let i=Xf(r,n);return this.papers.read(e,i)}matrix(e,r,n={}){let i=e.entries.filter(a=>Jf(a)).filter(a=>Qf(a,n)),o=eh(i,r,n);return{papers:i.map(th),constructs:o,cells:i.flatMap(a=>o.map(s=>rh(a,s.constructId))),filters:n}}async hydrateMatrixCell(e,r,n,i){let o=r.papers.find(f=>f.paperId===n);if(!o?.extractionPath)return;let[a,s,c,d]=await Promise.all([this.synthesis.readExtraction(e,o),this.synthesis.readEvidence(e,r),this.synthesis.readTaxonomy(e,r),this.synthesis.readMethodologies(e,r)]);if(!a.value||!s.value||!c.value||!d.value)return;let u=a.value.constructMappings.filter(f=>i===Vt?f.mappingStatus!=="approved":f.mappingStatus==="approved"&&ih(c.value,f.constructId,this.constructs)===i),l=new Set(u.map(f=>f.mappingId)),p=(a.value.fields.findings.items??[]).filter(f=>f.constructMappingIds.some(g=>l.has(g))),h=new Set([...u.flatMap(f=>f.evidenceIds),...p.flatMap(f=>f.evidenceIds)]),m=i===Vt?Ls:c.value.constructs.find(f=>f.constructId===i)?.canonicalName??i;return{paperId:n,paperPath:o.path,constructId:i,constructName:m,extractionId:a.value.extractionId,extractionRevision:G(a.value),methodology:oh(a.value,d.value),mappings:u,findings:p,evidence:s.value.evidence.filter(f=>h.has(f.evidenceId)),diagnostics:[...a.diagnostics,...s.diagnostics,...c.diagnostics,...d.diagnostics]}}locateMatrixCell(e,r,n){let i=e.entries.find(s=>s.paperPath===r),o=i?.findings?.find(s=>s.nodeId===n);if(!i||!o)return;let a=i.constructMappings?.find(s=>o.constructMappingIds.includes(s.mappingId));return a?{paperId:i.paperId,constructId:a.mappingStatus==="approved"&&a.constructId?a.constructId:Vt}:void 0}},Vt="__pending__",Ls="Pending / unmapped";function Gf(t,e){return Us(t,e.text)&&Gs(t,e.publicationYear)&&Yf(t.doi,e.doi)&&Kf(t.tags,e.tag)}function Us(t,e){if(!e?.trim())return!0;let r=ee(e);return Wf(t).some(n=>ee(n).includes(r))}function Wf(t){return[t.paperId,t.title,...t.authors,...t.publicationYear?[String(t.publicationYear)]:[],...t.doi?[t.doi]:[],...t.tags]}function Gs(t,e){return e===void 0||t.publicationYear===e}function Yf(t,e){return e===void 0||t!==void 0&&ee(t)===ee(e)}function Kf(t,e){return e===void 0||t.some(r=>ee(r)===ee(e))}function Xf(t,e){let r=t.papers.find(n=>n.paperId===e);if(!r)throw new Error(`paper-not-registered: ${e}`);return r}function Jf(t){return!!(t.extractionId&&t.extractionPath&&t.extractionRevision&&t.constructMappings&&t.findings&&t.methodology&&t.verificationSummary&&t.staleness)}function Qf(t,e){return Us(t,e.paper)&&Gs(t,e.publicationYear)&&kn(t.methodology?.paradigmLabel,e.paradigm)&&kn(t.methodology?.researchApproach,e.approach)&&kn(t.methodology?.analyticalTechnique,e.technique)&&kn(t.methodology?.population,e.population)&&Zf(t,e.verification)}function kn(t,e){return e?!!(t&&ee(t).includes(ee(e))):!0}function Zf(t,e){return e?e==="pending-source"?(t.verificationSummary?.pendingSource??0)>0:e==="pending-interpretation"?(t.verificationSummary?.pendingInterpretation??0)>0:e==="pending-classification"?(t.verificationSummary?.pendingClassification??0)>0:e==="disputed-classification"?(t.verificationSummary?.disputedClassification??0)>0:!0:!0}function eh(t,e,r){let n=e.constructs.filter(o=>o.status==="approved").filter(o=>!r.constructId||o.constructId===r.constructId).map(o=>({constructId:o.constructId,canonicalName:o.canonicalName})).sort((o,a)=>o.canonicalName.localeCompare(a.canonicalName));return t.some(o=>o.constructMappings?.some(a=>a.mappingStatus!=="approved"))&&(!r.constructId||r.constructId===Vt)?[...n,{constructId:Vt,canonicalName:Ls}]:n}function th(t){return{paperId:t.paperId,title:t.title,...t.publicationYear?{publicationYear:t.publicationYear}:{},methodology:t.methodology,verificationSummary:t.verificationSummary,staleness:t.staleness}}function rh(t,e){let r=(t.constructMappings??[]).filter(o=>e===Vt?o.mappingStatus!=="approved":o.mappingStatus==="approved"&&o.constructId===e),n=new Set(r.map(o=>o.mappingId)),i=(t.findings??[]).filter(o=>o.constructMappingIds.some(a=>n.has(a)));return{paperId:t.paperId,constructId:e,state:nh(t,r,i),mappingIds:[...n],sourceTerms:r.map(o=>o.sourceTerm),findingIds:i.map(o=>o.findingId),evidenceIds:[...new Set([...r.flatMap(o=>o.evidenceIds),...i.flatMap(o=>o.evidenceIds)])],verification:{source:i.map(o=>o.reviewState.verification.source),interpretation:i.map(o=>o.reviewState.verification.interpretation),classification:[...r.map(o=>o.reviewState.verification.classification),...i.map(o=>o.reviewState.verification.classification)]}}}function nh(t,e,r){return t.staleness&&Object.values(t.staleness).some(Boolean)?"stale":e.length?e.some(n=>n.mappingStatus==="pending")?"pending":e.every(n=>n.mappingStatus==="unmapped")?"unmapped":r.length?"extracted":"invalid":"empty"}function ih(t,e,r){if(e)return r.resolve(t,e,"matrix").constructId}function oh(t,e){let r=t.methodology.methodologicalParadigm,n=e.paradigms.find(i=>i.paradigmId===r.paradigmId&&i.status==="approved");return{...n?{paradigmId:n.paradigmId,paradigmLabel:n.label}:{},...r.sourceTerm?{paradigmSourceTerm:r.sourceTerm}:{},paradigmMappingStatus:r.mappingStatus,...t.methodology.researchApproach.normalizedValue||t.methodology.researchApproach.sourceTerm?{researchApproach:t.methodology.researchApproach.normalizedValue??t.methodology.researchApproach.sourceTerm}:{},...t.methodology.analyticalTechnique.normalizedValue||t.methodology.analyticalTechnique.sourceTerm?{analyticalTechnique:t.methodology.analyticalTechnique.normalizedValue??t.methodology.analyticalTechnique.sourceTerm}:{},...t.fields.population.normalizedValue||t.fields.population.sourceText?{population:t.fields.population.normalizedValue??t.fields.population.sourceText}:{},...t.methodology.sampleCharacteristics.unitOfAnalysis?{unitOfAnalysis:t.methodology.sampleCharacteristics.unitOfAnalysis}:{},...t.methodology.sampleCharacteristics.n!==void 0?{sampleSize:t.methodology.sampleCharacteristics.n}:{}}}var An=class{validateApprovalAuthority(e,r,n,i){return[...ah(e,r,n,i),...sh(e,r,n,i),...ch(e,r,n,i)]}transitionVerification(e,r,n,i,o){return mh(i)?gh(r,n)?{value:{...e,verification:{...e.verification,[r]:n}},diagnostics:[]}:{diagnostics:[wh(o,r,n)]}:{diagnostics:[vh(o,r)]}}transitionResearcherApproval(e,r,n,i){return n.type!=="human"&&!(n.type==="service"&&n.id==="ReviewStateService")?{diagnostics:[xh(i)]}:{value:{...e,approval:{...e.approval,researcher:r}},diagnostics:[]}}};function ah(t,e,r,n){let i=dh(t,e);return i.length?r.type==="human"?[]:r.type==="service"&&r.id==="ReviewStateService"?[]:r.type==="agent"&&i.every(o=>ph(o.after))?[]:[y({layer:"structural",code:"approval-authority-required",file:n,rule:"Approval fields may only be changed by a human or ReviewStateService.",action:"Submit the change for researcher review."})]:[]}function sh(t,e,r,n){let i=uh(t,e);return!i.length||r.type==="human"?[]:r.type==="service"&&r.id==="ReviewStateService"?[]:r.type==="agent"&&i.every(o=>fh(o.after))?[]:[yh(n)]}function ch(t,e,r,n){return r.type!=="agent"?[]:lh(t,e).every(o=>hh(o.after))?[]:[y({layer:"structural",code:"agent-origin-required",file:n,rule:"Review state created or changed by an agent must retain AI origin.",action:"Set reviewState.origin to ai and submit the record for researcher review."})]}function dh(t,e){let r=Ws(t),n=Ws(e);return[...new Set([...Object.keys(r),...Object.keys(n)])].filter(o=>JSON.stringify(r[o])!==JSON.stringify(n[o])).map(o=>({before:r[o],after:n[o]}))}function Ws(t,e=""){let r={};return Yi(t,e,r),r}function uh(t,e){let r=Ys(t),n=Ys(e);return[...new Set([...Object.keys(r),...Object.keys(n)])].filter(o=>JSON.stringify(r[o])!==JSON.stringify(n[o])).map(o=>({before:r[o],after:n[o]}))}function Ys(t,e=""){let r={};return Ki(t,e,r),r}function lh(t,e){let r=Ks(t),n=Ks(e);return[...new Set([...Object.keys(r),...Object.keys(n)])].filter(o=>JSON.stringify(r[o])!==JSON.stringify(n[o])).map(o=>({before:r[o],after:n[o]}))}function Ks(t,e=""){let r={};return Xi(t,e,r),r}function Yi(t,e,r){if(Array.isArray(t)){t.forEach((n,i)=>Yi(n,`${e}/${i}`,r));return}if(Ht(t))for(let[n,i]of Object.entries(t))n==="approval"?r[`${e}/approval`]=i:Yi(i,`${e}/${n}`,r)}function Ki(t,e,r){if(Array.isArray(t)){t.forEach((n,i)=>Ki(n,`${e}/${i}`,r));return}if(Ht(t))for(let[n,i]of Object.entries(t))n==="verification"?r[`${e}/verification`]=i:Ki(i,`${e}/${n}`,r)}function Xi(t,e,r){if(Array.isArray(t)){t.forEach((n,i)=>Xi(n,`${e}/${i}`,r));return}if(Ht(t))for(let[n,i]of Object.entries(t))n==="reviewState"?r[`${e}/reviewState`]=i:Xi(i,`${e}/${n}`,r)}function Ht(t){return t!==null&&typeof t=="object"}function ph(t){return Ht(t)?t.researcher==="not-reviewed"&&t.advisor==="not-reviewed":!1}function fh(t){return Ht(t)?t.source==="pending"&&t.interpretation==="pending"&&t.classification==="pending":!1}function hh(t){return Ht(t)&&t.origin==="ai"}function mh(t){return t.type==="human"||t.type==="service"&&t.id==="ReviewStateService"}function gh(t,e){return t==="source"?["pending","verified","rejected","stale","not-applicable"].includes(e):t==="interpretation"?["pending","verified","rejected","not-applicable"].includes(e):["pending","verified","disputed","not-applicable"].includes(e)}function vh(t,e){return y({layer:"structural",code:"verification-authority-required",file:t,objectId:e,rule:"Only a researcher or ReviewStateService may confirm or dispute verification.",action:"Submit the proposed state to the researcher verification queue."})}function yh(t){return y({layer:"structural",code:"verification-authority-required",file:t,rule:"An agent may add pending review states but cannot confirm or dispute verification.",action:"Submit the proposed state to the researcher verification queue."})}function wh(t,e,r){return y({layer:"structural",code:"invalid-verification-transition",file:t,objectId:e,rule:`${r} is not valid for ${e} verification.`,action:"Choose a documented state for the selected verification dimension."})}function xh(t){return y({layer:"structural",code:"approval-authority-required",file:t,rule:"Only a researcher or ReviewStateService may change researcher approval.",action:"Submit the proposal for researcher review."})}var Ji=require("fs/promises"),Xs=F(require("path")),Js=require("crypto");var Ft="project.nodegraph.json",bh="taxonomy/methodologies.json",Tn=class{constructor(e,r,n,i,o=ve){this.paths=e;this.schemas=r;this.writer=n;this.mutations=i;this.clock=o}async migratePhase2(e,r){if(r.type!=="human")return Eh(r);let n=await mt(e,Ft,"project.schema.json",this.schemas);return n.value?n.value.schema.version!==ht?Sh(n.value.schema.version):this.migrateValidated(Xs.dirname(e),n.value,r):On(n.diagnostics)}async migrateValidated(e,r,n){let i=this.clock.now(),o=Ph(r,i),a=Ih(o,i),s=this.validateProposal(o,a);if(R(s))return On(s);await this.assertTargetsAbsent(e,a);let c=[];try{await this.writeProposedDocuments(e,a,c);let d=await this.replaceManifest(e,r,o,n,i);if(!d.accepted)return await this.removeCreated(e,c),{mutation:d,diagnostics:d.diagnostics??[]};let u=await this.invalidateIndexes(e,o);return{mutation:d,manifest:o,diagnostics:u}}catch(d){throw d instanceof Se?(await this.invalidateIndexes(e,o),d):(await this.removeCreated(e,c),d)}}validateProposal(e,r){return[...this.schemas.validate("project-v1.1.schema.json",e,Ft),...r.flatMap(n=>this.schemas.validate(n.schema,n.value,n.path))]}async assertTargetsAbsent(e,r){for(let n of r){let i=await this.paths.resolve(e,n.path);try{throw await(0,Ji.access)(i),new Error(`Migration target already exists: ${n.path}`)}catch(o){if(!de(o,"ENOENT"))throw o}}}async writeProposedDocuments(e,r,n){for(let i of r){let o=await this.paths.resolve(e,i.path);await this.writer.write(o,i.value),n.push(i.path)}}async replaceManifest(e,r,n,i,o){return this.mutations.apply(e,{mutationId:`mutation_${(0,Js.randomUUID)().replace(/-/g,"")}`,targetDocument:Ft,baseRevision:G(r),operations:[{op:"replace",path:"",value:n}],requestedAt:o,actor:i},{schemaName:"project-v1.1.schema.json",currentSchemaName:"project.schema.json",auditPath:r.documents.auditLog,auditAction:"schema.migrated",auditObjectId:r.projectId,auditMetadata:{fromSchemaVersion:ht,toSchemaVersion:ce},validateCandidate:()=>this.validateCreatedTargets(e,n)})}async validateCreatedTargets(e,r){let n=[r.documents.methodologies,...r.papers.map(o=>o.extractionPath)],i=[];for(let o of n)try{await(0,Ji.access)(await this.paths.resolve(e,o,!0))}catch{i.push(jh(o))}return i}async invalidateIndexes(e,r){let n=[];for(let i of[r.documents.paperIndex,r.documents.evidenceIndex])try{await this.writer.remove(await this.paths.resolve(e,i))}catch{n.push(Dh(i))}return n}async removeCreated(e,r){for(let n of[...r].reverse())await this.writer.remove(await this.paths.resolve(e,n))}};function Ph(t,e){return{...t,schema:{...t.schema,version:ce},modified:e,papers:t.papers.map(r=>({...r,extractionPath:`extractions/${r.paperId}.json`})),documents:{...t.documents,methodologies:bh}}}function Ih(t,e){return[{path:t.documents.methodologies,schema:"methodology-registry.schema.json",value:Dn(e)},...t.papers.map(r=>({path:r.extractionPath,schema:"extraction.schema.json",value:jn(r.paperId,e)}))]}function Eh(t){return On([y({layer:"structural",code:"migration-authority-required",file:Ft,objectId:t.id,rule:"Only a researcher may start the Phase 2 schema migration.",action:"Run the migration through a researcher-confirmed command."})])}function Sh(t){return On([y({layer:"structural",code:"migration-not-required",file:Ft,objectId:t,rule:"The project is not at the supported Phase 1 schema version.",action:t===ce?"Open the project normally; it is already migrated.":"Use an application version that supports this project schema."})])}function On(t){return{mutation:{accepted:!1,code:"migration-rejected",targetDocument:Ft,currentRevision:"absent",receivedBaseRevision:"absent",retryable:!1,rejectedOperations:[],diagnostics:t},diagnostics:t}}function jh(t){return y({layer:"structural",code:"missing-migration-target",file:t,rule:"A proposed Phase 2 subordinate document is missing.",action:"Restore the proposed document before replacing the manifest."})}function Dh(t){return y({layer:"integrity",severity:"warning",code:"migration-index-invalidation-failed",file:t,rule:"The migration committed, but a derived index could not be removed.",action:"Rebuild project indexes before using the synthesis matrix."})}var zu=F(qa()),Bu=F(Fu()),yi=require("fs"),Lu=F(require("path"));var vi=class{constructor(e,r){this.validators=new Map;let n=Rx(),i=kx(e);for(let[,a]of i)n.addSchema(a);for(let[a,s]of i)this.validators.set(a,n.getSchema(s.$id)??n.compile(s));let o=Uu(r);this.validators.set("nodegraph.schema.json",n.compile(o))}validate(e,r,n){let i=this.validators.get(e);return i?i(r)?[]:(i.errors??[]).map(o=>Ax(n,o)):[Cx(e,n)]}parseJson(e,r){try{return{value:JSON.parse(e),diagnostics:[]}}catch(n){return{diagnostics:[Ox(r,n)]}}}};function Rx(){let t=new zu.default({allErrors:!0,strict:!1});return(0,Bu.default)(t),t}function kx(t){return(0,yi.readdirSync)(t).filter(e=>e.endsWith(".schema.json")).map(e=>[e,Uu(Lu.join(t,e))])}function Uu(t){return JSON.parse((0,yi.readFileSync)(t,"utf8"))}function Cx(t,e){return y({layer:"syntactic",code:"schema-not-found",file:e,rule:`Schema ${t} is unavailable.`,action:"Restore the application schema files and retry."})}function Ax(t,e){return y({layer:"syntactic",code:`schema-${e.keyword}`,file:t,jsonPath:e.instancePath||"/",rule:e.message??"The document does not match its schema.",action:Tx(e)})}function Tx(t){return t.keyword==="required"?"Add the required property shown in the diagnostic.":t.keyword==="additionalProperties"?"Remove the unsupported property.":"Correct the value to match the documented schema."}function Ox(t,e){return y({layer:"syntactic",code:"invalid-json",file:t,rule:e instanceof Error?e.message:"The file is not valid JSON.",action:"Correct the JSON syntax without replacing the existing file."})}var wi=class{constructor(e,r,n,i){this.paths=e;this.schemas=r;this.mutations=n;this.crossDocuments=i}async readBundle(e,r){let n=await this.readBundleDocuments(e,r),i=Nx(n);if(!qx(n))return{diagnostics:i};let o=Vx(n);return i.push(...this.crossDocuments.validate(r,o)),{bundle:o,diagnostics:i}}async readEvidence(e,r){return this.readDocument(e,r.documents.evidence,"evidence-records.schema.json")}async readTaxonomy(e,r){return this.readDocument(e,r.documents.constructs,"construct-taxonomy.schema.json")}async readMethodologies(e,r){if(!r.documents.methodologies)return{diagnostics:[Ga("methodologies")]};let n=await this.readDocument(e,r.documents.methodologies,"methodology-registry.schema.json");if(!n.value)return n;let i=[...n.diagnostics,...this.crossDocuments.validateMethodologies(n.value,r.documents.methodologies)];return R(i)?{diagnostics:i}:{value:n.value,diagnostics:i}}async readExtraction(e,r){return r.extractionPath?this.readDocument(e,r.extractionPath,"extraction.schema.json"):{diagnostics:[Ga(`extraction:${r.paperId}`)]}}validateExtraction(e,r,n,i){return n.extractionPath?this.validateExtractionCandidate(e,r,{key:"extraction",path:n.extractionPath,schema:"extraction.schema.json",auditAction:"extraction.mutated"},i):Promise.resolve([Ga(`extraction:${n.paperId}`)])}async applyMutation(e,r,n,i){let o=Fx(r).find(a=>a.path===n.targetDocument);return o?this.mutations.apply(e,n,{schemaName:o.schema,auditPath:r.documents.auditLog,auditAction:i?.action??o.auditAction,auditObjectId:i?.objectId??n.mutationId,auditMetadata:i?.metadata,validateCandidate:a=>this.validateCandidate(e,r,o,a)}):Bx(n)}async readDocument(e,r,n){let i=await this.paths.resolve(e,r);return mt(i,r,n,this.schemas)}async validateCandidate(e,r,n,i){if(n.key==="extraction")return this.validateExtractionCandidate(e,r,n,i);if(n.key==="methodologies")return this.crossDocuments.validateMethodologies(i,n.path);let o=await this.readBundle(e,r);if(!o.bundle)return o.diagnostics;let a=Hx(o.bundle,n.key,i);return this.crossDocuments.validate(r,a)}async validateExtractionCandidate(e,r,n,i){let[o,a,s]=await Promise.all([this.readEvidence(e,r),this.readTaxonomy(e,r),this.readMethodologies(e,r)]),c=[...o.diagnostics,...a.diagnostics,...s.diagnostics];if(!o.value||!a.value||!s.value)return c;let d=i,u=r.papers.find(l=>l.extractionPath===n.path);return!u||d.paperId!==u.paperId?[...c,zx(n.path)]:[...c,...this.crossDocuments.validateExtraction(r,d,o.value,a.value,s.value)]}async readBundleDocuments(e,r){let[n,i,o,a,s,c]=await Promise.all([this.readDocument(e,r.documents.claims,"synthesis-claims.schema.json"),this.readDocument(e,r.documents.conflicts,"conflicts.schema.json"),this.readDocument(e,r.documents.gaps,"gaps.schema.json"),this.readDocument(e,r.documents.researchQuestions,"research-questions.schema.json"),this.readDocument(e,r.documents.constructs,"construct-taxonomy.schema.json"),this.readDocument(e,r.documents.evidence,"evidence-records.schema.json")]);return{claims:n,conflicts:i,gaps:o,researchQuestions:a,constructs:s,evidence:c}}};function Nx(t){return Object.values(t).flatMap(e=>e.diagnostics)}function qx(t){return Object.values(t).every(e=>e.value!==void 0)}function Vx(t){return{claims:t.claims.value,conflicts:t.conflicts.value,gaps:t.gaps.value,researchQuestions:t.researchQuestions.value,constructs:t.constructs.value,evidence:t.evidence.value}}function Hx(t,e,r){switch(e){case"claims":return{...t,claims:r};case"conflicts":return{...t,conflicts:r};case"gaps":return{...t,gaps:r};case"researchQuestions":return{...t,researchQuestions:r};case"constructs":return{...t,constructs:r};case"evidence":return{...t,evidence:r}}}function Fx(t){return[{key:"claims",path:t.documents.claims,schema:"synthesis-claims.schema.json",auditAction:"synthesis.claims-mutated"},{key:"conflicts",path:t.documents.conflicts,schema:"conflicts.schema.json",auditAction:"synthesis.conflicts-mutated"},{key:"gaps",path:t.documents.gaps,schema:"gaps.schema.json",auditAction:"synthesis.gaps-mutated"},{key:"researchQuestions",path:t.documents.researchQuestions,schema:"research-questions.schema.json",auditAction:"synthesis.questions-mutated"},{key:"constructs",path:t.documents.constructs,schema:"construct-taxonomy.schema.json",auditAction:"taxonomy.constructs-mutated"},...t.documents.methodologies?[{key:"methodologies",path:t.documents.methodologies,schema:"methodology-registry.schema.json",auditAction:"taxonomy.methodologies-mutated"}]:[],{key:"evidence",path:t.documents.evidence,schema:"evidence-records.schema.json",auditAction:"evidence.records-mutated"},...t.papers.flatMap(e=>e.extractionPath?[{key:"extraction",path:e.extractionPath,schema:"extraction.schema.json",auditAction:"extraction.mutated"}]:[])]}function Ga(t){return{layer:"syntactic",severity:"error",code:"phase2-document-not-registered",file:"project.nodegraph.json",objectId:t,rule:"The Phase 2 authoritative document is not registered.",action:"Run the explicit Phase 2 project migration."}}function zx(t){return{layer:"structural",severity:"error",code:"extraction-paper-mismatch",file:t,rule:"The extraction paper ID does not match its manifest registration.",action:"Use the extraction document registered for the selected paper."}}function Bx(t){return{accepted:!1,code:"unsupported-mutation-target",targetDocument:t.targetDocument,currentRevision:t.baseRevision,receivedBaseRevision:t.baseRevision,retryable:!1,rejectedOperations:t.operations}}var Ku=require("crypto");var xi=class{constructor(e,r,n,i=ve){this.synthesis=e;this.resolver=r;this.reviews=n;this.clock=i}listApproved(e){return e.constructs.filter(r=>r.status==="approved")}resolveCanonicalId(e,r,n){return this.resolver.resolve(e,r,n)}resolveAlias(e,r,n){return this.resolver.resolveTerm(e,r,n)}findLikelyDuplicates(e,r){let n=ee(r);return e.constructs.filter(i=>[i.canonicalName,...i.aliases].some(o=>Ux(n,ee(o))))}async proposeConstruct(e,r,n,i,o){let a=await this.synthesis.readTaxonomy(e,r);if(!a.value)return{mutation:qe(r.documents.constructs,i,a.diagnostics)};let s=this.findLikelyDuplicates(a.value,n.canonicalName),c={...a.value,constructs:[...a.value.constructs,{...n,...n.definition?{definition:n.definition}:{},aliases:[],status:"proposed",reviewState:Ye(o.type==="agent"?"ai":"human")}],modified:this.clock.now()};return{mutation:await this.applyTaxonomy(e,r,c,i,o,"taxonomy.construct-proposed",n.constructId),duplicateCandidates:s}}reviewConstruct(e,r,n,i,o,a){return a.type!=="human"?Promise.resolve(Kr(r.documents.constructs,o,n)):this.updateConstruct(e,r,n,o,a,`taxonomy.construct-${i}`,(s,c)=>{let d=this.reviews.transitionResearcherApproval(c.reviewState,i,a,r.documents.constructs);return d.value?(c.reviewState=d.value,i==="approved"&&(c.status="approved"),s.taxonomyVersion+=1,[]):d.diagnostics})}mergeConstructs(e,r,n,i,o,a){return a.type!=="human"?Promise.resolve(Kr(r.documents.constructs,o,n)):this.updateTaxonomy(e,r,o,a,"taxonomy.construct-merged",n,s=>Lx(s,n,i),{deprecatedConstructId:n,primaryConstructId:i})}async proposeMapping(e,r,n,i,o,a){return this.updateExtraction(e,r,n,o,a,"taxonomy.mapping-proposed",i.mappingId,s=>{let c={...i,...i.constructId?{constructId:i.constructId}:{},mappingStatus:i.constructId?"pending":"unmapped",reviewState:Ye(a.type==="agent"?"ai":"human")};return s.constructMappings.push(c),s.fields.keyConstructs={reportingStatus:"present",mappingIds:[...s.fields.keyConstructs.mappingIds??[],i.mappingId]},[]})}reviewMapping(e,r,n,i,o,a,s){return s.type!=="human"?Promise.resolve(Kr(Wu(r,n),a,i)):this.updateExtraction(e,r,n,a,s,`taxonomy.mapping-${o}`,i,async(c,d)=>{let u=c.constructMappings.find(p=>p.mappingId===i);if(!u)return[Yu(i,d)];if(o==="approved"){let p=await this.synthesis.readTaxonomy(e,r);if(!p.value)return p.diagnostics;if(!u.constructId)return[Kx(i,d)];let h=this.resolver.resolve(p.value,u.constructId,d);if(!h.constructId)return h.diagnostics;u.constructId=h.constructId}let l=this.reviews.transitionResearcherApproval(u.reviewState,o,s,d);return l.value?(u.reviewState=l.value,u.mappingStatus=o,[]):l.diagnostics})}remapConstruct(e,r,n,i,o,a,s){return s.type!=="human"?Promise.resolve(Kr(Wu(r,n),a,i)):this.updateExtraction(e,r,n,a,s,"taxonomy.mapping-remapped",i,async(c,d)=>{let u=c.constructMappings.find(h=>h.mappingId===i);if(!u)return[Yu(i,d)];let l=await this.synthesis.readTaxonomy(e,r);if(!l.value)return l.diagnostics;let p=this.resolver.resolve(l.value,o,d);return p.constructId?(u.constructId=p.constructId,u.mappingStatus="approved",[]):p.diagnostics})}listApprovedParadigms(e){return e.paradigms.filter(r=>r.status==="approved")}async proposeParadigm(e,r,n,i,o,a){let s=await this.synthesis.readMethodologies(e,r);if(!s.value||!r.documents.methodologies)return qe(r.documents.methodologies??"methodologies",o,s.diagnostics);let c={...s.value,paradigms:[...s.value.paradigms,{paradigmId:n,label:i,aliases:[],status:"proposed",reviewState:Ye(a.type==="agent"?"ai":"human")}],modified:this.clock.now()};return this.applyMethodologies(e,r,c,o,a,"taxonomy.paradigm-proposed",n)}async reviewParadigm(e,r,n,i,o,a){if(a.type!=="human")return Kr(r.documents.methodologies??"methodologies",o,n);let s=await this.synthesis.readMethodologies(e,r);if(!s.value||!r.documents.methodologies)return qe(r.documents.methodologies??"methodologies",o,s.diagnostics);let c=s.value.paradigms.find(l=>l.paradigmId===n);if(!c)return qe(r.documents.methodologies,o,[Xx(n,r.documents.methodologies)]);let d=this.reviews.transitionResearcherApproval(c.reviewState,i,a,r.documents.methodologies);if(!d.value)return qe(r.documents.methodologies,o,d.diagnostics);let u={...s.value,registryVersion:s.value.registryVersion+1,paradigms:s.value.paradigms.map(l=>l.paradigmId!==n?l:{...l,status:i==="approved"?"approved":"proposed",reviewState:d.value}),modified:this.clock.now()};return this.applyMethodologies(e,r,u,o,a,`taxonomy.paradigm-${i}`,n)}async updateConstruct(e,r,n,i,o,a,s){return this.updateTaxonomy(e,r,i,o,a,n,c=>{let d=c.constructs.find(u=>u.constructId===n);return d?s(c,d):[Xu(n,r.documents.constructs)]})}async updateTaxonomy(e,r,n,i,o,a,s,c){let d=await this.synthesis.readTaxonomy(e,r);if(!d.value)return qe(r.documents.constructs,n,d.diagnostics);let u=structuredClone(d.value),l=s(u);return l.length?qe(r.documents.constructs,n,l):(u.modified=this.clock.now(),this.applyTaxonomy(e,r,u,n,i,o,a,c))}async updateExtraction(e,r,n,i,o,a,s,c){let d=r.papers.find(h=>h.paperId===n);if(!d?.extractionPath)return qe("project.nodegraph.json",i,[Jx(n)]);let u=await this.synthesis.readExtraction(e,d);if(!u.value)return qe(d.extractionPath,i,u.diagnostics);let l=structuredClone(u.value),p=await c(l,d.extractionPath);return p.length?qe(d.extractionPath,i,p):(l.modified=this.clock.now(),this.applyExtraction(e,r,l,d.extractionPath,i,o,a,s))}applyTaxonomy(e,r,n,i,o,a,s,c){return this.applyRootMutation(e,r,r.documents.constructs,n,i,o,a,s,c)}applyMethodologies(e,r,n,i,o,a,s){return this.applyRootMutation(e,r,r.documents.methodologies,n,i,o,a,s)}applyExtraction(e,r,n,i,o,a,s,c){return this.applyRootMutation(e,r,i,n,o,a,s,c)}applyRootMutation(e,r,n,i,o,a,s,c,d){return this.synthesis.applyMutation(e,r,{mutationId:`mutation_${(0,Ku.randomUUID)().replace(/-/g,"")}`,targetDocument:n,baseRevision:o,operations:[{op:"replace",path:"",value:i}],requestedAt:this.clock.now(),actor:a},{action:s,objectId:c,metadata:d})}};function Lx(t,e,r){let n=t.constructs.find(o=>o.constructId===e),i=t.constructs.find(o=>o.constructId===r);return n?e===r?[Yx(e)]:Gu(n)?!i||!Gu(i)?[Gx(r)]:(i.aliases=hr([...i.aliases,n.canonicalName,...n.aliases]),n.status="deprecated",n.primaryConstructId=r,t.taxonomyVersion+=1,[]):[Wx(e)]:[Xu(e,"taxonomy/constructs.json")]}function Gu(t){return t.status==="approved"&&t.reviewState.approval.researcher==="approved"}function Ux(t,e){return!t||!e?!1:t===e||t.includes(e)||e.includes(t)}function qe(t,e,r){return{accepted:!1,code:"taxonomy-operation-rejected",targetDocument:t,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:r}}function Kr(t,e,r){return qe(t,e,[y({layer:"structural",code:"researcher-authority-required",file:t,objectId:r,rule:"Only a researcher can approve, reject, merge, or remap taxonomy records.",action:"Submit the change as a proposal for researcher review."})])}function Wu(t,e){return t.papers.find(r=>r.paperId===e)?.extractionPath??"project.nodegraph.json"}function Xu(t,e){return y({layer:"structural",code:"construct-not-found",file:e,objectId:t,rule:"The requested construct does not exist.",action:"Refresh the taxonomy and choose an existing construct."})}function Gx(t){return y({layer:"structural",code:"primary-construct-not-active",file:"taxonomy/constructs.json",objectId:t,rule:"A merge target must be an approved construct.",action:"Approve the primary construct before merging."})}function Wx(t){return y({layer:"structural",code:"construct-merge-source-not-approved",file:"taxonomy/constructs.json",objectId:t,rule:"Only an active researcher-approved construct can be deprecated by a merge.",action:"Approve the source construct, or choose another active construct."})}function Yx(t){return y({layer:"structural",code:"self-referential-primary",file:"taxonomy/constructs.json",objectId:t,rule:"A construct cannot be merged into itself.",action:"Choose a distinct approved primary construct."})}function Yu(t,e){return y({layer:"structural",code:"mapping-not-found",file:e,objectId:t,rule:"The requested construct mapping does not exist.",action:"Refresh the extraction and choose an existing mapping."})}function Kx(t,e){return y({layer:"structural",code:"mapping-target-required",file:e,objectId:t,rule:"An approved mapping requires a construct target.",action:"Choose an approved construct before approving the mapping."})}function Xx(t,e){return y({layer:"structural",code:"paradigm-not-found",file:e,objectId:t,rule:"The requested paradigm does not exist.",action:"Refresh the methodology registry and choose an existing paradigm."})}function Jx(t){return y({layer:"structural",code:"phase2-document-not-registered",file:"project.nodegraph.json",objectId:t,rule:"The paper has no registered extraction document.",action:"Migrate the project or register the paper again."})}var Qu=require("crypto");var bi=class{constructor(e,r,n,i,o=ve){this.paths=e;this.synthesis=r;this.integrity=n;this.reviews=i;this.clock=o}async sourceQueue(e,r){let n=await this.synthesis.readEvidence(e,r);if(!n.value)return{items:[],diagnostics:n.diagnostics};let i=await this.referencedEvidence(e,r),o=await this.inspectSources(e,r),a=[...n.diagnostics,...i.diagnostics,...o.diagnostics],s=new Map(r.papers.map(d=>[d.paperId,d]));return{items:n.value.evidence.filter(d=>i.ids.has(d.evidenceId)).filter(d=>d.reviewState.verification.source!=="verified").map(d=>{let u=s.get(d.paperId);return{evidenceId:d.evidenceId,paperId:d.paperId,sourcePath:u?.source.relativePath??d.source.relativePath,quote:d.quote.text,page:d.locator.page,state:d.reviewState.verification.source,stale:d.reviewState.verification.source==="stale"||o.stalePaperIds.has(d.paperId)}}),diagnostics:a}}async sourceNavigation(e,r,n){let i=await this.synthesis.readEvidence(e,r);if(!i.value)return{diagnostics:i.diagnostics};let o=i.value.evidence.find(s=>s.evidenceId===n);if(!o)return{diagnostics:[Ju(n)]};let a=r.papers.find(s=>s.paperId===o.paperId&&s.source.sourceId===o.source.sourceId);if(!a)return{diagnostics:[eb(o)]};try{return{sourcePath:await this.paths.resolve(e,a.source.relativePath,!0),quote:o.quote.text,page:o.locator.page,diagnostics:i.diagnostics}}catch{return{diagnostics:[Zx(a.source.relativePath,n)]}}}async updateSourceVerification(e,r,n,i,o,a){let s=await this.synthesis.readEvidence(e,r);if(!s.value)return _t(r.documents.evidence,o,s.diagnostics);let c=structuredClone(s.value),d=c.evidence.find(l=>l.evidenceId===n);if(!d)return _t(r.documents.evidence,o,[Ju(n)]);let u=this.reviews.transitionVerification(d.reviewState,"source",i,a,r.documents.evidence);return u.value?(d.reviewState=u.value,d.modified=this.clock.now(),c.modified=this.clock.now(),this.applyRoot(e,r,r.documents.evidence,c,o,a,`verification.source-${i}`,n)):_t(r.documents.evidence,o,u.diagnostics)}updateFindingVerification(e,r,n,i,o,a,s,c){return this.updateExtractionReview(e,r,n,i,o,a,s,c,d=>d.fields.findings.items?.find(u=>u.findingId===i),"finding")}updateMappingClassification(e,r,n,i,o,a,s){return this.updateExtractionReview(e,r,n,i,"classification",o,a,s,c=>c.constructMappings.find(d=>d.mappingId===i),"mapping")}async updateExtractionReview(e,r,n,i,o,a,s,c,d,u){let l=r.papers.find(g=>g.paperId===n);if(!l?.extractionPath)return _t("project.nodegraph.json",s,[tb(n)]);let p=await this.synthesis.readExtraction(e,l);if(!p.value)return _t(l.extractionPath,s,p.diagnostics);let h=structuredClone(p.value),m=d(h);if(!m)return _t(l.extractionPath,s,[rb(i,u,l.extractionPath)]);let f=this.reviews.transitionVerification(m.reviewState,o,a,c,l.extractionPath);return f.value?(m.reviewState=f.value,h.modified=this.clock.now(),this.applyRoot(e,r,l.extractionPath,h,s,c,`verification.${u}-${o}-${a}`,i)):_t(l.extractionPath,s,f.diagnostics)}async referencedEvidence(e,r){let n=[],i=new Set;for(let o of r.papers){let a=await this.synthesis.readExtraction(e,o);n.push(...a.diagnostics),a.value&&Qx(a.value).forEach(s=>i.add(s))}return{ids:i,diagnostics:n}}async inspectSources(e,r){let n=[];for(let i of r.papers)n.push({paperId:i.paperId,result:await this.integrity.inspectSource(e,i)});return{stalePaperIds:new Set(n.filter(i=>i.result.diagnostics.length>0).map(i=>i.paperId)),diagnostics:n.flatMap(i=>i.result.diagnostics)}}applyRoot(e,r,n,i,o,a,s,c){return this.synthesis.applyMutation(e,r,{mutationId:`mutation_${(0,Qu.randomUUID)().replace(/-/g,"")}`,targetDocument:n,baseRevision:o,operations:[{op:"replace",path:"",value:i}],requestedAt:this.clock.now(),actor:a},{action:s,objectId:c})}};function Qx(t){return[...new Set([...t.fields.exactEvidenceQuotations.evidenceIds,...(t.fields.findings.items??[]).flatMap(e=>e.evidenceIds),...t.constructMappings.flatMap(e=>e.evidenceIds)])]}function _t(t,e,r){return{accepted:!1,code:"verification-rejected",targetDocument:t,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:r}}function Ju(t){return y({layer:"structural",code:"missing-evidence-reference",file:"evidence/records.json",objectId:t,rule:"The requested authoritative evidence record does not exist.",action:"Refresh the verification queue and choose an existing record."})}function Zx(t,e){return y({layer:"integrity",severity:"warning",code:"missing-source-file",file:t,objectId:e,rule:"The evidence source cannot be opened.",action:"Restore the registered PDF before verifying the quotation."})}function eb(t){return y({layer:"structural",code:"source-registration-mismatch",file:"project.nodegraph.json",objectId:t.evidenceId,rule:"The evidence source does not match a registered paper source.",action:"Restore the source registration before opening this evidence."})}function tb(t){return y({layer:"structural",code:"phase2-document-not-registered",file:"project.nodegraph.json",objectId:t,rule:"The registered paper has no extraction document.",action:"Run the Phase 2 migration before verification."})}function rb(t,e,r){return y({layer:"structural",code:`${e}-not-found`,file:r,objectId:t,rule:`The requested ${e} does not exist in the extraction.`,action:"Refresh the extraction and choose an existing record."})}function Zu(t){let e=t.clock??ve,r=new mn,n=nb(t.extensionRoot),i=t.writer??new on,o=new sn(r,n,e),a=new En(r,n),s=new An,c=new xn(r,n,i,o,s),d=new cn,u=new dn(d),l=new wi(r,n,c,u),p=new yn(r,a,l,o),h=new Mn(r,n,i,c,e),m=new gn(r,n,i,o,a,l,p,e),f=new Cn(a,l,d),g=new Tn(r,n,i,c,e),v=new un(n,l),I=new xi(l,d,s,e),b=new bi(r,l,p,s,e),S=new In;return{paths:r,schemas:n,audit:o,papers:a,registry:h,synthesis:l,integrity:p,indexes:m,queries:f,reviews:s,migrations:g,extractions:v,taxonomy:I,verification:b,csv:S}}function nb(t){return new vi(Wa.join(t,"docs","schemas"),Wa.join(t,"schema","nodegraph.schema.json"))}var Pi=F(require("path"));var ae=class extends Error{constructor(r,n,i=[],o){super(n);this.code=r;this.diagnostics=i;this.cause=o}},el={type:"human",id:"researcher"},Ii=class{constructor(e){this.runtime=e}create(e,r,n){return this.runtime.registry.create(e,r,n)}open(e){return this.runtime.papers.resetInstrumentation(),this.runtime.registry.open(e)}async validate(e){let r=await this.open(e);if(!r.manifest)return{valid:!1,diagnostics:r.diagnostics};let n=await this.runtime.integrity.validate(Pi.dirname(e),r.manifest),i=[...r.diagnostics,...n.diagnostics];return{valid:!R(i),diagnostics:i}}async rebuildIndexes(e,r=!1){let n=await this.openWritableProject(e);return this.runtime.indexes.rebuild(n.root,n.opened.manifest,r)}async search(e,r){let n=await this.open(e);return n.paperIndex?this.runtime.queries.search(n.paperIndex,r):[]}async registerPaper(e,r,n=el){let i=await this.openWritableProject(e),o=await this.buildRegistration(i.root,r),a=await this.runtime.registry.registerPaper(i.root,i.opened.manifest,o,i.opened.manifestRevision,n);return a.accepted?this.rebuildAfterMutation(e,a):{mutation:a,diagnostics:a.diagnostics??[]}}async unregisterPaper(e,r,n=el){let i=await this.openWritableProject(e),o=await this.runtime.registry.unregisterPaper(i.root,i.opened.manifest,r,i.opened.manifestRevision,n);return o.accepted?this.rebuildAfterMutation(e,o):{mutation:o,diagnostics:o.diagnostics??[]}}async openWritableProject(e){let r=await this.open(e);if(!r.manifest||!r.manifestRevision)throw new ae("project-manifest-invalid","The project manifest is invalid.",r.diagnostics);if(r.mode==="read-only")throw new ae("project-read-only","The project is read-only until its reported errors are corrected.",r.diagnostics);return{root:Pi.dirname(e),opened:{...r,manifest:r.manifest,manifestRevision:r.manifestRevision}}}async buildRegistration(e,r){let n=ib(r),i=await this.readRegistrationGraph(e,n);if(!i.graph||R(i.diagnostics))throw new ae("invalid-paper-graph","The paper graph cannot be registered until its errors are corrected.",i.diagnostics);let o=await this.buildSource(e,r,i.graph);return{paperId:r.paperId,path:r.paperPath,source:o,extractionPath:`extractions/${r.paperId}.json`}}async readRegistrationGraph(e,r){try{return await this.runtime.papers.read(e,r)}catch(n){throw sb(n,r.path)}}async buildSource(e,r,n){let i=await this.identifySource(e,r,n.source?.pdf);return{sourceId:r.sourceId,...i,...n.source?.doi?{doi:n.source.doi}:{},title:n.title,...r.sourceVersion?{version:r.sourceVersion}:{}}}async identifySource(e,r,n){try{if(r.sourcePath)return await this.runtime.integrity.identifyProjectSource(e,r.sourcePath);if(!n)throw ob(r.paperPath);return await this.runtime.integrity.identifyPaperSource(e,r.paperPath,n)}catch(i){throw i instanceof ae?i:ab(i,r.sourcePath??n??r.paperPath)}}async rebuildAfterMutation(e,r){let n=await this.open(e);if(!n.manifest)return{mutation:r,project:n,diagnostics:n.diagnostics};try{let i=await this.runtime.indexes.rebuild(Pi.dirname(e),n.manifest);return{mutation:r,indexes:i,project:n,diagnostics:i.diagnostics}}catch(i){let o=Ya(i);return{mutation:r,project:n,diagnostics:o.diagnostics,indexFailure:o}}}};function ib(t){return{paperId:t.paperId,path:t.paperPath,source:{sourceId:t.sourceId,relativePath:t.sourcePath??t.paperPath,sourceDocumentHash:`sha256:${"0".repeat(64)}`}}}function ob(t){return new ae("paper-source-path-required","The paper graph does not identify its source PDF.",[y({layer:"structural",code:"paper-source-path-required",file:t,rule:"A registered paper must identify a source PDF.",action:"Add source.pdf to the paper graph or provide a project-relative source path."})])}function ab(t,e){let r=t instanceof te?t.code:void 0,n=de(t,"ENOENT"),i=r??(n?"missing-source-file":"inaccessible-source-file");return new ae(i,"The paper source could not be registered.",[y({layer:r?"structural":"integrity",code:i,file:e,rule:r?"The source path is not a contained project-relative path.":"The source PDF cannot be read.",action:r?"Choose a PDF inside the project and use its project-relative path.":"Restore read access to the source PDF before registering the paper."})],t)}function sb(t,e){let r=t instanceof te?t.code:void 0,n=de(t,"ENOENT"),i=r??(n?"missing-paper-file":"inaccessible-paper-file");return new ae(i,"The paper graph could not be registered.",[y({layer:r?"structural":"integrity",code:i,file:e,rule:r?"The paper graph path is not a contained project-relative path.":"The paper graph cannot be read.",action:r?"Choose a paper graph inside the project.":"Restore read access to the paper graph before registering it."})],t)}function Ya(t){return new ae("index-rebuild-failed","The authoritative mutation committed, but its derived indexes could not be rebuilt.",[y({layer:"integrity",code:"index-rebuild-failed",file:"indexes",rule:"The authoritative mutation committed, but its derived indexes could not be rebuilt.",action:"Correct the reported file problem and rebuild the disposable indexes."})],t)}var Me=F(require("path")),z=F(require("vscode"));function rl(t,e){let r=z.window.createOutputChannel("NodeGraph Projects");t.subscriptions.push(r,z.commands.registerCommand("nodegraph.project.create",n=>Pe(r,()=>cb(e,r,n))),z.commands.registerCommand("nodegraph.project.open",n=>Pe(r,()=>db(e,r,n))),z.commands.registerCommand("nodegraph.project.registerPaper",n=>Pe(r,()=>ub(e,r,n))),z.commands.registerCommand("nodegraph.project.unregisterPaper",n=>Pe(r,()=>lb(e,r,n))),z.commands.registerCommand("nodegraph.project.validate",n=>Pe(r,()=>pb(e,r,n))),z.commands.registerCommand("nodegraph.project.rebuildIndexes",n=>Pe(r,()=>fb(e,r,n))),z.commands.registerCommand("nodegraph.project.search",n=>Pe(r,()=>hb(e,r,n))))}async function cb(t,e,r){let n=r??await mb("Choose a folder for the NodeGraph project");if(!n)return;let i=await z.window.showInputBox({prompt:"Project ID",value:`project_${Me.basename(n.fsPath).replace(/[^A-Za-z0-9_-]/g,"_")}`,validateInput:wb});if(!i)return;let o=await z.window.showInputBox({prompt:"Project title"});if(!o)return;let a=await t.create(n.fsPath,i,o);Ka(e,a)}async function db(t,e,r){let n=await Ee(r);n&&Ka(e,await t.open(n.fsPath))}async function ub(t,e,r){let n=await Ee(r);if(!n)return;let i=await gb(Me.dirname(n.fsPath));if(!i)return;let o=await z.window.showInputBox({prompt:"Stable paper ID",value:`paper_${Me.basename(i.fsPath,".nodegraph.json").replace(/[^A-Za-z0-9_-]/g,"_")}`,validateInput:d=>/^paper_[A-Za-z0-9_-]+$/.test(d)?void 0:"Use paper_<letters, numbers, _ or ->"});if(!o)return;let a=await z.window.showInputBox({prompt:"Stable source ID",value:`source_${o.slice(6)}`,validateInput:d=>/^source_[A-Za-z0-9_-]+$/.test(d)?void 0:"Use source_<letters, numbers, _ or ->"});if(!a)return;let s=xb(Me.dirname(n.fsPath),i.fsPath),c=await t.registerPaper(n.fsPath,{paperId:o,paperPath:s,sourceId:a});nl(e,c)}async function lb(t,e,r){let n=await Ee(r);if(!n)return;let i=await t.open(n.fsPath);if(!i.manifest)return Ka(e,i);let o=await z.window.showQuickPick(i.manifest.papers.map(s=>({label:tl(s.paperId),description:tl(s.path),paperId:s.paperId})),{placeHolder:"Choose a paper registration to remove"});if(!o)return;let a=await t.unregisterPaper(n.fsPath,o.paperId);nl(e,a)}async function pb(t,e,r){let n=await Ee(r);if(!n)return;let i=await t.validate(n.fsPath);Ve(e,i.diagnostics),z.window.showInformationMessage(i.valid?"NodeGraph project validation passed.":"NodeGraph project validation found errors.")}async function fb(t,e,r){let n=await Ee(r);if(!n)return;let i=await t.rebuildIndexes(n.fsPath,!0);Ve(e,i.diagnostics),e.appendLine(`Processed: ${i.processedPaperIds.length}; reused: ${i.reusedPaperIds.length}; removed: ${i.removedPaperIds.length}`),e.show(!0)}async function hb(t,e,r){let n=await Ee(r);if(!n)return;let i=await z.window.showInputBox({prompt:"Search indexed paper metadata"});if(i===void 0)return;let o=await t.search(n.fsPath,{text:i});e.appendLine(`Search results: ${o.length}`);for(let a of o)e.appendLine(`${X(a.paperId)} | ${X(a.title)} | ${X(a.paperPath)}`);e.show(!0)}async function Ee(t){return t?.fsPath.endsWith("project.nodegraph.json")?t:(await z.window.showOpenDialog({canSelectMany:!1,filters:{"NodeGraph Project":["json"]},title:"Open project.nodegraph.json"}))?.[0]}async function mb(t){return(await z.window.showOpenDialog({canSelectFolders:!0,canSelectFiles:!1,canSelectMany:!1,title:t}))?.[0]}async function gb(t){return(await z.window.showOpenDialog({canSelectMany:!1,defaultUri:z.Uri.file(Me.join(t,"papers")),filters:{"NodeGraph Paper":["json"]},title:"Register a .nodegraph.json paper"}))?.[0]}async function Pe(t,e){try{await e()}catch(r){vb(t,r)}}function Ka(t,e){e.manifest&&(t.appendLine(`${X(e.manifest.title)} (${X(e.manifest.projectId)})`),t.appendLine(`Mode: ${e.mode}; registered papers: ${e.manifest.papers.length}; hydrated papers: ${e.hydrationCount}`)),Ve(t,e.diagnostics),t.show(!0)}function nl(t,e){t.appendLine(e.mutation.accepted?"Mutation accepted.":"Mutation rejected."),Ve(t,e.diagnostics),t.show(!0)}function vb(t,e){e instanceof ae?(t.appendLine(`[error] ${X(e.code)} | ${X(e.message)}`),Ve(t,e.diagnostics)):e instanceof Se?t.appendLine(`[error] ${e.code} | ${X(e.targetDocument)} | committed revision ${X(e.resultingRevision)}`):e instanceof tt?(t.appendLine(`[error] ${X(e.code)} | audit log is not writable`),Ve(t,e.diagnostics)):t.appendLine(`[error] unexpected-project-error | ${X(il(e))}`),t.show(!0),z.window.showErrorMessage(yb(e))}function yb(t){return t instanceof Se?"NodeGraph saved the document, but could not record its audit event. Further writes are blocked until the audit log is repaired.":t instanceof tt?"NodeGraph project operation failed: repair or restore the audit log before writing.":t instanceof ae?`NodeGraph project operation failed: ${X(t.message)}`:`NodeGraph project operation failed: ${X(il(t))}`}function Ve(t,e){for(let r of e)t.appendLine(`[${r.severity}] ${X(r.code)} | ${X(r.file)} | ${X(r.rule)} | ${X(r.action)}`)}function wb(t){return/^project_[A-Za-z0-9_-]+$/.test(t)?void 0:"Use project_<letters, numbers, _ or ->"}function xb(t,e){return Me.relative(t,e).split(Me.sep).join("/")}function tl(t){return X(t).replace(/\$\(/g,"\uFF04(")}function X(t){return t.replace(/[\u0000-\u001f\u007f]/g," ")}function il(t){return t instanceof Error?t.message:String(t)}var L=F(require("vscode"));var ol=F(require("path")),Re=F(require("vscode"));var Ei=class t{constructor(e,r,n,i){this.context=e;this.service=r;this.manifestPath=n;this.panel=i}static{this.panels=new Map}static open(e,r,n){let i=ol.resolve(n),o=t.panels.get(i);if(o){o.panel.reveal(Re.ViewColumn.One,!1);return}let a=bb(e),s=new t(e,r,i,a);t.panels.set(i,s),s.register()}register(){this.panel.webview.html=Ib(this.panel.webview);let e=this.panel.webview.onDidReceiveMessage(n=>this.handleMessage(n)),r=ke.onDidSelectNode(n=>this.handleGraphSelection(n.paperPath,n.nodeId));this.panel.onDidDispose(()=>{e.dispose(),r.dispose(),t.panels.delete(this.manifestPath)})}async handleMessage(e){try{e.type==="ready"&&await this.refresh({}),e.type==="filter"&&await this.refresh(Xa(e.filters)),e.type==="openCell"&&await this.openCell(e.paperId,e.constructId),e.type==="openEvidence"&&await this.openEvidence(e.evidenceId),e.type==="focusGraph"&&await this.focusGraph(e.paperId,e.nodeId),e.type==="exportCsv"&&await this.exportCsv(Xa(e.filters)),e.type==="verifySource"&&await this.verifySource(e),e.type==="verifyFinding"&&await this.verifyFinding(e),e.type==="verifyMapping"&&await this.verifyMapping(e),e.type==="reviewMapping"&&await this.reviewMapping(e)}catch(r){this.postProblem(Pb(r))}}async refresh(e){let r=await this.service.openMatrix(this.manifestPath,e);this.postDiagnostics(r.diagnostics),this.panel.webview.postMessage({type:"matrix",matrix:r.matrix,hydrationCount:r.hydrationCount})}async openCell(e,r){let n=await this.service.hydrateCell(this.manifestPath,e,r);if(!n){this.postProblem("The selected matrix detail is missing or invalid.");return}this.postDiagnostics(n.diagnostics),this.panel.webview.postMessage({type:"detail",detail:n})}async openEvidence(e){let r=await this.service.sourceNavigation(this.manifestPath,e);if(this.postDiagnostics(r.diagnostics),!r.sourcePath||!r.quote){this.postProblem("The source PDF or quotation is unavailable.");return}await Ze.openAndSearch(this.context,Re.Uri.file(r.sourcePath),r.quote,r.page)}async focusGraph(e,r){let n=await this.service.paperGraphTarget(this.manifestPath,e);n&&ke.focusNode(n,r)||this.postProblem("Open the registered paper graph before focusing this evidence node.")}async handleGraphSelection(e,r){let n=await this.service.locateMatrixCell(this.manifestPath,e,r);if(n){this.panel.webview.postMessage({type:"focusCell",cell:n});return}this.postProblem("The selected graph node has no stable mapping in the current matrix.")}async exportCsv(e){let r=await this.service.exportCsv(this.manifestPath,e);if(this.postDiagnostics(r.diagnostics),!r.csv)return;let n=await Re.window.showSaveDialog({filters:{CSV:["csv"]},saveLabel:"Export matrix",title:"Export NodeGraph synthesis matrix"});n&&(await Re.workspace.fs.writeFile(n,Buffer.from(r.csv,"utf8")),Re.window.showInformationMessage(`Matrix exported: ${n.fsPath}`))}async verifySource(e){let r=await this.service.verifySource(this.manifestPath,e.evidenceId,e.state);await this.refreshAfterReview(e,r)}async verifyFinding(e){let r=await this.service.verifyFinding(this.manifestPath,e.paperId,e.findingId,e.dimension,e.state);await this.refreshAfterReview(e,r)}async verifyMapping(e){let r=await this.service.verifyMappingClassification(this.manifestPath,e.paperId,e.mappingId,e.state);await this.refreshAfterReview(e,r)}async reviewMapping(e){let r=await this.service.reviewMapping(this.manifestPath,e.paperId,e.mappingId,e.decision);await this.refreshAfterReview(e,r)}async refreshAfterReview(e,r){if(this.postDiagnostics(r.diagnostics),!r.mutation.accepted){this.postProblem(`Review was rejected: ${r.mutation.code}`);return}await this.refresh(Xa(e.filters)),await this.openCell(e.paperId,e.constructId)}postDiagnostics(e){this.panel.webview.postMessage({type:"diagnostics",diagnostics:e})}postProblem(e){this.panel.webview.postMessage({type:"problem",message:e})}};function bb(t){let e=Re.window.createWebviewPanel("nodegraph.synthesisMatrix","NodeGraph Synthesis Matrix",Re.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});return e.iconPath=Re.Uri.joinPath(t.extensionUri,"resources","icon-hires.png"),e}function Xa(t){let e={};$t(e,"paper",t.paper),$t(e,"constructId",t.constructId),$t(e,"paradigm",t.paradigm),$t(e,"approach",t.approach),$t(e,"technique",t.technique),$t(e,"population",t.population),$t(e,"verification",t.verification);let r=Number(t.publicationYear);return Number.isInteger(r)&&r>0&&(e.publicationYear=r),e}function $t(t,e,r){typeof r=="string"&&r.trim()&&Object.assign(t,{[e]:r.trim()})}function Pb(t){return t instanceof Error?t.message:String(t)}function Ib(t){let e=Mt();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${e}'; style-src 'nonce-${e}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NodeGraph Synthesis Matrix</title>
  <style nonce="${e}">
    * { box-sizing: border-box; }
    body { margin: 0; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); }
    button, input, select { color: inherit; background: var(--vscode-input-background); border: 1px solid var(--vscode-input-border, transparent); padding: 6px 8px; }
    button { cursor: pointer; background: var(--vscode-button-secondaryBackground); }
    button:hover { background: var(--vscode-button-secondaryHoverBackground); }
    #toolbar { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; padding: 10px; border-bottom: 1px solid var(--vscode-panel-border); }
    #status { min-height: 28px; padding: 6px 10px; color: var(--vscode-descriptionForeground); }
    #layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; height: calc(100vh - 104px); }
    #matrixScroll { overflow: auto; }
    table { border-collapse: separate; border-spacing: 0; width: max-content; min-width: 100%; }
    th, td { min-width: 145px; border-right: 1px solid var(--vscode-panel-border); border-bottom: 1px solid var(--vscode-panel-border); padding: 7px; text-align: left; vertical-align: top; }
    th { position: sticky; top: 0; z-index: 2; background: var(--vscode-editorWidget-background); }
    th:first-child, td:first-child { position: sticky; left: 0; z-index: 1; min-width: 210px; background: var(--vscode-editorWidget-background); }
    th:first-child { z-index: 3; }
    .cell { width: 100%; min-height: 58px; text-align: left; border-left: 4px solid transparent; }
    .cell.pending, .cell.unmapped { border-left-color: var(--vscode-editorWarning-foreground); }
    .cell.stale, .cell.invalid { border-left-color: var(--vscode-editorError-foreground); }
    .cell.extracted { border-left-color: var(--vscode-testing-iconPassed); }
    .cell.focused { outline: 2px solid var(--vscode-focusBorder); }
    .subtle { color: var(--vscode-descriptionForeground); font-size: 0.9em; }
    #detail { overflow: auto; padding: 12px; border-left: 1px solid var(--vscode-panel-border); background: var(--vscode-sideBar-background); }
    #detail h2, #detail h3 { margin: 8px 0; }
    #detail article { padding: 8px 0; border-bottom: 1px solid var(--vscode-panel-border); white-space: pre-wrap; }
    #diagnostics { color: var(--vscode-editorWarning-foreground); }
    @media (max-width: 850px) { #layout { grid-template-columns: 1fr; } #detail { display: none; } }
  </style>
</head>
<body>
  <form id="toolbar">
    <input id="paper" placeholder="Paper or author">
    <input id="constructId" placeholder="Construct ID">
    <input id="paradigm" placeholder="Paradigm">
    <input id="approach" placeholder="Approach">
    <input id="technique" placeholder="Technique">
    <input id="population" placeholder="Population">
    <input id="publicationYear" inputmode="numeric" placeholder="Year">
    <select id="verification">
      <option value="">Any review state</option>
      <option value="pending-source">Source pending</option>
      <option value="pending-interpretation">Interpretation pending</option>
      <option value="pending-classification">Classification pending</option>
      <option value="disputed-classification">Classification disputed</option>
    </select>
    <button type="submit">Apply filters</button>
    <button type="button" id="clear">Clear</button>
    <button type="button" id="export">Export CSV</button>
  </form>
  <div id="status"><span id="summary"></span> <span id="diagnostics"></span></div>
  <main id="layout">
    <div id="matrixScroll"><table id="matrix"></table></div>
    <aside id="detail"><p class="subtle">Select a cell to inspect its extraction and evidence.</p></aside>
  </main>
  <script nonce="${e}">
    const vscode = acquireVsCodeApi()
    let currentDetail = null
    const ids = ['paper', 'constructId', 'paradigm', 'approach', 'technique', 'population', 'publicationYear', 'verification']
    const filters = () => Object.fromEntries(ids.map(id => [id, document.getElementById(id).value]))
    document.getElementById('toolbar').addEventListener('submit', event => {
      event.preventDefault()
      vscode.postMessage({ type: 'filter', filters: filters() })
    })
    document.getElementById('clear').addEventListener('click', () => {
      ids.forEach(id => { document.getElementById(id).value = '' })
      vscode.postMessage({ type: 'filter', filters: {} })
    })
    document.getElementById('export').addEventListener('click', () => {
      vscode.postMessage({ type: 'exportCsv', filters: filters() })
    })
    window.addEventListener('message', event => receive(event.data))
    vscode.postMessage({ type: 'ready' })

    function receive(message) {
      if (message.type === 'matrix') renderMatrix(message.matrix, message.hydrationCount)
      if (message.type === 'detail') renderDetail(message.detail)
      if (message.type === 'diagnostics') renderDiagnostics(message.diagnostics)
      if (message.type === 'problem') renderProblem(message.message)
      if (message.type === 'focusCell') focusCell(message.cell)
    }

    function renderMatrix(matrix, hydrationCount) {
      const table = document.getElementById('matrix')
      table.replaceChildren()
      if (!matrix) return renderProblem('The matrix index is unavailable. Rebuild the project indexes.')
      const head = document.createElement('tr')
      head.appendChild(cellElement('th', 'Paper'))
      matrix.constructs.forEach(construct => head.appendChild(cellElement('th', construct.canonicalName)))
      const thead = document.createElement('thead')
      thead.appendChild(head)
      table.appendChild(thead)
      const tbody = document.createElement('tbody')
      matrix.papers.forEach(paper => tbody.appendChild(paperRow(paper, matrix)))
      table.appendChild(tbody)
      document.getElementById('summary').textContent =
        matrix.papers.length + ' papers \xD7 ' + matrix.constructs.length + ' constructs \xB7 graph hydration ' + hydrationCount
    }

    function paperRow(paper, matrix) {
      const row = document.createElement('tr')
      const label = cellElement('td', paper.title)
      label.appendChild(textElement('div', paper.paperId, 'subtle'))
      row.appendChild(label)
      matrix.constructs.forEach(construct => {
        const cell = matrix.cells.find(item => item.paperId === paper.paperId && item.constructId === construct.constructId)
        row.appendChild(matrixCell(cell))
      })
      return row
    }

    function matrixCell(cell) {
      const container = document.createElement('td')
      if (!cell) return container
      const button = document.createElement('button')
      button.className = 'cell ' + cell.state
      button.dataset.paperId = cell.paperId
      button.dataset.constructId = cell.constructId
      button.textContent = cell.state === 'empty' ? '\u2014' : cell.state
      if (cell.findingIds.length) button.appendChild(textElement('div', cell.findingIds.length + ' findings', 'subtle'))
      if (cell.evidenceIds.length) button.appendChild(textElement('div', cell.evidenceIds.length + ' evidence records', 'subtle'))
      if (cell.sourceTerms.length) button.appendChild(textElement('div', cell.sourceTerms.join('; '), 'subtle'))
      button.addEventListener('click', () => vscode.postMessage({
        type: 'openCell',
        paperId: cell.paperId,
        constructId: cell.constructId,
      }))
      container.appendChild(button)
      return container
    }

    function renderDetail(detail) {
      currentDetail = detail
      const panel = document.getElementById('detail')
      panel.replaceChildren()
      panel.appendChild(textElement('h2', detail.constructName))
      panel.appendChild(textElement('p', detail.paperId + ' \xB7 ' + detail.extractionId, 'subtle'))
      panel.appendChild(textElement('h3', 'Method and population'))
      panel.appendChild(textElement('p', methodText(detail.methodology)))
      panel.appendChild(textElement('h3', 'Source and normalized terms'))
      detail.mappings.forEach(mapping => {
        panel.appendChild(mappingArticle(detail, mapping))
      })
      panel.appendChild(textElement('h3', 'Findings'))
      detail.findings.forEach(finding => panel.appendChild(findingArticle(detail, finding)))
      panel.appendChild(textElement('h3', 'Evidence'))
      detail.evidence.forEach(evidence => panel.appendChild(evidenceArticle(evidence)))
    }

    function mappingArticle(detail, mapping) {
      const text = mapping.sourceTerm + ' \u2192 ' +
        (mapping.constructId || 'unmapped') + ' (' + mapping.mappingStatus + ')'
      const article = textElement('article', text)
      article.appendChild(textElement('div', reviewText(mapping.reviewState), 'subtle'))
      if (mapping.mappingStatus === 'pending') {
        article.appendChild(reviewButton('Approve mapping', () => reviewMapping(detail, mapping, 'approved')))
        article.appendChild(reviewButton('Reject mapping', () => reviewMapping(detail, mapping, 'rejected')))
      }
      article.appendChild(reviewButton('Confirm classification', () => verifyMapping(detail, mapping, 'verified')))
      article.appendChild(reviewButton('Dispute classification', () => verifyMapping(detail, mapping, 'disputed')))
      return article
    }

    function findingArticle(detail, finding) {
      const article = textElement('article', finding.sourceText)
      article.appendChild(textElement('div', reviewText(finding.reviewState), 'subtle'))
      article.appendChild(reviewButton('Confirm interpretation', () => verifyFinding(detail, finding, 'interpretation', 'verified')))
      article.appendChild(reviewButton('Dispute interpretation', () => verifyFinding(detail, finding, 'interpretation', 'rejected')))
      article.appendChild(reviewButton('Confirm classification', () => verifyFinding(detail, finding, 'classification', 'verified')))
      article.appendChild(reviewButton('Dispute classification', () => verifyFinding(detail, finding, 'classification', 'disputed')))
      if (finding.nodeId) {
        const button = textElement('button', 'Focus graph node')
        button.addEventListener('click', () => vscode.postMessage({
          type: 'focusGraph',
          paperId: detail.paperId,
          nodeId: finding.nodeId,
        }))
        article.appendChild(button)
      }
      return article
    }

    function evidenceArticle(evidence) {
      const article = textElement('article', evidence.quote.text)
      article.appendChild(textElement('div', 'p. ' + evidence.locator.page + ' \xB7 source ' + evidence.reviewState.verification.source, 'subtle'))
      const button = textElement('button', 'Open source PDF')
      button.addEventListener('click', () => vscode.postMessage({
        type: 'openEvidence',
        evidenceId: evidence.evidenceId,
      }))
      article.appendChild(button)
      article.appendChild(reviewButton('Confirm quotation', () => verifySource(evidence, 'verified')))
      article.appendChild(reviewButton('Dispute quotation', () => verifySource(evidence, 'rejected')))
      return article
    }

    function verifySource(evidence, state) {
      const detail = currentDetail
      if (!detail) return
      vscode.postMessage({
        type: 'verifySource',
        evidenceId: evidence.evidenceId,
        state,
        paperId: detail.paperId,
        constructId: detail.constructId,
        filters: filters(),
      })
    }

    function verifyFinding(detail, finding, dimension, state) {
      vscode.postMessage({
        type: 'verifyFinding',
        paperId: detail.paperId,
        constructId: detail.constructId,
        findingId: finding.findingId,
        dimension,
        state,
        filters: filters(),
      })
    }

    function verifyMapping(detail, mapping, state) {
      vscode.postMessage({
        type: 'verifyMapping',
        paperId: detail.paperId,
        constructId: detail.constructId,
        mappingId: mapping.mappingId,
        state,
        filters: filters(),
      })
    }

    function reviewMapping(detail, mapping, decision) {
      vscode.postMessage({
        type: 'reviewMapping',
        paperId: detail.paperId,
        constructId: detail.constructId,
        mappingId: mapping.mappingId,
        decision,
        filters: filters(),
      })
    }

    function reviewButton(label, action) {
      const button = textElement('button', label)
      button.addEventListener('click', action)
      return button
    }

    function renderDiagnostics(diagnostics) {
      const visible = (diagnostics || []).filter(item => item.severity === 'error' || item.code.includes('stale'))
      document.getElementById('diagnostics').textContent =
        visible.length ? visible.map(item => item.code + ': ' + item.action).join(' \xB7 ') : ''
    }

    function renderProblem(message) {
      document.getElementById('diagnostics').textContent = message
    }

    function focusCell(cell) {
      document.querySelectorAll('.cell.focused').forEach(item => item.classList.remove('focused'))
      const selector = '.cell[data-paper-id="' + CSS.escape(cell.paperId) + '"][data-construct-id="' + CSS.escape(cell.constructId) + '"]'
      const button = document.querySelector(selector)
      if (!button) return renderProblem('The selected graph node is outside the current matrix filters.')
      button.classList.add('focused')
      button.scrollIntoView({ block: 'center', inline: 'center' })
    }

    function methodText(method) {
      return [
        method.paradigmLabel || method.paradigmSourceTerm,
        method.researchApproach,
        method.analyticalTechnique,
        method.population,
        method.unitOfAnalysis,
      ].filter(Boolean).join(' \xB7 ') || 'Not extracted'
    }

    function reviewText(review) {
      return 'origin ' + review.origin +
        ' \xB7 researcher approval ' + review.approval.researcher +
        ' \xB7 source ' + review.verification.source +
        ' \xB7 interpretation ' + review.verification.interpretation +
        ' \xB7 classification ' + review.verification.classification
    }

    function cellElement(tag, text) {
      return textElement(tag, text)
    }

    function textElement(tag, text, className) {
      const element = document.createElement(tag)
      element.textContent = String(text)
      if (className) element.className = className
      return element
    }
  </script>
</body>
</html>`}var al={type:"human",id:"researcher"};function sl(t,e){let r=L.window.createOutputChannel("NodeGraph Synthesis");t.subscriptions.push(r,L.commands.registerCommand("nodegraph.project.migratePhase2",n=>Pe(r,()=>Eb(e,r,n))),L.commands.registerCommand("nodegraph.project.importExtraction",n=>Pe(r,()=>Sb(e,r,n))),L.commands.registerCommand("nodegraph.project.openMatrix",n=>Pe(r,()=>jb(t,e,n))),L.commands.registerCommand("nodegraph.project.verifySources",n=>Pe(r,()=>Db(t,e,r,n))),L.commands.registerCommand("nodegraph.project.proposeConstruct",n=>Pe(r,()=>_b(e,r,n))),L.commands.registerCommand("nodegraph.project.reviewConstructs",n=>Pe(r,()=>$b(e,r,n))))}async function Eb(t,e,r){let n=await Ee(r);!n||await L.window.showWarningMessage("Upgrade this project from schema 1.0.0 to 1.1.0? The manifest is replaced only after new extraction files validate.",{modal:!0},"Upgrade project")!=="Upgrade project"||Jr(e,await t.migrate(n.fsPath))}async function Sb(t,e,r){let n=await Ee(r);if(!n)return;let i=await L.window.showOpenDialog({canSelectMany:!1,filters:{"NodeGraph extraction":["json"]},title:"Import a validated extraction proposal"});if(!i?.[0])return;let o=await Mb(i[0]);Jr(e,await t.importExtraction(n.fsPath,o,al))}async function jb(t,e,r){let n=await Ee(r);n&&Ei.open(t,e,n.fsPath)}async function Db(t,e,r,n){let i=await Ee(n);if(!i)return;let o=await e.sourceQueue(i.fsPath);Ve(r,o.diagnostics);let a=await L.window.showQuickPick(o.items.map(d=>({label:Xr(d.paperId),description:Xr(`${d.state}${d.stale?" \xB7 stale":""}`),detail:Xr(d.quote),item:d})),{placeHolder:"Choose pending evidence to verify at its source"});if(!a)return;let s=await e.sourceNavigation(i.fsPath,a.item.evidenceId);Ve(r,s.diagnostics),s.sourcePath&&s.quote&&await Ze.openAndSearch(t,L.Uri.file(s.sourcePath),s.quote,s.page);let c=await L.window.showQuickPick([{label:"Confirm quotation",state:"verified"},{label:"Dispute quotation",state:"rejected"}],{placeHolder:"Record source verification independently"});c&&Jr(r,await e.verifySource(i.fsPath,a.item.evidenceId,c.state))}async function _b(t,e,r){let n=await Ee(r);if(!n)return;let i=await L.window.showInputBox({prompt:"Stable construct ID",validateInput:s=>/^[a-z][a-z0-9-]*$/.test(s)?void 0:"Use lower-case letters, numbers, and hyphens."});if(!i)return;let o=await L.window.showInputBox({prompt:"Construct name"});if(!o)return;let a=await L.window.showInputBox({prompt:"Definition (optional)"});Jr(e,await t.proposeConstruct(n.fsPath,{constructId:i,canonicalName:o,...a?{definition:a}:{}},al))}async function $b(t,e,r){let n=await Ee(r);if(!n)return;let i=await t.taxonomy(n.fsPath);Ve(e,i.diagnostics);let o=i.value?.constructs.filter(c=>c.status==="proposed"&&c.reviewState.approval.researcher==="not-reviewed")??[],a=await L.window.showQuickPick(o.map(c=>({label:Xr(c.canonicalName),description:Xr(c.constructId),constructId:c.constructId})),{placeHolder:"Choose a proposed construct"});if(!a)return;let s=await L.window.showQuickPick([{label:"Approve construct",value:"approved"},{label:"Reject construct",value:"rejected"}]);s&&Jr(e,await t.reviewConstruct(n.fsPath,a.constructId,s.value))}async function Mb(t){let e=await L.workspace.fs.readFile(t);return JSON.parse(Buffer.from(e).toString("utf8"))}function Jr(t,e){t.appendLine(e.mutation.accepted?`Accepted: ${e.mutation.targetDocument}`:`Rejected: ${e.mutation.code}`),Ve(t,e.diagnostics),t.show(!0)}function Xr(t){return t.replace(/[\u0000-\u001f\u007f]/g," ").replace(/\$\(/g,"\uFF04(")}var cr=F(require("path")),dl=require("fs/promises");var ar={type:"human",id:"researcher"},Si=class{constructor(e){this.runtime=e}async migrate(e){let r=await this.runtime.migrations.migratePhase2(e,ar);return!r.mutation.accepted||!r.manifest?{mutation:r.mutation,diagnostics:r.diagnostics}:this.rebuildAcceptedMutation(cr.dirname(e),r.manifest,r.mutation,r.diagnostics,!0)}async importExtraction(e,r,n,i){let o=await this.openWritableProject(e),a=await this.runtime.extractions.read(o.root,o.manifest,r.paperId);if(!a.value)return sr(`extraction:${r.paperId}`,i??"absent",a.diagnostics);let s=await this.runtime.extractions.importProposal(o.root,o.manifest,r,i??G(a.value),n);return this.rebuildAfterMutation(o,s)}async openMatrix(e,r={}){let n=await this.openWritableProject(e),i=n.opened.paperIndex,o=[...n.opened.diagnostics];if(!i){let s=await this.runtime.indexes.rebuild(n.root,n.manifest,!0);o.push(...s.diagnostics),R(s.diagnostics)||(i=s.paperIndex)}if(!i)return{diagnostics:o,hydrationCount:this.runtime.papers.instrumentation().count};let a=await this.runtime.synthesis.readTaxonomy(n.root,n.manifest);return a.value?{matrix:this.runtime.queries.matrix(i,a.value,r),diagnostics:[...o,...a.diagnostics],hydrationCount:this.runtime.papers.instrumentation().count}:{diagnostics:[...o,...a.diagnostics],hydrationCount:this.runtime.papers.instrumentation().count}}async hydrateCell(e,r,n){let i=await this.openWritableProject(e,!1);return this.runtime.queries.hydrateMatrixCell(i.root,i.manifest,r,n)}async exportCsv(e,r={}){let n=await this.openMatrix(e,r);if(!n.matrix)return{diagnostics:n.diagnostics};let i=await this.runtime.registry.open(e);return i.paperIndex?{csv:this.runtime.csv.export(i.paperIndex,n.matrix),diagnostics:n.diagnostics}:{diagnostics:i.diagnostics}}async sourceQueue(e){let r=await this.openWritableProject(e);return this.runtime.verification.sourceQueue(r.root,r.manifest)}async sourceNavigation(e,r){let n=await this.openWritableProject(e,!1);return this.runtime.verification.sourceNavigation(n.root,n.manifest,r)}async verifySource(e,r,n,i){let o=await this.openWritableProject(e),a=await this.runtime.synthesis.readEvidence(o.root,o.manifest);if(!a.value)return sr(o.manifest.documents.evidence,i??"absent",a.diagnostics);let s=await this.runtime.verification.updateSourceVerification(o.root,o.manifest,r,n,i??G(a.value),ar);return this.rebuildAfterMutation(o,s)}async verifyFinding(e,r,n,i,o,a){let s=await this.openWritableProject(e),c=await this.extractionMutationContext(s,r,a);if(!c.ok)return c.outcome;let d=await this.runtime.verification.updateFindingVerification(s.root,s.manifest,r,n,i,o,c.baseRevision,ar);return this.rebuildAfterMutation(s,d)}async verifyMappingClassification(e,r,n,i,o){let a=await this.openWritableProject(e),s=await this.extractionMutationContext(a,r,o);if(!s.ok)return s.outcome;let c=await this.runtime.verification.updateMappingClassification(a.root,a.manifest,r,n,i,s.baseRevision,ar);return this.rebuildAfterMutation(a,c)}async reviewMapping(e,r,n,i,o){let a=await this.openWritableProject(e),s=await this.extractionMutationContext(a,r,o);if(!s.ok)return s.outcome;let c=await this.runtime.taxonomy.reviewMapping(a.root,a.manifest,r,n,i,s.baseRevision,ar);return this.rebuildAfterMutation(a,c)}async proposeConstruct(e,r,n){let i=await this.openWritableProject(e),o=await this.runtime.synthesis.readTaxonomy(i.root,i.manifest);if(!o.value)return sr(i.manifest.documents.constructs,"absent",o.diagnostics);let a=await this.runtime.taxonomy.proposeConstruct(i.root,i.manifest,r,G(o.value),n);return this.rebuildAfterMutation(i,a.mutation)}async taxonomy(e){let r=await this.openWritableProject(e,!1);return this.runtime.synthesis.readTaxonomy(r.root,r.manifest)}async reviewConstruct(e,r,n){let i=await this.openWritableProject(e),o=await this.runtime.synthesis.readTaxonomy(i.root,i.manifest);if(!o.value)return sr(i.manifest.documents.constructs,"absent",o.diagnostics);let a=await this.runtime.taxonomy.reviewConstruct(i.root,i.manifest,r,n,G(o.value),ar);return this.rebuildAfterMutation(i,a)}async locateMatrixCell(e,r,n){let i=await this.runtime.registry.open(e);if(!i.manifest||!i.paperIndex)return;let o=cr.dirname(e),a=await Rb(this.runtime,o,i.manifest,r);return a?this.runtime.queries.locateMatrixCell(i.paperIndex,a.path,n):void 0}async paperGraphTarget(e,r){let n=await this.openWritableProject(e,!1),i=n.manifest.papers.find(o=>o.paperId===r);return i?this.runtime.registry.resolveDocument(n.root,i.path,!0):void 0}async openWritableProject(e,r=!0){r&&this.runtime.papers.resetInstrumentation();let n=await this.runtime.registry.open(e);if(!n.manifest)throw new ae("project-manifest-invalid","The project manifest is invalid.",n.diagnostics);if(n.mode==="read-only")throw new ae("project-read-only","The project is read-only until its reported errors are corrected.",n.diagnostics);return{root:cr.dirname(e),manifest:n.manifest,opened:n}}async extractionMutationContext(e,r,n){let i=e.manifest.papers.find(a=>a.paperId===r);if(!i)return{ok:!1,outcome:sr("project.nodegraph.json",n??"absent",[])};let o=await this.runtime.synthesis.readExtraction(e.root,i);return o.value?{ok:!0,baseRevision:n??G(o.value)}:{ok:!1,outcome:sr(i.extractionPath??r,n??"absent",o.diagnostics)}}async rebuildAfterMutation(e,r){return r.accepted?this.rebuildAcceptedMutation(e.root,e.manifest,r):{mutation:r,diagnostics:r.diagnostics??[]}}async rebuildAcceptedMutation(e,r,n,i=[],o=!1){try{let a=await this.runtime.indexes.rebuild(e,r,o);return{mutation:n,diagnostics:[...i,...a.diagnostics]}}catch(a){let s=Ya(a);return{mutation:n,diagnostics:[...i,...s.diagnostics],indexFailure:s}}}};async function Rb(t,e,r,n){let i=await cl(n);for(let o of r.papers){let a=await t.registry.resolveDocument(e,o.path);if(await cl(a)===i)return o}}async function cl(t){try{return await(0,dl.realpath)(t)}catch{return cr.resolve(t)}}function sr(t,e,r){return{mutation:{accepted:!1,code:"phase2-operation-rejected",targetDocument:t,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:r},diagnostics:r}}var kb=[{id:"tomoki1207.pdf",name:"vscode-pdf (PDF Viewer)"}];async function Cb(){for(let t of kb)if(!B.extensions.getExtension(t.id))try{await B.commands.executeCommand("workbench.extensions.installExtension",t.id)}catch{}}async function ul(t){if(t)return t;let e=B.workspace.workspaceFolders??[];return e.length===0?void 0:e.length===1?e[0].uri:(await B.window.showWorkspaceFolderPick({placeHolder:"Select a folder for NodeGraph"}))?.uri}async function Ab(t){let e=await ul(t),r=e?B.Uri.joinPath(e,"untitled.nodegraph.json"):void 0,n=await B.window.showSaveDialog({defaultUri:r,filters:{NodeGraph:["nodegraph.json"]},title:"Create New NodeGraph"});if(!n)return;let i=n.fsPath.endsWith(".nodegraph.json")?n:n.with({path:n.path.replace(/(\.nodegraph)?(\.json)?$/,"")+".nodegraph.json"}),o=nn();await B.workspace.fs.writeFile(i,Buffer.from(JSON.stringify(o,null,2),"utf-8")),await B.commands.executeCommand("vscode.openWith",i,"nodegraph.editor")}function Tb(t){let e=Zu({extensionRoot:t.extensionPath}),r=new Ii(e),n=new Si(e);t.subscriptions.push(ke.register(t)),rl(t,r),sl(t,n),t.subscriptions.push(B.commands.registerCommand("nodegraph.search",()=>{ke.postToActive({type:"openSearch"})}),B.commands.registerCommand("nodegraph.fitView",()=>{ke.postToActive({type:"fitView"})}),B.commands.registerCommand("nodegraph.collapseAll",()=>{ke.postToActive({type:"collapseAll"})}),B.commands.registerCommand("nodegraph.expandAll",()=>{ke.postToActive({type:"expandAll"})}),B.commands.registerCommand("nodegraph.new",i=>Ab(i))),as(B.workspace.workspaceFolders??[]),t.subscriptions.push(B.commands.registerCommand("nodegraph.copyAgentSpec",async i=>{let o=await ul(i);if(!o){B.window.showWarningMessage("NodeGraph: open or select a folder first \u2014 there is no workspace to copy the spec into.");return}let a=await ss(t.extensionUri,o),s=await Ri(o),c=await cs(t.extensionUri,o);a&&s&&c?B.window.showInformationMessage(`NodeGraph: wrote .agent/NODEGRAPH_SPEC.md, .agent/ENVIRONMENT.md, and .prompt/{korean,english}.md in ${o.fsPath}.`):B.window.showErrorMessage("NodeGraph: failed to write the agent files \u2014 check that the folder is writable and try again.")})),Cb()}function Ob(){}0&&(module.exports={activate,deactivate});
