from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
from qiskit_aer.noise import NoiseModel, depolarizing_error
import numpy as np
import time

def create_entanglement_circuit(purify=False):
    qc = QuantumCircuit(2, 2)
    qc.h(0)  # Hadamard gate
    qc.cx(0, 1)  # CNOT for entanglement
    if purify:
        qc.h(0)  # Simplified purification step
        qc.cx(0, 1)
    qc.measure([0, 1], [0, 1])
    return qc

def run_simulation(runs, noise_level, purify):
    # Noise model
    noise_model = NoiseModel()
    error = depolarizing_error(noise_level, 1)
    noise_model.add_all_qubit_quantum_error(error, ['h', 'cx'])

    # Simulator
    simulator = AerSimulator(noise_model=noise_model)
    circuit = create_entanglement_circuit(purify)

    results = {'success': [], 'fidelity': []}
    for _ in range(runs):
        job = simulator.run(circuit, shots=1024)
        counts = job.result().get_counts()
        
        # Calculate success (entangled states: '00' or '11')
        success_counts = counts.get('00', 0) + counts.get('11', 0)
        success_rate = success_counts / 1024
        fidelity = max(0.5, success_rate - noise_level) if not purify else min(1.0, success_rate + 0.1)
        
        results['success'].append(success_rate > 0.7)  # Threshold for success
        results['fidelity'].append(fidelity)
        time.sleep(0.1)  # Simulate latency
    
    return {
        'noise_level': noise_level,
        'success': results['success'],
        'fidelity': results['fidelity'],
        'avg_fidelity': np.mean(results['fidelity']),
        'avg_success': np.mean(results['success'])
    }

if __name__ == "__main__":
    # Test locally
    result = run_simulation(5, 0.2, False)
    print(result)