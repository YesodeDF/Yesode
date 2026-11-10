import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface MediaInfoResult {
  title: string;
  duration: number;
  thumbnail?: string;
  uploader?: string;
}

export interface MediaDownloadResult {
  filepath: string;
  filename: string;
  title: string;
  size: number;
}

export class YtDlpExtractorService {
  private static readonly PYTHON_SCRIPT_PATH = path.resolve(__dirname, 'ytdlp_engine.py');

  /**
   * Extrai metadados do vídeo (título, duração, thumbnail) sem efetuar download.
   */
  public static async getInfo(url: string): Promise<MediaInfoResult> {
    return new Promise((resolve, reject) => {
      const child = spawn('python', [this.PYTHON_SCRIPT_PATH, 'info', url], {
        windowsHide: true,
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Falha ao obter informações do vídeo: ${stderr || stdout}`));
        }
        try {
          // Localiza a última linha JSON válida do stdout
          const lines = stdout.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const parsed = JSON.parse(lastLine);
          if (parsed.error) {
            return reject(new Error(parsed.error));
          }
          resolve(parsed);
        } catch (err: any) {
          reject(new Error(`Resposta inválida do motor de mídia: ${err.message}`));
        }
      });
    });
  }

  /**
   * Executa o download real da mídia no formato e perfil solicitados, retornando o arquivo em disco.
   */
  public static async download(
    url: string,
    format: string = 'video_muxed',
    profile: string = 'compatibility'
  ): Promise<MediaDownloadResult> {
    return new Promise((resolve, reject) => {
      const tempDir = path.join(os.tmpdir(), 'yesode_downloads');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const outId = `ys_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const child = spawn('python', [
        this.PYTHON_SCRIPT_PATH,
        'download',
        url,
        format,
        profile,
        tempDir,
        outId,
      ], {
        windowsHide: true,
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Falha no download da mídia: ${stderr || stdout}`));
        }
        try {
          const lines = stdout.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const parsed = JSON.parse(lastLine);
          if (parsed.error) {
            return reject(new Error(parsed.error));
          }
          resolve(parsed);
        } catch (err: any) {
          reject(new Error(`Erro ao processar resultado do download: ${err.message}`));
        }
      });
    });
  }
}

