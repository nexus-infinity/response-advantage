#!/usr/bin/env node

/**
 * FIELD Alignment CLI
 * 
 * Ensures geometric alignment between:
 * 1. Local FIELD implementation (Mac Studio)
 * 2. GitHub repository (response-advantage)
 * 
 * Verifies S0→S7 process integrity across both systems.
 */

import * as fs from 'fs'
import * as path from 'path'

// Geometric Symbols
const SYMBOLS = {
  S0: '◻',
  S1: '🔷',
  S2: '🎭',
  S3_OBS: '●',
  S3_TEMP: '▼',
  S3_PATTERN: '▲',
  S4: '◼',
  S5: '🧠',
  S6: '●',
  S7: '👑'
}

// Frequencies (Hz)
const FREQUENCIES = {
  S0: 396,
  S3_OBS: 963,
  S3_TEMP: 432,
  S3_PATTERN: 528,
  S4: 741,
  S5: 852,
  S6: 963
}

interface GeometricStage {
  stage: string
  symbol: string
  frequency?: number
  implemented: boolean
  location: string
  notes: string[]
}

interface AlignmentReport {
  timestamp: string
  localPath: string
  githubRepo: string
  stages: GeometricStage[]
  alignmentScore: number
  issues: string[]
  recommendations: string[]
}

class FieldAlignmentChecker {
  private localFieldPath: string
  private repoPath: string
  
  constructor(localFieldPath?: string, repoPath?: string) {
    this.localFieldPath = localFieldPath || this.detectLocalFieldPath()
    this.repoPath = repoPath || this.findRepoRoot()
  }

  private findRepoRoot(): string {
    let currentDir = process.cwd()
    
    // Walk up until we find .git directory or reach root
    while (currentDir !== '/') {
      if (fs.existsSync(path.join(currentDir, '.git'))) {
        return currentDir
      }
      currentDir = path.dirname(currentDir)
    }
    
    // Fallback to current directory
    return process.cwd()
  }

