export interface Source {
  id: string;
  name: string;
  headline: string;
  excerpt: string;
  language: "Hebrew" | "English" | "Arabic";
  timestamp: string;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  sourcesCount: number;
  sources: Source[];
  comparisonNotes: string[];
}

export const events: Event[] = [
  {
    id: "1",
    title: "Government Passes New Economic Reform Bill",
    summary:
      "The Israeli parliament approved a sweeping economic reform package aimed at reducing the cost of living and boosting competition in key sectors.",
    category: "Politics",
    timestamp: "2024-03-15T09:00:00Z",
    sourcesCount: 4,
    sources: [
      {
        id: "s1",
        name: "Haaretz",
        headline: "Knesset Approves Cost-of-Living Reform Despite Opposition Walkout",
        excerpt:
          "The bill passed with a slim majority after the opposition staged a dramatic walkout, denouncing the reform as insufficient and politically motivated ahead of local elections.",
        language: "English",
        timestamp: "2024-03-15T09:30:00Z",
        tags: ["analysis", "politics"],
      },
      {
        id: "s2",
        name: "Ynet",
        headline: "Economic Reform Passes: What Changes for Your Wallet",
        excerpt:
          "The new law is expected to lower prices in the food and telecommunications sectors within six months. Consumers may see savings of up to 15% on basic goods.",
        language: "Hebrew",
        timestamp: "2024-03-15T10:00:00Z",
        tags: ["breaking", "economy"],
      },
      {
        id: "s3",
        name: "The Times of Israel",
        headline: "Israel's Economic Reform Bill Clears Parliament in Contentious Vote",
        excerpt:
          "Economists are divided on the bill's likely impact. Supporters say it will spur competition; critics warn it does not address structural issues in the housing market.",
        language: "English",
        timestamp: "2024-03-15T11:00:00Z",
        tags: ["analysis"],
      },
      {
        id: "s4",
        name: "Maariv",
        headline: "Reform Bill Victory: Government Celebrates Major Legislative Win",
        excerpt:
          "Senior ministers praised the legislation as a historic step, with the Finance Minister calling it the most significant pro-consumer law passed in a decade.",
        language: "Hebrew",
        timestamp: "2024-03-15T12:00:00Z",
        tags: ["opinion"],
      },
    ],
    comparisonNotes: [
      "Framing: Haaretz focuses on political tension and the opposition walkout, while Maariv frames the vote as a government victory, reflecting each outlet's editorial lean.",
      "Emphasis: Ynet leads with direct consumer impact (price drops, savings), appealing to a mainstream audience primarily concerned with daily costs.",
      "Tone: The Times of Israel takes a measured analytical stance, presenting both supportive and critical economic viewpoints without a clear editorial position.",
      "Language gap: The Hebrew-language outlets (Ynet, Maariv) use more emotionally charged language, whereas English outlets opt for a cooler, more detached register.",
    ],
  },
  {
    id: "2",
    title: "Ceasefire Negotiations Enter Critical Phase",
    summary:
      "Mediators from Egypt and Qatar are pushing for a new ceasefire framework as fighting continues on multiple fronts, with both sides expressing cautious openness to talks.",
    category: "Security",
    timestamp: "2024-03-14T14:00:00Z",
    sourcesCount: 3,
    sources: [
      {
        id: "s5",
        name: "Haaretz",
        headline: "Hostage Families Plead for Deal as Ceasefire Talks Stall Again",
        excerpt:
          "Relatives of the remaining hostages held a vigil outside the Defense Ministry, urging the government to prioritize a humanitarian deal over military objectives.",
        language: "English",
        timestamp: "2024-03-14T14:30:00Z",
        tags: ["breaking", "opinion"],
      },
      {
        id: "s6",
        name: "Kan News",
        headline: "Mediators Present Revised Ceasefire Proposal; Israel Studies Terms",
        excerpt:
          "According to officials briefed on the talks, the latest proposal includes a phased hostage release and a temporary halt to major military operations in the north.",
        language: "Hebrew",
        timestamp: "2024-03-14T15:00:00Z",
        tags: ["breaking"],
      },
      {
        id: "s7",
        name: "Al-Monitor",
        headline: "Regional Powers Pressure Both Sides Toward Gaza Ceasefire Deal",
        excerpt:
          "Arab mediators are facing mounting pressure from Washington and Gulf states to broker an agreement before the Ramadan period, sources familiar with the negotiations said.",
        language: "English",
        timestamp: "2024-03-14T16:00:00Z",
        tags: ["analysis"],
      },
    ],
    comparisonNotes: [
      "Human angle vs. diplomatic angle: Haaretz leads with the emotional story of hostage families, while Kan News focuses on the procedural details of the proposal.",
      "Regional context: Al-Monitor uniquely situates the talks within broader geopolitical pressures — US, Gulf states, Ramadan — which the Israeli outlets do not emphasize.",
      "Source attribution: Kan News cites 'officials briefed on the talks,' suggesting closer access to the Israeli government's position; Al-Monitor uses 'sources familiar with negotiations,' implying a more neutral vantage point.",
    ],
  },
  {
    id: "3",
    title: "Tel Aviv Named Top Mediterranean Tech Hub",
    summary:
      "A new global index ranks Tel Aviv first among Mediterranean cities for startup density, venture capital investment, and tech talent, ahead of Barcelona and Athens.",
    category: "Technology",
    timestamp: "2024-03-13T08:00:00Z",
    sourcesCount: 3,
    sources: [
      {
        id: "s8",
        name: "Globes",
        headline: "Tel Aviv Tops Mediterranean Startup Index for Third Consecutive Year",
        excerpt:
          "The city attracted $4.2 billion in VC funding last year despite regional instability, underscoring the resilience and depth of Israel's tech ecosystem.",
        language: "Hebrew",
        timestamp: "2024-03-13T08:30:00Z",
        tags: ["analysis"],
      },
      {
        id: "s9",
        name: "The Jerusalem Post",
        headline: "Israel's Silicon Wadi Shines in New Global Tech Ranking",
        excerpt:
          "Industry leaders attribute the ranking to deep military-tech crossover, a strong university research base, and a culture that normalizes risk-taking and entrepreneurship.",
        language: "English",
        timestamp: "2024-03-13T09:00:00Z",
        tags: ["analysis", "opinion"],
      },
      {
        id: "s10",
        name: "Calcalist",
        headline: "Despite War, Tel Aviv Startups Raised More in 2023 Than Expected",
        excerpt:
          "Dozens of Israeli startups secured funding rounds even as the conflict began, with several founders telling Calcalist they are relocating back after briefly moving operations abroad.",
        language: "Hebrew",
        timestamp: "2024-03-13T10:00:00Z",
        tags: ["breaking"],
      },
    ],
    comparisonNotes: [
      "Resilience framing: Globes and Calcalist both acknowledge the ongoing conflict but use it to amplify a 'resilience' narrative. The Jerusalem Post omits the security context entirely.",
      "Audience focus: Calcalist, a business-focused outlet, includes on-the-ground founder voices and relocation decisions — details that appeal to investors and entrepreneurs.",
      "Tone: The Jerusalem Post's headline ('Silicon Wadi Shines') is more promotional, whereas Globes presents the ranking with comparative figures and a more analytical tone.",
    ],
  },
];

export function getEventById(id: string): Event | undefined {
  return events.find((e) => e.id === id);
}
