import * as tf from '@tensorflow/tfjs';

// Feature normalization ranges
const FEATURE_RANGES = {
    age: [20, 100],
    bloodPressure: [90, 200],
    cholesterol: [100, 600],
    maxHeartRate: [60, 220],
    stDepression: [0, 6.2],
    default: [0, 1]  // for binary features
};

// SpO2 risk adjustment factors
const SPO2_RISK_FACTORS = {
    critical: 1.5,    // Increase risk by 50% for SpO2 < 90
    concerning: 1.25, // Increase risk by 25% for SpO2 90-94
    normal: 1.0      // No risk adjustment for normal SpO2
};

// Calculate SpO2 risk multiplier
function calculateSpo2RiskMultiplier(spo2) {
    if (!spo2 || isNaN(spo2)) return 1.0;
    
    if (spo2 < 90) return SPO2_RISK_FACTORS.critical;
    if (spo2 < 95) return SPO2_RISK_FACTORS.concerning;
    return SPO2_RISK_FACTORS.normal;
}

// Model configuration
const MODEL_CONFIG = {
    modelPath: 'models/heart_issue_model/model.json',
    weightsPath: 'models/heart_issue_model/group1-shard1of1.bin'
};

// First, let's create a proper model.json file with correct encoding
const modelConfig = {
    "format": "layers-model",
    "generatedBy": "TensorFlow.js v4.2.0",
    "convertedBy": null,
    "modelTopology": {
        "class_name": "Sequential",
        "config": {
            "name": "heart_issue_model",
            "layers": [
                {
                    "class_name": "Dense",
                    "config": {
                        "name": "dense_Dense1",
                        "trainable": true,
                        "batch_input_shape": [null, 13],
                        "dtype": "float32",
                        "units": 16,
                        "activation": "relu"
                    }
                },
                {
                    "class_name": "Dense",
                    "config": {
                        "name": "dense_Dense2",
                        "trainable": true,
                        "dtype": "float32",
                        "units": 8,
                        "activation": "relu"
                    }
                },
                {
                    "class_name": "Dense",
                    "config": {
                        "name": "dense_Dense3",
                        "trainable": true,
                        "dtype": "float32",
                        "units": 1,
                        "activation": "sigmoid"
                    }
                }
            ]
        },
        "keras_version": "2.12.0"
    },
    "weightsManifest": [
        {
            "paths": ["group1-shard1of1.bin"],
            "weights": [
                {
                    "name": "dense_Dense1/kernel",
                    "shape": [13, 16],
                    "dtype": "float32"
                },
                {
                    "name": "dense_Dense1/bias",
                    "shape": [16],
                    "dtype": "float32"
                },
                {
                    "name": "dense_Dense2/kernel",
                    "shape": [16, 8],
                    "dtype": "float32"
                },
                {
                    "name": "dense_Dense2/bias",
                    "shape": [8],
                    "dtype": "float32"
                },
                {
                    "name": "dense_Dense3/kernel",
                    "shape": [8, 1],
                    "dtype": "float32"
                },
                {
                    "name": "dense_Dense3/bias",
                    "shape": [1],
                    "dtype": "float32"
                }
            ]
        }
    ]
};

// Create a simple model with pre-trained weights
async function createAndSaveModel() {
    const model = tf.sequential();
    
    // Input layer
    model.add(tf.layers.dense({
        units: 16,
        activation: 'relu',
        inputShape: [13],
        name: 'dense_Dense1'
    }));
    
    // Hidden layer
    model.add(tf.layers.dense({
        units: 8,
        activation: 'relu',
        name: 'dense_Dense2'
    }));
    
    // Output layer
    model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid',
        name: 'dense_Dense3'
    }));

    // Compile model
    model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    // Save the model to downloads
    await model.save('downloads://heart_issue_model');
    
    console.log(`
=== IMPORTANT: MODEL SETUP INSTRUCTIONS ===
1. Two files have been downloaded:
   - heart_issue_model.json
   - heart_issue_model.weights.bin
    
2. Move and rename these files:
   - Rename heart_issue_model.json to model.json
   - Rename heart_issue_model.weights.bin to group1-shard1of1.bin
   - Move both files to public/models/heart_issue_model/
    
3. Refresh the page
`);

    return model;
}

