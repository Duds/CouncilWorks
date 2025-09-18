/**
 * Signal Processing & Analysis Engine
 *
 * This module implements advanced signal processing and analysis capabilities
 * including signal classification, risk assessment, pattern recognition,
 * predictive analysis, and intelligent response recommendations.
 *
 * @file lib/signal-processing-engine.ts
 * @version 1.0.0
 * @since PI3 - Resilience Implementation
 */

import {
  Signal,
  SignalType,
  SignalSeverity,
  SignalProcessingResult,
  ResponseAction,
  ResponseActionType,
  SignalIntelligenceConfig,
  SignalIntelligenceResult
} from './resilience-types';

/**
 * Signal Processing Engine Class
 *
 * Provides comprehensive signal analysis with:
 * - Multi-dimensional signal classification
 * - Risk assessment and scoring
 * - Pattern recognition and correlation
 * - Predictive analytics and forecasting
 * - Intelligent response recommendations
 */
export class SignalProcessingEngine {
  private config: SignalIntelligenceConfig;
  private isInitialized: boolean = false;
  private processingHistory: SignalProcessingResult[] = [];
  private patternDatabase: Map<string, any[]> = new Map();
  private riskModels: Map<string, any> = new Map();
  private predictionModels: Map<string, any> = new Map();
  private correlationCache: Map<string, number> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: SignalIntelligenceConfig) {
    this.config = config;
    this.initializeEventListeners();
    this.initializeModels();
  }

  /**
   * Initialize the signal processing engine
   */
  public async initialize(): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('🧠 Initializing Signal Processing Engine...');

      // Validate configuration
      this.validateConfig();

      // Initialize pattern recognition models
      await this.initializePatternRecognition();

      // Initialize risk assessment models
      await this.initializeRiskModels();

      // Initialize predictive analytics models
      await this.initializePredictionModels();

      // Initialize correlation analysis
      this.initializeCorrelationAnalysis();

      this.isInitialized = true;
      console.log('✅ Signal Processing Engine initialized successfully');
      this.emitEvent('initialized', { config: this.config });

      return {
        success: true,
        data: {
          features: this.config.features,
          models: {
            patternRecognition: this.config.features.patternRecognition,
            anomalyDetection: this.config.features.anomalyDetection,
            predictiveAnalytics: this.config.features.predictiveAnalytics,
            correlationAnalysis: this.config.features.correlationAnalysis,
            trendAnalysis: this.config.features.trendAnalysis
          }
        }
      };
    } catch (error: any) {
      console.error('❌ Failed to initialize Signal Processing Engine:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process and analyze signals
   */
  public async processSignals(signals: Signal[]): Promise<SignalProcessingResult[]> {
    if (!this.isInitialized) {
      throw new Error('Signal Processing Engine not initialized');
    }

    const results: SignalProcessingResult[] = [];
    const startTime = Date.now();

    try {
      console.log(`🧠 Processing ${signals.length} signals for analysis...`);

      for (const signal of signals) {
        try {
          const result = await this.processSignal(signal);
          results.push(result);
        } catch (error: any) {
          console.error(`❌ Failed to process signal ${signal.id}:`, error);
          // Create error result
          const errorResult: SignalProcessingResult = {
            id: `error-${signal.id}-${Date.now()}`,
            signal,
            timestamp: new Date(),
            processingTime: 0,
            analysis: {
              classification: {
                primaryType: signal.type,
                secondaryTypes: [],
                confidence: 0
              },
              riskAssessment: {
                riskLevel: 'LOW',
                riskScore: 0,
                riskFactors: ['Processing error']
              },
              patternRecognition: {
                patterns: [],
                patternConfidence: 0,
                historicalCorrelation: 0
              },
              predictiveAnalysis: {
                predictedOutcomes: [],
                probabilities: [],
                timeHorizons: []
              }
            },
            recommendedActions: [],
            metadata: {
              engine: 'SignalProcessingEngine',
              version: '1.0.0',
              data: { error: error.message }
            }
          };
          results.push(errorResult);
        }
      }

      const totalTime = Date.now() - startTime;
      console.log(`✅ Processed ${results.length} signals in ${totalTime}ms`);

      // Store results in history
      this.processingHistory.push(...results);

      // Emit processing completed event
      this.emitEvent('processingCompleted', { 
        results, 
        processingTime: totalTime,
        successRate: results.filter(r => r.analysis.classification.confidence > 0).length / results.length
      });

      return results;
    } catch (error: any) {
      console.error('❌ Signal processing failed:', error);
      throw error;
    }
  }

  /**
   * Process a single signal
   */
  private async processSignal(signal: Signal): Promise<SignalProcessingResult> {
    const startTime = Date.now();

    try {
      // Perform signal classification
      const classification = await this.classifySignal(signal);

      // Perform risk assessment
      const riskAssessment = await this.assessRisk(signal);

      // Perform pattern recognition
      const patternRecognition = await this.recognizePatterns(signal);

      // Perform predictive analysis
      const predictiveAnalysis = await this.performPredictiveAnalysis(signal);

      // Generate recommended actions
      const recommendedActions = await this.generateRecommendedActions(signal, {
        classification,
        riskAssessment,
        patternRecognition,
        predictiveAnalysis
      });

      const processingTime = Date.now() - startTime;

      const result: SignalProcessingResult = {
        id: `processing-${signal.id}-${Date.now()}`,
        signal,
        timestamp: new Date(),
        processingTime,
        analysis: {
          classification,
          riskAssessment,
          patternRecognition,
          predictiveAnalysis
        },
        recommendedActions,
        metadata: {
          engine: 'SignalProcessingEngine',
          version: '1.0.0',
          data: {
            processingFeatures: Object.keys(this.config.features).filter(
              key => this.config.features[key as keyof typeof this.config.features]
            )
          }
        }
      };

      return result;
    } catch (error: any) {
      console.error(`❌ Failed to process signal ${signal.id}:`, error);
      throw error;
    }
  }

  /**
   * Classify signal type and characteristics
   */
  private async classifySignal(signal: Signal): Promise<{
    primaryType: SignalType;
    secondaryTypes: SignalType[];
    confidence: number;
  }> {
    try {
      // Primary classification based on signal type
      const primaryType = signal.type;

      // Secondary classification based on signal properties
      const secondaryTypes: SignalType[] = [];
      let confidence = 0.8; // Base confidence

      // Analyze signal properties for secondary classification
      if (signal.severity === SignalSeverity.CRITICAL) {
        secondaryTypes.push(SignalType.EMERGENCY);
        confidence += 0.1;
      }

      if (signal.strength > 80) {
        secondaryTypes.push(SignalType.PERFORMANCE_DEGRADATION);
        confidence += 0.05;
      }

      if (signal.metadata?.source === 'ENVIRONMENTAL') {
        secondaryTypes.push(SignalType.ENVIRONMENTAL);
        confidence += 0.05;
      }

      // Use machine learning models if available
      if (this.predictionModels.has('classification')) {
        const model = this.predictionModels.get('classification');
        const mlConfidence = await this.runClassificationModel(model, signal);
        confidence = (confidence + mlConfidence) / 2;
      }

      return {
        primaryType,
        secondaryTypes: [...new Set(secondaryTypes)], // Remove duplicates
        confidence: Math.min(1, confidence)
      };
    } catch (error: any) {
      console.error('❌ Signal classification failed:', error);
      return {
        primaryType: signal.type,
        secondaryTypes: [],
        confidence: 0.5
      };
    }
  }

  /**
   * Assess risk level and factors
   */
  private async assessRisk(signal: Signal): Promise<{
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    riskScore: number;
    riskFactors: string[];
  }> {
    try {
      let riskScore = 0;
      const riskFactors: string[] = [];

      // Base risk score from severity
      switch (signal.severity) {
        case SignalSeverity.LOW:
          riskScore += 20;
          break;
        case SignalSeverity.MEDIUM:
          riskScore += 40;
          break;
        case SignalSeverity.HIGH:
          riskScore += 70;
          break;
        case SignalSeverity.CRITICAL:
          riskScore += 90;
          break;
      }

      // Additional risk factors
      if (signal.strength > 80) {
        riskScore += 10;
        riskFactors.push('High signal strength');
      }

      if (signal.type === SignalType.EMERGENCY) {
        riskScore += 15;
        riskFactors.push('Emergency signal type');
      }

      if (signal.type === SignalType.ASSET_CONDITION && signal.severity === SignalSeverity.HIGH) {
        riskScore += 20;
        riskFactors.push('Asset condition deterioration');
      }

      // Historical correlation risk
      const historicalRisk = await this.calculateHistoricalRisk(signal);
      riskScore += historicalRisk.score;
      riskFactors.push(...historicalRisk.factors);

      // Use risk models if available
      if (this.riskModels.has('assessment')) {
        const model = this.riskModels.get('assessment');
        const modelRisk = await this.runRiskModel(model, signal);
        riskScore = (riskScore + modelRisk) / 2;
      }

      // Determine risk level
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      if (riskScore >= 80) {
        riskLevel = 'CRITICAL';
      } else if (riskScore >= 60) {
        riskLevel = 'HIGH';
      } else if (riskScore >= 40) {
        riskLevel = 'MEDIUM';
      } else {
        riskLevel = 'LOW';
      }

      return {
        riskLevel,
        riskScore: Math.min(100, riskScore),
        riskFactors
      };
    } catch (error: any) {
      console.error('❌ Risk assessment failed:', error);
      return {
        riskLevel: 'LOW',
        riskScore: 0,
        riskFactors: ['Assessment error']
      };
    }
  }

  /**
   * Recognize patterns in signal
   */
  private async recognizePatterns(signal: Signal): Promise<{
    patterns: string[];
    patternConfidence: number;
    historicalCorrelation: number;
  }> {
    try {
      const patterns: string[] = [];
      let patternConfidence = 0;
      let historicalCorrelation = 0;

      if (!this.config.features.patternRecognition) {
        return { patterns, patternConfidence, historicalCorrelation };
      }

      // Analyze signal for known patterns
      const signalPatterns = await this.analyzeSignalPatterns(signal);
      patterns.push(...signalPatterns.patterns);
      patternConfidence = signalPatterns.confidence;

      // Calculate historical correlation
      historicalCorrelation = await this.calculateHistoricalCorrelation(signal);

      // Use pattern recognition models if available
      if (this.patternDatabase.has(signal.type)) {
        const knownPatterns = this.patternDatabase.get(signal.type)!;
        const matchedPatterns = await this.matchKnownPatterns(signal, knownPatterns);
        patterns.push(...matchedPatterns.patterns);
        patternConfidence = Math.max(patternConfidence, matchedPatterns.confidence);
      }

      return {
        patterns: [...new Set(patterns)], // Remove duplicates
        patternConfidence: Math.min(1, patternConfidence),
        historicalCorrelation: Math.min(1, historicalCorrelation)
      };
    } catch (error: any) {
      console.error('❌ Pattern recognition failed:', error);
      return {
        patterns: [],
        patternConfidence: 0,
        historicalCorrelation: 0
      };
    }
  }

  /**
   * Perform predictive analysis
   */
  private async performPredictiveAnalysis(signal: Signal): Promise<{
    predictedOutcomes: string[];
    probabilities: number[];
    timeHorizons: number[];
  }> {
    try {
      const predictedOutcomes: string[] = [];
      const probabilities: number[] = [];
      const timeHorizons: number[] = [];

      if (!this.config.features.predictiveAnalytics) {
        return { predictedOutcomes, probabilities, timeHorizons };
      }

      // Basic predictive analysis based on signal type and severity
      const predictions = await this.generateBasicPredictions(signal);
      predictedOutcomes.push(...predictions.outcomes);
      probabilities.push(...predictions.probabilities);
      timeHorizons.push(...predictions.timeHorizons);

      // Use machine learning models if available
      if (this.predictionModels.has('forecasting')) {
        const model = this.predictionModels.get('forecasting');
        const mlPredictions = await this.runPredictionModel(model, signal);
        predictedOutcomes.push(...mlPredictions.outcomes);
        probabilities.push(...mlPredictions.probabilities);
        timeHorizons.push(...mlPredictions.timeHorizons);
      }

      return {
        predictedOutcomes,
        probabilities: probabilities.slice(0, 5), // Limit to top 5
        timeHorizons: timeHorizons.slice(0, 5)
      };
    } catch (error: any) {
      console.error('❌ Predictive analysis failed:', error);
      return {
        predictedOutcomes: [],
        probabilities: [],
        timeHorizons: []
      };
    }
  }

  /**
   * Generate recommended actions based on analysis
   */
  private async generateRecommendedActions(
    signal: Signal,
    analysis: any
  ): Promise<ResponseAction[]> {
    try {
      const actions: ResponseAction[] = [];

      // Generate actions based on risk level
      if (analysis.riskAssessment.riskLevel === 'CRITICAL') {
        actions.push({
          id: `critical-response-${Date.now()}`,
          type: ResponseActionType.IMMEDIATE_RESPONSE,
          description: 'Execute immediate emergency response',
          priority: 'CRITICAL',
          parameters: {
            escalationLevel: 'CRITICAL',
            responseTime: 0,
            resources: ['emergency-team', 'equipment']
          },
          estimatedDuration: 300000, // 5 minutes
          requiredResources: ['emergency-team'],
          successCriteria: 'Emergency contained within 5 minutes'
        });
      }

      // Generate actions based on signal type
      switch (signal.type) {
        case SignalType.ASSET_CONDITION:
          actions.push({
            id: `asset-inspection-${Date.now()}`,
            type: ResponseActionType.SCHEDULE_INSPECTION,
            description: 'Schedule asset condition inspection',
            priority: analysis.riskAssessment.riskLevel,
            parameters: {
              inspectionType: 'condition-assessment',
              urgency: analysis.riskAssessment.riskLevel.toLowerCase()
            },
            estimatedDuration: 3600000, // 1 hour
            requiredResources: ['inspector'],
            successCriteria: 'Asset condition assessed and documented'
          });
          break;

        case SignalType.MAINTENANCE:
          actions.push({
            id: `maintenance-schedule-${Date.now()}`,
            type: ResponseActionType.SCHEDULE_MAINTENANCE,
            description: 'Schedule maintenance work order',
            priority: analysis.riskAssessment.riskLevel,
            parameters: {
              maintenanceType: 'preventive',
              priority: analysis.riskAssessment.riskLevel.toLowerCase()
            },
            estimatedDuration: 7200000, // 2 hours
            requiredResources: ['maintenance-team'],
            successCriteria: 'Maintenance completed successfully'
          });
          break;

        case SignalType.ENVIRONMENTAL:
          actions.push({
            id: `environmental-response-${Date.now()}`,
            type: ResponseActionType.ENVIRONMENTAL_RESPONSE,
            description: 'Execute environmental response protocol',
            priority: analysis.riskAssessment.riskLevel,
            parameters: {
              environmentalType: signal.metadata?.environmentalType || 'general',
              severity: signal.severity
            },
            estimatedDuration: 1800000, // 30 minutes
            requiredResources: ['environmental-team'],
            successCriteria: 'Environmental impact mitigated'
          });
          break;
      }

      // Generate actions based on patterns
      if (analysis.patternRecognition.patterns.length > 0) {
        actions.push({
          id: `pattern-response-${Date.now()}`,
          type: ResponseActionType.INVESTIGATE_PATTERN,
          description: 'Investigate detected pattern',
          priority: 'MEDIUM',
          parameters: {
            patterns: analysis.patternRecognition.patterns,
            confidence: analysis.patternRecognition.patternConfidence
          },
          estimatedDuration: 900000, // 15 minutes
          requiredResources: ['analyst'],
          successCriteria: 'Pattern analysis completed'
        });
      }

      return actions;
    } catch (error: any) {
      console.error('❌ Action generation failed:', error);
      return [];
    }
  }

  /**
   * Analyze signal patterns
   */
  private async analyzeSignalPatterns(signal: Signal): Promise<{
    patterns: string[];
    confidence: number;
  }> {
    const patterns: string[] = [];
    let confidence = 0;

    // Time-based patterns
    const hour = signal.timestamp.getHours();
    if (hour >= 6 && hour <= 8) {
      patterns.push('morning-peak');
      confidence += 0.3;
    } else if (hour >= 17 && hour <= 19) {
      patterns.push('evening-peak');
      confidence += 0.3;
    }

    // Severity patterns
    if (signal.severity === SignalSeverity.CRITICAL) {
      patterns.push('critical-event');
      confidence += 0.4;
    }

    // Strength patterns
    if (signal.strength > 90) {
      patterns.push('high-intensity');
      confidence += 0.2;
    }

    return { patterns, confidence: Math.min(1, confidence) };
  }

  /**
   * Calculate historical correlation
   */
  private async calculateHistoricalCorrelation(signal: Signal): Promise<number> {
    try {
      // Look for similar signals in history
      const similarSignals = this.processingHistory.filter(h => 
        h.signal.type === signal.type &&
        Math.abs(h.signal.timestamp.getTime() - signal.timestamp.getTime()) < 24 * 60 * 60 * 1000 // Within 24 hours
      );

      if (similarSignals.length === 0) {
        return 0;
      }

      // Calculate correlation based on similarity
      let totalCorrelation = 0;
      for (const similarSignal of similarSignals) {
        const correlation = this.calculateSignalSimilarity(signal, similarSignal.signal);
        totalCorrelation += correlation;
      }

      return totalCorrelation / similarSignals.length;
    } catch (error: any) {
      console.error('❌ Historical correlation calculation failed:', error);
      return 0;
    }
  }

  /**
   * Calculate signal similarity
   */
  private calculateSignalSimilarity(signal1: Signal, signal2: Signal): number {
    let similarity = 0;

    // Type similarity
    if (signal1.type === signal2.type) {
      similarity += 0.4;
    }

    // Severity similarity
    if (signal1.severity === signal2.severity) {
      similarity += 0.3;
    }

    // Strength similarity
    const strengthDiff = Math.abs(signal1.strength - signal2.strength);
    similarity += (1 - strengthDiff / 100) * 0.2;

    // Asset similarity
    if (signal1.assetId === signal2.assetId) {
      similarity += 0.1;
    }

    return Math.min(1, similarity);
  }

  /**
   * Calculate historical risk
   */
  private async calculateHistoricalRisk(signal: Signal): Promise<{
    score: number;
    factors: string[];
  }> {
    const factors: string[] = [];
    let score = 0;

    // Look for similar signals in history
    const similarSignals = this.processingHistory.filter(h => 
      h.signal.type === signal.type &&
      h.signal.assetId === signal.assetId
    );

    if (similarSignals.length > 0) {
      const avgRiskScore = similarSignals.reduce((sum, s) => 
        sum + s.analysis.riskAssessment.riskScore, 0) / similarSignals.length;
      
      if (avgRiskScore > 70) {
        score += 10;
        factors.push('Historical high-risk pattern');
      }
    }

    return { score, factors };
  }

  /**
   * Generate basic predictions
   */
  private async generateBasicPredictions(signal: Signal): Promise<{
    outcomes: string[];
    probabilities: number[];
    timeHorizons: number[];
  }> {
    const outcomes: string[] = [];
    const probabilities: number[] = [];
    const timeHorizons: number[] = [];

    // Predictions based on signal type
    switch (signal.type) {
      case SignalType.ASSET_CONDITION:
        if (signal.severity === SignalSeverity.HIGH) {
          outcomes.push('Asset failure within 24 hours');
          probabilities.push(0.7);
          timeHorizons.push(24);
        }
        break;

      case SignalType.MAINTENANCE:
        outcomes.push('Maintenance required within 48 hours');
        probabilities.push(0.8);
        timeHorizons.push(48);
        break;

      case SignalType.ENVIRONMENTAL:
        outcomes.push('Environmental impact within 12 hours');
        probabilities.push(0.6);
        timeHorizons.push(12);
        break;
    }

    return { outcomes, probabilities, timeHorizons };
  }

  /**
   * Match known patterns
   */
  private async matchKnownPatterns(signal: Signal, knownPatterns: any[]): Promise<{
    patterns: string[];
    confidence: number;
  }> {
    const patterns: string[] = [];
    let confidence = 0;

    for (const pattern of knownPatterns) {
      const matchScore = this.calculatePatternMatch(signal, pattern);
      if (matchScore > 0.6) {
        patterns.push(pattern.name);
        confidence = Math.max(confidence, matchScore);
      }
    }

    return { patterns, confidence };
  }

  /**
   * Calculate pattern match score
   */
  private calculatePatternMatch(signal: Signal, pattern: any): number {
    let score = 0;

    // Match signal type
    if (pattern.signalTypes?.includes(signal.type)) {
      score += 0.4;
    }

    // Match severity
    if (pattern.severityLevels?.includes(signal.severity)) {
      score += 0.3;
    }

    // Match strength range
    if (signal.strength >= pattern.minStrength && signal.strength <= pattern.maxStrength) {
      score += 0.3;
    }

    return score;
  }

  /**
   * Run classification model
   */
  private async runClassificationModel(model: any, signal: Signal): Promise<number> {
    // Simulate ML model execution
    return Math.random() * 0.4 + 0.6; // Return confidence between 0.6-1.0
  }

  /**
   * Run risk model
   */
  private async runRiskModel(model: any, signal: Signal): Promise<number> {
    // Simulate risk model execution
    return Math.random() * 40 + 30; // Return risk score between 30-70
  }

  /**
   * Run prediction model
   */
  private async runPredictionModel(model: any, signal: Signal): Promise<{
    outcomes: string[];
    probabilities: number[];
    timeHorizons: number[];
  }> {
    // Simulate prediction model execution
    return {
      outcomes: ['ML Predicted Outcome'],
      probabilities: [0.75],
      timeHorizons: [36]
    };
  }

  /**
   * Initialize pattern recognition
   */
  private async initializePatternRecognition(): Promise<void> {
    // Initialize pattern database with common patterns
    const commonPatterns = [
      { name: 'morning-peak', signalTypes: [SignalType.PERFORMANCE_DEGRADATION], severityLevels: [SignalSeverity.MEDIUM], minStrength: 60, maxStrength: 100 },
      { name: 'evening-peak', signalTypes: [SignalType.PERFORMANCE_DEGRADATION], severityLevels: [SignalSeverity.MEDIUM], minStrength: 60, maxStrength: 100 },
      { name: 'critical-event', signalTypes: [SignalType.EMERGENCY], severityLevels: [SignalSeverity.CRITICAL], minStrength: 80, maxStrength: 100 },
      { name: 'high-intensity', signalTypes: Object.values(SignalType), severityLevels: Object.values(SignalSeverity), minStrength: 90, maxStrength: 100 }
    ];

    for (const pattern of commonPatterns) {
      for (const signalType of pattern.signalTypes) {
        if (!this.patternDatabase.has(signalType)) {
          this.patternDatabase.set(signalType, []);
        }
        this.patternDatabase.get(signalType)!.push(pattern);
      }
    }
  }

  /**
   * Initialize risk models
   */
  private async initializeRiskModels(): Promise<void> {
    // Initialize risk assessment models
    this.riskModels.set('assessment', {
      type: 'risk-assessment',
      version: '1.0.0',
      parameters: { threshold: 0.7 }
    });
  }

  /**
   * Initialize prediction models
   */
  private async initializePredictionModels(): Promise<void> {
    // Initialize prediction models
    this.predictionModels.set('classification', {
      type: 'classification',
      version: '1.0.0',
      parameters: { confidence_threshold: 0.6 }
    });

    this.predictionModels.set('forecasting', {
      type: 'forecasting',
      version: '1.0.0',
      parameters: { horizon: 72 }
    });
  }

  /**
   * Initialize correlation analysis
   */
  private initializeCorrelationAnalysis(): void {
    // Initialize correlation cache
    this.correlationCache = new Map();
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    this.eventListeners.set('initialized', []);
    this.eventListeners.set('processingCompleted', []);
    this.eventListeners.set('patternDetected', []);
    this.eventListeners.set('riskAssessed', []);
  }

  /**
   * Emit event to listeners
   */
  private emitEvent(eventName: string, data: any): void {
    const listeners = this.eventListeners.get(eventName) || [];
    for (const listener of listeners) {
      try {
        listener(data);
      } catch (error: any) {
        console.error(`❌ Event listener error for ${eventName}:`, error);
      }
    }
  }

  /**
   * Validate configuration
   */
  private validateConfig(): void {
    if (!this.config.id || !this.config.name) {
      throw new Error('Invalid configuration: missing required fields');
    }

    if (this.config.analysis.analysisWindow <= 0) {
      throw new Error('Invalid configuration: analysisWindow must be greater than 0');
    }

    if (this.config.analysis.correlationThreshold < 0 || this.config.analysis.correlationThreshold > 1) {
      throw new Error('Invalid configuration: correlationThreshold must be between 0 and 1');
    }
  }

  /**
   * Initialize models
   */
  private initializeModels(): void {
    // Initialize empty model containers
    this.patternDatabase = new Map();
    this.riskModels = new Map();
    this.predictionModels = new Map();
    this.correlationCache = new Map();
  }

  // Public API methods

  /**
   * Get processing history
   */
  public getProcessingHistory(): SignalProcessingResult[] {
    return [...this.processingHistory];
  }

  /**
   * Clear processing history
   */
  public clearProcessingHistory(): void {
    this.processingHistory = [];
    console.log('🧹 Processing history cleared');
  }

  /**
   * Add event listener
   */
  public addEventListener(eventName: string, listener: Function): void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName)!.push(listener);
  }

  /**
   * Remove event listener
   */
  public removeEventListener(eventName: string, listener: Function): void {
    const listeners = this.eventListeners.get(eventName) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<SignalIntelligenceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Signal Processing Engine configuration updated');
  }

  /**
   * Get pattern database
   */
  public getPatternDatabase(): Map<string, any[]> {
    return new Map(this.patternDatabase);
  }

  /**
   * Add pattern to database
   */
  public addPattern(signalType: SignalType, pattern: any): void {
    if (!this.patternDatabase.has(signalType)) {
      this.patternDatabase.set(signalType, []);
    }
    this.patternDatabase.get(signalType)!.push(pattern);
    console.log(`📊 Pattern added for signal type: ${signalType}`);
  }

  /**
   * Check if engine is initialized
   */
  public isEngineInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get engine statistics
   */
  public getStatistics(): {
    totalProcessed: number;
    averageProcessingTime: number;
    patternDatabaseSize: number;
    riskModelsCount: number;
    predictionModelsCount: number;
  } {
    const totalProcessed = this.processingHistory.length;
    const averageProcessingTime = totalProcessed > 0 
      ? this.processingHistory.reduce((sum, r) => sum + r.processingTime, 0) / totalProcessed
      : 0;

    return {
      totalProcessed,
      averageProcessingTime,
      patternDatabaseSize: Array.from(this.patternDatabase.values()).reduce((sum, patterns) => sum + patterns.length, 0),
      riskModelsCount: this.riskModels.size,
      predictionModelsCount: this.predictionModels.size
    };
  }
}
