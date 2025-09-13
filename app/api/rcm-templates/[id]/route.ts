import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hasPermission } from "@/lib/rbac";
import { AuditAction } from "@prisma/client";
import { recordAuditLog } from "@/lib/audit";

/**
 * RCM Template update schema
 */
const updateRCMTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").optional(),
  description: z.string().optional(),
  version: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "REVIEW_REQUIRED"]).optional(),
  isPublic: z.boolean().optional(),
});

/**
 * GET /api/rcm-templates/[id] - Get RCM template by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templateId = params.id;

    const template = await prisma.rCMTemplate.findFirst({
      where: {
        id: templateId,
        OR: [
          { organisationId: session.user.organisationId },
          { isPublic: true },
        ],
      },
      include: {
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
        failureModes: {
          orderBy: { severity: "desc" },
        },
        maintenanceTasks: {
          orderBy: { frequency: "asc" },
        },
        _count: {
          select: {
            assetsUsingTemplate: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json(template);

  } catch (error) {
    console.error("Error fetching RCM template:", error);
    return NextResponse.json(
      { error: "Failed to fetch RCM template" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/rcm-templates/[id] - Update RCM template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !hasPermission(session.user.role, "asset:write")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templateId = params.id;
    const body = await request.json();
    const validation = updateRCMTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check if template exists and user has permission
    const existingTemplate = await prisma.rCMTemplate.findFirst({
      where: {
        id: templateId,
        organisationId: session.user.organisationId,
      },
    });

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const updatedTemplate = await prisma.rCMTemplate.update({
      where: { id: templateId },
      data: validation.data,
      include: {
        createdByUser: {
          select: { id: true, name: true, email: true },
        },
        failureModes: true,
        maintenanceTasks: true,
      },
    });

    await recordAuditLog(
      AuditAction.ASSET_UPDATED,
      `RCM Template '${updatedTemplate.name}' updated`,
      session.user.id,
      session.user.organisationId,
      templateId
    );

    return NextResponse.json(updatedTemplate);

  } catch (error) {
    console.error("Error updating RCM template:", error);
    return NextResponse.json(
      { error: "Failed to update RCM template" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/rcm-templates/[id] - Delete RCM template
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !hasPermission(session.user.role, "asset:delete")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templateId = params.id;

    // Check if template exists and user has permission
    const existingTemplate = await prisma.rCMTemplate.findFirst({
      where: {
        id: templateId,
        organisationId: session.user.organisationId,
      },
      include: {
        _count: {
          select: {
            assetsUsingTemplate: true,
          },
        },
      },
    });

    if (!existingTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Check if template is in use
    if (existingTemplate._count.assetsUsingTemplate > 0) {
      return NextResponse.json(
        { error: "Cannot delete template that is in use by assets" },
        { status: 400 }
      );
    }

    await prisma.rCMTemplate.delete({
      where: { id: templateId },
    });

    await recordAuditLog(
      AuditAction.ASSET_DELETED,
      `RCM Template '${existingTemplate.name}' deleted`,
      session.user.id,
      session.user.organisationId,
      templateId
    );

    return NextResponse.json({ message: "Template deleted successfully" });

  } catch (error) {
    console.error("Error deleting RCM template:", error);
    return NextResponse.json(
      { error: "Failed to delete RCM template" },
      { status: 500 }
    );
  }
}
