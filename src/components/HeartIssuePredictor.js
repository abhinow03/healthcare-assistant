import React, { useState, useCallback, useEffect } from 'react';
import { loadModel, predict } from '../utils/model';

// Feature labels with descriptions and valid ranges
const featureLabels = [
    { name: "Age", min: 20, max: 100 },
    { name: "Sex", min: 0, max: 1, description: "0: Female, 1: Male" },
    { name: "Chest Pain Type", min: 0, max: 3, description: "0: Typical Angina, 1: Atypical Angina, 2: Non-anginal Pain, 3: Asymptomatic" },
    { name: "Resting Blood Pressure", min: 90, max: 200, description: "in mm Hg" },
    { name: "Cholesterol", min: 100, max: 600, description: "in mg/dl" },
    { name: "Fasting Blood Sugar > 120", min: 0, max: 1, description: "0: No, 1: Yes" },
    { name: "Resting ECG", min: 0, max: 2, description: "0: Normal, 1: ST-T Wave Abnormality, 2: Left Ventricular Hypertrophy" },
    { name: "Maximum Heart Rate", min: 60, max: 220 },
    { name: "Exercise Induced Angina", min: 0, max: 1, description: "0: No, 1: Yes" },
    { name: "ST Depression", min: 0, max: 6.2, description: "Induced by exercise relative to rest" },
    { name: "ST Slope", min: 0, max: 2, description: "0: Upsloping, 1: Flat, 2: Downsloping" },
    { name: "Number of Major Vessels", min: 0, max: 3, description: "0-3" },
    { name: "Thalassemia", min: 0, max: 3, description: "0: Normal, 1: Fixed Defect, 2: Reversible Defect, 3: Unknown" }
];

// SpO2 monitoring (separate from prediction model)
const SPO2_RANGES = {
    normal: { min: 95, max: 100 },
    concerning: { min: 90, max: 94 },
    critical: { min: 0, max: 89 }
};

