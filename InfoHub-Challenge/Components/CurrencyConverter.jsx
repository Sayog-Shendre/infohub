import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowRightLeft, Loader2, IndianRupee, DollarSign, Euro } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CurrencyConverter() {
    const [amount, setAmount] = useState('100');
    const [conversionData, setConversionData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConvert = async (e) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Convert ${amount} Indian Rupees (INR) to USD and EUR. Use the latest real-time exchange rates. Be precise and accurate.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        inr_amount: { type: "number" },
                        usd_amount: { type: "number" },
                        eur_amount: { type: "number" },
                        usd_rate: { type: "number" },
                        eur_rate: { type: "number" }
                    }
                }
            });

            setConversionData(result);
        } catch (err) {
            setError('Could not fetch currency rates. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <CardTitle className="text-2xl">Currency Converter</CardTitle>
                    <p className="text-sm text-green-50 mt-1">Convert INR to USD & EUR</p>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleConvert} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount in INR
                            </label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-10 text-lg"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                <>
                                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                                    Convert Currency
                                </>
                            )}
                        </Button>
                    </form>

                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && conversionData && (
                        <div className="mt-6 space-y-4">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-6 h-6 text-blue-700" />
                                        <span className="text-lg font-semibold text-gray-700">US Dollar</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-900">
                                            ${conversionData.usd_amount?.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Rate: ₹{conversionData.usd_rate?.toFixed(4)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Euro className="w-6 h-6 text-purple-700" />
                                        <span className="text-lg font-semibold text-gray-700">Euro</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-900">
                                            €{conversionData.eur_amount?.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Rate: ₹{conversionData.eur_rate?.toFixed(4)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center text-sm text-gray-500 mt-4">
                                Exchange rates are updated in real-time
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}