import { ContentItem } from '../types';

const MCP_ENDPOINT = 'https://jaaaaaack.app.n8n.cloud/mcp-server/http';
const PROXY_URL = 'https://corsproxy.io/?'; // CORS Proxy to bypass browser restrictions
const WEBHOOK_BASE_URL = 'https://jaaaaaack.app.n8n.cloud/webhook';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1YTM0ZWFlNS03MzVhLTQyYTgtYTVlNC1kNzk0ZDcwMmRjZTEiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6ImQ4YjEwZjI1LWY0NzUtNDBiMS04Njk5LTQzZmFjZjdmNTA3MiIsImlhdCI6MTc2NDc2NDU5NH0.1_j2OtB2p8Y9cKeXwU5WAFvP4Z5Np3A8lOTGUe8IgcA';

// Fallback data in case the API call fails (due to CORS or network issues)
const generateFallbackContent = (): ContentItem[] => [
  {
    id: `fb-${Date.now()}-1`,
    source: 'reddit',
    sourceName: 'r/ArtificialInteligence',
    title: 'New Reasoning Models Released (Fallback Data)',
    previewText: 'Connection to N8N failed, showing demo data. The new reasoning models demonstrate significant improvements in coding tasks compared to previous iterations...',
    url: 'https://reddit.com',
    timestamp: 'Just now',
    isSaved: false
  },
  {
    id: `fb-${Date.now()}-2`,
    source: 'newsletter',
    sourceName: 'The AI Daily',
    title: 'Top 5 Automation Trends for 2024',
    previewText: 'From autonomous agents to multi-modal workflows, here are the trends defining the landscape this year.',
    url: '#',
    timestamp: '2h ago',
    isSaved: false
  },
  {
    id: `fb-${Date.now()}-3`,
    source: 'reddit',
    sourceName: 'r/LocalLLaMA',
    title: 'Running 70B models on consumer hardware',
    previewText: 'A detailed guide on quantization and offloading strategies to run massive models on a dual 3090 setup.',
    url: '#',
    timestamp: '4h ago',
    isSaved: false
  }
];

export const api = {
  /**
   * Triggers the N8N scraper via the MCP (Model Context Protocol).
   * It calls the tool named "reddit_news_scraper".
   */
  scrapeContent: async (): Promise<ContentItem[]> => {
    try {
      // We route the request through a CORS proxy because the browser blocks
      // direct requests to the N8N cloud instance if it doesn't send Access-Control-Allow-Origin headers.
      const targetUrl = `${PROXY_URL}${encodeURIComponent(MCP_ENDPOINT)}`;
      
      console.log('Initiating scrape via MCP...');
      
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "tools/call",
          params: {
            name: "reddit_news_scraper",
            arguments: {}
          },
          id: 1
        })
      });

      if (!response.ok) {
        throw new Error(`MCP API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('MCP Response:', data);

      if (data.error) {
        throw new Error(`MCP Tool Error: ${data.error.message} (Code: ${data.error.code})`);
      }

      // MCP returns content as an array of objects with type and text
      // Structure: { result: { content: [{ type: 'text', text: '...' }] } }
      const textContent = data.result?.content?.[0]?.text;
      
      if (!textContent) {
        console.warn("MCP returned empty content:", data);
        return generateFallbackContent();
      }

      // The scraper tool is expected to return a JSON string of items in its text output
      let parsedData;
      try {
        // Sometimes tools wrap JSON in markdown code blocks like ```json ... ```
        const cleanText = textContent.replace(/```json\n|\n```/g, '').replace(/```/g, '');
        parsedData = JSON.parse(cleanText);
      } catch (e) {
        console.error("Failed to parse MCP tool output as JSON:", textContent);
        // If we can't parse the specific output, we treat the text itself as one item
        return [{
            id: `err-${Date.now()}`,
            source: 'reddit',
            sourceName: 'Scraper Output',
            title: 'Raw Scraper Output',
            previewText: textContent.substring(0, 200) + '...',
            url: '#',
            timestamp: 'Just now',
            isSaved: false
        }];
      }

      // Handle common array wrappings (e.g. if the tool returns { items: [...] } or just [...])
      const items = Array.isArray(parsedData) ? parsedData : (parsedData.items || parsedData.data || []);

      if (!Array.isArray(items)) {
        console.warn("Parsed data is not an array:", parsedData);
        return generateFallbackContent();
      }

      // Map the external data to our internal ContentItem interface
      return items.map((item: any) => ({
        id: item.id || `mcp-${Math.random().toString(36).substr(2, 9)}`,
        source: (item.source?.toLowerCase().includes('reddit') ? 'reddit' : 'newsletter') as any,
        sourceName: item.sourceName || item.subreddit || 'Reddit',
        title: item.title || 'Untitled Post',
        previewText: item.previewText || item.selftext || item.description || item.content || item.summary || '',
        url: item.url || (item.permalink ? `https://reddit.com${item.permalink}` : '#'),
        timestamp: item.timestamp || (item.created_utc ? new Date(item.created_utc * 1000).toLocaleDateString() : 'Just now'),
        isSaved: false
      }));

    } catch (error) {
      console.error("Failed to scrape content via MCP:", error);
      console.log("Reverting to fallback data due to API error.");
      return generateFallbackContent();
    }
  },

  /**
   * Triggers the hook generation.
   * Note: Using standard webhook for this as only the Scraper was specified for MCP.
   */
  generateHook: async (itemTitle: string): Promise<string> => {
    try {
      const targetUrl = `${PROXY_URL}${encodeURIComponent(`${WEBHOOK_BASE_URL}/generate-hook`)}`;
      
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: itemTitle })
      });

      if (!response.ok) {
        // Fallback for demo purposes if the specific webhook endpoint doesn't exist
        console.warn("Hook webhook failed, using fallback.");
        return new Promise(resolve => setTimeout(() => resolve(`🔥 ${itemTitle}: The Untold Story (Generated locally)`), 800));
      }

      const data = await response.json();
      return data.hook || data.text || data.output || "Generated Hook";

    } catch (error) {
      console.error("Failed to generate hook:", error);
      // Fallback response so the UI doesn't break
      return `Stop scrolling! Here is why ${itemTitle.substring(0, 15)}... is important. (Offline generated)`;
    }
  },
};