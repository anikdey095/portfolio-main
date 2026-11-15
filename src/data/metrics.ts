import { VerifiedMetric } from "@/types/portfolio";

export const verifiedMetrics: VerifiedMetric[] = [
  {
    "value": "99.55%",
    "label": "Crop Recommender Test Accuracy",
    "detail": "Random Forest (80 trees) on a 20% stratified hold-out of 2,200 samples across 22 crops; 99.59% mean 5-fold stratified CV.",
    "source": "CropPulse AI — github.com/anikdey095/crop-recommendation",
    "verified": true
  },
  {
    "value": "~90.1%",
    "label": "BiGRU Emotion Classification Accuracy",
    "detail": "Best of four sequence models (SimpleRNN, LSTM, GRU, BiGRU) on the 6-class dair-ai/emotion benchmark.",
    "source": "Moodline — github.com/anikdey095/Deep_Learning_Project_Sentiment_analysis",
    "verified": true
  },
  {
    "value": "3",
    "label": "Live AI/ML Web Apps",
    "detail": "CropPulse AI (Vercel), Moodline (Render), and FocusBell AI (Vercel) are publicly deployed and accessible.",
    "source": "Project live deployments",
    "verified": true
  },
  {
    "value": "Dec 2026",
    "label": "Undergraduate Graduation",
    "detail": "B.Sc. in CSE, Metropolitan University, Sylhet, Bangladesh — preparing for AI/ML roles and Master's applications abroad.",
    "source": "Academic Timeline",
    "verified": true
  }
];
