/**
 * 精簡版 QR Code 產生器（byte 模式，自動選版本）
 * 移植自 Project Nayuki QR-Code-generator（MIT License），
 * 原專案未引入 qrcode 套件，故內嵌此最小實作供綁定頁渲染。
 */

type Ecc = { ordinal: number; formatBits: number };

const LOW: Ecc = { ordinal: 0, formatBits: 1 };
const MEDIUM: Ecc = { ordinal: 1, formatBits: 0 };
// const QUARTILE: Ecc = { ordinal: 2, formatBits: 3 };
// const HIGH: Ecc = { ordinal: 3, formatBits: 2 };

const MIN_VERSION = 1;
const MAX_VERSION = 40;
const PENALTY_N1 = 3;
const PENALTY_N2 = 3;
const PENALTY_N3 = 40;
const PENALTY_N4 = 10;

const ECC_CODEWORDS_PER_BLOCK: number[][] = [
  [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
  [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
];

const NUM_ERROR_CORRECTION_BLOCKS: number[][] = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
  [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
];

function getNumRawDataModules(ver: number): number {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}

function getNumDataCodewords(ver: number, ecl: Ecc): number {
  return (
    Math.floor(getNumRawDataModules(ver) / 8) -
    ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] *
      NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver]
  );
}

// 伽羅瓦域乘法
function reedSolomonMultiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function reedSolomonComputeDivisor(degree: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < degree - 1; i++) result.push(0);
  result.push(1);
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = reedSolomonMultiply(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = reedSolomonMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonComputeRemainder(data: number[], divisor: number[]): number[] {
  const result = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ (result.shift() as number);
    result.push(0);
    divisor.forEach((coef, i) => {
      result[i] ^= reedSolomonMultiply(coef, factor);
    });
  }
  return result;
}

class QrSegment {
  constructor(
    public readonly mode: number,
    public readonly numChars: number,
    public readonly bitData: number[]
  ) {}

  static makeBytes(data: number[]): QrSegment {
    const bb: number[] = [];
    for (const b of data) appendBits(b, 8, bb);
    return new QrSegment(0x4, data.length, bb);
  }
}

function appendBits(val: number, len: number, bb: number[]): void {
  for (let i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1);
}

function getTotalBits(seg: QrSegment, version: number): number {
  // byte 模式字元計數位元數
  const ccbits = version <= 9 ? 8 : 16;
  return 4 + ccbits + seg.bitData.length;
}

class QrCodeModel {
  public readonly size: number;
  private readonly modules: boolean[][] = [];
  private readonly isFunction: boolean[][] = [];

  constructor(
    public readonly version: number,
    public readonly errorCorrectionLevel: Ecc,
    dataCodewords: number[],
    public readonly mask: number
  ) {
    this.size = version * 4 + 17;
    const row: boolean[] = [];
    for (let i = 0; i < this.size; i++) row.push(false);
    for (let i = 0; i < this.size; i++) {
      this.modules.push(row.slice());
      this.isFunction.push(row.slice());
    }
    this.drawFunctionPatterns();
    const allCodewords = this.addEccAndInterleave(dataCodewords);
    this.drawCodewords(allCodewords);
    const realMask = this.handleConstructorMasking(mask);
    (this as any).mask = realMask;
  }

  public getModule(x: number, y: number): boolean {
    return (
      x >= 0 && x < this.size && y >= 0 && y < this.size && this.modules[y][x]
    );
  }

  private setFunctionModule(x: number, y: number, isDark: boolean): void {
    this.modules[y][x] = isDark;
    this.isFunction[y][x] = true;
  }

  private drawFunctionPatterns(): void {
    for (let i = 0; i < this.size; i++) {
      this.setFunctionModule(6, i, i % 2 === 0);
      this.setFunctionModule(i, 6, i % 2 === 0);
    }
    this.drawFinderPattern(3, 3);
    this.drawFinderPattern(this.size - 4, 3);
    this.drawFinderPattern(3, this.size - 4);
    const alignPatPos = this.getAlignmentPatternPositions();
    const numAlign = alignPatPos.length;
    for (let i = 0; i < numAlign; i++) {
      for (let j = 0; j < numAlign; j++) {
        if (
          !(
            (i === 0 && j === 0) ||
            (i === 0 && j === numAlign - 1) ||
            (i === numAlign - 1 && j === 0)
          )
        ) {
          this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
        }
      }
    }
    this.drawFormatBits(0);
    this.drawVersion();
  }

