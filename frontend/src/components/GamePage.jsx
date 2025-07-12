import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Clock, Trophy, Lightbulb, RotateCcw, CheckCircle } from 'lucide-react';
import { gameCategories } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import { normalizeText, checkAnswer, getRandomHint } from '../utils/textUtils';

const GamePage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const category = gameCategories[categoryId];
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [remainingAnswers, setRemainingAnswers] = useState([]);

  // Initialize remaining answers
  useEffect(() => {
    if (category) {
      setRemainingAnswers([...category.data]);
    }
  }, [category]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setCorrectAnswers([]);
    setHintsUsed(0);
    setCurrentHint('');
    setGameCompleted(false);
    setUserAnswer('');
    setRemainingAnswers([...category.data]);
  };

  const endGame = useCallback(() => {
    setGameActive(false);
    setGameCompleted(true);
    
    // Calculate final score (considering time bonus and hints penalty)
    const timeBonus = timeLeft * 2;
    const hintPenalty = hintsUsed * 10;
    const finalScore = Math.max(0, (correctAnswers.length * 100) + timeBonus - hintPenalty);
    setScore(finalScore);
    
    // Save score to localStorage
    const scores = JSON.parse(localStorage.getItem(`geoadivina-scores-${categoryId}`)) || [];
    scores.push({
      score: finalScore,
      correct: correctAnswers.length,
      total: category.data.length,
      timeUsed: 60 - timeLeft,
      hintsUsed: hintsUsed,
      date: new Date().toISOString()
    });
    localStorage.setItem(`geoadivina-scores-${categoryId}`, JSON.stringify(scores));
  }, [categoryId, correctAnswers.length, timeLeft, hintsUsed, category.data.length]);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    
    if (!userAnswer.trim()) return;
    
    const foundAnswer = checkAnswer(userAnswer, remainingAnswers);
    
    if (foundAnswer) {
      // Correct answer
      const newCorrectAnswers = [...correctAnswers, foundAnswer];
      const newRemainingAnswers = remainingAnswers.filter(a => a.id !== foundAnswer.id);
      
      setCorrectAnswers(newCorrectAnswers);
      setRemainingAnswers(newRemainingAnswers);
      setUserAnswer('');
      setCurrentHint('');
      
      toast({
        title: "¡Correcto!",
        description: `${foundAnswer.name} - ${newCorrectAnswers.length}/${category.data.length}`,
      });
      
      // Check if all answers found
      if (newRemainingAnswers.length === 0) {
        setTimeout(() => endGame(), 1000);
      }
    } else {
      // Check if already answered
      const alreadyAnswered = checkAnswer(userAnswer, correctAnswers);
      if (alreadyAnswered) {
        toast({
          title: "Ya respondiste",
          description: `${alreadyAnswered.name} ya está en tu lista`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "No encontrado",
          description: "Intenta con otra respuesta o usa una pista",
          variant: "destructive"
        });
      }
      setUserAnswer('');
    }
  };

  const useHint = () => {
    if (hintsUsed < 3 && remainingAnswers.length > 0) {
      const hintData = getRandomHint(remainingAnswers);
      if (hintData) {
        setCurrentHint(`${hintData.hint} (${hintData.answer.name.length} letras)`);
        setHintsUsed(hintsUsed + 1);
      }
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  const progress = (correctAnswers.length / category.data.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/category/${categoryId}`)}
            className="hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="flex items-center gap-4">
            {gameActive && (
              <>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {timeLeft}s
                </Badge>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  <Trophy className="w-4 h-4 mr-1" />
                  {score}
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Game Start Screen */}
        {!gameActive && !gameCompleted && (
          <div className="text-center">
            <Card className="max-w-md mx-auto bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {category.title}
                </CardTitle>
                <p className="text-gray-600">Modo Lista</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Tienes 60 segundos para escribir todos los {category.data.length} elementos que puedas recordar.
                  ¡Escribe en cualquier orden!
                </p>
                <Button 
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white font-semibold py-3"
                >
                  Iniciar Juego
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Game */}
        {gameActive && (
          <div className="max-w-4xl mx-auto">
            {/* Progress and Stats */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Encontrados: {correctAnswers.length} de {category.data.length}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Restantes: {remainingAnswers.length}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            {/* Game Input */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-6">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                  Lista todos los {category.title.toLowerCase()} que recuerdes
                </CardTitle>
                {currentHint && (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    💡 Pista: {currentHint}
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                  <Input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Escribe un nombre y presiona Enter..."
                    className="text-lg py-3"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
                      disabled={!userAnswer.trim()}
                    >
                      Agregar
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={useHint}
                      disabled={hintsUsed >= 3 || remainingAnswers.length === 0}
                      className="px-4"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {hintsUsed}/3
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Correct Answers List */}
            {correctAnswers.length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    Respuestas Correctas ({correctAnswers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {correctAnswers.map((answer, index) => (
                      <Badge 
                        key={answer.id} 
                        variant="secondary" 
                        className="text-sm px-3 py-1 bg-green-100 text-green-800"
                      >
                        {answer.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Game Completed */}
        {gameCompleted && (
          <div className="text-center">
            <Card className="max-w-md mx-auto bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  ¡Tiempo Agotado!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{correctAnswers.length}</p>
                    <p className="text-sm text-gray-600">de {category.data.length}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{score}</p>
                    <p className="text-sm text-gray-600">Puntuación Final</p>
                  </div>
                </div>
                
                <div className="text-left bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Respuestas que faltaron:</p>
                  <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                    {remainingAnswers.slice(0, 10).map((answer) => (
                      <span key={answer.id} className="text-xs text-gray-600">
                        • {answer.name}
                      </span>
                    ))}
                    {remainingAnswers.length > 10 && (
                      <span className="text-xs text-gray-500">
                        ... y {remainingAnswers.length - 10} más
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={startGame}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Jugar de Nuevo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/stats/${categoryId}`)}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Ver Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;