import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Clock, Trophy, Lightbulb, RotateCcw, CheckCircle } from 'lucide-react';
import { gameCategories } from '../data/mockData';
import MapGame from './MapGame';
import { useToast } from '../hooks/use-toast';

const GamePage = () => {
  const { categoryId, gameMode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const category = gameCategories[categoryId];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState('');
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Initialize shuffled questions
  useEffect(() => {
    if (category) {
      const shuffled = [...category.data].sort(() => Math.random() - 0.5);
      setShuffledQuestions(shuffled.slice(0, 20)); // Take first 20 for the game
    }
  }, [category]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setGameActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(60);
    setCorrectAnswers([]);
    setWrongAnswers([]);
    setHintsUsed(0);
    setShowHint('');
    setGameCompleted(false);
    setUserAnswer('');
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
    const scores = JSON.parse(localStorage.getItem(`geoadivina-scores-${categoryId}-${gameMode}`)) || [];
    scores.push({
      score: finalScore,
      correct: correctAnswers.length,
      total: shuffledQuestions.length,
      timeUsed: 60 - timeLeft,
      hintsUsed: hintsUsed,
      date: new Date().toISOString()
    });
    localStorage.setItem(`geoadivina-scores-${categoryId}-${gameMode}`, JSON.stringify(scores));
  }, [categoryId, gameMode, correctAnswers.length, timeLeft, hintsUsed, shuffledQuestions.length]);

  const checkAnswer = (answer) => {
    const currentItem = shuffledQuestions[currentQuestion];
    const isCorrect = answer.toLowerCase().trim() === currentItem.name.toLowerCase().trim();
    
    if (isCorrect) {
      setCorrectAnswers([...correctAnswers, currentItem]);
      toast({
        title: "¡Correcto!",
        description: `${currentItem.name} es la respuesta correcta`,
      });
    } else {
      setWrongAnswers([...wrongAnswers, { ...currentItem, userAnswer: answer }]);
      toast({
        title: "Incorrecto",
        description: `La respuesta correcta era: ${currentItem.name}`,
        variant: "destructive"
      });
    }
    
    nextQuestion();
  };

  const nextQuestion = () => {
    setUserAnswer('');
    setShowHint('');
    
    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      endGame();
    }
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (userAnswer.trim()) {
      checkAnswer(userAnswer);
    }
  };

  const useHint = () => {
    if (hintsUsed < 3 && shuffledQuestions[currentQuestion]) {
      const currentName = shuffledQuestions[currentQuestion].name;
      const revealLength = Math.min(hintsUsed + 1, currentName.length - 1);
      const hint = currentName.substring(0, revealLength) + '_'.repeat(currentName.length - revealLength);
      setShowHint(hint);
      setHintsUsed(hintsUsed + 1);
    }
  };

  if (!category || shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  const currentItem = shuffledQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

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

        {!gameActive && !gameCompleted && (
          <div className="text-center">
            <Card className="max-w-md mx-auto bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {category.title}
                </CardTitle>
                <p className="text-gray-600">
                  Modo: {gameMode === 'map' ? 'Mapa Interactivo' : 'Escritura'}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Tienes 60 segundos para responder tantas preguntas como puedas. 
                  ¡Puedes usar hasta 3 pistas!
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

        {gameActive && (
          <div className="max-w-4xl mx-auto">
            {/* Progress and Stats */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Pregunta {currentQuestion + 1} de {shuffledQuestions.length}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  Correctas: {correctAnswers.length}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            {gameMode === 'map' ? (
              <MapGame 
                currentItem={currentItem}
                category={category}
                onAnswer={checkAnswer}
                showHint={showHint}
              />
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                    ¿Cómo se llama este lugar?
                  </CardTitle>
                  {showHint && (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Pista: {showHint}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitAnswer} className="space-y-4">
                    <Input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Escribe tu respuesta aquí..."
                      className="text-lg py-3"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"
                        disabled={!userAnswer.trim()}
                      >
                        Responder
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={useHint}
                        disabled={hintsUsed >= 3}
                        className="px-4"
                      >
                        <Lightbulb className="w-4 h-4" />
                        {hintsUsed}/3
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {gameCompleted && (
          <div className="text-center">
            <Card className="max-w-md mx-auto bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  ¡Juego Completado!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{correctAnswers.length}</p>
                    <p className="text-sm text-gray-600">Correctas</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{score}</p>
                    <p className="text-sm text-gray-600">Puntuación Final</p>
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