// 프롬프트 빌더
export function buildTravelPrompt({
  userMessage,
  travelContext,
}: {
  userMessage: string;
  travelContext: string;
}) {
  return [
    {
      role: "system",
      content:
        "You are an AI travel assistant. Respond only in valid JSON. Do not include markdown.",
    },
    {
      role: "system",
      content:
        'Return this exact schema: {"insight":"string","city":"string","days":number,"route":[{"lat":number,"lng":number}],"schedules":{"1":[{"id":number,"title":"string","subtitle":"string","description":"string","type":"spot|food|hotel|move"}]}}',
    },
    {
      role: "assistant",
      content:
        `Travel Context:\n${travelContext}\n` +
        "Build day-by-day plans that match the selected pace, companions, and style.",
    },
    {
      role: "user",
      content: userMessage,
    },
  ];
}