  private detectLocalFieldPath(): string {
    // Check common FIELD locations on Mac Studio
    const possiblePaths = [
      path.join(process.env.HOME || '', 'FIELD'),
      path.join(process.env.HOME || '', 'Documents', 'FIELD'),
      path.join(process.env.HOME || '', '.field'),
      '/opt/field',
      '/usr/local/field'
    ]

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return p
      }
    }

    return path.join(process.env.HOME || '', 'FIELD') // Default
  }

  private checkStageImplementation(stageName: string): GeometricStage {
    const stage: GeometricStage = {
      stage: stageName,
      symbol: '',
      implemented: false,
      location: '',
      notes: []
    }

    switch (stageName) {
      case 'S0':
        stage.symbol = SYMBOLS.S0
        stage.frequency = FREQUENCIES.S0
        // Check for intake gateway in server.ts
        const serverPath = path.join(this.repoPath, 'dojo/src/api/server.ts')
        if (fs.existsSync(serverPath)) {
          const serverContent = fs.readFileSync(serverPath, 'utf-8')
          if (serverContent.includes('/api/v1/dialectic') && serverContent.includes('input')) {
            stage.implemented = true
            stage.location = 'dojo/src/api/server.ts:/api/v1/dialectic'
            stage.notes.push('✅ Intake endpoint exists')
          } else {
            stage.notes.push('❌ No intake endpoint found')
          }
        }
        
        // Check for local FIELD intake directory
        const intakePath = path.join(this.localFieldPath, '●OBI-WAN', '_intake')
        if (fs.existsSync(intakePath)) {
          stage.notes.push('✅ Local intake directory exists')
        } else {
          stage.notes.push('⚠️ Local intake directory not found')
        }
        break

      case 'S1':
        stage.symbol = SYMBOLS.S1
        // Check for coherence validation
        const s1ServerPath = path.join(this.repoPath, 'dojo/src/api/server.ts')
        if (fs.existsSync(s1ServerPath)) {
          const content = fs.readFileSync(s1ServerPath, 'utf-8')
          if (content.includes('confidence') || content.includes('coherence')) {
            stage.implemented = true
            stage.location = 'dojo/src/api/server.ts'
            const thresholdMatch = content.match(/confidence\s*>=?\s*(0\.\d+)/)
            if (thresholdMatch) {
              const threshold = parseFloat(thresholdMatch[1])
              if (threshold >= 0.70) {
                stage.notes.push(`✅ Coherence threshold: ${threshold}`)
              } else {
                stage.notes.push(`⚠️ Threshold too low: ${threshold} (should be ≥0.70)`)
              }
            }
          } else {
            stage.notes.push('❌ No coherence validation found')
          }
        }
        break

      case 'S2':
        stage.symbol = SYMBOLS.S2
        stage.notes.push('⏳ Vertex routing not yet implemented in GitHub')
        stage.notes.push('TODO: Implement signal splitting to ●▼▲ vertices')
        break

      case 'S3':
        stage.symbol = `${SYMBOLS.S3_OBS}${SYMBOLS.S3_TEMP}${SYMBOLS.S3_PATTERN}`
        stage.frequency = FREQUENCIES.S3_OBS
        // Check for pattern detection (represents one vertex)
        const s3ServerPath = path.join(this.repoPath, 'dojo/src/api/server.ts')
        if (fs.existsSync(s3ServerPath)) {
          const content = fs.readFileSync(s3ServerPath, 'utf-8')
          if (content.includes('detectCanKicking') || content.includes('CAN_KICKING_PATTERNS')) {
            stage.implemented = true
            stage.location = 'dojo/src/api/server.ts:detectCanKicking'
            stage.notes.push('✅ Pattern vertex (▲) implemented')
            stage.notes.push('⏳ Observation vertex (●) pending')
            stage.notes.push('⏳ Temporal vertex (▼) pending')
          }
        }
        break

      case 'S4':
        stage.symbol = SYMBOLS.S4
        stage.frequency = FREQUENCIES.S4
        stage.notes.push('⏳ DOJO synthesis apex not yet implemented')
        stage.notes.push('TODO: Converge vertex results at 741 Hz')
        break

      case 'S5':
        stage.symbol = SYMBOLS.S5
        stage.frequency = FREQUENCIES.S5
        stage.notes.push('⏳ Arkadaš translation not yet implemented')
        break

      case 'S6':
        stage.symbol = SYMBOLS.S6
        stage.frequency = FREQUENCIES.S6
        stage.notes.push('⏳ Validation loop (reverse gyro) not yet implemented')
        stage.notes.push('TODO: Implement reverse pass validation')
        break

      case 'S7':
        stage.symbol = SYMBOLS.S7
        const s7ServerPath = path.join(this.repoPath, 'dojo/src/api/server.ts')
        if (fs.existsSync(s7ServerPath)) {
          const content = fs.readFileSync(s7ServerPath, 'utf-8')
          if (content.includes('return c.json')) {
            stage.implemented = true
            stage.location = 'dojo/src/api/server.ts'
            stage.notes.push('✅ Response manifestation exists')
            stage.notes.push('⚠️ Needs wisdom seed metadata')
          }
        }
        break
    }

    return stage
  }

  public generateReport(): AlignmentReport {
    const stages = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'].map(
      s => this.checkStageImplementation(s)
    )

    const implementedCount = stages.filter(s => s.implemented).length
    const alignmentScore = (implementedCount / stages.length) * 100

    const issues: string[] = []
    const recommendations: string[] = []

    // Check for GEOMETRIC_SPEC.md
    const specPath = path.join(this.repoPath, 'GEOMETRIC_SPEC.md')
    if (!fs.existsSync(specPath)) {
      issues.push('Missing GEOMETRIC_SPEC.md in repository')
      recommendations.push('Create GEOMETRIC_SPEC.md to document canonical S0→S7 process')
    } else {
      recommendations.push('✅ GEOMETRIC_SPEC.md found - canonical specification exists')
    }

    // Check for shared geometric-core
    const geometricCorePath = path.join(this.repoPath, 'shared/geometric-core')
    if (fs.existsSync(geometricCorePath)) {
      recommendations.push('✅ Shared geometric-core found - use for implementation')
      const s4Path = path.join(geometricCorePath, 'typescript/src/s4-kings-chamber.ts')
      if (fs.existsSync(s4Path)) {
        recommendations.push('✅ S4 King\'s Chamber (spin reversal) implemented in geometric-core')
      }
    } else {
      recommendations.push('Create shared/geometric-core for S0→S7 implementation')
    }

    // Alignment score recommendations
    if (alignmentScore < 62.5) {
      issues.push('Below minimum viable geometry (62.5%)')
      recommendations.push('Implement at least S0, S1, S3, S4, S7 for minimum viability')
    } else if (alignmentScore < 87.5) {
      recommendations.push('Continue implementing remaining stages to achieve full alignment')
    }

    // Check local FIELD directory structure
    if (!fs.existsSync(this.localFieldPath)) {
      issues.push(`Local FIELD path not found: ${this.localFieldPath}`)
      recommendations.push('Set up local FIELD directory structure or specify with --local-path')
    }

    return {
      timestamp: new Date().toISOString(),
      localPath: this.localFieldPath,
      githubRepo: this.repoPath,
      stages,
      alignmentScore,
      issues,
      recommendations
    }
  }

  public printReport(report: AlignmentReport): void {
    console.log('\n' + '='.repeat(70))
    console.log('◼ FIELD GEOMETRIC ALIGNMENT REPORT')
    console.log('='.repeat(70))
    console.log(`Timestamp: ${report.timestamp}`)
    console.log(`Local FIELD: ${report.localPath}`)
    console.log(`GitHub Repo: ${report.githubRepo}`)
    console.log('')

    console.log('S0→S7 STAGE VERIFICATION:')
    console.log('-'.repeat(70))
    
    report.stages.forEach(stage => {
      const status = stage.implemented ? '✅' : '❌'
      const freqStr = stage.frequency ? ` (${stage.frequency} Hz)` : ''
      console.log(`\n${status} ${stage.stage} ${stage.symbol}${freqStr}`)
      if (stage.location) {
        console.log(`   Location: ${stage.location}`)
      }
      stage.notes.forEach(note => {
        console.log(`   ${note}`)
      })
    })

    console.log('\n' + '='.repeat(70))
    console.log(`GEOMETRIC ALIGNMENT SCORE: ${report.alignmentScore.toFixed(1)}%`)
    console.log(`(${report.stages.filter(s => s.implemented).length}/8 stages implemented)`)
    console.log('='.repeat(70))

    if (report.issues.length > 0) {
      console.log('\n⚠️  ISSUES:')
      report.issues.forEach(issue => console.log(`   - ${issue}`))
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:')
      report.recommendations.forEach(rec => console.log(`   - ${rec}`))
    }

    console.log('\n' + '='.repeat(70))
    
    if (report.alignmentScore >= 87.5) {
      console.log('✅ EXCELLENT: Systems are geometrically aligned')
    } else if (report.alignmentScore >= 62.5) {
      console.log('⚠️  PARTIAL: Minimum viable geometry achieved, continue implementation')
    } else {
      console.log('❌ CRITICAL: Below minimum viable geometry threshold')
    }
    
    console.log('='.repeat(70) + '\n')
  }

  public async syncToLocal(): Promise<void> {
    console.log('\n🔄 Syncing GitHub → Local FIELD...\n')
    
    // Ensure local FIELD directories exist
    const dirs = [
      path.join(this.localFieldPath),
      path.join(this.localFieldPath, '●OBI-WAN'),
      path.join(this.localFieldPath, '●OBI-WAN', '_intake'),
      path.join(this.localFieldPath, '◼DOJO'),
      path.join(this.localFieldPath, 'Chronicle')
    ]

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log(`✅ Created: ${dir}`)
      }
    }

    // Copy GEOMETRIC_SPEC.md to local FIELD
    const specPath = path.join(this.repoPath, 'GEOMETRIC_SPEC.md')
    if (fs.existsSync(specPath)) {
      const targetPath = path.join(this.localFieldPath, 'GEOMETRIC_SPEC.md')
      fs.copyFileSync(specPath, targetPath)
      console.log(`✅ Synced: GEOMETRIC_SPEC.md → ${targetPath}`)
    }

    console.log('\n✨ Local FIELD structure synchronized\n')
  }
}

