/**
 * Golden Bloom animated background — golden-v1.
 * Active on the homepage only. Dark mode only — pair it with
 * `force-dark: true` in the page front matter (see dark-lock.js).
 *
 * Everything on screen is closed-form mathematics, evaluated per-frame in
 * vertex shaders (three draw calls, no per-point CPU work):
 *
 *  - The disc is a phyllotaxis (Vogel) spiral: point n sits at
 *        r = c·√n,  θ = n·φ̂    where φ̂ = 2π(1 − 1/φ) ≈ 137.5077°
 *    is the golden angle. This is the sunflower-seed lattice.
 *  - The spiral "arms" that pulse through the disc are parastichies: ridges
 *    of points whose indices agree modulo a Fibonacci number. The animation
 *    crossfades between consecutive Fibonacci moduli (8 → 13 → 21 → 34),
 *    revealing the different spiral families hidden in the same lattice.
 *  - The disc surface undulates with a travelling radial sine wave, and a
 *    Gaussian pulse ring sweeps outward every few seconds.
 *  - The surrounding stars are a spherical Fibonacci lattice (golden angle
 *    again, mapped onto a sphere) — the most uniform known way to scatter
 *    points on a sphere.
 *  - The ribbon weaving around the disc is a (2,3) torus knot — 2 and 3
 *    being consecutive Fibonacci numbers — with sine-pulse comets flowing
 *    along its parameter.
 *
 * Respects prefers-reduced-motion (renders a single static frame).
 */

