import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { TestCase, TestResult } from '../src/types';

export interface PythonRunResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
  timedOut: boolean;
}

export async function executePythonCode(code: string, stdinInput: string = ''): Promise<PythonRunResult> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'py-exec-'));
  const scriptPath = path.join(tmpDir, 'solution.py');
  
  // Wrap code with safety checks if needed (disable dangerous modules in isolated environment)
  const safeWrapper = `
import sys
# Restricted execution wrapper
${code}
`;

  fs.writeFileSync(scriptPath, safeWrapper, 'utf8');

  const startTime = Date.now();

  return new Promise((resolve) => {
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const child = spawn('python3', ['-u', scriptPath], {
      cwd: tmpDir,
      env: {
        PATH: process.env.PATH || '/usr/bin:/bin',
        PYTHONHASHSEED: '0',
        PYTHONDONTWRITEBYTECODE: '1'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGKILL');
      } catch {
        // ignore
      }
    }, 4000);

    if (stdinInput) {
      child.stdin.write(stdinInput);
    }
    child.stdin.end();

    child.stdout.on('data', (data) => {
      if (stdout.length < 32768) {
        stdout += data.toString();
      }
    });

    child.stderr.on('data', (data) => {
      if (stderr.length < 16384) {
        stderr += data.toString();
      }
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const executionTimeMs = Date.now() - startTime;
      
      // Clean up isolated directory
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {
        // ignore
      }

      resolve({
        stdout: stdout.trimEnd(),
        stderr: timedOut ? 'Execution Timed Out (Maximum 4 seconds exceeded)' : stderr.trimEnd(),
        exitCode: code,
        executionTimeMs,
        timedOut
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {
        // ignore
      }
      resolve({
        stdout: '',
        stderr: `Failed to invoke Python execution engine: ${err.message}`,
        exitCode: 1,
        executionTimeMs: Date.now() - startTime,
        timedOut: false
      });
    });
  });
}

function normalizeOutput(str: string): string {
  return str
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

export async function evaluateSubmissionAgainstTests(
  code: string,
  testCases: TestCase[]
): Promise<{
  allPassed: boolean;
  passCount: number;
  totalTests: number;
  totalTimeMs: number;
  testResults: TestResult[];
}> {
  const results: TestResult[] = [];
  let totalTimeMs = 0;
  let allPassed = true;

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    const execRes = await executePythonCode(code, test.input);
    totalTimeMs += execRes.executionTimeMs;

    const actual = normalizeOutput(execRes.stdout);
    const expected = normalizeOutput(test.expectedOutput);
    const isPassed = !execRes.timedOut && execRes.exitCode === 0 && actual === expected;

    if (!isPassed) {
      allPassed = false;
    }

    results.push({
      testIndex: i + 1,
      passed: isPassed,
      input: test.isHidden ? '[Hidden Test Case]' : test.input,
      expectedOutput: test.isHidden ? '[Hidden Test Case]' : expected,
      actualOutput: isPassed ? actual : (execRes.stderr || actual),
      error: execRes.stderr || undefined,
      isHidden: !!test.isHidden
    });
  }

  const passCount = results.filter(r => r.passed).length;
  return {
    allPassed,
    passCount,
    totalTests: testCases.length,
    totalTimeMs,
    testResults: results
  };
}
