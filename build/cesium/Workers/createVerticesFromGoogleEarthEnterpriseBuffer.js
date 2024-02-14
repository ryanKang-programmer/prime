define(["./AxisAlignedBoundingBox-39ab50d0","./Transforms-fce95115","./Matrix2-413c4048","./Matrix3-81054f0f","./defaultValue-f6d5e6da","./TerrainEncoding-bd5c9ed5","./Math-2ce22ee9","./OrientedBoundingBox-cfd17917","./RuntimeError-9b4ce3fb","./WebMercatorProjection-943e2226","./createTaskProcessorWorker","./combine-0c102d93","./AttributeCompression-48e336db","./ComponentDatatype-ab629b88","./WebGLConstants-7f557f93","./EllipsoidTangentPlane-82f2a887","./IntersectionTests-357c3d7f","./Plane-6add0ae1"],(function(t,e,n,i,o,a,r,s,c,u,h,d,l,g,m,p,f,I){"use strict";const E=Uint16Array.BYTES_PER_ELEMENT,T=Int32Array.BYTES_PER_ELEMENT,C=Uint32Array.BYTES_PER_ELEMENT,M=Float32Array.BYTES_PER_ELEMENT,x=Float64Array.BYTES_PER_ELEMENT;function N(t,e,n){n=o.defaultValue(n,r.CesiumMath);const i=t.length;for(let o=0;o<i;++o)if(n.equalsEpsilon(t[o],e,r.CesiumMath.EPSILON12))return o;return-1}const b=new i.Cartographic,S=new i.Cartesian3,w=new i.Cartesian3,B=new i.Cartesian3,P=new n.Matrix4;function A(t,e,a,s,c,u,h,d,l,g,m){const p=d.length;for(let f=0;f<p;++f){const I=d[f],E=I.cartographic,T=I.index,C=t.length,M=E.longitude;let x=E.latitude;x=r.CesiumMath.clamp(x,-r.CesiumMath.PI_OVER_TWO,r.CesiumMath.PI_OVER_TWO);const N=E.height-h.skirtHeight;h.hMin=Math.min(h.hMin,N),i.Cartographic.fromRadians(M,x,N,b),g&&(b.longitude+=l),g?f===p-1?b.latitude+=m:0===f&&(b.latitude-=m):b.latitude+=l;const w=h.ellipsoid.cartographicToCartesian(b);t.push(w),e.push(N),a.push(n.Cartesian2.clone(a[T])),s.length>0&&s.push(s[T]),c.length>0&&c.push(c[T]),n.Matrix4.multiplyByPoint(h.toENU,w,S);const B=h.minimum,P=h.maximum;i.Cartesian3.minimumByComponent(S,B,B),i.Cartesian3.maximumByComponent(S,P,P);const A=h.lastBorderPoint;if(o.defined(A)){const t=A.index;u.push(t,C-1,C,C,T,t)}h.lastBorderPoint=I}}return h((function(h,d){h.ellipsoid=i.Ellipsoid.clone(h.ellipsoid),h.rectangle=n.Rectangle.clone(h.rectangle);const l=function(h,d,l,g,m,p,f,I,y,R,_){let W,v,F,O,V,Y;o.defined(g)?(W=g.west,v=g.south,F=g.east,O=g.north,V=g.width,Y=g.height):(W=r.CesiumMath.toRadians(m.west),v=r.CesiumMath.toRadians(m.south),F=r.CesiumMath.toRadians(m.east),O=r.CesiumMath.toRadians(m.north),V=r.CesiumMath.toRadians(g.width),Y=r.CesiumMath.toRadians(g.height));const U=[v,O],k=[W,F],H=e.Transforms.eastNorthUpToFixedFrame(d,l),L=n.Matrix4.inverseTransformation(H,P);let D,G;y&&(D=u.WebMercatorProjection.geodeticLatitudeToMercatorAngle(v),G=1/(u.WebMercatorProjection.geodeticLatitudeToMercatorAngle(O)-D));const j=1!==p,z=new DataView(h);let q=Number.POSITIVE_INFINITY,J=Number.NEGATIVE_INFINITY;const K=w;K.x=Number.POSITIVE_INFINITY,K.y=Number.POSITIVE_INFINITY,K.z=Number.POSITIVE_INFINITY;const Q=B;Q.x=Number.NEGATIVE_INFINITY,Q.y=Number.NEGATIVE_INFINITY,Q.z=Number.NEGATIVE_INFINITY;let X,Z,$=0,tt=0,et=0;for(Z=0;Z<4;++Z){let t=$;X=z.getUint32(t,!0),t+=C;const e=r.CesiumMath.toRadians(180*z.getFloat64(t,!0));t+=x,-1===N(k,e)&&k.push(e);const n=r.CesiumMath.toRadians(180*z.getFloat64(t,!0));t+=x,-1===N(U,n)&&U.push(n),t+=2*x;let i=z.getInt32(t,!0);t+=T,tt+=i,i=z.getInt32(t,!0),et+=3*i,$+=X+C}const nt=[],it=[],ot=new Array(tt),at=new Array(tt),rt=new Array(tt),st=y?new Array(tt):[],ct=j?new Array(tt):[],ut=new Array(et),ht=[],dt=[],lt=[],gt=[];let mt=0,pt=0;for($=0,Z=0;Z<4;++Z){X=z.getUint32($,!0),$+=C;const t=$,e=r.CesiumMath.toRadians(180*z.getFloat64($,!0));$+=x;const o=r.CesiumMath.toRadians(180*z.getFloat64($,!0));$+=x;const a=r.CesiumMath.toRadians(180*z.getFloat64($,!0)),s=.5*a;$+=x;const h=r.CesiumMath.toRadians(180*z.getFloat64($,!0)),d=.5*h;$+=x;const g=z.getInt32($,!0);$+=T;const m=z.getInt32($,!0);$+=T,$+=T;const p=new Array(g);for(let c=0;c<g;++c){const t=e+z.getUint8($++)*a;b.longitude=t;const g=o+z.getUint8($++)*h;b.latitude=g;let m=z.getFloat32($,!0);if($+=M,0!==m&&m<_&&(m*=-Math.pow(2,R)),m*=6371010,b.height=m,-1!==N(k,t)||-1!==N(U,g)){const t=N(nt,b,i.Cartographic);if(-1!==t){p[c]=it[t];continue}nt.push(i.Cartographic.clone(b)),it.push(mt)}p[c]=mt,Math.abs(t-W)<s?ht.push({index:mt,cartographic:i.Cartographic.clone(b)}):Math.abs(t-F)<s?lt.push({index:mt,cartographic:i.Cartographic.clone(b)}):Math.abs(g-v)<d?dt.push({index:mt,cartographic:i.Cartographic.clone(b)}):Math.abs(g-O)<d&&gt.push({index:mt,cartographic:i.Cartographic.clone(b)}),q=Math.min(m,q),J=Math.max(m,J),rt[mt]=m;const f=l.cartographicToCartesian(b);if(ot[mt]=f,y&&(st[mt]=(u.WebMercatorProjection.geodeticLatitudeToMercatorAngle(g)-D)*G),j){const t=l.geodeticSurfaceNormal(f);ct[mt]=t}n.Matrix4.multiplyByPoint(L,f,S),i.Cartesian3.minimumByComponent(S,K,K),i.Cartesian3.maximumByComponent(S,Q,Q);let I=(t-W)/(F-W);I=r.CesiumMath.clamp(I,0,1);let E=(g-v)/(O-v);E=r.CesiumMath.clamp(E,0,1),at[mt]=new n.Cartesian2(I,E),++mt}const f=3*m;for(let n=0;n<f;++n,++pt)ut[pt]=p[z.getUint16($,!0)],$+=E;if(X!==$-t)throw new c.RuntimeError("Invalid terrain tile.")}ot.length=mt,at.length=mt,rt.length=mt,y&&(st.length=mt),j&&(ct.length=mt);const ft=mt,It=pt,Et={hMin:q,lastBorderPoint:void 0,skirtHeight:I,toENU:L,ellipsoid:l,minimum:K,maximum:Q};ht.sort((function(t,e){return e.cartographic.latitude-t.cartographic.latitude})),dt.sort((function(t,e){return t.cartographic.longitude-e.cartographic.longitude})),lt.sort((function(t,e){return t.cartographic.latitude-e.cartographic.latitude})),gt.sort((function(t,e){return e.cartographic.longitude-t.cartographic.longitude}));const Tt=1e-5;if(A(ot,rt,at,st,ct,ut,Et,ht,-Tt*V,!0,-Tt*Y),A(ot,rt,at,st,ct,ut,Et,dt,-Tt*Y,!1),A(ot,rt,at,st,ct,ut,Et,lt,Tt*V,!0,Tt*Y),A(ot,rt,at,st,ct,ut,Et,gt,Tt*Y,!1),ht.length>0&&gt.length>0){const t=ht[0].index,e=ft,n=gt[gt.length-1].index,i=ot.length-1;ut.push(n,i,e,e,t,n)}tt=ot.length;const Ct=e.BoundingSphere.fromPoints(ot);let Mt;o.defined(g)&&(Mt=s.OrientedBoundingBox.fromRectangle(g,q,J,l));const xt=new a.EllipsoidalOccluder(l).computeHorizonCullingPointPossiblyUnderEllipsoid(d,ot,q),Nt=new t.AxisAlignedBoundingBox(K,Q,d),bt=new a.TerrainEncoding(d,Nt,Et.hMin,J,H,!1,y,j,p,f),St=new Float32Array(tt*bt.stride);let wt=0;for(let t=0;t<tt;++t)wt=bt.encode(St,wt,ot[t],at[t],rt[t],void 0,st[t],ct[t]);const Bt=ht.map((function(t){return t.index})).reverse(),Pt=dt.map((function(t){return t.index})).reverse(),At=lt.map((function(t){return t.index})).reverse(),yt=gt.map((function(t){return t.index})).reverse();return Pt.unshift(At[At.length-1]),Pt.push(Bt[0]),yt.unshift(Bt[Bt.length-1]),yt.push(At[0]),{vertices:St,indices:new Uint16Array(ut),maximumHeight:J,minimumHeight:q,encoding:bt,boundingSphere3D:Ct,orientedBoundingBox:Mt,occludeePointInScaledSpace:xt,vertexCountWithoutSkirts:ft,indexCountWithoutSkirts:It,westIndicesSouthToNorth:Bt,southIndicesEastToWest:Pt,eastIndicesNorthToSouth:At,northIndicesWestToEast:yt}}(h.buffer,h.relativeToCenter,h.ellipsoid,h.rectangle,h.nativeRectangle,h.exaggeration,h.exaggerationRelativeHeight,h.skirtHeight,h.includeWebMercatorT,h.negativeAltitudeExponentBias,h.negativeElevationThreshold),g=l.vertices;d.push(g.buffer);const m=l.indices;return d.push(m.buffer),{vertices:g.buffer,indices:m.buffer,numberOfAttributes:l.encoding.stride,minimumHeight:l.minimumHeight,maximumHeight:l.maximumHeight,boundingSphere3D:l.boundingSphere3D,orientedBoundingBox:l.orientedBoundingBox,occludeePointInScaledSpace:l.occludeePointInScaledSpace,encoding:l.encoding,vertexCountWithoutSkirts:l.vertexCountWithoutSkirts,indexCountWithoutSkirts:l.indexCountWithoutSkirts,westIndicesSouthToNorth:l.westIndicesSouthToNorth,southIndicesEastToWest:l.southIndicesEastToWest,eastIndicesNorthToSouth:l.eastIndicesNorthToSouth,northIndicesWestToEast:l.northIndicesWestToEast}}))}));