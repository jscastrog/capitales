import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Globe, Flag } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'cundinamarca',
      title: 'Municipios de Cundinamarca',
      description: 'Adivina los 116 municipios de Cundinamarca',
      count: '116 municipios',
      icon: MapPin,
      gradient: 'from-blue-500 to-cyan-500',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      id: 'departments', 
      title: 'Departamentos de Colombia',
      description: 'Adivina los 32 departamentos de Colombia',
      count: '32 departamentos',
      icon: Flag,
      gradient: 'from-yellow-500 to-orange-500',
      bgPattern: 'bg-gradient-to-br from-yellow-50 to-orange-50'
    },
    {
      id: 'countries',
      title: 'Países del Mundo',
      description: 'Adivina todos los países del mundo',
      count: '195+ países',
      icon: Globe,
      gradient: 'from-green-500 to-emerald-500',
      bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-50'
    }
  ];

  const handleCategorySelect = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            GeoAdivina
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Pon a prueba tus conocimientos geográficos con nuestros desafíos interactivos. 
            Elige tu categoría favorita y demuestra lo que sabes.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className={`transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border-0 ${category.bgPattern} backdrop-blur-sm`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                    {category.title}
                  </CardTitle>
                  <Badge variant="secondary" className="mb-3">
                    {category.count}
                  </Badge>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={`w-full bg-gradient-to-r ${category.gradient} hover:opacity-90 text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    Comenzar Desafío
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Características del Juego</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Mapa Interactivo</h3>
              <p className="text-sm text-gray-600">Haz clic directamente en el mapa para adivinar</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">✍️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Modo Escritura</h3>
              <p className="text-sm text-gray-600">Escribe las respuestas con tu teclado</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Sistema de Pistas</h3>
              <p className="text-sm text-gray-600">Revela letras cuando necesites ayuda</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-3">⏱️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Puntuación por Tiempo</h3>
              <p className="text-sm text-gray-600">Compite contra el reloj y mejora tu récord</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;