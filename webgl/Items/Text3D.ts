import {
  Mesh,
  Texture,
  Vector3,
  Color,
  DoubleSide,
  Matrix4,
  Group,
} from 'three'
import {
  MSDFTextGeometry,
  MSDFTextMaterial,
  type TextLayoutOptions,
} from 'three-msdf-text-utils'
import ExtendableItem from '~/webgl/Modules/Extendables/ExtendableItem'
import { type Font } from 'three/examples/jsm/Addons.js'
import Experience from '~/webgl/Experience'
import type ExtendableScene from '../Modules/Extendables/ExtendableScene'
import { getSizes } from '../Core/functions/getSizes'

type Text3DOptions = {
  position?: Vector3
  scale?: number
  font: Font
  atlas: Texture
  text: string
  width?: number
  align?: 'left' | 'center' | 'right'
  mode?: 'pre' | 'nowrap'
  color?: Color
} & TextLayoutOptions

export default class Text3D<
  T extends ExtendableScene<any>
> extends ExtendableItem<T> {
  // Public
  public position: Vector3
  public scale: number
  public mesh?: Mesh
  public geometry?: MSDFTextGeometry
  public material?: MSDFTextMaterial

  // Private
  #viewport: Experience['viewport']
  #options: Partial<Text3DOptions>

  /**
   * Constructor
   * @param options Options
   */
  constructor({
    font,
    text,
    atlas,
    position,
    scale,
    width = 2000,
    align = 'center',
    mode = 'nowrap',
    color = new Color(1, 0, 0),
    ...options
  }: Text3DOptions) {
    super()

    this.#viewport = this.experience.viewport

    // Public
    this.holdDuration = 2000
    this.position = position ?? new Vector3(0, 0, 0)
    this.scale = scale ?? 0.01

    // Private
    this.#options = {
      font,
      text,
      atlas,
      width,
      align,
      mode,
      color,
      ...options,
    }

    // Events
    this.on('load', () => this.#onLoad())
    this.on('resize', () => this.#onResize())
  }

  // --------------------------------
  // Events
  // --------------------------------

  /**
   * On load
   */
  #onLoad() {
    this.#setGeometry()
    this.#setMaterial()
    this.#setMesh()
  }

  // --------------------------------
  // Private methods
  // --------------------------------

  /**
   * Set geometry
   */
  #setGeometry() {
    if (!this.#options.text || !this.#options.font)
      throw new Error('Text and font are required')

    this.geometry = new MSDFTextGeometry({
      ...this.#options,
      font: this.#options.font.data,
      text: this.#options.text,
      width: this.#options.width,
      align: this.#options.align,
      mode: this.#options.mode,
    })

    // Get bounding box
    this.geometry.computeBoundingBox()
  }

  /**
   * Set material
   */
  #setMaterial() {
    this.material = new MSDFTextMaterial({
      side: DoubleSide,
      transparent: true,
    })

    // Set material uniforms
    this.material.uniforms.uMap.value = this.#options.atlas
    this.material.uniforms.uColor.value =
      this.#options.color ?? new Color(1, 0, 0)
  }

  /**
   * Set scale
   */
  #setScale() {
    return
    if (!this.mesh) return

    // Calculate a responsive scale based on viewport
    const ratio = Math.min(Math.max(this.#viewport.width, 400), 1400) / 1400
    const finalScale = this.scale * ratio

    // Apply scale uniformly
    this.mesh!.scale.set(finalScale, finalScale, finalScale)
  }

  /**
   * Set mesh
   */
  #setMesh() {
    if (!this.geometry || !this.material) return

    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.rotation.x = Math.PI
    this.mesh.position.copy(this.position)

    const group = new Group()
    group.add(this.mesh)

    this.#setScale()
    this.item.add(group)
  }

  /**
   * On resize
   */
  #onResize() {
    this.#setScale()
  }
}
