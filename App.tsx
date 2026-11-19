import React, { useEffect, useMemo, useState } from "react";
import {
  Aperture, BadgeCheck, Clapperboard, Crown, Eye, Film, Gauge,
  Layers, Lightbulb, Palette, Sparkles, ChevronLeft, ChevronRight,
  ShieldCheck, Wand2, MonitorPlay, Camera, SlidersHorizontal, Sun, Droplets, Flame, Focus,
  Video, Orbit, Repeat, Timer, Music, Waves, Move, Gem, Target, Shuffle, RefreshCw,
  Mic, AudioLines, Scissors, Type, Download, BookOpen, Save, Trash2, CheckCircle2, Languages, WandSparkles,
} from "lucide-react";

async function callRecords(action: string, args: Record<string, unknown>) {
  const res = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, args }) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.error) throw new Error(typeof json?.error === "string" ? json.error : `Request failed (${res.status})`);
  return json.data;
}

type Expanded = {
  body: string; shutter: string; angle: string; lens: string; focal: string;
  aperture: string; iso: string; wb: string; dof: string; bokeh: string; focus: string;
  key: string; fill: string; rim: string; moog: string; godRay: string; volumetric: string;
  practical: string; nebula: string; dust: string; mist: string;
  goldDust: string; smoke: string; fireGlow: string; water: string; bloom: string;
  flare: string; grain: string; twoD: string; cgm: string; cgi: string; vfx: string;
  face: string; adetailer: string; eyes: string; hands: string; skin: string; jewellery: string;
};

type Level = {
  n: number; name: string; hindi: string; tier: string; resolution: string;
  sampler: string; steps: number; cfg: string; lora: string; face: string; iso: string;
  cgm: string; dop: string; colour: string; lighting: string; vfx: string; shutter: string;
  lens: string; aperture: string; mood: string; nebula: string; note: string; exp: Expanded;
  dopMix: string; directorFocus: string;
};

type Platform = {
  id: string; name: string; short: string; ratio: string; resolution: string;
  title: string; bottom: string; composition: string; safeZone: string; uiNote: string; promptRule: string;
};

const platforms: Platform[] = [
  {
    id: "yt-video", name: "YouTube Video / Thumbnail", short: "YouTube Video", ratio: "16:9", resolution: "1920x1080",
    title: "Title TOP Centre", bottom: "Bottom CLEAN — No title at bottom, only small branding",
    composition: "Composition centre-middle", safeZone: "Keep title, face and IBD inside the top / centre safe area — clear of the lower third",
    uiNote: "YT lower-third / progress bar / controls hide bottom title.",
    promptRule: "For 16:9: Title TOP Centre, Face centre, No bottom title. Bottom only small branding. YT lower-third / progress bar / controls hide any bottom text — keep bottom CLEAN.",
  },
  {
    id: "yt-shorts", name: "YouTube Shorts", short: "YouTube Shorts", ratio: "9:16", resolution: "1080x1920",
    title: "Title TOP Centre, Below IBD, Top Safe Zone", bottom: "Bottom CLEAN — No big title, only small branding",
    composition: "Keep face centre-middle", safeZone: "Top safe zone for title below IBD · Right side clear for Shorts UI buttons",
    uiNote: "Safe from Shorts UI buttons on the right side.",
    promptRule: "For 9:16: Title TOP Centre below IBD, Face centre-middle, Bottom clean. Right side clean for Shorts UI buttons.",
  },
  {
    id: "ig-reels", name: "Instagram Reels", short: "Instagram Reels", ratio: "9:16", resolution: "1080x1920",
    title: "Title TOP Centre, Same as Shorts", bottom: "Bottom clean, only small branding",
    composition: "Keep face centre-middle", safeZone: "Top safe zone for title · Right side clean for UI · Bottom clean for UI",
    uiNote: "Bottom clean, right side clean for UI.",
    promptRule: "For 9:16: Title TOP Centre below IBD, Face centre-middle, Bottom clean. Right side clean for Reels UI.",
  },
  {
    id: "ig-post", name: "Instagram Post / Threads Post", short: "IG / Threads Post", ratio: "1:1", resolution: "1080x1080",
    title: "Title TOP Centre", bottom: "Bottom only branding",
    composition: "Composition centred", safeZone: "Title in top safe zone · Branding top-left + bottom-centre",
    uiNote: "Square frame — keep everything centred and balanced.",
    promptRule: "For 1:1: Title TOP Centre, Face centre, Bottom only branding. Composition centred.",
  },
  {
    id: "ig-portrait", name: "Instagram Portrait / Threads Portrait", short: "IG / Threads Portrait", ratio: "4:5", resolution: "1080x1350",
    title: "Title TOP Centre", bottom: "Bottom clean, only small branding",
    composition: "Composition centre-middle", safeZone: "Title in top safe zone · Face centre-middle · Bottom clean",
    uiNote: "Tall portrait — use the extra height for temple scale, not bottom text.",
    promptRule: "For 4:5: Title TOP Centre, Face centre, Bottom only branding. Composition centre-middle, bottom clean.",
  },
  {
    id: "ig-story", name: "Instagram Story / WhatsApp Status", short: "Story / Status", ratio: "9:16", resolution: "1080x1920",
    title: "Title TOP Centre, Same as Reels", bottom: "Bottom clean, only small branding",
    composition: "Keep face centre-middle", safeZone: "Top safe zone for title · Right side clean for UI · Bottom clean for UI",
    uiNote: "Same as Reels — full-screen vertical, UI on the edges.",
    promptRule: "For 9:16: Title TOP Centre below IBD, Face centre-middle, Bottom clean. Same as Reels.",
  },
];

/* ---------- DEITIES & COUPLES — NATURE CONTROL ---------- */

type DeityEntry = {
  id: string; group: "Couples" | "Single Deities" | "All Avatars" | "Full Family & Darbar";
  name: string; hindi: string; nature: string; members?: string; titleExample?: string;
  pose: string; mood: string; colour: string; light: string;
  ornaments: string; background: string; titleTone: string;
  never: string; placement: string;
};

const deities: DeityEntry[] = [
  { id: "shiv-parvati", group: "Couples", name: "Shiv + Parvati", hindi: "शिव + पार्वती", nature: "Calm, Divine, Tapasya, Family, Protection", pose: "Together on Kailash — Parvati seated beside Shiv, calm and close. Ganesh / Kartikeya nearby only as an optional, small family presence.", mood: "Shant + Prem", colour: "White + Teal + Gold", light: "Moon + Cool + Warm Diya — cool moonlight balanced by one warm diya glow", ornaments: "Trishul and Damru held with calm authority · Rudraksha mala · simple gold ornaments · Parvati in red-gold saree with soft gold jewellery", background: "Kailash — snow, quiet sky, moon, still mountain air, a few diyas", titleTone: "Calm, reverent, family-warm", never: "Never fierce, never distant, never separated", placement: "Always together — Parvati beside Shiv, never behind or apart" },
  { id: "ram-sita", group: "Couples", name: "Ram + Sita", hindi: "राम + सीता", nature: "Maryada, Dharma, Loyalty, Grace", pose: "Ram–Sita STAND TOGETHER holding hands. Ram in blessing mudra with the other hand. Hanuman KNEELS IN FRONT with folded hands. NOT sitting behind.", mood: "Maryada + Prem", colour: "Saffron + Gold + Teal", light: "Warm temple gold + soft daylight — clear, dignified, steady", ornaments: "Ram with bow held with grace · Sita in gold-bordered saree · marigold mala · royal gold ornaments, never flashy", background: "Temple courtyard / Ayodhya-style palace steps — orderly, luminous, calm", titleTone: "Dignified, graceful, Maryada", never: "Never playful leela, never casual, never apart", placement: "Ram–Sita standing together holding hands · Hanuman kneeling in front, folded hands" },
  { id: "krishna-radha", group: "Couples", name: "Krishna + Radha", hindi: "कृष्ण + राधा", nature: "Prem, Leela, Playful, Bansuri, Vrindavan", pose: "Krishna centre with flute. Radha beside him or behind a tree, looking lovingly — Radha peeking, soft and tender.", mood: "Prem + Leela", colour: "Peacock Blue + Gold + Green", light: "Golden-hour Vrindavan glow + soft diya warmth · peacock-feather shimmer", ornaments: "Peacock feather crown · flute · peacock-blue fabric · gold ornaments · marigold and lotus", background: "Vrindavan — Kadamb tree, Yamuna, peacocks, soft mist, falling petals", titleTone: "Tender, playful, loving", never: "Never angry, never harsh, never distant", placement: "Krishna centre, flute · Radha close beside / peeking from the tree, gaze loving" },
  { id: "vishnu-lakshmi", group: "Couples", name: "Vishnu + Lakshmi", hindi: "विष्णु + लक्ष्मी", nature: "Palan, Shanti, Aishwarya, Seva", pose: "Vishnu reclining / seated on Sheshnaag. Lakshmi at His feet in seva — gently pressing / attending His feet.", mood: "Shant + Seva", colour: "Deep Teal + Gold + Pink Lotus", light: "Deep cosmic teal + warm gold lotus glow · calm ocean light", ornaments: "Shankh, Chakra, Gada and Padma held with calm grace · lotus mala · Lakshmi in pink-gold saree with lotus ornaments", background: "Ksheer Sagar — calm cosmic ocean, lotus, soft gold light", titleTone: "Serene, abundant, reverent", never: "Never restless, never showy, never apart", placement: "Vishnu on Sheshnaag · Lakshmi at His feet in seva" },
  { id: "shiv-shakti", group: "Couples", name: "Shiv + Shakti / Mahadev + Gauri", hindi: "शिव + शक्ति / महादेव + गौरी", nature: "Power + Calm balance", pose: "Together in balanced stillness — Shakti / Gauri beside Mahadev, both calm, power held in quiet control.", mood: "Shant + Shakti — balanced", colour: "White + Deep Teal + Gold with a restrained red accent", light: "Cool moonlight + warm gold rim — power and calm in one frame", ornaments: "Trishul and Damru · Shakti in red-gold attire · gold ornaments · calm, composed jewellery", background: "Kailash / temple sanctum — still, luminous, balanced", titleTone: "Balanced, powerful, calm", never: "Never uncontrolled fury, never imbalance", placement: "Always together — Shakti beside Mahadev, equal and balanced" },
  { id: "ganesha-riddhi-siddhi", group: "Couples", name: "Ganesha + Riddhi–Siddhi (optional)", hindi: "गणेश + ऋद्धि–सिद्धि", nature: "Vighnaharta, Shubh, Buddhi", pose: "Ganesha seated in blessing at the centre. Riddhi–Siddhi only as an optional, small presence on either side — never crowding the centre.", mood: "Shubh + Shant + Prem", colour: "Saffron + Gold + Green", light: "Warm festive gold + soft diya glow", ornaments: "Modak in hand · gold crown · marigold mala · simple, joyful ornaments", background: "Festive temple threshold — marigold, diyas, banana leaves, warm light", titleTone: "Auspicious, joyful, welcoming", never: "Never stern, never crowded", placement: "Ganesha centre in blessing · Riddhi–Siddhi optional, small, on either side" },
  { id: "hanuman", group: "Single Deities", name: "Hanuman", hindi: "हनुमान", nature: "Bhakti, Seva, Shakti, Vinamrata", pose: "Kneeling with folded hands OR flying with Gada — humble, devoted, never arrogant.", mood: "Bhakti + Seva + Vinamrata", colour: "Saffron + Gold", light: "Warm saffron-gold light + soft temple glow", ornaments: "Gada · saffron dhoti · gold armlets · rudraksha mala · tilak, humble and clean", background: "Temple / mountain path — diyas, marigold, open sky", titleTone: "Devoted, humble, strong", never: "Never arrogant, never proud, never threatening", placement: "Kneeling, folded hands, head gently bowed — or flying with Gada in service" },
  { id: "krishna-alone", group: "Single Deities", name: "Krishna Alone", hindi: "कृष्ण", nature: "Leela, Bansuri, Makhan, Gopal", pose: "Flute at the lips OR butter / Makhan moment OR Govardhan lifted in calm protection.", mood: "Prem + Leela + Anand", colour: "Peacock Blue + Gold + Green", light: "Vrindavan golden hour + soft diya glow", ornaments: "Peacock feather crown · flute · butter pot nearby when Makhan · gold ornaments", background: "Vrindavan — Kadamb tree, Yamuna, cows, soft mist", titleTone: "Playful, loving, joyful", never: "Never angry, never harsh, never stern", placement: "Krishna centre — flute / Makhan / Govardhan, one clear main subject" },
  { id: "ram-alone", group: "Single Deities", name: "Ram Alone", hindi: "राम", nature: "Maryada Purushottam, Dhanush, Blessing", pose: "Standing with Dhanush held with grace, one hand in blessing mudra — steady, dignified.", mood: "Maryada + Dharma + Prem", colour: "Saffron + Gold + Teal", light: "Warm gold + clear daylight — steady and dignified", ornaments: "Dhanush · gold crown · royal ornaments · marigold mala", background: "Ayodhya-style temple / palace steps — orderly, luminous", titleTone: "Dignified, righteous, calm", never: "Never playful leela, never casual, never angry", placement: "Ram centre, standing, Dhanush with grace, blessing hand raised" },
  { id: "shiv-alone", group: "Single Deities", name: "Shiv Alone", hindi: "शिव", nature: "Mahadev, Dhyan, Tandav calm, Trishul, Damru", pose: "Seated in Dhyan OR calm Tandav — slow, controlled, meditative. Trishul and Damru present with calm authority.", mood: "Shant + Dhyan", colour: "White + Teal + Gold", light: "Moon + Cool + Warm Diya", ornaments: "Trishul · Damru · Rudraksha mala · crescent moon · calm, simple ornaments", background: "Kailash — snow, moon, still air, a few diyas", titleTone: "Calm, meditative, divine", never: "Never rage, never gore, never chaos", placement: "Shiv centre — Dhyan seated or calm, controlled Tandav" },
  { id: "durga-maa", group: "Single Deities", name: "Durga / Maa", hindi: "दुर्गा / माँ", nature: "Shakti, Protection, Mamta, 9 forms", pose: "On the lion, 8 arms in blessing and protection — protective, maternal, never violent gore.", mood: "Shakti + Mamta + Shant", colour: "Red + Gold + Teal", light: "Warm gold + protective glow · soft diya light", ornaments: "Eight arms — each holding a divine symbol with grace · crown · red-gold saree · lotus and gold ornaments", background: "Temple sanctum / lion beside her — marigold, diyas, calm sky", titleTone: "Protective, maternal, strong", never: "Never violent gore, never blood, never fear", placement: "Maa centre on the lion — 8 arms in blessing, protective and maternal" },
  { id: "saraswati", group: "Single Deities", name: "Saraswati", hindi: "सरस्वती", nature: "Gyaan, Shanti, Veena, White", pose: "Seated gracefully with Veena — calm, serene, one hand in blessing.", mood: "Shant + Gyaan", colour: "White + Gold + Soft Teal", light: "Soft white-gold light · calm, clear, luminous", ornaments: "Veena · white saree with gold border · lotus · pearl and gold ornaments", background: "Calm river / lotus pond — white lotus, soft light, swan nearby", titleTone: "Serene, wise, pure", never: "Never loud, never harsh, never showy", placement: "Saraswati centre, seated, Veena held with grace" },
  { id: "lakshmi", group: "Single Deities", name: "Lakshmi", hindi: "लक्ष्मी", nature: "Dhan, Aishwarya, Kamal, Shanti", pose: "Seated on a lotus, hands in blessing — gold coins / lotus petals as gentle, symbolic abundance.", mood: "Shant + Aishwarya + Seva", colour: "Pink + Gold + Deep Teal", light: "Warm gold lotus glow + soft teal calm", ornaments: "Lotus in hand · pink-gold saree · gold ornaments · lotus mala", background: "Lotus pond / temple sanctum — pink lotus, gold light, calm water", titleTone: "Gracious, abundant, serene", never: "Never showy, never restless", placement: "Lakshmi centre, seated on lotus, blessing hands" },
  { id: "ganesha-alone", group: "Single Deities", name: "Ganesha Alone", hindi: "गणेश", nature: "Vighnaharta, Modak, Shubh Aarambh", pose: "Seated in blessing, Modak in hand — joyful, welcoming, auspicious.", mood: "Shubh + Anand + Shant", colour: "Saffron + Gold + Green", light: "Warm festive gold + diya glow", ornaments: "Modak · gold crown · marigold mala · joyful, clean ornaments", background: "Festive temple threshold — marigold, diyas, warm light", titleTone: "Auspicious, joyful, welcoming", never: "Never stern, never crowded", placement: "Ganesha centre, seated, blessing hand raised" },
  { id: "narasimha", group: "Single Deities", name: "Narasimha", hindi: "नरसिंह", nature: "Protection, Ugra but Divine — NOT violent", pose: "Calm blessing of Prahlad, emerging from the pillar — protective, divine, without blood or violence.", mood: "Shant + Protection + Bhakti", colour: "Gold + Deep Teal + Warm Saffron", light: "Warm gold pillar light + deep teal calm", ornaments: "Divine crown · gold ornaments · calm, majestic detailing · Prahlad small, safe, in devotion", background: "Temple pillar / palace hall — gold light, calm, protective", titleTone: "Protective, divine, calm", never: "Never blood, never violence, never gore, never fear", placement: "Narasimha emerging from the pillar, calm · Prahlad in devoted prayer nearby" },
  { id: "dashavatar", group: "All Avatars", name: "Dashavatar", hindi: "दशावतार", nature: "All 10 avatars — calm divine nature · Narasimha calm version only", pose: "All 10 avatars in one calm, ordered composition — each in its own divine nature, none violent. Narasimha in the calm blessing version only.", mood: "Shant + Divya + Dharma", colour: "Deep Teal + Gold + Saffron, with one calm accent per avatar", light: "Golden god-ray + calm teal — one unified divine light across all 10", ornaments: "Each avatar with its own correct symbols, held with calm grace · gold ornaments · lotus and marigold", background: "Grand temple / cosmic sky — ordered, luminous, calm", titleTone: "Grand, divine, calm", never: "Never violent, never gore, never blood — Narasimha calm version only", placement: "All 10 ordered and balanced — each avatar clear, none crowding another" },
  { id: "shiv-parivar", group: "Full Family & Darbar", name: "Shiv Parivar", hindi: "शिव परिवार - कैलाश", nature: "Calm Family — Calm, Tapasya, Family, Protection, Prem", members: "Shiv centre · Parvati beside Shiv right · Ganesha front-left with Modak · Kartikeya front-right with Vel · Nandi behind", titleExample: "“Shiv Parivar - Kailash” / “शिव परिवार - कैलाश”", pose: "FULL FAMILY — Shiv centre in blessing, Parvati beside Shiv on His right with a gentle smile, Ganesha front-left holding Modak, Kartikeya front-right holding Vel, Nandi behind. One family, one frame, all together.", mood: "Shant + Prem + Family", colour: "White + Deep Teal + Rich Gold", light: "Moon + Cool + Warm Diya — Kailash moonlight balanced by warm diya glow", ornaments: "Trishul and Damru held with calm authority · Rudraksha mala · Parvati in red-gold saree · Ganesha with Modak · Kartikeya with Vel · simple gold ornaments", background: "Kailash Snow + Moon + Layered Nebula — snow, quiet sky, moon, layered cosmic nebula, a few diyas", titleTone: "Calm, reverent, family-warm · Title example: “Shiv Parivar - Kailash” / “शिव परिवार - कैलाश”", never: "Never angry, never violent, never fierce, never separated", placement: "FIXED: Shiv centre blessing · Parvati beside Shiv right, gentle smile · Ganesha front-left with Modak · Kartikeya front-right with Vel · Nandi behind" },
  { id: "ram-darbar", group: "Full Family & Darbar", name: "Ram Darbar", hindi: "राम दरबार - अयोध्या", nature: "Maryada Bhakti — Maryada, Dharma, Loyalty, Bhakti, Prem", members: "Ram + Sita STAND TOGETHER centre HOLDING HANDS · Lakshman standing behind side with Dhanush · Hanuman KNEELS IN FRONT folded hands with Gada beside", titleExample: "“Ram Darbar - Ayodhya” / “राम दरबार - अयोध्या”", pose: "FULL DARBAR — Ram + Sita STAND TOGETHER centre HOLDING HANDS, Ram in blessing mudra, Lakshman standing behind at the side with Dhanush, Hanuman KNEELS IN FRONT with folded hands and Gada beside. NOT sitting behind, NOT separate prayer.", mood: "Maryada + Bhakti + Prem", colour: "Saffron + Deep Teal + Rich Gold", light: "Warm temple gold + soft daylight + diya glow — clear, dignified, steady", ornaments: "Ram with bow held with grace · Sita in gold-bordered saree · Lakshman with Dhanush · Hanuman with Gada beside · marigold mala · royal gold ornaments, never flashy", background: "Ayodhya Palace + Diya + Layered Nebula — orderly palace steps, glowing diyas, layered cosmic nebula", titleTone: "Dignified, graceful, Maryada · Title example: “Ram Darbar - Ayodhya” / “राम दरबार - अयोध्या”", never: "Never sitting behind, never separate prayer, never apart, never casual", placement: "FIXED: Ram–Sita standing together centre holding hands, Ram blessing mudra · Lakshman standing behind side with Dhanush · Hanuman kneeling in front, folded hands, Gada beside — this placement is FIXED, never change" },
];

