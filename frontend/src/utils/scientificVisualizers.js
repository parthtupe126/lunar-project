/**
 * scientificVisualizers.js
 * Pure data-driven mathematical generation of scientific SVG curves, meshes,
 * and radar/thermal profiles derived strictly from NASA LOLA, Diviner, LEND,
 * and CRaTER telemetry records for the selected lunar node.
 */

// 1. Generate 3D Topographic Mesh based on slope, elevation, and roughness
export function generateTerrainMesh(slopeDeg = 5, elevationM = 0, roughnessRms = 1) {
  const slope = Math.max(0.5, Math.min(30, Number(slopeDeg) || 5));
  const roughness = Math.max(0.1, Math.min(3, Number(roughnessRms) || 1));
  const elevation = Number(elevationM) || 0;

  // Normalized elevation (-3000 to +6000)
  const normElev = Math.max(0, Math.min(1, (elevation + 3000) / 9000));
  
  // Peak height in 3D wireframe (steeper slope = sharper peak)
  const peakY = Math.round(50 - (slope * 2.2) - (normElev * 10));
  const peakX = Math.round(75 + (slope * 0.8));
  
  // Roughness noise offsets
  const r1 = (roughness * 2.5).toFixed(1);
  const r2 = (roughness * -2.0).toFixed(1);

  // Main terrain polygon
  const basePolygon = `M 10 75 L ${peakX} ${peakY} L 115 ${peakY + 15 + Number(r1)} L 150 78 L 95 86 Z`;
  
  // 3D wireframe longitudinal lines
  const wirelines = [
    `M 10 75 L ${peakX} ${peakY}`,
    `M 35 78 L ${peakX + 15} ${peakY + 5}`,
    `M 65 82 L ${peakX + 35} ${peakY + 10}`,
    `M 95 86 L 150 78`,
    // Transverse ridge contours
    `M ${peakX} ${peakY} L 150 78`,
    `M ${Math.round(10 + (peakX - 10)*0.5)} ${Math.round(75 + (peakY - 75)*0.5 + Number(r1))} L ${Math.round(95 + (150 - 95)*0.5)} ${Math.round(86 + (78 - 86)*0.5 + Number(r2))}`
  ];

  // Landing zone stability circle
  const stabilityRadius = Math.max(8, Math.min(22, 24 - slope * 1.2));
  const stabilityPct = Math.round(Math.max(40, Math.min(99, 100 - slope * 4.2 - roughness * 4)));

  return {
    basePolygon,
    wirelines,
    peakX,
    peakY,
    stabilityRadius,
    stabilityPct,
    stabilityColor: stabilityPct >= 85 ? '#10b981' : stabilityPct >= 70 ? '#f59e0b' : '#ef4444'
  };
}

// 2. Generate Surface Roughness RMS Distribution Profile
export function generateRoughnessProfile(roughnessRms = 1, elevationM = 0, craterDiameter = 20) {
  const rms = Math.max(0.2, Math.min(3.0, Number(roughnessRms) || 0.85));
  const diam = Math.max(1, Math.min(200, Number(craterDiameter) || 20));
  
  const width = 60;
  const height = 25;
  const baseLine = 22;
  
  // Create 6 discrete data points from RMS & micro-crater spatial frequency
  const p1 = Math.max(2, Math.round(baseLine - (rms * 12)));
  const p2 = Math.max(4, Math.round(baseLine - (rms * 6)));
  const p3 = Math.max(2, Math.round(baseLine - (rms * 14)));
  const p4 = Math.max(5, Math.round(baseLine - (rms * 8)));
  const p5 = Math.max(3, Math.round(baseLine - (rms * 10)));

  const path = `M 2 ${baseLine} Q 10 ${p1}, 20 ${p2} T 35 ${p3} T 48 ${p4} T 54 ${p5} L 58 ${baseLine}`;
  const fillPath = `${path} Z`;

  return { path, fillPath, rms: rms.toFixed(2) };
}

// 3. Generate Slope Distribution Histogram Curve (<3° construction zone)
export function generateSlopeDistribution(slopeDeg = 4.2, roughnessRms = 0.85) {
  const meanSlope = Math.max(1, Math.min(25, Number(slopeDeg) || 4));
  const spread = Math.max(0.5, Math.min(5, (Number(roughnessRms) || 0.8) * 1.8));

  const baseLine = 22;
  // Peak position along 60px X-axis (mean slope position)
  const peakX = Math.max(8, Math.min(50, Math.round(meanSlope * 3.2)));
  const peakY = Math.max(3, Math.min(18, Math.round(2 + (20 / spread))));

  // Construction suitability percentage (< 3 degrees)
  const constructionPct = Math.round(Math.max(5, Math.min(96, Math.exp(- (meanSlope * meanSlope) / (2 * spread * spread * 4)) * 100)));

  const path = `M 2 ${baseLine} Q ${Math.round(peakX / 2)} ${peakY}, ${peakX} ${peakY} T ${Math.min(58, peakX * 2 + 5)} ${baseLine} L 58 ${baseLine}`;
  const fillPath = `M 2 ${baseLine} Q ${Math.round(peakX / 2)} ${peakY}, ${peakX} ${peakY} T ${Math.min(58, peakX * 2 + 5)} ${baseLine} L 58 ${baseLine} Z`;

  return { path, fillPath, constructionPct, meanSlope: meanSlope.toFixed(1) };
}

