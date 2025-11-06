import React, { useState } from 'react';
import { Cloud, DollarSign, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import WeatherModule from './components/WeatherModule';
import CurrencyConverter from './components/CurrencyConverter';
import QuoteGenerator from './components/QuoteGenerator';

export default function InfoHub() {
    const [activeTab, setActiveTab] = useState('weather');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            <div className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            InfoHub
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Your everyday utilities in one place
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Tab Navigation */}
                    <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 h-auto p-1 bg-white shadow-md">
                        <TabsTrigger
                            value="weather"
                            className="flex flex-col md:flex-row items-center gap-2 py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
                        >
                            <Cloud className="w-5 h-5" />
                            <span className="text-sm md:text-base">Weather</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="currency"
                            className="flex flex-col md:flex-row items-center gap-2 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"
                        >
                            <DollarSign className="w-5 h-5" />
                            <span className="text-sm md:text-base">Currency</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="quotes"
                            className="flex flex-col md:flex-row items-center gap-2 py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all"
                        >
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm md:text-base">Quotes</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Content */}
                    <TabsContent value="weather" className="mt-0">
                        <WeatherModule />
                    </TabsContent>

                    <TabsContent value="currency" className="mt-0">
                        <CurrencyConverter />
                    </TabsContent>

                    <TabsContent value="quotes" className="mt-0">
                        <QuoteGenerator />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Footer */}
            <div className="container mx-auto px-4 py-8 mt-12">
                <div className="text-center text-gray-500 text-sm">
                    <p>InfoHub - Demonstrating full-stack development skills</p>
                    <p className="mt-1">Built with React, Tailwind CSS, and real-time API integrations</p>
                </div>
            </div>
        </div>
    );
}