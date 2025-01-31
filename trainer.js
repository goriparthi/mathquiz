import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const generateProblem = () => {
  let num1 = Math.floor(Math.random() * 19) + 1;
  let num2 = Math.floor(Math.random() * Math.min(num1, 10)) + 1;
  let isAddition = Math.random() > 0.5;
  return isAddition
    ? { question: `${num1} + ${num2}`, answer: num1 + num2 }
    : { question: `${num1} - ${num2}`, answer: num1 - num2 };
};

const MathGame = () => {
  const [timeLimit, setTimeLimit] = useState(null);
  const [problem, setProblem] = useState(generateProblem());
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [slowAnswers, setSlowAnswers] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [gameOver, setGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [feedback, setFeedback] = useState(null);
  
  useEffect(() => {
    if (timeLimit !== null) {
      startGame();
    }
  }, [timeLimit]);

  useEffect(() => {
    if (timeLimit && !gameOver) {
      setTimeRemaining(timeLimit);
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setGameOver(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLimit, gameOver]);

  const startGame = () => {
    setProblem(generateProblem());
    setStartTime(Date.now());
    setScore(0);
    setIncorrectAnswers([]);
    setSlowAnswers([]);
    setGameOver(false);
    setTimeRemaining(timeLimit);
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (!problem) return;
    const timeTaken = (Date.now() - startTime) / 1000;
    if (parseInt(userAnswer) === problem.answer) {
      setScore(score + 1);
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(null);
        setProblem(generateProblem());
        setUserAnswer("");
        setStartTime(Date.now());
      }, 1000);
    } else {
      setFeedback("incorrect");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-purple-100">
      {timeLimit === null ? (
        <div>
          <h2 className="text-5xl font-bold mb-6 text-purple-700">Select Time Limit</h2>
          {[30, 60, 120, 180].map((time) => (
            <Button key={time} onClick={() => setTimeLimit(time)} className="text-3xl m-2 p-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg">{time} Seconds</Button>
          ))}
        </div>
      ) : gameOver ? (
        <div>
          <h2 className="text-6xl font-bold mb-6 text-red-700">Game Over!</h2>
          <p className="text-4xl mb-4">Score: {score}</p>
          <Button onClick={() => setTimeLimit(null)} className="text-3xl p-4 m-2 bg-green-500 hover:bg-green-700 text-white rounded-lg">Retry</Button>
          <Button onClick={() => setTimeLimit(null)} className="text-3xl p-4 m-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg">Home</Button>
        </div>
      ) : (
        <>
          <h2 className="text-6xl font-bold mb-6 text-purple-700">Time Left: {timeRemaining}s</h2>
          <Card className="p-16 shadow-lg bg-white rounded-xl border-4 border-purple-400">
            <CardContent>
              <div className={`text-8xl font-bold flex justify-center items-center transition-all duration-500 ${feedback === "correct" ? "text-green-500" : feedback === "incorrect" ? "text-red-500" : "text-black"}`}>
                <span>{problem ? problem.question : "Loading..."}</span>
                <span className="mx-6">=</span>
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                  className="text-9xl w-64 h-32 text-center border-4 border-purple-500 rounded-lg appearance-none"
                  style={{ fontSize: '5rem' }}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MathGame;
