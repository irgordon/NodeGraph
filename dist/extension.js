"use strict";var Qd=Object.create;var jr=Object.defineProperty;var Zd=Object.getOwnPropertyDescriptor;var eu=Object.getOwnPropertyNames;var tu=Object.getPrototypeOf,ru=Object.prototype.hasOwnProperty;var y=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),nu=(t,e)=>{for(var r in e)jr(t,r,{get:e[r],enumerable:!0})},us=(t,e,r,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of eu(e))!ru.call(t,i)&&i!==r&&jr(t,i,{get:()=>e[i],enumerable:!(n=Zd(e,i))||n.enumerable});return t};var V=(t,e,r)=>(r=t!=null?Qd(tu(t)):{},us(e||!t||!t.__esModule?jr(r,"default",{value:t,enumerable:!0}):r,t)),iu=t=>us(jr({},"__esModule",{value:!0}),t);var tr=y(M=>{"use strict";Object.defineProperty(M,"__esModule",{value:!0});M.regexpCode=M.getEsmExportName=M.getProperty=M.safeStringify=M.stringify=M.strConcat=M.addCodeArg=M.str=M._=M.nil=M._Code=M.Name=M.IDENTIFIER=M._CodeOrName=void 0;var Zt=class{};M._CodeOrName=Zt;M.IDENTIFIER=/^[a-z$_][a-z$_0-9]*$/i;var Ze=class extends Zt{constructor(e){if(super(),!M.IDENTIFIER.test(e))throw new Error("CodeGen: name must be a valid identifier");this.str=e}toString(){return this.str}emptyStr(){return!1}get names(){return{[this.str]:1}}};M.Name=Ze;var ye=class extends Zt{constructor(e){super(),this._items=typeof e=="string"?[e]:e}toString(){return this.str}emptyStr(){if(this._items.length>1)return!1;let e=this._items[0];return e===""||e==='""'}get str(){var e;return(e=this._str)!==null&&e!==void 0?e:this._str=this._items.reduce((r,n)=>`${r}${n}`,"")}get names(){var e;return(e=this._names)!==null&&e!==void 0?e:this._names=this._items.reduce((r,n)=>(n instanceof Ze&&(r[n.str]=(r[n.str]||0)+1),r),{})}};M._Code=ye;M.nil=new ye("");function Xs(t,...e){let r=[t[0]],n=0;for(;n<e.length;)fi(r,e[n]),r.push(t[++n]);return new ye(r)}M._=Xs;var pi=new ye("+");function Js(t,...e){let r=[er(t[0])],n=0;for(;n<e.length;)r.push(pi),fi(r,e[n]),r.push(pi,er(t[++n]));return wp(r),new ye(r)}M.str=Js;function fi(t,e){e instanceof ye?t.push(...e._items):e instanceof Ze?t.push(e):t.push(Pp(e))}M.addCodeArg=fi;function wp(t){let e=1;for(;e<t.length-1;){if(t[e]===pi){let r=bp(t[e-1],t[e+1]);if(r!==void 0){t.splice(e-1,3,r);continue}t[e++]="+"}e++}}function bp(t,e){if(e==='""')return t;if(t==='""')return e;if(typeof t=="string")return e instanceof Ze||t[t.length-1]!=='"'?void 0:typeof e!="string"?`${t.slice(0,-1)}${e}"`:e[0]==='"'?t.slice(0,-1)+e.slice(1):void 0;if(typeof e=="string"&&e[0]==='"'&&!(t instanceof Ze))return`"${t}${e.slice(1)}`}function xp(t,e){return e.emptyStr()?t:t.emptyStr()?e:Js`${t}${e}`}M.strConcat=xp;function Pp(t){return typeof t=="number"||typeof t=="boolean"||t===null?t:er(Array.isArray(t)?t.join(","):t)}function Ep(t){return new ye(er(t))}M.stringify=Ep;function er(t){return JSON.stringify(t).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}M.safeStringify=er;function Ip(t){return typeof t=="string"&&M.IDENTIFIER.test(t)?new ye(`.${t}`):Xs`[${t}]`}M.getProperty=Ip;function _p(t){if(typeof t=="string"&&M.IDENTIFIER.test(t))return new ye(`${t}`);throw new Error(`CodeGen: invalid export name: ${t}, use explicit $id name mapping`)}M.getEsmExportName=_p;function $p(t){return new ye(t.toString())}M.regexpCode=$p});var gi=y(ue=>{"use strict";Object.defineProperty(ue,"__esModule",{value:!0});ue.ValueScope=ue.ValueScopeName=ue.Scope=ue.varKinds=ue.UsedValueState=void 0;var de=tr(),hi=class extends Error{constructor(e){super(`CodeGen: "code" for ${e} not defined`),this.value=e.value}},on;(function(t){t[t.Started=0]="Started",t[t.Completed=1]="Completed"})(on||(ue.UsedValueState=on={}));ue.varKinds={const:new de.Name("const"),let:new de.Name("let"),var:new de.Name("var")};var sn=class{constructor({prefixes:e,parent:r}={}){this._names={},this._prefixes=e,this._parent=r}toName(e){return e instanceof de.Name?e:this.name(e)}name(e){return new de.Name(this._newName(e))}_newName(e){let r=this._names[e]||this._nameGroup(e);return`${e}${r.index++}`}_nameGroup(e){var r,n;if(!((n=(r=this._parent)===null||r===void 0?void 0:r._prefixes)===null||n===void 0)&&n.has(e)||this._prefixes&&!this._prefixes.has(e))throw new Error(`CodeGen: prefix "${e}" is not allowed in this scope`);return this._names[e]={prefix:e,index:0}}};ue.Scope=sn;var an=class extends de.Name{constructor(e,r){super(r),this.prefix=e}setValue(e,{property:r,itemIndex:n}){this.value=e,this.scopePath=(0,de._)`.${new de.Name(r)}[${n}]`}};ue.ValueScopeName=an;var Sp=(0,de._)`\n`,mi=class extends sn{constructor(e){super(e),this._values={},this._scope=e.scope,this.opts={...e,_n:e.lines?Sp:de.nil}}get(){return this._scope}name(e){return new an(e,this._newName(e))}value(e,r){var n;if(r.ref===void 0)throw new Error("CodeGen: ref must be passed in value");let i=this.toName(e),{prefix:o}=i,s=(n=r.key)!==null&&n!==void 0?n:r.ref,a=this._values[o];if(a){let u=a.get(s);if(u)return u}else a=this._values[o]=new Map;a.set(s,i);let c=this._scope[o]||(this._scope[o]=[]),d=c.length;return c[d]=r.ref,i.setValue(r,{property:o,itemIndex:d}),i}getValue(e,r){let n=this._values[e];if(n)return n.get(r)}scopeRefs(e,r=this._values){return this._reduceValues(r,n=>{if(n.scopePath===void 0)throw new Error(`CodeGen: name "${n}" has no value`);return(0,de._)`${e}${n.scopePath}`})}scopeCode(e=this._values,r,n){return this._reduceValues(e,i=>{if(i.value===void 0)throw new Error(`CodeGen: name "${i}" has no value`);return i.value.code},r,n)}_reduceValues(e,r,n={},i){let o=de.nil;for(let s in e){let a=e[s];if(!a)continue;let c=n[s]=n[s]||new Map;a.forEach(d=>{if(c.has(d))return;c.set(d,on.Started);let u=r(d);if(u){let l=this.opts.es5?ue.varKinds.var:ue.varKinds.const;o=(0,de._)`${o}${l} ${d} = ${u};${this.opts._n}`}else if(u=i?.(d))o=(0,de._)`${o}${u}${this.opts._n}`;else throw new hi(d);c.set(d,on.Completed)})}return o}};ue.ValueScope=mi});var $=y(D=>{"use strict";Object.defineProperty(D,"__esModule",{value:!0});D.or=D.and=D.not=D.CodeGen=D.operators=D.varKinds=D.ValueScopeName=D.ValueScope=D.Scope=D.Name=D.regexpCode=D.stringify=D.getProperty=D.nil=D.strConcat=D.str=D._=void 0;var k=tr(),Ie=gi(),Ue=tr();Object.defineProperty(D,"_",{enumerable:!0,get:function(){return Ue._}});Object.defineProperty(D,"str",{enumerable:!0,get:function(){return Ue.str}});Object.defineProperty(D,"strConcat",{enumerable:!0,get:function(){return Ue.strConcat}});Object.defineProperty(D,"nil",{enumerable:!0,get:function(){return Ue.nil}});Object.defineProperty(D,"getProperty",{enumerable:!0,get:function(){return Ue.getProperty}});Object.defineProperty(D,"stringify",{enumerable:!0,get:function(){return Ue.stringify}});Object.defineProperty(D,"regexpCode",{enumerable:!0,get:function(){return Ue.regexpCode}});Object.defineProperty(D,"Name",{enumerable:!0,get:function(){return Ue.Name}});var ln=gi();Object.defineProperty(D,"Scope",{enumerable:!0,get:function(){return ln.Scope}});Object.defineProperty(D,"ValueScope",{enumerable:!0,get:function(){return ln.ValueScope}});Object.defineProperty(D,"ValueScopeName",{enumerable:!0,get:function(){return ln.ValueScopeName}});Object.defineProperty(D,"varKinds",{enumerable:!0,get:function(){return ln.varKinds}});D.operators={GT:new k._Code(">"),GTE:new k._Code(">="),LT:new k._Code("<"),LTE:new k._Code("<="),EQ:new k._Code("==="),NEQ:new k._Code("!=="),NOT:new k._Code("!"),OR:new k._Code("||"),AND:new k._Code("&&"),ADD:new k._Code("+")};var Te=class{optimizeNodes(){return this}optimizeNames(e,r){return this}},vi=class extends Te{constructor(e,r,n){super(),this.varKind=e,this.name=r,this.rhs=n}render({es5:e,_n:r}){let n=e?Ie.varKinds.var:this.varKind,i=this.rhs===void 0?"":` = ${this.rhs}`;return`${n} ${this.name}${i};`+r}optimizeNames(e,r){if(e[this.name.str])return this.rhs&&(this.rhs=xt(this.rhs,e,r)),this}get names(){return this.rhs instanceof k._CodeOrName?this.rhs.names:{}}},cn=class extends Te{constructor(e,r,n){super(),this.lhs=e,this.rhs=r,this.sideEffects=n}render({_n:e}){return`${this.lhs} = ${this.rhs};`+e}optimizeNames(e,r){if(!(this.lhs instanceof k.Name&&!e[this.lhs.str]&&!this.sideEffects))return this.rhs=xt(this.rhs,e,r),this}get names(){let e=this.lhs instanceof k.Name?{}:{...this.lhs.names};return un(e,this.rhs)}},yi=class extends cn{constructor(e,r,n,i){super(e,n,i),this.op=r}render({_n:e}){return`${this.lhs} ${this.op}= ${this.rhs};`+e}},wi=class extends Te{constructor(e){super(),this.label=e,this.names={}}render({_n:e}){return`${this.label}:`+e}},bi=class extends Te{constructor(e){super(),this.label=e,this.names={}}render({_n:e}){return`break${this.label?` ${this.label}`:""};`+e}},xi=class extends Te{constructor(e){super(),this.error=e}render({_n:e}){return`throw ${this.error};`+e}get names(){return this.error.names}},Pi=class extends Te{constructor(e){super(),this.code=e}render({_n:e}){return`${this.code};`+e}optimizeNodes(){return`${this.code}`?this:void 0}optimizeNames(e,r){return this.code=xt(this.code,e,r),this}get names(){return this.code instanceof k._CodeOrName?this.code.names:{}}},rr=class extends Te{constructor(e=[]){super(),this.nodes=e}render(e){return this.nodes.reduce((r,n)=>r+n.render(e),"")}optimizeNodes(){let{nodes:e}=this,r=e.length;for(;r--;){let n=e[r].optimizeNodes();Array.isArray(n)?e.splice(r,1,...n):n?e[r]=n:e.splice(r,1)}return e.length>0?this:void 0}optimizeNames(e,r){let{nodes:n}=this,i=n.length;for(;i--;){let o=n[i];o.optimizeNames(e,r)||(Dp(e,o.names),n.splice(i,1))}return n.length>0?this:void 0}get names(){return this.nodes.reduce((e,r)=>rt(e,r.names),{})}},Ce=class extends rr{render(e){return"{"+e._n+super.render(e)+"}"+e._n}},Ei=class extends rr{},bt=class extends Ce{};bt.kind="else";var et=class t extends Ce{constructor(e,r){super(r),this.condition=e}render(e){let r=`if(${this.condition})`+super.render(e);return this.else&&(r+="else "+this.else.render(e)),r}optimizeNodes(){super.optimizeNodes();let e=this.condition;if(e===!0)return this.nodes;let r=this.else;if(r){let n=r.optimizeNodes();r=this.else=Array.isArray(n)?new bt(n):n}if(r)return e===!1?r instanceof t?r:r.nodes:this.nodes.length?this:new t(Qs(e),r instanceof t?[r]:r.nodes);if(!(e===!1||!this.nodes.length))return this}optimizeNames(e,r){var n;if(this.else=(n=this.else)===null||n===void 0?void 0:n.optimizeNames(e,r),!!(super.optimizeNames(e,r)||this.else))return this.condition=xt(this.condition,e,r),this}get names(){let e=super.names;return un(e,this.condition),this.else&&rt(e,this.else.names),e}};et.kind="if";var tt=class extends Ce{};tt.kind="for";var Ii=class extends tt{constructor(e){super(),this.iteration=e}render(e){return`for(${this.iteration})`+super.render(e)}optimizeNames(e,r){if(super.optimizeNames(e,r))return this.iteration=xt(this.iteration,e,r),this}get names(){return rt(super.names,this.iteration.names)}},_i=class extends tt{constructor(e,r,n,i){super(),this.varKind=e,this.name=r,this.from=n,this.to=i}render(e){let r=e.es5?Ie.varKinds.var:this.varKind,{name:n,from:i,to:o}=this;return`for(${r} ${n}=${i}; ${n}<${o}; ${n}++)`+super.render(e)}get names(){let e=un(super.names,this.from);return un(e,this.to)}},dn=class extends tt{constructor(e,r,n,i){super(),this.loop=e,this.varKind=r,this.name=n,this.iterable=i}render(e){return`for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})`+super.render(e)}optimizeNames(e,r){if(super.optimizeNames(e,r))return this.iterable=xt(this.iterable,e,r),this}get names(){return rt(super.names,this.iterable.names)}},nr=class extends Ce{constructor(e,r,n){super(),this.name=e,this.args=r,this.async=n}render(e){return`${this.async?"async ":""}function ${this.name}(${this.args})`+super.render(e)}};nr.kind="func";var ir=class extends rr{render(e){return"return "+super.render(e)}};ir.kind="return";var $i=class extends Ce{render(e){let r="try"+super.render(e);return this.catch&&(r+=this.catch.render(e)),this.finally&&(r+=this.finally.render(e)),r}optimizeNodes(){var e,r;return super.optimizeNodes(),(e=this.catch)===null||e===void 0||e.optimizeNodes(),(r=this.finally)===null||r===void 0||r.optimizeNodes(),this}optimizeNames(e,r){var n,i;return super.optimizeNames(e,r),(n=this.catch)===null||n===void 0||n.optimizeNames(e,r),(i=this.finally)===null||i===void 0||i.optimizeNames(e,r),this}get names(){let e=super.names;return this.catch&&rt(e,this.catch.names),this.finally&&rt(e,this.finally.names),e}},or=class extends Ce{constructor(e){super(),this.error=e}render(e){return`catch(${this.error})`+super.render(e)}};or.kind="catch";var sr=class extends Ce{render(e){return"finally"+super.render(e)}};sr.kind="finally";var Si=class{constructor(e,r={}){this._values={},this._blockStarts=[],this._constants={},this.opts={...r,_n:r.lines?`
`:""},this._extScope=e,this._scope=new Ie.Scope({parent:e}),this._nodes=[new Ei]}toString(){return this._root.render(this.opts)}name(e){return this._scope.name(e)}scopeName(e){return this._extScope.name(e)}scopeValue(e,r){let n=this._extScope.value(e,r);return(this._values[n.prefix]||(this._values[n.prefix]=new Set)).add(n),n}getScopeValue(e,r){return this._extScope.getValue(e,r)}scopeRefs(e){return this._extScope.scopeRefs(e,this._values)}scopeCode(){return this._extScope.scopeCode(this._values)}_def(e,r,n,i){let o=this._scope.toName(r);return n!==void 0&&i&&(this._constants[o.str]=n),this._leafNode(new vi(e,o,n)),o}const(e,r,n){return this._def(Ie.varKinds.const,e,r,n)}let(e,r,n){return this._def(Ie.varKinds.let,e,r,n)}var(e,r,n){return this._def(Ie.varKinds.var,e,r,n)}assign(e,r,n){return this._leafNode(new cn(e,r,n))}add(e,r){return this._leafNode(new yi(e,D.operators.ADD,r))}code(e){return typeof e=="function"?e():e!==k.nil&&this._leafNode(new Pi(e)),this}object(...e){let r=["{"];for(let[n,i]of e)r.length>1&&r.push(","),r.push(n),(n!==i||this.opts.es5)&&(r.push(":"),(0,k.addCodeArg)(r,i));return r.push("}"),new k._Code(r)}if(e,r,n){if(this._blockNode(new et(e)),r&&n)this.code(r).else().code(n).endIf();else if(r)this.code(r).endIf();else if(n)throw new Error('CodeGen: "else" body without "then" body');return this}elseIf(e){return this._elseNode(new et(e))}else(){return this._elseNode(new bt)}endIf(){return this._endBlockNode(et,bt)}_for(e,r){return this._blockNode(e),r&&this.code(r).endFor(),this}for(e,r){return this._for(new Ii(e),r)}forRange(e,r,n,i,o=this.opts.es5?Ie.varKinds.var:Ie.varKinds.let){let s=this._scope.toName(e);return this._for(new _i(o,s,r,n),()=>i(s))}forOf(e,r,n,i=Ie.varKinds.const){let o=this._scope.toName(e);if(this.opts.es5){let s=r instanceof k.Name?r:this.var("_arr",r);return this.forRange("_i",0,(0,k._)`${s}.length`,a=>{this.var(o,(0,k._)`${s}[${a}]`),n(o)})}return this._for(new dn("of",i,o,r),()=>n(o))}forIn(e,r,n,i=this.opts.es5?Ie.varKinds.var:Ie.varKinds.const){if(this.opts.ownProperties)return this.forOf(e,(0,k._)`Object.keys(${r})`,n);let o=this._scope.toName(e);return this._for(new dn("in",i,o,r),()=>n(o))}endFor(){return this._endBlockNode(tt)}label(e){return this._leafNode(new wi(e))}break(e){return this._leafNode(new bi(e))}return(e){let r=new ir;if(this._blockNode(r),this.code(e),r.nodes.length!==1)throw new Error('CodeGen: "return" should have one node');return this._endBlockNode(ir)}try(e,r,n){if(!r&&!n)throw new Error('CodeGen: "try" without "catch" and "finally"');let i=new $i;if(this._blockNode(i),this.code(e),r){let o=this.name("e");this._currNode=i.catch=new or(o),r(o)}return n&&(this._currNode=i.finally=new sr,this.code(n)),this._endBlockNode(or,sr)}throw(e){return this._leafNode(new xi(e))}block(e,r){return this._blockStarts.push(this._nodes.length),e&&this.code(e).endBlock(r),this}endBlock(e){let r=this._blockStarts.pop();if(r===void 0)throw new Error("CodeGen: not in self-balancing block");let n=this._nodes.length-r;if(n<0||e!==void 0&&n!==e)throw new Error(`CodeGen: wrong number of nodes: ${n} vs ${e} expected`);return this._nodes.length=r,this}func(e,r=k.nil,n,i){return this._blockNode(new nr(e,r,n)),i&&this.code(i).endFunc(),this}endFunc(){return this._endBlockNode(nr)}optimize(e=1){for(;e-- >0;)this._root.optimizeNodes(),this._root.optimizeNames(this._root.names,this._constants)}_leafNode(e){return this._currNode.nodes.push(e),this}_blockNode(e){this._currNode.nodes.push(e),this._nodes.push(e)}_endBlockNode(e,r){let n=this._currNode;if(n instanceof e||r&&n instanceof r)return this._nodes.pop(),this;throw new Error(`CodeGen: not in block "${r?`${e.kind}/${r.kind}`:e.kind}"`)}_elseNode(e){let r=this._currNode;if(!(r instanceof et))throw new Error('CodeGen: "else" without "if"');return this._currNode=r.else=e,this}get _root(){return this._nodes[0]}get _currNode(){let e=this._nodes;return e[e.length-1]}set _currNode(e){let r=this._nodes;r[r.length-1]=e}};D.CodeGen=Si;function rt(t,e){for(let r in e)t[r]=(t[r]||0)+(e[r]||0);return t}function un(t,e){return e instanceof k._CodeOrName?rt(t,e.names):t}function xt(t,e,r){if(t instanceof k.Name)return n(t);if(!i(t))return t;return new k._Code(t._items.reduce((o,s)=>(s instanceof k.Name&&(s=n(s)),s instanceof k._Code?o.push(...s._items):o.push(s),o),[]));function n(o){let s=r[o.str];return s===void 0||e[o.str]!==1?o:(delete e[o.str],s)}function i(o){return o instanceof k._Code&&o._items.some(s=>s instanceof k.Name&&e[s.str]===1&&r[s.str]!==void 0)}}function Dp(t,e){for(let r in e)t[r]=(t[r]||0)-(e[r]||0)}function Qs(t){return typeof t=="boolean"||typeof t=="number"||t===null?!t:(0,k._)`!${Di(t)}`}D.not=Qs;var jp=Zs(D.operators.AND);function Rp(...t){return t.reduce(jp)}D.and=Rp;var kp=Zs(D.operators.OR);function Op(...t){return t.reduce(kp)}D.or=Op;function Zs(t){return(e,r)=>e===k.nil?r:r===k.nil?e:(0,k._)`${Di(e)} ${t} ${Di(r)}`}function Di(t){return t instanceof k.Name?t:(0,k._)`(${t})`}});var O=y(j=>{"use strict";Object.defineProperty(j,"__esModule",{value:!0});j.checkStrictMode=j.getErrorPath=j.Type=j.useFunc=j.setEvaluated=j.evaluatedPropsToName=j.mergeEvaluated=j.eachItem=j.unescapeJsonPointer=j.escapeJsonPointer=j.escapeFragment=j.unescapeFragment=j.schemaRefOrVal=j.schemaHasRulesButRef=j.schemaHasRules=j.checkUnknownRules=j.alwaysValidSchema=j.toHash=void 0;var C=$(),Np=tr();function Mp(t){let e={};for(let r of t)e[r]=!0;return e}j.toHash=Mp;function Ap(t,e){return typeof e=="boolean"?e:Object.keys(e).length===0?!0:(ra(t,e),!na(e,t.self.RULES.all))}j.alwaysValidSchema=Ap;function ra(t,e=t.schema){let{opts:r,self:n}=t;if(!r.strictSchema||typeof e=="boolean")return;let i=n.RULES.keywords;for(let o in e)i[o]||sa(t,`unknown keyword: "${o}"`)}j.checkUnknownRules=ra;function na(t,e){if(typeof t=="boolean")return!t;for(let r in t)if(e[r])return!0;return!1}j.schemaHasRules=na;function Tp(t,e){if(typeof t=="boolean")return!t;for(let r in t)if(r!=="$ref"&&e.all[r])return!0;return!1}j.schemaHasRulesButRef=Tp;function Cp({topSchemaRef:t,schemaPath:e},r,n,i){if(!i){if(typeof r=="number"||typeof r=="boolean")return r;if(typeof r=="string")return(0,C._)`${r}`}return(0,C._)`${t}${e}${(0,C.getProperty)(n)}`}j.schemaRefOrVal=Cp;function qp(t){return ia(decodeURIComponent(t))}j.unescapeFragment=qp;function Hp(t){return encodeURIComponent(Ri(t))}j.escapeFragment=Hp;function Ri(t){return typeof t=="number"?`${t}`:t.replace(/~/g,"~0").replace(/\//g,"~1")}j.escapeJsonPointer=Ri;function ia(t){return t.replace(/~1/g,"/").replace(/~0/g,"~")}j.unescapeJsonPointer=ia;function Fp(t,e){if(Array.isArray(t))for(let r of t)e(r);else e(t)}j.eachItem=Fp;function ea({mergeNames:t,mergeToName:e,mergeValues:r,resultToName:n}){return(i,o,s,a)=>{let c=s===void 0?o:s instanceof C.Name?(o instanceof C.Name?t(i,o,s):e(i,o,s),s):o instanceof C.Name?(e(i,s,o),o):r(o,s);return a===C.Name&&!(c instanceof C.Name)?n(i,c):c}}j.mergeEvaluated={props:ea({mergeNames:(t,e,r)=>t.if((0,C._)`${r} !== true && ${e} !== undefined`,()=>{t.if((0,C._)`${e} === true`,()=>t.assign(r,!0),()=>t.assign(r,(0,C._)`${r} || {}`).code((0,C._)`Object.assign(${r}, ${e})`))}),mergeToName:(t,e,r)=>t.if((0,C._)`${r} !== true`,()=>{e===!0?t.assign(r,!0):(t.assign(r,(0,C._)`${r} || {}`),ki(t,r,e))}),mergeValues:(t,e)=>t===!0?!0:{...t,...e},resultToName:oa}),items:ea({mergeNames:(t,e,r)=>t.if((0,C._)`${r} !== true && ${e} !== undefined`,()=>t.assign(r,(0,C._)`${e} === true ? true : ${r} > ${e} ? ${r} : ${e}`)),mergeToName:(t,e,r)=>t.if((0,C._)`${r} !== true`,()=>t.assign(r,e===!0?!0:(0,C._)`${r} > ${e} ? ${r} : ${e}`)),mergeValues:(t,e)=>t===!0?!0:Math.max(t,e),resultToName:(t,e)=>t.var("items",e)})};function oa(t,e){if(e===!0)return t.var("props",!0);let r=t.var("props",(0,C._)`{}`);return e!==void 0&&ki(t,r,e),r}j.evaluatedPropsToName=oa;function ki(t,e,r){Object.keys(r).forEach(n=>t.assign((0,C._)`${e}${(0,C.getProperty)(n)}`,!0))}j.setEvaluated=ki;var ta={};function zp(t,e){return t.scopeValue("func",{ref:e,code:ta[e.code]||(ta[e.code]=new Np._Code(e.code))})}j.useFunc=zp;var ji;(function(t){t[t.Num=0]="Num",t[t.Str=1]="Str"})(ji||(j.Type=ji={}));function Bp(t,e,r){if(t instanceof C.Name){let n=e===ji.Num;return r?n?(0,C._)`"[" + ${t} + "]"`:(0,C._)`"['" + ${t} + "']"`:n?(0,C._)`"/" + ${t}`:(0,C._)`"/" + ${t}.replace(/~/g, "~0").replace(/\\//g, "~1")`}return r?(0,C.getProperty)(t).toString():"/"+Ri(t)}j.getErrorPath=Bp;function sa(t,e,r=t.opts.strictSchema){if(r){if(e=`strict mode: ${e}`,r===!0)throw new Error(e);t.self.logger.warn(e)}}j.checkStrictMode=sa});var qe=y(Oi=>{"use strict";Object.defineProperty(Oi,"__esModule",{value:!0});var ee=$(),Lp={data:new ee.Name("data"),valCxt:new ee.Name("valCxt"),instancePath:new ee.Name("instancePath"),parentData:new ee.Name("parentData"),parentDataProperty:new ee.Name("parentDataProperty"),rootData:new ee.Name("rootData"),dynamicAnchors:new ee.Name("dynamicAnchors"),vErrors:new ee.Name("vErrors"),errors:new ee.Name("errors"),this:new ee.Name("this"),self:new ee.Name("self"),scope:new ee.Name("scope"),json:new ee.Name("json"),jsonPos:new ee.Name("jsonPos"),jsonLen:new ee.Name("jsonLen"),jsonPart:new ee.Name("jsonPart")};Oi.default=Lp});var ar=y(te=>{"use strict";Object.defineProperty(te,"__esModule",{value:!0});te.extendErrors=te.resetErrorsCount=te.reportExtraError=te.reportError=te.keyword$DataError=te.keywordError=void 0;var N=$(),pn=O(),ie=qe();te.keywordError={message:({keyword:t})=>(0,N.str)`must pass "${t}" keyword validation`};te.keyword$DataError={message:({keyword:t,schemaType:e})=>e?(0,N.str)`"${t}" keyword must be ${e} ($data)`:(0,N.str)`"${t}" keyword is invalid ($data)`};function Up(t,e=te.keywordError,r,n){let{it:i}=t,{gen:o,compositeRule:s,allErrors:a}=i,c=da(t,e,r);n??(s||a)?aa(o,c):ca(i,(0,N._)`[${c}]`)}te.reportError=Up;function Vp(t,e=te.keywordError,r){let{it:n}=t,{gen:i,compositeRule:o,allErrors:s}=n,a=da(t,e,r);aa(i,a),o||s||ca(n,ie.default.vErrors)}te.reportExtraError=Vp;function Gp(t,e){t.assign(ie.default.errors,e),t.if((0,N._)`${ie.default.vErrors} !== null`,()=>t.if(e,()=>t.assign((0,N._)`${ie.default.vErrors}.length`,e),()=>t.assign(ie.default.vErrors,null)))}te.resetErrorsCount=Gp;function Wp({gen:t,keyword:e,schemaValue:r,data:n,errsCount:i,it:o}){if(i===void 0)throw new Error("ajv implementation error");let s=t.name("err");t.forRange("i",i,ie.default.errors,a=>{t.const(s,(0,N._)`${ie.default.vErrors}[${a}]`),t.if((0,N._)`${s}.instancePath === undefined`,()=>t.assign((0,N._)`${s}.instancePath`,(0,N.strConcat)(ie.default.instancePath,o.errorPath))),t.assign((0,N._)`${s}.schemaPath`,(0,N.str)`${o.errSchemaPath}/${e}`),o.opts.verbose&&(t.assign((0,N._)`${s}.schema`,r),t.assign((0,N._)`${s}.data`,n))})}te.extendErrors=Wp;function aa(t,e){let r=t.const("err",e);t.if((0,N._)`${ie.default.vErrors} === null`,()=>t.assign(ie.default.vErrors,(0,N._)`[${r}]`),(0,N._)`${ie.default.vErrors}.push(${r})`),t.code((0,N._)`${ie.default.errors}++`)}function ca(t,e){let{gen:r,validateName:n,schemaEnv:i}=t;i.$async?r.throw((0,N._)`new ${t.ValidationError}(${e})`):(r.assign((0,N._)`${n}.errors`,e),r.return(!1))}var nt={keyword:new N.Name("keyword"),schemaPath:new N.Name("schemaPath"),params:new N.Name("params"),propertyName:new N.Name("propertyName"),message:new N.Name("message"),schema:new N.Name("schema"),parentSchema:new N.Name("parentSchema")};function da(t,e,r){let{createErrors:n}=t.it;return n===!1?(0,N._)`{}`:Yp(t,e,r)}function Yp(t,e,r={}){let{gen:n,it:i}=t,o=[Kp(i,r),Xp(t,r)];return Jp(t,e,o),n.object(...o)}function Kp({errorPath:t},{instancePath:e}){let r=e?(0,N.str)`${t}${(0,pn.getErrorPath)(e,pn.Type.Str)}`:t;return[ie.default.instancePath,(0,N.strConcat)(ie.default.instancePath,r)]}function Xp({keyword:t,it:{errSchemaPath:e}},{schemaPath:r,parentSchema:n}){let i=n?e:(0,N.str)`${e}/${t}`;return r&&(i=(0,N.str)`${i}${(0,pn.getErrorPath)(r,pn.Type.Str)}`),[nt.schemaPath,i]}function Jp(t,{params:e,message:r},n){let{keyword:i,data:o,schemaValue:s,it:a}=t,{opts:c,propertyName:d,topSchemaRef:u,schemaPath:l}=a;n.push([nt.keyword,i],[nt.params,typeof e=="function"?e(t):e||(0,N._)`{}`]),c.messages&&n.push([nt.message,typeof r=="function"?r(t):r]),c.verbose&&n.push([nt.schema,s],[nt.parentSchema,(0,N._)`${u}${l}`],[ie.default.data,o]),d&&n.push([nt.propertyName,d])}});var la=y(Pt=>{"use strict";Object.defineProperty(Pt,"__esModule",{value:!0});Pt.boolOrEmptySchema=Pt.topBoolOrEmptySchema=void 0;var Qp=ar(),Zp=$(),ef=qe(),tf={message:"boolean schema is false"};function rf(t){let{gen:e,schema:r,validateName:n}=t;r===!1?ua(t,!1):typeof r=="object"&&r.$async===!0?e.return(ef.default.data):(e.assign((0,Zp._)`${n}.errors`,null),e.return(!0))}Pt.topBoolOrEmptySchema=rf;function nf(t,e){let{gen:r,schema:n}=t;n===!1?(r.var(e,!1),ua(t)):r.var(e,!0)}Pt.boolOrEmptySchema=nf;function ua(t,e){let{gen:r,data:n}=t,i={gen:r,keyword:"false schema",data:n,schema:!1,schemaCode:!1,schemaValue:!1,params:{},it:t};(0,Qp.reportError)(i,tf,void 0,e)}});var Ni=y(Et=>{"use strict";Object.defineProperty(Et,"__esModule",{value:!0});Et.getRules=Et.isJSONType=void 0;var of=["string","number","integer","boolean","null","object","array"],sf=new Set(of);function af(t){return typeof t=="string"&&sf.has(t)}Et.isJSONType=af;function cf(){let t={number:{type:"number",rules:[]},string:{type:"string",rules:[]},array:{type:"array",rules:[]},object:{type:"object",rules:[]}};return{types:{...t,integer:!0,boolean:!0,null:!0},rules:[{rules:[]},t.number,t.string,t.array,t.object],post:{rules:[]},all:{},keywords:{}}}Et.getRules=cf});var Mi=y(Ve=>{"use strict";Object.defineProperty(Ve,"__esModule",{value:!0});Ve.shouldUseRule=Ve.shouldUseGroup=Ve.schemaHasRulesForType=void 0;function df({schema:t,self:e},r){let n=e.RULES.types[r];return n&&n!==!0&&pa(t,n)}Ve.schemaHasRulesForType=df;function pa(t,e){return e.rules.some(r=>fa(t,r))}Ve.shouldUseGroup=pa;function fa(t,e){var r;return t[e.keyword]!==void 0||((r=e.definition.implements)===null||r===void 0?void 0:r.some(n=>t[n]!==void 0))}Ve.shouldUseRule=fa});var cr=y(re=>{"use strict";Object.defineProperty(re,"__esModule",{value:!0});re.reportTypeError=re.checkDataTypes=re.checkDataType=re.coerceAndCheckDataType=re.getJSONTypes=re.getSchemaTypes=re.DataType=void 0;var uf=Ni(),lf=Mi(),pf=ar(),_=$(),ha=O(),It;(function(t){t[t.Correct=0]="Correct",t[t.Wrong=1]="Wrong"})(It||(re.DataType=It={}));function ff(t){let e=ma(t.type);if(e.includes("null")){if(t.nullable===!1)throw new Error("type: null contradicts nullable: false")}else{if(!e.length&&t.nullable!==void 0)throw new Error('"nullable" cannot be used without "type"');t.nullable===!0&&e.push("null")}return e}re.getSchemaTypes=ff;function ma(t){let e=Array.isArray(t)?t:t?[t]:[];if(e.every(uf.isJSONType))return e;throw new Error("type must be JSONType or JSONType[]: "+e.join(","))}re.getJSONTypes=ma;function hf(t,e){let{gen:r,data:n,opts:i}=t,o=mf(e,i.coerceTypes),s=e.length>0&&!(o.length===0&&e.length===1&&(0,lf.schemaHasRulesForType)(t,e[0]));if(s){let a=Ti(e,n,i.strictNumbers,It.Wrong);r.if(a,()=>{o.length?gf(t,e,o):Ci(t)})}return s}re.coerceAndCheckDataType=hf;var ga=new Set(["string","number","integer","boolean","null"]);function mf(t,e){return e?t.filter(r=>ga.has(r)||e==="array"&&r==="array"):[]}function gf(t,e,r){let{gen:n,data:i,opts:o}=t,s=n.let("dataType",(0,_._)`typeof ${i}`),a=n.let("coerced",(0,_._)`undefined`);o.coerceTypes==="array"&&n.if((0,_._)`${s} == 'object' && Array.isArray(${i}) && ${i}.length == 1`,()=>n.assign(i,(0,_._)`${i}[0]`).assign(s,(0,_._)`typeof ${i}`).if(Ti(e,i,o.strictNumbers),()=>n.assign(a,i))),n.if((0,_._)`${a} !== undefined`);for(let d of r)(ga.has(d)||d==="array"&&o.coerceTypes==="array")&&c(d);n.else(),Ci(t),n.endIf(),n.if((0,_._)`${a} !== undefined`,()=>{n.assign(i,a),vf(t,a)});function c(d){switch(d){case"string":n.elseIf((0,_._)`${s} == "number" || ${s} == "boolean"`).assign(a,(0,_._)`"" + ${i}`).elseIf((0,_._)`${i} === null`).assign(a,(0,_._)`""`);return;case"number":n.elseIf((0,_._)`${s} == "boolean" || ${i} === null
              || (${s} == "string" && ${i} && ${i} == +${i})`).assign(a,(0,_._)`+${i}`);return;case"integer":n.elseIf((0,_._)`${s} === "boolean" || ${i} === null
              || (${s} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(a,(0,_._)`+${i}`);return;case"boolean":n.elseIf((0,_._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(a,!1).elseIf((0,_._)`${i} === "true" || ${i} === 1`).assign(a,!0);return;case"null":n.elseIf((0,_._)`${i} === "" || ${i} === 0 || ${i} === false`),n.assign(a,null);return;case"array":n.elseIf((0,_._)`${s} === "string" || ${s} === "number"
              || ${s} === "boolean" || ${i} === null`).assign(a,(0,_._)`[${i}]`)}}}function vf({gen:t,parentData:e,parentDataProperty:r},n){t.if((0,_._)`${e} !== undefined`,()=>t.assign((0,_._)`${e}[${r}]`,n))}function Ai(t,e,r,n=It.Correct){let i=n===It.Correct?_.operators.EQ:_.operators.NEQ,o;switch(t){case"null":return(0,_._)`${e} ${i} null`;case"array":o=(0,_._)`Array.isArray(${e})`;break;case"object":o=(0,_._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;break;case"integer":o=s((0,_._)`!(${e} % 1) && !isNaN(${e})`);break;case"number":o=s();break;default:return(0,_._)`typeof ${e} ${i} ${t}`}return n===It.Correct?o:(0,_.not)(o);function s(a=_.nil){return(0,_.and)((0,_._)`typeof ${e} == "number"`,a,r?(0,_._)`isFinite(${e})`:_.nil)}}re.checkDataType=Ai;function Ti(t,e,r,n){if(t.length===1)return Ai(t[0],e,r,n);let i,o=(0,ha.toHash)(t);if(o.array&&o.object){let s=(0,_._)`typeof ${e} != "object"`;i=o.null?s:(0,_._)`!${e} || ${s}`,delete o.null,delete o.array,delete o.object}else i=_.nil;o.number&&delete o.integer;for(let s in o)i=(0,_.and)(i,Ai(s,e,r,n));return i}re.checkDataTypes=Ti;var yf={message:({schema:t})=>`must be ${t}`,params:({schema:t,schemaValue:e})=>typeof t=="string"?(0,_._)`{type: ${t}}`:(0,_._)`{type: ${e}}`};function Ci(t){let e=wf(t);(0,pf.reportError)(e,yf)}re.reportTypeError=Ci;function wf(t){let{gen:e,data:r,schema:n}=t,i=(0,ha.schemaRefOrVal)(t,n,"type");return{gen:e,keyword:"type",data:r,schema:n.type,schemaCode:i,schemaValue:i,parentSchema:n,params:{},it:t}}});var ya=y(fn=>{"use strict";Object.defineProperty(fn,"__esModule",{value:!0});fn.assignDefaults=void 0;var _t=$(),bf=O();function xf(t,e){let{properties:r,items:n}=t.schema;if(e==="object"&&r)for(let i in r)va(t,i,r[i].default);else e==="array"&&Array.isArray(n)&&n.forEach((i,o)=>va(t,o,i.default))}fn.assignDefaults=xf;function va(t,e,r){let{gen:n,compositeRule:i,data:o,opts:s}=t;if(r===void 0)return;let a=(0,_t._)`${o}${(0,_t.getProperty)(e)}`;if(i){(0,bf.checkStrictMode)(t,`default is ignored for: ${a}`);return}let c=(0,_t._)`${a} === undefined`;s.useDefaults==="empty"&&(c=(0,_t._)`${c} || ${a} === null || ${a} === ""`),n.if(c,(0,_t._)`${a} = ${(0,_t.stringify)(r)}`)}});var we=y(T=>{"use strict";Object.defineProperty(T,"__esModule",{value:!0});T.validateUnion=T.validateArray=T.usePattern=T.callValidateCode=T.schemaProperties=T.allSchemaProperties=T.noPropertyInData=T.propertyInData=T.isOwnProperty=T.hasPropFunc=T.reportMissingProp=T.checkMissingProp=T.checkReportMissingProp=void 0;var H=$(),qi=O(),Ge=qe(),Pf=O();function Ef(t,e){let{gen:r,data:n,it:i}=t;r.if(Fi(r,n,e,i.opts.ownProperties),()=>{t.setParams({missingProperty:(0,H._)`${e}`},!0),t.error()})}T.checkReportMissingProp=Ef;function If({gen:t,data:e,it:{opts:r}},n,i){return(0,H.or)(...n.map(o=>(0,H.and)(Fi(t,e,o,r.ownProperties),(0,H._)`${i} = ${o}`)))}T.checkMissingProp=If;function _f(t,e){t.setParams({missingProperty:e},!0),t.error()}T.reportMissingProp=_f;function wa(t){return t.scopeValue("func",{ref:Object.prototype.hasOwnProperty,code:(0,H._)`Object.prototype.hasOwnProperty`})}T.hasPropFunc=wa;function Hi(t,e,r){return(0,H._)`${wa(t)}.call(${e}, ${r})`}T.isOwnProperty=Hi;function $f(t,e,r,n){let i=(0,H._)`${e}${(0,H.getProperty)(r)} !== undefined`;return n?(0,H._)`${i} && ${Hi(t,e,r)}`:i}T.propertyInData=$f;function Fi(t,e,r,n){let i=(0,H._)`${e}${(0,H.getProperty)(r)} === undefined`;return n?(0,H.or)(i,(0,H.not)(Hi(t,e,r))):i}T.noPropertyInData=Fi;function ba(t){return t?Object.keys(t).filter(e=>e!=="__proto__"):[]}T.allSchemaProperties=ba;function Sf(t,e){return ba(e).filter(r=>!(0,qi.alwaysValidSchema)(t,e[r]))}T.schemaProperties=Sf;function Df({schemaCode:t,data:e,it:{gen:r,topSchemaRef:n,schemaPath:i,errorPath:o},it:s},a,c,d){let u=d?(0,H._)`${t}, ${e}, ${n}${i}`:e,l=[[Ge.default.instancePath,(0,H.strConcat)(Ge.default.instancePath,o)],[Ge.default.parentData,s.parentData],[Ge.default.parentDataProperty,s.parentDataProperty],[Ge.default.rootData,Ge.default.rootData]];s.opts.dynamicRef&&l.push([Ge.default.dynamicAnchors,Ge.default.dynamicAnchors]);let p=(0,H._)`${u}, ${r.object(...l)}`;return c!==H.nil?(0,H._)`${a}.call(${c}, ${p})`:(0,H._)`${a}(${p})`}T.callValidateCode=Df;var jf=(0,H._)`new RegExp`;function Rf({gen:t,it:{opts:e}},r){let n=e.unicodeRegExp?"u":"",{regExp:i}=e.code,o=i(r,n);return t.scopeValue("pattern",{key:o.toString(),ref:o,code:(0,H._)`${i.code==="new RegExp"?jf:(0,Pf.useFunc)(t,i)}(${r}, ${n})`})}T.usePattern=Rf;function kf(t){let{gen:e,data:r,keyword:n,it:i}=t,o=e.name("valid");if(i.allErrors){let a=e.let("valid",!0);return s(()=>e.assign(a,!1)),a}return e.var(o,!0),s(()=>e.break()),o;function s(a){let c=e.const("len",(0,H._)`${r}.length`);e.forRange("i",0,c,d=>{t.subschema({keyword:n,dataProp:d,dataPropType:qi.Type.Num},o),e.if((0,H.not)(o),a)})}}T.validateArray=kf;function Of(t){let{gen:e,schema:r,keyword:n,it:i}=t;if(!Array.isArray(r))throw new Error("ajv implementation error");if(r.some(c=>(0,qi.alwaysValidSchema)(i,c))&&!i.opts.unevaluated)return;let s=e.let("valid",!1),a=e.name("_valid");e.block(()=>r.forEach((c,d)=>{let u=t.subschema({keyword:n,schemaProp:d,compositeRule:!0},a);e.assign(s,(0,H._)`${s} || ${a}`),t.mergeValidEvaluated(u,a)||e.if((0,H.not)(s))})),t.result(s,()=>t.reset(),()=>t.error(!0))}T.validateUnion=Of});var Ea=y(Re=>{"use strict";Object.defineProperty(Re,"__esModule",{value:!0});Re.validateKeywordUsage=Re.validSchemaType=Re.funcKeywordCode=Re.macroKeywordCode=void 0;var oe=$(),it=qe(),Nf=we(),Mf=ar();function Af(t,e){let{gen:r,keyword:n,schema:i,parentSchema:o,it:s}=t,a=e.macro.call(s.self,i,o,s),c=Pa(r,n,a);s.opts.validateSchema!==!1&&s.self.validateSchema(a,!0);let d=r.name("valid");t.subschema({schema:a,schemaPath:oe.nil,errSchemaPath:`${s.errSchemaPath}/${n}`,topSchemaRef:c,compositeRule:!0},d),t.pass(d,()=>t.error(!0))}Re.macroKeywordCode=Af;function Tf(t,e){var r;let{gen:n,keyword:i,schema:o,parentSchema:s,$data:a,it:c}=t;qf(c,e);let d=!a&&e.compile?e.compile.call(c.self,o,s,c):e.validate,u=Pa(n,i,d),l=n.let("valid");t.block$data(l,p),t.ok((r=e.valid)!==null&&r!==void 0?r:l);function p(){if(e.errors===!1)m(),e.modifying&&xa(t),g(()=>t.error());else{let v=e.async?f():h();e.modifying&&xa(t),g(()=>Cf(t,v))}}function f(){let v=n.let("ruleErrs",null);return n.try(()=>m((0,oe._)`await `),E=>n.assign(l,!1).if((0,oe._)`${E} instanceof ${c.ValidationError}`,()=>n.assign(v,(0,oe._)`${E}.errors`),()=>n.throw(E))),v}function h(){let v=(0,oe._)`${u}.errors`;return n.assign(v,null),m(oe.nil),v}function m(v=e.async?(0,oe._)`await `:oe.nil){let E=c.opts.passContext?it.default.this:it.default.self,b=!("compile"in e&&!a||e.schema===!1);n.assign(l,(0,oe._)`${v}${(0,Nf.callValidateCode)(t,u,E,b)}`,e.modifying)}function g(v){var E;n.if((0,oe.not)((E=e.valid)!==null&&E!==void 0?E:l),v)}}Re.funcKeywordCode=Tf;function xa(t){let{gen:e,data:r,it:n}=t;e.if(n.parentData,()=>e.assign(r,(0,oe._)`${n.parentData}[${n.parentDataProperty}]`))}function Cf(t,e){let{gen:r}=t;r.if((0,oe._)`Array.isArray(${e})`,()=>{r.assign(it.default.vErrors,(0,oe._)`${it.default.vErrors} === null ? ${e} : ${it.default.vErrors}.concat(${e})`).assign(it.default.errors,(0,oe._)`${it.default.vErrors}.length`),(0,Mf.extendErrors)(t)},()=>t.error())}function qf({schemaEnv:t},e){if(e.async&&!t.$async)throw new Error("async keyword in sync schema")}function Pa(t,e,r){if(r===void 0)throw new Error(`keyword "${e}" failed to compile`);return t.scopeValue("keyword",typeof r=="function"?{ref:r}:{ref:r,code:(0,oe.stringify)(r)})}function Hf(t,e,r=!1){return!e.length||e.some(n=>n==="array"?Array.isArray(t):n==="object"?t&&typeof t=="object"&&!Array.isArray(t):typeof t==n||r&&typeof t>"u")}Re.validSchemaType=Hf;function Ff({schema:t,opts:e,self:r,errSchemaPath:n},i,o){if(Array.isArray(i.keyword)?!i.keyword.includes(o):i.keyword!==o)throw new Error("ajv implementation error");let s=i.dependencies;if(s?.some(a=>!Object.prototype.hasOwnProperty.call(t,a)))throw new Error(`parent schema must have dependencies of ${o}: ${s.join(",")}`);if(i.validateSchema&&!i.validateSchema(t[o])){let c=`keyword "${o}" value is invalid at path "${n}": `+r.errorsText(i.validateSchema.errors);if(e.validateSchema==="log")r.logger.error(c);else throw new Error(c)}}Re.validateKeywordUsage=Ff});var _a=y(We=>{"use strict";Object.defineProperty(We,"__esModule",{value:!0});We.extendSubschemaMode=We.extendSubschemaData=We.getSubschema=void 0;var ke=$(),Ia=O();function zf(t,{keyword:e,schemaProp:r,schema:n,schemaPath:i,errSchemaPath:o,topSchemaRef:s}){if(e!==void 0&&n!==void 0)throw new Error('both "keyword" and "schema" passed, only one allowed');if(e!==void 0){let a=t.schema[e];return r===void 0?{schema:a,schemaPath:(0,ke._)`${t.schemaPath}${(0,ke.getProperty)(e)}`,errSchemaPath:`${t.errSchemaPath}/${e}`}:{schema:a[r],schemaPath:(0,ke._)`${t.schemaPath}${(0,ke.getProperty)(e)}${(0,ke.getProperty)(r)}`,errSchemaPath:`${t.errSchemaPath}/${e}/${(0,Ia.escapeFragment)(r)}`}}if(n!==void 0){if(i===void 0||o===void 0||s===void 0)throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');return{schema:n,schemaPath:i,topSchemaRef:s,errSchemaPath:o}}throw new Error('either "keyword" or "schema" must be passed')}We.getSubschema=zf;function Bf(t,e,{dataProp:r,dataPropType:n,data:i,dataTypes:o,propertyName:s}){if(i!==void 0&&r!==void 0)throw new Error('both "data" and "dataProp" passed, only one allowed');let{gen:a}=e;if(r!==void 0){let{errorPath:d,dataPathArr:u,opts:l}=e,p=a.let("data",(0,ke._)`${e.data}${(0,ke.getProperty)(r)}`,!0);c(p),t.errorPath=(0,ke.str)`${d}${(0,Ia.getErrorPath)(r,n,l.jsPropertySyntax)}`,t.parentDataProperty=(0,ke._)`${r}`,t.dataPathArr=[...u,t.parentDataProperty]}if(i!==void 0){let d=i instanceof ke.Name?i:a.let("data",i,!0);c(d),s!==void 0&&(t.propertyName=s)}o&&(t.dataTypes=o);function c(d){t.data=d,t.dataLevel=e.dataLevel+1,t.dataTypes=[],e.definedProperties=new Set,t.parentData=e.data,t.dataNames=[...e.dataNames,d]}}We.extendSubschemaData=Bf;function Lf(t,{jtdDiscriminator:e,jtdMetadata:r,compositeRule:n,createErrors:i,allErrors:o}){n!==void 0&&(t.compositeRule=n),i!==void 0&&(t.createErrors=i),o!==void 0&&(t.allErrors=o),t.jtdDiscriminator=e,t.jtdMetadata=r}We.extendSubschemaMode=Lf});var zi=y((f0,$a)=>{"use strict";$a.exports=function t(e,r){if(e===r)return!0;if(e&&r&&typeof e=="object"&&typeof r=="object"){if(e.constructor!==r.constructor)return!1;var n,i,o;if(Array.isArray(e)){if(n=e.length,n!=r.length)return!1;for(i=n;i--!==0;)if(!t(e[i],r[i]))return!1;return!0}if(e.constructor===RegExp)return e.source===r.source&&e.flags===r.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===r.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===r.toString();if(o=Object.keys(e),n=o.length,n!==Object.keys(r).length)return!1;for(i=n;i--!==0;)if(!Object.prototype.hasOwnProperty.call(r,o[i]))return!1;for(i=n;i--!==0;){var s=o[i];if(!t(e[s],r[s]))return!1}return!0}return e!==e&&r!==r}});var Da=y((h0,Sa)=>{"use strict";var Ye=Sa.exports=function(t,e,r){typeof e=="function"&&(r=e,e={}),r=e.cb||r;var n=typeof r=="function"?r:r.pre||function(){},i=r.post||function(){};hn(e,n,i,t,"",t)};Ye.keywords={additionalItems:!0,items:!0,contains:!0,additionalProperties:!0,propertyNames:!0,not:!0,if:!0,then:!0,else:!0};Ye.arrayKeywords={items:!0,allOf:!0,anyOf:!0,oneOf:!0};Ye.propsKeywords={$defs:!0,definitions:!0,properties:!0,patternProperties:!0,dependencies:!0};Ye.skipKeywords={default:!0,enum:!0,const:!0,required:!0,maximum:!0,minimum:!0,exclusiveMaximum:!0,exclusiveMinimum:!0,multipleOf:!0,maxLength:!0,minLength:!0,pattern:!0,format:!0,maxItems:!0,minItems:!0,uniqueItems:!0,maxProperties:!0,minProperties:!0};function hn(t,e,r,n,i,o,s,a,c,d){if(n&&typeof n=="object"&&!Array.isArray(n)){e(n,i,o,s,a,c,d);for(var u in n){var l=n[u];if(Array.isArray(l)){if(u in Ye.arrayKeywords)for(var p=0;p<l.length;p++)hn(t,e,r,l[p],i+"/"+u+"/"+p,o,i,u,n,p)}else if(u in Ye.propsKeywords){if(l&&typeof l=="object")for(var f in l)hn(t,e,r,l[f],i+"/"+u+"/"+Uf(f),o,i,u,n,f)}else(u in Ye.keywords||t.allKeys&&!(u in Ye.skipKeywords))&&hn(t,e,r,l,i+"/"+u,o,i,u,n)}r(n,i,o,s,a,c,d)}}function Uf(t){return t.replace(/~/g,"~0").replace(/\//g,"~1")}});var dr=y(le=>{"use strict";Object.defineProperty(le,"__esModule",{value:!0});le.getSchemaRefs=le.resolveUrl=le.normalizeId=le._getFullPath=le.getFullPath=le.inlineRef=void 0;var Vf=O(),Gf=zi(),Wf=Da(),Yf=new Set(["type","format","pattern","maxLength","minLength","maxProperties","minProperties","maxItems","minItems","maximum","minimum","uniqueItems","multipleOf","required","enum","const"]);function Kf(t,e=!0){return typeof t=="boolean"?!0:e===!0?!Bi(t):e?ja(t)<=e:!1}le.inlineRef=Kf;var Xf=new Set(["$ref","$recursiveRef","$recursiveAnchor","$dynamicRef","$dynamicAnchor"]);function Bi(t){for(let e in t){if(Xf.has(e))return!0;let r=t[e];if(Array.isArray(r)&&r.some(Bi)||typeof r=="object"&&Bi(r))return!0}return!1}function ja(t){let e=0;for(let r in t){if(r==="$ref")return 1/0;if(e++,!Yf.has(r)&&(typeof t[r]=="object"&&(0,Vf.eachItem)(t[r],n=>e+=ja(n)),e===1/0))return 1/0}return e}function Ra(t,e="",r){r!==!1&&(e=$t(e));let n=t.parse(e);return ka(t,n)}le.getFullPath=Ra;function ka(t,e){return t.serialize(e).split("#")[0]+"#"}le._getFullPath=ka;var Jf=/#\/?$/;function $t(t){return t?t.replace(Jf,""):""}le.normalizeId=$t;function Qf(t,e,r){return r=$t(r),t.resolve(e,r)}le.resolveUrl=Qf;var Zf=/^[a-z_][-a-z0-9._]*$/i;function eh(t,e){if(typeof t=="boolean")return{};let{schemaId:r,uriResolver:n}=this.opts,i=$t(t[r]||e),o={"":i},s=Ra(n,i,!1),a={},c=new Set;return Wf(t,{allKeys:!0},(l,p,f,h)=>{if(h===void 0)return;let m=s+p,g=o[h];typeof l[r]=="string"&&(g=v.call(this,l[r])),E.call(this,l.$anchor),E.call(this,l.$dynamicAnchor),o[p]=g;function v(b){let R=this.opts.uriResolver.resolve;if(b=$t(g?R(g,b):b),c.has(b))throw u(b);c.add(b);let x=this.refs[b];return typeof x=="string"&&(x=this.refs[x]),typeof x=="object"?d(l,x.schema,b):b!==$t(m)&&(b[0]==="#"?(d(l,a[b],b),a[b]=l):this.refs[b]=m),b}function E(b){if(typeof b=="string"){if(!Zf.test(b))throw new Error(`invalid anchor "${b}"`);v.call(this,`#${b}`)}}}),a;function d(l,p,f){if(p!==void 0&&!Gf(l,p))throw u(f)}function u(l){return new Error(`reference "${l}" resolves to more than one schema`)}}le.getSchemaRefs=eh});var pr=y(Ke=>{"use strict";Object.defineProperty(Ke,"__esModule",{value:!0});Ke.getData=Ke.KeywordCxt=Ke.validateFunctionCode=void 0;var Ta=la(),Oa=cr(),Ui=Mi(),mn=cr(),th=ya(),lr=Ea(),Li=_a(),w=$(),P=qe(),rh=dr(),He=O(),ur=ar();function nh(t){if(Ha(t)&&(Fa(t),qa(t))){sh(t);return}Ca(t,()=>(0,Ta.topBoolOrEmptySchema)(t))}Ke.validateFunctionCode=nh;function Ca({gen:t,validateName:e,schema:r,schemaEnv:n,opts:i},o){i.code.es5?t.func(e,(0,w._)`${P.default.data}, ${P.default.valCxt}`,n.$async,()=>{t.code((0,w._)`"use strict"; ${Na(r,i)}`),oh(t,i),t.code(o)}):t.func(e,(0,w._)`${P.default.data}, ${ih(i)}`,n.$async,()=>t.code(Na(r,i)).code(o))}function ih(t){return(0,w._)`{${P.default.instancePath}="", ${P.default.parentData}, ${P.default.parentDataProperty}, ${P.default.rootData}=${P.default.data}${t.dynamicRef?(0,w._)`, ${P.default.dynamicAnchors}={}`:w.nil}}={}`}function oh(t,e){t.if(P.default.valCxt,()=>{t.var(P.default.instancePath,(0,w._)`${P.default.valCxt}.${P.default.instancePath}`),t.var(P.default.parentData,(0,w._)`${P.default.valCxt}.${P.default.parentData}`),t.var(P.default.parentDataProperty,(0,w._)`${P.default.valCxt}.${P.default.parentDataProperty}`),t.var(P.default.rootData,(0,w._)`${P.default.valCxt}.${P.default.rootData}`),e.dynamicRef&&t.var(P.default.dynamicAnchors,(0,w._)`${P.default.valCxt}.${P.default.dynamicAnchors}`)},()=>{t.var(P.default.instancePath,(0,w._)`""`),t.var(P.default.parentData,(0,w._)`undefined`),t.var(P.default.parentDataProperty,(0,w._)`undefined`),t.var(P.default.rootData,P.default.data),e.dynamicRef&&t.var(P.default.dynamicAnchors,(0,w._)`{}`)})}function sh(t){let{schema:e,opts:r,gen:n}=t;Ca(t,()=>{r.$comment&&e.$comment&&Ba(t),lh(t),n.let(P.default.vErrors,null),n.let(P.default.errors,0),r.unevaluated&&ah(t),za(t),hh(t)})}function ah(t){let{gen:e,validateName:r}=t;t.evaluated=e.const("evaluated",(0,w._)`${r}.evaluated`),e.if((0,w._)`${t.evaluated}.dynamicProps`,()=>e.assign((0,w._)`${t.evaluated}.props`,(0,w._)`undefined`)),e.if((0,w._)`${t.evaluated}.dynamicItems`,()=>e.assign((0,w._)`${t.evaluated}.items`,(0,w._)`undefined`))}function Na(t,e){let r=typeof t=="object"&&t[e.schemaId];return r&&(e.code.source||e.code.process)?(0,w._)`/*# sourceURL=${r} */`:w.nil}function ch(t,e){if(Ha(t)&&(Fa(t),qa(t))){dh(t,e);return}(0,Ta.boolOrEmptySchema)(t,e)}function qa({schema:t,self:e}){if(typeof t=="boolean")return!t;for(let r in t)if(e.RULES.all[r])return!0;return!1}function Ha(t){return typeof t.schema!="boolean"}function dh(t,e){let{schema:r,gen:n,opts:i}=t;i.$comment&&r.$comment&&Ba(t),ph(t),fh(t);let o=n.const("_errs",P.default.errors);za(t,o),n.var(e,(0,w._)`${o} === ${P.default.errors}`)}function Fa(t){(0,He.checkUnknownRules)(t),uh(t)}function za(t,e){if(t.opts.jtd)return Ma(t,[],!1,e);let r=(0,Oa.getSchemaTypes)(t.schema),n=(0,Oa.coerceAndCheckDataType)(t,r);Ma(t,r,!n,e)}function uh(t){let{schema:e,errSchemaPath:r,opts:n,self:i}=t;e.$ref&&n.ignoreKeywordsWithRef&&(0,He.schemaHasRulesButRef)(e,i.RULES)&&i.logger.warn(`$ref: keywords ignored in schema at path "${r}"`)}function lh(t){let{schema:e,opts:r}=t;e.default!==void 0&&r.useDefaults&&r.strictSchema&&(0,He.checkStrictMode)(t,"default is ignored in the schema root")}function ph(t){let e=t.schema[t.opts.schemaId];e&&(t.baseId=(0,rh.resolveUrl)(t.opts.uriResolver,t.baseId,e))}function fh(t){if(t.schema.$async&&!t.schemaEnv.$async)throw new Error("async schema in sync schema")}function Ba({gen:t,schemaEnv:e,schema:r,errSchemaPath:n,opts:i}){let o=r.$comment;if(i.$comment===!0)t.code((0,w._)`${P.default.self}.logger.log(${o})`);else if(typeof i.$comment=="function"){let s=(0,w.str)`${n}/$comment`,a=t.scopeValue("root",{ref:e.root});t.code((0,w._)`${P.default.self}.opts.$comment(${o}, ${s}, ${a}.schema)`)}}function hh(t){let{gen:e,schemaEnv:r,validateName:n,ValidationError:i,opts:o}=t;r.$async?e.if((0,w._)`${P.default.errors} === 0`,()=>e.return(P.default.data),()=>e.throw((0,w._)`new ${i}(${P.default.vErrors})`)):(e.assign((0,w._)`${n}.errors`,P.default.vErrors),o.unevaluated&&mh(t),e.return((0,w._)`${P.default.errors} === 0`))}function mh({gen:t,evaluated:e,props:r,items:n}){r instanceof w.Name&&t.assign((0,w._)`${e}.props`,r),n instanceof w.Name&&t.assign((0,w._)`${e}.items`,n)}function Ma(t,e,r,n){let{gen:i,schema:o,data:s,allErrors:a,opts:c,self:d}=t,{RULES:u}=d;if(o.$ref&&(c.ignoreKeywordsWithRef||!(0,He.schemaHasRulesButRef)(o,u))){i.block(()=>Ua(t,"$ref",u.all.$ref.definition));return}c.jtd||gh(t,e),i.block(()=>{for(let p of u.rules)l(p);l(u.post)});function l(p){(0,Ui.shouldUseGroup)(o,p)&&(p.type?(i.if((0,mn.checkDataType)(p.type,s,c.strictNumbers)),Aa(t,p),e.length===1&&e[0]===p.type&&r&&(i.else(),(0,mn.reportTypeError)(t)),i.endIf()):Aa(t,p),a||i.if((0,w._)`${P.default.errors} === ${n||0}`))}}function Aa(t,e){let{gen:r,schema:n,opts:{useDefaults:i}}=t;i&&(0,th.assignDefaults)(t,e.type),r.block(()=>{for(let o of e.rules)(0,Ui.shouldUseRule)(n,o)&&Ua(t,o.keyword,o.definition,e.type)})}function gh(t,e){t.schemaEnv.meta||!t.opts.strictTypes||(vh(t,e),t.opts.allowUnionTypes||yh(t,e),wh(t,t.dataTypes))}function vh(t,e){if(e.length){if(!t.dataTypes.length){t.dataTypes=e;return}e.forEach(r=>{La(t.dataTypes,r)||Vi(t,`type "${r}" not allowed by context "${t.dataTypes.join(",")}"`)}),xh(t,e)}}function yh(t,e){e.length>1&&!(e.length===2&&e.includes("null"))&&Vi(t,"use allowUnionTypes to allow union type keyword")}function wh(t,e){let r=t.self.RULES.all;for(let n in r){let i=r[n];if(typeof i=="object"&&(0,Ui.shouldUseRule)(t.schema,i)){let{type:o}=i.definition;o.length&&!o.some(s=>bh(e,s))&&Vi(t,`missing type "${o.join(",")}" for keyword "${n}"`)}}}function bh(t,e){return t.includes(e)||e==="number"&&t.includes("integer")}function La(t,e){return t.includes(e)||e==="integer"&&t.includes("number")}function xh(t,e){let r=[];for(let n of t.dataTypes)La(e,n)?r.push(n):e.includes("integer")&&n==="number"&&r.push("integer");t.dataTypes=r}function Vi(t,e){let r=t.schemaEnv.baseId+t.errSchemaPath;e+=` at "${r}" (strictTypes)`,(0,He.checkStrictMode)(t,e,t.opts.strictTypes)}var gn=class{constructor(e,r,n){if((0,lr.validateKeywordUsage)(e,r,n),this.gen=e.gen,this.allErrors=e.allErrors,this.keyword=n,this.data=e.data,this.schema=e.schema[n],this.$data=r.$data&&e.opts.$data&&this.schema&&this.schema.$data,this.schemaValue=(0,He.schemaRefOrVal)(e,this.schema,n,this.$data),this.schemaType=r.schemaType,this.parentSchema=e.schema,this.params={},this.it=e,this.def=r,this.$data)this.schemaCode=e.gen.const("vSchema",Va(this.$data,e));else if(this.schemaCode=this.schemaValue,!(0,lr.validSchemaType)(this.schema,r.schemaType,r.allowUndefined))throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);("code"in r?r.trackErrors:r.errors!==!1)&&(this.errsCount=e.gen.const("_errs",P.default.errors))}result(e,r,n){this.failResult((0,w.not)(e),r,n)}failResult(e,r,n){this.gen.if(e),n?n():this.error(),r?(this.gen.else(),r(),this.allErrors&&this.gen.endIf()):this.allErrors?this.gen.endIf():this.gen.else()}pass(e,r){this.failResult((0,w.not)(e),void 0,r)}fail(e){if(e===void 0){this.error(),this.allErrors||this.gen.if(!1);return}this.gen.if(e),this.error(),this.allErrors?this.gen.endIf():this.gen.else()}fail$data(e){if(!this.$data)return this.fail(e);let{schemaCode:r}=this;this.fail((0,w._)`${r} !== undefined && (${(0,w.or)(this.invalid$data(),e)})`)}error(e,r,n){if(r){this.setParams(r),this._error(e,n),this.setParams({});return}this._error(e,n)}_error(e,r){(e?ur.reportExtraError:ur.reportError)(this,this.def.error,r)}$dataError(){(0,ur.reportError)(this,this.def.$dataError||ur.keyword$DataError)}reset(){if(this.errsCount===void 0)throw new Error('add "trackErrors" to keyword definition');(0,ur.resetErrorsCount)(this.gen,this.errsCount)}ok(e){this.allErrors||this.gen.if(e)}setParams(e,r){r?Object.assign(this.params,e):this.params=e}block$data(e,r,n=w.nil){this.gen.block(()=>{this.check$data(e,n),r()})}check$data(e=w.nil,r=w.nil){if(!this.$data)return;let{gen:n,schemaCode:i,schemaType:o,def:s}=this;n.if((0,w.or)((0,w._)`${i} === undefined`,r)),e!==w.nil&&n.assign(e,!0),(o.length||s.validateSchema)&&(n.elseIf(this.invalid$data()),this.$dataError(),e!==w.nil&&n.assign(e,!1)),n.else()}invalid$data(){let{gen:e,schemaCode:r,schemaType:n,def:i,it:o}=this;return(0,w.or)(s(),a());function s(){if(n.length){if(!(r instanceof w.Name))throw new Error("ajv implementation error");let c=Array.isArray(n)?n:[n];return(0,w._)`${(0,mn.checkDataTypes)(c,r,o.opts.strictNumbers,mn.DataType.Wrong)}`}return w.nil}function a(){if(i.validateSchema){let c=e.scopeValue("validate$data",{ref:i.validateSchema});return(0,w._)`!${c}(${r})`}return w.nil}}subschema(e,r){let n=(0,Li.getSubschema)(this.it,e);(0,Li.extendSubschemaData)(n,this.it,e),(0,Li.extendSubschemaMode)(n,e);let i={...this.it,...n,items:void 0,props:void 0};return ch(i,r),i}mergeEvaluated(e,r){let{it:n,gen:i}=this;n.opts.unevaluated&&(n.props!==!0&&e.props!==void 0&&(n.props=He.mergeEvaluated.props(i,e.props,n.props,r)),n.items!==!0&&e.items!==void 0&&(n.items=He.mergeEvaluated.items(i,e.items,n.items,r)))}mergeValidEvaluated(e,r){let{it:n,gen:i}=this;if(n.opts.unevaluated&&(n.props!==!0||n.items!==!0))return i.if(r,()=>this.mergeEvaluated(e,w.Name)),!0}};Ke.KeywordCxt=gn;function Ua(t,e,r,n){let i=new gn(t,r,e);"code"in r?r.code(i,n):i.$data&&r.validate?(0,lr.funcKeywordCode)(i,r):"macro"in r?(0,lr.macroKeywordCode)(i,r):(r.compile||r.validate)&&(0,lr.funcKeywordCode)(i,r)}var Ph=/^\/(?:[^~]|~0|~1)*$/,Eh=/^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;function Va(t,{dataLevel:e,dataNames:r,dataPathArr:n}){let i,o;if(t==="")return P.default.rootData;if(t[0]==="/"){if(!Ph.test(t))throw new Error(`Invalid JSON-pointer: ${t}`);i=t,o=P.default.rootData}else{let d=Eh.exec(t);if(!d)throw new Error(`Invalid JSON-pointer: ${t}`);let u=+d[1];if(i=d[2],i==="#"){if(u>=e)throw new Error(c("property/index",u));return n[e-u]}if(u>e)throw new Error(c("data",u));if(o=r[e-u],!i)return o}let s=o,a=i.split("/");for(let d of a)d&&(o=(0,w._)`${o}${(0,w.getProperty)((0,He.unescapeJsonPointer)(d))}`,s=(0,w._)`${s} && ${o}`);return s;function c(d,u){return`Cannot access ${d} ${u} levels up, current level is ${e}`}}Ke.getData=Va});var vn=y(Wi=>{"use strict";Object.defineProperty(Wi,"__esModule",{value:!0});var Gi=class extends Error{constructor(e){super("validation failed"),this.errors=e,this.ajv=this.validation=!0}};Wi.default=Gi});var fr=y(Xi=>{"use strict";Object.defineProperty(Xi,"__esModule",{value:!0});var Yi=dr(),Ki=class extends Error{constructor(e,r,n,i){super(i||`can't resolve reference ${n} from id ${r}`),this.missingRef=(0,Yi.resolveUrl)(e,r,n),this.missingSchema=(0,Yi.normalizeId)((0,Yi.getFullPath)(e,this.missingRef))}};Xi.default=Ki});var wn=y(be=>{"use strict";Object.defineProperty(be,"__esModule",{value:!0});be.resolveSchema=be.getCompilingSchema=be.resolveRef=be.compileSchema=be.SchemaEnv=void 0;var _e=$(),Ih=vn(),ot=qe(),$e=dr(),Ga=O(),_h=pr(),St=class{constructor(e){var r;this.refs={},this.dynamicAnchors={};let n;typeof e.schema=="object"&&(n=e.schema),this.schema=e.schema,this.schemaId=e.schemaId,this.root=e.root||this,this.baseId=(r=e.baseId)!==null&&r!==void 0?r:(0,$e.normalizeId)(n?.[e.schemaId||"$id"]),this.schemaPath=e.schemaPath,this.localRefs=e.localRefs,this.meta=e.meta,this.$async=n?.$async,this.refs={}}};be.SchemaEnv=St;function Qi(t){let e=Wa.call(this,t);if(e)return e;let r=(0,$e.getFullPath)(this.opts.uriResolver,t.root.baseId),{es5:n,lines:i}=this.opts.code,{ownProperties:o}=this.opts,s=new _e.CodeGen(this.scope,{es5:n,lines:i,ownProperties:o}),a;t.$async&&(a=s.scopeValue("Error",{ref:Ih.default,code:(0,_e._)`require("ajv/dist/runtime/validation_error").default`}));let c=s.scopeName("validate");t.validateName=c;let d={gen:s,allErrors:this.opts.allErrors,data:ot.default.data,parentData:ot.default.parentData,parentDataProperty:ot.default.parentDataProperty,dataNames:[ot.default.data],dataPathArr:[_e.nil],dataLevel:0,dataTypes:[],definedProperties:new Set,topSchemaRef:s.scopeValue("schema",this.opts.code.source===!0?{ref:t.schema,code:(0,_e.stringify)(t.schema)}:{ref:t.schema}),validateName:c,ValidationError:a,schema:t.schema,schemaEnv:t,rootId:r,baseId:t.baseId||r,schemaPath:_e.nil,errSchemaPath:t.schemaPath||(this.opts.jtd?"":"#"),errorPath:(0,_e._)`""`,opts:this.opts,self:this},u;try{this._compilations.add(t),(0,_h.validateFunctionCode)(d),s.optimize(this.opts.code.optimize);let l=s.toString();u=`${s.scopeRefs(ot.default.scope)}return ${l}`,this.opts.code.process&&(u=this.opts.code.process(u,t));let f=new Function(`${ot.default.self}`,`${ot.default.scope}`,u)(this,this.scope.get());if(this.scope.value(c,{ref:f}),f.errors=null,f.schema=t.schema,f.schemaEnv=t,t.$async&&(f.$async=!0),this.opts.code.source===!0&&(f.source={validateName:c,validateCode:l,scopeValues:s._values}),this.opts.unevaluated){let{props:h,items:m}=d;f.evaluated={props:h instanceof _e.Name?void 0:h,items:m instanceof _e.Name?void 0:m,dynamicProps:h instanceof _e.Name,dynamicItems:m instanceof _e.Name},f.source&&(f.source.evaluated=(0,_e.stringify)(f.evaluated))}return t.validate=f,t}catch(l){throw delete t.validate,delete t.validateName,u&&this.logger.error("Error compiling schema, function code:",u),l}finally{this._compilations.delete(t)}}be.compileSchema=Qi;function $h(t,e,r){var n;r=(0,$e.resolveUrl)(this.opts.uriResolver,e,r);let i=t.refs[r];if(i)return i;let o=jh.call(this,t,r);if(o===void 0){let s=(n=t.localRefs)===null||n===void 0?void 0:n[r],{schemaId:a}=this.opts;s&&(o=new St({schema:s,schemaId:a,root:t,baseId:e}))}if(o!==void 0)return t.refs[r]=Sh.call(this,o)}be.resolveRef=$h;function Sh(t){return(0,$e.inlineRef)(t.schema,this.opts.inlineRefs)?t.schema:t.validate?t:Qi.call(this,t)}function Wa(t){for(let e of this._compilations)if(Dh(e,t))return e}be.getCompilingSchema=Wa;function Dh(t,e){return t.schema===e.schema&&t.root===e.root&&t.baseId===e.baseId}function jh(t,e){let r;for(;typeof(r=this.refs[e])=="string";)e=r;return r||this.schemas[e]||yn.call(this,t,e)}function yn(t,e){let r=this.opts.uriResolver.parse(e),n=(0,$e._getFullPath)(this.opts.uriResolver,r),i=(0,$e.getFullPath)(this.opts.uriResolver,t.baseId,void 0);if(Object.keys(t.schema).length>0&&n===i)return Ji.call(this,r,t);let o=(0,$e.normalizeId)(n),s=this.refs[o]||this.schemas[o];if(typeof s=="string"){let a=yn.call(this,t,s);return typeof a?.schema!="object"?void 0:Ji.call(this,r,a)}if(typeof s?.schema=="object"){if(s.validate||Qi.call(this,s),o===(0,$e.normalizeId)(e)){let{schema:a}=s,{schemaId:c}=this.opts,d=a[c];return d&&(i=(0,$e.resolveUrl)(this.opts.uriResolver,i,d)),new St({schema:a,schemaId:c,root:t,baseId:i})}return Ji.call(this,r,s)}}be.resolveSchema=yn;var Rh=new Set(["properties","patternProperties","enum","dependencies","definitions"]);function Ji(t,{baseId:e,schema:r,root:n}){var i;if(((i=t.fragment)===null||i===void 0?void 0:i[0])!=="/")return;for(let a of t.fragment.slice(1).split("/")){if(typeof r=="boolean")return;let c=r[(0,Ga.unescapeFragment)(a)];if(c===void 0)return;r=c;let d=typeof r=="object"&&r[this.opts.schemaId];!Rh.has(a)&&d&&(e=(0,$e.resolveUrl)(this.opts.uriResolver,e,d))}let o;if(typeof r!="boolean"&&r.$ref&&!(0,Ga.schemaHasRulesButRef)(r,this.RULES)){let a=(0,$e.resolveUrl)(this.opts.uriResolver,e,r.$ref);o=yn.call(this,n,a)}let{schemaId:s}=this.opts;if(o=o||new St({schema:r,schemaId:s,root:n,baseId:e}),o.schema!==o.root.schema)return o}});var Ya=y((b0,kh)=>{kh.exports={$id:"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",description:"Meta-schema for $data reference (JSON AnySchema extension proposal)",type:"object",required:["$data"],properties:{$data:{type:"string",anyOf:[{format:"relative-json-pointer"},{format:"json-pointer"}]}},additionalProperties:!1}});var to=y((x0,ec)=>{"use strict";var Oh=RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu),Xa=RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u),Zi=RegExp.prototype.test.bind(/^[\da-f]{2}$/iu),Ja=RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu),Nh=RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);function eo(t){let e="",r=0,n=0;for(n=0;n<t.length;n++)if(r=t[n].charCodeAt(0),r!==48){if(!(r>=48&&r<=57||r>=65&&r<=70||r>=97&&r<=102))return"";e+=t[n];break}for(n+=1;n<t.length;n++){if(r=t[n].charCodeAt(0),!(r>=48&&r<=57||r>=65&&r<=70||r>=97&&r<=102))return"";e+=t[n]}return e}var Mh=RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);function Ka(t){return t.length=0,!0}function Ah(t,e,r){if(t.length){let n=eo(t);if(n!=="")e.push(n);else return r.error=!0,!1;t.length=0}return!0}function Th(t){let e=0,r={error:!1,address:"",zone:""},n=[],i=[],o=!1,s=!1,a=Ah;for(let c=0;c<t.length;c++){let d=t[c];if(!(d==="["||d==="]"))if(d===":"){if(o===!0&&(s=!0),!a(i,n,r))break;if(++e>7){r.error=!0;break}c>0&&t[c-1]===":"&&(o=!0),n.push(":");continue}else if(d==="%"){if(!a(i,n,r))break;a=Ka}else{i.push(d);continue}}return i.length&&(a===Ka?r.zone=i.join(""):s?n.push(i.join("")):n.push(eo(i))),r.address=n.join(""),r}function Qa(t){if(Ch(t,":")<2)return{host:t,isIPV6:!1};let e=Th(t);if(e.error)return{host:t,isIPV6:!1};{let r=e.address,n=e.address;return e.zone&&(r+="%"+e.zone,n+="%25"+e.zone),{host:r,isIPV6:!0,escapedHost:n}}}function Ch(t,e){let r=0;for(let n=0;n<t.length;n++)t[n]===e&&r++;return r}function qh(t){let e=t,r=[],n=-1,i=0;for(;i=e.length;){if(i===1){if(e===".")break;if(e==="/"){r.push("/");break}else{r.push(e);break}}else if(i===2){if(e[0]==="."){if(e[1]===".")break;if(e[1]==="/"){e=e.slice(2);continue}}else if(e[0]==="/"&&(e[1]==="."||e[1]==="/")){r.push("/");break}}else if(i===3&&e==="/.."){r.length!==0&&r.pop(),r.push("/");break}if(e[0]==="."){if(e[1]==="."){if(e[2]==="/"){e=e.slice(3);continue}}else if(e[1]==="/"){e=e.slice(2);continue}}else if(e[0]==="/"&&e[1]==="."){if(e[2]==="/"){e=e.slice(2);continue}else if(e[2]==="."&&e[3]==="/"){e=e.slice(3),r.length!==0&&r.pop();continue}}if((n=e.indexOf("/",1))===-1){r.push(e);break}else r.push(e.slice(0,n)),e=e.slice(n)}return r.join("")}var Hh={"@":"%40","/":"%2F","?":"%3F","#":"%23",":":"%3A"},Fh=/[@/?#:]/g,zh=/[@/?#]/g;function Za(t,e){let r=e?zh:Fh;return r.lastIndex=0,t.replace(r,n=>Hh[n])}function Bh(t,e=!1){if(t.indexOf("%")===-1)return t;let r="";for(let n=0;n<t.length;n++){if(t[n]==="%"&&n+2<t.length){let i=t.slice(n+1,n+3);if(Zi(i)){let o=i.toUpperCase(),s=String.fromCharCode(parseInt(o,16));e&&Ja(s)?r+=s:r+="%"+o,n+=2;continue}}r+=t[n]}return r}function Lh(t){let e="";for(let r=0;r<t.length;r++){if(t[r]==="%"&&r+2<t.length){let n=t.slice(r+1,r+3);if(Zi(n)){let i=n.toUpperCase(),o=String.fromCharCode(parseInt(i,16));o!=="."&&Ja(o)?e+=o:e+="%"+i,r+=2;continue}}Nh(t[r])?e+=t[r]:e+=escape(t[r])}return e}function Uh(t){let e="";for(let r=0;r<t.length;r++){if(t[r]==="%"&&r+2<t.length){let n=t.slice(r+1,r+3);if(Zi(n)){e+="%"+n.toUpperCase(),r+=2;continue}}e+=escape(t[r])}return e}function Vh(t){let e=[];if(t.userinfo!==void 0&&(e.push(t.userinfo),e.push("@")),t.host!==void 0){let r=unescape(t.host);if(!Xa(r)){let n=Qa(r);n.isIPV6===!0?r=`[${n.escapedHost}]`:r=Za(r,!1)}e.push(r)}return(typeof t.port=="number"||typeof t.port=="string")&&(e.push(":"),e.push(String(t.port))),e.length?e.join(""):void 0}ec.exports={nonSimpleDomain:Mh,recomposeAuthority:Vh,reescapeHostDelimiters:Za,normalizePercentEncoding:Bh,normalizePathEncoding:Lh,escapePreservingEscapes:Uh,removeDotSegments:qh,isIPv4:Xa,isUUID:Oh,normalizeIPv6:Qa,stringArrayToHexStripped:eo}});var oc=y((P0,ic)=>{"use strict";var{isUUID:Gh}=to(),Wh=/([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu,Yh=["http","https","ws","wss","urn","urn:uuid"];function Kh(t){return Yh.indexOf(t)!==-1}function ro(t){return t.secure===!0?!0:t.secure===!1?!1:t.scheme?t.scheme.length===3&&(t.scheme[0]==="w"||t.scheme[0]==="W")&&(t.scheme[1]==="s"||t.scheme[1]==="S")&&(t.scheme[2]==="s"||t.scheme[2]==="S"):!1}function tc(t){return t.host||(t.error=t.error||"HTTP URIs must have a host."),t}function rc(t){let e=String(t.scheme).toLowerCase()==="https";return(t.port===(e?443:80)||t.port==="")&&(t.port=void 0),t.path||(t.path="/"),t}function Xh(t){return t.secure=ro(t),t.resourceName=(t.path||"/")+(t.query?"?"+t.query:""),t.path=void 0,t.query=void 0,t}function Jh(t){if((t.port===(ro(t)?443:80)||t.port==="")&&(t.port=void 0),typeof t.secure=="boolean"&&(t.scheme=t.secure?"wss":"ws",t.secure=void 0),t.resourceName){let[e,r]=t.resourceName.split("?");t.path=e&&e!=="/"?e:void 0,t.query=r,t.resourceName=void 0}return t.fragment=void 0,t}function Qh(t,e){if(!t.path)return t.error="URN can not be parsed",t;let r=t.path.match(Wh);if(r){let n=e.scheme||t.scheme||"urn";t.nid=r[1].toLowerCase(),t.nss=r[2];let i=`${n}:${e.nid||t.nid}`,o=no(i);t.path=void 0,o&&(t=o.parse(t,e))}else t.error=t.error||"URN can not be parsed.";return t}function Zh(t,e){if(t.nid===void 0)throw new Error("URN without nid cannot be serialized");let r=e.scheme||t.scheme||"urn",n=t.nid.toLowerCase(),i=`${r}:${e.nid||n}`,o=no(i);o&&(t=o.serialize(t,e));let s=t,a=t.nss;return s.path=`${n||e.nid}:${a}`,e.skipEscape=!0,s}function em(t,e){let r=t;return r.uuid=r.nss,r.nss=void 0,!e.tolerant&&(!r.uuid||!Gh(r.uuid))&&(r.error=r.error||"UUID is not valid."),r}function tm(t){let e=t;return e.nss=(t.uuid||"").toLowerCase(),e}var nc={scheme:"http",domainHost:!0,parse:tc,serialize:rc},rm={scheme:"https",domainHost:nc.domainHost,parse:tc,serialize:rc},bn={scheme:"ws",domainHost:!0,parse:Xh,serialize:Jh},nm={scheme:"wss",domainHost:bn.domainHost,parse:bn.parse,serialize:bn.serialize},im={scheme:"urn",parse:Qh,serialize:Zh,skipNormalize:!0},om={scheme:"urn:uuid",parse:em,serialize:tm,skipNormalize:!0},xn={http:nc,https:rm,ws:bn,wss:nm,urn:im,"urn:uuid":om};Object.setPrototypeOf(xn,null);function no(t){return t&&(xn[t]||xn[t.toLowerCase()])||void 0}ic.exports={wsIsSecure:ro,SCHEMES:xn,isValidSchemeName:Kh,getSchemeHandler:no}});var lc=y((E0,Pn)=>{"use strict";var{normalizeIPv6:sm,removeDotSegments:hr,recomposeAuthority:am,normalizePercentEncoding:cm,normalizePathEncoding:dm,escapePreservingEscapes:um,reescapeHostDelimiters:lm,isIPv4:pm,nonSimpleDomain:fm}=to(),{SCHEMES:hm,getSchemeHandler:ac}=oc();function mm(t,e){return typeof t=="string"?t=xm(t,e):typeof t=="object"&&(t=Dt(st(t,e),e)),t}function gm(t,e,r){let n=r?Object.assign({scheme:"null"},r):{scheme:"null"},i=cc(Dt(t,n),Dt(e,n),n,!0);return n.skipEscape=!0,st(i,n)}function cc(t,e,r,n){let i={};return n||(t=Dt(st(t,r),r),e=Dt(st(e,r),r)),r=r||{},!r.tolerant&&e.scheme?(i.scheme=e.scheme,i.userinfo=e.userinfo,i.host=e.host,i.port=e.port,i.path=hr(e.path||""),i.query=e.query):(e.userinfo!==void 0||e.host!==void 0||e.port!==void 0?(i.userinfo=e.userinfo,i.host=e.host,i.port=e.port,i.path=hr(e.path||""),i.query=e.query):(e.path?(e.path[0]==="/"?i.path=hr(e.path):((t.userinfo!==void 0||t.host!==void 0||t.port!==void 0)&&!t.path?i.path="/"+e.path:t.path?i.path=t.path.slice(0,t.path.lastIndexOf("/")+1)+e.path:i.path=e.path,i.path=hr(i.path)),i.query=e.query):(i.path=t.path,e.query!==void 0?i.query=e.query:i.query=t.query),i.userinfo=t.userinfo,i.host=t.host,i.port=t.port),i.scheme=t.scheme),i.fragment=e.fragment,i}function vm(t,e,r){let n=sc(t,r),i=sc(e,r);return n!==void 0&&i!==void 0&&n.toLowerCase()===i.toLowerCase()}function st(t,e){let r={host:t.host,scheme:t.scheme,userinfo:t.userinfo,port:t.port,path:t.path,query:t.query,nid:t.nid,nss:t.nss,uuid:t.uuid,fragment:t.fragment,reference:t.reference,resourceName:t.resourceName,secure:t.secure,error:""},n=Object.assign({},e),i=[],o=ac(n.scheme||r.scheme);o&&o.serialize&&o.serialize(r,n),r.path!==void 0&&(n.skipEscape?r.path=cm(r.path):(r.path=um(r.path),r.scheme!==void 0&&(r.path=r.path.split("%3A").join(":")))),n.reference!=="suffix"&&r.scheme&&i.push(r.scheme,":");let s=am(r);if(s!==void 0&&(n.reference!=="suffix"&&i.push("//"),i.push(s),r.path&&r.path[0]!=="/"&&i.push("/")),r.path!==void 0){let a=r.path;!n.absolutePath&&(!o||!o.absolutePath)&&(a=hr(a)),s===void 0&&a[0]==="/"&&a[1]==="/"&&(a="/%2F"+a.slice(2)),i.push(a)}return r.query!==void 0&&i.push("?",r.query),r.fragment!==void 0&&i.push("#",r.fragment),i.join("")}var ym=/^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u,wm=/^(?:[^#/:?]+:)?\/\/([^/?#]*)/;function bm(t,e){if(e[2]!==void 0&&t.path&&t.path[0]!=="/")return'URI path must start with "/" when authority is present.';if(typeof t.port=="number"&&(t.port<0||t.port>65535))return"URI port is malformed."}function dc(t,e){let r=Object.assign({},e),n={scheme:void 0,userinfo:void 0,host:"",port:void 0,path:"",query:void 0,fragment:void 0},i=!1,o=!1;r.reference==="suffix"&&(r.scheme?t=r.scheme+":"+t:t="//"+t);let s=t.match(wm);s!==null&&s[1].indexOf("\\")!==-1&&(n.error="URI authority must not contain a literal backslash.",i=!0);let a=t.match(ym);if(a){n.scheme=a[1],n.userinfo=a[3],n.host=a[4],n.port=parseInt(a[5],10),n.path=a[6]||"",n.query=a[7],n.fragment=a[8],isNaN(n.port)&&(n.port=a[5]);let c=bm(n,a);if(c!==void 0&&(n.error=n.error||c,i=!0),n.host)if(pm(n.host)===!1){let l=sm(n.host);n.host=l.host.toLowerCase(),o=l.isIPV6}else o=!0;n.scheme===void 0&&n.userinfo===void 0&&n.host===void 0&&n.port===void 0&&n.query===void 0&&!n.path?n.reference="same-document":n.scheme===void 0?n.reference="relative":n.fragment===void 0?n.reference="absolute":n.reference="uri",r.reference&&r.reference!=="suffix"&&r.reference!==n.reference&&(n.error=n.error||"URI is not a "+r.reference+" reference.");let d=ac(r.scheme||n.scheme);if(!r.unicodeSupport&&(!d||!d.unicodeSupport)&&n.host&&(r.domainHost||d&&d.domainHost)&&o===!1&&fm(n.host))try{n.host=new URL("http://"+n.host).hostname}catch(u){n.error=n.error||"Host's domain name can not be converted to ASCII: "+u}if((!d||d&&!d.skipNormalize)&&(t.indexOf("%")!==-1&&(n.scheme!==void 0&&(n.scheme=unescape(n.scheme)),n.host!==void 0&&(n.host=lm(unescape(n.host),o))),n.path&&(n.path=dm(n.path)),n.fragment))try{n.fragment=encodeURI(decodeURIComponent(n.fragment))}catch{n.error=n.error||"URI malformed"}d&&d.parse&&d.parse(n,r)}else n.error=n.error||"URI can not be parsed.";return{parsed:n,malformedAuthorityOrPort:i}}function Dt(t,e){return dc(t,e).parsed}function xm(t,e){return uc(t,e).normalized}function uc(t,e){let{parsed:r,malformedAuthorityOrPort:n}=dc(t,e);return{normalized:n?t:st(r,e),malformedAuthorityOrPort:n}}function sc(t,e){if(typeof t=="string"){let{normalized:r,malformedAuthorityOrPort:n}=uc(t,e);return n?void 0:r}if(typeof t=="object")return st(t,e)}var io={SCHEMES:hm,normalize:mm,resolve:gm,resolveComponent:cc,equal:vm,serialize:st,parse:Dt};Pn.exports=io;Pn.exports.default=io;Pn.exports.fastUri=io});var fc=y(oo=>{"use strict";Object.defineProperty(oo,"__esModule",{value:!0});var pc=lc();pc.code='require("ajv/dist/runtime/uri").default';oo.default=pc});var xc=y(X=>{"use strict";Object.defineProperty(X,"__esModule",{value:!0});X.CodeGen=X.Name=X.nil=X.stringify=X.str=X._=X.KeywordCxt=void 0;var Pm=pr();Object.defineProperty(X,"KeywordCxt",{enumerable:!0,get:function(){return Pm.KeywordCxt}});var jt=$();Object.defineProperty(X,"_",{enumerable:!0,get:function(){return jt._}});Object.defineProperty(X,"str",{enumerable:!0,get:function(){return jt.str}});Object.defineProperty(X,"stringify",{enumerable:!0,get:function(){return jt.stringify}});Object.defineProperty(X,"nil",{enumerable:!0,get:function(){return jt.nil}});Object.defineProperty(X,"Name",{enumerable:!0,get:function(){return jt.Name}});Object.defineProperty(X,"CodeGen",{enumerable:!0,get:function(){return jt.CodeGen}});var Em=vn(),yc=fr(),Im=Ni(),mr=wn(),_m=$(),gr=dr(),En=cr(),ao=O(),hc=Ya(),$m=fc(),wc=(t,e)=>new RegExp(t,e);wc.code="new RegExp";var Sm=["removeAdditional","useDefaults","coerceTypes"],Dm=new Set(["validate","serialize","parse","wrapper","root","schema","keyword","pattern","formats","validate$data","func","obj","Error"]),jm={errorDataPath:"",format:"`validateFormats: false` can be used instead.",nullable:'"nullable" keyword is supported by default.',jsonPointers:"Deprecated jsPropertySyntax can be used instead.",extendRefs:"Deprecated ignoreKeywordsWithRef can be used instead.",missingRefs:"Pass empty schema with $id that should be ignored to ajv.addSchema.",processCode:"Use option `code: {process: (code, schemaEnv: object) => string}`",sourceCode:"Use option `code: {source: true}`",strictDefaults:"It is default now, see option `strict`.",strictKeywords:"It is default now, see option `strict`.",uniqueItems:'"uniqueItems" keyword is always validated.',unknownFormats:"Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",cache:"Map is used as cache, schema object as key.",serialize:"Map is used as cache, schema object as key.",ajvErrors:"It is default now."},Rm={ignoreKeywordsWithRef:"",jsPropertySyntax:"",unicode:'"minLength"/"maxLength" account for unicode characters by default.'},mc=200;function km(t){var e,r,n,i,o,s,a,c,d,u,l,p,f,h,m,g,v,E,b,R,x,Y,A,ge,Dr;let Ft=t.strict,Un=(e=t.code)===null||e===void 0?void 0:e.optimize,cs=Un===!0||Un===void 0?1:Un||0,ds=(n=(r=t.code)===null||r===void 0?void 0:r.regExp)!==null&&n!==void 0?n:wc,Jd=(i=t.uriResolver)!==null&&i!==void 0?i:$m.default;return{strictSchema:(s=(o=t.strictSchema)!==null&&o!==void 0?o:Ft)!==null&&s!==void 0?s:!0,strictNumbers:(c=(a=t.strictNumbers)!==null&&a!==void 0?a:Ft)!==null&&c!==void 0?c:!0,strictTypes:(u=(d=t.strictTypes)!==null&&d!==void 0?d:Ft)!==null&&u!==void 0?u:"log",strictTuples:(p=(l=t.strictTuples)!==null&&l!==void 0?l:Ft)!==null&&p!==void 0?p:"log",strictRequired:(h=(f=t.strictRequired)!==null&&f!==void 0?f:Ft)!==null&&h!==void 0?h:!1,code:t.code?{...t.code,optimize:cs,regExp:ds}:{optimize:cs,regExp:ds},loopRequired:(m=t.loopRequired)!==null&&m!==void 0?m:mc,loopEnum:(g=t.loopEnum)!==null&&g!==void 0?g:mc,meta:(v=t.meta)!==null&&v!==void 0?v:!0,messages:(E=t.messages)!==null&&E!==void 0?E:!0,inlineRefs:(b=t.inlineRefs)!==null&&b!==void 0?b:!0,schemaId:(R=t.schemaId)!==null&&R!==void 0?R:"$id",addUsedSchema:(x=t.addUsedSchema)!==null&&x!==void 0?x:!0,validateSchema:(Y=t.validateSchema)!==null&&Y!==void 0?Y:!0,validateFormats:(A=t.validateFormats)!==null&&A!==void 0?A:!0,unicodeRegExp:(ge=t.unicodeRegExp)!==null&&ge!==void 0?ge:!0,int32range:(Dr=t.int32range)!==null&&Dr!==void 0?Dr:!0,uriResolver:Jd}}var vr=class{constructor(e={}){this.schemas={},this.refs={},this.formats=Object.create(null),this._compilations=new Set,this._loading={},this._cache=new Map,e=this.opts={...e,...km(e)};let{es5:r,lines:n}=this.opts.code;this.scope=new _m.ValueScope({scope:{},prefixes:Dm,es5:r,lines:n}),this.logger=Cm(e.logger);let i=e.validateFormats;e.validateFormats=!1,this.RULES=(0,Im.getRules)(),gc.call(this,jm,e,"NOT SUPPORTED"),gc.call(this,Rm,e,"DEPRECATED","warn"),this._metaOpts=Am.call(this),e.formats&&Nm.call(this),this._addVocabularies(),this._addDefaultMetaSchema(),e.keywords&&Mm.call(this,e.keywords),typeof e.meta=="object"&&this.addMetaSchema(e.meta),Om.call(this),e.validateFormats=i}_addVocabularies(){this.addKeyword("$async")}_addDefaultMetaSchema(){let{$data:e,meta:r,schemaId:n}=this.opts,i=hc;n==="id"&&(i={...hc},i.id=i.$id,delete i.$id),r&&e&&this.addMetaSchema(i,i[n],!1)}defaultMeta(){let{meta:e,schemaId:r}=this.opts;return this.opts.defaultMeta=typeof e=="object"?e[r]||e:void 0}validate(e,r){let n;if(typeof e=="string"){if(n=this.getSchema(e),!n)throw new Error(`no schema with key or ref "${e}"`)}else n=this.compile(e);let i=n(r);return"$async"in n||(this.errors=n.errors),i}compile(e,r){let n=this._addSchema(e,r);return n.validate||this._compileSchemaEnv(n)}compileAsync(e,r){if(typeof this.opts.loadSchema!="function")throw new Error("options.loadSchema should be a function");let{loadSchema:n}=this.opts;return i.call(this,e,r);async function i(u,l){await o.call(this,u.$schema);let p=this._addSchema(u,l);return p.validate||s.call(this,p)}async function o(u){u&&!this.getSchema(u)&&await i.call(this,{$ref:u},!0)}async function s(u){try{return this._compileSchemaEnv(u)}catch(l){if(!(l instanceof yc.default))throw l;return a.call(this,l),await c.call(this,l.missingSchema),s.call(this,u)}}function a({missingSchema:u,missingRef:l}){if(this.refs[u])throw new Error(`AnySchema ${u} is loaded but ${l} cannot be resolved`)}async function c(u){let l=await d.call(this,u);this.refs[u]||await o.call(this,l.$schema),this.refs[u]||this.addSchema(l,u,r)}async function d(u){let l=this._loading[u];if(l)return l;try{return await(this._loading[u]=n(u))}finally{delete this._loading[u]}}}addSchema(e,r,n,i=this.opts.validateSchema){if(Array.isArray(e)){for(let s of e)this.addSchema(s,void 0,n,i);return this}let o;if(typeof e=="object"){let{schemaId:s}=this.opts;if(o=e[s],o!==void 0&&typeof o!="string")throw new Error(`schema ${s} must be string`)}return r=(0,gr.normalizeId)(r||o),this._checkUnique(r),this.schemas[r]=this._addSchema(e,n,r,i,!0),this}addMetaSchema(e,r,n=this.opts.validateSchema){return this.addSchema(e,r,!0,n),this}validateSchema(e,r){if(typeof e=="boolean")return!0;let n;if(n=e.$schema,n!==void 0&&typeof n!="string")throw new Error("$schema must be a string");if(n=n||this.opts.defaultMeta||this.defaultMeta(),!n)return this.logger.warn("meta-schema not available"),this.errors=null,!0;let i=this.validate(n,e);if(!i&&r){let o="schema is invalid: "+this.errorsText();if(this.opts.validateSchema==="log")this.logger.error(o);else throw new Error(o)}return i}getSchema(e){let r;for(;typeof(r=vc.call(this,e))=="string";)e=r;if(r===void 0){let{schemaId:n}=this.opts,i=new mr.SchemaEnv({schema:{},schemaId:n});if(r=mr.resolveSchema.call(this,i,e),!r)return;this.refs[e]=r}return r.validate||this._compileSchemaEnv(r)}removeSchema(e){if(e instanceof RegExp)return this._removeAllSchemas(this.schemas,e),this._removeAllSchemas(this.refs,e),this;switch(typeof e){case"undefined":return this._removeAllSchemas(this.schemas),this._removeAllSchemas(this.refs),this._cache.clear(),this;case"string":{let r=vc.call(this,e);return typeof r=="object"&&this._cache.delete(r.schema),delete this.schemas[e],delete this.refs[e],this}case"object":{let r=e;this._cache.delete(r);let n=e[this.opts.schemaId];return n&&(n=(0,gr.normalizeId)(n),delete this.schemas[n],delete this.refs[n]),this}default:throw new Error("ajv.removeSchema: invalid parameter")}}addVocabulary(e){for(let r of e)this.addKeyword(r);return this}addKeyword(e,r){let n;if(typeof e=="string")n=e,typeof r=="object"&&(this.logger.warn("these parameters are deprecated, see docs for addKeyword"),r.keyword=n);else if(typeof e=="object"&&r===void 0){if(r=e,n=r.keyword,Array.isArray(n)&&!n.length)throw new Error("addKeywords: keyword must be string or non-empty array")}else throw new Error("invalid addKeywords parameters");if(Hm.call(this,n,r),!r)return(0,ao.eachItem)(n,o=>so.call(this,o)),this;zm.call(this,r);let i={...r,type:(0,En.getJSONTypes)(r.type),schemaType:(0,En.getJSONTypes)(r.schemaType)};return(0,ao.eachItem)(n,i.type.length===0?o=>so.call(this,o,i):o=>i.type.forEach(s=>so.call(this,o,i,s))),this}getKeyword(e){let r=this.RULES.all[e];return typeof r=="object"?r.definition:!!r}removeKeyword(e){let{RULES:r}=this;delete r.keywords[e],delete r.all[e];for(let n of r.rules){let i=n.rules.findIndex(o=>o.keyword===e);i>=0&&n.rules.splice(i,1)}return this}addFormat(e,r){return typeof r=="string"&&(r=new RegExp(r)),this.formats[e]=r,this}errorsText(e=this.errors,{separator:r=", ",dataVar:n="data"}={}){return!e||e.length===0?"No errors":e.map(i=>`${n}${i.instancePath} ${i.message}`).reduce((i,o)=>i+r+o)}$dataMetaSchema(e,r){let n=this.RULES.all;e=JSON.parse(JSON.stringify(e));for(let i of r){let o=i.split("/").slice(1),s=e;for(let a of o)s=s[a];for(let a in n){let c=n[a];if(typeof c!="object")continue;let{$data:d}=c.definition,u=s[a];d&&u&&(s[a]=bc(u))}}return e}_removeAllSchemas(e,r){for(let n in e){let i=e[n];(!r||r.test(n))&&(typeof i=="string"?delete e[n]:i&&!i.meta&&(this._cache.delete(i.schema),delete e[n]))}}_addSchema(e,r,n,i=this.opts.validateSchema,o=this.opts.addUsedSchema){let s,{schemaId:a}=this.opts;if(typeof e=="object")s=e[a];else{if(this.opts.jtd)throw new Error("schema must be object");if(typeof e!="boolean")throw new Error("schema must be object or boolean")}let c=this._cache.get(e);if(c!==void 0)return c;n=(0,gr.normalizeId)(s||n);let d=gr.getSchemaRefs.call(this,e,n);return c=new mr.SchemaEnv({schema:e,schemaId:a,meta:r,baseId:n,localRefs:d}),this._cache.set(c.schema,c),o&&!n.startsWith("#")&&(n&&this._checkUnique(n),this.refs[n]=c),i&&this.validateSchema(e,!0),c}_checkUnique(e){if(this.schemas[e]||this.refs[e])throw new Error(`schema with key or id "${e}" already exists`)}_compileSchemaEnv(e){if(e.meta?this._compileMetaSchema(e):mr.compileSchema.call(this,e),!e.validate)throw new Error("ajv implementation error");return e.validate}_compileMetaSchema(e){let r=this.opts;this.opts=this._metaOpts;try{mr.compileSchema.call(this,e)}finally{this.opts=r}}};vr.ValidationError=Em.default;vr.MissingRefError=yc.default;X.default=vr;function gc(t,e,r,n="error"){for(let i in t){let o=i;o in e&&this.logger[n](`${r}: option ${i}. ${t[o]}`)}}function vc(t){return t=(0,gr.normalizeId)(t),this.schemas[t]||this.refs[t]}function Om(){let t=this.opts.schemas;if(t)if(Array.isArray(t))this.addSchema(t);else for(let e in t)this.addSchema(t[e],e)}function Nm(){for(let t in this.opts.formats){let e=this.opts.formats[t];e&&this.addFormat(t,e)}}function Mm(t){if(Array.isArray(t)){this.addVocabulary(t);return}this.logger.warn("keywords option as map is deprecated, pass array");for(let e in t){let r=t[e];r.keyword||(r.keyword=e),this.addKeyword(r)}}function Am(){let t={...this.opts};for(let e of Sm)delete t[e];return t}var Tm={log(){},warn(){},error(){}};function Cm(t){if(t===!1)return Tm;if(t===void 0)return console;if(t.log&&t.warn&&t.error)return t;throw new Error("logger must implement log, warn and error methods")}var qm=/^[a-z_$][a-z0-9_$:-]*$/i;function Hm(t,e){let{RULES:r}=this;if((0,ao.eachItem)(t,n=>{if(r.keywords[n])throw new Error(`Keyword ${n} is already defined`);if(!qm.test(n))throw new Error(`Keyword ${n} has invalid name`)}),!!e&&e.$data&&!("code"in e||"validate"in e))throw new Error('$data keyword must have "code" or "validate" function')}function so(t,e,r){var n;let i=e?.post;if(r&&i)throw new Error('keyword with "post" flag cannot have "type"');let{RULES:o}=this,s=i?o.post:o.rules.find(({type:c})=>c===r);if(s||(s={type:r,rules:[]},o.rules.push(s)),o.keywords[t]=!0,!e)return;let a={keyword:t,definition:{...e,type:(0,En.getJSONTypes)(e.type),schemaType:(0,En.getJSONTypes)(e.schemaType)}};e.before?Fm.call(this,s,a,e.before):s.rules.push(a),o.all[t]=a,(n=e.implements)===null||n===void 0||n.forEach(c=>this.addKeyword(c))}function Fm(t,e,r){let n=t.rules.findIndex(i=>i.keyword===r);n>=0?t.rules.splice(n,0,e):(t.rules.push(e),this.logger.warn(`rule ${r} is not defined`))}function zm(t){let{metaSchema:e}=t;e!==void 0&&(t.$data&&this.opts.$data&&(e=bc(e)),t.validateSchema=this.compile(e,!0))}var Bm={$ref:"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"};function bc(t){return{anyOf:[t,Bm]}}});var Pc=y(co=>{"use strict";Object.defineProperty(co,"__esModule",{value:!0});var Lm={keyword:"id",code(){throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')}};co.default=Lm});var $c=y(at=>{"use strict";Object.defineProperty(at,"__esModule",{value:!0});at.callRef=at.getValidate=void 0;var Um=fr(),Ec=we(),pe=$(),Rt=qe(),Ic=wn(),In=O(),Vm={keyword:"$ref",schemaType:"string",code(t){let{gen:e,schema:r,it:n}=t,{baseId:i,schemaEnv:o,validateName:s,opts:a,self:c}=n,{root:d}=o;if((r==="#"||r==="#/")&&i===d.baseId)return l();let u=Ic.resolveRef.call(c,d,i,r);if(u===void 0)throw new Um.default(n.opts.uriResolver,i,r);if(u instanceof Ic.SchemaEnv)return p(u);return f(u);function l(){if(o===d)return _n(t,s,o,o.$async);let h=e.scopeValue("root",{ref:d});return _n(t,(0,pe._)`${h}.validate`,d,d.$async)}function p(h){let m=_c(t,h);_n(t,m,h,h.$async)}function f(h){let m=e.scopeValue("schema",a.code.source===!0?{ref:h,code:(0,pe.stringify)(h)}:{ref:h}),g=e.name("valid"),v=t.subschema({schema:h,dataTypes:[],schemaPath:pe.nil,topSchemaRef:m,errSchemaPath:r},g);t.mergeEvaluated(v),t.ok(g)}}};function _c(t,e){let{gen:r}=t;return e.validate?r.scopeValue("validate",{ref:e.validate}):(0,pe._)`${r.scopeValue("wrapper",{ref:e})}.validate`}at.getValidate=_c;function _n(t,e,r,n){let{gen:i,it:o}=t,{allErrors:s,schemaEnv:a,opts:c}=o,d=c.passContext?Rt.default.this:pe.nil;n?u():l();function u(){if(!a.$async)throw new Error("async schema referenced by sync schema");let h=i.let("valid");i.try(()=>{i.code((0,pe._)`await ${(0,Ec.callValidateCode)(t,e,d)}`),f(e),s||i.assign(h,!0)},m=>{i.if((0,pe._)`!(${m} instanceof ${o.ValidationError})`,()=>i.throw(m)),p(m),s||i.assign(h,!1)}),t.ok(h)}function l(){t.result((0,Ec.callValidateCode)(t,e,d),()=>f(e),()=>p(e))}function p(h){let m=(0,pe._)`${h}.errors`;i.assign(Rt.default.vErrors,(0,pe._)`${Rt.default.vErrors} === null ? ${m} : ${Rt.default.vErrors}.concat(${m})`),i.assign(Rt.default.errors,(0,pe._)`${Rt.default.vErrors}.length`)}function f(h){var m;if(!o.opts.unevaluated)return;let g=(m=r?.validate)===null||m===void 0?void 0:m.evaluated;if(o.props!==!0)if(g&&!g.dynamicProps)g.props!==void 0&&(o.props=In.mergeEvaluated.props(i,g.props,o.props));else{let v=i.var("props",(0,pe._)`${h}.evaluated.props`);o.props=In.mergeEvaluated.props(i,v,o.props,pe.Name)}if(o.items!==!0)if(g&&!g.dynamicItems)g.items!==void 0&&(o.items=In.mergeEvaluated.items(i,g.items,o.items));else{let v=i.var("items",(0,pe._)`${h}.evaluated.items`);o.items=In.mergeEvaluated.items(i,v,o.items,pe.Name)}}}at.callRef=_n;at.default=Vm});var Sc=y(uo=>{"use strict";Object.defineProperty(uo,"__esModule",{value:!0});var Gm=Pc(),Wm=$c(),Ym=["$schema","$id","$defs","$vocabulary",{keyword:"$comment"},"definitions",Gm.default,Wm.default];uo.default=Ym});var Dc=y(lo=>{"use strict";Object.defineProperty(lo,"__esModule",{value:!0});var $n=$(),Xe=$n.operators,Sn={maximum:{okStr:"<=",ok:Xe.LTE,fail:Xe.GT},minimum:{okStr:">=",ok:Xe.GTE,fail:Xe.LT},exclusiveMaximum:{okStr:"<",ok:Xe.LT,fail:Xe.GTE},exclusiveMinimum:{okStr:">",ok:Xe.GT,fail:Xe.LTE}},Km={message:({keyword:t,schemaCode:e})=>(0,$n.str)`must be ${Sn[t].okStr} ${e}`,params:({keyword:t,schemaCode:e})=>(0,$n._)`{comparison: ${Sn[t].okStr}, limit: ${e}}`},Xm={keyword:Object.keys(Sn),type:"number",schemaType:"number",$data:!0,error:Km,code(t){let{keyword:e,data:r,schemaCode:n}=t;t.fail$data((0,$n._)`${r} ${Sn[e].fail} ${n} || isNaN(${r})`)}};lo.default=Xm});var jc=y(po=>{"use strict";Object.defineProperty(po,"__esModule",{value:!0});var yr=$(),Jm={message:({schemaCode:t})=>(0,yr.str)`must be multiple of ${t}`,params:({schemaCode:t})=>(0,yr._)`{multipleOf: ${t}}`},Qm={keyword:"multipleOf",type:"number",schemaType:"number",$data:!0,error:Jm,code(t){let{gen:e,data:r,schemaCode:n,it:i}=t,o=i.opts.multipleOfPrecision,s=e.let("res"),a=o?(0,yr._)`Math.abs(Math.round(${s}) - ${s}) > 1e-${o}`:(0,yr._)`${s} !== parseInt(${s})`;t.fail$data((0,yr._)`(${n} === 0 || (${s} = ${r}/${n}, ${a}))`)}};po.default=Qm});var kc=y(fo=>{"use strict";Object.defineProperty(fo,"__esModule",{value:!0});function Rc(t){let e=t.length,r=0,n=0,i;for(;n<e;)r++,i=t.charCodeAt(n++),i>=55296&&i<=56319&&n<e&&(i=t.charCodeAt(n),(i&64512)===56320&&n++);return r}fo.default=Rc;Rc.code='require("ajv/dist/runtime/ucs2length").default'});var Oc=y(ho=>{"use strict";Object.defineProperty(ho,"__esModule",{value:!0});var ct=$(),Zm=O(),eg=kc(),tg={message({keyword:t,schemaCode:e}){let r=t==="maxLength"?"more":"fewer";return(0,ct.str)`must NOT have ${r} than ${e} characters`},params:({schemaCode:t})=>(0,ct._)`{limit: ${t}}`},rg={keyword:["maxLength","minLength"],type:"string",schemaType:"number",$data:!0,error:tg,code(t){let{keyword:e,data:r,schemaCode:n,it:i}=t,o=e==="maxLength"?ct.operators.GT:ct.operators.LT,s=i.opts.unicode===!1?(0,ct._)`${r}.length`:(0,ct._)`${(0,Zm.useFunc)(t.gen,eg.default)}(${r})`;t.fail$data((0,ct._)`${s} ${o} ${n}`)}};ho.default=rg});var Nc=y(mo=>{"use strict";Object.defineProperty(mo,"__esModule",{value:!0});var ng=we(),ig=O(),kt=$(),og={message:({schemaCode:t})=>(0,kt.str)`must match pattern "${t}"`,params:({schemaCode:t})=>(0,kt._)`{pattern: ${t}}`},sg={keyword:"pattern",type:"string",schemaType:"string",$data:!0,error:og,code(t){let{gen:e,data:r,$data:n,schema:i,schemaCode:o,it:s}=t,a=s.opts.unicodeRegExp?"u":"";if(n){let{regExp:c}=s.opts.code,d=c.code==="new RegExp"?(0,kt._)`new RegExp`:(0,ig.useFunc)(e,c),u=e.let("valid");e.try(()=>e.assign(u,(0,kt._)`${d}(${o}, ${a}).test(${r})`),()=>e.assign(u,!1)),t.fail$data((0,kt._)`!${u}`)}else{let c=(0,ng.usePattern)(t,i);t.fail$data((0,kt._)`!${c}.test(${r})`)}}};mo.default=sg});var Mc=y(go=>{"use strict";Object.defineProperty(go,"__esModule",{value:!0});var wr=$(),ag={message({keyword:t,schemaCode:e}){let r=t==="maxProperties"?"more":"fewer";return(0,wr.str)`must NOT have ${r} than ${e} properties`},params:({schemaCode:t})=>(0,wr._)`{limit: ${t}}`},cg={keyword:["maxProperties","minProperties"],type:"object",schemaType:"number",$data:!0,error:ag,code(t){let{keyword:e,data:r,schemaCode:n}=t,i=e==="maxProperties"?wr.operators.GT:wr.operators.LT;t.fail$data((0,wr._)`Object.keys(${r}).length ${i} ${n}`)}};go.default=cg});var Ac=y(vo=>{"use strict";Object.defineProperty(vo,"__esModule",{value:!0});var br=we(),xr=$(),dg=O(),ug={message:({params:{missingProperty:t}})=>(0,xr.str)`must have required property '${t}'`,params:({params:{missingProperty:t}})=>(0,xr._)`{missingProperty: ${t}}`},lg={keyword:"required",type:"object",schemaType:"array",$data:!0,error:ug,code(t){let{gen:e,schema:r,schemaCode:n,data:i,$data:o,it:s}=t,{opts:a}=s;if(!o&&r.length===0)return;let c=r.length>=a.loopRequired;if(s.allErrors?d():u(),a.strictRequired){let f=t.parentSchema.properties,{definedProperties:h}=t.it;for(let m of r)if(f?.[m]===void 0&&!h.has(m)){let g=s.schemaEnv.baseId+s.errSchemaPath,v=`required property "${m}" is not defined at "${g}" (strictRequired)`;(0,dg.checkStrictMode)(s,v,s.opts.strictRequired)}}function d(){if(c||o)t.block$data(xr.nil,l);else for(let f of r)(0,br.checkReportMissingProp)(t,f)}function u(){let f=e.let("missing");if(c||o){let h=e.let("valid",!0);t.block$data(h,()=>p(f,h)),t.ok(h)}else e.if((0,br.checkMissingProp)(t,r,f)),(0,br.reportMissingProp)(t,f),e.else()}function l(){e.forOf("prop",n,f=>{t.setParams({missingProperty:f}),e.if((0,br.noPropertyInData)(e,i,f,a.ownProperties),()=>t.error())})}function p(f,h){t.setParams({missingProperty:f}),e.forOf(f,n,()=>{e.assign(h,(0,br.propertyInData)(e,i,f,a.ownProperties)),e.if((0,xr.not)(h),()=>{t.error(),e.break()})},xr.nil)}}};vo.default=lg});var Tc=y(yo=>{"use strict";Object.defineProperty(yo,"__esModule",{value:!0});var Pr=$(),pg={message({keyword:t,schemaCode:e}){let r=t==="maxItems"?"more":"fewer";return(0,Pr.str)`must NOT have ${r} than ${e} items`},params:({schemaCode:t})=>(0,Pr._)`{limit: ${t}}`},fg={keyword:["maxItems","minItems"],type:"array",schemaType:"number",$data:!0,error:pg,code(t){let{keyword:e,data:r,schemaCode:n}=t,i=e==="maxItems"?Pr.operators.GT:Pr.operators.LT;t.fail$data((0,Pr._)`${r}.length ${i} ${n}`)}};yo.default=fg});var Dn=y(wo=>{"use strict";Object.defineProperty(wo,"__esModule",{value:!0});var Cc=zi();Cc.code='require("ajv/dist/runtime/equal").default';wo.default=Cc});var qc=y(xo=>{"use strict";Object.defineProperty(xo,"__esModule",{value:!0});var bo=cr(),J=$(),hg=O(),mg=Dn(),gg={message:({params:{i:t,j:e}})=>(0,J.str)`must NOT have duplicate items (items ## ${e} and ${t} are identical)`,params:({params:{i:t,j:e}})=>(0,J._)`{i: ${t}, j: ${e}}`},vg={keyword:"uniqueItems",type:"array",schemaType:"boolean",$data:!0,error:gg,code(t){let{gen:e,data:r,$data:n,schema:i,parentSchema:o,schemaCode:s,it:a}=t;if(!n&&!i)return;let c=e.let("valid"),d=o.items?(0,bo.getSchemaTypes)(o.items):[];t.block$data(c,u,(0,J._)`${s} === false`),t.ok(c);function u(){let h=e.let("i",(0,J._)`${r}.length`),m=e.let("j");t.setParams({i:h,j:m}),e.assign(c,!0),e.if((0,J._)`${h} > 1`,()=>(l()?p:f)(h,m))}function l(){return d.length>0&&!d.some(h=>h==="object"||h==="array")}function p(h,m){let g=e.name("item"),v=(0,bo.checkDataTypes)(d,g,a.opts.strictNumbers,bo.DataType.Wrong),E=e.const("indices",(0,J._)`{}`);e.for((0,J._)`;${h}--;`,()=>{e.let(g,(0,J._)`${r}[${h}]`),e.if(v,(0,J._)`continue`),d.length>1&&e.if((0,J._)`typeof ${g} == "string"`,(0,J._)`${g} += "_"`),e.if((0,J._)`typeof ${E}[${g}] == "number"`,()=>{e.assign(m,(0,J._)`${E}[${g}]`),t.error(),e.assign(c,!1).break()}).code((0,J._)`${E}[${g}] = ${h}`)})}function f(h,m){let g=(0,hg.useFunc)(e,mg.default),v=e.name("outer");e.label(v).for((0,J._)`;${h}--;`,()=>e.for((0,J._)`${m} = ${h}; ${m}--;`,()=>e.if((0,J._)`${g}(${r}[${h}], ${r}[${m}])`,()=>{t.error(),e.assign(c,!1).break(v)})))}}};xo.default=vg});var Hc=y(Eo=>{"use strict";Object.defineProperty(Eo,"__esModule",{value:!0});var Po=$(),yg=O(),wg=Dn(),bg={message:"must be equal to constant",params:({schemaCode:t})=>(0,Po._)`{allowedValue: ${t}}`},xg={keyword:"const",$data:!0,error:bg,code(t){let{gen:e,data:r,$data:n,schemaCode:i,schema:o}=t;n||o&&typeof o=="object"?t.fail$data((0,Po._)`!${(0,yg.useFunc)(e,wg.default)}(${r}, ${i})`):t.fail((0,Po._)`${o} !== ${r}`)}};Eo.default=xg});var Fc=y(Io=>{"use strict";Object.defineProperty(Io,"__esModule",{value:!0});var Er=$(),Pg=O(),Eg=Dn(),Ig={message:"must be equal to one of the allowed values",params:({schemaCode:t})=>(0,Er._)`{allowedValues: ${t}}`},_g={keyword:"enum",schemaType:"array",$data:!0,error:Ig,code(t){let{gen:e,data:r,$data:n,schema:i,schemaCode:o,it:s}=t;if(!n&&i.length===0)throw new Error("enum must have non-empty array");let a=i.length>=s.opts.loopEnum,c,d=()=>c??(c=(0,Pg.useFunc)(e,Eg.default)),u;if(a||n)u=e.let("valid"),t.block$data(u,l);else{if(!Array.isArray(i))throw new Error("ajv implementation error");let f=e.const("vSchema",o);u=(0,Er.or)(...i.map((h,m)=>p(f,m)))}t.pass(u);function l(){e.assign(u,!1),e.forOf("v",o,f=>e.if((0,Er._)`${d()}(${r}, ${f})`,()=>e.assign(u,!0).break()))}function p(f,h){let m=i[h];return typeof m=="object"&&m!==null?(0,Er._)`${d()}(${r}, ${f}[${h}])`:(0,Er._)`${r} === ${m}`}}};Io.default=_g});var zc=y(_o=>{"use strict";Object.defineProperty(_o,"__esModule",{value:!0});var $g=Dc(),Sg=jc(),Dg=Oc(),jg=Nc(),Rg=Mc(),kg=Ac(),Og=Tc(),Ng=qc(),Mg=Hc(),Ag=Fc(),Tg=[$g.default,Sg.default,Dg.default,jg.default,Rg.default,kg.default,Og.default,Ng.default,{keyword:"type",schemaType:["string","array"]},{keyword:"nullable",schemaType:"boolean"},Mg.default,Ag.default];_o.default=Tg});var So=y(Ir=>{"use strict";Object.defineProperty(Ir,"__esModule",{value:!0});Ir.validateAdditionalItems=void 0;var dt=$(),$o=O(),Cg={message:({params:{len:t}})=>(0,dt.str)`must NOT have more than ${t} items`,params:({params:{len:t}})=>(0,dt._)`{limit: ${t}}`},qg={keyword:"additionalItems",type:"array",schemaType:["boolean","object"],before:"uniqueItems",error:Cg,code(t){let{parentSchema:e,it:r}=t,{items:n}=e;if(!Array.isArray(n)){(0,$o.checkStrictMode)(r,'"additionalItems" is ignored when "items" is not an array of schemas');return}Bc(t,n)}};function Bc(t,e){let{gen:r,schema:n,data:i,keyword:o,it:s}=t;s.items=!0;let a=r.const("len",(0,dt._)`${i}.length`);if(n===!1)t.setParams({len:e.length}),t.pass((0,dt._)`${a} <= ${e.length}`);else if(typeof n=="object"&&!(0,$o.alwaysValidSchema)(s,n)){let d=r.var("valid",(0,dt._)`${a} <= ${e.length}`);r.if((0,dt.not)(d),()=>c(d)),t.ok(d)}function c(d){r.forRange("i",e.length,a,u=>{t.subschema({keyword:o,dataProp:u,dataPropType:$o.Type.Num},d),s.allErrors||r.if((0,dt.not)(d),()=>r.break())})}}Ir.validateAdditionalItems=Bc;Ir.default=qg});var Do=y(_r=>{"use strict";Object.defineProperty(_r,"__esModule",{value:!0});_r.validateTuple=void 0;var Lc=$(),jn=O(),Hg=we(),Fg={keyword:"items",type:"array",schemaType:["object","array","boolean"],before:"uniqueItems",code(t){let{schema:e,it:r}=t;if(Array.isArray(e))return Uc(t,"additionalItems",e);r.items=!0,!(0,jn.alwaysValidSchema)(r,e)&&t.ok((0,Hg.validateArray)(t))}};function Uc(t,e,r=t.schema){let{gen:n,parentSchema:i,data:o,keyword:s,it:a}=t;u(i),a.opts.unevaluated&&r.length&&a.items!==!0&&(a.items=jn.mergeEvaluated.items(n,r.length,a.items));let c=n.name("valid"),d=n.const("len",(0,Lc._)`${o}.length`);r.forEach((l,p)=>{(0,jn.alwaysValidSchema)(a,l)||(n.if((0,Lc._)`${d} > ${p}`,()=>t.subschema({keyword:s,schemaProp:p,dataProp:p},c)),t.ok(c))});function u(l){let{opts:p,errSchemaPath:f}=a,h=r.length,m=h===l.minItems&&(h===l.maxItems||l[e]===!1);if(p.strictTuples&&!m){let g=`"${s}" is ${h}-tuple, but minItems or maxItems/${e} are not specified or different at path "${f}"`;(0,jn.checkStrictMode)(a,g,p.strictTuples)}}}_r.validateTuple=Uc;_r.default=Fg});var Vc=y(jo=>{"use strict";Object.defineProperty(jo,"__esModule",{value:!0});var zg=Do(),Bg={keyword:"prefixItems",type:"array",schemaType:["array"],before:"uniqueItems",code:t=>(0,zg.validateTuple)(t,"items")};jo.default=Bg});var Wc=y(Ro=>{"use strict";Object.defineProperty(Ro,"__esModule",{value:!0});var Gc=$(),Lg=O(),Ug=we(),Vg=So(),Gg={message:({params:{len:t}})=>(0,Gc.str)`must NOT have more than ${t} items`,params:({params:{len:t}})=>(0,Gc._)`{limit: ${t}}`},Wg={keyword:"items",type:"array",schemaType:["object","boolean"],before:"uniqueItems",error:Gg,code(t){let{schema:e,parentSchema:r,it:n}=t,{prefixItems:i}=r;n.items=!0,!(0,Lg.alwaysValidSchema)(n,e)&&(i?(0,Vg.validateAdditionalItems)(t,i):t.ok((0,Ug.validateArray)(t)))}};Ro.default=Wg});var Yc=y(ko=>{"use strict";Object.defineProperty(ko,"__esModule",{value:!0});var xe=$(),Rn=O(),Yg={message:({params:{min:t,max:e}})=>e===void 0?(0,xe.str)`must contain at least ${t} valid item(s)`:(0,xe.str)`must contain at least ${t} and no more than ${e} valid item(s)`,params:({params:{min:t,max:e}})=>e===void 0?(0,xe._)`{minContains: ${t}}`:(0,xe._)`{minContains: ${t}, maxContains: ${e}}`},Kg={keyword:"contains",type:"array",schemaType:["object","boolean"],before:"uniqueItems",trackErrors:!0,error:Yg,code(t){let{gen:e,schema:r,parentSchema:n,data:i,it:o}=t,s,a,{minContains:c,maxContains:d}=n;o.opts.next?(s=c===void 0?1:c,a=d):s=1;let u=e.const("len",(0,xe._)`${i}.length`);if(t.setParams({min:s,max:a}),a===void 0&&s===0){(0,Rn.checkStrictMode)(o,'"minContains" == 0 without "maxContains": "contains" keyword ignored');return}if(a!==void 0&&s>a){(0,Rn.checkStrictMode)(o,'"minContains" > "maxContains" is always invalid'),t.fail();return}if((0,Rn.alwaysValidSchema)(o,r)){let m=(0,xe._)`${u} >= ${s}`;a!==void 0&&(m=(0,xe._)`${m} && ${u} <= ${a}`),t.pass(m);return}o.items=!0;let l=e.name("valid");a===void 0&&s===1?f(l,()=>e.if(l,()=>e.break())):s===0?(e.let(l,!0),a!==void 0&&e.if((0,xe._)`${i}.length > 0`,p)):(e.let(l,!1),p()),t.result(l,()=>t.reset());function p(){let m=e.name("_valid"),g=e.let("count",0);f(m,()=>e.if(m,()=>h(g)))}function f(m,g){e.forRange("i",0,u,v=>{t.subschema({keyword:"contains",dataProp:v,dataPropType:Rn.Type.Num,compositeRule:!0},m),g()})}function h(m){e.code((0,xe._)`${m}++`),a===void 0?e.if((0,xe._)`${m} >= ${s}`,()=>e.assign(l,!0).break()):(e.if((0,xe._)`${m} > ${a}`,()=>e.assign(l,!1).break()),s===1?e.assign(l,!0):e.if((0,xe._)`${m} >= ${s}`,()=>e.assign(l,!0)))}}};ko.default=Kg});var Jc=y(Oe=>{"use strict";Object.defineProperty(Oe,"__esModule",{value:!0});Oe.validateSchemaDeps=Oe.validatePropertyDeps=Oe.error=void 0;var Oo=$(),Xg=O(),$r=we();Oe.error={message:({params:{property:t,depsCount:e,deps:r}})=>{let n=e===1?"property":"properties";return(0,Oo.str)`must have ${n} ${r} when property ${t} is present`},params:({params:{property:t,depsCount:e,deps:r,missingProperty:n}})=>(0,Oo._)`{property: ${t},
    missingProperty: ${n},
    depsCount: ${e},
    deps: ${r}}`};var Jg={keyword:"dependencies",type:"object",schemaType:"object",error:Oe.error,code(t){let[e,r]=Qg(t);Kc(t,e),Xc(t,r)}};function Qg({schema:t}){let e={},r={};for(let n in t){if(n==="__proto__")continue;let i=Array.isArray(t[n])?e:r;i[n]=t[n]}return[e,r]}function Kc(t,e=t.schema){let{gen:r,data:n,it:i}=t;if(Object.keys(e).length===0)return;let o=r.let("missing");for(let s in e){let a=e[s];if(a.length===0)continue;let c=(0,$r.propertyInData)(r,n,s,i.opts.ownProperties);t.setParams({property:s,depsCount:a.length,deps:a.join(", ")}),i.allErrors?r.if(c,()=>{for(let d of a)(0,$r.checkReportMissingProp)(t,d)}):(r.if((0,Oo._)`${c} && (${(0,$r.checkMissingProp)(t,a,o)})`),(0,$r.reportMissingProp)(t,o),r.else())}}Oe.validatePropertyDeps=Kc;function Xc(t,e=t.schema){let{gen:r,data:n,keyword:i,it:o}=t,s=r.name("valid");for(let a in e)(0,Xg.alwaysValidSchema)(o,e[a])||(r.if((0,$r.propertyInData)(r,n,a,o.opts.ownProperties),()=>{let c=t.subschema({keyword:i,schemaProp:a},s);t.mergeValidEvaluated(c,s)},()=>r.var(s,!0)),t.ok(s))}Oe.validateSchemaDeps=Xc;Oe.default=Jg});var Zc=y(No=>{"use strict";Object.defineProperty(No,"__esModule",{value:!0});var Qc=$(),Zg=O(),ev={message:"property name must be valid",params:({params:t})=>(0,Qc._)`{propertyName: ${t.propertyName}}`},tv={keyword:"propertyNames",type:"object",schemaType:["object","boolean"],error:ev,code(t){let{gen:e,schema:r,data:n,it:i}=t;if((0,Zg.alwaysValidSchema)(i,r))return;let o=e.name("valid");e.forIn("key",n,s=>{t.setParams({propertyName:s}),t.subschema({keyword:"propertyNames",data:s,dataTypes:["string"],propertyName:s,compositeRule:!0},o),e.if((0,Qc.not)(o),()=>{t.error(!0),i.allErrors||e.break()})}),t.ok(o)}};No.default=tv});var Ao=y(Mo=>{"use strict";Object.defineProperty(Mo,"__esModule",{value:!0});var kn=we(),Se=$(),rv=qe(),On=O(),nv={message:"must NOT have additional properties",params:({params:t})=>(0,Se._)`{additionalProperty: ${t.additionalProperty}}`},iv={keyword:"additionalProperties",type:["object"],schemaType:["boolean","object"],allowUndefined:!0,trackErrors:!0,error:nv,code(t){let{gen:e,schema:r,parentSchema:n,data:i,errsCount:o,it:s}=t;if(!o)throw new Error("ajv implementation error");let{allErrors:a,opts:c}=s;if(s.props=!0,c.removeAdditional!=="all"&&(0,On.alwaysValidSchema)(s,r))return;let d=(0,kn.allSchemaProperties)(n.properties),u=(0,kn.allSchemaProperties)(n.patternProperties);l(),t.ok((0,Se._)`${o} === ${rv.default.errors}`);function l(){e.forIn("key",i,g=>{!d.length&&!u.length?h(g):e.if(p(g),()=>h(g))})}function p(g){let v;if(d.length>8){let E=(0,On.schemaRefOrVal)(s,n.properties,"properties");v=(0,kn.isOwnProperty)(e,E,g)}else d.length?v=(0,Se.or)(...d.map(E=>(0,Se._)`${g} === ${E}`)):v=Se.nil;return u.length&&(v=(0,Se.or)(v,...u.map(E=>(0,Se._)`${(0,kn.usePattern)(t,E)}.test(${g})`))),(0,Se.not)(v)}function f(g){e.code((0,Se._)`delete ${i}[${g}]`)}function h(g){if(c.removeAdditional==="all"||c.removeAdditional&&r===!1){f(g);return}if(r===!1){t.setParams({additionalProperty:g}),t.error(),a||e.break();return}if(typeof r=="object"&&!(0,On.alwaysValidSchema)(s,r)){let v=e.name("valid");c.removeAdditional==="failing"?(m(g,v,!1),e.if((0,Se.not)(v),()=>{t.reset(),f(g)})):(m(g,v),a||e.if((0,Se.not)(v),()=>e.break()))}}function m(g,v,E){let b={keyword:"additionalProperties",dataProp:g,dataPropType:On.Type.Str};E===!1&&Object.assign(b,{compositeRule:!0,createErrors:!1,allErrors:!1}),t.subschema(b,v)}}};Mo.default=iv});var rd=y(Co=>{"use strict";Object.defineProperty(Co,"__esModule",{value:!0});var ov=pr(),ed=we(),To=O(),td=Ao(),sv={keyword:"properties",type:"object",schemaType:"object",code(t){let{gen:e,schema:r,parentSchema:n,data:i,it:o}=t;o.opts.removeAdditional==="all"&&n.additionalProperties===void 0&&td.default.code(new ov.KeywordCxt(o,td.default,"additionalProperties"));let s=(0,ed.allSchemaProperties)(r);for(let l of s)o.definedProperties.add(l);o.opts.unevaluated&&s.length&&o.props!==!0&&(o.props=To.mergeEvaluated.props(e,(0,To.toHash)(s),o.props));let a=s.filter(l=>!(0,To.alwaysValidSchema)(o,r[l]));if(a.length===0)return;let c=e.name("valid");for(let l of a)d(l)?u(l):(e.if((0,ed.propertyInData)(e,i,l,o.opts.ownProperties)),u(l),o.allErrors||e.else().var(c,!0),e.endIf()),t.it.definedProperties.add(l),t.ok(c);function d(l){return o.opts.useDefaults&&!o.compositeRule&&r[l].default!==void 0}function u(l){t.subschema({keyword:"properties",schemaProp:l,dataProp:l},c)}}};Co.default=sv});var sd=y(qo=>{"use strict";Object.defineProperty(qo,"__esModule",{value:!0});var nd=we(),Nn=$(),id=O(),od=O(),av={keyword:"patternProperties",type:"object",schemaType:"object",code(t){let{gen:e,schema:r,data:n,parentSchema:i,it:o}=t,{opts:s}=o,a=(0,nd.allSchemaProperties)(r),c=a.filter(m=>(0,id.alwaysValidSchema)(o,r[m]));if(a.length===0||c.length===a.length&&(!o.opts.unevaluated||o.props===!0))return;let d=s.strictSchema&&!s.allowMatchingProperties&&i.properties,u=e.name("valid");o.props!==!0&&!(o.props instanceof Nn.Name)&&(o.props=(0,od.evaluatedPropsToName)(e,o.props));let{props:l}=o;p();function p(){for(let m of a)d&&f(m),o.allErrors?h(m):(e.var(u,!0),h(m),e.if(u))}function f(m){for(let g in d)new RegExp(m).test(g)&&(0,id.checkStrictMode)(o,`property ${g} matches pattern ${m} (use allowMatchingProperties)`)}function h(m){e.forIn("key",n,g=>{e.if((0,Nn._)`${(0,nd.usePattern)(t,m)}.test(${g})`,()=>{let v=c.includes(m);v||t.subschema({keyword:"patternProperties",schemaProp:m,dataProp:g,dataPropType:od.Type.Str},u),o.opts.unevaluated&&l!==!0?e.assign((0,Nn._)`${l}[${g}]`,!0):!v&&!o.allErrors&&e.if((0,Nn.not)(u),()=>e.break())})})}}};qo.default=av});var ad=y(Ho=>{"use strict";Object.defineProperty(Ho,"__esModule",{value:!0});var cv=O(),dv={keyword:"not",schemaType:["object","boolean"],trackErrors:!0,code(t){let{gen:e,schema:r,it:n}=t;if((0,cv.alwaysValidSchema)(n,r)){t.fail();return}let i=e.name("valid");t.subschema({keyword:"not",compositeRule:!0,createErrors:!1,allErrors:!1},i),t.failResult(i,()=>t.reset(),()=>t.error())},error:{message:"must NOT be valid"}};Ho.default=dv});var cd=y(Fo=>{"use strict";Object.defineProperty(Fo,"__esModule",{value:!0});var uv=we(),lv={keyword:"anyOf",schemaType:"array",trackErrors:!0,code:uv.validateUnion,error:{message:"must match a schema in anyOf"}};Fo.default=lv});var dd=y(zo=>{"use strict";Object.defineProperty(zo,"__esModule",{value:!0});var Mn=$(),pv=O(),fv={message:"must match exactly one schema in oneOf",params:({params:t})=>(0,Mn._)`{passingSchemas: ${t.passing}}`},hv={keyword:"oneOf",schemaType:"array",trackErrors:!0,error:fv,code(t){let{gen:e,schema:r,parentSchema:n,it:i}=t;if(!Array.isArray(r))throw new Error("ajv implementation error");if(i.opts.discriminator&&n.discriminator)return;let o=r,s=e.let("valid",!1),a=e.let("passing",null),c=e.name("_valid");t.setParams({passing:a}),e.block(d),t.result(s,()=>t.reset(),()=>t.error(!0));function d(){o.forEach((u,l)=>{let p;(0,pv.alwaysValidSchema)(i,u)?e.var(c,!0):p=t.subschema({keyword:"oneOf",schemaProp:l,compositeRule:!0},c),l>0&&e.if((0,Mn._)`${c} && ${s}`).assign(s,!1).assign(a,(0,Mn._)`[${a}, ${l}]`).else(),e.if(c,()=>{e.assign(s,!0),e.assign(a,l),p&&t.mergeEvaluated(p,Mn.Name)})})}}};zo.default=hv});var ud=y(Bo=>{"use strict";Object.defineProperty(Bo,"__esModule",{value:!0});var mv=O(),gv={keyword:"allOf",schemaType:"array",code(t){let{gen:e,schema:r,it:n}=t;if(!Array.isArray(r))throw new Error("ajv implementation error");let i=e.name("valid");r.forEach((o,s)=>{if((0,mv.alwaysValidSchema)(n,o))return;let a=t.subschema({keyword:"allOf",schemaProp:s},i);t.ok(i),t.mergeEvaluated(a)})}};Bo.default=gv});var fd=y(Lo=>{"use strict";Object.defineProperty(Lo,"__esModule",{value:!0});var An=$(),pd=O(),vv={message:({params:t})=>(0,An.str)`must match "${t.ifClause}" schema`,params:({params:t})=>(0,An._)`{failingKeyword: ${t.ifClause}}`},yv={keyword:"if",schemaType:["object","boolean"],trackErrors:!0,error:vv,code(t){let{gen:e,parentSchema:r,it:n}=t;r.then===void 0&&r.else===void 0&&(0,pd.checkStrictMode)(n,'"if" without "then" and "else" is ignored');let i=ld(n,"then"),o=ld(n,"else");if(!i&&!o)return;let s=e.let("valid",!0),a=e.name("_valid");if(c(),t.reset(),i&&o){let u=e.let("ifClause");t.setParams({ifClause:u}),e.if(a,d("then",u),d("else",u))}else i?e.if(a,d("then")):e.if((0,An.not)(a),d("else"));t.pass(s,()=>t.error(!0));function c(){let u=t.subschema({keyword:"if",compositeRule:!0,createErrors:!1,allErrors:!1},a);t.mergeEvaluated(u)}function d(u,l){return()=>{let p=t.subschema({keyword:u},a);e.assign(s,a),t.mergeValidEvaluated(p,s),l?e.assign(l,(0,An._)`${u}`):t.setParams({ifClause:u})}}}};function ld(t,e){let r=t.schema[e];return r!==void 0&&!(0,pd.alwaysValidSchema)(t,r)}Lo.default=yv});var hd=y(Uo=>{"use strict";Object.defineProperty(Uo,"__esModule",{value:!0});var wv=O(),bv={keyword:["then","else"],schemaType:["object","boolean"],code({keyword:t,parentSchema:e,it:r}){e.if===void 0&&(0,wv.checkStrictMode)(r,`"${t}" without "if" is ignored`)}};Uo.default=bv});var md=y(Vo=>{"use strict";Object.defineProperty(Vo,"__esModule",{value:!0});var xv=So(),Pv=Vc(),Ev=Do(),Iv=Wc(),_v=Yc(),$v=Jc(),Sv=Zc(),Dv=Ao(),jv=rd(),Rv=sd(),kv=ad(),Ov=cd(),Nv=dd(),Mv=ud(),Av=fd(),Tv=hd();function Cv(t=!1){let e=[kv.default,Ov.default,Nv.default,Mv.default,Av.default,Tv.default,Sv.default,Dv.default,$v.default,jv.default,Rv.default];return t?e.push(Pv.default,Iv.default):e.push(xv.default,Ev.default),e.push(_v.default),e}Vo.default=Cv});var gd=y(Go=>{"use strict";Object.defineProperty(Go,"__esModule",{value:!0});var L=$(),qv={message:({schemaCode:t})=>(0,L.str)`must match format "${t}"`,params:({schemaCode:t})=>(0,L._)`{format: ${t}}`},Hv={keyword:"format",type:["number","string"],schemaType:"string",$data:!0,error:qv,code(t,e){let{gen:r,data:n,$data:i,schema:o,schemaCode:s,it:a}=t,{opts:c,errSchemaPath:d,schemaEnv:u,self:l}=a;if(!c.validateFormats)return;i?p():f();function p(){let h=r.scopeValue("formats",{ref:l.formats,code:c.code.formats}),m=r.const("fDef",(0,L._)`${h}[${s}]`),g=r.let("fType"),v=r.let("format");r.if((0,L._)`typeof ${m} == "object" && !(${m} instanceof RegExp)`,()=>r.assign(g,(0,L._)`${m}.type || "string"`).assign(v,(0,L._)`${m}.validate`),()=>r.assign(g,(0,L._)`"string"`).assign(v,m)),t.fail$data((0,L.or)(E(),b()));function E(){return c.strictSchema===!1?L.nil:(0,L._)`${s} && !${v}`}function b(){let R=u.$async?(0,L._)`(${m}.async ? await ${v}(${n}) : ${v}(${n}))`:(0,L._)`${v}(${n})`,x=(0,L._)`(typeof ${v} == "function" ? ${R} : ${v}.test(${n}))`;return(0,L._)`${v} && ${v} !== true && ${g} === ${e} && !${x}`}}function f(){let h=l.formats[o];if(!h){E();return}if(h===!0)return;let[m,g,v]=b(h);m===e&&t.pass(R());function E(){if(c.strictSchema===!1){l.logger.warn(x());return}throw new Error(x());function x(){return`unknown format "${o}" ignored in schema at path "${d}"`}}function b(x){let Y=x instanceof RegExp?(0,L.regexpCode)(x):c.code.formats?(0,L._)`${c.code.formats}${(0,L.getProperty)(o)}`:void 0,A=r.scopeValue("formats",{key:o,ref:x,code:Y});return typeof x=="object"&&!(x instanceof RegExp)?[x.type||"string",x.validate,(0,L._)`${A}.validate`]:["string",x,A]}function R(){if(typeof h=="object"&&!(h instanceof RegExp)&&h.async){if(!u.$async)throw new Error("async format in sync schema");return(0,L._)`await ${v}(${n})`}return typeof g=="function"?(0,L._)`${v}(${n})`:(0,L._)`${v}.test(${n})`}}}};Go.default=Hv});var vd=y(Wo=>{"use strict";Object.defineProperty(Wo,"__esModule",{value:!0});var Fv=gd(),zv=[Fv.default];Wo.default=zv});var yd=y(Ot=>{"use strict";Object.defineProperty(Ot,"__esModule",{value:!0});Ot.contentVocabulary=Ot.metadataVocabulary=void 0;Ot.metadataVocabulary=["title","description","default","deprecated","readOnly","writeOnly","examples"];Ot.contentVocabulary=["contentMediaType","contentEncoding","contentSchema"]});var bd=y(Yo=>{"use strict";Object.defineProperty(Yo,"__esModule",{value:!0});var Bv=Sc(),Lv=zc(),Uv=md(),Vv=vd(),wd=yd(),Gv=[Bv.default,Lv.default,(0,Uv.default)(),Vv.default,wd.metadataVocabulary,wd.contentVocabulary];Yo.default=Gv});var Pd=y(Tn=>{"use strict";Object.defineProperty(Tn,"__esModule",{value:!0});Tn.DiscrError=void 0;var xd;(function(t){t.Tag="tag",t.Mapping="mapping"})(xd||(Tn.DiscrError=xd={}))});var Id=y(Xo=>{"use strict";Object.defineProperty(Xo,"__esModule",{value:!0});var Nt=$(),Ko=Pd(),Ed=wn(),Wv=fr(),Yv=O(),Kv={message:({params:{discrError:t,tagName:e}})=>t===Ko.DiscrError.Tag?`tag "${e}" must be string`:`value of tag "${e}" must be in oneOf`,params:({params:{discrError:t,tag:e,tagName:r}})=>(0,Nt._)`{error: ${t}, tag: ${r}, tagValue: ${e}}`},Xv={keyword:"discriminator",type:"object",schemaType:"object",error:Kv,code(t){let{gen:e,data:r,schema:n,parentSchema:i,it:o}=t,{oneOf:s}=i;if(!o.opts.discriminator)throw new Error("discriminator: requires discriminator option");let a=n.propertyName;if(typeof a!="string")throw new Error("discriminator: requires propertyName");if(n.mapping)throw new Error("discriminator: mapping is not supported");if(!s)throw new Error("discriminator: requires oneOf keyword");let c=e.let("valid",!1),d=e.const("tag",(0,Nt._)`${r}${(0,Nt.getProperty)(a)}`);e.if((0,Nt._)`typeof ${d} == "string"`,()=>u(),()=>t.error(!1,{discrError:Ko.DiscrError.Tag,tag:d,tagName:a})),t.ok(c);function u(){let f=p();e.if(!1);for(let h in f)e.elseIf((0,Nt._)`${d} === ${h}`),e.assign(c,l(f[h]));e.else(),t.error(!1,{discrError:Ko.DiscrError.Mapping,tag:d,tagName:a}),e.endIf()}function l(f){let h=e.name("valid"),m=t.subschema({keyword:"oneOf",schemaProp:f},h);return t.mergeEvaluated(m,Nt.Name),h}function p(){var f;let h={},m=v(i),g=!0;for(let R=0;R<s.length;R++){let x=s[R];if(x?.$ref&&!(0,Yv.schemaHasRulesButRef)(x,o.self.RULES)){let A=x.$ref;if(x=Ed.resolveRef.call(o.self,o.schemaEnv.root,o.baseId,A),x instanceof Ed.SchemaEnv&&(x=x.schema),x===void 0)throw new Wv.default(o.opts.uriResolver,o.baseId,A)}let Y=(f=x?.properties)===null||f===void 0?void 0:f[a];if(typeof Y!="object")throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${a}"`);g=g&&(m||v(x)),E(Y,R)}if(!g)throw new Error(`discriminator: "${a}" must be required`);return h;function v({required:R}){return Array.isArray(R)&&R.includes(a)}function E(R,x){if(R.const)b(R.const,x);else if(R.enum)for(let Y of R.enum)b(Y,x);else throw new Error(`discriminator: "properties/${a}" must have "const" or "enum"`)}function b(R,x){if(typeof R!="string"||R in h)throw new Error(`discriminator: "${a}" values must be unique strings`);h[R]=x}}}};Xo.default=Xv});var _d=y((lx,Jv)=>{Jv.exports={$schema:"http://json-schema.org/draft-07/schema#",$id:"http://json-schema.org/draft-07/schema#",title:"Core schema meta-schema",definitions:{schemaArray:{type:"array",minItems:1,items:{$ref:"#"}},nonNegativeInteger:{type:"integer",minimum:0},nonNegativeIntegerDefault0:{allOf:[{$ref:"#/definitions/nonNegativeInteger"},{default:0}]},simpleTypes:{enum:["array","boolean","integer","null","number","object","string"]},stringArray:{type:"array",items:{type:"string"},uniqueItems:!0,default:[]}},type:["object","boolean"],properties:{$id:{type:"string",format:"uri-reference"},$schema:{type:"string",format:"uri"},$ref:{type:"string",format:"uri-reference"},$comment:{type:"string"},title:{type:"string"},description:{type:"string"},default:!0,readOnly:{type:"boolean",default:!1},examples:{type:"array",items:!0},multipleOf:{type:"number",exclusiveMinimum:0},maximum:{type:"number"},exclusiveMaximum:{type:"number"},minimum:{type:"number"},exclusiveMinimum:{type:"number"},maxLength:{$ref:"#/definitions/nonNegativeInteger"},minLength:{$ref:"#/definitions/nonNegativeIntegerDefault0"},pattern:{type:"string",format:"regex"},additionalItems:{$ref:"#"},items:{anyOf:[{$ref:"#"},{$ref:"#/definitions/schemaArray"}],default:!0},maxItems:{$ref:"#/definitions/nonNegativeInteger"},minItems:{$ref:"#/definitions/nonNegativeIntegerDefault0"},uniqueItems:{type:"boolean",default:!1},contains:{$ref:"#"},maxProperties:{$ref:"#/definitions/nonNegativeInteger"},minProperties:{$ref:"#/definitions/nonNegativeIntegerDefault0"},required:{$ref:"#/definitions/stringArray"},additionalProperties:{$ref:"#"},definitions:{type:"object",additionalProperties:{$ref:"#"},default:{}},properties:{type:"object",additionalProperties:{$ref:"#"},default:{}},patternProperties:{type:"object",additionalProperties:{$ref:"#"},propertyNames:{format:"regex"},default:{}},dependencies:{type:"object",additionalProperties:{anyOf:[{$ref:"#"},{$ref:"#/definitions/stringArray"}]}},propertyNames:{$ref:"#"},const:!0,enum:{type:"array",items:!0,minItems:1,uniqueItems:!0},type:{anyOf:[{$ref:"#/definitions/simpleTypes"},{type:"array",items:{$ref:"#/definitions/simpleTypes"},minItems:1,uniqueItems:!0}]},format:{type:"string"},contentMediaType:{type:"string"},contentEncoding:{type:"string"},if:{$ref:"#"},then:{$ref:"#"},else:{$ref:"#"},allOf:{$ref:"#/definitions/schemaArray"},anyOf:{$ref:"#/definitions/schemaArray"},oneOf:{$ref:"#/definitions/schemaArray"},not:{$ref:"#"}},default:!0}});var Qo=y((F,Jo)=>{"use strict";Object.defineProperty(F,"__esModule",{value:!0});F.MissingRefError=F.ValidationError=F.CodeGen=F.Name=F.nil=F.stringify=F.str=F._=F.KeywordCxt=F.Ajv=void 0;var Qv=xc(),Zv=bd(),ey=Id(),$d=_d(),ty=["/properties"],Cn="http://json-schema.org/draft-07/schema",Mt=class extends Qv.default{_addVocabularies(){super._addVocabularies(),Zv.default.forEach(e=>this.addVocabulary(e)),this.opts.discriminator&&this.addKeyword(ey.default)}_addDefaultMetaSchema(){if(super._addDefaultMetaSchema(),!this.opts.meta)return;let e=this.opts.$data?this.$dataMetaSchema($d,ty):$d;this.addMetaSchema(e,Cn,!1),this.refs["http://json-schema.org/schema"]=Cn}defaultMeta(){return this.opts.defaultMeta=super.defaultMeta()||(this.getSchema(Cn)?Cn:void 0)}};F.Ajv=Mt;Jo.exports=F=Mt;Jo.exports.Ajv=Mt;Object.defineProperty(F,"__esModule",{value:!0});F.default=Mt;var ry=pr();Object.defineProperty(F,"KeywordCxt",{enumerable:!0,get:function(){return ry.KeywordCxt}});var At=$();Object.defineProperty(F,"_",{enumerable:!0,get:function(){return At._}});Object.defineProperty(F,"str",{enumerable:!0,get:function(){return At.str}});Object.defineProperty(F,"stringify",{enumerable:!0,get:function(){return At.stringify}});Object.defineProperty(F,"nil",{enumerable:!0,get:function(){return At.nil}});Object.defineProperty(F,"Name",{enumerable:!0,get:function(){return At.Name}});Object.defineProperty(F,"CodeGen",{enumerable:!0,get:function(){return At.CodeGen}});var ny=vn();Object.defineProperty(F,"ValidationError",{enumerable:!0,get:function(){return ny.default}});var iy=fr();Object.defineProperty(F,"MissingRefError",{enumerable:!0,get:function(){return iy.default}})});var Md=y(Me=>{"use strict";Object.defineProperty(Me,"__esModule",{value:!0});Me.formatNames=Me.fastFormats=Me.fullFormats=void 0;function Ne(t,e){return{validate:t,compare:e}}Me.fullFormats={date:Ne(Rd,rs),time:Ne(es(!0),ns),"date-time":Ne(Sd(!0),Od),"iso-time":Ne(es(),kd),"iso-date-time":Ne(Sd(),Nd),duration:/^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,uri:uy,"uri-reference":/^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,"uri-template":/^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,url:/^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,email:/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,hostname:/^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,ipv4:/^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,ipv6:/^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,regex:vy,uuid:/^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,"json-pointer":/^(?:\/(?:[^~/]|~0|~1)*)*$/,"json-pointer-uri-fragment":/^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,"relative-json-pointer":/^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,byte:ly,int32:{type:"number",validate:hy},int64:{type:"number",validate:my},float:{type:"number",validate:jd},double:{type:"number",validate:jd},password:!0,binary:!0};Me.fastFormats={...Me.fullFormats,date:Ne(/^\d\d\d\d-[0-1]\d-[0-3]\d$/,rs),time:Ne(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,ns),"date-time":Ne(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,Od),"iso-time":Ne(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,kd),"iso-date-time":Ne(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,Nd),uri:/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,"uri-reference":/^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,email:/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i};Me.formatNames=Object.keys(Me.fullFormats);function oy(t){return t%4===0&&(t%100!==0||t%400===0)}var sy=/^(\d\d\d\d)-(\d\d)-(\d\d)$/,ay=[0,31,28,31,30,31,30,31,31,30,31,30,31];function Rd(t){let e=sy.exec(t);if(!e)return!1;let r=+e[1],n=+e[2],i=+e[3];return n>=1&&n<=12&&i>=1&&i<=(n===2&&oy(r)?29:ay[n])}function rs(t,e){if(t&&e)return t>e?1:t<e?-1:0}var Zo=/^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;function es(t){return function(r){let n=Zo.exec(r);if(!n)return!1;let i=+n[1],o=+n[2],s=+n[3],a=n[4],c=n[5]==="-"?-1:1,d=+(n[6]||0),u=+(n[7]||0);if(d>23||u>59||t&&!a)return!1;if(i<=23&&o<=59&&s<60)return!0;let l=o-u*c,p=i-d*c-(l<0?1:0);return(p===23||p===-1)&&(l===59||l===-1)&&s<61}}function ns(t,e){if(!(t&&e))return;let r=new Date("2020-01-01T"+t).valueOf(),n=new Date("2020-01-01T"+e).valueOf();if(r&&n)return r-n}function kd(t,e){if(!(t&&e))return;let r=Zo.exec(t),n=Zo.exec(e);if(r&&n)return t=r[1]+r[2]+r[3],e=n[1]+n[2]+n[3],t>e?1:t<e?-1:0}var ts=/t|\s/i;function Sd(t){let e=es(t);return function(n){let i=n.split(ts);return i.length===2&&Rd(i[0])&&e(i[1])}}function Od(t,e){if(!(t&&e))return;let r=new Date(t).valueOf(),n=new Date(e).valueOf();if(r&&n)return r-n}function Nd(t,e){if(!(t&&e))return;let[r,n]=t.split(ts),[i,o]=e.split(ts),s=rs(r,i);if(s!==void 0)return s||ns(n,o)}var cy=/\/|:/,dy=/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;function uy(t){return cy.test(t)&&dy.test(t)}var Dd=/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;function ly(t){return Dd.lastIndex=0,Dd.test(t)}var py=-(2**31),fy=2**31-1;function hy(t){return Number.isInteger(t)&&t<=fy&&t>=py}function my(t){return Number.isInteger(t)}function jd(){return!0}var gy=/[^\\]\\Z/;function vy(t){if(gy.test(t))return!1;try{return new RegExp(t),!0}catch{return!1}}});var Ad=y(Tt=>{"use strict";Object.defineProperty(Tt,"__esModule",{value:!0});Tt.formatLimitDefinition=void 0;var yy=Qo(),De=$(),Je=De.operators,qn={formatMaximum:{okStr:"<=",ok:Je.LTE,fail:Je.GT},formatMinimum:{okStr:">=",ok:Je.GTE,fail:Je.LT},formatExclusiveMaximum:{okStr:"<",ok:Je.LT,fail:Je.GTE},formatExclusiveMinimum:{okStr:">",ok:Je.GT,fail:Je.LTE}},wy={message:({keyword:t,schemaCode:e})=>(0,De.str)`should be ${qn[t].okStr} ${e}`,params:({keyword:t,schemaCode:e})=>(0,De._)`{comparison: ${qn[t].okStr}, limit: ${e}}`};Tt.formatLimitDefinition={keyword:Object.keys(qn),type:"string",schemaType:"string",$data:!0,error:wy,code(t){let{gen:e,data:r,schemaCode:n,keyword:i,it:o}=t,{opts:s,self:a}=o;if(!s.validateFormats)return;let c=new yy.KeywordCxt(o,a.RULES.all.format.definition,"format");c.$data?d():u();function d(){let p=e.scopeValue("formats",{ref:a.formats,code:s.code.formats}),f=e.const("fmt",(0,De._)`${p}[${c.schemaCode}]`);t.fail$data((0,De.or)((0,De._)`typeof ${f} != "object"`,(0,De._)`${f} instanceof RegExp`,(0,De._)`typeof ${f}.compare != "function"`,l(f)))}function u(){let p=c.schema,f=a.formats[p];if(!f||f===!0)return;if(typeof f!="object"||f instanceof RegExp||typeof f.compare!="function")throw new Error(`"${i}": format "${p}" does not define "compare" function`);let h=e.scopeValue("formats",{key:p,ref:f,code:s.code.formats?(0,De._)`${s.code.formats}${(0,De.getProperty)(p)}`:void 0});t.fail$data(l(h))}function l(p){return(0,De._)`${p}.compare(${r}, ${n}) ${qn[i].fail} 0`}},dependencies:["format"]};var by=t=>(t.addKeyword(Tt.formatLimitDefinition),t);Tt.default=by});var Hd=y((Sr,qd)=>{"use strict";Object.defineProperty(Sr,"__esModule",{value:!0});var Ct=Md(),xy=Ad(),is=$(),Td=new is.Name("fullFormats"),Py=new is.Name("fastFormats"),os=(t,e={keywords:!0})=>{if(Array.isArray(e))return Cd(t,e,Ct.fullFormats,Td),t;let[r,n]=e.mode==="fast"?[Ct.fastFormats,Py]:[Ct.fullFormats,Td],i=e.formats||Ct.formatNames;return Cd(t,i,r,n),e.keywords&&(0,xy.default)(t),t};os.get=(t,e="full")=>{let n=(e==="fast"?Ct.fastFormats:Ct.fullFormats)[t];if(!n)throw new Error(`Unknown format "${t}"`);return n};function Cd(t,e,r,n){var i,o;(i=(o=t.opts.code).formats)!==null&&i!==void 0||(o.formats=(0,is._)`require("ajv-formats/dist/formats").${n}`);for(let s of e)t.addFormat(s,r[s])}qd.exports=Sr=os;Object.defineProperty(Sr,"__esModule",{value:!0});Sr.default=os});var ow={};nu(ow,{activate:()=>nw,deactivate:()=>iw});module.exports=iu(ow);var B=V(require("vscode"));var S=V(require("vscode")),gs=V(require("path"));var je=V(require("vscode"));function Vn(t){let e=je.Uri.joinPath(t,".."),r=t.path.split("/").pop()?.replace(/\.nodegraph\.json$/,"")??"graph";return je.Uri.joinPath(e,`.${r}-imgs`)}function ou(t,e,r){let n=je.Uri.joinPath(Vn(e),r);return t.asWebviewUri(n).toString()}var ls=/\[\[IMG:([^:\]]+)(?::[^\]]+)?\]\]/g;function Gn(t,e,r){let n={},i=o=>{o&&!n[o]&&(n[o]=ou(t,e,o))};for(let o of r.nodes){ls.lastIndex=0;let s;for(;(s=ls.exec(o.content??""))!==null;)i(s[1])}for(let o of r.canvasImages??[])i(o.filename);return n}async function ps(t,e,r,n="png"){let i=Vn(e);try{await je.workspace.fs.createDirectory(i)}catch{}let o=`img_${Date.now()}.${n}`,s=je.Uri.joinPath(i,o);return await je.workspace.fs.writeFile(s,Buffer.from(r,"base64")),{filename:o,webviewUri:t.asWebviewUri(s).toString()}}async function fs(t,e){let r=je.Uri.joinPath(Vn(t),e);try{await je.workspace.fs.delete(r)}catch{}}function ne(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function su(t){let e=t.trim().replace("#",""),r=e.length===3?e.split("").map(n=>n+n).join(""):e;return/^[0-9a-fA-F]{6}$/.test(r)?{r:255-parseInt(r.slice(0,2),16),g:255-parseInt(r.slice(2,4),16),b:255-parseInt(r.slice(4,6),16)}:null}var au=t=>t.replace(/[^a-zA-Z0-9_-]/g,"_");function Rr(t){return/^\s*\|/.test(t)&&t.indexOf("|",1)!==-1}function Yn(t){return/^\s*\|[\s\-:|]+\|\s*$/.test(t)&&!/[a-zA-Z0-9]/.test(t)}function hs(t){return t.replace(/^\s*\|/,"").replace(/\|\s*$/,"").split("|").map(e=>e.trim())}function cu(t){if(!t)return[{type:"text",text:"",startChar:0,endChar:0}];let e=t.split(`
`),r=[],n=0,i=0,o=s=>e[s].length+(s<e.length-1?1:0);for(;n<e.length;)if(Rr(e[n])&&n+1<e.length&&Yn(e[n+1])){let a=i,c=[];for(;n<e.length&&Rr(e[n]);)c.push(e[n]),i+=o(n),n++;c.length>=3?r.push({type:"table",headers:hs(c[0]),rows:c.slice(2).map(hs),startChar:a,endChar:i}):r.push({type:"text",text:c.join(`
`),startChar:a,endChar:i})}else{let a=i,c=[];for(;n<e.length&&!(Rr(e[n])&&n+1<e.length&&Yn(e[n+1]));)c.push(e[n]),i+=o(n),n++;r.push({type:"text",text:c.join(`
`),startChar:a,endChar:i})}return r}function Wn(t){let e=t.split(`
`);for(let r=0;r+1<e.length;r++)if(Rr(e[r])&&Yn(e[r+1]))return!0;return!1}function du(t){return ne(t).replace(/\\\$/g,()=>'<span class="ng-cur">$</span>')}function kr(t){return du(t).replace(/\*\*(.+?)\*\*/g,'<strong style="font-size:1.1em">$1</strong>')}function Or(t,e){let r=/\[\[IMG:([^:\]]+)(?::(\d+)x(\d+))?\]\]/g,n="",i=0,o;for(;(o=r.exec(t))!==null;){o.index>i&&(n+=kr(t.slice(i,o.index)));let s=o[1],a=o[2],c=o[3],d=a&&c?` width="${a}" height="${c}"`:"",u=e[s];n+=u?`<img class="ng-img${d?" ng-img-sized":""}" src="${u}"${d} alt="${ne(s)}" onclick="showLightbox(this.src)" title="Click to enlarge">`:`<span class="ng-img-missing">${ne(s)}</span>`,i=o.index+o[0].length}return i<t.length&&(n+=kr(t.slice(i))),n}function uu(t,e){let r=t.headers.map(i=>`<th>${Or(i,e)}</th>`).join(""),n=t.rows.map(i=>`<tr>${i.map(o=>`<td>${Or(o,e)}</td>`).join("")}</tr>`).join("");return`<div class="ng-table-wrap"><table class="ng-table"><thead><tr>${r}</tr></thead><tbody>${n}</tbody></table></div>`}function lu(t,e,r,n,i){let o=e?.color??"#888",s=e?.shape==="rounded"?"22px":"2px",a=ne(e?.label??t.template),c=Math.round(t.position.x+r),d=Math.round(t.position.y+n),u="",l=t.content??"";if(Wn(l)){let A=cu(l);u+='<div class="ng-content">';for(let ge of A)ge.type==="table"?u+=uu(ge,i):ge.text&&(u+=`<div class="ng-seg">${Or(ge.text,i).replace(/\n/g,"<br>")}</div>`);u+="</div>"}else l&&(u+=`<div class="ng-content">${Or(l,i).replace(/\n/g,"<br>")}</div>`);if(t.original){let A=ne(t.original.title??"Original"),ge=t.originalExpanded?" open":"";u+=`<details class="ng-original"${ge}><summary>${A}${t.original.location?` <span class="ng-loc">${ne(t.original.location)}</span>`:""}</summary>
<div class="ng-orig-text">${kr(t.original.text).replace(/\n/g,"<br>")}</div></details>`}for(let A of t.toggleItems??[])u+=`<details class="ng-toggle" data-toggle-id="${ne(A.id)}"${A.expanded?" open":""}><summary>${ne(A.title||"(untitled)")}</summary>
<div class="ng-toggle-body">${kr(A.content).replace(/\n/g,"<br>")}</div></details>`;t.links.length&&(u+=`<div class="ng-links">${t.links.map(A=>{let ge=A.type==="url"?"\u{1F517}":A.type==="pdf"?"\u{1F4C4}":A.type==="obsidian"?"\u{1F7E3}":"\u2B21";return`<a class="ng-link"${A.type==="url"||A.type==="pdf"?` href="${ne(A.target)}" target="_blank"`:""}>${ge} ${ne(A.label||A.target)}</a>`}).join("")}</div>`);let p=!!u,f=t.contentExpanded?"":' style="display:none"',h=t.children.length?` data-children="${t.children.join(",")}"`:"",m=Wn(l)?" ng-has-table":"",g=/\[\[IMG:[^:\]]+:(\d+)x\d+\]\]/g,v=0,E;for(;(E=g.exec(l))!==null;)v=Math.max(v,Number(E[1]));let b=v>0?Wn(l)?v+280:v+32:0,R=Math.max(t.nodeWidth??0,432,b),x=[R>432?`min-width:${R}px`:"",t.nodeHeight&&t.contentExpanded?`min-height:${t.nodeHeight}px`:""].filter(Boolean).join(";"),Y=t.nodeHeight?` data-min-h="${t.nodeHeight}"`:"";return`<div class="ng-node${m}" id="node-${ne(t.id)}"${h}${Y} style="--color:${o};border-radius:${s};left:${c}px;top:${d}px${x?";"+x:""}">
  <div class="ng-header" onclick="onHeaderClick(this)" title="Click to select node">
    <span class="ng-tag" onmousedown="onNodeTagMousedown(event,this.closest('.ng-node'))" style="background:color-mix(in srgb,${o} 20%,transparent);color:${o}">${a}</span>
    ${p?`<span class="ng-title" onclick="onTitleClick(event,this)" title="Click to fold/unfold">${ne(t.title)}</span>`:`<span class="ng-title">${ne(t.title)}</span>`}
  </div>
  ${p?`<div class="ng-body"${f}${t.fontSize?` style="font-size:${t.fontSize}px"`:""}>${u}</div>`:""}
</div>`}function ms(t,e={}){let r=1/0,n=1/0;for(let l of t.nodes)r=Math.min(r,l.position.x),n=Math.min(n,l.position.y);isFinite(r)||(r=0,n=0);let i=-r+100,o=-n+100,s=t.nodes.map(l=>lu(l,t.nodeTemplates[l.template],i,o,e)).join(`
`),a=JSON.stringify(t.nodes.map(l=>({id:l.id,lx:Math.round(l.position.x+i),ly:Math.round(l.position.y+o),children:l.children??[],template:l.template,contentExpanded:l.contentExpanded,isMain:l.template==="main_topic",nodeHeight:l.nodeHeight??null,naturalY:Math.round((l.nodeNaturalY??l.position.y)+o),title:l.title,content:l.content??"",originalTitle:l.original?.title??"",originalText:l.original?.text??"",toggles:(l.toggleItems??[]).map(p=>({id:p.id,title:p.title,content:p.content}))}))),c=JSON.stringify(t.edges.map(l=>({source:l.source,target:l.target,type:l.type,label:l.label||""}))),d=JSON.stringify(Object.fromEntries(Object.entries(t.nodeTemplates).map(([l,p])=>[l,p.label]))),u=Object.entries(t.nodeTemplates).map(([l,p])=>{let f=su(p.color),h=f?`rgb(${f.r},${f.g},${f.b})`:"#ff3b30",m=f?`rgba(${f.r},${f.g},${f.b},0.18)`:"rgba(255,59,48,0.18)";return`::highlight(ng-hit-${au(l)}){color:${h};background-color:${m};text-decoration:underline}`}).join(`
`);return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${ne(t.title)}</title>
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
    <span id="tb-title">${ne(t.title)}</span>
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
    ${s}
  </div>
</div>
<div id="lightbox" onclick="closeLightbox()">
  <img id="lightbox-img" onclick="event.stopPropagation()" src="" alt="">
  <span id="lightbox-close" onclick="closeLightbox()">\u2715</span>
</div>
<script>
var NODES_DATA = ${a};
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
</html>`}var pu={main_topic:{label:"Main topic",color:"#4B8BBE",icon:"file-text",shape:"sharp"},method:{label:"Method",color:"#5C9E6E",icon:"cpu",shape:"sharp"},result:{label:"Result",color:"#9B59B6",icon:"bar-chart-2",shape:"sharp"},claim:{label:"Claim",color:"#E74C3C",icon:"alert-circle",shape:"sharp"},question:{label:"Question",color:"#E5A835",icon:"help-circle",shape:"rounded"},gap:{label:"Gap / Idea",color:"#1ABC9C",icon:"lightbulb",shape:"rounded"},reference:{label:"Reference",color:"#95A5A6",icon:"book-open",shape:"rounded"},memo:{label:"Memo",color:"#BDC3C7",icon:"edit-3",shape:"rounded"}};function Nr(t="New Graph"){let e=new Date().toISOString();return{version:"1.0.0",title:t,created:e,modified:e,nodeTemplates:pu,nodes:[],edges:[],viewport:{x:0,y:0,zoom:1}}}function Mr(){let t="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let r=0;r<32;r++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}var se=V(require("vscode"));var Ar=class t{static{this.panels=new Map}static async openAndSearch(e,r,n,i){let o=r.toString(),s=t.panels.get(o);if(s){s.panel.reveal(se.ViewColumn.Beside,!0),s.ready?s.panel.webview.postMessage({type:"search",query:n,pageHint:i}):s.pending={query:n,pageHint:i};return}let a;try{a=await se.workspace.fs.readFile(r)}catch{se.window.showErrorMessage(`PDF\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4: ${r.fsPath}`);return}let c=se.window.createWebviewPanel("nodegraph.pdfViewer",r.path.split("/").pop()??"PDF",{viewColumn:se.ViewColumn.Beside,preserveFocus:!1},{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[se.Uri.joinPath(e.extensionUri,"dist")]}),d={panel:c,ready:!1,pending:{query:n,pageHint:i}};t.panels.set(o,d),c.iconPath=se.Uri.joinPath(e.extensionUri,"resources","icon-hires.png"),c.webview.html=t._getHtml(e,c.webview);let u=Buffer.from(a).toString("base64");c.webview.onDidReceiveMessage(l=>{l.type==="ready"&&(d.ready=!0,c.webview.postMessage({type:"load",pdfData:u,query:d.pending?.query,pageHint:d.pending?.pageHint}),d.pending=null)}),c.onDidDispose(()=>{t.panels.delete(o)})}static _getHtml(e,r){let n=r.asWebviewUri(se.Uri.joinPath(e.extensionUri,"dist","pdfviewer.js")),i=r.asWebviewUri(se.Uri.joinPath(e.extensionUri,"dist","pdfviewer.css")),o=r.asWebviewUri(se.Uri.joinPath(e.extensionUri,"dist","pdf.worker.min.mjs")),s=Mr();return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${r.cspSource} data: blob:; script-src 'nonce-${s}' ${r.cspSource}; style-src 'unsafe-inline' ${r.cspSource}; worker-src ${r.cspSource} blob:; connect-src ${r.cspSource} blob:;">
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
  <script nonce="${s}">window.__PDF_WORKER_URI__ = "${o}";</script>
  <script nonce="${s}" type="module" src="${n}"></script>
</body>
</html>`}};var Fe=class t{constructor(e){this.context=e;this._pendingSaves=new Set}static register(e){let r=new t(e);return S.window.registerCustomEditorProvider("nodegraph.editor",r,{webviewOptions:{retainContextWhenHidden:!0}})}static{this._activeWebview=null}static postToActive(e){t._activeWebview?.postMessage(e)}async resolveCustomTextEditor(e,r,n){r.iconPath=S.Uri.joinPath(this.context.extensionUri,"resources","icon-hires.png");let i=S.Uri.joinPath(e.uri,"..");r.webview.options={enableScripts:!0,localResourceRoots:[this.context.extensionUri,i]},r.webview.html=this._getHtmlForWebview(r.webview);let o=c=>{let d=e.getText();try{let u=d.trim()===""?Nr():JSON.parse(d),l=Gn(r.webview,e.uri,u);r.webview.postMessage({type:c,data:u,imageUris:l})}catch{}},s=r.webview.onDidReceiveMessage(async c=>{if(c.type==="ready")o("load");else if(c.type==="save"){let d=e.uri.toString();this._pendingSaves.add(d);try{let u=new S.WorkspaceEdit,l=new S.Range(e.positionAt(0),e.positionAt(e.getText().length));u.replace(e.uri,l,JSON.stringify(c.data,null,2)),await S.workspace.applyEdit(u),await e.save()}finally{this._pendingSaves.delete(d)}}else if(c.type==="openLink"){let d=c.link;if(d.type==="url")S.env.openExternal(S.Uri.parse(d.target));else if(d.type==="pdf"){let u=S.Uri.joinPath(S.Uri.joinPath(e.uri,".."),d.target);S.env.openExternal(u)}else d.type==="obsidian"&&S.env.openExternal(S.Uri.parse(d.target))}else if(c.type==="searchInPdf"){let d=S.Uri.joinPath(S.Uri.joinPath(e.uri,".."),c.pdfTarget);Ar.openAndSearch(this.context,d,c.query,c.pageHint)}else if(c.type==="exportHtml")try{let d=c.data,u=S.Uri.joinPath(e.uri,".."),l=gs.basename(e.uri.fsPath,".nodegraph.json"),p=S.Uri.joinPath(u,`.${l}-imgs`),f={},h=/\[\[IMG:([^:\]]+)(?::[^\]]+)?\]\]/g,m=async b=>{if(!(!b||f[b]))try{let R=S.Uri.joinPath(p,b),x=await S.workspace.fs.readFile(R),Y=b.split(".").pop()?.toLowerCase()??"png",A=Y==="jpg"||Y==="jpeg"?"image/jpeg":Y==="gif"?"image/gif":Y==="webp"?"image/webp":"image/png";f[b]=`data:${A};base64,${Buffer.from(x).toString("base64")}`}catch{}};for(let b of d.nodes){h.lastIndex=0;let R;for(;(R=h.exec(b.content??""))!==null;)await m(R[1])}let g=ms(d,f),v=S.Uri.joinPath(u,`${l}.html`);await S.workspace.fs.writeFile(v,Buffer.from(g,"utf-8"));let E=await S.window.showInformationMessage(`HTML exported: ${l}.html`,"Open in Browser","Show in Explorer");E==="Open in Browser"?S.env.openExternal(v):E==="Show in Explorer"&&S.commands.executeCommand("revealFileInOS",v)}catch(d){S.window.showErrorMessage(`HTML export failed: ${d}`)}else if(c.type==="saveImage")try{let{filename:d,webviewUri:u}=await ps(r.webview,e.uri,c.data,c.ext??"png");r.webview.postMessage({type:"imageSaved",nodeId:c.nodeId,filename:d,webviewUri:u})}catch(d){S.window.showErrorMessage(`Failed to save image: ${d}`)}else if(c.type==="deleteImageFile")await fs(e.uri,c.filename);else if(c.type==="reload")try{let d=await S.workspace.fs.readFile(e.uri),u=Buffer.from(d).toString("utf-8"),l=JSON.parse(u),p=Gn(r.webview,e.uri,l);r.webview.postMessage({type:"load",data:l,imageUris:p})}catch{o("load")}else if(c.type==="openHelp"){let d=S.Uri.joinPath(this.context.extensionUri,"README.md");S.commands.executeCommand("markdown.showPreviewToSide",d.with({fragment:"features"}))}}),a=S.workspace.onDidChangeTextDocument(c=>{c.document.uri.toString()===e.uri.toString()&&(this._pendingSaves.has(e.uri.toString())||o("externalChange"))});t._activeWebview=r.webview,r.onDidChangeViewState(c=>{c.webviewPanel.active&&(t._activeWebview=r.webview,r.webview.postMessage({type:"focusCanvas"}))}),r.onDidDispose(()=>{s.dispose(),a.dispose(),t._activeWebview===r.webview&&(t._activeWebview=null)})}_getHtmlForWebview(e){let r=e.asWebviewUri(S.Uri.joinPath(this.context.extensionUri,"dist","webview.js")),n=e.asWebviewUri(S.Uri.joinPath(this.context.extensionUri,"dist","katex","katex.min.css")),i=Mr();return`<!DOCTYPE html>
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
</html>`}};var U=V(require("vscode")),vs=V(require("child_process"));function zt(t){try{return vs.execSync(t,{timeout:5e3,stdio:["pipe","pipe","pipe"]}).toString().trim()}catch{return""}}function fe(t){return zt(t)!==""}function fu(){let t=[],e=new Date().toISOString(),r=process.platform,n=r==="win32"?"Windows":r==="darwin"?"macOS":"Linux",i=process.arch,o=zt("python3 --version 2>&1")||zt("python --version 2>&1"),s=fe("python3 --version 2>&1")?"python3":fe("python --version 2>&1")?"python":"",a=s!=="",c=a&&fe(`${s} -c "import fitz" 2>&1 && echo ok`),d=c?zt(`${s} -c "import fitz; print(fitz.__version__)"`):"",u=a&&fe(`${s} -c "import pdfplumber" 2>&1 && echo ok`),l=a&&fe(`${s} -c "import pdfminer" 2>&1 && echo ok`),p=a&&fe(`${s} -c "from PIL import Image" 2>&1 && echo ok`),f=p?zt(`${s} -c "from PIL import __version__; print(__version__)"`):"",h=a&&fe(`${s} -c "import cv2" 2>&1 && echo ok`),m=fe("pdftotext -v 2>&1 && echo ok")||fe("pdftotext --help 2>&1 && echo ok"),g=fe("convert --version 2>&1 && echo ok"),v=fe("magick --version 2>&1 && echo ok"),E=fe("gs --version 2>&1 && echo ok")||fe("gswin64c --version 2>&1 && echo ok"),b=R=>R?"\u2705":"\u274C";return t.push("# NodeGraph \u2014 Agent Environment Report"),t.push(""),t.push("> Auto-generated by the NodeGraph extension at activation."),t.push("> **AI agents: read this file to understand what tools are available on this machine.**"),t.push("> Re-generated each time a `.nodegraph.json` file is opened."),t.push(""),t.push(`Generated: \`${e}\``),t.push(""),t.push("---"),t.push(""),t.push("## System"),t.push(""),t.push("| | |"),t.push("|---|---|"),t.push(`| OS | ${n} (\`${r}\`) |`),t.push(`| Architecture | \`${i}\` |`),t.push(`| Python | ${a?`${b(!0)} \`${o}\``:`${b(!1)} not found`} |`),t.push(`| Python command | ${a?`\`${s}\``:"N/A"} |`),t.push(""),t.push("---"),t.push(""),t.push("## PDF Reading Capabilities"),t.push(""),t.push("| Tool | Available | Notes |"),t.push("|------|:---------:|-------|"),t.push(`| PyMuPDF (\`fitz\`) | ${b(c)} | ${c?`v${d} \u2014 recommended`:"Install: `pip install pymupdf`"} |`),t.push(`| pdfplumber | ${b(u)} | ${u?"available":"Install: `pip install pdfplumber`"} |`),t.push(`| pdfminer | ${b(l)} | ${l?"available":"Install: `pip install pdfminer.six`"} |`),t.push(`| poppler (\`pdftotext\`) | ${b(m)} | ${m?"CLI tool available":r==="win32"?"Install: download poppler for Windows":r==="darwin"?"Install: `brew install poppler`":"Install: `apt install poppler-utils`"} |`),t.push(`| Ghostscript (\`gs\`) | ${b(E)} | ${E?"available":"optional"} |`),t.push(""),t.push("---"),t.push(""),t.push("## Image Processing Capabilities"),t.push(""),t.push("| Tool | Available | Notes |"),t.push("|------|:---------:|-------|"),t.push(`| Pillow (\`PIL\`) | ${b(p)} | ${p?`v${f} \u2014 recommended`:"Install: `pip install Pillow`"} |`),t.push(`| OpenCV (\`cv2\`) | ${b(h)} | ${h?"available":"Install: `pip install opencv-python`"} |`),t.push(`| ImageMagick (\`convert\`) | ${b(g||v)} | ${g||v?"CLI tool available":r==="win32"?"Install: imagemagick.org":r==="darwin"?"Install: `brew install imagemagick`":"Install: `apt install imagemagick`"} |`),t.push(""),t.push("---"),t.push(""),t.push("## Agent Recommendations"),t.push(""),a||(t.push("> \u26A0\uFE0F **Python not found.** PDF reading and image processing via Python are not available."),t.push("> Install Python from https://python.org, then reopen a `.nodegraph.json` file to re-run this check."),t.push("")),t.push("### Reading a PDF"),c?(t.push("Use PyMuPDF (recommended \u2014 fastest and most accurate):"),t.push("```python"),t.push("import fitz"),t.push('doc = fitz.open("paper.pdf")'),t.push('text = "\\n".join(page.get_text() for page in doc)'),t.push("```")):u?(t.push("Use pdfplumber:"),t.push("```python"),t.push("import pdfplumber"),t.push('with pdfplumber.open("paper.pdf") as pdf:'),t.push('    text = "\\n".join(p.extract_text() or "" for p in pdf.pages)'),t.push("```")):m?(t.push("Use poppler CLI:"),t.push("```bash"),t.push("pdftotext paper.pdf -"),t.push("```")):t.push("\u274C No PDF reading tool available. Ask the user to install PyMuPDF: `pip install pymupdf`"),t.push(""),t.push("### Extracting images from a PDF"),c?(t.push("```python"),t.push("import fitz"),t.push('doc = fitz.open("paper.pdf")'),t.push("for i, page in enumerate(doc):"),t.push("    for img in page.get_images():"),t.push("        xref = img[0]"),t.push("        pix = fitz.Pixmap(doc, xref)"),t.push('        pix.save(f"fig_{i}_{xref}.png")'),t.push("```")):p?t.push("Pillow is available but cannot extract from PDF directly. Use PyMuPDF for extraction."):t.push("\u274C No image extraction tool available."),t.push(""),t.push("---"),t.push(""),t.push("*To refresh this report, reopen any `.nodegraph.json` file.*"),t.join(`
`)}async function Kn(t){let e=U.Uri.joinPath(t,".agent"),r=U.Uri.joinPath(e,"ENVIRONMENT.md");try{return await U.workspace.fs.createDirectory(e),await U.workspace.fs.writeFile(r,Buffer.from(fu(),"utf-8")),!0}catch{return!1}}async function ys(t){if(!(!t||t.length===0))for(let e of t)await Kn(e.uri)}async function ws(t,e){let r=U.Uri.joinPath(t,".agent","NODEGRAPH_SPEC.md"),n;try{n=await U.workspace.fs.readFile(r)}catch{return!1}let i=U.Uri.joinPath(e,".agent"),o=U.Uri.joinPath(i,"NODEGRAPH_SPEC.md");try{return await U.workspace.fs.createDirectory(i),await U.workspace.fs.writeFile(o,n),!0}catch{return!1}}async function bs(t,e){let r=U.Uri.joinPath(t,".prompt"),n=U.Uri.joinPath(e,".prompt");try{await U.workspace.fs.createDirectory(n);for(let i of["korean.md","english.md"]){let o=await U.workspace.fs.readFile(U.Uri.joinPath(r,i));await U.workspace.fs.writeFile(U.Uri.joinPath(n,i),o)}return!0}catch{return!1}}var ss=V(require("path"));var ce=require("fs/promises"),ae=V(require("path")),Jn=require("crypto"),Tr=class{constructor(e={}){this.hooks=e}async write(e,r,n){let i=`${JSON.stringify(r,null,2)}
`;await this.writeText(e,i,n)}async writeText(e,r,n){let i=xs(e);await(0,ce.mkdir)(ae.dirname(e),{recursive:!0});try{await Ps(i,r),await this.hooks.beforeReplace?.(e,i),await n?.(),await(0,ce.rename)(i,e),await Xn(ae.dirname(e))}catch(o){try{await Bt(i)}catch(s){throw new Cr(o,s)}throw o}}async remove(e){try{await(0,ce.unlink)(e),await Xn(ae.dirname(e))}catch(r){if(!Qn(r))throw r}}async writeBatch(e){let r=e.map(hu);try{await gu(r),await this.verifyBatch(r),await vu(r)}catch(n){throw await wu(r,n),n}await xu(r)}async verifyBatch(e){for(let r of e)await this.hooks.beforeReplace?.(r.target,r.temporary)}};function xs(t){let e=`.${ae.basename(t)}.${(0,Jn.randomUUID)()}.tmp`;return ae.join(ae.dirname(t),e)}function hu(t){return{target:t.target,temporary:xs(t.target),backup:mu(t.target),content:`${JSON.stringify(t.value,null,2)}
`,backedUp:!1,replaced:!1}}function mu(t){let e=`.${ae.basename(t)}.${(0,Jn.randomUUID)()}.backup`;return ae.join(ae.dirname(t),e)}async function gu(t){for(let e of t)await(0,ce.mkdir)(ae.dirname(e.target),{recursive:!0}),await Ps(e.temporary,e.content)}async function vu(t){for(let e of t)e.backedUp=await yu(e.target,e.backup),await(0,ce.rename)(e.temporary,e.target),e.replaced=!0}async function yu(t,e){try{return await(0,ce.rename)(t,e),!0}catch(r){if(Qn(r))return!1;throw r}}async function wu(t,e){try{for(let r of[...t].reverse())await bu(r)}catch(r){throw new Cr(e,r)}}async function bu(t){t.replaced&&await Bt(t.target),t.backedUp&&await(0,ce.rename)(t.backup,t.target),await Bt(t.temporary)}async function xu(t){for(let e of t)await Bt(e.temporary),await Bt(e.backup),await Xn(ae.dirname(e.target))}var Cr=class extends Error{constructor(r,n){super("atomic-write-cleanup-failed");this.cause=r;this.cleanupCause=n}};async function Ps(t,e){let r=await(0,ce.open)(t,"wx");try{await r.writeFile(e,"utf8"),await r.sync()}finally{await r.close()}}async function Xn(t){try{let e=await(0,ce.open)(t,"r");try{await e.sync()}finally{await e.close()}}catch{}}async function Bt(t){try{await(0,ce.unlink)(t)}catch(e){if(!Qn(e))throw e}}function Qn(t){return typeof t=="object"&&t!==null&&"code"in t&&t.code==="ENOENT"}var lt=require("fs/promises"),Is=V(require("path")),_s=require("crypto");function I(t){return{layer:t.layer,severity:t.severity??"error",code:t.code,file:t.file,rule:t.rule,action:t.action,...t.objectId?{objectId:t.objectId}:{},...t.jsonPath?{jsonPath:t.jsonPath}:{}}}function q(t){return t.some(e=>e.severity==="error")}var Lt="0.0.0",ve="1.0.0",Ut=Lt,ze={now:()=>new Date().toISOString()};var qr=class{constructor(e,r,n=ze){this.paths=e;this.schemas=r;this.clock=n}async append(e,r,n,i=!1){let o=await this.paths.resolve(e,r),s=Pu(n,this.clock.now()),a=this.schemas.validate("audit-event.schema.json",s,r);if(q(a))throw new Be("invalid-audit-event",a);return await Es(o,r,i),await Eu(o,`${JSON.stringify(s)}
`),s}async assertAppendable(e,r,n=!1){let i=await this.paths.resolve(e,r);await Es(i,r,n)}async inspect(e,r){let n=await this.paths.resolve(e,r),i=await $s(n);return i.missing?{events:[],diagnostics:[Ds(r)]}:Iu(i.text,r,this.schemas)}},Be=class extends Error{constructor(r,n=[]){super(r);this.code=r;this.diagnostics=n}};function Pu(t,e){return{eventId:`evt_${(0,_s.randomUUID)().replace(/-/g,"")}`,timestamp:e,actor:t.actor,action:t.action,objectId:t.objectId,...t.beforeHash?{beforeHash:t.beforeHash}:{},...t.afterHash?{afterHash:t.afterHash}:{},...t.baseRevision?{baseRevision:t.baseRevision}:{},...t.resultingRevision?{resultingRevision:t.resultingRevision}:{},...t.metadata?{metadata:t.metadata}:{}}}async function Es(t,e,r){let n=await $s(t);if(n.missing&&!r)throw new Be("missing-audit-log",[Ds(e)]);if(n.text&&!n.text.endsWith(`
`))throw new Be("truncated-audit-final-line",[Ss(e)])}async function Eu(t,e){await(0,lt.mkdir)(Is.dirname(t),{recursive:!0});let r=await(0,lt.open)(t,"a");try{await r.writeFile(e,"utf8"),await r.sync()}finally{await r.close()}}async function $s(t){try{return{text:await(0,lt.readFile)(t,"utf8"),missing:!1}}catch(e){if($u(e))return{text:"",missing:!0};throw e}}function Iu(t,e,r){let n=[],i=[],o=t.split(`
`);for(let s=0;s<o.length;s++)o[s]&&_u(o[s],s,o.length,t,e,r,n,i);return{events:n,diagnostics:i}}function _u(t,e,r,n,i,o,s,a){let c=o.parseJson(t,i);if(!c.value){a.push(e===r-1&&!n.endsWith(`
`)?Ss(i):c.diagnostics[0]);return}let d=o.validate("audit-event.schema.json",c.value,i);a.push(...d),q(d)||s.push(c.value)}function Ss(t){return I({layer:"syntactic",code:"truncated-audit-final-line",file:t,severity:"warning",rule:"The audit log ends with an incomplete JSON line.",action:"Preserve the line for inspection and repair it before appending new events."})}function Ds(t){return I({layer:"integrity",code:"missing-audit-log",file:t,rule:"The project audit log is missing.",action:"Restore the audit log before applying more project writes."})}function $u(t){return typeof t=="object"&&t!==null&&"code"in t&&t.code==="ENOENT"}var Hr=class{resolve(e,r,n){let i=e.constructs.find(o=>o.constructId===r);return i?i.status==="approved"?{constructId:r,diagnostics:[]}:i.status!=="deprecated"?{diagnostics:[Vt("construct-not-approved",r,n)]}:this.resolveDeprecated(e,i,n):{diagnostics:[Vt("construct-not-found",r,n)]}}resolveDeprecated(e,r,n){let i=r.primaryConstructId;if(!i)return{diagnostics:[Vt("missing-primary-construct",r.constructId,n)]};if(i===r.constructId)return{diagnostics:[Vt("self-referential-primary",r.constructId,n)]};let o=e.constructs.find(s=>s.constructId===i);return!o||o.status!=="approved"?{diagnostics:[Vt("primary-construct-not-active",r.constructId,n)]}:{constructId:o.constructId,diagnostics:[]}}};function Vt(t,e,r){return I({layer:"structural",code:t,file:r,objectId:e,rule:`${e} does not resolve directly to an approved construct.`,action:"Map the identifier to one distinct approved primary construct."})}var Fr=class{constructor(e){this.constructs=e}validate(e,r){let n=Su(e,r);return[...Du(r,e),...ju(r,n,e),...Ru(r,n,e,this.constructs),...ku(r,n,e),...Ou(r,n,e),...Nu(r,n,e)]}};function Su(t,e){return{papers:new Set(t.papers.map(r=>r.paperId)),sources:new Map(t.papers.map(r=>[r.source.sourceId,r.paperId])),evidence:new Set(e.evidence.evidence.map(r=>r.evidenceId)),claims:new Set(e.claims.claims.map(r=>r.claimId)),gaps:new Set(e.gaps.gaps.map(r=>r.gapId))}}function Du(t,e){return[...pt(t.evidence.evidence.map(r=>r.evidenceId),e.documents.evidence),...pt(t.claims.claims.map(r=>r.claimId),e.documents.claims),...pt(t.conflicts.conflicts.map(r=>r.conflictId),e.documents.conflicts),...pt(t.gaps.gaps.map(r=>r.gapId),e.documents.gaps),...pt(t.researchQuestions.researchQuestions.map(r=>r.researchQuestionId),e.documents.researchQuestions),...pt(t.constructs.constructs.map(r=>r.constructId),e.documents.constructs)]}function pt(t,e){let r=new Set,n=[];for(let i of t)r.has(i)&&n.push(Ee("duplicate-identifier",e,i)),r.add(i);return n}function ju(t,e,r){return t.evidence.evidence.flatMap(n=>{let i=[];return e.papers.has(n.paperId)||i.push(Ee("missing-paper-reference",r.documents.evidence,n.evidenceId)),e.sources.get(n.source.sourceId)!==n.paperId&&i.push(Ee("source-registration-mismatch",r.documents.evidence,n.evidenceId)),i})}function Ru(t,e,r,n){return t.claims.claims.flatMap(i=>[...i.findingRefs.filter(o=>!e.papers.has(o.paperId)).map(()=>Ee("missing-paper-reference",r.documents.claims,i.claimId)),...i.evidenceRefs.filter(o=>!e.evidence.has(o)).map(()=>Ee("missing-evidence-reference",r.documents.claims,i.claimId)),...(i.constructRefs??[]).flatMap(o=>n.resolve(t.constructs,o,r.documents.claims).diagnostics)])}function ku(t,e,r){return t.conflicts.conflicts.flatMap(n=>[...e.claims.has(n.claimId)?[]:[Ee("missing-claim-reference",r.documents.conflicts,n.conflictId)],...n.findingRefs.filter(i=>!e.papers.has(i.paperId)).map(()=>Ee("missing-paper-reference",r.documents.conflicts,n.conflictId))])}function Ou(t,e,r){return t.gaps.gaps.flatMap(n=>[...n.evidenceRefs.filter(i=>!e.evidence.has(i)).map(()=>Ee("missing-evidence-reference",r.documents.gaps,n.gapId)),...n.adversarialPasses.filter(i=>i.gapId!==n.gapId).map(()=>Ee("adversarial-gap-mismatch",r.documents.gaps,n.gapId))])}function Nu(t,e,r){return t.researchQuestions.researchQuestions.flatMap(n=>[...n.gapRefs.filter(i=>!e.gaps.has(i)).map(()=>Ee("missing-gap-reference",r.documents.researchQuestions,n.researchQuestionId)),...n.claimRefs.filter(i=>!e.claims.has(i)).map(()=>Ee("missing-claim-reference",r.documents.researchQuestions,n.researchQuestionId))])}function Ee(t,e,r){return I({layer:"structural",code:t,file:e,objectId:r,rule:`${r} contains an unresolved or duplicated project reference.`,action:"Restore the referenced authoritative object or correct the reference."})}var js=require("fs/promises");function Zn(t,e){return t===ve?{mode:"read-write",diagnostics:[]}:{mode:"read-only",diagnostics:[Au(t,e)]}}function zr(t,e){let r=Mu(t);return r&&r!==ve?Zn(r,e).diagnostics:[]}function Mu(t){if(!t||typeof t!="object"||!("schema"in t))return;let e=t.schema;if(!(!e||typeof e!="object"||!("version"in e)))return typeof e.version=="string"?e.version:void 0}function Au(t,e){let r=Tu(t,ve)>0;return I({layer:"syntactic",severity:"warning",code:r?"unsupported-newer-version":"unsupported-older-version",file:e,rule:`Persisted schema ${t} is not supported by this application.`,action:r?"Open the project with a newer application version.":"Keep the project read-only until an explicit migration is available."})}function Tu(t,e){let r=t.split(".").map(Number),n=e.split(".").map(Number);for(let i=0;i<3;i++)if(r[i]!==n[i])return r[i]-n[i];return 0}async function Gt(t,e,r,n){let i;try{i=await(0,js.readFile)(t,"utf8")}catch(a){return{diagnostics:[Cu(e,a)]}}let o=n.parseJson(i,e);if(!o.value)return{diagnostics:o.diagnostics};let s=[...n.validate(r,o.value,e),...zr(o.value,e)];return q(s)?{diagnostics:s}:{value:o.value,diagnostics:s}}function Cu(t,e){let r=he(e,"ENOENT");return{layer:"syntactic",severity:"error",code:r?"missing-file":"inaccessible-file",file:t,rule:r?"The registered file does not exist.":"The registered file cannot be read.",action:r?"Restore the file or remove its registration.":"Check file permissions and retry."}}function he(t,e){return typeof t=="object"&&t!==null&&"code"in t&&t.code===e}var Qe=require("fs/promises"),G=V(require("path")),Q=class extends Error{constructor(r,n){super(`${r}: ${n}`);this.code=r}},Br=class{async canonicalRoot(e){return(0,Qe.realpath)(e)}async resolve(e,r,n=!1){ei(r);let i=await this.canonicalRoot(e),o=qu(i,r),s=await zu(o);return Rs(i,s,r),n&&await(0,Qe.access)(s),s}async resolveFromFile(e,r,n,i=!1){ei(r),ei(n);let o=Hu(r,n),s=await this.resolve(e,o,i);return{relativePath:o,target:s}}};function ei(t){if(!t)throw new Q("invalid-project-path",t);if(G.posix.isAbsolute(t)||G.win32.isAbsolute(t))throw new Q("absolute-path",t);if(t.includes("\\")||t.includes("\0"))throw new Q("invalid-project-path",t);if(t.split("/").some(Fu))throw new Q("path-traversal",t)}function qu(t,e){let r=G.resolve(t,...e.split("/"));return Rs(t,r,e),r}function Hu(t,e){let r=G.posix.dirname(t);return r==="."?e:G.posix.join(r,e)}function Fu(t){return t===""||t==="."||t===".."}async function zu(t){let e=await Bu(t),r=await(0,Qe.realpath)(e);return G.resolve(r,G.relative(e,t))}async function Bu(t){let e=t;for(;!await Lu(e);)e=G.dirname(e);return e}async function Lu(t){try{return await(0,Qe.lstat)(t),!0}catch{return!1}}function Rs(t,e,r){let n=G.relative(t,e);if(n===".."||n.startsWith(`..${G.sep}`)||G.isAbsolute(n))throw new Q("path-outside-project",r)}var Lr=class{constructor(e,r,n,i,o,s,a,c=ze){this.paths=e;this.schemas=r;this.writer=n;this.audit=i;this.papers=o;this.synthesis=s;this.integrity=a;this.clock=c}async rebuild(e,r,n=!1){let i=this.clock.now(),o=await this.loadInputs(e,r),s=[...o.diagnostics],a=await this.buildPaperEntries(e,r,o.paperIndex,o.evidence,o.taxonomyVersion,i,n,s),c=Xu(a,o.evidence,i);return s.push(...this.validateIndexes(r,c.paper,c.evidence)),await this.persistValidBuild(e,r,c,a,n,s),Ju(c,a,s)}async loadInputs(e,r){let n=await this.synthesis.readDocument(e,r.documents.paperIndex,"paper-index.schema.json"),i=await this.synthesis.readEvidence(e,r),o=await this.synthesis.readTaxonomy(e,r);return{...n.value?{paperIndex:n.value}:{},evidence:i.value?.evidence??[],taxonomyVersion:o.value?.taxonomyVersion??1,diagnostics:[...n.diagnostics.filter(s=>s.code!=="missing-file").map(Yu),...i.diagnostics,...o.diagnostics]}}async buildPaperEntries(e,r,n,i,o,s,a,c){let d=new Map((n?.entries??[]).map(p=>[p.paperId,p])),u=Uu(d,r),l={evidence:i,taxonomyVersion:o,now:s,full:a,build:u,diagnostics:c,auditPath:r.documents.auditLog};for(let p of r.papers)await this.addPaperEntry(e,p,d.get(p.paperId),l);return u}async addPaperEntry(e,r,n,i){let o=await this.calculateGraphHash(e,r);if(i.diagnostics.push(...o.diagnostics),!o.value)return;let s=await this.inspectSourceIdentity(e,r,i);if(!i.full&&n&&Vu(n,r,o.value,i.taxonomyVersion)){Gu(i.build,n);return}await this.rebuildPaperEntry(e,r,o.value,s,i)}async inspectSourceIdentity(e,r,n){let i=await this.integrity.inspectSource(e,r);return n.diagnostics.push(...i.diagnostics),await this.recordSourceChange(e,r,i.currentHash,n.auditPath),i.currentHash}async rebuildPaperEntry(e,r,n,i,o){let s=o.evidence.filter(c=>c.paperId===r.paperId),a=await this.integrity.inspectPaper(e,r,s,{graphHash:n,...i?{currentSourceHash:i}:{}});o.diagnostics.push(...a.diagnostics),!(!a.graph||q(a.diagnostics))&&(o.build.entries.push(this.papers.buildIndexMetadata(r,a.graph,n,o.taxonomyVersion,o.now,Ut)),o.build.processed.push(r.paperId))}async persistValidBuild(e,r,n,i,o,s){q(s)||(await this.audit.assertAppendable(e,r.documents.auditLog),await this.writeIndexes(e,r,n.paper,n.evidence),await this.appendAudit(e,r,i,o))}async calculateGraphHash(e,r){try{return{value:await this.papers.calculateGraphHash(e,r.path),diagnostics:[]}}catch(n){return{diagnostics:[Wu(r,n)]}}}async recordSourceChange(e,r,n,i){!n||n===r.source.sourceDocumentHash||await this.audit.append(e,i,{actor:{type:"service",id:"IntegrityService",version:Ut},action:"source.hash-changed",objectId:r.source.sourceId,beforeHash:r.source.sourceDocumentHash,afterHash:n,metadata:{paperId:r.paperId,sourcePath:r.source.relativePath}})}validateIndexes(e,r,n){return[...this.schemas.validate("paper-index.schema.json",r,e.documents.paperIndex),...this.schemas.validate("evidence-index.schema.json",n,e.documents.evidenceIndex)]}async writeIndexes(e,r,n,i){let o=await this.paths.resolve(e,r.documents.paperIndex),s=await this.paths.resolve(e,r.documents.evidenceIndex);await this.writer.writeBatch([{target:o,value:n},{target:s,value:i}])}async appendAudit(e,r,n,i){await this.audit.append(e,r.documents.auditLog,{actor:{type:"service",id:"IndexBuilder",version:Ut},action:"index.rebuilt",objectId:r.projectId,metadata:{full:i,processedPaperIds:n.processed,reusedPaperIds:n.reused,removedPaperIds:n.removed}})}};function Uu(t,e){let r=new Set(e.papers.map(n=>n.paperId));return{entries:[],processed:[],reused:[],removed:[...t.keys()].filter(n=>!r.has(n))}}function Vu(t,e,r,n){return t.paperGraphHash===r&&t.paperPath===e.path&&t.sourceDocumentHash===e.source.sourceDocumentHash&&t.taxonomyVersion===n&&t.extractorVersion===Ut}function Gu(t,e){t.entries.push(e),t.reused.push(e.paperId)}function Wu(t,e){let r=e instanceof Q?e.code:void 0,n=he(e,"ENOENT");return I({layer:r?"structural":"integrity",code:r??(n?"missing-paper-file":"inaccessible-paper-file"),file:t.path,objectId:t.paperId,rule:r?"The paper path escapes the project root.":"The paper graph cannot be read.",action:r?"Use a contained project-relative path.":"Restore the paper graph before rebuilding indexes."})}function Yu(t){return{...t,layer:"integrity",severity:"warning",code:"invalid-derived-index",action:"Rebuild the derived index from authoritative project data."}}function Ku(t,e){return{schema:{name:"nodegraph-paper-index",version:ve},generatedAt:e,entries:[...t].sort((r,n)=>r.paperId.localeCompare(n.paperId))}}function Xu(t,e,r){return{paper:Ku(t.entries,r),evidence:Qu(e,r)}}function Ju(t,e,r){return{paperIndex:t.paper,evidenceIndex:t.evidence,processedPaperIds:e.processed,reusedPaperIds:e.reused,removedPaperIds:e.removed,diagnostics:r}}function Qu(t,e){return{schema:{name:"nodegraph-evidence-index",version:ve},generatedAt:e,entries:t.map(r=>Zu(r,e)).sort((r,n)=>r.evidenceId.localeCompare(n.evidenceId))}}function Zu(t,e){return{evidenceId:t.evidenceId,paperId:t.paperId,...t.nodeId?{nodeId:t.nodeId}:{},evidenceObjectHash:t.evidenceObjectHash,quoteContentHash:t.quote.quoteContentHash,sourceDocumentHash:t.source.sourceDocumentHash,indexedAt:e}}var Gr=require("fs/promises");var ti=require("crypto");function Ur(t){return t.normalize("NFC").replace(/\r\n?/g,`
`).trim().replace(/\s+/gu," ")}function Wt(t){return JSON.stringify(ri(t))}function ft(t){return ni(Wt(t))}function Vr(t){return ni(Ur(t))}function ks(t){return ni(Wt(el(t)))}function Yt(t){return`sha256:${(0,ti.createHash)("sha256").update(t).digest("hex")}`}function el(t){return{evidenceId:t.evidenceId,paperId:t.paperId,source:tl(t),quote:rl(t),locator:nl(t)}}function tl(t){return{sourceId:t.source.sourceId,sourceDocumentHash:t.source.sourceDocumentHash}}function rl(t){let e=Ur(t.quote.text);return{text:e,quoteContentHash:Vr(e)}}function nl(t){let e={page:t.locator.page,exact:Ur(t.locator.exact)};return il(e,t,["prefix","suffix","section"]),e}function il(t,e,r){for(let n of r){let i=e.locator[n];i!==void 0&&(t[n]=Ur(i))}}function ri(t){return Array.isArray(t)?t.map(ri):sl(t)?ol(t):t}function ol(t){let e={};for(let r of Object.keys(t).sort())e[r]=ri(t[r]);return e}function sl(t){return t!==null&&typeof t=="object"}function ni(t){return`sha256:${(0,ti.createHash)("sha256").update(t,"utf8").digest("hex")}`}var Wr=class{constructor(e,r,n,i){this.paths=e;this.papers=r;this.synthesis=n;this.audit=i}async validate(e,r){let n=await this.synthesis.readBundle(e,r),i=await this.audit.inspect(e,r.documents.auditLog),o=[...n.diagnostics,...i.diagnostics];return n.bundle&&(o.push(...await this.validatePapers(e,r,n.bundle)),o.push(...await this.validateIndexes(e,r,n.bundle))),Ns(o)}async inspectPaper(e,r,n=[],i={}){let o=[],s=i.graphHash??await this.readGraphHash(e,r,o),a=i.currentSourceHash??await this.readSourceHash(e,r,o),c=await this.readGraph(e,r,o);return c&&o.push(...cl(n,c,r)),{...c?{graph:c}:{},...s?{graphHash:s}:{},...a?{currentSourceHash:a}:{},diagnostics:o}}async inspectSource(e,r){let n=[],i=await this.readSourceHash(e,r,n);return{...i?{currentHash:i}:{},diagnostics:n}}async identifyProjectSource(e,r){let n=await this.paths.resolve(e,r,!0);return Os(r,await(0,Gr.readFile)(n))}async identifyPaperSource(e,r,n){let i=await this.paths.resolveFromFile(e,r,n,!0);return Os(i.relativePath,await(0,Gr.readFile)(i.target))}async validatePapers(e,r,n){let i=[],o=al(n.evidence.evidence);for(let s of r.papers){let a=await this.inspectPaper(e,s,o.get(s.paperId)??[]);i.push(...a.diagnostics),a.graph&&i.push(...pl(a.graph,s,n))}return i}async validateIndexes(e,r,n){let i=await this.synthesis.readDocument(e,r.documents.paperIndex,"paper-index.schema.json"),o=await this.synthesis.readDocument(e,r.documents.evidenceIndex,"evidence-index.schema.json");return[...i.diagnostics.map(Ms),...o.diagnostics.map(Ms),...i.value?await fl(e,r,i.value,this.papers):[],...o.value?ml(n.evidence.evidence,o.value,r):[]]}async readGraph(e,r,n){try{let i=await this.papers.read(e,r);return n.push(...i.diagnostics),i.graph}catch(i){n.push(ii(i,r.path,r.paperId,"paper"));return}}async readGraphHash(e,r,n){try{return await this.papers.calculateGraphHash(e,r.path)}catch(i){n.push(ii(i,r.path,r.paperId,"paper"));return}}async readSourceHash(e,r,n){try{let i=await this.paths.resolve(e,r.source.relativePath,!0),o=Yt(await(0,Gr.readFile)(i));return o!==r.source.sourceDocumentHash&&n.push(vl(r,o)),o}catch(i){n.push(ii(i,r.source.relativePath,r.source.sourceId,"source"));return}}};function Os(t,e){return{relativePath:t,sourceDocumentHash:Yt(e)}}function Ns(t){return{valid:!q(t),diagnostics:t}}function al(t){let e=new Map;for(let r of t){let n=e.get(r.paperId)??[];n.push(r),e.set(r.paperId,n)}return e}function cl(t,e,r){return t.flatMap(n=>[...dl(n,r),...ul(n,r),...ll(n,e,r)])}function dl(t,e){let r=[];return Vr(t.quote.text)!==t.quote.quoteContentHash&&r.push(ht("stale-quotation-hash",t,e)),ks(t)!==t.evidenceObjectHash&&r.push(ht("stale-evidence-object-hash",t,e)),r}function ul(t,e){let r=e.source;return t.source.sourceId===r.sourceId&&t.source.sourceDocumentHash===r.sourceDocumentHash&&t.source.relativePath===r.relativePath?[]:[ht("evidence-source-mismatch",t,e)]}function ll(t,e,r){if(!t.nodeId)return[];let n=e.nodes.find(i=>i.id===t.nodeId);return n?n.original?.text?Vr(n.original.text)===t.quote.quoteContentHash?[]:[ht("stale-quotation-evidence",t,r)]:[ht("missing-node-evidence",t,r)]:[ht("broken-evidence-link",t,r)]}function pl(t,e,r){let n=[...r.claims.claims.flatMap(o=>o.findingRefs),...r.conflicts.conflicts.flatMap(o=>o.findingRefs)].filter(o=>o.paperId===e.paperId),i=new Set(t.nodes.map(o=>o.id));return n.filter(o=>!i.has(o.findingId)).map(o=>I({layer:"integrity",code:"orphaned-finding-reference",file:e.path,objectId:o.findingId,rule:"A synthesis object references a finding node that does not exist.",action:"Restore the node or update the synthesis reference through review."}))}async function fl(t,e,r,n){let i=[],o=new Map(e.papers.map(s=>[s.paperId,s]));for(let s of e.papers){let a=r.entries.find(c=>c.paperId===s.paperId);a?i.push(...await hl(t,s,a,n,e)):i.push(mt(e.documents.paperIndex,s.paperId))}for(let s of r.entries)o.has(s.paperId)||i.push(mt(e.documents.paperIndex,s.paperId));return i}async function hl(t,e,r,n,i){try{let o=await n.calculateGraphHash(t,e.path);return r.paperGraphHash!==o||r.paperPath!==e.path||r.sourceDocumentHash!==e.source.sourceDocumentHash?[mt(i.documents.paperIndex,e.paperId)]:[]}catch{return[mt(i.documents.paperIndex,e.paperId)]}}function ml(t,e,r){let n=new Map(t.map(o=>[o.evidenceId,o])),i=[];for(let o of t){let s=e.entries.find(a=>a.evidenceId===o.evidenceId);(!s||!gl(o,s))&&i.push(mt(r.documents.evidenceIndex,o.evidenceId))}for(let o of e.entries)n.has(o.evidenceId)||i.push(mt(r.documents.evidenceIndex,o.evidenceId));return i}function gl(t,e){return e.paperId===t.paperId&&e.nodeId===t.nodeId&&e.evidenceObjectHash===t.evidenceObjectHash&&e.quoteContentHash===t.quote.quoteContentHash&&e.sourceDocumentHash===t.source.sourceDocumentHash}function vl(t,e){return I({layer:"integrity",severity:"warning",code:"source-document-hash-mismatch",file:t.source.relativePath,objectId:t.source.sourceId,rule:`The current PDF hash ${e} does not match the registered source identity.`,action:"Restore the registered PDF or review and explicitly register the new source version."})}function ht(t,e,r){return I({layer:"integrity",severity:t.startsWith("stale-")?"warning":"error",code:t,file:r.path,objectId:e.evidenceId,rule:`${e.evidenceId} no longer matches its authoritative source or paper node.`,action:"Preserve the record and review the source, quotation, and link before updating it."})}function ii(t,e,r,n){let i=t instanceof Q?t.code:void 0,o=he(t,"ENOENT");return I({layer:i?"structural":"integrity",code:i??(o?`missing-${n}-file`:`inaccessible-${n}-file`),file:e,objectId:r,rule:i?"The path escapes the project root.":`The registered ${n} file cannot be read.`,action:i?"Use a contained project-relative path.":`Restore the ${n} file or remove its registration.`})}function mt(t,e){return I({layer:"integrity",severity:"warning",code:"stale-derived-index",file:t,objectId:e,rule:"The derived index entry does not match authoritative project data.",action:"Rebuild the index from the manifest, paper graphs, and evidence records."})}function Ms(t){return{...t,layer:"integrity",severity:"warning",code:t.code==="missing-file"?"missing-derived-index":"invalid-derived-index",action:"Rebuild the derived index from authoritative project data."}}var qs=require("fs/promises");var Z=class extends Error{constructor(r,n){super(`${r}: ${n}`);this.code=r;this.pointer=n}};function As(t,e){let r=gt(t);for(let n of e)r=yl(r,n);return r}function yl(t,e){if(e.path==="")return wl(t,e);let r=bl(e.path),n=El(t,r,e.path),i=r[r.length-1];return e.op==="add"?Il(t,n,i,e):e.op==="remove"?_l(t,n,i,e.path):e.op==="replace"?$l(t,n,i,e):(Sl(n,i,e),t)}function wl(t,e){if(e.op==="remove")throw new Z("root-remove-forbidden",e.path);if(e.op==="test"){if(!Cs(t,e.value))throw new Z("test-failed",e.path);return t}return gt(e.value)}function bl(t){if(!t.startsWith("/"))throw new Z("invalid-json-pointer",t);return t.slice(1).split("/").map(e=>Pl(xl(e),t))}function xl(t){return t.replace(/~1/g,"/").replace(/~0/g,"~")}function Pl(t,e){if(["__proto__","prototype","constructor"].includes(t))throw new Z("unsafe-json-pointer",e);return t}function El(t,e,r){let n=t;for(let i of e.slice(0,-1))n=Ts(n,i,r);return n}function Ts(t,e,r){if(Array.isArray(t))return t[Yr(e,t.length,r)];if(Kt(t)&&oi(t,e))return t[e];throw new Z("path-not-found",r)}function Il(t,e,r,n){if(Array.isArray(e))e.splice(jl(r,e.length,n.path),0,gt(n.value));else if(Kt(e))e[r]=gt(n.value);else throw new Z("invalid-patch-parent",n.path);return t}function _l(t,e,r,n){if(Array.isArray(e))e.splice(Yr(r,e.length,n),1);else if(Kt(e)&&oi(e,r))delete e[r];else throw new Z("path-not-found",n);return t}function $l(t,e,r,n){return Dl(e,r,n.path),Array.isArray(e)?e[Yr(r,e.length,n.path)]=gt(n.value):Kt(e)&&(e[r]=gt(n.value)),t}function Sl(t,e,r){let n=Ts(t,e,r.path);if(!Cs(n,r.value))throw new Z("test-failed",r.path)}function Dl(t,e,r){if(Array.isArray(t)){Yr(e,t.length,r);return}if(!Kt(t)||!oi(t,e))throw new Z("path-not-found",r)}function jl(t,e,r){if(t==="-")return e;let n=Number(t);if(!Number.isInteger(n)||n<0||n>e)throw new Z("invalid-array-index",r);return n}function Yr(t,e,r){let n=Number(t);if(!Number.isInteger(n)||n<0||n>=e)throw new Z("invalid-array-index",r);return n}function gt(t){return t===void 0?void 0:JSON.parse(JSON.stringify(t))}function Cs(t,e){return Wt(t)===Wt(e)}function Kt(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)}function oi(t,e){return Object.prototype.hasOwnProperty.call(t,e)}var Ae=class extends Error{constructor(r,n,i){super(`The authoritative write committed, but its audit event could not be appended: ${r}`);this.targetDocument=r;this.resultingRevision=n;this.cause=i;this.code="audit-append-failed"}},Kr=class{constructor(e,r,n,i,o){this.paths=e;this.schemas=r;this.writer=n;this.audit=i;this.reviews=o;this.recoveryRequired=new Set}async apply(e,r,n){let i=await this.paths.canonicalRoot(e);if(this.recoveryRequired.has(i))return Al(r);let o=this.schemas.validate("mutation-envelope.schema.json",r,"mutation-envelope");return q(o)?vt(r,o):this.applyValidated(e,i,r,n)}async requiresRecovery(e){let r=await this.paths.canonicalRoot(e);return this.recoveryRequired.has(r)}async applyValidated(e,r,n,i){let o=await this.paths.resolve(e,n.targetDocument),s=await Hs(o,n.targetDocument,this.schemas,i.schemaName);if(s.diagnostics.length)return vt(n,s.diagnostics);let a=s.value===void 0?"absent":ft(s.value);return a==="absent"&&n.baseRevision==="absent"&&!i.allowCreate?Ml(n):n.baseRevision!==a?this.rejectStale(e,n,i.auditPath,a):this.commitCandidate(e,o,s.value,a,r,n,i)}async commitCandidate(e,r,n,i,o,s,a){let c=kl(n,s);if(c instanceof Z)return Nl(s,c);let d=await this.validateCandidate(n,c,s,a);if(q(d))return vt(s,d);await this.audit.assertAppendable(e,a.auditPath,a.allowCreate??!1);let u=await this.writeCandidate(e,r,c,i,s,a);if(u)return u;let l=ft(c);return await this.appendCommitAudit(e,o,s,a,l),{accepted:!0,targetDocument:s.targetDocument,resultingRevision:l}}async writeCandidate(e,r,n,i,o,s){try{await this.writer.write(r,n,async()=>{let a=await Rl(r,o.targetDocument,this.schemas,s.schemaName);if(a!==i)throw new Xr(a)});return}catch(a){if(a instanceof Jr)return vt(o,a.diagnostics);if(!(a instanceof Xr))throw a;return this.rejectStale(e,o,s.auditPath,a.currentRevision)}}async validateCandidate(e,r,n,i){let o=this.schemas.validate(i.schemaName,r,n.targetDocument);if(q(o))return o;let s=this.reviews.validateApprovalAuthority(e,r,n.actor,n.targetDocument);if(q(s))return s;let a=await i.validateCandidate?.(r)??[];return[...o,...s,...a]}async rejectStale(e,r,n,i){return await this.audit.append(e,n,{actor:{type:"service",id:"SynthesisRepository",version:Lt},action:"mutation.rejected-stale",objectId:r.mutationId,baseRevision:r.baseRevision,metadata:{targetDocument:r.targetDocument,currentRevision:i}}),Ol(r,i)}async appendCommitAudit(e,r,n,i,o){try{await this.audit.append(e,i.auditPath,{actor:n.actor,action:i.auditAction,objectId:i.auditObjectId,baseRevision:n.baseRevision,resultingRevision:o,metadata:{mutationId:n.mutationId,targetDocument:n.targetDocument}},i.allowCreate??!1)}catch(s){throw this.recoveryRequired.add(r),new Ae(n.targetDocument,o,s)}}},Xr=class extends Error{constructor(r){super("revision-changed-before-replace");this.currentRevision=r}};async function Hs(t,e,r,n){let i;try{i=await(0,qs.readFile)(t,"utf8")}catch(s){return he(s,"ENOENT")?{diagnostics:[]}:{diagnostics:[Tl(e)]}}let o=r.parseJson(i,e);return o.value?{value:o.value,diagnostics:[...r.validate(n,o.value,e),...zr(o.value,e)]}:{diagnostics:o.diagnostics}}async function Rl(t,e,r,n){let i=await Hs(t,e,r,n);if(i.diagnostics.length)throw new Jr(i.diagnostics);return i.value===void 0?"absent":ft(i.value)}var Jr=class extends Error{constructor(r){super("current-document-invalid-before-replace");this.diagnostics=r}};function kl(t,e){try{return As(t,e.operations)}catch(r){if(r instanceof Z)return r;throw r}}function vt(t,e){return{accepted:!1,code:"invalid-mutation",targetDocument:t.targetDocument,currentRevision:t.baseRevision,receivedBaseRevision:t.baseRevision,retryable:!1,rejectedOperations:t.operations,diagnostics:e}}function Ol(t,e){return{accepted:!1,code:"stale-revision",targetDocument:t.targetDocument,currentRevision:e,receivedBaseRevision:t.baseRevision,retryable:!0,rejectedOperations:t.operations}}function Nl(t,e){return vt(t,[I({layer:"structural",code:e.code,file:t.targetDocument,jsonPath:e.pointer,rule:"The mutation operation cannot be applied to the current document.",action:"Refresh the document and correct the rejected operation."})])}function Ml(t){return vt(t,[I({layer:"structural",code:"authoritative-creation-not-allowed",file:t.targetDocument,rule:"Only project initialization may create an authoritative document from an absent revision.",action:"Create the project through ProjectRegistry before applying document mutations."})])}function Al(t){return{accepted:!1,code:"audit-recovery-required",targetDocument:t.targetDocument,currentRevision:t.baseRevision,receivedBaseRevision:t.baseRevision,retryable:!1,rejectedOperations:t.operations}}function Tl(t){return I({layer:"syntactic",code:"inaccessible-file",file:t,rule:"The current authoritative document cannot be read.",action:"Restore read access before retrying the mutation."})}var ci=require("fs/promises");function Xt(t){return t.normalize("NFC").trim()}function si(t){let e=new Map;for(let r of t){let n=Xt(r),i=Le(n);n&&!e.has(i)&&e.set(i,n)}return[...e.values()]}function Le(t){return Xt(t).toLowerCase()}var Qr=class{constructor(e,r){this.paths=e;this.schemas=r;this.hydratedPaperIds=[]}async read(e,r){let n=await this.paths.resolve(e,r.path,!0);this.hydratedPaperIds.push(r.paperId);let i=await(0,ci.readFile)(n,"utf8"),o=this.schemas.parseJson(i,r.path);if(!o.value)return{diagnostics:o.diagnostics};let s=this.validateGraph(o.value,r);return q(s)?{diagnostics:s}:{graph:o.value,diagnostics:s}}async calculateGraphHash(e,r){let n=await this.paths.resolve(e,r,!0);return Yt(await(0,ci.readFile)(n))}resolveNode(e,r){return e.nodes.find(n=>n.id===r)}buildIndexMetadata(e,r,n,i,o,s){return{paperId:e.paperId,paperPath:e.path,paperGraphHash:n,sourceDocumentHash:e.source.sourceDocumentHash,title:Xt(r.title),authors:zl(r),...Bl(r),tags:Ul(r),taxonomyVersion:i,extractorVersion:s,indexedAt:o}}instrumentation(){return{count:this.hydratedPaperIds.length,paperIds:[...this.hydratedPaperIds]}}resetInstrumentation(){this.hydratedPaperIds=[]}validateGraph(e,r){let n=this.schemas.validate("nodegraph.schema.json",e,r.path);return q(n)?n:Cl(e,r)}};function Cl(t,e){let r=[],n=ql(t.nodes.map(i=>i.id),e,r);return Hl(t,e,r),Fl(t,n,e,r),r}function ql(t,e,r){let n=new Set;for(let i of t)n.has(i)&&r.push(Vl(e,i)),n.add(i);return n}function Hl(t,e,r){let n=new Set;for(let i of t.edges)n.has(i.id)&&r.push(Gl(e,i.id)),n.add(i.id)}function Fl(t,e,r,n){for(let i of t.nodes)for(let o of i.children)e.has(o)||n.push(ai(r,o));for(let i of t.edges)e.has(i.source)||n.push(ai(r,i.source)),e.has(i.target)||n.push(ai(r,i.target))}function zl(t){return t.source?.authors?si([t.source.authors]):[]}function Bl(t){let e=Ll(t.source?.venue),r=t.source?.doi?Xt(t.source.doi):void 0;return{...e?{publicationYear:e}:{},...r?{doi:r}:{}}}function Ll(t){let e=t?.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);return e?Number(e[1]):void 0}function Ul(t){return Array.isArray(t.tags)?si(t.tags.filter(e=>typeof e=="string")):[]}function Vl(t,e){return di(t,"duplicate-node-id",e,"Make every node ID unique.")}function Gl(t,e){return di(t,"duplicate-edge-id",e,"Make every edge ID unique.")}function ai(t,e){return di(t,"missing-node-reference",e,"Restore the node or remove the broken reference.")}function di(t,e,r,n){return I({layer:"structural",code:e,file:t.path,objectId:r,rule:`${r} violates paper graph reference rules.`,action:n})}var wt=require("fs/promises"),Qt=V(require("path")),tn=require("crypto");var K="project.nodegraph.json",Wl="papers",en=class{constructor(e,r,n,i,o=ze){this.paths=e;this.schemas=r;this.writer=n;this.mutations=i;this.clock=o}async create(e,r,n){await(0,wt.mkdir)(e,{recursive:!0});let i=Qt.join(e,K);await dp(i);let o=Yl(r,n,this.clock.now()),s=this.schemas.validate("project.schema.json",o,K);return q(s)?{mode:"read-only",diagnostics:s,hydrationCount:0}:(await this.writeInitialProject(e,o),this.open(i))}async open(e){let r=Qt.dirname(e),n=await Gt(e,K,"project.schema.json",this.schemas);if(!n.value)return{mode:"read-only",diagnostics:n.diagnostics,hydrationCount:0};let i=n.value,o=Zn(i.schema.version,K),s=[...n.diagnostics,...Ls(i),...await this.inspectRegistrations(r,i)],a=await this.loadIndexes(r,i);return s.push(...a.diagnostics),{mode:o.mode==="read-only"||q(s)?"read-only":"read-write",manifest:i,manifestRevision:ft(i),...a.paperIndex?{paperIndex:a.paperIndex}:{},...a.evidenceIndex?{evidenceIndex:a.evidenceIndex}:{},diagnostics:s,hydrationCount:0}}async registerPaper(e,r,n,i,o){let s=await this.validateNewRegistration(e,r,n);if(q(s))return ap(n,i,s);let a=op(r,n,i,o,this.clock.now());return this.mutations.apply(e,a,{schemaName:"project.schema.json",auditPath:r.documents.auditLog,auditAction:"paper.registered",auditObjectId:n.paperId})}async unregisterPaper(e,r,n,i,o){let s=r.papers.findIndex(c=>c.paperId===n);if(s<0)return cp(n,i);let a=sp(r,s,n,i,o,this.clock.now());return this.mutations.apply(e,a,{schemaName:"project.schema.json",auditPath:r.documents.auditLog,auditAction:"paper.unregistered",auditObjectId:n})}async resolveDocument(e,r,n=!1){return this.paths.resolve(e,r,n)}async writeInitialProject(e,r){let n=Jl(r,this.clock.now()),i=Kl(r,n);await this.assertTargetsAbsent(e,i);let o=new Set;try{await(0,wt.mkdir)(Qt.join(e,Wl),{recursive:!0});for(let s of n)s.authoritative&&o.add(r.documents.auditLog),await this.writeTrackedInitialDocument(e,r,s,o);o.add(r.documents.auditLog),await this.writeTrackedAuthoritativeDocument(e,r,Xl(r),"project.created",r.projectId,o)}catch(s){throw await this.removeInitialFiles(e,[...o]),s}}async writeTrackedInitialDocument(e,r,n,i){try{await this.writeInitialDocument(e,r,n),i.add(n.path)}catch(o){throw o instanceof Ae&&i.add(n.path),o}}async writeTrackedAuthoritativeDocument(e,r,n,i,o,s){try{await this.writeAuthoritativeDocument(e,r,n,i,o),s.add(n.path)}catch(a){throw a instanceof Ae&&s.add(n.path),a}}async writeInitialDocument(e,r,n){let i=this.schemas.validate(n.schema,n.value,n.path);if(q(i))throw new Error(`Invalid initial document: ${n.path}`);if(n.authoritative){await this.writeAuthoritativeDocument(e,r,n,"project.document-created",n.path);return}await this.writer.write(await this.paths.resolve(e,n.path),n.value)}async writeAuthoritativeDocument(e,r,n,i,o){let s=await this.mutations.apply(e,Ql(n,this.clock.now()),{schemaName:n.schema,auditPath:r.documents.auditLog,auditAction:i,auditObjectId:o,allowCreate:!0});if(!s.accepted)throw new Error(`Failed to create ${n.path}: ${s.code}`)}async assertTargetsAbsent(e,r){for(let n of r){let i=await this.paths.resolve(e,n);await Ys(i)}}async removeInitialFiles(e,r){for(let n of[...r].reverse()){let i=await this.paths.resolve(e,n);await this.writer.remove(i)}}async inspectRegistrations(e,r){let n=[...Bs(r),...Us(r)];for(let i of r.papers)n.push(...await this.inspectRegistrationFiles(e,i));return n}async inspectRegistrationFiles(e,r){return[...await Gs(this.paths,e,r.path,r.paperId,"paper"),...await Gs(this.paths,e,r.source.relativePath,r.source.sourceId,"source")]}async loadIndexes(e,r){let n=await this.loadOptionalIndex(e,r.documents.paperIndex,"paper-index.schema.json"),i=await this.loadOptionalIndex(e,r.documents.evidenceIndex,"evidence-index.schema.json");return{...n.value?{paperIndex:n.value}:{},...i.value?{evidenceIndex:i.value}:{},diagnostics:[...n.diagnostics,...i.diagnostics]}}async loadOptionalIndex(e,r,n){let i=await this.paths.resolve(e,r),o=await Gt(i,r,n,this.schemas);return o.value?o:o.diagnostics.some(s=>s.code==="missing-file")?{diagnostics:[np(r)]}:{diagnostics:o.diagnostics.map(ip)}}async validateNewRegistration(e,r,n){let i={...r,papers:[...r.papers,n]},o=this.schemas.validate("project.schema.json",i,K);return o.push(...Ls(i)),o.push(...Bs(i)),o.push(...Us(i)),o.push(...await this.inspectRegistrationFiles(e,n)),o}};function Yl(t,e,r){return{schema:{name:"nodegraph-project",version:ve},projectId:t,title:e,created:r,modified:r,papers:[],documents:{claims:"synthesis/claims.json",conflicts:"synthesis/conflicts.json",gaps:"synthesis/gaps.json",researchQuestions:"synthesis/research-questions.json",constructs:"taxonomy/constructs.json",evidence:"evidence/records.json",paperIndex:"indexes/papers.index.json",evidenceIndex:"indexes/evidence.index.json",auditLog:"audit/events.jsonl"}}}function Kl(t,e){return[...e.map(r=>r.path),t.documents.auditLog,K]}function Xl(t){return{path:K,schema:"project.schema.json",value:t,authoritative:!0}}function Jl(t,e){return[yt(t.documents.claims,"synthesis-claims.schema.json",Jt("nodegraph-synthesis-claims","claims",e)),yt(t.documents.conflicts,"conflicts.schema.json",Jt("nodegraph-conflicts","conflicts",e)),yt(t.documents.gaps,"gaps.schema.json",Jt("nodegraph-gaps","gaps",e)),yt(t.documents.researchQuestions,"research-questions.schema.json",Jt("nodegraph-research-questions","researchQuestions",e)),yt(t.documents.constructs,"construct-taxonomy.schema.json",Zl(e)),yt(t.documents.evidence,"evidence-records.schema.json",Jt("nodegraph-evidence-records","evidence",e)),Fs(t.documents.paperIndex,"paper-index.schema.json",zs("nodegraph-paper-index",e)),Fs(t.documents.evidenceIndex,"evidence-index.schema.json",zs("nodegraph-evidence-index",e))]}function yt(t,e,r){return{path:t,schema:e,value:r,authoritative:!0}}function Fs(t,e,r){return{path:t,schema:e,value:r,authoritative:!1}}function Ql(t,e){return{mutationId:`mutation_${(0,tn.randomUUID)().replace(/-/g,"")}`,targetDocument:t.path,baseRevision:"absent",operations:[{op:"add",path:"",value:t.value}],requestedAt:e,actor:{type:"service",id:"ProjectRegistry",version:Lt}}}function Jt(t,e,r){return{schema:{name:t,version:ve},[e]:[],modified:r}}function Zl(t){return{schema:{name:"nodegraph-construct-taxonomy",version:ve},taxonomyVersion:1,constructs:[],modified:t}}function zs(t,e){return{schema:{name:t,version:ve},generatedAt:e,entries:[]}}function Bs(t){return[...Zr(t.papers.map(e=>e.paperId)).map(e=>ui("duplicate-paper-id",e)),...Zr(t.papers.map(e=>e.path)).map(e=>ui("duplicate-paper-path",e)),...Zr(t.papers.map(e=>e.source.sourceId)).map(e=>ui("duplicate-source-id",e))]}function Ls(t){let e=Object.values(t.documents);return[...Zr(e).map(ep),...e.filter(r=>r===K).map(tp)]}function Us(t){let e=new Set([K,...Object.values(t.documents)]);return t.papers.flatMap(r=>[...e.has(r.path)?[Vs(r.path,r.paperId)]:[],...e.has(r.source.relativePath)?[Vs(r.source.relativePath,r.source.sourceId)]:[]])}function Zr(t){let e=new Set,r=new Set;for(let n of t)e.has(n)&&r.add(n),e.add(n);return[...r]}function ep(t){return Ws("duplicate-project-document-path",t,"Give every manifest-owned document a distinct path.")}function tp(t){return Ws("reserved-project-document-path",t,"Use a subordinate path that is different from project.nodegraph.json.")}function Vs(t,e){return I({layer:"structural",code:"registration-path-collision",file:K,objectId:e,rule:`${t} is already owned by the project manifest.`,action:"Choose a distinct contained path for the paper graph or source PDF."})}function Ws(t,e,r){return I({layer:"structural",code:t,file:K,objectId:e,rule:`${e} cannot safely identify the requested project document.`,action:r})}function ui(t,e){return I({layer:"structural",code:t,file:K,objectId:e,rule:`${e} is registered more than once.`,action:"Keep one registration with a unique identifier and path."})}async function Gs(t,e,r,n,i){try{let o=await t.resolve(e,r,!0);return await(0,wt.access)(o),[]}catch(o){return[rp(r,n,i,o)]}}function rp(t,e,r,n){let i=n instanceof Q?n.code:void 0,o=he(n,"ENOENT");return I({layer:i?"structural":"integrity",code:i??(o?`missing-${r}-file`:`inaccessible-${r}-file`),file:t,objectId:e,rule:i?"The registered path escapes the project root.":`The registered ${r} file cannot be read.`,action:i?"Use a contained project-relative path.":`Restore the ${r} file or remove its registration.`})}function np(t){return I({layer:"integrity",severity:"warning",code:"missing-derived-index",file:t,rule:"The derived index is missing.",action:"Rebuild project indexes; authoritative data is unaffected."})}function ip(t){return{...t,layer:"integrity",severity:"warning",code:"invalid-derived-index",action:"Rebuild the derived index from authoritative project data."}}function op(t,e,r,n,i){return{mutationId:`mutation_${(0,tn.randomUUID)().replace(/-/g,"")}`,targetDocument:K,baseRevision:r,operations:[{op:"add",path:"/papers/-",value:e},{op:"replace",path:"/modified",value:i}],requestedAt:i,actor:n}}function sp(t,e,r,n,i,o){return{mutationId:`mutation_${(0,tn.randomUUID)().replace(/-/g,"")}`,targetDocument:K,baseRevision:n,operations:[{op:"test",path:`/papers/${e}/paperId`,value:r},{op:"remove",path:`/papers/${e}`},{op:"replace",path:"/modified",value:o}],requestedAt:o,actor:i}}function ap(t,e,r){return{accepted:!1,code:"invalid-registration",targetDocument:K,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[{op:"add",path:"/papers/-",value:t}],diagnostics:r}}function cp(t,e){return{accepted:!1,code:"paper-not-registered",targetDocument:K,currentRevision:e,receivedBaseRevision:e,retryable:!1,rejectedOperations:[],diagnostics:[I({layer:"structural",code:"paper-not-registered",file:K,objectId:t,rule:"The requested paper is not registered.",action:"Refresh the manifest and choose a registered paper."})]}}async function dp(t){return Ys(t)}async function Ys(t){try{throw await(0,wt.access)(t),new Error(`Project file already exists: ${t}`)}catch(e){if(!he(e,"ENOENT"))throw e}}var rn=class{constructor(e){this.papers=e}search(e,r){return e.entries.filter(n=>up(n,r)).map(n=>({paperId:n.paperId,paperPath:n.paperPath,title:n.title,authors:n.authors,...n.publicationYear?{publicationYear:n.publicationYear}:{},...n.doi?{doi:n.doi}:{},tags:n.tags}))}async hydratePaper(e,r,n){let i=gp(r,n);return this.papers.read(e,i)}};function up(t,e){return lp(t,e.text)&&fp(t,e.publicationYear)&&hp(t.doi,e.doi)&&mp(t.tags,e.tag)}function lp(t,e){if(!e?.trim())return!0;let r=Le(e);return pp(t).some(n=>Le(n).includes(r))}function pp(t){return[t.paperId,t.title,...t.authors,...t.publicationYear?[String(t.publicationYear)]:[],...t.doi?[t.doi]:[],...t.tags]}function fp(t,e){return e===void 0||t.publicationYear===e}function hp(t,e){return e===void 0||t!==void 0&&Le(t)===Le(e)}function mp(t,e){return e===void 0||t.some(r=>Le(r)===Le(e))}function gp(t,e){let r=t.papers.find(n=>n.paperId===e);if(!r)throw new Error(`paper-not-registered: ${e}`);return r}var nn=class{validateApprovalAuthority(e,r,n,i){return vp(e,r)?n.type==="human"?[]:n.type==="service"&&n.id==="ReviewStateService"?[]:[I({layer:"structural",code:"approval-authority-required",file:i,rule:"Approval fields may only be changed by a human or ReviewStateService.",action:"Submit the change for researcher review."})]:[]}};function vp(t,e){return JSON.stringify(Ks(t))!==JSON.stringify(Ks(e))}function Ks(t,e=""){let r={};return li(t,e,r),r}function li(t,e,r){if(Array.isArray(t)){t.forEach((n,i)=>li(n,`${e}/${i}`,r));return}if(yp(t))for(let[n,i]of Object.entries(t))n==="approval"?r[`${e}/approval`]=i:li(i,`${e}/${n}`,r)}function yp(t){return t!==null&&typeof t=="object"}var Fd=V(Qo()),zd=V(Hd()),Fn=require("fs"),Bd=V(require("path"));var Hn=class{constructor(e,r){this.validators=new Map;let n=Ey(),i=Iy(e);for(let[,s]of i)n.addSchema(s);for(let[s,a]of i)this.validators.set(s,n.getSchema(a.$id)??n.compile(a));let o=Ld(r);this.validators.set("nodegraph.schema.json",n.compile(o))}validate(e,r,n){let i=this.validators.get(e);return i?i(r)?[]:(i.errors??[]).map(o=>$y(n,o)):[_y(e,n)]}parseJson(e,r){try{return{value:JSON.parse(e),diagnostics:[]}}catch(n){return{diagnostics:[Dy(r,n)]}}}};function Ey(){let t=new Fd.default({allErrors:!0,strict:!1});return(0,zd.default)(t),t}function Iy(t){return(0,Fn.readdirSync)(t).filter(e=>e.endsWith(".schema.json")).map(e=>[e,Ld(Bd.join(t,e))])}function Ld(t){return JSON.parse((0,Fn.readFileSync)(t,"utf8"))}function _y(t,e){return I({layer:"syntactic",code:"schema-not-found",file:e,rule:`Schema ${t} is unavailable.`,action:"Restore the application schema files and retry."})}function $y(t,e){return I({layer:"syntactic",code:`schema-${e.keyword}`,file:t,jsonPath:e.instancePath||"/",rule:e.message??"The document does not match its schema.",action:Sy(e)})}function Sy(t){return t.keyword==="required"?"Add the required property shown in the diagnostic.":t.keyword==="additionalProperties"?"Remove the unsupported property.":"Correct the value to match the documented schema."}function Dy(t,e){return I({layer:"syntactic",code:"invalid-json",file:t,rule:e instanceof Error?e.message:"The file is not valid JSON.",action:"Correct the JSON syntax without replacing the existing file."})}var zn=class{constructor(e,r,n,i){this.paths=e;this.schemas=r;this.mutations=n;this.crossDocuments=i}async readBundle(e,r){let n=await this.readBundleDocuments(e,r),i=jy(n);if(!Ry(n))return{diagnostics:i};let o=ky(n);return i.push(...this.crossDocuments.validate(r,o)),{bundle:o,diagnostics:i}}async readEvidence(e,r){return this.readDocument(e,r.documents.evidence,"evidence-records.schema.json")}async readTaxonomy(e,r){return this.readDocument(e,r.documents.constructs,"construct-taxonomy.schema.json")}async applyMutation(e,r,n){let i=Ny(r).find(o=>o.path===n.targetDocument);return i?this.mutations.apply(e,n,{schemaName:i.schema,auditPath:r.documents.auditLog,auditAction:i.auditAction,auditObjectId:n.mutationId,validateCandidate:o=>this.validateCandidate(e,r,i,o)}):My(n)}async readDocument(e,r,n){let i=await this.paths.resolve(e,r);return Gt(i,r,n,this.schemas)}async validateCandidate(e,r,n,i){let o=await this.readBundle(e,r);if(!o.bundle)return o.diagnostics;let s=Oy(o.bundle,n.key,i);return this.crossDocuments.validate(r,s)}async readBundleDocuments(e,r){let[n,i,o,s,a,c]=await Promise.all([this.readDocument(e,r.documents.claims,"synthesis-claims.schema.json"),this.readDocument(e,r.documents.conflicts,"conflicts.schema.json"),this.readDocument(e,r.documents.gaps,"gaps.schema.json"),this.readDocument(e,r.documents.researchQuestions,"research-questions.schema.json"),this.readDocument(e,r.documents.constructs,"construct-taxonomy.schema.json"),this.readDocument(e,r.documents.evidence,"evidence-records.schema.json")]);return{claims:n,conflicts:i,gaps:o,researchQuestions:s,constructs:a,evidence:c}}};function jy(t){return Object.values(t).flatMap(e=>e.diagnostics)}function Ry(t){return Object.values(t).every(e=>e.value!==void 0)}function ky(t){return{claims:t.claims.value,conflicts:t.conflicts.value,gaps:t.gaps.value,researchQuestions:t.researchQuestions.value,constructs:t.constructs.value,evidence:t.evidence.value}}function Oy(t,e,r){switch(e){case"claims":return{...t,claims:r};case"conflicts":return{...t,conflicts:r};case"gaps":return{...t,gaps:r};case"researchQuestions":return{...t,researchQuestions:r};case"constructs":return{...t,constructs:r};case"evidence":return{...t,evidence:r}}}function Ny(t){return[{key:"claims",path:t.documents.claims,schema:"synthesis-claims.schema.json",auditAction:"synthesis.claims-mutated"},{key:"conflicts",path:t.documents.conflicts,schema:"conflicts.schema.json",auditAction:"synthesis.conflicts-mutated"},{key:"gaps",path:t.documents.gaps,schema:"gaps.schema.json",auditAction:"synthesis.gaps-mutated"},{key:"researchQuestions",path:t.documents.researchQuestions,schema:"research-questions.schema.json",auditAction:"synthesis.questions-mutated"},{key:"constructs",path:t.documents.constructs,schema:"construct-taxonomy.schema.json",auditAction:"taxonomy.constructs-mutated"},{key:"evidence",path:t.documents.evidence,schema:"evidence-records.schema.json",auditAction:"evidence.records-mutated"}]}function My(t){return{accepted:!1,code:"unsupported-mutation-target",targetDocument:t.targetDocument,currentRevision:t.baseRevision,receivedBaseRevision:t.baseRevision,retryable:!1,rejectedOperations:t.operations}}function Ud(t){let e=t.clock??ze,r=new Br,n=Ay(t.extensionRoot),i=t.writer??new Tr,o=new qr(r,n,e),s=new Qr(r,n),a=new nn,c=new Kr(r,n,i,o,a),d=new Fr(new Hr),u=new zn(r,n,c,d),l=new Wr(r,s,u,o),p=new en(r,n,i,c,e),f=new Lr(r,n,i,o,s,u,l,e),h=new rn(s);return{paths:r,schemas:n,audit:o,papers:s,registry:p,synthesis:u,integrity:l,indexes:f,queries:h}}function Ay(t){return new Hn(ss.join(t,"docs","schemas"),ss.join(t,"schema","nodegraph.schema.json"))}var Bn=V(require("path"));var me=class extends Error{constructor(r,n,i=[],o){super(n);this.code=r;this.diagnostics=i;this.cause=o}},Vd={type:"human",id:"researcher"},Ln=class{constructor(e){this.runtime=e}create(e,r,n){return this.runtime.registry.create(e,r,n)}open(e){return this.runtime.papers.resetInstrumentation(),this.runtime.registry.open(e)}async validate(e){let r=await this.open(e);if(!r.manifest)return{valid:!1,diagnostics:r.diagnostics};let n=await this.runtime.integrity.validate(Bn.dirname(e),r.manifest),i=[...r.diagnostics,...n.diagnostics];return{valid:!q(i),diagnostics:i}}async rebuildIndexes(e,r=!1){let n=await this.openWritableProject(e);return this.runtime.indexes.rebuild(n.root,n.opened.manifest,r)}async search(e,r){let n=await this.open(e);return n.paperIndex?this.runtime.queries.search(n.paperIndex,r):[]}async registerPaper(e,r,n=Vd){let i=await this.openWritableProject(e),o=await this.buildRegistration(i.root,r),s=await this.runtime.registry.registerPaper(i.root,i.opened.manifest,o,i.opened.manifestRevision,n);return s.accepted?this.rebuildAfterMutation(e,s):{mutation:s,diagnostics:s.diagnostics??[]}}async unregisterPaper(e,r,n=Vd){let i=await this.openWritableProject(e),o=await this.runtime.registry.unregisterPaper(i.root,i.opened.manifest,r,i.opened.manifestRevision,n);return o.accepted?this.rebuildAfterMutation(e,o):{mutation:o,diagnostics:o.diagnostics??[]}}async openWritableProject(e){let r=await this.open(e);if(!r.manifest||!r.manifestRevision)throw new me("project-manifest-invalid","The project manifest is invalid.",r.diagnostics);if(r.mode==="read-only")throw new me("project-read-only","The project is read-only until its reported errors are corrected.",r.diagnostics);return{root:Bn.dirname(e),opened:{...r,manifest:r.manifest,manifestRevision:r.manifestRevision}}}async buildRegistration(e,r){let n=Ty(r),i=await this.readRegistrationGraph(e,n);if(!i.graph||q(i.diagnostics))throw new me("invalid-paper-graph","The paper graph cannot be registered until its errors are corrected.",i.diagnostics);let o=await this.buildSource(e,r,i.graph);return{paperId:r.paperId,path:r.paperPath,source:o}}async readRegistrationGraph(e,r){try{return await this.runtime.papers.read(e,r)}catch(n){throw Hy(n,r.path)}}async buildSource(e,r,n){let i=await this.identifySource(e,r,n.source?.pdf);return{sourceId:r.sourceId,...i,...n.source?.doi?{doi:n.source.doi}:{},title:n.title,...r.sourceVersion?{version:r.sourceVersion}:{}}}async identifySource(e,r,n){try{if(r.sourcePath)return await this.runtime.integrity.identifyProjectSource(e,r.sourcePath);if(!n)throw Cy(r.paperPath);return await this.runtime.integrity.identifyPaperSource(e,r.paperPath,n)}catch(i){throw i instanceof me?i:qy(i,r.sourcePath??n??r.paperPath)}}async rebuildAfterMutation(e,r){let n=await this.open(e);if(!n.manifest)return{mutation:r,project:n,diagnostics:n.diagnostics};try{let i=await this.runtime.indexes.rebuild(Bn.dirname(e),n.manifest);return{mutation:r,indexes:i,project:n,diagnostics:i.diagnostics}}catch(i){let o=Fy(i);return{mutation:r,project:n,diagnostics:o.diagnostics,indexFailure:o}}}};function Ty(t){return{paperId:t.paperId,path:t.paperPath,source:{sourceId:t.sourceId,relativePath:t.sourcePath??t.paperPath,sourceDocumentHash:`sha256:${"0".repeat(64)}`}}}function Cy(t){return new me("paper-source-path-required","The paper graph does not identify its source PDF.",[I({layer:"structural",code:"paper-source-path-required",file:t,rule:"A registered paper must identify a source PDF.",action:"Add source.pdf to the paper graph or provide a project-relative source path."})])}function qy(t,e){let r=t instanceof Q?t.code:void 0,n=he(t,"ENOENT"),i=r??(n?"missing-source-file":"inaccessible-source-file");return new me(i,"The paper source could not be registered.",[I({layer:r?"structural":"integrity",code:i,file:e,rule:r?"The source path is not a contained project-relative path.":"The source PDF cannot be read.",action:r?"Choose a PDF inside the project and use its project-relative path.":"Restore read access to the source PDF before registering the paper."})],t)}function Hy(t,e){let r=t instanceof Q?t.code:void 0,n=he(t,"ENOENT"),i=r??(n?"missing-paper-file":"inaccessible-paper-file");return new me(i,"The paper graph could not be registered.",[I({layer:r?"structural":"integrity",code:i,file:e,rule:r?"The paper graph path is not a contained project-relative path.":"The paper graph cannot be read.",action:r?"Choose a paper graph inside the project.":"Restore read access to the paper graph before registering it."})],t)}function Fy(t){return new me("index-rebuild-failed","The authoritative mutation committed, but its derived indexes could not be rebuilt.",[I({layer:"integrity",code:"index-rebuild-failed",file:"indexes",rule:"The authoritative mutation committed, but its derived indexes could not be rebuilt.",action:"Correct the reported file problem and rebuild the disposable indexes."})],t)}var Pe=V(require("path")),z=V(require("vscode"));function Wd(t,e){let r=z.window.createOutputChannel("NodeGraph Projects");t.subscriptions.push(r,z.commands.registerCommand("nodegraph.project.create",n=>ut(r,()=>zy(e,r,n))),z.commands.registerCommand("nodegraph.project.open",n=>ut(r,()=>By(e,r,n))),z.commands.registerCommand("nodegraph.project.registerPaper",n=>ut(r,()=>Ly(e,r,n))),z.commands.registerCommand("nodegraph.project.unregisterPaper",n=>ut(r,()=>Uy(e,r,n))),z.commands.registerCommand("nodegraph.project.validate",n=>ut(r,()=>Vy(e,r,n))),z.commands.registerCommand("nodegraph.project.rebuildIndexes",n=>ut(r,()=>Gy(e,r,n))),z.commands.registerCommand("nodegraph.project.search",n=>ut(r,()=>Wy(e,r,n))))}async function zy(t,e,r){let n=r??await Yy("Choose a folder for the NodeGraph project");if(!n)return;let i=await z.window.showInputBox({prompt:"Project ID",value:`project_${Pe.basename(n.fsPath).replace(/[^A-Za-z0-9_-]/g,"_")}`,validateInput:Qy});if(!i)return;let o=await z.window.showInputBox({prompt:"Project title"});if(!o)return;let s=await t.create(n.fsPath,i,o);as(e,s)}async function By(t,e,r){let n=await Ht(r);n&&as(e,await t.open(n.fsPath))}async function Ly(t,e,r){let n=await Ht(r);if(!n)return;let i=await Ky(Pe.dirname(n.fsPath));if(!i)return;let o=await z.window.showInputBox({prompt:"Stable paper ID",value:`paper_${Pe.basename(i.fsPath,".nodegraph.json").replace(/[^A-Za-z0-9_-]/g,"_")}`,validateInput:d=>/^paper_[A-Za-z0-9_-]+$/.test(d)?void 0:"Use paper_<letters, numbers, _ or ->"});if(!o)return;let s=await z.window.showInputBox({prompt:"Stable source ID",value:`source_${o.slice(6)}`,validateInput:d=>/^source_[A-Za-z0-9_-]+$/.test(d)?void 0:"Use source_<letters, numbers, _ or ->"});if(!s)return;let a=Zy(Pe.dirname(n.fsPath),i.fsPath),c=await t.registerPaper(n.fsPath,{paperId:o,paperPath:a,sourceId:s});Yd(e,c)}async function Uy(t,e,r){let n=await Ht(r);if(!n)return;let i=await t.open(n.fsPath);if(!i.manifest)return as(e,i);let o=await z.window.showQuickPick(i.manifest.papers.map(a=>({label:Gd(a.paperId),description:Gd(a.path),paperId:a.paperId})),{placeHolder:"Choose a paper registration to remove"});if(!o)return;let s=await t.unregisterPaper(n.fsPath,o.paperId);Yd(e,s)}async function Vy(t,e,r){let n=await Ht(r);if(!n)return;let i=await t.validate(n.fsPath);qt(e,i.diagnostics),z.window.showInformationMessage(i.valid?"NodeGraph project validation passed.":"NodeGraph project validation found errors.")}async function Gy(t,e,r){let n=await Ht(r);if(!n)return;let i=await t.rebuildIndexes(n.fsPath,!0);qt(e,i.diagnostics),e.appendLine(`Processed: ${i.processedPaperIds.length}; reused: ${i.reusedPaperIds.length}; removed: ${i.removedPaperIds.length}`),e.show(!0)}async function Wy(t,e,r){let n=await Ht(r);if(!n)return;let i=await z.window.showInputBox({prompt:"Search indexed paper metadata"});if(i===void 0)return;let o=await t.search(n.fsPath,{text:i});e.appendLine(`Search results: ${o.length}`);for(let s of o)e.appendLine(`${W(s.paperId)} | ${W(s.title)} | ${W(s.paperPath)}`);e.show(!0)}async function Ht(t){return t?.fsPath.endsWith("project.nodegraph.json")?t:(await z.window.showOpenDialog({canSelectMany:!1,filters:{"NodeGraph Project":["json"]},title:"Open project.nodegraph.json"}))?.[0]}async function Yy(t){return(await z.window.showOpenDialog({canSelectFolders:!0,canSelectFiles:!1,canSelectMany:!1,title:t}))?.[0]}async function Ky(t){return(await z.window.showOpenDialog({canSelectMany:!1,defaultUri:z.Uri.file(Pe.join(t,"papers")),filters:{"NodeGraph Paper":["json"]},title:"Register a .nodegraph.json paper"}))?.[0]}async function ut(t,e){try{await e()}catch(r){Xy(t,r)}}function as(t,e){e.manifest&&(t.appendLine(`${W(e.manifest.title)} (${W(e.manifest.projectId)})`),t.appendLine(`Mode: ${e.mode}; registered papers: ${e.manifest.papers.length}; hydrated papers: ${e.hydrationCount}`)),qt(t,e.diagnostics),t.show(!0)}function Yd(t,e){t.appendLine(e.mutation.accepted?"Mutation accepted.":"Mutation rejected."),qt(t,e.diagnostics),t.show(!0)}function Xy(t,e){e instanceof me?(t.appendLine(`[error] ${W(e.code)} | ${W(e.message)}`),qt(t,e.diagnostics)):e instanceof Ae?t.appendLine(`[error] ${e.code} | ${W(e.targetDocument)} | committed revision ${W(e.resultingRevision)}`):e instanceof Be?(t.appendLine(`[error] ${W(e.code)} | audit log is not writable`),qt(t,e.diagnostics)):t.appendLine(`[error] unexpected-project-error | ${W(Kd(e))}`),t.show(!0),z.window.showErrorMessage(Jy(e))}function Jy(t){return t instanceof Ae?"NodeGraph saved the document, but could not record its audit event. Further writes are blocked until the audit log is repaired.":t instanceof Be?"NodeGraph project operation failed: repair or restore the audit log before writing.":t instanceof me?`NodeGraph project operation failed: ${W(t.message)}`:`NodeGraph project operation failed: ${W(Kd(t))}`}function qt(t,e){for(let r of e)t.appendLine(`[${r.severity}] ${W(r.code)} | ${W(r.file)} | ${W(r.rule)} | ${W(r.action)}`)}function Qy(t){return/^project_[A-Za-z0-9_-]+$/.test(t)?void 0:"Use project_<letters, numbers, _ or ->"}function Zy(t,e){return Pe.relative(t,e).split(Pe.sep).join("/")}function Gd(t){return W(t).replace(/\$\(/g,"\uFF04(")}function W(t){return t.replace(/[\u0000-\u001f\u007f]/g," ")}function Kd(t){return t instanceof Error?t.message:String(t)}var ew=[{id:"tomoki1207.pdf",name:"vscode-pdf (PDF Viewer)"}];async function tw(){for(let t of ew)if(!B.extensions.getExtension(t.id))try{await B.commands.executeCommand("workbench.extensions.installExtension",t.id)}catch{}}async function Xd(t){if(t)return t;let e=B.workspace.workspaceFolders??[];return e.length===0?void 0:e.length===1?e[0].uri:(await B.window.showWorkspaceFolderPick({placeHolder:"Select a folder for NodeGraph"}))?.uri}async function rw(t){let e=await Xd(t),r=e?B.Uri.joinPath(e,"untitled.nodegraph.json"):void 0,n=await B.window.showSaveDialog({defaultUri:r,filters:{NodeGraph:["nodegraph.json"]},title:"Create New NodeGraph"});if(!n)return;let i=n.fsPath.endsWith(".nodegraph.json")?n:n.with({path:n.path.replace(/(\.nodegraph)?(\.json)?$/,"")+".nodegraph.json"}),o=Nr();await B.workspace.fs.writeFile(i,Buffer.from(JSON.stringify(o,null,2),"utf-8")),await B.commands.executeCommand("vscode.openWith",i,"nodegraph.editor")}function nw(t){let e=Ud({extensionRoot:t.extensionPath}),r=new Ln(e);t.subscriptions.push(Fe.register(t)),Wd(t,r),t.subscriptions.push(B.commands.registerCommand("nodegraph.search",()=>{Fe.postToActive({type:"openSearch"})}),B.commands.registerCommand("nodegraph.fitView",()=>{Fe.postToActive({type:"fitView"})}),B.commands.registerCommand("nodegraph.collapseAll",()=>{Fe.postToActive({type:"collapseAll"})}),B.commands.registerCommand("nodegraph.expandAll",()=>{Fe.postToActive({type:"expandAll"})}),B.commands.registerCommand("nodegraph.new",n=>rw(n))),ys(B.workspace.workspaceFolders??[]),t.subscriptions.push(B.commands.registerCommand("nodegraph.copyAgentSpec",async n=>{let i=await Xd(n);if(!i){B.window.showWarningMessage("NodeGraph: open or select a folder first \u2014 there is no workspace to copy the spec into.");return}let o=await ws(t.extensionUri,i),s=await Kn(i),a=await bs(t.extensionUri,i);o&&s&&a?B.window.showInformationMessage(`NodeGraph: wrote .agent/NODEGRAPH_SPEC.md, .agent/ENVIRONMENT.md, and .prompt/{korean,english}.md in ${i.fsPath}.`):B.window.showErrorMessage("NodeGraph: failed to write the agent files \u2014 check that the folder is writable and try again.")})),tw()}function iw(){}0&&(module.exports={activate,deactivate});
