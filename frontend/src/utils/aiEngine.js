/**
 * Calculates dynamic suitability score using XGBoost ML predictions and Multi-Criteria Decision Analysis (MCDA / AHP)
 */
export function calculateSiteScore(site, weights) {
  const totalWeight =
    (weights.waterIce || 0) +
    (weights.solarEnergy || 0) +
    (weights.terrain || 0) +
    (weights.radiation || 0) +
    (weights.access || 0);

  const baseAiScore = typeof site.ai_suitability_score === 'number' 
    ? site.ai_suitability_score 
    : (site.suitabilityScore || 75.0);

  if (totalWeight === 0) {
    return { 
      score: parseFloat(baseAiScore.toFixed(1)), 
      tier: site.tier || 'SUITABLE', 
      confidence: Math.round(site.aiConfidence || 85) 
    };
  }

  // Check if default Artemis baseline weights (25, 25, 20, 15, 15)
  const isDefaultWeights = 
    weights.waterIce === 25 &&
    weights.solarEnergy === 25 &&
    weights.terrain === 20 &&
    weights.radiation === 15 &&
    weights.access === 15;

  if (isDefaultWeights && typeof site.ai_suitability_score === 'number') {
    return {
      score: parseFloat(site.ai_suitability_score.toFixed(1)),
      tier: site.tier || (site.ai_suitability_score >= 70 ? 'SUITABLE' : site.ai_suitability_score >= 60 ? 'MODERATE' : 'POOR'),
      confidence: Math.round(site.aiConfidence || 85)
    };
  }

  // Weighted Linear Combination based on site factors
  const factors = site.ai_factors || site.factors;
  const weightedSum =
    factors.waterIce * (weights.waterIce / totalWeight) +
    factors.solarIllumination * (weights.solarEnergy / totalWeight) +
    factors.terrain * (weights.terrain / totalWeight) +
    factors.radiationSafety * (weights.radiation / totalWeight) +
    factors.accessibility * (weights.access / totalWeight);

  const baselineWeightedSum =
    factors.waterIce * 0.25 +
    factors.solarIllumination * 0.25 +
    factors.terrain * 0.20 +
    factors.radiationSafety * 0.15 +
    factors.accessibility * 0.15;

  const scoreDelta = weightedSum - baselineWeightedSum;
  const finalScore = parseFloat(Math.min(99.9, Math.max(10.0, baseAiScore + scoreDelta * 0.8)).toFixed(1));

  let tier = 'POOR';
  if (finalScore >= 75) {
    tier = 'HIGHLY SUITABLE';
  } else if (finalScore >= 68) {
    tier = 'SUITABLE';
  } else if (finalScore >= 55) {
    tier = 'MODERATE';
  }

  return {
    score: finalScore,
    tier,
    confidence: site.aiConfidence || 85
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
        ai_suitability_score: score,
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