  private drawFormatBits(mask: number): void {
    const data = (this.errorCorrectionLevel.formatBits << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i++)
      this.setFunctionModule(8, i, ((bits >>> i) & 1) !== 0);
    this.setFunctionModule(8, 7, ((bits >>> 6) & 1) !== 0);
    this.setFunctionModule(8, 8, ((bits >>> 7) & 1) !== 0);
    this.setFunctionModule(7, 8, ((bits >>> 8) & 1) !== 0);
    for (let i = 9; i < 15; i++)
      this.setFunctionModule(14 - i, 8, ((bits >>> i) & 1) !== 0);
    for (let i = 0; i < 8; i++)
      this.setFunctionModule(this.size - 1 - i, 8, ((bits >>> i) & 1) !== 0);
    for (let i = 8; i < 15; i++)
      this.setFunctionModule(8, this.size - 15 + i, ((bits >>> i) & 1) !== 0);
    this.setFunctionModule(8, this.size - 8, true);
  }

  private drawVersion(): void {
    if (this.version < 7) return;
    let rem = this.version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (this.version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const color = ((bits >>> i) & 1) !== 0;
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.setFunctionModule(a, b, color);
      this.setFunctionModule(b, a, color);
    }
  }

  private drawFinderPattern(x: number, y: number): void {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) {
          this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4);
        }
      }
    }
  }

  private drawAlignmentPattern(x: number, y: number): void {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.setFunctionModule(
          x + dx,
          y + dy,
          Math.max(Math.abs(dx), Math.abs(dy)) !== 1
        );
      }
    }
  }

  private getAlignmentPatternPositions(): number[] {
    if (this.version === 1) return [];
    const numAlign = Math.floor(this.version / 7) + 2;
    const step =
      this.version === 32
        ? 26
        : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
    const result: number[] = [6];
    for (
      let pos = this.size - 7;
      result.length < numAlign;
      pos -= step
    ) {
      result.splice(1, 0, pos);
    }
    return result;
  }

  private addEccAndInterleave(data: number[]): number[] {
    const ver = this.version;
    const ecl = this.errorCorrectionLevel;
    const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
    const blockEccLen = ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
    const rawCodewords = Math.floor(getNumRawDataModules(ver) / 8);
    const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
    const shortBlockLen = Math.floor(rawCodewords / numBlocks);
    const blocks: number[][] = [];
    const rsDiv = reedSolomonComputeDivisor(blockEccLen);
    for (let i = 0, k = 0; i < numBlocks; i++) {
      const dat = data.slice(
        k,
        k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1)
      );
      k += dat.length;
      const ecc = reedSolomonComputeRemainder(dat, rsDiv);
      if (i < numShortBlocks) dat.push(0);
      blocks.push(dat.concat(ecc));
    }
    const result: number[] = [];
    for (let i = 0; i < blocks[0].length; i++) {
      blocks.forEach((block, j) => {
        if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
          result.push(block[i]);
        }
      });
    }
    return result;
  }

  private drawCodewords(data: number[]): void {
    let i = 0;
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? this.size - 1 - vert : vert;
          if (!this.isFunction[y][x] && i < data.length * 8) {
            this.modules[y][x] = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
            i++;
          }
        }
      }
    }
  }

  private applyMask(mask: number): void {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let invert: boolean;
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break;
          case 1: invert = y % 2 === 0; break;
          case 2: invert = x % 3 === 0; break;
          case 3: invert = (x + y) % 3 === 0; break;
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
          case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          case 7: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          default: throw new Error("mask error");
        }
        if (!this.isFunction[y][x] && invert) {
          this.modules[y][x] = !this.modules[y][x];
        }
      }
    }
  }

  private handleConstructorMasking(mask: number): number {
    let chosen = mask;
    if (chosen === -1) {
      let minPenalty = Infinity;
      for (let i = 0; i < 8; i++) {
        this.applyMask(i);
        this.drawFormatBits(i);
        const penalty = this.getPenaltyScore();
        if (penalty < minPenalty) {
          chosen = i;
          minPenalty = penalty;
        }
        this.applyMask(i);
      }
    }
    this.applyMask(chosen);
    this.drawFormatBits(chosen);
    return chosen;
  }

  private getPenaltyScore(): number {
    let result = 0;
    const size = this.size;
    const mod = this.modules;
    for (let y = 0; y < size; y++) {
      let runColor = false;
      let runX = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];
      for (let x = 0; x < size; x++) {
        if (mod[y][x] === runColor) {
          runX++;
          if (runX === 5) result += PENALTY_N1;
          else if (runX > 5) result++;
        } else {
          this.finderPenaltyAddHistory(runX, runHistory);
          if (!runColor)
            result +=
              this.finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
          runColor = mod[y][x];
          runX = 1;
        }
      }
      result +=
        this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) *
        PENALTY_N3;
    }
    for (let x = 0; x < size; x++) {
      let runColor = false;
      let runY = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];
      for (let y = 0; y < size; y++) {
        if (mod[y][x] === runColor) {
          runY++;
          if (runY === 5) result += PENALTY_N1;
          else if (runY > 5) result++;
        } else {
          this.finderPenaltyAddHistory(runY, runHistory);
          if (!runColor)
            result +=
              this.finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
          runColor = mod[y][x];
          runY = 1;
        }
      }
      result +=
        this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) *
        PENALTY_N3;
    }
    for (let y = 0; y < size - 1; y++) {
      for (let x = 0; x < size - 1; x++) {
        const color = mod[y][x];
        if (
          color === mod[y][x + 1] &&
          color === mod[y + 1][x] &&
          color === mod[y + 1][x + 1]
        )
          result += PENALTY_N2;
      }
    }
    let dark = 0;
    for (const rowArr of mod) dark += rowArr.reduce((s, c) => s + (c ? 1 : 0), 0);
    const total = size * size;
    const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
    result += k * PENALTY_N4;
    return result;
  }

  private finderPenaltyCountPatterns(runHistory: number[]): number {
    const n = runHistory[1];
    const core =
      n > 0 &&
      runHistory[2] === n &&
      runHistory[3] === n * 3 &&
      runHistory[4] === n &&
      runHistory[5] === n;
    return (
      (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) +
      (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0)
    );
  }

  private finderPenaltyTerminateAndCount(
    currentRunColor: boolean,
    currentRunLength: number,
    runHistory: number[]
  ): number {
    let runLen = currentRunLength;
    if (currentRunColor) {
      this.finderPenaltyAddHistory(runLen, runHistory);
      runLen = 0;
    }
    runLen += this.size;
    this.finderPenaltyAddHistory(runLen, runHistory);
    return this.finderPenaltyCountPatterns(runHistory);
  }

  private finderPenaltyAddHistory(currentRunLength: number, runHistory: number[]): void {
    let runLen = currentRunLength;
    if (runHistory[0] === 0) runLen += this.size;
    runHistory.pop();
    runHistory.unshift(runLen);
  }

  static encodeSegments(
    segs: QrSegment[],
    ecl: Ecc,
    minVersion = MIN_VERSION,
    maxVersion = MAX_VERSION,
    mask = -1
  ): QrCodeModel {
    let version: number;
    let dataUsedBits = 0;
    for (version = minVersion; ; version++) {
      const dataCapacityBits =
        getNumDataCodewords(version, ecl) * 8;
      const usedBits = segs.reduce(
        (sum, seg) => sum + getTotalBits(seg, version),
        0
      );
      if (usedBits <= dataCapacityBits) {
        dataUsedBits = usedBits;
        break;
      }
      if (version >= maxVersion) throw new Error("資料過長，無法產生 QR Code");
    }
    const bb: number[] = [];
    for (const seg of segs) {
      appendBits(seg.mode, 4, bb);
      appendBits(seg.numChars, version <= 9 ? 8 : 16, bb);
      for (const b of seg.bitData) bb.push(b);
    }
    const dataCapacityBits = getNumDataCodewords(version, ecl) * 8;
    appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
    appendBits(0, (8 - (bb.length % 8)) % 8, bb);
    for (let padByte = 0xec; bb.length < dataCapacityBits; padByte ^= 0xec ^ 0x11)
      appendBits(padByte, 8, bb);
    const dataCodewords: number[] = [];
    while (dataCodewords.length * 8 < bb.length) dataCodewords.push(0);
    bb.forEach((b, i) => (dataCodewords[i >>> 3] |= b << (7 - (i & 7))));
    void dataUsedBits;
    return new QrCodeModel(version, ecl, dataCodewords, mask);
  }
}

