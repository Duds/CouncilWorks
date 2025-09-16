import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { isManagerOrHigher } from "@/lib/rbac";
import { AuditAction } from "@prisma/client";
import { logAuditEvent } from "@/lib/audit";

/**
 * RCM Template creation schema
 */
const createRCMTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  assetType: z.string().min(1, "Asset type is required"),
  version: z.string().default("1.0"),
  isPublic: z.boolean().default(false),
  failureModes: z.array(z.object({
    name: z.string().min(1, "Failure mode name is required"),
    description: z.string().optional(),
    type: z.enum(["FUNCTIONAL_FAILURE", "DEGRADED_PERFORMANCE", "COMPLETE_FAILURE", "INTERMITTENT_FAILURE"]),
    cause: z.string().optional(),
    effect: z.string().min(1, "Effect is required"),
    severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    consequences: z.string().optional(),
    detectionMethod: z.string().optional(),
    preventionMethod: z.string().optional(),
    probability: z.number().min(1).max(10).optional(),
    impact: z.number().min(1).max(10).optional(),
  })).default([]),
  maintenanceTasks: z.array(z.object({
    name: z.string().min(1, "Task name is required"),
    description: z.string().optional(),
    type: z.enum(["INSPECTION", "CLEANING", "LUBRICATION", "ADJUSTMENT", "REPLACEMENT", "REPAIR", "CALIBRATION", "TESTING"]),
    frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "SEMI_ANNUALLY", "ANNUALLY", "BIENNIALLY", "AS_NEEDED", "CONDITION_BASED"]),
    duration: z.number().optional(),
    skillLevel: z.string().optional(),
    tools: z.string().optional(),
    materials: z.string().optional(),
    instructions: z.string().optional(),
    safetyRequirements: z.string().optional(),
    complianceNotes: z.string().optional(),
    estimatedCost: z.number().optional(),
  })).default([]),
});

/**
 * GET /api/rcm-templates - List RCM templates
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assetType = searchParams.get("assetType");
    const status = searchParams.get("status");
    const isPublic = searchParams.get("isPublic");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    const where: any = {
      organisationId: session.user.organisationId,
    };

    if (assetType) {
      where.assetType = assetType;
    }

    if (status) {
      where.status = status;
    }

    if (isPublic !== null) {
      where.isPublic = isPublic === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [templates, total] = await Promise.all([
      prisma.rCMTemplate.findMany({
        where,
        include: {
          createdByUser: {
            select: { id: true, name: true, email: true },
          },
          failureModes: true,
          maintenanceTasks: true,
          _count: {
            select: {
              assetsUsingTemplate: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.rCMTemplate.count({ where }),
    ]);

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching RCM templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch RCM templates" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rcm-templates - Create RCM template
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !isManagerOrHigher(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = createRCMTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create template with failure modes and maintenance tasks
    const template = await prisma.rCMTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        assetType: data.assetType,
        version: data.version,
        isPublic: data.isPublic,
        createdBy: session.user.id,
        organisationId: session.user.organisationId!,
        failureModes: {
          create: data.failureModes.map(fm => ({
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
            riskScore: fm.probability && fm.impact ? fm.probability * fm.impact : null,
          })),
        },
        maintenanceTasks: {
          create: data.maintenanceTasks.map(mt => ({
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
      include: {
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
        failureModes: true,
        maintenanceTasks: true,
      },
    });

    await logAuditEvent(
      AuditAction.ASSET_CREATED,
      session.user.id,
      session.user.organisationId,
      { message: `RCM Template '${template.name}' created for asset type '${template.assetType}'` },
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      request.headers.get("user-agent")
    );

    return NextResponse.json(template, { status: 201 });

  } catch (error) {
    console.error("Error creating RCM template:", error);
    return NextResponse.json(
      { error: "Failed to create RCM template" },
      { status: 500 }
    );
  }
}