type DirectorRef = {
  name: string; role: string; signature: string; look: string; credit: string;
};

const directors: DirectorRef[] = [
  { name: "Christopher Nolan", role: "Director · IMAX", signature: "IMAX, practical, epic scale, 65mm film look", look: "Large-format scale, real light, monumental temple architecture and crowd depth.", credit: "Interstellar / Oppenheimer scale" },
  { name: "Hoyte van Hoytema", role: "Nolan DOP · IMAX", signature: "IMAX, natural light, golden hour", look: "Warm natural light, glowing skin, expansive sky and golden-hour god-rays.", credit: "Oppenheimer / Interstellar look" },
  { name: "Roger Deakins", role: "DOP · Volumetric", signature: "Soft volumetric, teal + gold, mist", look: "Layered volumetric beams, soft mist, deep teal shadows with golden highlights.", credit: "Blade Runner 2049" },
  { name: "Emmanuel Lubezki (Chivo)", role: "DOP · Natural Light", signature: "Natural light, long takes, golden glow", look: "Continuous natural light, warm golden glow, immersive flowing movement.", credit: "Revenant / Gravity" },
  { name: "Greig Fraser", role: "DOP · Epic Haze", signature: "Desert haze, volumetric, epic", look: "Atmospheric haze, dusty golden air, vast epic scale with soft volumetric light.", credit: "Dune" },
  { name: "Robert Richardson", role: "DOP · Warm Gold", signature: "Warm gold, film grain", look: "Rich warm gold highlights, textured film grain, luminous practical light.", credit: "Warm gold · film grain" },
  { name: "Wally Pfister", role: "DOP · Nolan Early", signature: "Dark + gold", look: "Deep shadows held against warm golden practicals and rim light.", credit: "Nolan early work" },
  { name: "Janusz Kaminski", role: "DOP · Desaturated Gold", signature: "Desaturated + gold", look: "Muted, desaturated tones with restrained golden accents and hazy atmosphere.", credit: "Saving Private Ryan" },
  { name: "Dion Beebe", role: "DOP · Gold + Teal", signature: "Gold + teal", look: "Polished gold + teal contrast, glowing ornaments and rich fabric detail.", credit: "Memoirs of Geisha" },
  { name: "Seamus McGarvey", role: "DOP · Warm Light", signature: "Warm light", look: "Soft warm light, gentle glow on face and fabric, tender devotional mood.", credit: "Atonement" },
  { name: "OTT DOP Collective", role: "Netflix · HBO · Disney+ · Apple TV · Nat Geo · BBC Earth", signature: "Premium streaming DOP styles", look: "Clean streaming finish: Netflix polish, HBO depth, Disney+ warmth, Apple TV clarity, Nat Geo natural detail, BBC Earth scale.", credit: "OTT Premium Ultra standard" },
];

function dopMixFor(n: number): string {
  if (n === 30) return "Nolan + Hoyte van Hoytema IMAX + Deakins Volumetric + Lubezki Natural Light + Greig Fraser Haze — all combined";
  if (n >= 21) return "Nolan / Hoyte van Hoytema IMAX · Deakins Volumetric · Lubezki Natural Light · Greig Fraser Haze";
  if (n === 20) return "Nolan / Hoyte van Hoytema IMAX · Deakins Volumetric · Lubezki Natural Light";
  if (n === 19) return "Nolan / Hoyte van Hoytema IMAX · Deakins Volumetric";
  if (n === 18) return "Christopher Nolan / Hoyte van Hoytema IMAX style · Deakins Volumetric touch";
  if (n >= 11) return "Deakins-inspired volumetric · warm gold reference";
  return "Clean cinematic reference · Deakins-inspired soft light";
}

/* ---------- Beyond OTT: Choreographer / Cinematographer / Photographer / Motion ---------- */

type ChoreoSpec = { classical: string; bollywood: string; focus: string; tempo: string };
function choreoFor(n: number): ChoreoSpec {
  if (n === 30) return {
    classical: "Bharatanatyam / Kathak mudras, Temple dance, Aarti movement, Pradakshina circular movement",
    bollywood: "Saroj Khan grace + Prabhu Deva energy, held back to slow devotional grace — no fast jump cuts",
    focus: "Slow divine grace + circular pradakshina + hand mudra detail",
    tempo: "Slow · continuous · reverent",
  };
  if (n >= 18) return {
    classical: "Bharatanatyam / Kathak mudras, Temple dance, Aarti movement, Pradakshina circular movement",
    bollywood: "Saroj Khan grace · Prabhu Deva energy · Remo D'Souza flow · Ganesh Acharya bhakti steps",
    focus: "Graceful Aarti + Pradakshina circle, clear mudra detail, controlled devotional energy",
    tempo: "Slow–medium · flowing",
  };
  if (n >= 11) return {
    classical: "Temple dance gesture + Aarti movement, simple mudra detail",
    bollywood: "Saroj Khan grace · Ganesh Acharya bhakti steps, light devotional flow",
    focus: "Gentle Aarti movement, readable hand gestures",
    tempo: "Gentle · flowing",
  };
  return {
    classical: "Simple Temple dance gesture, Aarti movement reference",
    bollywood: "Soft devotional flow, grace over speed",
    focus: "Calm standing gesture, soft Aarti sway",
    tempo: "Calm · still",
  };
}

type CineSpec = { masters: string; moves: string; focus: string };
function cineFor(n: number): CineSpec {
  if (n === 30) return {
    masters: "Nolan / Hoyte van Hoytema IMAX · Deakins volumetric · Lubezki natural light · Greig Fraser haze",
    moves: "Dolly-in · Crane up · Steadicam circle · 360 orbit · Slow push-in · Rack focus · Golden hour · God-ray tracking",
    focus: "360 orbit + slow dolly-in + crane up combined",
  };
  if (n >= 18) return {
    masters: "Nolan / Hoyte van Hoytema IMAX · Deakins volumetric · Lubezki natural light",
    moves: "Dolly-in · Crane up · Steadicam circle · Slow push-in · Rack focus · Golden hour · God-ray tracking",
    focus: "Slow push-in + Steadicam circle, gentle crane up",
  };
  if (n >= 11) return {
    masters: "Deakins-inspired volumetric · warm gold reference",
    moves: "Slow push-in · Dolly-in · Rack focus · Golden hour",
    focus: "Slow push-in, soft rack focus to face",
  };
  return {
    masters: "Clean cinematic reference · Deakins-inspired soft light",
    moves: "Slow push-in · Golden hour",
    focus: "Calm slow push-in",
  };
}

type PhotoSpec = { portrait: string; temple: string; focus: string };
function photoFor(n: number): PhotoSpec {
  if (n === 30) return {
    portrait: "Rembrandt light · Butterfly light · Split light · Catchlight in eyes",
    temple: "Low angle · Symmetry · Leading lines · Reflection in water · Silhouette at sunset",
    focus: "Low angle symmetry + water reflection + Rembrandt face light",
  };
  if (n >= 18) return {
    portrait: "Rembrandt light · Butterfly light · Catchlight in eyes",
    temple: "Low angle · Symmetry · Leading lines · Reflection in water",
    focus: "Low angle symmetry + Rembrandt face light, water reflection where possible",
  };
  if (n >= 11) return {
    portrait: "Rembrandt light · Catchlight in eyes",
    temple: "Symmetry · Leading lines · Low angle",
    focus: "Symmetry + Rembrandt face light",
  };
  return {
    portrait: "Soft portrait light · Catchlight in eyes",
    temple: "Symmetry · Leading lines",
    focus: "Soft symmetry, clear face light",
  };
}

type MotionSpec = { subject: string; camera: string; light: string; particle: string; duration: string; loop: string; fps: string; styles: string };
function motionFor(n: number): MotionSpec {
  if (n === 30) return {
    subject: "Slow divine grace — Aarti sway, Pradakshina circle, mudra detail, fabric drifting in still air",
    camera: "Slow Divine Drift + Cinematic Orbit 360 — slow dolly-in, crane up, 360 orbit combined",
    light: "God-Ray Pulse — golden god-rays breathing slowly, diya flicker, warm rim glow",
    particle: "Petal Fall + Gold Dust Float — marigold petals falling, gold dust drifting, mist flowing",
    duration: "10 sec", loop: "Seamless loop", fps: "24fps cinematic",
    styles: "Slow Divine Drift + Cinematic Orbit 360 + God-Ray Pulse + Petal Fall + Gold Dust Float",
  };
  if (n >= 18) return {
    subject: "Graceful Aarti + Pradakshina circle, mudra detail, fabric drifting",
    camera: "Slow Divine Drift + Cinematic Orbit 360 — slow push-in, Steadicam circle, gentle crane up",
    light: "God-Ray Pulse — golden god-rays pulsing slowly, Diya Flicker",
    particle: "Petal Fall + Gold Dust Float + Mist Flow",
    duration: "8–10 sec", loop: "Seamless loop", fps: "24fps cinematic",
    styles: "Slow Divine Drift + Cinematic Orbit 360 + God-Ray Pulse + Petal Fall + Mist Flow",
  };
  if (n >= 11) return {
    subject: "Gentle Aarti sway, readable mudra gesture",
    camera: "Slow Divine Drift — slow push-in",
    light: "Soft God-Ray Pulse, Diya Flicker",
    particle: "Mist Flow + Gold Dust Float",
    duration: "6–8 sec", loop: "Loop", fps: "24fps",
    styles: "Slow Divine Drift + Mist Flow + Diya Flicker",
  };
  return {
    subject: "Calm standing gesture, soft Aarti sway",
    camera: "Slow push-in",
    light: "Soft warm light, gentle diya glow",
    particle: "Light Mist Flow",
    duration: "5–6 sec", loop: "Loop", fps: "24fps",
    styles: "Slow Divine Drift",
  };
}

/* ---------- Colour Combination / Ornaments Clarity / Thumbnail CTR ---------- */

type ColourSpec = { primary: string; levelScale: string };
function colourFor(n: number): ColourSpec {
  if (n === 30) return { primary: "Deep Teal + Rich Gold — main L30 grade, layered with Maroon + Ivory", levelScale: "L30 · Deep Teal + Rich Gold + Maroon + Ivory layered — full layered grade" };
  if (n >= 18) return { primary: "Deep Teal + Rich Gold — main OTT grade", levelScale: "L18+ · Deep Teal + Rich Gold — full OTT grade" };
  if (n >= 11) return { primary: "Teal + Gold emerging — warm gold, soft teal shadows", levelScale: "L11–L17 · Teal + Gold emerging" };
  if (n >= 6) return { primary: "Warm gold + soft teal hints", levelScale: "L6–L10 · Warm gold + soft teal hints" };
  return { primary: "Basic colours — neutral warm, light gold accents", levelScale: "L1–L5 · Basic colours" };
}

const secondaryCombos = [
  { name: "Maroon + Gold", swatchA: "#7a1f2b", swatchB: "#d4af37", use: "Festival / Veer moments, rich borders" },
  { name: "Royal Blue + Gold", swatchA: "#1d3a8a", swatchB: "#d4af37", use: "Night sky, divine depth" },
  { name: "Ivory Cream + Gold", swatchA: "#f5ead0", swatchB: "#d4af37", use: "Soft, sacred, Shant moments" },
  { name: "Emerald Green + Gold", swatchA: "#0b6b4a", swatchB: "#d4af37", use: "Nature, temple gardens" },
  { name: "Saffron + White + Gold", swatchA: "#f59e0b", swatchB: "#fdfbf3", use: "Saffron glow, pure devotional light" },
];

type OrnamentSpec = { detailer: string; crown: string; jewellery: string; mala: string; fabric: string };
function ornamentFor(n: number): OrnamentSpec {
  if (n === 30) return {
    detailer: "Face Detailer + Jewellery Detailer Max — ON",
    crown: "Sharp gold detail, stones, peacock feather clear",
    jewellery: "Necklace, Earrings, Armlets, Bangles — each sharp, no melting, no extra fingers / hands",
    mala: "Rudraksha / Tulsi / Lotus beads — clear count",
    fabric: "Saree / Dhoti weave, border gold zari clear",
  };
  if (n >= 18) return {
    detailer: "Face Detailer + Jewellery Detailer ON",
    crown: "Sharp gold detail, stones, peacock feather clear",
    jewellery: "Necklace, Earrings, Armlets, Bangles — each sharp, no melting, no extra fingers / hands",
    mala: "Rudraksha / Tulsi / Lotus beads — clear count",
    fabric: "Saree / Dhoti weave, border gold zari clear",
  };
  if (n >= 11) return {
    detailer: "Face Detailer + Jewellery Detailer Medium",
    crown: "Gold detail clear, stones readable",
    jewellery: "Necklace, Earrings, Armlets, Bangles — sharp, check hands",
    mala: "Rudraksha / Tulsi / Lotus beads — readable",
    fabric: "Saree / Dhoti weave, gold zari border readable",
  };
  return {
    detailer: "Face Detailer + Jewellery Detailer Basic / Low",
    crown: "Gold detail simple, keep crown readable",
    jewellery: "Necklace, Earrings, Armlets, Bangles — keep sharp, check hands",
    mala: "Rudraksha / Tulsi / Lotus beads — simple, readable",
    fabric: "Saree / Dhoti weave, gold zari border simple",
  };
}

const ornamentChecklist = [
  "Crown clear?",
  "Jewellery sharp?",
  "Hands correct?",
  "Eyes clear?",
];

type CtrSpec = { score: number; target: string; face: string; contrast: string; focus: string; curiosity: string };
function ctrFor(n: number): CtrSpec {
  if (n === 30) return { score: 10, target: "L30 CTR target 9+", face: "Close-up, eye contact, clear expression — Shant / Prem / Veer", contrast: "Gold title on dark teal, white outline, big readable title", focus: "One main subject, not crowded — 3-second rule", curiosity: "Question / Leela moment — e.g. Dhanush Bhang, Govardhan" };
  if (n >= 21) return { score: 9, target: "CTR target 9+", face: "Close-up, eye contact, clear expression — Shant / Prem / Veer", contrast: "Gold title on dark teal, white outline, big readable title", focus: "One main subject, not crowded — 3-second rule", curiosity: "Question / Leela moment — e.g. Dhanush Bhang, Govardhan" };
  if (n >= 18) return { score: 8, target: "CTR target 8+", face: "Close-up, eye contact, clear expression — Shant / Prem / Veer", contrast: "Gold title on dark teal, white outline, big readable title", focus: "One main subject, not crowded — 3-second rule", curiosity: "Question / Leela moment" };
  if (n >= 11) return { score: 7, target: "CTR target 7+", face: "Close-up, eye contact, clear expression", contrast: "Gold title on dark teal, big readable title", focus: "One main subject — 3-second rule", curiosity: "Leela moment" };
  if (n >= 6) return { score: 6, target: "CTR target 6+", face: "Clear face, eye contact", contrast: "Gold title on dark teal", focus: "One main subject", curiosity: "Simple curiosity hook" };
  return { score: 5, target: "CTR target 5+", face: "Clear face", contrast: "Readable title", focus: "One main subject", curiosity: "Simple hook" };
}

/* ---------- ALWAYS UNIQUE VARIATION — NEVER GHISA PITA ---------- */

type VariationSpec = { angle: string; pose: string; light: string; background: string; title: string; scene: string };
const variationAngles = [
  "Low angle — temple rises behind the subject",
  "High crane angle — diyas and courtyard seen from above",
  "Three-quarter angle — face turned slightly toward the light",
  "Eye-level close angle — direct eye contact, intimate prayer",
  "Side profile angle — silhouette against god-ray and temple pillars",
  "Over-the-shoulder diya angle — flame in foreground, face beyond",
];
const variationPoses = [
  "Standing Aarti — both hands holding the diya plate, eyes lowered",
  "Seated prayer — folded hands, head gently bowed, marigold in lap",
  "Walking Pradakshina — mid-step, fabric in motion, one hand raised in blessing",
  "Flute held to the lips — eyes half-closed, head tilted in melody",
  "Bow drawn in calm focus — steady stance, gaze fixed ahead",
  "One hand in blessing mudra — other hand holding lotus, calm and still",
];
const variationLights = [
  "Yamuna sunrise — soft pink-gold light from the left, cool teal shadows",
  "Vrindavan evening — deep amber glow, diya light on the face",
  "Kadamb tree night — moonlight + diya glow, dark teal sky",
  "Golden-hour temple doorway — warm beam across the face",
  "Monsoon-cloud light — soft diffused silver-gold, wet stone shine",
  "Pre-dawn temple — deep blue-teal dark, one warm god-ray",
];
const variationBackgrounds = [
  "Yamuna ghat at sunrise — water reflection, boats, soft mist",
  "Vrindavan evening street — temple towers, hanging lamps, marigold stalls",
  "Kadamb tree at night — branches, fireflies, moon and dark water",
  "Grand temple mandapa — carved pillars, hanging diyas, incense mist",
  "Forest grove — peacock feather, kadamb leaves, dappled light",
  "Temple steps in rain — wet stone, reflections, scattered petals",
];
const variationTitles = [
  "Title TOP Centre large, face centre-middle below",
  "Title TOP Centre small, below IBD, face large centre",
  "Title TOP Centre with gold divider, face centre-middle",
  "Title TOP Right small gold, face left of centre",
  "Title TOP Left below IBD, face right of centre",
  "Title TOP Centre, two lines English + Devanagari, face centre-middle",
];
function variationFor(n: number): VariationSpec {
  const i = (n - 1) % 6;
  const j = (n + 1) % 6;
  const k = (n + 2) % 6;
  return {
    angle: variationAngles[i],
    pose: variationPoses[j],
    light: variationLights[k],
    background: variationBackgrounds[(n + 3) % 6],
    title: variationTitles[(n + 4) % 6],
    scene: n === 30
      ? "Krishna flute — this time Kadamb tree night, moonlight + diya glow, a variation never used before"
      : n % 3 === 0
        ? "Krishna flute — Yamuna sunrise variation"
        : n % 3 === 1
          ? "Krishna flute — Vrindavan evening variation"
          : "Krishna flute — Kadamb tree night variation",
  };
}

