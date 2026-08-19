/**
 * Calculates dynamic suitability score using Multi-Criteria Decision Analysis (MCDA / AHP)
 */
export function calculateSiteScore(site, weights) {
  const totalWeight =
    (weights.waterIce || 0) +
    (weights.solarEnergy || 0) +
    (weights.terrain || 0) +
    (weights.radiation || 0) +
    (weights.access || 0);

  if (totalWeight === 0) {
    return { score: site.suitabilityScore, tier: site.tier, confidence: site.aiConfidence };
  }

  // Weighted Linear Combination
  const weightedSum =
    site.factors.waterIce * (weights.waterIce / totalWeight) +
    site.factors.solarIllumination * (weights.solarEnergy / totalWeight) +
    site.factors.terrain * (weights.terrain / totalWeight) +
    site.factors.radiationSafety * (weights.radiation / totalWeight) +
    site.factors.accessibility * (weights.access / totalWeight);

  const finalScore = parseFloat(weightedSum.toFixed(1));

  let tier = 'POOR';
  if (finalScore >= 88) {
    tier = 'HIGHLY SUITABLE';
  } else if (finalScore >= 80) {
    tier = 'SUITABLE';
  } else if (finalScore >= 70) {
    tier = 'MODERATE';
  }

  // Calculate AI confidence based on dataset completeness & variance
  const factorValues = Object.values(site.factors);
  const mean = factorValues.reduce((a, b) => a + b, 0) / factorValues.length;
  const variance = factorValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / factorValues.length;
  const confidence = Math.min(98, Math.max(75, Math.round(96 - Math.sqrt(variance) * 0.5)));

  return {
    score: finalScore,
    tier,
    confidence
  };
}

/**
 * Re-ranks all candidate sites based on custom weights
 */
export function rankSites(sites, weights) {
  return sites
    .map((site) => {
      const { score, tier, confidence } = calculateSiteScore(site, weights);
      return {
        ...site,
        suitabilityScore: score,
        tier,
        aiConfidence: confidence
      };
    })
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

/**
 * Generates an automated AI Assessment text for a site
 */
export function generateAiAssessment(site, weights) {
  const topStrength = Object.entries(site.factors).sort((a, b) => b[1] - a[1])[0];
  const lowestFactor = Object.entries(site.factors).sort((a, b) => a[1] - b[1])[0];

  const factorLabels = {
    terrain: 'Terrain Flatness & Bearing Capacity',
    waterIce: 'Water Ice Concentration',
    solarIllumination: 'Solar Illumination & Energy Harvesting',
    radiationSafety: 'Radiation Shielding Profile',
    temperature: 'Thermal Equilibrium Stability',
    accessibility: 'Landing Approach Corridor'
  };

  return `Site AI Evaluation for ${site.name}: Evaluated overall suitability is ${site.suitabilityScore}/100 (${site.tier}) with ${site.aiConfidence}% algorithmic confidence. Primary operational advantage is ${factorLabels[topStrength[0]] || topStrength[0]} at ${topStrength[1]}/100. Primary engineering constraint to mitigate is ${factorLabels[lowestFactor[0]] || lowestFactor[0]} (${lowestFactor[1]}/100). Habitat layout recommendation: ${site.missionRecommendations ? site.missionRecommendations[0] : 'Deploy basecamp'}.`;
}
