import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function WeatherModule() {
    const [city, setCity] = useState('London');
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async (cityName) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Get the current weather for ${cityName}. Include temperature in Celsius, weather condition, humidity, wind speed, and visibility. Be accurate and use real-time data.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        city: { type: "string" },
                        temperature: { type: "number" },
                        condition: { type: "string" },
                        humidity: { type: "number" },
                        wind_speed: { type: "number" },
                        visibility: { type: "number" }
                    }
                }
            });

            setWeatherData(result);
        } catch (err) {
            setError('Could not fetch weather data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeather(city);
        }
    };

    const getWeatherIcon = (condition) => {
        if (!condition) return <Sun className="w-16 h-16 text-yellow-500" />;

        const cond = condition.toLowerCase();
        if (cond.includes('rain') || cond.includes('drizzle')) {
            return <CloudRain className="w-16 h-16 text-blue-500" />;
        } else if (cond.includes('cloud')) {
            return <Cloud className="w-16 h-16 text-gray-500" />;
        } else {
            return <Sun className="w-16 h-16 text-yellow-500" />;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardTitle className="text-2xl">Real-Time Weather</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                        <Input
                            type="text"
                            placeholder="Enter city name..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading}>
                            Search
                        </Button>
                    </form>

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                            <p className="text-gray-600">Loading weather data...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && weatherData && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                    {weatherData.city || city}
                                </h2>
                                <div className="flex justify-center mb-4">
                                    {getWeatherIcon(weatherData.condition)}
                                </div>
                                <div className="text-6xl font-bold text-gray-900 mb-2">
                                    {weatherData.temperature}°C
                                </div>
                                <p className="text-xl text-gray-600 capitalize">
                                    {weatherData.condition}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Humidity</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        {weatherData.humidity}%
                                    </p>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <Wind className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Wind Speed</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        {weatherData.wind_speed} km/h
                                    </p>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Visibility</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        {weatherData.visibility} km
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}