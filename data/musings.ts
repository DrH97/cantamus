import type { Musing } from "@/types";

export const musings: Musing[] = [
  {
    id: "advent-waiting",
    title: "The Sacred Silence of Advent",
    excerpt:
      "As the liturgical year begins anew, we reflect on how Advent's quiet anticipation shapes our musical expression and draws us deeper into the mystery of the Incarnation.",
    content:
      'Advent is a season that resists the noise of the world. While the streets fill with premature celebration, the Church invites us into a posture of waiting — a sacred silence that prepares the heart for the coming of the Lord.\n\nFor a choir like Cantamus, Advent poses a beautiful challenge. How do we sing the longing of a people awaiting their Saviour? The answer lies in the repertoire itself. The haunting simplicity of the "Rorate Caeli" chant, the restrained beauty of "O Come, O Come, Emmanuel" — these pieces do not demand attention; they invite contemplation.\n\nIn the African tradition, Advent carries its own flavour. The call-and-response style mirrors the dialogue between God and His people, a conversation that stretches across millennia. When we sing "Njoo, Njoo Emanueli" in Swahili, we join our voices to that ancient conversation, adding the particular timbre of East African faith.\n\nAs we enter this season, we encourage our community to embrace the silence between the notes. It is there, in the space where sound gives way to stillness, that the Word is most clearly heard.',
    date: "2025-12-15",
    author: "Cantamus Editorial",
    category: "liturgy",
  },
  {
    id: "gregorian-chant-today",
    title: "Why Gregorian Chant Still Matters",
    excerpt:
      "In a world of constant noise, the ancient melodies of Gregorian chant offer a counter-cultural invitation to contemplation. We explore its enduring relevance in the modern liturgy.",
    content:
      'The Second Vatican Council called Gregorian chant the music "specially suited to the Roman liturgy" and gave it "pride of place" in liturgical services. Yet decades later, many Catholics have never heard it sung at Mass. At Cantamus, we believe this ancient tradition deserves not merely preservation but a living, breathing place in our worship.\n\nGregorian chant is not background music. It is prayer made audible. Each melody was composed to serve the sacred text, not to showcase the singer. The single melodic line — unaccompanied, unhurried — strips away everything that is not essential. What remains is the Word, carried on breath and offered back to God.\n\nFor young professionals navigating the relentless pace of Nairobi, chant offers something countercultural: slowness with purpose. The melismatic passages of the Gradual, where a single syllable unfolds over many notes, teach us that not everything of value can be rushed. The reciting tones of the psalm verses show that simplicity is not the same as poverty.\n\nWe do not sing chant out of nostalgia. We sing it because it works — because it opens a space in the liturgy where the sacred can be encountered without distraction. Paired with the rich harmonies of African hymnody and the grandeur of classical polyphony, Gregorian chant gives our worship a foundation that is both ancient and startlingly alive.',
    date: "2025-11-20",
    author: "Cantamus Editorial",
    category: "reflection",
  },
  {
    id: "november-reflections",
    title: "November: Songs for the Faithful Departed",
    excerpt:
      "This month we turn our hearts and voices toward remembrance. A look at the requiem tradition and how African musical heritage honours those who have gone before us.",
    content:
      'November belongs to the dead — not in a morbid sense, but in the profoundly Christian conviction that love does not end at the grave. The Church dedicates this month to remembering the faithful departed, and music has always been central to that remembrance.\n\nThe Western requiem tradition gives us some of the most powerful sacred music ever composed. From the stark beauty of the Gregorian "Requiem aeternam" introit to Mozart\'s luminous Lacrimosa, these works wrestle honestly with grief while pointing firmly toward hope. The Dies Irae, with its driving rhythm and apocalyptic imagery, reminds us that death is serious — but the Lux Aeterna that follows promises that the final word belongs to light.\n\nIn East African cultures, death is communal. The bereaved are not left alone; the community gathers, and singing is not optional — it is essential. Swahili hymns for the departed often carry a gentle rocking rhythm, as if cradling the soul on its journey. "Pumzika kwa Amani" (Rest in Peace) is not a farewell but a commission: we entrust our beloved to the God who holds all things.\n\nAt Cantamus, we find that bringing these traditions together during November creates something greater than either alone. The solemnity of the Latin requiem meets the warmth of African communal mourning, and together they speak a fuller truth: that death is real, that grief is holy, and that the communion of saints is not a metaphor but a living reality we enter every time we sing.',
    date: "2025-11-01",
    author: "Cantamus Editorial",
    category: "monthly",
  },
  {
    id: "african-polyphony",
    title: "African Polyphony and the Universal Church",
    excerpt:
      "The rich polyphonic traditions of East Africa carry a theology of community and participation. How does this gift enrich the Church's liturgical treasury?",
    content:
      'When the Second Vatican Council called for the treasures of sacred music to be preserved and fostered, it also opened the door for the musical traditions of every culture to enrich the liturgy. In East Africa, that invitation has borne remarkable fruit.\n\nAfrican polyphony is not a lesser cousin of European counterpoint. It is a distinct musical language with its own logic, beauty, and theological depth. Where European polyphony often begins with a composed score, African polyphonic singing frequently emerges from the community itself — voices finding their parts by ear, guided by a shared musical instinct that is learned from childhood.\n\nThis has profound liturgical implications. In African polyphonic singing, there is no audience. Every voice matters; every person participates. This is not merely a cultural preference — it is a lived theology of the Body of Christ, where each member has a role and no part is dispensable.\n\nThe call-and-response structure that underlies much East African sacred music mirrors the dialogical nature of the liturgy itself. The cantor calls; the assembly responds. God speaks; the people answer. This ancient pattern, present in both the psalms and in African oral tradition, reminds us that worship is not performance but conversation.\n\nAt Cantamus, we are committed to singing African sacred music not as an exotic addition but as an integral voice in the Church\'s choir. When "Bwana Utuhurumie" follows the Gregorian Kyrie, it is not a stylistic contrast — it is the same prayer, offered in a different tongue, drawing from a different well of beauty, but reaching toward the same God.',
    date: "2025-10-10",
    author: "Cantamus Editorial",
    category: "liturgy",
  },
];

export const categoryLabels: Record<Musing["category"], string> = {
  liturgy: "Liturgy",
  reflection: "Reflection",
  monthly: "Monthly Thoughts",
};

export const getMusingById = (id: string) =>
  musings.find((musing) => musing.id === id);

export const getMusingsByCategory = (category: Musing["category"]) =>
  musings.filter((musing) => musing.category === category);