(function () {
  if (window.__neuralBg) return;
  window.__neuralBg = 'golden-v1';

  /* Inject Three.js then run — avoids any external CDN dependency */
  function loadAndRun() {
    if (window.THREE) { run(); return; }
    var s = document.createElement('script');
    var tag = document.querySelector('script[src*="golden-v1.js"]');
    if (!tag) { console.error('[golden-v1] Cannot locate golden-v1.js script tag.'); return; }
    s.src = tag.src.replace('golden-v1.js', 'three.min.js');
    s.onload = run;
    s.onerror = function () { console.error('[golden-v1] Three.js failed to load.'); };
    document.head.appendChild(s);
  }

  function run() {
    if (!window.WebGLRenderingContext) return;
    var THREE = window.THREE;

    var REDUCED = !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* ── Mathematical constants ─────────────────────────────────────────── */
    var PHI          = (1 + Math.sqrt(5)) / 2;          // golden ratio
    var GOLDEN_ANGLE = 2 * Math.PI * (1 - 1 / PHI);     // ≈ 2.39996 rad
    var FIB          = [8, 13, 21, 34];                 // parastichy moduli

    /* ── Config ─────────────────────────────────────────────────────────── */
    var CFG = {
      discPoints:  3200,   // points in the phyllotaxis disc
      discRadius:  14,     // world-space radius of the disc
      starPoints:  900,    // spherical Fibonacci backdrop stars
      starShell:   [30, 55],  // [inner, outer] radius of the star shell
      knotPoints:  420,    // particles along the (2,3) torus knot
      knotRadius:  19,     // major radius of the knot
      knotTube:    4.6,    // minor (tube) radius of the knot

      discSpin:    0.02,   // disc rotation, rad/s
      starSpin:   -0.006,  // star shell counter-rotation, rad/s
      knotPrecess: 0.05,   // slow precession of the knot, rad/s
      flowSpeed:   0.035,  // comet flow along the knot, cycles/s

      waveFreq:    1.4,    // radial ripple spatial frequency
      waveSpeed:   1.0,    // radial ripple phase speed
      waveAmp:     0.55,   // radial ripple height (world units)
      ringPeriod:  8.0,    // seconds between pulse rings
      ringWidth:   1.1,    // Gaussian width of the pulse ring
      armPeriod:   9.0,    // seconds each Fibonacci arm family holds
      armSpeed:    0.35,   // arm rotation phase speed

      // Camera
      fov:              55,
      introRadiusStart: 42,
      orbitRadius:      27,
      introDuration:    4.0,
      lookTarget:       [0, -4.0, 0],  // disc sits above the hero text
      staticTime:       22             // frozen moment for reduced motion
    };

    /* ── Palette (dark only) ────────────────────────────────────────────── */
    /* Warm light at the heart of the bloom, cooling into the site's cyan
       at the rim — gold and light-blue duotone on deep blue-black. */
    var PAL = {
      css: 'radial-gradient(130% 90% at 50% 120%, rgba(31, 46, 82, 0.5), rgba(31, 46, 82, 0) 60%),' +
           'radial-gradient(140% 120% at 50% -10%, #0a1020 0%, #06080f 70%)',
      core:  '#ffd9a0',   // centre of the disc — warm gold
      warm:  '#ee9540',   // inner band — saturated amber
      cool:  '#37c0d8',   // outer band — teal
      rim:   '#2b5a96',   // rim — deep blue, melts into the background
      arm:   '#eafcff',   // parastichy arm highlight — pale ice
      ring:  '#ffe9c9',   // pulse ring tint — warm white
      sprite: '#fff6e8',  // hot centre of every disc sprite
      star:  '#9db8e8',   // backdrop stars — pale blue
      starWarm: '#e8d6ae',// a few warm stars for variety
      knot:  '#7debff',   // torus knot ribbon — cyan
      knotCore: '#f2fbff'
    };

    /* ── Helpers ────────────────────────────────────────────────────────── */
    function isHomePage() {
      return document.querySelector('.home-hero') !== null;
    }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function randBetween(a, b) { return a + Math.random() * (b - a); }
    function smoothstep(a, b, x) {
      var t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    }

    /* ── DOM container + renderer ───────────────────────────────────────── */
    /* Reuses the generic #neural-hero container + body.neural-active CSS
       (neural-hero.css) — the styles are animation-agnostic. */
    var heroDiv = document.createElement('div');
    heroDiv.id = 'neural-hero';
    heroDiv.style.opacity = '0';
    heroDiv.style.transition = 'opacity 1.6s ease';
    heroDiv.style.background = PAL.css;
    document.body.appendChild(heroDiv);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.error('[golden-v1] WebGL unavailable.', e);
      return;
    }
    var PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(PIXEL_RATIO);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NoToneMapping;
    heroDiv.appendChild(renderer.domElement);

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      CFG.fov, window.innerWidth / window.innerHeight, 0.1, 140
    );

    /* ── Shared GLSL ────────────────────────────────────────────────────── */
    var GLSL_CONSTS = [
      'const float GOLDEN_ANGLE = ' + GOLDEN_ANGLE.toFixed(10) + ';',
      'const float TWO_PI = 6.2831853072;'
    ].join('\n');

    /* Soft glowing sprite: bright Gaussian core + wide halo. Shared by all
       three layers; colour and alpha arrive as varyings. */
    var SPRITE_FRAG = [
      'uniform vec3 uSpriteCore;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'void main() {',
      '  vec2 uv = gl_PointCoord - 0.5;',
      '  float r2 = dot(uv, uv) * 4.0;',
      '  if (r2 > 1.0) discard;',
      '  float core = exp(-r2 * 8.0);',
      '  float halo = exp(-r2 * 2.4) * 0.4;',
      '  vec3 col = mix(vColor, uSpriteCore, core * 0.45);',
      '  float alpha = clamp((core + halo) * vAlpha, 0.0, 1.0);',
      '  gl_FragColor = vec4(col, alpha);',
      '  #include <colorspace_fragment>',
      '}'
    ].join('\n');

    function makeMaterial(uniforms, vertexShader, spriteCore) {
      uniforms.uSpriteCore = { value: new THREE.Color(spriteCore) };
      return new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: SPRITE_FRAG
      });
    }

    /* Per-frame uniforms shared across layers */
    var uTime = { value: 0 };
    var uPixelRatio = { value: PIXEL_RATIO };

    /* ── Layer 1: the phyllotaxis disc ──────────────────────────────────── */
    /* Only an index and a seed go to the GPU — position, motion, colour and
       the Fibonacci arm structure are all derived in the vertex shader. */
    var N = CFG.discPoints;
    var discScale = CFG.discRadius / Math.sqrt(N);   // c in r = c·√n

    var discIndex = new Float32Array(N);
    var discSeed  = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      discIndex[i] = i;
      discSeed[i]  = Math.random();
    }

    var discGeo = new THREE.BufferGeometry();
    // Dummy position attribute — the shader derives the real one from aIndex
    discGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    discGeo.setAttribute('aIndex', new THREE.BufferAttribute(discIndex, 1));
    discGeo.setAttribute('aSeed',  new THREE.BufferAttribute(discSeed, 1));
    discGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), CFG.discRadius + 4);

    var discUniforms = {
      uTime:       uTime,
      uPixelRatio: uPixelRatio,
      uSpin:       { value: 0 },                       // disc rotation angle
      uDiscScale:  { value: discScale },
      uDiscRadius: { value: CFG.discRadius },
      uWaveFreq:   { value: CFG.waveFreq },
      uWaveAmp:    { value: REDUCED ? 0 : CFG.waveAmp },
      uWavePhase:  { value: 0 },
      uRingR:      { value: -10 },                     // pulse ring radius
      uRingW:      { value: CFG.ringWidth },
      uArmA:       { value: FIB[0] },                  // current Fibonacci modulus
      uArmB:       { value: FIB[1] },                  // next Fibonacci modulus
      uArmMix:     { value: 0 },                       // crossfade between them
      uArmPhase:   { value: 0 },                       // arm rotation phase
      uCore: { value: new THREE.Color(PAL.core) },
      uWarm: { value: new THREE.Color(PAL.warm) },
      uCool: { value: new THREE.Color(PAL.cool) },
      uRim:  { value: new THREE.Color(PAL.rim) },
      uArmCol:  { value: new THREE.Color(PAL.arm) },
      uRingCol: { value: new THREE.Color(PAL.ring) }
    };

    var discVert = [
      'uniform float uTime;',
      'uniform float uPixelRatio;',
      'uniform float uSpin;',
      'uniform float uDiscScale;',
      'uniform float uDiscRadius;',
      'uniform float uWaveFreq;',
      'uniform float uWaveAmp;',
      'uniform float uWavePhase;',
      'uniform float uRingR;',
      'uniform float uRingW;',
      'uniform float uArmA;',
      'uniform float uArmB;',
      'uniform float uArmMix;',
      'uniform float uArmPhase;',
      'uniform vec3 uCore;',
      'uniform vec3 uWarm;',
      'uniform vec3 uCool;',
      'uniform vec3 uRim;',
      'uniform vec3 uArmCol;',
      'uniform vec3 uRingCol;',
      'attribute float aIndex;',
      'attribute float aSeed;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      GLSL_CONSTS,
      'void main() {',
      '  float n = aIndex;',
      // Vogel spiral: uniform-density sunflower lattice
      '  float r  = uDiscScale * sqrt(n + 0.5);',
      '  float rn = r / uDiscRadius;',
      '  float theta = n * GOLDEN_ANGLE + uSpin;',
      '  vec3 p = vec3(r * cos(theta), 0.0, r * sin(theta));',
      // Travelling radial ripple, pinned at the centre and the rim
      '  float env = rn * (1.0 - rn) * 4.0;',
      '  p.y += sin(r * uWaveFreq - uWavePhase) * uWaveAmp * env;',
      // Expanding Gaussian pulse ring lifts and lights points as it passes
      '  float dr = (r - uRingR) / uRingW;',
      '  float ring = exp(-dr * dr);',
      '  p.y += ring * 0.7 * env;',
      // Parastichy arms: ridges of indices that agree mod a Fibonacci number.
      // Crossfading uArmA → uArmB morphs one spiral family into the next.
      '  float armA = pow(0.5 + 0.5 * cos(TWO_PI * n / uArmA - uArmPhase), 3.0);',
      '  float armB = pow(0.5 + 0.5 * cos(TWO_PI * n / uArmB + uArmPhase * 0.8), 3.0);',
      '  float arm = mix(armA, armB, uArmMix);',
      // Colour: warm gold heart → amber → teal → deep blue rim
      '  vec3 col = mix(uCore, uWarm, smoothstep(0.0, 0.28, rn));',
      '  col = mix(col, uCool, smoothstep(0.30, 0.75, rn));',
      '  col = mix(col, uRim,  smoothstep(0.70, 1.05, rn));',
      '  col = mix(col, uArmCol, arm * 0.35);',
      '  col += uRingCol * ring * 0.5;',
      '  vColor = col;',
      '  float twinkle = 0.78 + 0.22 * sin(uTime * (0.5 + fract(aSeed * 9.17) * 1.4) + aSeed * 41.0);',
      '  float heart = 1.0 - smoothstep(0.0, 0.4, rn);',    // warm luminous core
      '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
      '  float dist = max(0.1, -mv.z);',
      '  float fog = smoothstep(32.0, 78.0, dist);',
      '  float rimFade = 1.0 - smoothstep(0.82, 1.0, rn);',
      '  float base = 0.18 + 0.30 * heart;',
      '  vAlpha = (base + arm * 0.28 + ring * 0.40) * twinkle * rimFade * (1.0 - fog);',
      '  float size = (1.1 + aSeed * 0.9) * (1.0 + arm * 0.8 + ring * 1.1 + heart * 0.7);',
      '  gl_PointSize = min(size * uPixelRatio * (130.0 / dist), 64.0 * uPixelRatio);',
      '  gl_Position = projectionMatrix * mv;',
      '}'
    ].join('\n');

    scene.add(new THREE.Points(discGeo, makeMaterial(discUniforms, discVert, PAL.sprite)));

    /* ── Layer 2: spherical Fibonacci star shell ────────────────────────── */
    /* Star i sits on the spherical Fibonacci lattice:
         y = 1 − 2(i+½)/M,  θ = i·φ̂ — the golden angle scattered on a sphere,
       pushed to a random shell radius for depth. */
    var M = CFG.starPoints;
    var starPos  = new Float32Array(M * 3);
    var starSeed = new Float32Array(M);
    for (var s = 0; s < M; s++) {
      var y = 1 - 2 * (s + 0.5) / M;
      var rr = Math.sqrt(Math.max(0, 1 - y * y));
      var th = s * GOLDEN_ANGLE;
      var shell = randBetween(CFG.starShell[0], CFG.starShell[1]);
      starPos[s * 3]     = rr * Math.cos(th) * shell;
      starPos[s * 3 + 1] = y * shell;
      starPos[s * 3 + 2] = rr * Math.sin(th) * shell;
      starSeed[s] = Math.random();
    }

    var starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('aSeed',    new THREE.BufferAttribute(starSeed, 1));

    var starUniforms = {
      uTime:       uTime,
      uPixelRatio: uPixelRatio,
      uStarSpin:   { value: 0 },
      uStarCol:    { value: new THREE.Color(PAL.star) },
      uStarWarm:   { value: new THREE.Color(PAL.starWarm) }
    };

    var starVert = [
      'uniform float uTime;',
      'uniform float uPixelRatio;',
      'uniform float uStarSpin;',
      'uniform vec3 uStarCol;',
      'uniform vec3 uStarWarm;',
      'attribute float aSeed;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'void main() {',
      '  float c = cos(uStarSpin), s = sin(uStarSpin);',
      '  vec3 p = vec3(position.x * c - position.z * s, position.y,',
      '                position.x * s + position.z * c);',
      '  vColor = mix(uStarCol, uStarWarm, step(0.86, aSeed));',
      '  float twinkle = 0.55 + 0.45 * sin(uTime * (0.3 + fract(aSeed * 7.31)) + aSeed * 53.0);',
      '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
      '  float dist = max(0.1, -mv.z);',
      '  vAlpha = 0.4 * twinkle;',
      '  gl_PointSize = min((0.8 + aSeed) * uPixelRatio * (130.0 / dist), 24.0 * uPixelRatio);',
      '  gl_Position = projectionMatrix * mv;',
      '}'
    ].join('\n');

    scene.add(new THREE.Points(starGeo, makeMaterial(starUniforms, starVert, PAL.star)));

    /* ── Layer 3: (2,3) torus knot with flowing comets ──────────────────── */
    /* Particle at parameter u: the classic torus-knot curve
         x = (R + ρ·cos qu)·cos pu,  y = ρ·sin qu,  z = (R + ρ·cos qu)·sin pu
       with (p,q) = (2,3). Comets are sine pulses moving along u. */
    var K = CFG.knotPoints;
    var knotPhase = new Float32Array(K);
    var knotSeed  = new Float32Array(K);
    for (var k = 0; k < K; k++) {
      knotPhase[k] = k / K;
      knotSeed[k]  = Math.random();
    }

    var knotGeo = new THREE.BufferGeometry();
    knotGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(K * 3), 3));
    knotGeo.setAttribute('aPhase', new THREE.BufferAttribute(knotPhase, 1));
    knotGeo.setAttribute('aSeed',  new THREE.BufferAttribute(knotSeed, 1));
    knotGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), CFG.knotRadius + CFG.knotTube + 2);

    var knotUniforms = {
      uTime:       uTime,
      uPixelRatio: uPixelRatio,
      uFlow:       { value: 0 },
      uKnotR:      { value: CFG.knotRadius },
      uKnotTube:   { value: CFG.knotTube },
      uKnotCol:    { value: new THREE.Color(PAL.knot) }
    };

    var knotVert = [
      'uniform float uTime;',
      'uniform float uPixelRatio;',
      'uniform float uFlow;',
      'uniform float uKnotR;',
      'uniform float uKnotTube;',
      'uniform vec3 uKnotCol;',
      'attribute float aPhase;',
      'attribute float aSeed;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      GLSL_CONSTS,
      'void main() {',
      '  float u = aPhase * TWO_PI;',
      '  float rad = uKnotR + uKnotTube * cos(3.0 * u);',
      '  vec3 p = vec3(rad * cos(2.0 * u), uKnotTube * sin(3.0 * u), rad * sin(2.0 * u));',
      // Three comets: sharp sine pulses travelling along the knot parameter
      '  float comet = pow(0.5 + 0.5 * sin((aPhase - uFlow) * TWO_PI * 3.0), 6.0);',
      '  vColor = uKnotCol;',
      '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
      '  float dist = max(0.1, -mv.z);',
      '  float fog = smoothstep(30.0, 80.0, dist);',
      '  vAlpha = (0.035 + comet * 0.65) * (1.0 - fog);',
      '  gl_PointSize = min((1.0 + aSeed * 0.8 + comet * 2.4) * uPixelRatio * (130.0 / dist), 48.0 * uPixelRatio);',
      '  gl_Position = projectionMatrix * mv;',
      '}'
    ].join('\n');

    var knotObj = new THREE.Points(knotGeo, makeMaterial(knotUniforms, knotVert, PAL.knotCore));
    knotObj.rotation.x = 0.45;       // tilt so the ribbon weaves over and under the disc
    knotObj.rotation.z = 0.12;
    scene.add(knotObj);

    /* ── Per-frame state ────────────────────────────────────────────────── */
    var simTime = REDUCED ? CFG.staticTime : 0;
    var introProgress = REDUCED ? 1 : 0;
    var camTheta0 = Math.random() * Math.PI * 2;

    function updateUniforms(t) {
      uTime.value = t;
      discUniforms.uSpin.value = t * CFG.discSpin;
      discUniforms.uWavePhase.value = t * CFG.waveSpeed;

      // Pulse ring: sweeps from the centre past the rim, then a short rest
      // while it travels invisibly beyond the disc
      var ringT = (t % CFG.ringPeriod) / CFG.ringPeriod;
      discUniforms.uRingR.value = ringT * CFG.discRadius * 1.3;

      // Fibonacci arm families: hold each modulus, then crossfade to the next
      var ap = t / CFG.armPeriod;
      var ai = Math.floor(ap);
      var af = ap - ai;
      discUniforms.uArmA.value = FIB[ai % FIB.length];
      discUniforms.uArmB.value = FIB[(ai + 1) % FIB.length];
      discUniforms.uArmMix.value = smoothstep(0.7, 0.98, af);
      discUniforms.uArmPhase.value = t * CFG.armSpeed;

      starUniforms.uStarSpin.value = t * CFG.starSpin;
      knotUniforms.uFlow.value = t * CFG.flowSpeed;
      knotObj.rotation.y = t * CFG.knotPrecess;
    }

    function placeCamera(t) {
      var radius;
      if (introProgress < 1) {
        var it = introProgress;
        var ease = it * it * it * (it * (it * 6 - 15) + 10);   // smootherstep
        radius = lerp(CFG.introRadiusStart, CFG.orbitRadius, ease);
      } else {
        radius = CFG.orbitRadius;
      }
      var theta = camTheta0 + t * 0.03;
      var phi = 0.46 + (REDUCED ? 0 : 0.10 * Math.sin(t * 0.045));
      var cosP = Math.cos(phi);
      camera.position.x = radius * cosP * Math.cos(theta);
      camera.position.z = radius * cosP * Math.sin(theta);
      camera.position.y = radius * Math.sin(phi);
      camera.lookAt(CFG.lookTarget[0], CFG.lookTarget[1], CFG.lookTarget[2]);
    }

    function renderFrame() {
      updateUniforms(simTime);
      placeCamera(simTime);
      renderer.render(scene, camera);
    }

    /* ── Animation loop (reduced motion renders single static frames) ───── */
    var animId = null;
    var last = null;

    function tick(now) {
      animId = requestAnimationFrame(tick);
      var dt = last === null ? 0.016 : Math.min((now - last) / 1000, 0.05);
      last = now;
      simTime += dt;
      if (introProgress < 1) {
        introProgress = Math.min(1, introProgress + dt / CFG.introDuration);
      }
      renderFrame();
    }

    window.addEventListener('resize', function () {
      var w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (REDUCED) renderFrame();
    });

    /* ── Show / hide ────────────────────────────────────────────────────── */
    /* Dark mode is enforced separately by dark-lock.js via the page's
       `force-dark: true` front matter — this script only draws. */
    function activate() {
      heroDiv.style.display = 'block';
      document.body.classList.add('neural-active');
      if (REDUCED) {
        renderFrame();
      } else if (animId === null) {
        last = null;
        animId = requestAnimationFrame(tick);
      }
      // Next frame so the opacity transition runs
      requestAnimationFrame(function () { heroDiv.style.opacity = '1'; });
    }

    function deactivate() {
      heroDiv.style.display = 'none';
      heroDiv.style.opacity = '0';
      document.body.classList.remove('neural-active');
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    function updateVisibility() {
      if (isHomePage()) { activate(); } else { deactivate(); }
    }

    /* ── Navigation hooks (instant navigation keeps scripts alive) ─────── */
    window.addEventListener('popstate', updateVisibility);

    var _push = history.pushState.bind(history);
    history.pushState = function () {
      _push.apply(history, arguments);
      updateVisibility();
    };

    updateVisibility();
  }

  loadAndRun();
})();
