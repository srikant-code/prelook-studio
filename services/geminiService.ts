import { GoogleGenAI } from "@google/genai";
import { GeneratedImages, Salon } from "../types";

const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';
const MAPS_MODEL_NAME = 'gemini-2.5-flash';

let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

// Helper to generate a single image view
const generateSingleView = async (
  base64Image: string,
  basePrompt: string,
  viewAngle: string
): Promise<string | null> => {
  try {
    const client = getAIClient();
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    // Refined prompt to support highlighting
    const fullPrompt = `Edit this image. Apply this style: ${basePrompt}. 
    IMPORTANT: Generate the view from the ${viewAngle}. 
    Maintain facial identity/head shape where possible. 
    If view is 'Front', keep original pose.
    Style: High quality, photorealistic, cinematic natural lighting, 8k resolution. 
    Ensure hair texture is detailed and realistic.`;

    const response = await client.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg',
            },
          },
          { text: fullPrompt },
        ],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error(`Error generating ${viewAngle}:`, error);
    return null;
  }
};

// Generate ONLY the front view (Free/Default)
export const generateFrontView = async (
  base64Image: string,
  prompt: string
): Promise<GeneratedImages> => {
  const front = await generateSingleView(base64Image, prompt, "Front view");
  return { front, left: null, right: null, back: null };
};

// Generate the remaining views (Premium/Credit Unlock)
export const generateRemainingViews = async (
  base64Image: string,
  prompt: string
): Promise<Partial<GeneratedImages>> => {
  const [left, right, back] = await Promise.all([
    generateSingleView(base64Image, prompt, "Left side profile"),
    generateSingleView(base64Image, prompt, "Right side profile"),
    generateSingleView(base64Image, prompt, "Back view (rear)"),
  ]);

  return { left, right, back };
};

export const findNearbySalons = async (
  latitude: number,
  longitude: number
): Promise<Salon[]> => {
  // Hardcoded Bhubaneswar Luxury Salons as requested
  // In a real app, this would query a backend or Google Places API heavily filtered
  
  const salons: Salon[] = [
      {
          id: 'looks-bbsr',
          title: "Looks Salon",
          uri: "https://www.lookssalon.in",
          priceRange: "$$$",
          specialty: "Premium Styling & Makeover",
          availableSlots: 4,
          distance: "2.5 km",
          rating: 4.8,
          address: "Janpath Road, Saheed Nagar, Bhubaneswar",
          description: "Looks Salon is a premium beauty salon for men and women who desire to look the best every day. Getting a makeover not only changes the appearance of a person but also brings back the lost confidence and Looks Salon would take pride in being a part of it.",
          imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop",
          stylists: ["Rahul Sharma", "Priya Das", "Amit Verma"],
          services: [
              { id: 'l1', name: 'Director Cut (Men)', duration: '45 min', price: 800 },
              { id: 'l2', name: 'Director Cut (Women)', duration: '60 min', price: 1500 },
              { id: 'l3', name: 'Loreal Hair Spa', duration: '90 min', price: 2500 },
              { id: 'l4', name: 'Global Color', duration: '120 min', price: 4000 }
          ]
      },
      {
          id: 'toni-guy-bbsr',
          title: "Toni & Guy",
          uri: "https://toniandguy.com",
          priceRange: "$$$$",
          specialty: "Creative Cuts & Texture",
          availableSlots: 2,
          distance: "5.1 km",
          rating: 4.9,
          address: "Esplanade One Mall, Rasulgarh, Bhubaneswar",
          description: "TONI&GUY is a multi-award winning hairdressing brand with more than 55 years of experience in education, superior client service and haircare expertise. We bring the London fashion scene to Bhubaneswar.",
          imageUrl: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2574&auto=format&fit=crop",
          stylists: ["Sandeep Singh", "Meera Nair", "John Doe"],
          services: [
              { id: 't1', name: 'Creative Cut & Finish', duration: '60 min', price: 1800 },
              { id: 't2', name: 'Toni&Guy Signature Color', duration: '150 min', price: 5500 },
              { id: 't3', name: 'Keratin Smoothing', duration: '180 min', price: 7000 },
              { id: 't4', name: 'Beard Design', duration: '30 min', price: 600 }
          ]
      },
      {
          id: 'habib-bbsr',
          title: "Jawed Habib Hair & Beauty",
          uri: "http://jawedhabib.co.in",
          priceRange: "$$",
          specialty: "Scientific Haircuts",
          availableSlots: 8,
          distance: "1.2 km",
          rating: 4.5,
          address: "IRC Village, Nayapalli, Bhubaneswar",
          description: "Jawed Habib Hair and Beauty Ltd is one of the leading hair and beauty salon chains in India. We believe in the science of hair and providing easy-to-manage styles for everyday life.",
          imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2670&auto=format&fit=crop",
          stylists: ["Manish Kumar", "Sneha Roy", "Rajesh"],
          services: [
              { id: 'h1', name: 'Standard Haircut', duration: '30 min', price: 350 },
              { id: 'h2', name: 'Advanced Hair Styling', duration: '45 min', price: 600 },
              { id: 'h3', name: 'Root Touch Up', duration: '60 min', price: 1200 },
              { id: 'h4', name: 'Hair Botox', duration: '120 min', price: 3500 }
          ]
      },
      {
          id: 'mayfair-bbsr',
          title: "Mayfair Spa & Salon",
          uri: "https://www.mayfairhotels.com",
          priceRange: "$$$$$",
          specialty: "Luxury Spa & Styling",
          availableSlots: 1,
          distance: "3.0 km",
          rating: 5.0,
          address: "Jaydev Vihar, Bhubaneswar",
          description: "An oasis of luxury and relaxation. The Mayfair Salon offers an exclusive environment for elite grooming, blending holistic wellness with high-end fashion styling.",
          imageUrl: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=2666&auto=format&fit=crop",
          stylists: ["Vikram Oberoi", "Sarah Jones"],
          services: [
              { id: 'm1', name: 'Luxury Grooming Package', duration: '90 min', price: 4500 },
              { id: 'm2', name: 'Bridal Makeover', duration: '240 min', price: 15000 },
              { id: 'm3', name: 'Aromatherapy Hair Spa', duration: '60 min', price: 3000 },
              { id: 'm4', name: 'Signature Mayfair Cut', duration: '60 min', price: 2000 }
          ]
      }
  ];

  return salons;
};