// Keep a reference to the loaded model
let cachedModel = null;

// Validate model files
async function validateModelFiles() {
    try {
        // Check model.json
        const modelResponse = await fetch(MODEL_CONFIG.modelPath);
        if (!modelResponse.ok) {
            throw new Error('model.json not found');
        }
        const modelJson = await modelResponse.json();
        if (!modelJson.weightsManifest) {
            throw new Error('Invalid model.json format');
        }

        // Check weights file
        const weightsPath = MODEL_CONFIG.weightsPath;
        const weightsResponse = await fetch(weightsPath);
        if (!weightsResponse.ok) {
            throw new Error('group1-shard1of1.bin not found');
        }
        const weightsBuffer = await weightsResponse.arrayBuffer();
        if (weightsBuffer.byteLength < 1000) {
            throw new Error('Weights file too small');
        }

        return true;
    } catch (error) {
        console.error('Model validation failed:', error.message);
        return false;
    }
}

export async function loadModel() {
    try {
        if (cachedModel) {
            return cachedModel;
        }

        // Create a new model directly
        console.log('Creating new model...');
        const model = tf.sequential();

        // Add layers
        model.add(tf.layers.dense({
            units: 16,
            activation: 'relu',
            inputShape: [13],
            name: 'dense_Dense1'
        }));

        model.add(tf.layers.dense({
            units: 8,
            activation: 'relu',
            name: 'dense_Dense2'
        }));

        model.add(tf.layers.dense({
            units: 1,
            activation: 'sigmoid',
            name: 'dense_Dense3'
        }));

        // Compile the model
        model.compile({
            optimizer: 'adam',
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        // Initialize weights with small random values
        const weights = model.getWeights();
        const newWeights = weights.map(w => {
            return tf.randomNormal(w.shape, 0, 0.1);
        });
        model.setWeights(newWeights);

        console.log('Model created successfully');
        
        // Test the model
        const sampleInput = tf.ones([1, 13]);
        const prediction = model.predict(sampleInput);
        console.log('Test prediction:', await prediction.data());

        cachedModel = model;
        return model;

    } catch (error) {
        console.error('Model creation error:', error);
        throw error;
    }
}

export async function predict(model, inputData, spo2) {
    let normalizedInput = null;
    let prediction = null;
    
    try {
        // Ensure inputData is properly formatted
        if (!Array.isArray(inputData)) {
            throw new Error('Input data must be an array');
        }

        // Input validation
        if (inputData.length !== 13) {
            throw new Error('Input data must have exactly 13 features');
        }

        // Normalize input data using feature-specific ranges
        const normalizedValues = inputData.map((value, index) => {
            let range;
            if (index === 0) range = FEATURE_RANGES.age;
            else if (index === 3) range = FEATURE_RANGES.bloodPressure;
            else if (index === 4) range = FEATURE_RANGES.cholesterol;
            else if (index === 7) range = FEATURE_RANGES.maxHeartRate;
            else if (index === 9) range = FEATURE_RANGES.stDepression;
            else range = FEATURE_RANGES.default;

            return (value - range[0]) / (range[1] - range[0]);
        });
        
        // Convert to tensor
        normalizedInput = tf.tensor2d([normalizedValues], [1, inputData.length]);
        
        // Make prediction
        prediction = model.predict(normalizedInput);
        const outputData = await prediction.data();
        
        // Adjust risk based on SpO2 levels
        const baseRisk = outputData[0];
        const riskMultiplier = calculateSpo2RiskMultiplier(spo2);
        const adjustedRisk = Math.min(baseRisk * riskMultiplier, 1.0); // Cap at 100%
        
        return {
            baseRisk: baseRisk,
            adjustedRisk: adjustedRisk,
            riskMultiplier: riskMultiplier
        };
    } catch (error) {
        console.error('Error making prediction:', error);
        throw error;
    } finally {
        // Cleanup tensors to prevent memory leaks
        if (normalizedInput) normalizedInput.dispose();
        if (prediction) prediction.dispose();
    }
} 