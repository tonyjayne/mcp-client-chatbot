import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    // Basic health check - ensure the application is responding
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      port: process.env.PORT || "3000",
    };

    // Optional: Add database connectivity check
    // This is commented out to avoid dependencies, but can be enabled if needed
    /*
    try {
      // Add your database health check here
      // const dbStatus = await checkDatabaseConnection();
      // health.database = dbStatus;
    } catch (error) {
      health.database = 'unhealthy';
      health.status = 'degraded';
    }
    */

    return NextResponse.json(health, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
