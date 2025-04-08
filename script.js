document.addEventListener("DOMContentLoaded", () => {
    class QuantumSimulation {
      constructor() {
        this.steps = []
        this.results = null
        this.currentStepIndex = 0
        this.isRunning = false
        this.isPaused = false
        this.simulationTimer = null
        this.fidelityHistory = []
        this.errorRateHistory = []
        this.nodeCount = 2 // set it to default at start btw: Alice and Bob
        this.networkTopology = "linear" // default: linear chain of nodes
      }
  
      setNodeCount(count) {
        this.nodeCount = Math.min(Math.max(2, count), 10) // we can fix the limit btw 2-10 nodes at a time
      }
  
      setNetworkTopology(topology) {
        this.networkTopology = topology
      }
  
      simulateQuantumCommunication(
        noiseLevel,
        purificationEnabled,
        entanglementType = "bell",
        errorModel = "depolarizing",
      ) {
        const steps = []
        const threshold = 0.8
        const maxAttempts = 3
        let attempt = 0
        let success = false
  
        this.fidelityHistory = []
        this.errorRateHistory = []
  
        // we'll get the node counts and topology from class properties
        const nodeCount = this.nodeCount
        const networkTopology = this.networkTopology
  
        while (!success && attempt < maxAttempts) {
          attempt++
  
          steps.push({
            status: "initializing",
            progress: 0.1,
            attempt,
            message: `Attempt ${attempt}/${maxAttempts}: Initializing ${nodeCount} qubits`,
            entanglementType,
            errorModel,
            nodeCount,
            networkTopology,
          })
  
          let entanglementDescription = ""
          switch (entanglementType) {
            case "ghz":
              entanglementDescription = `Creating GHZ state across ${nodeCount} nodes`
              break
            case "w":
              entanglementDescription = `Creating W state across ${nodeCount} nodes`
              break
            default:
              entanglementDescription = `Creating Bell pairs between nodes in ${networkTopology} topology`
          }
  
          steps.push({
            status: "initializing",
            progress: 0.2,
            attempt,
            message: entanglementDescription,
            entanglementType,
            errorModel,
            nodeCount,
            networkTopology,
          })
  
          steps.push({
            status: "sending",
            progress: 0.3,
            attempt,
            message: `Distributing entangled qubits across ${nodeCount} nodes`,
            entanglementType,
            errorModel,
            nodeCount,
            networkTopology,
          })
  
          // Calculate fidelity based on network complexity
          // More nodes or complex topologies have lower base fidelity
          const topologyFactor =
            networkTopology === "mesh" ? 0.15 : networkTopology === "ring" ? 0.1 : networkTopology === "star" ? 0.05 : 0
  
          const nodeFactor = Math.max(0, (nodeCount - 2) * 0.03)
          const adjustedNoiseLevel = noiseLevel + topologyFactor + nodeFactor
  
          let fidelity = this.calculateFidelity(adjustedNoiseLevel, attempt, errorModel)
          let errorRate = adjustedNoiseLevel
  
          this.fidelityHistory.push(fidelity)
          this.errorRateHistory.push(errorRate)
  
          if (purificationEnabled && fidelity < threshold) {
            steps.push({
              status: "purifying",
              progress: 0.4,
              fidelity,
              errorRate,
              attempt,
              message: `Applying purification protocols across ${nodeCount} nodes`,
              entanglementType,
              errorModel,
              nodeCount,
              networkTopology,
            })
  
            // Purification is less effective with more nodes because as the number of nodes increased more prone to noise
            const purificationEfficiency = 1 - (nodeCount - 2) * 0.1
            fidelity += (0.2 + Math.random() * 0.1) * purificationEfficiency
            fidelity = Math.min(fidelity, 1.0)
  
            errorRate *= 0.6
  
            this.fidelityHistory.push(fidelity)
            this.errorRateHistory.push(errorRate)
  
            steps.push({
              status: "purifying",
              progress: 0.5,
              fidelity,
              errorRate,
              attempt,
              message: `Purification complete, new fidelity: ${(fidelity * 100).toFixed(1)}%`,
              entanglementType,
              errorModel,
              nodeCount,
              networkTopology,
            })
          }
  
          steps.push({
            status: "measuring",
            progress: 0.7,
            fidelity,
            errorRate,
            attempt,
            message: `Measuring quantum state across ${nodeCount} nodes`,
            entanglementType,
            errorModel,
            nodeCount,
            networkTopology,
          })
  
          this.fidelityHistory.push(fidelity)
          this.errorRateHistory.push(errorRate)
  
          if (fidelity >= threshold) {
            success = true
            steps.push({
              status: "success",
              progress: 1.0,
              fidelity,
              errorRate,
              attempt,
              message: `Network entanglement successful with fidelity ${(fidelity * 100).toFixed(1)}%`,
              entanglementType,
              errorModel,
              nodeCount,
              networkTopology,
            })
          } else if (attempt < maxAttempts) {
            steps.push({
              status: "retry",
              progress: 0.9,
              fidelity,
              errorRate,
              attempt,
              message: `Fidelity too low (${(fidelity * 100).toFixed(1)}%), retrying...`,
              entanglementType,
              errorModel,
              nodeCount,
              networkTopology,
            })
          } else {
            steps.push({
              status: "retry",
              progress: 1.0,
              fidelity,
              errorRate,
              attempt,
              message: `Maximum attempts reached. Final fidelity: ${(fidelity * 100).toFixed(1)}%`,
              entanglementType,
              errorModel,
              nodeCount,
              networkTopology,
            })
          }
  
          this.fidelityHistory.push(fidelity)
          this.errorRateHistory.push(errorRate)
        }
  
        // Latency increases with node count and topology complexity
        const topologyLatencyFactor =
          networkTopology === "mesh"
            ? nodeCount * 0.2
            : networkTopology === "ring"
              ? nodeCount * 0.1
              : networkTopology === "star"
                ? nodeCount * 0.05
                : nodeCount * 0.03
  
        const latency = attempt * (1 + noiseLevel) + topologyLatencyFactor
  
        const results = {
          success,
          fidelity: steps[steps.length - 1].fidelity || 0,
          errorRate: steps[steps.length - 1].errorRate || noiseLevel,
          attempts: attempt,
          latency,
          noiseLevel,
          purificationEnabled,
          entanglementType,
          errorModel,
          nodeCount,
          networkTopology,
          fidelityHistory: this.fidelityHistory,
          errorRateHistory: this.errorRateHistory,
        }
  
        this.steps = steps
        this.results = results
        return { steps, results }
      }
  
      calculateFidelity(noiseLevel, attempt, errorModel) {
        const baseFidelity = 1.0 - noiseLevel
        const randomFactor = Math.random() * 0.2 - 0.1
        const attemptBonus = (attempt - 1) * 0.05
  
        let errorModelFactor = 0
        switch (errorModel) {
          case "amplitude":
            errorModelFactor = 0.1
            break
          case "phase":
            errorModelFactor = 0.05
            break
          default:
            errorModelFactor = -0.05
        }
  
        const fidelity = baseFidelity + randomFactor + attemptBonus + errorModelFactor
        return Math.max(0.5, Math.min(1.0, fidelity))
      }
  
      startSimulation(noiseLevel, purificationEnabled, speed, entanglementType, errorModel, onStep, onComplete) {
        this.reset()
        this.simulateQuantumCommunication(noiseLevel, purificationEnabled, entanglementType, errorModel)
        this.isRunning = true
        this.isPaused = false
        this.currentStepIndex = 0
        this.runNextStep(speed, onStep, onComplete)
      }
  
      runNextStep(speed, onStep, onComplete) {
        if (!this.isRunning || this.isPaused) return
  
        if (this.currentStepIndex < this.steps.length) {
          const currentStep = this.steps[this.currentStepIndex]
          if (onStep) onStep(currentStep, this.currentStepIndex, this.steps)
          this.currentStepIndex++
  
          const baseDelay = 1000
          const stepDelay = baseDelay / speed
  
          this.simulationTimer = setTimeout(() => {
            this.runNextStep(speed, onStep, onComplete)
          }, stepDelay)
        } else {
          this.isRunning = false
          if (onComplete) onComplete(this.results)
        }
      }
  
      togglePause(speed, onStep, onComplete) {
        this.isPaused = !this.isPaused
  
        if (!this.isPaused && this.isRunning) {
          this.runNextStep(speed, onStep, onComplete)
        }
      }
  
      reset() {
        if (this.simulationTimer) {
          clearTimeout(this.simulationTimer)
          this.simulationTimer = null
        }
  
        this.steps = []
        this.results = null
        this.currentStepIndex = 0
        this.isRunning = false
        this.isPaused = false
        this.fidelityHistory = []
        this.errorRateHistory = []
      }
  
      getCurrentStep() {
        if (this.currentStepIndex > 0 && this.currentStepIndex <= this.steps.length) {
          return this.steps[this.currentStepIndex - 1]
        }
        return null
      }
  
      getSimulationHistory() {
        return this.steps
      }
  
      getResults() {
        return this.results
      }
  
      getFidelityHistory() {
        return this.fidelityHistory
      }
  
      getErrorRateHistory() {
        return this.errorRateHistory
      }
    }
  
    class QuantumNetworkVisualizer {
      constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext("2d")
        this.currentStep = null
        this.noiseLevel = 0.2
        this.purificationEnabled = false
        this.entanglementType = "bell"
        this.errorModel = "depolarizing"
        this.animationFrame = null
        this.nodeCount = 2 // Default: Alice and Bob
        this.networkTopology = "linear" // Default: linear chain of nodes
        this.nodes = [] // Will store node information
        this.connections = [] // Will store connection information
  
        this.initializeNodes()
        this.resizeCanvas()
        window.addEventListener("resize", () => this.resizeCanvas())
        this.animate()
      }
  
      initializeNodes() {
        this.nodes = []
        this.connections = []
  
        // Create nodes based on count and topology
        const nodeColors = [
          "#3b82f6", // Blue
          "#8b5cf6", // Purple
          "#ec4899", // Pink
          "#10b981", // Green
          "#f59e0b", // Yellow
          "#ef4444", // Red
          "#06b6d4", // Cyan
          "#a855f7", // Violet
          "#14b8a6", // Teal
          "#f43f5e", // Rose
        ]
  
        const nodeNames = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy"]
  
        for (let i = 0; i < this.nodeCount; i++) {
          this.nodes.push({
            id: i,
            name: nodeNames[i] || `Node ${i + 1}`,
            color: nodeColors[i % nodeColors.length],
            glowColor: nodeColors[i % nodeColors.length],
            x: 0, // Will be calculated in draw()
            y: 0, // Will be calculated in draw()
            radius: 40,
            entangled: false,
            fidelity: 0,
          })
        }
  
        // Create connections based on topology
        this.createConnections()
      }
  
      createConnections() {
        this.connections = []
  
        switch (this.networkTopology) {
          case "star":
            // Central node (0) connected to all others
            for (let i = 1; i < this.nodes.length; i++) {
              this.connections.push({
                source: 0,
                target: i,
                active: false,
                fidelity: 0,
              })
            }
            break
  
          case "ring":
            // Each node connected to next in a circle
            for (let i = 0; i < this.nodes.length; i++) {
              this.connections.push({
                source: i,
                target: (i + 1) % this.nodes.length,
                active: false,
                fidelity: 0,
              })
            }
            break
  
          case "mesh":
            // Every node connected to every other node
            for (let i = 0; i < this.nodes.length; i++) {
              for (let j = i + 1; j < this.nodes.length; j++) {
                this.connections.push({
                  source: i,
                  target: j,
                  active: false,
                  fidelity: 0,
                })
              }
            }
            break
  
          case "linear":
          default:
            // Each node connected to next in a line
            for (let i = 0; i < this.nodes.length - 1; i++) {
              this.connections.push({
                source: i,
                target: i + 1,
                active: false,
                fidelity: 0,
              })
            }
            break
        }
      }
  
      setNodeCount(count) {
        this.nodeCount = Math.min(Math.max(2, count), 10) // Limit between 2 and 10 nodes
        this.initializeNodes()
      }
  
      setNetworkTopology(topology) {
        this.networkTopology = topology
        this.createConnections()
      }
  
      update(step, noiseLevel, purificationEnabled, entanglementType = "bell", errorModel = "depolarizing") {
        this.currentStep = step
        this.noiseLevel = noiseLevel
        this.purificationEnabled = purificationEnabled
        this.entanglementType = entanglementType
        this.errorModel = errorModel
  
        // Update connection states based on simulation step
        if (step) {
          const fidelity = step.fidelity || 0
  
          // Update connections based on simulation step
          this.connections.forEach((conn) => {
            if (
              step.status === "success" ||
              step.status === "measuring" ||
              step.status === "purifying" ||
              step.status === "sending"
            ) {
              conn.active = true
              conn.fidelity = fidelity
            } else {
              conn.active = false
              conn.fidelity = 0
            }
          })
        } else {
          // Reset connections
          this.connections.forEach((conn) => {
            conn.active = false
            conn.fidelity = 0
          })
        }
      }
  
      resizeCanvas() {
        const container = this.canvas.parentElement
        const devicePixelRatio = window.devicePixelRatio || 1
  
        this.canvas.style.width = container.clientWidth + "px"
        this.canvas.style.height = container.clientHeight + "px"
  
        this.canvas.width = container.clientWidth * devicePixelRatio
        this.canvas.height = 400 * devicePixelRatio
  
        this.ctx.scale(devicePixelRatio, devicePixelRatio)
        this.draw()
      }
  
      animate() {
        this.draw()
        this.animationFrame = requestAnimationFrame(() => this.animate())
      }
  
      draw() {
        const ctx = this.ctx
        const width = this.canvas.clientWidth
        const height = this.canvas.clientHeight
  
        ctx.clearRect(0, 0, width, height)
  
        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, "#050714")
        gradient.addColorStop(1, "#0a0f24")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
  
        ctx.strokeStyle = "rgba(59, 130, 246, 0.1)"
        ctx.lineWidth = 1
  
        for (let y = 0; y < height; y += 40) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(width, y)
          ctx.stroke()
        }
  
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, height)
          ctx.stroke()
        }
  
        // Calculate node positions based on topology
        this.calculateNodePositions(width, height)
  
        // Draw connections
        this.drawConnections(ctx)
  
        // Draw nodes
        this.drawNodes(ctx)
  
        // Draw status message
        this.drawStatusMessage()
      }
  
      calculateNodePositions(width, height) {
        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(width, height) * 0.35
  
        switch (this.networkTopology) {
          case "star":
            // Central node in the middle, others in a circle
            this.nodes[0].x = centerX
            this.nodes[0].y = centerY
  
            for (let i = 1; i < this.nodes.length; i++) {
              const angle = ((i - 1) / (this.nodes.length - 1)) * Math.PI * 2
              this.nodes[i].x = centerX + radius * Math.cos(angle)
              this.nodes[i].y = centerY + radius * Math.sin(angle)
            }
            break
  
          case "ring":
            // All nodes in a circle
            for (let i = 0; i < this.nodes.length; i++) {
              const angle = (i / this.nodes.length) * Math.PI * 2
              this.nodes[i].x = centerX + radius * Math.cos(angle)
              this.nodes[i].y = centerY + radius * Math.sin(angle)
            }
            break
  
          case "mesh":
            // Nodes in a circle for mesh topology
            for (let i = 0; i < this.nodes.length; i++) {
              const angle = (i / this.nodes.length) * Math.PI * 2
              this.nodes[i].x = centerX + radius * Math.cos(angle)
              this.nodes[i].y = centerY + radius * Math.sin(angle)
            }
            break
  
          case "linear":
          default:
            // Nodes in a horizontal line
            const spacing = width / (this.nodes.length + 1)
            for (let i = 0; i < this.nodes.length; i++) {
              this.nodes[i].x = spacing * (i + 1)
              this.nodes[i].y = centerY
            }
            break
        }
      }
  
      drawNodes(ctx) {
        this.nodes.forEach((node) => {
          // Draw node
          ctx.shadowBlur = 15
          ctx.shadowColor = node.glowColor
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
          ctx.fillStyle = node.color
          ctx.fill()
  
          ctx.shadowBlur = 0
          ctx.strokeStyle = this.lightenColor(node.color, 20)
          ctx.lineWidth = 3
          ctx.stroke()
  
          // Draw node name
          ctx.font = "bold 16px Arial"
          ctx.fillStyle = "white"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(node.name, node.x, node.y)
        })
      }
  
      drawConnections(ctx) {
        this.connections.forEach((conn) => {
          if (!conn.active) return
  
          const source = this.nodes[conn.source]
          const target = this.nodes[conn.target]
  
          const fidelity = conn.fidelity || 0
          const lineOpacity = Math.max(0.2, fidelity)
          const lineWidth = Math.max(1, fidelity * 10)
          const dashLength = this.purificationEnabled ? [5, 5] : [10, 10]
  
          // Calculate direction vector
          const dx = target.x - source.x
          const dy = target.y - source.y
          const distance = Math.sqrt(dx * dx + dy * dy)
  
          // Normalize direction vector
          const nx = dx / distance
          const ny = dy / distance
  
          // Calculate start and end points (adjusted for node radius)
          const startX = source.x + nx * source.radius
          const startY = source.y + ny * source.radius
          const endX = target.x - nx * target.radius
          const endY = target.y - ny * target.radius
  
          // Draw connection line
          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
  
          ctx.shadowBlur = 10
          ctx.shadowColor = `rgba(59, 130, 246, ${lineOpacity})`
          ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`
          ctx.lineWidth = lineWidth
  
          if (this.currentStep && this.currentStep.status === "sending") {
            ctx.setLineDash(dashLength)
            ctx.lineDashOffset = -performance.now() / 50
          } else {
            ctx.setLineDash([])
          }
  
          ctx.stroke()
          ctx.setLineDash([])
          ctx.shadowBlur = 0
  
          // Draw noise particles if in sending or measuring state
          if (this.currentStep && (this.currentStep.status === "sending" || this.currentStep.status === "measuring")) {
            this.drawNoiseParticlesOnConnection(ctx, source, target)
          }
  
          // Draw fidelity indicator
          if (fidelity > 0) {
            const midX = (startX + endX) / 2
            const midY = (startY + endY) / 2
            const indicatorWidth = 60
            const indicatorHeight = 6
            const indicatorX = midX - indicatorWidth / 2
            const indicatorY = midY + 15
  
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
            ctx.fillRect(indicatorX, indicatorY, indicatorWidth, indicatorHeight)
  
            const fillWidth = indicatorWidth * fidelity
            const color = fidelity > 0.8 ? "#10b981" : fidelity > 0.5 ? "#f59e0b" : "#ef4444"
  
            ctx.shadowBlur = 10
            ctx.shadowColor = color
            ctx.fillStyle = color
            ctx.fillRect(indicatorX, indicatorY, fillWidth, indicatorHeight)
            ctx.shadowBlur = 0
  
            ctx.font = "10px Arial"
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.fillText(`${(fidelity * 100).toFixed(0)}%`, midX, indicatorY + 15)
          }
        })
      }
  
      drawNoiseParticlesOnConnection(ctx, source, target) {
        const particleCount = Math.floor(this.noiseLevel * 30)
        const time = performance.now() / 1000
  
        const effectiveNoiseLevel = this.purificationEnabled ? this.noiseLevel * 0.6 : this.noiseLevel
  
        let particleColor, glowColor
        switch (this.errorModel) {
          case "amplitude":
            particleColor = "rgba(236, 72, 153, 1)"
            glowColor = "rgba(236, 72, 153, 0.7)"
            break
          case "phase":
            particleColor = "rgba(6, 182, 212, 1)"
            glowColor = "rgba(6, 182, 212, 0.7)"
            break
          default:
            particleColor = "rgba(255, 50, 50, 1)"
            glowColor = "rgba(255, 50, 50, 0.7)"
        }
  
        // Calculate direction vector
        const dx = target.x - source.x
        const dy = target.y - source.y
  
        for (let i = 0; i < particleCount; i++) {
          const t = (time + i * 0.1) % 1
          const x = source.x + dx * t
          const y = source.y + dy * t
  
          const noiseAmplitude = 15 * effectiveNoiseLevel
          const offsetY = Math.sin(t * Math.PI * 4 + i) * noiseAmplitude
          const offsetX = Math.cos(t * Math.PI * 4 + i + 1) * noiseAmplitude
  
          // Calculate perpendicular vector for noise displacement
          const perpX = -dy / Math.sqrt(dx * dx + dy * dy)
          const perpY = dx / Math.sqrt(dx * dx + dy * dy)
  
          const finalX = x + perpX * offsetX
          const finalY = y + perpY * offsetY
  
          const size = 2 + Math.random() * 3 * effectiveNoiseLevel
          const opacity = 0.3 + Math.random() * 0.7
  
          ctx.beginPath()
          ctx.arc(finalX, finalY, size, 0, Math.PI * 2)
  
          ctx.shadowBlur = 5
          ctx.shadowColor = this.purificationEnabled
            ? `rgba(${Number.parseInt(glowColor.slice(5, 8))}, ${Number.parseInt(glowColor.slice(9, 12))}, ${Number.parseInt(glowColor.slice(13, 16))}, 0.5)`
            : glowColor
  
          ctx.fillStyle = this.purificationEnabled
            ? `rgba(${Number.parseInt(particleColor.slice(5, 8))}, ${Number.parseInt(particleColor.slice(9, 12))}, ${Number.parseInt(particleColor.slice(13, 16))}, ${opacity * 0.7})`
            : `rgba(${Number.parseInt(particleColor.slice(5, 8))}, ${Number.parseInt(particleColor.slice(9, 12))}, ${Number.parseInt(particleColor.slice(13, 16))}, ${opacity})`
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }
  
      drawStatusMessage() {
        const statusElement = document.getElementById("status-message")
        if (!statusElement) return
  
        let statusMessage = ""
        if (this.currentStep) {
          switch (this.currentStep.status) {
            case "initializing":
              statusMessage = "Initializing qubits..."
              break
            case "sending":
              statusMessage = "Sending entangled qubits..."
              break
            case "measuring":
              statusMessage = "Measuring quantum states..."
              break
            case "success":
              statusMessage = "Entanglement successful!"
              break
            case "retry":
              statusMessage = "Low fidelity, retrying..."
              break
            case "purifying":
              statusMessage = "Purifying entanglement..."
              break
            default:
              statusMessage = ""
          }
        } else {
          statusMessage = "Adjust parameters and start the simulation"
        }
  
        statusElement.textContent = statusMessage
      }
  
      lightenColor(color, percent) {
        // Convert hex to RGB
        let r, g, b
        if (color.startsWith("#")) {
          r = Number.parseInt(color.slice(1, 3), 16)
          g = Number.parseInt(color.slice(3, 5), 16)
          b = Number.parseInt(color.slice(5, 7), 16)
        } else if (color.startsWith("rgb")) {
          const match = color.match(/rgba?$$(\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?$$/)
          if (match) {
            r = Number.parseInt(match[1])
            g = Number.parseInt(match[2])
            b = Number.parseInt(match[3])
          } else {
            return color
          }
        } else {
          return color
        }
  
        // Lighten
        r = Math.min(255, r + percent)
        g = Math.min(255, g + percent)
        b = Math.min(255, b + percent)
  
        return `rgb(${r}, ${g}, ${b})`
      }
  
      destroy() {
        if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame)
        }
        window.removeEventListener("resize", this.resizeCanvas)
      }
    }
  
    class QuantumCircuitVisualizer {
      constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext("2d")
        this.currentStep = null
        this.purificationEnabled = false
        this.entanglementType = "bell"
        this.errorModel = "depolarizing"
        this.viewMode = "standard"
  
        this.resizeCanvas()
        window.addEventListener("resize", () => this.resizeCanvas())
        this.initViewModeButtons()
      }
  
      initViewModeButtons() {
        const standardBtn = document.getElementById("circuit-view-standard")
        const detailedBtn = document.getElementById("circuit-view-detailed")
        const blochBtn = document.getElementById("circuit-view-bloch")
  
        if (standardBtn && detailedBtn && blochBtn) {
          standardBtn.addEventListener("click", () => {
            this.viewMode = "standard"
            standardBtn.classList.add("active")
            detailedBtn.classList.remove("active")
            blochBtn.classList.remove("active")
            this.draw()
          })
  
          detailedBtn.addEventListener("click", () => {
            this.viewMode = "detailed"
            standardBtn.classList.remove("active")
            detailedBtn.classList.add("active")
            blochBtn.classList.remove("active")
            this.draw()
          })
  
          blochBtn.addEventListener("click", () => {
            this.viewMode = "bloch"
            standardBtn.classList.remove("active")
            detailedBtn.classList.remove("active")
            blochBtn.classList.add("active")
            this.draw()
          })
        }
      }
  
      resizeCanvas() {
        const container = this.canvas.parentElement
        const devicePixelRatio = window.devicePixelRatio || 1
  
        this.canvas.style.width = container.clientWidth + "px"
        this.canvas.style.height = container.clientHeight + "px"
  
        this.canvas.width = container.clientWidth * devicePixelRatio
        this.canvas.height = 300 * devicePixelRatio
  
        this.ctx.scale(devicePixelRatio, devicePixelRatio)
        this.draw()
      }
  
      update(step, purificationEnabled, entanglementType = "bell", errorModel = "depolarizing") {
        this.currentStep = step
        this.purificationEnabled = purificationEnabled
        this.entanglementType = entanglementType || (step && step.entanglementType) || "bell"
        this.errorModel = errorModel || (step && step.errorModel) || "depolarizing"
        this.draw()
  
        const descriptionElement = document.getElementById("circuit-description")
        if (descriptionElement && step) {
          let description = ""
          switch (step.status) {
            case "initializing":
              description = this.getEntanglementDescription()
              break
            case "sending":
              description = "Sending one qubit of the entangled pair to Bob."
              break
            case "measuring":
              description = "Measuring quantum state to verify entanglement."
              break
            case "purifying":
              description = "Applying purification protocol to improve fidelity."
              break
            case "success":
              description = "Entanglement successfully established with high fidelity."
              break
            case "retry":
              description = "Fidelity too low, preparing to retry entanglement."
              break
            default:
              description = "Start the simulation to see the quantum circuit in action."
          }
          descriptionElement.textContent = description
        }
      }
  
      getEntanglementDescription() {
        switch (this.entanglementType) {
          case "ghz":
            return "Creating GHZ state (|000⟩ + |111⟩)/√2 with Hadamard and CNOT gates."
          case "w":
            return "Creating W state (|100⟩ + |010⟩ + |001⟩)/√3 with specialized quantum gates."
          default:
            return "Creating Bell pair (|00⟩ + |11⟩)/√2 with Hadamard and CNOT gates."
        }
      }
  
      draw() {
        const ctx = this.ctx
        const width = this.canvas.clientWidth
        const height = this.canvas.clientHeight
  
        ctx.clearRect(0, 0, width, height)
  
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, "#050714")
        gradient.addColorStop(1, "#0a0f24")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
  
        switch (this.viewMode) {
          case "detailed":
            this.drawDetailedCircuit(ctx, width, height)
            break
          case "bloch":
            this.drawBlochSphereView(ctx, width, height)
            break
          default:
            this.drawStandardCircuit(ctx, width, height)
        }
      }
  
      //more of the QuantumCircuitVisualizer class methods are here
      drawStandardCircuit(ctx, width, height) {
        const margin = 50;
        const gateSize = 40;
        const wireStart = margin;
        const wireEnd = width - margin;
        const wireLength = wireEnd - wireStart;
      
        const wireCount = this.getWireCount();
        const wirePositions = [];
      
        for (let i = 0; i < wireCount; i++) {
          wirePositions.push(height * (0.2 + 0.6 * (i / (wireCount - 1))));
        }
      
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(this.getCircuitTitle(), width / 2, 10);
      
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
      
        const aliceQubits = this.getAliceQubits();
        for (let i = 0; i < aliceQubits; i++) {
          ctx.fillStyle = `rgba(59, 130, 246, ${1 - i * 0.2})`;
          ctx.fillText(`|0⟩ Alice q${i + 1}`, wireStart - 10, wirePositions[i]);
        }
      
        const bobQubits = this.getBobQubits();
        for (let i = 0; i < bobQubits; i++) {
          ctx.fillStyle = `rgba(139, 92, 246, ${1 - i * 0.2})`;
          ctx.fillText(`|0⟩ Bob q${i + 1}`, wireStart - 10, wirePositions[aliceQubits + i]);
        }
      
        for (let i = 0; i < wirePositions.length; i++) {
          const wireGradient = ctx.createLinearGradient(wireStart, 0, wireEnd, 0);
      
          if (i < aliceQubits) {
            wireGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
            wireGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.5)');
            wireGradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)');
          } else {
            wireGradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
            wireGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.5)');
            wireGradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)');
          }
      
          ctx.beginPath();
          ctx.moveTo(wireStart, wirePositions[i]);
          ctx.lineTo(wireEnd, wirePositions[i]);
          ctx.strokeStyle = wireGradient;
          ctx.lineWidth = 2;
          ctx.stroke();
      
          ctx.beginPath();
          ctx.moveTo(wireStart, wirePositions[i]);
          ctx.lineTo(wireEnd, wirePositions[i]);
          ctx.strokeStyle = i < aliceQubits ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)';
          ctx.lineWidth = 6;
          ctx.stroke();
        }
      
        if (!this.currentStep) {
          this.drawBasicCircuit(ctx, wireStart, wirePositions, gateSize, wireLength);
          return;
        }
      
        const stepProgress = this.currentStep.progress || 0;
        const gatePosition = wireStart + wireLength * 0.2;
        const cnot1Position = wireStart + wireLength * 0.3;
        const sendPosition = wireStart + wireLength * 0.5;
        const measurePosition = wireStart + wireLength * 0.7;
        const purifyPosition = wireStart + wireLength * 0.6;
      
        if (stepProgress >= 0.1) {
          this.drawInitialGates(ctx, gatePosition, cnot1Position, wirePositions, gateSize);
        }
      
        if (stepProgress >= 0.3) {
          this.drawSendOperation(ctx, sendPosition, wirePositions, gateSize, stepProgress);
        }
      
        if (this.purificationEnabled && stepProgress >= 0.4 && this.currentStep.status !== 'success') {
          this.drawPurificationGates(ctx, purifyPosition, wirePositions, gateSize, stepProgress);
        }
      
        if (stepProgress >= 0.7) {
          for (let i = 0; i < wirePositions.length; i++) {
            this.drawMeasurementGate(ctx, measurePosition, wirePositions[i], gateSize);
          }
        }
      
        if (this.currentStep.status === 'sending' || this.currentStep.status === 'measuring') {
          const noiseLevel = 1 - (this.currentStep.fidelity || 0.5);
          this.drawNoiseEffects(ctx, sendPosition, measurePosition, wirePositions, noiseLevel);
        }
      
        let highlightX = wireStart;
        let highlightText = '';
      
        switch (this.currentStep.status) {
          case 'initializing':
            highlightX = gatePosition;
            highlightText = 'Creating Entanglement';
            break;
          case 'sending':
            highlightX = sendPosition;
            highlightText = 'Sending Qubit';
            break;
          case 'purifying':
            highlightX = purifyPosition;
            highlightText = 'Purifying';
            break;
          case 'measuring':
            highlightX = measurePosition;
            highlightText = 'Measuring';
            break;
          case 'success':
            highlightX = wireEnd - 100;
            highlightText = 'Success!';
            break;
          case 'retry':
            highlightX = wireEnd - 100;
            highlightText = 'Retrying...';
            break;
        }
      
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.3)';
        ctx.fillRect(highlightX - 50, 40, 100, height - 80);
        ctx.shadowBlur = 0;
      
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(highlightText, highlightX, 40);
      
        if (this.currentStep.fidelity) {
          ctx.font = '14px Arial';
          ctx.fillStyle = this.currentStep.fidelity > 0.8 ? '#10b981' : this.currentStep.fidelity > 0.5 ? '#f59e0b' : '#ef4444';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`Fidelity: ${(this.currentStep.fidelity * 100).toFixed(1)}%`, wireEnd, height - 10);
        }
      }
      
      drawDetailedCircuit(ctx, width, height) {
        const margin = 70;
        const gateSize = 35;
        const wireStart = margin;
        const wireEnd = width - margin;
        const wireLength = wireEnd - wireStart;
      
        const wireCount = this.getWireCount();
        const wirePositions = [];
      
        for (let i = 0; i < wireCount; i++) {
          wirePositions.push(height * (0.2 + 0.6 * (i / (wireCount - 1))));
        }
      
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`Detailed ${this.getCircuitTitle()}`, width / 2, 10);
      
        const timeSteps = ['t₀', 't₁', 't₂', 't₃', 't₄', 't₅'];
        const timePositions = [
          wireStart + wireLength * 0.1,
          wireStart + wireLength * 0.25,
          wireStart + wireLength * 0.4,
          wireStart + wireLength * 0.55,
          wireStart + wireLength * 0.7,
          wireStart + wireLength * 0.85
        ];
      
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
      
        for (let i = 0; i < timeSteps.length; i++) {
          ctx.fillText(timeSteps[i], timePositions[i], 35);
      
          ctx.beginPath();
          ctx.moveTo(timePositions[i], 40);
          ctx.lineTo(timePositions[i], height - 40);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
      
        const aliceQubits = this.getAliceQubits();
        for (let i = 0; i < aliceQubits; i++) {
          ctx.fillStyle = `rgba(59, 130, 246, ${1 - i * 0.2})`;
          ctx.fillText(`|0⟩ Alice q${i + 1}`, wireStart - 10, wirePositions[i]);
        }
      
        const bobQubits = this.getBobQubits();
        for (let i = 0; i < bobQubits; i++) {
          ctx.fillStyle = `rgba(139, 92, 246, ${1 - i * 0.2})`;
          ctx.fillText(`|0⟩ Bob q${i + 1}`, wireStart - 10, wirePositions[aliceQubits + i]);
        }
      
        for (let i = 0; i < wirePositions.length; i++) {
          const wireGradient = ctx.createLinearGradient(wireStart, 0, wireEnd, 0);
          if (i < aliceQubits) {
            wireGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
            wireGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.5)');
            wireGradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)');
          } else {
            wireGradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
            wireGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.5)');
            wireGradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)');
          }
      
          ctx.beginPath();
          ctx.moveTo(wireStart, wirePositions[i]);
          ctx.lineTo(wireEnd, wirePositions[i]);
          ctx.strokeStyle = wireGradient;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(wireStart, wirePositions[i]);
          ctx.lineTo(wireEnd, wirePositions[i]);
          ctx.strokeStyle = i < aliceQubits ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)';
          ctx.lineWidth = 6;
          ctx.stroke();
        }
      
        if (this.currentStep) {
          const stepProgress = this.currentStep.progress || 0;
          const currentTimeStep = Math.min(timeSteps.length - 1, Math.floor(stepProgress * timeSteps.length));
          for (let t = 0; t <= currentTimeStep; t++) {
            this.drawQuantumStates(ctx, timePositions[t], wirePositions, t, stepProgress);
          }
        } else {
          this.drawQuantumStates(ctx, timePositions[0], wirePositions, 0, 0);
        }
      
        ctx.font = '12px Arial';
        ctx.fillStyle = this.getErrorModelColor();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`Error Model: ${this.getErrorModelName()}`, margin, height - 10);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`Entanglement: ${this.getEntanglementTypeName()}`, width - margin, height - 10);
        this.drawDetailedLegend(ctx, width, height);
      }
      
      drawQuantumStates(ctx, x, wirePositions, timeStep, progress) {
        const aliceQubits = this.getAliceQubits();
        const states = this.getQuantumStates(timeStep, progress);
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
      
        for (let i = 0; i < wirePositions.length; i++) {
          if (states[i]) {
            const bubbleRadius = 15;
            ctx.shadowBlur = 10;
            ctx.shadowColor = i < aliceQubits ? 'rgba(59, 130, 246, 0.5)' : 'rgba(139, 92, 246, 0.5)';
            ctx.beginPath();
            ctx.arc(x, wirePositions[i], bubbleRadius, 0, Math.PI * 2);
            ctx.fillStyle = i < aliceQubits ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)';
            ctx.fill();
            ctx.strokeStyle = i < aliceQubits ? 'rgba(59, 130, 246, 0.8)' : 'rgba(139, 92, 246, 0.8)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'white';
            ctx.fillText(states[i], x, wirePositions[i]);
          }
        }
      }
      
      getQuantumStates(timeStep, progress) {
        const aliceQubits = this.getAliceQubits();
        const bobQubits = this.getBobQubits();
        const states = Array(aliceQubits + bobQubits).fill('');
      
        if (timeStep === 0) {
          for (let i = 0; i < states.length; i++) {
            states[i] = '|0⟩';
          }
          return states;
        }
      
        if (timeStep === 1) {
          states[0] = '|+⟩';
          for (let i = 1; i < states.length; i++) {
            states[i] = '|0⟩';
          }
          return states;
        }
      
        if (timeStep === 2) {
          if (this.entanglementType === 'bell') {
            states[0] = '|Φ⁺⟩';
            states[1] = '|Φ⁺⟩';
          } else if (this.entanglementType === 'ghz') {
            states[0] = '|GHZ⟩';
            states[1] = '|GHZ⟩';
            if (aliceQubits > 2) states[2] = '|GHZ⟩';
          } else {
            states[0] = '|W⟩';
            states[1] = '|W⟩';
            if (aliceQubits > 2) states[2] = '|W⟩';
          }
          return states;
        }
      
        if (timeStep === 3) {
          if (this.entanglementType === 'bell') {
            states[0] = '|Φ⁺⟩';
            states[aliceQubits] = '|Φ⁺⟩';
          } else if (this.entanglementType === 'ghz') {
            states[0] = '|GHZ⟩';
            states[1] = '|GHZ⟩';
            states[aliceQubits] = '|GHZ⟩';
          } else {
            states[0] = '|W⟩';
            states[1] = '|W⟩';
            states[aliceQubits] = '|W⟩';
          }
          return states;
        }
      
        if (timeStep === 4) {
          if (this.purificationEnabled) {
            const fidelity = this.currentStep?.fidelity || 0.7;
            const stateSymbol = fidelity > 0.8 ? '⁺' : '~';
            if (this.entanglementType === 'bell') {
              states[0] = `|Φ${stateSymbol}⟩`;
              states[aliceQubits] = `|Φ${stateSymbol}⟩`;
            } else if (this.entanglementType === 'ghz') {
              states[0] = `|GHZ${stateSymbol}⟩`;
              states[1] = `|GHZ${stateSymbol}⟩`;
              states[aliceQubits] = `|GHZ${stateSymbol}⟩`;
            } else {
              states[0] = `|W${stateSymbol}⟩`;
              states[1] = `|W${stateSymbol}⟩`;
              states[aliceQubits] = `|W${stateSymbol}⟩`;
            }
          } else {
            return this.getQuantumStates(3, progress);
          }
          return states;
        }
      
        if (timeStep === 5) {
          const fidelity = this.currentStep?.fidelity || 0.7;
          const success = fidelity > 0.8;
          if (success) {
            for (let i = 0; i < states.length; i++) {
              states[i] = Math.random() > 0.5 ? '|0⟩' : '|1⟩';
            }
          } else {
            for (let i = 0; i < states.length; i++) {
              states[i] = '|?⟩';
            }
          }
          return states;
        }
        return states;
      }
      
      drawBlochSphereView(ctx, width, height) {
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Bloch Sphere Representation', width / 2, 10);
        const sphereRadius = 80;
        const sphereSpacing = 200;
        const sphereY = height / 2;
        const maxSpheres = Math.floor((width - 100) / sphereSpacing);
        const sphereCount = Math.min(maxSpheres, 3);
        const startX = (width - (sphereCount - 1) * sphereSpacing) / 2;
        for (let i = 0; i < sphereCount; i++) {
          const sphereX = startX + i * sphereSpacing;
          this.drawBlochSphere(ctx, sphereX, sphereY, sphereRadius, i);
        }
        ctx.font = '14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const labels = ['Initial State', 'After Gates', 'Final State'];
        for (let i = 0; i < sphereCount; i++) {
          const labelX = startX + i * sphereSpacing;
          ctx.fillText(labels[i], labelX, sphereY + sphereRadius + 20);
        }
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('The Bloch sphere represents the quantum state of a single qubit.', width / 2, height - 30);
        ctx.fillText('Points on the surface represent pure states, while points inside represent mixed states.', width / 2, height - 10);
      }
      
      drawBlochSphere(ctx, x, y, radius, stateIndex) {
        const gradient = ctx.createRadialGradient(x - radius / 3, y - radius / 3, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.7)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.moveTo(x, y - radius);
        ctx.lineTo(x, y + radius);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Z', x, y - radius - 10);
        ctx.fillText('X', x + radius + 10, y);
        ctx.fillText('Y', x + 10, y + 10);
        let theta, phi, purity;
        if (this.currentStep) {
          const progress = this.currentStep.progress || 0;
          const fidelity = this.currentStep.fidelity || 0.7;
      
          switch (stateIndex) {
            case 0:
              theta = 0;
              phi = 0;
              purity = 1.0;
              break;
            case 1:
              if (progress < 0.3) {
                theta = Math.PI / 2;
                phi = 0;
                purity = 1.0;
              } else {
                theta = Math.PI / 2;
                phi = Math.PI / 4;
                purity = 0.8;
              }
              break;
            case 2:
              if (progress < 0.7) {
                theta = Math.PI / 2;
                phi = Math.PI / 4;
                purity = fidelity;
              } else {
                theta = Math.random() * Math.PI;
                phi = Math.random() * 2 * Math.PI;
                purity = fidelity > 0.8 ? 1.0 : 0.6;
              }
              break;
            default:
              theta = 0;
              phi = 0;
              purity = 1.0;
          }
        } else {
          switch (stateIndex) {
            case 0:
              theta = 0;
              phi = 0;
              purity = 1.0;
              break;
            case 1:
              theta = Math.PI / 2;
              phi = 0;
              purity = 1.0;
              break;
            case 2:
              theta = Math.PI / 2;
              phi = Math.PI / 4;
              purity = 0.7;
              break;
            default:
              theta = 0;
              phi = 0;
              purity = 1.0;
          }
        }
      
        const stateX = x + radius * purity * Math.sin(theta) * Math.cos(phi);
        const stateY = y + radius * purity * Math.cos(theta);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(stateX, stateY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      
        ctx.beginPath();
        ctx.arc(stateX, stateY, 5, 0, Math.PI * 2);
        ctx.fillStyle = purity > 0.8 ? '#10b981' : purity > 0.5 ? '#f59e0b' : '#ef4444';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
      
        let stateLabel;
        switch (stateIndex) {
          case 0:
            stateLabel = '|0⟩';
            break;
          case 1:
            stateLabel = this.currentStep && this.currentStep.progress >= 0.3 ? '|Φ⁺⟩' : '|+⟩';
            break;
          case 2:
            stateLabel = this.currentStep && this.currentStep.progress >= 0.7 ?
              (this.currentStep.fidelity > 0.8 ? '|0/1⟩' : '|?⟩') : '|Φ⁺⟩';
            break;
          default:
            stateLabel = '|ψ⟩';
        }
      
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stateLabel, stateX, stateY - 15);
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`Purity: ${(purity * 100).toFixed(0)}%`, x, y + radius + 5);
      }
      
      drawDetailedLegend(ctx, width, height) {
        const legendItems = [
          { symbol: '|0⟩', description: 'Ground state' },
          { symbol: '|1⟩', description: 'Excited state' },
          { symbol: '|+⟩', description: 'Superposition' },
          { symbol: '|Φ⁺⟩', description: 'Bell state' },
          { symbol: '|GHZ⟩', description: 'GHZ state' },
          { symbol: '|W⟩', description: 'W state' }
        ];
      
        const legendX = width / 2;
        const legendY = height - 40;
        const itemWidth = 100;
        const totalWidth = legendItems.length * itemWidth;
        const startX = legendX - totalWidth / 2;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
      
        for (let i = 0; i < legendItems.length; i++) {
          const x = startX + i * itemWidth + itemWidth / 2;
          ctx.fillStyle = 'white';
          ctx.fillText(legendItems[i].symbol, x, legendY - 8);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillText(legendItems[i].description, x, legendY + 8);
        }
      }
      
      getWireCount() {
        const aliceQubits = this.getAliceQubits();
        const bobQubits = this.getBobQubits();
        return aliceQubits + bobQubits;
      }
      
      getAliceQubits() {
        if (this.entanglementType === 'ghz') return 3;
        if (this.entanglementType === 'w') return 3;
        return 2;
      }
      
      getBobQubits() {
        if (this.purificationEnabled) return 2;
        return 1;
      }
      
      getCircuitTitle() {
        switch (this.entanglementType) {
          case 'ghz':
            return 'GHZ State Quantum Circuit';
          case 'w':
            return 'W State Quantum Circuit';
          default:
            return 'Bell State Quantum Circuit';
        }
      }
      
      getEntanglementTypeName() {
        switch (this.entanglementType) {
          case 'ghz':
            return 'GHZ State';
          case 'w':
            return 'W State';
          default:
            return 'Bell State';
        }
      }
      
      getErrorModelName() {
        switch (this.errorModel) {
          case 'amplitude':
            return 'Amplitude Damping';
          case 'phase':
            return 'Phase Damping';
          default:
            return 'Depolarizing';
        }
      }
      
      getErrorModelColor() {
        switch (this.errorModel) {
          case 'amplitude':
            return 'rgba(236, 72, 153, 0.8)';
          case 'phase':
            return 'rgba(6, 182, 212, 0.8)';
          default:
            return 'rgba(255, 50, 50, 0.8)';
        }
      }
      
      drawBasicCircuit(ctx, wireStart, wirePositions, gateSize, wireLength) {
        const gatePosition = wireStart + wireLength * 0.2;
        const cnot1Position = wireStart + wireLength * 0.3;
        const sendPosition = wireStart + wireLength * 0.5;
        const purifyPosition = wireStart + wireLength * 0.6;
        const measurePosition = wireStart + wireLength * 0.7;
        this.drawInitialGates(ctx, gatePosition, cnot1Position, wirePositions, gateSize, 0.3);
        const aliceQubits = this.getAliceQubits();
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(sendPosition, wirePositions[aliceQubits - 1]);
        ctx.lineTo(sendPosition, wirePositions[aliceQubits]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(sendPosition, wirePositions[aliceQubits] - 10);
        ctx.lineTo(sendPosition + 5, wirePositions[aliceQubits]);
        ctx.lineTo(sendPosition - 5, wirePositions[aliceQubits]);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      
        if (this.purificationEnabled) {
          this.drawPurificationGates(ctx, purifyPosition, wirePositions, gateSize, 0.3);
        }
      
        for (let i = 0; i < wirePositions.length; i++) {
          this.drawMeasurementGate(ctx, measurePosition, wirePositions[i], gateSize, 0.3);
        }
      
        const legendX = wireStart + wireLength * 0.1;
        const legendY = this.canvas.clientHeight - 40;
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText('H: Hadamard Gate', legendX, legendY);
        ctx.fillText('⊕: CNOT Gate', legendX + 150, legendY);
        ctx.fillText('◯: Measurement', legendX + 300, legendY);
        if (this.purificationEnabled) {
          ctx.fillText('P: Purification', legendX + 450, legendY);
        }
      }
      
      drawInitialGates(ctx, gatePosition, cnotPosition, wirePositions, gateSize, opacity = 1) {
        if (this.entanglementType === 'bell') {
          this.drawHGate(ctx, gatePosition, wirePositions[0], gateSize, opacity);
          this.drawCNOTGate(ctx, cnotPosition, wirePositions[0], wirePositions[1], gateSize, opacity);
        } else if (this.entanglementType === 'ghz') {
          this.drawHGate(ctx, gatePosition, wirePositions[0], gateSize, opacity);
          this.drawCNOTGate(ctx, cnotPosition, wirePositions[0], wirePositions[1], gateSize, opacity);
          this.drawCNOTGate(ctx, cnotPosition + gateSize, wirePositions[1], wirePositions[2], gateSize, opacity);
        } else {
          this.drawHGate(ctx, gatePosition, wirePositions[0], gateSize, opacity);
          this.drawSpecialGate(ctx, gatePosition, wirePositions[1], gateSize, "R", opacity);
          this.drawSpecialGate(ctx, gatePosition, wirePositions[2], gateSize, "R", opacity);
          this.drawCNOTGate(ctx, cnotPosition, wirePositions[0], wirePositions[1], gateSize, opacity);
          this.drawCNOTGate(ctx, cnotPosition + gateSize, wirePositions[1], wirePositions[2], gateSize, opacity);
        }
      }
      
      drawHGate(ctx, x, y, size, opacity = 1) {
        ctx.shadowBlur = 10 * opacity;
        ctx.shadowColor = `rgba(59, 130, 246, ${opacity * 0.7})`;
        ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
        ctx.shadowBlur = 0;
        ctx.font = `bold ${size * 0.6}px Arial`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('H', x, y);
      }
      
      drawCNOTGate(ctx, x, controlY, targetY, size, opacity = 1) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 5 * opacity;
        ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(x, controlY);
        ctx.lineTo(x, targetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, controlY, size / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, targetY, size / 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        const plusSize = size / 4;
        ctx.beginPath();
        ctx.moveTo(x - plusSize / 2, targetY);
        ctx.lineTo(x + plusSize / 2, targetY);
        ctx.moveTo(x, targetY - plusSize / 2);
        ctx.lineTo(x, targetY + plusSize / 2);
        ctx.stroke();
      }
      
      drawSpecialGate(ctx, x, y, size, label, opacity = 1) {
        ctx.shadowBlur = 10 * opacity;
        ctx.shadowColor = `rgba(236, 72, 153, ${opacity * 0.7})`;
        ctx.fillStyle = `rgba(236, 72, 153, ${opacity})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
        ctx.shadowBlur = 0;
        ctx.font = `bold ${size * 0.6}px Arial`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y);
      }
      
      drawSendOperation(ctx, x, wirePositions, size, progress = 1) {
        const aliceQubits = this.getAliceQubits();
        const fromY = wirePositions[aliceQubits - 1];
        const toY = wirePositions[aliceQubits];
        const animProgress = Math.min(1, Math.max(0, (progress - 0.3) * 5));
        const currentY = fromY + (toY - fromY) * animProgress;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x, fromY);
        ctx.lineTo(x, currentY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
        if (animProgress < 1) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(139, 92, 246, 0.7)';
          ctx.beginPath();
          ctx.arc(x, currentY, size / 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      
        if (animProgress >= 0.9) {
          ctx.beginPath();
          ctx.moveTo(x, toY - 10);
          ctx.lineTo(x + 5, toY);
          ctx.lineTo(x - 5, toY);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fill();
        }
      }
      
      drawPurificationGates(ctx, x, wirePositions, size, progress = 1, opacity = 1) {
        const purifyColor = 'rgba(16, 185, 129, ' + opacity + ')';
        ctx.shadowBlur = 10 * opacity;
        ctx.shadowColor = `rgba(16, 185, 129, ${opacity * 0.7})`;
        ctx.beginPath();
        ctx.moveTo(x, wirePositions[0]);
        ctx.lineTo(x, wirePositions[wirePositions.length - 1]);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      
        for (let i = 0; i < wirePositions.length; i++) {
          ctx.fillStyle = purifyColor;
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.fillRect(x - size / 2, wirePositions[i] - size / 2, size, size);
          ctx.strokeRect(x - size / 2, wirePositions[i] - size / 2, size, size);
          ctx.font = `bold ${size * 0.6}px Arial`;
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('P', x, wirePositions[i]);
        }
      
        ctx.shadowBlur = 0;
        if (progress > 0.4 && progress < 0.7) {
          const particleCount = 20;
          const time = progress * 10;
          for (let i = 0; i < particleCount; i++) {
            const t = (time + i * 0.1) % 1;
            const radius = size / 2 + t * size;
            const alpha = (1 - t) * 0.5;
            ctx.shadowBlur = 5;
            ctx.shadowColor = `rgba(16, 185, 129, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, (wirePositions[0] + wirePositions[wirePositions.length - 1]) / 2, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }
      
      drawMeasurementGate(ctx, x, y, size, opacity = 1) {
        ctx.shadowBlur = 5 * opacity;
        ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.5})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size / 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - size / 3 * Math.cos(Math.PI / 4), y - size / 3 * Math.sin(Math.PI / 4));
        ctx.lineTo(x + size / 3 * Math.cos(Math.PI / 4), y + size / 3 * Math.sin(Math.PI / 4));
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      drawNoiseEffects(ctx, startX, endX, wirePositions, noiseLevel) {
        const particleCount = Math.floor(noiseLevel * 50);
        const time = performance.now() / 1000;
        const effectiveNoiseLevel = this.purificationEnabled ? noiseLevel * 0.6 : noiseLevel;
      
        let particleColor, glowColor;
        switch (this.errorModel) {
          case 'amplitude':
            particleColor = 'rgba(236, 72, 153, 1)';
            glowColor = 'rgba(236, 72, 153, 0.7)';
            break;
          case 'phase':
            particleColor = 'rgba(6, 182, 212, 1)';
            glowColor = 'rgba(6, 182, 212, 0.7)';
            break;
          default:
            particleColor = 'rgba(255, 50, 50, 1)';
            glowColor = 'rgba(255, 50, 50, 0.7)';
        }
      
        for (let i = 0; i < particleCount; i++) {
          const t = (time + i * 0.1) % 1;
          const x = startX + (endX - startX) * t;
          const wireIndex = Math.floor(Math.random() * wirePositions.length);
          const baseY = wirePositions[wireIndex];
          const noiseAmplitude = 15 * effectiveNoiseLevel;
          const y = baseY + (Math.random() * 2 - 1) * noiseAmplitude;
          const size = 2 + Math.random() * 3 * effectiveNoiseLevel;
          const opacity = 0.3 + Math.random() * 0.7;
          ctx.shadowBlur = 3;
          ctx.shadowColor = this.purificationEnabled ?
            `rgba(${parseInt(glowColor.slice(5, 8))}, ${parseInt(glowColor.slice(9, 12))}, ${parseInt(glowColor.slice(13, 16))}, ${opacity * 0.5})` :
            glowColor;
      
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = this.purificationEnabled ?
            `rgba(${parseInt(particleColor.slice(5, 8))}, ${parseInt(particleColor.slice(9, 12))}, ${parseInt(particleColor.slice(13, 16))}, ${opacity * 0.7})` :
            `rgba(${parseInt(particleColor.slice(5, 8))}, ${parseInt(particleColor.slice(9, 12))}, ${parseInt(particleColor.slice(13, 16))}, ${opacity})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }      
  
      destroy() {
        window.removeEventListener("resize", this.resizeCanvas)
      }
    }
  
    class FidelityChartVisualizer {
      constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext("2d")
        this.simulationHistory = []
        this.currentStep = null
        this.fidelityHistory = []
        this.errorRateHistory = []
        this.chartType = "line"
        this.tooltip = document.getElementById("chart-tooltip")
        this.resizeCanvas()
        window.addEventListener("resize", () => this.resizeCanvas())
        this.initChartTypeButtons()
        this.initTooltip()
      }
  
      // Methods for FidelityChartVisualizer are go here
      initChartTypeButtons() {
        const lineBtn = document.getElementById('chart-view-line');
        const barBtn = document.getElementById('chart-view-bar');
        const areaBtn = document.getElementById('chart-view-area');

        if (lineBtn && barBtn && areaBtn) {
            lineBtn.addEventListener('click', () => {
                this.chartType = 'line';
                lineBtn.classList.add('active');
                barBtn.classList.remove('active');
                areaBtn.classList.remove('active');
                this.draw();
            });

            barBtn.addEventListener('click', () => {
                this.chartType = 'bar';
                lineBtn.classList.remove('active');
                barBtn.classList.add('active');
                areaBtn.classList.remove('active');
                this.draw();
            });

            areaBtn.addEventListener('click', () => {
                this.chartType = 'area';
                lineBtn.classList.remove('active');
                barBtn.classList.remove('active');
                areaBtn.classList.add('active');
                this.draw();
            });
        }
    }

    initTooltip() {
        if (this.tooltip) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                if (this.fidelityHistory.length > 0) {
                    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
                    const chartWidth = this.canvas.clientWidth - margin.left - margin.right;
                    const chartHeight = this.canvas.clientHeight - margin.top - margin.bottom;

                    if (x >= margin.left && x <= margin.left + chartWidth &&
                        y >= margin.top && y <= margin.top + chartHeight) {

                        const xScale = chartWidth / Math.max(this.fidelityHistory.length - 1, 1);
                        const dataIndex = Math.min(
                            this.fidelityHistory.length - 1,
                            Math.max(0, Math.round((x - margin.left) / xScale))
                        );

                        const tooltipTitle = this.tooltip.querySelector('.chart-tooltip-title');
                        const tooltipValue = this.tooltip.querySelector('.chart-tooltip-value');
                        if (tooltipTitle && tooltipValue) {
                            tooltipTitle.textContent = `Step ${dataIndex + 1}`;
                            tooltipValue.innerHTML = `
                                    <span>Fidelity:</span>
                                    <span>${(this.fidelityHistory[dataIndex] * 100).toFixed(1)}%</span>
                                `;
                        }

                        this.tooltip.style.left = `${e.clientX + 10}px`;
                        this.tooltip.style.top = `${e.clientY - 40}px`;
                        this.tooltip.classList.add('visible');
                        this.highlightDataPoint(dataIndex);
                    } else {
                        this.tooltip.classList.remove('visible');
                        this.draw();
                    }
                }
            });

            this.canvas.addEventListener('mouseleave', () => {
                this.tooltip.classList.remove('visible');
                this.draw();
            });
        }
    }

    highlightDataPoint(dataIndex) {
        this.draw();
        if (dataIndex >= 0 && dataIndex < this.fidelityHistory.length) {
            const ctx = this.ctx;
            const width = this.canvas.clientWidth;
            const height = this.canvas.clientHeight;
            const margin = { top: 30, right: 30, bottom: 50, left: 60 };
            const chartWidth = width - margin.left - margin.right;
            const chartHeight = height - margin.top - margin.bottom;
            const xScale = chartWidth / Math.max(this.fidelityHistory.length - 1, 1);
            const yMin = Math.min(0.4, Math.floor(Math.min(...this.fidelityHistory) * 10) / 10);
            const yMax = Math.max(1.0, Math.ceil(Math.max(...this.fidelityHistory) * 10) / 10);
            const yScale = chartHeight / (yMax - yMin);
            const x = margin.left + dataIndex * xScale;
            const y = margin.top + chartHeight - (this.fidelityHistory[dataIndex] - yMin) * yScale;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText((this.fidelityHistory[dataIndex] * 100).toFixed(1) + '%', x, y - 15);
        }
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const devicePixelRatio = window.devicePixelRatio || 1;
        this.canvas.style.width = container.clientWidth + 'px';
        this.canvas.style.height = container.clientHeight + 'px';
        this.canvas.width = container.clientWidth * devicePixelRatio;
        this.canvas.height = 300 * devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.draw();
    }

    update(history, currentStep, fidelityHistory = [], errorRateHistory = []) {
        this.simulationHistory = history;
        this.currentStep = currentStep;
        this.fidelityHistory = fidelityHistory.length > 0 ? fidelityHistory :
            history.filter(step => step.fidelity !== undefined).map(step => step.fidelity || 0);
        this.errorRateHistory = errorRateHistory.length > 0 ? errorRateHistory :
            history.filter(step => step.errorRate !== undefined).map(step => step.errorRate || 0);
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#050714');
        gradient.addColorStop(1, '#0a0f24');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        if (this.fidelityHistory.length === 0) {
            ctx.font = '14px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('No data available. Start the simulation to see results.', width / 2, height / 2);
            return;
        }

        const xScale = chartWidth / Math.max(this.fidelityHistory.length - 1, 1);
        const yMin = Math.min(0.4, Math.floor(Math.min(...this.fidelityHistory) * 10) / 10);
        const yMax = Math.max(1.0, Math.ceil(Math.max(...this.fidelityHistory) * 10) / 10);
        const yScale = chartHeight / (yMax - yMin);
        ctx.fillStyle = 'rgba(17, 24, 39, 0.7)';
        ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        const yTickCount = 6;
        const yTickStep = (yMax - yMin) / (yTickCount - 1);
        for (let i = 0; i < yTickCount; i++) {
            const y = margin.top + chartHeight - i * yScale * yTickStep;
            const yValue = yMin + i * yTickStep;
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(margin.left + chartWidth, y);
            ctx.stroke();
            ctx.font = '12px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(yValue.toFixed(1), margin.left - 10, y);
        }

        const xTickCount = Math.min(10, this.fidelityHistory.length);
        const xTickStep = Math.max(1, Math.floor(this.fidelityHistory.length / xTickCount));
        for (let i = 0; i < this.fidelityHistory.length; i += xTickStep) {
            const x = margin.left + i * xScale;
            ctx.beginPath();
            ctx.moveTo(x, margin.top);
            ctx.lineTo(x, margin.top + chartHeight);
            ctx.stroke();
            ctx.font = '12px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(i.toString(), x, margin.top + chartHeight + 10);
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + chartHeight);
        ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + chartHeight);
        ctx.stroke();
        ctx.font = '14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('Simulation Steps', margin.left + chartWidth / 2, height - 10);
        ctx.save();
        ctx.translate(15, margin.top + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textBaseline = 'middle';
        ctx.fillText('Fidelity', 0, 0);
        ctx.restore();

        const thresholdY = margin.top + chartHeight - (0.8 - yMin) * yScale;
        ctx.beginPath();
        ctx.moveTo(margin.left, thresholdY);
        ctx.lineTo(margin.left + chartWidth, thresholdY);
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);

        switch (this.chartType) {
            case 'bar':
                this.drawBarChart(ctx, margin, chartWidth, chartHeight, xScale, yScale, yMin);
                break;
            case 'area':
                this.drawAreaChart(ctx, margin, chartWidth, chartHeight, xScale, yScale, yMin);
                break;
            default:
                this.drawLineChart(ctx, margin, chartWidth, chartHeight, xScale, yScale, yMin);
        }

        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Quantum Entanglement Fidelity', width / 2, 10);
    }

    drawLineChart(ctx, margin, chartWidth, chartHeight, xScale, yScale, yMin) {
        ctx.beginPath();
        for (let i = 0; i < this.fidelityHistory.length; i++) {
            const x = margin.left + i * xScale;
            const y = margin.top + chartHeight - (this.fidelityHistory[i] - yMin) * yScale;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
        ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;

        for (let i = 0; i < this.fidelityHistory.length; i++) {
            const x = margin.left + i * xScale;
            const y = margin.top + chartHeight - (this.fidelityHistory[i] - yMin) * yScale;
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        if (this.errorRateHistory.length > 0) {
            ctx.beginPath();
            for (let i = 0; i < this.errorRateHistory.length; i++) {
                const x = margin.left + i * xScale;
                const y = margin.top + chartHeight - (this.errorRateHistory[i] - yMin) * yScale;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    drawBarChart(ctx, margin, chartWidth, chartHeight, xScale, yScale, yMin) {
        const barWidth = Math.max(1, xScale * 0.7);
        for (let i = 0; i < this.fidelityHistory.length; i++) {
            const x = margin.left + i * xScale - barWidth / 2;
            const y = margin.top + chartHeight - (this.fidelityHistory[i] - yMin) * yScale;
            const height = (this.fidelityHistory[i] - yMin) * yScale;
            const barGradient = ctx.createLinearGradient(0, margin.top + chartHeight - height, 0, margin.top + chartHeight);
            barGradient.addColorStop(0, 'rgba(59, 130, 246, 1)');
            barGradient.addColorStop(1, 'rgba(59, 130, 246, 0.5)');

            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
            ctx.fillStyle = barGradient;
            ctx.fillRect(x, y, barWidth, height);
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, barWidth, height);
        }

        if (this.errorRateHistory.length > 0) {
            for (let i = 0; i < this.errorRateHistory.length; i++) {
                const x = margin.left + i * xScale + barWidth / 2;
                const y = margin.top + chartHeight - (this.errorRateHistory[i] - yMin) * yScale;
                const height = (this.errorRateHistory[i] - yMin) * yScale;

                const barGradient = ctx.createLinearGradient(0, margin.top + chartHeight - height, 0, margin.top + chartHeight);
                barGradient.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
                barGradient.addColorStop(1, 'rgba(239, 68, 68, 0.3)');
                ctx.fillStyle = barGradient;
                ctx.fillRect(x, y, barWidth / 2, height);

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, barWidth / 2, height);
            }
        }
    }

    drawAreaChart(ctx, margin, chartWidth, chartHeight, xScale, yScale, yMin) {
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + chartHeight);
        ctx.lineTo(margin.left, margin.top + chartHeight - (this.fidelityHistory[0] - yMin) * yScale);
        for (let i = 0; i < this.fidelityHistory.length; i++) {
            const x = margin.left + i * xScale;
            const y = margin.top + chartHeight - (this.fidelityHistory[i] - yMin) * yScale;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(margin.left + (this.fidelityHistory.length - 1) * xScale, margin.top + chartHeight);
        ctx.closePath();

        const areaGradient = ctx.createLinearGradient(0, margin.top, 0, margin.top + chartHeight);
        areaGradient.addColorStop(0, 'rgba(59, 130, 246, 0.7)');
        areaGradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
        ctx.fillStyle = areaGradient;
        ctx.fill();
        ctx.beginPath();
        for (let i = 0; i < this.fidelityHistory.length; i++) {
            const x = margin.left + i * xScale;
            const y = margin.top + chartHeight - (this.fidelityHistory[i] - yMin) * yScale;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
        ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
        for (let i = 0; i < this.fidelityHistory.length; i++) {
            const x = margin.left + i * xScale;
            const y = margin.top + chartHeight - (this.fidelityHistory[i] - yMin) * yScale;
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
  
      destroy() {
        window.removeEventListener("resize", this.resizeCanvas)
      }
    }
  
    class ResultsVisualizer {
      constructor(containerId) {
        this.container = document.getElementById(containerId)
        this.results = null
      }
  
      update(results) {
        this.results = results
        this.render()
      }
  
      formatTopologyName(topology) {
        switch (topology) {
          case "linear":
            return "Linear Chain"
          case "star":
            return "Star Network"
          case "ring":
            return "Ring Network"
          case "mesh":
            return "Fully Connected Mesh"
          default:
            return topology.charAt(0).toUpperCase() + topology.slice(1)
        }
      }
  
      render() {
        if (!this.container) return
  
        this.container.innerHTML = ""
        if (!this.results) {
          this.container.innerHTML = `
                      <div class="no-results">
                          <div class="icon warning-icon"></div>
                          <h3>No Results Available</h3>
                          <p>Run the simulation to see detailed results and statistics.</p>
                      </div>
                  `
          return
        }
  
        const resultsContent = document.createElement("div")
        const statusIcon = this.results.success ? "success-icon" : "error-icon"
        const statusTitle = this.results.success ? "Entanglement Successful" : "Entanglement Failed"
        const statusDescription = this.results.success
          ? "Quantum entanglement was successfully established with high fidelity."
          : "Quantum entanglement could not be established with sufficient fidelity."
  
        resultsContent.innerHTML = `
                  <div class="flex-center">
                      <div class="icon ${statusIcon}"></div>
                      <h3>${statusTitle}</h3>
                      <p class="text-secondary">${statusDescription}</p>
                  </div>
              `
  
        const resultsGrid = document.createElement("div")
        resultsGrid.className = "results-grid"
  
        const fidelityCard = document.createElement("div")
        fidelityCard.className = "result-card animate-fade-in stagger-1"
  
        const fidelityValue = (this.results.fidelity * 100).toFixed(1)
        const fidelityBadge = this.results.success
          ? `<span class="badge badge-success">High</span>`
          : this.results.fidelity >= 0.6
            ? `<span class="badge badge-warning">Medium</span>`
            : `<span class="badge badge-error">Low</span>`
  
        fidelityCard.innerHTML = `
                  <h4>Quantum Fidelity</h4>
                  <div class="result-item">
                      <span class="result-label">Final Fidelity:</span>
                      <span class="result-value">${fidelityValue}%</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Quality:</span>
                      <span class="result-value">${fidelityBadge}</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Error Rate:</span>
                      <span class="result-value">${(this.results.errorRate * 100).toFixed(1)}%</span>
                  </div>
              `
  
        const performanceCard = document.createElement("div")
        performanceCard.className = "result-card animate-fade-in stagger-2"
  
        performanceCard.innerHTML = `
                  <h4>Performance Metrics</h4>
                  <div class="result-item">
                      <span class="result-label">Attempts:</span>
                      <span class="result-value">${this.results.attempts}</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Latency:</span>
                      <span class="result-value">${this.results.latency.toFixed(2)} units</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Purification:</span>
                      <span class="result-value">${this.results.purificationEnabled ? "Enabled" : "Disabled"}</span>
                  </div>
              `
  
        const configCard = document.createElement("div")
        configCard.className = "result-card animate-fade-in stagger-3"
  
        let entanglementTypeName = "Bell State"
        if (this.results.entanglementType === "ghz") entanglementTypeName = "GHZ State"
        if (this.results.entanglementType === "w") entanglementTypeName = "W State"
  
        let errorModelName = "Depolarizing"
        if (this.results.errorModel === "amplitude") errorModelName = "Amplitude Damping"
        if (this.results.errorModel === "phase") errorModelName = "Phase Damping"
  
        configCard.innerHTML = `
                  <h4>Configuration</h4>
                  <div class="result-item">
                      <span class="result-label">Entanglement Type:</span>
                      <span class="result-value">${entanglementTypeName}</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Error Model:</span>
                      <span class="result-value">${errorModelName}</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Noise Level:</span>
                      <span class="result-value">${(this.results.noiseLevel * 100).toFixed(0)}%</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Node Count:</span>
                      <span class="result-value">${this.results.nodeCount || 2}</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Network Topology:</span>
                      <span class="result-value">${this.formatTopologyName(this.results.networkTopology || "linear")}</span>
                  </div>
              `
  
        const efficiencyCard = document.createElement("div")
        efficiencyCard.className = "result-card animate-fade-in stagger-4"
        const successRate = this.results.success ? (1 / this.results.attempts) * 100 : 0
        const purificationGain = this.results.purificationEnabled
          ? (this.results.fidelity / (1 - this.results.noiseLevel) - 1) * 100
          : 0
  
        efficiencyCard.innerHTML = `
                  <h4>Efficiency Analysis</h4>
                  <div class="result-item">
                      <span class="result-label">Success Rate:</span>
                      <span class="result-value">${successRate.toFixed(1)}%</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Purification Gain:</span>
                      <span class="result-value">${purificationGain.toFixed(1)}%</span>
                  </div>
                  <div class="result-item">
                      <span class="result-label">Fidelity/Noise Ratio:</span>
                      <span class="result-value">${(this.results.fidelity / this.results.noiseLevel).toFixed(2)}</span>
                  </div>
              `
  
        const analysisCard = document.createElement("div")
        analysisCard.className = "result-card analysis-card animate-fade-in"
        let analysisText = ""
        const observations = []
  
        // Add network topology observations
        if (this.results.nodeCount > 2) {
          observations.push(
            `The network consisted of ${this.results.nodeCount} nodes in a ${this.formatTopologyName(this.results.networkTopology)} configuration.`,
          )
  
          if (this.results.networkTopology === "mesh" && this.results.nodeCount > 4) {
            observations.push(
              "Fully connected mesh networks with many nodes are challenging to maintain high fidelity across all connections.",
            )
          }
  
          if (this.results.networkTopology === "star" && this.results.success) {
            observations.push("Star topology performed well, as the central node efficiently distributes entanglement.")
          }
  
          if (this.results.networkTopology === "ring" && !this.results.purificationEnabled && !this.results.success) {
            observations.push(
              "Ring topologies benefit significantly from purification to maintain fidelity across the network.",
            )
          }
        }
  
        if (this.results.success) {
          analysisText =
            "The quantum entanglement was successfully established with high fidelity, allowing for reliable quantum communication."
  
          if (this.results.purificationEnabled) {
            observations.push("Purification significantly improved the fidelity, mitigating the effects of noise.")
          }
          if (this.results.attempts > 1) {
            observations.push(
              `It took ${this.results.attempts} attempts to achieve success, indicating potential for optimization.`,
            )
          }
        } else {
          analysisText = "The quantum entanglement failed due to insufficient fidelity."
          if (this.results.noiseLevel > 0.3) {
            observations.push("High noise levels significantly impacted the entanglement process.")
          }
          if (!this.results.purificationEnabled) {
            observations.push("Enabling purification might improve fidelity in future runs.")
          }
        }
  
        if (this.results.latency > 1) {
          observations.push("The latency is relatively high, suggesting possible bottlenecks in the system.")
        }
  
        analysisCard.innerHTML = `
                  <h4>Analysis</h4>
                  <p>${analysisText}</p>
                  ${observations.length ? '<h5>Observations:</h5><ul class="observations-list">' + observations.map((obs) => `<li>${obs}</li>`).join("") + "</ul>" : ""}
              `
  
        resultsGrid.appendChild(fidelityCard)
        resultsGrid.appendChild(performanceCard)
        resultsGrid.appendChild(configCard)
        resultsGrid.appendChild(efficiencyCard)
        resultsGrid.appendChild(analysisCard)
        this.container.appendChild(resultsContent)
        this.container.appendChild(resultsGrid)
      }
    }
  
    // Initialize the application
    const simulation = new QuantumSimulation()
    const networkVisualizer = new QuantumNetworkVisualizer("quantum-network")
    const circuitVisualizer = new QuantumCircuitVisualizer("quantum-circuit")
    const fidelityChartVisualizer = new FidelityChartVisualizer("fidelity-chart")
    const resultsVisualizer = new ResultsVisualizer("results-container")
  
    // UI Elements
    const noiseSlider = document.getElementById("noise-level")
    const noiseValue = document.getElementById("noise-value")
    const purificationToggle = document.getElementById("purification")
    const speedSlider = document.getElementById("simulation-speed")
    const speedValue = document.getElementById("speed-value")
    const startBtn = document.getElementById("start-btn")
    const pauseBtn = document.getElementById("pause-btn")
    const resetBtn = document.getElementById("reset-btn")
    const entanglementTypeSelect = document.getElementById("entanglement-type")
    const errorModelSelect = document.getElementById("error-model")
    const nodeCountSelect = document.getElementById("node-count")
    const networkTopologySelect = document.getElementById("network-topology")
    const exportBtn = document.getElementById("export-btn")
    const settingsBtn = document.getElementById("settings-btn")
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabPanes = document.querySelectorAll(".tab-pane")
  
    // Initialize UI
    if (noiseSlider && noiseValue) {
      noiseSlider.addEventListener("input", () => {
        noiseValue.textContent = Number.parseFloat(noiseSlider.value).toFixed(2)
        networkVisualizer.update(
          null,
          Number.parseFloat(noiseSlider.value),
          purificationToggle.checked,
          entanglementTypeSelect.value,
          errorModelSelect.value,
        )
      })
    }
  
    if (purificationToggle) {
      purificationToggle.addEventListener("change", () => {
        networkVisualizer.update(
          null,
          Number.parseFloat(noiseSlider.value),
          purificationToggle.checked,
          entanglementTypeSelect.value,
          errorModelSelect.value,
        )
        circuitVisualizer.update(null, purificationToggle.checked, entanglementTypeSelect.value, errorModelSelect.value)
      })
    }
  
    if (speedSlider && speedValue) {
      speedSlider.addEventListener("input", () => {
        speedValue.textContent = Number.parseFloat(speedSlider.value).toFixed(1)
      })
    }
  
    if (entanglementTypeSelect) {
      entanglementTypeSelect.addEventListener("change", () => {
        networkVisualizer.update(
          null,
          Number.parseFloat(noiseSlider.value),
          purificationToggle.checked,
          entanglementTypeSelect.value,
          errorModelSelect.value,
        )
        circuitVisualizer.update(null, purificationToggle.checked, entanglementTypeSelect.value, errorModelSelect.value)
      })
    }
  
    if (errorModelSelect) {
      errorModelSelect.addEventListener("change", () => {
        networkVisualizer.update(
          null,
          Number.parseFloat(noiseSlider.value),
          purificationToggle.checked,
          entanglementTypeSelect.value,
          errorModelSelect.value,
        )
        circuitVisualizer.update(null, purificationToggle.checked, entanglementTypeSelect.value, errorModelSelect.value)
      })
    }
  
    // Node configuration controls
    if (nodeCountSelect) {
      nodeCountSelect.addEventListener("change", () => {
        const nodeCount = Number.parseInt(nodeCountSelect.value)
        simulation.setNodeCount(nodeCount)
        networkVisualizer.setNodeCount(nodeCount)
        networkVisualizer.update(
          null,
          Number.parseFloat(noiseSlider.value),
          purificationToggle.checked,
          entanglementTypeSelect.value,
          errorModelSelect.value,
        )
      })
    }
  
    if (networkTopologySelect) {
      networkTopologySelect.addEventListener("change", () => {
        const topology = networkTopologySelect.value
        simulation.setNetworkTopology(topology)
        networkVisualizer.setNetworkTopology(topology)
        networkVisualizer.update(
          null,
          Number.parseFloat(noiseSlider.value),
          purificationToggle.checked,
          entanglementTypeSelect.value,
          errorModelSelect.value,
        )
      })
    }
  
    // Tab functionality
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.getAttribute("data-tab")
  
        // Update active tab button
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")
  
        // Update active tab pane
        tabPanes.forEach((pane) => {
          if (pane.id === tabId) {
            pane.classList.add("active")
          } else {
            pane.classList.remove("active")
          }
        })
      })
    })
  
    // Simulation controls
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        if (simulation.isRunning) return
  
        const noiseLevel = Number.parseFloat(noiseSlider.value)
        const purificationEnabled = purificationToggle.checked
        const speed = Number.parseFloat(speedSlider.value)
        const entanglementType = entanglementTypeSelect.value
        const errorModel = errorModelSelect.value
  
        startBtn.disabled = true
        pauseBtn.disabled = false
        resetBtn.disabled = false
  
        simulation.startSimulation(
          noiseLevel,
          purificationEnabled,
          speed,
          entanglementType,
          errorModel,
          (step, index, steps) => {
            // Step callback
            networkVisualizer.update(step, noiseLevel, purificationEnabled, entanglementType, errorModel)
            circuitVisualizer.update(step, purificationEnabled, entanglementType, errorModel)
            fidelityChartVisualizer.update(steps, step, simulation.getFidelityHistory(), simulation.getErrorRateHistory())
          },
          (results) => {
            // Complete callback
            startBtn.disabled = false
            pauseBtn.disabled = true
            resetBtn.disabled = false
            noiseSlider.disabled = false
            purificationToggle.disabled = false
            if (entanglementTypeSelect) entanglementTypeSelect.disabled = false
            if (errorModelSelect) errorModelSelect.disabled = false
            if (nodeCountSelect) nodeCountSelect.disabled = false
            if (networkTopologySelect) networkTopologySelect.disabled = false
  
            resultsVisualizer.update(results)
            networkVisualizer.update(null, noiseLevel, purificationEnabled, entanglementType, errorModel)
            circuitVisualizer.update(null, purificationEnabled, entanglementType, errorModel)
            fidelityChartVisualizer.update(
              simulation.getSimulationHistory(),
              null,
              simulation.getFidelityHistory(),
              simulation.getErrorRateHistory(),
            )
          },
        )
  
        // Disable controls during simulation
        noiseSlider.disabled = true
        purificationToggle.disabled = true
        if (entanglementTypeSelect) entanglementTypeSelect.disabled = true
        if (errorModelSelect) errorModelSelect.disabled = true
        if (nodeCountSelect) nodeCountSelect.disabled = true
        if (networkTopologySelect) networkTopologySelect.disabled = true
      })
    }
  
    // Pause simulation
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        const speed = Number.parseFloat(speedSlider.value)
  
        simulation.togglePause(
          speed,
          (step, index, steps) => {
            // Step callback
            networkVisualizer.update(
              step,
              Number.parseFloat(noiseSlider.value),
              purificationToggle.checked,
              entanglementTypeSelect.value,
              errorModelSelect.value,
            )
            circuitVisualizer.update(
              step,
              purificationToggle.checked,
              entanglementTypeSelect.value,
              errorModelSelect.value,
            )
            fidelityChartVisualizer.update(steps, step, simulation.getFidelityHistory(), simulation.getErrorRateHistory())
          },
          (results) => {
            // Complete callback
            startBtn.disabled = false
            pauseBtn.disabled = true
            resetBtn.disabled = false
            noiseSlider.disabled = false
            purificationToggle.disabled = false
            if (entanglementTypeSelect) entanglementTypeSelect.disabled = false
            if (errorModelSelect) errorModelSelect.disabled = false
            if (nodeCountSelect) nodeCountSelect.disabled = false
            if (networkTopologySelect) networkTopologySelect.disabled = false
  
            resultsVisualizer.update(results)
            networkVisualizer.update(
              null,
              Number.parseFloat(noiseSlider.value),
              purificationToggle.checked,
              entanglementTypeSelect.value,
              errorModelSelect.value,
            )
            circuitVisualizer.update(
              null,
              purificationToggle.checked,
              entanglementTypeSelect.value,
              errorModelSelect.value,
            )
            fidelityChartVisualizer.update(
              simulation.getSimulationHistory(),
              null,
              simulation.getFidelityHistory(),
              simulation.getErrorRateHistory(),
            )
          },
        )
  
        pausesBtn.textContent = simulation.isPaused ? "Resume" : "Pause"
      })
    }
  
    // Reset simulation
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        simulation.reset()
  
        startBtn.disabled = false
        pauseBtn.disabled = true
        resetBtn.disabled = true
        noiseSlider.disabled = false
        purificationToggle.disabled = false
        if (entanglementTypeSelect) entanglementTypeSelect.disabled = false
        if (errorModelSelect) errorModelSelect.disabled = false
        if (nodeCountSelect) nodeCountSelect.disabled = false
        if (networkTopologySelect) networkTopologySelect.disabled = false
  
        networkVisualizer.update(
          null,
          Number.parseFloat(noiseSlider.value),
          purificationToggle.checked,
          entanglementTypeSelect.value,
          errorModelSelect.value,
        )
        circuitVisualizer.update(null, purificationToggle.checked, entanglementTypeSelect.value, errorModelSelect.value)
        fidelityChartVisualizer.update([], null, [], [])
        resultsVisualizer.update(null)
      })
    }
  
    // Export data functionality
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        if (!simulation.getResults()) {
          alert("No simulation results to export. Run a simulation first.")
          return
        }
  
        const results = simulation.getResults()
        const fidelityHistory = simulation.getFidelityHistory()
        const errorRateHistory = simulation.getErrorRateHistory()
  
        const exportData = {
          results: results,
          fidelityHistory: fidelityHistory,
          errorRateHistory: errorRateHistory,
          timestamp: new Date().toISOString(),
        }
  
        const dataStr = JSON.stringify(exportData, null, 2)
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
  
        const exportFileName = `quantum-simulation-${new Date().toISOString().slice(0, 10)}.json`
  
        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportFileName)
        linkElement.click()
      })
    }
  
    // Settings button functionality
    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        // This could open a modal with additional settings
        alert("Advanced settings panel will be implemented in a future update.")
      })
    }
  
    // Initialize visualizations with default values
    networkVisualizer.update(
      null,
      Number.parseFloat(noiseSlider.value),
      purificationToggle.checked,
      entanglementTypeSelect.value,
      errorModelSelect.value,
    )
    circuitVisualizer.update(null, purificationToggle.checked, entanglementTypeSelect.value, errorModelSelect.value)
  
    // Clean up event listeners on page unload
    window.addEventListener("beforeunload", () => {
      networkVisualizer.destroy()
      circuitVisualizer.destroy()
      fidelityChartVisualizer.destroy()
    })
  })
  