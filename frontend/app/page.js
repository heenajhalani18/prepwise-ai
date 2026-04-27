"use client";

import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const [allScores, setAllScores] = useState([]);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [loading, setLoading] = useState(false);

  const [sessionId, setSessionId] = useState("");
  const [isListening, setIsListening] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [targetRole, setTargetRole] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const chartData = allScores.map((score, index) => ({
    question: `Q${index + 1}`,
    score,
  }));

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      setUserEmail(result.user.email);
      setUserName(result.user.displayName);
      setUserPhoto(result.user.photoURL);

      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);

      setIsLoggedIn(false);
      setUserEmail("");
      setUserName("");
      setUserPhoto("");
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- UPLOAD ----------------
  const handleUpload = async () => {
    if (!file) {
      alert("Please upload resume first");
      return;
    }

    if (!targetRole) {
      alert("Please select target role");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_role", targetRole);

    const response = await fetch("http://127.0.0.1:8000/upload-resume", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setLoading(false);

    setSessionId(data.session_id);
    setResult(data);

    setCurrentQuestionIndex(0);
    setInterviewCompleted(false);
    setAllScores([]);
    setAnswer("");
    setEvaluation(null);
    setShowEvaluation(false);
    setShowHistory(false);
  };

  // ---------------- EVALUATE ----------------
  const handleEvaluate = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/evaluate-answer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer,
          email: userEmail,
          session_id: sessionId,
        }),
      }
    );

    const data = await response.json();

    setEvaluation(data);
    setShowEvaluation(true);

    setAllScores((prev) => [...prev, data.evaluation.score]);
  };

  // ---------------- NEXT QUESTION ----------------
  const handleNextQuestion = () => {
    if (currentQuestionIndex < result.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
      setEvaluation(null);
      setShowEvaluation(false);
    } else {
      setInterviewCompleted(true);
    }
  };

  // ---------------- HISTORY ----------------
  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/history?email=${userEmail}`
      );

      const data = await response.json();

      setHistory(data.history || []);
      setShowHistory(true);
    } catch (error) {
      console.log(error);
      setHistory([]);
    }
  };

  // ---------------- VOICE ----------------
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  // ---------------- LOGIN SCREEN ----------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
          <h1 className="text-4xl font-bold mb-4">PrepWise AI</h1>

          <p className="mb-6 text-gray-600">
            AI-powered interview preparation platform
          </p>

          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      {/* NAVBAR */}
      <div className="bg-white text-black p-4 rounded-xl shadow flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-600">
          PrepWise AI
        </h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <img
            src={userPhoto}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />

          <div className="text-right">
            <p className="font-semibold">{userName}</p>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* UPLOAD SECTION */}
      <div className="bg-white text-black p-8 rounded-2xl shadow max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>

        <select
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="border p-3 rounded-lg mb-4 w-full"
        >
          <option value="">Select Target Role</option>
          <option value="Amazon SDE">Amazon SDE</option>
          <option value="Google SWE">Google SWE</option>
          <option value="Goldman Sachs Analyst">
            Goldman Sachs Analyst
          </option>
          <option value="JPMC Software Engineer">
            JPMC Software Engineer
          </option>
        </select>

        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl p-6 mb-6 cursor-pointer hover:bg-blue-50 transition">
          <span className="text-lg font-medium text-gray-700 mb-2">
            {file ? file.name : "Click to Upload Resume"}
          </span>

          <span className="text-sm text-gray-500">
            PDF format preferred
          </span>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        {result?.match_score && (
          <div className="bg-green-100 p-4 rounded-lg mb-4">
            <h3 className="font-bold">Resume Match Score:</h3>
            <p>{result.match_score.score}%</p>
            <p>
              Missing Skills:
              {result.match_score.missing.join(", ")}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>

          <button
            onClick={fetchHistory}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg"
          >
            View History
          </button>
        </div>
      </div>

      {/* INTERVIEW SECTION */}
      {result && !interviewCompleted && (
        <div className="bg-white text-black p-8 rounded-2xl shadow max-w-3xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">Mock Interview</h2>

          <p className="mb-2">
            Question {currentQuestionIndex + 1} of{" "}
            {result.questions.length}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) /
                    result.questions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            {result.questions[currentQuestionIndex]}
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border p-4 rounded-lg mb-4"
            rows="5"
          />

          <div className="flex gap-4 mb-4">
            <button
              onClick={startVoiceInput}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              {isListening
                ? "Listening..."
                : "🎤 Voice Answer"}
            </button>

            <button
              onClick={handleEvaluate}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Evaluate Answer
            </button>
          </div>

          {showEvaluation && evaluation && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold text-xl mb-2">
                Evaluation Result
              </h3>

              <p>
                Score: {evaluation.evaluation.score}/10
              </p>

              <ul className="list-disc ml-6 mt-2">
                {evaluation.evaluation.feedback.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>

              <button
                onClick={handleNextQuestion}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      )}

      {/* CHART DASHBOARD */}
      {interviewCompleted && (
        <div className="bg-white text-black p-8 rounded-2xl shadow max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6">
            Performance Dashboard
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="mt-6 text-lg font-semibold">
            Average Score:{" "}
            {(
              allScores.reduce((a, b) => a + b, 0) /
              allScores.length
            ).toFixed(1)}
            /10
          </p>
        </div>
      )}

      {/* HISTORY SECTION */}
      {showHistory && (
        <div className="bg-white text-black p-8 rounded-2xl shadow max-w-3xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Previous Interviews
          </h2>

          {history.length === 0 ? (
            <p>No history found</p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg mb-4"
              >
                <p>
                  <strong>Date:</strong>{" "}
                  {item.timestamp}
                </p>
                <p>
                  <strong>Score:</strong>{" "}
                  {item.score}/10
                </p>
                <p>
                  <strong>Answer:</strong>{" "}
                  {item.answer}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}