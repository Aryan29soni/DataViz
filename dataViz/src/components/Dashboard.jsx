import React, { useEffect, useState, useRef } from 'react';
import axios from '../utils/axios';
import { Chart } from 'react-google-charts';
import { useParams, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaMailBulk, FaImage, FaArrowLeft, FaEdit, FaExpand } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import './Dashboard.css';
import EditAxisTitlePopup from './EditAxisTitlePopup';
import TextAnalysis from './TextAnalysis';
import { toast } from 'react-toastify';

const chartTypes = [
  'AreaChart', 'BarChart', 'BubbleChart', 'Calendar', 'CandlestickChart', 'ColumnChart', 'ComboChart',
  'DiffChart', 'Gantt', 'Gauge', 'GeoChart', 'Histogram', 'LineChart', 'Map', 'OrgChart',
  'PieChart', 'Sankey', 'ScatterChart', 'SteppedAreaChart', 'Table', 'Timeline', 'TreeMap', 'WaterfallChart',
  'WordTree'
];

const Dashboard = () => {
  const [chartData, setChartData] = useState({ generalData: [], monthWiseData: {} });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [chartType, setChartType] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedChartType, setSelectedChartType] = useState('BarChart');
  const [hAxisTitle, setHAxisTitle] = useState('Metric');
  const [vAxisTitle, setVAxisTitle] = useState('Values');
  const [editingAxis, setEditingAxis] = useState(null);
  const { fileName } = useParams();
  const dashboardRef = useRef();
  const chartRef = useRef(null);
  const navigate = useNavigate();
  const [expandedChart, setExpandedChart] = useState(null);
  const [editingChart, setEditingChart] = useState(null);
  const [fileType, setFileType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (fetchedRef.current || !fileName) return;
      
      setIsLoading(true);
      try {
        console.log(`Fetching data for file: ${fileName}`); 
        const extension = fileName.split('.').pop().toLowerCase();
        setFileType(extension);

        if (extension === 'csv' || extension === 'xlsx') {
          const response = await axios.get(`/auth/reports/${fileName}`);
          setChartData(response.data);
          console.log('Data fetched successfully');
          setChartData(null);
          console.log('Unsupported file type'); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
      fetchedRef.current = true;
    };

    fetchData();

    return () => {
      fetchedRef.current = false;
    };
  }, [fileName]);

  const generateCharts = () => {
    if (chartType === 'general' || (chartType === 'monthWise' && selectedMonth && selectedIndustry)) {

      axios.post('/notifications', { title: 'Dashboard Generated', message: 'Your dashboard has been successfully generated.', type: 'success' })
        .then(() => toast.success('Dashboard generated successfully!'))
        .catch(error => {
          console.error('Error creating notification:', error);
          toast.error('Error creating notification');
        });
    }
  };

  const editAxisTitle = (axis) => {
    setEditingAxis(axis);
  };

  const handleAxisTitleChange = (event) => {
    if (editingAxis === 'h') {
      setHAxisTitle(event.target.value);
    } else {
      setVAxisTitle(event.target.value);
    }
  };

  const handleBackClick = () => {
    setChartType('');
    setSelectedMonth('');
    setSelectedIndustry('');
  };

  const handleAxisTitleBlur = () => {
    setEditingAxis(null);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry);
  };

  const handleSelectedChartTypeChange = (event) => {
    setSelectedChartType(event.target.value);
  };

  const handleExpandChart = (index) => {
    setExpandedChart(index);
  };
  
  const handleEditChart = (index) => {
    setEditingChart(index);
  };
  
  const handleCloseExpandedChart = () => {
    setExpandedChart(null);
  };
  
  const handleAxisTitleClick = (axis, index) => {
    if (editingChart === index) {
      editAxisTitle(axis);
    }
  };

  const renderAxisTitle = (axis) => {
    const title = axis === 'h' ? hAxisTitle : vAxisTitle;
    if (editingAxis === axis) {
      return (
        <input
          type="text"
          value={title}
          onChange={handleAxisTitleChange}
          onBlur={handleAxisTitleBlur}
          autoFocus
        />
      );
    }
    return (
      <div onClick={() => editAxisTitle(axis)}>
        {title} <FaEdit style={{ marginLeft: '5px', cursor: 'pointer' }} />
      </div>
    );
  };

  const renderChart = (chartData, index) => {
    return (
      <div className={`chart ${expandedChart === index ? 'expanded' : ''} ${editingChart === index ? 'editing' : ''}`} key={index}>
        <div className="chart-menu">
          <div className="three-dot-menu">⋮</div>
          <div className="menu-options">
            <button onClick={() => handleExpandChart(index)}><FaExpand /> Expand</button>
            <button onClick={() => handleEditChart(index)}><FaEdit /> Edit</button>
          </div>
        </div>
        <div className="axis-title h-axis-title" onClick={() => handleAxisTitleClick('h', index)}>
          {renderAxisTitle('h')}
        </div>
        <Chart
          width={'100%'}
          height={'400px'}
          chartType={selectedChartType}
          loader={<div>Loading Chart...</div>}
          data={chartData.data}
          options={{
            ...chartData.options,
            hAxis: { title: '', titleTextStyle: { color: '#333', italic: false } },
            vAxis: { title: '', titleTextStyle: { color: '#333', italic: false } },
          }}
          ref={chartRef}
        />
        <div className="axis-title v-axis-title" onClick={() => handleAxisTitleClick('v', index)}>
          {renderAxisTitle('v')}
        </div>
      </div>
    );
  };

  const renderGeneralCharts = () => {
    return chartData.generalData.map((chart, index) => renderChart(chart, index));
  };

  const renderMonthWiseChart = () => {
    if (!selectedMonth || !selectedIndustry) return null;

    const monthData = chartData.monthWiseData[selectedMonth]?.[selectedIndustry];
    if (!monthData) return <p>No data available for selected month and industry.</p>;

    const data = [['Metric', 'Value']];
    Object.entries(monthData).forEach(([metric, value]) => {
      data.push([metric, value]);
    });

    return renderChart({
      data,
      options: {
        title: `${selectedMonth} - ${selectedIndustry} Metrics`,
        chartArea: { width: '50%' },
        legend: { position: 'none' },
      }
    }, 0);
  };

  const renderCharts = () => {
    if (chartType === 'general') {
      generateCharts();
      return renderGeneralCharts();
    } else if (chartType === 'monthWise' && selectedMonth && selectedIndustry) {
      generateCharts();
      return renderMonthWiseChart();
    }
    return null;
  };

  const toggleShareMenu = () => {
    setShowShareMenu(!showShareMenu);
  };

  const downloadScreenshot = async () => {
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(dashboardRef.current);
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${fileName}_report.png`;
      link.click();
      

      await axios.post('/notifications', { title: 'Dashboard Downloaded', message: 'Your dashboard has been downloaded as a screenshot.', type: 'info' });
      toast.success('Dashboard downloaded successfully!');
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Failed to save report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard for {fileName}</h1>
      
      {(fileType === 'csv' || fileType === 'xlsx') ? (
        <>
          {chartType && (
            <button className="back-button" onClick={handleBackClick}>
              <FaArrowLeft /> Back to Chart Type Selection
            </button>
          )}

          {!chartType && (
            <div className="chart-type-selector">
              <h2>Choose type of chart generation</h2>
              <select onChange={(e) => handleChartTypeChange(e.target.value)}>
                <option value="">Select chart type</option>
                <option value="general">General</option>
                <option value="monthWise">Month wise</option>
              </select>
            </div>
          )}

          {chartType === 'monthWise' && (
            <div className="month-industry-selector">
              <select onChange={(e) => handleMonthChange(e.target.value)}>
                <option value="">Select month</option>
                {Object.keys(chartData.monthWiseData).map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select onChange={(e) => handleIndustryChange(e.target.value)}>
                <option value="">Select industry</option>
                {selectedMonth &&
                  Object.keys(chartData.monthWiseData[selectedMonth] || {}).map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
              </select>
            </div>
          )}

          {chartType && (
            <div className="chart-type-selector">
              <select onChange={handleSelectedChartTypeChange} value={selectedChartType}>
                {chartTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          <div className="dashboard-content" ref={dashboardRef}>
            <div className="charts-container">
              {renderCharts()}
            </div>
            <div className="download-section">
              <button className="big-download-button" onClick={toggleShareMenu}>Share this Report</button>
              <button
                className="big-download-button"
                onClick={downloadScreenshot}
                disabled={isDownloading || (chartType === 'general' && chartData.generalData.length === 0) || (chartType === 'monthWise' && (!selectedMonth || !selectedIndustry))}
              >
                {isDownloading ? 'Downloading...' : 'Download Report'}
              </button>
            </div>
          </div>

          {showShareMenu && (
            <div className="overlay">
              <div className="share-menu">
                <button className="share-button" onClick={toggleShareMenu}>
                  <FaArrowLeft className="share-icon" /> Back
                </button>
                <button className="share-button" onClick={() => console.log('Share on WhatsApp')}>
                  <FaWhatsapp className="share-icon" /> Share on WhatsApp
                </button>
                <button className="share-button" onClick={() => console.log('Share via Email')}>
                  <FaMailBulk className="share-icon" /> Share via Email
                </button>
                <button className="share-button" onClick={() => console.log('Share as PNG')}>
                  <FaImage className="share-icon" /> Share as PNG
                </button>
              </div>
            </div>
          )}

          {expandedChart !== null && (
            <div className="expanded-chart-overlay" onClick={handleCloseExpandedChart}>
              <div className="expanded-chart-container" onClick={(e) => e.stopPropagation()}>
                {renderChart(chartType === 'general' ? chartData.generalData[expandedChart] : {
                  data: [['Metric', 'Value'], ...Object.entries(chartData.monthWiseData[selectedMonth][selectedIndustry])],
                  options: {
                    title: `${selectedMonth} - ${selectedIndustry} Metrics`,
                    chartArea: { width: '50%' },
                    legend: { position: 'none' },
                  }
                }, expandedChart)}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-analysis-charts">
          <TextAnalysis fileName={fileName} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;