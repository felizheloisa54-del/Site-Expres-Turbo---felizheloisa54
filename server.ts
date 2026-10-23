import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Serve public folder for static downloads
app.use(express.static(path.resolve(__dirname, 'public')));

// Route: Download PRD Markdown
app.get('/api/download-prd', (_req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'PRD-Site-Express-Studio-Pro.md');
  res.download(filePath, 'PRD-Site-Express-Studio-Pro.md', (err) => {
    if (err) {
      console.error('Error downloading PRD markdown:', err);
      res.status(500).send('Erro ao baixar o PRD');
    }
  });
});

// Route: Download PRD HTML
app.get('/api/download-prd-html', (_req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'PRD-Site-Express-Studio-Pro.html');
  res.download(filePath, 'PRD-Site-Express-Studio-Pro.html', (err) => {
    if (err) {
      console.error('Error downloading PRD HTML:', err);
      res.status(500).send('Erro ao baixar o PRD HTML');
    }
  });
});

// Route: Download Mega-Prompt Markdown
app.get('/api/download-megaprompt', (_req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'PROMPT-MESTRE-SITE-EXPRESS-STUDIO-PRO.md');
  res.download(filePath, 'PROMPT-MESTRE-SITE-EXPRESS-STUDIO-PRO.md', (err) => {
    if (err) {
      console.error('Error downloading Mega Prompt markdown:', err);
      res.status(500).send('Erro ao baixar o Prompt Mestre');
    }
  });
});

// Route: Download Mega-Prompt HTML
app.get('/api/download-megaprompt-html', (_req, res) => {
  const filePath = path.resolve(__dirname, 'public', 'PROMPT-MESTRE-SITE-EXPRESS-STUDIO-PRO.html');
  res.download(filePath, 'PROMPT-MESTRE-SITE-EXPRESS-STUDIO-PRO.html', (err) => {
    if (err) {
      console.error('Error downloading Mega Prompt HTML:', err);
      res.status(500).send('Erro ao baixar o Prompt Mestre em HTML');
    }
  });
});

