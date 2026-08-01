"use strict";var gp=Object.create;var hi=Object.defineProperty;var vp=Object.getOwnPropertyDescriptor;var yp=Object.getOwnPropertyNames;var wp=Object.getPrototypeOf,xp=Object.prototype.hasOwnProperty;var w=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),Pp=(t,e)=>{for(var r in e)hi(t,r,{get:e[r],enumerable:!0})},Rs=(t,e,r,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of yp(e))!xp.call(t,n)&&n!==r&&hi(t,n,{get:()=>e[n],enumerable:!(i=vp(e,n))||i.enumerable});return t};var L=(t,e,r)=>(r=t!=null?gp(wp(t)):{},Rs(e||!t||!t.__esModule?hi(r,"default",{value:t,enumerable:!0}):r,t)),bp=t=>Rs(hi({},"__esModule",{value:!0}),t);var Vr=w(q=>{"use strict";Object.defineProperty(q,"__esModule",{value:!0});q.regexpCode=q.getEsmExportName=q.getProperty=q.safeStringify=q.stringify=q.strConcat=q.addCodeArg=q.str=q._=q.nil=q._Code=q.Name=q.IDENTIFIER=q._CodeOrName=void 0;var Nr=class{};q._CodeOrName=Nr;q.IDENTIFIER=/^[a-z$_][a-z$_0-9]*$/i;var _t=class extends Nr{constructor(e){if(super(),!q.IDENTIFIER.test(e))throw new Error("CodeGen: name must be a valid identifier");this.str=e}toString(){return this.str}emptyStr(){return!1}get names(){return{[this.str]:1}}};q.Name=_t;var $e=class extends Nr{constructor(e){super(),this._items=typeof e=="string"?[e]:e}toString(){return this.str}emptyStr(){if(this._items.length>1)return!1;let e=this._items[0];return e===""||e==='""'}get str(){var e;return(e=this._str)!==null&&e!==void 0?e:this._str=this._items.reduce((r,i)=>`${r}${i}`,"")}get names(){var e;return(e=this._names)!==null&&e!==void 0?e:this._names=this._items.reduce((r,i)=>(i instanceof _t&&(r[i.str]=(r[i.str]||0)+1),r),{})}};q._Code=$e;q.nil=new $e("");function Tc(t,...e){let r=[t[0]],i=0;for(;i<e.length;)jo(r,e[i]),r.push(t[++i]);return new $e(r)}q._=Tc;var Eo=new $e("+");function Oc(t,...e){let r=[qr(t[0])],i=0;for(;i<e.length;)r.push(Eo),jo(r,e[i]),r.push(Eo,qr(t[++i]));return og(r),new $e(r)}q.str=Oc;function jo(t,e){e instanceof $e?t.push(...e._items):e instanceof _t?t.push(e):t.push(cg(e))}q.addCodeArg=jo;function og(t){let e=1;for(;e<t.length-1;){if(t[e]===Eo){let r=ag(t[e-1],t[e+1]);if(r!==void 0){t.splice(e-1,3,r);continue}t[e++]="+"}e++}}function ag(t,e){if(e==='""')return t;if(t==='""')return e;if(typeof t=="string")return e instanceof _t||t[t.length-1]!=='"'?void 0:typeof e!="string"?`${t.slice(0,-1)}${e}"`:e[0]==='"'?t.slice(0,-1)+e.slice(1):void 0;if(typeof e=="string"&&e[0]==='"'&&!(t instanceof _t))return`"${t}${e.slice(1)}`}function sg(t,e){return e.emptyStr()?t:t.emptyStr()?e:Oc`${t}${e}`}q.strConcat=sg;function cg(t){return typeof t=="number"||typeof t=="boolean"||t===null?t:qr(Array.isArray(t)?t.join(","):t)}function dg(t){return new $e(qr(t))}q.stringify=dg;function qr(t){return JSON.stringify(t).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}q.safeStringify=qr;function ug(t){return typeof t=="string"&&q.IDENTIFIER.test(t)?new $e(`.${t}`):Tc`[${t}]`}q.getProperty=ug;function lg(t){if(typeof t=="string"&&q.IDENTIFIER.test(t))return new $e(`${t}`);throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`)}q.getEsmExportName=lg;function pg(t){return new $e(t.toString())}q.regexpCode=pg});var Ro=w(Ce=>{"use strict";Object.defineProperty(Ce,"__esModule",{value:!0});Ce.ValueScope=Ce.ValueScopeName=Ce.Scope=Ce.varKinds=Ce.UsedValueState=void 0;var je=Vr(),Co=class extends Error{constructor(e){super(`CodeGen: "code" for ${e} not defined`),this.value=e.value}},Xi;(function(t){t[t.Started=0]="Started",t[t.Completed=1]="Completed"})(Xi||(Ce.UsedValueState=Xi={}));Ce.varKinds={const:new je.Name("const"),let:new je.Name("let"),var:new je.Name("var")};var Qi=class{constructor({prefixes:e,parent:r}={}){this._names={},this._prefixes=e,this._parent=r}toName(e){return e instanceof je.Name?e:this.name(e)}name(e){return new je.Name(this._newName(e))}_newName(e){let r=this._names[e]||this._nameGroup(e);return`${e}${r.index++}`}_nameGroup(e){var r,i;if(!((i=(r=this._parent)===null||r===void 0?void 0:r._prefixes)===null||i===void 0)&&i.has(e)||this._prefixes&&!this._prefixes.has(e))throw new Error(`CodeGen: prefix "${e}" is not allowed in this scope`);return this._names[e]={prefix:e,index:0}}};Ce.Scope=Qi;var Zi=class extends je.Name{constructor(e,r){super(r),this.prefix=e}setValue(e,{property:r,itemIndex:i}){this.value=e,this.scopePath=(0,je._)`.${new je.Name(r)}[${i}]`}};Ce.ValueScopeName=Zi;var fg=(0,je._)`\n`,Do=class extends Qi{constructor(e){super(e),this._values={},this._scope=e.scope,this.opts={...e,_n:e.lines?fg:je.nil}}get(){return this._scope}name(e){return new Zi(e,this._newName(e))}value(e,r){var i;if(r.ref===void 0)throw new Error("CodeGen: ref must be passed in value");let n=this.toName(e),{prefix:o}=n,a=(i=r.key)!==null&&i!==void 0?i:r.ref,s=this._values[o];if(s){let u=s.get(a);if(u)return u}else s=this._values[o]=new Map;s.set(a,n);let c=this._scope[o]||(this._scope[o]=[]),d=c.length;return c[d]=r.ref,n.setValue(r,{property:o,itemIndex:d}),n}getValue(e,r){let i=this._values[e];if(i)return i.get(r)}scopeRefs(e,r=this._values){return this._reduceValues(r,i=>{if(i.scopePath===void 0)throw new Error(`CodeGen: name "${i}" has no value`);return(0,je._)`${e}${i.scopePath}`})}scopeCode(e=this._values,r,i){return this._reduceValues(e,n=>{if(n.value===void 0)throw new Error(`CodeGen: name "${n}" has no value`);return n.value.code},r,i)}_reduceValues(e,r,i={},n){let o=je.nil;for(let a in e){let s=e[a];if(!s)continue;let c=i[a]=i[a]||new Map;s.forEach(d=>{if(c.has(d))return;c.set(d,Xi.Started);let u=r(d);if(u){let l=this.opts.es5?Ce.varKinds.var:Ce.varKinds.const;o=(0,je._)`${o}${l} ${d} = ${u};${this.opts._n}`}else if(u=n?.(d))o=(0,je._)`${o}${u}${this.opts._n}`;else throw new Co(d);c.set(d,Xi.Completed)})}return o}};Ce.ValueScope=Do});var M=w(_=>{"use strict";Object.defineProperty(_,"__esModule",{value:!0});_.or=_.and=_.not=_.CodeGen=_.operators=_.varKinds=_.ValueScopeName=_.ValueScope=_.Scope=_.Name=_.regexpCode=_.stringify=_.getProperty=_.nil=_.strConcat=_.str=_._=void 0;var k=Vr(),Fe=Ro(),vt=Vr();Object.defineProperty(_,"_",{enumerable:!0,get:function(){return vt._}});Object.defineProperty(_,"str",{enumerable:!0,get:function(){return vt.str}});Object.defineProperty(_,"strConcat",{enumerable:!0,get:function(){return vt.strConcat}});Object.defineProperty(_,"nil",{enumerable:!0,get:function(){return vt.nil}});Object.defineProperty(_,"getProperty",{enumerable:!0,get:function(){return vt.getProperty}});Object.defineProperty(_,"stringify",{enumerable:!0,get:function(){return vt.stringify}});Object.defineProperty(_,"regexpCode",{enumerable:!0,get:function(){return vt.regexpCode}});Object.defineProperty(_,"Name",{enumerable:!0,get:function(){return vt.Name}});var nn=Ro();Object.defineProperty(_,"Scope",{enumerable:!0,get:function(){return nn.Scope}});Object.defineProperty(_,"ValueScope",{enumerable:!0,get:function(){return nn.ValueScope}});Object.defineProperty(_,"ValueScopeName",{enumerable:!0,get:function(){return nn.ValueScopeName}});Object.defineProperty(_,"varKinds",{enumerable:!0,get:function(){return nn.varKinds}});_.operators={GT:new k._Code(">"),GTE:new k._Code(">="),LT:new k._Code("<"),LTE:new k._Code("<="),EQ:new k._Code("==="),NEQ:new k._Code("!=="),NOT:new k._Code("!"),OR:new k._Code("||"),AND:new k._Code("&&"),ADD:new k._Code("+")};var rt=class{optimizeNodes(){return this}optimizeNames(e,r){return this}},Mo=class extends rt{constructor(e,r,i){super(),this.varKind=e,this.name=r,this.rhs=i}render({es5:e,_n:r}){let i=e?Fe.varKinds.var:this.varKind,n=this.rhs===void 0?"":` = ${this.rhs}`;return`${i} ${this.name}${n};`+r}optimizeNames(e,r){if(e[this.name.str])return this.rhs&&(this.rhs=nr(this.rhs,e,r)),this}get names(){return this.rhs instanceof k._CodeOrName?this.rhs.names:{}}},en=class extends rt{constructor(e,r,i){super(),this.lhs=e,this.rhs=r,this.sideEffects=i}render({_n:e}){return`${this.lhs} = ${this.rhs};`+e}optimizeNames(e,r){if(!(this.lhs instanceof k.Name&&!e[this.lhs.str]&&!this.sideEffects))return this.rhs=nr(this.rhs,e,r),this}get names(){let e=this.lhs instanceof k.Name?{}:{...this.lhs.names};return rn(e,this.rhs)}},_o=class extends en{constructor(e,r,i,n){super(e,i,n),this.op=r}render({_n:e}){return`${this.lhs} ${this.op}= ${this.rhs};`+e}},$o=class extends rt{constructor(e){super(),this.label=e,this.names={}}render({_n:e}){return`${this.label}:`+e}},ko=class extends rt{constructor(e){super(),this.label=e,this.names={}}render({_n:e}){return`break${this.label?` ${this.label}`:""};`+e}},Ao=class extends rt{constructor(e){super(),this.error=e}render({_n:e}){return`throw ${this.error};`+e}get names(){return this.error.names}},To=class extends rt{constructor(e){super(),this.code=e}render({_n:e}){return`${this.code};`+e}optimizeNodes(){return`${this.code}`?this:void 0}optimizeNames(e,r){return this.code=nr(this.code,e,r),this}get names(){return this.code instanceof k._CodeOrName?this.code.names:{}}},Hr=class extends rt{constructor(e=[]){super(),this.nodes=e}render(e){return this.nodes.reduce((r,i)=>r+i.render(e),"")}optimizeNodes(){let{nodes:e}=this,r=e.length;for(;r--;){let i=e[r].optimizeNodes();Array.isArray(i)?e.splice(r,1,...i):i?e[r]=i:e.splice(r,1)}return e.length>0?this:void 0}optimizeNames(e,r){let{nodes:i}=this,n=i.length;for(;n--;){let o=i[n];o.optimizeNames(e,r)||(mg(e,o.names),i.splice(n,1))}return i.length>0?this:void 0}get names(){return this.nodes.reduce((e,r)=>At(e,r.names),{})}},it=class extends Hr{render(e){return"{"+e._n+super.render(e)+"}"+e._n}},Oo=class extends Hr{},ir=class extends it{};ir.kind="else";var $t=class t extends it{constructor(e,r){super(r),this.condition=e}render(e){let r=`if(${this.condition})`+super.render(e);return this.else&&(r+="else "+this.else.render(e)),r}optimizeNodes(){super.optimizeNodes();let e=this.condition;if(e===!0)return this.nodes;let r=this.else;if(r){let i=r.optimizeNodes();r=this.else=Array.isArray(i)?new ir(i):i}if(r)return e===!1?r instanceof t?r:r.nodes:this.nodes.length?this:new t(Nc(e),r instanceof t?[r]:r.nodes);if(!(e===!1||!this.nodes.length))return this}optimizeNames(e,r){var i;if(this.else=(i=this.else)===null||i===void 0?void 0:i.optimizeNames(e,r),!!(super.optimizeNames(e,r)||this.else))return this.condition=nr(this.condition,e,r),this}get names(){let e=super.names;return rn(e,this.condition),this.else&&At(e,this.else.names),e}};$t.kind="if";var kt=class extends it{};kt.kind="for";var No=class extends kt{constructor(e){super(),this.iteration=e}render(e){return`for(${this.iteration})`+super.render(e)}optimizeNames(e,r){if(super.optimizeNames(e,r))return this.iteration=nr(this.iteration,e,r),this}get names(){return At(super.names,this.iteration.names)}},qo=class extends kt{constructor(e,r,i,n){super(),this.varKind=e,this.name=r,this.from=i,this.to=n}render(e){let r=e.es5?Fe.varKinds.var:this.varKind,{name:i,from:n,to:o}=this;return`for(${r} ${i}=${n}; ${i}<${o}; ${i}++)`+super.render(e)}get names(){let e=rn(super.names,this.from);return rn(e,this.to)}},tn=class extends kt{constructor(e,r,i,n){super(),this.loop=e,this.varKind=r,this.name=i,this.iterable=n}render(e){return`for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})`+super.render(e)}optimizeNames(e,r){if(super.optimizeNames(e,r))return this.iterable=nr(this.iterable,e,r),this}get names(){return At(super.names,this.iterable.names)}},Fr=class extends it{constructor(e,r,i){super(),this.name=e,this.args=r,this.async=i}render(e){return`${this.async?"async ":""}function ${this.name}(${this.args})`+super.render(e)}};Fr.kind="func";var Lr=class extends Hr{render(e){return"return "+super.render(e)}};Lr.kind="return";var Vo=class extends it{render(e){let r="try"+super.render(e);return this.catch&&(r+=this.catch.render(e)),this.finally&&(r+=this.finally.render(e)),r}optimizeNodes(){var e,r;return super.optimizeNodes(),(e=this.catch)===null||e===void 0||e.optimizeNodes(),(r=this.finally)===null||r===void 0||r.optimizeNodes(),this}optimizeNames(e,r){var i,n;return super.optimizeNames(e,r),(i=this.catch)===null||i===void 0||i.optimizeNames(e,r),(n=this.finally)===null||n===void 0||n.optimizeNames(e,r),this}get names(){let e=super.names;return this.catch&&At(e,this.catch.names),this.finally&&At(e,this.finally.names),e}},zr=class extends it{constructor(e){super(),this.error=e}render(e){return`catch(${this.error})`+super.render(e)}};zr.kind="catch";var Br=class extends it{render(e){return"finally"+super.render(e)}};Br.kind="finally";var Ho=class{constructor(e,r={}){this._values={},this._blockStarts=[],this._constants={},this.opts={...r,_n:r.lines?`
`:""},this._extScope=e,this._scope=new Fe.Scope({parent:e}),this._nodes=[new Oo]}toString(){return this._root.render(this.opts)}name(e){return this._scope.name(e)}scopeName(e){return this._extScope.name(e)}scopeValue(e,r){let i=this._extScope.value(e,r);return(this._values[i.prefix]||(this._values[i.prefix]=new Set)).add(i),i}getScopeValue(e,r){return this._extScope.getValue(e,r)}scopeRefs(e){return this._extScope.scopeRefs(e,this._values)}scopeCode(){return this._extScope.scopeCode(this._values)}_def(e,r,i,n){let o=this._scope.toName(r);return i!==void 0&&n&&(this._constants[o.str]=i),this._leafNode(new Mo(e,o,i)),o}const(e,r,i){return this._def(Fe.varKinds.const,e,r,i)}let(e,r,i){return this._def(Fe.varKinds.let,e,r,i)}var(e,r,i){return this._def(Fe.varKinds.var,e,r,i)}assign(e,r,i){return this._leafNode(new en(e,r,i))}add(e,r){return this._leafNode(new _o(e,_.operators.ADD,r))}code(e){return typeof e=="function"?e():e!==k.nil&&this._leafNode(new To(e)),this}object(...e){let r=["{"];for(let[i,n]of e)r.length>1&&r.push(","),r.push(i),(i!==n||this.opts.es5)&&(r.push(":"),(0,k.addCodeArg)(r,n));return r.push("}"),new k._Code(r)}if(e,r,i){if(this._blockNode(new $t(e)),r&&i)this.code(r).else().code(i).endIf();else if(r)this.code(r).endIf();else if(i)throw new Error('CodeGen: "else" body without "then" body');return this}elseIf(e){return this._elseNode(new $t(e))}else(){return this._elseNode(new ir)}endIf(){return this._endBlockNode($t,ir)}_for(e,r){return this._blockNode(e),r&&this.code(r).endFor(),this}for(e,r){return this._for(new No(e),r)}forRange(e,r,i,n,o=this.opts.es5?Fe.varKinds.var:Fe.varKinds.let){let a=this._scope.toName(e);return this._for(new qo(o,a,r,i),()=>n(a))}forOf(e,r,i,n=Fe.varKinds.const){let o=this._scope.toName(e);if(this.opts.es5){let a=r instanceof k.Name?r:this.var("_arr",r);return this.forRange("_i",0,(0,k._)`${a}.length`,s=>{this.var(o,(0,k._)`${a}[${s}]`),i(o)})}return this._for(new tn("of",n,o,r),()=>i(o))}forIn(e,r,i,n=this.opts.es5?Fe.varKinds.var:Fe.varKinds.const){if(this.opts.ownProperties)return this.forOf(e,(0,k._)`Object.keys(${r})`,i);let o=this._scope.toName(e);return this._for(new tn("in",n,o,r),()=>i(o))}endFor(){return this._endBlockNode(kt)}label(e){return this._leafNode(new $o(e))}break(e){return this._leafNode(new ko(e))}return(e){let r=new Lr;if(this._blockNode(r),this.code(e),r.nodes.length!==1)throw new Error('CodeGen: "return" should have one node');return this._endBlockNode(Lr)}try(e,r,i){if(!r&&!i)throw new Error('CodeGen: "try" without "catch" and "finally"');let n=new Vo;if(this._blockNode(n),this.code(e),r){let o=this.name("e");this._currNode=n.catch=new zr(o),r(o)}return i&&(this._currNode=n.finally=new Br,this.code(i)),this._endBlockNode(zr,Br)}throw(e){return this._leafNode(new Ao(e))}block(e,r){return this._blockStarts.push(this._nodes.length),e&&this.code(e).endBlock(r),this}endBlock(e){let r=this._blockStarts.pop();if(r===void 0)throw new Error("CodeGen: not in self-balancing block");let i=this._nodes.length-r;if(i<0||e!==void 0&&i!==e)throw new Error(`CodeGen: wrong number of nodes: ${i} vs ${e} expected`);return this._nodes.length=r,this}func(e,r=k.nil,i,n){return this._blockNode(new Fr(e,r,i)),n&&this.code(n).endFunc(),this}endFunc(){return this._endBlockNode(Fr)}optimize(e=1){for(;e-- >0;)this._root.optimizeNodes(),this._root.optimizeNames(this._root.names,this._constants)}_leafNode(e){return this._currNode.nodes.push(e),this}_blockNode(e){this._currNode.nodes.push(e),this._nodes.push(e)}_endBlockNode(e,r){let i=this._currNode;if(i instanceof e||r&&i instanceof r)return this._nodes.pop(),this;throw new Error(`CodeGen: not in block "${r?`${e.kind}/${r.kind}`:e.kind}"`)}_elseNode(e){let r=this._currNode;if(!(r instanceof $t))throw new Error('CodeGen: "else" without "if"');return this._currNode=r.else=e,this}get _root(){return this._nodes[0]}get _currNode(){let e=this._nodes;return e[e.length-1]}set _currNode(e){let r=this._nodes;r[r.length-1]=e}};_.CodeGen=Ho;function At(t,e){for(let r in e)t[r]=(t[r]||0)+(e[r]||0);return t}function rn(t,e){return e instanceof k._CodeOrName?At(t,e.names):t}function nr(t,e,r){if(t instanceof k.Name)return i(t);if(!n(t))return t;return new k._Code(t._items.reduce((o,a)=>(a instanceof k.Name&&(a=i(a)),a instanceof k._Code?o.push(...a._items):o.push(a),o),[]));function i(o){let a=r[o.str];return a===void 0||e[o.str]!==1?o:(delete e[o.str],a)}function n(o){return o instanceof k._Code&&o._items.some(a=>a instanceof k.Name&&e[a.str]===1&&r[a.str]!==void 0)}}function mg(t,e){for(let r in e)t[r]=(t[r]||0)-(e[r]||0)}function Nc(t){return typeof t=="boolean"||typeof t=="number"||t===null?!t:(0,k._)`!${Fo(t)}`}_.not=Nc;var hg=qc(_.operators.AND);function gg(...t){return t.reduce(hg)}_.and=gg;var vg=qc(_.operators.OR);function yg(...t){return t.reduce(vg)}_.or=yg;function qc(t){return(e,r)=>e===k.nil?r:r===k.nil?e:(0,k._)`${Fo(e)} ${t} ${Fo(r)}`}function Fo(t){return t instanceof k.Name?t:(0,k._)`(${t})`}});var O=w($=>{"use strict";Object.defineProperty($,"__esModule",{value:!0});$.checkStrictMode=$.getErrorPath=$.Type=$.useFunc=$.setEvaluated=$.evaluatedPropsToName=$.mergeEvaluated=$.eachItem=$.unescapeJsonPointer=$.escapeJsonPointer=$.escapeFragment=$.unescapeFragment=$.schemaRefOrVal=$.schemaHasRulesButRef=$.schemaHasRules=$.checkUnknownRules=$.alwaysValidSchema=$.toHash=void 0;var F=M(),wg=Vr();function xg(t){let e={};for(let r of t)e[r]=!0;return e}$.toHash=xg;function Pg(t,e){return typeof e=="boolean"?e:Object.keys(e).length===0?!0:(Fc(t,e),!Lc(e,t.self.RULES.all))}$.alwaysValidSchema=Pg;function Fc(t,e=t.schema){let{opts:r,self:i}=t;if(!r.strictSchema||typeof e=="boolean")return;let n=i.RULES.keywords;for(let o in e)n[o]||Uc(t,`unknown keyword: "${o}"`)}$.checkUnknownRules=Fc;function Lc(t,e){if(typeof t=="boolean")return!t;for(let r in t)if(e[r])return!0;return!1}$.schemaHasRules=Lc;function bg(t,e){if(typeof t=="boolean")return!t;for(let r in t)if(r!=="$ref"&&e.all[r])return!0;return!1}$.schemaHasRulesButRef=bg;function Ig({topSchemaRef:t,schemaPath:e},r,i,n){if(!n){if(typeof r=="number"||typeof r=="boolean")return r;if(typeof r=="string")return(0,F._)`${r}`}return(0,F._)`${t}${e}${(0,F.getProperty)(i)}`}$.schemaRefOrVal=Ig;function Sg(t){return zc(decodeURIComponent(t))}$.unescapeFragment=Sg;function Eg(t){return encodeURIComponent(zo(t))}$.escapeFragment=Eg;function zo(t){return typeof t=="number"?`${t}`:t.replace(/~/g,"~0").replace(/\//g,"~1")}$.escapeJsonPointer=zo;function zc(t){return t.replace(/~1/g,"/").replace(/~0/g,"~")}$.unescapeJsonPointer=zc;function jg(t,e){if(Array.isArray(t))for(let r of t)e(r);else e(t)}$.eachItem=jg;function Vc({mergeNames:t,mergeToName:e,mergeValues:r,resultToName:i}){return(n,o,a,s)=>{let c=a===void 0?o:a instanceof F.Name?(o instanceof F.Name?t(n,o,a):e(n,o,a),a):o instanceof F.Name?(e(n,a,o),o):r(o,a);return s===F.Name&&!(c instanceof F.Name)?i(n,c):c}}$.mergeEvaluated={props:Vc({mergeNames:(t,e,r)=>t.if((0,F._)`${r} !== true && ${e} !== undefined`,()=>{t.if((0,F._)`${e} === true`,()=>t.assign(r,!0),()=>t.assign(r,(0,F._)`${r} || {}`).code((0,F._)`Object.assign(${r}, ${e})`))}),mergeToName:(t,e,r)=>t.if((0,F._)`${r} !== true`,()=>{e===!0?t.assign(r,!0):(t.assign(r,(0,F._)`${r} || {}`),Bo(t,r,e))}),mergeValues:(t,e)=>t===!0?!0:{...t,...e},resultToName:Bc}),items:Vc({mergeNames:(t,e,r)=>t.if((0,F._)`${r} !== true && ${e} !== undefined`,()=>t.assign(r,(0,F._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),mergeToName:(t,e,r)=>t.if((0,F._)`${r} !== true`,()=>t.assign(r,e===!0?!0:(0,F._)`${r} > ${e} ? ${r} : ${e}`)),mergeValues:(t,e)=>t===!0?!0:Math.max(t,e),resultToName:(t,e)=>t.var("items",e)})};function Bc(t,e){if(e===!0)return t.var("props",!0);let r=t.var("props",(0,F._)`{}`);return e!==void 0&&Bo(t,r,e),r}$.evaluatedPropsToName=Bc;function Bo(t,e,r){Object.keys(r).forEach(i=>t.assign((0,F._)`${e}${(0,F.getProperty)(i)}`,!0))}$.setEvaluated=Bo;var Hc={};function Cg(t,e){return t.scopeValue("func",{ref:e,code:Hc[e.code]||(Hc[e.code]=new wg._Code(e.code))})}$.useFunc=Cg;var Lo;(function(t){t[t.Num=0]="Num",t[t.Str=1]="Str"})(Lo||($.Type=Lo={}));function Dg(t,e,r){if(t instanceof F.Name){let i=e===Lo.Num;return r?i?(0,F._)`"[" + ${t} + "]"`:(0,F._)`"['" + ${t} + "']"`:i?(0,F._)`"/" + ${t}`:(0,F._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`}return r?(0,F.getProperty)(t).toString():"/"+zo(t)}$.getErrorPath=Dg;function Uc(t,e,r=t.opts.strictSchema){if(r){if(e=`strict mode: ${e}`,r===!0)throw new Error(e);t.self.logger.warn(e)}}$.checkStrictMode=Uc});var nt=w(Uo=>{"use strict";Object.defineProperty(Uo,"__esModule",{value:!0});var ue=M(),Rg={data:new ue.Name("data"),valCxt:new ue.Name("valCxt"),instancePath:new ue.Name("instancePath"),parentData:new ue.Name("parentData"),parentDataProperty:new ue.Name("parentDataProperty"),rootData:new ue.Name("rootData"),dynamicAnchors:new ue.Name("dynamicAnchors"),vErrors:new ue.Name("vErrors"),errors:new ue.Name("errors"),this:new ue.Name("this"),self:new ue.Name("self"),scope:new ue.Name("scope"),json:new ue.Name("json"),jsonPos:new ue.Name("jsonPos"),jsonLen:new ue.Name("jsonLen"),jsonPart:new ue.Name("jsonPart")};Uo.default=Rg});var Ur=w(le=>{"use strict";Object.defineProperty(le,"__esModule",{value:!0});le.extendErrors=le.resetErrorsCount=le.reportExtraError=le.reportError=le.keyword$DataError=le.keywordError=void 0;var N=M(),on=O(),ye=nt();le.keywordError={message:({keyword:t})=>(0,N.str)`must pass "${t}" keyword validation`};le.keyword$DataError={message:({keyword:t,schemaType:e})=>e?(0,N.str)`"${t}" keyword must be ${e} ($data)`:(0,N.str)`"${t}" keyword is invalid ($data)`};function Mg(t,e=le.keywordError,r,i){let{it:n}=t,{gen:o,compositeRule:a,allErrors:s}=n,c=Yc(t,e,r);i??(a||s)?Gc(o,c):Wc(n,(0,N._)`[${c}]`)}le.reportError=Mg;function _g(t,e=le.keywordError,r){let{it:i}=t,{gen:n,compositeRule:o,allErrors:a}=i,s=Yc(t,e,r);Gc(n,s),o||a||Wc(i,ye.default.vErrors)}le.reportExtraError=_g;function $g(t,e){t.assign(ye.default.errors,e),t.if((0,N._)`${ye.default.vErrors} !== null`,()=>t.if(e,()=>t.assign((0,N._)`${ye.default.vErrors}.length`,e),()=>t.assign(ye.default.vErrors,null)))}le.resetErrorsCount=$g;function kg({gen:t,keyword:e,schemaValue:r,data:i,errsCount:n,it:o}){if(n===void 0)throw new Error("ajv implementation error");let a=t.name("err");t.forRange("i",n,ye.default.errors,s=>{t.const(a,(0,N._)`${ye.default.vErrors}[${s}]`),t.if((0,N._)`${a}.instancePath === undefined`,()=>t.assign((0,N._)`${a}.instancePath`,(0,N.strConcat)(ye.default.instancePath,o.errorPath))),t.assign((0,N._)`${a}.schemaPath`,(0,N.str)`${o.errSchemaPath}/${e}`),o.opts.verbose&&(t.assign((0,N._)`${a}.schema`,r),t.assign((0,N._)`${a}.data`,i))})}le.extendErrors=kg;function Gc(t,e){let r=t.const("err",e);t.if((0,N._)`${ye.default.vErrors} === null`,()=>t.assign(ye.default.vErrors,(0,N._)`[${r}]`),(0,N._)`${ye.default.vErrors}.push(${r})`),t.code((0,N._)`${ye.default.errors}++`)}function Wc(t,e){let{gen:r,validateName:i,schemaEnv:n}=t;n.$async?r.throw((0,N._)`new ${t.ValidationError}(${e})`):(r.assign((0,N._)`${i}.errors`,e),r.return(!1))}var Tt={keyword:new N.Name("keyword"),schemaPath:new N.Name("schemaPath"),params:new N.Name("params"),propertyName:new N.Name("propertyName"),message:new N.Name("message"),schema:new N.Name("schema"),parentSchema:new N.Name("parentSchema")};function Yc(t,e,r){let{createErrors:i}=t.it;return i===!1?(0,N._)`{}`:Ag(t,e,r)}function Ag(t,e,r={}){let{gen:i,it:n}=t,o=[Tg(n,r),Og(t,r)];return Ng(t,e,o),i.object(...o)}function Tg({errorPath:t},{instancePath:e}){let r=e?(0,N.str)`${t}${(0,on.getErrorPath)(e,on.Type.Str)}`:t;return[ye.default.instancePath,(0,N.strConcat)(ye.default.instancePath,r)]}function Og({keyword:t,it:{errSchemaPath:e}},{schemaPath:r,parentSchema:i}){let n=i?e:(0,N.str)`${e}/${t}`;return r&&(n=(0,N.str)`${n}${(0,on.getErrorPath)(r,on.Type.Str)}`),[Tt.schemaPath,n]}function Ng(t,{params:e,message:r},i){let{keyword:n,data:o,schemaValue:a,it:s}=t,{opts:c,propertyName:d,topSchemaRef:u,schemaPath:l}=s;i.push([Tt.keyword,n],[Tt.params,typeof e=="function"?e(t):e||(0,N._)`{}`]),c.messages&&i.push([Tt.message,typeof r=="function"?r(t):r]),c.verbose&&i.push([Tt.schema,a],[Tt.parentSchema,(0,N._)`${u}${l}`],[ye.default.data,o]),d&&i.push([Tt.propertyName,d])}});var Kc=w(or=>{"use strict";Object.defineProperty(or,"__esModule",{value:!0});or.boolOrEmptySchema=or.topBoolOrEmptySchema=void 0;var qg=Ur(),Vg=M(),Hg=nt(),Fg={message:"boolean schema is false"};function Lg(t){let{gen:e,schema:r,validateName:i}=t;r===!1?Jc(t,!1):typeof r=="object"&&r.$async===!0?e.return(Hg.default.data):(e.assign((0,Vg._)`${i}.errors`,null),e.return(!0))}or.topBoolOrEmptySchema=Lg;function zg(t,e){let{gen:r,schema:i}=t;i===!1?(r.var(e,!1),Jc(t)):r.var(e,!0)}or.boolOrEmptySchema=zg;function Jc(t,e){let{gen:r,data:i}=t,n={gen:r,keyword:"false schema",data:i,schema:!1,schemaCode:!1,schemaValue:!1,params:{},it:t};(0,qg.reportError)(n,Fg,void 0,e)}});var Go=w(ar=>{"use strict";Object.defineProperty(ar,"__esModule",{value:!0});ar.getRules=ar.isJSONType=void 0;var Bg=["string","number","integer","boolean","null","object","array"],Ug=new Set(Bg);function Gg(t){return typeof t=="string"&&Ug.has(t)}ar.isJSONType=Gg;function Wg(){let t={number:{type:"number",rules:[]},string:{type:"string",rules:[]},array:{type:"array",rules:[]},object:{type:"object",rules:[]}};return{types:{...t,integer:!0,boolean:!0,null:!0},rules:[{rules:[]},t.number,t.string,t.array,t.object],post:{rules:[]},all:{},keywords:{}}}ar.getRules=Wg});var Wo=w(yt=>{"use strict";Object.defineProperty(yt,"__esModule",{value:!0});yt.shouldUseRule=yt.shouldUseGroup=yt.schemaHasRulesForType=void 0;function Yg({schema:t,self:e},r){let i=e.RULES.types[r];return i&&i!==!0&&Xc(t,i)}yt.schemaHasRulesForType=Yg;function Xc(t,e){return e.rules.some(r=>Qc(t,r))}yt.shouldUseGroup=Xc;function Qc(t,e){var r;return t[e.keyword]!==void 0||((r=e.definition.implements)===null||r===void 0?void 0:r.some(i=>t[i]!==void 0))}yt.shouldUseRule=Qc});var Gr=w(pe=>{"use strict";Object.defineProperty(pe,"__esModule",{value:!0});pe.reportTypeError=pe.checkDataTypes=pe.checkDataType=pe.coerceAndCheckDataType=pe.getJSONTypes=pe.getSchemaTypes=pe.DataType=void 0;var Jg=Go(),Kg=Wo(),Xg=Ur(),R=M(),Zc=O(),sr;(function(t){t[t.Correct=0]="Correct",t[t.Wrong=1]="Wrong"})(sr||(pe.DataType=sr={}));function Qg(t){let e=ed(t.type);if(e.includes("null")){if(t.nullable===!1)throw new Error("type: null contradicts nullable: false")}else{if(!e.length&&t.nullable!==void 0)throw new Error('"nullable" cannot be used without "type"');t.nullable===!0&&e.push("null")}return e}pe.getSchemaTypes=Qg;function ed(t){let e=Array.isArray(t)?t:t?[t]:[];if(e.every(Jg.isJSONType))return e;throw new Error("type must be JSONType or JSONType[]: "+e.join(","))}pe.getJSONTypes=ed;function Zg(t,e){let{gen:r,data:i,opts:n}=t,o=ev(e,n.coerceTypes),a=e.length>0&&!(o.length===0&&e.length===1&&(0,Kg.schemaHasRulesForType)(t,e[0]));if(a){let s=Jo(e,i,n.strictNumbers,sr.Wrong);r.if(s,()=>{o.length?tv(t,e,o):Ko(t)})}return a}pe.coerceAndCheckDataType=Zg;var td=new Set(["string","number","integer","boolean","null"]);function ev(t,e){return e?t.filter(r=>td.has(r)||e==="array"&&r==="array"):[]}function tv(t,e,r){let{gen:i,data:n,opts:o}=t,a=i.let("dataType",(0,R._)`typeof ${n}`),s=i.let("coerced",(0,R._)`undefined`);o.coerceTypes==="array"&&i.if((0,R._)`${a} == 'object' && Array.isArray(${n}) && ${n}.length == 1`,()=>i.assign(n,(0,R._)`${n}[0]`).assign(a,(0,R._)`typeof ${n}`).if(Jo(e,n,o.strictNumbers),()=>i.assign(s,n))),i.if((0,R._)`${s} !== undefined`);for(let d of r)(td.has(d)||d==="array"&&o.coerceTypes==="array")&&c(d);i.else(),Ko(t),i.endIf(),i.if((0,R._)`${s} !== undefined`,()=>{i.assign(n,s),rv(t,s)});function c(d){switch(d){case"string":i.elseIf((0,R._)`${a} == "number" || ${a} == "boolean"`).assign(s,(0,R._)`"" + ${n}`).elseIf((0,R._)`${n} === null`).assign(s,(0,R._)`""`);return;case"number":i.elseIf((0,R._)`${a} == "boolean" || ${n} === null
              || (${a} == "string" && ${n} && ${n} == +${n})`).assign(s,(0,R._)`+${n}`);return;case"integer":i.elseIf((0,R._)`${a} === "boolean" || ${n} === null
              || (${a} === "string" && ${n} && ${n} == +${n} && !(${n} % 1))`).assign(s,(0,R._)`+${n}`);return;case"boolean":i.elseIf((0,R._)`${n} === "false" || ${n} === 0 || ${n} === null`).assign(s,!1).elseIf((0,R._)`${n} === "true" || ${n} === 1`).assign(s,!0);return;case"null":i.elseIf((0,R._)`${n} === "" || ${n} === 0 || ${n} === false`),i.assign(s,null);return;case"array":i.elseIf((0,R._)`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${n} === null`).assign(s,(0,R._)`[${n}]`)}}}function rv({gen:t,parentData:e,parentDataProperty:r},i){t.if((0,R._)`${e} !== undefined`,()=>t.assign((0,R._)`${e}[${r}]`,i))}function Yo(t,e,r,i=sr.Correct){let n=i===sr.Correct?R.operators.EQ:R.operators.NEQ,o;switch(t){case"null":return(0,R._)`${e} ${n} null`;case"array":o=(0,R._)`Array.isArray(${e})`;break;case"object":o=(0,R._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;break;case"integer":o=a((0,R._)`!(${e} % 1) && !isNaN(${e})`);break;case"number":o=a();break;default:return(0,R._)`typeof ${e} ${n} ${t}`}return i===sr.Correct?o:(0,R.not)(o);function a(s=R.nil){return(0,R.and)((0,R._)`typeof ${e} == "number"`,s,r?(0,R._)`isFinite(${e})`:R.nil)}}pe.checkDataType=Yo;function Jo(t,e,r,i){if(t.length===1)return Yo(t[0],e,r,i);let n,o=(0,Zc.toHash)(t);if(o.array&&o.object){let a=(0,R._)`typeof ${e} != "object"`;n=o.null?a:(0,R._)`!${e} || ${a}`,delete o.null,delete o.array,delete o.object}else n=R.nil;o.number&&delete o.integer;for(let a in o)n=(0,R.and)(n,Yo(a,e,r,i));return n}pe.checkDataTypes=Jo;var iv={message:({schema:t})=>`must be ${t}`,params:({schema:t,schemaValue:e})=>typeof t=="string"?(0,R._)`{type: ${t}}`:(0,R._)`{type: ${e}}`};function Ko(t){let e=nv(t);(0,Xg.reportError)(e,iv)}pe.reportTypeError=Ko;function nv(t){let{gen:e,data:r,schema:i}=t,n=(0,Zc.schemaRefOrVal)(t,i,"type");return{gen:e,keyword:"type",data:r,schema:i.type,schemaCode:n,schemaValue:n,parentSchema:i,params:{},it:t}}});var id=w(an=>{"use strict";Object.defineProperty(an,"__esModule",{value:!0});an.assignDefaults=void 0;var cr=M(),ov=O();function av(t,e){let{properties:r,items:i}=t.schema;if(e==="object"&&r)for(let n in r)rd(t,n,r[n].default);else e==="array"&&Array.isArray(i)&&i.forEach((n,o)=>rd(t,o,n.default))}an.assignDefaults=av;function rd(t,e,r){let{gen:i,compositeRule:n,data:o,opts:a}=t;if(r===void 0)return;let s=(0,cr._)`${o}${(0,cr.getProperty)(e)}`;if(n){(0,ov.checkStrictMode)(t,`default is ignored for: ${s}`);return}let c=(0,cr._)`${s} === undefined`;a.useDefaults==="empty"&&(c=(0,cr._)`${c} || ${s} === null || ${s} === ""`),i.if(c,(0,cr._)`${s} = ${(0,cr.stringify)(r)}`)}});var ke=w(H=>{"use strict";Object.defineProperty(H,"__esModule",{value:!0});H.validateUnion=H.validateArray=H.usePattern=H.callValidateCode=H.schemaProperties=H.allSchemaProperties=H.noPropertyInData=H.propertyInData=H.isOwnProperty=H.hasPropFunc=H.reportMissingProp=H.checkMissingProp=H.checkReportMissingProp=void 0;var z=M(),Xo=O(),wt=nt(),sv=O();function cv(t,e){let{gen:r,data:i,it:n}=t;r.if(Zo(r,i,e,n.opts.ownProperties),()=>{t.setParams({missingProperty:(0,z._)`${e}`},!0),t.error()})}H.checkReportMissingProp=cv;function dv({gen:t,data:e,it:{opts:r}},i,n){return(0,z.or)(...i.map(o=>(0,z.and)(Zo(t,e,o,r.ownProperties),(0,z._)`${n} = ${o}`)))}H.checkMissingProp=dv;function uv(t,e){t.setParams({missingProperty:e},!0),t.error()}H.reportMissingProp=uv;function nd(t){return t.scopeValue("func",{ref:Object.prototype.hasOwnProperty,code:(0,z._)`Object.prototype.hasOwnProperty`})}H.hasPropFunc=nd;function Qo(t,e,r){return(0,z._)`${nd(t)}.call(${e}, ${r})`}H.isOwnProperty=Qo;function lv(t,e,r,i){let n=(0,z._)`${e}${(0,z.getProperty)(r)} !== undefined`;return i?(0,z._)`${n} && ${Qo(t,e,r)}`:n}H.propertyInData=lv;function Zo(t,e,r,i){let n=(0,z._)`${e}${(0,z.getProperty)(r)} === undefined`;return i?(0,z.or)(n,(0,z.not)(Qo(t,e,r))):n}H.noPropertyInData=Zo;function od(t){return t?Object.keys(t).filter(e=>e!=="__proto__"):[]}H.allSchemaProperties=od;function pv(t,e){return od(e).filter(r=>!(0,Xo.alwaysValidSchema)(t,e[r]))}H.schemaProperties=pv;function fv({schemaCode:t,data:e,it:{gen:r,topSchemaRef:i,schemaPath:n,errorPath:o},it:a},s,c,d){let u=d?(0,z._)`${t}, ${e}, ${i}${n}`:e,l=[[wt.default.instancePath,(0,z.strConcat)(wt.default.instancePath,o)],[wt.default.parentData,a.parentData],[wt.default.parentDataProperty,a.parentDataProperty],[wt.default.rootData,wt.default.rootData]];a.opts.dynamicRef&&l.push([wt.default.dynamicAnchors,wt.default.dynamicAnchors]);let p=(0,z._)`${u}, ${r.object(...l)}`;return c!==z.nil?(0,z._)`${s}.call(${c}, ${p})`:(0,z._)`${s}(${p})`}H.callValidateCode=fv;var mv=(0,z._)`new RegExp`;function hv({gen:t,it:{opts:e}},r){let i=e.unicodeRegExp?"u":"",{regExp:n}=e.code,o=n(r,i);return t.scopeValue("pattern",{key:o.toString(),ref:o,code:(0,z._)`${n.code==="new RegExp"?mv:(0,sv.useFunc)(t,n)}(${r}, ${i})`})}H.usePattern=hv;function gv(t){let{gen:e,data:r,keyword:i,it:n}=t,o=e.name("valid");if(n.allErrors){let s=e.let("valid",!0);return a(()=>e.assign(s,!1)),s}return e.var(o,!0),a(()=>e.break()),o;function a(s){let c=e.const("len",(0,z._)`${r}.length`);e.forRange("i",0,c,d=>{t.subschema({keyword:i,dataProp:d,dataPropType:Xo.Type.Num},o),e.if((0,z.not)(o),s)})}}H.validateArray=gv;function vv(t){let{gen:e,schema:r,keyword:i,it:n}=t;if(!Array.isArray(r))throw new Error("ajv implementation error");if(r.some(c=>(0,Xo.alwaysValidSchema)(n,c))&&!n.opts.unevaluated)return;let a=e.let("valid",!1),s=e.name("_valid");e.block(()=>r.forEach((c,d)=>{let u=t.subschema({keyword:i,schemaProp:d,compositeRule:!0},s);e.assign(a,(0,z._)`${a} || ${s}`),t.mergeValidEvaluated(u,s)||e.if((0,z.not)(a))})),t.result(a,()=>t.reset(),()=>t.error(!0))}H.validateUnion=vv});var cd=w(Je=>{"use strict";Object.defineProperty(Je,"__esModule",{value:!0});Je.validateKeywordUsage=Je.validSchemaType=Je.funcKeywordCode=Je.macroKeywordCode=void 0;var we=M(),Ot=nt(),yv=ke(),wv=Ur();function xv(t,e){let{gen:r,keyword:i,schema:n,parentSchema:o,it:a}=t,s=e.macro.call(a.self,n,o,a),c=sd(r,i,s);a.opts.validateSchema!==!1&&a.self.validateSchema(s,!0);let d=r.name("valid");t.subschema({schema:s,schemaPath:we.nil,errSchemaPath:`${a.errSchemaPath}/${i}`,topSchemaRef:c,compositeRule:!0},d),t.pass(d,()=>t.error(!0))}Je.macroKeywordCode=xv;function Pv(t,e){var r;let{gen:i,keyword:n,schema:o,parentSchema:a,$data:s,it:c}=t;Iv(c,e);let d=!s&&e.compile?e.compile.call(c.self,o,a,c):e.validate,u=sd(i,n,d),l=i.let("valid");t.block$data(l,p),t.ok((r=e.valid)!==null&&r!==void 0?r:l);function p(){if(e.errors===!1)f(),e.modifying&&ad(t),v(()=>t.error());else{let y=e.async?m():h();e.modifying&&ad(t),v(()=>bv(t,y))}}function m(){let y=i.let("ruleErrs",null);return i.try(()=>f((0,we._)`await `),I=>i.assign(l,!1).if((0,we._)`${I} instanceof ${c.ValidationError}`,()=>i.assign(y,(0,we._)`${I}.errors`),()=>i.throw(I))),y}function h(){let y=(0,we._)`${u}.errors`;return i.assign(y,null),f(we.nil),y}function f(y=e.async?(0,we._)`await `:we.nil){let I=c.opts.passContext?Ot.default.this:Ot.default.self,P=!("compile"in e&&!s||e.schema===!1);i.assign(l,(0,we._)`${y}${(0,yv.callValidateCode)(t,u,I,P)}`,e.modifying)}function v(y){var I;i.if((0,we.not)((I=e.valid)!==null&&I!==void 0?I:l),y)}}Je.funcKeywordCode=Pv;function ad(t){let{gen:e,data:r,it:i}=t;e.if(i.parentData,()=>e.assign(r,(0,we._)`${i.parentData}[${i.parentDataProperty}]`))}function bv(t,e){let{gen:r}=t;r.if((0,we._)`Array.isArray(${e})`,()=>{r.assign(Ot.default.vErrors,(0,we._)`${Ot.default.vErrors} === null ? ${e} : ${Ot.default.vErrors}.concat(${e})`).assign(Ot.default.errors,(0,we._)`${Ot.default.vErrors}.length`),(0,wv.extendErrors)(t)},()=>t.error())}function Iv({schemaEnv:t},e){if(e.async&&!t.$async)throw new Error("async keyword in sync schema")}function sd(t,e,r){if(r===void 0)throw new Error(`keyword "${e}" failed to compile`);return t.scopeValue("keyword",typeof r=="function"?{ref:r}:{ref:r,code:(0,we.stringify)(r)})}function Sv(t,e,r=!1){return!e.length||e.some(i=>i==="array"?Array.isArray(t):i==="object"?t&&typeof t=="object"&&!Array.isArray(t):typeof t==i||r&&typeof t>"u")}Je.validSchemaType=Sv;function Ev({schema:t,opts:e,self:r,errSchemaPath:i},n,o){if(Array.isArray(n.keyword)?!n.keyword.includes(o):n.keyword!==o)throw new Error("ajv implementation error");let a=n.dependencies;if(a?.some(s=>!Object.prototype.hasOwnProperty.call(t,s)))throw new Error(`parent schema must have dependencies of ${o}: ${a.join(",")}`);if(n.validateSchema&&!n.validateSchema(t[o])){let c=`keyword "${o}" value is invalid at path "${i}": `+r.errorsText(n.validateSchema.errors);if(e.validateSchema==="log")r.logger.error(c);else throw new Error(c)}}Je.validateKeywordUsage=Ev});var ud=w(xt=>{"use strict";Object.defineProperty(xt,"__esModule",{value:!0});xt.extendSubschemaMode=xt.extendSubschemaData=xt.getSubschema=void 0;var Ke=M(),dd=O();function jv(t,{keyword:e,schemaProp:r,schema:i,schemaPath:n,errSchemaPath:o,topSchemaRef:a}){if(e!==void 0&&i!==void 0)throw new Error('both "keyword" and "schema" passed, only one allowed');if(e!==void 0){let s=t.schema[e];return r===void 0?{schema:s,schemaPath:(0,Ke._)`${t.schemaPath}${(0,Ke.getProperty)(e)}`,errSchemaPath:`${t.errSchemaPath}/${e}`}:{schema:s[r],schemaPath:(0,Ke._)`${t.schemaPath}${(0,Ke.getProperty)(e)}${(0,Ke.getProperty)(r)}`,errSchemaPath:`${t.errSchemaPath}/${e}/${(0,dd.escapeFragment)(r)}`}}if(i!==void 0){if(n===void 0||o===void 0||a===void 0)throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');return{schema:i,schemaPath:n,topSchemaRef:a,errSchemaPath:o}}throw new Error('either "keyword" or "schema" must be passed')}xt.getSubschema=jv;function Cv(t,e,{dataProp:r,dataPropType:i,data:n,dataTypes:o,propertyName:a}){if(n!==void 0&&r!==void 0)throw new Error('both "data" and "dataProp" passed, only one allowed');let{gen:s}=e;if(r!==void 0){let{errorPath:d,dataPathArr:u,opts:l}=e,p=s.let("data",(0,Ke._)`${e.data}${(0,Ke.getProperty)(r)}`,!0);c(p),t.errorPath=(0,Ke.str)`${d}${(0,dd.getErrorPath)(r,i,l.jsPropertySyntax)}`,t.parentDataProperty=(0,Ke._)`${r}`,t.dataPathArr=[...u,t.parentDataProperty]}if(n!==void 0){let d=n instanceof Ke.Name?n:s.let("data",n,!0);c(d),a!==void 0&&(t.propertyName=a)}o&&(t.dataTypes=o);function c(d){t.data=d,t.dataLevel=e.dataLevel+1,t.dataTypes=[],e.definedProperties=new Set,t.parentData=e.data,t.dataNames=[...e.dataNames,d]}}xt.extendSubschemaData=Cv;function Dv(t,{jtdDiscriminator:e,jtdMetadata:r,compositeRule:i,createErrors:n,allErrors:o}){i!==void 0&&(t.compositeRule=i),n!==void 0&&(t.createErrors=n),o!==void 0&&(t.allErrors=o),t.jtdDiscriminator=e,t.jtdMetadata=r}xt.extendSubschemaMode=Dv});var ea=w((Ej,ld)=>{"use strict";ld.exports=function t(e,r){if(e===r)return!0;if(e&&r&&typeof e=="object"&&typeof r=="object"){if(e.constructor!==r.constructor)return!1;var i,n,o;if(Array.isArray(e)){if(i=e.length,i!=r.length)return!1;for(n=i;n--!==0;)if(!t(e[n],r[n]))return!1;return!0}if(e.constructor===RegExp)return e.source===r.source&&e.flags===r.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===r.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===r.toString();if(o=Object.keys(e),i=o.length,i!==Object.keys(r).length)return!1;for(n=i;n--!==0;)if(!Object.prototype.hasOwnProperty.call(r,o[n]))return!1;for(n=i;n--!==0;){var a=o[n];if(!t(e[a],r[a]))return!1}return!0}return e!==e&&r!==r}});var fd=w((jj,pd)=>{"use strict";var Pt=pd.exports=function(t,e,r){typeof e=="function"&&(r=e,e={}),r=e.cb||r;var i=typeof r=="function"?r:r.pre||function(){},n=r.post||function(){};sn(e,i,n,t,"",t)};Pt.keywords={additionalItems:!0,items:!0,contains:!0,additionalProperties:!0,propertyNames:!0,not:!0,if:!0,then:!0,else:!0};Pt.arrayKeywords={items:!0,allOf:!0,anyOf:!0,oneOf:!0};Pt.propsKeywords={$defs:!0,definitions:!0,properties:!0,patternProperties:!0,dependencies:!0};Pt.skipKeywords={default:!0,enum:!0,const:!0,required:!0,maximum:!0,minimum:!0,exclusiveMaximum:!0,exclusiveMinimum:!0,multipleOf:!0,maxLength:!0,minLength:!0,pattern:!0,format:!0,maxItems:!0,minItems:!0,uniqueItems:!0,maxProperties:!0,minProperties:!0};function sn(t,e,r,i,n,o,a,s,c,d){if(i&&typeof i=="object"&&!Array.isArray(i)){e(i,n,o,a,s,c,d);for(var u in i){var l=i[u];if(Array.isArray(l)){if(u in Pt.arrayKeywords)for(var p=0;p<l.length;p++)sn(t,e,r,l[p],n+"/"+u+"/"+p,o,n,u,i,p)}else if(u in Pt.propsKeywords){if(l&&typeof l=="object")for(var m in l)sn(t,e,r,l[m],n+"/"+u+"/"+Rv(m),o,n,u,i,m)}else(u in Pt.keywords||t.allKeys&&!(u in Pt.skipKeywords))&&sn(t,e,r,l,n+"/"+u,o,n,u,i)}r(i,n,o,a,s,c,d)}}function Rv(t){return t.replace(/~/g,"~0").replace(/\//g,"~1")}});var Wr=w(De=>{"use strict";Object.defineProperty(De,"__esModule",{value:!0});De.getSchemaRefs=De.resolveUrl=De.normalizeId=De._getFullPath=De.getFullPath=De.inlineRef=void 0;var Mv=O(),_v=ea(),$v=fd(),kv=new Set(["type","format","pattern","maxLength","minLength","maxProperties","minProperties","maxItems","minItems","maximum","minimum","uniqueItems","multipleOf","required","enum","const"]);function Av(t,e=!0){return typeof t=="boolean"?!0:e===!0?!ta(t):e?md(t)<=e:!1}De.inlineRef=Av;var Tv=new Set(["$ref","$recursiveRef","$recursiveAnchor","$dynamicRef","$dynamicAnchor"]);function ta(t){for(let e in t){if(Tv.has(e))return!0;let r=t[e];if(Array.isArray(r)&&r.some(ta)||typeof r=="object"&&ta(r))return!0}return!1}function md(t){let e=0;for(let r in t){if(r==="$ref")return 1/0;if(e++,!kv.has(r)&&(typeof t[r]=="object"&&(0,Mv.eachItem)(t[r],i=>e+=md(i)),e===1/0))return 1/0}return e}function hd(t,e="",r){r!==!1&&(e=dr(e));let i=t.parse(e);return gd(t,i)}De.getFullPath=hd;function gd(t,e){return t.serialize(e).split("#")[0]+"#"}De._getFullPath=gd;var Ov=/#\/?$/;function dr(t){return t?t.replace(Ov,""):""}De.normalizeId=dr;function Nv(t,e,r){return r=dr(r),t.resolve(e,r)}De.resolveUrl=Nv;var qv=/^[a-z_][-a-z0-9._]*$/i;function Vv(t,e){if(typeof t=="boolean")return{};let{schemaId:r,uriResolver:i}=this.opts,n=dr(t[r]||e),o={"":n},a=hd(i,n,!1),s={},c=new Set;return $v(t,{allKeys:!0},(l,p,m,h)=>{if(h===void 0)return;let f=a+p,v=o[h];typeof l[r]=="string"&&(v=y.call(this,l[r])),I.call(this,l.$anchor),I.call(this,l.$dynamicAnchor),o[p]=v;function y(P){let j=this.opts.uriResolver.resolve;if(P=dr(v?j(v,P):P),c.has(P))throw u(P);c.add(P);let b=this.refs[P];return typeof b=="string"&&(b=this.refs[b]),typeof b=="object"?d(l,b.schema,P):P!==dr(f)&&(P[0]==="#"?(d(l,s[P],P),s[P]=l):this.refs[P]=f),P}function I(P){if(typeof P=="string"){if(!qv.test(P))throw new Error(`invalid anchor "${P}"`);y.call(this,`#${P}`)}}}),s;function d(l,p,m){if(p!==void 0&&!_v(l,p))throw u(m)}function u(l){return new Error(`reference "${l}" resolves to more than one schema`)}}De.getSchemaRefs=Vv});var Kr=w(bt=>{"use strict";Object.defineProperty(bt,"__esModule",{value:!0});bt.getData=bt.KeywordCxt=bt.validateFunctionCode=void 0;var Pd=Kc(),vd=Gr(),ia=Wo(),cn=Gr(),Hv=id(),Jr=cd(),ra=ud(),x=M(),E=nt(),Fv=Wr(),ot=O(),Yr=Ur();function Lv(t){if(Sd(t)&&(Ed(t),Id(t))){Uv(t);return}bd(t,()=>(0,Pd.topBoolOrEmptySchema)(t))}bt.validateFunctionCode=Lv;function bd({gen:t,validateName:e,schema:r,schemaEnv:i,opts:n},o){n.code.es5?t.func(e,(0,x._)`${E.default.data}, ${E.default.valCxt}`,i.$async,()=>{t.code((0,x._)`"use strict"; ${yd(r,n)}`),Bv(t,n),t.code(o)}):t.func(e,(0,x._)`${E.default.data}, ${zv(n)}`,i.$async,()=>t.code(yd(r,n)).code(o))}function zv(t){return(0,x._)`{${E.default.instancePath}="", ${E.default.parentData}, ${E.default.parentDataProperty}, ${E.default.rootData}=${E.default.data}${t.dynamicRef?(0,x._)`, ${E.default.dynamicAnchors}={}`:x.nil}}={}`}function Bv(t,e){t.if(E.default.valCxt,()=>{t.var(E.default.instancePath,(0,x._)`${E.default.valCxt}.${E.default.instancePath}`),t.var(E.default.parentData,(0,x._)`${E.default.valCxt}.${E.default.parentData}`),t.var(E.default.parentDataProperty,(0,x._)`${E.default.valCxt}.${E.default.parentDataProperty}`),t.var(E.default.rootData,(0,x._)`${E.default.valCxt}.${E.default.rootData}`),e.dynamicRef&&t.var(E.default.dynamicAnchors,(0,x._)`${E.default.valCxt}.${E.default.dynamicAnchors}`)},()=>{t.var(E.default.instancePath,(0,x._)`""`),t.var(E.default.parentData,(0,x._)`undefined`),t.var(E.default.parentDataProperty,(0,x._)`undefined`),t.var(E.default.rootData,E.default.data),e.dynamicRef&&t.var(E.default.dynamicAnchors,(0,x._)`{}`)})}function Uv(t){let{schema:e,opts:r,gen:i}=t;bd(t,()=>{r.$comment&&e.$comment&&Cd(t),Kv(t),i.let(E.default.vErrors,null),i.let(E.default.errors,0),r.unevaluated&&Gv(t),jd(t),Zv(t)})}function Gv(t){let{gen:e,validateName:r}=t;t.evaluated=e.const("evaluated",(0,x._)`${r}.evaluated`),e.if((0,x._)`${t.evaluated}.dynamicProps`,()=>e.assign((0,x._)`${t.evaluated}.props`,(0,x._)`undefined`)),e.if((0,x._)`${t.evaluated}.dynamicItems`,()=>e.assign((0,x._)`${t.evaluated}.items`,(0,x._)`undefined`))}function yd(t,e){let r=typeof t=="object"&&t[e.schemaId];return r&&(e.code.source||e.code.process)?(0,x._)`/*# sourceURL=${r} */`:x.nil}function Wv(t,e){if(Sd(t)&&(Ed(t),Id(t))){Yv(t,e);return}(0,Pd.boolOrEmptySchema)(t,e)}function Id({schema:t,self:e}){if(typeof t=="boolean")return!t;for(let r in t)if(e.RULES.all[r])return!0;return!1}function Sd(t){return typeof t.schema!="boolean"}function Yv(t,e){let{schema:r,gen:i,opts:n}=t;n.$comment&&r.$comment&&Cd(t),Xv(t),Qv(t);let o=i.const("_errs",E.default.errors);jd(t,o),i.var(e,(0,x._)`${o} === ${E.default.errors}`)}function Ed(t){(0,ot.checkUnknownRules)(t),Jv(t)}function jd(t,e){if(t.opts.jtd)return wd(t,[],!1,e);let r=(0,vd.getSchemaTypes)(t.schema),i=(0,vd.coerceAndCheckDataType)(t,r);wd(t,r,!i,e)}function Jv(t){let{schema:e,errSchemaPath:r,opts:i,self:n}=t;e.$ref&&i.ignoreKeywordsWithRef&&(0,ot.schemaHasRulesButRef)(e,n.RULES)&&n.logger.warn(`$ref: keywords ignored in schema at path "${r}"`)}function Kv(t){let{schema:e,opts:r}=t;e.default!==void 0&&r.useDefaults&&r.strictSchema&&(0,ot.checkStrictMode)(t,"default is ignored in the schema root")}function Xv(t){let e=t.schema[t.opts.schemaId];e&&(t.baseId=(0,Fv.resolveUrl)(t.opts.uriResolver,t.baseId,e))}function Qv(t){if(t.schema.$async&&!t.schemaEnv.$async)throw new Error("async schema in sync schema")}function Cd({gen:t,schemaEnv:e,schema:r,errSchemaPath:i,opts:n}){let o=r.$comment;if(n.$comment===!0)t.code((0,x._)`${E.default.self}.logger.log(${o})`);else if(typeof n.$comment=="function"){let a=(0,x.str)`${i}/$comment`,s=t.scopeValue("root",{ref:e.root});t.code((0,x._)`${E.default.self}.opts.$comment(${o}, ${a}, ${s}.schema)`)}}function Zv(t){let{gen:e,schemaEnv:r,validateName:i,ValidationError:n,opts:o}=t;r.$async?e.if((0,x._)`${E.default.errors} === 0`,()=>e.return(E.default.data),()=>e.throw((0,x._)`new ${n}(${E.default.vErrors})`)):(e.assign((0,x._)`${i}.errors`,E.default.vErrors),o.unevaluated&&ey(t),e.return((0,x._)`${E.default.errors} === 0`))}function ey({gen:t,evaluated:e,props:r,items:i}){r instanceof x.Name&&t.assign((0,x._)`${e}.props`,r),i instanceof x.Name&&t.assign((0,x._)`${e}.items`,i)}function wd(t,e,r,i){let{gen:n,schema:o,data:a,allErrors:s,opts:c,self:d}=t,{RULES:u}=d;if(o.$ref&&(c.ignoreKeywordsWithRef||!(0,ot.schemaHasRulesButRef)(o,u))){n.block(()=>Rd(t,"$ref",u.all.$ref.definition));return}c.jtd||ty(t,e),n.block(()=>{for(let p of u.rules)l(p);l(u.post)});function l(p){(0,ia.shouldUseGroup)(o,p)&&(p.type?(n.if((0,cn.checkDataType)(p.type,a,c.strictNumbers)),xd(t,p),e.length===1&&e[0]===p.type&&r&&(n.else(),(0,cn.reportTypeError)(t)),n.endIf()):xd(t,p),s||n.if((0,x._)`${E.default.errors} === ${i||0}`))}}function xd(t,e){let{gen:r,schema:i,opts:{useDefaults:n}}=t;n&&(0,Hv.assignDefaults)(t,e.type),r.block(()=>{for(let o of e.rules)(0,ia.shouldUseRule)(i,o)&&Rd(t,o.keyword,o.definition,e.type)})}function ty(t,e){t.schemaEnv.meta||!t.opts.strictTypes||(ry(t,e),t.opts.allowUnionTypes||iy(t,e),ny(t,t.dataTypes))}function ry(t,e){if(e.length){if(!t.dataTypes.length){t.dataTypes=e;return}e.forEach(r=>{Dd(t.dataTypes,r)||na(t,`type "${r}" not allowed by context "${t.dataTypes.join(",")}"`)}),ay(t,e)}}function iy(t,e){e.length>1&&!(e.length===2&&e.includes("null"))&&na(t,"use allowUnionTypes to allow union type keyword")}function ny(t,e){let r=t.self.RULES.all;for(let i in r){let n=r[i];if(typeof n=="object"&&(0,ia.shouldUseRule)(t.schema,n)){let{type:o}=n.definition;o.length&&!o.some(a=>oy(e,a))&&na(t,`missing type "${o.join(",")}" for keyword "${i}"`)}}}function oy(t,e){return t.includes(e)||e==="number"&&t.includes("integer")}function Dd(t,e){return t.includes(e)||e==="integer"&&t.includes("number")}function ay(t,e){let r=[];for(let i of t.dataTypes)Dd(e,i)?r.push(i):e.includes("integer")&&i==="number"&&r.push("integer");t.dataTypes=r}function na(t,e){let r=t.schemaEnv.baseId+t.errSchemaPath;e+=` at "${r}" (strictTypes)`,(0,ot.checkStrictMode)(t,e,t.opts.strictTypes)}var dn=class{constructor(e,r,i){if((0,Jr.validateKeywordUsage)(e,r,i),this.gen=e.gen,this.allErrors=e.allErrors,this.keyword=i,this.data=e.data,this.schema=e.schema[i],this.$data=r.$data&&e.opts.$data&&this.schema&&this.schema.$data,this.schemaValue=(0,ot.schemaRefOrVal)(e,this.schema,i,this.$data),this.schemaType=r.schemaType,this.parentSchema=e.schema,this.params={},this.it=e,this.def=r,this.$data)this.schemaCode=e.gen.const("vSchema",Md(this.$data,e));else if(this.schemaCode=this.schemaValue,!(0,Jr.validSchemaType)(this.schema,r.schemaType,r.allowUndefined))throw new Error(`${i} value must be ${JSON.stringify(r.schemaType)}`);("code"in r?r.trackErrors:r.errors!==!1)&&(this.errsCount=e.gen.const("_errs",E.default.errors))}result(e,r,i){this.failResult((0,x.not)(e),r,i)}failResult(e,r,i){this.gen.if(e),i?i():this.error(),r?(this.gen.else(),r(),this.allErrors&&this.gen.endIf()):this.allErrors?this.gen.endIf():this.gen.else()}pass(e,r){this.failResult((0,x.not)(e),void 0,r)}fail(e){if(e===void 0){this.error(),this.allErrors||this.gen.if(!1);return}this.gen.if(e),this.error(),this.allErrors?this.gen.endIf():this.gen.else()}fail$data(e){if(!this.$data)return this.fail(e);let{schemaCode:r}=this;this.fail((0,x._)`${r} !== undefined && (${(0,x.or)(this.invalid$data(),e)})`)}error(e,r,i){if(r){this.setParams(r),this._error(e,i),this.setParams({});return}this._error(e,i)}_error(e,r){(e?Yr.reportExtraError:Yr.reportError)(this,this.def.error,r)}$dataError(){(0,Yr.reportError)(this,this.def.$dataError||Yr.keyword$DataError)}reset(){if(this.errsCount===void 0)throw new Error('add "trackErrors" to keyword definition');(0,Yr.resetErrorsCount)(this.gen,this.errsCount)}ok(e){this.allErrors||this.gen.if(e)}setParams(e,r){r?Object.assign(this.params,e):this.params=e}block$data(e,r,i=x.nil){this.gen.block(()=>{this.check$data(e,i),r()})}check$data(e=x.nil,r=x.nil){if(!this.$data)return;let{gen:i,schemaCode:n,schemaType:o,def:a}=this;i.if((0,x.or)((0,x._)`${n} === undefined`,r)),e!==x.nil&&i.assign(e,!0),(o.length||a.validateSchema)&&(i.elseIf(this.invalid$data()),this.$dataError(),e!==x.nil&&i.assign(e,!1)),i.else()}invalid$data(){let{gen:e,schemaCode:r,schemaType:i,def:n,it:o}=this;return(0,x.or)(a(),s());function a(){if(i.length){if(!(r instanceof x.Name))throw new Error("ajv implementation error");let c=Array.isArray(i)?i:[i];return(0,x._)`${(0,cn.checkDataTypes)(c,r,o.opts.strictNumbers,cn.DataType.Wrong)}`}return x.nil}function s(){if(n.validateSchema){let c=e.scopeValue("validate$data",{ref:n.validateSchema});return(0,x._)`!${c}(${r})`}return x.nil}}subschema(e,r){let i=(0,ra.getSubschema)(this.it,e);(0,ra.extendSubschemaData)(i,this.it,e),(0,ra.extendSubschemaMode)(i,e);let n={...this.it,...i,items:void 0,props:void 0};return Wv(n,r),n}mergeEvaluated(e,r){let{it:i,gen:n}=this;i.opts.unevaluated&&(i.props!==!0&&e.props!==void 0&&(i.props=ot.mergeEvaluated.props(n,e.props,i.props,r)),i.items!==!0&&e.items!==void 0&&(i.items=ot.mergeEvaluated.items(n,e.items,i.items,r)))}mergeValidEvaluated(e,r){let{it:i,gen:n}=this;if(i.opts.unevaluated&&(i.props!==!0||i.items!==!0))return n.if(r,()=>this.mergeEvaluated(e,x.Name)),!0}};bt.KeywordCxt=dn;function Rd(t,e,r,i){let n=new dn(t,r,e);"code"in r?r.code(n,i):n.$data&&r.validate?(0,Jr.funcKeywordCode)(n,r):"macro"in r?(0,Jr.macroKeywordCode)(n,r):(r.compile||r.validate)&&(0,Jr.funcKeywordCode)(n,r)}var sy=/^\/(?:[^~]|~0|~1)*$/,cy=/^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;function Md(t,{dataLevel:e,dataNames:r,dataPathArr:i}){let n,o;if(t==="")return E.default.rootData;if(t[0]==="/"){if(!sy.test(t))throw new Error(`Invalid JSON-pointer: ${t}`);n=t,o=E.default.rootData}else{let d=cy.exec(t);if(!d)throw new Error(`Invalid JSON-pointer: ${t}`);let u=+d[1];if(n=d[2],n==="#"){if(u>=e)throw new Error(c("property/index",u));return i[e-u]}if(u>e)throw new Error(c("data",u));if(o=r[e-u],!n)return o}let a=o,s=n.split("/");for(let d of s)d&&(o=(0,x._)`${o}${(0,x.getProperty)((0,ot.unescapeJsonPointer)(d))}`,a=(0,x._)`${a} && ${o}`);return a;function c(d,u){return`Cannot access ${d} ${u} levels up, current level is ${e}`}}bt.getData=Md});var un=w(aa=>{"use strict";Object.defineProperty(aa,"__esModule",{value:!0});var oa=class extends Error{constructor(e){super("validation failed"),this.errors=e,this.ajv=this.validation=!0}};aa.default=oa});var Xr=w(da=>{"use strict";Object.defineProperty(da,"__esModule",{value:!0});var sa=Wr(),ca=class extends Error{constructor(e,r,i,n){super(n||`can't resolve reference ${i} from id ${r}`),this.missingRef=(0,sa.resolveUrl)(e,r,i),this.missingSchema=(0,sa.normalizeId)((0,sa.getFullPath)(e,this.missingRef))}};da.default=ca});var pn=w(Ae=>{"use strict";Object.defineProperty(Ae,"__esModule",{value:!0});Ae.resolveSchema=Ae.getCompilingSchema=Ae.resolveRef=Ae.compileSchema=Ae.SchemaEnv=void 0;var Le=M(),dy=un(),Nt=nt(),ze=Wr(),_d=O(),uy=Kr(),ur=class{constructor(e){var r;this.refs={},this.dynamicAnchors={};let i;typeof e.schema=="object"&&(i=e.schema),this.schema=e.schema,this.schemaId=e.schemaId,this.root=e.root||this,this.baseId=(r=e.baseId)!==null&&r!==void 0?r:(0,ze.normalizeId)(i?.[e.schemaId||"$id"]),this.schemaPath=e.schemaPath,this.localRefs=e.localRefs,this.meta=e.meta,this.$async=i?.$async,this.refs={}}};Ae.SchemaEnv=ur;function la(t){let e=$d.call(this,t);if(e)return e;let r=(0,ze.getFullPath)(this.opts.uriResolver,t.root.baseId),{es5:i,lines:n}=this.opts.code,{ownProperties:o}=this.opts,a=new Le.CodeGen(this.scope,{es5:i,lines:n,ownProperties:o}),s;t.$async&&(s=a.scopeValue("Error",{ref:dy.default,code:(0,Le._)`require("ajv/dist/runtime/validation_error").default`}));let c=a.scopeName("validate");t.validateName=c;let d={gen:a,allErrors:this.opts.allErrors,data:Nt.default.data,parentData:Nt.default.parentData,parentDataProperty:Nt.default.parentDataProperty,dataNames:[Nt.default.data],dataPathArr:[Le.nil],dataLevel:0,dataTypes:[],definedProperties:new Set,topSchemaRef:a.scopeValue("schema",this.opts.code.source===!0?{ref:t.schema,code:(0,Le.stringify)(t.schema)}:{ref:t.schema}),validateName:c,ValidationError:s,schema:t.schema,schemaEnv:t,rootId:r,baseId:t.baseId||r,schemaPath:Le.nil,errSchemaPath:t.schemaPath||(this.opts.jtd?"":"#"),errorPath:(0,Le._)`""`,opts:this.opts,self:this},u;try{this._compilations.add(t),(0,uy.validateFunctionCode)(d),a.optimize(this.opts.code.optimize);let l=a.toString();u=`${a.scopeRefs(Nt.default.scope)}return ${l}`,this.opts.code.process&&(u=this.opts.code.process(u,t));let m=new Function(`${Nt.default.self}`,`${Nt.default.scope}`,u)(this,this.scope.get());if(this.scope.value(c,{ref:m}),m.errors=null,m.schema=t.schema,m.schemaEnv=t,t.$async&&(m.$async=!0),this.opts.code.source===!0&&(m.source={validateName:c,validateCode:l,scopeValues:a._values}),this.opts.unevaluated){let{props:h,items:f}=d;m.evaluated={props:h instanceof Le.Name?void 0:h,items:f instanceof Le.Name?void 0:f,dynamicProps:h instanceof Le.Name,dynamicItems:f instanceof Le.Name},m.source&&(m.source.evaluated=(0,Le.stringify)(m.evaluated))}return t.validate=m,t}catch(l){throw delete t.validate,delete t.validateName,u&&this.logger.error("Error compiling schema, function code:",u),l}finally{this._compilations.delete(t)}}Ae.compileSchema=la;function ly(t,e,r){var i;r=(0,ze.resolveUrl)(this.opts.uriResolver,e,r);let n=t.refs[r];if(n)return n;let o=my.call(this,t,r);if(o===void 0){let a=(i=t.localRefs)===null||i===void 0?void 0:i[r],{schemaId:s}=this.opts;a&&(o=new ur({schema:a,schemaId:s,root:t,baseId:e}))}if(o!==void 0)return t.refs[r]=py.call(this,o)}Ae.resolveRef=ly;function py(t){return(0,ze.inlineRef)(t.schema,this.opts.inlineRefs)?t.schema:t.validate?t:la.call(this,t)}function $d(t){for(let e of this._compilations)if(fy(e,t))return e}Ae.getCompilingSchema=$d;function fy(t,e){return t.schema===e.schema&&t.root===e.root&&t.baseId===e.baseId}function my(t,e){let r;for(;typeof(r=this.refs[e])=="string";)e=r;return r||this.schemas[e]||ln.call(this,t,e)}function ln(t,e){let r=this.opts.uriResolver.parse(e),i=(0,ze._getFullPath)(this.opts.uriResolver,r),n=(0,ze.getFullPath)(this.opts.uriResolver,t.baseId,void 0);if(Object.keys(t.schema).length>0&&i===n)return ua.call(this,r,t);let o=(0,ze.normalizeId)(i),a=this.refs[o]||this.schemas[o];if(typeof a=="string"){let s=ln.call(this,t,a);return typeof s?.schema!="object"?void 0:ua.call(this,r,s)}if(typeof a?.schema=="object"){if(a.validate||la.call(this,a),o===(0,ze.normalizeId)(e)){let{schema:s}=a,{schemaId:c}=this.opts,d=s[c];return d&&(n=(0,ze.resolveUrl)(this.opts.uriResolver,n,d)),new ur({schema:s,schemaId:c,root:t,baseId:n})}return ua.call(this,r,a)}}Ae.resolveSchema=ln;var hy=new Set(["properties","patternProperties","enum","dependencies","definitions"]);function ua(t,{baseId:e,schema:r,root:i}){var n;if(((n=t.fragment)===null||n===void 0?void 0:n[0])!=="/")return;for(let s of t.fragment.slice(1).split("/")){if(typeof r=="boolean")return;let c=r[(0,_d.unescapeFragment)(s)];if(c===void 0)return;r=c;let d=typeof r=="object"&&r[this.opts.schemaId];!hy.has(s)&&d&&(e=(0,ze.resolveUrl)(this.opts.uriResolver,e,d))}let o;if(typeof r!="boolean"&&r.$ref&&!(0,_d.schemaHasRulesButRef)(r,this.RULES)){let s=(0,ze.resolveUrl)(this.opts.uriResolver,e,r.$ref);o=ln.call(this,i,s)}let{schemaId:a}=this.opts;if(o=o||new ur({schema:r,schemaId:a,root:i,baseId:e}),o.schema!==o.root.schema)return o}});var kd=w(($j,gy)=>{gy.exports={$id:"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",description:"Meta-schema for $data reference (JSON AnySchema extension proposal)",type:"object",required:["$data"],properties:{$data:{type:"string",anyOf:[{format:"relative-json-pointer"},{format:"json-pointer"}]}},additionalProperties:!1}});var ma=w((kj,Vd)=>{"use strict";var vy=RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu),Td=RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u),pa=RegExp.prototype.test.bind(/^[\da-f]{2}$/iu),Od=RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu),yy=RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);function fa(t){let e="",r=0,i=0;for(i=0;i<t.length;i++)if(r=t[i].charCodeAt(0),r!==48){if(!(r>=48&&r<=57||r>=65&&r<=70||r>=97&&r<=102))return"";e+=t[i];break}for(i+=1;i<t.length;i++){if(r=t[i].charCodeAt(0),!(r>=48&&r<=57||r>=65&&r<=70||r>=97&&r<=102))return"";e+=t[i]}return e}var wy=RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);function Ad(t){return t.length=0,!0}function xy(t,e,r){if(t.length){let i=fa(t);if(i!=="")e.push(i);else return r.error=!0,!1;t.length=0}return!0}function Py(t){let e=0,r={error:!1,address:"",zone:""},i=[],n=[],o=!1,a=!1,s=xy;for(let c=0;c<t.length;c++){let d=t[c];if(!(d==="["||d==="]"))if(d===":"){if(o===!0&&(a=!0),!s(n,i,r))break;if(++e>7){r.error=!0;break}c>0&&t[c-1]===":"&&(o=!0),i.push(":");continue}else if(d==="%"){if(!s(n,i,r))break;s=Ad}else{n.push(d);continue}}return n.length&&(s===Ad?r.zone=n.join(""):a?i.push(n.join("")):i.push(fa(n))),r.address=i.join(""),r}function Nd(t){if(by(t,":")<2)return{host:t,isIPV6:!1};let e=Py(t);if(e.error)return{host:t,isIPV6:!1};{let r=e.address,i=e.address;return e.zone&&(r+="%"+e.zone,i+="%25"+e.zone),{host:r,isIPV6:!0,escapedHost:i}}}function by(t,e){let r=0;for(let i=0;i<t.length;i++)t[i]===e&&r++;return r}function Iy(t){let e=t,r=[],i=-1,n=0;for(;n=e.length;){if(n===1){if(e===".")break;if(e==="/"){r.push("/");break}else{r.push(e);break}}else if(n===2){if(e[0]==="."){if(e[1]===".")break;if(e[1]==="/"){e=e.slice(2);continue}}else if(e[0]==="/"&&(e[1]==="."||e[1]==="/")){r.push("/");break}}else if(n===3&&e==="/.."){r.length!==0&&r.pop(),r.push("/");break}if(e[0]==="."){if(e[1]==="."){if(e[2]==="/"){e=e.slice(3);continue}}else if(e[1]==="/"){e=e.slice(2);continue}}else if(e[0]==="/"&&e[1]==="."){if(e[2]==="/"){e=e.slice(2);continue}else if(e[2]==="."&&e[3]==="/"){e=e.slice(3),r.length!==0&&r.pop();continue}}if((i=e.indexOf("/",1))===-1){r.push(e);break}else r.push(e.slice(0,i)),e=e.slice(i)}return r.join("")}var Sy={"@":"%40","/":"%2F","?":"%3F","#":"%23",":":"%3A"},Ey=/[@/?#:]/g,jy=/[@/?#]/g;function qd(t,e){let r=e?jy:Ey;return r.lastIndex=0,t.replace(r,i=>Sy[i])}function Cy(t,e=!1){if(t.indexOf("%")===-1)return t;let r="";for(let i=0;i<t.length;i++){if(t[i]==="%"&&i+2<t.length){let n=t.slice(i+1,i+3);if(pa(n)){let o=n.toUpperCase(),a=String.fromCharCode(parseInt(o,16));e&&Od(a)?r+=a:r+="%"+o,i+=2;continue}}r+=t[i]}return r}function Dy(t){let e="";for(let r=0;r<t.length;r++){if(t[r]==="%"&&r+2<t.length){let i=t.slice(r+1,r+3);if(pa(i)){let n=i.toUpperCase(),o=String.fromCharCode(parseInt(n,16));o!=="."&&Od(o)?e+=o:e+="%"+n,r+=2;continue}}yy(t[r])?e+=t[r]:e+=escape(t[r])}return e}function Ry(t){let e="";for(let r=0;r<t.length;r++){if(t[r]==="%"&&r+2<t.length){let i=t.slice(r+1,r+3);if(pa(i)){e+="%"+i.toUpperCase(),r+=2;continue}}e+=escape(t[r])}return e}function My(t){let e=[];if(t.userinfo!==void 0&&(e.push(t.userinfo),e.push("@")),t.host!==void 0){let r=unescape(t.host);if(!Td(r)){let i=Nd(r);i.isIPV6===!0?r=`[${i.escapedHost}]`:r=qd(r,!1)}e.push(r)}return(typeof t.port=="number"||typeof t.port=="string")&&(e.push(":"),e.push(String(t.port))),e.length?e.join(""):void 0}Vd.exports={nonSimpleDomain:wy,recomposeAuthority:My,reescapeHostDelimiters:qd,normalizePercentEncoding:Cy,normalizePathEncoding:Dy,escapePreservingEscapes:Ry,removeDotSegments:Iy,isIPv4:Td,isUUID:vy,normalizeIPv6:Nd,stringArrayToHexStripped:fa}});var Bd=w((Aj,zd)=>{"use strict";var{isUUID:_y}=ma(),$y=/([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu,ky=["http","https","ws","wss","urn","urn:uuid"];function Ay(t){return ky.indexOf(t)!==-1}function ha(t){return t.secure===!0?!0:t.secure===!1?!1:t.scheme?t.scheme.length===3&&(t.scheme[0]==="w"||t.scheme[0]==="W")&&(t.scheme[1]==="s"||t.scheme[1]==="S")&&(t.scheme[2]==="s"||t.scheme[2]==="S"):!1}function Hd(t){return t.host||(t.error=t.error||"HTTP URIs must have a host."),t}function Fd(t){let e=String(t.scheme).toLowerCase()==="https";return(t.port===(e?443:80)||t.port==="")&&(t.port=void 0),t.path||(t.path="/"),t}function Ty(t){return t.secure=ha(t),t.resourceName=(t.path||"/")+(t.query?"?"+t.query:""),t.path=void 0,t.query=void 0,t}function Oy(t){if((t.port===(ha(t)?443:80)||t.port==="")&&(t.port=void 0),typeof t.secure=="boolean"&&(t.scheme=t.secure?"wss":"ws",t.secure=void 0),t.resourceName){let[e,r]=t.resourceName.split("?");t.path=e&&e!=="/"?e:void 0,t.query=r,t.resourceName=void 0}return t.fragment=void 0,t}function Ny(t,e){if(!t.path)return t.error="URN can not be parsed",t;let r=t.path.match($y);if(r){let i=e.scheme||t.scheme||"urn";t.nid=r[1].toLowerCase(),t.nss=r[2];let n=`${i}:${e.nid||t.nid}`,o=ga(n);t.path=void 0,o&&(t=o.parse(t,e))}else t.error=t.error||"URN can not be parsed.";return t}function qy(t,e){if(t.nid===void 0)throw new Error("URN without nid cannot be serialized");let r=e.scheme||t.scheme||"urn",i=t.nid.toLowerCase(),n=`${r}:${e.nid||i}`,o=ga(n);o&&(t=o.serialize(t,e));let a=t,s=t.nss;return a.path=`${i||e.nid}:${s}`,e.skipEscape=!0,a}function Vy(t,e){let r=t;return r.uuid=r.nss,r.nss=void 0,!e.tolerant&&(!r.uuid||!_y(r.uuid))&&(r.error=r.error||"UUID is not valid."),r}function Hy(t){let e=t;return e.nss=(t.uuid||"").toLowerCase(),e}var Ld={scheme:"http",domainHost:!0,parse:Hd,serialize:Fd},Fy={scheme:"https",domainHost:Ld.domainHost,parse:Hd,serialize:Fd},fn={scheme:"ws",domainHost:!0,parse:Ty,serialize:Oy},Ly={scheme:"wss",domainHost:fn.domainHost,parse:fn.parse,serialize:fn.serialize},zy={scheme:"urn",parse:Ny,serialize:qy,skipNormalize:!0},By={scheme:"urn:uuid",parse:Vy,serialize:Hy,skipNormalize:!0},mn={http:Ld,https:Fy,ws:fn,wss:Ly,urn:zy,"urn:uuid":By};Object.setPrototypeOf(mn,null);function ga(t){return t&&(mn[t]||mn[t.toLowerCase()])||void 0}zd.exports={wsIsSecure:ha,SCHEMES:mn,isValidSchemeName:Ay,getSchemeHandler:ga}});var Kd=w((Tj,hn)=>{"use strict";var{normalizeIPv6:Uy,removeDotSegments:Qr,recomposeAuthority:Gy,normalizePercentEncoding:Wy,normalizePathEncoding:Yy,escapePreservingEscapes:Jy,reescapeHostDelimiters:Ky,isIPv4:Xy,nonSimpleDomain:Qy}=ma(),{SCHEMES:Zy,getSchemeHandler:Gd}=Bd();function ew(t,e){return typeof t=="string"?t=aw(t,e):typeof t=="object"&&(t=lr(qt(t,e),e)),t}function tw(t,e,r){let i=r?Object.assign({scheme:"null"},r):{scheme:"null"},n=Wd(lr(t,i),lr(e,i),i,!0);return i.skipEscape=!0,qt(n,i)}function Wd(t,e,r,i){let n={};return i||(t=lr(qt(t,r),r),e=lr(qt(e,r),r)),r=r||{},!r.tolerant&&e.scheme?(n.scheme=e.scheme,n.userinfo=e.userinfo,n.host=e.host,n.port=e.port,n.path=Qr(e.path||""),n.query=e.query):(e.userinfo!==void 0||e.host!==void 0||e.port!==void 0?(n.userinfo=e.userinfo,n.host=e.host,n.port=e.port,n.path=Qr(e.path||""),n.query=e.query):(e.path?(e.path[0]==="/"?n.path=Qr(e.path):((t.userinfo!==void 0||t.host!==void 0||t.port!==void 0)&&!t.path?n.path="/"+e.path:t.path?n.path=t.path.slice(0,t.path.lastIndexOf("/")+1)+e.path:n.path=e.path,n.path=Qr(n.path)),n.query=e.query):(n.path=t.path,e.query!==void 0?n.query=e.query:n.query=t.query),n.userinfo=t.userinfo,n.host=t.host,n.port=t.port),n.scheme=t.scheme),n.fragment=e.fragment,n}function rw(t,e,r){let i=Ud(t,r),n=Ud(e,r);return i!==void 0&&n!==void 0&&i.toLowerCase()===n.toLowerCase()}function qt(t,e){let r={host:t.host,scheme:t.scheme,userinfo:t.userinfo,port:t.port,path:t.path,query:t.query,nid:t.nid,nss:t.nss,uuid:t.uuid,fragment:t.fragment,reference:t.reference,resourceName:t.resourceName,secure:t.secure,error:""},i=Object.assign({},e),n=[],o=Gd(i.scheme||r.scheme);o&&o.serialize&&o.serialize(r,i),r.path!==void 0&&(i.skipEscape?r.path=Wy(r.path):(r.path=Jy(r.path),r.scheme!==void 0&&(r.path=r.path.split("%3A").join(":")))),i.reference!=="suffix"&&r.scheme&&n.push(r.scheme,":");let a=Gy(r);if(a!==void 0&&(i.reference!=="suffix"&&n.push("//"),n.push(a),r.path&&r.path[0]!=="/"&&n.push("/")),r.path!==void 0){let s=r.path;!i.absolutePath&&(!o||!o.absolutePath)&&(s=Qr(s)),a===void 0&&s[0]==="/"&&s[1]==="/"&&(s="/%2F"+s.slice(2)),n.push(s)}return r.query!==void 0&&n.push("?",r.query),r.fragment!==void 0&&n.push("#",r.fragment),n.join("")}var iw=/^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u,nw=/^(?:[^#/:?]+:)?\/\/([^/?#]*)/;function ow(t,e){if(e[2]!==void 0&&t.path&&t.path[0]!=="/")return'URI path must start with "/" when authority is present.';if(typeof t.port=="number"&&(t.port<0||t.port>65535))return"URI port is malformed."}function Yd(t,e){let r=Object.assign({},e),i={scheme:void 0,userinfo:void 0,host:"",port:void 0,path:"",query:void 0,fragment:void 0},n=!1,o=!1;r.reference==="suffix"&&(r.scheme?t=r.scheme+":"+t:t="//"+t);let a=t.match(nw);a!==null&&a[1].indexOf("\\")!==-1&&(i.error="URI authority must not contain a literal backslash.",n=!0);let s=t.match(iw);if(s){i.scheme=s[1],i.userinfo=s[3],i.host=s[4],i.port=parseInt(s[5],10),i.path=s[6]||"",i.query=s[7],i.fragment=s[8],isNaN(i.port)&&(i.port=s[5]);let c=ow(i,s);if(c!==void 0&&(i.error=i.error||c,n=!0),i.host)if(Xy(i.host)===!1){let l=Uy(i.host);i.host=l.host.toLowerCase(),o=l.isIPV6}else o=!0;i.scheme===void 0&&i.userinfo===void 0&&i.host===void 0&&i.port===void 0&&i.query===void 0&&!i.path?i.reference="same-document":i.scheme===void 0?i.reference="relative":i.fragment===void 0?i.reference="absolute":i.reference="uri",r.reference&&r.reference!=="suffix"&&r.reference!==i.reference&&(i.error=i.error||"URI is not a "+r.reference+" reference.");let d=Gd(r.scheme||i.scheme);if(!r.unicodeSupport&&(!d||!d.unicodeSupport)&&i.host&&(r.domainHost||d&&d.domainHost)&&o===!1&&Qy(i.host))try{i.host=new URL("http://"+i.host).hostname}catch(u){i.error=i.error||"Host's domain name can not be converted to ASCII: "+u}if((!d||d&&!d.skipNormalize)&&(t.indexOf("%")!==-1&&(i.scheme!==void 0&&(i.scheme=unescape(i.scheme)),i.host!==void 0&&(i.host=Ky(unescape(i.host),o))),i.path&&(i.path=Yy(i.path)),i.fragment))try{i.fragment=encodeURI(decodeURIComponent(i.fragment))}catch{i.error=i.error||"URI malformed"}d&&d.parse&&d.parse(i,r)}else i.error=i.error||"URI can not be parsed.";return{parsed:i,malformedAuthorityOrPort:n}}function lr(t,e){return Yd(t,e).parsed}function aw(t,e){return Jd(t,e).normalized}function Jd(t,e){let{parsed:r,malformedAuthorityOrPort:i}=Yd(t,e);return{normalized:i?t:qt(r,e),malformedAuthorityOrPort:i}}function Ud(t,e){if(typeof t=="string"){let{normalized:r,malformedAuthorityOrPort:i}=Jd(t,e);return i?void 0:r}if(typeof t=="object")return qt(t,e)}var va={SCHEMES:Zy,normalize:ew,resolve:tw,resolveComponent:Wd,equal:rw,serialize:qt,parse:lr};hn.exports=va;hn.exports.default=va;hn.exports.fastUri=va});var Qd=w(ya=>{"use strict";Object.defineProperty(ya,"__esModule",{value:!0});var Xd=Kd();Xd.code='require("ajv/dist/runtime/uri").default';ya.default=Xd});var au=w(ne=>{"use strict";Object.defineProperty(ne,"__esModule",{value:!0});ne.CodeGen=ne.Name=ne.nil=ne.stringify=ne.str=ne._=ne.KeywordCxt=void 0;var sw=Kr();Object.defineProperty(ne,"KeywordCxt",{enumerable:!0,get:function(){return sw.KeywordCxt}});var pr=M();Object.defineProperty(ne,"_",{enumerable:!0,get:function(){return pr._}});Object.defineProperty(ne,"str",{enumerable:!0,get:function(){return pr.str}});Object.defineProperty(ne,"stringify",{enumerable:!0,get:function(){return pr.stringify}});Object.defineProperty(ne,"nil",{enumerable:!0,get:function(){return pr.nil}});Object.defineProperty(ne,"Name",{enumerable:!0,get:function(){return pr.Name}});Object.defineProperty(ne,"CodeGen",{enumerable:!0,get:function(){return pr.CodeGen}});var cw=un(),iu=Xr(),dw=Go(),Zr=pn(),uw=M(),ei=Wr(),gn=Gr(),xa=O(),Zd=kd(),lw=Qd(),nu=(t,e)=>new RegExp(t,e);nu.code="new RegExp";var pw=["removeAdditional","useDefaults","coerceTypes"],fw=new Set(["validate","serialize","parse","wrapper","root","schema","keyword","pattern","formats","validate$data","func","obj","Error"]),mw={errorDataPath:"",format:"`validateFormats: false` can be used instead.",nullable:'"nullable" keyword is supported by default.',jsonPointers:"Deprecated jsPropertySyntax can be used instead.",extendRefs:"Deprecated ignoreKeywordsWithRef can be used instead.",missingRefs:"Pass empty schema with $id that should be ignored to ajv.addSchema.",processCode:"Use option `code: {process: (code, schemaEnv: object) => string}`",sourceCode:"Use option `code: {source: true}`",strictDefaults:"It is default now, see option `strict`.",strictKeywords:"It is default now, see option `strict`.",uniqueItems:'"uniqueItems" keyword is always validated.',unknownFormats:"Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",cache:"Map is used as cache, schema object as key.",serialize:"Map is used as cache, schema object as key.",ajvErrors:"It is default now."},hw={ignoreKeywordsWithRef:"",jsPropertySyntax:"",unicode:'"minLength"/"maxLength" account for unicode characters by default.'},eu=200;function gw(t){var e,r,i,n,o,a,s,c,d,u,l,p,m,h,f,v,y,I,P,j,b,ae,A,re,Gt;let jt=t.strict,Xn=(e=t.code)===null||e===void 0?void 0:e.optimize,Cs=Xn===!0||Xn===void 0?1:Xn||0,Ds=(i=(r=t.code)===null||r===void 0?void 0:r.regExp)!==null&&i!==void 0?i:nu,hp=(n=t.uriResolver)!==null&&n!==void 0?n:lw.default;return{strictSchema:(a=(o=t.strictSchema)!==null&&o!==void 0?o:jt)!==null&&a!==void 0?a:!0,strictNumbers:(c=(s=t.strictNumbers)!==null&&s!==void 0?s:jt)!==null&&c!==void 0?c:!0,strictTypes:(u=(d=t.strictTypes)!==null&&d!==void 0?d:jt)!==null&&u!==void 0?u:"log",strictTuples:(p=(l=t.strictTuples)!==null&&l!==void 0?l:jt)!==null&&p!==void 0?p:"log",strictRequired:(h=(m=t.strictRequired)!==null&&m!==void 0?m:jt)!==null&&h!==void 0?h:!1,code:t.code?{...t.code,optimize:Cs,regExp:Ds}:{optimize:Cs,regExp:Ds},loopRequired:(f=t.loopRequired)!==null&&f!==void 0?f:eu,loopEnum:(v=t.loopEnum)!==null&&v!==void 0?v:eu,meta:(y=t.meta)!==null&&y!==void 0?y:!0,messages:(I=t.messages)!==null&&I!==void 0?I:!0,inlineRefs:(P=t.inlineRefs)!==null&&P!==void 0?P:!0,schemaId:(j=t.schemaId)!==null&&j!==void 0?j:"$id",addUsedSchema:(b=t.addUsedSchema)!==null&&b!==void 0?b:!0,validateSchema:(ae=t.validateSchema)!==null&&ae!==void 0?ae:!0,validateFormats:(A=t.validateFormats)!==null&&A!==void 0?A:!0,unicodeRegExp:(re=t.unicodeRegExp)!==null&&re!==void 0?re:!0,int32range:(Gt=t.int32range)!==null&&Gt!==void 0?Gt:!0,uriResolver:hp}}var ti=class{constructor(e={}){this.schemas={},this.refs={},this.formats=Object.create(null),this._compilations=new Set,this._loading={},this._cache=new Map,e=this.opts={...e,...gw(e)};let{es5:r,lines:i}=this.opts.code;this.scope=new uw.ValueScope({scope:{},prefixes:fw,es5:r,lines:i}),this.logger=bw(e.logger);let n=e.validateFormats;e.validateFormats=!1,this.RULES=(0,dw.getRules)(),tu.call(this,mw,e,"NOT SUPPORTED"),tu.call(this,hw,e,"DEPRECATED","warn"),this._metaOpts=xw.call(this),e.formats&&yw.call(this),this._addVocabularies(),this._addDefaultMetaSchema(),e.keywords&&ww.call(this,e.keywords),typeof e.meta=="object"&&this.addMetaSchema(e.meta),vw.call(this),e.validateFormats=n}_addVocabularies(){this.addKeyword("$async")}_addDefaultMetaSchema(){let{$data:e,meta:r,schemaId:i}=this.opts,n=Zd;i==="id"&&(n={...Zd},n.id=n.$id,delete n.$id),r&&e&&this.addMetaSchema(n,n[i],!1)}defaultMeta(){let{meta:e,schemaId:r}=this.opts;return this.opts.defaultMeta=typeof e=="object"?e[r]||e:void 0}validate(e,r){let i;if(typeof e=="string"){if(i=this.getSchema(e),!i)throw new Error(`no schema with key or ref "${e}"`)}else i=this.compile(e);let n=i(r);return"$async"in i||(this.errors=i.errors),n}compile(e,r){let i=this._addSchema(e,r);return i.validate||this._compileSchemaEnv(i)}compileAsync(e,r){if(typeof this.opts.loadSchema!="function")throw new Error("options.loadSchema should be a function");let{loadSchema:i}=this.opts;return n.call(this,e,r);async function n(u,l){await o.call(this,u.$schema);let p=this._addSchema(u,l);return p.validate||a.call(this,p)}async function o(u){u&&!this.getSchema(u)&&await n.call(this,{$ref:u},!0)}async function a(u){try{return this._compileSchemaEnv(u)}catch(l){if(!(l instanceof iu.default))throw l;return s.call(this,l),await c.call(this,l.missingSchema),a.call(this,u)}}function s({missingSchema:u,missingRef:l}){if(this.refs[u])throw new Error(`AnySchema ${u} is loaded but ${l} cannot be resolved`)}async function c(u){let l=await d.call(this,u);this.refs[u]||await o.call(this,l.$schema),this.refs[u]||this.addSchema(l,u,r)}async function d(u){let l=this._loading[u];if(l)return l;try{return await(this._loading[u]=i(u))}finally{delete this._loading[u]}}}addSchema(e,r,i,n=this.opts.validateSchema){if(Array.isArray(e)){for(let a of e)this.addSchema(a,void 0,i,n);return this}let o;if(typeof e=="object"){let{schemaId:a}=this.opts;if(o=e[a],o!==void 0&&typeof o!="string")throw new Error(`schema ${a} must be string`)}return r=(0,ei.normalizeId)(r||o),this._checkUnique(r),this.schemas[r]=this._addSchema(e,i,r,n,!0),this}addMetaSchema(e,r,i=this.opts.validateSchema){return this.addSchema(e,r,!0,i),this}validateSchema(e,r){if(typeof e=="boolean")return!0;let i;if(i=e.$schema,i!==void 0&&typeof i!="string")throw new Error("$schema must be a string");if(i=i||this.opts.defaultMeta||this.defaultMeta(),!i)return this.logger.warn("meta-schema not available"),this.errors=null,!0;let n=this.validate(i,e);if(!n&&r){let o="schema is invalid: "+this.errorsText();if(this.opts.validateSchema==="log")this.logger.error(o);else throw new Error(o)}return n}getSchema(e){let r;for(;typeof(r=ru.call(this,e))=="string";)e=r;if(r===void 0){let{schemaId:i}=this.opts,n=new Zr.SchemaEnv({schema:{},schemaId:i});if(r=Zr.resolveSchema.call(this,n,e),!r)return;this.refs[e]=r}return r.validate||this._compileSchemaEnv(r)}removeSchema(e){if(e instanceof RegExp)return this._removeAllSchemas(this.schemas,e),this._removeAllSchemas(this.refs,e),this;switch(typeof e){case"undefined":return this._removeAllSchemas(this.schemas),this._removeAllSchemas(this.refs),this._cache.clear(),this;case"string":{let r=ru.call(this,e);return typeof r=="object"&&this._cache.delete(r.schema),delete this.schemas[e],delete this.refs[e],this}case"object":{let r=e;this._cache.delete(r);let i=e[this.opts.schemaId];return i&&(i=(0,ei.normalizeId)(i),delete this.schemas[i],delete this.refs[i]),this}default:throw new Error("ajv.removeSchema: invalid parameter")}}addVocabulary(e){for(let r of e)this.addKeyword(r);return this}addKeyword(e,r){let i;if(typeof e=="string")i=e,typeof r=="object"&&(this.logger.warn("these parameters are deprecated, see docs for addKeyword"),r.keyword=i);else if(typeof e=="object"&&r===void 0){if(r=e,i=r.keyword,Array.isArray(i)&&!i.length)throw new Error("addKeywords: keyword must be string or non-empty array")}else throw new Error("invalid addKeywords parameters");if(Sw.call(this,i,r),!r)return(0,xa.eachItem)(i,o=>wa.call(this,o)),this;jw.call(this,r);let n={...r,type:(0,gn.getJSONTypes)(r.type),schemaType:(0,gn.getJSONTypes)(r.schemaType)};return(0,xa.eachItem)(i,n.type.length===0?o=>wa.call(this,o,n):o=>n.type.forEach(a=>wa.call(this,o,n,a))),this}getKeyword(e){let r=this.RULES.all[e];return typeof r=="object"?r.definition:!!r}removeKeyword(e){let{RULES:r}=this;delete r.keywords[e],delete r.all[e];for(let i of r.rules){let n=i.rules.findIndex(o=>o.keyword===e);n>=0&&i.rules.splice(n,1)}return this}addFormat(e,r){return typeof r=="string"&&(r=new RegExp(r)),this.formats[e]=r,this}errorsText(e=this.errors,{separator:r=", ",dataVar:i="data"}={}){return!e||e.length===0?"No errors":e.map(n=>`${i}${n.instancePath} ${n.message}`).reduce((n,o)=>n+r+o)}$dataMetaSchema(e,r){let i=this.RULES.all;e=JSON.parse(JSON.stringify(e));for(let n of r){let o=n.split("/").slice(1),a=e;for(let s of o)a=a[s];for(let s in i){let c=i[s];if(typeof c!="object")continue;let{$data:d}=c.definition,u=a[s];d&&u&&(a[s]=ou(u))}}return e}_removeAllSchemas(e,r){for(let i in e){let n=e[i];(!r||r.test(i))&&(typeof n=="string"?delete e[i]:n&&!n.meta&&(this._cache.delete(n.schema),delete e[i]))}}_addSchema(e,r,i,n=this.opts.validateSchema,o=this.opts.addUsedSchema){let a,{schemaId:s}=this.opts;if(typeof e=="object")a=e[s];else{if(this.opts.jtd)throw new Error("schema must be object");if(typeof e!="boolean")throw new Error("schema must be object or boolean")}let c=this._cache.get(e);if(c!==void 0)return c;i=(0,ei.normalizeId)(a||i);let d=ei.getSchemaRefs.call(this,e,i);return c=new Zr.SchemaEnv({schema:e,schemaId:s,meta:r,baseId:i,localRefs:d}),this._cache.set(c.schema,c),o&&!i.startsWith("#")&&(i&&this._checkUnique(i),this.refs[i]=c),n&&this.validateSchema(e,!0),c}_checkUnique(e){if(this.schemas[e]||this.refs[e])throw new Error(`schema with key or id "${e}" already exists`)}_compileSchemaEnv(e){if(e.meta?this._compileMetaSchema(e):Zr.compileSchema.call(this,e),!e.validate)throw new Error("ajv implementation error");return e.validate}_compileMetaSchema(e){let r=this.opts;this.opts=this._metaOpts;try{Zr.compileSchema.call(this,e)}finally{this.opts=r}}};ti.ValidationError=cw.default;ti.MissingRefError=iu.default;ne.default=ti;function tu(t,e,r,i="error"){for(let n in t){let o=n;o in e&&this.logger[i](`${r}: option ${n}. ${t[o]}`)}}function ru(t){return t=(0,ei.normalizeId)(t),this.schemas[t]||this.refs[t]}function vw(){let t=this.opts.schemas;if(t)if(Array.isArray(t))this.addSchema(t);else for(let e in t)this.addSchema(t[e],e)}function yw(){for(let t in this.opts.formats){let e=this.opts.formats[t];e&&this.addFormat(t,e)}}function ww(t){if(Array.isArray(t)){this.addVocabulary(t);return}this.logger.warn("keywords option as map is deprecated, pass array");for(let e in t){let r=t[e];r.keyword||(r.keyword=e),this.addKeyword(r)}}function xw(){let t={...this.opts};for(let e of pw)delete t[e];return t}var Pw={log(){},warn(){},error(){}};function bw(t){if(t===!1)return Pw;if(t===void 0)return console;if(t.log&&t.warn&&t.error)return t;throw new Error("logger must implement log, warn and error methods")}var Iw=/^[a-z_$][a-z0-9_$:-]*$/i;function Sw(t,e){let{RULES:r}=this;if((0,xa.eachItem)(t,i=>{if(r.keywords[i])throw new Error(`Keyword ${i} is already defined`);if(!Iw.test(i))throw new Error(`Keyword ${i} has invalid name`)}),!!e&&e.$data&&!("code"in e||"validate"in e))throw new Error('$data keyword must have "code" or "validate" function')}function wa(t,e,r){var i;let n=e?.post;if(r&&n)throw new Error('keyword with "post" flag cannot have "type"');let{RULES:o}=this,a=n?o.post:o.rules.find(({type:c})=>c===r);if(a||(a={type:r,rules:[]},o.rules.push(a)),o.keywords[t]=!0,!e)return;let s={keyword:t,definition:{...e,type:(0,gn.getJSONTypes)(e.type),schemaType:(0,gn.getJSONTypes)(e.schemaType)}};e.before?Ew.call(this,a,s,e.before):a.rules.push(s),o.all[t]=s,(i=e.implements)===null||i===void 0||i.forEach(c=>this.addKeyword(c))}function Ew(t,e,r){let i=t.rules.findIndex(n=>n.keyword===r);i>=0?t.rules.splice(i,0,e):(t.rules.push(e),this.logger.warn(`rule ${r} is not defined`))}function jw(t){let{metaSchema:e}=t;e!==void 0&&(t.$data&&this.opts.$data&&(e=ou(e)),t.validateSchema=this.compile(e,!0))}var Cw={$ref:"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"};function ou(t){return{anyOf:[t,Cw]}}});var su=w(Pa=>{"use strict";Object.defineProperty(Pa,"__esModule",{value:!0});var Dw={keyword:"id",code(){throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')}};Pa.default=Dw});var lu=w(Vt=>{"use strict";Object.defineProperty(Vt,"__esModule",{value:!0});Vt.callRef=Vt.getValidate=void 0;var Rw=Xr(),cu=ke(),Re=M(),fr=nt(),du=pn(),vn=O(),Mw={keyword:"$ref",schemaType:"string",code(t){let{gen:e,schema:r,it:i}=t,{baseId:n,schemaEnv:o,validateName:a,opts:s,self:c}=i,{root:d}=o;if((r==="#"||r==="#/")&&n===d.baseId)return l();let u=du.resolveRef.call(c,d,n,r);if(u===void 0)throw new Rw.default(i.opts.uriResolver,n,r);if(u instanceof du.SchemaEnv)return p(u);return m(u);function l(){if(o===d)return yn(t,a,o,o.$async);let h=e.scopeValue("root",{ref:d});return yn(t,(0,Re._)`${h}.validate`,d,d.$async)}function p(h){let f=uu(t,h);yn(t,f,h,h.$async)}function m(h){let f=e.scopeValue("schema",s.code.source===!0?{ref:h,code:(0,Re.stringify)(h)}:{ref:h}),v=e.name("valid"),y=t.subschema({schema:h,dataTypes:[],schemaPath:Re.nil,topSchemaRef:f,errSchemaPath:r},v);t.mergeEvaluated(y),t.ok(v)}}};function uu(t,e){let{gen:r}=t;return e.validate?r.scopeValue("validate",{ref:e.validate}):(0,Re._)`${r.scopeValue("wrapper",{ref:e})}.validate`}Vt.getValidate=uu;function yn(t,e,r,i){let{gen:n,it:o}=t,{allErrors:a,schemaEnv:s,opts:c}=o,d=c.passContext?fr.default.this:Re.nil;i?u():l();function u(){if(!s.$async)throw new Error("async schema referenced by sync schema");let h=n.let("valid");n.try(()=>{n.code((0,Re._)`await ${(0,cu.callValidateCode)(t,e,d)}`),m(e),a||n.assign(h,!0)},f=>{n.if((0,Re._)`!(${f} instanceof ${o.ValidationError})`,()=>n.throw(f)),p(f),a||n.assign(h,!1)}),t.ok(h)}function l(){t.result((0,cu.callValidateCode)(t,e,d),()=>m(e),()=>p(e))}function p(h){let f=(0,Re._)`${h}.errors`;n.assign(fr.default.vErrors,(0,Re._)`${fr.default.vErrors} === null ? ${f} : ${fr.default.vErrors}.concat(${f})`),n.assign(fr.default.errors,(0,Re._)`${fr.default.vErrors}.length`)}function m(h){var f;if(!o.opts.unevaluated)return;let v=(f=r?.validate)===null||f===void 0?void 0:f.evaluated;if(o.props!==!0)if(v&&!v.dynamicProps)v.props!==void 0&&(o.props=vn.mergeEvaluated.props(n,v.props,o.props));else{let y=n.var("props",(0,Re._)`${h}.evaluated.props`);o.props=vn.mergeEvaluated.props(n,y,o.props,Re.Name)}if(o.items!==!0)if(v&&!v.dynamicItems)v.items!==void 0&&(o.items=vn.mergeEvaluated.items(n,v.items,o.items));else{let y=n.var("items",(0,Re._)`${h}.evaluated.items`);o.items=vn.mergeEvaluated.items(n,y,o.items,Re.Name)}}}Vt.callRef=yn;Vt.default=Mw});var pu=w(ba=>{"use strict";Object.defineProperty(ba,"__esModule",{value:!0});var _w=su(),$w=lu(),kw=["$schema","$id","$defs","$vocabulary",{keyword:"$comment"},"definitions",_w.default,$w.default];ba.default=kw});var fu=w(Ia=>{"use strict";Object.defineProperty(Ia,"__esModule",{value:!0});var wn=M(),It=wn.operators,xn={maximum:{okStr:"<=",ok:It.LTE,fail:It.GT},minimum:{okStr:">=",ok:It.GTE,fail:It.LT},exclusiveMaximum:{okStr:"<",ok:It.LT,fail:It.GTE},exclusiveMinimum:{okStr:">",ok:It.GT,fail:It.LTE}},Aw={message:({keyword:t,schemaCode:e})=>(0,wn.str)`must be ${xn[t].okStr} ${e}`,params:({keyword:t,schemaCode:e})=>(0,wn._)`{comparison: ${xn[t].okStr}, limit: ${e}}`},Tw={keyword:Object.keys(xn),type:"number",schemaType:"number",$data:!0,error:Aw,code(t){let{keyword:e,data:r,schemaCode:i}=t;t.fail$data((0,wn._)`${r} ${xn[e].fail} ${i} || isNaN(${r})`)}};Ia.default=Tw});var mu=w(Sa=>{"use strict";Object.defineProperty(Sa,"__esModule",{value:!0});var ri=M(),Ow={message:({schemaCode:t})=>(0,ri.str)`must be multiple of ${t}`,params:({schemaCode:t})=>(0,ri._)`{multipleOf: ${t}}`},Nw={keyword:"multipleOf",type:"number",schemaType:"number",$data:!0,error:Ow,code(t){let{gen:e,data:r,schemaCode:i,it:n}=t,o=n.opts.multipleOfPrecision,a=e.let("res"),s=o?(0,ri._)`Math.abs(Math.round(${a}) - ${a}) > 1e-${o}`:(0,ri._)`${a} !== parseInt(${a})`;t.fail$data((0,ri._)`(${i} === 0 || (${a} = ${r}/${i}, ${s}))`)}};Sa.default=Nw});var gu=w(Ea=>{"use strict";Object.defineProperty(Ea,"__esModule",{value:!0});function hu(t){let e=t.length,r=0,i=0,n;for(;i<e;)r++,n=t.charCodeAt(i++),n>=55296&&n<=56319&&i<e&&(n=t.charCodeAt(i),(n&64512)===56320&&i++);return r}Ea.default=hu;hu.code='require("ajv/dist/runtime/ucs2length").default'});var vu=w(ja=>{"use strict";Object.defineProperty(ja,"__esModule",{value:!0});var Ht=M(),qw=O(),Vw=gu(),Hw={message({keyword:t,schemaCode:e}){let r=t==="maxLength"?"more":"fewer";return(0,Ht.str)`must NOT have ${r} than ${e} characters`},params:({schemaCode:t})=>(0,Ht._)`{limit: ${t}}`},Fw={keyword:["maxLength","minLength"],type:"string",schemaType:"number",$data:!0,error:Hw,code(t){let{keyword:e,data:r,schemaCode:i,it:n}=t,o=e==="maxLength"?Ht.operators.GT:Ht.operators.LT,a=n.opts.unicode===!1?(0,Ht._)`${r}.length`:(0,Ht._)`${(0,qw.useFunc)(t.gen,Vw.default)}(${r})`;t.fail$data((0,Ht._)`${a} ${o} ${i}`)}};ja.default=Fw});var yu=w(Ca=>{"use strict";Object.defineProperty(Ca,"__esModule",{value:!0});var Lw=ke(),zw=O(),mr=M(),Bw={message:({schemaCode:t})=>(0,mr.str)`must match pattern "${t}"`,params:({schemaCode:t})=>(0,mr._)`{pattern: ${t}}`},Uw={keyword:"pattern",type:"string",schemaType:"string",$data:!0,error:Bw,code(t){let{gen:e,data:r,$data:i,schema:n,schemaCode:o,it:a}=t,s=a.opts.unicodeRegExp?"u":"";if(i){let{regExp:c}=a.opts.code,d=c.code==="new RegExp"?(0,mr._)`new RegExp`:(0,zw.useFunc)(e,c),u=e.let("valid");e.try(()=>e.assign(u,(0,mr._)`${d}(${o}, ${s}).test(${r})`),()=>e.assign(u,!1)),t.fail$data((0,mr._)`!${u}`)}else{let c=(0,Lw.usePattern)(t,n);t.fail$data((0,mr._)`!${c}.test(${r})`)}}};Ca.default=Uw});var wu=w(Da=>{"use strict";Object.defineProperty(Da,"__esModule",{value:!0});var ii=M(),Gw={message({keyword:t,schemaCode:e}){let r=t==="maxProperties"?"more":"fewer";return(0,ii.str)`must NOT have ${r} than ${e} properties`},params:({schemaCode:t})=>(0,ii._)`{limit: ${t}}`},Ww={keyword:["maxProperties","minProperties"],type:"object",schemaType:"number",$data:!0,error:Gw,code(t){let{keyword:e,data:r,schemaCode:i}=t,n=e==="maxProperties"?ii.operators.GT:ii.operators.LT;t.fail$data((0,ii._)`Object.keys(${r}).length ${n} ${i}`)}};Da.default=Ww});var xu=w(Ra=>{"use strict";Object.defineProperty(Ra,"__esModule",{value:!0});var ni=ke(),oi=M(),Yw=O(),Jw={message:({params:{missingProperty:t}})=>(0,oi.str)`must have required property '${t}'`,params:({params:{missingProperty:t}})=>(0,oi._)`{missingProperty: ${t}}`},Kw={keyword:"required",type:"object",schemaType:"array",$data:!0,error:Jw,code(t){let{gen:e,schema:r,schemaCode:i,data:n,$data:o,it:a}=t,{opts:s}=a;if(!o&&r.length===0)return;let c=r.length>=s.loopRequired;if(a.allErrors?d():u(),s.strictRequired){let m=t.parentSchema.properties,{definedProperties:h}=t.it;for(let f of r)if(m?.[f]===void 0&&!h.has(f)){let v=a.schemaEnv.baseId+a.errSchemaPath,y=`required property "${f}" is not defined at "${v}" (strictRequired)`;(0,Yw.checkStrictMode)(a,y,a.opts.strictRequired)}}function d(){if(c||o)t.block$data(oi.nil,l);else for(let m of r)(0,ni.checkReportMissingProp)(t,m)}function u(){let m=e.let("missing");if(c||o){let h=e.let("valid",!0);t.block$data(h,()=>p(m,h)),t.ok(h)}else e.if((0,ni.checkMissingProp)(t,r,m)),(0,ni.reportMissingProp)(t,m),e.else()}function l(){e.forOf("prop",i,m=>{t.setParams({missingProperty:m}),e.if((0,ni.noPropertyInData)(e,n,m,s.ownProperties),()=>t.error())})}function p(m,h){t.setParams({missingProperty:m}),e.forOf(m,i,()=>{e.assign(h,(0,ni.propertyInData)(e,n,m,s.ownProperties)),e.if((0,oi.not)(h),()=>{t.error(),e.break()})},oi.nil)}}};Ra.default=Kw});var Pu=w(Ma=>{"use strict";Object.defineProperty(Ma,"__esModule",{value:!0});var ai=M(),Xw={message({keyword:t,schemaCode:e}){let r=t==="maxItems"?"more":"fewer";return(0,ai.str)`must NOT have ${r} than ${e} items`},params:({schemaCode:t})=>(0,ai._)`{limit: ${t}}`},Qw={keyword:["maxItems","minItems"],type:"array",schemaType:"number",$data:!0,error:Xw,code(t){let{keyword:e,data:r,schemaCode:i}=t,n=e==="maxItems"?ai.operators.GT:ai.operators.LT;t.fail$data((0,ai._)`${r}.length ${n} ${i}`)}};Ma.default=Qw});var Pn=w(_a=>{"use strict";Object.defineProperty(_a,"__esModule",{value:!0});var bu=ea();bu.code='require("ajv/dist/runtime/equal").default';_a.default=bu});var Iu=w(ka=>{"use strict";Object.defineProperty(ka,"__esModule",{value:!0});var $a=Gr(),oe=M(),Zw=O(),ex=Pn(),tx={message:({params:{i:t,j:e}})=>(0,oe.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,params:({params:{i:t,j:e}})=>(0,oe._)`{i: ${t}, j: ${e}}`},rx={keyword:"uniqueItems",type:"array",schemaType:"boolean",$data:!0,error:tx,code(t){let{gen:e,data:r,$data:i,schema:n,parentSchema:o,schemaCode:a,it:s}=t;if(!i&&!n)return;let c=e.let("valid"),d=o.items?(0,$a.getSchemaTypes)(o.items):[];t.block$data(c,u,(0,oe._)`${a} === false`),t.ok(c);function u(){let h=e.let("i",(0,oe._)`${r}.length`),f=e.let("j");t.setParams({i:h,j:f}),e.assign(c,!0),e.if((0,oe._)`${h} > 1`,()=>(l()?p:m)(h,f))}function l(){return d.length>0&&!d.some(h=>h==="object"||h==="array")}function p(h,f){let v=e.name("item"),y=(0,$a.checkDataTypes)(d,v,s.opts.strictNumbers,$a.DataType.Wrong),I=e.const("indices",(0,oe._)`{}`);e.for((0,oe._)`;${h}--;`,()=>{e.let(v,(0,oe._)`${r}[${h}]`),e.if(y,(0,oe._)`continue`),d.length>1&&e.if((0,oe._)`typeof ${v} == "string"`,(0,oe._)`${v} += "_"`),e.if((0,oe._)`typeof ${I}[${v}] == "number"`,()=>{e.assign(f,(0,oe._)`${I}[${v}]`),t.error(),e.assign(c,!1).break()}).code((0,oe._)`${I}[${v}] = ${h}`)})}function m(h,f){let v=(0,Zw.useFunc)(e,ex.default),y=e.name("outer");e.label(y).for((0,oe._)`;${h}--;`,()=>e.for((0,oe._)`${f} = ${h}; ${f}--;`,()=>e.if((0,oe._)`${v}(${r}[${h}], ${r}[${f}])`,()=>{t.error(),e.assign(c,!1).break(y)})))}}};ka.default=rx});var Su=w(Ta=>{"use strict";Object.defineProperty(Ta,"__esModule",{value:!0});var Aa=M(),ix=O(),nx=Pn(),ox={message:"must be equal to constant",params:({schemaCode:t})=>(0,Aa._)`{allowedValue: ${t}}`},ax={keyword:"const",$data:!0,error:ox,code(t){let{gen:e,data:r,$data:i,schemaCode:n,schema:o}=t;i||o&&typeof o=="object"?t.fail$data((0,Aa._)`!${(0,ix.useFunc)(e,nx.default)}(${r}, ${n})`):t.fail((0,Aa._)`${o} !== ${r}`)}};Ta.default=ax});var Eu=w(Oa=>{"use strict";Object.defineProperty(Oa,"__esModule",{value:!0});var si=M(),sx=O(),cx=Pn(),dx={message:"must be equal to one of the allowed values",params:({schemaCode:t})=>(0,si._)`{allowedValues: ${t}}`},ux={keyword:"enum",schemaType:"array",$data:!0,error:dx,code(t){let{gen:e,data:r,$data:i,schema:n,schemaCode:o,it:a}=t;if(!i&&n.length===0)throw new Error("enum must have non-empty array");let s=n.length>=a.opts.loopEnum,c,d=()=>c??(c=(0,sx.useFunc)(e,cx.default)),u;if(s||i)u=e.let("valid"),t.block$data(u,l);else{if(!Array.isArray(n))throw new Error("ajv implementation error");let m=e.const("vSchema",o);u=(0,si.or)(...n.map((h,f)=>p(m,f)))}t.pass(u);function l(){e.assign(u,!1),e.forOf("v",o,m=>e.if((0,si._)`${d()}(${r}, ${m})`,()=>e.assign(u,!0).break()))}function p(m,h){let f=n[h];return typeof f=="object"&&f!==null?(0,si._)`${d()}(${r}, ${m}[${h}])`:(0,si._)`${r} === ${f}`}}};Oa.default=ux});var ju=w(Na=>{"use strict";Object.defineProperty(Na,"__esModule",{value:!0});var lx=fu(),px=mu(),fx=vu(),mx=yu(),hx=wu(),gx=xu(),vx=Pu(),yx=Iu(),wx=Su(),xx=Eu(),Px=[lx.default,px.default,fx.default,mx.default,hx.default,gx.default,vx.default,yx.default,{keyword:"type",schemaType:["string","array"]},{keyword:"nullable",schemaType:"boolean"},wx.default,xx.default];Na.default=Px});var Va=w(ci=>{"use strict";Object.defineProperty(ci,"__esModule",{value:!0});ci.validateAdditionalItems=void 0;var Ft=M(),qa=O(),bx={message:({params:{len:t}})=>(0,Ft.str)`must NOT have more than ${t} items`,params:({params:{len:t}})=>(0,Ft._)`{limit: ${t}}`},Ix={keyword:"additionalItems",type:"array",schemaType:["boolean","object"],before:"uniqueItems",error:bx,code(t){let{parentSchema:e,it:r}=t,{items:i}=e;if(!Array.isArray(i)){(0,qa.checkStrictMode)(r,'"additionalItems" is ignored when "items" is not an array of schemas');return}Cu(t,i)}};function Cu(t,e){let{gen:r,schema:i,data:n,keyword:o,it:a}=t;a.items=!0;let s=r.const("len",(0,Ft._)`${n}.length`);if(i===!1)t.setParams({len:e.length}),t.pass((0,Ft._)`${s} <= ${e.length}`);else if(typeof i=="object"&&!(0,qa.alwaysValidSchema)(a,i)){let d=r.var("valid",(0,Ft._)`${s} <= ${e.length}`);r.if((0,Ft.not)(d),()=>c(d)),t.ok(d)}function c(d){r.forRange("i",e.length,s,u=>{t.subschema({keyword:o,dataProp:u,dataPropType:qa.Type.Num},d),a.allErrors||r.if((0,Ft.not)(d),()=>r.break())})}}ci.validateAdditionalItems=Cu;ci.default=Ix});var Ha=w(di=>{"use strict";Object.defineProperty(di,"__esModule",{value:!0});di.validateTuple=void 0;var Du=M(),bn=O(),Sx=ke(),Ex={keyword:"items",type:"array",schemaType:["object","array","boolean"],before:"uniqueItems",code(t){let{schema:e,it:r}=t;if(Array.isArray(e))return Ru(t,"additionalItems",e);r.items=!0,!(0,bn.alwaysValidSchema)(r,e)&&t.ok((0,Sx.validateArray)(t))}};function Ru(t,e,r=t.schema){let{gen:i,parentSchema:n,data:o,keyword:a,it:s}=t;u(n),s.opts.unevaluated&&r.length&&s.items!==!0&&(s.items=bn.mergeEvaluated.items(i,r.length,s.items));let c=i.name("valid"),d=i.const("len",(0,Du._)`${o}.length`);r.forEach((l,p)=>{(0,bn.alwaysValidSchema)(s,l)||(i.if((0,Du._)`${d} > ${p}`,()=>t.subschema({keyword:a,schemaProp:p,dataProp:p},c)),t.ok(c))});function u(l){let{opts:p,errSchemaPath:m}=s,h=r.length,f=h===l.minItems&&(h===l.maxItems||l[e]===!1);if(p.strictTuples&&!f){let v=`"${a}" is ${h}-tuple, but minItems or maxItems/${e} are not specified or different at path "${m}"`;(0,bn.checkStrictMode)(s,v,p.strictTuples)}}}di.validateTuple=Ru;di.default=Ex});var Mu=w(Fa=>{"use strict";Object.defineProperty(Fa,"__esModule",{value:!0});var jx=Ha(),Cx={keyword:"prefixItems",type:"array",schemaType:["array"],before:"uniqueItems",code:t=>(0,jx.validateTuple)(t,"items")};Fa.default=Cx});var $u=w(La=>{"use strict";Object.defineProperty(La,"__esModule",{value:!0});var _u=M(),Dx=O(),Rx=ke(),Mx=Va(),_x={message:({params:{len:t}})=>(0,_u.str)`must NOT have more than ${t} items`,params:({params:{len:t}})=>(0,_u._)`{limit: ${t}}`},$x={keyword:"items",type:"array",schemaType:["object","boolean"],before:"uniqueItems",error:_x,code(t){let{schema:e,parentSchema:r,it:i}=t,{prefixItems:n}=r;i.items=!0,!(0,Dx.alwaysValidSchema)(i,e)&&(n?(0,Mx.validateAdditionalItems)(t,n):t.ok((0,Rx.validateArray)(t)))}};La.default=$x});var ku=w(za=>{"use strict";Object.defineProperty(za,"__esModule",{value:!0});var Te=M(),In=O(),kx={message:({params:{min:t,max:e}})=>e===void 0?(0,Te.str)`must contain at least ${t} valid item(s)`:(0,Te.str)`must contain at least ${t} and no more than ${e} valid item(s)`,params:({params:{min:t,max:e}})=>e===void 0?(0,Te._)`{minContains: ${t}}`:(0,Te._)`{minContains: ${t}, maxContains: ${e}}`},Ax={keyword:"contains",type:"array",schemaType:["object","boolean"],before:"uniqueItems",trackErrors:!0,error:kx,code(t){let{gen:e,schema:r,parentSchema:i,data:n,it:o}=t,a,s,{minContains:c,maxContains:d}=i;o.opts.next?(a=c===void 0?1:c,s=d):a=1;let u=e.const("len",(0,Te._)`${n}.length`);if(t.setParams({min:a,max:s}),s===void 0&&a===0){(0,In.checkStrictMode)(o,'"minContains" == 0 without "maxContains": "contains" keyword ignored');return}if(s!==void 0&&a>s){(0,In.checkStrictMode)(o,'"minContains" > "maxContains" is always invalid'),t.fail();return}if((0,In.alwaysValidSchema)(o,r)){let f=(0,Te._)`${u} >= ${a}`;s!==void 0&&(f=(0,Te._)`${f} && ${u} <= ${s}`),t.pass(f);return}o.items=!0;let l=e.name("valid");s===void 0&&a===1?m(l,()=>e.if(l,()=>e.break())):a===0?(e.let(l,!0),s!==void 0&&e.if((0,Te._)`${n}.length > 0`,p)):(e.let(l,!1),p()),t.result(l,()=>t.reset());function p(){let f=e.name("_valid"),v=e.let("count",0);m(f,()=>e.if(f,()=>h(v)))}function m(f,v){e.forRange("i",0,u,y=>{t.subschema({keyword:"contains",dataProp:y,dataPropType:In.Type.Num,compositeRule:!0},f),v()})}function h(f){e.code((0,Te._)`${f}++`),s===void 0?e.if((0,Te._)`${f} >= ${a}`,()=>e.assign(l,!0).break()):(e.if((0,Te._)`${f} > ${s}`,()=>e.assign(l,!1).break()),a===1?e.assign(l,!0):e.if((0,Te._)`${f} >= ${a}`,()=>e.assign(l,!0)))}}};za.default=Ax});var Ou=w(Xe=>{"use strict";Object.defineProperty(Xe,"__esModule",{value:!0});Xe.validateSchemaDeps=Xe.validatePropertyDeps=Xe.error=void 0;var Ba=M(),Tx=O(),ui=ke();Xe.error={message:({params:{property:t,depsCount:e,deps:r}})=>{let i=e===1?"property":"properties";return(0,Ba.str)`must have ${i} ${r} when property ${t} is present`},params:({params:{property:t,depsCount:e,deps:r,missingProperty:i}})=>(0,Ba._)`{property: ${t},
    missingProperty: ${i},
    depsCount: ${e},
    deps: ${r}}`};var Ox={keyword:"dependencies",type:"object",schemaType:"object",error:Xe.error,code(t){let[e,r]=Nx(t);Au(t,e),Tu(t,r)}};function Nx({schema:t}){let e={},r={};for(let i in t){if(i==="__proto__")continue;let n=Array.isArray(t[i])?e:r;n[i]=t[i]}return[e,r]}function Au(t,e=t.schema){let{gen:r,data:i,it:n}=t;if(Object.keys(e).length===0)return;let o=r.let("missing");for(let a in e){let s=e[a];if(s.length===0)continue;let c=(0,ui.propertyInData)(r,i,a,n.opts.ownProperties);t.setParams({property:a,depsCount:s.length,deps:s.join(", ")}),n.allErrors?r.if(c,()=>{for(let d of s)(0,ui.checkReportMissingProp)(t,d)}):(r.if((0,Ba._)`${c} && (${(0,ui.checkMissingProp)(t,s,o)})`),(0,ui.reportMissingProp)(t,o),r.else())}}Xe.validatePropertyDeps=Au;function Tu(t,e=t.schema){let{gen:r,data:i,keyword:n,it:o}=t,a=r.name("valid");for(let s in e)(0,Tx.alwaysValidSchema)(o,e[s])||(r.if((0,ui.propertyInData)(r,i,s,o.opts.ownProperties),()=>{let c=t.subschema({keyword:n,schemaProp:s},a);t.mergeValidEvaluated(c,a)},()=>r.var(a,!0)),t.ok(a))}Xe.validateSchemaDeps=Tu;Xe.default=Ox});var qu=w(Ua=>{"use strict";Object.defineProperty(Ua,"__esModule",{value:!0});var Nu=M(),qx=O(),Vx={message:"property name must be valid",params:({params:t})=>(0,Nu._)`{propertyName: ${t.propertyName}}`},Hx={keyword:"propertyNames",type:"object",schemaType:["object","boolean"],error:Vx,code(t){let{gen:e,schema:r,data:i,it:n}=t;if((0,qx.alwaysValidSchema)(n,r))return;let o=e.name("valid");e.forIn("key",i,a=>{t.setParams({propertyName:a}),t.subschema({keyword:"propertyNames",data:a,dataTypes:["string"],propertyName:a,compositeRule:!0},o),e.if((0,Nu.not)(o),()=>{t.error(!0),n.allErrors||e.break()})}),t.ok(o)}};Ua.default=Hx});var Wa=w(Ga=>{"use strict";Object.defineProperty(Ga,"__esModule",{value:!0});var Sn=ke(),Be=M(),Fx=nt(),En=O(),Lx={message:"must NOT have additional properties",params:({params:t})=>(0,Be._)`{additionalProperty: ${t.additionalProperty}}`},zx={keyword:"additionalProperties",type:["object"],schemaType:["boolean","object"],allowUndefined:!0,trackErrors:!0,error:Lx,code(t){let{gen:e,schema:r,parentSchema:i,data:n,errsCount:o,it:a}=t;if(!o)throw new Error("ajv implementation error");let{allErrors:s,opts:c}=a;if(a.props=!0,c.removeAdditional!=="all"&&(0,En.alwaysValidSchema)(a,r))return;let d=(0,Sn.allSchemaProperties)(i.properties),u=(0,Sn.allSchemaProperties)(i.patternProperties);l(),t.ok((0,Be._)`${o} === ${Fx.default.errors}`);function l(){e.forIn("key",n,v=>{!d.length&&!u.length?h(v):e.if(p(v),()=>h(v))})}function p(v){let y;if(d.length>8){let I=(0,En.schemaRefOrVal)(a,i.properties,"properties");y=(0,Sn.isOwnProperty)(e,I,v)}else d.length?y=(0,Be.or)(...d.map(I=>(0,Be._)`${v} === ${I}`)):y=Be.nil;return u.length&&(y=(0,Be.or)(y,...u.map(I=>(0,Be._)`${(0,Sn.usePattern)(t,I)}.test(${v})`))),(0,Be.not)(y)}function m(v){e.code((0,Be._)`delete ${n}[${v}]`)}function h(v){if(c.removeAdditional==="all"||c.removeAdditional&&r===!1){m(v);return}if(r===!1){t.setParams({additionalProperty:v}),t.error(),s||e.break();return}if(typeof r=="object"&&!(0,En.alwaysValidSchema)(a,r)){let y=e.name("valid");c.removeAdditional==="failing"?(f(v,y,!1),e.if((0,Be.not)(y),()=>{t.reset(),m(v)})):(f(v,y),s||e.if((0,Be.not)(y),()=>e.break()))}}function f(v,y,I){let P={keyword:"additionalProperties",dataProp:v,dataPropType:En.Type.Str};I===!1&&Object.assign(P,{compositeRule:!0,createErrors:!1,allErrors:!1}),t.subschema(P,y)}}};Ga.default=zx});var Fu=w(Ja=>{"use strict";Object.defineProperty(Ja,"__esModule",{value:!0});var Bx=Kr(),Vu=ke(),Ya=O(),Hu=Wa(),Ux={keyword:"properties",type:"object",schemaType:"object",code(t){let{gen:e,schema:r,parentSchema:i,data:n,it:o}=t;o.opts.removeAdditional==="all"&&i.additionalProperties===void 0&&Hu.default.code(new Bx.KeywordCxt(o,Hu.default,"additionalProperties"));let a=(0,Vu.allSchemaProperties)(r);for(let l of a)o.definedProperties.add(l);o.opts.unevaluated&&a.length&&o.props!==!0&&(o.props=Ya.mergeEvaluated.props(e,(0,Ya.toHash)(a),o.props));let s=a.filter(l=>!(0,Ya.alwaysValidSchema)(o,r[l]));if(s.length===0)return;let c=e.name("valid");for(let l of s)d(l)?u(l):(e.if((0,Vu.propertyInData)(e,n,l,o.opts.ownProperties)),u(l),o.allErrors||e.else().var(c,!0),e.endIf()),t.it.definedProperties.add(l),t.ok(c);function d(l){return o.opts.useDefaults&&!o.compositeRule&&r[l].default!==void 0}function u(l){t.subschema({keyword:"properties",schemaProp:l,dataProp:l},c)}}};Ja.default=Ux});var Uu=w(Ka=>{"use strict";Object.defineProperty(Ka,"__esModule",{value:!0});var Lu=ke(),jn=M(),zu=O(),Bu=O(),Gx={keyword:"patternProperties",type:"object",schemaType:"object",code(t){let{gen:e,schema:r,data:i,parentSchema:n,it:o}=t,{opts:a}=o,s=(0,Lu.allSchemaProperties)(r),c=s.filter(f=>(0,zu.alwaysValidSchema)(o,r[f]));if(s.length===0||c.length===s.length&&(!o.opts.unevaluated||o.props===!0))return;let d=a.strictSchema&&!a.allowMatchingProperties&&n.properties,u=e.name("valid");o.props!==!0&&!(o.props instanceof jn.Name)&&(o.props=(0,Bu.evaluatedPropsToName)(e,o.props));let{props:l}=o;p();function p(){for(let f of s)d&&m(f),o.allErrors?h(f):(e.var(u,!0),h(f),e.if(u))}function m(f){for(let v in d)new RegExp(f).test(v)&&(0,zu.checkStrictMode)(o,`property ${v} matches pattern ${f} (use allowMatchingProperties)`)}function h(f){e.forIn("key",i,v=>{e.if((0,jn._)`${(0,Lu.usePattern)(t,f)}.test(${v})`,()=>{let y=c.includes(f);y||t.subschema({keyword:"patternProperties",schemaProp:f,dataProp:v,dataPropType:Bu.Type.Str},u),o.opts.unevaluated&&l!==!0?e.assign((0,jn._)`${l}[${v}]`,!0):!y&&!o.allErrors&&e.if((0,jn.not)(u),()=>e.break())})})}}};Ka.default=Gx});var Gu=w(Xa=>{"use strict";Object.defineProperty(Xa,"__esModule",{value:!0});var Wx=O(),Yx={keyword:"not",schemaType:["object","boolean"],trackErrors:!0,code(t){let{gen:e,schema:r,it:i}=t;if((0,Wx.alwaysValidSchema)(i,r)){t.fail();return}let n=e.name("valid");t.subschema({keyword:"not",compositeRule:!0,createErrors:!1,allErrors:!1},n),t.failResult(n,()=>t.reset(),()=>t.error())},error:{message:"must NOT be valid"}};Xa.default=Yx});var Wu=w(Qa=>{"use strict";Object.defineProperty(Qa,"__esModule",{value:!0});var Jx=ke(),Kx={keyword:"anyOf",schemaType:"array",trackErrors:!0,code:Jx.validateUnion,error:{message:"must match a schema in anyOf"}};Qa.default=Kx});var Yu=w(Za=>{"use strict";Object.defineProperty(Za,"__esModule",{value:!0});var Cn=M(),Xx=O(),Qx={message:"must match exactly one schema in oneOf",params:({params:t})=>(0,Cn._)`{passingSchemas: ${t.passing}}`},Zx={keyword:"oneOf",schemaType:"array",trackErrors:!0,error:Qx,code(t){let{gen:e,schema:r,parentSchema:i,it:n}=t;if(!Array.isArray(r))throw new Error("ajv implementation error");if(n.opts.discriminator&&i.discriminator)return;let o=r,a=e.let("valid",!1),s=e.let("passing",null),c=e.name("_valid");t.setParams({passing:s}),e.block(d),t.result(a,()=>t.reset(),()=>t.error(!0));function d(){o.forEach((u,l)=>{let p;(0,Xx.alwaysValidSchema)(n,u)?e.var(c,!0):p=t.subschema({keyword:"oneOf",schemaProp:l,compositeRule:!0},c),l>0&&e.if((0,Cn._)`${c} && ${a}`).assign(a,!1).assign(s,(0,Cn._)`[${s}, ${l}]`).else(),e.if(c,()=>{e.assign(a,!0),e.assign(s,l),p&&t.mergeEvaluated(p,Cn.Name)})})}}};Za.default=Zx});var Ju=w(es=>{"use strict";Object.defineProperty(es,"__esModule",{value:!0});var eP=O(),tP={keyword:"allOf",schemaType:"array",code(t){let{gen:e,schema:r,it:i}=t;if(!Array.isArray(r))throw new Error("ajv implementation error");let n=e.name("valid");r.forEach((o,a)=>{if((0,eP.alwaysValidSchema)(i,o))return;let s=t.subschema({keyword:"allOf",schemaProp:a},n);t.ok(n),t.mergeEvaluated(s)})}};es.default=tP});var Qu=w(ts=>{"use strict";Object.defineProperty(ts,"__esModule",{value:!0});var Dn=M(),Xu=O(),rP={message:({params:t})=>(0,Dn.str)`must match "${t.ifClause}" schema`,params:({params:t})=>(0,Dn._)`{failingKeyword: ${t.ifClause}}`},iP={keyword:"if",schemaType:["object","boolean"],trackErrors:!0,error:rP,code(t){let{gen:e,parentSchema:r,it:i}=t;r.then===void 0&&r.else===void 0&&(0,Xu.checkStrictMode)(i,'"if" without "then" and "else" is ignored');let n=Ku(i,"then"),o=Ku(i,"else");if(!n&&!o)return;let a=e.let("valid",!0),s=e.name("_valid");if(c(),t.reset(),n&&o){let u=e.let("ifClause");t.setParams({ifClause:u}),e.if(s,d("then",u),d("else",u))}else n?e.if(s,d("then")):e.if((0,Dn.not)(s),d("else"));t.pass(a,()=>t.error(!0));function c(){let u=t.subschema({keyword:"if",compositeRule:!0,createErrors:!1,allErrors:!1},s);t.mergeEvaluated(u)}function d(u,l){return()=>{let p=t.subschema({keyword:u},s);e.assign(a,s),t.mergeValidEvaluated(p,a),l?e.assign(l,(0,Dn._)`${u}`):t.setParams({ifClause:u})}}}};function Ku(t,e){let r=t.schema[e];return r!==void 0&&!(0,Xu.alwaysValidSchema)(t,r)}ts.default=iP});var Zu=w(rs=>{"use strict";Object.defineProperty(rs,"__esModule",{value:!0});var nP=O(),oP={keyword:["then","else"],schemaType:["object","boolean"],code({keyword:t,parentSchema:e,it:r}){e.if===void 0&&(0,nP.checkStrictMode)(r,`"${t}" without "if" is ignored`)}};rs.default=oP});var el=w(is=>{"use strict";Object.defineProperty(is,"__esModule",{value:!0});var aP=Va(),sP=Mu(),cP=Ha(),dP=$u(),uP=ku(),lP=Ou(),pP=qu(),fP=Wa(),mP=Fu(),hP=Uu(),gP=Gu(),vP=Wu(),yP=Yu(),wP=Ju(),xP=Qu(),PP=Zu();function bP(t=!1){let e=[gP.default,vP.default,yP.default,wP.default,xP.default,PP.default,pP.default,fP.default,lP.default,mP.default,hP.default];return t?e.push(sP.default,dP.default):e.push(aP.default,cP.default),e.push(uP.default),e}is.default=bP});var tl=w(ns=>{"use strict";Object.defineProperty(ns,"__esModule",{value:!0});var K=M(),IP={message:({schemaCode:t})=>(0,K.str)`must match format "${t}"`,params:({schemaCode:t})=>(0,K._)`{format: ${t}}`},SP={keyword:"format",type:["number","string"],schemaType:"string",$data:!0,error:IP,code(t,e){let{gen:r,data:i,$data:n,schema:o,schemaCode:a,it:s}=t,{opts:c,errSchemaPath:d,schemaEnv:u,self:l}=s;if(!c.validateFormats)return;n?p():m();function p(){let h=r.scopeValue("formats",{ref:l.formats,code:c.code.formats}),f=r.const("fDef",(0,K._)`${h}[${a}]`),v=r.let("fType"),y=r.let("format");r.if((0,K._)`typeof ${f} == "object" && !(${f} instanceof RegExp)`,()=>r.assign(v,(0,K._)`${f}.type || "string"`).assign(y,(0,K._)`${f}.validate`),()=>r.assign(v,(0,K._)`"string"`).assign(y,f)),t.fail$data((0,K.or)(I(),P()));function I(){return c.strictSchema===!1?K.nil:(0,K._)`${a} && !${y}`}function P(){let j=u.$async?(0,K._)`(${f}.async ? await ${y}(${i}) : ${y}(${i}))`:(0,K._)`${y}(${i})`,b=(0,K._)`(typeof ${y} == "function" ? ${j} : ${y}.test(${i}))`;return(0,K._)`${y} && ${y} !== true && ${v} === ${e} && !${b}`}}function m(){let h=l.formats[o];if(!h){I();return}if(h===!0)return;let[f,v,y]=P(h);f===e&&t.pass(j());function I(){if(c.strictSchema===!1){l.logger.warn(b());return}throw new Error(b());function b(){return`unknown format "${o}" ignored in schema at path "${d}"`}}function P(b){let ae=b instanceof RegExp?(0,K.regexpCode)(b):c.code.formats?(0,K._)`${c.code.formats}${(0,K.getProperty)(o)}`:void 0,A=r.scopeValue("formats",{key:o,ref:b,code:ae});return typeof b=="object"&&!(b instanceof RegExp)?[b.type||"string",b.validate,(0,K._)`${A}.validate`]:["string",b,A]}function j(){if(typeof h=="object"&&!(h instanceof RegExp)&&h.async){if(!u.$async)throw new Error("async format in sync schema");return(0,K._)`await ${y}(${i})`}return typeof v=="function"?(0,K._)`${y}(${i})`:(0,K._)`${y}.test(${i})`}}}};ns.default=SP});var rl=w(os=>{"use strict";Object.defineProperty(os,"__esModule",{value:!0});var EP=tl(),jP=[EP.default];os.default=jP});var il=w(hr=>{"use strict";Object.defineProperty(hr,"__esModule",{value:!0});hr.contentVocabulary=hr.metadataVocabulary=void 0;hr.metadataVocabulary=["title","description","default","deprecated","readOnly","writeOnly","examples"];hr.contentVocabulary=["contentMediaType","contentEncoding","contentSchema"]});var ol=w(as=>{"use strict";Object.defineProperty(as,"__esModule",{value:!0});var CP=pu(),DP=ju(),RP=el(),MP=rl(),nl=il(),_P=[CP.default,DP.default,(0,RP.default)(),MP.default,nl.metadataVocabulary,nl.contentVocabulary];as.default=_P});var sl=w(Rn=>{"use strict";Object.defineProperty(Rn,"__esModule",{value:!0});Rn.DiscrError=void 0;var al;(function(t){t.Tag="tag",t.Mapping="mapping"})(al||(Rn.DiscrError=al={}))});var dl=w(cs=>{"use strict";Object.defineProperty(cs,"__esModule",{value:!0});var gr=M(),ss=sl(),cl=pn(),$P=Xr(),kP=O(),AP={message:({params:{discrError:t,tagName:e}})=>t===ss.DiscrError.Tag?`tag "${e}" must be string`:`value of tag "${e}" must be in oneOf`,params:({params:{discrError:t,tag:e,tagName:r}})=>(0,gr._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`},TP={keyword:"discriminator",type:"object",schemaType:"object",error:AP,code(t){let{gen:e,data:r,schema:i,parentSchema:n,it:o}=t,{oneOf:a}=n;if(!o.opts.discriminator)throw new Error("discriminator: requires discriminator option");let s=i.propertyName;if(typeof s!="string")throw new Error("discriminator: requires propertyName");if(i.mapping)throw new Error("discriminator: mapping is not supported");if(!a)throw new Error("discriminator: requires oneOf keyword");let c=e.let("valid",!1),d=e.const("tag",(0,gr._)`${r}${(0,gr.getProperty)(s)}`);e.if((0,gr._)`typeof ${d} == "string"`,()=>u(),()=>t.error(!1,{discrError:ss.DiscrError.Tag,tag:d,tagName:s})),t.ok(c);function u(){let m=p();e.if(!1);for(let h in m)e.elseIf((0,gr._)`${d} === ${h}`),e.assign(c,l(m[h]));e.else(),t.error(!1,{discrError:ss.DiscrError.Mapping,tag:d,tagName:s}),e.endIf()}function l(m){let h=e.name("valid"),f=t.subschema({keyword:"oneOf",schemaProp:m},h);return t.mergeEvaluated(f,gr.Name),h}function p(){var m;let h={},f=y(n),v=!0;for(let j=0;j<a.length;j++){let b=a[j];if(b?.$ref&&!(0,kP.schemaHasRulesButRef)(b,o.self.RULES)){let A=b.$ref;if(b=cl.resolveRef.call(o.self,o.schemaEnv.root,o.baseId,A),b instanceof cl.SchemaEnv&&(b=b.schema),b===void 0)throw new $P.default(o.opts.uriResolver,o.baseId,A)}let ae=(m=b?.properties)===null||m===void 0?void 0:m[s];if(typeof ae!="object")throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${s}"`);v=v&&(f||y(b)),I(ae,j)}if(!v)throw new Error(`discriminator: "${s}" must be required`);return h;function y({required:j}){return Array.isArray(j)&&j.includes(s)}function I(j,b){if(j.const)P(j.const,b);else if(j.enum)for(let ae of j.enum)P(ae,b);else throw new Error(`discriminator: "properties/${s}" must have "const" or "enum"`)}function P(j,b){if(typeof j!="string"||j in h)throw new Error(`discriminator: "${s}" values must be unique strings`);h[j]=b}}}};cs.default=TP});var ul=w((IC,OP)=>{OP.exports={$schema:"http://json-schema.org/draft-07/schema#",$id:"http://json-schema.org/draft-07/schema#",title:"Core schema meta-schema",definitions:{schemaArray:{type:"array",minItems:1,items:{$ref:"#"}},nonNegativeInteger:{type:"integer",minimum:0},nonNegativeIntegerDefault0:{allOf:[{$ref:"#/definitions/nonNegativeInteger"},{default:0}]},simpleTypes:{enum:["array","boolean","integer","null","number","object","string"]},stringArray:{type:"array",items:{type:"string"},uniqueItems:!0,default:[]}},type:["object","boolean"],properties:{$id:{type:"string",format:"uri-reference"},$schema:{type:"string",format:"uri"},$ref:{type:"string",format:"uri-reference"},$comment:{type:"string"},title:{type:"string"},description:{type:"string"},default:!0,readOnly:{type:"boolean",default:!1},examples:{type:"array",items:!0},multipleOf:{type:"number",exclusiveMinimum:0},maximum:{type:"number"},exclusiveMaximum:{type:"number"},minimum:{type:"number"},exclusiveMinimum:{type:"number"},maxLength:{$ref:"#/definitions/nonNegativeInteger"},minLength:{$ref:"#/definitions/nonNegativeIntegerDefault0"},pattern:{type:"string",format:"regex"},additionalItems:{$ref:"#"},items:{anyOf:[{$ref:"#"},{$ref:"#/definitions/schemaArray"}],default:!0},maxItems:{$ref:"#/definitions/nonNegativeInteger"},minItems:{$ref:"#/definitions/nonNegativeIntegerDefault0"},uniqueItems:{type:"boolean",default:!1},contains:{$ref:"#"},maxProperties:{$ref:"#/definitions/nonNegativeInteger"},minProperties:{$ref:"#/definitions/nonNegativeIntegerDefault0"},required:{$ref:"#/definitions/stringArray"},additionalProperties:{$ref:"#"},definitions:{type:"object",additionalProperties:{$ref:"#"},default:{}},properties:{type:"object",additionalProperties:{$ref:"#"},default:{}},patternProperties:{type:"object",additionalProperties:{$ref:"#"},propertyNames:{format:"regex"},default:{}},dependencies:{type:"object",additionalProperties:{anyOf:[{$ref:"#"},{$ref:"#/definitions/stringArray"}]}},propertyNames:{$ref:"#"},const:!0,enum:{type:"array",items:!0,minItems:1,uniqueItems:!0},type:{anyOf:[{$ref:"#/definitions/simpleTypes"},{type:"array",items:{$ref:"#/definitions/simpleTypes"},minItems:1,uniqueItems:!0}]},format:{type:"string"},contentMediaType:{type:"string"},contentEncoding:{type:"string"},if:{$ref:"#"},then:{$ref:"#"},else:{$ref:"#"},allOf:{$ref:"#/definitions/schemaArray"},anyOf:{$ref:"#/definitions/schemaArray"},oneOf:{$ref:"#/definitions/schemaArray"},not:{$ref:"#"}},default:!0}});var us=w((B,ds)=>{"use strict";Object.defineProperty(B,"__esModule",{value:!0});B.MissingRefError=B.ValidationError=B.CodeGen=B.Name=B.nil=B.stringify=B.str=B._=B.KeywordCxt=B.Ajv=void 0;var NP=au(),qP=ol(),VP=dl(),ll=ul(),HP=["/properties"],Mn="http://json-schema.org/draft-07/schema",vr=class extends NP.default{_addVocabularies(){super._addVocabularies(),qP.default.forEach(e=>this.addVocabulary(e)),this.opts.discriminator&&this.addKeyword(VP.default)}_addDefaultMetaSchema(){if(super._addDefaultMetaSchema(),!this.opts.meta)return;let e=this.opts.$data?this.$dataMetaSchema(ll,HP):ll;this.addMetaSchema(e,Mn,!1),this.refs["http://json-schema.org/schema"]=Mn}defaultMeta(){return this.opts.defaultMeta=super.defaultMeta()||(this.getSchema(Mn)?Mn:void 0)}};B.Ajv=vr;ds.exports=B=vr;ds.exports.Ajv=vr;Object.defineProperty(B,"__esModule",{value:!0});B.default=vr;var FP=Kr();Object.defineProperty(B,"KeywordCxt",{enumerable:!0,get:function(){return FP.KeywordCxt}});var yr=M();Object.defineProperty(B,"_",{enumerable:!0,get:function(){return yr._}});Object.defineProperty(B,"str",{enumerable:!0,get:function(){return yr.str}});Object.defineProperty(B,"stringify",{enumerable:!0,get:function(){return yr.stringify}});Object.defineProperty(B,"nil",{enumerable:!0,get:function(){return yr.nil}});Object.defineProperty(B,"Name",{enumerable:!0,get:function(){return yr.Name}});Object.defineProperty(B,"CodeGen",{enumerable:!0,get:function(){return yr.CodeGen}});var LP=un();Object.defineProperty(B,"ValidationError",{enumerable:!0,get:function(){return LP.default}});var zP=Xr();Object.defineProperty(B,"MissingRefError",{enumerable:!0,get:function(){return zP.default}})});var wl=w(Ze=>{"use strict";Object.defineProperty(Ze,"__esModule",{value:!0});Ze.formatNames=Ze.fastFormats=Ze.fullFormats=void 0;function Qe(t,e){return{validate:t,compare:e}}Ze.fullFormats={date:Qe(hl,ms),time:Qe(ps(!0),hs),"date-time":Qe(pl(!0),vl),"iso-time":Qe(ps(),gl),"iso-date-time":Qe(pl(),yl),duration:/^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,uri:JP,"uri-reference":/^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,"uri-template":/^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,url:/^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,email:/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,hostname:/^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,ipv4:/^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,ipv6:/^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,regex:rb,uuid:/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,"json-pointer":/^(?:\/(?:[^~/]|~0|~1)*)*$/,"json-pointer-uri-fragment":/^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,"relative-json-pointer":/^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,byte:KP,int32:{type:"number",validate:ZP},int64:{type:"number",validate:eb},float:{type:"number",validate:ml},double:{type:"number",validate:ml},password:!0,binary:!0};Ze.fastFormats={...Ze.fullFormats,date:Qe(/^\d\d\d\d-[0-1]\d-[0-3]\d$/,ms),time:Qe(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,hs),"date-time":Qe(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,vl),"iso-time":Qe(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,gl),"iso-date-time":Qe(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,yl),uri:/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,"uri-reference":/^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,email:/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i};Ze.formatNames=Object.keys(Ze.fullFormats);function BP(t){return t%4===0&&(t%100!==0||t%400===0)}var UP=/^(\d\d\d\d)-(\d\d)-(\d\d)$/,GP=[0,31,28,31,30,31,30,31,31,30,31,30,31];function hl(t){let e=UP.exec(t);if(!e)return!1;let r=+e[1],i=+e[2],n=+e[3];return i>=1&&i<=12&&n>=1&&n<=(i===2&&BP(r)?29:GP[i])}function ms(t,e){if(t&&e)return t>e?1:t<e?-1:0}var ls=/^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;function ps(t){return function(r){let i=ls.exec(r);if(!i)return!1;let n=+i[1],o=+i[2],a=+i[3],s=i[4],c=i[5]==="-"?-1:1,d=+(i[6]||0),u=+(i[7]||0);if(d>23||u>59||t&&!s)return!1;if(n<=23&&o<=59&&a<60)return!0;let l=o-u*c,p=n-d*c-(l<0?1:0);return(p===23||p===-1)&&(l===59||l===-1)&&a<61}}function hs(t,e){if(!(t&&e))return;let r=new Date("2020-01-01T"+t).valueOf(),i=new Date("2020-01-01T"+e).valueOf();if(r&&i)return r-i}function gl(t,e){if(!(t&&e))return;let r=ls.exec(t),i=ls.exec(e);if(r&&i)return t=r[1]+r[2]+r[3],e=i[1]+i[2]+i[3],t>e?1:t<e?-1:0}var fs=/t|\s/i;function pl(t){let e=ps(t);return function(i){let n=i.split(fs);return n.length===2&&hl(n[0])&&e(n[1])}}function vl(t,e){if(!(t&&e))return;let r=new Date(t).valueOf(),i=new Date(e).valueOf();if(r&&i)return r-i}function yl(t,e){if(!(t&&e))return;let[r,i]=t.split(fs),[n,o]=e.split(fs),a=ms(r,n);if(a!==void 0)return a||hs(i,o)}var WP=/\/|:/,YP=/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;function JP(t){return WP.test(t)&&YP.test(t)}var fl=/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;function KP(t){return fl.lastIndex=0,fl.test(t)}var XP=-(2**31),QP=2**31-1;function ZP(t){return Number.isInteger(t)&&t<=QP&&t>=XP}function eb(t){return Number.isInteger(t)}function ml(){return!0}var tb=/[^\\]\\Z/;function rb(t){if(tb.test(t))return!1;try{return new RegExp(t),!0}catch{return!1}}});var xl=w(wr=>{"use strict";Object.defineProperty(wr,"__esModule",{value:!0});wr.formatLimitDefinition=void 0;var ib=us(),Ue=M(),St=Ue.operators,_n={formatMaximum:{okStr:"<=",ok:St.LTE,fail:St.GT},formatMinimum:{okStr:">=",ok:St.GTE,fail:St.LT},formatExclusiveMaximum:{okStr:"<",ok:St.LT,fail:St.GTE},formatExclusiveMinimum:{okStr:">",ok:St.GT,fail:St.LTE}},nb={message:({keyword:t,schemaCode:e})=>(0,Ue.str)`should be ${_n[t].okStr} ${e}`,params:({keyword:t,schemaCode:e})=>(0,Ue._)`{comparison: ${_n[t].okStr}, limit: ${e}}`};wr.formatLimitDefinition={keyword:Object.keys(_n),type:"string",schemaType:"string",$data:!0,error:nb,code(t){let{gen:e,data:r,schemaCode:i,keyword:n,it:o}=t,{opts:a,self:s}=o;if(!a.validateFormats)return;let c=new ib.KeywordCxt(o,s.RULES.all.format.definition,"format");c.$data?d():u();function d(){let p=e.scopeValue("formats",{ref:s.formats,code:a.code.formats}),m=e.const("fmt",(0,Ue._)`${p}[${c.schemaCode}]`);t.fail$data((0,Ue.or)((0,Ue._)`typeof ${m} != "object"`,(0,Ue._)`${m} instanceof RegExp`,(0,Ue._)`typeof ${m}.compare != "function"`,l(m)))}function u(){let p=c.schema,m=s.formats[p];if(!m||m===!0)return;if(typeof m!="object"||m instanceof RegExp||typeof m.compare!="function")throw new Error(`"${n}": format "${p}" does not define "compare" function`);let h=e.scopeValue("formats",{key:p,ref:m,code:a.code.formats?(0,Ue._)`${a.code.formats}${(0,Ue.getProperty)(p)}`:void 0});t.fail$data(l(h))}function l(p){return(0,Ue._)`${p}.compare(${r}, ${i}) ${_n[n].fail} 0`}},dependencies:["format"]};var ob=t=>(t.addKeyword(wr.formatLimitDefinition),t);wr.default=ob});var Sl=w((li,Il)=>{"use strict";Object.defineProperty(li,"__esModule",{value:!0});var xr=wl(),ab=xl(),gs=M(),Pl=new gs.Name("fullFormats"),sb=new gs.Name("fastFormats"),vs=(t,e={keywords:!0})=>{if(Array.isArray(e))return bl(t,e,xr.fullFormats,Pl),t;let[r,i]=e.mode==="fast"?[xr.fastFormats,sb]:[xr.fullFormats,Pl],n=e.formats||xr.formatNames;return bl(t,n,r,i),e.keywords&&(0,ab.default)(t),t};vs.get=(t,e="full")=>{let i=(e==="fast"?xr.fastFormats:xr.fullFormats)[t];if(!i)throw new Error(`Unknown format "${t}"`);return i};function bl(t,e,r,i){var n,o;(n=(o=t.opts.code).formats)!==null&&n!==void 0||(o.formats=(0,gs._)`require("ajv-formats/dist/formats").${i}`);for(let a of e)t.addFormat(a,r[a])}Il.exports=li=vs;Object.defineProperty(li,"__esModule",{value:!0});li.default=vs});var CS={};Pp(CS,{activate:()=>ES,deactivate:()=>jS});module.exports=bp(CS);var U=L(require("vscode"));var C=L(require("vscode")),jr=L(require("path"));var We=L(require("vscode"));function Qn(t){let e=We.Uri.joinPath(t,".."),r=t.path.split("/").pop()?.replace(/\.nodegraph\.json$/,"")??"graph";return We.Uri.joinPath(e,`.${r}-imgs`)}function Ip(t,e,r){let i=We.Uri.joinPath(Qn(e),r);return t.asWebviewUri(i).toString()}var Ms=/\[\[IMG:([^:\]]+)(?::[^\]]+)?\]\]/g;function Zn(t,e,r){let i={},n=o=>{o&&!i[o]&&(i[o]=Ip(t,e,o))};for(let o of r.nodes){Ms.lastIndex=0;let a;for(;(a=Ms.exec(o.content??""))!==null;)n(a[1])}for(let o of r.canvasImages??[])n(o.filename);return i}async function _s(t,e,r,i="png"){let n=Qn(e);try{await We.workspace.fs.createDirectory(n)}catch{}let o=`img_${Date.now()}.${i}`,a=We.Uri.joinPath(n,o);return await We.workspace.fs.writeFile(a,Buffer.from(r,"base64")),{filename:o,webviewUri:t.asWebviewUri(a).toString()}}async function $s(t,e){let r=We.Uri.joinPath(Qn(t),e);try{await We.workspace.fs.delete(r)}catch{}}function he(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Sp(t){let e=t.trim().replace("#",""),r=e.length===3?e.split("").map(i=>i+i).join(""):e;return/^[0-9a-fA-F]{6}$/.test(r)?{r:255-parseInt(r.slice(0,2),16),g:255-parseInt(r.slice(2,4),16),b:255-parseInt(r.slice(4,6),16)}:null}var Ep=t=>t.replace(/[^a-zA-Z0-9_-]/g,"_");function gi(t){return/^\s*\|/.test(t)&&t.indexOf("|",1)!==-1}function to(t){return/^\s*\|[\s\-:|]+\|\s*$/.test(t)&&!/[a-zA-Z0-9]/.test(t)}function ks(t){return t.replace(/^\s*\|/,"").replace(/\|\s*$/,"").split("|").map(e=>e.trim())}function jp(t){if(!t)return[{type:"text",text:"",startChar:0,endChar:0}];let e=t.split(`
`),r=[],i=0,n=0,o=a=>e[a].length+(a<e.length-1?1:0);for(;i<e.length;)if(gi(e[i])&&i+1<e.length&&to(e[i+1])){let s=n,c=[];for(;i<e.length&&gi(e[i]);)c.push(e[i]),n+=o(i),i++;c.length>=3?r.push({type:"table",headers:ks(c[0]),rows:c.slice(2).map(ks),startChar:s,endChar:n}):r.push({type:"text",text:c.join(`
`),startChar:s,endChar:n})}else{let s=n,c=[];for(;i<e.length&&!(gi(e[i])&&i+1<e.length&&to(e[i+1]));)c.push(e[i]),n+=o(i),i++;r.push({type:"text",text:c.join(`
`),startChar:s,endChar:n})}return r}function eo(t){let e=t.split(`
`);for(let r=0;r+1<e.length;r++)if(gi(e[r])&&to(e[r+1]))return!0;return!1}function Cp(t){return he(t).replace(/\\\$/g,()=>'<span class="ng-cur">$</span>')}function vi(t){return Cp(t).replace(/\*\*(.+?)\*\*/g,'<strong style="font-size:1.1em">$1</strong>')}function yi(t,e){let r=/\[\[IMG:([^:\]]+)(?::(\d+)x(\d+))?\]\]/g,i="",n=0,o;for(;(o=r.exec(t))!==null;){o.index>n&&(i+=vi(t.slice(n,o.index)));let a=o[1],s=o[2],c=o[3],d=s&&c?` width="${s}" height="${c}"`:"",u=e[a];i+=u?`<img class="ng-img${d?" ng-img-sized":""}" src="${u}"${d} alt="${he(a)}" onclick="showLightbox(this.src)" title="Click to enlarge">`:`<span class="ng-img-missing">${he(a)}</span>`,n=o.index+o[0].length}return n<t.length&&(i+=vi(t.slice(n))),i}function Dp(t,e){let r=t.headers.map(n=>`<th>${yi(n,e)}</th>`).join(""),i=t.rows.map(n=>`<tr>${n.map(o=>`<td>${yi(o,e)}</td>`).join("")}</tr>`).join("");return`<div class="ng-table-wrap"><table class="ng-table"><thead><tr>${r}</tr></thead><tbody>${i}</tbody></table></div>`}function Rp(t,e,r,i,n){let o=e?.color??"#888",a=e?.shape==="rounded"?"22px":"2px",s=he(e?.label??t.template),c=Math.round(t.position.x+r),d=Math.round(t.position.y+i),u="",l=t.content??"";if(eo(l)){let A=jp(l);u+='<div class="ng-content">';for(let re of A)re.type==="table"?u+=Dp(re,n):re.text&&(u+=`<div class="ng-seg">${yi(re.text,n).replace(/\n/g,"<br>")}</div>`);u+="</div>"}else l&&(u+=`<div class="ng-content">${yi(l,n).replace(/\n/g,"<br>")}</div>`);if(t.original){let A=he(t.original.title??"Original"),re=t.originalExpanded?" open":"";u+=`<details class="ng-original"${re}><summary>${A}${t.original.location?` <span class="ng-loc">${he(t.original.location)}</span>`:""}</summary>
<div class="ng-orig-text">${vi(t.original.text).replace(/\n/g,"<br>")}</div></details>`}for(let A of t.toggleItems??[])u+=`<details class="ng-toggle" data-toggle-id="${he(A.id)}"${A.expanded?" open":""}><summary>${he(A.title||"(untitled)")}</summary>
<div class="ng-toggle-body">${vi(A.content).replace(/\n/g,"<br>")}</div></details>`;t.links.length&&(u+=`<div class="ng-links">${t.links.map(A=>{let re=A.type==="url"?"\u{1F517}":A.type==="pdf"?"\u{1F4C4}":A.type==="obsidian"?"\u{1F7E3}":"\u2B21";return`<a class="ng-link"${A.type==="url"||A.type==="pdf"?` href="${he(A.target)}" target="_blank"`:""}>${re} ${he(A.label||A.target)}</a>`}).join("")}</div>`);let p=!!u,m=t.contentExpanded?"":' style="display:none"',h=t.children.length?` data-children="${t.children.join(",")}"`:"",f=eo(l)?" ng-has-table":"",v=/\[\[IMG:[^:\]]+:(\d+)x\d+\]\]/g,y=0,I;for(;(I=v.exec(l))!==null;)y=Math.max(y,Number(I[1]));let P=y>0?eo(l)?y+280:y+32:0,j=Math.max(t.nodeWidth??0,432,P),b=[j>432?`min-width:${j}px`:"",t.nodeHeight&&t.contentExpanded?`min-height:${t.nodeHeight}px`:""].filter(Boolean).join(";"),ae=t.nodeHeight?` data-min-h="${t.nodeHeight}"`:"";return`<div class="ng-node${f}" id="node-${he(t.id)}"${h}${ae} style="--color:${o};border-radius:${a};left:${c}px;top:${d}px${b?";"+b:""}">
  <div class="ng-header" onclick="onHeaderClick(this)" title="Click to select node">
    <span class="ng-tag" onmousedown="onNodeTagMousedown(event,this.closest('.ng-node'))" style="background:color-mix(in srgb,${o} 20%,transparent);color:${o}">${s}</span>
    ${p?`<span class="ng-title" onclick="onTitleClick(event,this)" title="Click to fold/unfold">${he(t.title)}</span>`:`<span class="ng-title">${he(t.title)}</span>`}
  </div>
  ${p?`<div class="ng-body"${m}${t.fontSize?` style="font-size:${t.fontSize}px"`:""}>${u}</div>`:""}
</div>`}function As(t,e={}){let r=1/0,i=1/0;for(let l of t.nodes)r=Math.min(r,l.position.x),i=Math.min(i,l.position.y);isFinite(r)||(r=0,i=0);let n=-r+100,o=-i+100,a=t.nodes.map(l=>Rp(l,t.nodeTemplates[l.template],n,o,e)).join(`
`),s=JSON.stringify(t.nodes.map(l=>({id:l.id,lx:Math.round(l.position.x+n),ly:Math.round(l.position.y+o),children:l.children??[],template:l.template,contentExpanded:l.contentExpanded,isMain:l.template==="main_topic",nodeHeight:l.nodeHeight??null,naturalY:Math.round((l.nodeNaturalY??l.position.y)+o),title:l.title,content:l.content??"",originalTitle:l.original?.title??"",originalText:l.original?.text??"",toggles:(l.toggleItems??[]).map(p=>({id:p.id,title:p.title,content:p.content}))}))),c=JSON.stringify(t.edges.map(l=>({source:l.source,target:l.target,type:l.type,label:l.label||""}))),d=JSON.stringify(Object.fromEntries(Object.entries(t.nodeTemplates).map(([l,p])=>[l,p.label]))),u=Object.entries(t.nodeTemplates).map(([l,p])=>{let m=Sp(p.color),h=m?`rgb(${m.r},${m.g},${m.b})`:"#ff3b30",f=m?`rgba(${m.r},${m.g},${m.b},0.18)`:"rgba(255,59,48,0.18)";return`::highlight(ng-hit-${Ep(l)}){color:${h};background-color:${f};text-decoration:underline}`}).join(`
`);return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${he(t.title)}</title>
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
    <span id="tb-title">${he(t.title)}</span>
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
</html>`}var Mp={main_topic:{label:"Main topic",color:"#4B8BBE",icon:"file-text",shape:"sharp"},method:{label:"Method",color:"#5C9E6E",icon:"cpu",shape:"sharp"},result:{label:"Result",color:"#9B59B6",icon:"bar-chart-2",shape:"sharp"},claim:{label:"Claim",color:"#E74C3C",icon:"alert-circle",shape:"sharp"},question:{label:"Question",color:"#E5A835",icon:"help-circle",shape:"rounded"},gap:{label:"Gap / Idea",color:"#1ABC9C",icon:"lightbulb",shape:"rounded"},reference:{label:"Reference",color:"#95A5A6",icon:"book-open",shape:"rounded"},memo:{label:"Memo",color:"#BDC3C7",icon:"edit-3",shape:"rounded"}};function wi(t="New Graph"){let e=new Date().toISOString();return{version:"1.0.0",title:t,created:e,modified:e,nodeTemplates:Mp,nodes:[],edges:[],viewport:{x:0,y:0,zoom:1}}}function ct(){let t="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let r=0;r<32;r++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}var xe=L(require("vscode"));var Ye=class t{static{this.panels=new Map}static async openAndSearch(e,r,i,n){let o=r.toString(),a=t.panels.get(o);if(a){a.panel.reveal(xe.ViewColumn.Beside,!0),a.ready?a.panel.webview.postMessage({type:"search",query:i,pageHint:n}):a.pending={query:i,pageHint:n};return}let s;try{s=await xe.workspace.fs.readFile(r)}catch{xe.window.showErrorMessage(`PDF\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4: ${r.fsPath}`);return}let c=xe.window.createWebviewPanel("nodegraph.pdfViewer",r.path.split("/").pop()??"PDF",{viewColumn:xe.ViewColumn.Beside,preserveFocus:!1},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[xe.Uri.joinPath(e.extensionUri,"dist")]}),d={panel:c,ready:!1,pending:{query:i,pageHint:n}};t.panels.set(o,d),c.iconPath=xe.Uri.joinPath(e.extensionUri,"resources","icon-hires.png"),c.webview.html=t._getHtml(e,c.webview);let u=Buffer.from(s).toString("base64");c.webview.onDidReceiveMessage(l=>{l.type==="ready"&&(d.ready=!0,c.webview.postMessage({type:"load",pdfData:u,query:d.pending?.query,pageHint:d.pending?.pageHint}),d.pending=null)}),c.onDidDispose(()=>{t.panels.delete(o)})}static _getHtml(e,r){let i=r.asWebviewUri(xe.Uri.joinPath(e.extensionUri,"dist","pdfviewer.js")),n=r.asWebviewUri(xe.Uri.joinPath(e.extensionUri,"dist","pdfviewer.css")),o=r.asWebviewUri(xe.Uri.joinPath(e.extensionUri,"dist","pdf.worker.min.mjs")),a=ct();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${r.cspSource} data: blob:; script-src 'nonce-${a}' ${r.cspSource}; style-src 'unsafe-inline' ${r.cspSource}; worker-src ${r.cspSource} blob:; connect-src ${r.cspSource} blob:;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${n}">
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
  <script nonce="${a}" type="module" src="${i}"></script>
</body>
</html>`}};var qe=class t{constructor(e){this.context=e;this._pendingSaves=new Set}static{this.panels=new Map}static{this.selectionEmitter=new C.EventEmitter}static{this.onDidSelectNode=t.selectionEmitter.event}static register(e){let r=new t(e);return C.window.registerCustomEditorProvider("nodegraph.editor",r,{webviewOptions:{retainContextWhenHidden:!0}})}static{this._activeWebview=null}static postToActive(e){t._activeWebview?.postMessage(e)}static focusNode(e,r){let i=t.panels.get(jr.resolve(e));return i?(i.reveal(i.viewColumn,!1),i.webview.postMessage({type:"focusNode",nodeId:r}),!0):!1}async resolveCustomTextEditor(e,r,i){r.iconPath=C.Uri.joinPath(this.context.extensionUri,"resources","icon-hires.png");let n=C.Uri.joinPath(e.uri,"..");r.webview.options={enableScripts:!0,localResourceRoots:[this.context.extensionUri,n]},r.webview.html=this._getHtmlForWebview(r.webview);let o=jr.resolve(e.uri.fsPath);t.panels.set(o,r);let a=d=>{let u=e.getText();try{let l=u.trim()===""?wi():JSON.parse(u),p=Zn(r.webview,e.uri,l);r.webview.postMessage({type:d,data:l,imageUris:p})}catch{}},s=r.webview.onDidReceiveMessage(async d=>{if(d.type==="ready")a("load");else if(d.type==="save"){let u=e.uri.toString();this._pendingSaves.add(u);try{let l=new C.WorkspaceEdit,p=new C.Range(e.positionAt(0),e.positionAt(e.getText().length));l.replace(e.uri,p,JSON.stringify(d.data,null,2)),await C.workspace.applyEdit(l),await e.save()}finally{this._pendingSaves.delete(u)}}else if(d.type==="openLink"){let u=d.link;if(u.type==="url")C.env.openExternal(C.Uri.parse(u.target));else if(u.type==="pdf"){let l=C.Uri.joinPath(C.Uri.joinPath(e.uri,".."),u.target);C.env.openExternal(l)}else u.type==="obsidian"&&C.env.openExternal(C.Uri.parse(u.target))}else if(d.type==="searchInPdf"){let u=C.Uri.joinPath(C.Uri.joinPath(e.uri,".."),d.pdfTarget);Ye.openAndSearch(this.context,u,d.query,d.pageHint)}else if(d.type==="exportHtml")try{let u=d.data,l=C.Uri.joinPath(e.uri,".."),p=jr.basename(e.uri.fsPath,".nodegraph.json"),m=C.Uri.joinPath(l,`.${p}-imgs`),h={},f=/\[\[IMG:([^:\]]+)(?::[^\]]+)?\]\]/g,v=async j=>{if(!(!j||h[j]))try{let b=C.Uri.joinPath(m,j),ae=await C.workspace.fs.readFile(b),A=j.split(".").pop()?.toLowerCase()??"png",re=A==="jpg"||A==="jpeg"?"image/jpeg":A==="gif"?"image/gif":A==="webp"?"image/webp":"image/png";h[j]=`data:${re};base64,${Buffer.from(ae).toString("base64")}`}catch{}};for(let j of u.nodes){f.lastIndex=0;let b;for(;(b=f.exec(j.content??""))!==null;)await v(b[1])}let y=As(u,h),I=C.Uri.joinPath(l,`${p}.html`);await C.workspace.fs.writeFile(I,Buffer.from(y,"utf-8"));let P=await C.window.showInformationMessage(`HTML exported: ${p}.html`,"Open in Browser","Show in Explorer");P==="Open in Browser"?C.env.openExternal(I):P==="Show in Explorer"&&C.commands.executeCommand("revealFileInOS",I)}catch(u){C.window.showErrorMessage(`HTML export failed: ${u}`)}else if(d.type==="saveImage")try{let{filename:u,webviewUri:l}=await _s(r.webview,e.uri,d.data,d.ext??"png");r.webview.postMessage({type:"imageSaved",nodeId:d.nodeId,filename:u,webviewUri:l})}catch(u){C.window.showErrorMessage(`Failed to save image: ${u}`)}else if(d.type==="deleteImageFile")await $s(e.uri,d.filename);else if(d.type==="reload")try{let u=await C.workspace.fs.readFile(e.uri),l=Buffer.from(u).toString("utf-8"),p=JSON.parse(l),m=Zn(r.webview,e.uri,p);r.webview.postMessage({type:"load",data:p,imageUris:m})}catch{a("load")}else if(d.type==="openHelp"){let u=C.Uri.joinPath(this.context.extensionUri,"README.md");C.commands.executeCommand("markdown.showPreviewToSide",u.with({fragment:"features"}))}else d.type==="nodeSelected"&&typeof d.nodeId=="string"&&t.selectionEmitter.fire({paperPath:e.uri.fsPath,nodeId:d.nodeId})}),c=C.workspace.onDidChangeTextDocument(d=>{d.document.uri.toString()===e.uri.toString()&&(this._pendingSaves.has(e.uri.toString())||a("externalChange"))});t._activeWebview=r.webview,r.onDidChangeViewState(d=>{d.webviewPanel.active&&(t._activeWebview=r.webview,r.webview.postMessage({type:"focusCanvas"}))}),r.onDidDispose(()=>{s.dispose(),c.dispose(),t.panels.get(o)===r&&t.panels.delete(o),t._activeWebview===r.webview&&(t._activeWebview=null)})}_getHtmlForWebview(e){let r=e.asWebviewUri(C.Uri.joinPath(this.context.extensionUri,"dist","webview.js")),i=e.asWebviewUri(C.Uri.joinPath(this.context.extensionUri,"dist","katex","katex.min.css")),n=ct();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${e.cspSource} blob: data:; script-src 'nonce-${n}'; style-src 'unsafe-inline' ${e.cspSource}; font-src ${e.cspSource};">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NodeGraph</title>
  <link rel="stylesheet" href="${i}">
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
  <script nonce="${n}" src="${r}"></script>
</body>
</html>`}};var ee=L(require("vscode"));var Ts=require("child_process"),_p=5e3;function Wt(t,e){let r=(0,Ts.spawnSync)(t,e,{encoding:"utf8",shell:!1,timeout:_p,windowsHide:!0});return r.error||r.status!==0?"":[r.stdout,r.stderr].filter(Boolean).join(`
`).trim()}function Pe(t,e){return Wt(t,e)!==""}function $p(){let t=[],e=new Date().toISOString(),r=process.platform,i=r==="win32"?"Windows":r==="darwin"?"macOS":"Linux",n=process.arch,o=Wt("python3",["--version"])||Wt("python",["--version"]),a=Pe("python3",["--version"])?"python3":Pe("python",["--version"])?"python":"",s=a!=="",c=s&&Pe(a,["-c",'import fitz; print("ok")']),d=c?Wt(a,["-c","import fitz; print(fitz.__version__)"]):"",u=s&&Pe(a,["-c",'import pdfplumber; print("ok")']),l=s&&Pe(a,["-c",'import pdfminer; print("ok")']),p=s&&Pe(a,["-c",'from PIL import Image; print("ok")']),m=p?Wt(a,["-c","from PIL import __version__; print(__version__)"]):"",h=s&&Pe(a,["-c",'import cv2; print("ok")']),f=Pe("pdftotext",["-v"])||Pe("pdftotext",["--help"]),v=Pe("convert",["--version"]),y=Pe("magick",["--version"]),I=Pe("gs",["--version"])||Pe("gswin64c",["--version"]),P=j=>j?"\u2705":"\u274C";return t.push("# NodeGraph \u2014 Agent Environment Report"),t.push(""),t.push("> Auto-generated by the NodeGraph extension at activation."),t.push("> **AI agents: read this file to understand what tools are available on this machine.**"),t.push("> Re-generated each time a `.nodegraph.json` file is opened."),t.push(""),t.push(`Generated: \`${e}\``),t.push(""),t.push("---"),t.push(""),t.push("## System"),t.push(""),t.push("| | |"),t.push("|---|---|"),t.push(`| OS | ${i} (\`${r}\`) |`),t.push(`| Architecture | \`${n}\` |`),t.push(`| Python | ${s?`${P(!0)} \`${o}\``:`${P(!1)} not found`} |`),t.push(`| Python command | ${s?`\`${a}\``:"N/A"} |`),t.push(""),t.push("---"),t.push(""),t.push("## PDF Reading Capabilities"),t.push(""),t.push("| Tool | Available | Notes |"),t.push("|------|:---------:|-------|"),t.push(`| PyMuPDF (\`fitz\`) | ${P(c)} | ${c?`v${d} \u2014 recommended`:"Install: `pip install pymupdf`"} |`),t.push(`| pdfplumber | ${P(u)} | ${u?"available":"Install: `pip install pdfplumber`"} |`),t.push(`| pdfminer | ${P(l)} | ${l?"available":"Install: `pip install pdfminer.six`"} |`),t.push(`| poppler (\`pdftotext\`) | ${P(f)} | ${f?"CLI tool available":r==="win32"?"Install: download poppler for Windows":r==="darwin"?"Install: `brew install poppler`":"Install: `apt install poppler-utils`"} |`),t.push(`| Ghostscript (\`gs\`) | ${P(I)} | ${I?"available":"optional"} |`),t.push(""),t.push("---"),t.push(""),t.push("## Image Processing Capabilities"),t.push(""),t.push("| Tool | Available | Notes |"),t.push("|------|:---------:|-------|"),t.push(`| Pillow (\`PIL\`) | ${P(p)} | ${p?`v${m} \u2014 recommended`:"Install: `pip install Pillow`"} |`),t.push(`| OpenCV (\`cv2\`) | ${P(h)} | ${h?"available":"Install: `pip install opencv-python`"} |`),t.push(`| ImageMagick (\`convert\`) | ${P(v||y)} | ${v||y?"CLI tool available":r==="win32"?"Install: imagemagick.org":r==="darwin"?"Install: `brew install imagemagick`":"Install: `apt install imagemagick`"} |`),t.push(""),t.push("---"),t.push(""),t.push("## Agent Recommendations"),t.push(""),s||(t.push("> \u26A0\uFE0F **Python not found.** PDF reading and image processing via Python are not available."),t.push("> Install Python from https://python.org, then reopen a `.nodegraph.json` file to re-run this check."),t.push("")),t.push("### Reading a PDF"),c?(t.push("Use PyMuPDF (recommended \u2014 fastest and most accurate):"),t.push("```python"),t.push("import fitz"),t.push('doc = fitz.open("paper.pdf")'),t.push('text = "\\n".join(page.get_text() for page in doc)'),t.push("```")):u?(t.push("Use pdfplumber:"),t.push("```python"),t.push("import pdfplumber"),t.push('with pdfplumber.open("paper.pdf") as pdf:'),t.push('    text = "\\n".join(p.extract_text() or "" for p in pdf.pages)'),t.push("```")):f?(t.push("Use poppler CLI:"),t.push("```bash"),t.push("pdftotext paper.pdf -"),t.push("```")):t.push("\u274C No PDF reading tool available. Ask the user to install PyMuPDF: `pip install pymupdf`"),t.push(""),t.push("### Extracting images from a PDF"),c?(t.push("```python"),t.push("import fitz"),t.push('doc = fitz.open("paper.pdf")'),t.push("for i, page in enumerate(doc):"),t.push("    for img in page.get_images():"),t.push("        xref = img[0]"),t.push("        pix = fitz.Pixmap(doc, xref)"),t.push('        pix.save(f"fig_{i}_{xref}.png")'),t.push("```")):p?t.push("Pillow is available but cannot extract from PDF directly. Use PyMuPDF for extraction."):t.push("\u274C No image extraction tool available."),t.push(""),t.push("---"),t.push(""),t.push("*To refresh this report, reopen any `.nodegraph.json` file.*"),t.join(`
`)}async function ro(t){let e=ee.Uri.joinPath(t,".agent"),r=ee.Uri.joinPath(e,"ENVIRONMENT.md");try{return await ee.workspace.fs.createDirectory(e),await ee.workspace.fs.writeFile(r,Buffer.from($p(),"utf-8")),!0}catch{return!1}}async function Os(t){if(!(!t||t.length===0))for(let e of t)await ro(e.uri)}async function Ns(t,e){let r=ee.Uri.joinPath(t,".agent","NODEGRAPH_SPEC.md"),i;try{i=await ee.workspace.fs.readFile(r)}catch{return!1}let n=ee.Uri.joinPath(e,".agent"),o=ee.Uri.joinPath(n,"NODEGRAPH_SPEC.md");try{return await ee.workspace.fs.createDirectory(n),await ee.workspace.fs.writeFile(o,i),!0}catch{return!1}}async function qs(t,e){let r=ee.Uri.joinPath(t,".prompt"),i=ee.Uri.joinPath(e,".prompt");try{await ee.workspace.fs.createDirectory(i);for(let n of["korean.md","english.md"]){let o=await ee.workspace.fs.readFile(ee.Uri.joinPath(r,n));await ee.workspace.fs.writeFile(ee.Uri.joinPath(i,n),o)}return!0}catch{return!1}}var Ie=require("fs/promises"),be=L(require("path")),no=require("crypto"),xi=class{constructor(e={}){this.hooks=e}async write(e,r,i){let n=`${JSON.stringify(r,null,2)}
`;await this.writeText(e,n,i)}async writeText(e,r,i){let n=Vs(e);await(0,Ie.mkdir)(be.dirname(e),{recursive:!0});try{await Hs(n,r),await this.hooks.beforeReplace?.(e,n),await i?.(),await(0,Ie.rename)(n,e),await io(be.dirname(e))}catch(o){try{await Cr(n)}catch(a){throw new Pi(o,a)}throw o}}async remove(e){try{await(0,Ie.unlink)(e),await io(be.dirname(e))}catch(r){if(!oo(r))throw r}}async writeBatch(e){let r=e.map(kp);try{await Tp(r),await this.verifyBatch(r),await Op(r)}catch(i){throw await qp(r,i),i}await Hp(r)}async verifyBatch(e){for(let r of e)await this.hooks.beforeReplace?.(r.target,r.temporary)}};function Vs(t){let e=`.${be.basename(t)}.${(0,no.randomUUID)()}.tmp`;return be.join(be.dirname(t),e)}function kp(t){return{target:t.target,temporary:Vs(t.target),backup:Ap(t.target),content:`${JSON.stringify(t.value,null,2)}
`,backedUp:!1,replaced:!1}}function Ap(t){let e=`.${be.basename(t)}.${(0,no.randomUUID)()}.backup`;return be.join(be.dirname(t),e)}async function Tp(t){for(let e of t)await(0,Ie.mkdir)(be.dirname(e.target),{recursive:!0}),await Hs(e.temporary,e.content)}async function Op(t){for(let e of t)e.backedUp=await Np(e.target,e.backup),await(0,Ie.rename)(e.temporary,e.target),e.replaced=!0}async function Np(t,e){try{return await(0,Ie.rename)(t,e),!0}catch(r){if(oo(r))return!1;throw r}}async function qp(t,e){try{for(let r of[...t].reverse())await Vp(r)}catch(r){throw new Pi(e,r)}}async function Vp(t){t.replaced&&await Cr(t.target),t.backedUp&&await(0,Ie.rename)(t.backup,t.target),await Cr(t.temporary)}async function Hp(t){for(let e of t)await Cr(e.temporary),await Cr(e.backup),await io(be.dirname(e.target))}var Pi=class extends Error{constructor(r,i){super("atomic-write-cleanup-failed");this.cause=r;this.cleanupCause=i}};async function Hs(t,e){let r=await(0,Ie.open)(t,"wx");try{await r.writeFile(e,"utf8"),await r.sync()}finally{await r.close()}}async function io(t){try{let e=await(0,Ie.open)(t,"r");try{await e.sync()}finally{await e.close()}}catch{}}async function Cr(t){try{await(0,Ie.unlink)(t)}catch(e){if(!oo(e))throw e}}function oo(t){return typeof t=="object"&&t!==null&&"code"in t&&t.code==="ENOENT"}var Jt=require("fs/promises"),Gs=L(require("path")),Ws=require("crypto");function g(t){return{layer:t.layer,severity:t.severity??"error",code:t.code,file:t.file,rule:t.rule,action:t.action,...t.objectId?{objectId:t.objectId}:{},...t.jsonPath?{jsonPath:t.jsonPath}:{}}}function D(t){return t.some(e=>e.severity==="error")}var Ct="0.0.0",dt="1.0.0",ge="1.1.0",G="1.2.0",ut="1.0.0",Yt="1.1.0",Fs="1.0.0",Ls="1.0.0",Se="1.2.0",zs="nodegraph-evidence-confidence",Bs="1.0.0",ao=Ct,W={now:()=>new Date().toISOString()};var bi=class{constructor(e,r,i=W){this.paths=e;this.schemas=r;this.clock=i}async append(e,r,i,n=!1){let o=await this.paths.resolve(e,r),a=Fp(i,this.clock.now()),s=this.schemas.validate("audit-event.schema.json",a,r);if(D(s))throw new lt("invalid-audit-event",s);return await Us(o,r,n),await Lp(o,`${JSON.stringify(a)}
`),a}async assertAppendable(e,r,i=!1){let n=await this.paths.resolve(e,r);await Us(n,r,i)}async inspect(e,r){let i=await this.paths.resolve(e,r),n=await Ys(i);return n.missing?{events:[],diagnostics:[Ks(r)]}:zp(n.text,r,this.schemas)}},lt=class extends Error{constructor(r,i=[]){super(r);this.code=r;this.diagnostics=i}};function Fp(t,e){return{eventId:`evt_${(0,Ws.randomUUID)().replace(/-/g,"")}`,timestamp:e,actor:t.actor,action:t.action,objectId:t.objectId,...t.beforeHash?{beforeHash:t.beforeHash}:{},...t.afterHash?{afterHash:t.afterHash}:{},...t.baseRevision?{baseRevision:t.baseRevision}:{},...t.resultingRevision?{resultingRevision:t.resultingRevision}:{},...t.metadata?{metadata:t.metadata}:{}}}async function Us(t,e,r){let i=await Ys(t);if(i.missing&&!r)throw new lt("missing-audit-log",[Ks(e)]);if(i.text&&!i.text.endsWith(`
`))throw new lt("truncated-audit-final-line",[Js(e)])}async function Lp(t,e){await(0,Jt.mkdir)(Gs.dirname(t),{recursive:!0});let r=await(0,Jt.open)(t,"a");try{await r.writeFile(e,"utf8"),await r.sync()}finally{await r.close()}}async function Ys(t){try{return{text:await(0,Jt.readFile)(t,"utf8"),missing:!1}}catch(e){if(Up(e))return{text:"",missing:!0};throw e}}function zp(t,e,r){let i=[],n=[],o=t.split(`
`);for(let a=0;a<o.length;a++)o[a]&&Bp(o[a],a,o.length,t,e,r,i,n);return{events:i,diagnostics:n}}function Bp(t,e,r,i,n,o,a,s){let c=o.parseJson(t,n);if(!c.value){s.push(e===r-1&&!i.endsWith(`
`)?Js(n):c.diagnostics[0]);return}let d=o.validate("audit-event.schema.json",c.value,n);s.push(...d),D(d)||a.push(c.value)}function Js(t){return g({layer:"syntactic",code:"truncated-audit-final-line",file:t,severity:"warning",rule:"The audit log ends with an incomplete JSON line.",action:"Preserve the line for inspection and repair it before appending new events."})}function Ks(t){return g({layer:"integrity",code:"missing-audit-log",file:t,rule:"The project audit log is missing.",action:"Restore the audit log before applying more project writes."})}function Up(t){return typeof t=="object"&&t!==null&&"code"in t&&t.code==="ENOENT"}function Dr(t){return t.normalize("NFC").trim()}function Rr(t){let e=new Map;for(let r of t){let i=Dr(r),n=se(i);i&&!e.has(n)&&e.set(n,i)}return[...e.values()]}function se(t){return Dr(t).toLowerCase()}var Ii=class{resolve(e,r,i){let n=e.constructs.find(o=>o.constructId===r);return n?n.status==="approved"?{constructId:r,diagnostics:[]}:n.status!=="deprecated"?{diagnostics:[Kt("construct-not-approved",r,i)]}:this.resolveDeprecated(e,n,i):{diagnostics:[Kt("construct-not-found",r,i)]}}resolveTerm(e,r,i){let n=se(r),o=e.constructs.filter(s=>s.status==="approved"&&[s.canonicalName,...s.aliases].some(c=>se(c)===n));if(o.length===1)return{constructId:o[0].constructId,diagnostics:[]};let a=o.length?"ambiguous-construct-alias":"construct-alias-not-found";return{diagnostics:[Kt(a,r,i)]}}resolveDeprecated(e,r,i){let n=r.primaryConstructId;if(!n)return{diagnostics:[Kt("missing-primary-construct",r.constructId,i)]};if(n===r.constructId)return{diagnostics:[Kt("self-referential-primary",r.constructId,i)]};let o=e.constructs.find(a=>a.constructId===n);return!o||o.status!=="approved"?{diagnostics:[Kt("primary-construct-not-active",r.constructId,i)]}:{constructId:o.constructId,diagnostics:[]}}};function Kt(t,e,r){return g({layer:"structural",code:t,file:r,objectId:e,rule:`${e} does not resolve directly to an approved construct.`,action:"Map the identifier to one distinct approved primary construct."})}var so=require("crypto");function Si(t){return t.normalize("NFC").replace(/\r\n?/g,`
`).trim().replace(/\s+/gu," ")}function Mr(t){return JSON.stringify(co(t))}function S(t){return uo(Mr(t))}function Ei(t){return uo(Si(t))}function Xs(t){return uo(Mr(Gp(t)))}function _r(t){return`sha256:${(0,so.createHash)("sha256").update(t).digest("hex")}`}function Gp(t){return{evidenceId:t.evidenceId,paperId:t.paperId,source:Wp(t),quote:Yp(t),locator:Jp(t)}}function Wp(t){return{sourceId:t.source.sourceId,sourceDocumentHash:t.source.sourceDocumentHash}}function Yp(t){let e=Si(t.quote.text);return{text:e,quoteContentHash:Ei(e)}}function Jp(t){let e={page:t.locator.page,exact:Si(t.locator.exact)};return Kp(e,t,["prefix","suffix","section"]),e}function Kp(t,e,r){for(let i of r){let n=e.locator[i];n!==void 0&&(t[i]=Si(n))}}function co(t){return Array.isArray(t)?t.map(co):Qp(t)?Xp(t):t}function Xp(t){let e={};for(let r of Object.keys(t).sort())e[r]=co(t[r]);return e}function Qp(t){return t!==null&&typeof t=="object"}function uo(t){return`sha256:${(0,so.createHash)("sha256").update(t,"utf8").digest("hex")}`}var ji=class{constructor(e){this.constructs=e}validate(e,r,i=new Map){let n=of(e,r,i);return[...af(r,e),...sf(r,n,e),...cf(r,n,e,this.constructs),...mf(r,n,e),...yf(r.appraisals,n,e),...xf(r,n,e),...Pf(r,n,e)]}validateExtraction(e,r,i,n,o){let a=e.papers.find(s=>s.paperId===r.paperId);return a?[...Zp(r,a.extractionPath),...ef(r,i,a.extractionPath),...rf(r,n,a.extractionPath,this.constructs),...nf(r,o,a.extractionPath)]:[T("missing-paper-reference",r.paperId,r.extractionId)]}validateMethodologies(e,r){return Ve(e.paradigms.map(i=>i.paradigmId),r)}};function Zp(t,e){let r=[...tt(t.fields.researchQuestionsOrHypotheses),...tt(t.fields.theoreticalFramework),...tt(t.fields.dataCollection),...tt(t.fields.analysisMethod),...tt(t.fields.mechanisms),...tt(t.fields.moderators),...tt(t.fields.limitations),...tt(t.fields.boundaryConditions),...tt(t.fields.recommendations),...(t.fields.findings.items??[]).map(i=>i.findingId)];return[...Ve(t.constructMappings.map(i=>i.mappingId),e),...Ve(r,e)]}function tt(t){return(t.items??[]).map(e=>e.extractionItemId)}function ef(t,e,r){let i=new Map(e.evidence.map(n=>[n.evidenceId,n]));return tf(t).flatMap(n=>{let o=i.get(n);return o?o.paperId!==t.paperId?[T("evidence-paper-mismatch",r,n)]:[]:[T("missing-evidence-reference",r,n)]})}function tf(t){let e=Object.values(t.fields).flatMap(r=>{let i="evidenceIds"in r&&Array.isArray(r.evidenceIds)?r.evidenceIds:[],n="items"in r&&Array.isArray(r.items)?r.items.flatMap(o=>o.evidenceIds):[];return[...i,...n]});return[...new Set([...e,...t.constructMappings.flatMap(r=>r.evidenceIds)])]}function rf(t,e,r,i){let n=new Map(t.constructMappings.map(a=>[a.mappingId,a])),o=[...(t.fields.keyConstructs.mappingIds??[]).filter(a=>!n.has(a)).map(a=>T("missing-mapping-reference",r,a)),...(t.fields.findings.items??[]).flatMap(a=>a.constructMappingIds).filter(a=>!n.has(a)).map(a=>T("missing-mapping-reference",r,a))];for(let a of t.constructMappings){if(!a.constructId)continue;if(!e.constructs.find(d=>d.constructId===a.constructId)){o.push(T("missing-construct-reference",r,a.constructId));continue}let c=i.resolve(e,a.constructId,r);a.mappingStatus==="approved"&&o.push(...c.diagnostics),a.mappingStatus==="approved"&&a.reviewState.approval.researcher!=="approved"&&o.push(T("mapping-approval-required",r,a.mappingId))}return o}function nf(t,e,r){let i=t.methodology.methodologicalParadigm;if(!i.paradigmId)return[];let n=e.paradigms.find(o=>o.paradigmId===i.paradigmId);return i.mappingStatus!=="approved"?[]:n?.status==="approved"?[]:[T("paradigm-not-approved",r,i.paradigmId)]}function of(t,e,r){return{papers:new Set(t.papers.map(i=>i.paperId)),sources:new Map(t.papers.map(i=>[i.source.sourceId,i])),evidence:new Map(e.evidence.evidence.map(i=>[i.evidenceId,i])),claims:new Set(e.claims.claims.map(i=>i.claimId)),gaps:new Set(e.gaps.gaps.map(i=>i.gapId)),findings:new Map([...r].flatMap(([i,n])=>(n.fields.findings.items??[]).map(o=>[$r(i,o.findingId),{finding:o,extraction:n}]))),extractions:r}}function af(t,e){return[...Ve(t.evidence.evidence.map(r=>r.evidenceId),e.documents.evidence),...Ve(t.claims.claims.map(r=>r.claimId),e.documents.claims),...Ve(t.conflicts.conflicts.map(r=>r.conflictId),e.documents.conflicts),...Ve(t.gaps.gaps.map(r=>r.gapId),e.documents.gaps),...Ve(t.researchQuestions.researchQuestions.map(r=>r.researchQuestionId),e.documents.researchQuestions),...Ve(t.constructs.constructs.map(r=>r.constructId),e.documents.constructs)]}function Ve(t,e){let r=new Set,i=[];for(let n of t)r.has(n)&&i.push(T("duplicate-identifier",e,n)),r.add(n);return i}function sf(t,e,r){return t.evidence.evidence.flatMap(i=>{let n=[];e.papers.has(i.paperId)||n.push(T("missing-paper-reference",r.documents.evidence,i.evidenceId));let o=e.sources.get(i.source.sourceId);return(o?.paperId!==i.paperId||o.source.relativePath!==i.source.relativePath||o.source.sourceDocumentHash!==i.source.sourceDocumentHash)&&n.push(T("source-registration-mismatch",r.documents.evidence,i.evidenceId)),n})}function cf(t,e,r,i){return t.claims.claims.flatMap(n=>{let o=n.findingRefs.map(a=>({ref:a,resolved:e.findings.get($r(a.paperId,a.findingId))}));return[...n.findingRefs.filter(a=>!e.papers.has(a.paperId)).map(()=>T("missing-paper-reference",r.documents.claims,n.claimId)),...o.filter(a=>e.findings.size>0&&!a.resolved).map(a=>T("missing-finding-reference",r.documents.claims,a.ref.findingId)),...n.evidenceRefs.filter(a=>!e.evidence.has(a)).map(()=>T("missing-evidence-reference",r.documents.claims,n.claimId)),...n.evidenceRefs.flatMap(a=>df(e.evidence.get(a),n.reviewState.approval.researcher==="approved",r.documents.claims,a)),...uf(n,o,e,r),...lf(n,r.documents.claims),...pf(n,o,r.documents.claims),...(n.constructRefs??[]).flatMap(a=>ff(t.constructs,i,a,r.documents.claims))]})}function df(t,e,r,i){if(!t)return[];let n=t.reviewState.verification.source;return n!=="stale"&&n!=="rejected"?[]:[g({layer:"integrity",severity:e?"error":"warning",code:n==="stale"?"stale-claim-evidence":"rejected-claim-evidence",file:r,objectId:i,rule:`Claim evidence ${i} is ${n}.`,action:e?"Return the claim to review or restore a current verified evidence chain.":"Keep the proposal visibly invalid until the evidence issue is reviewed."})]}function uf(t,e,r,i){let n=new Set(e.flatMap(o=>o.resolved?.finding.evidenceIds??[]));return[...t.evidenceRefs.filter(o=>!n.has(o)).map(o=>T("claim-evidence-not-linked-to-finding",i.documents.claims,o)),...e.flatMap(o=>{if(!o.resolved)return[];let a=o.resolved.finding.evidenceIds.filter(s=>t.evidenceRefs.includes(s));return a.length?a.flatMap(s=>{let c=r.evidence.get(s);return!c||c.paperId===o.ref.paperId?[]:[T("evidence-paper-mismatch",i.documents.claims,s)]}):[T("finding-evidence-chain-missing",i.documents.claims,o.ref.findingId)]})]}function lf(t,e){return t.claimType==="single-study-proposition"?[]:new Set(t.findingRefs.map(r=>r.paperId)).size>=2?[]:[T("cross-paper-basis-required",e,t.claimId)]}function pf(t,e,r){return new Set(e.flatMap(n=>{let o=n.resolved?.extraction.methodology.methodologicalParadigm;return o?.mappingStatus==="approved"&&o.paradigmId?[o.paradigmId]:[]})).size<2?[]:t.paradigmDecision.required&&(t.reviewState.approval.researcher!=="approved"||t.paradigmDecision.status==="approved")?[]:[T("cross-paradigm-decision-required",r,t.claimId)]}function ff(t,e,r,i){let n=e.resolve(t,r,i);return n.diagnostics.length?n.diagnostics:t.constructs.find(a=>a.constructId===n.constructId)?.status==="approved"?[]:[T("construct-not-approved",i,r)]}function mf(t,e,r){return t.conflicts.conflicts.flatMap(i=>[...e.claims.has(i.claimId)?[]:[T("missing-claim-reference",r.documents.conflicts,i.conflictId)],...i.findingRefs.filter(n=>e.findings.size>0&&!e.findings.has($r(n.paperId,n.findingId))).map(()=>T("missing-finding-reference",r.documents.conflicts,i.conflictId)),...i.findingRefs.some(n=>vf(n.relationship))?[]:[T("conflict-dissent-required",r.documents.conflicts,i.conflictId)],...hf(i,t,r),...gf(i,r.documents.conflicts)])}function hf(t,e,r){let i=e.claims.claims.find(o=>o.claimId===t.claimId);if(!i)return[];let n=new Set(i.findingRefs.map(o=>$r(o.paperId,o.findingId)));return t.findingRefs.filter(o=>!n.has($r(o.paperId,o.findingId))).map(o=>T("conflict-finding-not-in-claim",r.documents.conflicts,o.findingId))}function gf(t,e){let r=new Set(t.contextComparisons.map(i=>i.contextComparisonId));return t.possibleExplanations.flatMap(i=>i.contextComparisonIds.filter(n=>!r.has(n)).map(n=>T("missing-context-comparison",e,n)))}function vf(t){return["contradicts","qualifies","fails-to-replicate","uses-different-definition","uses-different-population","uses-different-method"].includes(t)}function yf(t,e,r){return!t||!r.documents.appraisals?[]:[...Ve(t.appraisals.map(i=>i.appraisalId),r.documents.appraisals),...Ve(t.appraisals.map(i=>i.paperId),r.documents.appraisals),...t.appraisals.flatMap(i=>wf(i,e,r))]}function wf(t,e,r){let i=r.documents.appraisals,n=r.papers.find(a=>a.paperId===t.paperId),o=Object.values(t.fields).flatMap(a=>a.evidenceIds);return[...n?[]:[T("missing-paper-reference",i,t.appraisalId)],...n&&n.source.sourceDocumentHash!==t.sourceDocumentHash?[T("stale-appraisal-source",i,t.appraisalId)]:[],...e.extractions.has(t.paperId)&&S(e.extractions.get(t.paperId))!==t.extractionRevision?[T("stale-appraisal-extraction",i,t.appraisalId)]:[],...o.flatMap(a=>{let s=e.evidence.get(a);return s?s.paperId===t.paperId?[]:[T("evidence-paper-mismatch",i,a)]:[T("missing-evidence-reference",i,a)]})]}function xf(t,e,r){return t.gaps.gaps.flatMap(i=>[...i.evidenceRefs.filter(n=>!e.evidence.has(n)).map(()=>T("missing-evidence-reference",r.documents.gaps,i.gapId)),...i.adversarialPasses.filter(n=>n.gapId!==i.gapId).map(()=>T("adversarial-gap-mismatch",r.documents.gaps,i.gapId))])}function Pf(t,e,r){return t.researchQuestions.researchQuestions.flatMap(i=>[...i.gapRefs.filter(n=>!e.gaps.has(n)).map(()=>T("missing-gap-reference",r.documents.researchQuestions,i.researchQuestionId)),...i.claimRefs.filter(n=>!e.claims.has(n)).map(()=>T("missing-claim-reference",r.documents.researchQuestions,i.researchQuestionId))])}function T(t,e,r){return g({layer:"structural",code:t,file:e,objectId:r,rule:`${r} contains an unresolved or duplicated project reference.`,action:"Restore the referenced authoritative object or correct the reference."})}function $r(t,e){return`${t}\0${e}`}var ec=require("crypto");var Ci=class{constructor(e,r){this.schemas=e;this.synthesis=r}read(e,r,i){let n=r.papers.find(o=>o.paperId===i);return n?this.synthesis.readExtraction(e,n):Promise.resolve({diagnostics:[Qs(i)]})}async importProposal(e,r,i,n,o){let a=r.papers.find(c=>c.paperId===i.paperId);if(!a?.extractionPath)return Zs(i,n,[Qs(i.paperId)]);let s=[...this.schemas.validate("extraction.schema.json",i,a.extractionPath),...bf(i,o,a.extractionPath)];return D(s)?Zs(i,n,s):this.synthesis.applyMutation(e,r,{mutationId:`mutation_${(0,ec.randomUUID)().replace(/-/g,"")}`,targetDocument:a.extractionPath,baseRevision:n,operations:[{op:"replace",path:"",value:i}],requestedAt:i.modified,actor:o},{action:"extraction.proposal-imported",objectId:i.extractionId})}};function bf(t,e,r){return e.type!=="agent"?[]:t.reviewState.origin==="ai"&&t.extractionStatus==="proposed"&&If(t).every(i=>i.origin==="ai")?[]:[g({layer:"structural",code:"agent-proposal-origin-required",file:r,objectId:t.extractionId,rule:"Agent-created extraction must remain an AI proposal.",action:"Set origin to ai and extractionStatus to proposed."})]}function If(t){return[t.reviewState,t.methodology.methodologicalParadigm.reviewState,t.methodology.researchApproach.reviewState,t.methodology.analyticalTechnique.reviewState,t.methodology.sampleCharacteristics.reviewState,...t.constructMappings.map(e=>e.reviewState),...Object.values(t.fields).flatMap(e=>"items"in e&&Array.isArray(e.items)?e.items.map(r=>r.reviewState):[])]}function Qs(t){return g({layer:"structural",code:"paper-not-registered",file:"project.nodegraph.json",objectId:t,rule:"The extraction paper is not registered in this project.",action:"Choose a registered paper before importing the extraction."})}function Zs(t,e,r){return{accepted:!1,code:"invalid-extraction-proposal",targetDocument:`extraction:${t.paperId}`,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:r}}var ic=require("fs/promises");function tc(t,e){return t===G?{mode:"read-write",diagnostics:[]}:t===ge?{mode:"read-write",diagnostics:[Cf(e)]}:t===dt?{mode:"read-only",diagnostics:[jf(e)]}:{mode:"read-only",diagnostics:[Ef(t,e)]}}function Di(t,e,r){let i=Sf(t),n=Rf(r);return i&&i!==n?[Df(i,n,e)]:[]}function pt(t){return t===G?"project-v1.2.schema.json":t===ge?"project-v1.1.schema.json":"project.schema.json"}function Ri(t){return t===G||t===ge?"paper-index-v1.1.schema.json":"paper-index.schema.json"}function Sf(t){if(!t||typeof t!="object"||!("schema"in t))return;let e=t.schema;if(!(!e||typeof e!="object"||!("version"in e)))return typeof e.version=="string"?e.version:void 0}function Ef(t,e){let r=rc(t,G)>0;return g({layer:"syntactic",severity:"warning",code:r?"unsupported-newer-version":"unsupported-older-version",file:e,rule:`Persisted schema ${t} is not supported by this application.`,action:r?"Open the project with a newer application version.":"Keep the project read-only until an explicit migration is available."})}function jf(t){return g({layer:"syntactic",severity:"warning",code:"migration-required",file:t,rule:`Project schema ${dt} is preserved read-only.`,action:`Run the Phase 2 project migration to schema ${ge}, then upgrade to ${G}.`})}function Cf(t){return g({layer:"syntactic",severity:"warning",code:"phase3-migration-available",file:t,rule:`Project schema ${ge} remains writable for Phase 2 operations.`,action:"Run the researcher-confirmed Phase 3 migration before using claims, conflicts, appraisals, or the claim ledger."})}function Df(t,e,r){let i=rc(t,e)>0;return g({layer:"syntactic",severity:"warning",code:i?"unsupported-newer-version":"unsupported-older-version",file:r,rule:`Persisted schema ${t} is not supported for this document.`,action:i?"Open the document with a newer application version.":"Keep the document read-only until an explicit migration is available."})}function Rf(t){return t==="project-v1.2.schema.json"?G:t==="project-v1.1.schema.json"?ge:t==="project.schema.json"?dt:t==="paper-index-v1.1.schema.json"?Yt:t.endsWith("-v1.2.schema.json")?Se:t==="evidence-appraisals.schema.json"?Se:t==="claim-ledger-index.schema.json"?Se:ut}function rc(t,e){let r=t.split(".").map(Number),i=e.split(".").map(Number);for(let n=0;n<3;n++)if(r[n]!==i[n])return r[n]-i[n];return 0}async function Dt(t,e,r,i){let n;try{n=await(0,ic.readFile)(t,"utf8")}catch(s){return{diagnostics:[Mf(e,s)]}}let o=i.parseJson(n,e);if(!o.value)return{diagnostics:o.diagnostics};let a=[...i.validate(r,o.value,e),...Di(o.value,e,r)];return D(a)?{diagnostics:a}:{value:o.value,diagnostics:a}}function Mf(t,e){let r=ve(e,"ENOENT");return{layer:"syntactic",severity:"error",code:r?"missing-file":"inaccessible-file",file:t,rule:r?"The registered file does not exist.":"The registered file cannot be read.",action:r?"Restore the file or remove its registration.":"Check file permissions and retry."}}function ve(t,e){return typeof t=="object"&&t!==null&&"code"in t&&t.code===e}var Rt=require("fs/promises"),Ee=L(require("path")),ce=class extends Error{constructor(r,i){super(`${r}: ${i}`);this.code=r}},Mi=class{async canonicalRoot(e){return(0,Rt.realpath)(e)}async resolve(e,r,i=!1){lo(r);let n=await this.canonicalRoot(e),o=_f(n,r),a=await Af(o);return nc(n,a,r),i&&await(0,Rt.access)(a),a}async resolveFromFile(e,r,i,n=!1){lo(r),lo(i);let o=$f(r,i),a=await this.resolve(e,o,n);return{relativePath:o,target:a}}};function lo(t){if(!t)throw new ce("invalid-project-path",t);if(Ee.posix.isAbsolute(t)||Ee.win32.isAbsolute(t))throw new ce("absolute-path",t);if(t.includes("\\")||t.includes("\0"))throw new ce("invalid-project-path",t);if(t.split("/").some(kf))throw new ce("path-traversal",t)}function _f(t,e){let r=Ee.resolve(t,...e.split("/"));return nc(t,r,e),r}function $f(t,e){let r=Ee.posix.dirname(t);return r==="."?e:Ee.posix.join(r,e)}function kf(t){return t===""||t==="."||t===".."}async function Af(t){let e=await Tf(t),r=await(0,Rt.realpath)(e);return Ee.resolve(r,Ee.relative(e,t))}async function Tf(t){let e=t;for(;!await Of(e);)e=Ee.dirname(e);return e}async function Of(t){try{return await(0,Rt.lstat)(t),!0}catch{return!1}}function nc(t,e,r){if(!Nf(t,e))throw new ce("path-outside-project",r)}function Nf(t,e,r=Ee){let i=r.relative(t,e);return i!==".."&&!i.startsWith(`..${r.sep}`)&&!r.isAbsolute(i)}var _i=class{constructor(e,r,i,n,o,a,s,c=W){this.paths=e;this.schemas=r;this.writer=i;this.audit=n;this.papers=o;this.synthesis=a;this.integrity=s;this.clock=c}async rebuild(e,r,i=!1){let n=this.clock.now(),o=await this.loadInputs(e,r),a=[...o.diagnostics],s=await this.buildPaperEntries(e,r,o.paperIndex,o.evidence,o.taxonomy,o.methodologies,n,i,a),c=Xf(s,o.evidence,n);return a.push(...this.validateIndexes(r,c.paper,c.evidence)),await this.persistValidBuild(e,r,c,s,i,a),Qf(c,s,a)}async loadInputs(e,r){let i=await this.synthesis.readDocument(e,r.documents.paperIndex,"paper-index-v1.1.schema.json"),n=await this.synthesis.readEvidence(e,r),o=await this.synthesis.readTaxonomy(e,r),a=await this.synthesis.readMethodologies(e,r);return{...i.value?{paperIndex:i.value}:{},evidence:n.value?.evidence??[],...o.value?{taxonomy:o.value}:{},...a.value?{methodologies:a.value}:{},diagnostics:[...i.diagnostics.filter(s=>s.code!=="missing-file").map(Jf),...n.diagnostics,...o.diagnostics,...a.diagnostics]}}async buildPaperEntries(e,r,i,n,o,a,s,c,d){let u=new Map((i?.entries??[]).map(m=>[m.paperId,m])),l=qf(u,r),p={evidence:n,taxonomy:o,methodologies:a,now:s,full:c,build:l,diagnostics:d,auditPath:r.documents.auditLog,manifest:r};for(let m of r.papers)await this.addPaperEntry(e,m,u.get(m.paperId),p);return l}async addPaperEntry(e,r,i,n){if(!n.taxonomy||!n.methodologies)return;let o=await this.synthesis.readExtraction(e,r);if(n.diagnostics.push(...o.diagnostics),!o.value)return;let a=await this.synthesis.validateExtraction(e,n.manifest,r,o.value);if(n.diagnostics.push(...a),D(a))return;let s=S(o.value),c=await this.calculateGraphHash(e,r);if(n.diagnostics.push(...c.diagnostics),!c.value)return;let d=await this.inspectSourceIdentity(e,r,n);if(!n.full&&i&&Vf(i,r,c.value,d.currentHash,s,o.value,n.taxonomy.taxonomyVersion)){Hf(n.build,i);return}await this.rebuildPaperEntry(e,r,c.value,d.currentHash,d.diagnostics,o.value,s,n)}async inspectSourceIdentity(e,r,i){let n=await this.integrity.inspectSource(e,r);return i.diagnostics.push(...n.diagnostics),await this.recordSourceChange(e,r,n.currentHash,i.auditPath),n}async rebuildPaperEntry(e,r,i,n,o,a,s,c){let d=c.evidence.filter(p=>p.paperId===r.paperId),u=await this.integrity.inspectPaper(e,r,d,{graphHash:i,...n?{currentSourceHash:n}:{}});if(c.diagnostics.push(...u.diagnostics),!u.graph||D(u.diagnostics))return;let l=this.papers.buildIndexMetadata(r,u.graph,i,c.taxonomy.taxonomyVersion,c.now,a.extractorVersion);c.build.entries.push(Ff(l,r.extractionPath,a,s,c.taxonomy,c.methodologies,d,[...o,...u.diagnostics])),c.build.processed.push(r.paperId)}async persistValidBuild(e,r,i,n,o,a){D(a)||(await this.audit.assertAppendable(e,r.documents.auditLog),await this.writeIndexes(e,r,i.paper,i.evidence),await this.appendAudit(e,r,n,o))}async calculateGraphHash(e,r){try{return{value:await this.papers.calculateGraphHash(e,r.path),diagnostics:[]}}catch(i){return{diagnostics:[Yf(r,i)]}}}async recordSourceChange(e,r,i,n){!i||i===r.source.sourceDocumentHash||await this.audit.append(e,n,{actor:{type:"service",id:"IntegrityService",version:ao},action:"source.hash-changed",objectId:r.source.sourceId,beforeHash:r.source.sourceDocumentHash,afterHash:i,metadata:{paperId:r.paperId,sourcePath:r.source.relativePath}})}validateIndexes(e,r,i){return[...this.schemas.validate("paper-index-v1.1.schema.json",r,e.documents.paperIndex),...this.schemas.validate("evidence-index.schema.json",i,e.documents.evidenceIndex)]}async writeIndexes(e,r,i,n){let o=await this.paths.resolve(e,r.documents.paperIndex),a=await this.paths.resolve(e,r.documents.evidenceIndex);await this.writer.writeBatch([{target:o,value:i},{target:a,value:n}])}async appendAudit(e,r,i,n){await this.audit.append(e,r.documents.auditLog,{actor:{type:"service",id:"IndexBuilder",version:ao},action:"index.rebuilt",objectId:r.projectId,metadata:{full:n,processedPaperIds:i.processed,reusedPaperIds:i.reused,removedPaperIds:i.removed}})}};function qf(t,e){let r=new Set(e.papers.map(i=>i.paperId));return{entries:[],processed:[],reused:[],removed:[...t.keys()].filter(i=>!r.has(i))}}function Vf(t,e,r,i,n,o,a){return t.paperGraphHash===r&&t.paperPath===e.path&&i===e.source.sourceDocumentHash&&t.sourceDocumentHash===e.source.sourceDocumentHash&&t.extractionPath===e.extractionPath&&t.extractionRevision===n&&t.taxonomyVersion===a&&t.extractorVersion===o.extractorVersion}function Hf(t,e){t.entries.push(e),t.reused.push(e.paperId)}function Ff(t,e,r,i,n,o,a,s){let c=Lf(r);return{...t,extractionId:r.extractionId,extractionPath:e,extractionRevision:i,constructMappings:zf(r,n,c),findings:c,methodology:Uf(r,o),verificationSummary:Wf(r,a),staleness:{paperGraph:!1,extraction:!1,evidence:s.some(d=>d.code.startsWith("stale-")||d.code==="source-document-hash-mismatch")}}}function Lf(t){return(t.fields.findings.items??[]).map(e=>({findingId:e.findingId,...e.nodeId?{nodeId:e.nodeId}:{},sourceText:e.sourceText,constructMappingIds:[...e.constructMappingIds],evidenceIds:[...e.evidenceIds],reviewState:e.reviewState}))}function zf(t,e,r){return t.constructMappings.map(i=>{let n=i.constructId?Bf(e,i.constructId):void 0;return{mappingId:i.mappingId,sourceTerm:i.sourceTerm,...i.constructId?{constructId:i.constructId}:{},...i.mappingStatus==="approved"&&n?{constructId:n.constructId,constructName:n.canonicalName}:{},mappingStatus:i.mappingStatus,findingIds:r.filter(o=>o.constructMappingIds.includes(i.mappingId)).map(o=>o.findingId),evidenceIds:[...i.evidenceIds],reviewState:i.reviewState}})}function Bf(t,e){let r=t.constructs.find(n=>n.constructId===e);if(r?.status==="approved")return r;if(r?.status!=="deprecated"||!r.primaryConstructId)return;let i=t.constructs.find(n=>n.constructId===r.primaryConstructId);return i?.status==="approved"?i:void 0}function Uf(t,e){let r=t.methodology.methodologicalParadigm,i=r.mappingStatus==="approved"?e.paradigms.find(o=>o.paradigmId===r.paradigmId&&o.status==="approved"):void 0,n=t.methodology.sampleCharacteristics;return{...i?{paradigmId:i.paradigmId,paradigmLabel:i.label}:{},...r.sourceTerm?{paradigmSourceTerm:r.sourceTerm}:{},paradigmMappingStatus:r.mappingStatus,...oc("researchApproach",t.methodology.researchApproach),...oc("analyticalTechnique",t.methodology.analyticalTechnique),...Gf("population",t.fields.population),...n.unitOfAnalysis?{unitOfAnalysis:n.unitOfAnalysis}:{},...n.n!==void 0?{sampleSize:n.n}:{}}}function oc(t,e){let r=e.normalizedValue??e.sourceTerm;return r?{[t]:r}:{}}function Gf(t,e){let r=e.normalizedValue??e.sourceText;return r?{[t]:r}:{}}function Wf(t,e){let r=[...(t.fields.findings.items??[]).map(n=>n.reviewState),...t.constructMappings.map(n=>n.reviewState)],i=new Set([...t.fields.exactEvidenceQuotations.evidenceIds,...(t.fields.findings.items??[]).flatMap(n=>n.evidenceIds),...t.constructMappings.flatMap(n=>n.evidenceIds)]);return{pendingSource:e.filter(n=>i.has(n.evidenceId)&&n.reviewState.verification.source==="pending").length,pendingInterpretation:r.filter(n=>n.verification.interpretation==="pending").length,pendingClassification:r.filter(n=>n.verification.classification==="pending").length,disputedClassification:r.filter(n=>n.verification.classification==="disputed").length}}function Yf(t,e){let r=e instanceof ce?e.code:void 0,i=ve(e,"ENOENT");return g({layer:r?"structural":"integrity",code:r??(i?"missing-paper-file":"inaccessible-paper-file"),file:t.path,objectId:t.paperId,rule:r?"The paper path escapes the project root.":"The paper graph cannot be read.",action:r?"Use a contained project-relative path.":"Restore the paper graph before rebuilding indexes."})}function Jf(t){return{...t,layer:"integrity",severity:"warning",code:"invalid-derived-index",action:"Rebuild the derived index from authoritative project data."}}function Kf(t,e){return{schema:{name:"nodegraph-paper-index",version:Yt},generatedAt:e,entries:[...t].sort((r,i)=>r.paperId.localeCompare(i.paperId))}}function Xf(t,e,r){return{paper:Kf(t.entries,r),evidence:Zf(e,r)}}function Qf(t,e,r){return{paperIndex:t.paper,evidenceIndex:t.evidence,processedPaperIds:e.processed,reusedPaperIds:e.reused,removedPaperIds:e.removed,diagnostics:r}}function Zf(t,e){return{schema:{name:"nodegraph-evidence-index",version:ut},generatedAt:e,entries:t.map(r=>em(r,e)).sort((r,i)=>r.evidenceId.localeCompare(i.evidenceId))}}function em(t,e){return{evidenceId:t.evidenceId,paperId:t.paperId,...t.nodeId?{nodeId:t.nodeId}:{},evidenceObjectHash:t.evidenceObjectHash,quoteContentHash:t.quote.quoteContentHash,sourceDocumentHash:t.source.sourceDocumentHash,indexedAt:e}}var $i=require("fs/promises");var ki=class{constructor(e,r,i,n){this.paths=e;this.papers=r;this.synthesis=i;this.audit=n}async validate(e,r){let i=await this.synthesis.readBundle(e,r),n=await this.audit.inspect(e,r.documents.auditLog),o=[...i.diagnostics,...n.diagnostics];return i.bundle&&(o.push(...await this.validatePapers(e,r,i.bundle)),o.push(...await this.validateIndexes(e,r,i.bundle))),sc(o)}async inspectPaper(e,r,i=[],n={}){let o=[],a=n.graphHash??await this.readGraphHash(e,r,o),s=n.currentSourceHash??await this.readSourceHash(e,r,o),c=await this.readGraph(e,r,o);return c&&o.push(...rm(i,c,r)),{...c?{graph:c}:{},...a?{graphHash:a}:{},...s?{currentSourceHash:s}:{},diagnostics:o}}async inspectSource(e,r){let i=[],n=await this.readSourceHash(e,r,i);return{...n?{currentHash:n}:{},diagnostics:i}}async identifyProjectSource(e,r){let i=await this.paths.resolve(e,r,!0);return ac(r,await(0,$i.readFile)(i))}async identifyPaperSource(e,r,i){let n=await this.paths.resolveFromFile(e,r,i,!0);return ac(n.relativePath,await(0,$i.readFile)(n.target))}async validatePapers(e,r,i){let n=[],o=tm(i.evidence.evidence);for(let a of r.papers){let s=await this.synthesis.readExtraction(e,a);n.push(...s.diagnostics),s.value&&n.push(...await this.synthesis.validateExtraction(e,r,a,s.value));let c=await this.inspectPaper(e,a,o.get(a.paperId)??[]);n.push(...c.diagnostics),c.graph&&n.push(...am(c.graph,a,i))}return n}async validateIndexes(e,r,i){let n=await this.synthesis.readDocument(e,r.documents.paperIndex,Ri(r.schema.version)),o=await this.synthesis.readDocument(e,r.documents.evidenceIndex,"evidence-index.schema.json");return[...n.diagnostics.map(cc),...o.diagnostics.map(cc),...n.value?await sm(e,r,n.value,this.papers,this.synthesis):[],...o.value?dm(i.evidence.evidence,o.value,r):[]]}async readGraph(e,r,i){try{let n=await this.papers.read(e,r);return i.push(...n.diagnostics),n.graph}catch(n){i.push(po(n,r.path,r.paperId,"paper"));return}}async readGraphHash(e,r,i){try{return await this.papers.calculateGraphHash(e,r.path)}catch(n){i.push(po(n,r.path,r.paperId,"paper"));return}}async readSourceHash(e,r,i){try{let n=await this.paths.resolve(e,r.source.relativePath,!0),o=_r(await(0,$i.readFile)(n));return o!==r.source.sourceDocumentHash&&i.push(lm(r,o)),o}catch(n){i.push(po(n,r.source.relativePath,r.source.sourceId,"source"));return}}};function ac(t,e){return{relativePath:t,sourceDocumentHash:_r(e)}}function sc(t){return{valid:!D(t),diagnostics:t}}function tm(t){let e=new Map;for(let r of t){let i=e.get(r.paperId)??[];i.push(r),e.set(r.paperId,i)}return e}function rm(t,e,r){return t.flatMap(i=>[...im(i,r),...nm(i,r),...om(i,e,r)])}function im(t,e){let r=[];return Ei(t.quote.text)!==t.quote.quoteContentHash&&r.push(Xt("stale-quotation-hash",t,e)),Xs(t)!==t.evidenceObjectHash&&r.push(Xt("stale-evidence-object-hash",t,e)),r}function nm(t,e){let r=e.source;return t.source.sourceId===r.sourceId&&t.source.sourceDocumentHash===r.sourceDocumentHash&&t.source.relativePath===r.relativePath?[]:[Xt("evidence-source-mismatch",t,e)]}function om(t,e,r){if(!t.nodeId)return[];let i=e.nodes.find(n=>n.id===t.nodeId);return i?i.original?.text?Ei(i.original.text)===t.quote.quoteContentHash?[]:[Xt("stale-quotation-evidence",t,r)]:[Xt("missing-node-evidence",t,r)]:[Xt("broken-evidence-link",t,r)]}function am(t,e,r){let i=[...r.claims.claims.flatMap(o=>o.findingRefs),...r.conflicts.conflicts.flatMap(o=>o.findingRefs)].filter(o=>o.paperId===e.paperId),n=new Set(t.nodes.map(o=>o.id));return i.filter(o=>!n.has(o.findingId)).map(o=>g({layer:"integrity",code:"orphaned-finding-reference",file:e.path,objectId:o.findingId,rule:"A synthesis object references a finding node that does not exist.",action:"Restore the node or update the synthesis reference through review."}))}async function sm(t,e,r,i,n){let o=[],a=await n.readTaxonomy(t,e);o.push(...a.diagnostics);let s=new Map(e.papers.map(c=>[c.paperId,c]));for(let c of e.papers){let d=r.entries.find(u=>u.paperId===c.paperId);d?o.push(...await cm(t,c,d,i,n,e,a.value?.taxonomyVersion)):o.push(Qt(e.documents.paperIndex,c.paperId))}for(let c of r.entries)s.has(c.paperId)||o.push(Qt(e.documents.paperIndex,c.paperId));return o}async function cm(t,e,r,i,n,o,a){try{let s=await i.calculateGraphHash(t,e.path),c=await n.readExtraction(t,e),d=c.value?S(c.value):void 0;return r.paperGraphHash!==s||r.paperPath!==e.path||r.sourceDocumentHash!==e.source.sourceDocumentHash||r.extractionPath!==e.extractionPath||r.extractionRevision!==d||r.taxonomyVersion!==a?[Qt(o.documents.paperIndex,e.paperId)]:[]}catch{return[Qt(o.documents.paperIndex,e.paperId)]}}function dm(t,e,r){let i=new Map(t.map(o=>[o.evidenceId,o])),n=[];for(let o of t){let a=e.entries.find(s=>s.evidenceId===o.evidenceId);(!a||!um(o,a))&&n.push(Qt(r.documents.evidenceIndex,o.evidenceId))}for(let o of e.entries)i.has(o.evidenceId)||n.push(Qt(r.documents.evidenceIndex,o.evidenceId));return n}function um(t,e){return e.paperId===t.paperId&&e.nodeId===t.nodeId&&e.evidenceObjectHash===t.evidenceObjectHash&&e.quoteContentHash===t.quote.quoteContentHash&&e.sourceDocumentHash===t.source.sourceDocumentHash}function lm(t,e){return g({layer:"integrity",severity:"warning",code:"source-document-hash-mismatch",file:t.source.relativePath,objectId:t.source.sourceId,rule:`The current PDF hash ${e} does not match the registered source identity.`,action:"Restore the registered PDF or review and explicitly register the new source version."})}function Xt(t,e,r){return g({layer:"integrity",severity:t.startsWith("stale-")?"warning":"error",code:t,file:r.path,objectId:e.evidenceId,rule:`${e.evidenceId} no longer matches its authoritative source or paper node.`,action:"Preserve the record and review the source, quotation, and link before updating it."})}function po(t,e,r,i){let n=t instanceof ce?t.code:void 0,o=ve(t,"ENOENT");return g({layer:n?"structural":"integrity",code:n??(o?`missing-${i}-file`:`inaccessible-${i}-file`),file:e,objectId:r,rule:n?"The path escapes the project root.":`The registered ${i} file cannot be read.`,action:n?"Use a contained project-relative path.":`Restore the ${i} file or remove its registration.`})}function Qt(t,e){return g({layer:"integrity",severity:"warning",code:"stale-derived-index",file:t,objectId:e,rule:"The derived index entry does not match authoritative project data.",action:"Rebuild the index from the manifest, paper graphs, and evidence records."})}function cc(t){return{...t,layer:"integrity",severity:"warning",code:t.code==="missing-file"?"missing-derived-index":"invalid-derived-index",action:"Rebuild the derived index from authoritative project data."}}var pc=require("fs/promises");var de=class extends Error{constructor(r,i){super(`${r}: ${i}`);this.code=r;this.pointer=i}};function dc(t,e){let r=Zt(t);for(let i of e)r=pm(r,i);return r}function pm(t,e){if(e.path==="")return fm(t,e);let r=mm(e.path),i=vm(t,r,e.path),n=r[r.length-1];return e.op==="add"?ym(t,i,n,e):e.op==="remove"?wm(t,i,n,e.path):e.op==="replace"?xm(t,i,n,e):(Pm(i,n,e),t)}function fm(t,e){if(e.op==="remove")throw new de("root-remove-forbidden",e.path);if(e.op==="test"){if(!lc(t,e.value))throw new de("test-failed",e.path);return t}return Zt(e.value)}function mm(t){if(!t.startsWith("/"))throw new de("invalid-json-pointer",t);return t.slice(1).split("/").map(e=>gm(hm(e),t))}function hm(t){return t.replace(/~1/g,"/").replace(/~0/g,"~")}function gm(t,e){if(["__proto__","prototype","constructor"].includes(t))throw new de("unsafe-json-pointer",e);return t}function vm(t,e,r){let i=t;for(let n of e.slice(0,-1))i=uc(i,n,r);return i}function uc(t,e,r){if(Array.isArray(t))return t[Ai(e,t.length,r)];if(kr(t)&&fo(t,e))return t[e];throw new de("path-not-found",r)}function ym(t,e,r,i){if(Array.isArray(e))e.splice(Im(r,e.length,i.path),0,Zt(i.value));else if(kr(e))e[r]=Zt(i.value);else throw new de("invalid-patch-parent",i.path);return t}function wm(t,e,r,i){if(Array.isArray(e))e.splice(Ai(r,e.length,i),1);else if(kr(e)&&fo(e,r))delete e[r];else throw new de("path-not-found",i);return t}function xm(t,e,r,i){return bm(e,r,i.path),Array.isArray(e)?e[Ai(r,e.length,i.path)]=Zt(i.value):kr(e)&&(e[r]=Zt(i.value)),t}function Pm(t,e,r){let i=uc(t,e,r.path);if(!lc(i,r.value))throw new de("test-failed",r.path)}function bm(t,e,r){if(Array.isArray(t)){Ai(e,t.length,r);return}if(!kr(t)||!fo(t,e))throw new de("path-not-found",r)}function Im(t,e,r){if(t==="-")return e;let i=Number(t);if(!Number.isInteger(i)||i<0||i>e)throw new de("invalid-array-index",r);return i}function Ai(t,e,r){let i=Number(t);if(!Number.isInteger(i)||i<0||i>=e)throw new de("invalid-array-index",r);return i}function Zt(t){return t===void 0?void 0:JSON.parse(JSON.stringify(t))}function lc(t,e){return Mr(t)===Mr(e)}function kr(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)}function fo(t,e){return Object.prototype.hasOwnProperty.call(t,e)}var _e=class extends Error{constructor(r,i,n){super(`The authoritative write committed, but its audit event could not be appended: ${r}`);this.targetDocument=r;this.resultingRevision=i;this.cause=n;this.code="audit-append-failed"}},Ti=class{constructor(e,r,i,n,o){this.paths=e;this.schemas=r;this.writer=i;this.audit=n;this.reviews=o;this.recoveryRequired=new Set}async apply(e,r,i){let n=await this.paths.canonicalRoot(e);if(this.recoveryRequired.has(n))return Rm(r);let o=this.schemas.validate("mutation-envelope.schema.json",r,"mutation-envelope");return D(o)?er(r,o):this.applyValidated(e,n,r,i)}async requiresRecovery(e){let r=await this.paths.canonicalRoot(e);return this.recoveryRequired.has(r)}async applyValidated(e,r,i,n){let o=await this.paths.resolve(e,i.targetDocument),a=await fc(o,i.targetDocument,this.schemas,n.currentSchemaName??n.schemaName);if(a.diagnostics.length)return er(i,a.diagnostics);let s=a.value===void 0?"absent":S(a.value);return s==="absent"&&i.baseRevision==="absent"&&!n.allowCreate?Dm(i):i.baseRevision!==s?this.rejectStale(e,i,n.auditPath,s):this.commitCandidate(e,o,a.value,s,r,i,n)}async commitCandidate(e,r,i,n,o,a,s){let c=Em(i,a);if(c instanceof de)return Cm(a,c);let d=await this.validateCandidate(i,c,a,s);if(D(d))return er(a,d);await this.audit.assertAppendable(e,s.auditPath,s.allowCreate??!1);let u=await this.writeCandidate(e,r,c,n,a,s);if(u)return u;let l=S(c);return await this.appendCommitAudit(e,o,a,s,l),{accepted:!0,targetDocument:a.targetDocument,resultingRevision:l}}async writeCandidate(e,r,i,n,o,a){try{await this.writer.write(r,i,async()=>{let s=await Sm(r,o.targetDocument,this.schemas,a.currentSchemaName??a.schemaName);if(s!==n)throw new Oi(s)});return}catch(s){if(s instanceof Ni)return er(o,s.diagnostics);if(!(s instanceof Oi))throw s;return this.rejectStale(e,o,a.auditPath,s.currentRevision)}}async validateCandidate(e,r,i,n){let o=this.schemas.validate(n.schemaName,r,i.targetDocument);if(D(o))return o;if(e===void 0&&n.allowCreate)return await n.validateCandidate?.(r)??o;let a=this.reviews.validateApprovalAuthority(e,r,i.actor,i.targetDocument);if(D(a))return a;let s=await n.validateCandidate?.(r)??[];return[...o,...a,...s]}async rejectStale(e,r,i,n){return await this.audit.append(e,i,{actor:{type:"service",id:"SynthesisRepository",version:Ct},action:"mutation.rejected-stale",objectId:r.mutationId,baseRevision:r.baseRevision,metadata:{targetDocument:r.targetDocument,currentRevision:n}}),jm(r,n)}async appendCommitAudit(e,r,i,n,o){try{await this.audit.append(e,n.auditPath,{actor:i.actor,action:n.auditAction,objectId:n.auditObjectId,baseRevision:i.baseRevision,resultingRevision:o,metadata:{...n.auditMetadata,mutationId:i.mutationId,targetDocument:i.targetDocument}},n.allowCreate??!1)}catch(a){throw this.recoveryRequired.add(r),new _e(i.targetDocument,o,a)}}},Oi=class extends Error{constructor(r){super("revision-changed-before-replace");this.currentRevision=r}};async function fc(t,e,r,i){let n;try{n=await(0,pc.readFile)(t,"utf8")}catch(a){return ve(a,"ENOENT")?{diagnostics:[]}:{diagnostics:[Mm(e)]}}let o=r.parseJson(n,e);return o.value?{value:o.value,diagnostics:[...r.validate(i,o.value,e),...Di(o.value,e,i)]}:{diagnostics:o.diagnostics}}async function Sm(t,e,r,i){let n=await fc(t,e,r,i);if(n.diagnostics.length)throw new Ni(n.diagnostics);return n.value===void 0?"absent":S(n.value)}var Ni=class extends Error{constructor(r){super("current-document-invalid-before-replace");this.diagnostics=r}};function Em(t,e){try{return dc(t,e.operations)}catch(r){if(r instanceof de)return r;throw r}}function er(t,e){return{accepted:!1,code:"invalid-mutation",targetDocument:t.targetDocument,currentRevision:t.baseRevision,receivedBaseRevision:t.baseRevision,retryable:!1,rejectedOperations:t.operations,diagnostics:e}}function jm(t,e){return{accepted:!1,code:"stale-revision",targetDocument:t.targetDocument,currentRevision:e,receivedBaseRevision:t.baseRevision,retryable:!0,rejectedOperations:t.operations}}function Cm(t,e){return er(t,[g({layer:"structural",code:e.code,file:t.targetDocument,jsonPath:e.pointer,rule:"The mutation operation cannot be applied to the current document.",action:"Refresh the document and correct the rejected operation."})])}function Dm(t){return er(t,[g({layer:"structural",code:"authoritative-creation-not-allowed",file:t.targetDocument,rule:"Only project initialization may create an authoritative document from an absent revision.",action:"Create the project through ProjectRegistry before applying document mutations."})])}function Rm(t){return{accepted:!1,code:"audit-recovery-required",targetDocument:t.targetDocument,currentRevision:t.baseRevision,receivedBaseRevision:t.baseRevision,retryable:!1,rejectedOperations:t.operations}}function Mm(t){return g({layer:"syntactic",code:"inaccessible-file",file:t,rule:"The current authoritative document cannot be read.",action:"Restore read access before retrying the mutation."})}var hc=["paperId","paperTitle","publicationYear","constructId","constructName","cellState","extractionId","extractionRevision","mappingIds","sourceTerms","findingIds","nodeIds","evidenceIds","methodologicalParadigm","researchApproach","analyticalTechnique","population","unitOfAnalysis","sourceVerification","interpretationVerification","classificationVerification","stale"],qi=class{export(e,r){let i=new Map(e.entries.map(o=>[o.paperId,o])),n=r.cells.map(o=>_m(o,i.get(o.paperId),r));return[mc(Object.fromEntries(hc.map(o=>[o,o]))),...n.map(mc)].join(`\r
`)+`\r
`}};function _m(t,e,r){let i=r.papers.find(a=>a.paperId===t.paperId),n=r.constructs.find(a=>a.constructId===t.constructId),o=e?.findings?.filter(a=>t.findingIds.includes(a.findingId))??[];return{paperId:t.paperId,paperTitle:i?.title??e?.title??"",publicationYear:String(i?.publicationYear??""),constructId:t.constructId,constructName:n?.canonicalName??"",cellState:t.state,extractionId:e?.extractionId??"",extractionRevision:e?.extractionRevision??"",mappingIds:t.mappingIds.join(" | "),sourceTerms:t.sourceTerms.join(" | "),findingIds:t.findingIds.join(" | "),nodeIds:o.flatMap(a=>a.nodeId??[]).join(" | "),evidenceIds:t.evidenceIds.join(" | "),methodologicalParadigm:i?.methodology.paradigmLabel??i?.methodology.paradigmSourceTerm??"",researchApproach:i?.methodology.researchApproach??"",analyticalTechnique:i?.methodology.analyticalTechnique??"",population:i?.methodology.population??"",unitOfAnalysis:i?.methodology.unitOfAnalysis??"",sourceVerification:mo(t.verification.source).join(" | "),interpretationVerification:mo(t.verification.interpretation).join(" | "),classificationVerification:mo(t.verification.classification).join(" | "),stale:String(!!(i?.staleness&&Object.values(i.staleness).some(Boolean)))}}function mc(t){return hc.map(e=>$m(t[e])).join(",")}function $m(t){return`"${km(t).replace(/"/g,'""')}"`}function km(t){return/^[=+\-@]/.test(t)?`'${t}`:t}function mo(t){return[...new Set(t)]}var go=require("fs/promises");var Vi=class{constructor(e,r){this.paths=e;this.schemas=r;this.hydratedPaperIds=[]}async read(e,r){let i=await this.paths.resolve(e,r.path,!0);this.hydratedPaperIds.push(r.paperId);let n=await(0,go.readFile)(i,"utf8"),o=this.schemas.parseJson(n,r.path);if(!o.value)return{diagnostics:o.diagnostics};let a=this.validateGraph(o.value,r);return D(a)?{diagnostics:a}:{graph:o.value,diagnostics:a}}async calculateGraphHash(e,r){let i=await this.paths.resolve(e,r,!0);return _r(await(0,go.readFile)(i))}resolveNode(e,r){return e.nodes.find(i=>i.id===r)}buildIndexMetadata(e,r,i,n,o,a){return{paperId:e.paperId,paperPath:e.path,paperGraphHash:i,sourceDocumentHash:e.source.sourceDocumentHash,title:Dr(r.title),authors:qm(r),...Vm(r),tags:Fm(r),taxonomyVersion:n,extractorVersion:a,indexedAt:o}}instrumentation(){return{count:this.hydratedPaperIds.length,paperIds:[...this.hydratedPaperIds]}}resetInstrumentation(){this.hydratedPaperIds=[]}validateGraph(e,r){let i=this.schemas.validate("nodegraph.schema.json",e,r.path);return D(i)?i:Am(e,r)}};function Am(t,e){let r=[],i=Tm(t.nodes.map(n=>n.id),e,r);return Om(t,e,r),Nm(t,i,e,r),r}function Tm(t,e,r){let i=new Set;for(let n of t)i.has(n)&&r.push(Lm(e,n)),i.add(n);return i}function Om(t,e,r){let i=new Set;for(let n of t.edges)i.has(n.id)&&r.push(zm(e,n.id)),i.add(n.id)}function Nm(t,e,r,i){for(let n of t.nodes)for(let o of n.children)e.has(o)||i.push(ho(r,o));for(let n of t.edges)e.has(n.source)||i.push(ho(r,n.source)),e.has(n.target)||i.push(ho(r,n.target))}function qm(t){return t.source?.authors?Rr([t.source.authors]):[]}function Vm(t){let e=Hm(t.source?.venue),r=t.source?.doi?Dr(t.source.doi):void 0;return{...e?{publicationYear:e}:{},...r?{doi:r}:{}}}function Hm(t){let e=t?.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);return e?Number(e[1]):void 0}function Fm(t){return Array.isArray(t.tags)?Rr(t.tags.filter(e=>typeof e=="string")):[]}function Lm(t,e){return vo(t,"duplicate-node-id",e,"Make every node ID unique.")}function zm(t,e){return vo(t,"duplicate-edge-id",e,"Make every edge ID unique.")}function ho(t,e){return vo(t,"missing-node-reference",e,"Restore the node or remove the broken reference.")}function vo(t,e,r,i){return g({layer:"structural",code:e,file:t.path,objectId:r,rule:`${r} violates paper graph reference rules.`,action:i})}var mt=require("fs/promises"),Tr=L(require("path")),Gi=require("crypto");function Fi(t,e){let r="not-extracted";return{schema:{name:"nodegraph-extraction",version:Fs},extractionId:`extraction_${t.slice(6)}`,paperId:t,extractorVersion:Ct,extractionStatus:"not-started",fields:{researchProblem:{reportingStatus:r},purpose:{reportingStatus:r},researchQuestionsOrHypotheses:{reportingStatus:r},theoreticalFramework:{reportingStatus:r},keyConstructs:{reportingStatus:r},population:{reportingStatus:r},setting:{reportingStatus:r},sampleSize:{reportingStatus:r},methodology:{reportingStatus:r},dataCollection:{reportingStatus:r},analysisMethod:{reportingStatus:r},findings:{reportingStatus:r},mechanisms:{reportingStatus:r},moderators:{reportingStatus:r},limitations:{reportingStatus:r},boundaryConditions:{reportingStatus:r},recommendations:{reportingStatus:r},exactEvidenceQuotations:{reportingStatus:r,evidenceIds:[]}},methodology:{methodologicalParadigm:{reportingStatus:r,mappingStatus:"unmapped",reviewState:He("imported")},researchApproach:{reportingStatus:r,reviewState:He("imported")},analyticalTechnique:{reportingStatus:r,reviewState:He("imported")},sampleCharacteristics:{reportingStatus:r,reviewState:He("imported")}},constructMappings:[],reviewState:He("imported"),created:e,modified:e}}function Li(t){return{schema:{name:"nodegraph-methodology-registry",version:Ls},registryVersion:1,paradigms:[Hi("positivist","Positivist"),Hi("interpretive","Interpretive"),Hi("critical","Critical"),Hi("pragmatist","Pragmatist")],modified:t}}function He(t="human"){return{verification:{source:"pending",interpretation:"pending",classification:"pending"},approval:{researcher:"not-reviewed",advisor:"not-reviewed"},origin:t}}function Hi(t,e){return{paradigmId:t,label:e,aliases:[],status:"approved",reviewState:{verification:{source:"not-applicable",interpretation:"not-applicable",classification:"verified"},approval:{researcher:"approved",advisor:"not-reviewed"},origin:"imported"}}}var ie="project.nodegraph.json",Bm="papers",Ui=class{constructor(e,r,i,n,o=W){this.paths=e;this.schemas=r;this.writer=i;this.mutations=n;this.clock=o}async create(e,r,i){await(0,mt.mkdir)(e,{recursive:!0});let n=Tr.join(e,ie);await sh(n);let o=Um(r,i,this.clock.now()),a=this.schemas.validate(pt(o.schema.version),o,ie);return D(a)?{mode:"read-only",diagnostics:a,hydrationCount:0}:(await this.writeInitialProject(e,o),this.open(n))}async open(e){let r=Tr.dirname(e),i=await ch(e),n=await Dt(e,ie,i,this.schemas);if(!n.value)return{mode:"read-only",diagnostics:n.diagnostics,hydrationCount:0};let o=n.value,a=tc(o.schema.version,ie),s=[...n.diagnostics,...wc(o),...await this.inspectRegistrations(r,o)],c=await this.loadIndexes(r,o);return s.push(...c.diagnostics),{mode:a.mode==="read-only"||D(s)?"read-only":"read-write",manifest:o,manifestRevision:S(o),...c.paperIndex?{paperIndex:c.paperIndex}:{},...c.evidenceIndex?{evidenceIndex:c.evidenceIndex}:{},diagnostics:s,hydrationCount:0}}async registerPaper(e,r,i,n,o){let a=await this.validateNewRegistration(e,r,i);if(D(a))return oh(i,n,a);let s=ih(r,i,n,o,this.clock.now()),c=!1;try{c=await this.createRegistrationExtraction(e,r,i);let d=await this.mutations.apply(e,s,{schemaName:pt(r.schema.version),auditPath:r.documents.auditLog,auditAction:"paper.registered",auditObjectId:i.paperId});return!d.accepted&&c&&await this.removeRegistrationExtraction(e,i),d}catch(d){throw c&&!(d instanceof _e)&&await this.removeRegistrationExtraction(e,i),d}}async unregisterPaper(e,r,i,n,o){let a=r.papers.findIndex(c=>c.paperId===i);if(a<0)return ah(i,n);let s=nh(r,a,i,n,o,this.clock.now());return this.mutations.apply(e,s,{schemaName:pt(r.schema.version),auditPath:r.documents.auditLog,auditAction:"paper.unregistered",auditObjectId:i})}async resolveDocument(e,r,i=!1){return this.paths.resolve(e,r,i)}async writeInitialProject(e,r){let i=Ym(r,this.clock.now()),n=Gm(r,i);await this.assertTargetsAbsent(e,n);let o=new Set;try{await(0,mt.mkdir)(Tr.join(e,Bm),{recursive:!0});for(let a of i)a.authoritative&&o.add(r.documents.auditLog),await this.writeTrackedInitialDocument(e,r,a,o);o.add(r.documents.auditLog),await this.writeTrackedAuthoritativeDocument(e,r,Wm(r),"project.created",r.projectId,o)}catch(a){throw await this.removeInitialFiles(e,[...o]),a}}async writeTrackedInitialDocument(e,r,i,n){try{await this.writeInitialDocument(e,r,i),n.add(i.path)}catch(o){throw o instanceof _e&&n.add(i.path),o}}async writeTrackedAuthoritativeDocument(e,r,i,n,o,a){try{await this.writeAuthoritativeDocument(e,r,i,n,o),a.add(i.path)}catch(s){throw s instanceof _e&&a.add(i.path),s}}async writeInitialDocument(e,r,i){let n=this.schemas.validate(i.schema,i.value,i.path);if(D(n))throw new Error(`Invalid initial document: ${i.path}`);if(i.authoritative){await this.writeAuthoritativeDocument(e,r,i,"project.document-created",i.path);return}await this.writer.write(await this.paths.resolve(e,i.path),i.value)}async writeAuthoritativeDocument(e,r,i,n,o){let a=await this.mutations.apply(e,Jm(i,this.clock.now()),{schemaName:i.schema,auditPath:r.documents.auditLog,auditAction:n,auditObjectId:o,allowCreate:!0});if(!a.accepted)throw new Error(`Failed to create ${i.path}: ${a.code}`)}async assertTargetsAbsent(e,r){for(let i of r){let n=await this.paths.resolve(e,i);await wo(n)}}async removeInitialFiles(e,r){for(let i of[...r].reverse()){let n=await this.paths.resolve(e,i);await this.writer.remove(n)}}async inspectRegistrations(e,r){let i=[...yc(r),...xc(r)];for(let n of r.papers)i.push(...await this.inspectRegistrationFiles(e,n));return i}async inspectRegistrationFiles(e,r,i=!0){return[...await yo(this.paths,e,r.path,r.paperId,"paper"),...await yo(this.paths,e,r.source.relativePath,r.source.sourceId,"source"),...i&&r.extractionPath?await yo(this.paths,e,r.extractionPath,r.paperId,"extraction"):[]]}async loadIndexes(e,r){let i=await this.loadOptionalIndex(e,r.documents.paperIndex,Ri(r.schema.version)),n=await this.loadOptionalIndex(e,r.documents.evidenceIndex,"evidence-index.schema.json");return{...i.value?{paperIndex:i.value}:{},...n.value?{evidenceIndex:n.value}:{},diagnostics:[...i.diagnostics,...n.diagnostics]}}async loadOptionalIndex(e,r,i){let n=await this.paths.resolve(e,r),o=await Dt(n,r,i,this.schemas);return o.value?o:o.diagnostics.some(a=>a.code==="missing-file")?{diagnostics:[th(r)]}:{diagnostics:o.diagnostics.map(rh)}}async validateNewRegistration(e,r,i){let n={...r,papers:[...r.papers,i]},o=this.schemas.validate(pt(r.schema.version),n,ie);return o.push(...wc(n)),o.push(...yc(n)),o.push(...xc(n)),o.push(...await this.inspectRegistrationFiles(e,i,!1)),o}async createRegistrationExtraction(e,r,i){if(!i.extractionPath)return!1;let n=await this.paths.resolve(e,i.extractionPath);await wo(n);let o=Fi(i.paperId,this.clock.now());return await this.writeAuthoritativeDocument(e,r,ft(i.extractionPath,"extraction.schema.json",o),"extraction.initialized",o.extractionId),!0}async removeRegistrationExtraction(e,r){await this.writer.remove(await this.paths.resolve(e,r.extractionPath))}};function Um(t,e,r){return{schema:{name:"nodegraph-project",version:ge},projectId:t,title:e,created:r,modified:r,papers:[],documents:{claims:"synthesis/claims.json",conflicts:"synthesis/conflicts.json",gaps:"synthesis/gaps.json",researchQuestions:"synthesis/research-questions.json",constructs:"taxonomy/constructs.json",methodologies:"taxonomy/methodologies.json",evidence:"evidence/records.json",paperIndex:"indexes/papers.index.json",evidenceIndex:"indexes/evidence.index.json",auditLog:"audit/events.jsonl"}}}function Gm(t,e){return[...e.map(r=>r.path),t.documents.auditLog,ie]}function Wm(t){return{path:ie,schema:pt(t.schema.version),value:t,authoritative:!0}}function Ym(t,e){return[ft(t.documents.claims,"synthesis-claims.schema.json",Ar("nodegraph-synthesis-claims","claims",e)),ft(t.documents.conflicts,"conflicts.schema.json",Ar("nodegraph-conflicts","conflicts",e)),ft(t.documents.gaps,"gaps.schema.json",Ar("nodegraph-gaps","gaps",e)),ft(t.documents.researchQuestions,"research-questions.schema.json",Ar("nodegraph-research-questions","researchQuestions",e)),ft(t.documents.constructs,"construct-taxonomy.schema.json",Km(e)),ft(t.documents.methodologies,"methodology-registry.schema.json",Li(e)),ft(t.documents.evidence,"evidence-records.schema.json",Ar("nodegraph-evidence-records","evidence",e)),gc(t.documents.paperIndex,"paper-index-v1.1.schema.json",vc("nodegraph-paper-index",Yt,e)),gc(t.documents.evidenceIndex,"evidence-index.schema.json",vc("nodegraph-evidence-index",ut,e))]}function ft(t,e,r){return{path:t,schema:e,value:r,authoritative:!0}}function gc(t,e,r){return{path:t,schema:e,value:r,authoritative:!1}}function Jm(t,e){return{mutationId:`mutation_${(0,Gi.randomUUID)().replace(/-/g,"")}`,targetDocument:t.path,baseRevision:"absent",operations:[{op:"add",path:"",value:t.value}],requestedAt:e,actor:{type:"service",id:"ProjectRegistry",version:Ct}}}function Ar(t,e,r){return{schema:{name:t,version:ut},[e]:[],modified:r}}function Km(t){return{schema:{name:"nodegraph-construct-taxonomy",version:ut},taxonomyVersion:1,constructs:[],modified:t}}function vc(t,e,r){return{schema:{name:t,version:e},generatedAt:r,entries:[]}}function yc(t){return[...tr(t.papers.map(e=>e.paperId)).map(e=>zi("duplicate-paper-id",e)),...tr(t.papers.map(e=>e.path)).map(e=>zi("duplicate-paper-path",e)),...tr(t.papers.map(e=>e.source.sourceId)).map(e=>zi("duplicate-source-id",e)),...tr(t.papers.flatMap(e=>e.extractionPath??[])).map(e=>zi("duplicate-extraction-path",e))]}function wc(t){let e=Object.values(t.documents).filter(r=>typeof r=="string");return[...tr(e).map(Qm),...e.filter(r=>r===ie).map(Zm)]}function xc(t){let e=new Set([ie,...Object.values(t.documents).filter(r=>typeof r=="string")]);return[...Xm(t),...t.papers.flatMap(r=>[...e.has(r.path)?[Bi(r.path,r.paperId)]:[],...e.has(r.source.relativePath)?[Bi(r.source.relativePath,r.source.sourceId)]:[],...r.extractionPath&&e.has(r.extractionPath)?[Bi(r.extractionPath,r.paperId)]:[]])]}function Xm(t){let e=t.papers.flatMap(r=>[r.path,r.source.relativePath,...r.extractionPath?[r.extractionPath]:[]]);return tr(e).map(r=>Bi(r,r))}function tr(t){let e=new Set,r=new Set;for(let i of t)e.has(i)&&r.add(i),e.add(i);return[...r]}function Qm(t){return Pc("duplicate-project-document-path",t,"Give every manifest-owned document a distinct path.")}function Zm(t){return Pc("reserved-project-document-path",t,"Use a subordinate path that is different from project.nodegraph.json.")}function Bi(t,e){return g({layer:"structural",code:"registration-path-collision",file:ie,objectId:e,rule:`${t} is already owned by the project manifest.`,action:"Choose a distinct contained path for the paper graph, source PDF, or extraction."})}function Pc(t,e,r){return g({layer:"structural",code:t,file:ie,objectId:e,rule:`${e} cannot safely identify the requested project document.`,action:r})}function zi(t,e){return g({layer:"structural",code:t,file:ie,objectId:e,rule:`${e} is registered more than once.`,action:"Keep one registration with a unique identifier and path."})}async function yo(t,e,r,i,n){try{let o=await t.resolve(e,r,!0);return await(0,mt.access)(o),[]}catch(o){return[eh(r,i,n,o)]}}function eh(t,e,r,i){let n=i instanceof ce?i.code:void 0,o=ve(i,"ENOENT");return g({layer:n?"structural":"integrity",code:n??(o?`missing-${r}-file`:`inaccessible-${r}-file`),file:t,objectId:e,rule:n?"The registered path escapes the project root.":`The registered ${r} file cannot be read.`,action:n?"Use a contained project-relative path.":`Restore the ${r} file or remove its registration.`})}function th(t){return g({layer:"integrity",severity:"warning",code:"missing-derived-index",file:t,rule:"The derived index is missing.",action:"Rebuild project indexes; authoritative data is unaffected."})}function rh(t){return{...t,layer:"integrity",severity:"warning",code:"invalid-derived-index",action:"Rebuild the derived index from authoritative project data."}}function ih(t,e,r,i,n){return{mutationId:`mutation_${(0,Gi.randomUUID)().replace(/-/g,"")}`,targetDocument:ie,baseRevision:r,operations:[{op:"add",path:"/papers/-",value:e},{op:"replace",path:"/modified",value:n}],requestedAt:n,actor:i}}function nh(t,e,r,i,n,o){return{mutationId:`mutation_${(0,Gi.randomUUID)().replace(/-/g,"")}`,targetDocument:ie,baseRevision:i,operations:[{op:"test",path:`/papers/${e}/paperId`,value:r},{op:"remove",path:`/papers/${e}`},{op:"replace",path:"/modified",value:o}],requestedAt:o,actor:n}}function oh(t,e,r){return{accepted:!1,code:"invalid-registration",targetDocument:ie,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[{op:"add",path:"/papers/-",value:t}],diagnostics:r}}function ah(t,e){return{accepted:!1,code:"paper-not-registered",targetDocument:ie,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:[g({layer:"structural",code:"paper-not-registered",file:ie,objectId:t,rule:"The requested paper is not registered.",action:"Refresh the manifest and choose a registered paper."})]}}async function sh(t){return wo(t)}async function ch(t){try{let e=JSON.parse(await(0,mt.readFile)(t,"utf8")),r=typeof e.schema?.version=="string"?e.schema.version:G;return r===G?"project-v1.2.schema.json":r===ge?"project-v1.1.schema.json":e.documents?.appraisals!==void 0?"project-v1.2.schema.json":e.documents?.methodologies!==void 0||e.papers?.some(n=>n.extractionPath!==void 0)?"project-v1.1.schema.json":pt(r)}catch{return pt(G)}}async function wo(t){try{throw await(0,mt.access)(t),new Error(`Project file already exists: ${t}`)}catch(e){if(!ve(e,"ENOENT"))throw e}}var Yi=class{constructor(e,r,i){this.papers=e;this.synthesis=r;this.constructs=i}search(e,r){return e.entries.filter(i=>dh(i,r)).map(i=>({paperId:i.paperId,paperPath:i.paperPath,title:i.title,authors:i.authors,...i.publicationYear?{publicationYear:i.publicationYear}:{},...i.doi?{doi:i.doi}:{},tags:i.tags}))}async hydratePaper(e,r,i){let n=fh(r,i);return this.papers.read(e,n)}matrix(e,r,i={}){let n=e.entries.filter(a=>mh(a)).filter(a=>hh(a,i)),o=vh(n,r,i);return{papers:n.map(yh),constructs:o,cells:n.flatMap(a=>o.map(s=>wh(a,s.constructId))),filters:i}}async hydrateMatrixCell(e,r,i,n){let o=r.papers.find(f=>f.paperId===i);if(!o?.extractionPath)return;let[a,s,c,d]=await Promise.all([this.synthesis.readExtraction(e,o),this.synthesis.readEvidence(e,r),this.synthesis.readTaxonomy(e,r),this.synthesis.readMethodologies(e,r)]);if(!a.value||!s.value||!c.value||!d.value)return;let u=a.value.constructMappings.filter(f=>n===rr?f.mappingStatus!=="approved":f.mappingStatus==="approved"&&Ph(c.value,f.constructId,this.constructs)===n),l=new Set(u.map(f=>f.mappingId)),p=(a.value.fields.findings.items??[]).filter(f=>f.constructMappingIds.some(v=>l.has(v))),m=new Set([...u.flatMap(f=>f.evidenceIds),...p.flatMap(f=>f.evidenceIds)]),h=n===rr?bc:c.value.constructs.find(f=>f.constructId===n)?.canonicalName??n;return{paperId:i,paperPath:o.path,constructId:n,constructName:h,extractionId:a.value.extractionId,extractionRevision:S(a.value),methodology:bh(a.value,d.value),mappings:u,findings:p,evidence:s.value.evidence.filter(f=>m.has(f.evidenceId)),diagnostics:[...a.diagnostics,...s.diagnostics,...c.diagnostics,...d.diagnostics]}}locateMatrixCell(e,r,i){let n=e.entries.find(s=>s.paperPath===r),o=n?.findings?.find(s=>s.nodeId===i);if(!n||!o)return;let a=n.constructMappings?.find(s=>o.constructMappingIds.includes(s.mappingId));return a?{paperId:n.paperId,constructId:a.mappingStatus==="approved"&&a.constructId?a.constructId:rr}:void 0}},rr="__pending__",bc="Pending / unmapped";function dh(t,e){return Ic(t,e.text)&&Sc(t,e.publicationYear)&&lh(t.doi,e.doi)&&ph(t.tags,e.tag)}function Ic(t,e){if(!e?.trim())return!0;let r=se(e);return uh(t).some(i=>se(i).includes(r))}function uh(t){return[t.paperId,t.title,...t.authors,...t.publicationYear?[String(t.publicationYear)]:[],...t.doi?[t.doi]:[],...t.tags]}function Sc(t,e){return e===void 0||t.publicationYear===e}function lh(t,e){return e===void 0||t!==void 0&&se(t)===se(e)}function ph(t,e){return e===void 0||t.some(r=>se(r)===se(e))}function fh(t,e){let r=t.papers.find(i=>i.paperId===e);if(!r)throw new Error(`paper-not-registered: ${e}`);return r}function mh(t){return!!(t.extractionId&&t.extractionPath&&t.extractionRevision&&t.constructMappings&&t.findings&&t.methodology&&t.verificationSummary&&t.staleness)}function hh(t,e){return Ic(t,e.paper)&&Sc(t,e.publicationYear)&&Wi(t.methodology?.paradigmLabel,e.paradigm)&&Wi(t.methodology?.researchApproach,e.approach)&&Wi(t.methodology?.analyticalTechnique,e.technique)&&Wi(t.methodology?.population,e.population)&&gh(t,e.verification)}function Wi(t,e){return e?!!(t&&se(t).includes(se(e))):!0}function gh(t,e){return e?e==="pending-source"?(t.verificationSummary?.pendingSource??0)>0:e==="pending-interpretation"?(t.verificationSummary?.pendingInterpretation??0)>0:e==="pending-classification"?(t.verificationSummary?.pendingClassification??0)>0:e==="disputed-classification"?(t.verificationSummary?.disputedClassification??0)>0:!0:!0}function vh(t,e,r){let i=e.constructs.filter(o=>o.status==="approved").filter(o=>!r.constructId||o.constructId===r.constructId).map(o=>({constructId:o.constructId,canonicalName:o.canonicalName})).sort((o,a)=>o.canonicalName.localeCompare(a.canonicalName));return t.some(o=>o.constructMappings?.some(a=>a.mappingStatus!=="approved"))&&(!r.constructId||r.constructId===rr)?[...i,{constructId:rr,canonicalName:bc}]:i}function yh(t){return{paperId:t.paperId,title:t.title,...t.publicationYear?{publicationYear:t.publicationYear}:{},methodology:t.methodology,verificationSummary:t.verificationSummary,staleness:t.staleness}}function wh(t,e){let r=(t.constructMappings??[]).filter(o=>e===rr?o.mappingStatus!=="approved":o.mappingStatus==="approved"&&o.constructId===e),i=new Set(r.map(o=>o.mappingId)),n=(t.findings??[]).filter(o=>o.constructMappingIds.some(a=>i.has(a)));return{paperId:t.paperId,constructId:e,state:xh(t,r,n),mappingIds:[...i],sourceTerms:r.map(o=>o.sourceTerm),findingIds:n.map(o=>o.findingId),evidenceIds:[...new Set([...r.flatMap(o=>o.evidenceIds),...n.flatMap(o=>o.evidenceIds)])],verification:{source:n.map(o=>o.reviewState.verification.source),interpretation:n.map(o=>o.reviewState.verification.interpretation),classification:[...r.map(o=>o.reviewState.verification.classification),...n.map(o=>o.reviewState.verification.classification)]}}}function xh(t,e,r){return t.staleness&&Object.values(t.staleness).some(Boolean)?"stale":e.length?e.some(i=>i.mappingStatus==="pending")?"pending":e.every(i=>i.mappingStatus==="unmapped")?"unmapped":r.length?"extracted":"invalid":"empty"}function Ph(t,e,r){if(e)return r.resolve(t,e,"matrix").constructId}function bh(t,e){let r=t.methodology.methodologicalParadigm,i=e.paradigms.find(n=>n.paradigmId===r.paradigmId&&n.status==="approved");return{...i?{paradigmId:i.paradigmId,paradigmLabel:i.label}:{},...r.sourceTerm?{paradigmSourceTerm:r.sourceTerm}:{},paradigmMappingStatus:r.mappingStatus,...t.methodology.researchApproach.normalizedValue||t.methodology.researchApproach.sourceTerm?{researchApproach:t.methodology.researchApproach.normalizedValue??t.methodology.researchApproach.sourceTerm}:{},...t.methodology.analyticalTechnique.normalizedValue||t.methodology.analyticalTechnique.sourceTerm?{analyticalTechnique:t.methodology.analyticalTechnique.normalizedValue??t.methodology.analyticalTechnique.sourceTerm}:{},...t.fields.population.normalizedValue||t.fields.population.sourceText?{population:t.fields.population.normalizedValue??t.fields.population.sourceText}:{},...t.methodology.sampleCharacteristics.unitOfAnalysis?{unitOfAnalysis:t.methodology.sampleCharacteristics.unitOfAnalysis}:{},...t.methodology.sampleCharacteristics.n!==void 0?{sampleSize:t.methodology.sampleCharacteristics.n}:{}}}var Ji=class{validateApprovalAuthority(e,r,i,n){return[...Ih(e,r,i,n),...Sh(e,r,i,n),...jh(e,r,i,n),...Eh(e,r,i,n)]}transitionVerification(e,r,i,n,o){return Th(n)?Oh(r,i)?{value:{...e,verification:{...e.verification,[r]:i}},diagnostics:[]}:{diagnostics:[Vh(o,r,i)]}:{diagnostics:[Nh(o,r)]}}transitionResearcherApproval(e,r,i,n){return i.type!=="human"&&!(i.type==="service"&&i.id==="ReviewStateService")?{diagnostics:[Hh(n)]}:{value:{...e,approval:{...e.approval,researcher:r}},diagnostics:[]}}};function Ih(t,e,r,i){let n=Ch(t,e);return n.length?r.type==="human"?[]:r.type==="service"&&r.id==="ReviewStateService"?[]:r.type==="agent"&&n.every(o=>_h(o.after))?[]:[g({layer:"structural",code:"approval-authority-required",file:i,rule:"Approval fields may only be changed by a human or ReviewStateService.",action:"Submit the change for researcher review."})]:[]}function Sh(t,e,r,i){let n=Dh(t,e);return!n.length||r.type==="human"?[]:r.type==="service"&&r.id==="ReviewStateService"?[]:r.type==="agent"&&n.every(o=>$h(o.after))?[]:[qh(i)]}function Eh(t,e,r,i){return r.type!=="agent"?[]:Rh(t,e).every(o=>kh(o.after))?[]:[g({layer:"structural",code:"agent-origin-required",file:i,rule:"Review state created or changed by an agent must retain AI origin.",action:"Set reviewState.origin to ai and submit the record for researcher review."})]}function jh(t,e,r,i){return r.type!=="agent"?[]:Mh(t,e).every(o=>!Ah(o.after))?[]:[g({layer:"structural",code:"paradigm-decision-authority-required",file:i,rule:"Only a researcher may approve or reject a cross-paradigm decision.",action:"Keep the decision pending and submit it for researcher review."})]}function Ch(t,e){let r=Ec(t),i=Ec(e);return[...new Set([...Object.keys(r),...Object.keys(i)])].filter(o=>JSON.stringify(r[o])!==JSON.stringify(i[o])).map(o=>({before:r[o],after:i[o]}))}function Ec(t,e=""){let r={};return xo(t,e,r),r}function Dh(t,e){let r=jc(t),i=jc(e);return[...new Set([...Object.keys(r),...Object.keys(i)])].filter(o=>JSON.stringify(r[o])!==JSON.stringify(i[o])).map(o=>({before:r[o],after:i[o]}))}function jc(t,e=""){let r={};return Po(t,e,r),r}function Rh(t,e){let r=Cc(t),i=Cc(e);return[...new Set([...Object.keys(r),...Object.keys(i)])].filter(o=>JSON.stringify(r[o])!==JSON.stringify(i[o])).map(o=>({before:r[o],after:i[o]}))}function Cc(t,e=""){let r={};return bo(t,e,r),r}function Mh(t,e){let r=Dc(t),i=Dc(e);return[...new Set([...Object.keys(r),...Object.keys(i)])].filter(o=>JSON.stringify(r[o])!==JSON.stringify(i[o])).map(o=>({before:r[o],after:i[o]}))}function Dc(t,e=""){let r={};return Io(t,e,r),r}function xo(t,e,r){if(Array.isArray(t)){t.forEach((i,n)=>xo(i,`${e}/${n}`,r));return}if(ht(t))for(let[i,n]of Object.entries(t))i==="approval"?r[`${e}/approval`]=n:xo(n,`${e}/${i}`,r)}function Po(t,e,r){if(Array.isArray(t)){t.forEach((i,n)=>Po(i,`${e}/${n}`,r));return}if(ht(t))for(let[i,n]of Object.entries(t))i==="verification"?r[`${e}/verification`]=n:Po(n,`${e}/${i}`,r)}function bo(t,e,r){if(Array.isArray(t)){t.forEach((i,n)=>bo(i,`${e}/${n}`,r));return}if(ht(t))for(let[i,n]of Object.entries(t))i==="reviewState"?r[`${e}/reviewState`]=n:bo(n,`${e}/${i}`,r)}function Io(t,e,r){if(Array.isArray(t)){t.forEach((i,n)=>Io(i,`${e}/${n}`,r));return}if(ht(t))for(let[i,n]of Object.entries(t))i==="paradigmDecision"?r[`${e}/paradigmDecision`]=n:Io(n,`${e}/${i}`,r)}function ht(t){return t!==null&&typeof t=="object"}function _h(t){return ht(t)?t.researcher==="not-reviewed"&&t.advisor==="not-reviewed":!1}function $h(t){return ht(t)?t.source==="pending"&&t.interpretation==="pending"&&t.classification==="pending":!1}function kh(t){return ht(t)&&t.origin==="ai"}function Ah(t){return ht(t)&&(t.status==="approved"||t.status==="rejected")}function Th(t){return t.type==="human"||t.type==="service"&&t.id==="ReviewStateService"}function Oh(t,e){return t==="source"?["pending","verified","rejected","stale","not-applicable"].includes(e):t==="interpretation"?["pending","verified","rejected","not-applicable"].includes(e):["pending","verified","disputed","not-applicable"].includes(e)}function Nh(t,e){return g({layer:"structural",code:"verification-authority-required",file:t,objectId:e,rule:"Only a researcher or ReviewStateService may confirm or dispute verification.",action:"Submit the proposed state to the researcher verification queue."})}function qh(t){return g({layer:"structural",code:"verification-authority-required",file:t,rule:"An agent may add pending review states but cannot confirm or dispute verification.",action:"Submit the proposed state to the researcher verification queue."})}function Vh(t,e,r){return g({layer:"structural",code:"invalid-verification-transition",file:t,objectId:e,rule:`${r} is not valid for ${e} verification.`,action:"Choose a documented state for the selected verification dimension."})}function Hh(t){return g({layer:"structural",code:"approval-authority-required",file:t,rule:"Only a researcher or ReviewStateService may change researcher approval.",action:"Submit the proposal for researcher review."})}var Or=require("fs/promises"),So=L(require("path")),_c=require("crypto");var Mt="project.nodegraph.json",Fh="taxonomy/methodologies.json",$c="synthesis/claims-v1.2.json",kc="synthesis/conflicts-v1.2.json",Ac="synthesis/evidence-appraisals-v1.2.json",Lh="indexes/claims.index.json",Ki=class{constructor(e,r,i,n,o,a,s=W){this.paths=e;this.schemas=r;this.writer=i;this.mutations=n;this.synthesis=o;this.crossDocuments=a;this.clock=s}async migratePhase2(e,r){if(r.type!=="human")return Rc(r,"Phase 2");let i=await this.readManifest(e,"project.schema.json");return i.value?i.value.schema.version!==dt?rg(i.value.schema.version,dt):this.runPhase2Migration(So.dirname(e),i.value,r):gt(i.diagnostics)}async migratePhase3(e,r){if(r.type!=="human")return Rc(r,"Phase 3");let i=await zh(e);if(i!==ge)return Mc(i);let n=await this.readManifest(e,"project-v1.1.schema.json");return n.value?n.value.schema.version!==ge?Mc(n.value.schema.version):this.runPhase3Migration(So.dirname(e),n.value,r):gt(n.diagnostics)}readManifest(e,r){return Dt(e,Mt,r,this.schemas)}async runPhase2Migration(e,r,i){let n=this.clock.now(),o=Bh(r,n),a=Uh(o,n),s=this.validateSchemas("project-v1.1.schema.json",o,a);return D(s)?gt(s):this.commitMigration(e,r,o,a,i,"project.schema.json","project-v1.1.schema.json")}async runPhase3Migration(e,r,i){let n=await this.readPhase3Source(e,r);if(!n.bundle||D(n.diagnostics))return gt(n.diagnostics);let o=this.clock.now(),a=Gh(r,o),s=Wh(n.bundle,o),c=eg(n.bundle,s),d=[...this.validateSchemas("project-v1.2.schema.json",a,s),...this.crossDocuments.validate(a,c,n.extractions)];return D(d)?gt(d):this.commitMigration(e,r,a,s,i,"project-v1.1.schema.json","project-v1.2.schema.json")}async readPhase3Source(e,r){let[i,n,o]=await Promise.all([this.synthesis.readBundle(e,r),this.synthesis.readMethodologies(e,r),Promise.all(r.papers.map(async s=>({paperId:s.paperId,read:await this.synthesis.readExtraction(e,s)})))]),a=new Map(o.flatMap(s=>s.read.value?[[s.paperId,s.read.value]]:[]));return{bundle:i.bundle,extractions:a,diagnostics:[...i.diagnostics,...n.diagnostics,...o.flatMap(s=>s.read.diagnostics),...this.validatePhase2Extractions(r,i.bundle,n.value,a)]}}validatePhase2Extractions(e,r,i,n){return!r||!i?[]:[...n.values()].flatMap(o=>this.crossDocuments.validateExtraction(e,o,r.evidence,r.constructs,i))}validateSchemas(e,r,i){return[...this.schemas.validate(e,r,Mt),...i.flatMap(n=>this.schemas.validate(n.schema,n.value,n.path))]}async commitMigration(e,r,i,n,o,a,s){await this.assertTargetsAbsent(e,n);let c=[];try{await this.writeProposedDocuments(e,n,c);let d=await this.replaceManifest(e,r,i,o,a,s);if(!d.accepted)return await this.removeCreated(e,c),{mutation:d,diagnostics:d.diagnostics??[]};let u=await this.invalidateIndexes(e,i);return{mutation:d,manifest:i,diagnostics:u}}catch(d){throw d instanceof _e?(await this.invalidateIndexes(e,i),d):(await this.removeCreated(e,c),d)}}async assertTargetsAbsent(e,r){for(let i of r){let n=await this.paths.resolve(e,i.path);try{throw await(0,Or.access)(n),new Error(`Migration target already exists: ${i.path}`)}catch(o){if(!ve(o,"ENOENT"))throw o}}}async writeProposedDocuments(e,r,i){for(let n of r){let o=await this.paths.resolve(e,n.path);await this.writer.write(o,n.value),i.push(n.path)}}replaceManifest(e,r,i,n,o,a){return this.mutations.apply(e,{mutationId:`mutation_${(0,_c.randomUUID)().replace(/-/g,"")}`,targetDocument:Mt,baseRevision:S(r),operations:[{op:"replace",path:"",value:i}],requestedAt:this.clock.now(),actor:n},{schemaName:a,currentSchemaName:o,auditPath:r.documents.auditLog,auditAction:"schema.migrated",auditObjectId:r.projectId,auditMetadata:{fromSchemaVersion:r.schema.version,toSchemaVersion:i.schema.version},validateCandidate:()=>this.validateCreatedTargets(e,i)})}async validateCreatedTargets(e,r){let i=r.schema.version===G?[r.documents.claims,r.documents.conflicts,r.documents.appraisals]:[r.documents.methodologies,...r.papers.map(o=>o.extractionPath)],n=[];for(let o of i)try{await(0,Or.access)(await this.paths.resolve(e,o,!0))}catch{n.push(ig(o))}return n}async invalidateIndexes(e,r){let i=[r.documents.paperIndex,r.documents.evidenceIndex,...r.documents.claimLedgerIndex?[r.documents.claimLedgerIndex]:[]],n=[];for(let o of i)try{await this.writer.remove(await this.paths.resolve(e,o))}catch{n.push(ng(o))}return n}async removeCreated(e,r){for(let i of[...r].reverse())await this.writer.remove(await this.paths.resolve(e,i))}};async function zh(t){try{let e=JSON.parse(await(0,Or.readFile)(t,"utf8"));return typeof e.schema?.version=="string"?e.schema.version:""}catch{return""}}function Bh(t,e){return{...t,schema:{...t.schema,version:ge},modified:e,papers:t.papers.map(r=>({...r,extractionPath:`extractions/${r.paperId}.json`})),documents:{...t.documents,methodologies:Fh}}}function Uh(t,e){return[{path:t.documents.methodologies,schema:"methodology-registry.schema.json",value:Li(e)},...t.papers.map(r=>({path:r.extractionPath,schema:"extraction.schema.json",value:Fi(r.paperId,e)}))]}function Gh(t,e){return{...t,schema:{...t.schema,version:G},modified:e,documents:{...t.documents,claims:$c,conflicts:kc,appraisals:Ac,claimLedgerIndex:Lh}}}function Wh(t,e){return[{path:$c,schema:"synthesis-claims-v1.2.schema.json",value:Yh(t.claims,e)},{path:kc,schema:"conflicts-v1.2.schema.json",value:Kh(t.conflicts,e)},{path:Ac,schema:"evidence-appraisals.schema.json",value:Zh(e)}]}function Yh(t,e){return{schema:{name:"nodegraph-synthesis-claims",version:Se},claims:t.claims.map(r=>Jh(r)),modified:e}}function Jh(t){let{confidence:e,...r}=t;return{...r,...e?.policyId?{confidence:e}:{}}}function Kh(t,e){return{schema:{name:"nodegraph-conflicts",version:Se},conflicts:t.conflicts.map(r=>Xh(r)),modified:e}}function Xh(t){return{...t,possibleExplanations:t.possibleExplanations.map((e,r)=>({explanationId:e.explanationId??`explanation_${t.conflictId.slice(9)}_${r+1}`,type:e.type,text:Qh(e),contextComparisonIds:e.contextComparisonIds??[],reviewState:e.reviewState??tg()})),contextComparisons:t.contextComparisons??[]}}function Qh(t){return t.text?t.text:t.value??"Imported explanation requires researcher review."}function Zh(t){return{schema:{name:"nodegraph-evidence-appraisals",version:Se},appraisals:[],modified:t}}function eg(t,e){return{...t,claims:e[0].value,conflicts:e[1].value,appraisals:e[2].value}}function tg(){return{verification:{source:"not-applicable",interpretation:"pending",classification:"pending"},approval:{researcher:"not-reviewed",advisor:"not-reviewed"},origin:"imported"}}function Rc(t,e){return gt([g({layer:"structural",code:"migration-authority-required",file:Mt,objectId:t.id,rule:`Only a researcher may start the ${e} schema migration.`,action:"Run the migration through a researcher-confirmed command."})])}function rg(t,e){return gt([g({layer:"structural",code:"migration-not-required",file:Mt,objectId:t,rule:`The project is not at schema ${e}.`,action:"Open the project normally or run the next sequential migration."})])}function Mc(t){let e=t===dt;return gt([g({layer:"structural",code:e?"sequential-migration-required":"migration-not-required",file:Mt,objectId:t,rule:`Phase 3 migration requires schema ${ge}.`,action:e?"Run the Phase 2 migration first, then run the Phase 3 migration.":"Open the project normally or use a compatible application version."})])}function gt(t){return{mutation:{accepted:!1,code:"migration-rejected",targetDocument:Mt,currentRevision:"absent",receivedBaseRevision:"absent",retryable:!1,rejectedOperations:[],diagnostics:t},diagnostics:t}}function ig(t){return g({layer:"structural",code:"missing-migration-target",file:t,rule:"A proposed migration subordinate document is missing.",action:"Restore the proposed document before replacing the manifest."})}function ng(t){return g({layer:"integrity",severity:"warning",code:"migration-index-invalidation-failed",file:t,rule:"The migration committed, but a derived index could not be removed.",action:"Rebuild project indexes before using synthesis views."})}var El=L(us()),jl=L(Sl()),kn=require("fs"),Cl=L(require("path"));var $n=class{constructor(e,r){this.validators=new Map;let i=cb(),n=db(e);for(let[,a]of n)i.addSchema(a);for(let[a,s]of n)this.validators.set(a,i.getSchema(s.$id)??i.compile(s));let o=Dl(r);this.validators.set("nodegraph.schema.json",i.compile(o))}validate(e,r,i){let n=this.validators.get(e);return n?n(r)?[]:(n.errors??[]).map(o=>lb(i,o)):[ub(e,i)]}parseJson(e,r){try{return{value:JSON.parse(e),diagnostics:[]}}catch(i){return{diagnostics:[fb(r,i)]}}}};function cb(){let t=new El.default({allErrors:!0,strict:!1});return(0,jl.default)(t),t}function db(t){return(0,kn.readdirSync)(t).filter(e=>e.endsWith(".schema.json")).map(e=>[e,Dl(Cl.join(t,e))])}function Dl(t){return JSON.parse((0,kn.readFileSync)(t,"utf8"))}function ub(t,e){return g({layer:"syntactic",code:"schema-not-found",file:e,rule:`Schema ${t} is unavailable.`,action:"Restore the application schema files and retry."})}function lb(t,e){return g({layer:"syntactic",code:`schema-${e.keyword}`,file:t,jsonPath:e.instancePath||"/",rule:e.message??"The document does not match its schema.",action:pb(e)})}function pb(t){return t.keyword==="required"?"Add the required property shown in the diagnostic.":t.keyword==="additionalProperties"?"Remove the unsupported property.":"Correct the value to match the documented schema."}function fb(t,e){return g({layer:"syntactic",code:"invalid-json",file:t,rule:e instanceof Error?e.message:"The file is not valid JSON.",action:"Correct the JSON syntax without replacing the existing file."})}var An=class{constructor(e,r,i,n){this.paths=e;this.schemas=r;this.mutations=i;this.crossDocuments=n}async readBundle(e,r){let i=await this.readBundleDocuments(e,r),n=mb(i);if(!hb(i))return{diagnostics:n};let o=gb(i),a=r.schema.version===G?await this.readExtractions(e,r):{values:new Map,diagnostics:[]};return n.push(...a.diagnostics),n.push(...this.crossDocuments.validate(r,o,a.values)),{bundle:o,diagnostics:n}}async readEvidence(e,r){return this.readDocument(e,r.documents.evidence,"evidence-records.schema.json")}async readClaims(e,r){return this.readDocument(e,r.documents.claims,ws(r))}async readConflicts(e,r){return this.readDocument(e,r.documents.conflicts,xs(r))}async readAppraisals(e,r){return r.documents.appraisals?this.readDocument(e,r.documents.appraisals,"evidence-appraisals.schema.json"):{diagnostics:[wb("appraisals")]}}async readTaxonomy(e,r){return this.readDocument(e,r.documents.constructs,"construct-taxonomy.schema.json")}async readMethodologies(e,r){if(!r.documents.methodologies)return{diagnostics:[ys("methodologies")]};let i=await this.readDocument(e,r.documents.methodologies,"methodology-registry.schema.json");if(!i.value)return i;let n=[...i.diagnostics,...this.crossDocuments.validateMethodologies(i.value,r.documents.methodologies)];return D(n)?{diagnostics:n}:{value:i.value,diagnostics:n}}async readExtraction(e,r){return r.extractionPath?this.readDocument(e,r.extractionPath,"extraction.schema.json"):{diagnostics:[ys(`extraction:${r.paperId}`)]}}validateExtraction(e,r,i,n){return i.extractionPath?this.validateExtractionCandidate(e,r,{key:"extraction",path:i.extractionPath,schema:"extraction.schema.json",auditAction:"extraction.mutated"},n):Promise.resolve([ys(`extraction:${i.paperId}`)])}async applyMutation(e,r,i,n){let o=yb(r).find(a=>a.path===i.targetDocument);return o?this.mutations.apply(e,i,{schemaName:o.schema,auditPath:r.documents.auditLog,auditAction:n?.action??o.auditAction,auditObjectId:n?.objectId??i.mutationId,auditMetadata:n?.metadata,validateCandidate:a=>this.validateCandidate(e,r,o,a)}):Pb(i)}async readDocument(e,r,i){let n=await this.paths.resolve(e,r);return Dt(n,r,i,this.schemas)}async validateCandidate(e,r,i,n){if(i.key==="extraction")return this.validateExtractionCandidate(e,r,i,n);if(i.key==="methodologies")return this.crossDocuments.validateMethodologies(n,i.path);let o=await this.readBundle(e,r);if(!o.bundle)return o.diagnostics;let a=vb(o.bundle,i.key,n),s=r.schema.version===G?await this.readExtractions(e,r):{values:new Map,diagnostics:[]};return[...o.diagnostics,...s.diagnostics,...this.crossDocuments.validate(r,a,s.values)]}async validateExtractionCandidate(e,r,i,n){let[o,a,s]=await Promise.all([this.readEvidence(e,r),this.readTaxonomy(e,r),this.readMethodologies(e,r)]),c=[...o.diagnostics,...a.diagnostics,...s.diagnostics];if(!o.value||!a.value||!s.value)return c;let d=n,u=r.papers.find(l=>l.extractionPath===i.path);return!u||d.paperId!==u.paperId?[...c,xb(i.path)]:[...c,...this.crossDocuments.validateExtraction(r,d,o.value,a.value,s.value)]}async readBundleDocuments(e,r){let[i,n,o,a,s,c,d]=await Promise.all([this.readDocument(e,r.documents.claims,ws(r)),this.readDocument(e,r.documents.conflicts,xs(r)),this.readDocument(e,r.documents.gaps,"gaps.schema.json"),this.readDocument(e,r.documents.researchQuestions,"research-questions.schema.json"),this.readDocument(e,r.documents.constructs,"construct-taxonomy.schema.json"),this.readDocument(e,r.documents.evidence,"evidence-records.schema.json"),r.documents.appraisals?this.readDocument(e,r.documents.appraisals,"evidence-appraisals.schema.json"):Promise.resolve({diagnostics:[]})]);return{claims:i,conflicts:n,gaps:o,researchQuestions:a,constructs:s,evidence:c,appraisals:d}}async readExtractions(e,r){let i=await Promise.all(r.papers.map(async n=>({paperId:n.paperId,read:await this.readExtraction(e,n)})));return{values:new Map(i.flatMap(n=>n.read.value?[[n.paperId,n.read.value]]:[])),diagnostics:i.flatMap(n=>n.read.diagnostics)}}};function mb(t){return Object.values(t).flatMap(e=>e.diagnostics)}function hb(t){return t.claims.value!==void 0&&t.conflicts.value!==void 0&&t.gaps.value!==void 0&&t.researchQuestions.value!==void 0&&t.constructs.value!==void 0&&t.evidence.value!==void 0}function gb(t){return{claims:t.claims.value,conflicts:t.conflicts.value,gaps:t.gaps.value,researchQuestions:t.researchQuestions.value,constructs:t.constructs.value,evidence:t.evidence.value,...t.appraisals.value?{appraisals:t.appraisals.value}:{}}}function vb(t,e,r){switch(e){case"claims":return{...t,claims:r};case"conflicts":return{...t,conflicts:r};case"gaps":return{...t,gaps:r};case"researchQuestions":return{...t,researchQuestions:r};case"constructs":return{...t,constructs:r};case"evidence":return{...t,evidence:r};case"appraisals":return{...t,appraisals:r}}}function yb(t){return[{key:"claims",path:t.documents.claims,schema:ws(t),auditAction:"synthesis.claims-mutated"},{key:"conflicts",path:t.documents.conflicts,schema:xs(t),auditAction:"synthesis.conflicts-mutated"},{key:"gaps",path:t.documents.gaps,schema:"gaps.schema.json",auditAction:"synthesis.gaps-mutated"},{key:"researchQuestions",path:t.documents.researchQuestions,schema:"research-questions.schema.json",auditAction:"synthesis.questions-mutated"},{key:"constructs",path:t.documents.constructs,schema:"construct-taxonomy.schema.json",auditAction:"taxonomy.constructs-mutated"},...t.documents.methodologies?[{key:"methodologies",path:t.documents.methodologies,schema:"methodology-registry.schema.json",auditAction:"taxonomy.methodologies-mutated"}]:[],{key:"evidence",path:t.documents.evidence,schema:"evidence-records.schema.json",auditAction:"evidence.records-mutated"},...t.documents.appraisals?[{key:"appraisals",path:t.documents.appraisals,schema:"evidence-appraisals.schema.json",auditAction:"evidence.appraisals-mutated"}]:[],...t.papers.flatMap(e=>e.extractionPath?[{key:"extraction",path:e.extractionPath,schema:"extraction.schema.json",auditAction:"extraction.mutated"}]:[])]}function ws(t){return t.schema.version===G?"synthesis-claims-v1.2.schema.json":"synthesis-claims.schema.json"}function xs(t){return t.schema.version===G?"conflicts-v1.2.schema.json":"conflicts.schema.json"}function ys(t){return{layer:"syntactic",severity:"error",code:"phase2-document-not-registered",file:"project.nodegraph.json",objectId:t,rule:"The Phase 2 authoritative document is not registered.",action:"Run the explicit Phase 2 project migration."}}function wb(t){return{layer:"syntactic",severity:"error",code:"phase3-document-not-registered",file:"project.nodegraph.json",objectId:t,rule:"The Phase 3 authoritative document is not registered.",action:"Run the explicit Phase 3 project migration."}}function xb(t){return{layer:"structural",severity:"error",code:"extraction-paper-mismatch",file:t,rule:"The extraction paper ID does not match its manifest registration.",action:"Use the extraction document registered for the selected paper."}}function Pb(t){return{accepted:!1,code:"unsupported-mutation-target",targetDocument:t.targetDocument,currentRevision:t.baseRevision,receivedBaseRevision:t.baseRevision,retryable:!1,rejectedOperations:t.operations}}var $l=require("crypto");var Tn=class{constructor(e,r,i,n=W){this.synthesis=e;this.resolver=r;this.reviews=i;this.clock=n}listApproved(e){return e.constructs.filter(r=>r.status==="approved")}resolveCanonicalId(e,r,i){return this.resolver.resolve(e,r,i)}resolveAlias(e,r,i){return this.resolver.resolveTerm(e,r,i)}findLikelyDuplicates(e,r){let i=se(r);return e.constructs.filter(n=>[n.canonicalName,...n.aliases].some(o=>Ib(i,se(o))))}async proposeConstruct(e,r,i,n,o){let a=await this.synthesis.readTaxonomy(e,r);if(!a.value)return{mutation:Ge(r.documents.constructs,n,a.diagnostics)};let s=this.findLikelyDuplicates(a.value,i.canonicalName),c={...a.value,constructs:[...a.value.constructs,{...i,...i.definition?{definition:i.definition}:{},aliases:[],status:"proposed",reviewState:He(o.type==="agent"?"ai":"human")}],modified:this.clock.now()};return{mutation:await this.applyTaxonomy(e,r,c,n,o,"taxonomy.construct-proposed",i.constructId),duplicateCandidates:s}}reviewConstruct(e,r,i,n,o,a){return a.type!=="human"?Promise.resolve(pi(r.documents.constructs,o,i)):this.updateConstruct(e,r,i,o,a,`taxonomy.construct-${n}`,(s,c)=>{let d=this.reviews.transitionResearcherApproval(c.reviewState,n,a,r.documents.constructs);return d.value?(c.reviewState=d.value,n==="approved"&&(c.status="approved"),s.taxonomyVersion+=1,[]):d.diagnostics})}mergeConstructs(e,r,i,n,o,a){return a.type!=="human"?Promise.resolve(pi(r.documents.constructs,o,i)):this.updateTaxonomy(e,r,o,a,"taxonomy.construct-merged",i,s=>bb(s,i,n),{deprecatedConstructId:i,primaryConstructId:n})}async proposeMapping(e,r,i,n,o,a){return this.updateExtraction(e,r,i,o,a,"taxonomy.mapping-proposed",n.mappingId,s=>{let c={...n,...n.constructId?{constructId:n.constructId}:{},mappingStatus:n.constructId?"pending":"unmapped",reviewState:He(a.type==="agent"?"ai":"human")};return s.constructMappings.push(c),s.fields.keyConstructs={reportingStatus:"present",mappingIds:[...s.fields.keyConstructs.mappingIds??[],n.mappingId]},[]})}reviewMapping(e,r,i,n,o,a,s){return s.type!=="human"?Promise.resolve(pi(Ml(r,i),a,n)):this.updateExtraction(e,r,i,a,s,`taxonomy.mapping-${o}`,n,async(c,d)=>{let u=c.constructMappings.find(p=>p.mappingId===n);if(!u)return[_l(n,d)];if(o==="approved"){let p=await this.synthesis.readTaxonomy(e,r);if(!p.value)return p.diagnostics;if(!u.constructId)return[Cb(n,d)];let m=this.resolver.resolve(p.value,u.constructId,d);if(!m.constructId)return m.diagnostics;u.constructId=m.constructId}let l=this.reviews.transitionResearcherApproval(u.reviewState,o,s,d);return l.value?(u.reviewState=l.value,u.mappingStatus=o,[]):l.diagnostics})}remapConstruct(e,r,i,n,o,a,s){return s.type!=="human"?Promise.resolve(pi(Ml(r,i),a,n)):this.updateExtraction(e,r,i,a,s,"taxonomy.mapping-remapped",n,async(c,d)=>{let u=c.constructMappings.find(m=>m.mappingId===n);if(!u)return[_l(n,d)];let l=await this.synthesis.readTaxonomy(e,r);if(!l.value)return l.diagnostics;let p=this.resolver.resolve(l.value,o,d);return p.constructId?(u.constructId=p.constructId,u.mappingStatus="approved",[]):p.diagnostics})}listApprovedParadigms(e){return e.paradigms.filter(r=>r.status==="approved")}async proposeParadigm(e,r,i,n,o,a){let s=await this.synthesis.readMethodologies(e,r);if(!s.value||!r.documents.methodologies)return Ge(r.documents.methodologies??"methodologies",o,s.diagnostics);let c={...s.value,paradigms:[...s.value.paradigms,{paradigmId:i,label:n,aliases:[],status:"proposed",reviewState:He(a.type==="agent"?"ai":"human")}],modified:this.clock.now()};return this.applyMethodologies(e,r,c,o,a,"taxonomy.paradigm-proposed",i)}async reviewParadigm(e,r,i,n,o,a){if(a.type!=="human")return pi(r.documents.methodologies??"methodologies",o,i);let s=await this.synthesis.readMethodologies(e,r);if(!s.value||!r.documents.methodologies)return Ge(r.documents.methodologies??"methodologies",o,s.diagnostics);let c=s.value.paradigms.find(l=>l.paradigmId===i);if(!c)return Ge(r.documents.methodologies,o,[Db(i,r.documents.methodologies)]);let d=this.reviews.transitionResearcherApproval(c.reviewState,n,a,r.documents.methodologies);if(!d.value)return Ge(r.documents.methodologies,o,d.diagnostics);let u={...s.value,registryVersion:s.value.registryVersion+1,paradigms:s.value.paradigms.map(l=>l.paradigmId!==i?l:{...l,status:n==="approved"?"approved":"proposed",reviewState:d.value}),modified:this.clock.now()};return this.applyMethodologies(e,r,u,o,a,`taxonomy.paradigm-${n}`,i)}async updateConstruct(e,r,i,n,o,a,s){return this.updateTaxonomy(e,r,n,o,a,i,c=>{let d=c.constructs.find(u=>u.constructId===i);return d?s(c,d):[kl(i,r.documents.constructs)]})}async updateTaxonomy(e,r,i,n,o,a,s,c){let d=await this.synthesis.readTaxonomy(e,r);if(!d.value)return Ge(r.documents.constructs,i,d.diagnostics);let u=structuredClone(d.value),l=s(u);return l.length?Ge(r.documents.constructs,i,l):(u.modified=this.clock.now(),this.applyTaxonomy(e,r,u,i,n,o,a,c))}async updateExtraction(e,r,i,n,o,a,s,c){let d=r.papers.find(m=>m.paperId===i);if(!d?.extractionPath)return Ge("project.nodegraph.json",n,[Rb(i)]);let u=await this.synthesis.readExtraction(e,d);if(!u.value)return Ge(d.extractionPath,n,u.diagnostics);let l=structuredClone(u.value),p=await c(l,d.extractionPath);return p.length?Ge(d.extractionPath,n,p):(l.modified=this.clock.now(),this.applyExtraction(e,r,l,d.extractionPath,n,o,a,s))}applyTaxonomy(e,r,i,n,o,a,s,c){return this.applyRootMutation(e,r,r.documents.constructs,i,n,o,a,s,c)}applyMethodologies(e,r,i,n,o,a,s){return this.applyRootMutation(e,r,r.documents.methodologies,i,n,o,a,s)}applyExtraction(e,r,i,n,o,a,s,c){return this.applyRootMutation(e,r,n,i,o,a,s,c)}applyRootMutation(e,r,i,n,o,a,s,c,d){return this.synthesis.applyMutation(e,r,{mutationId:`mutation_${(0,$l.randomUUID)().replace(/-/g,"")}`,targetDocument:i,baseRevision:o,operations:[{op:"replace",path:"",value:n}],requestedAt:this.clock.now(),actor:a},{action:s,objectId:c,metadata:d})}};function bb(t,e,r){let i=t.constructs.find(o=>o.constructId===e),n=t.constructs.find(o=>o.constructId===r);return i?e===r?[jb(e)]:Rl(i)?!n||!Rl(n)?[Sb(r)]:(n.aliases=Rr([...n.aliases,i.canonicalName,...i.aliases]),i.status="deprecated",i.primaryConstructId=r,t.taxonomyVersion+=1,[]):[Eb(e)]:[kl(e,"taxonomy/constructs.json")]}function Rl(t){return t.status==="approved"&&t.reviewState.approval.researcher==="approved"}function Ib(t,e){return!t||!e?!1:t===e||t.includes(e)||e.includes(t)}function Ge(t,e,r){return{accepted:!1,code:"taxonomy-operation-rejected",targetDocument:t,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:r}}function pi(t,e,r){return Ge(t,e,[g({layer:"structural",code:"researcher-authority-required",file:t,objectId:r,rule:"Only a researcher can approve, reject, merge, or remap taxonomy records.",action:"Submit the change as a proposal for researcher review."})])}function Ml(t,e){return t.papers.find(r=>r.paperId===e)?.extractionPath??"project.nodegraph.json"}function kl(t,e){return g({layer:"structural",code:"construct-not-found",file:e,objectId:t,rule:"The requested construct does not exist.",action:"Refresh the taxonomy and choose an existing construct."})}function Sb(t){return g({layer:"structural",code:"primary-construct-not-active",file:"taxonomy/constructs.json",objectId:t,rule:"A merge target must be an approved construct.",action:"Approve the primary construct before merging."})}function Eb(t){return g({layer:"structural",code:"construct-merge-source-not-approved",file:"taxonomy/constructs.json",objectId:t,rule:"Only an active researcher-approved construct can be deprecated by a merge.",action:"Approve the source construct, or choose another active construct."})}function jb(t){return g({layer:"structural",code:"self-referential-primary",file:"taxonomy/constructs.json",objectId:t,rule:"A construct cannot be merged into itself.",action:"Choose a distinct approved primary construct."})}function _l(t,e){return g({layer:"structural",code:"mapping-not-found",file:e,objectId:t,rule:"The requested construct mapping does not exist.",action:"Refresh the extraction and choose an existing mapping."})}function Cb(t,e){return g({layer:"structural",code:"mapping-target-required",file:e,objectId:t,rule:"An approved mapping requires a construct target.",action:"Choose an approved construct before approving the mapping."})}function Db(t,e){return g({layer:"structural",code:"paradigm-not-found",file:e,objectId:t,rule:"The requested paradigm does not exist.",action:"Refresh the methodology registry and choose an existing paradigm."})}function Rb(t){return g({layer:"structural",code:"phase2-document-not-registered",file:"project.nodegraph.json",objectId:t,rule:"The paper has no registered extraction document.",action:"Migrate the project or register the paper again."})}var Tl=require("crypto");var On=class{constructor(e,r,i,n,o=W){this.paths=e;this.synthesis=r;this.integrity=i;this.reviews=n;this.clock=o}async sourceQueue(e,r){let i=await this.synthesis.readEvidence(e,r);if(!i.value)return{items:[],diagnostics:i.diagnostics};let n=await this.referencedEvidence(e,r),o=await this.inspectSources(e,r),a=[...i.diagnostics,...n.diagnostics,...o.diagnostics],s=new Map(r.papers.map(d=>[d.paperId,d]));return{items:i.value.evidence.filter(d=>n.ids.has(d.evidenceId)).filter(d=>d.reviewState.verification.source!=="verified").map(d=>{let u=s.get(d.paperId);return{evidenceId:d.evidenceId,paperId:d.paperId,sourcePath:u?.source.relativePath??d.source.relativePath,quote:d.quote.text,page:d.locator.page,state:d.reviewState.verification.source,stale:d.reviewState.verification.source==="stale"||o.stalePaperIds.has(d.paperId)}}),diagnostics:a}}async sourceNavigation(e,r,i){let n=await this.synthesis.readEvidence(e,r);if(!n.value)return{diagnostics:n.diagnostics};let o=n.value.evidence.find(c=>c.evidenceId===i);if(!o)return{diagnostics:[Al(i)]};let a=r.papers.find(c=>c.paperId===o.paperId&&c.source.sourceId===o.source.sourceId);if(!a)return{diagnostics:[$b(o)]};let s=await this.integrity.inspectSource(e,a);if(s.currentHash!==a.source.sourceDocumentHash)return{diagnostics:[...n.diagnostics,...s.diagnostics]};try{return{sourcePath:await this.paths.resolve(e,a.source.relativePath,!0),quote:o.quote.text,page:o.locator.page,diagnostics:[...n.diagnostics,...s.diagnostics]}}catch{return{diagnostics:[_b(a.source.relativePath,i)]}}}async updateSourceVerification(e,r,i,n,o,a){let s=await this.synthesis.readEvidence(e,r);if(!s.value)return Lt(r.documents.evidence,o,s.diagnostics);let c=structuredClone(s.value),d=c.evidence.find(l=>l.evidenceId===i);if(!d)return Lt(r.documents.evidence,o,[Al(i)]);let u=this.reviews.transitionVerification(d.reviewState,"source",n,a,r.documents.evidence);return u.value?(d.reviewState=u.value,d.modified=this.clock.now(),c.modified=this.clock.now(),this.applyRoot(e,r,r.documents.evidence,c,o,a,`verification.source-${n}`,i)):Lt(r.documents.evidence,o,u.diagnostics)}updateFindingVerification(e,r,i,n,o,a,s,c){return this.updateExtractionReview(e,r,i,n,o,a,s,c,d=>d.fields.findings.items?.find(u=>u.findingId===n),"finding")}updateMappingClassification(e,r,i,n,o,a,s){return this.updateExtractionReview(e,r,i,n,"classification",o,a,s,c=>c.constructMappings.find(d=>d.mappingId===n),"mapping")}async updateExtractionReview(e,r,i,n,o,a,s,c,d,u){let l=r.papers.find(v=>v.paperId===i);if(!l?.extractionPath)return Lt("project.nodegraph.json",s,[kb(i)]);let p=await this.synthesis.readExtraction(e,l);if(!p.value)return Lt(l.extractionPath,s,p.diagnostics);let m=structuredClone(p.value),h=d(m);if(!h)return Lt(l.extractionPath,s,[Ab(n,u,l.extractionPath)]);let f=this.reviews.transitionVerification(h.reviewState,o,a,c,l.extractionPath);return f.value?(h.reviewState=f.value,m.modified=this.clock.now(),this.applyRoot(e,r,l.extractionPath,m,s,c,`verification.${u}-${o}-${a}`,n)):Lt(l.extractionPath,s,f.diagnostics)}async referencedEvidence(e,r){let i=[],n=new Set;for(let o of r.papers){let a=await this.synthesis.readExtraction(e,o);i.push(...a.diagnostics),a.value&&Mb(a.value).forEach(s=>n.add(s))}return{ids:n,diagnostics:i}}async inspectSources(e,r){let i=[];for(let n of r.papers)i.push({paperId:n.paperId,result:await this.integrity.inspectSource(e,n)});return{stalePaperIds:new Set(i.filter(n=>n.result.diagnostics.length>0).map(n=>n.paperId)),diagnostics:i.flatMap(n=>n.result.diagnostics)}}applyRoot(e,r,i,n,o,a,s,c){return this.synthesis.applyMutation(e,r,{mutationId:`mutation_${(0,Tl.randomUUID)().replace(/-/g,"")}`,targetDocument:i,baseRevision:o,operations:[{op:"replace",path:"",value:n}],requestedAt:this.clock.now(),actor:a},{action:s,objectId:c})}};function Mb(t){return[...new Set([...t.fields.exactEvidenceQuotations.evidenceIds,...(t.fields.findings.items??[]).flatMap(e=>e.evidenceIds),...t.constructMappings.flatMap(e=>e.evidenceIds)])]}function Lt(t,e,r){return{accepted:!1,code:"verification-rejected",targetDocument:t,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:r}}function Al(t){return g({layer:"structural",code:"missing-evidence-reference",file:"evidence/records.json",objectId:t,rule:"The requested authoritative evidence record does not exist.",action:"Refresh the verification queue and choose an existing record."})}function _b(t,e){return g({layer:"integrity",severity:"warning",code:"missing-source-file",file:t,objectId:e,rule:"The evidence source cannot be opened.",action:"Restore the registered PDF before verifying the quotation."})}function $b(t){return g({layer:"structural",code:"source-registration-mismatch",file:"project.nodegraph.json",objectId:t.evidenceId,rule:"The evidence source does not match a registered paper source.",action:"Restore the source registration before opening this evidence."})}function kb(t){return g({layer:"structural",code:"phase2-document-not-registered",file:"project.nodegraph.json",objectId:t,rule:"The registered paper has no extraction document.",action:"Run the Phase 2 migration before verification."})}function Ab(t,e,r){return g({layer:"structural",code:`${e}-not-found`,file:r,objectId:t,rule:`The requested ${e} does not exist in the extraction.`,action:"Refresh the extraction and choose an existing record."})}var Ol=require("crypto");function Et(t,e){return t.schema.version===G?[]:[g({layer:"structural",code:"phase3-migration-required",file:e,rule:`Phase 3 mutations require project schema ${G}.`,action:"Run NodeGraph: Upgrade Project for Claims, then retry the operation."})]}function Pr(t,e,r,i,n,o,a,s,c,d,u){return t.applyMutation(e,r,{mutationId:`mutation_${(0,Ol.randomUUID)().replace(/-/g,"")}`,targetDocument:i,baseRevision:o,operations:[{op:"replace",path:"",value:n}],requestedAt:s,actor:a},{action:c,objectId:d,metadata:u})}function V(t,e,r,i="phase3-operation-rejected"){return{accepted:!1,code:i,targetDocument:t,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:r}}function et(t,e,r){return g({layer:"structural",code:"researcher-authority-required",file:t,objectId:e,rule:`Only a researcher may ${r}.`,action:"Submit the proposed analytical change for researcher review."})}var Nn=class{constructor(e,r,i,n=W){this.synthesis=e;this.reviews=r;this.schemas=i;this.clock=n}async propose(e,r,i,n,o){let a=this.schemas.validate("synthesis-claim-v1.2.schema.json",i,r.documents.claims);if(a.length)return V(r.documents.claims,n,a);let s=i,c=await this.claimsContext(e,r,n);if(!c.value)return c.rejection;let d=Tb(s,o,r.documents.claims);if(d.length)return V(r.documents.claims,n,d);if(c.value.claims.some(p=>p.claimId===s.claimId))return V(r.documents.claims,n,[Ob(s.claimId)]);let u=this.clock.now(),l={...c.value,claims:[...c.value.claims,structuredClone(s)],modified:u};return this.apply(e,r,l,n,o,"claim.proposed",s.claimId)}review(e,r,i,n,o,a){return a.type!=="human"?Promise.resolve(V(r.documents.claims,o,[et(r.documents.claims,i,"review a claim")])):this.update(e,r,i,o,a,`claim.${n}`,s=>{let c=this.reviews.transitionResearcherApproval(s.reviewState,n,a,r.documents.claims);return c.value?(s.reviewState=c.value,[]):c.diagnostics})}decideParadigm(e,r,i,n,o,a,s){return s.type!=="human"?Promise.resolve(V(r.documents.claims,a,[et(r.documents.claims,i,"decide a cross-paradigm synthesis")])):this.update(e,r,i,a,s,"claim.paradigm-decision",c=>(c.paradigmDecision={required:!0,status:n,rationale:o,decidedBy:s.id,decidedAt:this.clock.now()},[]))}changeRelationship(e,r,i,n,o,a,s,c){return this.update(e,r,i,s,c,"claim.relationship-reclassified",d=>{let u=d.findingRefs.find(p=>p.paperId===n&&p.findingId===o);if(!u)return[Nl(i,o)];let l=Ps(d,c,r.documents.claims);return l.length?l:(u.relationship=a,[])},{paperId:n,findingId:o,relationship:a})}addRelationship(e,r,i,n,o,a,s){return this.update(e,r,i,a,s,"claim.relationship-added",c=>{let d=Ps(c,s,r.documents.claims);return d.length?d:c.findingRefs.some(u=>Vb(u,n))?[qb(i,n.findingId)]:(c.findingRefs.push(structuredClone(n)),c.evidenceRefs=[...new Set([...c.evidenceRefs,...o])],[])},{paperId:n.paperId,findingId:n.findingId})}removeRelationship(e,r,i,n,o,a,s,c){return this.update(e,r,i,s,c,"claim.relationship-removed",d=>{let u=Ps(d,c,r.documents.claims);if(u.length)return u;let l=d.findingRefs.findIndex(p=>p.paperId===n&&p.findingId===o);return l<0?[Nl(i,o)]:(d.findingRefs.splice(l,1),d.evidenceRefs=d.evidenceRefs.filter(p=>!a.includes(p)),[])},{paperId:n,findingId:o,evidenceIds:a})}setConfidence(e,r,i,n,o,a){return this.update(e,r,i,o,a,"claim.confidence-recalculated",s=>(s.confidence=n,[]),{label:n.label,policyVersion:n.policyVersion})}async update(e,r,i,n,o,a,s,c){let d=await this.claimsContext(e,r,n);if(!d.value)return d.rejection;let u=structuredClone(d.value),l=u.claims.find(m=>m.claimId===i);if(!l)return V(r.documents.claims,n,[Nb(i)]);let p=s(l);return p.length?V(r.documents.claims,n,p):(l.modified=this.clock.now(),u.modified=this.clock.now(),this.apply(e,r,u,n,o,a,i,c))}async claimsContext(e,r,i){let n=Et(r,r.documents.claims);if(n.length)return{rejection:V(r.documents.claims,i,n)};let o=await this.synthesis.readClaims(e,r);return{value:o.value,rejection:V(r.documents.claims,i,o.diagnostics)}}apply(e,r,i,n,o,a,s,c){return Pr(this.synthesis,e,r,r.documents.claims,i,n,o,this.clock.now(),a,s,c)}};function Tb(t,e,r){return e.type!=="agent"?[]:t.reviewState.origin==="ai"&&t.reviewState.approval.researcher==="not-reviewed"&&t.reviewState.approval.advisor==="not-reviewed"&&!["approved","rejected"].includes(t.paradigmDecision.status)?[]:[g({layer:"structural",code:"agent-proposal-state-required",file:r,objectId:t.claimId,rule:"Agent-created claims must remain AI-origin proposals without researcher decisions.",action:"Set all approval dimensions to not-reviewed and submit the claim for review."})]}function Ob(t){return g({layer:"structural",code:"duplicate-claim-id",file:"synthesis claims",objectId:t,rule:"Claim identifiers must be unique.",action:"Assign a new stable claim identifier."})}function Nb(t){return g({layer:"structural",code:"missing-claim-reference",file:"synthesis claims",objectId:t,rule:"The requested claim does not exist.",action:"Refresh the claim ledger and choose an existing claim."})}function Nl(t,e){return g({layer:"structural",code:"missing-finding-reference",file:"synthesis claims",objectId:e,rule:`${e} is not part of ${t}.`,action:"Choose a finding already referenced by the claim."})}function qb(t,e){return g({layer:"structural",code:"duplicate-finding-reference",file:"synthesis claims",objectId:e,rule:`${e} is already part of ${t}.`,action:"Reclassify the existing relationship instead of adding a duplicate."})}function Ps(t,e,r){return e.type!=="agent"||t.reviewState.approval.researcher!=="approved"?[]:[et(r,t.claimId,"change an approved claim relationship")]}function Vb(t,e){return t.paperId===e.paperId&&t.findingId===e.findingId}var qn=class{constructor(e,r,i,n=W){this.synthesis=e;this.reviews=r;this.schemas=i;this.clock=n}async propose(e,r,i,n,o){let a=this.validateProposal(i,r);if(a.length)return V(r.documents.conflicts,n,a);let s=i,c=await this.context(e,r,n);if(!c.value)return c.rejection;let d=Hb(s,o,r.documents.conflicts);if(d.length)return V(r.documents.conflicts,n,d);if(c.value.conflicts.some(p=>p.conflictId===s.conflictId))return V(r.documents.conflicts,n,[ql("duplicate-conflict-id",s.conflictId)]);let u=this.clock.now(),l={...c.value,conflicts:[...c.value.conflicts,structuredClone(s)],modified:u};return this.apply(e,r,l,n,o,"conflict.proposed",s.conflictId)}validateProposal(e,r){return this.schemas.validate("conflicts-v1.2.schema.json",{schema:{name:"nodegraph-conflicts",version:Se},conflicts:[e],modified:this.clock.now()},r.documents.conflicts)}reclassify(e,r,i,n,o,a,s){return s.type!=="human"?Promise.resolve(V(r.documents.conflicts,a,[et(r.documents.conflicts,i,"reclassify a conflict")])):this.update(e,r,i,a,s,"conflict.reclassified",c=>{let d=c.conflictType;return c.conflictType=n,c.classificationRationale=o,{diagnostics:[],metadata:{previousConflictType:d,conflictType:n}}})}review(e,r,i,n,o,a){return a.type!=="human"?Promise.resolve(V(r.documents.conflicts,o,[et(r.documents.conflicts,i,"review a conflict")])):this.update(e,r,i,o,a,`conflict.${n}`,s=>{let c=this.reviews.transitionResearcherApproval(s.reviewState,n,a,r.documents.conflicts);return c.value?(s.reviewState=c.value,{diagnostics:[]}):{diagnostics:c.diagnostics}})}replaceExplanations(e,r,i,n,o,a){return this.update(e,r,i,o,a,"conflict.explanations-changed",s=>{let c=Fb(s,n,a,r);return c.length?{diagnostics:c}:(s.possibleExplanations=structuredClone(n),{diagnostics:[],metadata:{explanationCount:n.length}})})}async update(e,r,i,n,o,a,s){let c=await this.context(e,r,n);if(!c.value)return c.rejection;let d=structuredClone(c.value),u=d.conflicts.find(p=>p.conflictId===i);if(!u)return V(r.documents.conflicts,n,[ql("missing-conflict-reference",i)]);let l=s(u);return l.diagnostics.length?V(r.documents.conflicts,n,l.diagnostics):(u.modified=this.clock.now(),d.modified=this.clock.now(),this.apply(e,r,d,n,o,a,i,l.metadata))}async context(e,r,i){let n=Et(r,r.documents.conflicts);if(n.length)return{rejection:V(r.documents.conflicts,i,n)};let o=await this.synthesis.readConflicts(e,r);return{value:o.value,rejection:V(r.documents.conflicts,i,o.diagnostics)}}apply(e,r,i,n,o,a,s,c){return Pr(this.synthesis,e,r,r.documents.conflicts,i,n,o,this.clock.now(),a,s,c)}};function Hb(t,e,r){return e.type!=="agent"?[]:[t.reviewState,...t.possibleExplanations.map(n=>n.reviewState)].every(n=>n.origin==="ai"&&n.approval.researcher==="not-reviewed")?[]:[g({layer:"structural",code:"agent-proposal-state-required",file:r,objectId:t.conflictId,rule:"Agent-created conflicts and explanations must remain AI-origin proposals.",action:"Reset researcher approval to not-reviewed and submit the conflict for review."})]}function ql(t,e){return g({layer:"structural",code:t,file:"synthesis conflicts",objectId:e,rule:`${e} does not identify a unique conflict.`,action:"Refresh the conflict list or assign a new stable identifier."})}function Fb(t,e,r,i){return r.type!=="agent"?[]:t.reviewState.approval.researcher==="approved"?[et(i.documents.conflicts,t.conflictId,"change explanations on an approved conflict")]:e.every(n=>n.reviewState.origin==="ai"&&n.reviewState.approval.researcher==="not-reviewed")?[]:[g({layer:"structural",code:"agent-explanation-proposal-required",file:i.documents.conflicts,objectId:t.conflictId,rule:"Agent-created conflict explanations must remain AI-origin proposals.",action:"Reset researcher approval to not-reviewed and submit the explanation for review."})]}var Hn=class{constructor(e,r,i,n=W){this.synthesis=e;this.reviews=r;this.schemas=i;this.clock=n}async propose(e,r,i,n,o){let a=await this.context(e,r,n);if(!a.value)return a.rejection;let s=Vn(r),c=this.validateProposal(i,s);if(c.length)return V(s,n,c);let d=i,u=Lb(d,o,s);if(u.length)return V(s,n,u);let l=structuredClone(a.value),p=l.appraisals.findIndex(m=>m.appraisalId===d.appraisalId);return p>=0?l.appraisals[p]=structuredClone(d):l.appraisals.push(structuredClone(d)),l.modified=this.clock.now(),this.apply(e,r,l,n,o,p>=0?"appraisal.proposal-replaced":"appraisal.proposed",d.appraisalId)}validateProposal(e,r){return this.schemas.validate("evidence-appraisals.schema.json",{schema:{name:"nodegraph-evidence-appraisals",version:Se},appraisals:[e],modified:this.clock.now()},r)}async review(e,r,i,n,o,a){let s=await this.context(e,r,o);if(!s.value)return s.rejection;let c=Vn(r);if(a.type!=="human")return V(c,o,[et(c,i,"review an evidence appraisal")]);let d=structuredClone(s.value),u=d.appraisals.find(p=>p.appraisalId===i);if(!u)return V(c,o,[zb(i)]);let l=this.reviews.transitionResearcherApproval(u.reviewState,n,a,c);return l.value?(u.reviewState=l.value,u.modified=this.clock.now(),d.modified=this.clock.now(),this.apply(e,r,d,o,a,`appraisal.${n}`,i)):V(c,o,l.diagnostics)}async context(e,r,i){let n=Vn(r),o=Et(r,n);if(o.length)return{rejection:V(n,i,o)};let a=await this.synthesis.readAppraisals(e,r);return{value:a.value,rejection:V(n,i,a.diagnostics)}}apply(e,r,i,n,o,a,s){return Pr(this.synthesis,e,r,Vn(r),i,n,o,this.clock.now(),a,s)}};function Vn(t){return t.documents.appraisals??"synthesis/evidence-appraisals-v1.2.json"}function Lb(t,e,r){return e.type!=="agent"?[]:t.reviewState.origin==="ai"&&t.reviewState.approval.researcher==="not-reviewed"&&t.reviewState.approval.advisor==="not-reviewed"?[]:[g({layer:"structural",code:"agent-proposal-state-required",file:r,objectId:t.appraisalId,rule:"Agent-created appraisals must remain AI-origin proposals.",action:"Set approval to not-reviewed and submit the appraisal for researcher review."})]}function zb(t){return g({layer:"structural",code:"missing-appraisal-reference",file:"evidence appraisals",objectId:t,rule:"The requested evidence appraisal does not exist.",action:"Refresh the appraisal queue and choose an existing record."})}var Bb=new Set(["supports","partially-supports","extends","replicates"]),Ub=new Set(["contradicts","fails-to-replicate","qualifies"]),Fn=class{evaluate(e){let r=Gb(e),i=Wb(e,r);return{policyId:zs,policyVersion:Bs,label:i.label,inputs:{findingRefs:structuredClone(e.claim.findingRefs),appraisalIds:r.appraisals.map(n=>n.appraisalId),supportingStudyCount:r.supportingPaperIds.length,dissentingStudyCount:r.dissentingPaperIds.length,targetPopulationRelevance:r.appraisals.map(n=>n.fields.targetPopulationRelevance.status),methodologicalLimitations:r.appraisals.map(n=>n.fields.methodologicalLimitations.status),unresolvedConflict:r.unresolvedConflict,crossParadigmDecision:e.claim.paradigmDecision.status,staleCount:r.staleCount,disputedCount:r.disputedCount,rejectedCount:r.rejectedCount,missingInputCount:r.missingInputCount},reasons:i.reasons,limitations:rI(r.appraisals),freshness:Hl(e),stale:!1,staleReasons:[],calculatedAt:e.calculatedAt}}staleReasons(e,r){let i=Hl({...r,calculatedAt:e.calculatedAt});return iI(e.freshness,i)}};function Gb(t){let e=Vl(t.claim,Bb),r=Vl(t.claim,Ub),i=[...new Set(t.claim.findingRefs.map(u=>u.paperId))],o=i.flatMap(u=>t.appraisals.filter(l=>l.paperId===u)).filter(u=>Kb(u,t)),a=Xb(t),s=Qb(t),c=i.filter(u=>!o.some(l=>l.paperId===u)).length,d=o.filter(u=>u.fields.targetPopulationRelevance.status!=="present"||u.fields.methodologicalLimitations.status!=="present").length;return{supportingPaperIds:e,dissentingPaperIds:r,appraisals:o,missingInputCount:c+d+a.missing+s.missing,staleCount:a.stale,disputedCount:a.disputed+s.disputed+(t.claim.reviewState.verification.classification==="disputed"?1:0),rejectedCount:a.rejected+s.rejected,unresolvedConflict:t.conflicts.some(u=>u.reviewState.approval.researcher!=="approved"),highRelevance:o.some(u=>zt(u.fields.targetPopulationRelevance.normalizedValue)==="high"),allLowRelevance:o.length>0&&o.every(u=>zt(u.fields.targetPopulationRelevance.normalizedValue)==="low"),allMajorLimitations:o.length>0&&o.every(u=>["major","high"].includes(zt(u.fields.methodologicalLimitations.normalizedValue))),adequateValidity:o.some(u=>["adequate","strong","high","valid"].includes(zt(u.fields.measurementValidity.normalizedValue))||["adequate","strong","high","reliable"].includes(zt(u.fields.reliability.normalizedValue))),strongerDissent:tI(r,o)}}function Wb(t,e){return Yb(t,e)?{label:"not-assessed",reasons:["Required current evidence, reviewed appraisal inputs, or a cross-paradigm decision are unavailable."]}:e.strongerDissent||e.allLowRelevance||e.allMajorLimitations?{label:"low",reasons:[Jb(e)]}:e.supportingPaperIds.length>=2&&e.dissentingPaperIds.length===0&&!e.unresolvedConflict&&e.highRelevance&&e.adequateValidity?{label:"high",reasons:["Multiple current studies provide relevant support without unresolved dissent, and reviewed validity or reliability is adequate."]}:{label:"moderate",reasons:["Minimum evidence and appraisal inputs are available, but the high-confidence rule is not fully satisfied."]}}function Yb(t,e){return e.supportingPaperIds.length===0||e.missingInputCount>0||e.staleCount>0||e.rejectedCount>0||t.claim.paradigmDecision.required&&t.claim.paradigmDecision.status!=="approved"}function Jb(t){return t.strongerDissent?"Reviewed, relevant dissent with fewer reported limitations prevents a majority from determining confidence.":t.allLowRelevance?"All reviewed evidence has low relevance to the target population.":"All reviewed supporting studies report major methodological limitations."}function Vl(t,e){return[...new Set(t.findingRefs.filter(r=>e.has(r.relationship)).map(r=>r.paperId))]}function Kb(t,e){let r=e.manifest.papers.find(n=>n.paperId===t.paperId),i=e.extractions.get(t.paperId);return t.reviewState.approval.researcher==="approved"&&r?.source.sourceDocumentHash===t.sourceDocumentHash&&i!==void 0&&t.extractionRevision===Ll(i)}function Xb(t){let e=new Map(t.evidence.map(i=>[i.evidenceId,i])),r=t.claim.evidenceRefs.map(i=>e.get(i));return{missing:r.filter(i=>!i).length+Zb(t),stale:r.filter(i=>i?.reviewState.verification.source==="stale").length+eI(t),disputed:r.filter(i=>i?.reviewState.verification.classification==="disputed").length,rejected:r.filter(i=>i?.reviewState.verification.source==="rejected"||i?.reviewState.verification.interpretation==="rejected").length}}function Qb(t){let e=t.claim.findingRefs.map(r=>t.extractions.get(r.paperId)?.fields.findings.items?.find(i=>i.findingId===r.findingId));return{missing:e.filter(r=>!r).length,disputed:e.filter(r=>r?.reviewState.verification.classification==="disputed").length,rejected:e.filter(r=>r?.reviewState.verification.interpretation==="rejected").length}}function Zb(t){return Fl(t.claim).filter(e=>!t.currentSourceHashes[e]).length}function eI(t){return Fl(t.claim).filter(e=>{let r=t.manifest.papers.find(n=>n.paperId===e)?.source.sourceDocumentHash,i=t.currentSourceHashes[e];return!!(r&&i&&r!==i)}).length}function Fl(t){return[...new Set(t.findingRefs.map(e=>e.paperId))]}function tI(t,e){return t.some(r=>{let i=e.find(a=>a.paperId===r);if(!i)return!1;let n=zt(i.fields.targetPopulationRelevance.normalizedValue),o=zt(i.fields.methodologicalLimitations.normalizedValue);return n==="high"&&!["major","high"].includes(o)})}function rI(t){return t.flatMap(e=>{let r=e.fields.methodologicalLimitations;return r.status==="present"&&r.sourceText?[r.sourceText]:[]})}function Hl(t){return{sourceDocumentHashes:Object.fromEntries(t.manifest.papers.map(e=>[e.paperId,t.currentSourceHashes[e.paperId]??e.source.sourceDocumentHash])),extractionRevisions:Object.fromEntries([...t.extractions].map(([e,r])=>[e,Ll(r)])),appraisalsRevision:t.appraisalsRevision,conflictsRevision:t.conflictsRevision,taxonomyVersion:t.taxonomyVersion}}function iI(t,e){let r=[];return JSON.stringify(t.sourceDocumentHashes)!==JSON.stringify(e.sourceDocumentHashes)&&r.push("source-document-hash-changed"),JSON.stringify(t.extractionRevisions)!==JSON.stringify(e.extractionRevisions)&&r.push("extraction-revision-changed"),t.appraisalsRevision!==e.appraisalsRevision&&r.push("appraisals-revision-changed"),t.conflictsRevision!==e.conflictsRevision&&r.push("conflicts-revision-changed"),t.taxonomyVersion!==e.taxonomyVersion&&r.push("taxonomy-version-changed"),r}function Ll(t){return S(t)}function zt(t){return t?.trim().toLocaleLowerCase("en-US")??""}var Ln=class{compare(e,r,i){return i.map(n=>{let o=e.map(a=>nI(a,r.get(a.paperId),n));return{contextComparisonId:uI(n),dimension:n,values:o,result:cI(o),causalInference:!1,reviewState:He("imported")}})}};function nI(t,e,r){let i=e?oI(e,r):void 0;return{paperId:t.paperId,findingId:t.findingId,reportingStatus:i?.reportingStatus??"not-extracted",...i?.sourceText?{sourceValue:i.sourceText}:{},...i?.normalizedValue?{normalizedValue:i.normalizedValue}:{}}}function oI(t,e){if(e==="population")return t.fields.population;if(e==="setting")return t.fields.setting;if(e==="team-or-sample-characteristics")return aI(t);if(e==="methodological-paradigm")return sI(t);if(e==="research-approach")return zl(t.methodology.researchApproach);if(e==="analytical-technique")return zl(t.methodology.analyticalTechnique)}function aI(t){let e=t.methodology.sampleCharacteristics;return{reportingStatus:e.reportingStatus,...e.sourceText?{sourceText:e.sourceText}:{},...e.unitOfAnalysis?{normalizedValue:e.unitOfAnalysis}:{}}}function sI(t){let e=t.methodology.methodologicalParadigm;return{reportingStatus:e.reportingStatus,...e.sourceTerm?{sourceText:e.sourceTerm}:{},...e.paradigmId?{normalizedValue:e.paradigmId}:{}}}function zl(t){return{reportingStatus:t.reportingStatus,...t.sourceTerm?{sourceText:t.sourceTerm}:{},...t.normalizedValue?{normalizedValue:t.normalizedValue}:{}}}function cI(t){let e=t.map(i=>i.reportingStatus);if(e.includes("unclear"))return"unclear";if(e.includes("not-reported"))return"not-reported";if(e.some(dI))return"missing";let r=t.map(i=>lI(i.normalizedValue??i.sourceValue??""));return new Set(r).size===1?"same":"different"}function dI(t){return t!=="present"}function uI(t){return`context_${t.replace(/-/g,"_")}`}function lI(t){return t.trim().normalize("NFC").toLocaleLowerCase("en-US")}var Wl=require("crypto");var Yl=require("fs/promises");var pI=new Set(["supports","partially-supports","extends","replicates"]),fI=new Set(["contradicts","qualifies","fails-to-replicate","uses-different-definition","uses-different-population","uses-different-method"]),zn=class{constructor(e,r,i,n,o,a,s=W){this.paths=e;this.schemas=r;this.writer=i;this.synthesis=n;this.integrity=o;this.confidence=a;this.clock=s}async open(e,r){if(!r.documents.claimLedgerIndex)return{diagnostics:[EI()],paperGraphHydrationCount:0};let i=await this.synthesis.readDocument(e,r.documents.claimLedgerIndex,"claim-ledger-index.schema.json");if(!i.value)return this.rebuild(e,r);let n=await this.readFreshness(e,r);return n.values?xI(i.value,n.values)?{index:i.value,diagnostics:n.diagnostics,paperGraphHydrationCount:0}:this.rebuild(e,r):{diagnostics:n.diagnostics,paperGraphHydrationCount:0}}async rebuild(e,r){let i=await this.readSource(e,r,!0);if(!i.values||D(i.diagnostics))return{diagnostics:i.diagnostics,paperGraphHydrationCount:0};let n=mI(i.values,this.clock.now(),this.confidence),o=this.schemas.validate("claim-ledger-index.schema.json",n,r.documents.claimLedgerIndex);if(D(o))return{diagnostics:[...i.diagnostics,...o],paperGraphHydrationCount:0};let a=await this.paths.resolve(e,r.documents.claimLedgerIndex);return await this.writer.write(a,n),{index:n,diagnostics:[...i.diagnostics,...o],paperGraphHydrationCount:0}}async hydrate(e,r,i){let[n,o,a,s,c]=await Promise.all([this.synthesis.readClaims(e,r),this.synthesis.readConflicts(e,r),this.synthesis.readAppraisals(e,r),this.synthesis.readEvidence(e,r),this.synthesis.readTaxonomy(e,r)]),d=n.value?.claims.find(h=>h.claimId===i);if(!d||!n.value||!o.value||!a.value||!s.value||!c.value)return;let u=await SI(this.synthesis,e,r,d),l=await bs(this.integrity,e,r),p=new Map(s.value.evidence.map(h=>[h.evidenceId,h])),m={manifest:r,claims:n.value,conflicts:o.value,appraisals:a.value,evidence:s.value,taxonomyVersion:c.value.taxonomyVersion,extractions:u.values,currentSourceHashes:l.values,sourceFileHashes:{}};return{claim:wI(this.confidence,m,d),conflicts:o.value.conflicts.filter(h=>h.claimId===i),appraisals:a.value.appraisals.filter(h=>d.findingRefs.some(f=>f.paperId===h.paperId)),findings:d.findingRefs.flatMap(h=>{let f=u.values.get(h.paperId),v=f?.fields.findings.items?.find(I=>I.findingId===h.findingId),y=r.papers.find(I=>I.paperId===h.paperId);return!f||!v||!y?[]:[{paperId:h.paperId,paperTitle:y.source.title??h.paperId,relationship:h.relationship,paperMetadata:{...y.source.doi?{doi:y.source.doi}:{},...y.source.version?{sourceVersion:y.source.version}:{}},finding:v,population:f.fields.population,setting:f.fields.setting,methodology:f.methodology,evidence:v.evidenceIds.flatMap(I=>{let P=p.get(I);return P?[P]:[]})}]}),revisions:{claims:S(n.value),conflicts:S(o.value),appraisals:S(a.value)},diagnostics:[...n.diagnostics,...o.diagnostics,...a.diagnostics,...s.diagnostics,...c.diagnostics,...u.diagnostics,...l.diagnostics]}}async readSource(e,r,i){let[n,o,a,s,c]=await Promise.all([this.synthesis.readClaims(e,r),this.synthesis.readConflicts(e,r),this.synthesis.readAppraisals(e,r),this.synthesis.readEvidence(e,r),this.synthesis.readTaxonomy(e,r)]),d=i?await PI(this.synthesis,e,r):{values:new Map,diagnostics:[]},[u,l]=await Promise.all([bs(this.integrity,e,r),Ul(this.paths,e,r)]),p=[...n.diagnostics,...o.diagnostics,...a.diagnostics,...s.diagnostics,...c.diagnostics,...d.diagnostics,...u.diagnostics,...l.diagnostics];return!n.value||!o.value||!a.value||!s.value||!c.value?{diagnostics:p}:{values:{manifest:r,claims:n.value,conflicts:o.value,appraisals:a.value,evidence:s.value,taxonomyVersion:c.value.taxonomyVersion,extractions:d.values,currentSourceHashes:u.values,sourceFileHashes:l.values},diagnostics:p}}async readFreshness(e,r){let[i,n]=await Promise.all([bs(this.integrity,e,r),Ul(this.paths,e,r)]),o=[...i.diagnostics,...n.diagnostics];return D(o)?{diagnostics:o}:{values:{manifestRevision:S(r),sourceDocumentHashes:i.values,sourceFileHashes:n.values},diagnostics:o}}};function mI(t,e,r){return{schema:{name:"nodegraph-claim-ledger-index",version:Se},generatedAt:e,manifestRevision:S(t.manifest),claimsRevision:S(t.claims),conflictsRevision:S(t.conflicts),appraisalsRevision:S(t.appraisals),taxonomyVersion:t.taxonomyVersion,sourceDocumentHashes:t.currentSourceHashes,sourceFileHashes:t.sourceFileHashes,extractionRevisions:Object.fromEntries([...t.extractions].map(([i,n])=>[i,S(n)])),entries:t.claims.claims.map(i=>hI(t,i,r))}}function hI(t,e,r){let i=t.conflicts.conflicts.filter(o=>o.claimId===e.claimId),n=Jl(r,t,e).length>0;return{claimId:e.claimId,text:e.text,claimType:e.claimType,supportingPaperIds:Bl(e,pI),dissentingPaperIds:Bl(e,fI),conflictTypes:[...new Set(i.map(o=>o.conflictType))],conflictReviewStates:i.map(o=>o.reviewState.approval.researcher),contextSummary:gI(i),confidenceLabel:e.confidence?.label??"not-assessed",confidenceStale:n,confidenceExplanationAvailable:!!e.confidence,reviewState:e.reviewState,origin:e.reviewState.origin,warnings:vI(t,e,i,n)}}function Bl(t,e){return[...new Set(t.findingRefs.filter(r=>e.has(r.relationship)).map(r=>r.paperId))]}function gI(t){return t.flatMap(e=>e.contextComparisons.map(r=>`${r.dimension}: ${r.result}`))}function vI(t,e,r,i){let n=[];e.reviewState.origin==="ai"&&e.reviewState.approval.researcher!=="approved"&&n.push("ai-proposal"),e.reviewState.verification.classification==="disputed"&&n.push("disputed-classification"),e.paradigmDecision.required&&e.paradigmDecision.status!=="approved"&&n.push("cross-paradigm-decision-required"),r.some(a=>a.reviewState.approval.researcher!=="approved")&&n.push("unresolved-conflict"),i&&n.push("stale-confidence");let o=new Map(t.evidence.evidence.map(a=>[a.evidenceId,a]));return e.evidenceRefs.some(a=>{let s=o.get(a)?.reviewState.verification.source;return!s||s==="stale"||s==="rejected"})&&n.push("invalid-evidence"),yI(t,e)&&n.push("disputed-finding-classification"),n}function yI(t,e){return e.findingRefs.some(r=>t.extractions.get(r.paperId)?.fields.findings.items?.find(i=>i.findingId===r.findingId)?.reviewState.verification.classification==="disputed")}function Jl(t,e,r){if(!r.confidence)return[];let i=t.staleReasons(r.confidence,{claim:r,conflicts:e.conflicts.conflicts.filter(o=>o.claimId===r.claimId),appraisals:e.appraisals.appraisals,evidence:e.evidence.evidence,extractions:e.extractions,manifest:e.manifest,appraisalsRevision:S(e.appraisals),conflictsRevision:S(e.conflicts),taxonomyVersion:e.taxonomyVersion,currentSourceHashes:e.currentSourceHashes});if(!r.confidence.stale)return i;let n=r.confidence.staleReasons.length?r.confidence.staleReasons:["stored-confidence-stale"];return[...new Set([...n,...i])]}function wI(t,e,r){let i=Jl(t,e,r);return!r.confidence||!i.length?r:{...r,confidence:{...r.confidence,stale:!0,staleReasons:i}}}function xI(t,e){return t.manifestRevision===e.manifestRevision&&Gl(t.sourceDocumentHashes,e.sourceDocumentHashes)&&Gl(t.sourceFileHashes,e.sourceFileHashes)}async function PI(t,e,r){let i=await Promise.all(r.papers.map(async n=>({paperId:n.paperId,read:await t.readExtraction(e,n)})));return{values:new Map(i.flatMap(n=>n.read.value?[[n.paperId,n.read.value]]:[])),diagnostics:i.flatMap(n=>n.read.diagnostics)}}async function bs(t,e,r){let i=[];for(let n of r.papers)i.push({paper:n,result:await t.inspectSource(e,n)});return{values:Object.fromEntries(i.map(({paper:n,result:o})=>[n.paperId,o.currentHash??n.source.sourceDocumentHash])),diagnostics:i.flatMap(n=>n.result.diagnostics)}}async function Ul(t,e,r){let i=[];for(let o of bI(r))try{let a=await t.resolve(e,o,!0);i.push({relativePath:o,hash:II(await(0,Yl.readFile)(a))})}catch{i.push({relativePath:o})}let n=i.filter(o=>!o.hash);return{values:Object.fromEntries(i.flatMap(o=>o.hash?[[o.relativePath,o.hash]]:[])),diagnostics:n.map(o=>jI(o.relativePath))}}function bI(t){return[t.documents.claims,t.documents.conflicts,t.documents.appraisals,t.documents.evidence,t.documents.constructs,...t.papers.flatMap(e=>e.extractionPath?[e.extractionPath]:[])]}function II(t){return`sha256:${(0,Wl.createHash)("sha256").update(t).digest("hex")}`}function Gl(t,e){return JSON.stringify(t)===JSON.stringify(e)}async function SI(t,e,r,i){let n=new Set(i.findingRefs.map(s=>s.paperId)),o=r.papers.filter(s=>n.has(s.paperId)),a=await Promise.all(o.map(async s=>({paperId:s.paperId,read:await t.readExtraction(e,s)})));return{values:new Map(a.flatMap(s=>s.read.value?[[s.paperId,s.read.value]]:[])),diagnostics:a.flatMap(s=>s.read.diagnostics)}}function EI(){return g({layer:"structural",code:"phase3-document-not-registered",file:"project.nodegraph.json",objectId:"claimLedgerIndex",rule:"The disposable claim-ledger index is not registered.",action:"Run the explicit Phase 3 project migration."})}function jI(t){return g({layer:"integrity",code:"missing-ledger-source",file:t,rule:"A file needed to check or rebuild the claim ledger is unavailable.",action:"Restore the file or repair its project registration before opening the ledger."})}function Kl(t){let e=t.clock??W,r=new Mi,i=new $n(t.schemaRoot,t.legacySchemaPath),n=t.writer??new xi,o=new bi(r,i,e),a=new Vi(r,i),s=new Ji,c=new Ti(r,i,n,o,s),d=new Ii,u=new ji(d),l=new An(r,i,c,u),p=new ki(r,a,l,o),m=new Ui(r,i,n,c,e),h=new _i(r,i,n,o,a,l,p,e),f=new Yi(a,l,d),v=new Ki(r,i,n,c,l,u,e),y=new Ci(i,l),I=new Tn(l,d,s,e),P=new On(r,l,p,s,e),j=new qi,b=new Nn(l,s,i,e),ae=new qn(l,s,i,e),A=new Hn(l,s,i,e),re=new Fn,Gt=new Ln,jt=new zn(r,i,n,l,p,re,e);return{paths:r,schemas:i,audit:o,papers:a,registry:m,synthesis:l,integrity:p,indexes:h,queries:f,reviews:s,migrations:v,extractions:y,taxonomy:I,verification:P,csv:j,claims:b,conflicts:ae,appraisals:A,confidence:re,contextComparisons:Gt,claimLedger:jt}}var Bn=L(require("path"));var fe=class extends Error{constructor(r,i,n=[],o){super(i);this.code=r;this.diagnostics=n;this.cause=o}},Xl={type:"human",id:"researcher"},Un=class{constructor(e){this.runtime=e}create(e,r,i){return this.runtime.registry.create(e,r,i)}open(e){return this.runtime.papers.resetInstrumentation(),this.runtime.registry.open(e)}async validate(e){let r=await this.open(e);if(!r.manifest)return{valid:!1,diagnostics:r.diagnostics};let i=await this.runtime.integrity.validate(Bn.dirname(e),r.manifest),n=[...r.diagnostics,...i.diagnostics];return{valid:!D(n),diagnostics:n}}async rebuildIndexes(e,r=!1){let i=await this.openWritableProject(e);return this.runtime.indexes.rebuild(i.root,i.opened.manifest,r)}async search(e,r){let i=await this.open(e);return i.paperIndex?this.runtime.queries.search(i.paperIndex,r):[]}async registerPaper(e,r,i=Xl){let n=await this.openWritableProject(e),o=await this.buildRegistration(n.root,r),a=await this.runtime.registry.registerPaper(n.root,n.opened.manifest,o,n.opened.manifestRevision,i);return a.accepted?this.rebuildAfterMutation(e,a):{mutation:a,diagnostics:a.diagnostics??[]}}async unregisterPaper(e,r,i=Xl){let n=await this.openWritableProject(e),o=await this.runtime.registry.unregisterPaper(n.root,n.opened.manifest,r,n.opened.manifestRevision,i);return o.accepted?this.rebuildAfterMutation(e,o):{mutation:o,diagnostics:o.diagnostics??[]}}async openWritableProject(e){let r=await this.open(e);if(!r.manifest||!r.manifestRevision)throw new fe("project-manifest-invalid","The project manifest is invalid.",r.diagnostics);if(r.mode==="read-only")throw new fe("project-read-only","The project is read-only until its reported errors are corrected.",r.diagnostics);return{root:Bn.dirname(e),opened:{...r,manifest:r.manifest,manifestRevision:r.manifestRevision}}}async buildRegistration(e,r){let i=CI(r),n=await this.readRegistrationGraph(e,i);if(!n.graph||D(n.diagnostics))throw new fe("invalid-paper-graph","The paper graph cannot be registered until its errors are corrected.",n.diagnostics);let o=await this.buildSource(e,r,n.graph);return{paperId:r.paperId,path:r.paperPath,source:o,extractionPath:`extractions/${r.paperId}.json`}}async readRegistrationGraph(e,r){try{return await this.runtime.papers.read(e,r)}catch(i){throw MI(i,r.path)}}async buildSource(e,r,i){let n=await this.identifySource(e,r,i.source?.pdf);return{sourceId:r.sourceId,...n,...i.source?.doi?{doi:i.source.doi}:{},title:i.title,...r.sourceVersion?{version:r.sourceVersion}:{}}}async identifySource(e,r,i){try{if(r.sourcePath)return await this.runtime.integrity.identifyProjectSource(e,r.sourcePath);if(!i)throw DI(r.paperPath);return await this.runtime.integrity.identifyPaperSource(e,r.paperPath,i)}catch(n){throw n instanceof fe?n:RI(n,r.sourcePath??i??r.paperPath)}}async rebuildAfterMutation(e,r){let i=await this.open(e);if(!i.manifest)return{mutation:r,project:i,diagnostics:i.diagnostics};try{let n=await this.runtime.indexes.rebuild(Bn.dirname(e),i.manifest);return{mutation:r,indexes:n,project:i,diagnostics:n.diagnostics}}catch(n){let o=Is(n);return{mutation:r,project:i,diagnostics:o.diagnostics,indexFailure:o}}}};function CI(t){return{paperId:t.paperId,path:t.paperPath,source:{sourceId:t.sourceId,relativePath:t.sourcePath??t.paperPath,sourceDocumentHash:`sha256:${"0".repeat(64)}`}}}function DI(t){return new fe("paper-source-path-required","The paper graph does not identify its source PDF.",[g({layer:"structural",code:"paper-source-path-required",file:t,rule:"A registered paper must identify a source PDF.",action:"Add source.pdf to the paper graph or provide a project-relative source path."})])}function RI(t,e){let r=t instanceof ce?t.code:void 0,i=ve(t,"ENOENT"),n=r??(i?"missing-source-file":"inaccessible-source-file");return new fe(n,"The paper source could not be registered.",[g({layer:r?"structural":"integrity",code:n,file:e,rule:r?"The source path is not a contained project-relative path.":"The source PDF cannot be read.",action:r?"Choose a PDF inside the project and use its project-relative path.":"Restore read access to the source PDF before registering the paper."})],t)}function MI(t,e){let r=t instanceof ce?t.code:void 0,i=ve(t,"ENOENT"),n=r??(i?"missing-paper-file":"inaccessible-paper-file");return new fe(n,"The paper graph could not be registered.",[g({layer:r?"structural":"integrity",code:n,file:e,rule:r?"The paper graph path is not a contained project-relative path.":"The paper graph cannot be read.",action:r?"Choose a paper graph inside the project.":"Restore read access to the paper graph before registering it."})],t)}function Is(t){return new fe("index-rebuild-failed","The authoritative mutation committed, but its derived indexes could not be rebuilt.",[g({layer:"integrity",code:"index-rebuild-failed",file:"indexes",rule:"The authoritative mutation committed, but its derived indexes could not be rebuilt.",action:"Correct the reported file problem and rebuild the disposable indexes."})],t)}var Oe=L(require("path")),Y=L(require("vscode"));function Zl(t,e){let r=Y.window.createOutputChannel("NodeGraph Projects");t.subscriptions.push(r,Y.commands.registerCommand("nodegraph.project.create",i=>X(r,()=>_I(e,r,i))),Y.commands.registerCommand("nodegraph.project.open",i=>X(r,()=>$I(e,r,i))),Y.commands.registerCommand("nodegraph.project.registerPaper",i=>X(r,()=>kI(e,r,i))),Y.commands.registerCommand("nodegraph.project.unregisterPaper",i=>X(r,()=>AI(e,r,i))),Y.commands.registerCommand("nodegraph.project.validate",i=>X(r,()=>TI(e,r,i))),Y.commands.registerCommand("nodegraph.project.rebuildIndexes",i=>X(r,()=>OI(e,r,i))),Y.commands.registerCommand("nodegraph.project.search",i=>X(r,()=>NI(e,r,i))))}async function _I(t,e,r){let i=r??await qI("Choose a folder for the NodeGraph project");if(!i)return;let n=await Y.window.showInputBox({prompt:"Project ID",value:`project_${Oe.basename(i.fsPath).replace(/[^A-Za-z0-9_-]/g,"_")}`,validateInput:LI});if(!n)return;let o=await Y.window.showInputBox({prompt:"Project title"});if(!o)return;let a=await t.create(i.fsPath,n,o);Ss(e,a)}async function $I(t,e,r){let i=await Z(r);i&&Ss(e,await t.open(i.fsPath))}async function kI(t,e,r){let i=await Z(r);if(!i)return;let n=await VI(Oe.dirname(i.fsPath));if(!n)return;let o=await Y.window.showInputBox({prompt:"Stable paper ID",value:`paper_${Oe.basename(n.fsPath,".nodegraph.json").replace(/[^A-Za-z0-9_-]/g,"_")}`,validateInput:d=>/^paper_[A-Za-z0-9_-]+$/.test(d)?void 0:"Use paper_<letters, numbers, _ or ->"});if(!o)return;let a=await Y.window.showInputBox({prompt:"Stable source ID",value:`source_${o.slice(6)}`,validateInput:d=>/^source_[A-Za-z0-9_-]+$/.test(d)?void 0:"Use source_<letters, numbers, _ or ->"});if(!a)return;let s=zI(Oe.dirname(i.fsPath),n.fsPath),c=await t.registerPaper(i.fsPath,{paperId:o,paperPath:s,sourceId:a});ep(e,c)}async function AI(t,e,r){let i=await Z(r);if(!i)return;let n=await t.open(i.fsPath);if(!n.manifest)return Ss(e,n);let o=await Y.window.showQuickPick(n.manifest.papers.map(s=>({label:Ql(s.paperId),description:Ql(s.path),paperId:s.paperId})),{placeHolder:"Choose a paper registration to remove"});if(!o)return;let a=await t.unregisterPaper(i.fsPath,o.paperId);ep(e,a)}async function TI(t,e,r){let i=await Z(r);if(!i)return;let n=await t.validate(i.fsPath);me(e,n.diagnostics),Y.window.showInformationMessage(n.valid?"NodeGraph project validation passed.":"NodeGraph project validation found errors.")}async function OI(t,e,r){let i=await Z(r);if(!i)return;let n=await t.rebuildIndexes(i.fsPath,!0);me(e,n.diagnostics),e.appendLine(`Processed: ${n.processedPaperIds.length}; reused: ${n.reusedPaperIds.length}; removed: ${n.removedPaperIds.length}`),e.show(!0)}async function NI(t,e,r){let i=await Z(r);if(!i)return;let n=await Y.window.showInputBox({prompt:"Search indexed paper metadata"});if(n===void 0)return;let o=await t.search(i.fsPath,{text:n});e.appendLine(`Search results: ${o.length}`);for(let a of o)e.appendLine(`${te(a.paperId)} | ${te(a.title)} | ${te(a.paperPath)}`);e.show(!0)}async function Z(t){return t?.fsPath.endsWith("project.nodegraph.json")?t:(await Y.window.showOpenDialog({canSelectMany:!1,filters:{"NodeGraph Project":["json"]},title:"Open project.nodegraph.json"}))?.[0]}async function qI(t){return(await Y.window.showOpenDialog({canSelectFolders:!0,canSelectFiles:!1,canSelectMany:!1,title:t}))?.[0]}async function VI(t){return(await Y.window.showOpenDialog({canSelectMany:!1,defaultUri:Y.Uri.file(Oe.join(t,"papers")),filters:{"NodeGraph Paper":["json"]},title:"Register a .nodegraph.json paper"}))?.[0]}async function X(t,e){try{await e()}catch(r){HI(t,r)}}function Ss(t,e){e.manifest&&(t.appendLine(`${te(e.manifest.title)} (${te(e.manifest.projectId)})`),t.appendLine(`Mode: ${e.mode}; registered papers: ${e.manifest.papers.length}; hydrated papers: ${e.hydrationCount}`)),me(t,e.diagnostics),t.show(!0)}function ep(t,e){t.appendLine(e.mutation.accepted?"Mutation accepted.":"Mutation rejected."),me(t,e.diagnostics),t.show(!0)}function HI(t,e){e instanceof fe?(t.appendLine(`[error] ${te(e.code)} | ${te(e.message)}`),me(t,e.diagnostics)):e instanceof _e?t.appendLine(`[error] ${e.code} | ${te(e.targetDocument)} | committed revision ${te(e.resultingRevision)}`):e instanceof lt?(t.appendLine(`[error] ${te(e.code)} | audit log is not writable`),me(t,e.diagnostics)):t.appendLine(`[error] unexpected-project-error | ${te(tp(e))}`),t.show(!0),Y.window.showErrorMessage(FI(e))}function FI(t){return t instanceof _e?"NodeGraph saved the document, but could not record its audit event. Further writes are blocked until the audit log is repaired.":t instanceof lt?"NodeGraph project operation failed: repair or restore the audit log before writing.":t instanceof fe?`NodeGraph project operation failed: ${te(t.message)}`:`NodeGraph project operation failed: ${te(tp(t))}`}function me(t,e){for(let r of e)t.appendLine(`[${r.severity}] ${te(r.code)} | ${te(r.file)} | ${te(r.rule)} | ${te(r.action)}`)}function LI(t){return/^project_[A-Za-z0-9_-]+$/.test(t)?void 0:"Use project_<letters, numbers, _ or ->"}function zI(t,e){return Oe.relative(t,e).split(Oe.sep).join("/")}function Ql(t){return te(t).replace(/\$\(/g,"\uFF04(")}function te(t){return t.replace(/[\u0000-\u001f\u007f]/g," ")}function tp(t){return t instanceof Error?t.message:String(t)}var J=L(require("vscode"));var rp=L(require("path")),Ne=L(require("vscode"));var Gn=class t{constructor(e,r,i,n){this.context=e;this.service=r;this.manifestPath=i;this.panel=n}static{this.panels=new Map}static open(e,r,i){let n=rp.resolve(i),o=t.panels.get(n);if(o){o.panel.reveal(Ne.ViewColumn.One,!1);return}let a=BI(e),s=new t(e,r,n,a);t.panels.set(n,s),s.register()}register(){this.panel.webview.html=GI(this.panel.webview);let e=this.panel.webview.onDidReceiveMessage(i=>this.handleMessage(i)),r=qe.onDidSelectNode(i=>this.handleGraphSelection(i.paperPath,i.nodeId));this.panel.onDidDispose(()=>{e.dispose(),r.dispose(),t.panels.delete(this.manifestPath)})}async handleMessage(e){try{e.type==="ready"&&await this.refresh({}),e.type==="filter"&&await this.refresh(Es(e.filters)),e.type==="openCell"&&await this.openCell(e.paperId,e.constructId),e.type==="openEvidence"&&await this.openEvidence(e.evidenceId),e.type==="focusGraph"&&await this.focusGraph(e.paperId,e.nodeId),e.type==="exportCsv"&&await this.exportCsv(Es(e.filters)),e.type==="verifySource"&&await this.verifySource(e),e.type==="verifyFinding"&&await this.verifyFinding(e),e.type==="verifyMapping"&&await this.verifyMapping(e),e.type==="reviewMapping"&&await this.reviewMapping(e)}catch(r){this.postProblem(UI(r))}}async refresh(e){let r=await this.service.openMatrix(this.manifestPath,e);this.postDiagnostics(r.diagnostics),this.panel.webview.postMessage({type:"matrix",matrix:r.matrix,hydrationCount:r.hydrationCount})}async openCell(e,r){let i=await this.service.hydrateCell(this.manifestPath,e,r);if(!i){this.postProblem("The selected matrix detail is missing or invalid.");return}this.postDiagnostics(i.diagnostics),this.panel.webview.postMessage({type:"detail",detail:i})}async openEvidence(e){let r=await this.service.sourceNavigation(this.manifestPath,e);if(this.postDiagnostics(r.diagnostics),!r.sourcePath||!r.quote){this.postProblem("The source PDF or quotation is unavailable.");return}await Ye.openAndSearch(this.context,Ne.Uri.file(r.sourcePath),r.quote,r.page)}async focusGraph(e,r){let i=await this.service.paperGraphTarget(this.manifestPath,e);i&&qe.focusNode(i,r)||this.postProblem("Open the registered paper graph before focusing this evidence node.")}async handleGraphSelection(e,r){let i=await this.service.locateMatrixCell(this.manifestPath,e,r);if(i){this.panel.webview.postMessage({type:"focusCell",cell:i});return}this.postProblem("The selected graph node has no stable mapping in the current matrix.")}async exportCsv(e){let r=await this.service.exportCsv(this.manifestPath,e);if(this.postDiagnostics(r.diagnostics),!r.csv)return;let i=await Ne.window.showSaveDialog({filters:{CSV:["csv"]},saveLabel:"Export matrix",title:"Export NodeGraph synthesis matrix"});i&&(await Ne.workspace.fs.writeFile(i,Buffer.from(r.csv,"utf8")),Ne.window.showInformationMessage(`Matrix exported: ${i.fsPath}`))}async verifySource(e){let r=await this.service.verifySource(this.manifestPath,e.evidenceId,e.state);await this.refreshAfterReview(e,r)}async verifyFinding(e){let r=await this.service.verifyFinding(this.manifestPath,e.paperId,e.findingId,e.dimension,e.state);await this.refreshAfterReview(e,r)}async verifyMapping(e){let r=await this.service.verifyMappingClassification(this.manifestPath,e.paperId,e.mappingId,e.state);await this.refreshAfterReview(e,r)}async reviewMapping(e){let r=await this.service.reviewMapping(this.manifestPath,e.paperId,e.mappingId,e.decision);await this.refreshAfterReview(e,r)}async refreshAfterReview(e,r){if(this.postDiagnostics(r.diagnostics),!r.mutation.accepted){this.postProblem(`Review was rejected: ${r.mutation.code}`);return}await this.refresh(Es(e.filters)),await this.openCell(e.paperId,e.constructId)}postDiagnostics(e){this.panel.webview.postMessage({type:"diagnostics",diagnostics:e})}postProblem(e){this.panel.webview.postMessage({type:"problem",message:e})}};function BI(t){let e=Ne.window.createWebviewPanel("nodegraph.synthesisMatrix","NodeGraph Synthesis Matrix",Ne.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});return e.iconPath=Ne.Uri.joinPath(t.extensionUri,"resources","icon-hires.png"),e}function Es(t){let e={};Bt(e,"paper",t.paper),Bt(e,"constructId",t.constructId),Bt(e,"paradigm",t.paradigm),Bt(e,"approach",t.approach),Bt(e,"technique",t.technique),Bt(e,"population",t.population),Bt(e,"verification",t.verification);let r=Number(t.publicationYear);return Number.isInteger(r)&&r>0&&(e.publicationYear=r),e}function Bt(t,e,r){typeof r=="string"&&r.trim()&&Object.assign(t,{[e]:r.trim()})}function UI(t){return t instanceof Error?t.message:String(t)}function GI(t){let e=ct();return`<!DOCTYPE html>
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
</html>`}var ip={type:"human",id:"researcher"};function np(t,e){let r=J.window.createOutputChannel("NodeGraph Synthesis");t.subscriptions.push(r,J.commands.registerCommand("nodegraph.project.migratePhase2",i=>X(r,()=>WI(e,r,i))),J.commands.registerCommand("nodegraph.project.importExtraction",i=>X(r,()=>YI(e,r,i))),J.commands.registerCommand("nodegraph.project.openMatrix",i=>X(r,()=>JI(t,e,i))),J.commands.registerCommand("nodegraph.project.verifySources",i=>X(r,()=>KI(t,e,r,i))),J.commands.registerCommand("nodegraph.project.proposeConstruct",i=>X(r,()=>XI(e,r,i))),J.commands.registerCommand("nodegraph.project.reviewConstructs",i=>X(r,()=>QI(e,r,i))))}async function WI(t,e,r){let i=await Z(r);!i||await J.window.showWarningMessage("Upgrade this project from schema 1.0.0 to 1.1.0? The manifest is replaced only after new extraction files validate.",{modal:!0},"Upgrade project")!=="Upgrade project"||mi(e,await t.migrate(i.fsPath))}async function YI(t,e,r){let i=await Z(r);if(!i)return;let n=await J.window.showOpenDialog({canSelectMany:!1,filters:{"NodeGraph extraction":["json"]},title:"Import a validated extraction proposal"});if(!n?.[0])return;let o=await ZI(n[0]);mi(e,await t.importExtraction(i.fsPath,o,ip))}async function JI(t,e,r){let i=await Z(r);i&&Gn.open(t,e,i.fsPath)}async function KI(t,e,r,i){let n=await Z(i);if(!n)return;let o=await e.sourceQueue(n.fsPath);me(r,o.diagnostics);let a=await J.window.showQuickPick(o.items.map(d=>({label:fi(d.paperId),description:fi(`${d.state}${d.stale?" \xB7 stale":""}`),detail:fi(d.quote),item:d})),{placeHolder:"Choose pending evidence to verify at its source"});if(!a)return;let s=await e.sourceNavigation(n.fsPath,a.item.evidenceId);me(r,s.diagnostics),s.sourcePath&&s.quote&&await Ye.openAndSearch(t,J.Uri.file(s.sourcePath),s.quote,s.page);let c=await J.window.showQuickPick([{label:"Confirm quotation",state:"verified"},{label:"Dispute quotation",state:"rejected"}],{placeHolder:"Record source verification independently"});c&&mi(r,await e.verifySource(n.fsPath,a.item.evidenceId,c.state))}async function XI(t,e,r){let i=await Z(r);if(!i)return;let n=await J.window.showInputBox({prompt:"Stable construct ID",validateInput:s=>/^[a-z][a-z0-9-]*$/.test(s)?void 0:"Use lower-case letters, numbers, and hyphens."});if(!n)return;let o=await J.window.showInputBox({prompt:"Construct name"});if(!o)return;let a=await J.window.showInputBox({prompt:"Definition (optional)"});mi(e,await t.proposeConstruct(i.fsPath,{constructId:n,canonicalName:o,...a?{definition:a}:{}},ip))}async function QI(t,e,r){let i=await Z(r);if(!i)return;let n=await t.taxonomy(i.fsPath);me(e,n.diagnostics);let o=n.value?.constructs.filter(c=>c.status==="proposed"&&c.reviewState.approval.researcher==="not-reviewed")??[],a=await J.window.showQuickPick(o.map(c=>({label:fi(c.canonicalName),description:fi(c.constructId),constructId:c.constructId})),{placeHolder:"Choose a proposed construct"});if(!a)return;let s=await J.window.showQuickPick([{label:"Approve construct",value:"approved"},{label:"Reject construct",value:"rejected"}]);s&&mi(e,await t.reviewConstruct(i.fsPath,a.constructId,s.value))}async function ZI(t){let e=await J.workspace.fs.readFile(t);return JSON.parse(Buffer.from(e).toString("utf8"))}function mi(t,e){t.appendLine(e.mutation.accepted?`Accepted: ${e.mutation.targetDocument}`:`Rejected: ${e.mutation.code}`),me(t,e.diagnostics),t.show(!0)}function fi(t){return t.replace(/[\u0000-\u001f\u007f]/g," ").replace(/\$\(/g,"\uFF04(")}var Sr=L(require("path")),ap=require("fs/promises");var br={type:"human",id:"researcher"},Wn=class{constructor(e){this.runtime=e}async migrate(e){let r=await this.runtime.migrations.migratePhase2(e,br);return!r.mutation.accepted||!r.manifest?{mutation:r.mutation,diagnostics:r.diagnostics}:this.rebuildAcceptedMutation(Sr.dirname(e),r.manifest,r.mutation,r.diagnostics,!0)}async importExtraction(e,r,i,n){let o=await this.openWritableProject(e),a=await this.runtime.extractions.read(o.root,o.manifest,r.paperId);if(!a.value)return Ir(`extraction:${r.paperId}`,n??"absent",a.diagnostics);let s=await this.runtime.extractions.importProposal(o.root,o.manifest,r,n??S(a.value),i);return this.rebuildAfterMutation(o,s)}async openMatrix(e,r={}){let i=await this.openWritableProject(e),n=i.opened.paperIndex,o=[...i.opened.diagnostics];if(!n){let s=await this.runtime.indexes.rebuild(i.root,i.manifest,!0);o.push(...s.diagnostics),D(s.diagnostics)||(n=s.paperIndex)}if(!n)return{diagnostics:o,hydrationCount:this.runtime.papers.instrumentation().count};let a=await this.runtime.synthesis.readTaxonomy(i.root,i.manifest);return a.value?{matrix:this.runtime.queries.matrix(n,a.value,r),diagnostics:[...o,...a.diagnostics],hydrationCount:this.runtime.papers.instrumentation().count}:{diagnostics:[...o,...a.diagnostics],hydrationCount:this.runtime.papers.instrumentation().count}}async hydrateCell(e,r,i){let n=await this.openWritableProject(e,!1);return this.runtime.queries.hydrateMatrixCell(n.root,n.manifest,r,i)}async exportCsv(e,r={}){let i=await this.openMatrix(e,r);if(!i.matrix)return{diagnostics:i.diagnostics};let n=await this.runtime.registry.open(e);return n.paperIndex?{csv:this.runtime.csv.export(n.paperIndex,i.matrix),diagnostics:i.diagnostics}:{diagnostics:n.diagnostics}}async sourceQueue(e){let r=await this.openWritableProject(e);return this.runtime.verification.sourceQueue(r.root,r.manifest)}async sourceNavigation(e,r){let i=await this.openWritableProject(e,!1);return this.runtime.verification.sourceNavigation(i.root,i.manifest,r)}async verifySource(e,r,i,n){let o=await this.openWritableProject(e),a=await this.runtime.synthesis.readEvidence(o.root,o.manifest);if(!a.value)return Ir(o.manifest.documents.evidence,n??"absent",a.diagnostics);let s=await this.runtime.verification.updateSourceVerification(o.root,o.manifest,r,i,n??S(a.value),br);return this.rebuildAfterMutation(o,s)}async verifyFinding(e,r,i,n,o,a){let s=await this.openWritableProject(e),c=await this.extractionMutationContext(s,r,a);if(!c.ok)return c.outcome;let d=await this.runtime.verification.updateFindingVerification(s.root,s.manifest,r,i,n,o,c.baseRevision,br);return this.rebuildAfterMutation(s,d)}async verifyMappingClassification(e,r,i,n,o){let a=await this.openWritableProject(e),s=await this.extractionMutationContext(a,r,o);if(!s.ok)return s.outcome;let c=await this.runtime.verification.updateMappingClassification(a.root,a.manifest,r,i,n,s.baseRevision,br);return this.rebuildAfterMutation(a,c)}async reviewMapping(e,r,i,n,o){let a=await this.openWritableProject(e),s=await this.extractionMutationContext(a,r,o);if(!s.ok)return s.outcome;let c=await this.runtime.taxonomy.reviewMapping(a.root,a.manifest,r,i,n,s.baseRevision,br);return this.rebuildAfterMutation(a,c)}async proposeConstruct(e,r,i){let n=await this.openWritableProject(e),o=await this.runtime.synthesis.readTaxonomy(n.root,n.manifest);if(!o.value)return Ir(n.manifest.documents.constructs,"absent",o.diagnostics);let a=await this.runtime.taxonomy.proposeConstruct(n.root,n.manifest,r,S(o.value),i);return this.rebuildAfterMutation(n,a.mutation)}async taxonomy(e){let r=await this.openWritableProject(e,!1);return this.runtime.synthesis.readTaxonomy(r.root,r.manifest)}async reviewConstruct(e,r,i){let n=await this.openWritableProject(e),o=await this.runtime.synthesis.readTaxonomy(n.root,n.manifest);if(!o.value)return Ir(n.manifest.documents.constructs,"absent",o.diagnostics);let a=await this.runtime.taxonomy.reviewConstruct(n.root,n.manifest,r,i,S(o.value),br);return this.rebuildAfterMutation(n,a)}async locateMatrixCell(e,r,i){let n=await this.runtime.registry.open(e);if(!n.manifest||!n.paperIndex)return;let o=Sr.dirname(e),a=await eS(this.runtime,o,n.manifest,r);return a?this.runtime.queries.locateMatrixCell(n.paperIndex,a.path,i):void 0}async paperGraphTarget(e,r){let i=await this.openWritableProject(e,!1),n=i.manifest.papers.find(o=>o.paperId===r);return n?this.runtime.registry.resolveDocument(i.root,n.path,!0):void 0}async openWritableProject(e,r=!0){r&&this.runtime.papers.resetInstrumentation();let i=await this.runtime.registry.open(e);if(!i.manifest)throw new fe("project-manifest-invalid","The project manifest is invalid.",i.diagnostics);if(i.mode==="read-only")throw new fe("project-read-only","The project is read-only until its reported errors are corrected.",i.diagnostics);return{root:Sr.dirname(e),manifest:i.manifest,opened:i}}async extractionMutationContext(e,r,i){let n=e.manifest.papers.find(a=>a.paperId===r);if(!n)return{ok:!1,outcome:Ir("project.nodegraph.json",i??"absent",[])};let o=await this.runtime.synthesis.readExtraction(e.root,n);return o.value?{ok:!0,baseRevision:i??S(o.value)}:{ok:!1,outcome:Ir(n.extractionPath??r,i??"absent",o.diagnostics)}}async rebuildAfterMutation(e,r){return r.accepted?this.rebuildAcceptedMutation(e.root,e.manifest,r):{mutation:r,diagnostics:r.diagnostics??[]}}async rebuildAcceptedMutation(e,r,i,n=[],o=!1){try{let a=await this.runtime.indexes.rebuild(e,r,o);return{mutation:i,diagnostics:[...n,...a.diagnostics]}}catch(a){let s=Is(a);return{mutation:i,diagnostics:[...n,...s.diagnostics],indexFailure:s}}}};async function eS(t,e,r,i){let n=await op(i);for(let o of r.papers){let a=await t.registry.resolveDocument(e,o.path);if(await op(a)===n)return o}}async function op(t){try{return await(0,ap.realpath)(t)}catch{return Sr.resolve(t)}}function Ir(t,e,r){return{mutation:{accepted:!1,code:"phase2-operation-rejected",targetDocument:t,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:r},diagnostics:r}}var Yn=L(require("path"));var at={type:"human",id:"researcher"},tS={type:"service",id:"ConfidenceService"},Jn=class{constructor(e,r=W){this.runtime=e;this.clock=r}async migrate(e){let r=await this.runtime.migrations.migratePhase3(e,at);if(!r.mutation.accepted||!r.manifest)return{mutation:r.mutation,diagnostics:r.diagnostics};let i=await this.runtime.claimLedger.rebuild(Yn.dirname(e),r.manifest);return{mutation:r.mutation,diagnostics:[...r.diagnostics,...i.diagnostics]}}async importClaim(e,r,i,n){let o=await this.openProject(e);if(!o.value)return Me(o.diagnostics,n);let a=await this.runtime.synthesis.readClaims(o.root,o.value);if(!a.value)return Me(a.diagnostics,n);let s=await this.runtime.claims.propose(o.root,o.value,r,n??S(a.value),i);return this.finishMutation(o.root,o.value,s)}async reviewClaim(e,r,i,n){return this.withClaims(e,n,(o,a,s)=>this.runtime.claims.review(o,a,r,i,s,at))}async decideParadigm(e,r,i,n,o){return this.withClaims(e,o,(a,s,c)=>this.runtime.claims.decideParadigm(a,s,r,i,n,c,at))}addClaimRelationship(e,r,i,n,o){return this.withClaims(e,o,(a,s,c)=>this.runtime.claims.addRelationship(a,s,r,i,n,c,at))}removeClaimRelationship(e,r,i,n,o,a){return this.withClaims(e,a,(s,c,d)=>this.runtime.claims.removeRelationship(s,c,r,i,n,o,d,at))}changeClaimRelationship(e,r,i,n,o,a){return this.withClaims(e,a,(s,c,d)=>this.runtime.claims.changeRelationship(s,c,r,i,n,o,d,at))}async importConflict(e,r,i,n){let o=await this.openProject(e);if(!o.value)return Me(o.diagnostics,n);let a=await this.runtime.synthesis.readConflicts(o.root,o.value);if(!a.value)return Me(a.diagnostics,n);let s=await this.runtime.conflicts.propose(o.root,o.value,r,n??S(a.value),i);return this.finishMutation(o.root,o.value,s)}async reclassifyConflict(e,r,i,n,o){return this.withConflicts(e,o,(a,s,c)=>this.runtime.conflicts.reclassify(a,s,r,i,n,c,at))}async reviewConflict(e,r,i,n){return this.withConflicts(e,n,(o,a,s)=>this.runtime.conflicts.review(o,a,r,i,s,at))}replaceConflictExplanations(e,r,i,n,o){return this.withConflicts(e,o,(a,s,c)=>this.runtime.conflicts.replaceExplanations(a,s,r,i,c,n))}async importAppraisal(e,r,i,n){let o=await this.openProject(e);if(!o.value)return Me(o.diagnostics,n);let a=await this.runtime.synthesis.readAppraisals(o.root,o.value);if(!a.value)return Me(a.diagnostics,n);let s=await this.runtime.appraisals.propose(o.root,o.value,r,n??S(a.value),i);return this.finishMutation(o.root,o.value,s)}async reviewAppraisal(e,r,i,n){let o=await this.openProject(e);if(!o.value)return Me(o.diagnostics,n);let a=await this.runtime.synthesis.readAppraisals(o.root,o.value);if(!a.value)return Me(a.diagnostics,n);let s=await this.runtime.appraisals.review(o.root,o.value,r,i,n??S(a.value),at);return this.finishMutation(o.root,o.value,s)}async recalculateConfidence(e,r,i){let n=await this.openProject(e);if(!n.value)return Me(n.diagnostics,i);let o=await this.confidenceSource(n.root,n.value,r);if(!o.value)return Me(o.diagnostics,i);let a=this.runtime.confidence.evaluate({...o.value,manifest:n.value,calculatedAt:this.clock.now()}),s=await this.runtime.claims.setConfidence(n.root,n.value,r,a,i??S(o.value.claims),tS);return this.finishMutation(n.root,n.value,s)}async compareContexts(e,r,i){let n=await this.openProject(e);if(!n.value)return{comparisons:[],diagnostics:n.diagnostics};let o=await this.runtime.synthesis.readClaims(n.root,n.value),a=o.value?.claims.find(c=>c.claimId===r);if(!a)return{comparisons:[],diagnostics:[...o.diagnostics,cp(r)]};let s=await sp(this.runtime,n.root,n.value,new Set(a.findingRefs.map(c=>c.paperId)));return{comparisons:this.runtime.contextComparisons.compare(a.findingRefs,s.values,i),diagnostics:[...o.diagnostics,...s.diagnostics]}}async openLedger(e){this.runtime.papers.resetInstrumentation();let r=await this.openProject(e);if(!r.value)return{diagnostics:r.diagnostics,hydrationCount:0};let i=await this.runtime.claimLedger.open(r.root,r.value);return{ledger:i.index,diagnostics:i.diagnostics,hydrationCount:this.runtime.papers.instrumentation().count}}async hydrateClaim(e,r){let i=await this.openProject(e);return i.value?this.runtime.claimLedger.hydrate(i.root,i.value,r):void 0}async reviewQueues(e){let r=await this.openProject(e);if(!r.value)return{claims:[],conflicts:[],appraisals:[],diagnostics:r.diagnostics};let[i,n,o]=await Promise.all([this.runtime.synthesis.readClaims(r.root,r.value),this.runtime.synthesis.readConflicts(r.root,r.value),this.runtime.synthesis.readAppraisals(r.root,r.value)]);return{claims:i.value?.claims.filter(a=>a.reviewState.approval.researcher==="not-reviewed")??[],conflicts:n.value?.conflicts.filter(a=>a.reviewState.approval.researcher==="not-reviewed")??[],appraisals:o.value?.appraisals.filter(a=>a.reviewState.approval.researcher==="not-reviewed")??[],diagnostics:[...i.diagnostics,...n.diagnostics,...o.diagnostics]}}async sourceNavigation(e,r){let i=await this.openProject(e);return i.value?this.runtime.verification.sourceNavigation(i.root,i.value,r):{diagnostics:i.diagnostics}}async withClaims(e,r,i){let n=await this.openProject(e);if(!n.value)return Me(n.diagnostics,r);let o=await this.runtime.synthesis.readClaims(n.root,n.value);if(!o.value)return Me(o.diagnostics,r);let a=await i(n.root,n.value,r??S(o.value));return this.finishMutation(n.root,n.value,a)}async withConflicts(e,r,i){let n=await this.openProject(e);if(!n.value)return Me(n.diagnostics,r);let o=await this.runtime.synthesis.readConflicts(n.root,n.value);if(!o.value)return Me(o.diagnostics,r);let a=await i(n.root,n.value,r??S(o.value));return this.finishMutation(n.root,n.value,a)}async finishMutation(e,r,i){if(!i.accepted)return{mutation:i,diagnostics:i.diagnostics??[]};try{let n=await this.runtime.claimLedger.rebuild(e,r);return{mutation:i,diagnostics:n.diagnostics}}catch(n){return{mutation:i,diagnostics:[iS(n)]}}}async openProject(e){let r=await this.runtime.registry.open(e);if(!r.manifest)return{root:Yn.dirname(e),diagnostics:r.diagnostics};let i=[...r.diagnostics,...Et(r.manifest,"project.nodegraph.json")];return{root:Yn.dirname(e),...r.manifest.schema.version===G?{value:r.manifest}:{},diagnostics:i}}async confidenceSource(e,r,i){let[n,o,a,s,c]=await Promise.all([this.runtime.synthesis.readClaims(e,r),this.runtime.synthesis.readConflicts(e,r),this.runtime.synthesis.readAppraisals(e,r),this.runtime.synthesis.readEvidence(e,r),this.runtime.synthesis.readTaxonomy(e,r)]),d=n.value?.claims.find(p=>p.claimId===i);if(!d||!n.value||!o.value||!a.value||!s.value||!c.value)return{diagnostics:[...n.diagnostics,...o.diagnostics,...a.diagnostics,...s.diagnostics,...c.diagnostics,...d?[]:[cp(i)]]};let u=await sp(this.runtime,e,r,new Set(d.findingRefs.map(p=>p.paperId))),l=await rS(this.runtime,e,r,new Set(d.findingRefs.map(p=>p.paperId)));return{value:{claims:n.value,claim:d,conflicts:o.value.conflicts.filter(p=>p.claimId===i),appraisals:a.value.appraisals,evidence:s.value.evidence,extractions:u.values,appraisalsRevision:S(a.value),conflictsRevision:S(o.value),taxonomyVersion:c.value.taxonomyVersion,currentSourceHashes:l.values},diagnostics:[...u.diagnostics,...l.diagnostics]}}};async function sp(t,e,r,i){let n=r.papers.filter(a=>i.has(a.paperId)),o=await Promise.all(n.map(async a=>({paperId:a.paperId,read:await t.synthesis.readExtraction(e,a)})));return{values:new Map(o.flatMap(a=>a.read.value?[[a.paperId,a.read.value]]:[])),diagnostics:o.flatMap(a=>a.read.diagnostics)}}async function rS(t,e,r,i){let n=r.papers.filter(a=>i.has(a.paperId)),o=await Promise.all(n.map(async a=>({paperId:a.paperId,result:await t.integrity.inspectSource(e,a)})));return{values:Object.fromEntries(o.flatMap(a=>a.result.currentHash?[[a.paperId,a.result.currentHash]]:[])),diagnostics:o.flatMap(a=>a.result.diagnostics)}}function Me(t,e="absent"){return{mutation:V("project.nodegraph.json",e,t),diagnostics:t}}function cp(t){return g({layer:"structural",code:"missing-claim-reference",file:"synthesis claims",objectId:t,rule:"The requested claim does not exist.",action:"Refresh the claim ledger and choose an existing claim."})}function iS(t){return g({layer:"integrity",severity:"warning",code:"claim-ledger-rebuild-failed",file:"indexes/claims.index.json",rule:`The authoritative mutation committed, but the derived ledger rebuild failed: ${nS(t)}`,action:"Reopen the claim ledger to rebuild it from authoritative records."})}function nS(t){return t instanceof Error?t.message:String(t)}var Q=L(require("vscode"));var up=L(require("path")),st=L(require("vscode"));var Kn=class t{constructor(e,r,i,n){this.context=e;this.service=r;this.manifestPath=i;this.panel=n}static{this.panels=new Map}static open(e,r,i){let n=up.resolve(i),o=t.panels.get(n);if(o)return o.reveal();let a=aS(e),s=new t(e,r,n,a);t.panels.set(n,s),s.register()}reveal(){this.panel.reveal(st.ViewColumn.One,!1),this.refresh().catch(e=>this.postProblem(dp(e)))}register(){this.panel.webview.html=cS(this.panel.webview);let e=this.panel.webview.onDidReceiveMessage(r=>this.handleMessage(r));this.panel.onDidDispose(()=>{e.dispose(),t.panels.delete(this.manifestPath)})}async handleMessage(e){let r=sS(e);if(!r)return this.postProblem("The claim-ledger request was invalid.");try{r.type==="ready"&&await this.refresh(),r.type==="openClaim"&&await this.openClaim(r.claimId),r.type==="openEvidence"&&await this.openEvidence(r.evidenceId),r.type==="reviewClaim"&&await this.reviewClaim(r),r.type==="decideParadigm"&&await this.decideParadigm(r),r.type==="recalculateConfidence"&&await this.recalculateConfidence(r.claimId)}catch(i){this.postProblem(dp(i))}}async refresh(){let e=await this.service.openLedger(this.manifestPath);this.panel.webview.postMessage({type:"ledger",ledger:e.ledger,diagnostics:e.diagnostics,hydrationCount:e.hydrationCount})}async openClaim(e){let r=await this.service.hydrateClaim(this.manifestPath,e);if(!r)return this.postProblem("The selected claim is missing or invalid.");this.panel.webview.postMessage({type:"detail",detail:r})}async openEvidence(e){let r=await this.service.sourceNavigation(this.manifestPath,e);if(!r.sourcePath||!r.quote)return this.postProblem(oS("The source PDF or exact quotation is unavailable",r.diagnostics));await Ye.openAndSearch(this.context,st.Uri.file(r.sourcePath),r.quote,r.page)}async reviewClaim(e){let r=await this.service.reviewClaim(this.manifestPath,e.claimId,e.decision);if(!r.mutation.accepted)return this.postProblem(js("Claim review rejected",r));await this.refresh(),await this.openClaim(e.claimId)}async decideParadigm(e){let r=await st.window.showInputBox({prompt:"Explain the cross-paradigm decision",validateInput:n=>n.trim()?void 0:"Enter a researcher rationale."});if(!r?.trim())return;let i=await this.service.decideParadigm(this.manifestPath,e.claimId,e.decision,r.trim());if(!i.mutation.accepted)return this.postProblem(js("Cross-paradigm decision rejected",i));await this.refresh(),await this.openClaim(e.claimId)}async recalculateConfidence(e){let r=await this.service.recalculateConfidence(this.manifestPath,e);if(!r.mutation.accepted)return this.postProblem(js("Confidence calculation rejected",r));await this.refresh(),await this.openClaim(e)}postProblem(e){this.panel.webview.postMessage({type:"problem",message:e})}};function dp(t){return t instanceof Error?t.message:String(t)}function js(t,e){let r=e.diagnostics[0];return r?`${t}: ${r.rule} ${r.action}`:`${t}: ${e.mutation.accepted?"unknown error":e.mutation.code}`}function oS(t,e){let r=e[0];return r?`${t}: ${r.rule} ${r.action}`:`${t}.`}function aS(t){let e=st.window.createWebviewPanel("nodegraph.claimLedger","NodeGraph Claim Ledger",st.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0});return e.iconPath=st.Uri.joinPath(t.extensionUri,"resources","icon-hires.png"),e}function sS(t){if(!t||typeof t!="object"||!("type"in t))return;let e=t;if(e.type==="ready")return{type:"ready"};if(e.type==="openClaim"&&typeof e.claimId=="string")return{type:"openClaim",claimId:e.claimId};if(e.type==="openEvidence"&&typeof e.evidenceId=="string")return{type:"openEvidence",evidenceId:e.evidenceId};if(e.type==="recalculateConfidence"&&typeof e.claimId=="string")return{type:"recalculateConfidence",claimId:e.claimId};if(e.type==="decideParadigm"&&typeof e.claimId=="string"&&(e.decision==="approved"||e.decision==="rejected"))return{type:"decideParadigm",claimId:e.claimId,decision:e.decision};if(e.type==="reviewClaim"&&typeof e.claimId=="string"&&(e.decision==="approved"||e.decision==="rejected"))return{type:"reviewClaim",claimId:e.claimId,decision:e.decision}}function cS(t){let e=ct();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${e}'; style-src 'nonce-${e}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NodeGraph Claim Ledger</title>
  <style nonce="${e}">
    * { box-sizing: border-box; }
    body { margin: 0; color: var(--vscode-foreground); background: var(--vscode-editor-background); font-family: var(--vscode-font-family); }
    main { display: grid; grid-template-columns: minmax(0, 1fr) 390px; height: 100vh; }
    section, aside { overflow: auto; }
    aside { padding: 14px; border-left: 1px solid var(--vscode-panel-border); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--vscode-panel-border); vertical-align: top; }
    button { color: inherit; background: var(--vscode-button-secondaryBackground); border: 0; padding: 6px 8px; margin: 2px; cursor: pointer; }
    .warning { color: var(--vscode-editorWarning-foreground); }
    .error { color: var(--vscode-editorError-foreground); }
    .subtle { color: var(--vscode-descriptionForeground); }
    article { padding: 8px 0; border-bottom: 1px solid var(--vscode-panel-border); white-space: pre-wrap; }
    @media (max-width: 850px) { main { grid-template-columns: 1fr; } aside { display: none; } }
  </style>
</head>
<body>
  <main><section><div id="status"></div><table id="ledger"></table></section><aside id="detail">Select a claim.</aside></main>
  <script nonce="${e}">
    const vscode = acquireVsCodeApi()
    window.addEventListener('message', event => receive(event.data))
    vscode.postMessage({ type: 'ready' })

    function receive(message) {
      if (message.type === 'ledger') renderLedger(message)
      if (message.type === 'detail') renderDetail(message.detail)
      if (message.type === 'problem') setStatus(message.message, 'error')
    }

    function renderLedger(message) {
      const table = document.getElementById('ledger')
      table.replaceChildren()
      if (!message.ledger) return setStatus(diagnosticText(message.diagnostics), 'error')
      const head = row(['Claim', 'Relationships', 'Conflict', 'Confidence', 'Review'])
      table.appendChild(head)
      message.ledger.entries.forEach(entry => table.appendChild(entryRow(entry)))
      setStatus(message.ledger.entries.length + ' claims \xB7 graph hydration ' + message.hydrationCount)
    }

    function entryRow(entry) {
      const tr = document.createElement('tr')
      const claim = document.createElement('td')
      claim.appendChild(action(entry.text, () => post('openClaim', { claimId: entry.claimId })))
      claim.appendChild(text('div', entry.claimType + ' \xB7 origin ' + entry.origin, 'subtle'))
      tr.appendChild(claim)
      tr.appendChild(text('td', entry.supportingPaperIds.length + ' supporting \xB7 ' + entry.dissentingPaperIds.length + ' dissenting'))
      tr.appendChild(text('td', entry.conflictTypes.join(', ') || 'none'))
      const confidence = text('td', entry.confidenceLabel)
      if (entry.confidenceStale) confidence.appendChild(text('div', 'stale', 'error'))
      tr.appendChild(confidence)
      const review = text('td', entry.reviewState.approval.researcher)
      if (entry.warnings.length) review.appendChild(text('div', entry.warnings.join(', '), 'warning'))
      tr.appendChild(review)
      return tr
    }

    function renderDetail(detail) {
      const panel = document.getElementById('detail')
      panel.replaceChildren()
      panel.appendChild(text('h2', detail.claim.text))
      panel.appendChild(text('p', reviewText(detail.claim.reviewState), 'subtle'))
      panel.appendChild(text('p', paradigmText(detail.claim.paradigmDecision), 'warning'))
      if (detail.claim.paradigmDecision.required) {
        panel.appendChild(action('Approve cross-paradigm synthesis', () => post('decideParadigm', { claimId: detail.claim.claimId, decision: 'approved' })))
        panel.appendChild(action('Reject cross-paradigm synthesis', () => post('decideParadigm', { claimId: detail.claim.claimId, decision: 'rejected' })))
      }
      panel.appendChild(action('Approve claim', () => post('reviewClaim', { claimId: detail.claim.claimId, decision: 'approved' })))
      panel.appendChild(action('Reject claim', () => post('reviewClaim', { claimId: detail.claim.claimId, decision: 'rejected' })))
      panel.appendChild(action('Recalculate confidence', () => post('recalculateConfidence', { claimId: detail.claim.claimId })))
      panel.appendChild(text('h3', 'Confidence'))
      panel.appendChild(text('article', confidenceText(detail.claim.confidence)))
      panel.appendChild(text('h3', 'Findings and exact evidence'))
      detail.findings.forEach(item => panel.appendChild(finding(item)))
      panel.appendChild(text('h3', 'Conflicts and context'))
      detail.conflicts.forEach(item => panel.appendChild(text('article', conflictText(item))))
      panel.appendChild(text('h3', 'Evidence appraisals'))
      detail.appraisals.forEach(item => panel.appendChild(text('article', appraisalText(item))))
      if (detail.diagnostics.length) {
        panel.appendChild(text('h3', 'Integrity and provenance warnings'))
        panel.appendChild(text('article', diagnosticText(detail.diagnostics), 'warning'))
      }
      panel.appendChild(text('h3', 'Current document revisions'))
      panel.appendChild(text('article', JSON.stringify(detail.revisions, null, 2)))
    }

    function finding(item) {
      const article = text('article', item.paperTitle + '\\n' + item.finding.sourceText)
      article.appendChild(text('div', 'Relationship: ' + item.relationship, 'subtle'))
      article.appendChild(text('div', 'DOI: ' + (item.paperMetadata.doi || 'not reported'), 'subtle'))
      article.appendChild(text('div', 'Population: ' + reportedText(item.population), 'subtle'))
      article.appendChild(text('div', 'Setting: ' + reportedText(item.setting), 'subtle'))
      article.appendChild(text('div', 'Paradigm: ' + (item.methodology.methodologicalParadigm.paradigmId || 'not reported'), 'subtle'))
      article.appendChild(text('div', 'Approach: ' + (item.methodology.researchApproach.normalizedValue || item.methodology.researchApproach.sourceTerm || 'not reported'), 'subtle'))
      article.appendChild(text('div', 'Technique: ' + (item.methodology.analyticalTechnique.normalizedValue || item.methodology.analyticalTechnique.sourceTerm || 'not reported'), 'subtle'))
      item.evidence.forEach(evidence => {
        article.appendChild(text('blockquote', evidence.quote.text))
        article.appendChild(action('Open source PDF, p. ' + evidence.locator.page, () => post('openEvidence', { evidenceId: evidence.evidenceId })))
      })
      return article
    }

    function confidenceText(confidence) {
      if (!confidence) return 'not-assessed \xB7 no explanation has been calculated'
      return confidence.label + ' \xB7 ' + confidence.policyId + ' ' + confidence.policyVersion + '\\n' +
        confidence.reasons.join(' ') + '\\nLimitations: ' + confidence.limitations.join(' ') +
        '\\nInputs: ' + JSON.stringify(confidence.inputs) +
        '\\nFreshness: ' + JSON.stringify(confidence.freshness) +
        '\\nCalculated: ' + confidence.calculatedAt +
        (confidence.stale ? '\\nStale: ' + confidence.staleReasons.join(', ') : '')
    }

    function conflictText(conflict) {
      return conflict.conflictType + ' \xB7 ' + reviewText(conflict.reviewState) + '\\n' +
        conflict.findingRefs.map(ref => ref.relationship + ': ' + ref.paperId + '/' + ref.findingId).join('\\n') + '\\n' +
        conflict.contextComparisons.map(item => item.dimension + ': ' + item.result + ' (not causal)').join('\\n') + '\\n' +
        conflict.possibleExplanations.map(item => 'Possible explanation: ' + item.text + ' \xB7 ' + reviewText(item.reviewState)).join('\\n')
    }

    function reviewText(review) {
      return 'origin ' + review.origin + ' \xB7 researcher ' + review.approval.researcher +
        ' \xB7 source ' + review.verification.source + ' \xB7 interpretation ' + review.verification.interpretation +
        ' \xB7 classification ' + review.verification.classification
    }

    function paradigmText(decision) {
      if (!decision.required) return 'Cross-paradigm decision: not required'
      return 'Cross-paradigm decision: ' + decision.status +
        (decision.rationale ? ' \xB7 ' + decision.rationale : '')
    }

    function appraisalText(appraisal) {
      const fields = Object.entries(appraisal.fields).map(([name, field]) =>
        name + ': ' + field.status +
        (field.sourceText ? ' \xB7 source: ' + field.sourceText : '') +
        (field.normalizedValue ? ' \xB7 normalized: ' + field.normalizedValue : ''))
      return appraisal.paperId + ' \xB7 ' + reviewText(appraisal.reviewState) +
        '\\nSource hash: ' + appraisal.sourceDocumentHash +
        '\\nExtraction revision: ' + appraisal.extractionRevision +
        '\\n' + fields.join('\\n')
    }

    function reportedText(field) {
      return field.normalizedValue || field.sourceText || field.reportingStatus
    }

    function diagnosticText(diagnostics) {
      if (!Array.isArray(diagnostics) || !diagnostics.length) return 'The ledger could not be rebuilt.'
      return diagnostics.map(item => item.rule + ' ' + item.action).join('\\n')
    }

    function row(values) {
      const tr = document.createElement('tr')
      values.forEach(value => tr.appendChild(text('th', value)))
      return tr
    }

    function action(label, callback) {
      const button = text('button', label)
      button.addEventListener('click', callback)
      return button
    }

    function text(tag, value, className) {
      const element = document.createElement(tag)
      element.textContent = String(value)
      if (className) element.className = className
      return element
    }

    function post(type, payload) { vscode.postMessage({ type, ...payload }) }
    function setStatus(value, className) {
      const status = document.getElementById('status')
      status.textContent = value
      status.className = className || ''
    }
  </script>
</body>
</html>`}var dS={type:"agent",id:"proposal-import"},uS=["direct-empirical-inconsistency","methodological-artifact","contextual-divergence","conceptual-disagreement"];function lp(t,e){let r=Q.window.createOutputChannel("NodeGraph Claim Ledger");t.subscriptions.push(r,Q.commands.registerCommand("nodegraph.project.migratePhase3",i=>X(r,()=>lS(e,r,i))),Q.commands.registerCommand("nodegraph.project.importClaim",i=>X(r,()=>pS(e,r,i))),Q.commands.registerCommand("nodegraph.project.openClaimLedger",i=>X(r,()=>fS(t,e,i))),Q.commands.registerCommand("nodegraph.project.reviewClaims",i=>X(r,()=>mS(e,r,i))),Q.commands.registerCommand("nodegraph.project.reviewConflicts",i=>X(r,()=>vS(e,r,i))),Q.commands.registerCommand("nodegraph.project.reviewAppraisals",i=>X(r,()=>yS(e,r,i))))}async function lS(t,e,r){let i=await Z(r);!i||await Q.window.showWarningMessage("Upgrade this project from schema 1.1.0 to 1.2.0 for claims, conflicts, evidence appraisal, and the claim ledger?",{modal:!0},"Upgrade project")!=="Upgrade project"||Ut(e,await t.migrate(i.fsPath))}async function pS(t,e,r){let i=await Z(r);if(!i)return;let n=await Q.window.showOpenDialog({canSelectMany:!1,filters:{"NodeGraph claim proposal":["json"]},title:"Import a claim proposal"});if(!n?.[0])return;let o=await PS(n[0]);Ut(e,await t.importClaim(i.fsPath,o,dS))}async function fS(t,e,r){let i=await Z(r);i&&Kn.open(t,e,i.fsPath)}async function mS(t,e,r){let i=await Z(r);if(!i)return;let n=await t.reviewQueues(i.fsPath);me(e,n.diagnostics);let o=await Q.window.showQuickPick(n.claims.map(s=>({label:Er(s.text),description:Er(`${s.claimId} \xB7 ${s.reviewState.origin} proposal`),claim:s})),{placeHolder:"Choose a claim proposal"});if(!o)return;let a=await fp("Review this claim proposal");a&&(a==="approved"&&!await hS(t,e,i.fsPath,o.claim)||Ut(e,await t.reviewClaim(i.fsPath,o.claim.claimId,a)))}async function hS(t,e,r,i){if(!i.paradigmDecision.required||i.paradigmDecision.status==="approved")return!0;let n=await gS();if(!n)return!1;let o=await pp("Explain the cross-paradigm decision");if(!o)return!1;let a=await t.decideParadigm(r,i.claimId,n,o);return Ut(e,a),a.mutation.accepted&&n==="approved"}async function gS(){return(await Q.window.showQuickPick([{label:"Approve synthesis across paradigms",decision:"approved"},{label:"Reject synthesis across paradigms",decision:"rejected"}],{placeHolder:"Record the researcher cross-paradigm decision"}))?.decision}async function vS(t,e,r){let i=await Z(r);if(!i)return;let n=await t.reviewQueues(i.fsPath);me(e,n.diagnostics);let o=await Q.window.showQuickPick(n.conflicts.map(d=>({label:Er(d.conflictType),description:Er(`${d.conflictId} \xB7 ${d.findingRefs.length} preserved findings`),conflict:d})),{placeHolder:"Choose a conflict proposal"});if(!o)return;wS(e,o.conflict);let a=await Q.window.showQuickPick([{label:"Approve current classification",action:"approve"},{label:"Reject conflict proposal",action:"reject"},{label:"Reclassify and keep pending",action:"reclassify"}]);if(!a)return;if(a.action!=="reclassify")return Ut(e,await t.reviewConflict(i.fsPath,o.conflict.conflictId,a.action==="approve"?"approved":"rejected"));let s=await Q.window.showQuickPick(uS.map(d=>({label:d,value:d}))),c=s&&await pp("Explain the conflict reclassification");!s||!c||Ut(e,await t.reclassifyConflict(i.fsPath,o.conflict.conflictId,s.value,c))}async function yS(t,e,r){let i=await Z(r);if(!i)return;let n=await t.reviewQueues(i.fsPath);me(e,n.diagnostics);let o=await Q.window.showQuickPick(n.appraisals.map(s=>({label:Er(s.paperId),description:Er(s.appraisalId),appraisal:s})),{placeHolder:"Choose an evidence appraisal proposal"});if(!o)return;xS(e,o.appraisal);let a=await fp("Review this evidence appraisal");a&&Ut(e,await t.reviewAppraisal(i.fsPath,o.appraisal.appraisalId,a))}function wS(t,e){t.appendLine(`Conflict ${e.conflictId}: ${e.conflictType}`);for(let r of e.findingRefs)t.appendLine(`- ${r.relationship}: ${r.paperId}/${r.findingId}`);for(let r of e.contextComparisons)t.appendLine(`- Context: ${r.dimension} is ${r.result}; this is not a causal finding.`);t.show(!0)}function xS(t,e){t.appendLine(`Appraisal ${e.appraisalId} for ${e.paperId}`),t.appendLine(`Source hash: ${e.sourceDocumentHash}`),t.appendLine(`Extraction revision: ${e.extractionRevision}`);for(let[r,i]of Object.entries(e.fields))t.appendLine(`- ${r}: ${i.status}${i.sourceText?` \xB7 ${i.sourceText}`:""}`);t.show(!0)}async function pp(t){return(await Q.window.showInputBox({prompt:t,validateInput:r=>r.trim()?void 0:"Enter a researcher rationale."}))?.trim()||void 0}async function fp(t){return(await Q.window.showQuickPick([{label:"Approve",decision:"approved"},{label:"Reject",decision:"rejected"}],{placeHolder:t}))?.decision}async function PS(t){let e=await Q.workspace.fs.readFile(t);return JSON.parse(Buffer.from(e).toString("utf8"))}function Ut(t,e){t.appendLine(e.mutation.accepted?`Accepted: ${e.mutation.targetDocument}`:`Rejected: ${e.mutation.code}`),me(t,e.diagnostics),t.show(!0)}function Er(t){return t.replace(/[\u0000-\u001f\u007f]/g," ").replace(/\$\(/g,"\uFF04(")}var bS=[{id:"tomoki1207.pdf",name:"vscode-pdf (PDF Viewer)"}];async function IS(){for(let t of bS)if(!U.extensions.getExtension(t.id))try{await U.commands.executeCommand("workbench.extensions.installExtension",t.id)}catch{}}async function mp(t){if(t)return t;let e=U.workspace.workspaceFolders??[];return e.length===0?void 0:e.length===1?e[0].uri:(await U.window.showWorkspaceFolderPick({placeHolder:"Select a folder for NodeGraph"}))?.uri}async function SS(t){let e=await mp(t),r=e?U.Uri.joinPath(e,"untitled.nodegraph.json"):void 0,i=await U.window.showSaveDialog({defaultUri:r,filters:{NodeGraph:["nodegraph.json"]},title:"Create New NodeGraph"});if(!i)return;let n=i.fsPath.endsWith(".nodegraph.json")?i:i.with({path:i.path.replace(/(\.nodegraph)?(\.json)?$/,"")+".nodegraph.json"}),o=wi();await U.workspace.fs.writeFile(n,Buffer.from(JSON.stringify(o,null,2),"utf-8")),await U.commands.executeCommand("vscode.openWith",n,"nodegraph.editor")}function ES(t){let e=Kl({schemaRoot:U.Uri.joinPath(t.extensionUri,"docs","schemas").fsPath,legacySchemaPath:U.Uri.joinPath(t.extensionUri,"schema","nodegraph.schema.json").fsPath}),r=new Un(e),i=new Wn(e),n=new Jn(e);t.subscriptions.push(qe.register(t)),Zl(t,r),np(t,i),lp(t,n),t.subscriptions.push(U.commands.registerCommand("nodegraph.search",()=>{qe.postToActive({type:"openSearch"})}),U.commands.registerCommand("nodegraph.fitView",()=>{qe.postToActive({type:"fitView"})}),U.commands.registerCommand("nodegraph.collapseAll",()=>{qe.postToActive({type:"collapseAll"})}),U.commands.registerCommand("nodegraph.expandAll",()=>{qe.postToActive({type:"expandAll"})}),U.commands.registerCommand("nodegraph.new",o=>SS(o))),Os(U.workspace.workspaceFolders??[]),t.subscriptions.push(U.commands.registerCommand("nodegraph.copyAgentSpec",async o=>{let a=await mp(o);if(!a){U.window.showWarningMessage("NodeGraph: open or select a folder first \u2014 there is no workspace to copy the spec into.");return}let s=await Ns(t.extensionUri,a),c=await ro(a),d=await qs(t.extensionUri,a);s&&c&&d?U.window.showInformationMessage(`NodeGraph: wrote .agent/NODEGRAPH_SPEC.md, .agent/ENVIRONMENT.md, and .prompt/{korean,english}.md in ${a.fsPath}.`):U.window.showErrorMessage("NodeGraph: failed to write the agent files \u2014 check that the folder is writable and try again.")})),IS()}function jS(){}0&&(module.exports={activate,deactivate});
