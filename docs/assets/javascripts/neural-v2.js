/**
 * Neural network animated background — v2.
 * Active on the homepage only. Adapts to light and dark mode.
 *
 * What's new over v1:
 *  - Nodes are GPU point sprites (soft glowing cores + halos) — one draw call
 *    for the whole network instead of 400 sphere meshes.
 *  - Organic clustered topology: ellipsoidal clusters bridged by long-range
 *    links, rather than a uniform random blob.
 *  - Real signal propagation: pulses carry charge, ignite chain reactions,
 *    and periodic cluster bursts send visible waves through the network.
 *  - Edges heat up and glow while a signal travels along them, then cool.
 *  - Depth fog, subtle per-node drift, twinkle.
 *  - Respects prefers-reduced-motion.
 */

(function () {
  if (window.__neuralBg) return;
  window.__neuralBg = 'v2';

  /* Inject Three.js then run — avoids any external CDN dependency */
  function loadAndRun() {
    if (window.THREE) { run(); return; }
    var s = document.createElement('script');
    var tag = document.querySelector('script[src*="neural-v2.js"]');
    if (!tag) { console.error('[neural-v2] Cannot locate neural-v2.js script tag.'); return; }
    s.src = tag.src.replace('neural-v2.js', 'three.min.js');
    s.onload = run;
    s.onerror = function () { console.error('[neural-v2] Three.js failed to load.'); };
    document.head.appendChild(s);
  }

  function run() {
    if (!window.WebGLRenderingContext) return;
    var THREE = window.THREE;

    var REDUCED = !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* ── Config ─────────────────────────────────────────────────────────── */
    var CFG = {
      clusterCount:   6,     // number of node clusters
      clusterRadius:  9,     // radius of the volume cluster centres are placed in
      clusterMinSep:  6.5,   // minimum distance between cluster centres
      clusterNodes:   100,   // nodes per cluster
      clusterSigma:   2.7,   // gaussian spread of nodes around their centre
      scatterNodes:   80,    // loose nodes sprinkled between clusters
      scatterRadius:  15,    // radius of the scatter volume
      knnCluster:     3,     // nearest-neighbour links per cluster node
      knnScatter:     2,     // nearest-neighbour links per scatter node
      bridgesPerCluster: 2,  // long-range links from each cluster to another

      driftAmp:       0.12,  // amplitude of idle node drift (world units)

      // Camera
      fov:            58,
      introRadiusStart: 46,  // camera distance at the very start
      orbitRadius:    26,    // resting orbit distance
      introDuration:  4.5,   // seconds for the opening dolly-in
      lookTarget:     [0, -1.6, 0], // look slightly below centre → network sits above the hero text
    };

    /* ── Simulation tuning ──────────────────────────────────────────────── */
    var SIM = {
      decay:        0.30,  // fraction of node energy remaining after 1s
      refractory:   1.3,   // seconds a node ignores input after firing
      arriveEnergy: 0.55,  // charge delivered by an arriving pulse
      igniteChance: 0.30,  // chance an arriving pulse ignites outright
      fireThreshold: 0.95, // accumulated charge that forces a firing
      emitChance:   0.5,   // chance each connection gets a pulse on firing
      emitCap:      3,     // max pulses emitted per firing
      pulseSpeed:   1.6,   // world units per second a pulse travels
      spontaneousEvery: 1.1,  // seconds between random single firings
      burstEvery:   [9, 14],  // [min,max] seconds between cluster bursts
      burstSize:    4,        // nodes fired per burst
      heatDecay:    0.7,      // edge heat lost per second
      maxPulses:    240,      // pulse pool size
      trail:        4,        // sprites per pulse (1 head + 3 trail ghosts)
    };

    /* ── Colour palettes ────────────────────────────────────────────────── */
    var PALETTES = {
      slate: {                       // dark mode
        css: 'radial-gradient(120% 85% at 50% 115%, rgba(23, 36, 71, 0.55), rgba(23, 36, 71, 0) 60%),' +
             'radial-gradient(140% 120% at 50% -10%, #0c1322 0%, #070a12 70%)',
        idle:  '#46639f',            // resting node colour
        fire:  '#67e8f9',            // fully-fired node colour
        core:  '#eaf8ff',            // hot centre of a fired node
        edge:  '#3d63b0',            // resting edge colour
        edgeGlow: '#7debff',         // edge colour while a signal passes
        pulse: '#9bedff',            // travelling pulse colour
        pulseCore: '#f2fbff',
        edgeOpacity: 0.22,
        halo:  1.0,                  // halo strength around nodes
        glow:  1.5,                  // brightness boost on fired nodes
        additive: true,              // additive blending (light-emitting look)
      },
      default: {                     // light mode
        css: 'radial-gradient(120% 85% at 50% 115%, rgba(186, 211, 240, 0.5), rgba(186, 211, 240, 0) 60%),' +
             'radial-gradient(140% 120% at 50% -10%, #fbfdff 0%, #eef3f9 70%)',
        idle:  '#7c93bd',
        fire:  '#0891b2',
        core:  '#065666',
        edge:  '#93a8cc',
        edgeGlow: '#0e7490',
        pulse: '#0e7490',
        pulseCore: '#083a47',
        edgeOpacity: 0.16,
        halo:  0.5,
        glow:  0.6,
        additive: false,             // additive washes out on light backgrounds
      }
    };

    /* ── Helpers ────────────────────────────────────────────────────────── */
    function scheme() {
      return document.body.getAttribute('data-md-color-scheme') === 'slate'
        ? 'slate' : 'default';
    }

    function isHomePage() {
      return document.querySelector('.home-hero') !== null;
    }

    function lerp(a, b, t) { return a + (b - a) * t; }
    function randBetween(a, b) { return a + Math.random() * (b - a); }

    /* Standard normal via Box–Muller */
    function gauss() {
      var u = 1 - Math.random(), v = Math.random();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function randInSphere(radius) {
      var p;
      do {
        p = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
      } while (p.lengthSq() > 1);
      return p.multiplyScalar(radius);
    }

    /* Idle drift — MUST stay in sync with the GLSL drift() in the shaders,
       since pulse positions are computed on the CPU. */
    function driftInto(out, seed, t, amp) {
      out.x = Math.sin(t * 0.37 + seed * 11.0) * amp;
      out.y = Math.sin(t * 0.29 + seed * 17.0) * amp;
      out.z = Math.sin(t * 0.43 + seed * 23.0) * amp;
      return out;
    }

    var GLSL_DRIFT = [
      'vec3 drift(float seed, float t) {',
      '  return vec3(',
      '    sin(t * 0.37 + seed * 11.0),',
      '    sin(t * 0.29 + seed * 17.0),',
      '    sin(t * 0.43 + seed * 23.0)',
      '  );',
      '}'
    ].join('\n');

    /* ── DOM container + renderer ───────────────────────────────────────── */
    var heroDiv = document.createElement('div');
    heroDiv.id = 'neural-hero';
    heroDiv.style.opacity = '0';
    heroDiv.style.transition = 'opacity 1.6s ease';
    document.body.appendChild(heroDiv);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,                 // transparent canvas — CSS gradient shows through
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.error('[neural-v2] WebGL unavailable.', e);
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
      CFG.fov, window.innerWidth / window.innerHeight, 0.1,
      CFG.introRadiusStart + CFG.scatterRadius * 2 + 20
    );
    camera.position.set(0, 0, CFG.introRadiusStart);

    window.addEventListener('resize', function () {
      var w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    /* ── Build graph ────────────────────────────────────────────────────── */
    /* nodes[i] = { pos, seed, cluster, connections:[{node, edge}],
                    energy, refractory } */
    var nodes = [];
    var clusters = [];   // arrays of node indices, for bursts

    (function buildNodes() {
      var centres = [];
      for (var c = 0; c < CFG.clusterCount; c++) {
        var centre, tries = 0;
        do {
          centre = randInSphere(CFG.clusterRadius);
          tries++;
        } while (tries < 80 && centres.some(function (o) {
          return o.distanceTo(centre) < CFG.clusterMinSep;
        }));
        centres.push(centre);

        // Random ellipsoid axes give each cluster its own shape
        var sx = randBetween(0.6, 1.4),
            sy = randBetween(0.6, 1.4),
            sz = randBetween(0.6, 1.4);

        var members = [];
        for (var n = 0; n < CFG.clusterNodes; n++) {
          var pos = new THREE.Vector3(
            centre.x + gauss() * CFG.clusterSigma * sx,
            centre.y + gauss() * CFG.clusterSigma * sy,
            centre.z + gauss() * CFG.clusterSigma * sz
          );
          members.push(nodes.length);
          nodes.push({
            pos: pos, seed: Math.random(), cluster: c,
            connections: [], energy: 0, refractory: 0
          });
        }
        clusters.push(members);
      }

      for (var s = 0; s < CFG.scatterNodes; s++) {
        nodes.push({
          pos: randInSphere(CFG.scatterRadius), seed: Math.random(), cluster: -1,
          connections: [], energy: 0, refractory: 0
        });
      }
    })();

    /* Edge list — deduplicated via "lo_hi" keys.
       edges[e] = { a, b }; per-edge heat lives in edgeHeat[e]. */
    var edges = [];
    var edgeKeys = {};

    function addEdge(a, b) {
      if (a === b) return;
      var key = a < b ? a + '_' + b : b + '_' + a;
      if (edgeKeys[key]) return;
      edgeKeys[key] = true;
      var e = edges.length;
      edges.push({ a: a, b: b });
      nodes[a].connections.push({ node: b, edge: e });
      nodes[b].connections.push({ node: a, edge: e });
    }

    (function buildEdges() {
      var count = nodes.length;

      // k-nearest neighbours per node (O(n²) once at startup — fine at this size)
      for (var i = 0; i < count; i++) {
        var k = nodes[i].cluster === -1 ? CFG.knnScatter : CFG.knnCluster;
        var bestIdx = [], bestD = [];
        for (var j = 0; j < count; j++) {
          if (j === i) continue;
          var d = nodes[i].pos.distanceToSquared(nodes[j].pos);
          // insertion into the k-smallest list
          var slot = bestD.length;
          while (slot > 0 && bestD[slot - 1] > d) slot--;
          if (slot < k) {
            bestD.splice(slot, 0, d);
            bestIdx.splice(slot, 0, j);
            if (bestD.length > k) { bestD.pop(); bestIdx.pop(); }
          }
        }
        for (var m = 0; m < bestIdx.length; m++) addEdge(i, bestIdx[m]);
      }

      // Long-range bridges between clusters — these light up beautifully
      for (var c = 0; c < clusters.length; c++) {
        for (var b = 0; b < CFG.bridgesPerCluster; b++) {
          var from = clusters[c][Math.floor(Math.random() * clusters[c].length)];
          var other = (c + 1 + Math.floor(Math.random() * (clusters.length - 1))) % clusters.length;
          var best = -1, bd = Infinity;
          for (var t = 0; t < clusters[other].length; t++) {
            var cand = clusters[other][t];
            var dd = nodes[from].pos.distanceToSquared(nodes[cand].pos);
            if (dd < bd) { bd = dd; best = cand; }
          }
          if (best >= 0) addEdge(from, best);
        }
      }
    })();

    /* ── GPU buffers + shaders ──────────────────────────────────────────── */
    var NODE_COUNT = nodes.length;
    var EDGE_COUNT = edges.length;

    var fogUniforms = {
      uFogNear: { value: 18 },
      uFogFar:  { value: 60 }
    };
    var timeUniform = { value: 0 };
    var driftUniform = { value: REDUCED ? 0 : CFG.driftAmp };

    /* Nodes — a single Points cloud. Each sprite draws its own bright core
       and a wide soft halo, which reads as bloom without postprocessing. */
    var nodePos    = new Float32Array(NODE_COUNT * 3);
    var nodeSeed   = new Float32Array(NODE_COUNT);
    var nodeSize   = new Float32Array(NODE_COUNT);
    var nodeEnergy = new Float32Array(NODE_COUNT);

    for (var ni = 0; ni < NODE_COUNT; ni++) {
      nodes[ni].pos.toArray(nodePos, ni * 3);
      nodeSeed[ni] = nodes[ni].seed;
      // Hubs (more connections) render slightly larger
      var degree = Math.min(nodes[ni].connections.length, 8);
      nodeSize[ni] = 1.9 + degree * 0.22 + Math.random() * 0.8;
    }

    var nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute('aSeed',    new THREE.BufferAttribute(nodeSeed, 1));
    nodeGeo.setAttribute('aSize',    new THREE.BufferAttribute(nodeSize, 1));
    nodeGeo.setAttribute('aEnergy',  new THREE.BufferAttribute(nodeEnergy, 1));

    var nodeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime:       timeUniform,
        uDriftAmp:   driftUniform,
        uPixelRatio: { value: PIXEL_RATIO },
        uFogNear:    fogUniforms.uFogNear,
        uFogFar:     fogUniforms.uFogFar,
        uIdleColor:  { value: new THREE.Color() },
        uFireColor:  { value: new THREE.Color() },
        uCoreColor:  { value: new THREE.Color() },
        uHalo:       { value: 1.0 },
        uGlow:       { value: 1.5 }
      },
      vertexShader: [
        'uniform float uTime;',
        'uniform float uDriftAmp;',
        'uniform float uPixelRatio;',
        'uniform float uFogNear;',
        'uniform float uFogFar;',
        'attribute float aSeed;',
        'attribute float aSize;',
        'attribute float aEnergy;',
        'varying float vEnergy;',
        'varying float vFog;',
        GLSL_DRIFT,
        'void main() {',
        '  vec3 p = position + drift(aSeed, uTime) * uDriftAmp;',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  float dist = max(0.1, -mv.z);',
        '  vFog = smoothstep(uFogNear, uFogFar, dist);',
        '  vEnergy = aEnergy;',
        '  float twinkle = 0.82 + 0.18 * sin(uTime * (0.6 + fract(aSeed * 7.31) * 1.3) + aSeed * 39.0);',
        '  float size = aSize * (1.0 + aEnergy * 1.9) * twinkle;',
        '  gl_PointSize = min(size * uPixelRatio * (120.0 / dist), 160.0 * uPixelRatio);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uIdleColor;',
        'uniform vec3 uFireColor;',
        'uniform vec3 uCoreColor;',
        'uniform float uHalo;',
        'uniform float uGlow;',
        'varying float vEnergy;',
        'varying float vFog;',
        'void main() {',
        '  vec2 uv = gl_PointCoord - 0.5;',
        '  float r2 = dot(uv, uv) * 4.0;',     // 0 at centre → 1 at sprite edge
        '  if (r2 > 1.0) discard;',
        '  float core = exp(-r2 * 9.0);',
        '  float halo = exp(-r2 * 2.6) * 0.45 * uHalo;',
        '  vec3 base = mix(uIdleColor, uFireColor, vEnergy);',
        '  vec3 col  = mix(base, uCoreColor, core * (0.25 + vEnergy * 0.75));',
        '  float boost = 1.0 + vEnergy * uGlow;',
        '  float alpha = clamp((core + halo) * boost * (1.0 - vFog), 0.0, 1.0);',
        '  gl_FragColor = vec4(col * boost, alpha);',
        '  #include <colorspace_fragment>',
        '}'
      ].join('\n')
    });

    scene.add(new THREE.Points(nodeGeo, nodeMat));

    /* Edges — LineSegments. Each vertex carries its endpoint's seed (so the
       line drifts with its nodes), its endpoint's energy (the line glows at
       the energised end) and the edge's heat (whole line glows while a
       signal travels it). */
    var edgePos    = new Float32Array(EDGE_COUNT * 6);
    var edgeSeed   = new Float32Array(EDGE_COUNT * 2);
    var edgeEnergy = new Float32Array(EDGE_COUNT * 2);
    var edgeHeatAttr = new Float32Array(EDGE_COUNT * 2);
    var edgeHeat   = new Float32Array(EDGE_COUNT);    // per-edge, CPU side

    for (var ei = 0; ei < EDGE_COUNT; ei++) {
      nodes[edges[ei].a].pos.toArray(edgePos, ei * 6);
      nodes[edges[ei].b].pos.toArray(edgePos, ei * 6 + 3);
      edgeSeed[ei * 2]     = nodes[edges[ei].a].seed;
      edgeSeed[ei * 2 + 1] = nodes[edges[ei].b].seed;
    }

    var edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
    edgeGeo.setAttribute('aSeed',    new THREE.BufferAttribute(edgeSeed, 1));
    edgeGeo.setAttribute('aEnergy',  new THREE.BufferAttribute(edgeEnergy, 1));
    edgeGeo.setAttribute('aHeat',    new THREE.BufferAttribute(edgeHeatAttr, 1));

    var edgeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime:       timeUniform,
        uDriftAmp:   driftUniform,
        uFogNear:    fogUniforms.uFogNear,
        uFogFar:     fogUniforms.uFogFar,
        uEdgeColor:  { value: new THREE.Color() },
        uGlowColor:  { value: new THREE.Color() },
        uEdgeOpacity: { value: 0.12 }
      },
      vertexShader: [
        'uniform float uTime;',
        'uniform float uDriftAmp;',
        'uniform float uFogNear;',
        'uniform float uFogFar;',
        'attribute float aSeed;',
        'attribute float aEnergy;',
        'attribute float aHeat;',
        'varying float vMix;',
        'varying float vFog;',
        GLSL_DRIFT,
        'void main() {',
        '  vec3 p = position + drift(aSeed, uTime) * uDriftAmp;',
        '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
        '  vFog = smoothstep(uFogNear, uFogFar, max(0.1, -mv.z));',
        '  vMix = max(aEnergy, aHeat);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uEdgeColor;',
        'uniform vec3 uGlowColor;',
        'uniform float uEdgeOpacity;',
        'varying float vMix;',
        'varying float vFog;',
        'void main() {',
        '  vec3 col = mix(uEdgeColor, uGlowColor, vMix);',
        '  float alpha = (uEdgeOpacity + vMix * 0.55) * (1.0 - vFog);',
        '  gl_FragColor = vec4(col, alpha);',
        '  #include <colorspace_fragment>',
        '}'
      ].join('\n')
    });

    scene.add(new THREE.LineSegments(edgeGeo, edgeMat));

    /* Pulses — a pooled Points cloud. Each pulse owns SIM.trail consecutive
       sprite slots: one bright head plus fading trail ghosts behind it. */
    var PULSE_SLOTS = SIM.maxPulses * SIM.trail;
    var pulsePos  = new Float32Array(PULSE_SLOTS * 3);
    var pulseInt  = new Float32Array(PULSE_SLOTS);
    var pulseSize = new Float32Array(PULSE_SLOTS);

    for (var pi = 0; pi < SIM.maxPulses; pi++) {
      for (var ti = 0; ti < SIM.trail; ti++) {
        pulseSize[pi * SIM.trail + ti] = [3.4, 2.6, 2.0, 1.5][ti] || 1.5;
      }
    }

    var pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position',   new THREE.BufferAttribute(pulsePos, 3));
    pulseGeo.setAttribute('aIntensity', new THREE.BufferAttribute(pulseInt, 1));
    pulseGeo.setAttribute('aPSize',     new THREE.BufferAttribute(pulseSize, 1));

    var pulseMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uPixelRatio: { value: PIXEL_RATIO },
        uPulseColor: { value: new THREE.Color() },
        uPulseCore:  { value: new THREE.Color() }
      },
      vertexShader: [
        'uniform float uPixelRatio;',
        'attribute float aIntensity;',
        'attribute float aPSize;',
        'varying float vIntensity;',
        'void main() {',
        '  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
        '  float dist = max(0.1, -mv.z);',
        '  vIntensity = aIntensity;',
        '  gl_PointSize = min(aPSize * uPixelRatio * (120.0 / dist), 64.0 * uPixelRatio);',
        '  gl_Position = projectionMatrix * mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uPulseColor;',
        'uniform vec3 uPulseCore;',
        'varying float vIntensity;',
        'void main() {',
        '  if (vIntensity <= 0.003) discard;',
        '  vec2 uv = gl_PointCoord - 0.5;',
        '  float r2 = dot(uv, uv) * 4.0;',
        '  if (r2 > 1.0) discard;',
        '  float core = exp(-r2 * 8.0);',
        '  float halo = exp(-r2 * 2.2) * 0.5;',
        '  vec3 col = mix(uPulseColor, uPulseCore, core * 0.8);',
        '  gl_FragColor = vec4(col * (1.0 + core * 0.4), (core + halo) * vIntensity);',
        '  #include <colorspace_fragment>',
        '}'
      ].join('\n')
    });

    scene.add(new THREE.Points(pulseGeo, pulseMat));

    /* ── Palette application ────────────────────────────────────────────── */
    function applyPalette() {
      var pal = PALETTES[scheme()];
      var blending = pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending;

      heroDiv.style.background = pal.css;

      nodeMat.uniforms.uIdleColor.value.set(pal.idle);
      nodeMat.uniforms.uFireColor.value.set(pal.fire);
      nodeMat.uniforms.uCoreColor.value.set(pal.core);
      nodeMat.uniforms.uHalo.value = pal.halo;
      nodeMat.uniforms.uGlow.value = pal.glow;
      nodeMat.blending = blending;
      nodeMat.needsUpdate = true;

      edgeMat.uniforms.uEdgeColor.value.set(pal.edge);
      edgeMat.uniforms.uGlowColor.value.set(pal.edgeGlow);
      edgeMat.uniforms.uEdgeOpacity.value = pal.edgeOpacity;
      edgeMat.blending = blending;
      edgeMat.needsUpdate = true;

      pulseMat.uniforms.uPulseColor.value.set(pal.pulse);
      pulseMat.uniforms.uPulseCore.value.set(pal.pulseCore);
      pulseMat.blending = blending;
      pulseMat.needsUpdate = true;
    }

    applyPalette();

    var schemeObserver = new MutationObserver(applyPalette);
    schemeObserver.observe(document.body, {
      attributes: true, attributeFilter: ['data-md-color-scheme']
    });

    /* ── Signal simulation ──────────────────────────────────────────────── */
    var simTime = 0;

    var pulsePool = [];
    var freeSlots = [];
    for (var ps = SIM.maxPulses - 1; ps >= 0; ps--) {
      pulsePool.push({ active: false, from: 0, to: 0, edge: 0, t: 0, dur: 1 });
      freeSlots.push(ps);
    }
    pulsePool.reverse();

    function spawnPulse(fromI, toI, edgeI) {
      if (REDUCED || freeSlots.length === 0) return false;
      var slot = freeSlots.pop();
      var p = pulsePool[slot];
      p.active = true;
      p.slot = slot;
      p.from = fromI;
      p.to = toI;
      p.edge = edgeI;
      p.t = 0;
      p.dur = Math.max(0.15, nodes[fromI].pos.distanceTo(nodes[toI].pos) / SIM.pulseSpeed);
      return true;
    }

    function fireNode(i) {
      var n = nodes[i];
      n.energy = 1.0;
      n.refractory = SIM.refractory;
      var conns = n.connections, emitted = 0;
      for (var c = 0; c < conns.length && emitted < SIM.emitCap; c++) {
        if (Math.random() < SIM.emitChance) {
          if (spawnPulse(i, conns[c].node, conns[c].edge)) emitted++;
        }
      }
    }

    function pulseArrive(p) {
      var n = nodes[p.to];
      if (n.refractory > 0) return;
      n.energy = Math.min(1, n.energy + SIM.arriveEnergy);
      if (n.energy >= SIM.fireThreshold || Math.random() < SIM.igniteChance) {
        fireNode(p.to);
      }
    }

    /* Delayed firings (used by cluster bursts) */
    var fireQueue = [];   // { i, at }

    function scheduleBurst() {
      var members = clusters[Math.floor(Math.random() * clusters.length)];
      for (var k = 0; k < SIM.burstSize; k++) {
        fireQueue.push({
          i: members[Math.floor(Math.random() * members.length)],
          at: simTime + k * 0.12
        });
      }
    }

    // Open with some immediate activity so the network is alive on load
    for (var w = 0; w < 6; w++) {
      fireQueue.push({
        i: Math.floor(Math.random() * nodes.length),
        at: 0.3 + w * 0.25
      });
    }

    /* ── Camera rig ─────────────────────────────────────────────────────── */
    var introProgress = REDUCED ? 1 : 0;
    var camTheta  = Math.random() * Math.PI * 2;
    var camRadius = REDUCED ? CFG.orbitRadius : CFG.introRadiusStart;

    /* ── Animation loop ─────────────────────────────────────────────────── */
    var animId = null;
    var last = null;
    var spontaneousTimer = 0;
    var burstTimer = randBetween(SIM.burstEvery[0], SIM.burstEvery[1]);

    var _vA = new THREE.Vector3(), _vB = new THREE.Vector3();
    var _dA = new THREE.Vector3(), _dB = new THREE.Vector3();

    function tick(now) {
      animId = requestAnimationFrame(tick);
      var dt = last === null ? 0.016 : Math.min((now - last) / 1000, 0.05);
      last = now;
      simTime += dt;
      timeUniform.value = simTime;

      /* Timers */
      spontaneousTimer += dt;
      if (spontaneousTimer >= SIM.spontaneousEvery) {
        spontaneousTimer = 0;
        fireNode(Math.floor(Math.random() * nodes.length));
      }
      if (!REDUCED) {
        burstTimer -= dt;
        if (burstTimer <= 0) {
          scheduleBurst();
          burstTimer = randBetween(SIM.burstEvery[0], SIM.burstEvery[1]);
        }
      }
      if (fireQueue.length) {
        for (var q = fireQueue.length - 1; q >= 0; q--) {
          if (fireQueue[q].at <= simTime) {
            fireNode(fireQueue[q].i);
            fireQueue.splice(q, 1);
          }
        }
      }

      /* Node energies */
      var decayMul = Math.pow(SIM.decay, dt);
      for (var i = 0; i < NODE_COUNT; i++) {
        var n = nodes[i];
        n.energy *= decayMul;
        if (n.energy < 0.003) n.energy = 0;
        if (n.refractory > 0) n.refractory -= dt;
        nodeEnergy[i] = n.energy;
      }
      nodeGeo.attributes.aEnergy.needsUpdate = true;

      /* Edge heat decay + per-vertex energy/heat */
      for (var e = 0; e < EDGE_COUNT; e++) {
        if (edgeHeat[e] > 0) {
          edgeHeat[e] = Math.max(0, edgeHeat[e] - dt * SIM.heatDecay);
        }
        edgeEnergy[e * 2]     = nodes[edges[e].a].energy;
        edgeEnergy[e * 2 + 1] = nodes[edges[e].b].energy;
        edgeHeatAttr[e * 2]     = edgeHeat[e];
        edgeHeatAttr[e * 2 + 1] = edgeHeat[e];
      }
      edgeGeo.attributes.aEnergy.needsUpdate = true;
      edgeGeo.attributes.aHeat.needsUpdate = true;

      /* Pulses — CPU-interpolated along their (drifting) edge */
      var amp = driftUniform.value;
      for (var pIdx = 0; pIdx < SIM.maxPulses; pIdx++) {
        var p = pulsePool[pIdx];
        if (!p.active) continue;

        p.t += dt / p.dur;
        edgeHeat[p.edge] = Math.max(edgeHeat[p.edge], 1.0 - p.t * 0.25);

        if (p.t >= 1) {
          p.active = false;
          freeSlots.push(p.slot);
          pulseArrive(p);
          for (var z = 0; z < SIM.trail; z++) pulseInt[p.slot * SIM.trail + z] = 0;
          continue;
        }

        // Endpoint positions including the same drift the shaders apply
        _vA.copy(nodes[p.from].pos).add(driftInto(_dA, nodes[p.from].seed, simTime, amp));
        _vB.copy(nodes[p.to].pos).add(driftInto(_dB, nodes[p.to].seed, simTime, amp));

        var headFade = Math.min(1, p.t * 10) * (1 - 0.25 * p.t);
        for (var s = 0; s < SIM.trail; s++) {
          var slotIdx = p.slot * SIM.trail + s;
          var ts = Math.max(0, p.t - s * 0.07);
          pulsePos[slotIdx * 3]     = lerp(_vA.x, _vB.x, ts);
          pulsePos[slotIdx * 3 + 1] = lerp(_vA.y, _vB.y, ts);
          pulsePos[slotIdx * 3 + 2] = lerp(_vA.z, _vB.z, ts);
          pulseInt[slotIdx] = s === 0
            ? headFade
            : headFade * 0.45 * (1 - s / SIM.trail);
        }
      }
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.aIntensity.needsUpdate = true;

      /* Camera */
      if (!REDUCED) {
        if (introProgress < 1) {
          introProgress = Math.min(1, introProgress + dt / CFG.introDuration);
          var it = introProgress;
          var ease = it * it * it * (it * (it * 6 - 15) + 10); // smootherstep
          camRadius = lerp(CFG.introRadiusStart, CFG.orbitRadius, ease);
          camTheta += dt * 0.10;       // gentle sweep during the dolly-in
        } else {
          camTheta += dt * (0.032 + 0.014 * Math.sin(simTime * 0.05));
        }
      }

      var camPhi = 0.12 + (REDUCED ? 0 : 0.16 * Math.sin(simTime * 0.07));
      var cosP = Math.cos(camPhi);
      camera.position.x = camRadius * cosP * Math.cos(camTheta);
      camera.position.z = camRadius * cosP * Math.sin(camTheta);
      camera.position.y = camRadius * Math.sin(camPhi);
      camera.lookAt(CFG.lookTarget[0], CFG.lookTarget[1], CFG.lookTarget[2]);

      // Depth fade tracks the camera so the far side always melts away
      fogUniforms.uFogNear.value = camRadius * 0.55;
      fogUniforms.uFogFar.value  = camRadius + CFG.scatterRadius * 1.7;

      renderer.render(scene, camera);
    }

    /* ── Show / hide ────────────────────────────────────────────────────── */
    /* Dark-mode enforcement is handled separately by dark-lock.js via the
       page's `force-dark: true` front matter — this script adapts to
       whatever scheme is active (see the MutationObserver above). */
    function activate() {
      heroDiv.style.display = 'block';
      document.body.classList.add('neural-active');
      applyPalette();
      if (animId === null) {
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
