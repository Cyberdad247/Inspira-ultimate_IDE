"""
Enhanced Symbolect Engine v2.0
Advanced symbolic compression and natural language processing
"""

import re
import json
import asyncio
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from enum import Enum
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class SymbolCategory(Enum):
    SECURITY = "security"
    UI = "ui"
    DATA = "data"
    OPERATION = "operation"
    SYSTEM = "system"
    VALIDATION = "validation"
    COMMUNICATION = "communication"
    FLOW = "flow"
    ARCHITECTURE = "architecture"

@dataclass
class Symbol:
    glyph: str
    meaning: str
    category: SymbolCategory
    confidence: float
    weight: float = 1.0
    source: str = "direct"
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}

@dataclass
class FlowPattern:
    pattern: re.Pattern
    symbols: List[str]
    flow: str
    description: str
    confidence: float = 0.8

@dataclass
class CompressionResult:
    original_text: str
    compressed: str
    symbols: List[Symbol]
    compression_ratio: float
    confidence: float
    metadata: Dict[str, Any]

class SymbolectEngine:
    """Enhanced Symbolect Engine with advanced pattern recognition"""
    
    def __init__(self):
        self.symbol_map = self._initialize_symbol_map()
        self.flow_patterns = self._initialize_flow_patterns()
        self.contextual_rules = self._initialize_contextual_rules()
        self.compression_cache = {}
        
    def _initialize_symbol_map(self) -> Dict[str, Symbol]:
        """Initialize comprehensive symbol mapping"""
        symbols = {
            # Authentication & Security
            'authentication': Symbol('🔐', 'authentication', SymbolCategory.SECURITY, 0.9, 1.0),
            'login': Symbol('🚪', 'login', SymbolCategory.SECURITY, 0.8, 0.9),
            'password': Symbol('🔑', 'password', SymbolCategory.SECURITY, 0.8, 0.9),
            'security': Symbol('🛡️', 'security', SymbolCategory.SECURITY, 0.9, 1.0),
            'encryption': Symbol('🔒', 'encryption', SymbolCategory.SECURITY, 0.8, 0.9),
            'token': Symbol('🎫', 'token', SymbolCategory.SECURITY, 0.7, 0.8),
            'oauth': Symbol('🔗🔐', 'oauth', SymbolCategory.SECURITY, 0.8, 0.9),
            'jwt': Symbol('🎫🔐', 'jwt', SymbolCategory.SECURITY, 0.8, 0.9),
            
            # User Interface
            'user': Symbol('👤', 'user', SymbolCategory.UI, 0.7, 0.8),
            'form': Symbol('📝', 'form', SymbolCategory.UI, 0.8, 0.9),
            'button': Symbol('🔘', 'button', SymbolCategory.UI, 0.6, 0.7),
            'modal': Symbol('🪟', 'modal', SymbolCategory.UI, 0.7, 0.8),
            'dropdown': Symbol('🔽', 'dropdown', SymbolCategory.UI, 0.6, 0.7),
            'navigation': Symbol('🧭', 'navigation', SymbolCategory.UI, 0.7, 0.8),
            'menu': Symbol('☰', 'menu', SymbolCategory.UI, 0.6, 0.7),
            'dashboard': Symbol('📊', 'dashboard', SymbolCategory.UI, 0.8, 0.9),
            'sidebar': Symbol('📋', 'sidebar', SymbolCategory.UI, 0.6, 0.7),
            'header': Symbol('🏷️', 'header', SymbolCategory.UI, 0.6, 0.7),
            'footer': Symbol('📄', 'footer', SymbolCategory.UI, 0.6, 0.7),
            
            # Data & Storage
            'database': Symbol('🗄️', 'database', SymbolCategory.DATA, 0.9, 1.0),
            'api': Symbol('🔌', 'api', SymbolCategory.DATA, 0.8, 0.9),
            'storage': Symbol('💾', 'storage', SymbolCategory.DATA, 0.7, 0.8),
            'cache': Symbol('⚡', 'cache', SymbolCategory.DATA, 0.6, 0.7),
            'backup': Symbol('💿', 'backup', SymbolCategory.DATA, 0.7, 0.8),
            'sync': Symbol('🔄', 'sync', SymbolCategory.DATA, 0.7, 0.8),
            'migration': Symbol('🚚', 'migration', SymbolCategory.DATA, 0.8, 0.9),
            
            # Operations (CRUD)
            'create': Symbol('➕', 'create', SymbolCategory.OPERATION, 0.8, 0.9),
            'read': Symbol('👁️', 'read', SymbolCategory.OPERATION, 0.7, 0.8),
            'update': Symbol('🔄', 'update', SymbolCategory.OPERATION, 0.8, 0.9),
            'delete': Symbol('🗑️', 'delete', SymbolCategory.OPERATION, 0.8, 0.9),
            'search': Symbol('🔍', 'search', SymbolCategory.OPERATION, 0.7, 0.8),
            'filter': Symbol('🔽', 'filter', SymbolCategory.OPERATION, 0.6, 0.7),
            'sort': Symbol('📊', 'sort', SymbolCategory.OPERATION, 0.6, 0.7),
            'export': Symbol('📤', 'export', SymbolCategory.OPERATION, 0.7, 0.8),
            'import': Symbol('📥', 'import', SymbolCategory.OPERATION, 0.7, 0.8),
            
            # System & Architecture
            'frontend': Symbol('🖥️', 'frontend', SymbolCategory.SYSTEM, 0.8, 0.9),
            'backend': Symbol('⚙️', 'backend', SymbolCategory.SYSTEM, 0.8, 0.9),
            'server': Symbol('🖥️', 'server', SymbolCategory.SYSTEM, 0.7, 0.8),
            'client': Symbol('💻', 'client', SymbolCategory.SYSTEM, 0.7, 0.8),
            'microservice': Symbol('🔗', 'microservice', SymbolCategory.SYSTEM, 0.8, 0.9),
            'container': Symbol('📦', 'container', SymbolCategory.SYSTEM, 0.7, 0.8),
            'deployment': Symbol('🚀', 'deployment', SymbolCategory.SYSTEM, 0.8, 0.9),
            
            # Validation & Testing
            'validation': Symbol('✅', 'validation', SymbolCategory.VALIDATION, 0.7, 0.8),
            'test': Symbol('🧪', 'test', SymbolCategory.VALIDATION, 0.8, 0.9),
            'error': Symbol('❌', 'error', SymbolCategory.VALIDATION, 0.6, 0.7),
            'success': Symbol('✨', 'success', SymbolCategory.VALIDATION, 0.6, 0.7),
            'loading': Symbol('⏳', 'loading', SymbolCategory.VALIDATION, 0.5, 0.6),
            'warning': Symbol('⚠️', 'warning', SymbolCategory.VALIDATION, 0.6, 0.7),
            
            # Communication
            'email': Symbol('📧', 'email', SymbolCategory.COMMUNICATION, 0.7, 0.8),
            'notification': Symbol('🔔', 'notification', SymbolCategory.COMMUNICATION, 0.7, 0.8),
            'message': Symbol('💬', 'message', SymbolCategory.COMMUNICATION, 0.6, 0.7),
            'chat': Symbol('💭', 'chat', SymbolCategory.COMMUNICATION, 0.7, 0.8),
            'webhook': Symbol('🪝', 'webhook', SymbolCategory.COMMUNICATION, 0.8, 0.9),
            
            # Business Logic
            'payment': Symbol('💳', 'payment', SymbolCategory.OPERATION, 0.8, 0.9),
            'order': Symbol('🛒', 'order', SymbolCategory.OPERATION, 0.7, 0.8),
            'invoice': Symbol('🧾', 'invoice', SymbolCategory.OPERATION, 0.7, 0.8),
            'report': Symbol('📈', 'report', SymbolCategory.OPERATION, 0.7, 0.8),
            'analytics': Symbol('📊', 'analytics', SymbolCategory.OPERATION, 0.8, 0.9),
        }
        
        return symbols
    
    def _initialize_flow_patterns(self) -> List[FlowPattern]:
        """Initialize flow pattern recognition"""
        return [
            FlowPattern(
                re.compile(r'login|auth|sign.?in|authenticate', re.IGNORECASE),
                ['🔐', '👤', '🚪'],
                '🔐→👤→✅',
                'Authentication Flow',
                0.9
            ),
            FlowPattern(
                re.compile(r'form|submit|save|create', re.IGNORECASE),
                ['📝', '💾', '✅'],
                '📝→💾→✅',
                'Form Submission Flow',
                0.8
            ),
            FlowPattern(
                re.compile(r'search|find|query|lookup', re.IGNORECASE),
                ['🔍', '🗄️', '📊'],
                '🔍→🗄️→📊',
                'Search & Retrieval Flow',
                0.8
            ),
            FlowPattern(
                re.compile(r'crud|create|read|update|delete', re.IGNORECASE),
                ['➕', '👁️', '🔄', '🗑️'],
                '➕→👁️→🔄→🗑️',
                'CRUD Operations Flow',
                0.9
            ),
            FlowPattern(
                re.compile(r'payment|checkout|purchase|buy', re.IGNORECASE),
                ['💳', '🛒', '✅'],
                '💳→🛒→✅',
                'Payment Flow',
                0.9
            ),
            FlowPattern(
                re.compile(r'upload|file|document|attachment', re.IGNORECASE),
                ['📤', '📁', '💾'],
                '📤→📁→💾',
                'File Upload Flow',
                0.8
            ),
            FlowPattern(
                re.compile(r'real.?time|live|streaming|websocket', re.IGNORECASE),
                ['⚡', '🔄', '📡'],
                '⚡→🔄→📡',
                'Real-time Communication Flow',
                0.8
            ),
            FlowPattern(
                re.compile(r'user.?management|admin|permissions', re.IGNORECASE),
                ['👥', '⚙️', '🛡️
                ['👥', '⚙️', '🛡️'],
                '👥→⚙️→🛡️',
                'User Management Flow',
                0.8
            ),
            FlowPattern(
                re.compile(r'notification|alert|email|message', re.IGNORECASE),
                ['🔔', '📧', '💬'],
                '🔔→📧→💬',
                'Notification Flow',
                0.7
            ),
            FlowPattern(
                re.compile(r'api|endpoint|service|microservice', re.IGNORECASE),
                ['🔌', '⚙️', '🌐'],
                '🔌→⚙️→🌐',
                'API Service Flow',
                0.8
            )
        ]
    
    def _initialize_contextual_rules(self) -> Dict[str, List[str]]:
        """Initialize contextual enhancement rules"""
        return {
            'user_management': ['user', 'admin', 'role', 'permission'],
            'authentication_system': ['login', 'password', 'token', 'security'],
            'data_processing': ['database', 'api', 'storage', 'cache'],
            'ui_components': ['form', 'button', 'modal', 'navigation'],
            'real_time_features': ['websocket', 'live', 'streaming', 'notification'],
            'payment_system': ['payment', 'checkout', 'invoice', 'order'],
            'file_management': ['upload', 'download', 'storage', 'backup'],
            'analytics_dashboard': ['report', 'analytics', 'chart', 'metrics']
        }
    
    async def compress(self, text: str, context: Optional[Dict] = None) -> CompressionResult:
        """
        Main compression method with enhanced pattern recognition
        """
        if not text or len(text.strip()) < 3:
            return CompressionResult(
                original_text=text,
                compressed="",
                symbols=[],
                compression_ratio=0.0,
                confidence=0.0,
                metadata={"error": "Input too short"}
            )
        
        # Check cache first
        cache_key = self._generate_cache_key(text, context)
        if cache_key in self.compression_cache:
            logger.debug(f"Cache hit for: {text[:50]}...")
            return self.compression_cache[cache_key]
        
        try:
            # Stage 1: Direct symbol detection
            direct_symbols = await self._detect_direct_symbols(text)
            
            # Stage 2: Flow pattern recognition
            flow_symbols = await self._detect_flow_patterns(text)
            
            # Stage 3: Contextual enhancement
            contextual_symbols = await self._enhance_with_context(text, direct_symbols, context)
            
            # Stage 4: Combine and optimize
            all_symbols = direct_symbols + flow_symbols + contextual_symbols
            optimized_symbols = self._optimize_symbols(all_symbols)
            
            # Stage 5: Generate compressed representation
            compressed = self._generate_compressed_string(optimized_symbols)
            
            # Calculate metrics
            compression_ratio = self._calculate_compression_ratio(text, compressed)
            confidence = self._calculate_confidence(optimized_symbols, text)
            
            result = CompressionResult(
                original_text=text,
                compressed=compressed,
                symbols=optimized_symbols,
                compression_ratio=compression_ratio,
                confidence=confidence,
                metadata={
                    "processing_stages": 5,
                    "direct_symbols": len(direct_symbols),
                    "flow_symbols": len(flow_symbols),
                    "contextual_symbols": len(contextual_symbols),
                    "optimization_applied": len(all_symbols) != len(optimized_symbols)
                }
            )
            
            # Cache result
            self.compression_cache[cache_key] = result
            
            return result
            
        except Exception as e:
            logger.error(f"Compression error: {e}")
            return CompressionResult(
                original_text=text,
                compressed="",
                symbols=[],
                compression_ratio=0.0,
                confidence=0.0,
                metadata={"error": str(e)}
            )
    
    async def _detect_direct_symbols(self, text: str) -> List[Symbol]:
        """Detect symbols through direct word matching"""
        symbols = []
        words = re.findall(r'\b\w+\b', text.lower())
        
        for word in words:
            # Clean word
            clean_word = re.sub(r'[^\w]', '', word)
            
            if clean_word in self.symbol_map:
                symbol = self.symbol_map[clean_word]
                # Create a copy with source information
                detected_symbol = Symbol(
                    glyph=symbol.glyph,
                    meaning=symbol.meaning,
                    category=symbol.category,
                    confidence=symbol.confidence + (0.1 * word.count(clean_word)),
                    weight=symbol.weight,
                    source="direct",
                    metadata={"matched_word": word, "position": text.lower().find(word)}
                )
                symbols.append(detected_symbol)
        
        return symbols
    
    async def _detect_flow_patterns(self, text: str) -> List[Symbol]:
        """Detect complex flow patterns"""
        symbols = []
        
        for pattern in self.flow_patterns:
            if pattern.pattern.search(text):
                flow_symbol = Symbol(
                    glyph=pattern.flow,
                    meaning=pattern.description,
                    category=SymbolCategory.FLOW,
                    confidence=pattern.confidence,
                    weight=1.0,
                    source="pattern",
                    metadata={
                        "pattern_type": "flow",
                        "component_symbols": pattern.symbols,
                        "matched_pattern": pattern.pattern.pattern
                    }
                )
                symbols.append(flow_symbol)
        
        return symbols
    
    async def _enhance_with_context(self, text: str, existing_symbols: List[Symbol], context: Optional[Dict]) -> List[Symbol]:
        """Add contextual symbols based on combinations and context"""
        symbols = []
        text_lower = text.lower()
        
        # Contextual combinations
        contextual_combinations = [
            (['user', 'management'], '👥→⚙️', 'user_management_system', 0.9),
            (['real', 'time'], '⚡→🔄', 'real_time_updates', 0.85),
            (['dark', 'mode'], '🌙→🎨', 'dark_mode_theme', 0.8),
            (['file', 'upload'], '📤→📁', 'file_upload_system', 0.8),
            (['data', 'visualization'], '📊→📈', 'data_visualization', 0.8),
            (['shopping', 'cart'], '🛒→💳', 'shopping_cart_system', 0.85),
            (['two', 'factor', 'auth'], '🔐→📱', 'two_factor_authentication', 0.9),
            (['machine', 'learning'], '🤖→🧠', 'machine_learning_system', 0.9)
        ]
        
        for keywords, glyph, meaning, confidence in contextual_combinations:
            if all(keyword in text_lower for keyword in keywords):
                contextual_symbol = Symbol(
                    glyph=glyph,
                    meaning=meaning,
                    category=SymbolCategory.SYSTEM,
                    confidence=confidence,
                    weight=1.0,
                    source="contextual",
                    metadata={"keywords": keywords, "combination_type": "contextual"}
                )
                symbols.append(contextual_symbol)
        
        # Context-based enhancement
        if context:
            project_type = context.get('project_type', '')
            if 'ecommerce' in project_type.lower():
                symbols.append(Symbol(
                    '🛒→💳→📦',
                    'ecommerce_workflow',
                    SymbolCategory.FLOW,
                    0.8,
                    source="context"
                ))
            elif 'dashboard' in project_type.lower():
                symbols.append(Symbol(
                    '📊→📈→🎯',
                    'dashboard_analytics',
                    SymbolCategory.FLOW,
                    0.8,
                    source="context"
                ))
        
        return symbols
    
    def _optimize_symbols(self, symbols: List[Symbol]) -> List[Symbol]:
        """Remove duplicates and optimize symbol list"""
        # Remove exact duplicates
        unique_symbols = []
        seen_glyphs = set()
        
        for symbol in symbols:
            if symbol.glyph not in seen_glyphs:
                unique_symbols.append(symbol)
                seen_glyphs.add(symbol.glyph)
        
        # Sort by confidence and weight
        unique_symbols.sort(key=lambda s: (s.confidence * s.weight), reverse=True)
        
        # Limit to top symbols to avoid over-compression
        max_symbols = 15
        if len(unique_symbols) > max_symbols:
            unique_symbols = unique_symbols[:max_symbols]
        
        return unique_symbols
    
    def _generate_compressed_string(self, symbols: List[Symbol]) -> str:
        """Generate the final compressed string representation"""
        if not symbols:
            return ""
        
        # Separate flow symbols from individual symbols
        flow_symbols = [s for s in symbols if s.category == SymbolCategory.FLOW]
        individual_symbols = [s for s in symbols if s.category != SymbolCategory.FLOW]
        
        # Build compressed string
        parts = []
        
        # Add individual symbols
        if individual_symbols:
            individual_glyphs = [s.glyph for s in individual_symbols]
            parts.append('⨹'.join(individual_glyphs))
        
        # Add flow symbols
        for flow_symbol in flow_symbols:
            parts.append(flow_symbol.glyph)
        
        return '⨹'.join(parts) if len(parts) > 1 else (parts[0] if parts else "")
    
    def _calculate_compression_ratio(self, original: str, compressed: str) -> float:
        """Calculate compression ratio as percentage"""
        if not original:
            return 0.0
        
        original_length = len(original)
        compressed_length = len(compressed)
        
        if compressed_length >= original_length:
            return 0.0
        
        return round((1 - compressed_length / original_length) * 100, 2)
    
    def _calculate_confidence(self, symbols: List[Symbol], original_text: str) -> float:
        """Calculate overall confidence score"""
        if not symbols:
            return 0.0
        
        # Base confidence from symbol confidences
        total_confidence = sum(s.confidence * s.weight for s in symbols)
        weighted_confidence = total_confidence / len(symbols)
        
        # Adjust based on coverage
        words_in_text = len(re.findall(r'\b\w+\b', original_text.lower()))
        coverage_ratio = min(len(symbols) / max(words_in_text * 0.3, 1), 1.0)
        
        # Final confidence
        final_confidence = weighted_confidence * (0.7 + 0.3 * coverage_ratio)
        
        return round(min(final_confidence, 1.0), 3)
    
    def _generate_cache_key(self, text: str, context: Optional[Dict]) -> str:
        """Generate cache key for compression results"""
        import hashlib
        
        context_str = json.dumps(context, sort_keys=True) if context else ""
        combined = f"{text}|{context_str}"
        
        return hashlib.md5(combined.encode()).hexdigest()
    
    async def decompress(self, compressed: str, context: Optional[Dict] = None) -> str:
        """Decompress symbolic representation back to natural language"""
        if not compressed:
            return ""
        
        try:
            # Split compressed string
            parts = compressed.split('⨹')
            descriptions = []
            
            # Reverse lookup symbols
            glyph_to_symbol = {s.glyph: s for s in self.symbol_map.values()}
            
            for part in parts:
                if '→' in part:
                    # Flow symbol
                    descriptions.append(f"Flow: {part}")
                elif part in glyph_to_symbol:
                    symbol = glyph_to_symbol[part]
                    descriptions.append(symbol.meaning)
                else:
                    # Try to find partial matches
                    for glyph, symbol in glyph_to_symbol.items():
                        if part in glyph:
                            descriptions.append(f"{symbol.meaning} (partial)")
                            break
                    else:
                        descriptions.append(f"Unknown: {part}")
            
            return " + ".join(descriptions)
            
        except Exception as e:
            logger.error(f"Decompression error: {e}")
            return f"Decompression failed: {compressed}"
    
    async def get_symbol_stats(self) -> Dict[str, Any]:
        """Get statistics about the symbol system"""
        category_counts = {}
        for symbol in self.symbol_map.values():
            category = symbol.category.value
            category_counts[category] = category_counts.get(category, 0) + 1
        
        return {
            "total_symbols": len(self.symbol_map),
            "categories": category_counts,
            "flow_patterns": len(self.flow_patterns),
            "contextual_rules": len(self.contextual_rules),
            "cache_size": len(self.compression_cache)
        }
    
    def clear_cache(self):
        """Clear the compression cache"""
        self.compression_cache.clear()
        logger.info("Symbolect cache cleared")

# Service wrapper for dependency injection
class SymbolectService:
    """Service wrapper for the Symbolect engine"""
    
    def __init__(self):
        self.engine = SymbolectEngine()
        self._initialized = False
    
    async def initialize(self):
        """Initialize the service"""
        if not self._initialized:
            logger.info("Initializing Symbolect service...")
            # Any async initialization can go here
            self._initialized = True
            logger.info("✅ Symbolect service initialized")
    
    async def compress_text(self, text: str, context: Optional[Dict] = None) -> CompressionResult:
        """Compress natural language text to symbols"""
        if not self._initialized:
            await self.initialize()
        
        return await self.engine.compress(text, context)
    
    async def decompress_symbols(self, compressed: str, context: Optional[Dict] = None) -> str:
        """Decompress symbols back to natural language"""
        if not self._initialized:
            await self.initialize()
        
        return await self.engine.decompress(compressed, context)
    
    async def get_statistics(self) -> Dict[str, Any]:
        """Get engine statistics"""
        if not self._initialized:
            await self.initialize()
        
        return await self.engine.get_symbol_stats()
    
    def clear_cache(self):
        """Clear compression cache"""
        self.engine.clear_cache()