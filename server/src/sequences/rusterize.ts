/* eslint-disable @typescript-eslint/camelcase */
import fetch from 'node-fetch';
import Mimetypes from './mimetypes';
import { RESOLUTION } from './rasterisationConstants';

export interface RusterizationData {
  matrices: string[];
  stepLength: number;
  width: number;
  height: number;
  length: number;
  duration: number;
  numChunks: number;
  maxChunkSize: number;
  bitDepth: number;
}

const typeMap = {
  [Mimetypes.GIF]: 'gif',
  [Mimetypes.JPEG]: 'jpeg',
  [Mimetypes.PNG]: 'png',
};

async function rusterize(
  buffer: Buffer,
  mimetype: Mimetypes,
  bitDepth: number,
): Promise<RusterizationData> {
  const rusterizerUrl = process.env.RUSTERIZER_URL;
  const format = typeMap[mimetype];
  return fetch(
    `${rusterizerUrl}?format=${format}&bit_depth=${bitDepth}&max_width=${RESOLUTION}`,
    {
      method: 'POST',
      body: buffer,
    },
  )
    .then(r => r.json())
    .then(
      ({
        matrices,
        step_length,
        width,
        height,
        length,
        duration,
        num_chunks,
        max_chunk_size,
        bit_depth,
      }) => ({
        matrices,
        stepLength: step_length,
        width,
        height,
        length,
        duration,
        numChunks: num_chunks,
        maxChunkSize: max_chunk_size,
        bitDepth: bit_depth,
      }),
    );
}

export default rusterize;
