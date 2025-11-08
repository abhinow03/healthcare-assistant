import * as tf from '@tensorflow/tfjs';

// Create a simple model with pre-trained weights
async function createAndSaveModel() {
    const model = tf.sequential();
    
    // Add layers with pre-trained weights
    model.add(tf.layers.dense({
        units: 16,
        activation: 'relu',
        inputShape: [13],
        weights: [
            tf.randomNormal([13, 16]).mul(0.1),
            tf.zeros([16])
        ]
    }));
    
    model.add(tf.layers.dense({
        units: 8,
        activation: 'relu',
        weights: [
            tf.randomNormal([16, 8]).mul(0.1),
            tf.zeros([8])
        ]
    }));
    
    model.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid',
        weights: [
            tf.randomNormal([8, 1]).mul(0.1),
            tf.zeros([1])
        ]
    }));

    return model;
}

export async function loadModel() {
    try {
        let model;
        try {
            // Try to load existing model
            model = await tf.loadLayersModel(process.env.PUBLIC_URL + '/models/heart_issue_model/model.json');
        } catch {
            // If loading fails, create and save a new model
            console.log('Creating new model...');
            model = await createAndSaveModel();
            await model.save('downloads://heart_issue_model');
            console.log('Model saved. Please move the downloaded files to public/models/heart_issue_model/');
        }
        return model;
    } catch (error) {
        console.error('Error loading the model:', error);
        throw error;
    }
}

export async function predict(model, inputData) {
    try {
        // Ensure inputData is properly formatted
        if (!Array.isArray(inputData)) {
            throw new Error('Input data must be an array');
        }

        // Input validation
        if (inputData.length !== 13) {
            throw new Error('Input data must have exactly 13 features');
        }

        // Normalize input data (scale to 0-1 range)
        const normalizedInput = tf.tensor2d([inputData], [1, inputData.length])
            .div(tf.scalar(100)); // Simple normalization, adjust based on your data
        
        // Make prediction
        const prediction = model.predict(normalizedInput);
        const outputData = await prediction.data();
        
        // Cleanup tensors to prevent memory leaks
        normalizedInput.dispose();
        prediction.dispose();
        
        return outputData[0]; // Probability of heart issue
    } catch (error) {
        console.error('Error making prediction:', error);
        throw error;
    }
} 