const variationChecklist = [
  { q: "Angle unique?", detail: "Naya angle — low, high, three-quarter, profile ya diya foreground. Pichhle poster jaisa angle nahi." },
  { q: "Pose unique?", detail: "Naya pose — Aarti, seated prayer, Pradakshina, flute, blessing mudra. Same pose repeat nahi." },
  { q: "Light unique?", detail: "Naya light — sunrise, evening, night, golden hour, monsoon ya pre-dawn. Same light repeat nahi." },
  { q: "Background unique?", detail: "Naya background detail — Yamuna, Vrindavan, Kadamb tree, mandapa, grove ya rain steps." },
  { q: "Title placement unique?", detail: "Naya TOP title placement - TOP Centre / TOP Right / TOP Left below IBD. Bottom title kabhi nahi." },
];

const variationExamples = [
  { title: "Krishna flute — 1", detail: "Yamuna sunrise · water reflection · soft pink-gold light" },
  { title: "Krishna flute — 2", detail: "Vrindavan evening · temple towers · deep amber diya glow" },
  { title: "Krishna flute — 3", detail: "Kadamb tree night · moonlight + diya · fireflies · kabhi same nahi" },
  { title: "Ram · Krishna · Dashavatar", detail: "Har avatar / har scene me alag variation — alag angle, pose, light, background." },
];

/* ---------- COMPLETED: AUDIO / VOICEOVER / EDITING / LUT / TITLE / EXPORT / STORYBOARD ---------- */
type AudioSpec = { instruments: string; base: string; sfx: string; mix: string; loop: string };
function audioFor(d: DeityEntry): AudioSpec {
  const base = "Bhakti background music: Flute + Tabla + Tanpura soft · No loud beats · No copyrighted Bollywood · Music volume: Voice 80% / Music 20% · Loop clean · No abrupt cut";
  if (d.id.includes("shiv") || d.id.includes("shakti")) return { instruments: "Damru + Om chant soft + Tanpura", base, sfx: "Damru soft · Diya · Bell · Petal", mix: "Voice 80% / Music 20%", loop: "Loop clean · No abrupt cut" };
  if (d.id.includes("ram")) return { instruments: "Sitar + Dholak soft + Tanpura", base, sfx: "Dholak soft · Diya · Bell · Petal", mix: "Voice 80% / Music 20%", loop: "Loop clean · No abrupt cut" };
  if (d.id.includes("krishna")) return { instruments: "Bansuri + Tabla + Tanpura", base, sfx: "Bansuri · Diya · Bell · Petal", mix: "Voice 80% / Music 20%", loop: "Loop clean · No abrupt cut" };
  if (d.id.includes("vishnu") || d.id.includes("lakshmi")) return { instruments: "Shankh + Harmonium soft + Tanpura", base, sfx: "Shankh soft · Diya · Bell · Petal", mix: "Voice 80% / Music 20%", loop: "Loop clean · No abrupt cut" };
  return { instruments: "Flute + Tabla + Tanpura soft", base, sfx: "Flute · Diya · Bell · Petal", mix: "Voice 80% / Music 20%", loop: "Loop clean · No abrupt cut" };
}
type LutPreset = { id: string; name: string; grade: string; forDeity: string; detail: string };
const lutPresets: LutPreset[] = [
  { id: "teal-gold", name: "Teal+Gold Cinematic", grade: "Teal+Gold", forDeity: "Default for all IBD", detail: "Deep teal shadows, rich gold light — the house grade for every Indian Bhakti Dhara poster and video." },
  { id: "ayodhya", name: "Warm Ayodhya", grade: "Saffron+Gold", forDeity: "Ram", detail: "Warm saffron glow + gold — dignified, luminous Ayodhya palace light." },
  { id: "kailash", name: "Cool Kailash", grade: "White+Teal", forDeity: "Shiv", detail: "Cool white moonlight + teal — calm, still Kailash snow and night sky." },
  { id: "vrindavan", name: "Vrindavan", grade: "Peacock Blue+Gold", forDeity: "Krishna", detail: "Peacock blue + gold — playful, tender Vrindavan golden-hour glow." },
  { id: "ksheer", name: "Ksheer Sagar", grade: "Deep Teal+Pink", forDeity: "Vishnu", detail: "Deep teal ocean + soft pink lotus — serene, abundant Ksheer Sagar light." },
];
function lutFor(d: DeityEntry, overrideId?: string): LutPreset {
  if (overrideId) return lutPresets.find(l => l.id === overrideId) ?? lutPresets[0];
  if (d.id.includes("ram")) return lutPresets[1];
  if (d.id.includes("shiv") || d.id.includes("shakti")) return lutPresets[2];
  if (d.id.includes("krishna")) return lutPresets[3];
  if (d.id.includes("vishnu") || d.id.includes("lakshmi")) return lutPresets[4];
  return lutPresets[0];
}
type LengthOption = { id: string; label: string; seconds: number; words: string; wordCount: number; durations: number[] };
const lengthOptions: LengthOption[] = [
  { id: "30s", label: "Shorts · 30 sec", seconds: 30, words: "70–80 words max", wordCount: 75, durations: [5, 10, 10, 5] },
  { id: "1min", label: "Shorts / Reels · 1 min", seconds: 60, words: "140–150 words", wordCount: 145, durations: [10, 20, 20, 10] },
  { id: "5min", label: "Long video · 5 min", seconds: 300, words: "700 words", wordCount: 700, durations: [60, 90, 90, 60] },
];
const languageOptions = [
  { id: "Hindi", label: "Hindi", hint: "हिन्दी — calm devotional narration" },
  { id: "English", label: "English", hint: "English — calm devotional narration" },
  { id: "Hinglish", label: "Hinglish", hint: "Hinglish — Hindi + English, warm and clear" },
];
function voiceoverFor(language: string, len: LengthOption, d: DeityEntry) {
  const hook = language === "Hindi" ? `Hook (3 sec): ${d.name} ki is katha me ek pal ruk jaiye — yahi pal aapka din badal sakta hai.`
    : language === "Hinglish" ? `Hook (3 sec): ${d.name} ki story me ek pal rukiye — this one moment can change your whole day.`
    : `Hook (3 sec): Pause for one moment with ${d.name} — this one moment can change your whole day.`;
  const story = language === "Hindi" ? `Story / Teaching: ${d.nature}. ${d.pose} Is drishya me shraddha, shanti aur prem — ek hi bhav me bandha hua hai.`
    : language === "Hinglish" ? `Story / Teaching: ${d.nature}. ${d.pose} Is scene me shraddha, shanti aur prem — all in one calm feeling.`
    : `Story / Teaching: ${d.nature}. ${d.pose} In this scene, faith, peace and love rest in one calm feeling.`;
  const shloka = language === "Hindi" ? `Shloka / Mantra: Man se boliye — “Govinday Namo Namah”.`
    : language === "Hinglish" ? `Shloka / Mantra: Dil se boliye — “Govinday Namo Namah”.`
    : `Shloka / Mantra: Say it from the heart — “Govinday Namo Namah”.`;
  const cta = language === "Hindi" ? `CTA: Comment me likhiye “Govinday Namo Namah” aur is bhakti ko aage badhaiye.`
    : language === "Hinglish" ? `CTA: Comment me likhiye “Govinday Namo Namah” and share this bhakti ahead.`
    : `CTA: Comment “Govinday Namo Namah” and share this devotion ahead.`;
  return { hook, story, shloka, cta, style: "Calm, Divine, Slow, Clear · Not fast · Not AI robotic", words: len.words, format: "Hook 3 sec + Story / Teaching + Shloka / Mantra + CTA" };
}
function exportFor(p: Platform) {
  if (p.id === "yt-video") return { label: "YouTube Video", size: "1920x1080", ratio: "16:9", fps: "24fps", codec: "MP4 H.264 · Audio AAC", thumb: "Thumbnail 16:9 · Title TOP" };
  if (p.id === "yt-shorts") return { label: "YouTube Shorts", size: "1080x1920", ratio: "9:16", fps: "30fps", codec: "MP4 H.264 · Audio AAC", thumb: "Thumbnail 9:16 · Title TOP" };
  if (p.id === "ig-reels") return { label: "Instagram Reels", size: "1080x1920", ratio: "9:16", fps: "30fps", codec: "MP4 H.264 · Audio AAC", thumb: "Thumbnail 9:16 · Title TOP" };
  if (p.id === "ig-post") return { label: "Instagram / Threads Post", size: "1080x1080", ratio: "1:1", fps: "30fps", codec: "MP4 H.264 · Audio AAC", thumb: "Thumbnail 1:1 · Title TOP" };
  if (p.id === "ig-portrait") return { label: "Instagram / Threads Portrait", size: "1080x1350", ratio: "4:5", fps: "30fps", codec: "MP4 H.264 · Audio AAC", thumb: "Thumbnail 4:5 · Title TOP" };
  return { label: "Instagram Story / WhatsApp Status", size: "1080x1920", ratio: "9:16", fps: "30fps", codec: "MP4 H.264 · Audio AAC", thumb: "Thumbnail 9:16 · Title TOP" };
}
type Scene = { no: number; visual: string; voiceover: string; music: string; duration: number; title: string };
function storyboardFor(d: DeityEntry, p: Platform, len: LengthOption, vo: ReturnType<typeof voiceoverFor>, audio: AudioSpec): Scene[] {
  if (d.id === "ram-darbar" && len.id === "30s") return [
    { no: 1, visual: "Scene 1 — Ayodhya Mahal: palace steps, diyas, layered nebula, warm temple gold", voiceover: vo.hook, music: audio.instruments, duration: 5, title: "Title TOP" },
    { no: 2, visual: "Scene 2 — Ram–Sita: standing together centre, holding hands, Ram blessing mudra, Lakshman behind side with Dhanush", voiceover: vo.story, music: audio.instruments, duration: 10, title: "Title TOP" },
    { no: 3, visual: "Scene 3 — Hanuman kneel: Hanuman kneels in front, folded hands, Gada beside, calm devotion", voiceover: vo.shloka, music: audio.instruments, duration: 10, title: "Title TOP" },
    { no: 4, visual: "Scene 4 — CTA: full Darbar, gold dust, god-ray pulse, petals falling, calm closing frame", voiceover: vo.cta, music: audio.instruments, duration: 5, title: "Title TOP" },
  ];
  const visuals = [
    `Scene 1 — Establishing: ${d.background}. One clear main subject, diyas glowing, title TOP.`,
    `Scene 2 — Main darshan: ${d.pose} Placement: ${d.placement}`,
    `Scene 3 — Close devotion: face detail, eyes clear, ornaments sharp — ${d.ornaments}`,
    `Scene 4 — Closing / CTA: full frame, gold dust + god-ray pulse, calm closing, title TOP.`,
  ];
  const lines = [vo.hook, vo.story, vo.shloka, vo.cta];
  return visuals.map((visual, i) => ({ no: i + 1, visual, voiceover: lines[i], music: audio.instruments, duration: len.durations[i], title: "Title TOP" }));
}
const completedItems = [
  { title: "Audio / Music", detail: "Deity-matched instruments · Voice 80% / Music 20% · Clean loop" },
  { title: "Voiceover / Dialogue", detail: "Hindi / English / Hinglish · Calm Divine · Hook + Story + Shloka + CTA" },
  { title: "Editing / Pacing", detail: "Slow divine drift · Fade / Dissolve · Slow Zoom · Gold Dust" },
  { title: "Colour LUT", detail: "5 presets · Auto-matched to deity · Teal+Gold default" },
  { title: "Title Animation", detail: "Gold fade-in from top · Slow scale 95% → 100% · Sparkle" },
  { title: "Platform Export", detail: "MP4 H.264 · AAC · Correct size + fps per platform" },
  { title: "Storyboard / Script", detail: "Scene | Visual | Voiceover | Music | Duration | Title TOP" },
];

const choreoMasters = [
  { name: "Classical — Bharatanatyam / Kathak", detail: "Mudras, Temple dance, Aarti movement, Pradakshina circular movement. Hands tell the prayer; the body follows the circle." },
  { name: "Saroj Khan", detail: "Grace — soft hand lines, expressive eyes, devotional elegance without hurry." },
  { name: "Prabhu Deva", detail: "Energy — controlled, rhythmic footwork and flow, held to a devotional tempo at L30." },
  { name: "Remo D'Souza", detail: "Flow — smooth transitions, circular camera-friendly movement, continuous lines." },
  { name: "Ganesh Acharya", detail: "Bhakti steps — grounded, mass devotional rhythm, temple-crowd movement." },
];

const cineMoves = [
  { name: "Dolly-in", detail: "Slow forward move into the face — devotion grows closer, never rushed." },
  { name: "Crane up", detail: "Lift from diya level to temple scale — small prayer to vast sacred space." },
  { name: "Steadicam circle", detail: "Smooth walk around the subject — Pradakshina in camera language." },
  { name: "360 orbit", detail: "Full orbit around the deity / devotee — the signature L30 move." },
  { name: "Slow push-in", detail: "Gentle, continuous push — eyes stay sharp, bokeh stays golden." },
  { name: "Rack focus", detail: "Focus travels diya → face → temple — one prayer, three planes." },
  { name: "Golden hour", detail: "Warm low sun, long shadows, glowing skin and gold ornaments." },
  { name: "God-ray tracking", detail: "Camera follows the beam — volumetric light leads the eye." },
];

const photoTechniques = [
  { name: "Rembrandt light", group: "Portrait", detail: "Triangle of light on the shadow cheek — sculpted, reverent face." },
  { name: "Butterfly light", group: "Portrait", detail: "Light from above, soft shadow under the nose — symmetrical, divine." },
  { name: "Split light", group: "Portrait", detail: "Half light / half shadow — drama held inside devotion." },
  { name: "Catchlight in eyes", group: "Portrait", detail: "One bright reflection in each eye — the face stays alive." },
  { name: "Low angle", group: "Temple", detail: "Camera below the subject — the temple rises, the figure feels divine." },
  { name: "Symmetry", group: "Temple", detail: "Centred composition — gopuram, diya and face on one axis." },
  { name: "Leading lines", group: "Temple", detail: "Pillars, steps and lamps guide the eye to the face." },
  { name: "Reflection in water", group: "Temple", detail: "Temple and diyas mirrored in water — prayer doubled." },
  { name: "Silhouette at sunset", group: "Temple", detail: "Dark figure against gold sky — devotion in outline." },
];

const motionStyles = [
  { name: "Slow Divine Drift", detail: "The whole frame breathes slowly forward — calm, continuous, never a jump." },
  { name: "Cinematic Orbit 360", detail: "Camera circles the subject in one slow, seamless orbit." },
  { name: "God-Ray Pulse", detail: "Golden god-rays brighten and soften in a slow pulse, like breath." },
  { name: "Petal Fall", detail: "Marigold petals fall through the frame, catching the light." },
  { name: "Mist Flow", detail: "Incense mist drifts across the frame, softening edges." },
  { name: "Water Ripple", detail: "Reflections shimmer — temple, diyas and face ripple gently." },
  { name: "Diya Flicker", detail: "Flame light flickers warmly on face, gold and fabric." },
  { name: "Gold Dust Float", detail: "Gold dust floats upward, sparkling in the god-ray." },
  { name: "Time-lapse Temple", detail: "Clouds and light move over the temple while the prayer stays still." },
  { name: "Parallax Depth", detail: "Foreground diyas, subject and temple move at different speeds — real depth." },
];

const names = [
  "Basic Draft","Soft Draft","Clean Draft","Stable Draft","Refined Draft",
  "Cinematic Draft","Premium Draft","Ultra Draft","Pro Draft","Signature Draft",
  "OTT Ready","OTT Premium","OTT Ultra","Cinematic Premium","Festival Ready",
  "Theatrical Draft","Final Draft","Minimum for Posting","Old Top","New Top",
  "Beyond Top","Master Tier","Grand Master","Divine Tier","Celestial Tier",
  "Eternal Tier","Supreme Tier","Ultimate Tier","Near Infinity","Infinity Final Top",
];
const hindiNames = [
  "आरंभ","कोमल आरंभ","स्वच्छ आरंभ","स्थिर आरंभ","परिष्कृत",
  "सिनेमाई","प्रीमियम","अल्ट्रा","प्रो","सिग्नेचर",
  "ओटीटी रेडी","ओटीटी प्रीमियम","ओटीटी अल्ट्रा","सिनेमाई प्रीमियम","फेस्टिवल रेडी",
  "थिएट्रिकल","अंतिम ड्राफ्ट","पोस्टिंग के लिए न्यूनतम","पुराना टॉप","नया टॉप",
  "टॉप से आगे","मास्टर","ग्रैंड मास्टर","दिव्य","आकाशीय",
  "शाश्वत","सर्वोच्च","अल्टीमेट","अनंत के निकट","अनंत — अंतिम टॉप",
];
const resolutions = ["720p","720p","720p","1080p","1080p","1080p","1080p","2K","2K","2K","2K","4K","4K","4K","4K","4K","4K","6K","6K","8K","8K","8K","8K","10K","10K","12K","12K","12K","12K","12K+"];
const samplers = [
  "Euler","Euler","Euler a","Euler a","Euler a","DPM++ 2M","DPM++ 2M","DPM++ 2M Karras",
  "DPM++ 2M Karras","DPM++ 2M SDE Karras","DPM++ 2M SDE Karras","DPM++ 2M SDE Karras",
  "DPM++ 3M SDE Karras","DPM++ 3M SDE Karras","DPM++ 3M SDE Karras","DPM++ 3M SDE Karras",
  "DPM++ 3M SDE Karras","DPM++ 3M SDE Karras + UniPC","DPM++ 3M SDE Karras + UniPC","DPM++ 3M SDE Karras + UniPC",
  "DPM++ 3M SDE Karras + UniPC + Euler a","DPM++ 3M SDE Karras + UniPC + Euler a","DPM++ 3M SDE Karras + UniPC + Euler a",
  "DPM++ 3M SDE Karras + UniPC + Euler a","DPM++ 3M SDE Karras + UniPC + Euler a",
  "DPM++ 3M SDE Karras + UniPC + Euler a","DPM++ 3M SDE Karras + UniPC + Euler a",
  "DPM++ 3M SDE Karras + UniPC + Euler a","DPM++ 3M SDE Karras + UniPC + Euler a",
  "DPM++ 3M SDE Karras + UniPC + Euler a Mix",
];
const stepsArr = [20,22,24,26,28,30,32,35,38,40,45,50,55,60,65,70,75,80,85,90,95,100,102,105,108,110,112,115,118,120];
const cfgArr = ["5.0","5.2","5.4","5.6","5.8","6.0","6.2","6.5","6.8","7.0","7.2","7.5","7.7","8.0","8.2","8.4","8.6","8.8","9.0","9.2","9.3","9.5","9.6","9.7","9.8","9.9","9.9","10.0","10.0","10.0"];
const loraArr = ["0.0","0.1","0.2","0.3","0.4","0.5","0.6","0.65","0.7","0.75","0.8","0.85","0.9","0.95","1.0","1.05","1.1","1.15","1.2","1.25","1.28","1.3","1.35","1.4","1.42","1.45","1.47","1.48","1.5","1.5"];
const dopArr = [
  "Basic DOP","Basic DOP","Clean DOP","Clean DOP","Cinematic DOP","Cinematic DOP","Cinematic DOP +","Premium DOP",
  "Premium DOP","Premium DOP +","OTT DOP","OTT DOP +","OTT DOP +","Netflix DOP","Netflix + HBO DOP",
  "Netflix + HBO DOP","Netflix + HBO DOP","Netflix + HBO + Disney+ DOP","Netflix + HBO + Disney+ DOP","Netflix + HBO + Disney+ + Apple TV DOP",
  "Netflix + HBO + Disney+ + Apple TV DOP","Netflix + HBO + Disney+ + Apple TV + Nat Geo DOP","Netflix + HBO + Disney+ + Apple TV + Nat Geo DOP",
  "Netflix + HBO + Disney+ + Apple TV + Nat Geo DOP","Netflix + HBO + Disney+ + Apple TV + Nat Geo + BBC Earth DOP","Netflix + HBO + Disney+ + Apple TV + Nat Geo + BBC Earth DOP",
  "Netflix + HBO + Disney+ + Apple TV + Nat Geo + BBC Earth DOP","Netflix + HBO + Disney+ + Apple TV + Nat Geo + BBC Earth DOP","Netflix + HBO + Disney+ + Apple TV + Nat Geo + BBC Earth DOP",
  "Netflix + HBO + Disney+ + Apple TV + Nat Geo + BBC Earth DOP",
];
const moodArr = [
  "Calm Devotional Mood","Calm Devotional Mood","Soft Temple Mood","Soft Temple Mood","Warm Bhakti Mood","Warm Bhakti Mood","Warm Bhakti Mood +","Divine Golden Mood",
  "Divine Golden Mood","Divine Golden Mood +","Sacred Glow Mood","Sacred Glow Mood","Sacred Glow Mood +","Majestic Temple Mood","Majestic Temple Mood","Majestic Temple Mood +","Eternal Bhakti Mood","Eternal Bhakti Mood",
  "Eternal Bhakti Mood +","Divine Aura Mood","Divine Aura Mood","Celestial Devotion Mood","Celestial Devotion Mood","Celestial Devotion Mood +","Cosmic Bhakti Mood",
  "Cosmic Bhakti Mood","Cosmic Bhakti Mood +","Infinity Divine Mood","Infinity Divine Mood","Infinity Divine Mood · Moog Lighting Max",
];