// 4. Generate 12-Month Solar Illumination Horizon Waveform
export function generateSolarIlluminationCurve(annualSunPct = 90, maxLightDays = 120, maxDarkDays = 10, variancePct = 5) {
  const sunPct = Math.max(10, Math.min(99, Number(annualSunPct) || 80));
  const lightDays = Math.max(5, Math.min(300, Number(maxLightDays) || 50));
  const darkDays = Math.max(0, Math.min(100, Number(maxDarkDays) || 10));
  const variance = Math.max(1, Math.min(30, Number(variancePct) || 5));

  const width = 160;
  const height = 50;
  const bottom = 46;
  
  // Peak height corresponding to sun percentage (0-100% -> bottom to top)
  const peakY = Math.round(bottom - ((sunPct / 100) * 38));
  // Trough height in winter / dark period
  const troughPct = Math.max(0, sunPct - variance * 2.5);
  const troughY = Math.round(bottom - ((troughPct / 100) * 38));
  
  // Curve profile: polar flat plateau vs equatorial sine wave
  const isPolarPeak = sunPct >= 80;
  
  let pathD = '';
  if (isPolarPeak) {
    // Wide elevated plateau
    pathD = `M 5 ${troughY} Q 35 ${peakY}, 60 ${peakY} L 100 ${peakY} Q 125 ${peakY}, 155 ${troughY}`;
  } else {
    // Equatorial day/night sinusoidal cycles
    const dip = Math.min(bottom - 2, troughY + 12);
    pathD = `M 5 ${dip} Q 35 ${peakY}, 50 ${peakY} Q 70 ${dip}, 85 ${dip} Q 110 ${peakY}, 130 ${peakY} Q 145 ${dip}, 155 ${dip}`;
  }

  const fillD = `${pathD} L 155 ${bottom} L 5 ${bottom} Z`;

  return {
    pathD,
    fillD,
    peakY,
    sunPct: sunPct.toFixed(1),
    lightDays,
    darkDays,
    isPolarPeak
  };
}

// 5. Generate Radiation Exposure Colormap and Flux Metrics
export function generateRadiationModel(gcrDoseMsv = 300, doseRateUsvH = 34.2, terrainShieldingPct = 40) {
  const dose = Math.max(10, Math.min(600, Number(gcrDoseMsv) || 300));
  const flux = Math.max(1, Math.min(80, Number(doseRateUsvH) || (dose * 1000 / 8760)));
  const shielding = Math.max(5, Math.min(99, Number(terrainShieldingPct) || 30));

  // Risk tier & color
  let riskTier = 'Low Risk';
  let riskColor = '#10b981';
  let badgeGradient = 'from-emerald-600 via-teal-500 to-blue-600';

  if (dose > 350) {
    riskTier = 'High Risk';
    riskColor = '#ef4444';
    badgeGradient = 'from-red-600 via-amber-500 to-yellow-500';
  } else if (dose > 250) {
    riskTier = 'Moderate Risk';
    riskColor = '#f59e0b';
    badgeGradient = 'from-amber-600 via-yellow-500 to-emerald-500';
  } else if (dose < 50) {
    riskTier = 'Subsurface Safe';
    riskColor = '#06b6d4';
    badgeGradient = 'from-cyan-600 via-blue-500 to-indigo-600';
  }

  return {
    annualDoseMsv: (dose / 1000).toFixed(2),
    rawDose: dose,
    hourlyFluxUsv: flux.toFixed(1),
    shieldingPct: shielding,
    riskTier,
    riskColor,
    badgeGradient
  };
}

// 6. Generate Water Ice & PSR Cold-Trap Geometric Model
export function generateIcePSRModel(iceProbPct = 80, hydrogenPpm = 1000, distanceToPsrM = 500) {
  const prob = Math.max(5, Math.min(99, Number(iceProbPct) || 50));
  const ppm = Math.max(30, Math.min(3000, Number(hydrogenPpm) || 500));
  const dist = Math.max(0, Math.min(10000, Number(distanceToPsrM) || 500));

  // PSR mask visual radius (larger if high ice & close to PSR)
  const psrRadiusPct = Math.max(20, Math.min(85, Math.round(prob * 0.75 + (ppm / 100))));
  const coldTrapTempK = Math.max(35, Math.min(120, Math.round(140 - (prob * 1.05))));

  return {
    iceProb: prob.toFixed(1),
    hydrogenPpm: ppm,
    distanceM: dist,
    psrRadiusPct,
    coldTrapTempK,
    hydrationGrade: prob >= 85 ? 'Extremely Rich Volatiles' : prob >= 60 ? 'Moderate Ice Deposits' : 'Regolith Dry / Trace Water'
  };
}

// 7. Generate Crater Contour Rings based on diameter and depth
export function generateCraterContours(diameterKm = 20, rimDepthM = 2000, slopeDeg = 5) {
  const diam = Math.max(1, Math.min(300, Number(diameterKm) || 20));
  const depth = Math.max(100, Math.min(6000, Number(rimDepthM) || 2000));
  const slope = Math.max(1, Math.min(25, Number(slopeDeg) || 5));

  // Contour rings scale with diameter & slope
  const rxOuter = Math.max(90, Math.min(160, 110 + (diam * 0.25)));
  const ryOuter = Math.round(rxOuter * 0.52);

  const rxMid = Math.round(rxOuter * 0.72);
  const ryMid = Math.round(ryOuter * 0.72);

  const rxInner = Math.round(rxOuter * 0.45);
  const ryInner = Math.round(ryOuter * 0.45);

  const rxCenter = Math.round(rxOuter * 0.28);
  const ryCenter = Math.round(ryOuter * 0.28);

  return {
    outer: { rx: rxOuter, ry: ryOuter },
    mid: { rx: rxMid, ry: ryMid },
    inner: { rx: rxInner, ry: ryInner },
    center: { rx: rxCenter, ry: ryCenter }
  };
}
