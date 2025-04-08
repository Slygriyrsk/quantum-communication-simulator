from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import time
import random
import json

app = Flask(__name__, static_folder='.')
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/')
def index():
    return send_from_directory('.', 'multinode.html')
    #return send_from_directory('.', 'index.html') for 2 nodes simulation this is basic

@app.route('/api/simulate', methods=['POST'])
def simulate():
    data = request.json
    noise_level = data.get('noiseLevel', 0.2)
    purification_enabled = data.get('purificationEnabled', False)
    
    results = run_quantum_simulation(noise_level, purification_enabled)
    
    return jsonify(results)

def run_quantum_simulation(noise_level, purification_enabled):
    """
    Simulates quantum communication between two nodes (Alice and Bob)
    This is a simplified version of the original Python code
    
    Args:
        noise_level (float): Amount of noise in the quantum channel (0.0 to 1.0)
        purification_enabled (bool): Whether to use purification protocols
        
    Returns:
        dict: Simulation steps and final results
    """
    steps = []
    threshold = 0.8
    max_attempts = 3
    attempt = 0
    success = False
    
    while not success and attempt < max_attempts:
        attempt += 1
        
        steps.append({
            "status": "initializing",
            "progress": 0.1,
            "attempt": attempt,
            "message": f"Attempt {attempt}/{max_attempts}: Initializing qubits"
        })
        
        steps.append({
            "status": "initializing",
            "progress": 0.2,
            "attempt": attempt,
            "message": f"Creating Bell pair with Hadamard and CNOT gates"
        })
        
        steps.append({
            "status": "sending",
            "progress": 0.3,
            "attempt": attempt,
            "message": f"Sending entangled qubit from Alice to Bob"
        })
        
        fidelity = calculate_fidelity(noise_level, attempt)
        
        if purification_enabled and fidelity < threshold:
            steps.append({
                "status": "purifying",
                "progress": 0.4,
                "fidelity": fidelity,
                "attempt": attempt,
                "message": f"Applying purification protocols to improve fidelity"
            })
            
            fidelity += 0.2 + random.random() * 0.1
            fidelity = min(fidelity, 1.0)
            
            steps.append({
                "status": "purifying",
                "progress": 0.5,
                "fidelity": fidelity,
                "attempt": attempt,
                "message": f"Purification complete, new fidelity: {fidelity * 100:.1f}%"
            })
        
        steps.append({
            "status": "measuring",
            "progress": 0.7,
            "fidelity": fidelity,
            "attempt": attempt,
            "message": f"Measuring quantum state to verify entanglement"
        })
        
        if fidelity >= threshold:
            success = True
            steps.append({
                "status": "success",
                "progress": 1.0,
                "fidelity": fidelity,
                "attempt": attempt,
                "message": f"Entanglement successful with fidelity {fidelity * 100:.1f}%"
            })
        else:
            steps.append({
                "status": "retry",
                "progress": 0.9,
                "fidelity": fidelity,
                "attempt": attempt,
                "message": f"Fidelity too low ({fidelity * 100:.1f}%), retrying..."
            })
    
    latency = attempt * (1 + noise_level)
    
    results = {
        "success": success,
        "fidelity": steps[-1].get("fidelity", 0),
        "attempts": attempt,
        "latency": latency,
        "noiseLevel": noise_level,
        "purificationEnabled": purification_enabled
    }
    
    return {"steps": steps, "results": results}

def calculate_fidelity(noise_level, attempt):
    """
    Calculates the fidelity of quantum entanglement based on noise level
    
    Args:
        noise_level (float): Amount of noise in the quantum channel (0.0 to 1.0)
        attempt (int): Current attempt number
        
    Returns:
        float: Fidelity value between 0.0 and 1.0
    """

    base_fidelity = 1.0 - noise_level
    random_factor = (random.random() * 0.2) - 0.1
    attempt_bonus = (attempt - 1) * 0.05
    
    fidelity = base_fidelity + random_factor + attempt_bonus
    return max(0.5, min(1.0, fidelity))

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)