function expandedFor(n: number): Expanded {
  if (n === 30) return {
    body: "IMAX", shutter: "1/50", angle: "180°", lens: "35mm + 85mm mix", focal: "35mm + 85mm",
    aperture: "f/1.4 – f/2.8", iso: "25", wb: "5600K Warm Gold", dof: "Shallow Cinematic", bokeh: "Golden", focus: "Face Sharp",
    key: "Gold God-Ray", fill: "Teal Soft", rim: "Gold", moog: "ON · Warm Moog Glow Max", godRay: "Golden God-Ray Max", volumetric: "ON · Max",
    practical: "Diya + Temple Lights · Max", nebula: "ON · Cosmic Gold Nebula Max", dust: "Gold Dust Max", mist: "Mist Max",
    goldDust: "Gold Dust Max", smoke: "Smoke / Mist Max", fireGlow: "Fire / Glow Max", water: "Water Reflection ON", bloom: "Bloom Max",
    flare: "Lens Flare Soft", grain: "Film Grain Cinematic", twoD: "2D/3D Full", cgm: "CGM Full", cgi: "CGI Ultra", vfx: "VFX Full",
    face: "Face Detailer Max", adetailer: "ADetailer Max", eyes: "Eyes Detailer Max · ON", hands: "Hands Detailer Max · ON", skin: "Skin Detailer Max · ON", jewellery: "Jewellery Detailer Max · ON",
  };
  if (n <= 5) return {
    body: "Camera Basic", shutter: "1/125", angle: "90°", lens: "50mm", focal: "50mm",
    aperture: "f/8", iso: "400", wb: "5500K Neutral", dof: "Deep · Broad", bokeh: "Soft Minimal", focus: "General Sharp",
    key: "Soft Neutral Key", fill: "Soft Neutral Fill", rim: "Minimal / OFF", moog: "OFF", godRay: "Soft Minimal", volumetric: "OFF",
    practical: "Diya Low", nebula: "OFF", dust: "OFF", mist: "OFF",
    goldDust: "OFF", smoke: "Smoke / Mist OFF", fireGlow: "Fire / Glow OFF", water: "Water Reflection OFF", bloom: "Bloom OFF",
    flare: "Lens Flare OFF", grain: "Film Grain Light", twoD: "2D/3D OFF", cgm: "CGM OFF", cgi: "CGI OFF", vfx: "VFX OFF",
    face: "Face Detailer OFF", adetailer: "ADetailer OFF", eyes: "Eyes Detailer OFF", hands: "Hands Detailer OFF", skin: "Skin Detailer OFF", jewellery: "Jewellery Detailer OFF",
  };
  if (n <= 10) return {
    body: "Standard Cinema Camera", shutter: "1/100", angle: "120°", lens: "50mm", focal: "50mm",
    aperture: "f/5.6", iso: "250", wb: "5500K Warm", dof: "Medium", bokeh: "Soft", focus: "Face Clear",
    key: "Warm Soft Key", fill: "Teal Soft Fill", rim: "Warm Rim Low", moog: "Low", godRay: "Golden God-Ray Soft", volumetric: "Low",
    practical: "Diya Soft", nebula: "OFF", dust: "Dust Particles Low", mist: "Mist Low",
    goldDust: "Particles Gold Dust Low", smoke: "Smoke / Mist Low", fireGlow: "Fire / Glow Low", water: "Water Reflection Low", bloom: "Bloom Low",
    flare: "Lens Flare Low", grain: "Film Grain Light", twoD: "2D/3D Low", cgm: "CGM Low", cgi: "CGI Low", vfx: "VFX Low",
    face: "Face Detailer Low", adetailer: "ADetailer Low", eyes: "Eyes Detailer Basic", hands: "Hands Detailer Basic", skin: "Skin Detailer Basic", jewellery: "Jewellery Detailer Basic",
  };
  if (n <= 17) return {
    body: "Premium Cinema Camera", shutter: "1/80", angle: "150°", lens: "35mm", focal: "35mm",
    aperture: "f/2.8 – f/4", iso: "100–160", wb: "5600K Warm", dof: "Shallow–Medium", bokeh: "Warm Soft", focus: "Face Sharp",
    key: "Gold Soft Key", fill: "Teal Soft Fill", rim: "Gold Soft Rim", moog: "Mid", godRay: "Golden God-Ray Medium", volumetric: "Medium",
    practical: "Diya + Temple Medium", nebula: "Low · Soft Nebula Glow", dust: "Dust Particles Medium", mist: "Mist Medium",
    goldDust: "Particles Gold Dust Medium", smoke: "Smoke / Mist Medium", fireGlow: "Fire / Glow Medium", water: "Water Reflection Medium", bloom: "Bloom Medium",
    flare: "Lens Flare Soft", grain: "Film Grain Cinematic Light", twoD: "2D/3D Medium", cgm: "CGM Medium", cgi: "CGI Medium", vfx: "VFX Mid",
    face: "Face Detailer Medium", adetailer: "ADetailer Medium", eyes: "Eyes Detailer Medium", hands: "Hands Detailer Medium", skin: "Skin Detailer Medium", jewellery: "Jewellery Detailer Medium",
  };
  if (n <= 20) return {
    body: "OTT Cinema Camera", shutter: "1/60", angle: "180°", lens: "35mm + 85mm", focal: "35mm + 85mm",
    aperture: "f/1.8 – f/2.8", iso: "64–80", wb: "5600K Warm Gold", dof: "Shallow Cinematic", bokeh: "Golden Soft", focus: "Face Sharp",
    key: "Gold God-Ray Key", fill: "Teal Soft Fill", rim: "Gold Rim", moog: "High", godRay: "Golden God-Ray Strong", volumetric: "High",
    practical: "Diya + Temple High", nebula: "Mid · Divine Nebula Glow", dust: "Dust Particles High", mist: "Mist High",
    goldDust: "Particles Gold Dust High", smoke: "Smoke / Mist High", fireGlow: "Fire / Glow High", water: "Water Reflection High", bloom: "Bloom High",
    flare: "Lens Flare Soft", grain: "Film Grain Cinematic", twoD: "2D/3D High", cgm: "CGM High", cgi: "CGI High", vfx: "VFX High",
    face: "Face Detailer High", adetailer: "ADetailer High", eyes: "Eyes Detailer High", hands: "Hands Detailer High", skin: "Skin Detailer High", jewellery: "Jewellery Detailer High",
  };
  return {
    body: "Premium OTT · IMAX-Ready Camera", shutter: "1/50", angle: "180°", lens: "35mm + 85mm", focal: "35mm + 85mm",
    aperture: "f/1.4 – f/2.8", iso: "25–50", wb: "5600K Warm Gold", dof: "Shallow Cinematic", bokeh: "Golden", focus: "Face Sharp",
    key: "Gold God-Ray Key Strong", fill: "Teal Soft Fill", rim: "Gold Rim Strong", moog: "Max", godRay: "Golden God-Ray Max", volumetric: "Max",
    practical: "Diya + Temple Max", nebula: "High · Cosmic Nebula", dust: "Dust Particles Max", mist: "Mist Max",
    goldDust: "Particles Gold Dust Ultra", smoke: "Smoke / Mist Ultra", fireGlow: "Fire / Glow Ultra", water: "Water Reflection Ultra", bloom: "Bloom Ultra",
    flare: "Lens Flare Soft", grain: "Film Grain Cinematic", twoD: "2D/3D Ultra", cgm: "CGM Full", cgi: "CGI Ultra", vfx: "VFX Ultra",
    face: "Face Detailer Ultra", adetailer: "ADetailer Ultra", eyes: "Eyes Detailer Ultra", hands: "Hands Detailer Ultra", skin: "Skin Detailer Ultra", jewellery: "Jewellery Detailer Ultra",
  };
}

function buildLevels(): Level[] {
  return Array.from({ length: 30 }, (_, i) => {
    const n = i + 1;
    const exp = expandedFor(n);
    const tier = n <= 17 ? "DRAFT" : n === 18 ? "MINIMUM FOR POSTING" : n === 19 ? "OLD TOP" : n === 20 ? "NEW TOP" : n === 30 ? "INFINITY · FINAL TOP" : "ABOVE TOP";
    return {
      n, name: names[i], hindi: hindiNames[i], tier,
      resolution: resolutions[i], sampler: samplers[i], steps: stepsArr[i], cfg: cfgArr[i],
      lora: loraArr[i], face: exp.face, iso: exp.iso, cgm: exp.cgm, dop: dopArr[i],
      colour: "Deep Teal + Gold",
      lighting: `${exp.key} · ${exp.fill} · ${exp.rim}`,
      vfx: exp.vfx, shutter: exp.shutter, lens: exp.lens, aperture: exp.aperture,
      mood: moodArr[i], nebula: exp.nebula, exp,
      dopMix: dopMixFor(n),
      directorFocus: n >= 18 ? "Fully applied — Beyond OTT Level" : "Reference only — study the look, keep the draft grade lighter",
      note: n <= 17 ? "Use for practice, testing and internal review. Not for final posting."
        : n === 18 ? "The first level cleared for posting. Clean, stable and presentable."
        : n === 19 ? "The previous benchmark. Still strong, now surpassed by L20+."
        : n === 20 ? "The new benchmark for public release."
        : n === 30 ? "The complete standard. Maximum detail, devotion and cinematic finish."
        : "Above the old benchmark. For hero posters and premium release.",
    };
  });
}

function buildPrompt(l: Level, p: Platform, d: DeityEntry, opts?: { language?: string; lengthId?: string; lutId?: string }): string {
  const e = l.exp;
  const audio = audioFor(d);
  const lut = lutFor(d, opts?.lutId);
  const len = lengthOptions.find(x => x.id === (opts?.lengthId ?? "30s")) ?? lengthOptions[0];
  const language = opts?.language ?? "Hindi";
  const vo = voiceoverFor(language, len, d);
  const ex = exportFor(p);
  const scenes = storyboardFor(d, p, len, vo, audio);
  const choreo = choreoFor(l.n);
  const cine = cineFor(l.n);
  const photo = photoFor(l.n);
  const motion = motionFor(l.n);
  const colour = colourFor(l.n);
  const ornament = ornamentFor(l.n);
  const ctr = ctrFor(l.n);
  const variation = variationFor(l.n);
  const dopRef = l.n >= 18
    ? `DIRECTORS & DOP REFERENCE — BEYOND OTT LEVEL — DOP: Christopher Nolan / Hoyte van Hoytema IMAX style, Camera IMAX 65mm, Shutter 1/50 Angle 180°, Lens 35+85mm, Aperture f/1.4-2.8. DOP Mix: ${l.dopMix}. Reference looks: Nolan IMAX practical epic scale · Hoyte van Hoytema natural light golden hour · Deakins soft volumetric teal + gold mist · Lubezki natural light long takes golden glow · Greig Fraser desert haze volumetric epic · Richardson warm gold film grain · Pfister dark + gold · Kaminski desaturated + gold · Beebe gold + teal · McGarvey warm light · OTT DOP: Netflix, HBO, Disney+, Apple TV, Nat Geo, BBC Earth.`
    : `DIRECTORS & DOP REFERENCE — Reference only for this draft level: Deakins-inspired soft volumetric teal + gold, warm gold reference. Full Beyond OTT DOP mix applies from L18.`;
  const craftRef = l.n >= 18
    ? `CHOREOGRAPHER TECHNIQUES — Classical: ${choreo.classical}. Bollywood devotional: ${choreo.bollywood}. Choreography focus: ${choreo.focus}. Tempo: ${choreo.tempo}. For L30: Slow divine grace + circular pradakshina + hand mudra detail, no fast jump cuts.

CINEMATOGRAPHER TECHNIQUES — Masters: ${cine.masters}. Camera moves: ${cine.moves}. Cinematography focus: ${cine.focus}. For L30: 360 orbit + slow dolly-in + crane up combined.

PHOTOGRAPHER TECHNIQUES — Portrait: ${photo.portrait}. Temple: ${photo.temple}. Photography focus: ${photo.focus}. For L30: Low angle symmetry + water reflection + Rembrandt face light.

MOTION PROMPT — Subject motion: ${motion.subject}. Camera motion: ${motion.camera}. Light motion: ${motion.light}. Particle motion: ${motion.particle}. Duration: ${motion.duration}. Loop: ${motion.loop}. Frame rate: ${motion.fps}. Motion styles: ${motion.styles}.`
    : `CHOREOGRAPHER / CINEMATOGRAPHER / PHOTOGRAPHER / MOTION — Reference only for this draft level: gentle Aarti sway, slow push-in, soft symmetry. Full choreographer + cinematographer + photographer + motion prompt applies from L18; the complete combined L30 version applies at L30.`;
  return `${l.n === 30 ? "ULTIMATE MASTER PROMPT — " : ""}L${l.n} ${l.name} · OTT Premium Ultra · Indian Bhakti Dhara · ${l.hindi}
PLATFORM — ${p.name} · Aspect Ratio ${p.ratio} · Resolution ${p.resolution} · Title Placement TOP · Bottom Clean · Safe Zone: ${p.safeZone}

NATURE CONTROL: ${d.name} - ${d.nature} - Pose / Mood / Colour as per nature
DEITY / COUPLE — ${d.name} (${d.hindi}) · Nature: ${d.nature} · Mood: ${d.mood} · Colour: ${d.colour} · Light: ${d.light}
POSE AS PER NATURE: ${d.pose}
PLACEMENT: ${d.placement}
NEVER MIX NATURES: ${d.never}. Do not borrow another deity's pose, mood, colour or expression. The deity's nature controls pose, mood, colour, light, ornaments, background and title tone — every other rule follows this nature.

0. STRONG RULE — ALWAYS UNIQUE VARIATION - NEVER GHISA PITA:
RULE: ALWAYS UNIQUE VARIATION - NEVER GHISA PITA. Har prompt, har image, har scene hamesha UNIQUE variation me hoga. Same pose, same composition, same background, same title style repeat nahi hoga. Har baar naya angle, naya pose, naya light, naya background detail, naya composition. Ghisa-pita / template / copy-paste / repeated poster bilkul nahi. Example: Krishna flute - ek baar Yamuna sunrise, dusri baar Vrindavan evening, teesri baar Kadamb tree night - kabhi same nahi. For Ram, Krishna, Dashavatar - har avatar / har scene me alag variation. Title placement is TOP ONLY — never generate a bottom title. Variation title NEVER overrides the platform title rule: platform rule wins — Title TOP Centre (or TOP variant) + Bottom Clean always.
VARIATION FOR THIS LEVEL (L${l.n}): Camera angle variation only: ${variation.angle}. Light detail variation only: ${variation.light}. Background detail variation only: ${variation.background}. Title placement (TOP ONLY variation): ${variation.title}. DEITY NATURE WINS: The deity pose, placement and mood above always win over any variation pose — variation never changes the deity's nature, pose essence, placement or mood. PLATFORM RULE WINS: If this variation title ever conflicts with the platform title rule, the platform rule wins — Title TOP Centre (or TOP variant) + Bottom Clean always. Never generate a bottom title. Scene: ${d.name} — ${d.nature} — in this variation's angle / light / background detail only.
VARIATION CHECKLIST — CHECK BEFORE FINAL: Angle unique? Pose unique? Light unique? Background unique? Title placement unique? (TOP ONLY — TOP Centre / TOP Right / TOP Left below IBD, never bottom.) If any 2 same as previous, regenerate with new variation — change angle + pose + light + background + title placement, do not reuse the previous combination.

0B. PLATFORM DIMENSIONS + PROMPT GENERATING RULES — ${p.name.toUpperCase()}:
PLATFORM: ${p.name}. Aspect Ratio: ${p.ratio}. Resolution: ${p.resolution}. Title Placement: ${p.title}. Bottom: ${p.bottom}. Composition: ${p.composition}. Safe Zone: ${p.safeZone}. UI rule: ${p.uiNote}
PROMPT GENERATING RULE — Always include in prompt: Aspect Ratio + Resolution + Title Placement TOP + Bottom Clean + Safe Zone. ${p.promptRule} ${p.ratio === "16:9" ? "For YT: Always mention YT lower-third / progress bar / controls — No text at bottom." : "No big title at bottom — bottom is CLEAN, only small branding."} Title is TOP Centre in every platform. Face is centre / centre-middle. IBD stays top-left only. Bottom-centre carries only the small branding line — never a title.

1. POSITIVE PROMPT:
A divine, cinematic OTT Premium Ultra poster for Indian Bhakti Dhara — L${l.n} ${l.name}. Sacred bhakti atmosphere, devotional emotion, temple light, timeless Indian spirituality — rendered like a premium streaming original. Scene: ${d.name} — ${d.nature}. ${d.pose} Background as per nature: ${d.background}. One clear main subject / couple, in the exact placement above, with diyas glowing, marigold, incense smoke and temple architecture where the nature allows.
DOP / DIRECTORS: Christopher Nolan / Hoyte van Hoytema IMAX style, Roger Deakins volumetric, Emmanuel Lubezki natural light, Greig Fraser haze, plus Richardson warm gold, Pfister dark + gold, Kaminski desaturated + gold, Beebe gold + teal, McGarvey warm light — Netflix / HBO / Disney+ / Apple TV / Nat Geo / BBC Earth DOP standard. DOP Mix: ${l.dopMix}.
${dopRef}
CAMERA — Camera Body: ${e.body} · Shutter Speed: ${e.shutter} · Shutter Angle: ${e.angle} · Lens: ${e.lens} · Focal Length: ${e.focal} · Aperture f-stop: ${e.aperture} · ISO: ${e.iso} · White Balance: ${e.wb} · Depth of Field: ${e.dof} · Bokeh: ${e.bokeh} · Focus: ${e.focus} · Shallow cinematic depth of field, sharp devotional eyes, creamy golden bokeh, crisp jewellery and fabric detail, no motion blur on face. Best camera reference: Shutter 1/50 · Angle 180° · Lens 35+85mm · Aperture f/1.4-2.8 · ISO 25 · WB 5600K.
SAMPLER / RENDER — Sampler: ${l.sampler} · Steps: ${l.steps} · CFG: ${l.cfg} · LoRA: ${l.lora} · Resolution: ${l.resolution} · DOP / Look: ${l.dop} · Mood: ${l.mood}. Best render reference: Sampler DPM++ 3M SDE Karras + UniPC · Steps 120 · CFG 10 · LoRA 1.5.
FACE — Face Detailer: ${e.face} · ADetailer: ${e.adetailer} · Eyes Detailer: ${e.eyes} · Hands Detailer: ${e.hands} · Skin Detailer: ${e.skin} · Jewellery Detailer: ${e.jewellery}. Best face reference: Face Detailer Max · ADetailer Max · Eyes Max · Hands Max · Skin Max · Jewellery Max. Ultra-detailed face, expressive devotional eyes, natural skin texture, refined hands, authentic traditional attire, intricate jewellery, sacred ornaments.
LIGHTING — Key Light: ${e.key} · Fill Light: ${e.fill} · Rim Light: ${e.rim} · Moog Lighting: ${e.moog} · Golden God-Ray: ${e.godRay} · Volumetric: ${e.volumetric} · Practical Lights: ${e.practical} · Nebula Glow: ${e.nebula} · Dust Particles: ${e.dust} · Mist: ${e.mist} · Warm golden moog glow, soft diffused temple light, gentle rim light on face and ornaments, deep teal shadows. Best lighting reference: God-Ray Volumetric · Moog Max · Nebula Max.
VFX — Particles Gold Dust: ${e.goldDust} · Smoke / Mist: ${e.smoke} · Fire / Glow: ${e.fireGlow} · Water Reflection: ${e.water} · Bloom: ${e.bloom} · Lens Flare: ${e.flare} · Film Grain: ${e.grain} · 2D/3D: ${e.twoD} · CGM: ${e.cgm} · CGI: ${e.cgi} · VFX: ${e.vfx} · Colour Grade: Deep Teal + Gold · Floating gold dust, soft incense smoke, glowing particles, subtle star dust in the divine sky, volumetric light beams. Best VFX reference: CGM Full · CGI Ultra · VFX Full · 2D/3D Full.
${craftRef}
COLOUR COMBINATION — Nature colour (controls this poster): ${d.colour}. Primary grade: Deep Teal + Gold, held inside the nature colour above — never replace the nature colour with another deity's palette. Secondary combos only as soft accents: Maroon + Gold · Royal Blue + Gold · Ivory Cream + Gold · Emerald Green + Gold · Saffron + White + Gold. Skin: Warm natural, Gold glow, No oversaturation. Background: ${d.background}. Level scale: ${colour.levelScale}.
ORNAMENTS CLARITY — Deity ornaments as per nature: ${d.ornaments}. Crown / Mukut: ${ornament.crown}. Jewellery: ${ornament.jewellery}. Mala: ${ornament.mala}. Fabric: ${ornament.fabric}. Detailers: ${ornament.detailer}. Ornaments checklist: Crown clear? Jewellery sharp? Hands correct? Eyes clear? Hand positions exactly as per the placement above.
THUMBNAIL CTR — Face: ${ctr.face}. Contrast: ${ctr.contrast}. Focus: ${ctr.focus}. Curiosity: ${ctr.curiosity}. CTR Score guide (out of 10): Title clarity 3 + Face 3 + Contrast 2 + Curiosity 2. ${ctr.target}. Thumbnail CTR 9+ target: close-up, eye contact, clear expression, gold title on dark teal, one main subject, 3-second rule, question / Leela moment.
SUBJECT & DETAIL — Ultra-detailed face, expressive devotional eyes, natural skin texture, refined hands, authentic traditional attire, intricate jewellery, sacred ornaments, temple architecture, marigold, incense smoke, cinematic crowd depth where needed.
COMPOSITION — Platform: ${p.name} · Composition ${p.ratio} · Resolution ${p.resolution}. Title Placement: ${p.title}. ${p.composition}. ${p.bottom}. Safe Zone: ${p.safeZone}. Keep the face, title and IBD mark inside the platform safe area — title TOP Centre, bottom CLEAN.
MOOD — ${d.mood} · Bhakti · Shraddha · Divyata · Shanti. Title tone as per nature: ${d.titleTone}. Premium, reverent, majestic and emotionally powerful — Netflix / HBO / Disney+ / Apple TV / Nat Geo / BBC Earth DOP standard. Light as per nature: ${d.light}.

1B. AUDIO / MUSIC:
AUDIO: ${d.name} - ${audio.instruments} - Soft devotional - 20% volume. ${audio.base}. Instruments: ${audio.instruments}. SFX: ${audio.sfx}. Mix: ${audio.mix}. Loop: ${audio.loop}. No loud beats. No copyrighted Bollywood.

1C. VOICEOVER / DIALOGUE:
VOICEOVER: ${language} - Calm Divine - ${vo.words} - Hook + Story + Shloka + CTA. Language: ${language}. Voice style: ${vo.style}. Length: ${len.label} — ${vo.words}. Script format: ${vo.format}. Hook: ${vo.hook} Story: ${vo.story} Shloka: ${vo.shloka} CTA: ${vo.cta}

1D. EDITING / PACING:
EDITING: Slow + Fade/Dissolve + Slow Zoom + Gold Dust. Pacing: Slow divine drift · 1 scene = 3–5 sec · No fast cuts · No flash. Transitions: Fade + Dissolve + Slow Zoom-in · No hard cut · No glitch. Text on screen: Title TOP only · Subtitles centre-lower small white with black shadow · No bottom big text. Effects: Gold Dust float · God-Ray pulse · Petal fall · Slow zoom.

1E. COLOUR LUT:
COLOUR LUT: ${lut.name} - ${lut.grade}. Preset: ${lut.name} (${lut.grade}) — ${lut.forDeity}. ${lut.detail} Apply this LUT over the Deep Teal + Gold grade, inside the deity nature colour — never replace the nature colour.

1F. TITLE ANIMATION:
TITLE ANIMATION: Gold Fade-in Top, Slow Scale, Sparkle. Title Animation: Gold fade-in from top · Slow scale 95% to 100% · Sparkle on title · No bounce · No pop. Title stays TOP Centre, Below IBD, 2 sec hold, Then fade to scene. Subtitle animation: Word-by-word fade, small white.

1G. PLATFORM EXPORT:
EXPORT: ${ex.label} - ${ex.size} - ${ex.fps} - MP4. Export: ${ex.label} · ${ex.ratio} · ${ex.size} · ${ex.fps} · ${ex.codec}. ${ex.thumb}. Title TOP in thumbnail and in video. Bottom clean.

1H. STORYBOARD / SCRIPT:
Storyboard format: Scene No. | Visual (L30 prompt) | Voiceover line | Music | Duration | Title TOP. Total: ${len.label} · ${vo.words}.
${scenes.map(s => `Scene ${s.no} | ${s.visual} | Voiceover: ${s.voiceover} | Music: ${s.music} | Duration: ${s.duration} sec | Title TOP`).join("\n")}

2. NEGATIVE PROMPT:
NEGATIVE: No flat cartoon, No AI feel, No blurry face, No melting jewellery, No extra fingers/hands, No wrong spelling, No crowded composition, No instruction text on poster, No level tag L30/OTT/Premium on poster, No Om logo, No circular logo, No Bhartiya spelling, No violent scene, No distorted eyes. Also no watermark, no prompt text, no settings text on the poster, no motion blur on face, no oversaturation, no extra logos.

3. CGI BEST PARAMETERS:
CGI Ultra, VFX Full, CGM Full, Film Grain Cinematic, Bloom, Lens Flare Soft, Gold Dust, Mist, Water Reflection, Nebula Max, Moog Max, 2D/3D Full. Level render for this card: CGI ${e.cgi} · VFX ${e.vfx} · CGM ${e.cgm} · Film Grain ${e.grain} · Bloom ${e.bloom} · Lens Flare ${e.flare} · Gold Dust ${e.goldDust} · Mist ${e.mist} · Water Reflection ${e.water} · Nebula ${e.nebula} · Moog ${e.moog} · 2D/3D ${e.twoD}.

4. BRANDING + LOGO INSTRUCTIONS:
Top-left corner ONLY "IBD", small bold gold. No Om logo, No circular logo, No other logo. Bottom-centre small white subtle "An Indian Bhakti Dhara Production" — exact spelling Indian not Bhartiya. Title Gold Bold + Devanagari sharp correct spelling. No instruction on poster. No level tag on poster. Branding: IBD top-left only.`;
}