// CLI Interface
function printUsage() {
  console.log(`
◼ FIELD Alignment CLI

Usage:
  field-alignment check [options]    Check geometric alignment
  field-alignment sync [options]     Sync GitHub → Local FIELD
  field-alignment help               Show this help

Options:
  --local-path <path>   Path to local FIELD directory
  --repo-path <path>    Path to GitHub repository
  --json                Output as JSON

Examples:
  field-alignment check
  field-alignment check --local-path ~/FIELD
  field-alignment sync
  field-alignment check --json > alignment-report.json

Geometric Stages (S0→S7):
  S0 ◻ Akron      (396 Hz)  - Intake/Sovereignty
  S1 🔷 Queen's            - Validation
  S2 🎭 Gallery            - Route
  S3 ●▼▲ Trident   (963/432/528 Hz) - Process
  S4 ◼ DOJO        (741 Hz)  - Synthesize
  S5 🧠 King's     (852 Hz)  - Translate
  S6 ● OBI-WAN     (963 Hz)  - Validate
  S7 👑 Crown              - Manifest
  `)
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printUsage()
    process.exit(0)
  }

  // Parse options
  let localPath: string | undefined
  let repoPath: string | undefined
  let jsonOutput = false

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--local-path' && args[i + 1]) {
      localPath = args[i + 1]
      i++
    } else if (args[i] === '--repo-path' && args[i + 1]) {
      repoPath = args[i + 1]
      i++
    } else if (args[i] === '--json') {
      jsonOutput = true
    }
  }

  const checker = new FieldAlignmentChecker(localPath, repoPath)

  switch (command) {
    case 'check': {
      const report = checker.generateReport()
      if (jsonOutput) {
        console.log(JSON.stringify(report, null, 2))
      } else {
        checker.printReport(report)
      }
      
      // Exit with error code if alignment is below minimum
      if (report.alignmentScore < 62.5) {
        process.exit(1)
      }
      break
    }

    case 'sync': {
      await checker.syncToLocal()
      console.log('Verifying alignment after sync...')
      const report = checker.generateReport()
      checker.printReport(report)
      break
    }

    default:
      console.error(`Unknown command: ${command}`)
      printUsage()
      process.exit(1)
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Error:', error.message)
    process.exit(1)
  })
}

export { FieldAlignmentChecker, AlignmentReport, GeometricStage }
