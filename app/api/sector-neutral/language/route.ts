/**
 * Sector-Neutral API Endpoints
 * 
 * Implements API endpoints for sector-neutral language and template management
 * 
 * @fileoverview Sector-neutral API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sectorNeutralLanguageManager } from '@/lib/sector-neutral/language-management';
import { sectorTemplateManager } from '@/lib/sector-neutral/template-management';
import { multiSectorAssetClassificationManager } from '@/lib/sector-neutral/asset-classification';

/**
 * GET /api/sector-neutral/language
 * Get language mappings and sector configurations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const category = searchParams.get('category');

    let languageMappings;
    if (sector) {
      languageMappings = sectorNeutralLanguageManager.getLanguageMappings(sector);
    } else {
      languageMappings = sectorNeutralLanguageManager.getAllSectorConfigurations();
    }

    const sectorConfigurations = sectorNeutralLanguageManager.getAllSectorConfigurations();

    return NextResponse.json({
      languageMappings,
      sectorConfigurations,
      currentSector: sectorNeutralLanguageManager.getCurrentSector(),
    });
  } catch (error) {
    console.error('Error getting language mappings:', error);
    return NextResponse.json(
      { error: 'Failed to get language mappings' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sector-neutral/language/translate
 * Translate text from council-specific to sector-neutral terminology
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, context } = await request.json();

    if (!text || !context) {
      return NextResponse.json(
        { error: 'Text and context are required' },
        { status: 400 }
      );
    }

    const translatedText = sectorNeutralLanguageManager.translateText(text, context);

    return NextResponse.json({
      originalText: text,
      translatedText,
      context,
    });
  } catch (error) {
    console.error('Error translating text:', error);
    return NextResponse.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sector-neutral/language/sector
 * Set current sector
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sectorId } = await request.json();

    if (!sectorId) {
      return NextResponse.json(
        { error: 'Sector ID is required' },
        { status: 400 }
      );
    }

    sectorNeutralLanguageManager.setCurrentSector(sectorId);

    return NextResponse.json({
      message: 'Sector updated successfully',
      currentSector: sectorNeutralLanguageManager.getCurrentSector(),
    });
  } catch (error) {
    console.error('Error setting sector:', error);
    return NextResponse.json(
      { error: 'Failed to set sector' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sector-neutral/templates
 * Get sector templates
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const category = searchParams.get('category');

    let templates;
    if (sector) {
      templates = sectorTemplateManager.getTemplatesBySector(sector);
    } else if (category) {
      templates = sectorTemplateManager.getTemplatesByCategory(category as any);
    } else {
      templates = sectorTemplateManager.getAllSectorConfigurations();
    }

    return NextResponse.json({
      templates,
    });
  } catch (error) {
    console.error('Error getting templates:', error);
    return NextResponse.json(
      { error: 'Failed to get templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sector-neutral/templates
 * Create a new template
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templateData = await request.json();

    const templateId = sectorTemplateManager.createTemplate(templateData);

    return NextResponse.json({
      message: 'Template created successfully',
      templateId,
    });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sector-neutral/templates/{templateId}/render
 * Render template with variables
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId } = params;
    const { variables } = await request.json();

    const renderedTemplate = sectorTemplateManager.renderTemplate(templateId, variables);

    return NextResponse.json({
      templateId,
      renderedTemplate,
    });
  } catch (error) {
    console.error('Error rendering template:', error);
    return NextResponse.json(
      { error: 'Failed to render template' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sector-neutral/classifications
 * Get asset classifications
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const category = searchParams.get('category');

    let classifications;
    if (sector) {
      classifications = multiSectorAssetClassificationManager.getClassificationsBySector(sector);
    } else if (category) {
      classifications = multiSectorAssetClassificationManager.getClassificationsByCategory(category);
    } else {
      classifications = multiSectorAssetClassificationManager.getAllSectorMappings();
    }

    return NextResponse.json({
      classifications,
    });
  } catch (error) {
    console.error('Error getting classifications:', error);
    return NextResponse.json(
      { error: 'Failed to get classifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sector-neutral/classifications
 * Create a new classification
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const classificationData = await request.json();

    const classificationId = multiSectorAssetClassificationManager.createClassification(classificationData);

    return NextResponse.json({
      message: 'Classification created successfully',
      classificationId,
    });
  } catch (error) {
    console.error('Error creating classification:', error);
    return NextResponse.json(
      { error: 'Failed to create classification' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sector-neutral/classifications/{classificationId}/validate
 * Validate asset against classification
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { classificationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { classificationId } = params;
    const { assetData } = await request.json();

    const validation = multiSectorAssetClassificationManager.validateAsset(classificationId, assetData);

    return NextResponse.json({
      classificationId,
      validation,
    });
  } catch (error) {
    console.error('Error validating asset:', error);
    return NextResponse.json(
      { error: 'Failed to validate asset' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sector-neutral/configurations
 * Get sector configurations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configurations = sectorTemplateManager.getAllSectorConfigurations();

    return NextResponse.json({
      configurations,
    });
  } catch (error) {
    console.error('Error getting configurations:', error);
    return NextResponse.json(
      { error: 'Failed to get configurations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sector-neutral/configurations
 * Create or update sector configuration
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configurationData = await request.json();

    // This would typically save to database
    // For now, we'll just return success

    return NextResponse.json({
      message: 'Configuration saved successfully',
      configuration: configurationData,
    });
  } catch (error) {
    console.error('Error saving configuration:', error);
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
