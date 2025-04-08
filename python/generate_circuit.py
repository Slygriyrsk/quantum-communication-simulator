from qiskit import QuantumCircuit
import os

def generate_circuit_image(purify=False):
    qc = QuantumCircuit(2)
    qc.h(0)  # Hadamard on qubit 0
    qc.cx(0, 1)  # CNOT from qubit 0 to 1
    if purify:
        qc.barrier()
        qc.h(0)  # Additional purification step (simplified)
    
    # Save circuit diagram
    filename = f"circuit{'_purified' if purify else ''}.png"
    qc.draw(output='mpl', filename=f'static/images/{filename}')
    return filename