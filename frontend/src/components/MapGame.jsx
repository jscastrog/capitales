import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Lightbulb } from 'lucide-react';

const MapGame = ({ currentItem, category, onAnswer, showHint }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Simple mock map - in real app would use actual map library
  const handleMapClick = (location) => {
    setSelectedLocation(location);
  };

  const submitAnswer = () => {
    if (selectedLocation) {
      onAnswer(selectedLocation.name);
      setSelectedLocation(null);
    }
  };

  const useHint = () => {
    if (hintsUsed < 3) {
      const currentName = currentItem.name;
      const revealLength = Math.min(hintsUsed + 1, currentName.length - 1);
      const hint = currentName.substring(0, revealLength) + '_'.repeat(currentName.length - revealLength);
      setHintsUsed(hintsUsed + 1);
    }
  };

  // Mock map locations for demonstration
  const mapLocations = category.data.slice(0, 10); // Show first 10 for demo

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
          Haz clic en: {currentItem.name}
        </CardTitle>
        {showHint && (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Pista: {showHint}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {/* Mock Interactive Map */}
        <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-8 mb-4 relative min-h-[400px] border-2 border-dashed border-gray-300">
          <p className="text-center text-gray-500 mb-4">Mapa Interactivo (Demo)</p>
          
          {/* Mock clickable locations */}
          <div className="grid grid-cols-3 gap-4 h-full">
            {mapLocations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => handleMapClick(location)}
                className={`rounded-lg border-2 transition-all duration-200 p-3 text-sm font-medium ${
                  selectedLocation?.id === location.id
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                }`}
                style={{
                  position: 'absolute',
                  left: `${(index % 3) * 30 + 10}%`,
                  top: `${Math.floor(index / 3) * 25 + 20}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>

        {selectedLocation && (
          <div className="text-center mb-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Seleccionado: {selectedLocation.name}
            </Badge>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={submitAnswer}
            disabled={!selectedLocation}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
          >
            Confirmar Respuesta
          </Button>
          <Button 
            variant="outline"
            onClick={useHint}
            disabled={hintsUsed >= 3}
            className="px-4"
          >
            <Lightbulb className="w-4 h-4" />
            {hintsUsed}/3
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapGame;