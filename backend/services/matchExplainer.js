const { groqChat } = require('./groqClient');

async function explainMatch(vendor, requirement) {
  const prompt = `You are a B2B sourcing assistant. A buyer needs: "${requirement}".
Vendor "${vendor.name}" scored ${vendor.matchScore}% match based on:
Price: ${vendor.price}/10, Quality: ${vendor.quality}/10, Delivery: ${vendor.deliveryTime}/10,
Reviews: ${vendor.reviews}/10, Location: ${vendor.location}/10, Capacity: ${vendor.capacity}/10,
Certifications: ${vendor.certifications}/10, Past Performance: ${vendor.pastPerformance}/10.
Write a 2-sentence explanation of why this vendor is a good/weak match, in plain business language.`;

  const explanation = await groqChat(
    [{ role: 'user', content: prompt }],
    { model: 'llama3-70b-8192', temperature: 0.7 }
  );

  return explanation;
}

module.exports = { explainMatch };