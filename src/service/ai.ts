interface ArticleResponse {
    article: string;
    title: string[];
}

export async function generateArticleAI(theme: string, tone: string): Promise<ArticleResponse> {
    const prompt = `
Você é um gerador de conteúdo para blogs. Crie um artigo estruturado sobre o tema: "${theme}" com tom ${tone}.

Retorne **apenas** o seguinte JSON (sem bloco de código, sem markdown, sem \`\`\`, sem títulos no corpo do artigo):

{
  "article": "Texto completo com introdução, tópicos principais e conclusão.",
  "title": ["Título 1", "Título 2", "Título 3"]
}
`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            throw new Error("Resposta vazia da IA.");
        }

        // Tenta extrair o primeiro bloco JSON da resposta, mesmo que tenha lixo em volta
        const match = rawText.match(/{[\s\S]*}/);

        if (!match) {
            throw new Error("Não foi possível extrair o JSON da resposta da IA.");
        }

        const jsonString = match[0].replace(/\*+/g, '');

        const parsed: ArticleResponse = JSON.parse(jsonString);

        if (!parsed.article || !Array.isArray(parsed.title)) {
            throw new Error("Formato inválido no JSON retornado pela IA.");
        }

        return parsed;
    } catch (error) {
        console.error("Erro ao gerar artigo com Gemini:", error);
        throw new Error("Erro ao gerar artigo. Verifique sua chave ou formatação.");
    }
}
