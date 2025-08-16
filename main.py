#!/usr/bin/env python3
"""
HiveIDE MVP - Enhanced Main Application
AI-Powered Development Assistant with Multi-Agent Architecture
"""

import asyncio
import logging
import os
import sys
import time
from contextlib import asynccontextmanager
from typing import Dict, Any, List

import uvicorn
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from prometheus_fastapi_instrumentator import Instrumentator
import redis.asyncio as redis
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Core imports
from app.core.config import settings
from app.core.database import Base, get_db
from app.core.logging_config import setup_logging
from app.core.exceptions import setup_exception_handlers
from app.core.security import verify_token, get_current_user

# API routers
from app.api.v1.projects import router as projects_router
from app.api.v1.features import router as features_router
from app.api.v1.agents import router as agents_router
from app.api.v1.auth import router as auth_router
from app.api.v1.health import router as health_router

# Services
from app.services.agent_manager import AgentManager
from app.services.ollama_service import OllamaService
from app.services.redis_service import RedisService
from app.services.symbolect_service import SymbolectService
from app.services.code_generation_service import CodeGenerationService

# WebSocket
from app.websocket.connection_manager import ConnectionManager
from app.websocket.handlers import websocket_router

# Tasks
from app.tasks.feature_generation import process_feature_request
from app.tasks.code_analysis import analyze_code_quality

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Global services
agent_manager: AgentManager = None
ollama_service: OllamaService = None
redis_service: RedisService = None
connection_manager: ConnectionManager = None
symbolect_service: SymbolectService = None
code_generation_service: CodeGenerationService = None

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Enhanced application lifespan manager with comprehensive initialization"""
    logger.info("🚀 Starting HiveIDE MVP...")
    
    # Initialize database
    try:
        engine = create_async_engine(
            settings.database_url,
            echo=settings.debug,
            pool_pre_ping=True,
            pool_recycle=300
        )
        
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("✅ Database initialized")
        
        # Store engine for dependency injection
        app.state.db_engine = engine
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        sys.exit(1)
    
    # Initialize services
    global agent_manager, ollama_service, redis_service, connection_manager
    global symbolect_service, code_generation_service
    
    try:
        # Redis service
        redis_service = RedisService(settings.redis_url)
        await redis_service.connect()
        logger.info("✅ Redis connected")
        
        # Ollama service
        ollama_service = OllamaService(settings.ollama_url)
        await ollama_service.health_check()
        await ollama_service.ensure_models_loaded()
        logger.info("✅ Ollama service ready")
        
        # Symbolect service
        symbolect_service = SymbolectService()
        await symbolect_service.initialize()
        logger.info("✅ Symbolect engine initialized")
        
        # Code generation service
        code_generation_service = CodeGenerationService(
            ollama_service=ollama_service,
            symbolect_service=symbolect_service
        )
        logger.info("✅ Code generation service ready")
        
        # WebSocket connection manager
        connection_manager = ConnectionManager()
        
        # Agent manager
        agent_manager = AgentManager(
            redis_service=redis_service,
            ollama_service=ollama_service,
            symbolect_service=symbolect_service,
            code_generation_service=code_generation_service,
            connection_manager=connection_manager
        )
        await agent_manager.initialize()
        logger.info("✅ Agent manager initialized")
        
        # Store services in app state
        app.state.agent_manager = agent_manager
        app.state.ollama_service = ollama_service
        app.state.redis_service = redis_service
        app.state.connection_manager = connection_manager
        app.state.symbolect_service = symbolect_service
        app.state.code_generation_service = code_generation_service
        
        # Start background tasks
        asyncio.create_task(agent_manager.start_health_monitor())
        asyncio.create_task(connection_manager.start_heartbeat())
        asyncio.create_task(cleanup_old_tasks())
        
        logger.info("🎉 HiveIDE MVP started successfully!")
        
    except Exception as e:
        logger.error(f"❌ Service initialization failed: {e}")
        sys.exit(1)
    
    yield
    
    # Cleanup
    logger.info("🛑 Shutting down HiveIDE MVP...")
    
    try:
        if agent_manager:
            await agent_manager.shutdown()
        if redis_service:
            await redis_service.disconnect()
        if connection_manager:
            await connection_manager.disconnect_all()
        if hasattr(app.state, 'db_engine'):
            await app.state.db_engine.dispose()
            
        logger.info("✅ Shutdown complete")
    except Exception as e:
        logger.error(f"❌ Shutdown error: {e}")

async def cleanup_old_tasks():
    """Background task to clean up old data"""
    while True:
        try:
            await asyncio.sleep(3600)  # Run every hour
            if redis_service:
                await redis_service.cleanup_expired_keys()
            logger.debug("🧹 Cleanup completed")
        except Exception as e:
            logger.error(f"Cleanup error: {e}")

# Create FastAPI app
app = FastAPI(
    title="HiveIDE MVP",
    description="AI-Powered Development Assistant with Multi-Agent Architecture",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
    lifespan=lifespan
)

# Middleware setup
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not settings.debug:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.allowed_hosts
    )

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.3f}s"
    )
    
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Setup exception handlers
setup_exception_handlers(app)

# Prometheus metrics
if settings.enable_metrics:
    instrumentator = Instrumentator(
        should_group_status_codes=False,
        should_ignore_untemplated=True,
        should_respect_env_var=True,
        should_instrument_requests_inprogress=True,
        excluded_handlers=["/health", "/metrics"],
        env_var_name="ENABLE_METRICS",
        inprogress_name="inprogress",
        inprogress_labels=True,
    )
    instrumentator.instrument(app).expose(app)

# API Routes
app.include_router(health_router, prefix="/api/v1", tags=["health"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(
    projects_router, 
    prefix="/api/v1/projects", 
    tags=["projects"],
    dependencies=[Depends(get_current_user)]
)
app.include_router(
    features_router, 
    prefix="/api/v1/features", 
    tags=["features"],
    dependencies=[Depends(get_current_user)]
)
app.include_router(
    agents_router, 
    prefix="/api/v1/agents", 
    tags=["agents"],
    dependencies=[Depends(get_current_user)]
)

# WebSocket routes
app.include_router(websocket_router, prefix="/ws")

# Static files (for production)
if settings.serve_static:
    app.mount("/static", StaticFiles(directory="static"), name="static")
    app.mount("/", StaticFiles(directory="static", html=True), name="spa")

# Dependency injection helpers
async def get_agent_manager() -> AgentManager:
    """Get agent manager instance"""
    if not hasattr(app.state, 'agent_manager') or not app.state.agent_manager:
        raise HTTPException(status_code=503, detail="Agent manager not initialized")
    return app.state.agent_manager

async def get_ollama_service() -> OllamaService:
    """Get Ollama service instance"""
    if not hasattr(app.state, 'ollama_service') or not app.state.ollama_service:
        raise HTTPException(status_code=503, detail="Ollama service not available")
    return app.state.ollama_service

async def get_symbolect_service() -> SymbolectService:
    """Get Symbolect service instance"""
    if not hasattr(app.state, 'symbolect_service') or not app.state.symbolect_service:
        raise HTTPException(status_code=503, detail="Symbolect service not available")
    return app.state.symbolect_service

async def get_code_generation_service() -> CodeGenerationService:
    """Get Code Generation service instance"""
    if not hasattr(app.state, 'code_generation_service') or not app.state.code_generation_service:
        raise HTTPException(status_code=503, detail="Code generation service not available")
    return app.state.code_generation_service

# Root endpoint
@app.get("/")
async def root():
                health_status["metrics"]["active_agents"] = len(agent_status.get("active", []))
            health_status["metrics"]["total_tasks"] = agent_status.get("total_tasks", 0)
        except Exception as e:
            health_status["services"]["agents"] = f"unhealthy: {str(e)}"
            health_status["status"] = "degraded"
    
    # Add system metrics
    try:
        import psutil
        health_status["metrics"].update({
            "cpu_percent": psutil.cpu_percent(interval=0.1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_usage_percent": psutil.disk_usage('/').percent,
            "active_connections": len(app.state.connection_manager.active_connections) if hasattr(app.state, 'connection_manager') else 0
        })
    except ImportError:
        health_status["metrics"]["system"] = "psutil not available"
    
    return health_status

# System metrics endpoint
@app.get("/metrics/system")
async def system_metrics():
    """Detailed system performance metrics"""
    try:
        import psutil
        
        metrics = {
            "timestamp": time.time(),
            "system": {
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory": {
                    "total": psutil.virtual_memory().total,
                    "available": psutil.virtual_memory().available,
                    "percent": psutil.virtual_memory().percent,
                    "used": psutil.virtual_memory().used
                },
                "disk": {
                    "total": psutil.disk_usage('/').total,
                    "used": psutil.disk_usage('/').used,
                    "free": psutil.disk_usage('/').free,
                    "percent": psutil.disk_usage('/').percent
                }
            },
            "application": {
                "active_connections": len(app.state.connection_manager.active_connections) if hasattr(app.state, 'connection_manager') else 0,
                "agent_status": await app.state.agent_manager.get_metrics() if hasattr(app.state, 'agent_manager') else {},
                "uptime": time.time() - app.state.start_time if hasattr(app.state, 'start_time') else 0
            }
        }
        
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system metrics: {str(e)}")

# Development endpoints (only in debug mode)
if settings.debug:
    @app.post("/api/v1/dev/reset")
    async def reset_system():
        """Reset system state (development only)"""
        try:
            if hasattr(app.state, 'redis_service'):
                await app.state.redis_service.flushdb()
            if hasattr(app.state, 'agent_manager'):
                await app.state.agent_manager.reset_all_agents()
            return {"status": "reset_complete"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/v1/dev/logs")
    async def get_recent_logs():
        """Get recent application logs (development only)"""
        try:
            # This would read from log files in a real implementation
            return {"logs": ["Sample log entry 1", "Sample log entry 2"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Store start time
    import time
    start_time = time.time()
    
    # Development server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info" if settings.debug else "warning",
        access_log=settings.debug,
        workers=1 if settings.debug else 4,
        loop="uvloop" if not settings.debug else "asyncio"
    )
            health_status["metrics"]["active_agents"] = len(agent_status.get("active", []))
            health_status["metrics"]["total_tasks"] = agent_status.get("total_tasks", 0)
        except Exception as e:
            health_status["services"]["agents"] = f"unhealthy: {str(e)}"
            health_status["status"] = "degraded"
    
    # Add system metrics
    try:
        import psutil
        health_status["metrics"].update({
            "cpu_percent": psutil.cpu_percent(interval=0.1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_usage_percent": psutil.disk_usage('/').percent,
            "active_connections": len(app.state.connection_manager.active_connections) if hasattr(app.state, 'connection_manager') else 0
        })
    except ImportError:
        health_status["metrics"]["system"] = "psutil not available"
    
    return health_status

# System metrics endpoint
@app.get("/metrics/system")
async def system_metrics():
    """Detailed system performance metrics"""
    try:
        import psutil
        
        metrics = {
            "timestamp": time.time(),
            "system": {
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory": {
                    "total": psutil.virtual_memory().total,
                    "available": psutil.virtual_memory().available,
                    "percent": psutil.virtual_memory().percent,
                    "used": psutil.virtual_memory().used
                },
                "disk": {
                    "total": psutil.disk_usage('/').total,
                    "used": psutil.disk_usage('/').used,
                    "free": psutil.disk_usage('/').free,
                    "percent": psutil.disk_usage('/').percent
                }
            },
            "application": {
                "active_connections": len(app.state.connection_manager.active_connections) if hasattr(app.state, 'connection_manager') else 0,
                "agent_status": await app.state.agent_manager.get_metrics() if hasattr(app.state, 'agent_manager') else {},
                "uptime": time.time() - app.state.start_time if hasattr(app.state, 'start_time') else 0
            }
        }
        
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system metrics: {str(e)}")

# Development endpoints (only in debug mode)
if settings.debug:
    @app.post("/api/v1/dev/reset")
    async def reset_system():
        """Reset system state (development only)"""
        try:
            if hasattr(app.state, 'redis_service'):
                await app.state.redis_service.flushdb()
            if hasattr(app.state, 'agent_manager'):
                await app.state.agent_manager.reset_all_agents()
            return {"status": "reset_complete"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/v1/dev/logs")
    async def get_recent_logs():
        """Get recent application logs (development only)"""
        try:
            # This would read from log files in a real implementation
            return {"logs": ["Sample log entry 1", "Sample log entry 2"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Store start time
    import time
    start_time = time.time()
    
    # Development server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info" if settings.debug else "warning",
        access_log=settings.debug,
        workers=1 if settings.debug else 4,
        loop="uvloop" if not settings.debug else "asyncio"
    )