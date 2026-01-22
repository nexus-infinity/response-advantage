/**
 * 📜 Chronicle Writer - FIELD Event Log
 *
 * Logs all geometric stage transitions to Chronicle for:
 * - Audit trail
 * - Debugging
 * - Pattern analysis
 * - Wisdom extraction
 *
 * @geometric-router 📜
 * @utility chronicle
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
/**
 * Get Chronicle path
 * Defaults to ~/FIELD/Chronicle or local .chronicle directory
 */
function getChroniclePath() {
    const homeField = path.join(os.homedir(), 'FIELD', 'Chronicle');
    const localChronicle = path.join(process.cwd(), '.chronicle');
    // Check if ~/FIELD/Chronicle exists
    if (fs.existsSync(homeField)) {
        return homeField;
    }
    // Otherwise use local .chronicle
    if (!fs.existsSync(localChronicle)) {
        fs.mkdirSync(localChronicle, { recursive: true });
    }
    return localChronicle;
}
/**
 * Write entry to Chronicle
 */
export async function writeChronicle(entry) {
    const timestamp = entry.timestamp || new Date().toISOString();
    const chroniclePath = getChroniclePath();
    // Create dated log file
    const date = timestamp.split('T')[0];
    const logFile = path.join(chroniclePath, `${date}.jsonl`);
    // Create complete entry
    const completeEntry = {
        ...entry,
        timestamp,
    };
    // Append to JSONL file (async)
    const line = JSON.stringify(completeEntry) + '\n';
    try {
        await fs.promises.appendFile(logFile, line, 'utf-8');
    }
    catch (error) {
        console.error('Failed to write to Chronicle:', error);
        // Don't throw - Chronicle logging should never break the pipeline
    }
}
/**
 * Read Chronicle entries for a case
 */
export async function readChronicle(caseId) {
    const chroniclePath = getChroniclePath();
    const entries = [];
    try {
        const files = fs.readdirSync(chroniclePath);
        for (const file of files) {
            if (!file.endsWith('.jsonl'))
                continue;
            const content = fs.readFileSync(path.join(chroniclePath, file), 'utf-8');
            const lines = content.split('\n').filter(l => l.trim());
            for (const line of lines) {
                try {
                    const entry = JSON.parse(line);
                    if (entry.caseId === caseId) {
                        entries.push(entry);
                    }
                }
                catch {
                    // Skip invalid lines
                }
            }
        }
    }
    catch (error) {
        console.error('Failed to read Chronicle:', error);
    }
    return entries.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
}
