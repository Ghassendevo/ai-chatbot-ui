"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "./theme-toggle";

interface AnswerResponse {
  answer: string;
  sources: string[];
}

export default function Chat() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAsk = async () => {
    if (!question) return;

    setLoading(true);
    setAnswer("");
    setSources([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data: AnswerResponse = await response.json();
      setAnswer(data.answer);
      setSources(data.sources);
    } catch (error) {
      console.error(error);
      setAnswer("Erreur lors de la requête au serveur.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <ThemeToggle className="absolute top-4 right-4" />

      <Card className="w-full max-w-2xl p-4 shadow-2xl">
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Posez votre question juridique..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="h-32"
          />

          <Button onClick={handleAsk} disabled={loading}>
            {loading ? "Chargement..." : "Poser la question"}
          </Button>

          {answer && (
            <div className="p-4 border rounded bg-muted text-muted-foreground whitespace-pre-wrap">
              <p className="mb-2">{answer}</p>
              {sources.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Sources :</h3>
                  <ul className="list-disc pl-5 text-sm">
                    {sources.map((src, i) => (
                      <li key={i}>{src}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
