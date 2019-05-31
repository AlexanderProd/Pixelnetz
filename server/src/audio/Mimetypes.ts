enum AudioMimetypes {
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',
}

export function getFileExtension(type: AudioMimetypes): string {
  switch (type) {
    case AudioMimetypes.MP3:
      return 'mp3';
    case AudioMimetypes.WAV:
      return 'wav';
    case AudioMimetypes.OGG:
    default:
      return 'ogg';
  }
}

export default AudioMimetypes;
