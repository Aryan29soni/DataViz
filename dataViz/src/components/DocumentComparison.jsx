import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Chart } from 'react-google-charts';

const DocumentComparison = ({ fileNames }) => {
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const analyses = await Promise.all(
          fileNames.map(fileName => axios.get(`/auth/analyze/${fileName}`))
        );
        setComparisonData(analyses.map(response => response.data));
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      }
    };

    fetchComparison();
  }, [fileNames]);

  if (!comparisonData) return <div>Loading comparison...</div>;

  const sentimentData = [
    ['File', 'Sentiment'],
    ...comparisonData.map((data, index) => [fileNames[index], data.sentiment])
  ];

  const wordCountData = [
    ['File', 'Word Count'],
    ...comparisonData.map((data, index) => [fileNames[index], Object.values(data.wordFrequency).reduce((a, b) => a + b, 0)])
  ];

  return (
    <div>
      <h2>Document Comparison</h2>
      
      <div>
        <h3>Sentiment Comparison</h3>
        <Chart
          width={'500px'}
          height={'300px'}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={sentimentData}
          options={{
            title: 'Sentiment Comparison',
            chartArea: { width: '50%' },
            hAxis: {
              title: 'File',
              minValue: 0,
            },
            vAxis: {
              title: 'Sentiment',
              minValue: -1,
              maxValue: 1,
            },
          }}
        />
      </div>

      <div>
        <h3>Word Count Comparison</h3>
        <Chart
          width={'500px'}
          height={'300px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={wordCountData}
          options={{
            title: 'Word Count Comparison',
            chartArea: { width: '50%' },
            hAxis: {
              title: 'Word Count',
              minValue: 0,
            },
            vAxis: {
              title: 'File',
            },
          }}
        />
      </div>
    </div>
  );
};

export default DocumentComparison;