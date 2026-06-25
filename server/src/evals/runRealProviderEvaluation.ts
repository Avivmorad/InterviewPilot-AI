import { geminiProvider } from '../ai/providers/geminiProvider.js'
import { groqProvider } from '../ai/providers/groqProvider.js'
import { runRealProviderEvaluation } from './realProviderEvaluation.js'

function getOutputPathFromArgs(args: string[]): string | undefined {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (!arg) {
      continue
    }

    if (arg === '--output' && args[index + 1]) {
      return args[index + 1]
    }

    if (arg.startsWith('--output=')) {
      return arg.slice('--output='.length)
    }
  }

  return process.env.EVAL_RESULTS_PATH?.trim() || undefined
}

const outputPath = getOutputPathFromArgs(process.argv.slice(2))

const report = await runRealProviderEvaluation({
  providers: [geminiProvider, groqProvider],
  outputPath,
})

console.log(JSON.stringify(report, null, 2))

if (
  report.comparison.inconclusiveCount > 0 ||
  Object.values(report.summaries).some(
    (summary) => summary.passedCaseCount !== summary.caseCount,
  )
) {
  process.exitCode = 1
}
