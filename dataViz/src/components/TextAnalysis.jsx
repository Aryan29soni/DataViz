import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Chart } from 'react-google-charts';
import { FaRobot, FaTimes } from 'react-icons/fa';
import './TextAnalysis.css';
import { toast } from 'react-toastify';

const TextAnalysis = ({ fileName }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await axios.get(`/auth/analyze/${fileName}`);
        setAnalysisData(response.data);
        toast.success('Text analysis dashboard generated successfully!');
      } catch (error) {
        console.error('Error fetching analysis:', error);
        toast.error('Error generating text analysis dashboard. Please try again.');
      }
    };

    fetchAnalysis();
  }, [fileName]);
  if (!analysisData) return <div>Loading analysis...</div>;

  const wordFrequencyData = [
    ['Word', 'Frequency'],
    ...Object.entries(analysisData.wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  ];

  const getSentimentDescription = (score) => {
    if (score <= -0.6) return 'Very Negative';
    if (score <= -0.2) return 'Negative';
    if (score < 0.2) return 'Neutral';
    if (score < 0.6) return 'Positive';
    return 'Very Positive';
  };

  const generateSummary = () => {
    const sentimentScore = analysisData.sentiment;
    const sentimentDescription = getSentimentDescription(sentimentScore);
    const topWords = Object.entries(analysisData.wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, _]) => word);

    return (
      <div className="ai-summary-content">
        <h3>AI Summary</h3>
        <ul>
          <li>Overall sentiment score: {sentimentScore.toFixed(2)} ({sentimentDescription})</li>
          <li>Total words: {analysisData.textStructure.wordCount}</li>
          <li>Total sentences: {analysisData.textStructure.sentenceCount}</li>
          <li>Average words per sentence: {analysisData.textStructure.averageWordsPerSentence.toFixed(2)}</li>
          <li>Top 5 most frequent words: {topWords.join(', ')}</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="text-analysis">
      <div className="chart-container">
        <h3>Sentiment Analysis</h3>
        <Chart
          width={'500px'}
          height={'300px'}
          chartType="Gauge"
          loader={<div>Loading Chart</div>}
          data={[
            ['Label', 'Value'],
            ['Sentiment', analysisData.sentiment]
          ]}
          options={{
            redFrom: -1,
            redTo: -0.3,
            yellowFrom: -0.3,
            yellowTo: 0.3,
            greenFrom: 0.3,
            greenTo: 1,
            minorTicks: 5,
            min: -1,
            max: 1
          }}
        />
      </div>

      <div className="chart-container">
        <h3>Word Frequency</h3>
        <Chart
          width={'500px'}
          height={'300px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={wordFrequencyData}
          options={{
            title: 'Top 10 Most Frequent Words',
            chartArea: { width: '50%' },
            hAxis: {
              title: 'Frequency',
              minValue: 0,
            },
            vAxis: {
              title: 'Word',
            },
          }}
        />
      </div>

      <div className="ai-summary-container">
        <button className="ai-summary-button" onClick={() => setShowSummary(true)}>
          <FaRobot /> See Summary
        </button>
      </div>

      {showSummary && (
        <div className="overlay">
          <div className="popup">
            <button className="close-button" onClick={() => setShowSummary(false)}>
              <FaTimes />
            </button>
            {generateSummary()}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalysis;