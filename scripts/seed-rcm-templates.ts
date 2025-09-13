import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed RCM Templates with pre-built templates for common asset classes
 */
async function seedRCMTemplates() {
  console.log("🌱 Seeding RCM Templates...");

  // Get the first organisation (assuming it exists)
  const organisation = await prisma.organisation.findFirst();
  if (!organisation) {
    console.log("❌ No organisation found. Please run user seed first.");
    return;
  }

  // Get the first admin user
  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN", organisationId: organisation.id },
  });
  if (!adminUser) {
    console.log("❌ No admin user found. Please run user seed first.");
    return;
  }

  const templates = [
    {
      name: "Building - General Maintenance",
      description: "Comprehensive RCM template for general building maintenance including HVAC, electrical, and structural systems.",
      assetType: "BUILDING",
      failureModes: [
        {
          name: "HVAC System Failure",
          description: "Complete failure of heating, ventilation, and air conditioning system",
          type: "COMPLETE_FAILURE",
          cause: "Motor burnout, compressor failure, electrical issues",
          effect: "Loss of climate control, occupant discomfort",
          severity: "HIGH",
          consequences: "Building unusable, potential health risks",
          detectionMethod: "Temperature monitoring, vibration analysis",
          preventionMethod: "Regular filter changes, motor lubrication, electrical testing",
          probability: 6,
          impact: 8,
        },
        {
          name: "Electrical System Degradation",
          description: "Gradual degradation of electrical systems",
          type: "DEGRADED_PERFORMANCE",
          cause: "Corrosion, loose connections, overload",
          effect: "Reduced power quality, flickering lights",
          severity: "MEDIUM",
          consequences: "Equipment damage, safety hazards",
          detectionMethod: "Thermal imaging, power quality monitoring",
          preventionMethod: "Regular inspections, connection tightening",
          probability: 7,
          impact: 6,
        },
        {
          name: "Structural Cracking",
          description: "Development of cracks in structural elements",
          type: "DEGRADED_PERFORMANCE",
          cause: "Settlement, thermal expansion, material fatigue",
          effect: "Reduced structural integrity",
          severity: "CRITICAL",
          consequences: "Building collapse risk, safety evacuation",
          detectionMethod: "Visual inspection, crack monitoring",
          preventionMethod: "Foundation maintenance, expansion joint care",
          probability: 3,
          impact: 10,
        },
      ],
      maintenanceTasks: [
        {
          name: "HVAC Filter Replacement",
          description: "Replace air filters in all HVAC units",
          type: "REPLACEMENT",
          frequency: "MONTHLY",
          duration: 30,
          skillLevel: "Basic",
          tools: "Screwdriver, replacement filters",
          materials: "Air filters",
          instructions: "1. Turn off HVAC unit\n2. Remove old filter\n3. Install new filter\n4. Check airflow direction\n5. Turn unit back on",
          safetyRequirements: "Lockout/tagout procedures",
          complianceNotes: "Follow manufacturer specifications",
          estimatedCost: 50,
        },
        {
          name: "Electrical Panel Inspection",
          description: "Visual inspection of electrical panels and connections",
          type: "INSPECTION",
          frequency: "QUARTERLY",
          duration: 60,
          skillLevel: "Licensed Electrician",
          tools: "Multimeter, thermal camera, screwdriver",
          materials: "None",
          instructions: "1. Visual inspection of all connections\n2. Check for overheating\n3. Test circuit breakers\n4. Document findings",
          safetyRequirements: "PPE, lockout/tagout",
          complianceNotes: "Must be performed by licensed electrician",
          estimatedCost: 200,
        },
        {
          name: "Structural Inspection",
          description: "Comprehensive structural inspection",
          type: "INSPECTION",
          frequency: "ANNUALLY",
          duration: 240,
          skillLevel: "Structural Engineer",
          tools: "Measuring tape, crack gauge, level",
          materials: "None",
          instructions: "1. Visual inspection of all structural elements\n2. Measure any cracks\n3. Check for settlement\n4. Document all findings",
          safetyRequirements: "Safety harness, hard hat",
          complianceNotes: "Must be performed by qualified structural engineer",
          estimatedCost: 1000,
        },
      ],
    },
    {
      name: "Road - Pavement Maintenance",
      description: "RCM template for road and pavement maintenance including surface, drainage, and signage systems.",
      assetType: "ROAD",
      failureModes: [
        {
          name: "Pavement Cracking",
          description: "Development of cracks in road surface",
          type: "DEGRADED_PERFORMANCE",
          cause: "Thermal expansion, heavy traffic, poor drainage",
          effect: "Reduced ride quality, water infiltration",
          severity: "MEDIUM",
          consequences: "Pothole formation, increased maintenance costs",
          detectionMethod: "Visual inspection, crack mapping",
          preventionMethod: "Proper drainage, crack sealing",
          probability: 8,
          impact: 5,
        },
        {
          name: "Drainage System Blockage",
          description: "Blockage of road drainage systems",
          type: "FUNCTIONAL_FAILURE",
          cause: "Debris accumulation, sediment buildup",
          effect: "Water pooling, flooding risk",
          severity: "HIGH",
          consequences: "Road closure, vehicle damage, safety hazards",
          detectionMethod: "Visual inspection, flow testing",
          preventionMethod: "Regular cleaning, sediment removal",
          probability: 6,
          impact: 7,
        },
      ],
      maintenanceTasks: [
        {
          name: "Crack Sealing",
          description: "Seal cracks in road surface to prevent water infiltration",
          type: "REPAIR",
          frequency: "SEMI_ANNUALLY",
          duration: 120,
          skillLevel: "Road Maintenance Crew",
          tools: "Crack sealing equipment, broom",
          materials: "Crack sealant",
          instructions: "1. Clean cracks thoroughly\n2. Apply sealant\n3. Smooth surface\n4. Allow curing time",
          safetyRequirements: "Traffic control, safety vests",
          complianceNotes: "Follow traffic management procedures",
          estimatedCost: 300,
        },
        {
          name: "Drainage Cleaning",
          description: "Clean and inspect road drainage systems",
          type: "CLEANING",
          frequency: "QUARTERLY",
          duration: 90,
          skillLevel: "Maintenance Crew",
          tools: "High-pressure washer, shovel, inspection camera",
          materials: "None",
          instructions: "1. Remove debris from drains\n2. Flush with high-pressure water\n3. Inspect for damage\n4. Document findings",
          safetyRequirements: "Traffic control, safety equipment",
          complianceNotes: "Ensure proper disposal of debris",
          estimatedCost: 150,
        },
      ],
    },
    {
      name: "Traffic Light - Signal Maintenance",
      description: "RCM template for traffic signal maintenance including controllers, lights, and detection systems.",
      assetType: "TRAFFIC_LIGHT",
      failureModes: [
        {
          name: "Signal Controller Failure",
          description: "Complete failure of traffic signal controller",
          type: "COMPLETE_FAILURE",
          cause: "Power surge, component failure, water damage",
          effect: "Loss of signal control",
          severity: "CRITICAL",
          consequences: "Traffic chaos, accident risk",
          detectionMethod: "Controller diagnostics, monitoring system",
          preventionMethod: "Surge protection, weatherproofing, regular testing",
          probability: 4,
          impact: 10,
        },
        {
          name: "LED Light Failure",
          description: "Failure of LED signal lights",
          type: "FUNCTIONAL_FAILURE",
          cause: "LED burnout, driver failure, moisture ingress",
          effect: "Reduced visibility, signal confusion",
          severity: "HIGH",
          consequences: "Traffic violations, accident risk",
          detectionMethod: "Visual inspection, light testing",
          preventionMethod: "Regular cleaning, moisture protection",
          probability: 7,
          impact: 8,
        },
      ],
      maintenanceTasks: [
        {
          name: "Controller Diagnostics",
          description: "Run diagnostic tests on traffic signal controller",
          type: "TESTING",
          frequency: "MONTHLY",
          duration: 45,
          skillLevel: "Traffic Technician",
          tools: "Diagnostic software, multimeter",
          materials: "None",
          instructions: "1. Connect diagnostic equipment\n2. Run system tests\n3. Check timing parameters\n4. Document results",
          safetyRequirements: "Traffic control, safety equipment",
          complianceNotes: "Follow traffic engineering standards",
          estimatedCost: 100,
        },
        {
          name: "LED Light Replacement",
          description: "Replace failed LED signal lights",
          type: "REPLACEMENT",
          frequency: "AS_NEEDED",
          duration: 30,
          skillLevel: "Traffic Technician",
          tools: "Ladder, screwdriver, LED tester",
          materials: "LED replacement modules",
          instructions: "1. Access signal head\n2. Remove failed LED\n3. Install new LED\n4. Test operation",
          safetyRequirements: "Traffic control, fall protection",
          complianceNotes: "Use approved LED modules only",
          estimatedCost: 75,
        },
      ],
    },
  ];

  for (const templateData of templates) {
    // Check if template already exists
    const existingTemplate = await prisma.rCMTemplate.findFirst({
      where: {
        name: templateData.name,
        organisationId: organisation.id,
      },
    });

    if (existingTemplate) {
      console.log(`⏭️  Template "${templateData.name}" already exists, skipping...`);
      continue;
    }

    // Create template with failure modes and maintenance tasks
    const template = await prisma.rCMTemplate.create({
      data: {
        name: templateData.name,
        description: templateData.description,
        assetType: templateData.assetType,
        version: "1.0",
        status: "ACTIVE",
        isPublic: true,
        createdBy: adminUser.id,
        organisationId: organisation.id,
        failureModes: {
          create: templateData.failureModes.map(fm => ({
            name: fm.name,
            description: fm.description,
            type: fm.type,
            cause: fm.cause,
            effect: fm.effect,
            severity: fm.severity,
            consequences: fm.consequences,
            detectionMethod: fm.detectionMethod,
            preventionMethod: fm.preventionMethod,
            probability: fm.probability,
            impact: fm.impact,
            riskScore: fm.probability * fm.impact,
          })),
        },
        maintenanceTasks: {
          create: templateData.maintenanceTasks.map(mt => ({
            name: mt.name,
            description: mt.description,
            type: mt.type,
            frequency: mt.frequency,
            duration: mt.duration,
            skillLevel: mt.skillLevel,
            tools: mt.tools,
            materials: mt.materials,
            instructions: mt.instructions,
            safetyRequirements: mt.safetyRequirements,
            complianceNotes: mt.complianceNotes,
            estimatedCost: mt.estimatedCost,
          })),
        },
      },
    });

    console.log(`✅ Created RCM template: "${template.name}"`);
  }

  console.log("🎉 RCM Templates seeding completed!");
}

// Run the seed function
seedRCMTemplates()
  .catch((e) => {
    console.error("❌ Error seeding RCM templates:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
