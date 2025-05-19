declare module 'three-msdf-text-utils' {
  import {
    BufferGeometry,
    Material,
    Uniform,
    Color,
    DoubleSide,
    ShaderMaterial,
    Side,
    Vector2,
  } from 'three'

  /** Options for configuring text layout and rendering */
  interface TextLayoutOptions {
    /** The text content to render */
    text: string
    /** Maximum width of the text block in pixels */
    width?: number
    /** Text wrapping mode:
     * - 'pre': maintain spacing
     * - 'nowrap': collapse whitespace but only break on newline characters
     * Default: normal word-wrap behaviour (collapse whitespace, break at width or newlines)
     */
    mode?: 'pre' | 'nowrap'
    /** Text alignment within the block. Default: 'left' */
    align?: 'left' | 'center' | 'right'
    /** Additional spacing between letters in pixels. Default: 0 */
    letterSpacing?: number
    /** Height of each line in pixels. Default: font.common.lineHeight */
    lineHeight?: number
    /** Number of spaces to use for a tab character. Default: 4 */
    tabSize?: number
    /** Starting index into the text to layout. Default: 0 */
    start?: number
    /** Ending index (exclusive) into the text to layout. Default: text.length */
    end?: number
  }

  /** Contains metrics and layout information for rendered text */
  interface TextLayout {
    /** Total width of the text block */
    width: number
    /** Total height of the text block */
    height: number
    /** Maximum descender height */
    descender: number
    /** Maximum ascender height */
    ascender: number
    /** x-height of the font */
    xHeight: number
    /** Baseline position */
    baseline: number
    /** Cap height of the font */
    capHeight: number
    /** Height of each line */
    lineHeight: number
    /** Total number of lines */
    linesTotal: number
    /** Total number of letters */
    lettersTotal: number
    /** Array of glyph information for each character */
    glyphs: Array<{
      /** Line number this glyph belongs to */
      line: number
      /** Position of the glyph */
      position: Vector2
      /** Index of the glyph in the text */
      index: number
      /** Raw glyph data from the font */
      data: any
    }>
  }

  /** Geometry class for MSDF text rendering */
  export class MSDFTextGeometry extends BufferGeometry {
    /**
     * Creates a new MSDF text geometry
     * @param options Configuration options for the text geometry
     */
    constructor(options: TextLayoutOptions & { font: any })

    /** Current text layout information */
    layout: TextLayout

    /** Array of visible glyphs that align with the vertex data */
    visibleGlyphs: Array<{
      line: number
      position: Vector2
      index: number
      data: any
    }>

    /**
     * Updates the geometry with new text or options
     * @param options New text content or layout options
     */
    update(options: TextLayoutOptions | string): void
  }

  /** Configuration options for MSDF text material */
  interface MSDFTextMaterialOptions {
    /** Which side of the geometry to render. Default: THREE.FrontSide */
    side?: Side
    /** Whether the material should be transparent. Default: true */
    transparent?: boolean
    /** Shader defines */
    defines?: {
      /** Enable optimizations for small text. Default: false */
      IS_SMALL?: boolean
    }
    /** WebGL extensions required by the material */
    extensions?: {
      /** Enable derivative functions in shaders. Default: true */
      derivatives?: boolean
    }
  }

  /** Uniforms available in the MSDF text material shader */
  interface MSDFTextMaterialUniforms {
    // Common uniforms
    /** Opacity of the text. Range: 0-1 */
    uOpacity: Uniform<number>
    /** Color of the text */
    uColor: Uniform<Color>
    /** MSDF texture atlas */
    uMap: Uniform<THREE.Texture | null>
    // Rendering uniforms
    /** Threshold for MSDF rendering. Default: 0.05 */
    uThreshold: Uniform<number>
    /** Alpha test value. Default: 0.01 */
    uAlphaTest: Uniform<number>
    // Stroke uniforms
    /** Color of the text stroke */
    uStrokeColor: Uniform<Color>
    /** Width of the stroke outset. Default: 0.0 */
    uStrokeOutsetWidth: Uniform<number>
    /** Width of the stroke inset. Default: 0.3 */
    uStrokeInsetWidth: Uniform<number>
    /** Additional custom uniforms */
    [key: string]: Uniform
  }

  /** Material class for MSDF text rendering */
  export class MSDFTextMaterial extends ShaderMaterial {
    /**
     * Creates a new MSDF text material
     * @param options Configuration options for the material
     */
    constructor(options?: MSDFTextMaterialOptions)
    /** Shader uniforms for controlling text appearance */
    uniforms: MSDFTextMaterialUniforms
  }

  /** Pre-configured uniform groups for custom shader materials */
  export const uniforms: {
    /** Common text rendering uniforms */
    common: {
      uOpacity: Uniform<number>
      uColor: Uniform<Color>
      uMap: Uniform<THREE.Texture | null>
    }
    /** MSDF rendering uniforms */
    rendering: {
      uThreshold: Uniform<number>
      uAlphaTest: Uniform<number>
    }
    /** Text stroke uniforms */
    strokes: {
      uStrokeColor: Uniform<Color>
      uStrokeOutsetWidth: Uniform<number>
      uStrokeInsetWidth: Uniform<number>
    }
  }
}