function utf8ToBytes(str: string): number[] {
  const out: number[] = [];
  const encoded = encodeURIComponent(str);
  for (let i = 0; i < encoded.length; i++) {
    if (encoded[i] === "%") {
      out.push(parseInt(encoded.substr(i + 1, 2), 16));
      i += 2;
    } else {
      out.push(encoded.charCodeAt(i));
    }
  }
  return out;
}

/** 取得 QR Code 的模組布林矩陣 */
export function generateQrMatrix(text: string): boolean[][] {
  const seg = QrSegment.makeBytes(utf8ToBytes(text));
  const qr = QrCodeModel.encodeSegments([seg], MEDIUM, MIN_VERSION, MAX_VERSION, -1);
  void LOW;
  const matrix: boolean[][] = [];
  for (let y = 0; y < qr.size; y++) {
    const rowArr: boolean[] = [];
    for (let x = 0; x < qr.size; x++) rowArr.push(qr.getModule(x, y));
    matrix.push(rowArr);
  }
  return matrix;
}

/** 把 QR 矩陣畫到 canvas，回傳 dataURL */
export function renderQrToDataUrl(text: string, size = 500, margin = 4): string {
  const matrix = generateQrMatrix(text);
  const count = matrix.length;
  const cell = Math.floor(size / (count + margin * 2));
  const realSize = cell * (count + margin * 2);
  const canvas = document.createElement("canvas");
  canvas.width = realSize;
  canvas.height = realSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, realSize, realSize);
  ctx.fillStyle = "#000000";
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (matrix[y][x]) {
        ctx.fillRect((x + margin) * cell, (y + margin) * cell, cell, cell);
      }
    }
  }
  return canvas.toDataURL("image/png");
}
