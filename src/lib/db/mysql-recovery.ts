import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resetDbConnection } from './client';

const execFileAsync = promisify(execFile);
const MYSQL_RESTART_COMMAND = '/usr/local/sbin/ncku-study-next-restart-mysql';
const MYSQL_UNAVAILABLE_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ECONNABORTED',
  'ETIMEDOUT',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'PROTOCOL_CONNECTION_LOST',
  'ER_CON_COUNT_ERROR',
  'ER_SERVER_SHUTDOWN',
]);

let recoveryInFlight: Promise<void> | undefined;

function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('code' in error)) return undefined;

  const { code } = error as { code?: unknown };
  return typeof code === 'string' ? code : undefined;
}

function isMysqlUnavailable(error: unknown): boolean {
  const code = getErrorCode(error);
  if (code && MYSQL_UNAVAILABLE_CODES.has(code)) return true;

  const message = error instanceof Error ? error.message : '';
  return /ECONNREFUSED|ECONNRESET|ETIMEDOUT|PROTOCOL_CONNECTION_LOST|server has gone away/i.test(message);
}

function isRecoveryEnabled(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.MYSQL_AUTO_RECOVERY !== 'false';
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function recoverLocalMysql(): Promise<void> {
  if (!recoveryInFlight) {
    recoveryInFlight = (async () => {
      try {
        await resetDbConnection();
      } catch {
        // The old pool may already be disconnected; the retry receives a new pool.
      }

      try {
        await execFileAsync('sudo', ['-n', MYSQL_RESTART_COMMAND], { timeout: 15_000 });
      } catch {
        // Always perform the requested three-second wait and one retry. The retry
        // returns the actual database error if MySQL remains unavailable.
      }

      await delay(3_000);
    })().finally(() => {
      recoveryInFlight = undefined;
    });
  }

  await recoveryInFlight;
}

export async function withLocalMysqlRecovery<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isRecoveryEnabled() || !isMysqlUnavailable(error)) throw error;

    await recoverLocalMysql();
    return operation();
  }
}