const rules = [
  { range: "L1 – L17", title: "Draft", desc: "Practice, testing and internal review. Refine composition, face and light before release.", tone: "Draft", hindi: "ड्राफ्ट" },
  { range: "L18", title: "Minimum for Posting", desc: "The first level cleared for posting. Clean, stable and presentable for the audience.", tone: "Minimum", hindi: "पोस्टिंग के लिए न्यूनतम" },
  { range: "L19", title: "Old Top", desc: "The previous benchmark. Still strong — now kept as reference, not the final standard.", tone: "Old Top", hindi: "पुराना टॉप" },
  { range: "L20", title: "New Top", desc: "The new benchmark for public release. Use this as the everyday top standard.", tone: "New Top", hindi: "नया टॉप" },
  { range: "L30", title: "Infinity · Final Top", desc: "The complete standard. Maximum detail, devotion and cinematic finish for hero posters.", tone: "Infinity", hindi: "अनंत — अंतिम टॉप" },
];

const scaleGuide = [
  { range: "L1–L5", label: "Basic · OFF", detail: "1/125 · 90° · f/8 · ISO 400 · Moog OFF · Nebula OFF · VFX OFF · Face OFF" },
  { range: "L6–L10", label: "Low", detail: "1/100 · 120° · f/5.6 · ISO 250 · Moog Low · Nebula OFF · VFX Low" },
  { range: "L11–L17", label: "Mid", detail: "1/80 · 150° · f/2.8–4 · ISO 100–160 · Moog Mid · Nebula Low · VFX Mid" },
  { range: "L18–L20", label: "High", detail: "1/60 · 180° · f/1.8–2.8 · ISO 64–80 · Moog High · Nebula Mid · VFX High" },
  { range: "L21–L29", label: "Ultra", detail: "1/50 · 180° · f/1.4–2.8 · ISO 25–50 · Moog Max · Nebula High · VFX Ultra" },
  { range: "L30", label: "IMAX · Max", detail: "1/50 · 180° · f/1.4–2.8 · ISO 25 · Moog Max · Nebula Max · VFX Full" },
];

