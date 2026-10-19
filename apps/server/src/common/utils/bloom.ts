import * as crypto from 'crypto';

export class BloomFilter {
  private bitArray: Uint8Array;
  private size: number;

  constructor(sizeInBits: number = 1_000_000) {
    this.size = sizeInBits;
    // 1 bit per flag
    // 1,000,000 bits only requires ~125 KB of memory
    this.bitArray = new Uint8Array(Math.ceil(sizeInBits / 8));
  }

  private hash1(data: string): number {
    const hash = crypto.createHash('md5').update(data).digest();
    return hash.readUInt32BE(0) % this.size;
  }

  private hash2(data: string): number {
    const hash = crypto.createHash('sha1').update(data).digest();
    return hash.readUInt32BE(0) % this.size;
  }

  private hash3(data: string): number {
    const hash = crypto.createHash('sha256').update(data).digest();
    return hash.readUInt32BE(0) % this.size;
  }

  add(data: string): void {
    const normalized = data.trim().toLowerCase();
    this.setBit(this.hash1(normalized));
    this.setBit(this.hash2(normalized));
    this.setBit(this.hash3(normalized));
  }

  // Returns true if item MIGHT exist, false if item DEFINITELY DOES NOT exist.
  has(data: string): boolean {
    const normalized = data.trim().toLowerCase();
    return (
      this.getBit(this.hash1(normalized)) &&
      this.getBit(this.hash2(normalized)) &&
      this.getBit(this.hash3(normalized))
    );
  }

  private setBit(index: number): void {
    const byteIndex = Math.floor(index / 8);
    const bitOffset = index % 8;
    this.bitArray[byteIndex] |= 1 << bitOffset;
  }

  private getBit(index: number): boolean {
    const byteIndex = Math.floor(index / 8);
    const bitOffset = index % 8;
    return (this.bitArray[byteIndex] & (1 << bitOffset)) !== 0;
  }
}
