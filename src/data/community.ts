export type Thread = {
  id: string;
  title: string;
  cat: string;
  author: string;
  authorRole: string;
  replies: number;
  votes: number;
  time: string;
  hot?: boolean;
  expert?: boolean;
};

export const THREADS: Thread[] = [
  { id: "t1", title: 'What exactly makes a biochar credit "additional" under VM0044?', cat: "Carbon Markets", author: "Mariam Hassan", authorRole: "Project Dev · Tanzania", replies: 14, votes: 32, hot: true, expert: true, time: "2h ago" },
  { id: "t2", title: "How are buyers vetting MRV providers in 2026?", cat: "MRV", author: "Idris Salami", authorRole: "Buyer-side · Lagos", replies: 8, votes: 21, time: "4h ago" },
  { id: "t3", title: "Anyone successfully closed blended finance for blue carbon?", cat: "Finance", author: "Naledi Mokoena", authorRole: "Climate Finance", replies: 22, votes: 45, expert: true, time: "1d ago" },
  { id: "t4", title: "Permanence assumptions for soil carbon — too generous?", cat: "Carbon Markets", author: "Dr. Owusu", authorRole: "Soil scientist", replies: 31, votes: 67, hot: true, time: "2d ago" },
  { id: "t5", title: "Best resources to teach Article 6 to non-specialists?", cat: "Policy", author: "Faith Wanjiru", authorRole: "Educator", replies: 6, votes: 18, time: "3d ago" },
];

export type Podcast = {
  ep: number;
  title: string;
  dur: string;
  date: string;
  guest: string;
  role: string;
};

export const PODCASTS: Podcast[] = [
  { ep: 24, title: "Why most carbon credits won't survive 2027", dur: "42:18", date: "May 4", guest: "Kwame Mensah", role: "Project Developer · Ghana" },
  { ep: 23, title: "The blue carbon gold-rush", dur: "38:50", date: "Apr 27", guest: "Dr. Lerato Sithole", role: "Marine ecologist · S. Africa" },
  { ep: 22, title: "How a Lagos startup priced the first DAC offtake", dur: "51:12", date: "Apr 20", guest: "Tunde Aiyetan", role: "Founder · Climate Capital" },
  { ep: 21, title: "MRV is the bottleneck. Now what?", dur: "34:46", date: "Apr 13", guest: "Asha Kimani", role: "GIS / MRV lead · Kenya" },
  { ep: 20, title: "Article 6 explained, slowly", dur: "46:02", date: "Apr 6", guest: "Bola Adekunle", role: "Climate Policy · Nigeria" },
];