function HeartIssuePredictor() {
    const [model, setModel] = useState(null);
    const [inputFeatures, setInputFeatures] = useState(Array(13).fill(''));
    const [spo2Value, setSpo2Value] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [predicting, setPredicting] = useState(false);
    const [error, setError] = useState(null);
    const [modelStatus, setModelStatus] = useState('Loading model...');

    // Clear error message after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Load the model when the component mounts
    useEffect(() => {
        async function load() {
            try {
                setModelStatus('Loading model...');
                const loadedModel = await loadModel();
                setModel(loadedModel);
                setLoading(false);
                setModelStatus('Model ready');
            } catch (err) {
                setError('Error loading model: ' + err.message);
                setLoading(false);
                setModelStatus('Error loading model');
            }
        }
        load();
    }, []);

    // Debounced validation
    const debouncedValidate = useCallback(
        (value, index) => {
            const feature = featureLabels[index];
            const numValue = parseFloat(value);
            
            if (isNaN(numValue)) return false;
            if (numValue < feature.min || numValue > feature.max) return false;
            
            return true;
        },
        []
    );

    // Handle input changes with debouncing
    const handleInputChange = (index, value) => {
        const newFeatures = [...inputFeatures];
        newFeatures[index] = value;
        setInputFeatures(newFeatures);
    };

    // Reset form
    const handleReset = () => {
        setInputFeatures(Array(13).fill(''));
        setPrediction(null);
        setError(null);
    };

    // Handle prediction
    const handlePredict = async () => {
        try {
            setPredicting(true);
            setError(null);
            
            // Validate all inputs
            const numericInputs = inputFeatures.map(Number);
            const invalidInputs = numericInputs.map((value, index) => !debouncedValidate(value, index));
            
            if (invalidInputs.some(invalid => invalid)) {
                setError('Please check all input values are within valid ranges');
                return;
            }

            if (model) {
                setPrediction(null);
                const result = await predict(model, numericInputs);
                
                // Consider SpO2 in risk assessment
                const spo2Num = parseFloat(spo2Value);
                let riskMultiplier = 1.0;
                let riskMessage = '';
                
                if (!isNaN(spo2Num)) {
                    if (spo2Num < 90) {
                        riskMultiplier = 1.5; // 50% increase in risk
                        riskMessage = '⚠️ CRITICAL: Extremely low blood oxygen levels. Seek immediate medical attention!';
                    } else if (spo2Num < 95) {
                        riskMultiplier = 1.25; // 25% increase in risk
                        riskMessage = '⚠️ WARNING: Low blood oxygen levels. Please consult a healthcare provider.';
                    }
                }
                
                const baseRisk = result * 100;
                const adjustedRisk = Math.min(baseRisk * riskMultiplier, 100);
                
                setPrediction({
                    result: adjustedRisk > 50 ? "High Risk" : "Low Risk",
                    baseRisk: baseRisk.toFixed(2),
                    adjustedRisk: adjustedRisk.toFixed(2),
                    warning: riskMessage,
                    riskDetails: riskMultiplier > 1 ? 
                        `Risk increased by ${((riskMultiplier - 1) * 100).toFixed(0)}% due to low SpO2 (${spo2Num}%)` : 
                        null
                });
            }
        } catch (err) {
            setError('Error making prediction: ' + err.message);
        } finally {
            setPredicting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">{modelStatus}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h1 className="text-xl font-semibold">Heart Issue Predictor</h1>
                <span className={`text-sm ${model ? 'text-green-500' : 'text-red-500'}`}>
                    {modelStatus}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* SpO2 Monitoring */}
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Blood Oxygen Monitoring</h3>
                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-400 mb-1">
                                    SpO2 Level
                                    <span className="text-xs text-gray-500 ml-1">
                                        (Normal: 95-100%)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    value={spo2Value}
                                    onChange={(e) => setSpo2Value(e.target.value)}
                                    className={`w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 
                                        ${parseFloat(spo2Value) >= 95 
                                            ? 'focus:ring-green-500 border-green-500/50' 
                                            : parseFloat(spo2Value) >= 90
                                                ? 'focus:ring-yellow-500 border-yellow-500/50'
                                                : 'focus:ring-red-500 border-red-500/50'}`}
                                    min="0"
                                    max="100"
                                    step="1"
                                    placeholder="Enter SpO2 value"
                                />
                            </div>
                            <div className="mb-2">
                                {spo2Value && (
                                    <span className={`text-sm font-medium ${
                                        parseFloat(spo2Value) >= 95 
                                            ? 'text-green-500' 
                                            : parseFloat(spo2Value) >= 90
                                                ? 'text-yellow-500'
                                                : 'text-red-500'
                                    }`}>
                                        {parseFloat(spo2Value) >= 95 
                                            ? '✓ Normal' 
                                            : parseFloat(spo2Value) >= 90
                                                ? '⚠️ Concerning'
                                                : '🚨 Critical'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg animate-fade-in">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}

                    {/* Input Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inputFeatures.map((feature, index) => (
                            <div key={index} className="space-y-2">
                                <label className="block text-sm">
                                    <span className="text-gray-400">{featureLabels[index].name}</span>
                                    {featureLabels[index].description && (
                                        <span className="text-xs text-gray-500 ml-1">
                                            ({featureLabels[index].description})
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={feature}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        className={`w-full bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 
                                            ${debouncedValidate(feature, index) || feature === '' 
                                                ? 'focus:ring-green-500' 
                                                : 'focus:ring-red-500 border-red-500'}`}
                                        step="any"
                                        placeholder={`${featureLabels[index].min}-${featureLabels[index].max}`}
                                        disabled={predicting}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handlePredict}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!model || inputFeatures.some(f => f === '') || predicting}
                        >
                            {predicting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Predicting...
                                </span>
                            ) : (
                                'Predict Heart Issue Risk'
                            )}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={predicting || inputFeatures.every(f => f === '')}
                        >
                            Reset
                        </button>
                    </div>

                    {/* Prediction Result */}
                    {prediction && (
                        <div className={`p-4 rounded-lg ${
                            prediction.result === "High Risk" 
                                ? "bg-red-500/10 border border-red-500" 
                                : "bg-green-500/10 border border-green-500"
                        }`}>
                            <h2 className="text-lg font-semibold mb-2">Prediction Result</h2>
                            <p className="text-2xl font-bold mb-1">
                                {prediction.result}
                            </p>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-400">
                                    Base Risk: {prediction.baseRisk}%
                                </p>
                                <p className="text-sm text-gray-400">
                                    Adjusted Risk: {prediction.adjustedRisk}%
                                </p>
                                {prediction.riskDetails && (
                                    <p className="text-sm text-yellow-500">
                                        {prediction.riskDetails}
                                    </p>
                                )}
                            </div>
                            {prediction.warning && (
                                <p className="mt-2 text-sm text-yellow-500">
                                    ⚠️ {prediction.warning}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Feature Description */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Input Guidelines:</h3>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• All fields are required and must be within the specified ranges</li>
                            <li>• For yes/no fields, use 1 for yes and 0 for no</li>
                            <li>• Blood pressure and cholesterol should be recent measurements</li>
                            <li>• Consult a healthcare professional for accurate interpretation of results</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeartIssuePredictor; 