function ParamGrid({ title, icon: Icon, items }: { title: string; icon: any; items: [string, string][] }) {
  return (
    <div className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
      <div className="flex items-center gap-2"><Icon size={17} className="text-[var(--gold)]" /><h4 className="text-[12px] font-extrabold tracking-[0.14em]">{title}</h4></div>
      <dl className="mt-3 space-y-2.5">
        {items.map(([k, v]) => (
          <div key={k} className="flex flex-wrap gap-x-2 gap-y-0.5 justify-between border-b border-[var(--line-2)] pb-2 last:border-0 last:pb-0">
            <dt className="text-[12px] font-bold text-[var(--muted)]">{k}</dt>
            <dd className="text-[13px] font-bold text-right leading-snug break-words">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function App() {
  const levels = useMemo(buildLevels, []);
  const [selected, setSelected] = useState(30);
  const [platformId, setPlatformId] = useState("yt-video");
  const [deityId, setDeityId] = useState("ram-sita");
  const [language, setLanguage] = useState("Hindi");
  const [lengthId, setLengthId] = useState("30s");
  const [lutId, setLutId] = useState("");
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [packsError, setPacksError] = useState<string | null>(null);
  const [packsLoading, setPacksLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const loadPacks = async () => {
    try { const data: any = await callRecords("records.list", { collection: "prompt-packs" }); setPacks(data?.records ?? []); setPacksError(null); }
    catch (e) { setPacksError("Saved packs could not be loaded yet. Your current prompt still works — try saving again after the connection returns."); }
    finally { setPacksLoading(false); }
  };
  useEffect(() => { loadPacks(); }, []);
  const deity = deities.find(d => d.id === deityId) ?? deities[0];
  const platform = platforms.find(p => p.id === platformId) ?? platforms[0];
  const level = levels[selected - 1];
  const prompt = useMemo(() => buildPrompt(level, platform, deity, { language, lengthId, lutId: lutId || undefined }), [level, platform, deity, language, lengthId, lutId]);
  const audio = audioFor(deity);
  const lut = lutFor(deity, lutId || undefined);
  const lenOpt = lengthOptions.find(x => x.id === lengthId) ?? lengthOptions[0];
  const vo = voiceoverFor(language, lenOpt, deity);
  const ex = exportFor(platform);
  const scenes = storyboardFor(deity, platform, lenOpt, vo, audio);
  const handleGenerate = () => { setGeneratedAt(new Date().toLocaleString()); setSaveMsg(null); document.getElementById("master-prompt")?.scrollIntoView({ behavior: "smooth" }); };
  const handleSave = async () => {
    setSaving(true); setSaveMsg(null);
    try {
      await callRecords("records.create", { collection: "prompt-packs", idempotency_key: `pack-${deityId}-${platformId}-${selected}-${language}-${lengthId}-${Date.now()}`, value: { deity: deity.name, platform: platform.name, level: selected, language, length: lenOpt.label, lut: lut.name, title: `L${selected} ${deity.name} · ${platform.name} · ${lenOpt.label}`, prompt: prompt.slice(0, 8000) } });
      await loadPacks(); setSaveMsg("Saved — this prompt pack now appears in Saved Prompt Packs below.");
    } catch (e) { setSaveMsg(e instanceof Error ? e.message : "Could not save this pack. Please try again."); }
    finally { setSaving(false); }
  };
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await callRecords("records.delete", { collection: "prompt-packs", id }); await loadPacks(); setSaveMsg("Saved pack removed."); }
    catch (e) { setSaveMsg(e instanceof Error ? e.message : "Could not remove this pack."); }
    finally { setDeletingId(null); }
  };
  const e = level.exp;
  const choreo = choreoFor(level.n);
  const cine = cineFor(level.n);
  const photo = photoFor(level.n);
  const motion = motionFor(level.n);
  const colour = colourFor(level.n);
  const ornament = ornamentFor(level.n);
  const ctr = ctrFor(level.n);
  const variation = variationFor(level.n);

  const specs = [
    { icon: MonitorPlay, label: "Platform", value: `${platform.name} · ${platform.ratio} · ${platform.resolution}` },
    { icon: Sparkles, label: "Deity / Couple — Nature Control", value: `${deity.name} · ${deity.nature} · ${deity.pose}` },
    { icon: MonitorPlay, label: "Title Placement / Safe Zone", value: `${platform.title} · ${platform.safeZone} · ${platform.bottom}` },
    { icon: MonitorPlay, label: "Resolution", value: level.resolution },
    { icon: SlidersHorizontal, label: "Sampler", value: level.sampler },
    { icon: Gauge, label: "Steps", value: String(level.steps) },
    { icon: Wand2, label: "CFG", value: level.cfg },
    { icon: Layers, label: "LoRA", value: level.lora },
    { icon: Eye, label: "Face Detailer / ADetailer", value: `${level.face} · ${e.adetailer}` },
    { icon: Aperture, label: "ISO", value: level.iso },
    { icon: Film, label: "CGM / CGI", value: `${level.cgm} · ${e.cgi}` },
    { icon: Clapperboard, label: "DOP / Look", value: level.dop },
    { icon: Clapperboard, label: "Directors & DOP Mix", value: `${level.dopMix} · ${level.directorFocus}` },
    { icon: Music, label: "Choreography", value: choreo.focus },
    { icon: Move, label: "Cinematographer Move", value: cine.focus },
    { icon: Camera, label: "Photography", value: photo.focus },
    { icon: Video, label: "Motion", value: `${motion.styles} · ${motion.duration} · ${motion.loop} · ${motion.fps}` },
    { icon: Palette, label: "Colour Combination", value: `${colour.primary} · ${colour.levelScale}` },
    { icon: Gem, label: "Ornaments Clarity", value: `${ornament.detailer} · Crown, Jewellery, Mala, Fabric sharp` },
    { icon: Target, label: "Thumbnail CTR", value: `Score ${ctr.score}/10 · ${ctr.target} · Title 3 + Face 3 + Contrast 2 + Curiosity 2` },
    { icon: AudioLines, label: "Audio / Music", value: `${audio.instruments} · Soft devotional · Voice 80% / Music 20% · Loop clean` },
    { icon: Mic, label: "Voiceover / Dialogue", value: `${language} · Calm Divine · ${vo.words} · Hook + Story + Shloka + CTA` },
    { icon: Scissors, label: "Editing / Pacing", value: "Slow divine drift · Fade / Dissolve · Slow Zoom · Gold Dust · 1 scene = 3–5 sec" },
    { icon: Palette, label: "Colour LUT", value: `${lut.name} · ${lut.grade} · ${lut.forDeity}` },
    { icon: Type, label: "Title Animation", value: "Gold Fade-in Top · Slow Scale 95% → 100% · Sparkle · TOP Centre, Below IBD, 2 sec hold" },
    { icon: Download, label: "Platform Export", value: `${ex.label} · ${ex.size} · ${ex.fps} · MP4 H.264 · Audio AAC` },
    { icon: BookOpen, label: "Storyboard / Script", value: `${scenes.length} scenes · ${lenOpt.label} · Scene | Visual | Voiceover | Music | Duration | Title TOP` },
    { icon: Shuffle, label: "Unique Variation — Never Ghisa Pita", value: `Angle: ${variation.angle} · Pose: ${variation.pose} · Light: ${variation.light} · Background: ${variation.background} · Title: ${variation.title}` },
    { icon: Palette, label: "Colour Grade", value: level.colour },
    { icon: Lightbulb, label: "Lighting", value: level.lighting },
    { icon: Sparkles, label: "VFX", value: `${level.vfx} · ${e.twoD}` },
    { icon: Camera, label: "Camera Shutter", value: `${level.shutter} · ${e.angle}` },
    { icon: Aperture, label: "Lens", value: `${level.lens} · ${e.focal}` },
    { icon: Aperture, label: "Aperture", value: level.aperture },
    { icon: Lightbulb, label: "Mood Lighting / Moog Lighting", value: `${level.mood} · ${e.moog}` },
    { icon: Sparkles, label: "Nebula", value: level.nebula },
    { icon: Focus, label: "White Balance · Focus", value: `${e.wb} · ${e.focus}` },
  ];

  return (
    <div data-safe-area-inset-root style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }} className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-clip">
      <header data-safe-area-sticky-top style={{ top: "var(--safe-area-inset-top)" }} className="sticky z-30 border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--gold-soft)] border border-[var(--line)] grid place-items-center text-[var(--gold)]"><Clapperboard size={20} /></div>
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.22em] font-extrabold text-[var(--teal)]">INDIAN BHAKTI DHARA</p>
              <p className="font-display text-[15px] sm:text-lg leading-tight truncate">L1–L30 Master Prompt Tool</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1.5 rounded-full bg-[var(--teal-soft)] text-[var(--teal)] border border-[var(--line-2)]">OTT PREMIUM ULTRA</span>
            <span className="px-2.5 py-1.5 rounded-full bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--line)]">{platform.ratio}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pb-10">
        <section className="pt-6 sm:pt-8 pb-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.18em] px-3 py-1.5 rounded-full bg-[var(--gold)] text-black"><Crown size={13} /> L1–L30 MASTER PROMPT TOOL</span>
            <span className="text-[11px] font-bold tracking-[0.14em] px-3 py-1.5 rounded-full border border-[var(--line)] text-[var(--muted)]">DARK CINEMATIC · GOLD + TEAL</span>
          </div>
          <h1 className="font-display leading-[0.95] text-[clamp(2.4rem,7vw,4.4rem)]">
            <span className="gold-text">L1–L30 Master</span><br />Prompt Tool
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] sm:text-base text-[var(--muted)] leading-relaxed">
            Indian Bhakti Dhara — <span className="font-hindi text-[var(--text)]">OTT Premium Ultra</span>. Choose a level to open its complete card, full expanded parameters and ready-to-use master prompt. <span className="font-hindi">भक्ति • सिनेमा • दिव्यता</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="px-3 py-2 rounded-full bg-[var(--gold-soft)] border border-[var(--line)] text-[var(--gold-2)]">Brand: Indian Bhakti Dhara only</span>
            <span className="px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--line-2)]">Deep Teal + Gold grade</span>
            <span className="px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--line-2)]">Golden God-Ray + Volumetric</span>
            <span className="px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--line-2)]">Camera · Lighting · VFX · Face · Sampler</span>
            <span className="px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--line-2)]">Choreographer · Cinematographer · Photographer · Motion</span>
            <span className="px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--line-2)]">Colour Combination · Ornaments Clarity · Thumbnail CTR — DONE</span>
            <span className="px-3 py-2 rounded-full bg-[var(--gold-soft)] border border-[var(--line)] text-[var(--gold-2)]">Audio · Voiceover · Editing · LUT · Title Animation · Export · Storyboard — DONE · 100%</span>
            <span className="px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--line-2)]">Netflix · HBO · Disney+ · Apple TV · Nat Geo · BBC Earth DOP</span>
          </div>
        </section>

        {/* PLATFORM DIMENSIONS + PROMPT GENERATING RULES — TOP OF TOOL */}
        <section aria-label="Platform Dimensions and Prompt Generating Rules" className="mt-5 rounded-3xl border-2 border-[var(--teal)] bg-[var(--surface)] p-4 sm:p-6 teal-glow">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">TOP OF TOOL · SELECT FIRST</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1 leading-tight">Platform Dimensions +<br className="sm:hidden" /> Prompt Generating Rules</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl leading-relaxed">Select a platform — the prompt auto-changes aspect ratio + title placement + safe zones. Title is TOP Centre on every platform. Bottom stays CLEAN.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--teal)] text-white text-xs font-extrabold"><MonitorPlay size={13} /> {platform.name} · {platform.ratio} · {platform.resolution}</span>
          </div>

          <div className="mt-4" role="group" aria-label="Select platform">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--muted)]">1 · SELECT PLATFORM — PROMPT UPDATES AUTOMATICALLY</p>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {platforms.map(p => {
                const active = p.id === platformId;
                return (
                  <button key={p.id} onClick={() => setPlatformId(p.id)} aria-pressed={active}
                    className={`rounded-2xl border p-3 text-left transition ${active ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-lg" : "bg-[var(--surface-2)] border-[var(--line-2)] hover:border-[var(--line)]"}`}>
                    <span className={`block text-[15px] font-extrabold leading-none ${active ? "text-black" : "text-[var(--gold-2)]"}`}>{p.ratio}</span>
                    <span className={`block text-[12px] font-bold mt-1.5 leading-snug ${active ? "text-black" : "text-[var(--text)]"}`}>{p.short}</span>
                    <span className={`block text-[11px] mt-1 ${active ? "text-black/70" : "text-[var(--muted)]"}`}>{p.resolution}</span>
                    {active && <span className="mt-2 inline-block text-[10px] font-extrabold tracking-[0.12em] px-2 py-0.5 rounded-full bg-black text-white">SELECTED</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">SELECTED — {platform.name.toUpperCase()} · {platform.ratio} · {platform.resolution}</p>
            <p className="mt-1 text-[15px] font-bold leading-snug">{platform.title} · {platform.bottom}</p>
            <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">{platform.composition} · Safe Zone: {platform.safeZone} · {platform.uiNote}</p>
            <p className="mt-2 text-[13px] font-semibold leading-relaxed">In the prompt: Aspect Ratio {platform.ratio} + Resolution {platform.resolution} + Title Placement TOP + Bottom Clean + Safe Zone — always included.</p>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--muted)]">2 · PLATFORM TABLE — ALL DIMENSIONS</p>
            <div className="mt-2 rounded-2xl border border-[var(--line-2)] overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-2 bg-[var(--surface-3)] px-4 py-2.5 text-[11px] font-extrabold tracking-[0.12em] text-[var(--muted)]">
                <span className="col-span-3">PLATFORM</span><span className="col-span-1">RATIO</span><span className="col-span-2">RESOLUTION</span><span className="col-span-3">TITLE PLACEMENT</span><span className="col-span-3">BOTTOM / SAFE ZONE</span>
              </div>
              {platforms.map((p, idx) => {
                const active = p.id === platformId;
                return (
                  <button key={p.id} onClick={() => setPlatformId(p.id)} className={`w-full text-left grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 px-4 py-3 items-start border-t border-[var(--line-2)] ${active ? "bg-[var(--gold-soft)]" : idx % 2 === 0 ? "bg-[var(--surface-2)]" : "bg-[var(--surface)]"}`}>
                    <span className="md:col-span-3 text-[14px] font-extrabold leading-snug">{p.name} {active && <span className="ml-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[var(--gold)] text-black align-middle">SELECTED</span>}</span>
                    <span className="md:col-span-1 text-[13px] font-bold text-[var(--gold-2)]"><span className="md:hidden text-[11px] font-extrabold tracking-[0.12em] text-[var(--muted)]">RATIO · </span>{p.ratio}</span>
                    <span className="md:col-span-2 text-[13px] font-semibold"><span className="md:hidden text-[11px] font-extrabold tracking-[0.12em] text-[var(--muted)]">RESOLUTION · </span>{p.resolution}</span>
                    <span className="md:col-span-3 text-[13px] leading-relaxed"><span className="md:hidden text-[11px] font-extrabold tracking-[0.12em] text-[var(--muted)]">TITLE · </span>{p.title}</span>
                    <span className="md:col-span-3 text-[13px] leading-relaxed text-[var(--muted)]"><span className="md:hidden text-[11px] font-extrabold tracking-[0.12em] text-[var(--muted)]">BOTTOM / SAFE · </span>{p.bottom} · {p.safeZone}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--teal)]">3 · PROMPT GENERATING RULES PER PLATFORM</p>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed font-semibold">
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>When user selects platform, prompt auto-changes aspect ratio + title placement + safe zones.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>Always include in prompt: Aspect Ratio + Resolution + Title Placement TOP + Bottom Clean + Safe Zone.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>For 16:9: Title TOP Centre, Face centre, No bottom title.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>For 9:16: Title TOP Centre below IBD, Face centre-middle, Bottom clean.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>For 1:1 / 4:5: Title TOP Centre, Face centre, Bottom only branding.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>For YT: Always mention YT lower-third / progress bar / controls — No text at bottom.</span></li>
            </ul>
          </div>
        </section>

        {/* DEITIES & COUPLES — NATURE CONTROL */}
        <section aria-label="Deities and Couples — Nature Control" className="mt-5 rounded-3xl border-2 border-[var(--gold)] bg-[var(--surface)] p-4 sm:p-6 teal-glow">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--gold-2)]">SELECT FIRST · NATURE CONTROLS THE PROMPT</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1 leading-tight">Deities &amp; Couples — Nature Control</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl leading-relaxed">Select a deity or couple — the prompt auto-controls pose, mood, colour, light, ornaments, background and title tone as per that deity&apos;s nature. Never mix natures.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold"><BadgeCheck size={13} /> {deity.name} · {deity.mood}</span>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">NATURE CONTROL — SELECTED</p>
            <p className="mt-1 text-[15px] font-bold leading-snug">NATURE CONTROL: {deity.name} - {deity.nature} - Pose / Mood / Colour as per nature</p>
            <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">{deity.hindi} · Mood: {deity.mood} · Colour: {deity.colour} · Light: {deity.light}</p>
            <p className="mt-2 text-[14px] font-semibold leading-relaxed">{deity.pose}</p>
            {deity.members && <p className="mt-1 text-[13px] font-bold leading-relaxed">Members: {deity.members}</p>}
            {deity.titleExample && <p className="mt-1 text-[13px] font-bold leading-relaxed">Title example: {deity.titleExample}</p>}
            <p className="mt-1 text-[13px] text-[var(--muted)] leading-relaxed">Placement: {deity.placement} · Never: {deity.never}.</p>
          </div>

          {(["Couples", "Single Deities", "All Avatars", "Full Family & Darbar"] as const).map(group => (
            <div key={group} className="mt-5">
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--muted)]">{group === "Couples" ? "COUPLES — WITH NATURE CONTROL" : group === "Single Deities" ? "SINGLE DEITIES — WITH NATURE CONTROL" : group === "All Avatars" ? "ALL AVATARS — WITH NATURE CONTROL" : "FULL FAMILY & DARBAR — WITH NATURE CONTROL · NEW · NOT MERGED WITH COUPLES"}</p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5" role="group" aria-label={group}>
                {deities.filter(d => d.group === group).map((d, idx) => {
                  const active = d.id === deityId;
                  const num = group === "Couples" ? idx + 1 : group === "Single Deities" ? idx + 7 : group === "All Avatars" ? 16 : idx + 17;
                  return (
                    <button key={d.id} onClick={() => setDeityId(d.id)} aria-pressed={active}
                      className={`rounded-2xl border p-3.5 text-left transition ${active ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-lg" : "bg-[var(--surface-2)] border-[var(--line-2)] hover:border-[var(--line)]"}`}>
                      <span className="flex items-start justify-between gap-2">
                        <span className={`text-[15px] font-extrabold leading-snug ${active ? "text-black" : "text-[var(--text)]"}`}>{num}. {d.name}</span>
                        {active && <span className="shrink-0 text-[10px] font-extrabold tracking-[0.12em] px-2 py-0.5 rounded-full bg-black text-white">SELECTED</span>}
                      </span>
                      <span className={`block text-[12px] font-semibold mt-1.5 leading-relaxed ${active ? "text-black/80" : "text-[var(--muted)]"}`}>{d.nature}</span>
                      {d.members && <span className={`block text-[12px] font-bold mt-1 leading-relaxed ${active ? "text-black/80" : "text-[var(--text)]"}`}>Members: {d.members}</span>}
                      <span className={`block text-[12px] mt-1 leading-relaxed ${active ? "text-black/70" : "text-[var(--muted)]"}`}>{d.pose}</span>
                      {d.titleExample && <span className={`block text-[12px] font-bold mt-1 leading-relaxed ${active ? "text-black/80" : "text-[var(--gold-2)]"}`}>Title example: {d.titleExample}</span>}
                      <span className={`block text-[11px] font-bold mt-2 ${active ? "text-black" : "text-[var(--gold-2)]"}`}>{d.colour} · {d.mood}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-5 rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--teal)]">CONTROL RULES — NEVER MIX NATURES</p>
            <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed font-semibold">
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>Nature controls: Pose + Mood + Colour + Light + Ornaments + Background + Title tone.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>Hanuman never arrogant · Ram never playful leela · Krishna never angry · Durga never violent gore · Narasimha never blood / violence.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>Couples: always together, correct placement, correct hand positions, correct nature — Ram–Sita holding hands, Radha peeking, Lakshmi seva, Parvati beside Shiv.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>Unique Variation still applies — but only to camera angle, light detail and background detail. It never changes the deity&apos;s nature, pose essence, placement or mood.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>Dashavatar uses the calm divine nature for all 10 — Narasimha calm version only.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>Shiv Parivar is a separate Full Family entry — Shiv centre blessing, Parvati beside Shiv right, Ganesha front-left with Modak, Kartikeya front-right with Vel, Nandi behind. Never angry, never violent.</span></li>
              <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">•</span><span>Ram Darbar is a separate Full Darbar entry — Ram–Sita together, Lakshman side, Hanuman front kneel. This placement is FIXED, never change.</span></li>
            </ul>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              ["Pose", deity.pose],
              ["Mood", `${deity.mood} · Title tone: ${deity.titleTone}`],
              ["Colour + Light", `${deity.colour} · ${deity.light}`],
              ["Ornaments + Background", `${deity.ornaments} · ${deity.background}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[var(--line-2)] bg-[var(--surface-2)] px-3 py-2.5">
                <p className="text-[11px] font-extrabold tracking-[0.14em] text-[var(--gold-2)]">{label.toUpperCase()}</p>
                <p className="text-[12px] text-[var(--muted)] mt-1 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STRONG RULE — ALWAYS UNIQUE VARIATION */}
        <section aria-label="Strong rule — Always Unique Variation" className="rounded-3xl border-2 border-[var(--gold)] bg-[var(--gold-soft)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--gold-2)]">STRONG RULE · HAR PROMPT · HAR IMAGE · HAR SCENE</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1 leading-tight">Always Unique Variation<br className="sm:hidden" /> — Never Ghisa Pita</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold"><Shuffle size={13} /> NO REPEAT · NO TEMPLATE</span>
          </div>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[14px] leading-relaxed font-semibold">
            <li className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5"><b>Har prompt, har image, har scene</b> hamesha UNIQUE variation me hoga.</li>
            <li className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5"><b>Same pose, same composition, same background, same title style</b> repeat nahi hoga.</li>
            <li className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5"><b>Har baar naya angle, naya pose, naya light, naya background detail, naya composition.</b></li>
            <li className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5"><b>Ghisa-pita / template / copy-paste / repeated poster bilkul nahi.</b></li>
            <li className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 md:col-span-2"><b>Example:</b> Krishna flute — ek baar Yamuna sunrise, dusri baar Vrindavan evening, teesri baar Kadamb tree night — <b>kabhi same nahi</b>.</li>
            <li className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3.5 md:col-span-2"><b>For Ram, Krishna, Dashavatar</b> — har avatar / har scene me alag variation.</li>
          </ul>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2"><RefreshCw className="text-[var(--gold)]" size={18} /><p className="text-sm font-bold">Regenerate rule: If any 2 same as previous, regenerate with new variation.</p></div>
            <p className="text-xs font-extrabold tracking-[0.14em] text-[var(--gold-2)]">THIS RULE IS INSIDE EVERY MASTER PROMPT</p>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {variationExamples.map(v => (
              <div key={v.title} className="rounded-xl border border-[var(--line-2)] bg-[var(--surface)] px-3 py-2.5"><p className="text-[12px] font-extrabold text-[var(--gold-2)]">{v.title}</p><p className="text-[12px] text-[var(--muted)] mt-0.5 leading-relaxed">{v.detail}</p></div>
            ))}
          </div>
        </section>

        <section aria-label="Level selector" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4 teal-glow">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-display text-lg leading-none">Select Level</h2>
              <p className="text-xs text-[var(--muted)] mt-1">Tap a level — its full parameter block opens below. L30 is selected by default.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSelected(s => Math.max(1, s - 1))} disabled={selected === 1} className="h-9 px-3 rounded-full border border-[var(--line)] bg-[var(--surface-2)] text-sm font-bold flex items-center gap-1 disabled:opacity-40"><ChevronLeft size={16} /> Prev</button>
              <label className="sr-only" htmlFor="level-select">Choose level</label>
              <select id="level-select" value={selected} onChange={ev => setSelected(Number(ev.target.value))} className="h-9 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 text-sm font-bold outline-none">
                {levels.map(l => <option key={l.n} value={l.n}>L{l.n} — {l.name}</option>)}
              </select>
              <button onClick={() => setSelected(s => Math.min(30, s + 1))} disabled={selected === 30} className="h-9 px-3 rounded-full bg-[var(--gold)] text-black text-sm font-extrabold flex items-center gap-1 disabled:opacity-40">Next <ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="level-scroll mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Levels L1 to L30">
            {levels.map(l => {
              const active = l.n === selected;
              return (
                <button key={l.n} role="tab" aria-selected={active} onClick={() => setSelected(l.n)}
                  className={`shrink-0 min-w-[56px] rounded-2xl px-3 py-2.5 text-left border transition ${active ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-lg" : "bg-[var(--surface-2)] border-[var(--line-2)] hover:border-[var(--line)]"}`}>
                  <span className={`block text-[15px] font-extrabold leading-none ${active ? "text-black" : "text-[var(--text)]"}`}>L{l.n}</span>
                  <span className={`block text-[10px] font-semibold mt-1 leading-tight max-w-[86px] ${active ? "text-black/70" : "text-[var(--muted)]"}`}>{l.name}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {scaleGuide.map(g => (
              <div key={g.range} className="rounded-xl border border-[var(--line-2)] bg-[var(--surface-2)] px-3 py-2.5">
                <p className="text-[12px] font-extrabold"><span className="text-[var(--gold)]">{g.range}</span> · {g.label}</p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5 leading-relaxed">{g.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-[var(--muted-2)]">Scaling: L1–L5 Basic → L6–L10 Low → L11–L17 Mid → L18–L20 High → L21–L29 Ultra → L30 IMAX Max. Draft levels are for practice — L18 is the first level cleared for posting.</p>
        </section>

        <section className="mt-5 rounded-3xl overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[var(--surface-3)] via-[var(--surface)] to-[var(--surface)] border-b border-[var(--line)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold tracking-[0.2em] px-3 py-1.5 rounded-full bg-[var(--teal)] text-white">L{level.n}</span>
                  <span className="text-xs font-extrabold tracking-[0.14em] px-3 py-1.5 rounded-full bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--line)]">{level.tier}</span>
                </div>
                <h2 className="font-display text-[clamp(1.9rem,5vw,3rem)] leading-[1.02] mt-3">L{level.n} · {level.name}</h2>
                <p className="font-hindi text-lg text-[var(--gold-2)] mt-1">{level.hindi} · इंडियन भक्ति धारा</p>
                <p className="text-sm text-[var(--muted)] mt-2 max-w-xl leading-relaxed">{level.note}</p>
              </div>
              <div className="shrink-0 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 text-center min-w-[132px]">
                <Camera className="mx-auto text-[var(--gold)]" size={22} />
                <p className="font-display text-2xl mt-1">{level.resolution}</p>
                <p className="text-[11px] font-bold tracking-widest text-[var(--muted)]">{level.steps} STEPS · CFG {level.cfg}</p>
                <p className="text-[11px] font-bold text-[var(--gold-2)] mt-1">{e.body}</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <h3 className="font-display text-xl">Quick specs</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {specs.map(s => (
                <div key={s.label} className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                  <div className="flex items-center gap-2 text-[var(--teal)]"><s.icon size={16} /><span className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[var(--muted)]">{s.label}</span></div>
                  <p className="mt-2 text-[15px] font-bold leading-snug break-words">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2"><BadgeCheck className="text-[var(--gold)]" size={20} /><p className="text-sm font-bold">Colour Grade: Deep Teal + Gold · Lighting: Golden God-Ray + Volumetric</p></div>
              <p className="text-xs text-[var(--muted)]">Composition {platform.ratio} · {platform.resolution} · Title Gold + Devanagari · Bottom Clean</p>
            </div>
          </div>
        </section>

        {/* FULL EXPANDED PARAMETER BLOCK */}
        <section aria-label={`Full expanded parameters for L${level.n}`} className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">FULL EXPANDED PARAMETER BLOCK</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Every parameter — L{level.n} {level.name}</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Camera · Lighting · VFX · Face · Sampler / Render. Nothing hidden — this is the complete set used in the master prompt below.</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold">{e.shutter} · {e.angle} · {e.aperture} · ISO {e.iso}</span>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="CAMERA" icon={Camera} items={[
              ["Camera Body", e.body], ["Shutter Speed", e.shutter], ["Shutter Angle", e.angle],
              ["Lens", e.lens], ["Focal Length", e.focal], ["Aperture f-stop", e.aperture],
              ["ISO", e.iso], ["White Balance", e.wb], ["Depth of Field", e.dof],
              ["Bokeh", e.bokeh], ["Focus", e.focus],
            ]} />
            <ParamGrid title="LIGHTING" icon={Sun} items={[
              ["Key Light", e.key], ["Fill Light", e.fill], ["Rim Light", e.rim],
              ["Moog Lighting", e.moog], ["Golden God-Ray", e.godRay], ["Volumetric", e.volumetric],
              ["Practical Lights (Diya + Temple)", e.practical], ["Nebula Glow", e.nebula],
              ["Dust Particles", e.dust], ["Mist", e.mist],
            ]} />
            <ParamGrid title="VFX" icon={Sparkles} items={[
              ["Particles Gold Dust", e.goldDust], ["Smoke / Mist", e.smoke], ["Fire / Glow", e.fireGlow],
              ["Water Reflection", e.water], ["Bloom", e.bloom], ["Lens Flare", e.flare],
              ["Film Grain", e.grain], ["2D / 3D", e.twoD], ["CGM", e.cgm], ["CGI", e.cgi],
              ["VFX", e.vfx], ["Colour Grade", "Deep Teal + Gold"],
            ]} />
            <ParamGrid title="FACE" icon={Eye} items={[
              ["Face Detailer", e.face], ["ADetailer", e.adetailer], ["Eyes Detailer", e.eyes],
              ["Hands Detailer", e.hands], ["Skin Detailer", e.skin], ["Jewellery Detailer", e.jewellery],
            ]} />
            <div className="md:col-span-2">
              <ParamGrid title="SAMPLER / RENDER" icon={SlidersHorizontal} items={[
                ["Sampler", level.sampler], ["Steps", String(level.steps)], ["CFG", level.cfg],
                ["LoRA", level.lora], ["Resolution", level.resolution],
              ]} />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--line-2)] bg-[var(--surface-3)]/60 p-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-semibold">
            <span className="flex items-center gap-2"><Droplets size={15} className="text-[var(--teal)]" /> Mist: {e.mist}</span>
            <span className="flex items-center gap-2"><Flame size={15} className="text-[var(--gold)]" /> Fire / Glow: {e.fireGlow}</span>
            <span className="flex items-center gap-2"><Focus size={15} className="text-[var(--teal)]" /> Focus: {e.focus} · DOF: {e.dof}</span>
            <span>Mood: {level.mood}</span>
          </div>
        </section>

        {/* DIRECTORS & DOP REFERENCE — BEYOND OTT LEVEL */}
        <section aria-label="Directors and DOP reference — Beyond OTT Level" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">BEYOND OTT LEVEL</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Directors &amp; DOP Reference</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Study the reference for every level. Fully applied from L18 to L30 — with the complete combined mix at L30.</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold ${level.n >= 18 ? "bg-[var(--gold)] text-black" : "bg-[var(--surface-2)] border border-[var(--line-2)] text-[var(--muted)]"}`}>{level.directorFocus}</span>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">DOP MIX — L{level.n} · {level.name.toUpperCase()}</p>
            <p className="mt-1 text-[15px] font-bold leading-snug">{level.dopMix}</p>
            {level.n === 30 && (
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">L30 combines every reference: Nolan + Hoyte van Hoytema IMAX + Deakins Volumetric + Lubezki Natural Light + Greig Fraser Haze. Camera IMAX 65mm · Shutter 1/50 · Angle 180° · Lens 35+85mm · Aperture f/1.4–2.8.</p>
            )}
            {level.n >= 18 && level.n < 30 && (
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">For L18–L30 the master prompt uses: DOP Christopher Nolan / Hoyte van Hoytema IMAX style, Camera IMAX 65mm, Shutter 1/50 Angle 180°, Lens 35+85mm, Aperture f/1.4–2.8.</p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {directors.map(d => (
              <article key={d.name} className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[var(--teal)]">{d.role}</p>
                <h3 className="font-display text-lg leading-tight mt-1">{d.name}</h3>
                <p className="mt-2 text-[13px] font-bold text-[var(--gold-2)] leading-snug">{d.signature}</p>
                <p className="mt-1.5 text-[13px] text-[var(--muted)] leading-relaxed">{d.look}</p>
                <p className="mt-2 text-[11px] font-bold text-[var(--muted-2)]">{d.credit}</p>
                <p className="mt-3 inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-[var(--line-2)]">{level.n >= 18 ? "Fully applied at this level" : "Reference at this level"}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">How to use: L1–L17 keep the reference light and practise the grade. L18 is the first level where the Beyond OTT DOP reference is fully applied. L30 uses the full combined mix — all directors and DOPs together, with the existing camera, Moog, Nebula, VFX and Face Detailer parameters.</p>
        </section>

        {/* 1 — CHOREOGRAPHER TECHNIQUES */}
        <section aria-label="Choreographer techniques" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">01 · BEYOND OTT LEVEL</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Choreographer Techniques</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Movement is prayer in motion. Hands lead, the circle holds, the tempo stays reverent.</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold">{choreo.tempo}</span>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="CLASSICAL" icon={Music} items={[
              ["Classical", choreo.classical],
              ["Mudras", "Bharatanatyam / Kathak hand mudras — clear, readable, detailed"],
              ["Temple Dance", "Temple dance — grounded, devotional, centred"],
              ["Aarti Movement", "Aarti movement — slow circular diya offering, face lit by flame"],
              ["Pradakshina", "Pradakshina circular movement — clockwise, continuous, unbroken"],
            ]} />
            <ParamGrid title="BOLLYWOOD DEVOTIONAL" icon={Music} items={[
              ["Bollywood", choreo.bollywood],
              ["Saroj Khan", "Grace — soft hand lines, expressive eyes"],
              ["Prabhu Deva", "Energy — controlled rhythm, held to devotional tempo"],
              ["Remo D'Souza", "Flow — smooth transitions, circular movement"],
              ["Ganesh Acharya", "Bhakti steps — grounded devotional rhythm"],
            ]} />
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">CHOREOGRAPHY — L{level.n}</p>
            <p className="mt-1 text-[15px] font-bold leading-snug">{choreo.focus}</p>
            {level.n === 30 && <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">L30 rule: Slow divine grace + circular pradakshina + hand mudra detail, no fast jump cuts. One continuous, reverent movement — the camera and the dancer move as one prayer.</p>}
            {level.n >= 18 && level.n < 30 && <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">L18–L29: Graceful Aarti + Pradakshina circle with clear mudra detail. Keep energy controlled — devotion first, spectacle second.</p>}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {choreoMasters.map(m => (
              <article key={m.name} className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                <h3 className="font-display text-[17px] leading-tight">{m.name}</h3>
                <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">{m.detail}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 2 — CINEMATOGRAPHER TECHNIQUES */}
        <section aria-label="Cinematographer techniques" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">02 · BEYOND OTT LEVEL</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Cinematographer Techniques</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">The camera moves like a devotee — slowly in, up, and around the prayer.</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[var(--teal)] text-white text-xs font-extrabold">{cine.focus}</span>
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--teal)]">MASTERS</p>
            <p className="mt-1 text-[15px] font-bold leading-snug">{cine.masters}</p>
            <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">Nolan / Hoyte van Hoytema IMAX scale · Deakins volumetric beams · Lubezki natural light · Greig Fraser haze. Large format, real light, golden hour, deep teal shadows.</p>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {cineMoves.map(m => (
              <article key={m.name} className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                <div className="flex items-center gap-2 text-[var(--gold)]"><Move size={16} /><h3 className="font-display text-[16px] text-[var(--text)] leading-tight">{m.name}</h3></div>
                <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">{m.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">CINEMATOGRAPHY — L{level.n}</p>
            <p className="mt-1 text-[15px] font-bold leading-snug">{cine.focus}</p>
            {level.n === 30 && <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">L30 combined move: 360 orbit + slow dolly-in + crane up combined. Orbit while dollying in, then rise on the crane — one continuous take, no cut.</p>}
            <p className="mt-2 text-sm text-[var(--muted)]">All moves: {cine.moves}</p>
          </div>
        </section>

        {/* 3 — PHOTOGRAPHER TECHNIQUES */}
        <section aria-label="Photographer techniques" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">03 · BEYOND OTT LEVEL</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Photographer Techniques</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">One still frame must hold the whole prayer — light on the face, symmetry in the temple, reflection in the water.</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold">{photo.focus}</span>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="PORTRAIT" icon={Camera} items={[
              ["Portrait", photo.portrait],
              ["Rembrandt Light", "Triangle of light on the shadow cheek"],
              ["Butterfly Light", "Light from above — symmetrical, divine"],
              ["Split Light", "Half light / half shadow — held drama"],
              ["Catchlight", "Catchlight in eyes — one bright reflection per eye"],
            ]} />
            <ParamGrid title="TEMPLE" icon={Camera} items={[
              ["Temple", photo.temple],
              ["Low Angle", "Camera below the subject — temple rises"],
              ["Symmetry", "Centred gopuram, diya and face on one axis"],
              ["Leading Lines", "Pillars, steps and lamps guide the eye"],
              ["Reflection / Silhouette", "Reflection in water · Silhouette at sunset"],
            ]} />
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">PHOTOGRAPHY — L{level.n}</p>
            <p className="mt-1 text-[15px] font-bold leading-snug">{photo.focus}</p>
            {level.n === 30 && <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">L30 still rule: Low angle symmetry + water reflection + Rembrandt face light. The face is sculpted, the temple is centred, the prayer is doubled in the water.</p>}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {photoTechniques.map(t => (
              <article key={t.name} className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[var(--teal)]">{t.group}</p>
                <h3 className="font-display text-[17px] leading-tight mt-1">{t.name}</h3>
                <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">{t.detail}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 4 — MOTION PROMPT + MOTION STYLES */}
        <section aria-label="Motion prompt and motion styles" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">04 · BEYOND OTT LEVEL · VIDEO</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Motion Prompt + Motion Styles</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">For video: subject, camera, light and particles each move — slowly, together, in a seamless loop.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold"><Timer size={13} /> {motion.duration} · {motion.loop} · {motion.fps}</span>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-4 sm:p-5">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">MOTION PROMPT TEMPLATE — L{level.n}</p>
            <dl className="mt-3 space-y-2.5 text-sm leading-relaxed">
              <div className="flex flex-wrap gap-x-2"><dt className="font-extrabold text-[var(--muted)]">Subject motion:</dt><dd className="font-semibold">{motion.subject}</dd></div>
              <div className="flex flex-wrap gap-x-2"><dt className="font-extrabold text-[var(--muted)]">Camera motion:</dt><dd className="font-semibold">{motion.camera}</dd></div>
              <div className="flex flex-wrap gap-x-2"><dt className="font-extrabold text-[var(--muted)]">Light motion:</dt><dd className="font-semibold">{motion.light}</dd></div>
              <div className="flex flex-wrap gap-x-2"><dt className="font-extrabold text-[var(--muted)]">Particle motion:</dt><dd className="font-semibold">{motion.particle}</dd></div>
              <div className="flex flex-wrap gap-x-2"><dt className="font-extrabold text-[var(--muted)]">Duration:</dt><dd className="font-semibold">{motion.duration}</dd></div>
              <div className="flex flex-wrap gap-x-2"><dt className="font-extrabold text-[var(--muted)]">Loop:</dt><dd className="font-semibold">{motion.loop}</dd></div>
              <div className="flex flex-wrap gap-x-2"><dt className="font-extrabold text-[var(--muted)]">Frame rate:</dt><dd className="font-semibold">{motion.fps}</dd></div>
            </dl>
            <p className="mt-3 text-[13px] text-[var(--muted)] leading-relaxed">Motion styles for this level: <span className="font-bold text-[var(--text)]">{motion.styles}</span></p>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {motionStyles.map((m, i) => (
              <article key={m.name} className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-[var(--gold-soft)] border border-[var(--line)] grid place-items-center text-[11px] font-extrabold text-[var(--gold-2)]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-[16px] leading-tight">{m.name}</h3>
                </div>
                <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">{m.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2"><Repeat className="text-[var(--gold)]" size={20} /><p className="text-sm font-bold">L30 Motion: Slow Divine Drift + 360 Orbit + God-Ray Pulse + Petal Fall + Gold Dust Float</p></div>
            <p className="text-xs font-extrabold tracking-[0.14em]">10 SEC LOOP · 24FPS CINEMATIC</p>
          </div>
          {level.n === 30 && (
            <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">L30 motion is one continuous loop: drift + orbit + pulse + petals + gold dust, 10 seconds, seamless, 24fps cinematic. No fast jump cuts — the prayer never breaks.</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--line-2)]"><Video size={13} className="text-[var(--teal)]" /> Subject · Camera · Light · Particle</span>
            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--line-2)]"><Orbit size={13} className="text-[var(--gold)]" /> Cinematic Orbit 360</span>
            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--line-2)]"><Waves size={13} className="text-[var(--teal)]" /> Water Ripple · Mist Flow</span>
          </div>
        </section>

        {/* 5 — COLOUR COMBINATION — DONE */}
        <section aria-label="Colour combination" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">05 · DONE</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Colour Combination</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">One main grade, five supporting combinations — skin stays warm and natural, never oversaturated.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold"><BadgeCheck size={13} /> DONE</span>
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">PRIMARY — MAIN L30 GRADE</p>
            <p className="mt-1 text-[15px] font-bold leading-snug">Deep Teal + Rich Gold</p>
            <div className="mt-3 flex gap-2">
              <span className="h-10 flex-1 rounded-xl border border-black/20" style={{ background: "#0a6d64" }} title="Deep Teal" />
              <span className="h-10 flex-1 rounded-xl border border-black/20" style={{ background: "#d4af37" }} title="Rich Gold" />
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">Level scale: <span className="font-bold text-[var(--text)]">{colour.levelScale}</span></p>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {secondaryCombos.map(c => (
              <article key={c.name} className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                <div className="flex gap-2">
                  <span className="h-9 flex-1 rounded-lg border border-black/20" style={{ background: c.swatchA }} />
                  <span className="h-9 flex-1 rounded-lg border border-black/20" style={{ background: c.swatchB }} />
                </div>
                <h3 className="font-display text-[17px] leading-tight mt-3">{c.name}</h3>
                <p className="mt-1 text-[13px] text-[var(--muted)] leading-relaxed">{c.use}</p>
              </article>
            ))}
            <article className="rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
              <h3 className="font-display text-[17px] leading-tight">L30 Layered Grade</h3>
              <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">Deep Teal + Rich Gold + Maroon + Ivory layered — teal shadows, gold light, maroon depth, ivory softness in one frame.</p>
            </article>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="SKIN" icon={Sun} items={[
              ["Skin", "Warm natural"],
              ["Glow", "Gold glow"],
              ["Saturation", "No oversaturation"],
            ]} />
            <ParamGrid title="BACKGROUND" icon={Droplets} items={[
              ["Background", "Dark temple + gold light"],
              ["Reflection", "Water teal reflection"],
              ["Grade", colour.primary],
            ]} />
          </div>
        </section>

        {/* 6 — ORNAMENTS CLARITY — DONE */}
        <section aria-label="Ornaments clarity" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">06 · DONE</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Ornaments Clarity</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Every ornament sharp, every bead counted, every hand correct — nothing melting, nothing extra.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold"><BadgeCheck size={13} /> DONE · {ornament.detailer}</span>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="CROWN / MUKUT" icon={Crown} items={[
              ["Crown / Mukut", ornament.crown],
              ["Stones", "Sharp gold detail, stones clear"],
              ["Peacock Feather", "Peacock feather clear"],
            ]} />
            <ParamGrid title="JEWELLERY" icon={Gem} items={[
              ["Jewellery", ornament.jewellery],
              ["Necklace · Earrings", "Each sharp, no melting"],
              ["Armlets · Bangles", "Each sharp, no melting"],
              ["Hands", "No extra fingers / hands"],
            ]} />
            <ParamGrid title="MALA" icon={Sparkles} items={[
              ["Mala", ornament.mala],
              ["Rudraksha", "Clear beads, clear count"],
              ["Tulsi / Lotus", "Clear beads, clear count"],
            ]} />
            <ParamGrid title="FABRIC" icon={Layers} items={[
              ["Fabric", ornament.fabric],
              ["Saree / Dhoti", "Weave clear"],
              ["Border", "Gold zari clear"],
            ]} />
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">ORNAMENTS CHECKLIST — CHECK EVERY POSTER</p>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {ornamentChecklist.map(q => (
                <li key={q} className="flex items-center gap-2 rounded-xl border border-[var(--line-2)] bg-[var(--surface-2)] px-3 py-2.5 text-sm font-bold"><BadgeCheck size={16} className="shrink-0 text-[var(--gold)]" />{q}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-[var(--muted)]">Face Detailer + Jewellery Detailer: <span className="font-bold text-[var(--text)]">{ornament.detailer}</span></p>
          </div>
        </section>

        {/* 7 — THUMBNAIL CTR — DONE */}
        <section aria-label="Thumbnail CTR" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">07 · DONE</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Thumbnail CTR</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">The thumbnail must win the click in 3 seconds — one face, one title, one feeling.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold"><BadgeCheck size={13} /> DONE</span>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4 text-center">
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">CTR SCORE — L{level.n}</p>
              <p className="font-display text-5xl mt-2">{ctr.score}<span className="text-2xl text-[var(--muted)]">/10</span></p>
              <p className="mt-1 text-xs font-extrabold">{ctr.target}</p>
              {level.n === 30 && <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">L30 thumbnail is built to clear 9+ — face, title, contrast and curiosity all working together.</p>}
            </div>
            <div className="md:col-span-2 rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--teal)]">CTR SCORE GUIDE — OUT OF 10</p>
              {[
                ["Title clarity", 3, "3 / 10"],
                ["Face", 3, "3 / 10"],
                ["Contrast", 2, "2 / 10"],
                ["Curiosity", 2, "2 / 10"],
              ].map(([label, pts, text]) => (
                <div key={label as string} className="mt-3">
                  <div className="flex justify-between text-[13px] font-bold"><span>{label}</span><span className="text-[var(--gold-2)]">{text}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-[var(--surface-3)] overflow-hidden"><div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${(Number(pts) / 10) * 100}%` }} /></div>
                </div>
              ))}
              <p className="mt-3 text-[13px] text-[var(--muted)]">Title clarity 3 + Face 3 + Contrast 2 + Curiosity 2 = 10. Lose one, lose the click.</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="FACE" icon={Eye} items={[
              ["Face", ctr.face],
              ["Expression", "Clear expression — Shant / Prem / Veer"],
              ["Eyes", "Eye contact"],
            ]} />
            <ParamGrid title="CONTRAST" icon={Palette} items={[
              ["Contrast", ctr.contrast],
              ["Title", "Gold title on dark teal"],
              ["Outline", "White outline · Big readable title"],
            ]} />
            <ParamGrid title="FOCUS" icon={Focus} items={[
              ["Focus", ctr.focus],
              ["Subject", "One main subject, not crowded"],
              ["Rule", "3-second rule"],
            ]} />
            <ParamGrid title="CURIOSITY" icon={Target} items={[
              ["Curiosity", ctr.curiosity],
              ["Hook", "Question / Leela moment"],
              ["Examples", "Dhanush Bhang, Govardhan"],
            ]} />
          </div>
        </section>

        {/* VARIATION CHECKLIST */}
        <section aria-label="Variation checklist" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">VARIATION CHECKLIST · CHECK BEFORE FINAL</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Variation Checklist — L{level.n}</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Final karne se pehle har point check karo. Koi bhi 2 points pichhle poster se same hain, to naya variation banao.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold"><Shuffle size={13} /> UNIQUE CHECK</span>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {variationChecklist.map(item => (
              <article key={item.q} className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                <div className="flex items-center gap-2"><BadgeCheck size={17} className="shrink-0 text-[var(--gold)]" /><h3 className="font-display text-[17px] leading-tight">{item.q}</h3></div>
                <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">{item.detail}</p>
              </article>
            ))}
            <article className="rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
              <div className="flex items-center gap-2"><RefreshCw size={17} className="shrink-0 text-[var(--gold)]" /><h3 className="font-display text-[17px] leading-tight">If any 2 same?</h3></div>
              <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">Regenerate with new variation — angle + pose + light + background + title placement sab badlo. Previous combination reuse nahi.</p>
            </article>
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4">
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">VARIATION FOR THIS LEVEL — L{level.n} · {level.name.toUpperCase()}</p>
            <p className="mt-1 text-[15px] font-bold leading-snug">Angle: {variation.angle} · Pose: {variation.pose}</p>
            <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">Light: {variation.light} · Background: {variation.background} · Title: {variation.title} · Scene: {variation.scene}</p>
          </div>
        </section>

        {/* COMPLETED — ALL 7 FORMERLY PENDING SECTIONS */}
        <section aria-label="Completed production sections" className="mt-5 rounded-3xl border-2 border-[var(--gold)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--gold-2)]">COMPLETED · 100% · NO PENDING SECTIONS</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Production Complete — Audio to Storyboard</h2>
              <p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">All seven sections are live and inside the one master prompt. Choose language, length and LUT — the prompt, storyboard and export update together.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold"><CheckCircle2 size={13} /> DONE · 7 / 7</span>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedItems.map(item => (
              <article key={item.title} className="rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                <div className="flex items-start justify-between gap-2"><h3 className="font-display text-[17px] leading-tight">{item.title}</h3><span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--gold)] text-black text-[10px] font-extrabold"><CheckCircle2 size={11} /> DONE</span></div>
                <p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--muted)] flex items-center gap-1"><Languages size={13} /> VOICEOVER LANGUAGE</p><div className="mt-2 flex flex-wrap gap-2">{languageOptions.map(o => <button key={o.id} onClick={() => setLanguage(o.id)} aria-pressed={language === o.id} className={`px-3 py-2 rounded-full text-sm font-bold border ${language === o.id ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "bg-[var(--surface-2)] border-[var(--line-2)]"}`}>{o.label}</button>)}</div><p className="mt-1.5 text-xs text-[var(--muted)]">{languageOptions.find(o => o.id === language)?.hint}</p></div>
            <div><p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--muted)]">VIDEO LENGTH</p><div className="mt-2 flex flex-wrap gap-2">{lengthOptions.map(o => <button key={o.id} onClick={() => setLengthId(o.id)} aria-pressed={lengthId === o.id} className={`px-3 py-2 rounded-full text-sm font-bold border ${lengthId === o.id ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "bg-[var(--surface-2)] border-[var(--line-2)]"}`}>{o.label}</button>)}</div><p className="mt-1.5 text-xs text-[var(--muted)]">Voiceover: {lenOpt.words} · Storyboard total {lenOpt.seconds} sec</p></div>
            <div><p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--muted)]">COLOUR LUT</p><div className="mt-2 flex flex-wrap gap-2"><button onClick={() => setLutId("")} aria-pressed={lutId === ""} className={`px-3 py-2 rounded-full text-sm font-bold border ${lutId === "" ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "bg-[var(--surface-2)] border-[var(--line-2)]"}`}>Auto · {lutFor(deity).name}</button>{lutPresets.map(o => <button key={o.id} onClick={() => setLutId(o.id)} aria-pressed={lutId === o.id} className={`px-3 py-2 rounded-full text-sm font-bold border ${lutId === o.id ? "bg-[var(--gold)] text-black border-[var(--gold)]" : "bg-[var(--surface-2)] border-[var(--line-2)]"}`}>{o.name}</button>)}</div><p className="mt-1.5 text-xs text-[var(--muted)]">Selected: {lut.name} — {lut.grade}</p></div>
          </div>
        </section>

        <section aria-label="Audio Music" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">08 · DONE</p><h2 className="font-display text-2xl sm:text-3xl mt-1">Audio / Music</h2><p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Soft devotional score matched to the deity — never loud, never copyrighted Bollywood.</p></div><span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold"><AudioLines size={13} className="inline mr-1" /> {audio.instruments}</span></div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4"><p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">PROMPT LINE</p><p className="mt-1 text-[15px] font-bold leading-snug">AUDIO: {deity.name} - {audio.instruments} - Soft devotional - 20% volume</p></div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="MUSIC" icon={AudioLines} items={[["Instruments", audio.instruments], ["Base", "Flute + Tabla + Tanpura soft"], ["No loud beats", "No loud beats"], ["No copyrighted Bollywood", "Original devotional score only"], ["SFX", audio.sfx]]} />
            <ParamGrid title="MIX" icon={Music} items={[["Voice", "80%"], ["Music", "20%"], ["Mix", audio.mix], ["Loop", audio.loop], ["Cut", "No abrupt cut"]]} />
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">Deity match: Shiv — Damru + Om chant soft · Ram — Sitar + Dholak soft · Krishna — Bansuri + Tabla · Vishnu — Shankh + Harmonium soft. All others use Flute + Tabla + Tanpura soft.</p>
        </section>

        <section aria-label="Voiceover Dialogue" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">09 · DONE</p><h2 className="font-display text-2xl sm:text-3xl mt-1">Voiceover / Dialogue</h2><p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Calm, divine, slow, clear — never fast, never AI robotic.</p></div><span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold">{language} · {vo.words}</span></div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4"><p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">PROMPT LINE</p><p className="mt-1 text-[15px] font-bold leading-snug">VOICEOVER: {language} - Calm Divine - {vo.words} - Hook + Story + Shloka + CTA</p></div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="SCRIPT FORMAT" icon={Mic} items={[["Hook", "3 sec"], ["Story / Teaching", "Main teaching from the deity nature"], ["Shloka / Mantra", "Govinday Namo Namah"], ["CTA", "Comment “Govinday Namo Namah”"], ["Voice style", vo.style]]} />
            <ParamGrid title="WORD BUDGET" icon={Languages} items={[["Shorts 30 sec", "70–80 words max"], ["1 min", "140–150 words"], ["5 min", "700 words"], ["Selected", `${lenOpt.label} · ${vo.words}`]]} />
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4 space-y-2 text-sm leading-relaxed"><p><b>Hook:</b> {vo.hook}</p><p><b>Story:</b> {vo.story}</p><p><b>Shloka:</b> {vo.shloka}</p><p><b>CTA:</b> {vo.cta}</p></div>
        </section>

        <section aria-label="Editing Pacing" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">10 · DONE</p><h2 className="font-display text-2xl sm:text-3xl mt-1">Editing / Pacing</h2><p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Slow divine drift — the edit breathes with the prayer.</p></div><span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold">SLOW · NO FLASH</span></div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4"><p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">PROMPT LINE</p><p className="mt-1 text-[15px] font-bold leading-snug">EDITING: Slow + Fade/Dissolve + Slow Zoom + Gold Dust</p></div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="PACING" icon={Scissors} items={[["Pacing", "Slow divine drift"], ["1 scene", "3–5 sec"], ["Cuts", "No fast cuts · No flash"], ["Transitions", "Fade + Dissolve + Slow Zoom-in"], ["No hard cut", "No hard cut · No glitch"]]} />
            <ParamGrid title="TEXT + EFFECTS" icon={Type} items={[["Title", "Title TOP only"], ["Subtitles", "Centre-lower · Small white · Black shadow"], ["Bottom", "No bottom big text"], ["Effects", "Gold Dust float · God-Ray pulse · Petal fall · Slow zoom"]]} />
          </div>
        </section>

        <section aria-label="Colour LUT" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">11 · DONE</p><h2 className="font-display text-2xl sm:text-3xl mt-1">Colour LUT</h2><p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Five presets — auto-matched to the deity, or pick one yourself above.</p></div><span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold">{lut.name}</span></div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4"><p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">PROMPT LINE</p><p className="mt-1 text-[15px] font-bold leading-snug">COLOUR LUT: {lut.name} - {lut.grade}</p></div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{lutPresets.map(l => <article key={l.id} className={`rounded-2xl border p-4 ${l.id === lut.id ? "border-[var(--gold)] bg-[var(--gold-soft)]" : "border-[var(--line-2)] bg-[var(--surface-2)]"}`}><h3 className="font-display text-[17px] leading-tight">{l.name}</h3><p className="mt-1 text-[13px] font-bold text-[var(--gold-2)]">{l.grade} · {l.forDeity}</p><p className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed">{l.detail}</p>{l.id === lut.id && <span className="mt-3 inline-block text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[var(--gold)] text-black">SELECTED</span>}</article>)}</div>
        </section>

        <section aria-label="Title Animation" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">12 · DONE</p><h2 className="font-display text-2xl sm:text-3xl mt-1">Title Animation</h2><p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Gold, slow, reverent — never bouncy, never popping.</p></div><span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold">TOP CENTRE · 2 SEC HOLD</span></div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4"><p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">PROMPT LINE</p><p className="mt-1 text-[15px] font-bold leading-snug">TITLE ANIMATION: Gold Fade-in Top, Slow Scale, Sparkle</p></div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ParamGrid title="TITLE" icon={Type} items={[["Animation", "Gold fade-in from top"], ["Scale", "Slow scale 95% to 100%"], ["Sparkle", "Sparkle on title"], ["No bounce", "No bounce · No pop"], ["Position", "Title stays TOP Centre, Below IBD"], ["Hold", "2 sec hold, Then fade to scene"]]} />
            <ParamGrid title="SUBTITLE" icon={Type} items={[["Animation", "Word-by-word fade"], ["Size", "Small white"], ["Shadow", "Black shadow"], ["Position", "Centre-lower"], ["Bottom", "No bottom big text"]]} />
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4"><div className="flex justify-between text-xs font-extrabold"><span>IBD</span><span className="text-[var(--muted)]">TOP-LEFT ONLY</span></div><div className="py-3 text-center"><span className="gold-text font-display text-2xl">{deity.name}</span><p className="text-[11px] text-[var(--muted)] mt-1">Gold fade-in · Slow scale · Sparkle · TOP Centre, Below IBD</p></div><p className="text-center text-[11px] font-bold">An Indian Bhakti Dhara Production</p></div>
        </section>

        <section aria-label="Platform Export" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">13 · DONE</p><h2 className="font-display text-2xl sm:text-3xl mt-1">Platform Export</h2><p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">The right size, fps and codec for the selected platform — set by the platform you already chose.</p></div><span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold">{ex.label}</span></div>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gold-soft)] p-4"><p className="text-[11px] font-extrabold tracking-[0.16em] text-[var(--gold-2)]">PROMPT LINE</p><p className="mt-1 text-[15px] font-bold leading-snug">EXPORT: {ex.label} - {ex.size} - {ex.fps} - MP4</p></div>
          <div className="mt-4 rounded-2xl border border-[var(--line-2)] overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-2 bg-[var(--surface-3)] px-4 py-2.5 text-[11px] font-extrabold tracking-[0.12em] text-[var(--muted)]"><span className="col-span-3">PLATFORM</span><span className="col-span-2">SIZE</span><span className="col-span-2">FPS</span><span className="col-span-2">CODEC</span><span className="col-span-3">THUMBNAIL</span></div>
            {platforms.map(p2 => { const e2 = exportFor(p2); const active = p2.id === platformId; return (<div key={p2.id} className={`grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 px-4 py-3 border-t border-[var(--line-2)] ${active ? "bg-[var(--gold-soft)]" : "bg-[var(--surface-2)]"}`}><span className="md:col-span-3 text-[14px] font-extrabold">{p2.name}{active && <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-[var(--gold)] text-black">SELECTED</span>}</span><span className="md:col-span-2 text-[13px]">{e2.size} · {e2.ratio}</span><span className="md:col-span-2 text-[13px]">{e2.fps}</span><span className="md:col-span-2 text-[13px]">{e2.codec}</span><span className="md:col-span-3 text-[13px] text-[var(--muted)]">{e2.thumb}</span></div>); })}
          </div>
        </section>

        <section aria-label="Storyboard Script" className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">14 · DONE</p><h2 className="font-display text-2xl sm:text-3xl mt-1">Storyboard / Script</h2><p className="text-sm text-[var(--muted)] mt-1 max-w-2xl">Scene No. | Visual | Voiceover | Music | Duration | Title TOP — generated from your Deity + Platform + Length.</p></div><button onClick={handleGenerate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--gold)] text-black text-sm font-extrabold"><WandSparkles size={15} /> Generate Full Storyboard + Script + All Prompts</button></div>
          {generatedAt && <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[var(--gold-2)]"><CheckCircle2 size={16} /> Generated {generatedAt} — full storyboard + script + all prompts are in the ONE code block below.</p>}
          <div className="mt-4 rounded-2xl border border-[var(--line-2)] overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-2 bg-[var(--surface-3)] px-4 py-2.5 text-[11px] font-extrabold tracking-[0.12em] text-[var(--muted)]"><span className="col-span-1">SCENE</span><span className="col-span-4">VISUAL (L30 PROMPT)</span><span className="col-span-3">VOICEOVER</span><span className="col-span-2">MUSIC</span><span className="col-span-1">TIME</span><span className="col-span-1">TITLE</span></div>
            {scenes.map(s => (<div key={s.no} className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 px-4 py-3 border-t border-[var(--line-2)] bg-[var(--surface-2)]"><span className="md:col-span-1 text-[14px] font-extrabold text-[var(--gold-2)]">Scene {s.no}</span><span className="md:col-span-4 text-[13px] leading-relaxed">{s.visual}</span><span className="md:col-span-3 text-[13px] leading-relaxed text-[var(--muted)]">{s.voiceover}</span><span className="md:col-span-2 text-[13px]">{s.music}</span><span className="md:col-span-1 text-[13px] font-bold">{s.duration} sec</span><span className="md:col-span-1 text-[13px] font-bold">Title TOP</span></div>))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">Example built in: Ram Darbar · 30 sec = Scene 1 Ayodhya Mahal 5 sec · Scene 2 Ram–Sita 10 sec · Scene 3 Hanuman kneel 10 sec · Scene 4 CTA 5 sec. Select Ram Darbar + YouTube Shorts + 30 sec to see it exactly.</p>
        </section>

        <section className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
          <div className="p-5 sm:p-6 pb-0 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">READY TO USE</p>
              <h2 className="font-display text-2xl sm:text-3xl mt-1">Master Prompt — L{level.n} {level.name} · {platform.name} · {deity.name}</h2>
              <p className="text-sm text-[var(--muted)] mt-1">One single code block for the selected level + platform — Platform Dimensions, Positive, Negative, CGI Best Parameters, then Branding + Logo — in that order. Select the text to use it in your image tool. Platform: {platform.name} · {platform.ratio} · {platform.resolution} · {platform.title} · Bottom Clean.</p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[var(--gold)] text-black text-xs font-extrabold">L{level.n} · {level.resolution} · {level.steps} STEPS</span>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={handleGenerate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--gold)] text-black text-sm font-extrabold"><WandSparkles size={15} /> Generate Full Storyboard + Script + All Prompts</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--line)] bg-[var(--surface-2)] text-sm font-bold disabled:opacity-50"><Save size={15} /> {saving ? "Saving…" : "Save This Prompt Pack"}</button>
              {generatedAt && <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--gold-2)]"><CheckCircle2 size={16} /> Generated {generatedAt}</span>}
              {saveMsg && <span className="text-sm font-semibold text-[var(--muted)]">{saveMsg}</span>}
            </div>
            <label className="sr-only" htmlFor="master-prompt">Master prompt text</label>
            <textarea id="master-prompt" readOnly value={prompt} rows={18}
              className="prompt-box w-full resize-y min-h-[340px] rounded-2xl border border-[var(--line)] bg-[#071011] text-[#f5efe0] p-4 sm:p-5 text-[14px] leading-[1.75] outline-none focus:border-[var(--gold)]" />
            <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">One code block only — the full prompt lives inside the box above. Nothing is split across separate blocks. Generate uses your selected Deity + Platform + Length to build the storyboard, script and all prompt lines into this one block.</p>
            <div className="mt-5 rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-display text-lg">Saved Prompt Packs</h3><button onClick={loadPacks} className="text-xs font-extrabold px-3 py-1.5 rounded-full border border-[var(--line-2)]">Refresh</button></div>
              {packsLoading ? <p className="mt-2 text-sm text-[var(--muted)]">Loading saved packs…</p> : packsError ? <p className="mt-2 text-sm text-[var(--muted)]">{packsError}</p> : packs.length === 0 ? <p className="mt-2 text-sm text-[var(--muted)]">No saved packs yet. Generate a prompt above, then choose Save This Prompt Pack.</p> : <ul className="mt-3 space-y-2">{packs.map((r: any) => <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--line-2)] bg-[var(--surface)] px-3 py-2.5"><span className="text-sm font-bold">{r.value?.title ?? "Prompt pack"} <span className="text-xs font-semibold text-[var(--muted)]">· {r.value?.language} · {r.value?.length} · {r.value?.lut}</span></span><button onClick={() => handleDelete(r.id)} disabled={deletingId === r.id} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border border-[var(--line-2)] disabled:opacity-50"><Trash2 size={13} /> {deletingId === r.id ? "Removing…" : "Remove"}</button></li>)}</ul>}
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 rounded-3xl border border-[var(--line-2)] bg-[var(--surface)] p-5 sm:p-6">
            <p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--teal)]">LEVEL RULES</p>
            <h2 className="font-display text-2xl mt-1">When to use each level</h2>
            <div className="mt-4 space-y-3">
              {rules.map(r => (
                <div key={r.range} className={`rounded-2xl border p-4 flex gap-3 ${r.range === "L30" ? "border-[var(--line)] bg-[var(--gold-soft)]" : "border-[var(--line-2)] bg-[var(--surface-2)]"}`}>
                  <div className={`shrink-0 w-16 rounded-xl grid place-items-center text-center px-1 py-2 font-extrabold text-sm leading-tight ${r.range === "L30" ? "bg-[var(--gold)] text-black" : "bg-[var(--surface-3)] text-[var(--gold-2)]"}`}>{r.range}</div>
                  <div className="min-w-0">
                    <p className="font-bold">{r.title} <span className="font-hindi font-normal text-[var(--muted)]">· {r.hindi}</span></p>
                    <p className="text-sm text-[var(--muted)] leading-relaxed mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--muted-2)]">Quick rule: L1–L17 Draft → L18 Minimum for Posting → L19 Old Top → L20 New Top → L30 Infinity Final Top.</p>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[var(--gold)]"><ShieldCheck size={20} /><p className="text-[11px] font-extrabold tracking-[0.2em] text-[var(--text)]">BRANDING RULE CARD</p></div>
              <h3 className="font-display text-xl mt-3 leading-snug">Clean, consistent<br />Indian Bhakti Dhara branding.</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">01</span><span><b>Top-left: IBD only.</b> One clean IBD mark in the top-left corner.</span></li>
                <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">02</span><span><b>Bottom-centre:</b> An Indian Bhakti Dhara Production.</span></li>
                <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">03</span><span><b>No instruction on poster.</b> No prompt, settings or level tag on the artwork.</span></li>
                <li className="flex gap-2"><span className="text-[var(--gold)] font-extrabold">04</span><span><b>No Om logo.</b> No circular logo. Keep the frame clean.</span></li>
              </ul>
              <div className="mt-5 rounded-2xl border border-[var(--line-2)] bg-[var(--surface-2)] p-4">
                <div className="flex justify-between text-xs font-extrabold"><span>IBD</span><span className="text-[var(--muted)]">TOP-LEFT ONLY</span></div>
                <div className="h-16 grid place-items-center"><span className="font-hindi text-[var(--muted)]">भक्ति धारा · Poster Preview</span></div>
                <p className="text-center text-[11px] font-bold">An Indian Bhakti Dhara Production</p>
                <p className="text-center text-[10px] text-[var(--muted)] mt-1">BOTTOM-CENTRE</p>
              </div>
            </div>
            <div className="rounded-3xl bg-[var(--teal-deep)] text-white p-5">
              <p className="font-display text-xl leading-snug">From Draft to Infinity.</p>
              <p className="text-sm text-white/80 leading-relaxed mt-2">Start at L1 to explore. Post from L18. Finish at L30 for hero posters — <span className="font-hindi">अनंत भक्ति, अनंत सिनेमा।</span></p>
              <p className="mt-4 text-xs font-extrabold tracking-[0.18em]">L{level.n} SELECTED · {level.name.toUpperCase()}</p>
            </div>
          </div>
        </section>

        <footer className="mt-8 pt-5 border-t border-[var(--line-2)] flex flex-wrap justify-between gap-3 text-xs text-[var(--muted-2)]">
          <span>Indian Bhakti Dhara · L1–L30 Master Prompt Tool</span>
          <span className="font-hindi">जय भक्ति धारा · OTT Premium Ultra</span>
        </footer>
      </main>
    </div>
  );
}
