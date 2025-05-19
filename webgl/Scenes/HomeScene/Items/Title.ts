import { Texture, Vector3 } from 'three'
import ExtendableItem from '~/webgl/Modules/Extendables/ExtendableItem'
import type HomeScene from '../HomeScene'
import { type Font } from 'three/examples/jsm/Addons.js'
import Experience from '~/webgl/Experience'
import Text3D from '~/webgl/Items/Text3D'

export default class Title extends ExtendableItem<HomeScene> {
  // Public
  public $t: (key: string) => string

  /**
   * Constructor
   * @param options Options
   * @param options.position Position
   */
  constructor() {
    super()

    this.$t = Experience.i18n.t
    this.#setTitle()

    // On ready
    this.on('ready', () => this.#onReady())
  }

  #setTitle() {
    const font = this.resources.NexaHeavy as Font
    const atlas = this.resources.NexaHeavyAtlas as Texture

    this.components = {
      title1: new Text3D({
        font,
        text: this.$t('QUALITY_STANDARDS_TITLE_1'),
        atlas,
        position: new Vector3(0, 0.5, 0),
        align: 'center',
        mode: 'nowrap',
      }),
      title2: new Text3D({
        position: new Vector3(0, 0, 0),
        font,
        text: this.$t('QUALITY_STANDARDS_TITLE_2'),
        atlas,
        align: 'center',
        mode: 'nowrap',
      }),
      title3: new Text3D({
        font,
        text: this.$t('QUALITY_STANDARDS_TITLE_3'),
        atlas,
        position: new Vector3(0, -0.5, 0),
        align: 'center',
        mode: 'nowrap',
      }),
    }
  }

  // --------------------------------
  // Private methods
  // --------------------------------

  /**
   * On ready
   */
  #onReady() {
    const title1 = this.components.title1 as Text3D<HomeScene>
    const title2 = this.components.title2 as Text3D<HomeScene>
    const title3 = this.components.title3 as Text3D<HomeScene>

    // // Build boud
    // title1.geometry?.computeBoundingBox()
    // title2.geometry?.computeBoundingBox()
    // title3.geometry?.computeBoundingBox()

    // Get bounding box
    const boundingBox1 = title1.geometry?.boundingBox
    const boundingBox2 = title2.geometry?.boundingBox
    const boundingBox3 = title3.geometry?.boundingBox

    // Get the widths of the bounding boxes
    const width1 = (boundingBox1?.max.x ?? 0) - (boundingBox1?.min.x ?? 0)
    const width2 = (boundingBox2?.max.x ?? 0) - (boundingBox2?.min.x ?? 0)
    const width3 = (boundingBox3?.max.x ?? 0) - (boundingBox3?.min.x ?? 0)

    // Get the biggest width
    const biggestWidth = Math.max(width1, width2, width3)

    // Get the scales to apply to each
    const scale1 = biggestWidth / width1
    const scale2 = biggestWidth / width2
    const scale3 = biggestWidth / width3

    // Apply the scales
    title1.item?.scale.set(scale1, scale1, scale1)
    title2.item?.scale.set(scale2, scale2, scale2)
    title3.item?.scale.set(scale3, scale3, scale3)
  }
}
