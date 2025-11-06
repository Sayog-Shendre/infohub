import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, RefreshCw, Loader2, Quote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function QuoteGenerator() {
    const [quote, setQuote] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuote = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate a powerful, inspiring motivational quote. Include the quote text and the author. Make it unique and uplifting.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        quote: { type: "string" },
                        author: { type: "string" }
                    }
                }
            });

            setQuote(result);
        } catch (err) {
            setError('Could not fetch quote. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        Motivational Quotes
                    </CardTitle>
                    <p className="text-sm text-purple-50 mt-1">Get inspired every day</p>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                            <p className="text-gray-600">Loading inspiration...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && quote && (
                        <div className="space-y-6">
                            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
                                <Quote className="absolute top-4 left-4 w-8 h-8 text-purple-300" />
                                <Quote className="absolute bottom-4 right-4 w-8 h-8 text-purple-300 transform rotate-180" />

                                <div className="relative z-10 mt-4">
                                    <p className="text-xl md:text-2xl font-serif text-gray-800 text-center leading-relaxed mb-6">
                                        "{quote.quote}"
                                    </p>
                                    <p className="text-right text-lg font-medium text-purple-700">
                                        — {quote.author}
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={fetchQuote}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                                size="lg"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Get New Quote
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}