import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Map, Keyboard, Trophy, Clock } from 'lucide-react';
import { gameCategories } from '../data/mockData';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const category = gameCategories[categoryId];
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Categoría no encontrada</p>
      </div>
    );
  }

  const gameModes = [
    {
      id: 'map',
      title: 'Mapa Interactivo',
      description: 'Haz clic en el mapa para seleccionar la ubicación correcta',
      icon: Map,
      gradient: 'from-blue-500 to-indigo-500',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      id: 'typing',
      title: 'Modo Escritura',
      description: 'Escribe el nombre correcto usando tu teclado',
      icon: Keyboard,
      gradient: 'from-purple-500 to-pink-500',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-pink-50'
    }
  ];

  const handleGameModeSelect = (mode) => {
    navigate(`/game/${categoryId}/${mode}`);
  };

  const handleViewStats = () => {
    navigate(`/stats/${categoryId}`);
  };

  // Get best scores from localStorage
  const getBestScore = (mode) => {
    const scores = JSON.parse(localStorage.getItem(`geoadivina-scores-${categoryId}-${mode}`)) || [];
    return scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>

        {/* Category Info */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {category.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{category.description}</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {category.data.length} elementos disponibles
          </Badge>
        </div>

        {/* Game Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {gameModes.map((mode) => {
            const IconComponent = mode.icon;
            const bestScore = getBestScore(mode.id);
            
            return (
              <Card 
                key={mode.id}
                className={`transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border-0 ${mode.bgPattern} backdrop-blur-sm`}
                onClick={() => handleGameModeSelect(mode.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${mode.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                    {mode.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed mb-4">
                    {mode.description}
                  </CardDescription>
                  {bestScore > 0 && (
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Mejor puntuación: {bestScore}
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full bg-gradient-to-r ${mode.gradient} hover:opacity-90 text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    Jugar Ahora
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Estadísticas
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ve tu progreso y mejores tiempos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                onClick={handleViewStats}
                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold py-3 transition-all duration-300"
              >
                <Clock className="w-4 h-4 mr-2" />
                Ver Estadísticas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;