// Route: Test Google Cloud Places API Key (Supports Places API New + Legacy)
app.post('/api/places/test-key', async (req, res) => {
  try {
    const userKey = req.body?.apiKey?.trim() || process.env.GOOGLE_PLACES_API_KEY;
    if (!userKey) {
      return res.status(400).json({ valid: false, message: 'Nenhuma chave fornecida.' });
    }

    // 1. Test Places API (New) first
    try {
      const newApiRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': userKey,
          'X-Goog-FieldMask': 'places.id,places.displayName',
        },
        body: JSON.stringify({ textQuery: 'restaurante', languageCode: 'pt-BR' }),
      });
      const newData: any = await newApiRes.json();
      if (newApiRes.ok && (Array.isArray(newData.places) || !newData.error)) {
        return res.json({
          valid: true,
          apiType: 'new',
          message: 'Chave validada com sucesso via Google Places API (New)!',
        });
      }
    } catch {
      // continue to legacy test
    }

    // 2. Test Legacy Places API
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurante+sao+paulo&key=${encodeURIComponent(userKey)}`;
    const legacyRes = await fetch(legacyUrl);
    const legacyData: any = await legacyRes.json();

    if (legacyData.status === 'OK' || legacyData.status === 'ZERO_RESULTS') {
      return res.json({
        valid: true,
        apiType: 'legacy',
        message: 'Chave validada com sucesso via Google Places API Clássica!',
      });
    }

    const errorMsg =
      legacyData.error_message ||
      'A chave não está autorizada para Places API. Certifique-se de ativar "Places API" ou "Places API (New)" no Google Cloud Console.';

    return res.json({
      valid: false,
      message: errorMsg,
      status: legacyData.status,
    });
  } catch (error: any) {
    console.error('Error testing Google Places API key:', error);
    return res.status(500).json({ valid: false, message: error.message || 'Erro ao validar chave.' });
  }
});

// Route: Search Google Places API (Dual New + Legacy with Auto-Fallback)
app.post('/api/places/search', async (req, res) => {
  try {
    const { query, apiKey: clientApiKey } = req.body;
    const activeKey = clientApiKey?.trim() || process.env.GOOGLE_PLACES_API_KEY;

    if (!activeKey) {
      return res.json({
        success: false,
        fallback: true,
        message: 'Chave não configurada. Usando catálogo local.',
      });
    }

    if (!query || query.trim().length < 2) {
      return res.json({ success: true, places: [] });
    }

    // 1. Try Google Places API (New)
    try {
      const newApiRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': activeKey,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.regularOpeningHours,places.photos',
        },
        body: JSON.stringify({ textQuery: query.trim(), languageCode: 'pt-BR' }),
      });
      const newData: any = await newApiRes.json();

      if (newApiRes.ok && Array.isArray(newData.places) && newData.places.length > 0) {
        const places = newData.places.slice(0, 8).map((p: any) => ({
          placeId: p.id,
          name: p.displayName?.text || 'Comércio Local',
          address: p.formattedAddress || 'Endereço Comercial',
          rating: p.rating || 4.9,
          reviewCount: p.userRatingCount || 38,
          types: p.types || [],
          isOpenNow: p.regularOpeningHours?.openNow ?? true,
          photoName: p.photos?.[0]?.name,
          apiType: 'new',
        }));
        return res.json({ success: true, places, apiType: 'new' });
      }
    } catch (newErr) {
      console.warn('Places API (New) attempt failed, trying legacy...', newErr);
    }

    // 2. Fallback to Legacy Places API
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&language=pt-BR&key=${encodeURIComponent(activeKey)}`;

    const response = await fetch(searchUrl);
    const data: any = await response.json();

    if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
      const places = data.results.slice(0, 8).map((p: any) => ({
        placeId: p.place_id,
        name: p.name,
        address: p.formatted_address,
        rating: p.rating || 4.8,
        reviewCount: p.user_ratings_total || 24,
        types: p.types || [],
        isOpenNow: p.opening_hours?.open_now ?? true,
        photoRef: p.photos?.[0]?.photo_reference,
        apiType: 'legacy',
      }));

      return res.json({ success: true, places, apiType: 'legacy' });
    }

    return res.json({
      success: false,
      fallback: true,
      status: data.status,
      message: data.error_message || 'Nenhum resultado na API do Google. Usando catálogo integrado.',
    });
  } catch (error: any) {
    console.error('Error in Google Places search:', error);
    return res.json({
      success: false,
      fallback: true,
      error: error.message,
    });
  }
});

// Route: Import Full Place Details from Google Places (Dual New + Legacy)
app.post('/api/places/import', async (req, res) => {
  try {
    const { placeId, apiKey: clientApiKey } = req.body;
    const activeKey = clientApiKey?.trim() || process.env.GOOGLE_PLACES_API_KEY;

    if (!activeKey || !placeId) {
      return res.status(400).json({ error: 'Chave de API ou placeId ausente.' });
    }

    let placeData: any = null;

    // 1. Try Google Places API (New) details
    try {
      const newDetailsRes = await fetch(
        `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pt-BR`,
        {
          headers: {
            'X-Goog-Api-Key': activeKey,
            'X-Goog-FieldMask':
              'id,displayName,formattedAddress,nationalPhoneNumber,internationalPhoneNumber,rating,userRatingCount,regularOpeningHours,photos,googleMapsUri,types',
          },
        }
      );
      if (newDetailsRes.ok) {
        const nd = await newDetailsRes.json();
        if (nd.id) {
          const types = nd.types || [];
          let archetype: 'gastronomia' | 'servicos' | 'produtos' = 'servicos';
          if (types.some((t: string) => ['restaurant', 'food', 'cafe', 'bar', 'bakery'].includes(t))) {
            archetype = 'gastronomia';
          } else if (types.some((t: string) => ['store', 'clothing_store', 'furniture_store'].includes(t))) {
            archetype = 'produtos';
          }

          const rawPhone = nd.internationalPhoneNumber || nd.nationalPhoneNumber || '';
          const cleanPhone = rawPhone.replace(/\D/g, '');
          const whatsapp = cleanPhone.length >= 10 ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '5511999998888';

          let coverImage = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80';
          if (nd.photos?.[0]?.name) {
            coverImage = `https://places.googleapis.com/v1/${nd.photos[0].name}/media?maxWidthPx=1200&key=${encodeURIComponent(activeKey)}`;
          }

          const name = nd.displayName?.text || 'Comércio Local';
          const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

          return res.json({
            success: true,
            business: {
              id: `google-${placeId.slice(0, 10)}`,
              name,
              slug,
              archetype,
              category: (types[0] || 'Comércio').replace(/_/g, ' '),
              address: nd.formattedAddress || 'Endereço Comercial',
              city: (nd.formattedAddress || '').split(',')[1]?.trim() || 'Brasil',
              state: 'BR',
              neighborhood: '',
              zipCode: '',
              phone: nd.nationalPhoneNumber || '(11) 3000-0000',
              whatsapp,
              mapsUrl: nd.googleMapsUri || `https://maps.google.com/?q=${encodeURIComponent(name)}`,
              wazeUrl: `https://waze.com/ul?q=${encodeURIComponent(name)}`,
              rating: nd.rating || 4.9,
              reviewCount: nd.userRatingCount || 42,
              openingHours: nd.regularOpeningHours?.weekdayDescriptions?.[0] || 'Segunda a Sábado das 08h às 19h',
              isOpenNow: nd.regularOpeningHours?.openNow ?? true,
              coverImage,
              secondaryImage: coverImage,
              galleryImages: [coverImage],
            },
          });
        }
      }
    } catch (newDetailsErr) {
      console.warn('Places API New details failed, trying legacy...', newDetailsErr);
    }

    // 2. Fallback to Legacy Places API details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=name,formatted_address,formatted_phone_number,international_phone_number,rating,user_ratings_total,opening_hours,photos,reviews,url,types&language=pt-BR&key=${encodeURIComponent(
      activeKey
    )}`;

    const response = await fetch(detailsUrl);
    const data: any = await response.json();

    if (data.status === 'OK' && data.result) {
      const r = data.result;
      
      let archetype: 'gastronomia' | 'servicos' | 'produtos' = 'servicos';
      const types = r.types || [];
      if (types.some((t: string) => ['restaurant', 'food', 'cafe', 'bar', 'bakery', 'meal_takeaway'].includes(t))) {
        archetype = 'gastronomia';
      } else if (types.some((t: string) => ['store', 'clothing_store', 'furniture_store', 'hardware_store'].includes(t))) {
        archetype = 'produtos';
      }

      let coverImage = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80';
      if (r.photos?.[0]?.photo_reference) {
        coverImage = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${r.photos[0].photo_reference}&key=${encodeURIComponent(activeKey)}`;
      }

      const cleanPhone = (r.formatted_phone_number || '').replace(/\D/g, '');
      const whatsapp = cleanPhone.length >= 10 ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '5511999998888';

      return res.json({
        success: true,
        business: {
          id: `google-${placeId.slice(0, 10)}`,
          name: r.name,
          slug: r.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          archetype,
          category: r.types?.[0]?.replace(/_/g, ' ') || 'Comércio Local',
          address: r.formatted_address || 'Endereço Comercial',
          city: (r.formatted_address || '').split(',')[1]?.trim() || 'Brasil',
          state: 'BR',
          neighborhood: '',
          zipCode: '',
          phone: r.formatted_phone_number || '(11) 3000-0000',
          whatsapp,
          mapsUrl: r.url || `https://maps.google.com/?q=${encodeURIComponent(r.name)}`,
          wazeUrl: `https://waze.com/ul?q=${encodeURIComponent(r.name)}`,
          rating: r.rating || 4.9,
          reviewCount: r.user_ratings_total || 42,
          openingHours: r.opening_hours?.weekday_text?.[0] || 'Segunda a Sábado das 08h às 19h',
          isOpenNow: r.opening_hours?.open_now ?? true,
          coverImage,
          secondaryImage: coverImage,
          galleryImages: [coverImage],
        },
      });
    }

    return res.status(400).json({ error: data.error_message || 'Não foi possível importar dados do local.' });
  } catch (error: any) {
    console.error('Error importing place details:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Route: AI Bio & Copy Enhancement
app.post('/api/enhance-bio', async (req, res) => {
  try {
    const { businessName, category, city, originalBio, tone = 'persuasivo' } = req.body;

    const toneInstructions: Record<string, string> = {
      persuasivo: 'foco em conversão imediata, autoridade local e incentivo ao contato no WhatsApp',
      acolhedor: 'tom caloroso, artesanal, tradicional e convidativo para famílias e clientes fiéis',
      premium: 'tom sofisticado, exclusivo, com ênfase em alto padrão, pontualidade e credibilidade médica/técnica',
      urgencia: 'ofertas especiais, pronta-entrega, agilidade e facilidade de atendimento sem burocracia',
    };

    const toneDesc = toneInstructions[tone] || toneInstructions.persuasivo;

    if (ai) {
      const prompt = `Você é um copywriter sênior especialista em landing pages de negócios locais no Brasil.
Reescreva e aprimore a mini-apresentação da seguinte empresa para maximizar a conversão de visitantes em clientes pelo WhatsApp:

Nome da Empresa: ${businessName || 'Empresa Local'}
Segmento/Categoria: ${category || 'Serviços'}
Cidade/Região: ${city || 'Brasil'}
Texto original ou pontos fortes: ${originalBio || 'Atendimento de qualidade com anos de experiência.'}
Diretriz de Tom: ${toneDesc}

Regras:
1. Escreva 1 a 2 parágrafos concisos e magnéticos (máximo 70 palavras no total).
2. Destaque o diferencial real e a localização para gerar identificação imediata.
3. Termine com uma frase sutil e natural de chamada para conversa no WhatsApp.
4. NUNCA use emojis bobos no meio do texto nem termos em inglês genéricos (sem 'supercharge' ou 'gamechanger').
5. Responda APENAS com o texto final pronto para publicação.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const enhancedText = response.text?.trim();
      if (enhancedText) {
        return res.json({ success: true, text: enhancedText });
      }
    }

    // High-conversion deterministic fallback if API is unreachable or key not provided
    const fallbackMap: Record<string, string> = {
      persuasivo: `Referência consolidada em ${city || 'sua região'}, a ${businessName || 'nossa equipe'} combina tecnologia de ponta, corpo clínico especializado e atendimento humanizado. Agende sua consulta ou avaliação com triagem ágil diretamente pelo WhatsApp.`,
      acolhedor: `Tradição, carinho e receitas autênticas preparadas todos os dias com ingredientes selecionados. Faça seu pedido e receba o melhor da gastronomia artesanal no conforto da sua casa pelo nosso WhatsApp.`,
      premium: `Excelência em cada detalhe, estrutura moderna e atendimento sob medida para você. Descubra uma experiência diferenciada com padrão de qualidade comprovado por mais de centenas de clientes satisfeitos.`,
      urgencia: `Pronta-entrega imediata, garantia oficial e as melhores condições de pagamento de ${city || 'toda a região'}. Fale agora com nossa equipe no WhatsApp e garanta seu orçamento em minutos.`,
    };

    return res.json({
      success: true,
      text: fallbackMap[tone] || fallbackMap.persuasivo,
      fallbackUsed: true,
    });
  } catch (error: any) {
    console.error('Error enhancing bio:', error);
    return res.status(500).json({
      error: 'Não foi possível gerar o texto com IA no momento.',
      details: error.message,
    });
  }
});

// Configure Vite in dev mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Site Express Studio Pro running on port ${PORT}`);
  });
}

startServer();
