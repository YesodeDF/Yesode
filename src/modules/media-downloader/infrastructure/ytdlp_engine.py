import os
import sys
import json
import yt_dlp

def find_ffmpeg_path():
    # 1. Checa repositório local yt-donwloader
    local_repo_ffmpeg = r"D:\Repos\yt-donwloader\ffmpeg.exe"
    if os.path.exists(local_repo_ffmpeg):
        return local_repo_ffmpeg

    # 2. Checa CWD ou bin/
    cwd_ffmpeg = os.path.join(os.getcwd(), "ffmpeg.exe")
    if os.path.exists(cwd_ffmpeg):
        return cwd_ffmpeg
    bin_ffmpeg = os.path.join(os.getcwd(), "bin", "ffmpeg.exe")
    if os.path.exists(bin_ffmpeg):
        return bin_ffmpeg

    # 3. PATH
    import shutil
    which_ffmpeg = shutil.which("ffmpeg") or shutil.which("ffmpeg.exe")
    if which_ffmpeg:
        return which_ffmpeg

    return None

def extract_info(url):
    opts = {
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'noplaylist': True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
        return {
            'title': info.get('title') or 'Mídia',
            'duration': info.get('duration') or 0,
            'thumbnail': info.get('thumbnail') or '',
            'uploader': info.get('uploader') or info.get('channel') or '',
        }

def download_media(url, format_type, profile, output_dir, out_id):
    ffmpeg_path = find_ffmpeg_path()
    extra_opts = {}

    if format_type == 'audio_only':
        format_str = 'bestaudio/best'
        merge_format = None
        postprocessors = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '320',
        }]
    elif format_type == 'video_only':
        format_str = 'bestvideo/best'
        merge_format = 'mp4'
        postprocessors = []
        if profile == 'compatibility':
            extra_opts['format_sort'] = ['vcodec:h264']
            extra_opts['postprocessor_args'] = {'merger': ['-an', '-c:v', 'copy']}
    elif format_type == 'gif':
        format_str = 'bestvideo/best'
        merge_format = None
        postprocessors = [{
            'key': 'FFmpegVideoConvertor',
            'preferedformat': 'gif',
        }]
        extra_opts['postprocessor_args'] = {
            'videoconvertor': ['-vf', 'fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse']
        }
    else:  # video_muxed
        if profile == 'studio_max':
            format_str = 'bestvideo+bestaudio/best'
            merge_format = 'mkv'
            postprocessors = []
        elif profile == 'whatsapp_4k':
            format_str = 'bestvideo+bestaudio/best'
            merge_format = 'mp4'
            postprocessors = []
            extra_opts['postprocessor_args'] = {'merger': ['-c:a', 'aac', '-b:a', '320k', '-movflags', '+faststart']}
        else:  # compatibility
            format_str = 'bestvideo+bestaudio/best'
            merge_format = 'mp4'
            postprocessors = []
            # Prioriza H.264 e áudio AAC/M4A com +faststart
            extra_opts['format_sort'] = ['vcodec:h264', 'acodec:m4a']
            extra_opts['postprocessor_args'] = {'merger': ['-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart']}

    out_tmpl = os.path.join(output_dir, f"{out_id}.%(ext)s")

    ydl_opts = {
        'format': format_str,
        'outtmpl': out_tmpl,
        'noplaylist': True,
        'nocheckcertificate': True,
        'quiet': False,
        'no_warnings': True,
        'concurrent_fragment_downloads': 16,
        'http_chunk_size': 10485760,
        **extra_opts
    }

    if merge_format:
        ydl_opts['merge_output_format'] = merge_format
    if postprocessors:
        ydl_opts['postprocessors'] = postprocessors
    if ffmpeg_path:
        ydl_opts['ffmpeg_location'] = ffmpeg_path

    # Tentativa 1: Sem cookies (rápido e direto)
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            return find_downloaded_file(output_dir, out_id, info)
    except Exception as e:
        err_msg = str(e)
        # Se for restrição de login ou bot, tenta cookies de navegadores locais
        for browser in ['firefox', 'chrome', 'edge']:
            try:
                retry_opts = dict(ydl_opts)
                retry_opts['cookiesfrombrowser'] = (browser,)
                with yt_dlp.YoutubeDL(retry_opts) as ydl_retry:
                    info = ydl_retry.extract_info(url, download=True)
                    return find_downloaded_file(output_dir, out_id, info)
            except Exception:
                continue
        raise e

def find_downloaded_file(output_dir, out_id, info):
    # Procura arquivo gerado com o prefixo out_id
    for f in os.listdir(output_dir):
        if f.startswith(out_id):
            full_path = os.path.join(output_dir, f)
            if os.path.isfile(full_path):
                return {
                    'filepath': full_path,
                    'filename': f,
                    'title': info.get('title') or 'media',
                    'size': os.path.getsize(full_path)
                }
    raise FileNotFoundError(f"Arquivo de saída com id {out_id} não encontrado em {output_dir}")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({'error': 'Argumentos insuficientes'}))
        sys.exit(1)

    command = sys.argv[1]

    if command == 'info':
        url = sys.argv[2]
        try:
            info = extract_info(url)
            print(json.dumps(info))
        except Exception as e:
            print(json.dumps({'error': str(e)}))
            sys.exit(1)

    elif command == 'download':
        url = sys.argv[2]
        format_type = sys.argv[3] if len(sys.argv) > 3 else 'video_muxed'
        profile = sys.argv[4] if len(sys.argv) > 4 else 'compatibility'
        out_dir = sys.argv[5] if len(sys.argv) > 5 else os.path.join(os.getcwd(), 'tmp')
        out_id = sys.argv[6] if len(sys.argv) > 6 else f"dl_{os.getpid()}"

        os.makedirs(out_dir, exist_ok=True)

        try:
            res = download_media(url, format_type, profile, out_dir, out_id)
            print(json.dumps(res))
        except Exception as e:
            print(json.dumps({'error': str(e)}))
            sys.exit(1)

