"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, DollarSign, Clock, Users, Zap } from 'lucide-react';
import { trackLandingPageEvent } from '@/lib/analytics/landing-page-analytics';
import { staggerContainer, staggerItem, scaleIn } from '@/lib/animations/landing-page-animations';

interface ROICalculation {
  currentMaintenanceCost: number;
  assetCount: number;
  averageAssetValue: number;
  downtimeHours: number;
  laborCostPerHour: number;
  energyCostPerMonth: number;
}

interface ROICalculatorProps {
  variant?: 'inline' | 'modal' | 'fullscreen';
  className?: string;
}

export default function ROICalculator({ 
  variant = 'inline',
  className = ''
}: ROICalculatorProps) {
  const [calculation, setCalculation] = useState<ROICalculation>({
    currentMaintenanceCost: 50000,
    assetCount: 100,
    averageAssetValue: 50000,
    downtimeHours: 120,
    laborCostPerHour: 75,
    energyCostPerMonth: 25000
  });

  const [results, setResults] = useState({
    annualSavings: 0,
    roiPercentage: 0,
    paybackPeriod: 0,
    totalBenefit: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    calculateROI();
  }, [calculation]);

  const calculateROI = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const {
      currentMaintenanceCost,
      assetCount,
      averageAssetValue,
      downtimeHours,
      laborCostPerHour,
      energyCostPerMonth
    } = calculation;

    // Aegrid savings calculations based on industry data
    const maintenanceSavings = currentMaintenanceCost * 0.23; // 23% reduction
    const downtimeSavings = downtimeHours * laborCostPerHour * 0.67; // 67% reduction
    const energySavings = energyCostPerMonth * 12 * 0.18; // 18% reduction
    const assetUtilizationSavings = (assetCount * averageAssetValue * 0.05); // 5% better utilization

    const annualSavings = maintenanceSavings + downtimeSavings + energySavings + assetUtilizationSavings;
    const aegridCost = 24000; // Annual Aegrid cost estimate
    const totalBenefit = annualSavings - aegridCost;
    const roiPercentage = (totalBenefit / aegridCost) * 100;
    const paybackPeriod = aegridCost / (annualSavings / 12);

    setResults({
      annualSavings: Math.round(annualSavings),
      roiPercentage: Math.round(roiPercentage),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      totalBenefit: Math.round(totalBenefit)
    });

    setIsCalculating(false);

    // Track calculation event
    trackLandingPageEvent('feature_interaction', {
      action: 'roi_calculated',
      asset_count: assetCount,
      annual_savings: annualSavings,
      roi_percentage: roiPercentage
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field: keyof ROICalculation, value: number) => {
    setCalculation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const InputSlider = ({ 
    label, 
    field, 
    min, 
    max, 
    step = 1, 
    unit = '',
    description 
  }: {
    label: string;
    field: keyof ROICalculation;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    description?: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={field} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id={field}
            type="number"
            value={calculation[field]}
            onChange={(e) => handleInputChange(field, Number(e.target.value))}
            className="w-24 h-8 text-sm"
          />
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
      </div>
      <Slider
        value={[calculation[field]]}
        onValueChange={([value]) => handleInputChange(field, value)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );

  const ResultCard = ({ 
    icon: Icon, 
    title, 
    value, 
    description, 
    color = 'text-green-600' 
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    description: string;
    color?: string;
  }) => (
    <motion.div variants={staggerItem}>
      <Card className="text-center">
        <CardContent className="p-6">
          <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
            color === 'text-green-600' ? 'bg-green-100' :
            color === 'text-blue-600' ? 'bg-blue-100' :
            color === 'text-purple-600' ? 'bg-purple-100' :
            'bg-gray-100'
          }`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className={`text-2xl font-bold mb-2 ${color}`}>{value}</div>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className={`${className}`}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">ROI Calculator</CardTitle>
              <CardDescription>
                Calculate your potential savings with Aegrid's intelligent asset management
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div variants={staggerItem} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Current Situation</h3>
                <div className="space-y-6">
                  <InputSlider
                    label="Annual Maintenance Cost"
                    field="currentMaintenanceCost"
                    min={10000}
                    max={500000}
                    step={5000}
                    unit="AUD"
                    description="Current annual maintenance spending"
                  />

                  <InputSlider
                    label="Number of Assets"
                    field="assetCount"
                    min={10}
                    max={1000}
                    step={10}
                    unit="assets"
                    description="Total number of managed assets"
                  />

                  <InputSlider
                    label="Average Asset Value"
                    field="averageAssetValue"
                    min={5000}
                    max={500000}
                    step={5000}
                    unit="AUD"
                    description="Average value per asset"
                  />

                  <InputSlider
                    label="Annual Downtime Hours"
                    field="downtimeHours"
                    min={20}
                    max={500}
                    step={10}
                    unit="hours"
                    description="Total unplanned downtime per year"
                  />

                  <InputSlider
                    label="Labor Cost per Hour"
                    field="laborCostPerHour"
                    min={30}
                    max={150}
                    step={5}
                    unit="AUD"
                    description="Average hourly labor cost"
                  />

                  <InputSlider
                    label="Monthly Energy Cost"
                    field="energyCostPerMonth"
                    min={5000}
                    max={100000}
                    step={1000}
                    unit="AUD"
                    description="Monthly energy consumption cost"
                  />
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div variants={staggerItem} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Potential Savings</h3>
                
                {isCalculating ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ResultCard
                      icon={DollarSign}
                      title="Annual Savings"
                      value={formatCurrency(results.annualSavings)}
                      description="Total cost reduction per year"
                      color="text-green-600"
                    />

                    <ResultCard
                      icon={TrendingUp}
                      title="ROI"
                      value={`${results.roiPercentage}%`}
                      description="Return on investment"
                      color="text-blue-600"
                    />

                    <ResultCard
                      icon={Clock}
                      title="Payback Period"
                      value={`${results.paybackPeriod} months`}
                      description="Time to recover investment"
                      color="text-purple-600"
                    />

                    <ResultCard
                      icon={Zap}
                      title="Net Benefit"
                      value={formatCurrency(results.totalBenefit)}
                      description="Annual profit after Aegrid cost"
                      color="text-green-600"
                    />
                  </div>
                )}

                {results.totalBenefit > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Great News!</span>
                    </div>
                    <p className="text-sm text-green-700">
                      You could save <strong>{formatCurrency(results.annualSavings)}</strong> annually 
                      with a <strong>{results.roiPercentage}% ROI</strong> and payback in 
                      just <strong>{results.paybackPeriod} months</strong>.
                    </p>
                  </motion.div>
                )}

                <div className="mt-6">
                  <Button 
                    className="w-full" 
                    onClick={() => trackLandingPageEvent('feature_interaction', { action: 'roi_cta_click' })}
                  >
                    Get Your Custom ROI Report
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Detailed analysis with implementation timeline
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Savings Breakdown */}
          <motion.div
            variants={staggerItem}
            className="mt-8 pt-6 border-t"
          >
            <h3 className="text-lg font-semibold mb-4">Savings Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">23%</div>
                <div className="text-sm text-gray-600">Maintenance Reduction</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">67%</div>
                <div className="text-sm text-gray-600">Downtime Reduction</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">18%</div>
                <div className="text-sm text-gray-600">Energy Savings</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">5%</div>
                <div className="text-sm text-gray-600">Asset Utilization</div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
