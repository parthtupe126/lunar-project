/**
 * scientificVisualizers.ts
 * Pure data-driven mathematical generation of scientific SVG curves, meshes,
 * and radar/thermal profiles derived strictly from NASA LOLA, Diviner, LEND,
 * and CRaTER telemetry records for the selected lunar node.
 */

export function generateTerrainMesh(slopeDeg: number = 5, elevationM: number = 0, roughnessRms: number = 1) {
  const slope = Math.max(0.5, Math.min(30, Number(slopeDeg) || 5));
  const roughness = Math.max(0.1, Math.min(3, Number(roughnessRms) || 1));
  const elevation = Number(elevationM) || 0;

  const normElev = Math.max(0, Math.min(1, (elevation + 3000) / 9000));
  const peakY = Math.round(50 - (slope * 2.2) - (normElev * 10));
  const peakX = Math.round(75 + (slope * 0.8));
  const r1 = (roughness * 2.5).toFixed(1);
  const r2 = (roughness * -2.0).toFixed(1);

  const basePolygon = `M 10 75 L ${peakX} ${peakY} L 115 ${peakY + 15 + Number(r1)} L 150 78 L 95 86 Z`;
  const wirelines = [
    `M 10 75 L ${peakX} ${peakY}`,
    `M 35 78 L ${peakX + 15} ${peakY + 5}`,
    `M 65 82 L ${peakX + 35} ${peakY + 10}`,
    `M 95 86 L 150 78`,
    `M ${peakX} ${peakY} L 150 78`,
    `M ${Math.round(10 + (peakX - 10)*0.5)} ${Math.round(75 + (peakY - 75)*0.5 + Number(r1))} L ${Math.round(95 + (150 - 95)*0.5)} ${Math.round(86 + (78 - 86)*0.5 + Number(r2))}`
  ];

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

export function generateRoughnessProfile(roughnessRms: number = 1, elevationM: number = 0, craterDiameter: number = 20) {
  const rms = Math.max(0.2, Math.min(3.0, Number(roughnessRms) || 0.85));
  const baseLine = 22;
  const p1 = Math.max(2, Math.round(baseLine - (rms * 12)));
  const p2 = Math.max(4, Math.round(baseLine - (rms * 6)));
  const p3 = Math.max(2, Math.round(baseLine - (rms * 14)));
  const p4 = Math.max(5, Math.round(baseLine - (rms * 8)));
  const p5 = Math.max(3, Math.round(baseLine - (rms * 10)));

  const path = `M 2 ${baseLine} Q 10 ${p1}, 20 ${p2} T 35 ${p3} T 48 ${p4} T 54 ${p5} L 58 ${baseLine}`;
  const fillPath = `${path} Z`;

  return { path, fillPath, rms: rms.toFixed(2) };
}

export function generateSlopeDistribution(slopeDeg: number = 4.2, roughnessRms: number = 0.85) {
  const meanSlope = Math.max(1, Math.min(25, Number(slopeDeg) || 4));
  const spread = Math.max(0.5, Math.min(5, (Number(roughnessRms) || 0.8) * 1.8));
  const baseLine = 22;
  const peakX = Math.max(8, Math.min(50, Math.round(meanSlope * 3.2)));
  const peakY = Math.max(3, Math.min(18, Math.round(2 + (20 / spread))));
  const constructionPct = Math.round(Math.max(5, Math.min(96, Math.exp(- (meanSlope * meanSlope) / (2 * spread * spread * 4)) * 100)));

  const path = `M 2 ${baseLine} Q ${Math.round(peakX / 2)} ${peakY}, ${peakX} ${peakY} T ${Math.min(58, peakX * 2 + 5)} ${baseLine} L 58 ${baseLine}`;
  const fillPath = `M 2 ${baseLine} Q ${Math.round(peakX / 2)} ${peakY}, ${peakX} ${peakY} T ${Math.min(58, peakX * 2 + 5)} ${baseLine} L 58 ${baseLine} Z`;

  return { path, fillPath, constructionPct, meanSlope: meanSlope.toFixed(1) };
}

export function generateSolarIlluminationCurve(annualSunPct: number = 90, maxLightDays: number = 120, maxDarkDays: number = 10, variancePct: number = 5) {
  const sunPct = Math.max(10, Math.min(99, Number(annualSunPct) || 80));
  const lightDays = Math.max(5, Math.min(300, Number(maxLightDays) || 50));
  const darkDays = Math.max(0, Math.min(100, Number(maxDarkDays) || 10));
  const variance = Math.max(1, Math.min(30, Number(variancePct) || 5));
  const bottom = 46;
  
  const peakY = Math.round(bottom - ((sunPct / 100) * 38));
  const troughPct = Math.max(0, sunPct - variance * 2.5);
  const troughY = Math.round(bottom - ((troughPct / 100) * 38));
  const isPolarPeak = sunPct >= 80;
  
  let pathD = '';
  if (isPolarPeak) {
    pathD = `M 5 ${troughY} Q 35 ${peakY}, 60 ${peakY} L 100 ${peakY} Q 125 ${peakY}, 155 ${troughY}`;
  } else {
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

export function generateRadiationModel(gcrDoseMsv: number = 300, doseRateUsvH: number = 34.2, terrainShieldingPct: number = 40) {
  const dose = Math.max(10, Math.min(600, Number(gcrDoseMsv) || 300));
  const flux = Math.max(1, Math.min(80, Number(doseRateUsvH) || (dose * 1000 / 8760)));
  const shielding = Math.max(5, Math.min(99, Number(terrainShieldingPct) || 30));

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

export function generateIcePSRModel(iceProbPct: number = 80, hydrogenPpm: number = 1000, distanceToPsrM: number = 500) {
  const prob = Math.max(5, Math.min(99, Number(iceProbPct) || 50));
  const ppm = Math.max(30, Math.min(3000, Number(hydrogenPpm) || 500));
  const dist = Math.max(0, Math.min(10000, Number(distanceToPsrM) || 500));

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

export function generateCraterContours(diameterKm: number = 20, rimDepthM: number = 2000, slopeDeg: number = 5) {
  const diam = Math.max(1, Math.min(300, Number(diameterKm) || 20));
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
