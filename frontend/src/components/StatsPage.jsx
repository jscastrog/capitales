import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Trophy, Clock, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { gameCategories } from '../data/mockData';

const StatsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const category = gameCategories[categoryId];
  
  // Get stats from localStorage
  const getStats = (mode) => {
    const scores = JSON.parse(localStorage.getItem(`geoadivina-scores-${categoryId}-${mode}`)) || [];
    return scores;
  };

  const mapStats = getStats('map');
  const typingStats = getStats('typing');
  
  const calculateStats = (scores) => {
    if (scores.length === 0) return null;
    
    const bestScore = Math.max(...scores.map(s => s.score));
    const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const totalGames = scores.length;
    const avgCorrect = scores.reduce((sum, s) => sum + s.correct, 0) / scores.length;
    const bestAccuracy = Math.max(...scores.map(s => (s.correct / s.total) * 100));
    const avgHints = scores.reduce((sum, s) => sum + s.hintsUsed, 0) / scores.length;
    
    return {
      bestScore: Math.round(bestScore),
      avgScore: Math.round(avgScore),
      totalGames,
      avgCorrect: Math.round(avgCorrect * 10) / 10,
      bestAccuracy: Math.round(bestAccuracy * 10) / 10,
      avgHints: Math.round(avgHints * 10) / 10
    };
  };

  const mapStatsCalculated = calculateStats(mapStats);
  const typingStatsCalculated = calculateStats(typingStats);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Categoría no encontrada</p>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, description, gradient }) => (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/category/${categoryId}`)}
            className="mr-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Category Info */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Estadísticas
          </h1>
          <p className="text-xl text-gray-600 mb-2">{category.title}</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {(mapStats.length + typingStats.length)} partidas jugadas
          </Badge>
        </div>

        {/* Stats Sections */}
        <div className="space-y-12 max-w-6xl mx-auto">
          {/* Map Mode Stats */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-3">
                <Target className="w-4 h-4 text-white" />
              </div>
              Modo Mapa Interactivo
            </h2>
            
            {mapStatsCalculated ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                  title="Mejor Puntuación"
                  value={mapStatsCalculated.bestScore}
                  icon={Trophy}
                  gradient="from-yellow-500 to-orange-500"
                />
                <StatCard 
                  title="Puntuación Promedio"
                  value={mapStatsCalculated.avgScore}
                  icon={TrendingUp}
                  gradient="from-green-500 to-emerald-500"
                />
                <StatCard 
                  title="Partidas Jugadas"
                  value={mapStatsCalculated.totalGames}
                  icon={Clock}
                  gradient="from-blue-500 to-indigo-500"
                />
                <StatCard 
                  title="Promedio Correctas"
                  value={mapStatsCalculated.avgCorrect}
                  icon={Target}
                  description="por partida"
                  gradient="from-purple-500 to-pink-500"
                />
                <StatCard 
                  title="Mejor Precisión"
                  value={`${mapStatsCalculated.bestAccuracy}%`}
                  icon={Trophy}
                  gradient="from-cyan-500 to-blue-500"
                />
                <StatCard 
                  title="Pistas Promedio"
                  value={mapStatsCalculated.avgHints}
                  icon={Lightbulb}
                  description="por partida"
                  gradient="from-indigo-500 to-purple-500"
                />
              </div>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    No has jugado en modo mapa interactivo aún
                  </p>
                  <Button 
                    onClick={() => navigate(`/game/${categoryId}/map`)}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
                  >
                    Jugar Ahora
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Typing Mode Stats */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                <Clock className="w-4 h-4 text-white" />
              </div>
              Modo Escritura
            </h2>
            
            {typingStatsCalculated ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                  title="Mejor Puntuación"
                  value={typingStatsCalculated.bestScore}
                  icon={Trophy}
                  gradient="from-yellow-500 to-orange-500"
                />
                <StatCard 
                  title="Puntuación Promedio"
                  value={typingStatsCalculated.avgScore}
                  icon={TrendingUp}
                  gradient="from-green-500 to-emerald-500"
                />
                <StatCard 
                  title="Partidas Jugadas"
                  value={typingStatsCalculated.totalGames}
                  icon={Clock}
                  gradient="from-blue-500 to-indigo-500"
                />
                <StatCard 
                  title="Promedio Correctas"
                  value={typingStatsCalculated.avgCorrect}
                  icon={Target}
                  description="por partida"
                  gradient="from-purple-500 to-pink-500"
                />
                <StatCard 
                  title="Mejor Precisión"
                  value={`${typingStatsCalculated.bestAccuracy}%`}
                  icon={Trophy}
                  gradient="from-cyan-500 to-blue-500"
                />
                <StatCard 
                  title="Pistas Promedio"
                  value={typingStatsCalculated.avgHints}
                  icon={Lightbulb}
                  description="por partida"
                  gradient="from-indigo-500 to-purple-500"
                />
              </div>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    No has jugado en modo escritura aún
                  </p>
                  <Button 
                    onClick={() => navigate(`/game/${categoryId}/typing`)}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                  >
                    Jugar Ahora
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Games */}
          {(mapStats.length > 0 || typingStats.length > 0) && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Partidas Recientes</h2>
              <div className="space-y-4">
                {[...mapStats, ...typingStats]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((game, index) => {
                    const isMapMode = mapStats.includes(game);
                    return (
                      <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Badge 
                                variant={isMapMode ? "default" : "secondary"}
                                className="px-3 py-1"
                              >
                                {isMapMode ? "Mapa" : "Escritura"}
                              </Badge>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {game.correct}/{game.total} correctas
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(game.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-800">{game.score}</p>
                              <p className="text-sm text-gray-600">puntos</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;