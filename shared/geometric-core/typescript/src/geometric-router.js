/**
 * ●▼▲◼ Geometric Router - FIELD Symbol-Based Routing System
 *
 * The geometric symbols (●▼▲◼) act as miniature routers that guide
 * data flow through the S0→S7 FIELD architecture. Each symbol marks
 * a specific stage or vertex in the spinning top geometry.
 *
 * ## Routing Symbols
 *
 * ### Primary Stages
 * - ◻ S0 Akron: Gateway/Intake - All inputs enter here
 * - 🔷 S1 Queen's: Validation - Coherence filtering
 * - 🎭 S2 Gallery: Routing - Signal distribution
 * - ◼ S4 DOJO/King's: Synthesis - Spin reversal at φ⁻¹
 * - 🧠 S5 Archive: Crystallization - Wisdom storage
 * - ● S6 OBI-WAN: Validation - Final witness check
 * - 👑 S7 Crown: Manifestation - Output delivery
 *
 * ### Vertices (S3 Trident)
 * - ● Observation: Evidence collection (963 Hz)
 * - ▼ Temporal: Framework validation (432 Hz)
 * - ▲ Pattern: Pattern matching (528 Hz)
 *
 * ## Usage in Files
 *
 * Each file should declare its geometric router symbol in the header:
 *
 * ```typescript
 * /**
 *  * ◼ Module Name
 *  *
 *  * Description
 *  *
 *  * @geometric-router ◼
 *  * @stage S4
 *  *\/
 * ```
 *
 * ## Usage in Directories
 *
 * Directory names should include routing symbols:
 * - `◻-intake/` - S0 intake handlers
 * - `●▼▲-vertices/` - S3 vertex processors
 * - `◼-synthesis/` - S4 synthesis/DOJO
 * - `👑-output/` - S7 manifestation
 *
 * ## Routing Logic
 *
 * The symbols enable automatic routing based on data stage:
 *
 * 1. **Intake (◻)**: All data flows through S0 first
 * 2. **Validation (🔷)**: S1 checks coherence ≥0.70
 * 3. **Distribution (🎭)**: S2 routes to appropriate vertices
 * 4. **Processing (●▼▲)**: S3 vertices process in parallel
 * 5. **Synthesis (◼)**: S4 converges at apex, spin reversal
 * 6. **Archive (🧠)**: S5 crystallizes wisdom
 * 7. **Validation (●)**: S6 witness check
 * 8. **Output (👑)**: S7 manifests result
 *
 * ## Implementation
 *
 * @example
 * ```typescript
 * import { routeBySymbol } from './geometric-router'
 *
 * // Route data based on its current stage
 * const nextHandler = routeBySymbol(data.stage)
 * const result = await nextHandler(data)
 * ```
 *
 * @geometric-router ●▼▲◼
 * @module router
 */
/**
 * Canonical routing table for S0→S7 pipeline
 */
export const GEOMETRIC_ROUTES = {
    S0: { symbol: '♦︎', stage: 'S0', frequency: 396, handler: 's0-akron-intake' },
    S1: { symbol: '🔷', stage: 'S1', handler: 's1-queens-validation' },
    S2: { symbol: '🎭', stage: 'S2', handler: 's2-vertex-router' },
    S3: { symbol: '●', stage: 'S3', frequency: 963, handler: 's3-gallery-amplifier' },
    S4: { symbol: '◼', stage: 'S4', frequency: 741, handler: 's4-kings-chamber' },
    S5: { symbol: '🧠', stage: 'S5', frequency: 852, handler: 's5-archive-crystallizer' },
    S6: { symbol: '●', stage: 'S6', frequency: 963, handler: 's6-dojo-validator' },
    S7: { symbol: '👑', stage: 'S7', handler: 's7-crown-manifest' },
};
/**
 * S3 Vertex routing table
 */
export const VERTEX_ROUTES = {
    OBSERVATION: { symbol: '●', frequency: 963, handler: 'observation-vertex' },
    TEMPORAL: { symbol: '▼', frequency: 432, handler: 'temporal-vertex' },
    PATTERN: { symbol: '▲', frequency: 528, handler: 'pattern-vertex' },
};
/**
 * Get handler name from geometric symbol
 */
export function getHandlerBySymbol(symbol) {
    const route = Object.values(GEOMETRIC_ROUTES).find(r => r.symbol === symbol);
    return route?.handler || null;
}
/**
 * Get symbol from stage
 */
export function getSymbolByStage(stage) {
    return GEOMETRIC_ROUTES[stage].symbol;
}
/**
 * Validate that data is at the correct stage for processing
 */
export function validateStageTransition(currentStage, nextStage) {
    const stages = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
    const currentIndex = stages.indexOf(currentStage);
    const nextIndex = stages.indexOf(nextStage);
    // Can only move forward one stage at a time
    return nextIndex === currentIndex + 1;
}
/**
 * Get all files with specific geometric router symbol
 * Useful for finding all handlers for a specific stage
 */
export function extractGeometricRouter(fileContent) {
    const match = fileContent.match(/@geometric-router\s+([●▼▲◼◻🔷🎭🧠👑])/);
    return match ? match[1] : null;
}
