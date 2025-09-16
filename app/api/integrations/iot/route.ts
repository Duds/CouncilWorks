// app/api/integrations/iot/route.ts

import { NextResponse } from 'next/server';
import { IoTTelematicsIntegration, IoTConfig, IoTDevice, TelematicsData, SensorData } from '@/lib/integrations/iot-telematics-integration';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('assetId');
    const action = searchParams.get('action');

    if (action === 'monitoring' && assetId) {
      return await getRealTimeMonitoring(assetId);
    } else if (action === 'alerts') {
      return await getActiveAlerts();
    } else {
      return await getIoTStatus();
    }
  } catch (error) {
    console.error('Failed to get IoT data:', error);
    return NextResponse.json(
      { message: 'Failed to get IoT data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'registerDevice':
        return await registerDevice(data);
      case 'processTelematics':
        return await processTelematicsData(data);
      case 'processSensor':
        return await processSensorData(data);
      case 'acknowledgeAlert':
        return await acknowledgeAlert(data.alertId, data.acknowledgedBy);
      case 'resolveAlert':
        return await resolveAlert(data.alertId, data.resolution);
      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('IoT request failed:', error);
    return NextResponse.json(
      { message: 'IoT request failed' },
      { status: 500 }
    );
  }
}

async function getIoTStatus() {
  // Mock IoT status
  return NextResponse.json({
    status: 'active',
    devicesOnline: 15,
    devicesOffline: 2,
    activeAlerts: 3,
    dataPointsProcessed: 1250,
    lastUpdate: new Date().toISOString(),
  });
}

async function getRealTimeMonitoring(assetId: string) {
  try {
    // Mock IoT configuration
    const config: IoTConfig = {
      mqttBroker: {
        host: 'mqtt.example.com',
        port: 8883,
        username: 'aegrid',
        password: 'password',
        ssl: true,
      },
      dataProcessing: {
        batchSize: 100,
        processingInterval: 5000,
        retentionDays: 90,
      },
      alerting: {
        enabled: true,
        channels: ['email', 'sms'],
        thresholds: {
          temperature: { high: 80, critical: 100 },
          pressure: { high: 10, critical: 15 },
          vibration: { high: 5, critical: 10 },
        },
      },
    };

    const iotIntegration = new IoTTelematicsIntegration(config);
    await iotIntegration.initialize();

    const monitoringData = await iotIntegration.getRealTimeMonitoringData(assetId);

    return NextResponse.json({
      assetId,
      monitoringData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Failed to get monitoring data for asset ${assetId}:`, error);
    return NextResponse.json(
      { message: `Failed to get monitoring data for asset ${assetId}` },
      { status: 500 }
    );
  }
}

async function getActiveAlerts() {
  try {
    // Mock IoT configuration
    const config: IoTConfig = {
      mqttBroker: {
        host: 'mqtt.example.com',
        port: 8883,
        username: 'aegrid',
        password: 'password',
        ssl: true,
      },
      dataProcessing: {
        batchSize: 100,
        processingInterval: 5000,
        retentionDays: 90,
      },
      alerting: {
        enabled: true,
        channels: ['email', 'sms'],
        thresholds: {
          temperature: { high: 80, critical: 100 },
          pressure: { high: 10, critical: 15 },
          vibration: { high: 5, critical: 10 },
        },
      },
    };

    const iotIntegration = new IoTTelematicsIntegration(config);
    await iotIntegration.initialize();

    const activeAlerts = iotIntegration.getActiveAlerts();

    return NextResponse.json({
      alerts: activeAlerts,
      count: activeAlerts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to get active alerts:', error);
    return NextResponse.json(
      { message: 'Failed to get active alerts' },
      { status: 500 }
    );
  }
}

async function registerDevice(deviceData: IoTDevice) {
  try {
    // Mock IoT configuration
    const config: IoTConfig = {
      mqttBroker: {
        host: 'mqtt.example.com',
        port: 8883,
        username: 'aegrid',
        password: 'password',
        ssl: true,
      },
      dataProcessing: {
        batchSize: 100,
        processingInterval: 5000,
        retentionDays: 90,
      },
      alerting: {
        enabled: true,
        channels: ['email', 'sms'],
        thresholds: {
          temperature: { high: 80, critical: 100 },
          pressure: { high: 10, critical: 15 },
          vibration: { high: 5, critical: 10 },
        },
      },
    };

    const iotIntegration = new IoTTelematicsIntegration(config);
    await iotIntegration.initialize();

    const success = await iotIntegration.registerDevice(deviceData);

    if (success) {
      return NextResponse.json({
        message: 'Device registered successfully',
        deviceId: deviceData.deviceId,
        status: 'registered',
      });
    } else {
      return NextResponse.json(
        { message: 'Failed to register device' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to register device:', error);
    return NextResponse.json(
      { message: 'Failed to register device' },
      { status: 500 }
    );
  }
}

async function processTelematicsData(data: TelematicsData) {
  try {
    // Mock IoT configuration
    const config: IoTConfig = {
      mqttBroker: {
        host: 'mqtt.example.com',
        port: 8883,
        username: 'aegrid',
        password: 'password',
        ssl: true,
      },
      dataProcessing: {
        batchSize: 100,
        processingInterval: 5000,
        retentionDays: 90,
      },
      alerting: {
        enabled: true,
        channels: ['email', 'sms'],
        thresholds: {
          temperature: { high: 80, critical: 100 },
          pressure: { high: 10, critical: 15 },
          vibration: { high: 5, critical: 10 },
        },
      },
    };

    const iotIntegration = new IoTTelematicsIntegration(config);
    await iotIntegration.initialize();

    await iotIntegration.processTelematicsData(data);

    return NextResponse.json({
      message: 'Telematics data processed successfully',
      deviceId: data.deviceId,
      assetId: data.assetId,
      timestamp: data.timestamp,
    });
  } catch (error) {
    console.error('Failed to process telematics data:', error);
    return NextResponse.json(
      { message: 'Failed to process telematics data' },
      { status: 500 }
    );
  }
}

async function processSensorData(data: SensorData) {
  try {
    // Mock IoT configuration
    const config: IoTConfig = {
      mqttBroker: {
        host: 'mqtt.example.com',
        port: 8883,
        username: 'aegrid',
        password: 'password',
        ssl: true,
      },
      dataProcessing: {
        batchSize: 100,
        processingInterval: 5000,
        retentionDays: 90,
      },
      alerting: {
        enabled: true,
        channels: ['email', 'sms'],
        thresholds: {
          temperature: { high: 80, critical: 100 },
          pressure: { high: 10, critical: 15 },
          vibration: { high: 5, critical: 10 },
        },
      },
    };

    const iotIntegration = new IoTTelematicsIntegration(config);
    await iotIntegration.initialize();

    await iotIntegration.processSensorData(data);

    return NextResponse.json({
      message: 'Sensor data processed successfully',
      deviceId: data.deviceId,
      assetId: data.assetId,
      sensorType: data.sensorType,
      timestamp: data.timestamp,
    });
  } catch (error) {
    console.error('Failed to process sensor data:', error);
    return NextResponse.json(
      { message: 'Failed to process sensor data' },
      { status: 500 }
    );
  }
}

async function acknowledgeAlert(alertId: string, acknowledgedBy: string) {
  try {
    // Mock IoT configuration
    const config: IoTConfig = {
      mqttBroker: {
        host: 'mqtt.example.com',
        port: 8883,
        username: 'aegrid',
        password: 'password',
        ssl: true,
      },
      dataProcessing: {
        batchSize: 100,
        processingInterval: 5000,
        retentionDays: 90,
      },
      alerting: {
        enabled: true,
        channels: ['email', 'sms'],
        thresholds: {
          temperature: { high: 80, critical: 100 },
          pressure: { high: 10, critical: 15 },
          vibration: { high: 5, critical: 10 },
        },
      },
    };

    const iotIntegration = new IoTTelematicsIntegration(config);
    await iotIntegration.initialize();

    const success = await iotIntegration.acknowledgeAlert(alertId, acknowledgedBy);

    if (success) {
      return NextResponse.json({
        message: 'Alert acknowledged successfully',
        alertId,
        acknowledgedBy,
        acknowledgedAt: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { message: 'Failed to acknowledge alert' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to acknowledge alert:', error);
    return NextResponse.json(
      { message: 'Failed to acknowledge alert' },
      { status: 500 }
    );
  }
}

async function resolveAlert(alertId: string, resolution: string) {
  try {
    // Mock IoT configuration
    const config: IoTConfig = {
      mqttBroker: {
        host: 'mqtt.example.com',
        port: 8883,
        username: 'aegrid',
        password: 'password',
        ssl: true,
      },
      dataProcessing: {
        batchSize: 100,
        processingInterval: 5000,
        retentionDays: 90,
      },
      alerting: {
        enabled: true,
        channels: ['email', 'sms'],
        thresholds: {
          temperature: { high: 80, critical: 100 },
          pressure: { high: 10, critical: 15 },
          vibration: { high: 5, critical: 10 },
        },
      },
    };

    const iotIntegration = new IoTTelematicsIntegration(config);
    await iotIntegration.initialize();

    const success = await iotIntegration.resolveAlert(alertId, resolution);

    if (success) {
      return NextResponse.json({
        message: 'Alert resolved successfully',
        alertId,
        resolution,
        resolvedAt: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { message: 'Failed to resolve alert' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to resolve alert:', error);
    return NextResponse.json(
      { message: 'Failed to resolve alert' },
      { status: 500 }
    );
  }
}
